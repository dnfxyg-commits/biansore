import React from 'react';
import { Plane, Phone, MapPin, Twitter, Linkedin, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-start">
          {/* Left: Brand info */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <Plane className="w-8 h-8 text-blue-600 rotate-[-15deg]" />
              <span className="text-xl font-bold tracking-tight text-slate-800">BIAN<span className="text-blue-600">Soar</span> <span className="text-slate-900 font-black">赋佐</span></span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-sm">
              专业的全球低空经济展会信息门户。我们致力于连接全球创新者，推动低空空域的价值释放。
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all"><Linkedin className="w-4 h-4" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all"><Facebook className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Right: Contact info */}
          <div className="flex flex-col md:items-end">
            <h4 className="font-bold text-slate-900 mb-6">联系我们</h4>
            <ul className="space-y-4 text-sm text-slate-500 md:text-right">
              <li className="flex items-center md:justify-end space-x-3">
                <Phone className="w-4 h-4 text-slate-400" /> 
                <span className="font-medium">18516330891</span>
              </li>
              <li className="flex items-center md:justify-end space-x-3">
                <MapPin className="w-4 h-4 text-slate-400" /> 
                <span className="font-medium">中国 上海 虹桥 长三角展贸中心</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400">
          <p>© 2024 BIANSoar 赋佐 Global Low-Altitude Economy Portal. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-blue-600">隐私政策</a>
            <a href="#" className="hover:text-blue-600">服务条款</a>
            <a href="#" className="hover:text-blue-600">Cookie 设置</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;