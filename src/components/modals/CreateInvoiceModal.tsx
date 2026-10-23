import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Plus, Trash2, Wallet, AlertCircle } from 'lucide-react';
import { InvoiceItem, PaymentMethod, VisitCategory } from '../../types';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({ isOpen, onClose }) => {
  const {
    patients,
    doctors,
    settings,
    createInvoice,
    recordPayment,
    language,
  } = useClinic();

  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [doctorId, setDoctorId] = useState(doctors[0]?.id || '');
  const [visitCategory, setVisitCategory] = useState<VisitCategory>('new');
  const [discountAmount, setDiscountAmount] = useState(0);

  // Common procedure presets
  const commonProcedures = [
    { name: 'ECG Recording & Report', price: 400 },
    { name: 'Blood Glucose Test (Point of Care)', price: 150 },
    { name: 'Nebulization Therapy (1 Session)', price: 200 },
    { name: 'Surgical Wound Dressing', price: 350 },
    { name: 'IV Injection / Cannulation Admin', price: 250 },
  ];

  const selectedDoctor = doctors.find(d => d.id === doctorId);
  const consultationFee =
    visitCategory === 'new'
      ? selectedDoctor?.newVisitFee || 1000
      : visitCategory === 'returning'
      ? selectedDoctor?.returnVisitFee || 700
      : selectedDoctor?.reportFollowUpFee || 300;

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: 'init-1',
      description: `Consultation Fee - ${visitCategory.replace(/_/g, ' ')} (${selectedDoctor?.name || 'Doctor'})`,
      quantity: 1,
      unitPrice: consultationFee,
      total: consultationFee,
    },
  ]);

  // Payment on creation
  const [collectNow, setCollectNow] = useState(true);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('cash');
  const [txId, setTxId] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Handle category change to update first item fee
  const handleCategoryChange = (cat: VisitCategory) => {
    setVisitCategory(cat);
    const fee =
      cat === 'new'
        ? selectedDoctor?.newVisitFee || 1000
        : cat === 'returning'
        ? selectedDoctor?.returnVisitFee || 700
        : selectedDoctor?.reportFollowUpFee || 300;

    setItems(prev => {
      const copy = [...prev];
      copy[0] = {
        ...copy[0],
        description: `Consultation Fee - ${cat.replace(/_/g, ' ')} (${selectedDoctor?.name || 'Doctor'})`,
        unitPrice: fee,
        total: fee * copy[0].quantity,
      };
      return copy;
    });
  };

  const handleAddProcedure = (proc: { name: string; price: number }) => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: proc.name,
      quantity: 1,
      unitPrice: proc.price,
      total: proc.price,
    };
    setItems(prev => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const grandTotal = Math.max(0, subtotal - discountAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) {
      setError('Please select a patient.');
      return;
    }

    if (collectNow && (payMethod === 'bkash' || payMethod === 'nagad') && !txId.trim()) {
      setError(`Transaction ID (TxID) is required for ${payMethod.toUpperCase()} payments.`);
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    const newInv = createInvoice({
      patientId,
      doctorId: doctorId || undefined,
      date: todayStr,
      items,
      subtotal,
      discountAmount,
      taxAmount: 0,
      grandTotal,
    });

    if (collectNow && grandTotal > 0) {
      recordPayment(newInv.id, {
        amount: grandTotal,
        method: payMethod,
        transactionReference: txId.trim() || undefined,
        senderPhone: senderPhone.trim() || undefined,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4 max-h-[92vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-3 border-b border-slate-200">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              {language === 'bn' ? 'নতুন ইনভয়েস তৈরি ও বিলিং' : 'Create Patient Invoice'}
            </h3>
            <p className="text-xs text-slate-500">
              Consultation charges, laboratory procedures, and payment settlement
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-lg font-bold">
            ×
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Patient */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Select Patient *</label>
            <select
              value={patientId}
              onChange={e => setPatientId(e.target.value)}
              className="w-full text-xs font-semibold border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none bg-white"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.phone})
                </option>
              ))}
            </select>
          </div>

          {/* Doctor & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Doctor / Specialist</label>
              <select
                value={doctorId}
                onChange={e => setDoctorId(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none bg-white"
              >
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Visit Type</label>
              <select
                value={visitCategory}
                onChange={e => handleCategoryChange(e.target.value as any)}
                className="w-full text-xs capitalize border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none bg-white"
              >
                <option value="new">New Visit</option>
                <option value="returning">Return Visit</option>
                <option value="report_follow_up">Report Follow-up</option>
              </select>
            </div>
          </div>

          {/* Line items list */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 block">Billable Items / Services</label>
            {items.map((item, idx) => (
              <div key={item.id} className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <input
                  type="text"
                  value={item.description}
                  onChange={e => {
                    const desc = e.target.value;
                    setItems(prev => prev.map((it, i) => (i === idx ? { ...it, description: desc } : it)));
                  }}
                  className="flex-1 text-xs border border-slate-200 rounded-lg p-1.5 bg-white"
                />
                <input
                  type="number"
                  min="0"
                  value={item.unitPrice}
                  onChange={e => {
                    const price = Number(e.target.value);
                    setItems(prev =>
                      prev.map((it, i) => (i === idx ? { ...it, unitPrice: price, total: price * it.quantity } : it))
                    );
                  }}
                  className="w-20 text-xs font-mono font-bold border border-slate-200 rounded-lg p-1.5 bg-white text-right"
                />
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Quick procedure additions */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              + Add Quick Procedure / Test:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {commonProcedures.map(proc => (
                <button
                  key={proc.name}
                  type="button"
                  onClick={() => handleAddProcedure(proc)}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-cyan-50 hover:text-cyan-800 text-slate-700 font-semibold border border-slate-200 transition-colors"
                >
                  + {proc.name} ({settings.currencySymbol}{proc.price})
                </button>
              ))}
            </div>
          </div>

          {/* Discount & Totals */}
          <div className="pt-2 border-t border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono font-bold text-slate-900">
                {settings.currencySymbol} {subtotal}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Special Discount ({settings.currencySymbol}):</span>
              <input
                type="number"
                min="0"
                max={subtotal}
                value={discountAmount}
                onChange={e => setDiscountAmount(Number(e.target.value))}
                className="w-24 text-xs font-mono font-bold border border-slate-300 rounded-lg p-1 text-right"
              />
            </div>
            <div className="flex justify-between items-center text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
              <span>Net Payable:</span>
              <span className="font-mono text-cyan-800 text-base">
                {settings.currencySymbol} {grandTotal}
              </span>
            </div>
          </div>

          {/* Collect payment immediately */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={collectNow}
                  onChange={e => setCollectNow(e.target.checked)}
                  className="rounded text-cyan-600 focus:ring-cyan-500 w-4 h-4"
                />
                <span>Collect full payment right now at front desk</span>
              </label>
            </div>

            {collectNow && (
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div className="grid grid-cols-4 gap-2">
                  {(['cash', 'bkash', 'nagad', 'card'] as PaymentMethod[]).map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPayMethod(m)}
                      className={`p-2 rounded-xl border text-xs font-bold uppercase transition-all ${
                        payMethod === m
                          ? 'bg-cyan-600 text-white border-cyan-600'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                {(payMethod === 'bkash' || payMethod === 'nagad') && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <input
                        type="text"
                        required
                        value={txId}
                        onChange={e => setTxId(e.target.value.toUpperCase())}
                        placeholder="TxID (e.g. 9X29A10) *"
                        className="w-full text-xs font-mono font-bold border border-slate-300 rounded-lg p-2 bg-white"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={senderPhone}
                        onChange={e => setSenderPhone(e.target.value)}
                        placeholder="Sender phone (e.g. 017...)"
                        className="w-full text-xs font-mono border border-slate-300 rounded-lg p-2 bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-xl bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-700 shadow-md shadow-cyan-600/20"
            >
              Raise Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
