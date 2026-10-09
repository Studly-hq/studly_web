import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { FileIcon, ImageIcon, Mic01Icon } from "@hugeicons/core-free-icons";
import { SCENE, SCENE_GAP } from "./scene-style";
import { SquareWaveLoader } from "./square-wave-loader";

const { cardWidth: W, cardHeight: H } = SCENE;
const { surface, surfaceRaised, ink, strokeSoft, strokeStrong, fillSubtle, divider, muted, paper, paperLine } = SCENE.colors;

/** Paper fan headroom above the cards. */
const TOP_PAD = 140;
const SCENE_H = H + TOP_PAD;
const COMPOSER_X = W + SCENE_GAP;
/** Distance a paper travels from the folder's centre to the composer's centre. */
const TRAVEL_X = COMPOSER_X;

/**
 * The three papers. Icons match Lucid's own file-type mapping: audio gets the
 * mic, images get the image icon, everything else gets the file icon.
 */
const PAPERS = [
  {
    id: "voice",
    icon: Mic01Icon,
    ext: ".M4A",
    closed: { rotate: -3, x: -38, y: 2 },
    open: { rotate: -8, x: -70, y: -55 },
    spring: { duration: 0.9, bounce: 0.15, stiffness: 90, damping: 18 },
    z: 10,
  },
  {
    id: "pdf",
    icon: FileIcon,
    ext: ".PDF",
    closed: { rotate: 0, x: 0, y: 0 },
    open: { rotate: 1, x: 2, y: -75 },
    spring: { duration: 0.85, bounce: 0.12, stiffness: 100, damping: 20 },
    z: 20,
  },
  {
    id: "img",
    icon: ImageIcon,
    ext: ".IMG",
    closed: { rotate: 3.5, x: 42, y: 1 },
    open: { rotate: 9, x: 75, y: -60 },
    spring: { duration: 0.9, bounce: 0.17, stiffness: 95, damping: 19 },
    z: 10,
  },
];

/** Slow, deliberate carry — no bounce, so the hand feels in control. */
const CARRY = { duration: 2.1, ease: [0.45, 0, 0.2, 1] };
const FLAP_SPRING = { type: "spring", duration: 1.1, bounce: 0.18 };

const PHASE = {
  IDLE: "idle",
  OPEN: "open",
  DRAG: "drag",
  DROP: "drop",
  LOADING: "loading",
  DONE: "done",
};

/** Total cycle length, including a short beat on the closed folder. */
const LOOP_MS = 9800;

/** Timeline (ms) — intentionally slow; full loop is 10.5s. */
const TIMELINE = [
  [300, PHASE.OPEN],
  [1800, PHASE.DRAG],
  // DROP must land exactly when CARRY finishes (1800 + 2100), otherwise the
  // papers arrive late or vanish early.
  [3900, PHASE.DROP],
  [4500, PHASE.LOADING],
  [7300, PHASE.DONE],
  [9400, PHASE.IDLE],
];

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
};

/**
 * Filled grab-hand cursor — the standard drag pointer, drawn from primitives so
 * it stays legible at small sizes.
 */
const HandCursor = ({ className }) => (
  <svg viewBox="0 0 28 30" className={className} fill={ink} aria-hidden="true">
    <rect x="7.6" y="3" width="3.2" height="12" rx="1.6" />
    <rect x="11.4" y="1.4" width="3.2" height="13.6" rx="1.6" />
    <rect x="15.2" y="2.4" width="3.2" height="12.6" rx="1.6" />
    <rect x="19" y="5.4" width="3.2" height="9.6" rx="1.6" />
    <rect x="3.2" y="10.6" width="3.6" height="9.4" rx="1.8" transform="rotate(-18 5 15.3)" />
    <path d="M7.2 12.4h15v6.4a8 8 0 0 1-8 8h-1.6a6 6 0 0 1-5.4-3.6l-1.2-3.2a2.6 2.6 0 0 1 1.2-3.6Z" />
  </svg>
);

/** Paper face: cream card in the shared token style, tagged with its file kind. */
const Paper = ({ icon, ext }) => (
  <div
    className="flex h-full w-full flex-col justify-between rounded-xl p-3"
    style={{
      background: paper,
      border: `1px solid ${strokeSoft}`,
      boxShadow: "0 2px 0 rgba(20,20,20,0.06)",
    }}
  >
    <div className="flex flex-col gap-1.5">
      {[100, 78, 92].map((w, i) => (
        <span key={i} className="h-1.5 rounded-full" style={{ width: `${w}%`, background: paperLine }} />
      ))}
    </div>
    <div className="flex flex-col items-center gap-1">
      <HugeiconsIcon icon={icon} strokeWidth={1.6} className="size-5" style={{ color: ink }} />
      <span className="font-geist text-[10px] font-semibold tracking-[-0.01em]" style={{ color: muted }}>
        {ext}
      </span>
    </div>
  </div>
);

/**
 * The folder, drawn as SVG in the shared style.
 * Back panel (tab + body) sits behind the papers; the front flap is a separate
 * layer above them that swings open on rotateX.
 */
const FolderBack = () => (
  <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" aria-hidden="true">
    <rect x="0.6" y="4" width="110" height="34" rx="10" fill={surface} stroke={strokeSoft} strokeWidth={SCENE.strokeWidth} />
    <rect x="0.6" y="26" width={W - 1.2} height={H - 27} rx={SCENE.radius} fill={surface} stroke={strokeSoft} strokeWidth={SCENE.strokeWidth} />
  </svg>
);

const FolderFront = () => (
  <svg viewBox={`0 0 ${W} ${H - 58}`} width="100%" height="100%" aria-hidden="true">
    <rect
      x="0.6"
      y="0.6"
      width={W - 1.2}
      height={H - 60}
      rx={SCENE.radius}
      fill={surfaceRaised}
      stroke={strokeSoft}
      strokeWidth={SCENE.strokeWidth}
    />
  </svg>
);

/**
 * The composer — Lucid's merged box, mirrored exactly:
 * a dashed drop zone on top, fused to a text input row at the bottom
 * (`or type what you want to learn`, mic button, filled submit button).
 * Drawn as SVG and non-functional by design.
 */
const Composer = ({ active, loading }) => {
  const dividerY = H - 48;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" aria-hidden="true">
      {/* Dashed outline */}
      <motion.rect
        x="0.6"
        y="0.6"
        width={W - 1.2}
        height={H - 1.2}
        rx="20"
        fill={active ? fillSubtle : surface}
        stroke={active ? strokeStrong : strokeSoft}
        strokeWidth={SCENE.strokeWidth}
        strokeDasharray={SCENE.dash}
        animate={{ stroke: active ? strokeStrong : strokeSoft, fill: active ? fillSubtle : surface }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      />

      {/* Fused input row divider */}
      <line x1="0" y1={dividerY} x2={W} y2={dividerY} stroke={divider} strokeWidth="1" />

      {loading ? (
        <g transform={`translate(${W / 2 - 51}, ${(dividerY - 102) / 2 + 20})`}>
          <foreignObject x="0" y="0" width="102" height="102">
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", height: "100%" }}>
              <SquareWaveLoader className="text-[#141414]" />
            </div>
          </foreignObject>
        </g>
      ) : (
        <>
          {/* Upload glyph */}
          <g
            transform="translate(126 46)"
            stroke={ink}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={active ? 0.9 : 0.75}
          >
            <path d="M14 22V3" />
            <path d="M6.5 10.5 14 3l7.5 7.5" />
            <path d="M3 18v3.5a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V18" />
          </g>
          <text
            x={W / 2}
            y="100"
            textAnchor="middle"
            fontFamily="Geist, ui-sans-serif, sans-serif"
            fontSize="11.5"
            fontWeight="500"
            fill={muted}
          >
            Click or drag files to upload
          </text>
        </>
      )}

      {/* Input row: placeholder */}
      <text
        x="16"
        y={dividerY + 29}
        fontFamily="Geist, ui-sans-serif, sans-serif"
        fontSize="11.5"
        fill={muted}
        opacity="0.85"
      >
        or type what you want to learn
      </text>

      {/* Mic button */}
      <g transform={`translate(${W - 62} ${dividerY + 12})`} stroke={muted} strokeWidth="1.6" fill="none" strokeLinecap="round">
        <rect x="4.5" y="0.5" width="5" height="9" rx="2.5" />
        <path d="M2 8.5a5 5 0 0 0 10 0" />
        <path d="M7 15v2.5" />
      </g>

      {/* Submit button — filled, matches Lucid's bg-primary circle */}
      <circle cx={W - 24} cy={dividerY + 24} r="13" fill={ink} />
      <g transform={`translate(${W - 31} ${dividerY + 17})`} stroke={surface} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M7 13V1" />
        <path d="M2.5 5.5 7 1l4.5 4.5" />
      </g>
    </svg>
  );
};

/**
 * Hero scene: the folder opens, a hand carries the tagged papers across, they
 * drop into the composer, and the wave loader plays.
 *
 * The composer is decorative — no inputs, no handlers, nothing uploads.
 * Respects prefers-reduced-motion by holding the closed state.
 */
function FolderUploadScene({ className = "" }) {
  const [phase, setPhase] = useState(PHASE.IDLE);
  const [cycle, setCycle] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const timers = useRef([]);

  /**
   * Each cycle runs the whole timeline, then bumps `cycle`, which re-runs this
   * effect and schedules the next pass. Cleanup clears every pending timer so
   * phases can never fire out of order across cycles.
   */
  useEffect(() => {
    if (reducedMotion) {
      setPhase(PHASE.IDLE);
      return undefined;
    }

    const queued = TIMELINE.map(([delay, next]) => setTimeout(() => setPhase(next), delay));
    queued.push(setTimeout(() => setCycle((c) => c + 1), LOOP_MS));
    timers.current = queued;

    return () => queued.forEach(clearTimeout);
  }, [reducedMotion, cycle]);

  const flapOpen = phase !== PHASE.IDLE;
  const carrying = phase === PHASE.DRAG;
  const landed = phase === PHASE.DROP || phase === PHASE.LOADING || phase === PHASE.DONE;
  const loading = phase === PHASE.LOADING || phase === PHASE.DONE;

  /** Where a paper sits for the current phase, in card-relative coordinates. */
  const paperPose = (p) => {
    if (phase === PHASE.IDLE) return p.closed;
    if (phase === PHASE.OPEN) return p.open;
    if (carrying) {
      return { x: p.open.x + TRAVEL_X, y: p.open.y, rotate: 0, scale: 0.62, opacity: 1 };
    }
    return { x: p.open.x + TRAVEL_X, y: p.open.y, rotate: 0, scale: 0.35, opacity: 0 };
  };

  return (
    <div className={className}>
      <div className="relative mx-auto" style={{ width: W * 2 + SCENE_GAP, height: SCENE_H }}>
        {/* Folder */}
        <div className="absolute left-0" style={{ top: TOP_PAD, width: W, height: H }}>
          <FolderBack />

          {/* Papers */}
          {PAPERS.map((p) => (
            <motion.div
              key={p.id}
              className="absolute left-1/2 top-1/2 h-[128px] w-[100px] -translate-x-1/2 -translate-y-1/2"
              style={{ zIndex: p.z }}
              initial={p.closed}
              animate={paperPose(p)}
              transition={carrying || landed ? CARRY : p.spring}
            >
              <Paper icon={p.icon} ext={p.ext} />
            </motion.div>
          ))}

          {/* Front flap — above the papers so they emerge from inside */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 z-30"
            style={{ height: H - 58, transformOrigin: "bottom center", perspective: 1400 }}
            animate={{ rotateX: flapOpen ? -38 : 0 }}
            transition={FLAP_SPRING}
          >
            <FolderFront />
          </motion.div>
        </div>

        {/* Hand cursor */}
        <motion.div
          className="absolute z-40"
          style={{ width: 30, height: 32, left: W / 2 - 46, top: TOP_PAD + H / 2 - 16 }}
          initial={false}
          animate={
            carrying
              ? {
                  // Arc across rather than sliding in a straight line — the
                  // hand rises, carries over, then sets down into the composer.
                  // Motion's arc() needs framer-motion >= 11; keyframes + times
                  // give the same curve on v10.
                  x: [0, 70, 220, TRAVEL_X + 26],
                  y: [0, -72, -86, -34],
                  opacity: 1,
                  scale: 1,
                }
              : {
                  x: TRAVEL_X + 26,
                  y: -34,
                  opacity: 0,
                  scale: 0.9,
                }
          }
          transition={
            carrying
              ? { duration: CARRY.duration, ease: CARRY.ease, times: [0, 0.28, 0.65, 1] }
              : { duration: 0.4 }
          }
        >
          <HandCursor className="h-full w-full drop-shadow-sm" />
        </motion.div>

        {/* Composer */}
        <div className="absolute" style={{ left: COMPOSER_X, top: TOP_PAD, width: W, height: H }}>
          <Composer active={carrying || phase === PHASE.DROP} loading={loading} />
        </div>
      </div>
    </div>
  );
}

export default FolderUploadScene;
