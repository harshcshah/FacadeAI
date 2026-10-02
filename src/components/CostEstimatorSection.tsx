import React, { useState } from 'react';
import {
  Calculator,
  Printer,
  DollarSign,
  TrendingDown,
  Layers,
  Wrench,
  Package,
  Sliders,
  RotateCcw,
  CheckCircle2,
  Info,
  ChevronRight,
  Shield,
  FileSpreadsheet,
} from 'lucide-react';
import {
  CostBreakdownSummary,
  CostRateOverride,
  CurrencyConfig,
  Material,
  StructuralZone,
} from '../types';
import { calculateBillOfQuantities } from '../utils/costCalculator';

interface CostEstimatorSectionProps {
  zones: StructuralZone[];
  materialsMap: Map<string, Material>;
  rateOverrides: Record<string, CostRateOverride>;
  setRateOverrides: React.Dispatch<React.SetStateAction<Record<string, CostRateOverride>>>;
  currency: CurrencyConfig;
  onOpenReport: () => void;
  contingencyPercent: number;
  setContingencyPercent: (p: number) => void;
}

export const CostEstimatorSection: React.FC<CostEstimatorSectionProps> = ({
  zones,
  materialsMap,
  rateOverrides,
  setRateOverrides,
  currency,
  onOpenReport,
  contingencyPercent,
  setContingencyPercent,
}) => {
  const [editingMaterialId, setEditingMaterialId] = useState<string | null>(null);

  const summary: CostBreakdownSummary = calculateBillOfQuantities(
    zones,
    materialsMap,
    rateOverrides,
    currency,
    {
      contingencyPercent,
    }
  );

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

  const handleResetRates = () => {
    setRateOverrides({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <Calculator className="w-4 h-4" />
            <span>Step 5 · Bill of Quantities & Transparent Cost Estimation</span>
          </div>
          <h2 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight mt-1">
            Pre-Construction Renovation Budget
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Transparent cost calculations based on surface area, calculated material wastage, skilled labor, and scaffolding.
            You can modify any rate below to benchmark against local contractor quotes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetRates}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 text-xs font-medium hover:bg-stone-50"
            title="Reset to default regional construction rates"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Rates</span>
          </button>

          <button
            onClick={onOpenReport}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all hover:translate-x-0.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Contractor Schedule</span>
          </button>
        </div>
      </div>

      {/* Top Level Summary Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Grand Total Card */}
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 dark:bg-amber-500/5 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Estimated Grand Total
          </div>
          <div className="mt-2 text-3xl font-extrabold text-stone-900 dark:text-stone-100 font-mono tracking-tight">
            {currency.symbol}
            {summary.grandTotal.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-stone-500 flex items-center justify-between">
            <span>Includes {contingencyPercent}% Contingency</span>
            <span className="font-mono text-amber-600 dark:text-amber-400 font-semibold">
              +{currency.symbol}
              {summary.contingencyAmount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Materials Subtotal */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center justify-between">
            <span>Direct Materials</span>
            <Package className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-stone-900 dark:text-stone-100 font-mono">
            {currency.symbol}
            {summary.materialTotal.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-stone-400">
            {((summary.materialTotal / (summary.grandTotal || 1)) * 100).toFixed(0)}% of total renovation cost
          </div>
        </div>

        {/* Labor Subtotal */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center justify-between">
            <span>Installation Labor</span>
            <Wrench className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-stone-900 dark:text-stone-100 font-mono">
            {currency.symbol}
            {summary.laborTotal.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-stone-400">
            Surface preparation, stonemasonry & application
          </div>
        </div>

        {/* Scaffolding & Site Prep */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center justify-between">
            <span>Scaffolding & Site Prep</span>
            <Shield className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-stone-900 dark:text-stone-100 font-mono">
            {currency.symbol}
            {summary.sitePreparationAndScaffolding.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-stone-400">
            Pressure wash, safety nets, elevated access
          </div>
        </div>
      </div>

      {/* Contingency Slider Strip */}
      <div className="mt-6 p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <Sliders className="w-4 h-4 text-amber-500 shrink-0" />
          <div>
            <span className="font-bold text-stone-900 dark:text-stone-100">
              Unforeseen Contingency Buffer ({contingencyPercent}%)
            </span>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Recommended 10-15% reserve for unexpected surface hairline repairs, hidden moisture, or scaffolding adjustments.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-64">
          <input
            type="range"
            min="0"
            max="25"
            step="5"
            value={contingencyPercent}
            onChange={(e) => setContingencyPercent(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <span className="font-mono font-bold text-stone-900 dark:text-stone-100 w-10 text-right">
            {contingencyPercent}%
          </span>
        </div>
      </div>

      {/* Bill of Quantities (BOQ) Interactive Table */}
      <div className="mt-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-amber-500" />
              <span>Granular Bill of Quantities (BOQ)</span>
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Click on any material rate or labor rate to customize and recalculate.
            </p>
          </div>
          <span className="text-[11px] font-mono text-stone-400 hidden sm:inline">
            Unit: {currency.code}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                <th className="py-3 px-4">Structural Zone & Material</th>
                <th className="py-3 px-3">Net Area</th>
                <th className="py-3 px-3">Wastage %</th>
                <th className="py-3 px-3">Required Qty & Pack Spec</th>
                <th className="py-3 px-3">Material Rate</th>
                <th className="py-3 px-3">Labor Rate</th>
                <th className="py-3 px-4 text-right">Total Item Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-700 dark:text-stone-300">
              {summary.items.map((item) => {
                return (
                  <tr
                    key={item.zoneId}
                    className="hover:bg-stone-50/80 dark:hover:bg-stone-800/40 transition-colors"
                  >
                    {/* Zone & Material Name */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-stone-900 dark:text-stone-100">
                        {item.zoneName}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-stone-500">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: item.material.colorHex }}
                        />
                        <span className="truncate max-w-[240px]">{item.material.name}</span>
                      </div>
                    </td>

                    {/* Net Surface Area */}
                    <td className="py-3 px-3 font-mono">
                      <div className="font-semibold text-stone-900 dark:text-stone-100">
                        {item.netAreaSqFt} sq ft
                      </div>
                      <div className="text-[10px] text-stone-400">({item.netAreaSqM} m²)</div>
                    </td>

                    {/* Wastage */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="30"
                          value={item.wastagePercent}
                          onChange={(e) =>
                            handleUpdateRate(
                              item.material.id,
                              'wastagePercent',
                              Number(e.target.value)
                            )
                          }
                          className="w-12 px-1.5 py-0.5 text-center rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono text-xs"
                        />
                        <span className="text-[11px] text-stone-400">%</span>
                      </div>
                    </td>

                    {/* Required Qty & Pack Spec */}
                    <td className="py-3 px-3 font-mono">
                      <div className="font-semibold text-stone-900 dark:text-stone-100">
                        {item.totalQuantity} {item.unit}
                      </div>
                      <div className="text-[10px] text-amber-600 dark:text-amber-400 font-sans">
                        {item.packCount}
                      </div>
                    </td>

                    {/* Material Rate (Editable) */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1">
                        <span className="text-stone-400">{currency.symbol}</span>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={item.materialRate}
                          onChange={(e) =>
                            handleUpdateRate(
                              item.material.id,
                              'materialRate',
                              Number(e.target.value) / currency.rateToUSD
                            )
                          }
                          className="w-16 px-1.5 py-0.5 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono text-xs font-semibold text-stone-900 dark:text-stone-100"
                        />
                      </div>
                    </td>

                    {/* Labor Rate (Editable) */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1">
                        <span className="text-stone-400">{currency.symbol}</span>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={item.laborRate}
                          onChange={(e) =>
                            handleUpdateRate(
                              item.material.id,
                              'laborRate',
                              Number(e.target.value) / currency.rateToUSD
                            )
                          }
                          className="w-16 px-1.5 py-0.5 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono text-xs font-semibold text-stone-900 dark:text-stone-100"
                        />
                      </div>
                    </td>

                    {/* Total Item Cost */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-stone-900 dark:text-stone-100 text-sm">
                      {currency.symbol}
                      {item.itemTotalCost.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Subtotals */}
        <div className="p-4 sm:p-5 bg-stone-50 dark:bg-stone-800/40 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-stone-500 flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Advisory Pre-Construction Estimate · Rates subject to local contractor site assessment.</span>
          </div>

          <div className="flex items-center gap-6 font-mono">
            <div>
              <span className="text-stone-500 mr-2">Materials Subtotal:</span>
              <span className="font-bold text-stone-900 dark:text-stone-100">
                {currency.symbol}
                {summary.materialTotal.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-stone-500 mr-2">Labor Subtotal:</span>
              <span className="font-bold text-stone-900 dark:text-stone-100">
                {currency.symbol}
                {summary.laborTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
