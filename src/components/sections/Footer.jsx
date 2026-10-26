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
  ".tsf{position:relative;container-type:inline-size;background:var(--tsf-bg);color:var(--tsf-ink);font-family:var(--tsf-sans);overflow:visible;isolation:isolate;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}" +
  ".tsf *,.tsf *::before,.tsf *::after{box-sizing:border-box}" +
  ":where(.tsf) a{color:inherit;text-decoration:none}" +
  ":where(.tsf) button{font:inherit;color:inherit;background:none;border:0;padding:0;margin:0;cursor:pointer;text-align:inherit}" +
  ":where(.tsf) :focus-visible{outline:1px solid var(--tsf-accent);outline-offset:3px}" +
  // grid scaffold — vertical guide rails
  ".tsf-grid{--rail:clamp(16px,2.5cqw,36px);--nav:clamp(116px,12.5cqw,180px);--line:color-mix(in srgb,var(--tsf-ink) 11%,transparent);--oline:color-mix(in srgb,var(--tsf-aink) 16%,transparent);position:relative;display:grid;" +
  "grid-template-columns:var(--rail) var(--nav) var(--rail) minmax(0,1fr) var(--rail) minmax(0,1fr) var(--rail);" +
  "grid-template-rows:auto auto var(--rail) auto}" +
  ".tsf-vl{grid-row:1/-1;justify-self:start;width:0;border-left:1px solid var(--line);pointer-events:none}" +
  // ticket stub
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
  ".tsf-pulse{position:relative;flex:none;width:7px;height:7px;background:var(--tsf-aink);transform:rotate(45deg)}" +
  ".tsf-pulse::after{content:'';position:absolute;inset:-3px;border:1px solid var(--tsf-aink);animation:tsf-ping 1.8s cubic-bezier(0,0,.2,1) infinite}" +
  ".tsf-gutcell{grid-column:3;border-left:1px solid var(--oline);border-right:1px solid var(--oline)}" +
  ".tsf-word{grid-column:2/-1;position:relative;border-top:1px solid var(--oline);cursor:crosshair;touch-action:pan-y}" +
  ".tsf-word canvas{position:absolute;left:0;top:0;width:100%;height:100%;max-width:none;display:block}" +
  ".tsf-odo{display:inline-flex}" +
  ".tsf-odo-d{display:inline-block;height:1.1em;overflow:hidden}" +
  ".tsf-odo-s{display:flex;flex-direction:column;transition:transform .7s cubic-bezier(.2,.9,.25,1)}" +
  ".tsf-odo-s span{display:block;height:1.1em;line-height:1.1em}" +
  ".tsf-bump{animation:tsf-bump .5s cubic-bezier(.2,.8,.2,1)}" +
  "@keyframes tsf-ping{0%{transform:scale(.6);opacity:.9}100%{transform:scale(1.9);opacity:0}}" +
  "@keyframes tsf-bump{0%{transform:translateY(0)}35%{transform:translateY(-3px)}100%{transform:translateY(0)}}" +
  // narrow: ticket stacks into single column
  "@container (max-width: 860px){" +
  ".tsf-grid{grid-template-columns:var(--rail) minmax(0,1fr) var(--rail)}" +
  ".tsf-vl{display:none}" +
  ".tsf-ticket{grid-column:2;grid-row:auto;grid-template-columns:clamp(44px,12cqw,72px) minmax(0,1fr)}" +
  ".tsf-stub-tip{display:none}" +
  ".tsf-main{grid-template-columns:minmax(0,1fr)}" +
  ".tsf-stats,.tsf-word{grid-column:1}" +
  ".tsf-stats{padding-left:16px;padding-right:16px}" +
  ".tsf-gutcell{display:none}" +
  "}";

// ── Diamond mark (brand icon) ────────────────────────────────────────────────

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
  halftone = true,
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

  const stubClip = chamfer(9, 9, 9, 9);

  return (
    <section
      ref={rootRef}
      className={"tsf w-full " + className}
      style={vars}
      aria-label={brand}
    >
      <style>{CSS}</style>
      <div className="tsf-grid">
        {/* Vertical guide rails. */}
        {[2, 3, 4, 5, 6, 7].map((c) => (
          <span key={"v" + c} className="tsf-vl" style={{ gridColumn: c }} aria-hidden="true" />
        ))}

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
          <div className="tsf-main" style={{ clipPath: stubClip }}>
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
      </div>
    </section>
  );
};

export default TicketStubFooter;
