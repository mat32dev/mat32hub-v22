
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
    <div className="min-h-screen bg-mat-900 flex items-center justify-center">
      <Loader2 className="animate-spin text-mat-500 w-12 h-12" />
    </div>
  );

  if (!event) return (
    <div className="min-h-screen bg-mat-900 text-center py-40 text-white">
      <h2 className="text-3xl font-black uppercase font-exo mb-4">Señal perdida...</h2>
      <p className="text-gray-500 italic mb-8">El evento solicitado no existe en la matriz.</p>
      <Link to="/events" className="text-mat-500 font-black uppercase tracking-widest border-b-2 border-mat-500 pb-1">Volver a la Agenda</Link>
    </div>
  );

  const isFree = event.price === 0;
  const seoDescription = `${event.title} · ${event.date} · ${event.time} · MAT32 Ruzafa Valencia. ${isFree ? 'Entrada libre.' : `Entrada ${event.price}€.`} Aforo: ${event.capacity} personas. ${event.description}`;

  return (
    <div className="min-h-screen bg-mat-900 pb-24 font-sans">
      <SEO
        titleKey={`${event.title} | ${event.date} · MAT32 Ruzafa`}
        descriptionKey={seoDescription}
        image={event.imageUrl}
        schemaType="MusicEvent"
        event={event}
      />
      
      <div className="relative h-[70vh] overflow-hidden">
        <CachedImage src={event.imageUrl} alt={event.title} className="w-full h-full opacity-60 grayscale hover:grayscale-0 transition-all duration-1000" />
        <div className="absolute inset-0 bg-gradient-to-t from-mat-900 via-mat-900/20 to-transparent"></div>
        <div className="absolute bottom-16 left-0 w-full">
           <div className="container mx-auto px-6">
              <Link to="/events" className="inline-flex items-center gap-2 text-mat-500 font-black uppercase text-[10px] tracking-widest mb-8 hover:text-white transition-colors group">
                <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> VOLVER A LA AGENDA
              </Link>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-mat-500 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded shadow-xl">
                   <Zap className="w-4 h-4 animate-pulse" /> {(event.category || 'Sesión').toUpperCase()}
                </div>
                {isFree && (
                  <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded shadow-xl">
                     <Users className="w-4 h-4" /> ACCESO_LIBRE
                  </div>
                )}
              </div>
              <h1 className="text-6xl md:text-9xl font-black uppercase text-white tracking-tighter font-exo leading-[0.85] mb-4">{event.title}</h1>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-12 gap-16 md:gap-24">
           <div className="lg:col-span-8 space-y-16">
              <section className="bg-mat-800/50 p-10 md:p-16 border-2 border-mat-700 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
                 <h2 className="text-2xl font-black text-mat-500 uppercase tracking-tighter mb-10 font-exo flex items-center gap-4">
                    <Disc className="animate-spin-slow" size={24} /> PROTOCOLO DE SESIÓN
                 </h2>
                 <p className="text-white text-2xl md:text-3xl font-light italic leading-relaxed mb-12">"{event.description}"</p>
                 
                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="flex items-center gap-6 bg-mat-900/80 p-8 rounded-3xl border border-mat-700 hover:border-mat-500 transition-colors">
                       <div className="p-4 bg-mat-800 rounded-2xl text-mat-500"><Calendar size={28} /></div>
                       <div>
                          <span className="block text-[10px] text-gray-600 font-black tracking-widest uppercase mb-1">FECHA_MATRIZ</span>
                          <span className="text-white font-black text-xl uppercase tracking-tighter font-exo">{event.date}</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-6 bg-mat-900/80 p-8 rounded-3xl border border-mat-700 hover:border-mat-500 transition-colors">
                       <div className="p-4 bg-mat-800 rounded-2xl text-mat-500"><Clock size={28} /></div>
                       <div>
                          <span className="block text-[10px] text-gray-600 font-black tracking-widest uppercase mb-1">HORA_MATRIZ</span>
                          <span className="text-white font-black text-xl uppercase tracking-tighter font-exo">{event.time}</span>
                       </div>
                    </div>
                 </div>
              </section>

              {event.lineup && event.lineup.length > 0 && (
                <section className="space-y-10">
                   <h3 className="text-3xl font-black text-white uppercase tracking-tighter font-exo border-b-4 border-mat-500 inline-block">THE_SELECTORS</h3>
                   <div className="grid sm:grid-cols-2 gap-8">
                      {event.lineup.map((member, i) => (
                         <div key={i} className="bg-mat-800 p-10 rounded-[2.5rem] border border-mat-700 flex items-center gap-6 group hover:border-mat-500 transition-all">
                            <div className="w-16 h-16 bg-mat-900 rounded-2xl flex items-center justify-center text-mat-500 font-black text-2xl group-hover:bg-mat-500 group-hover:text-white transition-all shadow-xl">
                               {member.name[0].toUpperCase()}
                            </div>
                            <div>
                               <h4 className="text-xl font-black text-white uppercase tracking-tight">{member.name}</h4>
                               <p className="text-[10px] font-black text-mat-500 uppercase tracking-widest">{member.role}</p>
                            </div>
                         </div>
                      ))}
                   </div>
                </section>
              )}

              {isFree && (
                <section className="bg-mat-950 border-2 border-mat-800 p-10 md:p-16 rounded-[3.5rem] shadow-inner space-y-8 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-5">
                      <ShieldCheck size={120} />
                   </div>
                   <div className="flex items-center justify-between relative z-10">
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter font-exo flex items-center gap-4">
                         <ShieldCheck className="text-emerald-500" size={28} /> PRIVACY_GUEST_LIST
                      </h3>
                      <div className="text-right">
                         <span className="block text-[10px] font-black text-gray-600 uppercase tracking-widest">ESTADO_AFORO</span>
                         <span className="text-xl font-black text-white font-exo">{guestList.length} / {event.capacity}</span>
                      </div>
                   </div>
                   <div className="p-8 bg-mat-900/50 border border-mat-800 rounded-3xl relative z-10">
                      <p className="text-gray-500 italic text-sm leading-relaxed">
                        "Por protocolo de privacidad de Mat32, el listado de invitados solo es visible para el personal de puerta. Tu estado de confirmación se muestra de forma privada en esta pantalla."
                      </p>
                   </div>
                   {isAttending && (
                     <div className="flex items-center gap-4 p-6 bg-emerald-500/10 border border-emerald-500 rounded-2xl animate-fade-in relative z-10">
                        <CheckCircle2 className="text-emerald-500" size={24} />
                        <div>
                           <p className="text-xs font-black text-white uppercase">ID_CONFIRMADA: {userName.toUpperCase()}</p>
                           <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">TU SEÑAL ESTÁ ACTIVA EN LA PUERTA</p>
                        </div>
                     </div>
                   )}
                </section>
              )}
           </div>

           <aside className="lg:col-span-4 space-y-8">
              <div className={`p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden transition-all duration-700 border-2 ${isAttending ? 'bg-emerald-600 border-emerald-400' : 'bg-mat-800 border-mat-700'}`}>
                 <div className={`absolute top-0 left-0 w-full h-1.5 ${isAttending ? 'bg-white' : 'bg-mat-500'}`}></div>
                 
                 <div className="relative z-10">
                    <h3 className="text-2xl font-black uppercase font-exo mb-2 text-white">
                      {isAttending ? 'ACCESO_CONFIRMADO' : 'PROTOCOL_ENTRY'}
                    </h3>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-10 opacity-70 text-white">
                      {isFree ? 'GESTIÓN DE LISTA PRIVADA' : 'ADQUISICIÓN DE TICKETS DIGITALES'}
                    </p>

                    <div className="flex items-baseline gap-4 mb-10">
                       <span className="text-7xl font-black text-white font-exo leading-none">
                         {isFree ? 'FREE' : `€${event.price}`}
                       </span>
                    </div>

                    <button 
                      onClick={handleAction}
                      className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-4 transition-all shadow-2xl hover:-translate-y-1 active:scale-95 ${
                        isAttending 
                          ? 'bg-white text-emerald-600' 
                          : 'bg-mat-500 text-white hover:bg-mat-400'
                      }`}
                    >
                       {isAttending ? (
                         <>
                           <CheckCircle2 size={20} /> ESTÁS EN LA LISTA
                         </>
                       ) : (
                         <>
                           {isFree ? <Users size={20} /> : <Ticket size={20} />}
                           {isFree ? 'UNIRSE AL HUB' : 'COMPRAR TICKET'}
                         </>
                       )}
                    </button>
                 </div>
              </div>

              <div className="bg-mat-800 border border-mat-700 p-10 rounded-[3rem] shadow-xl overflow-hidden relative group">
                 <div className="flex items-center gap-4 mb-6">
                    <MapPin className="text-mat-500" size={24} />
                    <h4 className="text-lg font-black text-white uppercase tracking-tighter font-exo">UBICACIÓN</h4>
                 </div>
                 <p className="text-white text-sm font-black uppercase tracking-tight mb-6">
                    Mat32 Discos Bar<br/>
                    Calle Matías Perelló, 32<br/>
                    46005 Valencia, Ruzafa
                 </p>
                 <a 
                   href="https://maps.google.com/?q=Mat32+Valencia" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-[10px] font-black text-mat-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2"
                 >
                    VER EN GOOGLE MAPS <Share2 size={12} />
                 </a>
              </div>
           </aside>
        </div>
      </div>

      {showNamePrompt && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-fade-in" onClick={() => setShowNamePrompt(false)}>
           <div className="w-full max-w-sm bg-mat-900 border-2 border-mat-500 rounded-[3.5rem] p-12 relative text-center shadow-[0_0_100px_rgba(234,88,12,0.2)]" onClick={e => e.stopPropagation()}>
              <div className="w-20 h-20 bg-mat-800 rounded-full flex items-center justify-center mx-auto mb-8 border border-mat-700">
                <User className="w-10 h-10 text-mat-500" />
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter font-exo mb-4">IDENTIDAD_HUB</h2>
              <p className="text-gray-500 italic text-sm mb-8">Dinos cómo quieres aparecer en el listado de puerta.</p>
              
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
                  className="w-full bg-mat-800 border-2 border-mat-700 p-6 text-white uppercase text-center text-xs font-black rounded-2xl outline-none focus:border-mat-500 transition-all" 
                  placeholder="TU ALIAS / NOMBRE" 
                 />
                 <button type="submit" className="w-full py-6 bg-mat-500 text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl shadow-xl hover:bg-mat-400 transition-all">
                    CONFIRMAR_ACCESO
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};
