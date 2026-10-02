import React from 'react';
import {
  Compass,
  FileText,
  Printer,
  HelpCircle,
  Sparkles,
  Layers,
  Palette,
  Calculator,
  Sliders,
  DollarSign,
} from 'lucide-react';
import { CurrencyConfig } from '../types';
import { CURRENCIES } from '../utils/costCalculator';

interface NavbarProps {
  activeStep: 'upload' | 'mapping' | 'design' | 'visualize' | 'cost';
  setActiveStep: (step: 'upload' | 'mapping' | 'design' | 'visualize' | 'cost') => void;
  currency: CurrencyConfig;
  setCurrency: (c: CurrencyConfig) => void;
  onOpenReport: () => void;
  onOpenMethodology: () => void;
  hasImage: boolean;
  totalCost: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeStep,
  setActiveStep,
  currency,
  setCurrency,
  onOpenReport,
  onOpenMethodology,
  hasImage,
  totalCost,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-900 border-b border-stone-800 text-stone-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white">
                  Façade<span className="text-amber-400">Craft</span>
                </span>
                <span className="text-[10px] font-mono tracking-wider uppercase px-1.5 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700">
                  AI Renovation Suite
                </span>
              </div>
              <p className="text-xs text-stone-400 hidden sm:block">
                Exterior Architecture & Cost Estimation
              </p>
            </div>
          </div>

          {/* Interactive Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-950/80 p-1 rounded-xl border border-stone-800/80">
            <button
              onClick={() => setActiveStep('upload')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeStep === 'upload'
                  ? 'bg-stone-800 text-white shadow-sm border border-stone-700'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
              }`}
            >
              <span>1. House Media</span>
            </button>

            <button
              onClick={() => hasImage && setActiveStep('mapping')}
              disabled={!hasImage}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeStep === 'mapping'
                  ? 'bg-stone-800 text-white shadow-sm border border-stone-700'
                  : hasImage
                  ? 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                  : 'text-stone-600 cursor-not-allowed'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>2. Structural Zones</span>
            </button>

            <button
              onClick={() => hasImage && setActiveStep('design')}
              disabled={!hasImage}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeStep === 'design'
                  ? 'bg-stone-800 text-white shadow-sm border border-stone-700'
                  : hasImage
                  ? 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                  : 'text-stone-600 cursor-not-allowed'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>3. Materials & Finishes</span>
            </button>

            <button
              onClick={() => hasImage && setActiveStep('visualize')}
              disabled={!hasImage}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeStep === 'visualize'
                  ? 'bg-stone-800 text-white shadow-sm border border-stone-700'
                  : hasImage
                  ? 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                  : 'text-stone-600 cursor-not-allowed'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>4. Redesign Preview</span>
            </button>

            <button
              onClick={() => hasImage && setActiveStep('cost')}
              disabled={!hasImage}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeStep === 'cost'
                  ? 'bg-amber-500/20 text-amber-300 shadow-sm border border-amber-500/30'
                  : hasImage
                  ? 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                  : 'text-stone-600 cursor-not-allowed'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-amber-400" />
              <span>5. Cost Breakdown</span>
            </button>
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2">
            {/* Currency selector */}
            <div className="relative">
              <select
                value={currency.code}
                onChange={(e) => {
                  const found = CURRENCIES.find((c) => c.code === e.target.value);
                  if (found) setCurrency(found);
                }}
                className="bg-stone-800 text-stone-200 text-xs rounded-lg px-2.5 py-1.5 border border-stone-700 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} {c.code}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Estimate Pill */}
            {hasImage && totalCost > 0 && (
              <div
                onClick={() => setActiveStep('cost')}
                className="hidden lg:flex items-center gap-1.5 bg-stone-800/90 border border-amber-500/40 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-stone-800 transition-colors"
                title="View detailed cost breakdown"
              >
                <span className="text-[11px] text-stone-400">Estimate:</span>
                <span className="font-bold text-xs text-amber-400">
                  {currency.symbol}
                  {totalCost.toLocaleString()}
                </span>
              </div>
            )}

            {/* Methodology & Help button */}
            <button
              onClick={onOpenMethodology}
              className="p-2 text-stone-400 hover:text-stone-200 rounded-lg hover:bg-stone-800 transition-colors"
              title="How Area & Perspective Estimation Works"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Contractor Report Export */}
            <button
              onClick={onOpenReport}
              disabled={!hasImage}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                hasImage
                  ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md shadow-amber-500/20'
                  : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700/50'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Contractor Report</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
