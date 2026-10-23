import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  Prescription,
  MedicineBatch,
  GoodsReceiptNote,
  DispenseRecord,
  BatchStatus,
} from '../../types';
import {
  Pill,
  CalendarDays,
  PackageCheck,
  PackagePlus,
  AlertTriangle,
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  FileText,
  Building,
  Layers,
  ChevronRight,
  TrendingDown,
  Info,
  DollarSign,
  ScanLine,
  Barcode,
  Printer,
} from 'lucide-react';
import { DispenseModal } from './DispenseModal';
import { GoodsReceiptModal } from './GoodsReceiptModal';
import { AddBatchModal } from './AddBatchModal';
import { BarcodeScannerModal } from './BarcodeScannerModal';
import { BarcodeLabelModal } from './BarcodeLabelModal';
import { MedicineCatalogItem } from '../../types';

export const DispensaryManager: React.FC = () => {
  const {
    prescriptions,
    patients,
    doctors,
    medicines,
    batches,
    goodsReceiptNotes,
    dispenseRecords,
    settings,
    currentUser,
    language,
    t,
  } = useClinic();

  const [activeSubTab, setActiveSubTab] = useState<'queue' | 'batches' | 'grn' | 'history'>('queue');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [showDispenseModal, setShowDispenseModal] = useState(false);
  const [showGRNModal, setShowGRNModal] = useState(false);
  const [showAddBatchModal, setShowAddBatchModal] = useState(false);

  // Barcode Scanner & Label States
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [scannerInitialQuery, setScannerInitialQuery] = useState('');
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [selectedBatchForLabel, setSelectedBatchForLabel] = useState<MedicineBatch | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [batchStatusFilter, setBatchStatusFilter] = useState<'all' | BatchStatus>('all');

  const todayStr = new Date().toISOString().split('T')[0];

  // Metrics
  const expiredBatchesCount = batches.filter(
    b => b.status === 'expired' || b.expiryDate < todayStr
  ).length;

  const nearExpiryCount = batches.filter(
    b => b.status === 'near_expiry' || (b.expiryDate >= todayStr && (new Date(b.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24) <= 30)
  ).length;

  const lowStockCount = batches.filter(b => b.currentQuantity < 50 && b.status === 'active').length;

  // Filtered Batches
  const filteredBatches = batches.filter(b => {
    const matchesSearch =
      b.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.lotNumber.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (batchStatusFilter === 'all') return true;
    return b.status === batchStatusFilter;
  });

  // Hardware Handheld USB / Bluetooth Barcode Scanner Keyboard Wedge Listener
  React.useEffect(() => {
    let buffer = '';
    let lastKeyTime = Date.now();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Hotkey F2 or Ctrl+B to trigger scanner
      if (e.key === 'F2' || (e.ctrlKey && e.key.toLowerCase() === 'b')) {
        e.preventDefault();
        setScannerInitialQuery('');
        setShowBarcodeScanner(true);
        return;
      }

      // If user is focused on a normal text input/textarea, don't hijack unless it's a fast burst
      const activeEl = document.activeElement;
      const isInputFocused =
        activeEl?.tagName === 'INPUT' ||
        activeEl?.tagName === 'TEXTAREA' ||
        activeEl?.tagName === 'SELECT';

      const currentTime = Date.now();
      const interval = currentTime - lastKeyTime;
      lastKeyTime = currentTime;

      if (e.key === 'Enter') {
        // Typical barcode scanner speed < 60ms per key, buffer length >= 3
        if (buffer.length >= 3 && interval < 100) {
          e.preventDefault();
          const scanned = buffer.trim();
          buffer = '';
          setScannerInitialQuery(scanned);
          setShowBarcodeScanner(true);
        } else {
          buffer = '';
        }
        return;
      }

      if (e.key.length !== 1) return;

      if (interval > 80 && !isInputFocused) {
        buffer = e.key;
      } else {
        buffer += e.key;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenDispense = (rx: Prescription) => {
    setSelectedPrescription(rx);
    setShowDispenseModal(true);
  };

  const handleLaunchDispenseFromScanner = (
    rx?: Prescription,
    med?: MedicineCatalogItem,
    batch?: MedicineBatch
  ) => {
    if (rx) {
      setSelectedPrescription(rx);
      setShowDispenseModal(true);
    } else if (med) {
      // Find prescription with this medicine or open queue
      const matchingRx = prescriptions.find(p =>
        p.medicines.some(m => m.medicineId === med.id)
      );
      if (matchingRx) {
        setSelectedPrescription(matchingRx);
        setShowDispenseModal(true);
      } else {
        setActiveSubTab('queue');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Architectural Principle Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold shadow-xs">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  {language === 'bn' ? 'ডিসপেনসারি ও ফার্মেসি ব্যবস্থাপনা' : 'In-House Dispensary & Pharmacy'}
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                  FEFO Engine
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {language === 'bn'
                  ? 'প্রেসক্রিপশন-টু-ডিসপেনস ট্রেইল, স্ট্রিপ-ট্যাবলেট পূর্ণসংখ্যা রূপান্তর ও মেয়াদ উত্তীর্ণ লট লকআউট'
                  : 'Prescription-to-dispense audit trail, integer strip-to-tablet conversions, and automated FEFO expiry lockout'}
              </p>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Barcode Scanner Primary Launcher */}
          <button
            onClick={() => {
              setScannerInitialQuery('');
              setShowBarcodeScanner(true);
            }}
            className="px-3.5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-all shadow-xs flex items-center gap-1.5 whitespace-nowrap group"
            title="Open camera or hardware scanner station (Shortcut: F2 or Ctrl+B)"
          >
            <ScanLine className="w-4 h-4 animate-pulse group-hover:scale-110 transition-transform" />
            <span>{language === 'bn' ? 'বারকোড স্ক্যানার' : 'Scan Barcode'}</span>
            <kbd className="px-1.5 py-0.2 rounded bg-purple-800 text-purple-200 text-[10px] font-mono">F2</kbd>
          </button>

          <button
            onClick={() => setShowGRNModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap"
          >
            <PackagePlus className="w-4 h-4" />
            <span>{language === 'bn' ? 'স্টক চালান (GRN) গ্রহণ' : 'Receive Goods (GRN)'}</span>
          </button>

          <button
            onClick={() => setShowAddBatchModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap"
          >
            <PackageCheck className="w-4 h-4" />
            <span>{language === 'bn' ? 'নতুন ব্যাচ এন্ট্রি' : 'Add Lot Batch'}</span>
          </button>
        </div>
      </div>

      {/* Operational KPI & Alert Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Active Batches */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
              {language === 'bn' ? 'সক্রিয় লট ও ব্যাচ' : 'Active Shelf Batches'}
            </span>
            <span className="text-2xl font-bold font-mono text-slate-900 mt-1 block">
              {batches.filter(b => b.status === 'active').length}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              {batches.reduce((sum, b) => sum + (b.status === 'active' ? b.currentQuantity : 0), 0)} base units
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Prescriptions */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
              {language === 'bn' ? 'ডিসপেনসিং অপেক্ষমাণ' : 'Rx Awaiting Dispense'}
            </span>
            <span className="text-2xl font-bold font-mono text-purple-700 mt-1 block">
              {prescriptions.length}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              {dispenseRecords.length} dispensed today
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
            <Pill className="w-5 h-5" />
          </div>
        </div>

        {/* Near Expiry Alert */}
        <div className={`p-4 rounded-xl border shadow-xs flex items-center justify-between ${
          nearExpiryCount > 0 ? 'bg-amber-50/50 border-amber-200' : 'bg-white border-slate-200'
        }`}>
          <div>
            <span className="text-xs font-medium text-amber-800 uppercase tracking-wider block">
              {language === 'bn' ? 'আসন্ন মেয়াদ উত্তীর্ণ (&lt;30 দিন)' : 'Near Expiry (&lt;30 Days)'}
            </span>
            <span className="text-2xl font-bold font-mono text-amber-700 mt-1 block">
              {nearExpiryCount}
            </span>
            <span className="text-[11px] text-amber-600 mt-0.5 block">
              Flagged for FEFO liquidation
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-100/70 border border-amber-200 flex items-center justify-center text-amber-700">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Expired / Quarantined Hard-Locked Lots */}
        <div className={`p-4 rounded-xl border shadow-xs flex items-center justify-between ${
          expiredBatchesCount > 0 ? 'bg-rose-50/50 border-rose-200' : 'bg-white border-slate-200'
        }`}>
          <div>
            <span className="text-xs font-medium text-rose-800 uppercase tracking-wider block">
              {language === 'bn' ? 'লকড / মেয়াদোত্তীর্ণ ব্যাচ' : 'Locked Expired / Quarantined'}
            </span>
            <span className="text-2xl font-bold font-mono text-rose-700 mt-1 block">
              {expiredBatchesCount}
            </span>
            <span className="text-[11px] text-rose-600 font-medium mt-0.5 block">
              Hard-blocked from dispensing
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-100/70 border border-rose-200 flex items-center justify-center text-rose-700">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Plan 0a82bd6e Core Principles Callout */}
      <div className="p-3.5 bg-slate-900 text-slate-200 rounded-xl text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <span className="font-semibold text-white mr-1.5">
              Plan 0a82bd6e Compliance Guardrails:
            </span>
            <span className="text-slate-300">
              1) Stock increases ONLY on verified GRN receipts. 2) Prescribed quantity kept distinct from actual dispensed quantity. 3) Integer strip-tablet conversion prevents fractional loss. 4) FEFO hard-rejects expired or quarantined lots.
            </span>
          </div>
        </div>
        <button
          onClick={() => setActiveSubTab('batches')}
          className="text-cyan-400 hover:text-cyan-300 font-medium whitespace-nowrap flex items-center gap-1 self-end md:self-center"
        >
          <span>Audit Batches</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveSubTab('queue')}
            className={`px-4 py-2 font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeSubTab === 'queue'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>{language === 'bn' ? 'প্রেসক্রিপশন কিউ (Prescription Queue)' : 'Rx Dispense Queue'}</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-white/20 font-mono">
              {prescriptions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('batches')}
            className={`px-4 py-2 font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeSubTab === 'batches'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{language === 'bn' ? 'ব্যাচ ও এফইএফও ইনভেন্টরি' : 'Batches & FEFO Inventory'}</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-white/20 font-mono">
              {batches.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('grn')}
            className={`px-4 py-2 font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeSubTab === 'grn'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <PackagePlus className="w-4 h-4" />
            <span>{language === 'bn' ? 'স্টক রিসিট নোট (GRN)' : 'Goods Receipts (GRN)'}</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-white/20 font-mono">
              {goodsReceiptNotes.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-4 py-2 font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeSubTab === 'history'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{language === 'bn' ? 'ডিসপেন্স অডিট হিস্ট্রি' : 'Dispense Audit Trail'}</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-white/20 font-mono">
              {dispenseRecords.length}
            </span>
          </button>
        </div>
      </div>

      {/* TAB 1: PRESCRIPTION-TO-DISPENSE QUEUE */}
      {activeSubTab === 'queue' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                {language === 'bn' ? 'ডাক্তার চেম্বার হতে আগত প্রেসক্রিপশন' : 'Incoming Doctor Prescriptions'}
              </h2>
              <span className="text-xs text-slate-500">
                {prescriptions.length} {language === 'bn' ? 'টি প্রেসক্রিপশন তালিকায় রয়েছে' : 'consultation prescriptions available'}
              </span>
            </div>
            <button
              onClick={() => {
                setScannerInitialQuery('RX-');
                setShowBarcodeScanner(true);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs self-start sm:self-auto"
            >
              <ScanLine className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'প্রেসক্রিপশন কিউআর স্ক্যান' : 'Scan Rx QR Code'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prescriptions.map(rx => {
              const pt = patients.find(p => p.id === rx.patientId);
              const doc = doctors.find(d => d.id === rx.doctorId);
              const pastDispense = dispenseRecords.find(d => d.prescriptionId === rx.id);

              return (
                <div
                  key={rx.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-purple-200 hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Rx ID, Patient & Status */}
                    <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-base">
                            {pt?.name || 'Patient'}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            {rx.id}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          <span>{pt?.age}y, {pt?.gender}</span>
                          <span className="mx-2 text-slate-300">·</span>
                          <span>Phone: {pt?.phone}</span>
                        </div>
                      </div>

                      {pastDispense ? (
                        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{pastDispense.status === 'partially_dispensed' ? 'Partially Dispensed' : 'Dispensed'}</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Awaiting Dispense</span>
                        </span>
                      )}
                    </div>

                    {/* Prescribing Doctor & Diagnosis */}
                    <div className="py-2.5 flex items-center justify-between text-xs text-slate-600">
                      <div>
                        <span className="text-slate-400">Doctor: </span>
                        <span className="font-medium text-slate-800">{doc?.name || 'Chamber Doctor'}</span>
                      </div>
                      <div className="text-slate-400 font-mono text-[11px]">
                        {rx.date}
                      </div>
                    </div>

                    {/* Prescribed Medicine Badges */}
                    <div className="pt-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Prescribed Lines ({rx.medicines.length}):
                      </span>
                      <div className="space-y-1.5">
                        {rx.medicines.map(m => (
                          <div
                            key={m.id}
                            className="flex items-center justify-between bg-slate-50 p-2 rounded-lg text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-800">{m.brandName}</span>
                              <span className="text-slate-500 font-mono text-[11px]">{m.strength}</span>
                              <span className="text-purple-700 font-medium text-[11px] bg-purple-50 px-1.5 rounded">
                                {m.dosageSchedule}
                              </span>
                            </div>
                            <span className="text-slate-500 text-[11px]">{m.duration}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {pastDispense ? `Handled by ${pastDispense.dispensedByName}` : 'Ready for FEFO allocation'}
                    </span>
                    <button
                      onClick={() => handleOpenDispense(rx)}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Pill className="w-3.5 h-3.5" />
                      <span>{pastDispense ? 'Re-Dispense / Edit' : 'Dispense Medicines'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: BATCH INVENTORY & FEFO LEDGER */}
      {activeSubTab === 'batches' && (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
            <div className="relative flex-1 max-w-md flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={language === 'bn' ? 'ওষুধের নাম বা লট নম্বর দিয়ে খুঁজুন...' : 'Search batch by brand, generic, or lot number...'}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setScannerInitialQuery(searchQuery);
                  setShowBarcodeScanner(true);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors flex items-center gap-1 shadow-xs whitespace-nowrap"
                title="Open Barcode Scanner"
              >
                <ScanLine className="w-3.5 h-3.5" />
                <span>Scan</span>
              </button>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1 overflow-x-auto text-xs">
              <button
                onClick={() => setBatchStatusFilter('all')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  batchStatusFilter === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                All ({batches.length})
              </button>
              <button
                onClick={() => setBatchStatusFilter('active')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  batchStatusFilter === 'active'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Active ({batches.filter(b => b.status === 'active').length})
              </button>
              <button
                onClick={() => setBatchStatusFilter('near_expiry')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  batchStatusFilter === 'near_expiry'
                    ? 'bg-amber-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Near Expiry ({nearExpiryCount})
              </button>
              <button
                onClick={() => setBatchStatusFilter('expired')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  batchStatusFilter === 'expired'
                    ? 'bg-rose-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Expired ({batches.filter(b => b.status === 'expired').length})
              </button>
              <button
                onClick={() => setBatchStatusFilter('quarantined')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  batchStatusFilter === 'quarantined'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Quarantined
              </button>
            </div>
          </div>

          {/* Batches Table (High-Density SaaS Grid) */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Medicine & Form</th>
                    <th className="py-3 px-4">Lot / Batch #</th>
                    <th className="py-3 px-4">Expiry Date (FEFO)</th>
                    <th className="py-3 px-4 text-right">Available Stock</th>
                    <th className="py-3 px-4 text-right">Unit Cost</th>
                    <th className="py-3 px-4 text-right">Unit Price</th>
                    <th className="py-3 px-4">Status & Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBatches.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No medicine batches match your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredBatches.map(batch => {
                      const isExpired = batch.status === 'expired' || batch.expiryDate < todayStr;
                      const isNearExpiry = batch.status === 'near_expiry';
                      const isQuarantined = batch.status === 'quarantined' || batch.status === 'blocked';
                      const med = medicines.find(m => m.id === batch.medicineId);
                      const unitsPerPack = med?.unitsPerPack || 10;
                      const packs = Math.floor(batch.currentQuantity / unitsPerPack);
                      const loose = batch.currentQuantity % unitsPerPack;

                      return (
                        <tr
                          key={batch.id}
                          className={`hover:bg-slate-50/70 transition-colors ${
                            isExpired ? 'bg-rose-50/20' : ''
                          }`}
                        >
                          <td className="py-3 px-4 font-medium text-slate-900">
                            <div className="font-bold">{batch.brandName}</div>
                            <div className="text-[11px] text-slate-400 font-normal">
                              {batch.genericName}
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-700">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-slate-900">{batch.lotNumber}</span>
                              <button
                                onClick={() => {
                                  setSelectedBatchForLabel(batch);
                                  setShowLabelModal(true);
                                }}
                                className="p-1 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                                title="View & Print Barcode Sticker Label"
                              >
                                <Barcode className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            {batch.goodsReceiptId && (
                              <div className="text-[10px] text-slate-400 font-normal">
                                via {batch.goodsReceiptId}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono">
                            <div className="font-semibold text-slate-800">{batch.expiryDate}</div>
                            {isExpired ? (
                              <span className="text-[10px] text-rose-600 font-bold uppercase">
                                Hard Locked (Expired)
                              </span>
                            ) : isNearExpiry ? (
                              <span className="text-[10px] text-amber-600 font-semibold">
                                Critical FEFO Window
                              </span>
                            ) : (
                              <span className="text-[10px] text-emerald-600 font-medium">
                                Active & Valid
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right font-mono tabular-nums">
                            <div className="font-bold text-slate-900">
                              {batch.currentQuantity} units
                            </div>
                            <div className="text-[10px] text-slate-400 font-normal">
                              {packs} strips + {loose} tabs
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-600">
                            {settings.currencySymbol}
                            {batch.costPerBaseUnit.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-slate-900">
                            {settings.currencySymbol}
                            {batch.retailPricePerBaseUnit.toFixed(2)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {isExpired ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                                  Expired (Locked)
                                </span>
                              ) : isQuarantined ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-100 border border-slate-700">
                                  Quarantined
                                </span>
                              ) : isNearExpiry ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                                  Near Expiry
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  Available (FEFO)
                                </span>
                              )}

                              <button
                                onClick={() => {
                                  setScannerInitialQuery(batch.lotNumber);
                                  setShowBarcodeScanner(true);
                                }}
                                className="px-2 py-1 text-[11px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors flex items-center gap-1 shadow-2xs whitespace-nowrap"
                                title="Quick Scan / Stock Adjustment"
                              >
                                <ScanLine className="w-3 h-3" />
                                <span>Adjust</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GOODS RECEIPT NOTES (GRN) */}
      {activeSubTab === 'grn' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                {language === 'bn' ? 'স্টক চালান ও গুডস রিসিট রেজিস্টার' : 'Goods Receipt Notes (GRN) Ledger'}
              </h2>
              <p className="text-xs text-slate-500">
                Stock increases strictly upon verified physical receipt, preventing phantom inventory.
              </p>
            </div>
            <button
              onClick={() => setShowGRNModal(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <PackagePlus className="w-3.5 h-3.5" />
              <span>Record New GRN</span>
            </button>
          </div>

          <div className="space-y-3">
            {goodsReceiptNotes.map(grn => (
              <div
                key={grn.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm font-mono">{grn.grnNumber}</span>
                      <span className="font-medium text-slate-700">{grn.supplierName}</span>
                      <span className="text-slate-400 font-mono">Invoice: {grn.supplierInvoiceNo}</span>
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      Received by <strong className="text-slate-700">{grn.receivedByName}</strong> on {grn.receivedDate}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-sm text-slate-900 font-mono">
                      {settings.currencySymbol}{grn.totalAmount.toLocaleString()}
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                      grn.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {grn.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Items in GRN */}
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50/50">
                      <tr>
                        <th className="py-1.5 px-3">Medicine</th>
                        <th className="py-1.5 px-3">Lot Number</th>
                        <th className="py-1.5 px-3">Expiry Date</th>
                        <th className="py-1.5 px-3 text-right">Packs</th>
                        <th className="py-1.5 px-3 text-right">Total Units</th>
                        <th className="py-1.5 px-3 text-right">Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {grn.items.map((it, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-1.5 px-3 font-semibold text-slate-800">{it.brandName}</td>
                          <td className="py-1.5 px-3 font-mono text-slate-600">{it.lotNumber}</td>
                          <td className="py-1.5 px-3 font-mono text-slate-600">{it.expiryDate}</td>
                          <td className="py-1.5 px-3 text-right font-mono">{it.packQuantity}</td>
                          <td className="py-1.5 px-3 text-right font-mono font-bold text-slate-800">{it.totalBaseUnits} u</td>
                          <td className="py-1.5 px-3 text-right font-mono">{settings.currencySymbol}{it.totalCost.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {grn.notes && (
                  <div className="mt-2 text-[11px] text-slate-500 italic bg-slate-50 px-2.5 py-1 rounded">
                    Notes: {grn.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DISPENSE AUDIT TRAIL */}
      {activeSubTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              {language === 'bn' ? 'প্রেসক্রিপশন-টু-ডিসপেনস অডিট ট্রেইল' : 'Prescription-to-Dispense Audit Trail'}
            </h2>
            <span className="text-xs text-slate-500">
              Traceability from doctor Rx to inventory batch deduction and billing invoice
            </span>
          </div>

          <div className="space-y-3">
            {dispenseRecords.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
                No dispense records logged yet.
              </div>
            ) : (
              dispenseRecords.map(record => (
                <div
                  key={record.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs text-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 font-mono">{record.dispenseNumber}</span>
                        <span className="text-slate-400">·</span>
                        <span className="font-semibold text-slate-800">{record.patientName}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          record.status === 'partially_dispensed' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {record.status === 'partially_dispensed' ? 'Partial Dispense' : 'Fully Dispensed'}
                        </span>
                      </div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        Rx Ref: <strong className="font-mono text-purple-700">{record.prescriptionId}</strong> | Prescribed by {record.doctorName} | Handed over by {record.dispensedByName}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold font-mono text-sm text-slate-900">
                        {settings.currencySymbol}{record.totalMedicineAmount.toFixed(2)}
                      </div>
                      {record.invoiceId && (
                        <div className="text-[11px] text-cyan-700 font-mono font-medium">
                          Billed on {record.invoiceId}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dispensed Items breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {record.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-slate-800">{item.brandName} {item.strength}</div>
                          <div className="text-[11px] text-slate-500">
                            Prescribed: <strong className="font-mono">{item.prescribedBaseQuantity}</strong> u | Issued: <strong className="font-mono text-purple-700">{item.dispensedBaseQuantity}</strong> u
                            {item.dispensedBaseQuantity < item.prescribedBaseQuantity && (
                              <span className="ml-1 text-amber-700 font-semibold">(Partial)</span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Lot: {item.batchLotNumber} (Exp: {item.batchExpiryDate})
                          </div>
                        </div>
                        <div className="text-right font-mono font-bold text-slate-800">
                          {settings.currencySymbol}{item.totalPrice.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {record.notes && (
                    <div className="text-[11px] text-slate-600 italic bg-amber-50/50 border border-amber-200/50 p-2 rounded">
                      Handover note: {record.notes}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <DispenseModal
        isOpen={showDispenseModal}
        prescription={selectedPrescription}
        onClose={() => {
          setShowDispenseModal(false);
          setSelectedPrescription(null);
        }}
      />

      <GoodsReceiptModal
        isOpen={showGRNModal}
        onClose={() => setShowGRNModal(false)}
      />

      <AddBatchModal
        isOpen={showAddBatchModal}
        onClose={() => setShowAddBatchModal(false)}
      />

      {/* Barcode Scanning Integration Modal */}
      <BarcodeScannerModal
        isOpen={showBarcodeScanner}
        onClose={() => {
          setShowBarcodeScanner(false);
          setScannerInitialQuery('');
        }}
        initialQuery={scannerInitialQuery}
        onLaunchDispense={handleLaunchDispenseFromScanner}
      />

      {/* Barcode Thermal Sticker Label Modal */}
      <BarcodeLabelModal
        isOpen={showLabelModal}
        onClose={() => {
          setShowLabelModal(false);
          setSelectedBatchForLabel(null);
        }}
        batch={selectedBatchForLabel}
      />
    </div>
  );
};
