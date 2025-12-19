import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Feed from '../components/feed/Feed';
import FeedComposer from '../components/feed/FeedComposer';

const Home = () => {
  const [activeTab, setActiveTab] = useState('foryou');

  const tabs = [
    { id: 'foryou', label: 'For you' },
    { id: 'following', label: 'Following' }
  ];

  return (
    <div>
      <div className="flex border-b border-reddit-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 relative py-4 text-[15px] font-bold transition-colors hover:bg-reddit-cardHover/30"
          >
            <span className={activeTab === tab.id ? 'text-white' : 'text-gray-500'}>
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-reddit-orange rounded-full"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
      <FeedComposer />
      <Feed activeTab={activeTab} />
    </div>
  );
};

export default Home;
