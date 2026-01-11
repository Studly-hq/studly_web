import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CookiePolicy = () => {
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
                <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>

                <div className="space-y-6 text-gray-300">
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">1. What Are Cookies</h2>
                        <p>Cookies are small pieces of text sent to your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third-party to recognize you and make your next visit easier and the Service more useful to you.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Cookies</h2>
                        <p>We use cookies for the following purposes: to enable certain functions of the Service, to provide analytics, to store your preferences, and to enable advertisements delivery, including behavioral advertising.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">3. Your Choices Regarding Cookies</h2>
                        <p>If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser.</p>
                        <p className="mt-2 text-sm text-gray-400">Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer, you may not be able to store your preferences, and some of our pages might not display properly.</p>
                    </section>

                    <div className="pt-6 text-sm text-gray-500 border-t border-reddit-border">
                        Last updated: January 2026
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CookiePolicy;
