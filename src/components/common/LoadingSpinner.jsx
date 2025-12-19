import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 40, color = "#FF4500" }) => {
    return (
        <div className="flex items-center justify-center">
            <motion.div
                style={{
                    width: size,
                    height: size,
                    border: `3px solid ${color}30`,
                    borderTop: `3px solid ${color}`,
                    borderRadius: "50%",
                }}
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
        </div>
    );
};

export default LoadingSpinner;
