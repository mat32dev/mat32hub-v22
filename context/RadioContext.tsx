import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3003';
const FAVORITES_KEY = 'mat32_radio_favorites';

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
}

interface RadioContextType {
  tracks: RadioTrack[];
  loading: boolean;
  currentIdx: number;
  isPlaying: boolean;
  favorites: number[];
  current: RadioTrack | null;
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

export const RadioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tracks, setTracks]     = useState<RadioTrack[]>([]);
  const [loading, setLoading]   = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying]   = useState(false);
  const [favorites, setFavorites]   = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]'); }
    catch { return []; }
  });

  useEffect(() => {
    let retries = 0;
    const MAX_RETRIES = 4;

    const load = async () => {
      try {
        // Sin filtro de canal → toda la radio; limit alto para variedad
        const res  = await fetch(`${API}/radio/tracks?limit=300`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const list: RadioTrack[] = data.tracks || [];
        if (list.length === 0) throw new Error('empty');
        setTracks(shuffle(list));
        setLoading(false);
        // No autoplay: el navegador bloquea audio sin interacción del usuario
      } catch (err) {
        retries++;
        if (retries < MAX_RETRIES) {
          setTimeout(load, 3000 * retries); // backoff progresivo, loading sigue activo
        } else {
          console.warn('[Radio] No se pudieron cargar tracks tras', MAX_RETRIES, 'intentos:', err);
          setLoading(false);
        }
      }
    };
    load();
  }, []);

  const current = tracks[currentIdx] ?? null;

  const toggle = useCallback(() => setIsPlaying(p => !p), []);

  const next = useCallback(() => {
    setCurrentIdx(i => (i + 1) % tracks.length);
    setIsPlaying(true);
  }, [tracks.length]);

  const setCurrentAndPlay = useCallback((idx: number) => {
    setCurrentIdx(idx);
    setIsPlaying(true);
  }, []);

  const toggleFavorite = useCallback((id: number) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback((id: number) => favorites.includes(id), [favorites]);

  return (
    <RadioContext.Provider value={{ tracks, loading, currentIdx, isPlaying, favorites, current, toggle, next, setCurrentAndPlay, toggleFavorite, isFavorite }}>
      {children}
    </RadioContext.Provider>
  );
};
