
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Check, Ticket, ListMusic, User, ArrowRight, Star, X, Users, Headphones } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Event } from '../types';
import { dataService } from '../services/dataService';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { CachedImage } from './CachedImage';
import { TagLink } from './TagLink';

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const [isAttending, setIsAttending] = useState(false);
  const [guestList, setGuestList] = useState<string[]>([]);
  const [showGuestList, setShowGuestList] = useState(false);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [userName, setUserName] = useState(localStorage.getItem('mat32_user_name') || '');

  useEffect(() => {
    const loadData = async () => {
      const rsvps = await dataService.getUserRSVPs();
      setIsAttending(rsvps.includes(event.id));
      const list = await dataService.getEventGuestList(event.id);
      setGuestList(list.map(g => g.name));
    };
    loadData();
    window.addEventListener('storage_update', loadData);
    window.addEventListener('mat32_data_changed', loadData);
    return () => {
      window.removeEventListener('storage_update', loadData);
      window.removeEventListener('mat32_data_changed', loadData);
    };
  }, [event.id]);

  const isFree = event.price === 0;
  const inCart = cart.some(item => item.id === `ticket-${event.id}`);

  const handleAction = async () => {
    if (isFree) {
      if (isAttending) {
        await dataService.toggleRSVP(event.id, userName, false);
      } else {
        if (!userName) setShowNamePrompt(true);
        else await dataService.toggleRSVP(event.id, userName, true);
      }
    } else {
      if (isAttending) {
        // Si ya está confirmado (ya tiene entrada o está en lista)
        navigate('/checkout');
        return;
      }
      const ticketItem: any = {
        id: `ticket-${event.id}`,
        title: `Entrada: ${event.title}`,
        artist: event.category,
        price: event.price,
        coverUrl: event.imageUrl,
        genre: 'Event',
        format: 'Entrada Digital',
        description: `Acceso para ${event.title} el ${event.date}`,
        discogsLink: '#'
      };
      addToCart(ticketItem);
      navigate('/checkout');
    }
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;
    localStorage.setItem('mat32_user_name', userName);
    await dataService.toggleRSVP(event.id, userName, true);
    setShowNamePrompt(false);
  };

  return (
    <article 
      className={`bg-mat-800 border-2 shadow-2xl transition-all duration-500 flex flex-col md:flex-row overflow-hidden group rounded-[1.5rem] md:rounded-[2.5rem] ${
        isAttending 
          ? 'border-green-500 shadow-[0_0_50px_rgba(34,197,94,0.15)]' 
          : 'border-mat-700 hover:border-mat-500'
      }`}
    >
      <div className="md:w-2/5 lg:w-1/3 relative bg-black flex-shrink-0">
        <CachedImage 
          src={event.imageUrl} 
          alt={event.title} 
          className="w-full h-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-mat-900/80 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-6 left-6 flex gap-2">
           <TagLink 
            label={event.category} 
            type="category" 
            className="bg-mat-500 text-white shadow-xl hover:bg-mat-400" 
           />
        </div>

        {(isAttending || inCart) && (
          <div className="absolute top-4 right-4 z-20 animate-fade-in">
             <div className={`${isAttending ? 'bg-green-500' : 'bg-mat-500'} text-white font-black text-[8px] tracking-[0.4em] px-4 py-2 rounded-full flex items-center gap-2 shadow-2xl border border-white/20 uppercase`}>
                <Check className="w-3 h-3" /> {isAttending ? 'GOING' : 'IN CART'}
             </div>
          </div>
        )}
      </div>
      
      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="flex-1 p-6 md:p-10 lg:p-12 flex flex-col">
          <div className="flex items-center gap-3 text-mat-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4">
            <Calendar className="w-4 h-4 md:w-5 md:h-5" /> {event.date} 
            <span className="text-mat-700">/</span> 
            <Clock className="w-4 h-4 md:w-5 md:h-5" /> {event.time}
          </div>
          
          <h3 className={`text-3xl md:text-5xl font-black uppercase leading-none mb-6 tracking-tighter font-exo transition-colors ${isAttending ? 'text-green-500' : 'text-white group-hover:text-mat-500'}`}>
            {event.title}
          </h3>
          
          <p className="text-gray-400 text-sm md:text-base leading-relaxed font-light italic mb-8 max-w-xl">
            "{event.description}"
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {event.vibe?.map(v => (
              <TagLink key={v} label={v} type="vibe" className="bg-mat-900/50 text-gray-500" />
            ))}
          </div>

          <div className="mt-auto flex flex-wrap gap-4 items-center">
             <button 
                onClick={handleAction}
                className={`px-8 py-4 font-black uppercase text-[10px] tracking-widest flex items-center gap-3 transition-all duration-300 border-2 clip-path-slant shadow-xl ${
                  isAttending
                    ? 'bg-green-500 border-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]' 
                    : inCart 
                      ? 'bg-mat-500 border-mat-500 text-white'
                      : 'bg-transparent border-mat-500 text-mat-500 hover:bg-mat-500 hover:text-white'
                }`}
              >
                {isFree ? (isAttending ? <Check className="w-4 h-4" /> : <ListMusic className="w-4 h-4" />) : <Ticket className="w-4 h-4" />}
                {isFree 
                  ? (isAttending ? t('events.card.attending_confirm') : t('events.card.guestlist')) 
                  : (isAttending ? 'TICKET CONFIRMADO' : inCart ? 'FINALIZAR COMPRA' : `${t('events.card.get_tickets')} (€${event.price})`)
                }
              </button>
              
              <button 
                onClick={() => setShowGuestList(true)}
                className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors"
              >
                 <Users className={`w-3 h-3 ${isAttending ? 'text-green-500' : 'text-mat-500'}`} /> {guestList.length} CONFIRMADOS
              </button>
          </div>
        </div>

        <div className="w-full lg:w-80 bg-mat-900/40 p-6 md:p-10 lg:p-12 border-t md:border-t-0 md:border-l border-mat-700/50">
           <h4 className="text-[10px] font-black text-mat-500 uppercase tracking-[0.5em] mb-8 flex items-center gap-3">
              <Headphones className="w-4 h-4" /> Lineup
           </h4>
           <div className="space-y-6">
              {event.lineup.map((artist, idx) => (
                <div key={idx} className="flex flex-col">
                   <span className="text-lg font-black text-white uppercase tracking-tighter">{artist.name}</span>
                   <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{artist.role}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {showGuestList && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-fade-in">
           <div className="w-full max-w-md bg-mat-900 border-2 border-mat-700 rounded-[3rem] p-10 relative shadow-2xl">
              <button onClick={() => setShowGuestList(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-all"><X className="w-8 h-8" /></button>
              <div className="mb-10 text-center">
                 <Users className="w-12 h-12 text-mat-500 mx-auto mb-4" />
                 <h2 className="text-3xl font-black text-white uppercase tracking-tighter font-exo leading-tight">Guest List</h2>
                 <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-2">{event.title}</p>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                 {guestList.length === 0 ? <p className="text-center text-gray-600 font-black uppercase text-[10px] tracking-widest italic py-8">Aún no hay confirmados...</p> : guestList.map((name, i) => (
                     <div key={i} className="flex items-center gap-4 bg-mat-800 p-4 rounded-2xl border border-mat-700">
                        <div className="w-8 h-8 bg-mat-900 rounded-full flex items-center justify-center text-mat-500 font-black text-xs border border-mat-700">{name[0].toUpperCase()}</div>
                        <span className="text-white font-black uppercase text-xs tracking-tight">{name}</span>
                        <div className="ml-auto w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                     </div>
                 ))}
              </div>
              <button onClick={() => setShowGuestList(false)} className="w-full mt-10 py-5 bg-mat-800 text-gray-500 hover:text-white font-black uppercase text-[10px] tracking-widest rounded-2xl transition-all border border-mat-700">Cerrar Lista</button>
           </div>
        </div>
      )}

      {showNamePrompt && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-fade-in">
           <div className="w-full max-w-sm bg-mat-900 border-2 border-mat-500 rounded-[3rem] p-10 relative shadow-2xl">
              <div className="mb-8 text-center"><User className="w-12 h-12 text-mat-500 mx-auto mb-4" /><h2 className="text-2xl font-black text-white uppercase tracking-tighter font-exo">¿Cómo te llamas?</h2><p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mt-2">Para aparecer en la Guest List</p></div>
              <form onSubmit={handleNameSubmit} className="space-y-6"><input autoFocus type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full bg-mat-800 border-2 border-mat-700 p-4 text-white uppercase text-xs font-black rounded-xl outline-none focus:border-mat-500" placeholder="TU NOMBRE O ALIAS" /><button type="submit" className="w-full py-5 bg-mat-500 text-white font-black uppercase tracking-widest rounded-xl hover:bg-mat-400 transition-all shadow-xl">Confirmar RSVP</button></form>
              <button onClick={() => setShowNamePrompt(false)} className="w-full mt-4 py-3 text-gray-600 hover:text-white text-[9px] font-black uppercase tracking-widest transition-colors">Cancelar</button>
           </div>
        </div>
      )}
    </article>
  );
};
