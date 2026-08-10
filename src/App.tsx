import React, { useState } from 'react';
import { BCMProvider, useBCM } from './context/BCMContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { EmergencyModal } from './components/Modals/EmergencyModal';

const BCMAppInner: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isSidebarCollapsed,
    toggleSidebar,
    isMobileOpen,
    setIsMobileOpen,
    mobileOsSkin,
    roles,
    sops,
    isEmergencyActive,
    setShowEmergencyModal,
    pendingApprovalsCount,
    spofCount,
  } = useBCM();

  const [activeRole, setActiveRole] = useState<string>('مدير استمرارية الأعمال (BCM Manager)');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate Continuity Readiness Score
  const calculateContinuityScore = () => {
    if (roles.length === 0) return 100;
    const coveredRoles = roles.filter((r) => r.primarySuccessorName && !r.isSPOF).length;
    const activeSops = sops.filter((s) => s.isActive).length;
    const sopRatio = sops.length > 0 ? activeSops / sops.length : 1;
    const baseScore = Math.round((coveredRoles / roles.length) * 70 + sopRatio * 30);
    return isEmergencyActive ? Math.max(30, baseScore - 25) : baseScore;
  };

  const continuityScore = calculateContinuityScore();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col dir-rtl" dir="rtl">
      {/* Top Header */}
      <Header
        continuityScore={continuityScore}
        activeRole={activeRole}
        onSelectRole={setActiveRole}
        availableRoles={roles.map((r) => ({
          id: r.id,
          jobTitle: r.title,
          primaryHolderName: r.primaryHolderName,
        }))}
        onTriggerEmergencyModal={() => setShowEmergencyModal(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenMobileMenu={() => setIsMobileOpen(true)}
      />

      {/* Main Body with Collapsible Sidebar & Content */}
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingApprovalsCount={pendingApprovalsCount}
          spofCount={spofCount}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebar}
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />

        <MainContent />
      </div>

      {/* Emergency Modal */}
      <EmergencyModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BCMProvider>
      <BCMAppInner />
    </BCMProvider>
  );
};

export default App;
