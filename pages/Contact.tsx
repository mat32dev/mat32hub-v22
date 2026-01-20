
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Calendar, Users, CheckCircle, AlertTriangle, Loader2, Send, MessageSquare, ExternalLink, AlertCircle, Instagram, Music, Info } from 'lucide-react';
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
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        element.classList.add('ring-2', 'ring-mat-500', 'ring-offset-8', 'ring-offset-mat-900');
        setTimeout(() => {
           element.classList.remove('ring-2', 'ring-mat-500', 'ring-offset-8', 'ring-offset-mat-900');
        }, 3000);
      }
    }
  }, [location]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (bookingForm.name.trim().length < 2) {
      newErrors.name = t('es' === 'es' ? "Nombre demasiado corto" : "Name too short");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingForm.email)) {
      newErrors.email = t('es' === 'es' ? "Formato de email inválido" : "Invalid email format");
    }
    const selectedDate = new Date(bookingForm.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      newErrors.date = t('es' === 'es' ? "La fecha no puede ser en el pasado" : "Date cannot be in the past");
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
        const newErrs = { ...prev };
        delete newErrs[name];
        return newErrs;
      });
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      setBookingStatus('error');
      return;
    }
    setBookingStatus('submitting');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      await dataService.createBooking(bookingForm);
      setBookingStatus('success');
      window.scrollTo({ top: 400, behavior: 'smooth' });
    } catch (err) {
      setBookingStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-mat-900 flex flex-col font-sans selection:bg-mat-500 selection:text-white">
      <SEO titleKey="nav.contact" descriptionKey="seo.contact.description" />
      
      {/* Hero Visual - FOTO REAL */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="hero-contact.jpg" 
            alt="Interior Mat32 Valencia" 
            className="w-full h-full object-cover opacity-40 grayscale-[40%]" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=2000";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-mat-900/90 via-mat-900/50 to-mat-900"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-mat-900 border border-mat-500 text-mat-500 text-[10px] font-black uppercase tracking-[0.5em] rounded-full mb-8 animate-fade-in shadow-2xl">
            <MessageSquare className="w-4 h-4" /> HUB CONNECTION
          </div>
          <h1 className="text-6xl md:text-[9rem] font-black uppercase tracking-tighter text-white font-exo leading-none text-glow mb-6 animate-fade-in">
            {t('nav.contact').toUpperCase()} <span className="text-mat-500">INFO.</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-xl md:text-2xl font-light italic leading-relaxed animate-fade-in">
            {t('contact.desc')}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12 md:py-24 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-16 md:gap-24 items-start">
          
          <div className="lg:col-span-5 space-y-12 animate-fade-in">
             <div className="space-y-12">
                <div className="flex items-start gap-6 group">
                   <div className="p-5 bg-mat-800 border-2 border-mat-700 text-mat-500 rounded-3xl group-hover:bg-mat-500 group-hover:text-white transition-all shadow-xl">
                      <MapPin size={24} />
                   </div>
                   <div>
                      <h4 className="text-[10px] font-black text-mat-500 uppercase tracking-[0.4em] mb-2">{t('contact.visit').toUpperCase()}</h4>
                      <p className="text-white text-lg font-exo font-black uppercase leading-tight">Calle Matías Perelló, 32<br/>46005 Valencia, Spain</p>
                   </div>
                </div>

                <div className="flex items-start gap-6 group">
                   <div className="p-5 bg-mat-800 border-2 border-mat-700 text-mat-500 rounded-3xl group-hover:bg-mat-500 group-hover:text-white transition-all shadow-xl">
                      <Clock size={24} />
                   </div>
                   <div>
                      <h4 className="text-[10px] font-black text-mat-500 uppercase tracking-[0.4em] mb-4">{t('contact.hours').toUpperCase()}</h4>
                      <div className="space-y-2 text-white font-black uppercase text-xs tracking-widest">
                         <div className="flex justify-between gap-8"><span className="text-gray-500">Jueves - Sábado</span> <span>18:00 - 02:00</span></div>
                         <div className="flex justify-between gap-8"><span className="text-gray-500">Domingo - Miércoles</span> <span className="text-mat-500">CERRADO</span></div>
                      </div>
                   </div>
                </div>

                <div className="flex items-start gap-6 group">
                   <div className="p-5 bg-mat-800 border-2 border-mat-700 text-mat-500 rounded-3xl group-hover:bg-mat-500 group-hover:text-white transition-all shadow-xl">
                      <Phone size={24} />
                   </div>
                   <div>
                      <h4 className="text-[10px] font-black text-mat-500 uppercase tracking-[0.4em] mb-2">TELEPHONE</h4>
                      <p className="text-white text-lg font-exo font-black uppercase leading-tight">+34 960 000 032</p>
                   </div>
                </div>
             </div>

             <div className="pt-12 border-t border-mat-800">
                <h4 className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em] mb-8">FOLLOW THE SIGNAL</h4>
                <div className="flex gap-6">
                   <a href="https://instagram.com/mat32_vlc" target="_blank" className="p-6 bg-mat-800 border border-mat-700 text-gray-500 hover:text-mat-500 rounded-3xl transition-all shadow-xl"><Instagram size={28} /></a>
                   <a href="#" className="p-6 bg-mat-800 border border-mat-700 text-gray-500 hover:text-mat-500 rounded-3xl transition-all shadow-xl"><Music size={28} /></a>
                   <a href="mailto:groove@mat32.com" className="p-6 bg-mat-800 border border-mat-700 text-gray-500 hover:text-mat-500 rounded-3xl transition-all shadow-xl"><Mail size={28} /></a>
                </div>
             </div>
          </div>

          <div id="booking-section" className="lg:col-span-7 lg:sticky lg:top-32 transition-all duration-1000">
             <div className={`bg-mat-800 border-2 p-8 md:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden transition-all ${Object.keys(errors).length > 0 ? 'border-red-500/50' : 'border-mat-700'}`}>
                <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
                
                {bookingStatus === 'success' ? (
                  <div className="py-20 text-center animate-fade-in">
                    <CheckCircle className="w-16 h-16 text-mat-500 mx-auto mb-8 shadow-xl" />
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 font-exo">{t('contact.booking.success')}</h2>
                    <p className="text-gray-500 italic mb-10 leading-relaxed max-w-xs mx-auto">{t('contact.booking.success_msg')}</p>
                    <button onClick={() => setBookingStatus('idle')} className="px-12 py-5 border-2 border-mat-700 text-gray-500 hover:text-white font-black uppercase text-[10px] tracking-widest rounded-2xl transition-all">Nueva Reserva</button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-4 mb-12">
                       <div className="w-14 h-14 bg-mat-900 border border-mat-700 rounded-2xl flex items-center justify-center text-mat-500 shadow-xl"><Calendar size={24} /></div>
                       <div>
                          <h2 className="text-3xl font-black text-white uppercase tracking-tighter font-exo leading-none">Reservar </h2>
                          <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mt-1">Obligatoria para control de aforo y acceso prioritario</p>
                       </div>
                    </div>

                    <form onSubmit={handleBookingSubmit} className="space-y-6">
                       <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.name ? 'text-red-500' : 'text-mat-500'}`}>{t('contact.form.name')}</label>
                             <input 
                                required 
                                name="name" 
                                value={bookingForm.name} 
                                onChange={handleBookingChange} 
                                className={`w-full bg-mat-900 border p-5 text-white uppercase text-[10px] font-black rounded-2xl focus:border-mat-500 outline-none transition-all shadow-inner ${errors.name ? 'border-red-500' : 'border-mat-700'}`} 
                                placeholder="TU NOMBRE" 
                             />
                             {errors.name && <p className="text-[9px] text-red-500 font-black uppercase mt-1 ml-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.name}</p>}
                          </div>
                          <div className="space-y-2">
                             <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.email ? 'text-red-500' : 'text-mat-500'}`}>{t('contact.form.email')}</label>
                             <input 
                                required 
                                type="email" 
                                name="email" 
                                value={bookingForm.email} 
                                onChange={handleBookingChange} 
                                className={`w-full bg-mat-900 border p-5 text-white font-black text-[10px] rounded-2xl focus:border-mat-500 outline-none transition-all shadow-inner ${errors.email ? 'border-red-500' : 'border-mat-700'}`} 
                                placeholder="EMAIL@EXAMPLE.COM" 
                             />
                             {errors.email && <p className="text-[9px] text-red-500 font-black uppercase mt-1 ml-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.email}</p>}
                          </div>
                       </div>
                       
                       <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                          <div className="space-y-2">
                             <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.date ? 'text-red-500' : 'text-mat-500'}`}>Fecha</label>
                             <input 
                                required 
                                type="date" 
                                name="date" 
                                value={bookingForm.date} 
                                onChange={handleBookingChange} 
                                className={`w-full bg-mat-900 border p-5 text-white uppercase text-[10px] font-black rounded-2xl ${errors.date ? 'border-red-500' : 'border-mat-700'}`} 
                             />
                             {errors.date && <p className="text-[9px] text-red-500 font-black uppercase mt-1 ml-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.date}</p>}
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Hora de llegada</label>
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
                          {bookingStatus === 'submitting' ? <Loader2 className="animate-spin" /> : <Send className="group-hover:translate-x-2 transition-transform" />} CONFIRMAR RESERVA
                       </button>
                    </form>
                  </>
                )}
             </div>
             <div className="mt-8 flex items-center justify-center gap-4 opacity-50 px-6">
                <Info size={14} className="text-mat-500 flex-shrink-0" />
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-center leading-relaxed">Incluso para eventos de entrada libre, la reserva garantiza acceso en caso de aforo completo. Reservas despues de las 22h requerirán consumición / entrada previa</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
