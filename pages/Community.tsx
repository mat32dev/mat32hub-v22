import React, { useState, useEffect, useMemo } from 'react';
import { 
  Database, Disc, Heart, MessageCircle, Plus, Search, 
  Handshake, Loader2, Zap, LayoutGrid, Radio, TrendingUp, ShoppingBag,
  FileText, Globe, X, RefreshCw, Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { Post, VinylRecord } from '../types';
import { CachedImage } from '../components/CachedImage';
import { TagLink } from '../components/TagLink';
import { useWishlist } from '../context/WishlistContext';

export const Community: React.FC = () => {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState<'muro' | 'market'>('muro');
  const [posts, setPosts] = useState<Post[]>([]);
  const [records, setRecords] = useState<VinylRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
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

  return (
    <div className="min-h-screen bg-mat-900 pb-24">
      <SEO 
        titleKey="Comunidad & Marketplace P2P | Mat32 Ruzafa" 
        descriptionKey="Únete a la red de coleccionistas de Valencia. Intercambia vinilos, descubre novedades y negocia directamente con otros amantes del Hi-Fi." 
      />

      {/* Header con diseño minimalista */}
      <div className="bg-mat-950 pt-32 pb-20 border-b border-mat-800 relative overflow-hidden">
        <div className="container mx-auto px-6">
           <div className="flex flex-col md:flex-row justify-between items-end gap-10">
              <div className="max-w-3xl">
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mat-500/10 border border-mat-500/20 text-mat-500 font-black text-[9px] uppercase tracking-[0.4em] mb-8 animate-fade-in">
                    <Layers size={14} className="animate-pulse" /> RED DE COLECCIONISTAS ACTIVA
                 </div>
                 <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter text-white font-exo leading-[0.8] mb-6">THE <span className="text-mat-500">HUB.</span></h1>
                 <p className="text-gray-500 text-lg md:text-xl italic font-light">Espacio para el intercambio, el mercado P2P y las novedades de la comunidad.</p>
              </div>
              <div className="flex bg-mat-800 p-1.5 rounded-2xl border border-mat-700">
                 <button onClick={() => setActiveTab('muro')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'muro' ? 'bg-mat-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>MURO COMUNIDAD</button>
                 <button onClick={() => setActiveTab('market')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'market' ? 'bg-mat-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>MARKETPLACE P2P</button>
              </div>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
         {activeTab === 'market' ? (
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
                           <div className="mt-auto pt-6 border-t border-mat-700/50 flex items-center justify-between text-[8px] font-black text-gray-500 uppercase tracking-[0.2em]">
                              <div className="flex flex-col">
                                 <span className="text-gray-600 uppercase">VENDEDOR</span>
                                 <span className="text-white uppercase">@{r.sellerId || 'MAT32'}</span>
                              </div>
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
           <div className="max-w-3xl mx-auto space-y-12 animate-fade-in">
              <div className="flex justify-between items-center border-b border-mat-800 pb-6 mb-10">
                 <h2 className="text-2xl font-black text-white uppercase font-exo">ÚLTIMAS <span className="text-mat-500">PUBLICACIONES.</span></h2>
                 <button className="px-6 py-2 bg-mat-800 border border-mat-700 text-[9px] font-black text-white uppercase rounded-full hover:bg-mat-500 transition-colors">PUBLICAR +</button>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-mat-500" /></div>
              ) : posts.length === 0 ? (
                <div className="text-center py-24 bg-mat-800/30 rounded-[3rem] border-2 border-dashed border-mat-800">
                   <MessageCircle className="w-16 h-16 text-mat-800 mx-auto mb-6 opacity-40" />
                   <p className="text-gray-600 font-black uppercase text-xs">El muro está vacío. Sé el primero en compartir algo.</p>
                </div>
              ) : (
                posts.map(post => (
                  <article key={post.id} onClick={() => navigate(`/community/${post.id}`)} className="bg-mat-800 border border-mat-700 rounded-[3rem] p-10 hover:border-mat-500 transition-all cursor-pointer group shadow-xl">
                     <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-mat-500 rounded-full flex items-center justify-center text-white font-black shadow-lg">{post.author?.[0] || 'A'}</div>
                        <div>
                           <h4 className="text-white font-black uppercase text-sm">@{post.author || 'HUB_MEMBER'}</h4>
                           <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">{post.timestamp}</span>
                        </div>
                     </div>
                     <div className="text-white text-xl font-light italic leading-relaxed mb-8 group-hover:text-mat-500 transition-colors">
                       {renderContentWithTags(post.content)}
                     </div>
                     {post.imageUrl && (
                        <div className="rounded-[2.5rem] overflow-hidden border border-mat-700 mb-8 aspect-video shadow-2xl">
                           <CachedImage src={post.imageUrl} alt="Contenido comunidad" />
                        </div>
                     )}
                     <div className="flex gap-6 pt-6 border-t border-mat-700/50 text-[10px] font-black text-gray-500">
                        <span className="flex items-center gap-2 hover:text-mat-500 transition-colors"><Heart size={14} className="text-mat-500" /> {post.likes}</span>
                        <span className="flex items-center gap-2 hover:text-white transition-colors"><MessageCircle size={14} /> {post.comments?.length || 0} COMENTARIOS</span>
                     </div>
                  </article>
                ))
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
    </div>
  );
};