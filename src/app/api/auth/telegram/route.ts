// app/api/auth/telegram/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Замените на токен вашего бота
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

function verifyTelegramAuth(data: TelegramUser): boolean {
  const { hash, ...userData } = data;
  
  // Создаем строку для проверки
  const dataCheckString = Object.keys(userData)
    .sort()
    .map(key => `${key}=${userData[key as keyof typeof userData]}`)
    .join('\n');
  
  // Создаем секретный ключ
  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(BOT_TOKEN!)
    .digest();
  
  // Проверяем hash
  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');
  
  return calculatedHash === hash;
}

export async function POST(request: NextRequest) {
  try {
    const telegramData: TelegramUser = await request.json();
    
    // Проверяем валидность данных от Telegram
    if (!verifyTelegramAuth(telegramData)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Telegram data' },
        { status: 400 }
      );
    }
    
    // Проверяем, что данные не слишком старые (не больше 1 дня)
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime - telegramData.auth_date > 86400) {
      return NextResponse.json(
        { success: false, error: 'Auth data is too old' },
        { status: 400 }
      );
    }
    
    // Здесь вы можете:
    // 1. Создать пользователя в вашей базе данных
    // 2. Создать JWT токен
    // 3. Установить куки сессии
    // 4. Интегрироваться с Firebase Auth (создать custom token)
    // Пример создания custom token для Firebase:
    /*
    const admin = require('firebase-admin');
    const customToken = await admin.auth().createCustomToken(telegramData.id.toString(), {
      telegram_id: telegramData.id,
      first_name: telegramData.first_name,
      last_name: telegramData.last_name,
      username: telegramData.username,
      photo_url: telegramData.photo_url,
      provider: 'telegram'
    });
    */
    
    // Временное решение - возвращаем успех
    console.log('Telegram user authenticated:', telegramData);
    
    return NextResponse.json({
      success: true,
      user: {
        id: telegramData.id,
        name: telegramData.first_name + (telegramData.last_name ? ` ${telegramData.last_name}` : ''),
        username: telegramData.username,
        photo: telegramData.photo_url,
        provider: 'telegram'
      }
    });
    
  } catch (error) {
    console.error('Telegram auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}