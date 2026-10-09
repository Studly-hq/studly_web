import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  LockKeyholeIcon,
  Tick02Icon,
  Book02Icon,
  Target02Icon,
} from "@hugeicons/core-free-icons";
import { MASCOT_SRC } from "./coins";
import FitBox from "./fit-box";

/**
 * The learning path map itself, shared by the two scenes that show it:
 * "Creates a learning path" (the path building itself) and "Keep going" (the
 * path being walked). Copied line for line from
 * lucid/src/components/learn/LearningPathMap.tsx. Same components, same
 * conditions, same classes, same tones, same comments.
 *
 * Only three things differ, all forced by the panel it lives in:
 *   1. the TypeScript types are gone (this is a JSX project),
 *   2. Lucid's theme tokens are literal colours, and white-rgba shadows are
 *      re-toned to cream for #fffcf0, exactly as the LearningPath map above
 *      this section already does,
 *   3. every length is halved, so the whole path fits the panel: the coin is
 *      `size-7 md:size-8` instead of `size-14 md:size-16`, the snake drift is
 *      half, the gaps, padding and type are half. Nothing is re-arranged.
 *
 * On top of that the states come from a cursor rather than static data: the
 * walkthrough cursor in scene-keepgoing runs the path one coin at a time,
 * scene-path holds it at the start while the sections arrive, and `generating`
 * puts Lucid's spinner on whichever coins are still being written.
 */

const EASE = [0.16, 1, 0.3, 1];

/** Lucid's cn. */
const cn = (...parts) => parts.filter(Boolean).join(" ");

/** The demo path, in Lucid's shape. */
const PATH = {
  sessionId: "demo",
  title: "Cell Biology, Unit 3",
  sections: [
    {
      id: "s1",
      order: 1,
      title: "Foundations of the cell",
      subSections: [
        { id: "s1a", title: "Cell theory" },
        { id: "s1b", title: "Membrane structure" },
        { id: "s1c", title: "Organelles" },
      ],
    },
    {
      id: "s2",
      order: 2,
      title: "Energy and transport",
      subSections: [
        { id: "s2a", title: "ATP and respiration" },
        { id: "s2b", title: "Osmosis in practice" },
        { id: "s2c", title: "Section quiz", kind: "quiz" },
      ],
    },
    {
      id: "s3",
      order: 3,
      title: "Genetics and division",
      subSections: [
        { id: "s3a", title: "DNA to protein" },
        { id: "s3b", title: "Mitosis walkthrough" },
        { id: "s3c", title: "Past questions" },
      ],
    },
  ],
};

/* The walk order, so a cursor can run the whole path in one loop. */
const ORDER = PATH.sections.flatMap((section, sectionIndex) =>
  section.subSections.map((sub, subIdx) => ({ ...sub, sectionIndex, subIdx }))
);
const TOTAL = ORDER.length;

/* sectionIndex:subIdx -> position in the walk order. */
const AT = {};
ORDER.forEach((node, i) => {
  AT[`${node.sectionIndex}:${node.subIdx}`] = i;
});

/** The positions of one section's coins inside the walk order. */
export const sectionNodes = (sectionIndex) =>
  PATH.sections[sectionIndex].subSections.map((_, subIdx) => AT[`${sectionIndex}:${subIdx}`]);

/**
 * Lucid's getNodeState, with the cursor standing in for the session's own
 * progress: everything before it is completed, it is current, the one after it
 * is open, the rest are locked. Coins listed in `generating` are still being
 * written, so they show Lucid's spinner whatever the cursor says.
 */
function getNodeState(path, sectionIndex, subIdx, cursor, generating) {
  const i = AT[`${sectionIndex}:${subIdx}`];
  if (generating.includes(i)) return { kind: "generating", index: i };
  const kind =
    i < cursor ? "completed" : i === cursor ? "current" : i === cursor + 1 ? "available" : "locked";
  return { kind, index: i };
}

/** Lucid's getSectionProgress, counting the same generating coins. */
function getSectionProgress(section, sectionIndex, cursor, generating) {
  let done = 0;
  let total = 0;
  let pending = 0;
  section.subSections.forEach((sub, subIdx) => {
    const state = getNodeState(PATH, sectionIndex, subIdx, cursor, generating);
    total += 1;
    if (state.kind === "completed") done += 1;
    if (state.kind === "generating") pending += 1;
  });
  return { done, total, generating: pending };
}

export function LearningPathMap({
  path,
  onEnterNode,
  onSectionOverview,
  className,
  cursor,
  generating = [],
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {path.sections.map((section, sIdx) => (
        <SectionBlock
          key={section.id}
          section={section}
          sectionIndex={sIdx}
          path={path}
          cursor={cursor}
          generating={generating}
          onEnterNode={onEnterNode}
          onSectionOverview={onSectionOverview}
        />
      ))}
    </div>
  );
}

export function SectionBlock({
  section,
  sectionIndex,
  path,
  cursor,
  generating = [],
  onEnterNode,
  onSectionOverview,
}) {
  const { done, total, generating: pending } = getSectionProgress(
    section,
    sectionIndex,
    cursor,
    generating
  );

  return (
    <div className="flex flex-col gap-2 pb-2.5">
      {/* Section header row */}
      <div className="flex w-full items-stretch overflow-hidden rounded-xl border border-[#141414]/10 bg-[#f7f3e7]/60">
        <div className="flex flex-1 flex-col gap-0.5 px-2.5 py-2 text-left">
          <span className="font-geist text-[13px] font-semibold tracking-[-0.02em] text-[#141414]">
            {section.order}. {section.title}
          </span>
          <span className="font-geist text-[11px] text-[#726f6c]">
            {done}/{total} lessons{pending ? ` · ${pending} generating` : ""}
            {(total - done - (pending || 0)) > 0 && !pending
              ? ` · ${(total - done).toString()} remaining`
              : ""}
          </span>
        </div>
        {onSectionOverview && (
          <button
            type="button"
            onClick={() => onSectionOverview(sectionIndex)}
            aria-label={`View ${section.title} outline`}
            className="flex w-7 shrink-0 items-center justify-center border-l border-[#141414]/10 text-[#726f6c] transition-colors duration-150 hover:bg-[#141414]/5 hover:text-[#141414]"
          >
            <HugeiconsIcon icon={Book02Icon} strokeWidth={1.8} className="size-3" />
          </button>
        )}
      </div>

      {/* Snake run — every row centers its coin, then drifts it through
          -40 / -25 / -10 / -25 (half of Lucid's -80 / -50 / -20 / -50, so the
          zigzag keeps its shape). Labels hang right of the coin at a fixed
          width and never affect centering. */}
      <div className="relative -mx-2 flex flex-col gap-2.5 py-2 sm:py-3">
        {section.subSections.map((sub, subIdx) => {
          const state = getNodeState(path, sectionIndex, subIdx, cursor, generating);
          const drift = SNAKE_DRIFT[subIdx % SNAKE_DRIFT.length];
          return (
            <MapNode
              key={sub.id}
              title={sub.title}
              state={state}
              drift={drift}
              kind={sub.kind}
              onClick={() => onEnterNode(sectionIndex, subIdx)}
            />
          );
        })}
      </div>
    </div>
  );
}

/* Zigzag positions in px, repeated per section (Lucid's -80 / -50 / -20 / -50
   at half scale, since the coin is half size). */
const SNAKE_DRIFT = [-40, -25, -10, -25];

/* Coin tones per state. Structure (from the reference): a light pastel face,
   a 2px ring in a deeper tone, and two stacked hard shadows (midtone + ring
   tone) that read as the extruded base of the puck. Half scale, so Lucid's 4px
   and 5px become 2px and 3px. */
const COIN_TONES = {
  completed: {
    face: "bg-[#ffd9c7]",
    ring: "border-[#ff9e75]",
    shadow: "shadow-[0_2px_0_0_#ffb898,0_3px_0_0_#ff9e75]",
    shadowHover: "group-hover:shadow-[0_3px_0_0_#ffb898,0_4px_0_0_#ff9e75]",
  },
  current: {
    face: "bg-[#fffcf0]",
    ring: "border-[#ff9e75]",
    shadow: "shadow-[0_2px_0_0_#ffb898,0_3px_0_0_#ff9e75]",
    shadowHover: "group-hover:shadow-[0_3px_0_0_#ffb898,0_4px_0_0_#ff9e75]",
  },
  available: {
    face: "bg-[#f7f3e7]",
    ring: "border-[#141414]/15",
    shadow: "shadow-[0_2px_0_0_#e4ded0,0_3px_0_0_#d8d0bd]",
    shadowHover: "group-hover:shadow-[0_3px_0_0_#e4ded0,0_4px_0_0_#d8d0bd]",
  },
  locked: {
    face: "bg-[#f7f3e7]/60",
    ring: "border-[#141414]/10",
    shadow: "shadow-[0_2px_0_0_#e9e3d3,0_3px_0_0_#ddd5c1]",
    shadowHover: "",
  },
  generating: {
    face: "bg-[#e8f4fd]",
    ring: "border-[#90caf9]",
    shadow: "shadow-[0_2px_0_0_#bbdefb,0_3px_0_0_#90caf9]",
    shadowHover: "",
  },
};

function MapNode({ title, state, onClick, drift, kind }) {
  const isLocked = state.kind === "locked";
  const isCurrent = state.kind === "current";
  const isGenerating = state.kind === "generating";
  const isCompleted = state.kind === "completed";
  const tone = COIN_TONES[state.kind];
  const isQuiz = kind === "quiz";

  return (
    <div
      className="relative z-10 flex justify-center"
      style={{ transform: `translateX(${drift}px)` }}
    >
      <button
        type="button"
        onClick={isGenerating || isLocked ? undefined : onClick}
        disabled={isLocked || isGenerating}
        aria-label={`${title}${isQuiz ? ", Section Quiz" : ""}${isLocked ? " (locked)" : isGenerating ? " (generating)" : ""}`}
        aria-current={isCurrent ? "step" : undefined}
        className="group relative flex items-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <div className="relative">
          {/* the coin: face + 2px ring + double hard extrusion */}
          <div
            className={cn(
              "relative z-10 flex size-7 items-center justify-center overflow-hidden rounded-full border-2 transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] md:size-8",
              tone.face,
              tone.ring,
              tone.shadow,
              isLocked ? "cursor-default" : "cursor-pointer group-hover:-translate-y-[2px]",
              !isLocked && !isGenerating && tone.shadowHover
            )}
          >
            {/* Quiz badge icon. Dropped once the node is completed so the
                tick is the only glyph in the coin: Lucid gates the badge on
                !isLocked && !isGenerating and the tick on completed, which
                both pass at once. At Lucid's full-size coin the pair reads as
                quiz-plus-done; at half size they collide into a smudge. */}
            {isQuiz && !isLocked && !isGenerating && !isCompleted && (
              <HugeiconsIcon
                icon={Target02Icon}
                strokeWidth={2.2}
                className="size-3 text-amber-600 md:size-3.5"
              />
            )}
            {isCurrent && !isQuiz && (
              /* Wrapped so the mascot eases in and out as the cursor moves,
                 rather than popping between coins. */
              <AnimatePresence>
                <motion.span
                  key="mascot"
                  className="absolute inset-0"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <img
                    src={MASCOT_SRC}
                    srcSet={`${MASCOT_SRC} 1x, /mascot@2x.webp 2x`}
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                    className="animate-map-wiggle pointer-events-none absolute bottom-0 left-1/2 w-full max-w-none -translate-x-1/2 translate-y-1/2 select-none"
                  />
                </motion.span>
              </AnimatePresence>
            )}
            {isCompleted && (
              <HugeiconsIcon
                icon={Tick02Icon}
                strokeWidth={2.5}
                className="size-3 text-[#f04f0a] md:size-3.5"
              />
            )}
            {isLocked && (
              <HugeiconsIcon
                icon={LockKeyholeIcon}
                strokeWidth={2}
                className="size-3 text-[#726f6c]/60"
              />
            )}
            {isGenerating && (
              <span className="absolute inset-0 flex items-center justify-center">
                <svg className="size-3 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </span>
            )}
            {/* available: intentionally empty face */}
          </div>
        </div>

        {/* label — always hangs right of the coin, always one line */}
        <div className="absolute left-full top-1/2 ml-2 w-[88px] -translate-y-1/2 text-left sm:w-32">
          <p
            className={cn(
              "truncate font-geist text-[11px] leading-4 font-medium tracking-[-0.02em] sm:text-[13px]",
              isLocked ? "text-[#726f6c]/60" : "text-[#141414]"
            )}
          >
            {title}
          </p>
        </div>
      </button>
    </div>
  );
}

/**
 * FittedMap — the map at its natural size, shrunk to fit the panel rather than
 * clipped, so every header row and coin stays whole and legible.
 *
 * The mechanism is FitBox's; this is the map's name for it, kept because the
 * two scenes that show the map are the ones that care about it.
 */
export const FittedMap = ({ children, className = "" }) => (
  <FitBox className={className}>{children}</FitBox>
);

export { PATH, TOTAL, EASE };
