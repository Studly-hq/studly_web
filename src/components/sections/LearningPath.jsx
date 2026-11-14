import React, { useRef } from "react";
import {
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import ContainerGrid from "./ContainerGrid";
import ScrollRevealText from "../ui/scroll-reveal-text";
import LearningPathMap from "../ui/learning-path-map";

/**
 * LearningPath — the destination the Problem section's connector leads into.
 */
const LearningPath = () => {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
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
      id="solution"
      ref={ref}
      className="relative py-24 md:py-28"
    >
      <ContainerGrid />

      <div className="mx-auto grid w-full max-w-[1080px] grid-cols-1 gap-10 px-6 md:grid-cols-2 md:px-10">
        {/* Left column: text with scroll reveal. Sticky only on large screens. */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          {/* Text fill animation only on laptop+ (lg breakpoint). Mobile/tablet get plain text. */}
          <div className="hidden lg:block">
            <ScrollRevealText
              progress={progress}
              range={[0.1, 0.78]}
              className="font-geist text-[clamp(22px,3.2vw,32px)] font-semibold leading-[1.22] tracking-[-0.03em] md:text-[clamp(26px,3.6vw,36px)]"
            >
              <p>You don&apos;t have to figure out how to study your materials.</p>
              <p className="mt-3">Studly helps you find a way through it.</p>
            </ScrollRevealText>
          </div>
          <div className="lg:hidden">
            <p className="font-geist text-[clamp(22px,3vw,26px)] font-semibold leading-[1.22] tracking-[-0.03em] md:text-[clamp(26px,3.4vw,32px)]">
              You don&apos;t have to figure out how to study your materials.
            </p>
            <p className="mt-3 text-[clamp(22px,3vw,26px)] font-semibold leading-[1.22] tracking-[-0.03em] md:text-[clamp(26px,3.4vw,32px)]">
              Studly helps you find a way through it.
            </p>
          </div>
        </div>

        {/* Right column: learning path map. */}
        <div className="relative">
          <LearningPathMap className="pt-16" />
        </div>
      </div>
    </section>
  );
};

export default LearningPath;
