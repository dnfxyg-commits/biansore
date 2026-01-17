
import React, { useState } from 'react';
import { ArrowLeft, Send, CheckCircle2, User, Mail, Ticket, CreditCard, ShieldCheck, MapPin } from 'lucide-react';
import { Exhibition } from '../types';
import { submitTicketBooking } from '../services/api';

interface Props {
  exhibition: Exhibition;
  onBack: () => void;
}

const TicketBookingPage: React.FC<Props> = ({ exhibition, onBack }) => {
  const [submitted, setSubmitted] = useState(false);
  const [ticketType, setTicketType] = useState('Standard');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) {
      return;
    }

    const formData = new FormData(e.currentTarget);
    const name = (formData.get('name') || '').toString().trim();
    const email = (formData.get('email') || '').toString().trim();

    if (!name || !email) {
      alert('请完整填写必填信息');
      return;
    }

    setIsSubmitting(true);
    const ok = await submitTicketBooking({
      exhibitionId: exhibition.id,
      ticketType,
      name,
      email
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
          <h1 className="text-3xl font-black text-slate-900 mb-4">预订成功！</h1>
          <p className="text-slate-500 mb-10 leading-relaxed font-medium">
            您的电子票确认函已发送至邮箱。请在展会期间出示二维码入场。
          </p>
          <button 
            onClick={onBack}
            className="px-10 py-4 bg-[#0f172a] text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl"
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
              <div className="p-10 md:p-14">
                <div className="mb-12">
                  <div className="flex items-center space-x-3 text-blue-600 font-black uppercase tracking-widest text-xs mb-4">
                    <Ticket className="w-4 h-4" />
                    <span>Booking System</span>
                  </div>
                  <h1 className="text-3xl font-black text-slate-900 mb-2">门票预订</h1>
                  <p className="text-slate-500 text-sm font-medium">请填写您的参会信息以完成登记。</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button 
                        type="button"
                        onClick={() => setTicketType('Standard')}
                        className={`p-6 rounded-2xl border-2 text-left transition-all ${ticketType === 'Standard' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}
                      >
                        <div className="font-black text-slate-900 mb-1">专业观众票</div>
                        <div className="text-xs text-slate-500 mb-4 font-medium">包含展区参观及开幕式</div>
                        <div className="text-xl font-black text-blue-600">¥ 0 <span className="text-[10px] text-slate-400 font-bold ml-1">(早鸟免费)</span></div>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setTicketType('VIP')}
                        className={`p-6 rounded-2xl border-2 text-left transition-all ${ticketType === 'VIP' ? 'border-amber-500 bg-amber-50/50' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}
                      >
                        <div className="font-black text-slate-900 mb-1">VIP 贵宾票</div>
                        <div className="text-xs text-slate-500 mb-4 font-medium">包含全场论坛、午餐及休息室</div>
                        <div className="text-xl font-black text-amber-600">¥ 2,800</div>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">参会人姓名</label>
                    <div className="relative">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        required
                        type="text" 
                        name="name"
                        placeholder="Your full name"
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">联系邮箱</label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        required
                        type="email" 
                        name="email"
                        placeholder="Email for confirmation"
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                      />
                    </div>
                  </div>

                  <div className="pt-6">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-5 bg-blue-600 text-white font-black text-lg rounded-2xl hover:bg-blue-700 transition-all shadow-xl flex items-center justify-center space-x-3 group disabled:opacity-50"
                    >
                      <span>{ticketType === 'Standard' ? '立即免费登记' : '前往支付预订'}</span>
                      <CreditCard className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-[#0f172a] rounded-[2.5rem] p-8 text-white shadow-2xl space-y-8 sticky top-32">
              <h3 className="text-xl font-bold border-b border-white/10 pb-6">订单摘要</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">活动名称</span>
                  <span className="font-bold text-right truncate ml-4">{exhibition.title}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">门票类型</span>
                  <span className="font-bold text-blue-400">{ticketType === 'Standard' ? '专业观众票' : 'VIP 贵宾票'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">举办城市</span>
                  <span className="font-bold">{exhibition.location}</span>
                </div>
              </div>
              
              <div className="pt-6 border-t border-white/10">
                <div className="flex justify-between items-end mb-8">
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">应付金额</span>
                  <div className="text-3xl font-black text-blue-500">¥ {ticketType === 'Standard' ? '0' : '2,800'}</div>
                </div>
                
                <div className="bg-white/5 rounded-2xl p-4 flex items-start space-x-3">
                  <ShieldCheck className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    本系统支持加密支付与多币种结算。预订成功后不可退款，但可申请门票转让。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketBookingPage;
