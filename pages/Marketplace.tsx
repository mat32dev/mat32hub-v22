import React, { useEffect, useState } from 'react';
import { Package, Disc, Truck, MapPin, Mail, Clock, CheckCircle2, ArrowRight, Zap, ShieldCheck, Send, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';

export const Marketplace: React.FC = () => {
  const [isRevealed, setIsRevealed] = useState(false);
  useEffect(() => { setTimeout(() => setIsRevealed(true), 80); }, []);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', platforms: '', volume: '5-20', message: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSending(true); setError(false);
    try {
      await dataService.createInboxMessage({
        type: 'lead',
        sender: form.name,
        email: form.email,
        phone: form.phone || undefined,
        content: `MARKETPLACE 3PL — Plataformas: ${form.platforms || '-'} · Volumen/mes: ${form.volume} · Msg: ${form.message || '-'}`,
        metadata: { ...form, source: 'marketplace-3pl' },
      });
      setSent(true);
    } catch { setError(true); }
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-paper text-ink text-mat-cream pb-24">
      <SEO
        titleKey="Fulfillment de Discos · Envío y Logística Valencia · MAT32 Marketplace"
        descriptionKey="Servicio 3PL de discos en Valencia. Almacenaje, empaquetado y envío para sellers de Discogs, eBay, Wallapop. Embalaje especializado, tarifas negociadas con SEUR y Correos Express. Sin colas en Correos, sin discos rotos."
      />

      {/* HERO */}
      <section className="relative pt-28 md:pt-32 pb-16 border-b border-mat-800 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(234,88,12,0.18),_transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,_rgba(234,88,12,0.10),_transparent_60%)] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10 max-w-5xl">
          <div className={`transition-all duration-1000 ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="inline-flex items-center gap-2 mb-6 text-mat-500 font-black uppercase text-[10px] tracking-[0.5em]">
              <Package size={12} /> 3PL DISCOS · VALENCIA
            </div>
            <h1 className="text-[12vw] sm:text-[8vw] md:text-[7rem] font-black uppercase tracking-tighter text-white font-exo leading-[0.85] mb-6">
              Tú listas. <span className="text-mat-500">Nosotros enviamos.</span>
            </h1>
            <p className="text-gray-300 max-w-3xl text-lg md:text-2xl font-light leading-relaxed mb-10">
              Fulfillment de discos para sellers de Discogs, eBay y Wallapop.
              Almacenamos, empaquetamos y despachamos tus discos. Sin colas en Correos, sin discos rotos.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#contacto" className="px-8 py-4 bg-mat-500 hover:bg-mat-400 text-white text-xs font-black uppercase tracking-[0.3em] rounded-full transition-all active:scale-95">
                SOLICITAR PRESUPUESTO →
              </a>
              <a href="#servicios" className="px-8 py-4 bg-mat-800 border border-mat-700 hover:border-mat-500 text-white text-xs font-black uppercase tracking-[0.3em] rounded-full transition-all">
                VER SERVICIOS
              </a>
            </div>

            {/* Stats strip */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-mat-800">
              <Stat value="48h" label="Tiempo medio de envío" />
              <Stat value="&lt; 0.5%" label="Discos dañados" />
              <Stat value="Ruzafa" label="Tu logística, en el barrio" />
              <Stat value="Discogs" label="Integración directa" />
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-20 bg-mat-950 border-b border-mat-800">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 mb-6 text-mat-500 font-black uppercase text-[10px] tracking-[0.5em]">
            <Clock size={12} /> EL PROBLEMA
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter font-exo leading-none mb-10">
            Vendes bien. <span className="text-gray-500">Enviar te cuesta la vida.</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-gray-400 text-base leading-relaxed">
            <div className="p-6 bg-mat-900 border border-mat-800 rounded-2xl">
              <div className="text-mat-500 font-black text-[10px] uppercase tracking-[0.4em] mb-3">2 HORAS</div>
              <p>Cada sábado en la cola de Correos con 12 sobres bajo el brazo.</p>
            </div>
            <div className="p-6 bg-mat-900 border border-mat-800 rounded-2xl">
              <div className="text-mat-500 font-black text-[10px] uppercase tracking-[0.4em] mb-3">DISCOS ROTOS</div>
              <p>Embalaje genérico, warps, tapas dobladas, bad review en Discogs.</p>
            </div>
            <div className="p-6 bg-mat-900 border border-mat-800 rounded-2xl">
              <div className="text-mat-500 font-black text-[10px] uppercase tracking-[0.4em] mb-3">TARIFAS CARAS</div>
              <p>Tarifa de particular. Sin volumen, sin descuentos, sin negociación.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="servicios" className="py-24 bg-mat-900 border-b border-mat-800">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 mb-4 text-mat-500 font-black uppercase text-[10px] tracking-[0.5em]">
              <Truck size={12} /> CÓMO FUNCIONA
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter font-exo leading-none">
              5 pasos. <span className="text-mat-500">0 visitas a Correos.</span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { n: '01', t: 'ALMACENAJE', d: 'Tu catálogo custodiado en nuestra tienda de Ruzafa. Temperatura controlada, sin luz directa, estantería vertical. Inventario digital accesible 24/7.' },
              { n: '02', t: 'PEDIDO ENTRANTE', d: 'Te llega una venta en Discogs, eBay o Wallapop. La reenvías (o sincronizamos automáticamente con API). Entra en nuestra cola.' },
              { n: '03', t: 'EMPAQUETADO', d: 'Mailer polylined, stiffener LP, esquinas reforzadas, burbuja interior. Embalaje específico para discos, no cajas genéricas.' },
              { n: '04', t: 'ENVÍO', d: 'Tarifas negociadas con SEUR, Correos Express y Packlink. Tracking automático al comprador. Seguro incluido hasta 100€.' },
              { n: '05', t: 'INCIDENCIAS', d: 'Si el paquete se pierde o llega dañado, gestionamos la reclamación con la empresa de transporte y el reembolso.' },
            ].map(s => (
              <div key={s.n} className="flex gap-6 p-6 bg-mat-950 border border-mat-800 rounded-2xl hover:border-mat-500/40 transition-colors">
                <div className="text-6xl font-black text-mat-500 font-exo leading-none shrink-0">{s.n}</div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-wider text-white mb-2">{s.t}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING / PLANS */}
      <section className="py-24 bg-mat-950 border-b border-mat-800">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 mb-4 text-mat-500 font-black uppercase text-[10px] tracking-[0.5em]">
              <Zap size={12} /> PLANES
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter font-exo leading-none">
              Según tu <span className="text-mat-500">volumen.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Plan
              title="DROP & SHIP"
              price="1,50€"
              unit="por envío"
              extra="+ coste transporte"
              desc="Tú empaquetas. Traes los paquetes listos, nosotros los despachamos con nuestras tarifas."
              features={['Sin almacenaje', 'Tarifas negociadas', 'Tracking automático', 'Pago quincenal']}
            />
            <Plan
              title="PACK & SHIP"
              price="3,50€"
              unit="por paquete"
              extra="+ coste transporte"
              desc="Tú nos das los discos. Nosotros empaquetamos con material específico y enviamos."
              features={['Mailer polylined incluido', 'Stiffener LP', 'Foto de empaquetado', 'Seguro hasta 100€']}
              highlight
            />
            <Plan
              title="FULL STACK"
              price="12%"
              unit="sobre venta"
              extra="sin mensualidad"
              desc="Nosotros listamos, gradeamos, fotografiamos y enviamos. Tú seleccionas y cobras."
              features={['Listing en Discogs/eBay', 'Grading profesional', 'Fotografía alta res', 'Gestión de devoluciones']}
            />
          </div>

          <p className="text-center text-gray-500 text-xs mt-12 max-w-2xl mx-auto leading-relaxed">
            Almacenaje incluido hasta 500 unidades. Volumen mayor o especial (cajas, BoxSets, singles) se cotiza aparte.
            Todos los planes incluyen integración con Discogs para sincronizar stock y precios.
          </p>
        </div>
      </section>

      {/* WHY MAT32 */}
      <section className="py-20 bg-mat-900 border-b border-mat-800">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-4 text-mat-500 font-black uppercase text-[10px] tracking-[0.5em]">
                <Disc size={12} /> POR QUÉ MAT32
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter font-exo leading-tight mb-6">
                No somos un <span className="text-mat-500">almacén genérico.</span>
              </h2>
              <p className="text-gray-400 text-base leading-relaxed mb-8">
                Somos una tienda de discos de Ruzafa. Llevamos años vendiendo, empaquetando y enviando.
                Conocemos los vicios del formato: los warps, los splits, los seam splits, los 7" que necesitan sobre rígido.
                Nuestro embalaje está calibrado para eso.
              </p>
            </div>
            <div className="space-y-3">
              {[
                { i: ShieldCheck, t: 'Especialistas en discos', d: 'Más de una década empaquetando LPs, 12", 7", BoxSets.' },
                { i: MapPin, t: 'Ruzafa, Valencia', d: 'Ven a vernos. Trae la caja, firma y te vas.' },
                { i: Package, t: 'Material profesional', d: 'Mailers polylined, stiffeners, separadores, reforzadores.' },
                { i: Truck, t: 'Tarifas B2B', d: 'Acuerdos con SEUR, Correos Express, Packlink.' },
              ].map((x, i) => {
                const Icon = x.i;
                return (
                  <div key={i} className="flex items-start gap-4 p-4 bg-mat-950 border border-mat-800 rounded-xl">
                    <Icon className="w-6 h-6 text-mat-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-black text-white uppercase tracking-wider">{x.t}</div>
                      <div className="text-[12px] text-gray-500 mt-0.5 leading-relaxed">{x.d}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCIA / CREDIBILIDAD */}
      <section className="py-20 bg-mat-950 border-b border-mat-800 overflow-hidden">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-[minmax(340px,460px)_1fr] gap-10 md:gap-16 items-center">
            {/* Portrait con tratamiento duotono */}
            <div className="relative mx-auto md:mx-0 w-full max-w-[460px] aspect-[4/5] rounded-3xl overflow-hidden group bg-gradient-to-br from-mat-800 via-mat-900 to-black">
              {/* Imagen base — desaturada */}
              <img
                src="/team/founder.jpg"
                alt="Experiencia MAT32"
                className="relative z-10 w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.03]"
                style={{ filter: 'grayscale(100%) contrast(1.08) brightness(0.92)' }}
              />
              {/* Tinte naranja MAT32 */}
              <div className="absolute inset-0 z-20 bg-mat-500 mix-blend-color opacity-60 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none" />
              {/* Vignette abajo */}
              <div className="absolute inset-0 z-30 bg-gradient-to-t from-mat-950/80 via-transparent to-transparent pointer-events-none" />
              {/* Ring border */}
              <div className="absolute inset-0 z-40 rounded-3xl ring-1 ring-mat-500/30 pointer-events-none" />
              {/* Label */}
              <div className="absolute bottom-4 left-4 right-4 z-50 text-[9px] font-black uppercase tracking-[0.4em] text-mat-500">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-mat-500 animate-pulse" />
                  RARETRAXXX+ · MAT32
                </div>
              </div>
            </div>

            {/* Copy */}
            <div>
              <div className="inline-flex items-center gap-2 mb-4 text-mat-500 font-black uppercase text-[10px] tracking-[0.5em]">
                <ShieldCheck size={12} /> EXPERIENCIA
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter font-exo leading-[0.95] mb-6">
                Años de experiencia <span className="text-mat-500">como comprador y vendedor</span> nos avalan.
              </h2>
              <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-6">
                No somos un intermediario. Hemos estado al otro lado del mostrador: en cabinas, en ferias internacionales,
                en foros de Discogs, en cajas de estanterías rescatando rarezas. Conocemos cómo se empaqueta, se gradúa y se envía
                un disco que llega perfecto. Y cómo se valora una colección sin chapotear en el regateo.
              </p>
              <p className="text-gray-500 text-sm leading-relaxed italic">
                Tu colección va a estar en manos de alguien que, en otra vida, la habría querido comprar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA / CONTACT FORM */}
      <section id="contacto" className="py-24">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-4 text-mat-500 font-black uppercase text-[10px] tracking-[0.5em]">
              <Mail size={12} /> SOLICITA PRESUPUESTO
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter font-exo leading-none mb-4">
              Cuéntanos <span className="text-mat-500">tu caso.</span>
            </h2>
            <p className="text-gray-400 text-base">Te contestamos en 24h con un presupuesto adaptado.</p>
          </div>

          {sent ? (
            <div className="p-10 bg-green-500/10 border-2 border-green-500/40 rounded-3xl text-center space-y-3">
              <CheckCircle2 className="w-14 h-14 text-green-400 mx-auto" />
              <h3 className="text-2xl font-black uppercase text-white font-exo">Recibido.</h3>
              <p className="text-gray-400">Te escribimos a <b className="text-white">{form.email}</b> en menos de 24h.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="p-8 bg-mat-950 border border-mat-800 rounded-3xl space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  <AlertCircle size={14} /> Algo ha fallado. Prueba otra vez o escríbenos a hola@mat32.com.
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Nombre *">
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input" />
                </Field>
                <Field label="Email *">
                  <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input" />
                </Field>
              </div>

              <Field label="Teléfono">
                <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="input" />
              </Field>

              <Field label="¿Dónde vendes? (Discogs, eBay, Wallapop...)">
                <input value={form.platforms} onChange={e => setForm({ ...form, platforms: e.target.value })} className="input" placeholder="Ej: Discogs (user: xxx), Wallapop" />
              </Field>

              <Field label="Volumen estimado / mes">
                <div className="grid grid-cols-4 gap-2">
                  {['1-5', '5-20', '20-50', '50+'].map(v => (
                    <button key={v} type="button" onClick={() => setForm({ ...form, volume: v })}
                      className={`py-2.5 text-xs font-black uppercase tracking-wider rounded-lg border transition-all ${form.volume === v ? 'bg-mat-500 text-white border-mat-500' : 'bg-mat-900 text-gray-400 border-mat-800 hover:border-mat-700'}`}>{v}</button>
                  ))}
                </div>
              </Field>

              <Field label="Cuéntanos más (opcional)">
                <textarea rows={3} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Colección, necesidades especiales, preguntas..."
                  className="input" />
              </Field>

              <button type="submit" disabled={sending}
                className="w-full py-4 bg-mat-500 hover:bg-mat-400 disabled:opacity-50 text-white text-xs font-black uppercase tracking-[0.4em] rounded-full flex items-center justify-center gap-2">
                {sending ? <><Loader2 size={14} className="animate-spin" /> ENVIANDO...</> : <><Send size={14} /> ENVIAR SOLICITUD</>}
              </button>

              <p className="text-center text-[10px] text-gray-600 uppercase tracking-widest">
                Sin spam · Respuesta en 24h · Datos tratados según <Link to="/legal/privacidad" className="text-mat-500 underline">nuestra política</Link>
              </p>
            </form>
          )}

          <div className="mt-8 text-center text-[11px] text-gray-500">
            ¿Prefieres email directo? <a href="mailto:hola@mat32.com" className="text-mat-500 underline">hola@mat32.com</a>
          </div>
        </div>
      </section>

      <style>{`.input { width: 100%; background: #0c0a09; border: 1px solid #292524; border-radius: 12px; padding: 10px 14px; color: white; font-size: 14px; outline: none; transition: border-color 0.2s; }
      .input:focus { border-color: #ea580c; }`}</style>
    </div>
  );
};

const Stat: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div>
    <div className="text-3xl md:text-4xl font-black text-mat-500 font-exo" dangerouslySetInnerHTML={{ __html: value }} />
    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">{label}</div>
  </div>
);

const Plan: React.FC<{ title: string; price: string; unit: string; extra: string; desc: string; features: string[]; highlight?: boolean }> = ({ title, price, unit, extra, desc, features, highlight }) => (
  <div className={`p-8 rounded-3xl border-2 transition-all ${highlight ? 'bg-gradient-to-br from-mat-500/20 via-mat-800/40 to-mat-900 border-mat-500 scale-105' : 'bg-mat-900 border-mat-800 hover:border-mat-700'}`}>
    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-mat-500 mb-3">{title}</div>
    <div className="flex items-baseline gap-2 mb-1">
      <span className="text-5xl font-black text-white font-exo">{price}</span>
      <span className="text-xs text-gray-400">{unit}</span>
    </div>
    <div className="text-[11px] text-gray-500 mb-6">{extra}</div>
    <p className="text-sm text-gray-300 leading-relaxed mb-6">{desc}</p>
    <ul className="space-y-2">
      {features.map((f, i) => (
        <li key={i} className="flex items-start gap-2 text-[13px] text-gray-400">
          <CheckCircle2 size={14} className="text-mat-500 shrink-0 mt-0.5" /> {f}
        </li>
      ))}
    </ul>
    {highlight && <div className="mt-6 text-center text-[10px] font-black text-mat-500 uppercase tracking-widest">★ MÁS POPULAR ★</div>}
  </div>
);

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">{label}</label>
    {children}
  </div>
);
