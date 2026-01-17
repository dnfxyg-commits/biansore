
import React, { useEffect, useState } from 'react';
import { RefreshCw, Newspaper, ArrowUpRight } from 'lucide-react';
import { fetchLatestInsights } from '../services/geminiService';
import { NewsItem } from '../types';

const NewsSection: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadNews = async () => {
    setIsLoading(true);
    const data = await fetchLatestInsights();
    if (data && data.length > 0) {
      setNews(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadNews();
  }, []);

  return (
    <section id="news" className="py-20 bg-slate-900 text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 text-blue-400 font-bold tracking-widest text-xs uppercase mb-4">
              <Newspaper className="w-4 h-4" />
              <span>Industry Insights</span>
            </div>
            <h2 className="text-4xl font-bold">行业实时资讯</h2>
          </div>
          <button 
            onClick={loadNews}
            disabled={isLoading}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 transition-all flex items-center space-x-2 text-sm font-semibold disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>刷新资讯</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="p-8 rounded-3xl border border-white/5 bg-white/5 animate-pulse">
                <div className="h-4 bg-white/10 rounded w-1/3 mb-6"></div>
                <div className="h-8 bg-white/10 rounded w-full mb-4"></div>
                <div className="h-20 bg-white/10 rounded w-full mb-6"></div>
                <div className="h-4 bg-white/10 rounded w-1/4"></div>
              </div>
            ))
          ) : (
            news.map((item) => (
              <div key={item.id} className="group p-8 rounded-3xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-blue-500/30 transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-xs text-blue-400 font-mono">{item.date}</span>
                  <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-blue-400 transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-4 leading-tight group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                  {item.summary}
                </p>
                <div className="text-xs text-white/40 font-medium">
                  来源: {item.source}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
