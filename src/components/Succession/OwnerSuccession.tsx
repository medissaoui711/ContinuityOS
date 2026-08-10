import React, { useState } from 'react';
import { OwnerSuccessionFramework } from '../../types';
import {
  Crown,
  ShieldCheck,
  Building2,
  DollarSign,
  Users,
  FileCheck2,
  AlertTriangle,
  Scale,
  Briefcase,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface OwnerSuccessionProps {
  succession: OwnerSuccessionFramework;
  onUpdateFramework: (updated: OwnerSuccessionFramework) => void;
}

export const OwnerSuccession: React.FC<OwnerSuccessionProps> = ({
  succession,
  onUpdateFramework,
}) => {
  const [editingLimits, setEditingLimits] = useState(false);
  const [managerLimit, setManagerLimit] = useState(
    succession.financialLimits.managerMaxQAR
  );
  const [executiveLimit, setExecutiveLimit] = useState(
    succession.financialLimits.executiveMaxQAR
  );

  const handleSaveLimits = () => {
    onUpdateFramework({
      ...succession,
      financialLimits: {
        ...succession.financialLimits,
        managerMaxQAR: Number(managerLimit),
        executiveMaxQAR: Number(executiveLimit),
        ownerRequiredAboveQAR: Number(executiveLimit),
      },
    });
    setEditingLimits(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
            <Crown className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              استمرارية دور صاحب الشركة ومصفوفة تفويض الصلاحيات (Owner Continuity)
            </h2>
            <p className="text-xs text-slate-500">
              تحديد المسارات التشغيلية، حدود الاعتماد المالي، والبديل القانوني والبنكي لضمان تشغيل الشركة بكفاءة عند غياب صاحب الشركة.
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Financial Limits & Daily Ops Director */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Daily Ops Leader & Delegation */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>إدارة التشغيل اليومي عند غياب المالك</span>
            </h3>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
              مفوض رسمياً
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="text-xs text-slate-500">الدور المكلّف بإدارة الشركة:</div>
            <div className="text-base font-bold text-slate-900">{succession.dailyOpsManagerRole}</div>
            <div className="text-xs font-semibold text-emerald-700">
              المسؤول الحالي: {succession.dailyOpsManagerName}
            </div>
            <p className="text-xs text-slate-600 pt-1 leading-relaxed">
              يمتلك مدير العمليات التنفيذي الصلاحية الكاملة لتسيير الأعمال اليومية، توقيع العقود التشغيلية حتى الحد المالي المسموح، وإدارة الطوارئ.
            </p>
          </div>
        </div>

        {/* Card 2: Financial Approval Thresholds */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-amber-600" />
              <span>مصفوفة حدود الاعتماد المالي (Financial Limits QAR)</span>
            </h3>

            <button
              onClick={() => setEditingLimits(!editingLimits)}
              className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
            >
              {editingLimits ? 'إلغاء' : 'تحديث السقف'}
            </button>
          </div>

          {!editingLimits ? (
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-600 font-medium">سقف اعتماد مدراء الأقسام:</span>
                <span className="font-bold text-slate-900">
                  حتى {succession.financialLimits.managerMaxQAR.toLocaleString()} ريال قطري
                </span>
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-600 font-medium">سقف اعتماد المدير التنفيذي (COO):</span>
                <span className="font-bold text-amber-800">
                  حتى {succession.financialLimits.executiveMaxQAR.toLocaleString()} ريال قطري
                </span>
              </div>

              <div className="flex items-center justify-between bg-rose-50 p-3 rounded-xl border border-rose-200">
                <span className="text-rose-900 font-medium">توقيع المالك حصراً:</span>
                <span className="font-bold text-rose-700">
                  للمبالغ فوق {succession.financialLimits.ownerRequiredAboveQAR.toLocaleString()} ريال قطري
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 block mb-1">سقف مدراء الأقسام (QAR):</label>
                <input
                  type="number"
                  value={managerLimit}
                  onChange={(e) => setManagerLimit(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">سقف المدير التنفيذى COO (QAR):</label>
                <input
                  type="number"
                  value={executiveLimit}
                  onChange={(e) => setExecutiveLimit(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                />
              </div>

              <button
                onClick={handleSaveLimits}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl cursor-pointer transition-all"
              >
                حفظ حدود الاعتماد
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Section: Bank Signatories & Legal Counsel Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bank Signatories */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>سجل المفوضين بالتوقيع لدى البنوك (QNB)</span>
          </h3>

          <div className="space-y-2.5 text-xs">
            {succession.bankSignatories.map((bs, idx) => (
              <div
                key={idx}
                className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-900">{bs.name}</div>
                  <div className="text-[11px] text-slate-500">{bs.title}</div>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                  {bs.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Legal Counsel & Bank Advice Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Scale className="w-4 h-4 text-indigo-600" />
            <span>ملاحظات المستشار القانوني والبنكي (دولة قطر)</span>
          </h3>

          <div className="space-y-2.5 text-xs text-slate-700 leading-relaxed bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
            <p>
              • بعض التفويضات المدرسجة بالنظام لا تصبح نافذة بنكياً وقانونياً بمجرد وجودها داخل التطبيق؛ يلزم توثيق وكالة رسمية لدى إدارات التوثيق بوزارة العدل القطرية.
            </p>
            <p>
              • تم إيداع نموذج التوقيع المزدوج لدى البنك الرئيسي (QNB) للتعامل مع التحويلات والرواتب WPS في حال الغياب الطويل أو العجز الطارئ.
            </p>
            <p>
              • موقع حفظ العقود والوثائق القانونية الأصلية: <code className="text-indigo-800 font-mono font-bold">{succession.legalDocumentsVaultLocation}</code>
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Contingency Plan Steps */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <span>خطة الطوارئ لحالات الغياب الطويل أو فقدان التواصل (Contingency Roadmap)</span>
        </h3>

        <div className="space-y-3 text-xs">
          {succession.emergencyContingencySteps.map((step, idx) => (
            <div
              key={idx}
              className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex items-start gap-3"
            >
              <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-slate-800 leading-relaxed font-medium">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
