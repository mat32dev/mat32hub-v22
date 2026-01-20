
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Disc, Zap, MapPin, Headphones, Martini, Calendar } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { dataService } from '../services/dataService';
import { Event } from '../types';
import { CachedImage } from '../components/CachedImage';

export const Home: React.FC = () => {
  const { t } = useLanguage();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);

  useEffect(() => {
    const loadEvents = async () => {
      const allEvents = await dataService.getEvents();
      setUpcomingEvents(allEvents.slice(0, 3));
    };
    loadEvents();
  }, []);

  const services = [
    {
      title: "THE CRATE",
      desc: "Nuestra tienda curada de vinilos. Rarezas y clásicos.",
      link: "/records",
      icon: <Disc size={24} className="text-mat-500" />,
      img: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=800"
    },
    {
      title: "OPEN DECKS",
      desc: "La cabina es tuya. Envía tu mix y pincha en Mat32.",
      link: "/open-decks",
      icon: <Headphones size={24} className="text-mat-500" />,
      img: "https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?q=80&w=800"
    },
    {
      title: "ALQUILER",
      desc: "Local exclusivo para eventos privados en Ruzafa.",
      link: "/alquiler-local-eventos-valencia",
      icon: <Martini size={24} className="text-mat-500" />,
      img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800"
    }
  ];

  return (
    <div className="bg-mat-900">
      <SEO titleKey="nav.home" descriptionKey="seo.home.description" />

      {/* Hero Section */}
      <section className="relative h-[80vh] md:h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2000" 
            className="w-full h-full object-cover opacity-20 grayscale"
            alt="Mat32 Hi-Fi Bar Valencia Ruzafa"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-mat-900/95 via-mat-900/10 to-mat-900"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="mb-6 animate-fade-in">
            <h1 className="text-[22vw] md:text-[11rem] font-black uppercase tracking-tighter text-white leading-none font-exo text-glow select-none">
              MAT<span className="text-mat-500">32</span>
            </h1>
            <div className="flex items-center justify-center gap-4 text-mat-500 font-black uppercase tracking-[0.5em] text-[10px] md:text-base -mt-4 md:-mt-8">
               <MapPin size={16} className="animate-bounce" /> VALENCIA <span className="text-gray-800">|</span> RUZAFA
            </div>
          </div>

          <p className="text-gray-300 max-w-2xl mx-auto text-base md:text-xl font-light italic mb-10 leading-relaxed px-4">
            "Santuario Hi-Fi y Espacio de Eventos Analógicos en el corazón de Valencia."
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
             <Link to="/contact" className="w-full sm:w-auto px-10 py-4 bg-mat-500 text-white font-black text-[10px] uppercase tracking-[0.4em] clip-path-slant shadow-2xl hover:bg-mat-400 transition-all">
                RESERVAR
             </Link>
             <Link to="/alquiler-local-eventos-valencia" className="w-full sm:w-auto px-10 py-4 bg-mat-800 border-2 border-mat-700 text-white font-black text-[10px] uppercase tracking-[0.4em] clip-path-slant hover:border-mat-500 transition-all">
                ALQUILER LOCAL
             </Link>
          </div>
        </div>
      </section>

      {/* AGENDA FLASH - PRIORITARIA DESPUÉS DEL HERO */}
      <section className="py-20 bg-mat-900 border-b border-mat-800/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <div className="flex items-center gap-2 text-mat-500 font-black uppercase tracking-[0.4em] text-[9px] mb-3">
                <Calendar size={14} /> PRÓXIMOS RITMOS
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter font-exo leading-none">LA <span className="text-mat-500">AGENDA.</span></h2>
            </div>
            <Link to="/events" className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest flex items-center gap-2 transition-colors pb-1 border-b border-mat-800 hover:border-white">
              VER TODA LA PROGRAMACIÓN <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {upcomingEvents.length > 0 ? upcomingEvents.map((event) => (
              <Link key={event.id} to={`/events`} className="group bg-mat-800 border border-mat-700 rounded-[2rem] overflow-hidden hover:border-mat-500 transition-all shadow-xl">
                <div className="aspect-video relative overflow-hidden">
                   <CachedImage src={event.imageUrl} alt={event.title} className="w-full h-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
                   <div className="absolute top-4 right-4 bg-mat-500 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                      €{event.price > 0 ? event.price : 'FREE'}
                   </div>
                </div>
                <div className="p-6">
                  <div className="text-mat-500 text-[9px] font-black uppercase tracking-widest mb-2">{event.date} @ {event.time}</div>
                  <h3 className="text-xl font-black text-white uppercase font-exo truncate mb-4 group-hover:text-mat-500 transition-colors">{event.title}</h3>
                  <div className="flex items-center justify-between pt-4 border-t border-mat-700/50">
                     <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{event.category}</span>
                     <div className="text-mat-500 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        GET TICKET <ArrowRight size={12} />
                     </div>
                  </div>
                </div>
              </Link>
            )) : (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-mat-800 rounded-[2rem]">
                <p className="text-gray-700 font-black uppercase tracking-widest text-[10px]">Actualizando frecuencias culturales...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Grid de Servicios Hub */}
      <section className="py-24 bg-mat-950 border-b border-mat-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
             <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter font-exo mb-4">EXPLORA EL <span className="text-mat-500">HUB.</span></h2>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {services.map((s, i) => (
              <Link key={i} to={s.link} className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-mat-800 hover:border-mat-500 transition-all">
                 <img src={s.img} className="w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" alt={s.title} />
                 <div className="absolute inset-0 bg-gradient-to-t from-mat-950 via-transparent to-transparent"></div>
                 <div className="absolute bottom-8 left-8 right-8">
                    <div className="mb-4">{s.icon}</div>
                    <h3 className="text-2xl font-black text-white font-exo mb-2 uppercase">{s.title}</h3>
                    <p className="text-gray-400 text-xs italic mb-5 leading-relaxed">{s.desc}</p>
                    <div className="flex items-center gap-2 text-[9px] font-black text-mat-500 uppercase tracking-widest">
                       ACCEDER <ArrowRight size={12} className="group-hover:translate-x-2 transition-transform" />
                    </div>
                 </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Community / Marketplace Focus */}
      <section className="py-24 bg-mat-900 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-mat-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 text-mat-500 font-black uppercase tracking-[0.5em] text-[9px]">
                <Zap size={16} className="animate-pulse" /> COMUNIDAD VINILO VALENCIA
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter font-exo leading-none">
                Cambalache & <span className="text-mat-500">Culture.</span>
              </h2>
              <p className="text-gray-400 text-lg font-light italic leading-relaxed">
                Únete al Hub de coleccionistas de Ruzafa. Publica tus discos, propón intercambios o simplemente ven a disfrutar del sonido analógico puro.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 pt-4">
                 <Link to="/community" className="px-8 py-4 bg-mat-500 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-mat-400 shadow-lg transition-all">
                    ENTRAR AL HUB
                 </Link>
                 <Link to="/records" className="px-8 py-4 bg-mat-800 border border-mat-700 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:border-mat-500 transition-all">
                    VER TIENDA
                 </Link>
              </div>
            </div>
            <div className="relative group">
              <div className="aspect-square bg-mat-800 rounded-[3rem] overflow-hidden border border-mat-700 shadow-2xl">
                 <img src="https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=1200" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" alt="Comunidad Vinilo Valencia" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
