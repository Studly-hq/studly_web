import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Smile, X, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFeed } from '../../context/FeedContext';
import { useUI } from '../../context/UIContext';
import { toast } from 'sonner';
import CircularProgress from '../common/CircularProgress';
import EmojiPicker from 'emoji-picker-react';
import { uploadMultipleToCloudinary } from '../../utils/uploadToCloudinary';

const MAX_IMAGES = 10;

const FeedComposer = () => {
    const { currentUser, isAuthenticated } = useAuth();
    const { createPost } = useFeed();
    const { setShowAuthModal, startLoading, finishLoading } = useUI();
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedImages, setSelectedImages] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);
    const [avatarError, setAvatarError] = useState(false);
    const progressIntervalRef = useRef(null);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const remainingSlots = MAX_IMAGES - selectedImages.length;
        if (remainingSlots <= 0) {
            toast.error(`Maximum ${MAX_IMAGES} images allowed`);
            return;
        }

        const filesToProcess = files.slice(0, remainingSlots);
        const newImages = [];

        filesToProcess.forEach((file) => {
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`${file.name} is too large (max 5MB)`);
                return;
            }
            const url = URL.createObjectURL(file);
            newImages.push({ file, url, id: `${Date.now()}-${Math.random()}` });
        });

        if (newImages.length > 0) {
            setSelectedImages((prev) => [...prev, ...newImages]);
        }

        if (files.length > remainingSlots) {
            toast.info(`Only ${remainingSlots} more image(s) can be added`);
        }

        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeImage = (imageId) => {
        setSelectedImages((prev) => {
            const imageToRemove = prev.find((img) => img.id === imageId);
            if (imageToRemove) {
                URL.revokeObjectURL(imageToRemove.url);
            }
            return prev.filter((img) => img.id !== imageId);
        });
    };

    const clearAllImages = () => {
        selectedImages.forEach((img) => URL.revokeObjectURL(img.url));
        setSelectedImages([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const onEmojiClick = (emojiObject) => {
        setContent(prev => prev + emojiObject.emoji);
        setShowEmojiPicker(false);
    };

    // Start progress animation
    const startProgress = () => {
        setUploadProgress(0);
        progressIntervalRef.current = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 90) return prev;
                return prev + Math.random() * 15;
            });
        }, 300);
    };

    // Complete progress animation
    const completeProgress = () => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
        }
        setUploadProgress(100);
        setTimeout(() => setUploadProgress(0), 500);
    };

    const handleSubmit = async () => {
        if (!isAuthenticated) {
            setShowAuthModal(true);
            return;
        }
        if (!content.trim() && selectedImages.length === 0) return;

        setIsSubmitting(true);
        startLoading();
        startProgress();

        // Store content locally before clearing
        const postContent = content.trim();
        const imagesToUpload = [...selectedImages];
        const hasImages = imagesToUpload.length > 0;

        try {
            let uploadedImageUrls = [];

            if (hasImages) {
                const files = imagesToUpload.map((img) => img.file);
                uploadedImageUrls = await uploadMultipleToCloudinary(files);
            }

            const postData = {
                content: postContent,
                media: uploadedImageUrls
            };
            await createPost(postData);
            setContent('');
            clearAllImages();
            completeProgress();
            toast.success("Post created successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to create post");
            completeProgress();
        } finally {
            setIsSubmitting(false);
            finishLoading();
        }
    };

    const autoResize = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    };

    const getGridClass = (count) => {
        if (count === 1) return 'grid-cols-1';
        if (count === 2) return 'grid-cols-2';
        if (count <= 4) return 'grid-cols-2';
        return 'grid-cols-3';
    };

    return (
        <div className="border-b border-reddit-border p-4 mt-4 relative">
            {/* Progress Overlay */}
            <AnimatePresence>
                {isSubmitting && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-reddit-bg/90 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg"
                    >
                        <div className="flex flex-col items-center gap-3">
                            <CircularProgress progress={uploadProgress} size={70} strokeWidth={5} />
                            <span className="text-reddit-textMuted text-sm font-medium">Posting...</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                        disabled={isSubmitting}
                        className="w-full bg-transparent text-reddit-text placeholder-gray-500 text-[15px] resize-none outline-none focus:outline-none focus:ring-0 focus-visible:outline-none min-h-[40px] disabled:opacity-50 disabled:cursor-not-allowed"
                        rows={1}
                    />

                    {/* Image Preview Grid */}
                    <AnimatePresence>
                        {selectedImages.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-3"
                            >
                                <div className={`grid ${getGridClass(selectedImages.length)} gap-2`}>
                                    {selectedImages.map((image, index) => (
                                        <motion.div
                                            key={image.id}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ delay: index * 0.05 }}
                                            className={`relative rounded-xl overflow-hidden bg-reddit-cardHover ${selectedImages.length === 1 ? 'max-h-[300px]' : 'aspect-square'
                                                }`}
                                        >
                                            <img
                                                src={image.url}
                                                alt={`Preview ${index + 1}`}
                                                className={`w-full h-full ${selectedImages.length === 1 ? 'object-contain' : 'object-cover'
                                                    }`}
                                            />
                                            <button
                                                onClick={() => removeImage(image.id)}
                                                className="absolute top-1 right-1 bg-black/70 hover:bg-black/90 p-1 rounded-full text-white transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                                {selectedImages.length > 1 && (
                                    <button
                                        onClick={clearAllImages}
                                        className="mt-2 text-xs text-reddit-textMuted hover:text-red-500 transition-colors"
                                    >
                                        Remove all ({selectedImages.length})
                                    </button>
                                )}
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
                                multiple
                                className="hidden"
                            />
                            <button
                                onClick={() => isAuthenticated ? fileInputRef.current?.click() : setShowAuthModal(true)}
                                disabled={selectedImages.length >= MAX_IMAGES || isSubmitting}
                                className={`p-2 rounded-full hover:bg-reddit-cardHover transition-colors group ${(selectedImages.length >= MAX_IMAGES || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                title={selectedImages.length >= MAX_IMAGES ? `Max ${MAX_IMAGES} images` : "Add images"}
                            >
                                <div className="relative">
                                    <Image size={20} className="text-reddit-orange group-hover:opacity-80" />
                                    {selectedImages.length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-reddit-orange text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                            {selectedImages.length}
                                        </span>
                                    )}
                                </div>
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
                                    disabled={isSubmitting}
                                    className={`p-2 rounded-full hover:bg-reddit-cardHover transition-colors group ${showEmojiPicker ? 'bg-reddit-cardHover' : ''} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                            disabled={(!content.trim() && selectedImages.length === 0) || isSubmitting}
                            className={`bg-reddit-orange hover:bg-reddit-orange/90 text-white font-bold px-4 py-1.5 rounded-full transition-all text-[15px] flex items-center gap-2 ${(!content.trim() && selectedImages.length === 0) || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
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
