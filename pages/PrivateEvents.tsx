
import React, { useState, useEffect } from 'react';
import { Loader2, Send, CheckCircle2, Camera, Calendar as CalendarIcon, Utensils, MessageCircle } from 'lucide-react';
import { useSobremesa } from '../components/SobremesaModal';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { CachedImage } from '../components/CachedImage';
import { CalendarPolaroid } from '../components/CalendarPolaroid';

// GALERÍA TÉCNICA — 7 fotos del local
const SPACE_GALLERY = [
  { url: 'https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/ac1a7472-de26-46de-37f3-7ec5509f5900/public', title: 'Sala Principal', tag: 'EspacioCompleto' },
  { url: 'https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/7af028d2-be2a-44ae-a2bd-d2e05db8ac00/w=800', title: 'Rincón Analógico', tag: 'Ambiente' },
  { url: 'https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/53d83bbb-47b5-45ce-4f69-00fdc063fd00/w=800', title: 'Archivo de Vinilos', tag: 'Almacén' },
  { url: 'https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/f66760c8-cc6c-457a-dc23-5edbe31a2200/w=800', title: 'Bola de Espejos', tag: 'Atmósfera' },
  { url: 'https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/cd431032-310e-4ccc-c602-68787da5ae00/w=800', title: 'Zona Lounge', tag: 'LivingRoom' },
  { url: 'https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/36b8814e-df61-468c-614a-788a5fbfa700/w=800', title: 'Sala de Escucha', tag: 'ListeningRoom' },
  { url: 'https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/496db3dc-f7c7-4d22-d05a-ac0198681c00/w=800', title: 'Cabina DJ', tag: 'Booth' },
];

const TIPOS = [
  { name: 'Listening session', tag: '→ HIFI' },
  { name: 'Showcase de sello',  tag: '→ DJ + EQ' },
  { name: 'Presentación de marca', tag: '→ FULL' },
  { name: 'Cumpleaños raro', tag: '→ PRIVADO' },
  { name: 'Rodaje / foto', tag: '→ ESPACIO' },
];

export const PrivateEvents: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookedDays, setBookedDays] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    name: '', email: '',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    eventType: 'cultural_event',
    concept: ''
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
      alert('Faltan campos obligatorios');
      return;
    }
    setIsProcessing(true);
    await dataService.createInboxMessage({
      type: 'lead',
      sender: formData.name,
      email: formData.email,
      content: `[ALQUILER ESPACIO]: ${formData.eventType.toUpperCase()}. Concepto: ${formData.concept}`,
      metadata: { source: 'alquiler-local', ...formData } as any,
    });
    setIsProcessing(false);
    setIsSubmitted(true);
  };

  const { open: openSobremesa } = useSobremesa();

  return (
    <div className="min-h-screen bg-ink text-paper pb-24">
      <SEO titleKey="Alquiler del local · Eventos privados | MAT32" descriptionKey="Espacio histórico en Ruzafa para colectivos, promotores, sellos y marcas. Sound system Hi-Fi, cabina vinyl-friendly, aforo 40-100. Calendario libre + presupuesto en 24h." />

      {/* HERO · slide 10 */}
      <section className="container mx-auto px-6 md:px-10 pt-12 md:pt-16 pb-10 hairline-ink-b">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="mono-tag" style={{ color: '#c8462a' }}>PRIVADOS · /ALQUILER</div>
            <h1 className="display mt-3" style={{ fontSize: 'clamp(54px, 9vw, 132px)', lineHeight: 0.82, letterSpacing: '-0.02em' }}>
              Alquiler<br/><span style={{ color: '#c8462a' }}>del local.</span>
            </h1>
            <p className="serif-italic text-2xl text-paper/70 mt-4 max-w-2xl leading-snug">
              Sitio para tu cosa: presentaciones, showcases, listening sessions, cumpleaños raros, marcas que no quieren un sitio cualquiera.
            </p>
          </div>
          <div className="hairline-ink p-4 bg-ink-2 mono-tag !text-[10px]">
            <div style={{ color: '#d8ff5a' }}>● LIVE_AVAILABILITY</div>
            <div className="text-paper/70 mt-1.5">EUROPE · MADRID</div>
            <div style={{ color: '#c8462a' }} className="mt-1">G·CALENDAR EMBED</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-8">
          <a href="#booking-form" className="bg-bermellon text-paper px-5 py-3 mono-tag hover:bg-paper hover:text-ink transition-colors">
            SOLICITAR FECHA →
          </a>
          <a href="https://wa.me/34622190802" target="_blank" rel="noopener" className="hairline-ink px-5 py-3 mono-tag hover:bg-paper hover:text-ink transition-colors flex items-center gap-2">
            <MessageCircle size={14} /> WHATSAPP DIRECTO
          </a>
        </div>
      </section>

      {/* CATERING CROSS-SELL */}
      <section className="container mx-auto px-6 md:px-10 py-12 hairline-ink-b">
        <div className="hairline-ink p-6 md:p-8 bg-ink-2">
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
            <div className="flex-1">
              <div className="mono-tag flex items-center gap-2" style={{ color: '#c8462a' }}>
                <Utensils size={12} /> + CATERING OPCIONAL · MÍN. 20 PAX
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="hairline-ink p-3">
                  <div className="display text-paper text-xl">Picoteo</div>
                  <div className="mono-tag mt-1" style={{ color: '#c8462a' }}>6€ / PAX</div>
                </div>
                <div className="hairline-ink p-3">
                  <div className="display text-paper text-xl">Tabla</div>
                  <div className="mono-tag mt-1" style={{ color: '#c8462a' }}>12€ / PAX</div>
                </div>
                <div className="hairline-ink p-3">
                  <div className="display text-paper text-xl">Premium</div>
                  <div className="mono-tag mt-1" style={{ color: '#c8462a' }}>18€ / PAX</div>
                </div>
              </div>
              <p className="serif-italic text-paper/60 text-sm mt-3">Vermut, cerveza, vino o barra libre. Depósito 5€/pax descontable.</p>
            </div>
            <button onClick={openSobremesa} className="shrink-0 bg-bermellon text-paper px-5 py-3 mono-tag hover:bg-paper hover:text-ink transition-colors">
              SOLICITAR CATERING →
            </button>
          </div>
        </div>
      </section>

      {/* GALERÍA */}
      <section className="container mx-auto px-6 md:px-10 py-16 hairline-ink-b">
        <div className="flex items-baseline gap-4 mb-8">
          <Camera size={20} className="text-paper" />
          <h2 className="display text-3xl md:text-5xl">El espacio.</h2>
          <span className="mono-tag text-paper/40">7 ÁNGULOS</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {SPACE_GALLERY.map((img, idx) => (
            <div key={idx} className={`relative group hairline-ink overflow-hidden ${idx === 0 ? 'col-span-2 row-span-2' : ''}`}>
              <CachedImage src={img.url} alt={img.title} className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700" aspectRatio={idx === 0 ? 'aspect-video' : 'aspect-square'} />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <span className="mono-tag" style={{ color: '#d8ff5a' }}>#{img.tag}</span>
                <h4 className="display text-paper text-xl mt-1">{img.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BOOKING + CALENDAR + TECH SPECS */}
      <section id="booking-form" className="container mx-auto px-6 md:px-10 py-16">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* CALENDAR — col 1 */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-baseline gap-3 mb-2">
              <CalendarIcon size={18} className="text-paper" />
              <h2 className="display text-2xl md:text-3xl">Disponibilidad.</h2>
            </div>
            <p className="serif-italic text-paper/60 text-sm">Las franjas libres son las que puedes solicitar.</p>
            <CalendarPolaroid bookedDays={bookedDays} contextDark />

            {/* TECH SPECS */}
            <div className="hairline-ink p-5 bg-ink-2">
              <div className="mono-tag" style={{ color: '#c8462a' }}>FICHA TÉCNICA</div>
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
              <div className="mono-tag" style={{ color: '#c8462a' }}>TIPO DE EVENTO</div>
              <ul className="mt-3 space-y-1.5">
                {TIPOS.map(t => (
                  <li key={t.name} className="flex justify-between items-baseline hairline-b pb-2 last:border-b-0">
                    <span className="display text-base">{t.name}</span>
                    <span className="mono-tag text-ink-soft">{t.tag}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* FORM — col 2 */}
          <div className="lg:col-span-7">
            {isSubmitted ? (
              <div className="hairline-ink p-12 text-center bg-ink-2">
                <CheckCircle2 className="w-16 h-16 mx-auto mb-6" style={{ color: '#d8ff5a' }} />
                <h2 className="display text-3xl md:text-4xl">Solicitud recibida.</h2>
                <p className="serif-italic text-paper/65 mt-3 text-lg">Te respondemos en menos de 24h con presupuesto y rider.</p>
                <button onClick={() => setIsSubmitted(false)} className="mt-8 hairline-ink px-6 py-3 mono-tag hover:bg-paper hover:text-ink transition-colors">
                  ENVIAR OTRA →
                </button>
              </div>
            ) : (
              <div className="hairline-ink p-6 md:p-8 bg-ink-2">
                <div className="mono-tag mb-6" style={{ color: '#c8462a' }}>SOLICITAR FECHA</div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="mono-tag !text-[9px] block mb-2" style={{ color: '#c8462a' }}>NOMBRE / MARCA</label>
                      <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="P.EJ. SELLO_VLC"
                        className="w-full bg-ink hairline-ink p-3 text-paper mono-tag !text-[11px] !tracking-[0.15em] !normal-case outline-none focus:border-bermellon transition-colors" />
                    </div>
                    <div>
                      <label className="mono-tag !text-[9px] block mb-2" style={{ color: '#c8462a' }}>CORREO</label>
                      <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="hola@empresa.com"
                        className="w-full bg-ink hairline-ink p-3 text-paper mono-tag !text-[11px] !tracking-[0.15em] !normal-case outline-none focus:border-bermellon transition-colors" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="mono-tag !text-[9px] block mb-2" style={{ color: '#c8462a' }}>FECHA</label>
                      <input required type="date" min={new Date().toISOString().split('T')[0]} value={formData.date}
                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-ink hairline-ink p-3 text-paper mono-tag !text-[11px] outline-none focus:border-bermellon transition-colors [color-scheme:dark]" />
                    </div>
                    <div>
                      <label className="mono-tag !text-[9px] block mb-2" style={{ color: '#c8462a' }}>HORA</label>
                      <input type="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })}
                        className="w-full bg-ink hairline-ink p-3 text-paper mono-tag !text-[11px] outline-none focus:border-bermellon transition-colors [color-scheme:dark]" />
                    </div>
                    <div>
                      <label className="mono-tag !text-[9px] block mb-2" style={{ color: '#c8462a' }}>TIPO</label>
                      <select value={formData.eventType} onChange={e => setFormData({ ...formData, eventType: e.target.value })}
                        className="w-full bg-ink hairline-ink p-3 text-paper mono-tag !text-[11px] !normal-case outline-none focus:border-bermellon transition-colors">
                        <option value="cultural_event">Cultural / showcase</option>
                        <option value="brand_event">Marca / corporate</option>
                        <option value="private_party">Privada / cumpleaños</option>
                        <option value="shoot">Rodaje / foto</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="mono-tag !text-[9px] block mb-2" style={{ color: '#c8462a' }}>CONCEPTO</label>
                    <textarea required value={formData.concept} onChange={e => setFormData({ ...formData, concept: e.target.value })}
                      placeholder="Showcase de sello con tres artistas. Listening de 19h a 21h, set largo después. Necesitamos buen sonido y zona para que la gente se siente."
                      className="w-full bg-ink hairline-ink p-4 h-40 text-paper serif-italic text-sm outline-none focus:border-bermellon resize-none transition-colors leading-snug"
                    />
                  </div>
                  <button type="submit"
                    className="w-full bg-bermellon text-paper py-4 mono-tag !text-[12px] !tracking-[0.5em] hover:bg-paper hover:text-ink transition-colors flex items-center justify-center gap-3">
                    {isProcessing ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                    {isProcessing ? 'ENVIANDO…' : '→ ENVIAR SOLICITUD'}
                  </button>
                  <p className="mono-tag text-center text-paper/50">RESPUESTA EN &lt; 24H · CON PRESUPUESTO Y RIDER</p>
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
          <span className="ml-auto" style={{ color: '#d8ff5a' }}>CONSULTA SIN COMPROMISO →</span>
        </div>
      </section>
    </div>
  );
};
