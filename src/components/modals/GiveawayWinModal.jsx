import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Cancel01Icon,
    Ticket01Icon,
    ArrowRight02Icon,
} from "@hugeicons/core-free-icons";
import confetti from "canvas-confetti";
import { useUI } from "../../context/UIContext";

const EASE = [0.16, 1, 0.3, 1];

/**
 * GiveawayWinModal
 *
 * Shows when a user wins the daily giveaway (every 5th login).
 * Styled exactly like PaywallModal.
 */
const GiveawayWinModal = () => {
    const { showGiveawayWinModal, giveawayWinData, closeGiveawayWinModal } = useUI();
    const reduce = useReducedMotion();
    const panelRef = useRef(null);
    const hasFiredConfetti = useRef(false);

    // Fire confetti when modal opens
    useEffect(() => {
        if (showGiveawayWinModal && !hasFiredConfetti.current) {
            hasFiredConfetti.current = true;
            fireConfetti();
        } else if (!showGiveawayWinModal) {
            hasFiredConfetti.current = false;
        }
    }, [showGiveawayWinModal]);

    const fireConfetti = () => {
        const colors = ['#FF4500', '#FFD700', '#FF6B35', '#FFA500', '#FFFFFF'];

        setTimeout(() => {
            confetti({
                particleCount: 80,
                angle: 60,
                spread: 70,
                origin: { x: 0, y: 0.6 },
                colors: colors,
                zIndex: 10000
            });
            confetti({
                particleCount: 80,
                angle: 120,
                spread: 70,
                origin: { x: 1, y: 0.6 },
                colors: colors,
                zIndex: 10000
            });
        }, 100);

        setTimeout(() => {
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { x: 0.5, y: 0.5 },
                colors: colors,
                scalar: 1.2,
                zIndex: 10000
            });
        }, 500);
    };

    // Escape to dismiss, focus the panel, and lock background scroll while open.
    useEffect(() => {
        if (!showGiveawayWinModal) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const focusTimer = window.setTimeout(() => panelRef.current?.focus(), 40);

        const onKeyDown = (event) => {
            if (event.key === "Escape") closeGiveawayWinModal();
        };
        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.clearTimeout(focusTimer);
            window.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [showGiveawayWinModal, closeGiveawayWinModal]);

    if (!showGiveawayWinModal || !giveawayWinData) return null;

    const { ticket_number, login_position, message } = giveawayWinData;

    const handleSendScreenshot = () => {
        window.open("https://t.me/zee_mp4", "_blank", "noopener,noreferrer");
        closeGiveawayWinModal();
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[120] flex items-end justify-center bg-black/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) closeGiveawayWinModal();
            }}
        >
            <motion.div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="giveaway-win-title"
                tabIndex={-1}
                initial={{ opacity: 0, y: reduce ? 0 : 24, scale: reduce ? 1 : 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.34, ease: EASE }}
                className="relative w-full max-w-[520px] overflow-hidden rounded-t-[26px] border border-border bg-card text-foreground outline-none sm:rounded-[26px]"
            >
                {/* Desktop close button — top right of the card */}
                <button
                    type="button"
                    onClick={closeGiveawayWinModal}
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
                            onClick={closeGiveawayWinModal}
                            aria-label="Close"
                            className="-mr-1 flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                        >
                            <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={1.8} />
                        </button>
                    </div>

                    {/* Celebration Icon */}
                    <div className="mx-auto mb-6">
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                            className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30"
                        >
                            <HugeiconsIcon icon={Ticket01Icon} size={36} strokeWidth={2} className="text-white" />
                        </motion.div>
                    </div>

                    <h2
                        id="giveaway-win-title"
                        className="mt-2 max-w-[22ch] font-heading text-[26px] font-medium leading-[1.12] tracking-[-0.025em] text-center sm:text-[32px] md:text-[34px]"
                    >
                        You won a movie ticket!
                    </h2>

                    {/* How to claim */}
                    <div className="mt-6 space-y-3">
                        <ul className="space-y-2 text-left">
                            <li className="flex items-start gap-3 font-geist text-[14px] leading-[1.6] text-foreground">
                                <span className="flex-shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                Screenshot this modal
                            </li>
                            <li className="flex items-start gap-3 font-geist text-[14px] leading-[1.6] text-foreground">
                                <span className="flex-shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                Send the screenshot to 
                                <span className="font-mono font-bold bg-amber-500/20 px-2 py-0.5 rounded text-amber-500">@zee_mp4</span> on Telegram
                            </li>
                        </ul>
                    </div>

                    <div className="mt-8 border-t border-border pt-5">
                        <button
                            type="button"
                            onClick={handleSendScreenshot}
                            className="w-full flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 font-geist text-[14px] font-medium text-background transition-opacity hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                        >
                            Send screenshot to @zee_mp4
                            <HugeiconsIcon icon={ArrowRight02Icon} size={17} strokeWidth={2} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>,
        document.body,
    );
};

export default GiveawayWinModal;