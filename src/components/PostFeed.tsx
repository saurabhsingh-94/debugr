"use client";

import useSWR, { mutate } from "swr";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, Heart, Share2, MoreHorizontal, User, 
  Repeat2, Bookmark, Share, BadgeCheck, Zap
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json().catch(() => ({})));

// Mock tags for visual richness until API supports it
const TAG_COLORS: Record<string, string> = {
  react: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  nextjs: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  typescript: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  bug: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  performance: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  default: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

export default function PostFeed() {
  const [mounted, setMounted] = useState(false);
  const { data, error, isLoading } = useSWR("/api/posts", fetcher, {
    refreshInterval: 8000,
    revalidateOnFocus: true,
  });

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  if (error) return (
    <div className="nn-card p-16 text-center">
      <p className="text-zinc-600 text-sm font-medium">Failed to load feed</p>
      <p className="text-xs text-zinc-700 mt-1">Check your connection and try again</p>
    </div>
  );

  const posts = Array.isArray(data?.posts) ? data.posts : [];

  return (
    <div className="space-y-6">
      <AnimatePresence mode="popLayout">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <LoadingCard key={i} delay={i * 0.06} />)
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="nn-card p-16 text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-5 h-5 text-violet-400" />
            </div>
            <p className="text-sm font-semibold text-white mb-1">No posts yet</p>
            <p className="text-xs text-zinc-600">Be the first to share a problem or insight.</p>
          </motion.div>
        ) : (
          posts.map((post: any) => (
            <PostCard key={post?.id || Math.random()} post={post} />
          ))
        )}
      </AnimatePresence>
    </div>
  );
}

function PostCard({ post }: { post: any }) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const tags = post.tags?.slice(0, 3) || [];
  const timeAgo = post?.createdAt
    ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
    : "recently";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="px-6 py-8 hover:bg-white/[0.015] transition-colors cursor-pointer group"
    >
      <div className="flex gap-3">
        {/* AVATAR */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-violet-500/10 border border-violet-500/15">
            {post?.author?.avatarUrl ? (
              <Image src={post.author.avatarUrl} alt={post.author.username || "User"} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-4 h-4 text-violet-400/50" />
              </div>
            )}
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-1 mb-2 flex-wrap">
            <span className="text-[15px] font-bold text-white leading-tight">
              {post?.author?.name || `@${post?.author?.username}` || "Anonymous"}
            </span>
            {post?.author?.verified && <BadgeCheck className="w-3.5 h-3.5 text-violet-400" />}
            <span className="text-[15px] text-zinc-600">@{post?.author?.username || "user"}</span>
            <span className="text-zinc-700">·</span>
            <span className="text-[15px] text-zinc-600">{timeAgo}</span>
            <button className="ml-auto p-1.5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-violet-400/10 text-zinc-700 hover:text-violet-400 transition-all">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <p className="text-[15px] text-zinc-300 leading-relaxed mb-3">{post.content}</p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {tags.map((tag: string) => {
                const key = tag.toLowerCase().replace("#", "");
                const style = TAG_COLORS[key] || TAG_COLORS.default;
                return (
                  <span key={tag} className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-medium ${style}`}>
                    #{key}
                  </span>
                );
              })}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between -ml-2">
            <div className="flex items-center gap-0">
              <ActionBtn icon={<MessageSquare className="w-4 h-4" />} label={post.commentCount || 0} color="hover:text-violet-400 hover:bg-violet-400/10" onClick={() => {}} />
              <ActionBtn icon={<Repeat2 className="w-4 h-4" />} label={post.repostCount || 0} color="hover:text-emerald-400 hover:bg-emerald-400/10" onClick={() => {}} />
              <button
                onClick={() => setLiked(!liked)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all group/heart ${liked ? "text-rose-400" : "text-zinc-600 hover:text-rose-400 hover:bg-rose-400/10"}`}
              >
                <Heart className={`w-4 h-4 transition-transform group-hover/heart:scale-110 ${liked ? "fill-rose-400" : ""}`} />
                <span className="text-sm font-medium">{(post.likeCount || 0) + (liked ? 1 : 0) || ""}</span>
              </button>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={() => setBookmarked(!bookmarked)}
                className={`p-2 rounded-full transition-all ${bookmarked ? "text-violet-400" : "text-zinc-700 hover:text-violet-400 hover:bg-violet-400/10"}`}
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-violet-400" : ""}`} />
              </button>
              <button className="p-2 rounded-full text-zinc-700 hover:text-violet-400 hover:bg-violet-400/10 transition-all">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function ActionBtn({ 
  icon, label, onClick, color 
}: { 
  icon: React.ReactNode; 
  label: number; 
  onClick: () => void;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all text-zinc-600 ${color}`}
    >
      {icon}
      {label > 0 && <span className="text-sm font-medium">{label}</span>}
    </button>
  );
}


function LoadingCard({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="px-4 py-4"
    >
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-white/[0.04] animate-pulse flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-40 bg-white/[0.04] rounded-full animate-pulse" />
          <div className="h-3.5 w-full bg-white/[0.03] rounded-full animate-pulse" />
          <div className="h-3.5 w-4/5 bg-white/[0.03] rounded-full animate-pulse" />
          <div className="h-3.5 w-2/3 bg-white/[0.03] rounded-full animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
}
