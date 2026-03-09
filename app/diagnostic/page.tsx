import { redirect } from 'next/navigation';
import { supportedTrackIds } from '@/config/registry';
import DiagnosticController from '@/components/diagnostic/DiagnosticController';

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
