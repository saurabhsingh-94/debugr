"use client";

import { motion } from "framer-motion";
import { ShieldAlert, Database, Lock, ArrowLeft, Fingerprint, EyeOff } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 md:p-24 selection:bg-rose-500/30">
      <div className="max-w-3xl mx-auto space-y-12">
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 hover:text-white transition-colors group">
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-1.5 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
             <h1 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Section 02: Neural Privacy</h1>
          </div>
          <h2 className="text-5xl font-black italic uppercase tracking-tighter">Privacy <span className="text-zinc-700">Directive</span></h2>
        </div>

        <div className="space-y-12 text-zinc-400 text-sm leading-relaxed font-medium">
          <section className="space-y-4">
            <h3 className="text-white font-bold flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-rose-400" />
              1. Data Point: Identity Collection
            </h3>
            <p>We collect essential telemetry: Your name, email, and secure identifiers linked to your GitHub or Google accounts. This is used solely to authenticate your presence within the Debugr network.</p>
          </section>

          <section className="space-y-4">
            <h3 className="text-white font-bold flex items-center gap-2">
              <Database className="w-4 h-4 text-rose-400" />
              2. Data Point: Intelligence Storage
            </h3>
            <p>Any prompts or intel you share are stored securely in our Neon PostgreSQL clusters. Paywalled content is encrypted and only revealed upon successful transaction verification.</p>
          </section>

          <section className="space-y-4">
            <h3 className="text-white font-bold flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-rose-400" />
              3. Data Point: Zero-Trace Sharing
            </h3>
            <p>We never sell your telemetry to third-party advertisers. Your information is used only to facilitate the Marketplace economy and keep the Debugr ecosystem stable.</p>
          </section>

          <section className="space-y-4 pt-8 border-t border-white/5">
             <p className="text-[10px] font-black text-zinc-800 uppercase tracking-widest italic text-center">Status: Active • March 2024</p>
          </section>
        </div>
      </div>
    </div>
  );
}
