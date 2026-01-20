
import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, Headphones, ArrowRight, Loader2, 
  Plus, Radio, Disc, Clock, Volume2, MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { dataService } from '../services/dataService';
import { SelectorSubmission } from '../types';

const GuestCard: React.FC<{ selector: SelectorSubmission }> = ({ selector }) => {
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

  const embedUrl = selector.mixEmbedUrl || getEmbedUrl(selector.mixUrl);

  return (
    <div ref={cardRef} className="bg-mat-800 border-2 border-mat-700 rounded-[2.5rem] overflow-hidden shadow-2xl hover:border-mat-500 transition-all group animate-fade-in flex flex-col h-full">
      <div className="p-8 pb-4 flex-1">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-20 h-20 bg-mat-900 border-2 border-mat-700 rounded-2xl overflow-hidden shadow-lg relative flex-shrink-0">
             <img 
               src={selector.avatarUrl || `https://i.pravatar.cc/150?u=${selector.artistName}`} 
               className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
               alt={selector.artistName} 
               loading="lazy"
             />
          </div>
          <div className="min-w-0">
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter font-exo truncate leading-none mb-2">{selector.artistName}</h3>
            <div className="flex flex-wrap gap-1.5">
              {selector.genres.map((g, i) => (
                <span key={i} className="text-[8px] font-black text-mat-500 bg-mat-900 px-2 py-0.5 rounded border border-mat-700 uppercase tracking-widest">{g}</span>
              ))}
            </div>
          </div>
        </div>
        <p className="text-gray-400 text-sm italic line-clamp-3 mb-6 leading-relaxed">"{selector.bio}"</p>
      </div>

      <div className="px-8 pb-8 mt-auto min-h-[140px]">
        {embedUrl && isNear ? (
          <div className="relative rounded-2xl overflow-hidden border border-mat-700 bg-black/40 shadow-inner animate-fade-in">
            <iframe 
              width="100%" 
              height={selector.mixUrl.includes('soundcloud') ? "166" : "120"} 
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
        )}
      </div>
    </div>
  );
};

export const OpenDecks: React.FC = () => {
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectors, setSelectors] = useState<SelectorSubmission[]>([]);
  const [form, setForm] = useState({ artistName: '', email: '', bio: '', mixUrl: '', genres: '' });

  useEffect(() => {
    const loadSelectors = async () => {
      // Filtrar solo los aprobados para la vista pública
      const data = await dataService.getSelectors(true);
      setSelectors(data);
    };
    loadSelectors();
    window.addEventListener('mat32_data_changed', loadSelectors);
    return () => window.removeEventListener('mat32_data_changed', loadSelectors);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // 1. Enviar mensaje al inbox para notificación inmediata
    await dataService.createInboxMessage({
      type: 'artist',
      sender: form.artistName,
      email: form.email,
      content: `Solicitud de Cabina. Estilos: ${form.genres}. Bio: ${form.bio}. Link: ${form.mixUrl}`,
      metadata: form
    });

    // 2. Crear entrada de selector con estado 'pending'
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
    <div className="min-h-screen bg-mat-900 text-mat-cream">
      <SEO titleKey="nav.open_decks" descriptionKey="seo.opendecks.description" />

      <div className="bg-mat-800 py-24 md:py-40 border-b border-mat-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:40px_40px]"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-mat-900 border border-mat-500 text-mat-500 text-[10px] font-black uppercase tracking-[0.5em] rounded-full shadow-2xl mb-10 animate-fade-in">
            <Radio className="w-4 h-4" /> CABINA ABIERTA VALENCIA
          </div>
          <h1 className="text-6xl md:text-[10rem] font-black uppercase tracking-tighter text-white font-exo leading-none text-glow animate-fade-in">
            OPEN <span className="text-mat-500">DECKS.</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-xl md:text-3xl font-light italic mt-8 opacity-80">
            {t('opendecks.desc')}
          </p>
          
          <div className="mt-12">
            <Link to="/community" className="text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest group">
               <MessageSquare className="w-4 h-4 text-mat-500" /> EXPLORA EL HUB DE LA COMUNIDAD <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 md:py-24 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-16 md:gap-32 items-start">
          
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-12">
            <div className="space-y-6">
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter font-exo leading-none">Solicita tu<br/><span className="text-mat-500">Slot de Cabina.</span></h2>
              <p className="text-gray-500 text-lg leading-relaxed italic">Buscamos selectores con identidad propia. No importa el género, importa la selección.</p>
            </div>

            {isSubmitted ? (
              <div className="bg-mat-800 p-12 border-4 border-mat-500 text-center shadow-2xl rounded-[3rem] animate-fade-in">
                <div className="w-20 h-20 bg-mat-900 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl border border-mat-700">
                  <CheckCircle className="w-10 h-10 text-mat-500" />
                </div>
                <h3 className="text-2xl font-black uppercase text-white mb-4 font-exo">Protocolo Recibido</h3>
                <p className="text-gray-400 italic mb-10 text-sm">Nuestro equipo revisará tu sesión. Si es aceptada, aparecerás en la lista de invitados.</p>
                <button onClick={() => setIsSubmitted(false)} className="w-full py-5 border-2 border-mat-700 text-gray-500 hover:text-white font-black uppercase text-[11px] tracking-widest rounded-2xl transition-all">Nueva Solicitud</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-mat-800 p-10 md:p-12 border-2 border-mat-700 shadow-2xl space-y-8 rounded-[3rem] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-mat-500"></div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-mat-500 uppercase tracking-[0.3em] ml-1">Alias / Nombre</label>
                  <input required value={form.artistName} onChange={e => setForm({...form, artistName: e.target.value})} className="w-full bg-mat-900 border-2 border-mat-700 text-white p-5 focus:border-mat-500 outline-none transition-all uppercase text-[11px] font-black rounded-2xl shadow-inner" placeholder="P.EJ: MARCO V" />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-mat-500 uppercase tracking-[0.3em] ml-1">Géneros Musicales</label>
                  <input required value={form.genres} onChange={e => setForm({...form, genres: e.target.value})} className="w-full bg-mat-900 border-2 border-mat-700 text-white p-5 focus:border-mat-500 outline-none transition-all uppercase text-[11px] font-black rounded-2xl shadow-inner" placeholder="ITALO, HOUSE, FUNK..." />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-mat-500 uppercase tracking-[0.3em] ml-1">Email de Contacto</label>
                  <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-mat-900 border-2 border-mat-700 text-white p-5 focus:border-mat-500 outline-none transition-all uppercase text-[11px] font-black rounded-2xl shadow-inner" placeholder="EMAIL" />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-mat-500 uppercase tracking-[0.3em] ml-1">Enlace a Sesión (SC/Mixcloud)</label>
                  <input required value={form.mixUrl} onChange={e => setForm({...form, mixUrl: e.target.value})} className="w-full bg-mat-900 border-2 border-mat-700 text-white p-5 focus:border-mat-500 outline-none transition-all uppercase text-[11px] font-black rounded-2xl shadow-inner" placeholder="LINK" />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-mat-500 uppercase tracking-[0.3em] ml-1">Bio / Propuesta</label>
                  <textarea required value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} className="w-full bg-mat-900 border-2 border-mat-700 p-6 h-40 focus:border-mat-500 outline-none transition-all text-xs font-bold rounded-3xl resize-none italic shadow-inner" placeholder="¿Qué música traes a la cabina?"></textarea>
                </div>

                <button type="submit" disabled={isProcessing} className="w-full bg-mat-500 hover:bg-mat-400 text-white font-black py-7 uppercase tracking-[0.5em] transition-all rounded-[2rem] shadow-xl flex items-center justify-center gap-4 text-xs clip-path-slant group">
                  {isProcessing ? <Loader2 className="animate-spin" /> : <Plus className="group-hover:rotate-90 transition-transform" />} REGISTRAR SOLICITUD
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-7 space-y-16">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div>
                <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter font-exo leading-none">Próximos<br/><span className="text-mat-500">Invitados.</span></h2>
                <p className="text-gray-500 text-xl mt-6 italic">Sesiones aprobadas por el equipo Mat32.</p>
              </div>
              <div className="px-5 py-2 bg-mat-800 border border-mat-700 rounded-full flex items-center gap-3">
                 <Radio size={16} className="text-red-500 animate-pulse" />
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Aprobados</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {selectors.length === 0 ? (
                <div className="col-span-full py-32 text-center border-4 border-dashed border-mat-800 rounded-[4rem]">
                   <Disc className="w-20 h-20 text-mat-800 mx-auto mb-8 opacity-40 animate-spin-slow" />
                   <p className="text-gray-700 font-black uppercase text-xs tracking-[0.4em]">Sincronizando el muro de invitados...</p>
                </div>
              ) : (
                selectors.map(selector => <GuestCard key={selector.id} selector={selector} />)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
