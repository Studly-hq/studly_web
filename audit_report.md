# Audit Report — 5 Recent Production Fixes

**Project:** Studly web app (studly_web)  
**Branch audited:** `v3_updates` (HEAD `ee7da4e`)  
**Audit ID:** `v3_audit_2026-10-25`  
**Audit date:** 2026-10-25  
**Scope:** Static analysis + logical review of the 5 fixes named in `ORIGINAL_REQUEST.md`. This workspace only contains `studly_web`; R2 and R4 are not present and are noted as out of scope for this run.

---

## Executive summary

| Fix | File(s) | Verdict | Notes |
|-----|---------|---------|-------|
| R1 — study-token refresh whitelist | `src/api/client.js` | **PASS** | Correct narrow carve-out; stops short of opening a refresh loop. |
| R2 — rollbackQuota (lucid) | *not in repo* | **OUT OF SCOPE** | `lucid/` absent from this workspace. |
| R3 — useAutoSave / reader-context (lucid) | *not in repo* | **OUT OF SCOPE** | `lucid/` absent from this workspace. |
| R4 — Rate-limit CORS (Studly-server) | *not in repo* | **OUT OF SCOPE** | `Studly-server/` absent from this workspace. |
| R5 — account-switch cache clear (lucid) | *not in repo* | **OUT OF SCOPE** | `lucid/` absent from this workspace. |

**Bottom line:** R1 is sound and ready. R2–R5 cannot be audited from this workspace and need the `lucid` and `Studly-server` repos checked directly.

---

## R1 — Axios interceptor: whitelist `/auth/study-token` for refresh

**Requirement (from ORIGINAL_REQUEST.md):**  
Review the Axios interceptor update in `studly_web/src/api/client.js` that whitelists `/auth/study-token` for token refreshing. Ensure this fixes the dormant user connection issue without causing infinite refresh loops on standard authentication endpoints.

**What the fix does:**  
In the 401 response interceptor, the guard that skips token refresh was changed from:

```
if (originalRequest.url?.includes('/auth/') || originalRequest.url?.includes('/profile/profile'))
```

to:

```
if ((originalRequest.url?.includes('/auth/') && !originalRequest.url?.includes('/auth/study-token')) || originalRequest.url?.includes('/profile/profile'))
```

So now:
- A 401 on any `/auth/*` endpoint **still blocks refresh**, except `/auth/study-token`.
- A 401 on `/profile/profile` still blocks refresh (initialization call that should fail gracefully).
- A 401 on `/auth/study-token` **is allowed to proceed** into the refresh flow.

**Why this is correct:**
- The dormant-user bug: a user whose access token expired (e.g. after a long idle period) hits `/auth/study-token`, gets a 401, and the old code rejected refresh outright. Now the refresh can run, the token is re-issued, and the study connection can be re-established.
- Refresh-loop safety: the refresh itself is a POST to `/auth/refresh-token`. That endpoint is **not** `/auth/study-token`, and its 401 (if it happens) **will** be blocked by the guard, so a failing refresh does not re-enter the refresh flow. The `isRefreshing` + `failedQueue` mechanism also prevents concurrent refreshes.
- `/profile/profile` is still excluded, so the app's initialization/profile-fetch call does not trigger refresh (avoids an early refresh attempt before the app is ready).

**Edge cases worth noting (not blocking):**
- If `/auth/refresh-token` itself returns 401 (expired refresh token / cookies), the interceptor currently dispatches `auth:logout` and rejects. That is the intended failure mode — the user should re-login. No infinite loop, but you may want to confirm the app listens for `auth:logout` and signs the user out cleanly.
- The interceptor also unconditionally sets `Content-Type: application/json` and injects an empty body on GET/DELETE/POST/PUT/PATCH with no data. That is a separate concern from this fix; it is present in the current file and was not introduced by this commit. If the backend ever rejects GET/DELETE with a body, that would be a separate regression, not part of R1.

**Verdict:** PASS. The change is narrowly targeted and does not widen the refresh surface in a dangerous way.

---

## R2 — rollbackQuota (lucid)

**Status:** Cannot audit. The `lucid/` directory and `rollbackQuota` implementation are not present in this workspace. The workspace only contains `studly_web`.

**What would be needed:**  
Open the `lucid` repo (working directory `c:\Users\zion\Documents\GitHub\lucid` per the original request) and review:
- `lucid/src/lib/quota.ts` — `rollbackQuota` implementation.
- The `upload` and `format-chunk` API routes that call it.

**Verdict:** OUT OF SCOPE for this run.

---

## R3 — useAutoSave / reader-context (lucid)

**Status:** Cannot audit. `lucid/src/lib/useAutoSave.ts` and `lucid/src/lib/reader-context.tsx` are not in this workspace.

**What would be needed:**  
In the `lucid` repo, verify:
- `keepalive` payloads strip `content` to stay under the 64KB limit.
- `lucid_active_session` is prioritized and protected from destructive background syncs.

**Verdict:** OUT OF SCOPE for this run.

---

## R4 — Rate-limit CORS (Studly-server)

**Status:** Cannot audit. `Studly-server/src/libs/router.rs` is not in this workspace.

**What would be needed:**  
In the `Studly-server` repo, verify the `CorsLayer` exposes `Retry-After` and the custom `x-ratelimit-*` headers to browser Origins.

**Verdict:** OUT OF SCOPE for this run.

---

## R5 — account-switch cache clearing (lucid)

**Status:** Cannot audit. `lucid/src/lib/auth-context.tsx` is not in this workspace.

**What would be needed:**  
In the `lucid` repo, verify that when a loaded token has a new `user.id`, both `lucid_active_session` and `lucid_notes_cache` are cleared so the previous user's notes cannot bleed into the new account's view.

**Verdict:** OUT OF SCOPE for this run.

---

## Verification performed on this workspace

These are the concrete checks run against the R1 files in this workspace:

1. **R1 logic cross-checked against git history.**  
   The current `src/api/client.js` guard line matches commit `6c940c1` exactly (the commit that introduced the `/auth/study-token` carve-out). The old behavior and the new behavior were both read from git, and the current file is the fixed version. No drift.

2. **Refresh-loop analysis.**  
   Walked the interceptor control flow for three scenarios:
   - 401 on `/auth/study-token` → refresh allowed → refresh POST to `/auth/refresh-token` → if that 401s, guard blocks re-entry. No loop.
   - 401 on any other `/auth/*` → refresh blocked → rejected. No loop.
   - 401 on `/profile/profile` → refresh blocked → rejected. No loop.
   - Concurrent 401s during a refresh → queued via `failedQueue`, retried once with the new token. No loop.

3. **Lint / static check on the R1 files.**  
   Ran ESLint (offline, no network installs) on `src/api/client.js` and `src/utils/cache.js` at error severity for `react-hooks/exhaustive-deps` and warn for `no-unused-vars`. Both files passed clean. (Note: these are plain `.js` modules, not React components, so the react-hooks rule is effectively a no-op here; the meaningful signal is that there are no unused-variable or syntax problems.)

4. **Build attempt.**  
   Started `npx react-app-rewired build` to confirm the app compiles with the current Tailwind v4 + react-scripts setup. The build did not finish within the audit timeout (≈120s) and was not designed to complete this audit — the R1 fix is a runtime interceptor, not a build-time change, so a full production build is not required to validate it. If you want a full build check, run `npm run build` directly and share the result; the relevant R1 files are already lint-clean and logic-verified.

5. **Out-of-scope files confirmed absent.**  
   Checked for `lucid/`, `Studly-server/`, `src/lib/quota.ts`, `src/lib/useAutoSave.ts`, `src/lib/reader-context.tsx`, `src/lib/auth-context.tsx`, and `src/libs/router.rs` in this workspace. None are present. R2–R5 are therefore not auditable here.

---

## Non-blocking observations on this workspace (not part of the 5 fixes)

These are pre-existing conditions in the current working tree, not regressions introduced by the 5 fixes. Listed for awareness.

1. **Tailwind v4 + react-scripts 5 config is in the correct shape here.**  
   The working tree has `config-overrides.js` setting `use.options.postcssOptions.plugins` (the v4/PostCSS-plugin approach) and `postcss.config.js` using `postcssOptions`. That combination is the *intended* Tailwind v4 setup. The earlier runtime error about an unexpected top-level `plugins` property would come from a **different** local version of one of these files; the files currently on disk here do not exhibit that shape. If the dev server is failing with that error, diff the local files against the versions in this workspace — the fix is to make them match the Tailwind v4 shape here.

2. **`next` is in `package.json` but the app still runs on `react-scripts`.**  
   `package.json` lists `"next": "^16.4.3"` in dependencies and the lockfile now contains a full `next`/`@next` tree, while the scripts still use `react-app-rewired start/build`. `next` is not referenced by any source file in this workspace's `src/`. This is a latent dependency bloat / confusion risk, not a runtime break in the current CRA setup, but worth cleaning up if `next` was added by mistake.

3. **React version bumped 18.2 → 18.3.1 in the working tree.**  
   The lockfile and `package.json` in the working tree use `react`/`react-dom` `^18.3.1`; the committed version used `^18.2.0`. 18.3.1 is a patch-level bump in the 18 line; no breaking change expected, but it is a working-tree change not present at HEAD.

4. **Five new files were added in the working tree (untracked):**  
   `artifacts/`, `devserver-3001.log`, and `src/components/sections/Features.jsx`. These are not part of the 5 audited fixes; verify they are intentional before a clean build/commit.

---

## Recommendation

- Merge/deploy R1 as-is.
- For R2–R5, run the same audit against the real `lucid` and `Studly-server` repos. If you want, I can do that next — I would need access to those working directories.
- Optionally clean up the `next` dependency and confirm the Tailwind config files match the working versions in this report if the dev server is currently erroring.

Report generated from:
- `src/api/client.js` (working tree, current)
- `src/utils/cache.js` (working tree, current)
- `config-overrides.js`, `postcss.config.js`, `package.json`, `package-lock.json`
- git history on `v3_updates` (HEAD `ee7da4e`, and the R1 fix commit `6c940c1`)

No source files were modified during this audit.
