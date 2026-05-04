import React, { useEffect, useState } from 'react';
import { Package, Disc, Truck, MapPin, Mail, Clock, CheckCircle2, Zap, ShieldCheck, Send, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';

export const Marketplace: React.FC = () => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', platforms: '', volume: '5-20', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsRevealed(true), 80);
    document.body.classList.add('theme-paper');
    return () => { document.body.classList.remove('theme-paper'); };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSending(true); setError(false);
    try {
      await dataService.createInboxMessage({
        type: 'lead',
        sender: form.name, email: form.email, phone: form.phone || undefined,
        content: `MARKETPLACE 3PL — Plataformas: ${form.platforms || '-'} · Volumen/mes: ${form.volume} · Msg: ${form.message || '-'}`,
        metadata: { ...form, source: 'marketplace-3pl' } as any,
      });
      setSent(true);
    } catch { setError(true); }
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-paper text-ink pb-24 grain">
      <SEO
        titleKey="Fulfillment de Discos · 3PL Valencia · MAT32 Marketplace"
        descriptionKey="Servicio 3PL de discos en Valencia. Almacenaje, empaquetado y envío para sellers de Discogs, eBay, Wallapop. Embalaje especializado, tarifas negociadas con SEUR y Correos Express."
      />

      {/* HERO */}
      <section className="container mx-auto px-6 md:px-10 pt-12 md:pt-16 pb-12 hairline-b">
        <div className={`transition-all duration-1000 ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="mono-tag flex items-center gap-2" style={{ color: '#c8462a' }}>
            <Package size={12} /> 3PL DISCOS · VALENCIA
          </div>
          <h1 className="display mt-3" style={{ fontSize: 'clamp(48px, 8vw, 116px)', lineHeight: 0.85 }}>
            Tú listas.<br/><span style={{ color: '#c8462a' }}>Nosotros enviamos.</span>
          </h1>
          <p className="serif-italic text-2xl text-ink-soft mt-5 max-w-3xl leading-snug">
            Fulfillment de discos para sellers de Discogs, eBay y Wallapop. Almacenamos, empaquetamos y despachamos. Sin colas en Correos, sin discos rotos.
          </p>
          <div className="flex flex-wrap gap-2 mt-8">
            <a href="#contacto" className="bg-bermellon text-paper px-5 py-3 mono-tag hover:bg-ink transition-colors">SOLICITAR PRESUPUESTO →</a>
            <a href="#servicios" className="hairline px-5 py-3 mono-tag hover:bg-ink hover:text-paper transition-colors">VER SERVICIOS</a>
          </div>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 hairline-t pt-8">
            <Stat value="48h" label="ENVÍO MEDIO" />
            <Stat value="< 0.5%" label="DAÑADOS" />
            <Stat value="RUZAFA" label="EN EL BARRIO" />
            <Stat value="DISCOGS" label="INTEGRACIÓN" />
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section className="bg-paper-2 hairline-b">
        <div className="container mx-auto px-6 md:px-10 py-16 md:py-20 max-w-5xl">
          <div className="mono-tag flex items-center gap-2" style={{ color: '#c8462a' }}>
            <Clock size={12} /> EL PROBLEMA
          </div>
          <h2 className="display mt-3" style={{ fontSize: 'clamp(36px, 5vw, 72px)', lineHeight: 0.9 }}>
            Vendes bien.<br/><span className="text-ink-soft">Enviar te cuesta la vida.</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-2 mt-10">
            {[
              { tag: '2 HORAS', text: 'Cada sábado en la cola de Correos con 12 sobres bajo el brazo.' },
              { tag: 'DISCOS ROTOS', text: 'Embalaje genérico, warps, tapas dobladas, bad review en Discogs.' },
              { tag: 'TARIFAS CARAS', text: 'Tarifa de particular. Sin volumen, sin descuentos, sin negociación.' },
            ].map((p, i) => (
              <div key={i} className="hairline p-6 bg-paper">
                <div className="mono-tag" style={{ color: '#c8462a' }}>{p.tag}</div>
                <p className="serif-italic text-ink-soft text-base mt-3 leading-snug">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="servicios" className="hairline-b">
        <div className="container mx-auto px-6 md:px-10 py-16 md:py-20 max-w-5xl">
          <div className="mb-10">
            <div className="mono-tag flex items-center gap-2" style={{ color: '#c8462a' }}>
              <Truck size={12} /> CÓMO FUNCIONA
            </div>
            <h2 className="display mt-3" style={{ fontSize: 'clamp(40px, 6vw, 84px)', lineHeight: 0.9 }}>
              5 pasos. <span style={{ color: '#c8462a' }}>0 visitas a Correos.</span>
            </h2>
          </div>

          <div className="space-y-3">
            {[
              { n: '01', t: 'ALMACENAJE', d: 'Tu catálogo custodiado en nuestra tienda de Ruzafa. Temperatura controlada, sin luz directa, estantería vertical. Inventario digital accesible 24/7.' },
              { n: '02', t: 'PEDIDO ENTRANTE', d: 'Te llega una venta en Discogs, eBay o Wallapop. La reenvías (o sincronizamos automáticamente con API). Entra en nuestra cola.' },
              { n: '03', t: 'EMPAQUETADO', d: 'Mailer polylined, stiffener LP, esquinas reforzadas, burbuja interior. Embalaje específico para discos, no cajas genéricas.' },
              { n: '04', t: 'ENVÍO', d: 'Tarifas negociadas con SEUR, Correos Express y Packlink. Tracking automático al comprador. Seguro incluido hasta 100€.' },
              { n: '05', t: 'INCIDENCIAS', d: 'Si el paquete se pierde o llega dañado, gestionamos la reclamación con la empresa de transporte y el reembolso.' },
            ].map(s => (
              <div key={s.n} className="flex gap-6 p-6 hairline bg-paper hover:bg-ink hover:text-paper transition-colors group">
                <div className="display text-5xl shrink-0" style={{ color: '#c8462a' }}>{s.n}</div>
                <div>
                  <h3 className="display text-xl mb-2">{s.t}</h3>
                  <p className="serif-italic text-base text-ink-soft group-hover:text-paper/70 leading-snug transition-colors">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANES */}
      <section className="bg-ink text-paper hairline-b">
        <div className="container mx-auto px-6 md:px-10 py-16 md:py-20 max-w-6xl">
          <div className="mb-10">
            <div className="mono-tag flex items-center gap-2" style={{ color: '#d8ff5a' }}>
              <Zap size={12} /> PLANES
            </div>
            <h2 className="display mt-3 text-paper" style={{ fontSize: 'clamp(40px, 6vw, 84px)', lineHeight: 0.9 }}>
              Según tu <span style={{ color: '#c8462a' }}>volumen.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-2">
            <Plan title="DROP & SHIP" price="1,50€" unit="por envío" extra="+ coste transporte"
              desc="Tú empaquetas. Traes los paquetes listos, nosotros los despachamos con nuestras tarifas."
              features={['Sin almacenaje', 'Tarifas negociadas', 'Tracking automático', 'Pago quincenal']} />
            <Plan title="PACK & SHIP" price="3,50€" unit="por paquete" extra="+ coste transporte"
              desc="Tú nos das los discos. Nosotros empaquetamos con material específico y enviamos."
              features={['Mailer polylined', 'Stiffener LP', 'Foto empaquetado', 'Seguro hasta 100€']} highlight />
            <Plan title="FULL STACK" price="12%" unit="sobre venta" extra="sin mensualidad"
              desc="Nosotros listamos, gradeamos, fotografiamos y enviamos. Tú seleccionas y cobras."
              features={['Listing Discogs/eBay', 'Grading profesional', 'Fotografía alta res', 'Gestión devoluciones']} />
          </div>

          <p className="serif-italic text-paper/60 text-base mt-10 max-w-2xl leading-snug">
            Almacenaje incluido hasta 500 unidades. Volumen mayor o especial (cajas, BoxSets, singles) se cotiza aparte. Todos los planes incluyen integración con Discogs.
          </p>
        </div>
      </section>

      {/* POR QUÉ MAT32 */}
      <section className="hairline-b">
        <div className="container mx-auto px-6 md:px-10 py-16 md:py-20 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="mono-tag flex items-center gap-2" style={{ color: '#c8462a' }}>
                <Disc size={12} /> POR QUÉ MAT32
              </div>
              <h2 className="display mt-3" style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', lineHeight: 0.9 }}>
                No somos un <span style={{ color: '#c8462a' }}>almacén genérico.</span>
              </h2>
              <p className="serif-italic text-ink-soft text-lg mt-5 leading-snug">
                Somos una tienda de discos de Ruzafa. Llevamos años vendiendo, empaquetando y enviando. Conocemos los vicios del formato: warps, splits, seam splits, los 7" que necesitan sobre rígido.
              </p>
            </div>
            <div className="space-y-2">
              {[
                { i: ShieldCheck, t: 'ESPECIALISTAS EN DISCOS', d: 'Más de una década empaquetando LPs, 12", 7", BoxSets.' },
                { i: MapPin, t: 'RUZAFA, VALENCIA', d: 'Ven a vernos. Trae la caja, firma y te vas.' },
                { i: Package, t: 'MATERIAL PROFESIONAL', d: 'Mailers polylined, stiffeners, separadores, reforzadores.' },
                { i: Truck, t: 'TARIFAS B2B', d: 'Acuerdos con SEUR, Correos Express, Packlink.' },
              ].map((x, i) => {
                const Icon = x.i;
                return (
                  <div key={i} className="flex items-start gap-4 p-4 hairline bg-paper-2">
                    <Icon className="w-5 h-5 shrink-0 mt-1" style={{ color: '#c8462a' }} />
                    <div>
                      <div className="mono-tag" style={{ color: '#c8462a' }}>{x.t}</div>
                      <div className="serif-italic text-ink-soft text-sm mt-1 leading-snug">{x.d}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCIA */}
      <section className="bg-paper-2 hairline-b">
        <div className="container mx-auto px-6 md:px-10 py-16 md:py-20 max-w-5xl">
          <div className="grid md:grid-cols-[minmax(300px,420px)_1fr] gap-10 items-center">
            <div className="relative w-full max-w-[420px] aspect-[4/5] hairline overflow-hidden bg-ink">
              <img src="/team/founder.jpg" alt="Experiencia MAT32"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: 'grayscale(100%) contrast(1.08) brightness(0.95)' }} />
              <div className="absolute inset-0 bg-bermellon mix-blend-color opacity-60 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 mono-tag" style={{ color: '#c8462a' }}>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#c8462a' }} />
                  RARETRAXXX+ · MAT32
                </span>
              </div>
            </div>
            <div>
              <div className="mono-tag flex items-center gap-2" style={{ color: '#c8462a' }}>
                <ShieldCheck size={12} /> EXPERIENCIA
              </div>
              <h2 className="display mt-3" style={{ fontSize: 'clamp(30px, 4vw, 48px)', lineHeight: 0.95 }}>
                Años como <span style={{ color: '#c8462a' }}>comprador y vendedor</span> nos avalan.
              </h2>
              <p className="serif-italic text-ink-soft text-lg mt-5 leading-snug">
                No somos un intermediario. Hemos estado al otro lado del mostrador: en cabinas, en ferias internacionales, en foros de Discogs, en cajas de estanterías rescatando rarezas. Conocemos cómo se empaqueta, se gradúa y se envía un disco que llega perfecto.
              </p>
              <p className="serif-italic text-ink-soft/80 text-base mt-3 leading-snug">
                Tu colección va a estar en manos de alguien que, en otra vida, la habría querido comprar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FORM */}
      <section id="contacto" className="container mx-auto px-6 md:px-10 py-16 md:py-20 max-w-3xl">
        <div className="mb-10">
          <div className="mono-tag flex items-center gap-2" style={{ color: '#c8462a' }}>
            <Mail size={12} /> SOLICITA PRESUPUESTO
          </div>
          <h2 className="display mt-3" style={{ fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 0.9 }}>
            Cuéntanos <span style={{ color: '#c8462a' }}>tu caso.</span>
          </h2>
          <p className="serif-italic text-ink-soft text-lg mt-3">Te contestamos en 24h con un presupuesto adaptado.</p>
        </div>

        {sent ? (
          <div className="hairline p-10 bg-paper-2 text-center">
            <CheckCircle2 className="w-14 h-14 text-bermellon mx-auto mb-4" />
            <h3 className="display text-3xl">Recibido.</h3>
            <p className="serif-italic text-ink-soft text-lg mt-2">Te escribimos a <b className="text-ink not-italic">{form.email}</b> en menos de 24h.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="hairline p-6 md:p-8 bg-paper-2 space-y-5">
            {error && (
              <div className="flex items-center gap-2 p-3 hairline mono-tag !text-[10px]" style={{ color: '#c8462a' }}>
                <AlertCircle size={14} /> ALGO HA FALLADO. PRUEBA OTRA VEZ.
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="NOMBRE *">
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mat-input" />
              </Field>
              <Field label="EMAIL *">
                <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="mat-input" />
              </Field>
            </div>
            <Field label="TELÉFONO">
              <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="mat-input" />
            </Field>
            <Field label="¿DÓNDE VENDES?">
              <input value={form.platforms} onChange={e => setForm({ ...form, platforms: e.target.value })} className="mat-input" placeholder="Discogs (user: xxx), Wallapop, eBay" />
            </Field>
            <Field label="VOLUMEN ESTIMADO / MES">
              <div className="grid grid-cols-4 gap-2">
                {['1-5', '5-20', '20-50', '50+'].map(v => (
                  <button key={v} type="button" onClick={() => setForm({ ...form, volume: v })}
                    className={`py-2.5 mono-tag !text-[11px] transition-colors ${form.volume === v ? 'bg-bermellon text-paper' : 'hairline hover:bg-ink hover:text-paper'}`}>
                    {v}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="CUÉNTANOS MÁS (OPCIONAL)">
              <textarea rows={3} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                placeholder="Colección, necesidades especiales, preguntas." className="mat-input serif-italic" style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic' }} />
            </Field>
            <button type="submit" disabled={sending}
              className="w-full bg-bermellon text-paper py-4 mono-tag !text-[12px] !tracking-[0.5em] hover:bg-ink transition-colors disabled:opacity-50 flex items-center justify-center gap-3">
              {sending ? <><Loader2 size={14} className="animate-spin" /> ENVIANDO…</> : <><Send size={14} /> → ENVIAR SOLICITUD</>}
            </button>
            <p className="text-center mono-tag text-ink-soft">
              SIN SPAM · 24H · DATOS SEGÚN <Link to="/legal/privacidad" className="hover:text-bermellon" style={{ color: '#c8462a' }}>POLÍTICA</Link>
            </p>
          </form>
        )}
        <div className="mt-8 text-center mono-tag text-ink-soft">
          ¿PREFIERES EMAIL? <a href="mailto:hola@mat32.com" className="hover:text-ink" style={{ color: '#c8462a' }}>HOLA@MAT32.COM</a>
        </div>
      </section>

      <style>{`.mat-input { width:100%; background:#f1e8d8; border:1.5px solid #1a1611; padding:10px 14px; color:#1a1611; font-family:'DM Mono',monospace; font-size:12px; letter-spacing:0.05em; outline:none; transition:border-color 0.2s; } .mat-input:focus{ border-color:#c8462a; }`}</style>
    </div>
  );
};

const Stat: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="hairline-r last:border-r-0 px-4 py-2">
    <div className="display text-3xl md:text-4xl" style={{ color: '#c8462a' }}>{value}</div>
    <div className="mono-tag text-ink-soft mt-1">{label}</div>
  </div>
);

const Plan: React.FC<{ title: string; price: string; unit: string; extra: string; desc: string; features: string[]; highlight?: boolean }> = ({ title, price, unit, extra, desc, features, highlight }) => (
  <div className={`p-7 hairline-ink relative ${highlight ? 'bg-bermellon text-paper' : 'bg-ink-2'}`}>
    {highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-claudia text-ink mono-tag !text-[9px] px-3 py-1" style={{ color: '#1a1611' }}>★ MÁS POPULAR</div>}
    <div className="mono-tag" style={{ color: highlight ? '#1a1611' : '#c8462a' }}>{title}</div>
    <div className="flex items-baseline gap-2 mt-3">
      <span className="display text-5xl">{price}</span>
      <span className="mono-tag opacity-80">{unit}</span>
    </div>
    <div className="mono-tag opacity-70 mt-1">{extra}</div>
    <p className={`serif-italic text-base mt-4 leading-snug ${highlight ? 'text-paper/85' : 'text-paper/75'}`}>{desc}</p>
    <ul className="space-y-2 mt-5 hairline-ink-t pt-4" style={{ borderColor: highlight ? 'rgba(241,232,216,0.3)' : undefined }}>
      {features.map((f, i) => (
        <li key={i} className="flex items-start gap-2 mono-tag !text-[10px] !tracking-[0.15em] !normal-case opacity-90">
          <CheckCircle2 size={12} className="shrink-0 mt-0.5" /> {f}
        </li>
      ))}
    </ul>
  </div>
);

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="mono-tag !text-[9px] block mb-2" style={{ color: '#c8462a' }}>{label}</label>
    {children}
  </div>
);
