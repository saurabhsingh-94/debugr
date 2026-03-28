"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { User, MessageSquare, Heart, MoreHorizontal, CornerDownRight } from "lucide-react";
import Image from "next/image";
import { addComment, toggleLike } from "@/app/actions";
import toast from "react-hot-toast";

interface CommentSectionProps {
  postId: string;
  initialComments?: any[];
}

export default function CommentSection({ postId, initialComments = [] }: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addComment(postId, "post", newComment);
      setNewComment("");
      toast.success("Comment added");
      // Ideally revalidate or optimistic update
      // For now, we'll assume the parent revalidates
    } catch (err) {
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 mt-12 pb-24">
      <div className="flex items-center gap-4 mb-6 px-4">
        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">
          Comments <span className="text-zinc-700 ml-2">{comments.length}</span>
        </h3>
      </div>

      {/* INPUT */}
      <form onSubmit={handleSubmit} className="px-4 mb-10">
        <div className="relative group">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add to the intelligence thread..."
            className="w-full bg-white/[0.02] border border-white/5 rounded-[32px] py-6 px-8 text-[15px] font-medium text-white focus:outline-none focus:border-violet-500/30 transition-all resize-none italic min-h-[120px]"
          />
          <div className="absolute bottom-4 right-4">
            <button
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              className="px-8 py-3 bg-white text-black text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-200 transition-all disabled:opacity-50 active:scale-95 shadow-2xl"
            >
              Post
            </button>
          </div>
        </div>
      </form>

      {/* THREADS */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {comments.map((comment) => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              postId={postId} 
              depth={0} 
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CommentItem({ comment, postId, depth }: { comment: any; postId: string; depth: number }) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replies, setReplies] = useState(comment.replies || []);

  const timeAgo = comment.createdAt
    ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
    : "just now";

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addComment(postId, "post", replyContent, comment.id);
      setReplyContent("");
      setIsReplying(false);
      toast.success("Reply added");
      // Note: Full reload or state update would be better here
    } catch (err) {
      toast.error("Failed to reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  const MAX_DEPTH = 3;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={depth > 0 ? "ml-6 md:ml-12 mt-4" : "border-b border-white/[0.04] pb-6 mb-6 px-4"}
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-violet-500/10 border border-violet-500/15 relative">
            {comment.user?.avatarUrl || comment.user?.image ? (
              <Image src={comment.user.avatarUrl || comment.user.image} alt="User" fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-4 h-4 text-violet-400/50" />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[14px] font-black text-white italic uppercase tracking-tighter">
              {comment.user?.name || comment.user?.username || "Agent"}
            </span>
            <span className="text-[12px] font-bold text-zinc-700 tracking-tight">@{comment.user?.username}</span>
            <span className="text-zinc-800">·</span>
            <span className="text-[11px] font-medium text-zinc-600">{timeAgo}</span>
          </div>

          <p className="text-[14px] text-zinc-300 leading-relaxed mb-3 whitespace-pre-wrap">{comment.content}</p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-violet-400 flex items-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Reply
            </button>
            <button className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-rose-500 flex items-center gap-1.5 transition-colors">
              <Heart className="w-3.5 h-3.5" />
              {comment._count?.likes || 0}
            </button>
            <button className="ml-auto p-1.5 rounded-lg text-zinc-800 hover:text-white transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <AnimatePresence>
            {isReplying && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleReply}
                className="mt-4 mb-2 overflow-hidden"
              >
                <div className="relative">
                  <textarea
                    autoFocus
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder={`Replying to @${comment.user?.username}...`}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-5 text-[14px] text-white focus:outline-none focus:border-violet-500/50 transition-all resize-none italic min-h-[80px]"
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setIsReplying(false)}
                      className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!replyContent.trim() || isSubmitting}
                      className="px-6 py-2 bg-violet-600/20 border border-violet-500/30 text-violet-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-violet-600/30 transition-all disabled:opacity-50"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* RENDER REPLIES */}
          {replies.length > 0 && (
            <div className="relative">
              {/* Thread line */}
              <div className="absolute left-[-26px] top-0 bottom-0 w-[1px] bg-white/[0.05]" />
              
              <div className="space-y-2">
                {replies.map((reply: any) => (
                  <CommentItem 
                    key={reply.id} 
                    comment={reply} 
                    postId={postId} 
                    depth={depth + 1} 
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
