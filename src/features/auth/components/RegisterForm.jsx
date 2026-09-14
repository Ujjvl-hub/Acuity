import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      // Temporary mock registration
      // We will connect the real backend later
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("Mock registration:", { name, email });
    } catch (err) {
      setError("Couldn't create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">Create your account</h1>
      <p className="mt-1.5 text-sm text-slate">Start practicing in a few minutes.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {/* Full Name */}
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">
            Full name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ujjwal Kumar"
            className="w-full rounded-[4px] border border-hairline bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-slate/60 transition-colors focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/20"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-[4px] border border-hairline bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-slate/60 transition-colors focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/20"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="w-full rounded-[4px] border border-hairline bg-paper px-3.5 py-2.5 pr-10 text-sm text-ink placeholder:text-slate/60 transition-colors focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate hover:text-ink"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-ink">
            Confirm password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="w-full rounded-[4px] border border-hairline bg-paper px-3.5 py-2.5 pr-10 text-sm text-ink placeholder:text-slate/60 transition-colors focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/20"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate hover:text-ink"
              aria-label="Toggle confirm password visibility"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="rounded-[4px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-[4px] bg-focus py-2.5 text-sm font-semibold text-paper transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      {/* Login link */}
      <p className="mt-6 text-sm text-slate">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-focus hover:opacity-80">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default RegisterForm;