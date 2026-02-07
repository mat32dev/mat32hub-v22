
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Disc, Zap, MapPin, Globe, Radio, Heart, ShoppingBag, Layers, MessageCircle } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { dataService } from '../services/dataService';
import { Event, Post, VinylRecord } from '../types';
import { CachedImage } from '../components/CachedImage';

export const Home: React.FC = () => {
  const { t } = useLanguage();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [recentRecords, setRecentRecords] = useState<VinylRecord[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [allEvents, allRecords, posts] = await Promise.all([
        dataService.getEvents(),
        dataService.getRecords(),
        dataService.getCommunityPosts()
      ]);
      setUpcomingEvents(allEvents.slice(0, 3));
      setRecentRecords(allRecords.slice(0, 4));
      setRecentPosts(posts.slice(0, 2));
    };
    loadData();
    window.addEventListener('mat32_data_changed', loadData);
    return () => window.removeEventListener('mat32_data_changed', loadData);
  }, []);

  return (
    <div className="bg-mat-900 min-h-screen">
      <SEO titleKey="nav.home" descriptionKey="seo.home.description" />

      {/* HERO ESTRATÉGICO */}
      <section className="relative h-[95vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <CachedImage 
            src="https://imagedelivery.net/f4c2d13d7f6a74d21dacac9c2eb7ba5d/7701241e-71ee-4929-18c0-d1d0d9576e00/public" 
            className="w-full h-full opacity-40 grayscale"
            alt="Mat32 Hi-Fi Hub Valencia Ruzafa"
            priority={true}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-mat-950/20 via-transparent to-mat-950"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="mb-8 animate-fade-in">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mat-500/10 border border-mat-500/20 text-mat-500 font-black text-[10px] uppercase tracking-[0.4em] mb-8">
                <Globe size={14} className="animate-pulse" /> RUZAFA ANALOG HUB
             </div>
            <h1 className="text-[18vw] md:text-[11rem] font-black uppercase tracking-tighter text-white leading-none font-exo">
              MAT<span className="text-mat-500">32</span>
            </h1>
            <div className="flex items-center justify-center gap-4 text-mat-500 font-black uppercase tracking-[0.5em] text-[10px] md:text-sm -mt-2 md:-mt-4">
               <MapPin size={16} className="text-white" /> VALENCIA <span className="text-gray-800">|</span> RUZAFA
            </div>
          </div>

          <p className="text-gray-300 max-w-2xl mx-auto text-lg md:text-2xl font-light italic mb-14 leading-relaxed px-4 opacity-90">
            "Santuario de alta fidelidad en Ruzafa. Sonido analógico puro, comunidad de vinilos y coctelería de autor."
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center px-4">
             <Link to="/contact" className="w-full sm:w-auto px-12 py-5 bg-mat-500 text-white font-black text-[11px] uppercase tracking-[0.4em] clip-path-slant shadow-2xl hover:bg-mat-400 transition-all">
                RESERVAR MESA
             </Link>
             <Link to="/community" className="w-full sm:w-auto px-12 py-5 bg-mat-800 border-2 border-mat-700 text-white font-black text-[11px] uppercase tracking-[0.4em] clip-path-slant hover:border-mat-500 transition-all flex items-center justify-center gap-3">
                HUB COMUNIDAD <ArrowRight size={14} />
             </Link>
          </div>
        </div>
      </section>

      {/* COMMUNITY MARKETPLACE PREVIEW - Mejor SEO para productos */}
      <section className="py-24 bg-mat-950/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
             <div>
                <div className="inline-flex items-center gap-3 text-mat-500 font-black uppercase text-[10px] tracking-widest mb-4">
                   <ShoppingBag size={18} /> THE_CRATE_DIGGING
                </div>
                <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter font-exo leading-none">RECIÉN <span className="text-mat-500">LLEGADOS.</span></h2>
             </div>
             <Link to="/records" className="text-mat-500 font-black uppercase text-xs tracking-widest flex items-center gap-3 hover:text-white transition-all">
                VER TODA LA TIENDA <ArrowRight size={16} />
             </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
             {recentRecords.map(record => (
               <Link key={record.id} to={`/records/${record.id}`} className="group bg-mat-800 border border-mat-700 rounded-[2.5rem] overflow-hidden hover:border-mat-500 transition-all shadow-xl">
                  <div className="aspect-square relative overflow-hidden bg-black">
                     <CachedImage src={record.coverUrl} alt={record.title} className="grayscale group-hover:grayscale-0 transition-all duration-700" />
                     <div className="absolute bottom-4 left-4 bg-mat-950/80 backdrop-blur-md px-4 py-2 rounded-xl text-white font-exo font-black text-xl tracking-tighter">€{record.price}</div>
                  </div>
                  <div className="p-6">
                     <h3 className="text-white font-black uppercase text-sm truncate group-hover:text-mat-500 transition-colors">{record.title}</h3>
                     <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest">{record.artist}</p>
                  </div>
               </Link>
             ))}
          </div>
        </div>
      </section>

      {/* COMMUNITY FEED - Social Proof */}
      <section className="py-24 bg-mat-900 border-y border-mat-800/30">
         <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-12 gap-16 items-center">
               <div className="lg:col-span-5">
                  <div className="inline-flex items-center gap-3 px-4 py-2 bg-mat-950 border border-mat-500/30 text-mat-500 text-[10px] font-black uppercase tracking-widest rounded-full mb-8">
                     <Radio className="w-4 h-4 animate-pulse" /> COMMUNITY_PULSE
                  </div>
                  <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter font-exo mb-6 leading-none">VIBRA <span className="text-mat-500">LOCAL.</span></h2>
                  <p className="text-gray-400 text-lg italic mb-8">Conecta con la red de coleccionistas y melómanos de Valencia. El Hub analógico de Ruzafa nunca duerme.</p>
                  <Link to="/community" className="text-mat-500 font-black uppercase text-xs tracking-widest flex items-center gap-3 hover:text-white transition-all">
                     EXPLORAR EL MURO <ArrowRight size={16} />
                  </Link>
               </div>
               <div className="lg:col-span-7 grid md:grid-cols-2 gap-6" style={{ wordBreak: 'break-word' }}>
                  {recentPosts.map(post => (
                    <div key={post.id} className="bg-mat-800 border border-mat-700 p-8 rounded-[2.5rem] shadow-xl">
                        <div className="flex items-center gap-4 mb-6">
                           <div className="w-10 h-10 bg-mat-500 rounded-full flex items-center justify-center text-white font-black text-xs">{post.author[0]}</div>
                           <span className="text-[10px] font-black uppercase text-white">@{post.author}</span>
                        </div>
                        <p className="text-gray-400 text-sm italic mb-6 line-clamp-3">"{post.content}"</p>
                        <div className="flex items-center gap-4 text-[9px] font-black text-gray-500 uppercase">
                           <span className="flex items-center gap-1.5"><Heart size={14} className="text-mat-500" /> {post.likes}</span>
                           <span className="flex items-center gap-1.5"><MessageCircle size={14} /> {post.comments.length}</span>
                        </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* AGENDA COMPACTA */}
      <section className="py-32 bg-mat-900">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div>
              <div className="flex items-center gap-2 text-mat-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">
                <Disc size={18} className="animate-spin-slow" /> SESIONES PROGRAMADAS
              </div>
              <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter font-exo leading-none">LA <span className="text-mat-500">AGENDA.</span></h2>
            </div>
            <Link to="/events" className="text-[11px] font-black text-gray-500 hover:text-white uppercase tracking-widest flex items-center gap-3 transition-colors pb-2 border-b-2 border-mat-800">
              VER TODA LA PROGRAMACIÓN <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <Link key={event.id} to={`/events/${event.id}`} className="group bg-mat-800 border border-mat-700 rounded-[2.5rem] overflow-hidden hover:border-mat-500 transition-all flex flex-col">
                <div className="aspect-[4/3] relative overflow-hidden bg-black">
                   <CachedImage src={event.imageUrl} alt={event.title} className="w-full h-full grayscale group-hover:grayscale-0" />
                   <div className="absolute top-6 right-6 bg-mat-500 text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl">
                      €{event.price > 0 ? event.price : 'FREE'}
                   </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="text-mat-500 text-[10px] font-black uppercase tracking-widest mb-3">{event.date} @ {event.time}</div>
                  <h3 className="text-2xl font-black text-white uppercase font-exo leading-tight mb-4 group-hover:text-mat-500 transition-colors">{event.title}</h3>
                  <div className="mt-auto pt-6 border-t border-mat-700 flex justify-between items-center text-[10px] font-black text-gray-500 uppercase">
                     <span>{event.category}</span>
                     <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
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
