import client from "./client";

/**
 * Streak API Service
 * Frontend endpoints for streak system V2
 */

export const getStreakStatus = async () => {
  const response = await client.get("/streak/status");
  return response.data;
};

export const getStreakCalendar = async (days = 365) => {
  const response = await client.get(`/streak/calendar?days=${days}`);
  return response.data;
};

export const recordStreakActivity = async (source, sourceId) => {
  const response = await client.post("/streak/activity", { source, source_id: sourceId });
  return response.data;
};

export const useStreakFreeze = async () => {
  const response = await client.post("/streak/freeze");
  return response.data;
};

export const restoreStreak = async () => {
  const response = await client.post("/streak/restore");
  return response.data;
};

export const getStreakHistory = async (limit = 50, offset = 0) => {
  const response = await client.get(`/streak/history?limit=${limit}&offset=${offset}`);
  return response.data;
};