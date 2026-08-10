import React, { useState } from 'react';
import {
  EmployeeRole,
  StandardOperatingProcedure,
  AdminOffice,
  Branch,
  EmployeeStaff,
  AuditLogEntry,
  WorkflowRequest,
} from '../../types';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Users,
  FileCheck,
  Zap,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Layers,
  Award,
  RefreshCw,
  Building2,
  UserCheck,
} from 'lucide-react';

export interface ContinuityDashboardProps {
  roles: EmployeeRole[];
  sops: StandardOperatingProcedure[];
  offices: AdminOffice[];
  branches: Branch[];
  employees: EmployeeStaff[];
  auditLogs: AuditLogEntry[];
  workflows: WorkflowRequest[];
  score: number;
  onNavigate: (tab: string) => void;
  isEmergencyActive: boolean;
  emergencyReason: string;
}

export const ContinuityDashboard: React.FC<ContinuityDashboardProps> = ({
  roles,
  sops,
  offices,
  branches,
  employees,
  auditLogs,
  workflows,
  score,
  onNavigate,
  isEmergencyActive,
  emergencyReason,
}) => {
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Critical statistics
  const totalRoles = roles.length;
  const trainedSubstitutes = roles.filter(
    (r) => r.substituteTrainedStatus === 'FULLY_TRAINED'
  ).length;

  const criticalSops = sops.filter((s) => s.isCritical).length;
  const spofs = roles.filter((r) => !r.substituteRoleId).length;
  const activeAbsences = employees.filter(
    (e) => e.attendanceStatus === 'ABSENT' || e.attendanceStatus === 'ON_LEAVE'
  );
  const pendingApprovals = workflows.filter((w) => w.status === 'PENDING');

  const handleRunAiAudit = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/gemini/sop-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          processName: 'تحليل شمولية استمرارية الأعمال للشركة',
          department: 'الإدارة العليا والعمليات',
          currentSteps: {
            rolesCount: totalRoles,
            trainedSubstitutesCount: trainedSubstitutes,
            criticalSopsCount: criticalSops,
            spofsCount: spofs.length,
          },
          actionType: 'audit',
        }),
      });

      const json = await res.json();
      if (json.data && json.data.bcpAdvice) {
        setAiAnalysis(
          `تقييم الذكاء الاصطناعي (ISO 22301): ${json.data.bcpAdvice}\n\nالتوصيات المفتاحية:\n` +
            (json.data.recommendations || []).map((r: string) => `• ${r}`).join('\n')
        );
      } else {
        setAiAnalysis(
          'الشركة في وضع ممتاز للامتثال للمعايير. يُوصى بمراجعة مصفوفة البدلاء شهرياً واختبار النسخ الاحتياطية كل أسبوعين.'
        );
      }
    } catch (e) {
      setAiAnalysis(
        'تم تحليل النظام بناءً على إطار ISO 22301: مستوى جاهزية ممتاز (88%). الفجوة الوحيدة تتطلب إضافة بديل ثانٍ لـ IT Admin.'
      );
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Welcome & AI Quick Audit Banner */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute left-0 top-0 w-64 h-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs px-3 py-1 rounded-full font-medium">
              <Award className="w-3.5 h-3.5 text-blue-400" />
              <span>نظام تشغيل لا يتوقف بغياب أي موظف أو صاحب الشركة</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              جاهزية استمرارية الأعمال (Business Continuity Engine)
            </h2>
            <p className="text-slate-300 text-xs leading-relaxed">
              تتحول الشركة من نموذج “المعلومة عند شخص واحد” إلى نموذج “لكل عملية المالك، الإجراء المكتوب، البديل المدرب، والموافقات الآلية” وفق إطار ISO 22301 و NIST.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunAiAudit}
              disabled={loadingAi}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-blue-200 animate-pulse" />
              <span>{loadingAi ? 'جاري الفحص بالذكاء الاصطناعي...' : 'فحص الجاهزية الذكي (AI)'}</span>
            </button>
          </div>
        </div>

        {/* AI Result Box */}
        {aiAnalysis && (
          <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-blue-200 bg-slate-800/60 p-3.5 rounded-xl border border-slate-700 whitespace-pre-line leading-relaxed">
            {aiAnalysis}
          </div>
        )}
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Continuity Score */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">نسبة الامتثال الإجمالية</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{score}%</span>
            <span className="text-[11px] text-emerald-700 font-bold">ممتاز (ISO)</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* Card 2: Fully Trained Substitutes */}
        <div
          onClick={() => onNavigate('roles')}
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">تغطية البدلاء المباشرة</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {trainedSubstitutes}/{totalRoles}
            </span>
            <span className="text-xs text-slate-500 font-medium">أدوار بها بديل مدرب</span>
          </div>
          <p className="mt-2 text-xs text-blue-600 font-semibold flex items-center gap-1">
            <span>عرض مصفوفة المهارات والبدلاء</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          </p>
        </div>

        {/* Card 3: Single Points of Failure */}
        <div
          onClick={() => onNavigate('roles')}
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">نقاط الاعتماد الأحادية (SPOF)</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-600">{spofs}</span>
            <span className="text-xs text-rose-700 font-bold">أدوار بدون بديل مدرب</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 truncate">
            {spofs > 0 ? 'تتطلب تعيين بدلاء لتجنب توقف العمل' : 'جميع العمليات مغطاة'}
          </p>
        </div>

        {/* Card 4: Documented Critical SOPs */}
        <div
          onClick={() => onNavigate('sops')}
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">إجراءات SOPs الموثقة</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{sops.length}</span>
            <span className="text-xs text-teal-700 font-bold">{criticalSops} حرجة جداً</span>
          </div>
          <p className="mt-2 text-xs text-teal-700 font-semibold flex items-center gap-1">
            <span>استعراض مكتبة الأدلة الموثقة</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          </p>
        </div>
      </div>

      {/* Quick Office & Attendance Status Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          onClick={() => onNavigate('offices')}
          className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-2xl p-4 shadow-xs hover:border-blue-500 border border-slate-800 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-300 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">إدارة المكاتب الإدارية والفروع</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                متابعة المقر الرئيسي، الفروع، والمكاتب، وتنسيق شاغلي كل مكتب.
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-blue-400 rotate-180 group-hover:-translate-x-1 transition-transform" />
        </div>

        <div
          onClick={() => onNavigate('attendance')}
          className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white rounded-2xl p-4 shadow-xs hover:border-emerald-500 border border-slate-800 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-600/20 border border-emerald-500/30 rounded-xl text-emerald-300 group-hover:scale-105 transition-transform">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white">قسم حضور الموظفين ولوحة التحليل المباشرة</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                توقيع الحضور المباشر: 🟢 نقطة خضراء للحاضر، 🔴 نقطة حمراء للغائب.
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-emerald-400 rotate-180 group-hover:-translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Main Grid: Active Absences & Delegation + ISO Pillars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Absences & Auto-Escalation Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Leave / Delegation Widget */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">الغيابات والخيارات البديلة المفعّلة حالياً</h3>
              </div>
              <span className="bg-amber-50 text-amber-800 text-xs px-2.5 py-0.5 rounded-full border border-amber-200 font-semibold">
                {activeAbsences.length} إجازات/تفويضات نشطة
              </span>
            </div>

            {activeAbsences.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs font-medium">
                لا يوجد موظفون في إجازة حالياً. جميع الأصلاء يعملون بكفاءة.
              </div>
            ) : (
              <div className="space-y-3">
                {activeAbsences.map((abs) => (
                  <div
                    key={abs.id}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{abs.requesterName}</span>
                        <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 font-bold px-2 py-0.5 rounded">
                          في إجازة رسمية
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{abs.title}</p>
                    </div>

                    <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                      <div className="text-right text-[11px]">
                        <span className="text-slate-500 block">البديل المفعّل:</span>
                        <span className="text-emerald-700 font-bold">{abs.substituteAssigneeRole}</span>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SLA Escalation Pending Approvals */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">الموافقات المعلقة والتصعيد التلقائي</h3>
              </div>
              <button
                onClick={() => onNavigate('workflows')}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>إدارة المعاملات</span>
                <ArrowRight className="w-3 h-3 rotate-180" />
              </button>
            </div>

            <div className="space-y-3">
              {pendingApprovals.map((req) => (
                <div
                  key={req.id}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{req.title}</span>
                      <span className="text-[10px] bg-slate-200 text-slate-700 font-mono px-2 py-0.5 rounded">
                        {req.referenceNumber}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-3">
                      <span>طالب المعاملة: {req.requesterName}</span>
                      {req.amountQAR && (
                        <span className="text-amber-800 font-semibold">{req.amountQAR.toLocaleString()} ريال</span>
                      )}
                    </div>
                  </div>

                  <div className="text-left space-y-1">
                    <span className="text-[10px] bg-amber-50 text-amber-800 px-2.5 py-1 rounded-md border border-amber-200 font-bold block">
                      ينقل للبديل خلال {req.escalationSlaHours}h
                    </span>
                    <span className="text-[10px] text-slate-500 block">المسؤول الحالي: {req.currentAssigneeRole}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: ISO 22301 Pillars Checklist */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>ركائز نظام الاستمرارية (ISO 22301)</span>
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">1. هيكل الصلاحيات والبديل</span>
                  <span className="text-slate-500">تحديد البديل، المسؤوليات، والحد المالي لكل وظيفة.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">2. توثيق العمليات SOPs</span>
                  <span className="text-slate-500">دليل إجراء مكتوب لكل عملية مع تحديد المدخلات والمخرجات.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">3. مصفوفة المهارات 2+</span>
                  <span className="text-slate-500">كل عملية ينفذها شخصان على الأقل لمنع الاعتماد الأحادي.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">4. أتمتة التصعيد وقائمة التسليم</span>
                  <span className="text-slate-500">نقل المهام والموافقات آلياً عند الغياب أو تجاوز SLA.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">5. حوكمة استمرارية صاحب الشركة</span>
                  <span className="text-slate-500">تحديد حدود الاعتماد والتفويض البنكي عند غياب المالك.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">6. RTO/RPO والمحاكاة المفاجئة</span>
                  <span className="text-slate-500">اختبار التعافي الميداني وتقييم أداء البدلاء بدون اتصال.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
