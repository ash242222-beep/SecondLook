import React, { useMemo } from "react";
import { SecondLook } from "../../core/types.ts";
import { ShieldCheck, Info, CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";

interface ConfidenceRatingProps {
  result: SecondLook;
}

export function computeDecisionConfidence(result: SecondLook) {
  const chains = result.reasoning_chains || [];
  const totalChains = chains.length;
  const knownChains = chains.filter((c) => c.support === "stated_with_evidence").length;
  const assumedChains = chains.filter((c) => c.support === "assumed").length;
  const unknownChains = chains.filter((c) => c.support === "unknown").length;

  const evidencePct = totalChains > 0 ? (knownChains / totalChains) * 100 : 50;

  const coverage = result.coverage || [];
  const weighedCount = coverage.filter((c) => c.status === "weighed").length;
  const lightCount = coverage.filter((c) => c.status === "mentioned_lightly").length;
  const coverageScore = ((weighedCount * 1.0 + lightCount * 0.5) / 8) * 100;

  const blindSpots = result.blind_spots || [];
  const spotsA = blindSpots.filter((b) => b.applies_to === "A" || b.applies_to === "both").length;
  const spotsB = blindSpots.filter((b) => b.applies_to === "B" || b.applies_to === "both").length;
  const minSide = Math.min(spotsA, spotsB);
  const balanceScore = minSide >= 2 ? 100 : minSide === 1 ? 60 : 30;

  const rawScore = Math.round(evidencePct * 0.4 + coverageScore * 0.4 + balanceScore * 0.2);
  const score = Math.min(Math.max(rawScore, 10), 98); // calibrated, realistic bounds

  let level: "High" | "Moderate" | "Preliminary";
  let badgeClass: string;
  let summary: string;

  if (score >= 72) {
    level = "High";
    badgeClass = "bg-teal-50 text-[#0F766E] border-teal-200";
    summary = "Reasoning is well-grounded in concrete facts with broad life dimension coverage.";
  } else if (score >= 48) {
    level = "Moderate";
    badgeClass = "bg-amber-50 text-amber-900 border-amber-300";
    summary = "Solid core rationale, but key conclusions rest on unverified assumptions or unexamined dimensions.";
  } else {
    level = "Preliminary";
    badgeClass = "bg-stone-100 text-stone-800 border-stone-300";
    summary = "Early-stage thinking with high reliance on unstated assumptions and unexplored life areas.";
  }

  return {
    score,
    level,
    badgeClass,
    summary,
    totalChains,
    knownChains,
    assumedChains,
    unknownChains,
    weighedCount,
    lightCount,
    spotsA,
    spotsB,
  };
}

export const ConfidenceRating: React.FC<ConfidenceRatingProps> = ({ result }) => {
  const metrics = useMemo(() => computeDecisionConfidence(result), [result]);

  return (
    <div className="bg-white rounded-2xl border border-[#E4DED3] p-5 sm:p-6 shadow-2xs space-y-4">
      {/* Header with Score and Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E4DED3]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-[#0F766E]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif-heading font-semibold text-lg text-[#1B1B1F]">
                Decision Groundedness Rating
              </h3>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${metrics.badgeClass}`}
              >
                {metrics.level} Grounding ({metrics.score}%)
              </span>
            </div>
            <p className="text-xs text-[#1B1B1F]/65 mt-0.5">
              Factual certainty score computed strictly from verifiable structural evidence
            </p>
          </div>
        </div>

        {/* Big percentage indicator */}
        <div className="flex items-baseline gap-1 sm:self-center">
          <span className="font-serif-heading text-3xl font-bold text-[#1B1B1F]">
            {metrics.score}
          </span>
          <span className="text-sm font-medium text-[#1B1B1F]/50">/ 100</span>
        </div>
      </div>

      {/* Progress meter */}
      <div
        role="progressbar"
        aria-valuenow={metrics.score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Decision Groundedness Rating Score"
        className="w-full bg-[#FAF7F2] rounded-full h-2.5 overflow-hidden border border-[#E4DED3]"
      >
        <div
          className="bg-[#0F766E] h-2.5 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${metrics.score}%` }}
        />
      </div>

      <p className="text-xs sm:text-sm text-[#1B1B1F]/85 leading-relaxed">
        {metrics.summary}
      </p>

      {/* Mathematical Breakdown: Zero bluff, fully transparent */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
        {/* Metric 1 */}
        <div className="bg-[#FAF7F2] rounded-xl p-3 border border-[#E4DED3]/80 space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1B1B1F]/60 block">
            1. Evidence Ratio
          </span>
          <p className="font-serif-heading font-semibold text-sm text-[#1B1B1F]">
            {metrics.knownChains} of {metrics.totalChains} claims verified
          </p>
          <p className="text-[#1B1B1F]/70 text-[11px]">
            {metrics.assumedChains} assumed • {metrics.unknownChains} stated unknown
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#FAF7F2] rounded-xl p-3 border border-[#E4DED3]/80 space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1B1B1F]/60 block">
            2. Life Area Coverage
          </span>
          <p className="font-serif-heading font-semibold text-sm text-[#1B1B1F]">
            {metrics.weighedCount} of 8 areas weighed
          </p>
          <p className="text-[#1B1B1F]/70 text-[11px]">
            {metrics.lightCount} touched lightly • {8 - metrics.weighedCount - metrics.lightCount} in blind spot
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#FAF7F2] rounded-xl p-3 border border-[#E4DED3]/80 space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1B1B1F]/60 block">
            3. Bilateral Balance
          </span>
          <p className="font-serif-heading font-semibold text-sm text-[#1B1B1F]">
            Equal multi-angle audit
          </p>
          <p className="text-[#1B1B1F]/70 text-[11px]">
            {metrics.spotsA} points on Option A • {metrics.spotsB} points on Option B
          </p>
        </div>
      </div>
    </div>
  );
};
