import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const STATUS_LINES = [
  "Reading what you wrote…",
  "Separating what you've weighed from how you're weighing it…",
  "Looking at both options equally…",
  "Writing questions, not answers…",
];

export const LoadingState: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % STATUS_LINES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      aria-live="polite"
      className="max-w-[880px] mx-auto py-20 px-4 text-center flex flex-col items-center justify-center"
    >
      <div className="relative mb-6">
        <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200/70 flex items-center justify-center">
          <Loader2 className="w-7 h-7 text-[#0F766E] animate-spin" />
        </div>
      </div>

      <div className="h-10 flex items-center justify-center">
        <p className="text-lg font-serif-heading font-normal text-[#1B1B1F] tracking-tight transition-opacity duration-500 ease-in-out">
          {STATUS_LINES[currentIndex]}
        </p>
      </div>

      <p className="text-xs text-[#1B1B1F]/50 mt-4 max-w-sm">
        Running single-call deep analysis with structured quote checks, neutrality validation, and equal scrutiny.
      </p>

      {/* Visual pulse dots */}
      <div className="flex items-center gap-2 mt-6">
        {STATUS_LINES.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === currentIndex
                ? "bg-[#0F766E] scale-125"
                : "bg-[#E4DED3]"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
