import React from 'react';
import { MedicineCatalogItem, MedicineBatch } from '../../types';
import { useClinic } from '../../context/ClinicContext';
import { generateBarcodeSvg } from '../../utils/barcodeUtils';
import { X, Printer, Check, Copy } from 'lucide-react';

interface BarcodeLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  batch?: MedicineBatch | null;
  medicine?: MedicineCatalogItem | null;
}

export const BarcodeLabelModal: React.FC<BarcodeLabelModalProps> = ({
  isOpen,
  onClose,
  batch,
  medicine,
}) => {
  const { settings, language } = useClinic();
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || (!batch && !medicine)) return null;

  const brandName = batch?.brandName || medicine?.brandName || '';
  const genericName = batch?.genericName || medicine?.genericName || '';
  const lotNumber = batch?.lotNumber || 'N/A';
  const expiryDate = batch?.expiryDate || 'N/A';
  const barcodeValue = batch?.lotNumber || batch?.barcode || medicine?.barcode || medicine?.id || 'MED-01';

  const svgContent = generateBarcodeSvg(barcodeValue, {
    width: 280,
    height: 75,
    displayValue: true,
  });

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=450,height=400');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Label - ${brandName}</title>
          <style>
            @page {
              size: 70mm 45mm;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 6mm;
              font-family: system-ui, -apple-system, sans-serif;
              color: #0f172a;
              background: #ffffff;
            }
            .label-card {
              border: 1px dashed #64748b;
              padding: 4mm;
              border-radius: 4px;
              text-align: center;
            }
            .clinic-name {
              font-size: 9pt;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              color: #475569;
            }
            .brand {
              font-size: 13pt;
              font-weight: 800;
              margin: 2px 0 0 0;
            }
            .generic {
              font-size: 8pt;
              color: #475569;
              font-style: italic;
            }
            .meta {
              font-size: 8pt;
              font-family: monospace;
              margin: 4px 0;
              display: flex;
              justify-content: space-between;
              padding: 0 4px;
            }
            .barcode-svg {
              margin: 4px auto 0 auto;
              max-width: 100%;
            }
          </style>
        </head>
        <body>
          <div class="label-card">
            <div class="clinic-name">${settings.name}</div>
            <div class="brand">${brandName}</div>
            <div class="generic">${genericName}</div>
            <div class="meta">
              <span>LOT: ${lotNumber}</span>
              <span>EXP: ${expiryDate}</span>
            </div>
            <div class="barcode-svg">
              ${svgContent}
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(barcodeValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              {language === 'bn' ? 'ডিসপেনসারি বারকোড স্টিকার' : 'Dispensary Barcode Sticker'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'bn' ? 'শেলফ বিন বা মেডিসিন বক্সের জন্য লেবেল' : 'Shelf bin & box thermal label format'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Realistic Thermal Sticker Preview */}
        <div className="mt-4 p-4 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 flex flex-col items-center text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {settings.name}
          </span>
          <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
            {brandName}
          </h4>
          <p className="text-[11px] text-slate-500 italic">
            {genericName}
          </p>

          <div className="w-full flex items-center justify-between px-2 text-[11px] font-mono font-semibold text-slate-700 mt-2 pt-2 border-t border-slate-200">
            <span>LOT: {lotNumber}</span>
            <span>EXP: {expiryDate}</span>
          </div>

          {/* Rendered SVG Barcode */}
          <div
            className="mt-3 flex justify-center w-full overflow-hidden"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />

          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-xs font-mono font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
              {barcodeValue}
            </span>
            <button
              onClick={handleCopyCode}
              className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
              title="Copy barcode value"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>{language === 'bn' ? 'লেবেল প্রিন্ট করুন' : 'Print Sticker Label'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
