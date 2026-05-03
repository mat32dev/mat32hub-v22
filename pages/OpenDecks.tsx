
import React, { useState, useEffect } from 'react';
import { CheckCircle, Radio, Loader2, Music, Headphones, Zap, ExternalLink, Instagram } from 'lucide-react';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { CachedImage } from '../components/CachedImage';

const GENRES = ['JAZZ', 'WORLD', 'AMBIENT', 'ELECTRÓNICA', 'FUNK', 'SOUL', 'EXPERIMENTAL', '80S SYNTH', 'HOUSE', 'DISCO', 'TECHNO'];
const SLOTS = [
  { id: 'A', label: 'SLOT A', time: '20:00 → 21:15' },
  { id: 'B', label: 'SLOT B', time: '21:15 → 22:30' },
];

interface NextSelector {
  id: string;
  name: string;
  handle: string | null;   // fecha del set
  role: string | null;     // slot horario
  bio: string | null;
  image_url: string | null;
  tags: string[];          // géneros
  mixcloud_url: string | null;
  soundcloud_url: string | null;
  instagram_url: string | null;
  web_url: string | null;
}

export const OpenDecks: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [genreError, setGenreError] = useState(false);
  const [nextSelectors, setNextSelectors] = useState<NextSelector[]>([]);
  const [form, setForm] = useState({
    artistName: '',
    email: '',
    phone: '',
    genres: [] as string[],
    date: '',
    slot: '',
    socialUrl: '',
  });

  useEffect(() => {
    setTimeout(() => setIsRevealed(true), 100);
    dataService.getReferenceSelectorsPublic()
      .then((all: any[]) => setNextSelectors(all.filter(s => s.tier === 'next' && !s.hidden).sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))))
      .catch(() => {});
  }, []);

  const toggleGenre = (g: string) => {
    setGenreError(false);
    setForm(f => ({
      ...f,
      genres: f.genres.includes(g) ? f.genres.filter(x => x !== g) : [...f.genres, g],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.artistName || !form.email) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }
    if (form.genres.length < 2) {
      setGenreError(true);
      return;
    }
    setIsProcessing(true);
    setSubmitError(false);
    const slotLabel = SLOTS.find(s => s.id === form.slot)?.time || '—';
    try {
      await dataService.createInboxMessage({
        type: 'artist',
        sender: form.artistName,
        email: form.email,
        content: `Solicitud Open Decks. Teléfono: ${form.phone || '—'}. Estilos: ${form.genres.join(', ')}. Fecha: ${form.date || '—'} · Slot ${form.slot || '—'}: ${slotLabel}. Link: ${form.socialUrl || '—'}.`,
        metadata: { source: 'open-decks', artistName: form.artistName, phone: form.phone, genres: form.genres.join(', '), date: form.date, slot: form.slot, slotTime: slotLabel, socialUrl: form.socialUrl }
      });
      setIsSubmitted(true);
    } catch {
      setSubmitError(true);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink text-mat-cream pb-24">
      <SEO titleKey="Envía tu DJ Mix | Open Decks Mat32 Valencia" descriptionKey="Únete a la rotación de selectores de Mat32. Pincha tus vinilos en nuestro sistema Altec A7. Buscamos selectores apasionados en Ruzafa." />

      {/* HERO */}
      <div className="relative h-[50vh] md:h-[70vh] flex items-center justify-center border-b border-mat-800 overflow-hidden mb-20 bg-black">
        <div className="absolute inset-0 z-0">
          <CachedImage
            src="https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/de211934-62c1-4fb5-6c4a-35cd8a0d9700/public"
            alt="Analog Booth"
            priority
            className={`w-full h-full object-cover transition-all duration-[2000ms] ease-in-out ${isRevealed ? 'scale-105 opacity-85 blur-0' : 'scale-110 opacity-0 blur-2xl'}`}
          />
          <div className="absolute inset-0 bg-mat-500/10 mix-blend-color pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-mat-900 via-mat-900/30 to-transparent opacity-40"></div>
        </div>
        <div className="container mx-auto px-6 text-center relative z-10 pt-20 animate-fade-in">
           <div className="inline-flex items-center gap-3 px-6 py-2 bg-mat-900 border border-mat-500 text-mat-500 text-[10px] font-black uppercase tracking-[0.5em] rounded-full mb-8">
              <Radio className="w-4 h-4" /> ANALOG BOOTH PROTOCOL
           </div>
           <h1 className="text-[12vw] sm:text-[10vw] md:text-[10rem] font-black uppercase tracking-tighter text-white font-exo leading-[0.8] mb-8">OPEN <span className="text-mat-500">DECKS.</span></h1>
           <p className="text-gray-400 text-base sm:text-lg md:text-2xl font-light leading-relaxed max-w-3xl mx-auto px-4">
             Si te apetece pinchar en MAT, mándanos un mix.
           </p>
        </div>
      </div>

      {/* NEXT SELECTORS */}
      {nextSelectors.length > 0 && (
        <div className="container mx-auto px-6 max-w-6xl mb-24">
          <div className="flex items-baseline gap-4 mb-10">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white font-exo">NEXT <span className="text-mat-500">SELECTORS.</span></h2>
            <div className="h-px flex-1 bg-mat-700"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {nextSelectors.map(s => (
              <div key={s.id} className="group relative bg-mat-800 border border-mat-700 rounded-[2rem] overflow-hidden hover:border-mat-500 transition-all duration-300">
                {/* Image */}
                <div className="aspect-[3/4] bg-mat-900 relative overflow-hidden">
                  {s.image_url ? (
                    <img src={s.image_url} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[5rem] font-black text-mat-700 font-exo select-none">{s.name.slice(0, 2).toUpperCase()}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-mat-900 via-mat-900/20 to-transparent" />
                  {/* Slot badge */}
                  {s.role && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-mat-500 text-white text-[8px] font-black uppercase tracking-widest rounded-full">
                      {s.role}
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="p-6 space-y-4">
                  {/* Date */}
                  {s.handle && (
                    <div className="text-[9px] font-black text-mat-500 uppercase tracking-[0.4em]">{s.handle}</div>
                  )}
                  {/* Name */}
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter font-exo leading-none">{s.name}</h3>
                  {/* Bio */}
                  {s.bio && <p className="text-[11px] text-gray-400 leading-relaxed">{s.bio}</p>}
                  {/* Genres */}
                  {s.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {s.tags.map(t => (
                        <span key={t} className="px-2.5 py-1 bg-mat-900 border border-mat-700 text-[8px] font-black uppercase tracking-widest text-gray-400 rounded-lg">{t}</span>
                      ))}
                    </div>
                  )}
                  {/* Links */}
                  {(s.mixcloud_url || s.soundcloud_url || s.instagram_url || s.web_url) && (
                    <div className="flex gap-2 pt-1">
                      {s.mixcloud_url && (
                        <a href={s.mixcloud_url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-mat-900 border border-mat-700 hover:border-mat-500 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all">
                          <Music size={10} /> Mixcloud
                        </a>
                      )}
                      {s.soundcloud_url && (
                        <a href={s.soundcloud_url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-mat-900 border border-mat-700 hover:border-mat-500 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all">
                          <Music size={10} /> SoundCloud
                        </a>
                      )}
                      {s.instagram_url && (
                        <a href={s.instagram_url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-mat-900 border border-mat-700 hover:border-mat-500 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all">
                          <Instagram size={10} /> IG
                        </a>
                      )}
                      {s.web_url && (
                        <a href={s.web_url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-mat-900 border border-mat-700 hover:border-mat-500 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all">
                          <ExternalLink size={10} /> Link
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FORM + SPECS */}
      <div className="container mx-auto px-6 max-w-6xl grid lg:grid-cols-12 gap-16 items-start">
         <div className="lg:col-span-5 space-y-8">
            <div className="bg-mat-800 border-2 border-mat-700 p-10 rounded-[3rem] shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-1 bg-mat-500"></div>
               <h3 className="text-xl font-black text-white uppercase font-exo mb-6 flex items-center gap-3">
                 <Zap className="text-mat-500" size={20} /> SPECS_CABINA
               </h3>
               <ul className="space-y-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  <li className="flex justify-between items-center border-b border-mat-700 pb-2">
                     <span>SISTEMA P.A</span>
                     <span className="text-white">ALTEC LANSING A7</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-mat-700 pb-2">
                     <span>MIXER</span>
                     <span className="text-white">ROTARY ANALOG</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-mat-700 pb-2">
                     <span>TURNTABLES</span>
                     <span className="text-white">2x TECHNICS 1210</span>
                  </li>
                  <li className="flex justify-between items-center">
                     <span>FORMATO</span>
                     <span className="text-mat-500">VINYL ONLY PREFERRED</span>
                  </li>
               </ul>
            </div>

            <div className="p-8 bg-mat-950/50 border border-mat-700 rounded-3xl flex items-start gap-4">
               <Headphones className="text-mat-500 flex-shrink-0 mt-1" size={18} />
               <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                  Buscamos selectores apasionados, no necesariamente DJs técnicos. Si tienes una colección de discos increíble que el mundo debe escuchar, este es tu sitio.
               </p>
            </div>
         </div>

         <div className="lg:col-span-7">
            <div className="bg-mat-800 border-2 border-mat-700 p-10 md:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>

               {isSubmitted ? (
                  <div className="text-center py-12 animate-fade-in">
                     <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-8 animate-bounce" />
                     <h3 className="text-3xl font-black text-white uppercase font-exo tracking-tighter">SIGNAL_SENT</h3>
                     <p className="text-gray-500 italic mb-10 leading-relaxed">Tu sesión ha sido inyectada en nuestra base de datos. El equipo de programación revisará tu material pronto.</p>
                     <button onClick={() => { setIsSubmitted(false); setForm({ artistName: '', email: '', phone: '', genres: [], date: '', slot: '', socialUrl: '' }); }} className="px-10 py-4 bg-mat-900 border border-mat-700 text-gray-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">NUEVA SOLICITUD</button>
                  </div>
               ) : (
                 <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Nombre</label>
                       <input required value={form.artistName} onChange={e => setForm({...form, artistName: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-5 text-white text-xs font-black uppercase rounded-2xl outline-none focus:border-mat-500 transition-all" placeholder="TU NOMBRE" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Email</label>
                          <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-5 text-white text-xs font-black rounded-2xl outline-none focus:border-mat-500 transition-all" placeholder="TU@EMAIL.COM" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Teléfono</label>
                          <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-5 text-white text-xs font-black rounded-2xl outline-none focus:border-mat-500 transition-all" placeholder="+34 600 000 000" />
                       </div>
                    </div>

                    {/* GÉNEROS */}
                    <div className="space-y-3">
                       <div className="flex items-center justify-between ml-1">
                          <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest">Géneros <span className="text-gray-600 normal-case font-normal">(mín. 2)</span></label>
                          {form.genres.length > 0 && (
                            <span className="text-[9px] font-black text-mat-500 uppercase tracking-widest">{form.genres.length} seleccionados</span>
                          )}
                       </div>
                       <div className="flex flex-wrap gap-2">
                          {GENRES.map(g => {
                            const active = form.genres.includes(g);
                            return (
                              <button
                                key={g}
                                type="button"
                                onClick={() => toggleGenre(g)}
                                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                                  active
                                    ? 'bg-mat-500 border-mat-500 text-white'
                                    : 'bg-mat-900 border-mat-700 text-gray-500 hover:border-mat-500 hover:text-white'
                                }`}
                              >
                                {g}
                              </button>
                            );
                          })}
                       </div>
                       {genreError && (
                         <p className="text-red-400 text-[9px] font-black uppercase tracking-widest ml-1">Selecciona al menos 2 géneros</p>
                       )}
                    </div>

                    {/* DISPONIBILIDAD */}
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Disponibilidad <span className="text-gray-600 normal-case font-normal">(opcional)</span></label>
                       <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-5 text-white text-xs font-black rounded-2xl outline-none focus:border-mat-500 transition-all" />
                       <div className="grid grid-cols-2 gap-3">
                          {SLOTS.map(s => {
                            const active = form.slot === s.id;
                            return (
                              <button
                                key={s.id}
                                type="button"
                                onClick={() => setForm(f => ({ ...f, slot: f.slot === s.id ? '' : s.id }))}
                                className={`p-4 rounded-2xl border text-left transition-all ${
                                  active
                                    ? 'bg-mat-500 border-mat-500'
                                    : 'bg-mat-900 border-mat-700 hover:border-mat-500'
                                }`}
                              >
                                <div className={`text-[9px] font-black uppercase tracking-widest mb-1 ${active ? 'text-white' : 'text-gray-500'}`}>{s.label}</div>
                                <div className={`text-[11px] font-black uppercase tracking-tight ${active ? 'text-white' : 'text-gray-400'}`}>{s.time}</div>
                                <div className={`text-[8px] font-bold uppercase tracking-widest mt-1 ${active ? 'text-white/70' : 'text-gray-600'}`}>75 MIN</div>
                              </button>
                            );
                          })}
                       </div>
                    </div>

                    {/* ENLACE SOCIAL */}
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Tu enlace <span className="text-gray-600 normal-case font-normal">(opcional · Mixcloud, SoundCloud, Instagram...)</span></label>
                       <input value={form.socialUrl} onChange={e => setForm({...form, socialUrl: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-5 text-white text-xs font-black rounded-2xl outline-none focus:border-mat-500 transition-all" placeholder="https://mixcloud.com/tu-perfil" />
                    </div>

                    {submitError && (
                      <p className="text-red-400 text-[10px] font-black uppercase tracking-widest text-center">Error al enviar. Inténtalo de nuevo o escríbenos a hola@mat32.com</p>
                    )}
                    <button type="submit" disabled={isProcessing} className="w-full py-8 bg-mat-500 text-white font-black uppercase text-[10px] tracking-[0.5em] rounded-[2rem] flex items-center justify-center gap-4 transition-all hover:bg-mat-400 shadow-xl shadow-mat-500/10 active:scale-95">
                       {isProcessing ? <Loader2 className="animate-spin" /> : <Music size={18} />} ENVIAR MIX
                    </button>
                 </form>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};
