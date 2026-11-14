import { useEffect } from "react";
import { frame, cancelFrame } from "framer-motion";
import Lenis from "lenis";

/**
 * Slow, inertial page scrolling.
 *
 * A wheel notch is a discrete jump: the browser moves the document ~100px
 * instantly and nothing happens in between. That is why an ordinary page reads
 * as stepping rather than moving, and why every scroll-driven animation built on
 * top of it inherits the same staircase no matter how carefully it is timed.
 *
 * Lenis takes the wheel event, holds a target position, and eases the real
 * scrollTop toward it every frame. Crucially it drives *native* scroll rather
 * than transforming a wrapper, so `position: sticky` still pins (the Problem
 * section's 300vh stage depends on it), the scrollbar still reflects the true
 * position and can still be dragged, anchor links still land, and screen readers
 * still see a normally scrolling document. The transform-a-wrapper approach
 * that "smooth scroll" used to mean broke all four.
 *
 * Lenis resyncs itself against scrolls it did not cause - scrollbar drags,
 * keyboard paging, `#anchor` jumps - so unlike the hand-rolled loop this
 * replaced, there is no last-written-position bookkeeping to keep in sync.
 */

/**
 * Interpolation per frame, as a fraction of the remaining distance.
 *
 * 0.08 means each frame closes 8% of the gap, so a jump settles over roughly 36
 * frames - about 600ms of glide. Below ~0.06 the page starts to feel detached
 * from the input; above ~0.12 there is not enough travel left to read as
 * anything but normal scrolling.
 *
 * Accepted as `ease` for continuity with the previous implementation, which
 * used the same value for the same purpose.
 */
const LERP = 0.08;

/**
 * How far one wheel notch asks to travel, against the browser's own step.
 *
 * The direct lever on "one scroll does too much", and the efficient one. The
 * alternative - making the pinned sections taller - buys the same reduction in
 * motion per gesture at the cost of a longer page; this buys it for nothing.
 *
 * This is roughly as low as it can usefully go. Much below 0.5 and the page
 * stops feeling weighty and starts feeling unresponsive, which is a worse
 * problem than the one being solved.
 */
const WHEEL = 0.6;

/**
 * @param {object}  options
 * @param {boolean} options.enabled  Skip entirely when false.
 * @param {number}  options.ease     Per-frame lerp; see LERP.
 */
const useSmoothScroll = ({ enabled = true, ease = LERP } = {}) => {
  useEffect(() => {
    if (!enabled) return undefined;
    if (typeof window === "undefined") return undefined;

    const lenis = new Lenis({
      lerp: ease,
      wheelMultiplier: WHEEL,
      // Touch keeps the platform's own momentum. iOS and Android already do
      // this well, and taking it over is what makes smooth-scroll libraries
      // feel broken on phones.
      syncTouch: false,
      anchors: true,
      // respectReducedMotion defaults true: Lenis forces lerp to 1 and makes
      // programmatic scrolls instant, and it watches the media query live
      // rather than only at construction. Nothing to do here.

      // The raf loop is ours, below.
      autoRaf: false,
    });

    /**
     * Driven from Framer's frame loop rather than its own requestAnimationFrame.
     *
     * Two loops means Lenis can write a new scrollTop *after* Framer has
     * already read it for this frame, so every scroll-linked value in the
     * scroll-driven sections renders one frame stale - which shows up as a fine
     * jitter on the parts that move per-pixel.
     * Sharing a loop makes the read strictly follow the write.
     *
     * The timestamp comes from the FrameData Framer hands this callback rather
     * than performance.now(), so Lenis is stepped with the exact clock Framer
     * has already stamped this frame with. framer-motion@10 has no exported
     * `time` helper - that arrived in v11 - so the callback argument is the
     * equivalent.
     */
    const update = ({ timestamp }) => lenis.raf(timestamp);
    frame.update(update, true);

    return () => {
      cancelFrame(update);
      lenis.destroy();
    };
  }, [enabled, ease]);
};

export default useSmoothScroll;