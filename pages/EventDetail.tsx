
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Ticket, ArrowLeft, Headphones, Share2, Zap, Loader2, CheckCircle2, User, X, Disc, ShieldCheck } from 'lucide-react';
import { dataService } from '../services/dataService';
import { SEO } from '../components/SEO';
import { Event } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { CachedImage } from '../components/CachedImage';
import { useEventRSVP } from '../hooks/useEventRSVP';

export const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { isAttending, guestList, userName, toggleRSVP } = useEventRSVP(id || '');
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [tempName, setTempName] = useState(userName);

  useEffect(() => {
    const load = async () => {
      if (id) {
        const data = await dataService.getEventById(id);
        if (data) setEvent(data as Event);
      }
      setLoading(false);
    };
    load();
    window.addEventListener('mat32_data_changed', load);
    return () => window.removeEventListener('mat32_data_changed', load);
  }, [id]);

  const handleAction = async () => {
    if (!event) return;
    
    const isFree = event.price === 0;
    
    if (isFree) {
      if (isAttending) {
        await toggleRSVP(false);
      } else {
        if (!userName) setShowNamePrompt(true);
        else await toggleRSVP(true);
      }
    } else {
      addToCart({
        id: `ticket-${event.id}`,
        sku: `TICKET-${event.id}`,
        title: `Entrada: ${event.title}`,
        artist: 'Mat32 Session',
        price: event.price,
        stock: 100,
        coverUrl: event.imageUrl,
        genre: 'Ticket',
        format: 'Digital',
        description: 'Acceso prioritario',
        label: 'Mat32',
        year: '2025',
        condition: 'Mint',
        discogsLink: '#',
        slug: `ticket-${event.id}`,
        tags: ['ticket'],
        status: 'published'
      } as any);
      navigate('/checkout');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-paper text-ink flex items-center justify-center">
      <Loader2 className="animate-spin w-10 h-10" style={{ color: '#c8462a' }} />
    </div>
  );

  if (!event) return (
    <div className="min-h-screen bg-paper text-ink text-center py-40">
      <h2 className="display text-4xl mb-3">Evento no encontrado.</h2>
      <p className="serif-italic text-ink-soft text-lg mb-6">No existe en la agenda.</p>
      <Link to="/events" className="mono-tag hairline px-5 py-3 hover:bg-ink hover:text-paper transition-colors">VOLVER A LA AGENDA →</Link>
    </div>
  );

  const isFree = event.price === 0;
  const seoDescription = `${event.title} · ${event.date} · ${event.time} · MAT32 Ruzafa Valencia. ${isFree ? 'Entrada libre.' : `Entrada ${event.price}€.`} Aforo: ${event.capacity} personas. ${event.description}`;

  React.useEffect(() => {
    document.body.classList.add('theme-paper');
    return () => { document.body.classList.remove('theme-paper'); };
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink pb-24">
      <SEO
        titleKey={`${event.title} | ${event.date} · MAT32 Ruzafa`}
        descriptionKey={seoDescription}
        image={event.imageUrl}
        schemaType="MusicEvent"
        event={event}
      />

      {/* HERO */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden bg-ink hairline-b">
        <CachedImage src={event.imageUrl} alt={event.title} className="w-full h-full opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        <div className="absolute bottom-10 left-0 w-full">
          <div className="container mx-auto px-6 md:px-10">
            <Link to="/events" className="mono-tag inline-flex items-center gap-2 mb-6 text-paper hover:text-bermellon transition-colors group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> VOLVER A LA AGENDA
            </Link>
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="bg-bermellon text-paper px-3 py-1.5 mono-tag flex items-center gap-2">
                <Zap size={12} /> {(event.category || 'SESIÓN').toUpperCase()}
              </div>
              {isFree && (
                <div className="bg-paper text-ink px-3 py-1.5 mono-tag flex items-center gap-2">
                  <Users size={12} /> ACCESO LIBRE
                </div>
              )}
            </div>
            <h1 className="display text-paper" style={{ fontSize: 'clamp(48px, 9vw, 132px)', lineHeight: 0.85 }}>{event.title}</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-10 py-16">
        <div className="grid lg:grid-cols-12 gap-10 md:gap-14">
          <div className="lg:col-span-8 space-y-10">
            {/* Descripción + fecha/hora */}
            <section className="hairline p-7 md:p-10 bg-paper-2 grain">
              <h2 className="mono-tag flex items-center gap-2 mb-6" style={{ color: '#c8462a' }}>
                <Disc size={12} className="animate-spin-slow" /> SESIÓN
              </h2>
              <p className="serif-italic text-2xl md:text-3xl text-ink leading-snug mb-10">"{event.description}"</p>

              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-center gap-4 hairline p-5 bg-paper hover:bg-ink hover:text-paper transition-colors">
                  <Calendar size={20} className="text-bermellon shrink-0" />
                  <div>
                    <span className="mono-tag block">FECHA</span>
                    <span className="display text-xl">{event.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 hairline p-5 bg-paper hover:bg-ink hover:text-paper transition-colors">
                  <Clock size={20} className="text-bermellon shrink-0" />
                  <div>
                    <span className="mono-tag block">HORA</span>
                    <span className="display text-xl">{event.time}</span>
                  </div>
                </div>
              </div>
            </section>

            {event.lineup && event.lineup.length > 0 && (
              <section>
                <h3 className="display text-3xl md:text-4xl hairline-b pb-3 mb-6">The selectors.</h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  {event.lineup.map((member, i) => (
                    <div key={i} className="hairline p-5 flex items-center gap-4 group hover:bg-ink hover:text-paper transition-colors">
                      <div className="w-14 h-14 bg-bermellon text-paper flex items-center justify-center display text-2xl">
                        {member.name[0].toUpperCase()}
                      </div>
                      <div>
                        <h4 className="display text-xl">{member.name}</h4>
                        <p className="mono-tag" style={{ color: '#c8462a' }}>{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {isFree && (
              <section className="hairline p-7 md:p-10 bg-paper-2">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="mono-tag flex items-center gap-2" style={{ color: '#c8462a' }}>
                    <ShieldCheck size={12} /> GUEST LIST PRIVADA
                  </h3>
                  <div className="text-right">
                    <span className="mono-tag block text-ink-soft">ESTADO AFORO</span>
                    <span className="display text-xl">{guestList.length} / {event.capacity}</span>
                  </div>
                </div>
                <p className="serif-italic text-ink-soft leading-snug">
                  "Por protocolo de privacidad de MAT32, el listado de invitados solo es visible para el personal de puerta. Tu estado de confirmación se muestra de forma privada en esta pantalla."
                </p>
                {isAttending && (
                  <div className="mt-5 flex items-center gap-3 hairline p-4 bg-bermellon text-paper">
                    <CheckCircle2 size={20} />
                    <div>
                      <p className="mono-tag !text-[11px] text-paper">ID CONFIRMADA: {userName.toUpperCase()}</p>
                      <p className="serif-italic text-sm text-paper/80">Tu señal está activa en la puerta.</p>
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>

          <aside className="lg:col-span-4 space-y-3">
            {/* TICKET CARD */}
            <div className={`hairline p-7 ${isAttending ? 'bg-bermellon text-paper' : 'bg-paper-2'}`}>
              <h3 className="mono-tag" style={{ color: isAttending ? 'rgba(241,232,216,0.8)' : '#c8462a' }}>
                {isAttending ? 'ACCESO CONFIRMADO' : 'ENTRADA'}
              </h3>
              <p className="mono-tag mt-1" style={{ color: isAttending ? 'rgba(241,232,216,0.6)' : undefined }}>
                {isFree ? 'GESTIÓN DE LISTA' : 'TICKET DIGITAL'}
              </p>

              <div className="my-6">
                <span className="display" style={{ fontSize: 'clamp(56px, 10vw, 88px)', lineHeight: 0.9 }}>
                  {isFree ? 'FREE' : `€${event.price}`}
                </span>
              </div>

              <button onClick={handleAction}
                className={`w-full py-4 mono-tag !text-[12px] !tracking-[0.4em] flex items-center justify-center gap-3 transition-colors ${
                  isAttending ? 'bg-paper text-ink hover:bg-ink hover:text-paper' : 'bg-bermellon text-paper hover:bg-ink'
                }`}>
                {isAttending ? (
                  <><CheckCircle2 size={16} /> ESTÁS EN LA LISTA</>
                ) : (
                  <>{isFree ? <Users size={16} /> : <Ticket size={16} />} {isFree ? 'UNIRSE A LA LISTA' : 'COMPRAR TICKET'}</>
                )}
              </button>
            </div>

            {/* UBICACIÓN */}
            <div className="hairline p-7 bg-paper">
              <div className="mono-tag flex items-center gap-2 mb-3" style={{ color: '#c8462a' }}>
                <MapPin size={12} /> UBICACIÓN
              </div>
              <p className="display text-lg">MAT32</p>
              <p className="serif-italic text-ink-soft mt-1 leading-snug">
                Calle Matías Perelló 32<br/>46005 Valencia, Ruzafa
              </p>
              <a href="https://maps.google.com/?q=Mat32+Valencia" target="_blank" rel="noopener"
                className="mono-tag mt-4 inline-flex items-center gap-2 hover:text-ink transition-colors" style={{ color: '#c8462a' }}>
                VER EN GOOGLE MAPS <Share2 size={10} />
              </a>
            </div>
          </aside>
        </div>
      </div>

      {/* NAME PROMPT MODAL */}
      {showNamePrompt && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-ink/90 animate-fade-in" onClick={() => setShowNamePrompt(false)}>
          <div className="w-full max-w-sm bg-paper hairline p-8 relative text-center" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 bg-bermellon text-paper flex items-center justify-center mx-auto mb-6">
              <User size={28} />
            </div>
            <h2 className="display text-3xl">Identidad lista.</h2>
            <p className="serif-italic text-ink-soft text-lg mt-2 mb-6">Dinos cómo quieres aparecer en la lista de puerta.</p>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!tempName.trim()) return;
              const success = await toggleRSVP(true, tempName);
              if (success) setShowNamePrompt(false);
            }} className="space-y-3">
              <input autoFocus type="text" value={tempName} onChange={(e) => setTempName(e.target.value)}
                className="w-full bg-paper hairline p-4 text-ink text-center mono-tag !text-[11px] !tracking-[0.15em] !normal-case outline-none focus:border-bermellon transition-colors"
                placeholder="Tu alias o nombre" />
              <button type="submit" className="w-full bg-bermellon text-paper py-4 mono-tag !text-[12px] !tracking-[0.5em] hover:bg-ink transition-colors">
                CONFIRMAR ACCESO →
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
