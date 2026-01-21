
import React, { useState, useEffect } from 'react';
import { Wine, Beer, Martini, Citrus, Coffee, Sparkles, Clock, Loader2, Info } from 'lucide-react';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { useLanguage } from '../context/LanguageContext';
import { MenuCategory } from '../types';

export const Bar: React.FC = () => {
  const { t } = useLanguage();
  const [menu, setMenu] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await dataService.getBarMenu();
      setMenu(data);
      setLoading(false);
    };
    load();
    window.addEventListener('mat32_data_changed', load);
    return () => window.removeEventListener('mat32_data_changed', load);
  }, []);

  return (
    <div className="min-h-screen bg-mat-900 text-mat-cream">
      <SEO titleKey="nav.bar" descriptionKey="bar.hero.desc" />

      {/* Hero */}
      <div className="relative bg-mat-800 py-24 md:py-48 border-b border-mat-700 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2000" 
            alt="Bar Interior Mat32" 
            className="w-full h-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-mat-900/90 to-mat-900"></div>
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-8 p-1 px-4 rounded-full bg-mat-900/80 border border-mat-500/50 text-mat-500 text-[10px] font-black uppercase tracking-[0.5em] animate-fade-in">
             <Sparkles className="w-4 h-4" /> HI-FI LIQUIDS
          </div>
          <h1 className="text-6xl md:text-[10rem] font-black uppercase tracking-tighter text-white mb-6 font-exo leading-none text-glow animate-fade-in">
            {t('bar.hero.title')}
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-xl italic opacity-80 leading-relaxed">
            {t('bar.hero.desc')}
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
                       {item.description && <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest italic opacity-60">{item.description}</p>}
                     </div>
                   ))}
                 </div>
               </div>
             ))}
           </div>
        )}

        {/* Footer Note and Promo */}
        <div className="mt-20 flex flex-col items-center gap-6">
           <div className="flex items-center gap-2 text-gray-600 text-[10px] font-black uppercase tracking-[0.2em]">
              <Info size={12} /> TODOS LOS PRECIOS INCLUYEN IVA
           </div>
           
           <div className="w-full p-12 md:p-20 bg-mat-800 border-2 border-mat-700 rounded-[3rem] text-center relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-mat-500"></div>
              <div className="relative z-10 space-y-6">
                 <div className="inline-flex items-center gap-3 text-mat-500 font-black uppercase text-[10px] tracking-[0.5em] mb-2"><Clock className="w-5 h-5" /> SUNSET PROTOCOL</div>
                 <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter font-exo leading-none">{t('bar.aperitivo.title')}</h3>
                 <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light italic leading-relaxed">{t('bar.aperitivo.desc')}</p>
              </div>
              <Martini className="absolute -right-20 -bottom-20 w-[24rem] h-[24rem] text-mat-900 opacity-20 transform rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
           </div>
        </div>
      </div>
    </div>
  );
};
