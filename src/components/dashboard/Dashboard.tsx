import React from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  Calendar,
  Users,
  Wallet,
  AlertCircle,
  PlusCircle,
  UserPlus,
  Stethoscope,
  ArrowRight,
  Clock,
  CheckCircle2,
  Phone,
  DoorOpen,
} from 'lucide-react';
import { Appointment } from '../../types';

interface DashboardProps {
  onOpenPatientModal: () => void;
  onOpenSerialModal: () => void;
  onOpenSlotModal: () => void;
  onOpenInvoiceModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onOpenPatientModal,
  onOpenSerialModal,
  onOpenSlotModal,
  onOpenInvoiceModal,
}) => {
  const {
    t,
    settings,
    appointments,
    doctors,
    patients,
    invoices,
    currentUser,
    setActiveTab,
    startConsultation,
    updateAppointmentStatus,
    language,
  } = useClinic();

  const todayStr = new Date().toISOString().split('T')[0];

  // Filter today's appointments
  const todayAppointments = appointments.filter(a => a.date === todayStr);
  const waitingAppointments = todayAppointments.filter(a => a.status === 'waiting');
  const inConsultationAppointments = todayAppointments.filter(a => a.status === 'in_consultation');
  const completedAppointments = todayAppointments.filter(a => a.status === 'completed');

  // Today's collections from invoices
  const todayInvoices = invoices.filter(inv => inv.date === todayStr);
  const totalCollections = todayInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const totalDues = invoices.reduce((sum, inv) => sum + inv.dueAmount, 0);

  // Group today's collections by payment method
  let bkashTotal = 0;
  let nagadTotal = 0;
  let cashTotal = 0;
  let cardTotal = 0;

  todayInvoices.forEach(inv => {
    inv.transactions.forEach(tx => {
      if (tx.method === 'bkash') bkashTotal += tx.amount;
      if (tx.method === 'nagad') nagadTotal += tx.amount;
      if (tx.method === 'cash') cashTotal += tx.amount;
      if (tx.method === 'card') cardTotal += tx.amount;
    });
  });

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-cyan-900 via-slate-800 to-cyan-950 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>{language === 'bn' ? 'সক্রিয় চেম্বার ড্যাশবোর্ড' : 'Live Outpatient Ops Center'}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {language === 'bn'
              ? `স্বাগতম, ${currentUser.name}`
              : `Welcome back, ${currentUser.name}`}
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            {language === 'bn'
              ? `${settings.nameBn} - আজকের অ্যাপয়েন্টমেন্ট ও চেম্বার কার্যক্রম`
              : `${settings.name} - Front desk & doctor chamber operational overview`}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {currentUser.role !== 'accountant' && (
            <>
              <button
                onClick={onOpenSerialModal}
                className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center space-x-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t.dashboard.issueSerial}</span>
              </button>
              <button
                onClick={onOpenPatientModal}
                className="px-3.5 py-2 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-white text-xs font-semibold transition-all border border-slate-600 flex items-center space-x-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>{t.dashboard.newPatient}</span>
              </button>
            </>
          )}

          {currentUser.role !== 'doctor' && (
            <button
              onClick={onOpenInvoiceModal}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-md flex items-center space-x-1.5"
            >
              <Wallet className="w-4 h-4" />
              <span>{t.dashboard.createInvoice}</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Core KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Appointments */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">{t.dashboard.todayAppointments}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{todayAppointments.length}</h3>
            <div className="flex items-center space-x-2 mt-2 text-[11px] text-slate-600">
              <span className="text-emerald-600 font-semibold">{completedAppointments.length} done</span>
              <span>•</span>
              <span className="text-amber-600 font-semibold">{waitingAppointments.length} waiting</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Patients in Queue */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">{t.dashboard.patientsInQueue}</p>
            <h3 className="text-2xl font-bold text-amber-600 mt-1">{waitingAppointments.length}</h3>
            <div className="flex items-center space-x-1 mt-2 text-[11px] text-slate-600">
              <Clock className="w-3.5 h-3.5 text-amber-500 mr-1" />
              <span>{language === 'bn' ? 'গড় অপেক্ষার সময়: ~১৫ মিনিট' : 'Est. wait: ~15 mins'}</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Today's Collections */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">{t.dashboard.todayCollections}</p>
            <h3 className="text-2xl font-bold text-emerald-700 mt-1">
              {settings.currencySymbol} {totalCollections.toLocaleString()}
            </h3>
            <div className="flex items-center space-x-2 mt-2 text-[10px] text-slate-500 font-medium">
              <span className="bg-pink-50 text-pink-700 px-1.5 py-0.5 rounded border border-pink-100">
                bKash: {settings.currencySymbol}{bkashTotal}
              </span>
              <span className="bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-100">
                Nagad: {settings.currencySymbol}{nagadTotal}
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        {/* Outstanding Dues */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">{t.dashboard.pendingDues}</p>
            <h3 className="text-2xl font-bold text-rose-600 mt-1">
              {settings.currencySymbol} {totalDues.toLocaleString()}
            </h3>
            <div className="flex items-center space-x-1 mt-2 text-[11px] text-slate-500">
              <span className="text-rose-600 font-semibold">
                {invoices.filter(i => i.dueAmount > 0).length} {language === 'bn' ? 'টি বকেয়া ইনভয়েস' : 'unsettled bills'}
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Live Doctor Chamber Occupancy Grid */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <DoorOpen className="w-5 h-5 text-cyan-600" />
            <h2 className="text-base font-bold text-slate-900">
              {t.dashboard.liveDoctorOccupancy}
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('queue')}
            className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 flex items-center space-x-1"
          >
            <span>{language === 'bn' ? 'সম্পূর্ণ কিউ বোর্ড দেখুন' : 'View Full Queue Board'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {doctors.map(doc => {
            // Find current active patient in consultation
            const activeApt = inConsultationAppointments.find(a => a.doctorId === doc.id);
            const activePatient = activeApt ? patients.find(p => p.id === activeApt.patientId) : null;

            // Find next waiting patient
            const doctorWaitingList = waitingAppointments.filter(a => a.doctorId === doc.id);
            const nextApt = doctorWaitingList[0];
            const nextPatient = nextApt ? patients.find(p => p.id === nextApt.patientId) : null;

            return (
              <div
                key={doc.id}
                className={`rounded-xl border p-4 transition-all ${
                  activePatient
                    ? 'border-emerald-300 bg-emerald-50/30'
                    : doctorWaitingList.length > 0
                    ? 'border-amber-200 bg-amber-50/20'
                    : 'border-slate-200 bg-slate-50/60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {doc.roomNo}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-0.5">
                      {language === 'bn' && doc.nameBn ? doc.nameBn : doc.name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {language === 'bn' && doc.specialtyBn ? doc.specialtyBn : doc.specialty}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      activePatient
                        ? 'bg-emerald-100 text-emerald-800'
                        : doctorWaitingList.length > 0
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {activePatient
                      ? language === 'bn' ? 'রোগী দেখছেন' : 'Consulting'
                      : doctorWaitingList.length > 0
                      ? language === 'bn' ? 'অপেক্ষমাণ' : 'Available'
                      : language === 'bn' ? 'খালি' : 'Idle'}
                  </span>
                </div>

                {/* Serving Now box */}
                <div className="mt-4 pt-3 border-t border-slate-200/60">
                  <div className="text-[11px] text-slate-500 font-medium">
                    {t.dashboard.servingNow}:
                  </div>
                  {activePatient ? (
                    <div className="mt-1 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-emerald-900">
                          {activeApt?.serialNumber ? `Serial #${activeApt.serialNumber}: ` : ''}
                          {activePatient.name}
                        </div>
                        <div className="text-[11px] text-emerald-700">
                          {activePatient.age} yrs • {activePatient.phone}
                        </div>
                      </div>
                      {(currentUser.role === 'doctor' || currentUser.role === 'admin') && (
                        <button
                          onClick={() => {
                            if (activeApt) startConsultation(activeApt);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold"
                        >
                          {language === 'bn' ? 'প্রেসক্রিপশন' : 'Rx Room'}
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 italic mt-0.5">
                      {language === 'bn' ? 'বর্তমানে কেউ চেম্বারে নেই' : 'No patient in chamber right now'}
                    </div>
                  )}
                </div>

                {/* Next in line */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 block">{t.dashboard.nextInQueue}:</span>
                    <span className="text-xs font-medium text-slate-700 truncate block">
                      {nextPatient
                        ? `${nextApt?.serialNumber ? `#${nextApt.serialNumber} ` : ''}${nextPatient.name}`
                        : language === 'bn' ? 'কিউ খালি' : 'Queue Empty'}
                    </span>
                  </div>
                  {nextApt && (
                    <button
                      onClick={() => updateAppointmentStatus(nextApt.id, 'in_consultation')}
                      className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-[11px] font-semibold shrink-0"
                    >
                      {language === 'bn' ? 'কল করুন' : 'Call Next'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's Live Queue List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              {language === 'bn' ? 'আজকের সার্বিক সিরিয়াল ও রোগীর তালিকা' : "Today's Patient Schedule & Queue"}
            </h3>
            <p className="text-xs text-slate-500">
              {todayAppointments.length} {language === 'bn' ? 'টি ভিজিট নিবন্ধিত' : 'total encounters today'}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('queue')}
            className="text-xs font-semibold text-cyan-600 hover:text-cyan-700"
          >
            {language === 'bn' ? 'বিস্তারিত কিউ ব্যবস্থাপনা' : 'Manage Queue Board'} &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">{t.queue.serialNo}</th>
                <th className="py-3 px-4">{t.queue.patientName}</th>
                <th className="py-3 px-4">Doctor & Room</th>
                <th className="py-3 px-4">{t.queue.type}</th>
                <th className="py-3 px-4">{t.queue.status}</th>
                <th className="py-3 px-4 text-right">{t.queue.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {todayAppointments.slice(0, 8).map(apt => {
                const patient = patients.find(p => p.id === apt.patientId);
                const doctor = doctors.find(d => d.id === apt.doctorId);

                return (
                  <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {apt.serialNumber ? `#${apt.serialNumber}` : apt.time || '—'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">
                        {patient?.name || apt.patientId}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center space-x-1">
                        <Phone className="w-3 h-3 text-slate-400 inline" />
                        <span>{patient?.phone}</span>
                        <span>•</span>
                        <span>{patient?.age}y, {patient?.gender}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{doctor?.name}</div>
                      <div className="text-[11px] text-slate-500">{doctor?.roomNo}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                        {apt.visitCategory.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          apt.status === 'in_consultation'
                            ? 'bg-emerald-100 text-emerald-800'
                            : apt.status === 'waiting'
                            ? 'bg-amber-100 text-amber-800'
                            : apt.status === 'completed'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-sky-100 text-sky-800'
                        }`}
                      >
                        {apt.status === 'in_consultation' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />}
                        {apt.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      {apt.status === 'scheduled' && (
                        <button
                          onClick={() => updateAppointmentStatus(apt.id, 'waiting')}
                          className="px-2 py-1 rounded-md bg-cyan-600 hover:bg-cyan-700 text-white font-medium text-[11px]"
                        >
                          {t.queue.checkIn}
                        </button>
                      )}
                      {apt.status === 'waiting' && (
                        <button
                          onClick={() => updateAppointmentStatus(apt.id, 'in_consultation')}
                          className="px-2 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px]"
                        >
                          {t.queue.callIn}
                        </button>
                      )}
                      {apt.status === 'in_consultation' && (
                        <button
                          onClick={() => startConsultation(apt)}
                          className="px-2 py-1 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-[11px]"
                        >
                          {language === 'bn' ? 'প্রেসক্রিপশন' : 'Consult'}
                        </button>
                      )}
                      {apt.status === 'completed' && (
                        <span className="text-emerald-600 text-xs flex items-center justify-end font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          {language === 'bn' ? 'সম্পন্ন' : 'Done'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
