
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Disc, Zap, MapPin, Headphones, Martini, Calendar, Globe, MessageCircle, TrendingUp, ShoppingBag, Music } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { dataService } from '../services/dataService';
import { Event, Post } from '../types';
import { CachedImage } from '../components/CachedImage';

export const Home: React.FC = () => {
  const { t } = useLanguage();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [allEvents, posts] = await Promise.all([
        dataService.getEvents(),
        dataService.getCommunityPosts()
      ]);
      setUpcomingEvents(allEvents.slice(0, 3));
      setRecentPosts(posts.slice(0, 3));
    };
    loadData();
    window.addEventListener('mat32_data_changed', loadData);
    return () => window.removeEventListener('mat32_data_changed', loadData);
  }, []);

  const services = [
    {
      title: "THE CRATE",
      desc: "Nuestra tienda curada de discos en Ruzafa. Rarezas y clásicos analógicos.",
      link: "/records",
      icon: <Disc size={28} className="text-mat-500" />,
      bgIcon: <Disc size={180} />,
      img: "https://lrilkrktztlabjpxqbyc.supabase.co/storage/v1/object/public/local-gallery/tienda%20de%20discos%20mat32.jpg"
    },
    {
      title: "OPEN DECKS",
      desc: "La cabina es tuya. Envía tu mix y pincha en el corazón de Valencia.",
      link: "/open-decks",
      icon: <Headphones size={28} className="text-mat-500" />,
      bgIcon: <Music size={180} />,
      img: "https://lrilkrktztlabjpxqbyc.supabase.co/storage/v1/object/public/local-gallery/open%20decks%20mat32.jpg"
    },
    {
      title: "PRIVATE HIRE",
      desc: "Local exclusivo para eventos privados con sonido High Fidelity real en Ruzafa.",
      link: "/alquiler-local-eventos-valencia",
      icon: <Martini size={28} className="text-mat-500" />,
      bgIcon: <Martini size={180} />,
      img: "https://lrilkrktztlabjpxqbyc.supabase.co/storage/v1/object/public/local-gallery/mat32%20inside.jpg"
    }
  ];

  return (
    <div className="bg-mat-900 min-h-screen">
      <SEO titleKey="nav.home" descriptionKey="seo.home.description" />

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <CachedImage 
            src="https://lrilkrktztlabjpxqbyc.supabase.co/storage/v1/object/public/local-gallery/PORTADA_2_mat32.jpg" 
            className="w-full h-full opacity-30 grayscale"
            alt="Entrada Mat32 Hi-Fi Bar Valencia Ruzafa"
            priority={true}
            aspectRatio="h-full w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-mat-950 via-transparent to-mat-950"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="mb-12 animate-fade-in">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mat-500/10 border border-mat-500/20 text-mat-500 font-black text-[9px] uppercase tracking-[0.4em] mb-8">
                <Globe size={14} className="animate-pulse" /> RUZAFA ANALOG HUB
             </div>
            <h1 className="text-[18vw] md:text-[12rem] font-black uppercase tracking-tighter text-white leading-none font-exo select-none">
              MAT<span className="text-mat-500">32</span>
            </h1>
            <div className="flex items-center justify-center gap-4 text-mat-500 font-black uppercase tracking-[0.5em] text-[10px] md:text-sm -mt-2 md:-mt-6">
               <MapPin size={16} className="text-white" /> VALENCIA <span className="text-gray-800">|</span> ESPAÑA
            </div>
          </div>

          <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-2xl font-light italic mb-14 leading-relaxed px-4 opacity-80">
            "El santuario Hi-Fi de Ruzafa. Sonido analógico puro, coctelería de autor y cultura de club en Valencia."
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center px-4">
             <Link to="/contact" className="w-full sm:w-auto px-12 py-5 bg-mat-500 text-white font-black text-[11px] uppercase tracking-[0.4em] clip-path-slant shadow-2xl hover:bg-mat-400 transition-all">
                RESERVAR MESA
             </Link>
             <Link to="/community" className="w-full sm:w-auto px-12 py-5 bg-mat-800 border-2 border-mat-700 text-white font-black text-[11px] uppercase tracking-[0.4em] clip-path-slant hover:border-mat-500 transition-all flex items-center justify-center gap-3 group">
                UNIRSE AL HUB <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
             </Link>
          </div>
        </div>
      </section>

      {/* AGENDA SECTION */}
      <section className="py-32 bg-mat-950 border-y border-mat-800/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 text-mat-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">
                <Calendar size={18} /> PRÓXIMAS SESIONES
              </div>
              <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter font-exo leading-none">LA <span className="text-mat-500">AGENDA.</span></h2>
              <p className="text-gray-500 text-lg mt-6 italic">Selecciones curadas para el sistema Altec A7 en Ruzafa.</p>
            </div>
            <Link to="/events" className="group text-[11px] font-black text-gray-500 hover:text-white uppercase tracking-widest flex items-center gap-3 transition-colors pb-2 border-b-2 border-mat-800 hover:border-mat-500">
              PROGRAMACIÓN COMPLETA <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <Link key={event.id} to={`/events/${event.id}`} className="group bg-mat-900 border border-mat-800 rounded-[2.5rem] overflow-hidden hover:border-mat-500/50 transition-all shadow-2xl flex flex-col">
                <div className="aspect-[4/3] relative overflow-hidden bg-black">
                   <CachedImage src={event.imageUrl} alt={event.title} className="w-full h-full grayscale group-hover:grayscale-0" />
                   <div className="absolute top-6 right-6 bg-mat-500 text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-xl">
                      €{event.price > 0 ? event.price : 'FREE'}
                   </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="text-mat-500 text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-mat-500 rounded-full"></span>
                    {event.date} @ {event.time}
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase font-exo leading-tight mb-6 group-hover:text-mat-500 transition-colors">{event.title}</h3>
                  <div className="mt-auto pt-6 border-t border-mat-800/50 flex items-center justify-between">
                     <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{event.category}</span>
                     <div className="text-mat-500 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all">
                        GET TICKET <ArrowRight size={14} />
                     </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HUB EXPLORATION */}
      <section className="py-32 bg-mat-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
             <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter font-exo mb-6 leading-none">EXPLORA EL <span className="text-mat-500">HUB.</span></h2>
             <p className="text-gray-500 max-w-xl mx-auto italic">Servicios exclusivos para la comunidad musical de Valencia y amantes del Hi-Fi.</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-10">
            {services.map((s, i) => (
              <Link key={i} to={s.link} className="group relative aspect-[3/4] overflow-hidden rounded-[3rem] border border-mat-800 hover:border-mat-500 transition-all shadow-2xl bg-mat-900">
                 <CachedImage src={s.img} className="w-full h-full object-cover opacity-20 grayscale group-hover:grayscale-0 transition-all duration-1000" alt={s.title} />
                 
                 {/* Decorative background icon */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-mat-950 opacity-[0.05] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-1000 pointer-events-none">
                    {s.bgIcon}
                 </div>

                 <div className="absolute inset-0 bg-gradient-to-t from-mat-950 via-mat-950/20 to-transparent"></div>
                 
                 <div className="absolute bottom-10 left-10 right-10 z-10">
                    <div className="w-16 h-16 bg-mat-900 rounded-2xl flex items-center justify-center mb-6 border border-mat-800 group-hover:border-mat-500 group-hover:shadow-[0_0_20px_rgba(234,88,12,0.3)] transition-all duration-500 shadow-xl group-hover:-translate-y-2">
                       {s.icon}
                    </div>
                    <h3 className="text-3xl font-black text-white font-exo mb-3 uppercase tracking-tighter">{s.title}</h3>
                    <p className="text-gray-400 text-sm italic mb-8 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">"{s.desc}"</p>
                    <div className="flex items-center gap-3 text-[10px] font-black text-mat-500 uppercase tracking-widest group-hover:gap-5 transition-all">
                       ENTRAR <ArrowRight size={14} />
                    </div>
                 </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
