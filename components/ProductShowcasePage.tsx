
import React, { useState, useMemo } from 'react';
import { Package, Search, Filter, ShieldCheck, Zap, Info, ArrowUpRight } from 'lucide-react';
import type { Product } from '../data/mockData';

interface Props {
  products: Product[];
  onViewProduct: (id: string) => void;
}

const ProductShowcasePage: React.FC<Props> = ({ products, onViewProduct }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'All', label: '全部产品' },
    { id: 'eVTOL', label: '飞行汽车' },
    { id: 'Cargo Drone', label: '货运无人机' },
    { id: 'Consumer Drone', label: '消费级无人机' },
    { id: 'Infrastructure', label: '地面基础设施' },
    { id: 'Components', label: '核心零部件' }
  ];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const categoryMatch = selectedCategory === 'All' || p.category === selectedCategory;
      const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-16">
          <div className="flex items-center space-x-2 text-blue-600 font-black uppercase tracking-[0.2em] text-xs mb-4">
            <Package className="w-4 h-4" />
            <span>Product Exhibition</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">全球低空经济产品展示</h1>
          <p className="text-slate-500 text-lg max-w-3xl leading-relaxed font-medium">
            探索驱动未来空域发展的核心硬件。汇聚全球最先进的 eVTOL 飞行器、智慧物流无人机及低空基础设施核心技术。
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-[2.5rem] p-8 mb-12 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 w-full">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="text"
                placeholder="搜索产品或品牌..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                  selectedCategory === cat.id 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProducts.map(product => (
            <div 
              key={product.id}
              onClick={() => onViewProduct(product.id)}
              className="bg-white rounded-[3rem] overflow-hidden border border-slate-100 hover:shadow-2xl hover:border-blue-100 transition-all duration-500 flex flex-col group cursor-pointer"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute top-6 left-6 flex space-x-2">
                  <span className="px-4 py-1.5 bg-white/95 backdrop-blur text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm">
                    {product.category}
                  </span>
                </div>
                <div className="absolute bottom-6 right-6">
                   <div className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg ${
                     product.status === 'Certified' ? 'bg-green-500 text-white' :
                     product.status === 'Concept' ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'
                   }`}>
                     {product.status}
                   </div>
                </div>
              </div>

              <div className="p-10 flex flex-col flex-1">
                <div className="mb-6">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2 block">{product.brand}</span>
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                    {product.name}
                  </h3>
                </div>

                <p className="text-slate-400 text-sm font-medium mb-8 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>

                <div className="space-y-4 mb-10 flex-1">
                  {product.specs.map((spec, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{spec.label}</span>
                      <span className="text-sm font-bold text-slate-800">{spec.value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onViewProduct(product.id); }}
                    className="flex-1 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center space-x-2"
                  >
                    <Zap className="w-4 h-4" />
                    <span>咨询参数</span>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onViewProduct(product.id); }}
                    className="w-14 h-14 bg-slate-50 text-slate-400 border border-slate-100 rounded-2xl flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all"
                  >
                    <ArrowUpRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <div className="col-span-full py-40 text-center bg-white border border-slate-100 rounded-[4rem]">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest">未找到匹配的产品</h3>
              <p className="text-slate-300 text-sm mt-2">请尝试搜索其他关键词或更换分类</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductShowcasePage;
