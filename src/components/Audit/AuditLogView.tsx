import React, { useState } from 'react';
import { AuditLogEntry } from '../../types';
import {
  History,
  ShieldCheck,
  Search,
  Download,
  CheckCircle2,
  Lock,
  UserCheck,
  Zap,
} from 'lucide-react';

interface AuditLogViewProps {
  logs: AuditLogEntry[];
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredLogs = logs.filter((log) => {
    const matchesCat = selectedCategory === 'ALL' || log.actionCategory === selectedCategory;
    const matchesSearch =
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.role.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleExportLogs = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ContinuityOS_Audit_Log_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <History className="w-6 h-6 text-emerald-600" />
            <span>سجل التدقيق والرقابة المؤسسية (Audit Trail)</span>
          </h2>
          <p className="text-xs text-slate-500">
            سجل زمني لتتبع جميع الموافقات، نقل الصلاحيات للبدلاء، التعديلات الهيكلية، ودخول الخزينة.
          </p>
        </div>

        <button
          onClick={handleExportLogs}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-300 shadow-xs cursor-pointer transition-all"
        >
          <Download className="w-4 h-4 text-emerald-600" />
          <span>تصدير تقرير التدقيق (JSON)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {['ALL', 'ROLE_MODIFIED', 'SECRET_ACCESSED', 'DELEGATION_ACTIVATED', 'WORKFLOW_APPROVED'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {cat === 'ALL'
                ? 'جميع الأحداث'
                : cat === 'ROLE_MODIFIED'
                ? 'تعديل الصلاحيات'
                : cat === 'SECRET_ACCESSED'
                ? 'دخول الخزينة'
                : cat === 'DELEGATION_ACTIVATED'
                ? 'تفعيل البدلاء'
                : 'الموافقات'}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث في السجلات..."
            className="w-full bg-white border border-slate-200 rounded-xl pr-9 pl-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Table View */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">الوقت والتاريخ</th>
                <th className="p-3.5">المنفّذ (Actor)</th>
                <th className="p-3.5">الدور الوظيفي</th>
                <th className="p-3.5">تصنيف الحدث</th>
                <th className="p-3.5">تفاصيل الإجراء</th>
                <th className="p-3.5">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-mono text-slate-500 text-[11px]">
                    {new Date(log.timestamp).toLocaleString('ar-QA')}
                  </td>
                  <td className="p-3.5 font-bold text-slate-900">{log.actor}</td>
                  <td className="p-3.5 text-slate-600">{log.role}</td>
                  <td className="p-3.5">
                    <span className="bg-slate-100 text-slate-700 text-[10px] px-2.5 py-1 rounded-md border border-slate-200 font-medium">
                      {log.actionCategory}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-800">{log.description}</td>
                  <td className="p-3.5 font-mono text-slate-400 text-[11px]">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
