
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Disc, MapPin, Globe, Radio, Heart, ShoppingBag, MessageCircle, ChevronLeft, ChevronRight, MousePointer2, History } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { dataService } from '../services/dataService';
import { Event, Post, VinylRecord } from '../types';
import { CachedImage } from '../components/CachedImage';

// HERO_IMAGES: Chica (Lounge) + Las 4 enviadas por el usuario
const HERO_IMAGES = [
  "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/7701241e-71ee-4929-18c0-d1d0d9576e00/public", // Chica / Lounge
  "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/38cbbb12-3f05-47c5-697b-f932d8f99700/public", // Nueva 1
  "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/8835f005-f545-4434-c67a-b2154de2da00/public", // Nueva 2
  "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/de211934-62c1-4fb5-6c4a-35cd8a0d9700/public", // Nueva 3
  "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/5dea483e-141a-4665-8085-5c163d8eda00/public"  // Nueva 4
];

export const Home: React.FC = () => {
  const { t } = useLanguage();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [recentRecords, setRecentRecords] = useState<VinylRecord[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  
  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const [allEvents, allRecords, posts] = await Promise.all([
        dataService.getEvents(),
        dataService.getRecords(),
        dataService.getCommunityPosts()
      ]);
      
      const now = new Date();
      now.setHours(0,0,0,0);

      const upcoming = allEvents.filter(e => new Date(e.date) >= now).slice(0, 3);
      const past = allEvents.filter(e => new Date(e.date) < now).slice(0, 3);

      setUpcomingEvents(upcoming);
      setPastEvents(past);
      setRecentRecords(allRecords.slice(0, 4));
      setRecentPosts(posts.slice(0, 2));
    };
    loadData();
    window.addEventListener('mat32_data_changed', loadData);
    return () => window.removeEventListener('mat32_data_changed', loadData);
  }, []);

  // AUTO-CHANGE HERO EVERY 5 SECONDS
  useEffect(() => {
    if (isRevealed) return; 
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isRevealed, currentSlide]);

  const handleHeroInteraction = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) return;

    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      document.getElementById('agenda-section')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      clickTimer.current = setTimeout(() => {
        setIsRevealed(!isRevealed);
        clickTimer.current = null;
      }, 250);
    }
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    setIsRevealed(false);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
    setIsRevealed(false);
  };

  return (
    <div className="bg-mat-900 min-h-screen overflow-x-hidden">
      <SEO titleKey="nav.home" descriptionKey="seo.home.description" />

      {/* 1. HERO INTERACTIVO CON VISIBILIDAD MEJORADA */}
      <section 
        className="relative h-[100vh] flex items-center justify-center overflow-hidden cursor-crosshair group select-none"
        onClick={handleHeroInteraction}
      >
        <div className="absolute inset-0 z-0 bg-black">
          {HERO_IMAGES.map((img, idx) => (
            <div 
              key={idx}
              className={`absolute inset-0 transition-all duration-[1200ms] ease-in-out transform ${
                idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
              }`}
            >
              <CachedImage 
                src={img} 
                className={`w-full h-full transition-all duration-[1500ms] ${
                  isRevealed 
                    ? 'grayscale-0 opacity-100 brightness-110 blur-0 scale-110' 
                    : 'grayscale opacity-70 brightness-75 blur-[1px]'
                }`}
                alt={`Mat32 Moment ${idx}`}
                priority={idx === currentSlide}
              />
            </div>
          ))}
          <div className={`absolute inset-0 bg-gradient-to-b from-mat-950/40 via-transparent to-mat-950 transition-opacity duration-1000 ${isRevealed ? 'opacity-20' : 'opacity-80'}`}></div>
        </div>

        <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <button onClick={prevSlide} className="p-5 bg-mat-900/40 backdrop-blur-xl border border-white/10 rounded-full text-white/50 hover:text-mat-500 hover:border-mat-500 transition-all pointer-events-auto">
            <ChevronLeft size={32} />
          </button>
          <button onClick={nextSlide} className="p-5 bg-mat-900/40 backdrop-blur-xl border border-white/10 rounded-full text-white/50 hover:text-mat-500 hover:border-mat-500 transition-all pointer-events-auto">
            <ChevronRight size={32} />
          </button>
        </div>

        <div className={`absolute top-32 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 transition-all duration-700 ${isRevealed ? 'opacity-0 -translate-y-10' : 'opacity-100 translate-y-0'}`}>
          <div className="flex items-center gap-6">
             <div className="flex flex-col items-center gap-2">
                <MousePointer2 size={16} className="text-mat-500 animate-pulse" />
                <span className="text-[8px] font-black text-mat-500 uppercase tracking-[0.4em] bg-mat-950/80 px-4 py-1.5 rounded-full border border-mat-800">REVELAR_CLIC</span>
             </div>
             <div className="h-px w-8 bg-mat-800"></div>
             <div className="flex flex-col items-center gap-2">
                <History size={16} className="text-gray-500" />
                <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.4em] bg-mat-950/80 px-4 py-1.5 rounded-full border border-mat-800">AGENDA_DBL_CLIC</span>
             </div>
          </div>
        </div>

        <div className={`container mx-auto px-6 relative z-10 text-center transition-all duration-1000 transform ${isRevealed ? 'scale-90 opacity-20 blur-md pointer-events-none' : 'scale-100 opacity-100 blur-0'}`}>
            <h1 className="text-[18vw] md:text-[12rem] font-black uppercase tracking-tighter text-white leading-[0.8] font-exo drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] mb-8">
              MAT<span className="text-mat-500">32</span>
            </h1>
            <div className="flex items-center justify-center gap-6 text-mat-500 font-black uppercase tracking-[0.6em] text-xs md:text-base mb-12">
               <MapPin size={18} className="text-white" /> VALENCIA <span className="text-gray-800">|</span> RUZAFA
            </div>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg md:text-2xl font-light italic mb-16 opacity-90 drop-shadow-lg leading-relaxed px-4">"Donde el tiempo se mide en revoluciones por minuto y el sonido tiene alma analógica."</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center px-4">
               <Link to="/contact" className="w-full sm:w-auto px-14 py-6 bg-mat-500 text-white font-black uppercase text-[11px] tracking-widest clip-path-slant shadow-2xl hover:bg-mat-400 transition-all active:scale-95">RESERVAR MESA</Link>
               <Link to="/community" className="w-full sm:w-auto px-14 py-6 bg-mat-900/80 border-2 border-mat-700 text-white font-black uppercase text-[11px] tracking-widest clip-path-slant hover:border-mat-500 backdrop-blur-md transition-all active:scale-95">HUB COMUNIDAD</Link>
            </div>
        </div>

        {/* Indicadores */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 z-40">
           {HERO_IMAGES.map((_, idx) => (
             <button 
               key={idx} 
               onClick={(e) => { e.stopPropagation(); setCurrentSlide(idx); setIsRevealed(false); }} 
               className={`h-1 transition-all duration-500 rounded-full ${idx === currentSlide ? 'w-12 bg-mat-500' : 'w-4 bg-white/20 hover:bg-white/50'}`}
             />
           ))}
        </div>
      </section>

      {/* 2. LA AGENDA */}
      <section id="agenda-section" className="py-32 bg-mat-900">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div>
              <div className="flex items-center gap-3 text-mat-500 font-black uppercase tracking-[0.5em] text-[10px] mb-6">
                <Disc size={20} className="animate-spin-slow" /> SESIONES_PROGRAMADAS
              </div>
              <h2 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter font-exo leading-none">LA <span className="text-mat-500">AGENDA.</span></h2>
            </div>
            <Link to="/events" className="text-[11px] font-black text-gray-500 hover:text-white uppercase tracking-widest flex items-center gap-4 transition-colors pb-3 border-b-2 border-mat-800 hover:border-mat-500">
              EXPLORAR PROGRAMACIÓN COMPLETA <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {upcomingEvents.map((event) => (
              <Link key={event.id} to={`/events/${event.id}`} className="group bg-mat-800 border border-mat-700 rounded-[3rem] overflow-hidden hover:border-mat-500 transition-all duration-500 flex flex-col shadow-2xl">
                <div className="aspect-[4/3] relative overflow-hidden bg-black">
                   <CachedImage src={event.imageUrl} alt={event.title} className="w-full h-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
                   <div className="absolute top-8 right-8 bg-mat-500 text-white text-[10px] font-black uppercase px-5 py-2.5 rounded-2xl shadow-xl">€{event.price}</div>
                </div>
                <div className="p-10 flex flex-col flex-1">
                  <span className="text-mat-500 text-[11px] font-black uppercase tracking-[0.2em] mb-4">{event.date} @ {event.time}</span>
                  <h3 className="text-3xl font-black text-white uppercase font-exo leading-tight mb-6 group-hover:text-mat-500 transition-colors">{event.title}</h3>
                  <div className="mt-auto pt-8 border-t border-mat-700/50 flex justify-between items-center text-[10px] font-black text-gray-500 uppercase tracking-widest">
                     <span>{event.category}</span>
                     <ArrowRight size={16} className="group-hover:translate-x-3 transition-transform text-mat-500" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ARCHIVO */}
      <section className="py-32 bg-mat-950/50 border-y border-mat-800/30">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-6 mb-20">
            <History size={32} className="text-mat-500" />
            <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter font-exo leading-none">EL <span className="text-mat-500">ARCHIVO.</span></h2>
            <div className="flex-1 border-b-2 border-mat-800 opacity-20"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {pastEvents.map(event => (
              <Link key={event.id} to={`/events/${event.id}`} className="bg-mat-900/50 border border-mat-800 p-8 rounded-[2.5rem] opacity-60 hover:opacity-100 hover:border-mat-500 transition-all grayscale hover:grayscale-0 group">
                 <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{event.date}</span>
                    <span className="text-[9px] bg-mat-800 px-3 py-1 rounded text-gray-500 font-black uppercase tracking-widest">SIGNAL_PAST</span>
                 </div>
                 <h4 className="text-2xl font-black text-white uppercase font-exo mb-4 group-hover:text-mat-500 transition-colors">{event.title}</h4>
                 <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-mat-800 flex items-center justify-center text-mat-500 font-black text-[10px] border border-mat-700">
                       {event.lineup?.[0]?.name[0] || 'M'}
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{event.lineup?.[0]?.name}</span>
                 </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
