import React from 'react';
import {
  Printer,
  Download,
  X,
  Compass,
  CheckCircle2,
  Calendar,
  Building,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';
import { CostBreakdownSummary, StructuralZone, CurrencyConfig } from '../types';

interface ContractorReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalImage: string;
  renderedImage: string | null;
  aiGeneratedImage?: string | null;
  summary: CostBreakdownSummary;
  zones: StructuralZone[];
  buildingMeta: {
    buildingType?: string;
    estimatedFloors?: number;
    title?: string;
  };
  clientName?: string;
  projectAddress?: string;
}

export const ContractorReportModal: React.FC<ContractorReportModalProps> = ({
  isOpen,
  onClose,
  originalImage,
  renderedImage,
  aiGeneratedImage,
  summary,
  zones,
  buildingMeta,
  clientName,
  projectAddress,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex justify-center p-2 sm:p-6 print:p-0 print:bg-white">
      <div className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 rounded-3xl max-w-5xl w-full border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden my-auto print:border-none print:shadow-none print:max-w-none print:rounded-none">
        {/* Modal Controls (Hidden in Print) */}
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-xs">Contractor Renovation Schedule & BOQ</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-md transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center text-xs font-bold transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-10 space-y-8 bg-white text-stone-900 print:p-8">
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b-2 border-stone-900 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-2xl tracking-tight text-stone-900">
                  Façade<span className="text-amber-600">Craft</span>
                </span>
                <span className="text-xs uppercase font-mono tracking-widest text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                  Architectural Estimate
                </span>
              </div>
              <h1 className="text-lg font-bold text-stone-800 mt-1">
                Exterior Renovation Scope of Work & Bill of Quantities
              </h1>
              <p className="text-xs text-stone-500">
                Document prepared for contractor benchmarking, tender pricing, and material procurement.
              </p>
            </div>

            <div className="text-left sm:text-right text-xs font-mono text-stone-600 space-y-1">
              <div>
                <span className="text-stone-400">Date: </span>
                <span className="font-semibold text-stone-800">{currentDate}</span>
              </div>
              {clientName && (
                <div>
                  <span className="text-stone-400">Client: </span>
                  <span className="font-semibold text-stone-900">{clientName}</span>
                </div>
              )}
              {projectAddress && (
                <div>
                  <span className="text-stone-400">Location: </span>
                  <span className="font-semibold text-stone-800">{projectAddress}</span>
                </div>
              )}
              <div>
                <span className="text-stone-400">Ref ID: </span>
                <span>FC-EXT-{Date.now().toString().slice(-6)}</span>
              </div>
              <div>
                <span className="text-stone-400">Building: </span>
                <span className="font-semibold text-stone-800">
                  {buildingMeta.title || buildingMeta.buildingType || 'Residential Facade'}
                </span>
              </div>
            </div>
          </div>

          {/* Visual Comparison Section (Before, Material-Mapped, & AI Photorealistic Vision) */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-amber-600" />
              <span>1. Visual Elevation Transformation & AI Rendered Vision</span>
            </h2>

            {aiGeneratedImage ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 print:grid-cols-3">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-stone-600 uppercase flex items-center justify-between">
                    <span>Baseline Condition</span>
                    <span className="text-stone-400 font-normal">Original Photo</span>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-stone-300 aspect-16/10 bg-stone-100">
                    <img src={originalImage} alt="Original Facade" className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-blue-700 uppercase flex items-center justify-between">
                    <span>Approved Finishes</span>
                    <span className="text-blue-500 font-normal">Material Mapped</span>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-blue-300 aspect-16/10 bg-stone-100">
                    {renderedImage && (
                      <img src={renderedImage} alt="Renovated Facade" className="w-full h-full object-cover" />
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-amber-700 uppercase flex items-center justify-between">
                    <span>✨ AI Generated Vision</span>
                    <span className="text-amber-600 font-normal font-mono">Photorealistic</span>
                  </div>
                  <div className="rounded-xl overflow-hidden border-2 border-amber-600 aspect-16/10 bg-stone-100 shadow-xs">
                    <img src={aiGeneratedImage} alt="AI Photorealistic Vision" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-stone-600 uppercase">Existing Baseline Condition</div>
                  <div className="rounded-xl overflow-hidden border border-stone-300 aspect-16/10">
                    <img src={originalImage} alt="Original Facade" className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-amber-700 uppercase">Approved Architectural Redesign</div>
                  <div className="rounded-xl overflow-hidden border-2 border-amber-600 aspect-16/10">
                    {renderedImage && (
                      <img src={renderedImage} alt="Renovated Facade" className="w-full h-full object-cover" />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Material Schedule & Specifications */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>2. Material Specifications & Performance Ratings</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {summary.items.map((item) => (
                <div key={item.zoneId} className="p-3 rounded-xl border border-stone-200 bg-stone-50 space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-stone-900">{item.zoneName}</span>
                    <span className="font-mono text-[11px] text-stone-600">{item.netAreaSqFt} sq ft</span>
                  </div>
                  <div className="text-amber-800 font-semibold text-[11px]">{item.material.name}</div>
                  <p className="text-[11px] text-stone-600 leading-snug">{item.material.description}</p>
                  <div className="pt-1 text-[10px] text-stone-500 font-mono">
                    Durability: ~{item.material.durabilityYears} yrs · Maintenance: {item.material.maintenanceLevel} · {item.material.weatherResistance}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Granular Bill of Quantities (BOQ) Table */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-amber-600" />
              <span>3. Itemized Bill of Quantities (BOQ) & Labor Breakdown</span>
            </h2>

            <div className="overflow-x-auto border border-stone-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-100 border-b border-stone-200 font-bold uppercase tracking-wider text-[10px] text-stone-600">
                    <th className="py-2.5 px-3">Item / Zone</th>
                    <th className="py-2.5 px-2">Net Area</th>
                    <th className="py-2.5 px-2">Wastage</th>
                    <th className="py-2.5 px-2">Total Qty Required</th>
                    <th className="py-2.5 px-2 text-right">Material Rate</th>
                    <th className="py-2.5 px-2 text-right">Labor Rate</th>
                    <th className="py-2.5 px-3 text-right">Total ({summary.currency.code})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-stone-800">
                  {summary.items.map((item) => (
                    <tr key={item.zoneId}>
                      <td className="py-2.5 px-3">
                        <div className="font-bold">{item.zoneName}</div>
                        <div className="text-[10px] text-stone-500">{item.material.name}</div>
                      </td>
                      <td className="py-2.5 px-2 font-mono">{item.netAreaSqFt} sq ft</td>
                      <td className="py-2.5 px-2 font-mono">+{item.wastagePercent}%</td>
                      <td className="py-2.5 px-2 font-mono font-semibold">
                        {item.totalQuantity} {item.unit}
                        <div className="text-[10px] text-stone-500 font-normal">{item.packCount}</div>
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono">
                        {summary.currency.symbol}{item.materialRate.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono">
                        {summary.currency.symbol}{item.laborRate.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold">
                        {summary.currency.symbol}{item.itemTotalCost.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Budget Summary & Contingency */}
          <div className="p-5 rounded-2xl bg-stone-100 border border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
            <div className="space-y-1 font-mono">
              <div>Materials Total: <span className="font-bold">{summary.currency.symbol}{summary.materialTotal.toLocaleString()}</span></div>
              <div>Labor & Installation: <span className="font-bold">{summary.currency.symbol}{summary.laborTotal.toLocaleString()}</span></div>
              <div>Scaffolding & Site Prep: <span className="font-bold">{summary.currency.symbol}{summary.sitePreparationAndScaffolding.toLocaleString()}</span></div>
              <div>Contingency ({summary.contingencyPercent}%): <span className="font-bold">{summary.currency.symbol}{summary.contingencyAmount.toLocaleString()}</span></div>
            </div>

            <div className="text-right border-t sm:border-t-0 sm:border-l border-stone-300 pt-3 sm:pt-0 sm:pl-6">
              <div className="text-[11px] uppercase font-bold text-stone-500">Estimated Project Total</div>
              <div className="text-2xl font-black text-amber-700 font-mono">
                {summary.currency.symbol}{summary.grandTotal.toLocaleString()}
              </div>
              <div className="text-[10px] text-stone-500">All figures inclusive of specified wastage margins</div>
            </div>
          </div>

          {/* Contractor Execution Notes */}
          <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 text-[11px] text-stone-600 space-y-1.5 leading-relaxed">
            <div className="font-bold text-stone-800 uppercase tracking-wider text-[10px]">
              Technical Contractor Scope & Notes:
            </div>
            <p>
              1. <strong>Surface Preparation:</strong> High-pressure water blast (min 2,000 PSI) to strip loose efflorescence, algae, and chalking before primer application.
            </p>
            <p>
              2. <strong>Cladding Anchorage:</strong> All stone cladding above 8 feet height requires mechanical SS 316 anchoring brackets embedded into structural substrate in addition to polymer-modified C2TE thin-set mortar.
            </p>
            <p>
              3. <strong>Weatherproofing:</strong> Apply two continuous coats of elastomeric crack-bridging exterior primer on all plastered masonry before final topcoats.
            </p>
            <p>
              4. <strong>Warranties:</strong> Contractor shall provide written 5-year workmanship guarantee against water ingress, delamination, and peeling.
            </p>
          </div>

          {/* Signatures */}
          <div className="pt-8 border-t border-stone-300 grid grid-cols-2 gap-8 text-xs text-stone-600">
            <div>
              <div className="border-b border-stone-400 pb-8 mb-1"></div>
              <div className="font-bold">Homeowner Signature / Acceptance</div>
              <div className="text-[10px] text-stone-400">Date: ________________________</div>
            </div>
            <div>
              <div className="border-b border-stone-400 pb-8 mb-1"></div>
              <div className="font-bold">Contractor Authorized Representative</div>
              <div className="text-[10px] text-stone-400">Company: ____________________</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
