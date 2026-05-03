import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Save, X, GripVertical, Star, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { dataService } from '../../services/dataService';

interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  price: string;
  description: string;
  highlight: boolean;
  sort_order: number;
}

interface MenuCategory {
  id: string;
  title: string;
  sort_order: number;
  items: MenuItem[];
}

export const AdminMenu: React.FC = () => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [newCatTitle, setNewCatTitle] = useState('');
  const [showNewCat, setShowNewCat] = useState(false);
  const [newItems, setNewItems] = useState<Record<string, Partial<MenuItem>>>({});

  const load = async () => {
    setLoading(true);
    try {
      const data = await dataService.getMenu();
      setCategories(data);
    } catch (err) {
      console.warn('Failed to load menu:', err);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const addCategory = async () => {
    if (!newCatTitle.trim()) return;
    setSaving(true);
    try {
      await dataService.createMenuCategory({ title: newCatTitle.trim(), sort_order: categories.length });
      setNewCatTitle('');
      setShowNewCat(false);
      await load();
    } catch (err) { alert('Error al crear categoría'); }
    setSaving(false);
  };

  const updateCategory = async (id: string, title: string) => {
    setSaving(true);
    try {
      await dataService.updateMenuCategory(id, { title });
      setEditingCat(null);
      await load();
    } catch (err) { alert('Error al actualizar'); }
    setSaving(false);
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('¿Eliminar esta categoría y todos sus items?')) return;
    setSaving(true);
    try {
      await dataService.deleteMenuCategory(id);
      await load();
    } catch (err) { alert('Error al eliminar'); }
    setSaving(false);
  };

  const addItem = async (categoryId: string) => {
    const draft = newItems[categoryId];
    if (!draft?.name?.trim() || !draft?.price?.trim()) return;
    setSaving(true);
    try {
      const cat = categories.find(c => c.id === categoryId);
      await dataService.createMenuItem({
        category_id: categoryId,
        name: draft.name!.trim(),
        price: draft.price!.trim(),
        description: draft.description?.trim() || '',
        highlight: draft.highlight || false,
        sort_order: cat?.items.length || 0,
      });
      setNewItems(prev => ({ ...prev, [categoryId]: {} }));
      await load();
    } catch (err) { alert('Error al crear item'); }
    setSaving(false);
  };

  const updateItem = async (id: string, data: Partial<MenuItem>) => {
    setSaving(true);
    try {
      await dataService.updateMenuItem(id, data);
      setEditingItem(null);
      await load();
    } catch (err) { alert('Error al actualizar'); }
    setSaving(false);
  };

  const deleteItem = async (id: string) => {
    if (!confirm('¿Eliminar este item?')) return;
    setSaving(true);
    try {
      await dataService.deleteMenuItem(id);
      await load();
    } catch (err) { alert('Error al eliminar'); }
    setSaving(false);
  };

  const moveCategory = async (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= categories.length) return;
    const reordered = [...categories];
    [reordered[idx], reordered[newIdx]] = [reordered[newIdx], reordered[idx]];
    const updates = reordered.map((c, i) => ({ id: c.id, sort_order: i }));
    setSaving(true);
    try {
      await dataService.reorderMenu({ categories: updates });
      await load();
    } catch (err) { alert('Error al reordenar'); }
    setSaving(false);
  };

  const moveItem = async (catIdx: number, itemIdx: number, dir: -1 | 1) => {
    const cat = categories[catIdx];
    const newIdx = itemIdx + dir;
    if (newIdx < 0 || newIdx >= cat.items.length) return;
    const reordered = [...cat.items];
    [reordered[itemIdx], reordered[newIdx]] = [reordered[newIdx], reordered[itemIdx]];
    const updates = reordered.map((item, i) => ({ id: item.id, sort_order: i }));
    setSaving(true);
    try {
      await dataService.reorderMenu({ items: updates });
      await load();
    } catch (err) { alert('Error al reordenar'); }
    setSaving(false);
  };

  if (loading) {
    return <div className="flex justify-center py-40"><Loader2 className="animate-spin text-orange-500 w-8 h-8" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-white uppercase tracking-tight">Carta / Menú</h2>
        <div className="flex gap-2">
          <a href="https://www.mat32.com/mat32-bar/" target="_blank" rel="noopener" className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-gray-300 text-xs font-bold rounded-lg transition-colors">Ver carta pública ↗</a>
          <button onClick={() => setShowNewCat(true)} className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"><Plus size={14} /> Categoría</button>
        </div>
      </div>

      {showNewCat && (
        <div className="flex gap-2 items-center bg-stone-900 border border-stone-700 rounded-xl p-4">
          <input
            autoFocus
            value={newCatTitle}
            onChange={e => setNewCatTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCategory()}
            placeholder="Nombre de categoría (ej: CÓCTELES ESPECIALES)"
            className="flex-1 bg-stone-800 border border-stone-600 rounded-lg px-3 py-2 text-white text-sm"
          />
          <button onClick={addCategory} disabled={saving} className="px-3 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-lg"><Save size={14} /></button>
          <button onClick={() => { setShowNewCat(false); setNewCatTitle(''); }} className="px-3 py-2 bg-stone-700 hover:bg-stone-600 text-gray-300 text-xs font-bold rounded-lg"><X size={14} /></button>
        </div>
      )}

      {categories.map((cat, catIdx) => (
        <div key={cat.id} className="bg-stone-900 border border-stone-700 rounded-xl overflow-hidden">
          {/* Category header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-stone-800/50 border-b border-stone-700">
            <div className="flex flex-col gap-0.5">
              <button onClick={() => moveCategory(catIdx, -1)} disabled={catIdx === 0} className="text-gray-500 hover:text-white disabled:opacity-20"><ChevronUp size={12} /></button>
              <button onClick={() => moveCategory(catIdx, 1)} disabled={catIdx === categories.length - 1} className="text-gray-500 hover:text-white disabled:opacity-20"><ChevronDown size={12} /></button>
            </div>
            {editingCat === cat.id ? (
              <EditableCatTitle
                initial={cat.title}
                onSave={title => updateCategory(cat.id, title)}
                onCancel={() => setEditingCat(null)}
              />
            ) : (
              <>
                <h3 className="flex-1 text-sm font-black text-white uppercase tracking-wider">{cat.title}</h3>
                <span className="text-[10px] text-gray-500 font-bold">{cat.items.length} items</span>
                <button onClick={() => setEditingCat(cat.id)} className="p-1 text-gray-500 hover:text-orange-400"><Edit3 size={14} /></button>
                <button onClick={() => deleteCategory(cat.id)} className="p-1 text-gray-500 hover:text-red-400"><Trash2 size={14} /></button>
              </>
            )}
          </div>

          {/* Items */}
          <div className="divide-y divide-stone-800">
            {cat.items.map((item, itemIdx) => (
              <div key={item.id} className="group">
                {editingItem === item.id ? (
                  <EditableItem
                    item={item}
                    onSave={data => updateItem(item.id, data)}
                    onCancel={() => setEditingItem(null)}
                  />
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 hover:bg-stone-800/30 transition-colors">
                    <div className="flex flex-col gap-0.5">
                      <button onClick={() => moveItem(catIdx, itemIdx, -1)} disabled={itemIdx === 0} className="text-gray-600 hover:text-white disabled:opacity-20"><ChevronUp size={10} /></button>
                      <button onClick={() => moveItem(catIdx, itemIdx, 1)} disabled={itemIdx === cat.items.length - 1} className="text-gray-600 hover:text-white disabled:opacity-20"><ChevronDown size={10} /></button>
                    </div>
                    {item.highlight && <Star size={12} className="text-orange-500 fill-orange-500 shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className={`text-sm font-bold uppercase tracking-wide ${item.highlight ? 'text-orange-400' : 'text-white'}`}>{item.name}</span>
                        <span className="text-xs text-gray-500 truncate">{item.description}</span>
                      </div>
                    </div>
                    <span className="text-sm font-black text-orange-400 tabular-nums shrink-0">€{item.price}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditingItem(item.id)} className="p-1 text-gray-500 hover:text-orange-400"><Edit3 size={13} /></button>
                      <button onClick={() => deleteItem(item.id)} className="p-1 text-gray-500 hover:text-red-400"><Trash2 size={13} /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add item inline */}
          <div className="px-4 py-3 border-t border-stone-800 bg-stone-900/50">
            <NewItemRow
              draft={newItems[cat.id] || {}}
              onChange={d => setNewItems(prev => ({ ...prev, [cat.id]: d }))}
              onAdd={() => addItem(cat.id)}
              saving={saving}
            />
          </div>
        </div>
      ))}

      {categories.length === 0 && !showNewCat && (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg font-bold mb-2">No hay categorías en la carta</p>
          <p className="text-sm">Crea tu primera categoría para empezar</p>
        </div>
      )}
    </div>
  );
};

const EditableCatTitle: React.FC<{ initial: string; onSave: (v: string) => void; onCancel: () => void }> = ({ initial, onSave, onCancel }) => {
  const [val, setVal] = useState(initial);
  return (
    <div className="flex-1 flex gap-2">
      <input autoFocus value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') onSave(val); if (e.key === 'Escape') onCancel(); }}
        className="flex-1 bg-stone-800 border border-stone-600 rounded px-2 py-1 text-white text-sm font-bold uppercase" />
      <button onClick={() => onSave(val)} className="p-1 text-green-400 hover:text-green-300"><Save size={14} /></button>
      <button onClick={onCancel} className="p-1 text-gray-400 hover:text-gray-300"><X size={14} /></button>
    </div>
  );
};

const EditableItem: React.FC<{ item: MenuItem; onSave: (data: Partial<MenuItem>) => void; onCancel: () => void }> = ({ item, onSave, onCancel }) => {
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price);
  const [description, setDescription] = useState(item.description || '');
  const [highlight, setHighlight] = useState(item.highlight);
  return (
    <div className="px-4 py-3 bg-stone-800/50 space-y-2">
      <div className="grid grid-cols-[1fr_100px] gap-2">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre" className="bg-stone-800 border border-stone-600 rounded px-2 py-1.5 text-white text-sm font-bold uppercase" />
        <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Precio" className="bg-stone-800 border border-stone-600 rounded px-2 py-1.5 text-white text-sm text-right" />
      </div>
      <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Descripción (opcional)" className="w-full bg-stone-800 border border-stone-600 rounded px-2 py-1.5 text-gray-300 text-xs" />
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
          <input type="checkbox" checked={highlight} onChange={e => setHighlight(e.target.checked)} className="accent-orange-500" />
          <Star size={12} className={highlight ? 'text-orange-500 fill-orange-500' : 'text-gray-600'} /> Destacado
        </label>
        <div className="flex gap-2">
          <button onClick={() => onSave({ name, price, description, highlight })} className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded"><Save size={12} /></button>
          <button onClick={onCancel} className="px-3 py-1 bg-stone-700 hover:bg-stone-600 text-gray-300 text-xs font-bold rounded"><X size={12} /></button>
        </div>
      </div>
    </div>
  );
};

const NewItemRow: React.FC<{ draft: Partial<MenuItem>; onChange: (d: Partial<MenuItem>) => void; onAdd: () => void; saving: boolean }> = ({ draft, onChange, onAdd, saving }) => (
  <div className="flex gap-2 items-center">
    <input
      value={draft.name || ''}
      onChange={e => onChange({ ...draft, name: e.target.value })}
      onKeyDown={e => e.key === 'Enter' && onAdd()}
      placeholder="Nuevo item..."
      className="flex-1 bg-stone-800 border border-stone-700 rounded-lg px-3 py-1.5 text-white text-xs placeholder-gray-600"
    />
    <input
      value={draft.price || ''}
      onChange={e => onChange({ ...draft, price: e.target.value })}
      onKeyDown={e => e.key === 'Enter' && onAdd()}
      placeholder="€"
      className="w-20 bg-stone-800 border border-stone-700 rounded-lg px-3 py-1.5 text-white text-xs text-right placeholder-gray-600"
    />
    <button onClick={onAdd} disabled={saving || !draft.name?.trim() || !draft.price?.trim()} className="p-1.5 bg-orange-600 hover:bg-orange-500 disabled:bg-stone-700 disabled:text-gray-600 text-white rounded-lg transition-colors"><Plus size={14} /></button>
  </div>
);
