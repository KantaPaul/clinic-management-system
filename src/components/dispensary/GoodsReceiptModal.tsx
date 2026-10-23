import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  GoodsReceiptItem,
} from '../../types';
import {
  X,
  PackagePlus,
  Plus,
  Trash2,
  AlertCircle,
  Building,
  FileCheck,
  Calendar,
} from 'lucide-react';

interface GoodsReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoodsReceiptModal: React.FC<GoodsReceiptModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    medicines,
    settings,
    currentUser,
    createGoodsReceipt,
    language,
    t,
  } = useClinic();

  const [supplierName, setSupplierName] = useState('Square Pharmaceuticals PLC (Banani Depot)');
  const [supplierInvoiceNo, setSupplierInvoiceNo] = useState(`CH-${Math.floor(100000 + Math.random() * 900000)}`);
  const [receivedDate, setReceivedDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'credit'>('paid');
  const [notes, setNotes] = useState('Scheduled clinic stock replenishment');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [items, setItems] = useState<GoodsReceiptItem[]>([
    {
      medicineId: medicines[0]?.id || 'MED-01',
      brandName: medicines[0]?.brandName || 'Napa Extend',
      genericName: medicines[0]?.genericName || 'Paracetamol',
      lotNumber: `LOT-SQ-${Math.floor(1000 + Math.random() * 9000)}`,
      manufacturingDate: '2026-02-01',
      expiryDate: '2027-12-31',
      packQuantity: 20,
      unitsPerPack: medicines[0]?.unitsPerPack || 10,
      totalBaseUnits: 200,
      costPerPack: 21.00,
      totalCost: 420.00,
      retailPricePerBaseUnit: medicines[0]?.retailPricePerBaseUnit || 2.50,
    },
  ]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    const med = medicines[0] || {
      id: 'MED-01',
      brandName: 'Napa Extend',
      genericName: 'Paracetamol',
      unitsPerPack: 10,
      retailPricePerBaseUnit: 2.5,
    };
    setItems(prev => [
      ...prev,
      {
        medicineId: med.id,
        brandName: med.brandName,
        genericName: med.genericName,
        lotNumber: `LOT-NEW-${Math.floor(1000 + Math.random() * 9000)}`,
        manufacturingDate: '2026-01-01',
        expiryDate: '2027-12-31',
        packQuantity: 10,
        unitsPerPack: med.unitsPerPack || 10,
        totalBaseUnits: 10 * (med.unitsPerPack || 10),
        costPerPack: 25.00,
        totalCost: 250.00,
        retailPricePerBaseUnit: med.retailPricePerBaseUnit || 3.00,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index: number, medId: string) => {
    const med = medicines.find(m => m.id === medId);
    if (!med) return;

    setItems(prev => {
      const copy = [...prev];
      const item = { ...copy[index] };
      item.medicineId = med.id;
      item.brandName = med.brandName;
      item.genericName = med.genericName;
      item.unitsPerPack = med.unitsPerPack || 10;
      item.totalBaseUnits = item.packQuantity * item.unitsPerPack;
      item.totalCost = item.packQuantity * item.costPerPack;
      item.retailPricePerBaseUnit = med.retailPricePerBaseUnit || 3.0;
      copy[index] = item;
      return copy;
    });
  };

  const handleItemFieldChange = (
    index: number,
    field: keyof GoodsReceiptItem,
    value: any
  ) => {
    setItems(prev => {
      const copy = [...prev];
      const item = { ...copy[index], [field]: value };
      if (field === 'packQuantity' || field === 'unitsPerPack') {
        item.totalBaseUnits = Math.max(1, item.packQuantity * item.unitsPerPack);
        item.totalCost = item.packQuantity * item.costPerPack;
      }
      if (field === 'costPerPack') {
        item.totalCost = item.packQuantity * item.costPerPack;
      }
      copy[index] = item;
      return copy;
    });
  };

  const grandTotalCost = items.reduce((acc, it) => acc + it.totalCost, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!supplierName.trim()) {
      setErrorMsg('Please specify pharmaceutical supplier name.');
      return;
    }

    if (items.some(it => !it.lotNumber.trim() || !it.expiryDate)) {
      setErrorMsg('All items must have a Lot / Batch number and Expiry Date.');
      return;
    }

    createGoodsReceipt({
      supplierName,
      supplierInvoiceNo,
      receivedDate,
      receivedByUserId: currentUser.id,
      receivedByName: currentUser.name,
      status: 'verified',
      items,
      totalAmount: grandTotalCost,
      paymentStatus,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-4xl w-full my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {language === 'bn' ? 'গুডস রিসিট নোট (GRN) গ্রহণ' : 'Goods Receipt Note (GRN) Intake'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'bn'
                  ? 'পার্চেজ অর্ডার ব্যতিরেকে সরাসরি স্টক বৃদ্ধি (Idempotent Stock Intake)'
                  : 'Direct receipt-driven stock increase without PO lock (Idempotent Inventory Intake)'}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Supplier & Receipt Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                {language === 'bn' ? 'সরবরাহকারী কোম্পানি:' : 'Supplier / Manufacturer:'}
              </label>
              <input
                type="text"
                value={supplierName}
                onChange={e => setSupplierName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                {language === 'bn' ? 'চালান / ইনভয়েস নং:' : 'Challan / Invoice No:'}
              </label>
              <input
                type="text"
                value={supplierInvoiceNo}
                onChange={e => setSupplierInvoiceNo(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                {language === 'bn' ? 'গ্রহণের তারিখ:' : 'Received Date:'}
              </label>
              <input
                type="date"
                value={receivedDate}
                onChange={e => setReceivedDate(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                {language === 'bn' ? 'পেমেন্ট স্ট্যাটাস:' : 'Payment Status:'}
              </label>
              <select
                value={paymentStatus}
                onChange={e => setPaymentStatus(e.target.value as 'paid' | 'credit')}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="paid">{language === 'bn' ? 'পরিশোধিত (Paid)' : 'Paid'}</option>
                <option value="credit">{language === 'bn' ? 'কোম্পানি বাকি (Supplier Credit)' : 'Supplier Due / Credit'}</option>
              </select>
            </div>
          </div>

          {/* Receipt Lines */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                {language === 'bn' ? 'আগত ওষুধের তালিকা ও লট নম্বর' : 'Received Medicine Lines & Lot Allocation'}
              </h4>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs text-emerald-700 font-semibold hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded border border-emerald-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'ওষুধ যোগ করুন' : 'Add Line'}</span>
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-all text-xs grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center"
                >
                  {/* Medicine Selector */}
                  <div className="md:col-span-3">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase">Medicine</label>
                    <select
                      value={item.medicineId}
                      onChange={e => handleMedicineChange(idx, e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-medium text-slate-800 focus:outline-none"
                    >
                      {medicines.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.brandName} ({m.strength})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Lot Number */}
                  <div className="md:col-span-2">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase">Lot / Batch #</label>
                    <input
                      type="text"
                      value={item.lotNumber}
                      onChange={e => handleItemFieldChange(idx, 'lotNumber', e.target.value)}
                      placeholder="LOT-SQ-1234"
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-mono font-medium text-slate-800 focus:outline-none"
                      required
                    />
                  </div>

                  {/* Expiry Date */}
                  <div className="md:col-span-2">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase">Expiry Date</label>
                    <input
                      type="date"
                      value={item.expiryDate}
                      onChange={e => handleItemFieldChange(idx, 'expiryDate', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-medium text-slate-800 focus:outline-none"
                      required
                    />
                  </div>

                  {/* Quantity (Packs & Units per Pack) */}
                  <div className="md:col-span-2">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase">
                      Strips / Packs ({item.unitsPerPack}/pk)
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="1"
                        value={item.packQuantity}
                        onChange={e => handleItemFieldChange(idx, 'packQuantity', parseInt(e.target.value, 10) || 1)}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-mono font-bold text-slate-800 text-center focus:outline-none"
                        required
                      />
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        = {item.totalBaseUnits} u
                      </span>
                    </div>
                  </div>

                  {/* Cost per pack & Line Total */}
                  <div className="md:col-span-2">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase">Cost / Pack</label>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400 font-mono">৳</span>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={item.costPerPack}
                        onChange={e => handleItemFieldChange(idx, 'costPerPack', parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-mono font-medium text-slate-800 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Remove Button */}
                  <div className="md:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      disabled={items.length <= 1}
                      className="text-slate-300 hover:text-rose-600 disabled:opacity-20 p-1 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              {language === 'bn' ? 'চালান নোট / ডেলিভারি বিবরণ:' : 'Receipt / Challan Notes:'}
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
            />
          </div>

          {/* Footer with Grand Total */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Total Shipment Cost:</span>
              <span className="text-lg font-bold font-mono text-slate-900">
                {settings.currencySymbol}
                {grandTotalCost.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
              >
                <FileCheck className="w-4 h-4" />
                <span>{language === 'bn' ? 'জিআরএন স্টক জমা নিশ্চিত করুন' : 'Confirm Stock Intake (GRN)'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
