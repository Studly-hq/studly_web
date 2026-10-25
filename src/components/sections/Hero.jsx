import React from "react";
import ContainerGrid from "./ContainerGrid";
import UploadComposer from "../ui/upload-composer";
import heroTasks from "../../assets/hero-tasks.webp";
import heroCheck from "../../assets/hero-check.webp";

/**
 * Inline hero illustration. Mirrors the design export's .image rules: sized
 * relative to the font (0.92em), nudged onto the baseline (vertical-align
 * -0.16em), and tilted so it reads as hand-placed rather than typeset.
 */
const HeroImage = ({ src, alt, tilt }) => (
  <img
    src={src}
    alt={alt}
    draggable="false"
    className="mx-[0.03em] inline-block h-[0.92em] w-auto align-[-0.16em] origin-center -rotate-[var(--tilt)] scale-x-100 select-none transition-transform duration-500 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] hover:rotate-0 hover:scale-100"
    style={{ "--tilt": tilt }}
  />
);

/**
 * Hero — centred headline on a single line, with the composer beneath it.
 *
 * Follows the reference layout: everything centred horizontally and vertically,
 * headline first, then the wide composer box. No line break in the headline, so
 * it stays on one line at every breakpoint.
 *
 * The folder/upload illustration now lives in HeroIllustration.jsx and the trust
 * row in SocialProof.jsx; both are detached and can be re-mounted later.
 */
const Hero = () => (
  <section className="relative flex min-h-dvh w-full items-center justify-center">
    <ContainerGrid />

    <div className="relative z-40 mx-auto flex w-full max-w-[1080px] -translate-y-10 flex-col items-center px-6 text-center md:px-10">
      <h1 className="hero-headline font-geist font-semibold leading-[1.1] tracking-[-0.035em] text-[#141414]">
        The{" "}
        <HeroImage src={heroTasks} alt="" tilt="-6deg" />
        {" "}
        place for everything you&apos;re{" "}
        <HeroImage src={heroCheck} alt="" tilt="6deg" />
        {" "}
        learning.
      </h1>

      <UploadComposer className="mt-10" />
    </div>
  </section>
);

export default Hero;
