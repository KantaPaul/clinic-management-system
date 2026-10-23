import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  Users,
  Search,
  PlusCircle,
  Phone,
  Calendar,
  AlertTriangle,
  History,
  FileText,
  User,
  Receipt,
} from 'lucide-react';
import { Patient } from '../../types';

interface PatientListProps {
  onOpenPatientModal: () => void;
}

export const PatientList: React.FC<PatientListProps> = ({ onOpenPatientModal }) => {
  const { t, patients, prescriptions, invoices, settings, language } = useClinic();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientForDrawer, setSelectedPatientForDrawer] = useState<Patient | null>(null);

  const filteredPatients = patients.filter(p => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      p.id.toLowerCase().includes(q) ||
      (p.email && p.email.toLowerCase().includes(q))
    );
  });

  const patientPrescriptions = selectedPatientForDrawer
    ? prescriptions.filter(rx => rx.patientId === selectedPatientForDrawer.id)
    : [];

  const patientInvoices = selectedPatientForDrawer
    ? invoices.filter(inv => inv.patientId === selectedPatientForDrawer.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{t.patient.directory}</h1>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'bn'
              ? 'রোগীদের ডিজিটাল রেকর্ড, যোগাযোগ, রক্তের গ্রুপ ও চিকিৎসা ইতিহাস'
              : 'Electronic medical record directory: demographics, allergies, visit history, and invoices'}
          </p>
        </div>

        <button
          onClick={onOpenPatientModal}
          className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-md shadow-cyan-600/20 flex items-center space-x-1.5 transition-all self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.patient.addPatient}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t.patient.searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50"
          />
        </div>
      </div>

      {/* Patient Cards / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map(patient => (
          <div
            key={patient.id}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-cyan-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[10px] font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-100">
                    {patient.id}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 mt-1">
                    {language === 'bn' && patient.nameBn ? patient.nameBn : patient.name}
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-bold text-xs border border-rose-100">
                  {patient.bloodGroup}
                </span>
              </div>

              <div className="mt-3 text-xs text-slate-600 space-y-1">
                <div className="flex items-center text-slate-500">
                  <Phone className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                  <span className="font-mono text-slate-800 font-semibold">{patient.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400">Demographics: </span>
                  <strong className="text-slate-700">{patient.age}</strong> yrs,{' '}
                  <span className="capitalize">{patient.gender}</span>
                </div>
                <div className="truncate text-slate-500">
                  <span className="text-slate-400">Address: </span>
                  {patient.address}
                </div>
              </div>

              {/* Allergy alert */}
              {patient.allergies.length > 0 && (
                <div className="mt-2.5 p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-[10px] text-rose-700 font-semibold flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                  <span className="truncate">Allergy: {patient.allergies.join(', ')}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                {patient.totalVisits} {language === 'bn' ? 'টি ভিজিট' : 'visits recorded'}
              </span>
              <button
                onClick={() => setSelectedPatientForDrawer(patient)}
                className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 flex items-center space-x-1"
              >
                <span>{t.patient.viewHistory}</span>
                <span>&rarr;</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Patient Details & History Drawer / Modal */}
      {selectedPatientForDrawer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[88vh] flex flex-col animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold">
                  {selectedPatientForDrawer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {selectedPatientForDrawer.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedPatientForDrawer.id} • {selectedPatientForDrawer.age} yrs • Blood:{' '}
                    <span className="text-rose-600 font-bold">{selectedPatientForDrawer.bloodGroup}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPatientForDrawer(null)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-5">
              {/* Emergency Contact */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-700 uppercase tracking-wider block text-[10px] mb-1">
                  Emergency Contact:
                </span>
                <div className="text-slate-800 font-medium">
                  {selectedPatientForDrawer.emergencyContact.name} (
                  {selectedPatientForDrawer.emergencyContact.relationship}) •{' '}
                  <span className="font-mono">{selectedPatientForDrawer.emergencyContact.phone}</span>
                </div>
              </div>

              {/* Prescriptions History */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2 flex items-center space-x-1.5">
                  <FileText className="w-4 h-4 text-cyan-600" />
                  <span>Prescriptions on Record ({patientPrescriptions.length})</span>
                </h4>
                {patientPrescriptions.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No prescriptions found.</p>
                ) : (
                  <div className="space-y-2">
                    {patientPrescriptions.map(rx => (
                      <div key={rx.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="font-mono font-bold text-cyan-900">{rx.id}</span>
                          <span className="text-slate-500">{rx.date}</span>
                        </div>
                        {rx.diagnosis && (
                          <div className="font-semibold text-slate-800">
                            Diagnosis: {rx.diagnosis.join(', ')}
                          </div>
                        )}
                        <div className="text-slate-600">
                          {rx.medicines.map(m => `${m.brandName} (${m.dosageSchedule})`).join(' • ')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Invoices History */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2 flex items-center space-x-1.5">
                  <Receipt className="w-4 h-4 text-emerald-600" />
                  <span>Invoices & Billing History ({patientInvoices.length})</span>
                </h4>
                {patientInvoices.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No invoices found.</p>
                ) : (
                  <div className="space-y-2">
                    {patientInvoices.map(inv => (
                      <div key={inv.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs flex justify-between items-center">
                        <div>
                          <span className="font-mono font-bold text-slate-900">{inv.id}</span>
                          <span className="text-slate-400 ml-2">{inv.date}</span>
                          <div className="text-[11px] text-slate-600">
                            {inv.items.map(i => i.description).join(', ')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-bold text-slate-900">
                            {settings.currencySymbol} {inv.grandTotal}
                          </div>
                          <span
                            className={`inline-block text-[10px] font-bold uppercase px-1.5 rounded ${
                              inv.paymentStatus === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {inv.paymentStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
