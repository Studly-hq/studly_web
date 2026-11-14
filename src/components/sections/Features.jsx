import React from "react";
import ContainerGrid from "./ContainerGrid";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserIcon, Quiz01Icon, FileIcon, AiChat01Icon } from "@hugeicons/core-free-icons";

const FEATURES = [
  {
    id: "studly-sessions",
    title: "Studly sessions",
    description: "Ask anything. Get explanations that match your level and context.",
    icon: UserIcon,
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
];

const ChatMockup = () => (
  <div className="flex flex-col gap-3 p-6">
    <div className="flex justify-end">
      <div className="max-w-[80%] rounded-2xl rounded-br-md bg-[#141414] px-4 py-2.5 text-sm text-white">
        Explain quantum computing like I'm a beginner
      </div>
    </div>
    <div className="flex justify-start">
      <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-[#ece7d8] bg-white px-4 py-3 text-sm text-[#141414]">
        <p className="font-medium">Sure! Think of it like this:</p>
        <p className="mt-1 text-[#726f6c]">
          Regular computers use bits (0 or 1). Quantum computers use{" "}
          <span className="font-medium text-[#141414]">qubits</span> that can be
          both 0 and 1 at the same time, that's called{" "}
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
    <div className="relative h-48 w-72">
      <div className="absolute inset-0 flex items-center justify-center rounded-2xl border border-[#ece7d8] bg-white p-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-wider text-[#726f6c]">Front</p>
          <p className="mt-2 text-lg font-medium text-[#141414]">What is superposition?</p>
        </div>
      </div>
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-1 rounded-full bg-white px-3 py-1 shadow-sm">
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
    <div className="flex flex-col gap-2">
      <button className="flex items-center gap-3 rounded-xl border-2 border-[#141414] bg-white px-4 py-3 text-left text-sm">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#141414]">
          <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.5 7.5l3 3 5.5-6" />
          </svg>
        </div>
        <span>Two qubits linked so measuring one instantly affects the other</span>
      </button>
      <button className="flex items-center gap-3 rounded-xl border border-[#ece7d8] bg-white px-4 py-3 text-left text-sm text-[#726f6c]">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-[#ece7d8]"></div>
        <span>Using multiple antennas for better signal</span>
      </button>
      <button className="flex items-center gap-3 rounded-xl border border-[#ece7d8] bg-white px-4 py-3 text-left text-sm text-[#726f6c]">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-[#ece7d8]"></div>
        <span>A type of encryption for quantum networks</span>
      </button>
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
    default:
      return null;
  }
};

const FeatureCard = ({ feature }) => {
  const Icon = feature.icon;

  return (
    <div
      className="relative flex h-full flex-col overflow-hidden"
      style={{ backgroundColor: feature.tint }}
    >
      {/* Content top */}
      <div className="px-6 pt-7 pb-4">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/60">
            <HugeiconsIcon
              icon={Icon}
              size={20}
              color="#141414"
              strokeWidth={1.5}
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold leading-[28px] tracking-[-0.015em] text-[#141414]">
              {feature.title}
            </h3>
            <p className="mt-1 text-base leading-[1.5] text-[#141414]/60">
              {feature.description}
            </p>
          </div>
        </div>
      </div>

      {/* Illustration bottom */}
      <div className="flex flex-1 items-center justify-center overflow-hidden">
        <FeatureMockup mockup={feature.mockup} />
      </div>
    </div>
  );
};

const Features = () => {
  return (
    <section id="features" className="relative py-24 md:py-28">
      <ContainerGrid />

      <div className="mx-auto w-full max-w-[1080px] px-6 md:px-10">
        {/* Header */}
        <div className="mx-auto max-w-[720px] text-center">
          <h2 className="text-[32px] font-normal leading-[1.15] tracking-[-0.02em] text-[#141414] md:text-4xl">
            Everything you need to study smart.
          </h2>
        </div>

        {/* Feature cards — grid with 1px gaps creating border lines */}
        <div
          className="mt-16 grid grid-cols-1 gap-[1px] md:grid-cols-3"
          style={{ backgroundColor: "oklab(0.191251 -7.45058e-9 0 / 0.08)" }}
        >
          {FEATURES.map((feature) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
