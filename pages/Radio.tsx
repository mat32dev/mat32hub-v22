import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Play, Pause, SkipForward, Heart, Radio, Mail, Mic2, CheckCircle2, Send, Loader2, AlertCircle, Disc, Instagram } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useRadio } from '../context/RadioContext';
import { dataService } from '../services/dataService';

interface Track {
  id: number;
  artist: string;
  title: string;
  genre: string;
  youtube_url: string | null;
  youtube_id: string | null;
  video_title: string;
}

const GENRE_COLOR: Record<string, string> = {
  House: '#8b5cf6',
  'Deep House': '#6366f1',
  Electronic: '#0ea5e9',
  Jazz: '#f59e0b',
  Soul: '#ef4444',
  Afro: '#10b981',
  World: '#22c55e',
  Mixed: '#ea580c',
};

export const RadioPage: React.FC = () => {
  const { tracks: radioTracks, loading: loadingTracks, previous, beforePrevious } = useRadio();
  const [mixes, setMixes] = useState<any[]>([]);

  const allTracks: Track[] = useMemo(() => radioTracks as any[], [radioTracks]);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/mixes/public');
        setMixes(await r.json());
      } catch {}
    })();
  }, []);

  React.useEffect(() => {
    document.body.classList.add('theme-paper');
    return () => { document.body.classList.remove('theme-paper'); };
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <SEO
        titleKey="Allegretto! Radio · MAT32 Valencia · Soul, Jazz, Afro, House"
        descriptionKey="Allegretto! Radio — radio continua desde MAT32 Ruzafa. Curaduría de Soul, Jazz, Afro, House, Electronic y World. Curada sin prisa."
      />

      {/* HERO · slide 08 */}
      <section className="container mx-auto px-6 md:px-10 pt-12 md:pt-16 pb-10 hairline-b grain">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="mono-tag" style={{ color: '#c8462a' }}>RADIO · /RADIO</div>
            <h1 className="display mt-3" style={{ fontSize: 'clamp(54px, 9vw, 132px)', lineHeight: 0.82, letterSpacing: '-0.02em' }}>
              Allegretto<span style={{ color: '#c8462a' }}>!</span><br/>Radio.
            </h1>
            <p className="serif-italic text-2xl md:text-3xl text-ink-soft mt-3">
              Happy people <span style={{ color: '#c8462a' }}>in the morning.</span>
            </p>
            <p className="serif-italic text-ink-soft mt-3 max-w-xl text-base leading-snug">
              Radio continua desde el local. Soul, Jazz, Afro, House, Electronic, World. Curada sin prisa.
            </p>
            <a href="https://www.instagram.com/allegretto_radio/" target="_blank" rel="noopener"
              className="inline-flex items-center gap-2 mt-6 mono-tag hairline px-4 py-2.5 hover:bg-ink hover:text-paper transition-colors">
              <Instagram size={14} /> @ALLEGRETTO_RADIO
            </a>
          </div>
          <div className="bg-ink text-paper p-5 hairline-ink min-w-[280px]">
            <div className="flex justify-between items-baseline mono-tag !text-[10px]">
              <span className="text-paper/65">EN ANTENA</span>
              <span style={{ color: '#d8ff5a' }}>DIRECTO ●</span>
            </div>
            <div className="display text-paper text-2xl mt-2 leading-none">
              {previous?.artist?.toUpperCase() || 'ALLEGRETTO!'}
            </div>
            <div className="mono-tag mt-2 text-paper/60 !text-[10px]">SOUL · JAZZ · HOUSE · ELECTRONIC</div>
          </div>
        </div>
      </section>

      {/* NEURAL TREE — fondo ink (preservado) */}
      <section className="py-10 md:py-14 hairline-b bg-ink text-paper relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(200,70,42,0.08),_transparent_70%)] pointer-events-none" />
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="mb-6 md:mb-8">
            <div className="mono-tag" style={{ color: '#d8ff5a' }}>CONSTELACIÓN · ALLEGRETTO!</div>
            <h2 className="display mt-2 text-paper" style={{ fontSize: 'clamp(28px, 4vw, 56px)', lineHeight: 0.95 }}>
              Tejido <span style={{ color: '#c8462a' }}>sonoro.</span>
            </h2>
            <p className="serif-italic text-paper/65 mt-3 text-base max-w-2xl">
              Cada punto es un tema. Los hilos conectan artistas y fuentes compartidas. Click para pinchar.
            </p>
          </div>
          {loadingTracks ? (
            <div className="py-20 text-center"><Loader2 className="animate-spin w-8 h-8 mx-auto" style={{ color: '#c8462a' }} /></div>
          ) : (
            <NeuralTree tracks={allTracks} />
          )}
        </div>
      </section>

      {/* PLAYER · Thorens TD-160D — preservado, fondo ink */}
      <section id="tt-player" className="py-12 md:py-16 hairline-b bg-ink-2 text-paper scroll-mt-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <TurntablePlayer />

          {(previous || beforePrevious) && (
            <div className="mt-6 flex flex-col md:flex-row gap-3 md:gap-6">
              {previous && (
                <div className="flex-1 px-4 py-3 hairline-ink">
                  <div className="mono-tag !text-[9px] text-paper/40">ACABA DE SONAR</div>
                  <div className="display text-sm mt-1 truncate text-paper">{previous.artist || previous.video_title}</div>
                  {previous.title && <div className="serif-italic text-[11px] text-paper/50 truncate mt-0.5">{previous.title}</div>}
                </div>
              )}
              {beforePrevious && (
                <div className="flex-1 px-4 py-3 hairline-ink opacity-70">
                  <div className="mono-tag !text-[9px] text-paper/40">ANTES</div>
                  <div className="display text-sm mt-1 truncate text-paper/85">{beforePrevious.artist || beforePrevious.video_title}</div>
                  {beforePrevious.title && <div className="serif-italic text-[11px] text-paper/40 truncate mt-0.5">{beforePrevious.title}</div>}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ARCHIVO */}
      <section className="py-16 md:py-20 hairline-b bg-paper">
        <div className="container mx-auto px-6 md:px-10 max-w-6xl">
          <div className="mb-8">
            <div className="mono-tag" style={{ color: '#c8462a' }}>EN ROTACIÓN · ARCHIVO</div>
            <h2 className="display mt-2" style={{ fontSize: 'clamp(36px, 5vw, 72px)', lineHeight: 0.9 }}>
              Siempre <span style={{ color: '#c8462a' }}>sonando.</span>
            </h2>
            <p className="serif-italic text-ink-soft mt-3 text-base md:text-lg max-w-2xl">
              Historial completo de tracks que populan Allegretto! Radio. Curados desde MAT32 Ruzafa.
            </p>
          </div>
          <ArchiveList tracks={allTracks} />
        </div>
      </section>

      <MixesSection mixes={mixes} />

      <section className="py-20 bg-paper-2">
        <div className="container mx-auto px-6 md:px-10 max-w-5xl grid md:grid-cols-2 gap-8">
          <NewsletterCard />
          <HostDJCard />
        </div>
      </section>
    </div>
  );
};

// ── THORENS TD-160D TURNTABLE PLAYER ──
// Arm angle sincronizado con estado real del player:
//   paused/stopped → -30° (arm lifted sobre rest post)
//   buffering     → -10° (descending slowly, cubre el buffer)
//   playing       → 14°  (sobre outer groove)
// La transición de 1.4s da sensación real de aguja bajando.
const TurntablePlayer: React.FC = () => {
  const { current, isPlaying, buffering, progress, toggle, next, toggleFavorite, isFavorite, tracks: radioTracks, setCurrentAndPlay } = useRadio();
  const [isDropOver, setIsDropOver] = useState(false);
  if (!current) return null;
  const fav = isFavorite(current.id);
  const labelColor = GENRE_COLOR[current.genre] || '#ea580c';

  // Arm geometry (grados de rotación alrededor del pivote 420,70, view-box coords):
  //   0°   → horizontal hacia la derecha, brazo sobre rest post (reposo)
  //  -53°  → hovering casi tocando borde del disco (buffer)
  //  -57°  → stylus en outer groove INFERIOR (~340, 250) — inicio canción
  //  -22°  → stylus cerca del centro (~252, 170) — final canción (inner groove)
  // Interpolación durante playback: de outer a inner conforme progress 0→1
  const ARM_REST = 0;
  const ARM_HOVER = -53;
  const ARM_OUTER = -57;
  const ARM_INNER = -22;
  const armAngle = buffering
    ? ARM_HOVER
    : isPlaying
      ? ARM_OUTER + progress * (ARM_INNER - ARM_OUTER)
      : progress >= 0.999
        ? ARM_INNER
        : ARM_REST;

  // Transiciones:
  //   buffering: lento descenso (cubre buffer)
  //   playing: corto/lineal (el brazo avanza con la música, no salta)
  //   stopped (post-end/pause): vuelta al reposo rápida
  const armTransition = buffering
    ? 'transform 1.2s cubic-bezier(0.33, 0, 0.35, 1)'
    : isPlaying
      ? 'transform 0.6s linear'
      : 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';

  // ── Drag & drop desde el crate ──
  const onDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('application/x-mat32-track')) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      setIsDropOver(true);
    }
  };
  const onDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget === e.target) setIsDropOver(false);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropOver(false);
    const raw = e.dataTransfer.getData('application/x-mat32-track');
    const id = parseInt(raw, 10);
    if (Number.isNaN(id)) return;
    const idx = radioTracks.findIndex(r => r.id === id);
    if (idx >= 0) setCurrentAndPlay(idx);
  };

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`mt-10 relative rounded-[28px] border-2 p-5 md:p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] transition-[box-shadow,border-color] ${isDropOver ? 'ring-4 ring-mat-500/60' : ''}`}
      style={{
        background: 'linear-gradient(145deg, #3a2416 0%, #241409 45%, #0f0804 100%)',
        borderColor: isDropOver ? '#ea580c' : '#2a1a0e',
      }}
    >
      {/* Drop zone overlay */}
      {isDropOver && (
        <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-mat-500/8 flex items-center justify-center z-30">
          <div className="px-5 py-2 bg-mat-500 text-white text-[11px] font-black uppercase tracking-[0.4em] rounded-full shadow-2xl animate-pulse">
            ↓ SOLTAR SOBRE PLATO
          </div>
        </div>
      )}
      {/* Logo engraved */}
      <div className="absolute top-4 left-6 flex items-center gap-3 text-[9px] font-black tracking-[0.45em] text-white/25 select-none">
        <span>THORENS · TD-160D</span>
      </div>
      <div className="absolute top-4 right-6 text-[9px] font-black tracking-[0.4em] text-white/20 select-none">
        MAT32 · RUZAFA
      </div>

      <div className="grid md:grid-cols-[1.25fr_1fr] gap-6 md:gap-10 items-center mt-6 md:mt-8">

        {/* SVG turntable · top-down view */}
        <div className="relative">
          <svg viewBox="0 0 500 380" className="w-full h-auto">
            <defs>
              <radialGradient id="tt-vinylShine" cx="50%" cy="50%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="60%" stopColor="#2a2a2a" stopOpacity="0.15" />
                <stop offset="95%" stopColor="transparent" />
              </radialGradient>
              <radialGradient id="tt-labelShine">
                <stop offset="0%" stopColor="white" stopOpacity="0.18" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
              <linearGradient id="tt-armGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#4a4a4a" />
                <stop offset="50%" stopColor="#a0a0a0" />
                <stop offset="100%" stopColor="#4a4a4a" />
              </linearGradient>
              <radialGradient id="tt-platterEdge" cx="50%" cy="50%">
                <stop offset="85%" stopColor="#0f0f0f" />
                <stop offset="95%" stopColor="#3a3a3a" />
                <stop offset="100%" stopColor="#0f0f0f" />
              </radialGradient>
            </defs>

            {/* 33 / 45 indicators */}
            <g>
              <circle cx="50" cy="70" r="4" fill={isPlaying && !buffering ? '#ea580c' : '#333'} />
              <text x="60" y="74" fontSize="9" fontWeight="900" fill={isPlaying && !buffering ? '#ea580c' : '#555'} fontFamily="'Exo 2', sans-serif">33⅓</text>
              <circle cx="50" cy="90" r="4" fill="#333" />
              <text x="60" y="94" fontSize="9" fontWeight="900" fill="#555" fontFamily="'Exo 2', sans-serif">45</text>
            </g>

            {/* Platter base shadow + edge ring */}
            <circle cx="200" cy="200" r="158" fill="url(#tt-platterEdge)" />
            <circle cx="200" cy="200" r="153" fill="#0a0a0a" />

            {/* Record + strobe spinning — translate(200,200) → rotate CSS alrededor de (0,0) → translate(-200,-200) para dibujar coords reales */}
            <g transform="translate(200 200)">
              <g className={(isPlaying || buffering) ? 'tt-spin' : ''}>
                <g transform="translate(-200 -200)">
                  <circle cx="200" cy="200" r="150" fill="#080808" />
                  {[148, 140, 132, 124, 116, 108, 98, 88, 76].map(r => (
                    <circle key={r} cx="200" cy="200" r={r} fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
                  ))}
                  <circle cx="200" cy="200" r="150" fill="url(#tt-vinylShine)" />
                  <circle cx="200" cy="200" r="58" fill={labelColor} />
                  <circle cx="200" cy="200" r="58" fill="url(#tt-labelShine)" />
                  <path d="M 142 200 A 58 58 0 0 0 258 200" fill="rgba(0,0,0,0.15)" />
                  <text x="200" y="187" textAnchor="middle" fontSize="8" fontWeight="900" fill="white" fontFamily="'Exo 2', sans-serif" letterSpacing="2">
                    {(current.artist || current.video_title).substring(0, 22).toUpperCase()}
                  </text>
                  <text x="200" y="200" textAnchor="middle" fontSize="6" fill="white" opacity="0.85" fontFamily="monospace" letterSpacing="0.5">
                    {(current.title || '').substring(0, 28).toUpperCase()}
                  </text>
                  <text x="200" y="215" textAnchor="middle" fontSize="5.5" fontWeight="900" fill="white" opacity="0.55" letterSpacing="3">
                    {(current.genre || 'ALLEGRETTO').toUpperCase()}
                  </text>
                  <circle cx="200" cy="200" r="3" fill="#1a1a1a" />
                  <circle cx="200" cy="200" r="1.4" fill="#000" />
                  {/* Strobe dots (giran junto al disco) */}
                  {[0, 90, 180, 270].map(deg => {
                    const rad = (deg * Math.PI) / 180;
                    const x = 200 + Math.cos(rad) * 155;
                    const y = 200 + Math.sin(rad) * 155;
                    return <circle key={`sd-${deg}`} cx={x} cy={y} r="1.5" fill="#ea580c" opacity="0.6" />;
                  })}
                </g>
              </g>
            </g>

            {/* Arm rest post */}
            <circle cx="440" cy="250" r="10" fill="#1a1a1a" />
            <circle cx="440" cy="250" r="6" fill="#2a2a2a" />

            {/* Tonearm */}
            <g style={{
                transform: `rotate(${armAngle}deg)`,
                transformOrigin: '420px 70px',
                transformBox: 'view-box',
                transition: armTransition,
              }}
            >
              {/* Pivot housing */}
              <circle cx="420" cy="70" r="22" fill="#1a1a1a" />
              <circle cx="420" cy="70" r="18" fill="#2a2a2a" />
              <circle cx="420" cy="70" r="13" fill="#555" />
              <circle cx="420" cy="70" r="8" fill="#888" />
              <circle cx="420" cy="70" r="3" fill="#222" />

              {/* Counterweight (behind pivot) */}
              <rect x="428" y="60" width="30" height="20" fill="#2a2a2a" rx="3" />
              <rect x="438" y="65" width="14" height="10" fill="#444" rx="1" />
              <circle cx="460" cy="70" r="3" fill="#111" />

              {/* Arm tube — recto */}
              <rect x="240" y="67" width="180" height="6" fill="url(#tt-armGrad)" rx="2" />

              {/* S-curve elbow + headshell */}
              <rect x="218" y="63" width="26" height="14" fill="#1a1a1a" rx="1" />
              {/* Headshell */}
              <rect x="212" y="77" width="32" height="10" fill="#2a2a2a" rx="1.5" />
              {/* Cartridge body */}
              <rect x="216" y="87" width="22" height="9" fill="#ea580c" />
              {/* Stylus */}
              <line x1="227" y1="96" x2="227" y2="101" stroke="#aaa" strokeWidth="1" />
              <circle cx="227" cy="101" r="1" fill="#fff" />
            </g>

            {/* Tracking indicator lamp */}
            <circle cx="440" cy="105" r="3" fill={isPlaying && !buffering ? '#22c55e' : buffering ? '#f59e0b' : '#441c0c'}>
              {isPlaying && !buffering && <animate attributeName="opacity" values="0.7;1;0.7" dur="1.8s" repeatCount="indefinite" />}
              {buffering && <animate attributeName="opacity" values="0.3;1;0.3" dur="0.9s" repeatCount="indefinite" />}
            </circle>

            {/* Cue lever */}
            <g>
              <rect x="452" y="160" width="4" height="20" fill="#333" />
              <rect x="448" y={isPlaying ? 157 : 175} width="12" height="6" fill="#ea580c" rx="1"
                style={{ transition: 'y 0.8s ease' }} />
              <text x="454" y="195" textAnchor="middle" fontSize="5" fontWeight="900" fill="#555" letterSpacing="1">CUE</text>
            </g>
          </svg>

          <style>{`
            @keyframes ttSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            .tt-spin { animation: ttSpin 1.8s linear infinite; }
          `}</style>
        </div>

        {/* Track info + controls */}
        <div>
          <div className="text-[9px] font-black uppercase tracking-[0.4em] mb-2" style={{ color: labelColor }}>
            {current.genre} · ALLEGRETTO! RADIO
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-white font-exo uppercase leading-tight tracking-tight mb-1">
            {current.artist || current.video_title}
          </h3>
          {current.title && <p className="text-sm text-gray-400 uppercase tracking-widest mb-4">{current.title}</p>}

          {buffering && (
            <p className="text-[10px] text-amber-400 uppercase tracking-[0.3em] font-black mt-3 animate-pulse">
              · aguja bajando · buffering ·
            </p>
          )}

          <div className="flex items-center gap-2 mt-6 flex-wrap">
            <button onClick={toggle} disabled={buffering}
              className="px-5 py-3 bg-mat-500 hover:bg-mat-400 disabled:opacity-60 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-full flex items-center gap-2 active:scale-95 transition-all">
              {buffering ? <Loader2 size={14} className="animate-spin" /> : isPlaying ? <Pause size={14} /> : <Play size={14} />}
              {buffering ? 'Cargando' : isPlaying ? 'Cue up' : 'Cue down'}
            </button>
            <button onClick={next}
              className="p-3 text-gray-400 hover:text-white bg-mat-800/60 hover:bg-mat-800 rounded-full transition-colors active:scale-95"
              title="Siguiente">
              <SkipForward size={16} />
            </button>
            <button onClick={() => toggleFavorite(current.id)}
              className={`p-3 rounded-full transition-all active:scale-95 ${fav ? 'text-mat-500 bg-mat-500/10' : 'text-gray-500 hover:text-white bg-mat-800/60 hover:bg-mat-800'}`}
              title={fav ? 'Quitar favorito' : 'Favorito'}>
              <Heart size={14} fill={fav ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


// ── NEURAL TREE · conexiones entre tracks (reactivado) ──
// Nodos y aristas más prominentes que la versión anterior.
const NeuralTree: React.FC<{ tracks: Track[] }> = ({ tracks }) => {
  const { tracks: radioTracks, setCurrentAndPlay, current } = useRadio();
  const [hover, setHover] = useState<Track | null>(null);
  const [selected, setSelected] = useState<Track | null>(null);
  const [t, setT] = useState(0);

  useEffect(() => {
    let raf = 0;
    let lastUpdate = 0;
    const start = performance.now();
    const THROTTLE_MS = 80;
    const tick = (now: number) => {
      if (now - lastUpdate >= THROTTLE_MS) {
        setT((now - start) / 1000);
        lastUpdate = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const W = 900, H = 900;
  const CX = W / 2, CY = H / 2;
  const breath = 1 + Math.sin(t * 0.8) * 0.05;

  const genreList = useMemo(
    () => Array.from(new Set(tracks.map(tr => tr.genre || 'Mixed'))).sort(),
    [tracks]
  );

  const positions = useMemo(() => {
    const pos = new Map<number, { x: number; y: number }>();
    tracks.forEach((tr, i) => {
      const gIdx = genreList.indexOf(tr.genre || 'Mixed');
      const genreCount = tracks.filter(x => (x.genre || 'Mixed') === tr.genre).length;
      const baseAngle = (gIdx / genreList.length) * Math.PI * 2;
      const within = tracks.filter(x => (x.genre || 'Mixed') === tr.genre).indexOf(tr);
      const spread = ((2 * Math.PI) / genreList.length) * 0.95;
      const jitter = ((tr.id % 100) / 100 - 0.5) * 0.12;
      const angle = baseAngle - spread / 2 + (within / Math.max(1, genreCount - 1)) * spread + jitter;
      const rRing = ((i * 37) % 180) + 160 + (tr.id % 30);
      pos.set(tr.id, { x: CX + Math.cos(angle) * rRing, y: CY + Math.sin(angle) * rRing });
    });
    return pos;
  }, [tracks, genreList]);

  // Aristas más agresivas
  const edges = useMemo(() => {
    const out: Array<{ from: Track; to: Track; strength: number; color: string }> = [];
    const byArtist = new Map<string, Track[]>();
    const byChannel = new Map<string, Track[]>();
    tracks.forEach(tr => {
      const art = (tr.artist || '').toLowerCase().trim();
      const ch = (tr as any).channel_name || '';
      if (art) {
        if (!byArtist.has(art)) byArtist.set(art, []);
        byArtist.get(art)!.push(tr);
      }
      if (ch) {
        if (!byChannel.has(ch)) byChannel.set(ch, []);
        byChannel.get(ch)!.push(tr);
      }
    });
    byArtist.forEach(arr => {
      if (arr.length > 1) {
        for (let i = 0; i < arr.length - 1 && out.length < 600; i++) {
          out.push({ from: arr[i], to: arr[i + 1], strength: 1, color: '#ea580c' });
        }
      }
    });
    byChannel.forEach(arr => {
      if (arr.length > 1 && arr.length < 40) {
        for (let i = 0; i < arr.length - 1 && out.length < 600; i++) {
          if (arr[i].artist !== arr[i + 1].artist) {
            out.push({ from: arr[i], to: arr[i + 1], strength: 0.55, color: '#a855f7' });
          }
        }
      }
    });
    return out;
  }, [tracks]);

  const playTrack = (tr: Track) => {
    const idx = radioTracks.findIndex(r => r.id === tr.id);
    if (idx >= 0) {
      setCurrentAndPlay(idx);
      setSelected(null);
      // No scroll to top: el player queda justo debajo en la siguiente sección
      document.getElementById('tt-player')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="relative select-none">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto max-h-[90vh]" style={{ background: 'radial-gradient(circle at center, rgba(234,88,12,0.06), transparent 70%)' }}>
        <defs>
          <filter id="nt-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
          <radialGradient id="nt-center-grad">
            <stop offset="0%" stopColor="#ea580c" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Stars backdrop más vivas */}
        {Array.from({ length: 60 }).map((_, i) => {
          const a = (i / 60) * Math.PI * 2;
          const r = 400 + (i % 3) * 25;
          const x = CX + Math.cos(a + t * 0.003) * r;
          const y = CY + Math.sin(a + t * 0.003) * r;
          const op = 0.18 + Math.sin(t + i) * 0.12;
          return <circle key={`s-${i}`} cx={x} cy={y} r="1.2" fill="#ea580c" opacity={Math.abs(op)} />;
        })}

        <circle cx={CX} cy={CY} r={140 * breath} fill="url(#nt-center-grad)" />

        {/* Conexiones — más prominentes */}
        {edges.map((e, i) => {
          const pa = positions.get(e.from.id);
          const pb = positions.get(e.to.id);
          if (!pa || !pb) return null;
          const hl = hover && (hover.id === e.from.id || hover.id === e.to.id);
          const pulse = 0.15 + Math.sin(t * 1.2 + i) * 0.06;
          const baseOpacity = e.strength === 1 ? 0.42 : 0.22;
          return (
            <line key={`e-${i}`}
              x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
              stroke={e.color}
              strokeOpacity={hl ? 1 : baseOpacity + pulse}
              strokeWidth={hl ? 2.6 : e.strength === 1 ? 1.4 : 0.75}
            />
          );
        })}

        {/* Nodes — más grandes */}
        {tracks.map(tr => {
          const p = positions.get(tr.id);
          if (!p) return null;
          const floatX = Math.sin(t * 0.7 + tr.id * 0.1) * 4;
          const floatY = Math.cos(t * 0.9 + tr.id * 0.13) * 4;
          const tx = p.x + floatX;
          const ty = p.y + floatY;
          const isHover = hover?.id === tr.id;
          const isSelected = selected?.id === tr.id;
          const isCurrent = current?.id === tr.id;
          const pulseOpacity = 0.65 + Math.sin(t * 2 + tr.id) * 0.2;
          const color = GENRE_COLOR[tr.genre] || '#a8a29e';
          const r = isSelected ? 13 : isHover ? 10 : isCurrent ? 9 : 4.5;
          return (
            <g key={tr.id}
              onMouseEnter={() => setHover(tr)}
              onMouseLeave={() => setHover(h => h?.id === tr.id ? null : h)}
              style={{ cursor: 'pointer' }}
              onClick={(e) => { e.stopPropagation(); setSelected(tr); }}
            >
              {(isHover || isSelected || isCurrent) && (
                <circle cx={tx} cy={ty} r={r + 14} fill={color}
                  opacity={isSelected ? 0.75 : isCurrent ? 0.6 : 0.45}
                  filter="url(#nt-glow)" />
              )}
              <circle cx={tx} cy={ty} r={r} fill={color}
                opacity={isHover || isSelected ? 1 : isCurrent ? 1 : pulseOpacity} />
              {isSelected && (
                <circle cx={tx} cy={ty} r={r + 7} fill="none" stroke="#ffffff" strokeWidth="1.8" />
              )}
              {isCurrent && (
                <circle cx={tx} cy={ty} r={r + 5} fill="none" stroke={color} strokeWidth="1.5" opacity="0.9">
                  <animate attributeName="r" from={r + 5} to={r + 18} dur="1.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.9" to="0" dur="1.6s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          );
        })}

        {/* Center node */}
        <g>
          <circle cx={CX} cy={CY} r={90 * breath} fill="#ea580c" opacity="0.08" filter="url(#nt-glow)" />
          <circle cx={CX} cy={CY} r={56 * breath} fill="#0c0a09" stroke="#ea580c" strokeWidth="2.5" />
          <circle cx={CX} cy={CY} r="46" fill="none" stroke="#ea580c" strokeWidth="0.6" strokeDasharray="2 3" opacity="0.7" />
          <text x={CX} y={CY - 4} textAnchor="middle" fontSize="16" fontWeight="900" fill="#ea580c" fontFamily="'Exo 2', sans-serif" letterSpacing="3">ALLEGRETTO!</text>
          <text x={CX} y={CY + 15} textAnchor="middle" fontSize="9" fontWeight="700" fill="#f5f5f4" fontFamily="monospace" letterSpacing="4">RADIO</text>
        </g>
      </svg>

      {hover && !selected && (
        <div className="pointer-events-none absolute top-3 left-3 right-3 md:top-4 md:left-1/2 md:-translate-x-1/2 md:right-auto md:min-w-[280px] md:max-w-[360px] bg-mat-950/95 backdrop-blur border border-mat-700 rounded-xl px-4 py-3 shadow-2xl">
          <div className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: GENRE_COLOR[hover.genre] || '#ea580c' }}>{hover.genre}</div>
          <div className="text-sm font-black text-white leading-tight">{hover.artist || hover.video_title}</div>
          {hover.title && <div className="text-xs text-gray-500 mt-0.5">{hover.title}</div>}
          <div className="text-[9px] text-mat-500 font-bold mt-2 uppercase tracking-widest">Click para seleccionar →</div>
        </div>
      )}

      {selected && (
        <div className="absolute top-3 left-3 right-3 md:top-4 md:left-1/2 md:-translate-x-1/2 md:right-auto md:min-w-[320px] md:max-w-[400px] bg-mat-950/95 backdrop-blur border-2 rounded-2xl shadow-2xl"
          style={{ borderColor: GENRE_COLOR[selected.genre] || '#ea580c' }}>
          <div className="p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: GENRE_COLOR[selected.genre] || '#ea580c' }}>{selected.genre}</div>
                <div className="text-base font-black text-white leading-tight">{selected.artist || selected.video_title}</div>
                {selected.title && <div className="text-xs text-gray-400 mt-0.5">{selected.title}</div>}
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white shrink-0 -mt-1 -mr-1 p-1">✕</button>
            </div>
            <button onClick={() => playTrack(selected)}
              className="w-full py-3 bg-mat-500 hover:bg-mat-400 text-white text-xs font-black uppercase tracking-[0.3em] rounded-xl flex items-center justify-center gap-2 active:scale-95">
              <Play size={14} fill="currentColor" /> REPRODUCIR
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


// ── FIRST-PERSON DIGGER (no usado) — se conserva por si se reutiliza ──
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _RecordCrate_legacy: React.FC<{ tracks: Track[] }> = ({ tracks }) => {
  const { tracks: radioTracks, setCurrentAndPlay, current } = useRadio();
  const [idx, setIdx] = useState(0);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Agrupar por género para crear separadores. Mantiene orden original.
  const items = useMemo(() => {
    const out: Array<{ type: 'divider'; genre: string } | { type: 'track'; track: Track }> = [];
    let lastGenre: string | null = null;
    tracks.forEach(t => {
      const g = t.genre || 'Mixed';
      if (g !== lastGenre) {
        out.push({ type: 'divider', genre: g });
        lastGenre = g;
      }
      out.push({ type: 'track', track: t });
    });
    return out;
  }, [tracks]);

  const playTrack = (tr: Track) => {
    const i = radioTracks.findIndex(r => r.id === tr.id);
    if (i >= 0) {
      setCurrentAndPlay(i);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Navegación
  const goTo = (newIdx: number) => {
    if (items.length === 0) return;
    const clamped = Math.max(0, Math.min(items.length - 1, newIdx));
    setIdx(clamped);
  };
  const prev = () => goTo(idx - 1);
  const nextItem = () => goTo(idx + 1);

  // Teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.activeElement && ['INPUT', 'TEXTAREA'].includes((document.activeElement as HTMLElement).tagName)) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); nextItem(); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); prev(); }
      if (e.key === 'Enter' || e.key === ' ') {
        const it = items[idx];
        if (it?.type === 'track') { e.preventDefault(); playTrack(it.track); }
      }
    };
    const node = containerRef.current;
    node?.addEventListener('keydown', onKey as any);
    return () => node?.removeEventListener('keydown', onKey as any);
  }, [idx, items]);

  // Wheel horizontal + vertical combinado
  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY) && Math.abs(e.deltaY) < 10) return;
    e.preventDefault();
    const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
    if (delta > 0) nextItem();
    else if (delta < 0) prev();
  };

  // Drag con mouse/touch — flick horizontal
  const onPointerDown = (e: React.PointerEvent) => {
    setDragStart(e.clientX);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragStart == null) return;
    setDragOffset(e.clientX - dragStart);
  };
  const onPointerUp = () => {
    if (dragStart == null) return;
    const steps = Math.round(-dragOffset / 60);
    if (steps !== 0) goTo(idx + steps);
    setDragStart(null);
    setDragOffset(0);
  };

  const currentItem = items[idx];

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="relative rounded-[28px] border-2 overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] outline-none focus:ring-2 focus:ring-mat-500/30"
      style={{
        background: 'linear-gradient(170deg, #3a2416 0%, #1d1108 55%, #0a0503 100%)',
        borderColor: '#2a1a0e',
        touchAction: 'pan-y',
      }}
      aria-label="Cajón de discos — usa ← → para hojear, Enter para pinchar"
    >
      {/* Cabecera del cajón */}
      <div className="relative z-20 flex items-center justify-between px-5 py-3 border-b border-black/40 bg-gradient-to-b from-black/30 to-transparent">
        <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/55">
          EL CAJÓN · PICK & PLAY
        </div>
        <div className="text-[9px] font-mono text-white/30 flex items-center gap-3">
          <span>{idx + 1} / {items.length}</span>
          <kbd className="hidden sm:inline px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px]">← →</kbd>
        </div>
      </div>

      {/* Textura madera horizontal (muy sutil) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 7px, rgba(255,230,200,0.5) 7px 8px), repeating-linear-gradient(0deg, transparent 0 31px, rgba(60,30,10,0.6) 31px 33px)',
      }} />

      {/* Escenario 3D primera persona */}
      <div className="relative" style={{ perspective: '1200px', perspectiveOrigin: '50% 110%' }}>
        <div
          className="relative flex items-end justify-center select-none"
          style={{
            height: 'clamp(260px, 42vw, 440px)',
            transformStyle: 'preserve-3d',
            paddingBottom: '40px',
          }}
        >
          {items.map((it, i) => {
            const rel = i - idx + (dragOffset / 60);
            const absRel = Math.abs(rel);
            if (absRel > 8) return null; // solo renderizar las cercanas → perf + visuals

            // Cartulas/separadores a distancia: desplazamiento X + Z + rotación + escala
            const tx = rel * 50;                        // horizontal offset
            const tz = -Math.abs(rel) * 80;             // profundidad → más lejos más pequeño
            const rotY = rel * -10;                     // abanico
            const opacity = Math.max(0, 1 - absRel / 8);
            const zIndex = 100 - Math.round(absRel * 10);

            const commonStyle: React.CSSProperties = {
              transform: `translateX(${tx}%) translateZ(${tz}px) rotateY(${rotY}deg) rotateX(-6deg)`,
              transformOrigin: 'bottom center',
              transition: dragStart != null ? 'none' : 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s',
              opacity,
              zIndex,
            };

            if (it.type === 'divider') {
              return (
                <div key={`d-${i}-${it.genre}`} className="absolute bottom-10" style={commonStyle}>
                  <Divider genre={it.genre} />
                </div>
              );
            }

            const t = it.track;
            const isFront = i === idx;
            const isCurrent = current?.id === t.id;
            return (
              <div
                key={`t-${t.id}`}
                className="absolute bottom-10"
                style={commonStyle}
              >
                <Sleeve
                  track={t}
                  isFront={isFront}
                  isCurrent={isCurrent}
                  onPick={() => playTrack(t)}
                  onClick={() => isFront ? playTrack(t) : goTo(i)}
                />
              </div>
            );
          })}

          {/* Mano sugerida: flecha/cursor que acompaña */}
          <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-white/30 text-xs font-black uppercase tracking-[0.5em] flex items-center gap-2">
            <span className="inline-block animate-pulse">◂</span>
            <span>drag · scroll · ← →</span>
            <span className="inline-block animate-pulse">▸</span>
          </div>
        </div>
      </div>

      {/* Controles + ficha del frente */}
      <div className="relative z-20 flex items-center gap-3 px-5 py-4 border-t border-black/50 bg-black/30">
        <button onClick={prev} disabled={idx === 0}
          className="p-2 text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
          title="Anterior (←)">
          ◀
        </button>
        <div className="flex-1 min-w-0">
          {currentItem?.type === 'track' ? (
            <>
              <div className="text-[9px] font-black uppercase tracking-[0.4em]" style={{ color: GENRE_COLOR[currentItem.track.genre] || '#ea580c' }}>
                {currentItem.track.genre}
              </div>
              <div className="text-sm font-black text-white truncate">{currentItem.track.artist || currentItem.track.video_title}</div>
              {currentItem.track.title && <div className="text-xs text-gray-400 truncate">{currentItem.track.title}</div>}
            </>
          ) : currentItem?.type === 'divider' ? (
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">— SEPARADOR · {currentItem.genre} —</div>
          ) : null}
        </div>
        {currentItem?.type === 'track' && (
          <button onClick={() => playTrack((currentItem as any).track)}
            className="px-5 py-2.5 bg-mat-500 hover:bg-mat-400 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-full flex items-center gap-2 active:scale-95 shrink-0">
            <Play size={12} fill="currentColor" /> Pinchar
          </button>
        )}
        <button onClick={nextItem} disabled={idx === items.length - 1}
          className="p-2 text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
          title="Siguiente (→)">
          ▶
        </button>
      </div>
    </div>
  );
};

// ── Separador de género (tab de cartón tipo tienda) ──
const Divider: React.FC<{ genre: string }> = ({ genre }) => (
  <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
    {/* Cartulina más pequeña (divider) con lengüeta saliente */}
    <div className="relative flex flex-col items-center">
      {/* Tab arriba */}
      <div className="relative -mb-2 z-10 px-3 py-1.5 rounded-t-lg bg-amber-50 text-black shadow-lg"
        style={{ borderBottom: '1px solid #aaa' }}>
        <div className="text-[9px] font-black uppercase tracking-[0.3em]">{genre}</div>
      </div>
      {/* Cuerpo del separador */}
      <div
        className="w-[200px] md:w-[230px] aspect-[1/1.04] rounded-sm shadow-[0_8px_24px_-6px_rgba(0,0,0,0.6)]"
        style={{
          background: 'repeating-linear-gradient(135deg, #d4c8b0 0 4px, #c9bd9f 4px 8px)',
          border: '1px solid #a89970',
        }}
      />
    </div>
  </div>
);

// ── Cartula procedural ──
// Genera portada variada por track (colores reales tipo sleeves usados)
const SLEEVE_BG_PALETTE = [
  // Kraft / cardboard
  { bg: '#8b7355', accent: '#3a2a1a', text: '#f5e9d0' },
  { bg: '#a08060', accent: '#2a1a0a', text: '#fff5dd' },
  // Off-white / paper
  { bg: '#e8e0cd', accent: '#1a1a1a', text: '#1a1a1a' },
  { bg: '#ddd0b8', accent: '#3a2818', text: '#2a1a0a' },
  // Blacks
  { bg: '#1c1c1c', accent: '#ea580c', text: '#f5f5f4' },
  { bg: '#2a2a2a', accent: '#fbbf24', text: '#f5f5f4' },
  // Burgundy
  { bg: '#722e3d', accent: '#f5e9d0', text: '#fffaf0' },
  // Olive
  { bg: '#6b7c5a', accent: '#f5e9d0', text: '#fffaf0' },
  // Teal
  { bg: '#3d5c5c', accent: '#ea580c', text: '#f5f5f4' },
  // Mustard
  { bg: '#a68b3c', accent: '#1c1c1c', text: '#1c1c1c' },
  // Cream
  { bg: '#f5e9cc', accent: '#8b3a4f', text: '#3a1a1a' },
];

const sleevePalette = (t: Track) => {
  // Preferir tono "real" salvo pocas portadas con color de género fuerte
  const idHash = t.id * 2654435761 >>> 0;
  if (idHash % 100 < 25) return { bg: GENRE_COLOR[t.genre] || '#786354', accent: '#0c0a09', text: '#fff' };
  return SLEEVE_BG_PALETTE[idHash % SLEEVE_BG_PALETTE.length];
};

const Sleeve: React.FC<{
  track: Track;
  isFront: boolean;
  isCurrent: boolean;
  onPick: () => void;
  onClick: () => void;
}> = ({ track, isFront, isCurrent, onPick: _onPick, onClick }) => {
  const p = sleevePalette(track);
  const artistShort = (track.artist || track.video_title || '').substring(0, 24).toUpperCase();
  const titleShort = (track.title || '').substring(0, 32);
  const initials = (track.artist || track.video_title || '?').split(/\s+/).map(s => s[0]).filter(Boolean).slice(0, 3).join('').toUpperCase();

  // Pequeño desgaste: posición fija por id
  const wearSeed = track.id % 5;

  const onDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/x-mat32-track', String(track.id));
    e.dataTransfer.setData('text/plain', `${track.artist} — ${track.title}`);
    e.dataTransfer.effectAllowed = 'copy';
    // Mini-drag image: ghost más pequeño
    const ghost = (e.currentTarget as HTMLElement).cloneNode(true) as HTMLElement;
    ghost.style.position = 'fixed'; ghost.style.top = '-1000px'; ghost.style.width = '120px'; ghost.style.opacity = '0.85';
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 60, 60);
    setTimeout(() => document.body.removeChild(ghost), 0);
  };

  return (
    <button
      onClick={onClick}
      draggable
      onDragStart={onDragStart}
      className={`relative group block focus:outline-none transition-transform duration-300 ${isFront ? 'hover:-translate-y-2' : ''} ${isCurrent ? 'ring-2 ring-mat-500 ring-offset-2 ring-offset-black' : ''}`}
      style={{
        width: 'clamp(180px, 26vw, 260px)',
        aspectRatio: '1 / 1',
        cursor: isFront ? 'grab' : 'grab',
      }}
      aria-label={`${track.artist || track.video_title}${track.title ? ' — ' + track.title : ''}`}
    >
      {/* Sleeve body */}
      <div
        className="absolute inset-0 rounded-sm shadow-[0_18px_35px_-10px_rgba(0,0,0,0.75),_inset_0_0_0_1px_rgba(255,255,255,0.08)]"
        style={{ backgroundColor: p.bg }}
      >
        {/* Textura cartón sutil */}
        <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(${(track.id % 60)}deg, transparent 0 2px, rgba(0,0,0,0.04) 2px 3px)`,
          }}
        />
        {/* Desgaste esquinas */}
        {wearSeed === 0 && <div className="absolute top-0 right-0 w-6 h-6 bg-black/20 rounded-sm" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />}
        {wearSeed === 1 && <div className="absolute bottom-0 left-0 w-5 h-5 bg-black/15 rounded-sm" style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }} />}
        {wearSeed === 2 && <div className="absolute top-1 left-2 text-[8px] font-black" style={{ color: p.accent, opacity: 0.4 }}>MINT-</div>}

        {/* Diseño: columna izquierda franja + bloque de texto */}
        <div className="absolute inset-0 p-3 flex flex-col">
          {/* Badge top-right */}
          <div className="flex justify-between items-start">
            <div className="text-[8px] font-black uppercase tracking-[0.3em]" style={{ color: p.accent, opacity: 0.7 }}>
              {track.genre}
            </div>
            <div className="text-[7px] font-mono opacity-40" style={{ color: p.text }}>
              #{track.id.toString().padStart(4, '0')}
            </div>
          </div>

          {/* Initials enormes — estilo maqueta minimal */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-6xl md:text-7xl font-black font-exo tracking-tighter leading-none" style={{ color: p.accent }}>
              {initials}
            </div>
          </div>

          {/* Pie con artista + título */}
          <div style={{ color: p.text }}>
            <div className="text-[10px] font-black uppercase tracking-widest truncate leading-tight">{artistShort}</div>
            {titleShort && <div className="text-[9px] opacity-70 truncate mt-0.5">{titleShort}</div>}
            <div className="mt-2 h-[1px] opacity-30" style={{ backgroundColor: p.accent }} />
            <div className="mt-1 text-[7px] font-mono opacity-40 flex justify-between">
              <span>MAT32 · RUZAFA</span>
              <span>33⅓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Disco asomando por arriba — detalle realista */}
      <div className="pointer-events-none absolute -top-1 left-[18%] right-[18%] h-2 rounded-b-full bg-black shadow-lg"
        style={{ boxShadow: `0 2px 0 rgba(0,0,0,0.4)` }}
      />

      {/* Overlay "AHORA" cuando es el actual */}
      {isCurrent && (
        <div className="pointer-events-none absolute top-2 left-2 bg-mat-500 text-white text-[8px] font-black uppercase tracking-[0.3em] px-2 py-0.5 rounded-sm shadow">
          AHORA
        </div>
      )}

      {/* Hover "pinchar" en el front */}
      {isFront && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="mb-3 px-3 py-1 bg-mat-500 text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-full shadow-lg">▲ Pinchar</span>
        </div>
      )}
    </button>
  );
};

// ── NEWSLETTER ──────────────────────────────────
const NewsletterCard: React.FC = () => {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setBusy(true); setError(false);
    try {
      await dataService.createInboxMessage({
        type: 'lead',
        sender: email,
        email,
        content: `NEWSLETTER signup desde Allegretto! Radio`,
        metadata: { source: 'allegretto-newsletter', page: '/radio' },
      });
      setDone(true);
      setEmail('');
    } catch { setError(true); }
    setBusy(false);
  };

  return (
    <div className="relative p-8 bg-gradient-to-br from-mat-800 via-mat-900 to-mat-900 border border-mat-700 rounded-3xl overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-mat-500" />
      <Mail className="w-10 h-10 text-mat-500 mb-4" />
      <h3 className="text-2xl md:text-3xl font-black uppercase text-white font-exo tracking-tight leading-tight mb-2">
        Agenda en tu email.
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-6">
        Sesiones, listening, noches temáticas. Un correo al mes, sin spam.
      </p>
      {done ? (
        <div className="flex items-center gap-2 text-green-400 text-sm font-black uppercase tracking-widest">
          <CheckCircle2 size={16} /> Suscrito. Bienvenido.
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          {error && (
            <div className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs">
              <AlertCircle size={12} /> No se pudo enviar. Prueba otra vez.
            </div>
          )}
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com"
            className="w-full bg-mat-950 border border-mat-800 rounded-xl px-4 py-3 text-white focus:border-mat-500 outline-none" />
          <button type="submit" disabled={busy}
            className="w-full py-3 bg-mat-500 hover:bg-mat-400 disabled:opacity-50 text-white text-xs font-black uppercase tracking-[0.3em] rounded-xl flex items-center justify-center gap-2">
            {busy ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} SUSCRIBIRME
          </button>
        </form>
      )}
    </div>
  );
};

// ── HOST DJ ──────────────────────────────────
const HostDJCard: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', genre: '', links: '', message: '' });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setBusy(true); setError(false);
    try {
      await dataService.createInboxMessage({
        type: 'artist',
        sender: form.name,
        email: form.email,
        phone: form.phone || undefined,
        content: `HOST A RADIO DJ · Género: ${form.genre || '-'} · Links: ${form.links || '-'} · Msg: ${form.message || '-'}`,
        metadata: { ...form, source: 'allegretto-host-dj' },
      });
      setDone(true);
    } catch { setError(true); }
    setBusy(false);
  };

  return (
    <div className="relative p-8 bg-mat-900 border border-mat-800 rounded-3xl overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-mat-500/5 rounded-full blur-2xl" />
      <Mic2 className="w-10 h-10 text-mat-500 mb-4" />
      <h3 className="text-2xl md:text-3xl font-black uppercase text-white font-exo tracking-tight leading-tight mb-2">
        ¿Quieres grabar en Allegretto!radio?
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-6">
        Buscamos selectors con criterio. Sesión grabada o en vivo en el local. Sin cachés raros — buena música y buena compañía.
      </p>
      {done ? (
        <div className="flex items-center gap-2 text-green-400 text-sm font-black uppercase tracking-widest">
          <CheckCircle2 size={16} /> Recibido. Escuchamos y respondemos.
        </div>
      ) : !open ? (
        <button onClick={() => setOpen(true)}
          className="px-6 py-3 bg-mat-500 hover:bg-mat-400 text-white text-xs font-black uppercase tracking-[0.3em] rounded-xl">
          PROPONER SESIÓN →
        </button>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          {error && (
            <div className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs">
              <AlertCircle size={12} /> Error. Prueba otra vez.
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Field><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nombre / alias" className="input" /></Field>
            <Field><input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" className="input" /></Field>
          </div>
          <Field><input value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })} placeholder="Estilo / género" className="input" /></Field>
          <Field><input value={form.links} onChange={e => setForm({ ...form, links: e.target.value })} placeholder="Mixcloud, SoundCloud, IG..." className="input" /></Field>
          <Field><textarea rows={2} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Cuéntanos qué propones" className="input" /></Field>
          <div className="flex gap-2">
            <button type="button" onClick={() => setOpen(false)} className="flex-1 py-2.5 bg-mat-800 text-gray-300 text-xs font-black uppercase tracking-widest rounded-xl">Cancelar</button>
            <button type="submit" disabled={busy} className="flex-1 py-2.5 bg-mat-500 hover:bg-mat-400 disabled:opacity-50 text-white text-xs font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-1">
              {busy ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />} ENVIAR
            </button>
          </div>
          <style>{`.input { width:100%; background:#0c0a09; border:1px solid #292524; border-radius:10px; padding:9px 12px; color:white; font-size:13px; outline:none; } .input:focus { border-color:#ea580c; }`}</style>
        </form>
      )}
    </div>
  );
};

const Field: React.FC<{ children: React.ReactNode }> = ({ children }) => <div>{children}</div>;

// ── ARCHIVE · Lista SEO de todos los tracks ───
const ArchiveList: React.FC<{ tracks: Track[] }> = ({ tracks }) => {
  const { tracks: radioTracks, setCurrentAndPlay, current } = useRadio();
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const genres = useMemo(() => {
    const s = new Set<string>();
    tracks.forEach(t => t.genre && s.add(t.genre));
    return Array.from(s).sort();
  }, [tracks]);

  const filtered = useMemo(() => tracks.filter(t => {
    if (filter !== 'all' && t.genre !== filter) return false;
    if (search && !(`${t.artist} ${t.title} ${t.video_title}`.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  }), [tracks, filter, search]);

  const playTrack = (tr: Track) => {
    const idx = radioTracks.findIndex(r => r.id === tr.id);
    if (idx >= 0) {
      setCurrentAndPlay(idx);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar artista o título..."
          className="flex-1 min-w-[200px] bg-mat-900 border border-mat-800 rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-mat-500" />
        <div className="flex gap-1 flex-wrap">
          <button onClick={() => setFilter('all')} className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg ${filter === 'all' ? 'bg-mat-500 text-white' : 'bg-mat-900 text-gray-400'}`}>TODO</button>
          {genres.map(g => (
            <button key={g} onClick={() => setFilter(g)}
              className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg border-l-4 ${filter === g ? 'bg-mat-500 text-white' : 'bg-mat-900 text-gray-400'}`}
              style={{ borderLeftColor: GENRE_COLOR[g] || '#44403c' }}>
              {g}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-10 text-center text-gray-500 text-sm">Sin resultados</div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm" itemScope itemType="https://schema.org/MusicPlaylist">
          <meta itemProp="name" content="Allegretto! Radio — Archivo completo" />
          {filtered.map(t => {
            const isCurrent = current?.id === t.id;
            return (
              <li key={t.id} itemScope itemType="https://schema.org/MusicRecording">
                <button onClick={() => playTrack(t)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${isCurrent ? 'bg-mat-500/10 border border-mat-500/30' : 'hover:bg-mat-900'}`}>
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: GENRE_COLOR[t.genre] || '#44403c' }} />
                  <div className="flex-1 min-w-0 truncate">
                    <span itemProp="byArtist" className={`font-bold truncate ${isCurrent ? 'text-mat-500' : 'text-white'}`}>{t.artist || t.video_title}</span>
                    {t.title && <span className="text-gray-500"> — <span itemProp="name">{t.title}</span></span>}
                  </div>
                  <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest shrink-0">{t.genre}</span>
                  {isCurrent && <span className="text-[9px] font-black text-mat-500 uppercase tracking-widest shrink-0 animate-pulse">AHORA</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

// ── SECCIÓN SESIONES ALLEGRETTO! ──────────────────────────
const MixesSection: React.FC<{ mixes: any[] }> = ({ mixes }) => {
  if (!mixes.length) return null;
  return (
    <section className="py-16 md:py-24 border-b border-mat-800 bg-mat-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(234,88,12,0.12),_transparent_60%)] pointer-events-none" />
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 mb-3 text-mat-500 font-black uppercase text-[10px] tracking-[0.5em]">
            <Disc size={12} /> ALLEGRETTO! · DATES
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter font-exo leading-[0.95] mb-3">
            Allegretto! <span className="text-mat-500">dates.</span>
          </h2>
          <p className="text-white/90 text-base md:text-lg font-bold uppercase tracking-wide mb-2">
            Happy People in The Morning <span aria-hidden="true">😎</span>
          </p>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            Open-air, baile y escucha. Próximas fechas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {mixes.map(m => <MixCard key={m.id} mix={m} />)}
        </div>

        <div className="mt-10 text-center">
          <a href="https://www.mixcloud.com/allegretto-live/" target="_blank" rel="noopener"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-mat-500 transition-colors">
            Todas las sesiones en Mixcloud ↗
          </a>
        </div>
      </div>
    </section>
  );
};

const MixCard: React.FC<{ mix: any }> = ({ mix }) => {
  const mixKey = mix.mixcloud_url.replace(/^https?:\/\/(www\.)?mixcloud\.com/, '');
  const widgetSrc = `https://www.mixcloud.com/widget/iframe/?hide_cover=1&light=1&feed=${encodeURIComponent(mixKey)}`;
  return (
    <article className={`group relative bg-mat-950 border rounded-3xl overflow-hidden transition-all ${mix.featured ? 'border-mat-500/40' : 'border-mat-800 hover:border-mat-500/30'}`}>
      {mix.cover_url && (
        <div className="relative aspect-video overflow-hidden">
          <img src={mix.cover_url} alt={mix.title || 'Sesión Allegretto!'} loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          {mix.featured && (
            <span className="absolute top-3 right-3 text-[9px] font-black uppercase tracking-widest text-black bg-mat-500 px-2 py-1 rounded-full">★ Destacado</span>
          )}
          <div className="absolute bottom-4 left-4 right-4">
            {mix.dj && <div className="text-[10px] font-black text-mat-500 uppercase tracking-[0.3em] mb-1">{mix.dj}</div>}
            <div className="text-lg md:text-xl font-black text-white uppercase tracking-tight font-exo leading-tight">{mix.title}</div>
          </div>
        </div>
      )}
      <div className="p-4 space-y-3">
        {!!(mix.tags && mix.tags.length) && (
          <div className="flex flex-wrap gap-1.5">
            {mix.tags.map((tag: string, i: number) => (
              <span key={i} className="text-[9px] font-black text-mat-500 uppercase tracking-widest border border-mat-800 rounded-full px-2 py-0.5">#{tag}</span>
            ))}
          </div>
        )}
        <div className="bg-mat-900 rounded-xl overflow-hidden">
          <iframe
            width="100%"
            height="60"
            src={widgetSrc}
            frameBorder="0"
            allow="autoplay"
            title={mix.title || 'Mixcloud player'}
          />
        </div>
      </div>
    </article>
  );
};
