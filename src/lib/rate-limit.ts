const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 menit

type Attempt = { count: number; firstAttemptAt: number };

const attempts = new Map<string, Attempt>();

/**
 * Rate limit sederhana berbasis in-memory (per-instance).
 * Cocok untuk MVP single-instance; untuk multi-instance/serverless
 * scale-out, ganti dengan store terpusat (mis. Redis/Upstash).
 */
export function isRateLimited(key: string): boolean {
  const entry = attempts.get(key);
  if (!entry) return false;

  if (Date.now() - entry.firstAttemptAt > WINDOW_MS) {
    attempts.delete(key);
    return false;
  }

  return entry.count >= MAX_ATTEMPTS;
}

export function recordFailedAttempt(key: string): void {
  const entry = attempts.get(key);
  const now = Date.now();

  if (!entry || now - entry.firstAttemptAt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAttemptAt: now });
    return;
  }

  entry.count += 1;
}

export function clearAttempts(key: string): void {
  attempts.delete(key);
}
