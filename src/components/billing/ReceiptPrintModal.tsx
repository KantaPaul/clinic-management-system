import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Invoice, Patient } from '../../types';
import { Printer, X, CheckCircle, Receipt, Building2 } from 'lucide-react';

interface ReceiptPrintModalProps {
  invoice: Invoice;
  patient: Patient;
  onClose: () => void;
}

export const ReceiptPrintModal: React.FC<ReceiptPrintModalProps> = ({
  invoice,
  patient,
  onClose,
}) => {
  const { settings, language } = useClinic();
  const [format, setFormat] = useState<'a5' | 'thermal'>('a5');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Top Controls Bar (Hidden on print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center space-x-3">
            <span className="font-bold text-sm tracking-tight">
              Receipt: {invoice.id}
            </span>
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setFormat('a5')}
                className={`px-3 py-1 rounded-md transition-all ${
                  format === 'a5' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                A5 Slip
              </button>
              <button
                onClick={() => setFormat('thermal')}
                className={`px-3 py-1 rounded-md transition-all ${
                  format === 'thermal' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Thermal (80mm)
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-600/30 flex items-center space-x-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'bn' ? 'রিসিট প্রিন্ট' : 'Print Slip'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100 print:bg-white print:p-0">
          <div
            id="receipt-paper"
            className={`bg-white mx-auto shadow-md print:shadow-none p-6 border border-slate-200 print:border-none text-slate-800 ${
              format === 'a5' ? 'max-w-[480px]' : 'max-w-[320px] font-mono text-xs'
            }`}
          >
            {/* Header */}
            <div className="text-center border-b border-slate-200 pb-3 mb-3">
              <h2 className="font-bold text-base text-slate-900 uppercase tracking-tight">
                {language === 'bn' ? settings.nameBn : settings.name}
              </h2>
              <p className="text-[11px] text-slate-500">{settings.address}</p>
              <p className="text-[10px] text-slate-500 font-mono">Tel: {settings.phone}</p>
              <div className="mt-2 inline-block px-3 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold uppercase tracking-wider">
                Money Receipt / কালেকশন রিসিট
              </div>
            </div>

            {/* Receipt Meta */}
            <div className="text-xs space-y-1 mb-4 border-b border-slate-200 pb-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Receipt No:</span>
                <span className="font-mono font-bold text-slate-900">{invoice.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Time:</span>
                <span className="font-medium text-slate-800">
                  {invoice.date} {new Date(invoice.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Patient:</span>
                <span className="font-bold text-slate-900">
                  {patient.name} ({patient.id})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone:</span>
                <span className="text-slate-700">{patient.phone}</span>
              </div>
            </div>

            {/* Line Items */}
            <table className="w-full text-xs mb-3">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold text-[10px] uppercase">
                  <th className="text-left py-1">Item / Service</th>
                  <th className="text-center py-1">Qty</th>
                  <th className="text-right py-1">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items.map(item => (
                  <tr key={item.id} className="py-1.5">
                    <td className="py-1.5 text-slate-800 font-medium">{item.description}</td>
                    <td className="py-1.5 text-center text-slate-500">{item.quantity}</td>
                    <td className="py-1.5 text-right font-mono font-semibold text-slate-900">
                      {settings.currencySymbol} {item.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="border-t border-slate-200 pt-2 space-y-1 text-xs mb-4">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono">{settings.currencySymbol} {invoice.subtotal}</span>
              </div>
              {invoice.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount:</span>
                  <span className="font-mono">- {settings.currencySymbol} {invoice.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-slate-900 text-sm border-t border-slate-200 pt-1">
                <span>Total Payable:</span>
                <span className="font-mono">{settings.currencySymbol} {invoice.grandTotal}</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-700 text-sm">
                <span>Amount Paid:</span>
                <span className="font-mono">{settings.currencySymbol} {invoice.paidAmount}</span>
              </div>
              {invoice.dueAmount > 0 && (
                <div className="flex justify-between font-bold text-rose-600 text-sm bg-rose-50 p-1 rounded">
                  <span>Balance Due:</span>
                  <span className="font-mono">{settings.currencySymbol} {invoice.dueAmount}</span>
                </div>
              )}
            </div>

            {/* Payment Transactions & bKash/Nagad Ref */}
            {invoice.transactions.length > 0 && (
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 mb-4 text-[11px] space-y-1">
                <span className="font-bold text-slate-700 uppercase tracking-wider block text-[10px]">
                  Payment Breakdown:
                </span>
                {invoice.transactions.map((tx, idx) => (
                  <div key={tx.id || idx} className="flex justify-between items-center text-slate-700">
                    <span className="capitalize font-semibold">
                      {tx.method.toUpperCase()}
                      {tx.transactionReference && (
                        <span className="text-cyan-800 font-mono text-[10px] ml-1">
                          (TxID: {tx.transactionReference})
                        </span>
                      )}
                      {tx.senderPhone && (
                        <span className="text-slate-400 text-[10px] ml-1">
                          [{tx.senderPhone}]
                        </span>
                      )}
                    </span>
                    <span className="font-mono font-bold">
                      {settings.currencySymbol} {tx.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-dashed border-slate-300 pt-3 text-center text-[10px] text-slate-400 space-y-1">
              <p>{settings.receiptFooterNote}</p>
              <div className="flex justify-between pt-4 text-slate-600 font-medium">
                <span>Served by: Cashier Desk</span>
                <span>Authorized Signature</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
