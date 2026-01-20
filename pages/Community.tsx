
import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, Heart, X, Loader2, Camera, Send, 
  AtSign, Share2, Disc, Handshake,
  AlertCircle
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { useLanguage } from '../context/LanguageContext';
import { Post, TradeMetadata } from '../types';
import { CachedImage } from '../components/CachedImage';
import { TagLink } from '../components/TagLink';

export const Community: React.FC = () => {
  const { t } = useLanguage();
  const [user, setUser] = useState<{alias: string, color: string} | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Create Post States
  const [isTradeMode, setIsTradeMode] = useState(false);
  const [aliasInput, setAliasInput] = useState('');
  const [content, setContent] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [tradeDetails, setTradeDetails] = useState<TradeMetadata>({ artist: '', title: '', genre: 'House', condition: 'VG+' });
  
  // Trade Modal States
  const [showTradeModal, setShowTradeModal] = useState<Post | null>(null);
  const [tradeOffer, setTradeOffer] = useState('');
  const [tradeStatus, setTradeStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const [activeCommentBox, setActiveCommentBox] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    try {
      const allPosts = await dataService.getCommunityPosts();
      setPosts(allPosts);
      setUser(dataService.getUserProfile());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('mat32_data_changed', loadData);
    return () => window.removeEventListener('mat32_data_changed', loadData);
  }, []);

  const handleInteraction = (action: () => void) => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      action();
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (aliasInput.trim().length < 3) return;
    dataService.setUserProfile(aliasInput);
    setAliasInput('');
    setShowLoginModal(false);
    loadData();
  };

  const handlePostSubmit = async () => {
    if (!content.trim() && !previewImage && !isTradeMode) return;
    setLoading(true);
    await dataService.createPost({
      author: user!.alias,
      avatar: user!.color,
      content: content,
      imageUrl: previewImage || undefined,
      isTrade: isTradeMode,
      tradeMetadata: isTradeMode ? tradeDetails : undefined
    });
    setContent('');
    setPreviewImage(null);
    setIsTradeMode(false);
    setTradeDetails({ artist: '', title: '', genre: 'House', condition: 'VG+' });
    if (fileInputRef.current) fileInputRef.current.value = "";
    setLoading(false);
  };

  const handleCommentSubmit = async (postId: string) => {
    if (!commentText.trim()) return;
    await dataService.addComment(postId, {
      author: user!.alias,
      content: commentText
    });
    setCommentText('');
    setActiveCommentBox(null);
    loadData();
  };

  const handleSendTradeProposal = async () => {
    if (!tradeOffer.trim() || !showTradeModal) return;
    setTradeStatus('sending');
    await dataService.createInboxMessage({
      type: 'trade_proposal',
      sender: user!.alias,
      email: `${user!.alias}@community.mat32.com`,
      content: `Propuesta de intercambio para ${showTradeModal.tradeMetadata?.artist} - ${showTradeModal.tradeMetadata?.title}. Oferta: ${tradeOffer}`,
      metadata: { postId: showTradeModal.id, offer: tradeOffer }
    });
    setTradeStatus('sent');
    setTimeout(() => {
      setShowTradeModal(null);
      setTradeOffer('');
      setTradeStatus('idle');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-mat-900 pb-20">
      <SEO titleKey="nav.community" descriptionKey="seo.community.description" />

      {/* Hero Section Updated with New Copy */}
      <div className="bg-mat-800 py-24 md:py-40 border-b border-mat-700 relative overflow-hidden text-center">
        <div className="container mx-auto px-6 relative z-10">
           <div className="inline-flex items-center gap-3 px-5 py-2 bg-mat-900 border border-mat-500 text-mat-500 text-[9px] font-black uppercase tracking-[0.4em] rounded-full mb-8 animate-fade-in">
             <Disc className="w-4 h-4" /> LOCAL MARKETPLACE
           </div>
           <h1 className="text-5xl md:text-[9rem] font-black uppercase tracking-tighter text-white leading-none font-exo text-glow animate-fade-in">
            COLLECTORS<br/><span className="text-mat-500">HUB.</span>
           </h1>
           <p className="text-gray-400 text-xl md:text-2xl mt-8 font-light italic max-w-3xl mx-auto animate-fade-in opacity-80 leading-relaxed">
             El muro para compartir tus tesoros, proponer cambios y descubrir las jornadas market de Mat32
           </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        
        {/* Post Creation Box */}
        <div className="bg-mat-800 border-2 border-mat-700 p-6 md:p-10 rounded-[2.5rem] shadow-2xl mb-16 relative group transition-all hover:border-mat-500/30">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
          
          {/* Trade Toggle */}
          <div className="flex justify-end mb-6">
             <button 
                onClick={() => handleInteraction(() => setIsTradeMode(!isTradeMode))}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${isTradeMode ? 'bg-mat-500 text-white border-mat-500 shadow-lg' : 'bg-mat-900 border-mat-700 text-gray-500 hover:text-white'}`}
             >
                <Handshake size={14} /> {isTradeMode ? 'LISTING FOR TRADE' : 'POST FOR TRADE'}
             </button>
          </div>

          <div className="flex gap-4 md:gap-6 items-start">
             <div className="w-12 h-12 rounded-full bg-mat-900 border border-mat-700 flex items-center justify-center text-mat-500 flex-shrink-0 shadow-lg">
                {user ? user.alias[0].toUpperCase() : <Disc className="w-6 h-6 animate-spin-slow opacity-30" />}
             </div>
             <div className="flex-1 space-y-4">
                {isTradeMode && (
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in bg-mat-900/40 p-6 rounded-3xl border border-mat-700/50 mb-4">
                      <div className="space-y-1">
                         <label className="text-[8px] font-black text-mat-500 uppercase tracking-widest">Artista</label>
                         <input value={tradeDetails.artist} onChange={e => setTradeDetails({...tradeDetails, artist: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-3 text-white text-xs font-black uppercase rounded-xl focus:border-mat-500 outline-none" placeholder="ARTISTA" />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[8px] font-black text-mat-500 uppercase tracking-widest">Título</label>
                         <input value={tradeDetails.title} onChange={e => setTradeDetails({...tradeDetails, title: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-3 text-white text-xs font-black uppercase rounded-xl focus:border-mat-500 outline-none" placeholder="TÍTULO" />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[8px] font-black text-mat-500 uppercase tracking-widest">Género</label>
                         <input value={tradeDetails.genre} onChange={e => setTradeDetails({...tradeDetails, genre: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-3 text-white text-xs font-black uppercase rounded-xl focus:border-mat-500 outline-none" placeholder="HOUSE, DISCO..." />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[8px] font-black text-mat-500 uppercase tracking-widest">Estado</label>
                         <select value={tradeDetails.condition} onChange={e => setTradeDetails({...tradeDetails, condition: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-3 text-white text-xs font-black uppercase rounded-xl focus:border-mat-500 outline-none appearance-none">
                            <option>Mint</option><option>NM</option><option>VG+</option><option>VG</option>
                         </select>
                      </div>
                   </div>
                )}

                <textarea 
                  value={content}
                  onClick={() => !user && setShowLoginModal(true)}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={isTradeMode ? "¿Qué buscas a cambio? Describe tu oferta..." : "¿Qué está sonando en tu plato? @artista, #estilo..."}
                  className="w-full bg-transparent text-white text-lg md:text-xl font-light italic outline-none resize-none min-h-[100px] placeholder:text-gray-700"
                />
                
                {previewImage && (
                  <div className="relative rounded-3xl overflow-hidden border-2 border-mat-500 group animate-in zoom-in duration-300">
                    <img src={previewImage} className="w-full max-h-80 object-cover" />
                    <button onClick={() => setPreviewImage(null)} className="absolute top-4 right-4 p-3 bg-red-600 text-white rounded-full shadow-2xl hover:bg-red-500 transition-all z-10">
                      <X size={16} />
                    </button>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-mat-700/50">
                   <button onClick={() => handleInteraction(() => fileInputRef.current?.click())} className="text-gray-500 hover:text-mat-500 transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                      <Camera size={18} /> {isTradeMode ? 'Subir Foto del Disco' : 'Subir Multimedia'}
                   </button>
                   <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const r = new FileReader();
                        r.onload = () => setPreviewImage(r.result as string);
                        r.readAsDataURL(file);
                      }
                   }} />
                   <button 
                    onClick={() => handleInteraction(handlePostSubmit)}
                    className="px-10 py-4 bg-mat-500 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-mat-400 shadow-xl transition-all disabled:opacity-20 flex items-center gap-3"
                    disabled={(!content.trim() && !previewImage && !isTradeMode) || (isTradeMode && (!tradeDetails.artist || !tradeDetails.title))}
                   >
                     {isTradeMode && <Handshake size={14} />} {isTradeMode ? 'Listar Cambalache' : 'Publicar en Hub'}
                   </button>
                </div>
             </div>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-12">
          {loading ? (
            <div className="flex flex-col items-center py-20"><Loader2 className="animate-spin text-mat-500 w-10 h-10 mb-4" /><p className="text-[10px] font-black uppercase text-gray-700">Sincronizando Marketplace...</p></div>
          ) : posts.map(post => (
            <article key={post.id} className="bg-mat-800 border-2 border-mat-700 rounded-[3rem] overflow-hidden shadow-xl hover:border-mat-500/30 transition-all group">
               <div className="p-8 md:p-12">
                  <div className="flex justify-between items-center mb-8">
                     <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-sm shadow-xl border border-white/10" style={{backgroundColor: post.avatar || '#ea580c'}}>{post.author[0].toUpperCase()}</div>
                        <div>
                           <h4 className="text-white font-black uppercase text-sm md:text-base tracking-tighter">@{post.author}</h4>
                           <span className="text-[9px] text-gray-600 font-bold uppercase">{post.timestamp}</span>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        {post.isTrade && (
                           <span className="px-4 py-1.5 bg-mat-500 text-white text-[8px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg border border-white/20 flex items-center gap-2">
                              <Handshake size={10} /> OPEN TO TRADES
                           </span>
                        )}
                        <button className="text-gray-700 hover:text-mat-500 transition-colors"><Share2 size={16} /></button>
                     </div>
                  </div>

                  {/* Trade Details Display */}
                  {post.isTrade && post.tradeMetadata && (
                     <div className="mb-8 p-8 bg-mat-900 border-2 border-mat-500/30 rounded-3xl relative overflow-hidden group/trade shadow-2xl">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/trade:opacity-30 transition-opacity">
                           <Disc size={120} className="animate-spin-slow" />
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                           <div>
                              <p className="text-[9px] font-black text-mat-500 uppercase tracking-widest mb-1">PROYECTO CAMBALACHE</p>
                              <h3 className="text-3xl font-black text-white uppercase tracking-tighter font-exo leading-none mb-2">{post.tradeMetadata.title}</h3>
                              <p className="text-xl font-black text-gray-400 uppercase tracking-widest">{post.tradeMetadata.artist}</p>
                           </div>
                           <div className="flex flex-wrap gap-3">
                              <span className="px-3 py-1 bg-mat-800 border border-mat-700 text-gray-500 text-[8px] font-black uppercase tracking-widest rounded">{post.tradeMetadata.genre}</span>
                              <span className="px-3 py-1 bg-mat-800 border border-mat-700 text-mat-500 text-[8px] font-black uppercase tracking-widest rounded">{post.tradeMetadata.condition}</span>
                           </div>
                        </div>
                     </div>
                  )}

                  <p className="text-gray-200 text-2xl font-light italic leading-relaxed mb-8">
                    {post.content}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-10">
                     {post.tags?.map(tag => (
                        <TagLink key={tag} label={tag} type="tag" />
                     ))}
                     <TagLink label="VLC" type="country" />
                  </div>

                  {post.imageUrl && (
                    <div className="rounded-[2.5rem] overflow-hidden border-2 border-mat-700 mb-10 bg-black shadow-2xl">
                       <CachedImage src={post.imageUrl} alt="Hub Context" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-center gap-6 pt-8 border-t border-mat-700/50">
                     <div className="flex items-center gap-8 flex-1">
                        <button onClick={() => handleInteraction(() => {})} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-mat-500 hover:text-white transition-colors">
                           <Heart className="w-4 h-4" /> {post.likes} LIKES
                        </button>
                        <button 
                         onClick={() => setActiveCommentBox(activeCommentBox === post.id ? null : post.id)}
                         className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                        >
                           <MessageCircle className="w-4 h-4" /> {post.comments?.length || 0} COMENTARIOS
                        </button>
                     </div>
                     {post.isTrade && (
                        <button 
                           onClick={() => handleInteraction(() => setShowTradeModal(post))}
                           className="w-full sm:w-auto px-8 py-4 bg-mat-500 hover:bg-mat-400 text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition-all shadow-xl flex items-center justify-center gap-3 group/btn"
                        >
                           <Handshake className="group-hover/btn:rotate-12 transition-transform" /> {t('records.btn.trade')}
                        </button>
                     )}
                  </div>
               </div>

               {/* Comments Section */}
               <div className="bg-mat-900/40 p-8 md:p-12 border-t border-mat-700/50 space-y-8">
                  {post.comments?.map((comment: any) => (
                    <div key={comment.id} className="flex gap-5 animate-fade-in">
                       <div className="w-10 h-10 rounded-full bg-mat-800 border border-mat-700 flex items-center justify-center text-[10px] text-gray-500 font-black flex-shrink-0 shadow-lg">{comment.author[0]}</div>
                       <div className="flex-1">
                          <span className="block text-[9px] font-black text-mat-500 uppercase tracking-[0.2em] mb-2">@{comment.author}</span>
                          <p className="text-gray-400 text-base font-light italic leading-relaxed">"{comment.content}"</p>
                       </div>
                    </div>
                  ))}

                  {/* Input de Comentario */}
                  <div className="mt-8 flex gap-4">
                     <input 
                       value={activeCommentBox === post.id ? commentText : ''}
                       onClick={() => !user && setShowLoginModal(true)}
                       onChange={(e) => {
                         setActiveCommentBox(post.id);
                         setCommentText(e.target.value);
                       }}
                       placeholder="Añadir comentario al hilo..."
                       className="flex-1 bg-mat-800 border-2 border-mat-700 p-4 px-6 rounded-2xl text-white text-sm outline-none focus:border-mat-500 transition-all italic shadow-inner"
                     />
                     <button 
                       onClick={() => handleInteraction(() => handleCommentSubmit(post.id))}
                       className="p-4 bg-mat-500 text-white rounded-2xl shadow-xl hover:bg-mat-400 transition-all flex items-center justify-center disabled:opacity-20"
                       disabled={!commentText.trim()}
                     >
                        <Send size={18} />
                     </button>
                  </div>
               </div>
            </article>
          ))}
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-fade-in">
           <div className="w-full max-sm bg-mat-800 border-2 border-mat-700 p-12 rounded-[3.5rem] text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
              <button onClick={() => setShowLoginModal(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"><X size={24} /></button>
              <div className="w-20 h-20 bg-mat-900 border-2 border-mat-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(234,88,12,0.3)]"><AtSign className="w-10 h-10 text-mat-500" /></div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter font-exo mb-4 leading-none">Únete al Hub.</h2>
              <p className="text-gray-500 text-sm italic mb-10 leading-relaxed px-4">Para interactuar con la comunidad, solo necesitamos tu alias de coleccionista.</p>
              <form onSubmit={handleRegister} className="space-y-6">
                 <input 
                   required 
                   autoFocus 
                   value={aliasInput} 
                   onChange={(e) => setAliasInput(e.target.value)} 
                   className="w-full bg-mat-900 border-2 border-mat-700 p-5 text-white uppercase text-center text-sm font-black rounded-2xl outline-none focus:border-mat-500 shadow-inner" 
                   placeholder="TU ALIAS" 
                 />
                 <button type="submit" className="w-full py-5 bg-mat-500 text-white font-black uppercase text-xs tracking-[0.3em] rounded-2xl hover:bg-mat-400 transition-all shadow-2xl">ACCEDER AL MURO</button>
              </form>
           </div>
        </div>
      )}

      {/* Trade Proposal Modal */}
      {showTradeModal && (
         <div className="fixed inset-0 z-[160] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-fade-in">
            <div className="w-full max-w-xl bg-mat-900 border-2 border-mat-500 rounded-[3.5rem] p-12 relative shadow-2xl overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-mat-500"></div>
               <button onClick={() => setShowTradeModal(null)} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-all"><X size={32} /></button>
               
               {tradeStatus === 'sent' ? (
                  <div className="py-20 text-center animate-zoom-in">
                     <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-8 shadow-xl" />
                     <h2 className="text-4xl font-black text-white uppercase tracking-tighter font-exo mb-4">Señal Enviada</h2>
                     <p className="text-gray-500 italic max-w-xs mx-auto">Tu propuesta ha sido grabada en el CRM. El coleccionista contactará contigo.</p>
                  </div>
               ) : (
                  <>
                     <div className="mb-12">
                        <div className="flex items-center gap-4 text-mat-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4">
                           <Handshake size={20} /> INICIAR PROTOCOLO DE CAMBIO
                        </div>
                        <h2 className="text-4xl font-black text-white uppercase tracking-tighter font-exo leading-tight">
                           Proponer a <span className="text-mat-500">@{showTradeModal.author}</span>
                        </h2>
                        <p className="text-gray-500 italic mt-4 text-sm leading-relaxed">
                           Estás interesado en: <strong>{showTradeModal.tradeMetadata?.artist} - {showTradeModal.tradeMetadata?.title}</strong>
                        </p>
                     </div>

                     <div className="space-y-8">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Tu Oferta de Intercambio</label>
                           <textarea 
                              value={tradeOffer}
                              onChange={e => setTradeOffer(e.target.value)}
                              className="w-full bg-mat-800 border-2 border-mat-700 p-6 h-40 text-white text-sm font-bold rounded-3xl outline-none focus:border-mat-500 transition-all resize-none italic shadow-inner"
                              placeholder="Describe qué discos ofreces o tu propuesta económica..."
                           />
                        </div>

                        <div className="flex items-center gap-3 p-5 bg-mat-800/50 rounded-2xl border border-mat-700">
                           <AlertCircle className="text-mat-500 flex-shrink-0" size={18} />
                           <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest leading-relaxed">Al proponer un cambio, tu alias será compartido con el coleccionista para facilitar la comunicación directa.</p>
                        </div>

                        <button 
                           onClick={handleSendTradeProposal}
                           disabled={!tradeOffer.trim() || tradeStatus === 'sending'}
                           className="w-full py-6 bg-mat-500 hover:bg-mat-400 text-white font-black uppercase tracking-[0.4em] rounded-[2rem] shadow-2xl flex items-center justify-center gap-4 transition-all disabled:opacity-20 group"
                        >
                           {tradeStatus === 'sending' ? <Loader2 className="animate-spin" /> : <Send className="group-hover:translate-x-2 transition-transform" />} ENVIAR PROPUESTA
                        </button>
                     </div>
                  </>
               )}
            </div>
         </div>
      )}
    </div>
  );
};

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);
