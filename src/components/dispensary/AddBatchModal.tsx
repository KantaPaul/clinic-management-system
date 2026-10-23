import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  MedicineBatch,
  BatchStatus,
} from '../../types';
import {
  X,
  Package,
  Plus,
  AlertCircle,
  Calendar,
} from 'lucide-react';

interface AddBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddBatchModal: React.FC<AddBatchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { medicines, addBatch, settings, language, t } = useClinic();

  const [medicineId, setMedicineId] = useState(medicines[0]?.id || 'MED-01');
  const [lotNumber, setLotNumber] = useState(`LOT-MN-${Math.floor(1000 + Math.random() * 9000)}`);
  const [manufacturingDate, setManufacturingDate] = useState('2026-01-01');
  const [expiryDate, setExpiryDate] = useState('2027-12-31');
  const [initialQuantity, setInitialQuantity] = useState(100);
  const [costPerBaseUnit, setCostPerBaseUnit] = useState(2.0);
  const [retailPricePerBaseUnit, setRetailPricePerBaseUnit] = useState(2.5);
  const [supplierName, setSupplierName] = useState('Direct Manufacturer Supply');
  const [status, setStatus] = useState<BatchStatus>('active');
  const [notes, setNotes] = useState('Manual stock adjustment intake');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedMed = medicines.find(m => m.id === medicineId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!lotNumber.trim()) {
      setErrorMsg('Please specify Lot / Batch number');
      return;
    }

    if (!selectedMed) {
      setErrorMsg('Please select a medicine');
      return;
    }

    addBatch({
      medicineId,
      brandName: selectedMed.brandName,
      genericName: selectedMed.genericName,
      lotNumber,
      manufacturingDate,
      expiryDate,
      costPerBaseUnit,
      retailPricePerBaseUnit,
      initialQuantity,
      currentQuantity: initialQuantity,
      status,
      supplierName,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full my-8 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {language === 'bn' ? 'নতুন মেডিসিন ব্যাচ সংযোজন' : 'Add Medicine Lot / Batch'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'bn'
                  ? 'মেয়াদ ও লট নম্বর সহ ওষুধ মজুত এন্ট্রি'
                  : 'Register physical batch with lot number & expiry for FEFO'}
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

        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Select Medicine
            </label>
            <select
              value={medicineId}
              onChange={e => {
                setMedicineId(e.target.value);
                const m = medicines.find(med => med.id === e.target.value);
                if (m?.retailPricePerBaseUnit) {
                  setRetailPricePerBaseUnit(m.retailPricePerBaseUnit);
                }
              }}
              className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              {medicines.map(m => (
                <option key={m.id} value={m.id}>
                  {m.brandName} {m.strength} ({m.dosageForm}) - {m.genericName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Lot / Batch Number
              </label>
              <input
                type="text"
                value={lotNumber}
                onChange={e => setLotNumber(e.target.value)}
                placeholder="LOT-SQ-9428"
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Batch Status
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as BatchStatus)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="active">Active (Available for Dispensing)</option>
                <option value="near_expiry">Near Expiry (&lt;30 days)</option>
                <option value="quarantined">Quarantined (DGDA hold - Locked)</option>
                <option value="expired">Expired (Hard Locked)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Manufacturing Date
              </label>
              <input
                type="date"
                value={manufacturingDate}
                onChange={e => setManufacturingDate(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Expiry Date (FEFO Key)
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={e => setExpiryDate(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-cyan-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Initial Units (Qty)
              </label>
              <input
                type="number"
                min="1"
                value={initialQuantity}
                onChange={e => setInitialQuantity(parseInt(e.target.value, 10) || 1)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono font-bold text-slate-800 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Cost / Unit (৳)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={costPerBaseUnit}
                onChange={e => setCostPerBaseUnit(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono text-slate-800 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Price / Unit (৳)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={retailPricePerBaseUnit}
                onChange={e => setRetailPricePerBaseUnit(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono font-bold text-slate-800 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Supplier / Source Note
            </label>
            <input
              type="text"
              value={supplierName}
              onChange={e => setSupplierName(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg shadow-sm transition-all"
            >
              Save Batch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
