
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { useWishlist } from '../context/WishlistContext';
import { dataService } from '../services/dataService';
import { VinylRecord } from '../types';
import { ArrowLeft, Disc, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { CachedImage } from '../components/CachedImage';
import { useCart } from '../context/CartContext';

export const Wishlist: React.FC = () => {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [savedRecords, setSavedRecords] = useState<VinylRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlistItems = async () => {
      const allRecords = await dataService.getRecords();
      const filtered = allRecords.filter(r => wishlist.includes(r.id));
      setSavedRecords(filtered);
      setLoading(false);
    };
    loadWishlistItems();
  }, [wishlist]);

  return (
    <div className="min-h-screen bg-mat-900 pb-32">
      <SEO titleKey="Mi Wishlist | Mat32 Digger Hub" descriptionKey="Tu selección personal de vinilos y rarezas guardadas en Mat32 Valencia." />

      <div className="bg-mat-950 py-24 md:py-40 border-b border-mat-800 relative overflow-hidden text-center">
        <Disc className="w-24 h-24 text-mat-500 mx-auto mb-10 animate-spin-slow opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter text-white font-exo leading-none relative z-10">THE <span className="text-mat-500">WISHLIST.</span></h1>
        <p className="text-gray-500 text-lg mt-6 italic opacity-80 max-w-2xl mx-auto px-6 relative z-10">Tus hallazgos guardados en el Hub central.</p>
      </div>

      <div className="container mx-auto px-6 py-20 max-w-6xl">
        <Link to="/records" className="inline-flex items-center gap-2 text-mat-500 font-black uppercase text-[10px] tracking-widest mb-12 hover:text-white transition-colors">
          <ArrowLeft size={16} /> VOLVER A EXPLORAR
        </Link>

        {savedRecords.length === 0 ? (
          <div className="text-center py-40 bg-mat-800/30 rounded-[4rem] border-4 border-dashed border-mat-800">
             <Heart className="w-20 h-20 text-mat-800 mx-auto mb-8 opacity-40" />
             <p className="text-gray-600 font-black uppercase text-xs tracking-widest">No hay señales guardadas aún...</p>
             <Link to="/records" className="mt-8 inline-block px-10 py-4 bg-mat-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl">Ir a la Caja</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {savedRecords.map(record => (
              <article key={record.id} className="bg-mat-800 border border-mat-700 rounded-[2.5rem] overflow-hidden group flex flex-col hover:border-mat-500 transition-all duration-500 shadow-2xl">
                 <div className="relative aspect-square overflow-hidden bg-black cursor-pointer" onClick={() => navigate(`/records/${record.id}`)}>
                    <CachedImage src={record.coverUrl} alt={record.title} className="w-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(record.id); }} 
                      className="absolute top-6 right-6 p-4 bg-mat-900/80 backdrop-blur-xl text-mat-500 rounded-full shadow-xl hover:bg-red-600 hover:text-white transition-all"
                    >
                       <Trash2 size={16} />
                    </button>
                 </div>
                 <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-none mb-2 font-exo">{record.title}</h3>
                    <p className="text-mat-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8">{record.artist}</p>
                    <div className="mt-auto flex items-center justify-between">
                       <span className="text-3xl font-black text-white font-exo">€{record.price}</span>
                       <button onClick={() => addToCart(record)} className="p-4 bg-mat-500 text-white rounded-2xl hover:bg-mat-400 transition-all shadow-xl">
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
  );
};
