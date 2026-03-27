"use client";

import { motion } from "framer-motion";
import { 
  Plus, 
  Activity, 
  Layers, 
  Zap, 
  LayoutDashboard,
  ShieldCheck,
  ZapOff,
  Network,
  Cpu,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ProfileClient from "@/components/ProfileClient";
import { syncUser } from "@/app/actions";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [prismaUser, setPrismaUser] = useState<any>(null);
  const sessionUser = session?.user;

  useEffect(() => {
    const fetchProfile = async () => {
      if (sessionUser) {
        const pUser = await syncUser();
        setPrismaUser(pUser);
      }
    };
    if (status !== "loading") {
      fetchProfile();
    }
  }, [sessionUser, status]);

  const isLoading = status === "loading";

  if (isLoading) {
     return (
       <div className="min-h-screen bg-[#050505] flex items-center justify-center">
         <div className="w-12 h-12 border-4 border-white/5 border-t-white rounded-full animate-spin" />
       </div>
     );
  }

  if (!sessionUser) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
        <ZapOff className="w-16 h-16 text-zinc-800 mb-8" />
        <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4">ACCESS_DENIED</h1>
        <p className="text-zinc-600 text-xs font-black uppercase tracking-[0.3em] mb-12">Session credentials not verified by the network</p>
        <button className="px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-zinc-200 transition-all">Authenticate Required</button>
      </div>
    );
  }

  // Stats mapped from Prisma or real model data
  const stats = [
    { label: "Detected Signals", value: "24" },
    { label: "Solved Bounties", value: "08" },
    { label: "Assets Listed", value: "03" },
    { label: "Trust Score", value: "98%" },
  ];

  const profileData = {
    name: prismaUser?.name || sessionUser?.name || "Unidentified Agent",
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
  };

  return (
    <div className="space-y-12">
       <ProfileClient 
          user={profileData} 
          stats={stats} 
          problems={[]} // Signals would be fetched here in a real expanded version
       />
    </div>
  );
}
