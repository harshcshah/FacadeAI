import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  Sparkles,
  Building2,
  CheckCircle2,
  Mail,
  Copy,
  Send,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { CostBreakdownSummary, CurrencyConfig, StructuralZone, Material } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  originalImageSrc: string;
  renovatedImageSrc: string | null;
  costSummary: CostBreakdownSummary;
  currency: CurrencyConfig;
  zones: StructuralZone[];
  materialsMap: Map<string, Material>;
  selectedStyle: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  projectName,
  originalImageSrc,
  renovatedImageSrc,
  costSummary,
  currency,
  zones,
  materialsMap,
  selectedStyle,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'email'>('preview');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Email form state
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('Contractor / Estimating Department');
  const [emailNotes, setEmailNotes] = useState(
    'Please review the attached exterior renovation schedule and quotation for tendering and material supply.'
  );
  const [emailSentStatus, setEmailSentStatus] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const totalAreaSqFt = zones.reduce((sum, z) => sum + z.netAreaSqFt, 0);

  // Direct PDF Generation & Download via jsPDF
  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });

      // Top Header Banner
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, 595, 75, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(255, 255, 255);
      doc.text('FacadeAI — Renovation Quotation', 40, 42);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(196, 181, 253);
      doc.text(`Project: ${projectName} • Style: ${selectedStyle}`, 40, 60);

      // Meta row
      let y = 105;
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Project Specification & Bill of Quantities', 40, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      const dateStr = new Date().toLocaleDateString(undefined, { dateStyle: 'long' });
      doc.text(`Date: ${dateStr} • Total Facade Area: ${totalAreaSqFt} sq ft • Currency: ${currency.code}`, 40, y + 14);

      // Financial Summary Box
      y += 35;
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.rect(40, y, 515, 55, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text('MATERIALS TOTAL', 55, y + 20);
      doc.text('LABOR INSTALL', 170, y + 20);
      doc.text('SCAFFOLD & PREP', 285, y + 20);
      doc.text('ESTIMATED TOTAL', 410, y + 20);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text(`${currency.symbol}${costSummary.materialTotal.toLocaleString()}`, 55, y + 40);
      doc.text(`${currency.symbol}${costSummary.laborTotal.toLocaleString()}`, 170, y + 40);
      doc.text(`${currency.symbol}${costSummary.sitePreparationAndScaffolding.toLocaleString()}`, 285, y + 40);

      doc.setTextColor(109, 40, 217); // violet-700
      doc.setFontSize(13);
      doc.text(`${currency.symbol}${costSummary.grandTotal.toLocaleString()}`, 410, y + 40);

      // Itemized Table Header
      y += 80;
      doc.setFillColor(241, 245, 249);
      doc.rect(40, y, 515, 20, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      doc.text('SURFACE / AREA', 48, y + 14);
      doc.text('MATERIAL', 180, y + 14);
      doc.text('NET AREA', 320, y + 14);
      doc.text('MAT RATE', 385, y + 14);
      doc.text('LABOR', 440, y + 14);
      doc.text('TOTAL', 495, y + 14);

      y += 20;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);

      // Table Rows
      costSummary.items.forEach((item, index) => {
        if (y > 740) {
          doc.addPage();
          y = 50;
        }

        const isEven = index % 2 === 0;
        if (isEven) {
          doc.setFillColor(255, 255, 255);
        } else {
          doc.setFillColor(248, 250, 252);
        }
        doc.rect(40, y, 515, 18, 'F');

        const zoneTitle = item.zoneName.length > 24 ? item.zoneName.slice(0, 22) + '...' : item.zoneName;
        const matTitle = item.material.name.split('(')[0].trim();
        const shortMat = matTitle.length > 22 ? matTitle.slice(0, 20) + '...' : matTitle;

        doc.text(zoneTitle, 48, y + 13);
        doc.text(shortMat, 180, y + 13);
        doc.text(`${item.netAreaSqFt} sq ft`, 320, y + 13);
        doc.text(`${currency.symbol}${item.materialRate}`, 385, y + 13);
        doc.text(`${currency.symbol}${item.laborTotalCost.toLocaleString()}`, 440, y + 13);
        doc.setFont('helvetica', 'bold');
        doc.text(`${currency.symbol}${item.itemTotalCost.toLocaleString()}`, 495, y + 13);
        doc.setFont('helvetica', 'normal');

        y += 18;
      });

      // Contingency & Scaffolding Breakdown
      y += 15;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text(
        `Includes ${costSummary.contingencyPercent}% contingency (${currency.symbol}${costSummary.contingencyAmount.toLocaleString()}) and site surface preparation/safety scaffolding.`,
        40,
        y
      );

      // Disclaimer
      y += 35;
      doc.setDrawColor(226, 232, 240);
      doc.line(40, y, 555, y);
      y += 15;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('DISCLAIMER & TENDER NOTICE:', 40, y);
      y += 12;
      doc.setFont('helvetica', 'normal');
      doc.text(
        'Cost estimates are indicative and may vary based on location, supplier pricing, site conditions and actual on-site measurements.\n' +
        'Prepared by FacadeAI Studio for architectural planning and contractor tendering.',
        40,
        y
      );

      const safeFilename = `FacadeAI_Quotation_${projectName.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
      doc.save(safeFilename);
    } catch (err) {
      console.log('[PDF Export] Using print fallback');
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Build plain-text quotation for email / clipboard
  const generateQuotationText = () => {
    let text = `=========================================\n`;
    text += `FACADEAI RENOVATION QUOTATION\n`;
    text += `Project: ${projectName}\n`;
    text += `Date: ${new Date().toLocaleDateString()}\n`;
    text += `Style: ${selectedStyle} | Total Facade: ${totalAreaSqFt} sq ft\n`;
    text += `=========================================\n\n`;
    text += `ESTIMATED TOTAL: ${currency.symbol}${costSummary.grandTotal.toLocaleString()} ${currency.code}\n`;
    text += `• Materials Total: ${currency.symbol}${costSummary.materialTotal.toLocaleString()}\n`;
    text += `• Labor Installation: ${currency.symbol}${costSummary.laborTotal.toLocaleString()}\n`;
    text += `• Scaffolding & Prep: ${currency.symbol}${costSummary.sitePreparationAndScaffolding.toLocaleString()}\n`;
    text += `• Contingency Buffer (${costSummary.contingencyPercent}%): ${currency.symbol}${costSummary.contingencyAmount.toLocaleString()}\n\n`;
    text += `DETAILED BILL OF QUANTITIES:\n`;
    costSummary.items.forEach((item) => {
      text += `- ${item.zoneName}: ${item.material.name.split('(')[0]} | ${item.netAreaSqFt} sq ft | Cost: ${currency.symbol}${item.itemTotalCost.toLocaleString()}\n`;
    });
    text += `\nDisclaimer: Cost estimates are indicative and subject to site measurement and supplier pricing.\n`;
    text += `Generated with FacadeAI Studio.`;
    return text;
  };

  const handleSendEmail = () => {
    if (!recipientEmail.trim()) {
      alert('Please enter a recipient email address.');
      return;
    }

    const subject = encodeURIComponent(`FacadeAI Renovation Quotation: ${projectName}`);
    const body = encodeURIComponent(
      `Hello ${recipientName},\n\n${emailNotes}\n\n${generateQuotationText()}`
    );

    // Trigger user's mail client via mailto
    window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;

    setEmailSentStatus(`Quotation link and email draft opened for ${recipientEmail}.`);
    setTimeout(() => {
      setEmailSentStatus(null);
    }, 5000);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(generateQuotationText()).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto select-none print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-zinc-200 overflow-hidden print:max-h-none print:shadow-none print:border-none print:rounded-none">
        {/* Top Header Bar */}
        <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50 print:hidden">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-violet-600" />
            <h3 className="text-sm font-bold text-zinc-900">Quotation & Contractor Tender Schedule</h3>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle: Preview vs Email */}
            <div className="flex bg-zinc-200/70 p-1 rounded-xl text-xs font-semibold mr-2">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  activeTab === 'preview' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Schedule Preview
              </button>
              <button
                onClick={() => setActiveTab('email')}
                className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'email' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-violet-600" />
                <span>Email Quote</span>
              </button>
            </div>

            {/* Direct PDF Download Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              title="Download Quotation PDF Document directly"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
            </button>

            {/* Print / Save PDF via System Print */}
            <button
              onClick={() => window.print()}
              className="px-2.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Print or Save via Browser Print Dialog"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* --- TAB 1: SCHEDULE PREVIEW --- */}
        {activeTab === 'preview' && (
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-zinc-900 print:overflow-visible print:p-4">
            {/* Document Title Banner */}
            <div className="flex items-start justify-between border-b pb-4 border-zinc-200">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-violet-700">
                  FacadeAI Exterior Report
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-zinc-900 mt-0.5">{projectName}</h1>
                <p className="text-xs text-zinc-500 mt-1">
                  Design Style: <span className="font-semibold text-zinc-800">{selectedStyle}</span> • Facade Area:{' '}
                  <span className="font-semibold text-zinc-800">{totalAreaSqFt} sq ft</span>
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-zinc-500 block">Date Generated</span>
                <span className="text-xs font-semibold text-zinc-900">
                  {new Date().toLocaleDateString(undefined, { dateStyle: 'medium' })}
                </span>
              </div>
            </div>

            {/* Visual Comparison: Original vs Renovation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                  Original Existing Elevation
                </span>
                <div className="rounded-xl overflow-hidden border border-zinc-200 h-48 bg-zinc-100 flex items-center justify-center">
                  <img src={originalImageSrc} alt="Original House" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-violet-700 uppercase tracking-wider block flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-violet-600" />
                  AI Renovation Vision
                </span>
                <div className="rounded-xl overflow-hidden border border-zinc-200 h-48 bg-zinc-100 flex items-center justify-center">
                  <img
                    src={renovatedImageSrc || originalImageSrc}
                    alt="AI Redesigned House"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Bill of Quantities Schedule Table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                  Detected Areas & Material Schedule
                </h3>
                <button
                  onClick={handleCopyText}
                  className="text-xs text-violet-700 hover:text-violet-800 font-semibold flex items-center gap-1 cursor-pointer print:hidden"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedLink ? 'Copied Schedule!' : 'Copy Summary'}</span>
                </button>
              </div>

              <div className="border border-zinc-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Surface / Area</th>
                      <th className="py-2.5 px-3">Assigned Material</th>
                      <th className="py-2.5 px-3 text-right">Net Area</th>
                      <th className="py-2.5 px-3 text-right">Rate / sq ft</th>
                      <th className="py-2.5 px-3 text-right">Material</th>
                      <th className="py-2.5 px-3 text-right">Labor</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {costSummary.items.map((item) => (
                      <tr key={item.zoneId} className="hover:bg-zinc-50/50">
                        <td className="py-2 px-3 font-semibold text-zinc-900">{item.zoneName}</td>
                        <td className="py-2 px-3 text-zinc-700">{item.material.name.split('(')[0]}</td>
                        <td className="py-2 px-3 text-right text-zinc-600">{item.netAreaSqFt} sq ft</td>
                        <td className="py-2 px-3 text-right text-zinc-600">
                          {currency.symbol}
                          {item.materialRate}
                        </td>
                        <td className="py-2 px-3 text-right text-zinc-700">
                          {currency.symbol}
                          {item.materialTotalCost.toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-right text-zinc-700">
                          {currency.symbol}
                          {item.laborTotalCost.toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-zinc-900">
                          {currency.symbol}
                          {item.itemTotalCost.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <span className="text-[11px] text-zinc-500 block">Materials Total</span>
                <span className="text-sm font-bold text-zinc-900">
                  {currency.symbol}
                  {costSummary.materialTotal.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-zinc-500 block">Labor & Install</span>
                <span className="text-sm font-bold text-zinc-900">
                  {currency.symbol}
                  {costSummary.laborTotal.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-zinc-500 block">Scaffolding & Prep</span>
                <span className="text-sm font-bold text-zinc-900">
                  {currency.symbol}
                  {costSummary.sitePreparationAndScaffolding.toLocaleString()}
                </span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-zinc-200">
                <span className="text-[11px] text-violet-700 font-bold block">Estimated Total</span>
                <span className="text-base font-extrabold text-violet-900">
                  {currency.symbol}
                  {costSummary.grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="text-[11px] text-zinc-500 border-t border-zinc-200 pt-3 leading-relaxed">
              <span className="font-semibold text-zinc-700">Disclaimer: </span>
              Cost estimates are indicative and may vary based on location, supplier pricing, site conditions,
              scaffolding logistics, and actual on-site measurements. This schedule is prepared for planning and
              contractor tendering purposes.
            </div>
          </div>
        )}

        {/* --- TAB 2: EMAIL QUOTATION --- */}
        {activeTab === 'email' && (
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5 text-zinc-900">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-violet-700">
                Contractor Tendering & Dispatch
              </span>
              <h2 className="text-xl font-bold text-zinc-900 mt-0.5">Email Renovation Quotation</h2>
              <p className="text-xs text-zinc-600 mt-1">
                Dispatch this specification and cost schedule directly to your general contractor, quantity surveyor,
                or co-owners.
              </p>
            </div>

            {emailSentStatus && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{emailSentStatus}</span>
              </div>
            )}

            <div className="space-y-4 max-w-xl">
              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">
                  Recipient Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="contractor@buildfirm.com or client@gmail.com"
                  className="w-full text-xs bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">Recipient Name / Company</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Apex Renovations Pvt Ltd"
                  className="w-full text-xs bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">Custom Message / Scope Notes</label>
                <textarea
                  rows={3}
                  value={emailNotes}
                  onChange={(e) => setEmailNotes(e.target.value)}
                  className="w-full text-xs bg-zinc-50 border border-zinc-300 rounded-xl p-3 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:bg-white"
                />
              </div>

              {/* Quotation Summary Preview in Box */}
              <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 text-xs space-y-1.5">
                <div className="flex justify-between font-semibold text-zinc-800">
                  <span>Attached Schedule:</span>
                  <span className="text-violet-700">
                    {currency.symbol}
                    {costSummary.grandTotal.toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500">
                  {zones.length} detected exterior zones • {totalAreaSqFt} sq ft total facade envelope.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleSendEmail}
                  className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Quotation Email</span>
                </button>

                <button
                  onClick={handleCopyText}
                  className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Copied to Clipboard!' : 'Copy Formatted Quote'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
