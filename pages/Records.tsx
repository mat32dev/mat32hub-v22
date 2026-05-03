import React, { useState, useMemo, useEffect } from 'react';
import { Search, ShoppingBag, Heart, Loader2, X, Play, ExternalLink, Store } from 'lucide-react';
import { CachedImage } from '../components/CachedImage';
import { RecordPlayer } from '../components/RecordPlayer';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { VinylRecord } from '../types';

interface TaxNode { name: string; count: number }

const API_URL = (import.meta as any).env?.VITE_API_URL || 'https://mat32.com/api';

export const Records: React.FC = () => {
  const [records, setRecords] = useState<VinylRecord[]>([]);
  const [taxonomy, setTaxonomy] = useState<{ genres: TaxNode[]; styles: TaxNode[] }>({ genres: [], styles: [] });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<VinylRecord | null>(null);
  const [heroOpen, setHeroOpen] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Hero auto-collapse: a los 3.5s se pliega y deja el foco en el árbol de géneros
  useEffect(() => {
    const t = setTimeout(() => setHeroOpen(false), 3500);
    return () => clearTimeout(t);
  }, []);

  const activeGenre = searchParams.get('genre');
  const activeStyle = searchParams.get('style');

  const loadData = async () => {
    setLoading(true);
    const data = await dataService.getRecords();
    setRecords(data || []);
    setLoading(false);
  };

  const loadTaxonomy = async () => {
    try {
      const res = await fetch(`${API_URL}/records/taxonomy`);
      if (res.ok) setTaxonomy(await res.json());
    } catch {}
  };

  useEffect(() => {
    loadData();
    loadTaxonomy();
    window.addEventListener('mat32_data_changed', loadData);
    return () => window.removeEventListener('mat32_data_changed', loadData);
  }, []);

  // URL-driven filtering
  const setFilter = (key: 'genre' | 'style', value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    setSearchParams(next, { replace: true });
  };
  const clearFilters = () => setSearchParams({}, { replace: true });

  const topPicks = useMemo(() => {
    return [...records]
      .sort((a, b) => parseFloat(String(b.price) || '0') - parseFloat(String(a.price) || '0'))
      .slice(0, 50);
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const q = searchTerm.trim().toLowerCase();
      const text = `${r.title} ${r.artist} ${r.description || ''} ${(r.genres || []).join(' ')} ${(r.styles || []).join(' ')}`.toLowerCase();
      if (q && !text.includes(q)) return false;
      if (activeGenre) {
        const gs = (r.genres || []).map(g => g.toLowerCase());
        if (!gs.includes(activeGenre.toLowerCase())) return false;
      }
      if (activeStyle) {
        const ss = (r.styles || []).map(s => s.toLowerCase());
        if (!ss.includes(activeStyle.toLowerCase())) return false;
      }
      return true;
    });
  }, [searchTerm, activeGenre, activeStyle, records]);

  useEffect(() => {
    document.body.classList.add('theme-ink');
    return () => { document.body.classList.remove('theme-ink'); };
  }, []);

  return (
    <div className="min-h-screen bg-ink text-paper pb-24">
      <SEO titleKey="El almacén · Discos | MAT32" descriptionKey="Stock real de la tienda. Lo que no entra en la pared, no entra aquí. Sin pre-orders, sin reservados, sin humo. Crate digger, marketplace y Digger Radar." />

      {/* HERO · slide 07 */}
      <section className="container mx-auto px-6 md:px-10 pt-12 md:pt-16 pb-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="mono-tag" style={{ color: '#c8462a' }}>SECCIÓN · /DISCOS</div>
            <h1 className="display mt-3" style={{ fontSize: 'clamp(54px, 9vw, 132px)', lineHeight: 0.85 }}>
              El almacén,<br/><span style={{ color: '#c8462a' }}>online.</span>
            </h1>
          </div>
          <p className="serif-italic text-paper/70 text-lg md:text-xl max-w-md md:text-right leading-snug">
            Stock real de la tienda. Lo que no entra en la pared, no entra aquí. Sin pre-orders, sin reservados, sin humo.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 md:px-10 py-6">
        {/* CTA Marketplace */}
        <Link to="/marketplace"
          className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-5 hairline-ink hover:bg-bermellon hover:text-paper transition-colors">
          <div className="flex items-center gap-4">
            <Store className="w-5 h-5" style={{ color: '#c8462a' }} />
            <div>
              <div className="mono-tag" style={{ color: '#c8462a' }}>MARKETPLACE · 3PL</div>
              <div className="display text-base md:text-lg mt-1">¿Tienes discos? Véndelos con nosotros.</div>
              <p className="serif-italic text-sm text-paper/60 mt-0.5">Fulfillment 3PL: gestionamos catálogo, envío y cobro.</p>
            </div>
          </div>
          <span className="mono-tag shrink-0">SABER MÁS →</span>
        </Link>

        {/* SEARCH */}
        <div className="flex flex-col md:flex-row gap-3 mb-6 hairline-ink p-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-paper/40" size={16} />
            <input
              type="text"
              placeholder="Buscar artista, álbum, género, estilo…"
              className="w-full bg-ink-2 hairline-ink p-3 pl-11 text-paper mono-tag !text-[11px] !tracking-[0.15em] !normal-case outline-none focus:border-bermellon transition-colors"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          {(activeGenre || activeStyle || searchTerm) && (
            <button onClick={() => { setSearchTerm(''); clearFilters(); }}
              className="flex items-center gap-2 px-4 py-2 bg-bermellon text-paper mono-tag !text-[10px]">
              <X size={12} /> LIMPIAR
            </button>
          )}
        </div>

        {/* TAXONOMY TREE */}
        <TaxonomyTree
          taxonomy={taxonomy}
          activeGenre={activeGenre}
          activeStyle={activeStyle}
          onGenre={(g) => setFilter('genre', activeGenre === g ? null : g)}
          onStyle={(s) => setFilter('style', activeStyle === s ? null : s)}
        />

        {/* RESULTS */}
        {loading ? (
          <div className="flex justify-center py-40"><Loader2 className="animate-spin text-mat-500 w-12 h-12" /></div>
        ) : (() => {
          const isFiltered = !!(activeGenre || activeStyle || searchTerm);
          const displayRecords = isFiltered ? filteredRecords : topPicks;

          if (displayRecords.length === 0) return (
            <div className="py-20 text-center">
              <p className="serif-italic text-paper/60 text-lg">Sin resultados.</p>
              <button onClick={() => { setSearchTerm(''); clearFilters(); }}
                className="mt-4 mono-tag" style={{ color: '#c8462a' }}>
                QUITAR FILTROS
              </button>
            </div>
          );

          return (
            <>
              {!isFiltered ? (
                <div className="mt-10 mb-6 flex items-end justify-between gap-4 hairline-ink-b pb-3">
                  <div>
                    <div className="mono-tag" style={{ color: '#c8462a' }}>SELECCIÓN CURADA</div>
                    <h2 className="display mt-2" style={{ fontSize: 'clamp(28px, 4vw, 56px)', lineHeight: 0.9 }}>
                      Best of <span style={{ color: '#c8462a' }}>the crate.</span>
                    </h2>
                    <p className="serif-italic text-paper/50 mt-2 text-sm">Los 50 mejores vinilos de nuestra colección · ordenados por precio</p>
                  </div>
                  <div className="mono-tag text-paper/40 shrink-0">50 PICKS</div>
                </div>
              ) : (
                <div className="mt-8 mb-4 mono-tag text-paper/60">
                  {filteredRecords.length} {filteredRecords.length === 1 ? 'DISCO' : 'DISCOS'}
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
                {displayRecords.map((record, idx) => (
                  <RecordCard
                    key={record.id}
                    record={record}
                    onOpen={() => setSelectedRecord(record)}
                    onTag={(kind, val) => setFilter(kind, val)}
                    isFav={isInWishlist(record.id)}
                    onFav={() => toggleWishlist(record.id)}
                    onAddCart={() => addToCart(record as any)}
                    rank={!isFiltered ? idx + 1 : undefined}
                  />
                ))}
              </div>
              {!isFiltered && (
                <div className="mt-12 text-center">
                  <p className="mono-tag text-paper/40">¿BUSCAS ALGO CONCRETO? USA EL BUSCADOR O FILTRA POR GÉNERO ARRIBA.</p>
                </div>
              )}
            </>
          );
        })()}
      </div>

      {selectedRecord && (
        <RecordDetail
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onAddCart={() => { addToCart(selectedRecord as any); }}
          onTag={(k, v) => { setFilter(k, v); setSelectedRecord(null); }}
          onGoAdmin={() => navigate(`/records/${selectedRecord.id}`)}
          isFav={isInWishlist(selectedRecord.id)}
          onFav={() => toggleWishlist(selectedRecord.id)}
        />
      )}
    </div>
  );
};

// ── TAXONOMY TREE ──────────────────────────────────────
const TaxonomyTree: React.FC<{
  taxonomy: { genres: TaxNode[]; styles: TaxNode[] };
  activeGenre: string | null;
  activeStyle: string | null;
  onGenre: (g: string) => void;
  onStyle: (s: string) => void;
}> = ({ taxonomy, activeGenre, activeStyle, onGenre, onStyle }) => {
  const [showAllGenres, setShowAllGenres] = useState(false);
  const [showAllStyles, setShowAllStyles] = useState(false);

  if (!taxonomy.genres.length && !taxonomy.styles.length) {
    return null;
  }

  const genresShown = showAllGenres ? taxonomy.genres : taxonomy.genres.slice(0, 12);
  const stylesShown = showAllStyles ? taxonomy.styles : taxonomy.styles.slice(0, 18);

  return (
    <div className="mb-6 hairline-ink p-4 md:p-5 bg-ink-2">
      {taxonomy.genres.length > 0 && (
        <div className="mb-4">
          <div className="mono-tag mb-2" style={{ color: '#c8462a' }}>GÉNEROS</div>
          <div className="flex flex-wrap gap-1.5">
            {genresShown.map(g => {
              const active = (activeGenre || '').toLowerCase() === g.name;
              return (
                <button key={g.name} onClick={() => onGenre(g.name)}
                  className={`px-3 py-1.5 mono-tag !text-[10px] !tracking-[0.2em] transition-colors ${active ? 'bg-bermellon text-paper' : 'hairline-ink text-paper hover:bg-bermellon hover:text-paper'}`}>
                  {g.name} <span className="opacity-60 ml-1">({g.count})</span>
                </button>
              );
            })}
            {taxonomy.genres.length > 12 && (
              <button onClick={() => setShowAllGenres(!showAllGenres)}
                className="px-3 py-1.5 mono-tag !text-[10px]" style={{ color: '#c8462a' }}>
                {showAllGenres ? 'MENOS ↑' : `+${taxonomy.genres.length - 12} MÁS`}
              </button>
            )}
          </div>
        </div>
      )}
      {taxonomy.styles.length > 0 && (
        <div>
          <div className="mono-tag mb-2" style={{ color: '#c8462a' }}>ESTILOS</div>
          <div className="flex flex-wrap gap-1.5">
            {stylesShown.map(s => {
              const active = (activeStyle || '').toLowerCase() === s.name;
              return (
                <button key={s.name} onClick={() => onStyle(s.name)}
                  className={`px-3 py-1.5 mono-tag !text-[9px] !tracking-[0.2em] transition-colors ${active ? 'bg-bermellon text-paper' : 'hairline-ink text-paper/70 hover:bg-bermellon hover:text-paper'}`}>
                  {s.name} <span className="opacity-60 ml-1">({s.count})</span>
                </button>
              );
            })}
            {taxonomy.styles.length > 18 && (
              <button onClick={() => setShowAllStyles(!showAllStyles)}
                className="px-3 py-1.5 mono-tag !text-[9px]" style={{ color: '#c8462a' }}>
                {showAllStyles ? 'menos ↑' : `+${taxonomy.styles.length - 18} más`}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ── RECORD CARD (grid item) ────────────────────────────
const RecordCard: React.FC<{
  record: VinylRecord;
  onOpen: () => void;
  onTag: (kind: 'genre' | 'style', value: string) => void;
  isFav: boolean;
  onFav: () => void;
  onAddCart: () => void;
  rank?: number;
}> = ({ record, onOpen, onTag, isFav, onFav, onAddCart, rank }) => {
  const firstGenre = (record.genres && record.genres[0]) || record.genre;
  return (
    <article onClick={onOpen}
      className={`hairline-ink overflow-hidden group flex flex-col hover:bg-bermellon hover:text-paper transition-colors cursor-pointer ${rank && rank <= 10 ? 'bg-ink-2' : 'bg-ink'}`}>
      <div className="relative aspect-square overflow-hidden bg-black hairline-ink-b">
        {record.coverUrl
          ? <CachedImage src={record.coverUrl} alt={record.title} />
          : <div className="w-full h-full flex items-center justify-center mono-tag text-paper/40">SIN COVER</div>
        }
        {rank && (
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-bermellon text-paper mono-tag !text-[9px]">
            #{rank}
          </div>
        )}
        <div className="absolute top-2 right-2" onClick={e => e.stopPropagation()}>
          <button onClick={onFav}
            className={`p-2 hairline-ink transition-colors ${isFav ? 'bg-bermellon text-paper' : 'bg-ink/70 text-paper/60 hover:text-paper'}`}>
            <Heart size={13} className={isFav ? 'fill-current' : ''} />
          </button>
        </div>
        <div className="absolute bottom-2 left-2 bg-ink text-paper px-2.5 py-1 mono-tag !text-[11px]" style={{ color: '#d8ff5a' }}>
          €{Math.round(record.price)}
        </div>
        {record.videos && record.videos.length > 0 && (
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-bermellon text-paper mono-tag !text-[9px] flex items-center gap-1">
            <Play size={8} fill="currentColor" /> {record.videos.length}
          </div>
        )}
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <h3 className="display text-sm leading-tight line-clamp-1 mb-0.5">{record.artist}</h3>
        <p className="mono-tag !text-[9px] text-paper/55 group-hover:text-paper/85 line-clamp-2 mb-2 transition-colors">{record.title}</p>
        <div className="mt-auto pt-2 hairline-ink-t flex items-center justify-between gap-2 group-hover:border-paper/30 transition-colors">
          {firstGenre ? (
            <button onClick={(e) => { e.stopPropagation(); onTag('genre', firstGenre); }}
              className="mono-tag !text-[9px] text-paper/55 hover:text-paper truncate max-w-[70%] transition-colors">
              {firstGenre}
            </button>
          ) : <span />}
          <button onClick={(e) => { e.stopPropagation(); onAddCart(); }}
            className="p-1.5 bg-paper text-ink hover:bg-claudia transition-colors shrink-0">
            <ShoppingBag size={13} />
          </button>
        </div>
      </div>
    </article>
  );
};

// ── RECORD DETAIL MODAL ────────────────────────────────
const RecordDetail: React.FC<{
  record: VinylRecord;
  onClose: () => void;
  onAddCart: () => void;
  onTag: (kind: 'genre' | 'style', value: string) => void;
  onGoAdmin: () => void;
  isFav: boolean;
  onFav: () => void;
}> = ({ record, onClose, onAddCart, onTag, isFav, onFav }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [onClose]);

  const hasVideos = (record.videos || []).length > 0;
  const hasTracklist = (record.tracklist || []).length > 0;

  return (
    <div className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex items-start justify-center p-0 md:p-6 overflow-y-auto"
      onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-5xl my-0 md:my-6 bg-mat-900 border border-mat-800 md:rounded-3xl shadow-2xl overflow-hidden custom-scrollbar"
      >
        <button onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2.5 bg-black/80 hover:bg-mat-800 rounded-full text-gray-400 hover:text-white shadow-xl">
          <X size={16} />
        </button>

        <div className="grid md:grid-cols-[1fr_1.1fr] gap-0">
          {/* Cover */}
          <div className="relative aspect-square bg-black overflow-hidden">
            {record.coverUrl
              ? <img src={record.coverUrl} alt={record.title} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-gray-700 text-xs font-black uppercase">Sin cover</div>
            }
            <div className="absolute bottom-4 left-4 flex items-center gap-3">
              <div className="bg-mat-950/95 backdrop-blur-md border border-mat-700 px-4 py-2 rounded-xl text-white font-exo font-black text-2xl tracking-tight shadow-xl">
                €{Math.round(record.price)}
              </div>
              {record.condition && (
                <div className="text-[10px] font-black uppercase tracking-widest bg-black/80 text-white/90 px-2 py-1 rounded-md">
                  {record.condition}
                </div>
              )}
            </div>
          </div>

          {/* Info + actions */}
          <div className="p-5 md:p-7 flex flex-col">
            {/* Header */}
            <div className="mb-4">
              {record.year && <div className="text-[10px] font-black text-mat-500 uppercase tracking-[0.4em] mb-2">{record.year} · {record.format || 'LP'}</div>}
              <h2 className="text-2xl md:text-3xl font-black font-exo uppercase text-white leading-tight tracking-tight mb-1">{record.artist}</h2>
              <p className="text-gray-400 text-sm md:text-base">{record.title}</p>
              {record.description && <p className="text-gray-500 text-xs mt-2 leading-relaxed">{record.description}</p>}
            </div>

            {/* Tags */}
            {(record.genres?.length || record.styles?.length) ? (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {(record.genres || []).map(g => (
                  <button key={`g-${g}`} onClick={() => onTag('genre', g)}
                    className="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-full bg-mat-500/10 text-mat-500 border border-mat-500/30 hover:bg-mat-500 hover:text-white">
                    {g}
                  </button>
                ))}
                {(record.styles || []).map(s => (
                  <button key={`s-${s}`} onClick={() => onTag('style', s)}
                    className="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-full bg-mat-900 text-gray-400 border border-mat-800 hover:border-mat-500 hover:text-white">
                    {s}
                  </button>
                ))}
              </div>
            ) : null}

            {/* Comments (seller notes) */}
            {record.comments && (
              <div className="mb-4 p-3 bg-mat-950 border border-mat-800 rounded-xl">
                <div className="text-[9px] font-black uppercase tracking-widest text-mat-500 mb-1">Notas del vendedor</div>
                <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">{record.comments}</p>
              </div>
            )}

            {/* CTAs */}
            <div className="flex gap-2 flex-wrap mb-4">
              <button onClick={onAddCart}
                className="flex-1 min-w-[160px] px-5 py-3 bg-mat-500 hover:bg-mat-400 text-white text-xs font-black uppercase tracking-[0.3em] rounded-full flex items-center justify-center gap-2 active:scale-95">
                <ShoppingBag size={14} /> Añadir al carrito
              </button>
              <button onClick={onFav}
                className={`p-3 rounded-full transition-colors ${isFav ? 'bg-mat-500/15 text-mat-500' : 'bg-mat-800 text-gray-500 hover:text-white'}`}
                title={isFav ? 'Quitar wishlist' : 'Añadir wishlist'}>
                <Heart size={14} className={isFav ? 'fill-current' : ''} />
              </button>
              {record.discogsLink && (
                <a href={record.discogsLink} target="_blank" rel="noopener"
                  className="p-3 bg-mat-800 text-gray-500 hover:text-white rounded-full" title="Ver en Discogs">
                  <ExternalLink size={14} />
                </a>
              )}
            </div>

            {/* Notes del release */}
            {record.notes && (
              <div className="mb-4">
                <div className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">Sobre el disco</div>
                <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-wrap line-clamp-6">{record.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Tracklist + Reproductor oculto estilo radio */}
        {(hasTracklist || hasVideos) && (
          <div className={`grid ${hasTracklist && hasVideos ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-0 border-t border-mat-800`}>
            {hasTracklist && (
              <div className={`p-5 md:p-6 ${hasVideos ? 'border-b md:border-b-0 md:border-r border-mat-800' : ''}`}>
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-mat-500 mb-3">Tracklist</div>
                <ol className="space-y-1.5">
                  {record.tracklist!.map((t, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <span className="text-[10px] font-mono text-gray-600 shrink-0 w-8">{t.position || '·'}</span>
                      <span className="text-white flex-1 truncate">{t.title}</span>
                      {t.duration && <span className="text-[11px] font-mono text-gray-500 shrink-0">{t.duration}</span>}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {hasVideos && (
              <div className="p-5 md:p-6">
                <RecordPlayer videos={record.videos!} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
