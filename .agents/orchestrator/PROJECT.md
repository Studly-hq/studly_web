# Project: Production Fixes Audit

## Architecture
This project involves verifying 5 recent production fixes across 3 repositories:
1. `studly_web` (Frontend React Application)
   - Handles authentication tokens and calls the backend APIs.
   - Contains Axios network client setup and interceptor logic.
2. `lucid` (Next.js AI study application)
   - Core API routes for uploads, formatting, and database saves.
   - Reader contexts, auto-save custom hooks, and user auth caching.
3. `Studly-server` (Rust backend server)
   - Core routing, rate limiting, and CORS layers.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | M1. Audit Frontend Fix (studly_web) | Review client.js Axios interceptor `/auth/study-token` whitelist | None | DONE (Conv: 023a16ef-0d3f-43e9-8f32-1eba3f99afcc) - Grade: PASS |
| 2 | M2. Audit Quota Rollback Fix (lucid) | Review rollbackQuota in quota.ts & integration in upload/format-chunk routes | None | DONE (Conv: 5c4f1d77-7af3-4d78-b581-2b145ee3813e) - Grade: PARTIAL PASS |
| 3 | M3. Audit Quiz/Flashcard Persistence | Review useAutoSave.ts & reader-context.tsx keepalive and local session prioritization | None | DONE (Conv: 9762e9ee-73ee-4fe1-9ca9-541f6a2878d2) - Grade: PASS |
| 4 | M4. Audit Rate Limit CORS Fix (Studly-server) | Review router.rs CorsLayer headers exposure & outermost layer placement | None | DONE (Conv: 7d722e9d-f2d9-465c-87f2-ce7aa9469905) - Grade: PASS |
| 5 | M5. Audit Account Switch Bleeding Fix | Review auth-context.tsx & reader-context.tsx user session/notes cache clearing | None | DONE (Conv: d92e1eab-36a5-46af-a1c0-4a6790450e25) - Grade: FAIL |
| 6 | M6. Synthesis and Final Report | Compile and format final audit report summarizing findings | M1, M2, M3, M4, M5 | PLANNED |

## Code Layout
- `studly_web/src/api/client.js`
- `lucid/src/lib/quota.ts`
- `lucid/src/app/api/upload/route.ts`
- `lucid/src/app/api/format-chunk/route.ts`
- `lucid/src/lib/useAutoSave.ts`
- `lucid/src/lib/reader-context.tsx`
- `lucid/src/lib/auth-context.tsx`
- `Studly-server/src/libs/router.rs`
