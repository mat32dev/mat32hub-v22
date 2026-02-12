
import React, { useState, useEffect } from 'react';
import { Wine, Beer, Martini, Citrus, Coffee, Sparkles, Clock, Loader2, Info } from 'lucide-react';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { useLanguage } from '../context/LanguageContext';
import { MenuCategory } from '../types';
import { CachedImage } from '../components/CachedImage';

export const Bar: React.FC = () => {
  const { t } = useLanguage();
  const [menu, setMenu] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showText, setShowText] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await dataService.getBarMenu();
      setMenu(data);
      setLoading(false);
      setTimeout(() => setIsRevealed(true), 100);
      
      // Protocolo de desvanecimiento de textos tras 3 segundos
      const timer = setTimeout(() => setShowText(false), 3000);
      return () => clearTimeout(timer);
    };
    load();
    window.addEventListener('mat32_data_changed', load);
    return () => window.removeEventListener('mat32_data_changed', load);
  }, []);

  return (
    <div className="min-h-screen bg-mat-900 text-mat-cream">
      <SEO titleKey="Bar Hi-Fi & Coctelería Ruzafa | Mat32" descriptionKey="Destilados de alta gama y coctelería de autor en un entorno de alta fidelidad. El punto de encuentro de la cultura musical en Valencia." />

      {/* Dynamic Hero with Cocktail Imagery, Amber Filter and Fade-out text */}
      <div className="relative h-[60vh] md:h-[75vh] flex items-center justify-center border-b border-mat-800 overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <CachedImage 
            src="https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/cd431032-310e-4ccc-c602-68787da5ae00/public" 
            alt="Signature Cocktail Experience" 
            priority
            className={`w-full h-full object-cover transition-all duration-[2000ms] ease-in-out ${isRevealed ? (showText ? 'scale-100 opacity-40 blur-0' : 'scale-105 opacity-65 blur-0') : 'scale-110 opacity-0 blur-xl'}`}
          />
          {/* Amber Filter Overlay for aesthetic consistency */}
          <div className="absolute inset-0 bg-mat-500/20 mix-blend-color pointer-events-none"></div>
          {/* Dynamic Gradient that softens when text fades */}
          <div className={`absolute inset-0 bg-gradient-to-t from-mat-900 via-mat-900/40 to-transparent transition-opacity duration-[2000ms] ${showText ? 'opacity-100' : 'opacity-60'}`}></div>
        </div>

        <div className={`container mx-auto px-6 text-center relative z-10 pt-20 transition-all duration-[1500ms] ease-in-out ${showText ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4 pointer-events-none'}`}>
          <div className="inline-flex items-center gap-2 mb-8 p-1 px-4 rounded-full bg-mat-900/80 border border-mat-500/50 text-mat-500 text-[10px] font-black uppercase tracking-[0.5em]">
             <Sparkles className="w-4 h-4" /> HI-FI LIQUIDS
          </div>
          <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter text-white mb-6 font-exo leading-none text-glow">
            SONIDOS <span className="text-mat-500">LÍQUIDOS.</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-xl md:text-2xl italic font-light leading-relaxed">
            "Destilados curados para acompañar el ritmo analógico."
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-24 max-w-6xl">
        {loading ? (
           <div className="flex justify-center py-40"><Loader2 className="animate-spin text-mat-500 w-12 h-12" /></div>
        ) : (
           <div className="grid md:grid-cols-2 gap-x-24 gap-y-16">
             {menu.map((category, idx) => (
               <div key={idx} className="space-y-8 animate-fade-in">
                 <div className="flex items-center gap-4 border-b border-mat-800 pb-4">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter font-exo">{category.title}</h3>
                    <div className="flex-1 border-b border-mat-800 opacity-10"></div>
                 </div>
                 <div className="space-y-6">
                   {category.items.map((item, i) => (
                     <div key={i} className="group">
                       <div className="flex justify-between items-baseline mb-1">
                         <span className={`font-black uppercase tracking-widest text-base transition-colors ${item.highlight ? 'text-mat-500' : 'text-white group-hover:text-mat-500'}`}>{item.name}</span>
                         <span className="font-exo font-black text-mat-cream text-lg">€{item.price}</span>
                       </div>
                       {item.description && <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest italic opacity-60 leading-relaxed">{item.description}</p>}
                     </div>
                   ))}
                 </div>
               </div>
             ))}
           </div>
        )}

        <div className="mt-20 flex flex-col items-center gap-6">
           <div className="flex items-center gap-2 text-gray-600 text-[10px] font-black uppercase tracking-[0.2em]">
              <Info size={12} /> TODOS LOS PRECIOS INCLUYEN IVA
           </div>
           
           <div className="w-full p-12 md:p-20 bg-mat-800 border-2 border-mat-700 rounded-[3rem] text-center relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-mat-500"></div>
              <div className="relative z-10 space-y-6">
                 <div className="inline-flex items-center gap-3 text-mat-500 font-black uppercase text-[10px] tracking-[0.5em] mb-2"><Clock className="w-5 h-5" /> SUNSET PROTOCOL</div>
                 <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter font-exo leading-none">PROTOCOLO APERITIVO</h3>
                 <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light italic leading-relaxed">Sesiones con discos seleccionados y bebidas especiales. La transición perfecta hacia la noche con el mejor sonido analógico.</p>
              </div>
              <Martini className="absolute -right-20 -bottom-20 w-[24rem] h-[24rem] text-mat-900 opacity-20 transform rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
           </div>
        </div>
      </div>
    </div>
  );
};
