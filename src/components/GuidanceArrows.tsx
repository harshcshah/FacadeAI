import React, { useState } from 'react';
import { X, ArrowRight, Check, Compass, Sparkles, ChevronRight, Layers, Paintbrush, Calculator } from 'lucide-react';

interface GuidanceArrowsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuidanceArrows: React.FC<GuidanceArrowsProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      title: 'Material Library (Left)',
      badge: 'Step 1: Pick Materials',
      description: 'Browse natural stone, fluted wood louvers, brick, and stucco paint. You can click any material or drag it.',
      targetZone: 'left',
    },
    {
      step: 2,
      title: 'House Facade (Center)',
      badge: 'Step 2: Drop on Surface',
      description: 'Hover or drop the material onto any detected area (Main Wall, Column, Balcony). The target surface highlights in violet!',
      targetZone: 'center',
    },
    {
      step: 3,
      title: 'AI Photorealistic Rendering',
      badge: 'Step 3: Generate Preview',
      description: 'Click "Generate AI Design" to render a photorealistic renovation while preserving your original home architecture.',
      targetZone: 'center-bottom',
    },
    {
      step: 4,
      title: 'Live Cost & BoQ (Right)',
      badge: 'Step 4: Contractor Cost',
      description: 'Materials, installation labor, scaffolding, and wastage update live. You can even set a target budget to auto-optimize.',
      targetZone: 'right',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 pointer-events-none select-none overflow-hidden">
      {/* Darkened subtle backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-2xs pointer-events-auto transition-opacity duration-300" onClick={onClose} />

      {/* Visual Direction Arrows Over Canvas & Layout */}
      {/* 1. Left Arrow pointing from Library */}
      <div
        className={`absolute left-80 top-36 z-50 pointer-events-auto transition-all duration-300 ${
          currentStep === 1 ? 'opacity-100 scale-100' : 'opacity-40 scale-95'
        }`}
      >
        <div className="flex items-center gap-2">
          {/* Curved SVG Arrow pointing to library */}
          <svg className="w-16 h-12 text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.8)] animate-pulse" viewBox="0 0 64 48" fill="none">
            <path
              d="M58 24 C40 24 24 24 10 24"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeDasharray="4 4"
            />
            <polygon points="12,18 2,24 12,30" fill="currentColor" />
          </svg>

          <div
            onClick={() => setCurrentStep(1)}
            className="bg-zinc-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-2xl border border-violet-500/60 max-w-xs cursor-pointer hover:border-violet-400 transition-colors"
          >
            <div className="flex items-center gap-1.5 text-violet-400 text-[10px] font-bold uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
              <span>Step 1: Drag Material</span>
            </div>
            <h4 className="text-xs font-bold text-white">Left Material Library</h4>
            <p className="text-[11px] text-zinc-300 mt-0.5 leading-relaxed">
              Drag Travertine, Teak Louvers, or Paint directly onto your home.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Center Arrow pointing onto House Surface */}
      <div
        className={`absolute left-1/2 top-48 -translate-x-1/2 z-50 pointer-events-auto transition-all duration-300 ${
          currentStep === 2 ? 'opacity-100 scale-100' : 'opacity-40 scale-95'
        }`}
      >
        <div className="flex flex-col items-center">
          <div
            onClick={() => setCurrentStep(2)}
            className="bg-zinc-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-2xl border border-violet-500/60 max-w-xs text-center cursor-pointer hover:border-violet-400 transition-colors"
          >
            <div className="inline-flex items-center gap-1.5 text-violet-400 text-[10px] font-bold uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
              <span>Step 2: Drop on Surface</span>
            </div>
            <h4 className="text-xs font-bold text-white">Detected House Surfaces</h4>
            <p className="text-[11px] text-zinc-300 mt-0.5 leading-relaxed">
              Drop materials onto the Entrance Pillar, Main Wall, Louvers, or Railings.
            </p>
          </div>

          {/* SVG Arrow pointing down into canvas */}
          <svg className="w-12 h-16 text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.8)] animate-bounce mt-1" viewBox="0 0 48 64" fill="none">
            <path
              d="M24 10 C24 24 24 38 24 52"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeDasharray="4 4"
            />
            <polygon points="18,50 24,60 30,50" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* 3. Center Bottom Arrow pointing to Generate AI Design */}
      <div
        className={`absolute left-1/2 bottom-20 -translate-x-1/2 z-50 pointer-events-auto transition-all duration-300 ${
          currentStep === 3 ? 'opacity-100 scale-100' : 'opacity-40 scale-95'
        }`}
      >
        <div className="flex flex-col items-center">
          <svg className="w-12 h-16 text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.8)] animate-pulse mb-1 rotate-180" viewBox="0 0 48 64" fill="none">
            <path
              d="M24 10 C24 24 24 38 24 52"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeDasharray="4 4"
            />
            <polygon points="18,50 24,60 30,50" fill="currentColor" />
          </svg>

          <div
            onClick={() => setCurrentStep(3)}
            className="bg-zinc-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-2xl border border-violet-500/60 max-w-xs text-center cursor-pointer hover:border-violet-400 transition-colors"
          >
            <div className="inline-flex items-center gap-1.5 text-violet-400 text-[10px] font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3 text-violet-400" />
              <span>Step 3: Generate Preview</span>
            </div>
            <h4 className="text-xs font-bold text-white">Click "Generate AI Design"</h4>
            <p className="text-[11px] text-zinc-300 mt-0.5 leading-relaxed">
              Renders photorealistic materials with realistic day lighting and texture relief.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Right Arrow pointing to Cost Panel */}
      <div
        className={`absolute right-80 top-40 z-50 pointer-events-auto transition-all duration-300 ${
          currentStep === 4 ? 'opacity-100 scale-100' : 'opacity-40 scale-95'
        }`}
      >
        <div className="flex items-center gap-2">
          <div
            onClick={() => setCurrentStep(4)}
            className="bg-zinc-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-2xl border border-violet-500/60 max-w-xs cursor-pointer hover:border-violet-400 transition-colors"
          >
            <div className="flex items-center gap-1.5 text-violet-400 text-[10px] font-bold uppercase tracking-wider mb-1">
              <Calculator className="w-3 h-3 text-violet-400" />
              <span>Step 4: Live Estimate</span>
            </div>
            <h4 className="text-xs font-bold text-white">Renovation Estimate</h4>
            <p className="text-[11px] text-zinc-300 mt-0.5 leading-relaxed">
              Bill of Quantities with materials, labor, scaffolding, and contingency buffers.
            </p>
          </div>

          <svg className="w-16 h-12 text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.8)] animate-pulse" viewBox="0 0 64 48" fill="none">
            <path
              d="M6 24 C24 24 40 24 54 24"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeDasharray="4 4"
            />
            <polygon points="52,18 62,24 52,30" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Interactive Walkthrough Control Card at Top Center */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto bg-white rounded-2xl shadow-2xl border border-zinc-200 p-4 max-w-md w-full animate-in slide-in-from-top-4 duration-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-600 text-white flex items-center justify-center">
              <Compass className="w-4 h-4 text-violet-200" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-900">Guided Tour: {steps[currentStep - 1].title}</h3>
              <p className="text-[10px] text-zinc-500">Step {currentStep} of 4</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-zinc-600 mb-3 leading-relaxed">
          {steps[currentStep - 1].description}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((stepNum) => (
              <button
                key={stepNum}
                onClick={() => setCurrentStep(stepNum)}
                className={`w-6 h-6 rounded-full text-xs font-semibold flex items-center justify-center transition-colors ${
                  currentStep === stepNum
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {stepNum}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep((s) => s + 1)}
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
              >
                <span>Next Arrow</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-colors shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Got it, Start Designing!</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
