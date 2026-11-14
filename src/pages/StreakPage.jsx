import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStreak } from "../context/StreakContext";
import { useAuth } from "../context/AuthContext";
import StreakCalendar from "../components/ui/StreakCalendar";
import { StreakBadge } from "../components/ui/StreakBadge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FlameIcon,
  TrophyIcon,
  CalendarIcon,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons";
import {
  Shield,
  Crown,
  Lock,
  Info,
  RotateCcw,
} from "lucide-react";

const MILESTONES = [1, 3, 7, 14, 30, 60, 100, 200, 365, 500, 750, 1000];

const StreakPage = () => {
  const { streakData, calendarData, fetchStreakStatus, fetchStreakCalendar } = useStreak();
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [showProTooltip, setShowProTooltip] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchStreakStatus(), fetchStreakCalendar(365)]);
      setIsLoading(false);
    };
    loadData();
  }, [fetchStreakStatus, fetchStreakCalendar]);

  const currentStreak = streakData.current_streak ?? 0;
  const highestStreak = streakData.highest_streak ?? 0;
  const freezeCount = streakData.freeze_count ?? 0;
  const maxFreezes = streakData.max_freezes ?? 0;
  const isPro = streakData.is_pro ?? false;
  const canRestore = streakData.can_restore ?? false;
  const graceExpiresAt = streakData.grace_expires_at;
  const previousStreak = streakData.previous_streak;

  const getMilestoneProgress = (milestone) => {
    if (currentStreak >= milestone) return 100;
    return Math.round((currentStreak / milestone) * 100);
  };

  const nextMilestone = MILESTONES.find((m) => m > currentStreak) || MILESTONES[MILESTONES.length - 1];
  const nextMilestoneProgress = getMilestoneProgress(nextMilestone);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 pt-6 px-4 md:px-6 lg:px-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="h-8 w-48 bg-muted rounded" />
            <div className="mt-2 h-4 w-64 bg-muted rounded" />
          </div>
          <div className="h-8 w-24 bg-muted rounded-full" />
        </div>

        {/* 4-Card Grid Skeleton - just 2 cards on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-3 md:p-4">
              <div className="h-3 w-20 bg-muted rounded mb-2" />
              <div className="h-8 w-16 bg-muted rounded" />
            </div>
          ))}
        </div>

        {/* Next Milestone Skeleton */}
        <div className="rounded-2xl border border-border bg-card p-3 md:p-4">
          <div className="h-3 w-28 bg-muted rounded mb-3" />
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden border border-border">
            <div className="h-full rounded-full bg-muted" style={{ width: '67%' }} />
          </div>
        </div>

        {/* Calendar Heatmap Skeleton - simplified */}
        <div className="rounded-2xl border border-border bg-card p-3 md:p-4">
          <div className="h-5 w-36 bg-muted rounded mb-3" />
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 28 }).map((_, i) => (
              <div key={i} className="aspect-square rounded bg-muted" />
            ))}
          </div>
        </div>

        {/* Milestones Timeline Skeleton - just a few pills */}
        <div className="rounded-2xl border border-border bg-card p-3 md:p-4">
          <div className="h-5 w-24 bg-muted rounded mb-3" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 rounded-xl border bg-muted p-2.5 md:p-3 min-w-[72px]">
                <div className="h-5 w-5 bg-muted rounded" />
                <div className="h-3 w-20 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Pro Features Skeleton */}
        <div className="rounded-2xl border border-border bg-gradient-to-r from-primary/5 to-primary/10 p-3 md:p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex size-8 md:size-10 shrink-0 items-center justify-center rounded-lg bg-muted" />
            <div>
              <div className="h-5 w-40 bg-muted rounded" />
              <div className="mt-0.5 h-3 w-48 bg-muted rounded" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="size-4 bg-muted rounded shrink-0" />
                <div className="h-3 w-28 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pt-6 px-4 md:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-fluid-3xl font-medium leading-tight tracking-tight">
            Your Streak
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {isPro && (
            <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary whitespace-nowrap">
              <Crown size={14} strokeWidth={2} className="shrink-0" />
              Pro
            </span>
          )}
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Current Streak */}
        <div className="rounded-2xl border border-border bg-card p-3 md:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="min-w-0">
              <p className="font-geist text-fluid-xs text-muted-foreground truncate">Current Streak</p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="font-heading text-fluid-2xl md:text-fluid-3xl font-medium text-foreground">
                  {currentStreak}
                </span>
                <span className="font-geist text-fluid-sm text-muted-foreground">days</span>
              </div>
            </div>
            <div className="flex size-10 md:size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <HugeiconsIcon icon={FlameIcon} size={18} strokeWidth={2} className="text-primary" />
            </div>
          </div>
        </div>

        {/* Highest Streak */}
        <div className="rounded-2xl border border-border bg-card p-3 md:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="min-w-0">
              <p className="font-geist text-fluid-xs text-muted-foreground truncate">Highest Streak</p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="font-heading text-fluid-2xl md:text-fluid-3xl font-medium text-foreground">
                  {highestStreak}
                </span>
                <span className="font-geist text-fluid-sm text-muted-foreground">days</span>
              </div>
            </div>
            <div className="flex size-10 md:size-12 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <HugeiconsIcon icon={TrophyIcon} size={18} strokeWidth={2} className="text-amber-500" />
            </div>
          </div>
        </div>

        {/* Streak Freezes */}
        <div className="rounded-2xl border border-border bg-card p-3 md:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="min-w-0">
              <p className="font-geist text-fluid-xs text-muted-foreground truncate">Freezes</p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="font-heading text-fluid-2xl md:text-fluid-3xl font-medium text-foreground">
                  {freezeCount}
                </span>
                <span className="font-geist text-fluid-sm text-muted-foreground">/ {maxFreezes}</span>
              </div>
            </div>
            <div className="flex size-10 md:size-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Shield size={18} strokeWidth={2} className="text-blue-500" />
            </div>
          </div>
        </div>

        {/* Restore Status */}
        <div className="rounded-2xl border border-border bg-card p-3 md:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="min-w-0">
              <p className="font-geist text-fluid-xs text-muted-foreground truncate">Streak Restore</p>
              {canRestore ? (
                <p className="mt-1 font-geist text-fluid-sm font-medium text-green-600 dark:text-green-400 truncate">
                  Available
                </p>
              ) : isPro ? (
                <p className="mt-1 font-geist text-fluid-sm font-medium text-muted-foreground truncate">
                  Not available
                </p>
              ) : (
                <p className="mt-1 font-geist text-fluid-sm font-medium text-muted-foreground truncate">
                  Pro feature
                </p>
              )}
            </div>
            <div className="flex size-10 md:size-12 shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
              {canRestore ? (
                <RotateCcw size={18} strokeWidth={2} className="text-green-500" />
              ) : isPro ? (
                <Info size={18} strokeWidth={2} className="text-muted-foreground" />
              ) : (
                <Lock size={18} strokeWidth={2} className="text-muted-foreground" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Next Milestone Progress */}
      <div className="rounded-2xl border border-border bg-card p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="min-w-0">
            <p className="font-geist text-fluid-sm text-muted-foreground truncate">Next Milestone</p>
            <h3 className="mt-1 font-heading text-fluid-2xl font-medium truncate">
              Day {nextMilestone} <span className="font-geist font-normal text-muted-foreground">milestone</span>
            </h3>
          </div>
          <div className="flex size-10 md:size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <HugeiconsIcon icon={TrophyIcon} size={19} strokeWidth={2} className="text-primary" />
          </div>
        </div>
        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden border border-border">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${nextMilestoneProgress}%`,
              backgroundColor: 'var(--primary)',
            }}
          />
        </div>
        <p className="mt-1 font-geist text-fluid-xs text-muted-foreground">
          {currentStreak} / {nextMilestone} days ({nextMilestoneProgress}%)
        </p>
      </div>

      {/* Calendar Heatmap */}
      <div className="rounded-2xl border border-border bg-card p-3 md:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <div className="min-w-0">
            <h2 className="font-heading text-fluid-lg font-medium truncate">Activity Calendar</h2>
            <p className="mt-0.5 font-geist text-fluid-xs text-muted-foreground truncate">
              Last 365 days • Orange = active day
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="font-geist text-fluid-xs text-muted-foreground hidden sm:inline">Less</span>
            <div className="flex gap-0.5">
              <div className="size-2 rounded bg-[#ebedf0] dark:bg-[#161b22]" />
              <div className="size-2 rounded bg-[#ff4500]" />
            </div>
            <span className="font-geist text-fluid-xs text-muted-foreground hidden sm:inline">More</span>
          </div>
        </div>
        <div className="overflow-x-auto -mx-1 md:mx-0 px-1 md:px-0">
          <StreakCalendar
            data={calendarData}
            cellSize={9}
            cellGap={2}
            showLegend={false}
            showMonthLabels={true}
            className="min-w-max"
          />
        </div>
      </div>

      {/* Milestones Timeline */}
      <div className="rounded-2xl border border-border bg-card p-3 md:p-4">
        <h2 className="font-heading text-fluid-lg font-medium mb-3 truncate">Milestones</h2>
        <div className="flex flex-wrap gap-2 md:gap-3">
          {MILESTONES.map((milestone) => {
            const achieved = currentStreak >= milestone;
            const isNext = milestone === nextMilestone;
            return (
              <button
                key={milestone}
                type="button"
                disabled
                className={`flex flex-col items-center gap-1.5 rounded-xl border px-3 md:px-4 py-2.5 md:py-3 transition-all min-w-[72px] md:min-w-[80px] flex-1 md:flex-initial ${
                  achieved
                    ? "border-primary/30 bg-primary/5 text-primary"
                    : isNext
                    ? "border-primary/30 bg-primary/5 text-primary"
                    : "border-border bg-muted text-muted-foreground"
                }`}
                title={achieved ? "Achieved" : isNext ? "Next milestone" : "Locked"}
              >
                {achieved ? (
                    <HugeiconsIcon
                      icon={TrophyIcon}
                      size={19}
                      strokeWidth={2}
                      className="text-primary"
                    />
                  ) : (
                    <Lock size={17} strokeWidth={2} className="text-muted-foreground" />
                  )}
                <span className="font-geist text-fluid-xs md:text-[10px] font-medium text-center truncate">
                  Day {milestone}
                </span>
                {achieved && <span className="text-[8px] md:text-[9px] text-primary/70">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pro Features Section */}
      {!isPro && (
        <div className="rounded-2xl border border-border bg-gradient-to-r from-primary/5 to-primary/10 p-3 md:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex size-8 md:size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Crown size={18} strokeWidth={2} className="text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="font-heading text-fluid-base md:text-fluid-lg font-medium truncate">Upgrade to Studly Pro</h3>
                <p className="mt-0.5 font-geist text-fluid-xs text-muted-foreground truncate">
                  Unlock streak protection & premium features
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open-paywall", { detail: { reason: "streak_pro" } }))}
              className="flex h-8 md:h-9 shrink-0 items-center justify-center gap-1.5 rounded-full bg-primary px-3 md:px-4 font-geist text-fluid-xs md:text-fluid-sm font-medium text-primary-foreground transition-opacity hover:opacity-85 whitespace-nowrap"
            >
              <HugeiconsIcon icon={ArrowRight02Icon} size={13} strokeWidth={2} />
              Upgrade
            </button>
          </div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 text-fluid-xs md:text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Shield size={13} strokeWidth={2} className="text-primary shrink-0" />
              <span className="truncate">2 streak freezes/month</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <RotateCcw size={13} strokeWidth={2} className="text-primary shrink-0" />
              <span className="truncate">48-hour restore grace</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Crown size={13} strokeWidth={2} className="text-primary shrink-0" />
              <span className="truncate">2 streak restores/month</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <HugeiconsIcon icon={TrophyIcon} size={13} strokeWidth={2} className="text-primary shrink-0" />
              <span className="truncate">All milestone rewards</span>
            </div>
          </div>
        </div>
      )}

      {isPro && (
        <div className="rounded-2xl border border-border bg-card p-3 md:p-4">
          <h3 className="font-heading text-fluid-base md:text-fluid-lg font-medium flex items-center gap-1.5 truncate">
            <Crown size={17} strokeWidth={2} className="text-primary shrink-0" />
            Pro Streak Protection Active
          </h3>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
            <div className="rounded-lg border border-border bg-muted/50 p-2 md:p-3">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Shield size={13} strokeWidth={2} className="text-blue-500 shrink-0" />
                <span className="font-geist text-fluid-xs md:text-[10px] font-medium truncate">Freezes</span>
              </div>
              <p className="font-heading text-fluid-xl md:text-fluid-2xl font-medium">{freezeCount} / {maxFreezes}</p>
              <p className="mt-0.5 font-geist text-fluid-xs md:text-[9px] text-muted-foreground truncate">Refills 1st of each month</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/50 p-2 md:p-3">
              <div className="flex items-center gap-1.5 mb-0.5">
                <RotateCcw size={13} strokeWidth={2} className="text-green-500 shrink-0" />
                <span className="font-geist text-fluid-xs md:text-[10px] font-medium truncate">Restores</span>
              </div>
              <p className="font-heading text-fluid-xl md:text-fluid-2xl font-medium">
                {canRestore ? "Available" : "Ready"}
              </p>
              <p className="mt-0.5 font-geist text-fluid-xs md:text-[9px] text-muted-foreground truncate">
                {canRestore && graceExpiresAt
                  ? `Expires ${new Date(graceExpiresAt).toLocaleDateString()}`
                  : "2/month • 48h grace period"}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/50 p-2 md:p-3">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Info size={13} strokeWidth={2} className="text-primary shrink-0" />
                <span className="font-geist text-fluid-xs md:text-[10px] font-medium truncate">Protection</span>
              </div>
              <p className="font-geist text-fluid-sm md:text-fluid-base text-foreground truncate">
                Your streak is protected
              </p>
              <p className="mt-0.5 font-geist text-fluid-xs md:text-[9px] text-muted-foreground truncate">
                Auto-freeze on missed days
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StreakPage;