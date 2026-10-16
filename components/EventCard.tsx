import React, { useState } from 'react';
import { Calendar, Clock, X, Users, CheckCircle2, Pin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Event } from '../types';
import { useCart } from '../context/CartContext';
import { CachedImage } from './CachedImage';
import { useEventRSVP } from '../hooks/useEventRSVP';
import { GoogleCalendarButton } from './EventCardParts';
import { slugFor } from '../pages/ArtistDetail';

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

  const goGenre = (e: React.MouseEvent, g: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/events?genero=${encodeURIComponent(g)}`);
  };
  const goArtist = (e: React.MouseEvent, name: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/artista/${slugFor(name)}`);
  };

  const d = new Date(event.date);
  const dia = String(d.getDate()).padStart(2,'0');
  const mes = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'][d.getMonth()];

  return (
    <article
      onClick={() => navigate(`/events/${event.id}`)}
      className={`group window-panel relative cursor-pointer ${
        isPast
          ? 'opacity-55 grayscale'
          : isAttending
            ? 'ring-2 ring-bermellon'
            : 'hover:opacity-90 transition-opacity'
      }`}
    >
      <div className="window-titlebar">
        <span className="flex items-center gap-2">
          <Calendar size={11} /> {dia} {mes} <span className="opacity-50">·</span> <Clock size={11} /> {event.time}
        </span>
        {!isPast && <span style={{ color: '#09aea1' }}>{getDayName(event.date)}</span>}
      </div>
      <div className="window-body">
        <div className="flex flex-col md:flex-row gap-4">
          {/* IMAGE */}
          <div className="md:w-1/3 relative bg-ink flex-shrink-0 overflow-hidden">
            <CachedImage src={eventImageSrc} alt={event.title} className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity" />
            {isAttending && !isPast && (
              <div className="absolute inset-0 bg-bermellon/30 flex items-center justify-center">
                <CheckCircle2 size={36} className="text-paper" />
              </div>
            )}
          </div>

          {/* CONTENT */}
          <div className="flex-1 flex flex-col">
            <header className="mb-2">
              <h3 className="display mt-1" style={{ fontSize: 'clamp(22px, 2.4vw, 32px)', lineHeight: 0.95 }}>
                {event.title}
              </h3>
              {event.description && <p className="serif-italic text-ink-soft mt-2 text-sm leading-snug line-clamp-2">{event.description}</p>}

              {/* SELECTORS · clicables → perfil */}
              {!!event.lineup?.length && (
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="mono-tag !text-[9px] text-ink/40">EN CABINA</span>
                  {event.lineup.map((m, i) => (
                    <React.Fragment key={i}>
                      <span
                        onClick={e => goArtist(e, m.name)}
                        className="mono-tag !text-[10px] px-2.5 py-1 hairline text-ink hover:bg-ink hover:text-paper transition-colors cursor-pointer"
                        title={`Ver perfil de ${m.name}`}>
                        {m.name}
                      </span>
                      {i < event.lineup.length - 1 && <span className="text-ink/30">+</span>}
                    </React.Fragment>
                  ))}
                </div>
              )}

              {/* GÉNEROS · clicables → agenda filtrada */}
              {!!event.vibe?.length && (
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="mono-tag !text-[9px] text-ink/40">SONIDO</span>
                  {event.vibe.slice(0, 4).map((g, i) => (
                    <span
                      key={i}
                      onClick={e => goGenre(e, g)}
                      className="mono-tag !text-[9px] px-2 py-0.5 border transition-colors cursor-pointer text-bermellon hover:bg-bermellon hover:text-paper"
                      style={{ borderColor: '#c8462a' }}
                      title={`Ver próximos eventos de ${g}`}>
                      {g}
                    </span>
                  ))}
                </div>
              )}
            </header>

            <div className="mt-auto flex flex-wrap items-center gap-3 justify-between">
              {!isPast ? (
                event.price === 0 ? (
                  isAttending ? (
                    <button onClick={handleLeave} className="px-5 py-2.5 mono-tag bg-bermellon text-paper hover:bg-ink-2 transition-colors">
                      ESTÁS EN LA LISTA
                    </button>
                  ) : (
                    <button onClick={openModal} className="px-5 py-2.5 mono-tag bg-bermellon text-paper hover:bg-ink-2 transition-colors">
                      APUNTARSE GRATIS
                    </button>
                  )
                ) : (
                  <button onClick={handlePaidAction} className={`px-5 py-2.5 mono-tag transition-colors ${isAttending ? 'bg-paper-2 text-ink' : 'bg-bermellon text-paper hover:bg-ink-2'}`}>
                    {isAttending ? 'ESTÁS EN LA LISTA' : `RESERVAR €${event.price}`}
                  </button>
                )
              ) : (
                <span className="mono-tag text-ink-soft">SESIÓN FINALIZADA</span>
              )}

              {!isPast && (
                <div className="flex gap-2">
                  <button onClick={openModal} className={`p-2.5 hairline transition-colors ${isAttending ? 'bg-bermellon text-paper' : 'hover:bg-ink hover:text-paper group-hover:hairline-ink'}`} title="Lista de asistentes">
                    <Users size={14} />
                  </button>
                  <GoogleCalendarButton event={event} />
                </div>
              )}
            </div>

            {/* HAPPY HOUR STRIP */}
            {!isPast && (
              <div className="mt-3 pt-2 mono-tag flex flex-wrap items-center gap-x-4 gap-y-0.5" style={{ color: '#09aea1' }}>
                <span className="!text-[9px]">HAPPY HOUR · Cerveza 1×3€ 2×5€ · Tabla Jamón</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* GUEST LIST MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-ink/90 animate-fade-in" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-sm bg-paper text-ink hairline p-6 relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-ink-soft hover:text-bermellon transition-colors">
              <X size={20} />
            </button>
            <h2 className="display text-2xl mb-1">{event.title}</h2>
            <p className="mono-tag mb-6" style={{ color: '#c8462a' }}>GUEST LIST</p>
            <div className="flex items-center gap-3 p-3 hairline bg-paper-2 mb-5">
              <Users size={14} className="text-bermellon shrink-0" />
              <p className="mono-tag !text-[10px] text-ink">
                {guestList.length === 0 ? 'SÉ EL PRIMERO EN APUNTARTE' : `${guestList.length} PERSONA${guestList.length > 1 ? 'S' : ''} APUNTADA${guestList.length > 1 ? 'S' : ''}`}
              </p>
            </div>
            {isAttending ? (
              <div className="flex items-center gap-3 p-3 hairline bg-bermellon text-paper">
                <CheckCircle2 size={18} className="shrink-0" />
                <p className="mono-tag !text-[10px]">ESTÁS EN LA LISTA</p>
              </div>
            ) : (
              <form onSubmit={handleJoin} className="space-y-3">
                <input autoFocus value={tempName} onChange={e => setTempName(e.target.value)}
                  className="w-full hairline p-3 text-ink mono-tag !text-[11px] !tracking-[0.15em] !normal-case outline-none focus:border-bermellon transition-colors"
                  placeholder="TU NOMBRE O ALIAS" />
                <button type="submit" disabled={isSubmitting}
                  className="w-full py-3 bg-bermellon text-paper mono-tag hover:bg-ink transition-colors disabled:opacity-50">
                  {isSubmitting ? 'GUARDANDO…' : 'UNIRSE A LA LISTA →'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </article>
  );
};
