import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Loader2 } from 'lucide-react';

interface Video { uri: string; title: string; duration?: number }

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let ytApiPromise: Promise<void> | null = null;
const loadYT = (): Promise<void> => {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
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

const ytId = (url: string): string | null => {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
};

export const RecordPlayer: React.FC<{ videos: Video[] }> = ({ videos }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);
  const readyRef = useRef(false);
  const activeIdxRef = useRef(0);
  const videosRef = useRef<Video[]>([]);

  useEffect(() => { activeIdxRef.current = activeIdx; }, [activeIdx]);
  useEffect(() => { videosRef.current = videos; }, [videos]);

  const active = videos[activeIdx];
  const activeId = active ? ytId(active.uri) : null;

  useEffect(() => {
    if (!videos.length || !containerRef.current || playerRef.current) return;
    let cancelled = false;
    loadYT().then(() => {
      if (cancelled || playerRef.current || !containerRef.current) return;
      const firstId = ytId(videos[0].uri);
      if (!firstId) return;
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: firstId,
        playerVars: { autoplay: 0, controls: 0, rel: 0, modestbranding: 1, playsinline: 1, iv_load_policy: 3, disablekb: 1, fs: 0 },
        events: {
          onReady: () => { readyRef.current = true; },
          onStateChange: (e: any) => {
            const s = e.data;
            if (s === 1) { setIsPlaying(true); setBuffering(false); }
            else if (s === 2) { setIsPlaying(false); setBuffering(false); }
            else if (s === 3) { setBuffering(true); }
            else if (s === 0) {
              setIsPlaying(false);
              setProgress(1);
              setTimeout(() => {
                const list = videosRef.current;
                if (!list.length) return;
                const nextIdx = (activeIdxRef.current + 1) % list.length;
                const nextId = ytId(list[nextIdx]?.uri || '');
                setActiveIdx(nextIdx);
                setProgress(0);
                if (nextId && playerRef.current) {
                  try { playerRef.current.loadVideoById(nextId); } catch {}
                }
              }, 500);
            }
          },
          onError: () => {
            setBuffering(false);
            setIsPlaying(false);
            const list = videosRef.current;
            if (!list.length) return;
            const nextIdx = (activeIdxRef.current + 1) % list.length;
            const nextId = ytId(list[nextIdx]?.uri || '');
            setActiveIdx(nextIdx);
            if (nextId && playerRef.current) {
              try { playerRef.current.loadVideoById(nextId); } catch {}
            }
          },
        },
      });
    });
    return () => {
      cancelled = true;
      try { playerRef.current?.destroy?.(); } catch {}
      playerRef.current = null;
      readyRef.current = false;
    };
  }, [videos.length]);

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

  const toggle = () => {
    const p = playerRef.current;
    if (!p || !readyRef.current) return;
    try {
      const s = p.getPlayerState?.();
      if (s === 1 || s === 3) p.pauseVideo();
      else p.playVideo();
    } catch {}
  };

  const selectAndPlay = (i: number) => {
    const vid = videos[i];
    if (!vid) return;
    const id = ytId(vid.uri);
    if (!id) return;
    setActiveIdx(i);
    setProgress(0);
    if (playerRef.current && readyRef.current) {
      try { playerRef.current.loadVideoById(id); } catch {}
    }
  };

  if (!videos.length) return null;

  return (
    <div>
      <div
        aria-hidden="true"
        style={{ position: 'fixed', top: 0, left: 0, width: 320, height: 180, opacity: 0, pointerEvents: 'none', zIndex: -1, transform: 'translate3d(-9999px, 0, 0)' }}
      >
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="text-[10px] font-black uppercase tracking-[0.4em] text-mat-500 mb-3">
        Reproductor · {videos.length} {videos.length === 1 ? 'pista' : 'pistas'}
      </div>

      <div className="flex items-center gap-3 p-3 bg-mat-900 border border-mat-700 rounded-xl mb-3">
        <button
          onClick={toggle}
          disabled={!activeId}
          className="w-12 h-12 rounded-full bg-mat-500 hover:bg-mat-400 text-white flex items-center justify-center shrink-0 transition-all disabled:opacity-40 shadow-lg shadow-mat-500/20"
          aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
        >
          {buffering ? <Loader2 className="animate-spin" size={16} /> : isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-white truncate">{active?.title || 'Track'}</div>
          <div className="h-1 mt-1.5 bg-mat-800 rounded-full overflow-hidden">
            <div className="h-full bg-mat-500 transition-all duration-500" style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>
        </div>
      </div>

      {videos.length > 1 && (
        <ul className="space-y-1 max-h-[280px] overflow-y-auto custom-scrollbar pr-1">
          {videos.map((v, i) => {
            const id = ytId(v.uri);
            const isActive = activeIdx === i;
            return (
              <li key={i}>
                <button
                  onClick={() => selectAndPlay(i)}
                  disabled={!id}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${isActive ? 'bg-mat-500/10 border border-mat-500/40' : 'hover:bg-mat-950 border border-transparent'} disabled:opacity-40`}
                >
                  <span className={`p-1.5 rounded-full shrink-0 ${isActive ? 'bg-mat-500 text-white' : 'bg-mat-800 text-mat-500'}`}>
                    <Play size={10} fill="currentColor" />
                  </span>
                  <span className={`flex-1 truncate text-xs ${isActive ? 'text-mat-500 font-bold' : 'text-white'}`}>{v.title || 'Track'}</span>
                  {v.duration ? (
                    <span className="text-[10px] font-mono text-gray-500 shrink-0">
                      {Math.floor(v.duration / 60)}:{String(v.duration % 60).padStart(2, '0')}
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
