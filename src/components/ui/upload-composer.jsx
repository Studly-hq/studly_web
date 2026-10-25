import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUp02Icon, FileUploadIcon, Mic01Icon } from "@hugeicons/core-free-icons";
import VoiceRecorderModal from "./voice-recorder-modal";

/**
 * Lucid's composer, copied faithfully from
 * lucid/src/components/landing/LandingPage.tsx — same markup order, class
 * names, icon components, stroke widths and sizes.
 *
 *   outer      `w-full max-w-xl rounded-[1.25rem] border border-dashed`
 *   drop zone  FileUploadIcon strokeWidth 1.5, size-6 sm:size-7, caption
 *              "Click or drag files to upload"
 *   fused row  `border-t border-foreground/10 px-2.5 sm:px-3 py-2`
 *   input      placeholder "or type what you want to learn"
 *   mic        Mic01Icon strokeWidth 1.8, size-4 sm:size-[18px]
 *   submit     ArrowUp02Icon strokeWidth 2, size-4, on a rounded-full circle
 *
 * Landing-page behaviour: there is no backend behind this, so every route in
 * funnels to signup.
 *   - clicking the drop zone  → /signup
 *   - typing + submitting      → /signup
 *   - clicking the mic         → opens the voice recorder modal
 *   - "Start" in that modal    → /signup
 *
 * Theme tokens are pinned to their light values so it never flips under
 * `.dark`; the landing page is light-only.
 */
const FOCUS = "focus-visible:outline-none! focus-visible:ring-2 focus-visible:ring-[#141414]/35";

const UploadComposer = ({ className = "", isDragActive = false }) => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [showRecorder, setShowRecorder] = useState(false);

  const goToSignup = () => navigate("/signup");
  const hasContent = text.trim().length > 0;

  return (
    <>
      <div
        className={`composer-shell relative w-full max-w-xl overflow-hidden rounded-[1.25rem] border border-dashed transition-colors duration-200 ${
          isDragActive || hasContent
            ? "border-[#141414]/40 bg-[#141414]/8"
            : "border-[#141414]/20 bg-[#141414]/5 hover:border-[#141414]/40 focus-within:border-[#141414]/40"
        } ${className}`}
      >
        {/* Drop zone */}
        <button
          type="button"
          onClick={goToSignup}
          aria-label="Upload document or image"
          className={`group/zone flex w-full cursor-pointer flex-col ${FOCUS}`}
        >
          <div className="flex w-full flex-col items-center justify-center py-5 transition-colors sm:py-7">
            <HugeiconsIcon
              icon={FileUploadIcon}
              strokeWidth={1.5}
              className="mb-1 size-6 text-[#726f6c]/60 sm:size-7"
            />
            <span className="whitespace-nowrap text-xs font-medium text-[#726f6c] sm:text-sm">
              Click or drag files to upload
            </span>
          </div>
        </button>

        {/* Fused input row */}
        <div className="relative flex items-center border-t border-[#141414]/10 px-2.5 py-2 sm:px-3">
          <form
            className="flex min-w-0 flex-1 items-center gap-1 sm:gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              goToSignup();
            }}
          >
            <div className="relative min-w-0 flex-1">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="or type what you want to learn"
                className="w-full bg-transparent text-sm text-[#141414] outline-none! placeholder:text-transparent"
                aria-label="Type what you want to learn"
              />

              {/**
               * Visual hint. The input keeps a real `placeholder` for assistive
               * tech, hidden with `placeholder:text-transparent`, and this span
               * renders it so it can carry the gradient sweep.
               */}
              {!hasContent && (
                <span
                  aria-hidden="true"
                  className="composer-shimmer composer-hint pointer-events-none absolute inset-y-0 left-0 flex items-center"
                >
                  or type what you want to learn
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowRecorder(true)}
              aria-label="Record voice note"
              className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[#726f6c] transition-colors hover:bg-[#f7f3e7] hover:text-[#141414] sm:size-8 ${FOCUS}`}
            >
              <HugeiconsIcon icon={Mic01Icon} strokeWidth={1.8} className="size-4 sm:size-[18px]" />
            </button>
            {/**
             * Always filled black. Lucid greys this out while the composer is
             * empty, but on the landing page the control is a signup entry
             * point, so it stays active and visible from the first paint.
             */}
            <button
              type="submit"
              aria-label="Continue"
              className={`flex size-7 shrink-0 items-center justify-center rounded-full bg-[#141414] text-white transition-all hover:bg-[#141414]/85 sm:size-8 ${FOCUS}`}
            >
              <HugeiconsIcon icon={ArrowUp02Icon} strokeWidth={2} className="size-4" />
            </button>
          </form>
        </div>
      </div>

      <VoiceRecorderModal
        isOpen={showRecorder}
        onClose={() => setShowRecorder(false)}
        onStart={goToSignup}
      />
    </>
  );
};

export default UploadComposer;
