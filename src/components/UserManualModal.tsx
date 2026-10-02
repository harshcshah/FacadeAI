import React, { useState } from 'react';
import { X, BookOpen, Download, Printer, CheckCircle2, Sparkles, Layers, ShieldCheck, HelpCircle, ArrowRight } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface UserManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserManualModal: React.FC<UserManualModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'photo' | 'dragdrop' | 'cost' | 'budget'>('overview');
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPdf = () => {
    setIsDownloading(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });

      let y = 40;

      // Header
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, 595, 75, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.text('FacadeAI — Official User Manual', 40, 42);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(196, 181, 253);
      doc.text('AI-Powered Exterior Renovation, Surface Takeoffs & Cost Estimator', 40, 60);

      y = 100;
      doc.setTextColor(15, 23, 42);

      // Section 1
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('1. Overview & 4-Step Renovation Workflow', 40, y);
      y += 18;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(
        'FacadeAI enables homeowners to plan exterior renovations before construction begins. The 4-step workflow:\n' +
        '1. Upload: Provide a daylight exterior photograph of your residential facade.\n' +
        '2. Analyze: AI Vision maps distinct surfaces (Main Wall, Louvers, Windows, Balconies, Columns).\n' +
        '3. Design: Drag and drop materials from the library directly onto detected surfaces.\n' +
        '4. Estimate: Real-time Bill of Quantities schedule computes material quantities, labor, and scaffolding.',
        40,
        y
      );
      y += 65;

      // Section 2
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('2. House Photo Upload Guidelines', 40, y);
      y += 18;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(
        '• Framing: Ensure the entire elevation from plinth to roof parapet is visible.\n' +
        '• Lighting: Capture in bright overcast daylight or morning sun to avoid harsh dark shadows.\n' +
        '• Perspective: Stand directly opposite the front entrance for square, orthogonal perspective.\n' +
        '• Supported formats: JPG, PNG, and WebP up to 30MB.',
        40,
        y
      );
      y += 55;

      // Section 3
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('3. Drag & Drop Material System', 40, y);
      y += 18;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(
        '• Dragging: Select any material card from the left panel and drag it across the house canvas.\n' +
        '• Drop Detection: As your cursor hovers over an area, the surface glows in soft violet.\n' +
        '• Immediate Feedback: Releasing the cursor assigns the finish and triggers live cost calculation.\n' +
        '• Click to Apply: You can also click an area on the canvas and then click any material in the library.',
        40,
        y
      );
      y += 55;

      // Section 4
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('4. Before / After Comparison & AI Visualization', 40, y);
      y += 18;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(
        '• Toggle Views: Use the [Original], [AI Design], and [Compare] tabs above the canvas.\n' +
        '• Comparison Slider: Drag the central vertical divider left and right to inspect existing vs new finishes.\n' +
        '• AI Generation: Click "Generate AI Design" to render physically accurate textures, daylight reflections,\n' +
        '  and shadow drop lines while preserving your home\'s original geometry.',
        40,
        y
      );
      y += 65;

      // Section 5
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('5. Bill of Quantities (BoQ) & Budget Optimization', 40, y);
      y += 18;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(
        '• Area Correction: Click [Adjust Area] on any surface to fine-tune detected square footage.\n' +
        '• Cost Formula: (Quantity × Material Rate) + (Quantity × Labor Rate) + Scaffolding + Contingency.\n' +
        '• AI Budget Mode: Enter a target budget (e.g. ₹5,00,000) and click "Optimize" to auto-balance finishes.\n' +
        '• Contractor Export: Download official PDF tender schedules or dispatch quotes via email.',
        40,
        y
      );
      y += 75;

      // Footer
      doc.setDrawColor(226, 232, 240);
      doc.line(40, y, 555, y);
      y += 15;
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text('FacadeAI Studio • User Manual & Operational Reference Guide • Page 1 of 1', 40, y);

      doc.save('FacadeAI_Homeowner_User_Manual.pdf');
    } catch (e) {
      console.log('[Manual Download] Fallback printing');
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto select-none print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[88vh] flex flex-col shadow-2xl border border-zinc-200 overflow-hidden print:max-h-none print:shadow-none print:border-none print:rounded-none animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-violet-200" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-900">FacadeAI User Manual & Guide</h3>
              <p className="text-[10px] text-zinc-500">Interactive Reference & Operations Guide</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? 'Generating...' : 'Download Manual (PDF)'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="p-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60 rounded-lg transition-colors"
              title="Print Manual"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex border-b border-zinc-200 bg-zinc-50/50 px-4 pt-2 gap-2 text-xs overflow-x-auto no-scrollbar print:hidden">
          <button
            onClick={() => setActiveSection('overview')}
            className={`pb-2 px-2 whitespace-nowrap transition-colors ${
              activeSection === 'overview' ? 'text-violet-700 font-bold border-b-2 border-violet-600' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            1. Quick Start
          </button>
          <button
            onClick={() => setActiveSection('photo')}
            className={`pb-2 px-2 whitespace-nowrap transition-colors ${
              activeSection === 'photo' ? 'text-violet-700 font-bold border-b-2 border-violet-600' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            2. Photo Guidelines
          </button>
          <button
            onClick={() => setActiveSection('dragdrop')}
            className={`pb-2 px-2 whitespace-nowrap transition-colors ${
              activeSection === 'dragdrop' ? 'text-violet-700 font-bold border-b-2 border-violet-600' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            3. Drag & Drop Materials
          </button>
          <button
            onClick={() => setActiveSection('cost')}
            className={`pb-2 px-2 whitespace-nowrap transition-colors ${
              activeSection === 'cost' ? 'text-violet-700 font-bold border-b-2 border-violet-600' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            4. Cost Schedule (BoQ)
          </button>
          <button
            onClick={() => setActiveSection('budget')}
            className={`pb-2 px-2 whitespace-nowrap transition-colors ${
              activeSection === 'budget' ? 'text-violet-700 font-bold border-b-2 border-violet-600' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            5. Budget Mode & Export
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-zinc-800 text-xs leading-relaxed">
          {activeSection === 'overview' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-zinc-900">Welcome to FacadeAI</h4>
              <p className="text-zinc-600">
                FacadeAI is an AI-powered residential exterior redesign and cost estimation tool designed for homeowners, builders, and architects. It transforms raw photos of residential houses into realistic renovation concepts with real-time contractor pricing.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <div className="flex items-center gap-2 font-bold text-zinc-900 mb-1">
                    <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-[10px]">1</span>
                    <span>Upload House Photo</span>
                  </div>
                  <p className="text-zinc-500 text-[11px]">
                    Drag and drop your home exterior or click "Try Demo House" to test instantly with a pre-configured villa.
                  </p>
                </div>

                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <div className="flex items-center gap-2 font-bold text-zinc-900 mb-1">
                    <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-[10px]">2</span>
                    <span>AI Surface Detection</span>
                  </div>
                  <p className="text-zinc-500 text-[11px]">
                    AI automatically maps editable zones (Main Walls, Pillars, Louvers, Windows, Balconies, and Parapets).
                  </p>
                </div>

                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <div className="flex items-center gap-2 font-bold text-zinc-900 mb-1">
                    <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-[10px]">3</span>
                    <span>Drag & Drop Finishes</span>
                  </div>
                  <p className="text-zinc-500 text-[11px]">
                    Drag Roman travertine, fluted teak louvers, or stucco paint directly onto target house surfaces.
                  </p>
                </div>

                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <div className="flex items-center gap-2 font-bold text-zinc-900 mb-1">
                    <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-[10px]">4</span>
                    <span>Instant Cost & Export</span>
                  </div>
                  <p className="text-zinc-500 text-[11px]">
                    Review contractor-grade pricing with materials, labor, scaffolding, and export tender PDFs.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'photo' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-zinc-900">How to Take & Upload the Best House Photo</h4>
              <p className="text-zinc-600">
                To achieve the most accurate surface segmentation and photorealistic elevation rendering, follow these architectural photography tips:
              </p>

              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5 p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-emerald-950">Straight-on, Eye-Level Angle</h5>
                    <p className="text-emerald-800 text-[11px] mt-0.5">
                      Stand opposite the house across the street so the walls are vertical and not distorted by extreme tilt.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-emerald-950">Clear Daylight Without Harsh Backlight</h5>
                    <p className="text-emerald-800 text-[11px] mt-0.5">
                      Capture when the sun illuminates the front facade. Avoid sunset silhouettes with the sun directly behind the roof.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-emerald-950">Minimal Foliage Obstruction</h5>
                    <p className="text-emerald-800 text-[11px] mt-0.5">
                      Ensure key structural corners, columns, and entrance doorways are clearly visible.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'dragdrop' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-zinc-900">Operating the Drag & Drop Material System</h4>
              <p className="text-zinc-600">
                FacadeAI makes material selection intuitive and visual:
              </p>

              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">1</div>
                  <div>
                    <h5 className="font-bold text-zinc-900">Grab a Material</h5>
                    <p className="text-zinc-500 text-[11px]">Click and hold any material card in the left library.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center font-bold text-xs">2</div>
                  <div>
                    <h5 className="font-bold text-zinc-900">Hover Over a Surface</h5>
                    <p className="text-zinc-500 text-[11px]">Move your cursor over the house. The target surface glows violet with an active badge.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">3</div>
                  <div>
                    <h5 className="font-bold text-zinc-900">Drop & Render</h5>
                    <p className="text-zinc-500 text-[11px]">Release the mouse. The finish is assigned, cost updates, and you can render the preview!</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'cost' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-zinc-900">Understanding Contractor Rates & BoQ</h4>
              <p className="text-zinc-600">
                Every calculation in FacadeAI is grounded in quantity surveyor formulas:
              </p>

              <div className="space-y-2">
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <span className="font-bold text-zinc-900 block mb-0.5">Item Cost Calculation:</span>
                  <code className="text-[11px] bg-white px-2 py-1 rounded border border-zinc-200 text-violet-700 block font-mono">
                    (Net Area + Wastage) × Material Rate + (Net Area × Labor Installation Rate)
                  </code>
                </div>

                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <span className="font-bold text-zinc-900 block mb-0.5">Scaffolding & Surface Preparation:</span>
                  <p className="text-zinc-500 text-[11px]">
                    Includes pressure washing old masonry, chasing hairline cracks, elastomeric priming, and safety scaffolding.
                  </p>
                </div>

                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <span className="font-bold text-zinc-900 block mb-0.5">Contingency Buffer:</span>
                  <p className="text-zinc-500 text-[11px]">
                    Configurable buffer (default 10%) protecting homeowners against hidden moisture damage or on-site cuts.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'budget' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-zinc-900">AI Budget Mode & Exporting Quotations</h4>
              <p className="text-zinc-600">
                FacadeAI bridges design and contractor tendering:
              </p>

              <div className="space-y-2.5">
                <div className="p-3 bg-violet-50/60 border border-violet-200 rounded-xl">
                  <h5 className="font-bold text-violet-950">AI Budget Optimization</h5>
                  <p className="text-violet-800 text-[11px] mt-0.5">
                    Enter your target budget (e.g. ₹5,00,000). The AI algorithm strategically retains premium stone/wood on entrance pillars while optimizing upper elevation finishes to keep you under budget.
                  </p>
                </div>

                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
                  <h5 className="font-bold text-zinc-900">Downloading Official Quotations</h5>
                  <p className="text-zinc-500 text-[11px] mt-0.5">
                    Click "Export" in the header to view or download a comprehensive contractor tender schedule with Before/After images and material quantities.
                  </p>
                </div>

                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
                  <h5 className="font-bold text-zinc-900">Emailing Quotations</h5>
                  <p className="text-zinc-500 text-[11px] mt-0.5">
                    Dispatch the quotation directly to your contractor or client with pre-filled scope notes and line-item pricing.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
