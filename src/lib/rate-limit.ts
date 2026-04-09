import 'server-only';

/**
 * Простой in-memory token-bucket rate limiter.
 * Подходит для single-instance Firebase App Hosting (maxInstances: 1).
 * Для multi-instance нужно заменить на Redis/Upstash.
 */

type Bucket = {
  tokens: number;
  updatedAt: number;
};

const store = new Map<string, Bucket>();

// Чистим раз в 10 минут, чтобы Map не рос бесконечно.
const CLEANUP_MS = 10 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_MS) return;
  lastCleanup = now;
  for (const [k, v] of store) {
    if (now - v.updatedAt > CLEANUP_MS) store.delete(k);
  }
}

export interface RateLimitOptions {
  /** Макс. количество запросов за окно. */
  max: number;
  /** Окно в миллисекундах. */
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetInMs: number;
}

/**
 * Проверка лимита. Возвращает { success: false } если исчерпано.
 * Использовать как:
 *   const rl = rateLimit(`proposal:${userId}`, { max: 10, windowMs: 60_000 });
 *   if (!rl.success) return { success: false, message: 'Слишком много запросов.' };
 */
export function rateLimit(key: string, opts: RateLimitOptions): RateLimitResult {
  cleanup();
  const now = Date.now();
  const bucket = store.get(key);

  if (!bucket) {
    store.set(key, { tokens: opts.max - 1, updatedAt: now });
    return { success: true, remaining: opts.max - 1, resetInMs: opts.windowMs };
  }

  const elapsed = now - bucket.updatedAt;
  // Восстанавливаем токены пропорционально прошедшему времени.
  const refill = (elapsed / opts.windowMs) * opts.max;
  const tokens = Math.min(opts.max, bucket.tokens + refill);

  if (tokens < 1) {
    const resetInMs = Math.ceil(((1 - tokens) / opts.max) * opts.windowMs);
    bucket.tokens = tokens;
    bucket.updatedAt = now;
    return { success: false, remaining: 0, resetInMs };
  }

  bucket.tokens = tokens - 1;
  bucket.updatedAt = now;
  return {
    success: true,
    remaining: Math.floor(bucket.tokens),
    resetInMs: opts.windowMs,
  };
}

/** Пресеты для типичных действий. */
export const RATE_LIMITS = {
  submitProposal: { max: 10, windowMs: 60_000 },
  createProject: { max: 5, windowMs: 60_000 },
  sendMessage: { max: 30, windowMs: 60_000 },
  auth: { max: 5, windowMs: 60_000 },
  addPortfolio: { max: 15, windowMs: 60_000 },
} as const;
