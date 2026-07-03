# R5 Audit & Verification: Account Switch Bleeding Fix

## Executive Summary
* **Component Audited:** Account Switch Bleeding Fix (R5)
* **Target Files:** `lucid/src/lib/auth-context.tsx`, `lucid/src/lib/reader-context.tsx`, `lucid/src/lib/useAutoSave.ts`
* **Audit Date:** June 24, 2026
* **Final Audit Grade:** **FAIL**

---

## 1. Analysis of User Switch Detection in `auth-context.tsx`

The user switch detection block is implemented in two places in `lucid/src/lib/auth-context.tsx`:

### Occurrence 1: URL Query Parameter Token Verification (`initAuth`)
Located around lines 49–56:
```typescript
// Check if user changed to prevent session bleed
if (typeof window !== 'undefined') {
    const lastUserId = localStorage.getItem('lucid_last_user_id');
    if (lastUserId && lastUserId !== data.user.id) {
        localStorage.removeItem('lucid_active_session');
        localStorage.removeItem('lucid_notes_cache');
    }
    localStorage.setItem('lucid_last_user_id', data.user.id);
}
```

### Occurrence 2: postMessage Token Verification (`handleMessage`)
Located around lines 117–125:
```typescript
// Check if user changed to prevent session bleed
if (typeof window !== 'undefined') {
    const lastUserId = localStorage.getItem('lucid_last_user_id');
    if (lastUserId && lastUserId !== data.user.id) {
        localStorage.removeItem('lucid_active_session');
        localStorage.removeItem('lucid_notes_cache');
    }
    localStorage.setItem('lucid_last_user_id', data.user.id);
}
```

### How `lucid_last_user_id` is Checked and Used:
1. When an authentication token is successfully verified, the client retrieves `lucid_last_user_id` from `localStorage`.
2. It compares `lastUserId` with the newly loaded `data.user.id`.
3. If they are different AND `lastUserId` is truthy, it deletes `lucid_active_session` and `lucid_notes_cache` from `localStorage`.
4. It sets `lucid_last_user_id` to the new `data.user.id`.

---

## 2. Gaps and Vulnerabilities Identified

### Gap A: Missing User Switch Detection in `/api/auth/me` Entry Point
If the page loads without a `token` query parameter (e.g., direct navigation, refreshing a tab, or background re-auth), it goes to the `else` branch of `initAuth` and calls the `/api/auth/me` endpoint:
```typescript
} else {
    // Check for existing session via server endpoint
    // (cookie is httpOnly so we can't read it client-side)
    try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
            const data = await response.json();
            if (data.authenticated && data.user) {
                setUser(data.user);
            }
        }
    } catch {
        // Silent fail — user is just not authenticated
    }
}
```
**Vulnerability:** This branch does **NOT** check if the user has changed and does **NOT** clear `localStorage` or update `lucid_last_user_id`.
* **Scenario:** If a user logs out of Account A and logs into Account B in the parent application (Studly), then refreshes the Lucid iframe, the browser cookies will authenticate Account B via `/api/auth/me`. Because this branch does not perform any cache clearing, the `lucid_notes_cache` containing Account A's notes is left intact.
* **Result:** Under certain conditions (such as network latency or offline mode), Account B will see Account A's notes in the UI.

### Gap B: Mount Hydration of Stale Cache
In `reader-context.tsx`, saved notes are hydrated from `localStorage` on mount:
```typescript
useEffect(() => {
    // Hydrate saved notes from cache first for instant UX
    if (typeof window !== 'undefined') {
        const cachedNotes = localStorage.getItem('lucid_notes_cache');
        if (cachedNotes) {
            try {
                setSavedNotes(JSON.parse(cachedNotes));
            } catch (e) {
                console.error("Failed to parse cached notes:", e);
            }
        }
    }
    // ...
}, [isAuthenticated]);
```
* **Vulnerability:** On mount, `user` in `AuthProvider` is `null` and `isAuthenticated` is `false`. The above `useEffect` runs immediately and hydrates the UI with whatever is in `lucid_notes_cache` (which could belong to the previous user).
* **Result:** Even if the user switch detection block later clears the cache once auth resolves, the UI will still briefly flash the previous user's notes upon initial page load.

### Gap C: Failure to Clear Caches When `lastUserId` is Falsy
The check in `auth-context.tsx` is:
```typescript
if (lastUserId && lastUserId !== data.user.id)
```
If `lastUserId` is `null` (e.g. if the user cleared their browser storage or this is the first run of the updated app), but a stale `lucid_notes_cache` or `lucid_active_session` from a different user is still present in `localStorage`, the caches will **not** be cleared. The condition should be `if (lastUserId !== data.user.id)` to catch the case where `lastUserId` is unknown/null.

---

## 3. Side-Effect Bugs Introduced by the Fix

### Bug 1: Active Session and State Wiped on Every Page Refresh
In `reader-context.tsx`, the following effect monitors user changes:
```typescript
useEffect(() => {
    if (user?.id !== lastUserId.current) {
        cleanLocalState();
        setSavedNotes([]);
        setChatHistories({});
        setFile(null);
        setContent("");
        // ...
        lastUserId.current = user?.id;
    }
}, [user?.id]);
```
* `lastUserId` is initialized as: `const lastUserId = useRef(user?.id)`.
* Because `AuthProvider` always starts with `user = null` on mount and fetches auth asynchronously, `user` is `null` when `ReaderProvider` mounts. Thus, `lastUserId.current` is initialized to `undefined`.
* When the auth request resolves, `user` state updates to `{ id: "user-A" }`.
* The `useEffect` fires because `user?.id` ("user-A") !== `lastUserId.current` (`undefined`).
* It executes `cleanLocalState()`, which:
  1. Calls `localStorage.removeItem('lucid_active_session')`.
  2. Clears all visual and functional React states (e.g., resets `file`, `content`, `activeTab`, etc.).
* **Result:** **Every single page refresh or initial load wipes the user's active session (`lucid_active_session`) and clears all unsaved state!** This breaks session persistence entirely.

### Bug 2: `cleanLocalState` Does Not Clear `lucid_notes_cache`
In `reader-context.tsx`, `cleanLocalState()` clears `lucid_active_session`, `lucid_current_topic_index`, and `lucid_current_topic_id`, but it does **NOT** call `localStorage.removeItem('lucid_notes_cache')`. Therefore, even when a user switch triggers a clean, the notes cache persists in `localStorage`.

---

## 4. PASS/FAIL Verdict

**VERDICT: FAIL**

While the fix attempts to address session bleeding by checking for user switches on token loading entry points (query parameter and message handler), it introduces severe logical gaps:
1. It ignores the `/api/auth/me` entry point, leaving cookie-based account switching vulnerable to session bleed.
2. It hydrates stale note caches on mount before authentication state is resolved.
3. The in-memory check in `reader-context.tsx` runs on every page load/refresh, incorrectly treating the transition from `null` (loading) to the authenticated user as a user switch, thereby deleting the active session and wiping out all state.
