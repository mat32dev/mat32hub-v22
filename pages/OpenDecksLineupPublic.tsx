import React, { useState, useEffect } from 'react';
import { Disc3, Loader2, Music, CalendarDays, Clock, CheckCircle2, Circle, Radio } from 'lucide-react';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';

interface LineupRow {
  id: string;
  artistName: string;
  genres: string[];
  date: string;
  slotTime: string;
  streetRadio: boolean;
  status: string;
}

const dateLabel = (d: string) => {
  if (!d) return 'Fecha por confirmar';
  const [y, m, day] = d.split('-');
  if (!y || !m || !day) return 'Fecha por confirmar';
  const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  return `${Number(day)} ${months[Number(m) - 1]} ${y}`;
};

export const OpenDecksLineupPublic: React.FC = () => {
  const [items, setItems] = useState<LineupRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    document.body.classList.add('theme-ink');
    return () => { document.body.classList.remove('theme-ink'); };
  }, []);

  useEffect(() => {
    (async () => {
      try { setItems(await dataService.getOpenDecksLineup()); } catch { setItems([]); }
      setLoading(false);
    })();
  }, []);

  const toggle = async (id: string, current: string) => {
    const next = current === 'confirmed' ? 'pending' : 'confirmed';
    setBusyId(id);
    try {
      await dataService.setOpenDecksLineupStatus(id, next);
      setItems(prev => prev.map(i => i.id === id ? { ...i, status: next } : i));
    } catch { /* keep */ }
    setBusyId(null);
  };

  const confirmed = items.filter(i => i.status === 'confirmed');
  const pending = items.filter(i => i.status !== 'confirmed');

  const Row = ({ i }: { i: LineupRow }) => {
    const isConfirmed = i.status === 'confirmed';
    return (
      <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4 border-t border-paper/10 first:border-t-0 transition-colors ${isConfirmed ? 'bg-lime-500/5' : ''}`}>
        <button
          onClick={() => toggle(i.id, i.status)}
          disabled={busyId === i.id}
          aria-label={isConfirmed ? 'Marcar pendiente' : 'Confirmar'}
          className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer ${
            isConfirmed ? 'bg-lime-500 text-black' : 'bg-paper/10 text-paper/40 hover:bg-paper/20'
          }`}>
          {busyId === i.id ? <Loader2 size={16} className="animate-spin" /> : isConfirmed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
        </button>
        <span className={`font-wordmark text-lg tracking-tight ${isConfirmed ? 'text-lime-400' : 'text-paper'}`}>
          {i.artistName.toUpperCase()}
        </span>
        {i.streetRadio && <Radio size={13} className="text-lime-400/70" aria-label="Green Booth" />}
        <span className="flex items-center gap-1.5 mono-tag !text-[10px] text-paper/50">
          <Music size={11} /> {i.genres.length > 0 ? i.genres.join(' · ') : '—'}
        </span>
        <span className="flex items-center gap-1.5 mono-tag !text-[10px] text-paper/60">
          <CalendarDays size={11} /> {dateLabel(i.date)}
        </span>
        {i.slotTime && i.slotTime !== '—' && (
          <span className="flex items-center gap-1.5 mono-tag !text-[10px] text-paper/60">
            <Clock size={11} /> {i.slotTime}
          </span>
        )}
        <span className={`ml-auto mono-tag !text-[9px] px-2 py-1 ${isConfirmed ? 'text-lime-400' : 'text-paper/40'}`}>
          {isConfirmed ? 'CONFIRMADO' : 'PENDIENTE'}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-ink pb-24" style={{ background: '#0c0c0c' }}>
      <SEO titleKey="Open Decks · Lineup · MAT32 Valencia" descriptionKey="Sesiones confirmadas y en espera en la cabina Open Decks de MAT32. Solo discos de vinilo." />
      <div className="max-w-4xl mx-auto px-5 md:px-8 pt-24">
        <span className="mono-tag text-lime-400 !tracking-[0.35em]">OPEN DECKS · LINEUP</span>
        <h1 className="display text-paper text-5xl md:text-6xl tracking-tight mt-4 mb-10">
          LA CABINA <span style={{ color: '#d8ff5a' }}>ES TUYA.</span>
        </h1>

        {loading ? (
          <div className="flex items-center justify-center py-24"><Loader2 className="w-6 h-6 text-paper/40 animate-spin" /></div>
        ) : (
          <div>
            {/* Confirmadas */}
            <div className="mb-10">
              <div className="flex items-baseline gap-3 mb-4">
                <h2 className="display text-2xl text-lime-400 tracking-tight">CONFIRMADAS</h2>
                <span className="mono-tag text-paper/40">({confirmed.length})</span>
                <div className="h-px flex-1 bg-lime-500/20" />
              </div>
              {confirmed.length === 0 ? (
                <p className="mono-tag text-paper/40">Ninguna sesión confirmada todavía.</p>
              ) : (
                <div className="hairline-lime"> {confirmed.map(i => <Row key={i.id} i={i} />)} </div>
              )}
            </div>

            {/* En espera */}
            <div>
              <div className="flex items-baseline gap-3 mb-4">
                <h2 className="display text-2xl text-paper/80 tracking-tight">EN ESPERA</h2>
                <span className="mono-tag text-paper/40">({pending.length})</span>
                <div className="h-px flex-1 bg-paper/10" />
              </div>
              {pending.length === 0 ? (
                <p className="mono-tag text-paper/40">No hay solicitudes en espera.</p>
              ) : (
                <div className="hairline-lime"> {pending.map(i => <Row key={i.id} i={i} />)} </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};