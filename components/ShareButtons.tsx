import React from 'react';
import { Facebook, Share2, Send, Link2, X, Instagram, Linkedin, CheckCircle2 } from 'lucide-react';

// Botones de compartir en redes para eventos de MAT32.
// WhatsApp (icono Send), Instagram, Facebook, X (Twitter), LinkedIn y copiar enlace.
// Fila compacta de iconos accesibles.

export const ShareButtons: React.FC<{ title: string; url?: string; compact?: boolean }> = ({
  title,
  url,
  compact = false,
}) => {
  const shareUrl = (url && url.startsWith('http'))
    ? url
    : typeof window !== 'undefined' ? window.location.href : '';
  const cleanTitle = title.replace(/[#_]/g, '');

  const sw = compact ? 16 : 20;
  const btn = 'p-2 rounded-full bg-[#c8462a]/10 hover:bg-[#c8462a]/25 hover:scale-110 transition';
  const iconCls = 'text-[#c8462a]';
  const aria = (n: string) => `Compartir en ${n}`;

  const waHref = `https://wa.me/?text=${encodeURIComponent('🎟 ' + cleanTitle + ' — ven a MAT32 (Valencia)\n' + shareUrl)}`;
  const fbHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const xHref = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(cleanTitle)}`;
  const inHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  const igHref = `https://instagram.com/`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      const el = document.getElementById('share-copy-feedback');
      if (el) { el.style.opacity = '1'; setTimeout(() => { el.style.opacity = '0'; }, 1600); }
    } catch { /* sin clipboard */ }
  };

  return (
    <div className="flex items-center gap-2" data-share="true">
      <span className="text-xs uppercase tracking-widest text-[#8a867d] mr-1">Compartir</span>

      <a href={waHref} target="_blank" rel="noopener noreferrer"
        aria-label={aria('WhatsApp')} title="WhatsApp" className={btn}>
        <Send size={sw} className={iconCls} />
      </a>
      <a href={igHref} target="_blank" rel="noopener noreferrer"
        aria-label={aria('Instagram')} title="Instagram" className={btn}>
        <Instagram size={sw} className={iconCls} />
      </a>
      <a href={fbHref} target="_blank" rel="noopener noreferrer"
        aria-label={aria('Facebook')} title="Facebook" className={btn}>
        <Facebook size={sw} className={iconCls} />
      </a>
      <a href={xHref} target="_blank" rel="noopener noreferrer"
        aria-label={aria('X / Twitter')} title="X" className={btn}>
        <X size={sw} className={iconCls} />
      </a>
      <a href={inHref} target="_blank" rel="noopener noreferrer"
        aria-label={aria('LinkedIn')} title="LinkedIn" className={btn}>
        <Linkedin size={sw} className={iconCls} />
      </a>

      <button onClick={copyLink} aria-label="Copiar enlace" title="Copiar enlace" className={btn}>
        <Link2 size={sw} className={iconCls} />
      </button>

      <span id="share-copy-feedback" aria-live="polite"
        className="text-[10px] text-[#22c55e] opacity-0 transition-opacity" style={{ opacity: 0 }}>
        ¡Enlace copiado!
      </span>
    </div>
  );
};