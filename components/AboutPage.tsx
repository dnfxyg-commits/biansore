import React from 'react';
import { Plane, Users, Target, ShieldCheck, Mail, MapPin, Phone } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero */}
      <div className="bg-slate-900 py-20 mb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 blur-[150px] rounded-full -mr-40 -mt-40"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">连接全球天空资源</h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto">
            BIANAero 赋佐 是致力于推动全球低空经济繁荣的领先数字化门户。
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center mb-32">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">我们的使命</h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-8">
              随着 eVTOL 和无人机技术的爆发，低空领域正在成为人类交通的“第五维”。我们的使命是通过整合全球最前沿的展会信息、行业智库和技术动态，为低空经济的参与者提供一站式的决策支持。
            </p>
            <div className="space-y-4">
              {[
                { icon: Target, title: '精准对接', desc: '打破信息差，连接展商与专业观众。' },
                { icon: ShieldCheck, title: '权威数据', desc: '深度整合各国监管政策与行业标准。' },
                { icon: Users, title: '生态共建', desc: '携手顶尖企业，共筑城市空中交通未来。' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{item.title}</h4>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000" 
              className="rounded-[3rem] shadow-2xl relative z-10"
              alt="Lab Technology"
            />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-600 rounded-[2rem] -z-0"></div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-slate-50 p-12 md:p-20 rounded-[3rem] text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">联系我们</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <span className="text-slate-900 font-bold">电子邮件</span>
              <span className="text-slate-500 text-sm">contact@bianaero.io</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <span className="text-slate-900 font-bold">联系电话</span>
              <span className="text-slate-500 text-sm">+86 (755) 8888 8888</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="text-slate-900 font-bold">办公地址</span>
              <span className="text-slate-500 text-sm">中国 深圳 南山区 科技园</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;