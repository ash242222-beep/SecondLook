import React from "react";
import { BlindSpot, DecisionOption, Side } from "../../core/types.ts";
import { HelpCircle, AlertCircle, Quote } from "lucide-react";

interface BlindSpotsGridProps {
  blindSpots: BlindSpot[];
  options: DecisionOption[];
}

export const BlindSpotsGrid: React.FC<BlindSpotsGridProps> = ({
  blindSpots,
  options,
}) => {
  const optA = options.find((o) => o.id === "A") || { id: "A", label: "Option A", inferred: false };
  const optB = options.find((o) => o.id === "B") || { id: "B", label: "Option B", inferred: false };

  const spotsA = blindSpots.filter((b) => b.applies_to === "A");
  const spotsB = blindSpots.filter((b) => b.applies_to === "B");
  const spotsBoth = blindSpots.filter((b) => b.applies_to === "both");

  const getTypeLabel = (type: BlindSpot["type"]) => {
    switch (type) {
      case "missing_factor":
        return "Missing Factor";
      case "hidden_assumption":
        return "Hidden Assumption";
      case "trade_off":
        return "Trade-off";
      case "goal_conflict":
        return "Goal Conflict";
      case "second_order":
        return "Second-Order Effect";
      case "uncertainty":
        return "Unexamined Uncertainty";
    }
  };

  const renderCard = (spot: BlindSpot, sideColor: "teal" | "plum" | "grey") => {
    const borderColor =
      sideColor === "teal"
        ? "border-teal-200 hover:border-[#0F766E]/50"
        : sideColor === "plum"
        ? "border-purple-200 hover:border-[#7C2D6B]/50"
        : "border-[#E4DED3] hover:border-[#1B1B1F]/30";

    const quoteBorder =
      sideColor === "teal"
        ? "border-[#0F766E]"
        : sideColor === "plum"
        ? "border-[#7C2D6B]"
        : "border-stone-500";

    return (
      <div
        key={spot.id}
        className={`bg-white rounded-xl border ${borderColor} p-4 shadow-2xs transition-all space-y-3 flex flex-col justify-between`}
      >
        <div>
          {/* Header & Badges */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1B1B1F]/60">
              {getTypeLabel(spot.type)}
            </span>
            {spot.significance === "high" && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                Key Lever
              </span>
            )}
          </div>

          {/* Title */}
          <h4 className="font-serif-heading font-semibold text-sm sm:text-base text-[#1B1B1F] leading-snug">
            {spot.title}
          </h4>

          {/* What is unexamined */}
          <p className="text-xs sm:text-sm text-[#1B1B1F]/80 mt-2 leading-relaxed">
            {spot.what_is_unexamined}
          </p>

          {/* User quote */}
          {spot.user_quote && (
            <div className="my-2.5">
              <blockquote className={`border-l-3 ${quoteBorder} pl-2.5 italic text-xs text-[#1B1B1F]/70 font-medium`}>
                "{spot.user_quote}"
              </blockquote>
            </div>
          )}

          {/* Why it matters */}
          <div className="bg-[#FAF7F2] rounded-lg p-2.5 border border-[#E4DED3]/60 text-xs text-[#1B1B1F]/85 mt-2">
            <span className="font-semibold text-[#1B1B1F] block text-[11px] mb-0.5">
              Why this matters to your situation:
            </span>
            {spot.why_it_matters}
          </div>
        </div>

        {/* Question attached */}
        <div className="pt-2 border-t border-[#E4DED3]/50 text-xs text-[#1B1B1F]/90 flex items-start gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-[#0F766E] flex-shrink-0 mt-0.5" />
          <span className="font-medium italic leading-snug">
            {spot.question}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 pb-2 border-b border-[#E4DED3]">
        <p className="text-xs sm:text-sm text-[#1B1B1F]/70">
          Scrutinizing both paths with equal rigor, plus factors applying to either choice.
        </p>
        <span className="text-xs font-medium text-[#1B1B1F]/60">
          {blindSpots.length} areas mapped
        </span>
      </div>

      {/* 3 Equal columns on desktop (>=900px) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
        {/* Column 1: Option A (Teal) */}
        <div className="space-y-3 bg-teal-50/20 p-3 sm:p-4 rounded-2xl border border-teal-200/60">
          <div className="flex items-center justify-between pb-2 border-b border-teal-200/80">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#0F766E]" />
              <h3 className="font-serif-heading font-semibold text-sm text-[#0F766E] line-clamp-1">
                {optA.label}
              </h3>
            </div>
            <span className="text-xs font-mono text-[#0F766E]/70 font-medium">
              {spotsA.length}
            </span>
          </div>
          {optA.inferred && (
            <span className="text-[11px] text-[#0F766E]/70 italic block">
              (inferred alternative)
            </span>
          )}
          <div className="space-y-3">
            {spotsA.map((spot) => renderCard(spot, "teal"))}
          </div>
        </div>

        {/* Column 2: Option B (Plum) */}
        <div className="space-y-3 bg-purple-50/20 p-3 sm:p-4 rounded-2xl border border-purple-200/60">
          <div className="flex items-center justify-between pb-2 border-b border-purple-200/80">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#7C2D6B]" />
              <h3 className="font-serif-heading font-semibold text-sm text-[#7C2D6B] line-clamp-1">
                {optB.label}
              </h3>
            </div>
            <span className="text-xs font-mono text-[#7C2D6B]/70 font-medium">
              {spotsB.length}
            </span>
          </div>
          {optB.inferred && (
            <span className="text-[11px] text-[#7C2D6B]/70 italic block">
              (inferred alternative)
            </span>
          )}
          <div className="space-y-3">
            {spotsB.map((spot) => renderCard(spot, "plum"))}
          </div>
        </div>

        {/* Column 3: Either Way (Neutral Grey) */}
        <div className="space-y-3 bg-stone-50/50 p-3 sm:p-4 rounded-2xl border border-[#E4DED3]">
          <div className="flex items-center justify-between pb-2 border-b border-[#E4DED3]">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-stone-500" />
              <h3 className="font-serif-heading font-semibold text-sm text-stone-700">
                Either Way
              </h3>
            </div>
            <span className="text-xs font-mono text-stone-600 font-medium">
              {spotsBoth.length}
            </span>
          </div>
          <div className="space-y-3">
            {spotsBoth.map((spot) => renderCard(spot, "grey"))}
          </div>
        </div>
      </div>
    </div>
  );
};
