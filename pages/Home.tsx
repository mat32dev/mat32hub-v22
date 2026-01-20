
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Disc, Users, Zap, Music, Calendar, Star, Handshake, MapPin, Headphones, Martini } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';

export const Home: React.FC = () => {
  const { t } = useLanguage();

  const services = [
    {
      title: "THE CRATE",
      desc: "Nuestra tienda curada de vinilos. Rarezas y clásicos.",
      link: "/records",
      icon: <Disc size={32} className="text-mat-500" />,
      img: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=800"
    },
    {
      title: "OPEN DECKS",
      desc: "La cabina es tuya. Envía tu mix y pincha en Mat32.",
      link: "/open-decks",
      icon: <Headphones size={32} className="text-mat-500" />,
      img: "https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?q=80&w=800"
    },
    {
      title: "ALQUILER",
      desc: "Local exclusivo para eventos privados en Ruzafa.",
      link: "/alquiler-local-eventos-valencia",
      icon: <Martini size={32} className="text-mat-500" />,
      img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800"
    }
  ];

  return (
    <div className="bg-mat-900">
      <SEO titleKey="nav.home" descriptionKey="seo.home.description" />

      {/* Hero Section - Impacto Visual */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2000" 
            className="w-full h-full object-cover opacity-20 grayscale"
            alt="Mat32 Hi-Fi Bar Valencia Ruzafa"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-mat-900/95 via-mat-900/20 to-mat-900"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-[18vw] md:text-[14rem] font-black uppercase tracking-tighter text-white leading-none font-exo text-glow select-none">
              MAT<span className="text-mat-500">32</span>
            </h1>
            <div className="flex items-center justify-center gap-4 text-mat-500 font-black uppercase tracking-[0.6em] text-[10px] md:text-xl -mt-4 md:-mt-8">
               <MapPin size={22} className="animate-bounce" /> VALENCIA <span className="text-gray-800">|</span> RUZAFA
            </div>
          </div>

          <p className="text-gray-300 max-w-3xl mx-auto text-lg md:text-3xl font-light italic mb-12 leading-relaxed">
            "Santuario Hi-Fi, Tienda de Discos y Espacio de Eventos en el corazón de Valencia."
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center mt-12">
             <Link to="/contact" className="w-full md:w-auto px-16 py-6 bg-mat-500 text-white font-black text-xs uppercase tracking-[0.4em] clip-path-slant shadow-2xl hover:bg-mat-400 transition-all">
                RESERVAR MESA
             </Link>
             <Link to="/alquiler-local-eventos-valencia" className="w-full md:w-auto px-16 py-6 bg-mat-800 border-2 border-mat-700 text-white font-black text-xs uppercase tracking-[0.4em] clip-path-slant hover:border-mat-500 transition-all">
                ALQUILER LOCAL
             </Link>
          </div>
        </div>
      </section>

      {/* Grid de Servicios Destacados (La "Señal" SEO) */}
      <section className="py-32 bg-mat-950 border-y border-mat-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
             <h2 className="text-4xl md:text-8xl font-black text-white uppercase tracking-tighter font-exo mb-4">EXPLORA EL <span className="text-mat-500">HUB.</span></h2>
             <p className="text-gray-500 text-xl italic">Todo lo que ocurre en Calle Matías Perelló 32.</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-10">
            {services.map((s, i) => (
              <Link key={i} to={s.link} className="group relative aspect-[4/5] overflow-hidden rounded-[3rem] border-2 border-mat-800 hover:border-mat-500 transition-all">
                 <img src={s.img} className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" alt={s.title} />
                 <div className="absolute inset-0 bg-gradient-to-t from-mat-950 via-transparent to-transparent"></div>
                 <div className="absolute bottom-10 left-10 right-10">
                    <div className="mb-4">{s.icon}</div>
                    <h3 className="text-4xl font-black text-white font-exo mb-2">{s.title}</h3>
                    <p className="text-gray-400 text-sm italic mb-6 leading-relaxed">{s.desc}</p>
                    <div className="flex items-center gap-2 text-[10px] font-black text-mat-500 uppercase tracking-widest">
                       ACCEDER <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                    </div>
                 </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Community / Marketplace Focus */}
      <section className="py-32 bg-mat-900 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-mat-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-3 text-mat-500 font-black uppercase tracking-[0.5em] text-[10px]">
                <Zap size={20} className="animate-pulse" /> COMUNIDAD VINILO VALENCIA
              </div>
              <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter font-exo leading-none">
                Cambalache & <span className="text-mat-500">Culture.</span>
              </h2>
              <p className="text-gray-400 text-xl font-light italic leading-relaxed">
                Únete al Hub. Publica tus discos, propón intercambios en el marketplace o simplemente ven a disfrutar del sonido analógico puro.
              </p>
              <div className="flex flex-col sm:flex-row gap-8 pt-4">
                 <Link to="/community" className="px-10 py-5 bg-mat-500 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-mat-400 shadow-xl transition-all">
                    ENTRAR AL HUB
                 </Link>
                 <Link to="/records" className="px-10 py-5 bg-mat-800 border border-mat-700 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:border-mat-500 transition-all">
                    VER TIENDA
                 </Link>
              </div>
            </div>
            <div className="relative group">
              <div className="aspect-square bg-mat-800 rounded-[4rem] overflow-hidden border-2 border-mat-700 shadow-2xl">
                 <img src="https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=1200" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" alt="Comunidad Vinilo Valencia" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
