import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    signup as apiSignup,
    login as apiLogin,
    logout as apiLogout,
    sync as apiSync,
} from "../api/auth";
import { setAuthToken } from "../api/client";
import { getProfile, updateProfile } from "../api/profile";
import { supabase } from "../utils/supabase";
import { cacheClear } from "../utils/cache";
import { useWebSocketContext } from "./WebSocketContext";
import { compatToast as toast } from "../components/ui/toast";
import client from "../api/client";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const { connect, disconnect, subscribe } = useWebSocketContext();
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    /**
     * Programmatic supabase session sync. On a cold page load, supabase-js's
     * own session recovery races this call and its internal abort surfaces as
     * "AbortError: signal is aborted without reason", which used to fail the
     * whole first login. Retry once; after that never let supabase internal
     * noise break the flow. The Studly session (cookies + axios token) is the
     * source of truth, supabase only backs the websocket.
     */
    const setSupabaseSession = useCallback(async (session) => {
        try {
            await supabase.auth.setSession(session);
            return true;
        } catch (error) {
            if (error?.name !== "AbortError") throw error;
            try {
                await supabase.auth.setSession(session);
                return true;
            } catch (retryError) {
                console.warn(
                    "[AuthContext] Supabase session sync aborted by its own recovery. Continuing with Studly session:",
                    retryError?.message || retryError,
                );
                return false;
            }
        }
    }, []);

    // Check giveaway win after login (fire and forget)
    const checkGiveawayWin = useCallback(async () => {
        try {
            const response = await client.post("/giveaway/today/today-check", {});
            const data = response.data;
            
            if (data.won) {
                // Dispatch event to open win modal (avoids circular context dependency)
                window.dispatchEvent(new CustomEvent("giveaway:win", { 
                    detail: {
                        ticket_number: data.ticket_number,
                        login_position: data.login_position,
                        message: data.message
                    }
                }));
            }
        } catch (error) {
            // Silently fail - giveaway check shouldn't block login
            console.debug("Giveaway check skipped:", error.message);
        }
    }, []);

    // Guard to prevent multiple simultaneous logout calls
    const isLoggingOutRef = useRef(false);

    const logout = useCallback(async () => {
        // Prevent double logout
        if (isLoggingOutRef.current) {
            console.warn('[AuthContext] Logout already in progress, skipping');
            return;
        }
        isLoggingOutRef.current = true;

        try {
            // 1. Clear local auth state immediately for responsive UI
            setIsAuthenticated(false);
            setCurrentUser(null);
            disconnect();

            // 2. Clear server-side session and Supabase
            setAuthToken(null);
            await Promise.allSettled([
                apiLogout(),
                supabase.auth.signOut()
            ]);
        } catch (error) {
            console.error('[AuthContext] Logout error:', error);
        } finally {
            // 3. Absolute cleanup of email and tokens
            localStorage.removeItem("email");
            localStorage.removeItem("token");
            localStorage.removeItem("refresh_token");

            // Clear any keys starting with sb- (Supabase)
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('sb-')) localStorage.removeItem(key);
            });

            // 4. Evict all cached data — prevents stale/fake data after logout
            cacheClear();

            // 5. Navigate to login using SPA navigation. A full page reload
            // (`window.location.href`) re-mounts the app, which re-fires the
            // auth init and any protected request that 401s — which loops
            // right back into logout. SPA navigation avoids the remount.
            navigate("/login", { replace: true });

            // Reset guard after navigation is initiated
            isLoggingOutRef.current = false;
        }
    }, [disconnect, navigate]);

    // Internal function to sync with backend after supabase login
    const syncWithBackend = useCallback(async (accessToken, refreshToken) => {
        try {
            if (accessToken) setAuthToken(accessToken);
            await apiSync(accessToken, refreshToken);

            const userProfile = await getProfile();
            const user = {
                ...userProfile,
                avatar: userProfile.avatar || null
            };

            setCurrentUser(user);
            setIsAuthenticated(true);

            if (userProfile.email) {
                localStorage.setItem("email", userProfile.email);
            }
            if (accessToken) localStorage.setItem("token", accessToken);
            if (refreshToken) localStorage.setItem("refresh_token", refreshToken);

            connect();
            return true;
        } catch (error) {
            console.error("[AuthContext] Sync failed:", error);
            return false;
        }
    }, [connect]);

    // Handle URL hash for Supabase auth redirects (e.g., email verification)
    useEffect(() => {
        const handleHash = async () => {
            const hash = window.location.hash;
            if (hash && (hash.includes("access_token") || hash.includes("token_type=signup"))) {
                const params = new URLSearchParams(hash.substring(1));
                const accessToken = params.get("access_token");
                const refreshToken = params.get("refresh_token");

                if (accessToken) {
                    const success = await syncWithBackend(accessToken, refreshToken);
                    if (success) {
                        window.history.replaceState(null, null, window.location.pathname);
                    }
                }
            }
        };
        handleHash();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Refs to hold latest callback versions without causing the effect to re-run
    const connectRef = useRef(connect);
    const logoutRef = useRef(logout);
    const syncWithBackendRef = useRef(syncWithBackend);
    useEffect(() => { connectRef.current = connect; }, [connect]);
    useEffect(() => { logoutRef.current = logout; }, [logout]);
    useEffect(() => { syncWithBackendRef.current = syncWithBackend; }, [syncWithBackend]);

    // Centralized Authentication Listener & Initializer — runs ONCE on mount only
    useEffect(() => {
        let isMounted = true;

        const initializeAuth = async () => {
            try {
                // Rely on getProfile to check if we are authenticated via cookies
                const userProfile = await getProfile();
                if (isMounted) {
                    // Don't auto-authenticate on public pages - require explicit login
                    const isPublicPage = ['/login', '/signup', '/', '/giveaway'].includes(window.location.pathname);
                    if (!isPublicPage) {
                        setCurrentUser({ ...userProfile, avatar: userProfile.avatar || null });
                        setIsAuthenticated(true);
                        connectRef.current();
                    } else {
                        // On public pages, clear any auth state to prevent redirect loops
                        setCurrentUser(null);
                        setIsAuthenticated(false);
                    }
                }
            } catch (err) {
                console.error('[AuthContext] Auth init fail (likely non-authenticated):', err);

                // If the error is a 429 (Rate Limit), do NOT attempt legacy token migration
                // because it will just spam /auth/sync and make the rate limit ban longer.
                const isRateLimit = err?.response?.status === 429;

                // Skip legacy token migration on public pages to prevent redirect loops
                const isPublicPage = ['/login', '/signup', '/', '/giveaway'].includes(window.location.pathname);

                // MIGRATION FALLBACK: If cookie auth failed, check if we have legacy localStorage tokens
                const legacyToken = localStorage.getItem("token");
                const legacyRefreshToken = localStorage.getItem("refresh_token");

                if (legacyToken && isMounted && !isRateLimit && !isPublicPage) {
                    console.info('[AuthContext] Found legacy tokens, attempting migration to cookies...');
                    setAuthToken(legacyToken);
                    const success = await syncWithBackendRef.current(legacyToken, legacyRefreshToken);
                    if (success) {
                        try {
                            const userProfile = await getProfile();
                            if (isMounted) {
                                setCurrentUser({ ...userProfile, avatar: userProfile.avatar || null });
                                setIsAuthenticated(true);
                                connectRef.current();
                            }
                        } catch (profileErr) {
                            console.error('[AuthContext] Migration succeeded but profile fetch failed:', profileErr);
                        }
                    }
                }
            } finally {
                if (isMounted) {
                    setIsAuthLoading(false);
                    // Safety net: guarantee public pages are never authenticated
                    // (handles any race condition from Supabase session restore)
                    const isPublicPage = ['/login', '/signup', '/', '/giveaway'].includes(window.location.pathname);
                    if (isPublicPage) {
                        setIsAuthenticated(false);
                        setCurrentUser(null);
                    }
                }
            }
        };

        initializeAuth();

        // Listen for all Supabase Auth events
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            const isPublicPage = ['/login', '/signup', '/', '/giveaway'].includes(window.location.pathname);
            if (event === 'SIGNED_IN' && session) {
                // Don't auto-authenticate on public pages
                if (!isPublicPage) {
                    await syncWithBackendRef.current(session.access_token, session.refresh_token);
                } else {
                    // Explicitly clear auth state on public pages if Supabase fires SIGNED_IN
                    setIsAuthenticated(false);
                    setCurrentUser(null);
                }
            } else if (event === 'SIGNED_OUT') {
                setIsAuthenticated(false);
                setCurrentUser(null);
            }
        });

        // Forced logout event from API interceptors
        const handleForcedLogout = () => {
            console.warn('[AuthContext] Forced logout triggered');
            logoutRef.current();
        };

        window.addEventListener("auth:logout", handleForcedLogout);

        // Supabase's internal session recovery on cold page load races our calls
        // and aborts its own getSession(), surfacing as an uncaught
        // "AbortError: signal is aborted without reason". We already handle this
        // gracefully in setSupabaseSession and WebSocketContext.connect, so
        // suppress the uncached rejection instead of letting it crash the runtime.
        const handleUnhandledRejection = (event) => {
            const reason = event?.reason;
            if (
                reason &&
                (reason?.name === "AbortError" ||
                    reason?.message?.includes("signal is aborted without reason"))
            ) {
                event.preventDefault();
            }
        };
        window.addEventListener("unhandledrejection", handleUnhandledRejection);

        return () => {
            isMounted = false;
            subscription.unsubscribe();
            window.removeEventListener("auth:logout", handleForcedLogout);
            window.removeEventListener("unhandledrejection", handleUnhandledRejection);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Subscribe to subscription_expired WS events.
    // We fire a window CustomEvent so UIContext can open the modal
    // without creating a circular context dependency.
    useEffect(() => {
        if (!isAuthenticated) return;

        const unsubscribe = subscribe("subscription_expired", (data) => {
            // Downgrade the local user immediately so the UI reflects free plan
            setCurrentUser(prev => prev ? { ...prev, planType: "free" } : prev);

            // Toast so something shows even before the modal opens
            toast.info("Your Pro plan has expired.", { duration: 4000 });

            // Let UIContext handle opening the modal
            window.dispatchEvent(new CustomEvent("plan:expired", { detail: data }));
        });

        return () => unsubscribe();
    }, [isAuthenticated, subscribe]);

    const login = useCallback(async (email, password) => {
        try {
            const data = await apiLogin(email, password);
            if (data.token) {
                setAuthToken(data.token);
                localStorage.setItem("token", data.token);
            }
            if (data.refresh_token) {
                localStorage.setItem("refresh_token", data.refresh_token);
            }
            if (email) localStorage.setItem("email", email);

            await setSupabaseSession({
                access_token: data.token,
                refresh_token: data.refresh_token
            });

            const userProfile = await getProfile();
            setCurrentUser({ ...userProfile, avatar: userProfile.avatar || null });
            setIsAuthenticated(true);
            // Hand the websocket the token we just minted instead of asking
            // supabase for it, whose getSession can abort during page load.
            connect(data.token);
            
            // Check giveaway win (fire and forget)
            checkGiveawayWin();
            
            return data;
        } catch (error) {
            console.error("[AuthContext] Login failed:", error);
            throw error;
        }
    }, [connect, setSupabaseSession, checkGiveawayWin]);

    const signup = useCallback(async (name, email, password) => {
        const data = await apiSignup(email, password, name);
        if (data.token) {
            setAuthToken(data.token);
            localStorage.setItem("token", data.token);
        }
        if (data.refresh_token) {
            localStorage.setItem("refresh_token", data.refresh_token);
        }
        const userProfile = await getProfile();
        setCurrentUser({ ...userProfile, avatar: userProfile.avatar || null });
        setIsAuthenticated(true);
        connect();
        
        // Check giveaway win (fire and forget)
        checkGiveawayWin();
        
        return data;
    }, [connect, checkGiveawayWin]);

    const updateUser = useCallback(async (updatedData) => {
        if (!currentUser) return;
        const updatedProfile = await updateProfile(currentUser.username, updatedData);
        if (updatedProfile) {
            setCurrentUser(prev => ({ ...prev, ...updatedProfile }));
        }
        return updatedProfile;
    }, [currentUser]);

    const refetchUser = useCallback(async () => {
        try {
            const userProfile = await getProfile();
            setCurrentUser(prev => ({ ...prev, ...userProfile, avatar: userProfile.avatar || null }));
            return userProfile;
        } catch (error) {
            console.error("[AuthContext] refetchUser failed:", error);
        }
    }, []);

    const value = useMemo(() => ({
        isAuthenticated,
        isAuthLoading,
        currentUser,
        login,
        signup,
        logout,
        syncWithBackend,
        updateUser,
        refetchUser,
    }), [isAuthenticated, isAuthLoading, currentUser, login, signup, logout, syncWithBackend, updateUser, refetchUser]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
