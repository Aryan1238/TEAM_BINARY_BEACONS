export const sampleCases = [
  {
    id: 'case-tomato-01',
    title: 'Tomato Late Blight Sample',
    crop: 'Tomato',
    district: 'Nashik, Maharashtra',
    diseaseId: 'tomato-late-blight',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23961?auto=format&fit=crop&w=800&q=80',
    fallbackSvg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%230F382A"/><ellipse cx="200" cy="150" rx="140" ry="90" fill="%232D6A4F"/><ellipse cx="180" cy="140" rx="60" ry="40" fill="%234A2E18"/><ellipse cx="170" cy="135" rx="40" ry="25" fill="%231E120B"/><ellipse cx="230" cy="165" rx="30" ry="20" fill="%23E6A122" opacity="0.6"/><text x="20" y="35" fill="%23E6A122" font-family="monospace" font-size="14" font-weight="bold">PlantVillage Specimen #26131</text></svg>',
    description: 'Dark necrotic water-soaked lesion on leaf tip with yellow chlorotic margin. Sample collected from Niphad taluka.',
    bbox: { x: 28, y: 32, width: 44, height: 42 },
    saliencyPoints: [
      { x: 38, y: 44, intensity: 0.95 },
      { x: 50, y: 35, intensity: 0.88 },
      { x: 42, y: 55, intensity: 0.76 }
    ],
    confidence: 94.8,
    severity: 'Moderate (Grade S2)',
    chlorosisPercent: '28%'
  },
  {
    id: 'case-cotton-01',
    title: 'Cotton Pink Bollworm Infestation',
    crop: 'Cotton',
    district: 'Yavatmal, Maharashtra',
    diseaseId: 'cotton-pink-bollworm',
    imageUrl: 'https://images.unsplash.com/photo-1598880940371-c756e015fea1?auto=format&fit=crop&w=800&q=80',
    fallbackSvg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%230F382A"/><ellipse cx="200" cy="150" rx="130" ry="85" fill="%232E7D32"/><circle cx="190" cy="140" r="35" fill="%23FFEB3B" opacity="0.8"/><circle cx="185" cy="138" r="15" fill="%23B71C1C"/><text x="20" y="35" fill="%23FF5252" font-family="monospace" font-size="14" font-weight="bold">IP102 Cotton Pest Specimen</text></svg>',
    description: 'Rosetted flower with internal petal interlocking and exit hole in green boll.',
    bbox: { x: 32, y: 25, width: 40, height: 50 },
    saliencyPoints: [
      { x: 45, y: 40, intensity: 0.98 },
      { x: 52, y: 58, intensity: 0.91 }
    ],
    confidence: 96.2,
    severity: 'Severe (Grade S3)',
    trapReading: '14 moths / trap / night (Crossed ETL)',
    chlorosisPercent: '42%'
  },
  {
    id: 'case-grapes-01',
    title: 'Grape Downy Mildew Leaf Lesion',
    crop: 'Grapes',
    district: 'Nashik (Dindori), MH',
    diseaseId: 'grape-downy-mildew',
    imageUrl: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=800&q=80',
    fallbackSvg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%230F382A"/><ellipse cx="200" cy="150" rx="135" ry="90" fill="%231B5E20"/><ellipse cx="170" cy="130" rx="45" ry="35" fill="%23FDD835" opacity="0.85"/><ellipse cx="220" cy="170" rx="35" ry="25" fill="%23FFF" opacity="0.9"/><text x="20" y="35" fill="%23FDD835" font-family="monospace" font-size="14" font-weight="bold">Grape Downy Mildew #26131</text></svg>',
    description: 'Yellow oily spot on upper blade with corresponding white sporulation on leaf underside.',
    bbox: { x: 22, y: 20, width: 55, height: 48 },
    saliencyPoints: [
      { x: 35, y: 38, intensity: 0.96 },
      { x: 58, y: 42, intensity: 0.89 }
    ],
    confidence: 97.4,
    severity: 'High (Grade S3)',
    chlorosisPercent: '35%'
  },
  {
    id: 'case-soybean-01',
    title: 'Soybean Rust Pustules',
    crop: 'Soybean',
    district: 'Amravati, Maharashtra',
    diseaseId: 'soybean-rust',
    imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
    fallbackSvg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%230F382A"/><ellipse cx="200" cy="150" rx="140" ry="85" fill="%2333691E"/><circle cx="160" cy="130" r="10" fill="%23BF360C"/><circle cx="185" cy="155" r="12" fill="%23D84315"/><circle cx="220" cy="140" r="9" fill="%23E64A19"/><text x="20" y="35" fill="%23FFAB91" font-family="monospace" font-size="14" font-weight="bold">Soybean Rust Specimen</text></svg>',
    description: 'Dense reddish-brown rust pustules on lower leaf canopy causing early chlorosis.',
    bbox: { x: 30, y: 30, width: 45, height: 45 },
    saliencyPoints: [
      { x: 48, y: 48, intensity: 0.92 },
      { x: 40, y: 56, intensity: 0.85 }
    ],
    confidence: 91.5,
    severity: 'Moderate (Grade S2)',
    chlorosisPercent: '22%'
  },
  {
    id: 'case-sugarcane-01',
    title: 'Sugarcane Red Rot Symptoms',
    crop: 'Sugarcane',
    district: 'Kolhapur, Maharashtra',
    diseaseId: 'sugarcane-red-rot',
    imageUrl: 'https://images.unsplash.com/photo-1544078741-7ea0e0cb8007?auto=format&fit=crop&w=800&q=80',
    fallbackSvg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%230F382A"/><rect x="140" y="20" width="120" height="260" rx="20" fill="%23689F38"/><rect x="170" y="40" width="60" height="220" rx="10" fill="%23B71C1C"/><rect x="175" y="90" width="50" height="15" rx="5" fill="%23FFF"/><text x="20" y="35" fill="%23FF8A80" font-family="monospace" font-size="14" font-weight="bold">Sugarcane Red Rot</text></svg>',
    description: 'Internal vascular reddening with transverse white bands upon stalk split.',
    bbox: { x: 25, y: 15, width: 50, height: 70 },
    saliencyPoints: [
      { x: 48, y: 35, intensity: 0.97 },
      { x: 50, y: 60, intensity: 0.94 }
    ],
    confidence: 95.1,
    severity: 'Severe (Grade S3)',
    chlorosisPercent: '50%'
  },
  {
    id: 'case-healthy-01',
    title: 'Healthy Specimen (Control Sample)',
    crop: 'Tomato',
    district: 'Pune, Maharashtra',
    diseaseId: 'healthy-crop',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
    fallbackSvg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%230F382A"/><ellipse cx="200" cy="150" rx="145" ry="95" fill="%232E7D32"/><path d="M100,150 Q200,80 300,150 Q200,220 100,150" fill="%234CAF50"/><text x="20" y="35" fill="%2381C784" font-family="monospace" font-size="14" font-weight="bold">Healthy Crop Foliage</text></svg>',
    description: 'Normal healthy foliage with uniform chlorophyll distribution and crisp leaf margins.',
    bbox: null,
    saliencyPoints: [],
    confidence: 99.2,
    severity: 'Healthy (Grade S0)',
    chlorosisPercent: '0%'
  }
];
