import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingView } from './components/LandingView';
import { DiagnosticStudio } from './components/DiagnosticStudio';
import { WeatherRiskPredictor } from './components/WeatherRiskPredictor';
import { GeospatialHotspots } from './components/GeospatialHotspots';
import { IPMCalculator } from './components/IPMCalculator';
import { FarmerDashboard } from './components/FarmerDashboard';
import { ExtensionOfficerDashboard } from './components/ExtensionOfficerDashboard';
import { GovtCommandCenter } from './components/GovtCommandCenter';
import { OfflineSMSSimulator } from './components/OfflineSMSSimulator';
import { RoleLoginModal } from './components/RoleLoginModal';
import { cropDiseases } from './data/cropDiseases';
import { DiagnosisProvider } from './context/DiagnosisContext';
import { isRoleAuthenticated, logoutRole } from './config/authCredentials';

const getInitialNavState = () => {
  if (typeof window === 'undefined') {
    return { view: 'landing', role: 'farmer' };
  }
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  if (hash === 'farmer' || hash === 'officer' || hash === 'govt') {
    if (isRoleAuthenticated(hash)) {
      return { view: 'dashboard', role: hash };
    } else {
      return { view: 'landing', role: hash, requiresAuth: true };
    }
  }
  if (['diagnosis', 'weather', 'hotspots', 'ipm', 'landing'].includes(hash)) {
    const savedRole = sessionStorage.getItem('krushi_role');
    return { view: hash, role: savedRole || 'farmer' };
  }
  const savedView = sessionStorage.getItem('krushi_view');
  const savedRole = sessionStorage.getItem('krushi_role');
  if (savedView === 'dashboard' && savedRole) {
    if (isRoleAuthenticated(savedRole)) {
      return { view: 'dashboard', role: savedRole };
    } else {
      return { view: 'landing', role: savedRole };
    }
  }
  if (savedView && ['diagnosis', 'weather', 'hotspots', 'ipm', 'landing'].includes(savedView)) {
    return { view: savedView, role: savedRole || 'farmer' };
  }
  return { view: 'landing', role: 'farmer' };
};

function AppContent() {
  const [currentLang, setCurrentLang] = useState('en'); // 'en' | 'mr' | 'hi'
  const [currentRole, setCurrentRole] = useState(() => getInitialNavState().role); // 'farmer' | 'officer' | 'govt'
  const [activeView, setActiveView] = useState(() => getInitialNavState().view); // 'landing' | 'diagnosis' | 'weather' | 'hotspots' | 'ipm' | 'dashboard'
  const [diagnosisModality, setDiagnosisModality] = useState('camera');
  const [selectedDiseaseForIPM, setSelectedDiseaseForIPM] = useState(cropDiseases[0]);
  const [smsSimOpen, setSmsSimOpen] = useState(false);
  const [loginModalState, setLoginModalState] = useState(() => {
    const init = getInitialNavState();
    return {
      isOpen: !!init.requiresAuth,
      targetRole: init.role || 'farmer'
    };
  });

  // Sync active view/role with URL hash & session storage for persistent refresh
  useEffect(() => {
    try {
      sessionStorage.setItem('krushi_view', activeView);
      sessionStorage.setItem('krushi_role', currentRole);
      if (activeView === 'dashboard') {
        window.location.hash = currentRole;
      } else if (activeView === 'landing') {
        if (['#farmer', '#officer', '#govt'].includes(window.location.hash)) {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      } else {
        window.location.hash = activeView;
      }
    } catch (_) {}
  }, [activeView, currentRole]);

  // Handle browser back/forward and direct hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const state = getInitialNavState();
      setActiveView(state.view);
      setCurrentRole(state.role);
      if (state.requiresAuth) {
        setLoginModalState({ isOpen: true, targetRole: state.role });
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (viewId, modality) => {
    setActiveView(viewId);
    if (viewId === 'diagnosis' && modality) {
      setDiagnosisModality(modality);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRoleChange = (role) => {
    if (isRoleAuthenticated(role)) {
      setCurrentRole(role);
      setActiveView('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setLoginModalState({ isOpen: true, targetRole: role });
    }
  };

  const handleLoginSuccess = (role) => {
    setCurrentRole(role);
    setActiveView('dashboard');
    setLoginModalState({ isOpen: false, targetRole: role });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginClose = () => {
    setLoginModalState({ isOpen: false, targetRole: currentRole });
    if (activeView === 'dashboard' && !isRoleAuthenticated(currentRole)) {
      setActiveView('landing');
    }
  };

  const handleLogout = () => {
    logoutRole(currentRole);
    setActiveView('landing');
    if (['#farmer', '#officer', '#govt'].includes(window.location.hash)) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDiseaseForIPM = (disease) => {
    setSelectedDiseaseForIPM(disease);
  };

  const handleEscalateKVK = (disease) => {
    console.log('Escalated to KVK:', disease?.name);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9F5]">
      {/* Universal Top Navigation */}
      <Navbar
        currentLang={currentLang}
        onLangChange={setCurrentLang}
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        activeView={activeView}
        onNavigate={handleNavigate}
        onOpenSmsSim={() => setSmsSimOpen(true)}
        onOpenLoginModal={(role) => setLoginModalState({ isOpen: true, targetRole: role })}
        onLogout={handleLogout}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'landing' && (
          <LandingView
            currentLang={currentLang}
            onNavigate={handleNavigate}
            onRoleChange={handleRoleChange}
          />
        )}

        {activeView === 'diagnosis' && (
          <DiagnosticStudio
            currentLang={currentLang}
            onNavigate={handleNavigate}
            onRoleChange={handleRoleChange}
            onSelectDiseaseForIPM={handleSelectDiseaseForIPM}
            onEscalateKVK={handleEscalateKVK}
            initialModality={diagnosisModality}
          />
        )}

        {activeView === 'weather' && (
          <WeatherRiskPredictor
            currentLang={currentLang}
            onNavigate={handleNavigate}
            onSelectDiseaseForIPM={handleSelectDiseaseForIPM}
          />
        )}

        {activeView === 'hotspots' && (
          <GeospatialHotspots
            currentLang={currentLang}
            onNavigate={handleNavigate}
          />
        )}

        {activeView === 'ipm' && (
          <IPMCalculator
            currentLang={currentLang}
            selectedDisease={selectedDiseaseForIPM}
            onSelectDisease={handleSelectDiseaseForIPM}
          />
        )}

        {activeView === 'dashboard' && (
          <>
            {isRoleAuthenticated(currentRole) ? (
              <>
                {currentRole === 'farmer' && (
                  <FarmerDashboard
                    currentLang={currentLang}
                    onNavigate={handleNavigate}
                    onRoleChange={handleRoleChange}
                    onLogout={handleLogout}
                  />
                )}

                {currentRole === 'officer' && (
                  <ExtensionOfficerDashboard
                    currentLang={currentLang}
                    onNavigate={handleNavigate}
                    onRoleChange={handleRoleChange}
                    onLogout={handleLogout}
                  />
                )}

                {currentRole === 'govt' && (
                  <GovtCommandCenter
                    currentLang={currentLang}
                    onNavigate={handleNavigate}
                    onRoleChange={handleRoleChange}
                    onLogout={handleLogout}
                  />
                )}
              </>
            ) : (
              <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-3xl mb-4 shadow-sm">
                  🔒
                </div>
                <h2 className="text-xl font-extrabold text-slate-800 mb-2">Workspace Access Locked</h2>
                <p className="text-sm text-slate-600 max-w-md mb-6 font-medium">
                  Please sign in with demo credentials to access the {currentRole.toUpperCase()} workspace.
                </p>
                <button
                  onClick={() => setLoginModalState({ isOpen: true, targetRole: currentRole })}
                  className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-[#0F382A] text-amber-300 hover:bg-emerald-900 border border-emerald-700 shadow-md transition-all cursor-pointer"
                >
                  Sign In to {currentRole.toUpperCase()} Workspace
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Role-Specific Demo Authentication Modal */}
      <RoleLoginModal
        isOpen={loginModalState.isOpen}
        targetRole={loginModalState.targetRole}
        onSuccess={handleLoginSuccess}
        onClose={handleLoginClose}
      />

      {/* Offline 2G SMS & IVR Phone Simulator Modal */}
      <OfflineSMSSimulator
        isOpen={smsSimOpen}
        onClose={() => setSmsSimOpen(false)}
        currentLang={currentLang}
      />
    </div>
  );
}

function App() {
  return (
    <DiagnosisProvider>
      <AppContent />
    </DiagnosisProvider>
  );
}

export default App;
