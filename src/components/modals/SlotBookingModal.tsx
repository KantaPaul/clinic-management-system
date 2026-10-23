import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Clock, AlertCircle } from 'lucide-react';
import { VisitCategory } from '../../types';

interface SlotBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SlotBookingModal: React.FC<SlotBookingModalProps> = ({ isOpen, onClose }) => {
  const { doctors, patients, bookAppointment, appointments, settings, language } = useClinic();

  const todayStr = new Date().toISOString().split('T')[0];

  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [doctorId, setDoctorId] = useState(doctors[0]?.id || '');
  const [date, setDate] = useState(todayStr);
  const [time, setTime] = useState('17:30');
  const [visitCategory, setVisitCategory] = useState<VisitCategory>('new');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const selectedDoctor = doctors.find(d => d.id === doctorId);

  // Pre-generate standard time slots based on doctor start and end times
  const timeSlots = [
    '17:00', '17:15', '17:30', '17:45',
    '18:00', '18:15', '18:30', '18:45',
    '19:00', '19:15', '19:30', '19:45',
    '20:00', '20:15', '20:30', '20:45',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !doctorId || !date || !time) {
      setError('Please fill in all required fields.');
      return;
    }

    const res = bookAppointment({
      patientId,
      doctorId,
      date,
      time,
      type: 'slot',
      visitCategory,
      notes: notes.trim() || undefined,
    });

    if (res.success) {
      onClose();
      setError('');
      setNotes('');
    } else {
      setError(res.error || 'Failed to book slot');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-200">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              {language === 'bn' ? 'টাইম-স্লট অ্যাপয়েন্টমেন্ট বুকিং' : 'Schedule Timed Slot'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'bn' ? 'ওভারল্যাপ প্রতিরোধ সুবিধাসহ নির্ধারিত সময়ের সাক্ষাৎ' : 'Smart schedule with overlap detection & quota enforcement'}
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
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Select Patient *
            </label>
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

          {/* Doctor */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Select Doctor *
            </label>
            <select
              value={doctorId}
              onChange={e => setDoctorId(e.target.value)}
              className="w-full text-xs font-semibold border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none bg-white"
            >
              {doctors.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.specialty} • {d.roomNo})
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Appointment Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-xl p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Time Slot
              </label>
              <select
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full text-xs font-mono font-bold border border-slate-300 rounded-xl p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none bg-white"
              >
                {timeSlots.map(slot => {
                  const isConflict = appointments.some(
                    a =>
                      a.doctorId === doctorId &&
                      a.date === date &&
                      a.time === slot &&
                      a.status !== 'cancelled'
                  );
                  return (
                    <option key={slot} value={slot} disabled={isConflict}>
                      {slot} {isConflict ? '(Booked - Overlap)' : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Visit Category */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Visit Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['new', 'returning', 'report_follow_up'] as VisitCategory[]).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setVisitCategory(cat)}
                  className={`p-2 rounded-xl text-center border text-xs font-medium transition-all ${
                    visitCategory === cat
                      ? 'bg-cyan-50 border-cyan-400 text-cyan-900 font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="block capitalize">{cat.replace(/_/g, ' ')}</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {settings.currencySymbol}
                    {cat === 'new'
                      ? selectedDoctor?.newVisitFee
                      : cat === 'returning'
                      ? selectedDoctor?.returnVisitFee
                      : selectedDoctor?.reportFollowUpFee}
                  </span>
                </button>
              ))}
            </div>
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
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
