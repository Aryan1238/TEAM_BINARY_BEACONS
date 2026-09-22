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
import { cropDiseases } from './data/cropDiseases';
import { DiagnosisProvider } from './context/DiagnosisContext';

const getInitialNavState = () => {
  if (typeof window === 'undefined') {
    return { view: 'landing', role: 'farmer' };
  }
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  if (hash === 'farmer') return { view: 'dashboard', role: 'farmer' };
  if (hash === 'officer') return { view: 'dashboard', role: 'officer' };
  if (hash === 'govt') return { view: 'dashboard', role: 'govt' };
  if (['diagnosis', 'weather', 'hotspots', 'ipm', 'landing'].includes(hash)) {
    const savedRole = sessionStorage.getItem('krushi_role');
    return { view: hash, role: savedRole || 'farmer' };
  }
  const savedView = sessionStorage.getItem('krushi_view');
  const savedRole = sessionStorage.getItem('krushi_role');
  if (savedView === 'dashboard' && savedRole) {
    return { view: 'dashboard', role: savedRole };
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
    setCurrentRole(role);
    setActiveView('dashboard');
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
            {currentRole === 'farmer' && (
              <FarmerDashboard
                currentLang={currentLang}
                onNavigate={handleNavigate}
                onRoleChange={handleRoleChange}
              />
            )}

            {currentRole === 'officer' && (
              <ExtensionOfficerDashboard
                currentLang={currentLang}
                onNavigate={handleNavigate}
                onRoleChange={handleRoleChange}
              />
            )}

            {currentRole === 'govt' && (
              <GovtCommandCenter
                currentLang={currentLang}
                onNavigate={handleNavigate}
                onRoleChange={handleRoleChange}
              />
            )}
          </>
        )}
      </main>

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
