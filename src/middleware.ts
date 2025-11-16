import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  const protectedPaths = ['/dashboard', '/onboarding', '/set-password']; // ✅ ДОБАВЬ
  const isProtectedPath = protectedPaths.some(p => pathname.startsWith(p));

  // Если нет cookie и пытается зайти на защищенный роут
  if (!sessionCookie && isProtectedPath) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth';
    return NextResponse.redirect(url);
  }

  // Если есть cookie и пытается зайти на /auth
  if (sessionCookie && pathname === '/auth') {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // Для всех остальных случаев просто пропускаем
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding', '/auth', '/set-password'],
};