import React, { useState } from "react";
import {
  useReducedMotion,
  AnimatePresence,
  motion,
} from "framer-motion";
import ContainerGrid from "./ContainerGrid";
import SolveStage from "../ui/solve/stage";
import StepList from "../ui/solve/step-list";

/**
 * "How Studly Solves It" — time-driven loop.
 *
 * Each step takes 10 seconds to animate through (progress bar fills, panel
 * transitions). After 10s, it auto-advances to the next step. Scrolling does
 * NOT control the animation — it's purely time-based.
 *
 * Clicking a step jumps to it instantly (no scroll). The progress bar restarts
 * for that step and the timer continues from there.
 */
const STEPS = [
  {
    id: "bring",
    title: "Bring your notes",
    scene: "bring",
    tint: "#f7f3e7",
    alt: "A Files window where a cursor selects five notes and drags them off the screen",
  },
  {
    id: "understand",
    title: "Studly understands them",
    scene: "understand",
    tint: "#eef4fb",
    alt: "Loose notes being read and resolving into ordered sections",
  },
  {
    id: "path",
    title: "Creates a learning path",
    scene: "path",
    tint: "#eef4fb",
    alt: "The learning path being written out one section at a time, each section a row of lesson coins",
  },
  {
    id: "study",
    title: "You study one part at a time",
    scene: "reader",
    tint: "#fffcf0",
    alt: "The reader view showing a single lesson",
  },
  {
    id: "test",
    title: "Test yourself",
    scene: "quiz",
    tint: "#fbf4e3",
    alt: "The quiz view with a question and a highlighted answer",
  },
  {
    id: "keep",
    title: "Keep going",
    scene: "keep",
    tint: "#eef6f1",
    alt: "The learning path completing coin after coin and looping",
  },
];

const CAPTIONS = {
  bring: "Everything you already have. Nothing to reorganise first.",
  understand: "It reads your material the way you would. It just never gets tired.",
  path: "Structure, not a pile. A way through, not more to do.",
  study: "Only ever the next step. The rest can wait.",
  test: "Proof you actually know it, before you move on.",
  keep: "The loop doesn't end. It just picks up where you left off.",
};

const ScribbleArrow = ({ className = "" }) => (
  <svg
    viewBox="0 0 140 40"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M68 6 C 96 6, 116 13, 126 30" strokeWidth="1.9" />
    <path d="M70 9 C 97 9, 116 15, 125 30" strokeWidth="0.9" opacity="0.4" />
    <path d="M125.5 18 L 126 30 L 115.8 23.7" strokeWidth="2" />
  </svg>
);

const HowStudlySolvesIt = () => {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [epoch, setEpoch] = useState(0);
  const step = STEPS[active];

  /* Click handler: jump instantly to a step, restart the timer for that step.
     No scroll, no animation delay. The StepList timer will fill over 10s
     from this point and auto-advance when done. */
  const handleSelect = (i) => {
    setActive(i);
    setEpoch((e) => e + 1); // Replay the scene animation
  };

  /* Replay handler: restart the current step's animation without changing step. */
  const replay = () => setEpoch((e) => e + 1);

  return (
    <section
      id="how-studly-solves-it"
      className="relative border-t border-[#ece7d8] py-20 md:py-0"
    >
      <ContainerGrid />

      {reduced ? (
        <div className="mx-auto w-full max-w-[1080px] px-6 py-16 md:px-10">
          <h2 className="mx-auto max-w-[680px] text-center font-geist text-[24px] font-semibold leading-[1.1] tracking-[-0.03em] text-[#141414] sm:text-[28px]">
            Here&apos;s how we do it
          </h2>
          <p className="mx-auto mt-3 max-w-[560px] text-center font-geist text-[14px] leading-[1.45] tracking-[-0.02em] text-[#726f6c] sm:text-[16px]">
            Studly doesn&apos;t study for you. It shows you the way through.
          </p>
          <div className="mt-10 flex flex-col gap-8">
            {STEPS.map((s) => (
              <div key={s.id} className="flex flex-col gap-3">
                <span className="text-center font-geist text-[15px] font-semibold tracking-[-0.01em] text-[#141414]">
                  {s.title}
                </span>
                <div
                  className="h-[320px] w-full overflow-hidden rounded-2xl border border-[#ece7d8] px-5 pt-5 pb-4"
                  style={{ backgroundColor: s.tint }}
                >
                  <SolveStage step={{ ...s, id: s.id }} reduced play={false} replayKey={epoch} onReplay={replay} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Desktop: pinned stage. Steps left, panel right. Time drives both. */}
          <div className="sticky top-16 hidden h-[calc(100dvh-4rem)] md:flex md:flex-col">
            <div className="mx-auto flex h-full w-full max-w-[1080px] flex-col px-10">
              <div className="shrink-0 pt-10">
                <h2 className="font-geist text-[26px] font-semibold tracking-[-0.03em] text-[#141414]">
                  Here&apos;s how we do it
                </h2>
                <p className="sr-only">
                  Studly doesn&apos;t study for you. It shows you the way through.
                </p>
              </div>

              <div className="flex min-h-0 flex-1 items-stretch gap-12 pb-12 pt-16">
                {/* Left: the six steps as a column of rows, one of them open. */}
                <div className="relative h-full w-[352px] shrink-0">
                  {/* Handwritten note pointing at the first row. */}
                  <div className="pointer-events-none absolute -top-[54px] left-0 z-20 h-[58px] w-[220px] text-[#141414]/55">
                    <span className="font-scribble absolute left-0 top-0 text-[20px] leading-none">
                      first you...
                    </span>
                    <ScribbleArrow className="absolute left-[2px] top-[4px] h-[40px] w-[140px]" />
                  </div>

                  <StepList
                    steps={STEPS}
                    captions={CAPTIONS}
                    active={active}
                    onSelect={handleSelect}
                  />
                </div>

                {/* Right: the illustration, animated with framer-motion. */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    role="tabpanel"
                    aria-labelledby={`solve-tab-${active}`}
                    className="relative min-w-0 flex-1 overflow-hidden rounded-2xl border border-[#ece7d8]"
                    style={{ backgroundColor: step.tint }}
                  >
                    <SolveStage step={step} reduced={reduced} replayKey={epoch} onReplay={replay} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Mobile: no pinning, each step on its own. */}
          <div className="md:hidden">
            <div className="mx-auto w-full max-w-[1080px] px-6 py-16 md:px-10">
              <h2 className="mx-auto max-w-[680px] text-center font-geist text-[24px] font-semibold leading-[1.1] tracking-[-0.03em] text-[#141414] sm:text-[28px]">
                Here&apos;s how we do it
              </h2>
              <p className="mx-auto mt-3 max-w-[560px] text-center font-geist text-[14px] leading-[1.45] tracking-[-0.02em] text-[#726f6c] sm:text-[16px]">
                Studly doesn&apos;t study for you. It shows you the way through.
              </p>
            </div>
            <div className="flex flex-col gap-10 px-6 pb-16 pt-8">
              {STEPS.map((s) => (
                <div key={s.id} className="flex flex-col gap-3">
                  <span className="text-center font-geist text-[15px] font-semibold tracking-[-0.01em] text-[#141414]">
                    {s.title}
                  </span>
                  <div
                    className="h-[320px] w-full overflow-hidden rounded-2xl border border-[#ece7d8] px-5 pt-5 pb-4"
                    style={{ backgroundColor: s.tint }}
                  >
                    <SolveStage step={{ ...s, id: s.id }} reduced play={false} replayKey={epoch} onReplay={replay} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default HowStudlySolvesIt;
