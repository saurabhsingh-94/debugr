"use client";

import { motion } from "framer-motion";
import { 
  Github,
  Chrome,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { signInWithGithub, signInWithGoogle } from "@/lib/auth-actions";

export default function SignupPage() {
  return (
    <div className="min-h-screen w-full bg-[#080808] flex items-center justify-center p-6 relative overflow-hidden">
      {/* GHOST_BACKGROUND_ELEMENTS */}
      <div className="absolute inset-0 dot-grid opacity-[0.15] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] blur-[100px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[420px] space-y-12 z-10"
      >
        {/* BRAND_PROTOCOL */}
        <div className="text-center space-y-6">
          <Link href="/" className="inline-block hover:scale-105 active:scale-95 transition-transform">
            <Image src="/logo.svg" alt="logo" width={56} height={56} className="brightness-125 saturate-[0.5]" />
          </Link>
          <div className="space-y-4">
            <h1 className="text-5xl font-serif text-white italic tracking-tight leading-[0.9] uppercase">
               Agent <br /> <span className="text-zinc-700">Registry</span>
            </h1>
            <div className="flex items-center justify-center gap-2">
               <div className="w-1.5 h-1.5 bg-white animate-pulse rounded-full" />
               <p className="text-[10px] font-bold text-zinc-800 uppercase tracking-[0.4em]">Initialize_Neural_Identity</p>
            </div>
          </div>
        </div>

        {/* SOCIAL_UPLINKS */}
        <div className="space-y-3">
          <button 
            onClick={() => signInWithGithub()}
            className="w-full h-14 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center gap-4 text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all group active:scale-[0.98]"
          >
            <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Register with Github
          </button>
          <button 
            onClick={() => signInWithGoogle()}
            className="w-full h-14 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center gap-4 text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all group active:scale-[0.98]"
          >
            <Chrome className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Register with Google
          </button>
        </div>

        {/* SEPARATOR_PROTOCOL */}
        <div className="flex items-center gap-6 opacity-20 px-8">
           <div className="h-[1px] flex-1 bg-white" />
           <span className="text-[8px] font-bold text-white uppercase tracking-[0.5em]">Authentication</span>
           <div className="h-[1px] flex-1 bg-white" />
        </div>

        {/* FOOTER_PROTOCOL */}
        <div className="space-y-8">
           <div className="flex flex-col items-center gap-4">
              <Link href="/login" className="group flex items-center gap-3 text-[10px] font-bold text-zinc-700 uppercase tracking-widest hover:text-white transition-colors">
                 Existing Node Identity
                 <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
           </div>
           
           <div className="pt-8 border-t border-white/[0.03] flex items-center justify-center gap-4 opacity-30">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span className="text-[8px] font-bold text-zinc-800 uppercase tracking-[0.3em]">SECURE IDENTITY PROTOCOL v.2.2</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
