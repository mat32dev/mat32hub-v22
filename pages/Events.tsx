
import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, Disc, Star, History, Clock, X } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { Event } from '../types';
import { EventCard } from '../components/EventCard';

export const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const genero = searchParams.get('genero') || '';

  const loadData = async () => {
    setLoading(true);
    const data = await dataService.getEvents();
    setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('mat32_data_changed', loadData);
    return () => window.removeEventListener('mat32_data_changed', loadData);
  }, []);

  const categorizedEvents = useMemo(() => {
    const now = new Date();
    now.setHours(0,0,0,0);

    const past: Event[] = [];
    const thisWeekend: Event[] = [];
    const upcoming: Event[] = [];

    // Si hay filtro de género: solo próximos eventos que lo contengan.
    let pool = events;
    if (genero) {
      const g = genero.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      pool = events.filter(e =>
        (e.vibe || []).some(v => v.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(g)) ||
        (e.tags || []).some(t => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(g)) ||
        (e.title || '').toLowerCase().includes(g)
      );
    }

    const today = now.getDay(); 
    const diffToFriday = today <= 5 ? 5 - today : 5 + (7 - today);
    const nextFriday = new Date(now);
    nextFriday.setDate(now.getDate() + diffToFriday);
    const nextSunday = new Date(nextFriday);
    nextSunday.setDate(nextFriday.getDate() + 2);
    nextSunday.setHours(23, 59, 59, 999);

    pool.forEach(e => {
      const eventDate = new Date(e.date);
      if (eventDate < now) past.push(e);
      else if (eventDate >= nextFriday && eventDate <= nextSunday) thisWeekend.push(e);
      else upcoming.push(e);
    });

    past.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    thisWeekend.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    upcoming.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return { past, thisWeekend, upcoming };
  }, [events]);

  useEffect(() => {
    document.body.classList.add('theme-paper');
    return () => { document.body.classList.remove('theme-paper'); };
  }, []);

  const week = (() => {
    const n = new Date(); const o = new Date(n); o.setDate(n.getDate() - n.getDay() + 1);
    const sem = Math.ceil((((o.getTime() - new Date(o.getFullYear(),0,1).getTime()) / 86400000) + 1) / 7);
    return { sem, year: o.getFullYear() };
  })();

  return (
    <div className="bg-paper text-ink min-h-screen pb-24 grain">
      <SEO titleKey="Agenda · Lo que ya está programado | MAT32" descriptionKey="Lo que ya está programado en MAT32: sesiones de selectors, residencias, takeovers y open decks. Soul, jazz, house, ambient. Ruzafa, Valencia." />

      {/* HERO · slide 06 */}
      <section className="container mx-auto px-6 md:px-10 pt-12 md:pt-16 pb-10 hairline-b">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="mono-tag" style={{ color: '#c8462a' }}>AGENDA · LISTING</div>
            <h1 className="display mt-3" style={{ fontSize: 'clamp(54px, 9vw, 132px)', lineHeight: 0.88 }}>
              Lo que <span style={{ color: '#c8462a' }}>ya está</span><br/>programado.
            </h1>
          </div>
          <div className="mono-tag md:text-right text-ink-soft">
            SEMANA {week.sem} · {week.year}<br/>
            {events.length} {events.length === 1 ? 'SESIÓN' : 'SESIONES'} REGISTRADAS
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 md:px-10 py-12 max-w-6xl space-y-20">
        {genero && (
          <div className="flex flex-wrap items-center gap-3 hairline p-4 bg-paper-2">
            <span className="mono-tag !text-[10px] text-ink/50">FILTRANDO POR SONIDO</span>
            <span className="mono-tag px-3 py-1.5 bg-bermellon text-paper" style={{ color: '#fff' }}>{genero.toUpperCase()}</span>
            <span className="mono-tag !text-[10px] text-ink-soft">
              {categorizedEvents.upcoming.length + categorizedEvents.thisWeekend.length + categorizedEvents.past.length} eventos encontrados
            </span>
            <button
              onClick={() => setSearchParams({})}
              className="ml-auto flex items-center gap-1.5 mono-tag !text-[10px] hairline px-3 py-2 text-ink hover:bg-ink hover:text-paper transition-colors">
              <X size={12} /> QUITAR FILTRO
            </button>
          </div>
        )}
        {loading ? (
          <div className="flex justify-center py-40"><Loader2 className="animate-spin text-bermellon w-8 h-8" /></div>
        ) : (
          <>
            {categorizedEvents.thisWeekend.length > 0 && (
              <section>
                <div className="flex items-baseline gap-4 mb-6 hairline-b pb-3">
                  <Star className="text-bermellon" size={16} />
                  <h2 className="display text-2xl md:text-3xl">Este fin de semana.</h2>
                  <span className="mono-tag text-ink-soft">{categorizedEvents.thisWeekend.length} en cartel</span>
                </div>
                <div className="grid gap-6">
                  {categorizedEvents.thisWeekend.map(e => <EventCard key={e.id} event={e} />)}
                </div>
              </section>
            )}

            {categorizedEvents.upcoming.length > 0 && (
              <section>
                <div className="flex items-baseline gap-4 mb-6 hairline-b pb-3">
                  <Clock className="text-ink" size={16} />
                  <h2 className="display text-2xl md:text-3xl">Próximamente.</h2>
                  <span className="mono-tag text-ink-soft">{categorizedEvents.upcoming.length} fechas</span>
                </div>
                <div className="grid gap-6">
                  {categorizedEvents.upcoming.map(e => <EventCard key={e.id} event={e} />)}
                </div>
              </section>
            )}

            {categorizedEvents.past.length > 0 && (
              <section className="opacity-60 hover:opacity-100 transition-opacity">
                <div className="flex items-baseline gap-4 mb-6 hairline-b pb-3">
                  <History className="text-ink-soft" size={16} />
                  <h2 className="display text-xl md:text-2xl text-ink-soft">Ya pasó.</h2>
                </div>
                <div className="grid gap-4">
                  {categorizedEvents.past.slice(0, 5).map(e => <EventCard key={e.id} event={e} isPast={true} />)}
                </div>
              </section>
            )}

            {events.length === 0 && (
              <div className="hairline p-12 text-center">
                <Disc className="w-10 h-10 text-ink-soft mx-auto mb-3 animate-spin-slow" />
                <p className="serif-italic text-ink-soft text-lg">Programa en preparación. Vuelve pronto.</p>
              </div>
            )}

            {genero && events.length > 0 && categorizedEvents.upcoming.length + categorizedEvents.thisWeekend.length + categorizedEvents.past.length === 0 && (
              <div className="hairline p-12 text-center">
                <Disc className="w-10 h-10 text-ink-soft mx-auto mb-3" />
                <p className="serif-italic text-ink-soft text-lg mb-5">No hay próximos eventos con este sonido.</p>
                <button onClick={() => setSearchParams({})} className="mono-tag hairline px-5 py-3 hover:bg-ink hover:text-paper transition-colors">
                  QUITAR FILTRO →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
