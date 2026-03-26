import React, { useState, useEffect } from 'react';
import { UserCheck, Loader2, CheckCircle, XCircle, ExternalLink, Clock } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { SelectorSubmission } from '../../types';

export const AdminSelectors: React.FC = () => {
  const [selectors, setSelectors] = useState<SelectorSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    (async () => {
      try { setSelectors(await dataService.getSelectors()); } catch { setSelectors([]); }
      setLoading(false);
    })();
  }, []);

  const updateStatus = async (id: string, status: SelectorSubmission['status']) => {
    await dataService.updateSelectorStatus(id, status);
    setSelectors(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const filtered = selectors.filter(s => filter === 'all' || s.status === filter);

  const statusIcon = (status: string) => {
    if (status === 'approved') return <CheckCircle size={16} className="text-green-400" />;
    if (status === 'rejected') return <XCircle size={16} className="text-red-400" />;
    return <Clock size={16} className="text-yellow-400" />;
  };

  if (loading) return <div className="flex items-center justify-center h-40"><Loader2 className="w-5 h-5 text-orange-500 animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <UserCheck size={22} className="text-orange-500" />
        <h1 className="text-xl font-black text-white">Selectors</h1>
        <span className="text-xs text-gray-500 font-semibold">{selectors.length} solicitudes</span>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${filter === f ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
            {f === 'all' ? `Todos (${selectors.length})` : `${f} (${selectors.filter(s => s.status === f).length})`}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-12">Sin solicitudes</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(s => (
            <div key={s.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {s.avatarUrl ? (
                    <img src={s.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover bg-gray-800" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-600 text-sm font-bold">{s.name?.[0]}</div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-white">{s.name}</p>
                    <p className="text-[10px] text-gray-500">{s.email}</p>
                  </div>
                </div>
                {statusIcon(s.status)}
              </div>

              <div className="mb-3 space-y-1">
                <p className="text-xs text-gray-400"><span className="text-gray-600">Genero:</span> {s.genre}</p>
                <p className="text-xs text-gray-400"><span className="text-gray-600">Experiencia:</span> {s.experience}</p>
              </div>

              {s.links?.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1">
                  {s.links.map((link, i) => (
                    <a key={i} href={link} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2 py-1 bg-gray-800 rounded text-[10px] text-gray-300 hover:text-orange-400 transition-colors">
                      <ExternalLink size={10} /> Link {i + 1}
                    </a>
                  ))}
                </div>
              )}

              {s.status === 'pending' && (
                <div className="flex gap-2 pt-2 border-t border-gray-800">
                  <button onClick={() => updateStatus(s.id, 'approved')}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600/15 text-green-400 hover:bg-green-600/25 text-xs font-bold rounded-lg transition-colors">
                    <CheckCircle size={12} /> Aprobar
                  </button>
                  <button onClick={() => updateStatus(s.id, 'rejected')}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-600/15 text-red-400 hover:bg-red-600/25 text-xs font-bold rounded-lg transition-colors">
                    <XCircle size={12} /> Rechazar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
