import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { fadeIn } from '../../utils/animations';

export const MotivationalBanner = ({ userName, currentCourse }) => {
  const messages = [
    `You're on a roll, ${userName}! Ready to master more ${currentCourse} today?`,
    `Great progress, ${userName}! Let's continue learning ${currentCourse}!`,
    `Looking good, ${userName}! Time to dive deeper into ${currentCourse}?`,
    `Hey ${userName}! Ready to level up your ${currentCourse} skills?`,
  ];
  
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  
  
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <Card className="p-8 text-center glow-primary">
        <h2 className="text-3xl font-bold text-white">
          {randomMessage}
        </h2>
      </Card>
    </motion.div>
  );
};