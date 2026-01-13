import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"
import createMiddleware from 'next-intl/middleware';
import { routing } from './navigation';

const intlMiddleware = createMiddleware(routing);

export default NextAuth(authConfig).auth((req) => {
  return intlMiddleware(req);
});

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|.*\\..*).*)', '/', '/(fr|en|pt)/:path*']
};
