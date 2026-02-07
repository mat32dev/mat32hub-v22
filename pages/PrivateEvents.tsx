
import React, { useState } from 'react';
import { Loader2, Send, CheckCircle2, Music, ShieldCheck, Zap, Info } from 'lucide-center';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';

export const PrivateEvents: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    date: new Date().toISOString().split('T')[0],
    time: '18:00',
    eventType: 'workshop',
    concept: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.concept) {
      alert("Por favor completa todos los campos.");
      return;
    }
    setIsProcessing(true);
    await dataService.createInboxMessage({
      type: 'lead',
      sender: formData.name,
      email: formData.email,
      content: `[PROPUESTA HUB]: ${formData.eventType.toUpperCase()}. Concepto: ${formData.concept}`,
      metadata: formData
    });
    setIsProcessing(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-mat-900 font-sans text-mat-cream pb-32">
      <SEO titleKey="Colaboraciones & Espacio | Mat32 Ruzafa" descriptionKey="Proyectos culturales en Valencia." />
      
      <section className="relative min-h-[60vh] flex items-center justify-center pt-20 overflow-hidden">
         <div className="absolute inset-0 z-0">
           <img src="https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/5dea483e-141a-4665-8085-5c163d8eda00/public" className="w-full h-full object-cover opacity-30 grayscale" />
           <div className="absolute inset-0 bg-gradient-to-b from-mat-900/90 via-mat-900/40 to-mat-900"></div>
         </div>
         <div className="container mx-auto px-6 text-center relative z-10">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-mat-900 border border-mat-500 text-mat-500 text-[10px] font-black uppercase tracking-[0.5em] rounded-full mb-8">
               <Zap size={16} /> COLLABORATION_HUB
            </div>
            <h1 className="text-6xl md:text-[8rem] font-black uppercase tracking-tighter text-white font-exo mb-8 leading-none">PUNTO <span className="text-mat-500">CREATIVO.</span></h1>
            <p className="text-gray-400 max-w-2xl mx-auto italic text-xl md:text-2xl font-light">"Talleres, acústicos o DJ sets. Mat32 es un espacio vivo para la comunidad."</p>
         </div>
      </section>

      <section className="container mx-auto px-6 max-w-4xl py-20">
         <div className="grid lg:grid-cols-12 gap-16 md:gap-24 items-start">
            <div className="lg:col-span-5 space-y-12 text-gray-400">
               <div className="bg-mat-800 border-2 border-mat-700 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                  <h4 className="text-[10px] font-black text-mat-500 uppercase tracking-widest mb-4">ESPACIO DISPONIBLE</h4>
                  <p className="text-white text-xl font-exo font-black uppercase tracking-tighter">SANTUARIO HI-FI RUZAFA</p>
               </div>
               <div className="p-6 bg-mat-950/50 border border-mat-700 rounded-2xl flex items-start gap-4">
                  <Info className="text-mat-500 flex-shrink-0" size={18} />
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                     Mat32 es una plataforma para artistas locales. Cuéntanos tu proyecto y veamos cómo encaja en nuestra agenda.
                  </p>
               </div>
            </div>

            <div className="lg:col-span-7" style={{ wordBreak: 'break-word' }}>
               <div className="bg-mat-800 border-2 border-mat-700 p-10 md:p-16 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
                  
                  {isSubmitted ? (
                    <div className="py-20 text-center animate-fade-in">
                       <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-8 animate-bounce" />
                       <h3 className="text-4xl font-black text-white uppercase mb-4 font-exo tracking-tighter">SIGNAL_SENT</h3>
                       <p className="text-gray-500 italic mb-10 leading-relaxed">Tu propuesta ha sido inyectada. Te responderemos desde <strong>hola@mat32.com</strong>.</p>
                       <button onClick={() => setIsSubmitted(false)} className="px-10 py-5 bg-mat-900 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl border border-mat-700 hover:border-mat-500 transition-all">NUEVA PROPUESTA</button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                       <div className="text-center mb-10">
                         <h2 className="text-3xl font-black text-white uppercase tracking-tighter font-exo mb-2">INYECTA TU IDEA</h2>
                         <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest italic">Envío directo al buzón central de Mat32</p>
                       </div>

                       <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Nombre / Alias</label>
                             <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-4 text-white text-xs font-black rounded-xl focus:border-mat-500 outline-none transition-all" placeholder="ALIAS O COLECTIVO" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Email</label>
                             <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-4 text-white text-xs font-black rounded-xl focus:border-mat-500 outline-none transition-all" placeholder="INFO@HUB.COM" />
                          </div>
                       </div>

                       <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Fecha Sugerida</label>
                             <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-4 text-white text-[10px] font-black rounded-xl focus:border-mat-500" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Tipo de Evento</label>
                             <select value={formData.eventType} onChange={e => setFormData({...formData, eventType: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-4 text-white text-[10px] font-black rounded-xl cursor-pointer">
                                <option value="workshop">TALLER / WORKSHOP</option>
                                <option value="acoustic">ACÚSTICO / LIVE SESSION</option>
                                <option value="expo">EXPOSICIÓN DE ARTE</option>
                                <option value="djset">DJ SET / SELECCIÓN</option>
                             </select>
                          </div>
                       </div>

                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Propuesta Creativa</label>
                          <textarea required value={formData.concept} onChange={e => setFormData({...formData, concept: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-5 h-32 text-white text-xs italic font-bold rounded-2xl outline-none focus:border-mat-500 resize-none transition-all" placeholder="Describe tu idea y qué necesitas de nosotros..."></textarea>
                       </div>

                       <div className="p-6 bg-mat-950/50 border border-mat-700 rounded-2xl flex items-start gap-4">
                          <Info className="text-mat-500 flex-shrink-0" size={18} />
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                             Si tu propuesta es colaborativa y abierta al público, el local es gratuito bajo nuestro protocolo de comunidad.
                          </p>
                       </div>

                       <button type="submit" disabled={isProcessing} className="w-full py-8 bg-mat-500 text-white font-black uppercase text-[11px] tracking-[0.4em] rounded-[2rem] shadow-2xl flex items-center justify-center gap-4 hover:bg-mat-400 transition-all clip-path-slant disabled:opacity-50">
                          {isProcessing ? <Loader2 className="animate-spin" /> : <Send />} ENVIAR PROPUESTA_HUB
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
