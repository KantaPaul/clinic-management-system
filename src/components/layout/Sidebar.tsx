import React from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarDays,
  FileSpreadsheet,
  Receipt,
  BarChart3,
  ShieldAlert,
  Settings,
  Clock,
  Sparkles,
  Pill,
  Compass,
} from 'lucide-react';
import { UserRole } from '../../types';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  allowedRoles: UserRole[];
  badgeCount?: number;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, t, appointments, language } = useClinic();

  const todayStr = new Date().toISOString().split('T')[0];
  const waitingCount = appointments.filter(
    a => a.date === todayStr && a.status === 'waiting'
  ).length;

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: t.nav.dashboard,
      icon: LayoutDashboard,
      allowedRoles: ['admin', 'doctor', 'receptionist', 'accountant', 'dispenser'],
    },
    {
      id: 'queue',
      label: t.nav.queue,
      icon: CalendarDays,
      allowedRoles: ['admin', 'doctor', 'receptionist', 'accountant'],
      badgeCount: waitingCount > 0 ? waitingCount : undefined,
    },
    {
      id: 'consultation',
      label: t.nav.consultation,
      icon: Stethoscope,
      allowedRoles: ['admin', 'doctor'],
    },
    {
      id: 'dispensary',
      label: t.nav.dispensary,
      icon: Pill,
      allowedRoles: ['admin', 'dispenser', 'doctor', 'accountant'],
    },
    {
      id: 'patients',
      label: t.nav.patients,
      icon: Users,
      allowedRoles: ['admin', 'doctor', 'receptionist'],
    },
    {
      id: 'doctors',
      label: t.nav.doctors,
      icon: FileSpreadsheet,
      allowedRoles: ['admin', 'receptionist'],
    },
    {
      id: 'billing',
      label: t.nav.billing,
      icon: Receipt,
      allowedRoles: ['admin', 'accountant', 'receptionist', 'dispenser'],
    },
    {
      id: 'reports',
      label: t.nav.reports,
      icon: BarChart3,
      allowedRoles: ['admin', 'accountant'],
    },
    {
      id: 'audit',
      label: t.nav.auditLogs,
      icon: ShieldAlert,
      allowedRoles: ['admin', 'dispenser'],
    },
    {
      id: 'researchPlan',
      label: t.nav.researchPlan,
      icon: Compass,
      allowedRoles: ['admin', 'doctor', 'receptionist', 'accountant', 'dispenser'],
    },
    {
      id: 'settings',
      label: t.nav.settings,
      icon: Settings,
      allowedRoles: ['admin'],
    },
  ];

  const visibleItems = navItems.filter(item =>
    item.allowedRoles.includes(currentUser.role)
  );

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] border-r border-slate-800">
      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          {language === 'bn' ? 'প্রধান মেন্যু' : 'Main Modules'}
        </div>
        {visibleItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
                isActive
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badgeCount !== undefined && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white text-cyan-800'
                      : 'bg-amber-500 text-slate-950 animate-pulse'
                  }`}
                  title={`${item.badgeCount} patients waiting`}
                >
                  {item.badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Synthetic Demo Mode Notice */}
      <div className="p-4 m-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
        <div className="flex items-center space-x-2 text-cyan-400 font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'আউটপেশেন্ট ডেমো মোড' : 'Outpatient System'}</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
          {language === 'bn'
            ? 'বিএমডিসি নিয়মাবলী, বাংলা প্রেসক্রিপশন ও বিকাশ/নগদ পেমেন্ট সমন্বিত।'
            : 'Configured for multi-doctor clinics with bilingual Rx & mobile wallet logs.'}
        </p>
        <div className="text-[10px] text-slate-500 flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping"></span>
          <span>{language === 'bn' ? 'সিস্টেম প্রস্তুত' : 'System Ready & Live'}</span>
        </div>
      </div>
    </aside>
  );
};
