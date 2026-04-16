'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AbstractPanel from './AbstractPanel';
import Spinner from '@/components/ui/Spinner';
import { fadeUp, staggerContainer, errorBanner } from '@/lib/motion/variants';

interface SignUpFormProps {
  callbackUrl?: string;
}

export default function SignUpForm({ callbackUrl }: SignUpFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Only allow relative paths for redirect — prevent open redirect attacks
  const redirect = callbackUrl && callbackUrl.startsWith('/') && !callbackUrl.startsWith('//')
    ? callbackUrl
    : '/diagnostic';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Account created but sign-in failed. Try signing in manually.');
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
      <div className="hidden lg:block lg:w-[55%]">
        <AbstractPanel />
      </div>

      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 sm:px-12 lg:px-14 py-12">
        <div className="w-full max-w-md mx-auto flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-[5px] h-[5px] rounded-full bg-[#e8521a] inline-block" />
            <span className="font-mono text-[11px] font-medium tracking-[0.2em] text-white/60">VIZON</span>
          </Link>
          <Link
            href="/login"
            className="text-[13px] text-white/40 hover:text-white/70 transition-colors"
          >
            Already have an account?{' '}
            <span className="text-white font-medium underline underline-offset-2">Sign in</span>
          </Link>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md mx-auto bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-8 sm:p-10 shadow-[0_8px_64px_rgba(0,0,0,0.3)]"
        >
          <motion.h1 variants={fadeUp} className="text-[28px] font-bold text-white leading-tight mb-1.5">
            Create your account
          </motion.h1>
          <motion.p variants={fadeUp} className="text-[14px] text-white/40 mb-8">
            Sign up to start your career diagnostic.
          </motion.p>

          <AnimatePresence>
            {error && (
              <motion.div
                variants={errorBanner}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/10 flex items-start gap-3 overflow-hidden"
              >
                <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4m0 4h.01" />
                </svg>
                <p className="text-base text-red-400">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div variants={fadeUp}>
              <label className="block text-[13px] font-medium text-white/70 mb-2">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3.5 bg-white/[0.06] border border-white/10 rounded-xl text-[15px] text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all focus:shadow-[0_0_0_3px_rgba(26,86,219,0.15)]"
              />
            </motion.div>

            <motion.div variants={fadeUp}>
              <label className="block text-[13px] font-medium text-white/70 mb-2">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 bg-white/[0.06] border border-white/10 rounded-xl text-[15px] text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all focus:shadow-[0_0_0_3px_rgba(26,86,219,0.15)]"
              />
            </motion.div>

            <motion.div variants={fadeUp}>
              <label className="block text-[13px] font-medium text-white/70 mb-2">Password</label>
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3.5 bg-white/[0.06] border border-white/10 rounded-xl text-[15px] text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all focus:shadow-[0_0_0_3px_rgba(26,86,219,0.15)]"
              />
            </motion.div>

            <motion.div variants={fadeUp}>
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3.5 bg-[#1A56DB] text-white text-[15px] font-semibold rounded-xl hover:bg-[#1548b8] transition-colors disabled:opacity-40 mt-1 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Spinner />
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </motion.button>
            </motion.div>
          </form>

          <motion.div variants={fadeUp} className="flex items-center gap-4 my-7">
            <div className="flex-1 border-t border-white/10" />
            <span className="text-[12px] text-white/25">or</span>
            <div className="flex-1 border-t border-white/10" />
          </motion.div>

          <motion.div variants={fadeUp}>
            <motion.button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              whileTap={{ scale: 0.97 }}
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
              Sign up with Google
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
