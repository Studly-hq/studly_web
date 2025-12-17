import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, BarChart3, Rocket, Gem } from 'lucide-react';

const CreateAd = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [duration, setDuration] = useState(1);

    const steps = [
        { id: 1, name: 'Choose Plan' },
        { id: 2, name: 'Select Content' },
        { id: 3, name: 'Duration & Budget' },
        { id: 4, name: 'Payment' }
    ];

    const plans = [
        {
            id: 'starter',
            name: 'Starter',
            icon: BarChart3,
            price: 500,
            impressions: '1,000',
            features: [
                'Feed placement',
                'Basic analytics',
                '24/7 Support'
            ]
        },
        {
            id: 'growth',
            name: 'Growth',
            icon: Rocket,
            price: 1500,
            impressions: '5,000',
            popular: true,
            features: [
                'Feed + Sidebar placement',
                'Advanced analytics',
                'Priority support',
                'A/B testing'
            ]
        },
        {
            id: 'premium',
            name: 'Premium',
            icon: Gem,
            price: 3000,
            impressions: '15,000',
            features: [
                'All placements',
                'Full analytics dashboard',
                'Dedicated account manager',
                'Custom targeting'
            ]
        }
    ];

    const totalCost = selectedPlan ? selectedPlan.price * duration : 0;

    return (
        <div className="min-h-screen bg-reddit-bg text-white">
            {/* Header */}
            <div className="sticky top-0 bg-reddit-bg/95 backdrop-blur-md z-10 px-4 py-3 flex items-center gap-6 border-b border-reddit-border">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 rounded-full hover:bg-reddit-cardHover transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="font-bold text-xl">Create Advertisement</h1>
            </div>

            {/* Progress Steps */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="flex items-center justify-between mb-8">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-1">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${currentStep >= step.id
                                    ? 'bg-reddit-orange text-white'
                                    : 'bg-reddit-cardHover text-gray-500'
                                    }`}>
                                    {currentStep > step.id ? <Check size={20} /> : step.id}
                                </div>
                                <span className={`text-xs mt-2 ${currentStep >= step.id ? 'text-white' : 'text-gray-500'
                                    }`}>
                                    {step.name}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`h-0.5 flex-1 mx-2 ${currentStep > step.id ? 'bg-reddit-orange' : 'bg-reddit-border'
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
                            className="space-y-4"
                        >
                            <h2 className="text-2xl font-bold mb-6">Choose Your Plan</h2>

                            {/* Plans Table */}
                            <div className="bg-reddit-card rounded-2xl overflow-hidden border border-reddit-border">
                                {/* Header Row */}
                                <div className="grid grid-cols-4 gap-4 p-6 border-b border-reddit-border bg-reddit-cardHover/30">
                                    <div className="text-sm font-bold text-gray-400">Features</div>
                                    {plans.map((plan) => (
                                        <div key={plan.id} className="text-center">
                                            <div className="flex justify-center mb-2">
                                                <div className="w-10 h-10 bg-reddit-orange/10 rounded-full flex items-center justify-center">
                                                    <plan.icon size={20} className="text-reddit-orange" />
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                                            {plan.popular && (
                                                <span className="text-xs bg-reddit-orange px-2 py-0.5 rounded-full">Popular</span>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Price Row */}
                                <div className="grid grid-cols-4 gap-4 p-6 border-b border-reddit-border">
                                    <div className="text-sm font-medium text-gray-400">Price</div>
                                    {plans.map((plan) => (
                                        <div key={plan.id} className="text-center">
                                            <div className="text-2xl font-bold">₦{plan.price.toLocaleString()}</div>
                                            <div className="text-xs text-gray-500">/day</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Impressions Row */}
                                <div className="grid grid-cols-4 gap-4 p-6 border-b border-reddit-border">
                                    <div className="text-sm font-medium text-gray-400">Daily Impressions</div>
                                    {plans.map((plan) => (
                                        <div key={plan.id} className="text-center text-sm font-medium">
                                            {plan.impressions}
                                        </div>
                                    ))}
                                </div>

                                {/* Features Rows */}
                                {['Feed placement', 'Sidebar placement', 'Basic analytics', 'Advanced analytics', 'Priority support', 'A/B testing', 'Dedicated account manager', 'Custom targeting'].map((feature) => (
                                    <div key={feature} className="grid grid-cols-4 gap-4 p-4 border-b border-reddit-border last:border-b-0">
                                        <div className="text-sm text-gray-400">{feature}</div>
                                        {plans.map((plan) => (
                                            <div key={plan.id} className="text-center">
                                                {plan.features.some(f => f.toLowerCase().includes(feature.toLowerCase())) ? (
                                                    <Check size={18} className="text-reddit-orange mx-auto" />
                                                ) : (
                                                    <span className="text-gray-600">—</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ))}

                                {/* Select Button Row */}
                                <div className="grid grid-cols-4 gap-4 p-6 bg-reddit-cardHover/30">
                                    <div></div>
                                    {plans.map((plan) => (
                                        <div key={plan.id} className="text-center">
                                            <button
                                                onClick={() => setSelectedPlan(plan)}
                                                className={`w-full py-2.5 rounded-full font-bold transition-all ${selectedPlan?.id === plan.id
                                                        ? 'bg-reddit-orange text-white'
                                                        : 'bg-reddit-cardHover border border-reddit-border text-white hover:bg-reddit-border'
                                                    }`}
                                            >
                                                {selectedPlan?.id === plan.id ? 'Selected' : 'Select'}
                                            </button>
                                        </div>
                                    ))}
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
                            <h2 className="text-2xl font-bold mb-6">Select Content</h2>
                            <div className="bg-reddit-card rounded-2xl p-8 text-center">
                                <p className="text-gray-400 mb-4">Choose an existing post or create a new one for your advertisement</p>
                                <div className="flex gap-4 justify-center">
                                    <button className="bg-reddit-cardHover hover:bg-reddit-border px-6 py-3 rounded-full font-bold transition-colors">
                                        Choose Existing Post
                                    </button>
                                    <button className="bg-reddit-orange hover:bg-reddit-orange/90 px-6 py-3 rounded-full font-bold transition-colors">
                                        Create New Post
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h2 className="text-2xl font-bold mb-6">Duration & Budget</h2>
                            <div className="bg-reddit-card rounded-2xl p-6">
                                <label className="block mb-4">
                                    <span className="text-sm font-bold mb-2 block">Campaign Duration (days)</span>
                                    <input
                                        type="number"
                                        min="1"
                                        value={duration}
                                        onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                                        className="w-full bg-reddit-input border border-reddit-border rounded-lg px-4 py-3 text-white"
                                    />
                                </label>

                                <div className="bg-reddit-cardHover rounded-lg p-4 mt-6">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-400">Daily Cost:</span>
                                        <span className="font-bold">₦{selectedPlan?.price.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-400">Duration:</span>
                                        <span className="font-bold">{duration} {duration === 1 ? 'day' : 'days'}</span>
                                    </div>
                                    <div className="border-t border-reddit-border my-3" />
                                    <div className="flex justify-between text-lg">
                                        <span className="font-bold">Total Cost:</span>
                                        <span className="font-bold text-reddit-orange">₦{totalCost.toLocaleString()}</span>
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
                            <h2 className="text-2xl font-bold mb-6">Payment</h2>
                            <div className="bg-reddit-card rounded-2xl p-6 text-center">
                                <p className="text-gray-400">Payment integration coming soon...</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                    <button
                        onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                        disabled={currentStep === 1}
                        className="px-6 py-3 rounded-full font-bold border border-reddit-border hover:bg-reddit-cardHover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Back
                    </button>
                    <button
                        onClick={() => {
                            if (currentStep < 4) {
                                setCurrentStep(currentStep + 1);
                            } else {
                                // Submit campaign
                                navigate('/ads/dashboard');
                            }
                        }}
                        disabled={currentStep === 1 && !selectedPlan}
                        className="px-6 py-3 rounded-full font-bold bg-reddit-orange hover:bg-reddit-orange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {currentStep === 4 ? 'Launch Campaign' : 'Continue'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateAd;
