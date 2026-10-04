import React, { useState } from "react";
import { Header } from "./components/Header.tsx";
import { DecisionForm } from "./components/DecisionForm.tsx";
import { LoadingState } from "./components/LoadingState.tsx";
import { ResultsView } from "./components/ResultsView.tsx";
import { ModeCard } from "./components/ModeCard.tsx";
import { SecondLook, AnalyzeInput } from "../core/types.ts";
import { AlertCircle, Sparkles } from "lucide-react";

export default function App() {
  const [currentInput, setCurrentInput] = useState<AnalyzeInput | null>(null);
  const [result, setResult] = useState<SecondLook | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReflecting, setIsReflecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load cached internship example directly
  const handleLoadCachedExample = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/sample.json");
      if (!res.ok) throw new Error("Could not load sample scenario");
      const sampleData: SecondLook = await res.json();
      setCurrentInput({
        decision: "Should I take a 6-month internship during my college term?",
        optionA: "Accept the internship",
        optionB: "Decline it and stay on track",
        pulling:
          "The stipend is good and it's close to home. I want real industry experience on my resume before graduating.",
        worries:
          "It would delay my graduation by one semester and I don't know how intense the workload will be or if I'll actually get mentored.",
        context:
          "I am a junior with three terms left. My tuition aid requires continuous enrollment unless granted a leave of absence.",
      });
      setResult(sampleData);
    } catch (err: any) {
      setErrorMessage(
        "Could not load pre-generated example. Please try submitting directly."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async (input: AnalyzeInput) => {
    setIsLoading(true);
    setErrorMessage(null);
    setCurrentInput(input);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "rate_limited") {
          throw new Error(
            "Lots of people are using this right now. Your text is saved. Try again in a minute, or open the pre-run example."
          );
        } else if (data.error === "bad_output") {
          throw new Error("That analysis came back garbled. Nothing was lost. Try again.");
        } else if (data.error === "missing_api_key") {
          // If server reports missing key in local test, fallback to cached sample or inform user
          throw new Error(
            "Gemini API key is not configured in environment variables. You can view the full interactive pre-run internship example."
          );
        } else {
          throw new Error(data.message || "Failed to complete analysis. Please try again.");
        }
      }

      setResult(data);
    } catch (err: any) {
      setErrorMessage(
        err.message || "We couldn't reach the server. Check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReflectSubmit = async (
    answeredList: { question: string; answer: string }[]
  ) => {
    if (!currentInput) return;

    setIsReflecting(true);
    setErrorMessage(null);

    const updatedInput: AnalyzeInput = {
      ...currentInput,
      answers: answeredList,
    };

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedInput),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update analysis with reflections.");
      }

      setResult(data);
      setCurrentInput(updatedInput);
    } catch (err: any) {
      setErrorMessage(err.message || "Could not re-analyze with your answers.");
    } finally {
      setIsReflecting(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1B1B1F] flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      <Header
        onLoadExample={handleLoadCachedExample}
        onReset={handleReset}
        hasResults={result !== null}
      />

      <main className="flex-1 flex flex-col">
        {/* Error Banner */}
        {errorMessage && (
          <div className="max-w-[880px] mx-auto mt-4 px-4 w-full">
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 text-xs sm:text-sm text-amber-900 flex items-start justify-between gap-3 shadow-2xs">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <p>{errorMessage}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={handleLoadCachedExample}
                  className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 text-xs font-medium hover:bg-amber-100 transition cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-teal-700" />
                  <span>Use Sample</span>
                </button>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="text-amber-800 hover:text-amber-950 text-xs underline cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* State 2: Reading / Loading */}
        {(isLoading || isReflecting) && <LoadingState />}

        {/* State 1: Describe Form */}
        {!isLoading && !isReflecting && !result && (
          <DecisionForm
            onSubmit={handleAnalyze}
            onLoadExample={handleLoadCachedExample}
            isLoading={isLoading}
            initialValues={currentInput || undefined}
          />
        )}

        {/* State 3 / Edge Case Modes */}
        {!isLoading && !isReflecting && result && (
          <>
            {result.mode === "analysis" ? (
              <ResultsView
                result={result}
                originalInput={currentInput!}
                onReflectSubmit={handleReflectSubmit}
                isReflecting={isReflecting}
                onStartOver={handleReset}
              />
            ) : (
              <ModeCard
                mode={result.mode}
                userNote={result.user_note}
                onBackToEdit={() => setResult(null)}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
