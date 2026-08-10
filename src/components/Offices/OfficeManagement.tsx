import React, { useState } from 'react';
import {
  Branch,
  AdminOffice,
  EmployeeStaff,
  AttendanceStatus,
} from '../../types';
import {
  Building2,
  MapPin,
  Users,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  ShieldAlert,
  ChevronRight,
  Filter,
  UserCheck,
  Building,
} from 'lucide-react';

interface OfficeManagementProps {
  branches: Branch[];
  offices: AdminOffice[];
  employees: EmployeeStaff[];
  onAddBranch: (branch: Branch) => void;
  onAddOffice: (office: AdminOffice) => void;
  onToggleAttendance: (employeeId: string, status: AttendanceStatus) => void;
}

export const OfficeManagement: React.FC<OfficeManagementProps> = ({
  branches,
  offices,
  employees,
  onAddBranch,
  onAddOffice,
  onToggleAttendance,
}) => {
  const [selectedBranchId, setSelectedBranchId] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddOfficeModal, setShowAddOfficeModal] = useState<boolean>(false);
  const [showAddBranchModal, setShowAddBranchModal] = useState<boolean>(false);

  // New Office Form State
  const [newOfficeName, setNewOfficeName] = useState('');
  const [newOfficeNumber, setNewOfficeNumber] = useState('');
  const [newOfficeBranchId, setNewOfficeBranchId] = useState(branches[0]?.id || '');
  const [newOfficeFloor, setNewOfficeFloor] = useState('الطابق 1');
  const [newOfficeCapacity, setNewOfficeCapacity] = useState(6);
  const [newOfficeDepartment, setNewOfficeDepartment] = useState('العمليات');
  const [newOfficeManager, setNewOfficeManager] = useState('');

  // New Branch Form State
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchCode, setNewBranchCode] = useState('');
  const [newBranchCity, setNewBranchCity] = useState('');
  const [newBranchAddress, setNewBranchAddress] = useState('');
  const [newBranchPhone, setNewBranchPhone] = useState('');
  const [newBranchManager, setNewBranchManager] = useState('');

  // Filtered offices
  const filteredOffices = offices.filter((off) => {
    const matchesBranch = selectedBranchId === 'ALL' || off.branchId === selectedBranchId;
    const matchesSearch =
      off.officeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      off.officeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      off.branchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      off.managerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  const handleCreateOffice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfficeName || !newOfficeNumber) return;

    const branchObj = branches.find((b) => b.id === newOfficeBranchId);
    const created: AdminOffice = {
      id: `off-${Date.now()}`,
      branchId: newOfficeBranchId,
      branchName: branchObj?.name || 'المقر الرئيسي',
      officeName: newOfficeName,
      officeNumber: newOfficeNumber,
      floor: newOfficeFloor,
      capacity: Number(newOfficeCapacity),
      department: newOfficeDepartment,
      managerName: newOfficeManager || 'غير محدد',
      description: `مكتب فرعي إداري تم إنشاؤه مخصص لـ ${newOfficeDepartment}`,
    };

    onAddOffice(created);
    setShowAddOfficeModal(false);
    setNewOfficeName('');
    setNewOfficeNumber('');
  };

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName || !newBranchCode) return;

    const created: Branch = {
      id: `branch-${Date.now()}`,
      name: newBranchName,
      code: newBranchCode,
      type: 'BRANCH',
      city: newBranchCity || 'الدوحة',
      address: newBranchAddress || 'شارع الأعمال',
      phone: newBranchPhone || '+974 4400 0000',
      managerName: newBranchManager || 'مدير الفرع',
      totalOfficesCount: 1,
    };

    onAddBranch(created);
    setShowAddBranchModal(false);
    setNewBranchName('');
    setNewBranchCode('');
  };

  // Stats
  const totalEmployees = employees.length;
  const presentEmployees = employees.filter((e) => e.attendanceStatus === 'PRESENT').length;
  const absentEmployees = employees.filter((e) => e.attendanceStatus === 'ABSENT').length;
  const attendanceRate = totalEmployees > 0 ? Math.round((presentEmployees / totalEmployees) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner & CEO Vision Summary */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-blue-600" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-700 mb-1">
              <Building2 className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                إدارة المكاتب الإدارية والفروع والهيكل الميداني
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              لوحة الرقابة الكاملة للمكاتب والموظفين (CEO Command Center)
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              تسمح هذه اللوحة للرئيس التنفيذي وصاحب الشركة بالإحاطة الكاملة بجميع الفروع والمكاتب الإدارية، وعرض الموظفين داخل كل مكتب مع حالة الحضور المباشرة (نقطة خضراء/حمراء) والبدلاء المعتمدين.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAddOfficeModal(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة مكتب جديد</span>
            </button>
            <button
              onClick={() => setShowAddBranchModal(true)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Building className="w-4 h-4" />
              <span>إضافة فرع جديد</span>
            </button>
          </div>
        </div>

        {/* Quick Branch & Company-wide KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium block">الفروع والمقرات</span>
            <span className="text-lg font-extrabold text-slate-900">{branches.length} فروع</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium block">إجمالي المكاتب الإدارية</span>
            <span className="text-lg font-extrabold text-slate-900">{offices.length} مكتب مفعل</span>
          </div>
          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] text-emerald-800 font-medium block">الحاضرون الآن بالمكاتب</span>
            </div>
            <span className="text-lg font-extrabold text-emerald-900">{presentEmployees} موظف</span>
          </div>
          <div className="bg-rose-50 p-3 rounded-xl border border-rose-200">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-[11px] text-rose-800 font-medium block">الغائبون (بدلاء مفعلون)</span>
            </div>
            <span className="text-lg font-extrabold text-rose-900">{absentEmployees} موظف</span>
          </div>
        </div>
      </div>

      {/* Branch Selector Tabs & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        {/* Branch Chips */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedBranchId('ALL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedBranchId === 'ALL'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            كافة المقرات والفروع ({offices.length})
          </button>
          {branches.map((b) => {
            const branchOfficesCount = offices.filter((o) => o.branchId === b.id).length;
            return (
              <button
                key={b.id}
                onClick={() => setSelectedBranchId(b.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  selectedBranchId === b.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{b.name}</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20">
                  {branchOfficesCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث باسم المكتب أو رقم المكتب..."
            className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
          />
        </div>
      </div>

      {/* Offices Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredOffices.map((office) => {
          // Get staff assigned to this office
          const officeStaff = employees.filter((e) => e.officeId === office.id);
          const presentCount = officeStaff.filter((e) => e.attendanceStatus === 'PRESENT').length;

          return (
            <div
              key={office.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Office Header */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md">
                        {office.officeNumber}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500">
                        {office.floor}
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        {office.branchName}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {office.officeName}
                    </h3>
                  </div>

                  <div className="text-left">
                    <span className="text-[11px] font-bold text-slate-700 block">
                      الطاقة: {officeStaff.length} / {office.capacity}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      حضور: {presentCount} حاضر
                    </span>
                  </div>
                </div>

                {/* Description & Office Manager */}
                <div className="text-xs text-slate-600 my-2">
                  <p>{office.description}</p>
                  <p className="mt-1 font-semibold text-slate-700">
                    مسؤول المكتب: <span className="text-blue-700">{office.managerName}</span>
                  </p>
                </div>

                {/* Staff List Inside This Office */}
                <div className="mt-3 space-y-2">
                  <span className="text-[11px] font-bold text-slate-800 block mb-1">
                    الموظفون الشاغلون لمكتب ({office.officeName}):
                  </span>

                  {officeStaff.length === 0 ? (
                    <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs text-center">
                      لا يوجد موظفون مخصصون لهذا المكتب حالياً.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {officeStaff.map((emp) => {
                        const isPresent = emp.attendanceStatus === 'PRESENT';
                        const isAbsent = emp.attendanceStatus === 'ABSENT';
                        const isRemote = emp.attendanceStatus === 'REMOTE';
                        const isOnLeave = emp.attendanceStatus === 'ON_LEAVE';

                        return (
                          <div
                            key={emp.id}
                            className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs hover:bg-slate-100 transition-all"
                          >
                            <div className="flex items-center gap-2.5">
                              {/* Presence Dot indicator (Green for Present, Red for Absent, Blue for Remote, Amber for Leave) */}
                              <div className="relative flex items-center justify-center">
                                {isPresent && (
                                  <>
                                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-xs" />
                                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping absolute opacity-75" />
                                  </>
                                )}
                                {isAbsent && (
                                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block shadow-xs" />
                                )}
                                {isRemote && (
                                  <span className="w-3 h-3 rounded-full bg-blue-500 inline-block shadow-xs" />
                                )}
                                {isOnLeave && (
                                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-xs" />
                                )}
                              </div>

                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-slate-900">{emp.name}</span>
                                  <span className="text-[10px] text-slate-500 font-normal">
                                    ({emp.jobTitle})
                                  </span>
                                </div>
                                <div className="text-[10px] text-slate-500">
                                  {isPresent && (
                                    <span className="text-emerald-700 font-semibold">
                                      حاضر بمكتبه (توقيع: {emp.checkInTime || '08:00'})
                                    </span>
                                  )}
                                  {isAbsent && (
                                    <span className="text-rose-700 font-semibold">
                                      غائب - البديل: {emp.substituteName || 'معتمد'}
                                    </span>
                                  )}
                                  {isRemote && (
                                    <span className="text-blue-700 font-semibold">
                                      عمل عن بعد - متصل بالمنظومة
                                    </span>
                                  )}
                                  {isOnLeave && (
                                    <span className="text-amber-700 font-semibold">
                                      إجازة رسمية - البديل القائم: {emp.substituteName}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Attendance Action Toggle Buttons */}
                            <div className="flex items-center gap-1">
                              {!isPresent ? (
                                <button
                                  onClick={() => onToggleAttendance(emp.id, 'PRESENT')}
                                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                                  title="توقيع الحضور وتفعيل النقطة الخضراء"
                                >
                                  توقيع حضور
                                </button>
                              ) : (
                                <button
                                  onClick={() => onToggleAttendance(emp.id, 'ABSENT')}
                                  className="px-2 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                                  title="تسجيل الغياب وتفعيل النقطة الحمراء"
                                >
                                  تسجيل غياب
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Office Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>القسم التشغيلي: {office.department}</span>
                <span className="font-semibold text-slate-700">
                  سعة المكتب: {office.capacity} أشخاص
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Office Modal */}
      {showAddOfficeModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">إضافة مكتب إداري جديد</h3>
              <button
                onClick={() => setShowAddOfficeModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOffice} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">اسم المكتب الإداري:</label>
                <input
                  type="text"
                  required
                  value={newOfficeName}
                  onChange={(e) => setNewOfficeName(e.target.value)}
                  placeholder="مثال: مكتب التدقيق المالي والإجراءات"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">رمز المكتب:</label>
                  <input
                    type="text"
                    required
                    value={newOfficeNumber}
                    onChange={(e) => setNewOfficeNumber(e.target.value)}
                    placeholder="HQ-105"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">المقر / الفرع:</label>
                  <select
                    value={newOfficeBranchId}
                    onChange={(e) => setNewOfficeBranchId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">الطابق / الدور:</label>
                  <input
                    type="text"
                    value={newOfficeFloor}
                    onChange={(e) => setNewOfficeFloor(e.target.value)}
                    placeholder="الطابق 11"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">السعة الاستيعابية:</label>
                  <input
                    type="number"
                    value={newOfficeCapacity}
                    onChange={(e) => setNewOfficeCapacity(Number(e.target.value))}
                    min={1}
                    max={50}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">القسم التشغيلي:</label>
                <input
                  type="text"
                  value={newOfficeDepartment}
                  onChange={(e) => setNewOfficeDepartment(e.target.value)}
                  placeholder="المالية / المشتريات / تقنية المعلومات"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">مسؤول المكتب:</label>
                <input
                  type="text"
                  value={newOfficeManager}
                  onChange={(e) => setNewOfficeManager(e.target.value)}
                  placeholder="اسم مسؤول المكتب"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddOfficeModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 cursor-pointer"
                >
                  حفظ المكتب جديد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Branch Modal */}
      {showAddBranchModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">إضافة فرع / مقر شركة جديد</h3>
              <button
                onClick={() => setShowAddBranchModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBranch} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">اسم الفرع / المقر:</label>
                <input
                  type="text"
                  required
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  placeholder="مثال: فرع الوكرة - مركز الأعمال"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">كود الفرع:</label>
                  <input
                    type="text"
                    required
                    value={newBranchCode}
                    onChange={(e) => setNewBranchCode(e.target.value)}
                    placeholder="BR-WKR"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">المدينة:</label>
                  <input
                    type="text"
                    value={newBranchCity}
                    onChange={(e) => setNewBranchCity(e.target.value)}
                    placeholder="الدوحة / الوكرة / الخور"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">العنوان التفصيلي:</label>
                <input
                  type="text"
                  value={newBranchAddress}
                  onChange={(e) => setNewBranchAddress(e.target.value)}
                  placeholder="شارع التجارة - برج الخليج"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">هاتف التواصل:</label>
                  <input
                    type="text"
                    value={newBranchPhone}
                    onChange={(e) => setNewBranchPhone(e.target.value)}
                    placeholder="+974 4400 5500"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">مدير الفرع:</label>
                  <input
                    type="text"
                    value={newBranchManager}
                    onChange={(e) => setNewBranchManager(e.target.value)}
                    placeholder="اسم مدير الفرع"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddBranchModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 cursor-pointer"
                >
                  إضافة الفرع
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
