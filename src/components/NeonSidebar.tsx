"use client";

import { motion } from "framer-motion";
import {
  Zap, LayoutDashboard, ShoppingBag, Settings, Search, Bell,
  ChevronRight, LogIn, User, ExternalLink, PenSquare
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";

const navItems = [
  { icon: Zap, label: "Home", href: "/", badge: null },
  { icon: Search, label: "Explore", href: "/dashboard", badge: null },
  { icon: ShoppingBag, label: "Marketplace", href: "/marketplace", badge: "New" },
];

const systemItems = [
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function NeonSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user;
  const isLoading = status === "loading";

  // Session is handled by useSession automatically

  const displayName = user?.name || user?.email?.split("@")[0] || "Anonymous";
  const displayUsername = (user as any)?.username || user?.email?.split("@")[0] || "user";
  const avatarUrl = user?.image;

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-[240px] nn-sidebar z-50">

        {/* BRAND */}
        <div className="px-6 py-7 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 flex-shrink-0">
              <Image src="/logo.svg" alt="debugr" fill className="object-contain" />
              <div className="absolute inset-0 bg-violet-500/20 rounded-lg blur-lg group-hover:bg-violet-500/30 transition-all" />
            </div>
            <div>
              <span className="text-[15px] font-bold text-white tracking-tight">debugr</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
                <span className="text-[10px] text-violet-400/70 font-medium tracking-wide">live</span>
              </div>
            </div>
          </Link>
        </div>


        {/* NAV */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-none">
          <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-3 px-2">Navigation</p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-full transition-all group relative ${
                    isActive
                      ? "text-white"
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <item.icon className={`w-6 h-6 flex-shrink-0 ${isActive ? "text-violet-400 fill-violet-400/10" : "group-hover:text-violet-400 transition-colors"}`} />
                  <span className={`text-[17px] ${isActive ? "font-bold" : "font-semibold"}`}>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto text-[10px] font-bold uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30 px-1.5 py-0.5 rounded-md">
                      {item.badge}
                    </span>
                  )}
                </motion.div>
              </Link>
            );
          })}

          {/* Twitter-like Post Button */}
          <div className="mt-4 px-2">
            <button className="w-full py-3.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-bold text-[17px] shadow-[0_8px_20px_rgba(124,58,237,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2">
              <PenSquare className="w-5 h-5 lg:hidden xl:block" />
              <span className="lg:hidden xl:block">Post</span>
            </button>
          </div>

          <div className="nn-divider my-4" />

          <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-3 px-2">System</p>
          {systemItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all ${
                  isActive ? "text-white" : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                }`}>
                  <item.icon className={`w-6 h-6 flex-shrink-0 ${isActive ? "text-white fill-white/10" : ""}`} />
                  <span className={`text-[17px] ${isActive ? "font-bold" : "font-semibold"}`}>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* AUTH FOOTER */}
        <div className="p-4 border-t border-white/5">
          {isLoading ? (
            <div className="flex items-center gap-3 p-2">
              <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
              <div className="flex-1 space-y-1.5">
                <div className="h-2.5 bg-white/5 rounded animate-pulse" />
                <div className="h-2 bg-white/5 rounded w-2/3 animate-pulse" />
              </div>
            </div>
          ) : user ? (
            /* LOGGED IN — show user card */
            <Link href="/profile">
              <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-violet-500/5 hover:border hover:border-violet-500/10 border border-transparent transition-all cursor-pointer group">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-violet-500/20 border border-violet-500/30 flex-shrink-0">
                  {avatarUrl ? (
                    <Image src={avatarUrl} alt={displayName} width={32} height={32} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-4 h-4 text-violet-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-white truncate">{displayName}</p>
                  <p className="text-[11px] text-zinc-600 truncate">@{displayUsername}</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-violet-400 transition-colors" />
              </div>
            </Link>
          ) : (
            /* NOT LOGGED IN — show sign in button */
            <Link href="/login">
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-violet-500/10 border border-violet-500/25 hover:bg-violet-500/15 hover:border-violet-500/40 hover:shadow-[0_0_20px_rgba(124,58,237,0.15)] transition-all cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <LogIn className="w-3.5 h-3.5 text-violet-400" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-white">Sign in</p>
                  <p className="text-[10px] text-zinc-600">Access your dashboard</p>
                </div>
                <ExternalLink className="w-3 h-3 text-zinc-700 group-hover:text-violet-400 transition-colors" />
              </motion.div>
            </Link>
          )}
        </div>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
        <div className="flex items-center justify-around px-4 py-3 bg-[#0c0c18]/90 backdrop-blur-xl border border-violet-500/20 rounded-2xl shadow-[0_0_40px_rgba(124,58,237,0.2)]">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 transition-all ${isActive ? "text-violet-400" : "text-zinc-600"}`}>
                <item.icon className="w-5 h-5" />
                <span className="text-[9px] font-medium">{item.label}</span>
              </Link>
            );
          })}
          {user ? (
            <Link href="/profile" className={`flex flex-col items-center gap-1 transition-all ${pathname === "/profile" ? "text-violet-400" : "text-zinc-600"}`}>
              <User className="w-5 h-5" />
              <span className="text-[9px] font-medium">Profile</span>
            </Link>
          ) : (
            <Link href="/login" className="flex flex-col items-center gap-1 text-zinc-600">
              <LogIn className="w-5 h-5" />
              <span className="text-[9px] font-medium">Sign in</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
