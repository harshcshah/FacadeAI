export type StructuralZoneType =
  | 'main_wall'
  | 'accent_wall'
  | 'balcony'
  | 'pillar'
  | 'parapet'
  | 'railing'
  | 'window'
  | 'door'
  | 'roof_edge'
  | 'gate_porch'
  | 'plinth';

export interface StructuralZone {
  id: string;
  name: string;
  type: StructuralZoneType;
  description?: string;
  /** Normalized coordinates [[x, y], ...] from 0.0 to 1.0 */
  polygon: number[][];
  grossAreaSqFt: number;
  openingsAreaSqFt: number;
  netAreaSqFt: number;
  linearFt?: number;
  assignedMaterialId?: string;
  customColorHex?: string;
  surfaceCondition?: string;
  suggestedMaterial?: string;
  parentWallId?: string;
  /** 3D Spatial parameters for 3D architectural reconstruction */
  depthOffsetFt?: number;
  elevationFt?: number;
  widthFt?: number;
  heightFt?: number;
}

export type MaterialCategory = 'paint' | 'stone' | 'panel' | 'tiles' | 'railing' | 'trim' | 'window' | 'door';

export type TextureType =
  | 'smooth'
  | 'stucco'
  | 'stacked_stone'
  | 'travertine'
  | 'brick'
  | 'fluted_wood'
  | 'glass'
  | 'metal_slats'
  | 'granite';

export interface Material {
  id: string;
  name: string;
  category: MaterialCategory;
  categoryLabel: string;
  colorHex: string;
  textureType: TextureType;
  unitRate: number; // material cost per sq ft or linear ft
  laborRate: number; // labor installation per sq ft or linear ft
  wastagePercent: number; // typical wastage factor (e.g. 10%)
  durabilityYears: number;
  maintenanceLevel: 'Low' | 'Medium' | 'High';
  weatherResistance: string;
  description: string;
  suitableLocations: string[];
  coverageUnit: string;
  packSize: string;
  thumbnailSrc?: string;
}

export interface RenovationTheme {
  id: string;
  name: string;
  subtitle: string;
  colorPreview: string[];
  description: string;
  materialAssignments: Partial<Record<StructuralZoneType, string>>;
}

export interface CalibrationScale {
  mode: 'door_height' | 'window_size' | 'floor_height' | 'custom_line';
  referenceFeet: number;
  pixelDistance: number;
  pixelsPerFoot: number;
}

export interface CurrencyConfig {
  code: string;
  symbol: string;
  label: string;
  rateToUSD: number;
}

export interface CostRateOverride {
  materialRate?: number;
  laborRate?: number;
  wastagePercent?: number;
}

export interface BillOfQuantitiesItem {
  zoneId: string;
  zoneName: string;
  zoneType: StructuralZoneType;
  material: Material;
  netAreaSqFt: number;
  netAreaSqM: number;
  wastagePercent: number;
  wastageSqFt: number;
  totalQuantity: number;
  unit: string;
  materialRate: number;
  laborRate: number;
  materialTotalCost: number;
  laborTotalCost: number;
  itemTotalCost: number;
  packCount: string;
}

export interface CostBreakdownSummary {
  items: BillOfQuantitiesItem[];
  materialTotal: number;
  laborTotal: number;
  sitePreparationAndScaffolding: number;
  contingencyPercent: number;
  contingencyAmount: number;
  grandTotal: number;
  currency: CurrencyConfig;
}

export interface ArchitecturalAdviceReport {
  aestheticCohesion: string;
  technicalAdvice: string;
  maintenanceUpkeep: string;
  contractorChecklist: string[];
  valueEngineering: string[];
}

export type WorkflowStep = 1 | 2 | 3 | 4;

export type AiDesignStyle =
  | 'Modern'
  | 'Minimal'
  | 'Warm'
  | 'Luxury'
  | 'Industrial'
  | 'Contemporary';

export interface SampleHouse {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  renovatedImageUrl?: string;
  type: string;
  facadeWidthFt: number;
  facadeHeightFt: number;
  defaultDoorHeightFt: number;
  conditionAssessment?: string;
  defaultZones?: StructuralZone[];
}
