
import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, Info, Clock, Martini, Utensils, Calendar, Wine } from 'lucide-react';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { useLanguage } from '../context/LanguageContext';
import { useSobremesa } from '../components/SobremesaModal';
import { MenuCategory } from '../types';

const MED_TITLE = 'PARA COMPARTIR · MEDITERRÁNEO 360°';

export const Bar: React.FC = () => {
  useLanguage();
  const { open: openSobremesa } = useSobremesa();
  const [menu, setMenu] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroOpen, setHeroOpen] = useState(true);

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

  // Hero auto-colapso a los 3.5s
  useEffect(() => {
    const t = setTimeout(() => setHeroOpen(false), 3500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    document.body.classList.add('theme-paper');
    return () => { document.body.classList.remove('theme-paper'); };
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <SEO titleKey="Carta · Bebidas, vinos, cócteles | MAT32 Ruzafa" descriptionKey="Carta de bebidas en MAT32 Ruzafa: vinos de autor, vermut, cervezas, cócteles y destilados. Bodega seleccionada para acompañar tu sesión." />

      {/* HERO */}
      <section className="container mx-auto px-6 md:px-10 pt-12 md:pt-16 pb-10 hairline-b grain">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="mono-tag flex items-center gap-2" style={{ color: '#c8462a' }}>
              <Sparkles size={12} /> CARTA · /BAR
            </div>
            <h1 className="display mt-3" style={{ fontSize: 'clamp(54px, 9vw, 132px)', lineHeight: 0.85 }}>
              Sonidos<br/><span style={{ color: '#c8462a' }}>líquidos.</span>
            </h1>
            <p className="serif-italic text-2xl text-ink-soft mt-4 max-w-xl">
              Carta de cócteles, vinos y copas. Sin más historia.
            </p>
          </div>
          <div className="hairline p-4 mono-tag !text-[10px]">
            <div className="text-ink-soft">EST. 2022 · RUZAFA</div>
            <div className="mt-1 text-ink">JUE / VIE / SÁB</div>
            <div style={{ color: '#c8462a' }} className="mt-1">19:30 → 02:00</div>
          </div>
        </div>
      </section>

      {/* CATERING EVENTOS CTA */}
      <section className="container mx-auto px-6 md:px-10 py-12 hairline-b">
        <div className="hairline p-6 md:p-8 bg-paper-2 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <div className="mono-tag flex items-center gap-2" style={{ color: '#c8462a' }}>
              <Utensils size={12} /> CATERING EVENTOS · MÍN. 20 PAX
            </div>
            <h2 className="display mt-2 text-3xl md:text-4xl">
              Packs para <span style={{ color: '#c8462a' }}>tu evento.</span>
            </h2>
            <p className="serif-italic text-ink-soft mt-2 max-w-xl">
              Picoteo (6€) · Tabla (12€) · Premium (18€) con opciones de bebida. Depósito 5€/pax descontable.
            </p>
          </div>
          <button onClick={openSobremesa} className="shrink-0 bg-bermellon text-paper px-5 py-3 mono-tag hover:bg-ink transition-colors flex items-center gap-2">
            <Calendar size={14} /> SOLICITAR CATERING
          </button>
        </div>
      </section>

      {/* CARTA DE BEBIDAS */}
      <section className="container mx-auto px-6 md:px-10 py-16 max-w-6xl">
        <div className="mb-10">
          <div className="mono-tag flex items-center gap-2" style={{ color: '#c8462a' }}>
            <Wine size={12} /> NUESTRA BODEGA · CÓCTELES · DESTILADOS
          </div>
          <h2 className="display mt-2" style={{ fontSize: 'clamp(40px, 6vw, 84px)', lineHeight: 0.9 }}>
            Líquidos.
          </h2>
          <p className="serif-italic text-ink-soft mt-3 text-base md:text-lg max-w-xl">
            En vinos: copa / botella. Bodega seleccionada para acompañar la carta.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-bermellon w-8 h-8" /></div>
        ) : (
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
            {menu.filter(c => c.title !== MED_TITLE).map((category, idx) => (
              <div key={idx} className="space-y-5">
                <h3 className="display text-2xl hairline-b pb-2">{category.title}</h3>
                <div className="space-y-4">
                  {category.items.map((item, i) => (
                    <div key={i} className="group">
                      <div className="flex justify-between items-baseline gap-3">
                        <span className={`display text-lg ${item.highlight ? 'text-bermellon' : 'text-ink group-hover:text-bermellon transition-colors'}`}>{item.name}</span>
                        <span className="display text-lg" style={{ color: '#c8462a' }}>€{item.price}</span>
                      </div>
                      {item.description && <p className="serif-italic text-ink-soft text-sm mt-1 leading-snug">{item.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 flex flex-col items-center gap-6">
          <div className="mono-tag text-ink-soft flex items-center gap-2">
            <Info size={12} /> TODOS LOS PRECIOS INCLUYEN IVA
          </div>

          <div className="w-full hairline p-10 md:p-14 bg-ink text-paper relative overflow-hidden">
            <div className="mono-tag flex items-center gap-2 mb-3" style={{ color: '#d8ff5a' }}>
              <Clock size={14} /> SUNSET PROTOCOL
            </div>
            <h3 className="display text-paper" style={{ fontSize: 'clamp(28px, 4vw, 56px)', lineHeight: 0.9 }}>
              Protocolo aperitivo.
            </h3>
            <p className="serif-italic text-paper/70 mt-3 max-w-2xl text-lg">
              Sesiones con discos seleccionados y bebidas especiales. La transición perfecta hacia la noche con el mejor sonido analógico.
            </p>
            <Martini className="absolute -right-12 -bottom-16 w-72 h-72 text-paper/5 transform rotate-12 pointer-events-none" />
          </div>
        </div>
      </section>
    </div>
  );
};
