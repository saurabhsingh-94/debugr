"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function UsernameGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUsername = async () => {
      // Skip for auth-related pages to avoid infinite loops
      const publicPaths = ["/login", "/signup", "/choose-username", "/auth/callback"];
      if (publicPaths.some(path => pathname.startsWith(path))) {
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/user?id=${user.id}`);
        if (res.ok) {
          const prismaUser = await res.json();
          if (!prismaUser.username && pathname !== "/choose-username") {
            router.push("/choose-username");
          }
        }
      } catch (err) {
        console.error("Username check failed", err);
      } finally {
        setLoading(false);
      }
    };

    checkUsername();
  }, [pathname, supabase.auth, router]);

  if (loading && !["/login", "/signup", "/choose-username"].includes(pathname)) {
    return (
      <div className="fixed inset-0 bg-[#050505] z-[9999] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-white/5 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
