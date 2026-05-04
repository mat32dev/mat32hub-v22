import React, { useState, useEffect } from 'react';
import { CheckCircle, Loader2, Send, AlertCircle, MapPin, Mail, MessageCircle } from 'lucide-react';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';

interface FormErrors { name?: string; email?: string; date?: string; content?: string; }

export const Contact: React.FC = () => {
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
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio.';
    if (!emailRegex.test(formData.email)) newErrors.email = 'El email no es válido.';
    if (selectedDate < today) newErrors.date = 'La fecha no puede ser anterior a hoy.';
    if (formData.content.length < 10) newErrors.content = 'Mensaje demasiado corto (mín. 10 carac.).';
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
      <SEO titleKey="Contacto | MAT32 Valencia" descriptionKey="Escríbenos. Respondemos en menos de 24h." />

      {/* HERO */}
      <section className="container mx-auto px-6 md:px-10 pt-12 md:pt-16 pb-10 hairline-b">
        <div className="mono-tag" style={{ color: '#c8462a' }}>CONTACTO · /CONTACT</div>
        <h1 className="display mt-3" style={{ fontSize: 'clamp(54px, 9vw, 132px)', lineHeight: 0.85 }}>
          Escríbenos.<br/><span style={{ color: '#c8462a' }}>Respondemos.</span>
        </h1>
        <p className="serif-italic text-2xl text-ink-soft mt-4 max-w-xl">
          Para propuestas, dudas o lo que necesites contar. Respuesta en 24h.
        </p>
      </section>

      <section className="container mx-auto px-6 md:px-10 py-12 md:py-16 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* INFO COL */}
          <div className="lg:col-span-5 space-y-4">
            <div className="hairline p-6 bg-paper">
              <div className="mono-tag flex items-center gap-2" style={{ color: '#c8462a' }}>
                <MapPin size={12} /> UBICACIÓN
              </div>
              <h3 className="display mt-2 text-xl md:text-2xl">C/ Matías Perelló 32</h3>
              <p className="serif-italic text-ink-soft mt-1">Ruzafa · Valencia · 46005</p>
            </div>
            <div className="hairline p-6 bg-paper-2">
              <div className="mono-tag flex items-center gap-2" style={{ color: '#c8462a' }}>
                <Mail size={12} /> EMAIL
              </div>
              <a href="mailto:hola@mat32.com" className="display text-xl md:text-2xl mt-2 block hover:text-bermellon transition-colors">hola@mat32.com</a>
              <p className="serif-italic text-ink-soft mt-1">Para consultas generales.</p>
            </div>
            <a href="https://wa.me/34622190802" target="_blank" rel="noopener" className="block hairline p-6 bg-bermellon text-paper hover:bg-ink transition-colors">
              <div className="mono-tag flex items-center gap-2 text-paper">
                <MessageCircle size={12} /> WHATSAPP DIRECTO
              </div>
              <h3 className="display mt-2 text-xl md:text-2xl">+34 622 19 08 02</h3>
              <p className="serif-italic text-paper/85 mt-1">Más rápido. Lunes a sábado.</p>
            </a>
          </div>

          {/* FORM */}
          <div className="lg:col-span-7">
            <div className="hairline p-6 md:p-8 bg-paper-2">
              <div className="mono-tag mb-5" style={{ color: '#c8462a' }}>FORMULARIO</div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="mono-tag !text-[9px] block mb-2" style={{ color: '#c8462a' }}>NOMBRE</label>
                    <input value={formData.name}
                      onChange={e => { setFormData({ ...formData, name: e.target.value }); if (errors.name) setErrors({ ...errors, name: undefined }); }}
                      className={`w-full bg-paper hairline p-3 text-ink mono-tag !text-[11px] !tracking-[0.15em] !normal-case outline-none focus:border-bermellon transition-colors ${errors.name ? 'border-bermellon' : ''}`}
                      placeholder="Tu nombre" />
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
                  <label className="mono-tag !text-[9px] block mb-2" style={{ color: '#c8462a' }}>FECHA DE INTERÉS</label>
                  <input type="date" value={formData.date}
                    onChange={e => { setFormData({ ...formData, date: e.target.value }); if (errors.date) setErrors({ ...errors, date: undefined }); }}
                    className={`w-full bg-paper hairline p-3 text-ink mono-tag !text-[11px] outline-none focus:border-bermellon transition-colors ${errors.date ? 'border-bermellon' : ''}`} />
                  {errors.date && <p className="mono-tag !text-[9px] mt-1 flex items-center gap-1" style={{ color: '#c8462a' }}><AlertCircle size={10} /> {errors.date}</p>}
                </div>

                <div>
                  <label className="mono-tag !text-[9px] block mb-2" style={{ color: '#c8462a' }}>MENSAJE O PROPUESTA</label>
                  <textarea value={formData.content}
                    onChange={e => { setFormData({ ...formData, content: e.target.value }); if (errors.content) setErrors({ ...errors, content: undefined }); }}
                    className={`w-full bg-paper hairline p-4 h-40 text-ink serif-italic text-base outline-none focus:border-bermellon resize-none transition-colors leading-snug ${errors.content ? 'border-bermellon' : ''}`}
                    placeholder="Cuéntanos brevemente." />
                  {errors.content && <p className="mono-tag !text-[9px] mt-1 flex items-center gap-1" style={{ color: '#c8462a' }}><AlertCircle size={10} /> {errors.content}</p>}
                </div>

                <button type="submit" disabled={status === 'submitting'}
                  className="w-full bg-bermellon text-paper py-4 mono-tag !text-[12px] !tracking-[0.5em] hover:bg-ink transition-colors flex items-center justify-center gap-3">
                  {status === 'submitting' ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                  {status === 'submitting' ? 'ENVIANDO…' : '→ ENVIAR MENSAJE'}
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
            <h2 className="display text-3xl">Mensaje enviado.</h2>
            <p className="serif-italic text-ink-soft text-lg mt-3">Te responderemos por email lo antes posible.</p>
            <button onClick={() => setStatus('idle')} className="mt-6 hairline px-6 py-3 mono-tag hover:bg-ink hover:text-paper transition-colors">CERRAR</button>
          </div>
        </div>
      )}
    </div>
  );
};
