import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  Settings,
  Building,
  Save,
  RotateCcw,
  Globe,
  Coins,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { t, settings, updateSettings, language, setLanguage, resetToMockData } = useClinic();

  const [name, setName] = useState(settings.name);
  const [nameBn, setNameBn] = useState(settings.nameBn);
  const [tagline, setTagline] = useState(settings.tagline);
  const [address, setAddress] = useState(settings.address);
  const [addressBn, setAddressBn] = useState(settings.addressBn);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [currency, setCurrency] = useState<'BDT' | 'USD'>(settings.currency);
  const [timeZone, setTimeZone] = useState(settings.timeZone);
  const [defaultNewFee, setDefaultNewFee] = useState(settings.defaultNewVisitFee);
  const [defaultReturnFee, setDefaultReturnFee] = useState(settings.defaultReturnVisitFee);
  const [defaultReportFee, setDefaultReportFee] = useState(settings.defaultReportFollowUpFee);
  const [bmdcDisclaimer, setBmdcDisclaimer] = useState(settings.bmdcRegInfo);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      name,
      nameBn,
      tagline,
      address,
      addressBn,
      phone,
      email,
      currency,
      currencySymbol: currency === 'BDT' ? '৳' : '$',
      timeZone,
      defaultNewVisitFee: defaultNewFee,
      defaultReturnVisitFee: defaultReturnFee,
      defaultReportFollowUpFee: defaultReportFee,
      bmdcRegInfo: bmdcDisclaimer,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{t.settings.title}</h1>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'bn'
              ? 'ক্লিনিকের পরিচয়, দ্বিভাষিক সেটিংস, মুদ্রা, এবং ডিফল্ট কনসালটেশন ফি'
              : 'Clinic identity, bilingual profile, currency formatting, and standard consultation charges'}
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Clinic Identity Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-cyan-700 font-bold text-xs uppercase tracking-wider border-b pb-3">
            <Building className="w-4 h-4" />
            <span>{t.settings.clinicInfo}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Clinic Name (English)
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full text-xs font-medium border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                ক্লিনিকের নাম (বাংলা)
              </label>
              <input
                type="text"
                required
                value={nameBn}
                onChange={e => setNameBn(e.target.value)}
                className="w-full text-xs font-medium border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Tagline / Subtitle
            </label>
            <input
              type="text"
              value={tagline}
              onChange={e => setTagline(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Address (English)
              </label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                ঠিকানা (বাংলা)
              </label>
              <input
                type="text"
                value={addressBn}
                onChange={e => setAddressBn(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Contact Phone Numbers
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Official Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              BMDC Legal Notice
            </label>
            <input
              type="text"
              value={bmdcDisclaimer}
              onChange={e => setBmdcDisclaimer(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Currency & Localization Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-cyan-700 font-bold text-xs uppercase tracking-wider border-b pb-3">
            <Coins className="w-4 h-4" />
            <span>Currency & Regional Localization</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Operating Currency
              </label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value as any)}
                className="w-full text-xs font-bold border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none bg-white"
              >
                <option value="BDT">BDT (৳ - Bangladeshi Taka)</option>
                <option value="USD">USD ($ - US Dollar)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Time Zone
              </label>
              <select
                value={timeZone}
                onChange={e => setTimeZone(e.target.value)}
                className="w-full text-xs font-medium border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none bg-white"
              >
                <option value="Asia/Dhaka (GMT+6)">Asia/Dhaka (GMT+6)</option>
                <option value="Asia/Kolkata (GMT+5:30)">Asia/Kolkata (GMT+5:30)</option>
                <option value="UTC (GMT+0)">UTC (GMT+0)</option>
                <option value="America/New_York (EST)">America/New_York (EST)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Default UI Language
              </label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value as any)}
                className="w-full text-xs font-medium border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none bg-white"
              >
                <option value="en">English</option>
                <option value="bn">বাংলা (Bengali)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Default Consultation Fees */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-cyan-700 font-bold text-xs uppercase tracking-wider border-b pb-3">
            <span>Standard Fee Structure</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Default New Patient Fee ({currency === 'BDT' ? '৳' : '$'})
              </label>
              <input
                type="number"
                value={defaultNewFee}
                onChange={e => setDefaultNewFee(Number(e.target.value))}
                className="w-full text-xs font-bold border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Default Returning Fee ({currency === 'BDT' ? '৳' : '$'})
              </label>
              <input
                type="number"
                value={defaultReturnFee}
                onChange={e => setDefaultReturnFee(Number(e.target.value))}
                className="w-full text-xs font-bold border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Default Report Follow-up ({currency === 'BDT' ? '৳' : '$'})
              </label>
              <input
                type="number"
                value={defaultReportFee}
                onChange={e => setDefaultReportFee(Number(e.target.value))}
                className="w-full text-xs font-bold border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={resetToMockData}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.settings.resetDemoData}</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-600/30 flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{t.settings.saveChanges}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
