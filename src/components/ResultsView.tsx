import React, { useRef } from "react";
import { SecondLook, AnalyzeInput } from "../../core/types.ts";
import { ReasoningChains } from "./ReasoningChains.tsx";
import { BlindSpotsGrid } from "./BlindSpotsGrid.tsx";
import { TensionMap } from "./TensionMap.tsx";
import { CoverageStrip } from "./CoverageStrip.tsx";
import { ScrutinyCards } from "./ScrutinyCards.tsx";
import { QuestionList } from "./QuestionList.tsx";
import { ConfidenceRating } from "./ConfidenceRating.tsx";
import {
  Compass,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowUp,
  FileCheck,
  Scale,
  Brain,
  Layers,
  Split,
  PieChart,
  ShieldCheck,
} from "lucide-react";

interface ResultsViewProps {
  result: SecondLook;
  originalInput: AnalyzeInput;
  onReflectSubmit: (answers: { question: string; answer: string }[]) => void;
  isReflecting: boolean;
  onStartOver: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  result,
  originalInput,
  onReflectSubmit,
  isReflecting,
  onStartOver,
}) => {
  const confidenceRef = useRef<HTMLDivElement>(null);
  const thinkingRef = useRef<HTMLDivElement>(null);
  const chainsRef = useRef<HTMLDivElement>(null);
  const blindSpotsRef = useRef<HTMLDivElement>(null);
  const tensionsRef = useRef<HTMLDivElement>(null);
  const coverageRef = useRef<HTMLDivElement>(null);
  const questionsRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const isCachedSample = result.meta?.cached === true;

  return (
    <div className="w-full max-w-[880px] mx-auto py-6 px-4 sm:px-6 space-y-10 animate-in fade-in duration-300">
      {/* Top Banner / Sample label */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-[#E4DED3] rounded-2xl p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#0F766E]">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif-heading font-semibold text-base sm:text-lg text-[#1B1B1F]">
                Second Look Analysis
              </span>
              {isCachedSample && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-teal-50 text-[#0F766E] border border-teal-200">
                  Example analysis (pre-generated)
                </span>
              )}
            </div>
            <p className="text-xs text-[#1B1B1F]/60">
              Examining reasoning chains, both-side blind spots, tensions, and coverage
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#FAF7F2] border border-[#E4DED3] text-[#1B1B1F]/80">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>Factual Evidence Engine</span>
          </div>
        </div>
      </div>

      {/* Decision Restatement Banner */}
      <div className="bg-[#FAF7F2] rounded-2xl border border-[#E4DED3] p-5 sm:p-6 space-y-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1B1B1F]/50 block mb-1">
            Decision under examination
          </span>
          <h2
            id="results-title"
            tabIndex={-1}
            className="font-serif-heading text-xl sm:text-2xl font-medium text-[#1B1B1F] leading-snug focus:outline-none"
          >
            {result.decision.question}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {result.decision.options.map((opt) => {
            const isA = opt.id === "A";
            return (
              <div
                key={opt.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-2 ${
                  isA
                    ? "bg-teal-50/40 border-teal-200/80"
                    : "bg-purple-50/30 border-purple-200/80"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isA ? "bg-[#0F766E]" : "bg-[#7C2D6B]"
                    }`}
                  />
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      isA ? "text-[#0F766E]" : "text-[#7C2D6B]"
                    }`}
                  >
                    Option {opt.id}:
                  </span>
                  <span className="text-sm font-medium text-[#1B1B1F]">
                    {opt.label}
                  </span>
                </div>
                {opt.inferred && (
                  <span className="text-[11px] text-[#1B1B1F]/50 italic">
                    (inferred)
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* User Note if present */}
        {result.user_note && (
          <div className="bg-white rounded-xl p-3.5 border border-[#E4DED3] text-xs sm:text-sm text-[#1B1B1F]/80 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#0F766E] flex-shrink-0 mt-0.5" />
            <p>{result.user_note}</p>
          </div>
        )}

        {/* Balance Warning if flagged */}
        {result.meta?.balanceWarning && (
          <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Notice:</strong> This pass looked harder at one option than the other. We maintain full transparency regarding unequal prompt depth.
            </p>
          </div>
        )}
      </div>

      {/* Anchor Navigation Bar */}
      <nav
        aria-label="Analysis sections"
        className="sticky top-14 z-20 bg-[#FAF7F2]/90 backdrop-blur-xs py-2 border-y border-[#E4DED3] -mx-4 px-4 sm:mx-0 sm:px-0 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs"
      >
        <span className="text-[#1B1B1F]/40 font-medium px-1 flex-shrink-0">Jump to:</span>
        <button
          onClick={() => scrollTo(confidenceRef)}
          className="px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-[#0F766E] font-medium hover:bg-teal-100/80 whitespace-nowrap transition cursor-pointer flex items-center gap-1"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Confidence Rating</span>
        </button>
        <button
          onClick={() => scrollTo(thinkingRef)}
          className="px-2.5 py-1 rounded-lg bg-white border border-[#E4DED3] hover:bg-[#FAF7F2] text-[#1B1B1F]/80 hover:text-[#1B1B1F] whitespace-nowrap transition cursor-pointer"
        >
          Reading
        </button>
        <button
          onClick={() => scrollTo(chainsRef)}
          className="px-2.5 py-1 rounded-lg bg-white border border-[#E4DED3] hover:bg-[#FAF7F2] text-[#1B1B1F]/80 hover:text-[#1B1B1F] whitespace-nowrap transition cursor-pointer"
        >
          Reasoning Chains
        </button>
        <button
          onClick={() => scrollTo(blindSpotsRef)}
          className="px-2.5 py-1 rounded-lg bg-white border border-[#E4DED3] hover:bg-[#FAF7F2] text-[#1B1B1F]/80 hover:text-[#1B1B1F] whitespace-nowrap transition cursor-pointer"
        >
          Unexamined Paths
        </button>
        <button
          onClick={() => scrollTo(tensionsRef)}
          className="px-2.5 py-1 rounded-lg bg-white border border-[#E4DED3] hover:bg-[#FAF7F2] text-[#1B1B1F]/80 hover:text-[#1B1B1F] whitespace-nowrap transition cursor-pointer"
        >
          Goal Tensions
        </button>
        <button
          onClick={() => scrollTo(coverageRef)}
          className="px-2.5 py-1 rounded-lg bg-white border border-[#E4DED3] hover:bg-[#FAF7F2] text-[#1B1B1F]/80 hover:text-[#1B1B1F] whitespace-nowrap transition cursor-pointer"
        >
          Life Area Coverage
        </button>
        <button
          onClick={() => scrollTo(questionsRef)}
          className="px-2.5 py-1 rounded-lg bg-[#1B1B1F] text-white border border-[#1B1B1F] hover:bg-[#0F766E] whitespace-nowrap transition cursor-pointer flex items-center gap-1"
        >
          <span>5 Ranked Questions</span>
        </button>
      </nav>

      {/* Decision Confidence Rating (Genuine Factual Breakdown) */}
      <section ref={confidenceRef}>
        <ConfidenceRating result={result} />
      </section>

      {/* Section 1: How we read your thinking */}
      <section ref={thinkingRef} className="space-y-4 pt-2">
        <h2 className="font-serif-heading text-2xl font-semibold text-[#1B1B1F] flex items-center gap-2">
          <Brain className="w-5 h-5 text-[#0F766E]" />
          <span>How we read your thinking</span>
        </h2>

        <div className="bg-white rounded-2xl border border-[#E4DED3] p-6 shadow-2xs space-y-4">
          <p className="text-base sm:text-lg text-[#1B1B1F] leading-relaxed font-serif-heading font-normal">
            {result.reading_of_reasoning}
          </p>

          {/* Stated factors */}
          <div className="pt-4 border-t border-[#E4DED3]">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1B1B1F]/50 block mb-2">
              Factors you have weighed so far
            </span>
            <div className="flex flex-wrap gap-2">
              {result.considered.map((c, i) => {
                const isA = c.side === "A";
                const isB = c.side === "B";
                const border = isA
                  ? "border-teal-200 bg-teal-50/40 text-teal-900"
                  : isB
                  ? "border-purple-200 bg-purple-50/30 text-purple-900"
                  : "border-[#E4DED3] bg-[#FAF7F2] text-[#1B1B1F]";

                return (
                  <div
                    key={i}
                    className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-2 ${border}`}
                  >
                    <span className="font-medium">{c.factor}</span>
                    {c.user_quote && (
                      <span className="italic opacity-60 text-[11px]">
                        "{c.user_quote}"
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: What your conclusions rest on */}
      <section ref={chainsRef} className="space-y-4 pt-4">
        <h2 className="font-serif-heading text-2xl font-semibold text-[#1B1B1F] flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#0F766E]" />
          <span>What your conclusions rest on</span>
        </h2>
        <ReasoningChains chains={result.reasoning_chains} />
      </section>

      {/* Section 3: What each path hasn't examined */}
      <section ref={blindSpotsRef} className="space-y-4 pt-4">
        <h2 className="font-serif-heading text-2xl font-semibold text-[#1B1B1F] flex items-center gap-2">
          <Scale className="w-5 h-5 text-[#0F766E]" />
          <span>What each path hasn't examined</span>
        </h2>
        <BlindSpotsGrid
          blindSpots={result.blind_spots}
          options={result.decision.options}
        />

        {/* Detailed scrutiny comparison */}
        <div className="pt-4">
          <ScrutinyCards
            scrutiny={result.scrutiny}
            options={result.decision.options}
          />
        </div>
      </section>

      {/* Section 4: Where your goals pull apart */}
      <section ref={tensionsRef} className="space-y-4 pt-4">
        <h2 className="font-serif-heading text-2xl font-semibold text-[#1B1B1F] flex items-center gap-2">
          <Split className="w-5 h-5 text-[#0F766E]" />
          <span>Where your goals pull apart</span>
        </h2>
        <TensionMap tensions={result.tensions} />
      </section>

      {/* Section 5: What you've weighed so far */}
      <section ref={coverageRef} className="space-y-4 pt-4">
        <h2 className="font-serif-heading text-2xl font-semibold text-[#1B1B1F] flex items-center gap-2">
          <PieChart className="w-5 h-5 text-[#0F766E]" />
          <span>What you've weighed so far</span>
        </h2>
        <CoverageStrip coverage={result.coverage} />
      </section>

      {/* Section 6: Questions worth answering first */}
      <section ref={questionsRef} className="space-y-4 pt-4">
        <h2 className="font-serif-heading text-2xl font-semibold text-[#1B1B1F] flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#0F766E]" />
          <span>Questions worth answering first</span>
        </h2>
        <QuestionList
          questions={result.questions}
          onReflectSubmit={onReflectSubmit}
          isReflecting={isReflecting}
        />
      </section>

      {/* Footer / Summary */}
      <footer className="pt-12 pb-8 border-t border-[#E4DED3] text-center space-y-4">
        <p className="font-serif-heading text-xl sm:text-2xl font-medium text-[#1B1B1F] tracking-tight">
          Clear, grounded perspective for your next step.
        </p>
        <p className="text-xs text-[#1B1B1F]/60 max-w-md mx-auto">
          Second Look maps your reasoning, exposes unstated assumptions, and verifies coverage across key life dimensions.
        </p>

        <div className="pt-2">
          <button
            onClick={onStartOver}
            className="px-5 py-2.5 rounded-xl border border-[#E4DED3] bg-white hover:bg-[#FAF7F2] text-xs font-medium text-[#1B1B1F] transition cursor-pointer"
          >
            Start another decision
          </button>
        </div>
      </footer>
    </div>
  );
};

