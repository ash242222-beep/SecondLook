import React from "react";
import { Scrutiny, DecisionOption } from "../../core/types.ts";
import { Search, Compass } from "lucide-react";

interface ScrutinyCardsProps {
  scrutiny: Scrutiny[];
  options: DecisionOption[];
}

export const ScrutinyCards: React.FC<ScrutinyCardsProps> = ({
  scrutiny,
  options,
}) => {
  const getOpt = (id: "A" | "B") =>
    options.find((o) => o.id === id) || { id, label: `Option ${id}`, inferred: false };

  return (
    <div className="space-y-4">
      <p className="text-xs sm:text-sm text-[#1B1B1F]/70 pb-2 border-b border-[#E4DED3]">
        Where each alternative currently has the thinnest evidence foundation.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scrutiny.map((item) => {
          const opt = getOpt(item.option_id);
          const isA = item.option_id === "A";

          return (
            <div
              key={item.option_id}
              className={`rounded-xl border p-5 bg-white shadow-2xs space-y-3 ${
                isA
                  ? "border-teal-200/90 hover:border-[#0F766E]/50"
                  : "border-purple-200/90 hover:border-[#7C2D6B]/50"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    isA ? "bg-[#0F766E]" : "bg-[#7C2D6B]"
                  }`}
                />
                <span
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    isA ? "text-[#0F766E]" : "text-[#7C2D6B]"
                  }`}
                >
                  Under the microscope: {opt.label}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1B1B1F]/50 block mb-1">
                  Least-examined assumption
                </span>
                <p className="text-sm text-[#1B1B1F] leading-snug font-medium">
                  {item.least_examined_assumption}
                </p>
              </div>

              <div className="bg-[#FAF7F2] rounded-lg p-3 border border-[#E4DED3]/70 text-xs sm:text-sm">
                <span className="font-semibold text-[#1B1B1F] flex items-center gap-1.5 mb-1 text-xs">
                  <Search className="w-3.5 h-3.5 text-[#0F766E]" />
                  What you would need to know to test it:
                </span>
                <p className="text-[#1B1B1F]/85 leading-relaxed">
                  {item.what_you_would_need_to_know}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
