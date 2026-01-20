import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Disc, Users, Zap, Music, Calendar, Star, Handshake, MapPin } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';

export const Home: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-mat-900">
      <SEO titleKey="nav.home" descriptionKey="seo.home.description" />

      {/* Hero Section - Optimized for Speed & SEO */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?q=80&w=2000" 
            className="w-full h-full object-cover opacity-30 grayscale"
            alt="Interior Mat32 Hi-Fi Bar Valencia Ruzafa"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-mat-900/95 via-mat-900/30 to-mat-900"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-[16vw] md:text-[12rem] font-black uppercase tracking-tighter text-white leading-none font-exo text-glow select-none">
              MAT<span className="text-mat-500">32</span>
            </h1>
            <div className="flex items-center justify-center gap-4 text-mat-500 font-black uppercase tracking-[0.4em] text-xs md:text-xl -mt-4 md:-mt-8">
               <MapPin size={22} className="animate-bounce" /> VALENCIA <span className="text-gray-700">|</span> RUZAFA
            </div>
          </div>

          <p className="text-gray-300 max-w-3xl mx-auto text-lg md:text-2xl font-light italic mb-12 leading-relaxed">
            "Santuario del sonido analógico y hub comunitario para los amantes del vinilo en el corazón de Valencia."
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center mt-12 animate-fade-in delay-200">
             <Link to="/alquiler-local-eventos-valencia" className="w-full md:w-auto px-12 py-5 bg-mat-500 text-white font-black text-[10px] uppercase tracking-[0.3em] clip-path-slant shadow-2xl hover:bg-mat-400 transition-all flex items-center justify-center gap-3">
                ALQUILER EVENTOS <Calendar size={16} />
             </Link>
             <Link to="/community" className="w-full md:w-auto px-12 py-5 bg-mat-800 border-2 border-mat-700 text-white font-black text-[10px] uppercase tracking-[0.3em] clip-path-slant hover:border-mat-500 transition-all flex items-center justify-center gap-3">
                COMMUNITY HUB <Users size={16} />
             </Link>
          </div>
        </div>
      </section>

      {/* Community / Marketplace Focus */}
      <section className="py-32 bg-mat-950 border-y border-mat-800">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-3 text-mat-500 font-black uppercase tracking-[0.5em] text-[10px]">
                <Zap size={20} className="animate-pulse" /> EL HUB DEL VINILO
              </div>
              <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter font-exo leading-none">
                Cultura Local,<br/>Sonido <span className="text-mat-500">Global.</span>
              </h2>
              <p className="text-gray-400 text-xl font-light italic leading-relaxed">
                En Mat32 fomentamos la comunidad. Publica tus discos, propón intercambios en el marketplace o ven a pinchar en nuestras sesiones de Open Decks.
              </p>
              <div className="flex flex-col sm:flex-row gap-8 pt-4">
                 <Link to="/records" className="flex items-center gap-4 text-white font-black uppercase text-[11px] tracking-widest group">
                    EXPLORAR TIENDA <div className="p-3 bg-mat-800 rounded-full group-hover:bg-mat-500 transition-colors"><ArrowRight size={16} /></div>
                 </Link>
                 <Link to="/community" className="flex items-center gap-4 text-white font-black uppercase text-[11px] tracking-widest group">
                    MERCADILLO CAMBALACHE <div className="p-3 bg-mat-800 rounded-full group-hover:bg-mat-500 transition-colors"><Handshake size={16} /></div>
                 </Link>
              </div>
            </div>
            <div className="relative group">
              <div className="aspect-square bg-mat-800 rounded-[3rem] overflow-hidden border-2 border-mat-700 shadow-2xl">
                 <img src="https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=1200" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" alt="Comunidad Vinilo Valencia" />
                 <div className="absolute inset-0 bg-gradient-to-t from-mat-900/60 to-transparent"></div>
              </div>
              <div className="absolute -bottom-10 -left-10 bg-mat-500 p-8 rounded-[2rem] shadow-2xl hidden md:block">
                 <p className="text-white font-black text-4xl font-exo">+500</p>
                 <p className="text-white/80 font-black uppercase text-[8px] tracking-widest leading-tight">Coleccionistas<br/>Activos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Local Events Venue SEO Section */}
      <section className="py-40 bg-mat-900 text-center relative overflow-hidden">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-mat-500/10 rounded-full blur-[120px] pointer-events-none"></div>
         <div className="container mx-auto px-6 relative z-10">
            <h2 className="text-4xl md:text-8xl font-black text-white uppercase tracking-tighter font-exo mb-8">¿Buscas local para eventos?</h2>
            <p className="text-gray-500 text-xl md:text-3xl italic mb-16 max-w-4xl mx-auto">
              Nuestro espacio en **Ruzafa** es el mejor **local para fiestas privadas y eventos corporativos** en Valencia. Sonido Hi-Fi y ambiente inigualable.
            </p>
            <Link to="/alquiler-local-eventos-valencia" className="inline-block px-16 py-8 bg-mat-500 text-white font-black text-sm uppercase tracking-[0.4em] clip-path-slant shadow-2xl hover:bg-mat-400 transition-all">
               RESERVAR ESPACIO
            </Link>
         </div>
      </section>
    </div>
  );
};