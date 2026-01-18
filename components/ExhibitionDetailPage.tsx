
import React from 'react';
import { ArrowLeft, Calendar, MapPin, Globe, CheckCircle2, Users, Briefcase, Zap, Ticket } from 'lucide-react';
import { Exhibition } from '../types';

interface Props {
  exhibition: Exhibition;
  onBack: () => void;
  onApplyBooth?: () => void;
  onBookTickets?: () => void;
}

const ExhibitionDetailPage: React.FC<Props> = ({ exhibition, onBack, onApplyBooth, onBookTickets }) => {
  return (
    <div className="min-h-screen bg-white pt-24 pb-20 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-slate-400 mb-8">
          <button onClick={onBack} className="hover:text-blue-600 transition-colors">展会列表</button>
          <span>/</span>
          <span className="text-slate-900 font-medium truncate max-w-[200px]">{exhibition.title}</span>
        </div>

        {/* Hero Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-8">
            <div className="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden shadow-2xl mb-10 group">
              <img 
                src={exhibition.imageUrl || 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=1200'} 
                alt={exhibition.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-8 left-8 flex space-x-3">
                <span className="px-5 py-2 bg-white/95 backdrop-blur text-blue-600 text-xs font-black rounded-full uppercase tracking-widest shadow-xl">
                  {exhibition.category}
                </span>
                {exhibition.featured && (
                  <span className="px-5 py-2 bg-amber-400 text-amber-900 text-xs font-black rounded-full uppercase tracking-widest shadow-xl">
                    Featured Event
                  </span>
                )}
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-tight mb-8">
              {exhibition.title}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-8 border-y border-slate-100 mb-10">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">举办日期</div>
                  <div className="text-base font-bold text-slate-900">{exhibition.date}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">地点</div>
                  <div className="text-base font-bold text-slate-900">{exhibition.location}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">地区</div>
                  <div className="text-base font-bold text-slate-900">{exhibition.region}</div>
                </div>
              </div>
            </div>

            <div className="prose prose-slate max-w-none">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <Zap className="w-6 h-6 mr-3 text-blue-600" />
                展会核心价值
              </h3>
              <p className="text-slate-500 text-lg leading-relaxed mb-8">
                {exhibition.description} 作为全球低空经济产业链的交流枢纽，本届展会将全面展示无人系统、低空空域管理、eVTOL 基础设施以及最新的相关法律法规。这里不仅是技术的展示台，更是行业领袖对话、政策制定者沟通的关键平台。
              </p>
              
              <div className="bg-slate-50 p-8 rounded-[2.5rem] mb-12 border border-slate-100">
                <h4 className="text-xl font-bold text-slate-900 mb-6">重点展示内容</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    '航空碳减排与可持续飞行技术',
                    '全球低空经济投融资趋势论坛',
                    '全电动垂直起降飞行器 (eVTOL) 实机演示',
                    '5G/6G 低空专用通信网络解决方案',
                    '城市智慧物流与末端配送无人机群',
                    '低空空域数字化管理系统 (UTM)'
                  ].map((item, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              {/* Participation Card - Optimized Order based on Screenshot */}
              <div className="bg-[#0f172a] p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden border border-slate-800">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -mr-10 -mt-10"></div>
                
                {/* Stats Section */}
                <div className="space-y-6 mb-10">
                  <div className="flex items-center justify-between py-3 border-b border-white/5">
                    <span className="text-slate-400 text-sm font-medium">入场申请</span>
                    <span className="text-[#4ade80] font-bold flex items-center text-sm">
                      <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full mr-2 animate-pulse"></span>
                      正在开放
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-white/5">
                    <span className="text-slate-400 text-sm font-medium">预计展商</span>
                    <span className="text-white font-bold text-sm tracking-tight">2,500+ 全球名企</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-white/5">
                    <span className="text-slate-400 text-sm font-medium">专业观众</span>
                    <span className="text-white font-bold text-sm tracking-tight">50,000+ 预计</span>
                  </div>
                </div>

                {/* Buttons Section */}
                <div className="space-y-4">
                  <button 
                    onClick={onBookTickets}
                    className="w-full py-5 bg-[#2563eb] text-white font-black rounded-2xl flex items-center justify-center space-x-3 hover:bg-blue-500 transition-all shadow-xl active:scale-[0.98]"
                  >
                    <Ticket className="w-5 h-5" />
                    <span>门票预订</span>
                  </button>
                  <button 
                    onClick={onApplyBooth}
                    className="w-full py-5 bg-white/5 backdrop-blur text-white font-black rounded-2xl flex items-center justify-center space-x-3 hover:bg-white/10 transition-all border border-white/10 active:scale-[0.98]"
                  >
                    <Briefcase className="w-5 h-5" />
                    <span>展位申请</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExhibitionDetailPage;
