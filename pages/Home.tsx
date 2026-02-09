
import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Disc, MapPin, ShoppingBag, Heart, History, Zap, Flame, User } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { dataService } from '../services/dataService';
import { Event, VinylRecord } from '../types';
import { CachedImage } from '../components/CachedImage';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const HERO_IMAGES = [
  "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/7701241e-71ee-4929-18c0-d1d0d9576e00/public",
  "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/38cbbb12-3f05-47c5-697b-f932d8f99700/public",
  "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/8835f005-f545-4434-c67a-b2154de2da00/public",
  "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/de211934-62c1-4fb5-6c4a-35cd8a0d9700/public",
  "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/5dea483e-141a-4665-8085-5c163d8eda00/public"
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [newArrivals, setNewArrivals] = useState<VinylRecord[]>([]);
  const [jazzSelection, setJazzSelection] = useState<VinylRecord[]>([]);
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const allEvents = await dataService.getEvents();
      const allRecords = await dataService.getRecords();
      
      const now = new Date();
      now.setHours(0,0,0,0);
      setUpcomingEvents(allEvents.filter(e => new Date(e.date) >= now).slice(0, 3));
      
      // Filtramos por géneros v16.0 - Artist-as-Title
      setNewArrivals(allRecords.filter(r => r.genre !== 'Spiritual Jazz' && r.status === 'published').slice(0, 4));
      setJazzSelection(allRecords.filter(r => r.genre === 'Spiritual Jazz').slice(0, 4));
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
      document.getElementById('agenda-section')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      clickTimer.current = setTimeout(() => {
        setIsRevealed(!isRevealed);
        clickTimer.current = null;
      }, 250);
    }
  };

  return (
    <div className="bg-mat-900 min-h-screen overflow-x-hidden">
      <SEO titleKey="nav.home" descriptionKey="seo.home.description" />

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
            <p className="text-gray-300 max-w-2xl mx-auto text-lg md:text-2xl font-light italic mb-16 opacity-90 drop-shadow-lg leading-relaxed px-4">"Donde el tiempo se mide en revoluciones por minuto y el sonido tiene alma analógica."</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center px-4">
               <Link to="/contact" className="w-full sm:w-auto px-14 py-6 bg-mat-500 text-white font-black uppercase text-[11px] tracking-widest clip-path-slant shadow-2xl hover:bg-mat-400 transition-all active:scale-95">RESERVAR MESA</Link>
               <Link to="/community" className="w-full sm:w-auto px-14 py-6 bg-mat-900/80 border-2 border-mat-700 text-white font-black uppercase text-[11px] tracking-widest clip-path-slant hover:border-mat-500 backdrop-blur-md transition-all active:scale-95">HUB COMUNIDAD</Link>
            </div>
        </div>
      </section>

      {/* SPIRITUAL JAZZ SECTION - REAL COVERS */}
      <section className="py-40 bg-[#0f0e0d] relative overflow-hidden border-y border-mat-800/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-3 text-mat-500 font-black uppercase tracking-[0.5em] text-[10px] mb-6">
                <Flame size={20} className="animate-pulse" /> THE_IMPULSE_LEGACY_V16
              </div>
              <h2 className="text-6xl md:text-[10rem] font-black text-white uppercase tracking-tighter font-exo leading-[0.8]">SPIRITUAL <span className="text-mat-500">JAZZ.</span></h2>
              <p className="text-gray-500 text-xl md:text-2xl mt-8 italic font-light max-w-2xl leading-relaxed">"Curaduría definitiva. Carátulas originales y piezas maestras para la escucha crítica en nuestro sistema Altec A7."</p>
            </div>
            <Link to="/records?category=Spiritual Jazz" className="text-[11px] font-black text-mat-500 hover:text-white uppercase tracking-widest flex items-center gap-4 transition-colors pb-3 border-b-2 border-mat-500 hover:border-white">
              EXPLORAR ARTISTAS <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {jazzSelection.map((record) => (
              <article key={record.id} onClick={() => navigate(`/records/${record.id}`)} className="bg-black/40 border border-mat-800/50 rounded-[2.5rem] overflow-hidden group hover:border-mat-500 transition-all duration-700 flex flex-col shadow-2xl relative">
                <div className="aspect-square relative overflow-hidden bg-black">
                   <CachedImage src={record.coverUrl} alt={record.title} className="w-full h-full grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[2000ms]" />
                   <div className="absolute top-6 right-6 flex flex-col gap-2" onClick={e => e.stopPropagation()}>
                      <button onClick={() => toggleWishlist(record.id)} className={`p-4 rounded-full backdrop-blur-xl transition-all ${isInWishlist(record.id) ? 'bg-mat-500 text-white' : 'bg-black/70 text-white/50 hover:text-white'}`}>
                        <Heart size={16} className={isInWishlist(record.id) ? 'fill-current' : ''} />
                      </button>
                   </div>
                   <div className="absolute bottom-6 left-6 bg-mat-950/90 backdrop-blur-md border border-mat-800 px-4 py-1.5 rounded-xl text-white font-exo font-black text-lg">€{record.price}</div>
                </div>
                
                <div className="p-10 flex-1 flex flex-col">
                   <span className="text-[9px] font-black text-mat-500 uppercase tracking-[0.3em] mb-4">MASTERS_SERIES</span>
                   <h3 className="text-2xl font-black text-white uppercase tracking-tighter font-exo leading-tight mb-2 group-hover:text-mat-500 transition-colors">{record.title}</h3>
                   <div className="text-gray-500 text-[10px] italic font-medium leading-relaxed mb-10 line-clamp-2" dangerouslySetInnerHTML={{__html: record.description.split('.')[0]}}></div>
                   
                   <div className="mt-auto pt-8 border-t border-mat-800/30 flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">REAL_RECORD_PHOTO</span>
                        <span className="text-[8px] text-gray-800 font-black uppercase tracking-widest">{record.label}</span>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); addToCart(record); }} className="p-4 bg-mat-500 text-white rounded-2xl hover:bg-white hover:text-mat-500 transition-all shadow-xl">
                        <ShoppingBag size={20} />
                      </button>
                   </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS - ARTIST FOCUS */}
      <section className="py-32 bg-mat-900">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div>
              <div className="flex items-center gap-3 text-mat-500 font-black uppercase tracking-[0.5em] text-[10px] mb-6">
                <User size={20} className="animate-pulse" /> NEW_ARTIST_CRATE
              </div>
              <h2 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter font-exo leading-none">RECIÉN <span className="text-mat-500">LLEGADOS.</span></h2>
            </div>
            <Link to="/records" className="text-[11px] font-black text-gray-500 hover:text-white uppercase tracking-widest flex items-center gap-4 transition-colors pb-3 border-b-2 border-mat-800 hover:border-mat-500">
              TIENDA COMPLETA <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newArrivals.map((record) => (
              <article key={record.id} onClick={() => navigate(`/records/${record.id}`)} className="bg-mat-800 border border-mat-700 rounded-[2.5rem] overflow-hidden group hover:border-mat-500 transition-all duration-500 flex flex-col shadow-xl cursor-pointer">
                <div className="aspect-square relative overflow-hidden bg-black">
                   <CachedImage src={record.coverUrl} alt={record.title} className="w-full h-full grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1500ms]" />
                   <div className="absolute top-6 right-6 flex flex-col gap-2" onClick={e => e.stopPropagation()}>
                      <button onClick={() => toggleWishlist(record.id)} className={`p-4 rounded-full backdrop-blur-xl transition-all ${isInWishlist(record.id) ? 'bg-mat-500 text-white' : 'bg-black/50 text-white/50 hover:text-white'}`}>
                        <Heart size={16} className={isInWishlist(record.id) ? 'fill-current' : ''} />
                      </button>
                   </div>
                   <div className="absolute bottom-6 left-6 bg-mat-950/90 backdrop-blur-md border border-mat-700 px-4 py-1.5 rounded-xl text-white font-exo font-black text-lg">€{record.price}</div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                   <h3 className="text-xl font-black text-white uppercase tracking-tighter font-exo leading-none mb-1 group-hover:text-mat-500 transition-colors truncate">{record.title}</h3>
                   <div className="text-gray-500 text-[10px] font-bold italic truncate mb-6" dangerouslySetInnerHTML={{__html: record.description.split('.')[0]}}></div>
                   <div className="mt-auto pt-6 border-t border-mat-800/50 flex justify-between items-center">
                      <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{record.genre}</span>
                      <button onClick={(e) => { e.stopPropagation(); addToCart(record); }} className="p-3 bg-mat-800 text-gray-400 hover:bg-mat-500 hover:text-white rounded-xl transition-all shadow-lg">
                        <ShoppingBag size={16} />
                      </button>
                   </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ARCHIVO SECTION */}
      <section className="py-32 bg-mat-950 border-t border-mat-800/30">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-6 mb-20">
            <History size={32} className="text-mat-500" />
            <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter font-exo leading-none">EL <span className="text-mat-500">ARCHIVO.</span></h2>
            <div className="flex-1 border-b-2 border-mat-800 opacity-20"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8 opacity-60">
             <div className="p-10 border border-mat-800 rounded-[3rem] italic text-gray-600 text-sm leading-relaxed">
                "Escaneando memorias analógicas. El sistema Altec A7 garantiza que cada surco sea interpretado con la máxima fidelidad técnica."
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};
