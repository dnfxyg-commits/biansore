
import React from 'react';
import { ArrowLeft, MapPin, Maximize, Phone, Globe, Info, Zap, Calendar, Building2, Layers } from 'lucide-react';
import type { ExhibitionCenter } from '../data/mockData';

interface Props {
  venue: ExhibitionCenter;
  onBack: () => void;
}

const VenueDetailPage: React.FC<Props> = ({ venue, onBack }) => {
  return (
    <div className="min-h-screen bg-white pt-24 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-400 hover:text-blue-600 font-bold mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>返回场馆列表</span>
        </button>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          <div className="relative rounded-[3rem] overflow-hidden shadow-2xl h-[500px]">
            <img src={venue.imageUrl} alt={venue.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            <div className="absolute bottom-10 left-10">
               <span className="px-4 py-2 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-lg">
                 Official Venue
               </span>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
              {venue.name}
            </h1>
            <p className="text-slate-400 text-lg font-bold mb-10 uppercase tracking-widest">{venue.nameEn}</p>
            
            <div className="grid grid-cols-2 gap-8 mb-12">
               <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-200 transition-all">
                  <Maximize className="w-6 h-6 text-blue-600 mb-3" />
                  <div className="text-xs font-black text-slate-400 uppercase tracking-widest">总展览面积</div>
                  <div className="text-xl font-black text-slate-900">{venue.area}</div>
               </div>
               <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-200 transition-all">
                  <MapPin className="w-6 h-6 text-blue-600 mb-3" />
                  <div className="text-xs font-black text-slate-400 uppercase tracking-widest">地理位置</div>
                  <div className="text-xl font-black text-slate-900">{venue.city}</div>
               </div>
            </div>

            <div className="space-y-6">
               <div className="flex items-center space-x-4 p-4 bg-white border border-slate-100 rounded-2xl">
                 <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <Info className="w-5 h-5" />
                 </div>
                 <div>
                    <div className="text-xs font-bold text-slate-400">场馆地址</div>
                    <div className="text-sm font-bold text-slate-800">{venue.address}</div>
                 </div>
               </div>
               <div className="flex items-center space-x-4 p-4 bg-white border border-slate-100 rounded-2xl">
                 <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <Phone className="w-5 h-5" />
                 </div>
                 <div>
                    <div className="text-xs font-bold text-slate-400">联系电话</div>
                    <div className="text-sm font-bold text-slate-800">+86 021-8888 8888</div>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Detailed Info Tabs Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center">
              <Zap className="w-6 h-6 mr-3 text-blue-600" />
              场馆介绍
            </h2>
            <div className="prose prose-slate max-w-none mb-12">
              <p className="text-lg text-slate-500 leading-relaxed">
                {venue.description} 作为本地区顶尖的低空经济承载平台，{venue.name} 拥有世界级的硬件设施和专业的服务团队。场馆特别针对无人机试飞、eVTOL 静态展示以及高并发数字化会议进行了全面优化，是未来城市空中交通（UAM）行业首选的展示窗口。
              </p>
            </div>

            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center">
              <Layers className="w-6 h-6 mr-3 text-blue-600" />
              配套设施
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
               {venue.facilities.map((f, i) => (
                 <div key={i} className="px-6 py-4 bg-white border border-slate-100 rounded-2xl text-center shadow-sm">
                   <div className="text-xs font-black text-slate-800 uppercase tracking-widest">{f}</div>
                 </div>
               ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-[#0f172a] p-8 rounded-[2.5rem] text-white shadow-2xl">
               <h3 className="text-xl font-bold mb-6">申请使用场馆</h3>
               <p className="text-slate-400 text-sm mb-8">如果您计划在此举办低空经济相关展会或会议，请联系我们的全球运营中心。</p>
               <button className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 transition-all shadow-xl">
                 在线咨询
               </button>
               <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                  <div className="flex items-center space-x-3 text-xs text-slate-500">
                    <Calendar className="w-4 h-4" />
                    <span>查看场馆排期表</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-slate-500">
                    <Building2 className="w-4 h-4" />
                    <span>获取技术手册 (PDF)</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetailPage;
