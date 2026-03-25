
import React, { useState } from 'react';
import { Loader2, Send, CheckCircle2, Info, Camera } from 'lucide-react';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { CachedImage } from '../components/CachedImage';
import { useLanguage } from '../context/LanguageContext';

// GALERÍA TÉCNICA V3 DEFINITIVA - LAS 7 FOTOS DEL LOCAL
const SPACE_GALLERY = [
  {
    url: "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/ac1a7472-de26-46de-37f3-7ec5509f5900/public",
    title: "Sala Principal",
    tag: "#EspacioCompleto"
  },
  {
    url: "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/7af028d2-be2a-44ae-a2bd-d2e05db8ac00/w=800",
    title: "Rincón Analógico",
    tag: "#Ambiente"
  },
  {
    url: "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/53d83bbb-47b5-45ce-4f69-00fdc063fd00/w=800",
    title: "Archivo de Vinilos",
    tag: "#TheCrate"
  },
  {
    url: "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/f66760c8-cc6c-457a-dc23-5edbe31a2200/w=800",
    title: "Bola de Espejos",
    tag: "#Atmósfera"
  },
  {
    url: "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/cd431032-310e-4ccc-c602-68787da5ae00/w=800",
    title: "Zona Lounge",
    tag: "#LivingRoom"
  },
  {
    url: "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/36b8814e-df61-468c-614a-788a5fbfa700/w=800",
    title: "Sala de Escucha",
    tag: "#ListeningRoom"
  },
  {
    url: "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/496db3dc-f7c7-4d22-d05a-ac0198681c00/w=800",
    title: "Cabina DJ",
    tag: "#Booth"
  }
];

export const PrivateEvents: React.FC = () => {
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    date: new Date().toISOString().split('T')[0],
    time: '18:00',
    eventType: 'cultural_event',
    concept: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.concept) {
      alert(t('private.alert.required'));
      return;
    }
    setIsProcessing(true);
    await dataService.createInboxMessage({
      type: 'lead',
      sender: formData.name,
      email: formData.email,
      content: `[ALQUILER ESPACIO]: ${formData.eventType.toUpperCase()}. Concepto: ${formData.concept}`,
      metadata: formData
    });
    setIsProcessing(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-mat-900 font-sans text-mat-cream pb-32">
      <SEO titleKey="seo.private.title" descriptionKey="seo.private.description" />
      
      <section className="relative min-h-[60vh] flex items-center justify-center pt-20 overflow-hidden">
         <div className="absolute inset-0 z-0">
           <CachedImage src={SPACE_GALLERY[0].url} alt="Hero Alquiler" priority className="w-full h-full object-cover opacity-80" />
           <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-mat-900/80"></div>
         </div>
         <div className="container mx-auto px-6 text-center relative z-10">
            <h1 className="text-[12vw] sm:text-[10vw] md:text-[8rem] font-black uppercase tracking-tighter text-white font-exo mb-6 leading-[0.8] animate-fade-in">ALQUILER <span className="text-mat-500">LOCAL.</span></h1>
            <p className="text-gray-300 max-w-2xl mx-auto text-base sm:text-lg md:text-2xl font-light px-4 mb-10">{t('private.hero.subtitle')}</p>
            <a href="#booking-form" className="inline-flex items-center gap-3 px-12 py-5 bg-mat-500 text-white font-black uppercase text-[11px] tracking-[0.4em] rounded-2xl hover:bg-mat-400 transition-all shadow-2xl active:scale-95">
              {t('private.hero.cta')}
            </a>
         </div>
      </section>

      {/* GALERÍA O ESPACIO V3 */}
      <section className="py-24 bg-mat-950/30">
        <div className="container mx-auto px-6">
           <div className="flex items-center gap-6 mb-16">
              <Camera size={32} className="text-mat-500" />
              <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter font-exo leading-none">{t('private.gallery.title')} <span className="text-mat-500">.</span></h2>
              <div className="flex-1 border-b-2 border-mat-800 opacity-20"></div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {SPACE_GALLERY.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`relative group rounded-[3rem] overflow-hidden border-2 border-mat-800 transition-all duration-700 hover:border-mat-500 shadow-2xl ${
                    idx === 0 ? 'md:col-span-2 lg:col-span-2' : ''
                  } ${idx === 4 ? 'md:col-span-2 lg:col-span-1' : ''}`}
                >
                   <CachedImage 
                    src={img.url} 
                    alt={img.title} 
                    className="w-full h-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                    aspectRatio={idx === 0 ? "aspect-video" : "aspect-square"}
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-mat-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10">
                      <span className="text-mat-500 text-[9px] font-black uppercase tracking-[0.4em] mb-2">{img.tag}</span>
                      <h4 className="text-white text-2xl font-black uppercase tracking-tighter font-exo leading-none">{img.title}</h4>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      <section id="booking-form" className="container mx-auto px-6 max-w-7xl py-20">
         <div className="grid lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5 space-y-12">
               <div className="bg-mat-800 border-2 border-mat-700 p-12 rounded-[4rem] shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
                  <h4 className="text-[10px] font-black text-mat-500 uppercase tracking-widest mb-10">TECH_SPECS</h4>
                  <ul className="space-y-6 text-white text-sm font-bold uppercase tracking-tight">
                     <li className="flex justify-between border-b border-mat-700 pb-4"><span>AFORO_MÁX</span> <span className="text-mat-500">100 PAX</span></li>
                     <li className="flex justify-between border-b border-mat-700 pb-4"><span>SISTEMA_PA</span> <span className="text-mat-500">ALTEC A7</span></li>
                     <li className="flex justify-between border-b border-mat-700 pb-4"><span>CONTROL</span> <span className="text-mat-500">ROTARY ANALOG</span></li>
                     <li className="flex justify-between"><span>UBICACIÓN</span> <span className="text-mat-500">RUZAFA_VLC</span></li>
                  </ul>
               </div>

               <div className="p-8 bg-mat-950 border border-mat-800 rounded-3xl flex items-start gap-4 shadow-xl">
                  <Info className="text-mat-500 mt-1 shrink-0" size={20} />
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                     {t('private.info.text')}
                  </p>
               </div>
            </div>

            <div className="lg:col-span-7">
               {isSubmitted ? (
                 <div className="bg-mat-800 border-2 border-mat-500 p-20 rounded-[4rem] text-center animate-fade-in shadow-2xl">
                    <CheckCircle2 className="w-20 h-20 text-mat-500 mx-auto mb-8 animate-bounce" />
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter font-exo mb-4">{t('private.success.title')}</h2>
                    <p className="text-gray-400 italic mb-10">{t('private.success.desc')}</p>
                    <button onClick={() => setIsSubmitted(false)} className="px-10 py-4 bg-mat-900 text-gray-500 hover:text-white border border-mat-700 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">{t('private.success.reset')}</button>
                 </div>
               ) : (
                 <div className="bg-mat-800 border-2 border-mat-700 p-10 md:p-14 rounded-[4rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
                    <form onSubmit={handleSubmit} className="space-y-8">
                       <div className="text-center mb-10">
                         <h2 className="text-3xl font-black text-white uppercase tracking-tighter font-exo mb-2">{t('private.form.title')}</h2>
                       </div>
                       <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-4">{t('private.form.name')}</label>
                             <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-6 text-white text-xs font-black rounded-2xl outline-none focus:border-mat-500 transition-all" placeholder="P.EJ: MARCA_VLC" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-4">{t('private.form.email')}</label>
                             <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-6 text-white text-xs font-black rounded-2xl outline-none focus:border-mat-500 transition-all" placeholder="HOLA@EMPRESA.COM" />
                          </div>
                       </div>
                       <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-4">{t('private.form.date')}</label>
                             <input
                               required
                               type="date"
                               min={new Date().toISOString().split('T')[0]}
                               value={formData.date}
                               onChange={e => setFormData({...formData, date: e.target.value})}
                               className="w-full bg-mat-900 border border-mat-700 p-6 text-white text-xs font-black rounded-2xl outline-none focus:border-mat-500 transition-all [color-scheme:dark]"
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-4">{t('private.form.time')}</label>
                             <input
                               type="time"
                               value={formData.time}
                               onChange={e => setFormData({...formData, time: e.target.value})}
                               className="w-full bg-mat-900 border border-mat-700 p-6 text-white text-xs font-black rounded-2xl outline-none focus:border-mat-500 transition-all [color-scheme:dark]"
                             />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-4">{t('private.form.concept')}</label>
                          <textarea required value={formData.concept} onChange={e => setFormData({...formData, concept: e.target.value})} className="w-full bg-mat-900 border border-mat-700 p-8 h-48 text-white text-sm italic font-medium rounded-[2.5rem] outline-none focus:border-mat-500 resize-none transition-all" placeholder={t('private.form.concept.placeholder')}></textarea>
                       </div>
                       <button type="submit" className="w-full py-8 bg-mat-500 text-white font-black uppercase text-[11px] tracking-[0.5em] rounded-[2.5rem] shadow-[0_20px_50px_rgba(234,88,12,0.3)] flex items-center justify-center gap-4 hover:bg-mat-400 transition-all active:scale-95">
                          {isProcessing ? <Loader2 className="animate-spin" /> : <Send size={20} />} {t('private.form.submit')}
                       </button>
                    </form>
                 </div>
               )}
            </div>
         </div>
      </section>
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
    </div>
  );
};
