import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  MapPin, 
  Layers, 
  Radio, 
  Send, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Users, 
  Phone, 
  Search, 
  Filter, 
  Compass,
  Building,
  Activity,
  Maximize2,
  Sliders,
  TrendingUp,
  Wind,
  Navigation,
  Eye,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import L from 'leaflet';
import { maharashtraDistricts } from '../data/maharashtraGeo';
import { getGeospatialHotspots } from '../services/geospatialEngine';
import confetti from 'canvas-confetti';

export const GeospatialHotspots = ({ currentLang, onNavigate }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersRef = useRef({
    markers: [],
    polygons: [],
    circles: [],
    vectors: [],
    eventPoints: []
  });

  const [loading, setLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState(null);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [selectedCropFilter, setSelectedCropFilter] = useState('All');
  const [epsKm, setEpsKm] = useState(15.0);
  
  // Layer toggles
  const [showBufferRings, setShowBufferRings] = useState(true);
  const [showPolygons, setShowPolygons] = useState(true);
  const [showVectors, setShowVectors] = useState(true);
  const [showEventPoints, setShowEventPoints] = useState(false);

  // Broadcast SMS State
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Load and cluster geospatial data
  const loadHotspots = async () => {
    setLoading(true);
    try {
      const data = await getGeospatialHotspots({
        cropFilter: selectedCropFilter,
        epsKm: epsKm,
        minSamples: 3
      });
      setAnalysisData(data);
      if (data.clusters && data.clusters.length > 0) {
        // Keep previously selected if still in list, else pick first
        setSelectedHotspot(prev => {
          if (!prev) return data.clusters[0];
          const exists = data.clusters.find(c => c.id === prev.id);
          return exists || data.clusters[0];
        });
      } else {
        setSelectedHotspot(null);
      }
    } catch (err) {
      console.error('Error fetching geospatial clusters:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHotspots();
  }, [selectedCropFilter, epsKm]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [19.8, 76.0],
        zoom: 7,
        zoomControl: true,
        scrollWheelZoom: true
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO &copy; KrushiRaksha GIS',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    }
  }, []);

  // Render Geospatial Layers on Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !analysisData) return;

    // Clear previous custom layers
    Object.values(layersRef.current).forEach(layerGroup => {
      layerGroup.forEach(layer => map.removeLayer(layer));
    });
    layersRef.current = { markers: [], polygons: [], circles: [], vectors: [], eventPoints: [] };

    // 1. Render District Reference Markers
    maharashtraDistricts.forEach(district => {
      const marker = L.circleMarker(district.center, {
        radius: 6,
        fillColor: '#0F382A',
        color: '#FFFFFF',
        weight: 1.5,
        opacity: 0.8,
        fillOpacity: 0.7
      }).addTo(map);

      marker.bindTooltip(`<b>${district.name} (${district.marathiName})</b><br/>Primary: ${district.primaryCrops.join(', ')}`, {
        className: 'custom-tooltip',
        direction: 'top'
      });

      layersRef.current.markers.push(marker);
    });

    const clusters = analysisData.clusters || [];

    // 2. Render Active Hotspot Clusters
    clusters.forEach(hs => {
      const isSelected = selectedHotspot?.id === hs.id;
      const isCritical = hs.risk_level === 'CRITICAL';
      const isHigh = hs.risk_level === 'HIGH';
      const mainColor = hs.color || (isCritical ? '#EF4444' : isHigh ? '#F59E0B' : '#3B82F6');

      // A. Buffer Rings (3km & 5km)
      if (showBufferRings) {
        // 3km Containment Ring
        const ring3 = L.circle([hs.lat, hs.lng], {
          radius: (hs.radiusKm || 3.0) * 1000,
          color: mainColor,
          fillColor: mainColor,
          fillOpacity: isSelected ? 0.22 : 0.12,
          weight: isSelected ? 2.5 : 1.5,
          dashArray: '5, 5'
        }).addTo(map);

        // 5km Precautionary Buffer Ring
        const ring5 = L.circle([hs.lat, hs.lng], {
          radius: (hs.bufferKm || 5.0) * 1000,
          color: '#3B82F6',
          fillColor: '#3B82F6',
          fillOpacity: 0.04,
          weight: 1,
          dashArray: '3, 6'
        }).addTo(map);

        layersRef.current.circles.push(ring3, ring5);
      }

      // B. Convex Hull Polygons
      if (showPolygons && hs.polygon_coords && hs.polygon_coords.length >= 3) {
        const poly = L.polygon(hs.polygon_coords, {
          color: mainColor,
          weight: 2,
          opacity: 0.85,
          fillColor: mainColor,
          fillOpacity: 0.2
        }).addTo(map);

        poly.on('click', () => {
          setSelectedHotspot(hs);
          map.setView([hs.lat, hs.lng], 10, { animate: true });
        });

        layersRef.current.polygons.push(poly);
      }

      // C. Spread Direction Vectors (Arrows)
      if (showVectors && hs.vector_line_coords) {
        const line = L.polyline(hs.vector_line_coords, {
          color: '#1E293B',
          weight: 3,
          dashArray: '4, 4',
          opacity: 0.9
        }).addTo(map);

        const endPoint = hs.vector_line_coords[1];
        const arrowHead = L.circleMarker(endPoint, {
          radius: 5,
          color: '#1E293B',
          fillColor: '#EF4444',
          fillOpacity: 1,
          weight: 2
        }).addTo(map);

        arrowHead.bindTooltip(`Spread Vector: ${hs.vectorDirection}`, { direction: 'top' });

        layersRef.current.vectors.push(line, arrowHead);
      }

      // D. Hotspot Center Marker with Count Badge
      const customIcon = L.divIcon({
        className: 'custom-hotspot-pin',
        html: `
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: ${isSelected ? '36px' : '30px'};
            height: ${isSelected ? '36px' : '30px'};
            background-color: ${mainColor};
            border: 3px solid #FFFFFF;
            border-radius: 50%;
            box-shadow: 0 4px 14px ${mainColor}80;
            color: #FFFFFF;
            font-size: ${isSelected ? '12px' : '11px'};
            font-weight: 800;
            font-family: sans-serif;
            cursor: pointer;
            transition: all 0.2s ease;
          ">
            ${hs.activeCasesCount}
            ${isCritical ? `<span style="
              position: absolute;
              inset: -5px;
              border-radius: 50%;
              border: 2px solid #EF4444;
              animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></span>` : ''}
          </div>
        `,
        iconSize: isSelected ? [36, 36] : [30, 30],
        iconAnchor: isSelected ? [18, 18] : [15, 15]
      });

      const marker = L.marker([hs.lat, hs.lng], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        setSelectedHotspot(hs);
        map.setView([hs.lat, hs.lng], 10, { animate: true });
      });

      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; line-height: 1.5; min-width: 195px; padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
            <strong style="color: ${mainColor}; font-size: 14px; font-weight: 800;">${hs.disease}</strong>
            <span style="background: ${mainColor}25; color: ${mainColor}; font-weight: 800; font-size: 10px; padding: 2px 7px; border-radius: 9999px; letter-spacing: 0.5px; border: 1px solid ${mainColor}40;">${hs.risk_level}</span>
          </div>
          <div style="margin-bottom: 2px;"><b style="color: #E2E8F0;">Crop:</b> <span style="color: #FFFFFF;">${hs.crop}</span></div>
          <div style="margin-bottom: 2px;"><b style="color: #E2E8F0;">Location:</b> <span style="color: #FFFFFF;">${hs.taluka}, ${hs.district}</span></div>
          <div style="margin-bottom: 2px;"><b style="color: #E2E8F0;">Active Cases:</b> <span style="color: ${mainColor}; font-weight: 800;">${hs.activeCasesCount}</span></div>
          <div style="margin-bottom: 2px;"><b style="color: #E2E8F0;">Radius:</b> <span style="color: #FFFFFF;">${hs.radiusKm} km (5km Buffer)</span></div>
          <div style="margin-bottom: 4px;"><b style="color: #E2E8F0;">Spread:</b> <span style="color: #FFFFFF;">${hs.vectorDirection}</span></div>
          <div style="color: #94A3B8; font-size: 10px; margin-top: 4px; padding-top: 4px; border-top: 1px solid rgba(255,255,255,0.08);">Mean AI Confidence: ${hs.mean_confidence}%</div>
        </div>
      `, { className: 'custom-popup' });

      layersRef.current.markers.push(marker);
    });

    // 3. Render Raw Event Scatter Points (Optional Toggle)
    if (showEventPoints && analysisData.processed_events) {
      analysisData.processed_events.forEach(ev => {
        const pointMarker = L.circleMarker([ev.lat, ev.lng], {
          radius: 3.5,
          color: '#1E293B',
          fillColor: ev.severity === 'Critical' ? '#EF4444' : ev.severity === 'High' ? '#F59E0B' : '#10B981',
          fillOpacity: 0.9,
          weight: 1
        }).addTo(map);

        pointMarker.bindTooltip(`${ev.crop} - ${ev.disease}<br/>Source: ${ev.source || 'Scout'}<br/>${new Date(ev.timestamp).toLocaleDateString()}`, {
          direction: 'top',
          className: 'custom-tooltip'
        });

        layersRef.current.eventPoints.push(pointMarker);
      });
    }

  }, [analysisData, selectedHotspot, showBufferRings, showPolygons, showVectors, showEventPoints]);

  const handleBroadcastSMS = () => {
    if (!selectedHotspot) return;
    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
      setBroadcastSuccess(true);
      confetti({
        particleCount: 35,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#0F382A', '#E6A122', '#10B981']
      });
      setTimeout(() => setBroadcastSuccess(false), 5000);
    }, 1200);
  };

  const totalQuarantineFarmers = useMemo(() => {
    if (!analysisData?.clusters) return 0;
    return analysisData.clusters.reduce((acc, curr) => acc + (curr.farmersInRadius || 0), 0);
  }, [analysisData]);

  return (
    <div className="min-h-screen bg-[#F8F9F5] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title */}
        <div className="bg-[#0F382A] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden border border-emerald-900/50">
          <div className="space-y-2 max-w-2xl relative z-10">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-400 text-rose-950">
                Pillar 3: Geospatial Hotspot Surveillance
              </span>
              <span className="text-xs text-emerald-300 font-mono">DBSCAN + Spatiotemporal Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-serif-display">
              GIS Epidemiological Cluster & Hotspot Surveillance
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Spatial disease tracking with exact Haversine DBSCAN clustering, spatiotemporal contagion velocity vectors (km/day), multi-factor risk scores, and 1-Click Mass Broadcast SMS containment.
            </p>
          </div>

          {/* Dynamic Hotspot Metrics Dashboard */}
          <div className="bg-[#0A261D] rounded-2xl p-4 border border-emerald-800 shrink-0 text-xs space-y-2.5 shadow-inner">
            <div className="flex items-center justify-between space-x-6">
              <span className="text-emerald-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                Active Hotspots:
              </span>
              <span className="font-bold text-rose-400 font-mono text-sm">
                {analysisData?.active_hotspot_clusters ?? 0} Outbreak Zones
              </span>
            </div>
            <div className="flex items-center justify-between space-x-6">
              <span className="text-emerald-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-amber-300" />
                Total Active Cases:
              </span>
              <span className="font-bold text-amber-300 font-mono text-sm">
                {analysisData?.active_cases_total ?? 0} Cases
              </span>
            </div>
            <div className="flex items-center justify-between space-x-6">
              <span className="text-emerald-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-300" />
                Quarantine Coverage:
              </span>
              <span className="font-bold text-blue-300 font-mono text-sm">
                {totalQuarantineFarmers.toLocaleString('en-IN')} Farmers
              </span>
            </div>
            <div className="flex items-center justify-between space-x-6">
              <span className="text-emerald-300 flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-emerald-400" />
                Max Spread Velocity:
              </span>
              <span className="font-bold text-emerald-400 font-mono text-xs">
                {analysisData?.max_spread_velocity || 'Insufficient data'}
              </span>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
          
          {/* Crop Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-700 flex items-center space-x-1 mr-2">
              <Filter className="w-3.5 h-3.5 text-emerald-700" />
              <span>Filter by Crop:</span>
            </span>
            {['All', 'Tomato', 'Cotton', 'Grapes', 'Pomegranate', 'Soybean'].map(crop => (
              <button
                key={crop}
                onClick={() => setSelectedCropFilter(crop)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  selectedCropFilter === crop 
                    ? 'bg-[#0F382A] text-white shadow-sm ring-2 ring-emerald-600/30' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {crop}
              </button>
            ))}
          </div>

          {/* Layer Toggles & DBSCAN Parameters */}
          <div className="flex flex-wrap items-center gap-4 text-[11px] font-semibold text-slate-700">
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input 
                type="checkbox" 
                checked={showBufferRings} 
                onChange={(e) => setShowBufferRings(e.target.checked)}
                className="rounded accent-emerald-700 w-3.5 h-3.5"
              />
              <span>3km / 5km Buffer Rings</span>
            </label>

            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input 
                type="checkbox" 
                checked={showPolygons} 
                onChange={(e) => setShowPolygons(e.target.checked)}
                className="rounded accent-emerald-700 w-3.5 h-3.5"
              />
              <span>Convex Hull Polygons</span>
            </label>

            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input 
                type="checkbox" 
                checked={showVectors} 
                onChange={(e) => setShowVectors(e.target.checked)}
                className="rounded accent-emerald-700 w-3.5 h-3.5"
              />
              <span>Velocity Vectors</span>
            </label>

            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input 
                type="checkbox" 
                checked={showEventPoints} 
                onChange={(e) => setShowEventPoints(e.target.checked)}
                className="rounded accent-emerald-700 w-3.5 h-3.5"
              />
              <span>Raw Case Points</span>
            </label>

            <button
              onClick={loadHotspots}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
              title="Refresh Clusters"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* 2-Column GIS Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Leaflet Map Container (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-800">Maharashtra State Disease Surveillance GIS</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold">
                  LIVE TELEMETRY
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                <span>EPSG:4326 WGS84</span>
                <span>•</span>
                <span>DBSCAN ε={epsKm}km</span>
              </div>
            </div>

            {/* Map Canvas */}
            <div 
              ref={mapContainerRef} 
              className="w-full h-[520px] rounded-2xl overflow-hidden shadow-inner border border-slate-200 relative z-10"
            />

            {/* Map Legend */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] text-slate-600 border-t border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 shadow-xs" />
                <span>Critical Outbreak</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 shadow-xs" />
                <span>High Risk Zone</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-blue-500 shadow-xs" />
                <span>Emerging Hotspot</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-xs" />
                <span>3km / 5km Buffer</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Active Outbreak Details & Mass SMS Trigger (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {selectedHotspot ? (
              /* Selected Hotspot Card */
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5 animate-in fade-in duration-200">
                
                <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        selectedHotspot.risk_level === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-900 border-rose-200'
                          : selectedHotspot.risk_level === 'HIGH'
                          ? 'bg-amber-100 text-amber-900 border-amber-200'
                          : 'bg-blue-100 text-blue-900 border-blue-200'
                      }`}>
                        {selectedHotspot.containmentStatus}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{selectedHotspot.reportedDate}</span>
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-1.5 font-serif-display">
                      {selectedHotspot.taluka} Taluka
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      District: <strong>{selectedHotspot.district}</strong> · Crop: <strong className="text-stone-800">{selectedHotspot.crop}</strong>
                    </p>
                    <p className="text-xs text-emerald-800 font-semibold mt-0.5 flex items-center gap-1">
                      <span>Pathogen:</span>
                      <span className="font-bold underline">{selectedHotspot.disease}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Risk Score</span>
                    <span className={`text-xl font-extrabold font-mono ${
                      selectedHotspot.risk_score >= 75 ? 'text-rose-600' : selectedHotspot.risk_score >= 55 ? 'text-amber-600' : 'text-blue-600'
                    }`}>
                      {selectedHotspot.risk_score}/100
                    </span>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium block">Active Cases</span>
                    <span className="text-lg font-extrabold text-rose-600 font-mono">
                      {selectedHotspot.activeCasesCount}
                    </span>
                    <span className="text-[10px] text-slate-400 block">DBSCAN Points</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium block">Radius Buffer</span>
                    <span className="text-lg font-extrabold text-amber-600 font-mono">
                      {selectedHotspot.radiusKm} km
                    </span>
                    <span className="text-[10px] text-slate-400 block">5km Precaution</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium block">Spread Vector</span>
                    <span className="text-xs font-extrabold text-blue-700 font-mono leading-tight block mt-1">
                      {selectedHotspot.vectorDirection}
                    </span>
                  </div>
                </div>

                {/* Emergency Advisory Message */}
                <div className="space-y-1.5 text-xs">
                  <span className="font-bold text-slate-700 uppercase tracking-wider block text-[11px] flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                    <span>Emergency Advisory Broadcast Content:</span>
                  </span>
                  <p className="text-slate-800 bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/80 leading-relaxed font-mono text-[11px] shadow-2xs">
                    {selectedHotspot.alertMessage}
                  </p>
                </div>

                {/* 1-Click Mass Broadcast Action */}
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Targeted Farmers in Taluka:</span>
                    </span>
                    <span className="font-bold text-emerald-800 font-mono">
                      {selectedHotspot.farmersInRadius} farmers in {selectedHotspot.taluka}
                    </span>
                  </div>

                  <button
                    onClick={handleBroadcastSMS}
                    disabled={isBroadcasting}
                    className="w-full py-3 bg-[#0F382A] hover:bg-[#164E35] text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-amber-400" />
                    <span>
                      {isBroadcasting 
                        ? 'Dispatching SMS to Cellular Towers...' 
                        : `Broadcast Emergency SMS to ${selectedHotspot.farmersInRadius} Farmers`}
                    </span>
                  </button>

                  {broadcastSuccess && (
                    <div className="p-3.5 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center space-x-2 animate-in zoom-in-95 duration-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Emergency SMS alert successfully dispatched via Maharashtra State Farmer Gateway to {selectedHotspot.taluka}!</span>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center text-slate-500 space-y-2">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                <h4 className="font-bold text-slate-700">No Hotspots in Filter</h4>
                <p className="text-xs">No active outbreak clusters meet the current crop or radius threshold.</p>
              </div>
            )}

            {/* Quick List of Active Epicenters */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Active Epidemiological Clusters:
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {analysisData?.clusters?.length || 0} Total
                </span>
              </div>

              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {analysisData?.clusters?.map(hs => (
                  <button
                    key={hs.id}
                    onClick={() => {
                      setSelectedHotspot(hs);
                      mapInstanceRef.current?.setView([hs.lat, hs.lng], 10, { animate: true });
                    }}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between text-xs transition-all cursor-pointer ${
                      selectedHotspot?.id === hs.id 
                        ? 'bg-emerald-50/70 border-emerald-600 ring-2 ring-emerald-600/20 font-bold' 
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        hs.risk_level === 'CRITICAL' ? 'bg-rose-500' : hs.risk_level === 'HIGH' ? 'bg-amber-500' : 'bg-blue-500'
                      }`} />
                      <div>
                        <span className="text-slate-900 font-semibold">{hs.district} — {hs.taluka}</span>
                        <span className="text-[11px] text-slate-500 block font-normal">{hs.crop} · {hs.disease}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-rose-600 block">
                        {hs.activeCasesCount} cases
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {hs.radiusKm} km
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
