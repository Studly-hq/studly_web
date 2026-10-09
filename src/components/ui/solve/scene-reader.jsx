import React, { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "@hugeicons/core-free-icons";
import { PACE } from "./pace";

const EASE = [0.16, 1, 0.3, 1];

/**
 * ProgressDots — direct port of Lucid's SubSectionReader ProgressDots, re-toned
 * to light: the active dot stretches to 32px in Lucid orange, the rest sit as
 * 12px pills.
 */
const ProgressDots = ({ count, active }) => (
  <div className="flex min-w-0 flex-1 items-center justify-center gap-2 px-2">
    <div className="flex w-fit min-w-0 max-w-full items-center gap-1.5 overflow-x-auto py-2">
      {Array.from({ length: count }).map((_, i) => (
        <motion.span
          key={i}
          aria-label={`Sub-section ${i + 1}`}
          animate={{
            width: i === active ? 32 : 12,
            backgroundColor: i === active ? "#ff4500" : "rgba(20, 20, 20, 0.15)",
          }}
          transition={{ duration: 0.3 * PACE, ease: EASE }}
          className="h-3 shrink-0 rounded-full"
        />
      ))}
    </div>
  </div>
);

/**
 * DockButton — direct port of Lucid's SubSectionReader DockButton ("coin
 * physics: rise on hover, press on click"), re-toned to the light palette.
 * Neutral keeps the surface face; accent keeps Lucid's exact orange extrude.
 */
const DockButton = ({ label, tone, disabled = false }) => {
  const tones = {
    neutral: {
      face: "bg-[#f7f3e7]",
      ring: "border-[#141414]/20",
      shadow: "0 4px 0 0 rgba(20,20,20,0.07), 0 5px 0 0 rgba(20,20,20,0.12)",
      shadowHover: "0 6px 0 0 rgba(20,20,20,0.07), 0 8px 0 0 rgba(20,20,20,0.12)",
    },
    accent: {
      face: "bg-[#ff4500]",
      ring: "border-[#ff4500]/60",
      shadow: "0 4px 0 0 #b13d0a, 0 5px 0 0 #8f3008",
      shadowHover: "0 6px 0 0 #b13d0a, 0 8px 0 0 #8f3008",
    },
  }[tone];

  return (
    <motion.button
      type="button"
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -2, boxShadow: tones.shadowHover }}
      whileTap={disabled ? undefined : { y: 2, boxShadow: "0 0 0 0 rgba(0,0,0,0)" }}
      initial={false}
      animate={{ boxShadow: tones.shadow }}
      transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
      className={`inline-flex w-full items-center justify-center rounded-xl border px-4 py-3 font-geist text-base font-medium tracking-wide outline-none ${tones.face} ${tones.ring} ${
        disabled ? "cursor-not-allowed opacity-60" : ""
      }`}
    >
      {label}
    </motion.button>
  );
};

/**
 * SceneReader — a static, light-toned replica of Lucid's sub-page reader view
 * (src/components/learn/SubSectionReader.tsx): same top bar with progress dots,
 * reading column with the term underline, the extruded action buttons and the
 * 1fr/3fr dock.
 */
const SceneReader = ({ reduced = false, active = true }) => {
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
        await animate(".rbar", { opacity: 1, y: 0 }, { duration: 0.4, ease: EASE });
        await animate(".rarticle", { opacity: 1, y: 0 }, { duration: 0.5, ease: EASE });
        if (cancelled) return;
        await animate(
          ".rline",
          { opacity: 1, y: 0 },
          { duration: 0.4, delay: stagger(0.08 * PACE), ease: EASE }
        );
        await animate(".ractions", { opacity: 1, y: 0 }, { duration: 0.4, ease: EASE });
        await animate(".rdock", { opacity: 1, y: 0 }, { duration: 0.4, ease: EASE });
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
    <div ref={scope} className="flex h-full w-full flex-col bg-[#fffcf0]">
      {/* top bar — exit, progress dots, mascot, exactly as Lucid orders them */}
      <motion.header
        className="rbar relative z-20 mx-auto flex w-full max-w-[560px] items-center gap-2 px-4 py-3"
        initial={reduced ? false : { opacity: 0, y: -8 }}
        animate={reduced ? { opacity: 1, y: 0 } : undefined}
      >
        <span className="flex size-8 items-center justify-center rounded-lg p-2 text-[#141414]/70">
          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-6" aria-hidden="true" />
        </span>
        <ProgressDots count={5} active={2} />
        <img
          src="/mascot.webp"
          srcSet="/mascot.webp 1x, /mascot@2x.webp 2x"
          alt=""
          draggable={false}
          className="ml-1 size-[52px] shrink-0 select-none object-contain"
        />
      </motion.header>

      {/* content */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <motion.article
          className="rarticle mx-auto w-full max-w-[520px] px-5 pt-1"
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={reduced ? { opacity: 1, y: 0 } : undefined}
        >
          <h1 className="font-geist text-xl font-semibold leading-tight tracking-[-0.02em] text-[#141414] sm:text-2xl">
            Organelles
          </h1>

          <div className="mt-4 flex flex-col gap-2.5">
            <motion.p
              className="rline font-geist text-[13px] leading-relaxed text-[#141414]/75"
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={reduced ? { opacity: 1, y: 0 } : undefined}
            >
              Organelles are the specialised structures inside a cell, each doing a
              distinct job. The nucleus holds the DNA and directs activity.
            </motion.p>
            <motion.p
              className="rline font-geist text-[13px] leading-relaxed text-[#141414]/75"
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={reduced ? { opacity: 1, y: 0 } : undefined}
            >
              Mitochondria release energy through respiration. The{" "}
              <span className="cursor-pointer border-b-2 border-[#ff4500]/60 pb-px font-semibold text-[#141414]">
                cell membrane
              </span>{" "}
              controls what moves in and out.
            </motion.p>
            <motion.p
              className="rline font-geist text-[13px] leading-relaxed text-[#141414]/75"
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={reduced ? { opacity: 1, y: 0 } : undefined}
            >
              Together these parts let a cell stay alive, grow and divide.
            </motion.p>
          </div>

          {/* actions — the extruded "Check my understanding" + feedback pair */}
          <motion.div
            className="ractions mt-6 flex flex-wrap items-stretch gap-2"
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={reduced ? { opacity: 1, y: 0 } : undefined}
          >
            <motion.button
              type="button"
              initial={false}
              animate={{
                boxShadow: "0 3px 0 0 rgba(20,20,20,0.06), 0 4px 0 0 rgba(20,20,20,0.10)",
              }}
              whileHover={{
                y: -2,
                boxShadow: "0 5px 0 0 rgba(20,20,20,0.06), 0 6px 0 0 rgba(20,20,20,0.10)",
              }}
              whileTap={{ y: 2, boxShadow: "0 0 0 0 rgba(0,0,0,0)" }}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#141414]/20 bg-[#f7f3e7] px-4 py-3 font-geist text-sm font-medium text-[#141414]/80"
            >
              Check my understanding
            </motion.button>

            <div className="ms-auto flex items-center gap-2">
              {["up", "down"].map((v) => (
                <motion.span
                  key={v}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex size-10 items-center justify-center rounded-xl border border-[#141414]/15 text-[#726f6c]"
                >
                  <HugeiconsIcon
                    icon={v === "up" ? ThumbsUpIcon : ThumbsDownIcon}
                    strokeWidth={1.8}
                    className="size-4"
                    aria-hidden="true"
                  />
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.article>
      </div>

      {/* bottom dock — 1fr/3fr Back + Next, coin physics */}
      <motion.footer
        className="rdock border-t border-[#141414]/10 bg-[#fffcf0] px-4 pb-4 pt-3"
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={reduced ? { opacity: 1, y: 0 } : undefined}
      >
        <div className="mx-auto grid w-full max-w-[520px] grid-cols-[1fr_3fr] gap-3">
          <DockButton label="Back" tone="neutral" />
          <DockButton label="Next section" tone="accent" />
        </div>
      </motion.footer>
    </div>
  );
};

export default SceneReader;
