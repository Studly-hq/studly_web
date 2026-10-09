import React, { useEffect, useRef, useState } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Doc01Icon,
  File02Icon,
  Folder01Icon,
  Note01Icon,
} from "@hugeicons/core-free-icons";
import { PACE } from "./pace";

const EASE = [0.16, 1, 0.3, 1];

/** The five notes the cursor picks up. Everything else stays behind. */
const NOTES = [
  { name: "Cell biology notes", kind: "Pages", icon: Note01Icon },
  { name: "Lecture 4 summary", kind: "PDF", icon: Doc01Icon },
  { name: "ATP and respiration", kind: "Word", icon: File02Icon },
  { name: "Past paper 2023", kind: "PDF", icon: Doc01Icon },
  { name: "Genetics flashcards", kind: "Pages", icon: Note01Icon },
];

const OTHERS = [
  { name: "Reading list", kind: "TXT", icon: File02Icon },
  { name: "Screenshots", kind: "Folder", icon: Folder01Icon },
  { name: "Old drafts", kind: "Folder", icon: Folder01Icon },
];

const SIDEBAR = ["iCloud Drive", "Recents", "Documents", "Desktop", "Downloads"];

const NoteRow = ({ note }) => (
  <div className="row-sel flex h-9 items-center gap-2.5 rounded-md px-2.5">
    <HugeiconsIcon
      icon={note.icon}
      strokeWidth={1.6}
      className="size-4 shrink-0 text-[#141414]/45"
      aria-hidden="true"
    />
    <span className="truncate font-geist text-[12px] font-medium text-[#141414]">
      {note.name}
    </span>
    <span className="ml-auto shrink-0 font-geist text-[10.5px] text-[#141414]/35">
      {note.kind}
    </span>
  </div>
);

const Cursor = () => (
  <svg viewBox="0 0 16 20" className="h-5 w-[15px]" aria-hidden="true">
    <path
      d="M1 1 L1 15.2 L4.9 11.6 L7.3 16.9 L9.7 15.8 L7.3 10.6 L12.7 10.6 Z"
      fill="#141414"
      stroke="#fffcf0"
      strokeWidth="1.1"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * SceneBring — a macOS Files window where a cursor rubber-bands five notes and
 * drags them off the screen.
 *
 * Geometry is measured from the rendered DOM rather than hardcoded, so the
 * selection box lands on the notes at any stage size.
 */
const SceneBring = ({ reduced = false, active = true }) => {
  const [scope, animateAt] = useAnimate();
  const listRef = useRef(null);
  const groupRef = useRef(null);
  const [geo, setGeo] = useState(null);

  useEffect(() => {
    const root = scope.current;
    const list = listRef.current;
    const group = groupRef.current;
    if (!root || !list || !group) return;

    const measure = () => {
      const rb = root.getBoundingClientRect();
      const gb = group.getBoundingClientRect();
      setGeo({
        startX: gb.left - rb.left + gb.width * 0.6,
        startY: gb.bottom - rb.top + 40,
        endX: rb.width + 48,
        endY: gb.top - rb.top + gb.height / 2,
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    ro.observe(list);
    return () => ro.disconnect();
  }, [scope]);

  useEffect(() => {
    if (reduced || !geo || !active) return;
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

    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms * PACE));

    /* Back to the top of the clip: the notes in the list, nothing selected, the
       cursor parked off the corner. Every value here is the one the element is
       mounted with, so every pass of the loop looks like the first one. It runs
       while the window is faded out, so none of the reset is ever seen. */
    const reset = () =>
      Promise.all([
        animate(".win", { opacity: 0, scale: 0.975 }, { duration: 0 }),
        animate(".row", { opacity: 0, x: -6 }, { duration: 0 }),
        animate(".pickgroup", { x: 0, opacity: 1, scale: 1 }, { duration: 0 }),
        animate(
          ".row-sel",
          { backgroundColor: "rgba(20, 20, 20, 0)" },
          { duration: 0 }
        ),
        animate(".band", { scaleY: 0, opacity: 0 }, { duration: 0 }),
        animate(".cursor", { x: 0, y: 0, opacity: 0 }, { duration: 0 }),
      ]);

    const run = async () => {
      try {
        while (!cancelled) {
          await animate(".win", { opacity: 1, scale: 1 }, { duration: 0.5, ease: EASE });
          await animate(
            ".row",
            { opacity: 1, x: 0 },
            { duration: 0.4, delay: stagger(0.045 * PACE), ease: EASE }
          );
          if (cancelled) return;
          await animate(".cursor", { opacity: 1 }, { duration: 0.2 });
          await animate(
            ".cursor",
            { x: geo.startX, y: geo.startY },
            { duration: 0.55, ease: EASE }
          );
          await animate(
            ".band",
            { scaleY: 1, opacity: 1 },
            { duration: 0.42, ease: EASE }
          );
          await animate(
            ".row-sel",
            { backgroundColor: "rgba(20, 20, 20, 0.06)" },
            { duration: 0.2, delay: stagger(0.04 * PACE) }
          );
          if (cancelled) return;
          await animate(
            ".cursor",
            { x: geo.endX, y: geo.endY },
            { duration: 0.5, ease: EASE }
          );
          await animate(
            ".pickgroup",
            { x: 190, opacity: 0, scale: 0.92 },
            { duration: 0.6, ease: EASE }
          );
          await animate(".band", { opacity: 0 }, { duration: 0.2 });
          await animate(".cursor", { opacity: 0 }, { duration: 0.2 });
          if (cancelled) return;

          /* The emptied window is the point of the step, so it gets a beat of
             its own before the clip starts over. */
          await wait(1400);
          if (cancelled) return;
          await animate(".win", { opacity: 0 }, { duration: 0.3, ease: EASE });
          if (cancelled) return;
          await reset();
          await wait(180);
        }
      } catch {
        /* scene unmounted mid-sequence */
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [reduced, geo, active, animateAt]);

  return (
    <div ref={scope} className="relative h-full w-full">
      <motion.div
        className="win absolute inset-3 overflow-hidden rounded-2xl border border-[#ece7d8] bg-[#fffcf0] sm:inset-5"
        initial={reduced ? false : { opacity: 0, scale: 0.975 }}
        animate={reduced ? { opacity: 1, scale: 1 } : undefined}
      >
        <div className="flex h-9 items-center gap-2 border-b border-[#ece7d8] px-3.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
          <span className="mx-auto font-geist text-[11px] font-medium text-[#141414]/45">
            Notes
          </span>
          <span className="w-8 shrink-0" />
        </div>

        <div className="flex h-[calc(100%-2.25rem)]">
          <div className="hidden w-[104px] shrink-0 flex-col gap-0.5 border-r border-[#ece7d8] p-2.5 sm:flex">
            {SIDEBAR.map((s, i) => (
              <span
                key={s}
                className={`truncate rounded-md px-2 py-1 font-geist text-[11px] ${
                  i === 0
                    ? "bg-[#f7f3e7] font-semibold text-[#141414]"
                    : "text-[#141414]/55"
                }`}
              >
                {s}
              </span>
            ))}
          </div>

          <div ref={listRef} className="min-w-0 flex-1 overflow-hidden p-2.5">
            <div className="mb-1.5 flex items-center justify-between px-2.5">
              <span className="font-geist text-[11px] font-semibold text-[#141414]/70">
                Notes
              </span>
              <span className="font-geist text-[10px] text-[#141414]/35">Modified</span>
            </div>

            <div ref={groupRef} className="pickgroup relative flex flex-col gap-0.5">
              <motion.span
                aria-hidden="true"
                className="band pointer-events-none absolute -inset-1 block rounded-md border border-[#0079D3] bg-[#0079D3]/10"
                style={{ transformOrigin: "top left" }}
                initial={reduced ? false : { opacity: 0, scaleY: 0 }}
                animate={reduced ? { opacity: 1, scaleY: 1 } : undefined}
              />
              {NOTES.map((n) => (
                <motion.div
                  key={n.name}
                  className="row"
                  initial={reduced ? false : { opacity: 0, x: -6 }}
                  animate={reduced ? { opacity: 1, x: 0 } : undefined}
                >
                  <NoteRow note={n} />
                </motion.div>
              ))}
            </div>

            <div className="mt-0.5 flex flex-col gap-0.5">
              {OTHERS.map((n) => (
                <motion.div
                  key={n.name}
                  className="row"
                  initial={reduced ? false : { opacity: 0, x: -6 }}
                  animate={reduced ? { opacity: 1, x: 0 } : undefined}
                >
                  <div className="flex h-9 items-center gap-2.5 rounded-md px-2.5">
                    <HugeiconsIcon
                      icon={n.icon}
                      strokeWidth={1.6}
                      className="size-4 shrink-0 text-[#141414]/35"
                      aria-hidden="true"
                    />
                    <span className="truncate font-geist text-[12px] text-[#141414]/55">
                      {n.name}
                    </span>
                    <span className="ml-auto shrink-0 font-geist text-[10.5px] text-[#141414]/30">
                      {n.kind}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {!reduced && (
        <motion.div
          className="cursor pointer-events-none absolute left-0 top-0 z-20"
          initial={{ opacity: 0, x: 0, y: 0 }}
        >
          <Cursor />
        </motion.div>
      )}
    </div>
  );
};

export default SceneBring;
