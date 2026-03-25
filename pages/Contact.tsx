
import React, { useState } from 'react';
import { Mail, MapPin, CheckCircle, Loader2, Send, MessageSquare, Info, AlertCircle } from 'lucide-react';
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

    if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio.";
    if (!emailRegex.test(formData.email)) newErrors.email = "El email no es válido.";
    if (selectedDate < today) newErrors.date = "La fecha no puede ser anterior a hoy.";
    if (formData.content.length < 10) newErrors.content = "El mensaje es demasiado corto (mín. 10 carac.).";

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
      <SEO titleKey="Contacto | Mat32 Valencia" descriptionKey="Contacta con nosotros para eventos, propuestas o consultas generales." />
      
      <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden border-b border-mat-800">
        <div className="absolute inset-0 z-0 bg-mat-950">
          <img src="https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/36b8814e-df61-468c-614a-788a5fbfa700/public" alt="Mat32" className="w-full h-full object-cover opacity-45" />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center pt-20">
          <h1 className="text-[15vw] sm:text-[12vw] md:text-[8rem] font-black uppercase tracking-tighter text-white font-exo leading-[0.8] mb-6">
            CONTACTO.
          </h1>
          <p className="text-gray-400 text-base sm:text-lg md:text-xl font-light px-4">Escríbenos. Respondemos.</p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12 md:py-20 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 bg-mat-800 border border-mat-700 rounded-3xl">
              <h4 className="text-[10px] font-bold text-mat-500 uppercase tracking-widest mb-4">UBICACIÓN</h4>
              <p className="text-white text-xl font-exo font-bold uppercase">Calle Matías Perelló, 32<br/>46005 Valencia, Ruzafa</p>
            </div>
            <div className="p-8 bg-mat-800 border border-mat-700 rounded-3xl">
              <h4 className="text-[10px] font-bold text-mat-500 uppercase tracking-widest mb-4">EMAIL</h4>
              <p className="text-white text-xl font-exo font-bold">hola@mat32.com</p>
            </div>
          </div>

          <div className="lg:col-span-7">
             <div className="bg-mat-800 border border-mat-700 p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-8">
                   <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-mat-500 uppercase tracking-widest ml-1">Nombre</label>
                        <input 
                          value={formData.name} 
                          onChange={e => {setFormData({...formData, name: e.target.value}); if(errors.name) setErrors({...errors, name: undefined});}} 
                          className={`w-full bg-mat-900 border ${errors.name ? 'border-red-500' : 'border-mat-700'} p-4 text-white text-xs font-bold rounded-xl outline-none focus:border-mat-500 transition-all`} 
                          placeholder="Tu nombre" 
                        />
                        {errors.name && <p className="text-[10px] text-red-500 font-bold mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.name}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-mat-500 uppercase tracking-widest ml-1">Email</label>
                        <input 
                          type="email" 
                          value={formData.email} 
                          onChange={e => {setFormData({...formData, email: e.target.value}); if(errors.email) setErrors({...errors, email: undefined});}} 
                          className={`w-full bg-mat-900 border ${errors.email ? 'border-red-500' : 'border-mat-700'} p-4 text-white text-xs font-bold rounded-xl outline-none focus:border-mat-500 transition-all`} 
                          placeholder="tu@email.com" 
                        />
                        {errors.email && <p className="text-[10px] text-red-500 font-bold mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.email}</p>}
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-mat-500 uppercase tracking-widest ml-1">Fecha de Interés</label>
                      <input 
                        type="date" 
                        value={formData.date} 
                        onChange={e => {setFormData({...formData, date: e.target.value}); if(errors.date) setErrors({...errors, date: undefined});}} 
                        className={`w-full bg-mat-900 border ${errors.date ? 'border-red-500' : 'border-mat-700'} p-4 text-white text-xs font-bold rounded-xl outline-none focus:border-mat-500`} 
                      />
                      {errors.date && <p className="text-[10px] text-red-500 font-bold mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.date}</p>}
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-mat-500 uppercase tracking-widest ml-1">Mensaje o Propuesta</label>
                      <textarea 
                        value={formData.content} 
                        onChange={e => {setFormData({...formData, content: e.target.value}); if(errors.content) setErrors({...errors, content: undefined});}} 
                        className={`w-full bg-mat-900 border ${errors.content ? 'border-red-500' : 'border-mat-700'} p-4 h-32 text-white text-xs font-medium rounded-xl outline-none focus:border-mat-500 resize-none transition-all`} 
                        placeholder="Escribe aquí tu consulta..."
                      />
                      {errors.content && <p className="text-[10px] text-red-500 font-bold mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.content}</p>}
                   </div>
                   
                   <button 
                    type="submit" 
                    disabled={status === 'submitting'} 
                    className="w-full py-6 bg-mat-500 hover:bg-mat-400 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl flex items-center justify-center gap-4 transition-all"
                   >
                      {status === 'submitting' ? <Loader2 className="animate-spin" /> : <Send size={18} />} ENVIAR MENSAJE
                   </button>
                </form>
             </div>
          </div>
        </div>
      </div>

      <a
        href="https://wa.me/34622190802"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-16 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#1ebe5d] rounded-full shadow-2xl flex items-center justify-center transition-all active:scale-95"
        aria-label="Contactar por WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {status === 'success' && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-fade-in">
           <div className="w-full max-w-md bg-mat-900 border border-mat-700 p-12 rounded-[2.5rem] text-center shadow-2xl">
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
              <h2 className="text-3xl font-black text-white uppercase mb-4 font-exo">MENSAJE ENVIADO</h2>
              <p className="text-gray-400 italic mb-10 text-sm">
                Hemos recibido tu mensaje. Te responderemos por email lo antes posible.
              </p>
              <button onClick={() => setStatus('idle')} className="w-full py-4 bg-mat-800 text-white font-bold uppercase tracking-widest rounded-xl hover:bg-mat-700">CERRAR</button>
           </div>
        </div>
      )}
    </div>
  );
};
