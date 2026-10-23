import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Check,
  AlertTriangle,
  Clock,
  ShieldAlert,
  ArrowRight,
  Info,
  RefreshCw,
  X,
  User,
  Scale,
} from 'lucide-react';
import { Patient, PrescribedMedicine } from '../../types';
import { useClinic } from '../../context/ClinicContext';

interface AIDosageSuggestion {
  dosageForm: string;
  strength: string;
  dosageSchedule: string;
  mealTiming: 'before_meal' | 'after_meal' | 'with_meal' | 'empty_stomach';
  duration: string;
  instructionsEn: string;
  instructionsBn: string;
  clinicalRationale: string;
  safetyWarnings?: string[];
  source?: string;
}

interface AIDosageModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: PrescribedMedicine;
  patient: Patient;
  diagnosis: string[];
  patientWeight?: string;
  onApply: (updates: Partial<PrescribedMedicine>) => void;
}

export const AIDosageModal: React.FC<AIDosageModalProps> = ({
  isOpen,
  onClose,
  medicine,
  patient,
  diagnosis,
  patientWeight,
  onApply,
}) => {
  const { settings, language } = useClinic();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<AIDosageSuggestion | null>(null);

  const isPediatric = patient.age < 12;

  const fetchDosageSuggestion = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/suggest-dosage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          drugName: medicine.brandName,
          genericName: medicine.genericName,
          patientAge: patient.age,
          patientGender: patient.gender,
          patientWeight: patientWeight || (isPediatric ? `${patient.age * 2 + 8} kg (Est.)` : '65 kg'),
          diagnosis,
          allergies: patient.allergies,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuggestion(data);
      } else {
        setError(data.error || 'Failed to fetch AI dosage recommendation.');
      }
    } catch (err: any) {
      console.error('Error contacting AI dosage service:', err);
      setError('Could not reach the dosage suggestion service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && medicine) {
      fetchDosageSuggestion();
    }
  }, [isOpen, medicine.id, medicine.brandName]);

  if (!isOpen) return null;

  const handleApplySuggestion = () => {
    if (!suggestion) return;

    onApply({
      dosageForm: suggestion.dosageForm as any,
      strength: suggestion.strength,
      dosageSchedule: suggestion.dosageSchedule,
      mealTiming: suggestion.mealTiming,
      duration: suggestion.duration,
      instructions: suggestion.instructionsEn,
      instructionsBn: suggestion.instructionsBn,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-cyan-600/20">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center space-x-1.5">
                <span>AI Clinical Dosage Suggester</span>
                <span className="text-[10px] uppercase font-mono font-bold bg-cyan-100 text-cyan-800 px-1.5 py-0.2 rounded">
                  Gemini 3.8
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Evidence-based dosage calculation adjusted for age and weight profile
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1"
          >
            ×
          </button>
        </div>

        {/* Patient & Drug Summary Bar */}
        <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs shrink-0 space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-slate-400 font-medium">Drug Selected: </span>
              <strong className="text-slate-900 text-sm">
                {medicine.brandName}
              </strong>
              <span className="text-slate-500 italic ml-1">({medicine.genericName})</span>
            </div>
            {isPediatric && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                Pediatric Patient (&lt; 12y)
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-slate-600 text-[11px] pt-1 border-t border-slate-200/60">
            <span className="flex items-center">
              <User className="w-3 h-3 text-slate-400 mr-1" />
              Patient: <strong>{patient.name}</strong> ({patient.age}y, {patient.gender})
            </span>
            <span>•</span>
            <span className="flex items-center">
              <Scale className="w-3 h-3 text-slate-400 mr-1" />
              Weight: <strong>{patientWeight || (isPediatric ? `${patient.age * 2 + 8} kg (Est.)` : '65 kg')}</strong>
            </span>
            {diagnosis.length > 0 && (
              <>
                <span>•</span>
                <span className="truncate max-w-[200px]">
                  Diagnosis: <strong>{diagnosis[0]}</strong>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {loading && (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center mx-auto animate-spin">
                <RefreshCw className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-slate-700">
                Consulting clinical pharmacology guidelines...
              </p>
              <p className="text-[11px] text-slate-400">
                Calculating age & weight-specific milligrams per kilogram per day
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 space-y-2">
              <div className="flex items-center space-x-2 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Unable to load AI suggestion</span>
              </div>
              <p>{error}</p>
              <button
                type="button"
                onClick={fetchDosageSuggestion}
                className="mt-2 px-3 py-1 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700"
              >
                Retry Calculation
              </button>
            </div>
          )}

          {!loading && suggestion && (
            <div className="space-y-4">
              {/* Core Suggested Dosage Grid */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-50/70 via-teal-50/40 to-slate-50 border border-cyan-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-cyan-900 uppercase tracking-wider flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Recommended Clinical Regimen</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Form: <strong>{suggestion.dosageForm}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-white p-2.5 rounded-lg border border-cyan-100 shadow-xs">
                    <span className="text-[10px] text-slate-400 block font-medium">Strength</span>
                    <strong className="text-xs font-bold text-cyan-950 font-mono">
                      {suggestion.strength}
                    </strong>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-cyan-100 shadow-xs">
                    <span className="text-[10px] text-slate-400 block font-medium">Schedule (Dose)</span>
                    <strong className="text-xs font-bold text-slate-900 font-mono">
                      {suggestion.dosageSchedule}
                    </strong>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-cyan-100 shadow-xs">
                    <span className="text-[10px] text-slate-400 block font-medium">Meal Relation</span>
                    <strong className="text-xs font-semibold text-slate-800 capitalize">
                      {suggestion.mealTiming.replace('_', ' ')}
                    </strong>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-cyan-100 shadow-xs">
                    <span className="text-[10px] text-slate-400 block font-medium">Duration</span>
                    <strong className="text-xs font-semibold text-cyan-900">
                      {suggestion.duration}
                    </strong>
                  </div>
                </div>

                {/* Clinical Rationale Box */}
                <div className="p-3 bg-white/80 rounded-lg border border-cyan-100/80 text-xs text-slate-700 space-y-1">
                  <span className="font-bold text-[10px] uppercase text-cyan-800 flex items-center space-x-1">
                    <Info className="w-3 h-3" />
                    <span>Clinical Rationale & Pharmacology:</span>
                  </span>
                  <p className="text-[11px] leading-relaxed text-slate-600">
                    {suggestion.clinicalRationale}
                  </p>
                </div>
              </div>

              {/* Instructions preview */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Patient Instructions:
                </span>
                <div className="text-slate-800 font-medium">
                  <strong>EN:</strong> {suggestion.instructionsEn}
                </div>
                <div className="text-emerald-800 font-medium">
                  <strong>বাংলা:</strong> {suggestion.instructionsBn}
                </div>
              </div>

              {/* Safety Precautions */}
              {suggestion.safetyWarnings && suggestion.safetyWarnings.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <span className="font-bold text-[10px] uppercase flex items-center space-x-1 text-amber-800">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                    <span>Clinical Warnings & Maximum Dose Limits:</span>
                  </span>
                  <ul className="list-disc list-inside text-[11px] text-amber-800 space-y-0.5">
                    {suggestion.safetyWarnings.map((warn, i) => (
                      <li key={i}>{warn}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-200 flex space-x-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApplySuggestion}
            disabled={!suggestion || loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-cyan-600/30 flex items-center justify-center space-x-1.5 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Apply to Prescription</span>
          </button>
        </div>
      </div>
    </div>
  );
};
