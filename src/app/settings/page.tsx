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
  Terminal,
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
  ShieldAlert
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
      duration: 0.6,
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("Accounts");
  const { theme, setTheme } = useTheme();
  
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    bio: "",
    githubProfile: "",
    xProfile: "",
    instagramProfile: "",
    avatarUrl: ""
  });

  const { data: session } = useSession();

  useEffect(() => {
    const fetchUser = async () => {
      if (session?.user) {
        setUser(session.user);
        // Sync & Fetch from Prisma
        const prismaUser = await syncUser();
        if (prismaUser) {
          setFormData({
            name: (prismaUser as any).name || "",
            username: (prismaUser as any).username || "",
            bio: (prismaUser as any).bio || "",
            githubProfile: (prismaUser as any).githubProfile || "",
            xProfile: (prismaUser as any).xProfile || "",
            instagramProfile: (prismaUser as any).instagramProfile || "",
            avatarUrl: (prismaUser as any).image || ""
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
    
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      
      await updateUserProfile(data);
      toast.success("SYSTEM_SYNCHRONIZED: Sequence Successful");
    } catch (err: any) {
      toast.error("UPDATE_FAILURE: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const SETTINGS_TABS = [
    { label: "Accounts", icon: Fingerprint },
    { label: "Theme", icon: Palette },
    { label: "Notifications", icon: Bell },
    { label: "Privacy", icon: Shield },
    { label: "About", icon: Info },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <Loader2 className="w-10 h-10 text-white animate-spin opacity-20" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-32 px-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_rgba(255,255,255,0.02)_0%,_transparent_50%)]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-12"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
            <div className="flex items-center gap-8">
              <Link href="/profile" className="w-14 h-14 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 rounded-[20px] flex items-center justify-center transition-all group">
                <ArrowLeft className="w-6 h-6 text-zinc-600 group-hover:text-white group-hover:-translate-x-1 transition-all" />
              </Link>
              <div>
                <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">SYSTEM_CONFIG</h1>
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em] mt-3">Refine identity and protocol preferences</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-white/[0.03] border border-white/10 rounded-2xl">
              <ShieldAlert className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none">Secure_Core_Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
            {/* Nav Sidebar */}
            <div className="lg:col-span-1 space-y-2">
               {SETTINGS_TABS.map((tab) => (
                 <button
                   key={tab.label}
                   onClick={() => setActiveTab(tab.label)}
                   className={cn(
                     "w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all group",
                     activeTab === tab.label 
                      ? "bg-white/10 text-white border border-white/10 shadow-xl" 
                      : "text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.02] border border-transparent"
                   )}
                 >
                   <div className="flex items-center gap-4">
                     <tab.icon className={cn("w-4 h-4 transition-colors", activeTab === tab.label ? "text-white" : "text-zinc-700 group-hover:text-zinc-500")} />
                     <span className="text-[11px] font-black uppercase tracking-widest">{tab.label}</span>
                   </div>
                   <ChevronRight className={cn("w-3.5 h-3.5 transition-transform", activeTab === tab.label ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-40")} />
                 </button>
               ))}
            </div>

            {/* Main Form Area */}
            <div className="lg:col-span-3">
               <AnimatePresence mode="wait">

                  {activeTab === "Theme" && (
                    <motion.div 
                      key="theme-settings"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-12"
                    >
                      <div className="space-y-8">
                        <h3 className="text-[12px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-white italic" /> Neural_Aesthetics
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           {[
                             { id: "dark", label: "Midnight_Core", desc: "Pure Black Interface", color: "bg-black" },
                             { id: "light", label: "Vivid_Link", desc: "Clear Light Protocol", color: "bg-white" },
                             { id: "glass", label: "Glassmorphism", desc: "Cinematic Translucency", color: "bg-white/10 backdrop-blur-md" }
                           ].map((t) => (
                             <button
                               key={t.id}
                               onClick={() => setTheme(t.id as any)}
                               className={cn(
                                 "relative p-8 rounded-[40px] border-2 transition-all group text-left",
                                 theme === t.id 
                                   ? "border-accent-cyan bg-accent-cyan/[0.05]" 
                                   : "border-white/5 bg-white/[0.01] hover:border-white/20"
                               )}
                             >
                               <div className={cn("w-12 h-12 rounded-2xl mb-6 shadow-2xl", t.color)} />
                               <h4 className="text-[11px] font-black uppercase tracking-widest text-white mb-2">{t.label}</h4>
                               <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{t.desc}</p>
                               
                               {theme === t.id && (
                                 <div className="absolute top-4 right-4">
                                   <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse shadow-[0_0_10px_#22d3ee]" />
                                 </div>
                               )}
                             </button>
                           ))}
                        </div>
                      </div>

                      <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] flex items-start gap-6">
                         <Palette className="w-6 h-6 text-zinc-600 mt-1" />
                         <div className="space-y-2">
                           <p className="text-[11px] font-black text-white uppercase tracking-widest leading-relaxed">System-Wide Synchronization</p>
                           <p className="text-[9px] font-bold text-zinc-700 uppercase leading-relaxed tracking-wider">
                             Switching themes updates the entire neural interface, including transparency, blurs, and contrast levels across all dashboard modules.
                           </p>
                         </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab !== "Profile" && activeTab !== "Theme" && (
                   <motion.div
                     key="other-tabs"
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="py-20 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[40px] bg-white/[0.01]"
                   >
                     <Terminal className="w-12 h-12 text-zinc-800 mb-6" />
                     <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em]">Section_Under_Development</p>
                     <p className="text-zinc-800 text-xs mt-4">ENCRYPTED_PREFERENCES_LOCKED</p>
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
