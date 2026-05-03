
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Database, Disc, Heart, MessageCircle, Plus, Search, 
  Handshake, Loader2, Zap, LayoutGrid, Radio, TrendingUp, ShoppingBag,
  FileText, Globe, X, RefreshCw, Layers
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { Post, VinylRecord } from '../types';
import { CachedImage } from '../components/CachedImage';
import { TagLink } from '../components/TagLink';
import { useWishlist } from '../context/WishlistContext';
import { BandcampPlayer } from '../components/BandcampPlayer';

export const Community: React.FC = () => {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState<'muro' | 'whats-on' | 'market'>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const t = params.get('tab');
      if (t === 'whats-on' || t === 'market' || t === 'muro') return t;
    } catch {}
    return 'muro';
  });
  const [tagFilter, setTagFilter] = useState<string | null>(() => {
    try { return new URLSearchParams(window.location.search).get('tag'); }
    catch { return null; }
  });

  // Sync URL cuando cambia tag/tab
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (activeTab === 'muro') p.delete('tab'); else p.set('tab', activeTab);
    if (!tagFilter) p.delete('tag'); else p.set('tag', tagFilter.toLowerCase());
    const q = p.toString();
    const url = q ? `${window.location.pathname}?${q}` : window.location.pathname;
    window.history.replaceState(null, '', url);
  }, [activeTab, tagFilter]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [records, setRecords] = useState<VinylRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);
  const [showText, setShowText] = useState(true);
  
  // Hub Actions States
  const [showHubModal, setShowHubModal] = useState<'import' | 'discogs' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [csvInput, setCsvInput] = useState('Artista, Titulo, Precio, Genero\nDaft Punk, Homework, 30, House\nJoy Division, Unknown Pleasures, 25, Post-Punk');
  const [discogsUser, setDiscogsUser] = useState('');
  const [isAuth, setIsAuth] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [p, r] = await Promise.all([
      dataService.getPosts(),
      dataService.getRecords()
    ]);
    setPosts(p);
    setRecords(r);
    setIsAuth(dataService.isAuthenticated());
    setLoading(false);
    setTimeout(() => setIsRevealed(true), 120);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('mat32_data_changed', loadData);
    return () => window.removeEventListener('mat32_data_changed', loadData);
  }, []);

  const filteredRecords = useMemo(() => {
    return records.filter(r => (r.artist + r.title).toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, records]);

  const handleBatchImport = async () => {
    setIsProcessing(true);
    const count = await dataService.batchImportRecords(csvInput);
    setIsProcessing(false);
    setShowHubModal(null);
  };

  const handleDiscogsSync = async () => {
    if (!discogsUser) return;
    setIsProcessing(true);
    await dataService.syncDiscogsCollection(discogsUser);
    setIsProcessing(false);
    setShowHubModal(null);
  };

  const renderContentWithTags = (content: string) => {
    return content.split(/(\s+)/).map((part, i) => {
      if (part.startsWith('#')) {
        return <TagLink key={i} label={part} type="tag" className="!bg-transparent !border-none !p-0 !text-mat-500 hover:!text-white" showIcon={false} />;
      }
      return part;
    });
  };

  React.useEffect(() => {
    document.body.classList.add('theme-paper');
    return () => { document.body.classList.remove('theme-paper'); };
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink pb-24 grain">
      <SEO
        titleKey="El diario del almacén | MAT32"
        descriptionKey="Reseñas, entrevistas, listas y lo que se nos cruza. Escrito por el equipo y los residentes de MAT32 Ruzafa."
      />

      {/* HERO · slide 09 */}
      <section className="container mx-auto px-6 md:px-10 pt-12 md:pt-16 pb-10 hairline-b">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="mono-tag" style={{ color: '#c8462a' }}>SECCIÓN · /DIARIO</div>
            <h1 className="display mt-3" style={{ fontSize: 'clamp(54px, 9vw, 132px)', lineHeight: 0.85 }}>
              El <span style={{ color: '#c8462a' }}>diario</span><br/>del almacén.
            </h1>
            <p className="serif-italic text-2xl text-ink-soft mt-4 max-w-xl leading-snug">
              Reseñas, entrevistas, listas y lo que se nos cruza. Escrito por el equipo y los residentes.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setActiveTab('muro')} className={`px-4 py-2 mono-tag transition-colors ${activeTab === 'muro' ? 'bg-bermellon text-paper' : 'hairline hover:bg-ink hover:text-paper'}`}>MURO</button>
            <button onClick={() => setActiveTab('whats-on')} className={`px-4 py-2 mono-tag transition-colors ${activeTab === 'whats-on' ? 'bg-bermellon text-paper' : 'hairline hover:bg-ink hover:text-paper'}`}>WHAT'S ON</button>
            <Link to="/marketplace" className="px-4 py-2 mono-tag hairline hover:bg-ink hover:text-paper transition-colors">MARKETPLACE →</Link>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 md:px-10 py-12">
         {tagFilter && (
           <div className="mb-6 flex items-center gap-3 px-3 py-2 hairline bg-paper-2 w-fit">
             <span className="mono-tag text-ink-soft">FILTRANDO POR</span>
             <span className="display text-sm">#{tagFilter}</span>
             <button onClick={() => setTagFilter(null)}
               className="ml-2 w-5 h-5 flex items-center justify-center hairline hover:bg-ink hover:text-paper transition-colors">
               <X size={10} />
             </button>
           </div>
         )}
         {activeTab === 'whats-on' ? (
           <WhatsOnPanel tagFilter={tagFilter} onTagClick={(t) => setTagFilter(t)} />
         ) : activeTab === 'market' ? (
           <div className="animate-fade-in">
              {/* Acciones de Marketplace */}
              <div className="mb-12 flex flex-col md:flex-row gap-6 items-center">
                 <div className="relative flex-1 w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                    <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-mat-800 border-2 border-mat-700 p-5 pl-16 text-white text-xs font-black uppercase rounded-2xl outline-none focus:border-mat-500 transition-all" placeholder="Buscar discos en el mercado local..." />
                 </div>
                 <div className="flex gap-4 w-full md:w-auto">
                    <button 
                      onClick={() => isAuth ? setShowHubModal('import') : navigate('/admin')}
                      className="flex-1 md:flex-none px-6 py-5 bg-mat-800 border border-mat-700 rounded-2xl text-[9px] font-black uppercase text-gray-400 hover:text-white hover:border-mat-500 transition-all flex items-center justify-center gap-3"
                    >
                       <FileText size={16} /> IMPORTAR
                    </button>
                    <button 
                      onClick={() => isAuth ? setShowHubModal('discogs') : navigate('/admin')}
                      className="flex-1 md:flex-none px-6 py-5 bg-mat-800 border border-mat-700 rounded-2xl text-[9px] font-black uppercase text-gray-400 hover:text-white hover:border-mat-500 transition-all flex items-center justify-center gap-3"
                    >
                       <Globe size={16} /> DISCOGS_SYNC
                    </button>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
                 {loading ? (
                   <div className="col-span-full py-20 flex justify-center"><Loader2 className="animate-spin text-mat-500" /></div>
                 ) : filteredRecords.length === 0 ? (
                    <div className="col-span-full py-24 text-center border-2 border-dashed border-mat-800 rounded-[3rem]">
                       <Disc className="w-16 h-16 text-mat-800 mx-auto mb-6 opacity-40 animate-spin-slow" />
                       <p className="text-gray-600 font-black uppercase text-xs tracking-widest">No hay vinilos disponibles ahora mismo.</p>
                    </div>
                 ) : (
                   filteredRecords.map(r => (
                     <div key={r.id} onClick={() => navigate(`/records/${r.id}`)} className="bg-mat-800 border border-mat-700 rounded-[2.5rem] overflow-hidden group hover:border-mat-500 transition-all shadow-2xl flex flex-col h-full cursor-pointer">
                        <div className="aspect-square relative overflow-hidden bg-black">
                           <CachedImage src={r.coverUrl} alt={r.title} className="group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0 opacity-80" />
                           <div className="absolute top-6 right-6 flex flex-col gap-2" onClick={e => e.stopPropagation()}>
                              <button onClick={() => toggleWishlist(r.id)} className={`p-4 rounded-full backdrop-blur-xl transition-all ${isInWishlist(r.id) ? 'bg-mat-500 text-white shadow-lg' : 'bg-black/50 text-white/50 hover:text-white'}`}>
                                <Heart size={16} className={isInWishlist(r.id) ? 'fill-current' : ''} />
                              </button>
                           </div>
                           <div className="absolute bottom-6 left-6 bg-mat-950/80 backdrop-blur-md border border-mat-700 px-4 py-2 rounded-xl text-white font-exo font-black text-lg">€{r.price}</div>
                        </div>
                        <div className="p-8 flex-1 flex flex-col">
                           <h3 className="text-xl font-black text-white uppercase tracking-tighter font-exo group-hover:text-mat-500 transition-colors leading-none mb-2">{r.title}</h3>
                           <p className="text-mat-500 text-[10px] font-black uppercase tracking-widest mb-6">{r.artist}</p>
                           <div className="mt-auto pt-6 border-t border-mat-700/50 flex items-center justify-end text-[8px] font-black text-gray-500 uppercase tracking-[0.2em]">
                              <span className="flex items-center gap-2 text-mat-500 font-bold bg-mat-900 px-3 py-1.5 rounded-lg border border-mat-700 group-hover:border-mat-500 transition-all">
                                 <Handshake size={14} /> NEGOCIAR
                              </span>
                           </div>
                        </div>
                     </div>
                   ))
                 )}
              </div>
           </div>
         ) : (
           /* El Muro de la Comunidad */
           <div>
              <div className="flex justify-between items-baseline hairline-b pb-3 mb-8">
                 <h2 className="display text-2xl md:text-3xl">Últimas <span style={{ color: '#c8462a' }}>publicaciones.</span></h2>
                 <span className="mono-tag text-ink-soft">{posts.length} POSTS</span>
              </div>

              {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-mat-500" /></div>
              ) : posts.length === 0 ? (
                <div className="text-center py-24 bg-mat-800/30 rounded-[3rem] border-2 border-dashed border-mat-800">
                   <MessageCircle className="w-16 h-16 text-mat-800 mx-auto mb-6 opacity-40" />
                   <p className="text-gray-600 font-black uppercase text-xs">El muro está vacío.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {posts.filter(p => !tagFilter || (p.tags || []).map(x => x.toLowerCase()).includes(tagFilter.toLowerCase())).map(post => (
                    <article
                      key={post.id}
                      onClick={() => navigate(`/community/${post.id}`)}
                      className="bg-mat-800 border border-mat-700 rounded-[2.5rem] overflow-hidden hover:border-mat-500 transition-all duration-300 cursor-pointer group shadow-xl flex flex-col"
                    >
                      {/* Cover image */}
                      {post.imageUrl ? (
                        <div className="aspect-[4/3] overflow-hidden relative bg-black">
                          <CachedImage
                            src={post.imageUrl}
                            alt={post.title || post.content}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-mat-900/80 to-transparent" />
                        </div>
                      ) : (
                        <div className="aspect-video bg-gradient-to-br from-mat-900 to-mat-950 flex items-center justify-center border-b border-mat-700">
                          <Disc className="w-16 h-16 text-mat-700 group-hover:text-mat-500 transition-colors animate-spin-slow" />
                        </div>
                      )}

                      <div className="p-8 flex flex-col flex-1">
                        {/* Title */}
                        {post.title && (
                          <h3 className="text-xl font-black text-white uppercase tracking-tighter font-exo leading-tight mb-3 group-hover:text-mat-500 transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                        )}

                        {/* Content preview */}
                        <p className="text-gray-400 text-sm font-light italic leading-relaxed line-clamp-3 mb-4 flex-1">
                          {post.content}
                        </p>

                        {/* Bandcamp mini player */}
                        {(post as any).musicEmbed && (
                          <div onClick={e => e.stopPropagation()} className="mb-4">
                            <BandcampPlayer src={(post as any).musicEmbed} />
                          </div>
                        )}

                        {/* Tags clickables */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4" onClick={e => e.stopPropagation()}>
                            {post.tags.slice(0, 3).map((t: string) => (
                              <button key={t} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setTagFilter(t); }}
                                className="text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-mat-500 bg-mat-900 hover:bg-mat-500/10 px-2 py-0.5 rounded-full border border-mat-800 hover:border-mat-500/50 transition-colors">
                                #{t}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-5 border-t border-mat-700/50 mt-auto">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-mat-500 rounded-full flex items-center justify-center text-white text-[10px] font-black shrink-0">
                              {post.author?.[0]?.toUpperCase() || 'M'}
                            </div>
                            <div>
                              <span className="block text-[9px] font-black text-white uppercase tracking-widest">@{post.author || 'MAT32'}</span>
                              <span className="block text-[8px] text-gray-600 uppercase">{post.timestamp}</span>
                            </div>
                          </div>
                          <div className="flex gap-4 text-[9px] font-black text-gray-600">
                            <span className="flex items-center gap-1 hover:text-mat-500 transition-colors">
                              <Heart size={12} className="text-mat-500" /> {post.likes}
                            </span>
                            <span className="flex items-center gap-1 hover:text-white transition-colors">
                              <MessageCircle size={12} /> {post.comments?.length || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
           </div>
         )}
      </div>

      {/* Modales de Hub (Importación/Discogs) */}
      {showHubModal === 'import' && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-fade-in">
           <div className="w-full max-w-2xl bg-mat-900 border-2 border-mat-800 rounded-[3.5rem] p-12 relative shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
              <button onClick={() => setShowHubModal(null)} className="absolute top-10 right-10 text-gray-500 hover:text-white"><X size={28} /></button>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter font-exo mb-8">IMPORTACIÓN_MASIVA</h2>
              <textarea 
                value={csvInput} 
                onChange={e => setCsvInput(e.target.value)}
                className="w-full bg-mat-800 border-2 border-mat-700 p-6 h-48 text-white font-mono text-xs rounded-2xl outline-none focus:border-mat-500 mb-8"
              />
              <button onClick={handleBatchImport} disabled={isProcessing} className="w-full py-6 bg-mat-500 text-white font-black uppercase text-xs rounded-2xl flex items-center justify-center gap-4 hover:bg-mat-400 transition-all shadow-xl">
                 {isProcessing ? <Loader2 className="animate-spin" /> : <FileText />} EJECUTAR PROCESO
              </button>
           </div>
        </div>
      )}

      {showHubModal === 'discogs' && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-fade-in">
           <div className="w-full max-w-lg bg-mat-900 border-2 border-mat-800 rounded-[3.5rem] p-12 relative shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-500"></div>
              <button onClick={() => setShowHubModal(null)} className="absolute top-10 right-10 text-gray-500 hover:text-white"><X size={28} /></button>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter font-exo mb-8">DISCOGS_SYNC</h2>
              <div className="space-y-6">
                 <input 
                   type="text" 
                   value={discogsUser} 
                   onChange={e => setDiscogsUser(e.target.value)}
                   placeholder="NOMBRE DE USUARIO DISCOGS"
                   className="w-full bg-mat-800 border-2 border-mat-700 p-5 text-white font-black uppercase text-xs rounded-2xl outline-none focus:border-blue-500 transition-all"
                 />
                 <button onClick={handleDiscogsSync} disabled={isProcessing || !discogsUser} className="w-full py-6 bg-blue-600 text-white font-black uppercase text-xs rounded-2xl flex items-center justify-center gap-4 hover:bg-blue-500 transition-all shadow-xl">
                    {isProcessing ? <Loader2 className="animate-spin" /> : <RefreshCw />} INICIAR SINCRONIZACIÓN
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Reference points: oculto hasta poblar bios reales */}
    </div>
  );
};

// ── WHAT'S ON · agenda externa curada ────────────────────────
type WOScope = 'valencia' | 'es' | 'eu' | 'world';
interface WOItem {
  id: string; title: string; scope: WOScope;
  starts_at: string; ends_at: string | null;
  city: string; country: string; venue: string;
  url: string; category: string; cover_url: string;
  description: string; tags: string[]; featured: boolean;
}
const WO_SCOPES: { key: WOScope; label: string; sub: string }[] = [
  { key: 'valencia', label: 'Valencia', sub: 'Local' },
  { key: 'es',       label: 'España',   sub: 'Nacional' },
  { key: 'eu',       label: 'Europa',   sub: 'Continental' },
  { key: 'world',    label: 'Mundo',    sub: 'Global' },
];
const WO_CAT_COLOR: Record<string, string> = {
  club: '#ea580c', festival: '#f59e0b', listening: '#8b5cf6',
  talk: '#22c55e', market: '#ef4444', otros: '#6b7280',
};
const woFormatDate = (iso: string) => {
  const d = new Date(iso);
  const months = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
  const dows = ['DOM','LUN','MAR','MIÉ','JUE','VIE','SÁB'];
  return {
    d: String(d.getDate()).padStart(2,'0'),
    m: months[d.getMonth()],
    hhmm: `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`,
    dow: dows[d.getDay()],
  };
};

const WhatsOnPanel: React.FC<{ tagFilter?: string | null; onTagClick?: (t: string) => void }> = ({ tagFilter, onTagClick }) => {
  const [items, setItems] = useState<WOItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    // Traemos todos los scopes (sin filtro público) — jerarquía interna
    Promise.all(WO_SCOPES.map(s => dataService.getExternalEventsPublic(s.key)))
      .then(lists => {
        if (cancel) return;
        const merged = ([] as WOItem[]).concat(...lists as any[]);
        // De-dup por id
        const seen = new Set<string>();
        const unique = merged.filter(it => seen.has(it.id) ? false : (seen.add(it.id), true));
        setItems(unique);
        setLoading(false);
      })
      .catch(() => { if (!cancel) setLoading(false); });
    return () => { cancel = true; };
  }, []);

  const filtered = useMemo(() => {
    if (!tagFilter) return items;
    const t = tagFilter.toLowerCase();
    return items.filter(it => (it.tags || []).map(x => x.toLowerCase()).includes(t));
  }, [items, tagFilter]);

  const grouped = useMemo(() => {
    const map = new Map<string, WOItem[]>();
    filtered.forEach(it => {
      const key = it.starts_at.slice(0, 10);
      const arr = map.get(key) || [];
      arr.push(it); map.set(key, arr);
    });
    return Array.from(map.entries()).sort(([a],[b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 mb-3 text-mat-500 font-black uppercase text-[10px] tracking-[0.5em]">
          <Globe size={12} /> AGENDA · CURADA
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter font-exo leading-[0.95]">
          What's <span className="text-mat-500">on.</span>
        </h2>
        <p className="text-gray-400 mt-3 text-sm md:text-base max-w-2xl">
          Conciertos, festivales, listening sessions y cosas que nos parecen interesantes. Aquí, o donde sea.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center"><Loader2 className="animate-spin text-mat-500 w-8 h-8 mx-auto" /></div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-gray-500">
          <p className="text-base font-bold mb-1">{tagFilter ? `Sin eventos para #${tagFilter}.` : 'Aún no hay nada aquí.'}</p>
          <p className="text-sm">{tagFilter ? 'Prueba otro tag o quita el filtro.' : 'Seguimos curando. Vuelve pronto.'}</p>
        </div>
      ) : (
        <div className="space-y-10 max-w-4xl">
          {grouped.map(([day, dayItems]) => {
            const meta = woFormatDate(dayItems[0].starts_at);
            return (
              <div key={day}>
                <div className="flex items-baseline gap-4 mb-4 border-b border-mat-800 pb-3">
                  <div className="text-[10px] font-black uppercase tracking-[0.4em] text-mat-500">{meta.dow}</div>
                  <div className="text-4xl md:text-5xl font-black font-exo text-white uppercase tracking-tighter leading-none">{meta.d}</div>
                  <div className="text-sm font-black uppercase tracking-widest text-gray-500">{meta.m}</div>
                </div>
                <div className="space-y-3">
                  {dayItems.map(it => <WhatsOnCard key={it.id} item={it} onTagClick={onTagClick} />)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-14 border-t border-mat-800 pt-8 text-center">
        <p className="text-gray-400 text-sm mb-3">¿Organizas algo interesante?</p>
        <a href="mailto:hola@mat32.com?subject=Agenda%20MAT32"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-mat-700 hover:border-mat-500 rounded-full text-[11px] font-black uppercase tracking-[0.3em] text-gray-300 hover:text-white transition-colors">
          Proponer · hola@mat32.com
        </a>
      </div>
    </div>
  );
};

const WhatsOnCard: React.FC<{ item: WOItem; onTagClick?: (t: string) => void }> = ({ item, onTagClick }) => {
  const meta = woFormatDate(item.starts_at);
  const color = WO_CAT_COLOR[item.category] || WO_CAT_COLOR.otros;
  const clickable = !!item.url;
  const body = (
    <article
      className={`group flex gap-4 md:gap-5 p-4 md:p-5 rounded-2xl border transition-all ${clickable ? 'bg-mat-900 border-mat-800 hover:border-mat-500/60 cursor-pointer active:scale-[0.99]' : 'bg-mat-900/60 border-mat-800'} ${item.featured ? 'ring-1 ring-mat-500/40' : ''}`}
    >
      <div className="flex flex-col items-center shrink-0 pt-0.5" style={{ width: 56 }}>
        <div className="text-[10px] font-mono text-white font-bold">{meta.hhmm}</div>
        <div className="my-2 w-0.5 flex-1 min-h-[30px]" style={{ background: color }} />
        <div className="text-[9px] font-black uppercase tracking-widest" style={{ color }}>{item.category}</div>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-base md:text-lg font-black uppercase tracking-tight font-exo text-white leading-tight group-hover:text-mat-500 transition-colors">
          {item.title}
        </h3>
        {(item.venue || item.city) && (
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-500">
            <span className="truncate">{[item.venue, item.city, item.country].filter(Boolean).join(' · ')}</span>
          </div>
        )}
        {item.description && (
          <p className="mt-2 text-[13px] text-gray-400 leading-relaxed line-clamp-2">{item.description}</p>
        )}
        {item.tags && item.tags.length > 0 && onTagClick && (
          <div className="mt-2 flex flex-wrap gap-1.5" onClick={e => e.stopPropagation()}>
            {item.tags.slice(0, 4).map(t => (
              <button key={t} onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTagClick(t); }}
                className="text-[9px] font-black uppercase tracking-widest text-gray-500 bg-mat-950 hover:bg-mat-500 hover:text-white px-2 py-0.5 rounded-full border border-mat-800 hover:border-mat-500 transition-colors">
                #{t}
              </button>
            ))}
          </div>
        )}
      </div>
      {item.cover_url && (
        <div className="hidden md:block shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-black">
          <img src={item.cover_url} alt="" className="w-full h-full object-cover" loading="lazy" />
        </div>
      )}
    </article>
  );
  return clickable
    ? <a href={item.url} target="_blank" rel="noopener">{body}</a>
    : body;
};
