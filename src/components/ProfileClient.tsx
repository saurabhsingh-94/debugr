"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Settings, MapPin, Calendar, Link as LinkIcon,
  MessageSquare, Repeat2, Heart, Share, ArrowLeft,
  MoreHorizontal, BadgeCheck, Bookmark, X, Camera, Save, Loader2, Github, Twitter, Instagram, Image as ImageIcon,
  Check, Trash2, Upload
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useTransition, useRef } from "react";
import { useSession } from "next-auth/react";
import { updateUserProfile } from "@/app/actions";
import toast from "react-hot-toast";
import PromptCard from "./PromptCard";
import { cn } from "@/lib/utils";

interface ProfileClientProps {
  user: any;
  stats: any;
  problems?: any[];
  prompts?: any[];
  isPublic?: boolean;
}

const TABS = ["Posts", "Marketplace"];

export default function ProfileClient({ user: initialUser, stats, problems = [], prompts = [], isPublic = false }: ProfileClientProps) {
  const [user, setUser] = useState(initialUser);
  const [activeTab, setActiveTab] = useState("Posts");
  const [following, setFollowing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Sync state if initialUser changes (e.g. after async fetch in parent)
  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
    }
  }, [initialUser]);

  const formattedJoinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "March 2024";

  return (
    <div className="max-w-[1000px] mx-auto w-full min-h-screen font-grotesk">

      {/* TOP BAR */}
      <div className="sticky top-0 z-40 flex items-center gap-4 px-4 py-3 bg-[#05050a]/80 backdrop-blur-xl border-b border-white/5">
        <Link href="/" className="p-2 rounded-full hover:bg-white/5 transition-colors text-zinc-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <p className="text-[15px] font-bold text-white leading-tight">{user?.name || "Profile"}</p>
          <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest">{problems.length} post{problems.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* BANNER */}
      <div className="relative h-48 w-full bg-[#111118] overflow-hidden">
        {user?.bannerUrl ? (
          <Image src={user.bannerUrl} alt="banner" fill className="object-cover" />
        ) : (
          <div className="w-full h-full" style={{
            backgroundImage: "linear-gradient(135deg, #1a0a2e 0%, #0c0c18 50%, #0a1628 100%)"
          }} />
        )}
      </div>

      {/* PROFILE INFO BLOCK */}
      <div className="px-4 pb-0">
        {/* Avatar + Action row */}
        <div className="flex items-end justify-between -mt-[52px] mb-3">
          <div className="relative">
            <div className="w-[110px] h-[110px] rounded-[32px] border-4 border-[#050505] overflow-hidden bg-zinc-900 shadow-2xl relative">
              {user?.avatarUrl ? (
                <Image src={user.avatarUrl} alt={user.name || "user"} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                  <User className="w-10 h-10 text-zinc-600" />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 pb-1">
             <Link href="/settings" className="p-3 bg-white/[0.03] border border-white/10 rounded-2xl text-zinc-500 hover:text-white transition-all">
                <Settings className="w-4 h-4" />
             </Link>
            {!isPublic ? (
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-6 py-2 rounded-2xl bg-white/[0.03] border border-white/10 text-[11px] font-black uppercase tracking-widest text-white hover:bg-white/10 hover:border-white/20 transition-all active:scale-[0.98] shadow-xl"
                >
                  Edit profile
                </button>
            ) : (
              <button
                onClick={() => setFollowing(!following)}
                className={cn(
                  "px-6 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all",
                  following ? "border border-white/10 text-white" : "bg-white text-black"
                )}
              >
                {following ? "Following" : "Follow"}
              </button>
            )}
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">{user?.name || "Anonymous"}</h1>
            {user?.verified && <BadgeCheck className="w-5 h-5 text-violet-400" />}
          </div>
          <p className="text-[13px] text-zinc-500 font-bold uppercase tracking-widest">
            @{user?.username || (user?.email ? user.email.split("@")[0] : "agent")}
          </p>
        </div>

        <p className="text-[15px] text-zinc-300 font-medium leading-relaxed mb-6">
          {user?.bio || "No profile identity established yet."}
        </p>

        <div className="flex flex-wrap gap-x-6 gap-y-3 text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-8 pb-4 border-b border-white/5">
          {user?.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-zinc-800" /> {user.location}
            </div>
          )}
          {user?.gender && (
            <div className="flex items-center gap-2">
              <span className="text-zinc-800">·</span>
              <span className="text-violet-500/80">{user.gender}</span>
            </div>
          )}
          {user?.website && (
            <div className="flex items-center gap-2">
              <LinkIcon className="w-3.5 h-3.5 text-zinc-800" />
              <a href={user.website} target="_blank" className="text-cyan-400 hover:text-white transition-colors">{user.website.replace(/^https?:\/\//, '')}</a>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-zinc-800" /> Member since {formattedJoinDate}
          </div>
          {user?.isProfessional && (
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400">
               <BadgeCheck className="w-3 h-3" /> Professional Creator
            </div>
          )}
        </div>

        {/* SOCIAL LINKS & STATS */}
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-4">
              {user?.xProfile && (
                <a href={`https://x.com/${user.xProfile}`} target="_blank" className="p-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-zinc-500 hover:text-white hover:border-white/20 transition-all">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {user?.instagramProfile && (
                <a href={`https://instagram.com/${user.instagramProfile}`} target="_blank" className="p-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-zinc-500 hover:text-white hover:border-white/20 transition-all">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {user?.githubProfile && (
                <a href={`https://github.com/${user.githubProfile}`} target="_blank" className="p-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-zinc-500 hover:text-white hover:border-white/20 transition-all">
                  <Github className="w-4 h-4" />
                </a>
              )}
           </div>

           <div className="flex items-center gap-6">
              <Link href={`/u/${user?.username}/followers`} className="group">
                 <p className="text-[13px] font-black text-white group-hover:text-violet-400 transition-colors">{stats?.followersCount || 0} <span className="text-zinc-600 font-bold uppercase tracking-widest text-[10px] ml-1">Followers</span></p>
              </Link>
              <Link href={`/u/${user?.username}/following`} className="group">
                 <p className="text-[13px] font-black text-white group-hover:text-violet-400 transition-colors">{stats?.followingCount || 0} <span className="text-zinc-600 font-bold uppercase tracking-widest text-[10px] ml-1">Following</span></p>
              </Link>
           </div>
        </div>

        {user?.expertise && (
          <div className="mb-8 p-4 bg-white/[0.02] border border-white/5 rounded-3xl">
             <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest mb-2 px-2">Neural_Expertise</p>
             <div className="flex flex-wrap gap-2">
                {user.expertise.split(',').map((exp: string) => (
                  <span key={exp} className="px-3 py-1 bg-violet-500/5 border border-violet-500/10 rounded-full text-[10px] font-bold text-violet-400/80 uppercase tracking-wider">{exp.trim()}</span>
                ))}
             </div>
          </div>
        )}

        {!isPublic && !user?.isProfessional && (
           <Link href="/dashboard/creator">
              <button className="w-full py-4 mb-8 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/30 rounded-3xl text-[11px] font-black text-violet-400 uppercase tracking-[0.3em] hover:from-violet-600/30 hover:to-indigo-600/30 transition-all animate-pulse">
                 Join Professional Creator Program
              </button>
           </Link>
        )}
      </div>

      <AnimatePresence>
        {isEditModalOpen && (
          <EditProfileModal
            user={user}
            onClose={() => setIsEditModalOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* TABS */}
      <div className="sticky top-[57px] z-30 flex border-b border-white/5 bg-[#05050a]/80 backdrop-blur-xl">
        {TABS.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-5 text-xs font-black uppercase tracking-[0.2em] transition-all relative",
                isActive ? "text-white" : "text-zinc-600 hover:text-zinc-400"
              )}
            >
              {tab}
              {isActive && (
                <motion.div
                  layoutId="profile-tab"
                  className="absolute bottom-0 left-10 right-10 h-[3px] bg-violet-500 rounded-full shadow-[0_0_15px_rgba(124,58,237,0.6)]"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="pb-24">
        {activeTab === "Posts" ? (
          problems.length > 0 ? (
            <div className="divide-y divide-white/[0.04]">
              {problems.map((post: any) => (
                <ProfilePost key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <EmptyState tab="Posts" message={`Identity @${user?.username || "user"} has no history in the network.`} />
          )
        ) : activeTab === "Marketplace" ? (
          prompts.length > 0 ? (
            <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
              {prompts.map((p: any) => (
                <PromptCard 
                  key={p.id} 
                  id={p.id}
                  title={p.title}
                  thumbnailUrl={p.thumbnailUrl}
                  aiModel={p.aiModel || "GPT-4"}
                  price={Number(p.price)}
                  currency={p.currency || "INR"}
                  content={p.previewContent || p.description}
                  creatorId={p.authorId}
                  author={p.author?.name}
                  authorUsername={p.author?.username}
                />
              ))}
            </div>
          ) : (
            <EmptyState tab="Marketplace" message={`No intelligence assets listed by @${user?.username || "user"}.`} />
          )
        ) : (
          <EmptyState tab={activeTab} message={`Sector ${activeTab} is currently dark.`} />
        )}
      </div>
    </div>
  );
}

function EditProfileModal({ user, onClose }: { user: any; onClose: () => void }) {
  const { data: session, update: updateSession } = useSession();
  const [isPending, startTransition] = useTransition();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatarUrl);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [showPfpMenu, setShowPfpMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: user.name || "",
    username: user.username || "",
    bio: user.bio || "",
    location: user.location || "",
    website: user.website || "",
    gender: user.gender || "Not Specified",
    isPrivate: user.isPrivate || false,
    expertise: user.expertise || "",
    githubProfile: user.githubProfile || "",
    xProfile: user.xProfile || "",
    instagramProfile: user.instagramProfile || "",
  });

  const handlePfpRemove = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
    setShowPfpMenu(false);
  };

  const handlePfpClick = () => {
    setShowPfpMenu(!showPfpMenu);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setShowPfpMenu(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => data.append(key, String(value)));
        
        // Image logic
        if (avatarFile) {
          // In a real app, upload avatarFile here and get URL
          // For now we'll simulate by passing the file object to the action
          data.append("avatarUrl", "MOCK_NEW_URL"); 
        } else if (avatarPreview === null) {
          data.append("avatarUrl", "REMOVE");
        }
        
        const res = await updateUserProfile(data);
        if (res.error) throw new Error(res.error);
        
        // Update Session to reflect new username/identity immediately
        await updateSession({
          ...session,
          user: {
            ...session?.user,
            ...Object.fromEntries(data.entries()),
          }
        });

        toast.success("Identity Updated");
        onClose();
        // Optional: window.location.reload(); if you want a full refresh, but updateSession handles most things.
      } catch (err: any) {
        toast.error("Internal Error: " + err.message);
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05050a]/95 backdrop-blur-3xl"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="w-full max-w-[600px] bg-[#0c0c12] border border-white/10 rounded-[56px] overflow-hidden shadow-3xl"
      >
        <div className="flex items-center justify-between px-10 py-8 border-b border-white/5 bg-white/[0.01]">
           <div className="space-y-1">
              <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Modify <span className="text-zinc-700">Identity</span></h2>
              <p className="text-[9px] font-black text-violet-500 uppercase tracking-[0.4em]">Sub-Profile Configuration</p>
           </div>
           <button onClick={onClose} className="p-4 rounded-3xl bg-white/[0.03] border border-white/10 text-zinc-600 hover:text-white transition-all">
              <X className="w-5 h-5" />
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-10 max-h-[75vh] overflow-y-auto scrollbar-none">
           {/* AVATAR CENTER */}
           <div className="flex flex-col items-center gap-6 pb-10 border-b border-white/5">
              <div className="relative group">
                 <button 
                  type="button"
                  onClick={handlePfpClick}
                  className="w-32 h-32 rounded-[48px] overflow-hidden bg-zinc-900 border-4 border-white/5 relative group cursor-pointer"
                 >
                    {avatarPreview ? (
                      <img src={avatarPreview} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                         <User className="w-12 h-12 text-zinc-600" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                       <Camera className="w-8 h-8 text-white" />
                    </div>
                 </button>

                 <AnimatePresence>
                    {showPfpMenu && (
                       <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-48 bg-[#0c0c12] border border-white/10 rounded-3xl p-3 shadow-2xl z-50 backdrop-blur-2xl"
                       >
                          <button 
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 text-zinc-400 hover:text-white text-[11px] font-bold uppercase tracking-widest transition-all"
                          >
                             <Upload className="w-4 h-4 text-violet-500" />
                             Upload Photo
                          </button>
                          <button 
                            type="button"
                            onClick={handlePfpRemove}
                            className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-rose-500/10 text-rose-500/60 hover:text-rose-500 text-[11px] font-bold uppercase tracking-widest transition-all"
                          >
                             <Trash2 className="w-4 h-4" />
                             Remove Photo
                          </button>
                       </motion.div>
                    )}
                 </AnimatePresence>
                 <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
              <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Click avatar to manage photo</p>
           </div>

           <div className="grid grid-cols-2 gap-8">
              <InputGroup label="Display Name" value={formData.name} onChange={v => setFormData({ ...formData, name: v })} />
              <InputGroup label="Network Handle" value={formData.username} onChange={v => setFormData({ ...formData, username: v })} />
           </div>

           <div className="space-y-3">
              <label className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em] px-2 italic">Profile Status</label>
              <div className="grid grid-cols-2 gap-4">
                 <button 
                  type="button"
                  onClick={() => setFormData({ ...formData, isPrivate: false })}
                  className={cn(
                    "p-6 rounded-3xl border transition-all text-left",
                    !formData.isPrivate ? "bg-white/10 border-white/20 text-white" : "bg-white/[0.02] border-white/5 text-zinc-700"
                  )}
                 >
                    <p className="text-[11px] font-black uppercase tracking-widest">Public</p>
                    <p className="text-[8px] font-bold uppercase tracking-[0.2em] mt-1 opacity-60">Visible to network</p>
                 </button>
                 <button 
                  type="button"
                  onClick={() => setFormData({ ...formData, isPrivate: true })}
                  className={cn(
                    "p-6 rounded-3xl border transition-all text-left",
                    formData.isPrivate ? "bg-violet-500/10 border-violet-500/20 text-violet-400" : "bg-white/[0.02] border-white/5 text-zinc-700"
                  )}
                 >
                    <p className="text-[11px] font-black uppercase tracking-widest">Private</p>
                    <p className="text-[8px] font-bold uppercase tracking-[0.2em] mt-1 opacity-60">Limited visibility</p>
                 </button>
              </div>
           </div>

           <div className="space-y-3">
              <label className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em] px-2 italic">Gender Identity</label>
              <div className="flex flex-wrap gap-3">
                 {["Male", "Female", "Non-Binary", "Other", "Hidden"].map(g => (
                    <button 
                      key={g}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: g })}
                      className={cn(
                        "px-6 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all",
                        formData.gender === g ? "bg-white text-black border-white" : "bg-white/[0.02] border-white/5 text-zinc-700 hover:text-zinc-400"
                      )}
                    >
                       {g}
                    </button>
                 ))}
              </div>
           </div>

           <div className="space-y-3">
              <label className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em] px-2 italic">Professional Bio</label>
              <textarea
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                placeholder="Secure identity description..."
                className="w-full bg-white/[0.02] border border-white/5 rounded-3xl py-5 px-8 text-[12px] font-bold text-white focus:outline-none focus:border-violet-500/30 transition-all resize-none italic"
              />
           </div>

            <div className="grid grid-cols-2 gap-8">
               <InputGroup label="Sector / Location" value={formData.location} onChange={v => setFormData({ ...formData, location: v })} />
               <InputGroup label="Network Terminal / Link" value={formData.website} onChange={v => setFormData({ ...formData, website: v })} />
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em] px-2 italic">Neural Expertise (Comma Separated)</label>
              <input
                value={formData.expertise}
                onChange={e => setFormData({ ...formData, expertise: e.target.value })}
                placeholder="Next.js, AI, prompt-engineering..."
                className="w-full bg-white/[0.02] border border-white/5 rounded-[24px] py-4 px-6 text-[12px] font-bold text-white focus:outline-none focus:border-violet-500/30 transition-all placeholder:text-zinc-800"
              />
            </div>

            <div className="nn-divider opacity-10" />

            <div className="grid grid-cols-3 gap-6">
               <InputGroup label="X Account" value={formData.xProfile} onChange={v => setFormData({ ...formData, xProfile: v })} />
               <InputGroup label="Instagram" value={formData.instagramProfile} onChange={v => setFormData({ ...formData, instagramProfile: v })} />
               <InputGroup label="GitHub" value={formData.githubProfile} onChange={v => setFormData({ ...formData, githubProfile: v })} />
            </div>

            <button
               type="submit"
               disabled={isPending}
               className="w-full py-6 bg-white text-black text-[12px] font-black uppercase tracking-[0.5em] rounded-[32px] hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-3xl flex items-center justify-center gap-4 group border-b-4 border-zinc-300"
            >
               {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (<><Check className="w-5 h-5 group-hover:scale-110 transition-transform" /> Commit Changes</>)}
            </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

function InputGroup({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-3">
       <label className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em] px-2 italic">{label}</label>
       <input
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-white/[0.02] border border-white/5 rounded-[24px] py-4 px-6 text-[12px] font-bold text-white focus:outline-none focus:border-violet-500/30 transition-all placeholder:text-zinc-800"
       />
    </div>
  );
}

function ProfilePost({ post }: { post: any }) {
  const [liked, setLiked] = useState(false);
  return (
    <article className="px-6 py-6 hover:bg-white/[0.01] transition-colors cursor-pointer group">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-[#111118] flex-shrink-0 border border-white/5 flex items-center justify-center">
            {post.user?.avatarUrl ? <Image src={post.user.avatarUrl} alt="avatar" width={48} height={48} className="object-cover" /> : <User className="w-6 h-6 text-zinc-700" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[15px] font-black text-white italic uppercase tracking-tighter">{post.user?.name || "Anonymous User"}</span>
            <span className="text-[12px] text-zinc-600 font-bold uppercase tracking-widest truncate">@{post.user?.username}</span>
            <span className="text-zinc-800">·</span>
            <span className="text-[12px] text-zinc-700 font-bold uppercase tracking-widest">2h</span>
          </div>
          <p className="text-[16px] text-zinc-400 font-medium leading-relaxed mb-4">{post.content}</p>
          <div className="flex items-center gap-8 text-zinc-700">
            <ActionBtn icon={<MessageSquare className="w-4 h-4" />} label={0} color="hover:text-violet-400" />
            <ActionBtn icon={<Repeat2 className="w-4 h-4" />} label={0} color="hover:text-emerald-400" />
            <button className="flex items-center gap-2 hover:text-rose-500 transition-colors" onClick={() => setLiked(!liked)}>
              <Heart className={cn("w-4 h-4 transition-all", liked && "fill-rose-500 text-rose-500 scale-110")} />
              <span className="text-[11px] font-black uppercase tracking-widest">{post._count?.likes || 0}</span>
            </button>
            <ActionBtn icon={<Share className="w-4 h-4" />} label={0} color="hover:text-cyan-400" />
          </div>
        </div>
      </div>
    </article>
  );
}

function ActionBtn({ icon, label, color }: { icon: React.ReactNode; label: number; color: string }) {
  return (
    <button className={cn("flex items-center gap-2 transition-all", color)}>
      {icon}
      <span className="text-[11px] font-black uppercase tracking-widest">{label > 0 ? label : ""}</span>
    </button>
  );
}

function EmptyState({ tab, message }: { tab: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-8 text-center animate-pulse">
      <div className="w-20 h-20 bg-white/[0.02] border border-white/5 rounded-[32px] flex items-center justify-center mb-8">
         <X className="w-10 h-10 text-zinc-800" />
      </div>
      <p className="text-2xl font-black text-white italic uppercase tracking-tighter mb-3">No Output Found</p>
      <p className="text-zinc-600 text-[11px] font-bold uppercase tracking-[0.3em] leading-relaxed max-w-xs">{message}</p>
    </div>
  );
}
