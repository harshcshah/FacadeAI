import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Check,
  Palette,
  Compass,
  ArrowRight,
  Sun,
  ShieldCheck,
  TrendingUp,
  Layers,
  Wand2,
  Sliders,
} from 'lucide-react';
import { RenovationTheme, StructuralZone, Material } from '../types';
import { PRESET_THEMES } from '../data/materials';

interface AiDesignAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  zones: StructuralZone[];
  setZones: React.Dispatch<React.SetStateAction<StructuralZone[]>>;
  materialsMap: Map<string, Material>;
  onApplyTheme: (theme: RenovationTheme) => void;
  onCompleteDesign: (generatedImageUrl?: string) => void;
  buildingMeta: {
    buildingType?: string;
    architecturalStyle?: string;
  };
}

export const AiDesignAssistantModal: React.FC<AiDesignAssistantModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  zones,
  setZones,
  materialsMap,
  onApplyTheme,
  onCompleteDesign,
  buildingMeta,
}) => {
  const [selectedThemeId, setSelectedThemeId] = useState<string>(PRESET_THEMES[0].id);
  const [isApplying, setIsApplying] = useState(false);
  const [step, setStep] = useState<'choose' | 'result'>('choose');

  if (!isOpen) return null;

  const currentTheme = PRESET_THEMES.find((t) => t.id === selectedThemeId) || PRESET_THEMES[0];

  const handleApplyAiDesign = (theme: RenovationTheme) => {
    setIsApplying(true);
    setSelectedThemeId(theme.id);

    // Apply materials to all zones
    onApplyTheme(theme);

    setTimeout(() => {
      setIsApplying(false);
      setStep('result');
      onCompleteDesign();
    }, 450);
  };

  const handleMagicAutoSelect = () => {
    // Intelligently pick best theme based on building type
    const bestTheme =
      buildingMeta.architecturalStyle?.toLowerCase().includes('mediterranean')
        ? PRESET_THEMES[2] // Mediterranean Travertine
        : buildingMeta.architecturalStyle?.toLowerCase().includes('urban')
        ? PRESET_THEMES[1] // Urban Charcoal
        : PRESET_THEMES[0]; // Nordic Contemporary

    handleApplyAiDesign(bestTheme);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50 via-indigo-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
              <Wand2 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-900">
                  AI Architectural Design Assistant
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider">
                  Smart Co-Pilot
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Feeling stuck or confused? Let AI automatically style and redesign your house.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 max-h-[72vh]">
          {step === 'choose' ? (
            <>
              {/* Magic One-Click Hero Button */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-amber-300">
                    <Sparkles className="w-4 h-4" />
                    <span>Recommended 1-Click Action</span>
                  </div>
                  <h4 className="font-extrabold text-base sm:text-lg">
                    ✨ Auto-Style Best Architectural Match
                  </h4>
                  <p className="text-xs text-blue-100 max-w-md leading-relaxed">
                    AI analyzes your house elevation and applies a curated, color-balanced palette with stone, stucco, and wood louvers.
                  </p>
                </div>

                <button
                  onClick={handleMagicAutoSelect}
                  disabled={isApplying}
                  className="px-5 py-3 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-extrabold text-xs shadow-md transition-all shrink-0 active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>{isApplying ? 'Applying Style...' : 'Style House Now →'}</span>
                </button>
              </div>

              {/* Or Choose a Curated Aesthetic Style */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Or Choose an Architectural Aesthetic
                  </span>
                  <span className="text-[11px] text-slate-500">
                    You can freely customize any surface afterward
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PRESET_THEMES.map((theme) => {
                    const isSelected = selectedThemeId === theme.id;
                    return (
                      <div
                        key={theme.id}
                        onClick={() => handleApplyAiDesign(theme)}
                        className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between group shadow-xs ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-md'
                            : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                              {theme.name}
                            </span>
                            {isSelected && (
                              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                                ✓
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            {theme.subtitle}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                          {/* Color Palette Preview */}
                          <div className="flex items-center gap-1.5">
                            {theme.colorPreview.map((c, i) => (
                              <span
                                key={i}
                                className="w-4 h-4 rounded-full border border-slate-300 shadow-xs"
                                style={{ backgroundColor: c }}
                              />
                            ))}
                          </div>

                          <span className="text-xs text-blue-600 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                            Apply Style <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            /* Result & Confirmation Step */
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-900">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm">
                    {currentTheme.name} Successfully Applied!
                  </h4>
                  <p className="text-xs text-emerald-700">
                    The finishes have been applied to your house facade and synchronized across 2D, 3D, and cost estimation.
                  </p>
                </div>
              </div>

              {/* What to do next instructions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-blue-600" />
                    <span>How to Customize Freely</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Click <strong>any surface on the photo</strong> (walls, columns, windows, door, or railings) to change colors, switch materials, or adjust tint.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>Cost & Area Updates</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    The <strong>Live BOQ</strong> and <strong>Area Takeoff</strong> tabs in the right panel automatically recalculate quantities, labor rates, and total budget.
                  </p>
                </div>
              </div>

              {/* Close & Continue Button */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setStep('choose')}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  ← Choose Different Style
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
                >
                  Start Customizing on Canvas →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Harmonized exterior materials with durability & weather resistance ratings</span>
          </span>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
