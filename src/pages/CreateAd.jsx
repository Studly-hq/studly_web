import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Check,
    BarChart3,
    Rocket,
    Gem,
    Image,
    FileText,
    Calendar,
    CreditCard,
    Shield,
    Zap,
    Users,
    TrendingUp,
    Clock,
    CheckCircle
} from 'lucide-react';

const CreateAd = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [duration, setDuration] = useState(7);
    const [postType, setPostType] = useState(null);

    const steps = [
        { id: 1, name: 'Choose Plan', icon: Gem },
        { id: 2, name: 'Select Content', icon: FileText },
        { id: 3, name: 'Duration', icon: Calendar },
        { id: 4, name: 'Payment', icon: CreditCard }
    ];

    const plans = [
        {
            id: 'starter',
            name: 'Starter',
            icon: BarChart3,
            price: 500,
            impressions: '1,000',
            description: 'Perfect for testing the waters',
            color: 'blue',
            features: [
                'Feed placement',
                'Basic analytics',
                '24/7 Support',
                'Standard targeting'
            ]
        },
        {
            id: 'growth',
            name: 'Growth',
            icon: Rocket,
            price: 1500,
            impressions: '5,000',
            description: 'Best for growing your audience',
            popular: true,
            color: 'orange',
            features: [
                'Feed + Sidebar placement',
                'Advanced analytics',
                'Priority support',
                'A/B testing',
                'Custom audience targeting'
            ]
        },
        {
            id: 'premium',
            name: 'Premium',
            icon: Gem,
            price: 3000,
            impressions: '15,000',
            description: 'Maximum visibility & impact',
            color: 'purple',
            features: [
                'All placements',
                'Full analytics dashboard',
                'Dedicated account manager',
                'Custom targeting',
                'Featured badge',
                'Analytics export'
            ]
        }
    ];

    const totalCost = selectedPlan ? selectedPlan.price * duration : 0;
    const estimatedImpressions = selectedPlan ? parseInt(selectedPlan.impressions.replace(',', '')) * duration : 0;

    const getPlanColor = (plan) => {
        switch (plan.color) {
            case 'blue': return 'border-blue-500/30 hover:border-blue-500/50';
            case 'orange': return 'border-reddit-orange/30 hover:border-reddit-orange/50';
            case 'purple': return 'border-purple-500/30 hover:border-purple-500/50';
            default: return 'border-gray-500/30';
        }
    };

    const getIconBg = (plan) => {
        switch (plan.color) {
            case 'blue': return 'bg-blue-500/20 text-blue-400';
            case 'orange': return 'bg-reddit-orange/20 text-reddit-orange';
            case 'purple': return 'bg-purple-500/20 text-purple-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    return (
        <div className="min-h-screen bg-reddit-bg text-white">
            {/* Header */}
            <div className="sticky top-0 bg-reddit-bg/95 backdrop-blur-md z-10 border-b border-reddit-border">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 rounded-full hover:bg-reddit-cardHover transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="font-bold text-xl">Create Campaign</h1>
                        <p className="text-xs text-reddit-textMuted">Reach thousands of students</p>
                    </div>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-10">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-1">
                                <motion.div
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: currentStep >= step.id ? 1 : 0.9 }}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${currentStep > step.id
                                        ? 'bg-green-500 text-white'
                                        : currentStep === step.id
                                            ? 'bg-reddit-orange text-white'
                                            : 'bg-reddit-cardHover text-reddit-textMuted border border-reddit-border'
                                        }`}
                                >
                                    {currentStep > step.id ? <Check size={20} /> : <step.icon size={18} />}
                                </motion.div>
                                <span className={`text-xs mt-2 font-medium ${currentStep >= step.id ? 'text-white' : 'text-reddit-textMuted'
                                    }`}>
                                    {step.name}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`h-0.5 flex-1 mx-2 transition-all duration-500 ${currentStep > step.id
                                    ? 'bg-reddit-orange'
                                    : 'bg-reddit-border'
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold mb-2">Choose Your Plan</h2>
                                <p className="text-reddit-textMuted">Select the plan that best fits your advertising goals</p>
                            </div>

                            {/* Plan Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {plans.map((plan) => (
                                    <motion.div
                                        key={plan.id}
                                        whileHover={{ y: -4 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedPlan(plan)}
                                        className={`relative bg-reddit-card ${getPlanColor(plan)} border rounded-2xl p-6 cursor-pointer transition-all ${selectedPlan?.id === plan.id ? 'ring-2 ring-reddit-orange' : ''
                                            }`}
                                    >
                                        {plan.popular && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                                <span className="bg-reddit-orange text-white text-xs font-bold px-3 py-1 rounded-full">
                                                    POPULAR
                                                </span>
                                            </div>
                                        )}

                                        <div className={`w-12 h-12 ${getIconBg(plan)} rounded-xl flex items-center justify-center mb-4`}>
                                            <plan.icon size={24} />
                                        </div>

                                        <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                                        <p className="text-sm text-reddit-textMuted mb-4">{plan.description}</p>

                                        <div className="mb-4">
                                            <span className="text-3xl font-bold">₦{plan.price.toLocaleString()}</span>
                                            <span className="text-reddit-textMuted">/day</span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-reddit-textMuted mb-4">
                                            <Users size={14} />
                                            <span>{plan.impressions} impressions/day</span>
                                        </div>

                                        <ul className="space-y-2">
                                            {plan.features.map((feature, i) => (
                                                <li key={i} className="flex items-center gap-2 text-sm">
                                                    <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {selectedPlan?.id === plan.id && (
                                            <motion.div
                                                layoutId="selected"
                                                className="absolute top-4 right-4"
                                            >
                                                <div className="w-6 h-6 bg-reddit-orange rounded-full flex items-center justify-center">
                                                    <Check size={14} />
                                                </div>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>

                            {/* Trust Badges */}
                            <div className="flex items-center justify-center gap-8 mt-8 pt-6 border-t border-reddit-border">
                                <div className="flex items-center gap-2 text-reddit-textMuted text-sm">
                                    <Shield size={16} className="text-green-400" />
                                    <span>Secure Payment</span>
                                </div>
                                <div className="flex items-center gap-2 text-reddit-textMuted text-sm">
                                    <Zap size={16} className="text-yellow-400" />
                                    <span>Instant Activation</span>
                                </div>
                                <div className="flex items-center gap-2 text-reddit-textMuted text-sm">
                                    <TrendingUp size={16} className="text-blue-400" />
                                    <span>Real-time Analytics</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold mb-2">Select Content</h2>
                                <p className="text-reddit-textMuted">Choose how you want to create your ad</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                                <motion.button
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setPostType('existing')}
                                    className={`bg-reddit-card border rounded-2xl p-8 text-left transition-all ${postType === 'existing'
                                        ? 'border-reddit-orange ring-2 ring-reddit-orange/20'
                                        : 'border-reddit-border hover:border-reddit-orange/50'
                                        }`}
                                >
                                    <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                                        <FileText size={28} className="text-blue-400" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">Choose Existing Post</h3>
                                    <p className="text-sm text-reddit-textMuted">
                                        Select from your published posts to promote to a wider audience
                                    </p>
                                </motion.button>

                                <motion.button
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setPostType('new')}
                                    className={`bg-reddit-card border rounded-2xl p-8 text-left transition-all ${postType === 'new'
                                        ? 'border-reddit-orange ring-2 ring-reddit-orange/20'
                                        : 'border-reddit-border hover:border-reddit-orange/50'
                                        }`}
                                >
                                    <div className="w-14 h-14 bg-reddit-orange/10 rounded-xl flex items-center justify-center mb-4">
                                        <Image size={28} className="text-reddit-orange" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">Create New Ad</h3>
                                    <p className="text-sm text-reddit-textMuted">
                                        Design a custom advertisement with optimized content for ads
                                    </p>
                                </motion.button>
                            </div>

                            {postType === 'existing' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-8 max-w-2xl mx-auto"
                                >
                                    <div className="bg-reddit-card border border-reddit-border rounded-xl p-6">
                                        <p className="text-center text-reddit-textMuted">
                                            Your posts will appear here for selection
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {currentStep === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold mb-2">Set Campaign Duration</h2>
                                <p className="text-reddit-textMuted">Choose how long you want your campaign to run</p>
                            </div>

                            <div className="max-w-xl mx-auto">
                                <div className="bg-reddit-card border border-reddit-border rounded-2xl p-6 mb-6">
                                    <label className="block mb-4">
                                        <span className="text-sm font-semibold mb-3 block flex items-center gap-2">
                                            <Clock size={16} className="text-reddit-orange" />
                                            Campaign Duration
                                        </span>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="range"
                                                min="1"
                                                max="30"
                                                value={duration}
                                                onChange={(e) => setDuration(parseInt(e.target.value))}
                                                className="flex-1 h-2 bg-reddit-border rounded-lg appearance-none cursor-pointer accent-reddit-orange"
                                            />
                                            <div className="bg-reddit-cardHover border border-reddit-border rounded-lg px-4 py-2 min-w-[80px] text-center">
                                                <span className="text-xl font-bold">{duration}</span>
                                                <span className="text-sm text-reddit-textMuted ml-1">days</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-xs text-reddit-textMuted mt-2">
                                            <span>1 day</span>
                                            <span>30 days</span>
                                        </div>
                                    </label>
                                </div>

                                {/* Cost Summary */}
                                <div className="bg-reddit-card border border-reddit-border rounded-2xl p-6">
                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                        <BarChart3 size={18} className="text-reddit-orange" />
                                        Campaign Summary
                                    </h3>

                                    <div className="space-y-3">
                                        <div className="flex justify-between py-2">
                                            <span className="text-reddit-textMuted">Selected Plan</span>
                                            <span className="font-semibold">{selectedPlan?.name}</span>
                                        </div>
                                        <div className="flex justify-between py-2">
                                            <span className="text-reddit-textMuted">Daily Cost</span>
                                            <span className="font-semibold">₦{selectedPlan?.price.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between py-2">
                                            <span className="text-reddit-textMuted">Duration</span>
                                            <span className="font-semibold">{duration} {duration === 1 ? 'day' : 'days'}</span>
                                        </div>
                                        <div className="flex justify-between py-2">
                                            <span className="text-reddit-textMuted">Est. Impressions</span>
                                            <span className="font-semibold text-blue-400">{estimatedImpressions.toLocaleString()}</span>
                                        </div>

                                        <div className="border-t border-reddit-border my-3" />

                                        <div className="flex justify-between py-2">
                                            <span className="font-bold text-lg">Total Cost</span>
                                            <span className="font-bold text-2xl text-reddit-orange">₦{totalCost.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold mb-2">Complete Payment</h2>
                                <p className="text-reddit-textMuted">Secure payment powered by trusted providers</p>
                            </div>

                            <div className="max-w-lg mx-auto">
                                <div className="bg-reddit-card border border-reddit-border rounded-2xl p-8 text-center">
                                    <div className="w-20 h-20 bg-reddit-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CreditCard size={36} className="text-reddit-orange" />
                                    </div>

                                    <h3 className="text-xl font-bold mb-2">Payment Integration</h3>
                                    <p className="text-reddit-textMuted mb-6">
                                        Payment processing is currently being set up. Your campaign details have been saved.
                                    </p>

                                    <div className="bg-reddit-cardHover rounded-xl p-4 mb-6">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-reddit-textMuted">Campaign</span>
                                            <span className="font-semibold">{selectedPlan?.name} Plan</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-reddit-textMuted">Amount</span>
                                            <span className="font-bold text-reddit-orange">₦{totalCost.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-center gap-2 text-sm text-reddit-textMuted">
                                        <Shield size={14} className="text-green-400" />
                                        <span>Your payment is secured and encrypted</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-10 pt-6 border-t border-reddit-border">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                        disabled={currentStep === 1}
                        className="px-6 py-3 rounded-full font-semibold border border-reddit-border hover:bg-reddit-cardHover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Back
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            if (currentStep < 4) {
                                setCurrentStep(currentStep + 1);
                            } else {
                                navigate('/ads/dashboard');
                            }
                        }}
                        disabled={currentStep === 1 && !selectedPlan}
                        className="px-8 py-3 rounded-full font-bold bg-reddit-orange hover:bg-reddit-orange/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {currentStep === 4 ? (
                            <>
                                Launch Campaign
                                <Rocket size={18} />
                            </>
                        ) : 'Continue'}
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default CreateAd;
