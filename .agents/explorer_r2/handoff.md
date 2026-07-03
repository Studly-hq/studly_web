# Handoff Report: R2 Quota Rollback Audit

## 1. Observation
- The `rollbackQuota` function is defined in `lucid/src/lib/quota.ts` (lines 178-215). It wraps database updates in `db.runTransaction` and uses `Math.max(0, count - 1)` to prevent negative quota numbers.
- In `lucid/src/app/api/upload/route.ts` (lines 84 and 104) and `lucid/src/app/api/format-chunk/route.ts` (line 130), `rollbackQuota` is called only if `quotaChecked` is true, and the calls are wrapped inside try-catch blocks: `try { await rollbackQuota(...); } catch (err) { console.error("Rollback failed:", err); }`.
- Downstream AI streaming is handled by returning a `Response` wrapper over `result.textStream` (e.g. `lucid/src/app/api/upload/route.ts` line 205). Once returned, the route handler execution completes, meaning mid-stream generation errors are not caught by the route catch blocks.

## 2. Logic Chain
- **Negative Count Prevention**: By fetching the current document inside the Firestore transaction and doing `Math.max(0, count - 1)`, the counts are guaranteed never to drop below zero.
- **Rollback Safety**: Since the calls to `rollbackQuota` are wrapped in try-catch blocks, transaction failures do not leak unhandled rejections to the node process.
- **Quota Leakage**: Because the HTTP route handler terminates immediately upon returning the `Response` object containing the `ReadableStream`, any subsequent errors emitted by the stream will not execute the route's catch block. Since there are no stream event listeners (like Vercel AI SDK's `onFinish` callback or transform stream catch hooks) to intercept downstream failures, quota is leaked when a stream fails mid-generation.

## 3. Caveats
- Checked entirely through static analysis of the source code.
- No network partitions or database crashes were simulated live on the environment.

## 4. Conclusion
- **Grade: PARTIAL PASS**.
  - **PASS** for pre-response safety and handling (PPTX parse errors, initial LLM invocation failures, and database rollback transaction failure protection).
  - **FAIL** for downstream streaming failures, which leak quota when generation fails mid-stream.

## 5. Verification Method
- **Initial errors**: Corrupt PPTX file upload -> verify `daily_upload_count` reverts.
- **Rollback errors**: Simulate database timeout inside `rollbackQuota` -> verify API returns 500 and does not crash.
- **Downstream errors**: Simulate stream abort/disconnect during streaming -> verify user's `daily_upload_count` is not decremented.
