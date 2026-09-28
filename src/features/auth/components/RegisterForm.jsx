
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../../../api/axios";

function RegisterForm() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
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

    const cleanUsername = username.trim();

    if (
      !cleanUsername ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9@.+_-]+$/;

    if (!usernameRegex.test(cleanUsername)) {
      setError(
        "Please enter a valid username. Use letters, numbers, @, ., +, - or _."
      );
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
      const response = await api.post("/api/users/register/", {
        username: cleanUsername,
        email: email.trim(),
        password,
      });

      const data = response.data;

      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      console.error(
        "Registration error:",
        err.response?.data || err.message
      );

      const data = err.response?.data || {};

      const usernameError = data.username?.[0];
      const emailError = data.email?.[0];
      const passwordError = data.password?.[0];

      if (usernameError) {
        if (
          usernameError.toLowerCase().includes("already exists") ||
          usernameError.toLowerCase().includes("already taken")
        ) {
          setError(
            "This username is already taken. Please choose another."
          );
        } else {
          setError(
            "Please enter a valid username. Use letters, numbers, @, ., +, - or _."
          );
        }
      } else if (emailError) {
        setError(emailError);
      } else if (passwordError) {
        setError(passwordError);
      } else if (err.response) {
        setError(
          data.message ||
            data.error ||
            "Couldn't create your account. Please try again."
        );
      } else {
        setError(
          "Unable to connect to the server. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">
        Create your account
      </h1>
      <p className="mt-1.5 text-sm text-slate">
        Start practicing in a few minutes.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {/* Username */}
        <div>
          <label
            htmlFor="username"
            className="mb-1.5 block text-sm font-medium text-ink"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. FirstName_LastName"
            autoComplete="username"
            maxLength={150}
            required
            className="w-full rounded border px-3 py-2"
          />
          <p className="mt-1 text-xs text-slate">
            Letters, numbers and @ . + - _ are allowed.
          </p>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-ink"
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
            className="w-full rounded border px-3 py-2"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-ink"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              autoComplete="new-password"
              required
              className="w-full rounded border px-3 py-2 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1.5 block text-sm font-medium text-ink"
          >
            Confirm password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              autoComplete="new-password"
              required
              className="w-full rounded border px-3 py-2 pr-10"
            />
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showConfirmPassword ? (
                <EyeOff size={16} />
              ) : (
                <Eye size={16} />
              )}
            </button>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <p
            role="alert"
            aria-live="polite"
            className="text-sm text-red-600"
          >
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-blue-600 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-sm">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-blue-600"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default RegisterForm;