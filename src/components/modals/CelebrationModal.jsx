import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  ArrowRight02Icon,
  TrophyIcon,
  FlameIcon,
} from "@hugeicons/core-free-icons";
import confetti from "canvas-confetti";
import { useCelebration } from "../../context/CelebrationContext";

const EASE = [0.16, 1, 0.3, 1];

const STREAK_MILESTONES = [1, 2, 3, 4, 5, 6, 7, 10, 14, 21, 30, 50, 75, 100, 200, 365];
const AURA_MILESTONES = [10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000];

const ICONS = {
  aura: TrophyIcon,
  streak: FlameIcon,
  "streak-lost": FlameIcon,
};

const VARIANTS = {
  aura: {
    title: "Aura Unlocked!",
    subtitle: (v) => `${v.toLocaleString()} aura points earned`,
    color: "#EAB308",
  },
  streak: {
    title: "Streak Milestone!",
    subtitle: (v) => `${v.toLocaleString()} day streak — keep it going`,
    color: "#FF4500",
  },
  "streak-lost": {
    title: "Streak Reset",
    subtitle: (v) => `Your ${v.toLocaleString()} day streak has ended. Start a new one today.`,
    color: "#6366F1",
  },
};

const CelebrationModal = () => {
    const { showCelebration, celebrationData, closeCelebration } = useCelebration();
    const lastCelebrationId = useRef(null);
    const panelRef = useRef(null);
    const reduce = useReducedMotion();

    // Fire confetti when a NEW celebration starts
    useEffect(() => {
        if (showCelebration && celebrationData) {
            const currentId = `${celebrationData.type}-${celebrationData.value}`;
            if (lastCelebrationId.current !== currentId) {
                lastCelebrationId.current = currentId;
                fireConfetti();
            }
        }
    }, [showCelebration, celebrationData]);

    const fireConfetti = () => {
        const colors = ['#FF4500', '#FFD700', '#FF6B35', '#FFA500', '#FFFFFF'];

        setTimeout(() => {
            confetti({
                particleCount: 80,
                angle: 60,
                spread: 70,
                origin: { x: 0, y: 0.6 },
                colors: colors,
                zIndex: 10000
            });
            confetti({
                particleCount: 80,
                angle: 120,
                spread: 70,
                origin: { x: 1, y: 0.6 },
                colors: colors,
                zIndex: 10000
            });
        }, 100);

        setTimeout(() => {
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { x: 0.5, y: 0.5 },
                colors: colors,
                scalar: 1.2,
                zIndex: 10000
            });
        }, 500);
    };

    // Escape to dismiss, lock background scroll while open.
    useEffect(() => {
        if (!showCelebration) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const focusTimer = window.setTimeout(() => panelRef.current?.focus(), 40);

        const onKeyDown = (event) => {
            if (event.key === "Escape") closeCelebration();
        };
        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.clearTimeout(focusTimer);
            window.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [showCelebration, closeCelebration]);

    if (!showCelebration || !celebrationData) return null;

    const type = celebrationData.type || "streak";
    const variant = VARIANTS[type] || VARIANTS.streak;
    const Icon = ICONS[type] || FlameIcon;
    const value = celebrationData.value ?? 0;

    const getNextMilestone = () => {
        const milestones = type === 'aura' ? AURA_MILESTONES : STREAK_MILESTONES;
        return milestones.find((m) => m > value);
    };

    const nextMilestone = getNextMilestone();
    const progress = (nextMilestone && value) ? (value / nextMilestone) * 100 : 100;

    return createPortal(
        <div
          className="fixed inset-0 z-[120] flex items-end justify-center bg-black/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeCelebration();
          }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            initial={{ opacity: 0, y: reduce ? 0 : 24, scale: reduce ? 1 : 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.34, ease: EASE }}
            className="relative w-full max-w-[520px] overflow-hidden rounded-t-[26px] border border-border bg-card text-foreground outline-none sm:rounded-[26px]"
          >
            <div className="flex flex-col p-6 sm:p-8 md:p-10">
              {/* Close button (mobile visible, desktop hidden in artwork column) */}
              <div className="flex items-center justify-end md:hidden">
                <button
                  type="button"
                  onClick={closeCelebration}
                  aria-label="Close"
                  className="-mr-1 flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={1.8} />
                </button>
              </div>

              {/* Header: title + icon */}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-secondary">
                  <HugeiconsIcon icon={Icon} size={28} strokeWidth={2} className={`text-[#141414]`} />
                </div>
                <div>
                  <h2
                    className="font-heading text-[22px] font-medium leading-[1.12] tracking-[-0.025em] sm:text-[28px]"
                  >
                    {variant.title}
                  </h2>
                  <p className="mt-1 font-geist text-[14px] leading-[1.65] text-muted-foreground sm:text-[15px]">
                    {variant.subtitle(value)}
                  </p>
                </div>
              </div>

              {/* Progress bar (for streak & aura milestones) */}
              {nextMilestone && (
                <div className="mt-8 px-4">
                  <div className="flex justify-between text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-2">
                    <span>Current: {value}</span>
                    <span>Next: {nextMilestone}</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden border border-border p-[1px]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ delay: 0.2, duration: 1, ease: "circOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: variant.color }}
                    />
                  </div>
                </div>
              )}

              <div className="mt-8 border-t border-border pt-5">
                <button
                  type="button"
                  onClick={closeCelebration}
                  className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 font-geist text-[14px] font-medium text-background transition-opacity hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {type === 'streak-lost' ? "Start Fresh" : "Claim Achievement"}
                  <HugeiconsIcon icon={ArrowRight02Icon} size={17} strokeWidth={2} />
                </button>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="font-geist text-[11px] text-muted-foreground">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} strokeWidth={2} />
                    Achievement saved
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>,
        document.body,
    );
};

export default CelebrationModal;
