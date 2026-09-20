/**
 * KrushiRaksha Disease Events Data Store
 * Grounded time-series geotagged disease reports across Maharashtra agricultural belts.
 */

const baseTime = new Date('2026-08-22T10:00:00Z').getTime();
const dayMs = 86400000;

export const INITIAL_DISEASE_EVENTS = [
  // Cluster 1: Nashik (Niphad / Dindori) - Tomato Late Blight (Spreading North-East)
  {
    id: 'EVT-NSK-01',
    lat: 20.0820,
    lng: 73.9120,
    crop: 'Tomato',
    disease: 'Late Blight',
    confidence: 94,
    severity: 'Critical',
    timestamp: new Date(baseTime - 6 * dayMs).toISOString(),
    district: 'Nashik',
    taluka: 'Niphad',
    source: 'Farmer App'
  },
  {
    id: 'EVT-NSK-02',
    lat: 20.0880,
    lng: 73.9180,
    crop: 'Tomato',
    disease: 'Late Blight',
    confidence: 92,
    severity: 'Critical',
    timestamp: new Date(baseTime - 5 * dayMs).toISOString(),
    district: 'Nashik',
    taluka: 'Niphad',
    source: 'Farmer App'
  },
  {
    id: 'EVT-NSK-03',
    lat: 20.0950,
    lng: 73.9250,
    crop: 'Tomato',
    disease: 'Late Blight',
    confidence: 89,
    severity: 'High',
    timestamp: new Date(baseTime - 4 * dayMs).toISOString(),
    district: 'Nashik',
    taluka: 'Niphad',
    source: 'Extension Scout'
  },
  {
    id: 'EVT-NSK-04',
    lat: 20.1020,
    lng: 73.9310,
    crop: 'Tomato',
    disease: 'Late Blight',
    confidence: 96,
    severity: 'Critical',
    timestamp: new Date(baseTime - 3 * dayMs).toISOString(),
    district: 'Nashik',
    taluka: 'Dindori',
    source: 'Drone Survey'
  },
  {
    id: 'EVT-NSK-05',
    lat: 20.1080,
    lng: 73.9380,
    crop: 'Tomato',
    disease: 'Late Blight',
    confidence: 93,
    severity: 'Critical',
    timestamp: new Date(baseTime - 2 * dayMs).toISOString(),
    district: 'Nashik',
    taluka: 'Dindori',
    source: 'Farmer App'
  },
  {
    id: 'EVT-NSK-06',
    lat: 20.1140,
    lng: 73.9450,
    crop: 'Tomato',
    disease: 'Late Blight',
    confidence: 95,
    severity: 'Critical',
    timestamp: new Date(baseTime - 1 * dayMs).toISOString(),
    district: 'Nashik',
    taluka: 'Dindori',
    source: 'Extension Scout'
  },
  {
    id: 'EVT-NSK-07',
    lat: 20.1200,
    lng: 73.9520,
    crop: 'Tomato',
    disease: 'Late Blight',
    confidence: 91,
    severity: 'High',
    timestamp: new Date(baseTime).toISOString(),
    district: 'Nashik',
    taluka: 'Dindori',
    source: 'Farmer App'
  },

  // Cluster 2: Yavatmal (Ghatanji / Kelapur) - Cotton Pink Bollworm (Spreading South-East)
  {
    id: 'EVT-YTL-01',
    lat: 20.1330,
    lng: 78.3180,
    crop: 'Cotton',
    disease: 'Pink Bollworm',
    confidence: 95,
    severity: 'Critical',
    timestamp: new Date(baseTime - 7 * dayMs).toISOString(),
    district: 'Yavatmal',
    taluka: 'Ghatanji',
    source: 'IoT Trap'
  },
  {
    id: 'EVT-YTL-02',
    lat: 20.1280,
    lng: 78.3250,
    crop: 'Cotton',
    disease: 'Pink Bollworm',
    confidence: 91,
    severity: 'Critical',
    timestamp: new Date(baseTime - 5 * dayMs).toISOString(),
    district: 'Yavatmal',
    taluka: 'Ghatanji',
    source: 'Farmer App'
  },
  {
    id: 'EVT-YTL-03',
    lat: 20.1220,
    lng: 78.3320,
    crop: 'Cotton',
    disease: 'Pink Bollworm',
    confidence: 88,
    severity: 'High',
    timestamp: new Date(baseTime - 4 * dayMs).toISOString(),
    district: 'Yavatmal',
    taluka: 'Kelapur',
    source: 'Farmer App'
  },
  {
    id: 'EVT-YTL-04',
    lat: 20.1150,
    lng: 78.3410,
    crop: 'Cotton',
    disease: 'Pink Bollworm',
    confidence: 94,
    severity: 'Critical',
    timestamp: new Date(baseTime - 2 * dayMs).toISOString(),
    district: 'Yavatmal',
    taluka: 'Kelapur',
    source: 'Extension Scout'
  },
  {
    id: 'EVT-YTL-05',
    lat: 20.1080,
    lng: 78.3490,
    crop: 'Cotton',
    disease: 'Pink Bollworm',
    confidence: 96,
    severity: 'Critical',
    timestamp: new Date(baseTime).toISOString(),
    district: 'Yavatmal',
    taluka: 'Kelapur',
    source: 'IoT Trap'
  },

  // Cluster 3: Nashik (Satana / Kalwan) - Pomegranate Bacterial Blight (Spreading East)
  {
    id: 'EVT-NSK-08',
    lat: 20.5900,
    lng: 74.2000,
    crop: 'Pomegranate',
    disease: 'Bacterial Blight (Telya)',
    confidence: 88,
    severity: 'Medium',
    timestamp: new Date(baseTime - 5 * dayMs).toISOString(),
    district: 'Nashik',
    taluka: 'Satana',
    source: 'Farmer App'
  },
  {
    id: 'EVT-NSK-09',
    lat: 20.5920,
    lng: 74.2150,
    crop: 'Pomegranate',
    disease: 'Bacterial Blight (Telya)',
    confidence: 90,
    severity: 'High',
    timestamp: new Date(baseTime - 3 * dayMs).toISOString(),
    district: 'Nashik',
    taluka: 'Satana',
    source: 'Farmer App'
  },
  {
    id: 'EVT-NSK-10',
    lat: 20.5940,
    lng: 74.2300,
    crop: 'Pomegranate',
    disease: 'Bacterial Blight (Telya)',
    confidence: 87,
    severity: 'Medium',
    timestamp: new Date(baseTime - 1 * dayMs).toISOString(),
    district: 'Nashik',
    taluka: 'Kalwan',
    source: 'Extension Scout'
  },
  {
    id: 'EVT-NSK-11',
    lat: 20.5950,
    lng: 74.2420,
    crop: 'Pomegranate',
    disease: 'Bacterial Blight (Telya)',
    confidence: 89,
    severity: 'High',
    timestamp: new Date(baseTime).toISOString(),
    district: 'Nashik',
    taluka: 'Kalwan',
    source: 'Farmer App'
  },

  // Cluster 4: Amravati (Achalpur / Morshi) - Soybean Rust (Spreading West)
  {
    id: 'EVT-AMR-01',
    lat: 21.2580,
    lng: 77.5120,
    crop: 'Soybean',
    disease: 'Soybean Rust',
    confidence: 92,
    severity: 'High',
    timestamp: new Date(baseTime - 6 * dayMs).toISOString(),
    district: 'Amravati',
    taluka: 'Achalpur',
    source: 'Farmer App'
  },
  {
    id: 'EVT-AMR-02',
    lat: 21.2550,
    lng: 77.4980,
    crop: 'Soybean',
    disease: 'Soybean Rust',
    confidence: 89,
    severity: 'High',
    timestamp: new Date(baseTime - 4 * dayMs).toISOString(),
    district: 'Amravati',
    taluka: 'Achalpur',
    source: 'Farmer App'
  },
  {
    id: 'EVT-AMR-03',
    lat: 21.2520,
    lng: 77.4850,
    crop: 'Soybean',
    disease: 'Soybean Rust',
    confidence: 94,
    severity: 'High',
    timestamp: new Date(baseTime - 2 * dayMs).toISOString(),
    district: 'Amravati',
    taluka: 'Morshi',
    source: 'Extension Scout'
  },
  {
    id: 'EVT-AMR-04',
    lat: 21.2490,
    lng: 77.4700,
    crop: 'Soybean',
    disease: 'Soybean Rust',
    confidence: 91,
    severity: 'High',
    timestamp: new Date(baseTime).toISOString(),
    district: 'Amravati',
    taluka: 'Morshi',
    source: 'Farmer App'
  },

  // Cluster 5: Jalgaon (Raver / Yaval) - Cotton Pink Bollworm (Spreading North-West)
  {
    id: 'EVT-JAL-01',
    lat: 21.2400,
    lng: 75.8600,
    crop: 'Cotton',
    disease: 'Pink Bollworm',
    confidence: 90,
    severity: 'High',
    timestamp: new Date(baseTime - 5 * dayMs).toISOString(),
    district: 'Jalgaon',
    taluka: 'Raver',
    source: 'IoT Trap'
  },
  {
    id: 'EVT-JAL-02',
    lat: 21.2480,
    lng: 75.8500,
    crop: 'Cotton',
    disease: 'Pink Bollworm',
    confidence: 93,
    severity: 'High',
    timestamp: new Date(baseTime - 3 * dayMs).toISOString(),
    district: 'Jalgaon',
    taluka: 'Raver',
    source: 'Farmer App'
  },
  {
    id: 'EVT-JAL-03',
    lat: 21.2550,
    lng: 75.8400,
    crop: 'Cotton',
    disease: 'Pink Bollworm',
    confidence: 88,
    severity: 'Medium',
    timestamp: new Date(baseTime).toISOString(),
    district: 'Jalgaon',
    taluka: 'Yaval',
    source: 'Farmer App'
  },

  // Cluster 6: Nashik (Nashik Rural) - Grapes Downy Mildew
  {
    id: 'EVT-GRP-01',
    lat: 19.9850,
    lng: 73.8100,
    crop: 'Grapes',
    disease: 'Downy Mildew',
    confidence: 91,
    severity: 'High',
    timestamp: new Date(baseTime - 4 * dayMs).toISOString(),
    district: 'Nashik',
    taluka: 'Nashik Rural',
    source: 'Farmer App'
  },
  {
    id: 'EVT-GRP-02',
    lat: 19.9920,
    lng: 73.8220,
    crop: 'Grapes',
    disease: 'Downy Mildew',
    confidence: 95,
    severity: 'Critical',
    timestamp: new Date(baseTime - 2 * dayMs).toISOString(),
    district: 'Nashik',
    taluka: 'Nashik Rural',
    source: 'Drone Survey'
  },
  {
    id: 'EVT-GRP-03',
    lat: 20.0010,
    lng: 73.8350,
    crop: 'Grapes',
    disease: 'Downy Mildew',
    confidence: 92,
    severity: 'High',
    timestamp: new Date(baseTime).toISOString(),
    district: 'Nashik',
    taluka: 'Nashik Rural',
    source: 'Farmer App'
  },

  // Isolated events (demonstrates DBSCAN noise handling & 'Insufficient data' spatiotemporal condition)
  {
    id: 'EVT-PUN-01',
    lat: 18.5204,
    lng: 73.8567,
    crop: 'Tomato',
    disease: 'Early Blight',
    confidence: 82,
    severity: 'Low',
    timestamp: new Date(baseTime).toISOString(),
    district: 'Pune',
    taluka: 'Haveli',
    source: 'Farmer App'
  },
  {
    id: 'EVT-SOL-01',
    lat: 17.6599,
    lng: 75.9064,
    crop: 'Pomegranate',
    disease: 'Bacterial Blight',
    confidence: 85,
    severity: 'Medium',
    timestamp: new Date(baseTime).toISOString(),
    district: 'Solapur',
    taluka: 'South Solapur',
    source: 'Farmer App'
  }
];
