import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudyGram } from '../../context/StudyGramContext';

const TopLoadingBar = () => {
    const { loadingProgress } = useStudyGram();

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] h-1 pointer-events-none">
            <AnimatePresence>
                {loadingProgress > 0 && (
                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: `${loadingProgress}%` }}
                        exit={{ opacity: 0 }}
                        transition={{ ease: "easeOut", duration: 0.2 }}
                        className="h-full bg-reddit-orange shadow-[0_0_10px_rgba(255,69,0,0.5)]"
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default TopLoadingBar;
