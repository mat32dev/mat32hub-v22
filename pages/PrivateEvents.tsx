
import React, { useState, useEffect } from 'react';
import { 
  Users, ArrowRight, Loader2, Zap, LayoutGrid, Camera, 
  CheckCircle, ShieldCheck, Heart, ArrowDown, ExternalLink, 
  Info, TrendingDown, Gift
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
      content: `Propuesta de Alquiler [${formData.eventType.toUpperCase()}]: ${formData.guests} pax, ${formData.duration}h.`,
      metadata: { ...formData, ...quoteBreakdown }
    });
    setIsProcessing(false);
    setIsSubmitted(true);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const eventTypes = [
    { id: 'private', title: 'Celebraciones Privadas', desc: 'Aniversarios y fiestas exclusivas en Ruzafa.', icon: <Heart className="text-mat-500" /> },
    { id: 'corporate', title: 'Eventos Corporativos', desc: 'Presentaciones de producto y cenas de empresa.', icon: <ShieldCheck className="text-mat-500" /> },
    { id: 'promoter', title: 'Promotores & Sellos', desc: 'Showcases y eventos con venta de entradas.', icon: <Zap className="text-mat-500" /> },
    { id: 'collaboration', title: 'Pop-ups & Workshops', desc: 'Eventos culturales y gastronómicos compartidos.', icon: <LayoutGrid className="text-mat-500" /> }
  ];

  return (
    <div className="min-h-screen bg-mat-900 font-sans">
      <SEO 
        titleKey="seo.private.title" 
        descriptionKey="seo.private.description" 
      />
      
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
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
          <h1 className="text-5xl md:text-[7rem] font-black uppercase tracking-tighter text-white font-exo leading-none text-glow mb-8 animate-fade-in">
            TU LOCAL PARA <span className="text-mat-500">EVENTOS</span> EN VALENCIA.
          </h1>
          <p className="text-gray-400 max-w-4xl mx-auto text-xl md:text-2xl font-light italic leading-relaxed animate-fade-in mb-14">
            Alquiler de espacio exclusivo en el barrio de Ruzafa. Sonido High Fidelity, coctelería de autor y atmósfera industrial.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 animate-fade-in">
            <button onClick={scrollToSimulator} className="px-12 py-6 bg-mat-500 text-white font-black text-[11px] uppercase tracking-widest clip-path-slant shadow-xl hover:bg-mat-400 transition-all">
              SIMULAR PRESUPUESTO
            </button>
            <a 
              href="https://share.google/RIc7fQd4za96lIb7u" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-12 py-6 bg-mat-800 border border-mat-700 text-white font-black text-[11px] uppercase tracking-widest clip-path-slant hover:border-mat-500 transition-all flex items-center gap-3 justify-center"
            >
              VER GALERÍA COMPLETA <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Grid de Tipos de Evento */}
      <section className="py-24 bg-mat-900 border-y border-mat-800">
        <div className="container mx-auto px-6">
           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {eventTypes.map((type, i) => (
                <div key={i} className="bg-mat-800 border-2 border-mat-700 p-10 rounded-[2.5rem] hover:border-mat-500 transition-all shadow-xl group">
                   <div className="w-16 h-16 bg-mat-900 border border-mat-700 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">{type.icon}</div>
                   <h4 className="text-2xl font-black text-white uppercase mb-4 font-exo">{type.title}</h4>
                   <p className="text-gray-500 text-sm italic leading-relaxed">{type.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Simulador */}
      <section id="simulator" className="py-32 bg-mat-950 scroll-mt-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
             <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter font-exo mb-4">SIMULADOR <span className="text-mat-500">HI-FI.</span></h2>
             <p className="text-gray-500 italic">Transparencia total en el presupuesto de tu alquiler.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-12 bg-mat-900 p-10 rounded-[3rem] border border-mat-800">
               <div className="space-y-6">
                  <div className="flex justify-between text-[10px] font-black uppercase text-mat-500">
                     <span>Invitados</span>
                     <span className="text-white">{formData.guests} PAX</span>
                  </div>
                  <input type="range" min="20" max="100" step="5" value={formData.guests} onChange={e => setFormData({...formData, guests: Number(e.target.value)})} className="w-full accent-mat-500" />
               </div>
               <div className="space-y-6">
                  <div className="flex justify-between text-[10px] font-black uppercase text-mat-500">
                     <span>Duración</span>
                     <span className="text-white">{formData.duration} HORAS</span>
                  </div>
                  <input type="range" min="3" max="8" step="1" value={formData.duration} onChange={e => setFormData({...formData, duration: Number(e.target.value)})} className="w-full accent-mat-500" />
               </div>
               
               <div className="pt-8 border-t border-mat-800 space-y-4">
                  <div className="flex justify-between text-xs text-gray-500 font-bold uppercase">
                    <span>Base Alquiler</span>
                    <span>€{quoteBreakdown.rentalBase.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-green-500 font-bold uppercase">
                    <span>Descuento por Consumo</span>
                    <span>- €{quoteBreakdown.discount.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-end pt-4 border-t border-mat-700">
                    <span className="text-sm font-black text-white uppercase tracking-widest">Total Estimado</span>
                    <span className="text-5xl font-black text-mat-500 font-exo">€{quoteBreakdown.finalTotal.toFixed(0)}</span>
                  </div>
               </div>
            </div>

            <div className="bg-mat-800 p-10 rounded-[3rem] border border-mat-700 shadow-2xl">
               {isSubmitted ? (
                 <div className="py-12 text-center animate-fade-in">
                    <CheckCircle className="w-16 h-16 text-mat-500 mx-auto mb-6" />
                    <h3 className="text-2xl font-black text-white uppercase mb-4">Señal Recibida</h3>
                    <p className="text-gray-400 italic mb-8">Nuestro manager contactará contigo pronto para formalizar la reserva.</p>
                    <button onClick={() => setIsSubmitted(false)} className="text-mat-500 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors">Nueva Solicitud</button>
                 </div>
               ) : (
                 <form onSubmit={handleSubmit} className="space-y-6">
                    <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-5 text-white uppercase text-[10px] font-black rounded-2xl" placeholder="TU NOMBRE / COLECTIVO" />
                    <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-5 text-white uppercase text-[10px] font-black rounded-2xl" placeholder="EMAIL DE CONTACTO" />
                    <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-5 text-white uppercase text-[10px] font-black rounded-2xl" placeholder="TELÉFONO" />
                    <button type="submit" disabled={isProcessing} className="w-full py-6 bg-mat-500 text-white font-black uppercase text-[11px] tracking-widest rounded-2xl shadow-xl hover:bg-mat-400 transition-all flex items-center justify-center gap-3">
                       {isProcessing ? <Loader2 className="animate-spin" /> : <ArrowRight size={18} />} SOLICITAR DISPONIBILIDAD
                    </button>
                 </form>
               )}
            </div>
          </div>
          
          <div className="mt-16 flex items-center justify-center gap-4 opacity-40">
             <Info size={16} className="text-mat-500" />
             <p className="text-[9px] font-black uppercase tracking-widest text-center leading-relaxed">El presupuesto final puede variar según necesidades técnicas adicionales (DJ, catering o iluminación extra).</p>
          </div>
        </div>
      </section>
    </div>
  );
};
