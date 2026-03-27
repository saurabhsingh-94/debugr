"use client";

import { motion } from "framer-motion";
import { 
  Plus, 
  Activity, 
  Zap, 
  Network,
  Cpu,
  UserCircle,
  ShieldCheck,
  TrendingUp
} from "lucide-react";
import { useState, useEffect } from "react";
import { getUserByUsername } from "@/app/actions";
import ProfileClient from "@/components/ProfileClient";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function PublicProfilePage() {
  const { username } = useParams();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (typeof username === "string") {
        const data = await getUserByUsername(username);
        if (data) setUser(data);
      }
      setIsLoading(false);
    };
    fetchUser();
  }, [username]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-10 h-10 border-2 border-white/5 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
        <div className="p-6 bg-white/5 border border-white/10 rounded-full">
           <UserCircle className="w-12 h-12 text-zinc-800" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">User Not Found</h1>
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">This user profile could not be found.</p>
        </div>
        <button onClick={() => window.history.back()} className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Return Home</button>
      </div>
    );
  }

  const stats = [
    { label: "Detected Signals", value: "14" },
    { label: "Solved Bounties", value: "03" },
    { label: "Trust Score", value: "92%" },
  ];

  const profileData = {
    name: user.name || "Unidentified Agent",
    email: user.email,
    avatarUrl: user.avatarUrl || user.image,
    bio: user.bio,
    github: user.githubProfile,
    x: user.xProfile,
    instagram: user.instagramProfile,
    username: user.username,
  };

  return (
    <div className="space-y-12">
       <ProfileClient 
          user={profileData} 
          stats={stats} 
          problems={[]} 
          isPublic={true}
       />
    </div>
  );
}
