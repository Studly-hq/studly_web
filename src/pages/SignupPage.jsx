import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { compatToast as toast } from "../components/ui/toast";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons";
import { Input } from "../components/ui/input";
import LoadingSpinner from "../components/common/LoadingSpinner";

const SignupPage = () => {
  // Preload login page's bottom-left image for faster transition
  useEffect(() => {
    const img = new Image();
    img.src = "/auth-bottom-left.webp";
  }, []);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // removed unused error state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (password.length < 8) {
        toast.error("Password must be at least 8 characters");
        return;
      }
      await signup(name, email, password);
      toast.success("Account created successfully!");
      navigate("/home");
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
        <h1 className="text-5xl font-normal tracking-[-0.02em] text-black max-md:whitespace-normal md:whitespace-nowrap" style={{fontFamily: 'Geist, sans-serif'}}>
          Let's get you started.
        </h1>
        <p className="mt-4 text-[16px] text-[#726f6c]" style={{fontFamily: 'var(--font-heading)'}}>
          Bring your notes, we'll take it from there.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 text-left max-w-[380px] mx-auto">
          <label htmlFor="signup-name" className="text-sm font-medium">
            Name
          </label>
          <Input
            id="signup-name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 h-11 rounded-xl border-[#e6e6e3] bg-white px-3.5 text-[15px] text-[#37352f] placeholder:text-[#726f6c] focus-visible:border-[#141414] focus-visible:ring-0 outline-none focus-visible:outline-none"
          />

          <label htmlFor="signup-email" className="mt-4 block text-sm font-medium">
            Email
          </label>
          <Input
            id="signup-email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 h-11 rounded-xl border-[#e6e6e3] bg-white px-3.5 text-[15px] text-[#37352f] placeholder:text-[#726f6c] focus-visible:border-[#141414] focus-visible:ring-0 outline-none focus-visible:outline-none"
          />

          <label htmlFor="signup-password" className="mt-4 block text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <Input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 h-11 rounded-xl border-[#e6e6e3] bg-white px-3.5 pr-10 text-[15px] text-[#37352f] placeholder:text-[#726f6c] focus-visible:border-[#141414] focus-visible:ring-0 outline-none focus-visible:outline-none"
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
            {isLoading ? <LoadingSpinner size={20} color="#ffffff" /> : "Sign up"}
          </button>
        </form>

          <div className="mt-4 text-center text-sm text-[#726f6c]">
            Already have an account? <Link to="/login" className="underline underline-offset-2 cursor-pointer">Sign in</Link>
          </div>

      </div>
    <img src="/auth-bottom-left-signup.webp" alt="decorative" loading="lazy" decoding="async" width="448" className="absolute bottom-[-60px] left-0 w-[28rem] h-auto pointer-events-none" />
</section>
  );
};

export default SignupPage;
