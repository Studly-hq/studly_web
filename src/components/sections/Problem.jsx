import React, { useRef } from "react";
import {
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import ContainerGrid from "./ContainerGrid";
import ScrollRevealText from "../ui/scroll-reveal-text";
import ProblemScene from "../ui/problem-scene";

/** Left column: the two-line copy. */
const ProblemCopy = ({ progress }) => (
  <div className="max-w-[470px]">
    <ScrollRevealText
      progress={progress}
      range={[0.06, 0.88]}
      className="font-geist text-[26px] font-semibold leading-[1.22] tracking-[-0.03em] sm:text-[32px] lg:text-[36px]"
    >
      <p>You have everything you need to study.</p>
      <p className="mt-3">You just don&apos;t always know what to do with all of it.</p>
    </ScrollRevealText>
  </div>
);

/**
 * One column pair: copy on the left, converging scene on the right.
 *
 * The right column stretches to the full stage height on `md+` so the scene's
 * connector can run all the way to the bottom edge of the pinned stage, and
 * the left copy stays vertically centred. Both sections reuse this same
 * 2-column grid so the seam between them lines up exactly.
 */
const ProblemBody = ({ progress }) => (
  <div className="mx-auto grid w-full max-w-[1080px] grid-cols-1 gap-10 px-6 md:h-full md:grid-cols-2 md:px-10">
    <div className="md:flex md:items-center">
      <ProblemCopy progress={progress} />
    </div>
    <div className="relative h-[320px] sm:h-[420px] md:h-full">
      <ProblemScene progress={progress} />
    </div>
  </div>
);

/**
 * The Problem — establishes the mess before Studly creates structure.
 *
 * Desktop (and everything above `md`) runs a tall pinned stage: the copy and
 * scene hold still while ~300vh of scroll drives the wipe and the convergence.
 * Below `md` we skip the choreography and show the settled end state so small
 * screens never fight a pinned animation. `prefers-reduced-motion` collapses
 * the whole thing to a single static block.
 */
const Problem = () => {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });

  const settled = useMotionValue(1);
  const progress = reduced ? settled : smooth;

  return (
    <section
      id="problem"
      ref={ref}
      className={`relative border-t border-[#ece7d8] ${
        reduced ? "" : "md:h-[300vh]"
      }`}
    >
      <ContainerGrid />

      {reduced ? (
        <div className="py-24">
          <ProblemBody progress={settled} />
        </div>
      ) : (
        <>
          {/* Desktop: tall pinned stage. */}
          <div className="sticky top-16 hidden h-[calc(100dvh-4rem)] md:block">
            <ProblemBody progress={progress} />
          </div>

          {/* Mobile: settled end state, no pinned scroll. */}
          <div className="py-24 md:hidden">
            <ProblemBody progress={settled} />
          </div>
        </>
      )}
    </section>
  );
};

export default Problem;
