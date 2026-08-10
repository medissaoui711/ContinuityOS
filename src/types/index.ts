// ContinuityOS Data Models (ISO 22301 & NIST Framework)

export type RoleLevel = 'OWNER' | 'EXECUTIVE' | 'MANAGER' | 'SPECIALIST' | 'OPERATOR';

export interface EmployeeRole {
  id: string;
  jobTitle: string;
  department: string;
  level: RoleLevel;
  primaryHolderName: string;
  primaryHolderEmail: string;
  substituteRoleId?: string;
  substituteHolderName: string;
  substituteHolderEmail: string;
  substituteTrainedStatus: 'FULLY_TRAINED' | 'IN_TRAINING' | 'NOT_TRAINED';
  responsibilities: string[];
  permissions: string[];
  financialLimitQAR: number; // Max financial authorization limit in QAR
  allowedDecisions: string[];
  requiredSkills: string[];
  requiredReports: string[];
  avatarUrl?: string;
}

export interface SkillMatrixItem {
  id: string;
  processName: string;
  department: string;
  isCritical: boolean;
  primaryOperatorName: string;
  secondaryOperatorName: string;
  tertiaryOperatorName?: string;
  coverageHealth: 'OPTIMAL' | 'MODERATE' | 'CRITICAL'; // CRITICAL if only 1 operator
  lastReviewedDate: string;
}

export interface SOPStep {
  stepNumber: number;
  title: string;
  description: string;
  approverRole?: string;
}

export interface StandardOperatingProcedure {
  id: string;
  title: string;
  category: string;
  isCritical: boolean;
  triggerCondition: string;
  ownerRoleId: string;
  substituteRoleId: string;
  inputs: string[];
  steps: SOPStep[];
  requiredApprovals: string[];
  exceptions: string[];
  outputs: string[];
  contingencyIfAbsent: string;
  documentStoragePath: string;
  completionCriteria: string;
  lastUpdated: string;
  version: string;
}

export interface HandoverChecklist {
  id: string;
  employeeName: string;
  substituteName: string;
  startDate: string;
  endDate: string;
  reason: string;
  currentTasks: { title: string; status: 'PENDING' | 'DONE'; dueDate: string }[];
  upcomingDeadlines: string[];
  keyContacts: string[];
  openIssues: string[];
  pendingApprovals: string[];
  handoverSignedBySubstitute: boolean;
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED';
}

export interface WorkflowRequest {
  id: string;
  referenceNumber: string;
  type: 'PURCHASE_ORDER' | 'EXPENSE_APPROVAL' | 'LEAVE_REQUEST' | 'CONTRACT_SIGN';
  title: string;
  requesterName: string;
  department: string;
  amountQAR?: number;
  currentAssigneeRole: string;
  substituteAssigneeRole: string;
  isDelegatedToSubstitute: boolean;
  escalationSlaHours: number; // hours until auto-escalation to substitute
  createdAt: string;
  status: 'PENDING' | 'APPROVED' | 'ESCALATED' | 'REJECTED';
  timeline: {
    timestamp: string;
    actor: string;
    action: string;
    comment?: string;
  }[];
}

export type VaultCategory = 'DOMAINS_HOSTING' | 'API_KEYS' | 'EMAIL_ACCOUNTS' | 'CONTRACTS' | 'BANK_SIGNATORIES' | 'ENCRYPTION_KEYS' | 'SSL_CERTS';

export interface CorporateSecret {
  id: string;
  title: string;
  category: VaultCategory;
  serviceProvider: string;
  accountIdentifier: string;
  maskedSecret: string;
  unmaskedValue?: string;
  allowedRoles: string[];
  emergencyAccessProtocol: string;
  expiryDate?: string;
  lastVerifiedDate: string;
}

export interface SystemDRMetrics {
  id: string;
  systemName: string;
  purpose: string;
  rtoHours: number; // Max acceptable downtime (Recovery Time Objective)
  rpoMinutes: number; // Max acceptable data loss (Recovery Point Objective)
  backupFrequency: 'REALTIME' | 'HOURLY' | 'DAILY' | 'WEEKLY';
  lastBackupTimestamp: string;
  lastRestoreTestDate: string;
  primaryOwnerRole: string;
  substituteOwnerRole: string;
  status: 'HEALTHY' | 'WARNING' | 'DOWN';
}

export interface ContinuityDrill {
  id: string;
  drillTitle: string;
  dateType: string;
  scenarioType: 'ACCOUNTANT_ABSENCE' | 'SALES_SYSTEM_OFFLINE' | 'ADMIN_PHONE_LOST' | 'OWNER_UNREACHABLE' | 'POWER_INTERRUPTION';
  description: string;
  simulatedTargetPerson: string;
  substituteTested: string;
  durationDays: number;
  successRatePercent: number;
  uncontactedSuccess: boolean; // Did substitute operate without calling the absent person?
  gapsIdentified: string[];
  correctiveActions: string[];
  evaluatedByAiDate?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  actionCategory: 'ROLE_MODIFIED' | 'SOP_UPDATED' | 'SECRET_ACCESSED' | 'DELEGATION_ACTIVATED' | 'DRILL_EXECUTED' | 'WORKFLOW_APPROVED';
  description: string;
  ipAddress: string;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  type: 'HQ' | 'BRANCH';
  city: string;
  address: string;
  phone: string;
  managerName: string;
  totalOfficesCount: number;
}

export interface AdminOffice {
  id: string;
  branchId: string;
  branchName: string;
  officeName: string;
  officeNumber: string;
  floor: string;
  capacity: number;
  department: string;
  managerName: string;
  description: string;
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'REMOTE' | 'ON_LEAVE';

export interface EmployeeStaff {
  id: string;
  employeeCode: string;
  name: string;
  jobTitle: string;
  department: string;
  branchId: string;
  branchName: string;
  officeId: string;
  officeName: string;
  officeNumber: string;
  email: string;
  phone: string;
  roleLevel: RoleLevel;
  attendanceStatus: AttendanceStatus;
  checkInTime?: string;
  checkOutTime?: string;
  substituteName?: string;
  avatarUrl?: string;
  notes?: string;
}

export interface OwnerSuccessionFramework {
  dailyOpsManagerRole: string;
  dailyOpsManagerName: string;
  financialLimits: {
    managerMaxQAR: number;
    executiveMaxQAR: number;
    ownerRequiredAboveQAR: number;
  };
  bankSignatories: { name: string; title: string; status: string }[];
  legalDocumentsVaultLocation: string;
  emergencyContingencySteps: string[];
  keyClientContacts: { client: string; primaryContact: string; fallbackContact: string }[];
}
