import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { LockKeyholeIcon, Target02Icon, Tick02Icon } from "@hugeicons/core-free-icons";

/**
 * Shadow-free coin tones for the "How Studly Solves It" section.
 *
 * The LearningPath map one section above keeps its extruded double shadow. Per
 * direction this section carries depth with a hairline ring only (DESIGN.md:
 * "NO box-shadows. NO glows. Ever."), so the two deliberately differ.
 */
export const SOLVE_TONES = {
  completed: { face: "bg-[#ffd9c7]", ring: "border-[#ff9e75]", glyph: "text-[#f04f0a]" },
  current: { face: "bg-[#fffcf0]", ring: "border-[#ff9e75]", glyph: "text-[#141414]" },
  quiz: { face: "bg-[#fffcf0]", ring: "border-[#ff9e75]", glyph: "text-[#b45309]" },
  available: { face: "bg-[#f7f3e7]", ring: "border-[#141414]/15", glyph: "text-[#726f6c]" },
  locked: { face: "bg-[#f7f3e7]/60", ring: "border-[#141414]/10", glyph: "text-[#726f6c]/60" },
};

export const MASCOT_SRC = "/mascot.webp";

/** One coin puck. Decorative glyph is chosen from `state`, `children` wins. */
export const Coin = ({
  state = "available",
  children,
  className = "",
  size = "size-14 md:size-16",
}) => {
  const tone = SOLVE_TONES[state] || SOLVE_TONES.available;
  const showTick = state === "completed" && !children;
  const showLock = state === "locked" && !children;

  return (
    <div
      className={`relative z-10 flex items-center justify-center overflow-hidden rounded-full border-2 ${size} ${tone.face} ${tone.ring} ${className}`}
    >
      {children}
      {showTick && (
        <HugeiconsIcon
          icon={Tick02Icon}
          strokeWidth={2.5}
          className={`size-5 md:size-6 ${tone.glyph}`}
        />
      )}
      {showLock && (
        <HugeiconsIcon
          icon={LockKeyholeIcon}
          strokeWidth={2}
          className={`size-5 ${tone.glyph}`}
        />
      )}
    </div>
  );
};

/** The mascot peeking out of the current coin, exactly as on the map. */
export const PeekingMascot = () => (
  <img
    src={MASCOT_SRC}
    srcSet="/mascot.webp 1x, /mascot@2x.webp 2x"
    alt=""
    aria-hidden="true"
    draggable={false}
    className="animate-map-wiggle pointer-events-none absolute bottom-0 left-1/2 w-full max-w-none -translate-x-1/2 translate-y-1/2 select-none"
  />
);

/** Target glyph used by quiz coins. */
export const QuizGlyph = ({ className = "" }) => (
  <HugeiconsIcon icon={Target02Icon} strokeWidth={2.2} className={className} />
);
