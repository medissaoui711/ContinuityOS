import React from 'react';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GitPullRequest,
  Lock,
  Crown,
  Activity,
  History,
  ShieldCheck,
  Building2,
  UserCheck,
} from 'lucide-react';

export type TabType =
  | 'dashboard'
  | 'offices'
  | 'attendance'
  | 'roles'
  | 'sops'
  | 'workflows'
  | 'vault'
  | 'succession'
  | 'recovery'
  | 'audit';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  pendingApprovalsCount: number;
  spofCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingApprovalsCount,
  spofCount,
}) => {
  const navItems: {
    id: TabType;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    badgeColor?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'ملخص الاستمرارية',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'offices',
      label: 'المكاتب الإدارية والفروع',
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      id: 'attendance',
      label: 'إدارة الموظفين والحضور',
      icon: <UserCheck className="w-5 h-5" />,
    },
    {
      id: 'roles',
      label: 'الصلاحيات والبدلاء',
      icon: <Users className="w-5 h-5" />,
      badge: spofCount > 0 ? spofCount : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
    },
    {
      id: 'sops',
      label: 'دليل الإجراءات (SOPs)',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: 'workflows',
      label: 'الموافقات والإجازات',
      icon: <GitPullRequest className="w-5 h-5" />,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    },
    {
      id: 'vault',
      label: 'الخزينة والأسرار',
      icon: <Lock className="w-5 h-5" />,
    },
    {
      id: 'succession',
      label: 'استمرارية المالك',
      icon: <Crown className="w-5 h-5" />,
    },
    {
      id: 'recovery',
      label: 'التعافي والمحاكاة',
      icon: <Activity className="w-5 h-5" />,
    },
    {
      id: 'audit',
      label: 'سجل التدقيق',
      icon: <History className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-[#0f172a] border-l border-slate-800 p-4 flex flex-col justify-between shrink-0 text-slate-300">
      <div className="space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>محاور النظام</span>
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.badgeColor || 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Standards Footnote */}
      <div className="mt-8 pt-4 border-t border-slate-800 px-2 text-[11px] text-slate-400 space-y-1">
        <div className="flex items-center gap-1.5 font-medium text-slate-300">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>مطابق لإطار ISO 22301</span>
        </div>
        <p className="leading-relaxed text-slate-400">
          نظام تشغيل استمرارية متكامل يضمن العمل بدون توقف.
        </p>
      </div>
    </aside>
  );
};
