
import React, { useState, useEffect } from 'react';
import { 
  Wine, Users, Clock, CheckCircle, Martini, 
  ArrowRight, Loader2, Speaker, LayoutGrid, Zap, MapPin, Star,
  TrendingDown, Gift, Info, Music, Volume2, ShieldCheck, Heart,
  ArrowDown, Headphones, Share2, MessageSquare, Camera, Maximize2
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { dataService } from '../services/dataService';
import { CachedImage } from '../components/CachedImage';

export const PrivateEvents: React.FC = () => {
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '',
    date: new Date().toISOString().split('T')[0], 
    duration: 4, 
    guests: 40, 
    ticketsPerGuest: 2,
    eventType: 'private' 
  });
  
  const [quoteBreakdown, setQuoteBreakdown] = useState({
    rentalBase: 0,
    drinksCost: 0,
    discount: 0,
    totalDrinks: 0,
    finalTotal: 0
  });

  useEffect(() => {
    const calculateDetailedQuote = () => {
      const day = new Date(formData.date).getDay();
      const isWeekend = day === 5 || day === 6; 
      const hourlyRate = isWeekend ? 150 : 90;
      
      const rentalBase = formData.duration * hourlyRate;
      const totalDrinks = formData.guests * formData.ticketsPerGuest;
      const drinksCost = totalDrinks * 9.50;
      
      const potentialDiscount = drinksCost / 3;
      const discount = Math.min(rentalBase * 0.7, potentialDiscount);
      
      setQuoteBreakdown({
        rentalBase,
        drinksCost,
        discount,
        totalDrinks,
        finalTotal: (rentalBase - discount) + drinksCost
      });
    };
    calculateDetailedQuote();
  }, [formData]);

  const scrollToSimulator = () => {
    const element = document.getElementById('simulator');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    await dataService.createInboxMessage({
      type: 'lead',
      sender: formData.name,
      email: formData.email,
      phone: formData.phone,
      content: `Propuesta de Alquiler [${formData.eventType.toUpperCase()}]: ${formData.guests} pax, ${formData.duration}h, ${quoteBreakdown.totalDrinks} consumiciones.`,
      metadata: { ...formData, ...quoteBreakdown }
    });
    setIsProcessing(false);
    setIsSubmitted(true);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const eventTypes = [
    { id: 'private', title: 'Celebraciones Privadas', desc: 'Aniversarios, reuniones de amigos y fiestas exclusivas en un entorno Hi-Fi.', icon: <Heart className="text-mat-500" /> },
    { id: 'corporate', title: 'Eventos Corporativos', desc: 'Team buildings, presentaciones de producto y cenas de empresa con identidad.', icon: <ShieldCheck className="text-mat-500" /> },
    { id: 'promoter', title: 'Promotores & Sellos', desc: 'Sesiones de club, fiestas de sello o eventos con venta de entradas propias.', icon: <Zap className="text-mat-500" /> },
    { id: 'collaboration', title: 'Colaboraciones', desc: 'Pop-ups gastronómicos, workshops o eventos culturales compartidos.', icon: <MessageSquare className="text-mat-500" /> }
  ];

  // GALERÍA ACTUALIZADA CON RUTAS LOCALES
  const galleryItems = [
    {
      title: "The Altec Sanctuary",
      desc: "Nuestra sala principal equipada con las Altec A7 'Voice of the Theatre'. El corazón analógico de Ruzafa.",
      url: "gallery-1.jpg",
      alt: "Main event space Mat32 Valencia with Altec speakers"
    },
    {
      title: "The Analog Pulpit",
      desc: "Cabina profesional para DJ sets y sesiones de escucha crítica con mixers rotatorios y platos Technics.",
      url: "gallery-2.jpg",
      alt: "DJ Booth at Mat32 Valencia"
    },
    {
      title: "The Rare Crate",
      desc: "Zona de marketplace y tienda de discos disponible para pop-ups o como zona lounge exclusiva.",
      url: "gallery-3.jpg",
      alt: "Record store area for events Mat32"
    },
    {
      title: "Industrial Heritage",
      desc: "Espacio industrial con alma de Ruzafa, perfecto para presentaciones de marca y cenas corporativas.",
      url: "gallery-4.jpg",
      alt: "Industrial event space interior Valencia"
    }
  ];

  return (
    <div className="min-h-screen bg-mat-900 font-sans">
      <SEO 
        titleKey="seo.private.title" 
        descriptionKey="seo.private.description" 
        schemaType="BarOrPub" 
      />
      
      {/* Hero Visual - FOTO REAL */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <CachedImage 
            src="hero-hire.jpg" 
            alt="Alquiler local eventos Valencia - Sala Ruzafa" 
            className="w-full h-full opacity-40 grayscale-[30%]" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-mat-900/95 via-mat-900/40 to-mat-900"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-mat-900 border border-mat-500 text-mat-500 text-[10px] font-black uppercase tracking-[0.5em] rounded-full mb-8 animate-fade-in shadow-2xl">
            <Zap className="w-4 h-4" /> RUZAFA EVENT SPACE
          </div>
          <h1 className="text-6xl md:text-[8rem] font-black uppercase tracking-tighter text-white font-exo leading-none text-glow mb-8 animate-fade-in">
            ALQUILER <span className="text-mat-500">LOCAL</span> PARA EVENTOS <span className="text-mat-500">VALENCIA.</span>
          </h1>
          <p className="text-gray-400 max-w-4xl mx-auto text-xl md:text-2xl font-light italic leading-relaxed animate-fade-in mb-14">
            Descubre nuestra **sala de eventos en Valencia**. Un santuario de sonido High Fidelity en Ruzafa diseñado para experiencias privadas y corporativas únicas.
          </p>
          
          <div className="animate-fade-in delay-200">
            <button 
              onClick={scrollToSimulator}
              className="px-14 py-7 bg-mat-500 hover:bg-mat-400 text-white font-black text-[12px] uppercase tracking-[0.4em] transition-all clip-path-slant shadow-[0_20px_50px_rgba(234,88,12,0.4)] flex items-center justify-center gap-4 mx-auto group"
            >
              SIMULAR EVENTO <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Protocolos Grid */}
      <section className="py-32 bg-mat-900 border-y border-mat-800">
        <div className="container mx-auto px-6">
           <div className="text-center mb-20">
              <h2 className="text-[10px] font-black text-mat-500 uppercase tracking-[0.5em] mb-4">ESPACIO POLIVALENTE EN RUZAFA</h2>
              <h3 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter font-exo">Tu sala de eventos en Valencia.</h3>
              <p className="text-gray-500 mt-6 italic text-lg max-w-2xl mx-auto leading-relaxed">
                Desde fiestas de cumpleaños hasta colaboraciones con promotores. Ofrecemos un **alquiler de local en Valencia** adaptado a tu proyecto musical o corporativo.
              </p>
           </div>
           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {eventTypes.map((type, i) => (
                <div key={i} className="bg-mat-800 border-2 border-mat-700 p-10 rounded-[2.5rem] hover:border-mat-500 transition-all shadow-xl group">
                   <div className="w-16 h-16 bg-mat-900 border border-mat-700 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">{type.icon}</div>
                   <h4 className="text-2xl font-black text-white uppercase mb-4 font-exo">{type.title}</h4>
                   <p className="text-gray-500 text-sm italic leading-relaxed">{type.desc}</p>
                   <button 
                    onClick={() => { setFormData({...formData, eventType: type.id}); scrollToSimulator(); }}
                    className="mt-8 text-[9px] font-black text-mat-500 hover:text-white uppercase tracking-widest flex items-center gap-2"
                   >
                     SELECCIONAR PROTOCOLO <ArrowRight size={12} />
                   </button>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* New Enhanced Venue Gallery */}
      <section className="py-32 bg-mat-950">
        <div className="container mx-auto px-6">
           <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="max-w-2xl">
                 <div className="inline-flex items-center gap-3 text-mat-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">
                    <Camera size={18} /> TOUR VIRTUAL
                 </div>
                 <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter font-exo leading-none">Explora el <span className="text-mat-500">Espacio.</span></h2>
              </div>
              <p className="text-gray-500 text-sm italic max-w-xs text-right leading-relaxed">Cada rincón de Mat32 ha sido diseñado para maximizar la acústica y la comodidad analógica.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {galleryItems.map((item, i) => (
                <div key={i} className="group relative aspect-[16/10] overflow-hidden rounded-[3rem] border-2 border-mat-800 hover:border-mat-500 transition-all cursor-crosshair">
                   <CachedImage 
                    src={item.url} 
                    alt={item.alt} 
                    className="w-full h-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-mat-900 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                   
                   {/* Caption Overlay */}
                   <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="flex justify-between items-end">
                         <div className="max-w-[80%]">
                            <h4 className="text-white text-2xl md:text-3xl font-black uppercase font-exo tracking-tight mb-2 flex items-center gap-3">
                               {item.title} <span className="w-8 h-[2px] bg-mat-500 hidden md:block"></span>
                            </h4>
                            <p className="text-gray-300 text-xs md:text-sm font-light italic opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 leading-relaxed">
                               {item.desc}
                            </p>
                         </div>
                         <div className="p-4 bg-mat-500 text-white rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all delay-200">
                            <Maximize2 size={20} />
                         </div>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Simulator Section */}
      <section id="simulator" className="py-40 bg-mat-900 scroll-mt-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-24">
             <div className="inline-flex items-center gap-3 text-mat-500 font-black uppercase tracking-[0.5em] text-[10px] mb-4">
                <LayoutGrid size={18} /> CALCULA TU PRESUPUESTO
             </div>
             <h2 className="text-4xl md:text-8xl font-black text-white uppercase tracking-tighter font-exo">Presupuesto en vivo.</h2>
             <p className="text-gray-500 mt-6 italic">Simula tu **alquiler de espacio en Ruzafa** y recibe una propuesta detallada.</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-16 md:gap-24 items-start">
            <div className="lg:col-span-7 space-y-12">
               <div className="bg-mat-800 border-2 border-mat-700 p-8 md:p-14 rounded-[3.5rem] shadow-2xl relative">
                  <div className="space-y-14">
                     <div className="space-y-6">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                           <span>{t('private.simulator.guests')}</span>
                           <span className="text-white text-xl font-exo">{formData.guests} PAX</span>
                        </div>
                        <input type="range" min="20" max="100" step="5" value={formData.guests} onChange={e => setFormData({...formData, guests: Number(e.target.value)})} className="w-full accent-mat-500 h-2 bg-mat-900 rounded-lg appearance-none cursor-pointer" />
                     </div>

                     <div className="space-y-6">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                           <span>{t('private.simulator.duration')}</span>
                           <span className="text-white text-xl font-exo">{formData.duration} HORAS</span>
                        </div>
                        <input type="range" min="3" max="8" step="1" value={formData.duration} onChange={e => setFormData({...formData, duration: Number(e.target.value)})} className="w-full accent-mat-500 h-2 bg-mat-900 rounded-lg appearance-none cursor-pointer" />
                     </div>

                     <div className="space-y-6">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                           <span>{t('private.simulator.drinks')}</span>
                           <span className="text-white text-xl font-exo">{formData.ticketsPerGuest} CONSUMICIONES / PAX</span>
                        </div>
                        <input type="range" min="1" max="5" step="1" value={formData.ticketsPerGuest} onChange={e => setFormData({...formData, ticketsPerGuest: Number(e.target.value)})} className="w-full accent-mat-500 h-2 bg-mat-900 rounded-lg appearance-none cursor-pointer" />
                     </div>
                  </div>

                  <div className="mt-20 bg-mat-900/40 border-2 border-mat-700 rounded-[3rem] p-10 md:p-14 space-y-8">
                     <div className="flex justify-between items-center text-xs font-black uppercase text-gray-500 tracking-widest">
                        <span>Coste Base de Alquiler</span>
                        <span className="text-white">€{quoteBreakdown.rentalBase.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between items-center text-xs font-black uppercase text-gray-500 tracking-widest">
                        <span>Crédito Bebidas Premium</span>
                        <span className="text-white">€{quoteBreakdown.drinksCost.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between items-center text-xs font-black uppercase text-green-500 tracking-widest pb-8 border-b border-mat-800">
                        <span className="flex items-center gap-2"><TrendingDown size={14} /> Descuento por Consumo</span>
                        <span>- €{quoteBreakdown.discount.toFixed(2)}</span>
                     </div>
                     
                     <div className="flex flex-col md:flex-row justify-between items-center gap-10 pt-6">
                        <div className="flex items-center gap-5 bg-mat-800 p-6 rounded-2xl border border-mat-700 shadow-xl w-full md:w-auto">
                           <div className="p-4 bg-mat-900 rounded-xl text-mat-500"><Gift size={24} /></div>
                           <div className="text-left">
                              <span className="block text-[9px] font-black text-gray-500 uppercase tracking-widest">PACK TOTAL</span>
                              <span className="text-white font-black text-sm uppercase tracking-tighter leading-none mt-1">{quoteBreakdown.totalDrinks} TICKETS INCLUIDOS</span>
                           </div>
                        </div>
                        <div className="text-right w-full md:w-auto">
                           <span className="block text-[10px] font-black text-mat-500 uppercase tracking-[0.3em] mb-2">TOTAL ESTIMADO</span>
                           <span className="text-6xl md:text-8xl font-black text-white font-exo leading-none tracking-tighter">€{quoteBreakdown.finalTotal.toFixed(0)}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <aside className="lg:col-span-5 lg:sticky lg:top-32">
              <div className="bg-mat-800 border-2 border-mat-700 rounded-[3.5rem] p-10 md:p-14 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
                 {isSubmitted ? (
                   <div className="py-24 text-center animate-fade-in">
                      <CheckCircle className="w-16 h-16 text-mat-500 mx-auto mb-10 shadow-xl" />
                      <h4 className="text-3xl font-black text-white uppercase mb-6 font-exo tracking-tighter">Señal Recibida</h4>
                      <p className="text-gray-500 italic mb-10 leading-relaxed">Nuestro Manager contactará contigo para formalizar el **alquiler de local en Valencia**.</p>
                      <button onClick={() => setIsSubmitted(false)} className="px-10 py-5 border-2 border-mat-700 text-gray-500 hover:text-white font-black uppercase text-[10px] tracking-widest rounded-2xl transition-all">Nueva Simulación</button>
                   </div>
                 ) : (
                   <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Modalidad de Evento</label>
                         <select 
                            value={formData.eventType} 
                            onChange={e => setFormData({...formData, eventType: e.target.value})}
                            className="w-full bg-mat-900 border border-mat-700 p-5 text-white uppercase text-[10px] font-black rounded-2xl outline-none focus:border-mat-500 shadow-inner appearance-none cursor-pointer"
                         >
                            {eventTypes.map(t => <option key={t.id} value={t.id}>{t.title.toUpperCase()}</option>)}
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Responsable / Promotor</label>
                         <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-5 text-white uppercase text-[10px] font-black rounded-2xl outline-none focus:border-mat-500 shadow-inner" placeholder="NOMBRE O COLECTIVO" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Email</label>
                         <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-5 text-white font-black text-[10px] rounded-2xl outline-none focus:border-mat-500 shadow-inner" placeholder="EMAIL" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Teléfono</label>
                         <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-5 text-white font-black text-[10px] rounded-2xl outline-none focus:border-mat-500 shadow-inner" placeholder="+34..." />
                      </div>
                      <button type="submit" disabled={isProcessing} className="w-full py-8 bg-mat-500 hover:bg-mat-400 text-white font-black uppercase tracking-[0.4em] rounded-[2.5rem] shadow-2xl flex items-center justify-center gap-4 transition-all group mt-8 shadow-mat-500/20">
                         {isProcessing ? <Loader2 className="animate-spin" /> : <ArrowRight className="group-hover:translate-x-2 transition-transform" />} ENVIAR PROPUESTA
                      </button>
                   </form>
                 )}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
};
