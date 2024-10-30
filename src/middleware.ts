import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  // Get the session token (if any)
  const token = await getToken({ req, secret });
  const { pathname } = req.nextUrl;

  // Define paths where the user should be redirected based on auth state
  const authRequiredPaths = ['/chats']; // Require authentication
  const openPaths = ['/', '/login', '/signup']; // Accessible when not signed in

  // 1. If user is not signed in and trying to access protected routes like /chats
  if (!token && authRequiredPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // 2. If user is signed in and trying to access public routes like /, /login, /signup
  // Ensure we don't redirect if they're already on /chats
  if (token && openPaths.some(path => pathname.startsWith(path))) {
    if (pathname !== '/chats') {
      return NextResponse.redirect(new URL('/chats', req.url));
    }
  }

  // Default behavior: proceed to the requested route
  return NextResponse.next();
}

// Match the routes where this middleware will be applied
export const config = {
  matcher: ['/', '/login', '/signup', '/chats/:path*'],
};
