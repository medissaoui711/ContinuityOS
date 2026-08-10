import React, { useState } from 'react';
import { WorkflowRequest, HandoverChecklist } from '../../types';
import {
  GitPullRequest,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck,
  Plus,
  Send,
  UserCheck,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';

interface WorkflowEngineProps {
  workflows: WorkflowRequest[];
  onApproveWorkflow: (id: string, actorName: string) => void;
  onEscalateWorkflow: (id: string) => void;
  onAddWorkflowRequest: (req: WorkflowRequest) => void;
}

export const WorkflowEngine: React.FC<WorkflowEngineProps> = ({
  workflows,
  onApproveWorkflow,
  onEscalateWorkflow,
  onAddWorkflowRequest,
}) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'handover'>('requests');

  // Leave Handover state
  const [handovers, setHandovers] = useState<HandoverChecklist[]>([
    {
      id: 'ho-1',
      employeeName: 'محمد الشمري (مدير المالية)',
      substituteName: 'عمر القحطاني (محاسب أول)',
      startDate: '2026-08-15',
      endDate: '2026-08-22',
      reason: 'إجازة سنوية اعتيادية',
      currentTasks: [
        { title: 'إصدار رواتب شهر أغسطس عبر WPS', status: 'PENDING', dueDate: '2026-08-25' },
        { title: 'تسوية مطالبات شركة المشتريات الرئيسية', status: 'DONE', dueDate: '2026-08-12' },
      ],
      upcomingDeadlines: ['تقديم كشف الضريبة للربع الثالث', 'مراجعة توقيع البنك النهائي'],
      keyContacts: ['سالم المري (بنك QNB)', 'علي المنصوري (المدقق الخارجي)'],
      openIssues: ['موافقة صرف فاتورة السيرفرات بانتظار اعتماد المشتريات'],
      pendingApprovals: ['طلب شراء REQ-2026-089'],
      handoverSignedBySubstitute: true,
      status: 'ACTIVE',
    },
  ]);

  // Modals state
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [isHandoverModalOpen, setIsHandoverModalOpen] = useState(false);

  // New Request Form
  const [reqTitle, setReqTitle] = useState('');
  const [reqType, setReqType] = useState<'PURCHASE_ORDER' | 'EXPENSE_APPROVAL' | 'LEAVE_REQUEST' | 'CONTRACT_SIGN'>('PURCHASE_ORDER');
  const [reqAmount, setReqAmount] = useState(15000);
  const [reqRequester, setReqRequester] = useState('عمر القحطاني');
  const [reqDepartment, setReqDepartment] = useState('المالية');

  // New Handover Form
  const [hoEmpName, setHoEmpName] = useState('');
  const [hoSubName, setHoSubName] = useState('');
  const [hoStartDate, setHoStartDate] = useState('');
  const [hoEndDate, setHoEndDate] = useState('');
  const [hoTask1, setHoTask1] = useState('');
  const [hoContact1, setHoContact1] = useState('');

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqTitle) return;

    const newReq: WorkflowRequest = {
      id: `wf-${Date.now()}`,
      referenceNumber: `REQ-2026-${Math.floor(100 + Math.random() * 900)}`,
      type: reqType,
      title: reqTitle,
      requesterName: reqRequester,
      department: reqDepartment,
      amountQAR: Number(reqAmount),
      currentAssigneeRole: 'مسؤول المشتريات والمخزون',
      substituteAssigneeRole: 'مدير العمليات التنفيذي',
      isDelegatedToSubstitute: false,
      escalationSlaHours: 12,
      createdAt: new Date().toISOString(),
      status: 'PENDING',
      timeline: [
        {
          timestamp: new Date().toISOString(),
          actor: reqRequester,
          action: 'إنشاء المعاملة ورسائل التنبيه',
        },
      ],
    };

    onAddWorkflowRequest(newReq);
    setIsNewRequestModalOpen(false);
    setReqTitle('');
  };

  const handleCreateHandover = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hoEmpName || !hoSubName) return;

    const newHo: HandoverChecklist = {
      id: `ho-${Date.now()}`,
      employeeName: hoEmpName,
      substituteName: hoSubName,
      startDate: hoStartDate || '2026-08-20',
      endDate: hoEndDate || '2026-08-27',
      reason: 'إجازة رسمية',
      currentTasks: [
        { title: hoTask1 || 'متابعة المهام التشغيلية اليومية', status: 'PENDING', dueDate: '2026-08-22' },
      ],
      upcomingDeadlines: ['المواعيد القريبة الموثقة بالقائمة'],
      keyContacts: [hoContact1 || 'الجهات الرئيسية والمعنيون'],
      openIssues: ['لا يوجد معوقات مفتوحة'],
      pendingApprovals: ['المعاملات الجارية'],
      handoverSignedBySubstitute: true,
      status: 'ACTIVE',
    };

    setHandovers([newHo, ...handovers]);
    setIsHandoverModalOpen(false);
    setHoEmpName('');
    setHoSubName('');
  };

  return (
    <div className="space-y-6">
      {/* Module Title & Nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <GitPullRequest className="w-6 h-6 text-blue-600" />
            <span>أتمتة سير العمل والتصعيد وقوائم تسليم الإجازات</span>
          </h2>
          <p className="text-xs text-slate-500">
            ضمان استمرارية المعاملات عبر نقل الصلاحيات والتصعيد الآلي للبديل عند تجاوز المهلة الزمنية SLA.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'requests'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            المعاملات والتصعيد ({workflows.length})
          </button>
          <button
            onClick={() => setActiveTab('handover')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'handover'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            قوائم تسليم الإجازات ({handovers.length})
          </button>
        </div>
      </div>

      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium">
          {activeTab === 'requests'
            ? 'سجل المعاملات والتصعيد الآلي للبديل'
            : 'قوائم التسليم الموثقة قبل بدء الإجازات'}
        </span>

        {activeTab === 'requests' ? (
          <button
            onClick={() => setIsNewRequestModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>إنشاء معاملة جديدة</span>
          </button>
        ) : (
          <button
            onClick={() => setIsHandoverModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>إنشاء قائمة تسليم إجازة</span>
          </button>
        )}
      </div>

      {/* Track 1: Workflow Requests & Escalations */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {workflows.map((wf) => (
            <div
              key={wf.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 hover:border-slate-300 transition-all"
            >
              {/* Row Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                      {wf.referenceNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-500">{wf.department}</span>
                    {wf.amountQAR && (
                      <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {wf.amountQAR.toLocaleString()} ريال قطري
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{wf.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  {wf.status === 'APPROVED' ? (
                    <span className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1 rounded-full font-bold border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> معتمدة
                    </span>
                  ) : wf.status === 'ESCALATED' ? (
                    <span className="bg-rose-50 text-rose-700 text-xs px-3 py-1 rounded-full font-bold border border-rose-200 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> مجهزة وتنقّلت للبديل
                    </span>
                  ) : (
                    <span className="bg-amber-50 text-amber-800 text-xs px-3 py-1 rounded-full font-bold border border-amber-200 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" /> قيد المراجعة
                    </span>
                  )}
                </div>
              </div>

              {/* Assignee & Escalation Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block mb-0.5">المسؤول الحالي عن المعاملة:</span>
                  <span className="font-bold text-slate-900">{wf.currentAssigneeRole}</span>
                </div>

                <div>
                  <span className="text-slate-500 block mb-0.5">البديل عند تجاوز المهلة ({wf.escalationSlaHours}h SLA):</span>
                  <span className="font-bold text-emerald-700">{wf.substituteAssigneeRole}</span>
                </div>
              </div>

              {/* Actions & Timeline */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="text-[11px] text-slate-500">
                  <span>طالب المعاملة: </span>
                  <strong className="text-slate-800">{wf.requesterName}</strong>
                </div>

                {wf.status === 'PENDING' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEscalateWorkflow(wf.id)}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-rose-200 cursor-pointer transition-all"
                    >
                      تصعيد فوراً للبديل
                    </button>
                    <button
                      onClick={() => onApproveWorkflow(wf.id, 'د. يوسف المنصوري')}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg cursor-pointer transition-all"
                    >
                      اعتماد المعاملة
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Track 2: Leave Handover Checklists */}
      {activeTab === 'handover' && (
        <div className="space-y-4">
          {handovers.map((ho) => (
            <div
              key={ho.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-0.5 rounded border border-emerald-200 font-bold">
                      قائمة تسليم موثقة
                    </span>
                    <span className="text-xs text-slate-500">
                      الفترة: {ho.startDate} إلى {ho.endDate}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    تسليم إجازة: {ho.employeeName} ← البديل: {ho.substituteName}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {ho.handoverSignedBySubstitute ? (
                    <span className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1 rounded-full font-bold border border-emerald-200 flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> موقع ومستلم من البديل
                    </span>
                  ) : (
                    <span className="bg-amber-50 text-amber-800 text-xs px-3 py-1 rounded-full font-bold border border-amber-200">
                      بانتظار توقيع البديل
                    </span>
                  )}
                </div>
              </div>

              {/* Handover Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-800 block">المهام الجارية المحولة للبديل:</span>
                  <ul className="space-y-1 pr-4 list-disc text-slate-600">
                    {ho.currentTasks.map((t, idx) => (
                      <li key={idx} className="flex items-center justify-between">
                        <span>{t.title}</span>
                        <span className="text-[10px] text-amber-700 font-semibold">تاريخ: {t.dueDate}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-800 block">جهات التواصل الهامة الموكلة:</span>
                  <ul className="space-y-1 pr-4 list-disc text-slate-600">
                    {ho.keyContacts.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Request Modal */}
      {isNewRequestModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateRequest}
            className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-slate-900"
          >
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              إنشاء معاملة جديدة مع أتمتة التصعيد للبديل
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 block mb-1">عنوان المعاملة:*</label>
                <input
                  type="text"
                  required
                  value={reqTitle}
                  onChange={(e) => setReqTitle(e.target.value)}
                  placeholder="عنوان الطلب أو المعاملة"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1">نوع المعاملة:</label>
                  <select
                    value={reqType}
                    onChange={(e) => setReqType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                  >
                    <option value="PURCHASE_ORDER">طلب شراء (PO)</option>
                    <option value="EXPENSE_APPROVAL">اعتماد مصروفات</option>
                    <option value="LEAVE_REQUEST">طلب إجازة</option>
                    <option value="CONTRACT_SIGN">توقيع عقد</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 block mb-1">المبلغ بالمصروفات (QAR):</label>
                  <input
                    type="number"
                    value={reqAmount}
                    onChange={(e) => setReqAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1">طالب المعاملة:</label>
                  <input
                    type="text"
                    value={reqRequester}
                    onChange={(e) => setReqRequester(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-slate-600 block mb-1">القسم:</label>
                  <input
                    type="text"
                    value={reqDepartment}
                    onChange={(e) => setReqDepartment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsNewRequestModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                إرسال وتفعيل التنبيه
              </button>
            </div>
          </form>
        </div>
      )}

      {/* New Handover Modal */}
      {isHandoverModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateHandover}
            className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-slate-900"
          >
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              إنشاء قائمة تسليم مهام وإجازة جديدة
            </h3>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1">اسم الموظف المبتعد:*</label>
                  <input
                    type="text"
                    required
                    value={hoEmpName}
                    onChange={(e) => setHoEmpName(e.target.value)}
                    placeholder="الاسم والأصيل"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-slate-600 block mb-1">اسم البديل المستلم:*</label>
                  <input
                    type="text"
                    required
                    value={hoSubName}
                    onChange={(e) => setHoSubName(e.target.value)}
                    placeholder="اسم البديل"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1">تاريخ بداية الإجازة:</label>
                  <input
                    type="date"
                    value={hoStartDate}
                    onChange={(e) => setHoStartDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-slate-600 block mb-1">تاريخ نهاية الإجازة:</label>
                  <input
                    type="date"
                    value={hoEndDate}
                    onChange={(e) => setHoEndDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 block mb-1">أهم مهمة جارية محولة للبديل:</label>
                <input
                  type="text"
                  value={hoTask1}
                  onChange={(e) => setHoTask1(e.target.value)}
                  placeholder="وصف المهمة وموعد التسليم"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">جهة اتصال رئيسية موكلة للبديل:</label>
                <input
                  type="text"
                  value={hoContact1}
                  onChange={(e) => setHoContact1(e.target.value)}
                  placeholder="اسم الشخص ورقم الهاتف"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsHandoverModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                تثبيت وتوقيع قائمة التسليم
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
