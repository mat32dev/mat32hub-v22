
import React, { useState } from 'react';
import { Loader2, Send, CheckCircle2, Music, ShieldCheck, Zap, Info, Camera, Maximize2 } from 'lucide-react';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { CachedImage } from '../components/CachedImage';

// GALERÍA TÉCNICA V3 DEFINITIVA - LAS 7 FOTOS DEL LOCAL
const SPACE_GALLERY = [
  {
    url: "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/ac1a7472-de26-46de-37f3-7ec5509f5900/public",
    title: "Hi-Fi Booth Sanctuary",
    tag: "#MainBooth"
  },
  {
    url: "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/7af028d2-be2a-44ae-a2bd-d2e05db8ac00/w=800",
    title: "Analog Listening Lounge",
    tag: "#ListeningZone"
  },
  {
    url: "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/53d83bbb-47b5-45ce-4f69-00fdc063fd00/w=800",
    title: "Altec A7 Master System",
    tag: "#HighFidelity"
  },
  {
    url: "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/f66760c8-cc6c-457a-dc23-5edbe31a2200/w=800",
    title: "Vinyl Crate Archive",
    tag: "#TheCrate"
  },
  {
    url: "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/cd431032-310e-4ccc-c602-68787da5ae00/w=800",
    title: "Signature Bar Experience",
    tag: "#LiquidCulture"
  },
  {
    url: "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/36b8814e-df61-468c-614a-788a5fbfa700/w=800",
    title: "Booth Perspective",
    tag: "#ProGear"
  },
  {
    url: "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/496db3dc-f7c7-4d22-d05a-ac0198681c00/w=800",
    title: "Mat32 Atmosphere",
    tag: "#RuzafaValencia"
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
    eventType: 'cultural_event',
    concept: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.concept) {
      alert("Por favor completa todos los campos requeridos.");
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
      <SEO titleKey="Alquiler & Espacio | Mat32 Ruzafa" descriptionKey="Alquila Mat32 para rodajes, eventos culturales, sesiones privadas o talleres. Sonido Hi-Fi y atmósfera analógica en Valencia." />
      
      <section className="relative min-h-[50vh] flex items-center justify-center pt-20 overflow-hidden">
         <div className="absolute inset-0 z-0">
           <CachedImage src={SPACE_GALLERY[0].url} alt="Hero Alquiler" priority className="w-full h-full object-cover opacity-20 grayscale" />
           <div className="absolute inset-0 bg-gradient-to-b from-mat-900/90 to-mat-900"></div>
         </div>
         <div className="container mx-auto px-6 text-center relative z-10">
            <h1 className="text-6xl md:text-[8rem] font-black uppercase tracking-tighter text-white font-exo mb-6 leading-none animate-fade-in">ALQUILER <span className="text-mat-500">LOCAL.</span></h1>
            <p className="text-gray-400 max-w-2xl mx-auto italic text-xl md:text-2xl font-light">Un espacio único en Ruzafa para eventos con alma analógica.</p>
         </div>
      </section>

      {/* GALERÍA O ESPACIO V3 */}
      <section className="py-24 bg-mat-950/30">
        <div className="container mx-auto px-6">
           <div className="flex items-center gap-6 mb-16">
              <Camera size={32} className="text-mat-500" />
              <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter font-exo leading-none">GALERÍA O <span className="text-mat-500">ESPACIO.</span></h2>
              <div className="flex-1 border-b-2 border-mat-800 opacity-20"></div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {SPACE_GALLERY.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`relative group rounded-[3rem] overflow-hidden border-2 border-mat-800 transition-all duration-700 hover:border-mat-500 shadow-2xl ${
                    idx === 0 ? 'md:col-span-2 lg:col-span-2' : ''
                  } ${idx === 4 ? 'md:col-span-2 lg:col-span-1' : ''}`}
                >
                   <CachedImage 
                    src={img.url} 
                    alt={img.title} 
                    className="w-full h-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                    aspectRatio={idx === 0 ? "aspect-video" : "aspect-square"}
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-mat-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10">
                      <span className="text-mat-500 text-[9px] font-black uppercase tracking-[0.4em] mb-2">{img.tag}</span>
                      <h4 className="text-white text-2xl font-black uppercase tracking-tighter font-exo leading-none">{img.title}</h4>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      <section className="container mx-auto px-6 max-w-7xl py-20">
         <div className="grid lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5 space-y-12">
               <div className="bg-mat-800 border-2 border-mat-700 p-12 rounded-[4rem] shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
                  <h4 className="text-[10px] font-black text-mat-500 uppercase tracking-widest mb-10">TECH_SPECS</h4>
                  <ul className="space-y-6 text-white text-sm font-bold uppercase tracking-tight">
                     <li className="flex justify-between border-b border-mat-700 pb-4"><span>AFORO_MÁX</span> <span className="text-mat-500">100 PAX</span></li>
                     <li className="flex justify-between border-b border-mat-700 pb-4"><span>SISTEMA_PA</span> <span className="text-mat-500">ALTEC A7</span></li>
                     <li className="flex justify-between border-b border-mat-700 pb-4"><span>CONTROL</span> <span className="text-mat-500">ROTARY ANALOG</span></li>
                     <li className="flex justify-between"><span>UBICACIÓN</span> <span className="text-mat-500">RUZAFA_VLC</span></li>
                  </ul>
               </div>

               <div className="p-8 bg-mat-950 border border-mat-800 rounded-3xl flex items-start gap-4 shadow-xl">
                  <Info className="text-mat-500 mt-1 shrink-0" size={20} />
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                     El local está optimizado para rodajes cinematográficos, eventos de marca, lanzamientos culturales y sesiones de escucha crítica. No se alquila para fiestas nocturnas convencionales.
                  </p>
               </div>
            </div>

            <div className="lg:col-span-7">
               {isSubmitted ? (
                 <div className="bg-mat-800 border-2 border-mat-500 p-20 rounded-[4rem] text-center animate-fade-in shadow-2xl">
                    <CheckCircle2 className="w-20 h-20 text-mat-500 mx-auto mb-8 animate-bounce" />
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter font-exo mb-4">RECIBIDO.</h2>
                    <p className="text-gray-400 italic mb-10">Tu propuesta ha sido inyectada en nuestra red. El equipo de Mat32 te responderá vía hola@mat32.com para coordinar los detalles.</p>
                    <button onClick={() => setIsSubmitted(false)} className="px-10 py-4 bg-mat-900 text-gray-500 hover:text-white border border-mat-700 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">NUEVA SOLICITUD</button>
                 </div>
               ) : (
                 <div className="bg-mat-800 border-2 border-mat-700 p-10 md:p-14 rounded-[4rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
                    <form onSubmit={handleSubmit} className="space-y-8">
                       <div className="text-center mb-10">
                         <h2 className="text-3xl font-black text-white uppercase tracking-tighter font-exo mb-2">SOLICITAR RESERVA</h2>
                         <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest italic tracking-[0.2em]">CANAL_DIRECTO_ALQUILER</p>
                       </div>
                       <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-4">NOMBRE_ENTIDAD</label>
                             <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-6 text-white text-xs font-black rounded-2xl outline-none focus:border-mat-500 transition-all" placeholder="P.EJ: MARCA_VLC" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-4">EMAIL_CONTACTO</label>
                             <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-6 text-white text-xs font-black rounded-2xl outline-none focus:border-mat-500 transition-all" placeholder="HOLA@EMPRESA.COM" />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-4">CONCEPTO_EVENTO</label>
                          <textarea required value={formData.concept} onChange={e => setFormData({...formData, concept: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-8 h-48 text-white text-sm italic font-medium rounded-[2.5rem] outline-none focus:border-mat-500 resize-none transition-all" placeholder="Cuéntanos el concepto de tu evento, fecha aproximada, necesidades técnicas y duración..."></textarea>
                       </div>
                       <button type="submit" className="w-full py-8 bg-mat-500 text-white font-black uppercase text-[11px] tracking-[0.5em] rounded-[2.5rem] shadow-[0_20px_50px_rgba(234,88,12,0.3)] flex items-center justify-center gap-4 hover:bg-mat-400 transition-all active:scale-95">
                          {isProcessing ? <Loader2 className="animate-spin" /> : <Send size={20} />} ENVIAR PROPUESTA_ESPACIO
                       </button>
                    </form>
                 </div>
               )}
            </div>
         </div>
      </section>
    </div>
  );
};
