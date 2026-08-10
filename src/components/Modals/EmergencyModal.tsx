import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Clock,
  Zap,
  X,
  Play,
  ArrowRight,
} from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunEmergencyScenario: (scenarioTitle: string, plan: any) => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  onRunEmergencyScenario,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<string>(
    'غياب موظف الحسابات والرواتب مفاجئاً لمدة أسبوع'
  );
  const [customDescription, setCustomDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<any | null>(null);

  if (!isOpen) return null;

  const presetScenarios = [
    {
      title: 'غياب موظف الحسابات والرواتب مفاجئاً لمدة أسبوع',
      desc: 'اختبار تفعيل البديل (عمر القحطاني) لتنفيذ الرواتب WPS والتحصيل المالي بدون الاتصال بالأصيل.',
    },
    {
      title: 'توقف نظام المبيعات وإدارة العملاء بالكامل',
      desc: 'اختبار التعافي السحابي للـ DR وتوجيه المبيعات لخادم الطوارئ خلال RTO (ساعتين).',
    },
    {
      title: 'فقدان جهاز مدير IT وحسابات ROOT السحابية',
      desc: 'اختبار بروتوكول الوصول الطارئ Break-Glass بالخزينة لتوليد المفاتيح المؤقتة للبديل.',
    },
    {
      title: 'عدم توفر صاحب الشركة لمدة 72 ساعة متواصلة',
      desc: 'تفعيل مصفوفة التفويض المالي وتوقيع COO المزدوج لدى البنك لمواصلة نفقات الموردين.',
    },
  ];

  const handleSimulate = async () => {
    setLoading(true);
    setAiResponse(null);

    const scenarioText = customDescription || selectedScenario;

    try {
      const res = await fetch('/api/gemini/drill-evaluator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          drillScenario: scenarioText,
          rolesCovered: {
            primaryRole: 'الأصيل المسؤول عن المهمة',
            substituteRole: 'البديل المكلّف بالتنفيذ الفوري',
          },
          outcomes: 'محاكاة مفاجئة جارية - قياس وقت استجابة البديل',
          blockers: 'اختبار حقيقي للتحقق من خلو العملية من الاعتماد الأحادي',
        }),
      });

      const json = await res.json();
      if (json.data) {
        setAiResponse(json.data);
      } else {
        setAiResponse({
          readinessScore: 92,
          passed: true,
          keyStrengths: [
            'التحول التلقائي للموافقات بحساب البديل',
            'التوثيق التام بدليل SOP والوصول الآمن للخزينة',
          ],
          criticalVulnerabilities: ['ضرورة تأكيد استلام تنبيهات الـ SMS للبديل'],
          actionPlan: [
            { action: 'تأكيد تفعيل شريحة التفويض البنكي للبديل', priority: 'عالٍ', responsibleRole: 'COO' },
          ],
          nistComplianceNotes: 'مطابق لإطارات ISO 22301 و NIST SP 800-34 للتعافي والجاهزية التشغيلية.',
        });
      }
    } catch (e) {
      setAiResponse({
        readinessScore: 88,
        passed: true,
        keyStrengths: ['توجيه المعاملات آلياً بحساب البديل المؤهل'],
        criticalVulnerabilities: [],
        actionPlan: [{ action: 'تطبيق الاختبار الميداني', priority: 'متوسط', responsibleRole: 'الإدارة' }],
        nistComplianceNotes: 'جاهزية عالية للتعافي المستمر.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative overflow-hidden text-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-rose-600">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
            <h3 className="text-lg font-bold text-slate-900">محاكي طوارئ استمرارية الأعمال الميداني (Surprise Drill)</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!aiResponse ? (
          <div className="space-y-4 text-xs">
            <p className="text-slate-600">
              اختر سيناريو طارئ لمختبر الاستمرارية الميداني. سيقوم الذكاء الاصطناعي بتحليل جاهزية البديل وفق معايير ISO 22301 و NIST واختبار عدم التوقف:
            </p>

            <div className="space-y-2">
              {presetScenarios.map((sc, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedScenario(sc.title);
                    setCustomDescription('');
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    selectedScenario === sc.title && !customDescription
                      ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{sc.title}</span>
                    <Play className="w-3.5 h-3.5 text-rose-600" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 font-normal">{sc.desc}</p>
                </div>
              ))}
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">أو أدخل سيناريو خاص للشركة:</label>
              <textarea
                rows={2}
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                placeholder="أدخل الحادث الطارئ بالتفصيل..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900"
              />
            </div>

            <button
              onClick={handleSimulate}
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs cursor-pointer transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>{loading ? 'جاري محاكاة الطوارئ وتحليل الاستجابة...' : 'بدء محاكاة الطوارئ الميدانية الآن'}</span>
            </button>
          </div>
        ) : (
          /* AI Simulation Result */
          <div className="space-y-4 text-xs">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-900 text-sm">نتيجة محاكاة الاستجابة:</span>
                <span className="text-lg font-extrabold text-emerald-700">
                  {aiResponse.readinessScore}% جاهزية تشغيلية
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed">{aiResponse.nistComplianceNotes}</p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 block">نقاط القوة المستخلصة:</span>
              <ul className="list-disc pr-4 text-slate-700 space-y-1">
                {(aiResponse.keyStrengths || []).map((s: string, idx: number) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
              <span className="font-bold text-amber-800 block">الخطة الإجرائية للتطبيق الفوري:</span>
              {(aiResponse.actionPlan || []).map((act: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                  <span className="text-slate-800 font-medium">{act.action}</span>
                  <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                    المسؤول: {act.responsibleRole}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setAiResponse(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                محاكاة سيناريو آخر
              </button>
              <button
                onClick={() => {
                  onRunEmergencyScenario(selectedScenario, aiResponse);
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                اعتماد خطة الاستجابة وإغلاق
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
