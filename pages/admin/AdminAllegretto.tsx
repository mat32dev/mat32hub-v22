import React, { useEffect, useState } from 'react';
import { Loader2, Plus, Edit3, Trash2, Star, EyeOff, Eye, Save, X, ExternalLink, Download } from 'lucide-react';
import { dataService } from '../../services/dataService';

interface Mix {
  id: string;
  mixcloud_url: string;
  title: string | null;
  dj: string | null;
  description: string | null;
  cover_url: string | null;
  tags: string[];
  recorded_at: string | null;
  sort_order: number;
  featured: boolean;
  hidden: boolean;
}

const EMPTY: Partial<Mix> = { mixcloud_url: '', tags: [], featured: false, hidden: false, sort_order: 0 };

export const AdminAllegretto: React.FC = () => {
  const [mixes, setMixes] = useState<Mix[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Mix> | null>(null);

  const load = async () => {
    setLoading(true);
    try { setMixes(await dataService.getMixesList()); } catch {}
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const toggle = async (id: string, patch: Partial<Mix>) => { await dataService.updateMix(id, patch); load(); };
  const remove = async (id: string) => { if (!confirm('¿Eliminar mix?')) return; await dataService.deleteMix(id); load(); };

  if (loading) return <div className="py-20 text-center"><Loader2 className="animate-spin text-orange-500 w-8 h-8 mx-auto" /></div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">Allegretto! Sesiones</h2>
          <p className="text-[11px] text-gray-500 mt-1">Mixes de <code className="text-orange-400">mixcloud.com/allegretto-live/</code> · visibles en /radio</p>
        </div>
        <div className="flex gap-2">
          <a href="/radio#mixes" target="_blank" rel="noopener" className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-gray-300 text-xs font-bold rounded-lg">Ver público ↗</a>
          <button onClick={() => setEditing(EMPTY)} className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg flex items-center gap-1">
            <Plus size={13} /> Nuevo
          </button>
        </div>
      </div>

      {mixes.length === 0 ? (
        <div className="py-20 text-center text-gray-500 text-sm">
          Aún no hay mixes. Pulsa "Nuevo" para añadir uno (puede auto-completarse desde Mixcloud).
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {mixes.map(m => (
            <div key={m.id} className={`group relative bg-stone-900 border rounded-2xl overflow-hidden transition-all ${m.featured ? 'border-orange-500/40' : 'border-stone-800'} ${m.hidden ? 'opacity-50' : ''}`}>
              <div className="aspect-video bg-stone-950 overflow-hidden relative">
                {m.cover_url ? (
                  <img src={m.cover_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-stone-700">Sin cover</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3">
                  {m.dj && <div className="text-[9px] font-black text-orange-400 uppercase tracking-widest">{m.dj}</div>}
                  <div className="text-sm font-black text-white uppercase tracking-tight leading-tight">{m.title || '(sin título)'}</div>
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => toggle(m.id, { featured: !m.featured })} title="Destacar"
                    className="p-1.5 bg-black/70 hover:bg-orange-500 rounded"><Star size={11} className={m.featured ? 'fill-orange-500 text-orange-500' : 'text-white'} /></button>
                  <button onClick={() => toggle(m.id, { hidden: !m.hidden })} title="Ocultar"
                    className="p-1.5 bg-black/70 hover:bg-stone-600 rounded">{m.hidden ? <Eye size={11} className="text-white" /> : <EyeOff size={11} className="text-white" />}</button>
                  <button onClick={() => setEditing(m)} title="Editar"
                    className="p-1.5 bg-black/70 hover:bg-orange-500 rounded"><Edit3 size={11} className="text-white" /></button>
                  <button onClick={() => remove(m.id)} title="Eliminar"
                    className="p-1.5 bg-black/70 hover:bg-red-500 rounded"><Trash2 size={11} className="text-white" /></button>
                </div>
              </div>
              <div className="p-3">
                {!!m.tags?.length && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {m.tags.map((t, i) => <span key={i} className="text-[9px] font-black text-orange-400 uppercase tracking-widest border border-stone-800 rounded-full px-2 py-0.5">#{t}</span>)}
                  </div>
                )}
                <a href={m.mixcloud_url} target="_blank" rel="noopener" className="text-[10px] font-bold text-gray-500 hover:text-orange-400 flex items-center gap-1">
                  Mixcloud <ExternalLink size={10} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && <EditModal initial={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
};

const EditModal: React.FC<{ initial: Partial<Mix>; onClose: () => void; onSaved: () => void }> = ({ initial, onClose, onSaved }) => {
  const [d, setD] = useState<Partial<Mix>>({ ...initial });
  const [busy, setBusy] = useState(false);
  const [fetching, setFetching] = useState(false);
  const isNew = !d.id;
  const tagsStr = (d.tags || []).join(', ');

  const autoFetch = async () => {
    if (!d.mixcloud_url) return;
    setFetching(true);
    try {
      const oembed: any = await dataService.mixOembed(d.mixcloud_url);
      if (oembed) {
        setD(prev => ({
          ...prev,
          title: prev.title || oembed.title || null,
          dj: prev.dj || oembed.author_name || null,
          cover_url: prev.cover_url || oembed.image || null,
        }));
      }
    } catch {}
    setFetching(false);
  };

  const save = async () => {
    if (!d.mixcloud_url?.trim()) return;
    setBusy(true);
    try {
      const payload = {
        mixcloud_url: d.mixcloud_url,
        title: d.title || null,
        dj: d.dj || null,
        description: d.description || null,
        cover_url: d.cover_url || null,
        tags: d.tags || [],
        recorded_at: d.recorded_at || null,
        featured: !!d.featured,
        hidden: !!d.hidden,
        sort_order: d.sort_order || 0,
      };
      if (isNew) await dataService.createMix(payload);
      else await dataService.updateMix(d.id!, payload);
      onSaved();
    } catch { alert('Error'); }
    setBusy(false);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800">
          <h3 className="text-lg font-black text-white uppercase">{isNew ? 'Nuevo mix' : 'Editar mix'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-3">
          {d.cover_url && <img src={d.cover_url} alt="" className="w-full aspect-video object-cover rounded-xl" />}

          <F label="Mixcloud URL *">
            <div className="flex gap-2">
              <input value={d.mixcloud_url || ''} onChange={e => setD({ ...d, mixcloud_url: e.target.value })}
                placeholder="https://www.mixcloud.com/allegretto-live/..." className="input flex-1" />
              <button type="button" onClick={autoFetch} disabled={!d.mixcloud_url || fetching}
                className="px-3 py-2 bg-stone-800 hover:bg-stone-700 disabled:opacity-50 text-gray-300 text-xs font-bold rounded-lg flex items-center gap-1">
                {fetching ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />} Auto
              </button>
            </div>
            <p className="text-[10px] text-gray-600 mt-1">Pulsa "Auto" para rellenar título, DJ y cover desde Mixcloud.</p>
          </F>

          <div className="grid grid-cols-2 gap-3">
            <F label="Título"><input value={d.title || ''} onChange={e => setD({ ...d, title: e.target.value })} className="input" /></F>
            <F label="DJ / Selector"><input value={d.dj || ''} onChange={e => setD({ ...d, dj: e.target.value })} className="input" /></F>
          </div>

          <F label="Cover URL"><input value={d.cover_url || ''} onChange={e => setD({ ...d, cover_url: e.target.value })} className="input" /></F>

          <F label="Descripción"><textarea rows={2} value={d.description || ''} onChange={e => setD({ ...d, description: e.target.value })} className="input" /></F>

          <F label="Tags (separados por coma)">
            <input value={tagsStr} onChange={e => setD({ ...d, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} className="input" placeholder="MAT32, open-air, house..." />
          </F>

          <div className="grid grid-cols-2 gap-3">
            <F label="Fecha grabación"><input type="date" value={d.recorded_at?.slice(0, 10) || ''} onChange={e => setD({ ...d, recorded_at: e.target.value || null })} className="input" /></F>
            <F label="Orden (menor antes)"><input type="number" value={d.sort_order || 0} onChange={e => setD({ ...d, sort_order: parseInt(e.target.value) || 0 })} className="input" /></F>
          </div>

          <div className="flex gap-4 pt-2">
            <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
              <input type="checkbox" checked={!!d.featured} onChange={e => setD({ ...d, featured: e.target.checked })} className="accent-orange-500" /> Destacado
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
              <input type="checkbox" checked={!!d.hidden} onChange={e => setD({ ...d, hidden: e.target.checked })} className="accent-orange-500" /> Oculto
            </label>
          </div>
        </div>
        <div className="px-5 py-4 border-t border-stone-800 flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-stone-800 text-white text-xs font-black uppercase rounded-lg">Cancelar</button>
          <button onClick={save} disabled={busy || !d.mixcloud_url?.trim()} className="px-5 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-xs font-black uppercase rounded-lg flex items-center gap-1">
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
