import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import { compatToast as toast } from "../components/ui/toast";
import { Input } from "../components/ui/input";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons";

const LoginPage = () => {
  // Preload signup page's bottom-left image for faster transition
  useEffect(() => {
    const img = new Image();
    img.src = "/auth-bottom-left-signup.webp";
  }, []);
  const { login } = useAuth();
  const { pendingAction, setPendingAction, setShowUpgradeModal } = useUI();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success("Logged in successfully!");
      if (pendingAction?.type === "SHOW_UPGRADE_MODAL") {
        setTimeout(() => setShowUpgradeModal(true), 300);
        setPendingAction(null);
      } else {
        navigate("/home");
      }
    } catch (err) {
      const serverError = err.response?.data?.error || err.response?.data?.message;
      toast.error(serverError || err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-dvh bg-[#fffcf0] relative flex items-center justify-center p-6 md:p-12 lg:p-16">
      {/* Left: decorative image - bottom-left on desktop, hidden on mobile */}
      <div className="hidden md:block absolute bottom-0 left-0 p-8 pointer-events-none">
        <img
          src="/auth-bottom-left.webp"
          alt="decorative"
          loading="lazy"
          className="w-[320px] h-auto"
        />
      </div>

      {/* Right: form content - centered in full viewport */}
      <div className="w-full max-w-[400px] relative z-10">
          <h1 className="text-4xl md:text-5xl font-normal tracking-[-0.02em] text-center">
            Welcome back.
          </h1>
          <p className="mt-4 text-base text-[#726f6c] text-center">
            Pick up where you left off.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 text-left">
            <label htmlFor="login-email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 h-11 rounded-xl border-[#e6e6e3] bg-white px-3.5 text-[15px] text-[#37352f] placeholder:text-[#726f6c] focus-visible:border-[#141414] focus-visible:ring-0 outline-none focus-visible:outline-none"
            />
            <label htmlFor="login-password" className="mt-4 block text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 h-11 rounded-xl border-[#e6e6e3] bg-white px-3.5 text-[15px] text-[#37352f] placeholder:text-[#726f6c] focus-visible:border-[#141414] focus-visible:ring-0 outline-none focus-visible:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#726f6c] hover:text-[#37352f] transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <HugeiconsIcon
                  icon={showPassword ? ViewOffIcon : ViewIcon}
                  size={18}
                  color="#726f6c"
                  strokeWidth={1.5}
                />
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-3 flex h-11 w-full items-center justify-center rounded-xl bg-[#141414] text-[15px] font-medium text-white transition-opacity disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? <LoadingSpinner size={20} color="#ffffff" /> : "Sign in"}
            </button>
          </form>

          <div className="mt-4 text-center md:text-left text-sm text-[#726f6c]">
            New to Studly? <Link to="/signup" className="underline underline-offset-2 cursor-pointer">Create an account</Link>
          </div>
        </div>
    </section>
  );
};

export default LoginPage;
