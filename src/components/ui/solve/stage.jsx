import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import SceneBring from "./scene-bring";
import SceneUnderstand from "./scene-understand";
import ScenePath from "./scene-path";
import SceneReader from "./scene-reader";
import SceneQuiz from "./scene-quiz";
import SceneKeepGoing from "./scene-keepgoing";
import { SWAP_PACE } from "./pace";

const EASE = [0.16, 1, 0.3, 1];

const SCENES = {
  bring: SceneBring,
  understand: SceneUnderstand,
  path: ScenePath,
  reader: SceneReader,
  quiz: SceneQuiz,
  keep: SceneKeepGoing,
};

/**
 * SolveStage — the tinted panel on the right. Holds one evolving illustration:
 * each cross-fades into the next while the panel tint shifts with it.
 * `replayKey` remounts the active scene so the Replay button restarts it.
 */
const SolveStage = ({ step, reduced = false, play = true, replayKey = 0 }) => {
  const Scene = SCENES[step.scene] || SceneBring;

  return (
    <motion.div
      role="img"
      aria-label={step.alt}
      className="relative h-full w-full overflow-hidden rounded-2xl border border-[#ece7d8]"
      initial={false}
      animate={{ backgroundColor: step.tint }}
      transition={{ duration: 0.6 * SWAP_PACE, ease: EASE }}
    >
      <AnimatePresence>
        <motion.div
          key={`${step.id}-${replayKey}`}
          className="absolute inset-0"
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.45 * SWAP_PACE, ease: EASE }}
        >
          <Scene reduced={reduced} active={play} />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default SolveStage;

