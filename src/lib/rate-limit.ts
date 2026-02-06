type Key = string;

type Bucket = {
  count: number;
  resetAt: number; // epoch ms
};

const buckets = new Map<Key, Bucket>();

export function rateLimit(params: {
  key: string;
  windowMs: number;
  max: number;
}): { ok: true } | { ok: false; retryAfterMs: number } {
  const now = Date.now();

  const existing = buckets.get(params.key);
  if (!existing || now > existing.resetAt) {
    buckets.set(params.key, { count: 1, resetAt: now + params.windowMs });
    return { ok: true };
  }

  if (existing.count >= params.max) {
    return { ok: false, retryAfterMs: existing.resetAt - now };
  }

  existing.count += 1;
  buckets.set(params.key, existing);
  return { ok: true };
}
