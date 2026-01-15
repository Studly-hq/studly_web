import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Camera, Save, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStudyGram } from "../context/StudyGramContext";
import { toast } from "sonner";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { uploadAvatarToCloudinary } from "../utils/uploadAvatar";

const EditProfile = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, updateUser } = useStudyGram();

  const [formData, setFormData] = useState({
    name: currentUser?.name || currentUser?.displayName || "",
    username: currentUser?.username || "",
    bio: currentUser?.bio || "",
    avatar: currentUser?.avatar || "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Create preview for immediate feedback
    const preview = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, avatar: preview }));

    // Upload to Cloudinary
    setIsUploadingAvatar(true);
    try {
      const uploadedUrl = await uploadAvatarToCloudinary(file);
      setFormData((prev) => ({ ...prev, avatar: uploadedUrl }));
      toast.success("Avatar uploaded successfully!");
    } catch (err) {
      toast.error("Failed to upload avatar. Please try again.");
      console.error(err);
      // Revert to original avatar on error
      setFormData((prev) => ({ ...prev, avatar: currentUser?.avatar || "" }));
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Build payload with only non-empty fields to avoid "Invalid input data" error
      const payload = {};

      if (formData.name && formData.name.trim()) {
        payload.name = formData.name.trim();
      }

      if (formData.username && formData.username.trim() && formData.username.trim() !== currentUser?.username) {
        payload.username = formData.username.trim();
      }

      if (formData.bio && formData.bio.trim()) {
        payload.bio = formData.bio.trim();
      }

      if (formData.avatar && formData.avatar.trim()) {
        payload.avatar_url = formData.avatar.trim();
      }

      // Only send if there are fields to update
      if (Object.keys(payload).length === 0) {
        toast.error("No changes to save");
        setIsSaving(false);
        return;
      }

      await updateUser(payload);
      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Failed to update profile:", error);

      const errorMessage =
        error.response?.data?.error ||
        "Failed to update profile. Please try again.";

      if (errorMessage === "Username taken") {
        toast.error("Username is already taken. Please choose another one.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-reddit-bg pt-16">
      {/* Header */}
      <div className="sticky top-16 z-10 bg-reddit-bg/95 backdrop-blur-sm border-b border-reddit-border">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={handleCancel}
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-reddit-cardHover rounded-full transition-colors"
              >
                <ArrowLeft size={20} className="text-reddit-text" />
              </motion.button>
              <h1 className="text-xl font-bold text-reddit-text">
                Edit Profile
              </h1>
            </div>
            <motion.button
              onClick={handleSave}
              disabled={isSaving}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-reddit-orange hover:bg-reddit-orange/90 disabled:bg-reddit-orange/50 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              {isSaving ? (
                <>
                  <LoadingSpinner size={16} color="#ffffff" />
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
          className="bg-reddit-card rounded-2xl p-6 border border-reddit-border space-y-6"
        >
          {/* Avatar Upload */}
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt="Profile"
                  className="w-24 md:w-32 h-24 md:h-32 rounded-full border-3 md:border-4 border-reddit-orange object-cover"
                />
              ) : (
                <div className="w-24 md:w-32 h-24 md:h-32 rounded-full border-3 md:border-4 border-reddit-orange bg-reddit-cardHover flex items-center justify-center">
                  <User size={48} className="text-reddit-textMuted" />
                </div>
              )}
              <motion.button
                onClick={() => document.getElementById("avatarUpload").click()}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                disabled={isUploadingAvatar}
                className="absolute bottom-0 right-0 p-2 md:p-3 bg-reddit-orange hover:bg-reddit-orange/90 disabled:bg-reddit-orange/50 rounded-full text-white transition-colors"
              >
                {isUploadingAvatar ? (
                  <LoadingSpinner size={18} color="#ffffff" />
                ) : (
                  <Camera size={18} className="md:w-5 md:h-5" />
                )}
              </motion.button>
              <input
                id="avatarUpload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
            <p className="text-xs md:text-sm text-reddit-textMuted text-center">
              {isUploadingAvatar
                ? "Uploading avatar..."
                : "Click the camera icon to change your profile picture"}
            </p>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-sm font-semibold text-reddit-text mb-2">
              Display Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-reddit-input border border-reddit-border rounded-lg text-reddit-text placeholder-reddit-textMuted focus:outline-none focus:border-reddit-orange transition-colors"
              placeholder="Your display name"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-reddit-text mb-2">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-reddit-textMuted">
                @
              </span>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full pl-8 pr-4 py-3 bg-reddit-input border border-reddit-border rounded-lg text-reddit-text placeholder-reddit-textMuted focus:outline-none focus:border-reddit-orange transition-colors"
                placeholder="username"
              />
            </div>
            <p className="text-xs text-reddit-textMuted mt-1">
              Your username is how others will find and mention you
            </p>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold text-reddit-text mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              maxLength={160}
              className="w-full px-4 py-3 bg-reddit-input border border-reddit-border rounded-lg text-reddit-text placeholder-reddit-textMuted focus:outline-none focus:border-reddit-orange transition-colors resize-none"
              placeholder="Tell others about yourself..."
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-reddit-textMuted">
                Write a short bio to introduce yourself
              </p>
              <p className="text-xs text-reddit-textMuted">
                {formData.bio.length}/160
              </p>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="pt-6 border-t border-reddit-border">
            <h3 className="text-sm font-semibold text-red-400 mb-3">
              Danger Zone
            </h3>
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
