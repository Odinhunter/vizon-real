import SignUpForm from '@/components/auth/SignUpForm';

interface SignUpPageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;
  return <SignUpForm callbackUrl={params.callbackUrl} />;
}
