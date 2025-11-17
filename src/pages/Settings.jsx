import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Bell,
  Moon,
  Globe,
  Shield,
  Eye,
  Volume2,
  Smartphone,
  Mail,
  Lock,
  User,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStudyGram } from '../context/StudyGramContext';

const Settings = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useStudyGram();

  const [settings, setSettings] = useState({
    notifications: {
      likes: true,
      comments: true,
      follows: true,
      mentions: true,
      email: false
    },
    appearance: {
      darkMode: true,
      compactMode: false
    },
    privacy: {
      privateAccount: false,
      showActivity: true,
      allowMessages: true
    },
    sound: {
      notifications: true,
      interactions: false
    }
  });

  if (!isAuthenticated) {
    navigate('/');
    return null;
  }

  const toggleSetting = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const SettingToggle = ({ enabled, onChange }) => (
    <motion.button
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-colors ${
        enabled ? 'bg-blue-600' : 'bg-gray-700'
      }`}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full"
        animate={{ x: enabled ? 24 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </motion.button>
  );

  const SettingSection = ({ title, icon: Icon, children }) => (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={18} className="text-blue-600" />
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <div className="bg-gray-900/50 rounded-xl border border-gray-800 divide-y divide-gray-800">
        {children}
      </div>
    </div>
  );

  const SettingItem = ({ label, description, enabled, onChange, showChevron }) => (
    <div className="px-4 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors">
      <div className="flex-1">
        <p className="text-white font-medium mb-1">{label}</p>
        {description && (
          <p className="text-sm text-gray-400">{description}</p>
        )}
      </div>
      {onChange && (
        <SettingToggle enabled={enabled} onChange={onChange} />
      )}
      {showChevron && (
        <ChevronRight size={20} className="text-gray-400" />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-black pt-16">
      {/* Header */}
      <div className="sticky top-16 z-10 bg-black/95 backdrop-blur-sm border-b border-gray-900">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-gray-900 rounded-full transition-colors"
            >
              <ArrowLeft size={20} className="text-white" />
            </motion.button>
            <h1 className="text-xl font-bold text-white">Settings</h1>
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
              onClick={() => navigate('/profile/edit')}
              className="px-4 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors w-full"
            >
              <div className="flex-1 text-left">
                <p className="text-white font-medium mb-1">Edit Profile</p>
                <p className="text-sm text-gray-400">Update your profile information</p>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
            <button className="px-4 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors w-full">
              <div className="flex-1 text-left">
                <p className="text-white font-medium mb-1">Change Password</p>
                <p className="text-sm text-gray-400">Update your login password</p>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          </SettingSection>



          {/* About */}
          <SettingSection title="About" icon={Globe}>
            <button className="px-4 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors w-full">
              <div className="flex-1 text-left">
                <p className="text-white font-medium mb-1">Terms of Service</p>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
            <button className="px-4 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors w-full">
              <div className="flex-1 text-left">
                <p className="text-white font-medium mb-1">Privacy Policy</p>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
            <button className="px-4 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors w-full">
              <div className="flex-1 text-left">
                <p className="text-white font-medium mb-1">Help & Support</p>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
            <div className="px-4 py-4">
              <p className="text-white font-medium mb-1">Version</p>
              <p className="text-sm text-gray-400">Studly v1.0.0</p>
            </div>
          </SettingSection>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
