
import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, Heart, X, Loader2, Camera, Send, 
  AtSign, Share2, Disc, Handshake, AlertCircle, TrendingUp
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
  
  const [isTradeMode, setIsTradeMode] = useState(false);
  const [aliasInput, setAliasInput] = useState('');
  const [content, setContent] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [tradeDetails, setTradeDetails] = useState<TradeMetadata>({ artist: '', title: '', genre: 'House', condition: 'VG+' });
  
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

  const handlePostSubmit = async () => {
    if (!content.trim() && !previewImage && !isTradeMode) return;
    setLoading(true);
    // Fix: Extract hashtags from content and ensure 'tags' property is present to match Post interface
    const extractedTags = content.match(/#[\wñáéíóú]+/g) || [];
    
    await dataService.createPost({
      author: user!.alias,
      avatar: user!.color,
      content: content,
      imageUrl: previewImage || undefined,
      isTrade: isTradeMode,
      tradeMetadata: isTradeMode ? tradeDetails : undefined,
      tags: extractedTags as string[]
    });
    setContent('');
    setPreviewImage(null);
    setIsTradeMode(false);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-mat-900 pb-20">
      <SEO titleKey="nav.community" descriptionKey="seo.community.description" />

      {/* Hero Header */}
      <div className="bg-mat-800 py-24 md:py-32 border-b border-mat-700 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center">
           <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter text-white font-exo leading-none">
            THE <span className="text-mat-500">HUB.</span>
           </h1>
           <p className="text-gray-400 text-lg md:text-xl mt-6 italic opacity-80 max-w-2xl mx-auto">
             "El tablón de anuncios para coleccionistas. Comparte hallazgos, propón intercambios y haz crecer la escena en Valencia."
           </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        
        {/* Post Creation */}
        <div className="bg-mat-800 border-2 border-mat-700 p-8 rounded-[2.5rem] shadow-2xl mb-16 relative">
          <div className="flex justify-between items-center mb-8">
             <div className="flex items-center gap-3">
                <TrendingUp size={16} className="text-mat-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-mat-500">Nueva Publicación</span>
             </div>
             <button 
                onClick={() => handleInteraction(() => setIsTradeMode(!isTradeMode))}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${isTradeMode ? 'bg-mat-500 text-white shadow-lg' : 'bg-mat-900 border border-mat-700 text-gray-500'}`}
             >
                <Handshake size={14} /> {isTradeMode ? 'INTERCAMBIO ACTIVO' : 'PUBLICAR INTERCAMBIO'}
             </button>
          </div>

          <div className="flex gap-6 items-start">
             <div className="w-12 h-12 rounded-full bg-mat-900 border border-mat-700 flex items-center justify-center text-mat-500 flex-shrink-0">
                {user ? user.alias[0].toUpperCase() : <Disc className="animate-spin-slow opacity-20" />}
             </div>
             <div className="flex-1 space-y-6">
                {isTradeMode && (
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in bg-mat-950 p-6 rounded-3xl border border-mat-700/50">
                      <input value={tradeDetails.artist} onChange={e => setTradeDetails({...tradeDetails, artist: e.target.value})} className="bg-mat-800 border border-mat-700 p-3 text-white text-[10px] font-black uppercase rounded-xl" placeholder="ARTISTA" />
                      <input value={tradeDetails.title} onChange={e => setTradeDetails({...tradeDetails, title: e.target.value})} className="bg-mat-800 border border-mat-700 p-3 text-white text-[10px] font-black uppercase rounded-xl" placeholder="TÍTULO" />
                   </div>
                )}

                <textarea 
                  value={content}
                  onClick={() => !user && setShowLoginModal(true)}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={isTradeMode ? "¿Qué buscas a cambio?" : "¿Qué disco está sonando en tu plato hoy?"}
                  className="w-full bg-transparent text-white text-xl font-light italic outline-none resize-none min-h-[100px] placeholder:text-gray-700"
                />
                
                <div className="flex justify-between items-center pt-6 border-t border-mat-700">
                   <button onClick={() => handleInteraction(() => fileInputRef.current?.click())} className="text-gray-500 hover:text-mat-500 transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                      <Camera size={18} /> SUBIR IMAGEN
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
                    className="px-10 py-4 bg-mat-500 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-mat-400 shadow-xl"
                    disabled={!content.trim() && !previewImage && !isTradeMode}
                   >
                     PUBLICAR
                   </button>
                </div>
             </div>
          </div>
        </div>

        {/* Feed */}
        <div className="space-y-12">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-mat-500 w-10 h-10" /></div>
          ) : posts.map(post => (
            <article key={post.id} className="bg-mat-800 border-2 border-mat-700 rounded-[3rem] overflow-hidden shadow-xl hover:border-mat-500/30 transition-all">
               <div className="p-10">
                  <div className="flex justify-between items-center mb-8">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-sm shadow-xl" style={{backgroundColor: post.avatar || '#ea580c'}}>{post.author[0].toUpperCase()}</div>
                        <div>
                           <h4 className="text-white font-black uppercase text-sm tracking-tighter">@{post.author}</h4>
                           <span className="text-[9px] text-gray-600 font-bold uppercase">{post.timestamp}</span>
                        </div>
                     </div>
                     {post.isTrade && (
                        <span className="px-4 py-1.5 bg-mat-500/10 text-mat-500 text-[8px] font-black uppercase tracking-widest rounded-full border border-mat-500/30">INTERCAMBIO ACTIVO</span>
                     )}
                  </div>

                  <p className="text-gray-200 text-2xl font-light italic leading-relaxed mb-8">
                    {post.content}
                  </p>

                  {post.imageUrl && (
                    <div className="rounded-[2.5rem] overflow-hidden border-2 border-mat-700 mb-8 bg-black">
                       <img src={post.imageUrl} alt="Community context" className="w-full h-full object-cover opacity-80" />
                    </div>
                  )}

                  <div className="flex items-center gap-8 pt-8 border-t border-mat-700">
                     <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-mat-500 transition-colors">
                        <Heart className="w-4 h-4" /> {post.likes} LIKES
                     </button>
                     <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
                        <MessageCircle className="w-4 h-4" /> {post.comments?.length || 0} COMENTARIOS
                     </button>
                     <button className="ml-auto text-gray-700 hover:text-mat-500 transition-colors"><Share2 size={16} /></button>
                  </div>
               </div>
            </article>
          ))}
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-fade-in">
           <div className="w-full max-w-sm bg-mat-800 border-2 border-mat-700 p-12 rounded-[3.5rem] text-center shadow-2xl relative">
              <button onClick={() => setShowLoginModal(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"><X size={24} /></button>
              <Disc className="w-16 h-16 text-mat-500 mx-auto mb-8 animate-spin-slow" />
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter font-exo mb-4">Únete al Hub.</h2>
              <p className="text-gray-500 text-sm italic mb-10">Solo necesitamos tu alias de coleccionista para empezar.</p>
              <form onSubmit={(e) => {
                 e.preventDefault();
                 if (aliasInput.trim().length < 3) return;
                 dataService.setUserProfile(aliasInput);
                 setShowLoginModal(false);
                 loadData();
              }} className="space-y-6">
                 <input 
                   required 
                   autoFocus 
                   value={aliasInput} 
                   onChange={(e) => setAliasInput(e.target.value)} 
                   className="w-full bg-mat-900 border-2 border-mat-700 p-5 text-white uppercase text-center text-sm font-black rounded-2xl outline-none focus:border-mat-500" 
                   placeholder="TU ALIAS" 
                 />
                 <button type="submit" className="w-full py-5 bg-mat-500 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-mat-400 shadow-2xl">ACCEDER AL HUB</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};
