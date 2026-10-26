import React, { useRef } from "react";
import {
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import ContainerGrid from "./ContainerGrid";
import ScrollRevealText from "../ui/scroll-reveal-text";
import { HugeiconsIcon } from "@hugeicons/react";
import { AiChat01Icon, Quiz01Icon, Chart01Icon, FileIcon } from "@hugeicons/core-free-icons";

/**
 * Features — what's inside Studly.
 *
 * Doubles down on the value prop after HowStudlySolvesIt shows the flow.
 * Four numbered feature cards, each with a visual mockup and colored tint.
 * Scroll-triggered reveal animation (same pattern as LearningPath/Problem).
 */
const FEATURES = [
  {
    id: "ai-sessions",
    title: "AI Study Sessions",
    description: "Ask anything. Get explanations that match your level and context.",
    icon: AiChat01Icon,
    tint: "#eef4fb",
    mockup: "chat",
  },
  {
    id: "flashcards",
    title: "Smart Flashcards",
    description: "Auto-generated from your notes. Spaced repetition built in.",
    icon: FileIcon,
    tint: "#fbf4e3",
    mockup: "flashcard",
  },
  {
    id: "quizzes",
    title: "Quizzes & Tests",
    description: "Proof you actually know it before you move on.",
    icon: Quiz01Icon,
    tint: "#eef6f1",
    mockup: "quiz",
  },
  {
    id: "progress",
    title: "Progress Tracking",
    description: "See what you've learned. Know what's next.",
    icon: Chart01Icon,
    tint: "#f7f3e7",
    mockup: "progress",
  },
];

const ChatMockup = () => (
  <div className="flex flex-col gap-3 p-6">
    {/* User message */}
    <div className="flex justify-end">
      <div className="max-w-[80%] rounded-2xl rounded-br-md bg-[#141414] px-4 py-2.5 text-sm text-white">
        Explain quantum computing like I'm a beginner
      </div>
    </div>
    {/* AI response */}
    <div className="flex justify-start">
      <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-[#ece7d8] bg-white px-4 py-3 text-sm text-[#141414]">
        <p className="font-medium">Sure! Think of it like this:</p>
        <p className="mt-1 text-[#726f6c]">
          Regular computers use bits (0 or 1). Quantum computers use{" "}
          <span className="font-medium text-[#141414]">qubits</span> that can be
          both 0 and 1 at the same time — that's called{" "}
          <span className="font-medium text-[#141414]">superposition</span>.
        </p>
        <div className="mt-2 flex gap-2">
          <span className="rounded-full bg-[#eef4fb] px-2 py-0.5 text-xs text-[#141414]">
            Key concept
          </span>
          <span className="rounded-full bg-[#eef6f1] px-2 py-0.5 text-xs text-[#141414]">
            Use analogy
          </span>
        </div>
      </div>
    </div>
  </div>
);

const FlashcardMockup = () => (
  <div className="flex flex-col items-center justify-center p-8">
    {/* Card */}
    <div className="relative h-48 w-72 perspective-1000">
      <div className="absolute inset-0 flex items-center justify-center rounded-2xl border border-[#ece7d8] bg-white p-6 shadow-sm transition-transform duration-500 hover:rotate-y-12">
        <div className="text-center">
          <p className="text-xs uppercase tracking-wider text-[#726f6c]">Front</p>
          <p className="mt-2 text-lg font-medium text-[#141414]">What is superposition?</p>
        </div>
      </div>
      {/* Flip indicator */}
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-1 rounded-full bg-[#fbf4e3] px-3 py-1">
          <HugeiconsIcon icon={AiChat01Icon} size={14} color="#141414" strokeWidth={1.5} />
          <span className="text-xs font-medium text-[#141414]">Flip to reveal</span>
        </div>
      </div>
    </div>
  </div>
);

const QuizMockup = () => (
  <div className="flex flex-col gap-4 p-6">
    <p className="text-sm font-medium text-[#141414]">What is quantum entanglement?</p>
    {/* Options */}
    <div className="flex flex-col gap-2">
      <button className="flex items-center gap-3 rounded-xl border-2 border-[#141414] bg-[#eef6f1] px-4 py-3 text-left text-sm">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#141414] text-xs text-white">
          ✓
        </div>
        <span>Two qubits linked so measuring one instantly affects the other</span>
      </button>
      <button className="flex items-center gap-3 rounded-xl border border-[#ece7d8] px-4 py-3 text-left text-sm text-[#726f6c]">
        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#ece7d8]"></div>
        <span>Using multiple antennas for better signal</span>
      </button>
      <button className="flex items-center gap-3 rounded-xl border border-[#ece7d8] px-4 py-3 text-left text-sm text-[#726f6c]">
        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#ece7d8]"></div>
        <span>A type of encryption for quantum networks</span>
      </button>
    </div>
    {/* Progress */}
    <div className="mt-2 flex items-center gap-2">
      <div className="h-1.5 flex-1 rounded-full bg-[#ece7d8]">
        <div className="h-full w-2/3 rounded-full bg-[#141414]"></div>
      </div>
      <span className="text-xs text-[#726f6c]">2/3 correct</span>
    </div>
  </div>
);

const ProgressMockup = () => (
  <div className="flex flex-col gap-4 p-6">
    {/* Stats row */}
    <div className="grid grid-cols-3 gap-3">
      <div className="rounded-xl bg-white p-3 text-center">
        <p className="text-xl font-semibold text-[#141414]">12</p>
        <p className="text-xs text-[#726f6c]">Sections</p>
      </div>
      <div className="rounded-xl bg-white p-3 text-center">
        <p className="text-xl font-semibold text-[#141414]">87%</p>
        <p className="text-xs text-[#726f6c]">Mastered</p>
      </div>
      <div className="rounded-xl bg-white p-3 text-center">
        <p className="text-xl font-semibold text-[#141414]">5d</p>
        <p className="text-xs text-[#726f6c]">Streak</p>
      </div>
    </div>
    {/* Progress bar */}
    <div className="rounded-xl bg-white p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-[#141414]">Quantum Physics</span>
        <span className="text-sm text-[#726f6c]">73%</span>
      </div>
      <div className="h-2 rounded-full bg-[#ece7d8]">
        <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-[#141414] to-[#726f6c]"></div>
      </div>
    </div>
    {/* Next up */}
    <div className="rounded-xl border border-[#ece7d8] p-3">
      <p className="text-xs uppercase tracking-wider text-[#726f6c]">Next up</p>
      <p className="mt-1 text-sm font-medium text-[#141414]">Wave-Particle Duality</p>
    </div>
  </div>
);

const FeatureMockup = ({ mockup }) => {
  switch (mockup) {
    case "chat":
      return <ChatMockup />;
    case "flashcard":
      return <FlashcardMockup />;
    case "quiz":
      return <QuizMockup />;
    case "progress":
      return <ProgressMockup />;
    default:
      return null;
  }
};

const Features = () => {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });

  const settled = useMotionValue(1);
  const progress = reduced ? settled : smooth;

  return (
    <section
      id="features"
      ref={ref}
      className="relative py-24 md:py-28"
    >
      <ContainerGrid />

      <div className="mx-auto w-full max-w-[1080px] px-6 md:px-10">
        {/* Header */}
        <div className="mx-auto max-w-[680px] text-center">
          <ScrollRevealText progress={progress} range={[0.05, 0.3]}>
            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-[#726f6c]">
              What's inside
            </p>
            <h2 className="text-4xl font-normal tracking-[-0.02em] text-[#141414] md:text-5xl">
              Everything you need to study smart.
            </h2>
            <p className="mt-4 text-base text-[#726f6c]">
              Not just another flashcard app. Studly is a complete study system
              that adapts to how you learn.
            </p>
          </ScrollRevealText>
        </div>

        {/* Feature cards */}
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="group relative overflow-hidden rounded-2xl border border-[#ece7d8] bg-white transition-shadow hover:shadow-lg"
              >
                {/* Number badge */}
                <div className="absolute left-6 top-6 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#141414] text-sm font-medium text-white">
                  {index + 1}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f7f3e7]">
                      <HugeiconsIcon
                        icon={Icon}
                        size={20}
                        color="#141414"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#141414]">
                        {feature.title}
                      </h3>
                      <p className="mt-1 text-sm text-[#726f6c]">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mockup */}
                <div
                  className="relative h-56 overflow-hidden"
                  style={{ backgroundColor: feature.tint }}
                >
                  <FeatureMockup mockup={feature.mockup} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
