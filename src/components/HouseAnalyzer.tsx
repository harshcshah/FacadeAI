import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Shield, Eye } from 'lucide-react';

interface HouseAnalyzerProps {
  imageSrc: string;
  onAnalysisComplete: () => void;
}

const ANALYSIS_STEPS = [
  'Analyzing your home...',
  'Detecting walls...',
  'Finding windows and doors...',
  'Identifying balconies and rooflines...',
  'Preparing editable surfaces...',
];

export const HouseAnalyzer: React.FC<HouseAnalyzerProps> = ({
  imageSrc,
  onAnalysisComplete,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < ANALYSIS_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onAnalysisComplete();
          }, 400);
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(interval);
  }, [onAnalysisComplete]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#fafafa] p-6 select-none relative overflow-hidden">
      <div className="max-w-md w-full bg-white rounded-2xl border border-zinc-200/90 shadow-xl p-6 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
        {/* Preview with scanner effect */}
        <div className="relative w-full h-56 rounded-xl overflow-hidden mb-6 border border-zinc-200 bg-zinc-950">
          <img
            src={imageSrc}
            alt="Analyzing Home"
            className="w-full h-full object-cover opacity-80"
          />

          {/* Futuristic subtle scanning line */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-violet-400 to-transparent shadow-[0_0_15px_rgba(139,92,246,0.8)] animate-pulse top-1/2 -translate-y-1/2" />

          {/* Subtle grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:16px_16px]" />

          {/* AI Badge */}
          <div className="absolute top-3 left-3 bg-zinc-900/80 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-zinc-700/50">
            <Sparkles className="w-3 h-3 text-violet-400 animate-spin" />
            <span>Vision Engine</span>
          </div>
        </div>

        {/* Progress Step Header */}
        <div className="w-full text-left mb-4">
          <h3 className="text-base font-bold text-zinc-900 mb-1">AI Structural Vision</h3>
          <p className="text-xs text-zinc-500">Mapping exterior surfaces and estimating square footage</p>
        </div>

        {/* Steps List */}
        <div className="w-full space-y-2 mb-6">
          {ANALYSIS_STEPS.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div
                key={step}
                className={`flex items-center gap-2.5 text-xs px-3 py-1.5 rounded-lg transition-colors ${
                  isCurrent
                    ? 'bg-violet-50 text-violet-900 font-medium'
                    : isDone
                    ? 'text-zinc-600'
                    : 'text-zinc-300'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : isCurrent ? (
                  <div className="w-4 h-4 rounded-full border-2 border-violet-600 border-t-transparent animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-zinc-200 shrink-0" />
                )}
                <span>{step}</span>
              </div>
            );
          })}
        </div>

        <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-violet-600 transition-all duration-300 rounded-full"
            style={{
              width: `${((currentStepIndex + 1) / ANALYSIS_STEPS.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
