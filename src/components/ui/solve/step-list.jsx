import React, { useEffect, useRef } from "react";

/**
 * Where in a hop the next step becomes current, as a fraction of that hop.
 *
 * The panel changes over here, and this is also the point the previous step's
 * progress bar finishes, so a step's life is exactly one hop long: it begins
 * this far into the hop before it and ends this far into its own.
 */
export const STEP_ARRIVES_AT = 0.44;

const clamp01 = (n) => (n < 0 ? 0 : n > 1 ? 1 : n);

/**
 * How much of the step at `index` has been scrolled through, 0 to 1.
 *
 * Clamped at both ends, so the first bar runs from the very top of the scrub
 * and the last one completes before the pin releases rather than hanging
 * permanently part drawn.
 */
const barProgress = (index, v, hops) => {
  const start = Math.max(index - (1 - STEP_ARRIVES_AT), 0);
  const end = Math.min(index + STEP_ARRIVES_AT, hops);
  if (end <= start) return 1;
  return clamp01((v - start) / (end - start));
};

/**
 * StepList - the six steps, as a column of rows.
 *
 * Every step is a full width row on a hairline divider. The current one is
 * black, the rest are dimmed to the same grey, and the current one opens to
 * show what it means. A 2px bar runs along the bottom edge of the current row
 * and fills with scroll, so how much of this step is left is something you can
 * see rather than something you have to feel.
 *
 * The state change is the whole animation: only the title's colour moves, and
 * the open row is a `grid-template-rows` accordion, which is why the list
 * reflows instead of jumping. No travelling line, so there is nothing to keep
 * in sync with anything.
 *
 * Depth is a hairline border and nothing else (DESIGN.md: no shadows, no
 * glows).
 */
const StepList = ({ steps, active, stepFloat, captions = {}, onSelect }) => {
  const hops = steps.length - 1;
  const fillRef = useRef(null);

  /* Written straight to the DOM rather than through a motion value: the bar
     belongs to whichever row is current, and the target element is replaced
     the moment that changes. Re-running on `active` recomputes immediately, so
     the new row never shows the old row's progress for a frame. */
  useEffect(() => {
    const node = fillRef.current;
    if (!node) return undefined;
    const apply = (v) => {
      node.style.transform = `scaleX(${barProgress(active, v, hops)})`;
    };
    apply(stepFloat.get());
    return stepFloat.on("change", apply);
  }, [stepFloat, hops, active]);

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
            onClick={() => onSelect(i)}
            className="group relative flex w-full flex-col items-start border-b border-[#141414]/8 py-5 text-left last:border-b-0"
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

            {/* The accordion. 0fr to 1fr is what makes the row open by pushing
                the list down rather than by appearing over it. */}

            {/* Only the current row carries the bar, so the column never looks
                like a stack of filled progress. */
            {isActive && (
              <span className="absolute bottom-[-1px] left-0 h-[2px] w-full overflow-hidden bg-[#141414]/8">
                <span
                  ref={fillRef}
                  className="block h-full w-full origin-left bg-[#141414]"
                  style={{ transform: "scaleX(0)" }}
                />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default StepList;
