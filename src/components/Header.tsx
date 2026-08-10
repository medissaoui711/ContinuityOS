import React from 'react';
import {
  ShieldAlert,
  Building2,
  UserCheck,
  Zap,
  Search,
  CheckCircle2,
  AlertTriangle,
  Lock,
} from 'lucide-react';

interface HeaderProps {
  continuityScore: number;
  activeRole: string;
  onSelectRole: (roleTitle: string) => void;
  availableRoles: { id: string; jobTitle: string; primaryHolderName: string }[];
  onTriggerEmergencyModal: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  continuityScore,
  activeRole,
  onSelectRole,
  availableRoles,
  onTriggerEmergencyModal,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 text-slate-900 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand & System Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-xs">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">ContinuityOS</h1>
              <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[11px] px-2.5 py-0.5 rounded-full font-semibold">
                ISO 22301 / NIST
              </span>
            </div>
            <p className="text-xs text-slate-500">نظام تشغيل استمرارية الأعمال المؤسسية</p>
          </div>
        </div>

        {/* Center Search & Score Meter */}
        <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث عن إجراء SOP، موظف بديل، صلاحيات، أو سر..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pr-9 pl-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Right Section: Score, Role Switcher, Drill Button */}
        <div className="flex items-center gap-3">
          {/* Continuity Health Badge */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <div className="text-right">
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">مؤشر الجاهزية</div>
              <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <span>{continuityScore}%</span>
                {continuityScore >= 85 ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                )}
              </div>
            </div>
            <div className="w-8 h-8 rounded-full border border-emerald-200 flex items-center justify-center bg-emerald-50">
              <Zap className="w-4 h-4 text-emerald-600" />
            </div>
          </div>

          {/* Context Role Switcher */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <div className="text-right">
              <div className="text-[10px] text-slate-500 font-medium">المستخدم الحالي:</div>
              <select
                value={activeRole}
                onChange={(e) => onSelectRole(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                {availableRoles.map((r) => (
                  <option key={r.id} value={r.jobTitle} className="bg-white text-slate-900">
                    {r.jobTitle} ({r.primaryHolderName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Trigger Emergency / Surprise Drill */}
          <button
            onClick={onTriggerEmergencyModal}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>محاكاة طوارئ</span>
          </button>
        </div>
      </div>
    </header>
  );
};
