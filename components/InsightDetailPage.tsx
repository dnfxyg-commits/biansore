import React from 'react';
import { ArrowLeft, Share2, Clock, Calendar, MessageSquare, Bookmark, Sparkles } from 'lucide-react';
import { NewsItem } from '../types';

interface Props {
  insight: NewsItem;
  onBack: () => void;
}

const InsightDetailPage: React.FC<Props> = ({ insight, onBack }) => {
  return (
    <div className="min-h-screen bg-white pt-24 pb-20 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-400 hover:text-blue-600 font-bold mb-10 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>返回资讯列表</span>
        </button>

        {/* Article Header */}
        <header className="mb-12">
          <div className="flex items-center space-x-4 mb-6">
            <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase rounded-lg shadow-lg shadow-blue-500/20">
              {insight.source}
            </span>
            <div className="flex items-center text-slate-400 text-xs font-bold uppercase tracking-widest">
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              {insight.date}
            </div>
            <div className="flex items-center text-slate-400 text-xs font-bold uppercase tracking-widest">
              <Clock className="w-3.5 h-3.5 mr-1.5" />
              5 MIN READ
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-8">
            {insight.title}
          </h1>

          <div className="flex items-center justify-between py-6 border-y border-slate-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full overflow-hidden border-2 border-white shadow-sm">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" alt="Author" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-sm font-black text-slate-900">AeroVista Editorial</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Market Analyst</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="prose prose-lg prose-slate max-w-none">
          <p className="text-xl text-slate-600 font-medium leading-relaxed mb-10 italic border-l-4 border-blue-500 pl-6">
            {insight.summary}
          </p>
          
          <div className="space-y-6 text-slate-700 leading-relaxed">
            <p>
              The low-altitude economy represents the next frontier in urban infrastructure and logistics. As cities become increasingly congested on the ground, the transition to the sky offers unprecedented opportunities for speed, efficiency, and sustainability. Recent data suggests that the integration of eVTOL (electric Vertical Takeoff and Landing) vehicles and advanced drone delivery networks could contribute billions to global GDP by the end of the decade.
            </p>
            
            <div className="my-12 rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
              <img 
                src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=1200" 
                alt="Feature" 
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
              <div className="absolute bottom-6 left-8 text-white">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Insight Visualization</span>
              </div>
            </div>

            <h3 className="text-2xl font-black text-slate-900 mt-12 mb-6">Technological Milestones</h3>
            <p>
              Industry leaders are currently focused on three core pillars: battery density, noise reduction, and autonomous traffic management. Achieving commercial viability requires a seamless blend of aerospace engineering and silicon valley-style software agility. In this issue, we examine how regulatory bodies are responding to these rapid advancements.
            </p>

            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 my-12">
              <div className="flex items-center space-x-2 text-blue-600 font-black text-xs uppercase tracking-widest mb-4">
                <Sparkles className="w-4 h-4" />
                <span>AI Perspective</span>
              </div>
              <p className="text-sm text-slate-500 font-medium italic">
                "According to our latest predictive models, the period between 2025 and 2027 will be the critical window for infrastructure rollout. Cities that prioritize vertiport placement now will likely see a 3x increase in aerial logistics efficiency within the first two years of operation."
              </p>
            </div>

            <p>
              As we look forward, the challenge remains one of public perception and safety. Ensuring that the sky remains safe for all users while delivering on the promise of 15-minute urban transit is the primary goal of the current ecosystem.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <footer className="mt-20 pt-10 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-6 text-slate-400">
            <button className="flex items-center space-x-2 text-sm font-bold hover:text-blue-600 transition-colors">
              <MessageSquare className="w-5 h-5" />
              <span>12 评论</span>
            </button>
          </div>
          <button 
            onClick={onBack}
            className="px-8 py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all shadow-xl"
          >
            返回列表
          </button>
        </footer>
      </div>
    </div>
  );
};

export default InsightDetailPage;