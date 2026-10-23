import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  BarChart3,
  Calendar,
  Wallet,
  Stethoscope,
  Printer,
  Download,
  Users,
  CheckCircle,
  Banknote,
  Smartphone,
  CreditCard,
  FileSpreadsheet,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const {
    t,
    settings,
    invoices,
    appointments,
    doctors,
    patients,
    language,
  } = useClinic();

  const [reportDate, setReportDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Invoices for date
  const dateInvoices = invoices.filter(inv => inv.date === reportDate);
  const totalBilled = dateInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalCollected = dateInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const totalUncollected = dateInvoices.reduce((sum, inv) => sum + inv.dueAmount, 0);

  // Payments collected on date
  let cashAmount = 0;
  let bkashAmount = 0;
  let nagadAmount = 0;
  let cardAmount = 0;

  dateInvoices.forEach(inv => {
    inv.transactions.forEach(tx => {
      if (tx.method === 'cash') cashAmount += tx.amount;
      if (tx.method === 'bkash') bkashAmount += tx.amount;
      if (tx.method === 'nagad') nagadAmount += tx.amount;
      if (tx.method === 'card') cardAmount += tx.amount;
    });
  });

  // Doctor workload on date
  const dateAppointments = appointments.filter(a => a.date === reportDate);
  const completedDateAppointments = dateAppointments.filter(a => a.status === 'completed');

  const doctorStats = doctors.map(doc => {
    const docAppointments = dateAppointments.filter(a => a.doctorId === doc.id);
    const docCompleted = docAppointments.filter(a => a.status === 'completed');
    const docInvoices = dateInvoices.filter(i => i.doctorId === doc.id);
    const docRevenue = docInvoices.reduce((sum, i) => sum + i.paidAmount, 0);

    return {
      doctor: doc,
      totalBooked: docAppointments.length,
      completed: docCompleted.length,
      revenue: docRevenue,
    };
  });

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{t.reports.title}</h1>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'bn'
              ? 'দৈনিক কালেকশন সারসংক্ষেপ, চ্যানেলভিত্তিক জমা ও ডাক্তারদের পারফরম্যান্স স্টেটমেন্ট'
              : 'End-of-day reconciliation, cash register close, channel totals, and doctor productivity'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold">
            <Calendar className="w-4 h-4 text-slate-500" />
            <input
              type="date"
              value={reportDate}
              onChange={e => setReportDate(e.target.value)}
              className="bg-transparent focus:outline-none text-slate-800"
            />
          </div>

          <button
            onClick={handlePrintReport}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md flex items-center space-x-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>{language === 'bn' ? 'রিপোর্ট প্রিন্ট' : 'Print Statement'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Total Revenue Billed</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {settings.currencySymbol} {totalBilled.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {dateInvoices.length} invoices generated on {reportDate}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-emerald-600 block">Total Paid & Collected</span>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {settings.currencySymbol} {totalCollected.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
            {(totalBilled > 0 ? (totalCollected / totalBilled) * 100 : 0).toFixed(1)}% collection rate
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-rose-600 block">Uncollected Balance Due</span>
          <div className="text-2xl font-bold text-rose-600 mt-1">
            {settings.currencySymbol} {totalUncollected.toLocaleString()}
          </div>
          <span className="text-[11px] text-rose-500 mt-1 block">
            Pending receipt settlement
          </span>
        </div>
      </div>

      {/* Payment Channel Breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
            <Wallet className="w-4 h-4 text-cyan-600" />
            <span>{t.reports.byPaymentMethod}</span>
          </h3>
          <span className="text-xs font-bold text-slate-500">
            {reportDate}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold">
              <Banknote className="w-4 h-4 text-emerald-600" />
              <span>Cash Register</span>
            </div>
            <div className="font-mono font-bold text-lg text-slate-900">
              {settings.currencySymbol} {cashAmount.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400">Physical drawer cash</div>
          </div>

          <div className="p-4 rounded-xl bg-pink-50/50 border border-pink-200 space-y-1">
            <div className="flex items-center space-x-2 text-pink-700 text-xs font-semibold">
              <Smartphone className="w-4 h-4 text-pink-600" />
              <span>bKash Merchant / Wallet</span>
            </div>
            <div className="font-mono font-bold text-lg text-pink-700">
              {settings.currencySymbol} {bkashAmount.toLocaleString()}
            </div>
            <div className="text-[10px] text-pink-600/70">Verified with TxID</div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-1">
            <div className="flex items-center space-x-2 text-amber-800 text-xs font-semibold">
              <Smartphone className="w-4 h-4 text-amber-600" />
              <span>Nagad Wallet</span>
            </div>
            <div className="font-mono font-bold text-lg text-amber-800">
              {settings.currencySymbol} {nagadAmount.toLocaleString()}
            </div>
            <div className="text-[10px] text-amber-700/70">Verified with TxID</div>
          </div>

          <div className="p-4 rounded-xl bg-sky-50/50 border border-sky-200 space-y-1">
            <div className="flex items-center space-x-2 text-sky-800 text-xs font-semibold">
              <CreditCard className="w-4 h-4 text-sky-600" />
              <span>Debit / Credit Cards</span>
            </div>
            <div className="font-mono font-bold text-lg text-sky-800">
              {settings.currencySymbol} {cardAmount.toLocaleString()}
            </div>
            <div className="text-[10px] text-sky-600/70">Bank POS terminal</div>
          </div>
        </div>
      </div>

      {/* Doctor Productivity Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
            <Stethoscope className="w-4 h-4 text-cyan-600" />
            <span>{t.reports.doctorWorkload}</span>
          </h3>
          <span className="text-xs text-slate-500">
            {completedDateAppointments.length} visits completed today
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Doctor Name</th>
                <th className="py-3 px-4">Chamber</th>
                <th className="py-3 px-4 text-center">Scheduled</th>
                <th className="py-3 px-4 text-center">Completed Consultations</th>
                <th className="py-3 px-4 text-right">Collections Generated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {doctorStats.map(stat => (
                <tr key={stat.doctor.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {stat.doctor.name}
                    <div className="text-[11px] text-slate-400 font-normal">
                      {stat.doctor.specialty}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{stat.doctor.roomNo}</td>
                  <td className="py-3.5 px-4 text-center font-semibold text-slate-800">
                    {stat.totalBooked}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-emerald-700">
                    {stat.completed}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                    {settings.currencySymbol} {stat.revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
