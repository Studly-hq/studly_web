import React from "react";
import { useReducedMotion } from "framer-motion";
import ContainerGrid from "./ContainerGrid";

/**
 * Footer — the Studly wordmark on orange.
 *
 * Minimal: just the brand mark, nothing else. Uses the same container pattern
 * as other sections (ContainerGrid + max-w-[1080px]) so the rails align.
 */
const Footer = () => {
  const reduced = useReducedMotion();

  return (
    <section
      id="footer"
      className="relative border-t border-[#ece7d8] py-20 md:py-28"
    >
      <ContainerGrid />

      <div className="mx-auto w-full max-w-[1080px] px-6 md:px-10">
        <div className="relative overflow-hidden rounded-2xl bg-[#ff6d36] px-8 py-12 md:px-16 md:py-16">
          {/* Halftone wordmark */}
          <Wordmark
            word="Studly"
            reduced={reduced}
            visible={true}
          />
        </div>
      </div>
    </section>
  );
};

/**
 * Halftone wordmark — the orange Studly text with dot pattern.
 *
 * Simplified from the original: no canvas, no ResizeObserver, no animations.
 * Just SVG text with a halftone overlay pattern.
 */
const Wordmark = ({ word, reduced, visible }) => {
  const iAt = word.indexOf("i");
  const shown = iAt > -1 ? word.slice(0, iAt) + "ı" + word.slice(iAt + 1) : word;

  return (
    <div className="relative">
      {/* SVG text with halftone pattern */}
      <svg
        viewBox="0 0 600 120"
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <pattern id="halftone" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="2.5" fill="#000" opacity="0.3" />
          </pattern>
        </defs>
        {/* Background */}
        <rect width="100%" height="100%" fill="none" />
        {/* Text */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontFamily='"GT Super Display", Canela, Didot, "Bodoni 72", Georgia, serif'
          fontSize="96"
          fontWeight="500"
          letterSpacing="-3"
          fill="#141414"
        >
          {shown}
        </text>
        {/* Halftone overlay */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontFamily='"GT Super Display", Canela, Didot, "Bodoni 72", Georgia, serif'
          fontSize="96"
          fontWeight="500"
          letterSpacing="-3"
          fill="url(#halftone)"
        >
          {shown}
        </text>
      </svg>
    </div>
  );
};

export default Footer;
