import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Accessibility = () => {
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
                <h1 className="text-3xl font-bold mb-6">Accessibility Statement</h1>

                <div className="space-y-6 text-gray-300">
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">Commitment to Accessibility</h2>
                        <p>Studly is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3"> conformance Status</h2>
                        <p>The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA. Studly is partially conformant with WCAG 2.1 level AA.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">Feedback</h2>
                        <p>We welcome your feedback on the accessibility of Studly. Please let us know if you encounter accessibility barriers on Studly:</p>
                        <ul className="list-disc list-inside mt-2 ml-4">
                            <li>Email: support@studly.com</li>
                        </ul>
                    </section>

                    <div className="pt-6 text-sm text-gray-500 border-t border-reddit-border">
                        Last updated: January 2026
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Accessibility;
