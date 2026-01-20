
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Disc, ShoppingBag, ArrowLeft, Heart, Share2, Info, Star, Music, Loader2 } from 'lucide-react';
import { dataService } from '../services/dataService';
import { SEO } from '../components/SEO';
import { VinylRecord } from '../types';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { CachedImage } from '../components/CachedImage';
import { TagLink } from '../components/TagLink';

export const RecordDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [record, setRecord] = useState<VinylRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (id) {
        const data = await dataService.getRecordById(id);
        if (data) setRecord(data);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-mat-900 flex items-center justify-center"><Loader2 className="animate-spin text-mat-500 w-12 h-12" /></div>;
  if (!record) return <div className="min-h-screen bg-mat-900 text-center py-40 text-white">Disco no encontrado. <Link to="/records" className="text-mat-500">Volver</Link></div>;

  return (
    <div className="min-h-screen bg-mat-900 pb-24 font-sans">
      <SEO 
        titleKey={`${record.artist} - ${record.title}`} 
        descriptionKey={record.description} 
        image={record.coverUrl}
        schemaType="Product"
      />

      <div className="container mx-auto px-6 py-12 md:py-24">
        <Link to="/records" className="inline-flex items-center gap-2 text-mat-500 font-black uppercase text-[10px] tracking-widest mb-12 hover:text-white transition-colors">
          <ArrowLeft size={16} /> VOLVER A LA CAJA
        </Link>

        <div className="grid lg:grid-cols-12 gap-16 md:gap-24 items-start">
           <div className="lg:col-span-6 relative group">
              <div className="aspect-square bg-black border-2 border-mat-800 rounded-[3rem] overflow-hidden shadow-2xl">
                 <CachedImage src={record.coverUrl} alt={record.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
              </div>
              <div className="absolute top-8 right-8 flex flex-col gap-4">
                 <button onClick={() => toggleFavorite(record.id)} className={`p-5 rounded-full backdrop-blur-xl shadow-2xl transition-all ${isFavorite(record.id) ? 'bg-mat-500 text-white' : 'bg-mat-900/60 text-gray-400'}`}>
                    <Heart className={isFavorite(record.id) ? 'fill-current' : ''} />
                 </button>
              </div>
           </div>

           <div className="lg:col-span-6 space-y-12 animate-fade-in">
              <div>
                 <div className="flex items-center gap-3 mb-6">
                    <TagLink label={record.genre} type="genre" className="bg-mat-800 border border-mat-700 text-mat-500" />
                    <span className="px-4 py-1.5 bg-mat-800 border border-mat-700 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded">{record.condition}</span>
                 </div>
                 <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none font-exo mb-4">{record.title}</h1>
                 <h2 className="text-2xl md:text-3xl font-black text-mat-500 uppercase tracking-widest font-exo opacity-80">{record.artist}</h2>
              </div>

              <div className="space-y-6">
                 <p className="text-gray-400 text-xl font-light italic leading-relaxed">"{record.description}"</p>
                 <div className="flex items-center gap-4 py-6 border-y border-mat-800">
                    <div className="text-6xl font-black text-white font-exo">€{record.price}</div>
                    <div className="text-gray-600 text-[10px] font-black uppercase leading-tight">IVA INCLUIDO<br/>Garantía Mat32</div>
                 </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                 <button 
                  onClick={() => addToCart(record)}
                  className="flex-1 py-7 bg-mat-500 hover:bg-mat-400 text-white font-black uppercase tracking-[0.3em] rounded-3xl shadow-xl flex items-center justify-center gap-4 transition-all"
                 >
                    <ShoppingBag /> AÑADIR A LA CAJA
                 </button>
                 <a 
                  href={record.discogsLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-10 py-7 bg-mat-800 hover:bg-mat-700 text-gray-400 hover:text-white rounded-3xl transition-all flex items-center justify-center"
                 >
                    <Disc />
                 </a>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-8">
                 <div><span className="block text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">LABEL</span><span className="text-white font-black uppercase text-sm tracking-tight">{record.label}</span></div>
                 <div><span className="block text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">YEAR</span><span className="text-white font-black uppercase text-sm tracking-tight">{record.year}</span></div>
                 <div><span className="block text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">FORMAT</span><span className="text-white font-black uppercase text-sm tracking-tight">{record.format}</span></div>
                 <div><span className="block text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">STATUS</span><span className="text-green-500 font-black uppercase text-sm tracking-tight">EN STOCK</span></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
