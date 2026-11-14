import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  LockKeyholeIcon,
  Target02Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";

/**
 * A decorative, non-interactive port of Lucid's `LearningPathMap`
 * (src/components/learn/LearningPathMap.tsx), pinned to the light palette.
 *
 * Kept structurally faithful: section header rows, then a snake of coin nodes
 * drifting through the same offsets, each a rounded puck with a 2px ring and a
 * double hard shadow. Where Lucid uses white-rgba shadows (dark-mode), these
 * are re-toned to cream so they read on #fffcf0.
 */

/* Zigzag positions in px, repeated per section (matches the reference). */
const SNAKE_DRIFT = [-80, -50, -20, -50];

/* Coin tones per state — pastel face, deeper ring, extruded base. */
const COIN_TONES = {
  completed: {
    face: "bg-[#ffd9c7]",
    ring: "border-[#ff9e75]",
    shadow: "shadow-[0_4px_0_0_#ffb898,0_5px_0_0_#ff9e75]",
  },
  current: {
    face: "bg-[#fffcf0]",
    ring: "border-[#ff9e75]",
    shadow: "shadow-[0_4px_0_0_#ffb898,0_5px_0_0_#ff9e75]",
  },
  available: {
    face: "bg-[#f7f3e7]",
    ring: "border-[#141414]/15",
    shadow: "shadow-[0_4px_0_0_#e4ded0,0_5px_0_0_#d8d0bd]",
  },
  locked: {
    face: "bg-[#f7f3e7]/60",
    ring: "border-[#141414]/10",
    shadow: "shadow-[0_4px_0_0_#e9e3d3,0_5px_0_0_#ddd5c1]",
  },
  generating: {
    face: "bg-[#e8f4fd]",
    ring: "border-[#90caf9]",
    shadow: "shadow-[0_4px_0_0_#bbdefb,0_5px_0_0_#90caf9]",
  },
};

/** Demo path — three sections with mixed lesson counts, as Lucid's data is. */
const DEMO_PATH = {
  sessionId: "demo",
  title: "Cell Biology — Unit 3",
  sections: [
    {
      id: "s1",
      order: 1,
      title: "Foundations of the cell",
      subSections: [
        { id: "s1a", title: "Cell theory", state: "completed" },
        { id: "s1b", title: "Membrane structure", state: "completed" },
        { id: "s1c", title: "Organelles", state: "current" },
        { id: "s1d", title: "Section quiz", state: "available", kind: "quiz" },
      ],
    },
    {
      id: "s2",
      order: 2,
      title: "Energy and transport",
      subSections: [
        { id: "s2a", title: "ATP and respiration", state: "available" },
        { id: "s2b", title: "Osmosis in practice", state: "locked" },
      ],
    },
    {
      id: "s3",
      order: 3,
      title: "Genetics and division",
      subSections: [
        { id: "s3a", title: "DNA to protein", state: "locked" },
        { id: "s3b", title: "Mitosis walkthrough", state: "locked" },
        { id: "s3c", title: "Past questions", state: "locked" },
        { id: "s3d", title: "Section quiz", state: "locked", kind: "quiz" },
        { id: "s3e", title: "Synthesis", state: "locked" },
      ],
    },
  ],
};

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const snake = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 140, damping: 20 },
  },
};

/** One coin on the map, with its label hanging to the right. */
const MapNode = ({ title, state, kind, drift }) => {
  const tone = COIN_TONES[state] || COIN_TONES.available;
  const isLocked = state === "locked";
  const isQuiz = kind === "quiz";
  const isCurrent = state === "current";

  return (
    <div
      className="relative z-10 flex justify-center"
      style={{ transform: `translateX(${drift}px)` }}
    >
      <div className="relative flex items-center">
        <div
          className={`relative z-10 flex size-14 items-center justify-center overflow-hidden rounded-full border-2 md:size-16 ${tone.face} ${tone.ring} ${tone.shadow}`}
        >
          {/* Mascot peeks up out of the current coin, bottom-anchored and
              half-overflowing by design. Matches Lucid: hidden by the coin's
              overflow-hidden, swaying via .animate-map-wiggle. */}
          {isCurrent && !isQuiz && (
            <img
              src="/mascot.webp"
              srcSet="/mascot.webp 1x, /mascot@2x.webp 2x"
              alt=""
              aria-hidden="true"
              draggable={false}
              className="animate-map-wiggle pointer-events-none absolute bottom-0 left-1/2 w-full max-w-none -translate-x-1/2 translate-y-1/2 select-none"
            />
          )}
          {isQuiz && !isLocked && (
            <HugeiconsIcon
              icon={Target02Icon}
              strokeWidth={2.2}
              className="size-5 text-amber-600 md:size-6"
            />
          )}
          {state === "completed" && (
            <HugeiconsIcon
              icon={Tick02Icon}
              strokeWidth={2.5}
              className="size-5 text-[#f04f0a] md:size-6"
            />
          )}
          {isLocked && (
            <HugeiconsIcon
              icon={LockKeyholeIcon}
              strokeWidth={2}
              className="size-5 text-[#726f6c]/60"
            />
          )}
          {state === "generating" && (
            <svg className="size-5 animate-spin text-[#90caf9]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          )}
        </div>

        {/* Label — always hangs right of the coin, always one line. */}
        <div className="absolute left-full top-1/2 ml-4 w-44 -translate-y-1/2 text-left sm:w-64">
          <p
            className={`truncate font-geist text-sm font-medium tracking-[-0.01em] sm:text-base ${
              isLocked ? "text-[#726f6c]/60" : "text-[#141414]"
            }`}
          >
            {title}
            {isQuiz ? " · Quiz" : ""}
          </p>
        </div>
      </div>
    </div>
  );
};

const SectionBlock = ({ section }) => {
  const total = section.subSections.length;
  const done = section.subSections.filter((s) => s.state === "completed").length;

  return (
    <motion.div variants={item} className="flex flex-col gap-4 pb-6">
      {/* Section header row */}
      <div className="flex w-full items-stretch overflow-hidden rounded-2xl border border-[#141414]/10 bg-[#f7f3e7]/60">
        <div className="flex flex-1 flex-col gap-0.5 px-5 py-4 text-left">
          <span className="font-geist text-base font-semibold tracking-[-0.02em] text-[#141414]">
            {section.order}. {section.title}
          </span>
          <span className="font-geist text-sm text-[#726f6c]">
            {done}/{total} lessons
          </span>
        </div>
      </div>

      {/* Snake run */}
      <motion.div
        variants={snake}
        className="relative -mx-4 flex flex-col gap-5 py-4 sm:py-8"
      >
        {section.subSections.map((sub, subIdx) => (
          <motion.div key={sub.id} variants={item}>
            <MapNode
              title={sub.title}
              state={sub.state}
              kind={sub.kind}
              drift={SNAKE_DRIFT[subIdx % SNAKE_DRIFT.length]}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

const LearningPathMap = ({ className = "" }) => {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={`flex flex-col gap-2 ${className}`}
      variants={container}
      initial={reduced ? false : "hidden"}
      animate={reduced ? "visible" : undefined}
      whileInView={reduced ? undefined : "visible"}
      viewport={{ once: true, amount: 0.15 }}
    >
      {DEMO_PATH.sections.map((section) => (
        <SectionBlock key={section.id} section={section} />
      ))}
    </motion.div>
  );
};

export default LearningPathMap;
