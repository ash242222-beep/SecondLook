import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight, ShieldCheck, HelpCircle, FileText, Trash2 } from "lucide-react";
import { AnalyzeInput } from "../../core/types.ts";

interface DecisionFormProps {
  onSubmit: (data: AnalyzeInput) => void;
  onLoadExample: () => void;
  isLoading: boolean;
  initialValues?: AnalyzeInput;
}

const PRESET_SCENARIOS = [
  {
    label: "Internship Choice",
    decision: "Should I take a 6-month internship during my college term?",
    optionA: "Accept the internship",
    optionB: "Decline it and stay on track",
    pulling: "The stipend is good and it's close to home. I want real industry experience on my resume before graduating.",
    worries: "It would delay my graduation by one semester and I don't know how intense the workload will be or if I'll actually get mentored.",
    context: "I am a junior with three terms left. My tuition aid requires continuous enrollment unless granted a leave of absence.",
  },
  {
    label: "Relocating for Job",
    decision: "Should I relocate to another city for a 30% salary increase?",
    optionA: "Accept the offer and move",
    optionB: "Stay at my current job and city",
    pulling: "The compensation bump is significant and the title jump gives me higher management visibility. The new city has a larger tech ecosystem.",
    worries: "My partner would need to stay behind for at least 8 months. All our closest friends and family live in our current city, and cost of living in the new city is higher.",
    context: "I have been with my current employer for 3 years without a clear promotion path in sight.",
  },
  {
    label: "College Major",
    decision: "Should I declare Computer Science or Industrial Design as my major?",
    optionA: "Declare Computer Science",
    optionB: "Declare Industrial Design",
    pulling: "My parents strongly prefer Computer Science because of perceived job stability and starting salaries. I also enjoy logical problem-solving.",
    worries: "I feel much more energized and creatively fulfilled when doing physical prototyping and product design. I worry CS will burn me out if I lack true passion.",
    context: "Prerequisites deadline is at the end of this semester. Transferring between colleges later is difficult.",
  },
];

const STORAGE_KEY = "second_look_draft_v1";

export const DecisionForm: React.FC<DecisionFormProps> = ({
  onSubmit,
  onLoadExample,
  isLoading,
  initialValues,
}) => {
  const [decision, setDecision] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [pulling, setPulling] = useState("");
  const [worries, setWorries] = useState("");
  const [context, setContext] = useState("");

  // Restore draft or initialValues on mount
  useEffect(() => {
    if (initialValues) {
      setDecision(initialValues.decision || "");
      setOptionA(initialValues.optionA || "");
      setOptionB(initialValues.optionB || "");
      setPulling(initialValues.pulling || "");
      setWorries(initialValues.worries || "");
      setContext(initialValues.context || "");
      return;
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.decision) setDecision(parsed.decision);
        if (parsed.optionA) setOptionA(parsed.optionA);
        if (parsed.optionB) setOptionB(parsed.optionB);
        if (parsed.pulling) setPulling(parsed.pulling);
        if (parsed.worries) setWorries(parsed.worries);
        if (parsed.context) setContext(parsed.context);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [initialValues]);

  // Debounced save draft to avoid IO churn on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const draft = { decision, optionA, optionB, pulling, worries, context };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      } catch {
        // Ignore localStorage quota errors
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [decision, optionA, optionB, pulling, worries, context]);

  const handleClearDraft = () => {
    setDecision("");
    setOptionA("");
    setOptionB("");
    setPulling("");
    setWorries("");
    setContext("");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const handleApplyPreset = (scenario: typeof PRESET_SCENARIOS[0]) => {
    setDecision(scenario.decision);
    setOptionA(scenario.optionA);
    setOptionB(scenario.optionB);
    setPulling(scenario.pulling);
    setWorries(scenario.worries);
    setContext(scenario.context);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decision.trim() || !pulling.trim()) return;

    onSubmit({
      decision: decision.trim(),
      optionA: optionA.trim() || undefined,
      optionB: optionB.trim() || undefined,
      pulling: pulling.trim(),
      worries: worries.trim() || undefined,
      context: context.trim() || undefined,
    });
  };

  const canSubmit = decision.trim().length > 0 && pulling.trim().length > 0 && !isLoading;

  return (
    <div className="w-full max-w-[880px] mx-auto py-8 px-4 sm:px-6">
      {/* Hero Intro */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="font-serif-heading text-4xl sm:text-5xl font-medium tracking-tight text-[#1B1B1F] mb-4">
          Second Look
        </h1>
        <p className="text-lg sm:text-xl text-[#1B1B1F]/80 leading-relaxed font-sans font-normal">
          Tell us how you're thinking about a decision. We'll show you what you haven't looked at yet to help you make an informed, well-grounded choice.
        </p>

        {/* Quick Demo Scenarios Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-[#1B1B1F]/60 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#0F766E]" /> Quick scenarios:
          </span>
          {PRESET_SCENARIOS.map((scenario) => (
            <button
              key={scenario.label}
              type="button"
              onClick={() => handleApplyPreset(scenario)}
              className="px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#E4DED3] text-[#1B1B1F]/80 hover:bg-[#E4DED3]/40 hover:text-[#1B1B1F] transition-colors cursor-pointer"
            >
              {scenario.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Decision Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-xs border border-[#E4DED3] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6"
      >
        {/* Field 1: Decision */}
        <div>
          <label
            htmlFor="decision"
            className="block text-sm font-medium text-[#1B1B1F] mb-1.5"
          >
            What are you deciding? <span className="text-teal-700">*</span>
          </label>
          <input
            id="decision"
            type="text"
            required
            aria-required="true"
            aria-describedby="decision-help"
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            placeholder="Should I take a 6-month internship during my college term?"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] bg-[#FAF7F2]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]/30 focus:border-[#0F766E] text-base text-[#1B1B1F] placeholder:text-[#1B1B1F]/40 transition"
          />
          <span id="decision-help" className="sr-only">
            State the primary question or choice you are facing.
          </span>
        </div>

        {/* Fields 2 & 3: Options A and B */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="optionA"
              className="block text-xs font-semibold uppercase tracking-wider text-[#0F766E] mb-1.5 flex items-center justify-between"
            >
              <span>Option A</span>
              <span className="text-[11px] font-normal lowercase opacity-70">teal side</span>
            </label>
            <input
              id="optionA"
              type="text"
              value={optionA}
              onChange={(e) => setOptionA(e.target.value)}
              placeholder="Accept the internship"
              className="w-full px-3.5 py-2.5 rounded-xl border border-teal-200/80 bg-teal-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]/30 focus:border-[#0F766E] text-base text-[#1B1B1F] placeholder:text-[#1B1B1F]/40 transition"
            />
          </div>

          <div>
            <label
              htmlFor="optionB"
              className="block text-xs font-semibold uppercase tracking-wider text-[#7C2D6B] mb-1.5 flex items-center justify-between"
            >
              <span>Option B</span>
              <span className="text-[11px] font-normal lowercase opacity-70">plum side</span>
            </label>
            <input
              id="optionB"
              type="text"
              value={optionB}
              onChange={(e) => setOptionB(e.target.value)}
              placeholder="Decline it"
              className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200/80 bg-purple-50/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C2D6B]/30 focus:border-[#7C2D6B] text-base text-[#1B1B1F] placeholder:text-[#1B1B1F]/40 transition"
            />
          </div>
        </div>

        {/* Field 4: What's pulling you */}
        <div>
          <label
            htmlFor="pulling"
            className="block text-sm font-medium text-[#1B1B1F] mb-1.5"
          >
            What's pulling you toward each option? <span className="text-teal-700">*</span>
          </label>
          <textarea
            id="pulling"
            required
            aria-required="true"
            aria-describedby="pulling-help"
            rows={3}
            value={pulling}
            onChange={(e) => setPulling(e.target.value)}
            placeholder="The stipend is good and it's close to home. I want real industry experience on my resume before graduating..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] bg-[#FAF7F2]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]/30 focus:border-[#0F766E] text-base text-[#1B1B1F] placeholder:text-[#1B1B1F]/40 transition resize-y"
          />
          <span id="pulling-help" className="sr-only">
            Describe the reasons, incentives, or feelings pulling you toward each of the options.
          </span>
        </div>

        {/* Field 5: What worries you */}
        <div>
          <label
            htmlFor="worries"
            className="block text-sm font-medium text-[#1B1B1F] mb-1.5"
          >
            What worries you, or what don't you know yet?
          </label>
          <textarea
            id="worries"
            rows={2}
            value={worries}
            onChange={(e) => setWorries(e.target.value)}
            placeholder="It would delay my graduation by one semester and I don't know how intense the workload will be or if I'll actually get mentored..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] bg-[#FAF7F2]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]/30 focus:border-[#0F766E] text-base text-[#1B1B1F] placeholder:text-[#1B1B1F]/40 transition resize-y"
          />
        </div>

        {/* Field 6: Extra context */}
        <div>
          <label
            htmlFor="context"
            className="block text-sm font-medium text-[#1B1B1F] mb-1.5"
          >
            Anything else that's relevant? <span className="text-xs text-[#1B1B1F]/50 font-normal">(optional)</span>
          </label>
          <input
            id="context"
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="E.g., academic aid requirements, lease timeline, family advice, long-term aspirations"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] bg-[#FAF7F2]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]/30 focus:border-[#0F766E] text-base text-[#1B1B1F] placeholder:text-[#1B1B1F]/40 transition"
          />
        </div>

        {/* Actions row */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E4DED3]/80">
          <div className="flex items-center gap-2">
            {(decision || pulling) && (
              <button
                type="button"
                onClick={handleClearDraft}
                className="text-xs text-[#1B1B1F]/50 hover:text-red-700 flex items-center gap-1 transition-colors px-2 py-1"
                title="Clear current text"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onLoadExample}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#E4DED3] bg-[#FAF7F2] hover:bg-[#E4DED3]/50 text-sm font-medium text-[#1B1B1F] transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#0F766E]" />
              <span>Try the internship example</span>
            </button>

            <button
              type="submit"
              disabled={!canSubmit}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                canSubmit
                  ? "bg-[#1B1B1F] hover:bg-[#0F766E] active:scale-[0.98]"
                  : "bg-[#1B1B1F]/30 cursor-not-allowed text-white/70"
              }`}
            >
              <span>Take a second look</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Data Notice */}
        <div className="text-center pt-2">
          <p className="text-xs text-[#1B1B1F]/50 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1B1B1F]/40 flex-shrink-0" />
            <span>
              This demo runs on a free AI tier. Inputs may be used to improve Google products, so please leave out private details.
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};
