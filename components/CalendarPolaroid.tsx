import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Event } from '../types';

const MES = ['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO','JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'];

interface Props {
  events?: Event[];
  bookedDays?: Set<string>;
  /** Si true, el calendar va sobre fondo ink (alquiler page). Default: paper context. */
  contextDark?: boolean;
}

export const CalendarPolaroid: React.FC<Props> = ({ events = [], bookedDays, contextDark = false }) => {
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
    const set = new Set<string>();
    for (const e of events) {
      const d = new Date(e.date);
      if (d.getFullYear() === year && d.getMonth() === month) set.add(String(d.getDate()));
    }
    return set;
  }, [events, year, month]);

  const navMonth = (delta: number) => setCursor(c => new Date(c.getFullYear(), c.getMonth() + delta, 1));
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  return (
    <div className="relative shadow-[0_18px_40px_rgba(0,0,0,0.18),0_6px_14px_rgba(0,0,0,0.10)] hairline overflow-hidden" style={{ background: '#e8e2d4' }}>
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-bermellon z-10" />

      {/* HEADER INDUSTRIAL */}
      <div className="bg-ink px-5 py-2.5 flex items-center justify-between hairline-ink-b">
        <span className="mono-tag flex items-center gap-2" style={{ color: '#d8ff5a' }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#d8ff5a' }} />
          LIVE_AVAILABILITY
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
                   style={{ color: i === 6 ? '#c8462a' : '#4a3f2e' }}>{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7">
            {cells.map((d, i) => {
              if (!d) return <div key={i} className="aspect-square" />;
              const cellDate = new Date(year, month, d);
              const iso = `${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
              const isToday = cellDate.getTime() === today.getTime();
              const hasEvent = eventDays.has(String(d));
              const isBooked = bookedDays?.has(iso) || false;
              const isPast = cellDate < today;
              const occupied = hasEvent || isBooked;
              return (
                <button key={i}
                  onClick={() => occupied ? navigate('/events') : navigate('/alquiler-local-eventos-horas-valencia#booking-form')}
                  className={`aspect-square flex flex-col items-center justify-center relative transition-colors ${
                    occupied ? 'bg-bermellon text-paper hover:bg-ink' : isToday ? 'bg-paper-2 text-ink' : 'text-ink hover:bg-paper-2'
                  } ${isPast && !occupied ? 'opacity-40' : ''}`}
                  title={hasEvent ? `${d} — evento programado` : isBooked ? `${d} — ocupado` : isPast ? `${d}` : `${d} — disponible`}>
                  <span className="text-current"
                        style={{ fontFamily: occupied ? 'Archivo Black, sans-serif' : 'DM Mono, monospace', fontSize: occupied ? '14px' : '12px' }}>
                    {d}
                  </span>
                  {hasEvent && <span className="absolute bottom-1 mono-tag !text-[7px] !tracking-[0.2em] text-paper/85">EVT</span>}
                  {!hasEvent && isBooked && <span className="absolute bottom-1 mono-tag !text-[7px] !tracking-[0.2em] text-paper/85">OCUP</span>}
                  {isToday && !occupied && <span className="absolute bottom-1 w-1 h-1 rounded-full" style={{ background: '#c8462a' }} />}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="hairline-t px-3 py-2 flex flex-wrap items-center gap-3 mono-tag !text-[9px] text-ink-soft">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-bermellon" /> EVENTO / OCUPADO</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-paper-2 hairline" /> HOY</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-white hairline" /> LIBRE</span>
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
