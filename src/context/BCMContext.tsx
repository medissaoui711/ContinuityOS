import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  EmployeeRole,
  StandardOperatingProcedure,
  AdminOffice,
  Branch,
  EmployeeStaff,
  AuditLogEntry,
  WorkflowRequest,
  CorporateSecret,
} from '../types';
import {
  INITIAL_ROLES,
  INITIAL_SOPS,
  INITIAL_OFFICES,
  INITIAL_BRANCHES,
  INITIAL_EMPLOYEES,
  INITIAL_AUDIT_LOGS,
  INITIAL_WORKFLOWS,
  INITIAL_SECRETS,
} from '../data/initialData';
import { TabType } from '../components/Sidebar';

interface BCMContextType {
  // Navigation & UI State
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  mobileOsSkin: 'ios' | 'android';

  // Domain Entities State
  roles: EmployeeRole[];
  sops: StandardOperatingProcedure[];
  offices: AdminOffice[];
  branches: Branch[];
  employees: EmployeeStaff[];
  auditLogs: AuditLogEntry[];
  workflows: WorkflowRequest[];
  secrets: CorporateSecret[];

  // Emergency Mode State
  isEmergencyActive: boolean;
  emergencyReason: string;
  showEmergencyModal: boolean;
  setShowEmergencyModal: (show: boolean) => void;

  // Computed Metrics
  pendingApprovalsCount: number;
  spofCount: number;

  // Action Handlers
  handleAddRole: (role: EmployeeRole) => void;
  handleUpdateRole: (role: EmployeeRole) => void;
  handleAddSOP: (sop: StandardOperatingProcedure) => void;
  handleUpdateSOP: (sop: StandardOperatingProcedure) => void;
  handleToggleSOPActive: (sopId: string) => void;
  handleAddOffice: (office: AdminOffice) => void;
  handleUpdateOffice: (office: AdminOffice) => void;
  handleAddBranch: (branch: Branch) => void;
  handleUpdateBranch: (branch: Branch) => void;
  handleAddEmployee: (employee: EmployeeStaff) => void;
  handleToggleAttendance: (employeeId: string, newStatus: EmployeeStaff['attendanceStatus']) => void;
  handleApproveWorkflow: (id: string, actorName: string) => void;
  handleEscalateWorkflow: (id: string) => void;
  handleAddWorkflowRequest: (req: WorkflowRequest) => void;
  handleAddSecret: (secret: CorporateSecret) => void;
  handleActivateEmergency: (reason: string) => void;
  handleDeactivateEmergency: () => void;
  addAuditLog: (action: string, category: AuditLogEntry['actionCategory'], details: string) => void;
}

const BCMContext = createContext<BCMContextType | undefined>(undefined);

export const BCMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('bcm_sidebar_collapsed') === 'true';
  });
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [mobileOsSkin] = useState<'ios' | 'android'>(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
      if (/android/i.test(ua)) {
        return 'android';
      }
    }
    return 'ios';
  });

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('bcm_sidebar_collapsed', String(next));
      return next;
    });
  };

  // Roles State
  const [roles, setRoles] = useState<EmployeeRole[]>(() => {
    const saved = localStorage.getItem('bcm_roles');
    return saved ? JSON.parse(saved) : INITIAL_ROLES;
  });

  // SOPs State
  const [sops, setSops] = useState<StandardOperatingProcedure[]>(() => {
    const saved = localStorage.getItem('bcm_sops');
    return saved ? JSON.parse(saved) : INITIAL_SOPS;
  });

  // Offices State
  const [offices, setOffices] = useState<AdminOffice[]>(() => {
    const saved = localStorage.getItem('bcm_offices');
    return saved ? JSON.parse(saved) : INITIAL_OFFICES;
  });

  // Branches State
  const [branches, setBranches] = useState<Branch[]>(() => {
    const saved = localStorage.getItem('bcm_branches');
    return saved ? JSON.parse(saved) : INITIAL_BRANCHES;
  });

  // Employees State
  const [employees, setEmployees] = useState<EmployeeStaff[]>(() => {
    const saved = localStorage.getItem('bcm_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('bcm_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Workflows State
  const [workflows, setWorkflows] = useState<WorkflowRequest[]>(() => {
    const saved = localStorage.getItem('bcm_workflows');
    return saved ? JSON.parse(saved) : INITIAL_WORKFLOWS;
  });

  // Secrets State
  const [secrets, setSecrets] = useState<CorporateSecret[]>(() => {
    const saved = localStorage.getItem('bcm_secrets');
    return saved ? JSON.parse(saved) : INITIAL_SECRETS;
  });

  // Emergency Mode State
  const [isEmergencyActive, setIsEmergencyActive] = useState<boolean>(() => {
    return localStorage.getItem('bcm_emergency_active') === 'true';
  });
  const [emergencyReason, setEmergencyReason] = useState<string>(() => {
    return localStorage.getItem('bcm_emergency_reason') || '';
  });
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('bcm_roles', JSON.stringify(roles));
  }, [roles]);

  useEffect(() => {
    localStorage.setItem('bcm_sops', JSON.stringify(sops));
  }, [sops]);

  useEffect(() => {
    localStorage.setItem('bcm_offices', JSON.stringify(offices));
  }, [offices]);

  useEffect(() => {
    localStorage.setItem('bcm_branches', JSON.stringify(branches));
  }, [branches]);

  useEffect(() => {
    localStorage.setItem('bcm_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('bcm_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('bcm_workflows', JSON.stringify(workflows));
  }, [workflows]);

  useEffect(() => {
    localStorage.setItem('bcm_secrets', JSON.stringify(secrets));
  }, [secrets]);

  useEffect(() => {
    localStorage.setItem('bcm_emergency_active', String(isEmergencyActive));
    localStorage.setItem('bcm_emergency_reason', emergencyReason);
  }, [isEmergencyActive, emergencyReason]);

  // Helper: Add Audit Log
  const addAuditLog = (action: string, category: AuditLogEntry['actionCategory'], details: string) => {
    const newLog: AuditLogEntry = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toLocaleString('ar-EG', {
        dateStyle: 'short',
        timeStyle: 'medium',
      }),
      actor: 'الرئيس التنفيذي (CEO)',
      role: 'OWNER',
      actionCategory: category,
      description: `${action}: ${details}`,
      ipAddress: '192.168.1.50',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Handlers
  const handleAddRole = (newRole: EmployeeRole) => {
    setRoles((prev) => [newRole, ...prev]);
    addAuditLog('إضافة منصب قيادي', 'ROLE_MODIFIED', `تم تعيين منصب جديد: ${newRole.jobTitle}`);
  };

  const handleUpdateRole = (updatedRole: EmployeeRole) => {
    setRoles((prev) => prev.map((r) => (r.id === updatedRole.id ? updatedRole : r)));
    addAuditLog('تحديث منصب قيادي', 'ROLE_MODIFIED', `تم تحديث بيانات منصب: ${updatedRole.jobTitle}`);
  };

  const handleAddSOP = (newSOP: StandardOperatingProcedure) => {
    setSops((prev) => [newSOP, ...prev]);
    addAuditLog('إضافة إجراء SOP', 'SOP_UPDATED', `تم إنشاء إجراء جديد: ${newSOP.title}`);
  };

  const handleUpdateSOP = (updatedSOP: StandardOperatingProcedure) => {
    setSops((prev) => prev.map((s) => (s.id === updatedSOP.id ? updatedSOP : s)));
    addAuditLog('تحديث إجراء SOP', 'SOP_UPDATED', `تم تحديث بيانات الإجراء: ${updatedSOP.title}`);
  };

  const handleToggleSOPActive = (sopId: string) => {
    setSops((prev) =>
      prev.map((s) => {
        if (s.id === sopId) {
          const nextState = !s.isCritical;
          addAuditLog(
            'تحديث حالة إجراء SOP',
            'SOP_UPDATED',
            `تم تحديث حالة الإجراء ${s.title}`
          );
          return { ...s, isCritical: nextState };
        }
        return s;
      })
    );
  };

  const handleAddOffice = (newOffice: AdminOffice) => {
    setOffices((prev) => [newOffice, ...prev]);
    addAuditLog('إضافة مكتب إداري', 'ROLE_MODIFIED', `تم إنشاء مكتب جديد: ${newOffice.officeName}`);
  };

  const handleUpdateOffice = (updatedOffice: AdminOffice) => {
    setOffices((prev) => prev.map((o) => (o.id === updatedOffice.id ? updatedOffice : o)));
    addAuditLog('تحديث مكتب إداري', 'ROLE_MODIFIED', `تم تحديث بيانات المكتب: ${updatedOffice.officeName}`);
  };

  const handleAddBranch = (newBranch: Branch) => {
    setBranches((prev) => [newBranch, ...prev]);
    addAuditLog('إضافة فرع جديد', 'ROLE_MODIFIED', `تم إنشاء فرع جديد: ${newBranch.name}`);
  };

  const handleUpdateBranch = (updatedBranch: Branch) => {
    setBranches((prev) => prev.map((b) => (b.id === updatedBranch.id ? updatedBranch : b)));
    addAuditLog('تحديث فرع', 'ROLE_MODIFIED', `تم تحديث بيانات الفرع: ${updatedBranch.name}`);
  };

  const handleAddEmployee = (newEmp: EmployeeStaff) => {
    setEmployees((prev) => [newEmp, ...prev]);
    addAuditLog('إضافة موظف جديد', 'ROLE_MODIFIED', `تم تسجيل الموظف: ${newEmp.name} بالمكتب ${newEmp.officeName}`);
  };

  const handleToggleAttendance = (employeeId: string, newStatus: EmployeeStaff['attendanceStatus']) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === employeeId) {
          const now = new Date().toLocaleTimeString('ar-EG', {
            hour: '2-digit',
            minute: '2-digit',
          });
          const statusMap = {
            PRESENT: 'حاضر 🟢',
            ABSENT: 'غائب 🔴',
            REMOTE: 'عن بعد 🔵',
            ON_LEAVE: 'إجازة 🟠',
          };
          addAuditLog(
            'تحديث حالة الحضور المباشرة',
            'ROLE_MODIFIED',
            `تم تغيير حالة الموظف ${emp.name} إلى (${statusMap[newStatus]}) في ${now}`
          );
          return {
            ...emp,
            attendanceStatus: newStatus,
            checkInTime: newStatus === 'PRESENT' ? now : emp.checkInTime,
          };
        }
        return emp;
      })
    );
  };

  const handleApproveWorkflow = (id: string, actorName: string) => {
    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const updatedTimeline = [
            ...w.timeline,
            {
              timestamp: new Date().toLocaleString('ar-EG'),
              actor: actorName,
              action: 'اعتمد المعاملة',
              comment: 'تم الاعتماد بنجاح',
            },
          ];
          addAuditLog('اعتماد معاملة', 'DELEGATION_ACTIVATED', `تم اعتماد المعاملة رقم ${w.referenceNumber} بواسطة ${actorName}`);
          return { ...w, status: 'APPROVED', timeline: updatedTimeline };
        }
        return w;
      })
    );
  };

  const handleEscalateWorkflow = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const updatedTimeline = [
            ...w.timeline,
            {
              timestamp: new Date().toLocaleString('ar-EG'),
              actor: 'النظام الآلي (BCM)',
              action: 'تصعيد فوري للبديل',
              comment: `تم تحويل الصلاحية للمسؤول البديل: ${w.substituteAssigneeRole}`,
            },
          ];
          addAuditLog('تصعيد معاملة تلقائي', 'DELEGATION_ACTIVATED', `تم تصعيد المعاملة ${w.referenceNumber} إلى البديل ${w.substituteAssigneeRole}`);
          return {
            ...w,
            isDelegatedToSubstitute: true,
            status: 'ESCALATED',
            timeline: updatedTimeline,
          };
        }
        return w;
      })
    );
  };

  const handleAddWorkflowRequest = (req: WorkflowRequest) => {
    setWorkflows((prev) => [req, ...prev]);
    addAuditLog('إضافة معاملة جديدة', 'DELEGATION_ACTIVATED', `تم تسجيل معاملة جديدة: ${req.title}`);
  };

  const handleAddSecret = (secret: CorporateSecret) => {
    setSecrets((prev) => [secret, ...prev]);
    addAuditLog('إضافة مفتاح أو كلمة سر', 'SECRET_ACCESSED', `تم حفظ سر مؤسسي جديد: ${secret.title}`);
  };

  const handleActivateEmergency = (reason: string) => {
    setIsEmergencyActive(true);
    setEmergencyReason(reason);
    addAuditLog(
      'تفعيل وضع الطوارئ الشامل BCP',
      'DELEGATION_ACTIVATED',
      `تم تفعيل بروتوكول الكوارث بسبب: ${reason}`
    );
  };

  const handleDeactivateEmergency = () => {
    setIsEmergencyActive(false);
    setEmergencyReason('');
    addAuditLog('إلغاء وضع الطوارئ', 'DELEGATION_ACTIVATED', 'تم تعطيل بروتوكول الطوارئ والعودة للحالة الطبيعية');
  };

  // Computed Metrics
  const pendingApprovalsCount = workflows.filter((w) => w.status === 'PENDING').length;
  const spofCount = roles.filter((r) => !r.substituteRoleId).length;

  return (
    <BCMContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        toggleSidebar,
        isMobileOpen,
        setIsMobileOpen,
        mobileOsSkin,

        roles,
        sops,
        offices,
        branches,
        employees,
        auditLogs,
        workflows,
        secrets,

        isEmergencyActive,
        emergencyReason,
        showEmergencyModal,
        setShowEmergencyModal,

        pendingApprovalsCount,
        spofCount,

        handleAddRole,
        handleUpdateRole,
        handleAddSOP,
        handleUpdateSOP,
        handleToggleSOPActive,
        handleAddOffice,
        handleUpdateOffice,
        handleAddBranch,
        handleUpdateBranch,
        handleAddEmployee,
        handleToggleAttendance,
        handleApproveWorkflow,
        handleEscalateWorkflow,
        handleAddWorkflowRequest,
        handleAddSecret,
        handleActivateEmergency,
        handleDeactivateEmergency,
        addAuditLog,
      }}
    >
      {children}
    </BCMContext.Provider>
  );
};

export const useBCM = () => {
  const context = useContext(BCMContext);
  if (!context) {
    throw new Error('useBCM must be used within a BCMProvider');
  }
  return context;
};
