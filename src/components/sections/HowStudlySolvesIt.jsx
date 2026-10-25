import React, { useRef, useState } from "react";
import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import ContainerGrid from "./ContainerGrid";
import SolveStage from "../ui/solve/stage";
import StepList, { STEP_ARRIVES_AT } from "../ui/solve/step-list";

/**
 * "How Studly Solves It" — the V3 loop, driven by scroll.
 *
 * Desktop is a pinned stage, like the Problem section: the layout holds still
 * while ~560vh of scroll runs the loop. That length is the pacing dial: the
 * hop cost is proportional to (section height - viewport), so 560vh buys about
 * 657px of scroll per pill at a 760px viewport, against 357px at 350vh. At
 * today's shorter length a single trackpad flick skipped half a pill.
 *
 * The right panel keeps its illustration
 * stuck while the left column lists the six steps: hairline rows, one of them
 * black with its sentence open and a 2px bar filling across its bottom edge.
 * Each time a step takes over, the panel swaps to it. Nothing travels — the
 * column is a list that changes state, which is why there is no line to keep
 * in sync with anything.
 *
 * Copy is the philosophy of the product, not a feature list. No em dashes.
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
    /* The same blue as "Studly understands them": both steps are Studly doing
       the work rather than the reader, so they share one surface. */
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

/**
 * A hand-drawn arrow, used to point from the annotation above the column down
 * into the first step.
 *
 * One curve, drawn twice the way a pen doubles back over itself, and one head
 * hanging off the same tip the curve ends on. The head is built from the tip
 * coordinates rather than placed as a second mark, which is what stops the two
 * parts drifting apart and the whole thing reading as two loose strokes.
 *
 * It runs down and to the right, so it starts at the end of the writing and
 * lands over the row it is naming rather than back under the writing.
 */
/* The hand-drawn arrow under "first you...".

   Drawn at 1:1 so a stroke width here is the width on screen: the old box was
   a 80x56 viewBox in a 64x40 hole, which letterboxed it and quietly scaled the
   strokes down.

   The tail starts at x 68, which is where the writing ends, and the head is
   placed off the tip of that same curve rather than drawn as its own stroke -
   when the two were positioned independently they never quite met and the
   arrow read as two loose marks. The barbs are the tip's incoming direction
   rotated by 28 degrees either side, so the head sits square on the shaft. */
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



/* The scrub window inside the pinned span, as fractions of scrollYProgress.
   The tail is held back so the first step is already on screen before the
   column starts changing, and so the last one lands before the pin releases.
   Both StepList and jump() read these, so the two can never drift apart. */
const SCRUB_FROM = 0.08;
const SCRUB_TO = 0.94;

const HowStudlySolvesIt = () => {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [epoch, setEpoch] = useState(0);
  const step = STEPS[active];


  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });

  /* Scroll → one continuous float. Whole numbers are the hops, and the
     fraction inside a hop is the line travelling that gap. The panel changes
     over on the beat the arriving pill has finished landing, so the pill and
     the illustration arrive together instead of on separate clocks. */
  const hops = STEPS.length - 1;
  const stepFloat = useTransform(smooth, [SCRUB_FROM, SCRUB_TO], [0, hops]);
  useMotionValueEvent(stepFloat, "change", (v) => {
    const hop = Math.floor(v);
    const i = Math.max(
      0,
      Math.min(STEPS.length - 1, hop + (v - hop >= STEP_ARRIVES_AT ? 1 : 0))
    );
    setActive((prev) => (prev === i ? prev : i));
  });



  const jump = (i) => {
    const el = ref.current;
    if (!el || reduced) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    const t = Math.max(0.01, i - 0.27);
    const frac = Math.min(
      1,
      SCRUB_FROM + (t / hops) * (SCRUB_TO - SCRUB_FROM)
    );
    window.scrollTo({ top: top + span * frac, behavior: "auto" });
  };

  /* A plain click on a row should only open that step. Only stepping drives
   * the panel, so keep the row's loop on its own clock: re-remember the scene
   * (and bump the key) when the user steps into it, and replay it when a row
   * is clicked directly. */
  const replay = () => setEpoch((e) => e + 1);

  return (
    <section
      id="how-studly-solves-it"
      ref={ref}
      className={`relative border-t border-[#ece7d8] ${reduced ? "" : "md:h-[560vh]"}`}
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
          {/* Desktop: pinned stage. Steps left, panel right, scroll drives both. */}
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
                  {/* Handwritten note pointing at the first row. It annotates
                      the column from the page, so it lives here rather than
                      inside StepList, and the row's top padding is the band it
                      hangs in. The arrow starts at the end of the writing and
                      lands over the first row's name. */}
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
                    stepFloat={stepFloat}
                    onSelect={jump}
                  />
                </div>

                {/* Right: the illustration, stuck. */}
                <div
                  id="solve-panel"
                  role="tabpanel"
                  aria-labelledby={`solve-tab-${active}`}
                  className="relative min-w-0 flex-1 overflow-hidden rounded-2xl border border-[#ece7d8] transition-colors duration-500"
                  style={{ backgroundColor: step.tint }}
                >
                  <SolveStage step={step} reduced={reduced} />
                </div>
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
