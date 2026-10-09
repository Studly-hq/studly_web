import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FittedMap,
  PATH,
  SectionBlock,
  sectionNodes,
  EASE,
} from "./learning-path-map";
import { PACE } from "./pace";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms * PACE));

/* Which coins belong to which section, in walk order. */
const GROUPS = PATH.sections.map((_, sIdx) => sectionNodes(sIdx));

/**
 * ScenePath — "Creates a learning path". The real map, arriving.
 *
 * Nothing is drawn: one section at a time, each header row sliding in with its
 * three coins still spinning as Studly writes them, then settling into real
 * coins with the first one current and the mascot waiting inside it. Three
 * waves, a beat to read the finished path, then it starts over. The cursor
 * never moves: the path is being made, not studied.
 */
const ScenePath = ({ reduced = false, active = true }) => {
  const [revealed, setRevealed] = useState(reduced ? PATH.sections.length : 0);
  const [generating, setGenerating] = useState([]);

  useEffect(() => {
    if (reduced || !active) return undefined;
    let cancelled = false;

    const run = async () => {
      while (!cancelled) {
        for (let s = 0; s < PATH.sections.length; s += 1) {
          if (cancelled) return;
          setRevealed(s + 1);
          setGenerating(GROUPS[s]);
          await wait(980);
          if (cancelled) return;
          setGenerating([]);
          await wait(520);
        }
        if (cancelled) return;
        await wait(1900);
        if (cancelled) return;
        setRevealed(1);
        await wait(620);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [reduced, active]);

  return (
    <FittedMap>
      {/* Same wrapper Lucid's LearningPathMap renders, so the assembled map
          is byte-for-byte the map in the next-to-last step. */}
      <div className="flex flex-col gap-1">
        <AnimatePresence initial={false}>
          {PATH.sections.slice(0, revealed).map((section, sIdx) => (
            <motion.div
              key={section.id}
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.5 * PACE, ease: EASE }}
            >
              <SectionBlock
                section={section}
                sectionIndex={sIdx}
                path={PATH}
                cursor={0}
                generating={generating}
                onEnterNode={() => {}}
                onSectionOverview={() => {}}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </FittedMap>
  );
};

export default ScenePath;
