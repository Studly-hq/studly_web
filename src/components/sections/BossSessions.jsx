import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import ContainerGrid from "./ContainerGrid";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FileUploadIcon,
  GitMergeIcon,
  BookOpenIcon,
} from "@hugeicons/core-free-icons";

const EASE = [0.16, 1, 0.3, 1];

/* ---- visuals ---- */

const Card = ({
  className = "",
  style,
  children,
  ...props
}) => (
  <div
    className={`relative flex w-full min-w-0 flex-col overflow-hidden rounded-xl border border-[#ece7d8] ${className}`}
    style={style}
    {...props}
  >
    {children}
  </div>
);

const SessionChip = ({ label, count, active, compact = false }) => (
  <div
    className={`flex items-center gap-2 rounded-xl ${
      compact ? "px-2 py-1.5 text-[12px]" : "px-3 py-2 text-sm"
    } ${
      active
        ? "bg-[#141414] text-white"
        : "bg-white/70 text-[#141414]/70"
    }`}
  >
    <HugeiconsIcon
      icon={BookOpenIcon}
      strokeWidth={1.6}
      className={`${compact ? "size-3.5" : "size-4"} shrink-0 ${
        active ? "text-white/80" : ""
      }`}
    />
    <span className="truncate font-medium">{label}</span>
    {count !== undefined && (
      <span
        className={`ml-auto rounded-full bg-white/10 px-1.5 py-0.5 text-[11px] tabular-nums ${
          active ? "text-white/80" : "text-[#726f6c]"
        }`}
      >
        {count}
      </span>
    )}
  </div>
);

const Arrow = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M5 12h14" />
    <path d="M15 7l5 5-5 5" />
  </svg>
);

const WeekOneCard = () => (
  <Card style={{ backgroundColor: "#eef4fb" }} className="p-5 md:h-full md:justify-center">
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <SessionChip label="MTH311 — Week 1" />
        <span className="text-[10px] font-mono text-[#726f6c]">session 1 of 1</span>
      </div>

      {/* the note going in */}
      <div className="flex items-center gap-2 rounded-xl border border-[#141414]/10 bg-white px-3 py-2.5">
        <HugeiconsIcon
          icon={FileUploadIcon}
          strokeWidth={1.6}
          className="size-4 shrink-0 text-[#726f6c]"
        />
        <span className="truncate text-xs font-medium text-[#141414]">
          MTH311 - Week 1 notes.pdf
        </span>
      </div>

      {/* the session it becomes */}
      <div className="flex items-center gap-2 rounded-xl border border-[#141414]/10 bg-white px-3 py-2.5">
        <span className="shrink-0 text-xs font-medium text-[#726f6c]">1.</span>
        <span className="truncate text-xs font-medium text-[#141414]">
          Week 1 — Introduction
        </span>
      </div>

      <p className="text-xs leading-[1.5] text-[#726f6c]">
        One note. One session. A clean place to start.
      </p>
    </div>
  </Card>
);

const WeekTwoMerge = () => (
  <div className="flex w-full flex-col gap-4 md:h-full">
    <div className="flex flex-1 flex-col items-stretch gap-3 min-[860px]:flex-row min-[860px]:items-stretch">
      <Card style={{ backgroundColor: "#eef4fb", flex: 1 }} className="h-full justify-center p-4">
        <div className="flex flex-col gap-2">
          <SessionChip label="MTH311 — Week 1" compact />
          <div className="flex items-center gap-1.5 rounded-lg border border-[#141414]/10 bg-white px-2 py-1.5">
            <HugeiconsIcon
              icon={FileUploadIcon}
              strokeWidth={1.6}
              className="size-3.5 shrink-0 text-[#726f6c]"
            />
            <span className="truncate text-[10px] font-medium text-[#141414]">
              Week 1 notes.pdf
            </span>
          </div>
        </div>
      </Card>

      <Arrow className="mx-auto size-6 flex-none shrink-0 self-center rotate-90 text-[#726f6c] min-[860px]:rotate-0" />

      <Card style={{ backgroundColor: "#fbf4e3", flex: 1 }} className="h-full justify-center p-4">
        <div className="flex flex-col gap-2">
          <SessionChip label="MTH311 — Week 2" compact />
          <div className="flex items-center gap-1.5 rounded-lg border border-[#141414]/10 bg-white px-2 py-1.5">
            <HugeiconsIcon
              icon={FileUploadIcon}
              strokeWidth={1.6}
              className="size-3.5 shrink-0 text-[#726f6c]"
            />
            <span className="truncate text-[10px] font-medium text-[#141414]">
              Week 2 notes.pdf
            </span>
          </div>
        </div>
      </Card>
    </div>

    <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-[#141414]">
      <HugeiconsIcon
        icon={GitMergeIcon}
        strokeWidth={1.6}
        className="size-4 text-[#ff9e64]"
      />
      <span>Merge into one session</span>
    </div>
  </div>
);

const ExamSessionCard = () => {
  const weeks = [
    "Week 1 — Introduction",
    "Week 2 — Functions",
    "Week 3 — Limits",
    "Week 4 — Derivatives",
    "Week 5 — Rules of differentiation",
    "Week 6 — Applications",
    "Week 7 — Integration",
  ];

  return (
    <Card style={{ backgroundColor: "#eef6f1" }} className="flex flex-col gap-3 p-5 md:h-full md:justify-center">
      <div className="flex items-center justify-between">
        <SessionChip label="MTH311" count={weeks.length} active />
        <span className="text-[10px] font-mono text-[#726f6c]">
          7 weeks, 1 session
        </span>
      </div>
      <div className="flex flex-col gap-1 overflow-hidden rounded-xl border border-[#141414]/10 bg-white p-2.5">
        {weeks.map((week, i) => (
          <motion.div
            key={week}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05, ease: EASE }}
            className="flex items-center gap-2 rounded-lg bg-[#fffcf0] px-2.5 py-1.5 text-xs font-medium text-[#141414]"
          >
            <span className="shrink-0 text-[#726f6c]">{i + 1}.</span>
            <span>{week}</span>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

/* ---- copy ---- */

const HEADLINE = "One session per course, not one per week.";

const BLOCKS = [
  {
    eyebrow: "Week 1",
    title: "You upload your first note.",
    body: "A student uploads their Week 1 MTH311 note. Studly turns it into one session and puts it in place for that course.",
    visual: <WeekOneCard />,
  },
  {
    eyebrow: "Week 2",
    title: "The next note joins the first.",
    body:
      "Next week they upload Week 2 of the same course. Instead of starting a second session, Studly merges it into the one that already exists, in the right order.",
    visual: <WeekTwoMerge />,
  },
  {
    eyebrow: "Exam time",
    title: "One session holds the whole course.",
    body:
      "Week after week, every MTH311 note lands in the same session. By exam time it is built out of all the weeks, in order, and the student opens that one session to study the whole course.",
    visual: <ExamSessionCard />,
  },
];

/* ---- block ---- */

const Block = ({ block, i }) => {
  const reduced = useReducedMotion();
  const reverse = i % 2 === 1;

  const reveal = (delay) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.3 },
          transition: { duration: 0.55, ease: EASE, delay },
        };

  return (
    <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[1.08fr_0.92fr] md:gap-16">
      <motion.div
        {...reveal(0)}
        className={`flex flex-col gap-4 md:row-start-1 ${
          reverse ? "md:col-start-2" : "md:col-start-1"
        }`}
      >
        <span className="font-scribble text-[clamp(20px,2.6vw,24px)] leading-none text-[#141414]/55">
          {block.eyebrow}
        </span>
        <h3 className="max-w-[430px] text-[clamp(20px,2.6vw,26px)] font-normal leading-[1.15] tracking-[-0.02em] text-[#141414] sm:text-[clamp(22px,2.8vw,28px)] md:max-w-none md:text-[clamp(26px,3.2vw,32px)] lg:text-[clamp(28px,3.6vw,36px)] min-[940px]:whitespace-nowrap">
          {block.title}
        </h3>
        <p className="max-w-[430px] font-geist text-[clamp(14px,1.6vw,16px)] leading-[1.6] tracking-[-0.01em] text-[#726f6c] md:text-[clamp(15px,1.8vw,18px)]">
          {block.body}
        </p>
      </motion.div>

      <motion.div
        {...reveal(0.08)}
        className={`mx-auto flex w-full max-w-[430px] flex-col justify-center md:mx-0 md:row-start-1 md:h-[300px] ${
          reverse ? "md:col-start-1" : "md:col-start-2"
        } ${reverse ? "md:justify-self-start" : "md:justify-self-end"}`}
      >
        {block.visual}
      </motion.div>
    </div>
  );
};

/* ---- section ---- */

const BossSessions = () => {
  return (
    <section
      id="boss-sessions"
      className="relative border-t border-[#ece7d8] py-20 md:py-32"
    >
      <ContainerGrid dots />

      <div className="mx-auto w-full max-w-[1080px] px-6 md:px-10">
        {/* header */}
        <div className="mx-auto max-w-[720px] text-center">
          <h2 className="text-[32px] font-normal leading-[1.15] tracking-[-0.02em] text-[#141414] md:text-4xl">
            {HEADLINE}
          </h2>
        </div>

        {/* zigzag blocks */}
        <div className="mt-20 flex flex-col gap-16 md:mt-24 md:gap-28">
          {BLOCKS.map((block, i) => (
            <Block key={i} block={block} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BossSessions;
