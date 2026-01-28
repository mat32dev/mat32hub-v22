import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Loader2, Zap, Camera, 
  ShieldCheck, Calendar, Music, Send, X, AlertTriangle, UserPlus, CheckCircle2, Info
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { dataService } from '../services/dataService';
import { GalleryItem } from '../types';
import { CachedImage } from '../components/CachedImage';

export const PrivateEvents: React.FC = () => {
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    date: new Date().toISOString().split('T')[0],
    time: '18:00',
    eventType: 'workshop', // workshop, acoustic, expo, djset
    concept: '',
    isPrivate: false 
  });

  const loadGallery = async () => {
    const items = await dataService.getGallery();
    setGalleryItems(items);
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    await dataService.createInboxMessage({
      type: 'lead',
      sender: formData.name,
      email: formData.email,
      content: `[PROPUESTA HUB]: ${formData.eventType.toUpperCase()}. Concepto: ${formData.concept}. Destino: hola@mat32.com`,
      metadata: formData
    });
    setIsProcessing(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-mat-900 font-sans text-mat-cream pb-32">
      <SEO 
        titleKey="Colaboraciones & Espacio | Mat32 Ruzafa Valencia" 
        descriptionKey="Propón tu evento en Mat32: Talleres, acústicos, exposiciones y DJ sets. Protocolo de colaboración para la comunidad de Valencia." 
      />
      
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <CachedImage src="https://lrilkrktztlabjpxqbyc.supabase.co/storage/v1/object/public/local-gallery/mat32%20inside.jpg" alt="Mat32 Local Eventos" className="w-full h-full opacity-40 grayscale" priority={true} />
          <div className="absolute inset-0 bg-gradient-to-b from-mat-900/90 via-mat-900/40 to-mat-900"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center pt-20">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-mat-900 border border-mat-500 text-mat-500 text-[10px] font-black uppercase tracking-[0.5em] rounded-full mb-8 shadow-2xl animate-fade-in">
            <Zap className="w-4 h-4" /> COLLABORATION_PROTOCOL
          </div>
          <h1 className="text-5xl md:text-[8rem] font-black uppercase tracking-tighter text-white font-exo leading-none mb-8 animate-fade-in text-balance">ESPACIO <span className="text-mat-500"> POLIVALENTE.</span></h1>
          <p className="text-gray-400 max-w-4xl mx-auto text-xl md:text-2xl font-light italic leading-relaxed mb-14 px-4">
            "Talleres, acústicos, exposiciones o DJ sets. Mat32 es un espacio vivo donde cualquier señal creativa es bienvenida bajo nuestro protocolo de colaboración."
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button onClick={() => document.getElementById('proposal-form')?.scrollIntoView({behavior:'smooth'})} className="px-12 py-6 bg-mat-500 text-white font-black text-[11px] uppercase tracking-widest clip-path-slant shadow-xl hover:bg-mat-400 transition-all">PROPONER EVENTO</button>
            <a href="mailto:hola@mat32.com" className="px-12 py-6 bg-mat-800 border-2 border-mat-700 text-white font-black text-[11px] uppercase tracking-widest clip-path-slant hover:border-mat-500 transition-all flex items-center justify-center gap-2">CONTACTO_DIRECTO</a>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-mat-950">
        <div className="container mx-auto px-6 max-w-6xl">
           <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                 <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter font-exo leading-[0.9]">EL <span className="text-mat-500">SISTEMA.</span></h2>
                 <p className="text-gray-400 italic text-lg leading-relaxed">
                   En Mat32 priorizamos la vida del local sobre el cierre comercial. Si tu propuesta suma a nuestra comunidad y se integra en el bar, el local es tuyo.
                 </p>
                 <div className="space-y-6">
                    <div className="flex gap-4 items-start p-6 bg-mat-900 border border-mat-800 rounded-3xl group hover:border-mat-500 transition-all">
                       <div className="p-3 bg-mat-800 rounded-xl text-mat-500"><Music size={20} /></div>
                       <div>
                          <h4 className="text-white font-black uppercase text-xs tracking-widest mb-1">Cero Coste de Alquiler</h4>
                          <p className="text-[10px] text-gray-500 font-bold uppercase leading-relaxed">Viernes y Sábados desde las 18h: Colaboración abierta sin cargo por horas si el local permanece abierto al público.</p>
                       </div>
                    </div>
                    <div className="flex gap-4 items-start p-6 bg-mat-900 border border-mat-800 rounded-3xl group hover:border-mat-500 transition-all">
                       <div className="p-3 bg-mat-800 rounded-xl text-mat-500"><ShieldCheck size={20} /></div>
                       <div>
                          <h4 className="text-white font-black uppercase text-xs tracking-widest mb-1">Uso Exclusivo & Marcas</h4>
                          <p className="text-[10px] text-gray-500 font-bold uppercase leading-relaxed">Para rodajes, lanzamientos de marcas o cierres totales, consultamos disponibilidad fuera de horario comercial.</p>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 {galleryItems.slice(0, 4).map(item => (
                   <div key={item.id} className="aspect-square bg-mat-800 rounded-[2rem] overflow-hidden border border-mat-700 group cursor-pointer" onClick={() => setLightbox(item)}>
                      <CachedImage src={item.imageUrl} alt={item.title} className="grayscale group-hover:grayscale-0 transition-all duration-700" />
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* Proposal Form */}
      <section id="proposal-form" className="py-32 scroll-mt-24">
        <div className="container mx-auto px-6 max-w-4xl">
           <div className="bg-mat-800 border-2 border-mat-700 p-8 md:p-16 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
              
              {isSubmitted ? (
                <div className="py-20 text-center animate-fade-in">
                   <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-8 animate-bounce" />
                   <h3 className="text-4xl font-black text-white uppercase mb-4 font-exo tracking-tighter">PROTOCOLO_ENVIADO</h3>
                   <p className="text-gray-500 italic mb-10 leading-relaxed">
                     Tu señal ha llegado a <strong>hola@mat32.com</strong>. Revisaremos tu propuesta artística y te contactaremos en breve.
                   </p>
                   <button onClick={() => setIsSubmitted(false)} className="px-10 py-5 bg-mat-900 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl transition-all border border-mat-700 hover:border-mat-500">NUEVA PROPUESTA</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                   <div className="text-center mb-10">
                      <h2 className="text-3xl font-black text-white uppercase tracking-tighter font-exo leading-none mb-2">INYECTA TU IDEA</h2>
                      <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest italic">Captura de intenciones para el Hub Central</p>
                   </div>

                   <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Tu Nombre/Marca</label>
                         <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-4 text-white text-xs font-black rounded-xl outline-none focus:border-mat-500 transition-all" placeholder="ALIAS O COLECTIVO" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Email de Contacto</label>
                         <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-4 text-white text-xs font-black rounded-xl outline-none focus:border-mat-500 transition-all" placeholder="INFO@HUB.COM" />
                      </div>
                   </div>

                   <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Fecha Sugerida</label>
                         <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-4 text-white text-[10px] font-black rounded-xl outline-none focus:border-mat-500 transition-all" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Tipo de Evento</label>
                         <select value={formData.eventType} onChange={e => setFormData({...formData, eventType: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-4 text-white text-[10px] font-black rounded-xl cursor-pointer outline-none focus:border-mat-500 transition-all">
                            <option value="workshop">TALLER / WORKSHOP</option>
                            <option value="acoustic">ACÚSTICO / LIVE SESSION</option>
                            <option value="expo">EXPOSICIÓN DE ARTE</option>
                            <option value="djset">DJ SET / SELECCIÓN</option>
                            <option value="other">OTRO_CONCEPTO</option>
                         </select>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Propuesta Creativa & Necesidades</label>
                      <textarea required value={formData.concept} onChange={e => setFormData({...formData, concept: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-5 h-32 text-white text-xs italic font-bold rounded-2xl outline-none focus:border-mat-500 resize-none transition-all" placeholder="Describe tu idea, pretensiones y qué necesitas de Mat32 (sonido, espacio, horario)..."></textarea>
                   </div>

                   <div className="pt-8 flex flex-col items-center">
                      <div className="p-6 bg-mat-950/50 border border-mat-700 rounded-2xl mb-8 flex items-start gap-4">
                         <Info className="text-mat-500 flex-shrink-0" size={18} />
                         <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                            "Recordatorio: Si tu propuesta busca integrar a la comunidad y se realiza en horario de apertura (Jue-Sab 18-02h), priorizamos la entrada libre y el coste es 0."
                         </p>
                      </div>
                      <button type="submit" disabled={isProcessing} className="w-full py-8 bg-mat-500 text-white font-black uppercase text-[11px] tracking-[0.4em] rounded-[2rem] shadow-2xl hover:bg-mat-400 transition-all flex items-center justify-center gap-4 clip-path-slant disabled:opacity-30 disabled:grayscale">
                         {isProcessing ? <Loader2 className="animate-spin" /> : <Send />} ENVIAR_PROPUESTA_HUB
                      </button>
                   </div>
                </form>
              )}
           </div>
        </div>
      </section>

      {/* Lightbox for Gallery */}
      {lightbox && (
        <div className="fixed inset-0 z-[300] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-6 animate-fade-in" onClick={() => setLightbox(null)}>
           <button className="absolute top-10 right-10 text-white hover:text-mat-500 transition-colors"><X size={48} /></button>
           <div className="max-w-6xl w-full flex flex-col items-center gap-10" onClick={e => e.stopPropagation()}>
              <img src={lightbox.imageUrl} className="max-h-[75vh] object-contain rounded-3xl shadow-2xl border border-mat-800" alt={lightbox.title} />
              <div className="text-center">
                 <h3 className="text-5xl font-black text-white uppercase tracking-tighter font-exo mb-4">{lightbox.title}</h3>
                 <p className="text-gray-400 italic text-xl font-light">"{lightbox.description}"</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};