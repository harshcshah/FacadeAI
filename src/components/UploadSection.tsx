import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Home,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Info,
  Camera,
  Image as ImageIcon,
} from 'lucide-react';
import { SAMPLE_HOUSES } from '../data/materials';

interface UploadSectionProps {
  onImageSelected: (dataUrl: string, houseMeta?: any) => void;
  currentImage: string | null;
  onContinue: () => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  onImageSelected,
  currentImage,
  onContinue,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [imageStats, setImageStats] = useState<{ width: number; height: number; quality: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setValidationError(null);

    // Validate type
    if (!file.type.startsWith('image/')) {
      setValidationError('Please select a valid image file (JPG, PNG, or WebP).');
      return;
    }

    // Validate file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      setValidationError('Image is too large. Please upload an image under 20MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        // Quality verification
        if (img.width < 400 || img.height < 300) {
          setValidationError(
            'Resolution is too low (' +
              img.width +
              'x' +
              img.height +
              'px). Minimum recommended resolution is 800x600 for accurate architectural zone identification.'
          );
          return;
        }

        const qualityRating =
          img.width >= 1200 && img.height >= 800
            ? 'High Definition (Optimal for AI mapping)'
            : 'Good (Sufficient for surface estimation)';

        setImageStats({
          width: img.width,
          height: img.height,
          quality: qualityRating,
        });

        onImageSelected(dataUrl, {
          title: file.name.replace(/\.[^/.]+$/, ''),
          type: 'Residential Building Exterior',
          facadeWidthFt: 36,
          facadeHeightFt: 22,
        });
      };
      img.onerror = () => {
        setValidationError('Failed to parse image file. Please try another image.');
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_HOUSES[0]) => {
    setValidationError(null);
    setImageStats({
      width: 1200,
      height: 800,
      quality: 'High Definition (Studio Reference)',
    });
    onImageSelected(sample.imageUrl, sample);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header kicker */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800/60 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 1 · Visual Media Ingestion</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
          Upload Your House Exterior
        </h1>
        <p className="mt-2 text-sm sm:text-base text-stone-600 dark:text-stone-400">
          Upload an exterior photo or pick one of our sample residential houses.
          Our architectural engine will detect walls, pillars, balconies, railings, and parapets for instant redesign and costing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Dropzone & Upload */}
        <div className="lg:col-span-7 space-y-6">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer group ${
              dragOver
                ? 'border-amber-500 bg-amber-500/5 scale-[1.01]'
                : currentImage
                ? 'border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/60 hover:border-amber-500/50'
                : 'border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-amber-500/60 hover:bg-stone-50/50 dark:hover:bg-stone-900/80 shadow-sm'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />

            {currentImage ? (
              <div className="space-y-4">
                <div className="relative mx-auto max-w-md rounded-xl overflow-hidden shadow-lg border border-stone-200 dark:border-stone-700 group">
                  <img
                    src={currentImage}
                    alt="Uploaded residential facade"
                    className="w-full h-56 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold backdrop-blur-xs">
                    Click to replace photo
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Photo verified & ready for architectural mapping</span>
                </div>

                {imageStats && (
                  <div className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
                    Resolution: {imageStats.width} × {imageStats.height}px · {imageStats.quality}
                  </div>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onContinue();
                  }}
                  className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-md shadow-amber-500/20 transition-all hover:translate-x-0.5"
                >
                  <span>Proceed to Structural Mapping</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    Drag and drop your house exterior photo
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    Supports JPG, PNG, and WebP (up to 20MB)
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-semibold transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Browse Device Files</span>
                </button>
              </div>
            )}
          </div>

          {/* Validation or Error Message */}
          {validationError && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Image Usability Notice</p>
                <p className="mt-0.5">{validationError}</p>
              </div>
            </div>
          )}

          {/* Guidelines for best exterior results */}
          <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-stone-900 dark:text-stone-200">
              <Info className="w-4 h-4 text-amber-500" />
              <span>Guidelines for Accurate Area & Surface Estimation</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-600 dark:text-stone-400 pl-5 list-disc">
              <li>Capture full elevation from ground to roof parapet.</li>
              <li>Avoid extreme perspective tilt; stand centered if possible.</li>
              <li>Ensure daylight or clear lighting without harsh flash.</li>
              <li>Keep doors or windows visible for scale calibration.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Pre-loaded Sample Residential Houses */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-stone-200 flex items-center gap-2">
              <Home className="w-4 h-4 text-amber-500" />
              <span>Or Try A Sample Residential House</span>
            </h2>
            <span className="text-[11px] text-stone-500">1-click test</span>
          </div>

          <div className="space-y-3">
            {SAMPLE_HOUSES.map((sample) => (
              <div
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className="group p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-amber-500/80 hover:shadow-md transition-all cursor-pointer flex gap-4 items-center"
              >
                <div className="w-24 h-20 rounded-lg overflow-hidden shrink-0 border border-stone-200 dark:border-stone-800 relative">
                  <img
                    src={sample.imageUrl}
                    alt={sample.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 truncate group-hover:text-amber-500 transition-colors">
                      {sample.title}
                    </h3>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1 mt-0.5">
                    {sample.subtitle}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-[10px] text-stone-400 font-mono">
                    <span>Facade: ~{sample.facadeWidthFt}' × {sample.facadeHeightFt}'</span>
                    <span>·</span>
                    <span className="text-amber-500 font-medium">Click to Load</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Assistant Note */}
          <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
            <span className="font-semibold text-amber-700 dark:text-amber-400">Pre-Construction Assistant: </span>
            This tool computes realistic Bill of Quantities (BOQ), material wastage, and labor rates so you can negotiate transparently with contractors before signing contracts.
          </div>
        </div>
      </div>
    </div>
  );
};
