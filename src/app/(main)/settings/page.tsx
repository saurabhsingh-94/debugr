"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect, useTransition } from "react";
import {
  User, AtSign, MapPin, Globe, Github, Twitter, Instagram,
  Save, Loader2, AlertCircle, Palette, Shield, LogOut,
  CheckCircle2, ChevronRight, Camera, Mail, Lock, Eye, Smartphone
} from "lucide-react";
import { updateUserProfile, syncUser } from "@/app/actions";
import { useTheme } from "@/components/ThemeContext";
import toast from "react-hot-toast";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Tab = "profile" | "account" | "appearance" | "privacy";

export default function SettingsPage() {
  const { data: session, update, status } = useSession();
  const { theme, setTheme } = useTheme();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
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
    { id: "profile", label: "Edit Profile", icon: <User className="w-4 h-4" /> },
    { id: "account", label: "Account", icon: <Shield className="w-4 h-4" /> },
    { id: "appearance", label: "Appearance", icon: <Palette className="w-4 h-4" /> },
    { id: "privacy", label: "Privacy", icon: <Eye className="w-4 h-4" /> },
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
        {/* ── EDIT PROFILE ── */}
        {activeTab === "profile" && (
          <form onSubmit={handleSave} className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4 pb-6 border-b border-white/5">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-900 border border-white/10 relative flex-shrink-0">
                {session.user.image ? (
                  <Image src={session.user.image} alt="avatar" fill className="object-cover" />
                ) : (
                  <User className="w-8 h-8 text-zinc-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{form.username || session.user.name}</p>
                <button type="button" className="text-[12px] text-violet-400 font-bold hover:text-violet-300 transition-colors mt-1">
                  Change photo
                </button>
              </div>
            </div>

            <Field label="Name" icon={<User className="w-4 h-4" />}>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                className="settings-input"
              />
            </Field>

            <Field
              label="Username"
              icon={<AtSign className="w-4 h-4" />}
              hint={
                checkingUsername ? "Checking..." :
                usernameAvailable === true ? "✓ Available" :
                usernameAvailable === false ? "✗ Already taken" : undefined
              }
              hintColor={usernameAvailable === true ? "text-emerald-400" : "text-rose-400"}
            >
              <input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") })}
                placeholder="username"
                className="settings-input"
              />
            </Field>

            <Field label="Bio" icon={<User className="w-4 h-4" />}>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Tell people about yourself"
                rows={3}
                className="settings-input resize-none"
              />
            </Field>

            <Field label="Location" icon={<MapPin className="w-4 h-4" />}>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="City, Country"
                className="settings-input"
              />
            </Field>

            <Field label="Website" icon={<Globe className="w-4 h-4" />}>
              <input
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="https://yoursite.com"
                type="url"
                className="settings-input"
              />
            </Field>

            <Field label="Expertise" icon={<User className="w-4 h-4" />}>
              <input
                value={form.expertise}
                onChange={(e) => setForm({ ...form, expertise: e.target.value })}
                placeholder="e.g. React, AI, Design (comma separated)"
                className="settings-input"
              />
            </Field>

            <div className="pt-2 border-t border-white/5">
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Social Links</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Github className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                  <input value={form.githubProfile} onChange={(e) => setForm({ ...form, githubProfile: e.target.value })} placeholder="GitHub username" className="settings-input" />
                </div>
                <div className="flex items-center gap-3">
                  <Twitter className="w-4 h-4 text-sky-500 flex-shrink-0" />
                  <input value={form.xProfile} onChange={(e) => setForm({ ...form, xProfile: e.target.value })} placeholder="X (Twitter) username" className="settings-input" />
                </div>
                <div className="flex items-center gap-3">
                  <Instagram className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <input value={form.instagramProfile} onChange={(e) => setForm({ ...form, instagramProfile: e.target.value })} placeholder="Instagram username" className="settings-input" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-black rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </form>
        )}

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

      <style jsx>{`
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
