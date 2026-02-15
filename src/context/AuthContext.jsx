import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import {
    signup as apiSignup,
    login as apiLogin,
    logout as apiLogout,
    sync as apiSync,
} from "../api/auth";
import { getProfile, updateProfile } from "../api/profile";
import { supabase } from "../utils/supabase";
import { useWebSocketContext } from "./WebSocketContext";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const { connect, disconnect } = useWebSocketContext();
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
            await Promise.allSettled([
                apiLogout(),
                supabase.auth.signOut()
            ]);
        } catch (error) {
            console.error('[AuthContext] Logout error:', error);
        } finally {
            // 3. Absolute cleanup of email and Supabase tokens
            localStorage.removeItem("email");

            // Clear any keys starting with sb- (Supabase)
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('sb-')) localStorage.removeItem(key);
            });

            // Only redirect if we weren't already on a clean state or if specifically requested
            // This prevents the infinite reload loop when refresh fails
            const isAtFeed = window.location.pathname === "/feed";
            if (!isAtFeed) {
                window.location.href = "/feed";
            }
        }
    }, [disconnect]);

    // Internal function to sync with backend after supabase login
    const syncWithBackend = useCallback(async (accessToken, refreshToken) => {
        try {
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
    }, [syncWithBackend]);

    // Centralized Authentication Listener & Initializer
    useEffect(() => {
        let isMounted = true;

        const initializeAuth = async () => {
            try {
                // Rely on getProfile to check if we are authenticated via cookies
                const userProfile = await getProfile();
                if (isMounted) {
                    setCurrentUser({ ...userProfile, avatar: userProfile.avatar || null });
                    setIsAuthenticated(true);
                    connect();

                    // Cleanup legacy localStorage tokens if we are now confirmed cookie-authenticated
                    localStorage.removeItem("token");
                    localStorage.removeItem("refresh_token");
                }
            } catch (err) {
                console.error('[AuthContext] Auth init fail (likely non-authenticated):', err);

                // MIGRATION FALLBACK: If cookie auth failed, check if we have legacy localStorage tokens
                const legacyToken = localStorage.getItem("token");
                const legacyRefreshToken = localStorage.getItem("refresh_token");

                if (legacyToken && isMounted) {
                    console.info('[AuthContext] Found legacy tokens, attempting migration to cookies...');
                    const success = await syncWithBackend(legacyToken, legacyRefreshToken);
                    if (success) {
                        // FIX: Immediately fetch profile and update state so user is logged in
                        try {
                            const userProfile = await getProfile();
                            if (isMounted) {
                                setCurrentUser({ ...userProfile, avatar: userProfile.avatar || null });
                                setIsAuthenticated(true);
                                connect();

                                // Cleanup after successful migration & state update
                                localStorage.removeItem("token");
                                localStorage.removeItem("refresh_token");
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
                // If signed in to Supabase but not our backend, sync it
                // Note: isAuthenticated check is safer to avoid redundant syncs
                await syncWithBackend(session.access_token, session.refresh_token);
            } else if (event === 'SIGNED_OUT') {
                setIsAuthenticated(false);
                setCurrentUser(null);
                // Note: Actual cleanup is handled by the logout function or manually if needed
            }
        });

        // Forced logout event from API interceptors
        const handleForcedLogout = () => {
            console.warn('[AuthContext] Forced logout triggered');
            logout();
        };

        window.addEventListener("auth:logout", handleForcedLogout);

        return () => {
            isMounted = false;
            subscription.unsubscribe();
            window.removeEventListener("auth:logout", handleForcedLogout);
        };
    }, [connect, logout, syncWithBackend]);

    const login = useCallback(async (email, password) => {
        try {
            const data = await apiLogin(email, password);
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
