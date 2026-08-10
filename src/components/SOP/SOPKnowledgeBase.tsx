import React, { useState } from 'react';
import { StandardOperatingProcedure, SOPStep } from '../../types';
import {
  BookOpen,
  Plus,
  Sparkles,
  Search,
  CheckCircle2,
  FileText,
  FolderArchive,
  AlertCircle,
  HelpCircle,
  Layers,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface SOPKnowledgeBaseProps {
  sops: StandardOperatingProcedure[];
  onAddSop: (sop: StandardOperatingProcedure) => void;
  onUpdateSop: (sop: StandardOperatingProcedure) => void;
}

export const SOPKnowledgeBase: React.FC<SOPKnowledgeBaseProps> = ({
  sops,
  onAddSop,
  onUpdateSop,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSopId, setExpandedSopId] = useState<string | null>(sops[0]?.id || null);

  // AI Modal
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiProcessName, setAiProcessName] = useState('');
  const [aiDepartment, setAiDepartment] = useState('المالية والرواتب');
  const [aiCurrentSteps, setAiCurrentSteps] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [generatedSopResult, setGeneratedSopResult] = useState<any | null>(null);

  const categories = ['ALL', 'المالية والرواتب', 'المشتريات والمخزون', 'تقنية المعلومات والتعافي', 'المبيعات والعملاء', 'الموارد البشرية'];

  const filteredSops = sops.filter((sop) => {
    const matchesCategory = selectedCategory === 'ALL' || sop.category === selectedCategory;
    const matchesSearch =
      sop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sop.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sop.contingencyIfAbsent.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleGenerateAiSop = async () => {
    if (!aiProcessName) return;
    setLoadingAi(true);
    setGeneratedSopResult(null);

    try {
      const res = await fetch('/api/gemini/sop-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          processName: aiProcessName,
          department: aiDepartment,
          currentSteps: aiCurrentSteps,
          actionType: 'generate',
        }),
      });

      const json = await res.json();
      if (json.data && json.data.steps) {
        setGeneratedSopResult(json.data);
      } else {
        alert('حدث خطأ أثناء الإنشاء، يرجى إعادة المحاولة.');
      }
    } catch (e) {
      alert('فشل الاتصال بخدمة الذكاء الاصطناعي.');
    } finally {
      setLoadingAi(false);
    }
  };

  const handleAdoptGeneratedSop = () => {
    if (!generatedSopResult) return;

    const newSop: StandardOperatingProcedure = {
      id: `sop-${Date.now()}`,
      title: generatedSopResult.title || aiProcessName,
      category: aiDepartment,
      isCritical: true,
      triggerCondition: generatedSopResult.trigger || 'بداية العملية حسب الحاجة',
      ownerRoleId: 'role-finance-mgr',
      substituteRoleId: 'role-senior-acct',
      inputs: generatedSopResult.inputs || ['البيانات التشغيلية للقسم'],
      steps: (generatedSopResult.steps || []).map((s: any, idx: number) => ({
        stepNumber: idx + 1,
        title: s.title || `خطوة ${idx + 1}`,
        description: s.description || 'وصف الخطوة',
        approverRole: s.approver || 'المسؤول',
      })),
      requiredApprovals: ['موافقة مدير القسم والبديل المعتمد'],
      exceptions: ['الحالات الطارئة تعتمد بقرار من COO'],
      outputs: generatedSopResult.outputs || ['المستند المكتمل والسجل'],
      contingencyIfAbsent: generatedSopResult.contingencyPlan || 'يتولى البديل المباشر التنفيذ بتفويض تلقائي.',
      documentStoragePath: generatedSopResult.documentStorage || '/Vault/SOPs/Generated/',
      completionCriteria: generatedSopResult.completionCriteria || 'اكتمال التوثيق وتنسيق السجلات.',
      lastUpdated: new Date().toISOString().split('T')[0],
      version: '1.0',
    };

    onAddSop(newSop);
    setIsAiModalOpen(false);
    setGeneratedSopResult(null);
    setExpandedSopId(newSop.id);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span>قاعدة المعرفة وتوثيق إجراءات التشغيل القياسية (SOPs)</span>
          </h2>
          <p className="text-xs text-slate-500">
            لكل عملية حيوية: محفز البدء، الأصيل، البديل، الخطوات بالتسلسل، المكان المخصص للحفظ، وإجراءات الطوارئ عند الغياب.
          </p>
        </div>

        <button
          onClick={() => setIsAiModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs cursor-pointer transition-all"
        >
          <Sparkles className="w-4 h-4 text-blue-200" />
          <span>توليد دليل SOP ذكي بالـ AI</span>
        </button>
      </div>

      {/* Filter and Category Pills */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat === 'ALL' ? 'جميع الإجراءات' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث في الإجراءات والخطوات..."
            className="w-full bg-white border border-slate-300 rounded-xl pr-9 pl-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* SOPs List Accordions */}
      <div className="space-y-4">
        {filteredSops.map((sop) => {
          const isExpanded = expandedSopId === sop.id;
          return (
            <div
              key={sop.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs transition-all"
            >
              {/* Header Accordion Clickable */}
              <div
                onClick={() => setExpandedSopId(isExpanded ? null : sop.id)}
                className="p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                        {sop.category}
                      </span>
                      <span className="text-xs text-slate-500">v{sop.version}</span>
                      {sop.isCritical && (
                        <span className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200 font-semibold">
                          عملية حرجة
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{sop.title}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden sm:block text-left text-xs text-slate-500">
                    <div>تاريخ التحديث: {sop.lastUpdated}</div>
                    <div className="text-emerald-700 font-medium">خطوات موثقة: {sop.steps.length}</div>
                  </div>

                  <div className="text-slate-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Expanded Details Panel */}
              {isExpanded && (
                <div className="p-6 bg-slate-50/50 border-t border-slate-200 space-y-6">
                  {/* Trigger & Contingency Banner */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1">
                      <span className="text-xs font-bold text-amber-800 block">متى تبدأ العملية؟ (المحفز):</span>
                      <p className="text-xs text-slate-800">{sop.triggerCondition}</p>
                    </div>

                    <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 space-y-1">
                      <span className="text-xs font-bold text-blue-900 block">ماذا يحدث عند غياب المسؤول المالك؟ (خطة البديل):</span>
                      <p className="text-xs text-blue-900">{sop.contingencyIfAbsent}</p>
                    </div>
                  </div>

                  {/* Inputs & Outputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                      <span className="font-bold text-slate-800 block">المدخلات المطلوبة:</span>
                      <ul className="list-disc pr-4 space-y-1 text-slate-600">
                        {sop.inputs.map((inp, idx) => (
                          <li key={idx}>{inp}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                      <span className="font-bold text-slate-800 block">المخرجات والنتائج:</span>
                      <ul className="list-disc pr-4 space-y-1 text-slate-600">
                        {sop.outputs.map((out, idx) => (
                          <li key={idx}>{out}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Sequential Steps List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-600" />
                      <span>الخطوات المكتوبة بالتسلسل التشغيلي:</span>
                    </h4>

                    <div className="space-y-2">
                      {sop.steps.map((st) => (
                        <div
                          key={st.stepNumber}
                          className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-start gap-3"
                        >
                          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {st.stepNumber}
                          </div>

                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900">{st.title}</span>
                              {st.approverRole && (
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                                  جهة الاعتماد: {st.approverRole}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600">{st.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Storage Location & Completion Criteria */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-slate-600">
                      <FolderArchive className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>مكان حفظ المستندات والسجلات:</span>
                      <code className="bg-slate-100 text-blue-800 px-2 py-0.5 rounded border border-slate-200 font-mono">
                        {sop.documentStoragePath}
                      </code>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>معيار اكتمال العملية:</span>
                      <span className="text-slate-800 font-medium">{sop.completionCriteria}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* AI SOP Generation Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-blue-600">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-base font-bold text-slate-900">توليد دليل إجراء SOP متكامل بالذكاء الاصطناعي (ISO 22301)</h3>
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xs cursor-pointer"
              >
                إغلاق
              </button>
            </div>

            {!generatedSopResult ? (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">اسم العملية المطلوبة:*</label>
                  <input
                    type="text"
                    value={aiProcessName}
                    onChange={(e) => setAiProcessName(e.target.value)}
                    placeholder="مثال: إجراء استلام وشحن الطلبات للعملاء الكبار"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">القسم المسؤول:*</label>
                  <select
                    value={aiDepartment}
                    onChange={(e) => setAiDepartment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900"
                  >
                    <option value="المالية والرواتب">المالية والرواتب</option>
                    <option value="المشتريات والمخزون">المشتريات والمخزون</option>
                    <option value="تقنية المعلومات والتعافي">تقنية المعلومات والتعافي</option>
                    <option value="المبيعات والعملاء">المبيعات والعملاء</option>
                    <option value="الموارد البشرية">الموارد البشرية</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">
                    أي خطوات أو تفاصيل مبدئية تفضل تضمينها (اختياري):
                  </label>
                  <textarea
                    rows={3}
                    value={aiCurrentSteps}
                    onChange={(e) => setAiCurrentSteps(e.target.value)}
                    placeholder="أدخل أي ملاحظات حول من يصدر الموافقة وكيفية الحفظ..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 placeholder-slate-400"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleGenerateAiSop}
                    disabled={loadingAi || !aiProcessName}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-xs cursor-pointer transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-blue-200" />
                    <span>{loadingAi ? 'جاري بناء دليل الإجراء...' : 'صياغة الدليل التشغيلي القياسي (SOP)'}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Review Generated SOP Result */
              <div className="space-y-4 text-xs">
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-2">
                  <h4 className="text-sm font-bold text-emerald-900">{generatedSopResult.title}</h4>
                  <p className="text-slate-800">
                    <strong className="text-emerald-800">المحفز:</strong> {generatedSopResult.trigger}
                  </p>
                  <p className="text-slate-800">
                    <strong className="text-emerald-800">خطة غياب المسؤول:</strong> {generatedSopResult.contingencyPlan}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-slate-800 block">الخطوات الصادرة من الذكاء الاصطناعي:</span>
                  {(generatedSopResult.steps || []).map((s: any, idx: number) => (
                    <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="font-bold text-blue-700">الخطوة {s.stepNumber || idx + 1}: {s.title}</span>
                      <p className="text-slate-600 mt-0.5">{s.description}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setGeneratedSopResult(null)}
                    className="px-4 py-2 rounded-xl font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    إعادة المحاولة
                  </button>
                  <button
                    onClick={handleAdoptGeneratedSop}
                    className="px-5 py-2.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                  >
                    اعتماد وإضافة الدليل لقاعدة المعرفة
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
