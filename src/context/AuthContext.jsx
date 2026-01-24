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

    const logout = useCallback(() => {
        setIsAuthenticated(false);
        setCurrentUser(null);
        localStorage.removeItem("studly_token");
        localStorage.removeItem("studly_refresh_token");
        disconnect();

        apiLogout().catch(error => {
            console.error("Logout failed on server:", error);
        });
        supabase.auth.signOut().catch(error => {
            console.warn("Supabase signout failed:", error);
        });
    }, [disconnect]);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem("studly_token");
                if (token) {
                    try {
                        const userProfile = await getProfile();
                        if (userProfile) {
                            setIsAuthenticated(true);
                            setCurrentUser({
                                ...userProfile,
                                avatar: userProfile.avatar || null
                            });
                            return;
                        }
                    } catch (err) {
                        localStorage.removeItem("studly_token");
                        localStorage.removeItem("studly_refresh_token");
                    }
                }
            } finally {
                setIsAuthLoading(false);
            }
        };
        checkAuth();
    }, []);

    useEffect(() => {
        const handleForcedLogout = () => {
            setIsAuthenticated(false);
            setCurrentUser(null);
            disconnect();
            supabase.auth.signOut();
        };

        window.addEventListener("auth:logout", handleForcedLogout);
        return () => {
            window.removeEventListener("auth:logout", handleForcedLogout);
        };
    }, [disconnect]);

    const login = useCallback(
        async (email, password) => {
            try {
                const data = await apiLogin(email, password);
                if (data.token) localStorage.setItem("studly_token", data.token);
                if (data.refresh_token) localStorage.setItem("studly_refresh_token", data.refresh_token);

                if (data.token && data.refresh_token) {
                    supabase.auth.setSession({
                        access_token: data.token,
                        refresh_token: data.refresh_token
                    }).catch(err => console.warn("Supabase session sync failed:", err));
                }

                if (data.token) {
                    Promise.resolve().then(() => connect(data.token));
                }

                const userProfile = await getProfile();
                const user = userProfile ? {
                    ...userProfile,
                    avatar: userProfile.avatar || null
                } : {
                    ...data.user,
                    email: email,
                    avatar: data.user?.avatar || null
                };

                setCurrentUser(user);
                setIsAuthenticated(true);
                return data;
            } catch (error) {
                console.error("Login failed context:", error);
                throw error;
            }
        }, [connect]
    );

    const signup = useCallback(async (name, email, password) => {
        try {
            const data = await apiSignup(email, password, name);

            // Auto-login after successful signup
            if (data.token) localStorage.setItem("studly_token", data.token);
            if (data.refresh_token) localStorage.setItem("studly_refresh_token", data.refresh_token);

            if (data.token && data.refresh_token) {
                supabase.auth.setSession({
                    access_token: data.token,
                    refresh_token: data.refresh_token
                }).catch(err => console.warn("Supabase session sync failed:", err));
            }

            if (data.token) {
                Promise.resolve().then(() => connect(data.token));
            }

            // Fetch profile or use signup response data
            let finalUser;
            try {
                const userProfile = await getProfile();
                finalUser = userProfile ? {
                    ...userProfile,
                    avatar: userProfile.avatar || null
                } : {
                    ...data.user,
                    name: name,
                    email: email,
                    avatar: data.user?.avatar || null
                };
            } catch (profileErr) {
                // If profile fetch fails, use data from signup response
                finalUser = {
                    ...data.user,
                    name: name,
                    email: email,
                    avatar: null
                };
            }

            setCurrentUser(finalUser);
            setIsAuthenticated(true);

            // Dispatch event to notify layout or other components if needed
            window.dispatchEvent(new CustomEvent("auth:status-change", { detail: { isAuthenticated: true, user: finalUser } }));

            return data;
        } catch (error) {
            console.error("Signup failed:", error);
            throw error;
        }
    }, [connect]);

    const syncWithBackend = useCallback(async (accessToken, refreshToken) => {
        try {
            const data = await apiSync(accessToken, refreshToken);
            if (data.token) localStorage.setItem("studly_token", data.token);
            if (data.refresh_token) localStorage.setItem("studly_refresh_token", data.refresh_token);

            if (data.token && data.refresh_token) {
                await supabase.auth.setSession({
                    access_token: data.token,
                    refresh_token: data.refresh_token
                });
            }

            const userProfile = await getProfile();

            setCurrentUser({
                ...userProfile,
                avatar: userProfile.avatar || null
            });
            setIsAuthenticated(true);

            const token = localStorage.getItem("studly_token");
            if (token) connect(token);
            return true;
        } catch (error) {
            if (error.response?.status === 409) {
                try {
                    const userProfile = await getProfile();
                    setCurrentUser({
                        ...userProfile,
                        avatar: userProfile.avatar || null
                    });
                    setIsAuthenticated(true);
                    const token = localStorage.getItem("studly_token");
                    if (token) connect(token);
                    return true;
                } catch (profileError) {
                    console.error("Failed to fetch profile after sync conflict:", profileError);
                    return false;
                }
            }
            console.error("Sync failed:", error);
            return false;
        }
    }, [connect]);

    const updateUser = useCallback(
        async (updatedData) => {
            try {
                if (!currentUser) return;
                const currentUsername = currentUser.username;
                const response = await updateProfile(currentUsername, updatedData);
                const updatedUser = { ...currentUser, ...response };
                setCurrentUser(updatedUser);
                return response;
            } catch (error) {
                console.error("Update user failed:", error);
                throw error;
            }
        },
        [currentUser]
    );

    const value = useMemo(() => ({
        isAuthenticated,
        isAuthLoading,
        currentUser,
        login,
        signup,
        logout,
        syncWithBackend,
        updateUser,
    }), [
        isAuthenticated,
        isAuthLoading,
        currentUser,
        login,
        signup,
        logout,
        syncWithBackend,
        updateUser,
    ]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
