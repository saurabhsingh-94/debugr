"use client";

import { ArrowLeft, Fingerprint, Database, EyeOff, Lock, Share2, Trash2, Mail, ShieldAlert, Cookie } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-rose-500/30">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-16 space-y-10">
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 hover:text-white transition-colors group">
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          Back
        </Link>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Legal</p>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black italic uppercase tracking-tighter">
            Privacy <span className="text-zinc-700">Policy</span>
          </h1>
          <p className="text-zinc-600 text-xs font-medium">Effective Date: March 2026 · Last Updated: March 2026</p>
        </div>

        <p className="text-zinc-400 text-sm leading-relaxed">
          At <strong className="text-white">Debugr</strong>, your privacy is a core principle — not an afterthought.
          This policy explains exactly what data we collect, why we collect it, how we use it, and your rights over it.
          We do not sell your data. Ever.
        </p>

        <div className="space-y-10 text-zinc-400 text-sm leading-relaxed">

          <Section icon={<Fingerprint className="w-4 h-4 text-rose-400" />} title="1. What Data We Collect">
            <p>We collect only what is necessary to operate the platform:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-zinc-500">
              <li><strong className="text-zinc-300">Account data:</strong> Name, email address, and profile picture from your Google or GitHub OAuth login</li>
              <li><strong className="text-zinc-300">Username:</strong> A unique handle you choose when joining</li>
              <li><strong className="text-zinc-300">Content:</strong> Posts, problems, prompts, signals, and comments you create on the platform</li>
              <li><strong className="text-zinc-300">Transaction data:</strong> Purchase history and payout records (processed by Cashfree — we do not store raw card details)</li>
              <li><strong className="text-zinc-300">Usage data:</strong> Pages visited, features used, and interaction patterns to improve the product</li>
              <li><strong className="text-zinc-300">Device data:</strong> Browser type, operating system, and IP address for security and fraud prevention</li>
            </ul>
          </Section>

          <Section icon={<Database className="w-4 h-4 text-rose-400" />} title="2. How We Use Your Data">
            <p>Your data is used exclusively to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-zinc-500">
              <li>Authenticate your identity and maintain your account</li>
              <li>Display your profile, posts, and activity on the platform</li>
              <li>Process Marketplace transactions and facilitate creator payouts</li>
              <li>Send transactional emails (purchase confirmations, notifications) via Resend</li>
              <li>Detect and prevent fraud, abuse, and security threats</li>
              <li>Improve platform features based on aggregated, anonymized usage patterns</li>
            </ul>
            <p className="mt-3">We do <strong className="text-white">not</strong> use your data for advertising, profiling, or selling to third parties.</p>
          </Section>

          <Section icon={<Share2 className="w-4 h-4 text-rose-400" />} title="3. Data Sharing & Third Parties">
            <p>We share your data only with trusted service providers who help us operate the platform:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-zinc-500">
              <li><strong className="text-zinc-300">Neon (PostgreSQL):</strong> Secure database hosting for all platform data</li>
              <li><strong className="text-zinc-300">Cashfree Payments:</strong> Payment processing for Marketplace transactions</li>
              <li><strong className="text-zinc-300">Resend:</strong> Transactional email delivery</li>
              <li><strong className="text-zinc-300">Vercel:</strong> Platform hosting and edge infrastructure</li>
              <li><strong className="text-zinc-300">Google / GitHub OAuth:</strong> Authentication only — we do not receive your passwords</li>
            </ul>
            <p className="mt-3">All third-party providers are contractually bound to protect your data and may not use it for their own purposes.</p>
          </Section>

          <Section icon={<Cookie className="w-4 h-4 text-rose-400" />} title="4. Cookies & Sessions">
            <p>Debugr uses session cookies to keep you logged in. We do not use tracking cookies, advertising cookies, or third-party analytics cookies. You can clear cookies at any time through your browser settings, which will log you out of the platform.</p>
          </Section>

          <Section icon={<Lock className="w-4 h-4 text-rose-400" />} title="5. Data Security">
            <p>We take security seriously. Your data is stored in encrypted databases, transmitted over HTTPS, and access is restricted to authorized personnel only. Paywalled prompt content is encrypted at rest and only revealed upon verified purchase. We conduct regular security reviews and follow industry best practices.</p>
            <p className="mt-3">However, no system is 100% secure. If you discover a vulnerability, please report it to <a href="mailto:work.debugr@gmail.com" className="text-rose-400 hover:text-rose-300 transition-colors">work.debugr@gmail.com</a>.</p>
          </Section>

          <Section icon={<EyeOff className="w-4 h-4 text-rose-400" />} title="6. Your Rights">
            <p>You have the following rights over your data:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-zinc-500">
              <li><strong className="text-zinc-300">Access:</strong> Request a copy of all data we hold about you</li>
              <li><strong className="text-zinc-300">Correction:</strong> Update inaccurate information via your profile settings</li>
              <li><strong className="text-zinc-300">Deletion:</strong> Request full account and data deletion — we will process this within 30 days</li>
              <li><strong className="text-zinc-300">Portability:</strong> Request your data in a machine-readable format</li>
              <li><strong className="text-zinc-300">Opt-out:</strong> Unsubscribe from non-essential emails at any time</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, email us at <a href="mailto:work.debugr@gmail.com" className="text-rose-400 hover:text-rose-300 transition-colors">work.debugr@gmail.com</a>.</p>
          </Section>

          <Section icon={<Trash2 className="w-4 h-4 text-rose-400" />} title="7. Data Retention">
            <p>We retain your account data for as long as your account is active. If you delete your account, we will remove your personal data within 30 days, except where we are legally required to retain certain transaction records (typically 7 years for financial records under Indian law).</p>
          </Section>

          <Section icon={<ShieldAlert className="w-4 h-4 text-rose-400" />} title="8. Children's Privacy">
            <p>Debugr is not intended for users under the age of 13. We do not knowingly collect data from children. If you believe a child has created an account, please contact us immediately and we will delete the account.</p>
          </Section>

          <Section icon={<Mail className="w-4 h-4 text-rose-400" />} title="9. Contact & Updates">
            <p>If you have any questions about this Privacy Policy, contact us at:</p>
            <a href="mailto:work.debugr@gmail.com" className="text-rose-400 hover:text-rose-300 transition-colors font-bold mt-1 block">
              work.debugr@gmail.com
            </a>
            <p className="mt-3">We may update this policy from time to time. Significant changes will be communicated via email or an in-app notice. Continued use of the platform after changes constitutes acceptance of the updated policy.</p>
          </Section>

          <div className="pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] font-black text-zinc-800 uppercase tracking-widest">
              © 2026 Debugr · All rights reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="text-white font-bold flex items-center gap-2 text-base">
        {icon}
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </section>
  );
}
