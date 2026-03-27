"use client";

import { motion } from "framer-motion";
import { 
  User, Settings, MapPin, Calendar, Link as LinkIcon,
  MessageSquare, Repeat2, Heart, Share, ArrowLeft,
  MoreHorizontal, BadgeCheck, Bookmark, 
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

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
            <div className="w-[104px] h-[104px] rounded-full border-4 border-[#05050a] overflow-hidden bg-[#111118]">
              {user?.avatarUrl ? (
                <Image src={user.avatarUrl} alt={user.name || "user"} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-10 h-10 text-zinc-600" />
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
              <Link href="/settings">
                <button className="px-4 py-1.5 rounded-full border border-white/20 text-sm font-bold text-white hover:bg-white/5 transition-all">
                  Edit profile
                </button>
              </Link>
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
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-500 mb-3">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> San Francisco
          </div>
          <div className="flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5" />
            <a href="#" className="text-violet-400 hover:underline">debugr.ai/{user?.username}</a>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> Joined March 2024
          </div>
        </div>

        {/* Following / Followers */}
        <div className="flex gap-5 text-sm mb-1">
          <button className="hover:underline">
            <span className="font-bold text-white">{user?.followingCount ?? 142}</span>
            <span className="text-zinc-600 ml-1">Following</span>
          </button>
          <button className="hover:underline">
            <span className="font-bold text-white">{user?.followersCount ?? "8,401"}</span>
            <span className="text-zinc-600 ml-1">Followers</span>
          </button>
        </div>
      </div>

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
