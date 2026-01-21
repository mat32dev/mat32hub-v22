
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Disc, ShoppingBag, Heart, Loader2, Tag, Filter, X, ChevronRight, Wind, Droplets, Settings, Award, ShieldCheck, PlayCircle, Star } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { VinylRecord } from '../types';
import { CachedImage } from '../components/CachedImage';
import { TagLink } from '../components/TagLink';

export const Records: React.FC = () => {
  const [records, setRecords] = useState<VinylRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [taxonomy, setTaxonomy] = useState<{categories: string[], tags: string[]}>({categories: [], tags: []});
  
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist, wishlistCount } = useWishlist();

  const loadData = async () => {
    setLoading(true);
    const [data, tax] = await Promise.all([
      dataService.getRecords(),
      dataService.getTaxonomyTree()
    ]);
    setRecords(data || []);
    setTaxonomy(tax);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('mat32_data_changed', loadData);
    return () => window.removeEventListener('mat32_data_changed', loadData);
  }, []);

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchSearch = (r.title + r.artist).toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCategory === 'All' || r.genre === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [searchTerm, selectedCategory, records]);

  const doctorTips = [
    { title: "Control de Humedad", icon: <Wind className="text-mat-500" />, desc: "Mantén tus vinilos rectos en Valencia." },
    { title: "Limpieza Profunda", icon: <Droplets className="text-mat-500" />, desc: "Protocolo 3 pasos contra el crackle." },
    { title: "Calibración", icon: <Settings className="text-mat-500" />, desc: "Ajuste fino de cápsula y tracking." }
  ];

  return (
    <div className="min-h-screen bg-mat-900 pb-24">
      <SEO titleKey="Tienda & Cuidado | The Crate Mat32" descriptionKey="Marketplace de vinilos curados y el rincón del Doctor Vinilo para el mantenimiento Hi-Fi en Ruzafa." />
      
      <div className="bg-mat-950 py-32 md:py-52 border-b border-mat-800 relative overflow-hidden text-center">
        <Disc className="w-24 h-24 text-mat-500 mx-auto mb-10 animate-spin-slow opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter text-white font-exo leading-[0.8] relative z-10">THE <span className="text-mat-500">CRATE.</span></h1>
        <p className="text-gray-500 text-xl mt-8 italic opacity-80 max-w-2xl mx-auto px-6 relative z-10 font-light leading-relaxed">Selección curada para audiófilos y mantenimiento profesional.</p>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-16">
          
          <aside className="lg:w-80 flex-shrink-0 space-y-12">
            <div className="sticky top-32 space-y-12">
              {/* WISHLIST COUNTER */}
              {wishlistCount > 0 && (
                <Link to="/wishlist" className="bg-mat-500 p-6 rounded-[2rem] flex items-center justify-between text-white shadow-xl hover:-translate-y-1 transition-all group shadow-mat-500/20">
                   <div className="flex items-center gap-3">
                      <Star size={20} className="fill-current animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Mi Wishlist</span>
                   </div>
                   <span className="bg-white text-mat-500 font-black px-3 py-1 rounded-full text-xs">{wishlistCount}</span>
                </Link>
              )}

              <div>
                <h3 className="text-[10px] font-black text-mat-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-2">
                  <Filter size={14} /> CATEGORÍAS
                </h3>
                <nav className="space-y-2">
                  <button onClick={() => setSelectedCategory('All')} className={`w-full text-left px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === 'All' ? 'bg-mat-500 text-white shadow-lg shadow-mat-500/10' : 'text-gray-500 hover:text-white hover:bg-mat-800'}`}>TODOS LOS DISCOS</button>
                  {taxonomy.categories.map(cat => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)} className={`w-full text-left px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between ${selectedCategory === cat ? 'bg-mat-500 text-white shadow-lg' : 'text-gray-500 hover:text-white hover:bg-mat-800'}`}>
                      <span>{cat}</span>
                      <ChevronRight size={14} className={selectedCategory === cat ? 'opacity-100' : 'opacity-0'} />
                    </button>
                  ))}
                </nav>
              </div>

              <div className="bg-mat-800/50 p-10 rounded-[3rem] border border-mat-700 shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-full h-1 bg-mat-500"></div>
                 <div className="flex items-center gap-3 mb-6">
                    <Award className="text-mat-500" size={24} />
                    <h4 className="text-lg font-black text-white uppercase tracking-tighter font-exo">DR_VINILO</h4>
                 </div>
                 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed italic mb-8">Protocolos de mantenimiento Hi-Fi para tu colección.</p>
                 <div className="space-y-6">
                    {doctorTips.map((tip, i) => (
                       <div key={i} className="flex gap-4 items-start group/tip cursor-help">
                          <div className="p-2 bg-mat-900 rounded-lg border border-mat-700 group-hover/tip:border-mat-500 transition-colors">{tip.icon}</div>
                          <div>
                             <span className="block text-[10px] font-black text-white uppercase tracking-tight">{tip.title}</span>
                             <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest leading-none">{tip.desc}</span>
                          </div>
                       </div>
                    ))}
                 </div>
                 <button className="w-full mt-10 py-4 bg-mat-900 border border-mat-700 text-[9px] font-black text-mat-500 uppercase tracking-widest rounded-xl hover:bg-mat-500 hover:text-white hover:border-mat-500 transition-all">VER TUTORIALES +</button>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row gap-6 mb-12 bg-mat-800/40 p-5 rounded-[2.5rem] border border-mat-800 backdrop-blur-xl">
              <div className="relative flex-1">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                <input type="text" placeholder="Buscar en la caja..." className="w-full bg-mat-900 border-2 border-mat-800 p-5 pl-16 text-white text-xs font-black uppercase rounded-2xl outline-none focus:border-mat-500 transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className="flex items-center gap-4 px-6 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                 <ShieldCheck size={16} /> CALIDAD VERIFICADA_HUB
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-40"><Loader2 className="animate-spin text-mat-500 w-12 h-12" /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {filteredRecords.map(record => (
                  <article key={record.id} onClick={() => navigate(`/records/${record.id}`)} className="bg-mat-800 border border-mat-700 rounded-[2.5rem] overflow-hidden shadow-2xl group flex flex-col hover:border-mat-500 transition-all duration-500 cursor-pointer">
                    <div className="relative aspect-square overflow-hidden bg-black">
                      <CachedImage src={record.coverUrl} alt={record.title} className="w-full opacity-80 group-hover:scale-110 transition-all duration-1000 grayscale group-hover:grayscale-0" />
                      <div className="absolute top-6 right-6" onClick={e => e.stopPropagation()}>
                        <button onClick={() => toggleWishlist(record.id)} className={`p-4 rounded-full backdrop-blur-xl transition-all ${isInWishlist(record.id) ? 'bg-mat-500 text-white shadow-lg' : 'bg-black/50 text-white/50 hover:text-white'}`}>
                          <Heart size={18} className={isInWishlist(record.id) ? 'fill-current' : ''} />
                        </button>
                      </div>
                      <div className="absolute bottom-6 left-6 bg-mat-950/90 backdrop-blur-md border border-mat-700 px-5 py-2 rounded-xl text-white font-exo font-black text-2xl tracking-tighter shadow-xl">€{record.price}</div>
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="mb-4">
                        <TagLink label={record.genre} type="genre" className="!bg-mat-900/50 !border-mat-800" />
                      </div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-2 font-exo group-hover:text-mat-500 transition-colors">{record.title}</h3>
                      <p className="text-mat-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">{record.artist}</p>
                      <div className="mt-auto pt-6 border-t border-mat-700/50 flex items-center justify-between">
                         <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">STOCK: {record.stock}</span>
                         <button onClick={(e) => { e.stopPropagation(); addToCart(record as any); }} className="p-4 bg-mat-500 text-white rounded-2xl hover:bg-mat-400 transition-all shadow-xl shadow-mat-500/10">
                           <ShoppingBag size={20} />
                         </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
