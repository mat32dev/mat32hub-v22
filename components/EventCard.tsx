import React, { useState } from 'react';
import { Calendar, Clock, Ticket, ListMusic, User, X, Users, CheckCircle2, Pin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Event } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { CachedImage } from './CachedImage';
import { useEventRSVP } from '../hooks/useEventRSVP';
import { EventBadge, EventLineup, GoogleCalendarButton } from './EventCardParts';

interface EventCardProps {
  event: Event;
  isPast?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, isPast = false }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAttending, guestList, userName, toggleRSVP } = useEventRSVP(event.id);
  
  const [showGuestList, setShowGuestList] = useState(false);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [tempName, setTempName] = useState(userName);

  const getDayName = (dateStr: string) => {
    const days = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
    const date = new Date(dateStr);
    return days[date.getDay()];
  };

  const handleAction = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isPast) return;

    if (event.price === 0) {
      if (isAttending) await toggleRSVP(false);
      else if (!userName) setShowNamePrompt(true);
      else await toggleRSVP(true);
    } else {
      if (isAttending) { navigate('/checkout'); return; }
      addToCart(event as any);
      navigate('/checkout');
    }
  };

  return (
    <article 
      onClick={() => navigate(`/events/${event.id}`)}
      className={`bg-mat-900 border transition-all duration-500 flex flex-col md:flex-row overflow-hidden group rounded-[2rem] relative cursor-pointer ${
        isPast ? 'opacity-50 grayscale border-mat-800' : 'border-mat-800 hover:border-mat-500 shadow-xl'
      }`}
    >
      {/* POST-IT DAY BANNER */}
      {!isPast && (
        <div className="absolute top-4 -right-1 z-30 transform rotate-2">
          <div className="bg-mat-400 text-mat-900 font-black text-[10px] tracking-widest px-4 py-1.5 shadow-lg flex items-center gap-2 border-b-2 border-black/10">
            <Pin size={10} /> {getDayName(event.date)}
          </div>
        </div>
      )}

      <div className="md:w-1/3 relative bg-black flex-shrink-0">
        <CachedImage 
          src={event.imageUrl} 
          alt={event.title} 
          className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity"
        />
        {isAttending && !isPast && (
          <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-[2px] flex items-center justify-center">
            <CheckCircle2 size={40} className="text-white drop-shadow-lg" />
          </div>
        )}
      </div>
      
      <div className="flex-1 p-8 md:p-10 flex flex-col">
        <header className="mb-4">
          <div className="flex items-center gap-3 text-mat-500 font-bold text-[10px] uppercase mb-2">
            <Calendar size={12} /> {event.date} <span>•</span> <Clock size={12} /> {event.time}
          </div>
          <h3 className="text-3xl font-black uppercase font-exo text-white group-hover:text-mat-500 transition-colors">
            {event.title}
          </h3>
          <p className="text-gray-500 text-sm italic mt-2 line-clamp-2">
            {event.description}
          </p>
        </header>

        <div className="mt-auto pt-6 border-t border-mat-800 flex items-center justify-between">
           {!isPast ? (
             <button 
                onClick={handleAction}
                className={`px-8 py-4 font-black uppercase text-[10px] tracking-widest rounded-xl transition-all ${
                  isAttending ? 'bg-emerald-600 text-white' : 'bg-mat-500 text-white hover:bg-mat-400 shadow-lg'
                }`}
              >
                {isAttending ? 'ESTÁS EN LA LISTA' : (event.price === 0 ? 'APUNTARSE GRATIS' : `RESERVAR €${event.price}`)}
              </button>
           ) : (
             <span className="text-gray-600 font-bold uppercase text-[10px] tracking-widest">SESIÓN FINALIZADA</span>
           )}
           
           {!isPast && (
             <div className="flex gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowGuestList(true); }}
                  className="p-3 bg-mat-800 text-gray-500 hover:text-white rounded-xl transition-all"
                >
                   <Users size={16} />
                </button>
                <GoogleCalendarButton event={event} />
             </div>
           )}
        </div>
      </div>

      {showGuestList && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md animate-fade-in" onClick={() => setShowGuestList(false)}>
           <div className="w-full max-w-sm bg-mat-900 border border-mat-700 rounded-3xl p-10 relative" onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowGuestList(false)} className="absolute top-6 right-6 text-gray-500"><X size={24} /></button>
              <h2 className="text-2xl font-black text-white uppercase font-exo mb-6">ASISTENTES</h2>
              <div className="max-h-60 overflow-y-auto space-y-2 custom-scrollbar">
                 {guestList.length === 0 ? <p className="text-gray-600 italic text-xs">Aún no hay asistentes.</p> : guestList.map((name, i) => (
                   <div key={i} className="flex items-center gap-3 p-3 bg-mat-800 rounded-xl border border-mat-700">
                      <div className="w-6 h-6 rounded-full bg-mat-500 flex items-center justify-center text-[10px] font-black">{name[0]}</div>
                      <span className="text-white text-xs font-bold uppercase">{name} {name === userName && '(Tú)'}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {showNamePrompt && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md animate-fade-in" onClick={() => setShowNamePrompt(false)}>
           <div className="w-full max-w-sm bg-mat-900 border border-mat-500 rounded-3xl p-10 relative text-center" onClick={e => e.stopPropagation()}>
              <h2 className="text-2xl font-black text-white uppercase font-exo mb-2">IDENTIFICACIÓN</h2>
              <p className="text-gray-500 text-xs mb-8 italic">Introduce tu nombre o alias para la lista.</p>
              <form onSubmit={async (e) => {
                 e.preventDefault();
                 if (!tempName.trim()) return;
                 const success = await toggleRSVP(true, tempName);
                 if (success) setShowNamePrompt(false);
              }} className="space-y-4">
                 <input autoFocus value={tempName} onChange={e => setTempName(e.target.value)} className="w-full bg-mat-800 border-2 border-mat-700 p-4 text-white text-center font-bold rounded-xl outline-none focus:border-mat-500" placeholder="NOMBRE" />
                 <button type="submit" className="w-full py-4 bg-mat-500 text-white font-black uppercase rounded-xl">CONFIRMAR</button>
              </form>
           </div>
        </div>
      )}
    </article>
  );
};