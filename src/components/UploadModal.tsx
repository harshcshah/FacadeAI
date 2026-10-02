import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Home,
  CheckCircle2,
  AlertTriangle,
  X,
  Camera,
  Info,
} from 'lucide-react';
import { SAMPLE_HOUSES } from '../data/materials';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelected: (dataUrl: string, houseMeta?: any) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onImageSelected,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const processFile = (file: File) => {
    setValidationError(null);

    if (!file.type.startsWith('image/')) {
      setValidationError('Please select a valid image file (JPG, PNG, or WebP).');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setValidationError('Image is too large. Please upload an image under 20MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        if (img.width < 400 || img.height < 300) {
          setValidationError(
            `Resolution is too low (${img.width}x${img.height}px). Minimum recommended resolution is 800x600 for accurate facade identification.`
          );
          return;
        }

        onImageSelected(dataUrl, {
          title: file.name.replace(/\.[^/.]+$/, ''),
          type: 'Residential Building Exterior',
          facadeWidthFt: 36,
          facadeHeightFt: 22,
        });
        onClose();
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white text-slate-800 rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-150">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">
              Select or Upload House Elevation
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload an exterior photo or pick a pre-calibrated luxury residential elevation.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`rounded-2xl border-2 border-dashed p-8 text-center transition-all cursor-pointer group ${
            dragOver
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-300 bg-slate-50 hover:border-blue-500 hover:bg-blue-50/40'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />

          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform mb-3 shadow-xs">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h4 className="font-bold text-sm text-slate-800">
            Upload Customer House Photo
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Drag and drop JPG, PNG, or WebP here, or browse files
          </p>
        </div>

        {/* Error Notice */}
        {validationError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Sample Houses Quick Pick */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-blue-600" />
              <span>Or Choose a Sample House Elevation</span>
            </span>
            <span className="text-[10px] text-blue-600 font-semibold font-mono">1-Click Test</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SAMPLE_HOUSES.map((sample) => (
              <div
                key={sample.id}
                onClick={() => {
                  onImageSelected(sample.imageUrl, sample);
                  onClose();
                }}
                className="group p-2.5 rounded-2xl border border-slate-200 bg-white hover:border-blue-500 hover:shadow-md transition-all cursor-pointer text-left space-y-2"
              >
                <div className="rounded-xl overflow-hidden aspect-4/3 relative border border-slate-100">
                  <img
                    src={sample.imageUrl}
                    alt={sample.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-white/95 text-[9px] font-bold text-slate-800 shadow-xs">
                    {sample.type.split(' ')[0]}
                  </div>
                </div>

                <div>
                  <h5 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 truncate">
                    {sample.title}
                  </h5>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">
                    ~{sample.facadeWidthFt} ft wide · {sample.type}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
