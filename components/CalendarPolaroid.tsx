import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Event } from '../types';

const MES = ['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO','JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'];

// Mapeo de categorías a género principal visible
const CATEGORY_GENRE: Record<string, { genre: string; color: string }> = {
  'Open Decks': { genre: 'OPEN DECKS', color: '#d8ff5a' },
  'DJ Set': { genre: 'ELECTRÓNICA', color: '#c8462a' },
  'Listening Session': { genre: 'LISTENING', color: '#6366f1' },
  'Live': { genre: 'LIVE', color: '#f97316' },
  'Workshop': { genre: 'WORKSHOP', color: '#22c55e' },
  'Mercadillo': { genre: 'MERCADILLO', color: '#eab308' },
  'Fiesta': { genre: 'FIESTA', color: '#ec4899' },
  'Showcase': { genre: 'SHOWCASE', color: '#a855f7' },
};

interface Props {
  events?: Event[];
  bookedDays?: Set<string>;
  /** Si true, el calendar va sobre fondo ink (alquiler page). Default: paper context. */
  contextDark?: boolean;
  /** Si true, muestra modo disponibilidad para booking (con restricciones viernes/sábado) */
  bookingMode?: boolean;
}

export const CalendarPolaroid: React.FC<Props> = ({ events = [], bookedDays, contextDark = false, bookingMode = false }) => {
  const [cursor, setCursor] = useState(() => {
    const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), 1);
  });
  const navigate = useNavigate();
  const today = new Date(); today.setHours(0,0,0,0);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const eventDays = useMemo(() => {
      const map = new Map<string, { genre: string; color: string }>();
      for (const e of events) {
        const d = new Date(e.date);
        if (d.getFullYear() === year && d.getMonth() === month) {
          const genreLabel = (e.vibe && e.vibe[0])
            ? e.vibe[0].toUpperCase()
            : (CATEGORY_GENRE[e.category]?.genre || 'EVENTO');
          const genreColor = CATEGORY_GENRE[e.category]?.color || '#c8462a';
          map.set(String(d.getDate()), { genre: genreLabel, color: genreColor });
        }
      }
      return map;
    }, [events, year, month]);

    const bookedDayStrings = useMemo(() => {
      const set = new Set<string>();
      for (const iso of bookedDays || []) {
        const d = new Date(iso + 'T00:00:00');
        if (d.getFullYear() === year && d.getMonth() === month) {
          set.add(String(d.getDate()));
        }
      }
      return set;
    }, [bookedDays, year, month]);

  const navMonth = (delta: number) => setCursor(c => new Date(c.getFullYear(), c.getMonth() + delta, 1));
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  return (
    <div className="relative shadow-[0_18px_40px_rgba(0,0,0,0.18),0_6px_14px_rgba(0,0,0,0.10)] hairline overflow-hidden" style={{ background: '#e8e2d4' }}>
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-bermellon z-10" />

      {/* HEADER INDUSTRIAL */}
      <div className="bg-ink px-5 py-2.5 flex items-center justify-between hairline-ink-b">
        <span className="mono-tag flex items-center gap-2" style={{ color: '#d8ff5a' }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#d8ff5a' }} />
          {bookingMode ? 'DISPONIBILIDAD' : 'LIVE_AVAILABILITY'}
        </span>
        <span className="mono-tag !text-[9px] text-paper/55">EUROPE/MADRID</span>
      </div>

      {/* CALENDAR FACE */}
      <div className="p-5 md:p-7 pb-4 md:pb-6">
        <div className="bg-white hairline">
          {/* Title + nav */}
          <div className="flex items-baseline justify-between px-4 py-3 hairline-b">
            <div>
              <span className="display text-2xl md:text-3xl text-ink">{MES[month]}</span>
              <span className="mono-tag ml-3 text-ink-soft">{year}</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => navMonth(-1)}
                className="w-7 h-7 hairline flex items-center justify-center mono-tag !text-[12px] text-ink hover:bg-ink hover:text-paper transition-colors" aria-label="Mes anterior">‹</button>
              <button onClick={() => navMonth(1)}
                className="w-7 h-7 hairline flex items-center justify-center mono-tag !text-[12px] text-ink hover:bg-ink hover:text-paper transition-colors" aria-label="Mes siguiente">›</button>
            </div>
          </div>

          {/* Weekday strip */}
          <div className="grid grid-cols-7 hairline-b">
            {['L','M','X','J','V','S','D'].map((d, i) => (
              <div key={d} className="text-center py-2 mono-tag !text-[10px]"
                   style={{ color: i === 6 ? '#c8462a' : '#505050' }}>{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7">
            {cells.map((d, i) => {
              if (!d) return <div key={i} className="aspect-square" />;
              const cellDate = new Date(year, month, d);
              const iso = `${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
              const isToday = cellDate.getTime() === today.getTime();
              const eventInfo = eventDays.get(String(d));
              const hasEvent = !!eventInfo;
              const isBooked = bookedDayStrings.has(String(d));
              const isPast = cellDate < today;

              return (
                <button key={i}
                  onClick={() => {
                    if (hasEvent) {
                      navigate('/events');
                    } else if (isBooked) {
                      navigate('/alquiler-local-eventos-horas-valencia#booking-form');
                    } else if (!isPast) {
                      navigate('/alquiler-local-eventos-horas-valencia#booking-form');
                    }
                  }}
                  className={`aspect-square flex flex-col items-center justify-center relative transition-colors ${
                    hasEvent ? 'bg-lima text-ink hover:bg-lima/80' :
                    isBooked ? 'bg-red-600 text-paper hover:bg-red-700 cursor-pointer' :
                    isToday ? 'bg-paper-2 text-ink' : 'text-ink hover:bg-paper-2'
                  } ${isPast && !hasEvent && !isBooked ? 'opacity-40' : ''}`}
                  title={
                    hasEvent ? `${d} — ${eventInfo.genre} (22:00–02:00)` :
                    isBooked ? `${d} — OCUPADO (ruzafaclub)` :
                    isPast ? `${d}` : `${d} — disponible 19:00–22:00`
                  }>
                  <span className="text-current"
                        style={{ fontFamily: (hasEvent || isBooked) ? 'Space Grotesk, sans-serif' : 'DM Mono, monospace', fontWeight: (hasEvent || isBooked) ? '700' : '400', fontSize: (hasEvent || isBooked) ? '14px' : '12px' }}>
                    {d}
                  </span>
                  {hasEvent && (
                    <>
                      <span className="absolute bottom-1 mono-tag !text-[7px] !tracking-[0.2em] text-paper/85" style={{ color: eventInfo.color }}>{eventInfo.genre}</span>
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{ background: eventInfo.color }} />
                    </>
                  )}
                  {!hasEvent && isBooked && <span className="absolute bottom-1 mono-tag !text-[7px] !tracking-[0.2em] text-paper/85">OCUPADO</span>}
                  {isToday && !hasEvent && !isBooked && <span className="absolute bottom-1 w-1 h-1 rounded-full" style={{ background: '#c8462a' }} />}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="hairline-t px-3 py-2 flex flex-wrap items-center gap-3 mono-tag !text-[9px] text-ink-soft">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-lima" /> EVENTO · click → agenda</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-red-600" /> OCUPADO · ruzafaclub</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-paper-2 hairline" /> HOY</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-white hairline" /> LIBRE 19–22H</span>
            {!isCurrentMonth && <button onClick={() => setCursor(new Date(today.getFullYear(), today.getMonth(), 1))} className="ml-auto text-bermellon hover:text-ink transition-colors">VOLVER A HOY ↺</button>}
          </div>
        </div>

        {/* Pie polaroid */}
        <div className="flex justify-between items-center pt-3 px-1">
          <span className="mono-tag !text-[9px] text-ink/55">MAT32 · BOOKING_LOG</span>
          <span className="mono-tag !text-[9px] text-ink/40">VLC_RUZAFA</span>
        </div>
      </div>
    </div>
  );
};
