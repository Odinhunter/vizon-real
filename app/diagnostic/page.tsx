import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { supportedTrackIds } from '@/config/registry';
import DiagnosticController from '@/components/diagnostic/DiagnosticController';

export const metadata: Metadata = {
  title: "Career Diagnostic",
  description: "Take Vizon's AI-powered consulting diagnostic. Evaluate your analytical, communication, and problem-solving skills through realistic case scenarios.",
  robots: { index: false, follow: false },
};

interface DiagnosticPageProps {
  searchParams: Promise<{ track?: string }>;
}

export default async function DiagnosticPage({ searchParams }: DiagnosticPageProps) {
  const params = await searchParams;
  const trackId = params.track;

  if (!trackId || !supportedTrackIds.includes(trackId)) {
    redirect('/');
  }

  return <DiagnosticController trackId={trackId} />;
}
