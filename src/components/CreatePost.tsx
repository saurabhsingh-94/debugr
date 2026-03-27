"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Link as LinkIcon, AtSign, Smile, Send, User } from "lucide-react";
import { toast } from "react-hot-toast";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [isFocused, setIsFocused] = useState(false);
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
    if (!content.trim()) return;
    toast.success("Posted!");
    setContent("");
    setIsFocused(false);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const charLimit = 280;
  const remaining = charLimit - content.length;
  const isNearLimit = remaining <= 40;
  const isOverLimit = remaining < 0;

  return (
    <div className="nn-card p-5 transition-all">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <User className="w-4 h-4 text-violet-400/60" />
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
              className="w-full bg-transparent border-none focus:ring-0 text-[15px] text-white placeholder-zinc-600 resize-none outline-none leading-relaxed min-h-[40px] max-h-[240px] overflow-y-auto scrollbar-none transition-all"
            />

            <AnimatePresence>
              {(isFocused || content.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Attachment actions + submit */}
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
                          <Icon className="w-4 h-4" />
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Character counter */}
                      {content.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          {/* Ring progress */}
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

                      <button
                        type="submit"
                        disabled={!content.trim() || isOverLimit}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all active:scale-95 shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)]"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Post
                      </button>
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
