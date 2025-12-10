import React from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Video, Code } from 'lucide-react';

const MediaScene = ({ scene }) => {
  const { mediaType, url, alt, caption } = scene;

  const renderMedia = () => {
    switch (mediaType) {
      case 'image':
        return (
          <div className="relative">
            <img
              src={url}
              alt={alt || 'Media content'}
              className="w-full rounded-lg border border-reddit-border"
              loading="lazy"
            />
            {caption && (
              <p className="text-sm text-reddit-placeholder mt-2 text-center italic">
                {caption}
              </p>
            )}
          </div>
        );

      case 'video':
        return (
          <div className="relative aspect-video">
            <video
              src={url}
              controls
              className="w-full h-full rounded-lg border border-reddit-border"
            >
              Your browser does not support the video tag.
            </video>
            {caption && (
              <p className="text-sm text-reddit-placeholder mt-2 text-center italic">
                {caption}
              </p>
            )}
          </div>
        );

      case 'embed':
        return (
          <div className="relative aspect-video">
            <iframe
              src={url}
              title={alt || 'Embedded content'}
              className="w-full h-full rounded-lg border border-reddit-border"
              allowFullScreen
            />
            {caption && (
              <p className="text-sm text-reddit-placeholder mt-2 text-center italic">
                {caption}
              </p>
            )}
          </div>
        );

      default:
        return (
          <div className="bg-reddit-cardHover border border-reddit-border rounded-lg p-8 text-center">
            <Code className="w-12 h-12 text-reddit-placeholder mx-auto mb-2" />
            <p className="text-reddit-placeholder">Unsupported media type</p>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="space-y-4"
    >
      {renderMedia()}
    </motion.div>
  );
};

export default MediaScene;
