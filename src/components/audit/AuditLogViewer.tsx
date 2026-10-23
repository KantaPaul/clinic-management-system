import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  ShieldAlert,
  Search,
  Filter,
  Clock,
  User,
  CheckCircle,
  FileText,
  CreditCard,
  Settings,
  Calendar,
} from 'lucide-react';
import { UserRole } from '../../types';

export const AuditLogViewer: React.FC = () => {
  const { t, auditLogs, language } = useClinic();
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = auditLogs.filter(log => {
    const matchesRole = roleFilter === 'all' || log.userRole === roleFilter;
    const matchesSearch =
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'create':
        return <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">Created</span>;
      case 'update':
        return <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold text-[10px] uppercase">Updated</span>;
      case 'payment_received':
        return <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-[10px] uppercase">Payment</span>;
      case 'check_in':
        return <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px] uppercase">Checked In</span>;
      case 'complete':
        return <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold text-[10px] uppercase">Completed</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px] uppercase">{action}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-600 font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>{language === 'bn' ? 'নিরাপত্তা ও জবাবদিহিতা' : 'Security & Accountability'}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{t.audit.title}</h1>
          <p className="text-xs text-slate-500 mt-1">{t.audit.subtitle}</p>
        </div>
        <div className="text-xs text-slate-500 font-medium bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl self-start md:self-auto">
          {filteredLogs.length} events logged in audit stream
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search audit trail by keyword, staff, ID..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value as any)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          >
            <option value="all">{t.audit.allRoles}</option>
            <option value="admin">{t.roles.admin}</option>
            <option value="doctor">{t.roles.doctor}</option>
            <option value="receptionist">{t.roles.receptionist}</option>
            <option value="accountant">{t.roles.accountant}</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">{t.audit.timestamp}</th>
                <th className="py-3 px-4">{t.audit.user}</th>
                <th className="py-3 px-4">{t.audit.entity}</th>
                <th className="py-3 px-4">{t.audit.action}</th>
                <th className="py-3 px-4">{t.audit.details}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">{log.userName}</div>
                    <span className="text-[10px] uppercase font-bold text-cyan-800 bg-cyan-50 px-1.5 py-0.2 rounded border border-cyan-100">
                      {log.userRole}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="capitalize font-semibold text-slate-700">
                      {log.entity}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {getActionBadge(log.action)}
                  </td>
                  <td className="py-3 px-4 text-slate-800 font-medium">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
