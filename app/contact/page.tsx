import Link from 'next/link';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the Vizon team for questions, feedback, or support.',
  alternates: { canonical: 'https://getvizon.com/contact' },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* Nav */}
      <nav className="bg-white border-b border-neutral-100 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#e8521a]" />
          <span className="font-mono text-[12px] font-medium tracking-[0.2em] text-[#051c2c]">VIZON</span>
        </Link>
        <Link href="/" className="text-[13px] text-neutral-500 hover:text-[#051c2c] transition-colors">
          ← Back to home
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <p className="font-mono text-[11px] tracking-[0.2em] text-[#1A56DB] uppercase mb-3">Get in touch</p>
          <h1 className="font-extrabold text-[#051c2c] leading-tight tracking-[-0.02em] mb-4" style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}>
            Contact
          </h1>
          <p className="text-[16px] text-[#4a5568] leading-relaxed max-w-lg">
            Questions, feedback, or issues with your diagnostic? We&apos;re a small team and we read every message.
          </p>
        </div>

        {/* Email card */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-8 mb-8">
          <p className="text-[13px] font-mono text-neutral-400 uppercase tracking-widest mb-3">Email us</p>
          <a
            href="mailto:team@getvizon.com"
            className="text-[22px] font-bold text-[#1A56DB] hover:text-[#1548b8] transition-colors tracking-[-0.01em]"
          >
            team@getvizon.com
          </a>
          <p className="text-[14px] text-neutral-400 mt-3">
            We typically respond within one business day.
          </p>
        </div>

        {/* What to include */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-8">
          <p className="text-[13px] font-mono text-neutral-400 uppercase tracking-widest mb-5">What to include</p>
          <ul className="space-y-4">
            {[
              { label: 'Account support', body: 'Include the email address associated with your account.' },
              { label: 'Result questions', body: 'Share your session ID (visible in your profile) and a description of the issue.' },
              { label: 'General feedback', body: 'Tell us what you liked, what was confusing, or what you\'d like to see improved.' },
              { label: 'Bugs or errors', body: 'Describe what happened, which page you were on, and your browser if relevant.' },
            ].map((item) => (
              <li key={item.label} className="flex gap-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1A56DB] shrink-0 mt-2" />
                <div>
                  <p className="text-[14px] font-semibold text-[#051c2c]">{item.label}</p>
                  <p className="text-[13px] text-neutral-500 leading-relaxed">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1A56DB] mt-16">
        <div className="w-full px-6 lg:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white/70 inline-block" />
            <span className="font-mono text-[12px] font-medium tracking-[0.2em] text-white">VIZON</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-[13px] text-white/60 hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="text-[13px] text-white/60 hover:text-white transition-colors">Terms</Link>
            <Link href="/contact" className="text-[13px] text-white hover:text-white transition-colors">Contact</Link>
          </div>
          <span className="text-[13px] text-white/40">&copy; 2026 Vizon</span>
        </div>
      </footer>
    </div>
  );
}
