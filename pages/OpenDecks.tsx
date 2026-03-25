
import React, { useState, useEffect } from 'react';
import { CheckCircle, Radio, Loader2, Music, Headphones, Zap } from 'lucide-react';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { CachedImage } from '../components/CachedImage';

export const OpenDecks: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [form, setForm] = useState({
    artistName: '',
    email: '',
    phone: '',
    genres: '',
    date: '',
    time: '',
    mixUrl: '',
  });

  useEffect(() => {
    setTimeout(() => setIsRevealed(true), 100);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.artistName || !form.email) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }
    setIsProcessing(true);
    setSubmitError(false);
    try {
      await dataService.createInboxMessage({
        type: 'artist',
        sender: form.artistName,
        email: form.email,
        content: `Solicitud Open Decks. Teléfono: ${form.phone}. Estilos: ${form.genres}. Fecha: ${form.date} ${form.time}. Link: ${form.mixUrl}.`,
        metadata: form
      });
      await dataService.createSelector({
        name: form.artistName,
        email: form.email,
        genre: form.genres,
        experience: `Fecha: ${form.date} ${form.time}`,
        links: form.mixUrl ? [form.mixUrl] : [],
        status: 'pending'
      });
      setIsSubmitted(true);
    } catch {
      setSubmitError(true);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-mat-900 text-mat-cream pb-24">
      <SEO titleKey="Envía tu DJ Mix | Open Decks Mat32 Valencia" descriptionKey="Únete a la rotación de selectores de Mat32. Pincha tus vinilos en nuestro sistema Altec A7. Buscamos selectores apasionados en Ruzafa." />
      
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
             Si te apetece pinchar aquí, mándanos un mix.
           </p>
        </div>
      </div>

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
                     <button onClick={() => setIsSubmitted(false)} className="px-10 py-4 bg-mat-900 border border-mat-700 text-gray-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">NUEVA SOLICITUD</button>
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
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Género</label>
                       <input value={form.genres} onChange={e => setForm({...form, genres: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-5 text-white text-xs font-black rounded-2xl outline-none focus:border-mat-500 transition-all" placeholder="JAZZ, HOUSE, AMBIENT..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Fecha solicitada</label>
                          <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-5 text-white text-xs font-black rounded-2xl outline-none focus:border-mat-500 transition-all" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Hora solicitada</label>
                          <input type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-5 text-white text-xs font-black rounded-2xl outline-none focus:border-mat-500 transition-all" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Link a sesión <span className="text-gray-600">(opcional)</span></label>
                       <input value={form.mixUrl} onChange={e => setForm({...form, mixUrl: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-5 text-white text-xs font-black rounded-2xl outline-none focus:border-mat-500 transition-all" placeholder="SOUNDCLOUD / MIXCLOUD" />
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
