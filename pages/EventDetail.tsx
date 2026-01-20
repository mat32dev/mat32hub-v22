
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Ticket, ArrowLeft, Headphones, Share2, Zap } from 'lucide-react';
import { dataService } from '../services/dataService';
import { SEO } from '../components/SEO';
import { Event } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { CachedImage } from '../components/CachedImage';

export const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (id) {
        const data = await dataService.getEventById(id);
        if (data) setEvent(data);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-mat-900 flex items-center justify-center"><Loader2 className="animate-spin text-mat-500 w-12 h-12" /></div>;
  if (!event) return <div className="min-h-screen bg-mat-900 text-center py-40 text-white">Evento no encontrado. <Link to="/events" className="text-mat-500">Volver</Link></div>;

  return (
    <div className="min-h-screen bg-mat-900 pb-24">
      <SEO 
        titleKey={event.title} 
        descriptionKey={event.description} 
        image={event.imageUrl}
        schemaType="Event"
      />
      
      <div className="relative h-[60vh] overflow-hidden">
        <CachedImage src={event.imageUrl} alt={event.title} className="w-full h-full opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-mat-900 via-transparent to-transparent"></div>
        <div className="absolute bottom-12 left-0 w-full">
           <div className="container mx-auto px-6">
              <Link to="/events" className="inline-flex items-center gap-2 text-mat-500 font-black uppercase text-[10px] tracking-widest mb-6 hover:text-white transition-colors">
                <ArrowLeft size={16} /> VOLVER A LA AGENDA
              </Link>
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-mat-500 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded shadow-xl mb-4">
                 <Zap className="w-4 h-4" /> LIVE SESSION
              </div>
              <h1 className="text-5xl md:text-8xl font-black uppercase text-white tracking-tighter font-exo leading-none mb-4">{event.title}</h1>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-12 gap-20">
           <div className="lg:col-span-8 space-y-12">
              <div className="bg-mat-800 p-10 md:p-16 border-2 border-mat-700 rounded-[3rem] shadow-2xl">
                 <h2 className="text-2xl font-black text-mat-500 uppercase tracking-tighter mb-8 font-exo">Detalles de la Sesión</h2>
                 <p className="text-gray-300 text-xl font-light italic leading-relaxed mb-12">"{event.description}"</p>
                 
                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="flex items-center gap-4 bg-mat-900/50 p-6 rounded-2xl border border-mat-700">
                       <Calendar className="text-mat-500" />
                       <div><span className="block text-[10px] text-gray-600 font-black">FECHA</span><span className="text-white font-black text-sm">{event.date}</span></div>
                    </div>
                    <div className="flex items-center gap-4 bg-mat-900/50 p-6 rounded-2xl border border-mat-700">
                       <Clock className="text-mat-500" />
                       <div><span className="block text-[10px] text-gray-600 font-black">HORA</span><span className="text-white font-black text-sm">{event.time}</span></div>
                    </div>
                 </div>
              </div>
           </div>

           <aside className="lg:col-span-4 space-y-8">
              <div className="bg-mat-500 p-10 rounded-[3rem] shadow-[0_20px_60px_rgba(234,88,12,0.3)] text-white">
                 <h3 className="text-2xl font-black uppercase font-exo mb-2">Entradas</h3>
                 <p className="text-[10px] font-black uppercase tracking-widest mb-8 opacity-70">Acceso prioritario y consumición</p>
                 <div className="text-6xl font-black mb-8">€{event.price}</div>
                 <button 
                  onClick={() => {
                    addToCart({
                      id: `ticket-${event.id}`,
                      title: `Entrada: ${event.title}`,
                      artist: 'Mat32 Session',
                      price: event.price,
                      coverUrl: event.imageUrl,
                      genre: 'Ticket',
                      format: 'Digital',
                      description: 'Acceso prioritario',
                      label: 'Mat32',
                      year: '2025',
                      condition: 'Mint',
                      discogsLink: '#'
                    });
                    navigate('/checkout');
                  }}
                  className="w-full py-5 bg-white text-mat-900 font-black uppercase tracking-widest rounded-2xl shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                 >
                    <Ticket /> ADQUIRIR TICKET
                 </button>
              </div>

              <div className="bg-mat-800 border border-mat-700 p-10 rounded-[3rem] shadow-xl">
                 <h4 className="text-[10px] font-black text-mat-500 uppercase tracking-widest mb-6">Lineup Confirmado</h4>
                 <div className="space-y-4">
                    {event.lineup.map((m, i) => (
                       <div key={i} className="flex flex-col">
                          <span className="text-white font-black uppercase text-lg leading-none">{m.name}</span>
                          <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{m.role}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </aside>
        </div>
      </div>
    </div>
  );
};

const Loader2 = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);
