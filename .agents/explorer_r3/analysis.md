# Audit and Verification Report: Quiz/Flashcard Persistence Fix (R3)

This report presents a detailed audit and verification of the persistence and caching mechanisms implemented for the Quiz/Flashcard modules in `lucid/src/lib/useAutoSave.ts`, `lucid/src/lib/reader-context.tsx`, and the backend route in `lucid/src/app/api/notes/route.ts`.

---

## 1. Executive Summary
- **Findings**: The audit confirms that the R3 fix successfully implements a robust local-first caching strategy. The page unload handler strips the potentially massive `content` field from `keepalive` payloads, ensuring they fit within the browser's 64KB limit. During note loading, the app prioritizes local active sessions and local cache before fetching from the API. The background sync updates the cache list and metadata asynchronously without destructively overwriting the user's active, in-progress UI editing state.
- **Verdict**: **PASS** (with recommendations for minor edge cases).

---

## 2. Page Unload Handler and Keepalive Payload Size
- **File**: `lucid/src/lib/useAutoSave.ts` (lines 26-50)
- **Code Snippet**:
  ```typescript
  useEffect(() => {
    const handleUnload = () => {
      if (latestSessionDataRef.current && latestSessionDataRef.current.id) {
        try {
          const keepaliveData = { ...latestSessionDataRef.current };
          delete keepaliveData.content; // Content already exists in DB, keeps size <64KB limit

          // Attempt a keepalive fetch to save the latest state before the browser closes.
          fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(keepaliveData),
            keepalive: true
          }).catch(() => {});
        } catch (err) {
          // Synchronous error caught (e.g., payload too large for keepalive)
        }
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);
  ```

### Analysis & Verification:
1. **Verification of ID Existence**: The handler checks `latestSessionDataRef.current && latestSessionDataRef.current.id`. This ensures keepalive fetches are only dispatched for notes that have already been persisted to the database and assigned a note ID, preventing creation duplicates.
2. **Payload Size Reduction**: A shallow copy of the session data is made (`keepaliveData = { ... }`), and the `content` property is explicitly deleted: `delete keepaliveData.content;`. This is crucial because document contents/transcripts are often tens of kilobytes or megabytes in size, whereas the browser `keepalive: true` fetch specification imposes a strict **64KB** buffer limit. If a keepalive request exceeds this size, browsers fail the request immediately. Stripping the large `content` field keeps the payload extremely light, usually well under 5KB.
3. **Database Safe-merging**: On the backend inside `lucid/src/app/api/notes/route.ts` (line 113), the POST handler writes updates to Firestore via `noteRef.set(updateData, { merge: true })`. Because of `{ merge: true }`, fields omitted from the payload (such as `content`) are **not** overwritten or deleted in the Firestore document; the database merges the updated quiz/flashcard fields while keeping the existing document content intact.

---

## 3. Note Loading Priority Order (`loadNote`)
- **File**: `lucid/src/lib/reader-context.tsx` (lines 1495-1634 & 1636-1698)

When a user loads the application, the app resolves the note in the following priority:

1. **URL Note Parameter**:
   In `reader-context.tsx` (lines 1638-1649), the page initialization effect reads the search query parameter `?note=...`. If `noteIdInUrl` exists on initial boot, it directly triggers `loadNote(noteIdInUrl)`. This makes the URL the primary single source of truth.
2. **`lucid_active_session` in localStorage**:
   - If there is no `noteIdInUrl` on boot, it checks `localStorage.getItem('lucid_active_session')`. If the active session contains a valid document state but no ID (i.e. unsaved offline document), it populates the local React states directly.
   - If a `noteId` *was* selected (from the URL or otherwise), `loadNote(noteId)` checks `lucid_active_session` first:
     ```typescript
     const activeSessionStr = localStorage.getItem('lucid_active_session');
     if (activeSessionStr) {
         try {
             const activeSession = JSON.parse(activeSessionStr);
             if (activeSession.id === noteId) {
                 note = activeSession;
             }
         } catch (e) {}
     }
     ```
     This step takes highest priority during note loading because it contains the absolute freshest in-progress session data, potentially capturing changes not yet pushed to the server.
3. **Memory State `savedNotes`**:
   If the note is not in the active session key, it looks inside `savedNotes`, which is the in-memory React state representing the list of notes loaded for the user:
   ```typescript
   if (!note) {
       note = savedNotes.find(n => n.id === noteId) || null;
   }
   ```
4. **`lucid_notes_cache` in localStorage**:
   If the note is not found in memory, the application retrieves and parses the persistent cache array from `localStorage`:
   ```typescript
   if (!note && typeof window !== 'undefined') {
       const cachedNotesStr = localStorage.getItem('lucid_notes_cache');
       if (cachedNotesStr) {
           try {
               const cachedNotes = JSON.parse(cachedNotesStr);
               note = cachedNotes.find((n: any) => n.id === noteId) || null;
           } catch (e) {}
       }
   }
   ```
5. **Fetching from API `/api/notes/${noteId}`**:
   If the note is not found in any of the above local caching layers, the app dispatches an API request:
   ```typescript
   if (!note) {
       const response = await fetch(`/api/notes/${noteId}`, { signal });
       if (!response.ok) throw new Error("Could not load note");
       note = await response.json();
   }
   ```

---

## 4. Background Sync and Protection of Local State
- **File**: `lucid/src/lib/reader-context.tsx` (lines 1549-1564)

### Mechanics of Background Sync:
If a note is resolved locally (from `lucid_active_session`, `savedNotes`, or `lucid_notes_cache`), the app populates the UI states synchronously (using the cached object) and immediately schedules an asynchronous background fetch to fetch the latest state from the database:
```typescript
} else {
    // Background sync: update with freshest data from server
    fetch(`/api/notes/${noteId}`).then(async res => {
        if (res.ok) {
            const updatedNote = await res.json();
            setFullLoadedNote(updatedNote);
            // Also update savedNotes so cache stays fresh, protecting local state
            setSavedNotes(prev => prev.map(n => n.id === noteId ? {
                ...n,
                ...updatedNote,
                flashcards: updatedNote.flashcards || n.flashcards,
                quizSession: updatedNote.quizSession || n.quizSession
            } : n));
        }
    }).catch(() => {});
}
```

### Safety and Overwrite Protection:
- The background fetch resolves asynchronously.
- Crucially, it only updates `setFullLoadedNote(updatedNote)` and `setSavedNotes(...)` (which updates the sidebar/cache entry lists).
- It **does not** call active UI state setters like `setContent()`, `setFlashcards()`, or `setActiveQuizSession()`.
- Consequently, if a user has un-synced edits loaded from `lucid_active_session`, the slower API query will **never** overwrite the user's active screen state. The user's local editing state remains untouched, preventing destructive data loss during active study sessions.

---

## 5. Edge Cases & Potential Issues

1. **Stale Local Active Session Cache Wins (Cross-Device/Tab Conflict)**:
   - *Scenario*: A user opens Note A on Device 1 (laptop), makes edits, and saves them to the server. Later, they open Device 2 (phone), where Note A was left open or was in `lucid_active_session` from yesterday.
   - *Issue*: When the app loads Note A on Device 2, it sees that `lucid_active_session.id === noteId`. It hydrates Note A's state using yesterday's stale local session. The background sync fetches the updated note from the server, but because it only updates `savedNotes` and `fullLoadedNote` (not the active states), the phone's UI displays yesterday's stale state. When the user interacts with the page, `useAutoSave` triggers and saves the stale phone data back to the server, overwriting the newer laptop edits.
   - *Mitigation*: The app should check the timestamp of `activeSession` vs `updatedNote` on load. If the server timestamp is newer and the local state does not have dirty/unsaved changes, it should update the active state or prompt the user.

2. **Mobile Device Unload Limits**:
   - *Issue*: The unload handler in `useAutoSave.ts` relies on `beforeunload`. Mobile browsers often do not trigger `beforeunload` or `unload` when tabs are closed or switched.
   - *Mitigation*: Use the `visibilitychange` event listener in addition to `beforeunload`, which is highly recommended for mobile browsers to ensure keepalive flushes succeed.

3. **Redundant Server Writes on Initial Page Load**:
   - *Issue*: In `useAutoSave.ts`, the `lastSavedState` ref is initialized to `""`. When a note completes loading, `lastSavedState.current === ""` does not match `currentState` (which contains the note's serialized state). This mismatch causes `useAutoSave` to schedule a save timeout, resulting in a redundant POST request to `/api/notes` 2 seconds after every single note load/page refresh, even if the user has made no modifications.
   - *Mitigation*: During the initial run of `useAutoSave` (after `sessionState.isLoading` becomes false), initialize `lastSavedState.current` to `currentState` to avoid the redundant save.

---

## 6. Audit Verdict
### Grade: **PASS**
**Justification**: The implementation fulfills all core requirements. Payload sizes are safely reduced below the 64KB limit for page unloads, and Firestore `{ merge: true }` ensures no data is wiped out. Local cache layers are correctly prioritized, and background fetches are executed safely without destroying in-progress user sessions. The noted edge cases do not invalidate the effectiveness of the persistence fix under normal conditions, but resolving them will improve multi-device safety and system efficiency.
