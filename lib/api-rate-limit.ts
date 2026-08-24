import { NextResponse } from "next/server";
import {
  checkRateLimit,
  getClientIp,
  rateLimitExceededResponse,
  rateLimitHeaders,
} from "@/lib/rate-limit";

interface RateLimitOptions {
  limit?: number;
  windowMs?: number;
  keyPrefix: string;
}

export function withRateLimit(
  request: Request,
  options: RateLimitOptions
): NextResponse | null {
  const { limit = 10, windowMs = 60_000, keyPrefix } = options;
  const ip = getClientIp(request);
  const result = checkRateLimit(`${keyPrefix}:${ip}`, limit, windowMs);

  if (!result.allowed) {
    return NextResponse.json(
      { message: "Zbyt wiele żądań. Spróbuj ponownie za chwilę." },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.max(1, Math.ceil((result.resetAt - Date.now()) / 1000))
          ),
          ...rateLimitHeaders(result),
        },
      }
    );
  }

  return null;
}

export { rateLimitExceededResponse, checkRateLimit, getClientIp, rateLimitHeaders };
