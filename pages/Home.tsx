
import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Instagram } from 'lucide-react';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { Event, VinylRecord } from '../types';
import { CachedImage } from '../components/CachedImage';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { CalendarPolaroid } from '../components/CalendarPolaroid';
import { InstagramEmbed } from '../components/InstagramEmbed';
import { INSTAGRAM_FEATURED_POSTS } from '../constants';
import { useLanguage } from '../context/LanguageContext';

// ─────────────────────────────────────────────────────────────
// HOME · RESTYLE v2 · ALMACÉN CALIENTE + GUIÑO CLAUDIA
// Tokens: paper #f1e8d8 / ink #1a1611 / bermellón #c8462a / claudia #d8ff5a
// Fonts:  Archivo Black (display) · Fraunces italic (serif) · DM Mono (mono) · Exo 2 (wordmark)
// ─────────────────────────────────────────────────────────────

const HoyPanel: React.FC = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const i = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(i); }, []);
  const day = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  const openDay = [4, 5, 6].includes(day); // JUE=4, VIE=5, SÁB=6
  const isOpen = openDay && mins >= 19 * 60 + 30 && mins < 26 * 60;
  const dayLabel = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'][day];
  const dateLabel = `${dayLabel} ${String(now.getDate()).padStart(2, '0')} ${['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'][now.getMonth()]}`;

  const dayConfig: Record<number, { label: string; title: string; sub: string; color: string; time: string }> = {
    4: { label: 'JUE', title: 'OPEN DECKS', sub: 'Space · propuestas abiertas', color: '#d8ff5a', time: '19:30' },
    5: { label: 'VIE', title: 'ELECTRIC AVENUE', sub: 'Electrónica · baile', color: '#c8462a', time: '22:00' },
    6: { label: 'SÁB', title: 'SELECTORS', sub: 'Ecléctico · escucha', color: '#6366f1', time: '22:00' },
  };
  const todayConfig = dayConfig[day as keyof typeof dayConfig];
  const nextOpenDay = [4, 5, 6].find(d => d >= day) || 4;
  const nextConfig = dayConfig[nextOpenDay];

  return (
    <div className="window-panel-ink window-body-compact flex flex-col justify-between" style={{ minHeight: '280px' }}>
      <div className="window-titlebar">
        <span>HOY · {dateLabel}</span>
        <span>
          {isOpen
            ? <span style={{ color: '#d8ff5a' }}>EN DIRECTO ●</span>
            : <span style={{ color: '#858585' }}>CERRADO</span>}
        </span>
      </div>
      <div className="window-body py-5">
        <div className="mono-tag" style={{ color: '#c8462a' }}>{openDay ? 'PROGRAMA DE HOY' : 'PRÓXIMA APERTURA'}</div>
        <div className="display text-white mt-2" style={{ fontSize: 'clamp(28px, 4vw, 42px)', lineHeight: 0.95 }}>
          {openDay && todayConfig ? (
            <>
              {todayConfig.title}
              {todayConfig.label === 'VIE' ? null : <> <br/>EN VINILO</>}
            </>
          ) : nextConfig ? (
            <>
              {nextConfig.label}<br/>
              {nextConfig.time}
            </>
          ) : (
            <>JUEVES<br/>19:30</>
          )}
        </div>
        <p className="serif-italic text-paper/85 mt-2 text-base">
          {openDay && todayConfig
            ? todayConfig.sub
            : 'Jueves Open Decks · Viernes Electric Avenue · Sábado Selectors'}
        </p>
        <div className="hairline-ink-t pt-3 mono-tag flex justify-between items-center text-[11px]">
          <span>{openDay && todayConfig ? `${todayConfig.time} → 02:00` : '19:30 → 02:00'}</span>
          <span style={{ color: '#09aea1' }}>ENTRADA LIBRE</span>
        </div>
      </div>
    </div>
  );
};

const Pilar: React.FC<{ label: string; title: string; sub: string; href: string; tone?: 'paper' | 'paper2' | 'ink' | 'accent' }> = ({ label, title, sub, href, tone = 'paper' }) => {
  const bg = tone === 'ink' ? 'window-panel-ink' : tone === 'accent' ? 'bg-bermellon text-paper' : 'window-panel';
  const accent = tone === 'ink' || tone === 'accent' ? '#d8ff5a' : '#09aea1';
  return (
    <Link to={href} className={`group block ${bg} transition-colors hover:opacity-90`} style={{ minHeight: '260px' }}>
      <div className="window-titlebar">
        <span>{label}</span>
      </div>
      <div className={tone === 'ink' ? 'window-body' : 'window-body window-body-compact'}>
        <div className="display mt-1" style={{ fontSize: 'clamp(28px, 3.2vw, 44px)', lineHeight: 0.95 }}>{title}</div>
        <p className="serif-italic mt-3 text-base leading-snug opacity-80">{sub}</p>
        <div className="mono-tag mt-4 flex items-center gap-2 group-hover:translate-x-1 transition-transform">
          ENTRAR <ArrowRight size={14} />
        </div>
      </div>
    </Link>
  );
};

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [allUpcoming, setAllUpcoming] = useState<Event[]>([]);
  const [bookedDays, setBookedDays] = useState<Set<string>>(new Set());
  const [allRecords, setAllRecords] = useState<VinylRecord[]>([]);

  useEffect(() => {
    document.body.classList.add('theme-paper');
    return () => { document.body.classList.remove('theme-paper'); };
  }, []);

  useEffect(() => {
    const load = async () => {
      const [evts, recs] = await Promise.all([dataService.getEvents(), dataService.getRecords()]);
      const today = new Date(); today.setHours(0,0,0,0);
      const future = evts.filter(e => new Date(e.date) >= today)
        .sort((a,b) => `${a.date} ${a.time||'00:00'}`.localeCompare(`${b.date} ${b.time||'00:00'}`));
      setAllUpcoming(future);
      setUpcomingEvents(future.slice(0,3));
      setAllRecords(recs);
      // Bookings de Google Calendar (no bloquea si falla)
      dataService.getCalendarBookings()
        .then(b => setBookedDays(new Set(b.days || [])))
        .catch(() => {});
    };
    load();
    window.addEventListener('mat32_data_changed', load);
    return () => window.removeEventListener('mat32_data_changed', load);
  }, []);

  const topPicks = useMemo(() => {
    return [...allRecords]
      .sort((a,b) => parseFloat(String(b.price)||'0') - parseFloat(String(a.price)||'0'))
      .slice(0, 6);
  }, [allRecords]);

  // Highlights: próximos 3 eventos de la API (no hardcoded)
  const highlights = useMemo(() => upcomingEvents.slice(0, 3), [upcomingEvents]);

  // Próximo evento: SIEMPRE el primero futuro de la agenda completa
  const nextEvent = useMemo(() => allUpcoming[0] || null, [allUpcoming]);

  return (
    <div className="bg-paper text-ink min-h-screen">
      <SEO titleKey="home.seo.title" descriptionKey="home.seo.desc" />
      <WhatsAppButton defaultMessage="Hola MATi, una pregunta desde mat32.com" />

      {/* ─── HERO · slide 04 (back on top) ─── */}
      <section className="grain hairline-b">
        <div className="container mx-auto px-6 md:px-10 pt-12 md:pt-16 pb-10">
          <div className="grid md:grid-cols-[1.55fr_1fr] gap-8 md:gap-12 items-stretch">
            <div className="flex flex-col">
              <div className="mono-tag" style={{ color: '#c8462a' }}>EST. 2022 · MATÍAS PERELLÓ 32 · 46005</div>
              <h1 className="display mt-4" style={{ fontSize: 'clamp(54px, 9vw, 132px)', lineHeight: 0.85 }}>
                DJs CLUB,<br/>DISCOS<br/>Y <span style={{ color: '#c8462a' }}>BARRA.</span>
              </h1>
              <div className="mono-tag mt-2 text-ink-soft">RUZAFA · VALENCIA</div>
              <p className="serif-italic mt-6 text-xl md:text-2xl text-ink-soft max-w-2xl leading-snug">
                {t('home.hero.intro')}
              </p>
              <div className="flex flex-wrap gap-2 mt-8">
                <Link to="/alquiler-local-eventos-horas-valencia#booking-form" className="bg-bermellon text-paper px-5 py-3 mono-tag hover:bg-ink transition-colors">
                  SOLICITAR FECHA →
                </Link>
                <Link to="/gallery" className="hairline px-5 py-3 mono-tag hover:bg-ink hover:text-paper transition-colors">
                  VER LA SALA
                </Link>
                <Link to="/events" className="hairline px-5 py-3 mono-tag hover:bg-ink hover:text-paper transition-colors">
                  AGENDA
                </Link>
              </div>
            </div>
            <HoyPanel />
          </div>
        </div>
      </section>

      {/* ─── PRÓXIMO EVENTO · SIEMPRE VISIBLE ─── */}
      {nextEvent && (
        <section className="hairline-b">
          <Link to="/events" className="block group">
            <div className="container mx-auto px-6 md:px-10 py-10 md:py-14">
              <div className="window-panel">
                <div className="window-titlebar"><span>PRÓXIMO</span></div>
                <div className="window-body">
                  <div className="grid md:grid-cols-[1fr_auto] md:items-center gap-6">
                    <div>
                      <div className="mono-tag inline-flex items-center gap-2" style={{ color: '#09aea1' }}>
                        <span className="inline-block w-2 h-2 rounded-full bg-[#09aea1] animate-pulse" /> PRÓXIMO EVENTO
                      </div>
                      <h2 className="display mt-4" style={{ fontSize: 'clamp(42px, 7vw, 96px)', lineHeight: 0.9 }}>
                        {nextEvent.title}
                      </h2>
                      <div className="mono-data mt-4 flex flex-wrap gap-x-6 gap-y-2 text-ink-soft">
                        <span>{new Date(nextEvent.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                        <span>{nextEvent.time || '22:00 → 02:00'}</span>
                        <span style={{ color: '#09aea1' }}>{nextEvent.vibe?.[0] || nextEvent.category || 'DJ Set'}</span>
                      </div>
                    </div>
                    {nextEvent.imageUrl && (
                      <div className="w-40 md:w-52 aspect-square shrink-0 hairline overflow-hidden group-hover:scale-[1.02] transition-transform">
                        <img src={nextEvent.imageUrl} alt={nextEvent.title} loading="lazy" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <div className="mono-tag mt-6 inline-flex items-center gap-2 hairline-ink-b pb-1 group-hover:text-bermellon transition-colors">
                    VER DETALLE <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ─── DESTACADOS · PRÓXIMAS SESIONES ─── */}
      <section className="bg-paper-2 hairline-b">
        <div className="container mx-auto px-6 md:px-10 py-16 md:py-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <div className="mono-tag" style={{ color: '#c8462a' }}>DESTACADOS</div>
              <h2 className="display mt-3" style={{ fontSize: 'clamp(40px, 6vw, 84px)', lineHeight: 0.9 }}>
                Tres noches<br/>en <span style={{ color: '#c8462a' }}>directo.</span>
              </h2>
            </div>
            <Link to="/events" className="mono-tag hairline-ink-b pb-1 inline-flex items-center gap-2 hover:text-bermellon transition-colors self-start md:self-end">
              TODA LA AGENDA <ArrowRight size={14} />
            </Link>
          </div>

          {highlights.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {highlights.map(h => (
                <Link key={h.id} to="/events"
                  className="group window-panel shadow-[0_18px_40px_rgba(0,0,0,0.14),0_6px_14px_rgba(0,0,0,0.08)]">
                  <div className="window-titlebar">
                    <span className="mono-data" style={{ color: '#09aea1' }}>
                      {new Date(h.date).toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase()} 
                      {new Date(h.date).getDate()} 
                      {new Date(h.date).toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()}
                    </span>
                    <span className="opacity-60">{h.time || '22:00 → 02:00'}</span>
                  </div>
                  <div className="window-body">
                    <div className="aspect-square overflow-hidden bg-ink-2 mb-3">
                      <img src={h.imageUrl || `/flyers-jpg/e_${h.id}.svg`} alt={h.title} loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="display mt-1" style={{ fontSize: 'clamp(26px, 3vw, 36px)', lineHeight: 0.95 }}>{h.title}</div>
                    <div className="mono-tag mt-1" style={{ color: '#09aea1' }}>{h.vibe?.[0] || h.category || 'DJ Set'}</div>
                    <p className="serif-italic mt-3 text-sm text-ink-soft leading-snug">{h.description}</p>
                    <div className="mono-tag mt-5 flex items-center justify-between !text-[10px] pt-3">
                      <span style={{ color: '#09aea1' }}>ENTRADA LIBRE</span>
                      <span className="inline-flex items-center gap-1 group-hover:text-bermellon transition-colors">
                        AGENDA <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="hairline p-10 text-center">
              <p className="serif-italic text-ink-soft text-lg">Programa en preparación. Vuelve pronto.</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── 4 PILARES · slide 04 bottom strip ─── */}
      <section className="hairline-b">
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-6 md:px-10">
          <Pilar label="ESPACIO · NOCHE" title={'Tu evento\naquí'} sub="Colectivos, promotores, sellos. Calendario libre y cabina vinyl-friendly."
                                 href="/alquiler-local-eventos-horas-valencia" tone="accent" />
          <Pilar label="AGENDA · NOCHE" title={'Lo que\nsuena'} sub="Residencias, takeovers e invitados. Soul, jazz, house, ambient."
                 href="/events" tone="paper" />
          <Pilar label="DISCOS · DÍA" title={'El\nalmacén'} sub="Crate digger, marketplace y Digger Radar para miembros."
                 href="/records" tone="paper2" />
          <Pilar label="RADIO · 24/7" title={'Allegretto!\nradio'} sub="Tracks de cabina en streaming. Vinyl rips, sin lista de reproducción."
                 href="/radio" tone="ink" />
        </div>
      </section>

      {/* ─── COLABORACIONES NOCTURNAS · CTA ─── */}
      <section className="bg-ink text-paper hairline-b">
        <div className="container mx-auto px-6 md:px-10 py-16 md:py-20">
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-10 md:gap-16 items-center">
            <div>
              <div className="mono-tag" style={{ color: '#d8ff5a' }}>COLABORACIONES · NOCHE</div>
              <h2 className="display mt-4" style={{ fontSize: 'clamp(40px, 6vw, 84px)', lineHeight: 0.9 }}>
                Tu colectivo,<br/>nuestra cabina.
              </h2>
              <p className="serif-italic mt-6 text-xl md:text-2xl text-paper/70 max-w-xl leading-snug">
                Viernes y sábados programamos nuestra línea: House, Disco, Boogie, Electronic.
                Buscamos colectivos y DJs para noches propias o residencias regulares.
              </p>
              <p className="serif-italic mt-4 text-lg text-paper/50 max-w-xl leading-snug">
                También abrimos otros días para vuestras fiestas — sin condición de estilo.
                Open Decks (jueves 19:30–22:00) para probar la cabina y conocernos.
              </p>
              <div className="flex flex-wrap gap-2 mt-10">
                <a href="https://wa.me/34622190802?text=Hola%20MAT32%2C%20queremos%20proponer%20una%20colaboraci%C3%B3n%20nocturna%20con%20nuestro%20colectivo"
                   target="_blank" rel="noopener"
                   className="bg-bermellon text-paper px-5 py-3 mono-tag hover:bg-paper hover:text-ink transition-colors flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  PROPONER COLABORACIÓN
                </a>
                <Link to="/events" className="hairline px-5 py-3 mono-tag hover:bg-paper hover:text-ink transition-colors">
                  VER PROGRAMACIÓN ACTUAL
                </Link>
              </div>
            </div>
            <p className="serif-italic text-paper/50 text-sm text-center mt-4">
              Trae tu sonido. Nosotros ponemos la sala, el sonido y la barra.
            </p>
          </div>
        </div>
      </section>

      {/* ─── DISPONIBILIDAD EN VIVO · POLAROID (slide 10) ─── */}
      <section className="bg-paper-2 hairline-b">
        <div className="container mx-auto px-6 md:px-10 py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
            <div>
              <h2 className="display" style={{ fontSize: 'clamp(38px, 6vw, 80px)', lineHeight: 0.9 }}>
                Calendario <span style={{ color: '#c8462a' }}>libre.</span>
              </h2>
              <p className="serif-italic mt-5 text-lg md:text-xl text-ink-soft leading-snug max-w-xl">
                Sincronizado con la agenda real. Mira los huecos disponibles para tu evento y escríbenos. Respondemos en 24h con presupuesto y rider técnico.
              </p>
              <div className="flex flex-wrap gap-2 mt-8">
                <Link to="/events" className="bg-bermellon text-paper px-5 py-3 mono-tag hover:bg-ink transition-colors">
                  SOLICITAR FECHA →
                </Link>
                <Link to="/events" className="hairline px-5 py-3 mono-tag hover:bg-ink hover:text-paper transition-colors">
                  VER AGENDA PÚBLICA
                </Link>
              </div>
            </div>

            <CalendarPolaroid events={allUpcoming} bookedDays={bookedDays} bookingMode />
          </div>
        </div>
      </section>

      {/* ─── PRÓXIMOS EVENTOS ─── */}
      <section className="hairline-b">
        <div className="container mx-auto px-6 md:px-10 py-16 md:py-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <div className="mono-tag" style={{ color: '#c8462a' }}>AGENDA · 03 PRÓXIMOS</div>
              <h2 className="display mt-3" style={{ fontSize: 'clamp(40px, 6vw, 84px)', lineHeight: 0.9 }}>
                Lo que <span style={{ color: '#c8462a' }}>suena.</span>
              </h2>
            </div>
            <Link to="/events" className="mono-tag hairline-ink-b pb-1 inline-flex items-center gap-2 hover:text-bermellon transition-colors self-start md:self-end">
              TODA LA AGENDA <ArrowRight size={14} />
            </Link>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="hairline-ink p-10 text-center">
              <p className="serif-italic text-ink-soft text-lg">Sincronizando próximos eventos…</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {upcomingEvents.map(ev => {
                const d = new Date(ev.date);
                const dia = String(d.getDate()).padStart(2,'0');
                const mes = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'][d.getMonth()];
                return (
                  <Link key={ev.id} to={`/events`} className="group window-panel hover:opacity-90 transition-opacity">
                    <div className="window-titlebar">
                      <span>{['DOM','LUN','MAR','MIÉ','JUE','VIE','SÁB'][d.getDay()]} {dia} {mes}</span>
                      {ev.time && <span>{ev.time}</span>}
                    </div>
                    <div className="window-body window-body-compact">
                      <h3 className="display mt-1" style={{ fontSize: 'clamp(26px, 2.8vw, 38px)', lineHeight: 0.95 }}>
                        {ev.title}
                      </h3>
                      {ev.description && <p className="serif-italic mt-2 text-sm opacity-80 line-clamp-3">{ev.description}</p>}
                      <div className="mono-tag mt-4 flex items-center gap-2 group-hover:translate-x-1 transition-transform" style={{ color: '#09aea1' }}>
                        DETALLES <ArrowRight size={14} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ─── EL ALMACÉN · DISCOS ─── */}
      <section className="bg-ink text-paper hairline-b">
        <div className="container mx-auto px-6 md:px-10 py-16 md:py-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <div className="mono-tag" style={{ color: '#c8462a' }}>DISCOS · 06 DEL ALMACÉN</div>
              <h2 className="display mt-3" style={{ fontSize: 'clamp(40px, 6vw, 84px)', lineHeight: 0.9 }}>
                Algunos <span style={{ color: '#d8ff5a' }}>discos</span><br/>a la venta.
              </h2>
            </div>
            <Link to="/records" className="mono-tag pb-1 inline-flex items-center gap-2 hover:text-bermellon transition-colors self-start md:self-end" style={{ borderBottom: '1px solid #7a7a78' }}>
              ENTRAR EN LA TIENDA <ArrowRight size={14} />
            </Link>
          </div>

          {topPicks.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {topPicks.map(r => (
                <button key={r.id} onClick={() => navigate(`/records/${r.id}`)} className="text-left group window-panel-ink">
                  <div className="window-titlebar">
                    <span style={{ fontSize: '0.55rem' }}>DISC</span>
                  </div>
                  <div className="window-body p-2">
                    <div className="aspect-square bg-black overflow-hidden">
                      <CachedImage src={r.coverUrl} alt={r.title} />
                    </div>
                    <div className="mt-2">
                      <div className="display text-paper text-sm leading-tight line-clamp-1 group-hover:text-bermellon transition-colors">{r.artist}</div>
                      <div className="mono-tag text-paper/60 mt-1 text-[9px] line-clamp-1">{r.title}</div>
                      <div className="serif-italic mt-2 text-base" style={{ color: '#09aea1' }}>€{r.price}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── INSTAGRAM · ÚLTIMOS POSTS ─── */}
      {INSTAGRAM_FEATURED_POSTS.length > 0 && (
        <section className="bg-paper-2 hairline-b">
          <div className="container mx-auto px-6 md:px-10 py-16 md:py-20">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
              <div>
                <div className="mono-tag" style={{ color: '#c8462a' }}>INSTAGRAM · DESDE EL LOCAL</div>
                <h2 className="display mt-3" style={{ fontSize: 'clamp(40px, 6vw, 84px)', lineHeight: 0.9 }}>
                  En <span style={{ color: '#c8462a' }}>directo.</span>
                </h2>
              </div>
              <a href="https://www.instagram.com/mat32__" target="_blank" rel="noopener"
                className="mono-tag hairline-ink-b pb-1 inline-flex items-center gap-2 hover:text-bermellon transition-colors self-start md:self-end">
                @MAT32__ <ArrowRight size={14} />
              </a>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0">
              {INSTAGRAM_FEATURED_POSTS.map(url => (
                <div key={url}
                  className="snap-start shrink-0 w-[340px] md:w-[368px] window-panel shadow-[0_18px_40px_rgba(0,0,0,0.14),0_6px_14px_rgba(0,0,0,0.08)]">
                  <div className="window-titlebar">
                    <span className="flex items-center gap-2">
                      <Instagram size={12} style={{ color: '#09aea1' }} />
                      <span style={{ color: '#dedede' }}>DESDE EL LOCAL</span>
                    </span>
                  </div>
                  <div className="window-body p-2 bg-white">
                    <InstagramEmbed url={url} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── FOOTER STRIP · slide 04 ─── */}
      <section className="bg-ink text-paper">
        <div className="container mx-auto px-6 md:px-10 py-5 flex flex-wrap items-center justify-between gap-3 mono-tag text-[10px]">
          <span>EST. 2022 · RUZAFA, VLC</span>
          <span className="hidden md:inline">MATÍAS PERELLÓ 32 · 46005</span>
          <span>+34 622 19 08 02 · HOLA@MAT32.COM</span>
          <span style={{ color: '#c8462a' }}>@MAT32VALENCIA</span>
        </div>
      </section>
    </div>
  );
};
