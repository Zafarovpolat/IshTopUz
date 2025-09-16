
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Удаляем cookie, устанавливая его с истекшим сроком действия
    cookies().set('session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: -1, // Немедленно истекает
      path: '/',
    });

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('Error during sign out:', error);
    return NextResponse.json({ error: 'Failed to sign out' }, { status: 500 });
  }
}
