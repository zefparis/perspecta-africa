import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: '/auth/signin',
    newUser: '/auth/signup',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.includes('/profile') || nextUrl.pathname.includes('/assessment');
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        // @ts-ignore
        token.locale = user.locale
      }
      return token
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        // @ts-ignore
        session.user.locale = token.locale as string
      }
      return session
    }
  },
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig
