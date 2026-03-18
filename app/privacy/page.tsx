import Link from 'next/link';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Vizon collects, uses, and protects your data during career diagnostics.',
  alternates: { canonical: 'https://getvizon.com/privacy' },
};

export default function PrivacyPage() {
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
          <p className="font-mono text-[11px] tracking-[0.2em] text-[#1A56DB] uppercase mb-3">Legal</p>
          <h1 className="font-extrabold text-[#051c2c] leading-tight tracking-[-0.02em] mb-4" style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}>
            Privacy Policy
          </h1>
          <p className="text-[14px] text-neutral-400 font-mono">Last updated: March 2026</p>
        </div>

        <div className="space-y-10 text-[15px] text-[#4a5568] leading-relaxed">

          <section>
            <h2 className="text-[17px] font-bold text-[#051c2c] mb-3">Overview</h2>
            <p>
              Vizon is a career diagnostic platform. We take your privacy seriously and collect only what is necessary to provide the service. This policy explains what data we collect, how we use it, and how we protect it.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-bold text-[#051c2c] mb-3">What we collect</h2>
            <p className="mb-4">When you create an account and use Vizon, we collect:</p>
            <ul className="space-y-2 list-none">
              {[
                'Account information — your name, email address, and hashed password (or OAuth identity if you sign in with Google).',
                'Profile information — university, graduation year, target role, and preparation background, which you provide optionally during setup.',
                'Diagnostic responses — the written answers you submit during assessments. These are stored so your results can be generated and retrieved.',
                'Session metadata — track selection, timestamps, and completion status.',
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-[#1A56DB] shrink-0 mt-1 font-mono text-[12px]">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-[17px] font-bold text-[#051c2c] mb-3">AI processing</h2>
            <p>
              Diagnostic responses are analyzed using large language model (LLM) systems to score your performance and generate your results report. Your responses are sent to an AI provider (Anthropic) solely for this evaluation purpose. They are not used to train external models.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-bold text-[#051c2c] mb-3">How we use your data</h2>
            <p className="mb-4">Your data is used to:</p>
            <ul className="space-y-2 list-none">
              {[
                'Create and manage your account.',
                'Run the diagnostic and generate your results.',
                'Display your past results on your profile.',
                'Improve the platform over time (aggregated and anonymised).',
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-[#1A56DB] shrink-0 mt-1 font-mono text-[12px]">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4">We do not sell your data to third parties or use it for advertising.</p>
          </section>

          <section>
            <h2 className="text-[17px] font-bold text-[#051c2c] mb-3">Data storage and security</h2>
            <p>
              Your data is stored in a secured database. Passwords are hashed using bcrypt and never stored in plain text. OAuth accounts do not require a password. We use HTTPS for all data in transit. Access to the database is restricted to the application and authorised team members only.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-bold text-[#051c2c] mb-3">Cookies and analytics</h2>
            <p>
              Vizon uses session cookies strictly to maintain your authenticated state — no tracking cookies, advertising pixels, or third-party analytics scripts. We may collect basic server-side metrics (page load counts, error rates) for reliability purposes, but these are not tied to individual user identities.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-bold text-[#051c2c] mb-3">Shareable results</h2>
            <p>
              When you share a results link, that link is publicly accessible to anyone with the URL. The link contains your diagnostic scores and report, but no personal account information (name, email, profile details). Only share results links if you are comfortable with the recipient seeing your scores.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-bold text-[#051c2c] mb-3">Your rights</h2>
            <p>
              You may request deletion of your account and associated data at any time by contacting us at{' '}
              <a href="mailto:team@getvizon.com" className="text-[#1A56DB] hover:underline">team@getvizon.com</a>.
              We will fulfil deletion requests within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-bold text-[#051c2c] mb-3">Changes to this policy</h2>
            <p>
              We may update this policy as the platform evolves. Material changes will be communicated via email or a notice on the site. Continued use of Vizon after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-bold text-[#051c2c] mb-3">Contact</h2>
            <p>
              Questions about this policy?{' '}
              <a href="mailto:team@getvizon.com" className="text-[#1A56DB] hover:underline">team@getvizon.com</a>
            </p>
          </section>

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
            <Link href="/privacy" className="text-[13px] text-white hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="text-[13px] text-white/60 hover:text-white transition-colors">Terms</Link>
            <Link href="/contact" className="text-[13px] text-white/60 hover:text-white transition-colors">Contact</Link>
          </div>
          <span className="text-[13px] text-white/40">&copy; 2026 Vizon</span>
        </div>
      </footer>
    </div>
  );
}
