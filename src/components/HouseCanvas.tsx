import React, { useRef, useState, useEffect } from 'react';
import {
  Sparkles,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sliders,
  Check,
  Eye,
  Layers,
  Edit2,
  Paintbrush,
  Palette,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { StructuralZone, Material } from '../types';

interface HouseCanvasProps {
  originalImageSrc: string;
  renovatedImageSrc: string | null;
  zones: StructuralZone[];
  activeZoneId: string | null;
  onSelectZone: (id: string | null) => void;
  onMaterialDropped: (zoneId: string, materialId: string) => void;
  materialsMap: Map<string, Material>;
  hasPendingChanges: boolean;
  isGenerating: boolean;
  onGenerateAiDesign: () => void;
  onEditZoneArea: (zone: StructuralZone) => void;
  onOpenMaterialPickerForZone: (zone: StructuralZone) => void;
  onOpenColorPickerForZone: (zone: StructuralZone) => void;
  aiGenerationNote?: string | null;
  onOpenGuide?: () => void;
}

type ViewMode = 'ai' | 'original' | 'compare';

export const HouseCanvas: React.FC<HouseCanvasProps> = ({
  originalImageSrc,
  renovatedImageSrc,
  zones,
  activeZoneId,
  onSelectZone,
  onMaterialDropped,
  materialsMap,
  hasPendingChanges,
  isGenerating,
  onGenerateAiDesign,
  onEditZoneArea,
  onOpenMaterialPickerForZone,
  onOpenColorPickerForZone,
  aiGenerationNote,
  onOpenGuide,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>(renovatedImageSrc ? 'ai' : 'original');
  const [comparePosition, setComparePosition] = useState<number>(50); // percentage 0 to 100
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showDetectedAreas, setShowDetectedAreas] = useState<boolean>(true);
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);
  const [dragOverZoneId, setDragOverZoneId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isComparing = viewMode === 'compare';

  // Synchronize view mode if renovated image arrives
  useEffect(() => {
    if (renovatedImageSrc && viewMode === 'original') {
      setViewMode('ai');
    }
  }, [renovatedImageSrc]);

  // Handle Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Helper to determine which zone is under client (x, y) relative to image
  const getZoneAtNormalizedPoint = (nx: number, ny: number): StructuralZone | null => {
    for (let i = zones.length - 1; i >= 0; i--) {
      const z = zones[i];
      if (pointInPolygon([nx, ny], z.polygon)) {
        return z;
      }
    }
    return null;
  };

  function pointInPolygon(point: [number, number], vs: number[][]): boolean {
    const x = point[0];
    const y = point[1];
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      const xi = vs[i][0], yi = vs[i][1];
      const xj = vs[j][0], yj = vs[j][1];
      const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }

  // Handle Drag Over / Drop for Material Library
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;

    const targetZone = getZoneAtNormalizedPoint(nx, ny);
    if (targetZone && targetZone.id !== dragOverZoneId) {
      setDragOverZoneId(targetZone.id);
    } else if (!targetZone && dragOverZoneId) {
      setDragOverZoneId(null);
    }
  };

  const handleDragLeave = () => {
    setDragOverZoneId(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;

    const targetZone = getZoneAtNormalizedPoint(nx, ny);
    const materialId = e.dataTransfer.getData('text/plain');

    if (targetZone && materialId) {
      onMaterialDropped(targetZone.id, materialId);
      onSelectZone(targetZone.id);
    }
    setDragOverZoneId(null);
  };

  const activeZone = zones.find((z) => z.id === activeZoneId);
  const activeZoneMaterial = activeZone?.assignedMaterialId
    ? materialsMap.get(activeZone.assignedMaterialId)
    : null;

  // Active image to display
  const displayImageSrc =
    viewMode === 'original' || !renovatedImageSrc ? originalImageSrc : renovatedImageSrc;

  return (
    <div
      ref={containerRef}
      className={`flex-1 flex flex-col bg-[#f5f5f7] select-none relative overflow-hidden h-full ${
        isFullscreen ? 'p-4' : 'p-3 sm:p-5'
      }`}
    >
      {/* Top Floating Controls Bar */}
      <div className="flex items-center justify-between mb-3 z-20 gap-2 shrink-0">
        {/* Left: View Mode Pills */}
        <div className="flex items-center bg-white/95 backdrop-blur-md border border-zinc-200/90 shadow-2xs rounded-xl p-1 gap-1">
          <button
            onClick={() => setViewMode('original')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'original'
                ? 'bg-zinc-900 text-white shadow-2xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Original
          </button>
          <button
            disabled={!renovatedImageSrc}
            onClick={() => setViewMode('ai')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              viewMode === 'ai'
                ? 'bg-zinc-900 text-white shadow-2xs'
                : renovatedImageSrc
                ? 'text-zinc-600 hover:text-zinc-900'
                : 'text-zinc-300 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-3 h-3 text-violet-400" />
            <span>AI Design</span>
          </button>
          <button
            disabled={!renovatedImageSrc}
            onClick={() => setViewMode('compare')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
              viewMode === 'compare'
                ? 'bg-zinc-900 text-white shadow-2xs'
                : renovatedImageSrc
                ? 'text-zinc-600 hover:text-zinc-900'
                : 'text-zinc-300 cursor-not-allowed'
            }`}
          >
            <Sliders className="w-3 h-3" />
            <span>Compare</span>
          </button>
        </div>

        {/* Center: Notice or Changes Indicator */}
        <div className="hidden lg:flex items-center gap-2">
          {hasPendingChanges && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-1 rounded-full shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              <span>Materials updated</span>
              <button
                onClick={onGenerateAiDesign}
                disabled={isGenerating}
                className="font-bold underline hover:text-amber-950 ml-1 cursor-pointer"
              >
                Generate Preview
              </button>
            </div>
          )}

          {aiGenerationNote && (
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 bg-white/80 border border-zinc-200 px-2.5 py-1 rounded-full">
              <Sparkles className="w-3 h-3 text-violet-500" />
              <span>{aiGenerationNote}</span>
            </div>
          )}
        </div>

        {/* Right: Viewport Utilities */}
        <div className="flex items-center bg-white/95 backdrop-blur-md border border-zinc-200/90 shadow-2xs rounded-xl p-1 gap-1">
          <button
            onClick={() => setShowDetectedAreas(!showDetectedAreas)}
            title="Toggle Detected Areas Overlay"
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              showDetectedAreas
                ? 'bg-violet-50 text-violet-700 font-semibold'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Areas</span>
          </button>

          <div className="w-[1px] h-4 bg-zinc-200 mx-0.5" />

          <button
            onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
            title="Zoom In"
            className="p-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
            title="Zoom Out"
            className="p-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            title="Reset Zoom"
            className="p-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            className="p-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport Area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden rounded-2xl bg-zinc-900 shadow-inner">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="relative max-w-full max-h-full transition-transform duration-150 ease-out cursor-default"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* 1. Compare View Slider Mode */}
          {isComparing && renovatedImageSrc ? (
            <div className="relative overflow-hidden select-none shadow-2xl rounded-lg">
              {/* Renovated Background Image (Right side) */}
              <img
                src={renovatedImageSrc}
                alt="AI Renovated Home"
                className="max-h-[70vh] w-auto object-contain block pointer-events-none"
              />

              {/* Original Clipped Image (Left side) */}
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ clipPath: `inset(0 ${100 - comparePosition}% 0 0)` }}
              >
                <img
                  src={originalImageSrc}
                  alt="Original Home"
                  className="max-h-[70vh] w-auto object-contain block pointer-events-none"
                />
              </div>

              {/* Slider Divider Line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.8)] cursor-ew-resize z-20 flex items-center justify-center"
                style={{ left: `${comparePosition}%` }}
              >
                <div className="w-8 h-8 rounded-full bg-white shadow-lg border border-zinc-300 flex items-center justify-center text-zinc-800 -translate-x-1/2">
                  <Sliders className="w-4 h-4 text-violet-600 rotate-90" />
                </div>
              </div>

              {/* Invisible interactive range input covering the slider */}
              <input
                type="range"
                min="0"
                max="100"
                value={comparePosition}
                onChange={(e) => setComparePosition(Number(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-30"
              />

              {/* Before & After Badges */}
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-md pointer-events-none">
                ORIGINAL
              </div>
              <div className="absolute top-3 right-3 bg-violet-600/90 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-md pointer-events-none">
                AI RENOVATION
              </div>
            </div>
          ) : (
            /* 2. Standard Single Image Mode (Original or AI Design) */
            <div className="relative shadow-2xl rounded-lg overflow-hidden group">
              <img
                src={displayImageSrc}
                alt="House Facade View"
                className="max-h-[70vh] w-auto object-contain block pointer-events-none"
              />

              {/* SVG Surface Overlays for Detected Areas */}
              {showDetectedAreas && (
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-auto"
                  viewBox="0 0 1000 1000"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="areaGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>

                  {zones.map((zone) => {
                    const isSelected = activeZoneId === zone.id;
                    const isHovered = hoveredZoneId === zone.id;
                    const isDragOver = dragOverZoneId === zone.id;

                    const points = zone.polygon
                      .map(([x, y]) => `${Math.round(x * 1000)},${Math.round(y * 1000)}`)
                      .join(' ');

                    return (
                      <polygon
                        key={zone.id}
                        points={points}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectZone(isSelected ? null : zone.id);
                        }}
                        onMouseEnter={() => setHoveredZoneId(zone.id)}
                        onMouseLeave={() => setHoveredZoneId(null)}
                        className={`transition-all duration-150 cursor-pointer ${
                          isDragOver
                            ? 'fill-violet-500/40 stroke-violet-300 stroke-[5] filter drop-shadow-[0_0_12px_rgba(139,92,246,0.9)] animate-pulse'
                            : isSelected
                            ? 'fill-violet-500/25 stroke-violet-400 stroke-[3.5] filter drop-shadow-[0_0_6px_rgba(139,92,246,0.8)]'
                            : isHovered
                            ? 'fill-white/20 stroke-white stroke-[2.5]'
                            : 'fill-transparent hover:fill-white/10 stroke-white/40 stroke-[1.5] stroke-dasharray-[4,4]'
                        }`}
                      />
                    );
                  })}
                </svg>
              )}

              {/* Active Zone Floating Contextual Pill Toolbar */}
              {activeZone && showDetectedAreas && (
                <div
                  className="absolute z-40 bg-zinc-900/95 backdrop-blur-md text-white p-3 rounded-xl shadow-2xl border border-zinc-700/80 animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-2 max-w-xs"
                  style={{
                    left: `${Math.min(75, Math.max(10, activeZone.polygon[0][0] * 100))}%`,
                    top: `${Math.min(75, Math.max(10, activeZone.polygon[0][1] * 100))}%`,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold tracking-tight text-white">{activeZone.name}</h4>
                      <p className="text-[11px] text-zinc-400">
                        {activeZone.netAreaSqFt} sq ft • Current: <span className="text-violet-300 font-medium">{activeZoneMaterial ? activeZoneMaterial.name.split('(')[0] : 'Existing'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 pt-1 border-t border-zinc-800">
                    <button
                      onClick={() => onOpenMaterialPickerForZone(activeZone)}
                      className="px-2 py-1 bg-violet-600 hover:bg-violet-500 text-white rounded text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Paintbrush className="w-3 h-3" />
                      <span>Material</span>
                    </button>
                    <button
                      onClick={() => onEditZoneArea(activeZone)}
                      className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded text-[11px] font-medium flex items-center gap-1 transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Adjust Area</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Hover Area Label Indicator */}
              {dragOverZoneId && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-xl pointer-events-none animate-bounce">
                  Drop to apply onto {zones.find((z) => z.id === dragOverZoneId)?.name}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Primary Action Button Bar at Bottom */}
      <div className="mt-3 flex items-center justify-between gap-3 shrink-0">
        <div className="text-xs text-zinc-500 hidden sm:flex items-center gap-2">
          <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
          <span>Click any area to inspect or drag materials directly from library</span>
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="text-violet-600 hover:text-violet-700 font-semibold underline ml-1 cursor-pointer flex items-center gap-1"
            >
              <span>View Arrow Guide</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5 ml-auto">
          {hasPendingChanges && (
            <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg hidden sm:inline">
              Changes not generated
            </span>
          )}

          <button
            onClick={onGenerateAiDesign}
            disabled={isGenerating}
            className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-violet-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Generating your renovation...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-violet-200" />
                <span>{hasPendingChanges ? 'Generate Updated Preview' : 'Generate AI Design'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
