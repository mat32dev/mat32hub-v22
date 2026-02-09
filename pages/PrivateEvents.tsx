
import React, { useState } from 'react';
import { Loader2, Send, CheckCircle2, Music, ShieldCheck, Zap, Info, Camera, Maximize2 } from 'lucide-react';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { CachedImage } from '../components/CachedImage';

const SPACE_GALLERY = [
  {
    url: "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/190aead2-fc94-4fed-a7c2-bd341561ca00/public",
    title: "Main Hall & Booth",
    tag: "#SantuarioHiFi"
  },
  {
    url: "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/7701241e-71ee-4929-18c0-d1d0d9576e00/public",
    title: "Listening Lounge",
    tag: "#AnalogVibe"
  },
  {
    url: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2000",
    title: "Signature Bar",
    tag: "#LiquidSounds"
  },
  {
    url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800",
    title: "Vinyl Archive",
    tag: "#TheCrate"
  },
  {
    url: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=800",
    title: "Sound System Altec",
    tag: "#HighFidelity"
  }
];

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
      <SEO titleKey="Colaboraciones & Espacio | Mat32 Ruzafa" descriptionKey="Alquiler del mejor local para eventos en Valencia. Talleres, acústicos y sesiones privadas en un entorno Hi-Fi único." />
      
      <section className="relative min-h-[60vh] flex items-center justify-center pt-20 overflow-hidden">
         <div className="absolute inset-0 z-0">
           <img src="https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/7701241e-71ee-4929-18c0-d1d0d9576e00/public" className="w-full h-full object-cover opacity-30 grayscale" />
           <div className="absolute inset-0 bg-gradient-to-b from-mat-900/90 via-mat-900/40 to-mat-900"></div>
         </div>
         <div className="container mx-auto px-6 text-center relative z-10">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-mat-900 border border-mat-500 text-mat-500 text-[10px] font-black uppercase tracking-[0.5em] rounded-full mb-8">
               <Zap size={16} /> COLLABORATION_HUB
            </div>
            <h1 className="text-6xl md:text-[8rem] font-black uppercase tracking-tighter text-white font-exo mb-8 leading-none">PUNTO <span className="text-mat-500">CREATIVO.</span></h1>
            <p className="text-gray-400 max-w-2xl mx-auto italic text-xl md:text-2xl font-light">"Talleres, acústicos o sesiones privadas. Mat32 es un espacio vivo para la comunidad en Ruzafa."</p>
         </div>
      </section>

      {/* GALERIA DEL ESPACIO */}
      <section className="py-24 bg-mat-950/30">
        <div className="container mx-auto px-6">
           <div className="flex items-center gap-6 mb-16">
              <Camera size={32} className="text-mat-500" />
              <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter font-exo leading-none">GALERÍA DEL <span className="text-mat-500">ESPACIO.</span></h2>
              <div className="flex-1 border-b-2 border-mat-800 opacity-20 hidden md:block"></div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {SPACE_GALLERY.map((img, idx) => (
                <div key={idx} className={`relative group rounded-[3rem] overflow-hidden border-2 border-mat-800 transition-all duration-700 hover:border-mat-500 shadow-2xl ${idx === 0 ? 'md:col-span-2 md:row-span-1' : ''}`}>
                   <CachedImage 
                    src={img.url} 
                    alt={img.title} 
                    className="w-full h-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                    aspectRatio={idx === 0 ? "aspect-video" : "aspect-square"}
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-mat-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10">
                      <span className="text-mat-500 text-[9px] font-black uppercase tracking-widest mb-2">{img.tag}</span>
                      <h4 className="text-white text-3xl font-black uppercase tracking-tighter font-exo">{img.title}</h4>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      <section className="container mx-auto px-6 max-w-7xl py-32">
         <div className="grid lg:grid-cols-12 gap-16 md:gap-24 items-start">
            <div className="lg:col-span-5 space-y-12">
               <div className="bg-mat-800 border-2 border-mat-700 p-12 rounded-[3.5rem] shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-mat-500"></div>
                  <h4 className="text-[10px] font-black text-mat-500 uppercase tracking-widest mb-4">CAPACIDAD & SETUP</h4>
                  <ul className="space-y-4 text-white text-sm font-bold uppercase tracking-tight">
                     <li className="flex justify-between border-b border-mat-700 pb-2"><span>AFORO MÁXIMO</span> <span className="text-mat-500">50 PERSONAS</span></li>
                     <li className="flex justify-between border-b border-mat-700 pb-2"><span>SONIDO</span> <span className="text-mat-500">ALTEC LANSING A7</span></li>
                     <li className="flex justify-between border-b border-mat-700 pb-2"><span>ZONA</span> <span className="text-mat-500">RUZAFA CENTER</span></li>
                  </ul>
               </div>
               <div className="p-10 bg-mat-950/50 border border-mat-700 rounded-[2.5rem] flex items-start gap-6">
                  <Info className="text-mat-500 flex-shrink-0 mt-1" size={24} />
                  <div className="space-y-4">
                     <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                        ¿Buscas un set para rodajes o sesiones fotográficas? Mat32 es el entorno analógico perfecto en Valencia.
                     </p>
                     <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest leading-relaxed">
                        * Propuestas culturales (exposiciones, talleres, audiciones) tienen prioridad en nuestro calendario de comunidad.
                     </p>
                  </div>
               </div>
            </div>

            <div className="lg:col-span-7">
               <div className="bg-mat-800 border-2 border-mat-700 p-10 md:p-16 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
                  
                  {isSubmitted ? (
                    <div className="py-20 text-center animate-fade-in">
                       <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-8 animate-bounce" />
                       <h3 className="text-4xl font-black text-white uppercase mb-4 font-exo tracking-tighter">SIGNAL_SENT</h3>
                       <p className="text-gray-500 italic mb-10 leading-relaxed">Tu propuesta ha sido inyectada. Te responderemos desde <strong>hola@mat32.com</strong> para coordinar la visita.</p>
                       <button onClick={() => setIsSubmitted(false)} className="px-10 py-5 bg-mat-900 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl border border-mat-700 hover:border-mat-500 transition-all">NUEVA PROPUESTA</button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                       <div className="text-center mb-10">
                         <h2 className="text-3xl font-black text-white uppercase tracking-tighter font-exo mb-2">INYECTA TU IDEA</h2>
                         <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest italic">Envío directo al buzón central de gestión</p>
                       </div>

                       <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Nombre / Empresa</label>
                             <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-5 text-white text-xs font-black rounded-2xl focus:border-mat-500 outline-none transition-all" placeholder="P.EJ: ESTUDIO RUZAFA" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Email</label>
                             <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-5 text-white text-xs font-black rounded-2xl focus:border-mat-500 outline-none transition-all" placeholder="INFO@HUB.COM" />
                          </div>
                       </div>

                       <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Fecha Sugerida</label>
                             <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-5 text-white text-[10px] font-black rounded-2xl focus:border-mat-500" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Tipo de Evento</label>
                             <select value={formData.eventType} onChange={e => setFormData({...formData, eventType: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-5 text-white text-[10px] font-black rounded-2xl cursor-pointer outline-none focus:border-mat-500">
                                <option value="workshop">TALLER / WORKSHOP</option>
                                <option value="acoustic">ACÚSTICO / LIVE SESSION</option>
                                <option value="expo">EXPOSICIÓN DE ARTE</option>
                                <option value="djset">SESIÓN PRIVADA / DJ SET</option>
                                <option value="shooting">RODAJE / FOTOGRAFÍA</option>
                             </select>
                          </div>
                       </div>

                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Concepto del Evento</label>
                          <textarea required value={formData.concept} onChange={e => setFormData({...formData, concept: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-6 h-40 text-white text-xs italic font-bold rounded-[2rem] outline-none focus:border-mat-500 resize-none transition-all" placeholder="Describe brevemente tu proyecto y qué necesitas para llevarlo a cabo en Mat32..."></textarea>
                       </div>

                       <button type="submit" disabled={isProcessing} className="w-full py-8 bg-mat-500 text-white font-black uppercase text-[11px] tracking-[0.4em] rounded-[2rem] shadow-2xl flex items-center justify-center gap-4 hover:bg-mat-400 transition-all shadow-mat-500/20 active:scale-95 disabled:opacity-50">
                          {isProcessing ? <Loader2 className="animate-spin" /> : <Send />} INICIAR PROTOCOLO_RESERVA
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
