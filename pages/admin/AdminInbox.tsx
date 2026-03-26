import React, { useState, useEffect } from 'react';
import { Mail, Loader2, Trash2, CheckCircle, Archive, Eye } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { InboxMessage } from '../../types';

export const AdminInbox: React.FC = () => {
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'read' | 'archived'>('all');
  const [selected, setSelected] = useState<InboxMessage | null>(null);

  useEffect(() => {
    (async () => {
      try { setMessages(await dataService.getInbox()); } catch { setMessages([]); }
      setLoading(false);
    })();
  }, []);

  const updateStatus = async (id: string, status: InboxMessage['status']) => {
    await dataService.updateMessageStatus(id, status);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
  };

  const deleteMsg = async (id: string) => {
    if (!confirm('Eliminar mensaje?')) return;
    await dataService.deleteInboxMessage(id);
    setMessages(prev => prev.filter(m => m.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const filtered = messages.filter(m => filter === 'all' || m.status === filter);

  const typeBadge = (type: string) => {
    const colors: Record<string, string> = {
      lead: 'bg-blue-500/15 text-blue-400', artist: 'bg-purple-500/15 text-purple-400',
      booking: 'bg-orange-500/15 text-orange-400', sale: 'bg-green-500/15 text-green-400',
      general: 'bg-gray-700 text-gray-300', offer: 'bg-yellow-500/15 text-yellow-400',
      negotiation: 'bg-pink-500/15 text-pink-400',
    };
    return <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${colors[type] || colors.general}`}>{type}</span>;
  };

  if (loading) return <div className="flex items-center justify-center h-40"><Loader2 className="w-5 h-5 text-orange-500 animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Mail size={22} className="text-orange-500" />
        <h1 className="text-xl font-black text-white">Inbox</h1>
        <span className="text-xs text-gray-500 font-semibold">{messages.length} mensajes</span>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {(['all', 'pending', 'read', 'archived'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${filter === f ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
            {f === 'all' ? `Todos (${messages.length})` : `${f} (${messages.filter(m => m.status === f).length})`}
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        {/* List */}
        <div className="flex-1 space-y-2">
          {filtered.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-12">Sin mensajes</p>
          ) : filtered.map(m => (
            <div key={m.id} onClick={() => setSelected(m)}
              className={`p-4 rounded-xl border transition-colors cursor-pointer ${selected?.id === m.id ? 'bg-gray-800 border-orange-500/30' : 'bg-gray-900 border-gray-800 hover:border-gray-700'} ${m.status === 'pending' ? 'border-l-2 border-l-orange-500' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{m.sender}</span>
                  {typeBadge(m.type)}
                </div>
                <span className="text-[10px] text-gray-500">{m.date}</span>
              </div>
              <p className="text-xs text-gray-400 line-clamp-2">{m.content}</p>
              {m.email && <p className="text-[10px] text-gray-600 mt-1">{m.email}</p>}
            </div>
          ))}
        </div>

        {/* Detail */}
        {selected && (
          <div className="w-96 bg-gray-900 border border-gray-800 rounded-xl p-5 sticky top-20 h-fit">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-white">{selected.sender}</span>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white text-xs">cerrar</button>
            </div>
            <div className="flex items-center gap-2 mb-3">
              {typeBadge(selected.type)}
              <span className="text-[10px] text-gray-500">{selected.date}</span>
            </div>
            {selected.email && <p className="text-xs text-gray-400 mb-1">{selected.email}</p>}
            {selected.phone && <p className="text-xs text-gray-400 mb-3">{selected.phone}</p>}
            <p className="text-sm text-gray-300 leading-relaxed mb-4 whitespace-pre-wrap">{selected.content}</p>
            <div className="flex gap-2">
              {selected.status === 'pending' && (
                <button onClick={() => updateStatus(selected.id, 'read')}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors">
                  <Eye size={12} /> Marcar leido
                </button>
              )}
              {selected.status !== 'archived' && (
                <button onClick={() => updateStatus(selected.id, 'archived')}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 text-gray-300 hover:text-white text-xs font-bold rounded-lg transition-colors border border-gray-700">
                  <Archive size={12} /> Archivar
                </button>
              )}
              <button onClick={() => deleteMsg(selected.id)}
                className="flex items-center gap-1 px-3 py-1.5 text-red-400 hover:bg-red-500/10 text-xs font-bold rounded-lg transition-colors border border-red-800">
                <Trash2 size={12} /> Eliminar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
