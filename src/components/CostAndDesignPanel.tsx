import React, { useState } from 'react';
import {
  Calculator,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  Edit2,
  DollarSign,
  TrendingUp,
  Check,
  RotateCcw,
  Sliders,
  Palette,
  CheckCircle2,
} from 'lucide-react';
import {
  StructuralZone,
  Material,
  CostBreakdownSummary,
  CurrencyConfig,
  AiDesignStyle,
  RenovationTheme,
} from '../types';
import { PRESET_THEMES } from '../data/materials';

interface CostAndDesignPanelProps {
  projectName: string;
  zones: StructuralZone[];
  materialsMap: Map<string, Material>;
  costSummary: CostBreakdownSummary;
  currency: CurrencyConfig;
  selectedStyle: AiDesignStyle;
  onSelectStyle: (style: AiDesignStyle) => void;
  onApplyTheme: (theme: RenovationTheme) => void;
  onUpdateZoneArea: (zoneId: string, newArea: number) => void;
  onSelectZone: (zoneId: string) => void;
  contingencyPercent: number;
  onContingencyChange: (val: number) => void;
  onOptimizeForBudget: (targetBudget: number) => void;
}

export const CostAndDesignPanel: React.FC<CostAndDesignPanelProps> = ({
  projectName,
  zones,
  materialsMap,
  costSummary,
  currency,
  selectedStyle,
  onSelectStyle,
  onApplyTheme,
  onUpdateZoneArea,
  onSelectZone,
  contingencyPercent,
  onContingencyChange,
  onOptimizeForBudget,
}) => {
  const [activeTab, setActiveTab] = useState<'cost' | 'styles' | 'areas'>('cost');
  const [showCostDetails, setShowCostDetails] = useState(false);
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);
  const [editAreaValue, setEditAreaValue] = useState<string>('');
  const [budgetInput, setBudgetInput] = useState<string>('500000');
  const [budgetOptimizationResult, setBudgetOptimizationResult] = useState<string | null>(null);

  const totalAreaSqFt = zones.reduce((acc, z) => acc + z.netAreaSqFt, 0);
  const assignedMaterialsCount = new Set(zones.map((z) => z.assignedMaterialId).filter(Boolean)).size;

  // Aggregate costs by category
  const categoryCosts = React.useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of costSummary.items) {
      const cat = item.material.categoryLabel || 'General';
      map[cat] = (map[cat] || 0) + item.itemTotalCost;
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [costSummary]);

  const handleStartEditArea = (zone: StructuralZone) => {
    setEditingZoneId(zone.id);
    setEditAreaValue(String(zone.netAreaSqFt));
  };

  const handleSaveArea = (zoneId: string) => {
    const num = parseFloat(editAreaValue);
    if (!isNaN(num) && num > 0) {
      onUpdateZoneArea(zoneId, Math.round(num));
    }
    setEditingZoneId(null);
  };

  const handleRunBudgetOptimization = () => {
    const target = parseFloat(budgetInput);
    if (!isNaN(target) && target > 0) {
      onOptimizeForBudget(target);
      const diff = costSummary.grandTotal - target;
      if (diff > 0) {
        setBudgetOptimizationResult(
          `AI optimized material selection to stay within ${currency.symbol}${target.toLocaleString()}. High-wear ground accents preserved while optimizing upper finishes.`
        );
      } else {
        setBudgetOptimizationResult(
          `Current estimate (${currency.symbol}${costSummary.grandTotal.toLocaleString()}) is already comfortably within your budget of ${currency.symbol}${target.toLocaleString()}!`
        );
      }
    }
  };

  const stylesList: { id: AiDesignStyle; label: string; desc: string; themeId?: string }[] = [
    {
      id: 'Modern',
      label: 'Modern Minimal',
      desc: 'Clean architectural lines, neutral stucco, natural stone & glass.',
      themeId: 'theme-nordic-minimalist',
    },
    {
      id: 'Warm',
      label: 'Warm Contemporary',
      desc: 'Warm teak louvers, textured travertine stone, and ambient light.',
      themeId: 'theme-warm-travertine',
    },
    {
      id: 'Luxury',
      label: 'Luxury Stone',
      desc: 'Stacked charcoal ledger stone, deep graphite trim & frameless glass.',
      themeId: 'theme-urban-luxury',
    },
    {
      id: 'Industrial',
      label: 'Industrial Brick',
      desc: 'Wire-cut terracotta brick with Corten steel accents.',
      themeId: 'theme-industrial-loft',
    },
    {
      id: 'Contemporary',
      label: 'Contemporary Suburban',
      desc: 'Balanced stucco facade with warm timber flutes and black glazing.',
      themeId: 'theme-nordic-minimalist',
    },
    {
      id: 'Minimal',
      label: 'Pure Minimalist',
      desc: 'Monolithic smooth surfaces, crisp reveals, and hidden frames.',
      themeId: 'theme-nordic-minimalist',
    },
  ];

  return (
    <aside className="w-72 sm:w-80 border-l border-zinc-200/80 bg-white flex flex-col shrink-0 select-none overflow-hidden h-full z-20">
      {/* Project Overview Card */}
      <div className="p-3.5 border-b border-zinc-100 bg-zinc-50/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-600">Project</span>
          <span className="text-xs font-semibold text-zinc-900 truncate max-w-[120px]">{projectName}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 py-2 border-y border-zinc-200/60 text-center">
          <div>
            <span className="text-[10px] text-zinc-600 block">Areas</span>
            <span className="text-xs font-bold text-zinc-900">{zones.length}</span>
          </div>
          <div>
            <span className="text-[10px] text-zinc-600 block">Materials</span>
            <span className="text-xs font-bold text-zinc-900">{assignedMaterialsCount}</span>
          </div>
          <div>
            <span className="text-[10px] text-zinc-600 block">Est. Area</span>
            <span className="text-xs font-bold text-zinc-900">{totalAreaSqFt} sq ft</span>
          </div>
        </div>

        {/* Big Total Price */}
        <div className="mt-2.5 pt-1 flex items-baseline justify-between">
          <span className="text-xs font-semibold text-zinc-600">Total Renovation</span>
          <span className="text-lg font-extrabold text-zinc-900 tracking-tight">
            {currency.symbol}
            {costSummary.grandTotal.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-100 px-3 pt-2 gap-2 text-xs font-medium">
        <button
          onClick={() => setActiveTab('cost')}
          className={`pb-2 px-1 relative transition-colors ${
            activeTab === 'cost' ? 'text-zinc-900 font-bold border-b-2 border-zinc-900' : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          Estimate
        </button>
        <button
          onClick={() => setActiveTab('styles')}
          className={`pb-2 px-1 relative transition-colors ${
            activeTab === 'styles' ? 'text-zinc-900 font-bold border-b-2 border-zinc-900' : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          Styles
        </button>
        <button
          onClick={() => setActiveTab('areas')}
          className={`pb-2 px-1 relative transition-colors ${
            activeTab === 'areas' ? 'text-zinc-900 font-bold border-b-2 border-zinc-900' : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          Detected Areas
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
        {/* --- 1. COST TAB --- */}
        {activeTab === 'cost' && (
          <div className="space-y-4">
            {/* Primary Estimate Card */}
            <div className="bg-zinc-50 border border-zinc-200/90 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-600">
                <span>Materials</span>
                <span className="font-semibold text-zinc-900">
                  {currency.symbol}{costSummary.materialTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-600">
                <span>Labor & Installation</span>
                <span className="font-semibold text-zinc-900">
                  {currency.symbol}{costSummary.laborTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-600">
                <span>Scaffolding & Site Prep</span>
                <span className="font-semibold text-zinc-900">
                  {currency.symbol}{costSummary.sitePreparationAndScaffolding.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-600">
                <span>Wastage & Contingency ({contingencyPercent}%)</span>
                <span className="font-semibold text-zinc-900">
                  {currency.symbol}{costSummary.contingencyAmount.toLocaleString()}
                </span>
              </div>

              <div className="pt-2 border-t border-zinc-200 flex items-center justify-between text-sm font-bold text-zinc-900">
                <span>Estimated Total</span>
                <span className="text-violet-700">
                  {currency.symbol}{costSummary.grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Category Breakdown */}
            <div>
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2">Category Breakdown</h4>
              <div className="space-y-1.5">
                {categoryCosts.map(([cat, amount]) => {
                  const pct = Math.round((amount / (costSummary.grandTotal || 1)) * 100);
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-600 truncate max-w-[150px]">{cat}</span>
                        <span className="font-medium text-zinc-900">
                          {currency.symbol}{amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-1 bg-zinc-100 rounded-full overflow-hidden">
                        <div className="h-full bg-violet-600 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Expandable Cost Settings */}
            <div className="border border-zinc-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setShowCostDetails(!showCostDetails)}
                className="w-full px-3 py-2 text-xs font-semibold text-zinc-700 flex items-center justify-between hover:bg-zinc-50"
              >
                <span>Cost Settings & Margins</span>
                {showCostDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showCostDetails && (
                <div className="p-3 bg-zinc-50/50 border-t border-zinc-100 space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-zinc-600">Contingency Buffer</span>
                      <span className="font-bold text-zinc-800">{contingencyPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="25"
                      value={contingencyPercent}
                      onChange={(e) => onContingencyChange(Number(e.target.value))}
                      className="w-full accent-violet-600"
                    />
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-normal">
                    Formula: (Quantity × Material Rate) + (Quantity × Labor Rate) + Site Preparation + Contingency.
                  </p>
                </div>
              )}
            </div>

            {/* Budget Mode Optimization */}
            <div className="bg-violet-50/60 border border-violet-200/80 rounded-xl p-3 space-y-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                <h4 className="text-xs font-bold text-violet-950">AI Budget Mode</h4>
              </div>
              <p className="text-[11px] text-zinc-600">
                Set your renovation target, and AI will suggest optimal material pairings.
              </p>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-bold">
                    {currency.symbol}
                  </span>
                  <input
                    type="number"
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(e.target.value)}
                    className="w-full pl-6 pr-2 py-1 text-xs bg-white border border-zinc-200 rounded-lg text-zinc-900 font-semibold focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>
                <button
                  onClick={handleRunBudgetOptimization}
                  className="px-2.5 py-1 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-lg transition-colors shrink-0"
                >
                  Optimize
                </button>
              </div>

              {budgetOptimizationResult && (
                <p className="text-[11px] text-violet-900 bg-white p-2 rounded-lg border border-violet-100 leading-relaxed animate-in fade-in">
                  {budgetOptimizationResult}
                </p>
              )}
            </div>
          </div>
        )}

        {/* --- 2. STYLES TAB --- */}
        {activeTab === 'styles' && (
          <div className="space-y-3">
            <p className="text-xs text-zinc-500">
              Select an architectural aesthetic direction. AI maps curated palettes onto detected surfaces.
            </p>

            <div className="space-y-2">
              {stylesList.map((st) => {
                const isSelected = selectedStyle === st.id;
                const matchedTheme = PRESET_THEMES.find((t) => t.id === st.themeId) || PRESET_THEMES[0];

                return (
                  <div
                    key={st.id}
                    onClick={() => {
                      onSelectStyle(st.id);
                      onApplyTheme(matchedTheme);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-violet-50/50 border-violet-500 ring-2 ring-violet-500/10'
                        : 'bg-white border-zinc-200/80 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-bold text-zinc-900">{st.label}</h4>
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 text-violet-600" />
                      ) : (
                        <div className="flex items-center gap-1">
                          {matchedTheme.colorPreview.slice(0, 3).map((col, idx) => (
                            <span
                              key={idx}
                              className="w-2.5 h-2.5 rounded-full border border-zinc-200"
                              style={{ backgroundColor: col }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-relaxed mb-2">{st.desc}</p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStyle(st.id);
                        onApplyTheme(matchedTheme);
                      }}
                      className="w-full py-1 text-[11px] font-semibold bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-violet-400" />
                      <span>Generate this style</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- 3. DETECTED AREAS TAB --- */}
        {activeTab === 'areas' && (
          <div className="space-y-2">
            <p className="text-xs text-zinc-500 mb-2">
              Detected house surfaces. Click any area to focus or adjust area square footage.
            </p>

            {zones.map((zone) => {
              const mat = zone.assignedMaterialId ? materialsMap.get(zone.assignedMaterialId) : null;
              const isEditing = editingZoneId === zone.id;
              const unitRate = mat ? Math.round(mat.unitRate * currency.rateToUSD) : 0;
              const laborRate = mat ? Math.round(mat.laborRate * currency.rateToUSD) : 0;
              const zoneTotal = Math.round(zone.netAreaSqFt * (unitRate + laborRate));

              return (
                <div
                  key={zone.id}
                  onClick={() => onSelectZone(zone.id)}
                  className="p-2.5 rounded-xl border border-zinc-200/80 bg-white hover:border-zinc-300 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-zinc-900 truncate">{zone.name}</h4>
                      <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                        {mat ? mat.name.split('(')[0] : 'Unassigned'}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-zinc-900 block">
                        {currency.symbol}{zoneTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-zinc-100 text-xs">
                    {isEditing ? (
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="number"
                          value={editAreaValue}
                          onChange={(e) => setEditAreaValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveArea(zone.id)}
                          className="w-16 px-1.5 py-0.5 text-xs border border-violet-400 rounded focus:outline-none"
                          autoFocus
                        />
                        <span className="text-[10px] text-zinc-500">sq ft</span>
                        <button
                          onClick={() => handleSaveArea(zone.id)}
                          className="p-1 bg-violet-600 text-white rounded text-[10px] font-bold"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[11px] text-zinc-600">
                        <span>{zone.netAreaSqFt} sq ft</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEditArea(zone);
                          }}
                          className="text-violet-600 hover:text-violet-800 ml-1 p-0.5"
                          title="Edit area square footage"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    <span className="text-[10px] bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded capitalize">
                      {zone.type.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};
