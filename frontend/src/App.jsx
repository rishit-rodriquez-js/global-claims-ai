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

import { fetchClaims, fetchAuditLogs, fetchMe, logoutApi } from './services/api.js';
import { ShieldCheck, Loader2 } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [currentTab, setCurrentTab] = useState('dashboard');
  const [claims, setClaims] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(false);

  // 1. Silent Authentication & Session Persistence on Mount
  useEffect(() => {
    async function restoreSession() {
      setIsCheckingAuth(true);
      try {
        const user = await fetchMe();
        if (user) {
          setCurrentUser(user);
          await loadLiveData(false, user);
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.error("Session restore failed:", err);
        setCurrentUser(null);
      } finally {
        setIsCheckingAuth(false);
      }
    }
    restoreSession();
  }, []);

  // Listen for unauthorized 401 events to trigger auto-logout
  useEffect(() => {
    const handleUnauthorized = () => {
      setCurrentUser(null);
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  // 2. Load live backend data (Claims & Audit Logs)
  const loadLiveData = async (preserveSelected = false, activeUser = currentUser) => {
    setIsLoadingData(true);
    try {
      const claimsData = await fetchClaims();
      setClaims(claimsData);

      // Audit logs are fetched for Officers/Admins
      if (activeUser && activeUser.role !== 'Customer') {
        const logsData = await fetchAuditLogs();
        setAuditLogs(logsData);
      } else {
        setAuditLogs([]);
      }

      if (claimsData.length > 0 && !preserveSelected) {
        setSelectedClaim(claimsData[0]);
      }
    } catch (err) {
      console.error("Failed to load backend data:", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const pendingReviewCount = claims.filter(c => c.status === 'Human Review').length;

  const handleLoginSuccess = async (user) => {
    setCurrentUser(user);
    setCurrentTab('dashboard');
    await loadLiveData(false, user);
  };

  const handleLogout = async () => {
    await logoutApi();
    setCurrentUser(null);
    setClaims([]);
    setAuditLogs([]);
  };

  const handleSelectClaim = (claim) => {
    setSelectedClaim(claim);
    setCurrentTab('detail');
  };

  const handleSubmitClaimSuccess = async (newClaim) => {
    try {
      const claimsData = await fetchClaims();
      setClaims(claimsData);
      const foundClaim = claimsData.find(c => c.id === newClaim.id) || newClaim;
      setSelectedClaim(foundClaim);
      setCurrentTab('detail');
    } catch (err) {
      setSelectedClaim(newClaim);
      setCurrentTab('detail');
    }
  };

  const handleUpdateClaimStatus = async (claimId, newStatus, notes) => {
    await loadLiveData(true);
  };

  // Auth checking loader
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col items-center justify-center space-y-4 font-sans">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 animate-pulse">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          <span>Restoring Azure AI Workspace session...</span>
        </div>
      </div>
    );
  }

  // Render Login/Register View if Unauthenticated
  if (!currentUser) {
    return <AuthView onLoginSuccess={handleLoginSuccess} />;
  }

  // Ensure Customer role cannot stay on Officer/Audit views
  const isCustomer = currentUser.role === 'Customer';
  const effectiveTab = (isCustomer && (currentTab === 'officer' || currentTab === 'audit')) ? 'dashboard' : currentTab;

  return (
    <div className="flex h-screen bg-[#0b0f19] text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar 
        currentTab={effectiveTab} 
        setCurrentTab={setCurrentTab} 
        pendingCount={pendingReviewCount} 
        currentUser={currentUser}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          currentUser={currentUser}
          onLogout={handleLogout}
          onNewClaimClick={() => setCurrentTab('submit')} 
        />

        <main className="flex-1 overflow-y-auto p-6 bg-[#0b0f19]">
          {effectiveTab === 'dashboard' && (
            <DashboardView 
              claims={claims}
              searchQuery={searchQuery}
              currentUser={currentUser}
              onSelectClaim={handleSelectClaim}
              onNavigateSubmit={() => setCurrentTab('submit')}
              onNavigateOfficer={() => setCurrentTab('officer')}
              onNavigateCopilot={() => setCurrentTab('copilot')}
            />
          )}

          {effectiveTab === 'submit' && (
            <SubmitClaimView 
              currentUser={currentUser}
              onSubmitClaimSuccess={handleSubmitClaimSuccess}
            />
          )}

          {effectiveTab === 'detail' && (
            <ClaimDetailView 
              claim={selectedClaim || claims[0]}
              onBack={() => setCurrentTab('dashboard')}
              onNavigateOfficer={() => setCurrentTab('officer')}
            />
          )}

          {effectiveTab === 'officer' && !isCustomer && (
            <OfficerReviewView 
              claims={claims}
              currentUser={currentUser}
              onUpdateClaimStatus={handleUpdateClaimStatus}
            />
          )}

          {effectiveTab === 'copilot' && (
            <CopilotView 
              claims={claims}
            />
          )}

          {effectiveTab === 'audit' && !isCustomer && (
            <AuditTrailView 
              auditLogs={auditLogs}
            />
          )}
        </main>
      </div>
    </div>
  );
}
