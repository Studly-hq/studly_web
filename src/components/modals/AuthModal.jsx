import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useUI } from "../../context/UIContext";
import { toast } from "sonner";
import LoadingSpinner from "../common/LoadingSpinner";

const AuthModal = () => {
  const { showAuthModal, setShowAuthModal } = useUI();
  const { login, signup } = useAuth();
  /*
   * Updated state to include loading and error handling.
   * This is important for real API calls because they take time and can fail.
   */
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false); // Disable button while waiting
  const [error, setError] = useState(null); // Store error messages from the server
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });




  const handleClose = () => {
    setShowAuthModal(false);
    setFormData({ name: "", email: "", password: "" });
    setError(null);
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Clear previous errors

    try {
      if (activeTab === "login") {
        await login(formData.email, formData.password);

        toast.success("Logged in successfully!");

        setShowAuthModal(false);
        setFormData({ name: "", email: "", password: "" });
      } else {
        // Signup
        if (formData.password.length < 8) {
          setError("Password must be at least 8 characters");
          return;
        }
        await signup(formData.name, formData.email, formData.password);

        // Auto-login is now handled in AuthContext
        toast.success("Account created successfully!");
        setShowAuthModal(false);
        setFormData({ name: "", email: "", password: "" });
      }
    } catch (err) {
      // If API fails, we catch the error here and show it
      console.error("Auth error:", err);
      // specific check for the server's error format: { error: "User..." }
      const serverError =
        err.response?.data?.error || err.response?.data?.message;
      setError(serverError || err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
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
                {activeTab === "login" ? "Welcome back" : "Join Studly"}
              </h2>
              <p className="text-reddit-textMuted text-sm">
                {activeTab === "login"
                  ? "Log in to continue your learning journey"
                  : "Create an account to start learning"}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-2 bg-reddit-bg p-1 rounded-lg">
              <motion.button
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
                onClick={() => setActiveTab("login")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${activeTab === "login"
                  ? "bg-reddit-orange text-white "
                  : "text-reddit-textMuted hover:text-reddit-text hover:bg-reddit-cardHover"
                  }`}
              >
                Log In
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
                onClick={() => setActiveTab("signup")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${activeTab === "signup"
                  ? "bg-reddit-orange text-white shadow-sm"
                  : "text-reddit-textMuted hover:text-reddit-text hover:bg-reddit-cardHover"
                  }`}
              >
                Sign Up
              </motion.button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email and Password fields */}
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
                  className="w-full bg-reddit-input border border-reddit-border rounded-lg px-4 py-2.5 text-reddit-text text-sm placeholder-reddit-textMuted outline-none focus:outline-none focus-visible:outline-none hover:border-reddit-orange focus:border-reddit-orange focus:ring-2 focus:ring-reddit-orange/20 transition-all"
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
                    className="w-full bg-reddit-input border border-reddit-border rounded-lg pl-4 pr-10 py-2.5 text-reddit-text text-sm placeholder-reddit-textMuted outline-none focus:outline-none focus-visible:outline-none hover:border-reddit-orange focus:border-reddit-orange focus:ring-2 focus:ring-reddit-orange/20 transition-all"
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


              {/* Error Message Display */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-500 text-sm text-center"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={isLoading ? {} : { scale: 1.01 }}
                whileTap={isLoading ? {} : { scale: 0.99 }}
                transition={{ duration: 0.15 }}
                className={`w-full font-bold py-3 rounded-lg text-sm transition-all flex items-center justify-center
                    ${isLoading
                    ? "bg-reddit-orange/50 cursor-not-allowed text-white/50"
                    : "bg-reddit-orange hover:from-reddit-orange/90 hover:to-reddit-orange/80 text-white"
                  }`}
              >
                {isLoading ? (
                  <LoadingSpinner size={20} color="#ffffff" />
                ) : activeTab === "login" ? (
                  "Log In"
                ) : (
                  "Sign Up"
                )}
              </motion.button>
            </form>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;
