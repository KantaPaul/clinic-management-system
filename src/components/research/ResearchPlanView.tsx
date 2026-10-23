import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  marketResearchCompetitors,
  swotData,
  mvpScopeChecklist,
} from '../../data/dispensaryData';
import {
  FileText,
  AlertOctagon,
  CheckCircle2,
  TrendingUp,
  XCircle,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  DollarSign,
  ArrowRight,
  Sparkles,
  Layers,
  Scale,
  Users,
  Building,
  Lock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const ResearchPlanView: React.FC = () => {
  const { settings, language, t } = useClinic();

  const [activeTab, setActiveTab] = useState<'decision' | 'competitors' | 'swot' | 'mvp' | 'pricing' | 'interview'>('decision');
  const [testedLicensePrice, setTestedLicensePrice] = useState<59 | 69 | 89>(59);
  const [activeInterviewFilter, setActiveInterviewFilter] = useState<'all' | 'owner' | 'doctor' | 'dispenser' | 'dev'>('all');

  const interviewGuide = [
    {
      id: 1,
      targetRole: 'owner',
      targetName: 'Clinic Owner / Managing Director',
      question: 'Walk through yesterday’s last prescription: who typed it, who handed over the medicine, who took the money, and where did the stock count decrement?',
      purpose: 'Identifies handoff friction points between doctor chamber, billing desk, and dispensary shelf.',
      keyFinding: 'In standard Bangladeshi outpatient chambers, the doctor prescribes, the patient walks with paper Rx to the dispensary window, the dispenser grabs strips and quotes a price, and money is collected either at the pharmacy counter or unified reception.',
    },
    {
      id: 2,
      targetRole: 'dispenser',
      targetName: 'Dispensary Pharmacist (Dispenser)',
      question: 'What happens when a 10-tablet strip is opened and the patient only wants to buy 4 loose tablets?',
      purpose: 'Validates unit conversion and loose tablet integer tracking vs inventory slippage.',
      keyFinding: 'Dispensers regularly cut strips. If software only tracks boxes or strips, stock goes out of sync immediately. Integer base unit tracking (tablets) is required.',
    },
    {
      id: 3,
      targetRole: 'dispenser',
      targetName: 'Dispensary Pharmacist',
      question: 'What do you do with a short supply, an expired box, or when a supplier delivers only part of an order?',
      purpose: 'Validates partial goods receipt (GRN) and FEFO lockout enforcement.',
      keyFinding: 'Suppliers regularly deliver partial shipments. Stock must rise strictly on goods receipt (GRN) without requiring a closed PO. Expired drugs must be blocked from dispensing.',
    },
    {
      id: 4,
      targetRole: 'doctor',
      targetName: 'Consultant Physician / Chamber Doctor',
      question: 'Do you want to manage inventory or stock levels during your patient consultation?',
      purpose: 'Validates separation of clinical prescription vs inventory decrement.',
      keyFinding: 'Doctors adamantly refuse to manage stock or see stock counts during clinical encounters. They write brand/generic, dose, and duration. Saving the Rx must not alter stock.',
    },
    {
      id: 5,
      targetRole: 'owner',
      targetName: 'Clinic Owner / Reception',
      question: 'What software do you currently pay for, would you install Docker or only cPanel PHP, and is an English clinical screen with Bangla printed receipt acceptable?',
      purpose: 'Validates hosting deployment target, price tolerance, and bilingual print requirements.',
      keyFinding: 'Most independent clinics pay ৳500 to ৳3,000/month or hire a local developer. English UI with Bangla printout is standard practice across Bangladesh.',
    },
    {
      id: 6,
      targetRole: 'dev',
      targetName: 'CodeCanyon Buyer Profile',
      question: 'Which medical/pharmacy script did you last purchase, how long did the setup take, and would you pay $59 or $89 for a dispensary attached to the visit?',
      purpose: 'Validates marketplace buyer willingness to pay and stack preferences.',
      keyFinding: 'CodeCanyon buyers look for source editability, LAN offline support, and low install effort. $89 has high friction (KiviCare Pharma only had 10 sales at $89). Test at $59.',
    },
  ];

  const filteredInterviews = interviewGuide.filter(
    item => activeInterviewFilter === 'all' || item.targetRole === activeInterviewFilter
  );

  return (
    <div className="space-y-6">
      {/* Plan Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-cyan-400 flex items-center justify-center font-bold shadow-xs">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Plan 0a82bd6e: Clinic Pharmacy Market Research
                </h1>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
                  DECISION: NO-GO
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Phase One Feasibility Review · Research Date: 23 Oct 2026 · Channel Blocker & Dispensary MVP Specification
              </p>
            </div>
          </div>
        </div>

        {/* Plan File Reference Pill */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          <span>.cursor/plans/clinic_pharmacy_research_0a82bd6e.plan.md</span>
        </div>
      </div>

      {/* Top Decision Gate Banner */}
      <div className="p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <AlertOctagon className="w-5 h-5 shrink-0" />
              <span>Executive Ruling: No-Go for CodeCanyon Marketplace Submission</span>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              <strong>Grounding evidence from research:</strong> Envato paused new Market author applications on 25 Sep 2026. Code category is not in the invitation set. CodeCanyon sales demonstrate that clinic scripts sell at $39–$89 (hundreds of sales), while pharmacy add-ons show weak marketplace traction (KiviCare Pharma: only 10 sales at $89). Building an 8-phase full ERP would be commercially unviable on this channel.
            </p>
            <div className="pt-1 flex items-center gap-2 text-[11px] text-cyan-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                <strong>Approved Alternative Scope:</strong> A self-hosted, single-clinic dispensary MVP attached directly to the patient visit (Prescription-to-Dispense Trail).
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span className="text-[11px] text-slate-400 font-medium">Research Plan Protocol</span>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold">
                PRD Blocked
              </span>
              <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold">
                Dispensary MVP Approved
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveTab('decision')}
            className={`px-4 py-2 font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'decision'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
            <span>Decision Gate & Blocker</span>
          </button>

          <button
            onClick={() => setActiveTab('competitors')}
            className={`px-4 py-2 font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'competitors'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Market Shelves & Sales Data</span>
          </button>

          <button
            onClick={() => setActiveTab('swot')}
            className={`px-4 py-2 font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'swot'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>SWOT Strategic Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('mvp')}
            className={`px-4 py-2 font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'mvp'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Recommended MVP vs Deferred</span>
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-4 py-2 font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'pricing'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Price Test Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('interview')}
            className={`px-4 py-2 font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'interview'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Field Discovery Guide (8-10 Interviews)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DECISION GATE & CHANNEL BLOCKER */}
      {activeTab === 'decision' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Channel Blocker Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                <Lock className="w-4 h-4" />
                <span>Verified Channel Blocker (Envato Code Author Intake)</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold shrink-0">·</span>
                  <span>
                    <strong>Author Intake Paused:</strong> Envato help article updated 25 Sep 2026 confirms new author registrations are paused indefinitely. No waitlist exists.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold shrink-0">·</span>
                  <span>
                    <strong>Stack Barrier:</strong> Envato CodeCanyon buyers are overwhelmingly cPanel PHP/Laravel developers. A Next.js/Docker zip is not reviewed as a drop-in PHP script.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold shrink-0">·</span>
                  <span>
                    <strong>License Check Trap:</strong> Competitors like Medicine Care lock offline installs on periodic server checks (license.ayaantec.com). Plan 0a82bd6e mandates offline database continuity with zero remote kill-switches.
                  </span>
                </li>
              </ul>
            </div>

            {/* Strategic Differentiation Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Strategic Differentiator: Dispensary Attached to the Visit</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Positioning that matches real buyer evidence is a <strong>self-hosted in-house dispensary</strong> attached to the outpatient consultation, with an unbroken audit trail:
              </p>
              <div className="bg-purple-50/70 border border-purple-200 rounded-lg p-3 text-xs font-mono text-purple-900 space-y-1">
                <div>1. Doctor writes short prescription (brand, strength, schedule)</div>
                <div>2. Saving Rx does NOT alter stock ledger</div>
                <div>3. Dispenser selects valid FEFO lot & issues actual quantity</div>
                <div>4. Partial dispense recorded with clinical reason</div>
                <div>5. Consolidated bill carries consultation + medicines on 1 invoice</div>
              </div>
            </div>
          </div>

          {/* CodeCanyon Shelves Flowchart */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Market Distribution Structure (Plan 0a82bd6e Diagram)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="font-bold text-slate-900">Hospital & Clinic Scripts</div>
                <div className="text-[11px] text-emerald-700 font-semibold mt-1">Hundreds to thousands of sales</div>
                <div className="text-[11px] text-slate-500 mt-1">Smart Hospital (2,036), KiviCare (1,229), Doxe (514), InfyCare (403)</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="font-bold text-slate-900">Standalone Pharmacy POS</div>
                <div className="text-[11px] text-amber-700 font-semibold mt-1">Low hundreds over several years</div>
                <div className="text-[11px] text-slate-500 mt-1">Medicine Care (146 sales in 5 yrs), Medix (164 in 9 yrs), Acnoo (119)</div>
              </div>

              <div className="p-3 bg-rose-50 rounded-lg border border-rose-200">
                <div className="font-bold text-rose-900">Clinic-Pharmacy Add-on</div>
                <div className="text-[11px] text-rose-700 font-semibold mt-1">10 sales only</div>
                <div className="text-[11px] text-rose-600 mt-1">KiviCare Pharma Add-on ($89). Proves low appetite for separate paid add-ons.</div>
              </div>

              <div className="p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                <div className="font-bold text-cyan-900">Bangladesh Hosted ERP</div>
                <div className="text-[11px] text-cyan-700 font-semibold mt-1">Monthly BDT subscription</div>
                <div className="text-[11px] text-slate-600 mt-1">Bisnesy (৳499-৳2k/mo), ShifaSoft (৳8,000/mo), ChamberBD</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMPETITOR MATRIX */}
      {activeTab === 'competitors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Competitor Benchmark Matrix (Audited 23 Oct 2026)
            </h2>
            <span className="text-xs text-slate-500">
              Verified public figures from CodeCanyon listings & Bangladesh vendor pages
            </span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Product Name</th>
                    <th className="py-3 px-4">Market Shelf</th>
                    <th className="py-3 px-4">Sales Count</th>
                    <th className="py-3 px-4">Price Model</th>
                    <th className="py-3 px-4 text-center">Batch FEFO</th>
                    <th className="py-3 px-4 text-center">Strip Conv.</th>
                    <th className="py-3 px-4 text-center">Rx Linked</th>
                    <th className="py-3 px-4">Documented Limitation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {marketResearchCompetitors.map((comp, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                        {comp.name}
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        {comp.category}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-purple-700 whitespace-nowrap">
                        {comp.salesCount}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-800 whitespace-nowrap">
                        {comp.priceModel}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {comp.fefoBatchSupported ? (
                          <span className="text-emerald-600 font-bold">Yes</span>
                        ) : (
                          <span className="text-slate-300 font-medium">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {comp.stripConversionSupported ? (
                          <span className="text-emerald-600 font-bold">Yes</span>
                        ) : (
                          <span className="text-slate-300 font-medium">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {comp.prescriptionLinked ? (
                          <span className="text-emerald-600 font-bold">Yes</span>
                        ) : (
                          <span className="text-slate-300 font-medium">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-500 max-w-xs text-[11px]">
                        {comp.keyLimitationOrNote}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SWOT MATRIX */}
      {activeTab === 'swot' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="bg-emerald-50/40 rounded-xl border border-emerald-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Strengths to Design Toward</span>
            </div>
            <div className="space-y-2.5">
              {swotData.strengths.map((item, i) => (
                <div key={i} className="bg-white p-3 rounded-lg border border-emerald-100 shadow-2xs">
                  <div className="font-bold text-slate-900 text-xs">{item.title}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">{item.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Weaknesses */}
          <div className="bg-rose-50/40 rounded-xl border border-rose-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
              <XCircle className="w-5 h-5 text-rose-600" />
              <span>Weaknesses & Channel Roadblocks</span>
            </div>
            <div className="space-y-2.5">
              {swotData.weaknesses.map((item, i) => (
                <div key={i} className="bg-white p-3 rounded-lg border border-rose-100 shadow-2xs">
                  <div className="font-bold text-slate-900 text-xs">{item.title}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">{item.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Opportunities */}
          <div className="bg-cyan-50/40 rounded-xl border border-cyan-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-cyan-800 font-bold text-sm">
              <TrendingUp className="w-5 h-5 text-cyan-600" />
              <span>Market Opportunities</span>
            </div>
            <div className="space-y-2.5">
              {swotData.opportunities.map((item, i) => (
                <div key={i} className="bg-white p-3 rounded-lg border border-cyan-100 shadow-2xs">
                  <div className="font-bold text-slate-900 text-xs">{item.title}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">{item.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Threats */}
          <div className="bg-amber-50/40 rounded-xl border border-amber-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
              <AlertOctagon className="w-5 h-5 text-amber-600" />
              <span>Market Threats</span>
            </div>
            <div className="space-y-2.5">
              {swotData.threats.map((item, i) => (
                <div key={i} className="bg-white p-3 rounded-lg border border-amber-100 shadow-2xs">
                  <div className="font-bold text-slate-900 text-xs">{item.title}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">{item.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RECOMMENDED MVP VS DEFERRED SCOPE */}
      {activeTab === 'mvp' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Recommended MVP Scope vs Roadmap Guardrails
              </h2>
              <p className="text-xs text-slate-500">
                Disciplined scope derived from buyer evidence. Excludes full retail POS and inpatient beds.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Feature / Protocol</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Plan 0a82bd6e Specification</th>
                    <th className="py-3 px-4">Design Implementation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mvpScopeChecklist.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {item.feature}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-medium">
                        {item.category}
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-[11px]">
                        {item.description}
                      </td>
                      <td className="py-3 px-4">
                        {item.status.includes('Deferred') ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            Deferred per Plan
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            ✓ Verified in UI
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PRICING TEST SIMULATOR */}
      {activeTab === 'pricing' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Price Hypothesis vs Market Reality
              </h2>
              <p className="text-xs text-slate-500">
                Plan 0a82bd6e recommends testing $59 regular license. Never open at $89 due to KiviCare Pharma’s 10 sales record.
              </p>
            </div>

            {/* Price Selector */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700 uppercase">Test Price Point:</span>
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
                {[59, 69, 89].map(p => (
                  <button
                    key={p}
                    onClick={() => setTestedLicensePrice(p as any)}
                    className={`px-4 py-1.5 text-xs font-bold font-mono rounded-md transition-all ${
                      testedLicensePrice === p
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    ${p}
                  </button>
                ))}
              </div>
            </div>

            {/* Analysis Box */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">
                  Analysis for ${testedLicensePrice} Price Point:
                </span>
                <span className="font-mono text-purple-700 font-semibold">
                  {testedLicensePrice === 59 ? '★ Recommended Initial Opening' : testedLicensePrice === 69 ? 'Phase 2 Validation Target' : 'High Friction / Unproven'}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {testedLicensePrice === 59 &&
                  'Sits competitively between InfyCare ($49) and Medicine Care ($60). Enables testing conversion on the core value proposition: one prescription-to-dispense trail with FEFO and partial dispensing.'}
                {testedLicensePrice === 69 &&
                  'Justified only after demo proofs and user validation demonstrate goods-receipt inventory, partial dispensing, and integer strip unit conversion working flawlessly.'}
                {testedLicensePrice === 89 &&
                  'KiviCare Pharma’s 10 sales at $89 argue heavily against opening here. Node/React listings at $98 with 18 sales show that buyers do not pay a stack premium.'}
              </p>
            </div>

            {/* Bangladesh SaaS Comparison */}
            <div className="p-4 bg-cyan-50/50 rounded-xl border border-cyan-200 space-y-2 text-xs">
              <div className="font-bold text-cyan-900">
                Direct Bangladesh Clinic Monetization Alternative:
              </div>
              <p className="text-cyan-800 leading-relaxed">
                Independent clinics in Dhaka and Chittagong spend ৳15,000–৳35,000 setup plus ৳1,500–৳3,000/month for hosted Chamber software. A private build for a named clinic offers immediate revenue without marketplace dependencies.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: FIELD INTERVIEW GUIDE */}
      {activeTab === 'interview' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Field Discovery Interview Guide (8-10 Conversations)
              </h2>
              <p className="text-xs text-slate-500">
                To be run with clinic owners, doctors, dispensers, and CodeCanyon script buyers before approving a full build.
              </p>
            </div>

            {/* Filter by target role */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-xs">
              {['all', 'owner', 'doctor', 'dispenser', 'dev'].map(r => (
                <button
                  key={r}
                  onClick={() => setActiveInterviewFilter(r as any)}
                  className={`px-2.5 py-1 rounded capitalize font-medium ${
                    activeInterviewFilter === r
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredInterviews.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-700 font-mono text-[11px] uppercase">
                    Target: {item.targetName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Question #{item.id}</span>
                </div>

                <div className="font-semibold text-slate-900 text-sm">
                  "{item.question}"
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-600">
                  <span className="font-bold text-slate-700 block mb-0.5">Purpose & Research Grounding:</span>
                  {item.purpose}
                </div>

                <div className="p-2.5 bg-purple-50/40 rounded-lg border border-purple-100 text-[11px] text-purple-900">
                  <span className="font-bold text-purple-800 block mb-0.5">Observed Clinic Reality in Plan 0a82bd6e:</span>
                  {item.keyFinding}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
