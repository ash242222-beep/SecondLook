import type { IncomingMessage, ServerResponse } from "http";
import { analyzeDecision } from "../core/analyze.ts";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { decision, optionA, optionB, pulling, worries, context, answers } = req.body || {};

    if (!decision || !pulling) {
      return res.status(400).json({
        error: "bad_input",
        message: "Decision and pulling fields are required",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "missing_api_key",
        message: "GEMINI_API_KEY is not configured in Vercel environment variables.",
      });
    }

    const result = await analyzeDecision(
      { decision, optionA, optionB, pulling, worries, context, answers },
      apiKey
    );

    return res.status(200).json(result);
  } catch (error: any) {
    const status = error.status || error.statusCode || 500;
    const code = error.code || "analysis_failed";
    return res.status(status).json({
      error: code,
      message: error.message || "Failed to analyze decision",
    });
  }
}
