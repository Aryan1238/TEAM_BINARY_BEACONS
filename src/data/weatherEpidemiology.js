export const districtForecasts = {
  Nashik: {
    district: 'Nashik',
    temp: 24.5,
    humidity: 91,
    rainfallProb: 75,
    rainfallExpectedMm: 18.2,
    windSpeedKmH: 8.4,
    leafWetnessHours: 11,
    gddAccumulated: 840,
    currentStatus: 'High Outbreak Risk',
    diseaseRisks: [
      { disease: 'Tomato Late Blight', risk: 88, status: 'Severe Threat', trigger: 'Leaf wetness > 10 hrs & RH 91%' },
      { disease: 'Grape Downy Mildew', risk: 82, status: 'High Threat', trigger: '3-10 rule met (18mm rain, 24°C temp)' },
      { disease: 'Pomegranate Blight', risk: 45, status: 'Moderate', trigger: 'Moderate rain splash potential' }
    ],
    safeSprayToday: {
      safe: false,
      reason: 'Rain expected within 3 hours (75% probability). Chemical spray will wash off. Wait for dry window tomorrow morning.'
    },
    sevenDayForecast: [
      { day: 'Sat (Today)', tempHigh: 27, tempLow: 21, rh: 91, rainMm: 18, riskScore: 88, status: 'High Risk' },
      { day: 'Sun', tempHigh: 28, tempLow: 20, rh: 88, rainMm: 12, riskScore: 78, status: 'High Risk' },
      { day: 'Mon', tempHigh: 29, tempLow: 22, rh: 76, rainMm: 4, riskScore: 55, status: 'Moderate' },
      { day: 'Tue (Safe Spray)', tempHigh: 31, tempLow: 21, rh: 65, rainMm: 0, riskScore: 32, status: 'Safe Window' },
      { day: 'Wed (Safe Spray)', tempHigh: 31, tempLow: 22, rh: 62, rainMm: 0, riskScore: 28, status: 'Safe Window' },
      { day: 'Thu', tempHigh: 30, tempLow: 23, rh: 74, rainMm: 6, riskScore: 48, status: 'Moderate' },
      { day: 'Fri', tempHigh: 28, tempLow: 21, rh: 85, rainMm: 15, riskScore: 72, status: 'Elevated' }
    ]
  },
  Yavatmal: {
    district: 'Yavatmal',
    temp: 32.0,
    humidity: 68,
    rainfallProb: 20,
    rainfallExpectedMm: 1.5,
    windSpeedKmH: 11.2,
    leafWetnessHours: 3,
    gddAccumulated: 1420,
    currentStatus: 'Critical Pest Emergence Risk',
    diseaseRisks: [
      { disease: 'Pink Bollworm (Cotton)', risk: 94, status: 'Critical Epidemic', trigger: 'High degree-day accumulation (1420 GDD) matches 3rd generation moth flight' },
      { disease: 'Soybean Rust', risk: 40, status: 'Low-Moderate', trigger: 'Dry spells inhibiting fungal sporulation' },
      { disease: 'Whitefly / Sucking Pests', risk: 78, status: 'High Threat', trigger: 'Warm dry conditions favoring nymph multiplication' }
    ],
    safeSprayToday: {
      safe: true,
      reason: 'Low rain probability (20%) and optimal evening wind speed. Ideal for evening application of bio-agents or targeted larvicides.'
    },
    sevenDayForecast: [
      { day: 'Sat (Today)', tempHigh: 34, tempLow: 25, rh: 68, rainMm: 1, riskScore: 94, status: 'Critical Pest Risk' },
      { day: 'Sun', tempHigh: 35, tempLow: 26, rh: 65, rainMm: 0, riskScore: 92, status: 'Critical Pest Risk' },
      { day: 'Mon', tempHigh: 35, tempLow: 25, rh: 62, rainMm: 0, riskScore: 89, status: 'High Pest Risk' },
      { day: 'Tue', tempHigh: 33, tempLow: 24, rh: 72, rainMm: 5, riskScore: 75, status: 'High Pest Risk' },
      { day: 'Wed', tempHigh: 32, tempLow: 24, rh: 78, rainMm: 10, riskScore: 68, status: 'Moderate' },
      { day: 'Thu', tempHigh: 33, tempLow: 25, rh: 70, rainMm: 2, riskScore: 72, status: 'High' },
      { day: 'Fri', tempHigh: 34, tempLow: 26, rh: 66, rainMm: 0, riskScore: 80, status: 'High' }
    ]
  },
  Amravati: {
    district: 'Amravati',
    temp: 30.5,
    humidity: 78,
    rainfallProb: 45,
    rainfallExpectedMm: 8.0,
    windSpeedKmH: 9.0,
    leafWetnessHours: 7,
    gddAccumulated: 1280,
    currentStatus: 'Elevated Risk (Rust & Bollworm)',
    diseaseRisks: [
      { disease: 'Soybean Rust', risk: 75, status: 'High Threat', trigger: 'Cloudy microclimate & 78% RH' },
      { disease: 'Cotton Pink Bollworm', risk: 84, status: 'High Threat', trigger: 'Flowering / boll formation stage' }
    ],
    safeSprayToday: {
      safe: false,
      reason: 'Wind gusts and patchy showers predicted in afternoon. Recommended spray time: Tomorrow between 06:00 AM - 10:00 AM.'
    },
    sevenDayForecast: [
      { day: 'Sat (Today)', tempHigh: 32, tempLow: 24, rh: 78, rainMm: 8, riskScore: 78, status: 'High Risk' },
      { day: 'Sun', tempHigh: 31, tempLow: 23, rh: 80, rainMm: 11, riskScore: 82, status: 'High Risk' },
      { day: 'Mon', tempHigh: 33, tempLow: 24, rh: 70, rainMm: 3, riskScore: 60, status: 'Moderate' },
      { day: 'Tue', tempHigh: 34, tempLow: 25, rh: 60, rainMm: 0, riskScore: 40, status: 'Safe Window' },
      { day: 'Wed', tempHigh: 34, tempLow: 25, rh: 58, rainMm: 0, riskScore: 35, status: 'Safe Window' },
      { day: 'Thu', tempHigh: 32, tempLow: 24, rh: 68, rainMm: 4, riskScore: 52, status: 'Moderate' },
      { day: 'Fri', tempHigh: 31, tempLow: 23, rh: 75, rainMm: 9, riskScore: 70, status: 'Elevated' }
    ]
  },
  Ahmednagar: {
    district: 'Ahmednagar',
    temp: 28.0,
    humidity: 74,
    rainfallProb: 35,
    rainfallExpectedMm: 4.2,
    windSpeedKmH: 10.1,
    leafWetnessHours: 5,
    gddAccumulated: 1050,
    currentStatus: 'Moderate Outbreak Risk',
    diseaseRisks: [
      { disease: 'Pomegranate Telya', risk: 62, status: 'Moderate Threat', trigger: 'Rain splash transmission' },
      { disease: 'Sugarcane Red Rot', risk: 48, status: 'Low-Moderate', trigger: 'Soil drainage stagnation' }
    ],
    safeSprayToday: {
      safe: true,
      reason: 'Weather clear for next 18 hours. Safe for systemic and contact applications.'
    },
    sevenDayForecast: [
      { day: 'Sat (Today)', tempHigh: 30, tempLow: 22, rh: 74, rainMm: 4, riskScore: 58, status: 'Moderate' },
      { day: 'Sun', tempHigh: 31, tempLow: 23, rh: 70, rainMm: 2, riskScore: 50, status: 'Moderate' },
      { day: 'Mon', tempHigh: 32, tempLow: 22, rh: 64, rainMm: 0, riskScore: 35, status: 'Safe Window' },
      { day: 'Tue', tempHigh: 32, tempLow: 22, rh: 60, rainMm: 0, riskScore: 30, status: 'Safe Window' },
      { day: 'Wed', tempHigh: 31, tempLow: 23, rh: 68, rainMm: 2, riskScore: 42, status: 'Moderate' },
      { day: 'Thu', tempHigh: 29, tempLow: 22, rh: 76, rainMm: 7, riskScore: 64, status: 'Elevated' },
      { day: 'Fri', tempHigh: 29, tempLow: 21, rh: 78, rainMm: 8, riskScore: 66, status: 'Elevated' }
    ]
  }
};

export const calculateBlitecastSeverity = (temp, humidity, leafWetnessHrs) => {
  if (humidity >= 90 && leafWetnessHrs >= 10 && temp >= 14 && temp <= 23) {
    return { score: 4, label: 'Severe Blitecast Warning (Immediate Action Required)' };
  } else if (humidity >= 80 && leafWetnessHrs >= 6 && temp >= 12 && temp <= 26) {
    return { score: 2, label: 'Moderate Risk (Watch Foliage Closely)' };
  } else {
    return { score: 0, label: 'Low Sporulation Risk' };
  }
};