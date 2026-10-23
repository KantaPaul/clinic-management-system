import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  Receipt,
  PlusCircle,
  Filter,
  DollarSign,
  Printer,
  CreditCard,
  Smartphone,
  Banknote,
  Search,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  Invoice,
  PaymentMethod,
  PaymentStatus,
  Patient,
  Doctor,
  InvoiceItem,
} from '../../types';
import { ReceiptPrintModal } from './ReceiptPrintModal';

interface BillingManagerProps {
  onOpenInvoiceModal: () => void;
}

export const BillingManager: React.FC<BillingManagerProps> = ({
  onOpenInvoiceModal,
}) => {
  const {
    t,
    settings,
    invoices,
    patients,
    doctors,
    recordPayment,
    language,
  } = useClinic();

  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'partial' | 'due'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Settle / Collect payment modal state
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<Invoice | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('bkash');
  const [payTxId, setPayTxId] = useState('');
  const [paySenderPhone, setPaySenderPhone] = useState('');
  const [paymentError, setPaymentError] = useState('');

  // Receipt modal state
  const [selectedInvoiceForReceipt, setSelectedInvoiceForReceipt] = useState<Invoice | null>(null);

  // Filter invoices
  const filteredInvoices = invoices.filter(inv => {
    const patient = patients.find(p => p.id === inv.patientId);
    const matchesStatus = statusFilter === 'all' || inv.paymentStatus === statusFilter;
    const matchesSearch =
      inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient?.phone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  // Calculate day-end summary metrics
  const todayStr = new Date().toISOString().split('T')[0];
  const todayInvoices = invoices.filter(inv => inv.date === todayStr);

  let cashTotal = 0;
  let bkashTotal = 0;
  let nagadTotal = 0;
  let cardTotal = 0;

  todayInvoices.forEach(inv => {
    inv.transactions.forEach(tx => {
      if (tx.method === 'cash') cashTotal += tx.amount;
      if (tx.method === 'bkash') bkashTotal += tx.amount;
      if (tx.method === 'nagad') nagadTotal += tx.amount;
      if (tx.method === 'card') cardTotal += tx.amount;
    });
  });

  const totalCollectedToday = cashTotal + bkashTotal + nagadTotal + cardTotal;
  const totalDuesOverall = invoices.reduce((sum, inv) => sum + inv.dueAmount, 0);

  const handleOpenPaymentModal = (inv: Invoice) => {
    setSelectedInvoiceForPayment(inv);
    setPayAmount(inv.dueAmount);
    setPayMethod('bkash');
    setPayTxId('');
    setPaySenderPhone('');
    setPaymentError('');
  };

  const handleExecutePayment = () => {
    if (!selectedInvoiceForPayment) return;

    if (payAmount <= 0) {
      setPaymentError('Payment amount must be greater than zero.');
      return;
    }

    if (payAmount > selectedInvoiceForPayment.dueAmount) {
      setPaymentError(`Cannot exceed remaining due amount of ${settings.currencySymbol} ${selectedInvoiceForPayment.dueAmount}.`);
      return;
    }

    if ((payMethod === 'bkash' || payMethod === 'nagad') && !payTxId.trim()) {
      setPaymentError(`Transaction Reference (TxID) is required for ${payMethod.toUpperCase()} payments.`);
      return;
    }

    const res = recordPayment(selectedInvoiceForPayment.id, {
      amount: payAmount,
      method: payMethod,
      transactionReference: payTxId.trim() || undefined,
      senderPhone: paySenderPhone.trim() || undefined,
    });

    if (res.success && res.invoice) {
      setSelectedInvoiceForPayment(null);
      // Automatically pop up receipt
      setSelectedInvoiceForReceipt(res.invoice);
    } else {
      setPaymentError(res.error || 'Payment failed.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{t.billing.title}</h1>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'bn'
              ? 'ইনভয়েস তৈরি, নগদ, বিকাশ ও নগদ লেনদেন সংগ্রহ এবং মানি রিসিট প্রিন্ট'
              : 'Outpatient fee collection, bKash & Nagad TxID logging, dues reconciliation, and receipts'}
          </p>
        </div>

        <button
          onClick={onOpenInvoiceModal}
          className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-md shadow-cyan-600/20 flex items-center space-x-1.5 transition-all self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.billing.createInvoice}</span>
        </button>
      </div>

      {/* Today's Cash Close & Channel Metrics */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700 pb-3">
          <div className="flex items-center space-x-2">
            <Receipt className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-sm tracking-tight">
              {t.billing.cashCloseSummary} ({todayStr})
            </h3>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">Total Collected Today:</span>
            <span className="ml-2 font-mono font-bold text-cyan-400 text-lg">
              {settings.currencySymbol} {totalCollectedToday.toLocaleString()}
            </span>
          </div>
        </div>

        {/* 4 Channels Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Cash */}
          <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-xl">
            <div className="flex items-center space-x-1.5 text-xs text-slate-400">
              <Banknote className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cash (কাউন্টারে নগদ)</span>
            </div>
            <div className="mt-1 font-mono font-bold text-base text-emerald-400">
              {settings.currencySymbol} {cashTotal.toLocaleString()}
            </div>
          </div>

          {/* bKash */}
          <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-xl">
            <div className="flex items-center space-x-1.5 text-xs text-pink-300">
              <Smartphone className="w-3.5 h-3.5 text-pink-400" />
              <span>bKash (বিকাশ)</span>
            </div>
            <div className="mt-1 font-mono font-bold text-base text-pink-400">
              {settings.currencySymbol} {bkashTotal.toLocaleString()}
            </div>
          </div>

          {/* Nagad */}
          <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-xl">
            <div className="flex items-center space-x-1.5 text-xs text-amber-300">
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span>Nagad (নগদ ওয়ালেট)</span>
            </div>
            <div className="mt-1 font-mono font-bold text-base text-amber-400">
              {settings.currencySymbol} {nagadTotal.toLocaleString()}
            </div>
          </div>

          {/* Card */}
          <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-xl">
            <div className="flex items-center space-x-1.5 text-xs text-sky-300">
              <CreditCard className="w-3.5 h-3.5 text-sky-400" />
              <span>Card / POS</span>
            </div>
            <div className="mt-1 font-mono font-bold text-base text-sky-400">
              {settings.currencySymbol} {cardTotal.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search invoice #, patient name, phone..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium self-stretch sm:self-auto">
          {(['all', 'paid', 'partial', 'due'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-lg capitalize transition-all ${
                statusFilter === status
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">{t.billing.invoiceNo}</th>
                <th className="py-3 px-4">{t.billing.date}</th>
                <th className="py-3 px-4">{t.billing.patient}</th>
                <th className="py-3 px-4">{t.billing.amount}</th>
                <th className="py-3 px-4">{t.billing.paid}</th>
                <th className="py-3 px-4">{t.billing.due}</th>
                <th className="py-3 px-4">{t.billing.paymentStatus}</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map(inv => {
                const patient = patients.find(p => p.id === inv.patientId);

                return (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {inv.id}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{inv.date}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{patient?.name}</div>
                      <div className="text-[11px] text-slate-400">{patient?.phone}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                      {settings.currencySymbol} {inv.grandTotal}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                      {settings.currencySymbol} {inv.paidAmount}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold">
                      {inv.dueAmount > 0 ? (
                        <span className="text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                          {settings.currencySymbol} {inv.dueAmount}
                        </span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          inv.paymentStatus === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inv.paymentStatus === 'partial'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {inv.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                      {inv.dueAmount > 0 && (
                        <button
                          onClick={() => handleOpenPaymentModal(inv)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] shadow-xs"
                        >
                          {t.billing.settleDue}
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedInvoiceForReceipt(inv)}
                        className="px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-medium inline-flex items-center space-x-1"
                        title="Print money receipt"
                      >
                        <Printer className="w-3.5 h-3.5 text-cyan-600" />
                        <span>Receipt</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect / Settle Payment Modal */}
      {selectedInvoiceForPayment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {t.billing.recordPayment}
                </h3>
                <p className="text-xs text-slate-500">
                  Invoice {selectedInvoiceForPayment.id} • Due: {settings.currencySymbol} {selectedInvoiceForPayment.dueAmount}
                </p>
              </div>
              <button
                onClick={() => setSelectedInvoiceForPayment(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ×
              </button>
            </div>

            {paymentError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{paymentError}</span>
              </div>
            )}

            {/* Amount input */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Payment Amount ({settings.currencySymbol})
              </label>
              <input
                type="number"
                min="1"
                max={selectedInvoiceForPayment.dueAmount}
                value={payAmount}
                onChange={e => setPayAmount(Number(e.target.value))}
                className="w-full text-sm font-bold border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {t.billing.paymentMethod}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['bkash', 'nagad', 'cash', 'card'] as PaymentMethod[]).map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPayMethod(method)}
                    className={`p-2.5 rounded-xl border text-xs font-bold uppercase transition-all flex items-center justify-center space-x-1.5 ${
                      payMethod === method
                        ? method === 'bkash'
                          ? 'bg-pink-50 text-pink-700 border-pink-400 shadow-xs'
                          : method === 'nagad'
                          ? 'bg-amber-50 text-amber-800 border-amber-400 shadow-xs'
                          : 'bg-cyan-50 text-cyan-800 border-cyan-400 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {method === 'bkash' && <Smartphone className="w-3.5 h-3.5 text-pink-600" />}
                    {method === 'nagad' && <Smartphone className="w-3.5 h-3.5 text-amber-600" />}
                    {method === 'cash' && <Banknote className="w-3.5 h-3.5 text-emerald-600" />}
                    {method === 'card' && <CreditCard className="w-3.5 h-3.5 text-sky-600" />}
                    <span>{method}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* bKash / Nagad TxID & Mobile Number */}
            {(payMethod === 'bkash' || payMethod === 'nagad') && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    {payMethod.toUpperCase()} Transaction ID (TxID) *
                  </label>
                  <input
                    type="text"
                    required
                    value={payTxId}
                    onChange={e => setPayTxId(e.target.value.toUpperCase())}
                    placeholder="e.g. 9X7A2K10"
                    className="w-full text-xs font-mono font-bold uppercase border border-slate-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Verify TxID from customer SMS or Merchant app
                  </span>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Customer Sender Mobile No (Optional)
                  </label>
                  <input
                    type="text"
                    value={paySenderPhone}
                    onChange={e => setPaySenderPhone(e.target.value)}
                    placeholder="e.g. 017XXXXXXXX"
                    className="w-full text-xs font-mono border border-slate-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedInvoiceForPayment(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                {t.common.cancel}
              </button>
              <button
                type="button"
                onClick={handleExecutePayment}
                className="flex-1 px-4 py-2.5 rounded-xl bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-700 shadow-md shadow-cyan-600/20"
              >
                {t.billing.recordPayment}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {selectedInvoiceForReceipt && (
        <ReceiptPrintModal
          invoice={selectedInvoiceForReceipt}
          patient={
            patients.find(p => p.id === selectedInvoiceForReceipt.patientId) ||
            patients[0]
          }
          onClose={() => setSelectedInvoiceForReceipt(null)}
        />
      )}
    </div>
  );
};
