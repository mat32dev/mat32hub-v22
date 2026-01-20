
import React, { useMemo, useState, useEffect } from 'react';
import { ArrowRight, Music2, Zap, TrendingUp, Headphones, Loader2, Star, Sparkles, History, Disc, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EventCard } from '../components/EventCard';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { useLanguage } from '../context/LanguageContext';
import { Event, VinylRecord } from '../types';
import { CachedImage } from '../components/CachedImage';

export const Home: React.FC = () => {
  const { t } = useLanguage();
  const [events, setEvents] = useState<Event[]>([]);
  const [records, setRecords] = useState<VinylRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAllData = async () => {
    try {
      const [evs, recs] = await Promise.all([
        dataService.getEvents(),
        dataService.getRecords()
      ]);
      setEvents(evs);
      setRecords(recs);
    } catch (err) {
      console.error("Home Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
    window.addEventListener('mat32_data_changed', loadAllData);
    return () => window.removeEventListener('mat32_data_changed', loadAllData);
  }, []);
  
  const todayStr = new Date().toISOString().split('T')[0];
  const featuredEvents = useMemo(() => 
    events
      .filter(e => e.date >= todayStr)
      .slice(0, 3), 
  [events, todayStr]);

  const currentTrack = records[0]; 

  const isVenueOpen = useMemo(() => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    if (hour >= 0 && hour < 2) return day === 5 || day === 6 || day === 0;
    if (hour >= 18) return day >= 4 && day <= 6;
    return false;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-mat-900 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-mat-500 animate-spin mb-4" />
        <p className="text-mat-500 font-black uppercase text-[10px] tracking-widest">Sincronizando Sistema...</p>
      </div>
    );
  }

  return (
    <div className="bg-mat-900 overflow-x-hidden">
      <SEO titleKey="nav.home" descriptionKey="seo.home.description" />
      
      {/* Hero Section Master - USANDO FOTO REAL */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="hero-home.jpg" 
            className="w-full h-full object-cover opacity-60 grayscale-[20%]"
            alt="Interior del bar Mat32 Valencia"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?q=80&w=2000";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-mat-900/90 via-mat-900/40 to-mat-900"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="mb-12 animate-fade-in">
             <h1 className="text-[22vw] md:text-[20rem] font-black uppercase tracking-tighter text-white leading-none font-exo text-glow select-none">
              MAT<span className="text-mat-500">32</span>
             </h1>
             <div className="flex items-center justify-center gap-4 -mt-4 md:-mt-10">
                <div className="h-[2px] w-8 md:w-24 bg-mat-500"></div>
                <span className="text-[10px] md:text-2xl font-black uppercase tracking-[0.5em] text-gray-300">DISCOS BAR</span>
                <div className="h-[2px] w-8 md:w-24 bg-mat-500"></div>
             </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center mt-12 md:mt-20">
            <Link to="/events" className="w-full md:w-auto px-12 py-6 bg-mat-500 text-white font-black text-[11px] uppercase tracking-[0.3em] hover:bg-mat-400 transition-all clip-path-slant shadow-2xl flex items-center justify-center gap-3 group">
              {t('home.cta.agenda')} <Zap className="w-4 h-4" />
            </Link>
            <Link to="/community" className="w-full md:w-auto px-12 py-6 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-black text-[11px] uppercase tracking-[0.3em] hover:bg-white hover:text-mat-900 transition-all clip-path-slant flex items-center justify-center gap-3 group">
              {t('home.cta.community')} <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </Link>
            <Link to="/alquiler-local-eventos-valencia" className="w-full md:w-auto px-12 py-6 bg-mat-900 border border-mat-700 text-gray-400 font-black text-[11px] uppercase tracking-[0.3em] hover:text-white hover:border-mat-500 transition-all clip-path-slant flex items-center justify-center gap-3 group">
              {t('home.cta.private')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Status Bar */}
      <section className="bg-mat-900/80 backdrop-blur-md border-b border-mat-800 sticky top-20 z-30 shadow-2xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              {currentTrack ? (
                <>
                  <div className="relative flex-shrink-0 group">
                    <div className="w-14 h-14 md:w-20 md:h-20 relative z-10 shadow-2xl border border-mat-700 overflow-hidden rounded-lg bg-black">
                      <img src={currentTrack.coverUrl} alt={currentTrack.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="absolute top-1 -right-4 w-12 h-12 md:w-18 md:h-18 rounded-full bg-black animate-spin-slow border-2 border-mat-700 -z-0"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-mat-500 font-black uppercase tracking-[0.4em] mb-1 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-mat-500 rounded-full animate-pulse"></span> {t('home.now_spinning')}
                    </span>
                    <span className="text-white font-black uppercase text-sm md:text-xl tracking-wider font-exo">
                      {currentTrack.title}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col">
                    <span className="text-[9px] text-gray-600 font-black uppercase tracking-[0.4em] mb-1 flex items-center gap-2">OFF AIR</span>
                    <span className="text-gray-500 font-black uppercase text-sm tracking-wider font-exo italic">Sintonizando analógico...</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 px-6 py-2 bg-mat-800 border border-mat-700 rounded-full">
              <div className={`w-2.5 h-2.5 rounded-full ${isVenueOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-white">
                {isVenueOpen ? 'ABIERTO' : 'CERRADO (ANALOG LAB)'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* About Us / Heritage Section */}
      <section className="py-32 bg-mat-950 border-b border-mat-800 relative overflow-hidden">
        <div className="container mx-auto px-6">
           <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="relative order-2 lg:order-1">
                 <div className="aspect-[4/5] rounded-[3.5rem] overflow-hidden border-2 border-mat-800 shadow-2xl relative group">
                    <CachedImage 
                      src="about-heritage.jpg" 
                      alt="Bakalao Route Heritage Mat32 Valencia" 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-mat-900 via-transparent to-transparent opacity-60"></div>
                    <div className="absolute bottom-10 left-10 right-10 p-8 bg-mat-900/80 backdrop-blur-xl border border-mat-700 rounded-3xl">
                       <p className="text-mat-500 font-black text-[10px] uppercase tracking-[0.4em] mb-2">VALENCIA EST. 2024</p>
                       <p className="text-white font-light italic text-sm leading-relaxed">"Ubicado en un espacio donde se grabaron sonidos icónicos de la Ruta del Bakalao."</p>
                    </div>
                 </div>
                 {/* Floating Element */}
                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-mat-500 rounded-full flex items-center justify-center shadow-2xl animate-float hidden md:flex">
                    <div className="text-center">
                       <p className="text-white font-black text-[10px] uppercase tracking-widest">RARETRAXXX</p>
                       <p className="text-white font-black text-2xl font-exo">IDEALS</p>
                    </div>
                 </div>
              </div>

              <div className="space-y-10 order-1 lg:order-2">
                 <div className="inline-flex items-center gap-4 text-mat-500 font-black uppercase tracking-[0.5em] text-[10px]">
                    <History size={20} /> {t('about.title')}
                 </div>
                 <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter font-exo leading-none">
                    Russafa<br/><span className="text-mat-500 text-glow">Sound.</span>
                 </h2>
                 <p className="text-gray-400 text-xl md:text-2xl font-light italic leading-relaxed">
                    {t('about.subtitle')}
                 </p>
                 <div className="space-y-6 text-gray-500 font-light text-base md:text-lg leading-relaxed">
                    <p>{t('about.text1')}</p>
                    <p>{t('about.text2')}</p>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-8 pt-8">
                    <div className="flex items-center gap-4 group">
                       <div className="w-12 h-12 bg-mat-800 rounded-2xl flex items-center justify-center text-mat-500 border border-mat-700 group-hover:bg-mat-500 group-hover:text-white transition-all shadow-xl"><Disc size={20} /></div>
                       <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">RECORD SHOP &<br/>DJ HALL</span>
                    </div>
                    <div className="flex items-center gap-4 group">
                       <div className="w-12 h-12 bg-mat-800 rounded-2xl flex items-center justify-center text-mat-500 border border-mat-700 group-hover:bg-mat-500 group-hover:text-white transition-all shadow-xl"><Users size={20} /></div>
                       <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">LOCAL CULTURE &<br/>RARE DISCOVERY</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Agenda Preview */}
      <section className="py-32 bg-mat-900">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div>
              <div className="inline-flex items-center gap-2 text-mat-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">
                <Zap className="w-4 h-4" /> LIVE SESSIONS
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none font-exo">Próximos<br/>Ritmos.</h2>
            </div>
            <Link to="/events" className="group flex text-mat-500 hover:text-white items-center font-black uppercase tracking-[0.3em] text-[11px] transition-all border-b-2 border-mat-500 pb-2">
              VER AGENDA COMPLETA <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-3 transition-transform" />
            </Link>
          </div>
          <div className="grid gap-12">
            {featuredEvents.length > 0 ? (
              featuredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <div className="text-center py-24 border-4 border-dashed border-mat-800 rounded-[3rem]">
                 <Music2 className="w-16 h-16 text-mat-800 mx-auto mb-6 opacity-30" />
                 <p className="text-gray-600 font-black uppercase text-xs tracking-widest">No hay eventos programados esta semana</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
