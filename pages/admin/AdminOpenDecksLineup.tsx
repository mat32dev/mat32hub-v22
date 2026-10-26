import React, { useState, useEffect } from 'react';
import { Disc3, Loader2, Music, CalendarDays, Clock, CheckCircle2, Circle } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { InboxMessage } from '../../types';

interface LineupItem {
  id: string;
  artistName: string;
  genres: string[];
  date: string;
  slotLabel: string;
  status: InboxMessage['status'];
  raw: InboxMessage;
}

const parse = (m: InboxMessage): LineupItem | null => {
  if (m.type !== 'artist') return null;
  const md = m.metadata || {};
  return {
    id: m.id,
    artistName: md.artistName || m.sender || 'Sin nombre',
    genres: (md.genres as string) ? String(md.genres).split(', ').filter(Boolean) : [],
    date: md.date || '',
    slotLabel: md.slotTime || '',
    status: m.status,
    raw: m,
  };
};

const dateLabel = (d: string) => {
  if (!d) return 'Sin fecha';
  const [y, m, day] = d.split('-');
  const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  return `${Number(day)} ${months[Number(m) - 1]} ${y}`;
};

export const AdminOpenDecksLineup: React.FC = () => {
  const [items, setItems] = useState<LineupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const all = await dataService.getInbox();
        const parsed = all.map(parse).filter(Boolean)
          .sort((a, b) => (a!.date + a!.slotLabel).localeCompare(b!.date + b!.slotLabel));
        setItems(parsed as LineupItem[]);
      } catch { setItems([]); }
      setLoading(false);
    })();
  }, []);

  const toggleStatus = async (id: string, current: InboxMessage['status']) => {
    const next = current === 'confirmed' ? 'pending' : 'confirmed';
    setBusyId(id);
    try {
      await dataService.updateMessageStatus(id, next);
      setItems(prev => prev.map(i => i.id === id ? { ...i, status: next } : i));
    } catch { /* keep */ }
    setBusyId(null);
  };

  if (loading) return <div className="flex items-center justify-center h-40"><Loader2 className="w-5 h-5 text-orange-500 animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Disc3 size={22} className="text-orange-500" />
        <h1 className="text-xl font-black text-white">Open Decks · Lineup</h1>
        <span className="text-xs text-gray-500 font-semibold">{items.length} solicitudes</span>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-12">Todavía no hay solicitudes de Open Decks.</p>
      ) : (
        <div className="space-y-2">
          {items.map(i => {
            const confirmed = i.status === 'confirmed';
            return (
              <div key={i.id}
                className={`p-4 rounded-xl border transition-colors ${confirmed ? 'bg-green-950/30 border-green-800/40' : 'bg-gray-900 border-gray-800 border-l-2 border-l-orange-500'}`}>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  {/* Artista */}
                  <span className="text-base font-black text-white leading-none tracking-wide">{i.artistName.toUpperCase()}</span>
                  {/* Estilos */}
                  <span className="flex items-center gap-1 text-[11px] text-purple-400 font-semibold">
                    <Music size={11} className="opacity-70" />
                    {i.genres.length > 0 ? i.genres.join(' · ') : 'sin estilos'}
                  </span>
                  {/* Fecha */}
                  <span className="flex items-center gap-1 text-[11px] text-gray-400 font-semibold">
                    <CalendarDays size={11} className="text-orange-500" /> {dateLabel(i.date)}
                  </span>
                  {/* Hora */}
                  {i.slotLabel && (
                    <span className="flex items-center gap-1 text-[11px] text-gray-400 font-semibold">
                      <Clock size={11} className="text-orange-500" /> {i.slotLabel}
                    </span>
                  )}
                  {/* Toggle confirmado/pendiente */}
                  <button
                    onClick={() => toggleStatus(i.id, i.status)}
                    disabled={busyId === i.id}
                    className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors disabled:opacity-50 ${
                      confirmed
                        ? 'bg-green-600 text-white hover:bg-green-500'
                        : 'bg-gray-800 text-orange-400 hover:bg-orange-600 hover:text-white border border-gray-700'
                    }`}>
                    {busyId === i.id ? <Loader2 size={12} className="animate-spin" /> : confirmed ? <CheckCircle2 size={12} /> : <Circle size={12} />}
                    {confirmed ? 'CONFIRMADO' : 'PENDIENTE'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};