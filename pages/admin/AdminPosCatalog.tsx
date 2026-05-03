import React, { useEffect, useState } from 'react';
import { Loader2, Plus, Trash2, Edit3, X, Save, Check } from 'lucide-react';
import { dataService } from '../../services/dataService';

interface Category { id: string; name: string; color: string; sort_order: number; active: boolean; }
interface Product { id: string; category_id: string; name: string; price_cents: number; available: boolean; sort_order: number; image_url: string | null; }

export const AdminPosCatalog: React.FC = () => {
  const [cats, setCats] = useState<Category[]>([]);
  const [prods, setProds] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [newCat, setNewCat] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [c, p] = await Promise.all([dataService.getPosCategories(), dataService.getPosProducts()]);
      setCats(c);
      setProds(p);
    } catch {}
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  if (loading) return <div className="py-20 text-center"><Loader2 className="animate-spin text-orange-500 w-8 h-8 mx-auto" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">Catálogo POS</h2>
          <p className="text-[11px] text-gray-500 mt-1">Productos del TPV para el bar · se ven en pos.mat32.com</p>
        </div>
        <a href="/pos" target="_blank" rel="noopener" className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-gray-300 text-xs font-bold rounded-lg">Abrir POS ↗</a>
      </div>

      {/* Categorías */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4">
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-3">CATEGORÍAS</div>
        <div className="flex flex-wrap gap-2">
          {cats.map(c => <CatChip key={c.id} c={c} onChange={load} count={prods.filter(p => p.category_id === c.id).length} />)}
          <div className="flex items-center gap-1">
            <input value={newCat} onChange={e => setNewCat(e.target.value)}
              onKeyDown={async e => { if (e.key === 'Enter' && newCat.trim()) { await dataService.createPosCategory({ name: newCat.trim(), sort_order: cats.length }); setNewCat(''); load(); } }}
              placeholder="Nueva categoría"
              className="bg-stone-800 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-white w-40" />
            <button onClick={async () => { if (newCat.trim()) { await dataService.createPosCategory({ name: newCat.trim(), sort_order: cats.length }); setNewCat(''); load(); } }}
              className="p-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg"><Plus size={13} /></button>
          </div>
        </div>
      </div>

      {/* Productos por categoría */}
      <div className="space-y-6">
        {cats.map(c => {
          const list = prods.filter(p => p.category_id === c.id).sort((a, b) => a.sort_order - b.sort_order);
          return (
            <div key={c.id} className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-stone-800/40 border-b border-stone-800" style={{ borderLeftWidth: 4, borderLeftColor: c.color }}>
                <h3 className="text-sm font-black uppercase tracking-wider text-white">{c.name} <span className="text-gray-500">({list.length})</span></h3>
                <button onClick={() => setEditing({ id: '', category_id: c.id, name: '', price_cents: 0, available: true, sort_order: list.length, image_url: null })}
                  className="flex items-center gap-1 px-2.5 py-1 bg-orange-600 hover:bg-orange-500 text-white text-[11px] font-bold rounded-lg"><Plus size={12} /> Producto</button>
              </div>
              {list.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500 text-xs">Sin productos</div>
              ) : (
                <div className="divide-y divide-stone-800">
                  {list.map(p => (
                    <div key={p.id} className="group px-4 py-2.5 hover:bg-stone-800/30 flex items-center gap-4">
                      <div className="flex-1 min-w-0 flex items-center gap-2">
                        <span className={`text-sm font-black ${p.available ? 'text-white' : 'text-gray-500 line-through'}`}>{p.name}</span>
                        {!p.available && <span className="text-[9px] font-black text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">OFF</span>}
                      </div>
                      <div className="text-white font-black text-sm tabular-nums shrink-0">{(p.price_cents/100).toFixed(2)}€</div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditing(p)} className="p-1.5 text-gray-500 hover:text-orange-400"><Edit3 size={13} /></button>
                        <button onClick={async () => { if (confirm('Eliminar producto?')) { await dataService.deletePosProduct(p.id); load(); } }} className="p-1.5 text-gray-500 hover:text-red-400"><Trash2 size={13} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {editing && <EditProductModal p={editing} cats={cats} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
};

const CatChip: React.FC<{ c: Category; count: number; onChange: () => void }> = ({ c, count, onChange }) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(c.name);
  const [color, setColor] = useState(c.color);
  return editing ? (
    <div className="flex items-center gap-1 bg-stone-800 rounded-lg px-2">
      <input value={name} onChange={e => setName(e.target.value)}
        onKeyDown={async e => { if (e.key === 'Enter') { await dataService.updatePosCategory(c.id, { name, color }); setEditing(false); onChange(); } }}
        autoFocus className="bg-transparent text-white text-xs py-1.5 w-28" />
      <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-6 h-6 border-0 bg-transparent" />
      <button onClick={async () => { await dataService.updatePosCategory(c.id, { name, color }); setEditing(false); onChange(); }} className="text-green-400"><Check size={12} /></button>
      <button onClick={() => { setEditing(false); setName(c.name); setColor(c.color); }} className="text-gray-500"><X size={12} /></button>
    </div>
  ) : (
    <div className="flex items-center gap-1 bg-stone-800 border border-stone-700 rounded-lg px-3 py-1.5" style={{ borderLeftWidth: 3, borderLeftColor: c.color }}>
      <span className="text-xs text-white font-bold">{c.name}</span>
      <span className="text-[9px] text-gray-500">({count})</span>
      <button onClick={() => setEditing(true)} className="ml-1 text-gray-500 hover:text-orange-400"><Edit3 size={10} /></button>
      <button onClick={async () => { if (confirm(`Eliminar "${c.name}"? Los productos quedarán sin categoría.`)) { await dataService.deletePosCategory(c.id); onChange(); } }} className="text-gray-500 hover:text-red-400"><Trash2 size={10} /></button>
    </div>
  );
};

const EditProductModal: React.FC<{ p: Product; cats: Category[]; onClose: () => void; onSaved: () => void }> = ({ p, cats, onClose, onSaved }) => {
  const [d, setD] = useState(p);
  const [busy, setBusy] = useState(false);
  const isNew = !d.id;

  const save = async () => {
    setBusy(true);
    try {
      if (isNew) await dataService.createPosProduct(d);
      else await dataService.updatePosProduct(d.id, d);
      onSaved();
    } catch { alert('Error'); }
    setBusy(false);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800">
          <h3 className="text-lg font-black text-white uppercase">{isNew ? 'Nuevo producto' : 'Editar'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-1.5">Categoría</label>
            <select value={d.category_id || ''} onChange={e => setD({ ...d, category_id: e.target.value })} className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-white text-sm">
              {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-1.5">Nombre *</label>
            <input value={d.name} onChange={e => setD({ ...d, name: e.target.value })} className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-white text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-1.5">Precio €</label>
            <input type="number" step="0.01" min="0" value={(d.price_cents/100).toFixed(2)}
              onChange={e => setD({ ...d, price_cents: Math.round(parseFloat(e.target.value || '0') * 100) })}
              className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-white text-xl font-black" />
          </div>
          <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
            <input type="checkbox" checked={d.available} onChange={e => setD({ ...d, available: e.target.checked })} className="accent-orange-500" />
            Disponible en el POS
          </label>
        </div>
        <div className="px-6 py-4 border-t border-stone-800 flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 bg-stone-800 text-white text-xs font-black uppercase rounded-lg">Cancelar</button>
          <button onClick={save} disabled={busy || !d.name} className="flex-1 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-xs font-black uppercase rounded-lg flex items-center justify-center gap-1">
            {busy ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} GUARDAR
          </button>
        </div>
      </div>
    </div>
  );
};
