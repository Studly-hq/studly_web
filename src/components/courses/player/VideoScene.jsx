import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCoursePlayer } from '../../../context/CoursePlayerContext';

const VideoScene = ({ scene }) => {
    const { videoId, title, description } = scene;
    const { completeScene } = useCoursePlayer();

    useEffect(() => {
        // Auto-complete video scenes when loaded for now (can be enhanced to track progress later)
        completeScene(scene.id);
    }, [scene.id, completeScene]);

    return (
        <div className="max-w-4xl mx-auto w-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full"
            >
                {/* Video Container (16:9 Aspect Ratio) */}
                <div className="relative w-full pt-[56.25%] rounded-xl overflow-hidden bg-black/50 border border-white/10 shadow-2xl mb-8 group">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10" />
                    <iframe
                        className="absolute top-0 left-0 w-full h-full z-0"
                        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                        title={title || "Video Lesson"}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>

                {/* Content Below Video */}
                <div className="space-y-4 px-1">
                    {title && (
                        <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
                    )}
                    {description && (
                        <p className="text-reddit-textMuted text-lg leading-relaxed max-w-3xl">{description}</p>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default VideoScene;
