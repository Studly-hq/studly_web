import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { getUserStreak, getUserAuraPoints } from '../api/profile';
import { useAuth } from './AuthContext';
import { useWebSocketContext } from './WebSocketContext';

const CelebrationContext = createContext();

// Milestone thresholds
const AURA_MILESTONES = [10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000];
const STREAK_MILESTONES = [1, 7, 30, 50, 100, 365];

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
    const { isAuthenticated, currentUser } = useAuth();
    const { subscribe } = useWebSocketContext();

    // Seen milestones to prevent duplicate celebrations
    const [seenMilestones, setSeenMilestones] = useState(() => {
        const saved = localStorage.getItem('studly_seen_milestones');
        return saved ? JSON.parse(saved) : [];
    });

    // Save seen milestones whenever they change
    useEffect(() => {
        localStorage.setItem('studly_seen_milestones', JSON.stringify(seenMilestones));
    }, [seenMilestones]);

    const pushToQueue = useCallback((newItem) => {
        const milestoneKey = `${newItem.type}:${newItem.value}`;

        setSeenMilestones(prev => {
            if (prev.includes(milestoneKey)) return prev;

            // If not seen, add to queue
            setQueue(q => [...q, newItem]);
            return [...prev, milestoneKey];
        });
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

    const checkMilestones = useCallback((newAura, newStreak) => {
        const newItems = [];

        // Check aura milestones
        for (const milestone of AURA_MILESTONES) {
            if (newAura >= milestone) {
                newItems.push({
                    type: 'aura',
                    value: milestone,
                    message: getAuraMessage(milestone),
                });
            }
        }

        // Check streak milestones
        if (newStreak) {
            for (const milestone of STREAK_MILESTONES) {
                if (newStreak >= milestone) {
                    newItems.push({
                        type: 'streak',
                        value: milestone,
                        message: getStreakMessage(milestone),
                    });
                }
            }

            // Weekly streak logic for high streaks
            if (newStreak > 30 && newStreak % 7 === 0) {
                newItems.push({
                    type: 'streak-weekly',
                    value: newStreak,
                    message: `${Math.floor(newStreak / 7)} weeks strong! 🔥`,
                });
            }
        }

        // Push all to queue (pushToQueue handles de-duplication)
        newItems.forEach(item => pushToQueue(item));
    }, [pushToQueue]);

    // 1. Initial catch-up check on mount/auth
    useEffect(() => {
        const fetchAndCheck = async () => {
            if (isAuthenticated && currentUser?.username) {
                try {
                    const [streak, points] = await Promise.all([
                        getUserStreak(currentUser.username),
                        getUserAuraPoints(currentUser.username)
                    ]);
                    checkMilestones(points, streak);
                } catch (err) {
                    console.error("Celebration catch-up failed:", err);
                }
            }
        };
        fetchAndCheck();
    }, [isAuthenticated, currentUser, checkMilestones]);

    // 2. Real-time updates via WebSocket
    useEffect(() => {
        if (!isAuthenticated) return;

        const unsubscribe = subscribe('aura_point_update', (data) => {
            // data contains { user_id, points }
            if (data.points) {
                // We don't have the streak in the WS event yet, 
                // so we check milestones with current known streak or null
                checkMilestones(data.points, null);
            }
        });

        return () => unsubscribe();
    }, [isAuthenticated, subscribe, checkMilestones]);

    const value = React.useMemo(() => ({
        showCelebration: !!activeCelebration,
        celebrationData: activeCelebration,
        closeCelebration: () => setActiveCelebration(null), // This triggers the useEffect to show next in queue
        checkMilestones, // Allow manual triggers (e.g. after a quiz)
    }), [activeCelebration, checkMilestones]);

    return (
        <CelebrationContext.Provider value={value}>
            {children}
        </CelebrationContext.Provider>
    );
};

// Helper functions for messages
function getAuraMessage(milestone) {
    const messages = {
        10: "You're getting started! 🌟",
        50: "Rising star! ⭐",
        100: "Triple digits! 💫",
        500: "On fire! 🔥",
        1000: "Legendary! 🏆",
        5000: "Unstoppable! 💪",
        10000: "Elite status! 👑",
        50000: "Master level! 🎓",
        100000: "Ultimate achiever! 🚀",
    };
    return messages[milestone] || "Amazing progress!";
}

function getStreakMessage(milestone) {
    const messages = {
        1: "First step! Keep going! 🚀",
        7: "One week strong! 💪",
        30: "One month champion! 🏆",
        50: "Half century! Incredible! 🎖️",
        100: "The Centurion! Absolute beast! 🔥",
        365: "A WHOLE YEAR! Legend Status! 👑",
    };
    return messages[milestone] || `${milestone} day streak! 🔥`;
}
