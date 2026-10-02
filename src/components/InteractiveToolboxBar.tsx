import React, { useState } from 'react';
import {
  AppWindow,
  DoorClosed,
  Layers,
  Sparkles,
  Columns,
  Grid,
  Palette,
  Lightbulb,
  Trees,
  Plus,
  Check,
  ChevronDown,
  ChevronUp,
  X,
  Sliders,
} from 'lucide-react';
import { StructuralZoneType, Material } from '../types';

export interface PlaceableComponent {
  id: string;
  name: string;
  type: StructuralZoneType;
  materialId: string;
  iconName: string;
  category: 'windows' | 'doors' | 'railings' | 'walls' | 'wood' | 'lighting';
  aspectRatio: number; // width / height
  defaultGrossArea: number;
  badge: string;
  colorPreview: string;
  description: string;
}

export const TOOLBOX_COMPONENTS: PlaceableComponent[] = [
  // --- 🪟 WINDOWS ---
  {
    id: 'place-window-casement',
    name: 'Modern Black Casement',
    type: 'window',
    materialId: 'window-aluminum-black',
    iconName: 'window',
    category: 'windows',
    aspectRatio: 1.2,
    defaultGrossArea: 45,
    badge: 'Popular',
    colorPreview: '#1E232A',
    description: 'Slimline 45mm black aluminum with Low-E double glazing',
  },
  {
    id: 'place-window-french',
    name: 'Divided French Pane Window',
    type: 'window',
    materialId: 'window-french-pane',
    iconName: 'window',
    category: 'windows',
    aspectRatio: 1.0,
    defaultGrossArea: 40,
    badge: 'Colonial / Classic',
    colorPreview: '#F8FAFC',
    description: 'Timeless colonial French grid pattern with crisp mullions',
  },
  {
    id: 'place-window-arched',
    name: 'Grand Arched Window',
    type: 'window',
    materialId: 'window-arched-classic',
    iconName: 'window',
    category: 'windows',
    aspectRatio: 0.85,
    defaultGrossArea: 42,
    badge: 'Architectural',
    colorPreview: '#1E293B',
    description: 'Dramatic arched radius head with solar control reflection',
  },
  {
    id: 'place-window-picture',
    name: 'Panoramic Picture Window',
    type: 'window',
    materialId: 'window-picture-minimal',
    iconName: 'window',
    category: 'windows',
    aspectRatio: 1.8,
    defaultGrossArea: 75,
    badge: 'Ultra-Modern',
    colorPreview: '#0F172A',
    description: 'Expansive uninterrupted glass panel maximizing daylight',
  },
  {
    id: 'place-window-bronze',
    name: 'Bronze Anodized Window',
    type: 'window',
    materialId: 'window-bronze-anodized',
    iconName: 'window',
    category: 'windows',
    aspectRatio: 1.3,
    defaultGrossArea: 48,
    badge: 'Warm Luxury',
    colorPreview: '#3E342B',
    description: 'Deep European bronze thermal-break profile',
  },

  // --- 🚪 DOORS ---
  {
    id: 'place-door-teak-pivot',
    name: 'Solid Teak Pivot Door',
    type: 'door',
    materialId: 'door-pivot-teak',
    iconName: 'door',
    category: 'doors',
    aspectRatio: 0.55,
    defaultGrossArea: 35,
    badge: 'Luxury Entry',
    colorPreview: '#7C4825',
    description: 'Kiln-dried Burmese teak with vertical stainless steel pull bar',
  },
  {
    id: 'place-door-charcoal-steel',
    name: 'Matte Charcoal Steel Door',
    type: 'door',
    materialId: 'door-charcoal-security',
    iconName: 'door',
    category: 'doors',
    aspectRatio: 0.52,
    defaultGrossArea: 32,
    badge: 'High Security',
    colorPreview: '#22252A',
    description: 'Modern flush insulated steel door with multi-point lock',
  },
  {
    id: 'place-door-double-french',
    name: 'Double French Glass Doors',
    type: 'door',
    materialId: 'door-french-double',
    iconName: 'door',
    category: 'doors',
    aspectRatio: 0.95,
    defaultGrossArea: 48,
    badge: 'Grand Portal',
    colorPreview: '#1E293B',
    description: 'Divided French glass pair with brass lever hardware',
  },
  {
    id: 'place-door-glass-slider',
    name: 'Balcony Glass Slider',
    type: 'door',
    materialId: 'door-glass-sliding',
    iconName: 'door',
    category: 'doors',
    aspectRatio: 1.4,
    defaultGrossArea: 60,
    badge: 'Patio & Balcony',
    colorPreview: '#CADCE3',
    description: 'Multi-track smooth sliding glass patio aperture',
  },
  {
    id: 'place-door-garage-modern',
    name: 'Charcoal Sectional Garage',
    type: 'door',
    materialId: 'door-garage-sectional',
    iconName: 'door',
    category: 'doors',
    aspectRatio: 1.8,
    defaultGrossArea: 140,
    badge: 'Car Garage',
    colorPreview: '#181A1E',
    description: 'Insulated horizontal slat overhead door with acrylic lites',
  },

  // --- 🪜 RAILINGS & BALCONIES ---
  {
    id: 'place-railing-frameless',
    name: 'Frameless Glass Balustrade',
    type: 'railing',
    materialId: 'railing-glass-frameless',
    iconName: 'railing',
    category: 'railings',
    aspectRatio: 3.5,
    defaultGrossArea: 40,
    badge: 'Minimalist',
    colorPreview: '#D5E6E8',
    description: '12mm toughened laminated glass with SS 316 spigots',
  },
  {
    id: 'place-railing-louvers',
    name: 'Horizontal Aluminum Slats',
    type: 'railing',
    materialId: 'railing-metal-louvers',
    iconName: 'railing',
    category: 'railings',
    aspectRatio: 3.5,
    defaultGrossArea: 38,
    badge: 'Contemporary',
    colorPreview: '#1F2421',
    description: 'Powder-coated architectural slats providing privacy',
  },
  {
    id: 'place-railing-cnc',
    name: 'CNC Laser-Cut Geometric Screen',
    type: 'railing',
    materialId: 'railing-laser-cnc',
    iconName: 'railing',
    category: 'railings',
    aspectRatio: 3.2,
    defaultGrossArea: 42,
    badge: 'Bespoke',
    colorPreview: '#33383B',
    description: 'Parametric perforated steel creating dynamic shadows',
  },

  // --- 🧱 WALL SURFACES & CLADDING ---
  {
    id: 'place-wall-travertine',
    name: 'Roman Ivory Travertine Slab',
    type: 'accent_wall',
    materialId: 'stone-travertine-beige',
    iconName: 'wall',
    category: 'walls',
    aspectRatio: 1.0,
    defaultGrossArea: 120,
    badge: 'Vein-Cut Stone',
    colorPreview: '#D9CEB8',
    description: 'Honed travertine with linear cream sedimentary veining',
  },
  {
    id: 'place-wall-ledger-stone',
    name: 'Stacked Charcoal Ledger Stone',
    type: 'pillar',
    materialId: 'stone-ledger-granite',
    iconName: 'wall',
    category: 'walls',
    aspectRatio: 0.65,
    defaultGrossArea: 80,
    badge: 'Natural Granite',
    colorPreview: '#3D3D3D',
    description: 'Dynamic 3D interlocking split-face stone courses',
  },
  {
    id: 'place-wall-brick',
    name: 'Wire-Cut Brick Cladding',
    type: 'accent_wall',
    materialId: 'stone-brick-terracotta',
    iconName: 'wall',
    category: 'walls',
    aspectRatio: 1.2,
    defaultGrossArea: 110,
    badge: 'Warm Brick',
    colorPreview: '#8C3B2C',
    description: 'Authentic wire-cut crimson blend kiln-fired brick veneer',
  },
  {
    id: 'place-wall-stucco-white',
    name: 'Pure White Elastomeric Stucco',
    type: 'main_wall',
    materialId: 'paint-weathershield-white',
    iconName: 'wall',
    category: 'walls',
    aspectRatio: 1.5,
    defaultGrossArea: 180,
    badge: 'Self-Cleaning',
    colorPreview: '#F5F5F0',
    description: 'UV-resistant micro-crack bridging waterproof acrylic',
  },
  {
    id: 'place-wall-concrete',
    name: 'Architectural Concrete Plaster',
    type: 'accent_wall',
    materialId: 'paint-concrete-grey',
    iconName: 'wall',
    category: 'walls',
    aspectRatio: 1.1,
    defaultGrossArea: 130,
    badge: 'Industrial',
    colorPreview: '#A3A6A8',
    description: 'Raw concrete board aesthetic with subtle troweled relief',
  },

  // --- 🪵 WOOD & PANELS ---
  {
    id: 'place-wood-fluted-teak',
    name: 'WPC Fluted Louvers (Teak)',
    type: 'accent_wall',
    materialId: 'panel-wpc-teak',
    iconName: 'wood',
    category: 'wood',
    aspectRatio: 0.8,
    defaultGrossArea: 130,
    badge: 'Zero Maintenance',
    colorPreview: '#945A31',
    description: 'Rot-proof composite vertical 4-wave architectural slats',
  },
  {
    id: 'place-wood-walnut-battens',
    name: 'WPC Slat Battens (Walnut)',
    type: 'accent_wall',
    materialId: 'panel-wpc-walnut',
    iconName: 'wood',
    category: 'wood',
    aspectRatio: 0.75,
    defaultGrossArea: 110,
    badge: 'Scandinavian',
    colorPreview: '#4E3629',
    description: 'Deep espresso wood battens with modern vertical rhythm',
  },
  {
    id: 'place-corten-steel',
    name: 'Corten Weathering Steel Panel',
    type: 'accent_wall',
    materialId: 'panel-corten-steel',
    iconName: 'wood',
    category: 'wood',
    aspectRatio: 1.2,
    defaultGrossArea: 90,
    badge: 'Rust Patina',
    colorPreview: '#9E472A',
    description: 'Architectural weathering steel cassette forming oxide barrier',
  },

  // --- 💡 LIGHTING & DECOR ---
  {
    id: 'place-lighting-sconce',
    name: 'Dual-Beam Up/Down Sconce',
    type: 'accent_wall',
    materialId: 'lighting-updown-sconce',
    iconName: 'lighting',
    category: 'lighting',
    aspectRatio: 0.5,
    defaultGrossArea: 15,
    badge: '3000K Warm Glow',
    colorPreview: '#EAB308',
    description: 'IP65 waterproof cylinder casting grazing light cones on wall',
  },
  {
    id: 'place-decor-planter',
    name: 'Architectural Planter Box',
    type: 'balcony',
    materialId: 'decor-planter-box',
    iconName: 'lighting',
    category: 'lighting',
    aspectRatio: 3.0,
    defaultGrossArea: 25,
    badge: 'Lush Greens',
    colorPreview: '#15803D',
    description: 'Balcony trough planter with manicured boxwood foliage',
  },
];

interface InteractiveToolboxBarProps {
  onPlaceComponent: (comp: PlaceableComponent) => void;
  activePlacedId?: string | null;
  onClearCustomComponents?: () => void;
  materialsMap: Map<string, Material>;
  hasCustomPlacedElements?: boolean;
}

export const InteractiveToolboxBar: React.FC<InteractiveToolboxBarProps> = ({
  onPlaceComponent,
  activePlacedId,
  onClearCustomComponents,
  materialsMap,
  hasCustomPlacedElements,
}) => {
  const [activeCategory, setActiveCategory] = useState<'windows' | 'doors' | 'railings' | 'walls' | 'wood' | 'lighting'>('windows');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [placedFeedback, setPlacedFeedback] = useState<string | null>(null);

  const categories = [
    { id: 'windows', label: 'Windows', icon: AppWindow, count: 5 },
    { id: 'doors', label: 'Doors & Entry', icon: DoorClosed, count: 5 },
    { id: 'railings', label: 'Railings', icon: Layers, count: 3 },
    { id: 'walls', label: 'Stone & Stucco', icon: Grid, count: 5 },
    { id: 'wood', label: 'Wood Louvers', icon: Columns, count: 3 },
    { id: 'lighting', label: 'Lights & Decor', icon: Lightbulb, count: 2 },
  ] as const;

  const currentItems = TOOLBOX_COMPONENTS.filter((c) => c.category === activeCategory);

  const handleItemClick = (comp: PlaceableComponent) => {
    onPlaceComponent(comp);
    setPlacedFeedback(`✨ Placed "${comp.name}" on house facade!`);
    setTimeout(() => {
      setPlacedFeedback(null);
    }, 4500);
  };

  return (
    <div className="w-full bg-white/98 backdrop-blur-md border-b border-slate-200 shadow-sm z-20 shrink-0 transition-all">
      {/* Top row: Bifurcated Category Tabs + Placement Feedback Banner */}
      <div className="px-3 sm:px-5 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100">
        {/* Bifurcated category buttons */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-mono mr-1.5 hidden sm:inline">
            Toolbox:
          </span>

          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  if (isCollapsed) setIsCollapsed(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs scale-102'
                    : 'bg-slate-100/80 hover:bg-slate-200/70 text-slate-700 hover:text-slate-900 border border-slate-200/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-blue-700 text-blue-100' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right side controls: Collapse toggle & quick reset */}
        <div className="flex items-center gap-2 text-xs">
          {hasCustomPlacedElements && onClearCustomComponents && (
            <button
              onClick={onClearCustomComponents}
              className="text-slate-500 hover:text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-semibold transition-colors flex items-center gap-1"
              title="Remove placed custom components"
            >
              <X className="w-3 h-3 text-rose-500" />
              <span>Clear Placed</span>
            </button>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1 text-[11px] font-medium"
            title={isCollapsed ? 'Expand tool shelf' : 'Collapse tool shelf'}
          >
            <span>{isCollapsed ? 'Show Tools' : 'Hide'}</span>
            {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Instant Interactive Toast Notification when item placed */}
      {placedFeedback && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-1.5 flex items-center justify-between text-xs text-emerald-900 font-semibold animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>{placedFeedback}</span>
            <span className="text-[11px] text-emerald-700 font-normal">
              — Drag inside the box to reposition anywhere, or drag corner handles to scale!
            </span>
          </div>
          <button
            onClick={() => setPlacedFeedback(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Component Cards Carousel (Visible when not collapsed) */}
      {!isCollapsed && (
        <div className="px-3 sm:px-5 py-2.5 bg-slate-50/70 border-b border-slate-200/80 overflow-x-auto scrollbar-none animate-in fade-in duration-150">
          <div className="flex items-stretch gap-2.5 min-w-max pb-1">
            {currentItems.map((comp) => {
              const mat = materialsMap.get(comp.materialId);
              return (
                <div
                  key={comp.id}
                  onClick={() => handleItemClick(comp)}
                  className="group relative w-56 sm:w-60 p-2.5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-500 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between shrink-0 hover:-translate-y-0.5"
                >
                  {/* Top Bar with Badge */}
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono">
                      {comp.badge}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ~ {comp.defaultGrossArea} sq ft
                    </span>
                  </div>

                  {/* Visual Swatch Preview & Title */}
                  <div className="flex items-start gap-2.5 my-1">
                    <div
                      className="w-10 h-10 rounded-xl border border-slate-300 shadow-xs shrink-0 flex items-center justify-center relative overflow-hidden"
                      style={{ backgroundColor: comp.colorPreview }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
                      {comp.type === 'window' && <AppWindow className="w-5 h-5 text-white/90 drop-shadow" />}
                      {comp.type === 'door' && <DoorClosed className="w-5 h-5 text-white/90 drop-shadow" />}
                      {comp.type === 'railing' && <Layers className="w-5 h-5 text-slate-800 drop-shadow" />}
                      {comp.type === 'accent_wall' && <Columns className="w-5 h-5 text-white/90 drop-shadow" />}
                      {comp.type === 'pillar' && <Grid className="w-5 h-5 text-white/90 drop-shadow" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {comp.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight mt-0.5">
                        {comp.description}
                      </p>
                    </div>
                  </div>

                  {/* 1-Click Placement CTA button */}
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400">
                      {mat ? `$${(mat.unitRate + mat.laborRate).toFixed(0)}/sq ft installed` : 'Architectural grade'}
                    </span>
                    <button
                      type="button"
                      className="px-2.5 py-1 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-700 group-hover:text-white font-extrabold text-[11px] transition-all flex items-center gap-1 shadow-xs"
                    >
                      <Plus className="w-3 h-3 stroke-[3]" />
                      <span>Place on Facade</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
