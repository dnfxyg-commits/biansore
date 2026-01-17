import React, { useState } from 'react';
import { Send, CheckCircle2, Building2, User, Mail, MessageSquare, Sparkles } from 'lucide-react';

const PartnershipSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="py-24 bg-white flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
        <div className="max-w-md w-full text-center px-4">
          <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">申请已提交</h2>
          <p className="text-slate-500 mb-10 leading-relaxed font-medium">
            感谢您对 AeroVista 合作伙伴计划的关注。我们的团队将在 2-3 个工作日内与您联系。
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="px-8 py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all shadow-lg"
          >
            再次填写
          </button>
        </div>
      </div>
    );
  }

  return (
    <section id="partnership-section" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-50/30 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 text-blue-600 font-black tracking-[0.2em] text-xs uppercase mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Partner Ecosystem</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">申请加入合作伙伴计划</h2>
          <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            与 AeroVista 携手，共同定义全球低空经济的未来。请填写以下表格，开启您的低空之旅。
          </p>
        </div>

        <div className="bg-slate-50 rounded-[3rem] p-8 md:p-14 border border-slate-100 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">姓名</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    required
                    type="text" 
                    placeholder="你的姓名"
                    className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium shadow-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">公司/机构名称</label>
                <div className="relative">
                  <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    required
                    type="text" 
                    placeholder="所属机构全称"
                    className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">电子邮箱</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  required
                  type="email" 
                  placeholder="example@company.com"
                  className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">合作意向/留言</label>
              <div className="relative">
                <MessageSquare className="absolute left-5 top-6 w-5 h-5 text-slate-400" />
                <textarea 
                  required
                  rows={4}
                  placeholder="请简述您的合作想法..."
                  className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none font-medium shadow-sm"
                ></textarea>
              </div>
            </div>

            <div className="pt-6">
              <button 
                type="submit"
                className="w-full py-5 bg-blue-600 text-white font-black text-lg rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center space-x-3 group active:scale-[0.98]"
              >
                <span>提交申请</span>
                <span className="w-1.5 h-1.5 bg-white rounded-full opacity-50 group-hover:scale-150 transition-transform"></span>
              </button>
              <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-8">
                By submitting you agree to our <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default PartnershipSection;