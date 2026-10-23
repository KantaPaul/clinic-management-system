import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Bookmark,
  Plus,
  Check,
  Trash2,
  FileText,
  Stethoscope,
  Pill,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Info,
  Clock,
  Filter,
} from 'lucide-react';
import { PrescriptionTemplate, PrescribedMedicine } from '../../types';
import { useClinic } from '../../context/ClinicContext';

interface SavedPrescriptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Current active draft data from ConsultationRoom
  currentDraft: {
    chiefComplaints: string[];
    diagnosis: string[];
    medicines: PrescribedMedicine[];
    investigations: string[];
    adviceList: string[];
    followUpDays: string;
  };
  // Callback when a template is applied
  onApplyTemplate: (
    template: PrescriptionTemplate,
    mode: 'replace' | 'append'
  ) => void;
}

export const SavedPrescriptionsModal: React.FC<SavedPrescriptionsModalProps> = ({
  isOpen,
  onClose,
  currentDraft,
  onApplyTemplate,
}) => {
  const {
    prescriptionTemplates,
    savePrescriptionTemplate,
    deletePrescriptionTemplate,
    currentUser,
    language,
  } = useClinic();

  const isBn = language === 'bn';

  // Active Tab: 'browse' | 'save_new'
  const [activeTab, setActiveTab] = useState<'browse' | 'save_new'>('browse');

  // Search and Category filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    prescriptionTemplates[0]?.id || ''
  );

  // New Template Form States
  const [newTitle, setNewTitle] = useState('');
  const [newTitleBn, setNewTitleBn] = useState('');
  const [newCategory, setNewCategory] = useState('General Practice');
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newFollowUpDays, setNewFollowUpDays] = useState(currentDraft.followUpDays || '7');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [applySuccessMsg, setApplySuccessMsg] = useState<string | null>(null);

  // Predefined Categories
  const standardCategories = [
    'General Practice',
    'Pulmonology / Respiratory',
    'Gastroenterology / APD',
    'Cardiology / Hypertension',
    'Endocrinology / Diabetes',
    'Infectious / UTI',
    'Orthopedics / General',
    'Pediatrics',
    'Dermatology',
    'Neurology / General',
  ];

  // Distinct categories present in templates
  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    prescriptionTemplates.forEach(t => cats.add(t.category));
    return ['All', ...Array.from(cats)];
  }, [prescriptionTemplates]);

  // Filtered Templates
  const filteredTemplates = useMemo(() => {
    return prescriptionTemplates.filter(tpl => {
      // Category match
      if (selectedCategory !== 'All' && tpl.category !== selectedCategory) {
        return false;
      }

      // Search match
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();

      const titleMatch = tpl.title.toLowerCase().includes(q);
      const titleBnMatch = tpl.titleBn ? tpl.titleBn.toLowerCase().includes(q) : false;
      const descMatch = tpl.description ? tpl.description.toLowerCase().includes(q) : false;
      const diagMatch = tpl.diagnosis.some(d => d.toLowerCase().includes(q));
      const compMatch = tpl.chiefComplaints?.some(c => c.toLowerCase().includes(q));
      const medMatch = tpl.medicines.some(
        m => m.brandName.toLowerCase().includes(q) || m.genericName.toLowerCase().includes(q)
      );
      const testMatch = tpl.investigationsAdvised?.some(i => i.toLowerCase().includes(q));

      return titleMatch || titleBnMatch || descMatch || diagMatch || compMatch || medMatch || testMatch;
    });
  }, [prescriptionTemplates, selectedCategory, searchQuery]);

  // Ensure active selection remains valid
  const activeTemplate = useMemo(() => {
    return (
      filteredTemplates.find(t => t.id === selectedTemplateId) ||
      filteredTemplates[0] ||
      prescriptionTemplates[0] ||
      null
    );
  }, [filteredTemplates, selectedTemplateId, prescriptionTemplates]);

  if (!isOpen) return null;

  // Handle Save New Template from Current Consultation
  const handleSaveCurrentAsTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const finalCategory =
      newCategory === 'Other' && customCategoryInput.trim()
        ? customCategoryInput.trim()
        : newCategory;

    const saved = savePrescriptionTemplate({
      title: newTitle.trim(),
      titleBn: newTitleBn.trim() || undefined,
      category: finalCategory,
      description: newDescription.trim() || undefined,
      doctorId: currentUser.doctorId || 'global',
      chiefComplaints: [...currentDraft.chiefComplaints],
      diagnosis: [...currentDraft.diagnosis],
      medicines: [...currentDraft.medicines],
      investigationsAdvised: [...currentDraft.investigations],
      specialAdvice: [...currentDraft.adviceList],
      followUpDays: parseInt(newFollowUpDays, 10) || 7,
      isCustom: true,
    });

    setSaveSuccessMsg(
      isBn
        ? `"${saved.title}" টেমপ্লেট হিসেবে সফলভাবে সংরক্ষণ করা হয়েছে!`
        : `Prescription template "${saved.title}" saved successfully!`
    );

    setSelectedTemplateId(saved.id);

    setTimeout(() => {
      setSaveSuccessMsg(null);
      setActiveTab('browse');
    }, 1500);
  };

  const handleApply = (tpl: PrescriptionTemplate, mode: 'replace' | 'append') => {
    onApplyTemplate(tpl, mode);
    setApplySuccessMsg(
      isBn
        ? `"${tpl.title}" প্রেসক্রিপশনে প্রয়োগ করা হয়েছে (${mode === 'replace' ? 'প্রতিস্থাপন' : 'সংযোজন'})`
        : `Applied "${tpl.title}" to prescription (${mode === 'replace' ? 'Replaced' : 'Merged'})`
    );
    setTimeout(() => {
      setApplySuccessMsg(null);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-cyan-900 via-teal-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
              <Bookmark className="w-5 h-5 fill-cyan-400/30 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold">
                  {isBn ? 'সংরক্ষিত প্রেসক্রিপশন ও প্রটোকল টেমপ্লেট' : 'Saved Prescriptions & Treatment Protocols'}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-200 text-[11px] font-bold">
                  {prescriptionTemplates.length} {isBn ? 'টি টেমপ্লেট' : 'Templates'}
                </span>
              </div>
              <p className="text-xs text-cyan-200/80">
                {isBn
                  ? 'সাধারণ রোগের চিকিৎসা প্রটোকল দ্রুত ১-ক্লিকে প্রেসক্রিপশনে লোড করুন অথবা বর্তমান ড্রাফট সেভ করুন'
                  : '1-Click apply standard chamber clinical regimens or save current prescription as a reusable template'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Tab Switcher in Header */}
            <div className="flex items-center bg-white/10 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('browse')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                  activeTab === 'browse'
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isBn ? 'ব্রাউজ ও প্রয়োগ' : 'Browse & Apply'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('save_new')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                  activeTab === 'save_new'
                    ? 'bg-cyan-500 text-white font-bold shadow-xs'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isBn ? 'বর্তমানটি সেভ করুন' : 'Save Current as Template'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl hover:bg-white/10 text-white/80 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Feedback notification */}
        {applySuccessMsg && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs font-bold flex items-center justify-center space-x-2 animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>{applySuccessMsg}</span>
          </div>
        )}
        {saveSuccessMsg && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs font-bold flex items-center justify-center space-x-2 animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: BROWSE & APPLY TEMPLATES */}
        {/* ========================================================================= */}
        {activeTab === 'browse' && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            {/* Left Column: Filter, Search & Template List */}
            <div className="w-full lg:w-5/12 flex flex-col bg-slate-50/70 overflow-hidden">
              {/* Search & Category Header */}
              <div className="p-4 bg-white border-b border-slate-200 space-y-3 shrink-0">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={
                      isBn
                        ? 'রোগের নাম, ওষুধ, ডায়াগনোসিস দিয়ে খুঁজুন...'
                        : 'Search by condition, medicine, symptom, or diagnosis...'
                    }
                    className="w-full pl-9 pr-8 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Category Pills */}
                <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-thin">
                  <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
                  {allCategories.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-all ${
                        selectedCategory === cat
                          ? 'bg-cyan-700 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* List of Templates */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                {filteredTemplates.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-xs font-semibold">
                      {isBn ? 'কোনো টেমপ্লেট পাওয়া যায়নি' : 'No matching templates found'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {isBn
                        ? 'সার্চ ফিল্টার পরিবর্তন করুন অথবা বর্তমান প্রেসক্রিপশন সেভ করুন।'
                        : 'Try adjusting your search query or save your active prescription.'}
                    </p>
                  </div>
                ) : (
                  filteredTemplates.map(tpl => {
                    const isSelected = activeTemplate?.id === tpl.id;

                    return (
                      <div
                        key={tpl.id}
                        onClick={() => setSelectedTemplateId(tpl.id)}
                        className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all relative ${
                          isSelected
                            ? 'bg-white border-cyan-500 ring-2 ring-cyan-500/20 shadow-md'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                              <span className="px-2 py-0.5 rounded-md bg-cyan-100 text-cyan-900 text-[10px] font-bold">
                                {tpl.category}
                              </span>
                              {tpl.isCustom ? (
                                <span className="px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[9px] font-bold">
                                  Doctor Custom
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[9px] font-bold flex items-center space-x-0.5">
                                  <ShieldCheck className="w-2.5 h-2.5 mr-0.5" />
                                  Protocol
                                </span>
                              )}
                            </div>
                            <h4 className="font-bold text-xs text-slate-900 mt-1.5 line-clamp-1">
                              {tpl.title}
                            </h4>
                            {tpl.titleBn && (
                              <p className="text-[11px] text-cyan-800 font-medium line-clamp-1">
                                {tpl.titleBn}
                              </p>
                            )}
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                              {tpl.medicines.length} drugs
                            </span>
                          </div>
                        </div>

                        {/* Summary Badges */}
                        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                          <span className="truncate max-w-[200px]">
                            {tpl.diagnosis.join(', ')}
                          </span>
                          <span className="flex items-center space-x-1 text-cyan-700 font-semibold shrink-0">
                            <span>Preview</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Bottom Quick Action for Saving */}
              <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {currentDraft.medicines.length} medicine(s) in active draft
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('save_new')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-cyan-50 hover:text-cyan-800 text-slate-700 text-xs font-bold flex items-center space-x-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isBn ? 'নতুন টেমপ্লেট বানান' : 'Create New Template'}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Template Detailed Preview & 1-Click Apply */}
            <div className="w-full lg:w-7/12 flex flex-col bg-white overflow-hidden">
              {activeTemplate ? (
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Protocol Detail Header */}
                  <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-cyan-50/30 flex items-start justify-between gap-4 shrink-0">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-900 text-xs font-bold">
                          {activeTemplate.category}
                        </span>
                        {activeTemplate.isCustom ? (
                          <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-bold">
                            Chamber Custom
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold flex items-center">
                            <ShieldCheck className="w-3 h-3 mr-1" />
                            Evidence-Based Protocol
                          </span>
                        )}
                        {activeTemplate.followUpDays && (
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold flex items-center">
                            <Clock className="w-3 h-3 mr-1 text-slate-400" />
                            Follow-up in {activeTemplate.followUpDays} days
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 mt-2">
                        {activeTemplate.title}
                      </h3>
                      {activeTemplate.titleBn && (
                        <p className="text-xs font-semibold text-cyan-800 mt-0.5">
                          {activeTemplate.titleBn}
                        </p>
                      )}
                      {activeTemplate.description && (
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                          {activeTemplate.description}
                        </p>
                      )}
                    </div>

                    {/* Delete Custom Template Option */}
                    {activeTemplate.isCustom && (
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            confirm(
                              `Are you sure you want to delete template "${activeTemplate.title}"?`
                            )
                          ) {
                            deletePrescriptionTemplate(activeTemplate.id);
                          }
                        }}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
                        title="Delete custom template"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Scrollable Content of the Protocol */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-5">
                    {/* Complaints & Diagnoses Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Chief Complaints */}
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-900 block mb-1.5 flex items-center">
                          <Stethoscope className="w-3.5 h-3.5 mr-1 text-cyan-700" />
                          Chief Complaints (C/C)
                        </span>
                        {activeTemplate.chiefComplaints &&
                        activeTemplate.chiefComplaints.length > 0 ? (
                          <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                            {activeTemplate.chiefComplaints.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-xs text-slate-400 italic">None specified</span>
                        )}
                      </div>

                      {/* Diagnoses */}
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block mb-1.5 flex items-center">
                          <Check className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                          Clinical Diagnosis
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {activeTemplate.diagnosis.map((d, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold"
                            >
                              • {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Prescribed Medications Section */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                          <span className="font-serif font-black text-lg text-cyan-800 italic">
                            ℞
                          </span>
                          <span>Prescribed Medications ({activeTemplate.medicines.length})</span>
                        </span>
                      </div>

                      <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                        {activeTemplate.medicines.map((med, idx) => (
                          <div
                            key={med.id || idx}
                            className="p-3 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center space-x-2">
                                <span className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-900 text-[10px] font-bold flex items-center justify-center shrink-0">
                                  {idx + 1}
                                </span>
                                <strong className="text-slate-900 font-bold text-xs">
                                  {med.dosageForm}. {med.brandName}
                                </strong>
                                <span className="font-mono text-cyan-800 bg-cyan-50 px-1.5 py-0.5 rounded text-[10px]">
                                  {med.strength}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 pl-7">
                                {med.genericName}
                              </div>
                              {(med.instructions || med.instructionsBn) && (
                                <div className="text-[11px] text-slate-600 pl-7 italic">
                                  {med.instructions} {med.instructionsBn && `(${med.instructionsBn})`}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center space-x-2 self-start sm:self-center pl-7 sm:pl-0 shrink-0">
                              <span className="px-2 py-1 rounded-md bg-cyan-50 text-cyan-900 font-mono font-bold text-[11px] border border-cyan-200">
                                {med.dosageSchedule}
                              </span>
                              <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 font-medium text-[10px]">
                                {med.mealTiming.replace('_', ' ')}
                              </span>
                              <span className="px-2 py-1 rounded-md bg-amber-50 text-amber-800 font-bold text-[10px] border border-amber-200">
                                {med.duration}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Advised Tests and Advice Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Investigations */}
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                          Investigations Advised
                        </span>
                        {activeTemplate.investigationsAdvised &&
                        activeTemplate.investigationsAdvised.length > 0 ? (
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                            {activeTemplate.investigationsAdvised.map((test, i) => (
                              <div key={i} className="flex items-start space-x-1.5">
                                <span className="text-slate-400 font-bold">•</span>
                                <span>{test}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400 italic">No investigations</div>
                        )}
                      </div>

                      {/* Special Advice */}
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                          Special Advice & Guidance
                        </span>
                        {activeTemplate.specialAdvice && activeTemplate.specialAdvice.length > 0 ? (
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                            {activeTemplate.specialAdvice.map((adv, i) => (
                              <div key={i} className="flex items-start space-x-1.5">
                                <span className="text-emerald-500 font-bold">•</span>
                                <span>{adv}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400 italic">No special advice</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 1-Click Apply Action Bar */}
                  <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                    <div className="text-xs text-slate-600 flex items-center space-x-1.5">
                      <Info className="w-4 h-4 text-cyan-700 shrink-0" />
                      <span>
                        Choose whether to replace the active draft or merge template items.
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => handleApply(activeTemplate, 'append')}
                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-cyan-400 bg-white hover:bg-cyan-50 text-cyan-900 font-bold text-xs shadow-xs transition-all flex items-center justify-center space-x-1.5"
                        title="Add these medicines and advice to your currently entered prescription without removing existing notes"
                      >
                        <Plus className="w-3.5 h-3.5 text-cyan-700" />
                        <span>{isBn ? 'সংযোজন করুন (Append)' : 'Append to Current'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApply(activeTemplate, 'replace')}
                        className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition-all flex items-center justify-center space-x-1.5"
                        title="Replace current prescription with this protocol"
                      >
                        <Check className="w-4 h-4" />
                        <span>{isBn ? 'প্রেসক্রিপশনে প্রয়োগ (Replace)' : 'Apply Template (Replace)'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400">
                  <p className="text-xs">Select a template from the left to view details</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: SAVE CURRENT CONSULTATION AS TEMPLATE */}
        {/* ========================================================================= */}
        {activeTab === 'save_new' && (
          <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full">
            <form onSubmit={handleSaveCurrentAsTemplate} className="space-y-6">
              {/* Informational Banner */}
              <div className="p-4 rounded-2xl bg-cyan-50/80 border border-cyan-200 flex items-start space-x-3">
                <Bookmark className="w-5 h-5 text-cyan-700 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 leading-relaxed">
                  <strong className="text-cyan-950 font-bold block mb-0.5">
                    {isBn
                      ? 'বর্তমান প্রেসক্রিপশন টেমপ্লেট হিসেবে সংরক্ষণ করুন'
                      : 'Capture Current Treatment Regimen as a Reusable Protocol'}
                  </strong>
                  {isBn
                    ? 'আপনার চেম্বারে ঘন ঘন ব্যবহৃত চিকিৎসা পদ্ধতি সেভ করে রাখলে ভবিষ্যতে একই সমস্যায় মাত্র ১-ক্লিকে ওষুধ, ডোজ ও উপদেশ লোড করা যাবে।'
                    : 'Save your recurring clinical patterns to reuse across future consultations with single-click precision. All active medications, schedules, instructions, investigations, and advice are automatically attached.'}
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    {isBn ? 'টেমপ্লেটের শিরোনাম (English Title) *' : 'Template Title *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g. Acute Dengue Protocol, Geriatric Knee Osteoarthritis"
                    className="w-full text-xs border border-slate-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    {isBn ? 'বাংলা শিরোনাম (ঐচ্ছিক)' : 'Bengali Title (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={newTitleBn}
                    onChange={e => setNewTitleBn(e.target.value)}
                    placeholder="যেমন: ডেঙ্গু জ্বর ও পর্যবেক্ষণ প্রটোকল"
                    className="w-full text-xs border border-slate-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    {isBn ? 'বিভাগ বা স্পেশালিটি (Category) *' : 'Specialty / Category *'}
                  </label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none bg-white"
                  >
                    {standardCategories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="Other">Other / Custom Category...</option>
                  </select>

                  {newCategory === 'Other' && (
                    <input
                      type="text"
                      required
                      value={customCategoryInput}
                      onChange={e => setCustomCategoryInput(e.target.value)}
                      placeholder="Enter custom category name..."
                      className="mt-2 w-full text-xs border border-slate-300 rounded-xl px-3.5 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    />
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    {isBn ? 'প্রস্তাবিত ফলো-আপ (দিন)' : 'Default Follow-up (Days)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={newFollowUpDays}
                    onChange={e => setNewFollowUpDays(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    {isBn ? 'বিবরণ বা চিকিৎসকের ক্লিনিক্যাল নোট (ঐচ্ছিক)' : 'Clinical Description / Indications (Optional)'}
                  </label>
                  <textarea
                    rows={2}
                    value={newDescription}
                    onChange={e => setNewDescription(e.target.value)}
                    placeholder="Brief description of clinical scenario, patient criteria, or red flags..."
                    className="w-full text-xs border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Summary of Items being captured from the active draft */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Items to be Saved in this Template from Active Consultation:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Diagnoses */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-700 block mb-1">
                      Diagnoses ({currentDraft.diagnosis.length}):
                    </span>
                    {currentDraft.diagnosis.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {currentDraft.diagnosis.map((d, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 text-[11px] font-semibold"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">None entered in draft</span>
                    )}
                  </div>

                  {/* Complaints */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-700 block mb-1">
                      Chief Complaints ({currentDraft.chiefComplaints.length}):
                    </span>
                    {currentDraft.chiefComplaints.length > 0 ? (
                      <ul className="list-disc list-inside text-slate-600 text-[11px] space-y-0.5">
                        {currentDraft.chiefComplaints.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-slate-400 italic">None entered</span>
                    )}
                  </div>
                </div>

                {/* Medicines List */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-700 text-xs">
                      Medications to be Preserved ({currentDraft.medicines.length}):
                    </span>
                    {currentDraft.medicines.length === 0 && (
                      <span className="text-rose-600 text-[11px] font-semibold">
                        Notice: No medicines in current draft!
                      </span>
                    )}
                  </div>

                  {currentDraft.medicines.length > 0 ? (
                    <div className="space-y-1.5">
                      {currentDraft.medicines.map((m, i) => (
                        <div
                          key={m.id || i}
                          className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-50 border border-slate-100"
                        >
                          <span className="font-bold text-slate-800">
                            {i + 1}. {m.dosageForm}. {m.brandName} ({m.strength})
                          </span>
                          <span className="font-mono text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded text-[11px]">
                            {m.dosageSchedule} • {m.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      You can still save a template with complaints/diagnoses/tests, or add medicines to active draft first.
                    </p>
                  )}
                </div>

                {/* Investigations & Advice preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-700 block mb-1">
                      Advised Tests ({currentDraft.investigations.length}):
                    </span>
                    <span className="text-slate-600 text-[11px]">
                      {currentDraft.investigations.join(', ') || 'None'}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-700 block mb-1">
                      Special Advice ({currentDraft.adviceList.length}):
                    </span>
                    <span className="text-slate-600 text-[11px] line-clamp-2">
                      {currentDraft.adviceList.join(' • ') || 'None'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('browse')}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xs shadow-md shadow-cyan-700/20 flex items-center space-x-2"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>{isBn ? 'টেমপ্লেট হিসেবে সংরক্ষণ করুন' : 'Save as Reusable Template'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
