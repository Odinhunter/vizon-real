'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [dropdownOpen]);

  const userInitial = session?.user?.name?.[0]?.toUpperCase() || session?.user?.email?.[0]?.toUpperCase();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-3 md:px-4 pt-3 md:pt-4">
      <nav
        className={`w-full max-w-[1400px] transition-all duration-500 rounded-full border ${
          scrolled
            ? 'bg-white/70 backdrop-blur-2xl border-white/60 shadow-lg shadow-black/[0.04]'
            : 'bg-white/[0.06] backdrop-blur-lg border-white/10 shadow-lg shadow-black/[0.08]'
        }`}
      >
        <div className="relative px-4 md:px-6 lg:px-8 h-[48px] md:h-[52px] flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#e8521a] inline-block" />
            <span className={`font-mono text-[12px] font-medium tracking-[0.2em] transition-colors duration-300 ${scrolled ? 'text-[#051c2c]' : 'text-white'}`}>
              VIZON
            </span>
          </Link>

          {/* Center nav — desktop only, absolutely centered */}
          <div className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            <a href="#tracks" className={`text-[13px] font-medium transition-colors duration-300 ${scrolled ? 'text-[#4a5568] hover:text-[#051c2c]' : 'text-white/80 hover:text-white'}`}>
              Tracks
            </a>
            <a href="#how-it-works" className={`text-[13px] font-medium transition-colors duration-300 ${scrolled ? 'text-[#4a5568] hover:text-[#051c2c]' : 'text-white/80 hover:text-white'}`}>
              How it works
            </a>
            <a href="#output" className={`text-[13px] font-medium transition-colors duration-300 ${scrolled ? 'text-[#4a5568] hover:text-[#051c2c]' : 'text-white/80 hover:text-white'}`}>
              Output
            </a>
          </div>

          {/* Right side: auth-aware */}
          <div className="flex items-center gap-2 md:gap-4">
            {status === 'loading' ? (
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 rounded-full bg-neutral-200 animate-pulse" />
                <div className="w-20 md:w-24 h-8 rounded-xl bg-neutral-200 animate-pulse" />
              </div>
            ) : session ? (
              <>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((o) => !o)}
                    title="Account"
                    className="w-8 h-8 rounded-full bg-[#051c2c] text-white text-[11px] font-semibold flex items-center justify-center hover:bg-[#0a2f47] transition-colors"
                  >
                    {userInitial}
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-neutral-100 py-1.5 z-50">
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => { setDropdownOpen(false); signOut(); }}
                        className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
                <Link
                  href="/diagnostic?track=consulting"
                  className="bg-[#1A56DB] text-white text-[12px] md:text-[13px] font-semibold px-4 md:px-6 py-2 rounded-xl hover:bg-[#1548b8] transition-colors"
                >
                  <span className="hidden sm:inline">Run Diagnostic →</span>
                  <span className="sm:hidden">Diagnostic →</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`text-[12px] md:text-[13px] font-medium transition-colors duration-300 ${scrolled ? 'text-[#4a5568] hover:text-[#051c2c]' : 'text-white/80 hover:text-white'}`}
                >
                  Sign in
                </Link>
                <Link
                  href="/signup?callbackUrl=/diagnostic?track=consulting"
                  className="bg-[#1A56DB] text-white text-[12px] md:text-[13px] font-semibold px-4 md:px-6 py-2 rounded-xl hover:bg-[#1548b8] transition-colors"
                >
                  Get Started →
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
