import React from "react";
import ContainerGrid from "./ContainerGrid";
import { AsciiArt } from "../ui/adan-y-dios";

const CTA = () => (
  <section
    id="cta"
    className="relative border-t border-b border-[#ece7d8] py-20 md:py-28 overflow-hidden"
  >
    {/* AsciiArt background video - clipped to ContainerGrid width */}
    <div className="absolute inset-y-0 left-1/2 z-0 w-full max-w-[1080px] -translate-x-1/2 overflow-hidden">
      <AsciiArt className="absolute inset-0" />
    </div>

    {/* Dark overlay for text readability - also clipped to container width */}
    <div className="absolute inset-y-0 left-1/2 z-10 w-full max-w-[1080px] -translate-x-1/2 bg-[#141414]/40" />

    <ContainerGrid dots />

    <div className="relative z-20 mx-auto w-full max-w-[1080px] px-6 md:px-10 text-center">
      <h2 className="text-[32px] font-normal leading-[1.15] tracking-[-0.02em] text-white md:text-4xl">
        Understand your first topic
      </h2>

      <div className="mt-10">
        <a
          href="/signup"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 font-geist text-[14px] font-medium text-[#141414] transition-opacity hover:opacity-85"
        >
          Get started
        </a>
      </div>
    </div>
  </section>
);

export default CTA;