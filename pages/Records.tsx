
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Disc, ShoppingBag, Plus, Heart, Handshake, Filter, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useLanguage } from '../context/LanguageContext';
import { VinylRecord } from '../types';
import { CachedImage } from '../components/CachedImage';
import { TagLink } from '../components/TagLink';

export const Records: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [records, setRecords] = useState<VinylRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedYear, setSelectedYear] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const { addToCart, cart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const genreParam = params.get('genre');
    const searchParam = params.get('search');
    const yearParam = params.get('year');
    
    if (genreParam) setSelectedGenre(genreParam);
    if (searchParam) setSearchTerm(searchParam);
    if (yearParam) setSelectedYear(yearParam);
  }, [location.search]);

  const loadData = async () => {
    try {
      const data = await dataService.getRecords();
      setRecords(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('mat32_data_changed', loadData);
    return () => window.removeEventListener('mat32_data_changed', loadData);
  }, []);

  const genres = useMemo(() => {
    const unique = new Set(records.map(r => r.genre));
    return ['All', ...Array.from(unique)];
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchSearch = r.artist.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchGenre = selectedGenre === 'All' || r.genre === selectedGenre;
      const matchYear = !selectedYear || r.year === selectedYear;
      const matchFavorites = !showOnlyFavorites || isFavorite(r.id);
      return matchSearch && matchGenre && matchYear && matchFavorites;
    });
  }, [searchTerm, selectedGenre, selectedYear, showOnlyFavorites, records, isFavorite]);

  return (
    <div className="min-h-screen bg-mat-900">
      <SEO titleKey="nav.records" descriptionKey="seo.home.description" />
      
      <div className="bg-mat-800 py-20 border-b border-mat-700 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center md:text-left flex flex-col md:flex-row items-center gap-10">
          <Disc className="w-20 h-20 text-mat-500 animate-spin-slow" />
          <div>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white font-exo leading-none">THE <span className="text-mat-500">CRATE.</span></h1>
            <p className="text-gray-400 text-lg mt-4 font-light italic">Selección curada. Rarezas analógicas.</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-16 sticky top-24 z-30 bg-mat-900/95 backdrop-blur-xl py-6 border-b border-mat-800">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Buscar por artista, disco..." 
              value={searchTerm}
              className="w-full bg-mat-800 border border-mat-700 p-4 pl-12 text-white outline-none focus:border-mat-500 uppercase text-[10px] font-black rounded-xl"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-4">
             <select 
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="bg-mat-800 border border-mat-700 px-6 py-4 text-white text-[10px] font-black uppercase outline-none focus:border-mat-500 rounded-xl"
              >
                {genres.map(g => <option key={g} value={g}>{g.toUpperCase()}</option>)}
              </select>
              <button 
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`px-6 py-4 border transition-all text-[10px] font-black uppercase rounded-xl ${showOnlyFavorites ? 'bg-mat-500 border-mat-500 text-white' : 'bg-mat-800 border-mat-700 text-gray-500'}`}
              >
                <Heart className={`w-4 h-4 ${showOnlyFavorites ? 'fill-current' : ''}`} />
              </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-40"><Loader2 className="animate-spin text-mat-500 w-12 h-12" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredRecords.map(record => {
              const inCart = cart.find(item => item.id === record.id);
              return (
                <div key={record.id} className="bg-mat-800 border border-mat-700 rounded-[2.5rem] overflow-hidden shadow-2xl group flex flex-col">
                  <div className="relative aspect-square overflow-hidden bg-black">
                    <CachedImage src={record.coverUrl} alt={record.title} className="w-full h-full opacity-80 group-hover:scale-105 transition-transform duration-1000" />
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <button onClick={() => toggleFavorite(record.id)} className={`p-3 rounded-full backdrop-blur-md transition-all ${isFavorite(record.id) ? 'bg-mat-500 text-white' : 'bg-black/50 text-white/50'}`}><Heart size={16} className={isFavorite(record.id) ? 'fill-current' : ''} /></button>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-6">
                       <div>
                          <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-1 font-exo">{record.title}</h3>
                          <p className="text-mat-500 text-[10px] font-black uppercase tracking-widest">{record.artist}</p>
                       </div>
                       <div className="text-2xl font-black text-white font-exo">€{record.price}</div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-8">
                       <TagLink label={record.genre} type="genre" />
                       <TagLink label={record.year} type="year" />
                    </div>

                    <div className="mt-auto">
                       <button 
                        onClick={() => addToCart(record)}
                        className={`w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 ${inCart ? 'bg-white text-mat-900' : 'bg-mat-500 text-white hover:bg-mat-400'}`}
                       >
                         {inCart ? <ShoppingBag size={18} /> : <Plus size={18} />}
                         {inCart ? `EN LA CAJA (${inCart.quantity})` : 'AÑADIR A CAJA'}
                       </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
