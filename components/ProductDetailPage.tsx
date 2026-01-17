
import React from 'react';
import { ArrowLeft, Zap, ShieldCheck, Cpu, Globe, Info, MessageSquare, ChevronRight } from 'lucide-react';
import { Product } from '../data/mockData';

interface Props {
  product: Product;
  onBack: () => void;
}

const ProductDetailPage: React.FC<Props> = ({ product, onBack }) => {
  return (
    <div className="min-h-screen bg-white pt-24 pb-20 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-400 hover:text-blue-600 font-bold mb-10 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>返回产品展示</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Side: Large Image Showcase */}
          <div className="lg:col-span-7">
            <div className="sticky top-28">
              <div className="relative aspect-[16/10] rounded-[3.5rem] overflow-hidden shadow-2xl border border-slate-100 group">
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]"
                />
                <div className="absolute top-8 left-8">
                  <span className="px-5 py-2 bg-white/95 backdrop-blur text-blue-600 text-xs font-black rounded-full uppercase tracking-widest shadow-xl">
                    {product.category}
                  </span>
                </div>
                <div className="absolute bottom-8 right-8">
                  <div className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest shadow-2xl backdrop-blur-md border border-white/20 ${
                    product.status === 'Certified' ? 'bg-green-500/90 text-white' :
                    product.status === 'Concept' ? 'bg-amber-500/90 text-white' : 'bg-blue-600/90 text-white'
                  }`}>
                    {product.status}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-6 mt-10">
                {[1, 2, 3].map(i => (
                  <div key={i} className="aspect-square rounded-[2rem] overflow-hidden border border-slate-100 cursor-pointer hover:border-blue-400 transition-colors group">
                    <img 
                      src={product.imageUrl} 
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
                      alt={`View ${i}`} 
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Information */}
          <div className="lg:col-span-5">
            <div className="mb-10">
              <span className="text-sm font-black text-blue-500 uppercase tracking-[0.3em] mb-4 block">
                {product.brand}
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-8">
                {product.name}
              </h1>
              <p className="text-slate-500 text-lg leading-relaxed mb-10 font-medium">
                {product.description}
              </p>
            </div>

            <div className="space-y-6 mb-12">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Technical Specifications</h3>
              <div className="grid grid-cols-1 gap-4">
                {product.specs.map((spec, i) => (
                  <div key={i} className="p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 flex justify-between items-center group hover:bg-white hover:border-blue-100 hover:shadow-md transition-all">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                        {i === 0 ? <Zap className="w-5 h-5" /> : i === 1 ? <Cpu className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                      </div>
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{spec.label}</span>
                    </div>
                    <span className="text-lg font-black text-slate-900">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0f172a] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -mr-10 -mt-10"></div>
               <h3 className="text-xl font-bold mb-6 flex items-center">
                 <MessageSquare className="w-5 h-5 mr-3 text-blue-400" />
                 咨询与订购
               </h3>
               <p className="text-slate-400 text-sm mb-10 leading-relaxed">
                 如需获取详细技术手册、定制化方案或采购预约，请与我们的全球大客户部取得联系。
               </p>
               <div className="space-y-4">
                  <button className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 transition-all shadow-xl group flex items-center justify-center space-x-3">
                    <span>立即咨询参数</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="w-full py-5 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all border border-white/10">
                    获取 PDF 技术手册
                  </button>
               </div>
               <div className="mt-10 pt-10 border-t border-white/5 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">预计交付</div>
                    <div className="text-sm font-bold">2026 Q3</div>
                  </div>
                  <div className="text-center border-l border-white/5">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">全球质保</div>
                    <div className="text-sm font-bold">5 YEARS</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
