import { auth } from '@/auth';
import { NextResponse } from 'next/server';

const protectedPaths = ['/diagnostic', '/api/diagnostic', '/api/profile', '/profile'];
const authPages = ['/login', '/signup'];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Redirect authenticated users away from auth pages
  if (isLoggedIn && authPages.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Protect routes — redirect to login with callbackUrl
  if (!isLoggedIn && protectedPaths.some((p) => pathname.startsWith(p))) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname + req.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/diagnostic/:path*',
    '/api/diagnostic/:path*',
    '/api/profile/:path*',
    '/profile/:path*',
    '/login',
    '/signup',
  ],
};
