"use client";

import { motion } from "framer-motion";
import { Bell, Heart, MessageSquare, UserCheck, ShieldCheck, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: string;
  userId: string;
  actorId: string;
  postId?: string | null;
  promptId?: string | null;
  isRead: boolean;
  createdAt: Date;
  user?: {
    name: string | null;
    username: string | null;
    avatarUrl: string | null;
  };
}

export default function NotificationsClient({ initialNotifications }: { initialNotifications: any[] }) {
  if (initialNotifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center border-2 border-dashed border-white/5 rounded-[48px]">
        <div className="w-20 h-20 bg-white/[0.02] rounded-[32px] flex items-center justify-center mb-8">
           <Bell className="w-8 h-8 text-zinc-800" />
        </div>
        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4">No Signals Detected</h3>
        <p className="text-sm font-medium text-zinc-600 max-w-xs mx-auto mb-10 leading-relaxed">Your digital protocol is clear. You will be notified of all identity interactions and social signals here.</p>
        <Link href="/" className="px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-zinc-200 transition-all">Protocol Feed</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {initialNotifications.map((notif, idx) => (
        <NotificationItem key={notif.id} notif={notif} index={idx} />
      ))}
    </div>
  );
}

function NotificationItem({ notif, index }: { notif: any, index: number }) {
  const getIcon = () => {
    switch (notif.type) {
      case "LIKE": return <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />;
      case "COMMENT": return <MessageSquare className="w-4 h-4 text-violet-400" />;
      case "FOLLOW": return <UserCheck className="w-4 h-4 text-emerald-400" />;
      default: return <ShieldCheck className="w-4 h-4 text-blue-400" />;
    }
  };

  const getMessage = () => {
    const actorName = notif.user?.name || "Someone";
    switch (notif.type) {
      case "LIKE": return <span><b>{actorName}</b> liked your {notif.postId ? "post" : "prompt"}</span>;
      case "COMMENT": return <span><b>{actorName}</b> commented on your {notif.postId ? "post" : "prompt"}</span>;
      case "FOLLOW": return <span><b>{actorName}</b> protocol is now following you</span>;
      default: return <span>Protocol update from <b>{actorName}</b></span>;
    }
  };

  const getTargetLink = () => {
    if (notif.postId) return `/post/${notif.postId}`;
    if (notif.promptId) return `/marketplace/prompt/${notif.promptId}`;
    return `/u/${notif.user?.username}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "group flex items-center gap-6 p-6 rounded-[32px] border border-white/5 bg-[#0a0a0f] hover:bg-white/[0.03] transition-all relative overflow-hidden",
        !notif.isRead && "border-l-4 border-l-violet-500"
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-zinc-900 overflow-hidden flex-shrink-0 border border-white/10 relative">
        {notif.user?.avatarUrl ? (
          <Image src={notif.user.avatarUrl} alt="avatar" fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-800">
            <span className="text-zinc-600 font-black text-xl italic uppercase font-mono">{notif.user?.name?.[0] || "?"}</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-1.5 bg-white/5 rounded-lg border border-white/5">
             {getIcon()}
          </div>
          <p className="text-[13px] text-zinc-300 leading-tight">
             {getMessage()}
          </p>
        </div>
        <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">
           {formatDistanceToNow(new Date(notif.createdAt))} ago
        </p>
      </div>

      <Link href={getTargetLink()} className="p-3 bg-white/5 hover:bg-white text-zinc-800 hover:text-black rounded-2xl opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
         <ArrowRight className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}
