import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Loader2, Upload, Trash2, Plus, X } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { entityConfigs, FieldDef } from './entityConfig';

interface Props { entity: string; }

export const AdminEntityForm: React.FC<Props> = ({ entity }) => {
  const config = entityConfigs[entity];
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';
  const [data, setData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'ok' | 'error'; msg: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [imageTarget, setImageTarget] = useState<string | null>(null);

  // Load record if editing
  useEffect(() => {
    if (isNew) {
      // Apply defaults
      const defaults: Record<string, any> = {};
      config.fields.forEach(f => { if (f.defaultValue !== undefined) defaults[f.key] = f.defaultValue; });
      setData(defaults);
      return;
    }
    (async () => {
      setLoading(true);
      try {
        const list = await (dataService as any)[config.service.list]();
        const item = (list as any[]).find((i: any) => String(i.id) === String(id));
        if (item) setData(item);
        else setStatus({ type: 'error', msg: 'Registro no encontrado' });
      } catch (err) { setStatus({ type: 'error', msg: 'Error al cargar' }); }
      setLoading(false);
    })();
  }, [entity, id]);

  const setField = (key: string, value: any) => setData(prev => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      if (isNew) {
        await (dataService as any)[config.service.create](data);
        setStatus({ type: 'ok', msg: 'Creado correctamente' });
        setTimeout(() => navigate(`/admin/${entity}`), 800);
      } else {
        // Special case: sales update only status
        if (entity === 'sales') {
          await (dataService as any)['updateSaleStatus'](data.id, data.status);
        } else {
          await (dataService as any)[config.service.update](data);
        }
        setStatus({ type: 'ok', msg: 'Guardado correctamente' });
      }
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message || 'Error al guardar' });
    }
    setSaving(false);
  };

  const handleImageUpload = (fieldKey: string) => {
    setImageTarget(fieldKey);
    fileRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !imageTarget) return;
    const reader = new FileReader();
    reader.onload = () => setField(imageTarget, reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // ── Field renderers ──

  const renderField = (f: FieldDef) => {
    const val = data[f.key];

    switch (f.type) {
      case 'text':
      case 'url':
        return <input type={f.type === 'url' ? 'url' : 'text'} value={val || ''} onChange={e => setField(f.key, e.target.value)}
          placeholder={f.placeholder} className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:border-orange-500 focus:outline-none" />;

      case 'number':
        return <input type="number" value={val ?? ''} min={f.min} onChange={e => setField(f.key, e.target.value === '' ? '' : Number(e.target.value))}
          className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:border-orange-500 focus:outline-none" />;

      case 'date':
        return <input type="date" value={val || ''} onChange={e => setField(f.key, e.target.value)}
          className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:border-orange-500 focus:outline-none" />;

      case 'time':
        return <input type="time" value={val || ''} onChange={e => setField(f.key, e.target.value)}
          className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:border-orange-500 focus:outline-none" />;

      case 'datetime':
        return <input type="datetime-local" value={val ? val.slice(0, 16) : ''} onChange={e => setField(f.key, e.target.value)}
          className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:border-orange-500 focus:outline-none" />;

      case 'textarea':
        return <textarea value={val || ''} onChange={e => setField(f.key, e.target.value)} rows={5}
          className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:border-orange-500 focus:outline-none resize-y" />;

      case 'select':
        return (
          <select value={val || ''} onChange={e => setField(f.key, e.target.value)}
            className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:border-orange-500 focus:outline-none">
            <option value="">— seleccionar —</option>
            {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        );

      case 'boolean':
        return (
          <button type="button" onClick={() => setField(f.key, !val)}
            className={`w-12 h-6 rounded-full transition-colors relative ${val ? 'bg-orange-500' : 'bg-gray-700'}`}>
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${val ? 'left-6' : 'left-0.5'}`} />
          </button>
        );

      case 'image':
        return (
          <div>
            {val && <img src={val} alt="" className="w-full max-w-xs h-40 object-cover rounded-lg mb-2 bg-gray-800" />}
            <div className="flex gap-2">
              <button type="button" onClick={() => handleImageUpload(f.key)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-300 hover:text-white transition-colors">
                <Upload size={14} /> Subir imagen
              </button>
              <input type="text" value={val || ''} onChange={e => setField(f.key, e.target.value)}
                placeholder="o pegar URL..." className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white focus:border-orange-500 focus:outline-none" />
            </div>
          </div>
        );

      case 'tags':
        return <TagsInput value={val || []} onChange={v => setField(f.key, v)} />;

      case 'lineup':
        return <LineupEditor value={val || []} onChange={v => setField(f.key, v)} />;

      default:
        return <input type="text" value={val || ''} onChange={e => setField(f.key, e.target.value)}
          className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:border-orange-500 focus:outline-none" />;
    }
  };

  if (loading) return <div className="flex items-center justify-center h-40"><Loader2 className="w-5 h-5 text-orange-500 animate-spin" /></div>;

  const Icon = config.icon;

  return (
    <div className="max-w-3xl">
      <input type="file" accept="image/*" ref={fileRef} onChange={onFileChange} className="hidden" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/admin/${entity}`)} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <Icon size={20} className="text-orange-500" />
          <h1 className="text-xl font-black text-white">{isNew ? `Nuevo ${config.labelSingular}` : `Editar ${config.labelSingular}`}</h1>
        </div>
        <div className="flex items-center gap-3">
          {!isNew && (
            <button onClick={async () => { if (confirm('Eliminar?')) { await (dataService as any)[config.service.delete](id); navigate(`/admin/${entity}`); } }}
              className="flex items-center gap-2 px-3 py-2 border border-red-800 text-red-400 hover:bg-red-500/10 text-xs font-bold rounded-lg transition-colors">
              <Trash2 size={14} /> Eliminar
            </button>
          )}
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Guardar
          </button>
        </div>
      </div>

      {/* Status */}
      {status && (
        <div className={`mb-4 px-4 py-2 rounded-lg text-xs font-semibold ${status.type === 'ok' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {status.msg}
        </div>
      )}

      {/* Form */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {config.fields.map(f => (
            <div key={f.key} className={f.half ? '' : 'md:col-span-2'}>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                {f.label} {f.required && <span className="text-red-400">*</span>}
              </label>
              {renderField(f)}
            </div>
          ))}
        </div>
      </div>

      {/* Raw JSON debug */}
      <details className="mt-6">
        <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-400">Ver datos raw (JSON)</summary>
        <pre className="mt-2 p-4 bg-gray-900 border border-gray-800 rounded-lg text-xs text-gray-400 overflow-auto max-h-60">
          {JSON.stringify(data, null, 2)}
        </pre>
      </details>
    </div>
  );
};

// ── Tags Input ──

const TagsInput: React.FC<{ value: string[]; onChange: (v: string[]) => void }> = ({ value, onChange }) => {
  const [input, setInput] = useState('');

  const add = () => {
    const tag = input.trim();
    if (tag && !value.includes(tag)) { onChange([...value, tag]); setInput(''); }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {value.map((tag, i) => (
          <span key={i} className="flex items-center gap-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-gray-300">
            {tag}
            <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="text-gray-500 hover:text-red-400"><X size={12} /></button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder="Anadir tag..." className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white focus:border-orange-500 focus:outline-none" />
        <button type="button" onClick={add} className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-300 hover:text-white">+</button>
      </div>
    </div>
  );
};

// ── Lineup Editor ──

const LineupEditor: React.FC<{ value: any[]; onChange: (v: any[]) => void }> = ({ value, onChange }) => {
  const addArtist = () => onChange([...value, { name: '', role: 'DJ', instagram: '' }]);

  return (
    <div className="space-y-2">
      {value.map((artist, i) => (
        <div key={i} className="flex items-center gap-2 p-3 bg-gray-800 border border-gray-700 rounded-lg">
          <input value={artist.name || ''} onChange={e => { const v = [...value]; v[i] = { ...v[i], name: e.target.value }; onChange(v); }}
            placeholder="Nombre" className="flex-1 px-2 py-1.5 bg-gray-900 border border-gray-700 rounded text-xs text-white focus:border-orange-500 focus:outline-none" />
          <select value={artist.role || 'DJ'} onChange={e => { const v = [...value]; v[i] = { ...v[i], role: e.target.value }; onChange(v); }}
            className="px-2 py-1.5 bg-gray-900 border border-gray-700 rounded text-xs text-white focus:outline-none">
            <option>DJ</option><option>Live</option><option>Host</option><option>VJ</option>
          </select>
          <input value={artist.instagram || ''} onChange={e => { const v = [...value]; v[i] = { ...v[i], instagram: e.target.value }; onChange(v); }}
            placeholder="@instagram" className="w-28 px-2 py-1.5 bg-gray-900 border border-gray-700 rounded text-xs text-white focus:border-orange-500 focus:outline-none" />
          <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="p-1 text-gray-500 hover:text-red-400">
            <X size={14} />
          </button>
        </div>
      ))}
      <button type="button" onClick={addArtist}
        className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-700 rounded-lg text-xs text-gray-400 hover:text-white hover:border-gray-500 transition-colors w-full justify-center">
        <Plus size={14} /> Anadir artista
      </button>
    </div>
  );
};
