import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import type { DiagnosticReport } from '@/lib/api/diagnosticClient';

export const dynamic = 'force-dynamic';

/** Comma-separated list of emails allowed to access admin pages. */
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export default async function AdminResultsPage() {
  const session = await auth();

  // Require authentication
  if (!session?.user?.email) {
    redirect('/login');
  }

  // Require admin role
  if (!ADMIN_EMAILS.includes(session.user.email.toLowerCase())) {
    redirect('/');
  }
  const runs = await prisma.diagnosticRun.findMany({
    where: { status: 'COMPLETE' },
    orderBy: { completedAt: 'desc' },
    select: {
      sessionId: true,
      trackId: true,
      trackScore: true,
      verdict: true,
      resultJson: true,
      completedAt: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  const rows = runs.map((run) => {
    let skills: { label: string; score: number }[] = [];
    if (run.resultJson) {
      try {
        const report = JSON.parse(run.resultJson) as DiagnosticReport;
        skills = (report.skills || []).map((s) => ({
          label: s.label,
          score: s.score,
        }));
      } catch {
        // ignore
      }
    }
    return {
      name: run.user.name ?? run.user.email ?? 'Unknown',
      trackId: run.trackId,
      trackScore: run.trackScore,
      verdict: run.verdict,
      completedAt: run.completedAt,
      skills,
    };
  });

  // Collect all unique skill labels across all runs for table headers
  const allSkillLabels = Array.from(
    new Set(rows.flatMap((r) => r.skills.map((s) => s.label)))
  );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Diagnostic Results</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-700 text-left">
              <th className="py-3 px-4 font-semibold">Name</th>
              <th className="py-3 px-4 font-semibold">Track</th>
              <th className="py-3 px-4 font-semibold">Overall</th>
              {allSkillLabels.map((label) => (
                <th key={label} className="py-3 px-4 font-semibold">
                  {label}
                </th>
              ))}
              <th className="py-3 px-4 font-semibold">Verdict</th>
              <th className="py-3 px-4 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const skillMap = Object.fromEntries(
                row.skills.map((s) => [s.label, s.score])
              );
              return (
                <tr
                  key={i}
                  className="border-b border-gray-800 hover:bg-gray-900"
                >
                  <td className="py-3 px-4">{row.name}</td>
                  <td className="py-3 px-4 capitalize">{row.trackId}</td>
                  <td className="py-3 px-4 font-mono font-bold">
                    {row.trackScore ?? '—'}
                  </td>
                  {allSkillLabels.map((label) => (
                    <td key={label} className="py-3 px-4 font-mono">
                      {skillMap[label] ?? '—'}
                    </td>
                  ))}
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        row.verdict === 'STRONG_CANDIDATE'
                          ? 'bg-green-900/50 text-green-300'
                          : row.verdict === 'ABOVE_THRESHOLD'
                            ? 'bg-blue-900/50 text-blue-300'
                            : row.verdict === 'BORDERLINE'
                              ? 'bg-yellow-900/50 text-yellow-300'
                              : 'bg-red-900/50 text-red-300'
                      }`}
                    >
                      {row.verdict?.replace(/_/g, ' ') ?? '—'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400">
                    {row.completedAt
                      ? new Date(row.completedAt).toLocaleDateString()
                      : '—'}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={4 + allSkillLabels.length}
                  className="py-8 text-center text-gray-500"
                >
                  No completed diagnostic runs yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
