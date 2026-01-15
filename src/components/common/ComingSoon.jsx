import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const ComingSoon = ({ title = "Coming Soon", description = "We're working hard to bring you this feature. Stay tuned!" }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-24 h-24 bg-reddit-card rounded-full flex items-center justify-center mb-6 shadow-lg border border-reddit-border"
            >
                <Clock size={48} className="text-reddit-orange" />
            </motion.div>

            <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-3xl md:text-4xl font-bold text-reddit-text mb-4"
            >
                {title}
            </motion.h1>

            <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-reddit-textMuted text-lg max-w-md"
            >
                {description}
            </motion.p>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-8"
            >
                <div className="h-1 w-32 bg-gradient-to-r from-transparent via-reddit-orange to-transparent opacity-50 mx-auto" />
            </motion.div>
        </div>
    );
};

export default ComingSoon;
