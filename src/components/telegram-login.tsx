'use client';

import { useEffect, useRef } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface TelegramLoginWidgetProps {
  botUsername: string;
  onAuth: (user: TelegramUser) => void;
  buttonSize?: 'large' | 'medium' | 'small';
  cornerRadius?: number;
  requestAccess?: string;
}

declare global {
  interface Window {
    TelegramLoginWidget?: {
      dataOnauth?: (user: TelegramUser) => void;
    };
  }
}

export function TelegramLoginWidget({
  botUsername,
  onAuth,
  buttonSize = 'large',
  cornerRadius,
  requestAccess = 'write'
}: TelegramLoginWidgetProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !botUsername) return;

    // Создаем уникальное имя функции для этого виджета
    const callbackName = `onTelegramAuth_${Date.now()}`;
    
    // Добавляем callback в глобальную область
    (window as any)[callbackName] = onAuth;

    // Создаем скрипт для Telegram Widget
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', botUsername);
    script.setAttribute('data-size', buttonSize);
    script.setAttribute('data-onauth', `${callbackName}(user)`);
    if (requestAccess) {
      script.setAttribute('data-request-access', requestAccess);
    }
    if (cornerRadius) {
      script.setAttribute('data-radius', cornerRadius.toString());
    }
    script.async = true;

    // Очищаем контейнер и добавляем скрипт
    ref.current.innerHTML = '';
    ref.current.appendChild(script);

    // Cleanup функция
    return () => {
      delete (window as any)[callbackName];
    };
  }, [botUsername, onAuth, buttonSize, cornerRadius, requestAccess]);

  return <div ref={ref} />;
}

// Альтернативный компонент с кнопкой, которая открывает попап
interface TelegramLoginButtonProps {
  botUsername: string;
  botId: string;
  onAuth: (user: TelegramUser) => void;
  onError?: (error: string) => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function TelegramLoginButton({
  botUsername,
  botId,
  onAuth,
  onError,
  children,
  className,
  disabled
}: TelegramLoginButtonProps) {
  const handleClick = () => {
    if (disabled) return;

    const authUrl = `https://oauth.telegram.org/auth?bot_id=${botId}&origin=${encodeURIComponent(
      window.location.origin
    )}&return_to=${encodeURIComponent(window.location.href)}&request_access=write`;

    const popup = window.open(
      authUrl,
      'telegram-login',
      'width=550,height=450,resizable,scrollbars'
    );

    if (!popup) {
      onError?.('Не удалось открыть попап. Проверьте настройки браузера.');
      return;
    }

    const messageListener = (event: MessageEvent) => {
      if (event.origin !== 'https://oauth.telegram.org') return;

      if (event.data.user) {
        onAuth(event.data.user);
        popup.close();
        window.removeEventListener('message', messageListener);
      } else if (event.data.error) {
        onError?.(event.data.error);
        popup.close();
        window.removeEventListener('message', messageListener);
      }
    };

    window.addEventListener('message', messageListener);

    // Проверяем, не закрыл ли пользователь попап вручную
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageListener);
        onError?.('Аутентификация была отменена');
      }
    }, 1000);
  };

  return (
    <button onClick={handleClick} className={className} disabled={disabled}>
      {children}
    </button>
  );
}