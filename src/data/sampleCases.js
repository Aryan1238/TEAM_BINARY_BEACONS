export const sampleCases = [
  {
    id: 'case-tomato-01',
    title: 'Tomato Late Blight Sample',
    crop: 'Tomato',
    district: 'Nashik, Maharashtra',
    diseaseId: 'tomato-late-blight',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23961?auto=format&fit=crop&w=800&q=80',
    description: 'Dark necrotic water-soaked lesion on leaf tip with yellow chlorotic margin. Sample collected from Niphad taluka.',
    bbox: { x: 28, y: 32, width: 44, height: 42 },
    saliencyPoints: [
      { x: 38, y: 44, intensity: 0.95 },
      { x: 50, y: 35, intensity: 0.88 },
      { x: 42, y: 55, intensity: 0.76 }
    ],
    confidence: 94,
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
    description: 'Rosetted flower with internal petal interlocking and exit hole in developing green boll.',
    bbox: { x: 32, y: 25, width: 40, height: 50 },
    saliencyPoints: [
      { x: 45, y: 40, intensity: 0.98 },
      { x: 52, y: 58, intensity: 0.91 }
    ],
    confidence: 96,
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
    description: 'Yellow oily spot on upper blade with corresponding white sporulation on leaf underside.',
    bbox: { x: 22, y: 20, width: 55, height: 48 },
    saliencyPoints: [
      { x: 35, y: 38, intensity: 0.96 },
      { x: 58, y: 42, intensity: 0.89 }
    ],
    confidence: 97,
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
    description: 'Dense reddish-brown rust pustules on lower leaf canopy causing early chlorosis.',
    bbox: { x: 30, y: 30, width: 45, height: 45 },
    saliencyPoints: [
      { x: 48, y: 48, intensity: 0.92 },
      { x: 40, y: 56, intensity: 0.85 }
    ],
    confidence: 91,
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
    description: 'Internal vascular reddening with transverse white bands upon stalk split.',
    bbox: { x: 25, y: 15, width: 50, height: 70 },
    saliencyPoints: [
      { x: 48, y: 35, intensity: 0.97 },
      { x: 50, y: 60, intensity: 0.94 }
    ],
    confidence: 95,
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
    description: 'Normal healthy foliage with uniform chlorophyll distribution and crisp leaf margins.',
    bbox: null,
    saliencyPoints: [],
    confidence: 99,
    severity: 'Healthy (Grade S0)',
    chlorosisPercent: '0%'
  }
];