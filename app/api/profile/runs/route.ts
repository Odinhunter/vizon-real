import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { applyRateLimit, profileLimiter } from '@/lib/rateLimit';
import type { DiagnosticReport } from '@/lib/api/diagnosticClient';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const blocked = applyRateLimit(profileLimiter, session.user.id);
  if (blocked) return blocked;

  const runs = await prisma.diagnosticRun.findMany({
    where: { userId: session.user.id, status: 'COMPLETE' },
    orderBy: { completedAt: 'desc' },
    take: 20,
    select: {
      sessionId: true,
      trackId: true,
      trackScore: true,
      verdict: true,
      resultJson: true,
      completedAt: true,
    },
  });

  const summaries = runs.map((run) => {
    let skills: { label: string; score: number; assessment: string }[] = [];
    let archetype: string | null = null;
    let trackName: string | null = null;
    let strongestSkill: string | null = null;
    let weakestSkill: string | null = null;

    if (run.resultJson) {
      try {
        const report = JSON.parse(run.resultJson) as DiagnosticReport;
        skills = (report.skills || []).map((s) => ({
          label: s.label,
          score: s.score,
          assessment: s.assessment,
        }));
        archetype = report.archetype?.name ?? null;
        trackName = report.metadata?.trackName ?? null;
        strongestSkill = report.metadata?.strongestSkill?.label ?? null;
        weakestSkill = report.metadata?.weakestSkill?.label ?? null;
      } catch {
        // ignore parse errors
      }
    }

    return {
      sessionId: run.sessionId,
      trackId: run.trackId,
      trackScore: run.trackScore,
      verdict: run.verdict,
      completedAt: run.completedAt,
      archetype,
      trackName,
      strongestSkill,
      weakestSkill,
      skills,
    };
  });

  return NextResponse.json({ runs: summaries });
}
