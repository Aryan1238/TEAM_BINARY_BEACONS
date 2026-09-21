import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { computePriority } from '../services/priorityEngine';
import { cropDiseases } from '../data/cropDiseases';

const DiagnosisContext = createContext(null);

// Baseline demo fields (Farmer single source of truth)
// Baseline demo fields (Farmer single source of truth - labeled DEMO / BASELINE)
const INITIAL_FIELDS = [
  {
    id: 'field-1',
    name: '[DEMO / BASELINE] North Field – Tomato',
    crop: 'Tomato (Abhinav F1)',
    cropBase: 'Tomato',
    acres: 1.2,
    status: 'At Risk',
    healthScore: 72,
    lastScanned: 'Today, 9:14 AM',
    diseaseHistory: ['Early Blight (91%)'],
    latestDiagnosisId: null,
    imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80',
    isDemo: true
  },
  {
    id: 'field-2',
    name: '[DEMO / BASELINE] South Field – Cotton',
    crop: 'Cotton (Bt-II)',
    cropBase: 'Cotton',
    acres: 2.5,
    status: 'Healthy',
    healthScore: 94,
    lastScanned: 'Yesterday, 4:30 PM',
    diseaseHistory: [],
    latestDiagnosisId: null,
    imageUrl: 'https://images.unsplash.com/photo-1594488500257-7945d8b7b75a?auto=format&fit=crop&w=800&q=80',
    isDemo: true
  },
  {
    id: 'field-3',
    name: '[DEMO / BASELINE] East Field – Wheat',
    crop: 'Wheat (Lokwan / Sharbati)',
    cropBase: 'Wheat',
    acres: 0.8,
    status: 'Monitored',
    healthScore: 86,
    lastScanned: '3 days ago',
    diseaseHistory: [],
    latestDiagnosisId: null,
    imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80',
    isDemo: true
  }
];

// Baseline isolated demo fallback scans for Farmer dashboard (clearly flagged as DEMO / BASELINE)
const DEMO_FALLBACK_SCANS = [
  {
    id: 'demo-scan-1',
    crop: 'Tomato',
    disease: '[DEMO / BASELINE] Early Blight',
    confidence: 91,
    severity: 'High',
    time: 'Today, 9:14 AM',
    image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=400&q=80',
    source: 'demo_fallback',
    priority: 'HIGH',
    priorityReasons: ['[DEMO / BASELINE] Demo baseline scan for initial dashboard layout'],
    recommendedNextAction: 'Inspect crop foliage for concentric target-spot lesions.'
  },
  {
    id: 'demo-scan-2',
    crop: 'Cotton',
    disease: '[DEMO / BASELINE] Bollworm (Pheromone Trap)',
    confidence: 85,
    severity: 'Medium',
    time: 'Yesterday',
    image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=400&q=80',
    source: 'demo_fallback',
    priority: 'MEDIUM',
    priorityReasons: ['[DEMO / BASELINE] Trap monitoring baseline from field logbook'],
    recommendedNextAction: 'Check trap delta count against ETL threshold (14 moths/trap).'
  },
  {
    id: 'demo-scan-3',
    crop: 'Rice',
    disease: '[DEMO / BASELINE] Blast Disease',
    confidence: 78,
    severity: 'Low',
    time: 'Aug 20',
    image: 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=400&q=80',
    source: 'demo_fallback',
    priority: 'WATCH',
    priorityReasons: ['[DEMO / BASELINE] Historical season benchmark'],
    recommendedNextAction: 'Monitor seedling nursery borders.'
  }
];

// Baseline isolated demo fallback cases for Extension Officer (clearly flagged as DEMO / BASELINE)
const DEMO_FALLBACK_OFFICER_CASES = [
  {
    id: 'DEMO-MH-NSK-201',
    farmer: 'Prakash Gaikwad [DEMO / BASELINE]',
    village: 'Niphad Shivar, Plot 4 [DEMO]',
    field: '[DEMO / BASELINE] Plot 4 – Cotton',
    crop: 'Cotton (Bt Cotton)',
    disease: 'Pink Bollworm Trap ETL [DEMO BASELINE]',
    confidence: 94,
    reportedTrapCount: '14 moths / trap / night (Demo Baseline)',
    status: 'Pending Field Verification',
    verified: false,
    groundTruthResult: null,
    source: 'demo_fallback',
    priority: 'HIGH',
    priorityScore: 68,
    timestamp: 'Today, 08:30 AM',
    priorityReasons: [
      '[DEMO / BASELINE] Pheromone trap count exceeded economic threshold level (14 moths/night)',
      'Cotton boll setting stage highly susceptible'
    ],
    recommendedNextAction: 'Conduct random 20-boll destructive sampling in 4 quadrants.',
    timelineStep: 'Follow-up Required'
  },
  {
    id: 'DEMO-MH-NSK-202',
    farmer: 'Sunita More [DEMO / BASELINE]',
    village: 'Dindori Khurd, Plot 2 [DEMO]',
    field: '[DEMO / BASELINE] Plot 2 – Tomato',
    crop: 'Tomato',
    disease: 'Late Blight [DEMO BASELINE]',
    confidence: 88,
    reportedTrapCount: 'Foliage Spotting S2 (Demo Baseline)',
    status: 'Pending Field Verification',
    verified: false,
    groundTruthResult: null,
    source: 'demo_fallback',
    priority: 'CRITICAL',
    priorityScore: 82,
    timestamp: 'Today, 09:15 AM',
    priorityReasons: [
      '[DEMO / BASELINE] High-impact foliar pathology (Phytophthora infestans)',
      'Model confidence: 88%',
      'Active fog & relative humidity in Dindori cluster'
    ],
    recommendedNextAction: 'Recommend curative systemic fungicide (Metalaxyl + Mancozeb).',
    timelineStep: 'Advisory Generated'
  },
  {
    id: 'DEMO-MH-NSK-198',
    farmer: 'Balasaheb Thorat [DEMO / BASELINE]',
    village: 'Satana Road, Plot 7 [DEMO]',
    field: '[DEMO / BASELINE] Plot 7 – Pomegranate',
    crop: 'Pomegranate',
    disease: 'Bacterial Blight / Telya [DEMO BASELINE]',
    confidence: 92,
    reportedTrapCount: 'Cracked Twigs (Demo Baseline)',
    status: 'Confirmed Ground-Truth',
    verified: true,
    groundTruthResult: 'confirmed',
    source: 'demo_fallback',
    priority: 'MEDIUM',
    priorityScore: 45,
    timestamp: 'Yesterday, 04:20 PM',
    priorityReasons: [
      '[DEMO / BASELINE] Ground-truth verified by Extension Officer',
      'Containment protocol initiated'
    ],
    recommendedNextAction: 'Prune infected branches 5cm below lesion and apply Bordeaux paste.',
    timelineStep: 'Resolved / Monitoring'
  }
];

export function DiagnosisProvider({ children }) {
  const [latestDiagnosis, setLatestDiagnosis] = useState(null);
  const [diagnosisHistory, setDiagnosisHistory] = useState([]);
  const [fields, setFields] = useState(INITIAL_FIELDS);
  const [officerCases, setOfficerCases] = useState(DEMO_FALLBACK_OFFICER_CASES);
  const [selectedDisease, setSelectedDisease] = useState(cropDiseases[0]);
  const [selectedField, setSelectedField] = useState(null);
  const [demoMode, setDemoMode] = useState(true);

  // Dynamic live counters calculated STRICTLY from source === 'live_backend'
  const govtAggregates = useMemo(() => {
    const liveEvents = diagnosisHistory.filter(e => e.source === 'live_backend');
    const liveCritical = liveEvents.filter(e => e.priority === 'CRITICAL').length;
    const liveHigh = liveEvents.filter(e => e.priority === 'HIGH').length;
    const liveMedium = liveEvents.filter(e => e.priority === 'MEDIUM').length;
    const liveWatch = liveEvents.filter(e => e.priority === 'WATCH').length;

    const affectedCropsSet = new Set(liveEvents.map(e => e.crop).filter(Boolean));
    const affectedFieldsSet = new Set(liveEvents.map(e => e.fieldName).filter(Boolean));

    return {
      liveDiagnosesCount: liveEvents.length,
      liveCriticalCount: liveCritical,
      liveHighPriorityCount: liveHigh,
      liveMediumCount: liveMedium,
      liveWatchCount: liveWatch,
      affectedCropsCount: affectedCropsSet.size,
      affectedCrops: Array.from(affectedCropsSet),
      affectedFieldsCount: affectedFieldsSet.size,
      affectedFields: Array.from(affectedFieldsSet),
      hasLiveDiagnoses: liveEvents.length > 0
    };
  }, [diagnosisHistory]);

  // Farmer dynamic stats (base demo + live backend increments)
  const farmerStats = useMemo(() => {
    const liveEvents = diagnosisHistory.filter(e => e.source === 'live_backend');
    const liveIssues = liveEvents.filter(e => e.priority === 'CRITICAL' || e.priority === 'HIGH' || e.priority === 'MEDIUM').length;

    return {
      baseScans: 14,
      liveScansCount: liveEvents.length,
      totalScans: 14 + liveEvents.length,
      baseIssues: 6,
      liveIssuesCount: liveIssues,
      issuesDetected: 6 + liveIssues,
      resolved: 5,
      lossPrevented: 8200 + (liveIssues * 1500)
    };
  }, [diagnosisHistory]);

  /**
   * Publishes a diagnosis from DiagnosticStudio into the shared state.
   *
   * @param {Object} payload
   * @param {string} payload.crop - Crop species
   * @param {string} payload.disease - Disease title
   * @param {number} payload.confidence - PyTorch Softmax confidence (0-100)
   * @param {string} [payload.severity] - Severity tier
   * @param {string} [payload.source='live_backend'] - 'live_backend' | 'benchmark_demo'
   * @param {string} [payload.rawClass] - Model taxonomy class
   * @param {string} [payload.gradcamImage] - Saliency heatmap URL
   * @param {string} [payload.imageUrl] - Source image URL
   * @param {Object} [payload.diseaseObj] - Matched cropDiseases registry item
   * @param {Object} [payload.weatherRisk] - Real observed weather if available
   */
  const publishDiagnosis = useCallback((payload) => {
    if (!payload || !payload.disease) return null;

    const source = payload.source === 'benchmark_demo' ? 'benchmark_demo' : 'live_backend';
    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nowIso = new Date().toISOString();

    // 1. Identify Target Field (Deterministic matching by crop or default to first field)
    const matchingField = fields.find(
      f => f.cropBase.toLowerCase() === (payload.crop || '').toLowerCase()
    ) || fields[0];

    const isRepeat = (matchingField.diseaseHistory || []).some(
      h => h.toLowerCase().includes((payload.disease || '').toLowerCase())
    );

    // 2. Compute Priority Deterministically
    const priorityResult = computePriority({
      disease: payload.disease,
      confidence: payload.confidence,
      crop: payload.crop,
      severity: payload.severity || (payload.diseaseObj?.severity || 'Moderate'),
      weatherRisk: payload.weatherRisk || null,
      fieldHealthScore: matchingField.healthScore,
      isRepeat,
      source
    });

    // 3. Build Unique Diagnosis Record
    const eventId = `diag-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newEvent = {
      id: eventId,
      crop: payload.crop || 'Crop Foliage',
      disease: payload.disease,
      confidence: Number(payload.confidence) || 0,
      severity: payload.severity || (payload.diseaseObj?.severity || 'Moderate'),
      timestamp: `Today, ${timestampStr}`,
      timestampIso: nowIso,
      fieldId: matchingField.id,
      fieldName: matchingField.name,
      location: 'Nashik District, Maharashtra',
      source, // 'live_backend' | 'benchmark_demo'
      rawClass: payload.rawClass || null,
      gradcamImage: payload.gradcamImage || null,
      imageUrl: payload.imageUrl || matchingField.imageUrl,
      advisoryStatus: 'CIBRC IPM Protocol Generated',
      followUpStatus: (priorityResult.priority === 'CRITICAL' || priorityResult.priority === 'HIGH')
        ? 'Flagged for Field Verification'
        : 'Farmer Self-Monitoring',
      priority: priorityResult.priority,
      priorityScore: priorityResult.numericScore,
      priorityReasons: priorityResult.reasons,
      recommendedNextAction: priorityResult.recommendedNextAction,
      diseaseObj: payload.diseaseObj || null,
      weatherRisk: payload.weatherRisk || null,
      timelineStep: 'Advisory Generated',
      groundTruthStatus: 'pending'
    };

    // 4. Update latestDiagnosis
    setLatestDiagnosis(newEvent);

    // If diseaseObj is available, keep selectedDisease updated for IPM
    if (payload.diseaseObj) {
      setSelectedDisease(payload.diseaseObj);
    }

    // 5. Update Field Single Source of Truth
    // Deterministic field update rule:
    // If Healthy: improves score by +4 (max 100)
    // If Critical/Severe: reduces score by 16 (min 35)
    // If High/Moderate: reduces score by 10 (min 45)
    // If Watch/Low: reduces score by 4 (min 60)
    setFields(prevFields => prevFields.map(f => {
      if (f.id !== matchingField.id) return f;

      const isHealthy = payload.disease.toLowerCase().includes('healthy');
      let newScore = f.healthScore;
      let newStatus = f.status;

      if (isHealthy) {
        newScore = Math.min(100, f.healthScore + 4);
        newStatus = 'Healthy';
      } else if (priorityResult.priority === 'CRITICAL') {
        newScore = Math.max(32, f.healthScore - 16);
        newStatus = 'At Risk';
      } else if (priorityResult.priority === 'HIGH') {
        newScore = Math.max(45, f.healthScore - 10);
        newStatus = 'At Risk';
      } else {
        newScore = Math.max(60, f.healthScore - 5);
        newStatus = 'Monitored';
      }

      const updatedHistory = [
        `${payload.disease} (${Math.round(payload.confidence)}%)`,
        ...(f.diseaseHistory || []).filter(h => !h.startsWith(payload.disease))
      ].slice(0, 4);

      const updatedField = {
        ...f,
        healthScore: newScore,
        status: newStatus,
        lastScanned: 'Just now',
        diseaseHistory: updatedHistory,
        latestDiagnosisId: eventId
      };

      // If this field is currently selected, keep selectedField in sync
      setSelectedField(prev => (prev && prev.id === f.id ? updatedField : prev));

      return updatedField;
    }));

    // 6. Prepend to diagnosis history
    setDiagnosisHistory(prev => [newEvent, ...prev]);

    // 7. If source === 'live_backend', create a prioritized extension officer case
    if (source === 'live_backend') {
      const newOfficerCase = {
        id: `MH-LIVE-${Math.floor(100 + Math.random() * 900)}`,
        farmer: 'Ramesh Patil',
        village: 'Nashik Shivar (Live Field Scan)',
        field: matchingField.name,
        crop: newEvent.crop,
        disease: newEvent.disease,
        confidence: newEvent.confidence,
        reportedTrapCount: 'PyTorch EfficientNet-B0 Saliency',
        status: 'Pending Field Verification',
        verified: false,
        groundTruthResult: null,
        source: 'live_backend',
        priority: newEvent.priority,
        priorityScore: newEvent.priorityScore,
        timestamp: newEvent.timestamp,
        priorityReasons: newEvent.priorityReasons,
        recommendedNextAction: newEvent.recommendedNextAction,
        timelineStep: 'Follow-up Required'
      };

      setOfficerCases(prev => [newOfficerCase, ...prev]);
    }

    if (demoMode) {
      setDemoMode(false);
    }

    return newEvent;
  }, [fields, demoMode]);

  /**
   * Extension Officer Ground-Truth confirmation action
   * (Alters frontend session state only)
   */
  const updateOfficerCaseStatus = useCallback((caseId, confirmed, notes = '') => {
    setOfficerCases(prev => prev.map(c => {
      if (c.id !== caseId) return c;
      return {
        ...c,
        verified: true,
        groundTruthResult: confirmed ? 'confirmed' : 'false_positive',
        status: confirmed ? 'Confirmed Ground-Truth' : 'Corrected (False Positive)',
        officerNotes: notes,
        timelineStep: confirmed ? 'Resolved / Monitoring' : 'Corrected / Closed'
      };
    }));
  }, []);

  /**
   * Adds a new field to farmer plots
   */
  const addField = useCallback((newField) => {
    setFields(prev => [...prev, newField]);
  }, []);

  /**
   * Merged recent scans for Farmer Dashboard:
   * Real session diagnoses first, demo fallback scans appended only as needed.
   */
  const mergedRecentScans = useMemo(() => {
    const realScans = diagnosisHistory.map(d => ({
      id: d.id,
      crop: d.crop,
      disease: d.disease,
      confidence: d.confidence,
      severity: d.severity,
      time: d.timestamp,
      image: d.imageUrl,
      source: d.source,
      priority: d.priority,
      priorityReasons: d.priorityReasons,
      recommendedNextAction: d.recommendedNextAction,
      isLive: d.source === 'live_backend'
    }));

    if (realScans.length === 0) {
      return DEMO_FALLBACK_SCANS;
    }

    // Keep real scans at the top, followed by demo fallbacks
    return [...realScans, ...DEMO_FALLBACK_SCANS.slice(0, Math.max(1, 4 - realScans.length))];
  }, [diagnosisHistory]);

  const value = {
    // Diagnoses
    latestDiagnosis,
    diagnosisHistory,
    publishDiagnosis,
    mergedRecentScans,
    // Fields
    fields,
    addField,
    selectedField,
    setSelectedField,
    // Farmer stats
    farmerStats,
    // Officer cases
    officerCases,
    updateOfficerCaseStatus,
    // Government aggregates
    govtAggregates,
    // IPM & general navigation state
    selectedDisease,
    setSelectedDisease,
    // Demo mode flag
    demoMode
  };

  return (
    <DiagnosisContext.Provider value={value}>
      {children}
    </DiagnosisContext.Provider>
  );
}

export function useDiagnosis() {
  const context = useContext(DiagnosisContext);
  if (!context) {
    throw new Error('useDiagnosis must be used within a DiagnosisProvider');
  }
  return context;
}
