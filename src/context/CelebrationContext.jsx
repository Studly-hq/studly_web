import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const CelebrationContext = createContext();

// Milestone thresholds
const AURA_MILESTONES = [10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000];
const STREAK_MILESTONES = [1, 7, 30]; // First day, 1 week, 1 month

export const useCelebration = () => {
    const context = useContext(CelebrationContext);
    if (!context) {
        throw new Error("useCelebration must be used within CelebrationProvider");
    }
    return context;
};

export const CelebrationProvider = ({ children }) => {
    const [showCelebration, setShowCelebration] = useState(false);
    const [celebrationData, setCelebrationData] = useState(null);

    // Get stored previous values from localStorage
    const getPreviousValues = useCallback(() => {
        const prevAura = parseInt(localStorage.getItem('prevAuraPoints') || '0', 10);
        const prevStreak = parseInt(localStorage.getItem('prevStreak') || '0', 10);
        return { prevAura, prevStreak };
    }, []);

    // Store new values to localStorage
    const storeValues = useCallback((aura, streak) => {
        localStorage.setItem('prevAuraPoints', String(aura));
        localStorage.setItem('prevStreak', String(streak));
    }, []);

    // Check if any milestone was crossed
    const checkMilestones = useCallback((newAura, newStreak) => {
        const { prevAura, prevStreak } = getPreviousValues();

        // Always update stored values
        storeValues(newAura, newStreak);

        // Check aura milestones (only if increased)
        if (newAura > prevAura) {
            for (const milestone of AURA_MILESTONES) {
                if (prevAura < milestone && newAura >= milestone) {
                    setCelebrationData({
                        type: 'aura',
                        value: milestone,
                        message: getAuraMessage(milestone),
                    });
                    setShowCelebration(true);
                    return;
                }
            }
        }

        // Check streak milestones (only if increased)
        if (newStreak > prevStreak) {
            // Fixed milestones: 1, 7, 30
            for (const milestone of STREAK_MILESTONES) {
                if (prevStreak < milestone && newStreak >= milestone) {
                    setCelebrationData({
                        type: 'streak',
                        value: milestone,
                        message: getStreakMessage(milestone),
                    });
                    setShowCelebration(true);
                    return;
                }
            }

            // Weekly streak celebration (every 7 days after 30)
            if (newStreak > 30 && newStreak % 7 === 0) {
                setCelebrationData({
                    type: 'streak-weekly',
                    value: newStreak,
                    message: `${Math.floor(newStreak / 7)} week streak! 🔥`,
                });
                setShowCelebration(true);
                return;
            }
        }
    }, [getPreviousValues, storeValues]);

    const closeCelebration = useCallback(() => {
        setShowCelebration(false);
        setCelebrationData(null);
    }, []);

    const value = React.useMemo(() => ({
        showCelebration,
        celebrationData,
        checkMilestones,
        closeCelebration,
    }), [showCelebration, celebrationData, checkMilestones, closeCelebration]);

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
    };
    return messages[milestone] || `${milestone} day streak! 🔥`;
}
