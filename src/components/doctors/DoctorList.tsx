import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  Stethoscope,
  Clock,
  DoorOpen,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Doctor } from '../../types';

export const DoctorList: React.FC = () => {
  const { t, doctors, settings, language, addDoctor } = useClinic();
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);

  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [degrees, setDegrees] = useState('');
  const [bmdcRegNo, setBmdcRegNo] = useState('BMDC Reg: A-');
  const [roomNo, setRoomNo] = useState('Room 204');
  const [phone, setPhone] = useState('+880 17');
  const [newFee, setNewFee] = useState(1000);
  const [returnFee, setReturnFee] = useState(700);
  const [reportFee, setReportFee] = useState(300);

  const handleCreateDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !specialty) return;

    addDoctor({
      name,
      title: 'Consultant Specialist',
      specialty,
      bmdcRegNo,
      degrees,
      roomNo,
      phone,
      email: `${name.toLowerCase().replace(/[^a-z]/g, '')}@carepointclinic.com.bd`,
      newVisitFee: newFee,
      returnVisitFee: returnFee,
      reportFollowUpFee: reportFee,
      availableDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
      startTime: '17:00',
      endTime: '21:00',
      slotDurationMinutes: 15,
      maxSerialsPerDay: 20,
      isActive: true,
    });

    setShowAddDoctorModal(false);
    setName('');
    setSpecialty('');
    setDegrees('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{t.doctor.directory}</h1>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'bn'
              ? 'বিএমডিসি নিবন্ধিত বিশেষজ্ঞ ডাক্তার, চেম্বার সময় ও ভিজিট ফি কাঠামো'
              : 'Registered medical specialists, chamber schedules, BMDC certifications, and fee scales'}
          </p>
        </div>

        <button
          onClick={() => setShowAddDoctorModal(true)}
          className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-md shadow-cyan-600/20 flex items-center space-x-1.5 transition-all self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{language === 'bn' ? 'নতুন ডাক্তার যুক্ত করুন' : 'Add Specialist Doctor'}</span>
        </button>
      </div>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map(doctor => (
          <div
            key={doctor.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between hover:border-cyan-300 transition-all"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-100 uppercase">
                    {doctor.roomNo}
                  </span>
                  <h3 className="font-bold text-base text-slate-900 mt-1">
                    {language === 'bn' && doctor.nameBn ? doctor.nameBn : doctor.name}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    {language === 'bn' && doctor.degreesBn ? doctor.degreesBn : doctor.degrees}
                  </p>
                  <p className="text-xs text-cyan-700 font-bold mt-0.5">
                    {language === 'bn' && doctor.specialtyBn ? doctor.specialtyBn : doctor.specialty}
                  </p>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" title="Active on duty" />
              </div>

              {/* BMDC Registration Badge */}
              <div className="mt-3 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                <span>{doctor.bmdcRegNo}</span>
              </div>

              {/* Schedule and Shift Info */}
              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5 text-slate-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Days: <strong>{doctor.availableDays.join(', ')}</strong>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Shift: <strong>{doctor.startTime} - {doctor.endTime}</strong> ({doctor.slotDurationMinutes} min slots)
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-slate-500">
                  <span>Quota: Max {doctor.maxSerialsPerDay} serials / session</span>
                </div>
              </div>

              {/* Fee Schedule */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  {t.doctor.consultationFees}:
                </span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-500 block">New Visit</span>
                    <strong className="text-xs font-mono text-slate-900">
                      {settings.currencySymbol} {doctor.newVisitFee}
                    </strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-500 block">Return</span>
                    <strong className="text-xs font-mono text-slate-900">
                      {settings.currencySymbol} {doctor.returnVisitFee}
                    </strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-500 block">Report</span>
                    <strong className="text-xs font-mono text-slate-900">
                      {settings.currencySymbol} {doctor.reportFollowUpFee}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center">
                <Phone className="w-3 h-3 text-slate-400 mr-1" />
                {doctor.phone}
              </span>
              <span className="text-emerald-600 font-semibold flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Active
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Doctor Modal */}
      {showAddDoctorModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">Add Specialist Doctor</h3>
              <button
                onClick={() => setShowAddDoctorModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateDoctor} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Doctor Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Dr. Mahbubur Rahman"
                  className="w-full text-xs border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Specialty</label>
                  <input
                    type="text"
                    required
                    value={specialty}
                    onChange={e => setSpecialty(e.target.value)}
                    placeholder="e.g. Gastroenterology"
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">BMDC Reg No</label>
                  <input
                    type="text"
                    required
                    value={bmdcRegNo}
                    onChange={e => setBmdcRegNo(e.target.value)}
                    className="w-full text-xs font-mono font-bold border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Degrees & Credentials</label>
                <input
                  type="text"
                  required
                  value={degrees}
                  onChange={e => setDegrees(e.target.value)}
                  placeholder="e.g. MBBS, FCPS, MD"
                  className="w-full text-xs border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Room No</label>
                  <input
                    type="text"
                    value={roomNo}
                    onChange={e => setRoomNo(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">New Fee ({settings.currencySymbol})</label>
                  <input
                    type="number"
                    value={newFee}
                    onChange={e => setNewFee(Number(e.target.value))}
                    className="w-full text-xs font-bold border border-slate-300 rounded-lg p-1.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Return Fee</label>
                  <input
                    type="number"
                    value={returnFee}
                    onChange={e => setReturnFee(Number(e.target.value))}
                    className="w-full text-xs font-bold border border-slate-300 rounded-lg p-1.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Report Follow-up</label>
                  <input
                    type="number"
                    value={reportFee}
                    onChange={e => setReportFee(Number(e.target.value))}
                    className="w-full text-xs font-bold border border-slate-300 rounded-lg p-1.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddDoctorModal(false)}
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-700 shadow-md shadow-cyan-600/20"
                >
                  Save Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
