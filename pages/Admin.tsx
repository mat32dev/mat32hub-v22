
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Settings, Disc, Plus, LogOut, CheckCircle, Loader2, 
  Calendar, ShoppingBag, Mail, Trash2, Edit3, X, Save, ShieldCheck, 
  Upload, Image as ImageIcon, Briefcase, Radio, User, History, 
  Heart, Layers, ArrowRight, Music, Check, Ban
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { Event, VinylRecord, Sale, InboxMessage, UserSession, UserRole, SelectorSubmission } from '../types';

export const Admin: React.FC = () => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [activeTab, setActiveTab] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [events, setEvents] = useState<Event[]>([]);
  const [records, setRecords] = useState<VinylRecord[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [inbox, setInbox] = useState<InboxMessage[]>([]);
  const [selectors, setSelectors] = useState<SelectorSubmission[]>([]);
  
  // UI States
  const [status, setStatus] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<Partial<Event> | null>(null);
  const [editingRecord, setEditingRecord] = useState<Partial<VinylRecord> | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const s = dataService.getSession();
    setSession(s);
    if (s) {
      if (s.role === 'ADMIN') setActiveTab('agenda');
      else if (s.role === 'DJ') setActiveTab('perfil');
      else setActiveTab('historial');
      loadAllData(s.role);
    } else {
      setLoading(false);
    }
    
    const sync = () => {
      const news = dataService.getSession();
      setSession(news);
      if (news && !activeTab) {
        setActiveTab(news.role === 'ADMIN' ? 'agenda' : news.role === 'DJ' ? 'perfil' : 'historial');
      }
    };
    window.addEventListener('mat32_data_changed', sync);
    return () => window.removeEventListener('mat32_data_changed', sync);
  }, [activeTab]);

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
    const email = (e.target as any).email.value;
    const pass = (e.target as any).password.value;
    if (await dataService.login(email, pass)) {
      const s = dataService.getSession();
      setSession(s);
    } else {
      setStatus("Claves no válidas.");
      setTimeout(() => setStatus(null), 3000);
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
    showNotification("Catálogo actualizado");
  };

  const deleteItem = async (type: 'event' | 'record', id: string) => {
    if (!confirm("¿Eliminar definitivamente?")) return;
    if (type === 'event') await dataService.deleteEvent(id);
    else await dataService.deleteRecord(id);
    loadAllData('ADMIN');
    showNotification("Elemento eliminado");
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
      <div className="w-full max-w-sm bg-mat-900 border border-mat-800 p-10 rounded-3xl text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-mat-500"></div>
        <Disc className="w-12 h-12 text-mat-500 mx-auto mb-6 animate-spin-slow opacity-20" />
        <h1 className="text-white text-xl font-black uppercase mb-2 font-exo">MATRIX PORTAL</h1>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-8">Administración Mat32</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input name="email" type="email" required className="w-full bg-mat-800 border border-mat-700 p-4 text-white text-center rounded-xl outline-none focus:border-mat-500 text-xs font-bold" placeholder="Email" />
          <input name="password" type="password" required className="w-full bg-mat-800 border border-mat-700 p-4 text-white text-center rounded-xl outline-none focus:border-mat-500 text-xs font-bold" placeholder="Contraseña" />
          <button className="w-full py-4 bg-mat-500 text-white font-bold uppercase rounded-xl text-[10px] tracking-widest shadow-xl hover:bg-mat-400 transition-all">ENTRAR</button>
          {status && <p className="text-red-500 text-[9px] font-bold uppercase mt-2">{status}</p>}
        </form>
        <div className="mt-8 pt-6 border-t border-mat-800 text-[7px] text-gray-700 uppercase tracking-[0.3em] leading-relaxed">
          ADMIN_KEY: mat32_admin
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-mat-950 text-white pt-24 pb-20">
      <header className="bg-mat-900 border-b border-mat-800 h-20 px-8 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-mat-500 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-lg">
             {session.name[0]}
           </div>
           <div>
              <h2 className="text-xs font-black font-exo leading-none">{session.name.toUpperCase()}</h2>
              <span className="text-[8px] text-mat-400 font-bold tracking-widest uppercase">{session.role} PORTAL</span>
           </div>
        </div>

        <div className="flex bg-mat-800 p-1 rounded-xl border border-mat-700 overflow-x-auto max-w-[50vw] no-scrollbar">
           {session.role === 'ADMIN' && (
             <>
                {(['agenda', 'tienda', 'djs', 'crm'] as string[]).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase transition-all whitespace-nowrap ${activeTab === tab ? 'bg-mat-500 text-white' : 'text-gray-500 hover:text-white'}`}>{tab}</button>
                ))}
             </>
           )}
           {session.role === 'DJ' && <button className="px-4 py-2 bg-mat-500 text-white rounded-lg text-[9px] font-bold uppercase">MI PERFIL</button>}
           {session.role === 'CUSTOMER' && <button className="px-4 py-2 bg-mat-500 text-white rounded-lg text-[9px] font-bold uppercase">PEDIDOS</button>}
        </div>
        
        <button onClick={() => { dataService.logout(); setSession(null); }} className="p-2.5 bg-mat-800 rounded-xl border border-mat-700 text-gray-400 hover:text-red-500 transition-all">
          <LogOut size={18} />
        </button>
      </header>

      <main className="container mx-auto px-6 pt-10 max-w-6xl">
        {loading ? (
          <div className="flex justify-center py-40"><Loader2 className="animate-spin text-mat-500 w-10 h-10" /></div>
        ) : (
          <div className="animate-fade-in">
             
             {/* --- AGENDA TAB --- */}
             {activeTab === 'agenda' && (
               <div className="bg-mat-900 border border-mat-800 p-8 rounded-[2.5rem] shadow-xl">
                  <div className="flex justify-between mb-10 items-center">
                     <h3 className="text-xl font-black uppercase font-exo flex items-center gap-4"><Calendar className="text-mat-500" /> Sesiones Programadas</h3>
                     <button onClick={() => setEditingEvent({ title: '', date: '', time: '21:00', price: 0, description: '', category: 'Hi-Fi Sessions' })} className="px-6 py-3 bg-mat-500 text-white text-[10px] font-black uppercase rounded-xl flex items-center gap-2 hover:bg-mat-400 shadow-xl">
                       <Plus size={16} /> NUEVO EVENTO
                     </button>
                  </div>
                  <div className="grid gap-4">
                     {events.map(ev => (
                       <div key={ev.id} className="flex items-center justify-between p-5 bg-mat-800 border border-mat-700 rounded-2xl group hover:border-mat-500 transition-all">
                          <div className="flex items-center gap-6">
                             <img src={ev.imageUrl} className="w-14 h-14 object-cover rounded-xl grayscale group-hover:grayscale-0" />
                             <div>
                                <p className="font-black uppercase text-sm">{ev.title}</p>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{ev.date} @ {ev.time}</p>
                             </div>
                          </div>
                          <div className="flex gap-2">
                             <button onClick={() => setEditingEvent(ev)} className="p-3 bg-mat-950 rounded-xl text-gray-500 hover:text-mat-500 transition-colors"><Edit3 size={16} /></button>
                             <button onClick={() => deleteItem('event', ev.id)} className="p-3 bg-mat-950 rounded-xl text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
             )}

             {/* --- TIENDA TAB --- */}
             {activeTab === 'tienda' && (
               <div className="bg-mat-900 border border-mat-800 p-8 rounded-[2.5rem] shadow-xl">
                  <div className="flex justify-between mb-10 items-center">
                     <h3 className="text-xl font-black uppercase font-exo flex items-center gap-4"><Music className="text-mat-500" /> Catálogo de Discos</h3>
                     <button onClick={() => setEditingRecord({ title: '', artist: '', price: 25, genre: 'House', stock: 1, condition: 'NM', format: 'LP', label: '', year: '2025' })} className="px-6 py-3 bg-mat-500 text-white text-[10px] font-black uppercase rounded-xl flex items-center gap-2 hover:bg-mat-400 shadow-xl">
                       <Plus size={16} /> AÑADIR DISCO
                     </button>
                  </div>
                  <div className="grid gap-4">
                     {records.map(r => (
                       <div key={r.id} className="flex items-center justify-between p-5 bg-mat-800 border border-mat-700 rounded-2xl group hover:border-mat-500 transition-all">
                          <div className="flex items-center gap-6">
                             <img src={r.coverUrl} className="w-14 h-14 object-cover rounded-xl" />
                             <div>
                                <p className="font-black uppercase text-sm">{r.title}</p>
                                <p className="text-[10px] text-mat-500 font-bold uppercase tracking-widest">{r.artist} • €{r.price}</p>
                             </div>
                          </div>
                          <div className="flex gap-2">
                             <button onClick={() => setEditingRecord(r)} className="p-3 bg-mat-950 rounded-xl text-gray-500 hover:text-mat-500 transition-colors"><Edit3 size={16} /></button>
                             <button onClick={() => deleteItem('record', r.id)} className="p-3 bg-mat-950 rounded-xl text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
             )}

             {/* --- DJS TAB --- */}
             {activeTab === 'djs' && (
                <div className="bg-mat-900 border border-mat-800 p-8 rounded-[2.5rem] shadow-xl">
                  <h3 className="text-xl font-black uppercase font-exo flex items-center gap-4 mb-10"><Radio className="text-mat-500" /> Solicitudes Open Decks</h3>
                  <div className="space-y-6">
                    {selectors.length === 0 ? <p className="text-gray-500 italic py-20 text-center">No hay solicitudes pendientes.</p> : selectors.map(sel => (
                      <div key={sel.id} className="p-8 bg-mat-800 border border-mat-700 rounded-3xl">
                         <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-mat-900 rounded-full flex items-center justify-center font-black text-mat-500">{sel.artistName[0]}</div>
                               <div>
                                  <h4 className="text-lg font-black text-white uppercase">{sel.artistName}</h4>
                                  <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${sel.status === 'approved' ? 'bg-emerald-500 text-white' : sel.status === 'pending' ? 'bg-mat-500 text-white' : 'bg-gray-700 text-gray-400'}`}>{sel.status}</span>
                               </div>
                            </div>
                            <div className="flex gap-2">
                               <button onClick={() => handleSelectorStatus(sel.id, 'approved')} className="p-3 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-xl transition-all"><Check size={18} /></button>
                               <button onClick={() => handleSelectorStatus(sel.id, 'rejected')} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"><Ban size={18} /></button>
                            </div>
                         </div>
                         <p className="text-sm text-gray-400 italic mb-4">"{sel.bio}"</p>
                         <div className="grid md:grid-cols-2 gap-4 text-[10px] font-bold uppercase tracking-widest">
                            <div className="p-3 bg-mat-900 rounded-xl">Estilos: {sel.genres.join(', ')}</div>
                            <a href={sel.mixUrl} target="_blank" className="p-3 bg-mat-900 rounded-xl text-mat-500 hover:text-white flex items-center justify-between">ESCUCHAR MIX <ArrowRight size={14} /></a>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
             )}

             {/* --- CRM TAB --- */}
             {activeTab === 'crm' && (
               <div className="space-y-10">
                  <div className="bg-mat-900 border border-mat-800 p-8 rounded-[2.5rem] shadow-xl">
                    <h3 className="text-xl font-black uppercase font-exo flex items-center gap-4 mb-8"><Mail className="text-mat-500" /> Buzón de Entrada</h3>
                    <div className="space-y-4">
                       {inbox.map(msg => (
                         <div key={msg.id} className="p-6 bg-mat-800 border border-mat-700 rounded-2xl">
                            <div className="flex justify-between mb-2">
                               <span className="text-[10px] font-black text-mat-500 uppercase">{msg.type} • {msg.sender}</span>
                               <span className="text-[9px] text-gray-500">{new Date(msg.date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs text-gray-300">"{msg.content}"</p>
                            <p className="text-[9px] text-gray-600 mt-2">{msg.email}</p>
                         </div>
                       ))}
                    </div>
                  </div>
               </div>
             )}
          </div>
        )}
      </main>

      {/* --- MODAL EVENTO --- */}
      {editingEvent && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6">
           <div className="w-full max-w-xl bg-mat-900 border border-mat-800 p-10 rounded-[3rem] relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setEditingEvent(null)} className="absolute top-8 right-8 text-gray-500 hover:text-white"><X size={28} /></button>
              <h2 className="text-3xl font-black uppercase font-exo mb-10 text-white tracking-tighter">EDITOR_EVENTO</h2>
              <form onSubmit={saveEvent} className="space-y-6">
                 <input required value={editingEvent.title} onChange={e => setEditingEvent({...editingEvent, title: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-5 rounded-2xl text-white outline-none focus:border-mat-500 text-xs font-bold" placeholder="TÍTULO" />
                 <div className="grid grid-cols-2 gap-6">
                    <input required type="date" value={editingEvent.date} onChange={e => setEditingEvent({...editingEvent, date: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-5 rounded-2xl text-white text-xs" />
                    <input required type="time" value={editingEvent.time} onChange={e => setEditingEvent({...editingEvent, time: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-5 rounded-2xl text-white text-xs" />
                 </div>
                 <div className="flex items-center gap-6">
                    <div onClick={() => fileInputRef.current?.click()} className="w-24 h-24 bg-mat-800 border-2 border-dashed border-mat-700 rounded-2xl flex items-center justify-center cursor-pointer hover:border-mat-500 overflow-hidden">
                       {editingEvent.imageUrl ? <img src={editingEvent.imageUrl} className="w-full h-full object-cover" /> : <Upload size={24} className="text-mat-800" />}
                    </div>
                    <input type="file" ref={fileInputRef} onChange={(e) => handleImageUpload(e, 'event')} className="hidden" accept="image/*" />
                    <input value={editingEvent.imageUrl} onChange={e => setEditingEvent({...editingEvent, imageUrl: e.target.value})} className="flex-1 bg-mat-800 border border-mat-700 p-5 rounded-2xl text-[9px] text-gray-500 font-bold" placeholder="URL IMAGEN" />
                 </div>
                 <textarea required value={editingEvent.description} onChange={e => setEditingEvent({...editingEvent, description: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-5 h-28 rounded-2xl text-white text-xs resize-none" placeholder="DESCRIPCIÓN" />
                 <div className="grid grid-cols-2 gap-6">
                    <input type="number" value={editingEvent.price} onChange={e => setEditingEvent({...editingEvent, price: parseFloat(e.target.value)})} className="bg-mat-800 border border-mat-700 p-5 rounded-2xl text-white text-xs" placeholder="PRECIO (€)" />
                    <input value={editingEvent.category} onChange={e => setEditingEvent({...editingEvent, category: e.target.value})} className="bg-mat-800 border border-mat-700 p-5 rounded-2xl text-white text-xs" placeholder="CATEGORÍA" />
                 </div>
                 <button type="submit" disabled={isProcessing} className="w-full py-6 bg-mat-500 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl flex items-center justify-center gap-4 hover:bg-mat-400 transition-all shadow-xl">
                    {isProcessing ? <Loader2 className="animate-spin" /> : <Save size={20} />} GUARDAR CAMBIOS
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* --- MODAL DISCO --- */}
      {editingRecord && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6">
           <div className="w-full max-w-xl bg-mat-900 border border-mat-800 p-10 rounded-[3rem] relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setEditingRecord(null)} className="absolute top-8 right-8 text-gray-500 hover:text-white"><X size={28} /></button>
              <h2 className="text-3xl font-black uppercase font-exo mb-10 text-white tracking-tighter">EDITOR_DISCO</h2>
              <form onSubmit={saveRecord} className="space-y-6">
                 <div className="grid grid-cols-2 gap-6">
                    <input required value={editingRecord.artist} onChange={e => setEditingRecord({...editingRecord, artist: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-5 rounded-2xl text-white text-xs font-bold" placeholder="ARTISTA" />
                    <input required value={editingRecord.title} onChange={e => setEditingRecord({...editingRecord, title: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-5 rounded-2xl text-white text-xs font-bold" placeholder="TÍTULO" />
                 </div>
                 <div className="grid grid-cols-3 gap-6">
                    <input type="number" value={editingRecord.price} onChange={e => setEditingRecord({...editingRecord, price: parseFloat(e.target.value)})} className="bg-mat-800 border border-mat-700 p-5 rounded-2xl text-white text-xs" placeholder="PRECIO (€)" />
                    <input value={editingRecord.genre} onChange={e => setEditingRecord({...editingRecord, genre: e.target.value})} className="bg-mat-800 border border-mat-700 p-5 rounded-2xl text-white text-xs" placeholder="GÉNERO" />
                    <input value={editingRecord.year} onChange={e => setEditingRecord({...editingRecord, year: e.target.value})} className="bg-mat-800 border border-mat-700 p-5 rounded-2xl text-white text-xs" placeholder="AÑO" />
                 </div>
                 <div className="flex items-center gap-6">
                    <div onClick={() => fileInputRef.current?.click()} className="w-24 h-24 bg-mat-800 border-2 border-dashed border-mat-700 rounded-2xl flex items-center justify-center cursor-pointer hover:border-mat-500 overflow-hidden">
                       {editingRecord.coverUrl ? <img src={editingRecord.coverUrl} className="w-full h-full object-cover" /> : <Upload size={24} className="text-mat-800" />}
                    </div>
                    <input type="file" ref={fileInputRef} onChange={(e) => handleImageUpload(e, 'record')} className="hidden" accept="image/*" />
                    <input value={editingRecord.coverUrl} onChange={e => setEditingRecord({...editingRecord, coverUrl: e.target.value})} className="flex-1 bg-mat-800 border border-mat-700 p-5 rounded-2xl text-[9px] text-gray-500 font-bold" placeholder="URL PORTADA" />
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <input value={editingRecord.label} onChange={e => setEditingRecord({...editingRecord, label: e.target.value})} className="bg-mat-800 border border-mat-700 p-5 rounded-2xl text-white text-xs" placeholder="SELLO" />
                    <select value={editingRecord.condition} onChange={e => setEditingRecord({...editingRecord, condition: e.target.value})} className="bg-mat-800 border border-mat-700 p-5 rounded-2xl text-white text-xs">
                        <option value="Mint">MINT</option>
                        <option value="NM">NM</option>
                        <option value="VG+">VG+</option>
                        <option value="VG">VG</option>
                    </select>
                 </div>
                 <button type="submit" disabled={isProcessing} className="w-full py-6 bg-mat-500 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl flex items-center justify-center gap-4 hover:bg-mat-400 transition-all shadow-xl">
                    {isProcessing ? <Loader2 className="animate-spin" /> : <Save size={20} />} GUARDAR DISCO
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* --- NOTIFICATION --- */}
      {status && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] animate-fade-in">
           <div className="bg-mat-900 border border-mat-500 p-4 px-8 rounded-full shadow-2xl flex items-center gap-4">
              <CheckCircle className="text-mat-500" size={18} />
              <span className="text-[9px] font-black uppercase tracking-widest">{status}</span>
           </div>
        </div>
      )}
    </div>
  );
};
