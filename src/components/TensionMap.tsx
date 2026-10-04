import React from "react";
import { Tension } from "../../core/types.ts";
import { ArrowLeftRight, GitFork } from "lucide-react";

interface TensionMapProps {
  tensions: Tension[];
}

export const TensionMap: React.FC<TensionMapProps> = ({ tensions }) => {
  if (!tensions || tensions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#E4DED3] p-6 text-center text-xs text-[#1B1B1F]/60 italic">
        No active goal tensions detected across stated inputs.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-xs sm:text-sm text-[#1B1B1F]/70 pb-2 border-b border-[#E4DED3]">
        Internal desires that pull in opposite directions regardless of which option is chosen.
      </p>

      <div className="grid grid-cols-1 gap-4">
        {tensions.map((tension) => (
          <div
            key={tension.id}
            className="bg-white rounded-xl border border-[#E4DED3] p-5 shadow-2xs space-y-4"
          >
            {/* Paired goals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch relative">
              {/* Goal A */}
              <div className="bg-teal-50/30 rounded-xl p-3.5 border border-teal-200/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#0F766E]" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0F766E]">
                      Goal Alpha
                    </span>
                  </div>
                  <p className="text-sm font-medium text-[#1B1B1F] leading-snug">
                    {tension.goal_a}
                  </p>
                </div>
                {tension.goal_a_quote && (
                  <blockquote className="border-l-3 border-[#0F766E] pl-2.5 italic text-xs text-[#1B1B1F]/70 mt-2.5">
                    "{tension.goal_a_quote}"
                  </blockquote>
                )}
              </div>

              {/* Goal B */}
              <div className="bg-purple-50/20 rounded-xl p-3.5 border border-purple-200/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#7C2D6B]" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7C2D6B]">
                      Goal Beta
                    </span>
                  </div>
                  <p className="text-sm font-medium text-[#1B1B1F] leading-snug">
                    {tension.goal_b}
                  </p>
                </div>
                {tension.goal_b_quote && (
                  <blockquote className="border-l-3 border-[#7C2D6B] pl-2.5 italic text-xs text-[#1B1B1F]/70 mt-2.5">
                    "{tension.goal_b_quote}"
                  </blockquote>
                )}
              </div>
            </div>

            {/* Why they pull apart */}
            <div className="bg-[#FAF7F2] rounded-lg p-3 border border-[#E4DED3]/70 flex items-start gap-2.5 text-xs sm:text-sm">
              <ArrowLeftRight className="w-4 h-4 text-stone-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#1B1B1F] block text-xs mb-0.5">
                  Why these two pull apart:
                </span>
                <p className="text-[#1B1B1F]/85 leading-relaxed">
                  {tension.why_they_pull_apart}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
