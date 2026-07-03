# Handoff Report: R5 Audit Explorer

## 1. Observation
* **Observed Files:**
  * `lucid/src/lib/auth-context.tsx`
  * `lucid/src/lib/reader-context.tsx`
  * `lucid/src/lib/useAutoSave.ts`
* **Observations in `auth-context.tsx`:**
  * **Token Query Parameter Block (Lines 49–56):**
    ```typescript
    if (typeof window !== 'undefined') {
        const lastUserId = localStorage.getItem('lucid_last_user_id');
        if (lastUserId && lastUserId !== data.user.id) {
            localStorage.removeItem('lucid_active_session');
            localStorage.removeItem('lucid_notes_cache');
        }
        localStorage.setItem('lucid_last_user_id', data.user.id);
    }
    ```
  * **Message Handler Block (Lines 117–125):**
    ```typescript
    if (typeof window !== 'undefined') {
        const lastUserId = localStorage.getItem('lucid_last_user_id');
        if (lastUserId && lastUserId !== data.user.id) {
            localStorage.removeItem('lucid_active_session');
            localStorage.removeItem('lucid_notes_cache');
        }
        localStorage.setItem('lucid_last_user_id', data.user.id);
    }
    ```
  * **Fallback `/api/auth/me` Block (Lines 76–84):**
    ```typescript
    const response = await fetch('/api/auth/me');
    if (response.ok) {
        const data = await response.json();
        if (data.authenticated && data.user) {
            setUser(data.user);
        }
    }
    ```
* **Observations in `reader-context.tsx`:**
  * **User Change Effect (Lines 534–552):**
    ```typescript
    const { isAuthenticated, user } = useAuth()
    const lastUserId = useRef(user?.id)

    useEffect(() => {
        if (user?.id !== lastUserId.current) {
            cleanLocalState();
            setSavedNotes([]);
            setChatHistories({});
            setFile(null);
            setContent("");
            setDocumentContext("");
            setSubjects([]);
            setFlashcards([]);
            setLearnerProfile(null);
            setQuickModeState(null);
            setActiveQuizSession(null);
            setActiveMode(null);
            setActiveTab(null);
            setCurrentNoteId(null);
            lastUserId.current = user?.id;
        }
    }, [user?.id]);
    ```
  * **Clean State Method (Lines 1963–1998):**
    ```typescript
    const cleanLocalState = () => {
        // ...
        localStorage.removeItem('lucid_active_session')
        localStorage.removeItem('lucid_current_topic_index')
        localStorage.removeItem('lucid_current_topic_id')
    }
    ```
  * **Saved Notes Cache Loading Effect (Lines 579–590):**
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

## 2. Logic Chain
1. **Initial Mount:** When the application mounts, `AuthProvider` initializes its `user` state to `null`.
2. **Ref Initialization:** Consequently, inside `ReaderProvider`, `lastUserId.current` is initialized to `undefined` (since `user` is `null` on mount).
3. **Cache Hydration:** In `ReaderProvider`, the `useEffect` with dependency `[isAuthenticated]` runs on mount (since `isAuthenticated` is `false`). It reads `lucid_notes_cache` from `localStorage` and loads it into in-memory state, even if it contains the previous user's notes.
4. **Auth Resolution:**
   * **With Token (URL or Message):** If verified, `auth-context.tsx` checks if `lastUserId` !== `data.user.id`. If different, it deletes the localStorage caches (`lucid_active_session`, `lucid_notes_cache`).
   * **Without Token (`/api/auth/me`):** It fetches the current user from `/api/auth/me`. If the user is different (e.g. account was switched in the parent window), it updates the user state but does **not** check for user changes and does **not** clear `localStorage` or update `lucid_last_user_id`.
5. **Rerender & Cleans:** When `user` state becomes populated (User A), `user?.id` ("user-A") !== `lastUserId.current` (`undefined`) evaluates to `true`. This fires the user change effect in `reader-context.tsx`.
6. **Destructive Side Effect:**
   * The user change effect calls `cleanLocalState()` and resets the React state.
   * `cleanLocalState()` deletes `lucid_active_session` from `localStorage`.
   * **Consequence:** Since this runs on every page load/refresh for any authenticated user, it wipes out any active session state hydrated on mount.
7. **Cache Persistence:**
   * `cleanLocalState()` does **not** clear `lucid_notes_cache` from `localStorage`.
   * For the `/api/auth/me` flow, since `auth-context.tsx` didn't clear `lucid_notes_cache`, the cache containing the previous user's notes persists in `localStorage` and is shown in the UI during mount or if the new notes fetch fails/delays.

## 3. Caveats
* None. The audit was conducted purely via static code analysis. No live execution or database verification was performed since the repository cannot be run under CODE_ONLY constraints.

## 4. Conclusion
The Account Switch Bleeding Fix (R5) **FAIL**s verification. While it correctly handles token-based logins, it misses the cookie-based `/api/auth/me` re-authentication path and introduces a severe regression where any page load/refresh wipes the active session state due to an incorrect user switch check on initial mount.

## 5. Verification Method
1. Inspect `lucid/src/lib/auth-context.tsx` and verify that the `else` branch of `initAuth` (calling `/api/auth/me`) has no user change checking or cache clearing.
2. Inspect `lucid/src/lib/reader-context.tsx` and verify that `lastUserId` ref is initialized to `user?.id` (which is `undefined` on mount), causing the user switch effect to run on every successful page load, which calls `cleanLocalState()` and deletes `lucid_active_session` from `localStorage`.
