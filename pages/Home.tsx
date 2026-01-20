import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Disc, Users, Zap, Music, Calendar } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';

export const Home: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-mat-900">
      <SEO titleKey="nav.home" descriptionKey="seo.home.description" />

      {/* Hero Section - Optimized for SEO & Visual Impact */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?q=80&w=2000" 
            className="w-full h-full object-cover opacity-50 grayscale transition-opacity duration-1000"
            alt="Interior del bar Hi-Fi Mat32 en Valencia con altavoces Klipsch"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-mat-900/95 via-mat-900/50 to-mat-900"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center animate-fade-in">
          <div className="mb-12">
            <h1 className="text-[24vw] md:text-[18rem] font-black uppercase tracking-tighter text-white leading-none font-exo text-glow select-none">
              MAT<span className="text-mat-500">32</span>
            </h1>
            <p className="text-lg md:text-3xl font-black uppercase tracking-[0.8em] text-gray-500 -mt-8 md:-mt-12">DISCOS BAR VALENCIA</p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center mt-16">
             <Link to="/events" className="w-full md:w-auto px-14 py-7 bg-mat-500 text-white font-black text-[12px] uppercase tracking-[0.3em] clip-path-slant shadow-2xl hover:bg-mat-400 transition-all flex items-center justify-center gap-4">
                AGENDA HI-FI <Calendar size={18} />
             </Link>
             <Link to="/community" className="w-full md:w-auto px-14 py-7 bg-mat-800 border border-mat-700 text-white font-black text-[12px] uppercase tracking-[0.3em] clip-path-slant hover:border-mat-500 transition-all flex items-center justify-center gap-4">
                COMUNIDAD HUB <Users size={18} />
             </Link>
          </div>
        </div>
      </section>

      {/* Social Hub & Marketplace Section */}
      <section className="py-32 border-y border-mat-800 bg-mat-950">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-3 text-mat-500 font-black uppercase tracking-[0.5em] text-[11px]">
                <Zap size={22} className="animate-pulse" /> EL EPICENTRO DEL VINILO
              </div>
              <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter font-exo leading-none">
                Cultura Local,<br/>Vibe <span className="text-mat-500">Analógico.</span>
              </h2>
              <p className="text-gray-400 text-xl md:text-2xl font-light italic leading-relaxed max-w-xl">
                Mat32 no es solo un bar; es el punto de encuentro en Ruzafa para coleccionistas. Intercambia discos en nuestro muro comunitario y descubre rarezas en vivo.
              </p>
              <div className="flex flex-col sm:flex-row gap-8 pt-6">
                 <Link to="/records" className="flex items-center gap-3 text-white font-black uppercase text-[11px] tracking-widest border-b-2 border-mat-500 pb-3 hover:text-mat-500 transition-colors">
                    EXPLORAR TIENDA <ArrowRight size={16} />
                 </Link>
                 <Link to="/community" className="flex items-center gap-3 text-white font-black uppercase text-[11px] tracking-widest border-b-2 border-mat-500 pb-3 hover:text-mat-500 transition-colors">
                    MERCADILLO CAMBALACHE <ArrowRight size={16} />
                 </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-mat-800 rounded-[4rem] overflow-hidden border-2 border-mat-700 shadow-[0_0_60px_rgba(234,88,12,0.1)] group">
                 <img 
                  src="https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=1200" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
                  alt="Colección de vinilos y marketplace en Mat32 Valencia" 
                 />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - SEO Oriented */}
      <section className="py-40">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-16">
            {[
              { 
                icon: <Disc size={32} />, 
                title: "Hi-Fi Listening", 
                desc: "Equipamiento legendario: Altec A7 y Klipsch La Scala para una experiencia sonora pura." 
              },
              { 
                icon: <Music size={32} />, 
                title: "Rare Digging", 
                desc: "Selección curada por expertos en Disco, House, Italo y Jazz Japonés en pleno Ruzafa." 
              },
              { 
                icon: <Zap size={32} />, 
                title: "Open Decks", 
                desc: "Damos voz a la comunidad. Cabina abierta para selectores y coleccionistas locales." 
              }
            ].map((f, i) => (
              <div key={i} className="p-12 bg-mat-800 border-2 border-mat-700 rounded-[3rem] hover:border-mat-500 transition-all group shadow-xl">
                <div className="w-16 h-16 bg-mat-900 border border-mat-700 rounded-2xl flex items-center justify-center text-mat-500 mb-10 group-hover:scale-110 transition-transform shadow-lg shadow-mat-500/10">
                  {f.icon}
                </div>
                <h3 className="text-3xl font-black text-white uppercase mb-6 font-exo tracking-tight">{f.title}</h3>
                <p className="text-gray-500 text-base italic leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};