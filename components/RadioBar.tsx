import React from 'react';
import { Play, Pause, SkipForward, Heart } from 'lucide-react';
import { useRadio } from '../context/RadioContext';

export const RadioBar: React.FC = () => {
  const { current, isPlaying, loading, toggle, next, toggleFavorite, isFavorite } = useRadio();

  if (loading || !current) return null;

  const ytSrc = isPlaying && current.youtube_id
    ? `https://www.youtube.com/embed/${current.youtube_id}?autoplay=1&rel=0&modestbranding=1`
    : null;

  const fav = isFavorite(current.id);

  return (
    <>
      {/* Hidden YouTube iframe — audio only */}
      {ytSrc && (
        <iframe
          key={current.youtube_id}
          src={ytSrc}
          allow="autoplay; encrypted-media"
          title="mat32-radio"
          style={{ position: 'fixed', width: 1, height: 1, opacity: 0, pointerEvents: 'none', top: 0, left: 0, border: 'none' }}
        />
      )}

      {/* Floating bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[150] h-16 bg-mat-950/96 backdrop-blur-xl border-t border-mat-800 flex items-center px-4 gap-3">

        {/* Indicator */}
        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-mat-500" style={{ boxShadow: isPlaying ? '0 0 8px var(--mat-500, #f97316)' : 'none', opacity: isPlaying ? 1 : 0.3 }} />

        {/* Now playing */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-black uppercase tracking-tight text-white truncate leading-tight">
            {current.artist || current.video_title}
          </p>
          {current.artist && current.title && (
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest truncate">
              {current.title}
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => toggleFavorite(current.id)}
            className={`p-2 rounded-lg transition-all ${fav ? 'text-mat-500' : 'text-gray-700 hover:text-gray-400'}`}
            title={fav ? 'Quitar favorito' : 'Favorito'}
          >
            <Heart size={14} fill={fav ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={toggle}
            className="p-2.5 bg-mat-500 hover:bg-mat-400 text-white rounded-full transition-all"
            title={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-px" />}
          </button>
          <button
            onClick={next}
            className="p-2 text-gray-600 hover:text-white transition-colors"
            title="Siguiente"
          >
            <SkipForward size={16} />
          </button>
        </div>
      </div>
    </>
  );
};
