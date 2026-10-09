import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FittedMap, LearningPathMap, PATH, TOTAL, EASE } from "./learning-path-map";
import { PACE } from "./pace";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms * PACE));

/**
 * SceneKeepGoing — Lucid's LearningPathMap, the shared copy, running its
 * walkthrough. Coin one completes, coin two opens with the mascot in it, and
 * so on down the path, then the whole thing resets and runs again. The map
 * itself is unchanged: only where the cursor sits moves.
 */
const SceneKeepGoing = ({ reduced = false, active = true }) => {
  const [cursor, setCursor] = useState(reduced ? TOTAL - 1 : 0);

  useEffect(() => {
    if (reduced || !active) return undefined;
    let cancelled = false;

    const run = async () => {
      while (!cancelled) {
        for (let i = 0; i < TOTAL; i += 1) {
          if (cancelled) return;
          setCursor(i);
          await wait(i === 0 ? 600 : 460);
        }
        if (cancelled) return;
        await wait(1150);
        setCursor(0);
        await wait(300);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [reduced, active]);

  return (
    <FittedMap>
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 * PACE, ease: EASE }}
      >
        <LearningPathMap
          path={PATH}
          cursor={cursor}
          onEnterNode={() => {}}
          onSectionOverview={() => {}}
        />
      </motion.div>
    </FittedMap>
  );
};

export default SceneKeepGoing;
