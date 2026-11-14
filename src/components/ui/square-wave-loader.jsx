import React, { useId, useMemo } from "react";

/**
 * SquareWaveLoader — ported verbatim from Lucid
 * (src/components/ui/square-wave-loader.tsx), used by their StudySession.
 *
 * Same geometry and timing as Lucid: 5 squares, 14px, 8px gap, 2100ms cycle,
 * squashing and bouncing from a bottom-center origin. Rewritten as SVG rects
 * rather than divs so it composes inside the shared scene system and picks up
 * its colour from `currentColor`.
 */
export function SquareWaveLoader({
  count = 5,
  size = 14,
  gap = 8,
  duration = 2100,
  easing = "cubic-bezier(0.4, 0, 0.2, 1)",
  className = "",
}) {
  const instanceId = useId().replace(/:/g, "");
  const squares = Array.from({ length: count });

  const totalWidth = count * size + (count - 1) * gap;
  const effectiveBounceHeight = totalWidth - size;
  const maxScale = 1 + effectiveBounceHeight / size;
  const halfBounceHeight = effectiveBounceHeight / 2;
  const halfScale = 1 + halfBounceHeight / size;

  const keyframeRules = useMemo(() => {
    return squares
      .map((_, i) => {
        const riseBase = 2 + Math.round(i * 2.5);
        const fallBase = riseBase + 44;
        const name = `swl-${instanceId}-${i}`;

        return `
@keyframes ${name} {
  0%, ${Math.max(0, riseBase - 2)}% { transform: translateY(0) scaleY(1); animation-timing-function: ease-in-out; }
  ${riseBase}% { transform: translateY(0) scaleY(0.75); animation-timing-function: ${easing}; }
  ${riseBase + 5}% { transform: translateY(0) scaleY(${halfScale}); animation-timing-function: ${easing}; }
  ${riseBase + 10}% { transform: translateY(-${halfBounceHeight}px) scaleY(1); animation-timing-function: ease-in-out; }
  ${riseBase + 13}% { transform: translateY(-${halfBounceHeight}px) scaleY(1); animation-timing-function: ease-in-out; }
  ${riseBase + 16}% { transform: translateY(-${halfBounceHeight + size * 0.25}px) scaleY(0.75); animation-timing-function: ${easing}; }
  ${riseBase + 21}% { transform: translateY(-${halfBounceHeight}px) scaleY(${halfScale}); animation-timing-function: ${easing}; }
  ${riseBase + 26}% { transform: translateY(-${effectiveBounceHeight}px) scaleY(1); animation-timing-function: ease-in-out; }
  ${riseBase + 29}% { transform: translateY(-${effectiveBounceHeight + size * 0.25}px) scaleY(0.75); animation-timing-function: ease-in-out; }
  ${riseBase + 32}%, ${fallBase - 2}% { transform: translateY(-${effectiveBounceHeight}px) scaleY(1); animation-timing-function: ease-in-out; }
  ${fallBase}% { transform: translateY(-${effectiveBounceHeight + size * 0.25}px) scaleY(0.75); animation-timing-function: ${easing}; }
  ${fallBase + 8}% { transform: translateY(0) scaleY(${maxScale}); animation-timing-function: ${easing}; }
  ${fallBase + 15}% { transform: translateY(0) scaleY(1); animation-timing-function: ease-in-out; }
  ${fallBase + 18}% { transform: translateY(0) scaleY(0.75); animation-timing-function: ease-in-out; }
  ${fallBase + 21}%, 100% { transform: translateY(0) scaleY(1); }
}
.swl-${instanceId}-${i} {
  animation: ${name} ${duration}ms linear infinite;
}
`;
      })
      .join("");
  }, [count, size, gap, duration, easing, instanceId, squares, halfBounceHeight, halfScale, effectiveBounceHeight, maxScale]);

  return (
    <svg
      role="status"
      aria-label="Loading"
      width={totalWidth}
      height={totalWidth}
      viewBox={`0 0 ${totalWidth} ${totalWidth}`}
      className={className}
      overflow="visible"
    >
      <style dangerouslySetInnerHTML={{ __html: keyframeRules }} />
      {squares.map((_, i) => (
        <rect
          key={i}
          x={i * (size + gap)}
          y={totalWidth - size}
          width={size}
          height={size}
          rx={0}
          fill="currentColor"
          className={`swl-${instanceId}-${i}`}
          style={{ transformBox: "fill-box", transformOrigin: "bottom center", willChange: "transform" }}
        />
      ))}
    </svg>
  );
}

export default SquareWaveLoader;
