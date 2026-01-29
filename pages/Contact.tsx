import React, { useState } from 'react';
import { Mail, MapPin, Clock, Calendar, CheckCircle, Loader2, Send, MessageSquare, Info, AlertCircle } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { dataService } from '../services/dataService';

interface FormErrors {
  name?: string;
  email?: string;
  date?: string;
  content?: string;
}

export const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: new Date().toISOString().split('T')[0],
    content: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!formData.name.trim()) newErrors.name = "El nombre o alias es obligatorio.";
    if (!emailRegex.test(formData.email)) newErrors.email = "Introduce un email válido.";
    if (selectedDate < today) newErrors.date = "No puedes emitir señales hacia el pasado.";
    if (formData.content.length < 10) newErrors.content = "La descripción debe tener al menos 10 caracteres.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');
    try {
      await dataService.createInboxMessage({
        type: 'general',
        sender: formData.name,
        email: formData.email,
        content: formData.content,
        date: new Date().toISOString(),
        metadata: { eventDate: formData.date }
      });
      setStatus('success');
      setFormData({
        name: '',
        email: '',
        date: new Date().toISOString().split('T')[0],
        content: ''
      });
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-mat-900 flex flex-col font-sans">
      <SEO titleKey="Contacto & Propuestas | Mat32 Ruzafa Valencia" descriptionKey="Contacta con el Hub analógico de Valencia. Propuestas culturales, eventos y consultas generales." />
      
      <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://lrilkrktztlabjpxqbyc.supabase.co/storage/v1/object/public/local-gallery/PORTADA_2_mat32.jpg" alt="Mat32" className="w-full h-full object-cover opacity-30 grayscale" />
          <div className="absolute inset-0 bg-gradient-to-b from-mat-900/90 via-mat-900/50 to-mat-900"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center pt-20">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-mat-900 border border-mat-500 text-mat-500 text-[10px] font-black uppercase tracking-[0.5em] rounded-full mb-8 shadow-2xl">
            <MessageSquare className="w-4 h-4" /> HUB_COMMUNICATION
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
                <div className="p-8 bg-mat-800 border-2 border-mat-700 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><MapPin size={80} /></div>
                   <h4 className="text-[10px] font-black text-mat-500 uppercase tracking-widest mb-4">UBICACIÓN</h4>
                   <p className="text-white text-xl font-exo font-black uppercase tracking-tighter">Calle Matías Perelló, 32<br/>46005 Valencia, Ruzafa</p>
                </div>
                <div className="p-8 bg-mat-800 border-2 border-mat-700 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Mail size={80} /></div>
                   <h4 className="text-[10px] font-black text-mat-500 uppercase tracking-widest mb-4">EMAIL DIRECTO</h4>
                   <p className="text-white text-xl font-exo font-black lowercase tracking-tighter">hola@mat32.com</p>
                </div>
                <div className="p-6 bg-mat-950/50 border border-mat-700 rounded-2xl flex items-start gap-4">
                   <Info className="text-mat-500 flex-shrink-0" size={18} />
                   <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                      El equipo de Mat32 revisa todas las propuestas semanalmente. La respuesta llegará a través de nuestra red oficial.
                   </p>
                </div>
             </div>
          </div>

          <div className="lg:col-span-7" style={{ wordBreak: 'break-word' }}>
             <div className="bg-mat-800 border-2 border-mat-700 p-8 md:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter font-exo mb-10">ENVIAR SEÑAL</h2>

                <form onSubmit={handleSubmit} className="space-y-8">
                   <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Alias / Nombre</label>
                        <input 
                          value={formData.name} 
                          onChange={e => {setFormData({...formData, name: e.target.value}); if(errors.name) setErrors({...errors, name: undefined});}} 
                          className={`w-full bg-mat-900 border ${errors.name ? 'border-mat-500' : 'border-mat-700'} p-5 text-white uppercase text-[10px] font-black rounded-2xl outline-none focus:border-mat-500 transition-all`} 
                          placeholder="TU ALIAS" 
                        />
                        {errors.name && <p className="text-[9px] text-mat-500 font-bold uppercase mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.name}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Email</label>
                        <input 
                          type="email" 
                          value={formData.email} 
                          onChange={e => {setFormData({...formData, email: e.target.value}); if(errors.email) setErrors({...errors, email: undefined});}} 
                          className={`w-full bg-mat-900 border ${errors.email ? 'border-mat-500' : 'border-mat-700'} p-5 text-white font-black text-[10px] rounded-2xl outline-none focus:border-mat-500 transition-all`} 
                          placeholder="EMAIL@HUB.COM" 
                        />
                        {errors.email && <p className="text-[9px] text-mat-500 font-bold uppercase mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.email}</p>}
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Fecha de Interés (Opcional)</label>
                      <input 
                        type="date" 
                        value={formData.date} 
                        onChange={e => {setFormData({...formData, date: e.target.value}); if(errors.date) setErrors({...errors, date: undefined});}} 
                        className={`w-full bg-mat-900 border ${errors.date ? 'border-mat-500' : 'border-mat-700'} p-5 text-white text-[10px] font-black rounded-2xl outline-none focus:border-mat-500`} 
                      />
                      {errors.date && <p className="text-[9px] text-mat-500 font-bold uppercase mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.date}</p>}
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Descripción / Propuesta</label>
                      <textarea 
                        value={formData.content} 
                        onChange={e => {setFormData({...formData, content: e.target.value}); if(errors.content) setErrors({...errors, content: undefined});}} 
                        className={`w-full bg-mat-900 border ${errors.content ? 'border-mat-500' : 'border-mat-700'} p-6 h-40 text-white text-xs italic font-bold rounded-2xl outline-none focus:border-mat-500 resize-none transition-all`} 
                        placeholder="Describe tu consulta o propuesta cultural..."
                      />
                      {errors.content && <p className="text-[9px] text-mat-500 font-bold uppercase mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.content}</p>}
                   </div>
                   
                   <button 
                    type="submit" 
                    disabled={status === 'submitting'} 
                    className="w-full py-8 bg-mat-500 hover:bg-mat-400 text-white font-black uppercase tracking-[0.4em] text-[11px] rounded-[2rem] shadow-2xl flex items-center justify-center gap-4 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                   >
                      {status === 'submitting' ? <Loader2 className="animate-spin" /> : <Send />} EMITIR SEÑAL_HUB
                   </button>
                </form>
             </div>
          </div>
        </div>
      </div>

      {status === 'success' && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-fade-in">
           <div className="w-full max-w-md bg-mat-900 border-2 border-emerald-500 p-12 rounded-[4rem] text-center shadow-2xl relative">
              <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-8 animate-bounce" />
              <h2 className="text-4xl font-black text-white uppercase mb-4 font-exo tracking-tighter">SIGNAL_SENT</h2>
              <p className="text-gray-400 italic mb-10 leading-relaxed text-sm">
                Tu comunicación ha sido inyectada con éxito en la matriz de Mat32. Revisamos el buzón a las 18:00 cada día.
              </p>
              <button onClick={() => setStatus('idle')} className="w-full py-5 bg-emerald-500 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-400 transition-colors shadow-xl">ENTENDIDO</button>
           </div>
        </div>
      )}
    </div>
  );
};