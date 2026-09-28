
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import useAuth from "../../../hooks/useAuth.js";
import api from "../../../api/axios";

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Enter your email and password to continue.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/api/users/login/", {
        email: email.trim(),
        password,
      });

      const data = response.data;

      console.log("Login successful:", data);

      // Save user and JWT tokens
      login(data.user, data.tokens);

      // Go to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error(
        "Login error:",
        err.response?.data || err.message
      );

      if (err.response) {
        const data = err.response.data || {};

        setError(
          data.message ||
            data.error ||
            data.detail ||
            "Couldn't sign you in. Check your details and try again."
        );
      } else {
        setError("Unable to connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-[#12151C]"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
          className="w-full rounded-xl border border-[#DDE1E6] bg-white px-4 py-3 text-sm text-[#12151C] outline-none transition focus:border-[#1F7A5C] focus:ring-2 focus:ring-[#1F7A5C]/10"
        />
      </div>

      {/* Password */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[#12151C]"
          >
            Password
          </label>
          <button
            type="button"
            className="text-xs font-medium text-[#5B6472] transition hover:text-[#1F7A5C]"
          >
            Forgot password?
          </button>
        </div>

        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            className="w-full rounded-xl border border-[#DDE1E6] bg-white px-4 py-3 pr-11 text-sm text-[#12151C] outline-none transition focus:border-[#1F7A5C] focus:ring-2 focus:ring-[#1F7A5C]/10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5B6472] hover:text-[#12151C]"
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[#12151C] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1F7A5C] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>

      {/* Register */}
      <p className="text-center text-sm text-[#5B6472]">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-semibold text-[#1F7A5C] hover:underline"
        >
          Create account
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;