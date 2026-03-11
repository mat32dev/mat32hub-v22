
import React, { useState, useEffect } from 'react';
import { 
  Database, Upload, Disc, Filter, Search, 
  ExternalLink, Handshake, Globe, ShoppingBag, 
  CheckCircle, Lock, Loader2, PlayCircle, Info, ChevronRight, Mail, X, FileText, RefreshCw
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { VinylRecord } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

export const Marketplace: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  const [records, setRecords] = useState<VinylRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  
  const [showHubModal, setShowHubModal] = useState<'import' | 'discogs' | null>(null);
  const [hubProcessing, setHubProcessing] = useState(false);
  const [csvInput, setCsvInput] = useState('Artista, Titulo, Precio, Genero\nDaft Punk, Homework, 30, House\nJoy Division, Unknown Pleasures, 25, Post-Punk');
  const [discogsUser, setDiscogsUser] = useState('');

  const load = async () => {
    setLoading(true);
    const data = await dataService.getRecords();
    setRecords(data);
    setLoading(false);
    setIsAuth(dataService.isAuthenticated());
  };

  useEffect(() => {
    load();
    window.addEventListener('mat32_data_changed', load);
    return () => window.removeEventListener('mat32_data_changed', load);
  }, []);

  const handleBatchImport = async () => {
    setHubProcessing(true);
    const count = await dataService.batchImportRecords(csvInput);
    setHubProcessing(false);
    alert(`HUB_PROTOCOL: ${count} discos importados con éxito.`);
    setShowHubModal(null);
  };

  const handleDiscogsSync = async () => {
    if (!discogsUser) return;
    setHubProcessing(true);
    const count = await dataService.syncDiscogsCollection(discogsUser);
    setHubProcessing(false);
    alert(`HUB_PROTOCOL: Sincronización con @${discogsUser} completada.`);
    setShowHubModal(null);
  };

  const genres = ['All', 'House', 'Techno', 'Jazz', 'Funk', 'Disco', 'Ambient', 'Rarezas'];

  const filtered = records.filter(r => {
    const matchSearch = (r.artist + r.title).toLowerCase().includes(searchTerm.toLowerCase());
    const matchGenre = selectedGenre === 'All' || r.genre === selectedGenre;
    return matchSearch && matchGenre;
  });

  return (
    <div className="min-h-screen bg-mat-900 pb-32">
      <SEO titleKey="The Hub | Base de Datos de Vinilos Valencia" descriptionKey="Marketplace local de vinilos. Compra, vende e intercambia discos en Ruzafa. Sincronizado con Discogs." />

      <div className="bg-mat-800 py-32 md:py-48 border-b border-mat-700 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mat-500/10 border border-mat-500/20 text-mat-500 font-black text-[9px] uppercase tracking-[0.4em] mb-10 animate-fade-in">
              <Database size={14} className="animate-pulse" /> HUB DATA PROTOCOL V1.4
           </div>
           <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter text-white font-exo leading-none mb-6">THE <span className="text-mat-500">HUB.</span></h1>
           <p className="text-gray-400 text-lg md:text-xl italic max-w-2xl mx-auto opacity-80">La red centralizada de coleccionistas en Valencia. Importa, sincroniza y circula vinilos.</p>
           
           <div className="mt-16 flex flex-col md:flex-row justify-center gap-6">
              <button 
                onClick={() => isAuth ? setShowHubModal('import') : navigate('/admin')} 
                className="px-10 py-5 bg-mat-800 border-2 border-mat-700 text-white font-black uppercase text-xs tracking-[0.3em] rounded-2xl hover:border-mat-500 transition-all flex items-center justify-center gap-4 group"
              >
                <FileText size={18} className="text-mat-500 group-hover:scale-110 transition-transform" /> IMPORTAR EXCEL/CSV
              </button>
              <button 
                onClick={() => isAuth ? setShowHubModal('discogs') : navigate('/admin')} 
                className="px-10 py-5 bg-mat-800 border-2 border-mat-700 text-white font-black uppercase text-xs tracking-[0.3em] rounded-2xl hover:border-mat-500 transition-all flex items-center justify-center gap-4 group"
              >
                <Globe size={18} className="text-mat-500 group-hover:rotate-45 transition-transform" /> SYNC DISCOGS API
              </button>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row gap-6 mb-16">
           <div className="relative flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
              <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-mat-800 border-2 border-mat-700 p-5 pl-16 text-white text-xs font-black uppercase rounded-2xl outline-none focus:border-mat-500 transition-all" placeholder="Buscar por Artista, Álbum, Sello..." />
           </div>
           <div className="flex overflow-x-auto gap-3 pb-2 custom-scrollbar">
              {genres.map(g => (
                <button key={g} onClick={() => setSelectedGenre(g)} className={`px-6 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all flex-shrink-0 ${selectedGenre === g ? 'bg-mat-500 border-mat-500 text-white shadow-lg' : 'bg-mat-800 border-mat-700 text-gray-500 hover:text-white'}`}>
                   {g}
                </button>
              ))}
           </div>
        </div>

        {loading ? (
           <div className="flex justify-center py-40"><Loader2 className="animate-spin text-mat-500 w-12 h-12" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map(record => (
              <div 
                key={record.id} 
                onClick={() => navigate(`/records/${record.id}`)}
                className="bg-mat-800 border border-mat-700 rounded-[2.5rem] overflow-hidden group hover:border-mat-500 transition-all shadow-2xl flex flex-col h-full cursor-pointer animate-fade-in"
              >
                 <div className="aspect-square relative bg-black overflow-hidden">
                    <img src={record.coverUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" alt={record.title} />
                    {record.tags?.includes('discogs') && (
                      <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-lg flex items-center gap-2 text-[8px] font-black uppercase text-white">
                        <Globe size={10} className="text-mat-500" /> VERIFICADO DISCOGS
                      </div>
                    )}
                 </div>
                 <div className="p-8 flex flex-col flex-1">
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter font-exo mb-1 group-hover:text-mat-500 transition-colors">{record.title}</h3>
                    <p className="text-mat-500 text-[10px] font-black uppercase tracking-widest mb-6">{record.artist}</p>
                    
                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-mat-700/50">
                       <span className="text-2xl font-black text-white font-exo">€{record.price}</span>
                       <div className="flex gap-2">
                          <button className="p-4 bg-mat-900 border border-mat-700 text-white hover:bg-mat-500 transition-all rounded-xl">
                             <ShoppingBag size={16} />
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* HUB MODAL - IMPORT */}
      {showHubModal === 'import' && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-fade-in">
           <div className="w-full max-w-2xl bg-mat-900 border-2 border-mat-800 rounded-[3.5rem] p-12 relative shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-mat-500"></div>
              <button onClick={() => setShowHubModal(null)} className="absolute top-10 right-10 text-gray-500 hover:text-white"><X size={28} /></button>
              
              <div className="flex items-center gap-4 mb-10">
                 <div className="w-14 h-14 bg-mat-800 rounded-2xl flex items-center justify-center text-mat-500 border border-mat-700 shadow-xl">
                    <FileText size={28} />
                 </div>
                 <div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter font-exo">IMPORT_SPREADSHEET</h2>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">NORMALIZACIÓN DE DATOS ANALÓGICOS</p>
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="p-6 bg-mat-800/50 border border-dashed border-mat-700 rounded-3xl text-center">
                    <p className="text-gray-500 text-xs italic mb-4">Pega los datos separados por comas (Artista, Titulo, Precio, Genero)</p>
                    <textarea 
                      value={csvInput} 
                      onChange={e => setCsvInput(e.target.value)}
                      className="w-full bg-mat-950 border border-mat-800 p-6 h-48 text-white font-mono text-xs rounded-2xl outline-none focus:border-mat-500"
                    />
                 </div>
                 
                 <button 
                  onClick={handleBatchImport}
                  disabled={hubProcessing}
                  className="w-full py-6 bg-mat-500 text-white font-black uppercase text-[11px] tracking-[0.5em] rounded-3xl shadow-xl flex items-center justify-center gap-4 transition-all hover:bg-mat-400 disabled:opacity-50"
                 >
                    {hubProcessing ? <Loader2 className="animate-spin" /> : <RefreshCw />} EJECUTAR PROTOCOLO
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* HUB MODAL - DISCOGS */}
      {showHubModal === 'discogs' && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-fade-in">
           <div className="w-full max-w-lg bg-mat-900 border-2 border-mat-800 rounded-[3.5rem] p-12 relative shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-blue-500"></div>
              <button onClick={() => setShowHubModal(null)} className="absolute top-10 right-10 text-gray-500 hover:text-white"><X size={28} /></button>
              
              <div className="flex items-center gap-4 mb-10">
                 <div className="w-14 h-14 bg-mat-800 rounded-2xl flex items-center justify-center text-blue-500 border border-mat-700 shadow-xl">
                    <Globe size={28} />
                 </div>
                 <div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter font-exo">DISCOGS_SYNC</h2>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">CONEXIÓN CON LA NUBE ANALÓGICA</p>
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-2">Username de Discogs</label>
                    <input 
                      type="text" 
                      value={discogsUser} 
                      onChange={e => setDiscogsUser(e.target.value)}
                      placeholder="P.EJ: MAT32VLC"
                      className="w-full bg-mat-800 border-2 border-mat-700 p-5 text-white font-black uppercase text-xs rounded-2xl outline-none focus:border-blue-500 transition-all"
                    />
                 </div>
                 
                 <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-3xl">
                    <p className="text-[9px] text-blue-400 font-black uppercase leading-relaxed tracking-widest">
                       "Al sincronizar, importaremos tus discos públicos y aplicaremos los metadatos de Mat32 para visibilidad local en Valencia."
                    </p>
                 </div>

                 <button 
                  onClick={handleDiscogsSync}
                  disabled={hubProcessing || !discogsUser}
                  className="w-full py-6 bg-blue-600 text-white font-black uppercase text-[11px] tracking-[0.5em] rounded-3xl shadow-xl flex items-center justify-center gap-4 transition-all hover:bg-blue-500 disabled:opacity-50"
                 >
                    {hubProcessing ? <Loader2 className="animate-spin" /> : <RefreshCw />} INICIAR SYNC_CORE
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
