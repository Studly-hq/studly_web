import { useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight02Icon,
  Book02Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  FileUploadIcon,
  Timer01Icon,
} from "@hugeicons/core-free-icons";
import { useUI } from "../../context/UIContext";

const EASE = [0.16, 1, 0.3, 1];

/**
 * PaywallModal
 *
 * The single "you need Pro" interstitial. It never sells or charges: it
 * explains the specific wall the person just hit, then hands them to
 * /billing where the real checkout, period and payment history live.
 */
const VARIANTS = {
  upload: {
    title: "You have used your free note",
    body: "",
    meta: "Uploads",
  },
  ai: {
    title: "You have used your AI actions for this hour",
    body: "Free accounts get 20 AI actions every hour. Pro raises that to 60, so explanations, summaries and quizzes keep flowing.",
    meta: "AI actions",
  },
  feature: {
    title: "This study tool is part of Pro",
    body: "50 question quizzes and 50 card decks unlock with Pro, along with unlimited notes and the full AI tutor.",
    meta: "Study tools",
  },
  expired: {
    title: "Your Pro access has ended",
    body: "Renew for another 30 days to bring back unlimited uploads, your AI tutor, quiz generation and every saved note.",
    meta: "Renewal",
  },
  generic: {
    title: "Study without limits",
    body: "",
    meta: "Upgrade",
  },
};

/** Lucid sends several fine grained reasons. Collapse them to one variant. */
const normaliseReason = (reason) => {
  if (!reason) return "generic";
  if (["upload", "upload_text", "limit_reached"].includes(reason)) return "upload";
  if (["ai", "topic_extraction", "ai_limit"].includes(reason)) return "ai";
  if (["plan_expired", "expired"].includes(reason)) return "expired";
  if (["study_upsell", "feature", "pro_feature"].includes(reason)) return "feature";
  return "generic";
};

const BENEFITS = [
  { icon: FileUploadIcon, label: "Unlimited note uploads" },
  { icon: Timer01Icon, label: "60 AI actions every hour" },
  { icon: Book02Icon, label: "Paths, quizzes and flashcards" },
];

const PaywallModal = () => {
  const { showUpgradeModal, upgradeReason, closePaywall } = useUI();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const panelRef = useRef(null);

  const variantKey = normaliseReason(upgradeReason);
  const variant = VARIANTS[variantKey] || VARIANTS.generic;
  const reason = useMemo(() => variantKey, [variantKey]);

  // Escape to dismiss, focus the panel, and lock background scroll while open.
  useEffect(() => {
    if (!showUpgradeModal) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => panelRef.current?.focus(), 40);

    const onKeyDown = (event) => {
      if (event.key === "Escape") closePaywall();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [showUpgradeModal, closePaywall]);

  if (!showUpgradeModal) return null;

  const goToBilling = () => {
    closePaywall();
    navigate(`/billing?reason=${reason}`);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center bg-black/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closePaywall();
      }}
    >
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="paywall-title"
        tabIndex={-1}
        initial={{ opacity: 0, y: reduce ? 0 : 24, scale: reduce ? 1 : 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.34, ease: EASE }}
        className="relative w-full max-w-[520px] overflow-hidden rounded-t-[26px] border border-border bg-card text-foreground outline-none sm:rounded-[26px]"
      >
        {/* Desktop close button — top right of the card */}
        <button
          type="button"
          onClick={closePaywall}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 hidden size-8 items-center justify-center rounded-full border border-border bg-card/70 text-foreground/60 backdrop-blur-sm transition-colors hover:bg-secondary hover:text-foreground sm:flex"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={1.8} />
        </button>

        <div className="flex flex-col p-6 sm:p-8 md:p-10">
          {/* Mobile close */}
          <div className="flex items-center justify-end md:hidden mb-4">
            <button
              type="button"
              onClick={closePaywall}
              aria-label="Close"
              className="-mr-1 flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={1.8} />
            </button>
          </div>

          <h2
            id="paywall-title"
            className="mt-6 max-w-[22ch] font-heading text-[26px] font-medium leading-[1.12] tracking-[-0.025em] sm:text-[32px] md:text-[34px]"
          >
            {variant.title}
          </h2>
          {variant.body && (
            <p className="mt-4 max-w-[46ch] font-geist text-[14px] leading-[1.65] text-muted-foreground sm:text-[15px]">
              {variant.body}
            </p>
          )}

          <ul className="mt-7 grid gap-2.5">
            {BENEFITS.map((item) => (
              <li key={item.label} className="flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-secondary">
                  <HugeiconsIcon
                    icon={item.icon}
                    size={16}
                    strokeWidth={1.8}
                    className="text-foreground"
                  />
                </span>
                <span className="font-geist text-[13.5px] text-foreground/80">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t border-border pt-5">
            <p className="font-geist text-[15px] text-foreground">
              <span className="text-[22px] font-semibold tabular-nums">₦1,000</span>
              <span className="text-muted-foreground"> first month, then ₦2,000</span>
            </p>

            <button
              type="button"
              onClick={goToBilling}
              className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 font-geist text-[14px] font-medium text-background transition-opacity hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              See plans and upgrade
              <HugeiconsIcon icon={ArrowRight02Icon} size={17} strokeWidth={2} />
            </button>

            <div className="mt-3 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={closePaywall}
                className="font-geist text-[12.5px] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                Maybe later
              </button>
              <span className="flex items-center gap-1.5 font-geist text-[11px] text-muted-foreground">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} strokeWidth={2} />
                Secure checkout with Paystack
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
};

export default PaywallModal;
