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
  LogOut,
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
  Lock,
  Headphones,
  Key,
  ShieldAlert,
  Smartphone,
  CreditCard,
  Target
} from "lucide-react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
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

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("Account");
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
    { label: "Account", icon: User },
    { label: "Appearance", icon: Palette },
    { label: "Security", icon: Key },
    { label: "Privacy", icon: Eye },
    { label: "Payments", icon: CreditCard },
    { label: "Contact Us", icon: Headphones },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--bg-base)" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
          <SettingsIcon className="w-10 h-10 text-violet-500 opacity-40" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-32 px-6 relative overflow-hidden font-grotesk" style={{ backgroundColor: "var(--bg-base)", color: "var(--text-primary)" }}>
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
                <h1 className="text-5xl font-black tracking-tighter text-white uppercase leading-none italic">Settings</h1>
                <p className="text-zinc-500 font-bold mt-3 tracking-widest uppercase text-[10px]">Customize your experience and identity</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl backdrop-blur-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-[11px] font-black text-emerald-500 uppercase tracking-widest">Connection Secure</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Nav Sidebar */}
            <div className="lg:col-span-1 space-y-6">
                <div className="space-y-2">
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

                <div className="pt-8 border-t border-white/5">
                   <button
                     onClick={() => signOut({ callbackUrl: '/' })}
                     className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all font-black uppercase text-[11px] tracking-[0.2em]"
                   >
                     <LogOut className="w-5 h-5" />
                     Logout Platform
                   </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
               <AnimatePresence mode="wait">
                  {activeTab === "Account" && (
                    <motion.div 
                      key="account"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="glass-morphism rounded-[48px] p-8 md:p-12 border border-white/10 shadow-3xl space-y-12"
                    >
                      <div className="space-y-10">
                         <div className="space-y-4">
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Linked Accounts</h3>
                            <p className="text-zinc-500 text-sm">Connect your social identities for easier access.</p>
                         </div>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button 
                              onClick={() => signIn('github')}
                              className="flex items-center justify-between p-6 bg-white/[0.03] border border-white/5 rounded-3xl hover:bg-white/5 transition-all group"
                            >
                               <div className="flex items-center gap-4">
                                  <div className="p-3 bg-black rounded-xl">
                                     <Github className="w-5 h-5 text-white" />
                                  </div>
                                  <div className="text-left">
                                     <p className="text-sm font-bold text-white">GitHub</p>
                                     <p className="text-[10px] text-zinc-600 uppercase tracking-widest">Connect Account</p>
                                  </div>
                               </div>
                               <div className="px-4 py-2 bg-white/5 rounded-full text-[9px] font-black text-zinc-400 uppercase tracking-widest group-hover:bg-white group-hover:text-black transition-all">Link</div>
                            </button>

                             <button 
                               onClick={() => signIn('google')}
                               className="flex items-center justify-between p-6 bg-white/[0.03] border border-white/5 rounded-3xl hover:bg-white/5 transition-all group"
                             >
                                <div className="flex items-center gap-4">
                                   <div className="p-3 bg-white rounded-xl">
                                      <Image src="https://www.google.com/favicon.ico" alt="Google" width={20} height={20} className="w-5 h-5" />
                                   </div>
                                   <div className="text-left">
                                      <p className="text-sm font-bold text-white">Google</p>
                                      <p className="text-[10px] text-zinc-600 uppercase tracking-widest">Connect Account</p>
                                   </div>
                                </div>
                                <div className="px-4 py-2 bg-white/5 rounded-full text-[9px] font-black text-zinc-400 uppercase tracking-widest group-hover:bg-white group-hover:text-black transition-all">Link</div>
                             </button>
                         </div>

                         <div className="nn-divider" />

                         <div className="space-y-6">
                            <h3 className="text-lg font-black text-white uppercase tracking-tight">Danger Zone</h3>
                            <button className="flex items-center gap-4 px-8 py-4 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[11px] font-black uppercase tracking-[0.2em] transition-all">
                               <ShieldAlert className="w-4 h-4" />
                               Deactivate Account
                            </button>
                         </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "Appearance" && (
                    <motion.div 
                      key="appearance"
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
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                              { id: "dark", label: "Dark", desc: "Pure black interface", color: "bg-black" },
                              { id: "glass", label: "Glass", desc: "Frosted translucent look", color: "bg-violet-500/20 backdrop-blur-md" },
                              { id: "light", label: "Light", desc: "Clean white interface", color: "bg-white border border-zinc-200" },
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

                   {activeTab === "Security" && (
                    <motion.div 
                      key="security"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="glass-morphism rounded-[48px] p-12 border border-white/10 space-y-8"
                    >
                      <h3 className="text-xl font-black text-white uppercase tracking-tighter">Security Protocols</h3>
                      <div className="space-y-4">
                         <div className="flex items-center justify-between p-6 bg-white/[0.02] rounded-3xl border border-white/5">
                            <div className="flex items-center gap-4">
                               <Smartphone className="w-5 h-5 text-violet-400" />
                               <div>
                                  <p className="text-sm font-bold text-white">Two-Factor Authentication</p>
                                  <p className="text-xs text-zinc-500">Add an extra layer of security</p>
                               </div>
                            </div>
                            <button className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest transition-all">Enable</button>
                         </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "Privacy" && (
                    <motion.div 
                      key="privacy"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="glass-morphism rounded-[48px] p-12 border border-white/10 space-y-12"
                    >
                       <div className="space-y-4">
                          <h3 className="text-xl font-black text-white uppercase tracking-tighter">Data Privacy</h3>
                          <p className="text-zinc-500 text-sm">Manage how your data is used and visible to others.</p>
                       </div>
                       
                       <div className="space-y-6">
                          <div className="flex items-center justify-between p-8 bg-white/[0.02] border border-white/5 rounded-[32px]">
                             <div className="space-y-1">
                                <p className="text-sm font-black text-white uppercase tracking-tight">Public Profile Visibility</p>
                                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Allow others to see your posts and marketplace items</p>
                             </div>
                             <div className="w-12 h-6 bg-violet-500 rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-lg" />
                             </div>
                          </div>

                          <div className="flex items-center justify-between p-8 bg-white/[0.02] border border-white/5 rounded-[32px]">
                             <div className="space-y-1">
                                <p className="text-sm font-black text-white uppercase tracking-tight">Incognito Mode</p>
                                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Browse signals without history</p>
                             </div>
                             <div className="w-12 h-6 bg-zinc-800 rounded-full relative cursor-pointer">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-zinc-400 rounded-full" />
                             </div>
                          </div>
                       </div>
                    </motion.div>
                  )}


                  {activeTab === "Contact Us" && (
                    <motion.div 
                      key="contact"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="glass-morphism rounded-[48px] p-12 border border-white/10 shadow-3xl space-y-12"
                    >
                       <div className="space-y-8">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center">
                                <Mail className="w-6 h-6" />
                             </div>
                             <div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-none italic">Support Center</h3>
                                <p className="text-zinc-500 text-[10px] mt-1 uppercase tracking-widest font-black">Identity Help Desk</p>
                             </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Founders</p>
                                <div className="space-y-2">
                                   <p className="text-sm font-bold text-white">Saurabh Kumar Singh</p>
                                   <p className="text-sm font-bold text-white">Dennis Pradhan</p>
                                </div>
                             </div>

                             <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Global Inquiries</p>
                                <div className="flex items-center gap-3 group cursor-pointer">
                                   <p className="text-sm font-bold text-zinc-400 group-hover:text-white transition-colors">work.debugr@gmail.com</p>
                                   <ArrowLeft className="w-4 h-4 rotate-180 text-zinc-800 group-hover:text-white transition-all" />
                                </div>
                             </div>
                          </div>

                          <div className="p-10 bg-zinc-900/50 border border-white/5 rounded-[40px] text-center space-y-6">
                             <h4 className="text-sm font-black text-white uppercase tracking-widest">Need real-time help?</h4>
                             <p className="text-xs text-zinc-500 max-w-sm mx-auto font-medium">Our specialized response team is available for identity synchronization and platform issues.</p>
                             <button className="px-10 py-5 bg-white text-black text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-zinc-200 transition-all shadow-xl">Submit Protocol Ticket</button>
                          </div>
                       </div>
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
