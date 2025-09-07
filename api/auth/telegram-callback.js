const admin = require('firebase-admin');
const crypto = require('crypto');

// Инициализация Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
  });
}

module.exports = async (req, res) => {
  // Проверка метода запроса
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Получение данных от Telegram
  const { hash, ...userData } = req.query;

  // Проверка подписи Telegram
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const secretKey = crypto.createHash('sha256').update(botToken).digest();
  const dataCheckString = Object.keys(userData)
    .sort()
    .map((key) => `${key}=${userData[key]}`)
    .join('\n');
  const computedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  if (computedHash !== hash) {
    return res.status(401).json({ error: 'Invalid Telegram data' });
  }

  // Проверка времени авторизации (не старше 24 часов)
  const authDate = parseInt(userData.auth_date, 10);
  const currentTime = Math.floor(Date.now() / 1000);
  if (currentTime - authDate > 86400) {
    return res.status(401).json({ error: 'Authentication data is outdated' });
  }

  // Формирование данных пользователя
  const telegramId = userData.id;
  const userDataForFirebase = {
    uid: `telegram:${telegramId}`,
    displayName: userData.first_name + (userData.last_name ? ` ${userData.last_name}` : ''),
    photoURL: userData.photo_url || null,
    email: userData.username ? `${userData.username}@telegram.com` : null, // Опционально
  };

  try {
    // Создание или обновление пользователя в Firebase
    await admin.auth().updateUser(userDataForFirebase.uid, userDataForFirebase).catch(async () => {
      await admin.auth().createUser(userDataForFirebase);
    });

    // Генерация кастомного токена
    const customToken = await admin.auth().createCustomToken(userDataForFirebase.uid, {
      telegramId: telegramId,
    });

    // Перенаправление на страницу завершения с токеном
    res.redirect(`/auth/complete?token=${customToken}`);
  } catch (error) {
    console.error('Error creating custom token:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};
