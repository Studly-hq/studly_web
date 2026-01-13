import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
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

            <div className="">
                <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

                <div className="space-y-6 text-gray-300">
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
                        <p>By accessing and using Studly, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">2. User Conduct</h2>
                        <p>You agree to use Studly only for lawful purposes. You represent, warrant, and agree that no materials of any kind submitted through your account or otherwise posted or shared by you through the Service will violate or infringe upon the rights of any third party.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">3. Intellectual Property</h2>
                        <p>The content, organization, graphics, design, compilation, and other matters related to the Site are protected under applicable copyrights, trademarks, and other proprietary (including but not limited to intellectual property) rights.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">4. Termination</h2>
                        <p>We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">5. Changes to Terms</h2>
                        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.</p>
                    </section>

                    <div className="pt-6 text-sm text-gray-500 border-t border-reddit-border">
                        Last updated: January 2026
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TermsOfService;
