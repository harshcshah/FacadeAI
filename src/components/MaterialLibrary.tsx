import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Sparkles, GripVertical, Check, Info } from 'lucide-react';
import { Material, CurrencyConfig } from '../types';

interface MaterialLibraryProps {
  materials: Material[];
  currency: CurrencyConfig;
  selectedMaterialId: string | null;
  onSelectMaterial: (m: Material) => void;
  onDragStartMaterial: (m: Material) => void;
  activeZoneName?: string | null;
}

export const MaterialLibrary: React.FC<MaterialLibraryProps> = ({
  materials,
  currency,
  selectedMaterialId,
  onSelectMaterial,
  onDragStartMaterial,
  activeZoneName,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [maintenanceFilter, setMaintenanceFilter] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(1000);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'stone', label: 'Stone' },
    { id: 'wood', label: 'Wood' },
    { id: 'paint', label: 'Paint' },
    { id: 'brick', label: 'Brick' },
    { id: 'panel', label: 'Panel' },
    { id: 'glass', label: 'Glass' },
    { id: 'railing', label: 'Railing' },
    { id: 'window', label: 'Glazing' },
    { id: 'door', label: 'Doors' },
  ];

  const filteredMaterials = useMemo(() => {
    return materials.filter((m) => {
      // Category match
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'wood') {
          if (!m.id.includes('teak') && !m.id.includes('walnut') && !m.name.toLowerCase().includes('wood') && !m.name.toLowerCase().includes('louver')) {
            return false;
          }
        } else if (selectedCategory === 'brick') {
          if (!m.id.includes('brick') && !m.name.toLowerCase().includes('brick')) return false;
        } else if (m.category !== selectedCategory) {
          return false;
        }
      }

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = m.name.toLowerCase().includes(q);
        const matchesDesc = m.description.toLowerCase().includes(q);
        const matchesCat = m.categoryLabel.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }

      // Maintenance filter
      if (maintenanceFilter !== 'all' && m.maintenanceLevel !== maintenanceFilter) {
        return false;
      }

      // Price filter
      const unitRateLocal = Math.round(m.unitRate * currency.rateToUSD);
      if (unitRateLocal > maxPrice) return false;

      return true;
    });
  }, [materials, selectedCategory, searchQuery, maintenanceFilter, maxPrice, currency]);

  const handleDragStart = (e: React.DragEvent, m: Material) => {
    e.dataTransfer.setData('text/plain', m.id);
    e.dataTransfer.setData('application/json', JSON.stringify({ materialId: m.id, materialName: m.name }));
    e.dataTransfer.effectAllowed = 'copyMove';
    onDragStartMaterial(m);
  };

  return (
    <aside className="w-72 sm:w-80 border-r border-zinc-200/80 bg-white flex flex-col shrink-0 select-none overflow-hidden h-full z-20">
      {/* Header */}
      <div className="p-3.5 border-b border-zinc-100 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Materials</h2>
            <span className="text-[10px] bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded font-medium">
              {filteredMaterials.length}
            </span>
          </div>
          {activeZoneName && (
            <span className="text-[11px] text-violet-700 bg-violet-50 font-medium px-2 py-0.5 rounded-full truncate max-w-[130px]">
              Target: {activeZoneName}
            </span>
          )}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search materials..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:bg-white transition-all"
          />
        </div>

        {/* Category Horizontal Scroll */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 -mx-1 px-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-full shrink-0 transition-all ${
                selectedCategory === c.id
                  ? 'bg-zinc-900 text-white shadow-2xs'
                  : 'bg-zinc-100/80 text-zinc-600 hover:bg-zinc-200/70 hover:text-zinc-900'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Materials List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredMaterials.map((m) => {
          const isSelected = selectedMaterialId === m.id;
          const rateFormatted = Math.round(m.unitRate * currency.rateToUSD);

          return (
            <div
              key={m.id}
              draggable
              onDragStart={(e) => handleDragStart(e, m)}
              onClick={() => onSelectMaterial(m)}
              className={`group relative p-2.5 rounded-xl border transition-all cursor-grab active:cursor-grabbing hover:shadow-sm ${
                isSelected
                  ? 'bg-violet-50/50 border-violet-500 ring-2 ring-violet-500/10'
                  : 'bg-white border-zinc-200/80 hover:border-zinc-300'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {/* Color / Texture Swatch */}
                <div
                  className="w-10 h-10 rounded-lg shrink-0 border border-zinc-200 shadow-2xs flex items-center justify-center relative overflow-hidden"
                  style={{ backgroundColor: m.colorHex }}
                >
                  {/* Subtle surface texture shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/20 pointer-events-none" />
                  <GripVertical className="w-3.5 h-3.5 text-white/70 drop-shadow opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-semibold text-zinc-900 truncate group-hover:text-violet-700 transition-colors">
                      {m.name.split('(')[0].trim()}
                    </h4>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                    )}
                  </div>

                  <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                    {m.description}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-zinc-100">
                    <span className="text-xs font-bold text-zinc-900">
                      {currency.symbol}{rateFormatted.toLocaleString()}
                      <span className="text-[10px] text-zinc-500 font-normal"> / sq ft</span>
                    </span>

                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                      <span className="bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-600 font-medium">
                        {m.durabilityYears}y
                      </span>
                      <span className={`px-1.5 py-0.5 rounded font-medium ${
                        m.maintenanceLevel === 'Low' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {m.maintenanceLevel} Maint
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Drag Hint overlay */}
              <div className="text-[10px] text-zinc-400 mt-1 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity pt-1">
                <span>Drag to house surface</span>
                <span className="text-violet-600 font-medium">or click to apply</span>
              </div>
            </div>
          );
        })}

        {filteredMaterials.length === 0 && (
          <div className="py-12 text-center text-zinc-400 text-xs">
            No materials found matching criteria.
          </div>
        )}
      </div>

      {/* Drag & Drop Help Footer */}
      <div className="p-2.5 bg-zinc-50/80 border-t border-zinc-200/70 text-[11px] text-zinc-500 flex items-center gap-2">
        <Info className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
        <span>Drag any material directly onto a detected surface.</span>
      </div>
    </aside>
  );
};
