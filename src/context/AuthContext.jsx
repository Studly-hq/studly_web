import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
    signup as apiSignup,
    login as apiLogin,
    logout as apiLogout,
    sync as apiSync,
} from "../api/auth";
import { setAuthToken } from "../api/client";
import { getProfile, updateProfile } from "../api/profile";
import { supabase } from "../utils/supabase";
import { useWebSocketContext } from "./WebSocketContext";
import { toast } from "sonner";

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
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    const logout = useCallback(async () => {
        // Pre-emptive state clear
        setIsAuthenticated(false);
        setCurrentUser(null);
        disconnect();

        try {
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

            // Only redirect if we weren't already on a clean state or if specifically requested
            // This prevents the infinite reload loop when refresh fails
            const isAtStudy = window.location.pathname === "/study";
            if (!isAtStudy) {
                window.location.href = "/study";
            }
        }
    }, [disconnect]);

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
                    setCurrentUser({ ...userProfile, avatar: userProfile.avatar || null });
                    setIsAuthenticated(true);
                    connectRef.current();
                }
            } catch (err) {
                console.error('[AuthContext] Auth init fail (likely non-authenticated):', err);

                // MIGRATION FALLBACK: If cookie auth failed, check if we have legacy localStorage tokens
                const legacyToken = localStorage.getItem("token");
                const legacyRefreshToken = localStorage.getItem("refresh_token");

                if (legacyToken && isMounted) {
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
                if (isMounted) setIsAuthLoading(false);
            }
        };

        initializeAuth();

        // Listen for all Supabase Auth events
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
                await syncWithBackendRef.current(session.access_token, session.refresh_token);
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

        return () => {
            isMounted = false;
            subscription.unsubscribe();
            window.removeEventListener("auth:logout", handleForcedLogout);
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

            await supabase.auth.setSession({
                access_token: data.token,
                refresh_token: data.refresh_token
            });

            const userProfile = await getProfile();
            setCurrentUser({ ...userProfile, avatar: userProfile.avatar || null });
            setIsAuthenticated(true);
            connect();
            return data;
        } catch (error) {
            console.error("[AuthContext] Login failed:", error);
            throw error;
        }
    }, [connect]);

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
        return data;
    }, [connect]);

    const updateUser = useCallback(async (updatedData) => {
        if (!currentUser) return;
        const updatedProfile = await updateProfile(currentUser.username, updatedData);
        if (updatedProfile) {
            setCurrentUser(prev => ({ ...prev, ...updatedProfile }));
        }
        return updatedProfile;
    }, [currentUser]);

    const value = useMemo(() => ({
        isAuthenticated,
        isAuthLoading,
        currentUser,
        login,
        signup,
        logout,
        syncWithBackend,
        updateUser,
    }), [isAuthenticated, isAuthLoading, currentUser, login, signup, logout, syncWithBackend, updateUser]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
