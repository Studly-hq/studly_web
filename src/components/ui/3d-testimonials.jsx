import React, { useMemo, useRef } from "react";
import { cn } from "../../lib/utils";

/**
 * Marquee — seamless infinite scroll track, used by the 3D testimonial wall.
 *
 * The children are duplicated `repeat` times and translated by exactly one copy
 * (`-100% - gap`), so the loop has no visible seam. Speed is set per instance
 * through a `--duration` custom property, direction with `reverse`.
 *
 * Two things differ from a naive marquee:
 *  - `motion-reduce:animate-none` keeps everything still for anyone with
 *    reduced motion enabled. The movement is decoration; the quotes are not.
 *  - `pauseOnHover` also covers keyboard focus (`focus-within` on the group),
 *    so the wall can be read without chasing it.
 *
 * The animation keyframes live in `src/index.css` (`animate-marquee`,
 * `animate-marquee-vertical`), registered through `@theme inline`.
 */
export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ariaLabel,
  ariaLive = "off",
  ariaRole = "marquee",
  ...props
}) {
  const marqueeRef = useRef(null);

  const copies = useMemo(
    () => (
      <>
        {Array.from({ length: repeat }, (_, i) => (
          <div
            key={i}
            className={cn(
              "flex shrink-0 justify-around",
              !vertical ? "flex-row [gap:var(--gap)]" : "flex-col [gap:var(--gap)]",
              !vertical && "animate-marquee flex-row",
              vertical && "animate-marquee-vertical flex-col",
              "motion-reduce:animate-none",
              pauseOnHover && "group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]",
              reverse && "[animation-direction:reverse]"
            )}
          >
            {children}
          </div>
        ))}
      </>
    ),
    [repeat, children, vertical, pauseOnHover, reverse]
  );

  return (
    <div
      {...props}
      ref={marqueeRef}
      data-slot="marquee"
      className={cn(
        "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className
      )}
      aria-label={ariaLabel}
      aria-live={ariaLive}
      role={ariaRole}
      tabIndex={0}
    >
      {copies}
    </div>
  );
}

export default Marquee;
