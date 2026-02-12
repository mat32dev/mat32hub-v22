
import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, Disc, Star, History, Clock, Calendar } from 'lucide-react';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { Event } from '../types';
import { EventCard } from '../components/EventCard';
import { CachedImage } from '../components/CachedImage';

export const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRevealed, setIsRevealed] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const data = await dataService.getEvents();
    setEvents(data);
    setLoading(false);
    setTimeout(() => setIsRevealed(true), 150);
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

    const today = now.getDay(); 
    const diffToFriday = today <= 5 ? 5 - today : 5 + (7 - today);
    const nextFriday = new Date(now);
    nextFriday.setDate(now.getDate() + diffToFriday);
    const nextSunday = new Date(nextFriday);
    nextSunday.setDate(nextFriday.getDate() + 2);
    nextSunday.setHours(23, 59, 59, 999);

    events.forEach(e => {
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

  return (
    <div className="min-h-screen bg-mat-900 text-mat-cream pb-32">
      <SEO titleKey="Eventos & Sesiones Hi-Fi Ruzafa | Agenda Mat32" descriptionKey="Descubre la agenda cultural de Mat32. Sesiones de escucha profunda, DJs de vinilo y eventos exclusivos en el corazón de Valencia." />

      <div className="relative h-[60vh] md:h-[80vh] flex items-center justify-center border-b border-mat-800 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <CachedImage 
            src="https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/8835f005-f545-4434-c67a-b2154de2da00/public" 
            alt="Agenda Experience" 
            priority
            className={`w-full h-full object-cover transition-all duration-800 ease-out ${isRevealed ? 'scale-100 blur-0 grayscale-0 opacity-40' : 'scale-110 blur-2xl grayscale opacity-0'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-mat-900 via-mat-900/60 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10 pt-20">
          <h1 className="text-7xl md:text-[12rem] font-black uppercase tracking-tighter text-white font-exo leading-none">AGENDA.</h1>
          <p className="text-gray-400 text-xl md:text-3xl mt-6 italic font-light max-w-3xl mx-auto">"Señales analógicas programadas para el deleite auditivo."</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 max-w-5xl space-y-24">
        {loading ? (
           <div className="flex justify-center py-40"><Loader2 className="animate-spin text-mat-500 w-10 h-10" /></div>
        ) : (
          <>
            {/* ESTE FIN DE SEMANA */}
            {categorizedEvents.thisWeekend.length > 0 && (
              <section className="animate-fade-in">
                 <div className="flex items-center gap-4 mb-10">
                    <Star className="text-mat-400" size={20} />
                    <h2 className="text-2xl font-black text-white uppercase font-exo">ESTE FIN DE SEMANA</h2>
                    <div className="flex-1 border-b border-mat-800"></div>
                 </div>
                 <div className="grid gap-8">
                    {categorizedEvents.thisWeekend.map(event => (
                      <EventCard key={event.id} event={event} />
                    ))}
                 </div>
              </section>
            )}

            {/* PRÓXIMAMENTE */}
            {categorizedEvents.upcoming.length > 0 && (
              <section className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                 <div className="flex items-center gap-4 mb-10">
                    <Clock className="text-mat-500" size={20} />
                    <h2 className="text-2xl font-black text-white uppercase font-exo">PRÓXIMAMENTE</h2>
                    <div className="flex-1 border-b border-mat-800"></div>
                 </div>
                 <div className="grid gap-8">
                    {categorizedEvents.upcoming.map(event => (
                      <EventCard key={event.id} event={event} />
                    ))}
                 </div>
              </section>
            )}

            {/* EVENTOS PASADOS */}
            {categorizedEvents.past.length > 0 && (
              <section className="opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                 <div className="flex items-center gap-4 mb-10">
                    <History className="text-gray-600" size={20} />
                    <h2 className="text-xl font-bold text-gray-500 uppercase font-exo">EVENTOS PASADOS</h2>
                    <div className="flex-1 border-b border-mat-800"></div>
                 </div>
                 <div className="grid gap-6">
                    {categorizedEvents.past.slice(0, 5).map(event => (
                      <EventCard key={event.id} event={event} isPast={true} />
                    ))}
                 </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};
