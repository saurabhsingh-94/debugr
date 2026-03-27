"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { syncUser, updateUserProfile } from "@/app/actions";

type Theme = "dark" | "light" | "glass";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("glass");
  const { data: session } = useSession();

  useEffect(() => {
    const fetchTheme = async () => {
      if (session?.user?.id) {
        // Fetch from Prisma to get current theme
        const res = await fetch(`/api/user?id=${session.user.id}`);
        if (res.ok) {
          const prismaUser = await res.json();
          if (prismaUser.theme) {
            setThemeState(prismaUser.theme as Theme);
            document.documentElement.setAttribute("data-theme", prismaUser.theme);
          }
        }
      }
    };
    fetchTheme();
  }, [session]);

  const setTheme = async (newTheme: Theme) => {
    const applyTheme = () => {
      setThemeState(newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
    };

    if (typeof document !== 'undefined' && (document as any).startViewTransition) {
      (document as any).startViewTransition(applyTheme);
    } else {
      applyTheme();
    }
    
    // Persist to Prisma
    const formData = new FormData();
    formData.append("theme", newTheme);
    await updateUserProfile(formData);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
