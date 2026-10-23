import React, { useState, useEffect } from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  Prescription,
  Patient,
  Doctor,
  DispenseItem,
  MedicineBatch,
  MedicineCatalogItem,
} from '../../types';
import {
  X,
  Pill,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  FileText,
  DollarSign,
  Plus,
  Minus,
  Barcode,
  ScanLine,
} from 'lucide-react';
import { BarcodeScannerModal } from './BarcodeScannerModal';
import { playScannerSound } from '../../utils/barcodeUtils';

interface DispenseModalProps {
  prescription: Prescription | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const DispenseModal: React.FC<DispenseModalProps> = ({
  prescription,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const {
    patients,
    doctors,
    batches,
    medicines,
    settings,
    processDispense,
    getFefoBatchForMedicine,
    language,
    t,
  } = useClinic();

  const [dispenseItems, setDispenseItems] = useState<DispenseItem[]>([]);
  const [createInvoice, setCreateInvoice] = useState(true);
  const [dispenseNotes, setDispenseNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [activeScanIndex, setActiveScanIndex] = useState<number | null>(null);

  const handleScannerSelect = (
    _rx?: Prescription,
    scannedMed?: MedicineCatalogItem,
    scannedBatch?: MedicineBatch
  ) => {
    setShowBarcodeScanner(false);
    if (!scannedBatch && !scannedMed) return;

    if (activeScanIndex !== null && activeScanIndex < dispenseItems.length) {
      if (scannedBatch) {
        handleBatchSelect(activeScanIndex, scannedBatch.id);
        playScannerSound('success');
      } else if (scannedMed) {
        const fefo = getFefoBatchForMedicine(scannedMed.id);
        if (fefo) handleBatchSelect(activeScanIndex, fefo.id);
        playScannerSound('success');
      }
    } else {
      const targetMedId = scannedBatch?.medicineId || scannedMed?.id;
      const matchingIdx = dispenseItems.findIndex(i => i.medicineId === targetMedId);
      if (matchingIdx >= 0 && scannedBatch) {
        handleBatchSelect(matchingIdx, scannedBatch.id);
        playScannerSound('success');
      }
    }
  };

  const patient = prescription ? patients.find(p => p.id === prescription.patientId) : null;
  const doctor = prescription ? doctors.find(d => d.id === prescription.doctorId) : null;

  // Initialize dispense items when modal opens
  useEffect(() => {
    if (!prescription || !isOpen) return;

    setErrorMsg(null);
    setDispenseNotes('');

    const items: DispenseItem[] = prescription.medicines.map(pm => {
      const medCatalog = medicines.find(m => m.id === pm.medicineId);
      const fefoBatch = getFefoBatchForMedicine(pm.medicineId);

      // Estimate prescribed base units from dosage schedule & duration
      // e.g. "1+0+1" for 7 Days = 2 tabs/day * 7 = 14 tablets
      let dailyDoses = 2;
      if (pm.dosageSchedule.includes('+')) {
        dailyDoses = pm.dosageSchedule
          .split('+')
          .reduce((acc, val) => acc + (parseInt(val.trim(), 10) || 0), 0);
      }
      let days = 7;
      const daysMatch = pm.duration.match(/(\d+)\s*(day|days|month|months)/i);
      if (daysMatch) {
        const num = parseInt(daysMatch[1], 10);
        if (daysMatch[2].toLowerCase().startsWith('month')) {
          days = num * 30;
        } else {
          days = num;
        }
      }
      const calculatedQty = Math.max(1, dailyDoses * days);

      const unitsPerPack = medCatalog?.unitsPerPack || 10;
      const packagingUnit = medCatalog?.packagingUnit || 'Strip (10 tabs)';
      const unitPrice = fefoBatch?.retailPricePerBaseUnit || medCatalog?.retailPricePerBaseUnit || 5.0;

      // Default to full prescribed quantity
      const packs = Math.floor(calculatedQty / unitsPerPack);
      const loose = calculatedQty % unitsPerPack;

      return {
        prescribedMedicineId: pm.id,
        medicineId: pm.medicineId,
        brandName: pm.brandName,
        genericName: pm.genericName,
        dosageForm: pm.dosageForm,
        strength: pm.strength,
        dosageSchedule: pm.dosageSchedule,
        duration: pm.duration,
        prescribedBaseQuantity: calculatedQty,
        dispensedBaseQuantity: calculatedQty,
        packagingUnit,
        unitsPerPack,
        dispensedPacks: packs,
        dispensedLooseUnits: loose,
        selectedBatchId: fefoBatch ? fefoBatch.id : '',
        batchLotNumber: fefoBatch ? fefoBatch.lotNumber : 'NO-BATCH',
        batchExpiryDate: fefoBatch ? fefoBatch.expiryDate : 'N/A',
        unitPrice,
        totalPrice: calculatedQty * unitPrice,
        fefoSelected: true,
        partialReason: '',
      };
    });

    setDispenseItems(items);
  }, [prescription, isOpen, medicines, batches]);

  if (!isOpen || !prescription) return null;

  // Handle quantity changes with integer strip + tablet conversion math
  const handlePacksChange = (index: number, newPacks: number) => {
    setDispenseItems(prev => {
      const copy = [...prev];
      const item = { ...copy[index] };
      const safePacks = Math.max(0, newPacks);
      item.dispensedPacks = safePacks;
      item.dispensedBaseQuantity = safePacks * item.unitsPerPack + item.dispensedLooseUnits;
      item.totalPrice = item.dispensedBaseQuantity * item.unitPrice;
      if (item.dispensedBaseQuantity < item.prescribedBaseQuantity && !item.partialReason) {
        item.partialReason = 'Patient requested partial quantity';
      }
      copy[index] = item;
      return copy;
    });
  };

  const handleLooseUnitsChange = (index: number, newLoose: number) => {
    setDispenseItems(prev => {
      const copy = [...prev];
      const item = { ...copy[index] };
      // Integer tablet validation: loose must be integer >= 0 and < unitsPerPack
      const safeLoose = Math.max(0, Math.min(item.unitsPerPack - 1, Math.floor(newLoose)));
      item.dispensedLooseUnits = safeLoose;
      item.dispensedBaseQuantity = item.dispensedPacks * item.unitsPerPack + safeLoose;
      item.totalPrice = item.dispensedBaseQuantity * item.unitPrice;
      if (item.dispensedBaseQuantity < item.prescribedBaseQuantity && !item.partialReason) {
        item.partialReason = 'Patient requested partial quantity';
      }
      copy[index] = item;
      return copy;
    });
  };

  const handleBatchSelect = (index: number, batchId: string) => {
    const selectedBatch = batches.find(b => b.id === batchId);
    if (!selectedBatch) return;

    setDispenseItems(prev => {
      const copy = [...prev];
      const item = { ...copy[index] };
      const fefoBatch = getFefoBatchForMedicine(item.medicineId);

      item.selectedBatchId = selectedBatch.id;
      item.batchLotNumber = selectedBatch.lotNumber;
      item.batchExpiryDate = selectedBatch.expiryDate;
      item.unitPrice = selectedBatch.retailPricePerBaseUnit;
      item.totalPrice = item.dispensedBaseQuantity * item.unitPrice;
      item.fefoSelected = fefoBatch?.id === selectedBatch.id;
      copy[index] = item;
      return copy;
    });
  };

  const handlePartialReasonChange = (index: number, reason: string) => {
    setDispenseItems(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], partialReason: reason };
      return copy;
    });
  };

  const grandTotal = dispenseItems.reduce((acc, item) => acc + item.totalPrice, 0);
  const isAnyPartial = dispenseItems.some(
    item => item.dispensedBaseQuantity < item.prescribedBaseQuantity
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    // Validate that all items have a valid batch selected
    for (const item of dispenseItems) {
      if (item.dispensedBaseQuantity > 0 && !item.selectedBatchId) {
        setErrorMsg(`Please select an in-stock batch for ${item.brandName}`);
        setIsSubmitting(false);
        return;
      }
    }

    const result = processDispense({
      prescriptionId: prescription.id,
      patientId: prescription.patientId,
      doctorId: prescription.doctorId,
      items: dispenseItems,
      notes: dispenseNotes,
      createConsolidatedInvoice: createInvoice,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setErrorMsg(result.error || 'Failed to complete dispense operation.');
      return;
    }

    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-4xl w-full my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  {language === 'bn' ? 'প্রেসক্রিপশন ডিসপেনসিং রুম' : 'Prescription Dispensing Console'}
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                  {prescription.id}
                </span>
                {isAnyPartial && (
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                    {language === 'bn' ? 'আংশিক সরবরাহ (Partial)' : 'Partial Dispense'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {language === 'bn'
                  ? 'এফইএফও (FEFO) লট নির্বাচন, স্ট্রিপ-ট্যাবলেট রূপান্তর ও বিলিং ট্রেইল'
                  : 'FEFO batch selection, strip-to-tablet integer packaging, and billing audit trail'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Patient & Doctor Context Bar */}
        <div className="px-6 py-3 bg-slate-100/70 border-b border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-y-2">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-slate-400 font-medium mr-1">{language === 'bn' ? 'রোগী:' : 'Patient:'}</span>
              <span className="font-semibold text-slate-800">{patient?.name || 'N/A'}</span>
              <span className="ml-1 text-slate-500 font-mono">({patient?.age}y, {patient?.gender})</span>
            </div>
            <span className="text-slate-300">|</span>
            <div>
              <span className="text-slate-400 font-medium mr-1">{language === 'bn' ? 'চিকিৎসক:' : 'Prescribed By:'}</span>
              <span className="font-semibold text-slate-800">{doctor?.name || 'N/A'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{language === 'bn' ? 'তারিখ:' : 'Date:'} {prescription.date}</span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Medicine Dispensing Table */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {language === 'bn' ? 'প্রেসক্রাইবড ওষুধ ও ব্যাচ বরাদ্দ' : 'Prescribed Medicines & Batch Allocation'}
              </h4>
              <span className="text-xs text-slate-500 font-medium">
                {dispenseItems.length} {language === 'bn' ? 'টি ওষুধ' : 'medicines'}
              </span>
            </div>

            <div className="space-y-3">
              {dispenseItems.map((item, idx) => {
                const availableBatches = batches.filter(
                  b => b.medicineId === item.medicineId
                );
                const selectedBatch = batches.find(b => b.id === item.selectedBatchId);
                const isPartial = item.dispensedBaseQuantity < item.prescribedBaseQuantity;
                const isOverStock = selectedBatch && selectedBatch.currentQuantity < item.dispensedBaseQuantity;

                return (
                  <div
                    key={item.prescribedMedicineId}
                    className={`p-4 rounded-xl border transition-all ${
                      isPartial
                        ? 'bg-amber-50/40 border-amber-200'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">
                            {item.brandName}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            {item.strength} · {item.dosageForm}
                          </span>
                          <span className="text-xs text-slate-400">
                            ({item.genericName})
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          <span className="font-medium text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded mr-2">
                            {item.dosageSchedule}
                          </span>
                          <span>{item.duration}</span>
                          <span className="mx-2 text-slate-300">·</span>
                          <span className="text-slate-600 font-medium">
                            {language === 'bn' ? 'প্রেসক্রাইবড:' : 'Prescribed:'}{' '}
                            <strong className="text-slate-800 font-mono">{item.prescribedBaseQuantity}</strong>{' '}
                            {item.dosageForm.toLowerCase()}s
                          </span>
                        </div>
                      </div>

                      {/* Line Total */}
                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-900 font-mono">
                          {settings.currencySymbol}
                          {item.totalPrice.toFixed(2)}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          @{settings.currencySymbol}{item.unitPrice.toFixed(2)}/unit
                        </div>
                      </div>
                    </div>

                    {/* Quantity Adjustment & FEFO Batch Controls */}
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      {/* Integer Pack + Loose Quantity Math */}
                      <div className="md:col-span-6 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <div className="text-[11px] font-bold text-slate-600 uppercase mb-1.5 flex justify-between">
                          <span>{language === 'bn' ? 'সরবরাহকৃত পরিমাণ (Integer Units)' : 'Issued Quantity'}</span>
                          <span className="font-mono text-purple-700 font-semibold">
                            = {item.dispensedBaseQuantity} {item.dosageForm.toLowerCase()}s
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Packs / Strips counter */}
                          <div className="flex-1 flex items-center bg-white border border-slate-200 rounded-md overflow-hidden">
                            <button
                              type="button"
                              onClick={() => handlePacksChange(idx, item.dispensedPacks - 1)}
                              className="px-2 py-1 text-slate-500 hover:bg-slate-100"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={item.dispensedPacks}
                              onChange={e => handlePacksChange(idx, parseInt(e.target.value, 10) || 0)}
                              className="w-full text-center text-xs font-mono font-bold py-1 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handlePacksChange(idx, item.dispensedPacks + 1)}
                              className="px-2 py-1 text-slate-500 hover:bg-slate-100"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2 text-[10px] text-slate-400 font-medium border-l border-slate-100 bg-slate-50 whitespace-nowrap">
                              {language === 'bn' ? 'স্ট্রিপ' : 'Strip'} ({item.unitsPerPack})
                            </span>
                          </div>

                          {/* Loose Units Counter */}
                          <div className="flex-1 flex items-center bg-white border border-slate-200 rounded-md overflow-hidden">
                            <button
                              type="button"
                              onClick={() => handleLooseUnitsChange(idx, item.dispensedLooseUnits - 1)}
                              className="px-2 py-1 text-slate-500 hover:bg-slate-100"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <input
                              type="number"
                              min="0"
                              max={item.unitsPerPack - 1}
                              value={item.dispensedLooseUnits}
                              onChange={e => handleLooseUnitsChange(idx, parseInt(e.target.value, 10) || 0)}
                              className="w-full text-center text-xs font-mono font-bold py-1 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleLooseUnitsChange(idx, item.dispensedLooseUnits + 1)}
                              className="px-2 py-1 text-slate-500 hover:bg-slate-100"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2 text-[10px] text-slate-400 font-medium border-l border-slate-100 bg-slate-50 whitespace-nowrap">
                              {language === 'bn' ? 'খুচরা ট্যাবলেট' : 'Loose'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* FEFO Batch Dropdown */}
                      <div className="md:col-span-6">
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-bold text-slate-600 uppercase">
                            {language === 'bn' ? 'ব্যাচ নির্বাচন (FEFO নিয়ম)' : 'Batch Selection (FEFO Rule)'}
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveScanIndex(idx);
                              setShowBarcodeScanner(true);
                            }}
                            className="text-[10px] text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-1.5 py-0.5 rounded border border-purple-200 flex items-center gap-1 font-semibold transition-colors"
                            title="Scan blister box barcode to verify & select batch"
                          >
                            <ScanLine className="w-3 h-3" />
                            <span>Scan Box</span>
                          </button>
                        </div>
                        <select
                          value={item.selectedBatchId}
                          onChange={e => handleBatchSelect(idx, e.target.value)}
                          className="w-full text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-purple-500"
                        >
                          {availableBatches.length === 0 ? (
                            <option value="">No stock available in dispensary</option>
                          ) : (
                            availableBatches.map(b => {
                              const isExpired = b.status === 'expired';
                              const isQuarantined = b.status === 'quarantined' || b.status === 'blocked';
                              const isDisabled = isExpired || isQuarantined || b.currentQuantity === 0;

                              return (
                                <option
                                  key={b.id}
                                  value={b.id}
                                  disabled={isDisabled}
                                >
                                  {b.lotNumber} · Exp: {b.expiryDate} · Stock: {b.currentQuantity} units
                                  {isExpired ? ' [EXPIRED - LOCKED]' : ''}
                                  {isQuarantined ? ' [QUARANTINED - LOCKED]' : ''}
                                  {b.id === getFefoBatchForMedicine(item.medicineId)?.id ? ' (★ FEFO Recommended)' : ''}
                                </option>
                              );
                            })
                          )}
                        </select>

                        {/* FEFO Verification indicator */}
                        <div className="mt-1 flex items-center justify-between text-[11px]">
                          {item.fefoSelected ? (
                            <span className="text-emerald-700 flex items-center gap-1 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              {language === 'bn' ? 'FEFO উত্তীর্ণ: নিকটবর্তী মেয়াদের লট' : 'FEFO Verified: Earliest Expiry Lot'}
                            </span>
                          ) : (
                            <span className="text-amber-700 flex items-center gap-1 font-medium">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                              {language === 'bn' ? 'FEFO ওভাররাইড করা হয়েছে' : 'FEFO Overridden by Dispenser'}
                            </span>
                          )}

                          {isOverStock && (
                            <span className="text-rose-600 font-bold">
                              Stock Insufficient ({selectedBatch?.currentQuantity || 0} avail)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Partial Dispense Reason note */}
                    {isPartial && (
                      <div className="mt-2 pt-2 border-t border-amber-100 flex items-center gap-2 text-xs">
                        <span className="text-amber-800 font-medium whitespace-nowrap">
                          {language === 'bn' ? 'আংশিক সরবরাহের কারণ:' : 'Partial Dispense Reason:'}
                        </span>
                        <input
                          type="text"
                          value={item.partialReason || ''}
                          onChange={e => handlePartialReasonChange(idx, e.target.value)}
                          placeholder="e.g. Patient requested 5-day course due to budget"
                          className="flex-1 bg-amber-50/70 border border-amber-200 rounded px-2 py-0.5 text-xs text-amber-900 focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Consolidated Billing & Notes Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consolidatedBilling"
                  checked={createInvoice}
                  onChange={e => setCreateInvoice(e.target.checked)}
                  className="mt-0.5 rounded text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <label htmlFor="consolidatedBilling" className="text-xs font-bold text-slate-800 cursor-pointer">
                    {language === 'bn'
                      ? 'একীভূত ইনভয়েসে অন্তর্ভুক্ত করুন (কনসালটেশন ফি + ডিসপেনসারি মেডিসিন এক রিসিটে)'
                      : 'Consolidate onto Clinic Invoice (Consultation Fee + Dispensed Medicines on 1 Single Bill)'}
                  </label>
                  <p className="text-[11px] text-slate-500">
                    {language === 'bn'
                      ? 'গবেষণা পরিকল্পনা নির্দেশিকা অনুযায়ী: ডিসপেনসিংয়ের কারণে পুনরায় ডুপ্লিকেট ইনভয়েস লাইন তৈরি হবে না।'
                      : 'Complies with Plan 0a82bd6e: Dispensing does not create duplicate invoice copies or separate unlinked slips.'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  {language === 'bn' ? 'ডিসপেনসার মন্তব্য / নোট:' : 'Dispenser Clinical / Handover Notes:'}
                </label>
                <input
                  type="text"
                  value={dispenseNotes}
                  onChange={e => setDispenseNotes(e.target.value)}
                  placeholder="e.g. Advised patient to take after meal with plenty of water"
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer with Grand Total & Submit */}
          <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-medium">
                {language === 'bn' ? 'মোট মেডিসিন বিল:' : 'Total Dispense Amount:'}
              </span>
              <span className="text-xl font-bold text-slate-900 font-mono">
                {settings.currencySymbol}
                {grandTotal.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                disabled={isSubmitting || grandTotal <= 0}
                className="flex-1 sm:flex-initial px-5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {language === 'bn'
                    ? (isAnyPartial ? 'আংশিক ডিসপেন্স সম্পন্ন করুন' : 'সম্পূর্ণ ডিসপেন্স নিশ্চিত করুন')
                    : (isAnyPartial ? 'Confirm Partial Dispense' : 'Confirm Full Dispense')}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {showBarcodeScanner && (
        <BarcodeScannerModal
          isOpen={showBarcodeScanner}
          onClose={() => {
            setShowBarcodeScanner(false);
            setActiveScanIndex(null);
          }}
          onLaunchDispense={handleScannerSelect}
        />
      )}
    </div>
  );
};
