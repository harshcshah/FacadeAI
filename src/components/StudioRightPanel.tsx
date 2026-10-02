import React, { useState } from 'react';
import {
  Palette,
  Calculator,
  Sparkles,
  ShieldCheck,
  Wrench,
  CloudSun,
  Search,
  Check,
  RotateCcw,
  Sliders,
  DollarSign,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Package,
  Printer,
  ChevronRight,
  Eye,
  Ruler,
  Building2,
} from 'lucide-react';
import {
  Material,
  MaterialCategory,
  RenovationTheme,
  StructuralZone,
  CostBreakdownSummary,
  CostRateOverride,
  CurrencyConfig,
  ArchitecturalAdviceReport,
} from '../types';
import { MATERIAL_CATALOG, PRESET_THEMES } from '../data/materials';

interface StudioRightPanelProps {
  zones: StructuralZone[];
  setZones: React.Dispatch<React.SetStateAction<StructuralZone[]>>;
  activeZoneId: string | null;
  setActiveZoneId: (id: string | null) => void;
  materialsMap: Map<string, Material>;
  costSummary: CostBreakdownSummary;
  rateOverrides: Record<string, CostRateOverride>;
  setRateOverrides: React.Dispatch<React.SetStateAction<Record<string, CostRateOverride>>>;
  currency: CurrencyConfig;
  contingencyPercent: number;
  setContingencyPercent: (p: number) => void;
  onOpenReport: () => void;
  buildingMeta: {
    buildingType?: string;
    estimatedFloors?: number;
    facadeWidthFt?: number;
    facadeHeightFt?: number;
    conditionAssessment?: string;
  };
}

const TINT_PRESETS = [
  { name: 'Crisp White', hex: '#FFFFFF' },
  { name: 'Warm Alabaster', hex: '#F4EFE6' },
  { name: 'Travertine Sand', hex: '#E6DEC9' },
  { name: 'Nordic Slate', hex: '#64748B' },
  { name: 'Charcoal Slate', hex: '#334155' },
  { name: 'Teak Timber', hex: '#8C532B' },
  { name: 'Terracotta Clay', hex: '#B45309' },
  { name: 'Sage Green', hex: '#65A30D' },
  { name: 'Sky Icy Blue', hex: '#BAE6FD' },
];

export const StudioRightPanel: React.FC<StudioRightPanelProps> = ({
  zones,
  setZones,
  activeZoneId,
  setActiveZoneId,
  materialsMap,
  costSummary,
  rateOverrides,
  setRateOverrides,
  currency,
  contingencyPercent,
  setContingencyPercent,
  onOpenReport,
  buildingMeta,
}) => {
  const [activeTab, setActiveTab] = useState<'materials' | 'area' | 'cost' | 'advisor'>('materials');
  const [selectedCategory, setSelectedCategory] = useState<MaterialCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);

  // AI Architect Advice state
  const [isGeneratingAdvice, setIsGeneratingAdvice] = useState(false);
  const [adviceReport, setAdviceReport] = useState<ArchitecturalAdviceReport | null>(null);

  const activeZone = zones.find((z) => z.id === activeZoneId) || zones[0];

  const totalGrossArea = zones.reduce((sum, z) => sum + (z.grossAreaSqFt || 0), 0);
  const totalOpenings = zones.reduce((sum, z) => sum + (z.openingsAreaSqFt || 0), 0);
  const totalNetArea = zones.reduce((sum, z) => sum + (z.netAreaSqFt || 0), 0);

  const handleApplyMaterial = (materialId: string) => {
    if (!activeZone) return;
    setZones((prev) =>
      prev.map((z) => (z.id === activeZone.id ? { ...z, assignedMaterialId: materialId } : z))
    );
  };

  const handleApplyCustomTint = (hex: string | undefined) => {
    if (!activeZone) return;
    setZones((prev) =>
      prev.map((z) => (z.id === activeZone.id ? { ...z, customColorHex: hex } : z))
    );
  };

  const handleApplyTheme = (theme: RenovationTheme) => {
    setSelectedThemeId(theme.id);
    setZones((prev) =>
      prev.map((zone) => {
        const materialId = theme.materialAssignments[zone.type] || 'paint-weathershield-white';
        return { ...zone, assignedMaterialId: materialId, customColorHex: undefined };
      })
    );
  };

  const handleUpdateRate = (
    matId: string,
    field: 'materialRate' | 'laborRate' | 'wastagePercent',
    val: number
  ) => {
    setRateOverrides((prev) => ({
      ...prev,
      [matId]: {
        ...prev[matId],
        [field]: val,
      },
    }));
  };

  const fetchArchitecturalAdvice = async () => {
    setIsGeneratingAdvice(true);
    try {
      const activeAssignments = zones.map((z) => ({
        zoneName: z.name,
        type: z.type,
        material: materialsMap.get(z.assignedMaterialId || '')?.name || 'Unassigned',
        area: `${z.netAreaSqFt} sq ft`,
      }));

      const res = await fetch('/api/architectural-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buildingType: buildingMeta.buildingType || 'Residential House',
          zonesWithMaterials: activeAssignments,
          locationClimate: 'Temperate with seasonal rain and sun exposure',
          budgetPreference: 'Balanced Quality & Value',
        }),
      });

      const data = await res.json();
      if (data.advice) {
        setAdviceReport(data.advice);
      }
    } catch (err) {
      console.error('Failed to get architectural advice:', err);
    } finally {
      setIsGeneratingAdvice(false);
    }
  };

  const filteredMaterials = MATERIAL_CATALOG.filter((mat) => {
    const matchesCategory = selectedCategory === 'all' || mat.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      mat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mat.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <aside
      id="tour-materials-panel"
      className="w-96 bg-white border-l border-slate-200 text-slate-800 flex flex-col h-full select-none shrink-0 overflow-hidden shadow-xs"
    >
      {/* Top Deck Tabs in Light Architectural Style */}
      <div className="h-13 border-b border-slate-200 bg-slate-50/70 px-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1 w-full bg-slate-200/70 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('materials')}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'materials'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Finishes</span>
          </button>

          <button
            onClick={() => setActiveTab('area')}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'area'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Area</span>
          </button>

          <button
            onClick={() => setActiveTab('cost')}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'cost'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Live BOQ</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('advisor');
              if (!adviceReport && !isGeneratingAdvice) {
                fetchArchitecturalAdvice();
              }
            }}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'advisor'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Advice</span>
          </button>
        </div>
      </div>

      {/* TAB 1: FINISHES & MATERIALS LIBRARY */}
      {activeTab === 'materials' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Active Target Zone Banner */}
          <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-200 flex items-center justify-between shadow-xs">
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                Styling Target Zone:
              </span>
              <div className="font-bold text-xs text-slate-900 truncate mt-0.5">
                {activeZone?.name || 'Main Elevation Wall'}
              </div>
            </div>
            <div className="font-mono text-xs font-bold text-blue-700 shrink-0">
              {activeZone?.netAreaSqFt || 0} sq ft
            </div>
          </div>

          {/* Custom Color Tint Studio for Active Zone */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-blue-600" />
                <span>Custom Color Tint</span>
              </span>
              {activeZone?.customColorHex ? (
                <button
                  onClick={() => handleApplyCustomTint(undefined)}
                  className="text-[10px] text-blue-600 hover:underline font-semibold"
                >
                  Reset Tint
                </button>
              ) : (
                <span className="text-[10px] text-slate-400">Material Default</span>
              )}
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {TINT_PRESETS.map((preset) => {
                const isSelected = activeZone?.customColorHex === preset.hex;
                return (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => handleApplyCustomTint(preset.hex)}
                    className={`w-6 h-6 rounded-full border shadow-2xs transition-transform hover:scale-110 ${
                      isSelected
                        ? 'ring-2 ring-blue-600 scale-110 border-white'
                        : 'border-slate-300'
                    }`}
                    style={{ backgroundColor: preset.hex }}
                    title={preset.name}
                  />
                );
              })}
              <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-200">
                <input
                  type="color"
                  value={activeZone?.customColorHex || '#FFFFFF'}
                  onChange={(e) => handleApplyCustomTint(e.target.value)}
                  className="w-6 h-6 rounded-full cursor-pointer border border-slate-300 p-0"
                  title="Pick Any Custom Color Hex"
                />
                <span className="text-[10px] font-mono text-slate-500">
                  {activeZone?.customColorHex || 'Natural'}
                </span>
              </div>
            </div>
          </div>

          {/* 1-Click Aesthetic Presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>1-Click Aesthetic Makeovers</span>
              </span>
              <span className="text-[10px] text-blue-600 font-semibold">Harmonic Palette</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {PRESET_THEMES.map((theme) => {
                const isSelected = selectedThemeId === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => handleApplyTheme(theme)}
                    className={`p-2.5 rounded-xl border text-left transition-all group flex flex-col justify-between shadow-xs ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/80 ring-1 ring-blue-500/30'
                        : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-[11px] text-slate-800 group-hover:text-blue-600 truncate">
                      {theme.name.split(' ')[0]} {theme.name.split(' ')[1]}
                    </div>
                    <div className="mt-2 flex items-center gap-1">
                      {theme.colorPreview.slice(0, 3).map((c, i) => (
                        <span
                          key={i}
                          className="w-3 h-3 rounded-full border border-slate-300 shadow-xs"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                      <span className="text-[9px] text-blue-600 ml-auto font-bold group-hover:translate-x-0.5 transition-transform">
                        Apply →
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {(
              [
                ['all', 'All'],
                ['window', 'Windows & Glazing'],
                ['door', 'Doors & Portals'],
                ['paint', 'Paint & Plaster'],
                ['stone', 'Stone Cladding'],
                ['panel', 'Panels & WPC'],
                ['railing', 'Railings'],
                ['trim', 'Trims'],
              ] as const
            ).map(([cat, label]) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat as any)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors border ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cladding, teak, travertine..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Materials List */}
          <div className="space-y-2">
            {filteredMaterials.map((mat) => {
              const isCurrent = activeZone?.assignedMaterialId === mat.id;
              return (
                <div
                  key={mat.id}
                  onClick={() => handleApplyMaterial(mat.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer shadow-xs ${
                    isCurrent
                      ? 'bg-blue-50/70 border-blue-500 ring-1 ring-blue-500/30'
                      : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className="w-4 h-4 rounded-full shrink-0 border border-slate-300 shadow-xs mt-0.5"
                      style={{ backgroundColor: mat.colorHex }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-800 truncate">
                          {mat.name}
                        </span>
                        {isCurrent && (
                          <span className="px-1.5 py-0.2 rounded bg-blue-600 text-white text-[9px] font-bold">
                            Active
                          </span>
                        )}
                      </div>

                      <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                        {mat.description}
                      </p>

                      <div className="flex items-center gap-3 mt-2 text-[10px] font-mono text-slate-500">
                        <span>
                          Rate: <strong className="text-slate-800">${mat.unitRate}</strong> / sq ft
                        </span>
                        <span>·</span>
                        <span>
                          Durability: <strong className="text-slate-800">{mat.durabilityYears} yrs</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: AREA ESTIMATION & TAKEOFF */}
      {activeTab === 'area' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
                Net Surface
              </span>
              <span className="font-extrabold text-base text-blue-900 font-mono">
                {totalNetArea} <span className="text-xs font-normal">sq ft</span>
              </span>
              <span className="text-[9px] text-blue-600 block mt-0.5">
                ≈ {Math.round(totalNetArea * 0.0929)} m²
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Gross Envelope
              </span>
              <span className="font-extrabold text-base text-slate-800 font-mono">
                {totalGrossArea} <span className="text-xs font-normal">sq ft</span>
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">
                Outer Boundary
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                Deductions
              </span>
              <span className="font-extrabold text-base text-amber-900 font-mono">
                -{totalOpenings} <span className="text-xs font-normal">sq ft</span>
              </span>
              <span className="text-[9px] text-amber-600 block mt-0.5">
                Windows & Doors
              </span>
            </div>
          </div>

          {/* Facade Dimensions Banner */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <span className="font-bold block">Estimated Elevation Dimensions</span>
                <span className="text-[10px] text-slate-500">
                  {buildingMeta.facadeWidthFt || 38} ft wide × {buildingMeta.facadeHeightFt || 22} ft high · {buildingMeta.estimatedFloors || 2} Storeys
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-[10px] font-mono font-bold text-slate-600 shadow-2xs">
              Scale 10ft/fl
            </span>
          </div>

          {/* Itemized Zone Takeoff Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Ruler className="w-3.5 h-3.5 text-blue-600" />
                <span>Zone-by-Zone Area Takeoff</span>
              </span>
              <span className="text-[10px] font-bold text-blue-600">
                {zones.length} Mapped Zones
              </span>
            </div>

            <div className="space-y-2">
              {zones.map((zone) => {
                const isSelected = activeZoneId === zone.id;
                const mat = zone.assignedMaterialId ? materialsMap.get(zone.assignedMaterialId) : null;
                const percentOfTotal = totalNetArea > 0 ? Math.round((zone.netAreaSqFt / totalNetArea) * 100) : 0;

                return (
                  <div
                    key={zone.id}
                    onClick={() => setActiveZoneId(zone.id)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all shadow-2xs ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/70 ring-1 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0 border border-slate-300"
                          style={{ backgroundColor: zone.customColorHex || mat?.colorHex || '#CBD5E1' }}
                        />
                        <span className="truncate max-w-[190px]">{zone.name}</span>
                      </div>
                      <span className="font-mono text-blue-700 font-extrabold text-xs">
                        {zone.netAreaSqFt} sq ft
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-500">
                      <div>
                        <span className="text-slate-400">Gross: </span>
                        <strong className="text-slate-700">{zone.grossAreaSqFt} sq ft</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Openings: </span>
                        <strong className="text-slate-700">-{zone.openingsAreaSqFt} sq ft</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Share: </span>
                        <strong className="text-blue-700">{percentOfTotal}%</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-500 leading-relaxed">
            💡 <strong>Measurement Standard:</strong> Window and door apertures are deducted from wall areas so material orders (stone, stucco, paint) do not overestimate square footage.
          </div>
        </div>
      )}

      {/* TAB 2: LIVE BOQ & FINANCIAL BREAKDOWN */}
      {activeTab === 'cost' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
                Grand Total
              </span>
              <span className="font-extrabold text-base text-blue-900 font-mono">
                {currency.symbol}{costSummary.grandTotal.toLocaleString()}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Direct Materials
              </span>
              <span className="font-extrabold text-base text-slate-800 font-mono">
                {currency.symbol}{costSummary.materialTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Itemized BOQ Table */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
              Itemized Quantities & Wastage
            </span>

            <div className="space-y-2">
              {costSummary.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-2 shadow-xs"
                >
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span className="truncate max-w-[200px]">{item.material?.name || item.zoneName}</span>
                    <span className="font-mono text-blue-700">
                      {currency.symbol}{item.itemTotalCost.toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-500 font-mono bg-slate-50 p-2 rounded-lg">
                    <div>
                      <span>Net: </span>
                      <strong className="text-slate-800">{item.netAreaSqFt} sq ft</strong>
                    </div>
                    <div>
                      <span>Wastage: </span>
                      <strong className="text-slate-800">+{item.wastageSqFt} sq ft</strong>
                    </div>
                    <div>
                      <span>Billable: </span>
                      <strong className="text-slate-800">{item.totalQuantity} sq ft</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-[10px]">
                    <div>
                      <label className="text-slate-400 block mb-0.5">Mat Rate ($/sq ft)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={item.materialRate}
                        onChange={(e) =>
                          handleUpdateRate(item.material.id, 'materialRate', Number(e.target.value))
                        }
                        className="w-full px-2 py-1 rounded bg-slate-50 border border-slate-200 text-slate-800 font-mono font-bold text-right"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-0.5">Labor Rate ($/sq ft)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={item.laborRate}
                        onChange={(e) =>
                          handleUpdateRate(item.material.id, 'laborRate', Number(e.target.value))
                        }
                        className="w-full px-2 py-1 rounded bg-slate-50 border border-slate-200 text-slate-800 font-mono font-bold text-right"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Report Shortcut */}
          <button
            onClick={onOpenReport}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Generate Printable Contractor BOQ PDF</span>
          </button>
        </div>
      )}

      {/* TAB 3: AI ARCHITECTURAL ADVICE */}
      {activeTab === 'advisor' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs space-y-1">
            <span className="font-bold text-blue-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Architectural Consultation</span>
            </span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Automated substrate suitability, long-term maintenance cycles, and contractor negotiation checklists.
            </p>
          </div>

          {isGeneratingAdvice ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Sparkles className="w-6 h-6 mx-auto text-blue-600 animate-spin" />
              <div className="text-xs font-semibold text-slate-600">
                Generating architectural critique...
              </div>
            </div>
          ) : adviceReport ? (
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
                <span className="font-bold text-slate-800">Visual Balance & Harmony:</span>
                <p className="text-slate-600 text-[11px]">{adviceReport.aestheticCohesion}</p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
                <span className="font-bold text-slate-800">Substrate Preparation:</span>
                <p className="text-slate-600 text-[11px]">{adviceReport.technicalAdvice}</p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
                <span className="font-bold text-slate-800">Maintenance Schedule:</span>
                <p className="text-slate-600 text-[11px]">{adviceReport.maintenanceUpkeep}</p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1.5">
                <span className="font-bold text-slate-800">Contractor Negotiation Questions:</span>
                <ul className="space-y-1 pl-4 list-disc text-slate-600 text-[11px]">
                  {adviceReport.contractorChecklist?.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <button
              onClick={fetchArchitecturalAdvice}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors"
            >
              Analyze Facade Harmony
            </button>
          )}
        </div>
      )}
    </aside>
  );
};
