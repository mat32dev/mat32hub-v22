import React, { useEffect, useState } from 'react';
import { Loader2, Edit3, Trash2, ExternalLink, Star, EyeOff, Eye, X, Save, Search, Archive, RefreshCw } from 'lucide-react';
import { dataService } from '../../services/dataService';

interface Item {
  id: number;
  source: string;
  external_id: string | null;
  external_url: string | null;
  title: string | null;
  price_cents: number | null;
  currency: string;
  category: string | null;
  image_url: string | null;
  featured: boolean;
  hidden: boolean;
  sold: boolean;
  scraped_at: string | null;
  published_at: string | null;
}

const CATEGORIES = ['Deco', 'Mobiliario', 'Iluminación', 'Otros'];

export const AdminFondos: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Item | null>(null);
  const [filter, setFilter] = useState<'active' | 'hidden' | 'sold' | 'all'>('active');
  const [search, setSearch] = useState('');
  const [source, setSource] = useState<'all' | 'pamono' | 'manual' | 'instagram'>('all');

  const load = async () => {
    setLoading(true);
    try { setItems(await dataService.getFondosItems()); } catch {}
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = items.filter(i => {
    if (filter === 'active' && (i.hidden || i.sold)) return false;
    if (filter === 'hidden' && !i.hidden) return false;
    if (filter === 'sold' && !i.sold) return false;
    if (source !== 'all' && i.source !== source) return false;
    if (search && !((i.title || '').toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  const update = async (id: number, patch: Partial<Item>) => {
    await dataService.updateFondosItem(id, patch);
    await load();
  };

  const remove = async (id: number) => {
    if (!confirm('¿Eliminar definitivamente?')) return;
    await dataService.deleteFondosItem(id);
    await load();
  };

  const stats = {
    total: items.length,
    active: items.filter(i => !i.hidden && !i.sold).length,
    featured: items.filter(i => i.featured).length,
    hidden: items.filter(i => i.hidden).length,
    sold: items.filter(i => i.sold).length,
  };

  if (loading) return <div className="py-20 text-center"><Loader2 className="animate-spin text-orange-500 w-8 h-8 mx-auto" /></div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">Fondos Reservados</h2>
          <p className="text-[11px] text-gray-500 mt-1">Piezas importadas de Pamono + añadidos manuales</p>
        </div>
        <a href="/fondos-reservados" target="_blank" rel="noopener" className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-gray-300 text-xs font-bold rounded-lg">Ver público ↗</a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3 text-xs">
        <Stat label="Total" value={stats.total} />
        <Stat label="Activos" value={stats.active} color="text-green-400" />
        <Stat label="Destacados" value={stats.featured} color="text-mat-500" />
        <Stat label="Ocultos" value={stats.hidden} color="text-gray-500" />
        <Stat label="Vendidos" value={stats.sold} color="text-blue-400" />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..."
            className="w-full pl-9 pr-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-sm focus:border-orange-500 outline-none" />
        </div>
        <div className="flex gap-1">
          {(['active', 'hidden', 'sold', 'all'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg ${filter === f ? 'bg-orange-600 text-white' : 'bg-stone-800 text-gray-400'}`}>
              {f === 'active' ? 'Activos' : f === 'hidden' ? 'Ocultos' : f === 'sold' ? 'Vendidos' : 'Todo'}
            </button>
          ))}
        </div>
        <select value={source} onChange={e => setSource(e.target.value as any)} className="bg-stone-900 border border-stone-800 rounded-lg text-xs px-3 py-2">
          <option value="all">Toda fuente</option>
          <option value="pamono">Pamono</option>
          <option value="manual">Manual</option>
          <option value="instagram">Instagram</option>
        </select>
      </div>

      {/* Grid of items */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {filtered.map(i => (
          <div key={i.id} className={`group relative bg-stone-900 border rounded-xl overflow-hidden ${i.featured ? 'border-orange-500/40' : 'border-stone-800'} ${i.hidden ? 'opacity-50' : ''}`}>
            <div className="relative aspect-square bg-stone-950 overflow-hidden">
              {i.image_url ? (
                <img src={i.image_url} alt={i.title || ''} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-700">Sin imagen</div>
              )}
              <div className="absolute top-1.5 left-1.5 flex gap-1">
                <span className="text-[8px] font-black uppercase tracking-widest text-white bg-black/60 px-1.5 py-0.5 rounded">{i.source}</span>
                {i.featured && <span className="text-[8px] font-black uppercase tracking-widest text-black bg-orange-500 px-1.5 py-0.5 rounded">★</span>}
                {i.sold && <span className="text-[8px] font-black uppercase tracking-widest text-white bg-blue-500 px-1.5 py-0.5 rounded">Vendido</span>}
              </div>
              <div className="absolute bottom-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => update(i.id, { featured: !i.featured })}
                  title="Destacar" className="p-1.5 bg-black/70 hover:bg-orange-500 rounded"><Star size={11} className={i.featured ? 'fill-orange-500 text-orange-500' : 'text-white'} /></button>
                <button onClick={() => update(i.id, { hidden: !i.hidden })}
                  title="Ocultar" className="p-1.5 bg-black/70 hover:bg-stone-600 rounded">{i.hidden ? <Eye size={11} className="text-white" /> : <EyeOff size={11} className="text-white" />}</button>
                <button onClick={() => update(i.id, { sold: !i.sold })}
                  title={i.sold ? 'Desmarcar vendido' : 'Marcar vendido'} className="p-1.5 bg-black/70 hover:bg-blue-500 rounded"><Archive size={11} className="text-white" /></button>
                <button onClick={() => setEditing(i)} title="Editar" className="p-1.5 bg-black/70 hover:bg-orange-500 rounded"><Edit3 size={11} className="text-white" /></button>
              </div>
            </div>
            <div className="p-2.5 space-y-1">
              <div className="text-[9px] font-black text-orange-400 uppercase tracking-widest">{i.category}</div>
              <div className="text-xs text-white leading-tight line-clamp-2 min-h-[32px]">{i.title || 'Sin título'}</div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-orange-400 tabular-nums">
                  {i.price_cents != null ? `${(i.price_cents / 100).toFixed(2).replace('.', ',')}€` : '—'}
                </span>
                {i.external_url && (
                  <a href={i.external_url} target="_blank" rel="noopener" className="text-gray-500 hover:text-orange-400">
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center text-gray-500 text-sm">Sin items para los filtros actuales</div>
      )}

      {editing && <EditModal item={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} onDelete={() => { remove(editing.id); setEditing(null); }} />}
    </div>
  );
};

const Stat: React.FC<{ label: string; value: number; color?: string }> = ({ label, value, color = 'text-white' }) => (
  <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl">
    <div className="text-[9px] font-black uppercase tracking-widest text-gray-500">{label}</div>
    <div className={`text-xl font-black mt-1 ${color}`}>{value}</div>
  </div>
);

const EditModal: React.FC<{ item: Item; onClose: () => void; onSaved: () => void; onDelete: () => void }> = ({ item, onClose, onSaved, onDelete }) => {
  const [d, setD] = useState(item);
  const [busy, setBusy] = useState(false);
  const save = async () => {
    setBusy(true);
    try {
      await dataService.updateFondosItem(d.id, {
        title: d.title,
        price_cents: d.price_cents,
        category: d.category,
        image_url: d.image_url,
        external_url: d.external_url,
        featured: d.featured,
        hidden: d.hidden,
        sold: d.sold,
      });
      onSaved();
    } catch { alert('Error'); }
    setBusy(false);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800">
          <h3 className="text-lg font-black text-white uppercase">Editar pieza · {item.source}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-3">
          {d.image_url && <img src={d.image_url} alt="" className="w-full aspect-square object-cover rounded-xl" />}
          <F label="Título"><input value={d.title || ''} onChange={e => setD({ ...d, title: e.target.value })} className="input" /></F>
          <div className="grid grid-cols-2 gap-3">
            <F label="Precio €">
              <input type="number" step="0.01" min="0" value={d.price_cents != null ? (d.price_cents / 100).toFixed(2) : ''}
                onChange={e => setD({ ...d, price_cents: e.target.value ? Math.round(parseFloat(e.target.value) * 100) : null })} className="input" />
            </F>
            <F label="Categoría">
              <select value={d.category || ''} onChange={e => setD({ ...d, category: e.target.value })} className="input">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </F>
          </div>
          <F label="URL externa"><input value={d.external_url || ''} onChange={e => setD({ ...d, external_url: e.target.value })} className="input" /></F>
          <F label="URL imagen"><input value={d.image_url || ''} onChange={e => setD({ ...d, image_url: e.target.value })} className="input" /></F>
          <div className="flex gap-4 text-xs pt-2">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={d.featured} onChange={e => setD({ ...d, featured: e.target.checked })} className="accent-orange-500" /> Destacado</label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={d.hidden} onChange={e => setD({ ...d, hidden: e.target.checked })} className="accent-orange-500" /> Oculto</label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={d.sold} onChange={e => setD({ ...d, sold: e.target.checked })} className="accent-orange-500" /> Vendido</label>
          </div>
        </div>
        <div className="px-5 py-4 border-t border-stone-800 flex gap-2">
          <button onClick={onDelete} className="px-4 py-2 border border-red-800 text-red-400 hover:bg-red-500/10 text-xs font-black uppercase rounded-lg">Eliminar</button>
          <div className="flex-1" />
          <button onClick={onClose} className="px-4 py-2 bg-stone-800 text-white text-xs font-black uppercase rounded-lg">Cancelar</button>
          <button onClick={save} disabled={busy} className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-black uppercase rounded-lg flex items-center gap-1">
            {busy ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} GUARDAR
          </button>
        </div>
        <style>{`.input { width: 100%; background: #1c1917; border: 1px solid #44403c; border-radius: 8px; padding: 8px 10px; color: white; font-size: 13px; }`}</style>
      </div>
    </div>
  );
};

const F: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div><label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-1.5">{label}</label>{children}</div>
);
