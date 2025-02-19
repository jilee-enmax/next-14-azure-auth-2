import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import {
  isPublicRoute,
  redirectToSignIn,
  redirectToWelcome,
} from '@/utils/middleware.utils';
import { AuthenticatedNextRequest } from '@/types/middleware.types';
import Cookies from "js-cookie"; // ✅ Import Cookies for checking access tokens

// ✅ Ensure `/reset-password` is accessible without authentication
export const config = {
  matcher: [
    "/((?!api/get-ivr-token|api/register|api/auth|api/native-auth|api/forgot-password|api/update-display-name|_next/static|_next/image|favicon.ico).*)",
  ],
};


export default auth(async (req: AuthenticatedNextRequest) => {
  try {
    const { nextUrl } = req;
    const isAuthenticated = !!req.auth?.user || !!Cookies.get("accessToken"); 
    const isValidPublicRoute = isPublicRoute(nextUrl.pathname);

    console.log(`🔄 Checking authentication status...`);
    console.log(`🔹 Requested Path: ${nextUrl.pathname}`);
    console.log(`🔹 Is Public Route: ${isValidPublicRoute}`);
    console.log(`🔹 Is Authenticated: ${isAuthenticated}`);

    // ✅ Allow unauthenticated access to forgot/reset password API
    if (nextUrl.pathname.startsWith("/api/forgot-password") || nextUrl.pathname.startsWith("/reset-password")) {
      console.log("🔓 Allowing unauthenticated access to forgot/reset password API.");
      return NextResponse.next();
    }

    // ✅ Prevent Infinite Redirect Loops
    if (nextUrl.pathname === "/signin" && isAuthenticated) {
      console.log("✅ Already signed in, redirecting to Welcome...");
      return redirectToWelcome(nextUrl);
    }

    // ✅ Redirect authenticated users away from public routes (e.g., /signin)
    if (isValidPublicRoute && isAuthenticated) {
      console.log("✅ User is already authenticated. Redirecting to welcome page...");
      return redirectToWelcome(nextUrl);
    }

    // ✅ If user is not authenticated & trying to access a protected route → Redirect to Sign-in
    if (!isAuthenticated && !isValidPublicRoute) {
      console.warn("❌ User is not authenticated. Redirecting to Sign-In...");
      return redirectToSignIn(nextUrl);
    }

    console.log("✅ User is authorized. Proceeding...");
    return NextResponse.next();
  } catch (error) {
    console.error('❌ Error in middleware:', error);
    return redirectToSignIn(req.nextUrl);
  }
});
