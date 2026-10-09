/**
 * How fast the six step illustrations run.
 *
 * Each scene is a chain of tween durations, stagger intervals and holds, tuned
 * by eye against the pinned section. Read one at a time they look reasonable,
 * but every scene loops on its own clock for as long as its step is on screen,
 * and a step is on screen for long enough to watch, so the set of them together
 * reads as busy.
 *
 * PACE is the one number to turn. It multiplies every duration, every stagger
 * interval and every hold in every scene, so the six slow down together rather
 * than one drifting against the next. The numbers written inside the scenes are
 * the ones they were tuned at, not the ones they run at, so this stays a dial
 * and not a rewrite.
 *
 * SWAP_PACE is deliberately smaller. The panel's cross-fade and tint are tied
 * to the scroll handover between steps, so they can lag the column by a little
 * without the panel ever feeling a step behind the row it belongs to.
 */
export const PACE = 1.7;
export const SWAP_PACE = 1.35;
