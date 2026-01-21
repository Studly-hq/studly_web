import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Flame, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { useCelebration } from "../../context/CelebrationContext";

const CelebrationModal = () => {
    const { showCelebration, celebrationData, closeCelebration } = useCelebration();
    const hasConfettiFired = useRef(false);

    // Fire confetti when modal opens
    useEffect(() => {
        if (showCelebration && !hasConfettiFired.current) {
            hasConfettiFired.current = true;
            fireConfetti();
        }
        if (!showCelebration) {
            hasConfettiFired.current = false;
        }
    }, [showCelebration]);

    const fireConfetti = () => {
        const duration = 3000;
        const end = Date.now() + duration;

        const colors = ['#FF4500', '#FFD700', '#FF6B35', '#FFA500'];

        (function frame() {
            confetti({
                particleCount: 4,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 4,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());

        // Burst in center
        setTimeout(() => {
            confetti({
                particleCount: 100,
                spread: 100,
                origin: { y: 0.6 },
                colors: colors
            });
        }, 250);
    };

    if (!showCelebration || !celebrationData) return null;

    const isAura = celebrationData.type === 'aura';
    const isStreak = celebrationData.type === 'streak' || celebrationData.type === 'streak-weekly';

    const getTitle = () => {
        if (isAura) return `${celebrationData.value.toLocaleString()} Aura Points!`;
        if (celebrationData.value === 1) return "First Streak!";
        if (celebrationData.value === 7) return "1 Week Streak!";
        if (celebrationData.value === 30) return "1 Month Streak!";
        return `${celebrationData.value} Day Streak!`;
    };

    const Icon = isAura ? Trophy : Flame;
    const iconColor = isAura ? "text-yellow-400" : "text-orange-500";
    const gradientFrom = isAura ? "from-yellow-500/20" : "from-orange-500/20";
    const gradientTo = isAura ? "to-amber-600/20" : "to-red-500/20";

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={closeCelebration}
            >
                <motion.div
                    initial={{ scale: 0.5, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.5, opacity: 0, y: 50 }}
                    transition={{
                        type: "spring",
                        damping: 15,
                        stiffness: 300
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className={`relative bg-gradient-to-br ${gradientFrom} ${gradientTo} bg-reddit-card border border-reddit-border rounded-2xl w-full max-w-sm overflow-hidden`}
                >
                    {/* Close button */}
                    <button
                        onClick={closeCelebration}
                        className="absolute top-4 right-4 text-reddit-textMuted hover:text-reddit-text p-1 rounded-full hover:bg-white/10 transition-colors z-10"
                    >
                        <X size={20} />
                    </button>

                    {/* Content */}
                    <div className="p-8 text-center">
                        {/* Animated Icon */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                type: "spring",
                                delay: 0.2,
                                damping: 10,
                                stiffness: 200
                            }}
                            className="relative mx-auto mb-6"
                        >
                            <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center mx-auto relative`}>
                                <Icon size={48} className={iconColor} />

                                {/* Sparkle decorations */}
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.5, 1, 0.5]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="absolute -top-2 -right-2"
                                >
                                    <Sparkles size={24} className="text-yellow-400" />
                                </motion.div>
                                <motion.div
                                    animate={{
                                        scale: [1, 1.3, 1],
                                        opacity: [0.5, 1, 0.5]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: 0.5
                                    }}
                                    className="absolute -bottom-1 -left-2"
                                >
                                    <Sparkles size={16} className="text-orange-400" />
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Title */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-3xl font-bold text-white mb-2"
                        >
                            🎉 {getTitle()}
                        </motion.h2>

                        {/* Message */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-xl text-reddit-textMuted mb-8"
                        >
                            {celebrationData.message}
                        </motion.p>

                        {/* Continue button */}
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={closeCelebration}
                            className="w-full bg-reddit-orange hover:bg-reddit-orange/90 text-white font-bold py-3 px-6 rounded-full transition-colors"
                        >
                            Continue
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CelebrationModal;
