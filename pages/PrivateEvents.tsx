
import React, { useState, useEffect } from 'react';
import { 
  Users, ArrowRight, Loader2, Zap, LayoutGrid, Camera, 
  CheckCircle, ShieldCheck, Heart, ArrowDown, ExternalLink, 
  Info, TrendingDown, Gift, Calendar, Clock, Music, MapPin, 
  Settings, Award
} from 'lucide-react';
import { SEO } from '../components/SEO.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { dataService } from '../services/dataService.ts';
import { CachedImage } from '../components/CachedImage.tsx';

export const PrivateEvents: React.FC = () => {
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '',
    date: new Date().toISOString().split('T')[0],
    time: '20:00',
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
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const features = [
    {
      title: "SONIDO HIGH FIDELITY",
      desc: "Equipado con altavoces Altec A7 'Voice of the Theatre' y Klipsch La Scala. Una experiencia auditiva inigualable para tus invitados.",
      icon: <Music className="text-mat-500" />
    },
    {
      title: "EXCLUSIVIDAD TOTAL",
      desc: "Alquiler a puerta cerrada en pleno Ruzafa. El espacio es vuestro, sin interferencias ni público ajeno al evento.",
      icon: <ShieldCheck className="text-mat-500" />
    },
    {
      title: "COCTELERÍA DE AUTOR",
      desc: "Servicio de barra profesional con coctelería curada y selección de destilados premium incluidos en tu presupuesto.",
      icon: <Zap className="text-mat-500" />
    }
  ];

  const galleryItems = [
    {
      src: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1200",
      title: "HI-FI SANCTUARY",
      description: "Nuestra cabina principal equipada con tecnología analógica de referencia."
    },
    {
      src: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=1200",
      title: "SIGNATURE BAR",
      description: "Coctelería de autor diseñada para elevar la experiencia auditiva."
    },
    {
      src: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200",
      title: "VINTAGE AUDIO",
      description: "Altavoces Altec A7 restaurados para un sonido cálido y envolvente."
    },
    {
      src: "https://images.unsplash.com/photo-1563841930606-67e2b645b7bb?q=80&w=1200",
      title: "ATMÓSFERA EXCLUSIVA",
      description: "Iluminación tenue y diseño industrial en el corazón de Ruzafa."
    },
    {
      src: "https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?q=80&w=1200",
      title: "VINYL SELECTION",
      description: "Acceso a nuestra biblioteca curada de rarezas para tu evento."
    },
    {
      src: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=1200",
      title: "ESPACIO FLEXIBLE",
      description: "Configuración adaptable para presentaciones, cenas o fiestas privadas."
    }
  ];

  return (
    <div className="min-h-screen bg-mat-900 font-sans text-mat-cream">
      <SEO 
        titleKey="seo.private.title" 
        descriptionKey="seo.private.description" 
      />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <CachedImage 
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2000" 
            alt="Alquiler local eventos Valencia - Sala Ruzafa Mat32" 
            className="w-full h-full opacity-40 grayscale-[20%]" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-mat-900/90 via-mat-900/30 to-mat-900"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-mat-900 border border-mat-500 text-mat-500 text-[10px] font-black uppercase tracking-[0.5em] rounded-full mb-8 animate-fade-in shadow-2xl">
            <Zap className="w-4 h-4" /> LOCAL EVENTOS VALENCIA
          </div>
          <h1 className="text-6xl md:text-[8rem] font-black uppercase tracking-tighter text-white font-exo leading-none text-glow mb-8 animate-fade-in">
            EL ESPACIO PARA <span className="text-mat-500">TUS EVENTOS.</span>
          </h1>
          <p className="text-gray-400 max-w-4xl mx-auto text-xl md:text-2xl font-light italic leading-relaxed animate-fade-in mb-14 px-4">
            Ubicado en Ruzafa, Mat32 es el primer 'Discos Bar' Hi-Fi de Valencia disponible para eventos privados exclusivos.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 animate-fade-in">
            <button onClick={scrollToSimulator} className="px-12 py-6 bg-mat-500 text-white font-black text-[11px] uppercase tracking-widest clip-path-slant shadow-xl hover:bg-mat-400 transition-all">
              SIMULAR PRESUPUESTO
            </button>
            <a href="mailto:hola@mat32.com" className="px-12 py-6 bg-mat-800 border-2 border-mat-700 text-white font-black text-[11px] uppercase tracking-widest clip-path-slant hover:border-mat-500 transition-all">
              MÁS INFORMACIÓN
            </a>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
          <ArrowDown size={32} />
        </div>
      </section>

      {/* Info Modules Section */}
      <section className="py-32 bg-mat-900">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            {features.map((f, i) => (
              <div key={i} className="bg-mat-800/50 p-12 rounded-[3rem] border border-mat-800 hover:border-mat-500/50 transition-all group shadow-xl">
                 <div className="w-16 h-16 bg-mat-900 rounded-2xl flex items-center justify-center mb-8 border border-mat-700 group-hover:scale-110 transition-transform">
                    {f.icon}
                 </div>
                 <h3 className="text-2xl font-black text-white uppercase tracking-tighter font-exo mb-4">{f.title}</h3>
                 <p className="text-gray-500 italic leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Gallery Section */}
      <section className="py-24 bg-mat-950 border-y border-mat-800" aria-labelledby="gallery-title">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-xl">
              <h2 id="gallery-title" className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter font-exo leading-none">GALERÍA DEL <span className="text-mat-500">SANTUARIO.</span></h2>
              <p className="text-gray-500 text-lg mt-4 italic">Un espacio diseñado para los amantes del buen gusto y el sonido analógico.</p>
            </div>
            <div className="flex items-center gap-4 text-mat-500 font-black uppercase text-[10px] tracking-widest">
               <Camera size={18} /> MAT32 INTERNAL SIGNAL
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {galleryItems.map((item, i) => (
              <figure 
                key={i} 
                className="bg-mat-800 border border-mat-700 rounded-[2.5rem] overflow-hidden shadow-2xl group flex flex-col transition-all hover:border-mat-500"
              >
                <div className="relative aspect-square overflow-hidden bg-black">
                   <CachedImage 
                     src={item.src} 
                     alt={item.title} 
                     className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" 
                   />
                   <div className="absolute inset-0 bg-mat-950/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
                <figcaption className="p-8 space-y-3">
                   <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-mat-500 rounded-full animate-pulse"></span>
                      <h3 className="text-lg font-black text-white uppercase tracking-wider font-exo leading-none">
                        {item.title}
                      </h3>
                   </div>
                   <p className="text-gray-400 text-[11px] font-medium leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">
                      {item.description}
                   </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Simulator Section */}
      <section id="simulator" className="py-32 bg-mat-900 scroll-mt-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
             <div className="inline-flex items-center gap-2 px-4 py-1 bg-mat-500/10 border border-mat-500/30 text-mat-500 text-[9px] font-black uppercase tracking-[0.4em] rounded-full mb-4">
                PROTOCOL CALCULATOR
             </div>
             <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter font-exo mb-4 leading-none">PRESUPUESTO <span className="text-mat-500">INSTANTÁNEO.</span></h2>
             <p className="text-gray-500 max-w-lg mx-auto italic">Ajusta los parámetros para obtener una estimación en tiempo real de tu evento privado.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Calculadora */}
            <div className="space-y-12 bg-mat-800 p-10 md:p-12 rounded-[3rem] border border-mat-700 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500 opacity-20"></div>
               <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase text-mat-500 tracking-widest">
                       <span>Invitados (PAX)</span>
                       <span className="text-white bg-mat-900 px-3 py-1 rounded border border-mat-700">{formData.guests} PERSONAS</span>
                    </div>
                    <input type="range" min="20" max="100" step="5" value={formData.guests} onChange={e => setFormData({...formData, guests: Number(e.target.value)})} className="w-full accent-mat-500 h-1.5 bg-mat-900 rounded-full appearance-none cursor-pointer" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase text-mat-500 tracking-widest">
                       <span>Duración del Evento</span>
                       <span className="text-white bg-mat-900 px-3 py-1 rounded border border-mat-700">{formData.duration} HORAS</span>
                    </div>
                    <input type="range" min="3" max="8" step="1" value={formData.duration} onChange={e => setFormData({...formData, duration: Number(e.target.value)})} className="w-full accent-mat-500 h-1.5 bg-mat-900 rounded-full appearance-none cursor-pointer" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase text-mat-500 tracking-widest">
                       <span>Tickets Consumición p/p</span>
                       <span className="text-white bg-mat-900 px-3 py-1 rounded border border-mat-700">{formData.ticketsPerGuest} CONSUMICIONES</span>
                    </div>
                    <input type="range" min="1" max="4" step="1" value={formData.ticketsPerGuest} onChange={e => setFormData({...formData, ticketsPerGuest: Number(e.target.value)})} className="w-full accent-mat-500 h-1.5 bg-mat-900 rounded-full appearance-none cursor-pointer" />
                  </div>
               </div>
               
               <div className="pt-10 border-t border-mat-700 space-y-5">
                  <div className="flex justify-between text-xs text-gray-500 font-bold uppercase tracking-widest">
                    <span>Base Alquiler Espacio</span>
                    <span className="font-mono">€{quoteBreakdown.rentalBase.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-green-500 font-bold uppercase tracking-widest">
                    <span>Descuento Aplicado (Consumo)</span>
                    <span className="font-mono">- €{quoteBreakdown.discount.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-end pt-6 border-t border-mat-700">
                    <div className="space-y-1">
                       <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block">Total Estimado</span>
                       <span className="text-sm font-black text-white uppercase tracking-[0.2em]">INCLUYE {quoteBreakdown.totalDrinks} BEBIDAS</span>
                    </div>
                    <div className="text-right">
                       <span className="text-5xl md:text-6xl font-black text-mat-500 font-exo tracking-tighter">€{quoteBreakdown.finalTotal.toFixed(0)}</span>
                    </div>
                  </div>
               </div>
            </div>

            {/* Formulario */}
            <div className="bg-mat-950 p-10 md:p-12 rounded-[3.5rem] border-2 border-mat-500 shadow-2xl relative">
               {isSubmitted ? (
                 <div className="py-20 text-center animate-fade-in">
                    <div className="w-24 h-24 bg-mat-900 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-mat-500">
                       <CheckCircle className="w-12 h-12 text-mat-500" />
                    </div>
                    <h3 className="text-3xl font-black text-white uppercase mb-4 font-exo tracking-tighter">SEÑAL RECIBIDA.</h3>
                    <p className="text-gray-500 italic mb-10 leading-relaxed max-w-xs mx-auto">Nuestro equipo de eventos revisará la disponibilidad para el <strong>{formData.date}</strong> a las <strong>{formData.time}</strong> y te contactará en menos de 24h.</p>
                    <button onClick={() => setIsSubmitted(false)} className="px-10 py-4 border-2 border-mat-800 text-gray-600 hover:text-white hover:border-mat-500 font-black uppercase text-[10px] tracking-widest rounded-xl transition-all">Nueva Simulación</button>
                 </div>
               ) : (
                 <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-center gap-4 mb-8">
                       <div className="w-12 h-12 bg-mat-900 border border-mat-800 rounded-xl flex items-center justify-center text-mat-500">
                          <Settings size={20} className="animate-spin-slow" />
                       </div>
                       <div>
                          <h4 className="text-xl font-black text-white uppercase tracking-tighter font-exo leading-none">Datos de la Reserva</h4>
                          <p className="text-[9px] font-black text-gray-700 uppercase tracking-widest mt-1">Sincronización con el CRM de Mat32</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <label className="text-[8px] font-black text-mat-500 uppercase tracking-[0.3em] ml-2">Fecha del Evento</label>
                          <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-mat-900 border border-mat-800 p-4 text-white uppercase text-[10px] font-black rounded-2xl focus:border-mat-500 outline-none transition-all" />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[8px] font-black text-mat-500 uppercase tracking-[0.3em] ml-2">Horario Inicio</label>
                          <input required type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full bg-mat-900 border border-mat-800 p-4 text-white uppercase text-[10px] font-black rounded-2xl focus:border-mat-500 outline-none transition-all" />
                       </div>
                    </div>

                    <div className="space-y-1">
                       <label className="text-[8px] font-black text-mat-500 uppercase tracking-[0.3em] ml-2">Nombre / Colectivo</label>
                       <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-mat-900 border border-mat-800 p-5 text-white uppercase text-[10px] font-black rounded-2xl focus:border-mat-500 outline-none transition-all" placeholder="TU NOMBRE" />
                    </div>

                    <div className="space-y-1">
                       <label className="text-[8px] font-black text-mat-500 uppercase tracking-[0.3em] ml-2">Email de Contacto</label>
                       <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-mat-900 border border-mat-800 p-5 text-white uppercase text-[10px] font-black rounded-2xl focus:border-mat-500 outline-none transition-all" placeholder="EMAIL@EXAMPLE.COM" />
                    </div>

                    <div className="space-y-1">
                       <label className="text-[8px] font-black text-mat-500 uppercase tracking-[0.3em] ml-2">Teléfono</label>
                       <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-mat-900 border border-mat-800 p-5 text-white uppercase text-[10px] font-black rounded-2xl focus:border-mat-500 outline-none transition-all" placeholder="TELÉFONO" />
                    </div>

                    <button type="submit" disabled={isProcessing} className="w-full py-8 bg-mat-500 text-white font-black uppercase text-[11px] tracking-[0.4em] rounded-[2rem] shadow-2xl hover:bg-mat-400 transition-all flex items-center justify-center gap-4 mt-8 clip-path-slant group">
                       {isProcessing ? <Loader2 className="animate-spin" /> : <Send className="group-hover:translate-x-2 transition-transform" size={18} />} SOLICITAR DISPONIBILIDAD
                    </button>
                 </form>
               )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer Location Info */}
      <section className="py-20 bg-mat-950 border-t border-mat-800">
        <div className="container mx-auto px-6 text-center">
           <div className="flex justify-center gap-12 flex-wrap text-gray-500">
              <div className="flex items-center gap-3">
                 <MapPin size={18} className="text-mat-500" />
                 <span className="text-[10px] font-black uppercase tracking-widest">CALLE MATÍAS PERELLÓ 32, RUZAFA</span>
              </div>
              <div className="flex items-center gap-3">
                 <Award size={18} className="text-mat-500" />
                 <span className="text-[10px] font-black uppercase tracking-widest">SISTEMA HI-FI ALTEC / KLIPSCH</span>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

// Componente simple para el icono Send que faltaba
const Send = ({ className, size }: { className?: string, size?: number }) => (
  <svg className={className} width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);
