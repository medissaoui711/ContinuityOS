import React from 'react';
import { useBCM } from '../context/BCMContext';
import { ContinuityDashboard } from './Dashboard/ContinuityDashboard';
import { OfficeManagement } from './Offices/OfficeManagement';
import { AttendanceManagement } from './Attendance/AttendanceManagement';
import { RoleMatrix } from './Roles/RoleMatrix';
import { SOPKnowledgeBase } from './SOP/SOPKnowledgeBase';
import { WorkflowEngine } from './Workflows/WorkflowEngine';
import { CorporateVault } from './Vault/CorporateVault';
import { DisasterRecoveryPanel } from './Recovery/DisasterRecoveryPanel';
import { AuditLogView } from './Audit/AuditLogView';

export const MainContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
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
  } = useBCM();

  return (
    <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 space-y-6 overflow-y-auto transition-all duration-300 ease-in-out">
      {activeTab === 'dashboard' && (
        <ContinuityDashboard
          roles={roles}
          sops={sops}
          offices={offices}
          branches={branches}
          employees={employees}
          auditLogs={auditLogs}
          workflows={workflows}
          score={88}
          onNavigate={(tab) => setActiveTab(tab as any)}
          isEmergencyActive={isEmergencyActive}
          emergencyReason={emergencyReason}
        />
      )}

      {activeTab === 'offices' && (
        <OfficeManagement
          offices={offices}
          branches={branches}
          employees={employees}
          onAddOffice={handleAddOffice}
          onUpdateOffice={handleUpdateOffice}
          onAddBranch={handleAddBranch}
          onUpdateBranch={handleUpdateBranch}
        />
      )}

      {activeTab === 'attendance' && (
        <AttendanceManagement
          employees={employees}
          offices={offices}
          branches={branches}
          roles={roles}
          onToggleAttendance={handleToggleAttendance}
          onAddEmployee={handleAddEmployee}
        />
      )}

      {activeTab === 'roles' && (
        <RoleMatrix
          roles={roles}
          onAddRole={handleAddRole}
          onUpdateRole={handleUpdateRole}
        />
      )}

      {activeTab === 'sops' && (
        <SOPKnowledgeBase
          sops={sops as any}
          onAddSop={handleAddSOP as any}
          onUpdateSop={handleUpdateSOP as any}
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
          activeRole="مدير النظام"
          onAddSecret={handleAddSecret}
        />
      )}

      {activeTab === 'recovery' && (
        <DisasterRecoveryPanel
          isEmergencyActive={isEmergencyActive}
          emergencyReason={emergencyReason}
          onActivateEmergency={handleActivateEmergency}
          onDeactivateEmergency={handleDeactivateEmergency}
          roles={roles}
          sops={sops}
          branches={branches}
        />
      )}

      {activeTab === 'audit' && <AuditLogView logs={auditLogs} />}
    </main>
  );
};
