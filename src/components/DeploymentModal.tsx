import React, { useState } from "react";
import { X, CheckCircle2, Rocket, Github, Copy, ExternalLink, Terminal, Shield } from "lucide-react";

interface DeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeploymentModal: React.FC<DeploymentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const vercelDeployUrl = "https://vercel.com/new";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#FAF7F2] rounded-2xl border border-[#E4DED3] max-w-xl w-full p-6 sm:p-7 shadow-xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#1B1B1F]/50 hover:text-[#1B1B1F] p-1 rounded-lg hover:bg-[#E4DED3]/50 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1B1B1F] text-white flex items-center justify-center">
            <Rocket className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h3 className="font-serif-heading font-semibold text-xl text-[#1B1B1F]">
              Deployment & GitHub Pipeline
            </h3>
            <p className="text-xs text-[#1B1B1F]/60">
              Vercel Serverless + GitHub Actions Automated CI/CD
            </p>
          </div>
        </div>

        {/* Verification Checklist */}
        <div className="bg-white rounded-xl border border-[#E4DED3] p-4 space-y-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1B1B1F]/60 block">
            Architecture Status
          </span>
          <div className="space-y-2 text-xs text-[#1B1B1F]">
            <div className="flex items-center gap-2 text-stone-800">
              <CheckCircle2 className="w-4 h-4 text-[#0F766E]" />
              <span>
                <strong>Vercel ready:</strong> <code className="bg-[#FAF7F2] px-1 py-0.5 rounded border border-[#E4DED3]">vercel.json</code> & <code className="bg-[#FAF7F2] px-1 py-0.5 rounded border border-[#E4DED3]">api/analyze.ts</code> configured.
              </span>
            </div>
            <div className="flex items-center gap-2 text-stone-800">
              <CheckCircle2 className="w-4 h-4 text-[#0F766E]" />
              <span>
                <strong>GitHub Actions ready:</strong> <code className="bg-[#FAF7F2] px-1 py-0.5 rounded border border-[#E4DED3]">.github/workflows/deploy.yml</code> with build & lint gates.
              </span>
            </div>
            <div className="flex items-center gap-2 text-stone-800">
              <CheckCircle2 className="w-4 h-4 text-[#0F766E]" />
              <span>
                <strong>Automated Versioned Ship:</strong> <code className="bg-[#FAF7F2] px-1 py-0.5 rounded border border-[#E4DED3]">scripts/ship.sh</code> with secret scanner and unit test gate.
              </span>
            </div>
            <div className="flex items-center gap-2 text-stone-800">
              <CheckCircle2 className="w-4 h-4 text-[#0F766E]" />
              <span>
                <strong>Zero-API Fallback:</strong> <code className="bg-[#FAF7F2] px-1 py-0.5 rounded border border-[#E4DED3]">public/sample.json</code> cached internship scenario guaranteed to work offline.
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: Deploy to Vercel */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#1B1B1F] flex items-center gap-1.5">
              <Rocket className="w-4 h-4 text-[#0F766E]" />
              1. Deploy to Vercel
            </span>
            <a
              href={vercelDeployUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#0F766E] hover:underline flex items-center gap-1 font-medium"
            >
              <span>Open Vercel</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="bg-[#FAF7F2] rounded-xl p-3 border border-[#E4DED3] text-xs space-y-2">
            <p className="text-[#1B1B1F]/80">
              Deploy with Vercel CLI directly from project directory:
            </p>
            <div className="bg-[#1B1B1F] text-stone-100 p-2.5 rounded-lg font-mono text-[11px] flex items-center justify-between gap-2 overflow-x-auto">
              <code>npx vercel --prod</code>
              <button
                onClick={() => copyToClipboard("npx vercel --prod", "vercel-cmd")}
                className="hover:text-teal-400 p-1 cursor-pointer"
                title="Copy command"
              >
                {copiedKey === "vercel-cmd" ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <p className="text-[11px] text-[#1B1B1F]/60 flex items-center gap-1">
              <Shield className="w-3 h-3 text-[#0F766E]" /> Set <code className="bg-white px-1 border border-[#E4DED3] rounded">GEMINI_API_KEY</code> in Vercel Environment Variables.
            </p>
          </div>
        </div>

        {/* Section 2: Automated GitHub Push */}
        <div className="space-y-3">
          <span className="text-sm font-semibold text-[#1B1B1F] flex items-center gap-1.5">
            <Github className="w-4 h-4 text-[#1B1B1F]" />
            2. Push to GitHub with Versioned Tags
          </span>

          <div className="bg-[#FAF7F2] rounded-xl p-3 border border-[#E4DED3] text-xs space-y-2">
            <p className="text-[#1B1B1F]/80">
              Run the automated ship script (Appendix A2):
            </p>
            <div className="bg-[#1B1B1F] text-stone-100 p-2.5 rounded-lg font-mono text-[11px] flex items-center justify-between gap-2 overflow-x-auto">
              <code>./scripts/ship.sh v1.0.0 "release: Second Look master build"</code>
              <button
                onClick={() =>
                  copyToClipboard(
                    './scripts/ship.sh v1.0.0 "release: Second Look master build"',
                    "ship-cmd"
                  )
                }
                className="hover:text-teal-400 p-1 cursor-pointer"
                title="Copy command"
              >
                {copiedKey === "ship-cmd" ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <p className="text-[11px] text-[#1B1B1F]/60">
              This executes secret scanning (blocks API keys), runs unit tests, commits, tags, and pushes with <code className="bg-white px-1 border border-[#E4DED3] rounded">--follow-tags</code>.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-[#E4DED3] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1B1B1F] text-white text-xs font-medium hover:bg-[#0F766E] transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
