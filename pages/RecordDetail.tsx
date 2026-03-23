
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Disc, ShoppingBag, ArrowLeft, Heart, MessageSquare, Handshake, ShieldCheck, X, Send, Loader2, CheckCircle, Globe, Repeat, ExternalLink, Calendar, Tag, Info, PlayCircle, Volume2 } from 'lucide-react';
import { dataService } from '../services/dataService';
import { SEO } from '../components/SEO';
import { VinylRecord } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { CachedImage } from '../components/CachedImage';
import { TagLink } from '../components/TagLink';

export const RecordDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const [record, setRecord] = useState<VinylRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNegotiationModal, setShowNegotiationModal] = useState(false);
  const [negotiationType, setNegotiationType] = useState<'offer' | 'contact'>('offer');
  const [messageSent, setMessageSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [form, setForm] = useState({
    name: localStorage.getItem('mat32_user_name') || '',
    email: '',
    offerPrice: '',
    message: ''
  });

  useEffect(() => {
    const load = async () => {
      if (id) {
        const data = await dataService.getRecordById(id);
        if (data) {
          setRecord(data);
          setForm(prev => ({ ...prev, offerPrice: data.price.toString() }));
        }
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const handleNegotiationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!record) return;
    setIsSubmitting(true);
    
    await dataService.createInboxMessage({
      type: 'negotiation',
      sender: form.name,
      email: form.email,
      content: `[NEGOCIACIÓN P2P] ${negotiationType === 'offer' ? 'OFERTA' : 'CONTACTO'} para "${record.title}". Propuesta: €${form.offerPrice}. Mensaje: ${form.message}`,
      metadata: { ...form, recordId: record.id, sellerId: record.sellerId }
    });

    setIsSubmitting(false);
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setShowNegotiationModal(false);
    }, 3000);
  };

  if (loading) return <div className="min-h-screen bg-mat-900 flex items-center justify-center"><Loader2 className="animate-spin text-mat-500 w-12 h-12" /></div>;
  if (!record) return <div className="min-h-screen bg-mat-900 text-center py-40 text-white">Disco no encontrado. <Link to="/records" className="text-mat-500">Volver</Link></div>;

  return (
    <div className="min-h-screen bg-mat-900 pb-24 font-sans text-mat-cream">
      <SEO 
        titleKey={`${record.artist} - ${record.title} | The Hub Mat32`} 
        descriptionKey={`Escucha la preview y negocia el vinilo ${record.title} de ${record.artist}. Marketplace de coleccionistas en Valencia.`} 
        image={record.coverUrl}
        schemaType="Product"
      />

      <div className="container mx-auto px-6 py-12 md:py-24">
        <Link to="/records" className="inline-flex items-center gap-2 text-mat-500 font-black uppercase text-[10px] tracking-widest mb-12 hover:text-white transition-colors">
          <ArrowLeft size={16} /> VOLVER AL MARKETPLACE
        </Link>

        <div className="grid lg:grid-cols-12 gap-16 md:gap-24 items-start">
           <div className="lg:col-span-6 space-y-12">
              <div className="relative group">
                <div className="aspect-square bg-black border-2 border-mat-800 rounded-[4rem] overflow-hidden shadow-2xl">
                   <CachedImage src={record.coverUrl} alt={record.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                </div>
                <div className="absolute top-8 right-8 flex flex-col gap-4">
                   <button 
                    onClick={() => toggleWishlist(record.id)} 
                    className={`p-5 rounded-full backdrop-blur-xl shadow-2xl transition-all ${isInWishlist(record.id) ? 'bg-mat-500 text-white' : 'bg-mat-900/60 text-gray-400 hover:text-white'}`}
                    title={isInWishlist(record.id) ? "Quitar de Wishlist" : "Añadir a Wishlist"}
                   >
                      <Heart className={isInWishlist(record.id) ? 'fill-current' : ''} />
                   </button>
                </div>
              </div>

              {/* STREAMING PREVIEW SECTION (NEW) */}
              {record.streamingLink && (
                <section className="bg-mat-800/60 p-10 rounded-[3rem] border-2 border-mat-700 shadow-2xl animate-fade-in">
                   <div className="flex items-center gap-4 mb-8">
                      <div className="p-3 bg-mat-500/10 text-mat-500 rounded-xl border border-mat-500/20">
                         <Volume2 size={24} className="animate-breathing" />
                      </div>
                      <div>
                         <h3 className="text-xl font-black uppercase tracking-tighter font-exo text-white leading-none">PREVIEW_SIGNAL</h3>
                         <span className="text-[8px] font-black text-mat-500 uppercase tracking-widest">AUDIO_STREAM_ACTIVE</span>
                      </div>
                   </div>
                   
                   <div className="w-full rounded-2xl overflow-hidden border border-mat-700 shadow-inner bg-mat-950">
                      <iframe 
                        style={{ border: 0, width: '100%', height: '120px' }} 
                        src={record.streamingLink} 
                        seamless
                        title={`${record.artist} - ${record.title} Preview`}
                      >
                         <a href={record.streamingLink}>Listen to {record.title} by {record.artist}</a>
                      </iframe>
                   </div>
                   <p className="mt-6 text-[9px] text-gray-500 font-bold uppercase tracking-widest italic text-center">
                     Muestra de audio digital. El sonido final dependerá de tu aguja y previo Hi-Fi.
                   </p>
                </section>
              )}
           </div>

           <div className="lg:col-span-6 space-y-12 animate-fade-in">
              <div>
                 <div className="flex flex-wrap items-center gap-3 mb-6">
                    <TagLink label={record.genre} type="genre" className="bg-mat-800 border border-mat-700 text-mat-500" />
                    <span className="px-4 py-1.5 bg-mat-800 border border-mat-700 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded">{record.condition}</span>
                    <span className="px-4 py-1.5 bg-mat-900 border border-mat-700 text-mat-500 text-[10px] font-black uppercase tracking-widest rounded flex items-center gap-2">
                       <Repeat size={12} /> INTERCAMBIO OK
                    </span>
                 </div>
                 <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] font-exo mb-4">{record.title}</h1>
                 <h2 className="text-2xl md:text-3xl font-black text-mat-500 uppercase tracking-[0.2em] font-exo opacity-80">{record.artist}</h2>
              </div>

              <div className="bg-mat-800/40 p-8 md:p-12 rounded-[3rem] border border-mat-700 space-y-8 shadow-2xl">
                 <div className="flex items-center justify-between border-b border-mat-700 pb-6">
                    <h3 className="text-[10px] font-black text-mat-500 uppercase tracking-[0.5em] flex items-center gap-2">
                       <ShieldCheck size={14} /> TECHNICAL_PASSPORT
                    </h3>
                    <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">VERIFICADO_POR_EL_HUB</span>
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="space-y-1">
                       <span className="block text-[8px] text-gray-600 font-black uppercase tracking-widest">Sello</span>
                       <span className="text-white font-black uppercase text-xs tracking-tight">{record.label}</span>
                    </div>
                    <div className="space-y-1">
                       <span className="block text-[8px] text-gray-600 font-black uppercase tracking-widest">Año</span>
                       <span className="text-white font-black uppercase text-xs tracking-tight">{record.year}</span>
                    </div>
                    <div className="space-y-1">
                       <span className="block text-[8px] text-gray-600 font-black uppercase tracking-widest">Formato</span>
                       <span className="text-white font-black uppercase text-xs tracking-tight">{record.format}</span>
                    </div>
                    <div className="space-y-1">
                       <span className="block text-[8px] text-gray-600 font-black uppercase tracking-widest">Estado</span>
                       <span className="text-mat-500 font-black uppercase text-xs tracking-tight">{record.condition}</span>
                    </div>
                 </div>
                 <div className="pt-6 border-t border-mat-700 flex flex-col md:flex-row gap-6 items-center justify-between">
                    <div className="flex items-center gap-2 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                       <Info size={14} className="text-mat-500" /> CALIDAD GARANTIZADA
                    </div>
                    {record.discogsLink && record.discogsLink !== '#' && (
                       <a href={record.discogsLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-mat-950 border border-mat-700 rounded-xl text-[9px] font-black text-white hover:border-mat-500 hover:text-mat-500 transition-all shadow-xl">
                          VER EN DISCOGS <ExternalLink size={12} />
                       </a>
                    )}
                 </div>
              </div>

              <div className="space-y-6">
                 <p className="text-gray-400 text-xl font-light italic leading-relaxed">"{record.description}"</p>
                 <div className="flex items-center gap-8 py-8 border-y border-mat-800">
                    <div className="text-7xl font-black text-white font-exo leading-none">€{record.price}</div>
                    <div className="space-y-1">
                       <p className="text-gray-800 text-[8px] font-black uppercase tracking-widest">SKU: {record.sku}</p>
                    </div>
                 </div>
              </div>

              <div className="flex flex-col gap-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button 
                      onClick={() => addToCart(record)}
                      className="py-8 bg-mat-500 hover:bg-mat-400 text-white font-black uppercase text-[11px] tracking-[0.4em] rounded-[2rem] shadow-xl flex items-center justify-center gap-4 transition-all clip-path-slant shadow-mat-500/20"
                    >
                       <ShoppingBag size={20} /> AÑADIR A LA CAJA
                    </button>
                    <button 
                      onClick={() => { setNegotiationType('offer'); setShowNegotiationModal(true); }}
                      className="py-8 bg-mat-800 hover:bg-mat-700 border-2 border-mat-700 text-white font-black uppercase text-[11px] tracking-[0.4em] rounded-[2rem] shadow-xl flex items-center justify-center gap-4 transition-all clip-path-slant"
                    >
                       <Handshake size={20} /> PROPONER CAMBIO
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {showNegotiationModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-fade-in">
           <div className="w-full max-w-lg bg-mat-900 border-2 border-mat-800 rounded-[3.5rem] p-12 relative shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
              <button onClick={() => setShowNegotiationModal(false)} className="absolute top-10 right-10 text-gray-500 hover:text-white"><X size={28} /></button>
              
              {messageSent ? (
                <div className="text-center py-10 animate-fade-in">
                   <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-6 animate-bounce" />
                   <h2 className="text-3xl font-black text-white uppercase tracking-tighter font-exo mb-4">SEÑAL ENVIADA</h2>
                   <p className="text-gray-500 italic">"Tu propuesta ha sido inyectada en el Hub. El dueño de @{record.sellerId} recibirá tu contacto."</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-10">
                    <div className="p-4 bg-mat-800 rounded-2xl text-mat-500 border border-mat-700">
                      {negotiationType === 'offer' ? <Handshake size={24} /> : <MessageSquare size={24} />}
                    </div>
                    <div>
                       <h2 className="text-3xl font-black text-white uppercase tracking-tighter font-exo">
                         {negotiationType === 'offer' ? 'PROPOSICIÓN_NEGOCIO' : 'CONEXIÓN_DIRECTA'}
                       </h2>
                       <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Canal P2P Comunidad Mat32</p>
                    </div>
                  </div>

                  <form onSubmit={handleNegotiationSubmit} className="space-y-6">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-1">Tu Alias</label>
                           <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-4 text-white text-xs font-black rounded-xl outline-none focus:border-mat-500 transition-all" placeholder="DIGGER_NAME" />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-1">Propuesta (€)</label>
                           <input required type="number" value={form.offerPrice} onChange={e => setForm({...form, offerPrice: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-4 text-white text-xs font-black rounded-xl outline-none focus:border-mat-500 transition-all" />
                        </div>
                     </div>
                     <div className="space-y-1">
                        <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-1">Email de Respuesta</label>
                        <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-4 text-white text-xs font-black rounded-xl outline-none focus:border-mat-500 transition-all" placeholder="NAME@HUB.COM" />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-1">Propuesta de Intercambio / Mensaje</label>
                        <textarea required value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-4 h-32 text-white text-xs italic font-light rounded-xl resize-none outline-none focus:border-mat-500 transition-all" placeholder="P.ej: 'Te ofrezco este disco + €10' o '¿En qué estado real está el insert?'" />
                     </div>

                     <button type="submit" disabled={isSubmitting} className="w-full py-6 bg-mat-500 text-white font-black uppercase text-[11px] tracking-[0.4em] rounded-2xl flex items-center justify-center gap-4 hover:bg-mat-400 transition-all shadow-xl disabled:opacity-50">
                        {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={18} />} ABRIR NEGOCIACIÓN
                     </button>
                  </form>
                </>
              )}
           </div>
        </div>
      )}
    </div>
  );
};
