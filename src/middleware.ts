import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret });
  const { pathname } = req.nextUrl;

  // Define paths where the user should be redirected based on auth state
  const authRequiredPaths = ["/chats"]; // Require authentication
  const openPaths = ["/", "/login", "/signup"]; // Accessible when not signed in

  // 1. If the user is not signed in and trying to access protected routes like /chats
  if (!token && authRequiredPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/", req.url)); // Redirect to home or login page
  }

  // 2. If the user is signed in and trying to access public routes like /, /login, /signup
  // Allow any path under /chats (e.g., /chats/username) to pass through
  if (token && openPaths.some((path) => pathname.startsWith(path))) {
    if (!pathname.startsWith("/chats")) {
      // Only redirect if the path is not already under /chats
      return NextResponse.redirect(new URL("/chats", req.url)); // Redirect to /chats if signed in
    }
  }

  // Default behavior: proceed to the requested route
  return NextResponse.next();
}

// Match the routes where this middleware will be applied
export const config = {
  matcher: ["/", "/login", "/signup", "/chats/:path*"],
};
