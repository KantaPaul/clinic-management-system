import React, { useState, useEffect, useRef } from 'react';
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';
import { useClinic } from '../../context/ClinicContext';
import { MedicineCatalogItem, MedicineBatch, Prescription } from '../../types';
import { playScannerSound, generateBarcodeSvg, ParsedBarcode } from '../../utils/barcodeUtils';
import {
  X,
  Camera,
  Search,
  ScanLine,
  Pill,
  Layers,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  PackagePlus,
  Sliders,
  ShieldAlert,
  ArrowRight,
  Flashlight,
  Printer,
  Sparkles,
  RefreshCw,
  Barcode,
  RotateCcw,
} from 'lucide-react';
import { BarcodeLabelModal } from './BarcodeLabelModal';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchDispense?: (prescription?: Prescription, medicine?: MedicineCatalogItem, batch?: MedicineBatch) => void;
  initialQuery?: string;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onLaunchDispense,
  initialQuery = '',
}) => {
  const {
    medicines,
    batches,
    prescriptions,
    patients,
    settings,
    language,
    adjustBatchStock,
    quickRestockBatch,
    toggleBatchQuarantine,
    findInventoryByBarcode,
  } = useClinic();

  const [scanMode, setScanMode] = useState<'camera' | 'manual'>('camera');
  const [manualCode, setManualCode] = useState(initialQuery);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
  const [torchActive, setTorchActive] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);

  // Scanned item results state
  const [scannedResult, setScannedResult] = useState<{
    medicine?: MedicineCatalogItem;
    batch?: MedicineBatch;
    matchingBatches: MedicineBatch[];
    prescription?: Prescription;
    parsed: ParsedBarcode;
  } | null>(null);

  const [hasSearched, setHasSearched] = useState(false);
  const [showLabelModal, setShowLabelModal] = useState(false);

  // Stock Adjustment form state
  const [adjustQty, setAdjustQty] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState('Routine Physical Cycle Count');
  const [adjustSuccessMsg, setAdjustSuccessMsg] = useState<string | null>(null);

  // Quick Restock form state
  const [restockUnits, setRestockUnits] = useState<number>(10);
  const [restockNote, setRestockNote] = useState('');
  const [activeActionTab, setActiveActionTab] = useState<'inspect' | 'adjust' | 'restock'>('inspect');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const manualInputRef = useRef<HTMLInputElement | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  // Initialize camera list
  useEffect(() => {
    if (!isOpen) return;

    if (!readerRef.current) {
      readerRef.current = new BrowserMultiFormatReader();
    }

    BrowserMultiFormatReader.listVideoInputDevices()
      .then(devices => {
        setVideoDevices(devices);
        if (devices.length > 0) {
          // Default to back/environment camera if available
          const backCam = devices.find(d => /back|rear|environment/i.test(d.label));
          setSelectedDeviceId(backCam ? backCam.deviceId : devices[0].deviceId);
        }
      })
      .catch(() => {
        // Fallback to manual mode if camera enumeration fails
        setScanMode('manual');
      });

    if (initialQuery) {
      performLookup(initialQuery);
    }
  }, [isOpen]);

  // Start / stop camera decoding stream
  useEffect(() => {
    if (!isOpen || scanMode !== 'camera' || !videoRef.current) {
      stopCamera();
      return;
    }

    let isCancelled = false;
    setCameraError(null);

    const startCamera = async () => {
      try {
        stopCamera();

        if (!readerRef.current) {
          readerRef.current = new BrowserMultiFormatReader();
        }

        const controls = await readerRef.current.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current!,
          (result, error) => {
            if (isCancelled) return;
            if (result) {
              const text = result.getText();
              handleScannedValue(text);
            }
          }
        );

        if (!isCancelled) {
          controlsRef.current = controls;

          // Check torch capability
          try {
            const stream = videoRef.current?.srcObject as MediaStream | null;
            const track = stream?.getVideoTracks()[0];
            const capabilities = track?.getCapabilities?.() as { torch?: boolean } | undefined;
            setTorchSupported(!!capabilities?.torch);
          } catch {
            setTorchSupported(false);
          }
        } else {
          controls.stop();
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          const message = err instanceof Error ? err.message : 'Camera access error';
          setCameraError(message);
          setScanMode('manual');
        }
      }
    };

    startCamera();

    return () => {
      isCancelled = true;
      stopCamera();
    };
  }, [isOpen, scanMode, selectedDeviceId]);

  const stopCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setTorchActive(false);
  };

  const toggleTorch = async () => {
    try {
      const stream = videoRef.current?.srcObject as MediaStream | null;
      const track = stream?.getVideoTracks()[0];
      if (track && 'applyConstraints' in track) {
        const nextTorch = !torchActive;
        await track.applyConstraints({
          advanced: [{ torch: nextTorch } as MediaTrackConstraintSet],
        });
        setTorchActive(nextTorch);
      }
    } catch {
      // Ignore torch error
    }
  };

  const handleScannedValue = (text: string) => {
    if (!text) return;
    playScannerSound('success');
    if (navigator.vibrate) {
      navigator.vibrate([40, 30, 40]);
    }
    setManualCode(text);
    performLookup(text);
  };

  const performLookup = (query: string) => {
    setHasSearched(true);
    setAdjustSuccessMsg(null);
    const result = findInventoryByBarcode(query);

    setScannedResult(result);

    if (result.batch) {
      setAdjustQty(result.batch.currentQuantity);
    } else if (result.medicine) {
      // Find default FEFO batch or first batch
      const b = result.matchingBatches[0];
      if (b) setAdjustQty(b.currentQuantity);
    }

    if (!result.medicine && !result.batch && !result.prescription) {
      playScannerSound('warning');
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    performLookup(manualCode.trim());
  };

  const handleApplyAdjustment = () => {
    const targetBatch = scannedResult?.batch || scannedResult?.matchingBatches[0];
    if (!targetBatch) return;

    adjustBatchStock(targetBatch.id, adjustQty, adjustReason);
    setAdjustSuccessMsg(
      `${targetBatch.brandName} (${targetBatch.lotNumber}) stock updated to ${adjustQty} base units.`
    );
    playScannerSound('success');

    // Refresh scanned result view
    const refreshed = findInventoryByBarcode(targetBatch.lotNumber);
    setScannedResult(refreshed);
    setTimeout(() => setAdjustSuccessMsg(null), 4000);
  };

  const handleApplyQuickRestock = () => {
    const targetBatch = scannedResult?.batch || scannedResult?.matchingBatches[0];
    if (!targetBatch || restockUnits <= 0) return;

    quickRestockBatch(targetBatch.id, restockUnits, restockNote);
    setAdjustSuccessMsg(
      `Received +${restockUnits} units into ${targetBatch.brandName} (${targetBatch.lotNumber}).`
    );
    playScannerSound('success');

    // Refresh scanned result view
    const refreshed = findInventoryByBarcode(targetBatch.lotNumber);
    setScannedResult(refreshed);
    setRestockNote('');
    setTimeout(() => setAdjustSuccessMsg(null), 4000);
  };

  const handleToggleQuarantine = () => {
    const targetBatch = scannedResult?.batch || scannedResult?.matchingBatches[0];
    if (!targetBatch) return;

    toggleBatchQuarantine(targetBatch.id, 'Toggled from Barcode Scanner Station');
    playScannerSound('warning');

    const refreshed = findInventoryByBarcode(targetBatch.lotNumber);
    setScannedResult(refreshed);
  };

  if (!isOpen) return null;

  const currentBatch = scannedResult?.batch || scannedResult?.matchingBatches[0];
  const currentMed = scannedResult?.medicine;
  const currentRx = scannedResult?.prescription;
  const isExpired = currentBatch ? currentBatch.status === 'expired' || currentBatch.expiryDate < todayStr : false;
  const isNearExpiry = currentBatch?.status === 'near_expiry';
  const isQuarantined = currentBatch?.status === 'quarantined' || currentBatch?.status === 'blocked';
  const unitsPerPack = currentMed?.unitsPerPack || 10;
  const currentPacks = currentBatch ? Math.floor(currentBatch.currentQuantity / unitsPerPack) : 0;
  const currentLoose = currentBatch ? currentBatch.currentQuantity % unitsPerPack : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300">
              <ScanLine className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg">
                  {language === 'bn' ? 'ডিসপেনসারি বারকোড স্ক্যানার' : 'Dispensary Barcode Station'}
                </h3>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  USB Wedge & Camera Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {language === 'bn'
                  ? 'ক্যামেরা বা ইউএসবি স্ক্যানার দিয়ে দ্রুত ইনভেন্টরি যাচাই ও স্টক আপডেট করুন'
                  : 'Fast shelf inventory lookup, lot batch inspection, and instant stock reconciliation'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector & Search Input Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 shrink-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Camera / Manual Switch */}
            <div className="flex items-center p-1 bg-slate-200 rounded-xl self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setScanMode('camera')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  scanMode === 'camera'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'লাইভ ক্যামেরা' : 'Live Camera'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  setScanMode('manual');
                  setTimeout(() => manualInputRef.current?.focus(), 100);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  scanMode === 'manual'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Barcode className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'ম্যানুয়াল / গান ইনপুট' : 'Manual / Scanner Gun'}</span>
              </button>
            </div>

            {/* Manual Code Input Form */}
            <form onSubmit={handleManualSubmit} className="flex-1 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  ref={manualInputRef}
                  type="text"
                  placeholder={language === 'bn' ? 'বারকোড বা লট নম্বর লিখুন (উদাঃ LOT-BX-9021, 894110023451)...' : 'Type or scan barcode/lot (e.g. LOT-BX-9021, 894110023451, RX-2026-0104)...'}
                  value={manualCode}
                  onChange={e => setManualCode(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 text-xs font-mono bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-xs"
                />
                {manualCode && (
                  <button
                    type="button"
                    onClick={() => {
                      setManualCode('');
                      setScannedResult(null);
                      setHasSearched(false);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'খুঁজুন' : 'Lookup'}</span>
              </button>
            </form>
          </div>

          {/* Quick Barcode Simulator / Fast-Test Chips */}
          <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center gap-1.5 overflow-x-auto text-[11px] pb-1">
            <span className="text-slate-500 font-medium shrink-0 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>{language === 'bn' ? 'নমুনা বারকোড:' : 'Test Barcodes:'}</span>
            </span>
            <button
              type="button"
              onClick={() => handleScannedValue('894110023451')}
              className="px-2 py-0.5 rounded-md bg-white border border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-slate-700 font-mono transition-colors shrink-0"
            >
              Napa (894110023451)
            </button>
            <button
              type="button"
              onClick={() => handleScannedValue('894110023452')}
              className="px-2 py-0.5 rounded-md bg-white border border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-slate-700 font-mono transition-colors shrink-0"
            >
              Sergel (894110023452)
            </button>
            <button
              type="button"
              onClick={() => handleScannedValue('LOT-BX-9021')}
              className="px-2 py-0.5 rounded-md bg-white border border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-slate-700 font-mono transition-colors shrink-0"
            >
              Lot: LOT-BX-9021
            </button>
            <button
              type="button"
              onClick={() => handleScannedValue('LOT-SQ-4102')}
              className="px-2 py-0.5 rounded-md bg-white border border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-slate-700 font-mono transition-colors shrink-0"
            >
              Lot: LOT-SQ-4102
            </button>
            <button
              type="button"
              onClick={() => handleScannedValue('LOT-HC-6510')}
              className="px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-800 font-mono transition-colors shrink-0"
            >
              Expired Lot: LOT-HC-6510
            </button>
            <button
              type="button"
              onClick={() => handleScannedValue('RX-2026-0104')}
              className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-800 font-mono transition-colors shrink-0"
            >
              Rx QR: RX-2026-0104
            </button>
          </div>
        </div>

        {/* Modal Body: Two column layout (Camera / Result HUD) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Camera Viewfinder / Scanner Controls */}
          <div className={`${scannedResult ? 'lg:col-span-5' : 'lg:col-span-12'} flex flex-col gap-4`}>
            {scanMode === 'camera' ? (
              <div className="relative rounded-2xl bg-black overflow-hidden border border-slate-800 aspect-4/3 sm:aspect-16/10 flex items-center justify-center shadow-inner">
                {/* Real Video Element for Camera Feed */}
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                  autoPlay
                />

                {/* Animated Targeting Reticle & Laser Sweep */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="relative w-64 h-48 border-2 border-purple-500/80 rounded-2xl shadow-[0_0_15px_rgba(168,85,247,0.35)] overflow-hidden">
                    {/* Corner Reticle Accents */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-purple-400"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-purple-400"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-purple-400"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-purple-400"></div>

                    {/* Animated Scanning Laser Line */}
                    <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_8px_#ef4444] animate-bounce"></div>
                  </div>
                </div>

                {/* Camera Overlay Toolbar */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
                  {videoDevices.length > 1 && (
                    <select
                      value={selectedDeviceId}
                      onChange={e => setSelectedDeviceId(e.target.value)}
                      className="px-2 py-1 text-[11px] rounded-lg bg-black/60 text-white border border-white/20 backdrop-blur-xs font-medium focus:outline-none"
                    >
                      {videoDevices.map(d => (
                        <option key={d.deviceId} value={d.deviceId} className="bg-slate-900 text-white">
                          {d.label || `Camera ${d.deviceId.slice(0, 4)}`}
                        </option>
                      ))}
                    </select>
                  )}

                  {torchSupported && (
                    <button
                      type="button"
                      onClick={toggleTorch}
                      className={`p-1.5 rounded-lg text-xs backdrop-blur-xs transition-colors ml-auto ${
                        torchActive ? 'bg-amber-400 text-slate-950' : 'bg-black/60 text-white hover:bg-black/80'
                      }`}
                      title="Toggle Torch / Flashlight"
                    >
                      <Flashlight className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="absolute bottom-3 inset-x-3 text-center pointer-events-none">
                  <span className="inline-block px-3 py-1 rounded-full bg-black/70 text-slate-300 text-[11px] font-medium backdrop-blur-xs border border-white/10">
                    Align medicine barcode or blister strip inside reticle
                  </span>
                </div>
              </div>
            ) : (
              /* Manual / Scanner Gun Placeholder */
              <div className="p-8 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-xs mb-3">
                  <Barcode className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">
                  {language === 'bn' ? 'ইউএসবি স্ক্যানার গান বা ম্যানুয়াল ইনপুট প্রস্তুত' : 'Hardware Scanner Gun Listening'}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  {language === 'bn'
                    ? 'হাতে থাকা বারকোড স্ক্যানার গান দিয়ে বক্সে স্ক্যান করুন, এটি স্বয়ংক্রিয়ভাবে শনাক্ত হবে।'
                    : 'Pull the trigger on your physical handheld USB/Bluetooth barcode scanner or type any SKU/lot in the box above.'}
                </p>
                <button
                  type="button"
                  onClick={() => manualInputRef.current?.focus()}
                  className="mt-4 px-4 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Focus Input Field
                </button>
              </div>
            )}

            {cameraError && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Camera note:</span> {cameraError}. Use manual input or the test buttons above.
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Scanned Item Details & Rapid Stock Update HUD */}
          {scannedResult ? (
            <div className="lg:col-span-7 space-y-4">
              {adjustSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{adjustSuccessMsg}</span>
                </div>
              )}

              {/* Prescription Result HUD */}
              {currentRx ? (
                <div className="p-5 bg-white rounded-2xl border border-blue-200 shadow-sm space-y-4">
                  <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        Prescription QR Detected
                      </span>
                      <h4 className="text-lg font-bold text-slate-900 mt-1">
                        {currentRx.id}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Date: {currentRx.date} • {currentRx.medicines.length} medicines prescribed
                      </p>
                    </div>
                    {onLaunchDispense && (
                      <button
                        onClick={() => {
                          onClose();
                          onLaunchDispense(currentRx);
                        }}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Pill className="w-4 h-4" />
                        <span>Dispense Prescription</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Prescribed Medicines & FEFO Match:
                    </span>
                    {currentRx.medicines.map((m, idx) => {
                      const shelfBatches = batches.filter(
                        b => b.medicineId === m.medicineId && b.status === 'active' && b.currentQuantity > 0
                      );
                      const totalAvailable = shelfBatches.reduce((sum, b) => sum + b.currentQuantity, 0);

                      return (
                        <div
                          key={idx}
                          className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-900">{m.brandName}</span>
                            <span className="text-slate-500 ml-1.5">({m.genericName} {m.strength})</span>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {m.dosageSchedule} • {m.duration}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-mono font-bold text-slate-800">
                              {totalAvailable} units available
                            </span>
                            <div className="text-[10px] text-slate-400">
                              {shelfBatches.length} active lots
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : currentMed || currentBatch ? (
                /* Medicine & Shelf Batch Result HUD */
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  {/* Hero Item Header */}
                  <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-50 via-slate-50 to-white border-b border-slate-200">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                            {currentMed?.dosageForm || 'Medicine'}
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {currentMed?.category || 'Pharmaceutical'}
                          </span>
                          {currentBatch && (
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded font-mono ${
                                isExpired
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                  : isQuarantined
                                  ? 'bg-slate-800 text-white'
                                  : isNearExpiry
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              }`}
                            >
                              {isExpired
                                ? 'EXPIRED (LOCKED)'
                                : isQuarantined
                                ? 'QUARANTINED'
                                : isNearExpiry
                                ? 'NEAR EXPIRY'
                                : 'ACTIVE (FEFO)'}
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                          {currentMed?.brandName || currentBatch?.brandName}
                          <span className="text-slate-500 font-normal text-base ml-2">
                            {currentMed?.strength}
                          </span>
                        </h3>
                        <p className="text-xs text-slate-600 italic">
                          {currentMed?.genericName || currentBatch?.genericName} • {currentMed?.manufacturer}
                        </p>
                      </div>

                      {/* Barcode & Print Action */}
                      <div className="flex items-center gap-2 self-start">
                        <button
                          type="button"
                          onClick={() => setShowLabelModal(true)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                          title="View / Print Barcode Label"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Label</span>
                        </button>
                      </div>
                    </div>

                    {/* Stock & Batch Overview Pill Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-200/80">
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                          Current Stock
                        </span>
                        <span className="text-base font-bold font-mono text-purple-700">
                          {currentBatch?.currentQuantity ?? 0} <span className="text-xs text-slate-500 font-normal">u</span>
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          ~{currentPacks} str + {currentLoose} tab
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                          Lot / Batch #
                        </span>
                        <span className="text-xs font-bold font-mono text-slate-800 block truncate">
                          {currentBatch?.lotNumber || 'N/A'}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          via {currentBatch?.goodsReceiptId || 'GRN'}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                          Expiry Date (FEFO)
                        </span>
                        <span
                          className={`text-xs font-bold font-mono block ${
                            isExpired ? 'text-rose-600' : isNearExpiry ? 'text-amber-600' : 'text-slate-800'
                          }`}
                        >
                          {currentBatch?.expiryDate || 'N/A'}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          Mfg: {currentBatch?.manufacturingDate || 'N/A'}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                          Retail Unit Price
                        </span>
                        <span className="text-xs font-bold font-mono text-emerald-700 block">
                          {settings.currencySymbol}
                          {currentBatch?.retailPricePerBaseUnit?.toFixed(2) || '0.00'}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          Cost: {settings.currencySymbol}{currentBatch?.costPerBaseUnit?.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Tabs: [Inspect & Sibling Lots] | [Quick Adjust Stock] | [Quick Restock] */}
                  <div className="border-b border-slate-200 bg-slate-50 px-4 flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveActionTab('inspect')}
                      className={`py-3 px-3 font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                        activeActionTab === 'inspect'
                          ? 'border-purple-600 text-purple-700 bg-white'
                          : 'border-transparent text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Shelf Batches ({scannedResult.matchingBatches.length})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveActionTab('adjust')}
                      className={`py-3 px-3 font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                        activeActionTab === 'adjust'
                          ? 'border-purple-600 text-purple-700 bg-white'
                          : 'border-transparent text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Stock Adjustment (+/-)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveActionTab('restock')}
                      className={`py-3 px-3 font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                        activeActionTab === 'restock'
                          ? 'border-purple-600 text-purple-700 bg-white'
                          : 'border-transparent text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <PackagePlus className="w-3.5 h-3.5" />
                      <span>Quick Restock (Intake)</span>
                    </button>
                  </div>

                  {/* SUB-PANEL 1: Shelf Batches & FEFO Ledger */}
                  {activeActionTab === 'inspect' && (
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                          All Registered Shelf Batches for this Medicine:
                        </span>
                        {currentBatch && (
                          <button
                            type="button"
                            onClick={handleToggleQuarantine}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1 ${
                              isQuarantined
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                            <span>{isQuarantined ? 'Release Quarantine' : 'Quarantine Batch'}</span>
                          </button>
                        )}
                      </div>

                      <div className="space-y-2 max-h-52 overflow-y-auto">
                        {scannedResult.matchingBatches.map((b, idx) => {
                          const bExpired = b.status === 'expired' || b.expiryDate < todayStr;
                          const isSelected = currentBatch?.id === b.id;

                          return (
                            <div
                              key={b.id}
                              onClick={() => {
                                setScannedResult(prev => prev ? { ...prev, batch: b } : null);
                                setAdjustQty(b.currentQuantity);
                              }}
                              className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                                isSelected
                                  ? 'bg-purple-50/70 border-purple-400 shadow-xs'
                                  : 'bg-white border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-slate-900">
                                    {b.lotNumber}
                                  </span>
                                  {idx === 0 && !bExpired && (
                                    <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 text-[10px] font-semibold">
                                      FEFO Priority
                                    </span>
                                  )}
                                  {bExpired && (
                                    <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">
                                      Expired
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-500 mt-0.5">
                                  Expiry: <span className="font-mono font-semibold">{b.expiryDate}</span> • Supplier: {b.supplierName || 'Primary Dist.'}
                                </div>
                              </div>

                              <div className="text-right">
                                <span className="text-sm font-mono font-bold text-slate-900">
                                  {b.currentQuantity} <span className="text-xs text-slate-500 font-normal">u</span>
                                </span>
                                <div className="text-[10px] text-slate-400">
                                  {Math.floor(b.currentQuantity / unitsPerPack)} strips
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Launch Dispense Shortcut */}
                      {onLaunchDispense && currentMed && (
                        <div className="pt-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onLaunchDispense(undefined, currentMed, currentBatch);
                            }}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                          >
                            <Pill className="w-3.5 h-3.5" />
                            <span>Dispense this Medicine</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SUB-PANEL 2: Stock Adjustment (+ / -) */}
                  {activeActionTab === 'adjust' && (
                    <div className="p-4 space-y-4">
                      <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Stock Reconciliation Audit:</span> Adjusting stock directly updates shelf balance and records a permanent audit entry under your credential ({settings.name}).
                        </div>
                      </div>

                      {/* Stepper & Counter */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div>
                          <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block">
                            Target Shelf Batch
                          </span>
                          <span className="text-sm font-bold font-mono text-slate-900">
                            {currentBatch?.lotNumber} ({currentBatch?.brandName})
                          </span>
                          <span className="text-xs text-slate-500 block mt-0.5">
                            Previous Count: <strong className="font-mono text-slate-700">{currentBatch?.currentQuantity}</strong> units
                          </span>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setAdjustQty(prev => Math.max(0, prev - 10))}
                            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-700 hover:bg-slate-100"
                          >
                            -10
                          </button>
                          <button
                            type="button"
                            onClick={() => setAdjustQty(prev => Math.max(0, prev - 1))}
                            className="px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-700 hover:bg-slate-100"
                          >
                            -1
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={adjustQty}
                            onChange={e => setAdjustQty(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-20 py-1.5 text-center font-mono font-extrabold text-base bg-white border border-purple-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                          <button
                            type="button"
                            onClick={() => setAdjustQty(prev => prev + 1)}
                            className="px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-700 hover:bg-slate-100"
                          >
                            +1
                          </button>
                          <button
                            type="button"
                            onClick={() => setAdjustQty(prev => prev + 10)}
                            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-700 hover:bg-slate-100"
                          >
                            +10
                          </button>
                        </div>
                      </div>

                      {/* Reason Selector */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">
                          Adjustment Reason / Justification:
                        </label>
                        <select
                          value={adjustReason}
                          onChange={e => setAdjustReason(e.target.value)}
                          className="w-full py-2 px-3 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                        >
                          <option value="Routine Physical Cycle Count">Routine Physical Cycle Count (Periodic Shelf Audit)</option>
                          <option value="Damaged / Broken Blister Strips">Damaged / Broken Blister Strips</option>
                          <option value="Patient Returned Unopened Medicine">Patient Returned Unopened Medicine</option>
                          <option value="Spill / Wastage / Expired Disposal">Spill / Wastage / Expired Disposal</option>
                          <option value="Manual Data Entry Correction">Manual Data Entry Correction</option>
                        </select>
                      </div>

                      {/* Apply Button */}
                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          onClick={handleApplyAdjustment}
                          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Apply Count Update</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SUB-PANEL 3: Quick Restock (Intake) */}
                  {activeActionTab === 'restock' && (
                    <div className="p-4 space-y-4">
                      <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 flex items-start gap-2">
                        <PackagePlus className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Fast Intake Mode:</span> Quickly add arriving stock packs or tablets to this existing lot without opening full GRN form.
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Units to Add (Base Units / Tablets):
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="1"
                              value={restockUnits}
                              onChange={e => setRestockUnits(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-28 py-2 px-3 text-sm font-mono font-bold bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setRestockUnits(10)}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-semibold"
                              >
                                +10 (1 str)
                              </button>
                              <button
                                type="button"
                                onClick={() => setRestockUnits(50)}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-semibold"
                              >
                                +50 (5 str)
                              </button>
                              <button
                                type="button"
                                onClick={() => setRestockUnits(100)}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-semibold"
                              >
                                +100 (10 str)
                              </button>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Supplier / Invoice Reference Note:
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Beximco Delivery Challan #CH-9981"
                            value={restockNote}
                            onChange={e => setRestockNote(e.target.value)}
                            className="w-full py-2 px-3 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          onClick={handleApplyQuickRestock}
                          className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <PackagePlus className="w-4 h-4" />
                          <span>Intake +{restockUnits} Units into Shelf Stock</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          ) : hasSearched ? (
            /* No Result State */
            <div className="lg:col-span-7 p-8 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">
                No Inventory Found for "{manualCode}"
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                The scanned barcode did not match any active medicine, lot number, or prescription. Check the number or try scanning again.
              </p>
            </div>
          ) : (
            /* Idle Instruction State */
            <div className="lg:col-span-7 p-8 rounded-2xl bg-slate-50/70 border border-slate-200 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                <ScanLine className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">
                Ready for Barcode Scan
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Point the camera at any medicine blister strip, shelf box, or prescription QR code. Instant FEFO stock and lot details will appear here.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Hardware Keyboard Wedge: <strong className="text-slate-700 font-mono">Listening</strong></span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="px-4 py-2 font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors shadow-xs"
            >
              {language === 'bn' ? 'বন্ধ করুন' : 'Close Scanner'}
            </button>
          </div>
        </div>
      </div>

      {/* Printable Barcode Sticker Label Modal */}
      {showLabelModal && (
        <BarcodeLabelModal
          isOpen={showLabelModal}
          onClose={() => setShowLabelModal(false)}
          batch={currentBatch}
          medicine={currentMed}
        />
      )}
    </div>
  );
};
