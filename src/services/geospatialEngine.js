/**
 * KrushiRaksha Isomorphic Geospatial Hotspot Engine
 * Smart India Hackathon 2026 (Problem #26131)
 *
 * Implements:
 * - Real DBSCAN Clustering with Haversine great-circle distance
 * - Crop & Pathogen isolation
 * - Spatiotemporal velocity (km/day) and bearing heading
 * - Multi-factor explainable risk scoring (LOW, EMERGING, HIGH, CRITICAL)
 * - 2D Convex Hull GeoJSON geometry generation
 * - Dual backend-sync + client-side computation fallback
 */

import { INITIAL_DISEASE_EVENTS } from '../data/diseaseEventsStore';
import { BACKEND_URL } from '../config';

const EARTH_RADIUS_KM = 6371.0088;

// Persistent in-memory event registry (shared across sessions)
let inMemoryEvents = [...INITIAL_DISEASE_EVENTS];

/**
 * Calculates great-circle Haversine distance in kilometers.
 */
export function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/**
 * Calculates 8-wind cardinal compass heading from (lat1, lon1) to (lat2, lon2).
 */
export function calculateBearingDirection(lat1, lon1, lat2, lon2) {
  if (Math.abs(lat1 - lat2) < 0.0001 && Math.abs(lon1 - lon2) < 0.0001) {
    return 'Stationary';
  }

  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
  const bearingRad = Math.atan2(y, x);
  const bearingDeg = ((bearingRad * 180) / Math.PI + 360) % 360;

  const directions = [
    'North',
    'North-East',
    'East',
    'South-East',
    'South',
    'South-West',
    'West',
    'North-West'
  ];
  const index = Math.floor((bearingDeg + 22.5) / 45) % 8;
  return directions[index];
}

/**
 * Computes 2D Convex Hull polygon boundary using Graham Scan / Monotone Chain.
 */
export function computeConvexHull(points) {
  if (points.length <= 2) return points;

  const sorted = [...points].sort((a, b) => (a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]));

  function crossProduct(o, a, b) {
    return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  }

  const lower = [];
  for (const p of sorted) {
    while (lower.length >= 2 && crossProduct(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
      lower.pop();
    }
    lower.push(p);
  }

  const upper = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    const p = sorted[i];
    while (upper.length >= 2 && crossProduct(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
      upper.pop();
    }
    upper.push(p);
  }

  lower.pop();
  upper.pop();
  return lower.concat(upper);
}

/**
 * Pure JavaScript DBSCAN implementation with Haversine distance.
 */
function runDbscan(coords, epsKm, minSamples) {
  const n = coords.length;
  const visited = new Array(n).fill(false);
  const labels = new Array(n).fill(-1);
  let currentCluster = 0;

  for (let i = 0; i < n; i++) {
    if (visited[i]) continue;
    visited[i] = true;

    const neighbors = [];
    for (let j = 0; j < n; j++) {
      if (haversineDistanceKm(coords[i][0], coords[i][1], coords[j][0], coords[j][1]) <= epsKm) {
        neighbors.push(j);
      }
    }

    if (neighbors.length < minSamples) {
      labels[i] = -1; // Noise
    } else {
      labels[i] = currentCluster;
      const queue = neighbors.filter((idx) => idx !== i);

      let head = 0;
      while (head < queue.length) {
        const qIdx = queue[head++];
        if (!visited[qIdx]) {
          visited[qIdx] = true;
          const qNeighbors = [];
          for (let j = 0; j < n; j++) {
            if (haversineDistanceKm(coords[qIdx][0], coords[qIdx][1], coords[j][0], coords[j][1]) <= epsKm) {
              qNeighbors.push(j);
            }
          }
          if (qNeighbors.length >= minSamples) {
            for (const qn of qNeighbors) {
              if (!queue.includes(qn)) queue.push(qn);
            }
          }
        }
        if (labels[qIdx] === -1) {
          labels[qIdx] = currentCluster;
        }
      }
      currentCluster++;
    }
  }
  return labels;
}

/**
 * Local Client-Side Hotspot Cluster Analysis
 */
function analyzeHotspotsClientSide({ cropFilter, districtFilter, epsKm = 15.0, minSamples = 3 }) {
  let events = [...inMemoryEvents];

  if (cropFilter && cropFilter.toLowerCase() !== 'all') {
    events = events.filter((e) => e.crop?.toLowerCase().includes(cropFilter.toLowerCase()));
  }

  if (districtFilter && districtFilter.toLowerCase() !== 'all') {
    events = events.filter((e) => e.district?.toLowerCase().includes(districtFilter.toLowerCase()));
  }

  if (events.length === 0) {
    return {
      success: true,
      total_reports_analyzed: 0,
      active_hotspot_clusters: 0,
      active_cases_total: 0,
      max_spread_velocity: '0.0 km/day',
      clusters: [],
      geojson: { type: 'FeatureCollection', features: [] },
      processed_events: []
    };
  }

  // Partition by crop
  const cropGroups = {};
  for (const ev of events) {
    const c = ev.crop || 'General Crop';
    if (!cropGroups[c]) cropGroups[c] = [];
    cropGroups[c].push(ev);
  }

  const hotspotClusters = [];
  const allGeojsonFeatures = [];
  let globalClusterIdx = 1;

  for (const [cropName, cropEvents] of Object.entries(cropGroups)) {
    if (cropEvents.length < minSamples) {
      cropEvents.forEach((e) => (e.cluster_id = -1));
      continue;
    }

    const coords = cropEvents.map((e) => [e.lat, e.lng]);
    const labels = runDbscan(coords, epsKm, minSamples);

    const clusterBuckets = {};
    labels.forEach((label, idx) => {
      cropEvents[idx].cluster_id = label;
      if (label !== -1) {
        if (!clusterBuckets[label]) clusterBuckets[label] = [];
        clusterBuckets[label].push(cropEvents[idx]);
      }
    });

    for (const [label, cEvents] of Object.entries(clusterBuckets)) {
      const clusterId = `hs-${String(globalClusterIdx++).padStart(2, '0')}`;
      const lats = cEvents.map((e) => e.lat);
      const lngs = cEvents.map((e) => e.lng);
      const centerLat = Number((lats.reduce((a, b) => a + b, 0) / lats.length).toFixed(5));
      const centerLng = Number((lngs.reduce((a, b) => a + b, 0) / lngs.length).toFixed(5));

      const distances = lats.map((lat, i) => haversineDistanceKm(centerLat, centerLng, lat, lngs[i]));
      const maxDist = Math.max(...distances);
      const clusterRadiusKm = Number(Math.max(maxDist + 0.8, 2.5).toFixed(1));
      const bufferRadiusKm = Number((clusterRadiusKm + 3.0).toFixed(1));

      // Dominant disease
      const diseases = cEvents.map((e) => e.disease || 'Unknown Disease');
      const dominantDisease = diseases.sort(
        (a, b) => diseases.filter((v) => v === a).length - diseases.filter((v) => v === b).length
      ).pop();

      // Primary District & Taluka
      const primaryDistrict = cEvents[0].district || 'Maharashtra';
      const primaryTaluka = cEvents[0].taluka || primaryDistrict;

      // Mean Confidence
      const confidences = cEvents.map((e) => e.confidence || 85);
      const meanConfidence = Math.round(confidences.reduce((a, b) => a + b, 0) / confidences.length);

      // Spatiotemporal timestamps
      const validTsEvents = cEvents
        .map((e) => ({ ...e, dt: new Date(e.timestamp || 0).getTime() }))
        .filter((e) => e.dt > 0)
        .sort((a, b) => a.dt - b.dt);

      let spreadVelocityStr = 'Insufficient data';
      let spreadVelocityNumeric = 0.0;
      let spreadDirection = 'Stationary';
      let growthRatePct = 0;

      if (validTsEvents.length >= 3) {
        const tStart = validTsEvents[0].dt;
        const tEnd = validTsEvents[validTsEvents.length - 1].dt;
        const totalDays = Math.max((tEnd - tStart) / 86400000, 0.01);

        if (totalDays >= 1.0) {
          const midIdx = Math.floor(validTsEvents.length / 2);
          const earlyPts = validTsEvents.slice(0, midIdx);
          const recentPts = validTsEvents.slice(midIdx);

          const earlyLat = earlyPts.reduce((sum, p) => sum + p.lat, 0) / earlyPts.length;
          const earlyLng = earlyPts.reduce((sum, p) => sum + p.lng, 0) / earlyPts.length;
          const recentLat = recentPts.reduce((sum, p) => sum + p.lat, 0) / recentPts.length;
          const recentLng = recentPts.reduce((sum, p) => sum + p.lng, 0) / recentPts.length;

          const driftKm = haversineDistanceKm(earlyLat, earlyLng, recentLat, recentLng);
          const timeDeltaDays = Math.max(totalDays / 2.0, 0.5);

          const velocity = Number((driftKm / timeDeltaDays).toFixed(1));
          spreadVelocityNumeric = velocity;
          spreadDirection = calculateBearingDirection(earlyLat, earlyLng, recentLat, recentLng);

          if (velocity > 0.3) {
            spreadVelocityStr = `${spreadDirection} (${velocity} km/day)`;
          } else {
            spreadVelocityStr = 'Stationary (<0.3 km/day)';
          }

          growthRatePct = Math.round(((recentPts.length - earlyPts.length) / Math.max(earlyPts.length, 1)) * 100);
        }
      }

      // Risk score calculation
      const areaSqKm = Math.PI * clusterRadiusKm ** 2;
      const density = cEvents.length / Math.max(areaSqKm, 1.0);
      const sDensity = Math.min(density * 18.0, 100.0);

      const severities = cEvents.map((e) => (e.severity || 'Medium').toLowerCase());
      const critCount = severities.filter((s) => s === 'critical').length;
      const highCount = severities.filter((s) => s === 'high').length;
      const medCount = severities.filter((s) => s === 'medium').length;
      const sSeverity = Math.min(((critCount * 30 + highCount * 18 + medCount * 10) / cEvents.length) * 3.2, 100.0);

      const sGrowth = Math.min(Math.max(growthRatePct, 0) * 1.2, 100.0);
      const sVelocity = Math.min(spreadVelocityNumeric * 22.0, 100.0);
      const sConfidence = meanConfidence;

      const totalRiskScore = Math.round(
        0.3 * sDensity + 0.25 * sSeverity + 0.2 * sGrowth + 0.15 * sVelocity + 0.1 * sConfidence
      );

      let riskLevel = 'LOW';
      let containmentStatus = 'Monitored Baseline';
      let headerColor = '#10B981';

      if (totalRiskScore >= 75 || cEvents.length >= 15) {
        riskLevel = 'CRITICAL';
        containmentStatus = 'Red Alert Contagion';
        headerColor = '#EF4444';
      } else if (totalRiskScore >= 55 || cEvents.length >= 8) {
        riskLevel = 'HIGH';
        containmentStatus = 'Active Containment Zone';
        headerColor = '#F59E0B';
      } else if (totalRiskScore >= 32) {
        riskLevel = 'EMERGING';
        containmentStatus = 'Surveillance Mode';
        headerColor = '#3B82F6';
      }

      const estimatedFarmers = Math.round(areaSqKm * 32);

      let treatment = 'Apply prophylactic Copper Oxychloride (2.5g/L). Avoid overhead irrigation.';
      const disLower = dominantDisease.toLowerCase();
      if (disLower.includes('bollworm')) {
        treatment = 'Install 8 pheromone traps/acre and release Trichogramma cards (60k/acre) or spray Emamectin Benzoate.';
      } else if (disLower.includes('rust')) {
        treatment = 'Spray Hexaconazole 5% EC (1ml/L) before canopy closure. Ensure adequate row aeration.';
      } else if (disLower.includes('blight') || disLower.includes('mildew')) {
        treatment = 'Apply Mancozeb 75% WP (2.5g/L) OR Metalaxyl-Mancozeb (2.0g/L) before rain.';
      }

      const alertMessage = `GOVERNMENT OF MAHARASHTRA ${riskLevel} CROP ALERT: Active ${dominantDisease} cluster detected in ${primaryTaluka}, ${primaryDistrict}. ${treatment}`;

      const hullCoords = computeConvexHull(lats.map((lat, i) => [lat, lngs[i]]));

      let vectorLineCoords = null;
      if (spreadVelocityNumeric > 0.3 && spreadDirection !== 'Stationary') {
        const headingDeg = {
          North: 0,
          'North-East': 45,
          East: 90,
          'South-East': 135,
          South: 180,
          'South-West': 225,
          West: 270,
          'North-West': 315
        }[spreadDirection] || 45;

        const headingRad = (headingDeg * Math.PI) / 180;
        const destLat = centerLat + (4.0 / 111.0) * Math.cos(headingRad);
        const destLng = centerLng + (4.0 / (111.0 * Math.cos((centerLat * Math.PI) / 180))) * Math.sin(headingRad);
        vectorLineCoords = [
          [centerLat, centerLng],
          [Number(destLat.toFixed(5)), Number(destLng.toFixed(5))]
        ];
      }

      const clusterObj = {
        id: clusterId,
        district: primaryDistrict,
        taluka: primaryTaluka,
        lat: centerLat,
        lng: centerLng,
        crop: cropName,
        disease: dominantDisease,
        severity: riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1).toLowerCase(),
        risk_level: riskLevel,
        risk_score: totalRiskScore,
        activeCasesCount: cEvents.length,
        active_cases_count: cEvents.length,
        radiusKm: clusterRadiusKm,
        radius_km: clusterRadiusKm,
        bufferKm: bufferRadiusKm,
        buffer_km: bufferRadiusKm,
        reportedDate: validTsEvents.length ? new Date(validTsEvents[validTsEvents.length - 1].dt).toISOString().split('T')[0] : '2026-08-22',
        vectorDirection: spreadVelocityStr,
        vector_direction: spreadDirection,
        spread_velocity_numeric: spreadVelocityNumeric,
        vector_line_coords: vectorLineCoords,
        containmentStatus,
        farmersInRadius: estimatedFarmers,
        farmers_in_radius: estimatedFarmers,
        mean_confidence: meanConfidence,
        lastAdvisorySent: 'Today 08:30 IST',
        alertMessage,
        polygon_coords: hullCoords,
        color: headerColor,
        points: cEvents
      };

      hotspotClusters.push(clusterObj);

      // GeoJSON point
      allGeojsonFeatures.push({
        type: 'Feature',
        id: `${clusterId}-center`,
        geometry: { type: 'Point', coordinates: [centerLng, centerLat] },
        properties: { ...clusterObj }
      });

      // GeoJSON polygon
      if (hullCoords.length >= 3) {
        const polyRing = hullCoords.map((p) => [p[1], p[0]]);
        polyRing.push(polyRing[0]);
        allGeojsonFeatures.push({
          type: 'Feature',
          id: `${clusterId}-boundary`,
          geometry: { type: 'Polygon', coordinates: [polyRing] },
          properties: { cluster_id: clusterId, color: headerColor, risk_level: riskLevel }
        });
      }
    }
  }

  hotspotClusters.sort((a, b) => b.risk_score - a.risk_score);

  const totalCases = hotspotClusters.reduce((sum, c) => sum + c.active_cases_count, 0);
  const velocities = hotspotClusters
    .map((c) => c.spread_velocity_numeric)
    .filter((v) => typeof v === 'number' && v > 0);
  const maxVelocity = velocities.length ? `${Math.max(...velocities).toFixed(1)} km/day` : 'Insufficient data';

  return {
    success: true,
    total_reports_analyzed: events.length,
    active_hotspot_clusters: hotspotClusters.length,
    active_cases_total: totalCases,
    max_spread_velocity: maxVelocity,
    clusters: hotspotClusters,
    geojson: {
      type: 'FeatureCollection',
      features: allGeojsonFeatures
    },
    processed_events: events
  };
}

/**
 * Public API: Fetches hotspots either from FastAPI backend or falls back seamlessly to client engine.
 */
export async function getGeospatialHotspots({
  cropFilter = 'All',
  districtFilter = 'All',
  epsKm = 15.0,
  minSamples = 3
} = {}) {
  try {
    const params = new URLSearchParams();
    if (cropFilter && cropFilter !== 'All') params.append('crop', cropFilter);
    if (districtFilter && districtFilter !== 'All') params.append('district', districtFilter);
    if (epsKm) params.append('eps_km', epsKm);
    if (minSamples) params.append('min_samples', minSamples);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800);

    const response = await fetch(`${BACKEND_URL}/api/geospatial/hotspots?${params.toString()}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.success && data.clusters) {
        return data;
      }
    }
  } catch (e) {
    // Backend offline or timeout -> use isomorphic client-side engine
  }

  return analyzeHotspotsClientSide({ cropFilter, districtFilter, epsKm, minSamples });
}

/**
 * Ingests a new disease event and returns updated cluster analysis.
 */
export async function recordDiseaseEvent(eventData) {
  const newEvt = {
    id: `EVT-LIVE-${Date.now()}`,
    lat: Number(Number(eventData.lat || 20.082).toFixed(5)),
    lng: Number(Number(eventData.lng || 73.912).toFixed(5)),
    crop: eventData.crop || 'Tomato',
    disease: eventData.disease || 'Late Blight',
    confidence: eventData.confidence || 92,
    severity: eventData.severity || 'High',
    timestamp: new Date().toISOString(),
    district: eventData.district || 'Nashik',
    taluka: eventData.taluka || 'Niphad',
    source: eventData.source || 'Farmer Scanner'
  };

  inMemoryEvents.unshift(newEvt);

  // Attempt backend async push
  try {
    fetch(`${BACKEND_URL}/api/geospatial/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvt)
    }).catch(() => {});
  } catch (e) {}

  return analyzeHotspotsClientSide({ cropFilter: 'All' });
}

export function getAllEvents() {
  return inMemoryEvents;
}
