import { AnalyzeInput } from "./types.ts";

/**
 * Sanitizes input string to prevent token stuffing, control-character injection, and strip harmful HTML tags.
 */
export function sanitizeInputString(input: unknown, maxLength = 1000): string {
  if (typeof input !== "string") return "";
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]+>/g, "") // Strip raw HTML tags
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, "") // Strip unprintable ASCII control characters
    .trim()
    .slice(0, maxLength);
}

/**
 * Validates and strictly sanitizes the incoming analyze request body.
 */
export function validateAnalyzePayload(body: unknown): {
  isValid: boolean;
  error?: string;
  data?: AnalyzeInput;
} {
  if (!body || typeof body !== "object") {
    return { isValid: false, error: "Request body must be a valid JSON object" };
  }

  const payload = body as Record<string, unknown>;

  const decision = sanitizeInputString(payload.decision, 500);
  const pulling = sanitizeInputString(payload.pulling, 2000);
  const worries = sanitizeInputString(payload.worries, 2000);
  const context = sanitizeInputString(payload.context, 1000);
  const optionA = sanitizeInputString(payload.optionA, 200);
  const optionB = sanitizeInputString(payload.optionB, 200);

  if (!decision || decision.length < 5) {
    return {
      isValid: false,
      error: "Decision question is required and must be at least 5 characters long",
    };
  }

  if (!pulling || pulling.length < 5) {
    return {
      isValid: false,
      error: "What's pulling you towards each option is required and must be at least 5 characters long",
    };
  }

  let answers: { question: string; answer: string }[] | undefined;
  if (Array.isArray(payload.answers)) {
    answers = payload.answers
      .slice(0, 10) // Max 10 reflections
      .map((item: unknown) => {
        if (!item || typeof item !== "object") return null;
        const qItem = item as Record<string, unknown>;
        const q = sanitizeInputString(qItem.question, 300);
        const a = sanitizeInputString(qItem.answer, 1000);
        return q && a ? { question: q, answer: a } : null;
      })
      .filter((item): item is { question: string; answer: string } => item !== null);
  }

  return {
    isValid: true,
    data: {
      decision,
      pulling,
      worries: worries || undefined,
      context: context || undefined,
      optionA: optionA || undefined,
      optionB: optionB || undefined,
      answers,
    },
  };
}

/**
 * In-memory sliding-window IP rate limiter
 */
interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Automatically sweep expired records every 5 minutes to prevent memory leaks
if (typeof setInterval !== "undefined") {
  const sweepTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < 60000);
      if (record.timestamps.length === 0) {
        rateLimitStore.delete(key);
      }
    }
  }, 300000);
  if (sweepTimer && typeof sweepTimer.unref === "function") {
    sweepTimer.unref();
  }
}

export function checkRateLimit(
  clientIp: string,
  maxRequests = 30,
  windowMs = 60000
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(clientIp) || { timestamps: [] };

  // Retain only requests within the active window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= maxRequests) {
    const oldest = record.timestamps[0];
    const resetTime = oldest + windowMs;
    return { allowed: false, remaining: 0, resetTime };
  }

  record.timestamps.push(now);
  rateLimitStore.set(clientIp, record);

  return {
    allowed: true,
    remaining: maxRequests - record.timestamps.length,
    resetTime: now + windowMs,
  };
}
