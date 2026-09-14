import AuthLayout from "../components/AuthLayout.jsx";
import LoginForm from "../components/LoginForm.jsx";

function Login() {
  return (
    <AuthLayout
      title="Sign in"
      description="Continue your interview practice."
    >
      <LoginForm />
    </AuthLayout>
  );
}

export default Login;