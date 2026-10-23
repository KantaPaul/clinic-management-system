import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Filter,
  CheckCircle,
  XCircle,
  PlayCircle,
  PlusCircle,
  Phone,
  AlertTriangle,
  FileText,
  DollarSign,
} from 'lucide-react';
import { Appointment, AppointmentStatus, VisitCategory } from '../../types';

interface QueueManagerProps {
  onOpenSerialModal: () => void;
  onOpenSlotModal: () => void;
}

export const QueueManager: React.FC<QueueManagerProps> = ({
  onOpenSerialModal,
  onOpenSlotModal,
}) => {
  const {
    t,
    settings,
    appointments,
    doctors,
    patients,
    currentUser,
    updateAppointmentStatus,
    startConsultation,
    language,
    setActiveTab,
  } = useClinic();

  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [activeSubTab, setActiveSubTab] = useState<'waiting' | 'in_consultation' | 'completed' | 'all'>('waiting');

  // Filter appointments
  const filteredAppointments = appointments.filter(apt => {
    const matchesDoctor = selectedDoctorId === 'all' || apt.doctorId === selectedDoctorId;
    const matchesDate = apt.date === selectedDate;
    if (!matchesDoctor || !matchesDate) return false;

    if (activeSubTab === 'waiting') return apt.status === 'waiting';
    if (activeSubTab === 'in_consultation') return apt.status === 'in_consultation';
    if (activeSubTab === 'completed') return apt.status === 'completed';
    return true; // 'all'
  });

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'waiting':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
            {t.queue.waiting}
          </span>
        );
      case 'in_consultation':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-ping" />
            {t.queue.inConsultation}
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <CheckCircle className="w-3 h-3 text-emerald-600 mr-1" />
            {t.queue.completed}
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-500 mr-1" />
            {t.queue.cancelled}
          </span>
        );
      case 'scheduled':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <Clock className="w-3 h-3 text-sky-500 mr-1" />
            {t.queue.scheduled}
          </span>
        );
    }
  };

  const waitingTotal = appointments.filter(
    a => a.date === selectedDate && (selectedDoctorId === 'all' || a.doctorId === selectedDoctorId) && a.status === 'waiting'
  ).length;

  const inChamberTotal = appointments.filter(
    a => a.date === selectedDate && (selectedDoctorId === 'all' || a.doctorId === selectedDoctorId) && a.status === 'in_consultation'
  ).length;

  const completedTotal = appointments.filter(
    a => a.date === selectedDate && (selectedDoctorId === 'all' || a.doctorId === selectedDoctorId) && a.status === 'completed'
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{t.queue.title}</h1>
          <p className="text-xs text-slate-500 mt-1">{t.queue.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {currentUser.role !== 'accountant' && (
            <>
              <button
                onClick={onOpenSerialModal}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-md shadow-cyan-600/20 transition-all flex items-center space-x-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t.dashboard.issueSerial}</span>
              </button>
              <button
                onClick={onOpenSlotModal}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all flex items-center space-x-1.5"
              >
                <Clock className="w-4 h-4 text-cyan-600" />
                <span>{t.queue.bookSlot}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filters Bar: Doctor & Date */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Doctor filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedDoctorId}
              onChange={e => setSelectedDoctorId(e.target.value)}
              className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            >
              <option value="all">{t.queue.allDoctors}</option>
              {doctors.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.roomNo})
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Status Tab buttons */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setActiveSubTab('waiting')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'waiting'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>{t.queue.tabWaiting}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
              {waitingTotal}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('in_consultation')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'in_consultation'
                ? 'bg-white text-emerald-800 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>{t.queue.tabInConsultation}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              {inChamberTotal}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('completed')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'completed'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>{t.queue.tabCompleted}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
              {completedTotal}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.queue.tabAll}
          </button>
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredAppointments.length === 0 ? (
          <div className="p-12 text-center">
            <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-slate-700">
              {language === 'bn' ? 'কোনো অ্যাপয়েন্টমেন্ট পাওয়া যায়নি' : 'No visits matching this filter'}
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'bn'
                ? 'নতুন সিরিয়াল দিতে উপরের "ওয়াক-ইন সিরিয়াল প্রদান" বাটনে ক্লিক করুন।'
                : 'Issue a serial or book a timed slot to add patients to today\'s queue.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">{t.queue.serialNo}</th>
                  <th className="py-3.5 px-4">{t.queue.patientName}</th>
                  <th className="py-3.5 px-4">{t.doctor.chamberRoom} & Doctor</th>
                  <th className="py-3.5 px-4">{t.queue.type} & Fee</th>
                  <th className="py-3.5 px-4">{t.queue.status}</th>
                  <th className="py-3.5 px-4 text-right">{t.queue.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAppointments.map(apt => {
                  const patient = patients.find(p => p.id === apt.patientId);
                  const doctor = doctors.find(d => d.id === apt.doctorId);

                  return (
                    <tr
                      key={apt.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        apt.status === 'in_consultation' ? 'bg-emerald-50/20' : ''
                      }`}
                    >
                      {/* Serial / Slot */}
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {apt.type === 'serial' ? (
                          <div className="flex items-center space-x-1.5">
                            <span className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold text-xs">
                              #{apt.serialNumber}
                            </span>
                            <span className="text-[10px] text-slate-400">Walk-in</span>
                          </div>
                        ) : (
                          <div>
                            <span className="font-semibold text-slate-900">{apt.time}</span>
                            <span className="block text-[10px] text-slate-400">Timed Slot</span>
                          </div>
                        )}
                      </td>

                      {/* Patient Details */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">
                          {patient?.name || apt.patientId}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center space-x-2 mt-0.5">
                          <span className="flex items-center">
                            <Phone className="w-3 h-3 text-slate-400 mr-1" />
                            {patient?.phone}
                          </span>
                          <span>•</span>
                          <span>{patient?.age} yrs, {patient?.gender}</span>
                          <span>•</span>
                          <span className="font-semibold text-rose-600 bg-rose-50 px-1 rounded">
                            {patient?.bloodGroup}
                          </span>
                        </div>
                        {apt.notes && (
                          <div className="text-[11px] text-slate-400 italic mt-0.5 truncate max-w-xs">
                            "{apt.notes}"
                          </div>
                        )}
                      </td>

                      {/* Doctor & Room */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{doctor?.name}</div>
                        <div className="text-[11px] text-cyan-700 font-medium">
                          {doctor?.roomNo} • {doctor?.specialty}
                        </div>
                      </td>

                      {/* Type & Fee */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block capitalize font-medium text-slate-700">
                          {apt.visitCategory.replace(/_/g, ' ')}
                        </span>
                        <div className="text-[11px] font-bold text-slate-900 mt-0.5">
                          {settings.currencySymbol} {apt.feeAmount}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">{getStatusBadge(apt.status)}</td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                        {apt.status === 'scheduled' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'waiting')}
                            className="px-2.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-[11px] shadow-xs"
                          >
                            {t.queue.checkIn}
                          </button>
                        )}

                        {apt.status === 'waiting' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'in_consultation')}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] shadow-xs inline-flex items-center space-x-1"
                          >
                            <PlayCircle className="w-3.5 h-3.5" />
                            <span>{t.queue.callIn}</span>
                          </button>
                        )}

                        {apt.status === 'in_consultation' && (
                          <button
                            onClick={() => startConsultation(apt)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] shadow-xs inline-flex items-center space-x-1"
                          >
                            <Stethoscope className="w-3.5 h-3.5" />
                            <span>{language === 'bn' ? 'প্রেসক্রিপশন শুরু করুন' : 'Write Prescription'}</span>
                          </button>
                        )}

                        {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                            className="px-2 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 text-[11px]"
                            title="Cancel Appointment"
                          >
                            {t.queue.cancel}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
