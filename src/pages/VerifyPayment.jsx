import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  ArrowRight02Icon,
  CreditCardIcon,
  Loading03Icon,
  LockKeyIcon,
} from "@hugeicons/core-free-icons";
import { verifyPayment } from "../api/billing";
import { useAuth } from "../context/AuthContext";

const EASE = [0.16, 1, 0.3, 1];

/**
 * Paystack callback surface. Lives outside the dashboard shell so the payment
 * provider never lands inside a sidebar, and so a failed verify is not buried
 * behind navigation. On success it refreshes entitlements and hands the person
 * back to /billing with a readable receipt of what just happened.
 */
const VerifyPayment = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference") || searchParams.get("trxref");
  const navigate = useNavigate();
  const { refetchUser } = useAuth();
  const reduce = useReducedMotion();
  const started = useRef(false);

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  const [periodEnd, setPeriodEnd] = useState(null);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    if (!reference) {
      setStatus("error");
      setMessage("This page needs a payment reference. Open Billing to check your plan.");
      return;
    }

    const run = async () => {
      try {
        const result = await verifyPayment(reference);
        if (result?.success) {
          setStatus("success");
          setMessage(result.message || "Payment confirmed.");
          setPeriodEnd(result.current_period_end || null);
          try {
            await refetchUser?.();
          } catch {
            // Entitlement refresh is best effort. The billing page re-reads it.
          }
          window.dispatchEvent(new CustomEvent("plan:updated"));
          window.setTimeout(() => {
            navigate("/billing?upgraded=1", { replace: true });
          }, 6000);
        } else {
          setStatus("error");
          setMessage(result?.message || "We could not confirm this payment.");
        }
      } catch (error) {
        setStatus("error");
        setMessage(
          error?.response?.data?.error ||
            error?.response?.data?.message ||
            "We could not confirm this payment. If you were charged, contact support with your reference.",
        );
      }
    };

    run();
  }, [reference, navigate, refetchUser]);

  const formattedEnd = periodEnd
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(periodEnd))
    : null;

  return (
    <div className="flex min-h-full w-full items-center justify-center overflow-y-auto bg-background px-4 py-12">
      <div className="w-full max-w-[560px]">
        <div className="flex items-center justify-center gap-2">
          <span className="font-heading text-[18px] font-semibold tracking-[-0.02em]">Studly</span>
          <span className="rounded-full border border-border px-2 py-0.5 font-geist text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Secure checkout
          </span>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="relative flex h-[176px] items-center justify-center overflow-hidden border-b border-border bg-[#fdf0e8]">
            <svg viewBox="0 0 360 176" className="h-full w-full" aria-hidden="true">
              <motion.circle
                cx="180"
                cy="88"
                r="62"
                fill="none"
                stroke="#141414"
                strokeOpacity="0.14"
                strokeDasharray="2 8"
                animate={reduce ? undefined : { rotate: 360 }}
                transition={{ duration: 70, ease: "linear", repeat: Infinity }}
                style={{ transformOrigin: "180px 88px" }}
              />
              <circle cx="180" cy="88" r="44" fill="#fffcf0" />

              {status === "verifying" && (
                <motion.circle
                  cx="180"
                  cy="88"
                  r="30"
                  fill="none"
                  stroke="#141414"
                  strokeOpacity="0.8"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="40 190"
                  animate={reduce ? undefined : { rotate: 360 }}
                  transition={{ duration: 1.1, ease: "linear", repeat: Infinity }}
                  style={{ transformOrigin: "180px 88px" }}
                />
              )}

              {status === "success" && (
                <motion.g
                  initial={{ scale: reduce ? 1 : 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  style={{ transformOrigin: "180px 88px" }}
                >
                  <circle cx="180" cy="88" r="26" fill="#2e9b5f" />
                  <path
                    d="M168 88.5l7.8 8.2 15-17"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.g>
              )}

              {status === "error" && (
                <motion.g
                  initial={{ scale: reduce ? 1 : 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  style={{ transformOrigin: "180px 88px" }}
                >
                  <circle cx="180" cy="88" r="26" fill="#e5484d" />
                  <path
                    d="M170 78l20 20M190 78l-20 20"
                    stroke="#ffffff"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </motion.g>
              )}

              <circle cx="74" cy="44" r="4" fill="#ff4500" fillOpacity="0.7" />
              <circle cx="292" cy="126" r="3" fill="#141414" fillOpacity="0.2" />
            </svg>
          </div>

          <div className="px-6 py-7 text-center sm:px-9 sm:py-8">
            {status === "verifying" && (
              <>
                <p className="font-geist text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Verifying
                </p>
                <h1 className="mt-2 font-heading text-[24px] font-medium tracking-[-0.02em] sm:text-[27px]">
                  Confirming your payment
                </h1>
                <p className="mx-auto mt-2 max-w-[38ch] font-geist text-[13px] leading-[1.65] text-muted-foreground">
                  Hold on for a moment. We are checking the transaction with Paystack and
                  starting your 30 days.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3.5 py-1.5 font-geist text-[11.5px] text-muted-foreground">
                  <HugeiconsIcon icon={LockKeyIcon} size={13} strokeWidth={1.8} />
                  Do not close this tab
                </div>
              </>
            )}

            {status === "success" && (
              <>
                <p className="font-geist text-[11px] font-medium uppercase tracking-[0.16em] text-[#227a49]">
                  Payment confirmed
                </p>
                <h1 className="mt-2 font-heading text-[26px] font-medium tracking-[-0.025em] sm:text-[30px]">
                  Welcome to Pro
                </h1>
                <p className="mx-auto mt-2 max-w-[40ch] font-geist text-[13.5px] leading-[1.65] text-muted-foreground">
                  {formattedEnd
                    ? `Your access runs until ${formattedEnd}.`
                    : "Thirty days of unlimited notes and the full AI study toolkit are now active."}
                </p>

                <Link
                  to="/billing?upgraded=1"
                  replace
                  className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-foreground px-6 font-geist text-[13.5px] font-medium text-background transition-opacity hover:opacity-85"
                >
                  View billing
                  <HugeiconsIcon icon={ArrowRight02Icon} size={16} strokeWidth={2} />
                </Link>
                <p className="mt-3 font-geist text-[11.5px] text-muted-foreground">
                  Taking you there automatically.
                </p>
              </>
            )}

            {status === "error" && (
              <>
                <p className="font-geist text-[11px] font-medium uppercase tracking-[0.16em] text-destructive">
                  Payment not confirmed
                </p>
                <h1 className="mt-2 font-heading text-[24px] font-medium tracking-[-0.02em] sm:text-[27px]">
                  We could not verify this payment
                </h1>
                <p className="mx-auto mt-2 max-w-[42ch] font-geist text-[13px] leading-[1.65] text-muted-foreground">
                  {message}
                </p>

                {reference && (
                  <p className="mt-4 break-all rounded-xl border border-border bg-secondary px-3 py-2 font-geist text-[11px] text-muted-foreground">
                    Reference: {reference}
                  </p>
                )}

                <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-foreground px-5 font-geist text-[13px] font-medium text-background transition-opacity hover:opacity-85"
                  >
                    <HugeiconsIcon icon={Loading03Icon} size={16} strokeWidth={2} />
                    Try again
                  </button>
                  <Link
                    to="/billing"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border px-5 font-geist text-[13px] font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    <HugeiconsIcon icon={CreditCardIcon} size={16} strokeWidth={1.8} />
                    Go to billing
                  </Link>
                </div>
                <a
                  href="mailto:support@usestudly.com"
                  className="mt-4 inline-flex items-center justify-center gap-1.5 font-geist text-[12px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  <HugeiconsIcon icon={Alert02Icon} size={13} strokeWidth={1.8} />
                  Contact support
                </a>
              </>
            )}
          </div>
        </div>

        <p className="mt-5 text-center font-geist text-[11px] text-muted-foreground">
          Payments are handled by Paystack. Studly never stores your card details.
        </p>
      </div>
    </div>
  );
};

export default VerifyPayment;
