import type { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to Vizon to access your career diagnostic results and track your consulting readiness over time.",
  alternates: { canonical: "https://getvizon.com/login" },
  robots: { index: false, follow: true },
};

interface LoginPageProps {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  return (
    <LoginForm
      callbackUrl={params.callbackUrl}
      error={params.error}
    />
  );
}
