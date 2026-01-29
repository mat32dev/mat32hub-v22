
import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Zap, Loader2, Disc, ArrowRight, Star, History, Clock } from 'lucide-react';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { Event } from '../types';
import { Link } from 'react-router-dom';
import { EventCard } from '../components/EventCard';

export const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

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

    // Lógica fin de semana (Viernes a Domingo)
    const today = now.getDay(); // 0 Dom, 1 Lun...
    const diffToFriday = today <= 5 ? 5 - today : 5 + (7 - today);
    
    const nextFriday = new Date(now);
    nextFriday.setDate(now.getDate() + diffToFriday);
    
    const nextSunday = new Date(nextFriday);
    nextSunday.setDate(nextFriday.getDate() + 2);
    nextSunday.setHours(23, 59, 59, 999);

    events.forEach(e => {
      const eventDate = new Date(e.date);
      if (eventDate < now) {
        past.push(e);
      } else if (eventDate >= nextFriday && eventDate <= nextSunday) {
        thisWeekend.push(e);
      } else {
        upcoming.push(e);
      }
    });

    // Ordenar pasados por los más recientes primero
    past.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    // Ordenar futuros por cercanía
    const futureSorter = (a: Event, b: Event) => new Date(a.date).getTime() - new Date(b.date).getTime();
    thisWeekend.sort(futureSorter);
    upcoming.sort(futureSorter);

    return { past, thisWeekend, upcoming };
  }, [events]);

  return (
    <div className="min-h-screen bg-mat-900 text-mat-cream pb-32">
      <SEO 
        titleKey="Agenda Cultural & Sesiones Hi-Fi | Mat32 Ruzafa" 
        descriptionKey="Consulta nuestra agenda de sesiones analógicas en Valencia. Eventos próximos, lineups exclusivos y archivo de sesiones en el Hub Hi-Fi de Ruzafa." 
        keywordsKey="seo.events.keywords"
        schemaType="MusicEvent"
      />

      <div className="bg-mat-950 py-32 md:py-52 border-b border-mat-800 relative overflow-hidden text-center">
        <Disc className="w-24 h-24 text-mat-500 mx-auto mb-10 animate-spin-slow opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter text-white font-exo leading-[0.8] relative z-10">LA <span className="text-mat-500">AGENDA.</span></h1>
        <p className="text-gray-500 text-xl mt-8 italic opacity-80 max-w-2xl mx-auto px-6 relative z-10 font-light leading-relaxed">Selección musical de alta fidelidad. Reservas y protocolos de acceso.</p>
      </div>

      <div className="container mx-auto px-6 py-20 max-w-6xl space-y-32">
        {loading ? (
           <div className="flex flex-col items-center py-40"><Loader2 className="animate-spin text-mat-500 w-12 h-12" /></div>
        ) : (
          <>
            {/* NEXT WEEKEND SECTION */}
            {categorizedEvents.thisWeekend.length > 0 && (
              <section className="animate-fade-in">
                 <div className="flex items-center gap-4 mb-12">
                    <div className="bg-mat-500 p-3 rounded-2xl shadow-lg shadow-mat-500/20">
                       <Star className="text-white animate-pulse" size={24} />
                    </div>
                    <div>
                       <h2 className="text-3xl font-black text-white uppercase tracking-tighter font-exo leading-none">PRÓXIMO FIN DE SEMANA</h2>
                       <p className="text-[10px] font-black text-mat-500 uppercase tracking-widest mt-2">SESIONES DE MÁXIMA PRIORIDAD</p>
                    </div>
                    <div className="flex-1 border-b border-mat-800/50 hidden md:block"></div>
                 </div>
                 <div className="grid gap-12">
                    {categorizedEvents.thisWeekend.map(event => (
                      <EventCard key={event.id} event={event} />
                    ))}
                 </div>
              </section>
            )}

            {/* OTHER UPCOMING EVENTS */}
            {categorizedEvents.upcoming.length > 0 && (
              <section className="animate-fade-in">
                 <div className="flex items-center gap-4 mb-12">
                    <div className="bg-mat-800 p-3 rounded-2xl border border-mat-700">
                       <Clock className="text-mat-500" size={24} />
                    </div>
                    <div>
                       <h2 className="text-3xl font-black text-white uppercase tracking-tighter font-exo leading-none">PRÓXIMAS SESIONES</h2>
                       <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">MÁS ALLÁ DEL HORIZONTE</p>
                    </div>
                    <div className="flex-1 border-b border-mat-800/50 hidden md:block"></div>
                 </div>
                 <div className="grid gap-12">
                    {categorizedEvents.upcoming.map(event => (
                      <EventCard key={event.id} event={event} />
                    ))}
                 </div>
              </section>
            )}

            {/* PAST EVENTS ARCHIVE */}
            {categorizedEvents.past.length > 0 && (
              <section className="animate-fade-in pt-12">
                 <div className="flex items-center gap-4 mb-12">
                    <div className="bg-mat-950 p-3 rounded-2xl border border-mat-800">
                       <History className="text-gray-600" size={24} />
                    </div>
                    <div>
                       <h2 className="text-3xl font-black text-gray-400 uppercase tracking-tighter font-exo leading-none">ARCHIVO DE SESIONES</h2>
                       <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest mt-2">MEMORIA ANALÓGICA DEL HUB</p>
                    </div>
                    <div className="flex-1 border-b border-mat-800/20 hidden md:block"></div>
                 </div>
                 <div className="grid gap-8 opacity-70">
                    {categorizedEvents.past.slice(0, 6).map(event => (
                      <EventCard key={event.id} event={event} isPast={true} />
                    ))}
                 </div>
                 {categorizedEvents.past.length > 6 && (
                   <div className="mt-12 text-center">
                      <button className="text-[10px] font-black text-gray-600 uppercase tracking-widest hover:text-mat-500 transition-colors border-b border-mat-800 pb-1">CARGAR ARCHIVO COMPLETO +</button>
                   </div>
                 )}
              </section>
            )}

            {events.length === 0 && (
              <div className="py-40 text-center">
                 <Disc className="w-20 h-20 text-mat-800 mx-auto mb-8 animate-spin-slow opacity-20" />
                 <p className="text-gray-600 font-black uppercase text-xs tracking-widest">Sincronizando con la agenda central...</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
