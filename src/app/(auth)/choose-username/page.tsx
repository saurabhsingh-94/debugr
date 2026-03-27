"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Fingerprint, 
  ArrowRight, 
  Loader2, 
  ShieldCheck,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { updateUserProfile, syncUser } from "@/app/actions";
import toast from "react-hot-toast";
import Image from "next/image";

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

export default function ChooseUsernamePage() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || username.length < 3) {
      toast.error("INVALID_PROTOCOL: Username too short");
      return;
    }

    setIsLoading(true);
    try {
      const data = new FormData();
      data.append("username", username.toLowerCase());
      
      await updateUserProfile(data);
      toast.success("IDENTITY_ESTABLISHED: Link successful");
      window.location.href = "/dashboard";
    } catch (err: any) {
      toast.error("LINK_FAILURE: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Simple debounced check could be here
  useEffect(() => {
    if (username.length >= 3) {
      setIsAvailable(true); // Placeholder for real check
    } else {
      setIsAvailable(null);
    }
  }, [username]);

  return (
    <div className="min-h-screen w-full bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.02)_0%,_transparent_70%)]" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[480px] relative z-10"
      >
        <div className="bg-[#0A0A0A]/40 backdrop-blur-[60px] border border-white/10 rounded-[56px] p-12 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden">
           {/* Logo Reflection */}
           <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
           
           <div className="space-y-12 relative">
             <div className="text-center space-y-4">
               <div className="w-16 h-16 bg-white/[0.02] border border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                 <Fingerprint className="w-8 h-8 text-white opacity-40" />
               </div>
               <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase italic">DEFINE_IDENTITY</h1>
               <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em] mt-4">Pick a unique system alias to establish presence</p>
             </div>

             <form onSubmit={handleSubmit} className="space-y-8">
               <div className="space-y-4">
                 <div className="relative group">
                   <Fingerprint className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-800 group-focus-within:text-white transition-colors" />
                   <input 
                     type="text"
                     value={username}
                     onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                     placeholder="ALIAS_IDENTIFIER"
                     className="w-full bg-white/[0.01] border border-white/5 rounded-[32px] py-6 pl-16 pr-16 text-sm text-white focus:outline-none focus:border-white/20 transition-all font-black uppercase tracking-widest"
                     required
                     autoFocus
                   />
                   <div className="absolute right-7 top-1/2 -translate-y-1/2">
                      {isAvailable === true && <CheckCircle2 className="w-4 h-4 text-emerald-500 opacity-60" />}
                      {isAvailable === false && <XCircle className="w-4 h-4 text-red-500 opacity-60" />}
                   </div>
                 </div>
                 <p className="text-[9px] font-bold text-zinc-800 uppercase tracking-widest ml-4">
                   Min. 3 characters. A-z, 0-9, and underscores only.
                 </p>
               </div>

               <button 
                 disabled={isLoading || !username || username.length < 3}
                 className="w-full bg-white text-black py-6 rounded-[32px] text-[12px] font-black uppercase tracking-[0.4em] hover:bg-zinc-200 transition-all flex items-center justify-center gap-4 group active:scale-[0.98] shadow-2xl disabled:opacity-30"
               >
                 {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                   <>
                     FINALIZE_LINK
                     <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                   </>
                 )}
               </button>
             </form>

             <div className="p-6 bg-white/[0.01] border border-white/5 rounded-3xl flex items-start gap-4">
               <ShieldCheck className="w-4 h-4 text-zinc-600 mt-1" />
               <p className="text-[9px] font-bold text-zinc-700 uppercase leading-relaxed tracking-wider">
                 Your identity is unique to this network. Once established, it becomes your primary transmission key.
               </p>
             </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
