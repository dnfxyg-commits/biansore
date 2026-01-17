
import React, { useState } from 'react';
import { ArrowLeft, Send, CheckCircle2, Building2, User, Mail, MessageSquare, Briefcase, MapPin, ChevronDown, Sparkles } from 'lucide-react';
import { Exhibition } from '../types';
import { EXHIBITIONS } from '../data/mockData';
import { submitBoothApplication } from '../services/api';

interface Props {
  exhibition: Exhibition;
  onBack: () => void;
}

const BoothApplicationPage: React.FC<Props> = ({ exhibition, onBack }) => {
  const [submitted, setSubmitted] = useState(false);
  const [selectedExhibitionId, setSelectedExhibitionId] = useState(exhibition.id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) {
      return;
    }

    const formData = new FormData(e.currentTarget);
    const companyName = (formData.get('companyName') || '').toString().trim();
    const contactName = (formData.get('contactName') || '').toString().trim();
    const workEmail = (formData.get('workEmail') || '').toString().trim();
    const boothArea = (formData.get('boothArea') || '').toString().trim();
    const purpose = (formData.get('purpose') || '').toString().trim();

    if (!companyName || !contactName || !workEmail || !purpose) {
      alert('请完整填写必填信息');
      return;
    }

    setIsSubmitting(true);
    const ok = await submitBoothApplication({
      exhibitionId: selectedExhibitionId,
      companyName,
      contactName,
      workEmail,
      boothArea: boothArea || undefined,
      purpose
    });
    setIsSubmitting(false);

    if (ok) {
      setSubmitted(true);
    } else {
      alert('提交失败，请稍后重试');
    }
  };

  const selectedEx = EXHIBITIONS.find(ex => ex.id === selectedExhibitionId) || exhibition;

  if (submitted) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-20 px-4 flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-4">申请已提交</h1>
          <p className="text-slate-500 mb-10 leading-relaxed font-medium">
            您的展位申请资料已进入审核序列。展会官方招商团队将在 48 小时内为您提供定制化展位方案及报价。
          </p>
          <button 
            onClick={onBack}
            className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl"
          >
            返回展会详情
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 animate-in slide-in-from-right-4 duration-500">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-500 hover:text-blue-600 font-bold mb-10 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>返回展会详情</span>
        </button>

            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          <div className="bg-[#0f172a] p-12 text-white relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] -mr-32 -mt-32"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 text-blue-400 font-black uppercase tracking-widest text-xs mb-4">
                <Briefcase className="w-4 h-4" />
                <span>Exhibitor Portal</span>
              </div>
              <h1 className="text-4xl font-black mb-4">申请参展位</h1>
              <div className="flex items-center text-slate-400 space-x-6">
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                  {selectedEx.title}
                </div>
                <div className="flex items-center text-sm font-bold text-blue-400">
                  <Sparkles className="w-4 h-4 mr-2" />
                  招展火热进行中
                </div>
              </div>
            </div>
          </div>

            <div className="p-12 md:p-16">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Added Exhibition Selection Field */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">意向参展展会</label>
                <div className="relative">
                  <select 
                    value={selectedExhibitionId}
                    onChange={(e) => setSelectedExhibitionId(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 appearance-none outline-none font-bold cursor-pointer pr-12"
                  >
                    {EXHIBITIONS.map(ex => (
                      <option key={ex.id} value={ex.id}>{ex.title}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">企业名称</label>
                  <div className="relative">
                    <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      required
                      type="text" 
                      name="companyName"
                      placeholder="Enter company name"
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">联系人姓名</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      required
                      type="text" 
                      name="contactName"
                      placeholder="Contact person"
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">商务邮箱</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      required
                      type="email" 
                      name="workEmail"
                      placeholder="work@company.com"
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">预期展位面积 (㎡)</label>
                  <div className="relative">
                  <select name="boothArea" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 appearance-none outline-none font-bold cursor-pointer pr-12">
                      <option>9 - 18 ㎡ (标摊)</option>
                      <option>18 - 36 ㎡ (小面积光地)</option>
                      <option>36 - 72 ㎡ (中型光地)</option>
                      <option>72 ㎡ 以上 (特装光地)</option>
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">参展目的与主营产品</label>
                <div className="relative">
                  <MessageSquare className="absolute left-5 top-6 w-5 h-5 text-slate-400" />
                  <textarea 
                    required
                    rows={4}
                    name="purpose"
                    placeholder="Tell us about your exhibit objectives..."
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none font-medium"
                  ></textarea>
                </div>
              </div>

              <div className="pt-8">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 bg-blue-600 text-white font-black text-lg rounded-2xl hover:bg-blue-700 transition-all shadow-xl flex items-center justify-center space-x-3 group active:scale-[0.98] disabled:opacity-50"
                >
                  <span>确认提交申请资料</span>
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
                <div className="flex items-center justify-center space-x-6 mt-10 text-slate-400">
                  <div className="flex items-center text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                    信息加密传输
                  </div>
                  <div className="flex items-center text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                    优先审核权
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoothApplicationPage;
