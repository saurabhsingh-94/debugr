"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Settings, MapPin, Calendar, Link as LinkIcon,
  MessageSquare, Repeat2, Heart, Share, ArrowLeft,
  MoreHorizontal, BadgeCheck, Bookmark, X, Camera, Save, Loader2, Github, Twitter, Instagram
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useTransition } from "react";
import { updateUserProfile } from "@/app/actions";
import toast from "react-hot-toast";
import PromptCard from "./PromptCard";

interface ProfileClientProps {
  user: any;
  stats: any;
  problems?: any[];
  prompts?: any[];
  isPublic?: boolean;
}

const TABS = ["Posts", "Marketplace"];

export default function ProfileClient({ user, stats, problems = [], prompts = [], isPublic = false }: ProfileClientProps) {
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
    <div className="max-w-[1000px] mx-auto w-full min-h-screen">

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

          <div className="flex items-center gap-2 pb-1">
            <button className="p-2 rounded-full border border-white/10 text-zinc-400 hover:text-white hover:border-white/30 transition-all hover:bg-white/5">
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {!isPublic ? (
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-6 py-2 rounded-2xl bg-white/[0.03] border border-white/10 text-[11px] font-black uppercase tracking-widest text-white hover:bg-white/10 hover:border-white/20 transition-all active:scale-[0.98]"
                >
                  Edit Profile
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

        <div className="mb-3">
          <div className="flex items-center gap-1.5">
            <h1 className="text-xl font-extrabold text-white">{user?.name || "Anonymous"}</h1>
            {user?.verified && <BadgeCheck className="w-5 h-5 text-violet-400" />}
          </div>
          <p className="text-[15px] text-zinc-600">@{user?.username || "user"}</p>
        </div>

        <p className="text-[15px] text-zinc-300 leading-relaxed mb-3">
          {user?.bio || "No bio yet."}
        </p>

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
      </div>

      <AnimatePresence>
        {isEditModalOpen && (
          <EditProfileModal
            user={user}
            onClose={() => setIsEditModalOpen(false)}
          />
        )}
      </AnimatePresence>

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

      <div>
        {activeTab === "Posts" ? (
          problems.length > 0 ? (
            <div className="py-8 divide-y divide-white/[0.04]">
              {problems.map((post: any) => (
                <ProfilePost key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <EmptyState tab="Posts" message={`@${user?.username || "this user"} hasn't posted yet.`} />
          )
        ) : activeTab === "Marketplace" ? (
          prompts.length > 0 ? (
            <div className="py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
              {prompts.map((p: any) => (
                <PromptCard 
                  key={p.id} 
                  id={p.id}
                  title={p.title}
                  thumbnail={p.thumbnailUrl || "/placeholder.png"}
                  model={p.aiModel || "GPT-4"}
                  price={`${p.currency === 'INR' ? '₹' : '$'}${p.price}`}
                  prompt={p.previewContent || p.description}
                />
              ))}
            </div>
          ) : (
            <EmptyState tab="Marketplace" message={`No items in the marketplace yet.`} />
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
        toast.success("Profile Updated");
        onClose();
        window.location.reload();
      } catch (err: any) {
        toast.error("Update Failed: " + err.message);
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
                  <h2 className="text-sm font-black text-white italic uppercase tracking-widest">Edit Profile</h2>
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] mt-0.5">Update your profile information</p>
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
                    <label className="text-[9px] font-black text-zinc-700 uppercase tracking-widest px-2">Name</label>
                    <input
                       value={formData.name}
                       onChange={e => setFormData({ ...formData, name: e.target.value })}
                       className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-[11px] font-bold text-white focus:outline-none focus:border-violet-500/30 transition-all placeholder:text-zinc-800"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-700 uppercase tracking-widest px-2">Username</label>
                    <input
                       value={formData.username}
                       onChange={e => setFormData({ ...formData, username: e.target.value })}
                       className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-[11px] font-bold text-white focus:outline-none focus:border-violet-500/30 transition-all placeholder:text-zinc-800"
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[9px] font-black text-zinc-700 uppercase tracking-widest px-2">Bio</label>
                 <textarea
                    value={formData.bio}
                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-[11px] font-bold text-white focus:outline-none focus:border-violet-500/30 transition-all placeholder:text-zinc-800 resize-none"
                 />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-700 uppercase tracking-widest px-2">Location</label>
                    <input
                       value={formData.location}
                       onChange={e => setFormData({ ...formData, location: e.target.value })}
                       className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-[11px] font-bold text-white focus:outline-none focus:border-violet-500/30 transition-all placeholder:text-zinc-800"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-700 uppercase tracking-widest px-2">Website</label>
                    <input
                       value={formData.website}
                       onChange={e => setFormData({ ...formData, website: e.target.value })}
                       className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-[11px] font-bold text-white focus:outline-none focus:border-violet-500/30 transition-all placeholder:text-zinc-800"
                    />
                 </div>
              </div>
           </div>

           <button
              type="submit"
              disabled={isPending}
              className="w-full py-5 bg-white text-black text-[11px] font-black uppercase tracking-[0.4em] rounded-[24px] hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-2xl flex items-center justify-center gap-4 border-b-4 border-zinc-300"
           >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (<><Save className="w-4 h-4" /> Save Changes</>)}
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
        <div className="w-10 h-10 rounded-full overflow-hidden bg-[#111118] flex-shrink-0 border border-white/5 flex items-center justify-center">
            {post.user?.avatarUrl ? <Image src={post.user.avatarUrl} alt="avatar" width={40} height={40} className="object-cover" /> : <User className="w-5 h-5 text-zinc-600" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-sm font-bold text-white">{post.user?.name || "User"}</span>
            <span className="text-sm text-zinc-600">@{post.user?.username}</span>
            <span className="text-zinc-700">·</span>
            <span className="text-sm text-zinc-600">2h</span>
          </div>
          <p className="text-[15px] text-zinc-300 leading-relaxed mb-3">{post.content}</p>
          <div className="flex items-center gap-6 text-zinc-600">
            <ActionBtn icon={<MessageSquare className="w-4 h-4" />} label={0} color="hover:text-violet-400" />
            <ActionBtn icon={<Repeat2 className="w-4 h-4" />} label={0} color="hover:text-emerald-400" />
            <button className="flex items-center gap-1.5 hover:text-rose-400 transition-colors" onClick={() => setLiked(!liked)}>
              <Heart className={`w-4 h-4 ${liked ? "fill-rose-400 text-rose-400" : ""}`} />
              <span className="text-xs">{post._count?.likes || 0}</span>
            </button>
            <ActionBtn icon={<Share className="w-4 h-4" />} label={0} color="hover:text-blue-400" />
          </div>
        </div>
      </div>
    </article>
  );
}

function ActionBtn({ icon, label, color }: { icon: React.ReactNode; label: number; color: string }) {
  return (
    <button className={`flex items-center gap-1.5 transition-all ${color}`}>
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
