import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Globe, User, ChevronRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStudyGram } from "../context/StudyGramContext";
import { changePassword } from "../api/auth";
import { toast } from "sonner";
import LoadingSpinner from "../components/common/LoadingSpinner";

const Settings = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useStudyGram();

  // Change Password State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    setIsChangingPassword(true);
    try {
      if (!currentUser?.email) {
        throw new Error("User email not found");
      }

      await changePassword(
        currentUser.email,
        passwordData.oldPassword,
        passwordData.newPassword
      );
      toast.success("Password changed successfully!");
      setShowPasswordModal(false);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Change password failed:", error);
      toast.error(error.response?.data?.error || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const SettingSection = ({ title, icon: Icon, children }) => (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={18} className="text-reddit-orange" />
        <h3 className="text-sm font-semibold text-reddit-textMuted uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <div className="bg-reddit-card rounded-xl border border-reddit-border divide-y divide-reddit-border">
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-reddit-bg pt-16">
      {/* Header */}
      <div className="sticky top-16 z-10 bg-reddit-bg/95 backdrop-blur-sm border-b border-reddit-border">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-reddit-cardHover rounded-full transition-colors"
            >
              <ArrowLeft size={20} className="text-reddit-text" />
            </motion.button>
            <h1 className="text-xl font-bold text-reddit-text">Settings</h1>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Account Settings */}
          <SettingSection title="Account" icon={User}>
            <button
              onClick={() => navigate("/profile/edit")}
              className="px-4 py-4 flex items-center justify-between hover:bg-reddit-cardHover transition-colors w-full"
            >
              <div className="flex-1 text-left">
                <p className="text-reddit-text font-medium mb-1">
                  Edit Profile
                </p>
                <p className="text-sm text-reddit-textMuted">
                  Update your profile information
                </p>
              </div>
              <ChevronRight size={20} className="text-reddit-textMuted" />
            </button>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-4 py-4 flex items-center justify-between hover:bg-reddit-cardHover transition-colors w-full"
            >
              <div className="flex-1 text-left">
                <p className="text-reddit-text font-medium mb-1">
                  Change Password
                </p>
                <p className="text-sm text-reddit-textMuted">
                  Update your login password
                </p>
              </div>
              <ChevronRight size={20} className="text-reddit-textMuted" />
            </button>
          </SettingSection>

          {/* About */}
          <SettingSection title="About" icon={Globe}>
            <button className="px-4 py-4 flex items-center justify-between hover:bg-reddit-cardHover transition-colors w-full">
              <div className="flex-1 text-left">
                <p className="text-reddit-text font-medium mb-1">
                  Terms of Service
                </p>
              </div>
              <ChevronRight size={20} className="text-reddit-textMuted" />
            </button>
            <button className="px-4 py-4 flex items-center justify-between hover:bg-reddit-cardHover transition-colors w-full">
              <div className="flex-1 text-left">
                <p className="text-reddit-text font-medium mb-1">
                  Privacy Policy
                </p>
              </div>
              <ChevronRight size={20} className="text-reddit-textMuted" />
            </button>
            <button className="px-4 py-4 flex items-center justify-between hover:bg-reddit-cardHover transition-colors w-full">
              <div className="flex-1 text-left">
                <p className="text-reddit-text font-medium mb-1">
                  Help & Support
                </p>
              </div>
              <ChevronRight size={20} className="text-reddit-textMuted" />
            </button>
            <div className="px-4 py-4">
              <p className="text-reddit-text font-medium mb-1">Version</p>
              <p className="text-sm text-reddit-textMuted">Studly v1.0.0</p>
            </div>
          </SettingSection>
        </motion.div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className=" fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-reddit-card w-full max-w-md rounded-xl border border-reddit-border p-6 shadow-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-reddit-text">
                Change Password
              </h2>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-reddit-textMuted hover:text-reddit-text transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-reddit-text mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      oldPassword: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-reddit-input border border-reddit-border rounded-lg text-reddit-text focus:outline-none focus:border-reddit-orange"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-reddit-text mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-reddit-input border border-reddit-border rounded-lg text-reddit-text focus:outline-none focus:border-reddit-orange"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-reddit-text mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-reddit-input border border-reddit-border rounded-lg text-reddit-text focus:outline-none focus:border-reddit-orange"
                  placeholder="Confirm new password"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-2 border border-reddit-border text-reddit-text rounded-lg hover:bg-reddit-cardHover transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="flex-1 px-4 py-2 bg-reddit-orange text-white rounded-lg hover:bg-reddit-orange/90 transition-colors font-medium disabled:opacity-50 flex justify-center items-center"
                >
                  {isChangingPassword ? (
                    <LoadingSpinner size={20} color="#ffffff" />
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Settings;
