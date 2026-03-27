"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, ChevronRight, LogIn, User, ExternalLink, 
  PenSquare, X, Camera, Save, Loader2, Github, 
  Twitter, Instagram, MapPin, Link as LinkIcon, 
  Calendar, MoreHorizontal, Compass, ShoppingBag, 
  LayoutDashboard, Settings, Mail
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Logo from "./Logo";

const navItems = [
  { icon: Logo, label: "Home", href: "/", badge: null },
  { icon: Compass, label: "Explore", href: "/explore", badge: null },
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", badge: null },
  { icon: ShoppingBag, label: "Marketplace", href: "/marketplace", badge: "Live" },
  { icon: Bell, label: "Notifications", href: "/notifications", badge: null },
];

const systemItems = [
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function NeonSidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const user = session?.user;
  const isLoading = status === "loading";

  const displayName = user?.name || "Anonymous User";
  const displayUsername = (user as any)?.username || "Anonymous";
  const avatarUrl = (user as any)?.avatarUrl || user?.image;

  return (
    <>
      <aside className="hidden lg:flex flex-col w-[260px] h-screen fixed left-0 top-0 bg-[#050505] border-r border-white/5 z-50 overflow-y-auto scrollbar-none">
        
        {/* LOGO */}
        <div className="p-8">
          <Link href="/" className="flex items-center gap-3 group">
            <Logo className="w-10 h-10 group-hover:scale-110 transition-transform" />
            <div className="flex flex-col">
              <span className="text-lg font-black italic uppercase tracking-tighter text-white">Debugr</span>
              <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-[0.4em] -mt-1">Intelligence</span>
            </div>
          </Link>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-4 px-4 py-4 rounded-3xl transition-all group ${
                    isActive ? "bg-white/[0.03] border border-white/5 text-white" : "text-zinc-500 hover:text-white hover:bg-white/[0.01]"
                  }`}
                >
                  <item.icon className={`w-6 h-6 flex-shrink-0 ${isActive ? "text-violet-400" : "group-hover:text-violet-400 transition-colors"}`} />
                  <span className={`text-[16px] font-black uppercase tracking-tight ${isActive ? "" : "opacity-60"}`}>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto text-[9px] font-black uppercase tracking-widest bg-violet-500/20 text-violet-300 border border-violet-500/30 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </motion.div>
              </Link>
            );
          })}

          <div className="nn-divider my-6 opacity-30" />

          <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] mb-4 px-4">Registry</p>
          {systemItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center gap-4 px-4 py-4 rounded-3xl transition-all ${
                  isActive ? "bg-white/5 text-white shadow-2xl" : "text-zinc-500 hover:text-white"
                }`}>
                  <item.icon className="w-6 h-6 flex-shrink-0" />
                  <span className={`text-[16px] font-black uppercase tracking-tight ${isActive ? "" : "opacity-60"}`}>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* AUTH FOOTER */}
        <div className="p-4 border-t border-white/5 mb-8">
          {isLoading ? (
            <div className="flex items-center gap-3 p-4 bg-white/[0.01] rounded-[24px]">
              <div className="w-10 h-10 rounded-2xl bg-white/5 animate-spin" />
              <div className="flex-1 space-y-2">
                <div className="h-2 bg-white/5 rounded animate-pulse" />
                <div className="h-1.5 bg-white/5 rounded w-2/3 animate-pulse" />
              </div>
            </div>
          ) : user ? (
            <Link href="/profile">
              <div className="flex items-center gap-4 p-4 rounded-[24px] hover:bg-white/[0.03] border border-transparent hover:border-white/5 transition-all cursor-pointer group">
                <div className="w-10 h-10 rounded-2xl overflow-hidden bg-violet-500/10 border border-white/10 flex-shrink-0 relative">
                  {avatarUrl ? (
                    <Image src={avatarUrl} alt={displayName} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-5 h-5 text-violet-400/40" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-black text-white truncate uppercase tracking-tight">{displayName}</p>
                  <p className="text-[11px] font-bold text-zinc-700 truncate">@{displayUsername}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-800 group-hover:text-violet-400 transition-colors" />
              </div>
            </Link>
          ) : (
            <Link href="/login">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-4 p-4 rounded-[24px] bg-violet-600 hover:bg-violet-500 text-white shadow-2xl shadow-violet-600/20 transition-all cursor-pointer group"
              >
                <LogIn className="w-5 h-5 text-white" />
                <span className="text-[13px] font-black uppercase tracking-[0.2em]">Sign In</span>
              </motion.div>
            </Link>
          )}
        </div>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <div className="lg:hidden fixed bottom-6 left-6 right-6 z-50">
        <div className="flex items-center justify-around px-2 py-4 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-2xl">
          {navItems.slice(0, 4).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 transition-all ${isActive ? "text-violet-400" : "text-zinc-600"}`}>
                <item.icon className="w-6 h-6 px-1" />
                <span className="text-[9px] font-black uppercase tracking-widest">{item.label.slice(0, 4)}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
