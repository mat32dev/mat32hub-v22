import React, { useState, useEffect } from 'react';
import { 
  Users, ArrowRight, Loader2, Zap, LayoutGrid, Camera, 
  CheckCircle, ShieldCheck, Heart, ArrowDown, ExternalLink, 
  Info, Calendar, Clock, Music, MapPin, Settings, Award, Send, X, Maximize2, AlertTriangle, UserPlus
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
    phone: '',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    duration: 4, 
    guests: 40, 
    ticketsPerGuest: 2,
    eventType: 'private' // 'private' or 'collab'
  });
  
  const [quoteBreakdown, setQuoteBreakdown] = useState({
    rentalBase: 0,
    drinksCost: 0,
    discount: 0,
    totalDrinks: 0,
    finalTotal: 0,
    isConflict: false
  });

  const loadGallery = async () => {
    const items = await dataService.getGallery();
    setGalleryItems(items);
  };

  useEffect(() => {
    loadGallery();
    window.addEventListener('mat32_data_changed', loadGallery);
    return () => window.removeEventListener('mat32_data_changed', loadGallery);
  }, []);

  useEffect(() => {
    const calculateDetailedQuote = () => {
      const selectedDate = new Date(formData.date);
      const day = selectedDate.getDay(); // 0: Sun, 4: Thu, 5: Fri, 6: Sat
      const hour = parseInt(formData.time.split(':')[0]);
      
      // Horario al público: J/V/S de 18h a 02h
      const isPublicHours = (day >= 4 && day <= 6) && (hour >= 18 || hour < 2);
      // Conflict only applies to private events during public hours
      const isConflict = formData.eventType === 'private' && isPublicHours;

      const hourlyRate = (day === 5 || day === 6) ? 150 : 95;
      const rentalBase = formData.duration * hourlyRate;
      const totalDrinks = formData.guests * formData.ticketsPerGuest;
      const drinksCost = totalDrinks * 9.50;
      
      // Collaborative events get higher discount factors as they are part of the curated agenda
      const discountFactor = formData.eventType === 'collab' ? 0.8 : 0.4;
      const potentialDiscount = drinksCost * discountFactor;
      const discount = Math.min(rentalBase * 0.9, potentialDiscount);
      
      setQuoteBreakdown({
        rentalBase,
        drinksCost,
        discount,
        totalDrinks,
        finalTotal: (rentalBase - discount) + drinksCost,
        isConflict
      });
    };
    calculateDetailedQuote();
  }, [formData]);

  const scrollToSimulator = () => {
    const element = document.getElementById('simulator');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quoteBreakdown.isConflict) return;
    setIsProcessing(true);
    await dataService.createInboxMessage({
      type: 'lead',
      sender: formData.name,
      email: formData.email,
      phone: formData.phone,
      content: `Solicitud Alquiler [${formData.eventType.toUpperCase()}]: ${formData.guests} pax, ${formData.duration}h el ${formData.date} a las ${formData.time}.`,
      metadata: { ...formData, ...quoteBreakdown }
    });
    setIsProcessing(false);
    setIsSubmitted(true);
  };

  const features = [
    { title: "SALA DE EVENTOS VALENCIA", desc: "El espacio polivalente más exclusivo de Valencia con sonido Altec A7 original.", icon: <Music className="text-mat-500" /> },
    { title: "ALQUILER ESPACIO RUZAFA", desc: "Ubicación privilegiada en Ruzafa. Puerta cerrada para eventos privados (Mon-Sun fuera de horario comercial).", icon: <ShieldCheck className="text-mat-500" /> },
    { title: "COLABORACIONES SIEMPRE", desc: "Disponibilidad total para promotores, marcas y productoras en formato curado.", icon: <UserPlus className="text-mat-500" /> }
  ];

  return (
    <div className="min-h-screen bg-mat-900 font-sans text-mat-cream pb-32">
      <SEO 
        titleKey="seo.private.title" 
        descriptionKey="seo.private.description" 
        schemaType="LocalBusiness"
        image="https://lrilkrktztlabjpxqbyc.supabase.co/storage/v1/object/public/local-gallery/mat32%20inside.jpg"
      />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <CachedImage src="https://lrilkrktztlabjpxqbyc.supabase.co/storage/v1/object/public/local-gallery/mat32%20inside.jpg" alt="Mat32 Sala de Eventos Valencia y Alquiler Ruzafa" className="w-full h-full opacity-40 grayscale-[20%]" priority={true} />
          <div className="absolute inset-0 bg-gradient-to-b from-mat-900/90 via-mat-900/30 to-mat-900"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-mat-900 border border-mat-500 text-mat-500 text-[10px] font-black uppercase tracking-[0.5em] rounded-full mb-8 animate-fade-in shadow-2xl">
            <Zap className="w-4 h-4" /> VENUE PROTOCOL VLC
          </div>
          <h1 className="text-5xl md:text-[7rem] font-black uppercase tracking-tighter text-white font-exo leading-none mb-8 animate-fade-in">SALA DE EVENTOS EN <span className="text-mat-500">VALENCIA.</span></h1>
          <p className="text-gray-400 max-w-4xl mx-auto text-xl md:text-2xl font-light italic leading-relaxed mb-14 px-4">
            Alquiler de espacio exclusivo en Ruzafa para rodajes, eventos corporativos y celebraciones con alma analógica y sonido High Fidelity.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button onClick={scrollToSimulator} className="px-12 py-6 bg-mat-500 text-white font-black text-[11px] uppercase tracking-widest clip-path-slant shadow-xl hover:bg-mat-400 transition-all">SIMULAR_PRESUPUESTO</button>
            <a href="mailto:hola@mat32.com" className="px-12 py-6 bg-mat-800 border-2 border-mat-700 text-white font-black text-[11px] uppercase tracking-widest clip-path-slant hover:border-mat-500 transition-all">CONTACTO_DIRECTO</a>
          </div>
        </div>
      </section>

      {/* Info Blocks */}
      <section className="py-24 bg-mat-900 border-y border-mat-800/30">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <div key={i} className="bg-mat-800/40 p-10 rounded-[2.5rem] border border-mat-800 hover:border-mat-500 transition-all group">
               <div className="w-14 h-14 bg-mat-900 rounded-2xl flex items-center justify-center mb-6 border border-mat-700">{f.icon}</div>
               <h3 className="text-xl font-black text-white uppercase tracking-tighter font-exo mb-3">{f.title}</h3>
               <p className="text-gray-500 text-sm italic">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Advanced Bento Gallery - SEO & Accessibility Optimized */}
      <section className="py-32 bg-mat-950 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
               <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter font-exo leading-none mb-6">EL <span className="text-mat-500">DOSSIER_VISUAL.</span></h2>
               <p className="text-gray-500 text-lg italic">Explora nuestra sala de eventos en Valencia. Arquitectura sonora y confort visual en Ruzafa.</p>
            </div>
            <div className="flex items-center gap-4 text-mat-500 font-black uppercase text-[10px] tracking-widest bg-mat-900 px-6 py-3 rounded-2xl border border-mat-800 shadow-xl">
               <Camera size={16} /> STUDIO_INSPECTION
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 auto-rows-[300px]">
            {galleryItems.map((item, i) => {
              const colSpan = i % 5 === 0 ? 'md:col-span-8' : i % 5 === 3 ? 'md:col-span-6' : 'md:col-span-4';
              const rowSpan = i % 5 === 0 ? 'md:row-span-2' : 'md:row-span-1';

              return (
                <article 
                  key={item.id} 
                  onClick={() => setLightbox(item)}
                  className={`${colSpan} ${rowSpan} relative group rounded-[3rem] overflow-hidden border-2 border-mat-800 hover:border-mat-500 transition-all duration-700 cursor-zoom-in shadow-2xl bg-mat-900 focus-within:ring-2 focus-within:ring-mat-500`}
                  role="button"
                  aria-label={`Ver imagen: ${item.title} en nuestra sala de eventos`}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setLightbox(item)}
                >
                  <CachedImage src={item.imageUrl} alt={`${item.title} - Sala de Eventos Valencia Mat32`} className="w-full h-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-mat-950/90 via-mat-950/20 to-transparent flex flex-col justify-end p-8 md:p-12 transition-all opacity-0 group-hover:opacity-100 group-focus:opacity-100">
                    <h3 className="text-white font-black uppercase text-2xl md:text-3xl tracking-tighter font-exo mb-2">{item.title}</h3>
                    <p className="text-gray-300 text-sm italic mb-6 line-clamp-2">"{item.description}"</p>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map(tag => (
                        <span key={tag} className="text-[8px] font-black text-mat-500 bg-mat-900/80 backdrop-blur-md border border-mat-700 px-3 py-1.5 rounded-full uppercase tracking-widest">{tag}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="absolute top-8 left-8 bg-mat-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-mat-800 text-[9px] font-black text-white uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                     <Info size={12} className="text-mat-500" /> DETALLES
                  </div>
                  <Maximize2 className="absolute top-8 right-8 text-white opacity-0 group-hover:opacity-100 transition-all" size={20} />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Simulator Section */}
      <section id="simulator" className="py-32 bg-mat-900 scroll-mt-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-20">
             <h2 className="text-4xl md:text-8xl font-black text-white uppercase tracking-tighter font-exo mb-6 leading-none">RESERVA_<span className="text-mat-500">QUOTE.</span></h2>
             <p className="text-gray-500 max-w-2xl mx-auto italic">
               Solicita presupuesto para el alquiler de nuestra sala de eventos en Valencia. Los eventos privados se realizan fuera de horario comercial J/V/S (18h-02h).
             </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-10 bg-mat-800 p-10 md:p-16 rounded-[3.5rem] border border-mat-700 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
               
               <div className="flex bg-mat-900 p-1.5 rounded-2xl border border-mat-700 mb-10">
                  <button 
                    onClick={() => setFormData({...formData, eventType: 'private'})}
                    className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.eventType === 'private' ? 'bg-mat-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                  >
                    ALQUILER PRIVADO
                  </button>
                  <button 
                    onClick={() => setFormData({...formData, eventType: 'collab'})}
                    className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.eventType === 'collab' ? 'bg-mat-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                  >
                    COLABORACIÓN
                  </button>
               </div>

               <div className="space-y-10">
                  <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase text-mat-500 tracking-widest">
                       <span>Aforo Estimado</span>
                       <span className="text-white">{formData.guests} PAX</span>
                    </div>
                    <input type="range" min="20" max="100" step="5" value={formData.guests} onChange={e => setFormData({...formData, guests: Number(e.target.value)})} className="w-full accent-mat-500 h-1.5 bg-mat-900 rounded-full appearance-none cursor-pointer" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase text-mat-500 tracking-widest">
                       <span>Horas de Uso</span>
                       <span className="text-white">{formData.duration}H</span>
                    </div>
                    <input type="range" min="3" max="8" step="1" value={formData.duration} onChange={e => setFormData({...formData, duration: Number(e.target.value)})} className="w-full accent-mat-500 h-1.5 bg-mat-900 rounded-full appearance-none cursor-pointer" />
                  </div>
               </div>

               <div className="pt-10 border-t border-mat-700 space-y-4">
                  <div className="flex justify-between text-xs text-gray-500 font-bold uppercase tracking-widest">
                    <span>Base Alquiler Espacio Ruzafa</span>
                    <span className="text-white">€{quoteBreakdown.rentalBase.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-emerald-500 font-bold uppercase tracking-widest">
                    <span>Incentivo por Consumo</span>
                    <span className="font-mono">-€{quoteBreakdown.discount.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-end pt-8 border-t border-mat-700">
                    <div className="text-mat-500 font-black uppercase text-[11px] tracking-widest leading-none">PRESUPUESTO TOTAL</div>
                    <div className="text-5xl md:text-7xl font-black text-white font-exo leading-none">€{quoteBreakdown.finalTotal.toFixed(0)}</div>
                  </div>
               </div>

               {quoteBreakdown.isConflict && (
                 <div className="mt-8 p-6 bg-red-500/10 border-2 border-red-500 rounded-3xl animate-fade-in flex items-start gap-4">
                    <AlertTriangle className="text-red-500 flex-shrink-0" size={24} />
                    <div>
                       <p className="text-xs font-black text-red-500 uppercase mb-2 tracking-widest">Horario al Público Detectado</p>
                       <p className="text-[10px] text-gray-400 italic leading-relaxed">
                         "Los alquileres privados no están disponibles durante el horario de bar (J/V/S 18h-02h). Selecciona otro horario o consulta colaboraciones si tu evento es abierto al público o una marca."
                       </p>
                    </div>
                 </div>
               )}
            </div>

            <div className="bg-mat-950 p-10 md:p-16 rounded-[4rem] border-2 border-mat-500 shadow-2xl">
               {isSubmitted ? (
                 <div className="py-20 text-center animate-fade-in">
                    <CheckCircle className="w-20 h-20 text-mat-500 mx-auto mb-8 animate-bounce" />
                    <h3 className="text-3xl font-black text-white uppercase mb-4 font-exo">SOLICITUD INYECTADA</h3>
                    <p className="text-gray-500 italic mb-10 leading-relaxed">Nuestro equipo técnico revisará tu solicitud para el <strong>{formData.date}</strong>. Recibirás respuesta oficial en menos de 24h.</p>
                    <button onClick={() => setIsSubmitted(false)} className="px-10 py-4 bg-mat-800 text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition-all">Nueva Simulación</button>
                 </div>
               ) : (
                 <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-center gap-3 mb-8 border-b border-mat-800 pb-4">
                       <Award className="text-mat-500" size={20} />
                       <h4 className="text-2xl font-black text-white uppercase tracking-tighter font-exo">SOLICITUD_SALA_VLC</h4>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-1">Fecha Evento</label>
                          <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-mat-900 border border-mat-800 p-5 text-white uppercase text-[10px] font-black rounded-2xl focus:border-mat-500 outline-none" />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-1">Hora Inicio</label>
                          <input required type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full bg-mat-900 border border-mat-800 p-5 text-white uppercase text-[10px] font-black rounded-2xl focus:border-mat-500 outline-none" />
                       </div>
                    </div>

                    <div className="space-y-1">
                       <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-1">Empresa o Marca</label>
                       <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-mat-900 border border-mat-800 p-5 text-white uppercase text-[10px] font-black rounded-2xl focus:border-mat-500 outline-none" placeholder="EJ: RED BULL / RODAJES S.A." />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-1">Email</label>
                          <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-5 text-white uppercase text-[10px] font-black rounded-2xl focus:border-mat-500 outline-none" placeholder="INFO@MARK.COM" />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-1">Teléfono</label>
                          <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-5 text-white uppercase text-[10px] font-black rounded-2xl focus:border-mat-500 outline-none" placeholder="+34 600..." />
                       </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isProcessing || quoteBreakdown.isConflict} 
                      className="w-full py-8 bg-mat-500 text-white font-black uppercase text-[11px] tracking-[0.4em] rounded-[2rem] shadow-2xl hover:bg-mat-400 transition-all flex items-center justify-center gap-4 mt-8 clip-path-slant group disabled:opacity-30 disabled:grayscale"
                    >
                       {isProcessing ? <Loader2 className="animate-spin" /> : <Send className="group-hover:translate-x-2 transition-transform" size={18} />} BLOQUEAR_SALA_RUZAFA
                    </button>
                    
                    <p className="text-[8px] text-gray-600 font-black uppercase text-center mt-4 tracking-widest px-4">
                       "Al enviar este formulario, confirmas el interés en el alquiler del espacio Mat32 en Ruzafa, Valencia."
                    </p>
                 </form>
               )}
            </div>
          </div>
        </div>
      </section>

      {/* Responsive Accessible Lightbox */}
      {lightbox && (
        <div 
          className="fixed inset-0 z-[300] bg-black/98 backdrop-blur-2xl flex items-center justify-center p-4 md:p-10 animate-fade-in" 
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
           <button 
             className="absolute top-6 right-6 text-white hover:text-mat-500 transition-colors z-50 p-2" 
             onClick={() => setLightbox(null)}
             aria-label="Cerrar galería"
           >
             <X size={48} />
           </button>
           
           <div className="max-w-6xl w-full flex flex-col items-center gap-8 md:gap-12 overflow-y-auto max-h-screen py-20" onClick={e => e.stopPropagation()}>
              <div className="relative group/lb w-full flex justify-center">
                 <img 
                   src={lightbox.imageUrl} 
                   className="max-h-[70vh] w-auto object-contain rounded-3xl shadow-[0_0_100px_rgba(234,88,12,0.2)] border border-mat-800" 
                   alt={`${lightbox.title} - Sala de Eventos Valencia`} 
                 />
              </div>
              <div className="text-center max-w-3xl px-6">
                 <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter font-exo mb-4">{lightbox.title}</h3>
                 <p className="text-gray-400 italic text-lg md:text-xl font-light leading-relaxed">"{lightbox.description}"</p>
                 <div className="flex flex-wrap justify-center gap-4 mt-8">
                    <span className="px-6 py-2 bg-mat-800 text-mat-500 text-[10px] font-black uppercase rounded-full border border-mat-700 tracking-widest shadow-xl">{lightbox.category}</span>
                    <div className="flex items-center gap-2 text-gray-500 text-[10px] font-black uppercase tracking-widest bg-mat-900/50 px-4 py-2 rounded-full border border-mat-800">
                       <MapPin size={12} className="text-mat-500" /> MAT32 RUZAFA VALENCIA
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};