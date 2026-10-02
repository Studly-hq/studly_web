/**
 * Production-grade in-memory cache with session persistence.
 *
 * Design decisions:
 * - In-memory Map as primary store (O(1) reads, survives SPA navigations)
 * - sessionStorage fallback for cross-session warmup (restores cache on reload)
 * - TTL-based expiry with background GC (prevents stale reads & memory leaks)
 * - Entry counter cap (evicts oldest entry if > MAX_ENTRIES to bound memory)
 * - Storage event listener for cross-tab consistency
 *
 * Pages that stream real-time data (feed via FeedContext) must NOT use this cache.
 */

// --- Constants ---

const STORE = new Map();
const STORAGE_KEY_PREFIX = 'studly_cache_';
const STALE_AFTER = 10 * 60 * 1000;       // 10 minutes before marked stale
const HIT_AFTER  = 30 * 1000;              // 30 seconds before served instantly
const MAX_ENTRIES = 50;                    // hard cap to prevent memory leaks

// --- Internal helpers ---

/** Read one entry from sessionStorage. Returns null on parse failure or absence. */
function _readStorage(key) {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY_PREFIX + key);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

/** Write one entry to sessionStorage. Silently ignores quota errors. */
function _writeStorage(key, entry) {
    try {
        sessionStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(entry));
    } catch { /* Quota exceeded — best-effort only */ }
}

/** Remove one entry from sessionStorage. Silently ignores errors. */
function _removeStorage(key) {
    try { sessionStorage.removeItem(STORAGE_KEY_PREFIX + key); } catch { /* noop */ }
}

// --- Garbage collection ---

/**
 * Evict expired entries. Runs periodically and after each write.
 * Also enforces MAX_ENTRIES cap by evicting oldest first.
 */
function gc() {
    const now = Date.now();
    // 1. Remove expired entries — collect keys first to avoid mutation-during-iteration
    const expiredKeys = [];
    for (const [key, entry] of STORE) {
        if (now - entry.ts > STALE_AFTER) {
            expiredKeys.push(key);
        }
    }
    for (const key of expiredKeys) {
        STORE.delete(key);
        _removeStorage(key);
    }
    // 2. Enforce size cap (LRU: evict oldest)
    while (STORE.size > MAX_ENTRIES) {
        let oldestKey = null;
        let oldestTime = Infinity;
        for (const [key, entry] of STORE) {
            if (entry.ts < oldestTime) {
                oldestTime = entry.ts;
                oldestKey = key;
            }
        }
        if (oldestKey !== null) {
            STORE.delete(oldestKey);
            _removeStorage(oldestKey);
        }
    }
}

// --- Public API ---

/**
 * Store a fetch result. Automatically triggers GC afterward.
 * @param {string} key   — Unique identifier (e.g. URL path)
 * @param {*}      data  — The fetched response data
 */
export function cacheSet(key, data) {
    const entry = { data, ts: Date.now() };
    STORE.set(key, entry);
    _writeStorage(key, entry);
    gc();
}

/**
 * Get cached entry if present and not yet expired.
 * @param {string} key
 * @returns {{ data: *, ts: number } | null}
 */
export function cacheGet(key) {
    const entry = STORE.get(key);
    if (!entry) return null;
    if (Date.now() - entry.ts > STALE_AFTER) {
        STORE.delete(key);
        _removeStorage(key);
        return null;
    }
    return entry;
}

/**
 * Check if a cache hit is "fresh" (< 30s old) — serves instantly without spinner.
 * Older-but-stale entries are valid (return true from `cacheGet`) but trigger
 * a background revalidation instead of immediate render.
 * @param {string} key
 * @returns {boolean}
 */
export function cacheIsFresh(key) {
    const entry = STORE.get(key);
    if (!entry) return false;
    return (Date.now() - entry.ts) < HIT_AFTER;
}

/** Permanently remove one key from all stores. */
export function cacheEvict(key) {
    STORE.delete(key);
    _removeStorage(key);
}

/** Clear the entire cache — call on logout. */
export function cacheClear() {
    STORE.clear();
    // Clean up any orphaned keys in sessionStorage
    let i = sessionStorage.length;
    while (i--) {
        const k = sessionStorage.key(i);
        if (k && k.startsWith(STORAGE_KEY_PREFIX)) {
            sessionStorage.removeItem(k);
        }
    }
}

/**
 * Warm the in-memory cache from sessionStorage.
 * Call this early in app lifecycle (e.g. App entry point) to restore
 * data the user had cached during their previous session.
 */
export function cacheRestore(key) {
    const stored = _readStorage(key);
    if (stored && !STORE.has(key)) {
        STORE.set(key, stored);
    }
}

// --- Cross-tab synchronization ---
// Listen for storage events so if another tab modifies cache, this tab stays consistent.

if (typeof window !== 'undefined') {
    window.addEventListener('storage', (event) => {
        if (event.key && event.key.startsWith(STORAGE_KEY_PREFIX)) {
            const key = event.key.replace(STORAGE_KEY_PREFIX, '');
            if (event.newValue === null) {
                cacheEvict(key); // Another tab deleted the entry
            } else {
                try {
                    const entry = JSON.parse(event.newValue);
                    // Validate before trusting cross-tab data
                    if (entry && typeof entry.data !== 'undefined' && typeof entry.ts === 'number') {
                        STORE.set(key, entry);
                    }
                } catch { /* Ignore malformed values */ }
            }
        }
    });
    // Periodic GC every 60s prevents memory leaks during long idle sessions
    setInterval(gc, 60_000);
}
