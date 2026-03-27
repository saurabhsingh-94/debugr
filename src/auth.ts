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
        
        // Fetch fresh data from DB for professional status
        const dbUser = await prisma.user.findUnique({ 
          where: { id: token.sub },
          select: { 
            username: true, 
            isProfessional: true, 
            professionalStatus: true 
          }
        });
        
        if (dbUser) {
          (session.user as any).username = dbUser.username;
          (session.user as any).isProfessional = dbUser.isProfessional;
          (session.user as any).professionalStatus = dbUser.professionalStatus;
        }
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
