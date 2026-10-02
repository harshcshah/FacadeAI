import React from 'react';
import {
  HelpCircle,
  X,
  Ruler,
  AlertTriangle,
  Layers,
  Sparkles,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  Box,
} from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white text-slate-800 rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200 shadow-xs">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">
                System Architecture & Estimation Methodology
              </h3>
              <p className="text-xs text-slate-500">
                Pre-Construction Planning Principles & Algorithmic Foundations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 flex items-center justify-center text-sm font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Section 1: How Surface Area & Perspective Estimation Works */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
            <Ruler className="w-4 h-4" />
            <span>1. Photogrammetric Perspective & Area Calculation</span>
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            The platform relies on perspective reference scaling. Standard residential buildings contain standardized architectural elements that serve as physical scale anchors:
          </p>
          <ul className="text-xs text-slate-600 space-y-1.5 pl-4 list-disc">
            <li>
              <strong>Standard Entrance Door:</strong> Calibrated at 7.0 ft (2.13 m) height × 3.0-3.5 ft width.
            </li>
            <li>
              <strong>Storey Height Baseline:</strong> Standard residential ceiling-to-slab height is estimated at 10.0 to 10.5 ft (3.05 m) per floor.
            </li>
            <li>
              <strong>Shoelace Planar Integration:</strong> Mapped polygon vertices are transformed into normalized coordinates, and the true surface area is computed:
              <code className="block mt-1 p-2 rounded-lg bg-slate-50 font-mono text-[11px] text-blue-900 border border-slate-200">
                Area (sq ft) = NormalizedPolygonArea × (Total Facade Width × Facade Height in ft) - Window/Door Voids
              </code>
            </li>
            <li>
              <strong>Opening Deductions:</strong> Windows and glazed openings within wall planes are segregated and subtracted to prevent over-purchasing paint or cladding.
            </li>
          </ul>
        </div>

        {/* Section 2: 3D Spatial Reconstruction */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
            <Box className="w-4 h-4" />
            <span>2. 3D Spatial Architectural Reconstruction</span>
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Following modern spatial engineering protocols (similar to Hover.to and Autodesk Forma), the platform extracts planar offsets to generate an interactive Three.js 3D model. Cantilevers, entrance porticos, balcony balustrades, and parapets project forward and backward to accurately represent daylight shadows and viewing angles.
          </p>
        </div>

        {/* Section 3: Bill of Quantities (BOQ) & Wastage Factors */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
            <Calculator className="w-4 h-4" />
            <span>3. Material Quantity Consumption & Wastage Factors</span>
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Physical construction requires cutting allowances and edge trim overlaps:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800">Exterior Acrylic & Stucco:</span>
              <p className="text-slate-500 text-[11px]">
                8-10% allowance. Calculated based on 2 continuous coats over primer at 150-180 sq ft per gallon.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800">Stacked Stone & Cladding:</span>
              <p className="text-slate-500 text-[11px]">
                10-12% cutting wastage. Compensates for mitered corners, electrical boxes, and end-run terminations.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Advisory Boundaries */}
        <div className="space-y-2 pt-2 border-t border-slate-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>4. Pre-Construction Limitations & Advisory Boundaries</span>
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            This digital platform is a pre-construction decision planning assistant. While measurements are accurate to within ±5-8% under straight-on daylight photography, physical on-site verification by licensed contractors is required prior to signing binding construction contracts.
          </p>
        </div>
      </div>
    </div>
  );
};
