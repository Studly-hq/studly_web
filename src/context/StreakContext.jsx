import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import { useWebSocketContext } from "./WebSocketContext";
import client from "../api/client";

const StreakContext = createContext();

export const useStreak = () => {
  const context = useContext(StreakContext);
  if (!context) {
    throw new Error("useStreak must be used within StreakProvider");
  }
  return context;
};

export const StreakProvider = ({ children }) => {
  const [streakData, setStreakData] = useState({
    current_streak: 0,
    highest_streak: 0,
    freeze_count: 0,
    max_freezes: 0,
    is_pro: false,
    can_restore: false,
    grace_expires_at: null,
    previous_streak: null,
  });
  const [dailyStreakData, setDailyStreakData] = useState(null);
  const [streakLostData, setStreakLostData] = useState(null);
  const [calendarData, setCalendarData] = useState({});
  const [lastKnownStreak, setLastKnownStreak] = useState(0);
  const hasFetchedRef = useRef(false);
  const { isAuthenticated } = useAuth();
  const { subscribe } = useWebSocketContext();

  const fetchStreakStatus = useCallback(async () => {
    try {
      // Use /aura/summary which returns { aura_points, current_streak, highest_streak }
      const res = await client.get("/aura/summary");
      const data = res.data || {};
      const streakData = {
        current_streak: data.current_streak ?? 0,
        highest_streak: data.highest_streak ?? 0,
        freeze_count: data.freeze_count ?? 0,
        max_freezes: data.max_freezes ?? (data.is_pro ? 2 : 0),
        is_pro: data.is_pro ?? false,
        can_restore: data.can_restore ?? false,
        grace_expires_at: data.grace_expires_at ?? null,
        previous_streak: data.previous_streak ?? null,
      };
      setStreakData(streakData);
      return streakData;
    } catch (error) {
      console.error("Failed to fetch streak status:", error);
      return null;
    }
  }, []);

  const fetchStreakCalendar = useCallback(async (days = 365) => {
    try {
      // Backend doesn't have calendar endpoint yet - return empty for now
      setCalendarData({});
      return {};
    } catch (error) {
      console.error("Failed to fetch streak calendar:", error);
      return {};
    }
  }, []);

  const initializeStreak = useCallback(async () => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const status = await fetchStreakStatus();
    if (status) {
      // Check for daily streak increment
      const currentStreak = status.current_streak ?? 0;
      if (currentStreak > lastKnownStreak && lastKnownStreak > 0) {
        // Check if it's a milestone
        const milestones = [1, 3, 7, 14, 30, 60, 100, 200, 365, 500, 750, 1000];
        const isMilestone = milestones.includes(currentStreak);

        if (!isMilestone) {
          // Show daily streak modal
          setDailyStreakData({ type: "daily", streak: currentStreak });
        } else {
          // Milestone will be handled by CelebrationContext via WS
          // But we also show daily modal for milestones
          setDailyStreakData({ type: "daily", streak: currentStreak });
        }
      } else if (currentStreak === 1 && lastKnownStreak === 0) {
        // First day
        setDailyStreakData({ type: "daily", streak: 1 });
      }

      setLastKnownStreak(currentStreak);
      localStorage.setItem("lastKnownStreak", String(currentStreak));
    }

    await fetchStreakCalendar();
  }, [fetchStreakStatus, fetchStreakCalendar]);

  // Load last known streak from localStorage on init
  useEffect(() => {
    const stored = localStorage.getItem("lastKnownStreak");
    if (stored) {
      setLastKnownStreak(parseInt(stored, 10));
    }
  }, []);

  // Initialize on auth
  useEffect(() => {
    if (isAuthenticated) {
      initializeStreak();
    }
  }, [isAuthenticated, initializeStreak]);

  // WebSocket handlers
  useEffect(() => {
    if (!isAuthenticated) return;

    const unsubscribeIncremented = subscribe("StreakIncremented", (data) => {
      const { new_streak, is_milestone, milestone_type } = data;
      setStreakData((prev) => ({ ...prev, current_streak: new_streak }));
      setLastKnownStreak(new_streak);
      localStorage.setItem("lastKnownStreak", String(new_streak));

      if (!is_milestone) {
        setDailyStreakData({ type: "daily", streak: new_streak });
      }
      // Milestones handled by CelebrationContext
    });

    const unsubscribeFrozen = subscribe("StreakFrozen", (data) => {
      const { streak_value, freezes_remaining } = data;
      setStreakData((prev) => ({
        ...prev,
        freeze_count: freezes_remaining,
        current_streak: streak_value,
      }));
      setDailyStreakData({ type: "freeze", streak: streak_value, freezesRemaining: freezes_remaining });
    });

    const unsubscribeRestored = subscribe("StreakRestored", (data) => {
      const { new_streak } = data;
      setStreakData((prev) => ({ ...prev, current_streak: new_streak }));
      setLastKnownStreak(new_streak);
      localStorage.setItem("lastKnownStreak", String(new_streak));
      setDailyStreakData({ type: "comeback", streak: new_streak });
    });

    const unsubscribeLost = subscribe("StreakLost", (data) => {
      const { previous_streak, grace_expires_at, can_restore, message } = data;
      setStreakData((prev) => ({
        ...prev,
        current_streak: 1,
        can_restore: can_restore,
        grace_expires_at: grace_expires_at,
        previous_streak: previous_streak,
      }));
      setStreakLostData({
        previousStreak: previous_streak,
        canRestore: can_restore,
        graceExpiresAt: grace_expires_at,
        isPro: can_restore, // can_restore implies Pro
        restoresRemaining: 0, // Will be updated from status
        restoresUsedThisMonth: 0,
        lostAt: new Date().toISOString(),
      });
    });

    return () => {
      unsubscribeIncremented();
      unsubscribeFrozen();
      unsubscribeRestored();
      unsubscribeLost();
    };
  }, [isAuthenticated, subscribe]);

  const closeDailyStreak = useCallback(() => {
    setDailyStreakData(null);
  }, []);

  const closeStreakLost = useCallback(() => {
    setStreakLostData(null);
  }, []);

  const restoreStreak = useCallback(async () => {
    try {
      await client.post("/streak/restore");
      await fetchStreakStatus();
    } catch (error) {
      console.error("Failed to restore streak:", error);
    }
  }, [fetchStreakStatus]);

  const value = React.useMemo(
    () => ({
      streakData,
      dailyStreakData,
      streakLostData,
      calendarData,
      showDailyStreak: !!dailyStreakData,
      showStreakLost: !!streakLostData,
      closeDailyStreak,
      closeStreakLost,
      restoreStreak,
      fetchStreakStatus,
      fetchStreakCalendar,
    }),
    [
      streakData,
      dailyStreakData,
      streakLostData,
      calendarData,
      closeDailyStreak,
      closeStreakLost,
      restoreStreak,
      fetchStreakStatus,
      fetchStreakCalendar,
    ]
  );

  return (
    <StreakContext.Provider value={value}>
      {children}
    </StreakContext.Provider>
  );
};