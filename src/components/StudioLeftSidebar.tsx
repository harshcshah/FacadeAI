import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Ruler,
  Maximize2,
  ChevronDown,
  ChevronRight,
  Info,
  Sliders,
  Check,
  Building,
  Shield,
  Eye,
  EyeOff,
  Filter,
  X,
  Palette,
  Columns,
  Box,
  Sparkles,
} from 'lucide-react';
import { StructuralZone, StructuralZoneType, Material } from '../types';
import { MATERIAL_CATALOG } from '../data/materials';

interface StudioLeftSidebarProps {
  zones: StructuralZone[];
  setZones: React.Dispatch<React.SetStateAction<StructuralZone[]>>;
  activeZoneId: string | null;
  setActiveZoneId: (id: string | null) => void;
  hoveredZoneId: string | null;
  setHoveredZoneId: (id: string | null) => void;
  materialsMap: Map<string, Material>;
  showPolygons: boolean;
  setShowPolygons: (show: boolean) => void;
  isCalibrating: boolean;
  setIsCalibrating: (val: boolean) => void;
  buildingMeta: {
    buildingType?: string;
    estimatedFloors?: number;
    conditionAssessment?: string;
    architecturalStyle?: string;
  };
}

const ZONE_CATEGORY_STYLES: Record<
  StructuralZoneType,
  { label: string; color: string; badgeBg: string }
> = {
  main_wall: { label: 'Main Wall', color: '#2563EB', badgeBg: 'bg-blue-50 text-blue-700 border-blue-200' },
  accent_wall: { label: 'Accent Wall', color: '#7C3AED', badgeBg: 'bg-purple-50 text-purple-700 border-purple-200' },
  pillar: { label: 'Column / Pillar', color: '#DB2777', badgeBg: 'bg-pink-50 text-pink-700 border-pink-200' },
  balcony: { label: 'Balcony', color: '#D97706', badgeBg: 'bg-amber-50 text-amber-800 border-amber-200' },
  railing: { label: 'Balustrade', color: '#059669', badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  parapet: { label: 'Parapet Coping', color: '#4F46E5', badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  window: { label: 'Window Glazing', color: '#0284C7', badgeBg: 'bg-sky-50 text-sky-800 border-sky-200' },
  door: { label: 'Entrance Door', color: '#EA580C', badgeBg: 'bg-orange-50 text-orange-800 border-orange-200' },
  gate_porch: { label: 'Entrance Porch', color: '#EA580C', badgeBg: 'bg-orange-50 text-orange-800 border-orange-200' },
  plinth: { label: 'Plinth Base', color: '#475569', badgeBg: 'bg-slate-100 text-slate-800 border-slate-300' },
  roof_edge: { label: 'Roof Trim', color: '#0891B2', badgeBg: 'bg-cyan-50 text-cyan-800 border-cyan-200' },
};

const COLOR_PRESETS = [
  { name: 'Crisp White', hex: '#FFFFFF' },
  { name: 'Warm Alabaster', hex: '#F4EFE6' },
  { name: 'Travertine Sand', hex: '#E6DEC9' },
  { name: 'Nordic Slate', hex: '#64748B' },
  { name: 'Charcoal Deep', hex: '#334155' },
  { name: 'Teak Wood', hex: '#8C532B' },
  { name: 'Terracotta', hex: '#B45309' },
  { name: 'Bronze Accent', hex: '#3B332A' },
];

export const StudioLeftSidebar: React.FC<StudioLeftSidebarProps> = ({
  zones,
  setZones,
  activeZoneId,
  setActiveZoneId,
  hoveredZoneId,
  setHoveredZoneId,
  materialsMap,
  showPolygons,
  setShowPolygons,
  isCalibrating,
  setIsCalibrating,
  buildingMeta,
}) => {
  const [expandedZoneId, setExpandedZoneId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Zone Form State
  const [newZoneName, setNewZoneName] = useState('New Architectural Accent');
  const [newZoneType, setNewZoneType] = useState<StructuralZoneType>('accent_wall');
  const [newGrossArea, setNewGrossArea] = useState(120);
  const [newOpeningsArea, setNewOpeningsArea] = useState(0);
  const [newMaterialId, setNewMaterialId] = useState('panel-wpc-teak');

  // Quick 1-Click Structural Preset Addition
  const handleAddStructuralPreset = (type: StructuralZoneType) => {
    const timestamp = Date.now();
    let name = 'New Component';
    let defaultMaterial = 'paint-weathershield-white';
    let grossArea = 120;
    let openings = 0;
    let polygon = [[0.2, 0.3], [0.8, 0.3], [0.8, 0.6], [0.2, 0.6]];

    switch (type) {
      case 'pillar':
        name = `Structural Column ${zones.filter((z) => z.type === 'pillar').length + 1}`;
        defaultMaterial = 'stone-ledger-granite';
        grossArea = 45;
        polygon = [[0.15, 0.45], [0.25, 0.45], [0.25, 0.90], [0.15, 0.90]];
        break;
      case 'balcony':
        name = `Cantilever Balcony ${zones.filter((z) => z.type === 'balcony').length + 1}`;
        defaultMaterial = 'paint-weathershield-white';
        grossArea = 70;
        polygon = [[0.20, 0.46], [0.55, 0.46], [0.55, 0.52], [0.20, 0.52]];
        break;
      case 'railing':
        name = `Glass Balustrade ${zones.filter((z) => z.type === 'railing').length + 1}`;
        defaultMaterial = 'railing-glass-frameless';
        grossArea = 40;
        polygon = [[0.20, 0.38], [0.55, 0.38], [0.55, 0.46], [0.20, 0.46]];
        break;
      case 'accent_wall':
        name = `Architectural Accent ${zones.filter((z) => z.type === 'accent_wall').length + 1}`;
        defaultMaterial = 'panel-wpc-teak';
        grossArea = 140;
        polygon = [[0.55, 0.18], [0.88, 0.18], [0.88, 0.50], [0.55, 0.50]];
        break;
      case 'gate_porch':
        name = `Entrance Canopy Porch`;
        defaultMaterial = 'panel-wpc-walnut';
        grossArea = 55;
        polygon = [[0.10, 0.50], [0.40, 0.50], [0.40, 0.56], [0.10, 0.56]];
        break;
      case 'window':
        name = `Architectural Window ${zones.filter((z) => z.type === 'window').length + 1}`;
        defaultMaterial = 'window-aluminum-black';
        grossArea = 45;
        polygon = [[0.60, 0.52], [0.82, 0.52], [0.82, 0.74], [0.60, 0.74]];
        break;
      case 'door':
        name = `Entrance Pivot Door ${zones.filter((z) => z.type === 'door').length + 1}`;
        defaultMaterial = 'door-pivot-teak';
        grossArea = 35;
        polygon = [[0.38, 0.58], [0.50, 0.58], [0.50, 0.88], [0.38, 0.88]];
        break;
      case 'parapet':
        name = `Parapet Wall & Coping`;
        defaultMaterial = 'paint-charcoal-slate';
        grossArea = 90;
        polygon = [[0.08, 0.08], [0.92, 0.08], [0.92, 0.14], [0.08, 0.14]];
        break;
      default:
        name = `Wall Section`;
        defaultMaterial = 'paint-weathershield-white';
        grossArea = 160;
        break;
    }

    const newId = `zone-${type}-${timestamp}`;
    const isOpening = type === 'window' || type === 'door';

    // Find parent wall if opening is inside one
    let parentWallId: string | undefined = undefined;
    if (isOpening) {
      const centerX = (polygon[0][0] + polygon[1][0]) / 2;
      const centerY = (polygon[0][1] + polygon[2][1]) / 2;
      const walls = zones.filter((z) => z.type === 'main_wall' || z.type === 'accent_wall');
      for (const wall of walls) {
        const xs = wall.polygon.map((p) => p[0]);
        const ys = wall.polygon.map((p) => p[1]);
        if (
          centerX >= Math.min(...xs) - 0.05 &&
          centerX <= Math.max(...xs) + 0.05 &&
          centerY >= Math.min(...ys) - 0.05 &&
          centerY <= Math.max(...ys) + 0.05
        ) {
          parentWallId = wall.id;
          break;
        }
      }
    }

    const newZone: StructuralZone = {
      id: newId,
      name,
      type,
      polygon,
      grossAreaSqFt: grossArea,
      openingsAreaSqFt: isOpening ? 0 : openings,
      netAreaSqFt: isOpening ? grossArea : Math.max(10, grossArea - openings),
      assignedMaterialId: defaultMaterial,
      parentWallId,
      surfaceCondition: 'Newly added structural component',
    };

    setZones((prev) => {
      let updated = [...prev, newZone];
      if (parentWallId) {
        // Automatically deduct from parent wall
        updated = updated.map((z) => {
          if (z.id !== parentWallId) return z;
          const childOpenings = updated.filter(
            (o) => o.parentWallId === z.id && (o.type === 'window' || o.type === 'door')
          );
          const childTotal = childOpenings.reduce((sum, o) => sum + o.netAreaSqFt, 0);
          return {
            ...z,
            openingsAreaSqFt: childTotal,
            netAreaSqFt: Math.max(15, z.grossAreaSqFt - childTotal),
          };
        });
      }
      return updated;
    });

    setActiveZoneId(newId);
    setExpandedZoneId(newId);
  };

  const handleCreateZone = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `zone-manual-${Date.now()}`;
    const netArea = Math.max(10, newGrossArea - newOpeningsArea);

    const newZone: StructuralZone = {
      id: newId,
      name: newZoneName,
      type: newZoneType,
      polygon: [
        [0.3, 0.35],
        [0.7, 0.35],
        [0.7, 0.65],
        [0.3, 0.65],
      ],
      grossAreaSqFt: newGrossArea,
      openingsAreaSqFt: newOpeningsArea,
      netAreaSqFt: netArea,
      assignedMaterialId: newMaterialId,
      surfaceCondition: 'Sound substrate ready for renovation',
    };

    setZones((prev) => [...prev, newZone]);
    setActiveZoneId(newId);
    setExpandedZoneId(newId);
    setIsAddModalOpen(false);

    // Reset Form
    setNewZoneName('Custom Architectural Zone');
    setNewGrossArea(150);
    setNewOpeningsArea(0);
  };

  const handleDeleteZone = (id: string) => {
    setZones((prev) => prev.filter((z) => z.id !== id));
    if (activeZoneId === id) setActiveZoneId(null);
  };

  const handleUpdateZone = (id: string, updates: Partial<StructuralZone>) => {
    setZones((prev) =>
      prev.map((z) => {
        if (z.id !== id) return z;
        const gross = updates.grossAreaSqFt !== undefined ? updates.grossAreaSqFt : z.grossAreaSqFt;
        const openings =
          updates.openingsAreaSqFt !== undefined ? updates.openingsAreaSqFt : z.openingsAreaSqFt;
        const net = Math.max(1, gross - openings);
        return {
          ...z,
          ...updates,
          netAreaSqFt: net,
        };
      })
    );
  };

  return (
    <aside
      id="tour-zones-panel"
      className="w-84 bg-white border-r border-slate-200 text-slate-800 flex flex-col h-full select-none shrink-0 overflow-hidden shadow-xs"
    >
      {/* Sidebar Header */}
      <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          <span className="font-bold text-xs uppercase tracking-wider text-slate-800">
            Structural Zones
          </span>
          <span className="px-1.5 py-0.5 rounded-full bg-slate-200 text-[10px] font-mono text-slate-700 font-bold">
            {zones.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Toggle Blueprints Outline */}
          <button
            onClick={() => setShowPolygons(!showPolygons)}
            className={`p-1.5 rounded-lg border transition-colors ${
              showPolygons
                ? 'bg-blue-50 text-blue-600 border-blue-200 shadow-xs'
                : 'bg-white text-slate-500 border-slate-200 hover:text-slate-800 hover:bg-slate-50'
            }`}
            title={showPolygons ? 'Hide Zone Boundaries' : 'Show Zone Boundaries'}
          >
            {showPolygons ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>

          {/* Calibrate Tool */}
          <button
            onClick={() => setIsCalibrating(!isCalibrating)}
            className={`p-1.5 rounded-lg border transition-colors ${
              isCalibrating
                ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-xs'
                : 'bg-white text-slate-500 border-slate-200 hover:text-slate-800 hover:bg-slate-50'
            }`}
            title="Calibrate Scale (Door/Window Reference)"
          >
            <Ruler className="w-3.5 h-3.5" />
          </button>

          {/* Add Zone Trigger */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold border border-blue-600 shadow-xs transition-all hover:scale-105"
            title="Add Structural Zone Manually"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick 1-Click Structural Additions Bar */}
      <div className="p-2.5 border-b border-slate-100 bg-slate-50/50 space-y-1.5">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
          <span>+ Add Structural Component:</span>
          <span className="text-blue-600 font-semibold">1-Click</span>
        </div>
        <div className="grid grid-cols-4 gap-1 text-[10px]">
          <button
            onClick={() => handleAddStructuralPreset('window')}
            className="px-1.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-semibold transition-colors text-center truncate shadow-2xs"
            title="Add Window Opening & Trim"
          >
            + Window
          </button>
          <button
            onClick={() => handleAddStructuralPreset('door')}
            className="px-1.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold transition-colors text-center truncate shadow-2xs"
            title="Add Entrance Door Portal"
          >
            + Door
          </button>
          <button
            onClick={() => handleAddStructuralPreset('pillar')}
            className="px-1.5 py-1 rounded-lg bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 font-medium transition-colors text-center truncate shadow-2xs"
            title="Add Stone/Wood Column"
          >
            + Column
          </button>
          <button
            onClick={() => handleAddStructuralPreset('balcony')}
            className="px-1.5 py-1 rounded-lg bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 font-medium transition-colors text-center truncate shadow-2xs"
            title="Add Balcony Slab"
          >
            + Balcony
          </button>
          <button
            onClick={() => handleAddStructuralPreset('accent_wall')}
            className="px-1.5 py-1 rounded-lg bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 font-medium transition-colors text-center truncate shadow-2xs"
            title="Add Cantilevered Accent Box"
          >
            + Accent Box
          </button>
          <button
            onClick={() => handleAddStructuralPreset('railing')}
            className="px-1.5 py-1 rounded-lg bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 font-medium transition-colors text-center truncate shadow-2xs"
            title="Add Balustrade Railing"
          >
            + Railing
          </button>
          <button
            onClick={() => handleAddStructuralPreset('gate_porch')}
            className="px-1.5 py-1 rounded-lg bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 font-medium transition-colors text-center truncate shadow-2xs"
            title="Add Portico Canopy"
          >
            + Porch
          </button>
          <button
            onClick={() => handleAddStructuralPreset('parapet')}
            className="px-1.5 py-1 rounded-lg bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 font-medium transition-colors text-center truncate shadow-2xs"
            title="Add Roof Parapet"
          >
            + Parapet
          </button>
        </div>
      </div>

      {/* Calibration notice banner if active */}
      {isCalibrating && (
        <div className="p-3 bg-amber-50 border-b border-amber-200 text-amber-800 text-[11px] flex items-center gap-2 animate-pulse">
          <Ruler className="w-4 h-4 shrink-0 text-amber-600" />
          <span>Click top & bottom of door on canvas to calibrate (7 ft).</span>
        </div>
      )}

      {/* Manual Zone Creation Modal / Form */}
      {isAddModalOpen && (
        <div className="p-3 border-b border-blue-200 bg-blue-50/60 shadow-md space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
              Add Structural Zone
            </span>
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="text-slate-400 hover:text-slate-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <form onSubmit={handleCreateZone} className="space-y-2.5 text-xs">
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">
                Zone Title
              </label>
              <input
                type="text"
                value={newZoneName}
                onChange={(e) => setNewZoneName(e.target.value)}
                placeholder="e.g. Front Porch Pillar"
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs focus:outline-none focus:border-blue-500 shadow-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">
                  Component Type
                </label>
                <select
                  value={newZoneType}
                  onChange={(e) => setNewZoneType(e.target.value as StructuralZoneType)}
                  className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs focus:outline-none focus:border-blue-500 cursor-pointer shadow-xs"
                >
                  <option value="main_wall">Main Wall</option>
                  <option value="accent_wall">Accent Wall</option>
                  <option value="window">Window (Dedicated Aperture)</option>
                  <option value="door">Entrance Door / Portal</option>
                  <option value="pillar">Column / Pillar</option>
                  <option value="balcony">Balcony</option>
                  <option value="railing">Balustrade</option>
                  <option value="parapet">Parapet</option>
                  <option value="plinth">Plinth Base</option>
                  <option value="gate_porch">Porch</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">
                  Gross Area (sq ft)
                </label>
                <input
                  type="number"
                  min="5"
                  value={newGrossArea}
                  onChange={(e) => setNewGrossArea(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs font-mono font-bold text-right shadow-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">
                Assigned Material
              </label>
              <select
                value={newMaterialId}
                onChange={(e) => setNewMaterialId(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs focus:outline-none focus:border-blue-500 cursor-pointer shadow-xs"
              >
                {MATERIAL_CATALOG.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs"
              >
                Save & Add Zone
              </button>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="py-1.5 px-3 rounded-lg bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Scrollable Zones List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {zones.map((zone) => {
          const isActive = zone.id === activeZoneId;
          const isHovered = zone.id === hoveredZoneId;
          const isExpanded = zone.id === expandedZoneId;
          const assignedMat = zone.assignedMaterialId
            ? materialsMap.get(zone.assignedMaterialId)
            : null;
          const catStyle =
            ZONE_CATEGORY_STYLES[zone.type] || ZONE_CATEGORY_STYLES.main_wall;
          const effectiveColor = zone.customColorHex || assignedMat?.colorHex || catStyle.color;

          return (
            <div
              key={zone.id}
              onMouseEnter={() => setHoveredZoneId(zone.id)}
              onMouseLeave={() => setHoveredZoneId(null)}
              onClick={() => {
                setActiveZoneId(zone.id);
                setExpandedZoneId(isExpanded ? null : zone.id);
              }}
              className={`rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                isActive
                  ? 'bg-blue-50/70 border-blue-400 shadow-sm ring-1 ring-blue-400/40'
                  : isHovered
                  ? 'bg-slate-50 border-slate-300'
                  : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {/* Primary Zone Header Row */}
              <div className="p-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 border border-slate-300 shadow-xs"
                    style={{ backgroundColor: effectiveColor }}
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-slate-800 truncate flex items-center gap-1.5">
                      <span>{zone.name}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 animate-ping" />
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5 flex items-center gap-1">
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${catStyle.badgeBg}`}>
                        {catStyle.label}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="truncate">{assignedMat ? assignedMat.name : 'No finish'}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono font-bold text-xs text-slate-800">
                    {zone.netAreaSqFt} <span className="text-[10px] text-slate-400 font-sans">sq ft</span>
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono">
                    {(zone.netAreaSqFt * 0.0929).toFixed(1)} m²
                  </div>
                </div>
              </div>

              {/* Collapsible Zone Dimension & Styling Fine-Tuner */}
              {isExpanded && (
                <div
                  className="px-3 pb-3 pt-2 border-t border-slate-100 bg-slate-50/70 text-xs space-y-2.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Quick Finish Selector inside Zone Card */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Surface Finish
                    </label>
                    <select
                      value={zone.assignedMaterialId || ''}
                      onChange={(e) => handleUpdateZone(zone.id, { assignedMaterialId: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs focus:outline-none focus:border-blue-500 font-medium"
                    >
                      {MATERIAL_CATALOG.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.categoryLabel})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Custom Color Tint Swatches */}
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      <span>Custom Color Tint:</span>
                      {zone.customColorHex && (
                        <button
                          onClick={() => handleUpdateZone(zone.id, { customColorHex: undefined })}
                          className="text-blue-600 hover:underline capitalize"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {COLOR_PRESETS.map((c) => (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => handleUpdateZone(zone.id, { customColorHex: c.hex })}
                          className={`w-5 h-5 rounded-full border shadow-xs transition-transform hover:scale-110 ${
                            zone.customColorHex === c.hex ? 'ring-2 ring-blue-600 scale-110 border-white' : 'border-slate-300'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                      <input
                        type="color"
                        value={zone.customColorHex || '#FFFFFF'}
                        onChange={(e) => handleUpdateZone(zone.id, { customColorHex: e.target.value })}
                        className="w-5 h-5 rounded-full cursor-pointer border border-slate-300 p-0"
                        title="Custom Color Picker"
                      />
                    </div>
                  </div>

                  {/* Dimensions */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                        Gross Area (sq ft)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={zone.grossAreaSqFt}
                        onChange={(e) =>
                          handleUpdateZone(zone.id, { grossAreaSqFt: Number(e.target.value) })
                        }
                        className="w-full px-2 py-1 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs font-mono font-bold text-right"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                        Opening Voids
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={zone.openingsAreaSqFt}
                        onChange={(e) =>
                          handleUpdateZone(zone.id, { openingsAreaSqFt: Number(e.target.value) })
                        }
                        className="w-full px-2 py-1 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs font-mono font-bold text-right"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-500 truncate max-w-[170px]">
                      Substrate: {zone.surfaceCondition || 'Sound masonry'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteZone(zone.id)}
                      className="text-rose-500 hover:text-rose-700 text-[11px] font-bold flex items-center gap-1 p-1 hover:bg-rose-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
