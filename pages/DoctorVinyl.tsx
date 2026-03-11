
import React from 'react';
import { 
  Heart, Zap, Sparkles, ShoppingBag, 
  Settings, Play, ArrowRight, ShieldCheck, 
  Wind, Droplets, Disc
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

export const DoctorVinyl: React.FC = () => {
  const { t } = useLanguage();

  const tips = [
    {
      title: "Control de Humedad",
      desc: "Evita que tus vinilos se comben. Te enseñamos el setup ideal de estantería.",
      icon: <Wind className="text-mat-500" />,
      video: "#"
    },
    {
      title: "Limpieza Profunda",
      desc: "Protocolo de 3 pasos para eliminar el pop y el crackle de discos antiguos.",
      icon: <Droplets className="text-mat-500" />,
      video: "#"
    },
    {
      title: "Ajuste de Cápsula",
      desc: "Calibración de fuerza de apoyo para evitar el desgaste innecesario del surco.",
      icon: <Settings className="text-mat-500" />,
      video: "#"
    }
  ];

  const products = [
    {
      id: 'p1',
      name: 'Mat32 Cleaning Kit',
      price: 25,
      img: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=800',
      category: 'Limpieza'
    },
    {
      id: 'p2',
      name: 'Hi-Fi Outer Sleeves (x50)',
      price: 18,
      img: 'https://images.unsplash.com/photo-1629121289381-08f64ef4c22e?q=80&w=800',
      category: 'Protección'
    }
  ];

  return (
    <div className="min-h-screen bg-mat-900 pb-32">
      <SEO titleKey="Doctor Vinilo | Mantenimiento Hi-Fi" descriptionKey="Aprende a cuidar tus vinilos y equipo de sonido. Tutoriales y productos premium en Valencia." />

      {/* Hero */}
      <div className="bg-mat-950 py-32 border-b border-mat-800 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mat-500/10 border border-mat-500/20 text-mat-500 font-black text-[9px] uppercase tracking-[0.4em] mb-10">
              <ShieldCheck size={14} /> EXPERTO HI-FI SERVICE
           </div>
           <h1 className="text-6xl md:text-[10rem] font-black uppercase tracking-tighter text-white font-exo leading-none mb-6">DR. <span className="text-mat-500">VINILO.</span></h1>
           <p className="text-gray-400 text-lg md:text-2xl italic max-w-3xl mx-auto opacity-80 leading-relaxed">El santuario del mantenimiento analógico. Porque un vinilo bien cuidado suena mejor.</p>
        </div>
        <Disc className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] text-mat-500 opacity-[0.03] animate-spin-slow pointer-events-none" />
      </div>

      <div className="container mx-auto px-6 py-24 max-w-7xl">
        {/* Tutorial Grid */}
        <div className="grid md:grid-cols-3 gap-10 mb-32">
          {tips.map((tip, i) => (
            <div key={i} className="bg-mat-800 border-2 border-mat-700 p-12 rounded-[3.5rem] hover:border-mat-500 transition-all group shadow-2xl relative overflow-hidden">
               <div className="bg-mat-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border border-mat-700 group-hover:scale-110 transition-transform">
                  {tip.icon}
               </div>
               <h3 className="text-2xl font-black text-white uppercase tracking-tighter font-exo mb-4">{tip.title}</h3>
               <p className="text-gray-500 italic text-sm leading-relaxed mb-10">"{tip.desc}"</p>
               <button className="flex items-center gap-2 text-mat-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">
                  VER TUTORIAL <Play size={14} />
               </button>
            </div>
          ))}
        </div>

        {/* Shop Bridge */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
           <div className="max-w-xl">
              <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter font-exo leading-none">EQUIPO <span className="text-mat-500">CURADO.</span></h2>
              <p className="text-gray-500 text-lg mt-6 italic">Solo lo que usamos en la cabina de Mat32. Calidad profesional para tu casa.</p>
           </div>
           <Link to="/records" className="group text-[11px] font-black text-gray-500 hover:text-white uppercase tracking-widest flex items-center gap-3 transition-colors pb-2 border-b-2 border-mat-800 hover:border-mat-500">
              TIENDA COMPLETA <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
           </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
           {products.map(prod => (
             <div key={prod.id} className="bg-mat-800 border border-mat-700 rounded-[2.5rem] overflow-hidden group hover:border-mat-500 transition-all shadow-xl flex flex-col">
                <div className="aspect-square bg-black overflow-hidden relative">
                   <img src={prod.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={prod.name} />
                   <div className="absolute top-4 left-4 bg-mat-900/80 text-mat-500 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{prod.category}</div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                   <h4 className="text-white font-black uppercase text-base tracking-tighter mb-4">{prod.name}</h4>
                   <div className="mt-auto flex justify-between items-center">
                      <span className="text-2xl font-black text-mat-cream font-exo">€{prod.price}</span>
                      <button className="p-4 bg-mat-500 text-white rounded-2xl hover:bg-mat-400 transition-all shadow-lg">
                         <ShoppingBag size={18} />
                      </button>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};
