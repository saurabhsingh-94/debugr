"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ProfileClient from "@/components/ProfileClient";
import { syncUser } from "@/app/actions";
import { ZapOff } from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [prismaUser, setPrismaUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [prompts, setPrompts] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const sessionUser = session?.user;

  useEffect(() => {
    if (status === "loading") return;
    if (!sessionUser?.id) { setLoading(false); return; }

    const fetchAll = async () => {
      try {
        const [pUser, postsRes, promptsRes, bookmarksRes] = await Promise.all([
          syncUser(),
          fetch(`/api/user/${sessionUser.id}/posts`).then((r) => r.json()),
          fetch(`/api/user/${sessionUser.id}/prompts`).then((r) => r.json()),
          fetch(`/api/user/bookmarks`).then((r) => r.json()),
        ]);
        setPrismaUser(pUser);
        setPosts(Array.isArray(postsRes) ? postsRes : postsRes.posts || []);
        setPrompts(Array.isArray(promptsRes) ? promptsRes : promptsRes.prompts || []);
        setBookmarks(Array.isArray(bookmarksRes) ? bookmarksRes : bookmarksRes.posts || []);
      } catch (e) {
        console.error("Profile fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [sessionUser, status]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-white/5 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!sessionUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <ZapOff className="w-16 h-16 text-zinc-800 mb-8" />
        <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4">Sign in required</h1>
        <p className="text-zinc-600 text-xs font-black uppercase tracking-[0.3em]">Please sign in to view your profile</p>
      </div>
    );
  }

  const profileData = {
    name: prismaUser?.name || sessionUser?.name || "Anonymous",
    email: sessionUser.email!,
    avatarUrl: prismaUser?.avatarUrl || sessionUser?.image || null,
    bio: prismaUser?.bio || null,
    githubProfile: prismaUser?.githubProfile,
    xProfile: prismaUser?.xProfile,
    instagramProfile: prismaUser?.instagramProfile,
    username: prismaUser?.username,
    location: prismaUser?.location,
    website: prismaUser?.website,
    createdAt: prismaUser?.createdAt,
    isProfessional: prismaUser?.isProfessional,
    professionalStatus: prismaUser?.professionalStatus,
    expertise: prismaUser?.expertise,
    gender: prismaUser?.gender,
    isPrivate: prismaUser?.isPrivate,
  };

  const stats = {
    followersCount: 0,
    followingCount: 0,
  };

  return (
    <ProfileClient
      user={profileData}
      stats={stats}
      problems={posts}
      prompts={prompts}
      bookmarks={bookmarks}
    />
  );
}
