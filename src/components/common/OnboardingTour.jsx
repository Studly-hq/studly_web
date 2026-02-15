import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Play, ExternalLink, Plus } from 'lucide-react';

const TOUR_STORAGE_KEY = 'studly_onboarding_completed';

const steps = [
    {
        title: "Welcome to Studly! 🚀",
        description: "We're excited to have you here. Let's take a quick tour of your new study companion.",
        target: null, // Center
    },
    {
        title: "Access CUHUB",
        description: "Get all your course materials, past questions, and resources in one place. The button is located at the right sidebar of your screen.",
        target: {
            desktop: "tour-cuhub-desktop",
            mobile: "tour-cuhub-mobile"
        },
        icon: ExternalLink
    },
    {
        title: "Start Studying",
        description: "Ready to ace your exams? Use our AI-powered study tools to practice!",
        target: {
            desktop: "tour-study-desktop",
            mobile: "tour-study-mobile"
        },
        icon: Play
    },
    {
        title: "Share with Others",
        description: "Post updates, ask questions, and collaborate with your peers.",
        target: {
            desktop: "tour-post-desktop",
            mobile: null // We could target the central plus if it exists on mobile, but let's keep it simple
        },
        icon: Plus
    },
    {
        title: "You're all set!",
        description: "Explore the feed, check the leaderboard, and make the most of Studly.",
        target: null,
    }
];

export default function OnboardingTour() {
    const [currentStep, setCurrentStep] = useState(-1); // -1 means checking/idle
    const [isVisible, setIsVisible] = useState(false);
    const [targetRect, setTargetRect] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    // Check if tour should start
    useEffect(() => {
        const isCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
        if (!isCompleted) {
            setTimeout(() => {
                setCurrentStep(0);
                setIsVisible(true);
            }, 1500); // Wait a bit for the app to load
        }

        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Update target rect when step or resize changes
    const updateTargetRect = useCallback(() => {
        if (currentStep < 0 || currentStep >= steps.length) return;

        const step = steps[currentStep];
        const targetId = isMobile ? step.target?.mobile : step.target?.desktop;

        if (targetId) {
            const element = document.getElementById(targetId) || document.getElementById(targetId + '-active');
            if (element) {
                const rect = element.getBoundingClientRect();
                setTargetRect({
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height
                });
                return;
            }
        }
        setTargetRect(null); // No target, center the modal
    }, [currentStep, isMobile]);

    useEffect(() => {
        updateTargetRect();
        // Re-check after a short delay to account for layout shifts/animations
        const timer = setTimeout(updateTargetRect, 100);
        return () => clearTimeout(timer);
    }, [updateTargetRect]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            finishTour();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const finishTour = () => {
        setIsVisible(false);
        localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    };

    if (!isVisible || currentStep < 0) return null;

    const currentStepData = steps[currentStep];

    return (
        <div className="fixed inset-0 z-[10000] pointer-events-none overflow-hidden">
            {/* Dark Overlay with Hole */}
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/70 pointer-events-auto cursor-pointer"
                    style={{
                        clipPath: targetRect
                            ? `polygon(0% 0%, 0% 100%, ${targetRect.left - 8}px 100%, ${targetRect.left - 8}px ${targetRect.top - 8}px, ${targetRect.left + targetRect.width + 8}px ${targetRect.top - 8}px, ${targetRect.left + targetRect.width + 8}px ${targetRect.top + targetRect.height + 8}px, ${targetRect.left - 8}px ${targetRect.top + targetRect.height + 8}px, ${targetRect.left - 8}px 100%, 100% 100%, 100% 0%)`
                            : 'none'
                    }}
                    onClick={finishTour}
                />
            </AnimatePresence>

            {/* Tooltip Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        // Responsive positioning
                        top: !targetRect
                            ? '50%'
                            : isMobile
                                ? (targetRect.top > window.innerHeight / 2 ? 'auto' : targetRect.top + targetRect.height + 20)
                                : (targetRect.top + targetRect.height + 24 > window.innerHeight - 250 ? targetRect.top - 220 : targetRect.top + targetRect.height + 24),
                        bottom: isMobile && targetRect && targetRect.top > window.innerHeight / 2 ? (window.innerHeight - targetRect.top + 20) : 'auto',
                        left: '50%',
                        translateX: '-50%',
                        translateY: !targetRect ? '-50%' : 0
                    }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="absolute w-[calc(100%-32px)] max-w-[360px] bg-reddit-card border border-reddit-border rounded-3xl p-7 pointer-events-auto"
                >
                    {/* Close Button */}
                    <button
                        onClick={finishTour}
                        className="absolute top-5 right-5 text-reddit-textMuted hover:text-white p-1"
                    >
                        <X size={20} />
                    </button>

                    {/* Icon/Step Indicator */}
                    <div className="flex items-center gap-4 mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-reddit-orange flex items-center justify-center text-white">
                            {currentStepData.icon ? <currentStepData.icon size={24} /> : <div className="font-bold text-lg">{currentStep + 1}</div>}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-white font-bold text-xl leading-tight tracking-tight">{currentStepData.title}</h3>
                            <div className="flex gap-1.5 mt-2">
                                {steps.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-6 bg-reddit-orange' : 'w-1.5 bg-white/20'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <p className="text-reddit-textMuted text-[15px] mb-8 leading-relaxed font-medium">
                        {currentStepData.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto gap-4">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleBack}
                            disabled={currentStep === 0}
                            className={`flex items-center gap-2 text-sm font-bold transition-all py-3 px-4 rounded-xl cursor-pointer touch-manipulation shadow-sm ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'text-reddit-textMuted hover:text-white hover:bg-white/5 bg-white/5'}`}
                        >
                            <ChevronLeft size={18} />
                            Back
                        </motion.button>

                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleNext}
                            className="flex-1 px-4 py-3 bg-reddit-orange hover:bg-reddit-orange/90 text-white rounded-2xl text-base font-bold flex items-center justify-center gap-2 transition-all cursor-pointer touch-manipulation"
                        >
                            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                            {currentStep !== steps.length - 1 && <ChevronRight size={18} />}
                        </motion.button>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );

}
