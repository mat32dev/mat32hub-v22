import React, { useState } from 'react';
import { Calendar, Clock, Ticket, ListMusic, User, X, Users, Zap, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Event } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { CachedImage } from './CachedImage';
import { useEventRSVP } from '../hooks/useEventRSVP';
import { EventBadge, EventLineup, GoogleCalendarButton } from './EventCardParts';

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAttending, guestList, userName, toggleRSVP } = useEventRSVP(event.id);
  
  const [showGuestList, setShowGuestList] = useState(false);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [tempName, setTempName] = useState(userName);

  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  const isFreeTime = event.freeUntil ? currentTime < event.freeUntil : true;
  const isCurrentlyFree = (event.price === 0) && isFreeTime;

  const handleAction = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCurrentlyFree) {
      if (isAttending) {
        await toggleRSVP(false);
      } else {
        if (!userName) setShowNamePrompt(true);
        else await toggleRSVP(true);
      }
    } else {
      if (isAttending) {
        navigate('/checkout');
        return;
      }
      addToCart({
        id: `ticket-${event.id}`,
        title: `Consumición Mínima: ${event.title}`,
        artist: event.category,
        price: event.paidPrice || event.price,
        coverUrl: event.imageUrl,
        quantity: 1
      } as any);
      navigate('/checkout');
    }
  };

  return (
    <article 
      onClick={() => navigate(`/events/${event.id}`)}
      className={`bg-mat-900/40 backdrop-blur-sm border-2 transition-all duration-700 flex flex-col md:flex-row overflow-hidden group rounded-[2.5rem] relative cursor-pointer ${
        isAttending 
          ? 'border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.25)] scale-[1.01]' 
          : 'border-mat-800 hover:border-mat-500/50'
      }`}
    >
      {isAttending && (
        <div className="absolute top-0 right-0 p-6 z-20 animate-fade-in">
          <div className="bg-emerald-500 text-white p-2 rounded-full shadow-2xl border-2 border-mat-900">
            <CheckCircle2 size={24} className="animate-pulse" />
          </div>
        </div>
      )}

      <div className="md:w-1/3 relative bg-black flex-shrink-0 overflow-hidden">
        <CachedImage 
          src={event.imageUrl} 
          alt={event.title} 
          className={`w-full h-full transition-all duration-1000 ease-in-out ${isAttending ? 'grayscale-0' : 'grayscale group-hover:grayscale-0 group-hover:scale-110'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-mat-950/90 via-transparent to-transparent"></div>
        <div className="absolute top-6 left-6 flex flex-col gap-2">
           <EventBadge label={event.category} animate={isAttending} active={isAttending} />
           {isCurrentlyFree && (
             <div className="bg-emerald-500 text-white font-black text-[7px] tracking-widest px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5 uppercase shadow-xl">
                <Zap size={10} /> ACCESO LIBRE
             </div>
           )}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col p-8 md:p-12">
        <header className="mb-6">
          <div className="flex items-center gap-3 text-mat-500 font-black text-[9px] uppercase tracking-[0.4em] mb-4">
            <Calendar size={14} /> {event.date} 
            <span className="text-mat-800">•</span> 
            <Clock size={14} /> {event.time}
          </div>
          <h3 className={`text-3xl md:text-5xl font-black uppercase leading-[0.9] tracking-tighter font-exo mb-4 transition-colors ${isAttending ? 'text-emerald-500' : 'text-white group-hover:text-mat-500'}`}>
            {event.title}
          </h3>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed font-light italic mb-2 max-w-xl line-clamp-2">
            "{event.description}"
          </p>
        </header>

        {event.lineup && event.lineup.length > 0 && <EventLineup lineup={event.lineup} />}

        <footer className="mt-auto pt-8 border-t border-mat-800/50 flex flex-wrap gap-4 items-center" onClick={e => e.stopPropagation()}>
           <button 
              onClick={handleAction}
              className={`px-10 py-5 font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 transition-all duration-500 clip-path-slant shadow-2xl ${
                isAttending
                  ? 'bg-emerald-600 text-white scale-105 border-b-4 border-emerald-800' 
                  : isCurrentlyFree 
                    ? 'bg-mat-500 text-white hover:bg-mat-400'
                    : 'bg-mat-800 border-2 border-mat-500 text-white hover:bg-mat-700'
              }`}
            >
              {isAttending ? <CheckCircle2 size={16} /> : (isCurrentlyFree ? <ListMusic size={16} /> : <Ticket size={16} />)}
              {isCurrentlyFree 
                ? (isAttending ? 'ESTÁS EN LA LISTA' : 'APUNTARSE GRATIS') 
                : (isAttending ? 'VER MI TICKET' : `RESERVAR €${event.price}`)
              }
            </button>
            
            <button 
              onClick={() => setShowGuestList(true)}
              className={`p-3 rounded-xl border transition-all flex items-center gap-2 ${isAttending ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-mat-800 text-gray-500 border-mat-700 hover:text-white'}`}
            >
               <Users size={14} /> 
               <span className="text-[10px] font-black">{event.attendees}/{event.capacity}</span>
            </button>

            <GoogleCalendarButton event={event} />
        </footer>
      </div>

      {showGuestList && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-fade-in" onClick={() => setShowGuestList(false)}>
           <div className="w-full max-w-md bg-mat-900 border-2 border-mat-800 rounded-[3rem] p-12 relative shadow-2xl" onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowGuestList(false)} className="absolute top-10 right-10 text-gray-500 hover:text-white"><X size={28} /></button>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter font-exo mb-8">HUB_GUESTS</h2>
              <div className="max-h-60 overflow-y-auto space-y-3 custom-scrollbar pr-4">
                 {guestList.length === 0 ? <p className="text-center text-gray-700 font-black uppercase text-[10px] py-10">Sé el primero en la red...</p> : guestList.map((name, i) => (
                   <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl border ${name === userName ? 'bg-emerald-500/10 border-emerald-500' : 'bg-mat-800 border-mat-700'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${name === userName ? 'bg-emerald-500 text-white' : 'bg-mat-900 text-mat-500'}`}>
                        {name[0].toUpperCase()}
                      </div>
                      <span className="text-white font-black uppercase text-xs">{name} {name === userName && '(Tú)'}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {showNamePrompt && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-fade-in" onClick={() => setShowNamePrompt(false)}>
           <div className="w-full max-w-sm bg-mat-900 border-2 border-mat-500 rounded-[3rem] p-12 relative text-center" onClick={e => e.stopPropagation()}>
              <User className="w-12 h-12 text-mat-500 mx-auto mb-6" />
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter font-exo mb-6">Tu Alias en el Hub</h2>
              <form onSubmit={async (e) => {
                 e.preventDefault();
                 if (!tempName.trim()) return;
                 const success = await toggleRSVP(true, tempName);
                 if (success) setShowNamePrompt(false);
              }} className="space-y-6">
                 <input 
                  autoFocus 
                  type="text" 
                  value={tempName} 
                  onChange={(e) => setTempName(e.target.value)} 
                  className="w-full bg-mat-800 border-2 border-mat-700 p-5 text-white uppercase text-center text-xs font-black rounded-2xl outline-none focus:border-mat-500" 
                  placeholder="NOMBRE O ALIAS" 
                 />
                 <button type="submit" className="w-full py-5 bg-mat-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl hover:bg-mat-400 transition-colors">CONFIRMAR ACCESO</button>
              </form>
           </div>
        </div>
      )}
    </article>
  );
};