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
  <div className="mx-auto max-w-[470px]">
    {/* Text fill animation only on laptop+ (lg breakpoint). Mobile/tablet get plain text. */}
    <div className="hidden lg:block">
      <ScrollRevealText
        progress={progress}
        range={[0.06, 0.88]}
        className="font-geist text-[clamp(22px,3.2vw,32px)] font-semibold leading-[1.22] tracking-[-0.03em] md:text-[clamp(26px,3.6vw,36px)]"
      >
        <p>You have everything you need to study.</p>
        <p className="mt-3">You just don&apos;t always know what to do with all of it.</p>
      </ScrollRevealText>
    </div>
    <div className="lg:hidden">
      <p className="font-geist text-[clamp(20px,2.8vw,24px)] font-semibold leading-[1.22] tracking-[-0.03em] md:text-[clamp(24px,3.2vw,32px)]">
        You have everything you need to study.
      </p>
      <p className="mt-3 text-[clamp(20px,2.8vw,24px)] font-semibold leading-[1.22] tracking-[-0.03em] md:text-[clamp(24px,3.2vw,32px)]">
        You just don&apos;t always know what to do with all of it.
      </p>
    </div>
  </div>
);

/**
 * One column pair: copy on the left, converging scene on the right.
 */
const ProblemBody = ({ progress }) => (
  <div className="mx-auto grid w-full max-w-[1080px] grid-cols-1 gap-10 px-6 md:h-full md:grid-cols-2 md:px-10">
    <div className="md:flex md:items-center">
      <ProblemCopy progress={progress} />
    </div>
    <div className="relative h-[clamp(260px,32vw,320px)] sm:h-[clamp(320px,40vw,420px)] md:h-full">
      <ProblemScene progress={progress} />
    </div>
  </div>
);

/**
 * The Problem — establishes the mess before Studly creates structure.
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
      className={`relative border-t border-[#ece7d8] py-20 md:py-28 ${
        reduced ? "" : "md:h-[300vh]"
      }`}
    >
      <ContainerGrid dots />

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
