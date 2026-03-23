
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Radio, Play, Pause, SkipForward, SkipBack, Shuffle, Volume2, ExternalLink, Loader2, Music2, Disc } from 'lucide-react';
import { SEO } from '../components/SEO';

const API = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3003';

interface RadioTrack {
  id: number;
  artist: string;
  title: string;
  timecode: string;
  bandcamp_url: string | null;
  bandcamp_embed: string | null;
  youtube_url: string;
  youtube_id: string;
  thumbnail_url: string;
  video_title: string;
  duration: number;
  genre: string;
  channel_name: string;
}

interface Channel {
  id: number;
  name: string;
  genre: string;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}


export const RadioPage: React.FC = () => {
  const [tracks, setTracks]           = useState<RadioTrack[]>([]);
  const [channels, setChannels]       = useState<Channel[]>([]);
  const [loading, setLoading]         = useState(true);
  const [activeChannel, setActiveChannel] = useState<string>('all');
  const [currentIdx, setCurrentIdx]   = useState(0);
  const [isPlaying, setIsPlaying]     = useState(false);
  const [shuffled, setShuffled]       = useState(false);
  const [queue, setQueue]             = useState<RadioTrack[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [tRes, cRes] = await Promise.all([
          fetch(`${API}/radio/tracks?limit=300`),
          fetch(`${API}/radio/channels`),
        ]);
        const tData = await tRes.json();
        const cData = await cRes.json();
        const trackList: RadioTrack[] = tData.tracks || [];
        setTracks(trackList);
        setChannels(cData || []);
        setQueue(trackList);
        setCurrentIdx(0);
      } catch {
        // API not ready yet — try again in 3s
        setTimeout(load, 3000);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = activeChannel === 'all'
    ? tracks
    : tracks.filter(t => t.channel_name === activeChannel);

  useEffect(() => {
    const list = shuffled ? shuffleArray(filtered) : filtered;
    setQueue(list);
    setCurrentIdx(0);
    setIsPlaying(false);
  }, [activeChannel, shuffled, tracks]);

  const current = queue[currentIdx] || null;

  const goNext = useCallback(() => {
    setCurrentIdx(i => (i + 1) % queue.length);
    setIsPlaying(true);
  }, [queue.length]);

  const goPrev = useCallback(() => {
    setCurrentIdx(i => (i - 1 + queue.length) % queue.length);
    setIsPlaying(true);
  }, [queue.length]);

  // Scroll active track into view
  useEffect(() => {
    const el = listRef.current?.querySelector('[data-active="true"]');
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [currentIdx]);

  // YouTube embed URL
  const ytEmbed = current?.youtube_id
    ? `https://www.youtube.com/embed/${current.youtube_id}?autoplay=${isPlaying ? 1 : 0}&rel=0&modestbranding=1`
    : null;

  return (
    <div className="min-h-screen bg-mat-900 pb-0 font-sans text-mat-cream flex flex-col">
      <SEO
        titleKey="MAT32 RADIO — Underground House & Electronic"
        descriptionKey="Radio continua de música underground, house y electrónica curada desde MAT32 Ruzafa Valencia."
      />

      {/* Header */}
      <div className="bg-mat-950 border-b border-mat-800 py-16 md:py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <Radio className="w-96 h-96 text-mat-500" />
        </div>
        <div className="relative z-10">
          <h1 className="text-[12vw] sm:text-[9rem] font-black uppercase tracking-tighter text-white font-exo leading-[0.85]">
            MAT32 <span className="text-mat-500">RADIO.</span>
          </h1>
          <p className="text-gray-500 text-sm mt-6 italic font-light">
            Underground House · Deep Electronic · Jazz Fusión
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden" style={{ height: 'calc(100vh - 280px)', minHeight: '600px' }}>

        {/* ── LEFT: Player ─────────────────────────────────────────── */}
        <div className="lg:w-[55%] flex flex-col bg-mat-950 border-r border-mat-800">

          {/* Channel selector */}
          <div className="flex items-center gap-2 p-4 border-b border-mat-800 bg-mat-900">
            <div className="flex bg-mat-800 rounded-2xl p-1 gap-1">
              <button
                onClick={() => setActiveChannel('all')}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeChannel === 'all' ? 'bg-mat-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
              >
                TODOS
              </button>
              {channels.map(ch => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannel(ch.name)}
                  className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeChannel === ch.name ? 'bg-mat-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                >
                  {ch.name}
                </button>
              ))}
            </div>
          </div>

          {/* Video / Player */}
          <div className="flex-1 relative bg-black">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-mat-500 animate-spin" />
              </div>
            ) : current ? (
              <>
                {isPlaying && ytEmbed ? (
                  <iframe
                    key={current.youtube_id + isPlaying}
                    src={ytEmbed}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title={current.video_title}
                  />
                ) : (
                  /* Thumbnail + play overlay */
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 p-10">
                    {current.thumbnail_url ? (
                      <img src={current.thumbnail_url} alt={current.video_title} className="max-h-48 object-cover rounded-2xl opacity-40" />
                    ) : (
                      <Disc className="w-32 h-32 text-mat-500 opacity-20" />
                    )}
                    <div className="text-center">
                      <p className="text-mat-500 text-[9px] font-black uppercase tracking-widest mb-2">{current.channel_name}</p>
                      <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter font-exo leading-tight">
                        {current.artist || current.video_title}
                      </h2>
                      {current.artist && (
                        <p className="text-gray-500 text-sm mt-2 italic">{current.title}</p>
                      )}
                    </div>
                    <button
                      onClick={() => setIsPlaying(true)}
                      className="p-8 bg-mat-500 hover:bg-mat-400 text-white rounded-full shadow-2xl shadow-mat-500/30 transition-all"
                    >
                      <Play size={36} className="ml-1" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-sm">
                Sin tracks disponibles
              </div>
            )}
          </div>

          {/* Bandcamp embed (cuando existe) */}
          {current?.bandcamp_embed && (
            <div className="border-t border-mat-700 bg-mat-900">
              <div className="px-6 pt-4 pb-1">
                <p className="text-[8px] text-mat-500 font-black uppercase tracking-widest">ESCUCHAR EN BANDCAMP</p>
              </div>
              <iframe
                src={current.bandcamp_embed}
                seamless
                style={{ border: 0, width: '100%', height: '42px', display: 'block' }}
                title="Bandcamp player"
              />
              {current.bandcamp_url && (
                <div className="px-6 pb-3">
                  <a
                    href={current.bandcamp_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[8px] text-gray-600 hover:text-mat-500 font-black uppercase tracking-widest flex items-center gap-1 transition-colors"
                  >
                    COMPRAR EN BANDCAMP <ExternalLink size={10} />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Controls */}
          <div className="border-t border-mat-800 p-6 flex items-center justify-between gap-4 bg-mat-950">
            <div className="flex-1 min-w-0">
              {current && (
                <>
                  <p className="text-white font-black uppercase tracking-tighter text-sm truncate font-exo">
                    {current.artist || current.video_title}
                  </p>
                  <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest truncate">
                    {current.artist ? current.title : current.genre}
                  </p>
                </>
              )}
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <button onClick={goPrev} className="p-3 text-gray-500 hover:text-white transition-colors">
                <SkipBack size={20} />
              </button>
              <button
                onClick={() => setIsPlaying(p => !p)}
                className="p-4 bg-mat-500 hover:bg-mat-400 text-white rounded-full shadow-lg shadow-mat-500/20 transition-all"
              >
                {isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
              </button>
              <button onClick={goNext} className="p-3 text-gray-500 hover:text-white transition-colors">
                <SkipForward size={20} />
              </button>
              <button
                onClick={() => setShuffled(s => !s)}
                className={`p-3 rounded-xl transition-all ${shuffled ? 'text-mat-500 bg-mat-500/10' : 'text-gray-600 hover:text-white'}`}
                title="Shuffle"
              >
                <Shuffle size={18} />
              </button>
              {current?.youtube_url && (
                <a href={current.youtube_url} target="_blank" rel="noopener noreferrer"
                   className="p-3 text-gray-600 hover:text-mat-500 transition-colors" title="Ver en YouTube">
                  <ExternalLink size={18} />
                </a>
              )}
            </div>

            <div className="flex-shrink-0 text-[9px] text-gray-700 font-black uppercase tracking-widest">
              {currentIdx + 1}/{queue.length}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Queue / Track list ─────────────────────────────── */}
        <div className="lg:w-[45%] flex flex-col bg-mat-900 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-mat-800 bg-mat-950 flex-shrink-0">
            <div className="flex items-center gap-3">
              <Music2 size={16} className="text-mat-500" />
              <span className="text-[10px] font-black text-mat-500 uppercase tracking-widest">COLA — {queue.length} TRACKS</span>
            </div>
            <div className="flex items-center gap-2">
              <Volume2 size={14} className="text-mat-500 animate-pulse" />
              <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest">
                {isPlaying ? 'EN DIRECTO' : 'PAUSADO'}
              </span>
            </div>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-mat-500 w-8 h-8" />
              </div>
            ) : queue.length === 0 ? (
              <div className="text-center py-20 text-gray-600 text-sm italic">
                No hay tracks disponibles aún.<br />
                El scraper sigue corriendo...
              </div>
            ) : (
              queue.map((track, idx) => {
                const isCurrent = idx === currentIdx;
                return (
                  <button
                    key={track.id + '-' + idx}
                    data-active={isCurrent ? 'true' : 'false'}
                    onClick={() => { setCurrentIdx(idx); setIsPlaying(true); }}
                    className={`w-full text-left flex items-center gap-4 px-6 py-4 border-b border-mat-800/50 transition-all group ${
                      isCurrent
                        ? 'bg-mat-500/10 border-l-2 border-l-mat-500'
                        : 'hover:bg-mat-800/40'
                    }`}
                  >
                    <div className="flex-shrink-0 w-8 text-center">
                      {isCurrent && isPlaying ? (
                        <Volume2 size={14} className="text-mat-500 mx-auto animate-pulse" />
                      ) : (
                        <span className={`text-[10px] font-black ${isCurrent ? 'text-mat-500' : 'text-gray-700 group-hover:text-gray-500'}`}>
                          {idx + 1}
                        </span>
                      )}
                    </div>

                    {track.thumbnail_url && (
                      <img src={track.thumbnail_url} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 opacity-60" />
                    )}

                    <div className="flex-1 min-w-0">
                      <p className={`text-[11px] font-black uppercase tracking-tight truncate ${isCurrent ? 'text-white' : 'text-gray-300 group-hover:text-white'} transition-colors`}>
                        {track.artist || track.video_title}
                      </p>
                      {track.artist && (
                        <p className="text-[9px] text-gray-600 uppercase tracking-widest truncate font-bold">
                          {track.title}
                        </p>
                      )}
                    </div>

                    {track.bandcamp_embed && (
                      <span className="text-[7px] flex-shrink-0 font-black text-mat-500 uppercase bg-mat-500/10 px-2 py-0.5 rounded border border-mat-500/20">BC</span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
