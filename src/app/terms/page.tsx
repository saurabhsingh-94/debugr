"use client";

import { Shield, Lock, FileText, ArrowLeft, AlertTriangle, CreditCard, UserCheck, Ban, Scale, Mail } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-violet-500/30">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-16 space-y-10">
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 hover:text-white transition-colors group">
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          Back
        </Link>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-violet-500 rounded-full shadow-[0_0_8px_rgba(124,58,237,0.8)]" />
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Legal</p>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black italic uppercase tracking-tighter">
            Terms of <span className="text-zinc-700">Service</span>
          </h1>
          <p className="text-zinc-600 text-xs font-medium">Effective Date: March 2025 · Last Updated: March 2025</p>
        </div>

        <p className="text-zinc-400 text-sm leading-relaxed">
          Welcome to <strong className="text-white">Debugr</strong>. By accessing or using our platform at{" "}
          <strong className="text-violet-400">debugr.app</strong>, you agree to be bound by these Terms of Service.
          Please read them carefully. If you do not agree, do not use the platform.
        </p>

        <div className="space-y-10 text-zinc-400 text-sm leading-relaxed">

          <Section icon={<UserCheck className="w-4 h-4 text-violet-400" />} title="1. Eligibility & Account">
            <p>You must be at least 13 years old to use Debugr. By creating an account, you confirm that all information you provide is accurate and that you are legally permitted to enter into this agreement. You are responsible for maintaining the security of your account credentials. Debugr is not liable for any loss resulting from unauthorized access to your account.</p>
          </Section>

          <Section icon={<FileText className="w-4 h-4 text-violet-400" />} title="2. Acceptable Use">
            <p>You agree not to use Debugr to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-zinc-500">
              <li>Post content that is illegal, harmful, abusive, or violates any third-party rights</li>
              <li>Scrape, crawl, or extract data from the platform without written permission</li>
              <li>Attempt to reverse-engineer, hack, or disrupt the platform or its infrastructure</li>
              <li>Impersonate other users, developers, or Debugr staff</li>
              <li>Upload malicious code, spam, or misleading content</li>
              <li>Circumvent any access controls or payment systems</li>
            </ul>
            <p className="mt-3">Violation of these rules may result in immediate account suspension or permanent ban without refund.</p>
          </Section>

          <Section icon={<Shield className="w-4 h-4 text-violet-400" />} title="3. Intellectual Property">
            <p>All prompts, posts, and content you create on Debugr remain your intellectual property. By publishing content on the platform, you grant Debugr a non-exclusive, worldwide, royalty-free license to host, display, and distribute your content solely for the purpose of operating the platform.</p>
            <p className="mt-3">Debugr's own branding, design, code, and platform infrastructure are protected by copyright and may not be copied or reproduced without explicit written consent.</p>
          </Section>

          <Section icon={<CreditCard className="w-4 h-4 text-violet-400" />} title="4. Payments, Marketplace & Fees">
            <p>Transactions on the Debugr Marketplace are processed via <strong className="text-white">Cashfree Payments</strong>. By making a purchase, you agree to Cashfree's terms in addition to ours.</p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-zinc-500">
              <li>Debugr charges a platform fee on each Marketplace transaction (currently 10–15%)</li>
              <li>All sales are final once a prompt is unlocked and delivered to the buyer</li>
              <li>Refunds are only issued in cases of technical failure or fraudulent listings, at Debugr's sole discretion</li>
              <li>Creators are responsible for accurate pricing and prompt descriptions</li>
              <li>Payouts to creators are processed within 3–7 business days after a successful sale</li>
            </ul>
          </Section>

          <Section icon={<Ban className="w-4 h-4 text-violet-400" />} title="5. Termination">
            <p>Debugr reserves the right to suspend or terminate your account at any time for violations of these Terms, fraudulent activity, or behavior that harms the community. You may also delete your account at any time from your settings. Upon termination, your public content may remain visible unless you explicitly request removal.</p>
          </Section>

          <Section icon={<AlertTriangle className="w-4 h-4 text-violet-400" />} title="6. Disclaimers & Limitation of Liability">
            <p>Debugr is provided "as is" without warranties of any kind. We do not guarantee uninterrupted service, accuracy of AI-generated content, or the quality of user-submitted prompts. To the maximum extent permitted by law, Debugr and its founders shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform.</p>
          </Section>

          <Section icon={<Scale className="w-4 h-4 text-violet-400" />} title="7. Governing Law">
            <p>These Terms are governed by the laws of India. Any disputes shall be resolved through binding arbitration in accordance with Indian arbitration law, or in the courts of jurisdiction where Debugr is registered.</p>
          </Section>

          <Section icon={<Mail className="w-4 h-4 text-violet-400" />} title="8. Contact">
            <p>For legal inquiries or Terms-related questions, contact us at:</p>
            <a href="mailto:work.debugr@gmail.com" className="text-violet-400 hover:text-violet-300 transition-colors font-bold mt-1 block">
              work.debugr@gmail.com
            </a>
          </Section>

          <div className="pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] font-black text-zinc-800 uppercase tracking-widest">
              © 2025 Debugr · All rights reserved
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
