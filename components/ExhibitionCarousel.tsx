import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Sparkles, Ticket } from 'lucide-react';
import type { Exhibition } from '../types';

interface Props {
  exhibitions: Exhibition[];
  onViewDetails: (id: string) => void;
}

const ExhibitionCarousel: React.FC<Props> = ({ exhibitions, onViewDetails }) => {
  const [startIndex, setStartIndex] = useState(0);
  const featuredExhibitions = exhibitions.filter(ex => ex.featured || ex.region === 'China');
  const visibleCount = 3;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cardThemes = [
    { bg: 'bg-[#e0f7f9]', inner: 'shadow-[inset_0_0_40px_rgba(100,160,180,0.1)]', border: 'border-[#cce8ea]' },
    { bg: 'bg-[#fdf3da]', inner: 'shadow-[inset_0_0_40px_rgba(180,160,100,0.1)]', border: 'border-[#e8dcc0]' },
    { bg: 'bg-[#e3ecf8]', inner: 'shadow-[inset_0_0_40px_rgba(100,120,180,0.1)]', border: 'border-[#ced9e9]' },
    { bg: 'bg-[#fbe8f2]', inner: 'shadow-[inset_0_0_40px_rgba(180,100,140,0.1)]', border: 'border-[#ecd5e1]' },
  ];

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const nextSlide = () => {
    if (!featuredExhibitions.length) return;
    setStartIndex(prev => (prev + 1) % featuredExhibitions.length);
  };

  const prevSlide = () => {
    if (!featuredExhibitions.length) return;
    setStartIndex(prev => (prev - 1 + featuredExhibitions.length) % featuredExhibitions.length);
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => nextSlide(), 8000);
    return () => resetTimeout();
  }, [startIndex, featuredExhibitions.length]);

  const getVisibleItems = () => {
    if (!featuredExhibitions.length) return [];
    const items = [];
    for (let i = 0; i < visibleCount; i++) {
      items.push(featuredExhibitions[(startIndex + i) % featuredExhibitions.length]);
    }
    return items;
  };

  return (
    <section className="py-16 bg-[#fcfdfe] overflow-hidden relative">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center space-x-2 text-blue-600 font-black tracking-[0.2em] text-xs uppercase">
            <Sparkles className="w-4 h-4" />
            <span>UPCOMING HIGHLIGHTS</span>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={prevSlide}
              className="p-2 rounded-full border border-slate-200 hover:bg-white hover:shadow-md transition-all text-slate-400 hover:text-blue-600"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={nextSlide}
              className="p-2 rounded-full border border-slate-200 hover:bg-white hover:shadow-md transition-all text-slate-400 hover:text-blue-600"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Container with Fly-in Animation */}
        <div className="relative overflow-visible">
          <div className="flex gap-8 transition-all duration-700 ease-in-out">
            {getVisibleItems().map((ex, idx) => {
              const theme = cardThemes[(startIndex + idx) % cardThemes.length];
              return (
                <div
                  key={`${ex.id}-${startIndex}-${idx}`}
                  onClick={() => onViewDetails(ex.id)}
                  className={`flex-1 min-w-[300px] h-[400px] rounded-[2.5rem] p-4 cursor-pointer transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden animate-in slide-in-from-right-full fade-in duration-1000 ${theme.bg}`}
                >
                  <div className={`absolute inset-5 rounded-[2rem] border-4 border-white/50 ${theme.inner} ${theme.border} pointer-events-none`}></div>

                  <div className="relative z-10 space-y-8 px-8">
                    <h3 className="text-3xl font-black text-slate-900 leading-[1.2] tracking-tight">
                      {ex.title}
                    </h3>
                    
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-slate-600">
                        {ex.date}
                      </div>
                      <div className="text-sm font-bold text-slate-400 flex items-center justify-center uppercase tracking-widest">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                        {ex.location}
                      </div>
                    </div>

                    <div className="pt-4">
                      <button 
                        className="px-8 py-3.5 border-2 border-slate-900 text-slate-900 font-black rounded-full hover:bg-slate-900 hover:text-white transition-all text-[11px] uppercase tracking-[0.15em] flex items-center space-x-3 mx-auto shadow-sm bg-white/20"
                      >
                        <Ticket className="w-5 h-5" />
                        <span>预先登记 获取门票</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExhibitionCarousel;
