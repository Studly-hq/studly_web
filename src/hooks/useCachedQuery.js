import { useState, useEffect, useRef, useCallback } from 'react';
import { cacheGet, cacheSet, cacheIsFresh, cacheEvict } from '../utils/cache';

/**
 * Hook that wraps an async fetch with in-memory caching.
 *
 * Behaviour per mount:
 * 1. If cached data exists and is fresh (< 30s): render instantly, skip loading spinner
 * 2. If stale cached data exists: render it (showing old values), revalidate in background
 * 3. If no cache: show skeleton while first fetch completes
 *
 * On `invalidate()`: evicts cache and refetches (e.g. user-initiated refresh / period switch).
 *
 * Feed pages should NOT use this hook — they stream real-time data via FeedContext.
 *
 * @param {Function} fetcher          — Async function returning the data
 * @param {object}   [options]
 * @param {*}        [options.fetchOptions] — Passed to `fetcher` on each call
 * @param {string}   [options.cacheKey]     — Override for the cache key (default: derived from fetcher name + options)
 * @returns {{ data: *, loading: boolean, error: string | null }}
 */
export function useCachedQuery(fetcher, options = {}) {
    const { fetchOptions, cacheKey: overrideKey } = options;
    const cacheKey = overrideKey || `${fetcher.name}:${JSON.stringify(fetchOptions ?? '')}`;

    const [data, setData]       = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);

    const mountedRef = useRef(true);
    const pendingRef = useRef(0); // monotonically increasing ID to ignore stale responses
    const hasDataRef = useRef(false); // tracks if we've already rendered data (prevents showing spinner during background revalidation)

    /** Core fetch — handles cache check, background revalidation, and race-condition safety. */
    const execute = useCallback(async (opts, isSwitch) => {
        const id = ++pendingRef.current;

        // --- Step 1: Check cache ---
        const cached = cacheGet(cacheKey);
        if (cached) {
            // Stale but valid → serve immediately, revalidate in background
            if (!isSwitch && !cacheIsFresh(cacheKey)) {
                setData(cached.data);
                hasDataRef.current = true;
                if (mountedRef.current) setLoading(false);
                // Fall through to revalidation below
            } else if (cached) {
                // Fresh hit → serve instantly and still revalidate in background
                setData(cached.data);
                hasDataRef.current = true;
                if (mountedRef.current) setLoading(false);
                // Fall through to revalidation below
            }
        } else if (!isSwitch) {
            // No cache, not a switch → skeletons shown by initial loading state
        }
        // else: switch with no cache → spinner will be visible

        // --- Step 2: Fetch ---
        try {
            const result = await fetcher(opts);
            if (mountedRef.current && id === pendingRef.current) {
                cacheSet(cacheKey, result);
                setData(result);
                setError(null);
                // Only show loading state if we didn't already have data (background revalidation should be transparent)
                if (!hasDataRef.current && mountedRef.current) setLoading(false);
            }
        } catch (err) {
            if (mountedRef.current && id === pendingRef.current) {
                setError(err.message || 'Failed to load');
                if (!hasDataRef.current && mountedRef.current) setLoading(false);
            }
        }
    }, [cacheKey]);

    // Initial load
    useEffect(() => {
        mountedRef.current = true;
        execute(fetchOptions, false);
        return () => { mountedRef.current = false; };
        // Intentional: only run once on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /** Trigger a cache eviction + immediate refetch. */
    const invalidate = useCallback(async () => {
        cacheEvict(cacheKey);
        await execute(fetchOptions, true);
    }, [cacheKey, execute, fetchOptions]);

    return { data, loading, error, refresh: invalidate, invalidate };
}
