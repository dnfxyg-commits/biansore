import React, { useState, useEffect, useRef } from 'react';
import { Globe as GlobeIcon, Shield, Radio, Maximize2, Minimize2, Cpu, Plane, Building2, FileText, Target } from 'lucide-react';
import { Exhibition } from '../types';

interface Props {
  exhibitions: Exhibition[];
  onMarkerClick: (id: string) => void;
  onRegionFilter: (region: string) => void;
  currentRegion: string;
}

const REGIONS = ['All', 'China', 'Americas', 'Asia', 'Europe'];
const REGION_LABELS = {
  'All': 'GLOBAL',
  'China': 'CHINA',
  'Americas': 'AMERICAS',
  'Asia': 'ASIA',
  'Europe': 'EUROPE'
};

const InteractiveMap: React.FC<Props> = ({ exhibitions, onMarkerClick, onRegionFilter, currentRegion }) => {
  const [hoveredEx, setHoveredEx] = useState<Exhibition | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // Auto-rotation effect (轮播) - cycle through regions every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const currentIndex = REGIONS.indexOf(currentRegion);
      const nextIndex = (currentIndex + 1) % REGIONS.length;
      onRegionFilter(REGIONS[nextIndex]);
    }, 10000);

    return () => clearInterval(interval);
  }, [currentRegion, onRegionFilter]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mapRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Mercator-style projection for 1000x500 map
  const project = (lat: number, lng: number) => {
    const x = (lng + 180) * (1000 / 360);
    const y = (90 - lat) * (500 / 180);
    return { x, y };
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Drone': return <Cpu className="w-3 h-3" />;
      case 'eVTOL': return <Plane className="w-3 h-3" />;
      case 'Infrastructure': return <Building2 className="w-3 h-3" />;
      case 'Regulatory': return <FileText className="w-3 h-3" />;
      default: return <Target className="w-3 h-3" />;
    }
  };

  return (
    <div 
      ref={mapRef}
      className={`relative w-full ${isFullscreen ? 'h-screen rounded-none' : 'aspect-[2.3/1] rounded-[3.5rem]'} bg-[#020617] overflow-hidden border border-slate-800 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] group select-none transition-all duration-700`}
    >
      {/* Tactical UI Layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#020617] bg-[radial-gradient(circle_at_50%_40%,_#0f172a_0%,_#020617_100%)]"></div>
        
        {/* Refined World Map Silhouette (High Quality Paths) */}
        <div className="absolute inset-0 opacity-[0.18] pointer-events-none transition-all duration-1000">
          <svg viewBox="0 0 1000 500" className="w-full h-full fill-blue-500/60 filter blur-[1px]">
             {/* North America */}
             <path d="M110,80 L230,60 L280,140 L240,240 L160,280 L120,220 Z" />
             {/* South America */}
             <path d="M260,280 L320,310 L340,460 L250,420 L240,320 Z" />
             {/* Eurasia & Africa */}
             <path d="M430,160 L580,180 L630,350 L500,450 L420,320 Z" />
             <path d="M460,50 L880,80 L940,280 L760,340 L620,290 L480,160 Z" />
             {/* Oceania */}
             <path d="M820,360 L940,380 L920,470 L810,450 Z" />
             {/* Antarctica */}
             <path d="M150,480 L850,480 L820,495 L180,495 Z" />
          </svg>
        </div>

        {/* Scanline Grid */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ 
          backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>

        {/* Tactical Markers Overlay */}
        <svg viewBox="0 0 1000 500" className="w-full h-full relative z-10">
          <defs>
            <filter id="node-glow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {exhibitions.map((ex) => {
            const { x, y } = project(ex.coordinates.lat, ex.coordinates.lng);
            const offsetDir = x > 500 ? -1 : 1;
            const yOffset = y > 250 ? -35 : 35;
            const targetX = x + (50 * offsetDir);
            const targetY = y + yOffset;
            const isHovered = hoveredEx?.id === ex.id;
            const isHoveredRegion = currentRegion === 'All' || ex.region === currentRegion;

            return (
              <g 
                key={ex.id} 
                className={`cursor-pointer transition-opacity duration-1000 ${isHoveredRegion ? 'opacity-100' : 'opacity-10'}`}
                onMouseEnter={() => setHoveredEx(ex)}
                onMouseLeave={() => setHoveredEx(null)}
                onClick={() => onMarkerClick(ex.id)}
              >
                <path 
                  d={`M ${x} ${y} Q ${x + 20 * offsetDir} ${y + yOffset} ${targetX} ${targetY}`} 
                  fill="none" 
                  stroke={isHovered ? "#3b82f6" : "rgba(59, 130, 246, 0.3)"}
                  strokeWidth={isHovered ? "1.5" : "1"}
                  strokeDasharray={isHovered ? "none" : "3 2"}
                  className="transition-all duration-300"
                />
                <circle cx={x} cy={y} r="3" fill="#3b82f6" className="animate-pulse" filter="url(#node-glow)" />
                <circle cx={x} cy={y} r="8" fill="rgba(59, 130, 246, 0.1)" stroke="rgba(59, 130, 246, 0.2)" />
              </g>
            );
          })}
        </svg>

        {/* Labels Layer */}
        <div className="absolute inset-0 pointer-events-none">
          {exhibitions.map((ex) => {
            const { x, y } = project(ex.coordinates.lat, ex.coordinates.lng);
            const offsetDir = x > 500 ? -1 : 1;
            const yOffset = y > 250 ? -35 : 35;
            const labelX = x + (55 * offsetDir);
            const labelY = y + yOffset;
            const isHovered = hoveredEx?.id === ex.id;
            const isVisible = currentRegion === 'All' || ex.region === currentRegion;

            return (isVisible || isHovered) && (
              <div 
                key={ex.id}
                className="absolute transition-all duration-1000 pointer-events-auto"
                style={{ 
                  left: `${labelX / 10}%`, 
                  top: `${labelY / 5}%`,
                  transform: `translate(${offsetDir === -1 ? '-100%' : '0'}, -50%)`,
                  zIndex: isHovered ? 50 : 20,
                  opacity: isVisible ? 1 : 0.1
                }}
              >
                <div 
                  onClick={() => onMarkerClick(ex.id)}
                  onMouseEnter={() => setHoveredEx(ex)}
                  onMouseLeave={() => setHoveredEx(null)}
                  className={`flex items-center space-x-2 p-1.5 pr-4 rounded-xl border backdrop-blur-md transition-all duration-300 cursor-pointer ${
                    isHovered 
                    ? 'bg-blue-600/90 border-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.6)] scale-105' 
                    : 'bg-[#0f172a]/70 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className={`w-7 h-7 flex items-center justify-center rounded-lg ${isHovered ? 'bg-white text-blue-600' : 'bg-blue-600/20 text-blue-400'}`}>
                    {getCategoryIcon(ex.category)}
                  </div>
                  <div className="flex flex-col min-w-[80px]">
                    <span className={`text-[9px] font-black uppercase tracking-widest ${isHovered ? 'text-blue-100' : 'text-slate-500'}`}>
                      {ex.region}
                    </span>
                    <span className={`text-[11px] font-bold truncate max-w-[130px] leading-tight ${isHovered ? 'text-white' : 'text-slate-200'}`}>
                      {ex.title}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interface: Branding */}
      <div className="absolute top-10 left-10 flex items-center space-x-4 z-40">
        <div className="w-12 h-12 bg-blue-600 rounded-xl shadow-lg flex items-center justify-center border border-blue-400/30">
          <GlobeIcon className="w-6 h-6 text-white animate-spin-slow" />
        </div>
        <div className="bg-[#0f172a]/80 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/10 shadow-2xl">
          <div className="flex items-center space-x-2 mb-1">
            <Shield className="w-3.5 h-3.5 text-blue-500" />
            <h4 className="text-[10px] text-white font-black uppercase tracking-[0.2em]">BIANAero NETWORK</h4>
          </div>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
            NODE INTELLIGENCE VISUALIZATION V2.5
          </p>
        </div>
      </div>

      {/* Interface: Region Selection (Manual & Carousel) */}
      <div className="absolute top-10 right-10 z-40 flex flex-col items-end gap-3">
        <div className="bg-[#0f172a]/60 backdrop-blur-2xl border border-white/10 p-1 rounded-2xl shadow-2xl flex gap-1">
          {REGIONS.map((reg) => (
            <button
              key={reg}
              onClick={() => onRegionFilter(reg)}
              className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${
                currentRegion === reg 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-slate-500 hover:text-white'
              }`}
            >
              {REGION_LABELS[reg as keyof typeof REGION_LABELS]}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#0f172a]/80 border border-white/5 backdrop-blur-md">
           <Radio className="w-3 h-3 text-blue-500 animate-pulse" />
           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">LINK: ACTIVE</span>
        </div>
      </div>

      {/* Interface: Footer Controls */}
      <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end z-40">
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleFullscreen}
            className="w-14 h-14 bg-[#0f172a]/40 backdrop-blur-2xl border border-white/10 rounded-2xl text-white hover:bg-blue-600 transition-all flex items-center justify-center shadow-xl group"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5 group-hover:scale-110" />}
          </button>
          <div className="px-6 py-4 bg-[#0f172a]/70 backdrop-blur-2xl rounded-2xl border border-white/5 shadow-2xl">
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 animate-ping"></span>
              LIVE FEED: {REGION_LABELS[currentRegion as keyof typeof REGION_LABELS]} NODES
            </span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">ACTIVE NODES</div>
          <div className="text-6xl font-black text-white tabular-nums tracking-tighter flex items-end justify-end leading-none">
            {exhibitions.filter(e => currentRegion === 'All' || e.region === currentRegion).length}<span className="text-blue-500/30 mx-2 text-4xl">/</span><span className="text-slate-800 text-4xl">{exhibitions.length}</span>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(transparent_0%,rgba(59,130,246,0.05)_50%,transparent_100%)] bg-[length:100%_4px] animate-scan"></div>
    </div>
  );
};

export default InteractiveMap;