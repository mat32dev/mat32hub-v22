
import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, Disc, Database, RefreshCw, FileText, Search, 
  Plus, LogOut, CheckCircle, AlertCircle, Loader2, Table,
  Calendar, ShoppingBag, Mail, Users, Trash2, Edit3, Eye, X, Save, ShieldCheck, UserCheck, Upload, Image as ImageIcon
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { Event, VinylRecord, Sale, InboxMessage } from '../types';

type AdminTab = 'dashboard' | 'agenda' | 'crate' | 'sales' | 'inbox' | 'matrix' | 'door';

export const Admin: React.FC = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [loading, setLoading] = useState(true);
  
  const [events, setEvents] = useState<Event[]>([]);
  const [records, setRecords] = useState<VinylRecord[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [inbox, setInbox] = useState<InboxMessage[]>([]);
  
  const [selectedDoorEvent, setSelectedDoorEvent] = useState<string | null>(null);
  const [guestList, setGuestList] = useState<{name: string}[]>([]);
  
  const [importText, setImportText] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Partial<Event> | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (selectedDoorEvent) {
       const loadGuests = async () => {
          const list = await dataService.getEventGuestList(selectedDoorEvent);
          setGuestList(list);
       };
       loadGuests();
       window.addEventListener('mat32_data_changed', loadGuests);
       return () => window.removeEventListener('mat32_data_changed', loadGuests);
    }
  }, [selectedDoorEvent]);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingEvent) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingEvent({
          ...editingEvent,
          imageUrl: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    setIsProcessing(true);

    if (editingEvent.id) {
      await dataService.updateEvent(editingEvent.id, editingEvent);
      setStatus("EVENTO_ACTUALIZADO");
    } else {
      await dataService.createEvent(editingEvent);
      setStatus("NUEVO_EVENTO_INYECTADO");
    }

    setEditingEvent(null);
    setIsProcessing(false);
    setTimeout(() => setStatus(null), 3000);
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm("¿ELIMINAR ESTE EVENTO DE LA MATRIZ?")) {
      await dataService.deleteEvent(id);
      setStatus("EVENTO_BORRADO");
      setTimeout(() => setStatus(null), 3000);
    }
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
          <div className="hidden xl:flex bg-mat-800 p-1 rounded-xl border border-mat-700 overflow-x-auto">
             {(['dashboard', 'agenda', 'crate', 'sales', 'inbox', 'matrix', 'door'] as AdminTab[]).map(tab => (
               <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-mat-500 text-white shadow-lg' : 'text-gray-500 hover:text-white whitespace-nowrap'}`}
               >
                 {tab === 'door' ? 'DOOR CONTROL' : tab.toUpperCase()}
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
                    <div className="bg-mat-900 border border-mat-800 p-8 rounded-[2.5rem] shadow-xl" onClick={() => setActiveTab('door')}>
                       <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4">LIVE_DOOR_STATUS</h4>
                       <div className="flex items-center gap-3">
                          <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
                          <p className="text-2xl font-black font-exo uppercase">PROTOCOL_ACTIVE</p>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'door' && (
              <div className="grid lg:grid-cols-12 gap-12">
                 <div className="lg:col-span-4 space-y-6">
                    <h3 className="text-xl font-black uppercase font-exo mb-4 flex items-center gap-3"><ShieldCheck className="text-mat-500" /> EVENT_SELECTOR</h3>
                    <div className="space-y-3">
                       {events.filter(e => e.price === 0).map(ev => (
                         <button 
                          key={ev.id} 
                          onClick={() => setSelectedDoorEvent(ev.id)}
                          className={`w-full p-6 rounded-2xl border-2 text-left transition-all flex flex-col gap-1 ${selectedDoorEvent === ev.id ? 'bg-mat-500 border-white text-white' : 'bg-mat-900 border-mat-800 text-gray-400 hover:border-mat-500'}`}
                         >
                            <span className="text-xs font-black uppercase">{ev.title}</span>
                            <span className="text-[9px] font-bold opacity-60 uppercase">{ev.date} @ {ev.time}</span>
                         </button>
                       ))}
                    </div>
                 </div>
                 
                 <div className="lg:col-span-8">
                    <div className="bg-mat-900 border-2 border-mat-800 rounded-[3.5rem] p-10 md:p-16 shadow-2xl min-h-[60vh] relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>
                       
                       {selectedDoorEvent ? (
                         <>
                           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-mat-800 pb-10">
                              <div>
                                 <h2 className="text-3xl font-black text-white uppercase tracking-tighter font-exo mb-2">GUEST_DIRECTORY</h2>
                                 <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                    Sincronización en tiempo real activa
                                 </p>
                              </div>
                              <div className="bg-mat-800 p-4 px-8 rounded-2xl border border-mat-700 text-center">
                                 <span className="block text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">CONFIRMADOS</span>
                                 <span className="text-4xl font-black text-white font-exo">{guestList.length}</span>
                              </div>
                           </div>

                           <div className="grid md:grid-cols-2 gap-4">
                              {guestList.length === 0 ? (
                                <div className="col-span-full py-20 text-center text-gray-700 font-black uppercase text-xs italic">Lista vacía. Esperando señales...</div>
                              ) : (
                                guestList.map((guest, i) => (
                                  <div key={i} className="flex items-center justify-between p-5 bg-mat-800 border border-mat-700 rounded-2xl group hover:border-emerald-500 transition-all">
                                     <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-mat-900 rounded-xl flex items-center justify-center text-mat-500 font-black text-sm border border-mat-700 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                           {guest.name[0].toUpperCase()}
                                        </div>
                                        <span className="text-xs font-black text-white uppercase tracking-tight">{guest.name}</span>
                                     </div>
                                     <UserCheck size={18} className="text-gray-700 group-hover:text-emerald-500 transition-colors" />
                                  </div>
                                ))
                              )}
                           </div>
                         </>
                       ) : (
                         <div className="flex flex-col items-center justify-center h-full py-40 text-center opacity-30">
                            <Disc className="w-20 h-20 mb-6 animate-spin-slow" />
                            <p className="text-lg font-black uppercase tracking-widest">Selecciona un evento para gestionar la puerta</p>
                         </div>
                       )}
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'agenda' && (
              <div className="bg-mat-900 border border-mat-800 p-10 rounded-[3rem]">
                 <div className="flex justify-between items-center mb-10">
                    <h3 className="text-2xl font-black uppercase font-exo flex items-center gap-4"><Calendar className="text-mat-500" /> GESTIÓN DE AGENDA</h3>
                    <button 
                      onClick={() => setEditingEvent({ title: '', category: 'SESSION', price: 0, capacity: 40, date: '', time: '21:00', imageUrl: '', description: '' })}
                      className="px-6 py-3 bg-mat-500 text-white text-[10px] font-black uppercase rounded-xl flex items-center gap-2 hover:bg-mat-400 transition-all"
                    >
                      <Plus size={16} /> NUEVA SESIÓN
                    </button>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="border-b border-mat-800">
                          <tr className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                             <th className="pb-6">EVENTO</th>
                             <th className="pb-6">FECHA</th>
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
                               <td className="py-6 text-right">
                                  <div className="flex justify-end gap-2">
                                     <button onClick={() => setEditingEvent(ev)} className="p-2 text-gray-600 hover:text-white transition-colors"><Edit3 size={16} /></button>
                                     <button onClick={() => handleDeleteEvent(ev.id)} className="p-2 text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                  </div>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
            )}
          </div>
        )}
      </main>

      {editingEvent && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-fade-in">
           <div className="w-full max-w-2xl bg-mat-900 border-2 border-mat-800 rounded-[3.5rem] p-12 relative shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
              <button onClick={() => setEditingEvent(null)} className="absolute top-10 right-10 text-gray-500 hover:text-white"><X size={28} /></button>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter font-exo mb-10">{editingEvent.id ? 'EDITAR_EVENTO' : 'NUEVA_SESIÓN'}</h2>
              
              <form onSubmit={handleSaveEvent} className="space-y-8">
                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-1">Título de Sesión</label>
                       <input required value={editingEvent.title} onChange={e => setEditingEvent({...editingEvent, title: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-4 text-white text-xs font-black rounded-xl outline-none focus:border-mat-500" placeholder="NOMBRE DEL EVENTO" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-1">Categoría</label>
                       <input required value={editingEvent.category} onChange={e => setEditingEvent({...editingEvent, category: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-4 text-white text-xs font-black rounded-xl outline-none focus:border-mat-500" placeholder="P.EJ: HI-FI SESSION" />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-1">Imagen de Portada</label>
                    <div className="grid md:grid-cols-3 gap-6">
                       <div className="md:col-span-1">
                          <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square bg-mat-800 border-2 border-dashed border-mat-700 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-mat-500 hover:bg-mat-900/50 transition-all overflow-hidden relative group"
                          >
                             {editingEvent.imageUrl ? (
                                <>
                                  <img src={editingEvent.imageUrl} className="w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" alt="Preview" />
                                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                                     <RefreshCw size={24} className="text-white mb-2" />
                                     <span className="text-[8px] font-black text-white uppercase">Cambiar</span>
                                  </div>
                                </>
                             ) : (
                                <>
                                  <Upload size={24} className="text-mat-700 group-hover:text-mat-500" />
                                  <span className="text-[8px] font-black text-gray-500 uppercase text-center px-4">Cargar desde Archivo</span>
                                </>
                             )}
                          </div>
                          <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleImageUpload} 
                            accept="image/*" 
                            className="hidden" 
                          />
                       </div>
                       <div className="md:col-span-2 space-y-4">
                          <div className="relative">
                             <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-mat-700" size={16} />
                             <input value={editingEvent.imageUrl} onChange={e => setEditingEvent({...editingEvent, imageUrl: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-4 pl-12 text-white text-[9px] font-black rounded-xl outline-none focus:border-mat-500" placeholder="O PEGA UNA URL EXTERNA" />
                          </div>
                          <p className="text-[8px] text-gray-600 uppercase tracking-widest leading-relaxed">
                             Recomendado: 1200x800px. La carga local se optimiza automáticamente para el Hub.
                          </p>
                       </div>
                    </div>
                 </div>

                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-1">Fecha</label>
                       <input required type="date" value={editingEvent.date} onChange={e => setEditingEvent({...editingEvent, date: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-4 text-white text-[10px] font-black rounded-xl" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-1">Hora</label>
                       <input required type="time" value={editingEvent.time} onChange={e => setEditingEvent({...editingEvent, time: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-4 text-white text-[10px] font-black rounded-xl" />
                    </div>
                 </div>

                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-1">Precio Ticket (€)</label>
                       <input required type="number" value={editingEvent.price} onChange={e => setEditingEvent({...editingEvent, price: parseFloat(e.target.value)})} className="w-full bg-mat-800 border border-mat-700 p-4 text-white text-xs font-black rounded-xl" placeholder="0 PARA GRATIS" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-1">Aforo Máximo</label>
                       <input required type="number" value={editingEvent.capacity} onChange={e => setEditingEvent({...editingEvent, capacity: parseInt(e.target.value)})} className="w-full bg-mat-800 border border-mat-700 p-4 text-white text-xs font-black rounded-xl" placeholder="40" />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-1">Descripción de la Sesión</label>
                    <textarea required value={editingEvent.description} onChange={e => setEditingEvent({...editingEvent, description: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-4 h-32 text-white text-xs italic rounded-xl resize-none focus:border-mat-500 outline-none" placeholder="QUÉ SONARÁ, QUIÉN VIENE..." />
                 </div>

                 <button type="submit" disabled={isProcessing} className="w-full py-6 bg-mat-500 text-white font-black uppercase text-[11px] tracking-[0.5em] rounded-2xl flex items-center justify-center gap-4 hover:bg-mat-400 transition-all shadow-xl">
                    {isProcessing ? <Loader2 className="animate-spin" /> : <Save size={20} />} GUARDAR EN LA MATRIZ
                 </button>
              </form>
           </div>
        </div>
      )}

      {status && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] animate-fade-in">
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
