"use client";

import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { User, Shield, AtSign, MapPin, Globe, Github, Twitter, Instagram, Save, Loader2, AlertCircle } from "lucide-react";
import { updateUserProfile } from "@/app/actions";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [isPending, startTransition] = useTransition();
  const user = session?.user;

  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: (user as any)?.username || "",
    bio: (user as any)?.bio || "",
    location: (user as any)?.location || "",
    website: (user as any)?.website || "",
    githubProfile: (user as any)?.githubProfile || "",
    xProfile: (user as any)?.xProfile || "",
    instagramProfile: (user as any)?.instagramProfile || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      const result = await updateUserProfile(data);
      if (result.success) {
        toast.success("Identity metadata synchronized.");
        // Refresh session to reflect username changes across the app
        await update({
           ...session,
           user: {
              ...session?.user,
              name: formData.name,
              username: formData.username
           }
        });
      } else {
        toast.error(result.error || "Matrix synchronization failed.");
      }
    });
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <AlertCircle className="w-12 h-12 text-zinc-800" />
        <p className="text-zinc-500 font-medium uppercase tracking-widest text-[10px]">Access Denied: Please Sign In</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 lg:p-12 space-y-12 pb-32">
      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white">Security & Identity</h1>
        <p className="text-zinc-500 font-medium text-sm tracking-tight">Configure your neural presence and digital footprint.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* IDENTITY SECTION */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <User className="w-5 h-5 text-violet-400" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-violet-400">Core Identity</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Display Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 group-focus-within:text-violet-400 transition-colors" />
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-all placeholder:text-zinc-800"
                  placeholder="Your visual handle..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Username (System ID)</label>
              <div className="relative group">
                <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 group-focus-within:text-violet-400 transition-colors" />
                <input 
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/\s+/g, "_")})}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-all placeholder:text-zinc-800"
                  placeholder="unique_identifier..."
                />
              </div>
              <p className="text-[9px] text-zinc-700 uppercase tracking-widest px-1">This is your unique URL on the network.</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Biography</label>
            <textarea 
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              rows={4}
              className="w-full bg-white/[0.02] border border-white/5 rounded-3xl p-6 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-all resize-none placeholder:text-zinc-800"
              placeholder="Broadcast your mission parameters..."
            />
          </div>
        </section>

        {/* METADATA SECTION */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Globe className="w-5 h-5 text-emerald-400" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-400">Digital Footprint</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Location</label>
               <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 group-focus-within:text-emerald-400 transition-colors" />
                <input 
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-800"
                  placeholder="Physical coordinates..."
                />
              </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Website</label>
               <div className="relative group">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 group-focus-within:text-emerald-400 transition-colors" />
                <input 
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-800"
                  placeholder="https://your-nexus.com"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="relative group">
                <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 group-focus-within:text-white transition-colors" />
                <input 
                  type="text"
                  value={formData.githubProfile}
                  onChange={(e) => setFormData({...formData, githubProfile: e.target.value})}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-[12px] text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-zinc-800"
                  placeholder="GitHub Username"
                />
             </div>
             <div className="relative group">
                <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 group-focus-within:text-sky-400 transition-colors" />
                <input 
                  type="text"
                  value={formData.xProfile}
                  onChange={(e) => setFormData({...formData, xProfile: e.target.value})}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-[12px] text-white focus:outline-none focus:border-sky-500/30 transition-all placeholder:text-zinc-800"
                  placeholder="X (Twitter) Profile"
                />
             </div>
             <div className="relative group">
                <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 group-focus-within:text-rose-400 transition-colors" />
                <input 
                  type="text"
                  value={formData.instagramProfile}
                  onChange={(e) => setFormData({...formData, instagramProfile: e.target.value})}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-[12px] text-white focus:outline-none focus:border-rose-500/30 transition-all placeholder:text-zinc-800"
                  placeholder="Instagram Handle"
                />
             </div>
          </div>
        </section>

        {/* ACCOUNT INFO SECTION */}
        <section className="p-8 bg-zinc-900/40 rounded-[32px] border border-white/5 space-y-4">
           <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-zinc-500" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Security Parameters</h3>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                 <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mb-1">User Identifier</p>
                 <p className="text-[12px] font-mono text-zinc-400 truncate">{user.id}</p>
              </div>
              <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                 <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mb-1">Linked Email</p>
                 <p className="text-[12px] font-mono text-zinc-400 truncate">{user.email}</p>
              </div>
           </div>
        </section>

        {/* SAVE BUTTON */}
        <div className="flex justify-end pt-8">
          <button
            type="submit"
            disabled={isPending}
            className="px-10 py-4 bg-violet-600 hover:bg-violet-500 active:scale-95 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all flex items-center gap-3 shadow-[0_0_40px_rgba(124,58,237,0.3)] disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Synchronize Profile
          </button>
        </div>
      </form>
    </div>
  );
}
