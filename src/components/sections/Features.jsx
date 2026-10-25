import React from "react";
import ContainerGrid from "./ContainerGrid";
import { HugeiconsIcon } from "@hugeicons/react";
import { FileUploadIcon, BrainIcon, RouteIcon, CheckmarkCircle02Icon, ChartLineData01Icon } from "@hugeicons/core-free-icons";

const FEATURES = [
  {
    icon: FileUploadIcon,
    title: "Upload anything",
    description: "Drop PDFs, lecture notes, slides, or any study material and get started instantly.",
    tag: "18% completed",
    mol: "12mol",
  },
  {
    icon: BrainIcon,
    title: "AI understands your notes",
    description: "Studly reads and comprehends your material the way you would, organizing it intelligently.",
    tag: "42% completed",
    mol: "28mol",
  },
  {
    icon: RouteIcon,
    title: "Personalized learning path",
    description: "Get a structured roadmap through your content - a clear way forward, not an overwhelming pile.",
    tag: "27% completed",
    mol: "16mol",
  },
  {
    icon: CheckmarkCircle02Icon,
    title: "Smart quizzes",
    description: "Test yourself at the right time to reinforce learning and prove you actually know it.",
    tag: "63% completed",
    mol: "34mol",
  },
  {
    icon: ChartLineData01Icon,
    title: "Track your progress",
    description: "Pick up right where you left off. The loop adapts to keep you moving forward.",
    tag: "51% completed",
    mol: "23mol",
  },
];

const Features = () => (
  <section id="features" className="relative border-t border-[#ece7d8]">
    <ContainerGrid />
    <div className="relative z-10 mx-auto max-w-[680px] px-6 py-20 md:px-10 md:py-24 scroll-margin-top-[24px]">
      <div className="mx-auto max-w-[680px] text-center">
        <h2 className="font-geist text-[28px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#141414] sm:text-[36px] lg:text-[42px]">
          Everything you need to study smarter
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-1 bg-[#ece7d8] md:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <div
              key={feature.title}
              className="relative mx-auto max-w-[220px] overflow-hidden bg-[#fffcf0]"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#141414] text-sm font-semibold text-white">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-[#f7f3e7] text-center text-[#1f4a94] font-semibold text-[10px] tabular-nums">
                  {String(index * 24 + 0).padStart(2, "0")}%
                </div>
              </div>

              <div className="mt-4 flex h-12 w-full flex-col gap-1 overflow-hidden rounded-xl bg-[#fffcf0] p-3">
                <HugeiconsIcon icon={feature.icon} size={20} className="w-5 h-5" />
                <h3 className="font-geist text-[18px] font-semibold leading-[1.2] tracking-[-0.015em] text-[#141414]">
                  {feature.title}
                </h3>
                <p className="font-geist text-[15px] leading-[1.5] text-[#726f6c]">
                  {feature.description}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="flex h-6 flex-1 overflow-hidden rounded-lg bg-[#f7f3e7] px-2 py-0.5">
                  <span className="text-[11px] font-semibold text-[#1f4a94] tabular-nums">Progress</span>
                </div>
                <div className="flex h-4 flex-1 overflow-hidden rounded-md bg-[#fffcf0] border border-[#ece7d8]/40 px-2 py-0.5">
                  <span className="text-[10px] font-semibold text-[#141414] tabular-nums">{feature.mol}</span>
                </div>
                <div className="flex gap-1 overflow-hidden rounded-lg bg-[#f7f3e7] p-1">
                  <span className="flex h-[18px] w-[12px] items-center justify-center rounded-md bg-[#3b7be8]"></span>
                  <span className="flex h-[18px] flex-1 items-center justify-center rounded-md bg-[#fffcf0] border-x border-[#ece7d8]/40"></span>
                  <span className="flex h-[18px] w-[12px] items-center justify-center rounded-md bg-[#2e9b5f]"></span>
                </div>
              </div>

              <div className="mt-4 flex w-full max-w-[220px] justify-end">
                <div className="flex h-9 w-28 items-center justify-center rounded-full bg-[#141414] text-sm font-semibold text-white shadow-[0_8px_24px_-12px_#14141440]">
                  Learn More
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Features;
