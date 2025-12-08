import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith('/login') ||
                     req.nextUrl.pathname.startsWith('/register');
  const isProtectedPage = req.nextUrl.pathname.startsWith('/dashboard') ||
                          req.nextUrl.pathname.startsWith('/learn') ||
                          req.nextUrl.pathname.startsWith('/quiz') ||
                          req.nextUrl.pathname.startsWith('/pricing') ||
                          req.nextUrl.pathname.startsWith('/settings');

  // Redirect logged in users away from auth pages
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  // Redirect non-logged in users to login for protected pages
  if (isProtectedPage && !isLoggedIn) {
    const callbackUrl = encodeURIComponent(req.nextUrl.pathname);
    return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/learn/:path*',
    '/quiz/:path*',
    '/pricing/:path*',
    '/settings/:path*',
    '/login',
    '/register',
  ],
};
