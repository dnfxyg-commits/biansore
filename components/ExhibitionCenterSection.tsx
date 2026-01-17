
import React, { useState, useMemo } from 'react';
import { Building2, Search, MapPin, ChevronRight, Globe, Layers } from 'lucide-react';
import type { ExhibitionCenter } from '../data/mockData';

interface Props {
  centers: ExhibitionCenter[];
  onViewVenue: (id: string) => void;
}

const ExhibitionCenterSection: React.FC<Props> = ({ centers, onViewVenue }) => {
  const [selectedRegion, setSelectedRegion] = useState('China');
  const [selectedCity, setSelectedCity] = useState('上海');

  const regions = [
    { label: '全部', value: 'All' },
    { label: '中国', value: 'China' },
    { label: '亚洲', value: 'Asia' },
    { label: '欧洲', value: 'Europe' },
    { label: '非洲', value: 'Africa' },
    { label: '北美洲', value: 'Americas' },
    { label: '南美洲', value: 'South Americas' },
    { label: '大洋洲', value: 'Oceania' },
    { label: '中东地区', value: 'Middle East' }
  ];

  const chinaCities = [
    '全部', '北京', '香港', '澳门', '台湾', '上海', '天津', '重庆', '河北', '更多'
  ];

  const filteredCenters = useMemo(() => {
    return centers.filter(center => {
      const regionMatch = selectedRegion === 'All' || center.region === selectedRegion;
      const cityMatch = selectedCity === '全部' || center.city === selectedCity;
      return regionMatch && cityMatch;
    });
  }, [selectedRegion, selectedCity, centers]);

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header Area */}
        <div className="flex items-center space-x-4 mb-8">
           <div className="bg-white p-2 rounded-lg shadow-sm">
             <Building2 className="w-5 h-5 text-blue-600" />
           </div>
           <div>
             <span className="text-xs font-black text-slate-400 uppercase tracking-widest">AeroVista Network</span>
             <h1 className="text-xl font-bold text-slate-900">场馆信息库</h1>
           </div>
        </div>

        {/* Filtering Bar - Redesigned to match screenshot */}
        <div className="bg-white border border-slate-100 rounded-3xl p-8 mb-10 shadow-sm transition-all hover:shadow-md">
          {/* Region Level */}
          <div className="flex items-start mb-6">
            <div className="w-20 flex-shrink-0 text-sm font-bold text-slate-400 py-1 tracking-widest">地区</div>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {regions.map((reg) => (
                <button
                  key={reg.value}
                  onClick={() => setSelectedRegion(reg.value)}
                  className={`text-sm font-bold transition-all px-3 py-1 rounded-lg ${
                    selectedRegion === reg.value 
                    ? 'text-red-500 font-black border border-red-100 bg-red-50/50' 
                    : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  {reg.label}
                </button>
              ))}
            </div>
          </div>

          {/* City Level */}
          {selectedRegion === 'China' && (
            <div className="flex items-start pt-6 border-t border-slate-50">
              <div className="w-20 flex-shrink-0 text-sm font-bold text-slate-400 py-1 tracking-widest">国家</div>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {chinaCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`text-sm font-bold transition-all px-3 py-1 rounded-lg ${
                      selectedCity === city 
                      ? 'text-red-500 font-black border border-red-100 bg-red-50/50' 
                      : 'text-slate-600 hover:text-blue-600'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Counter Info */}
        <div className="mb-8 flex items-center justify-between px-2">
          <div className="text-slate-500 text-sm font-medium flex items-center">
            共 <span className="text-orange-500 font-black mx-1.5 text-lg">{filteredCenters.length}</span> 条场馆
          </div>
          <div className="relative group cursor-pointer">
            <Search className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
          </div>
        </div>

        {/* Venue Listing - Refined Card Style */}
        <div className="space-y-6">
          {filteredCenters.map((center) => (
            <div 
              key={center.id} 
              onClick={() => onViewVenue(center.id)}
              className="bg-white border border-slate-100 rounded-[3rem] p-10 flex flex-col md:flex-row gap-12 hover:shadow-2xl hover:border-blue-100 transition-all duration-500 group cursor-pointer relative"
            >
              {/* Image Side */}
              <div className="w-full md:w-[380px] aspect-[16/10] rounded-[2.5rem] overflow-hidden flex-shrink-0 shadow-lg group-hover:shadow-blue-200/50 transition-all">
                <img 
                  src={center.imageUrl} 
                  alt={center.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
              </div>

              {/* Content Side */}
              <div className="flex-1 py-2 flex flex-col">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">
                      {center.name}
                    </h3>
                    {center.nameEn && (
                      <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest">{center.nameEn}</p>
                    )}
                  </div>
                  
                  {/* Jump Navigation Hint */}
                  <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm border border-slate-100 group-hover:border-blue-400">
                      <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-3 opacity-0 group-hover:opacity-100 transition-opacity">详情页面</span>
                  </div>
                </div>

                <div className="space-y-4 mb-10 flex-1">
                  <div className="flex items-start">
                    <span className="w-24 text-sm font-black text-slate-400 uppercase tracking-widest">国家地区:</span>
                    <span className="text-sm text-slate-800 font-bold">{center.location}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-24 text-sm font-black text-slate-400 uppercase tracking-widest">场馆地址:</span>
                    <span className="text-sm text-slate-800 font-bold">{center.address}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-24 text-sm font-black text-slate-400 uppercase tracking-widest">场馆面积:</span>
                    <span className="text-sm text-blue-600 font-black tracking-tight bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">{center.area}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-8 border-t border-slate-50">
                  {center.facilities.map((f, i) => (
                    <span key={i} className="px-5 py-1.5 bg-slate-50 border border-slate-100 text-[10px] font-black uppercase text-slate-500 rounded-full transition-colors group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {filteredCenters.length === 0 && (
            <div className="py-60 text-center bg-white border border-slate-100 rounded-[4rem] shadow-sm">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-200">
                <Layers className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold text-slate-400 tracking-widest uppercase">No Venues Found In This Region</h3>
              <p className="text-slate-300 text-sm mt-2">Try adjusting your filters to explore other locations</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExhibitionCenterSection;
