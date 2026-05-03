import React, { useEffect, useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { useSobremesa } from './SobremesaModal';

const DISMISS_KEY = 'mat32_reserva_prompt_dismissed_v1';
const SHOW_AT_MS = 10_000;   // aparece a los 10s
const HIDE_AT_MS = 50_000;   // desaparece a los 50s

export const ReservaPrompt: React.FC = () => {
  const { open } = useSobremesa();
  const [state, setState] = useState<'pending' | 'visible' | 'hidden'>('pending');

  useEffect(() => {
    // si ya se descartó en esta sesión, no volver a mostrar
    try { if (sessionStorage.getItem(DISMISS_KEY) === '1') { setState('hidden'); return; } } catch {}

    const show = setTimeout(() => setState('visible'), SHOW_AT_MS);
    const hide = setTimeout(() => setState('hidden'), HIDE_AT_MS);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, []);

  const dismiss = () => {
    setState('hidden');
    try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch {}
  };

  const handleOpen = () => {
    try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch {}
    setState('hidden');
    open();
  };

  if (state !== 'visible') return null;

  return (
    <div className="sm:hidden fixed top-[calc(3.5rem+32px)] left-3 right-3 z-[130] animate-fade-in">
      <div className="relative bg-gradient-to-br from-mat-500 via-mat-500 to-mat-400 text-white rounded-2xl shadow-2xl p-3 pr-9 flex items-center gap-3"
        style={{ boxShadow: '0 8px 24px rgba(234,88,12,0.4)' }}>
        <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0 backdrop-blur-sm">
          <Calendar size={18} strokeWidth={2.5} />
        </div>
        <div className="flex-1 leading-tight min-w-0">
          <div className="text-[9px] font-black uppercase tracking-[0.3em] opacity-90">SOBREMESA · GRUPOS 4-12</div>
          <div className="text-[12px] font-black uppercase tracking-tight">Tablas + discos.</div>
        </div>
        <button onClick={handleOpen}
          className="shrink-0 px-3 py-2 bg-white text-mat-500 text-[10px] font-black uppercase tracking-widest rounded-lg active:scale-95">
          VER →
        </button>
        <button onClick={dismiss}
          aria-label="Cerrar"
          className="absolute top-1 right-1 p-1 text-white/70 hover:text-white">
          <X size={13} />
        </button>
      </div>
    </div>
  );
};
