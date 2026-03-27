"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { syncUser, updateUserProfile } from "@/app/actions";

type Theme = "dark" | "light" | "glass";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("glass");
  const supabase = createClient();

  useEffect(() => {
    const fetchTheme = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch from Prisma via syncUser to get current theme
        const res = await fetch(`/api/user?id=${user.id}`);
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
  }, [supabase.auth]);

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    
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
