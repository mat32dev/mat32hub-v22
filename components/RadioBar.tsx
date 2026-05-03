import React from 'react';
import { Play, Pause, SkipForward, Heart, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRadio } from '../context/RadioContext';

export const RadioBar: React.FC = () => {
  const { current, isPlaying, buffering, loading, toggle, next, toggleFavorite, isFavorite, previous } = useRadio();

  if (loading || !current) return null;

  const fav = isFavorite(current.id);
  const lightColor = buffering ? '#f59e0b' : isPlaying ? '#22c55e' : '#ef4444';
  const lightLabel = buffering ? 'Cargando' : isPlaying ? 'Sonando' : 'Parada';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[150] h-16 bg-mat-950/96 backdrop-blur-xl border-t border-mat-800 flex items-center px-4 gap-3">

      {/* Status light */}
      <div
        className="flex-shrink-0 w-2.5 h-2.5 rounded-full transition-colors"
        style={{
          backgroundColor: lightColor,
          boxShadow: `0 0 ${isPlaying || buffering ? 10 : 6}px ${lightColor}`,
          animation: isPlaying ? 'breathing 1.8s ease-in-out infinite' : 'none',
        }}
        title={lightLabel}
      />

      {/* Now playing */}
      <Link to="/radio" className="flex-1 min-w-0 group" title={previous ? `Antes: ${previous.artist || previous.video_title}` : undefined}>
        <p className="text-[8px] font-black uppercase tracking-widest text-mat-500 mb-0.5 flex items-center gap-2">
          <span>ALLEGRETTO<span className="text-gray-600">!</span> RADIO</span>
          {previous && (
            <span className="hidden sm:inline text-gray-600 font-bold normal-case truncate max-w-[180px]">
              · ↩ {(previous.artist || previous.video_title).toLowerCase()}
            </span>
          )}
        </p>
        <p className="text-xs font-black uppercase tracking-tight text-white truncate leading-tight group-hover:text-mat-500 transition-colors">
          {current.artist || current.video_title}
        </p>
        {current.artist && current.title && (
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest truncate">
            {current.title}
          </p>
        )}
      </Link>

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
          className="p-2.5 bg-mat-500 hover:bg-mat-400 text-white rounded-full transition-colors active:scale-95"
          title={isPlaying ? 'Pausar' : 'Reproducir'}
          disabled={buffering}
        >
          {buffering ? <Loader2 size={14} className="animate-spin" /> : isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-px" />}
        </button>
        <button
          onClick={next}
          className="p-2 text-gray-600 hover:text-white transition-colors active:scale-95"
          title="Siguiente"
        >
          <SkipForward size={16} />
        </button>
      </div>
    </div>
  );
};
