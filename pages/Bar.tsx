
import React from 'react';
import { Wine, Beer, Martini, Citrus, Coffee, Sparkles, Clock } from 'lucide-react';
import { SEO } from '../components/SEO';
import { BAR_MENU } from '../constants';
import { useLanguage } from '../context/LanguageContext';

export const Bar: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-mat-900 text-mat-cream">
      <SEO titleKey="nav.bar" descriptionKey="bar.hero.desc" />

      {/* Hero Section */}
      <div className="relative bg-mat-800 py-24 md:py-48 border-b border-mat-700 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2000&auto=format&fit=crop" 
            alt="Bar Interior" 
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-mat-900/80 via-mat-900/40 to-mat-900"></div>
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-8 p-1 px-4 rounded-full bg-mat-900/80 border border-mat-500/50 backdrop-blur-md shadow-2xl animate-fade-in">
             <Sparkles className="w-4 h-4 text-mat-500" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-mat-500">Premium Liquids</span>
          </div>
          <h1 className="text-6xl md:text-[10rem] font-black uppercase tracking-tighter text-white mb-6 drop-shadow-2xl font-exo leading-none text-glow animate-fade-in">
            {t('bar.hero.title')}
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-xl md:text-2xl font-light italic leading-relaxed animate-fade-in opacity-80">
            {t('bar.hero.desc')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20 max-w-6xl">
        {/* Intro Text */}
        <div className="text-center mb-24">
           <div className="inline-flex items-center gap-4 text-mat-500 font-black uppercase tracking-[0.5em] text-[10px] mb-4">
             <Martini className="w-5 h-5" /> CURATED MENU
           </div>
           <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8 font-exo">{t('bar.liquids')}</h2>
           <div className="w-32 h-1.5 bg-mat-500 mx-auto rounded-full shadow-lg shadow-mat-500/20"></div>
        </div>

        {/* Menu Grid */}
        <div className="grid md:grid-cols-2 gap-x-16 md:gap-x-32 gap-y-16 md:gap-y-24">
          {BAR_MENU.map((category, idx) => (
            <div key={category.title} className={`space-y-12 animate-fade-in`} style={{ animationDelay: `${idx * 150}ms` }}>
              <div className="flex items-center gap-4 border-b-2 border-mat-800 pb-6 mb-10">
                <div className="p-3 bg-mat-800 border border-mat-700 rounded-xl">
                  {category.title.includes('Gin') && <Citrus className="w-6 h-6 text-mat-500" />}
                  {category.title.includes('Beer') && <Beer className="w-6 h-6 text-mat-500" />}
                  {category.title.includes('Wine') && <Wine className="w-6 h-6 text-mat-500" />}
                  {category.title.includes('Signatures') && <Martini className="w-6 h-6 text-mat-500" />}
                  {category.title.includes('Zero') && <Coffee className="w-6 h-6 text-mat-500" />}
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter font-exo">
                  {category.title}
                </h3>
              </div>

              <div className="space-y-10">
                {category.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="group relative">
                    <div className="flex items-baseline justify-between relative z-10">
                      <span className={`font-black uppercase tracking-widest text-base md:text-lg ${item.highlight ? 'text-mat-500' : 'text-white'} transition-colors group-hover:text-mat-500`}>
                        {item.name}
                      </span>
                      {/* Dotted Leader */}
                      <div className="flex-grow mx-4 border-b-2 border-dotted border-mat-800 relative -top-1.5 opacity-30 group-hover:opacity-60 transition-opacity"></div>
                      <span className="font-exo font-black text-mat-cream text-lg">€{item.price}</span>
                    </div>
                    {item.description && (
                      <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-3 font-sans opacity-60 leading-relaxed italic">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Aperitivo Offer */}
        <div className="mt-40 p-12 md:p-24 bg-mat-800 border-2 border-mat-700 rounded-[3rem] md:rounded-[5rem] text-center relative overflow-hidden group shadow-2xl">
           <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-mat-900 via-mat-500 to-mat-900"></div>
           <div className="relative z-10 space-y-8">
              <div className="inline-flex items-center gap-3 text-mat-500 font-black uppercase tracking-[0.4em] text-[10px] mb-2">
                <Wine className="w-5 h-5" /> SUNSET SESSIONS
              </div>
              <h3 className="text-4xl md:text-8xl font-black text-white uppercase tracking-tighter mb-4 font-exo leading-none">{t('bar.aperitivo.title')}</h3>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <div className="px-8 py-3 bg-mat-900 border border-mat-700 rounded-full flex items-center gap-3 text-mat-500 font-black uppercase text-[10px] tracking-widest">
                   <Clock className="w-4 h-4" /> {t('bar.aperitivo.time')}
                </div>
              </div>
              <p className="text-gray-400 max-w-2xl mx-auto text-xl md:text-2xl font-light italic leading-relaxed">
                 {t('bar.aperitivo.desc')}
              </p>
           </div>
           {/* Decorative BG */}
           <div className="absolute -right-24 -bottom-24 text-mat-900 opacity-20 transform rotate-12 group-hover:scale-110 group-hover:rotate-6 transition-all duration-1000 pointer-events-none">
              <Martini className="w-[40rem] h-[40rem]" />
           </div>
        </div>
      </div>
    </div>
  );
};
