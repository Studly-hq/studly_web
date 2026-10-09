import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mic01Icon } from "@hugeicons/core-free-icons";

/**
 * Voice note modal — mirrors Lucid's VoiceRecorder in its idle state.
 *
 * Source: lucid/src/components/ui/VoiceRecorder.tsx
 *   overlay  `fixed inset-0 z-50 flex items-center justify-center
 *             bg-background/80 backdrop-blur-sm p-4`
 *   card     `flex flex-col items-center justify-center bg-card
 *             border border-border/50 rounded-3xl p-8 max-w-sm w-full`
 *   idle     primary/10 circle + mic, "Record Voice Note", "Up to 5 minutes",
 *            Cancel + Start buttons
 *   motion   fade 0.3s, card scale 0.95 → 1, ease [0.16, 1, 0.3, 1]
 *
 * On the landing page there is nothing to record into, so Start hands off to
 * signup instead of opening the mic. The recording state is intentionally not
 * ported — there's no capture, canvas, or timer here.
 *
 * Theme tokens are pinned to their light values to match the light-only
 * landing page.
 */
const EASE = [0.16, 1, 0.3, 1];
const FOCUS = "focus-visible:outline-none! focus-visible:ring-2 focus-visible:ring-[#141414]/35";

const VoiceRecorderModal = ({ isOpen, onClose, onStart }) => {
  // Escape closes, and the page behind is locked while open.
  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#fffcf0]/80 p-4 backdrop-blur-sm"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="voice-recorder-title"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-sm flex-col items-center justify-center rounded-3xl border border-[#ece7d8]/50 bg-[#fffcf0] p-8"
          >
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#141414]/10 text-[#141414]">
                <HugeiconsIcon icon={Mic01Icon} strokeWidth={1.8} className="size-9" aria-hidden="true" />
              </div>

              <div>
                <h3
                  id="voice-recorder-title"
                  className="mb-1 font-geist text-lg font-medium text-[#141414]"
                >
                  Record Voice Note
                </h3>
                <p className="font-geist text-sm text-[#726f6c]">Up to 5 minutes</p>
              </div>

              <div className="mt-2 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className={`rounded-full bg-[#f7f3e7] px-6 py-2.5 font-geist font-medium text-[#141414] transition-colors hover:bg-[#f7f3e7]/80 ${FOCUS}`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onStart}
                  className={`rounded-full bg-[#141414] px-6 py-2.5 font-geist font-medium text-white transition-colors hover:bg-[#141414]/90 ${FOCUS}`}
                >
                  Start
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceRecorderModal;
