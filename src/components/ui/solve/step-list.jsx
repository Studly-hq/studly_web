import React, { useRef, useEffect, useCallback } from "react";

/** StepList — the six steps, as a column of rows. */

const clamp01 = (n) => {
  // Clamp a number between 0 and 1.
  return n < 0 ? 0 : n > 1 ? 1 : n;
};

export const STEP_ARRIVES_AT = 0.44;

const StepList = ({ steps, active, maxActive, captions = {}, onSelect }) => {
  // Refs so the timer/effect can use current values without restarting.
  const fillRef = useRef(null);
  const activeRef = useRef(active);
  const maxActiveRef = useRef(maxActive ?? steps.length - 1);
  const onSelectRef = useRef(onSelect);
  const timerRef = useRef(null);
  const startRef = useRef(0);
  const captionRefs = useRef(captions);

  activeRef.current = active;
  maxActiveRef.current = maxActive ?? steps.length - 1;
  onSelectRef.current = onSelect;
  captionRefs.current = captions;

  const STEP_MS = 10_000;

  // Timer + auto-advance: each active step fills over STEP_MS, then steps forward.
  // Running the clock from the active-step change means a user jump restarts the
  // fill for its row instead of continuing from a previous step's elapsed time.
  useEffect(() => {
    if (active === null || active < 0) return;

    const current = activeRef.current;
    const max = maxActiveRef.current;
    if (current > max) {
      // Don't start a timer for a step the parent is no longer showing.
      return;
    }

    startRef.current = performance.now();

    const raf = (now) => {
      const elapsed = now - startRef.current;
      const p = clamp01(elapsed / STEP_MS);
      if (fillRef.current) {
        fillRef.current.style.transform = `scaleX(${p})`;
      }
      if (p < 1) {
        timerRef.current = requestAnimationFrame(raf);
      } else {
        // This step's fill is done — move to the next one.
        const next = current + 1;
        if (next <= max) {
          // Advance the active step so the next effect starts its own fill.
          onSelectRef.current(next);
        }
      }
    };

    const first = requestAnimationFrame(raf);
    timerRef.current = first;

    return () => {
      if (timerRef.current !== null) {
        cancelAnimationFrame(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [active]);

  const handleSelect = useCallback(
    (i) => {
      onSelectRef.current(i);
    },
    []
  );

  return (
    <div
      role="tablist"
      aria-orientation="vertical"
      className="flex w-full flex-col"
    >
      {steps.map((step, i) => {
        const isActive = i === active;
        return (
          <button
            key={step.id}
            type="button"
            role="tab"
            id={`solve-tab-${i}`}
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => handleSelect(i)}
            className="group relative flex w-full flex-col items-start border-b border-[#141414]/8 py-5 text-left last:border-b-0 cursor-pointer"
          >
            <span className="flex w-full items-center gap-3">
              <span
                className={`flex size-7 shrink-0 items-center justify-center rounded-[7px] border font-geist text-[11.5px] font-medium tabular-nums transition-colors duration-[220ms] ${
                  isActive
                    ? "border-[#141414] bg-[#141414] text-[#fffcf0]"
                    : "border-[#141414]/12 bg-[#fffcf0] text-[#141414]/50"
                }`}
              >
                {i + 1}
              </span>
              <span
                className={`min-w-0 truncate font-geist text-2xl font-semibold leading-[1.2] tracking-[-0.025em] transition-colors duration-[220ms] ${
                  isActive
                    ? "text-[#141414]"
                    : "text-[#141414]/45 group-hover:text-[#141414]/70"
                }`}
              >
                {step.title}
              </span>
            </span>
            {/* Progress bar — only on active step */}
            {isActive && (
              <div
                ref={fillRef}
                className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-[#141414] transition-none"
                style={{ transform: `scaleX(${0})` }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default StepList;

