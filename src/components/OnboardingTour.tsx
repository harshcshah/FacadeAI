import React from 'react';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  Layers,
  Palette,
  Sliders,
  Printer,
  CheckCircle2,
  Box,
} from 'lucide-react';

export interface TourStep {
  id: string;
  targetId: string;
  title: string;
  subtitle: string;
  description: string;
  actionHint?: string;
  icon: React.ReactNode;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    targetId: 'tour-house-selector',
    title: '1. Select or Upload Elevation',
    subtitle: 'Start with a house exterior photo',
    description:
      'Begin by choosing from 3 pre-calibrated luxury residential elevations (Suburban Villa, Contemporary Residence, or Bungalow) or upload your customer’s actual house photo.',
    actionHint: 'Tip: You can switch houses at any time from the top dropdown menu.',
    icon: <Compass className="w-5 h-5 text-blue-600" />,
  },
  {
    id: 'zones',
    targetId: 'tour-zones-panel',
    title: '2. Structural Facade Detection',
    subtitle: 'Automated architectural plane recognition',
    description:
      'FaçadeCraft identifies main walls, entrance pillars, balconies, railings, and parapets with calculated surface areas and window deductions.',
    actionHint: 'Tip: Click "+ Add Zone" in the left panel to manually add custom areas.',
    icon: <Layers className="w-5 h-5 text-blue-600" />,
  },
  {
    id: 'materials',
    targetId: 'tour-materials-panel',
    title: '3. Materials & 1-Click Makeovers',
    subtitle: 'Apply authentic finishes or cohesive designer themes',
    description:
      'Browse our catalog of elastomeric acrylics, stacked ledger stone, Roman travertine, and WPC fluted louvers. Click any 1-Click Theme for an instant designer elevation.',
    actionHint: 'Tip: Clicking any finish immediately applies it to the active zone.',
    icon: <Palette className="w-5 h-5 text-purple-600" />,
  },
  {
    id: 'canvas',
    targetId: 'tour-canvas-viewport',
    title: '4. Interactive 2D Slider & 3D Model',
    subtitle: 'Inspect the redesign in both 2D photo & 3D space',
    description:
      'Drag the split slider to compare before and after, or switch to the 3D Interactive Model to orbit 360° with daylight simulations. Material styling updates both views in real time!',
    actionHint: 'Tip: Click directly on any wall or pillar on the house to style it.',
    icon: <Box className="w-5 h-5 text-blue-600" />,
  },
  {
    id: 'boq',
    targetId: 'tour-boq-button',
    title: '5. Live BOQ & Contractor Schedule',
    subtitle: 'Transparent costing with material wastage and labor',
    description:
      'Review itemized quantities, calculated wastage allowances (5–10%), skilled labor rates, and scaffolding. Click "Contractor BOQ" to export a professional PDF proposal for clients and contractors.',
    actionHint: 'Tip: You can modify unit rates anytime to match local contractor quotes.',
    icon: <Printer className="w-5 h-5 text-emerald-600" />,
  },
];

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenReport?: () => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = React.useState(0);

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStepIdx];
  const isFirst = currentStepIdx === 0;
  const isLast = currentStepIdx === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto flex items-end sm:items-center justify-center p-4 sm:p-6 bg-slate-900/30 backdrop-blur-xs select-none animate-in fade-in duration-200">
      <div className="bg-white border-2 border-blue-500 shadow-2xl rounded-3xl max-w-lg w-full p-6 text-slate-800 space-y-4 ring-4 ring-blue-500/10">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-150">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
              {step.icon}
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-600 font-bold">
                Guided Interactive Tour
              </span>
              <div className="text-xs text-slate-500 font-medium">
                Step {currentStepIdx + 1} of {TOUR_STEPS.length}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-xs font-semibold text-slate-400 hover:text-slate-700 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Skip Tour
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
              title="Close tour"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1.5 pt-1">
          <h3 className="font-extrabold text-base text-slate-900">{step.title}</h3>
          <p className="text-xs font-semibold text-blue-600">{step.subtitle}</p>
          <p className="text-xs text-slate-600 leading-relaxed pt-1">{step.description}</p>
          {step.actionHint && (
            <div className="mt-2.5 p-2.5 rounded-xl bg-blue-50/70 border border-blue-150 text-[11px] text-blue-900 font-mono flex items-center gap-2">
              <span className="shrink-0 text-base">💡</span>
              <span>{step.actionHint}</span>
            </div>
          )}
        </div>

        {/* Progress Dots & Navigation Buttons */}
        <div className="pt-3 border-t border-slate-150 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStepIdx(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentStepIdx
                    ? 'w-6 bg-blue-600'
                    : idx < currentStepIdx
                    ? 'w-2 bg-slate-300 hover:bg-slate-400'
                    : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
                title={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                onClick={handlePrev}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 hover:scale-105"
            >
              <span>{isLast ? 'Get Started 🎉' : 'Next Step'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
