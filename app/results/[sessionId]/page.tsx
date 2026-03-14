import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import type { DiagnosticReport } from '@/lib/api/diagnosticClient';
import DiagnosticResults from '@/components/diagnostic/DiagnosticResults';
import type { Metadata } from 'next';

interface ResultsPageProps {
  params: Promise<{ sessionId: string }>;
}

export async function generateMetadata({ params }: ResultsPageProps): Promise<Metadata> {
  const { sessionId } = await params;

  const run = await prisma.diagnosticRun.findUnique({
    where: { sessionId },
    select: { resultJson: true, trackScore: true, verdict: true },
  });

  if (!run?.resultJson) {
    return { title: 'Results Not Found — Vizon' };
  }

  try {
    const report = JSON.parse(run.resultJson) as DiagnosticReport;
    const archetypeName = report.archetype?.name ?? 'Diagnostic Results';
    const title = `Vizon: ${run.trackScore}/100 — ${archetypeName}`;
    const description = `${run.verdict?.replace(/_/g, ' ')} · Strongest: ${report.metadata?.strongestSkill ?? 'N/A'}`;

    return {
      title,
      description,
      openGraph: { title, description },
      twitter: { card: 'summary', title, description },
    };
  } catch {
    return { title: 'Vizon Diagnostic Results' };
  }
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { sessionId } = await params;

  const run = await prisma.diagnosticRun.findUnique({
    where: { sessionId },
    select: { resultJson: true, trackId: true, sessionId: true, status: true },
  });

  if (!run || run.status !== 'COMPLETE' || !run.resultJson) {
    notFound();
  }

  let report: DiagnosticReport;
  try {
    report = JSON.parse(run.resultJson) as DiagnosticReport;
  } catch {
    notFound();
  }

  return (
    <DiagnosticResults
      result={report}
      trackId={run.trackId}
      readOnly={true}
      sessionId={run.sessionId}
    />
  );
}
