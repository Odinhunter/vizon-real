import type { Metadata } from 'next';
import SignUpForm from '@/components/auth/SignUpForm';

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your free Vizon account and take the AI-powered consulting career diagnostic.",
  alternates: { canonical: "https://getvizon.com/signup" },
  robots: { index: false, follow: true },
};

interface SignUpPageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;
  return <SignUpForm callbackUrl={params.callbackUrl} />;
}
