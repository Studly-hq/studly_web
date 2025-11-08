import React from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '../utils/animations';

export const Settings = () => {
  return (
    <motion.div
      {...pageTransition}
      className="p-8"
    >
      <h1 className="text-4xl font-bold text-white mb-4">
        Settings
      </h1>
      <p className="text-gray-400">
        Settings page coming soon...
      </p>
    </motion.div>
  );
};