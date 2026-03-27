"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  Shield, 
  Camera, 
  Save, 
  ArrowLeft,
  Loader2,
  Settings as SettingsIcon,
  Fingerprint,
  Github,
  Twitter,
  Instagram,
  Bell,
  Eye,
  Palette,
  Info,
  ChevronRight,
  ShieldCheck,
  Globe,
  MapPin,
  Lock
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { updateUserProfile, syncUser } from "@/app/actions";
import toast from "react-hot-toast";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeContext";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5 }
  }
};

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("Profile");
  const { theme, setTheme } = useTheme();
  
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    bio: "",
    website: "",
    location: "",
    githubProfile: "",
    xProfile: "",
    instagramProfile: "",
  });

  const { data: session } = useSession();

  useEffect(() => {
    const fetchUser = async () => {
      if (session?.user) {
        setUser(session.user);
        const prismaUser = await syncUser();
        if (prismaUser) {
          setFormData({
            name: (prismaUser as any).name || "",
            username: (prismaUser as any).username || "",
            bio: (prismaUser as any).bio || "",
            website: (prismaUser as any).website || "",
            location: (prismaUser as any).location || "",
            githubProfile: (prismaUser as any).githubProfile || "",
            xProfile: (prismaUser as any).xProfile || "",
            instagramProfile: (prismaUser as any).instagramProfile || "",
          });
        }
      }
      setIsLoading(false);
    };
    fetchUser();
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const toastId = toast.loading("Saving changes...");
    
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      
      await updateUserProfile(data);
      toast.success("Settings updated successfully", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Failed to update settings", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const SETTINGS_TABS = [
    { label: "Profile", icon: User },
    { label: "Appearance", icon: Palette },
    { label: "Notifications", icon: Bell },
    { label: "Security", icon: Shield },
    { label: "Accounts", icon: Fingerprint },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
          <SettingsIcon className="w-10 h-10 text-violet-500 opacity-40" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080A] pt-32 pb-32 px-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-12"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12">
            <div className="flex items-center gap-8">
              <Link href="/profile" className="w-16 h-16 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded-2xl flex items-center justify-center transition-all group shadow-2xl backdrop-blur-xl">
                <ArrowLeft className="w-6 h-6 text-zinc-400 group-hover:text-white group-hover:-translate-x-1 transition-all" />
              </Link>
              <div>
                <h1 className="text-5xl font-black tracking-tighter text-white uppercase leading-none">Settings</h1>
                <p className="text-zinc-500 font-medium mt-3 tracking-wide">Customize your experience and identity</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl backdrop-blur-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-[11px] font-black text-emerald-500 uppercase tracking-widest">Connection Secure</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Nav Sidebar */}
            <div className="lg:col-span-1 space-y-3">
               {SETTINGS_TABS.map((tab) => (
                 <button
                   key={tab.label}
                   onClick={() => setActiveTab(tab.label)}
                   className={cn(
                     "w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all group",
                     activeTab === tab.label 
                      ? "bg-white/10 text-white border border-white/10 shadow-2xl backdrop-blur-2xl" 
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03] border border-transparent"
                   )}
                 >
                   <div className="flex items-center gap-4">
                     <tab.icon className={cn("w-5 h-5 transition-colors", activeTab === tab.label ? "text-violet-400" : "text-zinc-600 group-hover:text-zinc-400")} />
                     <span className="text-[13px] font-bold tracking-tight">{tab.label}</span>
                   </div>
                   <ChevronRight className={cn("w-4 h-4 transition-transform", activeTab === tab.label ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-40")} />
                 </button>
               ))}
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
               <AnimatePresence mode="wait">
                  {activeTab === "Profile" && (
                    <motion.div 
                      key="profile-settings"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="glass-morphism rounded-[48px] p-8 md:p-12 border border-white/10 shadow-3xl space-y-12"
                    >
                      <form onSubmit={handleSubmit} className="space-y-10">
                        {/* Profile Identity */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="space-y-4">
                            <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest ml-1">Full Name</label>
                            <div className="relative group">
                              <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-violet-400 transition-colors" />
                              <input 
                                type="text" 
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white text-sm focus:bg-white/[0.05] focus:border-violet-500/30 focus:ring-1 focus:ring-violet-500/20 outline-none transition-all"
                                placeholder="Your full name"
                              />
                            </div>
                          </div>
                          <div className="space-y-4">
                            <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest ml-1">Username</label>
                            <div className="relative group">
                              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 font-bold text-sm group-focus-within:text-violet-400">@</span>
                              <input 
                                type="text" 
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-10 pr-6 text-white text-sm focus:bg-white/[0.05] focus:border-violet-500/30 focus:ring-1 focus:ring-violet-500/20 outline-none transition-all"
                                placeholder="username"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Bio */}
                        <div className="space-y-4">
                          <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest ml-1">About You</label>
                          <textarea 
                            value={formData.bio}
                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                            className="w-full bg-white/[0.02] border border-white/5 rounded-3xl py-6 px-6 text-white text-sm focus:bg-white/[0.05] focus:border-violet-500/30 focus:ring-1 focus:ring-violet-500/20 outline-none transition-all min-h-[140px] resize-none"
                            placeholder="Tell the community about yourself..."
                          />
                        </div>

                        {/* Social Links */}
                        <div className="space-y-8 pt-6">
                           <h3 className="text-sm font-bold text-white flex items-center gap-3">
                              <Globe className="w-4 h-4 text-violet-400" />
                              Online Presence
                           </h3>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {[
                                { id: "website", icon: Globe, label: "Website", placeholder: "https://example.com" },
                                { id: "location", icon: MapPin, label: "Location", placeholder: "San Francisco, CA" },
                                { id: "githubProfile", icon: Github, label: "GitHub", placeholder: "github.com/user" },
                                { id: "xProfile", icon: Twitter, label: "X / Twitter", placeholder: "x.com/user" },
                              ].map((f) => (
                                <div key={f.id} className="space-y-3">
                                  <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">{f.label}</label>
                                  <div className="relative group">
                                    <f.icon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 group-focus-within:text-violet-400 transition-colors" />
                                    <input 
                                      type="text" 
                                      value={(formData as any)[f.id]}
                                      onChange={(e) => setFormData({...formData, [f.id]: e.target.value})}
                                      className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-3.5 pl-14 pr-6 text-white text-xs focus:bg-white/[0.05] focus:border-violet-500/30 outline-none transition-all"
                                      placeholder={f.placeholder}
                                    />
                                  </div>
                                </div>
                              ))}
                           </div>
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end pt-8">
                           <button 
                             type="submit"
                             disabled={isSaving}
                             className="px-10 py-5 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-3xl active:scale-95 disabled:opacity-50 flex items-center gap-3"
                           >
                              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                              Synchronize Changes
                           </button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {activeTab === "Appearance" && (
                    <motion.div 
                      key="appearance-settings"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-12"
                    >
                      <div className="glass-morphism rounded-[48px] p-12 border border-white/10">
                        <div className="space-y-8">
                          <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                            <Palette className="w-6 h-6 text-violet-400" /> Interface Theme
                          </h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                              { id: "dark", label: "Midnight", desc: "Pure Black Interface", color: "bg-black" },
                              { id: "glass", label: "Glassmorphism", desc: "Cinematic Translucency", color: "bg-violet-500/20 backdrop-blur-md" }
                            ].map((t) => (
                              <button
                                key={t.id}
                                onClick={() => setTheme(t.id as any)}
                                className={cn(
                                  "relative p-8 rounded-[40px] border-2 transition-all group text-left",
                                  theme === t.id 
                                    ? "border-violet-500 bg-violet-500/5 shadow-[0_0_40px_rgba(139,92,246,0.1)]" 
                                    : "border-white/5 bg-white/[0.02] hover:border-white/20"
                                )}
                              >
                                <div className={cn("w-14 h-14 rounded-2xl mb-6 shadow-2xl border border-white/10", t.color)} />
                                <h4 className="text-[14px] font-black text-white mb-2">{t.label}</h4>
                                <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-widest">{t.desc}</p>
                                
                                {theme === t.id && (
                                  <div className="absolute top-6 right-6">
                                    <div className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse shadow-[0_0_15px_rgba(139,92,246,1)]" />
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-10 bg-violet-500/5 border border-violet-500/10 rounded-[40px] flex items-start gap-8 backdrop-blur-xl">
                         <div className="p-4 bg-violet-500/10 rounded-2xl">
                            <Info className="w-6 h-6 text-violet-400" />
                         </div>
                         <div className="space-y-3">
                           <p className="text-sm font-black text-white uppercase tracking-widest">Global Synchronization</p>
                           <p className="text-xs font-medium text-zinc-500 leading-relaxed max-w-lg">
                             Changing your theme affects your entire dashboard, including shared components, feeds, and the marketplace interface for a cohesive visual experience.
                           </p>
                         </div>
                      </div>
                    </motion.div>
                  )}

                  {(activeTab !== "Profile" && activeTab !== "Appearance") && (
                    <motion.div
                      key="under-dev"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="glass-morphism rounded-[48px] p-24 text-center border border-white/10 border-dashed"
                    >
                      <div className="w-20 h-20 bg-white/[0.02] rounded-[32px] flex items-center justify-center mx-auto mb-8">
                         <Lock className="w-8 h-8 text-zinc-700" />
                      </div>
                      <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4">Registry Locked</h3>
                      <p className="text-sm font-medium text-zinc-600 max-w-xs mx-auto mb-10">This section is currently being encrypted. You will be notified once the protocol is online.</p>
                      <button 
                        onClick={() => setActiveTab("Profile")}
                        className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] transition-all"
                      >
                         Return to Profile
                      </button>
                    </motion.div>
                  )}
               </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
