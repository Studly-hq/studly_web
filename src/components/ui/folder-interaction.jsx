import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  FileIcon,
  FileUploadIcon,
  ImageIcon,
  Mic01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "cn";

/**
 * Accepted file types, mirroring Lucid's composer
 * (src/components/landing/LandingPage.tsx).
 */
const DOCUMENT_TYPES = [".pdf", ".doc", ".docx", ".txt", ".pptx"];
const IMAGE_TYPES = [".jpg", ".jpeg", ".png", ".webp"];
const AUDIO_TYPES = [".mp3", ".wav", ".m4a", ".ogg", ".webm"];
const ACCEPT = [...DOCUMENT_TYPES, ...IMAGE_TYPES, ...AUDIO_TYPES].join(",");

/**
 * The three papers. Each mirrors the icon Lucid picks for that file kind, so
 * the animation previews exactly what the real uploader will accept.
 */
const PAPERS = [
  {
    id: "voice",
    icon: Mic01Icon,
    label: "voice note",
    ext: ".M4A",
    fileName: "voice-note.m4a",
    closed: { rotate: -3, x: -38, y: 2 },
    open: { rotate: -8, x: -70, y: -55 },
    transition: { duration: 0.6, bounce: 0.15, stiffness: 175, damping: 22 },
    z: "z-10 shadow-md",
  },
  {
    id: "pdf",
    icon: FileIcon,
    label: "document",
    ext: ".PDF",
    fileName: "lecture-notes.pdf",
    closed: { rotate: 0, x: 0, y: 0 },
    open: { rotate: 1, x: 2, y: -75 },
    transition: { duration: 0.55, bounce: 0.12, stiffness: 205, damping: 24 },
    z: "z-20 shadow-lg",
  },
  {
    id: "img",
    icon: ImageIcon,
    label: "image",
    ext: ".IMG",
    fileName: "diagram.png",
    closed: { rotate: 3.5, x: 42, y: 1 },
    open: { rotate: 9, x: 75, y: -60 },
    transition: { duration: 0.58, bounce: 0.17, stiffness: 185, damping: 21 },
    z: "z-10 shadow-md",
  },
];

// Where each open paper travels to: the centre of the drop zone.
const DROP_TARGET = { x: 412, y: 41 };

const PHASE = {
  CLOSED: "closed",
  OPEN: "open",
  DRAG: "drag",
  DROPPED: "dropped",
};

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
 * Paper face. Replaces the Figma placeholder lines with the icon + extension
 * that Lucid would show for this file type.
 */
const Page = ({ icon, ext }) => (
  <div className="flex h-full w-full flex-col justify-between rounded-xl bg-gradient-to-b from-[#E8E7F0] to-[#DCDAE8] p-3 shadow-lg sm:p-4">
    <div className="flex flex-col gap-1.5 sm:gap-2">
      <div className="flex h-1 w-full rounded-full bg-[#CFCDE0] sm:h-1.5" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-1.5 sm:gap-2">
          <div className="h-1 flex-1 rounded-full bg-[#CFCDE0] sm:h-1.5" />
          <div className="h-1 flex-1 rounded-full bg-[#CFCDE0] sm:h-1.5" />
        </div>
      ))}
    </div>

    <div className="flex flex-col items-center gap-1">
      <HugeiconsIcon
        icon={icon}
        strokeWidth={1.5}
        className="size-5 shrink-0 text-[#4A4458] sm:size-6"
      />
      <span className="font-geist text-[11px] font-semibold tracking-[-0.01em] text-[#4A4458] sm:text-xs">
        {ext}
      </span>
    </div>
  </div>
);

/**
 * Upload drop zone. Visually mirrors Lucid's composer box: same dashed border
 * radius, same border/background tokens, same empty-state copy and icon.
 */
const UploadZone = ({ isDragActive, hasFiles, fileInputRef }) => {
  const [isInputFocused, setIsInputFocused] = useState(false);

  return (
    <motion.div
      layout
      className={cn(
        "relative w-[264px] overflow-hidden rounded-[1.25rem] border border-dashed transition-colors duration-200",
        isDragActive || isInputFocused
          ? "border-foreground/40 bg-foreground/5"
          : "border-foreground/20 bg-background hover:border-foreground/40 hover:bg-foreground/5"
      )}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={(e) => e.preventDefault()}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={ACCEPT}
        multiple
        aria-hidden="true"
        tabIndex={-1}
      />

      <div
        role="button"
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onFocus={() => setIsInputFocused(true)}
        onBlur={() => setIsInputFocused(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        aria-label="Upload document or image"
        className="group/zone flex w-full cursor-pointer flex-col"
      >
        <div
          className={cn(
            "flex w-full flex-col items-center justify-center transition-colors",
            hasFiles ? "py-2.5" : "py-6"
          )}
        >
          {hasFiles ? (
            <div className="flex w-full flex-col items-center gap-2 px-4">
              <div className="flex w-full flex-wrap justify-center gap-1.5">
                {PAPERS.map((paper) => (
                  <motion.span
                    key={paper.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-1 rounded-full border border-border/50 bg-secondary py-1 pl-2 pr-1 text-xs text-foreground"
                  >
                    <HugeiconsIcon
                      icon={paper.icon}
                      strokeWidth={1.8}
                      className="size-3.5 shrink-0 text-muted-foreground"
                    />
                    <span className="max-w-[110px] truncate font-medium">
                      {paper.fileName}
                    </span>
                    <span
                    aria-hidden="true"
                    className="flex size-4 shrink-0 items-center justify-center rounded-full text-muted-foreground"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-3" />
                  </span>
                  </motion.span>
                ))}
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                3 files ready
              </span>
            </div>
          ) : (
            <>
              <HugeiconsIcon
                icon={FileUploadIcon}
                strokeWidth={1.5}
                className="mb-1 size-6 text-muted-foreground/60 sm:size-7"
              />
              <span className="text-xs font-medium text-muted-foreground sm:text-sm">
                Click or drag files to upload
              </span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Hero folder animation: the folder opens, fans its three papers out, then
 * they fly into the upload zone and settle as chips.
 *
 * This is a marketing loop — the papers are decorative divs, not real files,
 * so nothing is uploaded by the animation. The drop zone beside it is the real
 * Lucid composer and does accept genuine drops and clicks.
 *
 * Respects prefers-reduced-motion by holding the closed state.
 */
function FolderInteraction({ className }) {
  const [phase, setPhase] = useState(PHASE.CLOSED);
  const reducedMotion = usePrefersReducedMotion();
  const timers = useRef([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (reducedMotion) {
      setPhase(PHASE.CLOSED);
      return undefined;
    }

    const at = (delay, next) => {
      timers.current.push(setTimeout(() => setPhase(next), delay));
    };

    // Hold closed, open, fan out, fly, settle, reset.
    at(700, PHASE.OPEN);
    at(2000, PHASE.DRAG);
    at(3050, PHASE.DROPPED);
    at(4600, PHASE.CLOSED);

    const queued = timers.current;
    return () => queued.forEach(clearTimeout);
  }, [reducedMotion]);

  const isOpen = phase !== PHASE.CLOSED;
  const isDragging = phase === PHASE.DRAG;
  const isDropped = phase === PHASE.DROPPED;

  const paperTarget = (paper) => {
    if (phase === PHASE.CLOSED) return paper.closed;
    if (phase === PHASE.OPEN) return paper.open;
    return {
      x: paper.open.x + DROP_TARGET.x,
      y: paper.open.y + DROP_TARGET.y,
      rotate: 0,
      scale: 0.55,
      opacity: 0,
    };
  };

  return (
    <div className={cn("flex w-full items-center justify-center", className)}>
      <div className="relative flex w-[720px] items-center gap-12">
        {/* Folder */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-52 w-80 shrink-0"
        >
          <div
            className="folder relative mx-auto flex h-full w-[87.5%] items-center justify-center"
            style={{
              background: "#18151B",
              boxShadow: "0px 0px 15.699999809265137px 16px rgba(79, 73, 85, 0.30) inset",
              borderRadius: 10,
            }}
          >
            {PAPERS.map((paper) => (
              <motion.div
                key={paper.id}
                initial={paper.closed}
                animate={paperTarget(paper)}
                transition={
                  phase === PHASE.DRAG
                    ? { duration: 0.85, ease: [0.22, 1, 0.36, 1] }
                    : paper.transition
                }
                className={cn(
                  "absolute left-1/2 top-2 h-fit w-32",
                  "-translate-x-1/2",
                  paper.z
                )}
              >
                <Page icon={paper.icon} ext={paper.ext} />
              </motion.div>
            ))}
          </div>

          {/* Front flap */}
          <motion.div
            animate={{ rotateX: isOpen ? -40 : 0 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
            className="absolute -bottom-px -left-px -right-px z-20 flex h-44 origin-bottom items-center justify-center overflow-visible rounded-3xl"
            style={{ perspective: 1200 }}
          >
            <svg
              className="h-full w-full overflow-visible"
              viewBox="0 0 235 121"
              fill="none"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M104.615 0.350494L33.1297 0.838776C32.7542 0.841362 32.3825 0.881463 32.032 0.918854C31.6754 0.956907 31.3392 0.992086 31.0057 0.992096H31.0047C30.6871 0.99235 30.3673 0.962051 30.0272 0.929596C29.6927 0.897686 29.3384 0.863802 28.9803 0.866119L13.2693 0.967682H13.2527L13.2352 0.969635C13.1239 0.981406 13.0121 0.986674 12.9002 0.986237H9.91388C8.33299 0.958599 6.76052 1.22345 5.27423 1.76651H5.27325C4.33579 2.11246 3.48761 2.66213 2.7879 3.37393L2.49689 3.68839L2.492 3.69424C1.62667 4.73882 1.00023 5.96217 0.656067 7.27725C0.653324 7.28773 0.654065 7.29886 0.652161 7.30948C0.3098 8.62705 0.257231 10.0048 0.499817 11.3446L12.2147 114.399L12.2156 114.411L12.2176 114.423C12.6046 116.568 13.7287 118.508 15.3934 119.902C17.058 121.297 19.1572 122.056 21.3231 122.049V122.05H215.379C217.76 122.02 220.064 121.192 221.926 119.698V119.697C223.657 118.384 224.857 116.485 225.305 114.35L225.307 114.339L235.914 53.3798L235.968 53.1093L235.97 53.0985L235.971 53.0888C236.134 51.8978 236.044 50.685 235.705 49.5321C235.307 48.1669 234.63 46.9005 233.717 45.8144L233.383 45.4296C232.58 44.5553 231.614 43.8449 230.539 43.3398C229.311 42.7628 227.971 42.4685 226.616 42.4774H146.746C144.063 42.4705 141.423 41.8004 139.056 40.5263C136.691 39.2522 134.671 37.4127 133.175 35.1689L113.548 5.05948L113.544 5.05362L113.539 5.04776C112.545 3.65165 111.238 2.51062 109.722 1.72061C108.266 0.886502 106.627 0.422235 104.952 0.365143V0.364166L104.633 0.350494H104.615Z"
                fill="url(#folder-face)"
                fillOpacity="0.94"
                stroke="url(#folder-edge)"
                strokeWidth="0.7"
              />
              <defs>
                <linearGradient
                  id="folder-face"
                  x1="114.7"
                  y1="0.700104"
                  x2="114.7"
                  y2="121.7"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#2D2535" />
                  <stop offset="1" stopColor="#2A2A2A" />
                </linearGradient>
                <linearGradient
                  id="folder-edge"
                  x1="114.7"
                  y1="0.700104"
                  x2="114.7"
                  y2="121.7"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#424242" stopOpacity="0.04" />
                  <stop offset="1" stopColor="#212121" stopOpacity="0.3" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </motion.div>

        {/* Upload zone */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="flex shrink-0 items-center"
        >
          <UploadZone
            isDragActive={isDragging}
            hasFiles={isDropped}
            fileInputRef={fileInputRef}
          />
        </motion.div>
      </div>
    </div>
  );
}

export default FolderInteraction;