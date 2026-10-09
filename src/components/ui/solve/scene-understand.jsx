import React, { useEffect, useRef } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Doc01Icon,
  File02Icon,
  Note01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { PACE } from "./pace";

const EASE = [0.16, 1, 0.3, 1];

/* The nine notes, in the order they end up. `scrib` is what the student
   actually wrote on the page, `label` is the same thought once it has been
   read. `cloud` is where the note lies in px from the slot it finally
   occupies, so the heap is the settled layout pushed apart rather than a
   second hand-tuned layout that has to be kept in sync with the first. The
   numbers keep every note inside a 704x505 panel at the largest scale it
   wears. */
const SECTIONS = [
  {
    title: "Foundations of the cell",
    notes: [
      {
        label: "Cell theory",
        scrib: "cells come from cells",
        icon: Note01Icon,
        cloud: { x: -104, y: -150, r: -8, s: 0.84 },
      },
      {
        label: "Membrane structure",
        scrib: "what gets in and out",
        icon: Doc01Icon,
        cloud: { x: 74, y: -142, r: 7, s: 0.9 },
      },
      {
        label: "Organelles",
        scrib: "little organs?",
        icon: File02Icon,
        cloud: { x: -46, y: -104, r: -5, s: 0.8 },
      },
    ],
  },
  {
    title: "Energy and transport",
    notes: [
      {
        label: "ATP and respiration",
        scrib: "where the energy is",
        icon: Doc01Icon,
        cloud: { x: -138, y: -78, r: 9, s: 0.86 },
      },
      {
        label: "Osmosis in practice",
        scrib: "water moves across",
        icon: Note01Icon,
        cloud: { x: 40, y: 26, r: -9, s: 0.82 },
      },
      {
        label: "Section quiz",
        scrib: "am i ready?",
        icon: File02Icon,
        cloud: { x: 146, y: -66, r: 6, s: 0.92 },
      },
    ],
  },
  {
    title: "Genetics and division",
    notes: [
      {
        label: "DNA to protein",
        scrib: "dna makes protein",
        icon: Note01Icon,
        cloud: { x: -118, y: 96, r: 8, s: 0.88 },
      },
      {
        label: "Mitosis",
        scrib: "the cell splits",
        icon: Doc01Icon,
        cloud: { x: 126, y: 118, r: -7, s: 0.84 },
      },
      {
        label: "Past questions",
        scrib: "2023 past paper",
        icon: File02Icon,
        cloud: { x: -180, y: 140, r: 5, s: 0.9 },
      },
    ],
  },
];

/* Document order, which is the order the notes are read and the order the
   stagger runs, so the reading pass and the notes agree on which note is
   next without either of them being told. */
const NOTES = SECTIONS.flatMap((section) => section.notes);
const TOTAL = NOTES.length;

const READ_STAGGER = 0.105;
const SETTLE_STAGGER = 0.045;

/**
 * SceneUnderstand — "Studly understands them".
 *
 * A heap of the student's own notes, handwriting and icons still on them. A
 * reading pass crosses the panel, and each note it reaches stops being a
 * scribble and becomes a titled lesson. Then the heap takes its places: three
 * sections, in order, inside one document.
 *
 * Nothing is drawn and nothing is added. The same nine notes are the heap and
 * the document, which is the point of the step.
 *
 * Depth is carried by hairline borders only (DESIGN.md: no shadows, no glows).
 * Driven imperatively, like the other scenes in this folder: the declarative
 * animate prop does not reliably update opacity through this stage.
 */
const SceneUnderstand = ({ reduced = false, active = true }) => {
  const [scope, animateAt] = useAnimate();
  const box = useRef(0);

  /* The reading pass travels the real panel, so its span is measured rather
     than guessed at. */
  useEffect(() => {
    const el = scope.current;
    if (!el) return undefined;
    const measure = () => {
      box.current = el.getBoundingClientRect().width;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [scope]);

  useEffect(() => {
    if (reduced || !active) return undefined;
    const root = scope.current;
    if (!root) return undefined;
    let cancelled = false;
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms * PACE));

    /* The durations and holds written below are the ones this scene was tuned
       at, not the ones it runs at. */
    const animate = (target, keyframes, options = {}) =>
      animateAt(target, keyframes, {
        ...options,
        duration:
          (options.duration === undefined ? 0.3 : options.duration) * PACE,
        delay:
          typeof options.delay === "number" ? options.delay * PACE : options.delay,
      });
    const frags = Array.from(root.querySelectorAll(".frag"));

    /* The cloud offsets are tuned for the desktop stage, which is the widest
       panel this runs in. Narrower ones get the notes pushed off the edge, so
       the heap is spread to the room it actually has. The outermost note sits
       142px from the centre once settled and carries the largest offset, so
       half a panel, less that seat and half a chip, is the room left to
       scatter into. Rotation and scale still carry the messiness when there
       is almost nothing to move. */
    const spread = () => {
      /* Measured here rather than read off the observer, because the heap
         scatters on the first frame and the first reading can arrive after it.
         A wrong width means notes hanging off the edge of the panel. */
      const w = box.current || root.getBoundingClientRect().width;
      if (!w) return 0.4;
      return Math.max(0.18, Math.min(1, (w / 2 - 210) / 146));
    };
    const note = (i, k) => {
      const c = NOTES[i].cloud;
      return { x: c.x * k, y: c.y * k, rotate: c.r, scale: c.s };
    };

    /* Every note back where it was lying, in one go. Each note carries its
       own offset, so this one cannot be a selector call. */
    const scatter = (options, staggerBy = 0) => {
      const k = spread();
      return Promise.all(
        frags.map((el, i) =>
          animate(el, note(i, k), { ...options, delay: i * staggerBy })
        )
      );
    };

    const run = async () => {
      try {
        scatter({ duration: 0 });

        while (!cancelled) {
          await Promise.all([
            ...frags.map((el, i) =>
              animate(
                el,
                { opacity: 1 },
                { duration: 0.34, ease: EASE, delay: i * 0.05 }
              )
            ),
            animate(".frag-lbl", { opacity: 0 }, { duration: 0 }),
            animate(".frag-scrib", { opacity: 1 }, { duration: 0 }),
            animate(".frag-glyph", { opacity: 0.5 }, { duration: 0 }),
          ]);
          if (cancelled) return;
          await wait(240);
          if (cancelled) return;

          /* The reading pass and the notes it is reading, on one clock. */
          await Promise.all([
            animate(
              ".sweep",
              { opacity: 1 },
              { duration: 0.18, ease: "linear" }
            ),
            animate(
              ".sweep",
              { x: box.current + 60 },
              { duration: 1.15, ease: "linear" }
            ),
            animate(
              ".frag-glyph",
              { opacity: 0 },
              { duration: 0.26, ease: EASE, delay: stagger(READ_STAGGER * PACE) }
            ),
            animate(
              ".frag-lit",
              { opacity: 1 },
              { duration: 0.3, ease: EASE, delay: stagger(READ_STAGGER * PACE) }
            ),
            animate(
              ".frag-scrib",
              { opacity: 0 },
              { duration: 0.3, ease: EASE, delay: stagger(READ_STAGGER * PACE) }
            ),
            animate(
              ".frag-lbl",
              { opacity: 1 },
              { duration: 0.3, ease: EASE, delay: stagger(READ_STAGGER * PACE) }
            ),
          ]);
          if (cancelled) return;

          /* And then the heap takes its places. */
          await Promise.all([
            animate(
              ".frag",
              { x: 0, y: 0, rotate: 0, scale: 1 },
              { duration: 0.72, ease: EASE, delay: stagger(SETTLE_STAGGER * PACE) }
            ),
            animate(
              ".frag-lit",
              { opacity: 0 },
              { duration: 0.4, ease: EASE, delay: stagger(SETTLE_STAGGER * PACE) }
            ),
            animate(
              ".sheet-frame",
              { opacity: 1 },
              { duration: 0.5, ease: EASE, delay: 0.12 }
            ),
            animate(
              ".sheet-head",
              { opacity: 1 },
              { duration: 0.45, ease: EASE, delay: 0.18 }
            ),
            animate(
              ".sheet-group",
              { opacity: 1, y: 0 },
              {
                duration: 0.45,
                ease: EASE,
                delay: stagger(0.07 * PACE, { startDelay: 0.22 * PACE }),
              }
            ),
            animate(
              ".sheet-foot",
              { opacity: 1 },
              { duration: 0.45, ease: EASE, delay: 0.42 }
            ),
          ]);
          if (cancelled) return;

          await wait(1500);
          if (cancelled) return;

          /* It lets go: the frame goes, the notes drift back out. */
          await Promise.all([
            animate(".sheet-frame", { opacity: 0 }, { duration: 0.3, ease: EASE }),
            animate(".sheet-head", { opacity: 0 }, { duration: 0.3, ease: EASE }),
            animate(
              ".sheet-group",
              { opacity: 0 },
              { duration: 0.3, ease: EASE }
            ),
            animate(".sheet-foot", { opacity: 0 }, { duration: 0.3, ease: EASE }),
            scatter({ duration: 0.66, ease: EASE }, SETTLE_STAGGER),
          ]);
          if (cancelled) return;
          await wait(320);
          if (cancelled) return;

          await Promise.all([
            animate(".frag-scrib", { opacity: 1 }, { duration: 0.3, ease: EASE }),
            animate(".frag-lbl", { opacity: 0 }, { duration: 0.3, ease: EASE }),
            animate(
              ".frag-glyph",
              { opacity: 0.5 },
              { duration: 0.3, ease: EASE }
            ),
            ...frags.map((el, i) =>
              animate(
                el,
                { opacity: 0 },
                { duration: 0.3, ease: EASE, delay: i * 0.03 }
              )
            ),
          ]);
          if (cancelled) return;
          await wait(380);
          if (cancelled) return;

          animate(".sweep", { x: -60, opacity: 0 }, { duration: 0 });
          await wait(260);
        }
      } catch {
        /* scene unmounted mid-sequence */
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [reduced, active, animateAt, scope]);

  return (
    <div
      ref={scope}
      className="relative flex h-full w-full items-center justify-center"
    >
      {/* The reading pass. A translucent band with one crisp leading edge,
          which is a lamp moving over a page rather than a glow. */}
      <motion.div
        aria-hidden="true"
        className="sweep pointer-events-none absolute inset-y-0 left-0 z-30 w-[56px]"
        initial={reduced ? false : { x: -60, opacity: 0 }}
        animate={reduced ? { x: -60, opacity: 0 } : undefined}
      >
        <span className="absolute inset-0 bg-[#e8f4fd]/60" />
        <span className="absolute inset-y-0 right-0 w-px bg-[#90caf9]" />
        <span className="absolute inset-y-0 left-0 w-px bg-[#90caf9]/35" />
      </motion.div>

      <div className="relative w-full max-w-[442px]">
        {/* The document frame. Separated from the notes so it can appear while
            they are still in flight, and so it never clips them. */}
        <motion.div
          aria-hidden="true"
          className="sheet-frame absolute -inset-x-3.5 -inset-y-3.5 rounded-2xl border border-[#ece7d8] bg-[#fffcf0]"
          initial={reduced ? false : { opacity: 0 }}
          animate={reduced ? { opacity: 1 } : undefined}
        />

        <div className="relative flex flex-col gap-3 px-3 py-2">
          <motion.div
            aria-hidden="true"
            className="sheet-head flex items-start justify-between"
            initial={reduced ? false : { opacity: 0 }}
            animate={reduced ? { opacity: 1 } : undefined}
          >
            <div>
              <p className="font-geist text-[13px] font-semibold tracking-[-0.02em] text-[#141414]">
                Cell Biology, Unit 3
              </p>
              <p className="mt-0.5 font-geist text-[11px] text-[#726f6c]">
                Understanding your notes
              </p>
            </div>
            <span className="mt-0.5 rounded-full border border-[#141414]/10 bg-[#f7f3e7]/70 px-2 py-[3px] font-geist text-[10px] font-medium text-[#726f6c]">
              {TOTAL} notes
            </span>
          </motion.div>

          {SECTIONS.map((section, groupIndex) => (
            <div key={section.title} className="flex flex-col gap-1.5">
              <motion.div
                aria-hidden="true"
                className="sheet-group flex items-center gap-2 pl-px"
                initial={reduced ? false : { opacity: 0, y: 6 }}
                animate={reduced ? { opacity: 1, y: 0 } : undefined}
              >
                <span className="flex size-[18px] shrink-0 items-center justify-center rounded-full border border-[#141414]/12 font-geist text-[10px] font-semibold text-[#141414]">
                  {groupIndex + 1}
                </span>
                <span className="truncate font-geist text-[12px] font-semibold tracking-[-0.01em] text-[#141414]">
                  {section.title}
                </span>
              </motion.div>

              <div className="flex gap-1.5 pl-[26px]">
                {section.notes.map((n, noteIndex) => {
                  return (
                    <motion.div
                      key={n.label}
                      className="frag relative h-9 min-w-0 flex-1 rounded-[10px] border border-[#ece7d8] bg-[#fffcf0]"
                      style={{ zIndex: 10 + groupIndex * 3 + noteIndex }}
                      initial={reduced ? false : { opacity: 0 }}
                      animate={
                        reduced
                          ? { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }
                          : undefined
                      }
                    >
                      {/* Lit while the pass is over it. Solid hairline, faded
                          in and out, rather than an interpolated colour. */}
                      <span
                        aria-hidden="true"
                        className="frag-lit pointer-events-none absolute inset-0 rounded-[10px] border border-[#90caf9]"
                      />

                      {/* The file chrome. It stops mattering the moment the
                          note is understood, so it leaves and never comes
                          back. */}
                      <motion.span
                        aria-hidden="true"
                        className="frag-glyph absolute left-[9px] top-1/2 -translate-y-1/2 text-[#141414]"
                        initial={reduced ? false : { opacity: 0.5 }}
                        animate={reduced ? { opacity: 0 } : undefined}
                      >
                        <HugeiconsIcon
                          icon={n.icon}
                          strokeWidth={1.7}
                          className="size-3.5"
                        />
                      </motion.span>

                      {/* What the student wrote. */}
                      <motion.span
                        className="frag-scrib absolute inset-y-0 left-[27px] right-2 flex flex-col justify-center overflow-hidden font-scribble text-[13.5px] leading-[1.03] text-[#141414]/70"
                        initial={reduced ? false : { opacity: 1 }}
                        animate={reduced ? { opacity: 0 } : undefined}
                      >
                        {n.scrib}
                      </motion.span>

                      {/* What it turned out to be. */}
                      <motion.span
                        className="frag-lbl absolute inset-y-0 left-2.5 right-2 flex flex-col justify-center overflow-hidden truncate whitespace-nowrap font-geist text-[11px] font-medium tracking-[-0.01em] text-[#141414]"
                        initial={reduced ? false : { opacity: 0 }}
                        animate={reduced ? { opacity: 1 } : undefined}
                      >
                        {n.label}
                      </motion.span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}

          <motion.div
            aria-hidden="true"
            className="sheet-foot flex items-center gap-2 border-t border-[#ece7d8] pt-2.5"
            initial={reduced ? false : { opacity: 0 }}
            animate={reduced ? { opacity: 1 } : undefined}
          >
            <HugeiconsIcon
              icon={Tick02Icon}
              strokeWidth={2.4}
              className="size-3.5 text-[#f04f0a]"
            />
            <span className="font-geist text-[11px] font-medium text-[#141414]">
              {TOTAL} notes read
            </span>
            <span className="ml-auto font-geist text-[11px] text-[#726f6c]">
              {SECTIONS.length} sections
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SceneUnderstand;
