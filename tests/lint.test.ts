import { test } from "node:test";
import assert from "node:assert/strict";
import { lintResult, checkQuotes, balance } from "../core/lint.ts";
import { SecondLook } from "../core/types.ts";

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
