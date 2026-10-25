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
 *
 * Shares the exact same 2-column grid as `Problem` (max-w-[1080px], gap-10,
 * px-6 / md:px-10), so the hairline entering at the top of the right column
 * sits directly under the connector that exited the Studly card. The left copy
 * reuses the same scroll wipe; the map cascades in from the line via variants.
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
          <ScrollRevealText
            progress={progress}
            range={[0.1, 0.78]}
            className="font-geist text-[24px] font-semibold leading-[1.22] tracking-[-0.03em] sm:text-[28px] md:text-[32px] lg:text-[36px]"
          >
            <p>You don&apos;t have to figure out how to study your materials.</p>
            <p className="mt-3">Studly helps you find a way through it.</p>
          </ScrollRevealText>
        </div>

        {/* Right column: learning path map. No connector of its own: the Problem
            section's single curve overhangs past the section seam and lands on
            the map, so a second curve here would double the line and leave a kink.
            The `pt-16` is what the connector's overhang was measured against. */}
        <div className="relative">
          <LearningPathMap className="pt-16" />
        </div>
      </div>
    </section>
  );
};

export default LearningPath;
