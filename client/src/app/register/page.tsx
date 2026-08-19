import { AuthLayout } from '@/components/auth/AuthLayout';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create your free AI career account"
      subtitle="Start your intelligent career discovery in less than 2 minutes."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
