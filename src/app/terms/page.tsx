"use client";

import { motion } from "framer-motion";
import { Shield, Lock, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 md:p-24 selection:bg-violet-500/30">
      <div className="max-w-3xl mx-auto space-y-12">
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 hover:text-white transition-colors group">
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-1.5 bg-violet-500 rounded-full shadow-[0_0_8px_rgba(124,58,237,0.8)]" />
             <h1 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Section 01: Service Protocols</h1>
          </div>
          <h2 className="text-5xl font-black italic uppercase tracking-tighter">Terms of <span className="text-zinc-700">Service</span></h2>
        </div>

        <div className="space-y-12 text-zinc-400 text-sm leading-relaxed font-medium">
          <section className="space-y-4">
            <h3 className="text-white font-bold flex items-center gap-2">
              <Shield className="w-4 h-4 text-violet-400" />
              1. Acceptance of Terms
            </h3>
            <p>By accessing Debugr, you agree to be bound by these platform protocols. Our platform is a high-integrity environment for developers to share intelligence and monetize prompts. Unauthorized access or data scraping is strictly prohibited.</p>
          </section>

          <section className="space-y-4">
            <h3 className="text-white font-bold flex items-center gap-2">
              <Lock className="w-4 h-4 text-violet-400" />
              2. Intellectual Property
            </h3>
            <p>All prompts uploaded remain the property of the creator. By listing a prompt in the Marketplace, you grant Debugr a license to host and facilitate its distribution. Users who purchase prompts receive a non-exclusive right to use the intelligence for their own development cycles.</p>
          </section>

          <section className="space-y-4">
            <h3 className="text-white font-bold flex items-center gap-2">
              <FileText className="w-4 h-4 text-violet-400" />
              3. Payments & Fees
            </h3>
            <p>Transactions are processed via Cashfree. Debugr may charge a platform fee for facilitating Marketplace exchanges. All sales are final once the prompt is unlocked and revealed to the purchaser.</p>
          </section>

          <section className="space-y-4 pt-8 border-t border-white/5">
             <p className="text-[10px] font-black text-zinc-800 uppercase tracking-widest italic text-center">Last Updated: March 2024</p>
          </section>
        </div>
      </div>
    </div>
  );
}
