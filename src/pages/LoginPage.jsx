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
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
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
    <section
      className="relative min-h-dvh flex flex-col items-center justify-center px-6 py-16 lg:py-24"
      style={{ color: "#141414", fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif", backgroundColor: "#ffffff" }}
    >
      <div className="w-full max-w-[640px] text-center">
        <h1 className="text-5xl font-normal tracking-[-0.02em]" style={{fontFamily: 'Geist, sans-serif'}}>
          Welcome back.
        </h1>
        <p className="mt-4 text-[16px] text-[#726f6c]" style={{fontFamily: 'var(--font-heading)'}}>
          Pick up where you left off.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 text-left max-w-[380px] mx-auto">
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

        <div className="mt-4 text-center text-sm text-[#726f6c]">
          New to Studly? <Link to="/signup" className="underline underline-offset-2 cursor-pointer">Create an account</Link>
        </div>
      </div>
      <img src="/auth-bottom-left.webp" alt="decorative" loading="lazy" decoding="async" width="448" className="absolute bottom-[-60px] left-0 w-[28rem] h-auto pointer-events-none" />
    </section>
  );
};

export default LoginPage;
