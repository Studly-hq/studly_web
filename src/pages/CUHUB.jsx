import { motion } from 'framer-motion';
import { ExternalLink, BookOpen } from 'lucide-react';

const CUHUB = () => {
    const CUHUB_URL = 'https://cuhub.usestudly.com';

    const handleAccessCUHUB = () => {
        window.location.href = CUHUB_URL;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full space-y-8"
            >
                {/* Icon */}
                <div className="flex justify-center">
                    <div className="w-20 h-20 bg-reddit-orange/10 rounded-full flex items-center justify-center text-reddit-orange">
                        <BookOpen size={40} />
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold text-reddit-text">
                        CUHUB Resources
                    </h1>
                    <p className="text-reddit-textMuted text-lg leading-relaxed">
                        Get practice resources for all your general courses.
                    </p>
                </div>

                {/* Action Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAccessCUHUB}
                    className="w-full bg-reddit-orange hover:bg-reddit-orange/90 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 text-lg"
                >
                    <span>Access CUHUB</span>
                    <ExternalLink size={20} />
                </motion.button>
            </motion.div>
        </div>
    );
};

export default CUHUB;
