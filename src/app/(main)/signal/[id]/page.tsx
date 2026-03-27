"use client";

import { motion } from "framer-motion";
import { 
  Zap, 
  ShieldAlert, 
  Activity, 
  MessageSquare, 
  Share2, 
  ChevronLeft,
  User,
  Clock,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import SignalCard from "@/components/SignalCard";

export default function SignalDetail({ params }: { params: { id: string } }) {
  // Mock data for detail page
  const signal = {
    id: params.id,
    title: "GPT-4 Context Window 'Memory Leak' in Long-Form Reasoning",
    description: "Detailed analysis of the degradation in output consistency after 32k tokens. This issue affects recursive reasoning tasks where the model loses track of initial constraints. It appears to be linked to how the context is managed during long sessions.",
    tags: ["AI", "LLM", "ARCHITECTURE"],
    votes: 412,
    painScore: 8.5,
    mergedFrom: 12,
    commentCount: 84,
    author: {
        username: "neural_architect",
        avatarUrl: null
    },
    createdAt: new Date().toISOString()
  };

  return (
    <div className="space-y-10 py-10">
      <Link href="/" className="inline-flex items-center gap-3 text-zinc-700 hover:text-white transition-colors group">
         <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
         <span className="text-[10px] font-black uppercase tracking-[0.4em]">BACK_TO_Nexus</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* DIAGNOSTIC_PANEL_CORE */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8 space-y-8"
        >
          <div className="bento-card group">
            <div className="bento-inner p-12 space-y-10">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <span className="p-3 bg-white/[0.03] border border-white/10 rounded-2xl">
                        <ShieldAlert className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
                     </span>
                     <div>
                        <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.5em]">SIGNAL_TRACE_ID: {signal.id}</p>
                        <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-[0.9] mt-1">{signal.title}</h1>
                     </div>
                  </div>
               </div>

               <div className="flex gap-4">
                 {signal.tags.map(tag => (
                   <span key={tag} className="px-4 py-1.5 bg-white/[0.03] border border-white/5 rounded-full text-[9px] font-bold text-zinc-500 uppercase tracking-widest group-hover:border-white/20 transition-all">
                     {tag}
                   </span>
                 ))}
               </div>

               <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">DIAGNOSTIC_SUMMARY</h3>
                  <p className="text-lg font-black text-zinc-500 italic leading-relaxed tracking-tight group-hover:text-zinc-300 transition-colors">
                    "{signal.description}"
                  </p>
               </div>

               <div className="grid grid-cols-3 gap-6 pt-10 border-t border-white/[0.03]">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-zinc-800 uppercase tracking-widest">Priority_Index</p>
                    <p className="text-3xl font-black text-white italic tracking-tighter italic">{(signal.votes * signal.painScore).toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-zinc-800 uppercase tracking-widest">Pain_Density</p>
                    <p className="text-3xl font-black text-white italic tracking-tighter">{signal.painScore}/10</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-zinc-800 uppercase tracking-widest">Verification_Nodes</p>
                    <p className="text-3xl font-black text-white italic tracking-tighter">{signal.mergedFrom}</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="space-y-6">
             <h2 className="text-[10px] font-black text-zinc-800 uppercase tracking-[0.5em] px-4">Timeline_Decryption</h2>
             <div className="space-y-4">
               {[1, 2, 3].map(i => (
                 <div key={i} className="bento-card p-8 flex items-center justify-between group cursor-pointer hover:bg-white/[0.02] transition-colors">
                   <div className="flex items-center gap-6">
                     <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 group-hover:bg-white group-hover:animate-pulse transition-all" />
                     <p className="text-[11px] font-black text-zinc-600 uppercase tracking-widest">Node analysis update received from <span className="text-white">@agent_0{i}</span></p>
                   </div>
                   <span className="text-[9px] font-black text-zinc-900 uppercase tracking-widest">-{i * 12}M_AGO</span>
                 </div>
               ))}
             </div>
          </div>
        </motion.div>

        {/* SIDE_PANEL_INTEL */}
        <div className="lg:col-span-4 space-y-8">
           <section className="bento-card p-10 space-y-8">
              <div className="space-y-6">
                 <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Agent_Link</h4>
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-900 border border-white/5 rounded-2xl flex items-center justify-center grayscale"><User className="w-5 h-5 text-zinc-700" /></div>
                    <div>
                       <p className="text-xs font-black text-white italic tracking-tighter uppercase">@{signal.author.username}</p>
                       <p className="text-[9px] font-black text-zinc-800 uppercase tracking-widest mt-0.5 whitespace-nowrap">Initial_Submission</p>
                    </div>
                 </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-white/[0.03]">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <Clock className="w-4 h-4 text-zinc-800" />
                       <span className="text-[9px] font-black text-zinc-800 uppercase tracking-widest">Timestamp</span>
                    </div>
                    <span className="text-[10px] font-black text-white tracking-widest">26_MAR_2026</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <ExternalLink className="w-4 h-4 text-zinc-800" />
                       <span className="text-[9px] font-black text-zinc-800 uppercase tracking-widest">Network_URL</span>
                    </div>
                    <span className="text-[10px] font-black text-zinc-500 tracking-widest italic shrink-0">debugr.io/s/842</span>
                 </div>
              </div>
           </section>

           <div className="bento-card p-10 bg-white">
              <div className="flex items-center gap-4 mb-4">
                 <Zap className="w-4 h-4 text-black" />
                 <span className="text-[10px] font-black text-black uppercase tracking-[0.4em]">QUICK_ACTION</span>
              </div>
              <p className="text-[9px] font-bold text-zinc-500 uppercase leading-relaxed tracking-tight mb-8">
                 Authorize neural verification for this signal node to increase network trust coefficients.
              </p>
              <button className="w-full py-4 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all active:scale-[0.98]">Verify_Intelligence</button>
           </div>
        </div>
      </div>
    </div>
  );
}
