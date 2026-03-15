'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

interface LoginFormProps {
  callbackUrl?: string;
  error?: string;
}

function AbstractPanel() {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-3xl" style={{ background: 'linear-gradient(160deg, #051c2c 0%, #0a3d62 35%, #1A56DB 70%, #2d6ff2 100%)' }}>
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 80% 60% at 30% 20%, rgba(26,86,219,0.4) 0%, transparent 60%)',
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 60% 80% at 70% 80%, rgba(99,145,255,0.25) 0%, transparent 50%)',
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(5,28,44,0.3) 0%, transparent 70%)',
      }} />

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="flow1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1A56DB" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6391ff" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="flow2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2d6ff2" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#051c2c" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="flow3" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6391ff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#1A56DB" stopOpacity="0.05" />
          </linearGradient>
          <filter id="blur1">
            <feGaussianBlur in="SourceGraphic" stdDeviation="40" />
          </filter>
          <filter id="blur2">
            <feGaussianBlur in="SourceGraphic" stdDeviation="25" />
          </filter>
        </defs>

        <ellipse cx="150" cy="250" rx="250" ry="180" fill="url(#flow1)" filter="url(#blur1)" opacity="0.8" />
        <ellipse cx="450" cy="600" rx="220" ry="280" fill="url(#flow2)" filter="url(#blur1)" opacity="0.6" />
        <ellipse cx="300" cy="450" rx="300" ry="200" fill="url(#flow3)" filter="url(#blur1)" opacity="0.5" />

        <path d="M0,300 Q150,200 300,350 T600,280" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" fill="none" filter="url(#blur2)" />
        <path d="M0,500 Q200,400 400,550 T600,450" stroke="rgba(255,255,255,0.04)" strokeWidth="1" fill="none" filter="url(#blur2)" />
        <path d="M0,700 Q250,620 350,720 T600,650" stroke="rgba(255,255,255,0.05)" strokeWidth="1.2" fill="none" filter="url(#blur2)" />

        <ellipse cx="200" cy="350" rx="180" ry="60" fill="rgba(99,145,255,0.12)" filter="url(#blur2)" transform="rotate(-15 200 350)" />
        <ellipse cx="400" cy="500" rx="140" ry="45" fill="rgba(255,255,255,0.04)" filter="url(#blur2)" transform="rotate(20 400 500)" />
      </svg>

      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundSize: '128px 128px',
      }} />

      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(5,28,44,0.4) 100%)',
      }} />

      <div className="absolute bottom-10 left-10 right-10">
        <div className="flex items-center gap-2 mb-5">
          <span className="w-[5px] h-[5px] rounded-full bg-[#e8521a]" />
          <span className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">Vizon</span>
        </div>
        <p className="text-[22px] font-semibold text-white/70 leading-snug max-w-[280px]">
          Know where you stand before you walk in.
        </p>
      </div>
    </div>
  );
}

function Spinner({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

export default function LoginForm({ callbackUrl, error: serverError }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(serverError || '');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const redirect = callbackUrl || '/';

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      window.location.href = redirect;
    } catch {
      setError('Something went wrong');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    signIn('google', { callbackUrl: redirect });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex p-3">
      {/* Left — Abstract Panel (hidden on mobile) */}
      <div className="hidden lg:block lg:w-[55%]">
        <AbstractPanel />
      </div>

      {/* Right — Form */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 sm:px-12 lg:px-14 py-12">
        {/* Top bar: logo + sign up link */}
        <div className="w-full max-w-md mx-auto flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-[5px] h-[5px] rounded-full bg-[#e8521a] inline-block" />
            <span className="font-mono text-[11px] font-medium tracking-[0.2em] text-white/60">
              VIZON
            </span>
          </Link>
          <Link
            href="/signup"
            className="text-[13px] text-white/40 hover:text-white/70 transition-colors"
          >
            Don&apos;t have an account?{' '}
            <span className="text-white font-medium underline underline-offset-2">
              Sign up
            </span>
          </Link>
        </div>

        {/* Glass card */}
        <div className="w-full max-w-md mx-auto bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-8 sm:p-10 shadow-[0_8px_64px_rgba(0,0,0,0.3)]">
          {/* Heading */}
          <h1 className="text-[28px] font-bold text-white leading-tight mb-1.5">
            Welcome back
          </h1>
          <p className="text-[14px] text-white/40 mb-8">
            Sign in to access your diagnostic.
          </p>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/10 flex items-start gap-3">
              <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4m0 4h.01" />
              </svg>
              <p className="text-base text-red-400">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleCredentialsSubmit} className="space-y-5">
            <div>
              <label className="block text-[13px] font-medium text-white/70 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 bg-white/[0.06] border border-white/10 rounded-xl text-[15px] text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-white/70 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3.5 bg-white/[0.06] border border-white/10 rounded-xl text-[15px] text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#1A56DB] text-white text-[15px] font-semibold rounded-xl hover:bg-[#1548b8] transition-colors disabled:opacity-40 mt-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 border-t border-white/10" />
            <span className="text-[12px] text-white/25">
              or
            </span>
            <div className="flex-1 border-t border-white/10" />
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full py-3.5 bg-white/[0.06] border border-white/10 rounded-xl text-[14px] font-medium text-white/80 hover:bg-white/[0.1] hover:border-white/20 transition-all flex items-center justify-center gap-3 disabled:opacity-40"
          >
            {googleLoading ? (
              <Spinner />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
