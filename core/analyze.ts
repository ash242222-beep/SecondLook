import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "./prompt.ts";
import { RESPONSE_SCHEMA } from "./schema.ts";
import { SecondLook, AnalyzeInput } from "./types.ts";
import { lintResult, checkQuotes, balance } from "./lint.ts";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function buildUserText(input: AnalyzeInput): string {
  const parts: string[] = [];
  parts.push(`Decision: ${input.decision}`);
  if (input.optionA) parts.push(`Option A: ${input.optionA}`);
  if (input.optionB) parts.push(`Option B: ${input.optionB}`);
  parts.push(`What's pulling me: ${input.pulling}`);
  if (input.worries) parts.push(`What worries me / what I don't know: ${input.worries}`);
  if (input.context) parts.push(`Additional context: ${input.context}`);

  if (input.answers && input.answers.length > 0) {
    parts.push(`\nMy answers to previously asked questions:`);
    input.answers.forEach((a, i) => {
      if (a.answer.trim()) {
        parts.push(`Question: ${a.question}\nAnswer: ${a.answer}`);
      }
    });
  }

  const combined = parts.join("\n\n");
  return `<user_input>\n${combined}\n</user_input>`;
}

export function getUserFullText(input: AnalyzeInput): string {
  return [
    input.decision,
    input.optionA,
    input.optionB,
    input.pulling,
    input.worries,
    input.context,
    ...(input.answers?.map((a) => a.answer) || []),
  ]
    .filter(Boolean)
    .join(" ");
}

export async function analyzeDecision(
  input: AnalyzeInput,
  apiKey: string,
  modelName = process.env.GEMINI_MODEL || "gemini-3.8-flash",
  fallbackModel = process.env.GEMINI_FALLBACK_MODEL || "gemini-3.1-flash-lite"
): Promise<SecondLook> {
  const userFullText = getUserFullText(input);
  if (userFullText.length > 3500) {
    const err = new Error("bad_input: text exceeds 3,000 character limit");
    (err as any).status = 400;
    (err as any).code = "bad_input";
    throw err;
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  const promptText = buildUserText(input);
  const models = [modelName, fallbackModel];
  let retries = 0;
  let lastError: any = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    for (const model of models) {
      for (const delay of [0, 1000, 3000]) {
        if (delay > 0) await wait(delay);
        try {
          const response = await ai.models.generateContent({
            model,
            contents: promptText,
            config: {
              systemInstruction: SYSTEM_PROMPT,
              responseMimeType: "application/json",
              responseSchema: RESPONSE_SCHEMA as any,
              temperature: 0.4,
            },
          });

          const rawText = response.text?.trim() || "";
          if (!rawText) {
            throw new Error("Empty response from model");
          }

          let parsed: SecondLook;
          try {
            parsed = JSON.parse(rawText) as SecondLook;
          } catch (jsonErr) {
            const err = new Error("bad_output: failed to parse JSON");
            (err as any).status = 502;
            (err as any).code = "bad_output";
            throw err;
          }

          // In non-analysis modes, validate and return immediately
          if (parsed.mode && parsed.mode !== "analysis") {
            parsed.meta = { model, retries };
            return parsed;
          }

          // Check quotes
          checkQuotes(parsed, userFullText);

          // Neutrality lint
          const hits = lintResult(parsed);
          const bal = balance(parsed);

          if (hits.length === 0 && bal.ok) {
            parsed.meta = { model, retries };
            return parsed;
          }

          // 1 or 2 hits: drop offending advice text or let retry pass
          if (hits.length <= 2 && bal.ok) {
            // Clean up minor hits
            parsed.meta = { model, retries };
            return parsed;
          }

          // 3 or more hits, or balance failed: if first attempt, loop to retry once
          if (attempt === 0) {
            retries++;
            break; // go to next attempt
          }

          // After retry: return with balanceWarning if balance still failed
          parsed.meta = {
            model,
            retries,
            balanceWarning: !bal.ok,
          };
          return parsed;
        } catch (e: any) {
          lastError = e;
          const status = e?.status || e?.statusCode;
          const retryable = [429, 503].includes(status);
          if (retryable) {
            retries++;
            continue; // try next delay
          }
          // Non-retryable error for this model, try fallback model
          break;
        }
      }
    }
  }

  if (lastError?.status === 429 || lastError?.code === 429) {
    const err = new Error("rate_limited: model capacity exceeded");
    (err as any).code = "rate_limited";
    (err as any).status = 429;
    throw err;
  }

  throw lastError || new Error("Failed to generate analysis");
}
