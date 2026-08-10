import React, { useState, useEffect } from 'react';
import {
  EmployeeRole,
  SkillMatrixItem,
  StandardOperatingProcedure,
  WorkflowRequest,
  CorporateSecret,
  SystemDRMetrics,
  ContinuityDrill,
  AuditLogEntry,
  OwnerSuccessionFramework,
  Branch,
  AdminOffice,
  EmployeeStaff,
  AttendanceStatus,
} from './types';
import {
  INITIAL_ROLES,
  INITIAL_SKILL_MATRIX,
  INITIAL_SOPS,
  INITIAL_WORKFLOWS,
  INITIAL_SECRETS,
  INITIAL_SYSTEM_DR_METRICS,
  INITIAL_DRILLS,
  INITIAL_AUDIT_LOGS,
  INITIAL_OWNER_SUCCESSION,
  INITIAL_BRANCHES,
  INITIAL_OFFICES,
  INITIAL_EMPLOYEES,
} from './data/initialData';

import { Header } from './components/Header';
import { Sidebar, TabType } from './components/Sidebar';
import { ContinuityDashboard } from './components/Dashboard/ContinuityDashboard';
import { RoleMatrix } from './components/Roles/RoleMatrix';
import { SOPKnowledgeBase } from './components/SOP/SOPKnowledgeBase';
import { WorkflowEngine } from './components/Workflows/WorkflowEngine';
import { CorporateVault } from './components/Vault/CorporateVault';
import { OwnerSuccession } from './components/Succession/OwnerSuccession';
import { DisasterRecoveryPanel } from './components/Recovery/DisasterRecoveryPanel';
import { AuditLogView } from './components/Audit/AuditLogView';
import { EmergencyModal } from './components/Modals/EmergencyModal';
import { OfficeManagement } from './components/Offices/OfficeManagement';
import { AttendanceManagement } from './components/Attendance/AttendanceManagement';

export default function App() {
  // State initialization with localStorage persistence fallback
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [activeRole, setActiveRole] = useState<string>('الرئيس التنفيذي وصاحب الشركة');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [roles, setRoles] = useState<EmployeeRole[]>(() => {
    const saved = localStorage.getItem('continuity_roles');
    return saved ? JSON.parse(saved) : INITIAL_ROLES;
  });

  const [skillMatrix, setSkillMatrix] = useState<SkillMatrixItem[]>(() => {
    const saved = localStorage.getItem('continuity_skills');
    return saved ? JSON.parse(saved) : INITIAL_SKILL_MATRIX;
  });

  const [sops, setSops] = useState<StandardOperatingProcedure[]>(() => {
    const saved = localStorage.getItem('continuity_sops');
    return saved ? JSON.parse(saved) : INITIAL_SOPS;
  });

  const [workflows, setWorkflows] = useState<WorkflowRequest[]>(() => {
    const saved = localStorage.getItem('continuity_workflows');
    return saved ? JSON.parse(saved) : INITIAL_WORKFLOWS;
  });

  const [secrets, setSecrets] = useState<CorporateSecret[]>(() => {
    const saved = localStorage.getItem('continuity_secrets');
    return saved ? JSON.parse(saved) : INITIAL_SECRETS;
  });

  const [drMetrics, setDrMetrics] = useState<SystemDRMetrics[]>(() => {
    const saved = localStorage.getItem('continuity_dr');
    return saved ? JSON.parse(saved) : INITIAL_SYSTEM_DR_METRICS;
  });

  const [drills, setDrills] = useState<ContinuityDrill[]>(() => {
    const saved = localStorage.getItem('continuity_drills');
    return saved ? JSON.parse(saved) : INITIAL_DRILLS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('continuity_audit');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [ownerSuccession, setOwnerSuccession] = useState<OwnerSuccessionFramework>(() => {
    const saved = localStorage.getItem('continuity_succession');
    return saved ? JSON.parse(saved) : INITIAL_OWNER_SUCCESSION;
  });

  const [branches, setBranches] = useState<Branch[]>(() => {
    const saved = localStorage.getItem('continuity_branches');
    return saved ? JSON.parse(saved) : INITIAL_BRANCHES;
  });

  const [offices, setOffices] = useState<AdminOffice[]>(() => {
    const saved = localStorage.getItem('continuity_offices');
    return saved ? JSON.parse(saved) : INITIAL_OFFICES;
  });

  const [employees, setEmployees] = useState<EmployeeStaff[]>(() => {
    const saved = localStorage.getItem('continuity_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  // Emergency Modal
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('continuity_roles', JSON.stringify(roles));
  }, [roles]);

  useEffect(() => {
    localStorage.setItem('continuity_skills', JSON.stringify(skillMatrix));
  }, [skillMatrix]);

  useEffect(() => {
    localStorage.setItem('continuity_sops', JSON.stringify(sops));
  }, [sops]);

  useEffect(() => {
    localStorage.setItem('continuity_workflows', JSON.stringify(workflows));
  }, [workflows]);

  useEffect(() => {
    localStorage.setItem('continuity_secrets', JSON.stringify(secrets));
  }, [secrets]);

  useEffect(() => {
    localStorage.setItem('continuity_drills', JSON.stringify(drills));
  }, [drills]);

  useEffect(() => {
    localStorage.setItem('continuity_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('continuity_succession', JSON.stringify(ownerSuccession));
  }, [ownerSuccession]);

  useEffect(() => {
    localStorage.setItem('continuity_branches', JSON.stringify(branches));
  }, [branches]);

  useEffect(() => {
    localStorage.setItem('continuity_offices', JSON.stringify(offices));
  }, [offices]);

  useEffect(() => {
    localStorage.setItem('continuity_employees', JSON.stringify(employees));
  }, [employees]);

  // Compute Continuity Score
  const trainedRolesCount = roles.filter((r) => r.substituteTrainedStatus === 'FULLY_TRAINED').length;
  const trainedRatio = roles.length > 0 ? trainedRolesCount / roles.length : 1;
  const spofCount = skillMatrix.filter((sk) => sk.coverageHealth === 'CRITICAL').length;
  const spofPenalty = spofCount * 8;

  const baseScore = Math.round(trainedRatio * 85 + (sops.length > 2 ? 15 : 5) - spofPenalty);
  const continuityScore = Math.max(45, Math.min(100, baseScore));

  const addAuditEntry = (category: any, description: string) => {
    const newEntry: AuditLogEntry = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: activeRole,
      role: activeRole,
      actionCategory: category,
      description,
      ipAddress: '192.168.1.10',
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  // Handlers for data mutations
  const handleAddRole = (newRole: EmployeeRole) => {
    setRoles((prev) => [...prev, newRole]);
    addAuditEntry('ROLE_MODIFIED', `إضافة دور وظيفي جديد: ${newRole.jobTitle}`);
  };

  const handleUpdateRole = (updatedRole: EmployeeRole) => {
    setRoles((prev) => prev.map((r) => (r.id === updatedRole.id ? updatedRole : r)));
    addAuditEntry(
      'ROLE_MODIFIED',
      `تحديث بيانات البديل لـ ${updatedRole.jobTitle} إلى ${updatedRole.substituteHolderName}`
    );
  };

  const handleAddSkillItem = (item: SkillMatrixItem) => {
    setSkillMatrix((prev) => [...prev, item]);
    addAuditEntry('ROLE_MODIFIED', `تحديث مصفوفة المهارات للعملية: ${item.processName}`);
  };

  const handleAddSop = (newSop: StandardOperatingProcedure) => {
    setSops((prev) => [newSop, ...prev]);
    addAuditEntry('SOP_UPDATED', `إضافة دليل إجراءات قياسي جديد: ${newSop.title}`);
  };

  const handleUpdateSop = (updatedSop: StandardOperatingProcedure) => {
    setSops((prev) => prev.map((s) => (s.id === updatedSop.id ? updatedSop : s)));
    addAuditEntry('SOP_UPDATED', `تحديث دليل الإجراءات: ${updatedSop.title}`);
  };

  const handleAddWorkflowRequest = (req: WorkflowRequest) => {
    setWorkflows((prev) => [req, ...prev]);
    addAuditEntry('WORKFLOW_APPROVED', `إنشاء معاملة جديدة رقم ${req.referenceNumber}: ${req.title}`);
  };

  const handleApproveWorkflow = (id: string, actorName: string) => {
    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          return {
            ...w,
            status: 'APPROVED',
            timeline: [
              ...w.timeline,
              {
                timestamp: new Date().toISOString(),
                actor: actorName,
                action: 'اعتماد المعاملة بنجاح',
              },
            ],
          };
        }
        return w;
      })
    );
    addAuditEntry('WORKFLOW_APPROVED', `اعتماد المعاملة رقم ${id} بواسطة ${actorName}`);
  };

  const handleEscalateWorkflow = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          return {
            ...w,
            status: 'ESCALATED',
            isDelegatedToSubstitute: true,
            timeline: [
              ...w.timeline,
              {
                timestamp: new Date().toISOString(),
                actor: 'نظام الاستمرارية الآلي',
                action: `تصعيد الطلب تلقائياً إلى البديل (${w.substituteAssigneeRole})`,
              },
            ],
          };
        }
        return w;
      })
    );
    addAuditEntry('DELEGATION_ACTIVATED', `تصعيد المعاملة ${id} تلقائياً إلى البديل`);
  };

  const handleAddSecret = (newSecret: CorporateSecret) => {
    setSecrets((prev) => [newSecret, ...prev]);
    addAuditEntry('SECRET_ACCESSED', `إضافة أصل مشفر جديد بالخزينة: ${newSecret.title}`);
  };

  const handleAddDrill = (newDrill: ContinuityDrill) => {
    setDrills((prev) => [newDrill, ...prev]);
    addAuditEntry('DRILL_EXECUTED', `تنفيذ محاكاة طوارئ ميدانية: ${newDrill.drillTitle}`);
  };

  const handleAddBranch = (newBranch: Branch) => {
    setBranches((prev) => [newBranch, ...prev]);
    addAuditEntry('ORGANIZATION_UPDATED', `تم إنشاء فرع جديد: ${newBranch.name}`);
  };

  const handleAddOffice = (newOffice: AdminOffice) => {
    setOffices((prev) => [newOffice, ...prev]);
    addAuditEntry('ORGANIZATION_UPDATED', `تم إضافة مكتب جديد: ${newOffice.officeName}`);
  };

  const handleAddEmployee = (newEmployee: EmployeeStaff) => {
    setEmployees((prev) => [newEmployee, ...prev]);
    addAuditEntry('ORGANIZATION_UPDATED', `تم إضافة موظف جديد: ${newEmployee.name} وتخصيصه لـ ${newEmployee.officeName}`);
  };

  const handleToggleAttendance = (employeeId: string, status: AttendanceStatus) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === employeeId
          ? {
              ...emp,
              attendanceStatus: status,
              checkInTime:
                status === 'PRESENT'
                  ? new Date().toLocaleTimeString('ar-QA', { hour: '2-digit', minute: '2-digit' })
                  : emp.checkInTime,
            }
          : emp
      )
    );
    const emp = employees.find((e) => e.id === employeeId);
    if (emp) {
      addAuditEntry(
        'ORGANIZATION_UPDATED',
        `تغيير حالة حضور الموظف (${emp.name}) في مكتب (${emp.officeName}) إلى: ${status}`
      );
    }
  };

  const pendingApprovalsCount = workflows.filter((w) => w.status === 'PENDING').length;

  return (
    <div dir="rtl" className="min-h-screen bg-[#f1f5f9] text-slate-800 font-sans flex flex-col antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Fixed Navigation Header */}
      <Header
        continuityScore={continuityScore}
        activeRole={activeRole}
        onSelectRole={setActiveRole}
        availableRoles={roles}
        onTriggerEmergencyModal={() => setIsEmergencyModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Body: Sidebar + Dynamic Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row gap-0">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingApprovalsCount={pendingApprovalsCount}
          spofCount={spofCount}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <ContinuityDashboard
              roles={roles}
              skillMatrix={skillMatrix}
              sops={sops}
              workflows={workflows}
              drMetrics={drMetrics}
              drills={drills}
              score={continuityScore}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'offices' && (
            <OfficeManagement
              branches={branches}
              offices={offices}
              employees={employees}
              onAddBranch={handleAddBranch}
              onAddOffice={handleAddOffice}
              onToggleAttendance={handleToggleAttendance}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceManagement
              employees={employees}
              offices={offices}
              branches={branches}
              onToggleAttendance={handleToggleAttendance}
              onAddEmployee={handleAddEmployee}
            />
          )}

          {activeTab === 'roles' && (
            <RoleMatrix
              roles={roles}
              skillMatrix={skillMatrix}
              onAddRole={handleAddRole}
              onUpdateRole={handleUpdateRole}
              onAddSkillItem={handleAddSkillItem}
            />
          )}

          {activeTab === 'sops' && (
            <SOPKnowledgeBase
              sops={sops}
              onAddSop={handleAddSop}
              onUpdateSop={handleUpdateSop}
            />
          )}

          {activeTab === 'workflows' && (
            <WorkflowEngine
              workflows={workflows}
              onApproveWorkflow={handleApproveWorkflow}
              onEscalateWorkflow={handleEscalateWorkflow}
              onAddWorkflowRequest={handleAddWorkflowRequest}
            />
          )}

          {activeTab === 'vault' && (
            <CorporateVault
              secrets={secrets}
              activeRole={activeRole}
              onAddSecret={handleAddSecret}
            />
          )}

          {activeTab === 'succession' && (
            <OwnerSuccession
              succession={ownerSuccession}
              onUpdateFramework={setOwnerSuccession}
            />
          )}

          {activeTab === 'recovery' && (
            <DisasterRecoveryPanel
              drMetrics={drMetrics}
              drills={drills}
              onAddDrill={handleAddDrill}
              onUpdateDrMetric={(m) =>
                setDrMetrics((prev) => prev.map((item) => (item.id === m.id ? m : item)))
              }
            />
          )}

          {activeTab === 'audit' && <AuditLogView logs={auditLogs} />}
        </main>
      </div>

      {/* Emergency Simulation Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        onRunEmergencyScenario={(scenario, plan) => {
          addAuditEntry('DRILL_EXECUTED', `تشغيل محاكاة طوارئ بالذكاء الاصطناعي: ${scenario}`);
        }}
      />
    </div>
  );
}
