import AuthLayout from "../components/AuthLayout";
import RegisterForm from "../components/RegisterForm";

function Register() {
  return (
    <AuthLayout
      title="Create your account"
      description="Start practicing in a few minutes."
    >
      <RegisterForm />
    </AuthLayout>
  );
}

export default Register;