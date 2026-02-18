import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from './AuthContext';
import { useWebSocketContext } from './WebSocketContext';
import { acknowledgeCelebration } from '../api/profile';

const CelebrationContext = createContext();

export const useCelebration = () => {
    const context = useContext(CelebrationContext);
    if (!context) {
        throw new Error("useCelebration must be used within CelebrationProvider");
    }
    return context;
};

export const CelebrationProvider = ({ children }) => {
    const [queue, setQueue] = useState([]);
    const [activeCelebration, setActiveCelebration] = useState(null);
    const processedIds = useRef(new Set()); // Track IDs to prevent double-popups in same session
    const { isAuthenticated } = useAuth();
    const { subscribe } = useWebSocketContext();

    const pushToQueue = useCallback((newItem) => {
        const id = `${newItem.type}-${newItem.value}`;
        if (processedIds.current.has(id)) {
            console.log(`[CelebrationContext] Deduplicating: ${id}`);
            return;
        }
        processedIds.current.add(id);

        console.log(`[CelebrationContext] Pushing to queue:`, newItem);
        setQueue(q => [...q, newItem]);
    }, []);

    const popQueue = useCallback(() => {
        setQueue(prev => {
            if (prev.length === 0) {
                setActiveCelebration(null);
                return [];
            }
            const [next, ...rest] = prev;
            setActiveCelebration(next);
            return rest;
        });
    }, []);

    // Sync active celebration with queue
    useEffect(() => {
        if (!activeCelebration && queue.length > 0) {
            popQueue();
        }
    }, [queue, activeCelebration, popQueue]);

    // Close celebration and acknowledge to backend
    const closeCelebration = useCallback(async () => {
        if (activeCelebration) {
            acknowledgeCelebration(activeCelebration.type, activeCelebration.value).catch(err => {
                console.error("Failed to acknowledge celebration:", err);
            });
        }
        setActiveCelebration(null);
    }, [activeCelebration]);

    // Subscribe to WebSocket celebration events from backend
    useEffect(() => {
        if (!isAuthenticated) return;

        console.log("[CelebrationContext] Subscribing to celebration events...");
        // Subscribe to celebration milestones
        const unsubscribeCelebration = subscribe('celebration_milestone', (data) => {
            console.log("[CelebrationContext] Received milestone:", data);
            // Data from backend: { user_id, milestone_type, value, message }
            if (data.value && data.milestone_type) {
                pushToQueue({
                    type: data.milestone_type,
                    value: data.value,
                    message: data.message,
                });
            }
        });

        // Subscribe to streak loss notifications
        const unsubscribeStreakLost = subscribe('streak_lost', (data) => {
            // Data from backend: { user_id, previous_streak, message }
            if (data.previous_streak) {
                pushToQueue({
                    type: 'streak-lost',
                    value: data.previous_streak,
                    message: data.message,
                });
            }
        });

        return () => {
            unsubscribeCelebration();
            unsubscribeStreakLost();
        };
    }, [isAuthenticated, subscribe, pushToQueue]);

    const value = React.useMemo(() => ({
        showCelebration: !!activeCelebration,
        celebrationData: activeCelebration,
        closeCelebration,
    }), [activeCelebration, closeCelebration]);

    return (
        <CelebrationContext.Provider value={value}>
            {children}
        </CelebrationContext.Provider>
    );
};
