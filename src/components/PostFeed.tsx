"use client";

import useSWR, { mutate } from "swr";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, Heart, Share2, MoreHorizontal, User, 
  Repeat2, Bookmark, Share, BadgeCheck, Eye, Compass
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { toggleLike, toggleBookmark, toggleRepost } from "@/app/actions";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

const fetcher = (url: string) => fetch(url).then((res) => res.json().catch(() => ({})));

const TAG_COLORS: Record<string, string> = {
  react: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  nextjs: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  typescript: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  bug: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  performance: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  default: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

export default function PostFeed({ feed = "For You" }: { feed?: string }) {
  const [mounted, setMounted] = useState(false);

  // Map tab name to API query param
  const feedParam =
    feed === "Following" ? "following" :
    feed === "Hot" ? "hot" :
    "foryou";

  const apiUrl = `/api/posts?feed=${feedParam}`;

  const { data, error, isLoading } = useSWR(apiUrl, fetcher, {
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
            className="nn-card p-24 text-center glass-morphism rounded-[40px]"
          >
            <div className="w-16 h-16 rounded-[24px] bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-6">
              <Compass className="w-8 h-8 text-violet-400 animate-pulse" />
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-2">
              {data?.empty === "not_following" ? "Not following anyone yet" : "Feed Empty"}
            </h3>
            <p className="text-sm font-medium text-zinc-600 max-w-xs mx-auto">
              {data?.empty === "not_following"
                ? "Follow people to see their posts here."
                : "Be the first to post something."}
            </p>
          </motion.div>
        ) : (
          posts.map((post: any) => (
            <PostCard key={post?.id || Math.random()} post={post} feedParam={feedParam} />
          ))
        )}
      </AnimatePresence>
    </div>
  );
}

function PostCard({ post, feedParam }: { post: any; feedParam: string }) {
  const [liked, setLiked] = useState(post.isLiked || false);
  const [bookmarked, setBookmarked] = useState(post.isBookmarked || false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);

  const tags = post.tags?.slice(0, 3) || [];
  const timeAgo = post?.createdAt
    ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
    : "recently";

  const [reposted, setReposted] = useState(post.isReposted || false);
  const [repostCount, setRepostCount] = useState(post.repostCount || 0);
  const [showReactions, setShowReactions] = useState(false);
  const [reactionType, setReactionType] = useState(post.reactionType || "LIKE");
  const timeoutRef = useRef<any>(null);
  const router = useRouter();

  const handleLike = async (type: string = "LIKE") => {
    const isRemoving = liked && reactionType === type;
    const newLiked = !isRemoving;
    
    setLiked(newLiked);
    setReactionType(type);
    setLikeCount((prev: number) => {
      if (isRemoving) return Math.max(0, prev - 1);
      if (!liked) return prev + 1;
      return prev; // Change type only
    });
    setShowReactions(false);

    try {
      await toggleLike(post.id, 'post', type);
      mutate(`/api/posts?feed=${feedParam}`);
    } catch (err) {
      toast.error("Failed to update reaction");
      // Revert state on error
    }
  };

  const handleRepost = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newReposted = !reposted;
    setReposted(newReposted);
    setRepostCount((prev: number) => newReposted ? prev + 1 : prev - 1);
    try {
      await toggleRepost(post.id);
      mutate(`/api/posts?feed=${feedParam}`);
      toast.success(newReposted ? "Reposted" : "Removed repost");
    } catch (err) {
      setReposted(!newReposted);
      setRepostCount((prev: number) => !newReposted ? prev + 1 : prev - 1);
      toast.error("Failed to repost");
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/post/${post.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this post on Debugr',
          url: url
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newBookmarked = !bookmarked;
    setBookmarked(newBookmarked);
    try {
      await toggleBookmark(post.id, 'post');
      mutate(`/api/posts?feed=${feedParam}`);
      toast.success(newBookmarked ? "Saved" : "Removed");
    } catch (err) {
      setBookmarked(!newBookmarked);
      toast.error("Failed to bookmark");
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      onClick={() => router.push(`/post/${post.id}`)}
      className="nn-card p-6 md:p-8 hover:bg-white/[0.015] transition-all cursor-pointer group rounded-[32px] border border-white/5 hover:border-white/10"
    >
      <div className="flex gap-4">
        {/* AVATAR */}
        <div className="flex-shrink-0">
          <Link href={`/u/${post?.user?.username}`} onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-violet-500/10 border border-violet-500/15 relative">
              {post?.user?.avatarUrl || post?.user?.image ? (
                <Image src={post.user.avatarUrl || post.user.image} alt={post.user.username || "User"} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-5 h-5 text-violet-400/50" />
                </div>
              )}
            </div>
          </Link>
        </div>

        {/* CONTENT */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <Link href={`/u/${post?.user?.username || 'unknown'}`} onClick={(e) => e.stopPropagation()} className="hover:underline">
              <span className="text-[15px] font-black text-white leading-tight uppercase tracking-tight">
                {post?.user?.name || (post?.user?.username ? `@${post.user.username}` : "Agent")}
              </span>
            </Link>
            {post?.user?.username && (
              <span className="text-[13px] font-bold text-zinc-700 tracking-tight">@{post.user.username}</span>
            )}
            <span className="text-zinc-800">·</span>
            <span className="text-[12px] font-medium text-zinc-600">{timeAgo}</span>
            <button 
              onClick={(e) => e.stopPropagation()}
              className="ml-auto p-2 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-violet-400/10 text-zinc-600 hover:text-violet-400 transition-all"
            >
              <MoreHorizontal className="w-[18px] h-[18px]" />
            </button>
          </div>

          {/* Body */}
          <p className="text-[15px] text-zinc-300 leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>

          {/* Social Stats/Indicators */}
          <div className="flex items-center gap-6 mb-6">
             <div className="flex items-center gap-1.5 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] font-black text-white tracking-widest uppercase">{post.viewCount || 0} Views</span>
             </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex items-center gap-4">
              <button 
                onClick={(e) => { e.stopPropagation(); router.push(`/post/${post.id}`); }}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl text-zinc-500 hover:text-violet-400 hover:bg-violet-400/10 transition-all group/action"
              >
                 <MessageSquare className="w-5 h-5 group-hover/action:scale-110 transition-transform" />
                 <span className="text-[13px] font-black">{post.commentCount ?? post.comments?.length ?? 0}</span>
              </button>
              
              <div 
                className="relative"
                onMouseEnter={() => {
                  timeoutRef.current = setTimeout(() => setShowReactions(true), 500);
                }}
                onMouseLeave={() => {
                  clearTimeout(timeoutRef.current);
                  setShowReactions(false);
                }}
              >
                <AnimatePresence>
                  {showReactions && <ReactionPicker currentType={reactionType} onSelect={(type) => handleLike(type)} />}
                </AnimatePresence>
                
                <button
                  onClick={(e) => { e.stopPropagation(); handleLike(reactionType); }}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-2xl transition-all group/heart",
                    liked ? "text-rose-500 bg-rose-500/5" : "text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10"
                  )}
                >
                  {liked && reactionType !== "LIKE" ? (
                    <span className="text-lg leading-none group-hover/heart:scale-110 transition-transform">
                      {reactionType === "LOVE" ? "🔥" : reactionType === "INSIGHTFUL" ? "💡" : reactionType === "DEBUGGED" ? "🛠️" : reactionType === "THINKING" ? "🤔" : reactionType === "LAUGH" ? "😂" : "🚀"}
                    </span>
                  ) : (
                    <Heart className={cn("w-5 h-5 transition-transform group-hover/heart:scale-110", liked && "fill-rose-500")} />
                  )}
                  <span className="text-[13px] font-black">{likeCount || 0}</span>
                </button>
              </div>

              <button 
                onClick={handleRepost}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-2xl transition-all group/action",
                  reposted ? "text-emerald-400 bg-emerald-400/5" : "text-zinc-500 hover:text-emerald-400 hover:bg-emerald-400/10"
                )}
              >
                 <Repeat2 className={cn("w-5 h-5 group-hover/action:scale-110 transition-transform", reposted && "scale-110")} />
                 <span className="text-[13px] font-black">{repostCount || 0}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleBookmark}
                className={cn(
                  "p-3 rounded-2xl transition-all",
                  bookmarked ? "text-violet-400 bg-violet-400/5" : "text-zinc-600 hover:text-violet-400 hover:bg-violet-400/10"
                )}
              >
                <Bookmark className={cn("w-5 h-5", bookmarked && "fill-violet-400")} />
              </button>
              <button 
                onClick={handleShare}
                className="p-3 rounded-2xl text-zinc-600 hover:text-white hover:bg-white/5 transition-all"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function LoadingCard({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="nn-card p-8 rounded-[32px] border border-white/5 h-[180px]"
    >
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/[0.03] animate-pulse flex-shrink-0" />
        <div className="flex-1 space-y-4">
          <div className="h-4 w-1/3 bg-white/[0.04] rounded-full animate-pulse" />
          <div className="space-y-2">
             <div className="h-3 w-full bg-white/[0.02] rounded-full animate-pulse" />
             <div className="h-3 w-4/5 bg-white/[0.02] rounded-full animate-pulse" />
          </div>
          <div className="flex gap-4 pt-4 border-t border-white/5">
             <div className="h-8 w-16 bg-white/[0.02] rounded-xl animate-pulse" />
             <div className="h-8 w-16 bg-white/[0.02] rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ReactionPicker({ currentType, onSelect }: { currentType: string; onSelect: (type: string) => void }) {
  const reactions = [
    { type: "LIKE", icon: "❤️" },
    { type: "LOVE", icon: "🔥" },
    { type: "INSIGHTFUL", icon: "💡" },
    { type: "LAUGH", icon: "😂" },
    { type: "THINKING", icon: "🤔" },
    { type: "DEBUGGED", icon: "🛠️" },
    { type: "ROCKET", icon: "🚀" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute bottom-full left-0 mb-2 p-2 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl flex gap-2 z-50 shadow-2xl"
    >
      {reactions.map((r) => (
        <button
          key={r.type}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(r.type);
          }}
          className={cn(
            "w-10 h-10 flex items-center justify-center rounded-xl transition-all hover:scale-125 hover:bg-white/5",
            currentType === r.type && "bg-violet-500/20"
          )}
        >
          <span className="text-xl">{r.icon}</span>
        </button>
      ))}
    </motion.div>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");
