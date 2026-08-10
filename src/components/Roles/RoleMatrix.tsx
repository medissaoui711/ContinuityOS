import React, { useState } from 'react';
import { EmployeeRole, SkillMatrixItem } from '../../types';
import {
  Users,
  UserCheck,
  Shield,
  Plus,
  Edit2,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Briefcase,
  FileText,
  Search,
} from 'lucide-react';

interface RoleMatrixProps {
  roles: EmployeeRole[];
  skillMatrix: SkillMatrixItem[];
  onAddRole: (role: EmployeeRole) => void;
  onUpdateRole: (role: EmployeeRole) => void;
  onAddSkillItem: (skill: SkillMatrixItem) => void;
}

export const RoleMatrix: React.FC<RoleMatrixProps> = ({
  roles,
  skillMatrix,
  onAddRole,
  onUpdateRole,
  onAddSkillItem,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'roles' | 'skills'>('roles');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [editingRole, setEditingRole] = useState<EmployeeRole | null>(null);
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);

  // New role form state
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newDepartment, setNewDepartment] = useState('المالية');
  const [newPrimaryName, setNewPrimaryName] = useState('');
  const [newPrimaryEmail, setNewPrimaryEmail] = useState('');
  const [newSubstituteName, setNewSubstituteName] = useState('');
  const [newSubstituteEmail, setNewSubstituteEmail] = useState('');
  const [newLimitQAR, setNewLimitQAR] = useState(20000);
  const [newResponsibilities, setNewResponsibilities] = useState('');

  const filteredRoles = roles.filter(
    (r) =>
      r.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.primaryHolderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSkills = skillMatrix.filter(
    (s) =>
      s.processName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.primaryOperatorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveNewRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle || !newPrimaryName) return;

    const created: EmployeeRole = {
      id: `role-${Date.now()}`,
      jobTitle: newJobTitle,
      department: newDepartment,
      level: 'MANAGER',
      primaryHolderName: newPrimaryName,
      primaryHolderEmail: newPrimaryEmail || `${newPrimaryName.toLowerCase().replace(/\s+/g, '')}@company.qa`,
      substituteHolderName: newSubstituteName || 'لم يحدد بعد',
      substituteHolderEmail: newSubstituteEmail || 'sub@company.qa',
      substituteTrainedStatus: 'IN_TRAINING',
      responsibilities: newResponsibilities
        ? newResponsibilities.split('\n')
        : ['تنفيذ المهام اليومية للقسم'],
      permissions: ['DEPARTMENT_STANDARD_ACCESS'],
      financialLimitQAR: Number(newLimitQAR),
      allowedDecisions: ['الموافقات المباشرة للقسم'],
      requiredSkills: ['المعرفة التشغيلية للقسم'],
      requiredReports: ['التقرير الدوري'],
    };

    onAddRole(created);
    setIsAddRoleModalOpen(false);
    // Reset form
    setNewJobTitle('');
    setNewPrimaryName('');
    setNewSubstituteName('');
  };

  const handleUpdateSubstitute = (role: EmployeeRole, newSubstitute: string, status: any) => {
    const updated = {
      ...role,
      substituteHolderName: newSubstitute,
      substituteTrainedStatus: status,
    };
    onUpdateRole(updated);
    setEditingRole(null);
  };

  return (
    <div className="space-y-6">
      {/* Module Title & Subtabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span>هيكل الصلاحيات ومصفوفة المهارات والبدلاء</span>
          </h2>
          <p className="text-xs text-slate-500">
            تحديد المسؤوليات والقرارات والحد المالي والبديل المباشر المعتمد لكل وظيفة لمسح الاعتماد الأحادي.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveSubTab('roles')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === 'roles'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            هيكل الأدوار والصلاحيات ({roles.length})
          </button>
          <button
            onClick={() => setActiveSubTab('skills')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === 'skills'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            مصفوفة المهارات والبدلاء ({skillMatrix.length})
          </button>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث حسب الوظيفة، الاسم، أو المهارة..."
            className="w-full bg-white border border-slate-300 rounded-xl pr-9 pl-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {activeSubTab === 'roles' && (
          <button
            onClick={() => setIsAddRoleModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة دور وظيفي جديد</span>
          </button>
        )}
      </div>

      {/* Tab 1: Roles List */}
      {activeSubTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRoles.map((role) => (
            <div
              key={role.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all space-y-4 relative"
            >
              {/* Header Info */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {role.department}
                    </span>
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      السقف: {role.financialLimitQAR.toLocaleString()} ريال
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{role.jobTitle}</h3>
                </div>

                <button
                  onClick={() => setEditingRole(role)}
                  className="text-slate-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
                  title="تحديث بيانات البديل والصلاحيات"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              {/* Primary Holder & Substitute Pair */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                {/* Primary */}
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                    <UserCheck className="w-3 h-3 text-emerald-600" />
                    <span>الأصيل (المالك المباشر)</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900">{role.primaryHolderName}</div>
                  <div className="text-[10px] text-slate-500 truncate">{role.primaryHolderEmail}</div>
                </div>

                {/* Substitute */}
                <div className="space-y-1 border-r border-slate-200 pr-3">
                  <div className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                    <Users className="w-3 h-3 text-blue-600" />
                    <span>البديل المعتمد</span>
                  </div>
                  <div className="text-xs font-bold text-blue-700">{role.substituteHolderName}</div>
                  <div className="flex items-center gap-1 text-[10px]">
                    {role.substituteTrainedStatus === 'FULLY_TRAINED' ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> مدرب ومؤهل
                      </span>
                    ) : (
                      <span className="text-amber-700 font-semibold flex items-center gap-0.5">
                        <AlertTriangle className="w-3 h-3" /> قيد التدريب
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Responsibilities */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 block">المسؤوليات والمهام:</span>
                <ul className="space-y-1 text-xs text-slate-600 pr-4 list-disc">
                  {role.responsibilities.map((resp, idx) => (
                    <li key={idx}>{resp}</li>
                  ))}
                </ul>
              </div>

              {/* Decisions & Reports */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-[11px]">
                <span className="text-slate-500">القرارات المسموحة:</span>
                {role.allowedDecisions.map((dec, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-medium"
                  >
                    {dec}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Skills Matrix */}
      {activeSubTab === 'skills' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">مصفوفة المهارات وتغطية العمليات الحيوية</h3>
              <p className="text-xs text-slate-500">
                يشترط وجود شخصين مدربين على الأقل لكل عملية حرجة طبقاً لمبادئ ISO 22301.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right text-slate-800">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">اسم العملية الحيوية</th>
                  <th className="p-3.5">القسم</th>
                  <th className="p-3.5">الأصيل (المشغل الأساسي)</th>
                  <th className="p-3.5">البديل الأول (المشغل الثاني)</th>
                  <th className="p-3.5">البديل الثاني</th>
                  <th className="p-3.5">حالة التغطية</th>
                  <th className="p-3.5">تاريخ التدقيق</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSkills.map((sk) => (
                  <tr key={sk.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                      <span>{sk.processName}</span>
                      {sk.isCritical && (
                        <span className="bg-rose-50 text-rose-700 text-[10px] px-1.5 py-0.5 rounded border border-rose-200 font-semibold">
                          حرجة
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-slate-600">{sk.department}</td>
                    <td className="p-3.5 font-medium text-emerald-700">{sk.primaryOperatorName}</td>
                    <td className="p-3.5 font-medium text-blue-700">{sk.secondaryOperatorName}</td>
                    <td className="p-3.5 text-slate-500">{sk.tertiaryOperatorName || 'غير محدد'}</td>
                    <td className="p-3.5">
                      {sk.coverageHealth === 'OPTIMAL' ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-bold border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> ممتازة (2+ بدلاء)
                        </span>
                      ) : sk.coverageHealth === 'MODERATE' ? (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 px-2.5 py-1 rounded-full text-[10px] font-bold border border-amber-200">
                          <AlertTriangle className="w-3 h-3 text-amber-600" /> متوسطة (بديل واحد)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full text-[10px] font-bold border border-rose-200">
                          <AlertCircle className="w-3 h-3 text-rose-600" /> خطرة (اعتماد أحادي!)
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-slate-500">{sk.lastReviewedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Role Substitute Modal */}
      {editingRole && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-900">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              تحديث البديل وحالة التدريب - {editingRole.jobTitle}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 block mb-1">اسم الشخص البديل:</label>
                <input
                  type="text"
                  defaultValue={editingRole.substituteHolderName}
                  id="editSubName"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">حالة جاهزية البديل:</label>
                <select
                  defaultValue={editingRole.substituteTrainedStatus}
                  id="editSubStatus"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                >
                  <option value="FULLY_TRAINED">مدرب ومؤهل بالكامل (Fully Trained)</option>
                  <option value="IN_TRAINING">قيد التدريب الميداني (In Training)</option>
                  <option value="NOT_TRAINED">غير مدرب (Not Trained)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 block mb-1">السقف المالي المسموح للبديل (QAR):</label>
                <input
                  type="number"
                  defaultValue={editingRole.financialLimitQAR}
                  id="editLimitQAR"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setEditingRole(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  const newName = (document.getElementById('editSubName') as HTMLInputElement).value;
                  const newStat = (document.getElementById('editSubStatus') as HTMLSelectElement).value;
                  const newLim = Number((document.getElementById('editLimitQAR') as HTMLInputElement).value);
                  handleUpdateSubstitute(
                    { ...editingRole, financialLimitQAR: newLim },
                    newName,
                    newStat
                  );
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                حفظ التعديلات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Role Modal */}
      {isAddRoleModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveNewRole}
            className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-slate-900"
          >
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              إضافة دور وظيفي جديد ونظام تفويض
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-600 block mb-1">المسمى الوظيفي:*</label>
                <input
                  type="text"
                  required
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  placeholder="مثال: مسؤول الدعم الفني"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">القسم:*</label>
                <select
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                >
                  <option value="المالية">المالية</option>
                  <option value="المشتريات">المشتريات والمخزون</option>
                  <option value="العمليات">العمليات والتشغيل</option>
                  <option value="تقنية المعلومات">تقنية المعلومات</option>
                  <option value="المبيعات">المبيعات والعملاء</option>
                  <option value="الموارد البشرية">الموارد البشرية</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 block mb-1">اسم الموظف الأصيل:*</label>
                <input
                  type="text"
                  required
                  value={newPrimaryName}
                  onChange={(e) => setNewPrimaryName(e.target.value)}
                  placeholder="الاسم الثلاثي"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">اسم الموظف البديل المعتمد:</label>
                <input
                  type="text"
                  value={newSubstituteName}
                  onChange={(e) => setNewSubstituteName(e.target.value)}
                  placeholder="اسم البديل المباشر"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                />
              </div>

              <div className="col-span-2">
                <label className="text-slate-600 block mb-1">السقف المالي للموافقات (QAR):</label>
                <input
                  type="number"
                  value={newLimitQAR}
                  onChange={(e) => setNewLimitQAR(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                />
              </div>

              <div className="col-span-2">
                <label className="text-slate-600 block mb-1">المسؤوليات الرئيسية (سطر لكل مهمة):</label>
                <textarea
                  rows={3}
                  value={newResponsibilities}
                  onChange={(e) => setNewResponsibilities(e.target.value)}
                  placeholder="المهمة 1&#10;المهمة 2"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddRoleModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                حفظ الدور الوظيفي
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
