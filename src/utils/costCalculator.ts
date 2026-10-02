import {
  BillOfQuantitiesItem,
  CostBreakdownSummary,
  CurrencyConfig,
  Material,
  StructuralZone,
} from '../types';

export const CURRENCIES: CurrencyConfig[] = [
  { code: 'INR', symbol: '₹', label: 'Indian Rupee (₹)', rateToUSD: 83.5 },
  { code: 'USD', symbol: '$', label: 'US Dollar ($)', rateToUSD: 1.0 },
  { code: 'EUR', symbol: '€', label: 'Euro (€)', rateToUSD: 0.92 },
  { code: 'GBP', symbol: '£', label: 'British Pound (£)', rateToUSD: 0.79 },
  { code: 'CAD', symbol: 'CA$', label: 'Canadian Dollar (CA$)', rateToUSD: 1.36 },
  { code: 'AUD', symbol: 'AU$', label: 'Australian Dollar (AU$)', rateToUSD: 1.52 },
];

/**
 * Calculates polygon area using the Shoelace formula on normalized coordinates (0.0 to 1.0)
 */
export function calculateNormalizedPolygonArea(polygon: number[][]): number {
  if (!polygon || polygon.length < 3) return 0;
  let area = 0;
  const n = polygon.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += polygon[i][0] * polygon[j][1];
    area -= polygon[j][0] * polygon[i][1];
  }
  return Math.abs(area) / 2;
}

/**
 * Computes Bill of Quantities and itemized cost breakdown
 */
export function calculateBillOfQuantities(
  zones: StructuralZone[],
  materialsMap: Map<string, Material>,
  rateOverrides: Record<string, { materialRate?: number; laborRate?: number; wastagePercent?: number }>,
  currency: CurrencyConfig,
  options: {
    scaffoldingRatePerSqFt?: number;
    contingencyPercent?: number;
  } = {}
): CostBreakdownSummary {
  const { scaffoldingRatePerSqFt = 1.15, contingencyPercent = 10 } = options;

  const items: BillOfQuantitiesItem[] = [];
  let materialTotal = 0;
  let laborTotal = 0;
  let totalTreatedAreaSqFt = 0;

  for (const zone of zones) {
    if (!zone.assignedMaterialId) continue;
    const material = materialsMap.get(zone.assignedMaterialId);
    if (!material) continue;

    const override = rateOverrides[material.id] || {};
    const materialRate = (override.materialRate ?? material.unitRate) * currency.rateToUSD;
    const laborRate = (override.laborRate ?? material.laborRate) * currency.rateToUSD;
    const wastagePercent = override.wastagePercent ?? material.wastagePercent;

    const netAreaSqFt = Math.max(1, zone.netAreaSqFt);
    const netAreaSqM = Number((netAreaSqFt * 0.092903).toFixed(1));
    const wastageSqFt = Math.round((netAreaSqFt * wastagePercent) / 100);
    const totalQuantity = netAreaSqFt + wastageSqFt;

    // Is it measured in linear feet (like railings) or square feet?
    const isLinear = zone.type === 'railing' && (zone.linearFt || 0) > 0;
    const calcQty = isLinear ? (zone.linearFt || 20) : totalQuantity;
    const calcNet = isLinear ? (zone.linearFt || 20) : netAreaSqFt;

    const materialTotalCost = Math.round(calcQty * materialRate);
    const laborTotalCost = Math.round(calcNet * laborRate);
    const itemTotalCost = materialTotalCost + laborTotalCost;

    // Pack breakdown
    let packCount = '';
    if (material.category === 'paint') {
      const gallonsNeeded = Math.ceil(totalQuantity / 160); // approx 160 sq ft per gallon for 2-coat
      packCount = `${gallonsNeeded} gal (${Math.ceil(gallonsNeeded / 5)} x 5-gal pails)`;
    } else if (material.category === 'stone') {
      const boxes = Math.ceil(totalQuantity / 6); // 6 sq ft per box
      packCount = `${boxes} cartons / boxes`;
    } else if (material.category === 'panel') {
      const planks = Math.ceil(totalQuantity / 4.25); // 8.5ft x 0.5ft
      packCount = `${planks} architectural planks`;
    } else if (material.category === 'railing') {
      const panels = Math.ceil((zone.linearFt || 20) / 4);
      packCount = `${panels} modular glass sections (4ft)`;
    } else {
      packCount = `${Math.ceil(totalQuantity / 10)} bundles`;
    }

    items.push({
      zoneId: zone.id,
      zoneName: zone.name,
      zoneType: zone.type,
      material,
      netAreaSqFt,
      netAreaSqM,
      wastagePercent,
      wastageSqFt,
      totalQuantity,
      unit: isLinear ? 'Linear Ft' : 'Sq Ft',
      materialRate: Number(materialRate.toFixed(2)),
      laborRate: Number(laborRate.toFixed(2)),
      materialTotalCost,
      laborTotalCost,
      itemTotalCost,
      packCount,
    });

    materialTotal += materialTotalCost;
    laborTotal += laborTotalCost;
    totalTreatedAreaSqFt += netAreaSqFt;
  }

  // Scaffolding & Surface Prep (pressure washing, masking, safety netting)
  const sitePreparationAndScaffolding = Math.round(
    totalTreatedAreaSqFt * scaffoldingRatePerSqFt * currency.rateToUSD
  );

  const subtotal = materialTotal + laborTotal + sitePreparationAndScaffolding;
  const contingencyAmount = Math.round((subtotal * contingencyPercent) / 100);
  const grandTotal = subtotal + contingencyAmount;

  return {
    items,
    materialTotal,
    laborTotal,
    sitePreparationAndScaffolding,
    contingencyPercent,
    contingencyAmount,
    grandTotal,
    currency,
  };
}
