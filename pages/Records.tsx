
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

  return (
    <div className="min-h-screen bg-mat-900 pb-24">
      <SEO titleKey="Tienda | The Crate Mat32" descriptionKey="Marketplace de vinilos curados de Jazz y Disco en Ruzafa." />
      
      <div className="bg-mat-950 py-32 md:py-52 border-b border-mat-800 relative overflow-hidden text-center">
        <Disc className="w-24 h-24 text-mat-500 mx-auto mb-10 animate-spin-slow opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <h1 className="text-[15vw] sm:text-[12vw] md:text-[10rem] font-black uppercase tracking-tighter text-white font-exo leading-[0.8] relative z-10">THE <span className="text-mat-500">CRATE.</span></h1>
        <p className="text-gray-500 text-base sm:text-lg md:text-xl mt-8 italic opacity-80 max-w-2xl mx-auto px-6 relative z-10 font-light leading-relaxed">Selección técnica para audiófilos.</p>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-16">
          
          <aside className="lg:w-80 flex-shrink-0 space-y-12">
            <div className="sticky top-32 space-y-12">
              <div>
                <h3 className="text-[10px] font-black text-mat-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-2">
                  <Filter size={14} /> FILTRO_GÉNERO
                </h3>
                <nav className="space-y-2">
                  <button onClick={() => setSelectedCategory('All')} className={`w-full text-left px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === 'All' ? 'bg-mat-500 text-white shadow-lg shadow-mat-500/10' : 'text-gray-500 hover:text-white hover:bg-mat-800'}`}>TODOS LOS DISCOS</button>
                  {taxonomy.categories.map(cat => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)} className={`w-full text-left px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between ${selectedCategory === cat ? 'bg-mat-500 text-white shadow-lg' : 'text-gray-500 hover:text-white hover:bg-mat-800'}`}>
                      <span>{cat}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row gap-6 mb-12 bg-mat-800/40 p-5 rounded-[2.5rem] border border-mat-800 backdrop-blur-xl">
              <div className="relative flex-1">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                <input type="text" placeholder="Buscar artista o álbum..." className="w-full bg-mat-900 border-2 border-mat-800 p-5 pl-16 text-white text-xs font-black uppercase rounded-2xl outline-none focus:border-mat-500 transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-40"><Loader2 className="animate-spin text-mat-500 w-12 h-12" /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {filteredRecords.map(record => (
                  <article key={record.id} onClick={() => navigate(`/records/${record.id}`)} className="bg-mat-800 border border-mat-700 rounded-[2.5rem] overflow-hidden shadow-2xl group flex flex-col hover:border-mat-500 transition-all duration-500 cursor-pointer">
                    <div className="relative aspect-square overflow-hidden bg-black">
                      <CachedImage src={record.coverUrl} alt={record.title} />
                      <div className="absolute top-6 right-6" onClick={e => e.stopPropagation()}>
                        <button onClick={() => toggleWishlist(record.id)} className={`p-4 rounded-full backdrop-blur-xl transition-all ${isInWishlist(record.id) ? 'bg-mat-500 text-white shadow-lg' : 'bg-black/50 text-white/50 hover:text-white'}`}>
                          <Heart size={18} className={isInWishlist(record.id) ? 'fill-current' : ''} />
                        </button>
                      </div>
                      <div className="absolute bottom-6 left-6 bg-mat-950/90 backdrop-blur-md border border-mat-700 px-5 py-2 rounded-xl text-white font-exo font-black text-2xl tracking-tighter shadow-xl">€{record.price}</div>
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-2 font-exo group-hover:text-mat-500 transition-colors">{record.artist}</h3>
                      <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">{record.title}</p>
                      <div className="mt-auto pt-6 border-t border-mat-700/50 flex items-center justify-between">
                         <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{record.genre}</span>
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
