import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStudyGram } from '../context/StudyGramContext';

const EditProfile = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useStudyGram();

  const [formData, setFormData] = useState({
    displayName: currentUser?.displayName || '',
    username: currentUser?.username || '',
    bio: currentUser?.bio || '',
    avatar: currentUser?.avatar || ''
  });

  const [isSaving, setIsSaving] = useState(false);

  if (!isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    // TODO: Update user profile in context
    navigate('/profile');
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-black pt-16">
      {/* Header */}
      <div className="sticky top-16 z-10 bg-black/95 backdrop-blur-sm border-b border-gray-900">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={handleCancel}
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-gray-900 rounded-full transition-colors"
              >
                <ArrowLeft size={20} className="text-white" />
              </motion.button>
              <h1 className="text-xl font-bold text-white">Edit Profile</h1>
            </div>
            <motion.button
              onClick={handleSave}
              disabled={isSaving}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800 space-y-6"
        >
          {/* Avatar Upload */}
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <img
                src={formData.avatar}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-blue-600"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute bottom-0 right-0 p-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-colors"
              >
                <Camera size={20} />
              </motion.button>
            </div>
            <p className="text-sm text-gray-400">Click the camera icon to change your profile picture</p>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Display Name
            </label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-600 transition-colors"
              placeholder="Your display name"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">@</span>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full pl-8 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-600 transition-colors"
                placeholder="username"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Your username is how others will find and mention you
            </p>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              maxLength={160}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-600 transition-colors resize-none"
              placeholder="Tell others about yourself..."
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-gray-500">
                Write a short bio to introduce yourself
              </p>
              <p className="text-xs text-gray-500">
                {formData.bio.length}/160
              </p>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="pt-6 border-t border-gray-800">
            <h3 className="text-sm font-semibold text-red-400 mb-3">Danger Zone</h3>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg font-semibold transition-colors"
            >
              Delete Account
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EditProfile;
