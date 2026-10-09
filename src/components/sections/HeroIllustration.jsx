import React from "react";
import FolderUploadScene from "../ui/folder-upload-scene";

/**
 * Hero illustration — the folder / upload / wave-loader animation, ready to be
 * dropped into a layout as a self-contained unit.
 *
 * Removed from Hero.jsx ahead of the redesign. Mount it anywhere by rendering
 * <HeroIllustration />.
 *
 * `floating` positions it absolutely inside the nearest `relative` ancestor so
 * it contributes no layout height — which is how the hero kept its headline
 * bottom-anchored while this ran above it. Set it to false to place it in
 * normal flow instead.
 *
 * The scene itself is ~632 x 340. On narrow viewports it will overflow, so a
 * redesign should either reserve space for it or scale it down.
 */
const HeroIllustration = ({ floating = true, className = "" }) => {
  if (!floating) {
    return (
      <div className={`flex w-full justify-center ${className}`}>
        <FolderUploadScene />
      </div>
    );
  }

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 top-4 z-40 flex justify-center ${className}`}
    >
      <FolderUploadScene />
    </div>
  );
};

export default HeroIllustration;
