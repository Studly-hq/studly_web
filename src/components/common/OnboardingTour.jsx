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
        description: "Get all your course materials, past questions, and resources in one place.",
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
                    className="absolute inset-0 bg-black/60 backdrop-blur-[2px] pointer-events-auto"
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
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        top: targetRect
                            ? (targetRect.top + targetRect.height + 24 > window.innerHeight - 200 ? targetRect.top - 200 : targetRect.top + targetRect.height + 24)
                            : '50%',
                        left: targetRect
                            ? Math.max(16, Math.min(window.innerWidth - 320, targetRect.left + targetRect.width / 2 - 150))
                            : '50%',
                        translateX: targetRect ? 0 : '-50%',
                        translateY: targetRect ? 0 : '-50%'
                    }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="absolute w-[calc(100%-32px)] max-w-[320px] bg-reddit-card border border-reddit-border rounded-2xl shadow-2xl p-6 pointer-events-auto"
                >
                    {/* Close Button */}
                    <button
                        onClick={finishTour}
                        className="absolute top-4 right-4 text-reddit-textMuted hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>

                    {/* Icon/Step Indicator */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-reddit-orange/20 flex items-center justify-center text-reddit-orange">
                            {currentStepData.icon ? <currentStepData.icon size={20} /> : <div className="font-bold">{currentStep + 1}</div>}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-white font-bold text-lg leading-tight">{currentStepData.title}</h3>
                            <div className="flex gap-1 mt-1">
                                {steps.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1 rounded-full transition-all duration-300 ${i === currentStep ? 'w-4 bg-reddit-orange' : 'w-1 bg-white/20'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <p className="text-reddit-textMuted text-sm mb-6 leading-relaxed">
                        {currentStepData.description}
                    </p>

                    <div className="flex items-center justify-between">
                        <button
                            onClick={handleBack}
                            disabled={currentStep === 0}
                            className={`flex items-center gap-1 text-sm font-medium transition-colors ${currentStep === 0 ? 'text-white/10' : 'text-reddit-textMuted hover:text-white'}`}
                        >
                            <ChevronLeft size={16} />
                            Back
                        </button>

                        <button
                            onClick={handleNext}
                            className="px-5 py-2 bg-reddit-orange hover:bg-reddit-orange/90 text-white rounded-full text-sm font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                        >
                            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                            {currentStep !== steps.length - 1 && <ChevronRight size={16} />}
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
