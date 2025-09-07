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
  console.log('=== Telegram Callback Started ===');
  console.log('Method:', req.method);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  
  // Проверка метода запроса
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Получение данных от Telegram из тела запроса
  const { hash, ...userData } = req.body;

  console.log('Extracted hash:', hash);
  console.log('User data:', userData);

  if (!hash) {
    console.log('Hash is missing');
    return res.status(400).json({ error: 'Hash is missing from the request body' });
  }

  // Проверка подписи Telegram
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  console.log('Bot token exists:', !!botToken);
  
  if (!botToken) {
    console.error('TELEGRAM_BOT_TOKEN environment variable is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const secretKey = crypto.createHash('sha256').update(botToken).digest();
  
  const dataCheckString = Object.keys(userData)
    .sort()
    .map((key) => `${key}=${userData[key]}`)
    .join('\n');
    
  console.log('Data check string:', dataCheckString);
    
  const computedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  console.log('Computed hash:', computedHash);
  console.log('Received hash:', hash);

  if (computedHash !== hash) {
    console.log('Hash mismatch - authentication failed');
    return res.status(401).json({ error: 'Invalid Telegram data: hash mismatch' });
  }

  // Проверка времени авторизации (не старше 24 часов)
  const authDate = parseInt(userData.auth_date, 10);
  const currentTime = Math.floor(Date.now() / 1000);
  console.log('Auth date:', authDate);
  console.log('Current time:', currentTime);
  console.log('Time difference (seconds):', currentTime - authDate);
  
  if (currentTime - authDate > 86400) {
    console.log('Authentication data is outdated');
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

  console.log('Firebase user data:', userDataForFirebase);

  try {
    console.log('Attempting to update/create user in Firebase...');
    
    // Создание или обновление пользователя в Firebase
    await admin.auth().updateUser(userDataForFirebase.uid, userDataForFirebase).catch(async (error) => {
      console.log('User update failed, attempting to create:', error.code);
      // If user does not exist, create them
      if (error.code === 'auth/user-not-found') {
        console.log('Creating new user...');
        return admin.auth().createUser(userDataForFirebase);
      }
      // Rethrow other errors
      throw error;
    });

    console.log('User created/updated successfully');

    // Генерация кастомного токена
    console.log('Generating custom token...');
    const customToken = await admin.auth().createCustomToken(userDataForFirebase.uid, {
      telegramId: telegramId,
    });

    console.log('Custom token generated successfully');

    // Отправка токена клиенту
    return res.status(200).json({ token: customToken });

  } catch (error) {
    console.error('Error processing Telegram auth:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ 
      error: 'Internal server error during authentication',
      details: error.message 
    });
  }
};