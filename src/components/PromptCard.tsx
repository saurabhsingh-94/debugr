"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Copy, Heart, Bookmark, UserPlus, ShieldCheck, Share2, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { toggleLike, toggleBookmark, toggleFollow } from "@/app/actions";

interface PromptCardProps {
  id: string;
  title: string;
  thumbnail: string;
  model: string;
  price: string | number;
  prompt: string;
  creatorId?: string;
  initialLocked?: boolean;
}

export default function PromptCard({ 
  id, 
  title, 
  thumbnail, 
  model, 
  price, 
  prompt, 
  creatorId,
  initialLocked = true 
}: PromptCardProps) {
  const [isLocked, setIsLocked] = useState(initialLocked);
  const [isHovered, setIsHovered] = useState(false);
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [following, setFollowing] = useState(false);

  const handleCopy = () => {
    if (isLocked) return;
    navigator.clipboard.writeText(prompt);
    setShowCopyFeedback(true);
    setTimeout(() => setShowCopyFeedback(false), 2000);
  };

  const handleSocialAction = async (action: 'like' | 'bookmark' | 'follow', e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (action === 'like') {
        const newLiked = !liked;
        setLiked(newLiked);
        await toggleLike(id, 'prompt');
      } else if (action === 'bookmark') {
        const newBookmarked = !bookmarked;
        setBookmarked(newBookmarked);
        await toggleBookmark(id, 'prompt');
      } else if (action === 'follow' && creatorId) {
        const newFollowing = !following;
        setFollowing(newFollowing);
        await toggleFollow(creatorId);
      }
    } catch (err) {
      toast.error("Action failed. Please try again.");
    }
  };

  const handleUnlock = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    const toastId = toast.loading("Connecting to secure payment gateway...");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptId: id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment session failed");

      const cashfree = new (window as any).Cashfree({ mode: "sandbox" }); 
      await cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_self" 
      });

      toast.success("Redirecting...", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Failed to initialize checkout", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative aspect-[4/5] overflow-hidden group border border-white/5 cursor-pointer bg-[#0A0A0A] rounded-[32px] transition-all hover:border-violet-500/20 shadow-2xl"
    >
      {/* THUMBNAIL */}
      <Image 
        src={thumbnail} 
        alt={title} 
        fill 
        className={`object-cover transition-all duration-1000 group-hover:scale-105 ${isHovered ? 'filter blur-[4px] opacity-30' : 'opacity-80'}`}
      />

      {/* INTERACTION OVERLAY */}
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 p-8 flex flex-col justify-between backdrop-blur-md bg-black/40"
          >
            {/* TOP INFO & SOCIALS */}
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest bg-violet-400/10 px-3 py-1.5 rounded-xl border border-violet-400/20">
                   {model}
                </span>
                <p className="text-xl font-black text-white leading-tight pt-2 uppercase tracking-tighter italic">{title}</p>
              </div>
              
              <div className="flex flex-col gap-2">
                 <button onClick={(e) => handleSocialAction('like', e)} className={`p-3 rounded-2xl border transition-all ${liked ? 'bg-rose-500 border-rose-500 text-white' : 'bg-white/5 border-white/10 text-white hover:bg-rose-500/20 hover:border-rose-500/30'}`}>
                    <Heart className={`w-4 h-4 ${liked ? 'fill-white' : ''}`} />
                 </button>
                 <button onClick={(e) => handleSocialAction('bookmark', e)} className={`p-3 rounded-2xl border transition-all ${bookmarked ? 'bg-violet-500 border-violet-500 text-white' : 'bg-white/5 border-white/10 text-white hover:bg-violet-500/20 hover:border-violet-500/30'}`}>
                    <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-white' : ''}`} />
                 </button>
                 {creatorId && (
                   <button onClick={(e) => handleSocialAction('follow', e)} className={`p-3 rounded-2xl border transition-all ${following ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white/5 border-white/10 text-white hover:bg-emerald-500/20 hover:border-emerald-500/30'}`}>
                      <UserPlus className="w-4 h-4" />
                   </button>
                 )}
              </div>
            </div>

            {/* PREVIEW CONTENT */}
            <div className="flex-1 flex items-center justify-center py-6">
               {isLocked ? (
                  <div className="text-center space-y-4">
                      <div className="p-4 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-xl">
                        <Lock className="w-8 h-8 text-violet-400/40 mx-auto mb-4" />
                        <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest italic leading-relaxed">Intelligence Data Encrypted</p>
                      </div>
                  </div>
               ) : (
                  <div className="w-full p-6 bg-white/[0.03] border border-white/5 rounded-3xl">
                     <p className="text-[12px] text-zinc-300 font-medium leading-relaxed tracking-tight italic line-clamp-5">
                        {prompt}
                     </p>
                  </div>
               )}
            </div>

            {/* ACTION BUTTON */}
            <div className="space-y-4">
               {isLocked ? (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleUnlock(); }}
                    className="w-full py-4 bg-white text-black text-[11px] font-black uppercase tracking-[0.3em] active:scale-95 transition-all flex items-center justify-center gap-2 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                  >
                     Unlock Access • {price}
                  </button>
               ) : (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleCopy(); }}
                    className="w-full py-4 bg-emerald-500 text-white text-[11px] font-black uppercase tracking-[0.3em] active:scale-95 transition-all flex items-center justify-center gap-2 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                  >
                     {showCopyFeedback ? "Data Copied" : "Copy Prompt"}
                     <Copy className="w-4 h-4" />
                  </button>
               )}
               <div className="flex items-center justify-center gap-3 opacity-20">
                  <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                  <span className="text-[8px] font-black text-white uppercase tracking-widest">Verified Prompt Integrity</span>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STATIC STATUS */}
      <div className={`absolute bottom-6 left-6 z-0 transition-all duration-500 ${isHovered ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
         {isLocked ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl">
               <Lock className="w-3 h-3 text-violet-400" />
               <span className="text-[10px] font-black text-white tracking-widest uppercase">{price}</span>
            </div>
         ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 backdrop-blur-xl rounded-full border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
               <Unlock className="w-3 h-3 text-emerald-500" />
               <span className="text-[10px] font-black text-emerald-500 tracking-widest uppercase">Decrypted</span>
            </div>
         )}
      </div>
    </motion.div>
  );
}
