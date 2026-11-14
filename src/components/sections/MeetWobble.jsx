import React from "react";
import { motion } from "framer-motion";
import ContainerGrid from "./ContainerGrid";

const EASE = [0.16, 1, 0.3, 1];

const MeetWobble = () => {
  return (
    <section id="meet-wobble" className="relative border-t border-[#ece7d8] py-20 md:py-28">
      <ContainerGrid dots />

      <div className="mx-auto w-full max-w-[1080px] px-6 md:px-10">
        {/* Heading — normal section header font, not scribble. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <h2 className="mx-auto max-w-[720px] text-center text-[32px] font-normal leading-[1.15] tracking-[-0.02em] text-[#141414] md:text-4xl">
            Meet Wobble
          </h2>
        </motion.div>

        {/* Mascot — bigger, with the scribble label + arrow pointing at it. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
        >
          <div className="relative mt-12 md:mt-16">
            {/* Scribble label centered above mascot */}
            <div className="absolute -top-[54px] left-1/2 -translate-x-1/2 z-20 h-[58px] flex items-center justify-center pointer-events-none text-[#141414]/55">
              <span className="font-scribble text-[clamp(18px,2.4vw,24px)] leading-none">
                Our mascot
              </span>
            </div>

            <div
              className="size-56 md:size-72 shrink-0 relative animate-map-wiggle mx-auto"
              style={{
                backgroundImage: "url('/star-mascot.webp')",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MeetWobble;
