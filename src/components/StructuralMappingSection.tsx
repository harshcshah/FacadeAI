import React, { useState, useRef, useEffect } from 'react';
import {
  Layers,
  Sparkles,
  Maximize2,
  Minimize2,
  Plus,
  Trash2,
  RefreshCw,
  Ruler,
  Check,
  Info,
  Edit2,
  Sliders,
  ChevronRight,
  Eye,
  EyeOff,
} from 'lucide-react';
import { StructuralZone, StructuralZoneType, CalibrationScale } from '../types';

interface StructuralMappingSectionProps {
  imageSrc: string;
  zones: StructuralZone[];
  setZones: React.Dispatch<React.SetStateAction<StructuralZone[]>>;
  activeZoneId: string | null;
  setActiveZoneId: (id: string | null) => void;
  isAnalyzing: boolean;
  onRunAiAnalysis: () => void;
  buildingMeta: {
    buildingType?: string;
    estimatedFloors?: number;
    conditionAssessment?: string;
    architecturalStyle?: string;
  };
  onContinueToDesign: () => void;
  scale: CalibrationScale;
  setScale: React.Dispatch<React.SetStateAction<CalibrationScale>>;
}

const ZONE_TYPES: { type: StructuralZoneType; label: string; color: string }[] = [
  { type: 'main_wall', label: 'Main Wall', color: '#3B82F6' },
  { type: 'accent_wall', label: 'Accent / Feature Wall', color: '#8B5CF6' },
  { type: 'pillar', label: 'Pillar / Column', color: '#EC4899' },
  { type: 'balcony', label: 'Balcony Surface', color: '#F59E0B' },
  { type: 'railing', label: 'Balcony / Terrace Railing', color: '#10B981' },
  { type: 'parapet', label: 'Parapet Wall & Coping', color: '#6366F1' },
  { type: 'window', label: 'Window Trims & Frames', color: '#14B8A6' },
  { type: 'gate_porch', label: 'Porch / Gate Area', color: '#F97316' },
  { type: 'plinth', label: 'Plinth / Base Wall', color: '#64748B' },
];

export const StructuralMappingSection: React.FC<StructuralMappingSectionProps> = ({
  imageSrc,
  zones,
  setZones,
  activeZoneId,
  setActiveZoneId,
  isAnalyzing,
  onRunAiAnalysis,
  buildingMeta,
  onContinueToDesign,
  scale,
  setScale,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showPolygons, setShowPolygons] = useState(true);
  const [selectedVertex, setSelectedVertex] = useState<{ zoneId: string; vertexIdx: number } | null>(null);
  const [editingZone, setEditingZone] = useState<StructuralZone | null>(null);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationPoints, setCalibrationPoints] = useState<number[][]>([]);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Load image onto canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Set canvas display resolution matching natural aspect ratio
      const maxWidth = 900;
      const aspect = img.height / img.width;
      canvas.width = maxWidth;
      canvas.height = Math.round(maxWidth * aspect);
      setImageLoaded(true);
      drawMappingCanvas(img, canvas, zones, activeZoneId, showPolygons, calibrationPoints);
    };
    img.src = imageSrc;
  }, [imageSrc, zones, activeZoneId, showPolygons, calibrationPoints]);

  const drawMappingCanvas = (
    img: HTMLImageElement,
    canvas: HTMLCanvasElement,
    currentZones: StructuralZone[],
    activeId: string | null,
    polygonsVisible: boolean,
    calibPts: number[][]
  ) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    if (polygonsVisible) {
      currentZones.forEach((zone) => {
        if (!zone.polygon || zone.polygon.length < 3) return;
        const isActive = zone.id === activeId;
        const typeInfo = ZONE_TYPES.find((t) => t.type === zone.type) || ZONE_TYPES[0];

        ctx.save();
        ctx.beginPath();
        const p0 = zone.polygon[0];
        ctx.moveTo(p0[0] * canvas.width, p0[1] * canvas.height);
        for (let i = 1; i < zone.polygon.length; i++) {
          ctx.lineTo(zone.polygon[i][0] * canvas.width, zone.polygon[i][1] * canvas.height);
        }
        ctx.closePath();

        // Fill with tinted transparency
        ctx.fillStyle = isActive ? `${typeInfo.color}44` : `${typeInfo.color}1F`;
        ctx.fill();

        // Stroke
        ctx.strokeStyle = isActive ? '#FFFFFF' : typeInfo.color;
        ctx.lineWidth = isActive ? 2.5 : 1.5;
        if (!isActive) {
          ctx.setLineDash([4, 4]);
        }
        ctx.stroke();

        // Draw vertices for active zone so user can drag/adjust
        if (isActive) {
          zone.polygon.forEach((pt, vIdx) => {
            ctx.beginPath();
            ctx.arc(pt[0] * canvas.width, pt[1] * canvas.height, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
            ctx.strokeStyle = typeInfo.color;
            ctx.lineWidth = 2;
            ctx.stroke();
          });
        }

        // Label on centroid
        const avgX =
          zone.polygon.reduce((acc, p) => acc + p[0], 0) / zone.polygon.length;
        const avgY =
          zone.polygon.reduce((acc, p) => acc + p[1], 0) / zone.polygon.length;

        ctx.font = 'bold 11px system-ui, sans-serif';
        const labelText = `${zone.name} (${zone.netAreaSqFt} sq ft)`;
        const textMetrics = ctx.measureText(labelText);
        const padding = 4;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(
          avgX * canvas.width - textMetrics.width / 2 - padding,
          avgY * canvas.height - 12 - padding,
          textMetrics.width + padding * 2,
          16 + padding
        );

        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText(labelText, avgX * canvas.width, avgY * canvas.height);

        ctx.restore();
      });
    }

    // Draw calibration line if calibrating
    if (calibPts.length > 0) {
      ctx.save();
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(calibPts[0][0] * canvas.width, calibPts[0][0] * canvas.height);
      if (calibPts.length === 2) {
        ctx.lineTo(calibPts[1][0] * canvas.width, calibPts[1][0] * canvas.height);
      }
      ctx.stroke();

      calibPts.forEach((pt) => {
        ctx.beginPath();
        ctx.arc(pt[0] * canvas.width, pt[1] * canvas.height, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#F59E0B';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
      ctx.restore();
    }
  };

  // Canvas Mouse Click / Drag Handler for selecting & moving vertices
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / rect.width;
    const clickY = (e.clientY - rect.top) / rect.height;

    // If in calibration mode
    if (isCalibrating) {
      if (calibrationPoints.length === 0) {
        setCalibrationPoints([[clickX, clickY]]);
      } else if (calibrationPoints.length === 1) {
        const pt1 = calibrationPoints[0];
        const pt2 = [clickX, clickY];
        const pixelDist = Math.hypot((pt2[0] - pt1[0]) * canvas.width, (pt2[1] - pt1[1]) * canvas.height);
        setCalibrationPoints([pt1, pt2]);

        // Recalculate scale based on door height (7ft standard)
        const refFt = scale.referenceFeet || 7.0;
        const newPixelsPerFoot = pixelDist / refFt;
        setScale((prev) => ({
          ...prev,
          pixelDistance: Math.round(pixelDist),
          pixelsPerFoot: newPixelsPerFoot,
        }));
        setIsCalibrating(false);
      }
      return;
    }

    // Check if clicked on a vertex of the active zone
    if (activeZoneId) {
      const activeZone = zones.find((z) => z.id === activeZoneId);
      if (activeZone) {
        for (let i = 0; i < activeZone.polygon.length; i++) {
          const pt = activeZone.polygon[i];
          const dist = Math.hypot((pt[0] - clickX) * rect.width, (pt[1] - clickY) * rect.height);
          if (dist < 15) {
            setSelectedVertex({ zoneId: activeZoneId, vertexIdx: i });
            return;
          }
        }
      }
    }

    // Otherwise, check if clicked inside any zone polygon
    for (let i = zones.length - 1; i >= 0; i--) {
      const zone = zones[i];
      if (isPointInPolygon([clickX, clickY], zone.polygon)) {
        setActiveZoneId(zone.id);
        return;
      }
    }

    // Clicked outside
    setActiveZoneId(null);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectedVertex) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const moveX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const moveY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    setZones((prev) =>
      prev.map((zone) => {
        if (zone.id !== selectedVertex.zoneId) return zone;
        const updatedPoly = [...zone.polygon];
        updatedPoly[selectedVertex.vertexIdx] = [moveX, moveY];
        return {
          ...zone,
          polygon: updatedPoly,
        };
      })
    );
  };

  const handleCanvasMouseUp = () => {
    setSelectedVertex(null);
  };

  const isPointInPolygon = (point: number[], vs: number[][]) => {
    const x = point[0],
      y = point[1];
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      const xi = vs[i][0],
        yi = vs[i][1];
      const xj = vs[j][0],
        yj = vs[j][1];
      const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const handleAddCustomZone = () => {
    const newId = `zone-custom-${Date.now()}`;
    const newZone: StructuralZone = {
      id: newId,
      name: 'Custom Feature Section',
      type: 'accent_wall',
      polygon: [
        [0.4, 0.4],
        [0.6, 0.4],
        [0.6, 0.6],
        [0.4, 0.6],
      ],
      grossAreaSqFt: 120,
      openingsAreaSqFt: 0,
      netAreaSqFt: 120,
      suggestedMaterial: 'stone-ledger-granite',
      surfaceCondition: 'Sound surface',
    };
    setZones((prev) => [...prev, newZone]);
    setActiveZoneId(newId);
  };

  const handleDeleteZone = (id: string) => {
    setZones((prev) => prev.filter((z) => z.id !== id));
    if (activeZoneId === id) setActiveZoneId(null);
  };

  const handleUpdateZoneDetails = (id: string, updates: Partial<StructuralZone>) => {
    setZones((prev) =>
      prev.map((z) => {
        if (z.id !== id) return z;
        const gross = updates.grossAreaSqFt !== undefined ? updates.grossAreaSqFt : z.grossAreaSqFt;
        const openings = updates.openingsAreaSqFt !== undefined ? updates.openingsAreaSqFt : z.openingsAreaSqFt;
        const net = Math.max(1, gross - openings);
        return {
          ...z,
          ...updates,
          netAreaSqFt: net,
        };
      })
    );
  };

  const activeZone = zones.find((z) => z.id === activeZoneId);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Header & AI Identification Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <Layers className="w-4 h-4" />
            <span>Step 2 · Facade Structural Mapping & Area Estimation</span>
          </div>
          <h2 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight mt-1">
            Exterior Structural Components
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Review detected structural elements (walls, balconies, columns, parapets). Click to edit dimensions or drag vertices to adjust boundaries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* AI Re-Analyze Button */}
          <button
            onClick={onRunAiAnalysis}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-bold transition-all shadow-sm disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 text-amber-400 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Analyzing Facade with Gemini...' : 'Re-Detect with Gemini AI'}</span>
          </button>

          {/* Toggle Polygon Overlay */}
          <button
            onClick={() => setShowPolygons(!showPolygons)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 text-xs font-medium hover:bg-stone-50"
          >
            {showPolygons ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showPolygons ? 'Hide Boundaries' : 'Show Boundaries'}</span>
          </button>

          {/* Add Zone */}
          <button
            onClick={handleAddCustomZone}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 text-xs font-medium hover:bg-stone-50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Zone</span>
          </button>

          {/* Continue to Design */}
          <button
            onClick={onContinueToDesign}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all hover:translate-x-0.5"
          >
            <span>Proceed to Material Selection</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Building Overview Banner */}
      {buildingMeta.conditionAssessment && (
        <div className="mt-4 p-4 rounded-xl bg-stone-100 dark:bg-stone-900/70 border border-stone-200 dark:border-stone-800 text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-bold text-stone-900 dark:text-stone-200 uppercase tracking-wider text-[11px] font-mono bg-stone-200 dark:bg-stone-800 px-2 py-1 rounded">
              {buildingMeta.buildingType || 'Residential Facade'}
            </span>
            <p className="text-stone-600 dark:text-stone-400 text-xs line-clamp-1">
              {buildingMeta.conditionAssessment}
            </p>
          </div>
          <div className="flex items-center gap-4 text-stone-500 shrink-0 text-[11px]">
            <span>Floors: ~{buildingMeta.estimatedFloors || 2}</span>
            <span>·</span>
            <span>Style: {buildingMeta.architecturalStyle || 'Contemporary'}</span>
            <span>·</span>
            <span className="font-semibold text-stone-900 dark:text-stone-100">
              Total Facade: {zones.reduce((sum, z) => sum + z.netAreaSqFt, 0)} sq ft
            </span>
          </div>
        </div>
      )}

      {/* Main Workspace: Canvas on Left, Zone Editor on Right */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Interactive Canvas Container */}
        <div className="lg:col-span-8 bg-stone-950 rounded-2xl overflow-hidden shadow-xl border border-stone-800 relative group">
          <div className="p-3 bg-stone-900/90 border-b border-stone-800 flex items-center justify-between text-xs text-stone-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-stone-300 font-medium">Interactive Structural Facade Mapper</span>
              <span className="text-stone-600">|</span>
              <span className="text-[11px]">Click zone to select · Drag white vertices to adjust polygon</span>
            </div>

            {/* Scale Calibration Trigger */}
            <button
              onClick={() => {
                setIsCalibrating(!isCalibrating);
                setCalibrationPoints([]);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                isCalibrating
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700'
              }`}
            >
              <Ruler className="w-3 h-3" />
              <span>{isCalibrating ? 'Click 2 points on Door/Window' : 'Calibrate Scale'}</span>
            </button>
          </div>

          <div
            ref={containerRef}
            className="relative flex items-center justify-center p-2 sm:p-4 bg-stone-950 min-h-[450px]"
          >
            <canvas
              ref={canvasRef}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              className="max-w-full h-auto rounded-lg shadow-md cursor-crosshair"
            />

            {/* Instruction tooltip when calibrating */}
            {isCalibrating && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-amber-500 text-stone-950 font-bold text-xs px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
                <Ruler className="w-4 h-4" />
                <span>Click top and bottom of standard entrance door (7 ft reference)</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Zone Inspector & Area Calculation Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-500" />
                <span>Zone Inspector & Surface Area</span>
              </h3>
              <span className="text-[11px] font-mono text-stone-500">
                {zones.length} Zones Detected
              </span>
            </div>

            {activeZone ? (
              <div className="mt-4 space-y-4">
                {/* Zone Name & Type */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                    Zone Identifier
                  </label>
                  <input
                    type="text"
                    value={activeZone.name}
                    onChange={(e) => handleUpdateZoneDetails(activeZone.id, { name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 text-stone-900 dark:text-stone-100 font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                      Structural Category
                    </label>
                    <select
                      value={activeZone.type}
                      onChange={(e) =>
                        handleUpdateZoneDetails(activeZone.id, {
                          type: e.target.value as StructuralZoneType,
                        })
                      }
                      className="w-full px-2.5 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-500"
                    >
                      {ZONE_TYPES.map((t) => (
                        <option key={t.type} value={t.type}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                      Surface Condition
                    </label>
                    <input
                      type="text"
                      value={activeZone.surfaceCondition || 'Sound substrate'}
                      onChange={(e) =>
                        handleUpdateZoneDetails(activeZone.id, { surfaceCondition: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Surface Area Calculations */}
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/60 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-600 dark:text-stone-400">Gross Surface Area:</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="1"
                        value={activeZone.grossAreaSqFt}
                        onChange={(e) =>
                          handleUpdateZoneDetails(activeZone.id, {
                            grossAreaSqFt: Number(e.target.value),
                          })
                        }
                        className="w-18 px-2 py-1 text-right text-xs rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-bold"
                      />
                      <span className="text-[11px] text-stone-500 font-mono">sq ft</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-600 dark:text-stone-400">Window/Door Deductions:</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        value={activeZone.openingsAreaSqFt}
                        onChange={(e) =>
                          handleUpdateZoneDetails(activeZone.id, {
                            openingsAreaSqFt: Number(e.target.value),
                          })
                        }
                        className="w-18 px-2 py-1 text-right text-xs rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-bold"
                      />
                      <span className="text-[11px] text-stone-500 font-mono">sq ft</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between font-bold text-xs">
                    <span className="text-amber-700 dark:text-amber-400">Net Finishable Area:</span>
                    <span className="text-stone-900 dark:text-stone-100 font-mono text-sm">
                      {activeZone.netAreaSqFt} sq ft{' '}
                      <span className="text-stone-400 text-xs font-normal">
                        ({(activeZone.netAreaSqFt * 0.0929).toFixed(1)} m²)
                      </span>
                    </span>
                  </div>

                  {activeZone.type === 'railing' && (
                    <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between text-xs">
                      <span className="text-stone-600 dark:text-stone-400">Railing Run Length:</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="1"
                          value={activeZone.linearFt || 20}
                          onChange={(e) =>
                            handleUpdateZoneDetails(activeZone.id, {
                              linearFt: Number(e.target.value),
                            })
                          }
                          className="w-18 px-2 py-1 text-right text-xs rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-bold"
                        />
                        <span className="text-[11px] text-stone-500 font-mono">linear ft</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Delete Zone */}
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => handleDeleteZone(activeZone.id)}
                    className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 font-medium py-1 px-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Zone</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-stone-500 dark:text-stone-400 space-y-2">
                <Layers className="w-8 h-8 mx-auto text-stone-400/60" />
                <p className="text-xs font-medium">Click on any section of the house above to inspect or edit.</p>
              </div>
            )}
          </div>

          {/* Quick Zone List Pill Selector */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 shadow-sm space-y-2">
            <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              Detected Structural Zones List
            </h4>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {zones.map((zone) => {
                const isActive = zone.id === activeZoneId;
                const typeInfo = ZONE_TYPES.find((t) => t.type === zone.type) || ZONE_TYPES[0];
                return (
                  <button
                    key={zone.id}
                    onClick={() => setActiveZoneId(zone.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all ${
                      isActive
                        ? 'bg-amber-500/10 border border-amber-500/40 text-stone-900 dark:text-stone-100 font-bold'
                        : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: typeInfo.color }}
                      />
                      <span className="truncate">{zone.name}</span>
                    </div>
                    <span className="font-mono text-[11px] text-stone-500 shrink-0 ml-2">
                      {zone.netAreaSqFt} sq ft
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
