import React from "react";
import { motion, useTransform } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Camera01Icon,
  Chat01Icon,
  Doc01Icon,
  File02Icon,
  GoogleDriveIcon,
  Mic01Icon,
  Note01Icon,
  Presentation01Icon,
} from "@hugeicons/core-free-icons";
import { SCENE } from "./scene-style";
import logo from "../../assets/logo.webp";

const { ink, strokeSoft, muted, paper, paperLine, surfaceRaised } = SCENE.colors;

/**
 * Timeline, in progress units (0 → 1 across the pinned stage):
 *   0.40–0.72  scattered cards travel to the centre
 *   0.56–0.74  and are swallowed as they pass under the session card
 *   0.62–0.80  the Studly session card arrives on top
 *   0.80–0.96  the connector line draws out of the bottom edge
 */
const CONVERGE = [0.4, 0.72];
const FADE = [0.56, 0.74];
const CARD_IN = [0.62, 0.8];
const LINE_OUT = [0.8, 0.96];

/**
 * The sources a student actually has lying around. Offsets are the scattered
 * poses (px, from the stage centre); rotations keep them feeling hand-dropped.
 */
const FILES = [
  { id: "slides", label: "Lecture slides", ext: ".PPTX", icon: Presentation01Icon, x: -170, y: -140, r: -10, z: 20 },
  { id: "pdf", label: "PDF notes", ext: ".PDF", icon: Doc01Icon, x: -55, y: -170, r: 6, z: 24 },
  { id: "chat", label: "WhatsApp notes", ext: ".TXT", icon: Chat01Icon, x: 120, y: -150, r: -7, z: 22 },
  { id: "shot", label: "Screenshot", ext: ".PNG", icon: Camera01Icon, x: -185, y: -15, r: 8, z: 26 },
  { id: "drive", label: "Google Drive", ext: "DRIVE", icon: GoogleDriveIcon, x: 175, y: -25, r: -6, z: 25 },
  { id: "past", label: "Past questions", ext: ".PDF", icon: Note01Icon, x: -150, y: 125, r: -7, z: 21 },
  { id: "voice", label: "Voice note", ext: ".M4A", icon: Mic01Icon, x: 15, y: 155, r: 5, z: 23 },
  { id: "doc", label: "Random doc", ext: ".DOCX", icon: File02Icon, x: 160, y: 135, r: -9, z: 19 },
];

/** One scattered source card. Hooks live here so each card owns its own chain. */
const ScatterFile = ({ file, index, progress }) => {
  const x = useTransform(progress, CONVERGE, [file.x, ((index % 3) - 1) * 16]);
  const y = useTransform(progress, CONVERGE, [file.y, (Math.floor(index / 3) - 1) * 12]);
  const rotate = useTransform(progress, CONVERGE, [file.r, 0]);
  const scale = useTransform(progress, CONVERGE, [1, 0.8]);
  const opacity = useTransform(progress, FADE, [1, 0]);

  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{ transform: "translate(-50%, -50%)", zIndex: file.z }}
    >
      <motion.div style={{ x, y, rotate, scale, opacity }} className="w-[132px]">
        <div
          className="relative flex h-[86px] w-[132px] flex-col justify-between rounded-xl p-2.5"
          style={{
            background: paper,
            border: `1px solid ${strokeSoft}`,
          }}
        >
          <div className="flex flex-col gap-1.5 pr-9">
            <span className="h-1.5 rounded-full" style={{ width: "78%", background: paperLine }} />
            <span className="h-1.5 rounded-full" style={{ width: "52%", background: paperLine }} />
          </div>

          <div className="flex min-w-0 items-center gap-1.5">
            <HugeiconsIcon
              icon={file.icon}
              strokeWidth={1.6}
              className="size-4 shrink-0"
              style={{ color: ink }}
            />
            <span
              className="truncate font-geist text-[10.5px] font-medium tracking-[-0.01em]"
              style={{ color: ink }}
            >
              {file.label}
            </span>
          </div>

          <span
            className="absolute right-2.5 top-2.5 rounded-full px-1.5 py-0.5 font-geist text-[8.5px] font-semibold tracking-[0.03em]"
            style={{ background: surfaceRaised, color: muted }}
          >
            {file.ext}
          </span>
        </div>
      </motion.div>
    </div>
  );
};

/** The single Studly session the mess collapses into. */
const StudlyCard = ({ progress }) => {
  const opacity = useTransform(progress, CARD_IN, [0, 1]);
  const scale = useTransform(progress, CARD_IN, [0.92, 1]);
  const y = useTransform(progress, CARD_IN, [18, 0]);

  return (
    <div
      className="absolute left-1/2 top-1/2 z-40"
      style={{ transform: "translate(-50%, -50%)" }}
    >
      <motion.div
        style={{
          opacity,
          scale,
          y,
          background: paper,
          border: `1px solid ${strokeSoft}`,
        }}
        className="w-[240px] rounded-2xl p-4"
      >
        <div className="flex items-center gap-1.5">
          <img src={logo} alt="" draggable="false" className="h-4 w-auto" />
          <span
            className="font-geist text-[13px] font-semibold tracking-[-0.02em]"
            style={{ color: ink }}
          >
            Studly
          </span>
        </div>

        <p
          className="mt-3 font-geist text-[15px] font-semibold leading-[1.25] tracking-[-0.02em]"
          style={{ color: ink }}
        >
          Your learning, in one place
        </p>

        <div className="mt-3.5 flex flex-col gap-2.5">
          {["Foundations", "Core concepts", "Past questions"].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ background: i === 0 ? ink : strokeSoft }}
              />
              <span
                className="h-1.5 flex-1 rounded-full"
                style={{ background: paperLine }}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

/**
 * How far the connector runs past the bottom of the pinned stage.
 *
 * The stage is `h-[calc(100dvh-4rem)]` and sits flush with the fold, so a
 * connector that simply ended at the stage bottom would stop dead at the bottom
 * of the screen and the LearningPath map would have to start a brand new line of
 * its own — reading as a cut, not a continuation. Instead this box deliberately
 * overflows the stage by 176px, which is exactly the distance from the stage
 * bottom to where the LearningPath map's content begins (its `pt-16` lead-in).
 * Nothing clips it vertically, so the single path carries on across the section
 * seam and lands on the map.
 */
const CONNECTOR_OVERHANG = 176;

/**
 * Connector that exits the card and leads into the next section.
 *
 * One continuous path, drawn in real pixel coordinates measured from the element
 * itself. An earlier version used a 100x100 viewBox stretched with
 * `preserveAspectRatio="none"` and revealed via `pathLength`; that combination
 * is what broke the line. `vector-effect: non-scaling-stroke` tells the browser
 * to dash in *screen* space, while `pathLength` asks it to normalise dash units
 * against the path's own length — the two disagree, and the 1px dash repeated
 * along the stretched path instead of tracing it once, chopping the connector
 * into disconnected fragments.
 *
 * So: build the path at 1:1 in px, drop `pathLength`, and drive the reveal with
 * `strokeDasharray` / `strokeDashoffset` against the measured length. Units are
 * then real pixels in both interpretations and the stroke is genuinely one piece.
 */
const Connector = ({ progress }) => {
  const wrapRef = React.useRef(null);
  const pathRef = React.useRef(null);
  const [box, setBox] = React.useState({ w: 0, h: 0 });

  const opacity = useTransform(progress, [0.78, 0.82], [0, 1]);
  // The line draws itself out across LINE_OUT, not in lockstep with scroll.
  const draw = useTransform(progress, LINE_OUT, [0, 1]);

  // Track the rendered size so the path geometry is always in true pixels.
  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setBox((prev) =>
        Math.abs(prev.w - r.width) < 0.5 && Math.abs(prev.h - r.height) < 0.5
          ? prev
          : { w: r.width, h: r.height }
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const d =
    box.w > 0 && box.h > 0
      ? `M ${box.w / 2} 0 C ${box.w * 0.66} ${box.h * 0.26}, ${box.w * 0.34} ${box.h * 0.6}, ${box.w / 2} ${box.h}`
      : "";

  // Reveal by walking `strokeDashoffset` from the full length down to 0. The
  // length is measured here rather than memoised because it only becomes
  // meaningful once `d` has actually been written to the node.
  React.useEffect(() => {
    const p = pathRef.current;
    if (!p || !d) return;
    const length = p.getTotalLength();
    if (!length) return;
    p.style.strokeDasharray = `${length} ${length}`;
    // Seed from the current value so a mid-scroll resize doesn't snap the line.
    p.style.strokeDashoffset = `${length * (1 - draw.get())}`;
    return draw.on("change", (v) => {
      p.style.strokeDashoffset = `${length * (1 - v)}`;
    });
  }, [d, draw]);

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none absolute left-0 right-0 z-30"
      style={{
        top: "calc(50% + 86px)",
        // Reaches the stage bottom and then the overhang beyond it. Expressed
        // against the stage height (50%) so it stays correct at any viewport.
        height: `calc(50% + ${CONNECTOR_OVERHANG - 86}px)`,
        opacity,
      }}
      aria-hidden="true"
    >
      <svg className="h-full w-full" focusable="false">
        <path
          ref={pathRef}
          d={d}
          fill="none"
          stroke={ink}
          strokeWidth={1}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

/**
 * ProblemScene — the scattered file illustrations that gather into one Studly
 * session card, then a line draws out toward the learning path.
 *
 * Fully decorative: exposed to assistive tech as a single image, and the whole
 * timeline is driven by the `progress` MotionValue so nothing re-renders.
 */
const ProblemScene = ({ progress, className = "" }) => (
  <div
    role="img"
    aria-label="Scattered lecture slides, PDFs, chat notes, screenshots and documents gathering into a single Studly session"
    className={`relative h-full w-full ${className}`}
  >
    {FILES.map((file, i) => (
      <ScatterFile key={file.id} file={file} index={i} progress={progress} />
    ))}
    <StudlyCard progress={progress} />
    <Connector progress={progress} />
  </div>
);

export default ProblemScene;
