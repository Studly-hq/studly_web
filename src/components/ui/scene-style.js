/**
 * Shared SVG scene tokens.
 *
 * Single source of truth for every animated SVG scene on the landing page.
 * Anything new (quiz, flashcards, streak, whatever comes next) should draw its
 * chrome from here so all the scenes read as one family: same surface, same
 * stroke weight, same radii, same dash rhythm.
 *
 * Values are pinned to the app's light palette so a scene never drifts when
 * dark mode is toggled.
 */
export const SCENE = {
  /** Card geometry — folder and composer are deliberately identical. */
  cardWidth: 280,
  cardHeight: 200,
  radius: 18,
  strokeWidth: 1.25,
  /** Dash rhythm for "drop target" style outlines. */
  dash: "7 6",

  colors: {
    surface: "#fffcf0", // page cream
    surfaceRaised: "#f7f3e7", // secondary panel
    ink: "#141414", // foreground
    strokeSoft: "rgba(20, 20, 20, 0.18)", // resting outline
    strokeStrong: "rgba(20, 20, 20, 0.38)", // hover / active outline
    fillSubtle: "rgba(20, 20, 20, 0.05)",
    divider: "rgba(20, 20, 20, 0.10)",
    muted: "#726f6c",
    paper: "#fdfbf4",
    paperLine: "#e4ded0",
  },
};

/** Horizontal gap between the folder card and the composer card. */
export const SCENE_GAP = 72;

export const SCENE_WIDTH = SCENE.cardWidth * 2 + SCENE_GAP;
