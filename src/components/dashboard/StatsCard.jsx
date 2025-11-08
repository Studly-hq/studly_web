import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Zap } from 'lucide-react';
import { Card } from '../ui/Card';
import { slideUp } from '../../utils/animations';

export const StatsCard = ({ type, value }) => {
  const config = {
    streak: {
      icon: Flame,
      label: 'Daily Streak',
      color: 'text-orange-400',
      unit: 'Days'
    },
    aura: {
      icon: Zap,
      label: 'Aura Points',
      color: 'text-primary',
      unit: 'Pts'
    }
  };
  
  const { icon: Icon, label, color, unit } = config[type];
  
  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      animate="visible"
    >
      <Card className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">{label}</span>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <div className="flex items-baseline gap-2">
          <motion.span 
            className="text-4xl font-bold text-white"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            {value}
          </motion.span>
          <span className="text-lg text-gray-400">{unit}</span>
        </div>
      </Card>
    </motion.div>
  );
};