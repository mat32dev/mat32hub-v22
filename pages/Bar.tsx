
import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, Info, Clock, Martini, Calendar, Wine } from 'lucide-react';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { useLanguage } from '../context/LanguageContext';
import { useSobremesa } from '../components/SobremesaModal';
import { MenuCategory } from '../types';

export const Bar: React.FC = () => {
  const { t } = useLanguage();
  const { open: openSobremesa } = useSobremesa();
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


  useEffect(() => {
    document.body.classList.add('theme-paper');
    return () => { document.body.classList.remove('theme-paper'); };
  }, []);

  const MED_TITLE = t('bar.med_title');

  return (
    <div className="min-h-screen bg-paper text-ink">
      <SEO titleKey="Bar Hi-Fi · Happy Hour & Aperitivo Terraza en Ruzafa | MAT32 Valencia" descriptionKey="Bar Hi-Fi en Ruzafa, Valencia. Happy Hour 19h–22h: cerveza 1×3€, 2×5€, tabla jamón y queso. Carta Mediterráneo 360° (Italia · España · Marruecos), vinos de autor, cócteles. Reserva mesa gratis, grupos 2-12. Sonido Altec A7." />

      {/* HERO */}
      <section className="container mx-auto px-6 md:px-10 pt-12 md:pt-16 pb-10 hairline-b grain">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="mono-tag flex items-center gap-2" style={{ color: '#c8462a' }}>
              <Sparkles size={12} /> CARTA · /BAR
            </div>
            <h1 className="display mt-3" style={{ fontSize: 'clamp(54px, 9vw, 132px)', lineHeight: 0.85 }}>
              {t('bar.hero.h1_pre')}<br/><span style={{ color: '#c8462a' }}>{t('bar.hero.h1_color')}</span>
            </h1>
            <div className="mono-tag mt-2 text-ink-soft">BAR HI-FI · DANCEHALL · RUZAFA · VALENCIA</div>
            <p className="serif-italic text-2xl text-ink-soft mt-4 max-w-xl">
              {t('bar.hero.subtitle')}
            </p>
          </div>
          <div className="hairline p-4 mono-tag !text-[10px]">
            <div className="text-ink-soft">EST. 2022 · RUZAFA</div>
            <div className="mt-1 text-ink">{t('bar.hero.days')}</div>
            <div style={{ color: '#c8462a' }} className="mt-1">19:30 → 02:00</div>
          </div>
        </div>
      </section>

      {/* RESERVAR MESA CTA */}
      <section className="container mx-auto px-6 md:px-10 py-12 hairline-b">
        <div className="hairline p-6 md:p-8 bg-paper-2 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <div className="mono-tag flex items-center gap-2" style={{ color: '#c8462a' }}>
              <Calendar size={12} /> SOBREMESA · RUZAFA
            </div>
            <h2 className="display mt-2 text-3xl md:text-4xl">
              {t('bar.sobremesa.title_pre')}<span style={{ color: '#c8462a' }}>{t('bar.sobremesa.title_color')}</span>
            </h2>
            <p className="serif-italic text-ink-soft mt-2 max-w-xl">
              {t('bar.sobremesa.desc')}
            </p>
          </div>
          <button onClick={openSobremesa} className="shrink-0 bg-bermellon text-paper px-5 py-3 mono-tag hover:bg-ink transition-colors flex items-center gap-2">
            <Calendar size={14} /> {t('bar.sobremesa.cta')}
          </button>
        </div>
      </section>

      {/* ─── HAPPY HOUR / DUAL PRICING BANNER ─── */}
      <section className="bg-ink text-paper hairline-b">
        <div className="container mx-auto px-6 md:px-10 py-6 md:py-8">
          <div className="grid md:grid-cols-2 gap-6 md:gap-10">
            {/* DÍA / HAPPY HOUR - terminal panel */}
            <div className="window-panel-ink">
              <div className="window-titlebar">
                <span>DÍA · 19H–22H</span>
                <span style={{ color: '#09aea1' }}>HAPPY HOUR</span>
              </div>
              <div className="window-body">
                <div className="flex items-center justify-between mb-3">
                  <span className="mono-tag">Terraza · Ju–Sá</span>
                </div>
                <ul className="space-y-3">
                  <li className="flex justify-between text-paper mono-tag" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                    <span>Cerveza 33cl / Doble</span><span style={{ color: '#09aea1' }}>3 €</span>
                  </li>
                  <li className="flex justify-between text-paper mono-tag" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                    <span>Refrescos</span><span style={{ color: '#09aea1' }}>3 €</span>
                  </li>
                  <li className="flex justify-between text-paper mono-tag" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                    <span>Copas & Cócteles</span><span style={{ color: '#09aea1' }}>-1 € vs noche</span>
                  </li>
                  <li className="flex justify-between text-paper mono-tag pt-3" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                    <span>Tabla jamón/queso</span><span style={{ color: '#09aea1' }}>Media / Entera</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* NOCHE - terminal panel */}
            <div className="window-panel">
              <div className="window-titlebar">
                <span>NOCHE · 22H–02H</span>
                <span style={{ color: '#09aea1' }}>SESIONES DJ</span>
              </div>
              <div className="window-body">
                <div className="flex items-center justify-between mb-3">
                  <span className="mono-tag text-ink">Sin entrada · Consumo mínimo 5 €</span>
                </div>
                <ul className="space-y-3">
                  <li className="flex justify-between text-ink mono-tag" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                    <span>Cerveza / Refrescos</span><span style={{ color: '#09aea1' }}>4 €</span>
                  </li>
                  <li className="flex justify-between text-ink mono-tag" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                    <span>Copas & Cócteles</span><span style={{ color: '#09aea1' }}>Precio estándar</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <p className="serif-italic mt-5 text-center text-paper/50 text-sm max-w-2xl mx-auto">
            Precios IVA incluido. Consumición mínima obligatoria 5 € en sesiones nocturnas.
          </p>
        </div>
      </section>

      {/* CARTA DE BEBIDAS */}
      <section className="container mx-auto px-6 md:px-10 py-16 max-w-6xl">
        <div className="mb-10">
          <div className="mono-tag flex items-center gap-2" style={{ color: '#c8462a' }}>
            <Wine size={12} /> {t('bar.cellar.tag')}
          </div>
          <h2 className="display mt-2" style={{ fontSize: 'clamp(40px, 6vw, 84px)', lineHeight: 0.9 }}>
            {t('bar.cellar.h2')}
          </h2>
          <p className="serif-italic text-ink-soft mt-3 text-base md:text-lg max-w-xl">
            {t('bar.cellar.desc')}
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
            <Info size={12} /> {t('bar.vat')}
          </div>

          <div className="w-full hairline p-10 md:p-14 bg-ink text-paper relative overflow-hidden">
            <div className="mono-tag flex items-center gap-2 mb-3" style={{ color: '#d8ff5a' }}>
              <Clock size={14} /> SUNSET PROTOCOL
            </div>
            <h3 className="display text-paper" style={{ fontSize: 'clamp(28px, 4vw, 56px)', lineHeight: 0.9 }}>
              {t('bar.protocol.h3')}
            </h3>
            <p className="serif-italic text-paper/70 mt-3 max-w-2xl text-lg">
              {t('bar.protocol.desc')}
            </p>
            <Martini className="absolute -right-12 -bottom-16 w-72 h-72 text-paper/5 transform rotate-12 pointer-events-none" />
          </div>
        </div>
      </section>
    </div>
  );
};
