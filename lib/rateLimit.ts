import { NextRequest, NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyPrefix: string;
}

interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number; // epoch ms
}

interface WindowEntry {
  count: number;
  start: number; // epoch ms — beginning of the window
}

// ---------------------------------------------------------------------------
// Sliding-window rate limiter factory
// ---------------------------------------------------------------------------

function createRateLimiter(config: RateLimitConfig) {
  const { windowMs, maxRequests, keyPrefix } = config;

  // Map key → { current window, previous window }
  const buckets = new Map<
    string,
    { current: WindowEntry; previous: WindowEntry }
  >();

  // Periodic sweep — delete fully expired entries to cap memory
  const sweepInterval = Math.max(windowMs * 2, 60_000);
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of buckets) {
      // Both windows are fully expired when the current window ended before now
      if (entry.current.start + windowMs * 2 < now) {
        buckets.delete(key);
      }
    }
  }, sweepInterval);
  // Allow the process to exit without waiting for this timer
  if (timer && typeof timer === 'object' && 'unref' in timer) {
    timer.unref();
  }

  function check(rawKey: string): RateLimitResult {
    const key = `${keyPrefix}:${rawKey}`;
    const now = Date.now();
    const currentWindowStart =
      Math.floor(now / windowMs) * windowMs;
    const previousWindowStart = currentWindowStart - windowMs;

    let entry = buckets.get(key);

    // Lazy eviction — if both windows are fully expired, start fresh
    if (entry && entry.current.start + windowMs * 2 < now) {
      buckets.delete(key);
      entry = undefined;
    }

    if (!entry) {
      entry = {
        current: { count: 0, start: currentWindowStart },
        previous: { count: 0, start: previousWindowStart },
      };
      buckets.set(key, entry);
    }

    // Rotate windows if we moved to a new window
    if (entry.current.start !== currentWindowStart) {
      if (entry.current.start === previousWindowStart) {
        // Previous window is the old current
        entry.previous = { ...entry.current };
      } else {
        // More than one full window has passed — previous is empty
        entry.previous = { count: 0, start: previousWindowStart };
      }
      entry.current = { count: 0, start: currentWindowStart };
    }

    // Sliding window approximation
    const elapsedRatio =
      (now - currentWindowStart) / windowMs;
    const previousWeight = 1 - elapsedRatio;
    const estimatedCount =
      Math.floor(entry.previous.count * previousWeight) +
      entry.current.count;

    const resetAt = currentWindowStart + windowMs;

    if (estimatedCount >= maxRequests) {
      return {
        allowed: false,
        limit: maxRequests,
        remaining: 0,
        resetAt,
      };
    }

    // Allowed — increment current window
    entry.current.count++;

    return {
      allowed: true,
      limit: maxRequests,
      remaining: Math.max(0, maxRequests - estimatedCount - 1),
      resetAt,
    };
  }

  return { check };
}

// ---------------------------------------------------------------------------
// IP extraction
// ---------------------------------------------------------------------------

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for can be comma-separated; first entry is the client
    const first = forwarded.split(',')[0].trim();
    if (first) return first;
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

// ---------------------------------------------------------------------------
// 429 response builder
// ---------------------------------------------------------------------------

export function rateLimitResponse(result: RateLimitResult): NextResponse {
  const retryAfterSec = Math.ceil(
    Math.max(0, result.resetAt - Date.now()) / 1000
  );

  return NextResponse.json(
    {
      error: 'Too many requests. Please try again later.',
      retryAfter: retryAfterSec,
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfterSec),
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
      },
    }
  );
}

// ---------------------------------------------------------------------------
// Convenience: check + respond
// ---------------------------------------------------------------------------

export function applyRateLimit(
  limiter: ReturnType<typeof createRateLimiter>,
  key: string
): NextResponse | null {
  const result = limiter.check(key);
  if (!result.allowed) {
    return rateLimitResponse(result);
  }
  return null;
}

// ---------------------------------------------------------------------------
// Pre-configured singletons
// ---------------------------------------------------------------------------

/** POST /api/auth/register — IP-keyed, 5 per 15 min */
export const registerLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
  keyPrefix: 'register',
});

/** POST /api/auth/[...nextauth] — IP-keyed, 15 per 15 min */
export const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 15,
  keyPrefix: 'login',
});

/** POST /api/diagnostic (action=start) — User-ID-keyed, 10 per hour */
export const diagnosticStartLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  maxRequests: 10,
  keyPrefix: 'diag-start',
});

/** POST /api/diagnostic (action=answer) — User-ID-keyed, 20 per min */
export const diagnosticAnswerLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 20,
  keyPrefix: 'diag-answer',
});

/** GET/POST /api/profile, GET /api/profile/runs — User-ID-keyed, 30 per min */
export const profileLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 30,
  keyPrefix: 'profile',
});
