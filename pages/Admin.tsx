
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Settings, Disc, Plus, LogOut, CheckCircle, Loader2, 
  Calendar, ShoppingBag, Mail, Trash2, Edit3, X, Save, 
  Upload, Image as ImageIcon, Radio, User, History, 
  Heart, Layers, ArrowRight, Music, Check, Ban, AlertCircle
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { Event, VinylRecord, Sale, InboxMessage, UserSession, UserRole, SelectorSubmission } from '../types';

export const Admin: React.FC = () => {
  const [session, setSession] = useState<UserSession | null>(dataService.getSession());
  const [activeTab, setActiveTab] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  // Data States
  const [events, setEvents] = useState<Event[]>([]);
  const [records, setRecords] = useState<VinylRecord[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [inbox, setInbox] = useState<InboxMessage[]>([]);
  const [selectors, setSelectors] = useState<SelectorSubmission[]>([]);
  
  // UI States
  const [status, setStatus] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<Partial<Event> | null>(null);
  const [editingRecord, setEditingRecord] = useState<Partial<VinylRecord> | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (session) {
      if (!activeTab) {
        setActiveTab(session.role === 'ADMIN' ? 'agenda' : session.role === 'DJ' ? 'perfil' : 'historial');
      }
      loadAllData(session.role);
    }
    
    const sync = () => {
      const newS = dataService.getSession();
      setSession(newS);
    };
    window.addEventListener('mat32_data_changed', sync);
    return () => window.removeEventListener('mat32_data_changed', sync);
  }, [session, activeTab]);

  const loadAllData = async (role: UserRole) => {
    setLoading(true);
    if (role === 'ADMIN') {
      const [ev, rec, sal, msg, sel] = await Promise.all([
        dataService.getEvents(),
        dataService.getRecords(),
        dataService.getSales(),
        dataService.getInbox(),
        dataService.getSelectors()
      ]);
      setEvents(ev);
      setRecords(rec);
      setSales(sal);
      setInbox(msg);
      setSelectors(sel);
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const email = (e.target as any).email.value;
    const pass = (e.target as any).password.value;
    
    if (await dataService.login(email, pass)) {
      const s = dataService.getSession();
      setSession(s);
    } else {
      setLoginError("Acceso denegado. Revisa tus credenciales.");
    }
  };

  // --- CRUD HANDLERS ---
  const saveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    setIsProcessing(true);
    if (editingEvent.id) await dataService.updateEvent(editingEvent.id, editingEvent);
    else await dataService.createEvent(editingEvent);
    setEditingEvent(null);
    setIsProcessing(false);
    loadAllData('ADMIN');
    showNotification("Evento actualizado");
  };

  const saveRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    setIsProcessing(true);
    if (editingRecord.id) await dataService.updateRecord(editingRecord.id, editingRecord);
    else await dataService.createRecord(editingRecord);
    setEditingRecord(null);
    setIsProcessing(false);
    loadAllData('ADMIN');
    showNotification("Disco guardado");
  };

  const deleteItem = async (type: 'event' | 'record', id: string) => {
    if (!confirm("¿Eliminar permanentemente?")) return;
    if (type === 'event') await dataService.deleteEvent(id);
    else await dataService.deleteRecord(id);
    loadAllData('ADMIN');
    showNotification("Eliminado con éxito");
  };

  const handleSelectorStatus = async (id: string, status: 'approved' | 'rejected') => {
    await dataService.updateSelectorStatus(id, status);
    loadAllData('ADMIN');
    showNotification(`DJ ${status === 'approved' ? 'Aprobado' : 'Rechazado'}`);
  };

  const showNotification = (msg: string) => {
    setStatus(msg);
    setTimeout(() => setStatus(null), 3000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'event' | 'record') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'event' && editingEvent) setEditingEvent({ ...editingEvent, imageUrl: reader.result as string });
        if (type === 'record' && editingRecord) setEditingRecord({ ...editingRecord, coverUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!session) return (
    <div className="min-h-screen bg-mat-950 flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-mat-900 border border-mat-800 p-10 rounded-[3rem] text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-mat-500"></div>
        <Disc className="w-16 h-16 text-mat-500 mx-auto mb-8 animate-spin-slow opacity-30" />
        <h1 className="text-white text-2xl font-black uppercase mb-2 font-exo tracking-tight">MATRIX_PORTAL</h1>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-8">Gestión Centralizada Mat32</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input name="email" type="email" className="w-full bg-mat-800 border border-mat-700 p-5 text-white text-center rounded-2xl outline-none focus:border-mat-500 text-xs font-bold" placeholder="Tu Email" />
          <input name="password" type="password" required className="w-full bg-mat-800 border border-mat-700 p-5 text-white text-center rounded-2xl outline-none focus:border-mat-500 text-xs font-bold" placeholder="Master Password" />
          <button className="w-full py-5 bg-mat-500 text-white font-black uppercase rounded-2xl text-[10px] tracking-widest shadow-xl hover:bg-mat-400 transition-all">ACCEDER_AL_SISTEMA</button>
          {loginError && (
            <div className="flex items-center justify-center gap-2 text-red-500 text-[9px] font-bold uppercase mt-4">
              <AlertCircle size={14} /> {loginError}
            </div>
          )}
        </form>

        <div className="mt-10 pt-6 border-t border-mat-800">
           <p className="text-[8px] text-gray-600 font-black uppercase tracking-[0.2em] mb-4">Ayuda de Acceso</p>
           <div className="grid grid-cols-1 gap-2">
              <span className="text-[8px] text-gray-700 uppercase font-bold">Admin: mat32_admin</span>
              <span className="text-[8px] text-gray-700 uppercase font-bold">DJ: mat32_dj</span>
              <span className="text-[8px] text-gray-700 uppercase font-bold">User: mat32_user</span>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-mat-950 text-white pt-24 pb-20 font-sans">
      <header className="bg-mat-900 border-b border-mat-800 h-20 px-8 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-mat-500 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-lg">
             {session.name[0]}
           </div>
           <div className="hidden sm:block">
              <h2 className="text-xs font-black font-exo leading-none mb-1">{session.name.toUpperCase()}</h2>
              <span className="text-[8px] text-mat-400 font-bold tracking-widest uppercase">{session.role} PORTAL</span>
           </div>
        </div>

        <div className="flex bg-mat-800 p-1.5 rounded-xl border border-mat-700 overflow-x-auto no-scrollbar max-w-[50vw]">
           {session.role === 'ADMIN' && (
             <>
                {(['agenda', 'tienda', 'djs', 'crm'] as string[]).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2.5 rounded-lg text-[9px] font-black uppercase transition-all whitespace-nowrap ${activeTab === tab ? 'bg-mat-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>{tab}</button>
                ))}
             </>
           )}
           {session.role !== 'ADMIN' && <button className="px-5 py-2.5 bg-mat-500 text-white rounded-lg text-[9px] font-black uppercase shadow-lg">DASHBOARD</button>}
        </div>
        
        <button onClick={() => { dataService.logout(); setSession(null); }} className="p-3 bg-mat-800 rounded-xl border border-mat-700 text-gray-500 hover:text-red-500 transition-all">
          <LogOut size={18} />
        </button>
      </header>

      <main className="container mx-auto px-6 pt-10 max-w-6xl">
        {loading ? (
          <div className="flex justify-center py-40"><Loader2 className="animate-spin text-mat-500 w-12 h-12" /></div>
        ) : (
          <div className="animate-fade-in space-y-10">
             
             {/* --- TAB: AGENDA --- */}
             {activeTab === 'agenda' && (
               <div className="bg-mat-900 border border-mat-800 p-8 md:p-12 rounded-[3rem] shadow-2xl">
                  <div className="flex flex-col md:flex-row justify-between mb-12 gap-6 items-center">
                     <h3 className="text-2xl font-black uppercase font-exo flex items-center gap-4"><Calendar className="text-mat-500" /> Control de Sesiones</h3>
                     <button onClick={() => setEditingEvent({ title: '', date: '', time: '21:00', price: 0, description: '', category: 'Hi-Fi Session' })} className="w-full md:w-auto px-8 py-4 bg-mat-500 text-white text-[10px] font-black uppercase rounded-2xl flex items-center justify-center gap-3 hover:bg-mat-400 shadow-xl transition-all">
                       <Plus size={16} /> NUEVO_EVENTO
                     </button>
                  </div>
                  <div className="grid gap-4">
                     {events.map(ev => (
                       <div key={ev.id} className="flex items-center justify-between p-6 bg-mat-800 border border-mat-700 rounded-[2rem] group hover:border-mat-500 transition-all">
                          <div className="flex items-center gap-6">
                             <img src={ev.imageUrl} className="w-16 h-16 object-cover rounded-2xl grayscale group-hover:grayscale-0 transition-all" />
                             <div>
                                <p className="font-black uppercase text-sm tracking-tight">{ev.title}</p>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{ev.date} @ {ev.time}</p>
                             </div>
                          </div>
                          <div className="flex gap-2">
                             <button onClick={() => setEditingEvent(ev)} className="p-4 bg-mat-950 rounded-xl text-gray-500 hover:text-mat-500 transition-colors"><Edit3 size={18} /></button>
                             <button onClick={() => deleteItem('event', ev.id)} className="p-4 bg-mat-950 rounded-xl text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
             )}

             {/* --- TAB: TIENDA --- */}
             {activeTab === 'tienda' && (
               <div className="bg-mat-900 border border-mat-800 p-8 md:p-12 rounded-[3rem] shadow-2xl">
                  <div className="flex flex-col md:flex-row justify-between mb-12 gap-6 items-center">
                     <h3 className="text-2xl font-black uppercase font-exo flex items-center gap-4"><Music className="text-mat-500" /> Inventario Vinyl</h3>
                     <button onClick={() => setEditingRecord({ title: '', artist: '', price: 25, genre: 'House', stock: 1, condition: 'NM', format: 'LP', label: '', year: '2025' })} className="w-full md:w-auto px-8 py-4 bg-mat-500 text-white text-[10px] font-black uppercase rounded-2xl flex items-center justify-center gap-3 hover:bg-mat-400 shadow-xl transition-all">
                       <Plus size={16} /> AÑADIR_DISCO
                     </button>
                  </div>
                  <div className="grid gap-4">
                     {records.map(r => (
                       <div key={r.id} className="flex items-center justify-between p-6 bg-mat-800 border border-mat-700 rounded-[2rem] group hover:border-mat-500 transition-all">
                          <div className="flex items-center gap-6">
                             <img src={r.coverUrl} className="w-16 h-16 object-cover rounded-2xl" />
                             <div>
                                <p className="font-black uppercase text-sm tracking-tight">{r.title}</p>
                                <p className="text-[10px] text-mat-500 font-bold uppercase tracking-widest">{r.artist} • €{r.price}</p>
                             </div>
                          </div>
                          <div className="flex gap-2">
                             <button onClick={() => setEditingRecord(r)} className="p-4 bg-mat-950 rounded-xl text-gray-500 hover:text-mat-500 transition-colors"><Edit3 size={18} /></button>
                             <button onClick={() => deleteItem('record', r.id)} className="p-4 bg-mat-950 rounded-xl text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
             )}

             {/* --- TAB: DJS --- */}
             {activeTab === 'djs' && (
                <div className="bg-mat-900 border border-mat-800 p-8 md:p-12 rounded-[3rem] shadow-2xl">
                  <h3 className="text-2xl font-black uppercase font-exo flex items-center gap-4 mb-12"><Radio className="text-mat-500" /> Solicitudes Open Decks</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    {selectors.length === 0 ? <p className="text-gray-500 italic py-20 text-center col-span-full">Buzón de artistas vacío.</p> : selectors.map(sel => (
                      <div key={sel.id} className="p-8 bg-mat-800 border border-mat-700 rounded-[2.5rem] flex flex-col h-full">
                         <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                               <div className="w-14 h-14 bg-mat-950 rounded-full border border-mat-700 flex items-center justify-center font-black text-mat-500 text-xl shadow-inner">{sel.artistName[0]}</div>
                               <div>
                                  <h4 className="text-lg font-black text-white uppercase tracking-tight">{sel.artistName}</h4>
                                  <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${sel.status === 'approved' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : sel.status === 'rejected' ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-mat-500/10 border-mat-500 text-mat-500'}`}>{sel.status}</span>
                               </div>
                            </div>
                            <div className="flex gap-2">
                               <button onClick={() => handleSelectorStatus(sel.id, 'approved')} className="p-3 bg-mat-950 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-xl transition-all" title="Aprobar"><Check size={18} /></button>
                               <button onClick={() => handleSelectorStatus(sel.id, 'rejected')} className="p-3 bg-mat-950 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all" title="Rechazar"><Ban size={18} /></button>
                            </div>
                         </div>
                         <p className="text-sm text-gray-400 italic mb-8 flex-1">"{sel.bio}"</p>
                         <div className="pt-6 border-t border-mat-700 flex items-center justify-between">
                            <a href={sel.mixUrl} target="_blank" className="text-[9px] font-black uppercase text-mat-500 hover:text-white flex items-center gap-2 group">ESCUCHAR_DEMO <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" /></a>
                            <span className="text-[8px] text-gray-600 font-bold uppercase">{sel.genres.join(', ')}</span>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
             )}

             {/* --- TAB: CRM --- */}
             {activeTab === 'crm' && (
               <div className="space-y-10">
                  <div className="bg-mat-900 border border-mat-800 p-8 md:p-12 rounded-[3rem] shadow-2xl">
                    <h3 className="text-2xl font-black uppercase font-exo flex items-center gap-4 mb-10"><Mail className="text-mat-500" /> Buzón Central</h3>
                    <div className="space-y-4">
                       {inbox.length === 0 ? <p className="text-gray-600 italic py-20 text-center uppercase text-[10px] tracking-widest">Sin mensajes recibidos</p> : inbox.map(msg => (
                         <div key={msg.id} className="p-6 bg-mat-800 border border-mat-700 rounded-[1.5rem] hover:border-mat-500 transition-all">
                            <div className="flex justify-between mb-4">
                               <div className="flex items-center gap-3">
                                  <span className={`text-[8px] font-black px-2 py-1 rounded border ${msg.type === 'lead' ? 'border-mat-500 text-mat-500' : 'border-gray-500 text-gray-500'} uppercase`}>{msg.type}</span>
                                  <span className="text-xs font-black text-white uppercase">{msg.sender}</span>
                               </div>
                               <span className="text-[9px] text-gray-600 font-bold">{new Date(msg.date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-gray-300 italic mb-4">"{msg.content}"</p>
                            <p className="text-[9px] text-gray-500 font-bold tracking-wider">{msg.email}</p>
                         </div>
                       ))}
                    </div>
                  </div>
               </div>
             )}
          </div>
        )}
      </main>

      {/* --- MODAL: EDITOR EVENTO --- */}
      {editingEvent && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 overflow-y-auto">
           <div className="w-full max-w-2xl bg-mat-900 border-2 border-mat-800 rounded-[3.5rem] p-12 relative shadow-2xl my-10">
              <button onClick={() => setEditingEvent(null)} className="absolute top-10 right-10 text-gray-500 hover:text-white transition-colors"><X size={32} /></button>
              <h2 className="text-4xl font-black uppercase font-exo mb-12 text-white tracking-tighter">SISTEMA_EVENTO</h2>
              <form onSubmit={saveEvent} className="space-y-8">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Título de Sesión</label>
                   <input required value={editingEvent.title} onChange={e => setEditingEvent({...editingEvent, title: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-5 rounded-2xl text-white outline-none focus:border-mat-500 text-xs font-bold" />
                 </div>
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Fecha</label>
                       <input required type="date" value={editingEvent.date} onChange={e => setEditingEvent({...editingEvent, date: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-5 rounded-2xl text-white text-xs outline-none focus:border-mat-500" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Hora</label>
                       <input required type="time" value={editingEvent.time} onChange={e => setEditingEvent({...editingEvent, time: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-5 rounded-2xl text-white text-xs outline-none focus:border-mat-500" />
                    </div>
                 </div>
                 <div className="flex items-center gap-8">
                    <div onClick={() => fileInputRef.current?.click()} className="w-28 h-28 bg-mat-800 border-2 border-dashed border-mat-700 rounded-3xl flex items-center justify-center cursor-pointer hover:border-mat-500 overflow-hidden group shadow-inner">
                       {editingEvent.imageUrl ? <img src={editingEvent.imageUrl} className="w-full h-full object-cover group-hover:opacity-40 transition-opacity" /> : <Upload size={32} className="text-mat-800" />}
                    </div>
                    <div className="flex-1 space-y-2">
                       <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest">Inyectar Imagen URL</label>
                       <input value={editingEvent.imageUrl} onChange={e => setEditingEvent({...editingEvent, imageUrl: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-4 rounded-xl text-[9px] text-gray-500 font-bold uppercase tracking-widest" placeholder="HTTP://..." />
                       <input type="file" ref={fileInputRef} onChange={(e) => handleImageUpload(e, 'event')} className="hidden" accept="image/*" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Descripción</label>
                    <textarea required value={editingEvent.description} onChange={e => setEditingEvent({...editingEvent, description: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-6 h-32 rounded-2xl text-white text-xs resize-none outline-none focus:border-mat-500 font-light italic" />
                 </div>
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Precio (€)</label>
                       <input type="number" value={editingEvent.price} onChange={e => setEditingEvent({...editingEvent, price: parseFloat(e.target.value)})} className="bg-mat-800 border border-mat-700 p-5 rounded-2xl text-white text-xs outline-none focus:border-mat-500" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Categoría</label>
                       <input value={editingEvent.category} onChange={e => setEditingEvent({...editingEvent, category: e.target.value})} className="bg-mat-800 border border-mat-700 p-5 rounded-2xl text-white text-xs outline-none focus:border-mat-500" />
                    </div>
                 </div>
                 <button type="submit" disabled={isProcessing} className="w-full py-7 bg-mat-500 text-white font-black uppercase text-[11px] tracking-[0.5em] rounded-[2rem] shadow-2xl flex items-center justify-center gap-4 hover:bg-mat-400 transition-all">
                    {isProcessing ? <Loader2 className="animate-spin" /> : <Save size={20} />} EJECUTAR_CAMBIOS
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* --- MODAL: EDITOR DISCO --- */}
      {editingRecord && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 overflow-y-auto">
           <div className="w-full max-w-2xl bg-mat-900 border-2 border-mat-800 rounded-[3.5rem] p-12 relative shadow-2xl my-10">
              <button onClick={() => setEditingRecord(null)} className="absolute top-10 right-10 text-gray-500 hover:text-white transition-colors"><X size={32} /></button>
              <h2 className="text-4xl font-black uppercase font-exo mb-12 text-white tracking-tighter">SISTEMA_VINYL</h2>
              <form onSubmit={saveRecord} className="space-y-8">
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Artista</label>
                       <input required value={editingRecord.artist} onChange={e => setEditingRecord({...editingRecord, artist: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-5 rounded-2xl text-white text-xs font-bold outline-none focus:border-mat-500" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Título</label>
                       <input required value={editingRecord.title} onChange={e => setEditingRecord({...editingRecord, title: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-5 rounded-2xl text-white text-xs font-bold outline-none focus:border-mat-500" />
                    </div>
                 </div>
                 <div className="grid grid-cols-3 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Precio (€)</label>
                       <input type="number" value={editingRecord.price} onChange={e => setEditingRecord({...editingRecord, price: parseFloat(e.target.value)})} className="bg-mat-800 border border-mat-700 p-5 rounded-2xl text-white text-xs outline-none focus:border-mat-500" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Género</label>
                       <input value={editingRecord.genre} onChange={e => setEditingRecord({...editingRecord, genre: e.target.value})} className="bg-mat-800 border border-mat-700 p-5 rounded-2xl text-white text-xs outline-none focus:border-mat-500" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Año</label>
                       <input value={editingRecord.year} onChange={e => setEditingRecord({...editingRecord, year: e.target.value})} className="bg-mat-800 border border-mat-700 p-5 rounded-2xl text-white text-xs outline-none focus:border-mat-500" />
                    </div>
                 </div>
                 <div className="flex items-center gap-8">
                    <div onClick={() => fileInputRef.current?.click()} className="w-28 h-28 bg-mat-800 border-2 border-dashed border-mat-700 rounded-3xl flex items-center justify-center cursor-pointer hover:border-mat-500 overflow-hidden group shadow-inner">
                       {editingRecord.coverUrl ? <img src={editingRecord.coverUrl} className="w-full h-full object-cover group-hover:opacity-40 transition-opacity" /> : <Upload size={32} className="text-mat-800" />}
                    </div>
                    <div className="flex-1 space-y-2">
                       <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest">Inyectar Portada URL</label>
                       <input value={editingRecord.coverUrl} onChange={e => setEditingRecord({...editingRecord, coverUrl: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-4 rounded-xl text-[9px] text-gray-500 font-bold uppercase tracking-widest" placeholder="HTTP://..." />
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Sello</label>
                       <input value={editingRecord.label} onChange={e => setEditingRecord({...editingRecord, label: e.target.value})} className="bg-mat-800 border border-mat-700 p-5 rounded-2xl text-white text-xs outline-none focus:border-mat-500" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Estado</label>
                       <select value={editingRecord.condition} onChange={e => setEditingRecord({...editingRecord, condition: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-5 rounded-2xl text-white text-xs font-bold outline-none focus:border-mat-500 cursor-pointer">
                           <option value="Mint">MINT</option>
                           <option value="NM">NM</option>
                           <option value="VG+">VG+</option>
                           <option value="VG">VG</option>
                       </select>
                    </div>
                 </div>
                 <button type="submit" disabled={isProcessing} className="w-full py-7 bg-mat-500 text-white font-black uppercase text-[11px] tracking-[0.5em] rounded-[2rem] shadow-2xl flex items-center justify-center gap-4 hover:bg-mat-400 transition-all">
                    {isProcessing ? <Loader2 className="animate-spin" /> : <Save size={20} />} REGISTRAR_DISCO
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* --- NOTIFICACIÓN GLOBAL --- */}
      {status && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] animate-fade-in">
           <div className="bg-mat-900 border border-mat-500 p-4 px-8 rounded-full shadow-[0_0_50px_rgba(234,88,12,0.4)] flex items-center gap-4">
              <CheckCircle className="text-mat-500" size={18} />
              <span className="text-[9px] font-black uppercase tracking-widest leading-none">{status}</span>
           </div>
        </div>
      )}
    </div>
  );
};
