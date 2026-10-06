import React, { useState, useEffect } from 'react';
import { CheckCircle, Loader2, Send, AlertCircle, MapPin, Mail, MessageCircle } from 'lucide-react';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { useLanguage } from '../context/LanguageContext';

interface FormErrors { name?: string; email?: string; date?: string; content?: string; }

export const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '', email: '',
    date: new Date().toISOString().split('T')[0],
    content: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    document.body.classList.add('theme-paper');
    return () => { document.body.classList.remove('theme-paper'); };
  }, []);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const selectedDate = new Date(formData.date);
    const today = new Date(); today.setHours(0,0,0,0);
    if (!formData.name.trim()) newErrors.name = t('contact.error.name');
    if (!emailRegex.test(formData.email)) newErrors.email = t('contact.error.email');
    if (selectedDate < today) newErrors.date = t('contact.error.date');
    if (formData.content.length < 10) newErrors.content = t('contact.error.message');
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
        sender: formData.name, email: formData.email,
        content: formData.content,
        date: new Date().toISOString(),
        metadata: { source: 'contact-general', eventDate: formData.date } as any,
      });
      setStatus('success');
      setFormData({ name: '', email: '', date: new Date().toISOString().split('T')[0], content: '' });
    } catch { setStatus('error'); }
  };

  return (
    <div className="min-h-screen bg-paper text-ink pb-24 grain">
      <SEO titleKey="Contacto · Calle Matías Perelló 32 · Ruzafa, Valencia | MAT32" descriptionKey="MAT32 — Calle Matías Perelló 32, Ruzafa, Valencia. Tel +34 622 19 08 02 · hola@mat32.com. Bar Hi-Fi & DanceHall, almacén de vinilos 2nd hand y eventos privados en colaboración. Respuesta en 24h." />

      {/* HERO */}
      <section className="container mx-auto px-6 md:px-10 pt-12 md:pt-16 pb-10 hairline-b">
        <div className="mono-tag" style={{ color: '#c8462a' }}>CONTACTO · /CONTACT</div>
        <h1 className="display mt-3" style={{ fontSize: 'clamp(54px, 9vw, 132px)', lineHeight: 0.85 }}>
          {t('contact.hero.h1_1')}<br/><span style={{ color: '#c8462a' }}>{t('contact.hero.h1_2')}</span>
        </h1>
        <p className="serif-italic text-2xl text-ink-soft mt-4 max-w-xl">
          {t('contact.hero.desc')}
        </p>
      </section>

      <section className="container mx-auto px-6 md:px-10 py-12 md:py-16 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* INFO COL */}
          <div className="lg:col-span-5 space-y-4">
            <div className="hairline p-6 bg-paper">
              <div className="mono-tag flex items-center gap-2" style={{ color: '#c8462a' }}>
                <MapPin size={12} /> {t('contact.location.tag')}
              </div>
              <h3 className="display mt-2 text-xl md:text-2xl">C/ Matías Perelló 32</h3>
              <p className="serif-italic text-ink-soft mt-1">Ruzafa · Valencia · 46005</p>
              <div className="mt-4 hairline overflow-hidden">
                <iframe
                  title="MAT32 en Google Maps · Calle Matías Perelló 32, Ruzafa, Valencia"
                  src="https://storage.googleapis.com/maps-solutions-2ix7wunb2w/locator-plus/et5g/locator-plus.html"
                  width="100%" height="380" style={{ border: 0 }}
                  loading="lazy" allow="geolocation"
                />
              </div>
              <a href="https://www.google.com/maps/search/?api=1&query=MAT32+Valencia+Mat%C3%ADas+Perell%C3%B3+32"
                 target="_blank" rel="noopener"
                 className="mono-tag !text-[10px] mt-3 inline-flex items-center gap-1 hover:text-bermellon transition-colors"
                 style={{ color: '#c8462a' }}>
                {t('contact.maps.link')}
              </a>
            </div>
            <div className="hairline p-6 bg-paper-2">
              <div className="mono-tag flex items-center gap-2" style={{ color: '#c8462a' }}>
                <Mail size={12} /> EMAIL
              </div>
              <a href="mailto:hola@mat32.com" className="display text-xl md:text-2xl mt-2 block hover:text-bermellon transition-colors">hola@mat32.com</a>
              <p className="serif-italic text-ink-soft mt-1">{t('contact.email.desc')}</p>
            </div>
            <a href="https://wa.me/34622190802" target="_blank" rel="noopener" className="block hairline p-6 bg-bermellon text-paper hover:bg-ink transition-colors">
              <div className="mono-tag flex items-center gap-2 text-paper">
                <MessageCircle size={12} /> WHATSAPP DIRECTO
              </div>
              <h3 className="display mt-2 text-xl md:text-2xl">+34 622 19 08 02</h3>
              <p className="serif-italic text-paper/85 mt-1">{t('contact.whatsapp.desc')}</p>
            </a>
          </div>

          {/* FORM */}
          <div className="lg:col-span-7">
            <div className="hairline p-6 md:p-8 bg-paper-2">
              <div className="mono-tag mb-5" style={{ color: '#c8462a' }}>{t('contact.form.tag')}</div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="mono-tag !text-[9px] block mb-2" style={{ color: '#c8462a' }}>{t('contact.form.name_label')}</label>
                    <input value={formData.name}
                      onChange={e => { setFormData({ ...formData, name: e.target.value }); if (errors.name) setErrors({ ...errors, name: undefined }); }}
                      className={`w-full bg-paper hairline p-3 text-ink mono-tag !text-[11px] !tracking-[0.15em] !normal-case outline-none focus:border-bermellon transition-colors ${errors.name ? 'border-bermellon' : ''}`}
                      placeholder={t('contact.form.name_placeholder')} />
                    {errors.name && <p className="mono-tag !text-[9px] mt-1 flex items-center gap-1" style={{ color: '#c8462a' }}><AlertCircle size={10} /> {errors.name}</p>}
                  </div>
                  <div>
                    <label className="mono-tag !text-[9px] block mb-2" style={{ color: '#c8462a' }}>EMAIL</label>
                    <input type="email" value={formData.email}
                      onChange={e => { setFormData({ ...formData, email: e.target.value }); if (errors.email) setErrors({ ...errors, email: undefined }); }}
                      className={`w-full bg-paper hairline p-3 text-ink mono-tag !text-[11px] !tracking-[0.15em] !normal-case outline-none focus:border-bermellon transition-colors ${errors.email ? 'border-bermellon' : ''}`}
                      placeholder="tu@email.com" />
                    {errors.email && <p className="mono-tag !text-[9px] mt-1 flex items-center gap-1" style={{ color: '#c8462a' }}><AlertCircle size={10} /> {errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="mono-tag !text-[9px] block mb-2" style={{ color: '#c8462a' }}>{t('contact.form.date_label')}</label>
                  <input type="date" value={formData.date}
                    onChange={e => { setFormData({ ...formData, date: e.target.value }); if (errors.date) setErrors({ ...errors, date: undefined }); }}
                    className={`w-full bg-paper hairline p-3 text-ink mono-tag !text-[11px] outline-none focus:border-bermellon transition-colors ${errors.date ? 'border-bermellon' : ''}`} />
                  {errors.date && <p className="mono-tag !text-[9px] mt-1 flex items-center gap-1" style={{ color: '#c8462a' }}><AlertCircle size={10} /> {errors.date}</p>}
                </div>

                <div>
                  <label className="mono-tag !text-[9px] block mb-2" style={{ color: '#c8462a' }}>{t('contact.form.message_label')}</label>
                  <textarea value={formData.content}
                    onChange={e => { setFormData({ ...formData, content: e.target.value }); if (errors.content) setErrors({ ...errors, content: undefined }); }}
                    className={`w-full bg-paper hairline p-4 h-40 text-ink serif-italic text-base outline-none focus:border-bermellon resize-none transition-colors leading-snug ${errors.content ? 'border-bermellon' : ''}`}
                    placeholder={t('contact.form.message_placeholder')} />
                  {errors.content && <p className="mono-tag !text-[9px] mt-1 flex items-center gap-1" style={{ color: '#c8462a' }}><AlertCircle size={10} /> {errors.content}</p>}
                </div>

                <button type="submit" disabled={status === 'submitting'}
                  className="w-full bg-bermellon text-paper py-4 mono-tag !text-[12px] !tracking-[0.5em] hover:bg-ink transition-colors flex items-center justify-center gap-3">
                  {status === 'submitting' ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                  {status === 'submitting' ? t('contact.form.submit_sending') : t('contact.form.submit_idle')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {status === 'success' && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-ink/90 animate-fade-in">
          <div className="w-full max-w-md bg-paper text-ink hairline p-10 text-center">
            <CheckCircle className="w-14 h-14 text-bermellon mx-auto mb-5" />
            <h2 className="display text-3xl">{t('contact.success.h2')}</h2>
            <p className="serif-italic text-ink-soft text-lg mt-3">{t('contact.success.desc')}</p>
            <button onClick={() => setStatus('idle')} className="mt-6 hairline px-6 py-3 mono-tag hover:bg-ink hover:text-paper transition-colors">{t('contact.success.close')}</button>
          </div>
        </div>
      )}
    </div>
  );
};
