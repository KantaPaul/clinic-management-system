import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Prescription, Doctor, Patient } from '../../types';
import { Printer, X, Download, ShieldCheck, Check, Sparkles } from 'lucide-react';

interface PrescriptionPrintModalProps {
  prescription: Prescription;
  doctor: Doctor;
  patient: Patient;
  onClose: () => void;
}

export const PrescriptionPrintModal: React.FC<PrescriptionPrintModalProps> = ({
  prescription,
  doctor,
  patient,
  onClose,
}) => {
  const { settings, language } = useClinic();
  const [printSize, setPrintSize] = useState<'a4' | 'a5'>('a4');

  const handlePrint = () => {
    window.print();
  };

  const getMealTimingLabel = (timing: string, isBn: boolean) => {
    switch (timing) {
      case 'before_meal':
        return isBn ? 'খাওয়ার ৩০ মিনিট আগে' : '30 mins before meal';
      case 'after_meal':
        return isBn ? 'খাওয়ার পর (ভরা পেটে)' : 'After meal';
      case 'with_meal':
        return isBn ? 'খাবারের সাথে' : 'With meal';
      case 'empty_stomach':
        return isBn ? 'খালি পেটে' : 'Empty stomach';
      default:
        return timing;
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Top Modal Controls bar (Hidden during browser print!) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center space-x-3">
            <span className="font-bold text-sm tracking-tight flex items-center space-x-1.5">
              <span>{prescription.id}</span>
              <span className="text-cyan-400 font-mono text-xs">• {prescription.date}</span>
            </span>
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setPrintSize('a4')}
                className={`px-3 py-1 rounded-md transition-all ${
                  printSize === 'a4' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                A4 Format
              </button>
              <button
                onClick={() => setPrintSize('a5')}
                className={`px-3 py-1 rounded-md transition-all ${
                  printSize === 'a5' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                A5 Pad
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-600/30 flex items-center space-x-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'bn' ? 'প্রিন্ট করুন' : 'Print / Save PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Prescription Paper Body - Styled for pristine printing */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100 print:bg-white print:p-0">
          <div
            id="prescription-paper"
            className={`bg-white mx-auto shadow-lg print:shadow-none p-8 border border-slate-200 print:border-none text-slate-800 flex flex-col justify-between ${
              printSize === 'a4'
                ? 'max-w-[760px] min-h-[1050px]'
                : 'max-w-[560px] min-h-[780px]'
            }`}
          >
            <div>
              {/* Clinic Header / Letterhead */}
              <div className="border-b-2 border-cyan-800 pb-4 mb-4 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-black text-cyan-950 tracking-tight">
                    {language === 'bn' ? settings.nameBn : settings.name}
                  </h2>
                  <p className="text-xs font-medium text-slate-600">
                    {language === 'bn' ? settings.taglineBn : settings.tagline}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {language === 'bn' ? settings.addressBn : settings.address}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Tel: {settings.phone} • Email: {settings.email}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 rounded bg-cyan-50 text-cyan-900 font-mono text-[11px] font-bold border border-cyan-200">
                    {prescription.id}
                  </span>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Date: <strong className="text-slate-900">{prescription.date}</strong>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {settings.bmdcRegInfo}
                  </div>
                </div>
              </div>

              {/* Doctor Details Bar */}
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200/80 mb-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    {language === 'bn' && doctor.nameBn ? doctor.nameBn : doctor.name}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {language === 'bn' && doctor.degreesBn ? doctor.degreesBn : doctor.degrees}
                  </p>
                  <p className="text-[11px] font-semibold text-cyan-800">
                    {language === 'bn' && doctor.specialtyBn ? doctor.specialtyBn : doctor.specialty}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block text-xs font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded border border-rose-200">
                    {doctor.bmdcRegNo}
                  </span>
                  <div className="text-[11px] text-slate-500 mt-1 font-medium">
                    {doctor.roomNo}
                  </div>
                </div>
              </div>

              {/* Patient Demographics Bar */}
              <div className="bg-cyan-50/50 p-3 rounded-xl border border-cyan-100 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Patient Name</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {language === 'bn' && patient.nameBn ? patient.nameBn : patient.name}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Age / Gender / Blood</span>
                  <span className="font-semibold text-slate-800">
                    {patient.age} Yrs / <span className="capitalize">{patient.gender}</span> / <span className="text-rose-700 font-bold">{patient.bloodGroup}</span>
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Patient ID</span>
                  <span className="font-mono font-bold text-slate-800">{patient.id}</span>
                </div>
                <div className="text-right sm:text-left">
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Phone</span>
                  <span className="font-mono text-slate-800">{patient.phone}</span>
                </div>
              </div>

              {/* Main Clinical & Rx Columns */}
              <div className="grid grid-cols-12 gap-6 min-h-[500px]">
                {/* Left Column: Complaints, Vitals, Investigations */}
                <div className="col-span-4 border-r border-slate-200 pr-4 space-y-4 text-xs">
                  {/* Complaints */}
                  {prescription.chiefComplaints && prescription.chiefComplaints.length > 0 && (
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-cyan-900 border-b pb-1 mb-1.5">
                        Chief Complaints (C/C)
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px]">
                        {prescription.chiefComplaints.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Vitals */}
                  {prescription.clinicalFindings && (
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-cyan-900 border-b pb-1 mb-1.5">
                        On Examination (O/E)
                      </h4>
                      <div className="space-y-1 text-[11px] text-slate-700">
                        {prescription.clinicalFindings.bloodPressure && (
                          <div>
                            <span className="text-slate-500">BP: </span>
                            <span className="font-bold">{prescription.clinicalFindings.bloodPressure}</span>
                          </div>
                        )}
                        {prescription.clinicalFindings.pulse && (
                          <div>
                            <span className="text-slate-500">Pulse: </span>
                            <span className="font-semibold">{prescription.clinicalFindings.pulse}</span>
                          </div>
                        )}
                        {prescription.clinicalFindings.temperature && (
                          <div>
                            <span className="text-slate-500">Temp: </span>
                            <span className="font-semibold">{prescription.clinicalFindings.temperature}</span>
                          </div>
                        )}
                        {prescription.clinicalFindings.weight && (
                          <div>
                            <span className="text-slate-500">Weight: </span>
                            <span className="font-semibold">{prescription.clinicalFindings.weight}</span>
                          </div>
                        )}
                        {prescription.clinicalFindings.bloodSugar && (
                          <div>
                            <span className="text-slate-500">RBS: </span>
                            <span className="font-semibold">{prescription.clinicalFindings.bloodSugar}</span>
                          </div>
                        )}
                        {prescription.clinicalFindings.generalNotes && (
                          <div className="text-[10px] text-slate-600 mt-1 italic">
                            {prescription.clinicalFindings.generalNotes}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Diagnosis */}
                  {prescription.diagnosis && prescription.diagnosis.length > 0 && (
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-cyan-900 border-b pb-1 mb-1.5">
                        Diagnosis
                      </h4>
                      <div className="space-y-1 text-[11px] font-semibold text-slate-800">
                        {prescription.diagnosis.map((d, i) => (
                          <div key={i}>• {d}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Investigations Advised */}
                  {prescription.investigationsAdvised && prescription.investigationsAdvised.length > 0 && (
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-cyan-900 border-b pb-1 mb-1.5">
                        Tests Advised
                      </h4>
                      <ul className="list-decimal list-inside space-y-1 text-[11px] text-slate-700">
                        {prescription.investigationsAdvised.map((test, i) => (
                          <li key={i}>{test}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Right Column: Rx Drugs & Advice */}
                <div className="col-span-8 space-y-5">
                  <div className="flex items-center space-x-2 border-b-2 border-slate-900 pb-1">
                    <span className="font-serif font-black text-2xl text-slate-900 italic">
                      ℞
                    </span>
                    <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                      Prescribed Medications
                    </span>
                  </div>

                  {/* Medicines List */}
                  <div className="space-y-3">
                    {prescription.medicines.map((med, index) => (
                      <div key={med.id || index} className="pl-2 border-l-2 border-cyan-500">
                        <div className="flex items-baseline space-x-2">
                          <span className="font-bold text-xs text-cyan-900">
                            {index + 1}. {med.dosageForm}. {med.brandName}
                          </span>
                          <span className="text-xs font-semibold text-slate-900">
                            {med.strength}
                          </span>
                          <span className="text-[11px] text-slate-400 italic">
                            ({med.genericName})
                          </span>
                        </div>

                        {/* Dosage timing */}
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                            {med.dosageSchedule}
                          </span>
                          <span className="text-slate-600">
                            — {getMealTimingLabel(med.mealTiming, language === 'bn')}
                          </span>
                          <span className="font-semibold text-cyan-800">
                            — {med.duration}
                          </span>
                        </div>

                        {/* Specific Instructions in Bengali & English */}
                        {(med.instructionsBn || med.instructions) && (
                          <div className="text-[11px] text-slate-600 mt-0.5 font-medium">
                            {language === 'bn' && med.instructionsBn
                              ? med.instructionsBn
                              : med.instructions || med.instructionsBn}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Special Advice */}
                  {prescription.specialAdvice && prescription.specialAdvice.length > 0 && (
                    <div className="pt-4 border-t border-slate-200">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-1.5">
                        {language === 'bn' ? 'পরামর্শ ও নির্দেশাবলী (Advice)' : 'Special Advice & Instructions'}
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-xs text-slate-700">
                        {prescription.specialAdvice.map((adv, i) => (
                          <li key={i}>{adv}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Next Visit / Follow-up */}
                  {prescription.followUpDate && (
                    <div className="pt-2 text-xs font-semibold text-slate-900 flex items-center space-x-2">
                      <span className="text-cyan-800 font-bold uppercase">
                        {language === 'bn' ? 'পরবর্তী সাক্ষাত:' : 'Next Follow-up:'}
                      </span>
                      <span>{prescription.followUpDate}</span>
                      {prescription.followUpNotes && (
                        <span className="text-slate-500 font-normal">({prescription.followUpNotes})</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Signature & Legal Disclaimer */}
            <div className="mt-8 pt-4 border-t border-slate-200">
              <div className="flex justify-between items-end">
                <div className="text-[10px] text-slate-400 max-w-sm leading-tight">
                  {settings.prescriptionDisclaimer}
                  <div className="mt-1 font-mono">Printed on: {new Date().toLocaleString()}</div>
                </div>

                <div className="text-right">
                  <div className="w-48 border-b border-slate-400 mb-1"></div>
                  <div className="text-xs font-bold text-slate-900">{doctor.name}</div>
                  <div className="text-[10px] text-slate-500">{doctor.bmdcRegNo}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
