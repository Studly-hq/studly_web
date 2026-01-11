import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Smile, X, User } from 'lucide-react';
import { useStudyGram } from '../../context/StudyGramContext';
import { toast } from 'sonner';
import LoadingSpinner from '../common/LoadingSpinner';
import EmojiPicker from 'emoji-picker-react';

const FeedComposer = () => {
    const { currentUser, isAuthenticated, createPost, setShowAuthModal } = useStudyGram();
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);
    const [avatarError, setAvatarError] = useState(false);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size too large (max 5MB)");
                return;
            }
            const url = URL.createObjectURL(file);
            setSelectedImage({ file, url });
        }
    };

    const removeImage = () => {
        if (selectedImage) {
            URL.revokeObjectURL(selectedImage.url);
            setSelectedImage(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const onEmojiClick = (emojiObject) => {
        setContent(prev => prev + emojiObject.emoji);
        setShowEmojiPicker(false);
    };

    const handleSubmit = async () => {
        if (!isAuthenticated) {
            setShowAuthModal(true);
            return;
        }
        if (!content.trim() && !selectedImage) return;

        setIsSubmitting(true);
        try {
            const postData = {
                content,
                images: selectedImage ? [{ url: selectedImage.url }] : []
            };
            await createPost(postData);
            setContent('');
            removeImage();
            toast.success("Post created successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to create post");
        } finally {
            setIsSubmitting(false);
        }
    };

    const autoResize = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    };

    return (
        <div className="border-b border-reddit-border p-4">
            <div className="flex gap-3">
                {currentUser?.avatar && !avatarError ? (
                    <img
                        src={currentUser.avatar}
                        alt={currentUser?.displayName || "User"}
                        onError={() => setAvatarError(true)}
                        className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0 object-cover"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-reddit-cardHover flex-shrink-0 flex items-center justify-center">
                        <User size={20} className="text-reddit-textMuted" />
                    </div>
                )}
                <div className="flex-1">
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value);
                            autoResize();
                        }}
                        onClick={() => !isAuthenticated && setShowAuthModal(true)}
                        placeholder="Say something..."
                        className="w-full bg-transparent text-reddit-text placeholder-gray-500 text-[15px] resize-none outline-none min-h-[40px]"
                        rows={1}
                    />

                    <AnimatePresence>
                        {selectedImage && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="relative mt-2 rounded-xl overflow-hidden max-w-sm"
                            >
                                <img src={selectedImage.url} alt="Preview" className="w-full h-auto" />
                                <button
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 bg-black/70 p-1 rounded-full text-white hover:bg-black/90 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-reddit-border/30 relative">
                        <div className="flex items-center gap-1">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                onClick={() => isAuthenticated ? fileInputRef.current?.click() : setShowAuthModal(true)}
                                className="p-2 rounded-full hover:bg-reddit-cardHover transition-colors group"
                                title="Media"
                            >
                                <Image size={20} className="text-reddit-orange group-hover:opacity-80" />
                            </button>
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        if (!isAuthenticated) {
                                            setShowAuthModal(true);
                                            return;
                                        }
                                        setShowEmojiPicker(!showEmojiPicker);
                                    }}
                                    className={`p-2 rounded-full hover:bg-reddit-cardHover transition-colors group ${showEmojiPicker ? 'bg-reddit-cardHover' : ''}`}
                                    title="Emoji"
                                >
                                    <Smile size={20} className="text-reddit-orange group-hover:opacity-80" />
                                </button>
                                {showEmojiPicker && (
                                    <div className="absolute top-full left-0 mt-2 z-50">
                                        <div className="fixed inset-0 z-40" onClick={() => setShowEmojiPicker(false)} />
                                        <div className="relative z-50">
                                            <EmojiPicker
                                                onEmojiClick={onEmojiClick}
                                                theme="dark"
                                                width={320}
                                                height={400}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={(!content.trim() && !selectedImage) || isSubmitting}
                            className={`bg-reddit-orange hover:bg-reddit-orange/90 text-white font-bold px-4 py-1.5 rounded-full transition-all text-[15px] flex items-center gap-2 ${(!content.trim() && !selectedImage) || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {isSubmitting && <LoadingSpinner size={16} color="#ffffff" />}
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedComposer;
