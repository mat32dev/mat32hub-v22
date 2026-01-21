
import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, Headphones, ArrowRight, Loader2, 
  Plus, Radio, Disc, Clock, Volume2, MessageSquare, Music
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { dataService } from '../services/dataService';
import { SelectorSubmission, Event } from '../types';

const GuestCard: React.FC<{ selector: SelectorSubmission | (Event & { type: 'event' }) }> = ({ selector }) => {
  const [isNear, setIsNear] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const isEvent = 'type' in selector && selector.type === 'event';
  const name = isEvent ? (selector as Event).title : (selector as SelectorSubmission).artistName;
  const bio = isEvent ? (selector as Event).description : (selector as SelectorSubmission).bio;
  const genres = isEvent ? [(selector as Event).category] : (selector as SelectorSubmission).genres;
  const img = isEvent ? (selector as Event).imageUrl : (selector as SelectorSubmission).avatarUrl || `https://i.pravatar.cc/150?u=${name}`;
  const mixUrl = isEvent ? null : (selector as SelectorSubmission).mixUrl;

  const getEmbedUrl = (url: string) => {
    if (url.includes('soundcloud.com')) {
      const encodedUrl = encodeURIComponent(url);
      return `https://w.soundcloud.com/player/?url=${encodedUrl}&color=%23ea580c&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`;
    }
    if (url.includes('mixcloud.com')) {
       const encodedUrl = encodeURIComponent(url);
       return `https://www.mixcloud.com/widget/iframe/?hide_cover=1&light=0&feed=${encodedUrl}`;
    }
    return null;
  };

  const embedUrl = !isEvent && mixUrl ? getEmbedUrl(mixUrl) : null;

  return (
    <div ref={cardRef} className="bg-mat-800 border-2 border-mat-700 rounded-[2.5rem] overflow-hidden shadow-2xl hover:border-mat-500 transition-all group animate-fade-in flex flex-col h-full relative">
      {isEvent && (
        <div className="absolute top-6 left-6 z-10 bg-mat-500 text-white text-[8px] font-black uppercase px-4 py-1.5 rounded-full shadow-xl">
           CURATED EVENT
        </div>
      )}
      <div className="p-8 pb-4 flex-1">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-20 h-20 bg-mat-900 border-2 border-mat-700 rounded-2xl overflow-hidden shadow-lg relative flex-shrink-0">
             <img 
               src={img} 
               className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
               alt={name} 
               loading="lazy"
             />
          </div>
          <div className="min-w-0">
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter font-exo truncate leading-none mb-2">{name}</h3>
            <div className="flex flex-wrap gap-1.5">
              {genres.map((g, i) => (
                <span key={i} className="text-[8px] font-black text-mat-500 bg-mat-900 px-2 py-0.5 rounded border border-mat-700 uppercase tracking-widest">{g}</span>
              ))}
            </div>
          </div>
        </div>
        <p className="text-gray-400 text-sm italic line-clamp-3 mb-6 leading-relaxed">"{bio}"</p>
      </div>

      <div className="px-8 pb-8 mt-auto min-h-[140px]">
        {isEvent ? (
          <Link to={`/events`} className="w-full h-[120px] bg-mat-500/10 rounded-2xl border border-mat-500 flex flex-col items-center justify-center gap-3 group/btn">
             <Clock className="w-8 h-8 text-mat-500" />
             <span className="text-[10px] font-black text-white uppercase tracking-widest group-hover/btn:scale-110 transition-transform">Ver Detalles</span>
          </Link>
        ) : (embedUrl && isNear ? (
          <div className="relative rounded-2xl overflow-hidden border border-mat-700 bg-black/40 shadow-inner animate-fade-in">
            <iframe 
              width="100%" 
              height={mixUrl?.includes('soundcloud') ? "166" : "120"} 
              scrolling="no" 
              frameBorder="no" 
              allow="autoplay" 
              src={embedUrl}
              loading="lazy"
              className="opacity-90 hover:opacity-100 transition-opacity"
            ></iframe>
          </div>
        ) : (
          <div className="w-full h-[120px] bg-mat-900/50 rounded-2xl border border-dashed border-mat-700 flex flex-col items-center justify-center gap-3">
             <Disc className="w-8 h-8 text-mat-800 animate-spin-slow" />
             <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">Preparando sesión...</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const OpenDecks: React.FC = () => {
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [items, setItems] = useState<(SelectorSubmission | (Event & { type: 'event' }))[]>([]);
  const [form, setForm] = useState({ artistName: '', email: '', bio: '', mixUrl: '', genres: '' });

  useEffect(() => {
    const loadContent = async () => {
      const [approvedSelectors, allEvents] = await Promise.all([
        dataService.getSelectors(true),
        dataService.getEvents()
      ]);
      
      const curatedEvents = allEvents
        .filter(e => e.isOpenDecks)
        .map(e => ({ ...e, type: 'event' as const }));

      // @ts-ignore
      const combined = [...curatedEvents, ...approvedSelectors];
      setItems(combined);
    };
    loadContent();
    window.addEventListener('mat32_data_changed', loadContent);
    return () => window.removeEventListener('mat32_data_changed', loadContent);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    await dataService.createInboxMessage({
      type: 'artist',
      sender: form.artistName,
      email: form.email,
      content: `Solicitud de Cabina. Estilos: ${form.genres}. Bio: ${form.bio}. Link: ${form.mixUrl}`,
      metadata: form
    });

    await dataService.createSelector({
      artistName: form.artistName,
      bio: form.bio,
      genres: form.genres.split(',').map(g => g.trim()),
      mixUrl: form.mixUrl,
      format: 'Open Booth',
      status: 'pending'
    });

    setIsProcessing(false);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-mat-900 text-mat-cream pb-24">
      <SEO titleKey="nav.open_decks" descriptionKey="La cabina es tuya en Mat32. Envía tu mix y solicita un slot de 60-90 minutos para potenciar tu talento en Valencia." />

      {/* Main Header Section */}
      <section className="bg-mat-800 py-32 md:py-52 border-b border-mat-700 relative overflow-hidden text-center">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:40px_40px]"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-mat-900 border border-mat-500 text-mat-500 text-[10px] font-black uppercase tracking-[0.5em] rounded-full shadow-2xl mb-10 animate-fade-in">
            <Radio className="w-4 h-4" /> RUZAFA ANALOG BOOTH
          </div>
          <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter text-white font-exo leading-[0.8] mb-8 animate-fade-in">
            OPEN <span className="text-mat-500">DECKS.</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-xl md:text-3xl font-light italic mt-8 opacity-80 leading-relaxed">
            "La cabina es tuya. Espacio dedicado a selectores emergentes con slots de 60 a 90 minutos de pura cultura de club."
          </p>
        </div>
      </section>

      {/* SHOWCASE SECTION */}
      <section className="py-24 bg-mat-950">
        <div className="container mx-auto px-6">
           <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div className="max-w-2xl">
                 <div className="flex items-center gap-2 text-mat-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">
                    <Music size={18} /> THE SIGNAL WALL
                 </div>
                 <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter font-exo leading-none">THE <span className="text-mat-500">SHOWCASE.</span></h2>
                 <p className="text-gray-500 text-xl mt-6 italic">Artistas y sesiones destacadas de nuestra comunidad en Valencia.</p>
              </div>
              <div className="bg-mat-900 px-6 py-3 rounded-2xl border border-mat-800 text-mat-500 font-black text-[10px] uppercase tracking-widest hidden md:block">
                 LIVE_STREAM_READY
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {items.length === 0 ? (
                <div className="col-span-full py-40 text-center border-4 border-dashed border-mat-800 rounded-[4rem]">
                   <Disc className="w-20 h-20 text-mat-800 mx-auto mb-8 opacity-40 animate-spin-slow" />
                   <p className="text-gray-700 font-black uppercase text-xs tracking-[0.4em]">Preparando el showcase...</p>
                </div>
              ) : (
                items.map((item, idx) => <GuestCard key={idx} selector={item} />)
              )}
           </div>
        </div>
      </section>

      {/* LEAD CAPTURE SECTION */}
      <section className="py-32 bg-mat-900 border-t border-mat-800">
        <div className="container mx-auto px-6 max-w-6xl">
           <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                 <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter font-exo leading-none mb-8">SOLICITA TU <span className="text-mat-500">SLOT.</span></h2>
                 <div className="space-y-8">
                    <p className="text-gray-400 text-xl font-light italic leading-relaxed">
                       Buscamos selectores con identidad propia. No importa el género, importa la selección y el respeto al sonido High Fidelity.
                    </p>
                    <ul className="space-y-4">
                       {[
                         "Slots de 60 a 90 minutos",
                         "Sistema de sonido Altec A7 & Klipsch La Scala",
                         "Mezclador rotatorio profesional",
                         "Grabación de sesión disponible",
                         "Difusión en nuestros canales de Hub"
                       ].map((item, i) => (
                         <li key={i} className="flex items-center gap-4 text-sm font-black uppercase tracking-widest text-gray-500">
                            <CheckCircle size={18} className="text-mat-500" /> {item}
                         </li>
                       ))}
                    </ul>
                 </div>
              </div>

              <div>
                {isSubmitted ? (
                  <div className="bg-mat-800 p-12 border-4 border-mat-500 text-center shadow-2xl rounded-[3rem] animate-fade-in relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-mat-500"></div>
                    <div className="w-20 h-20 bg-mat-900 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl border border-mat-700">
                      <CheckCircle className="w-10 h-10 text-mat-500" />
                    </div>
                    <h3 className="text-3xl font-black uppercase text-white mb-4 font-exo">Protocolo Recibido</h3>
                    <p className="text-gray-400 italic mb-10 text-sm leading-relaxed">"Tu señal ha sido inyectada en el Hub. Revisaremos tu propuesta y nos pondremos en contacto contigo pronto."</p>
                    <button onClick={() => setIsSubmitted(false)} className="w-full py-5 border-2 border-mat-700 text-gray-500 hover:text-white font-black uppercase text-[11px] tracking-widest rounded-2xl transition-all">NUEVA SOLICITUD</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="bg-mat-800 p-10 md:p-12 border-2 border-mat-700 shadow-2xl space-y-8 rounded-[3rem] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-mat-500"></div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-mat-500 uppercase tracking-[0.3em] ml-1">Alias de Artista</label>
                      <input required value={form.artistName} onChange={e => setForm({...form, artistName: e.target.value})} className="w-full bg-mat-900 border-2 border-mat-700 text-white p-5 focus:border-mat-500 outline-none transition-all uppercase text-[11px] font-black rounded-2xl" placeholder="P.EJ: MARCO V" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-mat-500 uppercase tracking-[0.3em] ml-1">Email de Contacto</label>
                      <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-mat-900 border-2 border-mat-700 text-white p-5 focus:border-mat-500 outline-none transition-all uppercase text-[11px] font-black rounded-2xl" placeholder="INFO@ARTIST.COM" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-3">
                         <label className="text-[10px] font-black text-mat-500 uppercase tracking-[0.3em] ml-1">Géneros / Estilos</label>
                         <input required value={form.genres} onChange={e => setForm({...form, genres: e.target.value})} className="w-full bg-mat-900 border-2 border-mat-700 text-white p-5 focus:border-mat-500 outline-none transition-all uppercase text-[11px] font-black rounded-2xl" placeholder="HOUSE, FUNK, JAZZ..." />
                       </div>
                       <div className="space-y-3">
                         <label className="text-[10px] font-black text-mat-500 uppercase tracking-[0.3em] ml-1">Link a Mix / Set</label>
                         <input required value={form.mixUrl} onChange={e => setForm({...form, mixUrl: e.target.value})} className="w-full bg-mat-900 border-2 border-mat-700 text-white p-5 focus:border-mat-500 outline-none transition-all uppercase text-[11px] font-black rounded-2xl" placeholder="SC / MIXCLOUD LINK" />
                       </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-mat-500 uppercase tracking-[0.3em] ml-1">Propuesta de Sesión</label>
                      <textarea required value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} className="w-full bg-mat-900 border-2 border-mat-700 p-6 h-40 focus:border-mat-500 outline-none transition-all text-xs font-bold rounded-3xl resize-none italic" placeholder="Cuéntanos qué música traes a la cabina de Mat32..."></textarea>
                    </div>
                    <button type="submit" disabled={isProcessing} className="w-full bg-mat-500 hover:bg-mat-400 text-white font-black py-7 uppercase tracking-[0.5em] transition-all rounded-[2rem] shadow-xl flex items-center justify-center gap-4 text-xs clip-path-slant shadow-mat-500/20">
                      {isProcessing ? <Loader2 className="animate-spin" /> : <Plus />} ENVIAR SEÑAL_HUB
                    </button>
                  </form>
                )}
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};
