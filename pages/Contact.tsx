import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Calendar, CheckCircle, AlertCircle, Loader2, Send, MessageSquare, Instagram, Info, X } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { dataService } from '../services/dataService';

interface BookingFormData {
  name: string;
  email: string;
  date: string;
  time: string;
  guests: number;
}

type BookingStatus = 'idle' | 'submitting' | 'success' | 'error';

export const Contact: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [bookingForm, setBookingForm] = useState<BookingFormData>({
    name: '',
    email: '',
    date: new Date().toISOString().split('T')[0],
    time: '20:00',
    guests: 2
  });
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (location.hash === '#reserva') {
      const element = document.getElementById('booking-section');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (bookingForm.name.trim().length < 2) {
      newErrors.name = "El nombre es obligatorio.";
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingForm.email)) {
      newErrors.email = "Introduce un email válido.";
    }
    
    const selectedDate = new Date(bookingForm.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      newErrors.date = "No puedes reservar una fecha pasada.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({
      ...prev,
      [name]: name === 'guests' ? Number(value) : value
    }));
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setBookingStatus('submitting');
    try {
      // Sincronizamos el lead al correo especificado a través del dataService
      await dataService.createInboxMessage({
        type: 'booking',
        sender: bookingForm.name,
        email: bookingForm.email,
        content: `Reserva solicitada: ${bookingForm.guests} PAX para el ${bookingForm.date} a las ${bookingForm.time}. Enviar confirmación a hola@mat32.com.`,
        metadata: bookingForm
      });
      setBookingStatus('success');
    } catch (err) {
      setBookingStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-mat-900 flex flex-col font-sans">
      <SEO 
        titleKey="Contacto y Reservas | Mat32 Ruzafa Valencia" 
        descriptionKey="Reserva tu mesa en el mejor bar Hi-Fi de Valencia. Localización en Ruzafa, horarios y contacto directo para eventos privados." 
      />
      
      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://lrilkrktztlabjpxqbyc.supabase.co/storage/v1/object/public/local-gallery/PORTADA_2_mat32.jpg" alt="Mat32 Valencia Interior" className="w-full h-full object-cover opacity-30 grayscale" />
          <div className="absolute inset-0 bg-gradient-to-b from-mat-900/90 via-mat-900/50 to-mat-900"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center pt-20">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-mat-900 border border-mat-500 text-mat-500 text-[10px] font-black uppercase tracking-[0.5em] rounded-full mb-8 shadow-2xl">
            <MessageSquare className="w-4 h-4" /> HUB CONNECTION
          </div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white font-exo leading-none mb-6 animate-fade-in">
            {t('nav.contact').toUpperCase()} <span className="text-mat-500">VALENCIA.</span>
          </h1>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12 md:py-20 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-16 md:gap-24 items-start">
          
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-12">
             <div className="space-y-12">
                <div className="flex items-start gap-6 group">
                   <div className="p-5 bg-mat-800 border-2 border-mat-700 text-mat-500 rounded-3xl group-hover:bg-mat-500 group-hover:text-white transition-all shadow-xl">
                      <MapPin size={24} />
                   </div>
                   <div>
                      <h4 className="text-[10px] font-black text-mat-500 uppercase tracking-[0.4em] mb-2">UBICACIÓN</h4>
                      <p className="text-white text-lg font-exo font-black uppercase leading-tight">Calle Matías Perelló, 32<br/>46005 Valencia, Ruzafa</p>
                   </div>
                </div>

                <div className="flex items-start gap-6 group">
                   <div className="p-5 bg-mat-800 border-2 border-mat-700 text-mat-500 rounded-3xl group-hover:bg-mat-500 group-hover:text-white transition-all shadow-xl">
                      <Clock size={24} />
                   </div>
                   <div>
                      <h4 className="text-[10px] font-black text-mat-500 uppercase tracking-[0.4em] mb-4">HORARIO PROTOCOLO</h4>
                      <div className="space-y-2 text-white font-black uppercase text-xs tracking-widest">
                         <div className="flex justify-between gap-8"><span className="text-gray-500">Jueves - Sábado</span> <span>18:00 - 02:00</span></div>
                         <div className="flex justify-between gap-8"><span className="text-gray-500">Domingo - Miércoles</span> <span className="text-mat-500">CERRADO</span></div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="pt-12 border-t border-mat-800">
                <h4 className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em] mb-8">REDES Y SOPORTE</h4>
                <div className="flex gap-6">
                   <a href="https://www.instagram.com/mat32__" target="_blank" className="p-6 bg-mat-800 border border-mat-700 text-gray-500 hover:text-mat-500 rounded-3xl transition-all shadow-xl"><Instagram size={28} /></a>
                   <a href="mailto:hola@mat32.com" className="p-6 bg-mat-800 border border-mat-700 text-gray-500 hover:text-mat-500 rounded-3xl transition-all shadow-xl"><Mail size={28} /></a>
                </div>
             </div>
          </div>

          {/* Form Side */}
          <div id="booking-section" className="lg:col-span-7 scroll-mt-24">
             <div className="bg-mat-800 border-2 border-mat-700 p-8 md:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
                
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-14 h-14 bg-mat-900 border border-mat-700 rounded-2xl flex items-center justify-center text-mat-500 shadow-xl"><Calendar size={24} /></div>
                   <div>
                      <h2 className="text-3xl font-black text-white uppercase tracking-tighter font-exo leading-none">RESERVAR MESA</h2>
                      <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mt-1">Directo a hola@mat32.com</p>
                   </div>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-6">
                   <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.name ? 'text-red-500' : 'text-mat-500'}`}>Nombre</label>
                         <input 
                            name="name" 
                            value={bookingForm.name} 
                            onChange={handleBookingChange} 
                            className={`w-full bg-mat-900 border p-5 text-white uppercase text-[10px] font-black rounded-2xl focus:border-mat-500 outline-none transition-all ${errors.name ? 'border-red-500 bg-red-500/5' : 'border-mat-700'}`} 
                            placeholder="TU ALIAS" 
                         />
                         {errors.name && <p className="text-[9px] text-red-500 font-bold uppercase mt-1 ml-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.name}</p>}
                      </div>
                      <div className="space-y-2">
                         <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.email ? 'text-red-500' : 'text-mat-500'}`}>Email</label>
                         <input 
                            name="email" 
                            type="email"
                            value={bookingForm.email} 
                            onChange={handleBookingChange} 
                            className={`w-full bg-mat-900 border p-5 text-white font-black text-[10px] rounded-2xl focus:border-mat-500 outline-none transition-all ${errors.email ? 'border-red-500 bg-red-500/5' : 'border-mat-700'}`} 
                            placeholder="EMAIL@EXAMPLE.COM" 
                         />
                         {errors.email && <p className="text-[9px] text-red-500 font-bold uppercase mt-1 ml-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.email}</p>}
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="space-y-2">
                         <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.date ? 'text-red-500' : 'text-mat-500'}`}>Fecha</label>
                         <input 
                            type="date" 
                            name="date" 
                            value={bookingForm.date} 
                            onChange={handleBookingChange} 
                            className={`w-full bg-mat-900 border p-5 text-white uppercase text-[10px] font-black rounded-2xl focus:border-mat-500 outline-none transition-all ${errors.date ? 'border-red-500 bg-red-500/5' : 'border-mat-700'}`} 
                         />
                         {errors.date && <p className="text-[9px] text-red-500 font-bold uppercase mt-1 ml-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.date}</p>}
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Hora</label>
                         <select name="time" value={bookingForm.time} onChange={handleBookingChange} className="w-full bg-mat-900 border border-mat-700 p-5 text-white uppercase text-[10px] font-black rounded-2xl cursor-pointer">
                            <option>18:00</option><option>19:00</option><option>20:00</option><option>21:00</option><option>22:00</option><option>23:00</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Personas</label>
                         <select name="guests" value={bookingForm.guests} onChange={handleBookingChange} className="w-full bg-mat-900 border border-mat-700 p-5 text-white uppercase text-[10px] font-black rounded-2xl cursor-pointer">
                            {[2,3,4,5,6,8,10].map(n => <option key={n} value={n}>{n} PAX</option>)}
                         </select>
                      </div>
                   </div>

                   <button type="submit" disabled={bookingStatus === 'submitting'} className="w-full py-8 bg-mat-500 hover:bg-mat-400 text-white font-black uppercase tracking-[0.4em] text-[11px] rounded-[2rem] shadow-2xl flex items-center justify-center gap-4 transition-all group mt-6 shadow-mat-500/20">
                      {bookingStatus === 'submitting' ? <Loader2 className="animate-spin" /> : <Send className="group-hover:translate-x-2 transition-transform" />} ENVIAR SOLICITUD_HUB
                   </button>
                </form>
             </div>
             <div className="mt-8 flex items-center justify-center gap-4 opacity-50 px-6">
                <Info size={14} className="text-mat-500 flex-shrink-0" />
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-center leading-relaxed">Reserva gestionada por hola@mat32.com. Recibirás confirmación técnica oficial.</p>
             </div>
          </div>
        </div>
      </div>

      {/* Pop-up de Éxito Persistente */}
      {bookingStatus === 'success' && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-fade-in">
           <div className="w-full max-w-md bg-mat-900 border-2 border-emerald-500 p-12 rounded-[4rem] text-center shadow-[0_0_100px_rgba(16,185,129,0.2)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
              <button onClick={() => setBookingStatus('idle')} className="absolute top-8 right-8 text-gray-500 hover:text-white"><X size={24} /></button>
              <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-8 animate-bounce" />
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 font-exo">SUBMISSION_DONE</h2>
              <p className="text-gray-400 italic mb-10 leading-relaxed text-sm">
                Hemos recibido tu solicitud para el <strong>{bookingForm.date}</strong>.<br/>
                Nuestro equipo revisará el aforo y te responderá desde <strong>hola@mat32.com</strong>.
              </p>
              <button 
                onClick={() => setBookingStatus('idle')} 
                className="w-full py-5 bg-emerald-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl hover:bg-emerald-400 transition-all clip-path-slant"
              >
                ENTENDIDO
              </button>
           </div>
        </div>
      )}
    </div>
  );
};