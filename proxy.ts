import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  getClientIp,
  applyRateLimit,
  registerLimiter,
  loginLimiter,
} from '@/lib/rateLimit';

const protectedPaths = ['/diagnostic', '/api/diagnostic', '/api/profile', '/profile', '/results', '/admin'];
const authPages = ['/login', '/signup'];

export default auth((req: NextRequest & { auth?: unknown }) => {
  const { pathname } = req.nextUrl;

  // --- Rate limiting for auth routes (IP-keyed, before auth logic) ---
  if (req.method === 'POST') {
    const ip = getClientIp(req);

    if (pathname === '/api/auth/register') {
      const blocked = applyRateLimit(registerLimiter, ip);
      if (blocked) return blocked;
    } else if (pathname.startsWith('/api/auth/')) {
      const blocked = applyRateLimit(loginLimiter, ip);
      if (blocked) return blocked;
    }
  }

  // --- Existing auth redirect logic (unchanged) ---
  const isLoggedIn = !!req.auth;

  // Redirect authenticated users away from auth pages
  if (isLoggedIn && authPages.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Protect routes — redirect to login with callbackUrl
  if (!isLoggedIn && protectedPaths.some((p) => pathname.startsWith(p))) {
    const loginUrl = new URL('/login', req.url);
    // Only store the relative path — never allow external redirect targets
    loginUrl.searchParams.set('callbackUrl', pathname + req.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  // Sanitize callbackUrl on auth pages — strip any absolute/external URLs
  if (authPages.some((p) => pathname.startsWith(p))) {
    const cbParam = req.nextUrl.searchParams.get('callbackUrl');
    if (cbParam && (/^https?:\/\//i.test(cbParam) || cbParam.startsWith('//'))) {
      const cleaned = new URL(req.url);
      cleaned.searchParams.delete('callbackUrl');
      return NextResponse.redirect(cleaned);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/diagnostic/:path*',
    '/api/diagnostic/:path*',
    '/api/profile/:path*',
    '/profile/:path*',
    '/results/:path*',
    '/admin/:path*',
    '/login',
    '/signup',
    '/api/auth/register',
    '/api/auth/:path*',
  ],
};
