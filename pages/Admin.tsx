
import React, { useState, useEffect } from 'react';
import { 
  Settings, Disc, Database, RefreshCw, FileText, Search, 
  Plus, LogOut, CheckCircle, AlertCircle, Loader2, Table,
  Calendar, ShoppingBag, Mail, Users, Trash2, Edit3, Eye
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { Event, VinylRecord, Sale, InboxMessage } from '../types';

type AdminTab = 'dashboard' | 'agenda' | 'crate' | 'sales' | 'inbox' | 'matrix';

export const Admin: React.FC = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [events, setEvents] = useState<Event[]>([]);
  const [records, setRecords] = useState<VinylRecord[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [inbox, setInbox] = useState<InboxMessage[]>([]);
  
  // UI States
  const [importText, setImportText] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const auth = dataService.isAuthenticated();
      setIsAuth(auth);
      if (auth) loadCRMData();
      else setLoading(false);
    };
    checkAuth();
    window.addEventListener('mat32_data_changed', loadCRMData);
    return () => window.removeEventListener('mat32_data_changed', loadCRMData);
  }, []);

  const loadCRMData = async () => {
    setLoading(true);
    const [ev, rec, sal, msg] = await Promise.all([
      dataService.getEvents(),
      dataService.getRecords(),
      dataService.getSales(),
      dataService.getInbox()
    ]);
    setEvents(ev);
    setRecords(rec);
    setSales(sal);
    setInbox(msg);
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const pass = (e.target as any).password.value;
    if (await dataService.login('admin@mat32.com', pass)) {
      setIsAuth(true);
      loadCRMData();
    } else {
      setStatus("ERROR: PROTOCOLO DE ACCESO DENEGADO");
    }
  };

  const handleMatrixImport = async () => {
    setIsProcessing(true);
    try {
      const count = await dataService.processMatrixImport(importText);
      setStatus(`MATRIX_SYNC_COMPLETE: ${count} registros procesados.`);
      setTimeout(() => setStatus(null), 5000);
    } catch (e) {
      setStatus("ERROR_HUB_PROTOCOL: Formato de datos inválido.");
    }
    setIsProcessing(false);
  };

  const updateSaleStatus = async (id: string, newStatus: Sale['status']) => {
    await dataService.updateSaleStatus(id, newStatus);
    setStatus("ESTADO_PEDIDO_ACTUALIZADO");
  };

  const archiveMessage = async (id: string) => {
    await dataService.updateMessageStatus(id, 'archived');
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-mat-950 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-mat-900 border-2 border-mat-800 p-12 rounded-[3.5rem] text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
          <Disc className="text-mat-500 w-16 h-16 mx-auto mb-8 animate-spin-slow opacity-20" />
          <h1 className="text-white text-2xl font-black uppercase tracking-[0.2em] mb-10 font-exo">MATRIX_CORE</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-2">Protocolo de Acceso</label>
              <input name="password" type="password" required className="w-full bg-mat-800 border-2 border-mat-700 p-5 text-white text-center text-xs font-black rounded-2xl outline-none focus:border-mat-500 transition-all" placeholder="DIGITAR_CLAVE_MAESTRA" />
            </div>
            <button className="w-full py-5 bg-mat-500 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-mat-400 transition-all shadow-xl shadow-mat-500/20">DESBLOQUEAR HUB</button>
          </form>
          {status && <p className="mt-8 text-[10px] text-red-500 font-black uppercase tracking-widest animate-pulse">{status}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mat-950 text-white pt-24 pb-32">
      <header className="bg-mat-900 border-b border-mat-800 h-20 px-8 flex items-center justify-between fixed top-0 left-0 right-0 z-[100]">
        <div className="flex items-center gap-6">
          <Settings className="text-mat-500 animate-spin-slow" size={24} />
          <h2 className="text-xl font-black uppercase tracking-tighter font-exo">MAT32 <span className="text-mat-500">COMMAND_CENTER</span></h2>
          <div className="hidden md:flex bg-mat-800 p-1 rounded-xl border border-mat-700">
             {(['dashboard', 'agenda', 'crate', 'sales', 'inbox', 'matrix'] as AdminTab[]).map(tab => (
               <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-mat-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
               >
                 {tab}
               </button>
             ))}
          </div>
        </div>
        <button onClick={() => { dataService.logout(); setIsAuth(false); }} className="p-3 bg-mat-800 text-gray-500 hover:text-red-500 rounded-xl border border-mat-700 transition-all"><LogOut size={20} /></button>
      </header>

      <main className="container mx-auto px-6 max-w-7xl pt-10">
        {loading ? (
          <div className="flex justify-center py-40"><Loader2 className="animate-spin text-mat-500 w-12 h-12" /></div>
        ) : (
          <div className="space-y-12 animate-fade-in">
            
            {/* TAB: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="grid gap-12">
                 <div className="grid md:grid-cols-4 gap-6">
                    <div className="bg-mat-900 border border-mat-800 p-8 rounded-[2.5rem] shadow-xl">
                       <h4 className="text-[10px] font-black text-mat-500 uppercase tracking-widest mb-4">INGRESOS_TOTALES</h4>
                       <p className="text-5xl font-black font-exo">€{sales.reduce((acc, s) => acc + s.total, 0).toFixed(0)}</p>
                    </div>
                    <div className="bg-mat-900 border border-mat-800 p-8 rounded-[2.5rem] shadow-xl">
                       <h4 className="text-[10px] font-black text-mat-500 uppercase tracking-widest mb-4">PEDIDOS_PENDIENTES</h4>
                       <p className="text-5xl font-black font-exo">{sales.filter(s => s.status === 'pending').length}</p>
                    </div>
                    <div className="bg-mat-900 border border-mat-800 p-8 rounded-[2.5rem] shadow-xl">
                       <h4 className="text-[10px] font-black text-mat-500 uppercase tracking-widest mb-4">MENSAJES_NUEVOS</h4>
                       <p className="text-5xl font-black font-exo">{inbox.filter(m => m.status === 'pending').length}</p>
                    </div>
                    <div className="bg-mat-900 border border-mat-800 p-8 rounded-[2.5rem] shadow-xl">
                       <h4 className="text-[10px] font-black text-mat-500 uppercase tracking-widest mb-4">CRM_HEALTH</h4>
                       <p className="text-5xl font-black font-exo text-emerald-500">100%</p>
                    </div>
                 </div>

                 <div className="grid lg:grid-cols-2 gap-12">
                    <div className="bg-mat-900 border border-mat-800 p-10 rounded-[3rem]">
                       <h3 className="text-xl font-black uppercase font-exo mb-8 flex items-center gap-3"><Mail className="text-mat-500" /> ÚLTIMOS LEADS</h3>
                       <div className="space-y-4">
                          {inbox.slice(0, 5).map(msg => (
                            <div key={msg.id} className="flex items-center justify-between p-4 bg-mat-800 border border-mat-700 rounded-2xl group hover:border-mat-500 transition-all">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-mat-900 rounded-xl flex items-center justify-center text-mat-500 font-black">{msg.sender[0]}</div>
                                  <div>
                                     <p className="text-xs font-black uppercase">{msg.sender}</p>
                                     <p className="text-[9px] text-gray-500 uppercase tracking-widest">{msg.type} • {new Date(msg.date).toLocaleDateString()}</p>
                                  </div>
                               </div>
                               <button onClick={() => archiveMessage(msg.id)} className="p-2 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-500 transition-all"><Trash2 size={14} /></button>
                            </div>
                          ))}
                       </div>
                    </div>
                    <div className="bg-mat-900 border border-mat-800 p-10 rounded-[3rem]">
                       <h3 className="text-xl font-black uppercase font-exo mb-8 flex items-center gap-3"><ShoppingBag className="text-mat-500" /> VENTAS RECIENTES</h3>
                       <div className="space-y-4">
                          {sales.slice(0, 5).map(sale => (
                            <div key={sale.id} className="flex items-center justify-between p-4 bg-mat-800 border border-mat-700 rounded-2xl">
                               <div>
                                  <p className="text-xs font-black text-white">PEDIDO #{sale.id.slice(-5).toUpperCase()}</p>
                                  <p className="text-[9px] text-gray-500 uppercase">{sale.deliveryMethod} • €{sale.total.toFixed(2)}</p>
                               </div>
                               <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${sale.status === 'pending' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'}`}>
                                  {sale.status}
                               </span>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {/* TAB: AGENDA */}
            {activeTab === 'agenda' && (
              <div className="bg-mat-900 border border-mat-800 p-10 rounded-[3rem]">
                 <div className="flex justify-between items-center mb-10">
                    <h3 className="text-2xl font-black uppercase font-exo flex items-center gap-4"><Calendar className="text-mat-500" /> GESTIÓN DE AGENDA</h3>
                    <button className="px-6 py-3 bg-mat-500 text-white text-[10px] font-black uppercase rounded-xl flex items-center gap-2 hover:bg-mat-400 transition-all"><Plus size={16} /> NUEVA SESIÓN</button>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="border-b border-mat-800">
                          <tr className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                             <th className="pb-6">EVENTO</th>
                             <th className="pb-6">FECHA</th>
                             <th className="pb-6">AFORO</th>
                             <th className="pb-6">ESTADO</th>
                             <th className="pb-6 text-right">ACCIONES</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-mat-800">
                          {events.map(ev => (
                            <tr key={ev.id} className="group">
                               <td className="py-6">
                                  <div className="flex items-center gap-4">
                                     <img src={ev.imageUrl} className="w-10 h-10 rounded-lg object-cover grayscale" />
                                     <span className="text-sm font-black uppercase group-hover:text-mat-500 transition-colors">{ev.title}</span>
                                  </div>
                               </td>
                               <td className="py-6 text-xs text-gray-400">{ev.date} @ {ev.time}</td>
                               <td className="py-6 text-xs text-gray-400">{ev.attendees}/{ev.capacity}</td>
                               <td className="py-6">
                                  <span className="px-2 py-1 bg-mat-800 border border-mat-700 text-[8px] font-black rounded-lg">{ev.status}</span>
                               </td>
                               <td className="py-6 text-right">
                                  <div className="flex justify-end gap-2">
                                     <button className="p-2 text-gray-600 hover:text-white transition-colors"><Edit3 size={16} /></button>
                                     <button className="p-2 text-gray-600 hover:text-white transition-colors"><Eye size={16} /></button>
                                     <button className="p-2 text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                  </div>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
            )}

            {/* TAB: SALES */}
            {activeTab === 'sales' && (
              <div className="bg-mat-900 border border-mat-800 p-10 rounded-[3rem]">
                 <h3 className="text-2xl font-black uppercase font-exo mb-10 flex items-center gap-4"><ShoppingBag className="text-mat-500" /> LIBRO DE VENTAS</h3>
                 <div className="space-y-4">
                    {sales.map(sale => (
                       <div key={sale.id} className="p-8 bg-mat-800 border border-mat-700 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-mat-500 transition-all">
                          <div className="space-y-1">
                             <div className="flex items-center gap-3">
                                <span className="text-xs font-black uppercase">PEDIDO #{sale.id.slice(-6).toUpperCase()}</span>
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${sale.deliveryMethod === 'pickup' ? 'border-emerald-500/50 text-emerald-500' : 'border-blue-500/50 text-blue-500'}`}>{sale.deliveryMethod}</span>
                             </div>
                             <p className="text-[10px] text-gray-500 uppercase">{new Date(sale.timestamp).toLocaleString()}</p>
                          </div>
                          
                          <div className="flex-1 px-10">
                             <div className="flex flex-wrap gap-2">
                                {sale.items.map((item, i) => (
                                  <span key={i} className="text-[8px] bg-mat-950 px-2 py-1 rounded-lg text-gray-400">{item.quantity}x {item.title}</span>
                                ))}
                             </div>
                          </div>

                          <div className="flex items-center gap-8">
                             <span className="text-xl font-black font-exo">€{sale.total.toFixed(2)}</span>
                             <select 
                                value={sale.status} 
                                onChange={(e) => updateSaleStatus(sale.id, e.target.value as any)}
                                className="bg-mat-900 border border-mat-700 p-2 text-[10px] font-black uppercase rounded-lg outline-none focus:border-mat-500"
                             >
                                <option value="pending">PENDIENTE</option>
                                <option value="completed">COMPLETADO</option>
                                <option value="cancelled">CANCELADO</option>
                             </select>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
            )}

            {/* TAB: MATRIX (IMPORT) */}
            {activeTab === 'matrix' && (
              <div className="bg-mat-900 border border-mat-800 p-10 rounded-[3rem] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
                <h3 className="text-2xl font-black uppercase font-exo mb-10 flex items-center gap-4"><Table className="text-mat-500" /> MATRIX_HUB IMPORT</h3>
                <textarea 
                  value={importText} 
                  onChange={e => setImportText(e.target.value)}
                  className="w-full h-64 bg-mat-950 border border-mat-800 p-6 text-mat-500 font-mono text-xs rounded-2xl outline-none focus:border-mat-500 mb-8"
                  placeholder="ID | TYPE | TITLE | CONTENT | URL..."
                />
                <button 
                  onClick={handleMatrixImport}
                  disabled={isProcessing}
                  className="w-full py-6 bg-mat-500 text-white font-black uppercase text-[11px] tracking-[0.5em] rounded-2xl shadow-xl flex items-center justify-center gap-4"
                >
                  {isProcessing ? <Loader2 className="animate-spin" /> : <RefreshCw />} EJECUTAR SINCRONIZACIÓN_MASIVA
                </button>
              </div>
            )}

          </div>
        )}
      </main>

      {/* GLOBAL STATUS BAR */}
      {status && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] animate-fade-in">
           <div className="bg-mat-900 border-2 border-mat-500 p-4 px-8 rounded-full shadow-2xl flex items-center gap-4">
              <CheckCircle className="text-mat-500" size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">{status}</span>
              <button onClick={() => setStatus(null)} className="text-gray-600 hover:text-white"><Trash2 size={14} /></button>
           </div>
        </div>
      )}
    </div>
  );
};
