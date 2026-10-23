import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { PlusCircle, AlertCircle, Sparkles } from 'lucide-react';
import { VisitCategory } from '../../types';

interface WalkInSerialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalkInSerialModal: React.FC<WalkInSerialModalProps> = ({ isOpen, onClose }) => {
  const { doctors, patients, bookAppointment, settings, language } = useClinic();

  const todayStr = new Date().toISOString().split('T')[0];

  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [doctorId, setDoctorId] = useState(doctors[0]?.id || '');
  const [visitCategory, setVisitCategory] = useState<VisitCategory>('new');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const selectedDoctor = doctors.find(d => d.id === doctorId);
  let estimatedFee = selectedDoctor?.newVisitFee || 1000;
  if (visitCategory === 'returning') estimatedFee = selectedDoctor?.returnVisitFee || 700;
  if (visitCategory === 'report_follow_up') estimatedFee = selectedDoctor?.reportFollowUpFee || 300;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !doctorId) {
      setError('Please select both a patient and a doctor.');
      return;
    }

    const result = bookAppointment({
      patientId,
      doctorId,
      date: todayStr,
      type: 'serial',
      visitCategory,
      notes: notes.trim() || undefined,
    });

    if (result.success) {
      onClose();
      setError('');
      setNotes('');
    } else {
      setError(result.error || 'Failed to issue serial');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-200">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              {language === 'bn' ? 'ওয়াক-ইন সিরিয়াল প্রদান' : 'Issue Walk-in Serial'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'bn' ? 'আজকের জন্য স্বয়ংক্রিয় সিরিয়াল নম্বর তৈরি' : "Auto-assigned serial number for today's clinic shift"}
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
          {/* Patient Selector */}
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
                  {p.name} ({p.id} • {p.phone})
                </option>
              ))}
            </select>
          </div>

          {/* Doctor Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Select Doctor / Chamber *
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

          {/* Visit Category & Fee */}
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

          {/* Clinical reason notes */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Presenting Symptoms / Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Fever for 2 days, back pain"
              className="w-full text-xs border border-slate-300 rounded-xl p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          {/* Fee estimate banner */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
            <span className="text-slate-600">Standard Consultation Fee:</span>
            <span className="font-mono font-bold text-slate-900 text-sm">
              {settings.currencySymbol} {estimatedFee}
            </span>
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
              Issue Serial Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
