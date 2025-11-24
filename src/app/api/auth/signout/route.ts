import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const cookieStore = await cookies();

    // ✅ Удаляем session cookie
    cookieStore.delete('session');

    console.log('✅ Session cookie deleted');

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('❌ Error deleting session cookie:', error);
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}