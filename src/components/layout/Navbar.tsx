import React, { useState, useEffect } from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  Activity,
  Globe,
  UserCheck,
  RotateCcw,
  Clock,
  ShieldCheck,
  ChevronDown,
  Bell,
  AlertTriangle,
  Pill,
} from 'lucide-react';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const {
    settings,
    currentUser,
    setCurrentUser,
    users,
    language,
    setLanguage,
    t,
    resetToMockData,
    batches,
    medicines,
    setActiveTab,
  } = useClinic();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString(language === 'bn' ? 'bn-BD' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [language]);

  const todayStr = new Date().toISOString().split('T')[0];

  const lowStockItems = (medicines || []).filter(med => {
    const valid = (batches || []).filter(
      b => b.medicineId === med.id &&
           b.status !== 'expired' &&
           b.status !== 'quarantined' &&
           b.status !== 'blocked' &&
           b.expiryDate >= todayStr
    );
    const total = valid.reduce((sum, b) => sum + b.currentQuantity, 0);
    return total < (med.reorderLevelBaseUnits || 50);
  });

  const nearExpiryBatches = (batches || []).filter(
    b => b.status === 'near_expiry' || (b.expiryDate >= todayStr && (new Date(b.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24) <= 30)
  );

  const totalAlertCount = lowStockItems.length + nearExpiryBatches.length;

  const roleColors: Record<UserRole, string> = {
    admin: 'bg-rose-50 text-rose-700 border-rose-200',
    doctor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    receptionist: 'bg-sky-50 text-sky-700 border-sky-200',
    accountant: 'bg-amber-50 text-amber-700 border-amber-200',
    dispenser: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Clinic Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">
                  {language === 'bn' ? settings.nameBn : settings.name}
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-800">
                  OMS
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                {language === 'bn' ? settings.taglineBn : settings.tagline}
              </p>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Live Clock */}
            <div className="hidden lg:flex items-center text-xs font-mono text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-cyan-600" />
              <span>{currentTime}</span>
              <span className="ml-2 text-slate-400">({settings.timeZone.split('/')[1] || 'Dhaka'})</span>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  language === 'en'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to English"
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('bn')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  language === 'bn'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="বাংলায় পরিবর্তন করুন"
              >
                বাংলা
              </button>
            </div>

            {/* Dispensary Low-Stock Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationMenu(!showNotificationMenu)}
                className="relative p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                title="Dispensary Inventory Notifications"
              >
                <Bell className="w-4 h-4" />
                {totalAlertCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-amber-500 text-white font-mono font-bold text-[10px] flex items-center justify-center shadow-xs">
                    {totalAlertCount}
                  </span>
                )}
              </button>

              {showNotificationMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 text-xs">
                  <div className="px-3 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      <span>{language === 'bn' ? 'ডিসপেনসারি ইনভেন্টরি সতর্কতা' : 'Dispensary Stock Alerts'}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      {totalAlertCount} Warnings
                    </span>
                  </div>

                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 px-1 py-1">
                    {lowStockItems.length === 0 && nearExpiryBatches.length === 0 ? (
                      <div className="py-6 text-center text-slate-400 text-xs">
                        All dispensary items are above safety thresholds.
                      </div>
                    ) : (
                      <>
                        {lowStockItems.map(med => {
                          const valid = (batches || []).filter(
                            b => b.medicineId === med.id &&
                                 b.status !== 'expired' &&
                                 b.status !== 'quarantined' &&
                                 b.status !== 'blocked' &&
                                 b.expiryDate >= todayStr
                          );
                          const total = valid.reduce((sum, b) => sum + b.currentQuantity, 0);
                          const target = med.reorderLevelBaseUnits || 50;

                          return (
                            <div key={med.id} className="p-2.5 hover:bg-slate-50 rounded-lg transition-colors">
                              <div className="flex items-center justify-between font-semibold text-slate-800">
                                <span>{med.brandName} {med.strength}</span>
                                <span className="font-mono text-amber-700 font-bold">
                                  {total} / {target} u
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 mt-0.5 flex items-center justify-between">
                                <span>Safety buffer breached</span>
                                <span className="text-rose-600 font-medium font-mono">Deficit: +{Math.max(0, target - total)} u</span>
                              </div>
                            </div>
                          );
                        })}

                        {nearExpiryBatches.map(b => (
                          <div key={b.id} className="p-2.5 hover:bg-slate-50 rounded-lg transition-colors">
                            <div className="flex items-center justify-between font-semibold text-slate-800">
                              <span>{b.brandName} ({b.lotNumber})</span>
                              <span className="text-[10px] font-semibold text-rose-600">Near Expiry</span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Expires on {b.expiryDate} · {b.currentQuantity} units
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>

                  <div className="px-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setShowNotificationMenu(false);
                        setActiveTab('dispensary');
                      }}
                      className="text-xs font-semibold text-purple-700 hover:text-purple-800 hover:underline"
                    >
                      Open Dispensary Workspace →
                    </button>
                    <button
                      onClick={() => setShowNotificationMenu(false)}
                      className="text-xs text-slate-400 hover:text-slate-600"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center font-bold text-xs text-slate-700">
                  {currentUser.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    currentUser.name.charAt(0)
                  )}
                </div>
                <div className="hidden md:block">
                  <div className="text-xs font-medium text-slate-900 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="flex items-center space-x-1">
                    <span
                      className={`inline-block text-[10px] uppercase font-bold px-1.5 py-0.2 rounded border ${
                        roleColors[currentUser.role]
                      }`}
                    >
                      {t.roles[currentUser.role]}
                    </span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {language === 'bn' ? 'ব্যবহারকারী ও রোল নির্বাচন' : 'Switch Active User Role'}
                  </div>
                  <div className="divide-y divide-slate-100">
                    {users.map(u => (
                      <button
                        key={u.id}
                        onClick={() => {
                          setCurrentUser(u);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center space-x-3 hover:bg-slate-50 transition-colors ${
                          currentUser.id === u.id ? 'bg-cyan-50/60' : ''
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 shrink-0">
                          {u.avatarUrl ? (
                            <img src={u.avatarUrl} alt={u.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-xs text-slate-600">
                              {u.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-slate-800 truncate">{u.name}</div>
                          <span
                            className={`inline-block text-[10px] font-bold px-1.5 rounded border ${
                              roleColors[u.role]
                            }`}
                          >
                            {t.roles[u.role]}
                          </span>
                        </div>
                        {currentUser.id === u.id && (
                          <UserCheck className="w-4 h-4 text-cyan-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="px-3 pt-2 mt-1 border-t border-slate-100 text-[11px] text-slate-500">
                    {language === 'bn'
                      ? 'যেকোনো রোলে সুইচ করে সংশ্লিষ্ট ফিচার পরীক্ষা করুন'
                      : 'Switch role to test module permissions & workflows'}
                  </div>
                </div>
              )}
            </div>

            {/* Demo Reset Button */}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs flex items-center space-x-1"
              title="Reset synthetic demo data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {language === 'bn' ? 'রিসেট' : 'Reset Data'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 text-center mb-2">
              {language === 'bn' ? 'ডেমো ডেটা রিসেট করবেন?' : 'Reset to Synthetic Baseline?'}
            </h3>
            <p className="text-xs text-slate-600 text-center mb-5 leading-relaxed">
              {language === 'bn'
                ? 'এটি সমস্ত পরিবর্তন মুছে ফেলে প্রাথমিক ডেমো রোগী, সিরিয়াল এবং প্রেসক্রিপশন ডেটা পুনরায় লোড করবে।'
                : 'This will restore all default mock doctors, patients, appointments, medication formulary, and receipts.'}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={() => {
                  resetToMockData();
                  setShowResetConfirm(false);
                }}
                className="flex-1 px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-semibold hover:bg-cyan-700 shadow-md shadow-cyan-600/20"
              >
                {t.common.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
