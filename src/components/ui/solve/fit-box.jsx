import React, { useLayoutEffect, useRef, useState } from "react";

/**
 * FitBox — content at its natural size, shrunk to fit the space it is given
 * rather than clipped.
 *
 * A scene that draws a document (the map, the quiz) has a fixed height: rows of
 * real text at real sizes. The panel is a slice of the viewport, so on a short
 * window the document is taller than the panel and gets cut at both ends. One
 * uniform scale keeps every row whole and legible; what is left over is centred.
 *
 * The scale sits on a plain wrapper rather than on the content itself, because
 * Framer writes `transform` on any element it animates and would overwrite a
 * scale handed in through style. That wrapper is also what gets measured:
 * offsetHeight is layout height, which a transform leaves alone, so the
 * measurement cannot feed back into the scale.
 */
const FitBox = ({ children, maxWidth = 360, className = "" }) => {
  const boxRef = useRef(null);
  const contentRef = useRef(null);
  const booted = useRef(false);
  const [fit, setFit] = useState({ scale: 1, ease: "none" });

  useLayoutEffect(() => {
    const box = boxRef.current;
    const content = contentRef.current;
    if (!box || !content) return undefined;

    const measure = () => {
      const natural = content.offsetHeight;
      /* clientHeight is the padding box, but the padding is not room the
         content can use, so take it off. Centring below happens in the same
         content box, so the two agree. */
      const pad = getComputedStyle(box);
      const inset = (parseFloat(pad.paddingTop) || 0) + (parseFloat(pad.paddingBottom) || 0);
      const room = box.clientHeight - inset;
      if (!natural || !room) return;
      const ease = booted.current ? "500ms cubic-bezier(0.16, 1, 0.3, 1)" : "none";
      booted.current = true;
      setFit((prev) => {
        const scale = Math.min(1, room / natural);
        return Math.abs(prev.scale - scale) < 0.005 && prev.ease === ease
          ? prev
          : { scale, ease };
      });
    };

    measure();
    /* Layout is not settled on mount (fonts, the scene's entrance), so take a
       second reading on the next frame. */
    const raf = requestAnimationFrame(measure);
    /* The content grows as the scene reveals more of itself, so watch both the
       room and the content. Transform leaves the observed box alone, so neither
       reading can loop. */
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    ro.observe(content);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={boxRef}
      className={`flex h-full w-full items-center justify-center overflow-hidden ${className}`}
    >
      <div
        ref={contentRef}
        className="w-full origin-center"
        style={{
          maxWidth,
          transform: `scale(${fit.scale})`,
          transition: `transform ${fit.ease}`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default FitBox;
