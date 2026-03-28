"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect, useTransition } from "react";
import {
  User, AtSign, MapPin, Globe, Github, Twitter, Instagram,
  Save, Loader2, AlertCircle, Palette, Shield, LogOut,
  CheckCircle2, ChevronRight, Camera, Mail, Lock, Eye, Smartphone,
  Bell, MessageCircle, HelpCircle, ExternalLink
} from "lucide-react";
import { updateUserProfile, syncUser } from "@/app/actions";
import { useTheme } from "@/components/ThemeContext";
import toast from "react-hot-toast";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Tab = "account" | "appearance" | "privacy" | "notifications" | "contact";

export default function SettingsPage() {
  const { data: session, update, status } = useSession();
  const { theme, setTheme } = useTheme();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<Tab>("account");
  const [connectedProviders, setConnectedProviders] = useState<string[]>([]);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const [form, setForm] = useState({
    name: "",
    username: "",
    bio: "",
    location: "",
    website: "",
    githubProfile: "",
    xProfile: "",
    instagramProfile: "",
    expertise: "",
  });

  // Load from DB on mount
  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) return;

    const load = async () => {
      const [prismaUser, accountsRes] = await Promise.all([
        syncUser(),
        fetch("/api/user/accounts").then((r) => r.json()).catch(() => ({ accounts: [] })),
      ]);
      if (prismaUser) {
        setForm({
          name: (prismaUser as any).name || "",
          username: (prismaUser as any).username || "",
          bio: (prismaUser as any).bio || "",
          location: (prismaUser as any).location || "",
          website: (prismaUser as any).website || "",
          githubProfile: (prismaUser as any).githubProfile || "",
          xProfile: (prismaUser as any).xProfile || "",
          instagramProfile: (prismaUser as any).instagramProfile || "",
          expertise: (prismaUser as any).expertise || "",
        });
      }
      setConnectedProviders(accountsRes.accounts || []);
    };
    load();
  }, [session, status]);

  // Username availability check
  useEffect(() => {
    if (!form.username || form.username === (session?.user as any)?.username) {
      setUsernameAvailable(null);
      return;
    }
    setCheckingUsername(true);
    const t = setTimeout(async () => {
      const res = await fetch(`/api/check-username?username=${form.username}`).then((r) => r.json()).catch(() => ({ available: false }));
      setUsernameAvailable(res.available);
      setCheckingUsername(false);
    }, 500);
    return () => clearTimeout(t);
  }, [form.username]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      const result = await updateUserProfile(data);
      if (result.success) {
        toast.success("Profile saved");
        await update({ ...session, user: { ...session?.user, name: form.name } });
      } else {
        toast.error(result.error || "Failed to save");
      }
    });
  };

  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="w-12 h-12 text-zinc-700" />
        <p className="text-zinc-500 text-sm">Please sign in to access settings</p>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "account", label: "Account", icon: <Shield className="w-4 h-4" /> },
    { id: "appearance", label: "Appearance", icon: <Palette className="w-4 h-4" /> },
    { id: "privacy", label: "Privacy", icon: <Eye className="w-4 h-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
    { id: "contact", label: "Contact Us", icon: <MessageCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-2xl mx-auto pb-32">
      {/* Header */}
      <div className="px-4 py-6 border-b border-white/5">
        <h1 className="text-xl font-black text-white">Settings</h1>
      </div>

      {/* Tab nav — Instagram style */}
      <div className="flex border-b border-white/5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 flex flex-col items-center gap-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative",
              activeTab === tab.id ? "text-white" : "text-zinc-600 hover:text-zinc-400"
            )}
          >
            {tab.icon}
            <span className="hidden sm:block">{tab.label}</span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-violet-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="px-4 py-8">
        {/* ── ACCOUNT ── */}
        {activeTab === "account" && (
          <div className="space-y-6">
            <div>
              <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-4">Connected Accounts</p>
              <div className="space-y-3">
                {/* Google */}
                <div className={cn(
                  "flex items-center justify-between p-4 rounded-2xl border transition-all",
                  connectedProviders.includes("google") ? "bg-emerald-500/5 border-emerald-500/20" : "bg-white/[0.02] border-white/5"
                )}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                      <Image src="https://www.google.com/favicon.ico" alt="Google" width={18} height={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Google</p>
                      <p className={cn("text-[10px] font-bold uppercase tracking-widest", connectedProviders.includes("google") ? "text-emerald-400" : "text-zinc-600")}>
                        {connectedProviders.includes("google") ? "✓ Connected" : "Not connected"}
                      </p>
                    </div>
                  </div>
                  {!connectedProviders.includes("google") && (
                    <button onClick={() => signIn("google")} className="px-4 py-2 bg-white/5 hover:bg-white hover:text-black rounded-full text-[10px] font-black text-zinc-400 uppercase tracking-widest transition-all">
                      Connect
                    </button>
                  )}
                </div>

                {/* GitHub */}
                <div className={cn(
                  "flex items-center justify-between p-4 rounded-2xl border transition-all",
                  connectedProviders.includes("github") ? "bg-emerald-500/5 border-emerald-500/20" : "bg-white/[0.02] border-white/5"
                )}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center flex-shrink-0 border border-white/10">
                      <Github className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">GitHub</p>
                      <p className={cn("text-[10px] font-bold uppercase tracking-widest", connectedProviders.includes("github") ? "text-emerald-400" : "text-zinc-600")}>
                        {connectedProviders.includes("github") ? "✓ Connected" : "Not connected"}
                      </p>
                    </div>
                  </div>
                  {!connectedProviders.includes("github") && (
                    <button onClick={() => signIn("github")} className="px-4 py-2 bg-white/5 hover:bg-white hover:text-black rounded-full text-[10px] font-black text-zinc-400 uppercase tracking-widest transition-all">
                      Connect
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-6">
              <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-4">Account Info</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                  <Mail className="w-4 h-4 text-zinc-500" />
                  <div>
                    <p className="text-[10px] text-zinc-600 uppercase tracking-widest">Email</p>
                    <p className="text-sm text-white font-medium">{session.user.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-6 space-y-3">
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center gap-3 p-4 rounded-2xl text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all text-sm font-bold"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
              <button className="w-full flex items-center gap-3 p-4 rounded-2xl text-zinc-600 hover:bg-red-500/5 border border-transparent hover:border-red-500/20 transition-all text-sm font-bold">
                <AlertCircle className="w-4 h-4" />
                Deactivate Account
              </button>
            </div>
          </div>
        )}

        {/* ── APPEARANCE ── */}
        {activeTab === "appearance" && (
          <div className="space-y-6">
            <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">Theme</p>
            <div className="space-y-3">
              {[
                { id: "dark", label: "Dark", desc: "Pure black — easy on the eyes", preview: "bg-zinc-950 border-zinc-800" },
                { id: "glass", label: "Glass", desc: "Frosted translucent — iOS style", preview: "bg-violet-950/40 border-violet-500/30 backdrop-blur" },
                { id: "light", label: "Light", desc: "Clean white — bright and clear", preview: "bg-white border-zinc-200" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as any)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left",
                    theme === t.id ? "border-violet-500 bg-violet-500/5" : "border-white/5 bg-white/[0.02] hover:border-white/10"
                  )}
                >
                  <div className={cn("w-10 h-10 rounded-xl border flex-shrink-0", t.preview)} />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">{t.label}</p>
                    <p className="text-[11px] text-zinc-500">{t.desc}</p>
                  </div>
                  {theme === t.id && <CheckCircle2 className="w-5 h-5 text-violet-400 flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── PRIVACY ── */}
        {activeTab === "privacy" && (
          <div className="space-y-6">
            <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">Privacy Settings</p>
            <div className="space-y-3">
              <ToggleRow
                label="Public Profile"
                desc="Anyone can see your posts and prompts"
                defaultOn={true}
              />
              <ToggleRow
                label="Show in Search"
                desc="Your profile appears in search results"
                defaultOn={true}
              />
              <ToggleRow
                label="Activity Status"
                desc="Show when you were last active"
                defaultOn={false}
              />
            </div>

            <div className="border-t border-white/5 pt-6">
              <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-4">Security</p>
              <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-4 h-4 text-violet-400" />
                  <div>
                    <p className="text-sm font-bold text-white">Two-Factor Authentication</p>
                    <p className="text-[11px] text-zinc-500">Add an extra layer of security</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-[10px] font-black text-zinc-400 uppercase tracking-widest transition-all">
                  Enable
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

        {/* ── NOTIFICATIONS ── */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">Notification Preferences</p>
            <div className="space-y-3">
              <ToggleRow label="New Followers" desc="When someone follows you" defaultOn={true} />
              <ToggleRow label="Post Likes" desc="When someone likes your post" defaultOn={true} />
              <ToggleRow label="Comments" desc="When someone comments on your post" defaultOn={true} />
              <ToggleRow label="Prompt Sales" desc="When someone buys your prompt" defaultOn={true} />
              <ToggleRow label="Mentions" desc="When someone mentions you" defaultOn={true} />
              <ToggleRow label="Bounty Updates" desc="Updates on bounties you posted" defaultOn={false} />
            </div>

            <div className="border-t border-white/5 pt-6">
              <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-4">Email Notifications</p>
              <div className="space-y-3">
                <ToggleRow label="Weekly Digest" desc="A summary of your activity each week" defaultOn={false} />
                <ToggleRow label="Marketplace Updates" desc="New prompts in categories you follow" defaultOn={false} />
                <ToggleRow label="Security Alerts" desc="Sign-ins from new devices" defaultOn={true} />
              </div>
            </div>
          </div>
        )}

        {/* ── CONTACT US ── */}
        {activeTab === "contact" && (
          <div className="space-y-6">
            <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">Get in Touch</p>

            {/* Email support card */}
            <a
              href="mailto:work.debugr@gmail.com"
              className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] hover:border-violet-500/20 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Email Support</p>
                  <p className="text-[11px] text-zinc-500">work.debugr@gmail.com</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-zinc-700 group-hover:text-white transition-colors" />
            </a>

            {/* Report a bug */}
            <a
              href="mailto:work.debugr@gmail.com?subject=Bug Report"
              className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] hover:border-rose-500/20 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Report a Bug</p>
                  <p className="text-[11px] text-zinc-500">Found something broken? Let us know</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-zinc-700 group-hover:text-white transition-colors" />
            </a>

            {/* Legal links */}
            <div className="border-t border-white/5 pt-6 space-y-3">
              <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-2">Legal</p>
              <a href="/terms" className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/[0.02] transition-all group">
                <p className="text-sm text-zinc-400 group-hover:text-white transition-colors">Terms of Service</p>
                <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-white transition-colors" />
              </a>
              <a href="/privacy" className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/[0.02] transition-all group">
                <p className="text-sm text-zinc-400 group-hover:text-white transition-colors">Privacy Policy</p>
                <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-white transition-colors" />
              </a>
            </div>

            <div className="border-t border-white/5 pt-6 text-center">
              <p className="text-[10px] text-zinc-700 uppercase tracking-widest">Debugr v1.0 · © 2026</p>
              <p className="text-[10px] text-zinc-800 mt-1">Made with ❤️ by Saurabh & Dennis</p>
            </div>
          </div>
        )}
        .settings-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 14px;
          color: var(--text-primary, #f0f0ff);
          outline: none;
          transition: border-color 0.2s;
        }
        .settings-input:focus {
          border-color: rgba(124,58,237,0.5);
        }
        .settings-input::placeholder {
          color: #374151;
        }
        [data-theme="light"] .settings-input {
          background: rgba(0,0,0,0.04);
          border-color: rgba(0,0,0,0.1);
          color: #0f0f1a;
        }
        [data-theme="light"] .settings-input::placeholder {
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}

function Field({ label, icon, hint, hintColor, children }: {
  label: string;
  icon: React.ReactNode;
  hint?: string;
  hintColor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between px-1">
        <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
          {icon} {label}
        </label>
        {hint && <span className={cn("text-[10px] font-bold", hintColor)}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function ToggleRow({ label, desc, defaultOn }: { label: string; desc: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5">
      <div>
        <p className="text-sm font-bold text-white">{label}</p>
        <p className="text-[11px] text-zinc-500">{desc}</p>
      </div>
      <button
        onClick={() => setOn(!on)}
        className={cn("w-12 h-6 rounded-full relative transition-colors", on ? "bg-violet-600" : "bg-zinc-700")}
      >
        <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all", on ? "right-1" : "left-1")} />
      </button>
    </div>
  );
}
