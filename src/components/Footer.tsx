"use client";

import { motion } from "framer-motion";
import { Mail, Shield, Lock, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#050505] border-t border-white/5 py-24 px-8 mt-20 relative overflow-hidden">
      {/* Decorative background light */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-violet-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 relative z-10">
        <div className="md:col-span-5 space-y-8">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-violet-500 rounded-full shadow-[0_0_12px_rgba(124,58,237,0.8)]" />
             <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">Debugr <span className="text-zinc-800">— Problem Tracker</span></h2>
          </div>
          <p className="text-zinc-600 text-[13px] font-medium leading-relaxed max-w-sm">
            A community platform where developers and AI users share problems, discover solutions, and buy or sell useful AI prompts.
          </p>
          
          <div className="flex items-center gap-6 pt-4">
             <div className="space-y-1">
                <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Founding Team</p>
                <div className="flex items-center gap-3">
                   <p className="text-[11px] font-black text-white uppercase tracking-wider">Saurabh Kumar Singh</p>
                   <div className="w-1 h-1 bg-zinc-800 rounded-full" />
                   <p className="text-[11px] font-black text-white uppercase tracking-wider">Dennis Pradhan</p>
                </div>
             </div>
          </div>
        </div>

        <div className="md:col-span-3 space-y-6">
           <h3 className="text-[11px] font-black text-zinc-800 uppercase tracking-[0.4em]">Links</h3>
           <nav className="flex flex-col gap-4">
              <FooterLink href="/terms" icon={<Shield className="w-3.5 h-3.5" />} label="Terms of Service" />
              <FooterLink href="/privacy" icon={<Lock className="w-3.5 h-3.5" />} label="Privacy Policy" />
              <FooterLink href="/docs" icon={<ExternalLink className="w-3.5 h-3.5" />} label="Documentation" />
           </nav>
        </div>

        <div className="md:col-span-4 space-y-8">
           <h3 className="text-[11px] font-black text-zinc-800 uppercase tracking-[0.4em]">Contact Us</h3>
           <a 
              href="mailto:work.debugr@gmail.com"
              className="group block p-6 bg-white/[0.02] border border-white/5 rounded-[32px] hover:bg-white/[0.04] transition-all hover:border-violet-500/20"
           >
              <div className="flex items-center justify-between mb-4">
                 <div className="p-3 bg-violet-500/10 rounded-2xl">
                    <Mail className="w-5 h-5 text-violet-400" />
                 </div>
                 <ExternalLink className="w-4 h-4 text-zinc-800 group-hover:text-white transition-all" />
              </div>
              <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest mb-1">Email Support</p>
              <p className="text-sm font-black text-white">work.debugr@gmail.com</p>
           </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-30">
         <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">© 2026 Debugr • All rights reserved</p>
         <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-emerald-500 rounded-full" />
            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">All systems running</p>
         </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, icon, label }: { href: string; icon: any; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 text-zinc-500 hover:text-violet-400 transition-colors group">
       <span className="p-2 bg-white/[0.03] rounded-lg group-hover:bg-violet-400/10 transition-colors">
          {icon}
       </span>
       <span className="text-[11px] font-black uppercase tracking-wider">{label}</span>
    </Link>
  );
}
