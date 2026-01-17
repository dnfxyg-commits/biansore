
import React from 'react';
import { Plane, Search, Globe, Menu } from 'lucide-react';

interface Props {
  onNavigate: (view: 'landing' | 'calendar' | 'insights' | 'center' | 'partnership' | 'products') => void;
  currentView: string;
}

const Navbar: React.FC<Props> = ({ onNavigate, currentView }) => {
  const links = [
    { id: 'landing', label: '首页' },
    { id: 'domestic', label: '国内展会' },
    { id: 'insights', label: '低空播客' },
    { id: 'products', label: '产品展示' },
    { id: 'center', label: '场馆信息' },
    { id: 'partnership', label: '战略合作' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button 
            onClick={() => onNavigate('landing')}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <Plane className="w-8 h-8 text-blue-600 rotate-[-15deg]" />
            <span className="text-xl font-bold tracking-tight text-slate-800">BIAN<span className="text-blue-600">Soar</span> <span className="text-slate-900 font-black">赋佐</span></span>
          </button>

          <div className="hidden md:flex items-center space-x-8">
            {links.map(link => (
              <button 
                key={link.id}
                onClick={() => onNavigate(link.id as any)}
                className={`text-sm font-bold transition-colors ${currentView === link.id ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-500 hover:text-blue-600 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-500 hover:text-blue-600 transition-colors">
              <Globe className="w-5 h-5" />
            </button>
            <button className="md:hidden p-2 text-slate-500">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
