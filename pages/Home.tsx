
import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Disc, MapPin, ShoppingBag, Heart, Radio, ChevronLeft, ChevronRight } from 'lucide-react';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { Event, VinylRecord } from '../types';
import { CachedImage } from '../components/CachedImage';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { EventCard } from '../components/EventCard';

const HERO_IMAGES = [
  "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/7701241e-71ee-4929-18c0-d1d0d9576e00/public",
  "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/38cbbb12-3f05-47c5-697b-f932d8f99700/public",
  "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/8835f005-f545-4434-c67a-b2154de2da00/public"
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [diverseCrate, setDiverseCrate] = useState<VinylRecord[]>([]);
  const [jazzSelection, setJazzSelection] = useState<VinylRecord[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [crateIndex, setCrateIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const allEvents = await dataService.getEvents();
      const allRecords = await dataService.getRecords();

      const now = new Date();
      now.setHours(0,0,0,0);

      const futureEvents = allEvents.filter(e => new Date(e.date) >= now);
      setUpcomingEvents(futureEvents.slice(0, 4));

      setDiverseCrate(allRecords.slice(0, 4));

      setJazzSelection(allRecords.filter(r => r.genre === 'Jazz').slice(0, 4));
    };
    loadData();
    window.addEventListener('mat32_data_changed', loadData);
    return () => window.removeEventListener('mat32_data_changed', loadData);
  }, []);

  useEffect(() => {
    if (isRevealed) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isRevealed, currentSlide]);

  const handleHeroInteraction = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) return;
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      document.getElementById('next-signals')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      clickTimer.current = setTimeout(() => {
        setIsRevealed(!isRevealed);
        clickTimer.current = null;
      }, 250);
    }
  };

  return (
    <div className="bg-mat-900 min-h-screen overflow-x-hidden">
      <SEO titleKey="nav.home" descriptionKey="Mat32 Valencia: Santuario Hi-Fi y Comunidad de Coleccionistas. Agenda de Open Decks y Sesiones de Escucha en Ruzafa." />

      {/* HERO SECTION */}
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
                  isRevealed ? 'grayscale-0 opacity-100 brightness-110 blur-0 scale-110' : 'grayscale opacity-85 brightness-90 blur-[0.5px]'
                }`}
                alt={`Mat32 Identity ${idx}`}
                priority={idx === currentSlide}
              />
            </div>
          ))}
          <div className={`absolute inset-0 bg-gradient-to-b from-mat-950/30 via-transparent to-mat-950 transition-opacity duration-1000 ${isRevealed ? 'opacity-10' : 'opacity-70'}`}></div>
        </div>

        <div className={`container mx-auto px-6 relative z-10 text-center transition-all duration-1000 transform ${isRevealed ? 'scale-90 opacity-20 blur-md pointer-events-none' : 'scale-100 opacity-100 blur-0'}`}>
            <h1 className="text-[18vw] md:text-[12rem] font-black uppercase tracking-tighter text-white leading-[0.8] font-exo drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] mb-8">
              MAT<span className="text-mat-500">32</span>
            </h1>
            <div className="flex items-center justify-center gap-6 text-mat-500 font-black uppercase tracking-[0.6em] text-xs md:text-base mb-12">
               <MapPin size={18} className="text-white" /> VALENCIA <span className="text-gray-800">|</span> RUZAFA
            </div>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg md:text-2xl font-light italic mb-16 opacity-90 drop-shadow-lg leading-relaxed px-4">"Donde el tiempo se mide en revoluciones por minuto."</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center px-4">
               <Link to="/alquiler-local-eventos-valencia#booking-form" className="w-full sm:w-auto px-14 py-6 bg-mat-500 text-white font-black uppercase text-[11px] tracking-widest clip-path-slant shadow-2xl hover:bg-mat-400 transition-all active:scale-95">ALQUILER LOCAL</Link>
               <Link to="/open-decks" className="w-full sm:w-auto px-14 py-6 bg-mat-900/80 border-2 border-mat-700 text-white font-black uppercase text-[11px] tracking-widest clip-path-slant hover:border-mat-500 backdrop-blur-md transition-all active:scale-95">ENVIAR MIX</Link>
            </div>
        </div>
      </section>

      {/* FAST ACCESS AGENDA - NEXT SIGNALS */}
      <section id="next-signals" className="py-24 bg-mat-950 border-b border-mat-800">
        <div className="container mx-auto px-6">
           <div className="flex items-center gap-6 mb-16">
              <div className="p-3 bg-mat-500 text-white rounded-2xl shadow-xl shadow-mat-500/20">
                 <Radio size={24} className="animate-pulse" />
              </div>
              <div>
                 <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter font-exo leading-none">THE NEXT <span className="text-mat-500">SIGNALS.</span></h2>
              </div>
              <div className="hidden md:block flex-1 border-b-2 border-mat-800 opacity-20"></div>
              <Link to="/events" className="px-8 py-3 bg-mat-800 border border-mat-700 rounded-xl text-[9px] font-black uppercase text-gray-400 hover:text-white hover:border-mat-500 transition-all">VER TODA LA AGENDA</Link>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.slice(0, 2).map(event => (
                  <EventCard key={event.id} event={event} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-mat-800 rounded-[3rem]">
                   <Disc className="w-12 h-12 text-mat-800 mx-auto mb-4 animate-spin-slow" />
                   <p className="text-gray-600 font-black uppercase text-xs tracking-widest">Sincronizando protocolos futuros...</p>
                </div>
              )}
           </div>
        </div>
      </section>

      {/* DIVERSE CRATE CAROUSEL */}
      <section className="py-32 bg-mat-900 border-b border-mat-800/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-3xl">
              <h2 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter font-exo leading-none">THE <span className="text-mat-500">CRATE.</span></h2>
              <p className="text-gray-500 text-xl md:text-2xl mt-8 italic font-light leading-relaxed">House, Soul, Afrobeat y Electrónica.</p>
            </div>
            <Link to="/records" className="text-[11px] font-black text-mat-500 hover:text-white uppercase tracking-widest flex items-center gap-4 transition-colors pb-3 border-b-2 border-mat-500 hover:border-white">
              VER TIENDA <ArrowRight size={18} />
            </Link>
          </div>

          {diverseCrate.length > 0 && (
            <div className="flex items-center gap-6">
              <button
                onClick={() => setCrateIndex((crateIndex - 1 + diverseCrate.length) % diverseCrate.length)}
                className="flex-shrink-0 p-4 bg-mat-800 border border-mat-700 rounded-2xl text-gray-400 hover:text-white hover:border-mat-500 transition-all"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="flex-1 max-w-sm mx-auto">
                {(() => {
                  const record = diverseCrate[crateIndex];
                  return (
                    <article onClick={() => navigate(`/records/${record.id}`)} className="bg-black/40 border border-mat-800/50 rounded-[2.5rem] overflow-hidden group hover:border-mat-500 transition-all duration-500 flex flex-col shadow-2xl cursor-pointer">
                      <div className="aspect-square relative overflow-hidden bg-black">
                        <CachedImage src={record.coverUrl} alt={record.title} />
                        <div className="absolute top-6 right-6" onClick={e => e.stopPropagation()}>
                          <button onClick={() => toggleWishlist(record.id)} className={`p-4 rounded-full backdrop-blur-xl transition-all ${isInWishlist(record.id) ? 'bg-mat-500 text-white' : 'bg-black/70 text-white/50 hover:text-white'}`}>
                            <Heart size={16} className={isInWishlist(record.id) ? 'fill-current' : ''} />
                          </button>
                        </div>
                        <div className="absolute bottom-6 left-6 bg-mat-950/90 backdrop-blur-md border border-mat-800 px-4 py-1.5 rounded-xl text-white font-exo font-black text-lg">€{record.price}</div>
                      </div>
                      <div className="p-10 flex-1 flex flex-col">
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter font-exo leading-tight mb-2 group-hover:text-mat-500 transition-colors">{record.artist}</h3>
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-10">{record.title}</p>
                        <div className="mt-auto pt-8 border-t border-mat-800/30 flex justify-between items-center">
                          <span className="text-[8px] text-gray-800 font-black uppercase tracking-widest">{record.genre}</span>
                          <button onClick={(e) => { e.stopPropagation(); addToCart(record); }} className="p-4 bg-mat-500 text-white rounded-2xl hover:bg-white hover:text-mat-500 transition-all shadow-xl">
                            <ShoppingBag size={20} />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })()}
              </div>

              <button
                onClick={() => setCrateIndex((crateIndex + 1) % diverseCrate.length)}
                className="flex-shrink-0 p-4 bg-mat-800 border border-mat-700 rounded-2xl text-gray-400 hover:text-white hover:border-mat-500 transition-all"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}

          {diverseCrate.length > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {diverseCrate.map((_, i) => (
                <button key={i} onClick={() => setCrateIndex(i)} className={`w-2 h-2 rounded-full transition-all ${i === crateIndex ? 'bg-mat-500 w-6' : 'bg-mat-700'}`} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* JAZZ SELECTION */}
      {jazzSelection.length > 0 && (
        <section className="py-32 bg-[#0c0a09]">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
              <div>
                <div className="flex items-center gap-3 text-mat-500 font-black uppercase tracking-[0.5em] text-[10px] mb-6">
                  SELECCIÓN JAZZ
                </div>
                <h2 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter font-exo leading-none">JAZZ <span className="text-mat-500">HITS.</span></h2>
              </div>
              <Link to="/records?category=Jazz" className="text-[11px] font-black text-gray-500 hover:text-white uppercase tracking-widest flex items-center gap-4 transition-colors pb-3 border-b-2 border-mat-800 hover:border-mat-500">
                COLECCIÓN JAZZ <ArrowRight size={18} />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center max-w-4xl">
              <article onClick={() => navigate(`/records/${jazzSelection[0].id}`)} className="bg-mat-800 border border-mat-700 rounded-[2.5rem] overflow-hidden group hover:border-mat-500 transition-all duration-500 shadow-2xl cursor-pointer">
                <div className="aspect-square relative overflow-hidden bg-black">
                  <CachedImage src={jazzSelection[0].coverUrl} alt={jazzSelection[0].title} />
                  <div className="absolute top-6 right-6" onClick={e => e.stopPropagation()}>
                    <button onClick={() => toggleWishlist(jazzSelection[0].id)} className={`p-4 rounded-full backdrop-blur-xl transition-all ${isInWishlist(jazzSelection[0].id) ? 'bg-mat-500 text-white' : 'bg-black/50 text-white/50 hover:text-white'}`}>
                      <Heart size={16} className={isInWishlist(jazzSelection[0].id) ? 'fill-current' : ''} />
                    </button>
                  </div>
                  <div className="absolute bottom-6 left-6 bg-mat-950/90 backdrop-blur-md border border-mat-700 px-4 py-1.5 rounded-xl text-white font-exo font-black text-lg">€{jazzSelection[0].price}</div>
                </div>
                <div className="p-8 flex flex-col">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter font-exo leading-none mb-1 group-hover:text-mat-500 transition-colors">{jazzSelection[0].artist}</h3>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-6">{jazzSelection[0].title}</p>
                  <div className="flex justify-between items-center pt-6 border-t border-mat-800/50">
                    <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{jazzSelection[0].label}</span>
                    <button onClick={(e) => { e.stopPropagation(); addToCart(jazzSelection[0]); }} className="p-3 bg-mat-800 text-gray-400 hover:bg-mat-500 hover:text-white rounded-xl transition-all shadow-lg">
                      <ShoppingBag size={16} />
                    </button>
                  </div>
                </div>
              </article>

              <div className="space-y-8">
                <p className="text-gray-400 text-2xl italic font-light leading-relaxed">"Jazz clásico, libre e improvisado. Selección analógica para escuchas exigentes."</p>
                <Link to="/records?category=Jazz" className="inline-flex items-center gap-4 px-10 py-5 bg-mat-500 text-white font-black uppercase text-[11px] tracking-[0.4em] rounded-2xl hover:bg-mat-400 transition-all shadow-xl">
                  VER COLECCIÓN JAZZ <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  );
};
