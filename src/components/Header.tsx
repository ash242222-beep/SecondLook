import React from "react";
import { Sparkles, RotateCcw } from "lucide-react";

interface HeaderProps {
  onLoadExample: () => void;
  onReset: () => void;
  hasResults: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onLoadExample,
  onReset,
  hasResults,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-xs border-b border-[#E4DED3] px-4 py-3">
      <div className="max-w-[880px] mx-auto flex items-center justify-between gap-3">
        <button
          onClick={onReset}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] rounded-md px-1 py-0.5"
        >
          <div className="w-8 h-8 rounded-lg bg-[#1B1B1F] text-[#FAF7F2] flex items-center justify-center font-serif-heading font-bold text-lg shadow-xs group-hover:bg-[#0F766E] transition-colors">
            2L
          </div>
          <div>
            <span className="font-serif-heading font-semibold text-lg tracking-tight text-[#1B1B1F] group-hover:text-[#0F766E] transition-colors">
              Second Look
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs text-[#1B1B1F]/60 font-sans border-l border-[#E4DED3] pl-2">
              Decision Analysis
            </span>
          </div>
        </button>

        <div className="flex items-center gap-2">
          {hasResults && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1B1B1F]/70 hover:text-[#1B1B1F] hover:bg-[#E4DED3]/40 rounded-lg transition-colors border border-transparent hover:border-[#E4DED3] cursor-pointer"
              title="Start a new decision"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Decision</span>
            </button>
          )}

          <button
            onClick={onLoadExample}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0F766E] bg-teal-50 hover:bg-teal-100/80 rounded-lg transition-colors border border-teal-200/80 cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Internship Example</span>
          </button>
        </div>
      </div>
    </header>
  );
};

