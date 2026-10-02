import React from 'react';
import {
  Presentation,
  CheckCircle2,
  Calendar,
  MapPin,
  User,
  Sparkles,
  Printer,
  ChevronRight,
  Layers,
  Palette,
  Sliders,
  Box,
  FileSpreadsheet,
} from 'lucide-react';
import { CurrencyConfig } from '../types';

interface CustomerShowcaseBarProps {
  isPresentationMode: boolean;
  setIsPresentationMode: (val: boolean) => void;
  clientName: string;
  setClientName: (name: string) => void;
  projectAddress: string;
  setProjectAddress: (addr: string) => void;
  totalCost: number;
  currency: CurrencyConfig;
  zonesCount: number;
  totalNetAreaSqFt: number;
  currentHouseTitle: string;
  onOpenReport: () => void;
  onOpenTour: () => void;
}

export const CustomerShowcaseBar: React.FC<CustomerShowcaseBarProps> = ({
  isPresentationMode,
  setIsPresentationMode,
  clientName,
  setClientName,
  projectAddress,
  setProjectAddress,
  totalCost,
  currency,
  zonesCount,
  totalNetAreaSqFt,
  onOpenReport,
}) => {
  return (
    <div className="bg-white border-b border-slate-200 text-xs text-slate-700 px-3 sm:px-6 py-2 select-none z-20 shrink-0 shadow-xs">
      {isPresentationMode ? (
        /* Presentation Mode Showcase Header */
        <div className="flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 font-bold flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
              <Presentation className="w-3.5 h-3.5" />
              <span>Customer POC Showcase</span>
            </div>

            {/* Client Name Input */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] text-slate-500 font-medium">Client:</span>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Enter Client Name"
                className="bg-transparent text-slate-900 font-bold text-xs focus:outline-none focus:text-purple-700 w-32 sm:w-44"
              />
            </div>

            {/* Property Address */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] text-slate-500 font-medium">Property:</span>
              <input
                type="text"
                value={projectAddress}
                onChange={(e) => setProjectAddress(e.target.value)}
                placeholder="Enter Address"
                className="bg-transparent text-slate-800 font-semibold text-xs focus:outline-none focus:text-purple-700 w-44 md:w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 font-mono text-[11px] text-slate-700 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
              <span className="text-slate-400">Net Area:</span>
              <span className="font-bold text-slate-900">{totalNetAreaSqFt} sq ft</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-400">Budget:</span>
              <span className="font-bold text-blue-600">
                {currency.symbol}{totalCost.toLocaleString()}
              </span>
            </div>

            <button
              onClick={onOpenReport}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Printer className="w-3 h-3" />
              <span>Client Proposal PDF</span>
            </button>

            <button
              onClick={() => setIsPresentationMode(false)}
              className="text-xs text-slate-500 hover:text-slate-900 font-medium underline"
            >
              Exit Deck
            </button>
          </div>
        </div>
      ) : (
        /* Standard 5-Step Guided Workflow Bar */
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1 sm:gap-2 text-[11px]">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider hidden md:inline">
              Workflow:
            </span>

            {/* Step 1 */}
            <div className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 shrink-0 text-emerald-600" />
              <span className="hidden sm:inline">1. Elevation</span>
              <span className="sm:hidden">1</span>
            </div>

            <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />

            {/* Step 2 */}
            <div className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 shrink-0 text-emerald-600" />
              <span className="hidden sm:inline">2. {zonesCount} Zones Detected</span>
              <span className="sm:hidden">2</span>
            </div>

            <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />

            {/* Step 3 */}
            <div className="flex items-center gap-1 text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
              <Palette className="w-3 h-3 shrink-0 text-blue-600" />
              <span className="hidden sm:inline">3. Materials Library</span>
              <span className="sm:hidden">3</span>
            </div>

            <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />

            {/* Step 4 */}
            <div className="flex items-center gap-1 text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">
              <Box className="w-3 h-3 shrink-0 text-indigo-600" />
              <span className="hidden sm:inline">4. 2D / 3D Redesign</span>
              <span className="sm:hidden">4</span>
            </div>

            <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />

            {/* Step 5 */}
            <div className="flex items-center gap-1 text-slate-600 font-semibold bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
              <FileSpreadsheet className="w-3 h-3 shrink-0 text-slate-500" />
              <span className="hidden sm:inline">5. Contractor BOQ</span>
              <span className="sm:hidden">5</span>
            </div>
          </div>

          {/* Quick Guidance Hint & Presentation Mode Trigger */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 hidden lg:inline">
              Presenting to a homeowner or contractor?
            </span>
            <button
              onClick={() => setIsPresentationMode(true)}
              className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-semibold transition-colors flex items-center gap-1"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Open Client Deck</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
