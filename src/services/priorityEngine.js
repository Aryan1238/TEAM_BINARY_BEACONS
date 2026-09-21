/**
 * Priority Engine for KrushiRaksha (SIH 2026 Problem 26131)
 *
 * Deterministic frontend prioritization heuristic.
 *
 * Priority is an operational workflow aid based on observed:
 * - Model confidence (PyTorch EfficientNet-B0 Softmax probability)
 * - Supplied severity metadata (agronomic package of practices reference)
 * - Field health (plot health index)
 * - Repeat diagnosis in the same plot
 * - Real weather risk when available
 *
 * NOTE: This is a deterministic frontend prioritization heuristic to help triage
 * field attention. It does NOT imply independently validated outbreak prediction
 * or disease severity prediction by the neural network.
 *
 * INVARIANTS:
 * - Deterministic output: same inputs always produce identical priority and reasons.
 * - Transparent explanations: reasons cite only observed data and heuristics.
 * - Zero fabricated facts: no assumptions about unobserved weather or unverified pests.
 */

// Known aggressive foliar disease classes from agronomic literature (reference taxonomy)
const AGGRESSIVE_DISEASE_CLASSES = [
  'late blight',
  'bacterial spot',
  'early blight',
  'yellow leaf curl virus',
  'black rot',
  'apple scab',
  'cedar apple rust',
  'leaf blast',
  'common rust',
  'northern leaf blight'
];

/**
 * Computes priority tier, numeric score, reasons, and recommended action.
 *
 * @param {Object} params
 * @param {string} params.disease - Disease title / common name
 * @param {number} params.confidence - PyTorch Softmax confidence (0-100)
 * @param {string} params.crop - Crop name
 * @param {string} [params.severity] - Severity label ('Critical' | 'High' | 'Moderate' | 'Low' | 'Healthy')
 * @param {Object} [params.weatherRisk] - Optional real weather data if observed
 * @param {number} [params.fieldHealthScore=100] - Field health index (0-100)
 * @param {boolean} [params.isRepeat=false] - Whether pathogen is repeated in same plot
 * @param {string} [params.source='live_backend'] - Diagnostic origin
 * @returns {{
 *   priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'WATCH',
 *   numericScore: number,
 *   reasons: string[],
 *   recommendedNextAction: string
 * }}
 */
export function computePriority({
  disease = '',
  confidence = 0,
  crop = '',
  severity = 'Moderate',
  weatherRisk = null,
  fieldHealthScore = 85,
  isRepeat = false,
  source = 'live_backend'
}) {
  const normalizedDisease = (disease || '').toLowerCase().trim();
  const isHealthy = normalizedDisease.includes('healthy') || normalizedDisease === 'healthy crop foliage';
  const isUnrecognized = normalizedDisease.includes('unrecognized') || normalizedDisease.includes('no crop leaf');

  const reasons = [];
  let score = 0;

  // 1. Healthy / Unrecognized Guardrail
  if (isHealthy) {
    return {
      priority: 'WATCH',
      numericScore: 10,
      reasons: [
        `PyTorch EfficientNet-B0 confirmed healthy foliage (${Math.round(confidence)}% confidence)`,
        'No visible foliar lesion, chlorosis, or necrotic symptoms detected'
      ],
      recommendedNextAction: 'Maintain routine weekly surveillance and standard crop nutrition.'
    };
  }

  if (isUnrecognized) {
    return {
      priority: 'WATCH',
      numericScore: 15,
      reasons: [
        'Neural network did not recognize agricultural foliage pattern',
        'Image pre-validation gate flagged non-standard input'
      ],
      recommendedNextAction: 'Re-scan leaf surface under clear daylight ensuring flat orientation.'
    };
  }

  // 2. Base Agronomic Classification Weighting (from reference taxonomy)
  const isAggressiveClass = AGGRESSIVE_DISEASE_CLASSES.some(p => normalizedDisease.includes(p));
  if (isAggressiveClass) {
    score += 35;
    reasons.push(`High-impact foliar disease class: ${disease}`);
  } else {
    score += 20;
    reasons.push(`Diagnosed foliar pathology: ${disease}`);
  }

  // 3. Model Confidence Contribution (Transparent threshold)
  const confNum = Number(confidence) || 0;
  if (confNum >= 90) {
    score += 25;
    reasons.push(`High PyTorch model confidence: ${confNum.toFixed(1)}%`);
  } else if (confNum >= 75) {
    score += 15;
    reasons.push(`Moderate-high model confidence: ${confNum.toFixed(1)}%`);
  } else if (confNum > 0) {
    score += 5;
    reasons.push(`Preliminary model signal: ${confNum.toFixed(1)}% (field verification advised)`);
  }

  // 4. Supplied / Observed Severity Rating
  const sevLower = (severity || '').toLowerCase();
  if (sevLower.includes('critical') || sevLower.includes('severe') || sevLower.includes('high')) {
    score += 20;
    reasons.push(`Supplied severity tier: ${severity}`);
  } else if (sevLower.includes('mod')) {
    score += 10;
    reasons.push('Foliar lesion spread classified as moderate');
  } else if (sevLower.includes('low')) {
    score += 5;
    reasons.push('Early-stage / localized foliar lesion');
  }

  // 5. Field Vulnerability (Based on actual field health score)
  const healthNum = Number(fieldHealthScore) || 85;
  if (healthNum < 65) {
    score += 20;
    reasons.push(`Plot health index critically compromised: ${healthNum}% (below 65% threshold)`);
  } else if (healthNum < 75) {
    score += 10;
    reasons.push(`Plot health index sub-optimal: ${healthNum}% (below 75% threshold)`);
  }

  // 6. Repeat Detection Guardrail
  if (isRepeat) {
    score += 15;
    reasons.push('Pathogen re-detected in this specific plot (persistent infection risk)');
  }

  // 7. Microclimate Weather Risk (ONLY if real data is present)
  if (weatherRisk && typeof weatherRisk === 'object') {
    if (weatherRisk.humidity && Number(weatherRisk.humidity) >= 80) {
      score += 10;
      reasons.push(`Elevated ambient humidity (${weatherRisk.humidity}%): accelerates fungal spore germination`);
    }
    if (weatherRisk.rainImminent) {
      reasons.push('Rain forecasted within spray window: immediate chemical spray withheld');
    }
    if (weatherRisk.highRiskAlert) {
      score += 10;
      reasons.push(`Microclimate epidemiological alert: ${weatherRisk.highRiskAlert}`);
    }
  }

  // Source attribution
  if (source === 'benchmark_demo') {
    reasons.push('Ground benchmark verification specimen');
  }

  // Clamp numeric score between 0 and 100
  const finalScore = Math.max(0, Math.min(100, Math.round(score)));

  // Determine Priority Tier via Deterministic frontend prioritization heuristic
  let priority = 'WATCH';
  let recommendedNextAction = 'Log for scheduled weekly field observation.';

  if (finalScore >= 75) {
    priority = 'CRITICAL';
    recommendedNextAction = 'Deterministic frontend prioritization heuristic: Flagged for priority field inspection and CIBRC IPM protocol review.';
  } else if (finalScore >= 55) {
    priority = 'HIGH';
    recommendedNextAction = 'Deterministic frontend prioritization heuristic: Recommended for field verification and standard IPM package review.';
  } else if (finalScore >= 35) {
    priority = 'MEDIUM';
    recommendedNextAction = 'Apply cultural sanitation & bio-agent spray per package of practices.';
  } else {
    priority = 'WATCH';
    recommendedNextAction = 'Monitor plot condition and rescan in 3-5 days.';
  }

  return {
    priority,
    numericScore: finalScore,
    reasons,
    recommendedNextAction
  };
}

/**
 * Returns color tokens for priority tiers.
 */
export function getPriorityStyles(priority = 'WATCH') {
  switch (priority) {
    case 'CRITICAL':
      return {
        badge: 'bg-rose-100 text-rose-800 border-rose-300',
        cardBorder: 'border-rose-300',
        dot: 'bg-rose-500',
        pill: 'bg-rose-50 text-rose-700 border-rose-200',
        headerBg: 'from-rose-900 to-rose-800',
        tone: 'rose'
      };
    case 'HIGH':
      return {
        badge: 'bg-orange-100 text-orange-800 border-orange-300',
        cardBorder: 'border-orange-300',
        dot: 'bg-orange-500',
        pill: 'bg-orange-50 text-orange-700 border-orange-200',
        headerBg: 'from-orange-900 to-amber-800',
        tone: 'orange'
      };
    case 'MEDIUM':
      return {
        badge: 'bg-amber-100 text-amber-800 border-amber-300',
        cardBorder: 'border-amber-300',
        dot: 'bg-amber-500',
        pill: 'bg-amber-50 text-amber-700 border-amber-200',
        headerBg: 'from-amber-900 to-yellow-800',
        tone: 'amber'
      };
    case 'WATCH':
    default:
      return {
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        cardBorder: 'border-emerald-200',
        dot: 'bg-emerald-500',
        pill: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        headerBg: 'from-emerald-900 to-teal-800',
        tone: 'emerald'
      };
  }
}

/**
 * Officer Visit Priority Score — deterministic 4-factor formula.
 *
 * visit_priority_score =
 *   (confidence% × 0.3) +
 *   (days_pending × 0.25) +       [capped at 30 days for normalization]
 *   (nearby_cases_2km × 0.25) +   [capped at 10 for normalization]
 *   (weather_risk_multiplier × 0.2 × 100)
 *
 * weather_risk_multiplier = 1.5 if humidity>75% AND rainForecast, else 1.0
 *
 * Each factor contributes to a 0–100 scale.
 *
 * @param {Object} params
 * @param {number} params.confidence     — PyTorch model confidence (0–100)
 * @param {number} params.daysPending    — Integer days since case logged
 * @param {number} params.nearbyCases2km — Count of nearby cases within ~2km proxy
 * @param {number} params.humidity       — Ambient humidity % (from weatherSnapshot)
 * @param {boolean} params.rainForecast  — Whether rain is forecast
 * @param {boolean} [params.lowTrustFarmer] — Whether farmer trust score <60
 * @returns {{
 *   visitScore: number,
 *   weatherRiskMultiplier: number,
 *   factors: Array<{name: string, rawValue: number|string, weight: number, contribution: number, note: string}>
 * }}
 */
export function computeVisitPriorityScore({
  confidence = 0,
  daysPending = 0,
  nearbyCases2km = 0,
  humidity = 60,
  rainForecast = false,
  lowTrustFarmer = false
}) {
  const conf = Math.max(0, Math.min(100, Number(confidence) || 0));
  const days = Math.max(0, Math.min(30, Number(daysPending) || 0));
  const nearby = Math.max(0, Math.min(10, Number(nearbyCases2km) || 0));
  const humidNum = Number(humidity) || 60;
  const wxMultiplier = (humidNum > 75 && rainForecast) ? 1.5 : 1.0;

  // Contributions (each normalized to a 0–30 or 0–20 scale per factor)
  const confContribution    = conf * 0.3;                   // max 30
  const daysContribution    = (days / 30) * 100 * 0.25;    // max 25
  const nearbyContribution  = (nearby / 10) * 100 * 0.25;  // max 25
  const wxContribution      = wxMultiplier * 0.2 * 100;    // 20 (1x) or 30 (1.5x)

  let rawScore = confContribution + daysContribution + nearbyContribution + wxContribution;

  // Low-trust farmer boost
  if (lowTrustFarmer) rawScore += 15;

  const visitScore = Math.round(Math.max(0, Math.min(100, rawScore)));

  const factors = [
    {
      name: 'AI Confidence',
      rawValue: `${conf.toFixed(1)}%`,
      weight: 0.3,
      contribution: Math.round(confContribution * 10) / 10,
      note: 'PyTorch EfficientNet-B0 softmax confidence'
    },
    {
      name: 'Days Pending',
      rawValue: `${days} day${days !== 1 ? 's' : ''}`,
      weight: 0.25,
      contribution: Math.round(daysContribution * 10) / 10,
      note: 'Since case first logged (older = higher urgency)'
    },
    {
      name: 'Nearby Cases (2 km)',
      rawValue: `${nearby} case${nearby !== 1 ? 's' : ''}`,
      weight: 0.25,
      contribution: Math.round(nearbyContribution * 10) / 10,
      note: 'Cluster density proxy within ~2 km radius'
    },
    {
      name: 'Weather Risk',
      rawValue: wxMultiplier === 1.5 ? '1.5× (Humid + Rain)' : '1.0× (Normal)',
      weight: 0.2,
      contribution: Math.round(wxContribution * 10) / 10,
      note: humidity > 75 && rainForecast
        ? `Humidity ${humidity}% > 75% & rain forecast — fungal spread risk elevated`
        : `Humidity ${humidity}%, no imminent rain — baseline multiplier`
    },
    ...(lowTrustFarmer ? [{
      name: 'Low-Trust Farmer Boost',
      rawValue: 'Trust < 60',
      weight: '—',
      contribution: 15,
      note: 'Farmer credibility < 60 — human verification prioritized'
    }] : [])
  ];

  return { visitScore, weatherRiskMultiplier: wxMultiplier, factors };
}
