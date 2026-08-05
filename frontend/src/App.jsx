import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';

import DashboardView from './views/DashboardView.jsx';
import SubmitClaimView from './views/SubmitClaimView.jsx';
import ClaimDetailView from './views/ClaimDetailView.jsx';
import OfficerReviewView from './views/OfficerReviewView.jsx';
import CopilotView from './views/CopilotView.jsx';
import AuditTrailView from './views/AuditTrailView.jsx';
import AuthView from './views/AuthView.jsx';

import { fetchClaims, fetchAuditLogs } from './services/api.js';

export default function App() {
  const [currentUser, setCurrentUser] = useState({
    id: "USR-801",
    name: "Senior Officer Sarah Vance",
    email: "sarah.vance@globalclaims.ai",
    role: "Claim Officer"
  });

  const [currentTab, setCurrentTab] = useState('dashboard');
  const [claims, setClaims] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Fetch real live data from FastAPI backend on mount
  const loadLiveData = async () => {
    setIsLoadingData(true);
    try {
      const [claimsData, logsData] = await Promise.all([
        fetchClaims(),
        fetchAuditLogs()
      ]);
      setClaims(claimsData);
      setAuditLogs(logsData);
      if (claimsData.length > 0) {
        setSelectedClaim(claimsData[0]);
      }
    } catch (err) {
      console.error("Failed to load backend data:", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    loadLiveData();
  }, []);

  const pendingReviewCount = claims.filter(c => c.status === 'Human Review').length;

  const handleSelectClaim = (claim) => {
    setSelectedClaim(claim);
    setCurrentTab('detail');
  };

  const handleSubmitClaimSuccess = (newClaim) => {
    loadLiveData(); // Refresh live data from Azure SQL / SQLite backend
    setSelectedClaim(newClaim);
    setCurrentTab('detail');
  };

  const handleUpdateClaimStatus = async (claimId, newStatus, notes) => {
    await loadLiveData(); // Refresh live claims & audit logs from backend
  };

  if (!currentUser) {
    return <AuthView onLoginSuccess={(user) => { setCurrentUser(user); loadLiveData(); }} />;
  }

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
          currentUser={currentUser}
          onLogout={() => setCurrentUser(null)}
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
              currentUser={currentUser}
              onSubmitClaimSuccess={handleSubmitClaimSuccess}
            />
          )}

          {currentTab === 'detail' && (
            <ClaimDetailView 
              claim={selectedClaim || claims[0]}
              onBack={() => setCurrentTab('dashboard')}
              onNavigateOfficer={() => setCurrentTab('officer')}
            />
          )}

          {currentTab === 'officer' && (
            <OfficerReviewView 
              claims={claims}
              currentUser={currentUser}
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
