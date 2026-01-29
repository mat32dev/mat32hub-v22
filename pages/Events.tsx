
import React, { useState, useEffect } from 'react';
import { Calendar, Zap, Loader2, Disc, ArrowRight } from 'lucide-react';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { Event } from '../types';
import { Link } from 'react-router-dom';

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

  return (
    <div className="min-h-screen bg-mat-900 text-mat-cream">
      <SEO 
        titleKey="seo.events.title" 
        descriptionKey="seo.events.description" 
        keywordsKey="seo.events.keywords"
        schemaType="MusicEvent"
      />

      <div className="bg-mat-950 py-32 md:py-52 border-b border-mat-800 relative overflow-hidden text-center">
        <Disc className="w-24 h-24 text-mat-500 mx-auto mb-10 animate-spin-slow opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter text-white font-exo leading-[0.8] relative z-10">LA <span className="text-mat-500">AGENDA.</span></h1>
        <p className="text-gray-500 text-xl mt-8 italic opacity-80 max-w-2xl mx-auto px-6 relative z-10 font-light leading-relaxed"> Selección musical de alta fidelidad en el sistema Altec A7.</p>
      </div>

      <div className="container mx-auto px-6 py-24 max-w-6xl">
        {loading ? (
           <div className="flex flex-col items-center py-40"><Loader2 className="animate-spin text-mat-500 w-12 h-12" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {events.map(event => (
              <Link to={`/events/${event.id}`} key={event.id} className="group bg-mat-800 border-2 border-mat-700 rounded-[3rem] overflow-hidden hover:border-mat-500 transition-all shadow-2xl flex flex-col h-full">
                <div className="aspect-[16/9] relative overflow-hidden bg-black">
                   <img src={event.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" alt={event.title} />
                   <div className="absolute top-8 right-8 bg-mat-500 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl shadow-xl border border-white/10">
                      {event.price > 0 ? `€${event.price}` : 'ACCESO_LIBRE'}
                   </div>
                </div>
                <div className="p-12 flex flex-col flex-1">
                   <div className="text-mat-500 text-[10px] font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                      <span className="w-2 h-2 bg-mat-500 rounded-full animate-pulse"></span>
                      {event.date} @ {event.time}
                   </div>
                   <h3 className="text-4xl font-black text-white uppercase tracking-tighter font-exo leading-[0.9] mb-8 group-hover:text-mat-500 transition-colors">{event.title}</h3>
                   <p className="text-gray-500 text-base font-light italic leading-relaxed line-clamp-3 mb-12">"{event.description}"</p>
                   <div className="mt-auto pt-8 border-t border-mat-700 flex justify-between items-center text-gray-600 font-black text-[10px] uppercase tracking-widest">
                      <span className="bg-mat-900 px-4 py-2 rounded-lg border border-mat-700">{event.category}</span>
                      <div className="flex items-center gap-3 text-mat-500 group-hover:gap-5 transition-all">
                        TICKETS <ArrowRight size={16} />
                      </div>
                   </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
