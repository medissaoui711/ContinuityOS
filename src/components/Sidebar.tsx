import React, { useState } from 'react';
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
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
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
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingApprovalsCount,
  spofCount,
  isCollapsed: externalIsCollapsed,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const [internalIsCollapsed, setInternalIsCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('bcm_sidebar_collapsed') === 'true';
  });

  const isCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalIsCollapsed;
  const effectiveCollapsed = isMobileOpen ? false : isCollapsed;

  const toggleCollapse = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalIsCollapsed((prev) => {
        const next = !prev;
        localStorage.setItem('bcm_sidebar_collapsed', String(next));
        return next;
      });
    }
  };

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
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}
      <aside
        className={`bg-[#0f172a] border-l border-slate-800 p-3 md:p-4 flex flex-col justify-between shrink-0 text-slate-300 transition-all duration-300 ease-in-out z-50 ${
          isMobileOpen
            ? 'fixed inset-y-0 right-0 w-72 shadow-2xl md:relative md:inset-auto md:shadow-none'
            : 'hidden md:flex'
        } ${isCollapsed && !isMobileOpen ? 'md:w-20' : 'md:w-64'}`}
      >
      <div className="space-y-3">
        {/* Header & Collapse Toggle */}
        <div className={`flex items-center ${effectiveCollapsed ? 'justify-center' : 'justify-between'} px-1 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800/80 pb-3`}>
          {!effectiveCollapsed && (
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
              <span className="font-bold text-slate-200 truncate">محاور النظام</span>
            </div>
          )}
          
          {!isMobileOpen && (
            <button
              onClick={toggleCollapse}
              title={isCollapsed ? 'توسعة الشريط الجانبي' : 'طي الشريط الجانبي'}
              className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer flex items-center justify-center"
            >
              {isCollapsed ? (
                <ChevronLeft className="w-4 h-4 text-blue-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-300" />
              )}
            </button>
          )}
        </div>

        {/* Nav Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onCloseMobile?.();
                }}
                title={effectiveCollapsed ? `${item.label}${item.badge ? ` (${item.badge})` : ''}` : undefined}
                className={`relative group w-full flex items-center ${
                  effectiveCollapsed ? 'justify-center px-0 py-3' : 'justify-between px-3.5 py-2.5'
                } rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className={`flex items-center ${effectiveCollapsed ? 'justify-center' : 'gap-3'}`}>
                  <span className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                    {item.icon}
                  </span>
                  {!effectiveCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!effectiveCollapsed && item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      item.badgeColor || 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Collapsed Badge Dot */}
                {effectiveCollapsed && item.badge !== undefined && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-[#0f172a] animate-pulse" />
                )}

                {/* Hover Tooltip when Collapsed */}
                {effectiveCollapsed && (
                  <div className="absolute right-full mr-3 hidden group-hover:flex items-center z-50 pointer-events-none">
                    <div className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl border border-slate-700 whitespace-nowrap flex items-center gap-2">
                      <span>{item.label}</span>
                      {item.badge !== undefined && (
                        <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Standards Footnote */}
      <div className="mt-8 pt-4 border-t border-slate-800 px-1 text-[11px] text-slate-400">
        {effectiveCollapsed ? (
          <div className="flex justify-center group relative cursor-pointer">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div className="absolute right-full mr-3 hidden group-hover:flex items-center z-50 pointer-events-none">
              <div className="bg-slate-900 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl border border-slate-700 whitespace-nowrap">
                مطابق لإطار ISO 22301
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-medium text-slate-300">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>مطابق لإطار ISO 22301</span>
            </div>
            <p className="leading-relaxed text-slate-400 text-[10px]">
              نظام تشغيل استمرارية متكامل يضمن العمل بدون توقف.
            </p>
          </div>
        )}
      </div>
    </aside>
    </>
  );
};
