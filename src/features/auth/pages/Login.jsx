
import AuthLayout from "../components/AuthLayout.jsx";
import LoginForm from "../components/LoginForm.jsx";


function Login() {
  return (
    <AuthLayout
      title="Sign in"
      description="Continue your interview practice."
    >
      <div className="acuity-login-form">
        <style>{`
          .acuity-login-form label {
            color: #e5e7eb !important;
          }

          .acuity-login-form input {
            background: #ffffff !important;
            color: #111827 !important;
            border: 1px solid #d1d5db !important;
          }

          .acuity-login-form input::placeholder {
            color: #9ca3af !important;
            opacity: 1;
          }

          .acuity-login-form button[type="submit"] {
            background: #2563eb !important;
            color: #ffffff !important;
            border: 1px solid #2563eb !important;
            transition: background 0.2s ease;
          }

          .acuity-login-form button[type="submit"]:hover {
            background: #1d4ed8 !important;
          }

          .acuity-login-form a {
            color: #60a5fa !important;
          }

          .acuity-login-form a:hover {
            color: #93c5fd !important;
          }

          .acuity-login-form input:focus {
            outline: 2px solid #3b82f6 !important;
            outline-offset: 2px;
          }
        `}</style>

        <LoginForm />
      </div>
    </AuthLayout>
  );
}

export default Login;