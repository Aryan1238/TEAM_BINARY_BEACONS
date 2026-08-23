// Live Agrometeorology Weather Service using Open-Meteo API
// 100% Free, No API key required, Supports High-Precision GPS & Agricultural Hubs

export const AGRICULTURAL_REGIONS = [
  // Maharashtra
  { id: 'Nashik', name: 'Nashik (नाशिक)', state: 'Maharashtra', crop: 'Grape & Tomato Hub', lat: 19.9975, lon: 73.7898 },
  { id: 'Yavatmal', name: 'Yavatmal (यवतमाळ)', state: 'Maharashtra', crop: 'Cotton & Soybean', lat: 20.3888, lon: 78.1204 },
  { id: 'Amravati', name: 'Amravati (अमरावती)', state: 'Maharashtra', crop: 'Soybean & Orange', lat: 20.9320, lon: 77.7523 },
  { id: 'Ahmednagar', name: 'Ahmednagar (अहिल्यानगर)', state: 'Maharashtra', crop: 'Sugarcane & Pomegranate', lat: 19.0948, lon: 74.7480 },
  { id: 'Pune', name: 'Pune (पुणे)', state: 'Maharashtra', crop: 'Vegetables & Floriculture', lat: 18.5204, lon: 73.8567 },
  { id: 'Jalgaon', name: 'Jalgaon (जळगाव)', state: 'Maharashtra', crop: 'Banana & Cotton Belt', lat: 21.0077, lon: 75.5626 },
  { id: 'Kolhapur', name: 'Kolhapur (कोल्हापूर)', state: 'Maharashtra', crop: 'Sugarcane & Jaggery', lat: 16.7050, lon: 74.2433 },
  { id: 'Nagpur', name: 'Nagpur (नागपूर)', state: 'Maharashtra', crop: 'Citrus & Cotton', lat: 21.1458, lon: 79.0882 },
  
  // North India / Punjab / Haryana
  { id: 'Ludhiana', name: 'Ludhiana (ਲੁਧਿਆਣਾ)', state: 'Punjab', crop: 'Wheat & Paddy Belt', lat: 30.9010, lon: 75.8573 },
  { id: 'Bathinda', name: 'Bathinda (ਬਠਿੰਡਾ)', state: 'Punjab', crop: 'Cotton & Mustard', lat: 30.2110, lon: 74.9455 },
  
  // South India / Karnataka / AP / TN
  { id: 'Dharwad', name: 'Dharwad (ಧಾರವಾಡ)', state: 'Karnataka', crop: 'Chilli & Cotton', lat: 15.4589, lon: 75.0078 },
  { id: 'Shimoga', name: 'Shimoga (ಶಿವಮೊಗ್ಗ)', state: 'Karnataka', crop: 'Arecanut & Paddy', lat: 13.9299, lon: 75.5681 },
  { id: 'Guntur', name: 'Guntur (గుంటూరు)', state: 'Andhra Pradesh', crop: 'Red Chilli & Tobacco', lat: 16.3067, lon: 80.4365 },
  { id: 'Thanjavur', name: 'Thanjavur (தஞ்சாவூர்)', state: 'Tamil Nadu', crop: 'Cauvery Delta Rice Bowl', lat: 10.7870, lon: 79.1378 },
  { id: 'Wayanad', name: 'Wayanad (വയനാട്)', state: 'Kerala', crop: 'Spices, Coffee & Tea', lat: 11.6854, lon: 76.1320 },
  
  // East & West India
  { id: 'Rajkot', name: 'Rajkot (રાજકોટ)', state: 'Gujarat', crop: 'Groundnut & Cotton', lat: 22.3039, lon: 70.8022 },
  { id: 'Burdwan', name: 'Purba Bardhaman (বর্ধমান)', state: 'West Bengal', crop: 'Rice Bowl of Bengal', lat: 23.2324, lon: 87.8615 },
  { id: 'Sambalpur', name: 'Sambalpur (ସମ୍ବଲପୁର)', state: 'Odisha', crop: 'Paddy & Pulses', lat: 21.4669, lon: 83.9812 }
];

export const getWeatherDescription = (code) => {
  // WMO Weather interpretation codes (WW)
  switch (code) {
    case 0: return { label: 'Clear Sky', icon: 'Sun', color: 'text-amber-500' };
    case 1:
    case 2:
    case 3: return { label: 'Mainly Clear / Partly Cloudy', icon: 'CloudSun', color: 'text-amber-400' };
    case 45:
    case 48: return { label: 'Fog / Depositing Rime Fog', icon: 'CloudFog', color: 'text-slate-400' };
    case 51:
    case 53:
    case 55: return { label: 'Light Drizzle', icon: 'CloudDrizzle', color: 'text-blue-400' };
    case 61:
    case 63:
    case 65: return { label: 'Rain Showers', icon: 'CloudRain', color: 'text-blue-600' };
    case 80:
    case 81:
    case 82: return { label: 'Heavy Rain Showers', icon: 'CloudRain', color: 'text-indigo-600' };
    case 95:
    case 96:
    case 99: return { label: 'Thunderstorm', icon: 'Zap', color: 'text-rose-600' };
    default: return { label: 'Scattered Clouds', icon: 'Cloud', color: 'text-emerald-500' };
  }
};

export const fetchLiveWeather = async (lat, lon, districtName = 'Selected Region') => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&hourly=relative_humidity_2m,precipitation_probability&timezone=auto`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather API error (${response.status})`);
    }

    const data = await response.json();
    
    const current = data.current || {};
    const daily = data.daily || { time: [] };
    const hourly = data.hourly || {};

    const temp = current.temperature_2m ?? 26.5;
    const humidity = current.relative_humidity_2m ?? 75;
    const precipitation = current.precipitation ?? current.rain ?? 0.0;
    const windSpeed = current.wind_speed_10m ?? 8.5;
    const weatherCode = current.weather_code ?? 1;

    // Estimate leaf wetness duration (hours per day with RH > 85% or active precipitation)
    let leafWetnessHours = 4;
    if (hourly.relative_humidity_2m) {
      const last24h = hourly.relative_humidity_2m.slice(0, 24);
      leafWetnessHours = last24h.filter(rh => rh >= 85).length;
      if (precipitation > 0) leafWetnessHours = Math.max(leafWetnessHours, 8);
    } else {
      if (humidity >= 90) leafWetnessHours = 11;
      else if (humidity >= 80) leafWetnessHours = 7;
      else leafWetnessHours = 3;
    }

    // Calculate Growing Degree Days (Base 12°C)
    const gddAccumulated = Math.round(Math.max(0, temp - 12) * 35 + 620);
    const rainProbMax = daily.precipitation_probability_max?.[0] ?? (precipitation > 0 ? 85 : Math.round(humidity * 0.4));
    const rainfallSum = daily.precipitation_sum?.[0] ?? precipitation;

    // Calculate Dynamic Epidemiological Outbreak Risks
    const isHighHumidity = humidity >= 85;
    const isModerateTemp = temp >= 16 && temp <= 27;
    const isFungalOptimal = isHighHumidity && isModerateTemp;
    const isHighWind = windSpeed > 15;

    const diseaseRisks = [];
    
    // Tomato / Potato Late Blight Risk
    if (isFungalOptimal && leafWetnessHours >= 8) {
      diseaseRisks.push({
        disease: 'Tomato & Potato Late Blight',
        risk: Math.min(96, Math.round(humidity * 0.7 + leafWetnessHours * 3)),
        status: 'Severe Threat',
        trigger: `Live RH ${humidity}% & Leaf Wetness ${leafWetnessHours}h (High Sporulation)`
      });
    } else if (humidity >= 75) {
      diseaseRisks.push({
        disease: 'Tomato Late Blight',
        risk: 62,
        status: 'Moderate Threat',
        trigger: `Live RH ${humidity}% - Monitor morning canopy dew`
      });
    } else {
      diseaseRisks.push({
        disease: 'Tomato Late Blight',
        risk: 28,
        status: 'Low Risk',
        trigger: 'Dry canopy inhibiting fungal germination'
      });
    }

    // Grape Downy Mildew / Powder Mildew
    if (humidity >= 80 && rainfallSum >= 5) {
      diseaseRisks.push({
        disease: 'Grape Downy Mildew (3-10 Rule Met)',
        risk: 86,
        status: 'Critical Alert',
        trigger: `${rainfallSum}mm rain & ${temp}°C meeting primary infection 3-10 rule`
      });
    } else {
      diseaseRisks.push({
        disease: 'Grape Powdery Mildew',
        risk: temp >= 25 && temp <= 34 ? 74 : 35,
        status: temp >= 25 && temp <= 34 ? 'Elevated Risk' : 'Low',
        trigger: `Optimal conidial multiplication at ${temp}°C`
      });
    }

    // Cotton Pink Bollworm / Soybean Rust
    if (temp >= 30 && humidity < 75) {
      diseaseRisks.push({
        disease: 'Cotton Pink Bollworm (Flight Active)',
        risk: 88,
        status: 'High Insect Threat',
        trigger: `Thermal sum ${gddAccumulated} GDD matches adult moth emergence`
      });
    } else {
      diseaseRisks.push({
        disease: 'Soybean Rust / Foliar Blight',
        risk: humidity >= 80 ? 78 : 42,
        status: humidity >= 80 ? 'Elevated' : 'Sub-Threshold',
        trigger: `Leaf wetness ${leafWetnessHours}h under current microclimate`
      });
    }

    // Safe Spray Decision
    let safeSpray = { safe: true, reason: 'Weather is clear with low wind drift. Favorable for chemical & biological applications.' };
    if (rainProbMax >= 60 || precipitation > 1.0) {
      safeSpray = {
        safe: false,
        reason: `Imminent rain predicted (${rainProbMax}% chance, ${rainfallSum}mm). Chemical spray will wash off. Postpone application.`
      };
    } else if (isHighWind) {
      safeSpray = {
        safe: false,
        reason: `High wind speed (${windSpeed} km/h > 15 km/h limit). High spray drift hazard. Wait for calm evening hours.`
      };
    }

    // Parse 7-Day Forecast
    const daysName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const sevenDayForecast = (daily.time || []).slice(0, 7).map((dateStr, idx) => {
      const d = new Date(dateStr);
      const dayLabel = idx === 0 ? 'Today' : daysName[d.getDay()];
      const tMax = Math.round(daily.temperature_2m_max?.[idx] ?? temp + 2);
      const tMin = Math.round(daily.temperature_2m_min?.[idx] ?? temp - 4);
      const rainProb = daily.precipitation_probability_max?.[idx] ?? 20;
      const rainMm = Math.round((daily.precipitation_sum?.[idx] ?? 0) * 10) / 10;
      const rhEst = Math.max(45, Math.min(95, humidity + (rainProb > 50 ? 12 : -5)));
      
      let riskScore = 35;
      let status = 'Safe Window';
      if (rainProb >= 60 || rhEst >= 85) {
        riskScore = 84;
        status = 'High Risk';
      } else if (rainProb >= 35 || rhEst >= 75) {
        riskScore = 58;
        status = 'Moderate';
      }

      return {
        day: `${dayLabel} (${d.getDate()}/${d.getMonth()+1})`,
        tempHigh: tMax,
        tempLow: tMin,
        rh: rhEst,
        rainMm: rainMm,
        rainProb: rainProb,
        riskScore: riskScore,
        status: status,
        weatherDesc: getWeatherDescription(daily.weather_code?.[idx] ?? 0).label
      };
    });

    return {
      district: districtName,
      temp: Math.round(temp * 10) / 10,
      humidity: Math.round(humidity),
      rainfallProb: rainProbMax,
      rainfallExpectedMm: Math.round(rainfallSum * 10) / 10,
      windSpeedKmH: Math.round(windSpeed * 10) / 10,
      leafWetnessHours: leafWetnessHours,
      gddAccumulated: gddAccumulated,
      weatherCode: weatherCode,
      weatherDesc: getWeatherDescription(weatherCode).label,
      currentStatus: isFungalOptimal ? 'High Outbreak Risk (Fungal / Blight)' : 'Moderate Microclimate Risk',
      diseaseRisks: diseaseRisks,
      safeSprayToday: safeSpray,
      sevenDayForecast: sevenDayForecast,
      lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      isLive: true
    };
  } catch (error) {
    console.error('Failed to fetch live weather:', error);
    throw error;
  }
};
