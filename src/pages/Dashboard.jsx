import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MotivationalBanner } from '../components/dashboard/MotivationalBanner';
import { StatsCard } from '../components/dashboard/StatsCard';
import { ContinueLearning } from '../components/dashboard/ContinueLearning';
import { mockUser } from '../data/userData';
import { pageTransition } from '../utils/animations';

export const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      setUserData(mockUser);
      setLoading(false);
    }, 800);
  }, []);
  
  const currentCourse = userData?.recentCourses?.[0]?.title.split(' ')[0] || 'HTML';
  
  return (
    <motion.div
      {...pageTransition}
      className="p-8 space-y-8"
    >
      {/* Motivational Banner */}
      <MotivationalBanner 
        userName={userData?.displayName || 'there'} 
        currentCourse={currentCourse}
      />
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatsCard 
          type="streak" 
          value={userData?.streak || 0} 
        />
        <StatsCard 
          type="aura" 
          value={userData?.auraPoints || 0} 
        />
      </div>
      
      {/* Continue Learning Section */}
      <ContinueLearning 
        courses={userData?.recentCourses || []} 
        loading={loading}
      />
    </motion.div>
  );
};