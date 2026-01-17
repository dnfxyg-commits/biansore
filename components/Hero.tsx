import React from 'react';
import { Box, ShieldCheck, Zap, Plane, Globe, Handshake } from 'lucide-react';

interface Props {
  onNavigate: (view: 'landing' | 'partnership' | 'calendar' | 'insights' | 'about') => void;
  onOpenAI: () => void;
}

const Hero: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none -z-10 opacity-30">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-200 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider mb-8">
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>引领全球低空经济新时代</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-8 leading-[1.15]">
          探索全球 <span className="relative inline-block px-2">
            低空经济
          </span> <br /> 展会与创新动态
        </h1>

        {/* Subtitle - Updated branding to BIANSoar */}
        <div className="max-w-2xl mx-auto text-lg text-slate-500 mb-12 leading-relaxed font-medium">
          加入 BIANSoar 赋佐 全球节点，成为低空经济生态圈的关键一环，<br className="hidden md:block" />与万亿级产业共同腾飞。
        </div>
        
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-24">
          <button 
            onClick={() => onNavigate('partnership')}
            className="w-full sm:w-auto px-12 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center space-x-3 shadow-xl hover:scale-105 active:scale-95"
          >
            <span>战略合作</span>
            <Plane className="w-5 h-5 rotate-45" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: '全球展会', value: '500+', icon: Box },
            { label: '参展商', value: '12,000+', icon: Plane },
            { label: '覆盖国家', value: '60+', icon: Globe },
            { label: '行业合规', value: '100%', icon: ShieldCheck }
          ].map((stat, idx) => (
            <div key={idx} className="p-10 bg-white rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-3xl font-black text-slate-900 mb-2">{stat.value}</div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
