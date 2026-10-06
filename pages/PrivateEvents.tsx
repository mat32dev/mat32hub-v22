
import React, { useState, useEffect } from 'react';
import { Loader2, Send, CheckCircle2, Calendar as CalendarIcon, Utensils, MessageCircle } from 'lucide-react';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { CalendarPolaroid } from '../components/CalendarPolaroid';
import { useLanguage } from '../context/LanguageContext';

const TIPOS = [
  { key: 'venues.tipo1', tag: '→ HIFI' },
  { key: 'venues.tipo2', tag: '→ DJ + EQ' },
  { key: 'venues.tipo3', tag: '→ FULL' },
  { key: 'venues.tipo4', tag: '→ PRIVADO' },
  { key: 'venues.tipo5', tag: '→ ESPACIO' },
];

export const PrivateEvents: React.FC = () => {
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookedDays, setBookedDays] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    name: '', email: '',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    endTime: '22:00',
    eventType: 'cultural_event',
    concept: '',
    wantsCatering: false,
  });

  useEffect(() => {
    document.body.classList.add('theme-ink');
    dataService.getCalendarBookings()
      .then(b => setBookedDays(new Set(b.days || [])))
      .catch(() => {});
    return () => { document.body.classList.remove('theme-ink'); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.concept) {
      alert(t('venues.form.missing_fields'));
      return;
    }
    
    // Validación: viernes/sábado no bookeable después de 22:00
    const selectedDate = new Date(formData.date);
    const dayOfWeek = selectedDate.getDay(); // 5 = viernes, 6 = sábado
    const startHour = parseInt(formData.time.split(':')[0], 10);
    const endHour = parseInt(formData.endTime.split(':')[0], 10);
    
    if ((dayOfWeek === 5 || dayOfWeek === 6) && endHour > 22) {
      alert('Viernes y sábados el espacio no está disponible para alquiler después de las 22:00 (programación de sesiones).');
      return;
    }
    
    // Validación: solo bookeable 19:00-22:00
    if (startHour < 19 || endHour > 22 || startHour >= endHour) {
      alert('El horario de alquiler es de 19:00 a 22:00.');
      return;
    }
    
    setIsProcessing(true);
    await dataService.createInboxMessage({
      type: 'lead',
      sender: formData.name,
      email: formData.email,
      content: `[ALQUILER ESPACIO]: ${formData.eventType.toUpperCase()}.${formData.wantsCatering ? ' (Quiere info de catering)' : ''} Concepto: ${formData.concept}`,
      metadata: { source: 'alquiler-local', ...formData } as any,
    });
    setIsProcessing(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-ink text-paper pb-24">
      <SEO titleKey="Alquiler de espacio para eventos en colaboración · Ruzafa, Valencia | MAT32" descriptionKey="Hagámoslo juntos. Espacio Hi-Fi en Ruzafa para showcases, listenings, presentaciones de marca, cumpleaños y rodajes. Aforo 40-100 pax, Altec A7, cabina vinyl, catering opcional. Presupuesto en 24h sin compromiso." />

      {/* HERO */}
      <section className="container mx-auto px-6 md:px-10 pt-12 md:pt-16 pb-10 hairline-ink-b">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="mono-tag" style={{ color: '#c8462a' }}>{t('venues.hero.tag')}</div>
            <h1 className="display mt-3" style={{ fontSize: 'clamp(54px, 9vw, 132px)', lineHeight: 0.82, letterSpacing: '-0.02em' }}>
              {t('venues.hero.h1_pre')}<br/><span style={{ color: '#c8462a' }}>{t('venues.hero.h1_color')}</span>
            </h1>
            <p className="serif-italic text-2xl text-paper/70 mt-4 max-w-2xl leading-snug">
              {t('venues.hero.desc')}
            </p>
          </div>
          <div className="hairline-ink p-4 bg-ink-2 mono-tag !text-[10px]">
            <div style={{ color: '#d8ff5a' }}>{t('venues.hero.open')}</div>
            <div className="text-paper/70 mt-1.5">VLC · RUZAFA</div>
            <div style={{ color: '#c8462a' }} className="mt-1">{t('venues.hero.respond')}</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-8">
          <a href="#booking-form" className="bg-bermellon text-paper px-5 py-3 mono-tag hover:bg-paper hover:text-ink transition-colors">
            {t('venues.form.tag')} →
          </a>
          <a href="https://wa.me/34622190802" target="_blank" rel="noopener" className="hairline-ink px-5 py-3 mono-tag hover:bg-paper hover:text-ink transition-colors flex items-center gap-2">
            <MessageCircle size={14} /> WHATSAPP DIRECTO
          </a>
        </div>
      </section>

      {/* BOOKING + CALENDAR + TECH SPECS */}
      <section id="booking-form" className="container mx-auto px-6 md:px-10 py-16">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* CALENDAR — col 1 */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-baseline gap-3 mb-2">
              <CalendarIcon size={18} className="text-paper" />
              <h2 className="display text-2xl md:text-3xl">{t('venues.availability.h2')}</h2>
            </div>
            <p className="serif-italic text-paper/60 text-sm">{t('venues.availability.desc')}</p>
            <CalendarPolaroid bookedDays={bookedDays} contextDark bookingMode />

            {/* TECH SPECS */}
            <div className="hairline-ink p-5 bg-ink-2">
              <div className="mono-tag" style={{ color: '#c8462a' }}>{t('venues.specs.title')}</div>
              <ul className="mt-4 space-y-3 mono-tag !text-[11px] text-paper/85">
                <li className="flex justify-between hairline-ink-b pb-2"><span className="text-paper/55">AFORO MÁX</span><span className="text-paper">100 PAX</span></li>
                <li className="flex justify-between hairline-ink-b pb-2"><span className="text-paper/55">SISTEMA PA</span><span className="text-paper">ALTEC A7 + KLIPSCH LA SCALA</span></li>
                <li className="flex justify-between hairline-ink-b pb-2"><span className="text-paper/55">CONTROL</span><span className="text-paper">ROTARY ANALOG · 2× TECHNICS 1210</span></li>
                <li className="flex justify-between hairline-ink-b pb-2"><span className="text-paper/55">DOS ZONAS</span><span className="text-paper">RELAX + DANCEFLOOR</span></li>
                <li className="flex justify-between"><span className="text-paper/55">UBICACIÓN</span><span style={{ color: '#c8462a' }}>RUZAFA · VLC</span></li>
              </ul>
            </div>

            {/* TIPOS DE EVENTO */}
            <div className="bg-paper text-ink p-5 hairline-ink">
              <div className="mono-tag" style={{ color: '#c8462a' }}>{t('venues.type_tag')}</div>
              <ul className="mt-3 space-y-1.5">
                {TIPOS.map(tipo => (
                  <li key={tipo.key} className="flex justify-between items-baseline hairline-b pb-2 last:border-b-0">
                    <span className="display text-base">{t(tipo.key)}</span>
                    <span className="mono-tag text-ink-soft">{tipo.tag}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* FORM — col 2 */}
          <div className="lg:col-span-7">
            {isSubmitted ? (
              <div className="hairline-ink p-10 md:p-12 text-center bg-ink-2">
                <CheckCircle2 className="w-16 h-16 mx-auto mb-6" style={{ color: '#d8ff5a' }} />
                <h2 className="display text-3xl md:text-4xl">{t('venues.confirmed.h2')}</h2>
                <p className="serif-italic text-paper/65 mt-3 text-lg max-w-md mx-auto">{t('venues.confirmed.desc')}</p>
                <div className="flex flex-wrap justify-center gap-2 mt-8">
                  <a href="https://wa.me/34622190802" target="_blank" rel="noopener" className="bg-bermellon text-paper px-5 py-3 mono-tag hover:bg-paper hover:text-ink transition-colors flex items-center gap-2">
                    <MessageCircle size={14} /> {t('venues.confirmed.whatsapp')}
                  </a>
                  <button onClick={() => setIsSubmitted(false)} className="hairline-ink px-5 py-3 mono-tag hover:bg-paper hover:text-ink transition-colors">
                    {t('venues.confirmed.another')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="hairline-ink p-6 md:p-8 bg-ink-2">
                <div className="mono-tag mb-2" style={{ color: '#c8462a' }}>{t('venues.form.tag')}</div>
                <p className="serif-italic text-paper/60 text-sm mb-6 leading-snug">{t('venues.form.desc')}</p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="mono-tag !text-[9px] block mb-2" style={{ color: '#c8462a' }}>{t('venues.form.label_name')}</label>
                      <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="P.EJ. SELLO_VLC"
                        className="w-full bg-ink hairline-ink p-3 text-paper mono-tag !text-[11px] !tracking-[0.15em] !normal-case outline-none focus:border-bermellon transition-colors" />
                    </div>
                    <div>
                      <label className="mono-tag !text-[9px] block mb-2" style={{ color: '#c8462a' }}>EMAIL</label>
                      <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="hola@empresa.com"
                        className="w-full bg-ink hairline-ink p-3 text-paper mono-tag !text-[11px] !tracking-[0.15em] !normal-case outline-none focus:border-bermellon transition-colors" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="mono-tag !text-[9px] block mb-2" style={{ color: '#c8462a' }}>{t('venues.form.label_date')}</label>
                      <input type="date" min={new Date().toISOString().split('T')[0]} value={formData.date}
                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-ink hairline-ink p-3 text-paper mono-tag !text-[11px] outline-none focus:border-bermellon transition-colors [color-scheme:dark]" />
                    </div>
                    <div>
                      <label className="mono-tag !text-[9px] block mb-2" style={{ color: '#c8462a' }}>{t('venues.form.label_time')}</label>
                      <input type="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })}
                        className="w-full bg-ink hairline-ink p-3 text-paper mono-tag !text-[11px] outline-none focus:border-bermellon transition-colors [color-scheme:dark]" />
                    </div>
                    <div>
                      <label className="mono-tag !text-[9px] block mb-2" style={{ color: '#c8462a' }}>HORA FIN</label>
                      <input type="time" value={formData.endTime} onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                        className="w-full bg-ink hairline-ink p-3 text-paper mono-tag !text-[11px] outline-none focus:border-bermellon transition-colors [color-scheme:dark]" />
                    </div>
                    <div className="md:col-span-3">
                      <label className="mono-tag !text-[9px] block mb-2" style={{ color: '#c8462a' }}>{t('venues.form.label_type')}</label>
                      <select value={formData.eventType} onChange={e => setFormData({ ...formData, eventType: e.target.value })}
                        className="w-full bg-ink hairline-ink p-3 text-paper mono-tag !text-[11px] !normal-case outline-none focus:border-bermellon transition-colors">
                        <option value="cultural_event">{t('venues.form.type_cultural')}</option>
                        <option value="brand_event">{t('venues.form.type_brand')}</option>
                        <option value="private_party">{t('venues.form.type_party')}</option>
                        <option value="shoot">{t('venues.form.type_shoot')}</option>
                        <option value="other">{t('venues.form.type_other')}</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="mono-tag !text-[9px] block mb-2" style={{ color: '#c8462a' }}>{t('venues.form.label_idea')}</label>
                    <textarea required value={formData.concept} onChange={e => setFormData({ ...formData, concept: e.target.value })}
                      placeholder={t('venues.form.idea_placeholder')}
                      className="w-full bg-ink hairline-ink p-4 h-40 text-paper serif-italic text-sm outline-none focus:border-bermellon resize-none transition-colors leading-snug"
                    />
                  </div>
                  <label className="flex items-start gap-3 hairline-ink p-3 cursor-pointer hover:bg-ink transition-colors">
                    <input type="checkbox" checked={formData.wantsCatering}
                      onChange={e => setFormData({ ...formData, wantsCatering: e.target.checked })}
                      className="mt-0.5 accent-bermellon" />
                    <div className="flex-1">
                      <div className="mono-tag flex items-center gap-2" style={{ color: '#c8462a' }}>
                        <Utensils size={11} /> {t('venues.form.catering_tag')}
                      </div>
                      <p className="serif-italic text-paper/55 text-xs mt-1">{t('venues.form.catering_desc')}</p>
                    </div>
                  </label>
                  <button type="submit"
                    className="w-full bg-bermellon text-paper py-4 mono-tag !text-[12px] !tracking-[0.5em] hover:bg-paper hover:text-ink transition-colors flex items-center justify-center gap-3">
                    {isProcessing ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                    {isProcessing ? t('venues.form.submit_sending') : t('venues.form.submit_idle')}
                  </button>
                  <p className="mono-tag text-center text-paper/50">{t('venues.form.footer_no_commitment')}</p>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER STRIP */}
        <div className="hairline-ink-t mt-12 pt-6 flex flex-wrap items-center gap-4 mono-tag !text-[10px]">
          <a href="https://wa.me/34622190802" target="_blank" rel="noopener" className="bg-bermellon text-paper px-3 py-1.5 hover:bg-paper hover:text-ink transition-colors">WHATSAPP DIRECTO</a>
          <span className="text-paper/65">+34 622 19 08 02</span>
          <span className="text-paper/40">·</span>
          <span className="text-paper/65">RESPONDEMOS EN 24H</span>
          <span className="ml-auto" style={{ color: '#d8ff5a' }}>{t('venues.form.footer_free_enquiry')}</span>
        </div>
      </section>

      {/* CATERING */}
      <section className="container mx-auto px-6 md:px-10 py-14 hairline-ink-t">
        <div className="flex items-baseline gap-3 mb-2">
          <Utensils size={18} className="text-paper/70" />
          <h2 className="display text-2xl md:text-3xl text-paper/85">{t('venues.catering.h2_pre')} {t('venues.catering.h2_main')}</h2>
          <span className="mono-tag text-paper/40">{t('venues.catering.optional')}</span>
        </div>
        <p className="serif-italic text-paper/55 max-w-2xl text-sm leading-snug mb-6">
          {t('venues.catering.desc')}
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="hairline-ink p-4 bg-ink-2">
            <div className="display text-paper text-xl">{t('venues.catering.snacks.name')}</div>
            <div className="serif-italic text-paper/55 text-xs mt-1 leading-snug">{t('venues.catering.snacks.desc')}</div>
            <div className="mono-tag mt-3 text-paper/65">DESDE <span style={{ color: '#c8462a' }}>6€/PAX</span></div>
          </div>
          <div className="hairline-ink p-4 bg-ink-2">
            <div className="display text-paper text-xl">{t('venues.catering.board.name')}</div>
            <div className="serif-italic text-paper/55 text-xs mt-1 leading-snug">{t('venues.catering.board.desc')}</div>
            <div className="mono-tag mt-3 text-paper/65">DESDE <span style={{ color: '#c8462a' }}>12€/PAX</span></div>
          </div>
          <div className="hairline-ink p-4 bg-ink-2">
            <div className="display text-paper text-xl">{t('venues.catering.premium.name')}</div>
            <div className="serif-italic text-paper/55 text-xs mt-1 leading-snug">{t('venues.catering.premium.desc')}</div>
            <div className="mono-tag mt-3 text-paper/65">DESDE <span style={{ color: '#c8462a' }}>18€/PAX</span></div>
          </div>
        </div>
        <p className="mono-tag !text-[10px] text-paper/40 mt-4">{t('venues.catering.footer')}</p>
      </section>
    </div>
  );
};
