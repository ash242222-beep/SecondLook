import React, { useState } from "react";
import { ReasoningChain, Support } from "../../core/types.ts";
import { HelpCircle, Link2, Quote } from "lucide-react";

interface ReasoningChainsProps {
  chains: ReasoningChain[];
}

export const ReasoningChains: React.FC<ReasoningChainsProps> = ({ chains }) => {
  const [activeFilter, setActiveFilter] = useState<"all" | Support>("all");

  const filteredChains =
    activeFilter === "all"
      ? chains
      : chains.filter((c) => c.support === activeFilter);

  const getChip = (support: Support) => {
    switch (support) {
      case "stated_with_evidence":
        return {
          icon: "●",
          label: "Known",
          desc: "Stated with concrete evidence",
          badgeClass: "bg-stone-100 text-stone-800 border-stone-300",
        };
      case "assumed":
        return {
          icon: "◐",
          label: "Assumed",
          desc: "Conclusion drawn without explicit evidence",
          badgeClass: "bg-amber-50 text-amber-900 border-amber-300/80",
        };
      case "unknown":
        return {
          icon: "○",
          label: "Unknown",
          desc: "Acknowledged as an unknown or worry",
          badgeClass: "bg-sky-50 text-sky-900 border-sky-300/80",
        };
    }
  };

  const countFor = (support: Support) =>
    chains.filter((c) => c.support === support).length;

  return (
    <div className="space-y-4">
      {/* Subheader & K/A/U Filter tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E4DED3]">
        <p className="text-xs sm:text-sm text-[#1B1B1F]/70">
          Showing how conclusions are drawn and what unstated assumptions they rest on.
        </p>

        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
              activeFilter === "all"
                ? "bg-[#1B1B1F] text-white border-[#1B1B1F]"
                : "bg-white text-[#1B1B1F]/70 border-[#E4DED3] hover:bg-[#FAF7F2]"
            }`}
          >
            All ({chains.length})
          </button>
          <button
            onClick={() => setActiveFilter("stated_with_evidence")}
            className={`px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1 cursor-pointer ${
              activeFilter === "stated_with_evidence"
                ? "bg-[#1B1B1F] text-white border-[#1B1B1F]"
                : "bg-white text-[#1B1B1F]/70 border-[#E4DED3] hover:bg-[#FAF7F2]"
            }`}
          >
            <span>●</span>
            <span>Known ({countFor("stated_with_evidence")})</span>
          </button>
          <button
            onClick={() => setActiveFilter("assumed")}
            className={`px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1 cursor-pointer ${
              activeFilter === "assumed"
                ? "bg-[#1B1B1F] text-white border-[#1B1B1F]"
                : "bg-white text-[#1B1B1F]/70 border-[#E4DED3] hover:bg-[#FAF7F2]"
            }`}
          >
            <span>◐</span>
            <span>Assumed ({countFor("assumed")})</span>
          </button>
          <button
            onClick={() => setActiveFilter("unknown")}
            className={`px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1 cursor-pointer ${
              activeFilter === "unknown"
                ? "bg-[#1B1B1F] text-white border-[#1B1B1F]"
                : "bg-white text-[#1B1B1F]/70 border-[#E4DED3] hover:bg-[#FAF7F2]"
            }`}
          >
            <span>○</span>
            <span>Unknown ({countFor("unknown")})</span>
          </button>
        </div>
      </div>

      {/* Cards list */}
      <div className="grid grid-cols-1 gap-4">
        {filteredChains.map((chain) => {
          const chip = getChip(chain.support);
          return (
            <div
              key={chain.id}
              className="bg-white rounded-xl border border-[#E4DED3] p-5 shadow-2xs hover:border-[#1B1B1F]/30 transition-colors"
            >
              {/* Top row: claim quote & tag */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1B1B1F]/50 block mb-1">
                    Your stated claim
                  </span>
                  {chain.claim_quote ? (
                    <blockquote className="border-l-3 border-[#0F766E] pl-3 italic text-sm text-[#1B1B1F] font-medium">
                      "{chain.claim_quote}"
                    </blockquote>
                  ) : (
                    <span className="text-xs text-[#1B1B1F]/60 italic">
                      [General premise derived from your input]
                    </span>
                  )}
                </div>

                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${chip.badgeClass}`}
                  title={chip.desc}
                >
                  <span className="text-sm leading-none">{chip.icon}</span>
                  <span>{chip.label}</span>
                </div>
              </div>

              {/* Middle row: inference and unstated link */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 my-3 pt-3 border-t border-[#E4DED3]/60 text-xs sm:text-sm">
                <div className="bg-[#FAF7F2] rounded-lg p-3 border border-[#E4DED3]/60">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1B1B1F]/60 block mb-1">
                    What this inferentially concludes
                  </span>
                  <p className="text-[#1B1B1F] leading-snug">
                    {chain.seems_to_conclude}
                  </p>
                </div>

                <div className="bg-amber-50/50 rounded-lg p-3 border border-amber-200/60">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-900/80 block mb-1 flex items-center gap-1">
                    <Link2 className="w-3 h-3 text-amber-700" /> What this unstatedly rests on
                  </span>
                  <p className="text-[#1B1B1F] leading-snug">
                    {chain.rests_on}
                  </p>
                </div>
              </div>

              {/* Bottom row: Probing question */}
              <div className="mt-3 pt-2 text-xs sm:text-sm flex items-start gap-2 text-[#0F766E]">
                <HelpCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p className="font-medium text-[#1B1B1F]/90">
                  <span className="text-[#0F766E] font-semibold">Test question: </span>
                  {chain.question}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
