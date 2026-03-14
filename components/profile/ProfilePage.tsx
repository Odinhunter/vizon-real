'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface RunSummary {
  sessionId: string;
  trackId: string;
  trackScore: number | null;
  verdict: string | null;
  completedAt: string | null;
  archetype: string | null;
  trackName: string | null;
  strongestSkill: string | null;
  weakestSkill: string | null;
  skills: { label: string; score: number; assessment: string }[];
}

interface ProfileData {
  university: string | null;
  graduationYear: number | null;
  targetRole: string | null;
}

const VERDICT_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  STRONG_CANDIDATE: { label: 'Strong', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  ABOVE_THRESHOLD: { label: 'Above Threshold', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  BORDERLINE: { label: 'Borderline', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  BELOW_THRESHOLD: { label: 'Below Threshold', color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200' },
  SIGNIFICANT_GAP: { label: 'Significant Gap', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
};

const ASSESSMENT_COLORS: Record<string, string> = {
  STRONG: '#10b981',
  COMPETENT: '#3b82f6',
  DEVELOPING: '#f59e0b',
  WEAK: '#ef4444',
};

function MiniDonut({ score, color, size = 48 }: { score: number; color: string; size?: number }) {
  const r = 18;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" className="w-full h-full -rotate-90">
        <circle cx="24" cy="24" r={r} fill="none" stroke="#e2e6ea" strokeWidth="4" />
        <circle cx="24" cy="24" r={r} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
          strokeDasharray={`${circumference}`} strokeDashoffset={offset}
          style={{ animation: 'ringFill 1s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono text-xs font-medium tabular-nums" style={{ color }}>{score}</span>
      </div>
    </div>
  );
}

function VerdictPill({ verdict }: { verdict: string }) {
  const v = VERDICT_LABELS[verdict] || { label: verdict, color: 'text-neutral-600', bg: 'bg-neutral-50 border-neutral-200' };
  return (
    <span className={`inline-block px-2.5 py-0.5 text-[10px] font-mono tracking-wider uppercase rounded-full border ${v.bg} ${v.color}`}>
      {v.label}
    </span>
  );
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [runs, setRuns] = useState<RunSummary[]>([]);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/profile/runs').then((r) => r.json()),
      fetch('/api/profile').then((r) => r.json()),
    ]).then(([runsData, profileData]) => {
      setRuns(runsData.runs || []);
      setProfile(profileData.profile || null);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const user = session?.user;
  const userInitial = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?';
  const latestRun = runs[0] || null;
  const pastRuns = runs.slice(1);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neutral-200 border-t-[#1A56DB] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* Top nav */}
      <nav className="bg-white border-b border-neutral-100 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#e8521a]" />
          <span className="font-mono text-[12px] font-medium tracking-[0.2em] text-[#051c2c]">VIZON</span>
        </Link>
        <Link
          href="/diagnostic?track=consulting"
          className="bg-[#1A56DB] text-white text-[13px] font-semibold px-6 py-2 rounded-xl hover:bg-[#1548b8] transition-colors"
        >
          Run Diagnostic →
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-5 py-10 space-y-8">
        {/* User card */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-full bg-[#051c2c] text-white text-xl font-semibold flex items-center justify-center shrink-0">
              {userInitial}
            </div>
            <div className="min-w-0">
              <h1 className="font-sans text-xl font-bold text-[#051c2c]">{user?.name || 'User'}</h1>
              <p className="font-sans text-sm text-neutral-500">{user?.email}</p>
              {profile && (
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-neutral-500 font-mono">
                  {profile.university && <span>{profile.university}</span>}
                  {profile.targetRole && <span>{profile.targetRole}</span>}
                  {profile.graduationYear && <span>Class of {profile.graduationYear}</span>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* No runs state */}
        {runs.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <h2 className="font-sans text-lg font-bold text-[#051c2c] mb-2">You haven&apos;t taken a diagnostic yet</h2>
            <p className="font-sans text-sm text-neutral-500 mb-6">Complete your first diagnostic to see your results here.</p>
            <Link
              href="/diagnostic?track=consulting"
              className="inline-block bg-[#1A56DB] text-white text-[14px] font-semibold px-8 py-3 rounded-xl hover:bg-[#1548b8] transition-colors"
            >
              Run your first diagnostic →
            </Link>
          </div>
        )}

        {/* Latest run featured card */}
        {latestRun && (
          <div className="bg-white rounded-2xl shadow-md p-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-sans text-base font-bold text-[#051c2c]">Latest Result</h2>
              {latestRun.completedAt && (
                <span className="font-mono text-xs text-neutral-400">
                  {new Date(latestRun.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              )}
            </div>
            <div className="flex items-center gap-6 mb-5">
              <MiniDonut
                score={latestRun.trackScore ?? 0}
                color={
                  (latestRun.trackScore ?? 0) >= 70 ? '#10b981' :
                  (latestRun.trackScore ?? 0) >= 55 ? '#3b82f6' :
                  (latestRun.trackScore ?? 0) >= 40 ? '#f59e0b' : '#ef4444'
                }
                size={64}
              />
              <div>
                {latestRun.verdict && <VerdictPill verdict={latestRun.verdict} />}
                {latestRun.archetype && (
                  <p className="font-sans text-sm font-medium text-[#051c2c] mt-1">{latestRun.archetype}</p>
                )}
                <p className="font-mono text-xs text-neutral-400 mt-0.5">
                  {latestRun.trackName || latestRun.trackId}
                </p>
              </div>
            </div>

            {/* Skill bars */}
            {latestRun.skills.length > 0 && (
              <div className="space-y-3 mb-6">
                {latestRun.skills.map((skill) => (
                  <div key={skill.label} className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-neutral-500 w-32 shrink-0 truncate uppercase tracking-wider">{skill.label}</span>
                    <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.min(skill.score, 100)}%`,
                          backgroundColor: ASSESSMENT_COLORS[skill.assessment] || '#9ca3af',
                        }}
                      />
                    </div>
                    <span className="font-mono text-xs font-medium tabular-nums text-neutral-700 w-8 text-right">{skill.score}</span>
                  </div>
                ))}
              </div>
            )}

            <Link
              href={`/results/${latestRun.sessionId}`}
              className="inline-block w-full text-center py-3 bg-[#051c2c] text-white font-mono text-[11px] tracking-[0.15em] uppercase rounded-xl hover:bg-[#0a2f47] transition-colors"
            >
              View Full Results
            </Link>
          </div>
        )}

        {/* Past runs */}
        {pastRuns.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="font-sans text-base font-bold text-[#051c2c] mb-5">Past Diagnostics</h2>
            <div className="space-y-3">
              {pastRuns.map((run) => (
                <Link
                  key={run.sessionId}
                  href={`/results/${run.sessionId}`}
                  className="flex items-center gap-4 p-4 rounded-xl border border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50 transition-all group"
                >
                  <MiniDonut
                    score={run.trackScore ?? 0}
                    color={
                      (run.trackScore ?? 0) >= 70 ? '#10b981' :
                      (run.trackScore ?? 0) >= 55 ? '#3b82f6' :
                      (run.trackScore ?? 0) >= 40 ? '#f59e0b' : '#ef4444'
                    }
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-sm font-medium text-[#051c2c]">
                        {run.trackName || run.trackId}
                      </span>
                      {run.verdict && <VerdictPill verdict={run.verdict} />}
                    </div>
                    {run.completedAt && (
                      <span className="font-mono text-xs text-neutral-400">
                        {new Date(run.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                  <svg className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
