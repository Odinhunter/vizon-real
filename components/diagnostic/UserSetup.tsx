'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface UserSetupProps {
  onComplete: () => void;
  onSkip: () => void;
}

const TARGET_ROLES = [
  'MBB Consulting',
  'Boutique Consulting',
  'Investment Banking',
  'Private Equity',
  'Corporate Strategy',
  'Product Management',
  'Data Science / Analytics',
  'Other',
];

const PREP_BACKGROUNDS = [
  'Case prep club member',
  'Formal coaching/training',
  'Self-study',
  'Some practice with friends',
  'No preparation yet',
];

const GRADUATION_YEARS = Array.from({ length: 7 }, (_, i) => 2024 + i);

export default function UserSetup({ onComplete, onSkip }: UserSetupProps) {
  const { data: session } = useSession();

  const [university, setUniversity] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [prepBackground, setPrepBackground] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ university, graduationYear, targetRole, prepBackground }),
      });

      if (!res.ok) {
        setError('Failed to save profile');
        setLoading(false);
        return;
      }

      onComplete();
    } catch {
      setError('Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 max-w-2xl mx-auto w-full px-5 py-10 flex flex-col justify-center">
        {/* Track line */}
        <div className="mb-8">
          <span className="text-[10px] font-mono text-neutral-500 tracking-widest uppercase">
            VIZON · PROFILE
          </span>
        </div>

        {/* Heading */}
        <h1 className="font-mono text-3xl font-normal text-neutral-900 leading-tight mb-3">
          Before we begin
        </h1>
        <p className="text-sm text-neutral-500 leading-relaxed mb-8 font-mono">
          Help us tailor your diagnostic experience. This takes 30 seconds.
        </p>

        {/* Divider */}
        <div className="border-t border-neutral-100 mb-8" />

        {error && (
          <p className="font-mono text-xs text-red-600 mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name (readonly from session) */}
          <div>
            <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2">
              Name
            </label>
            <input
              type="text"
              value={session?.user?.name || ''}
              readOnly
              className="w-full px-4 py-3 border border-[#e2e6ea] font-mono text-sm text-neutral-400 bg-neutral-50"
            />
          </div>

          {/* Email (readonly from session) */}
          <div>
            <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2">
              Email
            </label>
            <input
              type="email"
              value={session?.user?.email || ''}
              readOnly
              className="w-full px-4 py-3 border border-[#e2e6ea] font-mono text-sm text-neutral-400 bg-neutral-50"
            />
          </div>

          {/* University */}
          <div>
            <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2">
              University
            </label>
            <input
              type="text"
              placeholder="e.g. Harvard University"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="w-full px-4 py-3 border border-[#e2e6ea] font-mono text-sm text-[#051c2c] placeholder:text-[#a0aec0] focus:outline-none focus:border-[#051c2c] transition-colors"
            />
          </div>

          {/* Graduation Year */}
          <div>
            <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2">
              Graduation Year
            </label>
            <select
              value={graduationYear}
              onChange={(e) => setGraduationYear(e.target.value)}
              className="w-full px-4 py-3 border border-[#e2e6ea] font-mono text-sm text-[#051c2c] focus:outline-none focus:border-[#051c2c] transition-colors bg-white"
            >
              <option value="">Select year</option>
              {GRADUATION_YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Target Role */}
          <div>
            <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2">
              Target Role
            </label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-4 py-3 border border-[#e2e6ea] font-mono text-sm text-[#051c2c] focus:outline-none focus:border-[#051c2c] transition-colors bg-white"
            >
              <option value="">Select role</option>
              {TARGET_ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Prep Background */}
          <div>
            <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2">
              Prep Background
            </label>
            <select
              value={prepBackground}
              onChange={(e) => setPrepBackground(e.target.value)}
              className="w-full px-4 py-3 border border-[#e2e6ea] font-mono text-sm text-[#051c2c] focus:outline-none focus:border-[#051c2c] transition-colors bg-white"
            >
              <option value="">Select background</option>
              {PREP_BACKGROUNDS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Divider */}
          <div className="border-t border-neutral-100 pt-3" />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#0A0A0A] text-white font-mono text-sm tracking-wider uppercase hover:bg-[#1F1F1F] active:bg-[#000] disabled:opacity-40 transition-colors duration-150"
          >
            {loading ? 'Saving...' : 'Continue to Diagnostic →'}
          </button>

          {/* Skip */}
          <button
            type="button"
            onClick={onSkip}
            className="w-full text-center font-mono text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            Skip for now
          </button>
        </form>
      </div>
    </div>
  );
}
