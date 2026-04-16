import Link from 'next/link';

import type { Metadata } from 'next';

export const revalidate = 86400; // ISR: regenerate at most once per day

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms and conditions that govern your use of the Vizon career diagnostic platform.',
  alternates: { canonical: 'https://getvizon.com/terms' },
};

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-[14px] text-neutral-400 font-mono">Last updated: March 2026</p>
        </div>

        <div className="space-y-10 text-[15px] text-[#4a5568] leading-relaxed">

          <section>
            <h2 className="text-[17px] font-bold text-[#051c2c] mb-3">Agreement</h2>
            <p>
              By creating an account or using Vizon, you agree to these terms. If you do not agree, do not use the platform. These terms apply to all users of Vizon.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-bold text-[#051c2c] mb-3">What Vizon is</h2>
            <p>
              Vizon is a career diagnostic tool that assesses capability across skills relevant to consulting, finance, and analytics careers. The platform is designed to give you an objective signal about where you stand relative to professional hiring benchmarks.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-bold text-[#051c2c] mb-3">Results are informational only</h2>
            <p>
              Diagnostic results — including scores, verdicts, archetype classifications, firm fit percentages, and recommendations — are <strong className="text-[#051c2c]">informational insights only</strong>. They do not constitute professional career advice, employment guarantees, or predictions of hiring outcomes. Results reflect performance on the Vizon assessment, not any firm's actual evaluation criteria or hiring decisions.
            </p>
            <p className="mt-3">
              You should not rely solely on your Vizon results when making career decisions. We strongly encourage speaking with career advisors, mentors, or other qualified professionals.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-bold text-[#051c2c] mb-3">Honest responses</h2>
            <p>
              Vizon's results are only meaningful if you engage honestly with the assessment. You agree to provide genuine responses that reflect your own thinking and capabilities. Using AI assistants, copying from external sources, or otherwise misrepresenting your responses undermines the diagnostic and violates these terms.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-bold text-[#051c2c] mb-3">Acceptable use</h2>
            <p className="mb-4">You agree not to:</p>
            <ul className="space-y-2 list-none">
              {[
                'Use the platform for any unlawful purpose.',
                'Attempt to reverse-engineer, scrape, or extract the diagnostic content or scoring methodology.',
                'Share your account credentials with others.',
                'Interfere with the platform\'s operation or attempt to access systems you are not authorised to access.',
                'Use the platform to misrepresent your qualifications to third parties.',
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-[#1A56DB] shrink-0 mt-1 font-mono text-[12px]">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-[17px] font-bold text-[#051c2c] mb-3">Your account</h2>
            <p>
              You are responsible for maintaining the security of your account. You must be at least 16 years old to use Vizon. One person, one account — creating multiple accounts to game the diagnostic is not permitted.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-bold text-[#051c2c] mb-3">Intellectual property</h2>
            <p>
              All diagnostic content, case materials, scoring methodology, and platform software are the intellectual property of Vizon. You may not reproduce, distribute, or create derivative works from any part of the platform without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-bold text-[#051c2c] mb-3">Limitation of liability</h2>
            <p>
              Vizon is provided "as is" without warranty of any kind. To the maximum extent permitted by law, Vizon and its operators are not liable for any indirect, incidental, or consequential damages arising from your use of the platform — including but not limited to career outcomes, lost opportunities, or decisions made based on diagnostic results.
            </p>
            <p className="mt-3">
              Our total liability to you for any claim arising from use of the platform will not exceed the amount you paid for the service in the 12 months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-bold text-[#051c2c] mb-3">Platform changes</h2>
            <p>
              Vizon is an evolving product. We may add, modify, or remove features at any time without notice. We may also suspend or discontinue the service entirely, though we will endeavour to provide reasonable notice if this occurs. Diagnostic content, benchmarks, and scoring methodology may change as we improve the platform.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-bold text-[#051c2c] mb-3">Updates to these terms</h2>
            <p>
              We may update these terms as the platform evolves. We will notify you of material changes via email or an in-app notice. Continued use of Vizon after changes take effect constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-bold text-[#051c2c] mb-3">Contact</h2>
            <p>
              Questions about these terms?{' '}
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
            <Link href="/privacy" className="text-[13px] text-white/60 hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="text-[13px] text-white hover:text-white transition-colors">Terms</Link>
            <Link href="/contact" className="text-[13px] text-white/60 hover:text-white transition-colors">Contact</Link>
          </div>
          <span className="text-[13px] text-white/40">&copy; 2026 Vizon</span>
        </div>
      </footer>
    </div>
  );
}
