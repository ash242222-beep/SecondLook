import { test } from "node:test";
import assert from "node:assert/strict";
import { lintResult, checkQuotes, balance } from "../core/lint.ts";
import { SecondLook } from "../core/types.ts";
import { computeDecisionConfidence } from "../src/components/ConfidenceRating.tsx";
import { sanitizeInputString, validateAnalyzePayload, checkRateLimit } from "../core/security.ts";

test("linter catches advice words and phrases", () => {
  const badResult = {
    mode: "analysis",
    user_note: "I recommend you take option A because you should never give up.",
    decision: { question: "Q", options: [] },
    reading_of_reasoning: "The best option is clear.",
    considered: [],
    reasoning_chains: [],
    blind_spots: [],
    tensions: [],
    scrutiny: [],
    coverage: [],
    questions: [],
  } as unknown as SecondLook;

  const hits = lintResult(badResult);
  assert.ok(hits.length >= 2, `Expected at least 2 hits, got ${hits.length}`);
  const paths = hits.map((h) => h.path);
  assert.ok(paths.includes("user_note"));
  assert.ok(paths.includes("reading_of_reasoning"));
});

test("linter ignores user quotes even if they contain advice phrases", () => {
  const quotedResult = {
    mode: "analysis",
    user_note: "",
    decision: { question: "Q", options: [] },
    reading_of_reasoning: "Here is what we observed.",
    considered: [
      {
        factor: "Family advice",
        user_quote: "My parents said you should accept it",
        side: "A",
      },
    ],
    reasoning_chains: [],
    blind_spots: [],
    tensions: [],
    scrutiny: [],
    coverage: [],
    questions: [],
  } as unknown as SecondLook;

  const hits = lintResult(quotedResult);
  assert.equal(hits.length, 0, "Quotes should be exempted from linter");
});

test("quote check blanks fabricated quotes not in user text", () => {
  const userText = "The stipend is good and it is close to home. I want real experience.";
  const inputResult = {
    mode: "analysis",
    user_note: "",
    decision: { question: "Q", options: [] },
    reading_of_reasoning: "Here is how I read it.",
    considered: [
      {
        factor: "Stipend",
        user_quote: "The stipend is good",
        side: "A",
      },
      {
        factor: "Fake bonus",
        user_quote: "I am getting a huge signing bonus",
        side: "A",
      },
    ],
    reasoning_chains: [],
    blind_spots: [],
    tensions: [],
    scrutiny: [],
    coverage: [],
    questions: [],
  } as unknown as SecondLook;

  const sanitized = checkQuotes(inputResult, userText);
  assert.equal(sanitized.considered[0].user_quote, "The stipend is good");
  assert.equal(sanitized.considered[1].user_quote, "");
});

test("balance checker requires at least 2 blind spots per option", () => {
  const unbalanced = {
    blind_spots: [
      { applies_to: "A" },
      { applies_to: "A" },
      { applies_to: "A" },
    ],
  } as unknown as SecondLook;

  assert.equal(balance(unbalanced).ok, false);

  const balanced = {
    blind_spots: [
      { applies_to: "A" },
      { applies_to: "A" },
      { applies_to: "B" },
      { applies_to: "both" },
    ],
  } as unknown as SecondLook;

  assert.equal(balance(balanced).ok, true);
  assert.equal(balance(balanced).A, 3);
  assert.equal(balance(balanced).B, 2);
});

test("confidence rating derives factual score within valid mathematical bounds", () => {
  const sampleResult = {
    reasoning_chains: [
      { support: "stated_with_evidence" },
      { support: "stated_with_evidence" },
      { support: "assumed" },
      { support: "unknown" },
    ],
    coverage: [
      { status: "weighed" },
      { status: "weighed" },
      { status: "weighed" },
      { status: "weighed" },
      { status: "mentioned_lightly" },
      { status: "mentioned_lightly" },
      { status: "not_mentioned" },
      { status: "not_mentioned" },
    ],
    blind_spots: [
      { applies_to: "A" },
      { applies_to: "A" },
      { applies_to: "B" },
      { applies_to: "B" },
      { applies_to: "both" },
    ],
  } as unknown as SecondLook;

  const rating = computeDecisionConfidence(sampleResult);
  assert.ok(rating.score >= 0 && rating.score <= 100, "Score must be bounded 0-100");
  assert.equal(rating.knownChains, 2);
  assert.equal(rating.totalChains, 4);
  assert.equal(rating.weighedCount, 4);
  assert.equal(rating.lightCount, 2);
  assert.equal(rating.level, "Moderate");
});

test("security sanitizer strips HTML and script tags", () => {
  const malicious = '<script>alert("xss")</script><b>Accept</b> the internship';
  const clean = sanitizeInputString(malicious, 100);
  assert.equal(clean, "Accept the internship");
  assert.ok(!clean.includes("<script>"));
  assert.ok(!clean.includes("<b>"));
});

test("validateAnalyzePayload enforces required decision inputs", () => {
  const badPayload = { decision: "No", pulling: "" };
  const res = validateAnalyzePayload(badPayload);
  assert.equal(res.isValid, false);
  assert.ok(res.error?.includes("required"));

  const goodPayload = {
    decision: "Should I accept the job offer?",
    pulling: "The pay is high and relocation is paid.",
  };
  const validRes = validateAnalyzePayload(goodPayload);
  assert.equal(validRes.isValid, true);
  assert.equal(validRes.data?.decision, "Should I accept the job offer?");
});

test("rate limiter enforces sliding window per IP", () => {
  const testIp = "192.168.1.100";
  // Call 5 times with max 5
  for (let i = 0; i < 5; i++) {
    const res = checkRateLimit(testIp, 5, 10000);
    assert.equal(res.allowed, true);
  }
  // 6th call should be blocked
  const blocked = checkRateLimit(testIp, 5, 10000);
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.remaining, 0);
});
