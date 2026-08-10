import React, { useState } from 'react';
import {
  EmployeeStaff,
  AdminOffice,
  Branch,
  AttendanceStatus,
} from '../../types';
import {
  UserCheck,
  UserX,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Users,
  Plus,
  Radio,
  MapPin,
  ShieldCheck,
  Building,
  Sparkles,
} from 'lucide-react';

interface AttendanceManagementProps {
  employees: EmployeeStaff[];
  offices: AdminOffice[];
  branches: Branch[];
  onToggleAttendance: (employeeId: string, status: AttendanceStatus) => void;
  onAddEmployee: (employee: EmployeeStaff) => void;
}

export const AttendanceManagement: React.FC<AttendanceManagementProps> = ({
  employees,
  offices,
  branches,
  onToggleAttendance,
  onAddEmployee,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranchId, setSelectedBranchId] = useState('ALL');
  const [selectedOfficeId, setSelectedOfficeId] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | AttendanceStatus>('ALL');
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);

  // New Employee State
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpJob, setNewEmpJob] = useState('');
  const [newEmpDept, setNewEmpDept] = useState('العمليات');
  const [newEmpOfficeId, setNewEmpOfficeId] = useState(offices[0]?.id || '');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpPhone, setNewEmpPhone] = useState('');
  const [newEmpSub, setNewEmpSub] = useState('');

  // Quick attendance check-in for current active session
  const [selectedQuickEmpId, setSelectedQuickEmpId] = useState<string>(employees[0]?.id || '');

  // Filtered employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesBranch = selectedBranchId === 'ALL' || emp.branchId === selectedBranchId;
    const matchesOffice = selectedOfficeId === 'ALL' || emp.officeId === selectedOfficeId;
    const matchesStatus = statusFilter === 'ALL' || emp.attendanceStatus === statusFilter;

    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.officeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.branchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesBranch && matchesOffice && matchesStatus && matchesSearch;
  });

  // Stats
  const totalCount = employees.length;
  const presentCount = employees.filter((e) => e.attendanceStatus === 'PRESENT').length;
  const absentCount = employees.filter((e) => e.attendanceStatus === 'ABSENT').length;
  const remoteCount = employees.filter((e) => e.attendanceStatus === 'REMOTE').length;
  const leaveCount = employees.filter((e) => e.attendanceStatus === 'ON_LEAVE').length;
  const attendancePercentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName || !newEmpJob) return;

    const officeObj = offices.find((o) => o.id === newEmpOfficeId);
    const branchObj = branches.find((b) => b.id === officeObj?.branchId);

    const created: EmployeeStaff = {
      id: `emp-${Date.now()}`,
      employeeCode: `EMP-${1000 + employees.length + 1}`,
      name: newEmpName,
      jobTitle: newEmpJob,
      department: newEmpDept,
      branchId: branchObj?.id || 'branch-hq',
      branchName: branchObj?.name || 'المقر الرئيسي',
      officeId: officeObj?.id || 'off-hq-101',
      officeName: officeObj?.officeName || 'مكتب الإدارة العليا',
      officeNumber: officeObj?.officeNumber || 'HQ-101',
      email: newEmpEmail || `${newEmpName.split(' ')[0]}@company.qa`,
      phone: newEmpPhone || '+974 5500 0000',
      roleLevel: 'OPERATOR',
      attendanceStatus: 'PRESENT',
      checkInTime: new Date().toLocaleTimeString('ar-QA', { hour: '2-digit', minute: '2-digit' }),
      substituteName: newEmpSub || 'مدير القسم',
    };

    onAddEmployee(created);
    setShowAddEmployeeModal(false);
    setNewEmpName('');
    setNewEmpJob('');
  };

  const currentQuickEmp = employees.find((e) => e.id === selectedQuickEmpId);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 mb-1">
              <UserCheck className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                نظام حضور الموظفين والمراقبة الميدانية المباشرة
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              لوحة تحليل المكاتب الإدارية والحضور الحقيقي (Live Attendance Grid)
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              عندما يوقع الموظف الحضور في المنظومة، يظهر تلقائياً بنقطة خضراء مع اسمه واسم مكتبه الإداري فرع الشركة، بينما يظهر الموظف الغائب بنقطة حمراء مع البديل القائم بالعمل لضمان عدم توقف الخدمات.
            </p>
          </div>

          <button
            onClick={() => setShowAddEmployeeModal(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة موظف جديد وتخصيص مكتبه</span>
          </button>
        </div>

        {/* Attendance Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-5 pt-4 border-t border-slate-100">
          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-emerald-800 font-bold">الحاضرون بالمكاتب</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <span className="text-lg font-extrabold text-emerald-900">{presentCount} موظف</span>
            <span className="text-[10px] text-emerald-700 block font-medium">نقاط خضراء 🟢</span>
          </div>

          <div className="bg-rose-50 p-3 rounded-xl border border-rose-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-rose-800 font-bold">الغائبون (بديل فعال)</span>
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            </div>
            <span className="text-lg font-extrabold text-rose-900">{absentCount} موظف</span>
            <span className="text-[10px] text-rose-700 block font-medium">نقاط حمراء 🔴</span>
          </div>

          <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-blue-800 font-bold">عمل عن بعد</span>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            </div>
            <span className="text-lg font-extrabold text-blue-900">{remoteCount} موظف</span>
            <span className="text-[10px] text-blue-700 block font-medium">نقاط زرقاء 🔵</span>
          </div>

          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-amber-800 font-bold">إجازات معتمدة</span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            </div>
            <span className="text-lg font-extrabold text-amber-900">{leaveCount} موظف</span>
            <span className="text-[10px] text-amber-700 block font-medium">نقاط برتقالية 🟠</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-slate-500 font-medium block">نسبة الحضور اليومية</span>
            <span className="text-lg font-extrabold text-slate-900">{attendancePercentage}%</span>
            <span className="text-[10px] text-slate-500 block font-medium">الكادر الكلي: {totalCount}</span>
          </div>
        </div>
      </div>

      {/* Quick Self / Manager Attendance Sign-in Simulator Bar */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-2xl p-4 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600/30 border border-blue-400/30 rounded-xl text-blue-300">
            <Clock className="w-6 h-6 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">توقيع الحضور المباشر السريع (Self / Manager Check-In)</h3>
            <p className="text-xs text-slate-300">
              اختر أي موظف وقم بتسجيل حضوره أو غيابه لمشاهدة تحديث الخريطة الحية فوراً:
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedQuickEmpId}
            onChange={(e) => setSelectedQuickEmpId(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} - ({e.officeName}) - [{e.attendanceStatus === 'PRESENT' ? '🟢 حاضر' : '🔴 غائب'}]
              </option>
            ))}
          </select>

          {currentQuickEmp?.attendanceStatus !== 'PRESENT' ? (
            <button
              onClick={() => onToggleAttendance(selectedQuickEmpId, 'PRESENT')}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>توقيع الحضور الآن 🟢</span>
            </button>
          ) : (
            <button
              onClick={() => onToggleAttendance(selectedQuickEmpId, 'ABSENT')}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
            >
              <XCircle className="w-4 h-4" />
              <span>تسجيل الانصراف/الغياب 🔴</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Status Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              الكل ({totalCount})
            </button>
            <button
              onClick={() => setStatusFilter('PRESENT')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === 'PRESENT'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>الحاضرون ({presentCount})</span>
            </button>
            <button
              onClick={() => setStatusFilter('ABSENT')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === 'ABSENT'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>الغائبون ({absentCount})</span>
            </button>
            <button
              onClick={() => setStatusFilter('REMOTE')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === 'REMOTE'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>عن بعد ({remoteCount})</span>
            </button>
            <button
              onClick={() => setStatusFilter('ON_LEAVE')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === 'ON_LEAVE'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>إجازات ({leaveCount})</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث باسم الموظف، المسمى، أو المكتب..."
              className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          </div>
        </div>

        {/* Branch & Office Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-bold">تصفية حسب المقر:</span>
            <select
              value={selectedBranchId}
              onChange={(e) => {
                setSelectedBranchId(e.target.value);
                setSelectedOfficeId('ALL');
              }}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium"
            >
              <option value="ALL">جميع الفروع</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-bold">تصفية حسب المكتب:</span>
            <select
              value={selectedOfficeId}
              onChange={(e) => setSelectedOfficeId(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium"
            >
              <option value="ALL">جميع المكاتب الإدارية</option>
              {offices
                .filter((o) => selectedBranchId === 'ALL' || o.branchId === selectedBranchId)
                .map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.officeName} ({o.officeNumber})
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Employee Attendance Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((emp) => {
          const isPresent = emp.attendanceStatus === 'PRESENT';
          const isAbsent = emp.attendanceStatus === 'ABSENT';
          const isRemote = emp.attendanceStatus === 'REMOTE';
          const isOnLeave = emp.attendanceStatus === 'ON_LEAVE';

          return (
            <div
              key={emp.id}
              className={`bg-white border rounded-2xl p-4 shadow-xs transition-all relative overflow-hidden flex flex-col justify-between space-y-3 ${
                isPresent
                  ? 'border-emerald-200 hover:border-emerald-300'
                  : isAbsent
                  ? 'border-rose-200 hover:border-rose-300 bg-rose-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Presence Banner */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    {isPresent && (
                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 inline-block shadow-xs" />
                    )}
                    {isAbsent && (
                      <span className="w-3.5 h-3.5 rounded-full bg-rose-500 inline-block shadow-xs" />
                    )}
                    {isRemote && (
                      <span className="w-3.5 h-3.5 rounded-full bg-blue-500 inline-block shadow-xs" />
                    )}
                    {isOnLeave && (
                      <span className="w-3.5 h-3.5 rounded-full bg-amber-500 inline-block shadow-xs" />
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{emp.name}</h3>
                    <p className="text-[11px] text-slate-500 font-medium">{emp.jobTitle}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    isPresent
                      ? 'bg-emerald-100 text-emerald-800'
                      : isAbsent
                      ? 'bg-rose-100 text-rose-800'
                      : isRemote
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {isPresent && 'حاضر 🟢'}
                  {isAbsent && 'غائب 🔴'}
                  {isRemote && 'عمل عن بعد 🔵'}
                  {isOnLeave && 'إجازة 🟠'}
                </span>
              </div>

              {/* Office & Location Detail */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="font-semibold">المكتب:</span>
                  <span className="font-bold text-blue-800">{emp.officeName}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span>المقر / الفرع:</span>
                  <span>{emp.branchName} ({emp.officeNumber})</span>
                </div>
                {isPresent && (
                  <div className="flex items-center justify-between text-emerald-700 text-[11px] pt-1 border-t border-slate-200 font-medium">
                    <span>توقيع الحضور:</span>
                    <span>{emp.checkInTime || '08:00 صباحاً'}</span>
                  </div>
                )}
                {isAbsent && (
                  <div className="flex items-center justify-between text-rose-700 text-[11px] pt-1 border-t border-slate-200 font-medium">
                    <span>البديل المعين:</span>
                    <span>{emp.substituteName || 'مدير القسم'}</span>
                  </div>
                )}
              </div>

              {/* Attendance Quick Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1 text-xs">
                <div className="flex items-center gap-1 w-full">
                  {!isPresent ? (
                    <button
                      onClick={() => onToggleAttendance(emp.id, 'PRESENT')}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold cursor-pointer transition-all text-center"
                    >
                      توقيع حضور 🟢
                    </button>
                  ) : (
                    <button
                      onClick={() => onToggleAttendance(emp.id, 'ABSENT')}
                      className="flex-1 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg text-[11px] font-bold cursor-pointer transition-all text-center"
                    >
                      تسجيل غياب 🔴
                    </button>
                  )}

                  <button
                    onClick={() => onToggleAttendance(emp.id, 'REMOTE')}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold cursor-pointer transition-all"
                    title="تحويل إلى عمل عن بعد"
                  >
                    عن بعد
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Employee Modal */}
      {showAddEmployeeModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">إضافة موظف جديد وتخصيص مكتبه</h3>
              <button
                onClick={() => setShowAddEmployeeModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">اسم الموظف الثلاثي:</label>
                <input
                  type="text"
                  required
                  value={newEmpName}
                  onChange={(e) => setNewEmpName(e.target.value)}
                  placeholder="مثال: سلمان بن حمد الكواري"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">المسمى الوظيفي:</label>
                  <input
                    type="text"
                    required
                    value={newEmpJob}
                    onChange={(e) => setNewEmpJob(e.target.value)}
                    placeholder="مثال: أخصائي تدقيق وتخطيط"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">القسم:</label>
                  <input
                    type="text"
                    value={newEmpDept}
                    onChange={(e) => setNewEmpDept(e.target.value)}
                    placeholder="المالية / المشتريات / IT"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">المكتب الإداري المخصص:</label>
                <select
                  value={newEmpOfficeId}
                  onChange={(e) => setNewEmpOfficeId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                >
                  {offices.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.officeName} - ({o.branchName}) [{o.officeNumber}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">البريد الإلكتروني:</label>
                  <input
                    type="email"
                    value={newEmpEmail}
                    onChange={(e) => setNewEmpEmail(e.target.value)}
                    placeholder="s.alkuwari@company.qa"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">رقم الهاتف:</label>
                  <input
                    type="text"
                    value={newEmpPhone}
                    onChange={(e) => setNewEmpPhone(e.target.value)}
                    placeholder="+974 5511 0000"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">اسم البديل القائم بالعمل عند الغياب:</label>
                <input
                  type="text"
                  value={newEmpSub}
                  onChange={(e) => setNewEmpSub(e.target.value)}
                  placeholder="اسم الموظف البديل المعتمد"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddEmployeeModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 cursor-pointer"
                >
                  إضافة الموظف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
