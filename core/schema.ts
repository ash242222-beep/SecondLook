import { Type } from "@google/genai";

export const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    mode: {
      type: Type.STRING,
      enum: ["analysis", "needs_detail", "not_a_decision", "support_first"],
    },
    user_note: {
      type: Type.STRING,
      description: "Note to user, empty string if none",
    },
    decision: {
      type: Type.OBJECT,
      properties: {
        question: { type: Type.STRING, description: "Restated neutrally" },
        options: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, enum: ["A", "B"] },
              label: { type: Type.STRING },
              inferred: { type: Type.BOOLEAN },
            },
            required: ["id", "label", "inferred"],
          },
        },
      },
      required: ["question", "options"],
    },
    reading_of_reasoning: {
      type: Type.STRING,
      description: "Max 2 sentences: Here is how I read your thinking...",
    },
    considered: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          factor: { type: Type.STRING },
          user_quote: { type: Type.STRING },
          side: { type: Type.STRING, enum: ["A", "B", "both"] },
        },
        required: ["factor", "user_quote", "side"],
      },
    },
    reasoning_chains: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          claim_quote: { type: Type.STRING },
          seems_to_conclude: { type: Type.STRING },
          rests_on: { type: Type.STRING },
          support: {
            type: Type.STRING,
            enum: ["stated_with_evidence", "assumed", "unknown"],
          },
          question: { type: Type.STRING },
        },
        required: [
          "id",
          "claim_quote",
          "seems_to_conclude",
          "rests_on",
          "support",
          "question",
        ],
      },
    },
    blind_spots: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          type: {
            type: Type.STRING,
            enum: [
              "missing_factor",
              "hidden_assumption",
              "trade_off",
              "goal_conflict",
              "second_order",
              "uncertainty",
            ],
          },
          applies_to: { type: Type.STRING, enum: ["A", "B", "both"] },
          title: { type: Type.STRING },
          what_is_unexamined: { type: Type.STRING },
          why_it_matters: { type: Type.STRING },
          user_quote: { type: Type.STRING },
          question: { type: Type.STRING },
          significance: { type: Type.STRING, enum: ["high", "medium"] },
        },
        required: [
          "id",
          "type",
          "applies_to",
          "title",
          "what_is_unexamined",
          "why_it_matters",
          "user_quote",
          "question",
          "significance",
        ],
      },
    },
    tensions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          goal_a: { type: Type.STRING },
          goal_a_quote: { type: Type.STRING },
          goal_b: { type: Type.STRING },
          goal_b_quote: { type: Type.STRING },
          why_they_pull_apart: { type: Type.STRING },
        },
        required: [
          "id",
          "goal_a",
          "goal_a_quote",
          "goal_b",
          "goal_b_quote",
          "why_they_pull_apart",
        ],
      },
    },
    scrutiny: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          option_id: { type: Type.STRING, enum: ["A", "B"] },
          least_examined_assumption: { type: Type.STRING },
          what_you_would_need_to_know: { type: Type.STRING },
        },
        required: [
          "option_id",
          "least_examined_assumption",
          "what_you_would_need_to_know",
        ],
      },
    },
    coverage: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          area: {
            type: Type.STRING,
            enum: [
              "money",
              "time_and_workload",
              "learning_and_growth",
              "people_and_relationships",
              "health_and_wellbeing",
              "long_term_path",
              "reversibility_and_exit",
              "values_and_identity",
            ],
          },
          status: {
            type: Type.STRING,
            enum: ["weighed", "mentioned_lightly", "not_mentioned"],
          },
          note: { type: Type.STRING },
        },
        required: ["area", "status", "note"],
      },
    },
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          rank: { type: Type.INTEGER },
          question: { type: Type.STRING },
          linked_to: { type: Type.STRING },
          why_first: { type: Type.STRING },
        },
        required: ["rank", "question", "linked_to", "why_first"],
      },
    },
  },
  required: [
    "mode",
    "user_note",
    "decision",
    "reading_of_reasoning",
    "considered",
    "reasoning_chains",
    "blind_spots",
    "tensions",
    "scrutiny",
    "coverage",
    "questions",
  ],
};
