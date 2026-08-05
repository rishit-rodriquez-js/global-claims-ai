import React, { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';

import DashboardView from './views/DashboardView.jsx';
import SubmitClaimView from './views/SubmitClaimView.jsx';
import ClaimDetailView from './views/ClaimDetailView.jsx';
import OfficerReviewView from './views/OfficerReviewView.jsx';
import CopilotView from './views/CopilotView.jsx';
import AuditTrailView from './views/AuditTrailView.jsx';

import { INITIAL_CLAIMS, INITIAL_AUDIT_LOGS } from './data/mockData.js';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [claims, setClaims] = useState(INITIAL_CLAIMS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [selectedClaim, setSelectedClaim] = useState(INITIAL_CLAIMS[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const pendingReviewCount = claims.filter(c => c.status === 'Human Review').length;

  const handleSelectClaim = (claim) => {
    setSelectedClaim(claim);
    setCurrentTab('detail');
  };

  const handleSubmitClaimSuccess = (newClaim) => {
    setClaims((prev) => [newClaim, ...prev]);
    setSelectedClaim(newClaim);

    // Add audit record
    const newAuditLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      agent: newClaim.confidence >= 90 ? "Decision Agent" : "Decision Agent (Escalated)",
      claimId: newClaim.id,
      action: newClaim.confidence >= 90 ? "AUTO_APPROVE" : "HUMAN_REVIEW_ESCALATION",
      confidence: newClaim.confidence,
      decision: newClaim.explanation,
      evidence: newClaim.evidence[0] || "Itemized hospital bill verified.",
      piiStatus: `Masked (Claimant: ${newClaim.claimantName.substring(0, 1)}. ****)`
    };
    setAuditLogs((prev) => [newAuditLog, ...prev]);
    setCurrentTab('detail');
  };

  const handleUpdateClaimStatus = (claimId, newStatus, notes) => {
    setClaims((prev) =>
      prev.map((c) => (c.id === claimId ? { ...c, status: newStatus } : c))
    );

    const updatedLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      agent: "Human Claims Officer",
      claimId: claimId,
      action: `OFFICER_${newStatus.toUpperCase()}`,
      confidence: 100.0,
      decision: notes || `Officer manually set status to ${newStatus}.`,
      evidence: "Human Officer Manual Signature & Rationale",
      piiStatus: "Masked (Officer ID #8801)"
    };
    setAuditLogs((prev) => [updatedLog, ...prev]);
  };

  return (
    <div class="flex h-screen bg-[#0b0f19] text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        pendingCount={pendingReviewCount} 
      />

      {/* Main Content Workspace */}
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          onNewClaimClick={() => setCurrentTab('submit')} 
        />

        <main class="flex-1 overflow-y-auto p-6 bg-[#0b0f19]">
          {currentTab === 'dashboard' && (
            <DashboardView 
              claims={claims}
              searchQuery={searchQuery}
              onSelectClaim={handleSelectClaim}
              onNavigateSubmit={() => setCurrentTab('submit')}
              onNavigateOfficer={() => setCurrentTab('officer')}
              onNavigateCopilot={() => setCurrentTab('copilot')}
            />
          )}

          {currentTab === 'submit' && (
            <SubmitClaimView 
              onSubmitClaimSuccess={handleSubmitClaimSuccess}
            />
          )}

          {currentTab === 'detail' && (
            <ClaimDetailView 
              claim={selectedClaim}
              onBack={() => setCurrentTab('dashboard')}
              onNavigateOfficer={() => setCurrentTab('officer')}
            />
          )}

          {currentTab === 'officer' && (
            <OfficerReviewView 
              claims={claims}
              onUpdateClaimStatus={handleUpdateClaimStatus}
            />
          )}

          {currentTab === 'copilot' && (
            <CopilotView 
              claims={claims}
            />
          )}

          {currentTab === 'audit' && (
            <AuditTrailView 
              auditLogs={auditLogs}
            />
          )}
        </main>
      </div>
    </div>
  );
}
