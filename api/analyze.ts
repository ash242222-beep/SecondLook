import type { IncomingMessage, ServerResponse } from "http";
import { analyzeDecision } from "../core/analyze.ts";
import { validateAnalyzePayload } from "../core/security.ts";

interface ServerlessRequest extends IncomingMessage {
  body?: unknown;
  method?: string;
}

interface ServerlessResponse extends ServerResponse {
  status: (statusCode: number) => ServerlessResponse;
  json: (data: unknown) => void;
}

export default async function handler(
  req: ServerlessRequest,
  res: ServerlessResponse
) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const validation = validateAnalyzePayload(req.body);
    if (!validation.isValid || !validation.data) {
      return res.status(400).json({
        error: "bad_input",
        message: validation.error || "Invalid request payload",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "missing_api_key",
        message: "GEMINI_API_KEY is not configured in Vercel environment variables.",
      });
    }

    const result = await analyzeDecision(validation.data, apiKey);
    return res.status(200).json(result);
  } catch (error: unknown) {
    const err = error as { status?: number; statusCode?: number; code?: string; message?: string };
    const status = err.status || err.statusCode || 500;
    const code = err.code || "analysis_failed";
    return res.status(status).json({
      error: code,
      message: err.message || "Failed to analyze decision",
    });
  }
}
