import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { analyzeDecision } from "./core/analyze.ts";
import { validateAnalyzePayload, checkRateLimit } from "./core/security.ts";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Security Middleware: Headers & Body Limit
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});

app.use(express.json({ limit: "500kb" }));

// API route for analysis with rate limiting and strict validation
app.post("/api/analyze", async (req: Request, res: Response): Promise<void> => {
  try {
    const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";
    const rateCheck = checkRateLimit(clientIp, 30, 60000);

    res.setHeader("X-RateLimit-Limit", "30");
    res.setHeader("X-RateLimit-Remaining", rateCheck.remaining.toString());

    if (!rateCheck.allowed) {
      res.status(429).json({
        error: "rate_limited",
        message: "Lots of people are using this right now. Your text is saved. Try again in a minute, or open the pre-run example.",
      });
      return;
    }

    const validation = validateAnalyzePayload(req.body);
    if (!validation.isValid || !validation.data) {
      res.status(400).json({
        error: "bad_input",
        message: validation.error || "Invalid request payload",
      });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({
        error: "missing_api_key",
        message: "GEMINI_API_KEY environment variable is not configured. You can test with the pre-run internship example.",
      });
      return;
    }

    const result = await analyzeDecision(validation.data, apiKey);
    res.json(result);
  } catch (error: unknown) {
    const err = error as { status?: number; statusCode?: number; code?: string; message?: string };
    const status = err.status || err.statusCode || 500;
    const code = err.code || "analysis_failed";
    res.status(status).json({
      error: code,
      message: err.message || "Failed to analyze decision",
    });
  }
});

// Helper route to get cached sample directly from backend if needed
app.get("/api/sample", (_req: Request, res: Response): void => {
  const samplePath = path.join(__dirname, "public", "sample.json");
  if (fs.existsSync(samplePath)) {
    res.sendFile(samplePath);
  } else {
    res.status(404).json({ error: "sample_not_found" });
  }
});

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response): void => {
  res.json({ status: "ok", service: "second-look", timestamp: new Date().toISOString() });
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== "production";

  if (isDev) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`Second Look server running at http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
