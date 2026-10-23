import React, { useState } from 'react';
import {
  Zap,
  Search,
  FlaskConical,
  FileEdit,
  X,
  Plus,
  Check,
  BookOpen,
  Bookmark,
  Filter,
  AlertCircle,
  Clock,
  Sparkles,
  ChevronRight,
  Video,
} from 'lucide-react';
import { commonICD11Codes, commonLabTestPanels, ICD11Code, LabTestItem } from '../../data/clinicalShortcutsData';
import { useClinic } from '../../context/ClinicContext';

interface QuickActionsFloatingMenuProps {
  onAddDiagnosis: (diagnosisTitle: string) => void;
  onAddInvestigation: (testName: string) => void;
  onAddClinicalNote: (note: string) => void;
  onStartVideoCall?: () => void;
  onOpenTemplates?: () => void;
  currentDiagnoses?: string[];
  currentInvestigations?: string[];
}

export const QuickActionsFloatingMenu: React.FC<QuickActionsFloatingMenuProps> = ({
  onAddDiagnosis,
  onAddInvestigation,
  onAddClinicalNote,
  onStartVideoCall,
  onOpenTemplates,
  currentDiagnoses = [],
  currentInvestigations = [],
}) => {
  const { settings, language } = useClinic();

  // Floating speed-dial open/close state
  const [isOpen, setIsOpen] = useState(false);

  // Active modal state
  const [activeModal, setActiveModal] = useState<'icd11' | 'lab' | 'note' | null>(null);

  // ICD-11 state
  const [icdSearch, setIcdSearch] = useState('');
  const [icdCategory, setIcdCategory] = useState('All');
  const [addedIcdCodes, setAddedIcdCodes] = useState<string[]>([]);

  // Lab test state
  const [labSearch, setLabSearch] = useState('');
  const [labCategory, setLabCategory] = useState('All');
  const [addedLabTests, setAddedLabTests] = useState<string[]>([]);

  // Note state
  const [noteContent, setNoteContent] = useState('');
  const [noteTemplate, setNoteTemplate] = useState('');

  // Quick note templates
  const noteTemplates = [
    'Patient counseled regarding strict adherence to prescribed medication regimen and low-sodium diet.',
    'Follow-up visit advised with fresh fasting blood glucose and HbA1c test reports in 2 weeks.',
    'Physical examination: chest clear bilaterally, heart sounds normal, no peripheral edema.',
    'Patient advised to report immediately to emergency department if chest pain radiates or dyspnea worsens.',
    'Wound inspected and dressed under aseptic precautions. Sutures clean, no erythema or purulent discharge.',
  ];

  // ICD-11 Categories
  const icdCategories = [
    'All',
    'Cardiovascular',
    'Endocrine & Metabolic',
    'Respiratory',
    'Digestive',
    'Neurological',
    'Musculoskeletal',
    'Infectious',
    'General Symptoms',
  ];

  // Lab Categories
  const labCategories = [
    'All',
    'Hematology',
    'Biochemistry',
    'Urine & Renal',
    'Endocrine & Hormones',
    'Cardiology & Imaging',
  ];

  // Filtered ICD-11 codes
  const filteredICD11 = commonICD11Codes.filter(item => {
    const matchesCategory = icdCategory === 'All' || item.category === icdCategory;
    if (!matchesCategory) return false;
    if (!icdSearch.trim()) return true;
    const q = icdSearch.toLowerCase();
    return (
      item.code.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q) ||
      (item.titleBn && item.titleBn.includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q))
    );
  });

  // Filtered Lab Tests
  const filteredLabTests = commonLabTestPanels.filter(item => {
    const matchesCategory = labCategory === 'All' || item.category === labCategory;
    if (!matchesCategory) return false;
    if (!labSearch.trim()) return true;
    const q = labSearch.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      (item.nameBn && item.nameBn.includes(q)) ||
      item.sampleType.toLowerCase().includes(q)
    );
  });

  const handleSelectICD = (item: ICD11Code) => {
    const formatted = `${item.code} - ${item.title}`;
    onAddDiagnosis(formatted);
    setAddedIcdCodes(prev => [...prev, item.code]);
  };

  const handleSelectLab = (item: LabTestItem) => {
    onAddInvestigation(item.name);
    setAddedLabTests(prev => [...prev, item.id]);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    onAddClinicalNote(noteContent.trim());
    setNoteContent('');
    setActiveModal(null);
  };

  return (
    <>
      {/* Floating Speed Dial Dock at Bottom-Right */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end print:hidden">
        {/* Expanded Shortcut Pills */}
        {isOpen && (
          <div className="mb-3 flex flex-col items-end space-y-2.5 animate-in fade-in slide-in-from-bottom-4 duration-200">
            {/* Shortcut 1: Search ICD-11 Codes */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setActiveModal('icd11');
              }}
              className="flex items-center space-x-2.5 bg-white text-slate-800 hover:text-cyan-700 hover:bg-cyan-50 px-4 py-2.5 rounded-full shadow-lg border border-slate-200 transition-all hover:scale-105 group"
            >
              <div className="w-7 h-7 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <div className="text-right">
                <div className="text-xs font-bold leading-tight">Search ICD-11 Codes</div>
                <div className="text-[10px] text-slate-400">WHO Diagnostic Ontology</div>
              </div>
            </button>

            {/* Shortcut 2: Prescribe Lab Test */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setActiveModal('lab');
              }}
              className="flex items-center space-x-2.5 bg-white text-slate-800 hover:text-teal-700 hover:bg-teal-50 px-4 py-2.5 rounded-full shadow-lg border border-slate-200 transition-all hover:scale-105 group"
            >
              <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <FlaskConical className="w-3.5 h-3.5" />
              </div>
              <div className="text-right">
                <div className="text-xs font-bold leading-tight">Prescribe Lab Test</div>
                <div className="text-[10px] text-slate-400">Pathology & Imaging Panels</div>
              </div>
            </button>

            {/* Shortcut 3: Add Note */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setActiveModal('note');
              }}
              className="flex items-center space-x-2.5 bg-white text-slate-800 hover:text-indigo-700 hover:bg-indigo-50 px-4 py-2.5 rounded-full shadow-lg border border-slate-200 transition-all hover:scale-105 group"
            >
              <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <FileEdit className="w-3.5 h-3.5" />
              </div>
              <div className="text-right">
                <div className="text-xs font-bold leading-tight">Add Clinical Note</div>
                <div className="text-[10px] text-slate-400">Observations & Counseling</div>
              </div>
            </button>

            {/* Shortcut 4: Saved Prescriptions / Clinical Protocols */}
            {onOpenTemplates && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenTemplates();
                }}
                className="flex items-center space-x-2.5 bg-white text-slate-800 hover:text-cyan-700 hover:bg-cyan-50 px-4 py-2.5 rounded-full shadow-lg border border-slate-200 transition-all hover:scale-105 group"
              >
                <div className="w-7 h-7 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                  <Bookmark className="w-3.5 h-3.5" />
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold leading-tight">Prescription Templates</div>
                  <div className="text-[10px] text-slate-400">Saved Regimens & Protocols</div>
                </div>
              </button>
            )}

            {/* Shortcut 4: Start Teleconsult Video */}
            {onStartVideoCall && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onStartVideoCall();
                }}
                className="flex items-center space-x-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 px-4 py-2.5 rounded-full shadow-xl border border-emerald-400/30 transition-all hover:scale-105 group"
              >
                <div className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center group-hover:bg-white group-hover:text-emerald-700 transition-colors">
                  <Video className="w-3.5 h-3.5" />
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold leading-tight">Teleconsult Video</div>
                  <div className="text-[10px] text-emerald-100">WebRTC Remote Call</div>
                </div>
              </button>
            )}
          </div>
        )}

        {/* Main Floating Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center space-x-2 px-4 py-3 rounded-full text-white font-bold shadow-2xl transition-all active:scale-95 ${
            isOpen
              ? 'bg-slate-900 shadow-slate-900/40 rotate-180'
              : 'bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 shadow-cyan-600/40 ring-4 ring-cyan-500/20'
          }`}
          title="Quick Actions Menu (ICD-11, Lab Orders, Clinical Notes)"
        >
          {isOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <>
              <Zap className="w-5 h-5 text-amber-300 animate-pulse" />
              <span className="text-xs font-bold tracking-tight">Quick Actions</span>
            </>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. ICD-11 CODES SEARCH MODAL */}
      {/* ========================================================================= */}
      {activeModal === 'icd11' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Search WHO ICD-11 Diagnostic Codes
                  </h3>
                  <p className="text-xs text-slate-500">
                    International Classification of Diseases 11th Revision for outpatient chamber encounters
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1"
              >
                ×
              </button>
            </div>

            {/* Search Input & Category Pills */}
            <div className="py-3 space-y-2.5 border-b border-slate-100">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  autoFocus
                  value={icdSearch}
                  onChange={e => setIcdSearch(e.target.value)}
                  placeholder="Search by code (e.g. 5A11, BA00), disease name, or Bengali title..."
                  className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none bg-slate-50 font-medium"
                />
              </div>

              {/* Categories */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
                {icdCategories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setIcdCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all text-[11px] ${
                      icdCategory === cat
                        ? 'bg-cyan-600 text-white font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2">
              {filteredICD11.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No matching ICD-11 codes found for "{icdSearch}".
                </div>
              ) : (
                filteredICD11.map(item => {
                  const alreadyInDiagnosis =
                    currentDiagnoses.some(d => d.includes(item.code) || d.includes(item.title)) ||
                    addedIcdCodes.includes(item.code);

                  return (
                    <div
                      key={item.code}
                      className="p-3 rounded-xl border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50/20 transition-all flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-xs bg-cyan-100 text-cyan-900 px-2 py-0.5 rounded border border-cyan-200">
                            {item.code}
                          </span>
                          <span className="font-bold text-slate-900">{item.title}</span>
                          {item.titleBn && (
                            <span className="text-slate-500 text-[11px]">({item.titleBn})</span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                        <span className="inline-block text-[10px] text-slate-400 uppercase font-semibold">
                          {item.category}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectICD(item)}
                        disabled={alreadyInDiagnosis}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 shrink-0 transition-all ${
                          alreadyInDiagnosis
                            ? 'bg-emerald-100 text-emerald-800 cursor-default'
                            : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-xs'
                        }`}
                      >
                        {alreadyInDiagnosis ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add to Diagnosis</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="text-slate-500">
                {filteredICD11.length} diagnostic codes available in catalog
              </span>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. PRESCRIBE LAB TEST MODAL */}
      {/* ========================================================================= */}
      {activeModal === 'lab' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                  <FlaskConical className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Prescribe Diagnostic & Laboratory Tests
                  </h3>
                  <p className="text-xs text-slate-500">
                    Standard laboratory formulary, specimen types, turnaround times, and estimated clinic fees
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1"
              >
                ×
              </button>
            </div>

            {/* Search Input & Category Pills */}
            <div className="py-3 space-y-2.5 border-b border-slate-100">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  autoFocus
                  value={labSearch}
                  onChange={e => setLabSearch(e.target.value)}
                  placeholder="Search test by name (e.g. CBC, HbA1c, Lipid Profile, Creatinine, ECG)..."
                  className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none bg-slate-50 font-medium"
                />
              </div>

              {/* Categories */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
                {labCategories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setLabCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all text-[11px] ${
                      labCategory === cat
                        ? 'bg-teal-600 text-white font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Tests List */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2">
              {filteredLabTests.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No matching tests found for "{labSearch}".
                </div>
              ) : (
                filteredLabTests.map(item => {
                  const alreadyPrescribed =
                    currentInvestigations.includes(item.name) || addedLabTests.includes(item.id);

                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/20 transition-all flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900">{item.name}</span>
                          {item.nameBn && (
                            <span className="text-slate-500 text-[11px]">({item.nameBn})</span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-2">
                          <span>
                            Sample: <strong>{item.sampleType}</strong>
                          </span>
                          <span>•</span>
                          <span>
                            Turnaround: <strong>{item.normalTurnaround}</strong>
                          </span>
                          <span>•</span>
                          <span className="font-mono font-bold text-slate-700">
                            {settings.currencySymbol} {item.estimatedFee}
                          </span>
                        </div>
                        <span className="inline-block text-[10px] text-slate-400 uppercase font-semibold">
                          {item.category}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectLab(item)}
                        disabled={alreadyPrescribed}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 shrink-0 transition-all ${
                          alreadyPrescribed
                            ? 'bg-emerald-100 text-emerald-800 cursor-default'
                            : 'bg-teal-600 hover:bg-teal-500 text-white shadow-xs'
                        }`}
                      >
                        {alreadyPrescribed ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Prescribed</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Prescribe Test</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="text-slate-500">
                {filteredLabTests.length} tests in diagnostic formulary
              </span>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ADD CLINICAL NOTE MODAL */}
      {/* ========================================================================= */}
      {activeModal === 'note' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 flex flex-col animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
                  <FileEdit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Add Clinical Note or Observation
                  </h3>
                  <p className="text-xs text-slate-500">
                    Confidential physician observations, counseling records, or physical examination details
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-4">
              {/* Quick Template Chips */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  + Insert Quick Counseling / Clinical Template:
                </span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {noteTemplates.map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setNoteContent(prev => (prev ? `${prev}\n${tpl}` : tpl))}
                      className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-200 text-slate-700 text-xs transition-colors line-clamp-2"
                    >
                      • {tpl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note Textarea */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Doctor's Clinical Note *
                </label>
                <textarea
                  rows={4}
                  required
                  value={noteContent}
                  onChange={e => setNoteContent(e.target.value)}
                  placeholder="Type clinical observations, counseling notes, or examination findings..."
                  className="w-full text-xs border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-md shadow-indigo-600/20"
                >
                  Save Note to Encounter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
