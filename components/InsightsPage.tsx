
import React from 'react';
import { Calendar, User, Clock } from 'lucide-react';
import { NewsItem } from '../types';

interface Props {
  posts: NewsItem[];
  onViewInsight: (insight: NewsItem) => void;
}

const InsightsPage: React.FC<Props> = ({ posts, onViewInsight }) => {
  const featuredPost = posts[0];
  const gridPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title Section */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">低空播客</h1>
          <div className="w-full h-[1px] bg-slate-100"></div>
        </div>

        {/* Optimized Featured Post Layout */}
        <div className="mb-16 border border-slate-100 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-500 bg-white">
          {/* Category Bar */}
          <div className="bg-[#f59e0b] px-6 py-2">
            <span className="text-white font-bold text-sm tracking-widest">播客</span>
          </div>
          
          {/* Main Content Area */}
          <div className="p-1">
            {/* Large Featured Image - Updated to match the drone image in the screenshot */}
            <div className="aspect-[21/9] w-full overflow-hidden mb-8">
              <img 
                src="https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&q=80&w=1600" 
                alt="Expert Drone Podcast" 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="px-10 pb-12">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {featuredPost.tags?.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-[#fbbf24] text-white text-[10px] font-bold rounded">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Meta Info */}
              <div className="flex items-center space-x-6 text-slate-400 text-xs mb-6">
                <div className="flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-2" />
                  {featuredPost.date}
                </div>
                <div className="flex items-center">
                  <User className="w-3.5 h-3.5 mr-2" />
                  {featuredPost.author}
                </div>
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-slate-900 mb-8 leading-tight">
                {featuredPost.title}
              </h2>

              {/* Action Button */}
              <button 
                onClick={() => onViewInsight(featuredPost)}
                className="px-8 py-3 bg-[#2563eb] text-white text-sm font-bold rounded hover:bg-blue-700 transition-all shadow-md"
              >
                阅读更多
              </button>
            </div>
          </div>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gridPosts.map((post) => (
            <div key={post.id} className="group border border-slate-100 rounded-lg overflow-hidden hover:shadow-xl transition-all flex flex-col h-full bg-white">
              {/* Card Image */}
              <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Card Content */}
              <div className="p-8 flex flex-col flex-1">
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags?.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-[#fbbf24] text-white text-[10px] font-bold rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center space-x-4 text-slate-400 text-xs mb-6">
                  <div className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-2" />
                    {post.date}
                  </div>
                  <div className="flex items-center">
                    <User className="w-3.5 h-3.5 mr-2" />
                    {post.author}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-8 leading-snug flex-1">
                  {post.title}
                </h3>

                <button 
                  onClick={() => onViewInsight(post)}
                  className="w-fit px-6 py-2.5 bg-[#2563eb] text-white text-sm font-bold rounded hover:bg-blue-700 transition-colors"
                >
                  阅读更多
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;
