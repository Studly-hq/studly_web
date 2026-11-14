import React, {
  Children,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useTransform,
} from "framer-motion";

/**
 * One revealed row.
 *
 * The overlay holds a full copy of the line's markup, but is clipped to just
 * this row's band with `clip-path: inset(...)`, and that band is revealed by
 * its own horizontal wipe mask. Clipping to the row is what lets each *rendered*
 * row fill independently instead of every wrapped row of the same paragraph
 * filling at once.
 *
 * `ratio` is the row's width as a fraction of the line box, so the wipe reaches
 * 100% exactly at the row's right edge rather than at the container's edge.
 */
const RowOverlay = ({ child, top, bottomInset, ratio, progress, range, tone }) => {
  // The sweep starts below zero so nothing is filled before the user scrolls.
  const cutStart = useTransform(progress, range, [-10 * ratio, 118 * ratio]);
  // The gradient's soft band, as a percentage of the gradient box.
  //
  // This is the width of the wipe's leading edge, and it is what decides whether
  // the reveal reads as a hard wipe or as a shadow trailing the text. Wide band
  // (this was 10% of the row, ~60px on a 600px row) puts several glyphs at
  // partial opacity at once, each drawn over the dim base copy beneath it - the
  // two do not line up perfectly, so the overlap reads as a soft grey ghost
  // smeared along the front of the sweep. Narrow band keeps at most one glyph
  // mid-transition, and the fill looks like it is being revealed rather than
  // fading in through fog.
  //
  // Not zero: a gradient with identical stops is a hard transition, but at
  // fractional pixel positions rounding can leave a hairline gap or a doubled
  // edge. Half a percent is under a pixel at any realistic text size and stays
  // well clear of that.
  const BAND = 0.5;
  const cutEnd = useTransform(cutStart, (v) => v + BAND);
  const maskImage = useMotionTemplate`linear-gradient(90deg, #000 ${cutStart}%, transparent ${cutEnd}%)`;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 select-none"
      style={{
        color: tone,
        clipPath: `inset(${top}px 0px ${bottomInset}px 0px)`,
        maskImage,
        WebkitMaskImage: maskImage,
      }}
    >
      {child}
    </motion.div>
  );
};

/**
 * ScrollRevealText — text that starts empty (low opacity only) and fills in as
 * the user scrolls, **one rendered row at a time**: row 1 fills completely,
 * then row 2, then row 3, and so on.
 *
 * How it works:
 *   1. A dim base layer holds the real, accessible copy and defines layout.
 *   2. Real line boxes are measured with `Range.getClientRects()`, so we know
 *      exactly where the browser wrapped the text at the current font/size.
 *   3. One overlay per row sits on top, clipped to that row's band and masked
 *      by its own gradient, driven by its own slice of the progress range.
 *
 * Nothing re-renders while scrolling: the row geometry is measured on layout
 * and resize only, and the wipe itself is driven by motion values.
 *
 * `range` covers the whole block and is split evenly across the rows, so the
 * first row starts filling as soon as `range[0]` is reached and the last row
 * completes at `range[1]`.
 *
 * Pass any MotionValue (usually a section's smoothed scrollYProgress).
 */
const ScrollRevealText = ({
  children,
  progress,
  range = [0.05, 0.45],
  className = "",
  tone = "#141414",
  baseTone = "rgba(20, 20, 20, 0.16)",
}) => {
  const reduced = useReducedMotion();
  const wrapRef = useRef(null);
  const [rows, setRows] = useState([]);

  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const measured = [];

    Array.from(wrap.children).forEach((lineWrapper, lineIndex) => {
      const base = lineWrapper.children[0];
      const target = base && base.firstElementChild;
      if (!target) return;

      const boxRect = lineWrapper.getBoundingClientRect();
      if (!boxRect.width || !boxRect.height) return;

      // One rect per rendered line box.
      const range = document.createRange();
      range.selectNodeContents(target);
      const lineRects = Array.from(range.getClientRects()).filter(
        (r) => r.width > 0 && r.height > 0
      );
      const boxes = lineRects.length ? lineRects : [target.getBoundingClientRect()];

      boxes.forEach((r) => {
        measured.push({
          lineIndex,
          top: r.top - boxRect.top,
          bottomInset: boxRect.bottom - r.bottom,
          ratio: r.width / boxRect.width,
        });
      });
    });

    setRows(measured);
  }, []);

  useLayoutEffect(measure, [measure, children]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || typeof ResizeObserver === "undefined") return undefined;
    // Re-measure whenever the block rewraps (font size, width, font load).
    const observer = new ResizeObserver(measure);
    observer.observe(wrap);
    return () => observer.disconnect();
  }, [measure]);

  if (reduced) {
    return (
      <div className={className} style={{ color: tone }}>
        {children}
      </div>
    );
  }

  const lines = Children.toArray(children);
  const [from, to] = range;
  const span = (to - from) / Math.max(rows.length, 1);

  return (
    <div ref={wrapRef} className={className}>
      {lines.map((child, i) => (
        // `flow-root` matters: it makes this box a block formatting context, so
        // a child's top margin (e.g. `mt-3` between the two lines) is
        // contained *inside* here. Without it the base layer's margin collapses
        // out of the wrapper while the absolutely-positioned overlay keeps its
        // margin inside (it is a BFC itself), and the two copies drift apart.
        <div key={i} className="relative flow-root">
          {/* Layout + accessibility layer. */}
          <div style={{ color: baseTone }}>{child}</div>

          {rows
            .map((r, globalIndex) => ({ r, globalIndex }))
            .filter(({ r }) => r.lineIndex === i)
            .map(({ r, globalIndex }) => (
              <RowOverlay
                key={globalIndex}
                child={child}
                top={r.top}
                bottomInset={r.bottomInset}
                ratio={r.ratio}
                progress={progress}
                range={[from + span * globalIndex, from + span * (globalIndex + 1)]}
                tone={tone}
              />
            ))}
        </div>
      ))}
    </div>
  );
};

export default ScrollRevealText;
