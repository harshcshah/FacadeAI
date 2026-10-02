import React, { useState } from 'react';
import {
  Sparkles,
  Download,
  Printer,
  Columns,
  Eye,
  Layers,
  CheckCircle2,
  TrendingUp,
  Sun,
  ShieldCheck,
  Palette,
  Info,
  SlidersHorizontal,
  RefreshCw,
  AppWindow,
  DoorClosed,
  Grid,
  ChevronRight,
  Maximize2,
  FileText,
} from 'lucide-react';
import { Material, StructuralZone, RenovationTheme } from '../types';

interface AiVisionMaterialShowcaseProps {
  originalImage: string;
  aiGeneratedImage: string | null;
  renderedCompositeImage: string | null;
  zones: StructuralZone[];
  materialsMap: Map<string, Material>;
  themeName?: string;
  isGeneratingAiImage: boolean;
  onGenerateAiImage: () => void;
  onOpenReport?: () => void;
  onSwapMaterial?: (zoneId: string, newMaterialId: string) => void;
  suitableMaterialsCatalog: Material[];
}

export const AiVisionMaterialShowcase: React.FC<AiVisionMaterialShowcaseProps> = ({
  originalImage,
  aiGeneratedImage,
  renderedCompositeImage,
  zones,
  materialsMap,
  themeName = 'Modern Architectural Renovation',
  isGeneratingAiImage,
  onGenerateAiImage,
  onOpenReport,
  onSwapMaterial,
  suitableMaterialsCatalog,
}) => {
  const [viewStyle, setViewStyle] = useState<'pins' | 'slider' | 'side_by_side' | 'clean'>('pins');
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [activeCalloutZoneId, setActiveCalloutZoneId] = useState<string | null>(null);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('all');
  const [swappingZoneId, setSwappingZoneId] = useState<string | null>(null);

  const displayImage = aiGeneratedImage || renderedCompositeImage || originalImage;

  // Extract unique materials grouped by category
  const materialUsageList = React.useMemo(() => {
    return zones.map((zone, idx) => {
      const mat = zone.assignedMaterialId ? materialsMap.get(zone.assignedMaterialId) : null;
      // Calculate normalized center of polygon for pin
      let cx = 0.5;
      let cy = 0.5;
      if (zone.polygon && zone.polygon.length > 0) {
        cx = zone.polygon.reduce((acc, p) => acc + p[0], 0) / zone.polygon.length;
        cy = zone.polygon.reduce((acc, p) => acc + p[1], 0) / zone.polygon.length;
      }

      return {
        pinNumber: idx + 1,
        zoneId: zone.id,
        zoneName: zone.name,
        zoneType: zone.type,
        grossArea: zone.grossAreaSqFt,
        netArea: zone.netAreaSqFt,
        material: mat,
        coords: { x: cx, y: cy },
      };
    });
  }, [zones, materialsMap]);

  // Categories for filter tabs
  const categories = [
    { id: 'all', label: 'All Materials', count: materialUsageList.length },
    { id: 'window', label: '🪟 Windows', count: materialUsageList.filter((m) => m.zoneType === 'window').length },
    { id: 'door', label: '🚪 Doors', count: materialUsageList.filter((m) => m.zoneType === 'door').length },
    { id: 'wall', label: '🧱 Walls & Stone', count: materialUsageList.filter((m) => m.zoneType === 'main_wall' || m.zoneType === 'accent_wall' || m.zoneType === 'pillar').length },
    { id: 'railing', label: '🪜 Balconies', count: materialUsageList.filter((m) => m.zoneType === 'railing' || m.zoneType === 'balcony').length },
  ];

  const filteredMaterials = materialUsageList.filter((item) => {
    if (selectedCategoryTab === 'all') return true;
    if (selectedCategoryTab === 'window') return item.zoneType === 'window';
    if (selectedCategoryTab === 'door') return item.zoneType === 'door';
    if (selectedCategoryTab === 'wall') return item.zoneType === 'main_wall' || item.zoneType === 'accent_wall' || item.zoneType === 'pillar';
    if (selectedCategoryTab === 'railing') return item.zoneType === 'railing' || item.zoneType === 'balcony';
    return true;
  });

  const handleDownload = () => {
    if (!displayImage) return;
    const link = document.createElement('a');
    link.download = `facadecraft-ai-renovation-${Date.now()}.jpg`;
    link.href = displayImage;
    link.click();
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center p-3 sm:p-5 overflow-y-auto max-w-6xl mx-auto space-y-6">
      {/* 1. Header with Status & Action Buttons */}
      <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
            <Sparkles className="w-6 h-6 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                AI Photorealistic Finished Facade
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider font-mono border border-indigo-200/60">
                {aiGeneratedImage ? 'Gemini 8K Vision' : 'Precision Material Mapping'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Theme: <span className="font-semibold text-slate-700">{themeName}</span> · All materials mapped below with architectural specifications
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onGenerateAiImage}
            disabled={isGeneratingAiImage}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-indigo-600 to-blue-600 hover:from-amber-600 hover:to-blue-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            title="Re-synthesize with Gemini AI"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-200 ${isGeneratingAiImage ? 'animate-spin' : ''}`} />
            <span>{isGeneratingAiImage ? 'Synthesizing...' : 'Regenerate AI Vision'}</span>
          </button>

          {onOpenReport && (
            <button
              onClick={onOpenReport}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export PDF Manual</span>
            </button>
          )}

          <button
            onClick={handleDownload}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="Download Image"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Visual Viewport & Overlay Switcher */}
      <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col">
        {/* View Mode Bar */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs font-semibold text-slate-700">
            <button
              onClick={() => setViewStyle('pins')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                viewStyle === 'pins' ? 'bg-indigo-600 text-white shadow-xs' : 'hover:bg-slate-100'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Material Callout Pins</span>
            </button>

            <button
              onClick={() => setViewStyle('slider')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                viewStyle === 'slider' ? 'bg-indigo-600 text-white shadow-xs' : 'hover:bg-slate-100'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Before vs AI Slider</span>
            </button>

            <button
              onClick={() => setViewStyle('side_by_side')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                viewStyle === 'side_by_side' ? 'bg-indigo-600 text-white shadow-xs' : 'hover:bg-slate-100'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Side-by-Side</span>
            </button>

            <button
              onClick={() => setViewStyle('clean')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                viewStyle === 'clean' ? 'bg-indigo-600 text-white shadow-xs' : 'hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Clean 4K Elevation</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 font-medium hidden sm:block">
            {viewStyle === 'pins' && '💡 Click any pin on the house to inspect and change that material!'}
            {viewStyle === 'slider' && '← Drag the center handle to see original vs finished renovation →'}
          </div>
        </div>

        {/* Viewport Frame */}
        <div className="relative w-full aspect-16/10 bg-stone-900 select-none overflow-hidden">
          {/* VIEW: CALLOUT PINS & CLEAN */}
          {(viewStyle === 'pins' || viewStyle === 'clean') && (
            <div className="relative w-full h-full">
              <img
                src={displayImage}
                alt="AI Photorealistic Renovation"
                className="w-full h-full object-cover"
              />

              {/* Badges on Corners */}
              <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold border border-white/20 shadow-lg flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>AI Finished Vision</span>
              </div>

              {/* Interactive Material Callout Pins on Facade */}
              {viewStyle === 'pins' &&
                materialUsageList.map((item) => {
                  const isActive = activeCalloutZoneId === item.zoneId;
                  const pinLeft = Math.max(8, Math.min(92, item.coords.x * 100));
                  const pinTop = Math.max(12, Math.min(88, item.coords.y * 100));

                  return (
                    <div
                      key={item.zoneId}
                      style={{ left: `${pinLeft}%`, top: `${pinTop}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                    >
                      {/* Pin Trigger Button */}
                      <button
                        onClick={() =>
                          setActiveCalloutZoneId(isActive ? null : item.zoneId)
                        }
                        className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-2xl transition-all cursor-pointer border ${
                          isActive
                            ? 'bg-blue-600 text-white border-white ring-4 ring-blue-500/40 scale-110'
                            : 'bg-white/95 text-slate-900 hover:bg-blue-50 hover:text-blue-700 border-slate-300'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-slate-300 shrink-0"
                          style={{
                            backgroundColor: item.material?.colorHex || '#2563EB',
                          }}
                        />
                        <span className="text-[11px] font-extrabold whitespace-nowrap">
                          {item.material ? item.material.name.split(' ')[0] : item.zoneName}
                        </span>
                        <span className="w-4 h-4 rounded-full bg-slate-900 text-white text-[9px] font-black flex items-center justify-center shrink-0">
                          {item.pinNumber}
                        </span>
                      </button>

                      {/* Floating Callout Tooltip Card */}
                      {isActive && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xl text-slate-800 z-30 animate-in fade-in zoom-in-95 duration-150">
                          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                            <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 font-mono">
                              Pin #{item.pinNumber} · {item.zoneType.replace('_', ' ')}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveCalloutZoneId(null);
                              }}
                              className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                            >
                              ✕
                            </button>
                          </div>

                          <div className="mt-2 space-y-1">
                            <h4 className="font-extrabold text-xs text-slate-900">
                              {item.material?.name || 'Architectural Finish'}
                            </h4>
                            <p className="text-[11px] text-slate-500 leading-tight">
                              {item.material?.description || 'Custom selected exterior material'}
                            </p>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                            <span className="text-slate-400 font-mono">{item.netArea} sq ft</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSwappingZoneId(item.zoneId);
                              }}
                              className="text-blue-600 font-bold hover:underline"
                            >
                              Swap Material →
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}

          {/* VIEW: SLIDER */}
          {viewStyle === 'slider' && (
            <div className="relative w-full h-full select-none cursor-ew-resize">
              <img
                src={displayImage}
                alt="AI Photorealistic Renovation"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />

              <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src={originalImage}
                  alt="Original House"
                  className="absolute top-0 left-0 h-full object-cover max-w-none pointer-events-none"
                  style={{ width: '100vw' }}
                />
              </div>

              {/* Slider Line & Drag Handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-20 cursor-ew-resize"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-indigo-600 shadow-2xl flex items-center justify-center border-2 border-indigo-600 hover:scale-110 transition-transform">
                  <Columns className="w-5 h-5" />
                </div>
              </div>

              {/* Range input overlay for smooth interaction */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-30"
              />

              <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
                Existing Condition
              </div>
              <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                AI Photorealistic Finished Vision
              </div>
            </div>
          )}

          {/* VIEW: SIDE BY SIDE */}
          {viewStyle === 'side_by_side' && (
            <div className="grid grid-cols-2 w-full h-full gap-1 bg-slate-900">
              <div className="relative w-full h-full overflow-hidden">
                <img src={originalImage} alt="Original" className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/80 text-white text-[11px] font-bold uppercase">
                  Original Photo
                </div>
              </div>
              <div className="relative w-full h-full overflow-hidden">
                <img src={displayImage} alt="Renovated" className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-[11px] font-bold uppercase shadow-md">
                  AI Finished Elevation
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. BIFURCATED "MATERIALS APPLIED BY AI" BREAKDOWN SHOWCASE */}
      <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Palette className="w-5 h-5 text-indigo-600" />
              <span>Architectural Materials Breakdown</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Exact materials applied by AI to your house facade. Click any item to customize or swap.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryTab(cat.id)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategoryTab === cat.id
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{cat.label}</span>
                <span className="ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 font-mono">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Bifurcated Grid of Material Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredMaterials.map((item) => {
            const mat = item.material;
            const isSwapping = swappingZoneId === item.zoneId;

            return (
              <div
                key={item.zoneId}
                className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/90 hover:border-indigo-300 hover:bg-white transition-all flex flex-col justify-between shadow-2xs hover:shadow-sm"
              >
                <div>
                  {/* Category & Pin badge */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 mb-2.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 font-mono bg-indigo-50 px-2 py-0.5 rounded-md">
                      {item.zoneType.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Pin #{item.pinNumber} · {item.netArea} sq ft
                    </span>
                  </div>

                  {/* Swatch & Title */}
                  <div className="flex items-start gap-3">
                    <div
                      className="w-12 h-12 rounded-xl border border-slate-300 shadow-xs shrink-0 relative overflow-hidden"
                      style={{ backgroundColor: mat?.colorHex || '#CBD5E1' }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-xs text-slate-900 truncate">
                        {mat?.name || item.zoneName}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-tight">
                        {mat?.description || 'Custom architectural finish assigned to this zone.'}
                      </p>
                    </div>
                  </div>

                  {/* Durability & Weather Resistance */}
                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Durability:</span>
                      <span className="font-bold text-slate-700">{mat?.durabilityYears || 20} Years</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Weather Proof:</span>
                      <span className="font-bold text-slate-700 truncate block">
                        {mat?.weatherResistance ? mat.weatherResistance.split(' ')[0] : 'High Grade'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Swap Drawer */}
                {isSwapping ? (
                  <div className="mt-3 pt-2 border-t border-indigo-200 bg-indigo-50/50 p-2 rounded-xl">
                    <div className="flex items-center justify-between pb-1 mb-1 text-[10px] font-bold text-indigo-900">
                      <span>Pick Replacement Finish:</span>
                      <button
                        onClick={() => setSwappingZoneId(null)}
                        className="text-slate-400 hover:text-slate-700"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
                      {suitableMaterialsCatalog.slice(0, 6).map((altMat) => (
                        <button
                          key={altMat.id}
                          onClick={() => {
                            if (onSwapMaterial) {
                              onSwapMaterial(item.zoneId, altMat.id);
                            }
                            setSwappingZoneId(null);
                          }}
                          className="w-7 h-7 rounded-lg border border-slate-300 shadow-xs shrink-0 hover:scale-110 transition-transform cursor-pointer"
                          style={{ backgroundColor: altMat.colorHex }}
                          title={altMat.name}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-bold text-slate-500">
                      {mat ? `$${(mat.unitRate + mat.laborRate).toFixed(0)}/sq ft` : '$25/sq ft'}
                    </span>
                    <button
                      onClick={() => setSwappingZoneId(item.zoneId)}
                      className="text-indigo-600 hover:text-indigo-800 font-extrabold text-[11px] hover:underline cursor-pointer"
                    >
                      Swap Finish ↻
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. AI Transformation Consultation Summary */}
      <div className="w-full bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-purple-50/80 rounded-3xl border border-indigo-200/80 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 font-mono">
              Architectural Curb Appeal Appraisal
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              Estimated +18% to +24% Property Appraisal Lift
            </h3>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              Replacing worn substrates with mineral elastomeric stucco, natural stacked granite veneer, and slimline thermal-break glazing modernizes the visual envelope while significantly elevating curb appeal and market value.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onOpenReport && (
              <button
                onClick={onOpenReport}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>View Full Contractor Report</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
