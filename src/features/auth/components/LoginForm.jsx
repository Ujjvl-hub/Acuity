import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import useAuth from "../../../hooks/useAuth.js";

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

    if (!email || !password) {
      setError("Enter your email and password to continue.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/users/login/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            data.error ||
            "Couldn't sign you in. Check your details and try again."
        );

        return;
      }

      console.log("Login successful:", data);

      login(data.user);

      navigate("/dashboard");

    } catch (err) {
      console.error(err);

      setError("Unable to connect to the server.");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      <form onSubmit={handleSubmit} className="space-y-5">

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
            className="w-full rounded-[4px] border border-hairline bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-slate/60 transition-colors focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/20"
          />

        </div>


        {/* Password */}

        <div>

          <div className="mb-1.5 flex items-center justify-between">

            <label
              htmlFor="password"
              className="text-sm font-medium text-ink"
            >
              Password
            </label>


            <button
              type="button"
              className="text-sm text-focus transition-opacity hover:opacity-80"
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
              className="w-full rounded-[4px] border border-hairline bg-paper px-3.5 py-2.5 pr-10 text-sm text-ink placeholder:text-slate/60 transition-colors focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/20"
            />


            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate transition-colors hover:text-ink"
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
            >

              {showPassword ? (
                <EyeOff size={16} />
              ) : (
                <Eye size={16} />
              )}

            </button>

          </div>

        </div>


        {/* Error */}

        {error && (

          <p className="rounded-[4px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">

            {error}

          </p>

        )}


        {/* Submit button */}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-[4px] bg-focus py-2.5 text-sm font-semibold text-paper transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >

          {loading ? "Signing in..." : "Sign in"}

        </button>

      </form>


      {/* Register link */}

      <p className="mt-6 text-sm text-slate">

        New to Acuity?{" "}

        <Link
          to="/register"
          className="font-medium text-focus transition-opacity hover:opacity-80"
        >
          Create an account
        </Link>

      </p>

    </div>
  );
}

export default LoginForm;