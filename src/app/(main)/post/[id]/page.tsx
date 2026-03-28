import { getPostWithComments, getAuthUser } from "@/app/actions";
import { notFound, redirect } from "next/navigation";
import CommentSection from "@/components/CommentSection";
import { 
  Heart, MessageSquare, Repeat2, Bookmark, Share2, 
  ArrowLeft, MoreHorizontal, User, Eye, Rocket, Zap, Bug, Code, Sparkles, Flame
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const post = await getPostWithComments(params.id);
  const user = await getAuthUser();

  if (!post) notFound();

  const timeAgo = post.createdAt
    ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
    : "recently";

  return (
    <div className="max-w-[800px] mx-auto min-h-screen bg-[#05050a]/50 backdrop-blur-3xl border-x border-white/5 font-grotesk">
      {/* HEADER */}
      <div className="sticky top-0 z-40 flex items-center gap-6 px-6 py-5 bg-[#05050a]/80 backdrop-blur-2xl border-b border-white/5">
        <Link href="/" className="p-3 bg-white/[0.03] border border-white/10 rounded-2xl text-zinc-400 hover:text-white transition-all hover:scale-105 active:scale-95">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-xl font-black text-white italic uppercase tracking-tighter leading-tight">Post <span className="text-zinc-700">Thread</span></h2>
          <p className="text-[10px] font-black text-violet-500 uppercase tracking-[0.4em]">Intelligence Node {post.id.slice(-8)}</p>
        </div>
      </div>

      <div className="p-6 md:p-10">
        {/* AUTHOR ROW */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-5">
            <Link href={`/u/${post.user.username}`} className="relative group">
              <div className="w-16 h-16 rounded-[24px] overflow-hidden bg-violet-500/10 border-2 border-white/5 group-hover:border-violet-500/30 transition-all shadow-2xl relative">
                {post.user.avatarUrl || post.user.image ? (
                  <Image src={post.user.avatarUrl || post.user.image} alt={post.user.username} fill className="object-cover transition-transform group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-7 h-7 text-violet-400/50" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-[#05050a] rounded-full shadow-lg" />
            </Link>
            
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Link href={`/u/${post.user.username}`}>
                   <span className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none hover:text-violet-400 transition-colors">
                     {post.user.name || "Anonymous Agent"}
                   </span>
                </Link>
                {post.user.isProfessional && <div className="p-1 px-2.5 bg-violet-500/10 border border-violet-500/20 rounded-full text-[8px] font-black text-violet-400 uppercase tracking-widest">PRO</div>}
              </div>
              <p className="text-[13px] font-bold text-zinc-500 uppercase tracking-widest">@{post.user.username}</p>
            </div>
          </div>
          
          <button className="p-4 bg-white/[0.02] border border-white/5 rounded-[20px] text-zinc-600 hover:text-white hover:border-white/20 transition-all">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="mb-12">
          <p className="text-2xl md:text-3xl font-medium text-zinc-200 leading-[1.4] whitespace-pre-wrap tracking-tight">
            {post.content}
          </p>
        </div>

        {/* METADATA */}
        <div className="flex flex-wrap items-center gap-8 py-8 border-y border-white/[0.05] mb-8">
           <div className="flex items-center gap-3">
              <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">{timeAgo}</span>
              <span className="text-zinc-800">·</span>
              <div className="flex items-center gap-2 group/eye">
                 <Eye className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                 <span className="text-[13px] font-black text-white">{post.viewCount || 0}</span>
                 <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Views</span>
              </div>
           </div>
           
           <div className="flex items-center gap-6 ml-auto">
              {["LIKE", "LOVE", "INSIGHTFUL", "DEBUGGED", "ROCKET"].map(type => (
                <div key={type} className="flex items-center gap-1.5 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">
                   <span className="text-sm">
                     {type === "LIKE" ? "❤️" : type === "LOVE" ? "🔥" : type === "INSIGHTFUL" ? "💡" : type === "DEBUGGED" ? "🛠️" : "🚀"}
                   </span>
                </div>
              ))}
           </div>
        </div>

        {/* STATS BAR */}
        <div className="flex items-center gap-10 mb-12">
           <Stat label="Total Engagement" value={post.likeCount + post.commentCount + post.repostCount} />
           <Stat label="Amplifications" value={post.repostCount} />
           <Stat label="Neural Points" value={Math.floor(post.viewCount / 10)} />
        </div>

        {/* ACTIONS */}
        <div className="grid grid-cols-4 gap-4 mb-16">
           <ActionBtn icon={<MessageSquare className="w-5 h-5" />} label="Comment" count={post.commentCount} />
           <ActionBtn icon={<Repeat2 className="w-5 h-5" />} label="Repost" count={post.repostCount} active={post.isReposted} activeColor="text-emerald-400" />
           <ActionBtn icon={<Heart className="w-5 h-5" />} label="Reaction" count={post.likeCount} active={post.isLiked} activeColor="text-rose-500" />
           <ActionBtn icon={<Bookmark className="w-5 h-5" />} label="Bookmark" active={post.isBookmarked} activeColor="text-violet-400" />
        </div>

        {/* COMMENTS SECTION */}
        <CommentSection postId={post.id} initialComments={post.comments} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
       <p className="text-[20px] font-black text-white italic leading-none">{value}</p>
       <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">{label}</p>
    </div>
  );
}

function ActionBtn({ icon, label, count, active, activeColor }: { icon: any; label: string; count?: number; active?: boolean; activeColor?: string }) {
  return (
    <button className={`flex flex-col items-center gap-3 p-6 rounded-[32px] border transition-all hover:scale-105 active:scale-95 group ${active ? `${activeColor} bg-white/[0.03] border-white/10` : "bg-white/[0.01] border-white/5 text-zinc-600 hover:text-zinc-300"}`}>
       <div className={`${active ? "" : "group-hover:scale-110"} transition-transform`}>
          {icon}
       </div>
       <div className="flex flex-col items-center">
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">{label}</span>
          {count !== undefined && <span className="text-[11px] font-bold mt-0.5">{count}</span>}
       </div>
    </button>
  );
}
