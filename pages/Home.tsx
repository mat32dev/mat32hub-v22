
import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { Event, VinylRecord } from '../types';
import { CachedImage } from '../components/CachedImage';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { ReservaPrompt } from '../components/ReservaPrompt';
import { CalendarPolaroid } from '../components/CalendarPolaroid';

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
  const openDay = [4, 5, 6].includes(day);
  const isOpen = openDay && mins >= 19 * 60 + 30 && mins < 26 * 60;
  const dayLabel = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'][day];
  const dateLabel = `${dayLabel} ${String(now.getDate()).padStart(2, '0')} ${['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'][now.getMonth()]}`;

  return (
    <div className="bg-ink text-paper p-6 md:p-7 flex flex-col justify-between hairline relative" style={{ minHeight: '280px' }}>
      <div className="flex justify-between items-start">
        <span className="mono-tag opacity-70">HOY · {dateLabel}</span>
        {isOpen
          ? <span className="mono-tag" style={{ color: '#d8ff5a' }}>EN DIRECTO ●</span>
          : <span className="mono-tag opacity-50">CERRADO</span>}
      </div>
      <div className="my-6">
        <div className="mono-tag" style={{ color: '#c8462a' }}>{openDay ? 'PROGRAMA DE HOY' : 'PRÓXIMA APERTURA'}</div>
        <div className="display text-white mt-2" style={{ fontSize: 'clamp(28px, 4vw, 42px)', lineHeight: 0.95 }}>
          {openDay ? <>SESIÓN<br/>EN VINILO</> : <>JUEVES<br/>19:30</>}
        </div>
        <p className="serif-italic text-paper/85 mt-2 text-base">
          {openDay
            ? 'Selector residente. Soul · Jazz · House.'
            : 'Apertura semanal. Tres noches: jueves, viernes y sábado.'}
        </p>
      </div>
      <div className="hairline-ink-t pt-3 mono-tag flex justify-between items-center text-[11px]">
        <span>19:30 → 02:00</span>
        <span style={{ color: '#c8462a' }}>ENTRADA LIBRE</span>
      </div>
    </div>
  );
};

const Pilar: React.FC<{ label: string; title: string; sub: string; href: string; tone?: 'paper' | 'paper2' | 'ink' | 'accent' }> = ({ label, title, sub, href, tone = 'paper' }) => {
  const bg = tone === 'paper2' ? 'bg-paper-2' : tone === 'ink' ? 'bg-ink text-paper' : tone === 'accent' ? 'bg-bermellon text-paper' : 'bg-paper';
  const accent = tone === 'ink' || tone === 'accent' ? '#d8ff5a' : '#c8462a';
  return (
    <Link to={href} className={`group block ${bg} hairline p-7 md:p-8 transition-colors hover:bg-ink hover:text-paper`} style={{ minHeight: '260px' }}>
      <div className="mono-tag" style={{ color: accent }}>{label}</div>
      <div className="display mt-4" style={{ fontSize: 'clamp(28px, 3.2vw, 44px)', lineHeight: 0.95 }}>{title}</div>
      <p className="serif-italic mt-3 text-base leading-snug opacity-90">{sub}</p>
      <div className="mono-tag mt-6 flex items-center gap-2 group-hover:translate-x-1 transition-transform">
        ENTRAR <ArrowRight size={14} />
      </div>
    </Link>
  );
};

export const Home: React.FC = () => {
  const navigate = useNavigate();
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

  return (
    <div className="bg-paper text-ink min-h-screen">
      <SEO titleKey="MAT32 — DJs Club, Discos y Barra · Ruzafa, Valencia" descriptionKey="Sitio pequeño en Ruzafa con dos zonas: relax para sentarse y dancefloor para bailar. Tienda de día, sala de noche. Espacio para colectivos y promotores." />
      <WhatsAppButton defaultMessage="Hola MATi, una pregunta desde mat32.com" />
      <ReservaPrompt />

      {/* ─── HERO · slide 04 ─── */}
      <section className="grain hairline-b">
        <div className="container mx-auto px-6 md:px-10 pt-12 md:pt-16 pb-10">
          <div className="grid md:grid-cols-[1.55fr_1fr] gap-8 md:gap-12 items-stretch">
            <div className="flex flex-col">
              <div className="mono-tag" style={{ color: '#c8462a' }}>EST. 2022 · MATÍAS PERELLÓ 32 · 46005</div>
              <h1 className="display mt-4" style={{ fontSize: 'clamp(54px, 9vw, 132px)', lineHeight: 0.85 }}>
                DJs CLUB,<br/>DISCOS<br/>Y <span style={{ color: '#c8462a' }}>BARRA.</span>
              </h1>
              <p className="serif-italic mt-6 text-xl md:text-2xl text-ink-soft max-w-2xl leading-snug">
                Sitio pequeño con dos zonas: relax para sentarse y dancefloor para bailar. Tienda de día, sala de noche.
              </p>
              <div className="flex flex-wrap gap-2 mt-8">
                <Link to="/alquiler-local-eventos-horas-valencia" className="bg-bermellon text-paper px-5 py-3 mono-tag hover:bg-ink transition-colors">
                  PROPONER EVENTO →
                </Link>
                <Link to="/alquiler-local-eventos-horas-valencia" className="hairline px-5 py-3 mono-tag hover:bg-ink hover:text-paper transition-colors">
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
                <Link to="/alquiler-local-eventos-horas-valencia#booking-form" className="bg-bermellon text-paper px-5 py-3 mono-tag hover:bg-ink transition-colors">
                  SOLICITAR FECHA →
                </Link>
                <Link to="/events" className="hairline px-5 py-3 mono-tag hover:bg-ink hover:text-paper transition-colors">
                  VER AGENDA PÚBLICA
                </Link>
              </div>
            </div>

            <CalendarPolaroid events={allUpcoming} bookedDays={bookedDays} />
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
            <div className="grid md:grid-cols-3 hairline-l hairline-t">
              {upcomingEvents.map(ev => {
                const d = new Date(ev.date);
                const dia = String(d.getDate()).padStart(2,'0');
                const mes = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'][d.getMonth()];
                return (
                  <Link key={ev.id} to={`/events`} className="group p-7 md:p-8 hairline-r hairline-b hover:bg-ink hover:text-paper transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="mono-tag" style={{ color: '#c8462a' }}>{['DOM','LUN','MAR','MIÉ','JUE','VIE','SÁB'][d.getDay()]} {dia} {mes}</div>
                      {ev.time && <div className="mono-tag opacity-70">{ev.time}</div>}
                    </div>
                    <h3 className="display mt-5" style={{ fontSize: 'clamp(26px, 2.8vw, 38px)', lineHeight: 0.95 }}>
                      {ev.title}
                    </h3>
                    {ev.description && <p className="serif-italic mt-3 text-base opacity-80 line-clamp-3">{ev.description}</p>}
                    <div className="mono-tag mt-6 flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                      DETALLES <ArrowRight size={14} />
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
            <Link to="/records" className="mono-tag pb-1 inline-flex items-center gap-2 hover:text-bermellon transition-colors self-start md:self-end" style={{ borderBottom: '1.5px solid #4a3f2e' }}>
              ENTRAR EN LA TIENDA <ArrowRight size={14} />
            </Link>
          </div>

          {topPicks.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {topPicks.map(r => (
                <button key={r.id} onClick={() => navigate(`/records/${r.id}`)} className="text-left group hairline-ink overflow-hidden bg-ink-2">
                  <div className="aspect-square bg-black overflow-hidden">
                    <CachedImage src={r.coverUrl} alt={r.title} />
                  </div>
                  <div className="p-3">
                    <div className="display text-paper text-sm leading-tight line-clamp-1 group-hover:text-bermellon transition-colors">{r.artist}</div>
                    <div className="mono-tag text-paper/60 mt-1 text-[9px] line-clamp-1">{r.title}</div>
                    <div className="serif-italic mt-2 text-base" style={{ color: '#d8ff5a' }}>€{r.price}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

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
