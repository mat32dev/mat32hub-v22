import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit3, Search, Loader2, AlertTriangle } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { entityConfigs } from './entityConfig';

interface Props { entity: string; }

export const AdminEntityList: React.FC<Props> = ({ entity }) => {
  const config = entityConfigs[entity];
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const data = await (dataService as any)[config.service.list]();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn(`Failed to load ${entity}:`, err);
      setItems([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [entity]);

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminar este registro?')) return;
    setDeleting(id);
    try {
      await (dataService as any)[config.service.delete](id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      alert('Error al eliminar');
    }
    setDeleting(null);
  };

  const filtered = items.filter(item => {
    if (!search) return true;
    const q = search.toLowerCase();
    return Object.values(item).some(v => String(v).toLowerCase().includes(q));
  });

  const statusBadge = (val: string) => {
    const colors: Record<string, string> = {
      published: 'bg-green-500/15 text-green-400',
      draft: 'bg-yellow-500/15 text-yellow-400',
      sold: 'bg-red-500/15 text-red-400',
      sold_out: 'bg-red-500/15 text-red-400',
      pending: 'bg-yellow-500/15 text-yellow-400',
      completed: 'bg-green-500/15 text-green-400',
      cancelled: 'bg-red-500/15 text-red-400',
    };
    return <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${colors[val] || 'bg-gray-700 text-gray-300'}`}>{val}</span>;
  };

  const renderCell = (item: any, col: { key: string }) => {
    const val = item[col.key];
    // Image columns
    if (col.key === 'imageUrl' || col.key === 'coverUrl') {
      return val ? <img src={val} alt="" className="w-10 h-10 rounded object-cover bg-gray-800" /> : <div className="w-10 h-10 rounded bg-gray-800" />;
    }
    // Status
    if (col.key === 'status') return statusBadge(val || '');
    // Price
    if (col.key === 'price' || col.key === 'total') return <span>{val}€</span>;
    // Date
    if (col.key === 'timestamp') return <span className="text-gray-400">{val ? new Date(val).toLocaleDateString('es') : ''}</span>;
    // Default
    return <span className="truncate">{val ?? ''}</span>;
  };

  const Icon = config.icon;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Icon size={22} className="text-orange-500" />
          <h1 className="text-xl font-black text-white">{config.label}</h1>
          <span className="text-xs text-gray-500 font-semibold">{items.length} registros</span>
        </div>
        <Link to={`/admin/${entity}/new`}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg transition-colors">
          <Plus size={14} /> Nuevo {config.labelSingular}
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..."
          className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-sm text-white focus:border-orange-500 focus:outline-none" />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-40"><Loader2 className="w-5 h-5 text-orange-500 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-gray-500 py-20 text-sm">
          {search ? 'Sin resultados' : `No hay ${config.label.toLowerCase()}`}
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  {config.listColumns.map(col => (
                    <th key={col.key} style={col.width ? { width: col.width } : {}}
                      className="text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider px-4 py-3">
                      {col.label}
                    </th>
                  ))}
                  <th className="w-20"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => (
                  <tr key={item.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors cursor-pointer"
                    onClick={() => navigate(`/admin/${entity}/${item.id}`)}>
                    {config.listColumns.map(col => (
                      <td key={col.key} className="px-4 py-3 text-xs text-gray-300">
                        {renderCell(item, col)}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={e => { e.stopPropagation(); navigate(`/admin/${entity}/${item.id}`); }}
                          className="p-1.5 text-gray-500 hover:text-orange-400 transition-colors rounded">
                          <Edit3 size={14} />
                        </button>
                        <button onClick={e => { e.stopPropagation(); handleDelete(item.id); }}
                          disabled={deleting === item.id}
                          className="p-1.5 text-gray-500 hover:text-red-400 transition-colors rounded disabled:opacity-30">
                          {deleting === item.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
