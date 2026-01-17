import React, { useState, useMemo } from 'react';
import { Search, Filter, Calendar as CalendarIcon, MapPin, Globe } from 'lucide-react';
import type { Exhibition } from '../types';
import ExhibitionCard from './ExhibitionCard';

interface Props {
  exhibitions: Exhibition[];
  onViewDetails?: (id: string) => void;
  initialRegion?: 'China' | 'Overseas' | 'All';
  title?: string;
}

const CalendarPage: React.FC<Props> = ({ exhibitions, onViewDetails, initialRegion = 'All', title = '展会日历' }) => {
  const [category, setCategory] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [selectedPopularRegion, setSelectedPopularRegion] = useState('All');

  // Updated month range to start from 2026 as per user request
  const months = [
    '2026年1月', '2026年2月', '2026年3月', '2026年4月', '2026年5月', '2026年6月',
    '2026年7月', '2026年8月', '2026年9月', '2026年10月', '2026年11月', '2026年12月'
  ];

  // Optimized city list for China (Optimized as requested)
  const popularOptions = initialRegion === 'China' 
    ? ['深圳', '广州', '北京', '上海', '成都', '珠海', '杭州', '西安', '南京'] 
    : ['德国', '美国', '法国', '新加坡', '中国'];

  const getStartDate = (dateStr: string) => {
    const match = dateStr.match(/^([a-zA-Z]+)\s+(\d+).*?(\d{4})$/);
    if (match) {
      const monthMap: { [key: string]: string } = {
        'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
        'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
      };
      const monthName = match[1];
      const month = monthMap[monthName] || '01';
      return new Date(`${match[3]}-${month}-01`);
    }
    return new Date(dateStr);
  };

  const filteredAndSorted = useMemo(() => {
    return exhibitions.filter(ex => {
      // Basic Navigation Filter (Domestic/International)
      if (initialRegion === 'China' && ex.region !== 'China') return false;
      if (initialRegion === 'Overseas' && ex.region === 'China') return false;

      // Industry Filter
      const matchesCategory = category === 'All' || ex.category === category;

      // Month Selection
      let matchesMonth = true;
      if (selectedMonth !== 'All') {
        const [yearStr, monthStr] = selectedMonth.split('年');
        const monthNum = parseInt(monthStr.replace('月', ''));
        const date = getStartDate(ex.date);
        matchesMonth = date.getFullYear().toString() === yearStr && (date.getMonth() + 1) === monthNum;
      }

      // Region/City Selection
      let matchesPopRegion = true;
      if (selectedPopularRegion !== 'All') {
        const internationalRegionMap: { [key: string]: string } = {
          '美国': 'Americas', '德国': 'Europe', '法国': 'Europe', '新加坡': 'Asia', '中国': 'China'
        };
        
        if (initialRegion === 'China') {
          // Optimization: Match by city name in location or title
          matchesPopRegion = ex.location.includes(selectedPopularRegion) || ex.title.includes(selectedPopularRegion);
        } else {
          matchesPopRegion = ex.region === internationalRegionMap[selectedPopularRegion] || ex.location.includes(selectedPopularRegion);
        }
      }

      return matchesCategory && matchesMonth && matchesPopRegion;
    });
  }, [category, selectedMonth, selectedPopularRegion, initialRegion, exhibitions]);

  return (
    <div className="min-h-screen bg-[#fcfdfe] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12">
           <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">{title}</h1>
           <p className="text-slate-400 font-medium">浏览低空经济全球重点博览项目</p>
        </div>

        {/* Optimized Filter Selection Card */}
        <div className="relative bg-white border border-slate-100 py-12 px-10 mb-20 shadow-[0_4px_30px_rgba(0,0,0,0.03)] rounded-[3rem]">
          <div className="space-y-12">
            {/* 展示时间 Row - Beautified Grid Layout */}
            <div className="flex items-start">
              <div className="w-28 flex-shrink-0 text-sm font-black text-slate-800 py-2.5 uppercase tracking-wider">展示时间</div>
              <div className="flex-1">
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-y-6 gap-x-4">
                  <button 
                    onClick={() => setSelectedMonth('All')}
                    className={`px-4 py-2.5 text-sm font-bold rounded-xl transition-all text-center whitespace-nowrap shadow-sm border ${selectedMonth === 'All' ? 'bg-[#ff6b35] text-white border-orange-400 shadow-orange-200/50' : 'text-slate-400 border-transparent hover:text-blue-600 hover:bg-blue-50/50'}`}
                  >
                    全部
                  </button>
                  {months.map(m => (
                    <button 
                      key={m}
                      onClick={() => setSelectedMonth(m)}
                      className={`px-4 py-2.5 text-sm font-bold rounded-xl transition-all text-center whitespace-nowrap border ${selectedMonth === m ? 'bg-[#ff6b35] text-white border-orange-400 shadow-orange-200/50' : 'text-slate-400 border-transparent hover:text-blue-600 hover:bg-blue-50/50'}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 热门地区/城市 Row - Beautified Grid Layout */}
            <div className="flex items-start">
              <div className="w-28 flex-shrink-0 text-sm font-black text-slate-800 py-2.5 uppercase tracking-wider">
                {initialRegion === 'China' ? '热门城市' : '热门国家'}
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-y-6 gap-x-4">
                  <button 
                    onClick={() => setSelectedPopularRegion('All')}
                    className={`px-4 py-2.5 text-sm font-bold rounded-xl transition-all text-center whitespace-nowrap shadow-sm border ${selectedPopularRegion === 'All' ? 'bg-[#ff6b35] text-white border-orange-400 shadow-orange-200/50' : 'text-slate-400 border-transparent hover:text-blue-600 hover:bg-blue-50/50'}`}
                  >
                    全部
                  </button>
                  {popularOptions.map(r => (
                    <button 
                      key={r}
                      onClick={() => setSelectedPopularRegion(r)}
                      className={`px-4 py-2.5 text-sm font-bold rounded-xl transition-all text-center whitespace-nowrap border ${selectedPopularRegion === r ? 'bg-[#ff6b35] text-white border-orange-400 shadow-orange-200/50' : 'text-slate-400 border-transparent hover:text-blue-600 hover:bg-blue-50/50'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="mb-10 px-4">
          <div className="flex items-center space-x-3 mb-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">为您甄选</h2>
            <div className="h-6 w-[1px] bg-slate-200 mx-2"></div>
            <span className="text-sm font-black text-slate-400 uppercase tracking-widest">
              {filteredAndSorted.length} Results
            </span>
          </div>
        </div>

        {/* Exhibition Listing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredAndSorted.map(ex => (
            <ExhibitionCard key={ex.id} exhibition={ex} onViewDetails={onViewDetails} />
          ))}
          
          {filteredAndSorted.length === 0 && (
            <div className="col-span-full py-40 text-center bg-slate-50/50 rounded-[4rem] border border-dashed border-slate-200">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <Search className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">未发现匹配的展会</h3>
              <button 
                onClick={() => {
                  setCategory('All'); 
                  setSelectedMonth('All'); 
                  setSelectedPopularRegion('All');
                }}
                className="px-8 py-3 bg-blue-600 text-white font-black text-sm rounded-xl hover:bg-blue-700 transition-all shadow-lg"
              >
                重置所有筛选
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
