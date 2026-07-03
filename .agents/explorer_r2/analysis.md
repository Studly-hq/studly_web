# Audit and Verification Report: Quota Rollback Fix (R2)

## Summary of Findings
The Quota Rollback Fix (R2) successfully ensures that quota is safely rolled back without throwing unhandled exceptions when failures occur *before* the Response object is returned (e.g., during PPTX parsing or initial AI API invocation). However, if AI streaming fails mid-stream *after* the route returns a `Response` object, the quota is not rolled back and is leaked. 

---

## 1. Observation

### Codebase Locations and Snippets

#### A. `rollbackQuota` Implementation (`lucid/src/lib/quota.ts` lines 178-215)
```typescript
export async function rollbackQuota(
    userId: string,
    type: QuotaType
): Promise<void> {
    if (userId.startsWith("guest_")) {
        return;
    }

    const db = getAdminFirestore();
    const userRef = db.collection("users").doc(userId);

    await db.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists) return;

        const data = userDoc.data()!;
        const isPaid = data.plan_type === "pro" || data.plan_type === "premium";

        if (!isPaid && type === "upload") {
            const lifetimeUploads = (data.lifetime_upload_count as number) || 0;
            const dailyUploads = (data.daily_upload_count as number) || 0;

            transaction.update(userRef, {
                lifetime_upload_count: Math.max(0, lifetimeUploads - 1),
                daily_upload_count: Math.max(0, dailyUploads - 1),
            });
        } else {
            const countField = type === "upload" ? "daily_upload_count" : "hourly_op_count";
            const currentCount = (data[countField] as number) || 0;
            const lifetimeUploads = (data.lifetime_upload_count as number) || 0;

            transaction.update(userRef, {
                [countField]: Math.max(0, currentCount - 1),
                ...(type === "upload" && { lifetime_upload_count: Math.max(0, lifetimeUploads - 1) }),
            });
        }
    });
}
```

#### B. Upload Route Integration (`lucid/src/app/api/upload/route.ts`)
- **Quota Check & Flag Initialization (Lines 12, 32-48):**
  ```typescript
  let quotaChecked = false;
  ...
  if (batchIndex === 0) {
      const { allowed, resetAt } = await checkQuota(userId, "upload")
      ...
      quotaChecked = true;
  }
  ```
- **PPTX Parse Error Rollback (Lines 81-87):**
  ```typescript
  } catch (e) {
      console.error("[Upload API] PPTX Parse Error:", e)
      if (quotaChecked) {
          try { await rollbackQuota(userId, "upload"); } catch (err) { console.error("Rollback failed:", err); }
      }
      return NextResponse.json({ error: "Failed to parse PPTX" }, { status: 500 })
  }
  ```
- **General Route Catch & Rollback (Lines 101-110):**
  ```typescript
  } catch (error) {
      console.error("Upload processing error:", error)
      if (quotaChecked) {
          try { await rollbackQuota(userId, "upload"); } catch (err) { console.error("Rollback failed:", err); }
      }
      return NextResponse.json(
          { error: error instanceof Error ? error.message : "Failed to process document" },
          { status: 500 }
      )
  }
  ```
- **Stream Generation (Lines 202-214):**
  ```typescript
  try {
      const result = await customStreamText({ model: 'vision', messages });

      return new Response(result.textStream, {
          headers: {
              "Content-Type": "text/plain; charset=utf-8",
              "Transfer-Encoding": "chunked",
          }
      });
  } catch (err) {
      console.error("[Upload API Stream] Error:", err);
      throw err;
  }
  ```

#### C. Format Chunk Route Integration (`lucid/src/app/api/format-chunk/route.ts`)
- **Quota Check & Flag Initialization (Lines 9, 24-41):**
  ```typescript
  let quotaChecked = false;
  ...
  if (chunkIndex === 0) {
      const { checkQuota } = await import("@/lib/quota")
      const { allowed, resetAt } = await checkQuota(currentUserId, "upload")
      ...
      quotaChecked = true;
  }
  ```
- **General Route Catch & Rollback (Lines 125-134):**
  ```typescript
  } catch (error) {
      console.error("Format chunk error:", error)
      if (quotaChecked) {
          try { 
              const { rollbackQuota } = await import("@/lib/quota")
              await rollbackQuota(currentUserId, "upload") 
          } catch (err) { console.error("Rollback failed:", err) }
      }
      return NextResponse.json({ error: "Failed to format chunk" }, { status: 500 })
  }
  ```
- **Stream Generation (Lines 112-124):**
  ```typescript
  try {
      const result = await customStreamText({ model: 'vision', prompt });

      return new Response(result.textStream, {
          headers: {
              "Content-Type": "text/plain; charset=utf-8",
              "Transfer-Encoding": "chunked",
          }
      });
  } catch (err) {
      console.error("Format chunk failed:", err)
      throw err;
  }
  ```

---

## 2. Logic Chain

1. **Transaction Usage & Negative Prevention**: As observed in **A**, `rollbackQuota` invokes `db.runTransaction` to safely read the user document. It determines if the user is free/paid, retrieves current quota limits (`lifetime_upload_count`, `daily_upload_count`, or `hourly_op_count`), and executes `Math.max(0, count - 1)` before updating the document. This atomically guarantees that the rollback does not race with other operations and will never result in a negative quota count.
2. **Pre-Response Failure Handling**: 
   - In `upload/route.ts` (observed in **B**), if PPTX parsing throws an error, or if an error is thrown anywhere else in the `POST` try-catch block, the catches intercept the error. If `quotaChecked` is `true`, they run `rollbackQuota` under a separate try-catch block.
   - In `format-chunk/route.ts` (observed in **C**), any error in the outer block or rethrown from the inner streaming block is intercepted by the outer catch. If `quotaChecked` is `true`, it dynamically imports `rollbackQuota` and runs it under a separate try-catch block.
3. **Rollback Safety**: In all observed catch blocks in both routes, the call to `rollbackQuota` is safely wrapped in its own try-catch statement (e.g. `try { await rollbackQuota(...); } catch (err) { ... }`). Consequently, if Firestore becomes unavailable or the transaction fails during rollback, it will only log the failure (`"Rollback failed:"`) and return a standard `500` HTTP error, rather than throwing an unhandled exception that could crash the Node.js API process.
4. **Post-Response (Downstream) Failure Limitation**: 
   - When the `customStreamText` call returns successfully, the route immediately wraps the `textStream` in a `new Response` object and returns it to Next.js.
   - The route handler has fully resolved and returned at this stage. If the upstream provider experiences a failure *during* streaming (e.g., mid-stream disconnect, rate limit, content filtering mid-generation), the catch blocks inside the API routes can no longer be triggered.
   - Neither route registers callbacks (e.g. Vercel AI SDK's `onFinish` or customized transform streams with abort callbacks) to handle stream cancellation or downstream errors.
   - Thus, if streaming fails downstream, no rollback is triggered, resulting in a quota leak.

---

## 3. Caveats

- **Mock testing only**: The analysis was conducted through a strict read-only audit. Actual runtime behavior under network partitions or live database dropouts was simulated mentally through logic flow analysis rather than active chaos testing.
- **Provider-specific error events**: If the AI SDK triggers stream aborts in Next.js without raising node-level unhandled rejections, the server process remains safe, but the quota leak is confirmed to persist.

---

## 4. Conclusion & Pass/Fail Grade

### Audit Summary Table
| Requirement | Description | Status | Rationale |
|---|---|---|---|
| **R2.1** | `rollbackQuota` Implementation | **PASS** | Uses atomic Firestore transaction and protects against negative counts using `Math.max(0, count - 1)`. |
| **R2.2** | Integration in `upload/route.ts` | **PASS** | Correctly catches errors in PPTX parser and main flow, rolling back quota. |
| **R2.3** | Integration in `format-chunk/route.ts` | **PASS** | Correctly catches errors in chunk parsing and formatting, rolling back quota. |
| **R2.4.a** | Rollback Transaction Failure safety | **PASS** | Wrapped in try-catch in both API routes. Does not throw unhandled exceptions or crash. |
| **R2.4.b** | Downstream Stream Failure safety | **FAIL** | If streaming fails mid-generation after response is returned, the catch blocks never execute. Quota is leaked. |

### Overall Grade: PARTIAL PASS (PASS on safety and pre-response errors; FAIL on downstream mid-stream errors)
The fix meets the safety requirement of avoiding unhandled exceptions and successfully rolls back quota when parsing or initial LLM calls fail. However, it fails to protect against quota leaks when the LLM stream fails mid-stream after the response has been returned.

---

## 5. Verification Method

To verify the implementation behavior:
1. **Initial Failures Verification**:
   - Inspect files `lucid/src/app/api/upload/route.ts` (lines 81-87, 101-110) and `lucid/src/app/api/format-chunk/route.ts` (lines 125-134).
   - Verify that all invocations of `rollbackQuota` are wrapped in a `try/catch` block.
   - Trigger a PPTX parse error by uploading a corrupted file and verify that the user's `daily_upload_count` is decremented back to its original state.
2. **Rollback Failure Verification**:
   - Temporarily modify the Firestore client configuration to throw an error inside `rollbackQuota` (or simulate database offline).
   - Send a request that fails during PPTX parsing. Verify that the server logs `Rollback failed: [error]` and returns a `500` error to the client instead of crashing.
3. **Mid-stream Leak Verification**:
   - Send a request that succeeds initially but is aborted by the client mid-stream, or simulate a provider error midway through generation.
   - Observe that the user's `daily_upload_count` is NOT decremented, verifying the quota leak.
