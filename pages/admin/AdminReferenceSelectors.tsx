import React, { useEffect, useState } from 'react';
import { Loader2, Plus, Edit3, Trash2, Star, EyeOff, Eye, Save, X } from 'lucide-react';
import { dataService } from '../../services/dataService';

interface Sel {
  id: string;
  name: string;
  handle: string | null;
  role: string | null;
  bio: string | null;
  image_url: string | null;
  country: string | null;
  instagram_url: string | null;
  mixcloud_url: string | null;
  soundcloud_url: string | null;
  discogs_url: string | null;
  web_url: string | null;
  tags: string[];
  featured: boolean;
  hidden: boolean;
  sort_order: number;
  tier: 'principal' | 'cercano' | 'supporter' | 'next';
}

const EMPTY: Partial<Sel> = { name: '', tags: [], featured: false, hidden: false, sort_order: 0, tier: 'cercano' };

const TIER_LABELS: Record<string, string> = {
  next: '⏭ Next Selectors',
  principal: '★ Destacados',
  cercano: '◌ Cercanos',
  supporter: '+ Supporters',
};

export const AdminReferenceSelectors: React.FC = () => {
  const [items, setItems] = useState<Sel[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Sel> | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const load = async () => {
    setLoading(true);
    try { setItems(await dataService.getReferenceSelectorsList()); } catch {}
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const toggle = async (id: string, patch: Partial<Sel>) => { await dataService.updateReferenceSelector(id, patch); load(); };
  const remove = async (id: string) => { if (!confirm('¿Eliminar selector?')) return; await dataService.deleteReferenceSelector(id); load(); };

  const filtered = filter === 'all' ? items : items.filter(s => s.tier === filter);

  if (loading) return <div className="py-20 text-center"><Loader2 className="animate-spin text-orange-500 w-8 h-8 mx-auto" /></div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">Reference Selectors</h2>
          <p className="text-[11px] text-gray-500 mt-1">Artistas/colectivos · visibles en /selectors y /open-decks (tier Next)</p>
        </div>
        <div className="flex gap-2">
          <a href="/selectors" target="_blank" rel="noopener" className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-gray-300 text-xs font-bold rounded-lg">Ver /selectors ↗</a>
          <a href="/open-decks" target="_blank" rel="noopener" className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-gray-300 text-xs font-bold rounded-lg">Ver /open-decks ↗</a>
          <button onClick={() => setEditing({ ...EMPTY, tier: 'next' })} className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg flex items-center gap-1">
            <Plus size={13} /> Next Selector
          </button>
          <button onClick={() => setEditing(EMPTY)} className="px-3 py-1.5 bg-stone-700 hover:bg-stone-600 text-white text-xs font-bold rounded-lg flex items-center gap-1">
            <Plus size={13} /> Otros
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'next', 'principal', 'cercano', 'supporter'].map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === t ? 'bg-orange-600 text-white' : 'bg-stone-800 text-gray-400 hover:text-white'}`}>
            {t === 'all' ? 'Todos' : TIER_LABELS[t]} {t !== 'all' && `(${items.filter(s => s.tier === t).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 text-center text-gray-500 text-sm">
          {filter === 'next' ? 'No hay próximos selectores. Pulsa "Next Selector" para añadir.' : 'Sin resultados en este tier.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(s => (
            <div key={s.id} className={`group relative bg-stone-900 border rounded-2xl overflow-hidden ${s.tier === 'next' ? 'border-orange-500/60' : s.featured ? 'border-orange-500/40' : 'border-stone-800'} ${s.hidden ? 'opacity-50' : ''}`}>
              {s.tier === 'next' && (
                <div className="absolute top-0 left-0 right-0 z-10 bg-orange-600 text-white text-[8px] font-black uppercase tracking-widest text-center py-1">⏭ NEXT SELECTOR</div>
              )}
              <div className={`aspect-[4/5] bg-stone-950 overflow-hidden relative ${s.tier === 'next' ? 'pt-6' : ''}`}>
                {s.image_url ? (
                  <img src={s.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-5xl font-black text-stone-800 font-exo">{s.name.slice(0, 2).toUpperCase()}</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3">
                  {s.role && <div className="text-[9px] font-black text-orange-400 uppercase tracking-widest">{s.role}</div>}
                  <div className="text-lg font-black text-white uppercase tracking-tight">{s.name}</div>
                  {s.handle && <div className="text-[10px] text-gray-400">{s.handle}</div>}
                  {s.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {s.tags.slice(0, 4).map(t => (
                        <span key={t} className="text-[7px] font-black uppercase tracking-widest bg-black/50 text-gray-300 px-1.5 py-0.5 rounded">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="absolute top-8 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => toggle(s.id, { featured: !s.featured })} title="Destacar"
                    className="p-1.5 bg-black/70 hover:bg-orange-500 rounded"><Star size={11} className={s.featured ? 'fill-orange-500 text-orange-500' : 'text-white'} /></button>
                  <button onClick={() => toggle(s.id, { hidden: !s.hidden })} title="Ocultar"
                    className="p-1.5 bg-black/70 hover:bg-stone-600 rounded">{s.hidden ? <Eye size={11} className="text-white" /> : <EyeOff size={11} className="text-white" />}</button>
                  <button onClick={() => setEditing(s)} title="Editar"
                    className="p-1.5 bg-black/70 hover:bg-orange-500 rounded"><Edit3 size={11} className="text-white" /></button>
                  <button onClick={() => remove(s.id)} title="Eliminar"
                    className="p-1.5 bg-black/70 hover:bg-red-500 rounded"><Trash2 size={11} className="text-white" /></button>
                </div>
              </div>
              {s.bio && <div className="p-3 text-xs text-gray-400 line-clamp-2">{s.bio}</div>}
              <div className="px-3 pb-2 text-[9px] font-black text-gray-600 uppercase tracking-widest">{TIER_LABELS[s.tier] || s.tier}</div>
            </div>
          ))}
        </div>
      )}

      {editing && <EditModal initial={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
};

const SLOTS = [
  { id: '', label: '— sin slot —' },
  { id: 'SLOT A · 20:00 → 21:15', label: 'SLOT A · 20:00 → 21:15' },
  { id: 'SLOT B · 21:15 → 22:30', label: 'SLOT B · 21:15 → 22:30' },
];

const EditModal: React.FC<{ initial: Partial<Sel>; onClose: () => void; onSaved: () => void }> = ({ initial, onClose, onSaved }) => {
  const [d, setD] = useState<Partial<Sel>>({ ...initial });
  const [busy, setBusy] = useState(false);
  const isNew = !d.id;
  const isNext = d.tier === 'next';
  const tagsStr = (d.tags || []).join(', ');

  const save = async () => {
    if (!d.name?.trim()) return;
    setBusy(true);
    try {
      const payload = {
        name: d.name,
        handle: d.handle || null,
        role: d.role || null,
        bio: d.bio || null,
        image_url: d.image_url || null,
        country: d.country || null,
        instagram_url: d.instagram_url || null,
        mixcloud_url: d.mixcloud_url || null,
        soundcloud_url: d.soundcloud_url || null,
        discogs_url: d.discogs_url || null,
        web_url: d.web_url || null,
        tags: d.tags || [],
        featured: !!d.featured,
        hidden: !!d.hidden,
        sort_order: d.sort_order || 0,
        tier: d.tier || 'cercano',
      };
      if (isNew) await dataService.createReferenceSelector(payload);
      else await dataService.updateReferenceSelector(d.id!, payload);
      onSaved();
    } catch { alert('Error al guardar'); }
    setBusy(false);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800">
          <h3 className="text-lg font-black text-white uppercase">{isNew ? 'Nuevo selector' : 'Editar selector'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-3">
          {d.image_url && <img src={d.image_url} alt="" className="w-full aspect-[4/5] object-cover rounded-xl max-h-[260px]" />}

          <F label="Tier (sección)">
            <select value={d.tier || 'cercano'} onChange={e => setD({ ...d, tier: e.target.value as any })} className="input">
              <option value="next">⏭ Next Selectors (Open Decks)</option>
              <option value="principal">★ Destacados (principales)</option>
              <option value="cercano">◌ Cercanos</option>
              <option value="supporter">+ MAT32 Supporters & Local Talent</option>
            </select>
          </F>

          <div className="grid grid-cols-2 gap-3">
            <F label="Nombre *"><input value={d.name || ''} onChange={e => setD({ ...d, name: e.target.value })} className="input" /></F>
            <F label={isNext ? 'Fecha del set' : '@handle'}>
              <input value={d.handle || ''} onChange={e => setD({ ...d, handle: e.target.value })} className="input" placeholder={isNext ? 'SAB 10 MAY · 2026' : '@usuario'} />
            </F>
          </div>

          {isNext ? (
            <F label="Slot horario">
              <select value={d.role || ''} onChange={e => setD({ ...d, role: e.target.value || null })} className="input">
                {SLOTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </F>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <F label="Rol / tipo"><input value={d.role || ''} onChange={e => setD({ ...d, role: e.target.value })} className="input" placeholder="DJ, Selector, Productor..." /></F>
              <F label="País"><input value={d.country || ''} onChange={e => setD({ ...d, country: e.target.value })} className="input" /></F>
            </div>
          )}

          <F label="URL imagen"><input value={d.image_url || ''} onChange={e => setD({ ...d, image_url: e.target.value })} className="input" placeholder="https://..." /></F>
          <F label={isNext ? 'Nota / bio corta' : 'Bio corta'}>
            <textarea rows={3} value={d.bio || ''} onChange={e => setD({ ...d, bio: e.target.value })} className="input" placeholder={isNext ? 'Géneros, estilo, colección...' : '2-3 frases sobre el selector'} />
          </F>

          <F label={isNext ? 'Géneros (separados por coma)' : 'Tags (separados por coma)'}>
            <input value={tagsStr} onChange={e => setD({ ...d, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} className="input" placeholder={isNext ? 'Jazz, Soul, Ambient...' : 'Soul, Jazz, Valencia...'} />
          </F>

          {!isNext && <F label="Instagram URL"><input value={d.instagram_url || ''} onChange={e => setD({ ...d, instagram_url: e.target.value })} className="input" /></F>}
          <F label="Mixcloud URL"><input value={d.mixcloud_url || ''} onChange={e => setD({ ...d, mixcloud_url: e.target.value })} className="input" /></F>
          <F label="SoundCloud URL"><input value={d.soundcloud_url || ''} onChange={e => setD({ ...d, soundcloud_url: e.target.value })} className="input" /></F>
          {!isNext && (
            <>
              <F label="Discogs URL"><input value={d.discogs_url || ''} onChange={e => setD({ ...d, discogs_url: e.target.value })} className="input" /></F>
              <F label="Web URL"><input value={d.web_url || ''} onChange={e => setD({ ...d, web_url: e.target.value })} className="input" /></F>
            </>
          )}

          <div className="grid grid-cols-2 gap-3 pt-2">
            <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
              <input type="checkbox" checked={!!d.featured} onChange={e => setD({ ...d, featured: e.target.checked })} className="accent-orange-500" /> Destacado
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
              <input type="checkbox" checked={!!d.hidden} onChange={e => setD({ ...d, hidden: e.target.checked })} className="accent-orange-500" /> Oculto
            </label>
          </div>
          <F label="Orden (menor = antes)"><input type="number" value={d.sort_order || 0} onChange={e => setD({ ...d, sort_order: parseInt(e.target.value) || 0 })} className="input" /></F>
        </div>
        <div className="px-5 py-4 border-t border-stone-800 flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-stone-800 text-white text-xs font-black uppercase rounded-lg">Cancelar</button>
          <button onClick={save} disabled={busy || !d.name?.trim()} className="px-5 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-xs font-black uppercase rounded-lg flex items-center gap-1">
            {busy ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} GUARDAR
          </button>
        </div>
        <style>{`.input { width: 100%; background: #1c1917; border: 1px solid #44403c; border-radius: 8px; padding: 8px 10px; color: white; font-size: 13px; outline: none; } .input:focus { border-color: #ea580c; }`}</style>
      </div>
    </div>
  );
};

const F: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div><label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-1.5">{label}</label>{children}</div>
);
