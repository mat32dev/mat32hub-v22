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

const fmtEur = (cents: number | null | undefined) => cents == null ? null : `${(cents / 100).toFixed(2).replace('.', ',')}€`;
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

  useEffect(() => {
    document.body.classList.add('theme-paper');
    return () => { document.body.classList.remove('theme-paper'); };
  }, []);

  const load = async (cat = active) => {
    setLoading(true);
    try {
      const [it, cs] = await Promise.all([
        dataService.getFondosPublic(cat === 'all' ? undefined : cat),
        dataService.getFondosCategories(),
      ]);
      setItems(it); setCats(cs);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(active); }, [active]);
  const total = cats.reduce((s, c) => s + Number(c.n), 0);

  return (
    <div className="min-h-screen bg-paper text-ink pb-24 grain">
      <SEO
        titleKey="Fondos Reservados · Deco, Mobiliario y Diseño Industrial · MAT32"
        descriptionKey="Piezas únicas que pasan por el local. Deco, mobiliario, objetos del rastro y diseño industrial valenciano. Curado por @bruscabo y @jpujante__ en Ruzafa."
      />

      {/* HERO */}
      <section className="container mx-auto px-6 md:px-10 pt-12 md:pt-16 pb-10 hairline-b">
        <div className="mono-tag flex items-center gap-2" style={{ color: '#c8462a' }}>
          <Tag size={12} /> MAT32 OBJECTS
        </div>
        <h1 className="display mt-3" style={{ fontSize: 'clamp(54px, 9vw, 132px)', lineHeight: 0.85 }}>
          Fondos<br/><span style={{ color: '#c8462a' }}>reservados.</span>
        </h1>
        <p className="serif-italic text-2xl text-ink-soft mt-5 max-w-3xl leading-snug">
          Piezas que pasan por el local. Deco, mobiliario, objetos del rastro, diseño industrial valenciano.
        </p>
        <p className="serif-italic text-ink-soft text-base mt-3">
          Curado por{' '}
          <a href="https://www.instagram.com/bruscabo/" target="_blank" rel="noopener" className="not-italic font-bold hover:text-ink transition-colors" style={{ color: '#c8462a' }}>@bruscabo</a>
          {' & '}
          <a href="https://www.instagram.com/jpujante__/" target="_blank" rel="noopener" className="not-italic font-bold hover:text-ink transition-colors" style={{ color: '#c8462a' }}>@jpujante__</a>
        </p>
      </section>

      {/* ALMACÉN · CITA PREVIA */}
      <section className="bg-paper-2 hairline-b">
        <div className="container mx-auto px-0 md:px-10 max-w-6xl">
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-0 md:gap-8 items-stretch">
            <figure className="relative md:my-10 hairline overflow-hidden bg-ink">
              <img src="/fondos-almacen.jpg" alt="Almacén MAT32 · Ruzafa" loading="lazy" className="block w-full h-auto" />
              <figcaption className="absolute bottom-3 left-4 right-4 mono-tag !text-[9px]" style={{ color: '#d8ff5a' }}>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#d8ff5a' }} />
                  EL ALMACÉN · RUZAFA
                </span>
              </figcaption>
            </figure>

            <div className="p-8 md:p-10 flex flex-col justify-center">
              <div className="mono-tag flex items-center gap-2" style={{ color: '#c8462a' }}>
                <MapPin size={12} /> CITA PREVIA
              </div>
              <h2 className="display mt-3" style={{ fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 0.95 }}>
                Muchas piezas <span style={{ color: '#c8462a' }}>no están fuera.</span>
              </h2>
              <p className="serif-italic text-ink-soft text-lg mt-5 leading-snug">
                En nuestro almacén de Ruzafa tenemos mobiliario, iluminación y discos que no exponemos en el local. Si buscas algo concreto, pasa a verlo con <b className="text-ink not-italic">cita previa</b>.
              </p>
              <p className="serif-italic text-ink-soft text-sm mt-2">
                Escríbenos y te abrimos un hueco entre semana.
              </p>
              <div className="flex gap-2 flex-wrap mt-6">
                <a href="mailto:hola@mat32.com?subject=Cita%20previa%20almac%C3%A9n%20MAT32"
                  className="inline-flex items-center gap-2 bg-bermellon text-paper px-5 py-3 mono-tag hover:bg-ink transition-colors">
                  <Mail size={12} /> PEDIR CITA
                </a>
                <a href="https://www.instagram.com/bruscabo/" target="_blank" rel="noopener"
                  className="inline-flex items-center gap-2 hairline px-5 py-3 mono-tag hover:bg-ink hover:text-paper transition-colors">
                  <Instagram size={12} /> DM
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <section className="hairline-b py-4 sticky top-14 sm:top-16 bg-paper z-30">
        <div className="container mx-auto px-6 md:px-10 flex items-center gap-2 overflow-x-auto">
          <button onClick={() => setActive('all')}
            className={`shrink-0 px-3 py-2 mono-tag !text-[10px] transition-colors ${active === 'all' ? 'bg-bermellon text-paper' : 'hairline hover:bg-ink hover:text-paper'}`}>
            TODO <span className="opacity-60 ml-1">({total})</span>
          </button>
          {cats.map(c => (
            <button key={c.category} onClick={() => setActive(c.category)}
              className={`shrink-0 px-3 py-2 mono-tag !text-[10px] transition-colors ${active === c.category ? 'bg-bermellon text-paper' : 'hairline hover:bg-ink hover:text-paper'}`}>
              {c.category.toUpperCase()} <span className="opacity-60 ml-1">({c.n})</span>
            </button>
          ))}
        </div>
      </section>

      {/* GRID */}
      <section className="container mx-auto px-6 md:px-10 py-10 max-w-7xl">
        {loading ? (
          <div className="py-20 text-center"><Loader2 className="animate-spin text-bermellon w-8 h-8 mx-auto" /></div>
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {items.map(it => <Card key={it.id} item={it} onOpen={() => setInquiryItem(it)} />)}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-ink text-paper hairline-b">
        <div className="container mx-auto px-6 md:px-10 py-16 md:py-20 max-w-3xl text-center">
          <div className="mono-tag flex items-center gap-2 justify-center" style={{ color: '#d8ff5a' }}>
            <MapPin size={12} /> VEN A VERLAS
          </div>
          <h2 className="display mt-3" style={{ fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 0.9 }}>
            Las piezas se pueden <span style={{ color: '#c8462a' }}>ver y comprar</span> en el local.
          </h2>
          <p className="serif-italic text-paper/70 text-lg mt-5 leading-snug">
            C/ Matías Perelló 32, Ruzafa. También enviamos a península por mensajería con embalaje propio. Reserva por web, DM o email.
          </p>
          <div className="flex gap-2 flex-wrap justify-center mt-8">
            <a href="mailto:hola@mat32.com" className="bg-bermellon text-paper px-5 py-3 mono-tag hover:bg-paper hover:text-ink transition-colors flex items-center gap-2">
              <Mail size={12} /> HOLA@MAT32.COM
            </a>
            <a href="https://www.instagram.com/bruscabo/" target="_blank" rel="noopener"
              className="hairline-ink px-5 py-3 mono-tag hover:bg-paper hover:text-ink transition-colors flex items-center gap-2">
              <Instagram size={12} /> @BRUSCABO
            </a>
          </div>
        </div>
      </section>

      {inquiryItem && <InquiryModal item={inquiryItem} onClose={() => setInquiryItem(null)} />}
    </div>
  );
};

const Card: React.FC<{ item: Item; onOpen: () => void }> = ({ item, onOpen }) => {
  const price = fmtEur(item.price_cents) || 'CONSULTAR';
  const original = fmtEur(item.original_price_cents);
  const pct = discountPct(item.price_cents, item.original_price_cents);
  return (
    <button onClick={onOpen}
      className="group hairline overflow-hidden bg-paper hover:bg-ink hover:text-paper transition-colors text-left">
      <div className="relative aspect-square bg-paper-2 overflow-hidden">
        {item.image_url ? (
          <img src={item.image_url} alt={item.title || 'Pieza'} loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-ink-soft">
            <Tag size={28} />
          </div>
        )}
        {item.featured && (
          <span className="absolute top-2 left-2 mono-tag !text-[9px] bg-claudia px-2 py-1" style={{ color: '#1a1611' }}>★ DESTACADO</span>
        )}
        {pct != null && (
          <span className="absolute top-2 right-2 mono-tag !text-[9px] bg-bermellon text-paper px-2 py-1">−{pct}%</span>
        )}
        <div className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="mono-tag bg-bermellon text-paper px-3 py-1.5">RESERVAR →</span>
        </div>
      </div>
      <div className="p-3 space-y-1">
        {item.category && <div className="mono-tag !text-[9px]" style={{ color: '#c8462a' }}>{item.category.toUpperCase()}</div>}
        <div className="display text-sm leading-tight line-clamp-2">{item.title || 'Sin título'}</div>
        <div className="flex items-baseline gap-2 flex-wrap pt-1">
          <span className="display text-base tabular-nums" style={{ color: '#c8462a' }}>{price}</span>
          {original && pct != null && (
            <span className="serif-italic text-ink-soft text-sm line-through tabular-nums">{original}</span>
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
      const priceTxt = item.price_cents != null ? `${(item.price_cents / 100).toFixed(2)}€` : 'Consultar';
      await dataService.createInboxMessage({
        type: 'lead',
        sender: form.name, email: form.email, phone: form.phone || undefined,
        content: `FONDOS RESERVADOS — Pieza: "${item.title}" (${priceTxt}) · Entrega: ${form.delivery === 'pickup' ? 'Recoger en local' : 'Envío'} · Mensaje: ${form.message || '-'}`,
        metadata: {
          source: 'fondos-reservados', item_id: item.id, item_title: item.title,
          item_price_cents: item.price_cents, item_category: item.category,
          item_image: item.image_url, item_external_url: item.external_url,
          delivery: form.delivery,
        } as any,
      });
      setDone(true);
    } catch { setError(true); }
    setBusy(false);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-ink/85 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-paper text-ink hairline custom-scrollbar" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 z-10 p-2 hairline bg-paper hover:bg-ink hover:text-paper transition-colors"><X size={16} /></button>

        {done ? (
          <div className="p-10 text-center">
            <CheckCircle2 className="w-14 h-14 text-bermellon mx-auto mb-4" />
            <h3 className="display text-3xl">Recibido.</h3>
            <p className="serif-italic text-ink-soft text-lg mt-2">Te respondemos a <b className="text-ink not-italic">{form.email}</b> con disponibilidad.</p>
            <button onClick={onClose} className="mt-6 hairline px-6 py-3 mono-tag hover:bg-ink hover:text-paper transition-colors">CERRAR</button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2">
            <div className="relative aspect-square md:aspect-auto bg-paper-2 overflow-hidden hairline-r">
              {item.image_url ? (
                <img src={item.image_url} alt={item.title || ''} className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-ink-soft"><Tag size={40} /></div>
              )}
            </div>

            <div className="p-6 md:p-7 flex flex-col">
              <div className="mb-5">
                {item.category && <div className="mono-tag" style={{ color: '#c8462a' }}>{item.category.toUpperCase()}</div>}
                <h2 className="display text-2xl mt-2 leading-tight">{item.title || 'Pieza sin título'}</h2>
                <div className="flex items-baseline gap-3 flex-wrap mt-3">
                  <div className="display text-3xl tabular-nums" style={{ color: '#c8462a' }}>{fmtEur(item.price_cents) || 'Consultar'}</div>
                  {(() => {
                    const o = fmtEur(item.original_price_cents);
                    const p = discountPct(item.price_cents, item.original_price_cents);
                    return o && p != null ? (
                      <>
                        <span className="serif-italic text-ink-soft text-base line-through tabular-nums">{o}</span>
                        <span className="mono-tag !text-[10px] bg-bermellon text-paper px-2 py-1">−{p}%</span>
                      </>
                    ) : null;
                  })()}
                </div>
              </div>

              <form onSubmit={submit} className="space-y-3">
                {error && (
                  <div className="flex items-center gap-2 p-2 hairline mono-tag !text-[10px]" style={{ color: '#c8462a' }}>
                    <AlertCircle size={12} /> ERROR. PRUEBA OTRA VEZ.
                  </div>
                )}

                <div>
                  <label className="mono-tag !text-[9px] block mb-1.5" style={{ color: '#c8462a' }}>ENTREGA</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[{ k: 'pickup', l: 'RECOGIDA LOCAL' }, { k: 'shipping', l: 'ENVÍO' }].map(o => (
                      <button key={o.k} type="button" onClick={() => setForm({ ...form, delivery: o.k as any })}
                        className={`p-2 mono-tag !text-[10px] transition-colors ${form.delivery === o.k ? 'bg-bermellon text-paper' : 'hairline hover:bg-ink hover:text-paper'}`}>
                        {o.l}
                      </button>
                    ))}
                  </div>
                </div>

                <Input label="NOMBRE *" value={form.name} onChange={v => setForm({ ...form, name: v })} required />
                <Input label="EMAIL *" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} required />
                <Input label="TELÉFONO" type="tel" value={form.phone} onChange={v => setForm({ ...form, phone: v })} />

                <div>
                  <label className="mono-tag !text-[9px] block mb-1.5" style={{ color: '#c8462a' }}>MENSAJE (OPCIONAL)</label>
                  <textarea rows={2} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="¿Quieres más fotos, medidas, condiciones?" className="w-full bg-paper hairline p-3 text-ink serif-italic text-base outline-none focus:border-bermellon resize-none transition-colors leading-snug" />
                </div>

                <button type="submit" disabled={busy}
                  className="w-full bg-bermellon text-paper py-3.5 mono-tag !text-[11px] !tracking-[0.4em] hover:bg-ink transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
                  {busy ? <><Loader2 size={14} className="animate-spin" /> ENVIANDO…</> : <><Send size={14} /> RESERVAR PIEZA</>}
                </button>
                <p className="text-center mono-tag text-ink-soft">CONFIRMACIÓN EN &lt; 24H</p>
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
    <label className="mono-tag !text-[9px] block mb-1.5" style={{ color: '#c8462a' }}>{label}</label>
    <input type={type} required={required} value={value} onChange={e => onChange(e.target.value)}
      className="w-full bg-paper hairline p-2.5 text-ink mono-tag !text-[11px] !tracking-[0.15em] !normal-case outline-none focus:border-bermellon transition-colors" />
  </div>
);

const EmptyState: React.FC = () => (
  <div className="py-20 text-center">
    <Tag className="w-12 h-12 mx-auto opacity-30 mb-4 text-ink-soft" />
    <p className="display text-2xl mb-2">Aún no hay piezas publicadas.</p>
    <p className="serif-italic text-ink-soft text-lg">Próximamente — seguimos curando.</p>
    <a href="https://www.instagram.com/bruscabo/" target="_blank" rel="noopener"
      className="inline-flex items-center gap-2 mt-6 hairline px-5 py-3 mono-tag hover:bg-ink hover:text-paper transition-colors">
      <Instagram size={12} /> SEGUIR EN INSTAGRAM
    </a>
  </div>
);
