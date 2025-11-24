import { getAdminApp } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const adminApp = getAdminApp();
    if (!adminApp) {
      console.error('❌ [Session API] Firebase Admin SDK not initialized');
      return NextResponse.json({ error: 'Firebase Admin SDK not initialized' }, { status: 500 });
    }

    const { idToken } = await request.json();
    if (!idToken) {
      console.error('❌ [Session API] Missing idToken');
      return NextResponse.json({ error: 'ID token is required' }, { status: 400 });
    }

    console.log('📥 [Session API] Received request to create session cookie');

    // Проверяем idToken и получаем информацию о пользователе
    const auth = getAuth(adminApp);
    const decodedToken = await auth.verifyIdToken(idToken);

    console.log('✅ [Session API] Verified idToken for user:', decodedToken.uid);

    // Создаем session cookie (срок действия 5 дней)
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

    console.log('✅ [Session API] Session cookie created');

    // Устанавливаем cookie
    const cookieStore = await cookies();
    cookieStore.set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expiresIn / 1000, // в секундах для maxAge
      path: '/',
      sameSite: 'lax',
    });

    console.log('✅ [Session API] Cookie set for user:', decodedToken.uid);

    return NextResponse.json({
      status: 'success',
      uid: decodedToken.uid,
      email: decodedToken.email,
    });

  } catch (error: any) {
    console.error('❌ [Session API] Error:', {
      code: error.code,
      message: error.message,
    });

    return NextResponse.json({
      error: 'Failed to create session',
      details: error.message,
      code: error.code,
    }, { status: 401 });
  }
}