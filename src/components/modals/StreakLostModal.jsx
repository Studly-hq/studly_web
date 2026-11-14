import React, { useRef } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  ArrowRight02Icon,
  FlameIcon,
} from "@hugeicons/core-free-icons";
import { RotateCcw, Lock, Crown } from "lucide-react";
import { useStreak } from "../../context/StreakContext";
import StreakCalendar from "../../components/ui/StreakCalendar";

const EASE = [0.16, 1, 0.3, 1];

function formatDate(date, pattern = "yyyy-MM-dd") {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  if (pattern === "yyyy-MM-dd") return `${year}-${month}-${day}`;
  return `${month}/${day}/${year}`;
}

const StreakLostModal = () => {
  const {
    showStreakLost,
    streakLostData,
    closeStreakLost,
    restoreStreak: triggerRestore,
  } = useStreak();
  const reduce = useReducedMotion();
  const panelRef = useRef(null);

  // Build mini calendar data for last 30 days (must be before early return for hooks rules)
  const calendarData = React.useMemo(() => {
    if (!streakLostData?.lostAt) return {};
    const data = {};
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = formatDate(date);

      // Mark the lost day and surrounding days
      let active = true;
      let level = 1;

      const lostDate = new Date(streakLostData.lostAt);
      const diffDays = Math.floor((date - lostDate) / (1000 * 60 * 60 * 24));
      if (diffDays >= 0) {
        active = false;
        level = 0;
      }

      data[dateStr] = { level, active };
    }
    return data;
  }, [streakLostData?.lostAt]);

  React.useEffect(() => {
    if (!showStreakLost) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => panelRef.current?.focus(), 40);

    const onKeyDown = (event) => {
      if (event.key === "Escape") closeStreakLost();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [showStreakLost, closeStreakLost]);

  if (!showStreakLost || !streakLostData) return null;

  const {
    previousStreak,
    canRestore,
    graceExpiresAt,
    isPro,
    restoresRemaining,
    lostAt,
  } = streakLostData;

  const daysSinceLost = lostAt
    ? Math.floor((Date.now() - new Date(lostAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const graceHoursLeft = graceExpiresAt
    ? Math.max(0, Math.ceil((new Date(graceExpiresAt).getTime() - Date.now()) / (1000 * 60 * 60)))
    : 0;

  const graceDays = Math.floor(graceHoursLeft / 24);
  const graceHours = graceHoursLeft % 24;

  const handleRestore = async () => {
    await triggerRestore();
    closeStreakLost();
  };

  const handleUpgrade = () => {
    closeStreakLost();
    // Open paywall with streak restore reason
    window.dispatchEvent(new CustomEvent("open-paywall", { detail: { reason: "streak_restore" } }));
  };

  const handleStartFresh = () => {
    closeStreakLost();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center bg-black/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeStreakLost();
      }}
    >
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="streak-lost-title"
        tabIndex={-1}
        initial={{ opacity: 0, y: reduce ? 0 : 24, scale: reduce ? 1 : 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.34, ease: EASE }}
        className="relative w-full max-w-[520px] overflow-hidden rounded-t-[26px] border border-border bg-card text-foreground outline-none sm:rounded-[26px]"
      >
        <button
          type="button"
          onClick={closeStreakLost}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 hidden size-8 items-center justify-center rounded-full border border-border bg-card/70 text-foreground/60 backdrop-blur-sm transition-colors hover:bg-secondary hover:text-foreground sm:flex"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={1.8} />
        </button>

        <div className="flex flex-col p-6 sm:p-8 md:p-10">
          <div className="flex items-center justify-end md:hidden mb-4">
            <button
              type="button"
              onClick={closeStreakLost}
              aria-label="Close"
              className="-mr-1 flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={1.8} />
            </button>
          </div>

          {/* Header */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-secondary">
              <HugeiconsIcon icon={FlameIcon} size={28} strokeWidth={2} className="text-destructive" />
            </div>
            <div>
              <h2
                id="streak-lost-title"
                className="font-heading text-[26px] font-medium leading-[1.12] tracking-[-0.025em] sm:text-[32px] md:text-[34px] max-w-[22ch]"
              >
                Streak Reset
              </h2>
              <p className="mt-4 max-w-[46ch] font-geist text-[14px] leading-[1.65] text-muted-foreground sm:text-[15px]">
                Your {previousStreak} day streak has ended. {canRestore ? "You can restore it within the grace period." : "Start a new one today."}
              </p>
            </div>
          </div>

          {/* Previous streak display */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="flex flex-col items-center">
              <span className="font-heading text-[56px] font-medium leading-[1] tracking-[-0.02em] text-destructive">
                {previousStreak}
              </span>
              <span className="mt-1 font-geist text-[14px] text-muted-foreground">
                {previousStreak === 1 ? "day" : "days"} lost
              </span>
            </div>
          </div>

          {/* Mini Calendar - Last 30 days */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-geist text-[13px] font-medium text-foreground">
                Last 30 days
              </h3>
              <span className="font-geist text-[11px] text-muted-foreground">
                Gap starts {daysSinceLost} day{daysSinceLost !== 1 ? "s" : ""} ago
              </span>
            </div>
            <div className="rounded-lg border border-border bg-muted/50 p-3">
              <StreakCalendar
                data={calendarData}
                cellSize={10}
                cellGap={2}
                showLegend={false}
                showMonthLabels={true}
                className="w-full"
              />
            </div>
          </div>

          {/* Restore section */}
          {canRestore && (
            <div className="mt-8 p-4 rounded-xl border border-border bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <RotateCcw size={20} strokeWidth={2} className="text-primary" />
                </div>
                <div>
                  <p className="font-geist text-[13px] font-medium text-foreground">
                    Restore available
                  </p>
                  <p className="mt-0.5 font-geist text-[12px] text-muted-foreground">
                    {graceDays > 0
                      ? `${graceDays}d ${graceHours}h left to restore`
                      : `${graceHours}h left to restore`}
                    {isPro && restoresRemaining >= 0 && (
                      <> • {restoresRemaining} restore{restoresRemaining !== 1 ? "s" : ""} left this month</>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Pro upsell if not Pro */}
          {!isPro && !canRestore && (
            <div className="mt-8 p-4 rounded-xl border border-border bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <Lock size={20} strokeWidth={2} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="font-geist text-[13px] font-medium text-foreground">
                    Streak Restore is a Pro feature
                  </p>
                  <p className="mt-0.5 font-geist text-[12px] text-muted-foreground">
                    Upgrade to unlock 48-hour grace period & 2 restores/month
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Pro benefits if Pro but no restores left */}
          {isPro && canRestore && restoresRemaining === 0 && (
            <div className="mt-4 p-3 rounded-lg border border-border bg-amber-500/10">
              <p className="font-geist text-[12px] text-amber-700 dark:text-amber-300">
                Monthly restore limit reached (2/month). Next reset: 1st of next month.
              </p>
            </div>
          )}

          <div className="mt-8 border-t border-border pt-5 space-y-3">
            {canRestore && (
              <button
                type="button"
                onClick={handleRestore}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 font-geist text-[14px] font-medium text-primary-foreground transition-opacity hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <RotateCcw size={17} strokeWidth={2} />
                Restore {previousStreak}-Day Streak
              </button>
            )}

            {!isPro && !canRestore && (
              <button
                type="button"
                onClick={handleUpgrade}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 font-geist text-[14px] font-medium text-background transition-opacity hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <Crown size={17} strokeWidth={2} />
                Upgrade to Pro & Restore
              </button>
            )}

            {isPro && !canRestore && restoresRemaining === 0 && (
              <button
                type="button"
                onClick={handleStartFresh}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 font-geist text-[14px] font-medium text-background transition-opacity hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Start Fresh
                <HugeiconsIcon icon={ArrowRight02Icon} size={17} strokeWidth={2} />
              </button>
            )}

            {!canRestore && !isPro && (
              <button
                type="button"
                onClick={handleStartFresh}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-border bg-background px-6 font-geist text-[14px] font-medium text-foreground transition-opacity hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Start Fresh
                <HugeiconsIcon icon={ArrowRight02Icon} size={17} strokeWidth={2} />
              </button>
            )}

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={closeStreakLost}
                className="font-geist text-[12.5px] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                Maybe later
              </button>
              <span className="flex items-center gap-1.5 font-geist text-[11px] text-muted-foreground">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} strokeWidth={2} />
                Streak history preserved
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
};

export default StreakLostModal;