import React from "react";

/*
 * Footer — the closing section for Studly's landing page.
 *
 * Adapted from a dispatch-AI ticket-stub footer; replaced Dispatch-specific
 * content with Studly equivalents, swapped dark → light cream, kept every
 * animation (halftone wordmark, meridian globe, odometer, scrambling blurb,
 * typewriter eyebrow, punch button).
 *
 * ponytail: this component was ported wholesale from another project. If
 * animations start costing frames, the first thing to drop is the globe
 * (requestAnimationFrame loop) then the wordmark canvas (ResizeObserver + RAF).
 */

// ── Utilities (pure functions, no dependencies) ──────────────────────────────

const clamp01 = (v) => (v > 0 ? (v > 1 ? 1 : v) : 0);

const smoothstep = (edge0, edge1, x) => {
  if (edge0 === edge1) return x < edge0 ? 0 : 1;
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

/** Typewriter timing profile. */
const TYPE = { type: 55, hold: 2600, erase: 22, gap: 420 };

/** Where a looping typewriter is after `ms`: type → hold → erase → pause → next phrase. */
const typeFrame = (phrases, ms, k = TYPE) => {
  const list = phrases.filter((p) => p.length > 0);
  if (!list.length) return { index: 0, text: "", phase: "gap" };
  const spans = list.map((p) => p.length * k.type + k.hold + p.length * k.erase + k.gap);
  const total = spans.reduce((a, b) => a + b, 0);
  let t = Number.isFinite(ms) && total > 0 ? ((ms % total) + total) % total : 0;
  let i = 0;
  while (i < list.length - 1 && t >= spans[i]) t -= spans[i++];
  const p = list[i];
  const typing = p.length * k.type;
  if (t < typing) return { index: i, text: p.slice(0, Math.floor(t / k.type) + 1), phase: "type" };
  t -= typing;
  if (t < k.hold) return { index: i, text: p, phase: "hold" };
  t -= k.hold;
  const erasing = p.length * k.erase;
  if (t < erasing) return { index: i, text: p.slice(0, p.length - Math.floor(t / k.erase)), phase: "erase" };
  return { index: i, text: "", phase: "gap" };
};

/** Deterministic hash → [0, 1). */
const hash = (n) => {
  let x = Math.imul((n | 0) ^ 0x9e3779b9, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
};

/** A point on the unit sphere: theta rounds the great circle through poles at longitude lon, tipped tilt (about x), leant roll (about view axis). z > 0 faces the viewer. */
const project = (theta, lon, tilt, roll) => {
  const x0 = Math.cos(theta) * Math.sin(lon);
  const y0 = Math.sin(theta);
  const z0 = Math.cos(theta) * Math.cos(lon);
  const ct = Math.cos(tilt);
  const st = Math.sin(tilt);
  const y1 = y0 * ct - z0 * st;
  const z1 = y0 * st + z0 * ct;
  const cr = Math.cos(roll);
  const sr = Math.sin(roll);
  return [x0 * cr - y1 * sr, x0 * sr + y1 * cr, z1];
};

/** Visible half of one meridian as SVG path data, screen space. */
const meridianPath = (lon, tilt, roll, cx, cy, r, steps = 96) => {
  let d = "";
  let pen = false;
  for (let i = 0; i <= steps; i++) {
    const [x, y, z] = project((i / steps) * Math.PI * 2, lon, tilt, roll);
    if (z < 0) { pen = false; continue; }
    d += (pen ? "L" : "M") + (cx + r * x).toFixed(1) + " " + (cy - r * y).toFixed(1);
    pen = true;
  }
  return d;
};

/** Max ascender height as fraction of wordmark width. */
const MAX_CAP = 0.2;

/** Font size + extra tracking so a word fills width w, capped by maxH. */
const fitWord = (ink100, asc100, w, maxH, letters) => {
  if (!(ink100 > 0) || !(w > 0)) return { size: 0, extra: 0 };
  let size = (100 * w) / ink100;
  let extra = 0;
  if (asc100 > 0 && maxH > 0 && (asc100 * size) / 100 > maxH) {
    size = (100 * maxH) / asc100;
    if (letters > 1) extra = (w - (ink100 * size) / 100) / (letters - 1);
  }
  return { size, extra };
};

/** Next counter step from a rate in "sessions solved" per second. */
const nextTick = (rate, rand = Math.random) => {
  const delay = 450 + rand() * 900;
  const mean = Number.isFinite(rate) && rate > 0 ? (rate * delay) / 1000 : 0;
  return { delay, add: mean > 0 ? Math.max(1, Math.round(mean * (0.4 + rand() * 1.2))) : 0 };
};

// ── Constants & defaults ────────────────────────────────────────────────────

const DEFAULT_SECTIONS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
  { label: "Resources", href: "#resources" },
];

const LINK_GROUPS = [
  {
    title: "Product",
    links: [
      { label: "Overview", href: "#" },
      { label: "Upload", href: "/upload" },
      { label: "Study Sessions", href: "/home" },
      { label: "Leaderboard", href: "/leaderboard" },
      { label: "Course Bank", href: "/courses" },
      { label: "Feed", href: "/feed" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Blog", href: "/releases" },
      { label: "Discord", href: "#" },
      { label: "Twitter", href: "#" },
      { label: "LinkedIn", href: "#" },
    ],
  },
];

const EYEBROW_PHRASES = [
  "Bring your notes. Study smarter.",
  "Maps that move with you.",
  "Learn one part at a time.",
];

const SANS = '"Neue Montreal", "Inter Tight", Inter, "Helvetica Neue", Helvetica, Arial, sans-serif';
const SERIF = '"GT Super Display", Canela, Didot, "Bodoni 72", "Iowan Old Style", "Palatino Linotype", Georgia, "Times New Roman", serif';
const MONO = '"JetBrains Mono", "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

// ── Inline CSS ────────────────────────────────────────────────────────────────

const CSS =
  ".tsf{position:relative;container-type:inline-size;background:var(--tsf-bg);color:var(--tsf-ink);font-family:var(--tsf-sans);overflow:clip;isolation:isolate;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}" +
  ".tsf *,.tsf *::before,.tsf *::after{box-sizing:border-box}" +
  ":where(.tsf) a{color:inherit;text-decoration:none}" +
  ":where(.tsf) button{font:inherit;color:inherit;background:none;border:0;padding:0;margin:0;cursor:pointer;text-align:inherit}" +
  ":where(.tsf) :focus-visible{outline:1px solid var(--tsf-accent);outline-offset:3px}" +
  ".tsf-grid{--rail:clamp(16px,2.5cqw,36px);--nav:clamp(116px,12.5cqw,180px);--line:color-mix(in srgb,var(--tsf-ink) 11%,transparent);--oline:color-mix(in srgb,var(--tsf-aink) 16%,transparent);--pad:clamp(12px,2.25cqw,30px);position:relative;display:grid;" +
  "grid-template-columns:var(--rail) var(--nav) var(--rail) minmax(0,1fr) var(--rail) minmax(0,1fr) var(--rail);" +
  "grid-template-rows:clamp(32px,5cqw,72px) auto var(--rail) auto clamp(14px,1.7cqw,24px) auto}" +
  ".tsf-vl{grid-row:1/-1;justify-self:start;width:0;border-left:1px solid var(--line);pointer-events:none}" +
  ".tsf-hl{grid-column:1/-1;align-self:start;height:0;border-top:1px solid var(--line);pointer-events:none}" +
  // index
  ".tsf-nav{grid-column:2;grid-row:2;position:relative}" +
  ".tsf-nav ol{list-style:none;margin:0;padding:0;position:relative}" +
  ".tsf-nav li{border-bottom:1px solid var(--line)}" +
  ".tsf-nav-item{position:relative;display:flex;align-items:center;gap:clamp(8px,1cqw,14px);width:100%;height:clamp(24px,2.4cqw,32px);padding:0 6px;font-size:clamp(10.5px,.95cqw,13px);letter-spacing:.01em;color:color-mix(in srgb,var(--tsf-ink) 88%,transparent);transition:color .25s,background-color .25s,padding .35s cubic-bezier(.2,.8,.2,1)}" +
  ".tsf-nav span:first-child{color:var(--tsf-muted);font-variant-numeric:tabular-nums;transition:color .25s}" +
  ".tsf-nav-item:hover{background:color-mix(in srgb,var(--tsf-ink) 4%,transparent);padding-left:12px}" +
  ".tsf-nav-item:hover span:first-child,.tsf-nav-item[aria-current] span:first-child{color:var(--tsf-accent)}" +
  ".tsf-nav-item[aria-current]{color:var(--tsf-ink);padding-left:12px}" +
  ".tsf-nav-bar{position:absolute;left:-1px;top:0;width:2px;height:clamp(24px,2.4cqw,32px);background:var(--tsf-accent);transform:translateY(calc(var(--i) * (100% + 1px)));transition:transform .45s cubic-bezier(.7,0,.2,1);pointer-events:none}" +
  // hero
  ".tsf-hero{grid-column:4;grid-row:2;display:flex;flex-direction:column;min-width:0;padding-bottom:clamp(20px,2.4cqw,30px)}" +
  ".tsf-hero>:not(.tsf-eyebrow){margin-left:var(--pad);margin-right:var(--pad)}" +
  ".tsf-eyebrow{display:flex;align-items:center;gap:12px;padding-left:6px;height:clamp(26px,2.5cqw,32px);border-bottom:1px solid color-mix(in srgb,var(--tsf-ink) 40%,transparent);font-family:var(--tsf-mono);font-size:clamp(11px,1.05cqw,13.5px);white-space:nowrap}" +
  ".tsf-eyebrow svg{flex:none;width:12px;height:12px;max-width:none}" +
  ".tsf-type{min-width:0;overflow:hidden;text-overflow:clip}" +
  ".tsf-caret{display:inline-block;width:.55em;height:1.05em;margin-left:2px;vertical-align:-.18em;background:var(--tsf-accent);animation:tsf-blink 1s steps(1) infinite}" +
  ".tsf-dots{flex:1;min-width:24px;height:10px;opacity:.6;background-image:radial-gradient(circle,var(--dot,var(--tsf-ink)) .85px,transparent 1.25px);background-size:6px 5px;background-position:0 0;" +
  "-webkit-mask-image:linear-gradient(90deg,#000 0,#000 35%,rgba(0,0,0,.25) 50%,#000 65%,#000 100%);mask-image:linear-gradient(90deg,#000 0,#000 35%,rgba(0,0,0,.25) 50%,#000 65%,#000 100%);-webkit-mask-size:200% 100%;mask-size:200% 100%;animation:tsf-march 3.6s linear infinite}" +
  ".tsf-h{margin:clamp(28px,4.6cqw,64px) 0 0;font-weight:300;font-size:clamp(30px,3.65cqw,56px);line-height:1.12;letter-spacing:-.035em;color:var(--tsf-ink)}" +
  ".tsf-h span{display:block;overflow:hidden;padding-bottom:.06em;margin-bottom:-.06em}" +
  ".tsf-h span span{display:block;transform:translateY(0);transition:transform .9s cubic-bezier(.2,.8,.2,1)}" +
  '.tsf[data-seen="0"] .tsf-h span span{transform:translateY(110%)}' +
  ".tsf-p{margin:clamp(16px,2.1cqw,28px) 0 0;max-width:31em;font-size:clamp(13px,1.2cqw,16px);line-height:1.6;color:var(--tsf-muted)}" +
  ".tsf-cta{position:relative;display:flex;align-items:center;justify-content:center;gap:10px;margin-top:clamp(28px,6.6cqw,92px);height:clamp(42px,4cqw,52px);max-width:440px;background:var(--tsf-ink);color:var(--tsf-bg);font-weight:600;font-size:clamp(12px,1.1cqw,14px);letter-spacing:.02em;text-transform:uppercase;overflow:hidden;transition:transform .2s}" +
  ".tsf-cta::before{content:'';position:absolute;inset:0;background:var(--tsf-accent);transform:scaleX(0);transform-origin:left;transition:transform .55s cubic-bezier(.7,0,.2,1)}" +
  ".tsf-cta:hover::before,.tsf-cta:focus-visible::before{transform:scaleX(1)}" +
  ".tsf-cta:active{transform:translateY(1px)}" +
  ".tsf-cta>span{position:relative}" +
  ".tsf-cta svg{position:relative;width:14px;height:14px;max-width:none;opacity:0;transform:translateX(-10px);transition:opacity .3s,transform .45s cubic-bezier(.2,.8,.2,1)}" +
  ".tsf-cta:hover svg,.tsf-cta:focus-visible svg{opacity:1;transform:none}" +
  // side
  ".tsf-side{grid-column:6;grid-row:2;display:flex;flex-direction:column;min-width:0}" +
  ".tsf-orbit{position:relative;height:clamp(92px,11.4cqw,160px);border-bottom:1px solid var(--line);cursor:grab;touch-action:pan-y;overflow:hidden}" +
  ".tsf-orbit:active{cursor:grabbing}" +
  ".tsf-orbit::before,.tsf-orbit::after{content:'';position:absolute;top:0;bottom:0;width:14%;background-image:radial-gradient(circle,color-mix(in srgb,var(--tsf-ink) 45%,transparent) .7px,transparent 1.1px);background-size:4px 4px;pointer-events:none}" +
  ".tsf-orbit::before{left:0;-webkit-mask-image:linear-gradient(90deg,#000,transparent);mask-image:linear-gradient(90deg,#000,transparent)}" +
  ".tsf-orbit::after{right:0;-webkit-mask-image:linear-gradient(270deg,#000,transparent);mask-image:linear-gradient(270deg,#000,transparent)}" +
  ".tsf-orbit svg{position:absolute;left:0;top:0;width:100%;height:100%;max-width:none;display:block}" +
  ".tsf-links{display:grid;grid-template-columns:repeat(var(--cols),minmax(0,1fr));gap:24px;padding:clamp(22px,2.6cqw,36px) clamp(12px,2.3cqw,32px) clamp(20px,2.4cqw,30px)}" +
  ".tsf-links h3{margin:0 0 clamp(14px,1.8cqw,24px);font-weight:400;font-size:clamp(20px,2.2cqw,30px);letter-spacing:-.03em;color:var(--tsf-ink)}" +
  ".tsf-links ul{list-style:none;margin:0;padding:0;display:grid;gap:clamp(4px,.55cqw,8px)}" +
  ".tsf-link{position:relative;display:inline-flex;align-items:center;font-size:clamp(13px,1.2cqw,16px);line-height:1.45;color:var(--tsf-muted);transition:color .25s,transform .35s cubic-bezier(.2,.8,.2,1)}" +
  ".tsf-link::before{content:'';position:absolute;left:-12px;top:50%;width:5px;height:5px;margin-top:-2.5px;background:var(--tsf-accent);transform:rotate(45deg) scale(0);transition:transform .3s cubic-bezier(.2,.8,.2,1)}" +
  ".tsf-link::after{content:'';position:absolute;left:0;right:0;bottom:-2px;height:1px;background:currentColor;transform:scaleX(0);transform-origin:right;transition:transform .4s cubic-bezier(.7,0,.2,1)}" +
  ".tsf-link:hover,.tsf-link:focus-visible{color:var(--tsf-ink);transform:translateX(12px)}" +
  ".tsf-link:hover::before,.tsf-link:focus-visible::before{transform:rotate(45deg) scale(1)}" +
  ".tsf-link:hover::after,.tsf-link:focus-visible::after{transform:scaleX(1);transform-origin:left}" +
  // ticket
  ".tsf-ticket{grid-column:2/7;grid-row:4;position:relative;z-index:1;display:grid;grid-template-columns:var(--nav) minmax(0,1fr);color:var(--tsf-aink)}" +
  ".tsf-stub{position:relative;display:flex;align-items:center;justify-content:center;background-color:var(--tsf-deep);" +
  "background-image:repeating-linear-gradient(135deg,color-mix(in srgb,var(--tsf-aink) 7%,transparent) 0 1px,transparent 1px 5px);transition:transform .35s cubic-bezier(.2,.8,.2,1),filter .3s;transform-origin:100% 100%}" +
  ".tsf-stub::after{content:'';position:absolute;right:0;top:14px;bottom:14px;width:1px;background-image:linear-gradient(to bottom,color-mix(in srgb,var(--tsf-aink) 45%,transparent) 50%,transparent 50%);background-size:1px 7px}" +
  ".tsf-stub:hover{transform:rotate(-1.4deg) translateY(-2px);filter:brightness(1.06)}" +
  ".tsf-stub:active{transform:rotate(-3deg) translateY(3px)}" +
  ".tsf-stub svg{width:clamp(30px,4.2cqw,54px);height:clamp(30px,4.2cqw,54px);max-width:none;transition:transform .7s cubic-bezier(.3,1.5,.4,1)}" +
  ".tsf-stub-tip{position:absolute;left:0;right:0;bottom:12px;text-align:center;font-family:var(--tsf-mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;opacity:0;transform:translateY(4px);transition:opacity .3s,transform .3s}" +
  ".tsf-stub:hover .tsf-stub-tip,.tsf-stub:focus-visible .tsf-stub-tip{opacity:.7;transform:none}" +
  ".tsf-main{position:relative;display:grid;grid-template-columns:var(--rail) minmax(0,1fr) var(--rail) minmax(0,1fr);background:var(--tsf-accent);min-width:0}" +
  ".tsf-stats{grid-column:2;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px;padding:clamp(18px,2.4cqw,32px) 0 clamp(18px,2.3cqw,30px) clamp(12px,2.3cqw,28px)}" +
  ".tsf-stat{display:flex;flex-direction:column;gap:4px;min-width:0}" +
  ".tsf-stat-v{display:flex;align-items:center;gap:10px;font-size:clamp(20px,2.2cqw,31px);line-height:1.1;letter-spacing:-.035em;font-variant-numeric:tabular-nums;white-space:nowrap}" +
  ".tsf-stat-c{font-size:clamp(11.5px,1.12cqw,14.5px);color:color-mix(in srgb,var(--tsf-aink) 62%,transparent)}" +
  ".tsf-status{display:flex;flex-direction:column;gap:4px;border-radius:2px}" +
  ".tsf-pulse{position:relative;flex:none;width:7px;height:7px;background:var(--tsf-aink);transform:rotate(45deg)}" +
  ".tsf-pulse::after{content:'';position:absolute;inset:-3px;border:1px solid var(--tsf-aink);animation:tsf-ping 1.8s cubic-bezier(0,0,.2,1) infinite}" +
  ".tsf-status[aria-pressed='false'] .tsf-pulse{background:transparent;border:1px solid var(--tsf-aink)}" +
  ".tsf-status[aria-pressed='false'] .tsf-pulse::after{display:none}" +
  ".tsf-status:hover .tsf-stat-c{color:var(--tsf-aink)}" +
  ".tsf-gutcell{grid-column:3;border-left:1px solid var(--oline);border-right:1px solid var(--oline)}" +
  ".tsf-blurb{grid-column:4;position:relative;margin:0;padding:clamp(18px,2.4cqw,32px) clamp(12px,2.3cqw,28px) clamp(18px,2.3cqw,30px);font-family:var(--tsf-mono);font-size:clamp(11px,1.06cqw,13.5px);line-height:1.48;text-align:justify;hyphens:none}" +
  ".tsf-word{grid-column:2/-1;position:relative;border-top:1px solid var(--oline);cursor:crosshair;touch-action:pan-y}" +
  ".tsf-word canvas{position:absolute;left:0;top:0;width:100%;height:100%;max-width:none;display:block}" +
  ".tsf-odo{display:inline-flex}" +
  ".tsf-odo-d{display:inline-block;height:1.1em;overflow:hidden}" +
  ".tsf-odo-s{display:flex;flex-direction:column;transition:transform .7s cubic-bezier(.2,.9,.25,1)}" +
  ".tsf-odo-s span{display:block;height:1.1em;line-height:1.1em}" +
  ".tsf-bump{animation:tsf-bump .5s cubic-bezier(.2,.8,.2,1)}" +
  // footer
  ".tsf-foot{grid-column:1/-1;grid-row:6;display:grid;grid-template-columns:var(--rail) var(--nav) var(--rail) minmax(0,1fr) var(--rail) minmax(0,1fr) var(--rail);align-items:center;min-height:clamp(52px,6cqw,76px);font-size:clamp(11px,1cqw,13px)}" +
  ".tsf-copy{grid-column:2/4;padding-left:0;color:color-mix(in srgb,var(--tsf-ink) 88%,transparent);white-space:nowrap}" +
  ".tsf-foot .tsf-dots{--dot:var(--tsf-muted)}" +
  ".tsf-foot-r{grid-column:6;display:flex;align-items:center;gap:clamp(14px,2.6cqw,32px);white-space:nowrap}" +
  ".tsf-foot-r>span{color:var(--tsf-muted)}" +
  ".tsf-foot-r a{position:relative;color:color-mix(in srgb,var(--tsf-ink) 88%,transparent);transition:color .2s}" +
  ".tsf-foot-r a:hover{color:var(--tsf-accent)}" +
  ".tsf-top{grid-column:7;justify-self:center;width:14px;height:14px;display:grid;place-items:center;color:var(--tsf-accent);transition:transform .6s cubic-bezier(.3,1.5,.4,1)}" +
  ".tsf-top svg{width:14px;height:14px;max-width:none}" +
  ".tsf-top:hover{transform:rotate(-90deg) scale(1.25)}" +
  "@keyframes tsf-blink{50%{opacity:0}}" +
  "@keyframes tsf-march{from{-webkit-mask-position:0 0;mask-position:0 0}to{-webkit-mask-position:-200% 0;mask-position:-200% 0}}" +
  "@keyframes tsf-ping{0%{transform:scale(.6);opacity:.9}100%{transform:scale(1.9);opacity:0}}" +
  "@keyframes tsf-bump{0%{transform:translateY(0)}35%{transform:translateY(-3px)}100%{transform:translateY(0)}}" +
  // narrow: one column, index scrolls sideways, ticket stacks
  "@container (max-width: 860px){" +
  ".tsf-grid{grid-template-columns:var(--rail) minmax(0,1fr) var(--rail);grid-template-rows:none;row-gap:0;padding-top:20px}" +
  ".tsf-vl,.tsf-hl{display:none}" +
  ".tsf-nav,.tsf-hero,.tsf-side,.tsf-ticket{grid-column:2;grid-row:auto}" +
  ".tsf-nav{overflow-x:auto;scrollbar-width:none;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}" +
  ".tsf-nav ol{display:flex}" +
  ".tsf-nav li{border-bottom:0;border-right:1px solid var(--line);flex:none}" +
  ".tsf-nav-item{padding:0 12px;white-space:nowrap}" +
  ".tsf-nav-item:hover,.tsf-nav-item[aria-current]{padding-left:12px}" +
  ".tsf-nav-bar{display:none}" +
  ".tsf-nav-item[aria-current]{box-shadow:inset 0 -2px var(--tsf-accent)}" +
  ".tsf-hero{padding-top:28px;padding-bottom:36px}" +
  ".tsf-side{border-top:1px solid var(--line);border-bottom:1px solid var(--line);margin-bottom:24px}" +
  ".tsf-links{padding-left:14px}" +
  ".tsf-ticket{grid-template-columns:clamp(44px,12cqw,72px) minmax(0,1fr)}" +
  ".tsf-stub-tip{display:none}" +
  ".tsf-main{grid-template-columns:minmax(0,1fr)}" +
  ".tsf-stats,.tsf-blurb,.tsf-word{grid-column:1}" +
  ".tsf-stats{padding-left:16px;padding-right:16px}" +
  ".tsf-gutcell{display:none}" +
  ".tsf-blurb{border-top:1px solid var(--oline);padding-left:16px;padding-right:16px}" +
  ".tsf-foot{grid-column:1/-1;grid-row:auto;display:flex;flex-wrap:wrap;gap:12px 20px;padding:20px var(--rail)}" +
  ".tsf-foot-r{flex:1;flex-wrap:wrap;gap:12px 20px}" +
  ".tsf-foot-r .tsf-dots{display:none}" +
  "}";

// ── Diamond mark (brand icon) ─────────────────────────────────────────────────

const Mark = ({ className, style }) => (
  <svg viewBox="0 0 48 48" className={className} style={style} aria-hidden="true" focusable="false">
    <path fillRule="evenodd" fill="currentColor" d="M24 1.5 46.5 24 24 46.5 1.5 24Z M19.5 15.5 32 24 19.5 32.5Z" />
  </svg>
);

// ── Reduced motion helper ─────────────────────────────────────────────────────

const useReducedMotion = () => {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    if (typeof matchMedia === "undefined") return;
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const onMq = () => setReduced(mq.matches);
    onMq();
    mq.addEventListener("change", onMq);
    return () => mq.removeEventListener("change", onMq);
  }, []);
  return reduced;
};

// ── Rolling odometer ──────────────────────────────────────────────────────────

const Odometer = ({ value }) => {
  const s = formatCount(value);
  return (
    <span className="tsf-odo" aria-hidden="true">
      {s.split("").map((ch, i) =>
        /\d/.test(ch) ? (
          <span className="tsf-odo-d" key={s.length - i}>
            <span className="tsf-odo-s" style={{ transform: "translateY(" + -Number(ch) * 10 + "%" }}>
              {"0123456789".split("").map((d) => (
                <span key={d}>{d}</span>
              ))}
            </span>
          </span>
        ) : (
          <span key={"s" + (s.length - i)}>{ch}</span>
        ),
      )}
    </span>
  );
};

// ── Typewriter eyebrow ────────────────────────────────────────────────────────

const Eyebrow = ({ phrases, reduced, visible }) => {
  const [ms, setMs] = React.useState(0);
  const msRef = React.useRef(0);
  React.useEffect(() => {
    if (reduced || !visible) return;
    const t0 = performance.now() - msRef.current;
    const id = setInterval(() => {
      msRef.current = performance.now() - t0;
      setMs(msRef.current);
    }, 40);
    return () => clearInterval(id);
  }, [reduced, visible]);
  const text = reduced ? phrases[0] ?? "" : typeFrame(phrases, ms).text;
  return (
    <div className="tsf-eyebrow">
      <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false">
        <path d="M6 1 11 6 6 11 1 6Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <span className="sr-only">{phrases[0]}</span>
      <span className="tsf-type" aria-hidden="true">
        {text}
        {!reduced && <span className="tsf-caret" />}
      </span>
      <span className="tsf-dots" aria-hidden="true" />
    </div>
  );
};

// ── Halftone wordmark (canvas) ────────────────────────────────────────────────

const Wordmark = ({ word, fontSerif, weight, color, halftone, reduced, visible }) => {
  const boxRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const [height, setHeight] = React.useState(null);
  const st = React.useRef({
    lens: 0,
    lensTarget: 0,
    lx: 0,
    ly: 0,
    rings: [],
    reveal: 0,
    rot: 0,
    rotTarget: 0,
    time: 0,
    kick: () => {},
  });

  /* Replace dotless i so the dot renders as a diamond. */
  const iAt = word.indexOf("i");
  const shown = iAt > -1 ? word.slice(0, iAt) + "ı" + word.slice(iAt + 1) : word;

  React.useEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas && canvas.getContext("2d");
    if (!box || !canvas || !ctx) return;
    const s = st.current;
    const g = { w: 1, h: 1, dpr: 1, font: "", size: 0, track: 0, x0: 0, base: 0, dx: 0, dy: 0, dr: 0, cell: 6 };

    const setFont = (px, track) => {
      ctx.font = weight + " " + px + "px " + fontSerif;
      ctx.letterSpacing = track.toFixed(2) + "px";
    };

    const measure = () => {
      const w = box.clientWidth;
      if (!w) return;
      setFont(100, -3);
      const m100 = ctx.measureText(shown);
      const ink100 = m100.actualBoundingBoxLeft + m100.actualBoundingBoxRight || m100.width;
      const fitVal = fitWord(ink100, m100.actualBoundingBoxAscent || 72, w * 0.995, w * MAX_CAP, shown.length);
      const size = fitVal.size || 1;
      g.size = size;
      g.track = -0.03 * size;
      if (fitVal.extra) {
        setFont(size, g.track);
        const m0 = ctx.measureText(shown);
        const ink0 = m0.actualBoundingBoxLeft + m0.actualBoundingBoxRight;
        if (shown.length > 1 && ink0 > 0) g.track += (w * 0.995 - ink0) / (shown.length - 1);
      }
      setFont(size, g.track);
      g.font = ctx.font;
      const m = ctx.measureText(shown);
      const asc = m.actualBoundingBoxAscent || size * 0.72;
      g.x0 = m.actualBoundingBoxLeft;
      g.dr = 0;
      let top = asc;
      if (iAt > -1) {
        const pre = ctx.measureText(shown.slice(0, iAt)).width;
        const iw = ctx.measureText("ı").width - g.track;
        const xh = ctx.measureText("x").actualBoundingBoxAscent || size * 0.5;
        g.dr = size * 0.085;
        g.dx = g.x0 + pre + iw / 2;
        g.dy = xh + g.dr * 1.55;
        top = Math.max(top, g.dy + g.dr * 1.05);
      }
      const h = Math.ceil(top + size * 0.05);
      g.base = h + size * 0.01;
      g.dy = g.base - g.dy;
      g.w = w;
      g.h = h;
      g.dpr = Math.min(2, window.devicePixelRatio || 1);
      g.cell = Math.max(3.5, Math.min(9, w / 170));
      canvas.width = Math.round(w * g.dpr);
      canvas.height = Math.round(h * g.dpr);
      setHeight(prev => (prev !== null && Math.abs(prev - h) < 0.5 ? prev : h));
      draw();
    };

    const draw = () => {
      const { w, h, dpr, cell } = g;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, w, h);
      ctx.letterSpacing = g.track.toFixed(2) + "px";
      ctx.font = g.font;
      ctx.textBaseline = "alphabetic";
      if (halftone) {
        const tone = {
          fade: 0.44, depth: 0.84,
          lensX: s.lx, lensY: s.ly, lensR: w * 0.09, lens: s.lens * 0.95,
          reveal: s.reveal, wave: reduced ? 0 : 0.06, time: s.time,
          rings: s.rings, ringW: w * 0.02,
        };
        ctx.beginPath();
        const half = cell / 2;
        for (let j = 0, y = half; y < h + half; j++, y += cell) {
          const off = j % 2 ? half : 0;
          for (let x = off; x < w + half; x += cell) {
            /* Coverage calculation */
            const ny = y / h;
            let c = 1 - smoothstep(tone.fade, 1.04, ny) * tone.depth;
            if (tone.wave) c += tone.wave * Math.sin((x / w) * 11 + tone.time * 1.3 + ny * 4) * smoothstep(tone.fade - 0.1, 1, ny);
            if (tone.lens > 0) {
              const dx = x - tone.lx;
              const dy = y - tone.ly;
              c *= 1 - tone.lens * Math.exp(-(dx * dx + dy * dy) / (tone.lensR * tone.lensR));
            }
            for (const rg of tone.rings) {
              const d = Math.hypot(x - rg.x, y - rg.y) - rg.r;
              c *= 1 - rg.a * Math.exp(-(d * d) / (tone.ringW * tone.ringW));
            }
            c *= clamp01(tone.reveal * 1.6 - (x / w) * 0.6);
            c = clamp01(c);
            if (c < 0.01) continue;
            if (c > 0.995) { ctx.rect(x - half - 0.3, y - half - 0.3, cell + 0.6, cell + 0.6); continue; }
            const dotR = cell * 0.66 * Math.sqrt(clamp01(c));
            ctx.moveTo(x + dotR, y);
            ctx.arc(x, y, dotR, 0, Math.PI * 2);
          }
        }
        ctx.fillStyle = "#000";
        ctx.fill();
        ctx.globalCompositeOperation = "source-in";
      }
      ctx.fillStyle = color;
      ctx.fillText(shown, g.x0, g.base);
      ctx.globalCompositeOperation = "source-over";
      if (g.dr > 0) {
        const a = Math.min(1, s.reveal * 1.6 - (g.dx / w) * 0.6);
        if (a > 0) {
          ctx.save();
          ctx.globalAlpha = halftone ? clamp01(a) : 1;
          ctx.translate(g.dx, g.dy);
          ctx.rotate(s.rot);
          ctx.beginPath();
          ctx.moveTo(0, -g.dr);
          ctx.lineTo(g.dr, 0);
          ctx.lineTo(0, g.dr);
          ctx.lineTo(-g.dr, 0);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      }
    };

    let raf = 0;
    let last = 0;
    const loop = (now) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      s.time += dt;
      if (reduced || !halftone) {
        s.reveal = 1;
        s.lens = s.lensTarget;
        s.rot = s.rotTarget;
        s.rings = [];
      } else {
        s.reveal = Math.min(1, s.reveal + dt / 1.5);
        s.lens += (s.lensTarget - s.lens) * (1 - Math.exp(-dt * 7));
        s.rot += (s.rotTarget - s.rot) * (1 - Math.exp(-dt * 6));
        for (const rg of s.rings) {
          rg.r += g.w * 0.75 * dt;
          rg.a *= Math.exp(-dt * 1.4);
        }
        s.rings = s.rings.filter((rg) => rg.a > 0.02);
      }
      draw();
      const busy = !reduced && halftone && visible;
      raf = busy ? requestAnimationFrame(loop) : 0;
      if (!busy) last = 0;
    };
    s.kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(measure);
    ro.observe(box);
    measure();
    let alive = true;
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => alive && measure());
    if (visible || reduced || !halftone) s.kick();
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      raf = 0;
      ro.disconnect();
    };
  }, [shown, iAt, fontSerif, weight, color, halftone, reduced, visible]);

  const local = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  };
  const onMove = (e) => {
    const s = st.current;
    const [x, y] = local(e);
    s.lx = x;
    s.ly = y;
    s.lensTarget = halftone && e.pointerType !== "touch" ? 1 : 0;
    s.kick();
  };
  const onLeave = () => { st.current.lensTarget = 0; st.current.kick(); };
  const onClick = (e) => {
    const s = st.current;
    const r = e.currentTarget.getBoundingClientRect();
    if (halftone && !reduced) s.rings.push({ x: e.clientX - r.left, y: e.clientY - r.top, r: 0, a: 0.9 });
    s.rotTarget += Math.PI / 2;
    s.kick();
  };

  return (
    <div
      ref={boxRef}
      className="tsf-word"
      style={{ height: height === null ? undefined : height, aspectRatio: height === null ? "1000 / 240" : undefined }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onClick={onClick}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

// ── Social icon helpers ───────────────────────────────────────────────────────

const SocialIcon = ({ children, href, label }) => {
  const targetProps = href ? { as: "a", href } : { as: "button", type: "button" };
  const props = {
    ...targetProps,
    className: "inline-flex items-center justify-center w-8 h-8 rounded-full border border-[var(--tsf-aink)]/20 text-[var(--tsf-aink)]/50 hover:text-[var(--tsf-aink)]/80 hover:border-[var(--tsf-aink)]/40 hover:scale-110 transition-all cursor-pointer",
    "aria-label": label,
    target: "_blank",
    rel: "noopener noreferrer",
    ...(href ? {} : { onClick: (e) => e.preventDefault() }),
  };
  return (
    <span {...props}>
      {children}
    </span>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

const TicketStubFooter = ({
  brand = "Studly",
  wordmark,
  company = "Studly",
  year = 2026,
  sections = DEFAULT_SECTIONS,
  defaultSection = 0,
  onSectionChange,
  eyebrow = EYEBROW_PHRASES,
  headline = ["The place for\neverything you're learning."],
  description,
  cta = { label: "Get started" },
  onCtaClick,
  linkGroups = LINK_GROUPS,
  count = 0,
  countLabel = "Sessions completed",
  rate = 0.4,
  blurb,
  legal = [
    { label: "© " + year + " " + company + ". All rights reserved." },
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
    { label: "Cookies", href: "/cookie-policy" },
  ],
  onDispatch,
  background = "#fffcf0",
  ink = "#141414",
  muted = "#726f6c",
  accent = "#ff6d36",
  accentDeep = "#f5edd5",
  accentInk = "#141414",
  fontSans = SANS,
  fontSerif = SERIF,
  fontMono = MONO,
  serifWeight = 500,
  halftone = true,
  className = "",
}) => {
  const rootRef = React.useRef(null);
  const reduced = useReducedMotion();
  const [visible, setVisible] = React.useState(false);
  const [seen, setSeen] = React.useState(false);
  const [total, setTotal] = React.useState(count);
  const [pulse, setPulse] = React.useState(0);
  const totalRef = React.useRef(count);
  totalRef.current = total;

  const word = wordmark ?? brand;
  const text = description ?? "Connect your notes, create a learning path, study one part at a time, test yourself, and keep going until it sticks.";

  /* Intersection observer for triggering animations on scroll. */
  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
        if (e.isIntersecting) setSeen(true);
      },
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Rolling counter while visible (sessions completed). */
  React.useEffect(() => {
    if (!(visible && rate > 0)) return;
    let id = 0;
    const step = () => {
      const t = nextTick(rate);
      id = window.setTimeout(() => {
        setTotal((v) => v + t.add);
        step();
      }, t.delay);
    };
    step();
    return () => clearTimeout(id);
  }, [visible, rate]);

  const toTop = () => rootRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  const hold = (href) => (e) => {
    if (!href || href === "#") e.preventDefault();
  };

  const vars = {
    "--tsf-bg": background,
    "--tsf-ink": ink,
    "--tsf-muted": muted,
    "--tsf-accent": accent,
    "--tsf-deep": accentDeep,
    "--tsf-aink": accentInk,
    "--tsf-sans": fontSans,
    "--tsf-mono": fontMono,
  };

  const stubClip = chamfer(9, 9, 9, 9);
  const mainClip = chamfer(9, 9, 9, 9);

  return (
    <section
      ref={rootRef}
      className={"tsf w-full " + className}
      style={vars}
      data-seen={seen || reduced ? "1" : "0"}
      aria-label={brand}
    >
      <style>{CSS}</style>
      <div className="tsf-grid">
        {/* Vertical guide rails. */}
        {[2, 3, 4, 5, 6, 7].map((c) => (
          <span key={"v" + c} className="tsf-vl" style={{ gridColumn: c }} aria-hidden="true" />
        ))}
        {/* Horizontal guide rails. */}
        {[2, 3, 4, 5, 6].map((r) => (
          <span key={"h" + r} className="tsf-hl" style={{ gridRow: r }} aria-hidden="true" />
        ))}

        {/* ── Hero section ──────────────────────────────────────────── */}
        <div className="tsf-hero">
          <Eyebrow phrases={eyebrow} reduced={reduced} visible={visible} />
          <h2 className="tsf-h">
            {headline.map((line, i) => (
              <span key={i}>
                <span style={{ transitionDelay: (0.12 + i * 0.1) + "s" }}>{line}</span>
              </span>
            ))}
          </h2>
          <p className="tsf-p">{text}</p>
          <a
            href={cta.href ?? "#"}
            className="tsf-cta"
            style={{ clipPath: chamfer(0, 0, 12, 0) }}
            onClick={(e) => { hold(cta.href)(e); setPulse((p) => p + 1); onCtaClick?.(); }}
          >
            <span>{cta.label}</span>
            <svg viewBox="0 0 14 14" aria-hidden="true" focusable="false">
              <path d="M1 7h11M7.5 2.5 12 7l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </a>
        </div>

        {/* ── Ticket stub ───────────────────────────────────────────── */}
        <div className="tsf-ticket" style={{ clipPath: stubClip }}>
          {/* Decorative stub with brand mark and social links. */}
          <div className="tsf-stub" style={{ clipPath: stubClip }}>
            <Mark className="size-6 text-[var(--tsf-aink)]/[.65]" />
            <div className="absolute left-0 right-0 bottom-3 flex items-center justify-center gap-2">
              <SocialIcon href="#" label="Discord">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.036c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.036A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.318.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.096.246.196.373.318a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.158-1.085-2.158-2.419 0-1.333.956-2.419 2.158-2.419 1.21 0 2.176 1.096 2.158 2.42 0 1.333-.956 2.418-2.158 2.418zm7.975 0c-1.183 0-2.158-1.085-2.158-2.419 0-1.333.955-2.419 2.158-2.419 1.21 0 2.176 1.096 2.158 2.42 0 1.333-.947 2.418-2.158 2.418z"/></svg>
              </SocialIcon>
              <SocialIcon href="#" label="Twitter / X">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </SocialIcon>
              <SocialIcon href="#" label="LinkedIn">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </SocialIcon>
            </div>
            <span className="tsf-stub-tip">Click me</span>
          </div>
          {/* Main content area */}
          <div className="tsf-main" style={{ clipPath: mainClip }}>
            {/* Stats */}
            <div className="tsf-stats">
              <div className="tsf-stat">
                <span className="tsf-stat-v">
                  <span className="tsf-pulse" />
                  <Odometer value={total} />
                </span>
                <span className="tsf-stat-c">{countLabel}</span>
              </div>
              <div className="tsf-stat">
                <span className="tsf-stat-v" style={{ fontSize: "clamp(16px,1.6cqw,22px)" }}>
                  50+
                </span>
                <span className="tsf-stat-c">Topics covered</span>
              </div>
            </div>
            {/* Gutters */}
            <div className="tsf-gutcell" aria-hidden="true" />
            {/* Interactive wordmark */}
            <Wordmark
              word={word}
              fontSerif={fontSerif}
              weight={serifWeight}
              color={accentInk}
              halftone={halftone}
              reduced={reduced}
              visible={visible}
            />
          </div>
        </div>

        {/* ── Bottom footer row ─────────────────────────────────────── */}
        <div className="tsf-foot">
          <span className="tsf-copy">&copy; {year} {company}. All rights reserved.</span>
          <span className="tsf-dots" aria-hidden="true" />
          <span className="tsf-foot-r">
            {legal.map((l) =>
              l.href ? (
                <a key={l.label} href={l.href} onClick={hold(l.href)}>
                  {l.label}
                </a>
              ) : (
                <span key={l.label}>{l.label}</span>
              ),
            )}
          </span>
          <button className="tsf-top" onClick={toTop} aria-label="Back to top" title="Back to top">
            <svg viewBox="0 0 14 14" aria-hidden="true" focusable="false">
              <path d="M7 12V2M7 2 2 7M7 2l5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default TicketStubFooter;
