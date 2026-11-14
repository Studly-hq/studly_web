import React from "react";

/**
 * Centered container guide from the design export.
 * Two hairline rails marking the 1080px container edges, spanning
 * the full page height. Purely decorative, sits behind content.
 *
 * `dots` places a 7px pin where each rail crosses the section's top border, so
 * the two hairlines read as one continuous grid rather than loose lines. It is
 * opt-in because it only makes sense on sections that actually draw a top
 * border — on a borderless section the pins would float at nothing.
 *
 * The pin is cream rather than white, matching this page's background, and it
 * is centred with a translate so the hairline passes straight through it.
 *
 * Light-only for now: the hairline uses the app's light border color so the
 * rails blend with dashboard borders instead of reading cool against cream.
 */
const ContainerGrid = ({ className = "", dots = false }) => (
  <div
    aria-hidden="true"
    className={`pointer-events-none absolute inset-y-0 left-1/2 z-30 w-full max-w-[1080px] -translate-x-1/2 border-x border-[#ece7d8] ${className}`}
  >
    {dots && (
      <>
        <span className="absolute left-0 top-0 size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#141414]/15 bg-[#fffcf0]" />
        <span className="absolute right-0 top-0 size-[7px] -translate-y-1/2 translate-x-1/2 rounded-full border border-[#141414]/15 bg-[#fffcf0]" />
      </>
    )}
  </div>
);

export default ContainerGrid;
