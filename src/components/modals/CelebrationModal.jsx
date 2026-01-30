import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Flame, Sparkles, Star } from "lucide-react";
import confetti from "canvas-confetti";
import { useCelebration } from "../../context/CelebrationContext";

const STREAK_MILESTONES = [1, 2, 3, 4, 5, 6, 7, 10, 14, 21, 30, 50, 75, 100, 200, 365];
const AURA_MILESTONES = [10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000];

const CelebrationModal = () => {
    const { showCelebration, celebrationData, closeCelebration } = useCelebration();
    const lastCelebrationId = useRef(null);

    // Fire confetti when a NEW celebration starts
    useEffect(() => {
        if (showCelebration && celebrationData) {
            const currentId = `${celebrationData.type}-${celebrationData.value}`;
            if (lastCelebrationId.current !== currentId) {
                lastCelebrationId.current = currentId;
                fireConfetti();
            }
        }
    }, [showCelebration, celebrationData]);

    const fireConfetti = () => {
        const colors = ['#FF4500', '#FFD700', '#FF6B35', '#FFA500', '#FFFFFF'];

        // Slight delay to ensure modal is visible
        setTimeout(() => {
            // Side cannons
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

        // Center burst
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

    if (!showCelebration || !celebrationData) return null;

    const isAura = celebrationData.type === 'aura';
    const isStreakLost = celebrationData.type === 'streak-lost';

    const getTitle = () => {
        if (isStreakLost) return "Streak Lost 💔";
        if (isAura) return `${celebrationData.value.toLocaleString()} Aura!`;
        if (celebrationData.value === 1) return "First Milestone!";
        return `${celebrationData.value} Day Streak!`;
    };

    const getNextMilestone = () => {
        const milestones = isAura ? AURA_MILESTONES : STREAK_MILESTONES;
        return milestones.find(m => m > celebrationData.value);
    };

    const nextMilestone = getNextMilestone();
    const progress = nextMilestone ? (celebrationData.value / nextMilestone) * 100 : 100;

    const Icon = isStreakLost ? Flame : (isAura ? Trophy : Flame);
    const themeColor = isStreakLost ? "#6366F1" : (isAura ? "#EAB308" : "#FF4500"); // Indigo for lost, Yellow for aura, Orange for streak
    const bgGradient = isStreakLost
        ? "from-indigo-500/20 via-reddit-card to-slate-900/10"
        : (isAura
            ? "from-yellow-400/20 via-reddit-card to-yellow-900/10"
            : "from-orange-500/20 via-reddit-card to-red-900/10");

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                onClick={closeCelebration}
            >
                <motion.div
                    key={`${celebrationData.type}-${celebrationData.value}`}
                    initial={{ scale: 0.8, opacity: 0, y: 40, rotate: -2 }}
                    animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
                    exit={{ scale: 1.1, opacity: 0, y: -40, rotate: 2 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    className={`relative bg-gradient-to-br ${bgGradient} bg-reddit-card border border-white/10 rounded-[2.5rem] w-full max-w-[400px] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]`}
                >
                    {/* Glowing background effect */}
                    <div
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 blur-[100px] opacity-20 pointer-events-none"
                        style={{ backgroundColor: themeColor }}
                    />

                    {/* Content */}
                    <div className="p-10 text-center relative z-10">
                        {/* Milestone Badge */}
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase font-black tracking-[0.2em] text-reddit-textMuted mb-8"
                        >
                            Achievement Unlocked
                        </motion.div>

                        {/* main Icon */}
                        <div className="relative mx-auto mb-10">
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className={`w-36 h-36 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mx-auto relative overflow-hidden backdrop-blur-xl`}
                            >
                                <Icon size={72} strokeWidth={1.5} style={{ color: themeColor }} />

                                {/* Inner glow */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
                            </motion.div>

                            {/* Decorative Sparkles */}
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute"
                                    initial={{ opacity: 0 }}
                                    animate={{
                                        opacity: [0, 1, 0],
                                        scale: [0, 1.2, 0],
                                        x: Math.cos(i * 60 * Math.PI / 180) * 80,
                                        y: Math.sin(i * 60 * Math.PI / 180) * 80
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.3,
                                        ease: "circOut"
                                    }}
                                >
                                    <Star size={12 + i % 3 * 4} fill={themeColor} className="text-transparent" />
                                </motion.div>
                            ))}
                        </div>

                        {/* Text */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-4 mb-8"
                        >
                            <h2 className="text-4xl font-black text-white leading-tight font-righteous">
                                {getTitle()}
                            </h2>
                            <p className="text-lg text-reddit-textMuted font-medium px-4 leading-relaxed">
                                {celebrationData.message}
                            </p>
                        </motion.div>

                        {/* Progress Bar (if applicable) */}
                        {!isStreakLost && nextMilestone && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="mb-10 px-4"
                            >
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-reddit-textMuted mb-2">
                                    <span>Current: {celebrationData.value}</span>
                                    <span>Next: {nextMilestone}</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ delay: 0.6, duration: 1, ease: "circOut" }}
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: themeColor }}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <button
                                onClick={closeCelebration}
                                className="group relative w-full overflow-hidden rounded-2xl p-[1px] transition-all"
                            >
                                <div
                                    className="absolute inset-0 animate-[spin_3s_linear_infinite] opacity-50"
                                    style={{ background: `conic-gradient(from 0deg, transparent, ${themeColor}, transparent)` }}
                                />
                                <div className="relative bg-reddit-card hover:bg-[#272729] rounded-2xl py-4 flex items-center justify-center gap-2 transition-colors">
                                    <span className="text-white font-black text-lg">{isStreakLost ? "Start Fresh" : "Claim Achievement"}</span>
                                    <Sparkles size={20} style={{ color: themeColor }} />
                                </div>
                            </button>

                            <button
                                onClick={closeCelebration}
                                className="mt-4 text-reddit-textMuted text-xs font-bold hover:text-white transition-colors"
                            >
                                Not now, let's study
                            </button>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CelebrationModal;
