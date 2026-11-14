import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion, animate } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  ArrowRight02Icon,
  FlameIcon,
} from "@hugeicons/core-free-icons";
import { RotateCcw, Shield } from "lucide-react";
import { useStreak } from "../../context/StreakContext";

const isHugeIcon = (icon) => Array.isArray(icon);

const EASE = [0.16, 1, 0.3, 1];

const VARIANTS = {
  daily: {
    title: "Day {streak} 🔥",
    body: "You're on fire! Keep the momentum going with a quick study session.",
    cta: "Continue Learning",
    secondary: "Maybe later",
    icon: FlameIcon,
    color: "#FF4500",
    benefits: [
      { label: "Builds consistent habits", icon: "📈" },
      { label: "Improves long-term retention", icon: "🧠" },
      { label: "Unlocks milestone rewards", icon: "🏆" },
    ],
  },
  comeback: {
    title: "Welcome Back! 🌟",
    body: "You missed a day, but your {streak}-day streak is waiting. Pick up where you left off.",
    cta: "Restore Streak",
    secondary: "Start Fresh",
    icon: RotateCcw,
    color: "#22C55E",
    benefits: [
      { label: "Restore your progress", icon: "🔄" },
      { label: "Keep momentum alive", icon: "⚡" },
      { label: "Protect your milestones", icon: "🛡️" },
    ],
  },
  freeze: {
    title: "Streak Protected! ❄️",
    body: "Your streak freeze kicked in automatically. You have {freezes} freeze{freezesPlural} remaining this month.",
    cta: "Got it",
    secondary: null,
    icon: Shield,
    color: "#3B82F6",
    benefits: [],
  },
};

const CountUp = ({ from, to, duration = 1.2, className }) => {
  const [value, setValue] = React.useState(from);

  useEffect(() => {
    let frame = 0;
    const totalFrames = duration * 60; // 60fps
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const animateFrame = () => {
      frame++;
      const progress = Math.min(frame / totalFrames, 1);
      const easedProgress = easeOut(progress);
      const currentValue = Math.round(from + (to - from) * easedProgress);
      setValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animateFrame);
      }
    };

    requestAnimationFrame(animateFrame);
    return () => {}; // cleanup if needed
  }, [from, to, duration]);

  return <span className={className}>{value.toLocaleString()}</span>;
};

const DailyStreakModal = () => {
  const {
    showDailyStreak,
    dailyStreakData,
    closeDailyStreak,
  } = useStreak();
  const reduce = useReducedMotion();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!showDailyStreak) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => panelRef.current?.focus(), 40);

    const onKeyDown = (event) => {
      if (event.key === "Escape") closeDailyStreak();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [showDailyStreak, closeDailyStreak]);

  if (!showDailyStreak || !dailyStreakData) return null;

  const variant = VARIANTS[dailyStreakData.type] || VARIANTS.daily;
  const Icon = variant.icon;
  const streak = dailyStreakData.streak ?? 1;
  const freezes = dailyStreakData.freezesRemaining ?? 0;
  const freezesPlural = freezes !== 1 ? "s" : "";

  const title = variant.title
    .replace("{streak}", streak)
    .replace("{freezes}", freezes)
    .replace("{freezesPlural}", freezesPlural);
  const body = variant.body
    .replace("{streak}", streak)
    .replace("{freezes}", freezes)
    .replace("{freezesPlural}", freezesPlural);

  const handlePrimary = () => {
    if (dailyStreakData.type === "comeback") {
      // Trigger restore streak
      // This would call the restore streak API
    }
    closeDailyStreak();
  };

  const handleSecondary = () => {
    closeDailyStreak();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center bg-black/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeDailyStreak();
      }}
    >
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="daily-streak-title"
        tabIndex={-1}
        initial={{ opacity: 0, y: reduce ? 0 : 24, scale: reduce ? 1 : 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.34, ease: EASE }}
        className="relative w-full max-w-[520px] overflow-hidden rounded-t-[26px] border border-border bg-card text-foreground outline-none sm:rounded-[26px]"
      >
        {/* Desktop close button — top right of the card */}
        <button
          type="button"
          onClick={closeDailyStreak}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 hidden size-8 items-center justify-center rounded-full border border-border bg-card/70 text-foreground/60 backdrop-blur-sm transition-colors hover:bg-secondary hover:text-foreground sm:flex"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={1.8} />
        </button>

        <div className="flex flex-col p-6 sm:p-8 md:p-10">
          {/* Mobile close */}
          <div className="flex items-center justify-end md:hidden mb-4">
            <button
              type="button"
              onClick={closeDailyStreak}
              aria-label="Close"
              className="-mr-1 flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={1.8} />
            </button>
          </div>

          {/* Header: icon + title */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-secondary">
              {isHugeIcon(Icon) ? (
                <HugeiconsIcon icon={Icon} size={28} strokeWidth={2} className={`text-[${variant.color}]`} />
              ) : (
                <Icon size={28} strokeWidth={2} className={`text-[${variant.color}]`} />
              )}
            </div>
            <div>
              <h2
                id="daily-streak-title"
                className="font-heading text-[26px] font-medium leading-[1.12] tracking-[-0.025em] sm:text-[32px] md:text-[34px] max-w-[22ch]"
              >
                {title}
              </h2>
              <p className="mt-4 max-w-[46ch] font-geist text-[14px] leading-[1.65] text-muted-foreground sm:text-[15px]">
                {body}
              </p>
            </div>
          </div>

          {/* Streak count display with count-up animation */}
          {dailyStreakData.type !== "freeze" && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <div className="flex flex-col items-center">
                <CountUp
                  from={0}
                  to={streak}
                  duration={1.4}
                  className="font-heading text-[56px] font-medium leading-[1] tracking-[-0.02em] text-foreground"
                />
                <span className="mt-1 font-geist text-[14px] text-muted-foreground">
                  {streak === 1 ? "day" : "days"} in a row
                </span>
              </div>
            </div>
          )}

          {/* Benefits list (for daily/comeback) */}
          {variant.benefits.length > 0 && (
            <ul className="mt-7 grid gap-2.5">
              {variant.benefits.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-secondary">
                    <span className="text-[16px]">{item.icon}</span>
                  </span>
                  <span className="font-geist text-[13.5px] text-foreground/80">
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 border-t border-border pt-5">
            <button
              type="button"
              onClick={handlePrimary}
              className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 font-geist text-[14px] font-medium text-background transition-opacity hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {variant.cta}
              <HugeiconsIcon icon={ArrowRight02Icon} size={17} strokeWidth={2} />
            </button>

            {variant.secondary && (
              <div className="mt-3 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleSecondary}
                  className="font-geist text-[12.5px] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  {variant.secondary}
                </button>
                <span className="flex items-center gap-1.5 font-geist text-[11px] text-muted-foreground">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} strokeWidth={2} />
                  Streak saved to cloud
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
};

export default DailyStreakModal;