# 🧪 Тестирование ветки `makhkambek` — IshTop.Uz

## 0. Подготовка

```bash
git clone -b makhkambek https://github.com/Zafarovpolat/IshTopUz.git
cd IshTopUz && npm install
```

Создай `.env.local` (Firebase ключи + `FIREBASE_SERVICE_ACCOUNT` + `TELEGRAM_BOT_TOKEN`).

Задеплой правила:

```bash
firebase deploy --only firestore:rules,storage
```

Запусти:

```bash
npm run dev   # http://localhost:9002
```

Нужны **2 аккаунта**: клиент + фрилансер.

---

## 1. 🔐 Firestore rules

Firebase Console → **Rules → Playground**.

- `update users/{чужой}` с полем `wallet` → ❌
- `update users/{свой}` меняя `email` → ❌
- `update users/{свой}` меняя `profile.firstName` → ✅
- `get projects/{id}/proposals/{id}` посторонним → ❌
- `get` того же proposal от клиента-владельца → ✅
- `create project` с чужим `clientId` → ❌
- `update notifications/{id}` только `isRead` → ✅
- `update notifications/{id}` меняя `message` → ❌
- `get conversations/{id}` если не в participants → ❌
- `get leads/{id}` → ❌, `create leads` без auth → ✅

## 2. 🛡 Storage rules

- PNG 2 МБ в `/avatars/{свой}/` → ✅
- В `/avatars/{чужой}/` → ❌
- 10 МБ изображение → ❌ (лимит 5 МБ)
- `.exe` в avatars → ❌
- Чтение `/avatars/...` без auth → ❌ (раньше было ✅ — регрессия исправлена)

## 3. 🛡 Security headers

```bash
curl -I http://localhost:9002/
```

Должны быть: `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Strict-Transport-Security`.

В DevTools → Console проверь, что нет CSP-нарушений на `/dashboard`.

## 4. 🚦 Rate limiting

- 6 проектов за минуту → 6-й: «Слишком много запросов»
- 11 откликов за минуту → 11-й отклонён
- 7 POST на `/api/auth/session` с невалидным токеном → 5×401, потом 429

---

## 5. ⚙ Settings (`/dashboard/settings`)

### 5.1 Security — смена пароля

- Неверный текущий → «Неверный текущий пароль»
- Пароль < 6 символов → ошибка валидации
- `new !== confirm` → ошибка
- Успех → toast, сессия инвалидируется (разлогинит — это ок), войди новым паролем

### 5.2 Notifications

- Переключи switch → Сохранить → toast «Сохранено»
- Reload → значения сохранились
- В Firestore: `users/{uid}.settings.notifications` появилось

### 5.3 Privacy

- Выбери «Скрыт» → Сохранить → reload → сохранилось в `users/{uid}.settings.privacy.profileVisibility`

---

## 6. 🔔 Notifications realtime

Две вкладки: A (клиент), B (фрилансер).

- B откликается на проект A → у A колокольчик с красной точкой **без перезагрузки**
- A открывает попап → видит уведомление
- Клик → редирект, `isRead: true`
- Также уведомления приходят на: accept/reject/complete, new message, invitation, review

---

## 7. 📋 Proposal workflow

> ⚠ UI-кнопок пока нет, только actions. Вызывай через временную кнопку или REST.

- `acceptProposal(projectId, proposalId)`:
  - proposal `status: accepted`
  - остальные proposals → `rejected` автоматически
  - project `status: in_progress`, `freelancerId` заполнен
  - уведомления всем сторонам
- `rejectProposal` → status: rejected + уведомление
- `completeProject` → status: completed, `completedProjects` +1, уведомление

Если нужны UI-кнопки в `/dashboard/offers` — скажи, добавлю.

---

## 8. ⭐ Reviews

Проект должен быть `completed`.

- `submitReview({projectId, targetUserId, rating: 5, comment})` → запись в `projects/{id}/reviews`, рейтинг пересчитан (weighted avg), reviewsCount +1, уведомление
- Повторный отзыв → «Вы уже оставили отзыв»
- Отзыв на незавершённый проект → запрет
- Отзыв самому себе → запрет

---

## 9. 💾 Saved & Invitations

### Saved

- `saveEntity('project', id)` → появляется `users/{uid}/saved/project_{id}`
- Повторный вызов идемпотентен
- `unsaveEntity` → удалён

### Invitations

- Клиент: `sendInvitation({freelancerId, projectId, message})` → уведомление фрилансеру
- Повтор → «Приглашение уже отправлено»
- На чужой проект → «Нет прав»
- Фрилансер: `respondInvitation(id, true/false)` → уведомление клиенту

---

## 10. 💬 Чат `/dashboard/messages`

Две вкладки A и B.

1. Создай conversation вручную в Firestore или через `getOrCreateConversation(otherUid)`
2. Открой `/dashboard/messages` — чат появляется без reload (realtime)
3. A пишет «привет» → у B мгновенно появляется, `unreadCount` +1, красный бейдж, уведомление
4. B открывает чат → бейдж обнуляется
5. B отвечает → у A мгновенно
6. Поиск в sidebar работает
7. 31 сообщение за минуту → 31-е отклонено (rate limit)
8. Пустое сообщение → кнопка Send disabled
9. С третьего аккаунта C через клиент SDK `get conversations/{idAB}` → permission denied ✅

---

## 11. 🛑 Error boundary & 404

- DevTools → Network → Offline → открой `/dashboard/*` → должен появиться `error.tsx` с кнопкой «Попробовать снова»
- Клик «Попробовать снова» → перезапуск сегмента
- Открой `/xyz` → кастомная 404

---

## 12. 📝 Logger в production

```bash
NODE_ENV=production npm run build && NODE_ENV=production npm start
```

В логах сервера не должно быть debug-шума (userId, email, providers). Только warn/error.

---

## 13. 🔑 Session cookie

DevTools → Application → Cookies → `session`:

- `Max-Age ≈ 172800` (2 дня, раньше было 5)
- `HttpOnly: true`
- `SameSite: Lax`

---

## 14. ✅ Build

```bash
npm run build
```

Должен дойти до «Compiled successfully».

---

## ⚠ Что не покрыто в этой ветке

- **Payme / реальные платежи / escrow** — не трогал
- **UI-кнопки Accept/Reject/Complete** в `/dashboard/offers` — только actions
- **UI-формы для Reviews / Invitations / Saved** — backend готов, UI минимальный
- **Firestore composite indexes** — создай при первой ошибке «query requires an index» (Firebase даст ссылку в логе)

---

## 📋 Чек-лист

- [ ] Firestore rules playground
- [ ] Storage rules (размеры, типы)
- [ ] CSP headers в curl
- [ ] Rate limits (projects / proposals / auth)
- [ ] Settings: change password
- [ ] Settings: notifications/privacy сохраняются
- [ ] Realtime notifications
- [ ] Proposal workflow (accept/reject/complete)
- [ ] Reviews + пересчёт рейтинга
- [ ] Saved/Invitations
- [ ] Chat: realtime, unread, rate limit, permissions
- [ ] Error boundary + 404
- [ ] Session cookie = 2 дня
- [ ] Build успешный

Если что-то не работает — пришли текст ошибки или скриншот, чиню точечно.
