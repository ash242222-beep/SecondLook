import React from "react";
import { AlertTriangle, HeartHandshake, HelpCircle, ArrowLeft } from "lucide-react";

interface ModeCardProps {
  mode: "needs_detail" | "not_a_decision" | "support_first";
  userNote: string;
  onBackToEdit: () => void;
}

export const ModeCard: React.FC<ModeCardProps> = ({
  mode,
  userNote,
  onBackToEdit,
}) => {
  if (mode === "support_first") {
    return (
      <div className="max-w-[700px] mx-auto my-12 bg-white rounded-2xl border border-stone-300 p-8 shadow-sm space-y-6 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-700">
          <HeartHandshake className="w-7 h-7" />
        </div>

        <h2 className="font-serif-heading text-2xl sm:text-3xl font-medium text-[#1B1B1F]">
          Support comes first
        </h2>

        <div className="text-left bg-[#FAF7F2] rounded-xl p-5 border border-[#E4DED3] text-sm sm:text-base leading-relaxed text-[#1B1B1F] space-y-3">
          <p className="font-normal">{userNote}</p>
        </div>

        <div className="border-t border-[#E4DED3] pt-5 text-xs text-[#1B1B1F]/60">
          <p className="font-medium text-[#1B1B1F]/80">
            Nothing here replaces talking to a real person.
          </p>
          <p className="mt-1">
            If you or someone you know is going through a crisis or emergency, please reach out to local emergency services or a trusted counselor or friend.
          </p>
        </div>

        <button
          onClick={onBackToEdit}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#E4DED3] bg-[#FAF7F2] hover:bg-[#E4DED3]/50 text-sm font-medium text-[#1B1B1F] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to form</span>
        </button>
      </div>
    );
  }

  if (mode === "needs_detail") {
    return (
      <div className="max-w-[700px] mx-auto my-12 bg-white rounded-2xl border border-amber-200 p-8 shadow-sm space-y-6 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 flex items-center justify-center text-amber-800">
          <HelpCircle className="w-7 h-7" />
        </div>

        <h2 className="font-serif-heading text-2xl sm:text-3xl font-medium text-[#1B1B1F]">
          Give us a little more to work with
        </h2>

        <div className="text-left bg-amber-50/50 rounded-xl p-5 border border-amber-200/60 text-sm sm:text-base leading-relaxed text-[#1B1B1F] space-y-2">
          <span className="font-semibold text-amber-900 block text-xs uppercase tracking-wider">
            Analysis engine guidance:
          </span>
          <p>{userNote}</p>
        </div>

        <p className="text-xs text-[#1B1B1F]/60 max-w-md mx-auto">
          Your text has been preserved in the form. Adding 2 or 3 specific reasons or constraints allows Second Look to map real blind spots.
        </p>

        <button
          onClick={onBackToEdit}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1B1B1F] hover:bg-[#0F766E] text-white text-sm font-medium transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Edit decision details</span>
        </button>
      </div>
    );
  }

  // not_a_decision
  return (
    <div className="max-w-[700px] mx-auto my-12 bg-white rounded-2xl border border-stone-200 p-8 shadow-sm space-y-6 text-center">
      <div className="w-14 h-14 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-800">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <h2 className="font-serif-heading text-2xl sm:text-3xl font-medium text-[#1B1B1F]">
        This doesn't look like a choice yet
      </h2>

      <div className="text-left bg-[#FAF7F2] rounded-xl p-5 border border-[#E4DED3] text-sm sm:text-base leading-relaxed text-[#1B1B1F] space-y-2">
        <span className="font-semibold text-stone-900 block text-xs uppercase tracking-wider">
          Second Look Scope:
        </span>
        <p>{userNote}</p>
      </div>

      <p className="text-xs text-[#1B1B1F]/60 max-w-md mx-auto">
        Second Look is built to compare competing paths and unearth blind spots. Reframe your question with two distinct choices to run an analysis.
      </p>

      <button
        onClick={onBackToEdit}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1B1B1F] hover:bg-[#0F766E] text-white text-sm font-medium transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Reframe as a decision</span>
      </button>
    </div>
  );
};
