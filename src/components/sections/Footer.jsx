import React from "react";

/*
 * Footer — minimal orange ticket stub with halftone wordmark.
 *
 * Trimmed down from a larger ticket-stub footer: removed hero copy,
 * navigation rail, link groups, social orbit, bottom legal row.
 * Kept every animation on the orange part (halftone wordmark canvas,
 * odometer, pulse indicator, diamond-dot interaction).
 */

// ── Utilities (pure functions, no dependencies) ──────────────────────────────

const clamp01 = (v) => (v > 0 ? (v > 1 ? 1 : v) : 0);

/** 12745012 → "12,745,012". Handles non-finite, negative or zero gracefully. */
const formatCount = (n, sep = ",") => {
  const v = Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
};

/** Clip polygon with four corners cut: top-left, top-right, bottom-right, bottom-left (px). */
const chamfer = (tl, tr, br, bl) =>
  "polygon(" +
  [
    tl + "px 0",
    "calc(100% - " + tr + "px) 0",
    "100% " + tr + "px",
    "100% calc(100% - " + br + "px)",
    "calc(100% - " + br + "px) 100%",
    bl + "px 100%",
    "0 calc(100% - " + bl + "px)",
    "0 " + tl + "px",
  ].join(", ") +
  ")";

/** Max ascender height as fraction of wordmark width. */
const MAX_CAP = 0.2;

/** Smoothstep easing between two edges. */
const smoothstep = (edge0, edge1, x) => {
  if (edge0 === edge1) return x < edge0 ? 0 : 1;
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

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

// ── Constants ─────────────────────────────────────────────────────────────────

const MONO = '"JetBrains Mono", "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

// ── Inline CSS ────────────────────────────────────────────────────────────────

const CSS =
  ".tsf{position:relative;background:var(--tsf-bg);color:var(--tsf-ink);font-family:var(--tsf-sans);overflow:visible;isolation:isolate;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}" +
  ".tsf *,.tsf *::before,.tsf *::after{box-sizing:border-box}" +
  ":where(.tsf) a{color:inherit;text-decoration:none}" +
  ":where(.tsf) button{font:inherit;color:inherit;background:none;border:0;padding:0;margin:0;cursor:pointer;text-align:inherit}" +
  ":where(.tsf) :focus-visible{outline:1px solid var(--tsf-accent);outline-offset:3px}" +
  // main container
  ".tsf-wrap{position:relative;max-width:1080px;margin:0 auto;padding:clamp(40px,6cqw,80px) clamp(16px,3cqw,40px)}" +
  // orange panel
  ".tsf-panel{position:relative;background:var(--tsf-accent);border-radius:12px;overflow:hidden}" +
  ".tsf-stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px;padding:clamp(24px,4cqw,48px) clamp(16px,3cqw,32px)}" +
  ".tsf-stat{display:flex;flex-direction:column;gap:4px;min-width:0}" +
  ".tsf-stat-v{display:flex;align-items:center;gap:10px;font-size:clamp(20px,2.2cqw,31px);line-height:1.1;letter-spacing:-.035em;font-variant-numeric:tabular-nums;white-space:nowrap}" +
  ".tsf-stat-c{font-size:clamp(11.5px,1.12cqw,14.5px);color:color-mix(in srgb,var(--tsf-aink) 62%,transparent)}" +
  ".tsf-pulse{position:relative;flex:none;width:7px;height:7px;background:var(--tsf-aink);transform:rotate(45deg)}" +
  ".tsf-pulse::after{content:'';position:absolute;inset:-3px;border:1px solid var(--tsf-aink);animation:tsf-ping 1.8s cubic-bezier(0,0,.2,1) infinite}" +
  ".tsf-word{position:relative;border-top:1px solid color-mix(in srgb,var(--tsf-aink) 20%,transparent);min-height:120px}" +
  ".tsf-word canvas{position:absolute;left:0;top:0;width:100%;height:100%;max-width:none;display:block}" +
  ".tsf-odo{display:inline-flex}" +
  ".tsf-odo-d{display:inline-block;height:1.1em;overflow:hidden}" +
  ".tsf-odo-s{display:flex;flex-direction:column;transition:transform .7s cubic-bezier(.2,.9,.25,1)}" +
  ".tsf-odo-s span{display:block;height:1.1em;line-height:1.1em}" +
  ".tsf-bump{animation:tsf-bump .5s cubic-bezier(.2,.8,.2,1)}" +
  "@keyframes tsf-ping{0%{transform:scale(.6);opacity:.9}100%{transform:scale(1.9);opacity:0}}" +
  "@keyframes tsf-bump{0%{transform:translateY(0)}35%{transform:translateY(-3px)}100%{transform:translateY(0)}}";

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

  return (
    <div
      ref={boxRef}
      className="tsf-word"
      style={{ height: height === null ? undefined : height, aspectRatio: height === null ? "1000 / 240" : undefined }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

const TicketStubFooter = ({
  brand = "Studly",
  wordmark,
  count = 0,
  countLabel = "Sessions completed",
  rate = 0.4,
  background = "#fffcf0",
  ink = "#141414",
  muted = "#726f6c",
  accent = "#ff6d36",
  accentDeep = "#f5edd5",
  accentInk = "#141414",
  fontSans = '"Neue Montreal", "Inter Tight", Inter, "Helvetica Neue", Helvetica, Arial, sans-serif',
  fontSerif = '"GT Super Display", Canela, Didot, "Bodoni 72", "Iowan Old Style", "Palatino Linotype", Georgia, "Times New Roman", serif',
  fontMono = MONO,
  serifWeight = 500,
  halftone = false, // Disable halftone animation by default
  className = "",
}) => {
  const rootRef = React.useRef(null);
  const reduced = useReducedMotion();
  const [visible, setVisible] = React.useState(false);
  const [total, setTotal] = React.useState(count);

  const word = wordmark ?? brand;

  /* Intersection observer for triggering animations on scroll. */
  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
        if (e.isIntersecting) {
          setTotal(count); // reset from prop when it scrolls into view
        }
      },
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [count]);

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

  return (
    <section
      ref={rootRef}
      className={"tsf w-full " + className}
      style={vars}
      aria-label={brand}
    >
      <style>{CSS}</style>
      <div className="tsf-wrap">
        <div className="tsf-panel">
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
          {/* Wordmark */}
          <div className="tsf-word">
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
      </div>
    </section>
  );
};

export default TicketStubFooter;
