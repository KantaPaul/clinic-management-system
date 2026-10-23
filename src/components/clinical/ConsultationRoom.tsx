import React, { useState, useEffect } from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  Stethoscope,
  User,
  HeartPulse,
  Pill,
  FileText,
  Plus,
  Trash2,
  Printer,
  History,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Sparkles,
  Copy,
  Search,
  Filter,
  Check,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  Video,
  Camera,
  Image as ImageIcon,
  Bookmark,
} from 'lucide-react';
import {
  Prescription,
  PrescriptionTemplate,
  PrescribedMedicine,
  Patient,
  Doctor,
  Appointment,
} from '../../types';
import { PrescriptionPrintModal } from './PrescriptionPrintModal';
import { QuickActionsFloatingMenu } from './QuickActionsFloatingMenu';
import { AIDosageModal } from './AIDosageModal';
import { WebRTCVideoConference } from './WebRTCVideoConference';
import { SavedPrescriptionsModal } from './SavedPrescriptionsModal';

export const ConsultationRoom: React.FC = () => {
  const {
    t,
    settings,
    currentUser,
    doctors,
    patients,
    appointments,
    medicines,
    prescriptions,
    savePrescription,
    prescriptionTemplates,
    selectedAppointmentForConsultation,
    updateAppointmentStatus,
    language,
  } = useClinic();

  // Find linked doctor
  const currentDoctor: Doctor =
    doctors.find(d => d.id === currentUser.doctorId) ||
    doctors.find(d => d.isActive) ||
    doctors[0];

  const todayStr = new Date().toISOString().split('T')[0];

  // Candidates for consultation
  const activeAppointments = appointments.filter(
    a =>
      a.date === todayStr &&
      (currentUser.role === 'admin' || a.doctorId === currentDoctor.id) &&
      (a.status === 'in_consultation' || a.status === 'waiting')
  );

  const [activeAppointmentId, setActiveAppointmentId] = useState<string>(
    selectedAppointmentForConsultation?.id || (activeAppointments[0]?.id ?? '')
  );

  useEffect(() => {
    if (selectedAppointmentForConsultation) {
      setActiveAppointmentId(selectedAppointmentForConsultation.id);
    } else if (activeAppointments.length > 0 && !activeAppointmentId) {
      setActiveAppointmentId(activeAppointments[0].id);
    }
  }, [selectedAppointmentForConsultation, activeAppointments.length]);

  const activeAppointment = appointments.find(a => a.id === activeAppointmentId);
  const activePatient = activeAppointment
    ? patients.find(p => p.id === activeAppointment.patientId)
    : null;

  // View Mode: 'encounter' (New Prescription) vs 'history' (Patient History & Previous Prescriptions)
  const [viewMode, setViewMode] = useState<'encounter' | 'history'>('encounter');
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [historyDoctorFilter, setHistoryDoctorFilter] = useState<string>('all');
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Form states for new prescription
  const [bloodPressure, setBloodPressure] = useState('120/80');
  const [pulse, setPulse] = useState('78');
  const [temperature, setTemperature] = useState('98.6');
  const [weight, setWeight] = useState('68');
  const [bloodSugar, setBloodSugar] = useState('');
  const [generalVitalsNotes, setGeneralVitalsNotes] = useState('');

  const [chiefComplaints, setChiefComplaints] = useState<string[]>([]);
  const [complaintInput, setComplaintInput] = useState('');

  const [diagnosis, setDiagnosis] = useState<string[]>([]);
  const [diagnosisInput, setDiagnosisInput] = useState('');

  const [prescribedMeds, setPrescribedMeds] = useState<PrescribedMedicine[]>([
    {
      id: 'tmp-1',
      medicineId: 'MED-01',
      brandName: 'Napa Extend',
      genericName: 'Paracetamol',
      dosageForm: 'Tablet',
      strength: '665mg',
      dosageSchedule: '1+0+1',
      mealTiming: 'after_meal',
      duration: '5 Days',
      instructions: 'Take after meals for fever or body pain.',
      instructionsBn: 'খাওয়ার পর খাবেন।',
    },
  ]);

  // Drug search in catalog
  const [drugSearchQuery, setDrugSearchQuery] = useState('');
  const [showDrugDropdown, setShowDrugDropdown] = useState(false);

  const [investigations, setInvestigations] = useState<string[]>([]);
  const [investigationInput, setInvestigationInput] = useState('');

  const [adviceList, setAdviceList] = useState<string[]>([
    'Drink plenty of warm water and take adequate rest.',
    'Strict low-salt diet and avoid oily or fried foods.',
  ]);
  const [adviceInput, setAdviceInput] = useState('');

  const [followUpDays, setFollowUpDays] = useState('7');
  const [followUpDate, setFollowUpDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });

  // Modal states for printing & AI dosage
  const [savedPrescription, setSavedPrescription] = useState<Prescription | null>(null);
  const [printDoctor, setPrintDoctor] = useState<Doctor>(currentDoctor);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [dosageModalMed, setDosageModalMed] = useState<PrescribedMedicine | null>(null);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);

  // WebRTC Video Conferencing & Clinical Examination Snapshots
  const [showVideoConference, setShowVideoConference] = useState(false);
  const [clinicalImages, setClinicalImages] = useState<
    Array<{ id: string; url: string; label: string; timestamp: string }>
  >([]);

  // Fetch all previous prescriptions for the selected patient
  const pastPrescriptions = activePatient
    ? prescriptions
        .filter(p => p.patientId === activePatient.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  // Filtered previous prescriptions based on history search and doctor filter
  const filteredPastPrescriptions = pastPrescriptions.filter(rx => {
    const matchesDoctor = historyDoctorFilter === 'all' || rx.doctorId === historyDoctorFilter;
    if (!matchesDoctor) return false;

    if (!historySearchQuery.trim()) return true;
    const q = historySearchQuery.toLowerCase();

    const matchesId = rx.id.toLowerCase().includes(q);
    const matchesDate = rx.date.includes(q);
    const matchesDiagnosis = rx.diagnosis?.some(d => d.toLowerCase().includes(q));
    const matchesComplaint = rx.chiefComplaints?.some(c => c.toLowerCase().includes(q));
    const matchesMed = rx.medicines?.some(
      m => m.brandName.toLowerCase().includes(q) || m.genericName.toLowerCase().includes(q)
    );
    const matchesTest = rx.investigationsAdvised?.some(t => t.toLowerCase().includes(q));

    return matchesId || matchesDate || matchesDiagnosis || matchesComplaint || matchesMed || matchesTest;
  });

  // Update follow-up date when days change
  const handleFollowUpDaysChange = (days: number) => {
    setFollowUpDays(days.toString());
    const d = new Date();
    d.setDate(d.getDate() + days);
    setFollowUpDate(d.toISOString().split('T')[0]);
  };

  // Quick complaint chips
  const commonComplaints = [
    'Fever for 3 days',
    'Dry persistent cough',
    'Severe headache & nausea',
    'Chest tightness',
    'Dyspepsia & burning sensation',
    'Lower back pain',
    'Generalized fatigue',
  ];

  // Quick diagnosis chips
  const commonDiagnoses = [
    'Acute Upper Respiratory Tract Infection (URTI)',
    'Essential Hypertension',
    'Type 2 Diabetes Mellitus',
    'Acute Gastroenteritis',
    'Migraine',
    'Bronchial Asthma',
    'Peptic Ulcer Disease (PUD)',
  ];

  // Quick investigation chips
  const commonInvestigations = [
    'CBC with ESR',
    'Fasting Blood Sugar (FBS)',
    'HbA1c',
    'Serum Creatinine',
    'Lipid Profile',
    'Chest X-Ray P/A view',
    'ECG (12 Leads)',
    'Urine R/M/E',
  ];

  const handleAddMedicine = (catalogItem: typeof medicines[0]) => {
    const newMed: PrescribedMedicine = {
      id: `rx-item-${Date.now()}`,
      medicineId: catalogItem.id,
      brandName: catalogItem.brandName,
      genericName: catalogItem.genericName,
      dosageForm: catalogItem.dosageForm,
      strength: catalogItem.strength,
      dosageSchedule: catalogItem.defaultSchedule || '1+0+1',
      mealTiming: catalogItem.defaultMealTiming || 'after_meal',
      duration: '7 Days',
      instructions: 'Take as directed.',
      instructionsBn: 'নিয়মমাফিক সেব্য।',
    };
    setPrescribedMeds(prev => [...prev, newMed]);
    setDrugSearchQuery('');
    setShowDrugDropdown(false);
  };

  const handleRemoveMedicine = (id: string) => {
    setPrescribedMeds(prev => prev.filter(m => m.id !== id));
  };

  const handleUpdateMedicine = (id: string, updates: Partial<PrescribedMedicine>) => {
    setPrescribedMeds(prev =>
      prev.map(m => (m.id === id ? { ...m, ...updates } : m))
    );
  };

  // One-click Clinical Utility: Copy previous medicines to current consultation
  const handleCopyPastMedications = (pastRx: Prescription) => {
    if (!pastRx.medicines || pastRx.medicines.length === 0) return;

    const copiedMeds: PrescribedMedicine[] = pastRx.medicines.map((m, idx) => ({
      ...m,
      id: `copied-${Date.now()}-${idx}`,
    }));

    setPrescribedMeds(copiedMeds);
    setCopyFeedback(
      language === 'bn'
        ? `পূর্ববর্তী প্রেসক্রিপশন (${pastRx.id}) থেকে ${copiedMeds.length}টি ওষুধ সফলভাবে যুক্ত করা হয়েছে!`
        : `Successfully imported ${copiedMeds.length} medicines from ${pastRx.id} into current prescription!`
    );
    setViewMode('encounter');

    setTimeout(() => {
      setCopyFeedback(null);
    }, 4500);
  };

  // Copy past diagnosis and complaints
  const handleImportPastDiagnosis = (pastRx: Prescription) => {
    if (pastRx.diagnosis && pastRx.diagnosis.length > 0) {
      setDiagnosis(pastRx.diagnosis);
    }
    if (pastRx.chiefComplaints && pastRx.chiefComplaints.length > 0) {
      setChiefComplaints(pastRx.chiefComplaints);
    }
    if (pastRx.clinicalFindings) {
      if (pastRx.clinicalFindings.bloodPressure) {
        setBloodPressure(pastRx.clinicalFindings.bloodPressure.replace(' mmHg', ''));
      }
      if (pastRx.clinicalFindings.pulse) {
        setPulse(pastRx.clinicalFindings.pulse.replace(' bpm', ''));
      }
      if (pastRx.clinicalFindings.temperature) {
        setTemperature(pastRx.clinicalFindings.temperature.replace(' °F', ''));
      }
      if (pastRx.clinicalFindings.weight) {
        setWeight(pastRx.clinicalFindings.weight.replace(' kg', ''));
      }
      if (pastRx.clinicalFindings.bloodSugar) {
        setBloodSugar(pastRx.clinicalFindings.bloodSugar);
      }
    }

    setCopyFeedback(
      language === 'bn'
        ? `পূর্ববর্তী প্রেসক্রিপশন (${pastRx.id}) এর রোগ নির্ণয় ও শারীরিক তথ্য যুক্ত করা হয়েছে!`
        : `Imported clinical diagnosis and baseline vitals from ${pastRx.id}!`
    );
    setViewMode('encounter');

    setTimeout(() => {
      setCopyFeedback(null);
    }, 4500);
  };

  // Open past prescription for printing/viewing
  const handleOpenPrintPastRx = (rx: Prescription) => {
    const rxDoctor = doctors.find(d => d.id === rx.doctorId) || currentDoctor;
    setPrintDoctor(rxDoctor);
    setSavedPrescription(rx);
    setShowPrintModal(true);
  };

  // Apply prescription template (replace or append)
  const handleApplyTemplate = (template: PrescriptionTemplate, mode: 'replace' | 'append') => {
    if (mode === 'replace') {
      if (template.chiefComplaints && template.chiefComplaints.length > 0) {
        setChiefComplaints([...template.chiefComplaints]);
      }
      if (template.diagnosis && template.diagnosis.length > 0) {
        setDiagnosis([...template.diagnosis]);
      }
      const mappedMeds = template.medicines.map((m, idx) => ({
        ...m,
        id: `tpl-med-${Date.now()}-${idx}`,
      }));
      setPrescribedMeds(mappedMeds);

      if (template.investigationsAdvised) {
        setInvestigations([...template.investigationsAdvised]);
      }
      if (template.specialAdvice) {
        setAdviceList([...template.specialAdvice]);
      }
      if (template.followUpDays) {
        setFollowUpDays(template.followUpDays.toString());
        const d = new Date();
        d.setDate(d.getDate() + template.followUpDays);
        setFollowUpDate(d.toISOString().split('T')[0]);
      }
      setCopyFeedback(
        language === 'bn'
          ? `"${template.title}" প্রটোকল প্রেসক্রিপশনে সম্পূর্ণ প্রতিস্থাপন করা হয়েছে (${template.medicines.length}টি ওষুধ অন্তর্ভুক্ত)।`
          : `Replaced active prescription with "${template.title}" (${template.medicines.length} medications loaded).`
      );
    } else {
      // Append mode: Merge without duplicates
      if (template.chiefComplaints && template.chiefComplaints.length > 0) {
        setChiefComplaints(prev => {
          const combined = [...prev];
          template.chiefComplaints?.forEach(c => {
            if (!combined.includes(c)) combined.push(c);
          });
          return combined;
        });
      }
      if (template.diagnosis && template.diagnosis.length > 0) {
        setDiagnosis(prev => {
          const combined = [...prev];
          template.diagnosis.forEach(d => {
            if (!combined.includes(d)) combined.push(d);
          });
          return combined;
        });
      }
      const mappedMeds = template.medicines.map((m, idx) => ({
        ...m,
        id: `tpl-append-${Date.now()}-${idx}`,
      }));
      setPrescribedMeds(prev => [...prev, ...mappedMeds]);

      if (template.investigationsAdvised) {
        setInvestigations(prev => {
          const combined = [...prev];
          template.investigationsAdvised?.forEach(inv => {
            if (!combined.includes(inv)) combined.push(inv);
          });
          return combined;
        });
      }
      if (template.specialAdvice) {
        setAdviceList(prev => {
          const combined = [...prev];
          template.specialAdvice?.forEach(adv => {
            if (!combined.includes(adv)) combined.push(adv);
          });
          return combined;
        });
      }
      if (template.followUpDays && (!followUpDays || followUpDays === '7')) {
        setFollowUpDays(template.followUpDays.toString());
        const d = new Date();
        d.setDate(d.getDate() + template.followUpDays);
        setFollowUpDate(d.toISOString().split('T')[0]);
      }
      setCopyFeedback(
        language === 'bn'
          ? `"${template.title}" প্রটোকল থেকে ${template.medicines.length}টি ওষুধ ও পরামর্শ সফলভাবে যোগ করা হয়েছে।`
          : `Appended ${template.medicines.length} medications and clinical advice from "${template.title}".`
      );
    }

    setTimeout(() => {
      setCopyFeedback(null);
    }, 5000);
  };

  // Submit and save new prescription
  const handleSaveAndPrint = () => {
    if (!activeAppointment || !activePatient) return;

    const newPrescriptionData: Omit<Prescription, 'id' | 'createdAt'> = {
      appointmentId: activeAppointment.id,
      patientId: activePatient.id,
      doctorId: activeAppointment.doctorId,
      date: activeAppointment.date,
      chiefComplaints,
      clinicalFindings: {
        bloodPressure: bloodPressure ? `${bloodPressure} mmHg` : undefined,
        pulse: pulse ? `${pulse} bpm` : undefined,
        temperature: temperature ? `${temperature} °F` : undefined,
        weight: weight ? `${weight} kg` : undefined,
        bloodSugar: bloodSugar ? `${bloodSugar} mmol/L` : undefined,
        generalNotes: generalVitalsNotes,
      },
      diagnosis,
      medicines: prescribedMeds,
      investigationsAdvised: investigations,
      specialAdvice: adviceList,
      followUpDate,
      followUpNotes: `Review after ${followUpDays} days with reports.`,
    };

    const saved = savePrescription(newPrescriptionData);
    setPrintDoctor(currentDoctor);
    setSavedPrescription(saved);
    setShowPrintModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Consultation Selector */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Stethoscope className="w-4 h-4" />
            <span>
              {currentDoctor.name} • {currentDoctor.roomNo}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {t.consultation.title}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'রোগীর শারীরিক লক্ষণ, পূর্ববর্তী প্রেসক্রিপশন ও ডিজিটাল চিকিৎসা ব্যবস্থাপনা'
              : 'Direct clinical encounter workflow: vitals, previous visit history, formulary prescription, and BMDC printout'}
          </p>
        </div>

        {/* Patient in Consultation Dropdown */}
        <div className="flex items-center space-x-3">
          <label className="text-xs font-semibold text-slate-600 shrink-0">
            {language === 'bn' ? 'রোগী নির্বাচন:' : 'Consulting Patient:'}
          </label>
          <select
            value={activeAppointmentId}
            onChange={e => {
              setActiveAppointmentId(e.target.value);
              const apt = appointments.find(a => a.id === e.target.value);
              if (apt && apt.status === 'waiting') {
                updateAppointmentStatus(apt.id, 'in_consultation');
              }
            }}
            className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-cyan-500 focus:outline-none min-w-[240px]"
          >
            {activeAppointments.map(a => {
              const p = patients.find(pat => pat.id === a.patientId);
              return (
                <option key={a.id} value={a.id}>
                  {a.serialNumber ? `Serial #${a.serialNumber} - ` : ''}
                  {p?.name} ({a.status})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {!activePatient ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
          <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">
            {t.consultation.selectPatientPrompt}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'bn'
              ? 'কিউ বোর্ড থেকে রোগীকে চেম্বারে ডাকুন অথবা ড্রপডাউন থেকে নির্বাচন করুন।'
              : 'Call in a patient from the Queue Manager or select from the dropdown above.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Patient Details Banner with View Switcher */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold text-base shrink-0">
                  {activePatient.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {language === 'bn' && activePatient.nameBn ? activePatient.nameBn : activePatient.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                      {activePatient.id}
                    </span>
                    {activeAppointment?.serialNumber && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-cyan-100 text-cyan-800">
                        Serial #{activeAppointment.serialNumber}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-3">
                    <span>
                      <strong>{activePatient.age}</strong> yrs,{' '}
                      <span className="capitalize">{activePatient.gender}</span>
                    </span>
                    <span>•</span>
                    <span>
                      Blood: <strong className="text-rose-600">{activePatient.bloodGroup}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Phone: <strong>{activePatient.phone}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Total visits: <strong>{activePatient.totalVisits}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* View Switcher: Encounter vs Patient History vs Teleconsult */}
              <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => setViewMode('encounter')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                      viewMode === 'encounter'
                        ? 'bg-white text-cyan-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'চলতি প্রেসক্রিপশন' : 'Active Prescription'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('history')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                      viewMode === 'history'
                        ? 'bg-cyan-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'রোগীর পূর্ববর্তী ইতিহাস' : 'Patient History'}</span>
                    <span
                      className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        viewMode === 'history'
                          ? 'bg-cyan-800 text-white'
                          : 'bg-cyan-100 text-cyan-800'
                      }`}
                    >
                      {pastPrescriptions.length}
                    </span>
                  </button>
                </div>

                {/* Saved Prescriptions / Clinical Protocols Trigger */}
                <button
                  type="button"
                  onClick={() => setShowTemplatesModal(true)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 bg-white border border-slate-200 text-slate-800 hover:text-cyan-800 hover:border-cyan-300 shadow-xs hover:bg-cyan-50/50"
                  title="Browse standard protocols and saved prescription templates"
                >
                  <Bookmark className="w-3.5 h-3.5 text-cyan-600 fill-cyan-100" />
                  <span>{language === 'bn' ? 'প্রেসক্রিপশন টেমপ্লেট' : 'Templates'}</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-cyan-100 text-cyan-800 text-[10px] font-bold">
                    {prescriptionTemplates.length}
                  </span>
                </button>

                {/* WebRTC Video Conferencing Trigger */}
                <button
                  type="button"
                  onClick={() => setShowVideoConference(!showVideoConference)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shadow-xs ${
                    showVideoConference
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white ring-2 ring-emerald-400/50 shadow-emerald-500/20'
                      : 'bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white shadow-sm'
                  }`}
                  title="Peer-to-peer WebRTC video conference for remote patient follow-up"
                >
                  <Video className="w-4 h-4 animate-pulse text-cyan-200" />
                  <span>
                    {language === 'bn'
                      ? showVideoConference ? 'ভিডিও কল লুকান' : 'টেলিকনসালটেশন (ভিডিও কল)'
                      : showVideoConference ? 'Hide Video Call' : 'Teleconsult (Video Call)'}
                  </span>
                  {showVideoConference && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-1" />
                  )}
                </button>
              </div>
            </div>

            {/* Critical Allergies Warning Banner */}
            {activePatient.allergies.length > 0 && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center space-x-2 text-xs text-rose-800 font-semibold">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  CRITICAL ALLERGY ALERT: Patient is allergic to{' '}
                  <strong className="underline uppercase tracking-wide">
                    {activePatient.allergies.join(', ')}
                  </strong>
                  . Exercise extreme caution when prescribing.
                </span>
              </div>
            )}

            {/* Feedback alert when repeating medications */}
            {copyFeedback && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center space-x-2 text-xs text-emerald-800 font-semibold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{copyFeedback}</span>
              </div>
            )}
          </div>

          {/* Peer-to-Peer WebRTC Video Conferencing Module for Remote Patient Follow-Up */}
          {showVideoConference && activePatient && (
            <WebRTCVideoConference
              roomId={activeAppointment ? `room-${activeAppointment.id}` : `room-${activePatient.id}`}
              patient={activePatient}
              doctor={currentDoctor}
              onClose={() => setShowVideoConference(false)}
              onAddClinicalNote={(note) => {
                setGeneralVitalsNotes(prev => (prev ? `${prev}\n• ${note}` : `• ${note}`));
              }}
              onAddClinicalImage={(imageUrl, label) => {
                setClinicalImages(prev => [
                  ...prev,
                  {
                    id: `img-${Date.now()}`,
                    url: imageUrl,
                    label,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  },
                ]);
                setCopyFeedback(
                  language === 'bn'
                    ? `টেলিকনসালটেশন স্ন্যাপশট সফলভাবে রোগীর ফাইলে সংরক্ষিত হয়েছে!`
                    : `Clinical examination snapshot saved to patient record!`
                );
                setTimeout(() => setCopyFeedback(null), 4000);
              }}
            />
          )}

          {/* ========================================================================= */}
          {/* VIEW MODE 1: PATIENT HISTORY & PREVIOUS PRESCRIPTIONS VIEW */}
          {/* ========================================================================= */}
          {viewMode === 'history' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* History Filter and Search Bar */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                    <History className="w-4 h-4 text-cyan-600" />
                    <span>
                      {language === 'bn'
                        ? `${activePatient.name} এর পূর্ববর্তী প্রেসক্রিপশন ও চিকিৎসা রেকর্ড`
                        : `Prescription & Clinical History for ${activePatient.name}`}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {pastPrescriptions.length}{' '}
                    {language === 'bn'
                      ? 'টি প্রেসক্রিপশন ডিজিটাল রেকর্ডে সংরক্ষিত আছে'
                      : 'electronic prescriptions recorded on file'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  {/* Search within patient history */}
                  <div className="relative flex-1 md:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={historySearchQuery}
                      onChange={e => setHistorySearchQuery(e.target.value)}
                      placeholder="Search diagnosis, medicine, test..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50"
                    />
                  </div>

                  {/* Doctor Filter */}
                  <div className="flex items-center space-x-2">
                    <Filter className="w-3.5 h-3.5 text-slate-400" />
                    <select
                      value={historyDoctorFilter}
                      onChange={e => setHistoryDoctorFilter(e.target.value)}
                      className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="all">All Doctors</option>
                      {doctors.map(d => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* No History Empty State */}
              {pastPrescriptions.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-800">
                    {language === 'bn'
                      ? 'কোনো পূর্ববর্তী প্রেসক্রিপশন পাওয়া যায়নি'
                      : 'No Previous Prescriptions on Record'}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    {language === 'bn'
                      ? 'এই রোগীর কোনো পূর্ববর্তী ডিজিটাল প্রেসক্রিপশন নেই। আপনি নিচের বাটনে ক্লিক করে আজকের প্রথম প্রেসক্রিপশন তৈরি করতে পারেন।'
                      : 'This patient has no prior electronic medical records in the system. You can begin documenting their initial consultation right now.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setViewMode('encounter')}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-600/20 inline-flex items-center space-x-1.5"
                  >
                    <Stethoscope className="w-4 h-4" />
                    <span>{language === 'bn' ? 'প্রেসক্রিপশন তৈরি শুরু করুন' : 'Start First Consultation'}</span>
                  </button>
                </div>
              ) : filteredPastPrescriptions.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
                  <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-600 font-medium">
                    No past prescriptions matched your search query "{historySearchQuery}".
                  </p>
                  <button
                    onClick={() => {
                      setHistorySearchQuery('');
                      setHistoryDoctorFilter('all');
                    }}
                    className="mt-2 text-xs font-bold text-cyan-600 hover:underline"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                /* Chronological Cards of Previous Prescriptions */
                <div className="space-y-5">
                  {filteredPastPrescriptions.map((rx, rxIndex) => {
                    const prescribingDoc =
                      doctors.find(d => d.id === rx.doctorId) || {
                        name: 'Specialist Physician',
                        specialty: 'Clinical Medicine',
                        bmdcRegNo: 'BMDC Registered',
                      };

                    return (
                      <div
                        key={rx.id}
                        className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-cyan-300 transition-all overflow-hidden"
                      >
                        {/* Card Header Bar */}
                        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 via-slate-50/70 to-cyan-50/30 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-xs">
                              #{filteredPastPrescriptions.length - rxIndex}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-mono font-bold text-sm text-cyan-950">
                                  {rx.id}
                                </span>
                                <span className="text-xs text-slate-400">•</span>
                                <span className="text-xs font-semibold text-slate-700 flex items-center">
                                  <Calendar className="w-3.5 h-3.5 text-slate-400 mr-1" />
                                  {rx.date}
                                </span>
                                {rxIndex === 0 && (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                    Most Recent
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 mt-0.5 flex items-center space-x-1.5">
                                <span>Prescribed by:</span>
                                <strong className="text-slate-800">{prescribingDoc.name}</strong>
                                <span>({prescribingDoc.specialty})</span>
                                <span className="text-rose-700 font-mono font-bold bg-rose-50 px-1 rounded">
                                  {prescribingDoc.bmdcRegNo}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Quick Actions on this past prescription */}
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => handleCopyPastMedications(rx)}
                              className="px-3 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-xs font-bold border border-cyan-200 flex items-center space-x-1.5 transition-colors shadow-xs"
                              title="Copy all medicines from this visit into today's prescription"
                            >
                              <Copy className="w-3.5 h-3.5 text-cyan-700" />
                              <span>{language === 'bn' ? 'ওষুধ কপি করুন' : 'Copy Medicines'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleImportPastDiagnosis(rx)}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                              title="Load diagnosis and baseline vitals"
                            >
                              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                              <span>{language === 'bn' ? 'রোগ নির্ণয় আমদানি' : 'Import Baseline'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenPrintPastRx(rx)}
                              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-xs"
                              title="Print or view full official prescription slip"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>{language === 'bn' ? 'প্রিন্ট স্লিপ' : 'View / Print Rx'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-5 space-y-4 text-xs">
                          {/* Vitals Recorded at that Encounter */}
                          {rx.clinicalFindings && (
                            <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/70 flex flex-wrap items-center gap-4 text-slate-700">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block w-full sm:w-auto">
                                Recorded Vitals:
                              </span>
                              {rx.clinicalFindings.bloodPressure && (
                                <div>
                                  <span className="text-slate-400">BP:</span>{' '}
                                  <strong className="text-slate-900 font-mono">
                                    {rx.clinicalFindings.bloodPressure}
                                  </strong>
                                </div>
                              )}
                              {rx.clinicalFindings.pulse && (
                                <div>
                                  <span className="text-slate-400">Pulse:</span>{' '}
                                  <strong className="text-slate-900 font-mono">
                                    {rx.clinicalFindings.pulse}
                                  </strong>
                                </div>
                              )}
                              {rx.clinicalFindings.temperature && (
                                <div>
                                  <span className="text-slate-400">Temp:</span>{' '}
                                  <strong className="text-slate-900 font-mono">
                                    {rx.clinicalFindings.temperature}
                                  </strong>
                                </div>
                              )}
                              {rx.clinicalFindings.weight && (
                                <div>
                                  <span className="text-slate-400">Weight:</span>{' '}
                                  <strong className="text-slate-900 font-mono">
                                    {rx.clinicalFindings.weight}
                                  </strong>
                                </div>
                              )}
                              {rx.clinicalFindings.bloodSugar && (
                                <div>
                                  <span className="text-slate-400">RBS:</span>{' '}
                                  <strong className="text-slate-900 font-mono">
                                    {rx.clinicalFindings.bloodSugar}
                                  </strong>
                                </div>
                              )}
                              {rx.clinicalFindings.generalNotes && (
                                <div className="text-[11px] text-slate-500 italic w-full">
                                  Notes: {rx.clinicalFindings.generalNotes}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Complaints & Diagnosis Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Chief Complaints */}
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-900 block mb-1">
                                Chief Complaints (C/C):
                              </span>
                              {rx.chiefComplaints && rx.chiefComplaints.length > 0 ? (
                                <ul className="list-disc list-inside text-slate-700 space-y-0.5 text-xs">
                                  {rx.chiefComplaints.map((c, i) => (
                                    <li key={i}>{c}</li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="text-slate-400 italic">None noted</span>
                              )}
                            </div>

                            {/* Diagnosis */}
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block mb-1">
                                Clinical Diagnosis:
                              </span>
                              {rx.diagnosis && rx.diagnosis.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                  {rx.diagnosis.map((d, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-900 font-bold border border-emerald-200 text-[11px]"
                                    >
                                      • {d}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-slate-400 italic">None noted</span>
                              )}
                            </div>
                          </div>

                          {/* Prescribed Medications Table */}
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                                <span className="font-serif font-black text-sm text-cyan-800 italic">
                                  ℞
                                </span>
                                <span>
                                  Prescribed Medications ({rx.medicines?.length || 0})
                                </span>
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopyPastMedications(rx)}
                                className="text-[10px] text-cyan-700 hover:text-cyan-900 font-bold hover:underline"
                              >
                                + Copy all to current prescription
                              </button>
                            </div>

                            <div className="border border-slate-200 rounded-xl overflow-hidden">
                              <table className="w-full text-left text-xs text-slate-700">
                                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                                  <tr>
                                    <th className="py-2 px-3">#</th>
                                    <th className="py-2 px-3">Medicine & Generic</th>
                                    <th className="py-2 px-3">Dose Schedule</th>
                                    <th className="py-2 px-3">Meal Timing</th>
                                    <th className="py-2 px-3">Duration</th>
                                    <th className="py-2 px-3">Instructions</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                  {rx.medicines?.map((m, idx) => (
                                    <tr key={m.id || idx} className="hover:bg-slate-50/60">
                                      <td className="py-2 px-3 text-slate-400 font-mono text-[11px]">
                                        {idx + 1}
                                      </td>
                                      <td className="py-2 px-3">
                                        <div className="font-bold text-slate-900">
                                          {m.dosageForm}. {m.brandName} {m.strength}
                                        </div>
                                        <div className="text-[10px] text-slate-400 italic">
                                          ({m.genericName})
                                        </div>
                                      </td>
                                      <td className="py-2 px-3 font-bold font-mono text-cyan-950">
                                        {m.dosageSchedule}
                                      </td>
                                      <td className="py-2 px-3 text-slate-600">
                                        <span className="capitalize">
                                          {m.mealTiming?.replace('_', ' ')}
                                        </span>
                                      </td>
                                      <td className="py-2 px-3 font-semibold text-slate-800">
                                        {m.duration}
                                      </td>
                                      <td className="py-2 px-3 text-slate-500 text-[11px]">
                                        {m.instructionsBn || m.instructions || '—'}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* Advice & Tests */}
                          {(rx.investigationsAdvised?.length > 0 || rx.specialAdvice?.length > 0) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                              {/* Tests */}
                              {rx.investigationsAdvised && rx.investigationsAdvised.length > 0 && (
                                <div>
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                                    Tests Advised:
                                  </span>
                                  <div className="text-slate-700 text-xs">
                                    {rx.investigationsAdvised.join(' • ')}
                                  </div>
                                </div>
                              )}

                              {/* Advice */}
                              {rx.specialAdvice && rx.specialAdvice.length > 0 && (
                                <div>
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                                    Advice & Next Visit:
                                  </span>
                                  <div className="text-slate-700 text-xs">
                                    {rx.specialAdvice.join(' • ')}
                                    {rx.followUpDate && (
                                      <span className="font-bold text-cyan-800 ml-1">
                                        (Next: {rx.followUpDate})
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW MODE 2: ACTIVE ENCOUNTER & NEW PRESCRIPTION BUILDER */}
          {/* ========================================================================= */}
          {viewMode === 'encounter' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Quick History Reminder Banner for returning patients */}
              {pastPrescriptions.length > 0 && (
                <div className="p-3.5 bg-gradient-to-r from-cyan-50 to-teal-50 border border-cyan-200 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <History className="w-4 h-4 text-cyan-700 shrink-0" />
                    <span className="text-slate-700">
                      <strong>Returning Patient:</strong> {activePatient.name} has{' '}
                      <strong className="text-cyan-900">{pastPrescriptions.length}</strong> previous
                      prescription(s) on file (Latest: <strong>{pastPrescriptions[0].date}</strong>).
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopyPastMedications(pastPrescriptions[0])}
                      className="px-2.5 py-1 rounded-lg bg-white border border-cyan-300 text-cyan-800 font-bold text-[11px] hover:bg-cyan-100 flex items-center space-x-1"
                    >
                      <Copy className="w-3 h-3 text-cyan-600" />
                      <span>Repeat Last Rx</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('history')}
                      className="px-2.5 py-1 rounded-lg bg-cyan-700 text-white font-bold text-[11px] hover:bg-cyan-800 flex items-center space-x-1"
                    >
                      <span>View History</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {/* Clinical Encounter Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left 5 Cols: Vitals, Complaints, Diagnosis, Tests */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Vitals Form */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between text-cyan-700 font-bold text-xs uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <HeartPulse className="w-4 h-4" />
                        <span>{t.consultation.vitals}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal">Physical Exam</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                          {t.consultation.bloodPressure}
                        </label>
                        <input
                          type="text"
                          value={bloodPressure}
                          onChange={e => setBloodPressure(e.target.value)}
                          placeholder="e.g. 120/80"
                          className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                          {t.consultation.pulse} (bpm)
                        </label>
                        <input
                          type="text"
                          value={pulse}
                          onChange={e => setPulse(e.target.value)}
                          placeholder="e.g. 78"
                          className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                          {t.consultation.temperature} (°F)
                        </label>
                        <input
                          type="text"
                          value={temperature}
                          onChange={e => setTemperature(e.target.value)}
                          placeholder="e.g. 98.6"
                          className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                          {t.consultation.weight} (kg)
                        </label>
                        <input
                          type="text"
                          value={weight}
                          onChange={e => setWeight(e.target.value)}
                          placeholder="e.g. 68"
                          className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                        {t.consultation.bloodSugar} (RBS / Fasting)
                      </label>
                      <input
                        type="text"
                        value={bloodSugar}
                        onChange={e => setBloodSugar(e.target.value)}
                        placeholder="e.g. 6.8 mmol/L"
                        className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                      />
                    </div>

                    {/* Clinical Notes & Doctor Observations */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-semibold text-slate-700">
                          Doctor's Clinical Notes & Counseling
                        </label>
                        <span className="text-[10px] text-indigo-600 font-semibold">
                          Quick Actions &bull; Add Note
                        </span>
                      </div>
                      <textarea
                        rows={2}
                        value={generalVitalsNotes}
                        onChange={e => setGeneralVitalsNotes(e.target.value)}
                        placeholder="Enter clinical observations, examination findings, or patient counseling notes..."
                        className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50/50"
                      />
                    </div>

                    {/* Live Teleconsultation Snapshots Gallery */}
                    {clinicalImages.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-800 flex items-center space-x-1.5">
                            <Camera className="w-3.5 h-3.5 text-cyan-600" />
                            <span>Exam Snapshots ({clinicalImages.length})</span>
                          </span>
                          <span className="text-[10px] text-emerald-600 font-semibold flex items-center space-x-1">
                            <Check className="w-3 h-3" />
                            <span>WebRTC Captured</span>
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {clinicalImages.map(img => (
                            <div
                              key={img.id}
                              className="group relative rounded-xl overflow-hidden border border-slate-200 bg-black aspect-video shadow-xs"
                            >
                              <img
                                src={img.url}
                                alt={img.label}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-x-0 bottom-0 bg-black/75 backdrop-blur-xs p-1 text-[9px] text-white truncate">
                                {img.label}
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  setClinicalImages(prev => prev.filter(i => i.id !== img.id))
                                }
                                className="absolute top-1 right-1 p-1 rounded-md bg-black/70 hover:bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Remove Snapshot"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Chief Complaints (C/C) */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-700 font-bold text-xs uppercase tracking-wider">
                        {t.consultation.chiefComplaints}
                      </span>
                    </div>

                    {/* Complaint tags */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {commonComplaints.map(chip => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => {
                            if (!chiefComplaints.includes(chip)) {
                              setChiefComplaints(prev => [...prev, chip]);
                            }
                          }}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 hover:bg-cyan-50 hover:text-cyan-800 transition-colors"
                        >
                          + {chip}
                        </button>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={complaintInput}
                        onChange={e => setComplaintInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && complaintInput.trim()) {
                            e.preventDefault();
                            setChiefComplaints(prev => [...prev, complaintInput.trim()]);
                            setComplaintInput('');
                          }
                        }}
                        placeholder="Type complaint and press Enter..."
                        className="flex-1 text-xs border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (complaintInput.trim()) {
                            setChiefComplaints(prev => [...prev, complaintInput.trim()]);
                            setComplaintInput('');
                          }
                        }}
                        className="px-3 py-2 rounded-lg bg-slate-800 text-white text-xs font-bold"
                      >
                        Add
                      </button>
                    </div>

                    {/* Selected complaints */}
                    <div className="space-y-1">
                      {chiefComplaints.map((c, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs bg-cyan-50 text-cyan-900 px-2.5 py-1 rounded-lg"
                        >
                          <span>• {c}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setChiefComplaints(prev => prev.filter((_, i) => i !== idx))
                            }
                            className="text-cyan-600 hover:text-rose-600 font-bold"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Diagnosis */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <span className="text-cyan-700 font-bold text-xs uppercase tracking-wider block">
                      {t.consultation.diagnosis}
                    </span>

                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {commonDiagnoses.map(chip => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => {
                            if (!diagnosis.includes(chip)) {
                              setDiagnosis(prev => [...prev, chip]);
                            }
                          }}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                        >
                          + {chip}
                        </button>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={diagnosisInput}
                        onChange={e => setDiagnosisInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && diagnosisInput.trim()) {
                            e.preventDefault();
                            setDiagnosis(prev => [...prev, diagnosisInput.trim()]);
                            setDiagnosisInput('');
                          }
                        }}
                        placeholder="Type clinical diagnosis..."
                        className="flex-1 text-xs border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (diagnosisInput.trim()) {
                            setDiagnosis(prev => [...prev, diagnosisInput.trim()]);
                            setDiagnosisInput('');
                          }
                        }}
                        className="px-3 py-2 rounded-lg bg-slate-800 text-white text-xs font-bold"
                      >
                        Add
                      </button>
                    </div>

                    <div className="space-y-1">
                      {diagnosis.map((d, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-900 px-2.5 py-1 rounded-lg"
                        >
                          <span className="font-semibold">• {d}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setDiagnosis(prev => prev.filter((_, i) => i !== idx))
                            }
                            className="text-emerald-700 hover:text-rose-600 font-bold"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Investigations Advised */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <span className="text-cyan-700 font-bold text-xs uppercase tracking-wider block">
                      {t.consultation.investigations}
                    </span>

                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {commonInvestigations.map(chip => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => {
                            if (!investigations.includes(chip)) {
                              setInvestigations(prev => [...prev, chip]);
                            }
                          }}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 hover:bg-sky-50 hover:text-sky-800 transition-colors"
                        >
                          + {chip}
                        </button>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={investigationInput}
                        onChange={e => setInvestigationInput(e.target.value)}
                        placeholder="Add test..."
                        className="flex-1 text-xs border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (investigationInput.trim()) {
                            setInvestigations(prev => [...prev, investigationInput.trim()]);
                            setInvestigationInput('');
                          }
                        }}
                        className="px-3 py-2 rounded-lg bg-slate-800 text-white text-xs font-bold"
                      >
                        Add
                      </button>
                    </div>

                    <div className="space-y-1">
                      {investigations.map((test, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg"
                        >
                          <span>
                            {idx + 1}. {test}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setInvestigations(prev => prev.filter((_, i) => i !== idx))
                            }
                            className="text-slate-500 hover:text-rose-600 font-bold"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right 7 Cols: Medication Builder (Rx) & Advice */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Rx Formulary Prescriber */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-serif font-black text-2xl text-cyan-800 italic">
                          ℞
                        </span>
                        <h3 className="font-bold text-sm text-slate-900">
                          {t.consultation.rxMedicines}
                        </h3>
                        <span className="text-xs text-slate-400">
                          ({prescribedMeds.length}{' '}
                          {language === 'bn' ? 'টি ওষুধ' : 'drugs'})
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Saved Templates Modal Trigger */}
                        <button
                          type="button"
                          onClick={() => setShowTemplatesModal(true)}
                          className="px-3 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-cyan-900 text-xs font-bold transition-all flex items-center space-x-1.5 shadow-xs"
                          title="Load pre-built treatment protocols or doctor saved templates"
                        >
                          <Bookmark className="w-3.5 h-3.5 text-cyan-700" />
                          <span>{language === 'bn' ? 'টেমপ্লেট / প্রটোকল' : 'Prescription Templates'}</span>
                          <span className="px-1.5 py-0.2 rounded-full bg-cyan-200/80 text-cyan-900 text-[10px] font-bold">
                            {prescriptionTemplates.length}
                          </span>
                        </button>

                        {/* Save Current as Template Shortcut */}
                        <button
                          type="button"
                          onClick={() => setShowTemplatesModal(true)}
                          className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-cyan-800 text-xs font-semibold transition-all flex items-center space-x-1 shadow-xs"
                          title="Save this consultation prescription pattern for future reuse"
                        >
                          <Plus className="w-3.5 h-3.5 text-slate-500" />
                          <span>{language === 'bn' ? 'সেভ টেমপ্লেট' : 'Save as Template'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Drug Catalog Search Bar */}
                    <div className="relative">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={drugSearchQuery}
                          onChange={e => {
                            setDrugSearchQuery(e.target.value);
                            setShowDrugDropdown(true);
                          }}
                          onFocus={() => setShowDrugDropdown(true)}
                          placeholder="Search formulary by brand name or generic (e.g. Sergel, Paracetamol, Cef-3)..."
                          className="flex-1 text-xs border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                        />
                      </div>

                      {/* Autocomplete Dropdown */}
                      {showDrugDropdown && drugSearchQuery && (
                        <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto divide-y divide-slate-100">
                          {medicines
                            .filter(
                              m =>
                                m.brandName.toLowerCase().includes(drugSearchQuery.toLowerCase()) ||
                                m.genericName.toLowerCase().includes(drugSearchQuery.toLowerCase())
                            )
                            .slice(0, 8)
                            .map(med => (
                              <button
                                key={med.id}
                                type="button"
                                onClick={() => handleAddMedicine(med)}
                                className="w-full text-left p-3 hover:bg-cyan-50 flex items-center justify-between transition-colors"
                              >
                                <div>
                                  <div className="font-bold text-xs text-slate-900">
                                    {med.dosageForm}. {med.brandName} {med.strength}
                                  </div>
                                  <div className="text-[11px] text-slate-500">
                                    {med.genericName} • {med.manufacturer}
                                  </div>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800">
                                  + Add
                                </span>
                              </button>
                            ))}
                        </div>
                      )}
                    </div>

                    {/* Prescribed Drugs List */}
                    <div className="space-y-3">
                      {prescribedMeds.map((med, index) => (
                        <div
                          key={med.id}
                          className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-bold text-cyan-950">
                                {index + 1}. {med.dosageForm}. {med.brandName}
                              </span>
                              <span className="text-xs font-semibold text-slate-700 ml-1.5">
                                {med.strength}
                              </span>
                              <span className="text-[11px] text-slate-500 ml-1.5 italic">
                                ({med.genericName})
                              </span>
                            </div>
                            <div className="flex items-center space-x-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => setDosageModalMed(med)}
                                className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-50 to-teal-50 hover:from-cyan-100 hover:to-teal-100 text-cyan-800 text-[11px] font-bold border border-cyan-200/90 flex items-center space-x-1 transition-all shadow-xs"
                                title="Get AI-suggested dosage for patient age and weight"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                                <span>AI Dosage</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveMedicine(med.id)}
                                className="text-slate-400 hover:text-rose-600 transition-colors p-1 rounded-md hover:bg-rose-50"
                                title="Remove drug"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Schedule, Food relation, Duration */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                            {/* Dosage Schedule */}
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                                Dose (Schedule)
                              </label>
                              <select
                                value={med.dosageSchedule}
                                onChange={e =>
                                  handleUpdateMedicine(med.id, { dosageSchedule: e.target.value })
                                }
                                className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                              >
                                <option value="1+0+1">1 + 0 + 1 (Morning & Night)</option>
                                <option value="1+1+1">1 + 1 + 1 (3 times daily)</option>
                                <option value="0+0+1">0 + 0 + 1 (Night only)</option>
                                <option value="1+0+0">1 + 0 + 0 (Morning only)</option>
                                <option value="0+1+0">0 + 1 + 0 (Noon only)</option>
                                <option value="1 SOS">1 SOS (As needed / যখনি প্রয়োজন)</option>
                              </select>
                            </div>

                            {/* Meal timing */}
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                                Meal Timing
                              </label>
                              <select
                                value={med.mealTiming}
                                onChange={e =>
                                  handleUpdateMedicine(med.id, {
                                    mealTiming: e.target.value as any,
                                  })
                                }
                                className="w-full text-xs bg-white border border-slate-200 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                              >
                                <option value="after_meal">After Meal / ভরা পেটে</option>
                                <option value="before_meal">Before Meal / খাওয়ার আগে</option>
                                <option value="with_meal">With Meal / খাবারের সাথে</option>
                                <option value="empty_stomach">Empty Stomach / খালি পেটে</option>
                              </select>
                            </div>

                            {/* Duration */}
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                                Duration
                              </label>
                              <select
                                value={med.duration}
                                onChange={e =>
                                  handleUpdateMedicine(med.id, { duration: e.target.value })
                                }
                                className="w-full text-xs bg-white border border-slate-200 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                              >
                                <option value="3 Days">3 Days</option>
                                <option value="5 Days">5 Days</option>
                                <option value="7 Days">7 Days</option>
                                <option value="14 Days">14 Days</option>
                                <option value="1 Month">1 Month</option>
                                <option value="Continue">Continue</option>
                              </select>
                            </div>
                          </div>

                          {/* Special instructions in English & Bengali */}
                          <div>
                            <input
                              type="text"
                              value={
                                language === 'bn'
                                  ? med.instructionsBn || med.instructions
                                  : med.instructions
                              }
                              onChange={e => {
                                if (language === 'bn') {
                                  handleUpdateMedicine(med.id, {
                                    instructionsBn: e.target.value,
                                  });
                                } else {
                                  handleUpdateMedicine(med.id, { instructions: e.target.value });
                                }
                              }}
                              placeholder={
                                language === 'bn'
                                  ? 'ওষুধ সেবনের বিশেষ নিয়ম (বাংলায়)...'
                                  : 'Special instruction (e.g. take with a glass of water)...'
                              }
                              className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Special Advice */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <span className="text-cyan-700 font-bold text-xs uppercase tracking-wider block">
                      {t.consultation.advice}
                    </span>

                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={adviceInput}
                        onChange={e => setAdviceInput(e.target.value)}
                        placeholder="Add advice..."
                        className="flex-1 text-xs border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (adviceInput.trim()) {
                            setAdviceList(prev => [...prev, adviceInput.trim()]);
                            setAdviceInput('');
                          }
                        }}
                        className="px-3 py-2 rounded-lg bg-slate-800 text-white text-xs font-bold"
                      >
                        Add
                      </button>
                    </div>

                    <div className="space-y-1">
                      {adviceList.map((adv, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs bg-slate-50 text-slate-800 px-2.5 py-1 rounded-lg"
                        >
                          <span>• {adv}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setAdviceList(prev => prev.filter((_, i) => i !== idx))
                            }
                            className="text-slate-400 hover:text-rose-600 font-bold"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Follow-up Visit Scheduling */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <span className="text-cyan-700 font-bold text-xs uppercase tracking-wider block">
                      {t.consultation.followUp}
                    </span>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-slate-600">
                        {t.consultation.followUpInDays}:
                      </span>
                      {[7, 14, 21, 30].map(days => (
                        <button
                          key={days}
                          type="button"
                          onClick={() => handleFollowUpDaysChange(days)}
                          className={`text-xs px-3 py-1 rounded-lg font-semibold border transition-all ${
                            followUpDays === days.toString()
                              ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {days} {language === 'bn' ? 'দিন' : 'Days'}
                        </button>
                      ))}
                      <input
                        type="date"
                        value={followUpDate}
                        onChange={e => setFollowUpDate(e.target.value)}
                        className="text-xs border border-slate-200 rounded-lg p-1.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Save & Print Trigger */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={handleSaveAndPrint}
                      className="px-6 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-xl shadow-cyan-600/30 flex items-center space-x-2 transition-transform active:scale-95"
                    >
                      <Printer className="w-5 h-5" />
                      <span>{t.consultation.savePrescription}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Prescription Print Modal (handles both newly saved & historical prescriptions) */}
      {showPrintModal && savedPrescription && activePatient && (
        <PrescriptionPrintModal
          prescription={savedPrescription}
          doctor={printDoctor}
          patient={activePatient}
          onClose={() => setShowPrintModal(false)}
        />
      )}

      {/* Quick Actions Floating Menu with shortcuts: Search ICD-11 Codes, Prescribe Lab Test, Add Note, Start Video Call */}
      {activePatient && (
        <QuickActionsFloatingMenu
          onAddDiagnosis={d => {
            if (!diagnosis.includes(d)) {
              setDiagnosis(prev => [...prev, d]);
            }
          }}
          onAddInvestigation={t => {
            if (!investigations.includes(t)) {
              setInvestigations(prev => [...prev, t]);
            }
          }}
          onAddClinicalNote={note => {
            setGeneralVitalsNotes(prev => (prev ? `${prev}\n• ${note}` : `• ${note}`));
          }}
          onStartVideoCall={() => setShowVideoConference(true)}
          onOpenTemplates={() => setShowTemplatesModal(true)}
          currentDiagnoses={diagnosis}
          currentInvestigations={investigations}
        />
      )}

      {/* AI Medication Dosage Suggester Modal */}
      {dosageModalMed && activePatient && (
        <AIDosageModal
          isOpen={Boolean(dosageModalMed)}
          onClose={() => setDosageModalMed(null)}
          medicine={dosageModalMed}
          patient={activePatient}
          diagnosis={diagnosis}
          patientWeight={weight ? `${weight} kg` : undefined}
          onApply={(updates) => {
            handleUpdateMedicine(dosageModalMed.id, updates);
            setCopyFeedback(
              language === 'bn'
                ? `AI ডোজ সাজেশনের তথ্য ${dosageModalMed.brandName} এ সফলভাবে প্রয়োগ করা হয়েছে!`
                : `Applied AI dosage recommendation to ${dosageModalMed.brandName}!`
            );
            setTimeout(() => setCopyFeedback(null), 4000);
          }}
        />
      )}

      {/* Saved Prescriptions & Treatment Protocol Templates Modal */}
      {showTemplatesModal && (
        <SavedPrescriptionsModal
          isOpen={showTemplatesModal}
          onClose={() => setShowTemplatesModal(false)}
          currentDraft={{
            chiefComplaints,
            diagnosis,
            medicines: prescribedMeds,
            investigations,
            adviceList,
            followUpDays,
          }}
          onApplyTemplate={handleApplyTemplate}
        />
      )}
    </div>
  );
};

