import React, { useRef, useState } from 'react';
import { Upload, Sparkles, ArrowRight, ShieldCheck, Layers, Calculator, CheckCircle2 } from 'lucide-react';
import { SampleHouse } from '../types';

interface UploadScreenProps {
  onImageSelected: (base64OrUrl: string, sampleMeta?: SampleHouse) => void;
  onTryDemo: () => void;
  sampleHouse: SampleHouse;
}

export const UploadScreen: React.FC<UploadScreenProps> = ({
  onImageSelected,
  onTryDemo,
  sampleHouse,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onImageSelected(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#fafafa] flex flex-col items-center justify-center px-4 py-12 select-none">
      <div className="max-w-3xl w-full flex flex-col items-center text-center">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-200/60 text-violet-700 text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5 text-violet-600" />
          <span>AI Exterior Renovation & Cost Estimator</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 leading-[1.15] mb-4">
          Redesign your home <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-violet-950 to-violet-600">
            before you renovate it.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-zinc-600 max-w-xl mx-auto leading-relaxed mb-8">
          Upload a photo of your home and let AI create realistic exterior renovation concepts,
          materials, and contractor-grade cost estimates.
        </p>

        {/* Upload Dropzone & Actions Card */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`w-full max-w-xl bg-white rounded-2xl border-2 transition-all p-8 flex flex-col items-center shadow-xs ${
            isDragging
              ? 'border-violet-600 bg-violet-50/30 ring-4 ring-violet-500/10'
              : 'border-dashed border-zinc-300 hover:border-zinc-400'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-700 mb-4 shadow-2xs">
            <Upload className="w-6 h-6 text-zinc-600" />
          </div>

          <p className="text-sm font-semibold text-zinc-900 mb-1">
            Drag & drop your house photograph here
          </p>
          <p className="text-xs text-zinc-600 mb-6">
            Supports high-resolution JPG, PNG, and WebP photos
          </p>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png,image/jpeg,image/webp,image/jpg"
            className="hidden"
          />

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4 text-violet-400" />
              <span>Upload House Photo</span>
            </button>

            <button
              onClick={onTryDemo}
              className="w-full sm:w-auto px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-violet-600" />
              <span>Try Demo House</span>
            </button>
          </div>
        </div>

        {/* Demo House Preview Card */}
        <div className="mt-8 max-w-xl w-full bg-white rounded-xl border border-zinc-200/80 p-4 flex items-center justify-between text-left shadow-2xs">
          <div className="flex items-center gap-3">
            <img
              src={sampleHouse.imageUrl}
              alt="Demo House"
              className="w-16 h-12 rounded-lg object-cover border border-zinc-200 shrink-0"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-zinc-900">{sampleHouse.title}</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-medium px-1.5 py-0.5 rounded">Ready to Test</span>
              </div>
              <p className="text-[11px] text-zinc-600 truncate max-w-xs sm:max-w-sm mt-0.5">
                Pre-mapped surfaces (Main Wall, Stone Pillars, Louvers, Windows, Balcony)
              </p>
            </div>
          </div>
          <button
            onClick={onTryDemo}
            className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1 shrink-0 ml-2"
          >
            <span>Launch</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Simple 4-Feature Value Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl w-full mt-12 text-left">
          <div className="bg-white/80 p-3.5 rounded-xl border border-zinc-200/60">
            <Layers className="w-4 h-4 text-violet-600 mb-2" />
            <h4 className="text-xs font-semibold text-zinc-900">Area Detection</h4>
            <p className="text-[11px] text-zinc-600 mt-0.5">Walls, louvers, windows, and pillars mapped</p>
          </div>
          <div className="bg-white/80 p-3.5 rounded-xl border border-zinc-200/60">
            <Sparkles className="w-4 h-4 text-violet-600 mb-2" />
            <h4 className="text-xs font-semibold text-zinc-900">Drag & Drop</h4>
            <p className="text-[11px] text-zinc-600 mt-0.5">Drop travertine, brick, wood, and paint</p>
          </div>
          <div className="bg-white/80 p-3.5 rounded-xl border border-zinc-200/60">
            <Calculator className="w-4 h-4 text-violet-600 mb-2" />
            <h4 className="text-xs font-semibold text-zinc-900">Instant Cost</h4>
            <p className="text-[11px] text-zinc-600 mt-0.5">Live materials, labor, and wastage totals</p>
          </div>
          <div className="bg-white/80 p-3.5 rounded-xl border border-zinc-200/60">
            <ShieldCheck className="w-4 h-4 text-violet-600 mb-2" />
            <h4 className="text-xs font-semibold text-zinc-900">True Structure</h4>
            <p className="text-[11px] text-zinc-600 mt-0.5">Preserves your home's exact geometry</p>
          </div>
        </div>
      </div>
    </div>
  );
};
