import React, { createContext, useContext, useState, useEffect } from 'react';
import { X, Calendar, Music, CheckCircle2, Loader2, AlertCircle, ArrowLeft, Plus, Minus } from 'lucide-react';
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

type Step = 'date' | 'table' | 'form' | 'done';

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
  const [form, setForm] = useState({ name: '', email: '', phone: '', guests: 2, notes: '' });

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
      await dataService.createInboxMessage({
        sender: form.name,
        email: form.email,
        content: `[RESERVA MESA] ${form.guests} pax · ${date} · ${slot}${selectedTable ? ` · ${selectedTable.label}` : ''} · Tel ${form.phone || '-'} · ${form.notes || 'sin notas'}`,
        metadata: {
          source: 'reserva-mesa',
          guests: form.guests, date, slot,
          table: selectedTable?.label,
          phone: form.phone, notes: form.notes,
        } as any,
      });
      setStep('done');
    } catch (e: any) {
      setError('Algo ha fallado. Prueba otra vez o escríbenos a hola@mat32.com.');
    }
    setSubmitting(false);
  };

  const STEPS: Step[] = ['date', 'table', 'form', 'done'];

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-mat-900 border border-mat-800 rounded-3xl shadow-2xl custom-scrollbar" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-mat-800 hover:bg-mat-700 rounded-full text-gray-400 hover:text-white transition-colors">
          <X size={18} />
        </button>

        {/* Hero */}
        <div className="p-8 md:p-10 pb-6 border-b border-mat-800 bg-gradient-to-br from-mat-800/40 via-mat-900 to-mat-900">
          <div className="inline-flex items-center gap-2 mb-3 text-mat-500 text-[10px] font-black uppercase tracking-[0.4em]">
            <Music size={12} /> RESERVAR MESA · APERITIVO TERRAZA
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white font-exo tracking-tight leading-none mb-3">
            RESERVA <span className="text-mat-500">TU MESA.</span>
          </h2>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-xl">
            Aperitivo o sobremesa con selección de Discos. Sin compromiso. Grupos de 2 a 12 personas, jueves a sábado.
          </p>
          <p className="text-emerald-400 text-[11px] md:text-xs mt-2 font-bold uppercase tracking-widest">
            ✓ Happy Hour 19h–22h
          </p>
          {/* progress dots */}
          <div className="flex items-center gap-2 mt-5">
            {STEPS.map((s, i) => (
              <div key={s} className={`h-1 flex-1 rounded-full ${STEPS.indexOf(step) >= i ? 'bg-mat-500' : 'bg-mat-800'}`} />
            ))}
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
                <p className="mt-2 text-[11px] text-gray-500">Happy Hour 19h–22h</p>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Comensales</label>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setForm({ ...form, guests: Math.max(2, form.guests - 1) })}
                    className="p-3 bg-mat-950 border border-mat-800 rounded-xl text-gray-300 hover:border-mat-700 disabled:opacity-30"
                    disabled={form.guests <= 2}>
                    <Minus size={14} />
                  </button>
                  <input type="number" min={2} max={12} value={form.guests}
                    onChange={e => setForm({ ...form, guests: Math.max(2, Math.min(12, parseInt(e.target.value) || 2)) })}
                    className="flex-1 bg-mat-950 border border-mat-800 rounded-xl px-3 py-3 text-white text-center text-lg font-black focus:border-mat-500 outline-none" />
                  <button type="button" onClick={() => setForm({ ...form, guests: Math.min(12, form.guests + 1) })}
                    className="p-3 bg-mat-950 border border-mat-800 rounded-xl text-gray-300 hover:border-mat-700 disabled:opacity-30"
                    disabled={form.guests >= 12}>
                    <Plus size={14} />
                  </button>
                </div>
                <p className="mt-2 text-[11px] text-gray-500">Grupos de 2 a 12. Para eventos privados &gt;12, escríbenos.</p>
              </div>

              <button onClick={() => setStep('table')}
                className="w-full py-4 bg-mat-500 hover:bg-mat-400 text-white text-xs font-black uppercase tracking-[0.4em] rounded-full transition-all">
                VER MESAS DISPONIBLES →
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

          {/* STEP 3 · FORM */}
          {step === 'form' && (
            <form onSubmit={e => { e.preventDefault(); submit(); }} className="space-y-4">
              <button type="button" onClick={() => setStep('table')} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white">
                <ArrowLeft size={12} /> Cambiar mesa
              </button>

              <div className="p-4 bg-mat-950 border border-mat-800 rounded-2xl">
                <div className="text-[10px] font-black text-mat-500 uppercase tracking-widest mb-1">TU RESERVA</div>
                <div className="text-white text-sm">
                  <b>{form.guests} personas</b>{selectedTable ? ` · ${selectedTable.label}` : ''}
                </div>
                <div className="text-gray-400 text-[12px] capitalize">
                  {new Date(date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })} · desde {slot}
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
                  placeholder="Alergias, ocasión especial, preferencias..."
                  className="w-full bg-mat-950 border border-mat-800 rounded-xl px-3 py-2.5 text-white text-sm focus:border-mat-500 outline-none" />
              </div>

              <button type="submit" disabled={submitting}
                className="w-full py-4 bg-mat-500 hover:bg-mat-400 disabled:opacity-50 text-white text-xs font-black uppercase tracking-[0.4em] rounded-full transition-all flex items-center justify-center gap-2">
                {submitting ? <><Loader2 size={14} className="animate-spin" /> ENVIANDO...</> : <><Calendar size={14} /> CONFIRMAR RESERVA →</>}
              </button>

              <p className="text-center text-[10px] text-gray-500">
                Confirmamos por email en menos de 24h
              </p>
            </form>
          )}

          {/* STEP 4 · DONE */}
          {step === 'done' && (
            <div className="text-center space-y-4 py-6">
              <CheckCircle2 className="w-16 h-16 text-mat-500 mx-auto" />
              <h3 className="text-3xl md:text-4xl font-black uppercase text-white font-exo tracking-tight">¡Reserva enviada!</h3>
              <p className="text-gray-400 text-base capitalize">
                <b className="text-white">{new Date(date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</b> · {slot} · {form.guests} pax
              </p>
              <p className="text-gray-500 text-sm">
                Te confirmamos por email en menos de 24h. ¿Dudas? Escríbenos a <a href="mailto:hola@mat32.com" className="underline text-mat-500">hola@mat32.com</a>
              </p>
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
