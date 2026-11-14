import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useAuth } from "../context/AuthContext";
import { initializePayment, getBillingOverview } from "../api/billing";
import { compatToast as toast } from "../components/ui/toast";

const EASE = [0.16, 1, 0.3, 1];

const REASON_COPY = {
  upload:
    "You are here because you used your free note. Pro removes the upload limit and keeps your notes coming.",
  limit_reached:
    "You are here because you used your free note. Pro removes the upload limit and keeps your notes coming.",
  ai: "You are here because you used your hourly AI actions. Pro gives you 60 every hour.",
  feature: "You are here because 50 question quizzes and card decks are part of Pro.",
  expired: "Your Pro access ended. Renew for another 30 days to restore everything.",
};

const naira = (kobo) => {
  if (kobo === null || kobo === undefined) return null;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(kobo / 100);
};

const formatDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

/** Flat settings pages use a plain heading plus an optional one line intro. */
const Section = ({ title, description, children }) => (
  <section className="border-t border-border py-10 first:border-t-0 first:pt-0">
    <h2 className="font-geist text-[15px] font-semibold tracking-[-0.01em] text-foreground">
      {title}
    </h2>
    {description && (
      <p className="mt-1 max-w-[60ch] text-[13px] leading-[1.6] text-muted-foreground">
        {description}
      </p>
    )}
    <div className="mt-5">{children}</div>
  </section>
);

const MeterBar = ({ percent, danger }) => (
  <div
    role="progressbar"
    aria-valuemin={0}
    aria-valuemax={100}
    aria-valuenow={percent}
    className="h-1 w-full overflow-hidden rounded-full bg-foreground/10"
  >
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${Math.min(percent, 100)}%` }}
      transition={{ duration: 0.8, ease: EASE }}
      className={`h-full rounded-full ${danger ? "bg-destructive" : "bg-foreground/75"}`}
    />
  </div>
);

/** One settings row: left label + detail, right value + optional action. */
const Row = ({ label, detail, children }) => (
  <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-3 py-5 first:pt-0 last:pb-0 sm:flex-nowrap sm:items-center">
    <div className="min-w-0">
      <p className="text-[13.5px] font-medium text-foreground">{label}</p>
      {detail && <p className="mt-0.5 text-[12.5px] text-muted-foreground">{detail}</p>}
    </div>
    {children && <div className="flex shrink-0 items-center gap-3">{children}</div>}
  </div>
);

const Billing = () => {
  const { isAuthenticated, isAuthLoading, currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const reduce = useReducedMotion();

  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const justUpgraded = searchParams.get("upgraded") === "1";
  const reasonParam = searchParams.get("reason");

  const loadBilling = useCallback(async () => {
    try {
      const result = await getBillingOverview();
      setOverview(result);
      setLoadError(false);
    } catch {
      setLoadError(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;
    setLoading(true);
    loadBilling().finally(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [isAuthenticated, loadBilling]);

  // Keep relative copy ("23 days left") honest.
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated) {
      navigate("/login?next=/billing", { replace: true });
    }
  }, [isAuthLoading, isAuthenticated, navigate]);

  // Drop the ?upgraded flag once it has been acknowledged so a refresh does
  // not replay the success banner forever.
  useEffect(() => {
    if (!justUpgraded) return;
    const timer = window.setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      next.delete("upgraded");
      setSearchParams(next, { replace: true });
    }, 12000);
    return () => window.clearTimeout(timer);
  }, [justUpgraded, searchParams, setSearchParams]);

  const planType = overview?.plan_type || currentUser?.planType || "free";
  const isPro = Boolean(overview?.is_pro ?? planType === "pro");
  const periodStart = overview?.current_period_start || null;
  const periodEnd = overview?.current_period_end || currentUser?.currentPeriodEnd || null;
  const expired = !isPro && Boolean(periodEnd) && new Date(periodEnd).getTime() < now;

  const daysLeft = useMemo(() => {
    if (!isPro || !periodEnd) return 0;
    return Math.max(0, Math.ceil((new Date(periodEnd).getTime() - now) / 86400000));
  }, [isPro, periodEnd, now]);

  const remainingFraction = useMemo(() => {
    if (!isPro || !periodEnd) return 0;
    const end = new Date(periodEnd).getTime();
    const start = periodStart ? new Date(periodStart).getTime() : end - 30 * 86400000;
    const total = Math.max(end - start, 1);
    return Math.min(Math.max((end - now) / total, 0), 1);
  }, [isPro, periodEnd, periodStart, now]);

  const firstMonthEligible = overview ? !overview.has_used_first_month_discount : false;
  const activePriceKobo = firstMonthEligible
    ? overview?.first_month_price_kobo
    : overview?.price_kobo;
  const priceLabel = naira(activePriceKobo) || (firstMonthEligible ? "₦1,000" : "₦2,000");
  const standardPriceLabel = naira(overview?.price_kobo) || "₦2,000";

  const handleCheckout = async () => {
    try {
      setCheckingOut(true);
      sessionStorage.setItem(
        "studly_billing_intent",
        JSON.stringify({ source: isPro ? "extend" : expired ? "renew" : "upgrade", at: Date.now() }),
      );
      const data = await initializePayment();
      if (data?.authorization_url) {
        window.location.assign(data.authorization_url);
        return;
      }
      toast.error("We could not open checkout. Please try again.");
    } catch (error) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Checkout is unavailable right now. Please try again.",
      );
    } finally {
      setCheckingOut(false);
    }
  };

  if (isAuthLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <HugeiconsIcon
          icon={Loading03Icon}
          size={28}
          strokeWidth={2}
          className="animate-spin text-muted-foreground"
        />
      </div>
    );
  }

  const reasonCopy = reasonParam ? REASON_COPY[reasonParam] : null;

  const planTitle = isPro ? "Pro" : expired ? "Pro" : "Free plan";
  const planDetail = isPro
    ? `${standardPriceLabel} per 30 days`
    : expired
      ? `${standardPriceLabel} per 30 days`
      : "One note upload, and 20 AI actions per hour";

  const primaryLabel = isPro ? "Extend 30 days" : expired ? "Renew Pro" : "Upgrade to Pro";

  return (
    <div className="mx-auto w-full max-w-[720px] px-4 pb-24 pt-6 sm:px-6 md:px-8 md:pt-10">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-heading text-[28px] font-semibold leading-none tracking-[-0.03em] sm:text-[32px]">
          Billing
        </h1>
        <div className="flex items-center gap-2">
          {!loading && (
            <Badge
              variant={isPro ? "default" : expired ? "destructive" : "secondary"}
              className={
                isPro
                  ? "border-transparent bg-[#2e9b5f]/12 text-[#227a49] hover:bg-[#2e9b5f]/20 dark:text-[#69d39b]"
                  : ""
              }
            >
              {isPro ? "Pro active" : expired ? "Expired" : "Free plan"}
            </Badge>
          )}
        </div>
      </div>

      {/* Success banner */}
      {justUpgraded && (
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="mt-6 flex items-start gap-3 rounded-xl border border-[#2e9b5f]/25 bg-[#2e9b5f]/[0.08] px-4 py-3.5"
        >
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            size={18}
            strokeWidth={2}
            className="mt-0.5 shrink-0 text-[#227a49] dark:text-[#69d39b]"
          />
          <p className="text-[13px] leading-[1.6] text-foreground">
            Payment confirmed. Pro is active.
            {periodEnd ? ` Access runs until ${formatDate(periodEnd)}.` : ""}
          </p>
        </motion.div>
      )}

      {/* Context banner for paywall deep links */}
      {!justUpgraded && reasonCopy && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-secondary px-4 py-3.5">
          <HugeiconsIcon
            icon={InformationCircleIcon}
            size={16}
            strokeWidth={1.8}
            className="mt-0.5 shrink-0 text-muted-foreground"
          />
          <p className="text-[12.5px] leading-[1.6] text-foreground/80">{reasonCopy}</p>
        </div>
      )}

      {/* Load error */}
      {loadError && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-destructive/25 bg-destructive/[0.07] px-4 py-3.5">
          <HugeiconsIcon
            icon={Alert02Icon}
            size={16}
            strokeWidth={2}
            className="mt-0.5 shrink-0 text-destructive"
          />
          <div className="flex-1">
            <p className="text-[13px] text-foreground">Some billing details could not load.</p>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              Plan details may be out of date.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={loadBilling} className="rounded-full">
            Retry
          </Button>
        </div>
      )}

      {loading ? (
        <div className="mt-10 space-y-10">
          <div className="border-t border-border py-10 first:border-t-0 first:pt-0">
            <div className="h-4 w-28 animate-pulse rounded-full bg-secondary" />
            <div className="mt-6 h-4 w-full animate-pulse rounded-full bg-secondary/70" />
            <div className="mt-3 h-4 w-2/3 animate-pulse rounded-full bg-secondary/70" />
          </div>
        </div>
      ) : (
        <div className="mt-10">
          {/* Plan */}
          <Section title="Plan">
            <div className="divide-y divide-border">
              <Row
                label={planTitle}
                detail={
                  firstMonthEligible && !isPro
                    ? `${priceLabel} first month, then ${standardPriceLabel} per 30 days`
                    : planDetail
                }
              >
                <Button
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  className="h-10 rounded-full bg-foreground px-5 text-[13.5px] font-medium text-background hover:bg-foreground/85"
                >
                  {checkingOut && (
                    <HugeiconsIcon icon={Loading03Icon} size={16} strokeWidth={2} className="animate-spin" />
                  )}
                  {primaryLabel}
                </Button>
              </Row>

              <Row
                label={expired ? "Access ended" : "Access window"}
                detail={
                  isPro
                    ? `${formatDate(periodStart) || "Unknown start"} to ${formatDate(periodEnd) || "unknown end"}`
                    : expired
                      ? `Ended ${formatDate(periodEnd)}`
                      : "Starts when you upgrade"
                }
              >
                {isPro && (
                  <span className="text-[12.5px] tabular-nums text-muted-foreground">
                    {daysLeft} {daysLeft === 1 ? "day" : "days"} left
                  </span>
                )}
              </Row>
              {isPro && (
                <div className="pt-5">
                  <MeterBar percent={Math.round(remainingFraction * 100)} />
                </div>
              )}
            </div>
          </Section>
        </div>
      )}
    </div>
  );
};

export default Billing;
