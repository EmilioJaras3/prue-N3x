interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitRecord>();

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = store.get(key);

  if (!record || now > record.resetTime) {
    store.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  record.count++;
  const allowed = record.count <= maxRequests;
  return {
    allowed,
    remaining: Math.max(0, maxRequests - record.count),
  };
}

export function rateLimitLogin(ip: string) {
  return checkRateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
}

export function rateLimitRegister(ip: string) {
  return checkRateLimit(`register:${ip}`, 3, 60 * 60 * 1000);
}

export function rateLimitApi(ip: string) {
  return checkRateLimit(`api:${ip}`, 100, 60 * 1000);
}
