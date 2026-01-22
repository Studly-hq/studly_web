import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Image,
  Type,
  Sparkles,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useUI } from "../../context/UIContext";
import { useFeed } from "../../context/FeedContext";
import { toast } from "sonner";
import { uploadMultipleToCloudinary } from "../../utils/uploadToCloudinary";
import CircularProgress from "../common/CircularProgress";

const MAX_IMAGES = 10;

// Humorous loading messages (50 messages)
const LOADING_MESSAGES = [
  "Brewing your post...",
  "Adding extra sauce...",
  "Polishing the pixels...",
  "Summoning the vibes...",
  "Sprinkling some magic...",
  "Almost there, chill...",
  "Making it beautiful...",
  "Cooking up greatness...",
  "Loading awesomeness...",
  "Hang tight, legend...",
  "Doing the thing...",
  "Making magic happen...",
  "Just a sec...",
  "Working on it...",
  "Vibes are loading...",
  "Patience, young one...",
  "Good things coming...",
  "Trust the process...",
  "Almost ready now...",
  "Perfecting the details...",
  "Sending good energy...",
  "Creating your masterpiece...",
  "Fine-tuning things...",
  "Worth the wait...",
  "Nearly there now...",
  "Spicing things up...",
  "Adding the finishing touches...",
  "Making it pop...",
  "Optimizing for greatness...",
  "Loading the good stuff...",
  "Preparing for takeoff...",
  "Getting things ready...",
  "Hold on tight...",
  "Processing your genius...",
  "Assembling the magic...",
  "Crafting with care...",
  "Wrapping it up...",
  "Crossing the t's...",
  "Dotting the i's...",
  "Making it shine...",
  "Adding some sparkle...",
  "Tuning the engines...",
  "Uploading your thoughts...",
  "Spreading the word...",
  "Beaming it up...",
  "Sending to the cloud...",
  "Making waves...",
  "Dropping heat...",
  "Cooking something special...",
  "You're gonna love this..."
];

const CreatePostModal = () => {
  const {
    showCreatePostModal,
    setShowCreatePostModal,
  } = useUI();

  const { createPost } = useFeed();
  const { currentUser } = useAuth();

  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [postType, setPostType] = useState("text");
  const [previewIndex, setPreviewIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const fileInputRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const messageIntervalRef = useRef(null);

  const handleClose = () => {
    if (isSubmitting) return; // Prevent closing while posting
    images.forEach((img) => URL.revokeObjectURL(img.url));
    setShowCreatePostModal(false);
    setContent("");
    setImages([]);
    setPostType("text");
    setPreviewIndex(0);
    setUploadProgress(0);
  };

  // Start progress animation
  const startProgress = () => {
    setUploadProgress(0);
    setLoadingMessage(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);
    progressIntervalRef.current = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 85) return prev; // Cap at 85% until complete
        // Smoother, slower increments
        return prev + (Math.random() * 5 + 2);
      });
    }, 400);
    // Rotate messages every 4 seconds
    messageIntervalRef.current = setInterval(() => {
      setLoadingMessage(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);
    }, 4000);
  };

  // Complete progress animation
  const completeProgress = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    if (messageIntervalRef.current) {
      clearInterval(messageIntervalRef.current);
    }
    setUploadProgress(100);
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const remainingSlots = MAX_IMAGES - images.length;
    if (remainingSlots <= 0) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    const filesToProcess = files.slice(0, remainingSlots);
    const newImages = [];

    filesToProcess.forEach((file) => {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return;
      }
      const url = URL.createObjectURL(file);
      newImages.push({ url, alt: file.name, file, id: `${Date.now()}-${Math.random()}` });
    });

    if (newImages.length > 0) {
      setImages((prev) => [...prev, ...newImages]);
    }

    if (files.length > remainingSlots) {
      toast.info(`Only ${remainingSlots} more image(s) can be added`);
    }

    // Determine post type based on number of images
    const totalImages = images.length + newImages.length;
    if (totalImages === 1) {
      setPostType("single-image");
    } else if (totalImages > 1) {
      setPostType("carousel");
    }

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index) => {
    // Clean up blob URL for removed image
    const imageToRemove = images[index];
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.url);
    }

    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);

    // Update post type
    if (newImages.length === 0) {
      setPostType("text");
    } else if (newImages.length === 1) {
      setPostType("single-image");
      setPreviewIndex(0);
    } else {
      if (previewIndex >= newImages.length) {
        setPreviewIndex(newImages.length - 1);
      }
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() && images.length === 0) return;
    if (isSubmitting) return;

    setIsSubmitting(true);
    startProgress();

    const postContent = content.trim();
    const imagesToUpload = [...images];
    const hasImages = imagesToUpload.length > 0;

    try {
      let uploadedImageUrls = [];

      if (hasImages) {
        const files = imagesToUpload.map(img => img.file);
        uploadedImageUrls = await uploadMultipleToCloudinary(files);
      }

      const postData = {
        content: postContent,
        media: uploadedImageUrls,
        hashtags: extractHashtags(postContent)
      };

      await createPost(postData);
      completeProgress();
      toast.success("Post created successfully!");

      // Clean up and close immediately after success
      images.forEach((img) => URL.revokeObjectURL(img.url));
      setShowCreatePostModal(false);
      setContent("");
      setImages([]);
      setPostType("text");
      setPreviewIndex(0);
      setUploadProgress(0);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Post creation error:", error);
      toast.error(error.message || "Failed to create post. Please try again.");
      completeProgress();
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const extractHashtags = (text) => {
    const hashtagRegex = /#(\w+)/g;
    const matches = text.match(hashtagRegex);
    return matches ? matches.map((tag) => tag.slice(1)) : [];
  };

  if (!showCreatePostModal) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="bg-reddit-card border border-reddit-border rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden relative"
        >
          {/* Progress Overlay */}
          <AnimatePresence>
            {isSubmitting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-reddit-card/95 backdrop-blur-sm z-20 flex items-center justify-center"
              >
                <div className="flex flex-col items-center gap-4">
                  <CircularProgress progress={uploadProgress} size={100} strokeWidth={6} />
                  <div className="h-7 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={loadingMessage}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="block text-reddit-text text-lg font-medium"
                      >
                        {loadingMessage}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-reddit-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-reddit-orange rounded flex items-center justify-center">
                <Sparkles className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-reddit-text">
                  Create Post
                </h2>
                <p className="text-reddit-textMuted text-sm">
                  Share your knowledge
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              onClick={handleClose}
              className="text-reddit-textMuted hover:text-reddit-text transition-colors duration-200 p-2 rounded-full hover:bg-reddit-cardHover"
            >
              <X size={20} />
            </motion.button>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3 px-6 pt-4">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.displayName}
              className="w-12 h-12 rounded-full border-2 border-reddit-orange"
            />
            <div>
              <h3 className="text-reddit-text font-semibold">
                {currentUser?.displayName}
              </h3>
              <p className="text-reddit-textMuted text-sm">
                @{currentUser?.username}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Text Input */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind? Share your study notes, tips, or questions... Use #hashtags to categorize!"
              disabled={isSubmitting}
              className="w-full bg-transparent text-reddit-text placeholder-reddit-textMuted outline-none resize-none text-lg min-h-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
              autoFocus
              style={{
                border: "none",
                outline: "none",
                boxShadow: "none",
              }}
            />

            {/* Image Preview */}
            {images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4"
              >
                <div className="relative bg-black rounded-2xl overflow-hidden group">
                  <div className="aspect-[4/3] relative">
                    <img
                      src={images[previewIndex].url}
                      alt={images[previewIndex].alt}
                      className="w-full h-full object-cover"
                    />

                    {/* Remove Image Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => removeImage(previewIndex)}
                      className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors duration-200"
                    >
                      <Trash2 size={18} />
                    </motion.button>

                    {/* Carousel Navigation */}
                    {images.length > 1 && (
                      <>
                        {previewIndex > 0 && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setPreviewIndex(previewIndex - 1)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 backdrop-blur-sm text-white p-2 rounded-full transition-colors duration-200"
                          >
                            <ChevronLeft size={24} />
                          </motion.button>
                        )}

                        {previewIndex < images.length - 1 && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setPreviewIndex(previewIndex + 1)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 backdrop-blur-sm text-white p-2 rounded-full transition-colors duration-200"
                          >
                            <ChevronRight size={24} />
                          </motion.button>
                        )}

                        {/* Dots */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setPreviewIndex(index)}
                              className={`h-2 rounded-full transition-all duration-300 ${index === previewIndex
                                ? "bg-white w-6"
                                : "bg-white/50 w-2"
                                }`}
                            />
                          ))}
                        </div>

                        {/* Counter */}
                        <div className="absolute top-4 right-16 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                          {previewIndex + 1} / {images.length}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Add More Images */}
                {images.length < 10 && (
                  <motion.button
                    whileHover={{ scale: 1.01, y: -1 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-3 w-full bg-reddit-cardHover hover:bg-reddit-border border border-reddit-border text-reddit-text py-3 rounded transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Image size={18} />
                    <span>Add more images ({images.length}/10)</span>
                  </motion.button>
                )}
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-reddit-border bg-reddit-card/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSubmitting}
                  className={`flex items-center gap-2 px-4 py-2 rounded bg-reddit-cardHover hover:bg-reddit-border text-reddit-text transition-all duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Image size={18} />
                  <span className="text-sm font-medium">Image</span>
                </motion.button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>

              <div className="flex items-center gap-2">
                {postType === "text" && (
                  <Type size={18} className="text-reddit-textMuted" />
                )}
                {postType === "single-image" && (
                  <Image size={18} className="text-reddit-orange" />
                )}
                {postType === "carousel" && (
                  <div className="flex items-center gap-1 text-reddit-orange">
                    <Image size={18} />
                    <span className="text-xs font-medium">
                      ×{images.length}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <motion.button
              onClick={handleSubmit}
              disabled={
                (!content.trim() && images.length === 0) || isSubmitting
              }
              whileHover={{
                scale: content.trim() || images.length > 0 ? 1.01 : 1,
                y: content.trim() || images.length > 0 ? -1 : 0,
              }}
              whileTap={{
                scale: content.trim() || images.length > 0 ? 0.99 : 1,
              }}
              transition={{ duration: 0.2 }}
              className={`w-full py-3 rounded font-semibold transition-all duration-200 ${(content.trim() || images.length > 0) && !isSubmitting
                ? "bg-reddit-orange hover:bg-reddit-orange/90 text-white"
                : "bg-reddit-cardHover text-reddit-textMuted cursor-not-allowed"
                }`}
            >
              Post
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreatePostModal;
