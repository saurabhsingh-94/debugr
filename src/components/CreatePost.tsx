"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Link as LinkIcon, AtSign, Smile, Send, User, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { postPost } from "@/app/actions";
import { mutate } from "swr";

interface CreatePostProps {
  onPostSuccess?: () => void;
  onCancel?: () => void;
}

export default function CreatePost({ onPostSuccess, onCancel }: CreatePostProps) {
  const [content, setContent] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    // Auto-resize
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isPosting) return;

    setIsPosting(true);
    const id = toast.loading("Broadcasting...");
    
    try {
      await postPost(content);
      toast.success("Post shared", { id });
      setContent("");
      setIsFocused(false);
      if (textareaRef.current) textareaRef.current.style.height = "auto";
      // Immediately revalidate all feed tabs
      await Promise.all([
        mutate("/api/posts?feed=foryou"),
        mutate("/api/posts?feed=following"),
        mutate("/api/posts?feed=hot"),
      ]);
      onPostSuccess?.();
    } catch (error) {
      toast.error("Transmission Error", { id });
    } finally {
      setIsPosting(false);
    }
  };

  const charLimit = 280;
  const remaining = charLimit - content.length;
  const isNearLimit = remaining <= 40;
  const isOverLimit = remaining < 0;

  return (
    <div className="nn-card p-6 transition-all ring-1 ring-white/5 hover:ring-white/10">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-900 border border-white/5 flex items-center justify-center flex-shrink-0">
             <User className="w-5 h-5 text-zinc-600" />
          </div>

          {/* Input area */}
          <div className="flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleInput}
              onFocus={() => setIsFocused(true)}
              onBlur={() => !content && setIsFocused(false)}
              placeholder="Share a problem, debug story, or insight..."
              rows={isFocused ? 3 : 1}
              className="w-full bg-transparent border-none focus:ring-0 text-[16px] text-white placeholder-zinc-500 resize-none outline-none leading-relaxed min-h-[40px] max-h-[240px] overflow-y-auto scrollbar-none transition-all"
            />

            <AnimatePresence>
              {(isFocused || content.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-0.5">
                      {[
                        { icon: ImageIcon, label: "Image" },
                        { icon: LinkIcon, label: "Link" },
                        { icon: AtSign, label: "Mention" },
                        { icon: Smile, label: "Emoji" },
                      ].map(({ icon: Icon, label }) => (
                        <button
                          key={label}
                          type="button"
                          title={label}
                          className="p-2 rounded-lg text-zinc-600 hover:text-violet-400 hover:bg-violet-400/10 transition-all"
                        >
                          <Icon className="w-[18px] h-[18px]" />
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      {content.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <svg className="w-5 h-5 -rotate-90" viewBox="0 0 20 20">
                            <circle cx="10" cy="10" r="8" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
                            <circle
                              cx="10" cy="10" r="8" fill="none"
                              stroke={isOverLimit ? "#f87171" : isNearLimit ? "#fb923c" : "#a78bfa"}
                              strokeWidth="2"
                              strokeDasharray={`${Math.PI * 16}`}
                              strokeDashoffset={`${Math.PI * 16 * (1 - Math.min(content.length / charLimit, 1))}`}
                              strokeLinecap="round"
                              className="transition-all"
                            />
                          </svg>
                          {isNearLimit && (
                            <span className={`text-xs font-semibold ${isOverLimit ? "text-rose-400" : "text-amber-400"}`}>
                              {remaining}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                         <button 
                           type="button"
                           onClick={() => {
                             if (onCancel) onCancel();
                             setIsFocused(false);
                             if (!content) setContent("");
                           }}
                           className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all flex items-center gap-2 group"
                         >
                           <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                           {onCancel && <span className="text-[10px] font-black uppercase tracking-widest pr-1">Cancel</span>}
                         </button>
                         <button
                           type="submit"
                           disabled={!content.trim() || isOverLimit || isPosting}
                           className="flex items-center gap-2 px-6 py-2 rounded-xl bg-white hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed text-black text-[11px] font-black uppercase tracking-wider transition-all active:scale-95 shadow-2xl"
                         >
                           {isPosting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                           Post
                         </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </form>
    </div>
  );
}

function Loader2({ className }: { className?: string }) {
   return <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className={className}>
      <Send className="w-4 h-4" />
   </motion.div>;
}
