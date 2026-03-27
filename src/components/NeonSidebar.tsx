"use client";

import { motion } from "framer-motion";
import {
  Zap, LayoutDashboard, ShoppingBag,
  Settings, Search, Bell,
  ChevronRight, LogIn, User, ExternalLink
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const navItems = [
  { icon: Zap, label: "Feed", href: "/", badge: null },
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", badge: null },
  { icon: ShoppingBag, label: "Marketplace", href: "/marketplace", badge: "New" },
];

const systemItems = [
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function NeonSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "Anonymous";
  const displayUsername = user?.user_metadata?.username || user?.email?.split("@")[0] || "user";
  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-[260px] nn-sidebar z-50">

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

        {/* SEARCH */}
        <div className="px-4 py-4 border-b border-white/5">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all text-zinc-500 hover:text-zinc-300">
            <Search className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-sm font-medium">Search...</span>
            <span className="ml-auto text-xs bg-white/5 px-1.5 py-0.5 rounded font-mono">⌘K</span>
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-none">
          <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-3 px-2">Navigation</p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 2 }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative ${
                    isActive
                      ? "bg-violet-500/10 border border-violet-500/20 text-white shadow-[0_0_20px_rgba(124,58,237,0.1)]"
                      : "text-zinc-500 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-violet-400" : "group-hover:text-violet-400 transition-colors"}`} />
                  <span className="text-[13.5px] font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto text-[9px] font-bold uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30 px-1.5 py-0.5 rounded-md">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-violet-400 rounded-full shadow-[0_0_10px_rgba(167,139,250,0.8)]"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}

          <div className="nn-divider my-4" />

          <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-3 px-2">System</p>
          {systemItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive ? "bg-violet-500/10 text-white border border-violet-500/20" : "text-zinc-600 hover:text-white hover:bg-white/[0.04]"
                }`}>
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-[13.5px] font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* AUTH FOOTER */}
        <div className="p-4 border-t border-white/5">
          {loading ? (
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
