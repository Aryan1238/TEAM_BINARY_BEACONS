import React, { useState, useEffect, useRef } from 'react';
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
  Maximize2
} from 'lucide-react';
import L from 'leaflet';
import { maharashtraDistricts, activeHotspots } from '../data/maharashtraGeo';
import confetti from 'canvas-confetti';

export const GeospatialHotspots = ({ currentLang, onNavigate }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [selectedHotspot, setSelectedHotspot] = useState(activeHotspots[0]);
  const [selectedCropFilter, setSelectedCropFilter] = useState('All');
  const [showBufferRings, setShowBufferRings] = useState(true);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const filteredHotspots = activeHotspots.filter(hs => {
    if (selectedCropFilter === 'All') return true;
    return hs.crop.toLowerCase().includes(selectedCropFilter.toLowerCase());
  });

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize Leaflet Map
      const map = L.map(mapContainerRef.current, {
        center: [19.5, 75.5],
        zoom: 7,
        zoomControl: true,
        scrollWheelZoom: false
      });

      // Add CartoDB Voyager or OpenStreetMap Tile Layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle || layer instanceof L.CircleMarker) {
        map.removeLayer(layer);
      }
    });

    // Add District Markers
    maharashtraDistricts.forEach(district => {
      const isSelected = selectedHotspot?.district === district.name;
      
      const districtMarker = L.circleMarker(district.center, {
        radius: 7,
        fillColor: '#0F382A',
        color: '#FFFFFF',
        weight: 2,
        opacity: 0.9,
        fillOpacity: 0.8
      }).addTo(map);

      districtMarker.bindTooltip(`<b>${district.name} (${district.marathiName})</b><br/>Cases: ${district.activeCases}<br/>Risk: ${district.riskLevel}`, {
        className: 'custom-tooltip',
        direction: 'top'
      });
    });

    // Add Active Hotspots & Buffer Rings
    filteredHotspots.forEach(hs => {
      const isSelected = selectedHotspot?.id === hs.id;
      const isCritical = hs.severity === 'Critical';

      // 3km Quarantine Ring
      if (showBufferRings) {
        L.circle([hs.lat, hs.lng], {
          radius: hs.radiusKm * 1000,
          color: isCritical ? '#EF4444' : '#F59E0B',
          fillColor: isCritical ? '#EF4444' : '#F59E0B',
          fillOpacity: 0.15,
          weight: 2,
          dashArray: '5, 5'
        }).addTo(map);

        // 5km Buffer Ring
        L.circle([hs.lat, hs.lng], {
          radius: hs.bufferKm * 1000,
          color: '#3B82F6',
          fillColor: '#3B82F6',
          fillOpacity: 0.05,
          weight: 1.5,
          dashArray: '3, 6'
        }).addTo(map);
      }

      // Hotspot Center Marker
      const customIcon = L.divIcon({
        className: 'custom-hotspot-pin',
        html: `<div style="
          background-color: ${isCritical ? '#EF4444' : '#F59E0B'};
          width: ${isSelected ? '22px' : '16px'};
          height: ${isSelected ? '22px' : '16px'};
          border-radius: 50%;
          border: 3px solid #FFFFFF;
          box-shadow: 0 0 14px ${isCritical ? 'rgba(239,68,68,0.9)' : 'rgba(245,158,11,0.9)'};
          cursor: pointer;
        "></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      const marker = L.marker([hs.lat, hs.lng], { icon: customIcon }).addTo(map);
      
      marker.on('click', () => {
        setSelectedHotspot(hs);
        map.setView([hs.lat, hs.lng], 10, { animate: true });
      });

      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; line-height: 1.4;">
          <strong style="color: #F39C12; font-size: 13px;">${hs.disease}</strong><br/>
          <span>${hs.taluka}, ${hs.district}</span><br/>
          <span style="color: #E2E8F0;">Active Clusters: <b>${hs.activeCasesCount}</b> cases</span><br/>
          <span style="color: #68D391;">Farmers in Radius: <b>${hs.farmersInRadius}</b></span>
        </div>
      `, { className: 'custom-popup' });
    });

  }, [filteredHotspots, showBufferRings, selectedHotspot]);

  const handleBroadcastSMS = () => {
    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
      setBroadcastSuccess(true);
      confetti({
        particleCount: 30,
        spread: 70,
        origin: { y: 0.7 }
      });
      setTimeout(() => setBroadcastSuccess(false), 5000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8F9F5] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title */}
        <div className="bg-[#0F382A] rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 max-w-2xl relative z-10">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-400 text-rose-950">
                Pillar 3: Geospatial Hotspot Surveillance
              </span>
              <span className="text-xs text-emerald-300 font-mono">Maharashtra State Open GIS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              GIS Epidemiological Cluster & Hotspot Management
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Spatial cluster tracking using DBSCAN-modeled outbreak circles, contagion velocity vectors, and 1-Click Mass Broadcast SMS containment radius.
            </p>
          </div>

          {/* Quick Hotspot Metrics */}
          <div className="bg-[#0A261D] rounded-2xl p-4 border border-emerald-800 shrink-0 text-xs space-y-2">
            <div className="flex items-center justify-between space-x-4">
              <span className="text-emerald-300">Active Hotspots:</span>
              <span className="font-bold text-rose-400 font-mono">6 Outbreak Zones</span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <span className="text-emerald-300">Quarantine Coverage:</span>
              <span className="font-bold text-amber-300 font-mono">2,650 Farmers</span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <span className="text-emerald-300">Containment Speed:</span>
              <span className="font-bold text-emerald-400 font-mono">3.2 km/day Max</span>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-700 flex items-center space-x-1 mr-2">
              <Filter className="w-3.5 h-3.5 text-emerald-700" />
              <span>Filter by Crop:</span>
            </span>
            {['All', 'Tomato', 'Cotton', 'Grapes', 'Pomegranate', 'Soybean'].map(crop => (
              <button
                key={crop}
                onClick={() => setSelectedCropFilter(crop)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedCropFilter === crop 
                    ? 'bg-[#0F382A] text-white shadow-sm' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {crop}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2 cursor-pointer font-semibold text-slate-700">
              <input 
                type="checkbox" 
                checked={showBufferRings} 
                onChange={(e) => setShowBufferRings(e.target.checked)}
                className="rounded accent-emerald-700 w-4 h-4"
              />
              <span>Show 3km / 5km Buffer Rings</span>
            </label>
          </div>
        </div>

        {/* 2-Column GIS Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Leaflet Map Container */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-800">Maharashtra State Disease Surveillance GIS</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold">
                  LIVE TELEMETRY
                </span>
              </div>
              <span className="text-slate-400 font-mono text-[11px]">EPSG:4326 WGS84</span>
            </div>

            {/* Map Canvas */}
            <div 
              ref={mapContainerRef} 
              className="w-full h-[480px] rounded-xl overflow-hidden shadow-inner border border-slate-200 relative z-10"
            />

            {/* Map Legend */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-slate-600">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 shadow" />
                <span>Critical Contagion Zone</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 shadow" />
                <span>Active Outbreak Cluster</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-blue-500 shadow" />
                <span>5km Precautionary Buffer</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Active Outbreak Details & Mass SMS Trigger */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Selected Hotspot Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
              
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-900 border border-rose-200">
                      {selectedHotspot.containmentStatus}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{selectedHotspot.reportedDate}</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                    {selectedHotspot.taluka} Taluka
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    District: <strong>{selectedHotspot.district}</strong> · Crops: {selectedHotspot.crop}
                  </p>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Active Cases</span>
                  <span className="text-lg font-extrabold text-rose-600 font-mono">
                    {selectedHotspot.activeCasesCount}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Radius Buffer</span>
                  <span className="text-lg font-extrabold text-amber-600 font-mono">
                    {selectedHotspot.radiusKm} km
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Spread Velocity</span>
                  <span className="text-lg font-extrabold text-blue-700 font-mono text-[11px] leading-tight">
                    {selectedHotspot.vectorDirection}
                  </span>
                </div>
              </div>

              {/* Emergency Advisory Message */}
              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-slate-700 uppercase tracking-wider block text-[11px]">
                  Emergency Advisory Broadcast Content:
                </span>
                <p className="text-slate-700 bg-amber-50 p-3 rounded-xl border border-amber-200 leading-relaxed font-mono text-[11px]">
                  {selectedHotspot.alertMessage}
                </p>
              </div>

              {/* 1-Click Mass Broadcast Action */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Targeted Registered Farmers:</span>
                  <span className="font-bold text-emerald-800 font-mono">
                    {selectedHotspot.farmersInRadius} farmers in {selectedHotspot.taluka}
                  </span>
                </div>

                <button
                  onClick={handleBroadcastSMS}
                  disabled={isBroadcasting}
                  className="w-full py-3 bg-[#0F382A] hover:bg-[#164E3A] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>
                    {isBroadcasting 
                      ? 'Dispatching SMS to Cellular Towers...' 
                      : `Broadcast Emergency SMS to ${selectedHotspot.farmersInRadius} Farmers`}
                  </span>
                </button>

                {broadcastSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center space-x-2 animate-bounce">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Emergency SMS alert successfully dispatched via Maharashtra State Farmer Gateway!</span>
                  </div>
                )}
              </div>

            </div>

            {/* Quick List of Active Epicenters */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Switch Active Hotspots:
              </span>
              <div className="space-y-2">
                {activeHotspots.map(hs => (
                  <button
                    key={hs.id}
                    onClick={() => {
                      setSelectedHotspot(hs);
                      mapInstanceRef.current?.setView([hs.lat, hs.lng], 10, { animate: true });
                    }}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all cursor-pointer ${
                      selectedHotspot.id === hs.id 
                        ? 'bg-emerald-50 border-emerald-600 font-bold' 
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <span className="text-slate-900">{hs.district} — {hs.taluka}</span>
                      <span className="text-[11px] text-slate-500 block font-normal">{hs.disease}</span>
                    </div>
                    <span className="text-[11px] font-mono text-rose-600 font-bold">
                      {hs.activeCasesCount} cases
                    </span>
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

