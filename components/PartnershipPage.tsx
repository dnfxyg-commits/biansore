import React, { useState } from 'react';
import { ArrowLeft, Send, CheckCircle2, Building2, User, Mail, MessageSquare, Sparkles, Smartphone, MapPin } from 'lucide-react';
import { submitPartnershipApplication } from '../services/api';

interface Props {
  onBack: () => void;
}

const PartnershipPage: React.FC<Props> = ({ onBack }) => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) {
      return;
    }

    const formData = new FormData(e.currentTarget);
    const name = (formData.get('name') || '').toString().trim();
    const company = (formData.get('company') || '').toString().trim();
    const phone = (formData.get('phone') || '').toString().trim();
    const city = (formData.get('city') || '').toString().trim();
    const email = (formData.get('email') || '').toString().trim();
    const message = (formData.get('message') || '').toString().trim();

    if (!name || !company || !phone || !city || !email || !message) {
      alert('请完整填写必填信息');
      return;
    }

    setIsSubmitting(true);
    const ok = await submitPartnershipApplication({
      name,
      company,
      phone,
      city,
      email,
      message
    });
    setIsSubmitting(false);

    if (ok) {
      setSubmitted(true);
    } else {
      alert('提交失败，请稍后重试');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-20 px-4 flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-4">申请已提交</h1>
          <p className="text-slate-500 mb-10 leading-relaxed font-medium">
            感谢您对 BIANAero 赋佐 合作伙伴计划关注。我们的团队将在 2-3 个工作日内审阅您的资料并与您取得联系。
          </p>
          <button 
            onClick={onBack}
            className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfdfe] pt-32 pb-20 px-4 animate-in slide-in-from-right-4 duration-500">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-500 hover:text-blue-600 font-bold mb-10 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>返回首页</span>
        </button>

        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 text-blue-600 font-black tracking-[0.2em] text-xs uppercase mb-4">
            <Sparkles className="w-4 h-4" />
            <span>PARTNER ECOSYSTEM</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">申请加入战略合作</h1>
          <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            与 BIANAero 赋佐 携手，共同定义全球低空经济的未来。请填写以下表格，开启您的低空之旅。
          </p>
        </div>

        <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-slate-100 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 blur-[100px] pointer-events-none -mr-32 -mt-32"></div>
          
          <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
            {/* Row 1: Name and Company */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">姓名</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    required
                    type="text" 
                    name="name"
                    placeholder="你的姓名"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none font-bold shadow-sm"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">公司/机构名称</label>
                <div className="relative">
                  <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    required
                    type="text" 
                    name="company"
                    placeholder="所属机构全称"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none font-bold shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Phone and City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">手机号</label>
                <div className="relative">
                  <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    required
                    type="tel" 
                    name="phone"
                    placeholder="请输入联系电话"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none font-bold shadow-sm"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">常住城市</label>
                <div className="relative">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    required
                    type="text" 
                    name="city"
                    placeholder="请输入您所在的城市"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none font-bold shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Email */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">电子邮箱</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  required
                  type="email" 
                  name="email"
                  placeholder="example@company.com"
                  className="w-full pl-14 pr-6 py-5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none font-bold shadow-sm"
                />
              </div>
            </div>

            {/* Row 4: Message */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">合作意向/留言</label>
              <div className="relative">
                <MessageSquare className="absolute left-5 top-7 w-5 h-5 text-slate-400" />
                <textarea 
                  required
                  rows={4}
                  name="message"
                  placeholder="请简述您的合作想法..."
                  className="w-full pl-14 pr-6 py-6 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none font-bold shadow-sm"
                ></textarea>
              </div>
            </div>

            <div className="pt-8">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-6 bg-blue-600 text-white font-black text-xl rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center space-x-3 group active:scale-[0.98] disabled:opacity-50"
              >
                <span>提交申请</span>
                <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PartnershipPage;
