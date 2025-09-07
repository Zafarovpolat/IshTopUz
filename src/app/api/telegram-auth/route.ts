import { NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';
import crypto from 'crypto';

// Парсим service account из .env (он хранится как строка JSON)
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

// Инициализируем Admin SDK только один раз
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

export async function POST(req: NextRequest) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return NextResponse.json({ error: 'Bot token not configured' }, { status: 500 });
  }

  const body = await req.json();
  const { id, first_name, last_name, username, photo_url, auth_date, hash } = body;

  // Проверка полноты данных
  if (!id || !auth_date || !hash) {
    return NextResponse.json({ error: 'Invalid Telegram data' }, { status: 400 });
  }

  // Верификация хэша (по документации Telegram)
  const dataCheckArr = [];
  if (auth_date) dataCheckArr.push(`auth_date=${auth_date}`);
  if (first_name) dataCheckArr.push(`first_name=${first_name}`);
  if (id) dataCheckArr.push(`id=${id}`);
  if (last_name) dataCheckArr.push(`last_name=${last_name}`);
  if (photo_url) dataCheckArr.push(`photo_url=${photo_url}`);
  if (username) dataCheckArr.push(`username=${username}`);

  // Сортируем алфавитно по ключам
  dataCheckArr.sort();
  const dataCheckString = dataCheckArr.join('\n');

  // Secret key = SHA256(bot_token)
  const secretKey = crypto.createHash('sha256').update(botToken).digest();

  // HMAC-SHA256(data_check_string, secret_key)
  const computedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  if (computedHash !== hash) {
    return NextResponse.json({ error: 'Invalid hash' }, { status: 401 });
  }

  // Проверка timeliness (auth_date не старше 24 часов, пример)
  const now = Math.floor(Date.now() / 1000);
  if (now - auth_date > 86400) {
    return NextResponse.json({ error: 'Data is outdated' }, { status: 401 });
  }

  // Данные валидны! Создаём или находим пользователя в Firebase
  // Используем Telegram ID как UID (преобразуем в string)
  const uid = `telegram:${id}`;
  const displayName = username || `${first_name} ${last_name || ''}`.trim();
  const photoURL = photo_url;

  try {
    // Обновляем пользователя, если он существует
    await admin.auth().updateUser(uid, {
        displayName: displayName,
        photoURL: photoURL,
    });
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      // Создаём нового пользователя
      await admin.auth().createUser({
        uid,
        displayName: displayName,
        photoURL: photoURL,
      });
    } else {
      // Другая ошибка
      console.error("Firebase Auth Error:", error);
      return NextResponse.json({ error: 'Firebase error' }, { status: 500 });
    }
  }

  // Создаём custom token
  const customToken = await admin.auth().createCustomToken(uid);

  return NextResponse.json({ token: customToken });
}
