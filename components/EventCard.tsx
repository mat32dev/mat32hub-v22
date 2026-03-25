import React, { useState } from 'react';
import { Calendar, Clock, X, Users, CheckCircle2, Pin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Event } from '../types';
import { useCart } from '../context/CartContext';
import { CachedImage } from './CachedImage';
import { useEventRSVP } from '../hooks/useEventRSVP';
import { GoogleCalendarButton } from './EventCardParts';

// IDs de las fotos del hero home — no son flyers de eventos
const HERO_IMAGE_IDS = [
  '7701241e-71ee-4929-18c0-d1d0d9576e00',
  '38cbbb12-3f05-47c5-697b-f932d8f99700',
  '8835f005-f545-4434-c67a-b2154de2da00',
];

function isHeroImage(url: string): boolean {
  return HERO_IMAGE_IDS.some(id => url?.includes(id));
}

interface EventCardProps {
  event: Event;
  isPast?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, isPast = false }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAttending, guestList, userName, toggleRSVP } = useEventRSVP(event.id);

  const [showModal, setShowModal] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getDayName = (dateStr: string) => {
    const days = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
    return days[new Date(dateStr).getDay()];
  };

  const openModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isPast) return;
    setShowModal(true);
  };

  const handleJoin = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!tempName.trim()) return;
    setIsSubmitting(true);
    const success = await toggleRSVP(true, tempName);
    setIsSubmitting(false);
    if (success) setShowModal(false);
  };

  const handleLeave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleRSVP(false);
  };

  const handlePaidAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAttending) { navigate('/checkout'); return; }
    addToCart(event as any);
    navigate('/checkout');
  };

  const eventImageSrc = isHeroImage(event.imageUrl ?? '') ? '' : (event.imageUrl ?? '');

  return (
    <article
      onClick={() => navigate(`/events/${event.id}`)}
      className={`bg-mat-900 border transition-all duration-500 flex flex-col md:flex-row group rounded-[2rem] relative cursor-pointer ${
        isPast
          ? 'opacity-50 grayscale border-mat-800 overflow-hidden'
          : isAttending
            ? 'border-emerald-500 shadow-xl shadow-emerald-900/20'
            : 'border-mat-800 hover:border-mat-500 shadow-xl'
      }`}
    >
      {/* DAY BANNER — fuera del overflow-hidden para que no se clipee */}
      {!isPast && (
        <div className="absolute top-4 right-0 z-30 transform rotate-2">
          <div className="bg-mat-400 text-mat-900 font-black text-[10px] tracking-widest px-4 py-1.5 shadow-lg flex items-center gap-2 border-b-2 border-black/10">
            <Pin size={10} /> {getDayName(event.date)}
          </div>
        </div>
      )}

      {/* IMAGE */}
      <div className="md:w-1/3 relative bg-black flex-shrink-0 overflow-hidden rounded-t-[2rem] md:rounded-l-[2rem] md:rounded-tr-none">
        <CachedImage
          src={eventImageSrc}
          alt={event.title}
          className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity"
        />
        {isAttending && !isPast && (
          <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-[2px] flex items-center justify-center">
            <CheckCircle2 size={40} className="text-white drop-shadow-lg" />
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-4 md:p-8 flex flex-col overflow-hidden">
        <header className="mb-4">
          <div className="flex items-center gap-3 text-mat-500 font-bold text-[10px] uppercase mb-2 flex-wrap">
            <Calendar size={12} /> {event.date} <span>•</span> <Clock size={12} /> {event.time}
          </div>
          <h3 className="text-2xl md:text-3xl font-black uppercase font-exo text-white group-hover:text-mat-500 transition-colors leading-tight">
            {event.title}
          </h3>
          <p className="text-gray-500 text-sm italic mt-2 line-clamp-2">{event.description}</p>
        </header>

        <div className="mt-auto pt-4 md:pt-6 border-t border-mat-800 flex flex-wrap items-center gap-3 justify-between">
          {!isPast ? (
            event.price === 0 ? (
              isAttending ? (
                <button
                  onClick={handleLeave}
                  className="px-6 py-3 md:px-8 md:py-4 font-black uppercase text-[10px] tracking-widest rounded-xl bg-emerald-600 text-white hover:bg-red-700 transition-all"
                >
                  ESTÁS EN LA LISTA
                </button>
              ) : (
                <button
                  onClick={openModal}
                  className="px-6 py-3 md:px-8 md:py-4 font-black uppercase text-[10px] tracking-widest rounded-xl bg-mat-500 text-white hover:bg-mat-400 shadow-lg transition-all"
                >
                  APUNTARSE GRATIS
                </button>
              )
            ) : (
              <button
                onClick={handlePaidAction}
                className={`px-6 py-3 md:px-8 md:py-4 font-black uppercase text-[10px] tracking-widest rounded-xl transition-all ${
                  isAttending ? 'bg-emerald-600 text-white' : 'bg-mat-500 text-white hover:bg-mat-400 shadow-lg'
                }`}
              >
                {isAttending ? 'ESTÁS EN LA LISTA' : `RESERVAR €${event.price}`}
              </button>
            )
          ) : (
            <span className="text-gray-600 font-bold uppercase text-[10px] tracking-widest">SESIÓN FINALIZADA</span>
          )}

          {!isPast && (
            <div className="flex gap-2">
              <button
                onClick={openModal}
                className={`p-3 rounded-xl transition-all ${
                  isAttending ? 'bg-emerald-600/20 text-emerald-400' : 'bg-mat-800 text-gray-500 hover:text-white'
                }`}
                title="Lista de asistentes"
              >
                <Users size={16} />
              </button>
              <GoogleCalendarButton event={event} />
            </div>
          )}
        </div>
      </div>

      {/* UNIFIED GUEST LIST MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md animate-fade-in"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-sm bg-mat-900 border border-mat-700 rounded-3xl p-6 relative"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setShowModal(false)} className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors">
              <X size={22} />
            </button>

            <h2 className="text-2xl font-black text-white uppercase font-exo mb-1">{event.title}</h2>
            <p className="text-mat-500 text-[10px] font-black uppercase tracking-widest mb-6">GUEST LIST</p>

            {/* Attendee count — names are private */}
            <div className="flex items-center gap-3 p-4 bg-mat-800 border border-mat-700 rounded-2xl mb-6">
              <Users size={16} className="text-mat-500 shrink-0" />
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                {guestList.length === 0
                  ? 'Sé el primero en apuntarte'
                  : `${guestList.length} persona${guestList.length > 1 ? 's' : ''} apuntada${guestList.length > 1 ? 's' : ''}`}
              </p>
            </div>

            {/* Join form or status */}
            {isAttending ? (
              <div className="flex items-center gap-3 p-4 bg-emerald-900/30 border border-emerald-500/40 rounded-2xl">
                <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                <p className="text-emerald-400 text-xs font-black uppercase tracking-widest">Estás en la lista</p>
              </div>
            ) : (
              <form onSubmit={handleJoin} className="space-y-3">
                <input
                  autoFocus
                  value={tempName}
                  onChange={e => setTempName(e.target.value)}
                  className="w-full bg-mat-800 border-2 border-mat-700 p-4 text-white text-center font-bold rounded-xl outline-none focus:border-mat-500 transition-all text-sm"
                  placeholder="TU NOMBRE O ALIAS"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-mat-500 hover:bg-mat-400 text-white font-black uppercase text-[11px] tracking-widest rounded-xl transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'GUARDANDO...' : 'UNIRSE A LA LISTA'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </article>
  );
};
