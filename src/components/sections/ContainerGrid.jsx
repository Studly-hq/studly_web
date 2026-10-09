import React from "react";

/**
 * Centered container guide from the design export.
 * Two hairline rails marking the 1080px container edges, spanning
 * the full page height. Purely decorative, sits behind content.
 *
 * Light-only for now: the hairline uses the app's light border color so the
 * rails blend with dashboard borders instead of reading cool against cream.
 */
const ContainerGrid = ({ className = "" }) => (
  <div
    aria-hidden="true"
    className={`pointer-events-none absolute inset-y-0 left-1/2 z-30 w-full max-w-[1080px] -translate-x-1/2 border-x border-[#ece7d8] ${className}`}
  />
);

export default ContainerGrid;