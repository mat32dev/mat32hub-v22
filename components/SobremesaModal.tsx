import React, { createContext, useContext, useState, useEffect } from 'react';
import { X, Calendar, Utensils, Music, CheckCircle2, Loader2, AlertCircle, ArrowLeft, CreditCard, Smartphone, Copy, Plus, Minus } from 'lucide-react';
import { dataService } from '../services/dataService';

interface SobremesaContextType {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const SobremesaContext = createContext<SobremesaContextType>({ open: () => {}, close: () => {}, isOpen: false });
export const useSobremesa = () => useContext(SobremesaContext);

const SLOTS = ['18:00', '18:45', '19:30', '20:30'];

interface TableRow {
  id: string;
  label: string;
  zone: string;
  capacity: number;
  x: number; y: number; w: number; h: number;
  active: boolean;
  availability: Record<string, boolean>;
}

export const SobremesaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <SobremesaContext.Provider value={{ open: () => setIsOpen(true), close: () => setIsOpen(false), isOpen }}>
      {children}
      {isOpen && <Modal onClose={() => setIsOpen(false)} />}
    </SobremesaContext.Provider>
  );
};

type Step = 'date' | 'table' | 'form' | 'food' | 'payment' | 'bizum' | 'done';
type FoodCart = Record<string, number>;
interface FoodCategory { id: string; name: string; items: FoodItem[]; }
interface FoodItem { id: string; name: string; description: string | null; price_customer_cents: number; image_url: string | null; allergens: string | null; }

const Modal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const today = new Date().toISOString().slice(0, 10);
  const [step, setStep] = useState<Step>('date');
  const [date, setDate] = useState(today);
  const [slot, setSlot] = useState('19:30');
  const [tables, setTables] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState<TableRow | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', guests: 20, byo: 'menu' as 'byo' | 'menu' | 'both', notes: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'bizum' | 'stripe'>('bizum');
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [foodMenu, setFoodMenu] = useState<FoodCategory[]>([]);
  const [foodCart, setFoodCart] = useState<FoodCart>({});
  const [loadingFood, setLoadingFood] = useState(false);

  const loadAvailability = async (d: string) => {
    setLoading(true);
    try {
      const r = await dataService.getSobremesaAvailability(d);
      setTables(r.tables);
    } catch (e) { console.error(e); setTables([]); }
    setLoading(false);
  };

  useEffect(() => {
    if (step === 'table') loadAvailability(date);
  }, [step, date, slot]);

  const submit = async () => {
    if (!form.name || !form.email) return;
    setSubmitting(true);
    setError(null);
    try {
      const depositCents = 5 * form.guests * 100;
      await dataService.createInboxMessage({
        sender: form.name,
        email: form.email,
        content: `[CATERING EVENTO] ${form.guests} pax · ${date} desde ${slot} · Depósito ${(depositCents/100).toFixed(2)}€ · Tel ${form.phone || '-'} · ${form.notes || 'sin notas'}`,
        metadata: {
          source: 'catering-modal',
          guests: form.guests, date, slot,
          phone: form.phone, notes: form.notes,
          deposit_cents: depositCents,
          payment_pref: paymentMethod,
        } as any,
      });
      setPaymentInfo({ method: paymentMethod, amount_cents: depositCents, phone: '+34 622 19 08 02', ref: `EV-${Date.now().toString(36).toUpperCase()}` });
      setStep(paymentMethod === 'bizum' ? 'bizum' : 'done');
    } catch (e: any) {
      setError('Algo ha fallado. Prueba otra vez o escríbenos a hola@mat32.com.');
    }
    setSubmitting(false);
  };

  const loadFoodMenu = async () => {
    setLoadingFood(true);
    try { setFoodMenu(await dataService.getFoodMenu()); } catch {}
    setLoadingFood(false);
  };

  // When entering food step, load menu
  useEffect(() => { if (step === 'food' && foodMenu.length === 0) loadFoodMenu(); }, [step]);

  const goFromForm = () => {
    setStep('payment');
  };

  const foodTotalCents = foodMenu
    .flatMap(c => c.items)
    .reduce((s, i) => s + (foodCart[i.id] || 0) * i.price_customer_cents, 0);

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-mat-900 border border-mat-800 rounded-3xl shadow-2xl custom-scrollbar" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-mat-800 hover:bg-mat-700 rounded-full text-gray-400 hover:text-white transition-colors">
          <X size={18} />
        </button>

        {/* Hero */}
        <div className="p-8 md:p-10 pb-6 border-b border-mat-800 bg-gradient-to-br from-mat-800/40 via-mat-900 to-mat-900">
          <div className="inline-flex items-center gap-2 mb-3 text-mat-500 text-[10px] font-black uppercase tracking-[0.4em]">
            <Music size={12} /> CATERING EVENTOS · RUZAFA
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white font-exo tracking-tight leading-none mb-3">
            RESERVA <span className="text-mat-500">MESA + CATERING.</span>
          </h2>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-xl">
            Reserva mesa con opción de <b className="text-mat-500">catering sencillo</b> para tu grupo: tablas, picoteo y bebida. Depósito de <b className="text-mat-500">5€/pax descontable</b> del total. Grupos de 4 a 12, jueves a sábado.
          </p>
          <p className="text-emerald-400 text-[11px] md:text-xs mt-2 font-bold uppercase tracking-widest">
            ✓ Reservas viernes y sábado: incluyen la entrada de noche.
          </p>
          {/* progress dots */}
          <div className="flex items-center gap-2 mt-5">
            {(['date', 'table', 'form', 'payment', 'done'] as Step[]).map((s, i) => {
              const order = ['date', 'table', 'form', 'food', 'payment', 'bizum', 'done'];
              const current = order.indexOf(step);
              const mine = order.indexOf(s);
              return <div key={s} className={`h-1 flex-1 rounded-full ${current >= mine ? 'bg-mat-500' : 'bg-mat-800'}`} />;
            })}
          </div>
        </div>

        {/* Step content */}
        <div className="p-6 md:p-8">
          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          {/* STEP 1 · DATE + SLOT + GUESTS */}
          {step === 'date' && (
            <div className="space-y-5">
              <div className="p-5 bg-mat-950 border border-mat-800 rounded-2xl">
                <div className="text-[10px] font-black text-mat-500 uppercase tracking-[0.4em] mb-1">CATERING EVENTOS</div>
                <div className="text-[10px] text-gray-500 mb-3 italic">Packs sencillos para grupos · mín. 20 pax</div>
                <div className="grid sm:grid-cols-3 gap-4 text-[12px]">
                  <div className="space-y-1.5">
                    <div className="text-white font-black">PICOTEO · 6€/pax</div>
                    <p className="text-gray-500 leading-relaxed">Olivas, frutos secos, patatas premium, snacks de cerveza.</p>
                    <p className="text-mat-500/80 text-[11px] leading-relaxed">+ Refresco o agua · 2€/pax</p>
                  </div>
                  <div className="space-y-1.5">
                    <div className="text-white font-black">TABLA · 12€/pax</div>
                    <p className="text-gray-500 leading-relaxed">Ibéricos, quesos, encurtidos, pan tostado y AOVE.</p>
                    <p className="text-mat-500/80 text-[11px] leading-relaxed">+ Vermut o cerveza · 4€/pax</p>
                  </div>
                  <div className="space-y-1.5">
                    <div className="text-white font-black">PREMIUM · 18€/pax</div>
                    <p className="text-gray-500 leading-relaxed">Tabla + tartar, conservas selectas, mini-bocados y postre.</p>
                    <p className="text-mat-500/80 text-[11px] leading-relaxed">+ Barra libre vino/cerveza 2h · 12€/pax</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-mat-800 space-y-2">
                  <div className="text-[10px] font-black text-mat-500 uppercase tracking-[0.3em]">EXTRAS DE BEBIDA</div>
                  <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-gray-400">
                    <div>· Welcome cocktail · 5€/pax</div>
                    <div>· Cava brindis · 4€/pax</div>
                    <div>· Cubatas a 8€ (consumo abierto)</div>
                    <div>· Café o té post-evento · 2€/pax</div>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-400 pt-2">
                    <span className="px-2 py-0.5 bg-mat-500/15 text-mat-500 rounded font-black uppercase tracking-widest text-[9px]">DEPÓSITO</span>
                    5€/pax al reservar, descontable del total. Catering y bebida se confirman 48h antes del evento. Cancelación &gt;7 días: 100%.
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Fecha</label>
                <input type="date" min={today} value={date} onChange={e => setDate(e.target.value)}
                  className="w-full bg-mat-950 border border-mat-800 rounded-xl px-3 py-3 text-white text-sm focus:border-mat-500 outline-none" />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Hora</label>
                <div className="grid grid-cols-4 gap-2">
                  {SLOTS.map(s => (
                    <button key={s} type="button" onClick={() => setSlot(s)}
                      className={`py-3 text-sm font-black uppercase tracking-wider rounded-lg border transition-all ${slot === s ? 'bg-mat-500 text-white border-mat-500' : 'bg-mat-950 text-gray-400 border-mat-800 hover:border-mat-700'}`}>{s}</button>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-gray-500">Sesiones de ~50 minutos.</p>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Comensales (mín. 20)</label>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setForm({ ...form, guests: Math.max(20, form.guests - 5) })}
                    className="p-3 bg-mat-950 border border-mat-800 rounded-xl text-gray-300 hover:border-mat-700 disabled:opacity-30"
                    disabled={form.guests <= 20}>
                    <Minus size={14} />
                  </button>
                  <input type="number" min={20} max={200} value={form.guests}
                    onChange={e => setForm({ ...form, guests: Math.max(20, parseInt(e.target.value) || 20) })}
                    className="flex-1 bg-mat-950 border border-mat-800 rounded-xl px-3 py-3 text-white text-center text-lg font-black focus:border-mat-500 outline-none" />
                  <button type="button" onClick={() => setForm({ ...form, guests: Math.min(200, form.guests + 5) })}
                    className="p-3 bg-mat-950 border border-mat-800 rounded-xl text-gray-300 hover:border-mat-700">
                    <Plus size={14} />
                  </button>
                </div>
                <p className="mt-2 text-[11px] text-gray-500">Eventos privados con catering. Mínimo 20 personas. Para grupos &gt; 100 contactamos por WhatsApp.</p>
              </div>

              <button onClick={() => setStep('form')}
                className="w-full py-4 bg-mat-500 hover:bg-mat-400 text-white text-xs font-black uppercase tracking-[0.4em] rounded-full transition-all">
                CONTINUAR CON DATOS →
              </button>
            </div>
          )}

          {/* STEP 2 · TABLE MAP */}
          {step === 'table' && (
            <div className="space-y-4">
              <button onClick={() => setStep('date')} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white">
                <ArrowLeft size={12} /> Cambiar fecha u hora
              </button>

              <div className="text-center text-sm space-y-1">
                <div className="text-gray-400">
                  <b className="text-white capitalize">{new Date(date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</b> · {slot} · {form.guests} pax
                </div>
                {[5, 6].includes(new Date(date + 'T12:00:00').getDay()) && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/40 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-400">
                    ✓ INCLUYE ENTRADA DE NOCHE
                  </div>
                )}
              </div>

              {loading ? (
                <div className="py-20 text-center"><Loader2 className="animate-spin text-mat-500 w-8 h-8 mx-auto" /></div>
              ) : (
                <MapSelector tables={tables} date={date} slot={slot} guests={form.guests} selected={selectedTable} onSelect={setSelectedTable} />
              )}

              <div className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest flex-wrap">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-mat-800 border border-mat-700"/> Libre</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-mat-500"/> Elegida</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm border border-red-500/60"/> Reservada</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-900 border border-emerald-500"/> Green Corner</span>
              </div>

              <button
                disabled={!selectedTable}
                onClick={() => setStep('form')}
                className="w-full py-4 bg-mat-500 hover:bg-mat-400 disabled:opacity-40 text-white text-xs font-black uppercase tracking-[0.4em] rounded-full transition-all">
                {selectedTable ? `CONTINUAR CON ${selectedTable.label} →` : 'ELIGE UNA MESA'}
              </button>
            </div>
          )}

          {/* STEP 3 · FORM (event mode, no table required) */}
          {step === 'form' && (
            <form onSubmit={e => { e.preventDefault(); goFromForm(); }} className="space-y-4">
              <button type="button" onClick={() => setStep('date')} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white">
                <ArrowLeft size={12} /> Cambiar fecha o pax
              </button>

              <div className="p-4 bg-mat-950 border border-mat-800 rounded-2xl">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-[10px] font-black text-mat-500 uppercase tracking-widest mb-1">TU SOLICITUD DE EVENTO</div>
                    <div className="text-white text-sm">
                      <b>EVENTO {form.guests} pax</b>
                    </div>
                    <div className="text-gray-400 text-[12px] capitalize">
                      {new Date(date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })} · desde {slot}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Nombre *</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-mat-950 border border-mat-800 rounded-xl px-3 py-2.5 text-white text-sm focus:border-mat-500 outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Email *</label>
                  <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-mat-950 border border-mat-800 rounded-xl px-3 py-2.5 text-white text-sm focus:border-mat-500 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Teléfono</label>
                <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-mat-950 border border-mat-800 rounded-xl px-3 py-2.5 text-white text-sm focus:border-mat-500 outline-none" />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Notas (opcional)</label>
                <textarea rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                  placeholder="Alergias, cumpleaños, preferencias..."
                  className="w-full bg-mat-950 border border-mat-800 rounded-xl px-3 py-2.5 text-white text-sm focus:border-mat-500 outline-none" />
              </div>

              <button type="submit"
                className="w-full py-4 bg-mat-500 hover:bg-mat-400 text-white text-xs font-black uppercase tracking-[0.4em] rounded-full transition-all flex items-center justify-center gap-2">
                <Calendar size={14} /> CONTINUAR AL PAGO →
              </button>

              <p className="text-center text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                Depósito 5€ × {form.guests} = <b className="text-mat-500">{(5 * form.guests).toFixed(2).replace('.', ',')}€</b> · descontable del total
              </p>
            </form>
          )}

          {/* STEP 3a · FOOD SELECTION */}
          {step === 'food' && selectedTable && (
            <div className="space-y-4">
              <button type="button" onClick={() => setStep('form')} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white">
                <ArrowLeft size={12} /> Volver
              </button>

              <div className="text-center">
                <h3 className="text-2xl font-black uppercase text-white font-exo">Menú MAT32</h3>
                <p className="text-[11px] text-gray-500 mt-1">Se paga en el local con tarjeta al llegar</p>
              </div>

              {loadingFood ? (
                <div className="py-16 text-center"><Loader2 className="animate-spin text-mat-500 w-8 h-8 mx-auto" /></div>
              ) : foodMenu.every(c => !c.items.length) ? (
                <div className="p-6 bg-mat-950 border border-mat-800 rounded-xl text-center space-y-2">
                  <Utensils className="w-10 h-10 text-gray-600 mx-auto" />
                  <p className="text-gray-400 text-sm">Menú en preparación</p>
                  <p className="text-[11px] text-gray-500">Confirma tu reserva y te contactamos con el menú disponible ese día.</p>
                  <button onClick={() => setStep('payment')} className="mt-3 px-6 py-2 bg-mat-500 hover:bg-mat-400 text-white text-xs font-black uppercase tracking-widest rounded-lg">
                    Continuar sin elegir
                  </button>
                </div>
              ) : (
                <div className="space-y-5 max-h-[50vh] overflow-y-auto custom-scrollbar -mx-2 px-2">
                  {foodMenu.filter(c => c.items.length > 0).map(c => (
                    <div key={c.id}>
                      <div className="text-[10px] font-black text-mat-500 uppercase tracking-[0.3em] mb-2">{c.name}</div>
                      <div className="space-y-2">
                        {c.items.map(i => {
                          const qty = foodCart[i.id] || 0;
                          return (
                            <div key={i.id} className={`p-3 rounded-xl border transition-all ${qty > 0 ? 'bg-mat-500/10 border-mat-500/40' : 'bg-mat-950 border-mat-800'}`}>
                              <div className="flex items-start gap-3">
                                {i.image_url && <img src={i.image_url} alt={i.name} className="w-14 h-14 rounded-lg object-cover shrink-0" />}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-baseline justify-between gap-2">
                                    <span className="text-sm font-black text-white">{i.name}</span>
                                    <span className="text-sm font-black text-mat-500 tabular-nums">{(i.price_customer_cents/100).toFixed(2)}€</span>
                                  </div>
                                  {i.description && <div className="text-[11px] text-gray-400 mt-0.5">{i.description}</div>}
                                  {i.allergens && <div className="text-[10px] text-gray-600 italic mt-0.5">Alérgenos: {i.allergens}</div>}
                                  <div className="flex items-center gap-2 mt-2">
                                    {qty > 0 ? (
                                      <div className="flex items-center gap-1 bg-mat-500/20 rounded-full">
                                        <button onClick={() => setFoodCart(c => ({ ...c, [i.id]: Math.max(0, (c[i.id] || 0) - 1) }))} className="p-1.5 text-mat-500 hover:bg-mat-500/30 rounded-full"><Minus size={12} /></button>
                                        <span className="px-2 text-sm font-black text-white min-w-[20px] text-center">{qty}</span>
                                        <button onClick={() => setFoodCart(c => ({ ...c, [i.id]: (c[i.id] || 0) + 1 }))} className="p-1.5 text-mat-500 hover:bg-mat-500/30 rounded-full"><Plus size={12} /></button>
                                      </div>
                                    ) : (
                                      <button onClick={() => setFoodCart(c => ({ ...c, [i.id]: 1 }))} className="flex items-center gap-1 px-3 py-1.5 bg-mat-800 hover:bg-mat-700 text-gray-300 text-[11px] font-black uppercase tracking-wider rounded-full">
                                        <Plus size={11} /> Añadir
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {foodTotalCents > 0 && (
                <div className="p-4 bg-mat-500/10 border border-mat-500/30 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-black text-mat-500 uppercase tracking-widest">SUBTOTAL COMIDA</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">Se paga en el local</div>
                  </div>
                  <div className="text-2xl font-black text-white font-exo">{(foodTotalCents/100).toFixed(2).replace('.', ',')}€</div>
                </div>
              )}

              <button type="button" onClick={() => setStep('payment')}
                className="w-full py-4 bg-mat-500 hover:bg-mat-400 text-white text-xs font-black uppercase tracking-[0.4em] rounded-full transition-all flex items-center justify-center gap-2">
                <Calendar size={14} /> CONTINUAR AL PAGO DEL PASE →
              </button>

              <p className="text-center text-[10px] text-gray-600 uppercase tracking-widest font-black">
                El pase lo pagas ahora · La comida al llegar al local
              </p>
            </div>
          )}

          {/* STEP 3b · PAYMENT CHOICE */}
          {step === 'payment' && (
            <div className="space-y-4">
              <button type="button" onClick={() => setStep('form')} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white">
                <ArrowLeft size={12} /> Cambiar datos
              </button>

              <div className="p-4 bg-mat-950 border border-mat-800 rounded-2xl text-center">
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">DEPÓSITO AHORA · DESCONTABLE</div>
                <div className="text-4xl font-black text-mat-500 font-exo">
                  {(5 * form.guests).toFixed(2).replace('.', ',') + '€'}
                </div>
                <div className="text-[11px] text-gray-400 mt-1">
                  {form.guests} pax · 5€ por cabeza · se resta del total al pagar la cuenta
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Método de pago</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setPaymentMethod('bizum')}
                    className={`p-4 rounded-2xl border-2 transition-all text-left ${paymentMethod === 'bizum' ? 'border-mat-500 bg-mat-500/5' : 'border-mat-800 bg-mat-950 hover:border-mat-700'}`}>
                    <Smartphone className="w-6 h-6 text-mat-500 mb-2" />
                    <div className="font-black text-white text-sm uppercase tracking-tight">Bizum</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">Al móvil, desde tu banca</div>
                  </button>
                  <button type="button" onClick={() => setPaymentMethod('stripe')}
                    className={`p-4 rounded-2xl border-2 transition-all text-left ${paymentMethod === 'stripe' ? 'border-mat-500 bg-mat-500/5' : 'border-mat-800 bg-mat-950 hover:border-mat-700'}`}>
                    <CreditCard className="w-6 h-6 text-mat-500 mb-2" />
                    <div className="font-black text-white text-sm uppercase tracking-tight">Tarjeta</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">Pago online seguro</div>
                  </button>
                </div>
              </div>

              <button onClick={submit} disabled={submitting}
                className="w-full py-4 bg-mat-500 hover:bg-mat-400 disabled:opacity-50 text-white text-xs font-black uppercase tracking-[0.4em] rounded-full transition-all flex items-center justify-center gap-2">
                {submitting ? <><Loader2 size={14} className="animate-spin" /> PROCESANDO...</> : paymentMethod === 'stripe' ? <><CreditCard size={14} /> PAGAR CON TARJETA →</> : <><Smartphone size={14} /> VER INSTRUCCIONES BIZUM →</>}
              </button>

              <p className="text-center text-[10px] text-gray-600 uppercase tracking-widest font-black">
                Pago anticipado · La mesa se fija al confirmar el pago
              </p>
            </div>
          )}

          {/* STEP 3c · BIZUM INSTRUCTIONS */}
          {step === 'bizum' && paymentInfo && (
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-br from-mat-800/40 via-mat-900 to-mat-900 border-2 border-mat-500/40 rounded-2xl text-center space-y-3">
                <Smartphone className="w-12 h-12 text-mat-500 mx-auto" />
                <div className="text-[10px] font-black uppercase tracking-widest text-mat-500">BIZUM · 3 PASOS</div>
                <div className="text-3xl font-black text-white font-exo">{(paymentInfo.amount_cents/100).toFixed(2).replace('.', ',')}€</div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-mat-950 border border-mat-800 rounded-xl">
                  <div className="w-7 h-7 rounded-full bg-mat-500 text-white text-xs font-black flex items-center justify-center shrink-0">1</div>
                  <div className="flex-1">
                    <div className="text-xs font-black text-white uppercase tracking-wider mb-1">Abre Bizum en tu banca</div>
                    <div className="text-[11px] text-gray-400">Desde la app de tu banco, busca Bizum → Enviar dinero.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-mat-950 border border-mat-800 rounded-xl">
                  <div className="w-7 h-7 rounded-full bg-mat-500 text-white text-xs font-black flex items-center justify-center shrink-0">2</div>
                  <div className="flex-1 space-y-2">
                    <div className="text-xs font-black text-white uppercase tracking-wider">Enviar a este número</div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 bg-mat-900 border border-mat-800 rounded-lg font-mono text-mat-500 text-sm tracking-wider">{paymentInfo.phone}</code>
                      <button onClick={() => { navigator.clipboard.writeText(paymentInfo.phone.replace(/\s/g, '')); alert('Copiado'); }} className="p-2 bg-mat-800 hover:bg-mat-700 rounded-lg text-gray-300"><Copy size={14} /></button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-mat-950 border border-mat-800 rounded-xl">
                  <div className="w-7 h-7 rounded-full bg-mat-500 text-white text-xs font-black flex items-center justify-center shrink-0">3</div>
                  <div className="flex-1 space-y-2">
                    <div className="text-xs font-black text-white uppercase tracking-wider">Concepto / referencia</div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 bg-mat-900 border border-mat-800 rounded-lg font-mono text-mat-500 text-sm tracking-wider">{paymentInfo.ref}</code>
                      <button onClick={() => { navigator.clipboard.writeText(paymentInfo.ref); alert('Copiado'); }} className="p-2 bg-mat-800 hover:bg-mat-700 rounded-lg text-gray-300"><Copy size={14} /></button>
                    </div>
                    <p className="text-[11px] text-gray-500">Importante para que sepamos qué reserva confirmar.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-mat-500/5 border border-mat-500/20 rounded-xl">
                <p className="text-[11px] text-gray-300 leading-relaxed">
                  <b className="text-mat-500">Confirmación:</b> en cuanto recibamos el Bizum (suele ser en minutos), te llega un email con la mesa confirmada. Si no llega en 24h, escríbenos a <a href="mailto:hola@mat32.com" className="underline text-mat-500">hola@mat32.com</a>.
                </p>
              </div>

              <button onClick={() => setStep('done')} className="w-full py-4 bg-mat-500 hover:bg-mat-400 text-white text-xs font-black uppercase tracking-[0.4em] rounded-full transition-all">
                ENTENDIDO →
              </button>
            </div>
          )}

          {/* STEP 4 · DONE */}
          {step === 'done' && (
            <div className="text-center space-y-4 py-6">
              <CheckCircle2 className="w-16 h-16 text-mat-500 mx-auto" />
              <h3 className="text-3xl md:text-4xl font-black uppercase text-white font-exo tracking-tight">Solicitud enviada</h3>
              <p className="text-gray-400 text-base capitalize">
                <b className="text-white">{new Date(date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</b> · desde {slot} · {form.guests} pax
              </p>
              <p className="text-gray-500 text-sm">
                <Utensils size={12} className="inline text-mat-500" /> Catering (picoteo · tabla · premium) + bebida a elegir · Te contactamos en 24h.
              </p>
              {paymentInfo?.method === 'bizum' && (
                <div className="p-4 bg-mat-500/10 border border-mat-500/30 rounded-xl text-left">
                  <div className="text-[10px] font-black text-mat-500 uppercase tracking-widest mb-2">PENDIENTE DE PAGO</div>
                  <p className="text-xs text-gray-300">Bizum <b>{paymentInfo.phone}</b> · {(paymentInfo.amount_cents/100).toFixed(2).replace('.',',')}€ · Ref <code className="text-mat-500">{paymentInfo.ref}</code></p>
                  <p className="text-[11px] text-gray-500 mt-2">Tu mesa queda reservada al confirmar el pago.</p>
                </div>
              )}
              <button onClick={onClose} className="mt-3 px-8 py-3 bg-mat-500 hover:bg-mat-400 text-white text-xs font-black uppercase tracking-[0.3em] rounded-full">
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── MAP SELECTOR ──────────────────────────────────────────
// Scarcity determinista: bloquea 1 de {A,B,C,D} por slot+fecha (semilla = hash).
// E y GC nunca se bloquean ficticiamente (E es flexible, GC es premium).
const SCARCITY_POOL = ['A', 'B', 'C', 'D'];
function scarcityBlock(date: string, slot: string): string | null {
  const seed = `${date}::${slot}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) { h = ((h << 5) - h + seed.charCodeAt(i)) | 0; }
  const idx = Math.abs(h) % (SCARCITY_POOL.length + 1); // +1 para que ocasionalmente no haya bloqueo
  return idx < SCARCITY_POOL.length ? SCARCITY_POOL[idx] : null;
}

const MapSelector: React.FC<{ tables: TableRow[]; date: string; slot: string; guests: number; selected: TableRow | null; onSelect: (t: TableRow | null) => void }> = ({ tables, date, slot, guests, selected, onSelect }) => {
  const VIEW_W = 500;
  const VIEW_H = 400;

  const fakeBlocked = scarcityBlock(date, slot);

  const stateOf = (t: TableRow): 'booked' | 'selected' | 'small' | 'free' | 'gc' => {
    if (!t.active || !t.availability?.[slot]) return 'booked';
    if (t.id === fakeBlocked) return 'booked';
    if (selected?.id === t.id) return 'selected';
    if (t.id === 'GC') {
      if (guests > 12 || guests < 10) return 'small';
      return 'gc';
    }
    if (guests > t.capacity) return 'small';
    return 'free';
  };

  const fillOf = (s: ReturnType<typeof stateOf>) => {
    switch (s) {
      case 'selected': return { fill: '#ea580c', stroke: '#ea580c', textFill: '#ffffff' };
      case 'booked':   return { fill: '#1c1917', stroke: '#ef4444', textFill: '#78716c', opacity: 0.6 };
      case 'small':    return { fill: '#1c1917', stroke: '#44403c', textFill: '#57534e', opacity: 0.45 };
      case 'free':     return { fill: '#292524', stroke: '#44403c', textFill: '#f5f5f4' };
      case 'gc':       return { fill: '#0a3d2a', stroke: '#10b981', textFill: '#d1fae5' };
    }
  };

  return (
    <div className="bg-mat-950 border border-mat-800 rounded-2xl p-4">
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} role="application" aria-label="Mapa de mesas MAT32" className="w-full h-auto">
        {/* Entrada */}
        <text x="15" y="14" fontSize="9" fill="#57534e" fontFamily="monospace" letterSpacing="2">↓ ENTRADA</text>

        {tables.map(t => {
          const s = stateOf(t);
          const style = fillOf(s);
          const disabled = s === 'booked' || s === 'small';
          const isGC = t.id === 'GC';
          return (
            <g
              key={t.id}
              style={{ cursor: disabled ? 'not-allowed' : 'pointer', opacity: style.opacity ?? 1 }}
              onClick={() => { if (!disabled) onSelect(t); }}
              tabIndex={disabled ? -1 : 0}
              onKeyDown={(e) => { if (!disabled && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onSelect(t); } }}
              aria-label={`${t.label}, ${t.capacity} plazas, ${t.zone}, ${s === 'booked' ? 'reservada' : s === 'small' ? 'capacidad insuficiente' : s === 'selected' ? 'elegida' : 'libre'}`}
            >
              <rect x={t.x} y={t.y} width={t.w} height={t.h} rx={isGC ? 12 : 4} fill={style.fill} stroke={style.stroke} strokeWidth={s === 'selected' ? 3 : isGC ? 2 : 1.5} />
              <text x={t.x + t.w / 2} y={t.y + t.h / 2 - 6} textAnchor="middle" fontSize={isGC ? 12 : 14} fontWeight="900" fill={style.textFill} fontFamily="'Exo 2', sans-serif" letterSpacing="1">
                {isGC ? 'GREEN CORNER' : t.id}
              </text>
              <text x={t.x + t.w / 2} y={t.y + t.h / 2 + 10} textAnchor="middle" fontSize="10" fill={style.textFill} fontFamily="monospace" opacity="0.8">
                {isGC ? '10-12 pax · 100€' : `${t.capacity}p`}
              </text>
              {s === 'booked' && (
                <text x={t.x + t.w / 2} y={t.y + t.h - 6} textAnchor="middle" fontSize="8" fill="#ef4444" fontFamily="monospace" letterSpacing="2" opacity="0.85">RESERVADA</text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="mt-3 grid grid-cols-3 gap-1.5 text-[9px] text-gray-500">
        <div>· A+B unibles → 8 pax</div>
        <div>· C+D unibles → 10 pax</div>
        <div>· E plegable 2-4-6-8</div>
      </div>
    </div>
  );
};
