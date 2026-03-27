import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        
        // Optionally fetch extra data from DB here
        // const dbUser = await prisma.user.findUnique({ where: { id: token.sub } });
        // if (dbUser) session.user.username = dbUser.username;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
})
