
import React, { useState, useMemo, useEffect } from 'react';
import { Search, ShoppingBag, Heart, Loader2, X } from 'lucide-react';
import { CachedImage } from '../components/CachedImage';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { VinylRecord } from '../types';

export const Records: React.FC = () => {
  const [records, setRecords] = useState<VinylRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const loadData = async () => {
    setLoading(true);
    const data = await dataService.getRecords();
    setRecords(data || []);
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
      
      <div className="relative py-32 md:py-52 border-b border-mat-800 overflow-hidden text-center">
        <div className="absolute inset-0 z-0">
          <CachedImage
            src="https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/53d83bbb-47b5-45ce-4f69-00fdc063fd00/public"
            alt="The Crate — Archivo de Discos Mat32"
            priority
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-mat-950/60 via-mat-950/40 to-mat-950" />
        </div>
        <h1 className="text-[15vw] sm:text-[12vw] md:text-[10rem] font-black uppercase tracking-tighter text-white font-exo leading-[0.8] relative z-10">THE <span className="text-mat-500">CRATE.</span></h1>
        <p className="text-gray-400 text-base sm:text-lg md:text-xl mt-8 max-w-2xl mx-auto px-6 relative z-10 font-light leading-relaxed">Discos de segunda mano. Precios de mercado.</p>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col gap-8">

          <div>
            <div className="flex flex-col md:flex-row gap-4 mb-6 bg-mat-800/40 p-4 rounded-[2rem] border border-mat-800 backdrop-blur-xl">
              <div className="relative flex-1">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                <input type="text" placeholder="Buscar artista o álbum..." className="w-full bg-mat-900 border-2 border-mat-800 p-5 pl-16 text-white text-xs font-black uppercase rounded-2xl outline-none focus:border-mat-500 transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              {selectedCategory !== 'All' && (
                <button onClick={() => setSelectedCategory('All')} className="flex items-center gap-2 px-6 py-3 bg-mat-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">
                  <X size={14} /> {selectedCategory}
                </button>
              )}
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
                      <div className="absolute bottom-6 left-6 bg-mat-950/90 backdrop-blur-md border border-mat-700 px-5 py-2 rounded-xl text-white font-exo font-black text-2xl tracking-tighter shadow-xl">€{Math.round(record.price)}</div>
                    </div>
                    {record.streamingLink && (
                      <div onClick={e => e.stopPropagation()} className="border-t border-mat-700 bg-mat-950">
                        <iframe
                          style={{ border: 0, width: '100%', height: '120px', display: 'block' }}
                          src={record.streamingLink}
                          seamless
                          title={`${record.artist} - ${record.title}`}
                        />
                      </div>
                    )}
                    <div className="p-8 flex-1 flex flex-col">
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-2 font-exo group-hover:text-mat-500 transition-colors">{record.artist}</h3>
                      <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">{record.title}</p>
                      <div className="mt-auto pt-6 border-t border-mat-700/50 flex items-center justify-between">
                         <button onClick={(e) => { e.stopPropagation(); setSelectedCategory(record.genre); }} className="text-[8px] font-black text-gray-500 hover:text-mat-500 uppercase tracking-widest transition-colors border border-mat-700 hover:border-mat-500 px-3 py-1.5 rounded-xl">
                           {record.genre}
                         </button>
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
