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
        
        // Fetch fresh data from DB for professional status and email reliability
        const dbUser = await prisma.user.findUnique({ 
          where: { id: token.sub },
          select: { 
            email: true,
            username: true, 
            isProfessional: true, 
            professionalStatus: true,
            isAdmin: true
          }
        });
        
        if (dbUser) {
          session.user.email = dbUser.email || session.user.email;
          (session.user as any).username = dbUser.username;
          (session.user as any).isProfessional = dbUser.isProfessional;
          (session.user as any).professionalStatus = dbUser.professionalStatus;
          (session.user as any).isAdmin = dbUser.isAdmin;
        }
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id;
        token.username = (user as any).username;
      }
      
      // Update token if username is changed during session
      if (trigger === "update" && session?.username) {
        token.username = session.username;
      }

      return token;
    },
  },
})
