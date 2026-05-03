import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSobremesa } from './SobremesaModal';

// MAT32 schedule (days 0=Sun, 1=Mon ... 6=Sat)
// Sobremesa: Wed-Sat 18:00-20:30 (4 slots: 18:00, 18:45, 19:30, 20:30)
// Night/Clubbing: Wed-Sat 22:00-02:00
const OPEN_DAYS = new Set([3, 4, 5, 6]); // Wed, Thu, Fri, Sat

type Mode = 'sobremesa' | 'clubbing' | 'pre-sobremesa' | 'between' | 'pre-night' | 'closed';
type Action = { kind: 'link'; to: string; cta: string } | { kind: 'modal'; cta: string };

function getCurrentMode(now: Date): Mode {
  const day = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  const isOpenDay = OPEN_DAYS.has(day);
  const isLateNight = (day === 0 || day === 4 || day === 5 || day === 6) && mins < 120; // after midnight Wed-Sat night
  const yesterdayOpen = OPEN_DAYS.has((day + 6) % 7);

  if (isLateNight && yesterdayOpen) return 'clubbing';
  if (!isOpenDay) return 'closed';

  // 0-18h: pre-sobremesa
  // 18:00-20:30: sobremesa
  // 20:30-22:00: between
  // 22:00-02:00: clubbing
  if (mins < 18 * 60) return 'pre-sobremesa';
  if (mins < 20 * 60 + 30) return 'sobremesa';
  if (mins < 22 * 60) return 'between';
  return 'clubbing';
}

const COPY: Record<Mode, { label: string; dot: string; action?: Action }> = {
  sobremesa:       { label: 'Ahora · Sobremesa · mesa, bebida, discos',     dot: 'bg-mat-500',      action: { kind: 'modal', cta: 'Reservar' } },
  clubbing:        { label: 'En directo · selectors · soul, jazz, house',   dot: 'bg-mat-500',      action: { kind: 'link', to: '/events', cta: 'Agenda' } },
  'pre-sobremesa': { label: 'Hoy · Sobremesa a las 18:00',                  dot: 'bg-mat-500/60',   action: { kind: 'modal', cta: 'Reservar' } },
  between:         { label: 'Noche abre a las 22:00',                       dot: 'bg-mat-500/60',   action: { kind: 'link', to: '/events', cta: 'Agenda' } },
  'pre-night':     { label: 'Noche a las 22:00',                            dot: 'bg-mat-500/60',   action: { kind: 'link', to: '/events', cta: 'Agenda' } },
  closed:          { label: 'Abre miércoles · 18:00',                       dot: 'bg-gray-500' },
};

export const LiveBar: React.FC = () => {
  const [now, setNow] = useState(new Date());
  const { open: openSobremesa } = useSobremesa();

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(i);
  }, []);

  const mode = getCurrentMode(now);
  const copy = COPY[mode];
  const time = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="lg:hidden fixed top-14 sm:top-16 left-0 right-0 z-[95] bg-ink text-paper hairline-ink-b">
      <div className="flex items-center justify-between px-4 py-1.5 gap-3 text-[10px]">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse" style={{ background: '#c8462a' }} />
          <span className="mono-tag !text-[10px] !tracking-widest text-paper/50 tabular-nums shrink-0">{time}</span>
          <span className="serif-italic text-paper/90 truncate">{copy.label}</span>
        </div>
        {copy.action && (copy.action.kind === 'link' ? (
          <Link to={copy.action.to} className="shrink-0 mono-tag !text-[9px] hairline-ink px-2 py-1 hover:bg-bermellon hover:text-paper transition-colors" style={{ color: '#c8462a' }}>
            {copy.action.cta} →
          </Link>
        ) : (
          <button onClick={openSobremesa} className="shrink-0 mono-tag !text-[9px] hairline-ink px-2 py-1 hover:bg-bermellon hover:text-paper transition-colors" style={{ color: '#c8462a' }}>
            {copy.action.cta} →
          </button>
        ))}
      </div>
    </div>
  );
};
