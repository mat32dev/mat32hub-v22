import React, { useEffect, useState } from 'react';
import { Loader2, Plus, Trash2, Edit3, X, Save, TrendingUp, Check } from 'lucide-react';
import { dataService } from '../../services/dataService';

interface Category { id: string; name: string; sort_order: number; active: boolean; }
interface Item {
  id: string; category_id: string; name: string; description: string | null; image_url: string | null;
  price_customer_cents: number; cost_provider_cents: number; provider: string | null;
  available: boolean; allergens: string | null; sort_order: number;
}

export const AdminFood: React.FC = () => {
  const [cats, setCats] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Item | null>(null);
  const [newCat, setNewCat] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [c, i] = await Promise.all([
        dataService.getFoodCategories(),
        dataService.getFoodItems(),
      ]);
      setCats(c);
      setItems(i);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const totalSales = items.reduce((s, i) => s + i.price_customer_cents * (i.available ? 1 : 0), 0);
  const totalMargin = items.reduce((s, i) => s + (i.price_customer_cents - i.cost_provider_cents) * (i.available ? 1 : 0), 0);

  if (loading) return <div className="py-20 text-center"><Loader2 className="animate-spin text-orange-500 w-8 h-8 mx-auto" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">Menú MAT32 · Comida</h2>
          <p className="text-[11px] text-gray-500 mt-1">Platos que se pueden pedir al reservar mesa Sobremesa</p>
        </div>
        <div className="flex items-center gap-6 text-xs">
          <div><span className="text-gray-500">PVP total: </span><b className="text-white">{(totalSales/100).toFixed(2)}€</b></div>
          <div><span className="text-gray-500">Margen total: </span><b className="text-green-400"><TrendingUp size={11} className="inline" /> {(totalMargin/100).toFixed(2)}€</b></div>
        </div>
      </div>

      {/* Categories bar */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">CATEGORÍAS</div>
        </div>
        <div className="flex flex-wrap gap-2">
          {cats.map(c => (
            <CategoryChip key={c.id} c={c} itemCount={items.filter(i => i.category_id === c.id).length} onChange={load} />
          ))}
          <div className="flex items-center gap-1">
            <input value={newCat} onChange={e => setNewCat(e.target.value)}
              onKeyDown={async e => { if (e.key === 'Enter' && newCat.trim()) { await dataService.createFoodCategory({ name: newCat.trim(), sort_order: cats.length }); setNewCat(''); load(); } }}
              placeholder="Nueva categoría"
              className="bg-stone-800 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-white w-40" />
            <button onClick={async () => { if (newCat.trim()) { await dataService.createFoodCategory({ name: newCat.trim(), sort_order: cats.length }); setNewCat(''); load(); } }}
              className="p-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg"><Plus size={13} /></button>
          </div>
        </div>
      </div>

      {/* Items grouped by category */}
      <div className="space-y-6">
        {cats.map(c => {
          const catItems = items.filter(i => i.category_id === c.id).sort((a, b) => a.sort_order - b.sort_order);
          return (
            <div key={c.id} className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-stone-800/40 border-b border-stone-800">
                <h3 className="text-sm font-black uppercase tracking-wider text-white">{c.name} <span className="text-gray-500">({catItems.length})</span></h3>
                <button onClick={() => setEditing({ id: '', category_id: c.id, name: '', description: '', image_url: '', price_customer_cents: 0, cost_provider_cents: 0, provider: '', available: true, allergens: '', sort_order: catItems.length })}
                  className="flex items-center gap-1 px-2.5 py-1 bg-orange-600 hover:bg-orange-500 text-white text-[11px] font-bold rounded-lg"><Plus size={12} /> Plato</button>
              </div>
              {catItems.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500 text-xs">Sin platos</div>
              ) : (
                <div className="divide-y divide-stone-800">
                  {catItems.map(i => {
                    const margin = i.price_customer_cents - i.cost_provider_cents;
                    const marginPct = i.price_customer_cents ? Math.round(margin / i.price_customer_cents * 100) : 0;
                    return (
                      <div key={i.id} className="group px-4 py-3 hover:bg-stone-800/30 flex items-center gap-4">
                        {i.image_url && <img src={i.image_url} alt={i.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-black ${i.available ? 'text-white' : 'text-gray-500 line-through'}`}>{i.name}</span>
                            {!i.available && <span className="text-[9px] font-black text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">OFF</span>}
                          </div>
                          {i.description && <div className="text-[11px] text-gray-500 truncate">{i.description}</div>}
                          {(i.provider || i.allergens) && (
                            <div className="text-[10px] text-gray-600 mt-0.5">
                              {i.provider && <span>Prov: {i.provider}</span>}
                              {i.provider && i.allergens && ' · '}
                              {i.allergens && <span>Alérg: {i.allergens}</span>}
                            </div>
                          )}
                        </div>
                        <div className="text-right text-xs shrink-0 space-y-0.5">
                          <div className="text-white font-black">{(i.price_customer_cents/100).toFixed(2)}€</div>
                          <div className="text-gray-500 text-[10px]">Coste {(i.cost_provider_cents/100).toFixed(2)}€</div>
                          <div className={`text-[10px] font-bold ${marginPct >= 40 ? 'text-green-400' : marginPct >= 20 ? 'text-yellow-400' : 'text-red-400'}`}>
                            +{(margin/100).toFixed(2)}€ ({marginPct}%)
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setEditing(i)} className="p-1.5 text-gray-500 hover:text-orange-400"><Edit3 size={13} /></button>
                          <button onClick={async () => { if (confirm('Eliminar plato?')) { await dataService.deleteFoodItem(i.id); load(); } }} className="p-1.5 text-gray-500 hover:text-red-400"><Trash2 size={13} /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {editing && <EditItemModal item={editing} categories={cats} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
};

const CategoryChip: React.FC<{ c: Category; itemCount: number; onChange: () => void }> = ({ c, itemCount, onChange }) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(c.name);
  return editing ? (
    <div className="flex items-center gap-1 bg-stone-800 rounded-lg px-2">
      <input autoFocus value={name} onChange={e => setName(e.target.value)}
        onKeyDown={async e => { if (e.key === 'Enter') { await dataService.updateFoodCategory(c.id, { name }); setEditing(false); onChange(); } }}
        className="bg-transparent text-white text-xs py-1.5 w-28" />
      <button onClick={async () => { await dataService.updateFoodCategory(c.id, { name }); setEditing(false); onChange(); }} className="text-green-400"><Check size={12} /></button>
      <button onClick={() => { setEditing(false); setName(c.name); }} className="text-gray-500"><X size={12} /></button>
    </div>
  ) : (
    <div className="flex items-center gap-1 bg-stone-800 border border-stone-700 rounded-lg px-3 py-1.5">
      <span className="text-xs text-white font-bold">{c.name}</span>
      <span className="text-[9px] text-gray-500">({itemCount})</span>
      <button onClick={() => setEditing(true)} className="ml-1 text-gray-500 hover:text-orange-400"><Edit3 size={10} /></button>
      <button onClick={async () => { if (confirm(`Eliminar categoría "${c.name}"? Los platos quedarán sin categoría.`)) { await dataService.deleteFoodCategory(c.id); onChange(); } }} className="text-gray-500 hover:text-red-400"><Trash2 size={10} /></button>
    </div>
  );
};

const EditItemModal: React.FC<{ item: Item; categories: Category[]; onClose: () => void; onSaved: () => void }> = ({ item, categories, onClose, onSaved }) => {
  const [d, setD] = useState(item);
  const [busy, setBusy] = useState(false);
  const isNew = !d.id;
  const margin = d.price_customer_cents - d.cost_provider_cents;
  const marginPct = d.price_customer_cents ? Math.round(margin / d.price_customer_cents * 100) : 0;

  const save = async () => {
    setBusy(true);
    try {
      if (isNew) await dataService.createFoodItem(d);
      else await dataService.updateFoodItem(d.id, d);
      onSaved();
    } catch { alert('Error'); }
    setBusy(false);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800">
          <h3 className="text-lg font-black text-white uppercase">{isNew ? 'Nuevo plato' : 'Editar plato'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <FieldF label="Categoría">
            <select value={d.category_id || ''} onChange={e => setD({ ...d, category_id: e.target.value })} className="input">
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </FieldF>
          <FieldF label="Nombre *">
            <input value={d.name} onChange={e => setD({ ...d, name: e.target.value })} className="input" />
          </FieldF>
          <FieldF label="Descripción">
            <textarea rows={2} value={d.description || ''} onChange={e => setD({ ...d, description: e.target.value })} className="input" />
          </FieldF>
          <FieldF label="URL imagen (opcional)">
            <input value={d.image_url || ''} onChange={e => setD({ ...d, image_url: e.target.value })} className="input" placeholder="https://..." />
          </FieldF>

          <div className="grid grid-cols-2 gap-3">
            <FieldF label="PVP (€) *">
              <input type="number" step="0.01" min="0" value={(d.price_customer_cents/100).toFixed(2)}
                onChange={e => setD({ ...d, price_customer_cents: Math.round(parseFloat(e.target.value || '0') * 100) })} className="input" />
            </FieldF>
            <FieldF label="Coste proveedor (€)">
              <input type="number" step="0.01" min="0" value={(d.cost_provider_cents/100).toFixed(2)}
                onChange={e => setD({ ...d, cost_provider_cents: Math.round(parseFloat(e.target.value || '0') * 100) })} className="input" />
            </FieldF>
          </div>

          <div className="p-3 bg-stone-800/50 border border-stone-800 rounded-lg flex justify-between items-center">
            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Margen</span>
            <span className={`font-black text-sm ${marginPct >= 40 ? 'text-green-400' : marginPct >= 20 ? 'text-yellow-400' : 'text-red-400'}`}>
              {(margin/100).toFixed(2)}€ ({marginPct}%)
            </span>
          </div>

          <FieldF label="Proveedor">
            <input value={d.provider || ''} onChange={e => setD({ ...d, provider: e.target.value })} className="input" placeholder="Nombre del proveedor" />
          </FieldF>

          <FieldF label="Alérgenos">
            <input value={d.allergens || ''} onChange={e => setD({ ...d, allergens: e.target.value })} className="input" placeholder="Gluten, lactosa, frutos secos..." />
          </FieldF>

          <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
            <input type="checkbox" checked={d.available} onChange={e => setD({ ...d, available: e.target.checked })} className="accent-orange-500" />
            Disponible (visible para clientes)
          </label>
        </div>
        <div className="px-6 py-4 border-t border-stone-800 flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 bg-stone-800 hover:bg-stone-700 text-white text-xs font-black uppercase rounded-lg">Cancelar</button>
          <button onClick={save} disabled={busy || !d.name || !d.category_id} className="flex-1 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-xs font-black uppercase rounded-lg flex items-center justify-center gap-1">
            {busy ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} GUARDAR
          </button>
        </div>
        <style>{`.input { width: 100%; background: #1c1917; border: 1px solid #44403c; border-radius: 8px; padding: 8px 10px; color: white; font-size: 13px; }`}</style>
      </div>
    </div>
  );
};

const FieldF: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div><label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-1.5">{label}</label>{children}</div>
);
