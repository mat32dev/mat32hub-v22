import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Mail, MapPin, Clock, Calendar, CheckCircle, AlertCircle, Loader2, Send, MessageSquare, Instagram, Info, X } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { dataService } from '../services/dataService';

export const Contact: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    date: new Date().toISOString().split('T')[0],
    time: '20:00',
    guests: 2
  });
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.email) {
      alert("Por favor completa los campos.");
      return;
    }
    setBookingStatus('submitting');
    try {
      await dataService.createInboxMessage({
        type: 'booking',
        sender: bookingForm.name,
        email: bookingForm.email,
        content: `Reserva para ${bookingForm.guests} PAX el ${bookingForm.date} a las ${bookingForm.time}.`,
        metadata: bookingForm
      });
      setBookingStatus('success');
    } catch (err) {
      setBookingStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-mat-900 flex flex-col font-sans">
      <SEO titleKey="Contacto y Reservas | Mat32 Ruzafa Valencia" descriptionKey="Reserva en el mejor bar Hi-Fi de Valencia." />
      
      <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://lrilkrktztlabjpxqbyc.supabase.co/storage/v1/object/public/local-gallery/PORTADA_2_mat32.jpg" alt="Mat32" className="w-full h-full object-cover opacity-30 grayscale" />
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
          <div className="lg:col-span-5 space-y-12 text-gray-400">
             <div className="space-y-6">
                <div className="p-8 bg-mat-800 border-2 border-mat-700 rounded-[2.5rem] shadow-xl">
                   <h4 className="text-[10px] font-black text-mat-500 uppercase tracking-widest mb-4">UBICACIÓN</h4>
                   <p className="text-white text-xl font-exo font-black uppercase">Calle Matías Perelló, 32<br/>46005 Valencia, Ruzafa</p>
                </div>
                <div className="p-8 bg-mat-800 border-2 border-mat-700 rounded-[2.5rem] shadow-xl">
                   <h4 className="text-[10px] font-black text-mat-500 uppercase tracking-widest mb-4">HORARIO</h4>
                   <p className="text-white text-sm font-black uppercase tracking-widest">Jueves - Sábado<br/>18:00 - 02:00</p>
                </div>
             </div>
          </div>

          <div className="lg:col-span-7">
             <div className="bg-mat-800 border-2 border-mat-700 p-8 md:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter font-exo mb-10">RESERVAR MESA</h2>

                <form onSubmit={handleBookingSubmit} className="space-y-6">
                   <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Nombre</label>
                        <input required value={bookingForm.name} onChange={e => setBookingForm({...bookingForm, name: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-5 text-white uppercase text-[10px] font-black rounded-2xl outline-none focus:border-mat-500 transition-all" placeholder="TU ALIAS" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Email</label>
                        <input required type="email" value={bookingForm.email} onChange={e => setBookingForm({...bookingForm, email: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-5 text-white font-black text-[10px] rounded-2xl outline-none focus:border-mat-500 transition-all" placeholder="EMAIL@HUB.COM" />
                      </div>
                   </div>

                   <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Fecha</label>
                        <input type="date" value={bookingForm.date} onChange={e => setBookingForm({...bookingForm, date: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-5 text-white text-[10px] font-black rounded-2xl outline-none focus:border-mat-500" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Hora</label>
                        <select value={bookingForm.time} onChange={e => setBookingForm({...bookingForm, time: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-5 text-white text-[10px] font-black rounded-2xl cursor-pointer">
                           <option>19:00</option><option>20:00</option><option>21:00</option><option>22:00</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">PAX</label>
                        <select value={bookingForm.guests} onChange={e => setBookingForm({...bookingForm, guests: Number(e.target.value)})} className="w-full bg-mat-900 border border-mat-700 p-5 text-white text-[10px] font-black rounded-2xl cursor-pointer">
                           {[2,3,4,5,6,8,10].map(n => <option key={n} value={n}>{n} PAX</option>)}
                        </select>
                      </div>
                   </div>
                   
                   <button type="submit" disabled={bookingStatus === 'submitting'} className="w-full py-8 bg-mat-500 hover:bg-mat-400 text-white font-black uppercase tracking-[0.4em] text-[11px] rounded-[2rem] shadow-2xl flex items-center justify-center gap-4 transition-all">
                      {bookingStatus === 'submitting' ? <Loader2 className="animate-spin" /> : <Send />} ENVIAR RESERVA
                   </button>
                </form>
             </div>
          </div>
        </div>
      </div>

      {bookingStatus === 'success' && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-fade-in">
           <div className="w-full max-w-md bg-mat-900 border-2 border-emerald-500 p-12 rounded-[4rem] text-center shadow-2xl relative">
              <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-8 animate-bounce" />
              <h2 className="text-4xl font-black text-white uppercase mb-4 font-exo">SUBMISSION_DONE</h2>
              <p className="text-gray-400 italic mb-10 leading-relaxed text-sm">
                Tu solicitud ha sido inyectada. Te responderemos desde <strong>hola@mat32.com</strong>.
              </p>
              <button onClick={() => setBookingStatus('idle')} className="w-full py-5 bg-emerald-500 text-white font-black uppercase tracking-widest rounded-2xl">ENTENDIDO</button>
           </div>
        </div>
      )}
    </div>
  );
};