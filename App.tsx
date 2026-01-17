import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AIConsultant from './components/AIConsultant';
import Footer from './components/Footer';
import CalendarPage from './components/CalendarPage';
import InsightsPage from './components/InsightsPage';
import InsightDetailPage from './components/InsightDetailPage';
import AboutPage from './components/AboutPage';
import ExhibitionDetailPage from './components/ExhibitionDetailPage';
import BoothApplicationPage from './components/BoothApplicationPage';
import TicketBookingPage from './components/TicketBookingPage';
import ExhibitionCenterSection from './components/ExhibitionCenterSection';
import VenueDetailPage from './components/VenueDetailPage';
import ProductShowcasePage from './components/ProductShowcasePage';
import ProductDetailPage from './components/ProductDetailPage';
import PartnershipPage from './components/PartnershipPage';
import ExhibitionCarousel from './components/ExhibitionCarousel';
import { EXHIBITIONS as MOCK_EXHIBITIONS, EXHIBITION_CENTERS as MOCK_EXHIBITION_CENTERS, PRODUCTS as MOCK_PRODUCTS, BLOG_POSTS as MOCK_BLOG_POSTS } from './data/mockData';
import type { ExhibitionCenter, Product } from './data/mockData';
import type { Exhibition, NewsItem } from './types';
import { ChevronRight, Package, Zap, ArrowUpRight } from 'lucide-react';
import { fetchBlogPosts, fetchExhibitionCenters, fetchExhibitions, fetchProducts } from './services/api';

type View = 'landing' | 'calendar' | 'insights' | 'insight_detail' | 'about' | 'exhibition_detail' | 'booth_application' | 'ticket_booking' | 'domestic' | 'international' | 'center' | 'venue_detail' | 'products' | 'product_detail' | 'partnership';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [selectedExId, setSelectedExId] = useState<string | null>(null);
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<NewsItem | null>(null);
  const [isAIConsultantOpen, setIsAIConsultantOpen] = useState(false);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>(MOCK_EXHIBITIONS);
  const [exhibitionCenters, setExhibitionCenters] = useState<ExhibitionCenter[]>(MOCK_EXHIBITION_CENTERS);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [blogPosts, setBlogPosts] = useState<NewsItem[]>(MOCK_BLOG_POSTS);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedExId, selectedVenueId, selectedProductId]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [remoteExhibitions, remoteCenters, remoteProducts, remoteBlogPosts] =
          await Promise.all([
            fetchExhibitions(),
            fetchExhibitionCenters(),
            fetchProducts(),
            fetchBlogPosts()
          ]);

        if (remoteExhibitions && remoteExhibitions.length > 0) {
          setExhibitions(remoteExhibitions);
        }
        if (remoteCenters && remoteCenters.length > 0) {
          setExhibitionCenters(remoteCenters);
        }
        if (remoteProducts && remoteProducts.length > 0) {
          setProducts(remoteProducts);
        }
        if (remoteBlogPosts && remoteBlogPosts.length > 0) {
          setBlogPosts(remoteBlogPosts);
        }
      } catch (error) {
        console.error('Failed to load initial data', error);
      }
    };

    loadData();
  }, []);

  const handleViewExDetails = (id: string) => {
    setSelectedExId(id);
    setCurrentView('exhibition_detail');
  };

  const handleViewVenueDetails = (id: string) => {
    setSelectedVenueId(id);
    setCurrentView('venue_detail');
  };

  const handleViewProductDetails = (id: string) => {
    setSelectedProductId(id);
    setCurrentView('product_detail');
  };

  const handleViewInsightDetails = (insight: NewsItem) => {
    setSelectedInsight(insight);
    setCurrentView('insight_detail');
  };

  const handleNavigate = (view: View) => {
    if (view === 'landing') {
      if (currentView === 'landing') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setCurrentView('landing');
      }
      return;
    }
    setCurrentView(view);
  };

  const selectedExhibition = useMemo(() => {
    return exhibitions.find(ex => ex.id === selectedExId);
  }, [selectedExId, exhibitions]);

  const selectedVenue = useMemo(() => {
    return exhibitionCenters.find(v => v.id === selectedVenueId);
  }, [selectedVenueId, exhibitionCenters]);

  const selectedProduct = useMemo(() => {
    return products.find(p => p.id === selectedProductId);
  }, [selectedProductId, products]);

  const renderContent = () => {
    switch (currentView) {
      case 'exhibition_detail':
        return selectedExhibition ? (
          <ExhibitionDetailPage 
            exhibition={selectedExhibition} 
            onBack={() => setCurrentView('landing')} 
            onApplyBooth={() => setCurrentView('booth_application')}
            onBookTickets={() => setCurrentView('ticket_booking')}
          />
        ) : null;
      case 'venue_detail':
        return selectedVenue ? (
          <VenueDetailPage 
            venue={selectedVenue}
            onBack={() => setCurrentView('center')}
          />
        ) : null;
      case 'product_detail':
        return selectedProduct ? (
          <ProductDetailPage 
            product={selectedProduct}
            onBack={() => setCurrentView('products')}
          />
        ) : null;
      case 'insight_detail':
        return selectedInsight ? (
          <InsightDetailPage 
            insight={selectedInsight}
            onBack={() => setCurrentView('insights')}
          />
        ) : null;
      case 'booth_application':
        return selectedExhibition ? (
          <BoothApplicationPage 
            exhibition={selectedExhibition} 
            onBack={() => setCurrentView('exhibition_detail')} 
          />
        ) : null;
      case 'ticket_booking':
        return selectedExhibition ? (
          <TicketBookingPage 
            exhibition={selectedExhibition} 
            onBack={() => setCurrentView('exhibition_detail')} 
          />
        ) : null;
      case 'domestic':
        return (
          <CalendarPage
            exhibitions={exhibitions}
            onViewDetails={handleViewExDetails}
            initialRegion="China"
            title="国内展会"
          />
        );
      case 'international':
        return (
          <CalendarPage
            exhibitions={exhibitions}
            onViewDetails={handleViewExDetails}
            initialRegion="Overseas"
            title="国际展会"
          />
        );
      case 'center':
        return (
          <ExhibitionCenterSection
            centers={exhibitionCenters}
            onViewVenue={handleViewVenueDetails}
          />
        );
      case 'calendar':
        return (
          <CalendarPage
            exhibitions={exhibitions}
            onViewDetails={handleViewExDetails}
          />
        );
      case 'insights':
        return (
          <InsightsPage
            posts={blogPosts}
            onViewInsight={handleViewInsightDetails}
          />
        );
      case 'products':
        return (
          <ProductShowcasePage
            products={products}
            onViewProduct={handleViewProductDetails}
          />
        );
      case 'partnership':
        return <PartnershipPage onBack={() => setCurrentView('landing')} />;
      case 'about':
        return <AboutPage />;
      case 'landing':
      default:
        return (
          <main>
            <Hero onNavigate={handleNavigate} onOpenAI={() => setIsAIConsultantOpen(true)} />

            <ExhibitionCarousel
              exhibitions={exhibitions}
              onViewDetails={handleViewExDetails}
            />

            {/* Product Showcase Section */}
            <section id="products-showcase" className="py-24 bg-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/50 blur-[120px] rounded-full pointer-events-none -z-10"></div>
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                  <div className="max-w-2xl">
                    <div className="flex items-center space-x-2 text-blue-600 font-black tracking-[0.2em] text-xs uppercase mb-4">
                      <Package className="w-4 h-4" />
                      <span>Advanced Hardware</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">顶级低空产品展示</h2>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed">
                      汇聚全球顶尖低空装备，从先进的 eVTOL 到智慧货运无人机，定义未来空域价值。
                    </p>
                  </div>
                  <button 
                    onClick={() => handleNavigate('products')}
                    className="group px-8 py-4 bg-blue-600 text-white font-black rounded-2xl flex items-center space-x-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95 whitespace-nowrap"
                  >
                    <span>查看全部产品</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {products.slice(0, 3).map(product => (
                    <div 
                      key={product.id}
                      onClick={() => handleViewProductDetails(product.id)}
                      className="bg-white rounded-[3rem] overflow-hidden border border-slate-100 hover:shadow-2xl hover:border-blue-100 transition-all duration-500 flex flex-col group cursor-pointer"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                        <div className="absolute top-6 left-6">
                          <span className="px-4 py-1.5 bg-white/95 backdrop-blur text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm">
                            {product.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-10 flex flex-col flex-1">
                        <div className="mb-6">
                          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2 block">{product.brand}</span>
                          <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                            {product.name}
                          </h3>
                        </div>
                        <div className="flex gap-4 mt-auto">
                          <div className="flex-1 py-3 bg-slate-50 text-slate-900 font-bold rounded-xl flex items-center justify-center space-x-2 text-sm border border-slate-100">
                            <Zap className="w-4 h-4 text-blue-600" />
                            <span>查看参数</span>
                          </div>
                          <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center group-hover:bg-blue-700 transition-all">
                            <ArrowUpRight className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Optimized CTA Section with Snowy Background */}
            <section className="py-24 bg-slate-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-slate-900 rounded-[3.5rem] overflow-hidden relative group shadow-[0_50px_100px_-20px_rgba(15,23,42,0.3)]">
                  <img 
                    src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=2000" 
                    className="w-full h-[650px] object-cover opacity-60 transition-transform duration-1000 group-hover:scale-110"
                    alt="Low Altitude Future"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-12 md:p-24">
                    <div className="bg-blue-600 w-16 h-1 mb-10"></div>
                    <h2 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter max-w-4xl leading-[0.9]">
                      天空无界，<br />连接可能
                    </h2>
                    <p className="text-slate-300 text-xl max-w-2xl mb-14 leading-relaxed font-medium">
                      加入 BIANSoar 赋佐 全球节点，成为低空经济生态圈的关键一环，与万亿级产业共同腾飞。
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6">
                      <button 
                        onClick={() => handleNavigate('partnership')}
                        className="w-fit px-14 py-6 bg-blue-600 text-white font-black text-xl rounded-[2.5rem] hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-blue-500/20"
                      >
                        战略合作
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen selection:bg-blue-100 selection:text-blue-900">
      <Navbar onNavigate={handleNavigate} currentView={currentView} />
      {renderContent()}
      <AIConsultant isOpenExternal={isAIConsultantOpen} onCloseExternal={() => setIsAIConsultantOpen(false)} />
      <Footer />
    </div>
  );
};

export default App;
