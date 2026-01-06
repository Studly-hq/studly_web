import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle, ArrowRight, Zap, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CompletionScreen = ({ topic, progress }) => {
    const navigate = useNavigate();

    // Mock abilities based on topic for visual flair
    // In a real app, these would come from the backend/topic data
    const abilities = [
        'Master basic concepts',
        'Apply knowledge in real-world scenarios',
        'Debug common issues effectively',
        'Build optimized solutions'
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-[#0B0B0C] flex flex-col items-center justify-center p-4 overflow-hidden"
        >
            {/* Background ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-reddit-orange/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-2xl w-full text-center">

                {/* Animated Trophy Icon */}
                <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                    className="w-24 h-24 mx-auto mb-8 relative"
                >
                    <div className="absolute inset-0 bg-reddit-orange/20 rounded-full blur-xl animate-pulse" />
                    <div className="relative bg-gradient-to-tr from-reddit-orange to-yellow-500 rounded-full p-6 shadow-2xl shadow-reddit-orange/30">
                        <Trophy className="w-full h-full text-white" />
                    </div>

                    {/* Floating stars */}
                    <motion.div
                        animate={{ y: [0, -10, 0], opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        className="absolute -top-4 -right-4"
                    >
                        <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, -8, 0], opacity: [0, 1, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
                        className="absolute -bottom-2 -left-6"
                    >
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    </motion.div>
                </motion.div>

                {/* Title & Description */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Course Completed!
                    </h1>
                    <p className="text-xl text-reddit-textMuted mb-8 max-w-lg mx-auto">
                        You've successfully mastered <span className="text-white font-semibold">{topic?.title}</span>.
                    </p>
                </motion.div>

                {/* Stats Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 max-w-lg mx-auto backdrop-blur-sm"
                >
                    <div className="grid grid-cols-2 gap-8">
                        <div className="text-center">
                            <p className="text-sm text-reddit-textMuted uppercase tracking-wider font-medium mb-1">Total Score</p>
                            <div className="text-3xl font-bold text-white flex items-center justify-center gap-2">
                                {progress?.score || 0}
                            </div>
                        </div>
                        <div className="text-center relative">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-8 bg-white/10" />
                            <p className="text-sm text-reddit-textMuted uppercase tracking-wider font-medium mb-1">Aura Earned</p>
                            <div className="text-3xl font-bold text-reddit-orange flex items-center justify-center gap-2">
                                <Zap className="w-5 h-5 fill-current" />
                                +{Math.floor((progress?.score || 0) * 1.5)}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Abilities Unlocked */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mb-12"
                >
                    <h3 className="text-sm text-reddit-textMuted uppercase tracking-wider font-bold mb-6">Unlocked Abilities</h3>
                    <div className="flex flex-wrap justify-center gap-3">
                        {abilities.map((ability, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.9 + (i * 0.1) }}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/90 text-sm"
                            >
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                {ability}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Action Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                >
                    <button
                        onClick={() => navigate('/courses')}
                        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-lg transition-all hover:scale-105"
                    >
                        <span>Continue Journey</span>
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </button>
                </motion.div>

            </div>
        </motion.div>
    );
};

export default CompletionScreen;
