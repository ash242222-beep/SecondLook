import React, { useState } from "react";
import { RankedQuestion } from "../../core/types.ts";
import { HelpCircle, Sparkles, Send, MessageSquareQuote } from "lucide-react";

interface QuestionListProps {
  questions: RankedQuestion[];
  onReflectSubmit: (answers: { question: string; answer: string }[]) => void;
  isReflecting: boolean;
}

export const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  onReflectSubmit,
  isReflecting,
}) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleTextChange = (rank: number, val: string) => {
    setAnswers((prev) => ({ ...prev, [rank]: val }));
  };

  const handleReflect = () => {
    const answeredList = questions
      .filter((q) => answers[q.rank] && answers[q.rank].trim().length > 0)
      .map((q) => ({
        question: q.question,
        answer: answers[q.rank].trim(),
      }));

    if (answeredList.length > 0) {
      onReflectSubmit(answeredList);
    }
  };

  const hasAnyAnswer = Object.values(answers).some((val) => val.trim().length > 0);

  return (
    <div className="space-y-4">
      <div className="pb-2 border-b border-[#E4DED3] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <p className="text-xs sm:text-sm text-[#1B1B1F]/70">
          Ranked strictly by how much answering could shift your fundamental understanding of the choice.
        </p>
        <span className="text-xs text-[#0F766E] font-medium">
          Answer any below to refine your analysis
        </span>
      </div>

      <div className="space-y-4">
        {questions.map((q) => (
          <div
            key={q.rank}
            className="bg-white rounded-xl border border-[#E4DED3] p-5 shadow-2xs hover:border-[#1B1B1F]/30 transition-colors space-y-3"
          >
            {/* Rank badge + Question */}
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#1B1B1F] text-white flex items-center justify-center font-serif-heading font-bold text-xs flex-shrink-0 mt-0.5">
                {q.rank}
              </div>
              <div className="flex-1">
                <h4 className="font-serif-heading font-semibold text-base sm:text-lg text-[#1B1B1F] leading-snug">
                  {q.question}
                </h4>
                <div className="bg-[#FAF7F2] rounded-lg p-2.5 border border-[#E4DED3]/70 mt-2 text-xs text-[#1B1B1F]/80">
                  <span className="font-semibold text-[#1B1B1F] block text-[11px] mb-0.5">
                    Why prioritized at #{q.rank}:
                  </span>
                  {q.why_first}
                </div>
              </div>
            </div>

            {/* Answer reflection box */}
            <div className="pt-2">
              <label
                htmlFor={`answer-${q.rank}`}
                className="block text-[11px] font-semibold uppercase tracking-wider text-[#1B1B1F]/60 mb-1"
              >
                Your reflection / answer (optional):
              </label>
              <textarea
                id={`answer-${q.rank}`}
                rows={2}
                value={answers[q.rank] || ""}
                onChange={(e) => handleTextChange(q.rank, e.target.value)}
                placeholder="Type your preliminary thought or facts on this question..."
                className="w-full px-3 py-2 rounded-lg border border-[#E4DED3] bg-[#FAF7F2]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]/30 focus:border-[#0F766E] text-xs sm:text-sm text-[#1B1B1F] placeholder:text-[#1B1B1F]/40 transition resize-y"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Reflect action card */}
      <div className="bg-teal-50/40 rounded-2xl border border-teal-200/80 p-5 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-serif-heading font-medium text-base text-[#0F766E]">
            Ready to look deeper with your answers?
          </h4>
          <p className="text-xs sm:text-sm text-[#1B1B1F]/70 mt-0.5">
            Type answers into any questions above and take a refined second look with updated reasoning.
          </p>
        </div>

        <button
          type="button"
          disabled={!hasAnyAnswer || isReflecting}
          onClick={handleReflect}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer shadow-xs flex-shrink-0 ${
            hasAnyAnswer && !isReflecting
              ? "bg-[#0F766E] hover:bg-[#0c5c56] text-white active:scale-[0.98]"
              : "bg-[#1B1B1F]/20 text-white/70 cursor-not-allowed"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Look again with my answers</span>
        </button>
      </div>
    </div>
  );
};
