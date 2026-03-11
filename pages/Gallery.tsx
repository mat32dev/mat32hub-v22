
import React, { useState, useEffect, useMemo } from 'react';
import { Camera, Filter, X, ChevronRight, Maximize2, Tag, Disc } from 'lucide-react';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { GalleryItem } from '../types';
import { CachedImage } from '../components/CachedImage';

export const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [taxonomy, setTaxonomy] = useState<{categories: string[], tags: string[]}>({categories: [], tags: []});
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const load = async () => {
      const [imgData, taxData] = await Promise.all([
        dataService.getLocalGallery(),
        dataService.getGalleryTaxonomy()
      ]);
      setImages(imgData);
      setTaxonomy(taxData);
      setLoading(false);
    };
    load();
  }, []);

  const filteredImages = useMemo(() => {
    if (selectedCategory === 'All') return images;
    return images.filter(img => img.category === selectedCategory);
  }, [selectedCategory, images]);

  return (
    <div className="min-h-screen bg-mat-900 pb-24">
      <SEO titleKey="Galería | El Santuario Hi-Fi" descriptionKey="Explora visualmente Mat32, el mejor local para eventos en Valencia y bar Hi-Fi." />

      <div className="bg-mat-950 py-32 md:py-52 border-b border-mat-800 relative overflow-hidden text-center">
        <Disc className="w-24 h-24 text-mat-500 mx-auto mb-10 animate-spin-slow opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter text-white font-exo leading-[0.8] relative z-10">THE <span className="text-mat-500">SIGNAL.</span></h1>
        <p className="text-gray-500 text-xl mt-8 italic opacity-80 max-w-2xl mx-auto px-6 relative z-10 font-light leading-relaxed">Estética analógica y diseño Hi-Fi en el corazón de Valencia.</p>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-16">
          
          <aside className="lg:w-80 flex-shrink-0">
            <div className="sticky top-32 space-y-12">
              <div>
                <h3 className="text-[10px] font-black text-mat-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-2">
                  <Filter size={14} /> FILTRAR_VISTA
                </h3>
                <nav className="space-y-2">
                  <button 
                    onClick={() => setSelectedCategory('All')}
                    className={`w-full text-left px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between group ${selectedCategory === 'All' ? 'bg-mat-500 text-white shadow-lg' : 'text-gray-500 hover:bg-mat-800 hover:text-white'}`}
                  >
                    <span>TODO EL LOCAL</span>
                  </button>
                  {taxonomy.categories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between group ${selectedCategory === cat ? 'bg-mat-500 text-white shadow-lg' : 'text-gray-500 hover:bg-mat-800 hover:text-white'}`}
                    >
                      <span>{cat}</span>
                      <ChevronRight size={14} className={selectedCategory === cat ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} />
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-10 bg-mat-800 rounded-[3rem] border border-mat-700 shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-full h-1 bg-mat-500"></div>
                 <Camera className="text-mat-500 mb-6" size={24} />
                 <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-2">RESERVA EL ESPACIO</h4>
                 <p className="text-gray-500 text-[10px] leading-relaxed italic mb-8">¿Planeas un rodaje o un evento? Mat32 es el set perfecto.</p>
                 <a href="/alquiler-local-eventos-valencia" className="inline-flex items-center gap-2 text-mat-500 font-black text-[9px] uppercase tracking-widest hover:gap-4 transition-all">SABER MÁS <ChevronRight size={12} /></a>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="columns-1 md:columns-2 xl:columns-3 gap-8 space-y-8">
              {filteredImages.map(img => (
                <div 
                  key={img.id} 
                  className="relative group rounded-[3rem] overflow-hidden bg-mat-800 border-2 border-mat-800 cursor-zoom-in break-inside-avoid shadow-2xl transition-all hover:border-mat-500"
                  onClick={() => setLightbox(img)}
                >
                  <CachedImage 
                    src={img.imageUrl} 
                    alt={img.title} 
                    aspectRatio="aspect-auto" 
                    className="w-full grayscale group-hover:grayscale-0 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-mat-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10">
                     <h4 className="text-white font-black uppercase text-2xl tracking-tighter font-exo leading-none mb-3">{img.title}</h4>
                     <div className="flex flex-wrap gap-2">
                        {img.tags.map(t => (
                          <span key={t} className="text-[8px] font-black text-mat-500 uppercase tracking-widest bg-mat-900 px-2 py-1 rounded border border-mat-700">{t}</span>
                        ))}
                     </div>
                  </div>
                  <div className="absolute top-8 right-8 p-4 bg-black/50 backdrop-blur-xl rounded-full text-white opacity-0 group-hover:opacity-100 transition-all scale-50 group-hover:scale-100">
                    <Maximize2 size={18} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-6 animate-fade-in" onClick={() => setLightbox(null)}>
           <button className="absolute top-10 right-10 text-white hover:text-mat-500 transition-colors"><X size={40} /></button>
           <div className="max-w-6xl w-full h-full flex flex-col items-center justify-center gap-10" onClick={e => e.stopPropagation()}>
              <img src={lightbox.imageUrl} className="max-h-[75vh] object-contain rounded-[2rem] shadow-[0_0_100px_rgba(234,88,12,0.15)] border border-mat-800" alt={lightbox.title} />
              <div className="text-center space-y-4">
                 <h3 className="text-5xl font-black text-white uppercase tracking-tighter font-exo">{lightbox.title}</h3>
                 <p className="text-gray-400 italic text-lg font-light">"{lightbox.description}"</p>
                 <div className="flex justify-center items-center gap-6 pt-6">
                    <span className="px-6 py-2 bg-mat-800 text-mat-500 text-[10px] font-black uppercase rounded-full border border-mat-700 tracking-widest">{lightbox.category}</span>
                    <div className="flex items-center gap-2 text-gray-600 text-[10px] font-black uppercase tracking-widest">
                       <Tag size={14} className="text-mat-700" /> {lightbox.tags.join(' ')}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
