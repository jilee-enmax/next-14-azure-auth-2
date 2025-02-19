import { NextResponse } from 'next/server';

// ✅ Add `/reset-password` to the list of public routes
const PUBLIC_ROUTES = [
  '/signin',
  '/signup',
  '/ivr',
  '/forgot-password',
];

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.includes(pathname);
}

// ✅ Reusable Redirection Function
export function redirectTo(path: string, nextUrl: URL) {
  return NextResponse.redirect(new URL(path, nextUrl.origin));
}

// ✅ Redirect to Sign In Page
export function redirectToSignIn(nextUrl: URL) {
  return redirectTo('/signin', nextUrl);
}

// ✅ Redirect to Welcome Page
export function redirectToWelcome(nextUrl: URL) {
  return redirectTo('/', nextUrl);
}

// ✅ Redirect to Sign Up Page
export function redirectToSignUp(nextUrl: URL) {
  return redirectTo('/signup', nextUrl);
}

// ✅ Redirect to Forgot Password Page
export function redirectForgotPassword(nextUrl: URL) {
  return redirectTo('/forgot-password', nextUrl);
}

