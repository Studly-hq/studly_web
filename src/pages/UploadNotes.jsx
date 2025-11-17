import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  X,
  FileText,
  Hash,
  Type,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStudyGram } from '../context/StudyGramContext';

const UploadNotes = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useStudyGram();

  const [postType, setPostType] = useState('text'); // text, single-image, carousel
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  if (!isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      alt: ''
    }));

    if (postType === 'single-image') {
      setImages([newImages[0]]);
    } else {
      setImages(prev => [...prev, ...newImages].slice(0, 10)); // Max 10 images
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 5) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handlePost = async () => {
    setIsPosting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsPosting(false);
    // TODO: Create post in context
    navigate('/');
  };

  const canPost = content.trim().length > 0 && (
    postType === 'text' ||
    (postType === 'single-image' && images.length === 1) ||
    (postType === 'carousel' && images.length >= 2)
  );

  return (
    <div className="min-h-screen bg-black pt-16">
      {/* Header */}
      <div className="sticky top-16 z-10 bg-black/95 backdrop-blur-sm border-b border-gray-900">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => navigate(-1)}
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-gray-900 rounded-full transition-colors"
              >
                <ArrowLeft size={20} className="text-white" />
              </motion.button>
              <h1 className="text-xl font-bold text-white">Upload Notes</h1>
            </div>
            <motion.button
              onClick={handlePost}
              disabled={!canPost || isPosting}
              whileHover={canPost && !isPosting ? { scale: 1.05 } : {}}
              whileTap={canPost && !isPosting ? { scale: 0.95 } : {}}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/30 disabled:cursor-not-allowed text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              {isPosting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Post
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Post Type Selector */}
          <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Post Type
            </label>
            <div className="flex gap-2">
              {[
                { value: 'text', label: 'Text Only', icon: Type },
                { value: 'single-image', label: 'Single Image', icon: ImageIcon },
                { value: 'carousel', label: 'Carousel', icon: FileText }
              ].map(({ value, label, icon: Icon }) => (
                <motion.button
                  key={value}
                  onClick={() => {
                    setPostType(value);
                    setImages([]);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    postType === value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3 bg-gray-900/50 rounded-xl p-4 border border-gray-800">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.displayName}
              className="w-12 h-12 rounded-full border-2 border-blue-600"
            />
            <div>
              <p className="text-white font-bold">{currentUser?.displayName}</p>
              <p className="text-sm text-gray-400">@{currentUser?.username}</p>
            </div>
          </div>

          {/* Content Input */}
          <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your study notes, insights, or ask a question..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-600 transition-colors resize-none"
              rows={6}
            />
            <p className="text-xs text-gray-500 mt-2">
              {content.length} characters
            </p>
          </div>

          {/* Image Upload */}
          {postType !== 'text' && (
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Images {postType === 'carousel' && `(${images.length}/10)`}
              </label>

              {/* Upload Button */}
              <label className="block cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple={postType === 'carousel'}
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="border-2 border-dashed border-gray-700 hover:border-blue-600 rounded-lg p-8 text-center transition-colors"
                >
                  <Upload size={32} className="text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-400 font-medium">
                    Click to upload {postType === 'carousel' ? 'images' : 'an image'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {postType === 'carousel'
                      ? 'Upload 2-10 images for a carousel post'
                      : 'Upload a single image'
                    }
                  </p>
                </motion.div>
              </label>

              {/* Image Previews */}
              {images.length > 0 && (
                <div className={`mt-4 grid gap-3 ${
                  postType === 'carousel' ? 'grid-cols-3' : 'grid-cols-1'
                }`}>
                  <AnimatePresence>
                    {images.map((image, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative group"
                      >
                        <img
                          src={image.preview}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        <motion.button
                          onClick={() => removeImage(index)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} className="text-white" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {postType === 'carousel' && images.length > 0 && images.length < 2 && (
                <p className="text-sm text-yellow-500 mt-2">
                  Add at least one more image for a carousel post
                </p>
              )}
            </div>
          )}

          {/* Tags */}
          <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Tags (Optional)
            </label>

            {/* Tag Input */}
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Hash size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add a tag..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-600 transition-colors"
                  disabled={tags.length >= 5}
                />
              </div>
              <motion.button
                onClick={addTag}
                disabled={!tagInput.trim() || tags.length >= 5}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/30 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
              >
                Add
              </motion.button>
            </div>

            {/* Tag List */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="px-3 py-1.5 bg-blue-600/20 border border-blue-600/30 rounded-full text-blue-400 text-sm font-medium flex items-center gap-2"
                  >
                    #{tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-blue-300 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            <p className="text-xs text-gray-500 mt-2">
              Add up to 5 tags to help others discover your post
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UploadNotes;
