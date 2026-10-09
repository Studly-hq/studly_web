import React, { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Timer01Icon,
} from "@hugeicons/core-free-icons";
import { PACE } from "./pace";
import FitBox from "./fit-box";

const EASE = [0.16, 1, 0.3, 1];

const OPTIONS = [
  { label: "It releases energy through respiration", correct: true },
  { label: "It stores the cell's DNA", correct: false },
  { label: "It controls what enters the cell", correct: false },
  { label: "It packages proteins for transport", correct: false },
];

/**
 * SceneQuiz — a static, light-toned replica of Lucid's quiz playing screen
 * (src/components/quiz/QuizMode.tsx): header with timer, progress bar, question
 * and answer rows, then the answered state with the explanation card. Hairline
 * borders only, no shadows.
 */
const SceneQuiz = ({ reduced = false, active = true }) => {
  const [scope, animateAt] = useAnimate();

  useEffect(() => {
    if (reduced || !active) return;
    let cancelled = false;

    /* The durations written below are the ones this scene was tuned at. */
    const animate = (target, keyframes, options = {}) =>
      animateAt(target, keyframes, {
        ...options,
        duration:
          (options.duration === undefined ? 0.3 : options.duration) * PACE,
        delay:
          typeof options.delay === "number" ? options.delay * PACE : options.delay,
      });

    const run = async () => {
      try {
      await animate(".qhead", { opacity: 1, y: 0 }, { duration: 0.4, ease: EASE });
      await animate(".qbar", { scaleX: 0.3 }, { duration: 0.5, ease: EASE });
      await animate(".qquestion", { opacity: 1, y: 0 }, { duration: 0.45, ease: EASE });
      if (cancelled) return;
      await animate(
        ".qoption",
        { opacity: 1, y: 0 },
        { duration: 0.4, delay: stagger(0.08 * PACE), ease: EASE }
      );
      if (cancelled) return;
      await animate(
        ".qcorrect",
        { backgroundColor: "rgba(240, 79, 10, 0.10)", borderColor: "#f04f0a" },
        { duration: 0.35, ease: EASE }
      );
      await animate(".qcheck", { opacity: 1, scale: 1 }, { duration: 0.3, ease: EASE });
      await animate(".qexplain", { opacity: 1, y: 0 }, { duration: 0.45, ease: EASE });
      } catch {
        /* scene unmounted mid-sequence */
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [reduced, active, animateAt]);

  return (
    <div ref={scope} className="h-full w-full bg-[#fffcf0]">
      <FitBox maxWidth={440} className="px-5">
        {/* header */}
        <motion.div
          className="qhead flex items-center justify-between gap-3"
          initial={reduced ? false : { opacity: 0, y: -8 }}
          animate={reduced ? { opacity: 1, y: 0 } : undefined}
        >
          <div className="flex items-center gap-2.5 text-[#726f6c]">
            <span className="flex size-7 items-center justify-center rounded-full">
              <HugeiconsIcon icon={Cancel01Icon} strokeWidth={1.8} className="size-4" aria-hidden="true" />
            </span>
            <span className="font-geist text-[12.5px] font-medium">Question 3 of 10</span>
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-[#141414]/15 bg-[#f7f3e7] px-3 py-1 font-geist text-[12px] tabular-nums text-[#141414]">
            <HugeiconsIcon icon={Timer01Icon} strokeWidth={1.8} className="size-4" aria-hidden="true" />
            04:32
          </span>
        </motion.div>

        {/* progress */}
        <div className="mt-3.5 h-1 w-full overflow-hidden rounded-full bg-[#f7f3e7]">
          <motion.div
            className="qbar h-full origin-left rounded-full bg-[#141414]"
            style={{ transformOrigin: "left" }}
            initial={reduced ? false : { scaleX: 0 }}
            animate={reduced ? { scaleX: 0.3 } : undefined}
          />
        </div>

        {/* question */}
        <motion.p
          className="qquestion mt-5 font-geist text-[17px] font-medium leading-snug tracking-[-0.01em] text-[#141414]"
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={reduced ? { opacity: 1, y: 0 } : undefined}
        >
          What is the main function of the mitochondria?
        </motion.p>

        {/* options */}
        <div className="mt-4 flex flex-col gap-2.5">
          {OPTIONS.map((opt) => (
            <motion.div
              key={opt.label}
              className={`qoption ${opt.correct ? "qcorrect" : ""} flex items-center justify-between gap-3 rounded-xl border border-[#141414]/15 bg-[#fdfbf4] px-4 py-2.5`}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={
                reduced
                  ? opt.correct
                    ? { opacity: 1, y: 0, backgroundColor: "rgba(240, 79, 10, 0.10)", borderColor: "#f04f0a" }
                    : { opacity: 1, y: 0 }
                  : undefined
              }
            >
              <span className="font-geist text-[13.5px] font-medium text-[#141414]">
                {opt.label}
              </span>
              {opt.correct && (
                <motion.span
                  className="qcheck shrink-0 text-[#f04f0a]"
                  initial={reduced ? false : { opacity: 0, scale: 0.6 }}
                  animate={reduced ? { opacity: 1, scale: 1 } : undefined}
                >
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={1.8} className="size-5" aria-hidden="true" />
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>

        {/* explanation */}
        <motion.div
          className="qexplain mt-4 rounded-xl border border-[#141414]/12 bg-[#f7f3e7] p-3.5"
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={reduced ? { opacity: 1, y: 0 } : undefined}
        >
          <p className="font-geist text-[12px] font-bold text-[#f04f0a]">Correct</p>
          <p className="mt-1 font-geist text-[12.5px] leading-relaxed text-[#141414]/75">
            Mitochondria release energy through respiration, so the cell has the
            power it needs to work.
          </p>
        </motion.div>
      </FitBox>
    </div>
  );
};

export default SceneQuiz;
