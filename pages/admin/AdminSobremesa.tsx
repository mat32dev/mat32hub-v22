import React, { useEffect, useState, useRef } from 'react';
import { Loader2, Save, Trash2, Plus, X, Check, Calendar as CalIcon, Move } from 'lucide-react';
import { dataService } from '../../services/dataService';

interface T {
  id: string;
  label: string;
  zone: string;
  capacity: number;
  x: number; y: number; w: number; h: number;
  active: boolean;
  sort_order: number;
}

interface Booking {
  id: number;
  table_id: string;
  date: string;
  slot: string;
  guests: number;
  byo: string;
  name: string;
  email: string;
  phone: string | null;
  notes: string | null;
  status: string;
  created_at: string;
  payment_method: string;
  payment_status: string;
  amount_cents: number;
  payment_ref: string | null;
  paid_at: string | null;
}

export const AdminSobremesa: React.FC = () => {
  const [view, setView] = useState<'map' | 'bookings'>('map');
  const [tables, setTables] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().slice(0, 10));

  const load = async () => {
    setLoading(true);
    try { setTables(await dataService.getSobremesaTables()); } catch {}
    setLoading(false);
  };
  const loadBookings = async () => {
    try { setBookings(await dataService.getSobremesaBookings(bookingDate)); } catch {}
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { if (view === 'bookings') loadBookings(); }, [view, bookingDate]);

  const update = async (id: string, patch: Partial<T>) => {
    await dataService.updateSobremesaTable(id, patch);
    await load();
  };
  const remove = async (id: string) => {
    if (!confirm(`¿Eliminar mesa ${id}? También borra reservas asociadas.`)) return;
    await dataService.deleteSobremesaTable(id);
    setSelected(null);
    await load();
  };
  const create = async (t: Partial<T>) => {
    await dataService.createSobremesaTable(t);
    setShowNew(false);
    await load();
  };

  const sel = tables.find(t => t.id === selected);

  if (loading) return <div className="py-20 text-center"><Loader2 className="animate-spin text-orange-500 w-8 h-8 mx-auto" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-white uppercase tracking-tight">Sobremesa</h2>
        <div className="flex gap-2">
          <button onClick={() => setView('map')} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${view === 'map' ? 'bg-orange-500 text-white' : 'bg-stone-800 text-gray-400'}`}>Mapa de mesas</button>
          <button onClick={() => setView('bookings')} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${view === 'bookings' ? 'bg-orange-500 text-white' : 'bg-stone-800 text-gray-400'}`}>Reservas</button>
        </div>
      </div>

      {view === 'map' && (
        <div className="grid lg:grid-cols-[1fr_340px] gap-6">
          {/* Interactive editable SVG */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                <Move size={12} className="text-orange-500" /> ARRASTRA PARA MOVER · ESQUINA PARA REDIMENSIONAR
              </div>
              <button onClick={() => setShowNew(true)} className="flex items-center gap-1 px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg">
                <Plus size={13} /> Nueva mesa
              </button>
            </div>
            <EditableMap
              tables={tables}
              selectedId={selected}
              onSelect={setSelected}
              onUpdate={(id, patch) => dataService.updateSobremesaTable(id, patch).then(() => load())}
            />
          </div>

          {/* Editor */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-4">
            {showNew ? (
              <NewTableForm onCreate={create} onCancel={() => setShowNew(false)} count={tables.length} />
            ) : sel ? (
              <EditTable key={sel.id} t={sel} onSave={patch => update(sel.id, patch)} onDelete={() => remove(sel.id)} onClose={() => setSelected(null)} />
            ) : (
              <div className="py-10 text-center text-gray-500 text-sm">
                <p className="mb-2">Selecciona una mesa en el mapa</p>
                <p className="text-[11px] text-gray-600">Edita posición, tamaño, capacidad o desactívala</p>
              </div>
            )}

            {!sel && !showNew && (
              <div className="pt-4 border-t border-stone-800 space-y-2">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">TODAS LAS MESAS</div>
                {tables.map(t => (
                  <button key={t.id} onClick={() => setSelected(t.id)}
                    className="w-full flex items-center justify-between px-3 py-2 bg-stone-800 hover:bg-stone-700 rounded-lg text-xs">
                    <span className="flex items-center gap-2">
                      <span className="font-black text-white">{t.id}</span>
                      <span className="text-gray-500">{t.label}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="text-gray-500">{t.capacity}p · {t.zone}</span>
                      {!t.active && <span className="text-[9px] text-red-400 font-bold">OFF</span>}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {view === 'bookings' && (
        <BookingsList bookings={bookings} date={bookingDate} onDateChange={setBookingDate} onRefresh={loadBookings} />
      )}
    </div>
  );
};

const EditTable: React.FC<{ t: T; onSave: (p: Partial<T>) => Promise<void>; onDelete: () => void; onClose: () => void }> = ({ t, onSave, onDelete, onClose }) => {
  const [d, setD] = useState(t);
  const [busy, setBusy] = useState(false);
  const save = async () => { setBusy(true); await onSave(d); setBusy(false); };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">EDITAR MESA · {t.id}</div>
        <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={14} /></button>
      </div>

      <Field label="Etiqueta"><input value={d.label} onChange={e => setD({ ...d, label: e.target.value })} className="input" /></Field>
      <Field label="Zona">
        <select value={d.zone} onChange={e => setD({ ...d, zone: e.target.value })} className="input">
          <option value="interior">Interior</option>
          <option value="terraza">Terraza</option>
        </select>
      </Field>
      <Field label="Capacidad"><input type="number" min="1" value={d.capacity} onChange={e => setD({ ...d, capacity: parseInt(e.target.value) || 1 })} className="input" /></Field>

      <div className="grid grid-cols-2 gap-2">
        <Field label="X"><input type="number" value={d.x} onChange={e => setD({ ...d, x: parseInt(e.target.value) || 0 })} className="input" /></Field>
        <Field label="Y"><input type="number" value={d.y} onChange={e => setD({ ...d, y: parseInt(e.target.value) || 0 })} className="input" /></Field>
        <Field label="Ancho"><input type="number" value={d.w} onChange={e => setD({ ...d, w: parseInt(e.target.value) || 10 })} className="input" /></Field>
        <Field label="Alto"><input type="number" value={d.h} onChange={e => setD({ ...d, h: parseInt(e.target.value) || 10 })} className="input" /></Field>
      </div>

      <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer pt-2">
        <input type="checkbox" checked={d.active} onChange={e => setD({ ...d, active: e.target.checked })} className="accent-orange-500" />
        Mesa activa (visible y reservable)
      </label>

      <div className="flex gap-2 pt-3 border-t border-stone-800">
        <button onClick={save} disabled={busy} className="flex-1 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-black uppercase rounded-lg flex items-center justify-center gap-1">
          {busy ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} GUARDAR
        </button>
        <button onClick={onDelete} className="p-2 border border-red-800 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 size={13} /></button>
      </div>

      <style>{`.input { width: 100%; background: #1c1917; border: 1px solid #44403c; border-radius: 8px; padding: 8px 10px; color: white; font-size: 12px; }`}</style>
    </div>
  );
};

const NewTableForm: React.FC<{ onCreate: (t: Partial<T>) => Promise<void>; onCancel: () => void; count: number }> = ({ onCreate, onCancel, count }) => {
  const [d, setD] = useState<Partial<T>>({
    id: `M${count + 1}`,
    label: `Mesa ${count + 1}`,
    zone: 'interior',
    capacity: 4,
    x: 50, y: 50, w: 80, h: 60,
    active: true,
    sort_order: count,
  });
  const [busy, setBusy] = useState(false);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">NUEVA MESA</div>
        <button onClick={onCancel} className="text-gray-500 hover:text-white"><X size={14} /></button>
      </div>
      <Field label="ID (único)"><input value={d.id} onChange={e => setD({ ...d, id: e.target.value })} className="input" /></Field>
      <Field label="Etiqueta"><input value={d.label} onChange={e => setD({ ...d, label: e.target.value })} className="input" /></Field>
      <Field label="Capacidad"><input type="number" value={d.capacity} onChange={e => setD({ ...d, capacity: parseInt(e.target.value) })} className="input" /></Field>
      <button onClick={async () => { setBusy(true); await onCreate(d); setBusy(false); }} disabled={busy} className="w-full py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-black uppercase rounded-lg flex items-center justify-center gap-1">
        {busy ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />} CREAR
      </button>
      <style>{`.input { width: 100%; background: #1c1917; border: 1px solid #44403c; border-radius: 8px; padding: 8px 10px; color: white; font-size: 12px; }`}</style>
    </div>
  );
};

// ── EDITABLE MAP (drag-and-drop) ─────────────────────────────
const VIEW_W = 500;
const VIEW_H = 400;
const GRID = 5;

const EditableMap: React.FC<{ tables: T[]; selectedId: string | null; onSelect: (id: string) => void; onUpdate: (id: string, patch: Partial<T>) => void }> = ({ tables, selectedId, onSelect, onUpdate }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [drag, setDrag] = useState<{ id: string; mode: 'move' | 'resize'; startX: number; startY: number; orig: T } | null>(null);
  const [preview, setPreview] = useState<Record<string, Partial<T>>>({});

  // Convert mouse coords to SVG viewBox coords
  const svgPoint = (e: React.MouseEvent | MouseEvent) => {
    const svg = svgRef.current; if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const inv = ctm.inverse();
    const p = pt.matrixTransform(inv);
    return { x: p.x, y: p.y };
  };

  const snap = (v: number) => Math.round(v / GRID) * GRID;

  const onMouseDown = (e: React.MouseEvent, t: T, mode: 'move' | 'resize') => {
    e.stopPropagation();
    const p = svgPoint(e);
    setDrag({ id: t.id, mode, startX: p.x, startY: p.y, orig: { ...t } });
    onSelect(t.id);
  };

  useEffect(() => {
    if (!drag) return;
    const onMove = (e: MouseEvent) => {
      const p = svgPoint(e);
      const dx = p.x - drag.startX;
      const dy = p.y - drag.startY;
      if (drag.mode === 'move') {
        const nx = Math.max(0, Math.min(VIEW_W - drag.orig.w, snap(drag.orig.x + dx)));
        const ny = Math.max(0, Math.min(VIEW_H - drag.orig.h, snap(drag.orig.y + dy)));
        setPreview({ [drag.id]: { x: nx, y: ny } });
      } else {
        const nw = Math.max(30, Math.min(VIEW_W - drag.orig.x, snap(drag.orig.w + dx)));
        const nh = Math.max(30, Math.min(VIEW_H - drag.orig.y, snap(drag.orig.h + dy)));
        setPreview({ [drag.id]: { w: nw, h: nh } });
      }
    };
    const onUp = () => {
      const patch = preview[drag.id];
      if (patch && Object.keys(patch).length) onUpdate(drag.id, patch);
      setDrag(null);
      setPreview({});
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [drag, preview]);

  const getTable = (t: T) => ({ ...t, ...preview[t.id] });

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className="w-full h-auto select-none"
      style={{ cursor: drag ? (drag.mode === 'resize' ? 'nwse-resize' : 'grabbing') : 'default', touchAction: 'none' }}
      onClick={() => !drag && onSelect('')}
    >
      {/* Grid (subtle) */}
      <defs>
        <pattern id="grid" width={GRID * 4} height={GRID * 4} patternUnits="userSpaceOnUse">
          <path d={`M ${GRID * 4} 0 L 0 0 0 ${GRID * 4}`} fill="none" stroke="#292524" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width={VIEW_W} height={VIEW_H} fill="url(#grid)" opacity="0.5" />

      {/* Zones */}
      <rect x="15" y="15" width="470" height="270" rx="8" fill="transparent" stroke="#44403c" strokeDasharray="4 4" pointerEvents="none" />
      <text x="25" y="32" fontSize="10" fill="#57534e" fontFamily="monospace" letterSpacing="2" pointerEvents="none">INTERIOR</text>
      <rect x="240" y="290" width="245" height="100" rx="8" fill="transparent" stroke="#44403c" strokeDasharray="4 4" pointerEvents="none" />
      <text x="250" y="307" fontSize="10" fill="#57534e" fontFamily="monospace" letterSpacing="2" pointerEvents="none">TERRAZA</text>

      {tables.map(t => {
        const tt = getTable(t);
        const active = selectedId === tt.id;
        return (
          <g key={tt.id} style={{ opacity: tt.active ? 1 : 0.35 }}>
            <rect
              x={tt.x} y={tt.y} width={tt.w} height={tt.h} rx="4"
              fill={active ? '#ea580c' : '#292524'}
              stroke={active ? '#fff' : '#44403c'}
              strokeWidth={active ? 2 : 1.5}
              style={{ cursor: 'grab' }}
              onMouseDown={e => onMouseDown(e, tt, 'move')}
            />
            <text x={tt.x + tt.w / 2} y={tt.y + tt.h / 2 - 4} textAnchor="middle" fontSize="14" fontWeight="900" fill={active ? '#fff' : '#f5f5f4'} fontFamily="'Exo 2', sans-serif" pointerEvents="none">{tt.id}</text>
            <text x={tt.x + tt.w / 2} y={tt.y + tt.h / 2 + 12} textAnchor="middle" fontSize="10" fill={active ? '#fff' : '#a8a29e'} fontFamily="monospace" pointerEvents="none">{tt.capacity}p</text>
            {/* resize handle (bottom-right) — only on selected */}
            {active && (
              <rect
                x={tt.x + tt.w - 8} y={tt.y + tt.h - 8} width={10} height={10}
                fill="#fff" stroke="#ea580c" strokeWidth={1.5} rx={1}
                style={{ cursor: 'nwse-resize' }}
                onMouseDown={e => onMouseDown(e, tt, 'resize')}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div><label className="block text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mb-1">{label}</label>{children}</div>
);

const BookingsList: React.FC<{ bookings: Booking[]; date: string; onDateChange: (d: string) => void; onRefresh: () => void }> = ({ bookings, date, onDateChange, onRefresh }) => {
  const update = async (id: number, status: string) => {
    await dataService.updateSobremesaBooking(id, { status });
    onRefresh();
  };
  const markPaid = async (id: number) => {
    await dataService.markSobremesaPaid(id);
    onRefresh();
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <CalIcon size={16} className="text-orange-500" />
        <input type="date" value={date} onChange={e => onDateChange(e.target.value)}
          className="bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white text-sm" />
        <span className="text-gray-500 text-xs">{bookings.length} reservas</span>
      </div>

      {bookings.length === 0 ? (
        <div className="py-20 text-center text-gray-500">Sin reservas para ese día</div>
      ) : (
        <div className="space-y-2">
          {bookings.map(b => (
            <div key={b.id} className="p-4 bg-stone-900 border border-stone-800 rounded-xl flex items-center gap-4 flex-wrap">
              <div className="font-mono text-orange-500 font-black text-sm shrink-0">{b.slot}</div>
              <div className="font-black text-white text-sm shrink-0">{b.table_id}</div>
              <div className="flex-1 min-w-[200px]">
                <div className="text-white text-sm"><b>{b.name}</b> · {b.guests}p</div>
                <div className="text-gray-500 text-xs">{b.email} · {b.phone || '-'}</div>
                {b.payment_ref && <div className="text-gray-600 text-[11px] font-mono mt-0.5">Ref: {b.payment_ref}</div>}
                {b.notes && <div className="text-gray-600 text-[11px] italic mt-1">{b.notes}</div>}
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-[10px] font-black text-white">{(b.amount_cents/100).toFixed(2).replace('.', ',')}€</span>
                <span className="text-[9px] text-gray-500 uppercase tracking-wider">{b.payment_method}</span>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${b.payment_status === 'paid' ? 'bg-green-500/15 text-green-400' : b.payment_status === 'pending' ? 'bg-orange-500/15 text-orange-400' : 'bg-red-500/15 text-red-400'}`}>
                {b.payment_status === 'paid' ? 'Pagado' : b.payment_status === 'pending' ? 'Pendiente' : b.payment_status}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-stone-800 text-gray-400">{b.byo}</span>
              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${b.status === 'confirmed' ? 'bg-green-500/15 text-green-400' : b.status === 'cancelled' ? 'bg-red-500/15 text-red-400' : b.status === 'completed' ? 'bg-blue-500/15 text-blue-400' : 'bg-gray-700 text-gray-300'}`}>{b.status}</span>
              <div className="flex gap-1">
                {b.payment_status === 'pending' && (
                  <button onClick={() => markPaid(b.id)} title="Marcar pagado" className="px-2 py-1 bg-green-600 hover:bg-green-500 text-white text-[10px] font-black uppercase tracking-widest rounded">PAGADO</button>
                )}
                {b.status === 'confirmed' && (
                  <>
                    <button onClick={() => update(b.id, 'cancelled')} title="Cancelar" className="p-1.5 text-red-400 hover:bg-red-500/10 rounded"><X size={13} /></button>
                    <button onClick={() => update(b.id, 'completed')} title="Marcar completada" className="p-1.5 text-green-400 hover:bg-green-500/10 rounded"><Check size={13} /></button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
