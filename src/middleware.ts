import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAdminApp } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';

export const runtime = 'nodejs';

async function verifySessionCookie(sessionCookie: string) {
  const adminApp = getAdminApp();
  const auth = getAuth(adminApp);
  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    return decodedClaims;
  } catch (error) {
    console.error('Middleware: Error verifying session cookie:', error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  const protectedPaths = ['/dashboard', '/onboarding'];
  const isProtectedPath = protectedPaths.some(p => pathname.startsWith(p));

  if (!sessionCookie && isProtectedPath) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth';
    return NextResponse.redirect(url);
  }

  if (sessionCookie) {
    const decodedToken = await verifySessionCookie(sessionCookie);
    const requestHeaders = new Headers(request.headers);

    if (decodedToken) {
      requestHeaders.set('x-user-id', decodedToken.uid);
      
      if (pathname === '/auth') {
         const url = request.nextUrl.clone();
         url.pathname = '/dashboard';
         return NextResponse.redirect(url);
      }

    } else {
      // If the cookie is invalid, redirect to login and clear the cookie
      const response = NextResponse.redirect(new URL('/auth', request.url));
      response.cookies.set('session', '', { maxAge: -1 });
      return response;
    }
    
    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding', '/auth'],
};