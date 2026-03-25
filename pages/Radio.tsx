
import React from 'react';
import { Play, Pause, SkipForward, Heart, ExternalLink, Loader2 } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useRadio } from '../context/RadioContext';

const GENRE_BG: Record<string, string> = {
  'House':      'from-violet-950 via-purple-950 to-mat-950',
  'Deep House': 'from-indigo-950 via-violet-950 to-mat-950',
  'Electronic': 'from-blue-950 via-cyan-950 to-mat-950',
  'Jazz':       'from-amber-950 via-yellow-950 to-mat-950',
  'Soul':       'from-orange-950 via-red-950 to-mat-950',
  'Afro':       'from-green-950 via-teal-950 to-mat-950',
  'World':      'from-emerald-950 via-green-950 to-mat-950',
  'Mixed':      'from-mat-900 via-mat-950 to-mat-900',
};

export const RadioPage: React.FC = () => {
  const { current, isPlaying, loading, toggle, next, toggleFavorite, isFavorite } = useRadio();

  const bg  = current ? (GENRE_BG[current.genre] ?? 'from-mat-900 to-mat-950') : 'from-mat-900 to-mat-950';
  const fav = current ? isFavorite(current.id) : false;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bg} font-sans text-mat-cream flex flex-col items-center justify-center relative overflow-hidden transition-all duration-700`}>
      <SEO
        titleKey="MAT32 RADIO — Underground House & Electronic"
        descriptionKey="Radio continua de música underground, house y electrónica curada desde MAT32 Ruzafa Valencia."
      />

      {current?.thumbnail_url && (
        <img
          src={current.thumbnail_url}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-[0.06] blur-3xl scale-125 pointer-events-none"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

      {loading ? (
        <Loader2 className="w-10 h-10 text-mat-500 animate-spin" />
      ) : current ? (
        <div className="relative z-10 flex flex-col items-center text-center px-8 max-w-2xl w-full">
          <p className="text-[9px] font-black uppercase tracking-widest text-mat-500/60 mb-6">
            {current.genre} · MAT32 RADIO
          </p>

          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white font-exo leading-[0.88] mb-3">
            {current.artist || current.video_title}
          </h1>
          {current.artist && (
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-8">
              {current.title}
            </p>
          )}

          {current.bandcamp_url && (
            <a
              href={current.bandcamp_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-gray-600 hover:text-mat-500 transition-colors mb-8"
            >
              Comprar en Bandcamp <ExternalLink size={9} />
            </a>
          )}

          <div className="flex items-center gap-5">
            <button
              onClick={() => toggleFavorite(current.id)}
              className={`p-3 rounded-xl transition-all ${fav ? 'text-mat-500' : 'text-gray-700 hover:text-gray-400'}`}
            >
              <Heart size={20} fill={fav ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={toggle}
              className="p-6 bg-mat-500 hover:bg-mat-400 text-white rounded-full shadow-2xl shadow-mat-500/25 transition-all"
            >
              {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-0.5" />}
            </button>
            <button
              onClick={next}
              className="p-3 text-gray-600 hover:text-white transition-colors"
            >
              <SkipForward size={20} />
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-700 text-sm italic">Sin tracks disponibles.</p>
      )}
    </div>
  );
};
