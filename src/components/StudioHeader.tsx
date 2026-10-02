import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  Printer,
  HelpCircle,
  Upload,
  ChevronDown,
  Building2,
  BookOpen,
  Presentation,
  MoreHorizontal,
  Wand2,
} from 'lucide-react';
import { CurrencyConfig } from '../types';
import { CURRENCIES } from '../utils/costCalculator';
import { SAMPLE_HOUSES } from '../data/materials';

interface StudioHeaderProps {
  currentHouseTitle: string;
  totalCost: number;
  currency: CurrencyConfig;
  setCurrency: (c: CurrencyConfig) => void;
  onOpenUploadModal: () => void;
  onSelectSampleHouse: (house: typeof SAMPLE_HOUSES[0]) => void;
  onRunAiAnalysis?: () => void;
  isAnalyzing?: boolean;
  onOpenAiAssistant: () => void;
  onOpenReport: () => void;
  onOpenMethodology: () => void;
  onOpenTour: () => void;
  onOpenUserManual: () => void;
  totalNetAreaSqFt: number;
  zonesCount: number;
  isPresentationMode: boolean;
  setIsPresentationMode: (val: boolean) => void;
  clientName?: string;
  setClientName?: (name: string) => void;
  projectAddress?: string;
  setProjectAddress?: (addr: string) => void;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  currentHouseTitle,
  totalCost,
  currency,
  setCurrency,
  onOpenUploadModal,
  onSelectSampleHouse,
  onOpenAiAssistant,
  onOpenReport,
  onOpenMethodology,
  onOpenTour,
  onOpenUserManual,
  totalNetAreaSqFt,
  zonesCount,
  isPresentationMode,
  setIsPresentationMode,
}) => {
  const [houseMenuOpen, setHouseMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200 text-slate-800 flex items-center justify-between px-3 sm:px-6 select-none z-30 relative shrink-0 shadow-xs">
      {/* Left: Brand & House Selector */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center text-white font-black shadow-md shadow-blue-500/20">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-extrabold text-base tracking-tight text-slate-900">
                Façade<span className="text-blue-600">Craft</span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                Design Studio
              </span>
            </div>
            <span className="text-[10px] text-slate-500 hidden sm:inline">
              AI Exterior Renovation & Cost Estimator
            </span>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-200 hidden md:block" />

        {/* House Selector Dropdown */}
        <div id="tour-house-selector" className="relative">
          <button
            onClick={() => setHouseMenuOpen(!houseMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-150 border border-slate-200 hover:border-slate-300 text-xs text-slate-800 transition-all font-semibold shadow-xs"
          >
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span className="truncate max-w-[130px] sm:max-w-[190px]">{currentHouseTitle}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {houseMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setHouseMenuOpen(false)}
              />
              <div className="absolute left-0 mt-2 w-76 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Select Residential Elevation
                </div>

                {SAMPLE_HOUSES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => {
                      onSelectSampleHouse(sample);
                      setHouseMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-2 rounded-xl text-left hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-200"
                  >
                    <img
                      src={sample.imageUrl}
                      alt={sample.title}
                      className="w-12 h-9 rounded-lg object-cover shrink-0 border border-slate-200 group-hover:scale-105 transition-transform"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600 truncate">
                        {sample.title}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        ~{sample.facadeWidthFt}' × {sample.facadeHeightFt}' · {sample.type}
                      </div>
                    </div>
                  </button>
                ))}

                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setHouseMenuOpen(false);
                      onOpenUploadModal();
                    }}
                    className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Customer House Photo</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Center: Friendly AI Auto-Design Trigger */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenAiAssistant}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:shadow-lg transition-all active:scale-95"
          title="Need help? Let AI automatically style and redesign your house"
        >
          <Wand2 className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>✨ AI Auto-Design</span>
          <span className="hidden md:inline px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-normal">
            1-Click
          </span>
        </button>
      </div>

      {/* Right Tools: Currency, Cost Pill, PDF Proposal, and More Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Currency Switcher */}
        <div className="relative">
          <select
            value={currency.code}
            onChange={(e) => {
              const found = CURRENCIES.find((c) => c.code === e.target.value);
              if (found) setCurrency(found);
            }}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs rounded-xl px-2 py-1.5 border border-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer font-mono font-bold"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.code}
              </option>
            ))}
          </select>
        </div>

        {/* Live Cost Total Ticker */}
        <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl shadow-xs">
          <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider hidden lg:inline">
            Total:
          </span>
          <span className="font-extrabold text-xs sm:text-sm text-emerald-800 font-mono tracking-tight">
            {currency.symbol}
            {totalCost.toLocaleString()}
          </span>
        </div>

        {/* Export PDF Proposal / Contractor BOQ */}
        <button
          id="tour-boq-button"
          onClick={onOpenReport}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/25 transition-all hover:translate-y-px"
          title="Open printable renovation proposal & contractor BOQ with AI generated visualizer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export PDF Manual</span>
        </button>

        {/* More Options Dropdown (Consolidates Tour, Manual, Showcase, Methodology) */}
        <div className="relative">
          <button
            onClick={() => setMoreMenuOpen(!moreMenuOpen)}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 border border-slate-200 transition-colors"
            title="More Options & Tools"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {moreMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMoreMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-2xl p-1.5 z-50 text-xs text-slate-700 space-y-0.5 animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  onClick={() => {
                    setMoreMenuOpen(false);
                    onOpenTour();
                  }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 text-left transition-colors font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Start Guided Tour</span>
                </button>

                <button
                  onClick={() => {
                    setMoreMenuOpen(false);
                    onOpenUserManual();
                  }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 text-left transition-colors font-medium"
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                  <span>User Manual & Guide</span>
                </button>

                <button
                  onClick={() => {
                    setMoreMenuOpen(false);
                    setIsPresentationMode(!isPresentationMode);
                  }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 text-left transition-colors font-medium"
                >
                  <Presentation className="w-3.5 h-3.5 text-purple-500" />
                  <span>Client Showcase Mode</span>
                </button>

                <button
                  onClick={() => {
                    setMoreMenuOpen(false);
                    onOpenMethodology();
                  }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 text-left transition-colors font-medium text-slate-500"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Estimation Methodology</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
