import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  ShieldCheck,
  Wrench,
  CloudSun,
  Layers,
  ChevronRight,
  Check,
  Flame,
  Info,
  Sliders,
} from 'lucide-react';
import { Material, MaterialCategory, RenovationTheme, StructuralZone } from '../types';
import { MATERIAL_CATALOG, PRESET_THEMES } from '../data/materials';

interface MaterialSelectorSectionProps {
  zones: StructuralZone[];
  setZones: React.Dispatch<React.SetStateAction<StructuralZone[]>>;
  activeZoneId: string | null;
  setActiveZoneId: (id: string | null) => void;
  currencySymbol: string;
  currencyRate: number;
  onContinueToVisualize: () => void;
}

export const MaterialSelectorSection: React.FC<MaterialSelectorSectionProps> = ({
  zones,
  setZones,
  activeZoneId,
  setActiveZoneId,
  currencySymbol,
  currencyRate,
  onContinueToVisualize,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MaterialCategory | 'all'>('all');
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);

  // Default active zone if none selected
  const activeZone = zones.find((z) => z.id === activeZoneId) || zones[0];

  const handleApplyMaterialToZone = (zoneId: string, materialId: string) => {
    setZones((prev) =>
      prev.map((z) => (z.id === zoneId ? { ...z, assignedMaterialId: materialId } : z))
    );
  };

  const handleApplyPresetTheme = (theme: RenovationTheme) => {
    setSelectedThemeId(theme.id);
    setZones((prev) =>
      prev.map((zone) => {
        const materialId = theme.materialAssignments[zone.type] || 'paint-weathershield-white';
        return {
          ...zone,
          assignedMaterialId: materialId,
        };
      })
    );
  };

  const filteredMaterials =
    selectedCategory === 'all'
      ? MATERIAL_CATALOG
      : MATERIAL_CATALOG.filter((m) => m.category === selectedCategory);

  const currentZoneMaterial = activeZone?.assignedMaterialId
    ? MATERIAL_CATALOG.find((m) => m.id === activeZone.assignedMaterialId)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <Palette className="w-4 h-4" />
            <span>Step 3 · Material Selection & Exterior Finishes</span>
          </div>
          <h2 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight mt-1">
            Exterior Finishes & Cladding Catalog
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Apply high-performance exterior materials to each structural component. Compare durability, maintenance, and realistic visual textures.
          </p>
        </div>

        <button
          onClick={onContinueToVisualize}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all hover:translate-x-0.5 shrink-0"
        >
          <span>Preview Redesigned House</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Preset Designer Themes (1-Click Palette) */}
      <div className="mt-6 p-5 rounded-2xl bg-stone-100 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
              Instant Designer Themes (1-Click Application)
            </h3>
          </div>
          <span className="text-[11px] text-stone-500">Cohesive architectural material palettes</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_THEMES.map((theme) => {
            const isSelected = selectedThemeId === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => handleApplyPresetTheme(theme)}
                className={`p-3.5 rounded-xl border text-left transition-all group flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-500 bg-white dark:bg-stone-800 shadow-md ring-2 ring-amber-500/20'
                    : 'border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-900/60 hover:border-amber-400/60 hover:bg-white dark:hover:bg-stone-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-stone-900 dark:text-stone-100 group-hover:text-amber-500 transition-colors">
                      {theme.name}
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-[10px]">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 leading-tight">
                    {theme.subtitle}
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-1.5 pt-2 border-t border-stone-100 dark:border-stone-800">
                  {theme.colorPreview.map((c, i) => (
                    <span
                      key={i}
                      className="w-5 h-5 rounded-full border border-stone-300 dark:border-stone-700 shadow-inner"
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                  <span className="text-[10px] font-mono text-stone-400 ml-auto group-hover:text-amber-500 font-semibold">
                    Apply All →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Workspace: Zone Selection Bar + Catalog Grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Structural Zones List (Target Assignment) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 shadow-sm">
            <h3 className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-500" />
              <span>1. Choose Facade Zone to Style</span>
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mb-3">
              Click a structural component to select it, then pick a material from the catalog.
            </p>

            <div className="space-y-2">
              {zones.map((zone) => {
                const isActive = zone.id === (activeZone?.id || zones[0]?.id);
                const assignedMat = zone.assignedMaterialId
                  ? MATERIAL_CATALOG.find((m) => m.id === zone.assignedMaterialId)
                  : null;

                return (
                  <div
                    key={zone.id}
                    onClick={() => setActiveZoneId(zone.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-500/10 border-amber-500/80 shadow-xs'
                        : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-stone-900 dark:text-stone-100">
                        {zone.name}
                      </span>
                      <span className="text-[11px] font-mono text-stone-500">
                        {zone.netAreaSqFt} sq ft
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-xs">
                      {assignedMat ? (
                        <>
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-stone-300 dark:border-stone-600 shrink-0"
                            style={{ backgroundColor: assignedMat.colorHex }}
                          />
                          <span className="text-stone-700 dark:text-stone-300 font-medium truncate text-[11px]">
                            {assignedMat.name}
                          </span>
                        </>
                      ) : (
                        <span className="text-stone-400 italic text-[11px]">No material assigned</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Material Technical Detail Card */}
          {currentZoneMaterial && (
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded-full border border-stone-300 dark:border-stone-600 shrink-0"
                  style={{ backgroundColor: currentZoneMaterial.colorHex }}
                />
                <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  {currentZoneMaterial.name}
                </h4>
              </div>

              <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                {currentZoneMaterial.description}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px]">
                <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Durability: ~{currentZoneMaterial.durabilityYears} yrs</span>
                </div>
                <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
                  <Wrench className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>Maintenance: {currentZoneMaterial.maintenanceLevel}</span>
                </div>
                <div className="col-span-2 flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
                  <CloudSun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">{currentZoneMaterial.weatherResistance}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/60 text-[11px] flex justify-between items-center">
                <span className="text-stone-500">Estimated Unit Cost:</span>
                <span className="font-mono font-bold text-stone-900 dark:text-stone-100">
                  {currencySymbol}
                  {(currentZoneMaterial.unitRate * currencyRate).toFixed(2)} / sq ft
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Material Category Tabs & Swatches Grid */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <span>2. Pick Material for:</span>
              <span className="text-amber-600 dark:text-amber-400 underline decoration-amber-500/50">
                {activeZone?.name || 'Selected Zone'}
              </span>
            </h3>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800/70 p-1 rounded-xl">
              {[
                { id: 'all', label: 'All Materials' },
                { id: 'paint', label: 'Paints & Plasters' },
                { id: 'stone', label: 'Stone Cladding' },
                { id: 'panel', label: 'WPC & Louvers' },
                { id: 'railing', label: 'Railings' },
                { id: 'trim', label: 'Trims' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedCategory === tab.id
                      ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs font-bold'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Material Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredMaterials.map((mat) => {
              const isAssignedToActive = activeZone?.assignedMaterialId === mat.id;

              return (
                <div
                  key={mat.id}
                  onClick={() => activeZone && handleApplyMaterialToZone(activeZone.id, mat.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
                    isAssignedToActive
                      ? 'border-amber-500 bg-amber-500/5 shadow-md ring-2 ring-amber-500/30'
                      : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-amber-400/60 hover:shadow-sm'
                  }`}
                >
                  <div>
                    {/* Swatch & Title Bar */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-xl border border-stone-300 dark:border-stone-700 shadow-inner shrink-0"
                          style={{ backgroundColor: mat.colorHex }}
                        />
                        <div>
                          <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100 group-hover:text-amber-500 transition-colors">
                            {mat.name}
                          </h4>
                          <span className="text-[10px] text-stone-500">{mat.categoryLabel}</span>
                        </div>
                      </div>

                      {isAssignedToActive ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 font-bold text-[10px] flex items-center gap-1 shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Applied</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-stone-400 group-hover:text-amber-500 shrink-0">
                          Select →
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                      {mat.description}
                    </p>
                  </div>

                  {/* Durability, Rates & Pack Specs */}
                  <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 text-[11px] space-y-1.5">
                    <div className="flex items-center justify-between text-stone-500">
                      <span>Lifespan / Durability:</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">
                        {mat.durabilityYears} Years
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">Material + Labor:</span>
                      <span className="font-mono font-bold text-stone-900 dark:text-stone-100 text-xs">
                        {currencySymbol}
                        {((mat.unitRate + mat.laborRate) * currencyRate).toFixed(2)} / sq ft
                      </span>
                    </div>

                    <div className="text-[10px] text-stone-400 truncate pt-1">
                      Packaging: {mat.packSize}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
