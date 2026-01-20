
import React, { useState, useEffect, useRef } from 'react';
import { 
  Disc, Calendar as CalendarIcon, Loader2, Trash2, Edit3,
  Activity, Terminal, Plus, X, LogOut, Inbox, Settings, 
  CheckCircle2, MessageSquare, Users, 
  ShoppingBag, Zap, ShieldCheck, Search, Eye, Save, 
  Mail, Archive, Check, UserPlus, UserCheck, Smartphone,
  Clock, Menu, ChevronRight, Send, Filter, History
} from 'lucide-react';
import { dataService, InboxMessage, AnalyticsData, ConnectorStatus, GuestEntry } from '../services/dataService';
import { VinylRecord, Event, SelectorSubmission } from '../types';

type AdminTab = 'dashboard' | 'inbox' | 'inventory' | 'door' | 'connectors';
type InventorySubTab = 'records' | 'events' | 'selectors';

export const Admin: React.FC = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [pin, setPin] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [invTab, setInvTab] = useState<InventorySubTab>('records');
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [inbox, setInbox] = useState<InboxMessage[]>([]);
  const [records, setRecords] = useState<VinylRecord[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectors, setSelectors] = useState<SelectorSubmission[]>([]);
  const [connectors, setConnectors] = useState<ConnectorStatus[]>([]);

  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [guestList, setGuestList] = useState<GuestEntry[]>([]);

  // Modal State
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [editType, setEditType] = useState<'record' | 'event' | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [an, inb, rec, ev, sel] = await Promise.all([
        dataService.getAdvancedAnalytics(),
        dataService.getInbox(),
        dataService.getRecords(),
        dataService.getEvents(),
        dataService.getSelectors()
      ]);
      setAnalytics(an);
      setInbox(inb);
      setRecords(rec);
      setEvents(ev);
      setSelectors(sel);
      setConnectors(dataService.getConnectors());
      
      if (ev.length > 0 && !selectedEventId) setSelectedEventId(ev[0].id);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dataService.isAuthenticated()) { setIsAuth(true); loadData(); }
    window.addEventListener('mat32_data_changed', loadData);
    return () => window.removeEventListener('mat32_data_changed', loadData);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await dataService.authenticate(pin)) { setIsAuth(true); loadData(); }
    else { alert("PIN INVÁLIDO"); setPin(''); }
  };

  const handleAction = async (type: string, id: string, extra?: any) => {
    if (type === 'delete_record' && confirm('¿Eliminar disco?')) await dataService.deleteRecord(id);
    if (type === 'delete_event' && confirm('¿Eliminar evento?')) await dataService.deleteEvent(id);
    if (type === 'delete_selector') await dataService.deleteSelector(id);
    if (type === 'approve_selector') await dataService.updateSelectorStatus(id, 'approved');
    if (type === 'reject_selector') await dataService.updateSelectorStatus(id, 'rejected');
    await loadData();
  };

  const openEditor = (type: 'record' | 'event', item?: any) => {
    setEditType(type);
    if (item) {
      setEditingItem(item);
    } else {
      setEditingItem(type === 'record' ? {
        artist: '', title: '', price: 25, coverUrl: '', genre: 'House', year: '2025', condition: 'Mint', description: '', format: 'LP', label: '', discogsLink: ''
      } : {
        title: '', date: '', time: '22:00', description: '', category: 'Disco', imageUrl: '', price: 15
      });
    }
  };

  const saveEdit = async () => {
    setLoading(true);
    if (editType === 'record') {
      editingItem.id ? await dataService.updateRecord(editingItem) : await dataService.createRecord(editingItem);
    } else if (editType === 'event') {
      editingItem.id ? await dataService.updateEvent(editingItem) : await dataService.createEvent(editingItem);
    }
    setEditingItem(null);
    setEditType(null);
    await loadData();
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-[#0c0a09] flex items-center justify-center p-6 font-mono">
        <div className="w-full max-w-md bg-mat-900 border-2 border-mat-800 p-10 rounded-[2.5rem] shadow-2xl">
           <Terminal className="w-12 h-12 text-mat-500 mx-auto mb-6" />
           <h1 className="text-white text-center text-xl font-black uppercase tracking-[0.4em] mb-10">MAT32 SYSTEM</h1>
           <form onSubmit={handleLogin} className="space-y-6">
              <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} className="w-full bg-mat-800 border-2 border-mat-700 text-white text-center p-6 text-2xl tracking-[0.8em] rounded-2xl outline-none" placeholder="PIN" autoFocus />
              <button type="submit" className="w-full py-5 bg-mat-500 text-white font-black uppercase rounded-2xl shadow-xl">AUTH</button>
           </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0a09] text-mat-cream flex flex-col md:flex-row font-sans relative overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className={`fixed md:sticky top-0 left-0 z-[90] h-full w-80 bg-mat-900 border-r border-mat-800 flex flex-col transition-transform duration-500 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-8 border-b border-mat-800 flex items-center gap-4">
           <ShieldCheck className="text-mat-500 w-8 h-8" />
           <h1 className="text-lg font-black uppercase tracking-tighter">MAT32 <span className="text-mat-500">CORE</span></h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
           {[
             { id: 'dashboard', label: 'Dashboard', icon: <Zap size={18} /> },
             { id: 'inbox', label: 'Inbox CRM', icon: <Inbox size={18} />, count: inbox.filter(m => m.status === 'pending').length },
             { id: 'inventory', label: 'Gestión Hub', icon: <ShoppingBag size={18} /> },
             { id: 'door', label: 'Puerta', icon: <UserCheck size={18} /> },
             { id: 'connectors', label: 'Connectors', icon: <Activity size={18} /> },
           ].map(item => (
             <button key={item.id} onClick={() => { setActiveTab(item.id as AdminTab); setIsSidebarOpen(false); }} className={`w-full flex items-center justify-between p-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-mat-500 text-white' : 'text-gray-500 hover:text-white'}`}>
                <div className="flex items-center gap-3">{item.icon} {item.label}</div>
                {item.count ? <span className="bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-[9px]">{item.count}</span> : null}
             </button>
           ))}
        </nav>

        <div className="p-6 border-t border-mat-800">
           <button onClick={() => { dataService.logout(); setIsAuth(false); }} className="w-full flex items-center gap-3 p-3 rounded-xl text-[10px] font-black uppercase text-gray-600 hover:text-red-500 transition-colors"><LogOut size={16} /> Salir</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-y-auto custom-scrollbar p-6 md:p-12">
        
        {activeTab === 'dashboard' && (
          <div className="space-y-12 animate-fade-in">
             <h2 className="text-4xl font-black uppercase font-exo tracking-tighter">Dashboard.</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Revenue Shop', val: `€${analytics?.totalRevenue || 0}` },
                  { label: 'Entradas Hoy', val: analytics?.ticketSales || 0 },
                  { label: 'Hub Activo', val: analytics?.communityActiveUsers || 0 }
                ].map((card, i) => (
                  <div key={i} className="bg-mat-900 border border-mat-800 p-8 rounded-[2rem] shadow-xl">
                     <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{card.label}</p>
                     <p className="text-3xl font-black text-white font-exo">{card.val}</p>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-10 animate-fade-in">
             <div className="flex flex-col lg:flex-row justify-between items-end gap-6">
                <div>
                   <h2 className="text-4xl font-black uppercase font-exo tracking-tighter leading-none">Hub Management.</h2>
                   <div className="flex bg-mat-900 p-1.5 rounded-2xl border border-mat-800 mt-6">
                     {(['records', 'events', 'selectors'] as InventorySubTab[]).map(tab => (
                       <button key={tab} onClick={() => setInvTab(tab)} className={`px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${invTab === tab ? 'bg-mat-500 text-white shadow-lg' : 'text-gray-600 hover:text-white'}`}>{tab}</button>
                     ))}
                   </div>
                </div>
                {invTab !== 'selectors' && (
                  <button onClick={() => openEditor(invTab === 'records' ? 'record' : 'event')} className="px-8 py-4 bg-mat-500 text-white font-black uppercase text-[10px] tracking-widest rounded-xl flex items-center gap-3 shadow-xl hover:bg-mat-400 transition-all">
                    <Plus size={16} /> Crear {invTab === 'records' ? 'Disco' : 'Evento'}
                  </button>
                )}
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {invTab === 'records' && records.map(r => (
                  <div key={r.id} className="bg-mat-900 border border-mat-800 p-6 rounded-[2rem] flex gap-5 group hover:border-mat-500 transition-all">
                     <div className="w-20 h-20 bg-black rounded-xl overflow-hidden shadow-xl shrink-0"><img src={r.coverUrl} className="w-full h-full object-cover" /></div>
                     <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <h4 className="text-white font-black uppercase text-xs truncate">{r.title}</h4>
                        <div className="flex gap-2">
                           <button onClick={() => openEditor('record', r)} className="p-2.5 bg-mat-800 text-gray-500 hover:text-white rounded-lg transition-all"><Edit3 size={14} /></button>
                           <button onClick={() => handleAction('delete_record', r.id)} className="p-2.5 bg-mat-800 text-red-500/50 hover:text-red-500 rounded-lg transition-all"><Trash2 size={14} /></button>
                        </div>
                     </div>
                  </div>
                ))}

                {invTab === 'events' && events.map(e => (
                  <div key={e.id} className="bg-mat-900 border border-mat-800 p-6 rounded-[2rem] flex flex-col gap-6 group hover:border-mat-500 transition-all">
                     <div className="flex gap-5 items-center">
                        <div className="w-16 h-16 bg-black rounded-xl overflow-hidden shadow-lg border border-mat-800 shrink-0"><img src={e.imageUrl} className="w-full h-full object-cover" /></div>
                        <div className="flex-1 min-w-0">
                           <h4 className="text-white font-black uppercase text-sm truncate tracking-tighter leading-none">{e.title}</h4>
                           <p className="text-mat-500 text-[9px] font-black uppercase mt-2 tracking-widest">{e.date}</p>
                        </div>
                     </div>
                     <div className="flex items-center justify-between border-t border-mat-800 pt-6">
                        <div className="flex gap-2">
                           <button onClick={() => openEditor('event', e)} className="p-2.5 bg-mat-800 text-gray-500 hover:text-white rounded-xl"><Edit3 size={15} /></button>
                           <button onClick={() => handleAction('delete_event', e.id)} className="p-2.5 bg-mat-800 text-red-500/30 hover:text-red-500 rounded-xl"><Trash2 size={15} /></button>
                        </div>
                     </div>
                  </div>
                ))}

                {invTab === 'selectors' && selectors.map(s => (
                  <div key={s.id} className={`bg-mat-900 border-2 p-6 rounded-[2rem] flex flex-col gap-5 ${s.status === 'pending' ? 'border-orange-500/30' : 'border-mat-800'}`}>
                     <div className="flex gap-4">
                        <div className="w-16 h-16 bg-mat-800 rounded-xl overflow-hidden"><img src={s.avatarUrl || `https://i.pravatar.cc/150?u=${s.artistName}`} className="w-full h-full object-cover" /></div>
                        <div>
                           <h4 className="text-white font-black uppercase text-sm tracking-tighter leading-none mb-1">{s.artistName}</h4>
                           <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${s.status === 'approved' ? 'bg-green-500' : 'bg-orange-500'} text-white`}>{s.status}</span>
                        </div>
                     </div>
                     <div className="flex gap-2 mt-auto pt-4 border-t border-mat-800">
                        {s.status !== 'approved' && <button onClick={() => handleAction('approve_selector', s.id)} className="flex-1 py-3 bg-green-600 text-white rounded-xl text-[9px] font-black uppercase">Aprobar</button>}
                        <button onClick={() => handleAction('delete_selector', s.id)} className="p-3 bg-mat-800 text-red-500 rounded-xl"><Trash2 size={16} /></button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* DOOR CONTROL TAB */}
        {activeTab === 'door' && (
           <div className="space-y-8 animate-fade-in">
              <h2 className="text-4xl font-black uppercase font-exo tracking-tighter">Control Puerta.</h2>
              <div className="bg-mat-900 border-2 border-mat-800 rounded-[2rem] p-10 text-center text-gray-500">
                 <UserCheck className="mx-auto w-12 h-12 mb-4 opacity-20" />
                 <p className="uppercase text-[10px] font-black tracking-[0.4em]">Selecciona un evento activo en la agenda para iniciar control.</p>
              </div>
           </div>
        )}
      </main>

      {/* Editor Modal */}
      {(editingItem && editType) && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-fade-in overflow-y-auto">
           <div className="w-full max-w-4xl bg-mat-900 border-2 border-mat-800 p-8 md:p-12 rounded-[3rem] shadow-2xl relative my-10">
              <button onClick={() => { setEditingItem(null); setEditType(null); }} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"><X size={32} /></button>
              <h2 className="text-3xl font-black text-white uppercase mb-10 tracking-tighter font-exo">{editingItem.id ? 'Editar' : 'Nuevo'} {editType === 'record' ? 'Disco' : 'Evento'}</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                 {/* Form Fields common */}
                 <div className="space-y-6">
                    <div className="space-y-1">
                       <label className="text-[8px] font-black text-mat-500 uppercase tracking-widest ml-2">Título / Nombre</label>
                       <input value={editingItem.title} onChange={e => setEditingItem({...editingItem, title: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-5 text-white uppercase text-xs font-black rounded-2xl focus:border-mat-500 outline-none" />
                    </div>
                    {editType === 'record' ? (
                       <div className="space-y-1">
                          <label className="text-[8px] font-black text-mat-500 uppercase tracking-widest ml-2">Artista</label>
                          <input value={editingItem.artist} onChange={e => setEditingItem({...editingItem, artist: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-5 text-white uppercase text-xs font-black rounded-2xl focus:border-mat-500 outline-none" />
                       </div>
                    ) : (
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                             <label className="text-[8px] font-black text-mat-500 uppercase tracking-widest ml-2">Fecha (YYYY-MM-DD)</label>
                             <input value={editingItem.date} onChange={e => setEditingItem({...editingItem, date: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-5 text-white uppercase text-xs font-black rounded-2xl focus:border-mat-500 outline-none" />
                          </div>
                          <div className="space-y-1">
                             <label className="text-[8px] font-black text-mat-500 uppercase tracking-widest ml-2">Hora</label>
                             <input value={editingItem.time} onChange={e => setEditingItem({...editingItem, time: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-5 text-white uppercase text-xs font-black rounded-2xl focus:border-mat-500 outline-none" />
                          </div>
                       </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <label className="text-[8px] font-black text-mat-500 uppercase tracking-widest ml-2">Precio (€)</label>
                          <input type="number" value={editingItem.price} onChange={e => setEditingItem({...editingItem, price: Number(e.target.value)})} className="w-full bg-mat-800 border border-mat-700 p-5 text-white uppercase text-xs font-black rounded-2xl focus:border-mat-500 outline-none" />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[8px] font-black text-mat-500 uppercase tracking-widest ml-2">Categoría / Género</label>
                          <input value={editType === 'record' ? editingItem.genre : editingItem.category} onChange={e => setEditingItem({...editingItem, [editType === 'record' ? 'genre' : 'category']: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-5 text-white uppercase text-xs font-black rounded-2xl focus:border-mat-500 outline-none" />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="space-y-1">
                       <label className="text-[8px] font-black text-mat-500 uppercase tracking-widest ml-2">URL Imagen / Cover</label>
                       <input value={editType === 'record' ? editingItem.coverUrl : editingItem.imageUrl} onChange={e => setEditingItem({...editingItem, [editType === 'record' ? 'coverUrl' : 'imageUrl']: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-5 text-white text-xs font-bold rounded-2xl focus:border-mat-500 outline-none" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[8px] font-black text-mat-500 uppercase tracking-widest ml-2">Descripción</label>
                       <textarea value={editingItem.description} onChange={e => setEditingItem({...editingItem, description: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-5 text-white text-xs font-medium rounded-2xl focus:border-mat-500 outline-none h-40 resize-none italic" />
                    </div>
                 </div>
              </div>

              <div className="mt-12 pt-8 border-t border-mat-800 flex justify-end gap-6">
                 <button onClick={() => { setEditingItem(null); setEditType(null); }} className="px-10 py-5 text-gray-500 hover:text-white font-black uppercase text-[10px] tracking-widest transition-colors">Cancelar</button>
                 <button onClick={saveEdit} className="px-12 py-5 bg-mat-500 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl hover:bg-mat-400 transition-all flex items-center gap-3">
                    <Save size={18} /> Guardar Cambios
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
