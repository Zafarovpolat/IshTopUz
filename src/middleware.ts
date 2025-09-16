import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAdminApp } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';

async function verifySessionCookie(sessionCookie: string) {
  const adminApp = getAdminApp();
  if (!adminApp) {
    console.error("Middleware: Firebase Admin SDK not initialized.");
    return null;
  }
  try {
    const decodedClaims = await getAuth(adminApp).verifySessionCookie(sessionCookie, true);
    return decodedClaims;
  } catch (error) {
    console.log("Middleware: Failed to verify session cookie:", error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith('/auth');
  const isDashboardPage = pathname.startsWith('/dashboard');

  if (!sessionCookie) {
    if (isDashboardPage) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }
    return NextResponse.next();
  }

  const decodedToken = await verifySessionCookie(sessionCookie);

  if (!decodedToken) {
    if (isDashboardPage) {
        const response = NextResponse.redirect(new URL('/auth', request.url));
        response.cookies.delete('session');
        return response;
    }
    return NextResponse.next();
  }

  if (isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', decodedToken.uid);
  requestHeaders.set('x-user-email', decodedToken.email || '');

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth'],
};