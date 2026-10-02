import React, { useState, useRef, useEffect } from 'react';
import {
  Sliders,
  Columns,
  Sparkles,
  Download,
  Share2,
  Maximize2,
  ChevronRight,
  ShieldAlert,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
} from 'lucide-react';
import { Material, StructuralZone, ArchitecturalAdviceReport } from '../types';
import { renderRenovationCanvas } from '../utils/renderer';
import { MATERIAL_CATALOG } from '../data/materials';

interface VisualizationSectionProps {
  imageSrc: string;
  zones: StructuralZone[];
  materialsMap: Map<string, Material>;
  onContinueToCost: () => void;
  buildingMeta: {
    buildingType?: string;
    estimatedFloors?: number;
    conditionAssessment?: string;
  };
}

export const VisualizationSection: React.FC<VisualizationSectionProps> = ({
  imageSrc,
  zones,
  materialsMap,
  onContinueToCost,
  buildingMeta,
}) => {
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side' | 'crossfade'>('slider');
  const [sliderPosition, setSliderPosition] = useState(50); // 0 to 100%
  const [crossfadeOpacity, setCrossfadeOpacity] = useState(1.0); // 0 to 1
  const [renderedImageUrl, setRenderedImageUrl] = useState<string | null>(null);
  const [isGeneratingAdvice, setIsGeneratingAdvice] = useState(false);
  const [adviceReport, setAdviceReport] = useState<ArchitecturalAdviceReport | null>(null);
  const [showAdviceModal, setShowAdviceModal] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  // Render facade canvas whenever zones or materials change
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = img.naturalWidth || 1200;
      canvas.height = img.naturalHeight || 800;
      renderRenovationCanvas(canvas, img, zones, materialsMap, {
        blendIntensity: 0.92,
        showPolygons: false,
      });
      setRenderedImageUrl(canvas.toDataURL('image/jpeg', 0.92));
    };
    img.src = imageSrc;
  }, [imageSrc, zones, materialsMap]);

  // Split-slider drag handlers
  const handleSliderMouseDown = () => {
    isDraggingRef.current = true;
  };

  const handleSliderMouseMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const posX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const percent = Math.round((posX / rect.width) * 100);
    setSliderPosition(percent);
  };

  const handleSliderMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Call Gemini for architectural consultation advice
  const fetchArchitecturalAdvice = async () => {
    setIsGeneratingAdvice(true);
    setShowAdviceModal(true);
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

  const handleDownloadRender = () => {
    if (!renderedImageUrl) return;
    const a = document.createElement('a');
    a.href = renderedImageUrl;
    a.download = `facade-renovation-redesign-${Date.now()}.jpg`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <Sliders className="w-4 h-4" />
            <span>Step 4 · Visual Redesign & Comparison Inspection</span>
          </div>
          <h2 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight mt-1">
            Renovated House Facade Preview
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Realistic visual simulation applying chosen materials onto your actual house architecture. Drag the slider to inspect before vs after.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-900 p-1 rounded-xl border border-stone-200 dark:border-stone-800 text-xs font-medium">
            <button
              onClick={() => setViewMode('slider')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'slider'
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold shadow-xs'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              Split Slider
            </button>
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'side-by-side'
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold shadow-xs'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setViewMode('crossfade')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'crossfade'
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold shadow-xs'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              Crossfade
            </button>
          </div>

          {/* AI Architectural Consultation */}
          <button
            onClick={fetchArchitecturalAdvice}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-bold transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Design & Substrate Advice</span>
          </button>

          {/* Download Render */}
          <button
            onClick={handleDownloadRender}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-50 transition-all"
            title="Download high-resolution renovation image"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save Image</span>
          </button>

          {/* Proceed to Costing */}
          <button
            onClick={onContinueToCost}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all hover:translate-x-0.5"
          >
            <span>Proceed to Cost Breakdown</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main View Area */}
      <div className="mt-6">
        {viewMode === 'slider' && (
          <div className="bg-stone-950 rounded-2xl overflow-hidden shadow-2xl border border-stone-800 p-4 sm:p-6">
            <div
              ref={containerRef}
              onMouseDown={handleSliderMouseDown}
              onMouseMove={handleSliderMouseMove}
              onMouseUp={handleSliderMouseUp}
              onTouchStart={handleSliderMouseDown}
              onTouchMove={handleSliderMouseMove}
              onTouchEnd={handleSliderMouseUp}
              className="relative mx-auto max-w-5xl rounded-xl overflow-hidden select-none cursor-ew-resize aspect-4/3 sm:aspect-16/10"
            >
              {/* Renovated Image (Underneath) */}
              {renderedImageUrl && (
                <img
                  src={renderedImageUrl}
                  alt="Redesigned Facade"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
              )}

              {/* Original Image (Clipped on left by slider) */}
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src={imageSrc}
                  alt="Original House"
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{ width: containerRef.current?.clientWidth || '100%' }}
                />
              </div>

              {/* Split Line & Handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-20 pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white text-stone-900 shadow-xl flex items-center justify-center border-2 border-amber-500">
                  <Columns className="w-4 h-4" />
                </div>
              </div>

              {/* Labels */}
              <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-lg bg-stone-900/80 backdrop-blur-xs text-white text-xs font-bold uppercase tracking-wider border border-white/20">
                Original House
              </div>
              <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-lg bg-amber-500/90 backdrop-blur-xs text-stone-950 text-xs font-bold uppercase tracking-wider shadow-sm">
                Redesigned Facade
              </div>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-xs text-stone-300 text-[11px] pointer-events-none border border-stone-700">
                ← Drag split line to compare →
              </div>
            </div>
          </div>
        )}

        {viewMode === 'side-by-side' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-stone-950 rounded-2xl p-6 border border-stone-800 shadow-2xl">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-300 uppercase tracking-wider">Before (Original House)</span>
                <span className="text-stone-500 font-mono text-[11px]">Existing Exterior Condition</span>
              </div>
              <div className="rounded-xl overflow-hidden border border-stone-800 relative aspect-4/3">
                <img src={imageSrc} alt="Original Facade" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400 uppercase tracking-wider">After (Redesigned Facade)</span>
                <span className="text-stone-500 font-mono text-[11px]">Applied Materials & Cladding</span>
              </div>
              <div className="rounded-xl overflow-hidden border border-amber-500/40 relative aspect-4/3">
                {renderedImageUrl && (
                  <img src={renderedImageUrl} alt="Redesigned Facade" className="w-full h-full object-cover" />
                )}
              </div>
            </div>
          </div>
        )}

        {viewMode === 'crossfade' && (
          <div className="bg-stone-950 rounded-2xl p-6 border border-stone-800 shadow-2xl space-y-4">
            <div className="relative mx-auto max-w-4xl rounded-xl overflow-hidden aspect-4/3 sm:aspect-16/10">
              <img src={imageSrc} alt="Original House" className="absolute inset-0 w-full h-full object-cover" />
              {renderedImageUrl && (
                <img
                  src={renderedImageUrl}
                  alt="Redesigned Facade"
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-150"
                  style={{ opacity: crossfadeOpacity }}
                />
              )}
            </div>

            <div className="max-w-md mx-auto flex items-center gap-4 text-xs text-stone-300">
              <span className="shrink-0 font-medium">Original (0%)</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={crossfadeOpacity}
                onChange={(e) => setCrossfadeOpacity(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="shrink-0 font-bold text-amber-400">Renovated (100%)</span>
            </div>
          </div>
        )}
      </div>

      {/* Applied Materials Legend Strip */}
      <div className="mt-6 p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
        <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-3">
          Applied Finishes & Structural Materials
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {zones.map((zone) => {
            const mat = zone.assignedMaterialId ? materialsMap.get(zone.assignedMaterialId) : null;
            if (!mat) return null;
            return (
              <div
                key={zone.id}
                className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 flex items-center gap-2.5"
              >
                <span
                  className="w-4 h-4 rounded-full border border-stone-300 dark:border-stone-600 shrink-0"
                  style={{ backgroundColor: mat.colorHex }}
                />
                <div className="min-w-0">
                  <div className="font-bold text-xs text-stone-900 dark:text-stone-100 truncate">
                    {zone.name}
                  </div>
                  <div className="text-[10px] text-stone-500 truncate">
                    {mat.name} · {zone.netAreaSqFt} sq ft
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Architectural Consultation Modal / Drawer */}
      {showAdviceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-2xl w-full border border-stone-200 dark:border-stone-800 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-stone-900 dark:text-stone-100">
                    AI Architectural & Engineering Critique
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Powered by Gemini 3.8 Flash · Architectural Facade Analysis
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAdviceModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {isGeneratingAdvice ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-stone-600 dark:text-stone-400 font-medium">
                  Reviewing material compatibility, substrate adhesion, and contractor negotiation points...
                </p>
              </div>
            ) : adviceReport ? (
              <div className="space-y-5 text-xs">
                {/* Aesthetic Cohesion */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/60">
                  <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs mb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Aesthetic Cohesion & Visual Massing</span>
                  </h4>
                  <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                    {adviceReport.aestheticCohesion}
                  </p>
                </div>

                {/* Substrate & Technical */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/60">
                  <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs mb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Technical Durability & Substrate Waterproofing</span>
                  </h4>
                  <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                    {adviceReport.technicalAdvice}
                  </p>
                </div>

                {/* Maintenance */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/60">
                  <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs mb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Long-Term Maintenance & Cleaning Cycle</span>
                  </h4>
                  <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                    {adviceReport.maintenanceUpkeep}
                  </p>
                </div>

                {/* Contractor Questions */}
                <div>
                  <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs mb-2">
                    Must-Ask Questions for Your Contractor Quotation
                  </h4>
                  <ul className="space-y-1.5 pl-1">
                    {adviceReport.contractorChecklist.map((q, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-stone-600 dark:text-stone-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Value Engineering */}
                <div>
                  <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs mb-2">
                    Value Engineering Opportunities (Cost Savings)
                  </h4>
                  <ul className="space-y-1.5 pl-1">
                    {adviceReport.valueEngineering.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-stone-600 dark:text-stone-300">
                        <AlertCircle className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}

            <div className="flex justify-end pt-2 border-t border-stone-200 dark:border-stone-800">
              <button
                onClick={() => setShowAdviceModal(false)}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
