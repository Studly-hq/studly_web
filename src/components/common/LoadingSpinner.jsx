import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 40, color = "#FF4500" }) => {
    // Calculate dot size relative to container size
    const dotSize = size * 0.25;

    const dotTransition = {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
    };

    return (
        <div
            className="flex items-center justify-center gap-1.5"
            style={{ width: size, height: size }}
        >
            <motion.div
                style={{
                    width: dotSize,
                    height: dotSize,
                    backgroundColor: color,
                    borderRadius: "50%",
                }}
                animate={{
                    y: [0, -dotSize]
                }}
                transition={dotTransition}
            />
            <motion.div
                style={{
                    width: dotSize,
                    height: dotSize,
                    backgroundColor: color,
                    borderRadius: "50%",
                }}
                animate={{
                    y: [0, -dotSize]
                }}
                transition={{
                    ...dotTransition,
                    delay: 0.1
                }}
            />
            <motion.div
                style={{
                    width: dotSize,
                    height: dotSize,
                    backgroundColor: color,
                    borderRadius: "50%",
                }}
                animate={{
                    y: [0, -dotSize]
                }}
                transition={{
                    ...dotTransition,
                    delay: 0.2
                }}
            />
        </div>
    );
};

export default LoadingSpinner;
