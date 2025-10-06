
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

  const protectedPaths = ['/dashboard', '/onboarding', '/marketplace', '/talents'];
  const isProtectedPath = protectedPaths.some(p => pathname.startsWith(p));
  
  // Если пользователь не авторизован и пытается зайти на защищенный роут,
  // но это не главная страница биржи или талантов (они должны быть доступны публично)
  // то перенаправляем на авторизацию
  if (!sessionCookie && isProtectedPath && !['/marketplace', '/talents', '/jobs'].includes(pathname) && !pathname.startsWith('/marketplace/jobs')) {
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
      
      // Для всех остальных случаев, включая /marketplace и /talents,
      // просто добавляем заголовок и продолжаем
      return NextResponse.next({
          request: {
              headers: requestHeaders,
          },
      });

    } else {
      // Если кука есть, но она невалидна
      const response = NextResponse.redirect(new URL('/auth', request.url));
      response.cookies.set('session', '', { maxAge: -1 });
      return response;
    }
  }

  // Если куки нет и это не защищенный роут, просто продолжаем
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding', '/auth', '/marketplace/:path*', '/talents', '/jobs'],
};
