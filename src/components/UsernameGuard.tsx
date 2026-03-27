"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function UsernameGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const checkUsername = async () => {
      // Skip for auth-related pages to avoid infinite loops
      const publicPaths = ["/login", "/signup", "/choose-username", "/auth/callback"];
      if (publicPaths.some(path => pathname.startsWith(path))) {
        setLoading(false);
        return;
      }

      if (status === "unauthenticated") {
        setLoading(false);
        return;
      }

      if (session?.user?.id) {
        try {
          const res = await fetch(`/api/user?id=${session.user.id}`);
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
      } else if (status === "authenticated") {
        // User identity is missing but authenticated? Should not happen often with auth()
        setLoading(false);
      }
    };

    if (status !== "loading") {
      checkUsername();
    }
  }, [pathname, session, status, router]);

  if ((loading || status === "loading") && !["/login", "/signup", "/choose-username"].includes(pathname)) {
    return (
      <div className="fixed inset-0 bg-[#050505] z-[9999] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-white/5 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
