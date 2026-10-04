import React from "react";
import { CoverageItem, Area } from "../../core/types.ts";
import { CheckCircle2, MinusCircle, CircleDashed } from "lucide-react";

interface CoverageStripProps {
  coverage: CoverageItem[];
}

const AREA_LABELS: Record<Area, string> = {
  money: "Money & Financials",
  time_and_workload: "Time & Workload",
  learning_and_growth: "Learning & Growth",
  people_and_relationships: "People & Relationships",
  health_and_wellbeing: "Health & Well-being",
  long_term_path: "Long-Term Path",
  reversibility_and_exit: "Reversibility & Exit",
  values_and_identity: "Values & Identity",
};

export const CoverageStrip: React.FC<CoverageStripProps> = ({ coverage }) => {
  const getStatusBadge = (status: CoverageItem["status"]) => {
    switch (status) {
      case "weighed":
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-stone-800" />,
          label: "Weighed",
          chipClass: "bg-stone-200 text-stone-900 border-stone-300",
        };
      case "mentioned_lightly":
        return {
          icon: <MinusCircle className="w-3.5 h-3.5 text-amber-700" />,
          label: "Touched lightly",
          chipClass: "bg-amber-100 text-amber-900 border-amber-300",
        };
      case "not_mentioned":
        return {
          icon: <CircleDashed className="w-3.5 h-3.5 text-stone-400" />,
          label: "Unexplored",
          chipClass: "bg-[#FAF7F2] text-stone-500 border-[#E4DED3]",
        };
    }
  };

  const weighedCount = coverage.filter((c) => c.status === "weighed").length;
  const lightlyCount = coverage.filter((c) => c.status === "mentioned_lightly").length;
  const unmentionedCount = coverage.filter((c) => c.status === "not_mentioned").length;

  return (
    <div className="space-y-4">
      {/* Summary count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E4DED3] text-xs sm:text-sm">
        <p className="text-[#1B1B1F]/70">
          Auditing what core human life areas are considered vs. currently in your blind spot.
        </p>
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="text-stone-800">{weighedCount} weighed</span>
          <span className="text-stone-300">•</span>
          <span className="text-amber-800">{lightlyCount} light</span>
          <span className="text-stone-300">•</span>
          <span className="text-stone-500">{unmentionedCount} overlooked</span>
        </div>
      </div>

      {/* Grid of 8 areas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {coverage.map((item) => {
          const badge = getStatusBadge(item.status);
          const isOverlooked = item.status === "not_mentioned";

          return (
            <div
              key={item.area}
              className={`rounded-xl border p-3.5 transition-colors flex flex-col justify-between ${
                isOverlooked
                  ? "bg-[#FAF7F2]/40 border-dashed border-[#E4DED3]"
                  : "bg-white border-[#E4DED3] shadow-2xs"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="font-serif-heading font-medium text-xs sm:text-sm text-[#1B1B1F]">
                    {AREA_LABELS[item.area] || item.area}
                  </span>
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.chipClass}`}
                  >
                    {badge.icon}
                    <span>{badge.label}</span>
                  </div>
                </div>

                <p className="text-xs text-[#1B1B1F]/75 leading-relaxed mt-1">
                  {item.note}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
