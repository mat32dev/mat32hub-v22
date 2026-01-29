import React, { useState } from 'react';
import { CheckCircle, Radio, Loader2, Send, Plus, Disc, Music } from 'lucide-react';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';

export const OpenDecks: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [form, setForm] = useState({ 
    artistName: '', 
    email: '', 
    bio: '', 
    mixUrl: '', 
    genres: '' 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.artistName || !form.email || !form.mixUrl) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }
    setIsProcessing(true);
    await dataService.createInboxMessage({
      type: 'artist',
      sender: form.artistName,
      email: form.email,
      content: `Solicitud Open Decks. Estilos: ${form.genres}. Link: ${form.mixUrl}. Bio: ${form.bio}`,
      metadata: form
    });
    
    // También guardamos en la lista de selectores para revisión del admin
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
  };

  return (
    <div className="min-h-screen bg-mat-900 text-mat-cream pb-24 pt-32">
      <SEO titleKey="Open Decks | La Cabina es Tuya" descriptionKey="Envía tu sesión a Mat32 Ruzafa." />
      
      <section className="container mx-auto px-6 max-w-4xl text-center mb-20">
         <div className="inline-flex items-center gap-3 px-6 py-2 bg-mat-900 border border-mat-500 text-mat-500 text-[10px] font-black uppercase tracking-[0.5em] rounded-full mb-8">
            <Radio className="w-4 h-4" /> ANALOG BOOTH
         </div>
         <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter text-white font-exo leading-none mb-8">OPEN <span className="text-mat-500">DECKS.</span></h1>
         <p className="text-gray-400 text-xl md:text-2xl font-light italic leading-relaxed max-w-2xl mx-auto">"Slots de 60-90 minutos en nuestro sistema Altec A7. Queremos escuchar tu selección."</p>
      </section>

      <div className="container mx-auto px-6 max-w-xl">
         <div className="bg-mat-800 border-2 border-mat-700 p-10 md:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
            
            {isSubmitted ? (
               <div className="text-center py-12 animate-fade-in">
                  <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-8 animate-bounce" />
                  <h3 className="text-3xl font-black text-white uppercase font-exo tracking-tighter">SIGNAL_SENT</h3>
                  <p className="text-gray-500 italic mb-10">Tu sesión ha sido inyectada. Revisaremos tu material pronto.</p>
                  <button onClick={() => setIsSubmitted(false)} className="px-10 py-4 bg-mat-900 border border-mat-700 text-gray-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">NUEVA SOLICITUD</button>
               </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Alias Artístico</label>
                    <input required value={form.artistName} onChange={e => setForm({...form, artistName: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-5 text-white text-xs font-black uppercase rounded-2xl outline-none focus:border-mat-500 transition-all" placeholder="P.EJ: DJ ANALOG" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Email</label>
                    <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-5 text-white text-xs font-black rounded-2xl outline-none focus:border-mat-500 transition-all" placeholder="INFO@HUB.COM" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Estilos</label>
                       <input value={form.genres} onChange={e => setForm({...form, genres: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-5 text-white text-[10px] font-black rounded-2xl outline-none focus:border-mat-500 transition-all" placeholder="HOUSE, DISCO..." />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Link a Mix</label>
                       <input required value={form.mixUrl} onChange={e => setForm({...form, mixUrl: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-5 text-white text-[10px] font-black rounded-2xl outline-none focus:border-mat-500 transition-all" placeholder="SOUNDCLOUD / MIXCLOUD" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Bio / Propuesta</label>
                    <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-5 h-32 text-white text-xs italic font-bold rounded-2xl outline-none focus:border-mat-500 resize-none transition-all" placeholder="Cuéntanos sobre tu selección musical..."></textarea>
                 </div>
                 
                 <button type="submit" disabled={isProcessing} className="w-full py-8 bg-mat-500 text-white font-black uppercase text-[10px] tracking-[0.5em] rounded-[2rem] flex items-center justify-center gap-4 transition-all hover:bg-mat-400 shadow-xl shadow-mat-500/10">
                    {isProcessing ? <Loader2 className="animate-spin" /> : <Music size={18} />} ENVIAR SEÑAL_HUB
                 </button>
              </form>
            )}
         </div>
      </div>
    </div>
  );
};