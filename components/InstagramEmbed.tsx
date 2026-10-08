import React, { useEffect } from 'react';

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

let scriptPromise: Promise<void> | null = null;
const loadEmbedScript = (): Promise<void> => {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.instgrm) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise(resolve => {
    const tag = document.createElement('script');
    tag.src = 'https://www.instagram.com/embed.js';
    tag.async = true;
    tag.onload = () => resolve();
    document.body.appendChild(tag);
  });
  return scriptPromise;
};

// Embed oficial de Instagram (oEmbed) — sin API keys, sin login en Meta.
// Cada post se referencia por su URL pública; Instagram sirve el contenido
// vía iframe propio, así que no hay datos que enriquecer ni cachear aquí.
//
// El blockquote lleva el mismo contenido de reserva que devuelve la API oEmbed
// real de Instagram: un enlace visible al post. embed.js lo sustituye por el
// iframe si carga bien, pero si falla (bloqueadores de anuncios, cookies,
// red lenta) queda un enlace funcional en vez de un hueco vacío en la página.
export const InstagramEmbed: React.FC<{ url: string; caption?: boolean }> = ({ url, caption = false }) => {
  useEffect(() => {
    let cancelled = false;
    loadEmbedScript().then(() => {
      if (cancelled) return;
      window.instgrm?.Embeds.process();
    });
    return () => { cancelled = true; };
  }, [url]);

  return (
    <blockquote
      className="instagram-media"
      data-instgrm-permalink={`${url}?utm_source=ig_embed&utm_campaign=loading`}
      data-instgrm-version="14"
      {...(caption ? { 'data-instgrm-captioned': true } : {})}
      style={{ background: 'transparent', border: 0, margin: '0 auto', maxWidth: '540px', padding: 0, width: '100%' }}
    >
      <div style={{ padding: 16 }}>
        <a href={url} target="_blank" rel="noopener noreferrer"
          style={{ background: '#FFFFFF', lineHeight: 0, padding: '0 0', textAlign: 'center', textDecoration: 'none', width: '100%', display: 'block' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ backgroundColor: '#F4F4F4', borderRadius: '50%', height: 40, width: 40, marginBottom: 12 }} />
            <div style={{ color: '#c8462a', fontFamily: 'Arial,sans-serif', fontSize: 14, fontWeight: 600, lineHeight: '18px' }}>
              Ver esta publicación en Instagram
            </div>
          </div>
        </a>
      </div>
    </blockquote>
  );
};
