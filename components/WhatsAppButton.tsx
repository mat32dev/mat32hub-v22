import React, { useEffect, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

const PHRASES = [
  'MATi contesta rápido. A veces demasiado.',
  'MATi nunca duerme. Literal.',
  'Habla con MATi, que es muy majo.',
  '¿Dudas? MATi está en modo selector 24/7.',
];

const WA_NUMBER = '34622190802';

export const WhatsAppButton: React.FC<{ defaultMessage?: string }> = ({ defaultMessage = 'Hola MATi, una pregunta...' }) => {
  const [phrase] = useState(() => PHRASES[Math.floor(Math.random() * PHRASES.length)]);
  const [dismissedTip, setDismissedTip] = useState(() => {
    try { return sessionStorage.getItem('mat32_wa_tip_dismissed') === '1'; } catch { return false; }
  });
  const [showTip, setShowTip] = useState(false);

  // Tooltip aparece a los 6s y se va solo 7s después (menos intrusivo en móvil)
  useEffect(() => {
    if (dismissedTip) return;
    const showT = setTimeout(() => setShowTip(true), 6000);
    const hideT = setTimeout(() => setShowTip(false), 13000);
    return () => { clearTimeout(showT); clearTimeout(hideT); };
  }, [dismissedTip]);

  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <>
      {showTip && !dismissedTip && (
        <div className="fixed bottom-[96px] right-4 z-[120] max-w-[240px] bg-mat-900 border border-mat-700 rounded-2xl shadow-2xl p-3 flex items-start gap-2 animate-fade-in">
          <p className="text-xs text-gray-200 flex-1 leading-relaxed italic">"{phrase}"</p>
          <button onClick={() => { setShowTip(false); setDismissedTip(true); try { sessionStorage.setItem('mat32_wa_tip_dismissed', '1'); } catch {} }}
            className="text-gray-500 hover:text-white shrink-0">
            <X size={14} />
          </button>
          <span className="absolute -bottom-2 right-6 w-3 h-3 bg-mat-900 border-b border-r border-mat-700 transform rotate-45" />
        </div>
      )}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Habla con MATi por WhatsApp"
        className="fixed bottom-[86px] right-4 z-[120] bg-[#25D366] hover:bg-[#1ebe5b] text-white w-12 h-12 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all active:scale-95"
        style={{ boxShadow: '0 4px 16px rgba(37,211,102,0.4)' }}
      >
        <MessageCircle size={22} fill="currentColor" strokeWidth={0} />
      </a>
    </>
  );
};
