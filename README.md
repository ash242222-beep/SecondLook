# Second Look

> **Prompt Wars by Google**  
> *Tell us how you're thinking about a decision. We'll show you what you haven't looked at yet. We won't tell you what to do.*

Second Look is an AI-powered decision analysis engine designed with **strict neutrality**. Rather than acting like a conventional chatbot that dispenses generic advice or suggests what choice to make, Second Look maps the structure of your reasoning, exposes unstated assumptions, checks equal scrutiny on all paths, and provides five ranked probing questions.

---

## Key Capabilities

1. **Reasoning-Chain Audit ("What this rests on")**
   - Extracts stated claims and inferences directly quoting the user.
   - Highlights the unstated link the conclusion rests on.
   - Tags evidence status into **Known** (● stated with evidence), **Assumed** (◐ inference without concrete proof), and **Unknown** (○ acknowledged uncertainty).

2. **Both-Side Equal Scrutiny (Teal vs. Plum vs. Either Way)**
   - Guarantees at least two blind spots for every alternative (including "decline" or "do nothing").
   - Non-valenced palette: Option A in Teal (`#0F766E`), Option B in Plum (`#7C2D6B`), and neutral grey for common factors. **No red or green** that subtly bias choices.

3. **Tension Mapping**
   - Pinpoints internal goal conflicts that pull in opposite directions regardless of which path is chosen.

4. **8-Area Life Coverage Audit**
   - Evaluates coverage across 8 universal human dimensions: *Money*, *Time & Workload*, *Learning & Growth*, *People & Relationships*, *Health & Well-being*, *Long-Term Path*, *Reversibility & Exit*, and *Values & Identity*.

5. **Ranked Questions & Reflection Loop**
   - Generates exactly 5 questions ordered by potential to transform understanding.
   - Users can answer questions inline and run a refined **"Look again with my answers"** pass.

6. **Neutrality Linter & Substring Quote Validator**
   - Client- and server-side regex linter blocks advisory or steerage phrasing (`you should`, `I recommend`, `best option`, etc.).
   - Quote validator guarantees all quoted phrases are exact character-for-character substrings of what the user entered.

7. **Zero-Latency Offline Cached Demo (`public/sample.json`)**
   - Instant 1-click student internship hero demo requiring zero network or API credits.

---

## Vercel Deployment

The project is structured with native Vercel Serverless support:
- `vercel.json`: Pre-configured for build and routing.
- `api/analyze.ts`: Vercel Serverless Function executing the Gemini API with structured output and fallback.

### Deploying to Vercel:
```bash
# 1. Install or run Vercel CLI
npx vercel --prod

# 2. Add your Gemini API key in Vercel project settings:
# Name: GEMINI_API_KEY
```

---

## Automated GitHub Pipeline

The project includes an automated versioned ship script (`scripts/ship.sh`) and GitHub Action workflow (`.github/workflows/deploy.yml`).

### Running a Versioned Ship:
```bash
chmod +x scripts/ship.sh
./scripts/ship.sh v1.0.0 "release: Second Look master build"
```
The script:
1. Inspects staged changes for accidental API keys (secret scanner).
2. Executes quality tests (`npm run check`).
3. Commits and creates an annotated tag `v1.0.0`.
4. Pushes main with `--follow-tags`.

---

## 3-Minute Demo Script

- **0:00 - 0:20 (Hook):** "People decide based on what's most visible. Second Look shows the rest, and it refuses to choose."
- **0:20 - 0:45 (Setup):** Click **"Try the internship example"**. See the 6-month internship dilemma load instantly from cached JSON.
- **0:45 - 1:25 (Reasoning):** Open **"What your conclusions rest on"**. Point out the claim quote, inference, and unstated link (e.g. proximity = convenience). Show the Assumed chip (◐).
- **1:25 - 2:00 (Both Sides):** Scroll to the 3 equal columns: Option A (Teal), Option B (Plum), and Either Way (Grey). Show equal scrutiny on the decline path.
- **2:00 - 2:25 (Coverage & Questions):** Walk through the 8 life areas and read Question #1.
- **2:25 - 2:45 (Neutrality Proof):** Show the neutrality linter and refusal note.
- **2:45 - 3:00 (Close):** "The decision remains yours."
