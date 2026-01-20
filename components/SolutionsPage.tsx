import React, { useEffect, useState } from 'react';
import { Layers, Truck, ShieldAlert, Camera, Leaf, Zap, Building2, Wifi, Box, Activity } from 'lucide-react';
import { fetchSolutions, type Solution } from '../services/api';

const ICON_MAP: Record<string, React.ElementType> = {
  Truck,
  ShieldAlert,
  Camera,
  Leaf,
  Zap,
  Building2,
  Wifi,
  Box,
  Layers,
  Activity
};

const SolutionsPage: React.FC = () => {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSolutions = async () => {
      try {
        const data = await fetchSolutions();
        setSolutions(data);
      } catch (error) {
        console.error('Failed to load solutions', error);
      } finally {
        setLoading(false);
      }
    };
    loadSolutions();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center space-x-4 mb-12">
           <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
             <Layers className="w-6 h-6 text-blue-600" />
           </div>
           <div>
             <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Solutions</span>
             <h1 className="text-2xl font-bold text-slate-900">低空场景解决方案</h1>
           </div>
        </div>

        {/* Introduction */}
        <div className="mb-16 max-w-3xl">
          <p className="text-lg text-slate-600 leading-relaxed">
            BIANSoar 赋佐致力于探索低空经济的无限可能。我们汇集了全球领先的低空应用场景解决方案，
            连接技术供给与市场需求，推动低空经济在各行各业的落地与创新。
          </p>
        </div>

        {/* Solutions Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-500">加载中...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution) => {
              const Icon = ICON_MAP[solution.icon] || Layers;
              return (
                <div key={solution.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-100 group">
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={solution.imageUrl} 
                      alt={solution.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-sm">
                      <div className="text-blue-600">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{solution.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">
                      {solution.description}
                    </p>
                    
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">关键应用</h4>
                      <div className="flex flex-wrap gap-2">
                        {solution.features.map((feature, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 text-xs font-medium border border-slate-100"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SolutionsPage;
