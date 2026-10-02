import React, { useState } from 'react';
import { Sparkles, Download, Layers, RotateCcw, Check, ChevronDown, BookOpen, Compass } from 'lucide-react';
import { WorkflowStep, CurrencyConfig } from '../types';
import { CURRENCIES } from '../utils/costCalculator';

interface HeaderProps {
  currentStep: WorkflowStep;
  onStepClick?: (step: WorkflowStep) => void;
  projectName: string;
  onProjectNameChange: (name: string) => void;
  currency: CurrencyConfig;
  onCurrencyChange: (c: CurrencyConfig) => void;
  onOpenAssistant: () => void;
  onOpenExport: () => void;
  onOpenManual: () => void;
  onToggleGuide: () => void;
  onResetProject: () => void;
  hasProject: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onStepClick,
  projectName,
  onProjectNameChange,
  currency,
  onCurrencyChange,
  onOpenAssistant,
  onOpenExport,
  onOpenManual,
  onToggleGuide,
  onResetProject,
  hasProject,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(projectName);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

  const steps: { number: WorkflowStep; label: string }[] = [
    { number: 1, label: 'Upload' },
    { number: 2, label: 'Analyze' },
    { number: 3, label: 'Design' },
    { number: 4, label: 'Estimate' },
  ];

  const handleNameSubmit = () => {
    setIsEditingName(false);
    if (nameInput.trim()) {
      onProjectNameChange(nameInput.trim());
    } else {
      setNameInput(projectName);
    }
  };

  return (
    <header className="h-14 border-b border-zinc-200/80 bg-white/95 backdrop-blur-md px-6 flex items-center justify-between shrink-0 select-none z-30">
      {/* Left: Brand Logo */}
      <div className="flex items-center gap-3">
        <div
          onClick={onResetProject}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <Sparkles className="w-4 h-4 text-violet-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm tracking-tight text-zinc-900 group-hover:text-violet-700 transition-colors">
              Facade<span className="text-violet-600 font-bold">AI</span>
            </span>
            <span className="text-[10px] text-zinc-600 tracking-wider uppercase -mt-0.5">
              Renovation Studio
            </span>
          </div>
        </div>

        {hasProject && (
          <div className="hidden sm:flex items-center gap-1.5 ml-4 pl-4 border-l border-zinc-200">
            {isEditingName ? (
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onBlur={handleNameSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                autoFocus
                className="text-xs font-medium text-zinc-900 bg-zinc-100 px-2 py-1 rounded border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-violet-500 w-32"
              />
            ) : (
              <button
                onClick={() => {
                  setNameInput(projectName);
                  setIsEditingName(true);
                }}
                title="Click to rename project"
                className="text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 px-2 py-1 rounded transition-colors"
              >
                {projectName}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Center: 4-Step Progress Indicator */}
      <div className="hidden md:flex items-center gap-1 bg-zinc-50 border border-zinc-200/80 px-2 py-1 rounded-full text-xs">
        {steps.map((s, idx) => {
          const isActive = currentStep === s.number;
          const isCompleted = currentStep > s.number;
          const isClickable = hasProject && (isCompleted || isActive || s.number === 3 || s.number === 4);

          return (
            <React.Fragment key={s.number}>
              {idx > 0 && (
                <div
                  className={`w-4 h-[1px] ${
                    currentStep >= s.number ? 'bg-zinc-400' : 'bg-zinc-200'
                  }`}
                />
              )}
              <button
                disabled={!isClickable}
                onClick={() => onStepClick?.(s.number)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : isCompleted
                    ? 'text-zinc-700 hover:text-zinc-900 cursor-pointer'
                    : 'text-zinc-400 cursor-default'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : isCompleted
                      ? 'bg-zinc-200 text-zinc-700'
                      : 'bg-zinc-100 text-zinc-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : s.number}
                </span>
                <span>{s.label}</span>
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Currency Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
            className="flex items-center gap-1 text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200/80 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <span>{currency.symbol}</span>
            <span className="hidden sm:inline text-zinc-500 font-normal">{currency.code}</span>
            <ChevronDown className="w-3 h-3 text-zinc-400" />
          </button>

          {isCurrencyOpen && (
            <div className="absolute right-0 mt-1 w-36 bg-white border border-zinc-200 rounded-xl shadow-lg py-1 z-40">
              {CURRENCIES.map((c) => (
                <button
                  key={c.code}
                  onClick={() => {
                    onCurrencyChange(c);
                    setIsCurrencyOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-zinc-50 transition-colors ${
                    currency.code === c.code ? 'font-semibold text-violet-600 bg-violet-50/50' : 'text-zinc-700'
                  }`}
                >
                  <span>{c.label}</span>
                  {currency.code === c.code && <Check className="w-3.5 h-3.5 text-violet-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {hasProject && (
          <>
            {/* Guide Me (Arrow Direction Walkthrough) */}
            <button
              onClick={onToggleGuide}
              className="flex items-center gap-1.5 text-xs font-medium text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200/60 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              title="Show interactive arrow directions & workflow guide"
            >
              <Compass className="w-3.5 h-3.5 text-violet-600 animate-pulse" />
              <span className="hidden lg:inline">Guide Me</span>
            </button>

            {/* User Manual Modal Trigger */}
            <button
              onClick={onOpenManual}
              className="flex items-center gap-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/80 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              title="View and download comprehensive user manual"
            >
              <BookOpen className="w-3.5 h-3.5 text-zinc-500" />
              <span className="hidden lg:inline">Manual</span>
            </button>

            {/* Ask FacadeAI button */}
            <button
              onClick={onOpenAssistant}
              className="flex items-center gap-1.5 text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-200" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>

            {/* Export Summary */}
            <button
              onClick={onOpenExport}
              className="flex items-center gap-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/80 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-zinc-500" />
              <span className="hidden sm:inline">Export</span>
            </button>

            {/* Reset / Upload new */}
            <button
              onClick={onResetProject}
              title="Start a new house renovation"
              className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
    </header>
  );
};
