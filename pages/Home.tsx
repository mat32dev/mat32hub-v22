
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Disc, MapPin, Globe, Radio, Heart, ShoppingBag, MessageCircle, ChevronLeft, ChevronRight, MousePointer2, History } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { dataService } from '../services/dataService';
import { Event, Post, VinylRecord } from '../types';
import { CachedImage } from '../components/CachedImage';

const HERO_IMAGES = [
  "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/190aead2-fc94-4fed-a7c2-bd341561ca00/public",
  "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/7701241e-71ee-4929-18c0-d1d0d9576e00/public"
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

  // Auto-advance carousel unless revealed
  useEffect(() => {
    if (isRevealed) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isRevealed]);

  // Interaction: 1 Click = Reveal, 2 Clicks = Jump to Agenda
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

      {/* 1. HERO "ANALOG PROTOCOL" */}
      <section 
        className="relative h-[100vh] flex items-center justify-center overflow-hidden cursor-crosshair group select-none"
        onClick={handleHeroInteraction}
      >
        <div className="absolute inset-0 z-0 bg-black">
          {HERO_IMAGES.map((img, idx) => (
            <div 
              key={idx}
              className={`absolute inset-0 transition-all duration-[1500ms] ease-in-out transform ${
                idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'
              }`}
            >
              <CachedImage 
                src={img} 
                className={`w-full h-full transition-all duration-[1200ms] ${
                  isRevealed 
                    ? 'grayscale-0 opacity-100 brightness-110 blur-0 scale-105' 
                    : 'grayscale opacity-40 brightness-50 blur-[2px]'
                }`}
                alt={`Mat32 Space ${idx}`}
                priority={idx === currentSlide}
              />
            </div>
          ))}
          <div className={`absolute inset-0 bg-gradient-to-b from-mat-950/60 via-transparent to-mat-950 transition-opacity duration-1000 ${isRevealed ? 'opacity-30' : 'opacity-100'}`}></div>
        </div>

        <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <button onClick={prevSlide} className="p-5 bg-mat-900/40 backdrop-blur-xl border border-white/10 rounded-full text-white/50 hover:text-mat-500 hover:border-mat-500 transition-all pointer-events-auto"><ChevronLeft size={32} /></button>
          <button onClick={nextSlide} className="p-5 bg-mat-900/40 backdrop-blur-xl border border-white/10 rounded-full text-white/50 hover:text-mat-500 hover:border-mat-500 transition-all pointer-events-auto"><ChevronRight size={32} /></button>
        </div>

        <div className={`absolute top-32 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 transition-all duration-700 ${isRevealed ? 'opacity-0 -translate-y-10' : 'opacity-100 translate-y-0'}`}>
          <div className="flex items-center gap-6">
             <div className="flex flex-col items-center gap-2">
                <MousePointer2 size={16} className="text-mat-500 animate-pulse" />
                <span className="text-[8px] font-black text-mat-500 uppercase tracking-[0.4em] bg-mat-950/80 px-4 py-1.5 rounded-full border border-mat-800">CLICK_REVEAL</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                <Disc size={16} className="text-gray-500 animate-spin-slow" />
                <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.4em] bg-mat-950/80 px-4 py-1.5 rounded-full border border-mat-800">DBL_CLICK_AGENDA</span>
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
            <p className="text-gray-300 max-w-2xl mx-auto text-lg md:text-2xl font-light italic mb-16 opacity-90">"Donde el sonido tiene alma analógica."</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
               <Link to="/contact" className="px-14 py-6 bg-mat-500 text-white font-black uppercase text-[11px] tracking-widest clip-path-slant shadow-2xl hover:bg-mat-400 transition-all">RESERVAR MESA</Link>
               <Link to="/community" className="px-14 py-6 bg-mat-800 border-2 border-mat-700 text-white font-black uppercase text-[11px] tracking-widest clip-path-slant hover:border-mat-500 transition-all">HUB COMUNIDAD</Link>
            </div>
        </div>
      </section>

      {/* 2. LA AGENDA (PROXIMAMENTE) */}
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
              EXPLORAR TODA LA PROGRAMACIÓN <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {upcomingEvents.map((event) => (
              <Link key={event.id} to={`/events/${event.id}`} className="group bg-mat-800 border border-mat-700 rounded-[3rem] overflow-hidden hover:border-mat-500 transition-all duration-500 flex flex-col shadow-2xl">
                <div className="aspect-[4/3] relative overflow-hidden bg-black">
                   <CachedImage src={event.imageUrl} alt={event.title} className="w-full h-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
                   <div className="absolute top-8 right-8 bg-mat-500 text-white text-[10px] font-black uppercase px-5 py-2.5 rounded-2xl">€{event.price}</div>
                </div>
                <div className="p-10 flex flex-col flex-1">
                  <span className="text-mat-500 text-[11px] font-black uppercase tracking-[0.2em] mb-4">{event.date} @ {event.time}</span>
                  <h3 className="text-3xl font-black text-white uppercase font-exo leading-tight mb-6 group-hover:text-mat-500 transition-colors">{event.title}</h3>
                  <div className="mt-auto pt-8 border-t border-mat-700/50 flex justify-between items-center text-[10px] font-black text-gray-500">
                     <span>{event.category}</span>
                     <ArrowRight size={16} className="group-hover:translate-x-3 transition-transform text-mat-500" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. EL ARCHIVO (EVENTOS PASADOS) */}
      <section className="py-32 bg-mat-950/50">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-16">
            <History size={24} className="text-mat-500" />
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter font-exo">ARCHIVO <span className="text-mat-500">SESIONES.</span></h2>
            <div className="flex-1 border-b-2 border-mat-800"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {pastEvents.map(event => (
              <Link key={event.id} to={`/events/${event.id}`} className="bg-mat-900/50 border border-mat-800 p-8 rounded-[2.5rem] opacity-60 hover:opacity-100 hover:border-mat-500 transition-all grayscale hover:grayscale-0">
                 <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{event.date}</span>
                    <span className="text-[9px] bg-mat-800 px-3 py-1 rounded text-gray-500">FINALIZADO</span>
                 </div>
                 <h4 className="text-xl font-black text-white uppercase font-exo mb-4">{event.title}</h4>
                 <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-mat-800 flex items-center justify-center text-mat-500 font-black text-xs">
                       {event.lineup?.[0]?.name[0] || 'M'}
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">{event.lineup?.[0]?.name}</span>
                 </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. RECIEN LLEGADOS & MARKETPLACE */}
      <section className="py-32 bg-mat-900 border-t border-mat-800/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
             <div>
                <div className="inline-flex items-center gap-3 text-mat-500 font-black uppercase text-[10px] tracking-[0.5em] mb-6">
                   <ShoppingBag size={20} /> THE_CRATE_DIGGING
                </div>
                <h2 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter font-exo leading-none">RECIÉN <span className="text-mat-500">LLEGADOS.</span></h2>
             </div>
             <Link to="/records" className="text-mat-500 font-black uppercase text-xs tracking-widest flex items-center gap-4 hover:text-white transition-all pb-3 border-b-2 border-mat-800">
                VISITAR TIENDA <ArrowRight size={18} />
             </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
             {recentRecords.map(record => (
               <Link key={record.id} to={`/records/${record.id}`} className="group bg-mat-800 border border-mat-700 rounded-[3rem] overflow-hidden hover:border-mat-500 transition-all duration-500 shadow-2xl">
                  <div className="aspect-square relative overflow-hidden bg-black">
                     <CachedImage src={record.coverUrl} alt={record.title} className="grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 opacity-80 group-hover:opacity-100" />
                     <div className="absolute bottom-6 left-6 bg-mat-950/90 backdrop-blur-xl px-5 py-2.5 rounded-2xl text-white font-exo font-black text-2xl tracking-tighter">€{record.price}</div>
                  </div>
                  <div className="p-8">
                     <h3 className="text-white font-black uppercase text-lg truncate group-hover:text-mat-500 transition-colors font-exo mb-1">{record.title}</h3>
                     <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{record.artist}</p>
                  </div>
               </Link>
             ))}
          </div>
        </div>
      </section>

      {/* 5. COMUNIDAD (Pulse) */}
      <section className="py-32 bg-mat-950 border-y border-mat-800/30">
         <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-12 gap-20 items-center">
               <div className="lg:col-span-5">
                  <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-mat-900 border border-mat-500/30 text-mat-500 text-[10px] font-black uppercase tracking-[0.4em] rounded-full mb-10">
                     <Radio className="w-5 h-5 animate-pulse" /> COMMUNITY_PULSE
                  </div>
                  <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter font-exo mb-8 leading-none">COMUNI<span className="text-mat-500">DAD.</span></h2>
                  <p className="text-gray-400 text-xl font-light italic mb-12">Conecta con la red de coleccionistas y melómanos de Ruzafa.</p>
                  <Link to="/community" className="inline-flex items-center gap-4 px-10 py-5 bg-mat-800 border border-mat-700 text-white font-black uppercase text-[10px] tracking-[0.4em] rounded-2xl hover:border-mat-500 transition-all shadow-xl group">
                     EXPLORAR EL MURO <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform text-mat-500" />
                  </Link>
               </div>
               <div className="lg:col-span-7 grid md:grid-cols-2 gap-8">
                  {recentPosts.map(post => (
                    <div key={post.id} className="bg-mat-900 border border-mat-800 p-10 rounded-[3.5rem] shadow-2xl relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                           <MessageCircle size={80} />
                        </div>
                        <div className="flex items-center gap-5 mb-8">
                           <div className="w-12 h-12 bg-mat-500 rounded-2xl flex items-center justify-center text-white font-black text-sm">{post.author[0]}</div>
                           <div>
                              <span className="block text-[11px] font-black uppercase text-white tracking-widest">@{post.author}</span>
                              <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">MEMBER_SIGNAL</span>
                           </div>
                        </div>
                        <p className="text-gray-400 text-base italic mb-8 leading-relaxed line-clamp-4 group-hover:text-gray-300 transition-colors">"{post.content}"</p>
                        <div className="flex items-center gap-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                           <span className="flex items-center gap-2 group-hover:text-mat-500 transition-colors"><Heart size={16} className="text-mat-500" /> {post.likes}</span>
                           <span className="flex items-center gap-2 group-hover:text-white transition-colors"><MessageCircle size={16} /> {post.comments.length}</span>
                        </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};
