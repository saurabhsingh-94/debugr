"use client";

import { motion } from "framer-motion";
import { 
  User, Settings, MapPin, Calendar, Link as LinkIcon,
  MessageSquare, Repeat2, Heart, Share, ArrowLeft,
  MoreHorizontal, BadgeCheck, Bookmark, 
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useTransition } from "react";
import { X, Camera, Save, Loader2, Github, Twitter, Instagram } from "lucide-react";
import { updateUserProfile } from "@/app/actions";
import toast from "react-hot-toast";
import { AnimatePresence } from "framer-motion";

interface ProfileClientProps {
  user: any;
  stats?: any[];
  problems?: any[];
  isPublic?: boolean;
}

const TABS = ["Posts", "Replies", "Highlights", "Media", "Likes"];

export default function ProfileClient({ user, stats, problems = [], isPublic = false }: ProfileClientProps) {
  const [activeTab, setActiveTab] = useState("Posts");
  const [following, setFollowing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const getInitial = () => {
    return (user?.name?.[0] || user?.username?.[0] || "U").toUpperCase();
  };

  const formattedJoinDate = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "March 2024";

  return (
    <div className="max-w-[640px] mx-auto w-full min-h-screen">

      {/* TOP BAR */}
      <div className="sticky top-0 z-40 flex items-center gap-4 px-4 py-3 bg-[#05050a]/80 backdrop-blur-xl border-b border-white/5">
        <Link href="/" className="p-2 rounded-full hover:bg-white/5 transition-colors text-zinc-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <p className="text-[15px] font-bold text-white leading-tight">{user?.name || "Profile"}</p>
          <p className="text-xs text-zinc-600">{problems.length} posts</p>
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
          {/* Avatar */}
          <div className="relative">
            <div className="w-[110px] h-[110px] rounded-[32px] border-4 border-[#050505] overflow-hidden bg-[#111118] shadow-2xl relative">
              {user?.avatarUrl ? (
                <Image src={user.avatarUrl} alt={user.name || "user"} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-600/20 to-indigo-950/40 border border-white/5">
                  <span className="text-3xl font-black text-violet-400 italic tracking-tighter">{getInitial()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pb-1">
            <button className="p-2 rounded-full border border-white/10 text-zinc-400 hover:text-white hover:border-white/30 transition-all hover:bg-white/5">
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {!isPublic ? (
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-6 py-2 rounded-2xl bg-white/[0.03] border border-white/10 text-[11px] font-black uppercase tracking-widest text-white hover:bg-white/10 hover:border-white/20 transition-all active:scale-[0.98]"
                >
                  Edit Identity
                </button>
            ) : (
              <button
                onClick={() => setFollowing(!following)}
                className={`px-5 py-1.5 rounded-full text-sm font-bold transition-all ${
                  following
                    ? "border border-white/20 text-white hover:border-rose-400/50 hover:text-rose-400 hover:bg-rose-400/5"
                    : "bg-white text-black hover:bg-zinc-200"
                }`}
              >
                {following ? "Following" : "Follow"}
              </button>
            )}
          </div>
        </div>

        {/* Name + Handle */}
        <div className="mb-3">
          <div className="flex items-center gap-1.5">
            <h1 className="text-xl font-extrabold text-white">{user?.name || "Anonymous"}</h1>
            {user?.verified && <BadgeCheck className="w-5 h-5 text-violet-400" />}
          </div>
          <p className="text-[15px] text-zinc-600">@{user?.username || "user"}</p>
        </div>

        {/* Bio */}
        {(user?.bio || true) && (
          <p className="text-[15px] text-zinc-300 leading-relaxed mb-3">
            {user?.bio || "No bio yet."}
          </p>
        )}

        {/* Meta */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-6">
          {user?.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-zinc-700" /> {user.location}
            </div>
          )}
          {user?.website && (
            <div className="flex items-center gap-2">
              <LinkIcon className="w-3.5 h-3.5 text-zinc-700" />
              <a href={user.website} target="_blank" className="text-violet-400 hover:text-white transition-colors">{user.website.replace(/^https?:\/\//, '')}</a>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-zinc-700" /> Joined {formattedJoinDate}
          </div>
        </div>

        {/* Following / Followers - Hide if zero for now to look cleaner */}
        {(user?.followingCount > 0 || user?.followersCount > 0) && (
          <div className="flex gap-6 text-[11px] font-black uppercase tracking-widest mb-1">
            <button className="group">
              <span className="text-white group-hover:text-violet-400 transition-colors">{user?.followingCount || 0}</span>
              <span className="text-zinc-700 ml-1.5">Following</span>
            </button>
            <button className="group">
              <span className="text-white group-hover:text-violet-400 transition-colors">{user?.followersCount || 0}</span>
              <span className="text-zinc-700 ml-1.5">Followers</span>
            </button>
          </div>
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
      <div className="sticky top-[57px] z-30 flex border-b border-white/5 bg-[#05050a]/80 backdrop-blur-xl mt-3">
        {TABS.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${
                isActive ? "text-white" : "text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.02]"
              }`}
            >
              {tab}
              {isActive && (
                <motion.div
                  layoutId="profile-tab"
                  className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-violet-500 rounded-full shadow-[0_0_8px_rgba(124,58,237,0.6)]"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}
      <div>
        {activeTab === "Posts" ? (
          problems.length > 0 ? (
            <div className="divide-y divide-white/[0.04]">
              {problems.map((post: any) => (
                <ProfilePost key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <EmptyState tab="Posts" message={`@${user?.username || "this user"} hasn't posted yet.`} />
          )
        ) : (
          <EmptyState tab={activeTab} message={`Nothing to show in ${activeTab} yet.`} />
        )}
      </div>
    </div>
  );
}

function EditProfileModal({ user, onClose }: { user: any; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    name: user.name || "",
    username: user.username || "",
    bio: user.bio || "",
    location: user.location || "",
    website: user.website || "",
    githubProfile: user.githubProfile || "",
    xProfile: user.xProfile || "",
    instagramProfile: user.instagramProfile || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => data.append(key, value));
        await updateUserProfile(data);
        toast.success("Identity_Synchronized: Profile updated");
        onClose();
        window.location.reload(); // Refresh to show new data
      } catch (err: any) {
        toast.error("Process_Failure: " + err.message);
      }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-[540px] bg-[#0c0c12] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl"
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-white/[0.02]">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-center">
                 <User className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                 <h2 className="text-sm font-black text-white italic uppercase tracking-widest">Edit_Identity</h2>
                 <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] mt-0.5">Refine Neuro-Link Credentials</p>
              </div>
           </div>
           <button onClick={onClose} className="p-3 rounded-2xl hover:bg-white/5 text-zinc-600 hover:text-white transition-all">
              <X className="w-4 h-4" />
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[70vh] overflow-y-auto scrollbar-none">
           <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-700 uppercase tracking-widest px-2">Operator_Name</label>
                    <input 
                       value={formData.name}
                       onChange={e => setFormData({ ...formData, name: e.target.value })}
                       className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-[11px] font-bold text-white focus:outline-none focus:border-violet-500/30 transition-all placeholder:text-zinc-800"
                       placeholder="REAL_NAME"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-700 uppercase tracking-widest px-2">System_Alias</label>
                    <input 
                       value={formData.username}
                       onChange={e => setFormData({ ...formData, username: e.target.value })}
                       className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-[11px] font-bold text-white focus:outline-none focus:border-violet-500/30 transition-all placeholder:text-zinc-800"
                       placeholder="USERNAME"
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[9px] font-black text-zinc-700 uppercase tracking-widest px-2">Diagnostic_Bio</label>
                 <textarea 
                    value={formData.bio}
                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-[11px] font-bold text-white focus:outline-none focus:border-violet-500/30 transition-all placeholder:text-zinc-800 resize-none"
                    placeholder="Short neural summary..."
                 />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-700 uppercase tracking-widest px-2">Location_Node</label>
                    <input 
                       value={formData.location}
                       onChange={e => setFormData({ ...formData, location: e.target.value })}
                       className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-[11px] font-bold text-white focus:outline-none focus:border-violet-500/30 transition-all placeholder:text-zinc-800"
                       placeholder="City, Country"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-700 uppercase tracking-widest px-2">Uplink_URL</label>
                    <input 
                       value={formData.website}
                       onChange={e => setFormData({ ...formData, website: e.target.value })}
                       className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-[11px] font-bold text-white focus:outline-none focus:border-violet-500/30 transition-all placeholder:text-zinc-800"
                       placeholder="https://..."
                    />
                 </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                 <p className="text-[9px] font-black text-zinc-800 uppercase tracking-widest">Network_Profiles</p>
                 <div className="grid grid-cols-3 gap-3">
                    <div className="relative group">
                       <Github className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-800" />
                       <input 
                          value={formData.githubProfile}
                          onChange={e => setFormData({ ...formData, githubProfile: e.target.value })}
                          className="w-full bg-white/[0.01] border border-white/5 rounded-xl py-3 pl-4 pr-10 text-[10px] font-bold text-white focus:outline-none"
                          placeholder="GITHUB"
                       />
                    </div>
                    <div className="relative group">
                       <Twitter className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-800" />
                       <input 
                          value={formData.xProfile}
                          onChange={e => setFormData({ ...formData, xProfile: e.target.value })}
                          className="w-full bg-white/[0.01] border border-white/5 rounded-xl py-3 pl-4 pr-10 text-[10px] font-bold text-white focus:outline-none"
                          placeholder="X"
                       />
                    </div>
                    <div className="relative group">
                       <Instagram className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-800" />
                       <input 
                          value={formData.instagramProfile}
                          onChange={e => setFormData({ ...formData, instagramProfile: e.target.value })}
                          className="w-full bg-white/[0.01] border border-white/5 rounded-xl py-3 pl-4 pr-10 text-[10px] font-bold text-white focus:outline-none"
                          placeholder="INSTA"
                       />
                    </div>
                 </div>
              </div>
           </div>

           <button 
              type="submit"
              disabled={isPending}
              className="w-full py-5 bg-white text-black text-[11px] font-black uppercase tracking-[0.4em] rounded-[24px] hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-2xl flex items-center justify-center gap-4 border-b-4 border-zinc-300"
           >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (<><Save className="w-4 h-4" /> COMMIT_SYNC_SUCCESS</>)}
           </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

function ProfilePost({ post }: { post: any }) {
  const [liked, setLiked] = useState(false);
  return (
    <article className="px-4 py-4 hover:bg-white/[0.01] transition-colors cursor-pointer group">
      <div className="flex gap-3">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-[#111118] flex-shrink-0 border border-white/5">
            <User className="w-5 h-5 text-zinc-600 m-auto mt-2.5" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-sm font-bold text-white">{post.author?.name || "User"}</span>
            <span className="text-sm text-zinc-600">@{post.author?.username}</span>
            <span className="text-zinc-700">·</span>
            <span className="text-sm text-zinc-600">2h</span>
            <button className="ml-auto p-1.5 rounded-full hover:bg-violet-500/10 text-zinc-700 hover:text-violet-400 opacity-0 group-hover:opacity-100 transition-all">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[15px] text-zinc-300 leading-relaxed mb-3">{post.content}</p>
          <div className="flex items-center gap-1">
            <ActionBtn icon={<MessageSquare className="w-4 h-4" />} label={post.commentCount || 0} color="hover:text-violet-400 hover:bg-violet-400/10" />
            <ActionBtn icon={<Repeat2 className="w-4 h-4" />} label={post.repostCount || 0} color="hover:text-emerald-400 hover:bg-emerald-400/10" />
            <button
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all ${liked ? "text-rose-400" : "text-zinc-600 hover:text-rose-400 hover:bg-rose-400/10"}`}
            >
              <Heart className={`w-4 h-4 ${liked ? "fill-rose-400" : ""}`} />
              <span className="text-xs font-medium">{(post.likeCount || 0) + (liked ? 1 : 0) || ""}</span>
            </button>
            <ActionBtn icon={<Bookmark className="w-4 h-4" />} label={0} color="hover:text-violet-400 hover:bg-violet-400/10" />
            <ActionBtn icon={<Share className="w-4 h-4" />} label={0} color="hover:text-violet-400 hover:bg-violet-400/10" />
          </div>
        </div>
      </div>
    </article>
  );
}

function ActionBtn({ icon, label, color }: { icon: React.ReactNode; label: number; color: string }) {
  return (
    <button className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-zinc-600 transition-all ${color}`}>
      {icon}
      {label > 0 && <span className="text-xs font-medium">{label}</span>}
    </button>
  );
}

function EmptyState({ tab, message }: { tab: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <p className="text-xl font-extrabold text-white mb-2">Nothing here yet</p>
      <p className="text-zinc-600 text-sm leading-relaxed max-w-xs">{message}</p>
    </div>
  );
}
