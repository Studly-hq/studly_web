import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Image, Smile, Calendar, MapPin, BarChart3 } from 'lucide-react';
import { useStudyGram } from '../../context/StudyGramContext';

const FeedComposer = () => {
    const { currentUser, isAuthenticated, handleCreatePost, setShowAuthModal } = useStudyGram();
    const [activeTab, setActiveTab] = useState('foryou');

    const tabs = [
        { id: 'foryou', label: 'For you' },
        { id: 'following', label: 'Following' }
    ];

    const attachmentIcons = [
        { icon: Image, color: 'text-blue-500', label: 'Media' },
        { icon: Smile, color: 'text-blue-500', label: 'GIF' },
        { icon: BarChart3, color: 'text-blue-500', label: 'Poll' },
        { icon: Calendar, color: 'text-blue-500', label: 'Schedule' }
    ];

    return (
        <div className="border-b border-reddit-border">
            {/* Tabs */}
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

            {/* Composer */}
            <div className="flex gap-3 p-4 border-b border-reddit-border">
                <img
                    src={currentUser?.avatar || "https://ui-avatars.com/api/?name=Guest&background=1a1a1b&color=818384"}
                    alt={currentUser?.displayName || "Guest"}
                    className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0"
                />
                <div className="flex-1">
                    <div
                        onClick={() => isAuthenticated ? handleCreatePost() : setShowAuthModal(true)}
                        className="text-lg text-gray-500 cursor-text py-3 hover:text-gray-400 transition-colors"
                    >
                        Say something...
                    </div>

                    {/* Attachment Icons */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-reddit-border/50">
                        <div className="flex items-center gap-1">
                            {attachmentIcons.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => isAuthenticated ? handleCreatePost() : setShowAuthModal(true)}
                                    className="p-2 rounded-full hover:bg-blue-500/10 transition-colors group"
                                    title={item.label}
                                >
                                    <item.icon size={20} className={`${item.color} group-hover:opacity-80`} />
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => isAuthenticated ? handleCreatePost() : setShowAuthModal(true)}
                            className="bg-reddit-orange hover:bg-reddit-orange/90 text-white font-bold px-4 py-1.5 rounded-full transition-colors text-[15px] opacity-50 cursor-not-allowed"
                            disabled
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedComposer;
