import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const API = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3003';
const FAVORITES_KEY = 'mat32_radio_favorites';
const HISTORY_KEY = 'mat32_radio_history_v1';
const USER_PAUSED_KEY = 'mat32_radio_user_paused';  // flag: el usuario ha pausado explícitamente
const HISTORY_MAX = 10;

export interface RadioTrack {
  id: number;
  artist: string;
  title: string;
  bandcamp_url: string | null;
  youtube_url: string;
  youtube_id: string;
  thumbnail_url: string;
  video_title: string;
  genre: string;
  country?: string | null;
  label?: string | null;
  year?: string | null;
  dc_genre?: string | null;
  dc_style?: string | null;
}

interface RadioContextType {
  tracks: RadioTrack[];
  loading: boolean;
  currentIdx: number;
  isPlaying: boolean;
  buffering: boolean;
  progress: number;                // 0..1 posición dentro del track actual
  favorites: number[];
  history: RadioTrack[];
  current: RadioTrack | null;
  previous: RadioTrack | null;
  beforePrevious: RadioTrack | null;
  toggle: () => void;
  next: () => void;
  setCurrentAndPlay: (idx: number) => void;
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
}

const RadioContext = createContext<RadioContextType | null>(null);

export const useRadio = () => {
  const ctx = useContext(RadioContext);
  if (!ctx) throw new Error('useRadio must be used within RadioProvider');
  return ctx;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Carga única del script YouTube IFrame API ──
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}
let ytApiPromise: Promise<void> | null = null;
const loadYouTubeApi = (): Promise<void> => {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.YT && window.YT.Player) return Promise.resolve();
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise(resolve => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { prev?.(); resolve(); };
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.async = true;
    document.head.appendChild(tag);
  });
  return ytApiPromise;
};

// YT.PlayerState: -1 unstarted, 0 ended, 1 playing, 2 paused, 3 buffering, 5 video cued
const YT_PLAYING = 1;
const YT_PAUSED = 2;
const YT_BUFFERING = 3;
const YT_ENDED = 0;

export const RadioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tracks, setTracks] = useState<RadioTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [favorites, setFavorites] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]'); }
    catch { return []; }
  });
  const [history, setHistory] = useState<RadioTrack[]>(() => {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
    catch { return []; }
  });

  // Refs (no re-renders). Persisten entre mountings de UI.
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);
  const readyRef = useRef(false);
  const currentIdxRef = useRef(0);
  const tracksRef = useRef<RadioTrack[]>([]);
  const autoStartedRef = useRef(false);

  useEffect(() => { currentIdxRef.current = currentIdx; }, [currentIdx]);
  useEffect(() => { tracksRef.current = tracks; }, [tracks]);

  // Historial
  const pushHistory = useCallback((tr: RadioTrack | null | undefined) => {
    if (!tr) return;
    setHistory(prev => {
      if (prev.length && prev[0].id === tr.id) return prev;
      const nextH = [tr, ...prev.filter(x => x.id !== tr.id)].slice(0, HISTORY_MAX);
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(nextH)); } catch {}
      return nextH;
    });
  }, []);

  // Cargar tracks
  useEffect(() => {
    let retries = 0;
    const MAX_RETRIES = 4;
    const load = async () => {
      try {
        // diverse=1 reparte el cupo entre buckets (país, década) para que el mapa
        // tenga material de todas las épocas y continentes, no 1000 temas US/UK de
        // los 2010s. Ullar Siir entra siempre completo.
        const res = await fetch(`${API}/radio/tracks?limit=1000&diverse=1&per_bucket=12&include_channel=${encodeURIComponent('Ullar Siir')}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const list: RadioTrack[] = data.tracks || [];
        if (list.length === 0) throw new Error('empty');
        setTracks(shuffle(list));
        setLoading(false);
      } catch (err) {
        retries++;
        if (retries < MAX_RETRIES) setTimeout(load, 3000 * retries);
        else { console.warn('[Radio] fallo cargando tracks:', err); setLoading(false); }
      }
    };
    load();
  }, []);

  // Crear el player UNA vez tras tener primer track
  useEffect(() => {
    if (!tracks.length || playerRef.current || !containerRef.current) return;
    let cancelled = false;
    loadYouTubeApi().then(() => {
      if (cancelled || playerRef.current || !containerRef.current) return;
      const first = tracks[0];
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: first.youtube_id,
        playerVars: {
          autoplay: 0,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          iv_load_policy: 3,
          disablekb: 1,
          fs: 0,
        },
        events: {
          onReady: () => { readyRef.current = true; },
          onStateChange: (e: any) => {
            const s = e.data;
            if (s === YT_PLAYING) { setIsPlaying(true); setBuffering(false); }
            else if (s === YT_PAUSED) { setIsPlaying(false); setBuffering(false); }
            else if (s === YT_BUFFERING) { setBuffering(true); }
            else if (s === YT_ENDED) {
              // El track terminó → progress=1 por un instante (brazo al inner groove), luego vuelve a reposo
              setProgress(1);
              setIsPlaying(false);
              setBuffering(false);
              // Pequeño delay para que la UI muestre el "llegó al final" antes de cargar el siguiente
              setTimeout(() => {
                const idx = currentIdxRef.current;
                const list = tracksRef.current;
                if (!list.length) return;
                const nextIdx = (idx + 1) % list.length;
                const playing = list[idx];
                if (playing) pushHistory(playing);
                setCurrentIdx(nextIdx);
                setProgress(0);
                const nextTrack = list[nextIdx];
                if (nextTrack && playerRef.current) {
                  try { playerRef.current.loadVideoById(nextTrack.youtube_id); } catch {}
                }
              }, 900);
            }
          },
          onError: (e: any) => {
            console.warn('[Radio] YT error', e?.data);
            // Errores comunes: 2 invalid id, 5 html5, 100 not found, 101/150 embed disabled.
            // Auto-next si el vídeo no se puede reproducir.
            setBuffering(false);
            const idx = currentIdxRef.current;
            const list = tracksRef.current;
            if (!list.length) return;
            const nextIdx = (idx + 1) % list.length;
            setCurrentIdx(nextIdx);
            const nextTrack = list[nextIdx];
            if (nextTrack && playerRef.current) {
              try { playerRef.current.loadVideoById(nextTrack.youtube_id); } catch {}
            }
          },
        },
      });
    });
    return () => { cancelled = true; };
  }, [tracks.length, pushHistory]);

  const current = tracks[currentIdx] ?? null;
  const previous = history[0] ?? null;
  const beforePrevious = history[1] ?? null;

  // Reset progress al cambiar de track
  useEffect(() => { setProgress(0); }, [currentIdx]);

  // ── Autoplay on first user gesture ──
  // Los navegadores bloquean autoplay con audio sin interacción. Arrancamos en el
  // primer click/touch/key si (a) el usuario no pausó explícitamente y (b) hay track.
  useEffect(() => {
    if (autoStartedRef.current) return;
    if (!tracks.length) return;

    let userPaused = false;
    try { userPaused = localStorage.getItem(USER_PAUSED_KEY) === '1'; } catch {}
    if (userPaused) { autoStartedRef.current = true; return; }

    const tryStart = () => {
      if (autoStartedRef.current) return;
      autoStartedRef.current = true;
      cleanup();
      // Intenta arrancar — si el player aún no está ready, reintenta en 500ms
      const attempt = (left: number) => {
        if (playerRef.current && readyRef.current) {
          try { playerRef.current.playVideo(); } catch {}
          return;
        }
        if (left > 0) setTimeout(() => attempt(left - 1), 500);
      };
      attempt(10); // hasta 5s de espera al player
    };

    const cleanup = () => {
      window.removeEventListener('pointerdown', tryStart);
      window.removeEventListener('keydown', tryStart);
      window.removeEventListener('touchstart', tryStart);
      window.removeEventListener('scroll', tryStart);
    };

    window.addEventListener('pointerdown', tryStart, { once: true, passive: true });
    window.addEventListener('keydown', tryStart, { once: true });
    window.addEventListener('touchstart', tryStart, { once: true, passive: true });
    window.addEventListener('scroll', tryStart, { once: true, passive: true });

    return cleanup;
  }, [tracks.length]);

  // Poll del tiempo mientras suena → progress 0..1 para animar el brazo
  useEffect(() => {
    if (!isPlaying) return;
    const tick = () => {
      const p = playerRef.current;
      if (!p || !readyRef.current) return;
      try {
        const ct = p.getCurrentTime?.();
        const d = p.getDuration?.();
        if (typeof ct === 'number' && typeof d === 'number' && d > 0) {
          setProgress(Math.max(0, Math.min(1, ct / d)));
        }
      } catch {}
    };
    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [isPlaying]);

  // ── Acciones síncronas (preservan user-gesture) ──
  const toggle = useCallback(() => {
    if (!playerRef.current || !readyRef.current) {
      setIsPlaying(p => !p);
      return;
    }
    try {
      const state = playerRef.current.getPlayerState?.();
      const isCurrentlyPlaying = state === YT_PLAYING || state === YT_BUFFERING;
      if (isCurrentlyPlaying) {
        playerRef.current.pauseVideo();
        // Pausa explícita del usuario → no volvemos a auto-arrancar en futuras cargas
        try { localStorage.setItem(USER_PAUSED_KEY, '1'); } catch {}
      } else {
        playerRef.current.playVideo();
        try { localStorage.removeItem(USER_PAUSED_KEY); } catch {}
      }
    } catch (err) {
      console.warn('[Radio] toggle err', err);
    }
  }, []);

  const next = useCallback(() => {
    const idx = currentIdxRef.current;
    const list = tracksRef.current;
    if (!list.length) return;
    const playing = list[idx];
    if (playing) pushHistory(playing);
    const nextIdx = (idx + 1) % list.length;
    setCurrentIdx(nextIdx);
    const nextTrack = list[nextIdx];
    if (!nextTrack) return;
    if (playerRef.current && readyRef.current) {
      try { playerRef.current.loadVideoById(nextTrack.youtube_id); } catch {}
    }
  }, [pushHistory]);

  const setCurrentAndPlay = useCallback((idx: number) => {
    const list = tracksRef.current;
    if (!list.length || idx < 0 || idx >= list.length) return;
    const playing = list[currentIdxRef.current];
    if (playing && playing.id !== list[idx].id) pushHistory(playing);
    setCurrentIdx(idx);
    const nextTrack = list[idx];
    if (!nextTrack) return;
    if (playerRef.current && readyRef.current) {
      try { playerRef.current.loadVideoById(nextTrack.youtube_id); } catch {}
    }
  }, [pushHistory]);

  const toggleFavorite = useCallback((id: number) => {
    setFavorites(prev => {
      const nextF = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(nextF));
      return nextF;
    });
  }, []);

  const isFavorite = useCallback((id: number) => favorites.includes(id), [favorites]);

  return (
    <RadioContext.Provider value={{ tracks, loading, currentIdx, isPlaying, buffering, progress, favorites, history, current, previous, beforePrevious, toggle, next, setCurrentAndPlay, toggleFavorite, isFavorite }}>
      {/* Host oculto del player · siempre montado */}
      <div
        aria-hidden="true"
        style={{ position: 'fixed', top: 0, left: 0, width: 320, height: 180, pointerEvents: 'none', zIndex: -1, transform: 'translate3d(-9999px, 0, 0)' }}
      >
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      </div>
      {children}
    </RadioContext.Provider>
  );
};
