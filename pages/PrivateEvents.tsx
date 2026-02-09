
import React, { useState } from 'react';
import { Loader2, Send, CheckCircle2, Music, ShieldCheck, Zap, Info, Camera, Maximize2 } from 'lucide-react';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { CachedImage } from '../components/CachedImage';

const SPACE_GALLERY = [
  {
    url: "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/38cbbb12-3f05-47c5-697b-f932d8f99700/public",
    title: "Analog Sanctuary",
    tag: "#SpaceVibe"
  },
  {
    url: "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/8835f005-f545-4434-c67a-b2154de2da00/public",
    title: "Hi-Fi Listening",
    tag: "#AltecA7"
  },
  {
    url: "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/de211934-62c1-4fb5-6c4a-35cd8a0d9700/public",
    title: "Bar Atmosphere",
    tag: "#SignatureBar"
  },
  {
    url: "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/5dea483e-141a-4665-8085-5c163d8eda00/public",
    title: "Vinyl Hub",
    tag: "#TheArchive"
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
      content: `[ALQUILER ESPACIO]: ${formData.eventType.toUpperCase()}. Concepto: ${formData.concept}`,
      metadata: formData
    });
    setIsProcessing(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-mat-900 font-sans text-mat-cream pb-32">
      <SEO titleKey="Alquiler & Espacio | Mat32 Ruzafa" descriptionKey="El mejor local para eventos en Valencia. Alquila Mat32 para rodajes, talleres o sesiones privadas con sonido Hi-Fi." />
      
      <section className="relative min-h-[50vh] flex items-center justify-center pt-20 overflow-hidden">
         <div className="absolute inset-0 z-0">
           <img src={SPACE_GALLERY[0].url} className="w-full h-full object-cover opacity-20 grayscale" />
           <div className="absolute inset-0 bg-gradient-to-b from-mat-900/90 to-mat-900"></div>
         </div>
         <div className="container mx-auto px-6 text-center relative z-10">
            <h1 className="text-6xl md:text-[8rem] font-black uppercase tracking-tighter text-white font-exo mb-6 leading-none">ALQUILER <span className="text-mat-500">LOCAL.</span></h1>
            <p className="text-gray-400 max-w-2xl mx-auto italic text-xl md:text-2xl font-light">Un espacio único en Ruzafa para eventos con alma analógica.</p>
         </div>
      </section>

      {/* GALERIA O ESPACIO */}
      <section className="py-24 bg-mat-950/30">
        <div className="container mx-auto px-6">
           <div className="flex items-center gap-6 mb-16">
              <Camera size={32} className="text-mat-500" />
              <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter font-exo leading-none">GALERIA O <span className="text-mat-500">ESPACIO.</span></h2>
              <div className="flex-1 border-b-2 border-mat-800 opacity-20"></div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {SPACE_GALLERY.map((img, idx) => (
                <div key={idx} className="relative group rounded-[2.5rem] overflow-hidden border-2 border-mat-800 transition-all duration-700 hover:border-mat-500 shadow-2xl">
                   <CachedImage 
                    src={img.url} 
                    alt={img.title} 
                    className="w-full h-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                    aspectRatio="aspect-square"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-mat-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                      <span className="text-mat-500 text-[8px] font-black uppercase tracking-widest mb-1">{img.tag}</span>
                      <h4 className="text-white text-xl font-black uppercase tracking-tighter font-exo">{img.title}</h4>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      <section className="container mx-auto px-6 max-w-7xl py-20">
         <div className="grid lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5 space-y-12">
               <div className="bg-mat-800 border-2 border-mat-700 p-12 rounded-[3.5rem] shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-mat-500"></div>
                  <h4 className="text-[10px] font-black text-mat-500 uppercase tracking-widest mb-6">FEATURES</h4>
                  <ul className="space-y-4 text-white text-sm font-bold uppercase tracking-tight">
                     <li className="flex justify-between border-b border-mat-700 pb-2"><span>AFORO</span> <span className="text-mat-500">40-50 PAX</span></li>
                     <li className="flex justify-between border-b border-mat-700 pb-2"><span>SOUND</span> <span className="text-mat-500">ALTEC A7 + ROTARY</span></li>
                     <li className="flex justify-between"><span>TIPO</span> <span className="text-mat-500">PRIVADO / CULTURAL</span></li>
                  </ul>
               </div>
            </div>

            <div className="lg:col-span-7">
               <div className="bg-mat-800 border-2 border-mat-700 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
                  <form onSubmit={handleSubmit} className="space-y-8">
                     <div className="text-center mb-10">
                       <h2 className="text-3xl font-black text-white uppercase tracking-tighter font-exo mb-2">SOLICITAR RESERVA</h2>
                       <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest italic">Respuesta vía hola@mat32.com</p>
                     </div>
                     <div className="grid md:grid-cols-2 gap-6">
                        <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-5 text-white text-xs font-black rounded-2xl" placeholder="NOMBRE" />
                        <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-5 text-white text-xs font-black rounded-2xl" placeholder="EMAIL" />
                     </div>
                     <textarea required value={formData.concept} onChange={e => setFormData({...formData, concept: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-6 h-40 text-white text-xs italic font-bold rounded-[2rem] outline-none focus:border-mat-500 resize-none transition-all" placeholder="Háblanos de tu evento..."></textarea>
                     <button type="submit" className="w-full py-8 bg-mat-500 text-white font-black uppercase text-[11px] tracking-[0.4em] rounded-[2rem] shadow-2xl flex items-center justify-center gap-4 hover:bg-mat-400 transition-all">
                        {isProcessing ? <Loader2 className="animate-spin" /> : <Send />} ENVIAR PROPUESTA
                     </button>
                  </form>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};
