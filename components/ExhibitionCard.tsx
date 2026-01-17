
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Globe, Link as LinkIcon, ExternalLink, Sparkles, Loader2, Share2, Check } from 'lucide-react';
import { Exhibition } from '../types';
import { GoogleGenAI } from "@google/genai";

interface Props {
  exhibition: Exhibition;
  onViewDetails?: (id: string) => void;
}

const ExhibitionCard: React.FC<Props> = ({ exhibition, onViewDetails }) => {
  const [imgUrl, setImgUrl] = useState(exhibition.imageUrl);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [error, setError] = useState(false);

  const generateAIImage = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    setError(false);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `A professional, high-quality photograph or digital render of an exhibition booth or futuristic scene for a "${exhibition.category}" event titled "${exhibition.title}". The scene should look like a global low-altitude economy trade show with drones, eVTOLs, or high-tech infrastructure. Cinematic lighting, professional architectural photography style.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9"
          }
        }
      });

      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          setImgUrl(`data:image/png;base64,${base64Data}`);
          setIsGenerating(false);
          return;
        }
      }
      throw new Error("No image data found in response");
    } catch (err) {
      console.error("AI Image Generation Error:", err);
      setError(true);
      setIsGenerating(false);
      setImgUrl(`https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800`);
    }
  };

  useEffect(() => {
    if (!exhibition.imageUrl) {
      generateAIImage();
    }
  }, []);

  const handleImageError = () => {
    if (!isGenerating && !imgUrl.startsWith('data:')) {
      generateAIImage();
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: exhibition.title,
      text: `Check out ${exhibition.title} in ${exhibition.location} on AeroVista!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share canceled or failed', err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  return (
    <div 
      onClick={() => onViewDetails?.(exhibition.id)}
      className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full cursor-pointer"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        {isGenerating ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/10 backdrop-blur-sm z-10">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center">
              <Sparkles className="w-3 h-3 mr-1" /> AI Generating...
            </span>
          </div>
        ) : null}

        <img 
          src={imgUrl} 
          alt={exhibition.title}
          onError={handleImageError}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out ${isGenerating ? 'opacity-30' : 'opacity-100'}`}
        />
        
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-blue-500/90 backdrop-blur text-white text-[10px] font-black rounded uppercase tracking-widest shadow-lg">
            {exhibition.category}
          </span>
        </div>
        
        {exhibition.featured && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-[#fbbf24] text-[#78350f] text-[10px] font-black rounded uppercase tracking-widest shadow-lg">
              FEATURED
            </span>
          </div>
        )}
      </div>
      
      <div className="p-8 flex flex-col flex-1">
        <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight tracking-tight">
          {exhibition.title}
        </h3>
        <p className="text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed font-medium">
          {exhibition.description}
        </p>
        
        <div className="space-y-3 mb-8 flex-1">
          <div className="flex items-center text-sm text-slate-500 font-semibold">
            <Calendar className="w-4 h-4 mr-3 text-blue-400 flex-shrink-0" />
            <span>{exhibition.date}</span>
          </div>
          <div className="flex items-center text-sm text-slate-500 font-semibold">
            <MapPin className="w-4 h-4 mr-3 text-blue-400 flex-shrink-0" />
            <span>{exhibition.location}</span>
          </div>
          <div className="flex items-center text-sm text-slate-500 font-semibold">
            <Globe className="w-4 h-4 mr-3 text-blue-400 flex-shrink-0" />
            <span>{exhibition.region}</span>
          </div>
          <div className="flex items-center text-sm">
            <LinkIcon className="w-4 h-4 mr-3 text-blue-400 flex-shrink-0" />
            <span className="text-blue-600 font-bold hover:underline">官方网站</span>
          </div>
        </div>
        
        <div className="pt-4 border-t border-slate-50 flex space-x-3">
          <button 
            className="flex-1 py-4 bg-[#f8fafc] text-slate-900 font-bold text-sm rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>查看详情</span>
            <ExternalLink className="w-4 h-4" />
          </button>
          <button 
            onClick={handleShare}
            className={`w-14 h-14 flex items-center justify-center rounded-2xl border transition-all duration-300 ${isShared ? 'bg-green-50 border-green-200 text-green-600' : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50'}`}
            title="分享展会"
          >
            {isShared ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExhibitionCard;
