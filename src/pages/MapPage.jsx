import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker, Line as RSMLine, ZoomableGroup, Graticule } from "react-simple-maps";
import { Link } from 'react-router-dom';
import { MapPin, Globe, ArrowLeft, Shield, Activity, RefreshCw } from 'lucide-react';

const MapPage = () => {
  // --- State ---
  const [locationData, setLocationData] = useState([]);
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [mapPosition, setMapPosition] = useState({ coordinates: [20, 20], zoom: 1.2 });
  const [isLoading, setIsLoading] = useState(true);

  const DESTINATION_SERVER = [72.8, 19.0]; // Mumbai

  // --- Fetch Data ---
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const now = new Date();
        const fromDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0)).toISOString();
        const toDate = now.toISOString();
        const res = await fetch(`http://127.0.0.1:8000/api/dashboard/locations?from_date=${fromDate}&to_date=${toDate}`);
        if (res.ok) {
          const data = await res.json();
          setLocationData(data);
        }
      } catch (err) {
        console.error("Error fetching map location data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocationData();
    const interval = setInterval(fetchLocationData, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- Analytics & Functions ---
  const totalAttacks = locationData.reduce((sum, loc) => sum + (loc.attack || 0), 0);
  const topRegion = locationData.reduce(
    (max, loc) => ((loc.attack || 0) > (max.attack || 0) ? loc : max), 
    { name: "None", attack: 0 }
  );

  const animateMapTo = (center, zoom) => {
    setMapPosition({ coordinates: center, zoom });
  };

  // --- Mock Live Events (Left Panel) ---
  const liveEvents = [
    { id: 1, type: "DDoS Attempt", source: "China", target: "Mumbai", time: "Just now", severity: "High" },
    { id: 2, type: "Port Scan", source: "Russia", target: "Mumbai", time: "1m ago", severity: "Medium" },
    { id: 3, type: "SQL Injection", source: "Brazil", target: "Mumbai", time: "3m ago", severity: "High" },
    { id: 4, type: "Brute Force", source: "USA", target: "Mumbai", time: "5m ago", severity: "Low" },
    { id: 5, type: "Payload Drop", source: "Iran", target: "Mumbai", time: "10m ago", severity: "Critical" },
    { id: 6, type: "Malware Ping", source: "North Korea", target: "Mumbai", time: "15m ago", severity: "High" },
  ];

  return (
    <div 
      className="min-h-screen w-full bg-[#020617] relative overflow-hidden text-white font-inter"
      onMouseMove={(e) => {
        if (tooltipData) {
          setTooltipPosition({ x: e.clientX, y: e.clientY });
        }
      }}
    >
      {/* Moving Dash Animation */}
      <style>{`
        @keyframes moving-dash {
          to { stroke-dashoffset: -16; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #3b82f6; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>

      {/* --- Top Navigation Bar --- */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-gray-900/40 backdrop-blur-md border-b border-gray-800/80">
        <Link 
          to="/dashboard" 
          className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 bg-blue-900/20 hover:bg-blue-900/40 border border-blue-500/20 px-4 py-2 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-semibold text-sm">Return to Hub</span>
        </Link>
        <h1 className="text-xl md:text-2xl font-bold flex items-center tracking-wide shadow-sm">
          <Globe className="w-6 h-6 mr-2 text-blue-500" />
          Global Threat Map
        </h1>
        <div className="w-32 hidden md:block"></div> {/* Spacer for symmetry */}
      </div>

      {/* --- Left Panel: Live Events Feed --- */}
      <div className="absolute left-6 top-24 bottom-6 w-80 bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-5 flex-col z-10 shadow-2xl hidden lg:flex">
        <h3 className="text-lg font-bold mb-4 flex items-center border-b border-gray-700/80 pb-3">
          <Activity className="w-5 h-5 mr-2 text-red-500" />
          Live Threat Feed
        </h3>
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {liveEvents.map(ev => (
            <div key={ev.id} className="bg-gray-800/80 p-3 rounded-xl border border-gray-700 hover:border-red-500/40 transition-colors shadow-lg shadow-black/20">
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-sm text-red-400">{ev.type}</span>
                <span className="text-xs text-gray-400">{ev.time}</span>
              </div>
              <div className="text-xs text-gray-300">
                {ev.source} <span className="text-gray-500 mx-1">→</span> <span className="text-cyan-400">{ev.target}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Right Panel: Analytics & Controls --- */}
      <div className="absolute right-6 top-24 w-80 bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-5 flex flex-col z-10 shadow-2xl space-y-6 hidden lg:flex">
        <h3 className="text-lg font-bold flex items-center border-b border-gray-700/80 pb-3">
          <Shield className="w-5 h-5 mr-2 text-blue-400" />
          Global Analytics
        </h3>

        <div className="bg-gray-800/80 rounded-xl p-4 border border-gray-700 shadow-inner overflow-hidden relative">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-red-500/20 rounded-full blur-xl"></div>
          <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Total Threats Today</div>
          <div className="text-4xl font-black text-red-500">{isLoading ? "..." : totalAttacks.toLocaleString()}</div>
        </div>

        <div className="bg-gray-800/80 rounded-xl p-4 border border-gray-700 shadow-inner overflow-hidden relative">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-orange-500/20 rounded-full blur-xl"></div>
          <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Top Targeted Region</div>
          <div className="text-2xl font-bold text-white truncate" title={topRegion.name}>{isLoading ? "..." : topRegion.name}</div>
          <div className="text-sm text-red-400 mt-1">{isLoading ? "..." : topRegion.attack.toLocaleString()} incoming threats</div>
        </div>

        <div className="pt-2">
          <button 
            onClick={() => animateMapTo([20, 20], 1.2)} 
            className="w-full flex items-center justify-center p-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-semibold transition-colors shadow-lg shadow-blue-500/20 border border-blue-400/30"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset Zoom
          </button>
        </div>
      </div>

      {/* --- Main Map Layer --- */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pt-16">
        <ComposableMap projection="geoMercator" projectionConfig={{ scale: 180 }} className="w-full h-full opacity-90">
          <ZoomableGroup 
            zoom={mapPosition.zoom} 
            center={mapPosition.coordinates} 
            onMoveEnd={(pos) => setMapPosition(pos)}
            minZoom={1} 
            maxZoom={12}
            className="transition-transform duration-300 ease-out"
          >
            <Graticule stroke="#1e293b" strokeWidth={0.5} />
            <Geographies geography="https://unpkg.com/world-atlas@2.0.2/countries-110m.json">
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#020617"
                    stroke="#3b82f6"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "#1e293b", stroke: "#60a5fa", outline: "none", transition: "all 250ms" },
                      pressed: { outline: "none" },
                    }}
                    onMouseEnter={(e) => {
                      setTooltipData({ name: geo.properties.name });
                      setTooltipPosition({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseMove={(e) => {
                      setTooltipPosition({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseLeave={() => setTooltipData(null)}
                  />
                ))
              }
            </Geographies>

            {/* Destination Server Node */}
            <Marker coordinates={DESTINATION_SERVER}>
              <circle r={4} fill="#06b6d4" />
              <circle r={14} fill="#06b6d4" opacity={0.4} className="animate-ping" />
              <text y={-12} x={12} fill="#06b6d4" fontSize={10} fontWeight="bold" className="shadow-lg">
                AP-SOUTH-1 Server
              </text>
            </Marker>

            {/* Origin Markers and Arcs */}
            {!isLoading && locationData.map((loc, idx) => {
              if (!loc.coordinates || (loc.coordinates[0] === 0 && loc.coordinates[1] === 0)) return null;

              const isDest = loc.coordinates[0] === DESTINATION_SERVER[0] && loc.coordinates[1] === DESTINATION_SERVER[1];

              // Dynamic offsets relative to coordinates
              const deterministicOffset = ((Math.abs(loc.coordinates[0] + loc.coordinates[1]) % 3) + 1) * 0.8;
              const offset = isDest ? 0 : deterministicOffset;

              const draws = [];
              if (loc.benign > 0) {
                draws.push({ isAttack: false, color: "#10b981", offset: offset });
              }
              if (loc.attack > 0) {
                draws.push({ isAttack: true, color: "#ef4444", offset: -offset });
              }

              return (
                <g key={`loc-${idx}`}>
                  <Marker 
                    coordinates={loc.coordinates}
                    onMouseEnter={(e) => {
                      setTooltipData(loc);
                      setTooltipPosition({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseLeave={() => setTooltipData(null)}
                    onClick={() => animateMapTo(loc.coordinates, 4)}
                    style={{ cursor: "pointer" }}
                  >
                    {loc.attack > 0 ? (
                      <>
                        <circle r={loc.attack > 50 ? 6 : 4} fill="#ef4444" />
                        <circle r={loc.attack > 50 ? 14 : 10} fill="#ef4444" opacity={0.3} className="animate-ping" />
                      </>
                    ) : (
                      <circle r={3} fill="#10b981" />
                    )}
                    <text y={-10} x={8} fill="#9ca3af" fontSize={8} fontWeight="bold">{loc.name || loc.region}</text>
                  </Marker>

                  {!isDest && draws.map((draw, i) => {
                    const startCoords = [loc.coordinates[0] + draw.offset, loc.coordinates[1] + draw.offset];
                    return (
                      <RSMLine
                        key={`arc-${idx}-${i}`}
                        from={startCoords}
                        to={DESTINATION_SERVER}
                        stroke={draw.color}
                        strokeWidth={draw.isAttack ? 1.5 : 0.8}
                        strokeOpacity={draw.isAttack ? 0.8 : 0.4}
                        strokeLinecap="round"
                        style={{
                          strokeDasharray: draw.isAttack ? "none" : "4 4",
                          animation: draw.isAttack ? "moving-dash 1.5s linear infinite" : "none"
                        }}
                      />
                    );
                  })}
                </g>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>
      </div>
      
      {/* --- Dynamic Tooltip System --- */}
      {tooltipData && (
        <div 
          className="absolute z-50 bg-gray-900/90 backdrop-blur-md border border-gray-700 p-4 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] pointer-events-none transition-opacity duration-150"
          style={{ top: tooltipPosition.y + 20, left: tooltipPosition.x + 20 }}
        >
          {tooltipData.attack !== undefined ? (
            <>
              <div className="font-bold text-white mb-3 flex items-center text-base border-b border-gray-700 pb-2">
                <MapPin className="w-4 h-4 mr-2 text-cyan-400" />
                {tooltipData.name || tooltipData.region}
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between items-center gap-6">
                  <span className="text-gray-300 flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 mr-2 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
                    Malicious
                  </span>
                  <span className="text-red-400 font-bold">{tooltipData.attack.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center gap-6">
                  <span className="text-gray-300 flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                    Benign
                  </span>
                  <span className="text-green-400 font-bold">{tooltipData.benign.toLocaleString()}</span>
                </div>
                <div className="mt-1 pt-2 border-t border-gray-700 flex justify-between items-center">
                  <span className="text-gray-400 text-xs uppercase tracking-wider">Total Traffic</span>
                  <span className="text-gray-200 font-semibold">{(tooltipData.attack + tooltipData.benign).toLocaleString()}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="font-bold text-white flex items-center">
              <Globe className="w-4 h-4 mr-2 text-blue-400" />
              {tooltipData.name}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MapPage;
