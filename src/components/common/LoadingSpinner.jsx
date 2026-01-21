import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 24, color = "#FF4500", strokeWidth = 2.5 }) => {
    return (
        <div
            className="flex items-center justify-center"
            style={{ width: size, height: size }}
        >
            <motion.div
                style={{
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    border: `${strokeWidth}px solid ${color}20`,
                    borderTopColor: color,
                }}
                animate={{ rotate: 360 }}
                transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />
        </div>
    );
};

export default LoadingSpinner;
