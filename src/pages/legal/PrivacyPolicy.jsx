import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-[800px] mx-auto px-4 py-8 text-reddit-text"
        >
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-reddit-textMuted hover:text-reddit-orange transition-colors mb-6"
            >
                <ArrowLeft size={20} />
                Back
            </button>

            <div className="bg-reddit-card border border-reddit-border rounded-lg p-8">
                <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

                <div className="space-y-6 text-gray-300">
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
                        <p>We collect information you provide directly to us, such as when you create an account, update your profile, post content, or communicate with us.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
                        <p>We use the information we collect to operate, maintain, and provide the features and functionality of the Service, to analyze how the Service is used, and to communicate with you.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">3. Sharing of Your Information</h2>
                        <p>We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">4. Data Security</h2>
                        <p>We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information.</p>
                    </section>

                    <div className="pt-6 text-sm text-gray-500 border-t border-reddit-border">
                        Last updated: January 2026
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PrivacyPolicy;
