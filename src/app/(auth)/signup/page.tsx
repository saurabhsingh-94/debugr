"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Github, Chrome, ArrowRight, ShieldCheck, X, Shield, Lock, FileText, AlertTriangle, CreditCard, UserCheck, Ban, Scale, Mail, Fingerprint, Database, EyeOff, Share2, Trash2, ShieldAlert, Cookie } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { signInWithGithub, signInWithGoogle } from "@/lib/auth-actions";
import { useState } from "react";

function TermsModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-2xl max-h-[85vh] bg-[#0c0c14] border border-white/10 rounded-3xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
            <h2 className="text-sm font-black text-white uppercase tracking-widest">Terms & Privacy</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-zinc-500 hover:text-white transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-6 py-6 space-y-8 text-zinc-400 text-sm leading-relaxed">

          {/* TERMS */}
          <div className="space-y-6">
            <h3 className="text-white font-black text-base uppercase tracking-wider">Terms of Service</h3>
            <p className="text-zinc-500 text-xs">Effective: March 2026</p>

            <ModalSection icon={<UserCheck className="w-4 h-4 text-violet-400" />} title="1. Eligibility & Account">
              You must be at least 13 years old to use Debugr. You are responsible for keeping your account secure. Debugr is not liable for unauthorized access to your account.
            </ModalSection>

            <ModalSection icon={<FileText className="w-4 h-4 text-violet-400" />} title="2. Acceptable Use">
              You agree not to post illegal or harmful content, scrape data, hack the platform, impersonate others, or circumvent payment systems. Violations may result in account suspension.
            </ModalSection>

            <ModalSection icon={<Shield className="w-4 h-4 text-violet-400" />} title="3. Intellectual Property">
              Content you create remains yours. By posting, you give Debugr a license to host and display it. Debugr's own branding and code may not be copied without permission.
            </ModalSection>

            <ModalSection icon={<CreditCard className="w-4 h-4 text-violet-400" />} title="4. Payments & Fees">
              Payments are processed via Cashfree. Debugr charges a 15–20% platform fee per transaction. All sales are final once a prompt is delivered. Refunds are only issued for technical failures or fraud.
            </ModalSection>

            <ModalSection icon={<Ban className="w-4 h-4 text-violet-400" />} title="5. Termination">
              We may suspend or terminate accounts for violations. You can delete your account anytime from settings.
            </ModalSection>

            <ModalSection icon={<AlertTriangle className="w-4 h-4 text-violet-400" />} title="6. Disclaimers">
              Debugr is provided "as is". We do not guarantee uninterrupted service or the quality of user-submitted content. We are not liable for indirect damages.
            </ModalSection>

            <ModalSection icon={<Scale className="w-4 h-4 text-violet-400" />} title="7. Governing Law">
              These Terms are governed by the laws of India.
            </ModalSection>
          </div>

          <div className="h-px bg-white/5" />

          {/* PRIVACY */}
          <div className="space-y-6">
            <h3 className="text-white font-black text-base uppercase tracking-wider">Privacy Policy</h3>
            <p className="text-zinc-500 text-xs">Effective: March 2026 · We do not sell your data. Ever.</p>

            <ModalSection icon={<Fingerprint className="w-4 h-4 text-rose-400" />} title="1. What We Collect">
              Name, email, profile picture (from Google/GitHub login), username, content you post, purchase history, and basic device/usage data for security.
            </ModalSection>

            <ModalSection icon={<Database className="w-4 h-4 text-rose-400" />} title="2. How We Use It">
              To run your account, show your profile, process payments, send emails, and improve the platform. We do not use your data for ads or sell it to anyone.
            </ModalSection>

            <ModalSection icon={<Share2 className="w-4 h-4 text-rose-400" />} title="3. Who We Share With">
              Only trusted service providers: Neon (database), Cashfree (payments), Resend (email), Vercel (hosting), Google/GitHub (login only).
            </ModalSection>

            <ModalSection icon={<Cookie className="w-4 h-4 text-rose-400" />} title="4. Cookies">
              We only use session cookies to keep you logged in. No tracking or advertising cookies.
            </ModalSection>

            <ModalSection icon={<EyeOff className="w-4 h-4 text-rose-400" />} title="5. Your Rights">
              You can access, correct, or delete your data at any time. Email us at work.debugr@gmail.com to exercise these rights.
            </ModalSection>

            <ModalSection icon={<Trash2 className="w-4 h-4 text-rose-400" />} title="6. Data Deletion">
              Delete your account anytime. Personal data is removed within 30 days. Transaction records may be kept for 7 years as required by law.
            </ModalSection>
          </div>

          <div className="text-center pt-4 pb-2">
            <p className="text-[10px] text-zinc-700 uppercase tracking-widest">© 2026 Debugr · All rights reserved</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/5 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold transition-all active:scale-[0.98]"
          >
            Got it
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ModalSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <h4 className="text-white text-xs font-bold flex items-center gap-2">{icon}{title}</h4>
      <p className="text-zinc-500 text-xs leading-relaxed pl-6">{children}</p>
    </div>
  );
}

export default function SignupPage() {
  const [agreed, setAgreed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showError, setShowError] = useState(false);

  function handleSignIn(fn: () => void) {
    if (!agreed) {
      setShowError(true);
      return;
    }
    fn();
  }

  return (
    <div className="min-h-screen w-full bg-[#080808] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-[0.15] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[420px] space-y-10 z-10"
      >
        {/* Brand */}
        <div className="text-center space-y-5">
          <Link href="/" className="inline-block hover:scale-105 active:scale-95 transition-transform">
            <Image src="/logo.svg" alt="logo" width={56} height={56} className="brightness-125 saturate-[0.5]" />
          </Link>
          <div className="space-y-3">
            <h1 className="text-5xl font-serif text-white italic tracking-tight leading-[0.9] uppercase">
              Create <br /> <span className="text-zinc-700">Account</span>
            </h1>
            <p className="text-[11px] font-medium text-zinc-600">Join Debugr — post problems, share prompts, earn money</p>
          </div>
        </div>

        {/* Sign in buttons */}
        <div className="space-y-3">
          <button
            onClick={() => handleSignIn(signInWithGithub)}
            className="w-full h-14 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center gap-4 text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all group active:scale-[0.98]"
          >
            <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Sign up with Github
          </button>
          <button
            onClick={() => handleSignIn(signInWithGoogle)}
            className="w-full h-14 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center gap-4 text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all group active:scale-[0.98]"
          >
            <Chrome className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Sign up with Google
          </button>
        </div>

        {/* T&C Checkbox */}
        <div className="space-y-2">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5 flex-shrink-0">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => { setAgreed(e.target.checked); setShowError(false); }}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${agreed ? "bg-violet-600 border-violet-600" : "border-white/20 bg-white/[0.03] group-hover:border-white/40"}`}>
                {agreed && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-xs text-zinc-500 leading-relaxed">
              I have read and agree to the{" "}
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); setShowModal(true); }}
                className="text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors font-semibold"
              >
                Terms of Service & Privacy Policy
              </button>
            </span>
          </label>

          {showError && (
            <p className="text-xs text-rose-400 pl-8">Please agree to the Terms before continuing.</p>
          )}
        </div>

        {/* Footer links */}
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <Link href="/login" className="group flex items-center gap-3 text-[10px] font-bold text-zinc-700 uppercase tracking-widest hover:text-white transition-colors">
              Already have an account? Sign in
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="pt-6 border-t border-white/[0.03] flex items-center justify-center gap-4 opacity-30">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span className="text-[8px] font-bold text-zinc-800 uppercase tracking-[0.3em]">Secure sign-in · No passwords stored</span>
          </div>
        </div>
      </motion.div>

      {/* Terms Modal */}
      <AnimatePresence>
        {showModal && <TermsModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </div>
  );
}
