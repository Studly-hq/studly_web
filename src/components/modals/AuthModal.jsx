import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Sparkles, Eye, EyeOff } from 'lucide-react';
import { useStudyGram } from '../../context/StudyGramContext';

const AuthModal = () => {
  const { showAuthModal, setShowAuthModal, login, signup } = useStudyGram();
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleClose = () => {
    setShowAuthModal(false);
    setFormData({ name: '', email: '', password: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'login') {
      login(formData.email, formData.password);
    } else {
      signup(formData.name, formData.email, formData.password);
    }
    setFormData({ name: '', email: '', password: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!showAuthModal) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="bg-reddit-card border border-reddit-border rounded-xl w-full max-w-md overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="relative p-6 pb-5 border-b border-reddit-border">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.15 }}
              onClick={handleClose}
              className="absolute top-4 right-4 text-reddit-textMuted hover:text-reddit-text hover:bg-reddit-cardHover transition-colors p-1.5 rounded-full"
            >
              <X size={20} />
            </motion.button>

            <div className="mb-5">
              <h2 className="text-2xl font-bold text-reddit-text mb-1">
                {activeTab === 'login' ? 'Welcome back' : 'Join Studly'}
              </h2>
              <p className="text-reddit-textMuted text-sm">
                {activeTab === 'login'
                  ? 'Log in to continue your learning journey'
                  : 'Create an account to start learning'}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-2 bg-reddit-bg p-1 rounded-lg">
              <motion.button
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${
                  activeTab === 'login'
                    ? 'bg-reddit-orange text-white '
                    : 'text-reddit-textMuted hover:text-reddit-text hover:bg-reddit-cardHover'
                }`}
              >
                Log In
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${
                  activeTab === 'signup'
                    ? 'bg-reddit-orange text-white shadow-sm'
                    : 'text-reddit-textMuted hover:text-reddit-text hover:bg-reddit-cardHover'
                }`}
              >
                Sign Up
              </motion.button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <AnimatePresence mode="wait">
              {activeTab === 'signup' && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                >
                  <label className="block text-reddit-text text-sm font-semibold mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Choose a username"
                    required
                    className="w-full bg-reddit-input border border-reddit-border rounded-lg px-4 py-2.5 text-reddit-text text-sm placeholder-reddit-textMuted outline-none focus:border-reddit-blue focus:ring-2 focus:ring-reddit-blue/20 transition-all"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-reddit-text text-sm font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                className="w-full bg-reddit-input border border-reddit-border rounded-lg px-4 py-2.5 text-reddit-text text-sm placeholder-reddit-textMuted outline-none focus:border-reddit-blue focus:ring-2 focus:ring-reddit-blue/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-reddit-text text-sm font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-reddit-input border border-reddit-border rounded-lg pl-4 pr-10 py-2.5 text-reddit-text text-sm placeholder-reddit-textMuted outline-none focus:border-reddit-blue focus:ring-2 focus:ring-reddit-blue/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-reddit-textMuted hover:text-reddit-text transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {activeTab === 'login' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-reddit-blue text-xs hover:text-reddit-blue/80 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.15 }}
              className="w-full bg-reddit-orange hover:from-reddit-orange/90 hover:to-reddit-orange/80 text-white font-bold py-3 rounded-lg text-sm transition-all "
            >
              {activeTab === 'login' ? 'Log In' : 'Sign Up'}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="px-6 pb-6">
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-reddit-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-reddit-card text-reddit-textMuted font-medium">
                  OR
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ backgroundColor: '#272729' }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-center gap-2 bg-reddit-cardHover hover:bg-reddit-border text-reddit-text py-2.5 rounded-lg border border-reddit-border transition-colors text-sm font-medium"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Google</span>
              </motion.button>

              <motion.button
                whileHover={{ backgroundColor: '#272729' }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-center gap-2 bg-reddit-cardHover hover:bg-reddit-border text-reddit-text py-2.5 rounded-lg border border-reddit-border transition-colors text-sm font-medium"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>GitHub</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;