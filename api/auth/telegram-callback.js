
const admin = require('firebase-admin');
const crypto = require('crypto');

// Инициализация Firebase Admin SDK
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
    });
  } catch (e) {
    console.error('Firebase admin initialization error', e.stack);
  }
}

module.exports = async (req, res) => {
  // Проверка метода запроса
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Получение данных от Telegram из тела запроса
  const { hash, ...userData } = req.body;

  if (!hash) {
    return res.status(400).json({ error: 'Hash is missing from the request body' });
  }

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
    return res.status(401).json({ error: 'Invalid Telegram data: hash mismatch' });
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
    // Use a placeholder email if username is not available
    email: userData.username ? `${userData.username}@telegram.com` : `tg${telegramId}@example.com`,
  };

  try {
    // Создание или обновление пользователя в Firebase
    await admin.auth().updateUser(userDataForFirebase.uid, userDataForFirebase).catch(async (error) => {
      // If user does not exist, create them
      if (error.code === 'auth/user-not-found') {
        return admin.auth().createUser(userDataForFirebase);
      }
      // Rethrow other errors
      throw error;
    });

    // Генерация кастомного токена
    const customToken = await admin.auth().createCustomToken(userDataForFirebase.uid, {
      telegramId: telegramId,
    });

    // Отправка токена клиенту
    return res.status(200).json({ token: customToken });

  } catch (error) {
    console.error('Error processing Telegram auth:', error);
    return res.status(500).json({ error: 'Internal server error during authentication' });
  }
};
