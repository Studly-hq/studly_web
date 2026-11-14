import { motion, useReducedMotion } from "framer-motion";

/**
 * PaywallArtwork
 *
 * A small editorial scene for the upgrade interstitial: a stack of notes with
 * the next one held behind a lock. Built from flat shapes and hairlines so it
 * sits inside the cream product language without shadows or glows. All ink is
 * `currentColor` and all fills use the card token, so it inverts with the
 * theme instead of staying cream in dark mode.
 */
const EASE = [0.16, 1, 0.3, 1];

const NoteCard = ({ y, rotate, delay, children, dim = false }) => (
  <motion.g
    initial={{ opacity: 0, y: y + 14 }}
    animate={{ opacity: 1, y }}
    transition={{ duration: 0.6, delay, ease: EASE }}
    style={{ transformOrigin: "130px 150px" }}
  >
    <g transform={`rotate(${rotate} 130 150)`}>
      <rect
        x="52"
        y="70"
        width="156"
        height="96"
        rx="12"
        className="fill-card"
        fillOpacity={dim ? 0.55 : 1}
        stroke="currentColor"
        strokeOpacity={dim ? 0.14 : 0.22}
      />
      {children}
    </g>
  </motion.g>
);

const PaywallArtwork = () => {
  const reduce = useReducedMotion();

  return (
    <div className="relative flex h-full min-h-[240px] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#fdf0e8] dark:bg-[#241a14]">
      <svg
        viewBox="0 0 260 300"
        className="h-full w-full max-w-[300px] text-[#141414] dark:text-[#f6f0e4]"
        role="img"
        aria-label="A locked note waiting to be unlocked"
      >
        {/* Orbit rings */}
        <motion.g
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 90, ease: "linear", repeat: Infinity }}
          style={{ transformOrigin: "130px 150px" }}
        >
          <circle
            cx="130"
            cy="150"
            r="104"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.14"
            strokeDasharray="2 8"
          />
        </motion.g>
        <circle cx="130" cy="150" r="76" fill="currentColor" fillOpacity="0.04" />

        {/* Back cards */}
        <NoteCard y={0} rotate={-9} delay={0.12} dim>
          <rect x="72" y="94" width="70" height="7" rx="3.5" fill="currentColor" fillOpacity="0.18" />
          <rect x="72" y="112" width="112" height="5" rx="2.5" fill="currentColor" fillOpacity="0.1" />
          <rect x="72" y="126" width="92" height="5" rx="2.5" fill="currentColor" fillOpacity="0.1" />
        </NoteCard>

        <NoteCard y={0} rotate={6} delay={0.2} dim>
          <rect x="70" y="94" width="54" height="7" rx="3.5" fill="currentColor" fillOpacity="0.18" />
          <rect x="70" y="112" width="116" height="5" rx="2.5" fill="currentColor" fillOpacity="0.1" />
          <rect x="70" y="126" width="74" height="5" rx="2.5" fill="currentColor" fillOpacity="0.1" />
        </NoteCard>

        {/* Front card */}
        <NoteCard y={0} rotate={0} delay={0.28}>
          <rect x="68" y="88" width="42" height="42" rx="12" fill="#ff4500" fillOpacity="0.12" />
          <motion.g
            animate={reduce ? undefined : { y: [0, -2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <rect
              x="78"
              y="100"
              width="22"
              height="18"
              rx="4"
              fill="none"
              stroke="#ff4500"
              strokeWidth="2.4"
            />
            <path
              d="M83 100v-4a6 6 0 0 1 12 0v4"
              fill="none"
              stroke="#ff4500"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </motion.g>
          <rect x="120" y="92" width="62" height="8" rx="4" fill="currentColor" fillOpacity="0.7" />
          <rect x="120" y="108" width="44" height="5" rx="2.5" fill="currentColor" fillOpacity="0.18" />
          <rect x="68" y="142" width="124" height="5" rx="2.5" fill="currentColor" fillOpacity="0.1" />
        </NoteCard>

        {/* Floating ticket */}
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5, ease: EASE }}
        >
          <motion.g
            animate={reduce ? undefined : { y: [0, -6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <rect x="168" y="196" width="64" height="40" rx="10" fill="currentColor" />
            <circle cx="188" cy="216" r="8" fill="none" className="stroke-background" strokeOpacity="0.5" />
            <path
              d="M184.5 216l2.6 2.8 5-5.6"
              fill="none"
              className="stroke-background"
              strokeOpacity="0.9"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect x="202" y="208" width="22" height="4" rx="2" className="fill-background" fillOpacity="0.75" />
            <rect x="202" y="218" width="16" height="4" rx="2" className="fill-background" fillOpacity="0.35" />
          </motion.g>
        </motion.g>

        {/* Small accent dots */}
        <circle cx="46" cy="206" r="5" fill="#ff4500" fillOpacity="0.75" />
        <circle cx="222" cy="86" r="3.5" fill="currentColor" fillOpacity="0.25" />
        <circle cx="62" cy="60" r="2.5" fill="currentColor" fillOpacity="0.18" />
      </svg>
    </div>
  );
};

export default PaywallArtwork;
