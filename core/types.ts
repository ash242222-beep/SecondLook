export type Side = "A" | "B" | "both";

export type Support = "stated_with_evidence" | "assumed" | "unknown";

export type Area =
  | "money"
  | "time_and_workload"
  | "learning_and_growth"
  | "people_and_relationships"
  | "health_and_wellbeing"
  | "long_term_path"
  | "reversibility_and_exit"
  | "values_and_identity";

export interface DecisionOption {
  id: "A" | "B";
  label: string;
  inferred: boolean;
}

export interface ConsideredFactor {
  factor: string;
  user_quote: string;
  side: Side;
}

export interface ReasoningChain {
  id: string; // "c1"
  claim_quote: string; // verbatim
  seems_to_conclude: string; // what the person appears to infer
  rests_on: string; // the unstated link
  support: Support;
  question: string;
}

export interface BlindSpot {
  id: string; // "b1"
  type:
    | "missing_factor"
    | "hidden_assumption"
    | "trade_off"
    | "goal_conflict"
    | "second_order"
    | "uncertainty";
  applies_to: Side;
  title: string; // max 8 words, neutral
  what_is_unexamined: string;
  why_it_matters: string; // must tie to the person's own words
  user_quote: string; // verbatim or ""
  question: string;
  significance: "high" | "medium"; // how much it could change understanding
}

export interface Tension {
  id: string; // "t1"
  goal_a: string;
  goal_a_quote: string;
  goal_b: string;
  goal_b_quote: string;
  why_they_pull_apart: string;
}

export interface Scrutiny {
  option_id: "A" | "B";
  least_examined_assumption: string;
  what_you_would_need_to_know: string;
}

export interface CoverageItem {
  area: Area;
  status: "weighed" | "mentioned_lightly" | "not_mentioned";
  note: string;
}

export interface RankedQuestion {
  rank: 1 | 2 | 3 | 4 | 5;
  question: string;
  linked_to: string;
  why_first: string;
}

export interface SecondLook {
  mode: "analysis" | "needs_detail" | "not_a_decision" | "support_first";
  user_note: string; // "" when nothing to say
  decision: {
    question: string; // restated, neutral
    options: DecisionOption[]; // exactly 2
  };
  reading_of_reasoning: string; // max 2 sentences, "Here is how I read your thinking..."
  considered: ConsideredFactor[];
  reasoning_chains: ReasoningChain[];
  blind_spots: BlindSpot[];
  tensions: Tension[];
  scrutiny: Scrutiny[];
  coverage: CoverageItem[];
  questions: RankedQuestion[];
  meta?: {
    model?: string;
    retries?: number;
    cached?: boolean;
    balanceWarning?: boolean;
  };
}

export interface AnalyzeInput {
  decision: string;
  optionA?: string;
  optionB?: string;
  pulling: string;
  worries?: string;
  context?: string;
  answers?: { question: string; answer: string }[];
}
