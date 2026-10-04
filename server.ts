import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { analyzeDecision } from "./core/analyze.ts";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: "2mb" }));

// API route for analysis
app.post("/api/analyze", async (req: Request, res: Response): Promise<void> => {
  try {
    const { decision, optionA, optionB, pulling, worries, context, answers } = req.body;

    if (!decision || !pulling) {
      res.status(400).json({
        error: "bad_input",
        message: "Decision and pulling fields are required",
      });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // In local dev without key, if requested, return sample or clear message
      res.status(500).json({
        error: "missing_api_key",
        message: "GEMINI_API_KEY environment variable is not configured. You can test with the pre-run internship example.",
      });
      return;
    }

    const result = await analyzeDecision(
      { decision, optionA, optionB, pulling, worries, context, answers },
      apiKey
    );

    res.json(result);
  } catch (error: any) {
    const status = error.status || error.statusCode || 500;
    const code = error.code || "analysis_failed";
    res.status(status).json({
      error: code,
      message: error.message || "Failed to analyze decision",
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
