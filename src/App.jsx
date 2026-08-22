import React, { useState } from 'react';
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

function App() {
  const [currentLang, setCurrentLang] = useState('en'); // 'en' | 'mr' | 'hi'
  const [currentRole, setCurrentRole] = useState('farmer'); // 'farmer' | 'officer' | 'govt'
  const [activeView, setActiveView] = useState('landing'); // 'landing' | 'diagnosis' | 'weather' | 'hotspots' | 'ipm' | 'dashboard'
  const [selectedDiseaseForIPM, setSelectedDiseaseForIPM] = useState(cropDiseases[0]);
  const [smsSimOpen, setSmsSimOpen] = useState(false);

  const handleNavigate = (viewId) => {
    setActiveView(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRoleChange = (role) => {
    setCurrentRole(role);
  };

  const handleSelectDiseaseForIPM = (disease) => {
    setSelectedDiseaseForIPM(disease);
  };

  const handleEscalateKVK = (disease) => {
    console.log('Escalated to KVK:', disease.name);
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
            onSelectDiseaseForIPM={handleSelectDiseaseForIPM}
            onEscalateKVK={handleEscalateKVK}
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
              />
            )}

            {currentRole === 'officer' && (
              <ExtensionOfficerDashboard
                currentLang={currentLang}
                onNavigate={handleNavigate}
              />
            )}

            {currentRole === 'govt' && (
              <GovtCommandCenter
                currentLang={currentLang}
                onNavigate={handleNavigate}
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

export default App;

