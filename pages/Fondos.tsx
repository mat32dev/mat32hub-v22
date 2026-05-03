import React, { useEffect, useState } from 'react';
import { Loader2, Instagram, Tag, MapPin, Mail, X, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';

interface Item {
  id: number;
  external_url: string | null;
  title: string | null;
  price_cents: number | null;
  original_price_cents?: number | null;
  currency: string;
  category: string | null;
  image_url: string | null;
  tags: string[];
  featured: boolean;
  published_at: string | null;
}

const fmtEur = (cents: number | null | undefined) => {
  if (cents == null) return null;
  return `${(cents / 100).toFixed(2).replace('.', ',')}€`;
};

const discountPct = (priceCents: number | null | undefined, origCents: number | null | undefined) => {
  if (!priceCents || !origCents || origCents <= priceCents) return null;
  return Math.round((1 - priceCents / origCents) * 100);
};

export const Fondos: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [cats, setCats] = useState<{ category: string; n: number }[]>([]);
  const [active, setActive] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [inquiryItem, setInquiryItem] = useState<Item | null>(null);

  const load = async (cat = active) => {
    setLoading(true);
    try {
      const [it, cs] = await Promise.all([
        dataService.getFondosPublic(cat === 'all' ? undefined : cat),
        dataService.getFondosCategories(),
      ]);
      setItems(it);
      setCats(cs);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(active); }, [active]);

  const total = cats.reduce((s, c) => s + Number(c.n), 0);

  return (
    <div className="min-h-screen bg-paper text-ink text-mat-cream pb-24">
      <SEO
        titleKey="Fondos Reservados · Deco, Mobiliario y Diseño Industrial Valenciano · MAT32"
        descriptionKey="Piezas únicas que pasan por el local. Deco, mobiliario, objetos del rastro y diseño industrial valenciano. Curado por @bruscabo y @jpujante__ en Ruzafa, Valencia."
      />

      {/* HERO */}
      <section className="relative pt-28 md:pt-32 pb-10 border-b border-mat-800 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(234,88,12,0.18),_transparent_60%)] pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10 max-w-5xl">
          <div className="inline-flex items-center gap-2 mb-6 text-mat-500 font-black uppercase text-[10px] tracking-[0.5em]">
            <Tag size={12} /> MAT32 OBJECTS
          </div>
          <h1 className="text-[12vw] sm:text-[9vw] md:text-[8rem] font-black uppercase tracking-tighter text-white font-exo leading-[0.85] mb-4">
            Fondos <span className="text-mat-500">reservados.</span>
          </h1>
          <p className="text-gray-300 max-w-3xl text-lg md:text-xl font-light leading-relaxed mb-4">
            Piezas que pasan por el local. Deco, mobiliario, objetos del rastro, diseño industrial valenciano.
          </p>
          <p className="text-gray-500 text-sm md:text-base font-light">
            Curado por{' '}
            <a href="https://www.instagram.com/bruscabo/" target="_blank" rel="noopener" className="text-mat-500 hover:text-white font-bold">@bruscabo</a>
            {' & '}
            <a href="https://www.instagram.com/jpujante__/" target="_blank" rel="noopener" className="text-mat-500 hover:text-white font-bold">@jpujante__</a>
          </p>
        </div>
      </section>

      {/* Almacén — invitación a cita previa */}
      <section className="bg-mat-950 border-b border-mat-800">
        <div className="container mx-auto px-0 md:px-6 max-w-6xl">
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-0 md:gap-10 items-stretch">
            <figure className="relative md:rounded-3xl md:my-10 bg-mat-950 overflow-hidden">
              <img
                src="/fondos-almacen.jpg"
                alt="Almacén MAT32 · Ruzafa"
                loading="lazy"
                className="block w-full h-auto"
              />
              <figcaption className="absolute bottom-3 left-4 right-4 text-[9px] font-black text-white/85 uppercase tracking-[0.4em] mix-blend-difference">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-mat-500 animate-pulse" />
                  EL ALMACÉN · RUZAFA
                </span>
              </figcaption>
            </figure>

            <div className="p-8 md:p-10 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 mb-4 text-mat-500 font-black uppercase text-[10px] tracking-[0.5em]">
                <MapPin size={12} /> CITA PREVIA
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase font-exo tracking-tight leading-tight mb-5">
                Muchas piezas <span className="text-mat-500">no están fuera.</span>
              </h2>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-4">
                En nuestro almacén de Ruzafa tenemos mobiliario, iluminación y discos que no exponemos en el local.
                Si buscas algo concreto o quieres ver más de lo que está en la web, pasa a verlo con <b className="text-white">cita previa</b>.
              </p>
              <p className="text-gray-500 text-sm mb-6">
                Escríbenos y te abrimos un hueco entre semana.
              </p>
              <div className="flex gap-3 flex-wrap">
                <a href="mailto:hola@mat32.com?subject=Cita%20previa%20almac%C3%A9n%20MAT32"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-mat-500 hover:bg-mat-400 text-white text-xs font-black uppercase tracking-[0.3em] rounded-full">
                  <Mail size={14} /> PEDIR CITA
                </a>
                <a href="https://www.instagram.com/bruscabo/" target="_blank" rel="noopener"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-mat-800 border border-mat-700 hover:border-mat-500 text-white text-xs font-black uppercase tracking-[0.3em] rounded-full">
                  <Instagram size={14} /> DM
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-mat-800 py-6 sticky top-20 bg-mat-900/80 backdrop-blur-md z-30">
        <div className="container mx-auto px-6 flex items-center gap-2 overflow-x-auto">
          <button onClick={() => setActive('all')}
            className={`shrink-0 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${active === 'all' ? 'bg-mat-500 text-white' : 'bg-mat-800 text-gray-400 hover:text-white'}`}>
            Todo <span className="opacity-60 ml-1">({total})</span>
          </button>
          {cats.map(c => (
            <button key={c.category} onClick={() => setActive(c.category)}
              className={`shrink-0 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${active === c.category ? 'bg-mat-500 text-white' : 'bg-mat-800 text-gray-400 hover:text-white'}`}>
              {c.category} <span className="opacity-60 ml-1">({c.n})</span>
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="container mx-auto px-6 py-10 max-w-7xl">
        {loading ? (
          <div className="py-20 text-center"><Loader2 className="animate-spin text-mat-500 w-8 h-8 mx-auto" /></div>
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {items.map(it => <Card key={it.id} item={it} onOpen={() => setInquiryItem(it)} />)}
          </div>
        )}
      </section>

      {/* Location CTA */}
      <section className="py-20 bg-mat-950 border-t border-mat-800">
        <div className="container mx-auto px-6 max-w-3xl text-center space-y-5">
          <div className="inline-flex items-center gap-2 text-mat-500 font-black uppercase text-[10px] tracking-[0.5em]">
            <MapPin size={12} /> VEN A VERLAS
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase font-exo tracking-tight leading-tight">
            Las piezas se pueden <span className="text-mat-500">ver y comprar</span> en el local.
          </h2>
          <p className="text-gray-400">C/ Matías Perelló 32, Ruzafa. También enviamos a península por mensajería con embalaje propio. Reserva por web, DM o email.</p>
          <div className="flex gap-3 flex-wrap justify-center pt-2">
            <a href="mailto:hola@mat32.com" className="px-8 py-3 bg-mat-500 hover:bg-mat-400 text-white text-xs font-black uppercase tracking-[0.3em] rounded-full flex items-center gap-2">
              <Mail size={14} /> HOLA@MAT32.COM
            </a>
            <a href="https://www.instagram.com/bruscabo/" target="_blank" rel="noopener"
              className="px-8 py-3 bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white text-xs font-black uppercase tracking-[0.3em] rounded-full flex items-center gap-2">
              <Instagram size={14} /> @BRUSCABO
            </a>
          </div>
        </div>
      </section>

      {inquiryItem && <InquiryModal item={inquiryItem} onClose={() => setInquiryItem(null)} />}
    </div>
  );
};

const Card: React.FC<{ item: Item; onOpen: () => void }> = ({ item, onOpen }) => {
  const price = fmtEur(item.price_cents) || 'Consultar';
  const original = fmtEur(item.original_price_cents);
  const pct = discountPct(item.price_cents, item.original_price_cents);
  return (
    <button onClick={onOpen}
      className="group relative bg-mat-950 border border-mat-800 rounded-2xl overflow-hidden hover:border-mat-500/50 transition-all text-left active:scale-[0.99]">
      <div className="relative aspect-square bg-mat-800 overflow-hidden">
        {item.image_url ? (
          <img src={item.image_url} alt={item.title || 'Pieza'} loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-600">
            <Tag size={28} />
          </div>
        )}
        {item.featured && (
          <span className="absolute top-2 left-2 text-[8px] font-black text-black bg-mat-500 px-2 py-1 rounded-md uppercase tracking-widest">★ Destacado</span>
        )}
        {pct != null && (
          <span className="absolute top-2 right-2 text-[9px] font-black text-white bg-red-600 px-2 py-1 rounded-md uppercase tracking-widest shadow-lg">
            −{pct}%
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-[10px] font-black text-white uppercase tracking-widest border border-white/40 px-3 py-1 rounded-full">RESERVAR →</span>
        </div>
      </div>
      <div className="p-3 space-y-1">
        {item.category && <div className="text-[9px] font-black text-mat-500 uppercase tracking-widest">{item.category}</div>}
        <div className="text-xs text-white font-bold leading-tight line-clamp-2">
          {item.title || 'Sin título'}
        </div>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-sm font-black text-mat-500 tabular-nums">{price}</span>
          {original && pct != null && (
            <span className="text-[11px] text-gray-500 line-through tabular-nums">{original}</span>
          )}
        </div>
      </div>
    </button>
  );
};

const InquiryModal: React.FC<{ item: Item; onClose: () => void }> = ({ item, onClose }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', delivery: 'pickup' as 'pickup' | 'shipping' });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setBusy(true); setError(false);
    try {
      const priceTxt = item.price_cents != null ? `${(item.price_cents/100).toFixed(2)}€` : 'Consultar';
      await dataService.createInboxMessage({
        type: 'lead',
        sender: form.name,
        email: form.email,
        phone: form.phone || undefined,
        content: `FONDOS RESERVADOS — Pieza: "${item.title}" (${priceTxt}) · Entrega: ${form.delivery === 'pickup' ? 'Recoger en local' : 'Envío'} · Mensaje: ${form.message || '-'}`,
        metadata: {
          source: 'fondos-reservados',
          item_id: item.id,
          item_title: item.title,
          item_price_cents: item.price_cents,
          item_category: item.category,
          item_image: item.image_url,
          item_external_url: item.external_url,
          delivery: form.delivery,
        },
      });
      setDone(true);
    } catch { setError(true); }
    setBusy(false);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-mat-900 border border-mat-800 rounded-3xl shadow-2xl custom-scrollbar" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-mat-800 hover:bg-mat-700 rounded-full text-gray-400 hover:text-white"><X size={18} /></button>

        {done ? (
          <div className="p-10 text-center space-y-3">
            <CheckCircle2 className="w-16 h-16 text-mat-500 mx-auto" />
            <h3 className="text-3xl font-black uppercase text-white font-exo">Recibido.</h3>
            <p className="text-gray-400">Te respondemos a <b className="text-white">{form.email}</b> con disponibilidad y siguientes pasos.</p>
            <button onClick={onClose} className="mt-3 px-8 py-3 bg-mat-500 hover:bg-mat-400 text-white text-xs font-black uppercase tracking-[0.3em] rounded-full">Cerrar</button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2">
            {/* Imagen */}
            <div className="relative aspect-square md:aspect-auto bg-mat-800 overflow-hidden">
              {item.image_url ? (
                <img src={item.image_url} alt={item.title || ''} className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-600"><Tag size={40} /></div>
              )}
            </div>

            {/* Form */}
            <div className="p-6 md:p-7 flex flex-col">
              <div className="mb-4">
                {item.category && <div className="text-[10px] font-black text-mat-500 uppercase tracking-[0.4em] mb-1">{item.category}</div>}
                <h2 className="text-xl md:text-2xl font-black uppercase text-white font-exo leading-tight tracking-tight mb-2">{item.title || 'Pieza sin título'}</h2>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <div className="text-3xl font-black text-mat-500 font-exo tabular-nums">
                    {fmtEur(item.price_cents) || 'Consultar precio'}
                  </div>
                  {(() => {
                    const o = fmtEur(item.original_price_cents);
                    const p = discountPct(item.price_cents, item.original_price_cents);
                    return o && p != null ? (
                      <>
                        <span className="text-lg text-gray-500 line-through tabular-nums">{o}</span>
                        <span className="text-[10px] font-black text-white bg-red-600 px-2 py-1 rounded uppercase tracking-widest">−{p}%</span>
                      </>
                    ) : null;
                  })()}
                </div>
              </div>

              <form onSubmit={submit} className="space-y-3">
                {error && (
                  <div className="flex items-center gap-2 p-2.5 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs">
                    <AlertCircle size={12} /> Error al enviar. Prueba otra vez o escríbenos a hola@mat32.com.
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-1.5">Entrega</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { k: 'pickup', l: 'Recogida local' },
                      { k: 'shipping', l: 'Envío' },
                    ].map(o => (
                      <button key={o.k} type="button" onClick={() => setForm({ ...form, delivery: o.k as any })}
                        className={`p-2 text-[11px] font-black uppercase tracking-wider rounded-lg border transition-all ${form.delivery === o.k ? 'bg-mat-500 text-white border-mat-500' : 'bg-mat-950 text-gray-400 border-mat-800 hover:border-mat-700'}`}>{o.l}</button>
                    ))}
                  </div>
                </div>

                <Input label="Nombre *" value={form.name} onChange={v => setForm({ ...form, name: v })} required />
                <Input label="Email *" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} required />
                <Input label="Teléfono" type="tel" value={form.phone} onChange={v => setForm({ ...form, phone: v })} />

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-1.5">Mensaje (opcional)</label>
                  <textarea rows={2} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="¿Quieres más fotos, medidas, condiciones?" className="w-full bg-mat-950 border border-mat-800 rounded-xl px-3 py-2 text-white text-sm focus:border-mat-500 outline-none" />
                </div>

                <button type="submit" disabled={busy}
                  className="w-full py-3.5 bg-mat-500 hover:bg-mat-400 disabled:opacity-50 text-white text-xs font-black uppercase tracking-[0.4em] rounded-full flex items-center justify-center gap-2 mt-2">
                  {busy ? <><Loader2 size={14} className="animate-spin" /> ENVIANDO...</> : <><Send size={14} /> RESERVAR PIEZA</>}
                </button>
                <p className="text-center text-[10px] text-gray-600 uppercase tracking-widest">Te confirmamos disponibilidad en menos de 24h</p>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Input: React.FC<{ label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }> = ({ label, value, onChange, type = 'text', required }) => (
  <div>
    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-1.5">{label}</label>
    <input type={type} required={required} value={value} onChange={e => onChange(e.target.value)}
      className="w-full bg-mat-950 border border-mat-800 rounded-xl px-3 py-2 text-white text-sm focus:border-mat-500 outline-none" />
  </div>
);

const EmptyState: React.FC = () => (
  <div className="py-20 text-center text-gray-500">
    <Tag className="w-14 h-14 mx-auto opacity-20 mb-4" />
    <p className="text-lg font-bold mb-2">Aún no hay piezas publicadas</p>
    <p className="text-sm">Próximamente — seguimos curando.</p>
    <a href="https://www.instagram.com/bruscabo/" target="_blank" rel="noopener"
      className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-mat-800 border border-mat-700 hover:border-mat-500 text-white text-xs font-black uppercase tracking-[0.3em] rounded-full">
      <Instagram size={14} /> Seguir en Instagram
    </a>
  </div>
);
