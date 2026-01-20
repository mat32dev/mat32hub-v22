
import React, { useState, useEffect, useRef } from 'react';
import { 
  Disc, Calendar as CalendarIcon, Loader2, Trash2, Edit3,
  Activity, Terminal, Plus, X, LogOut, Inbox, Settings, 
  CheckCircle2, MessageSquare, Users, 
  ShoppingBag, Zap, ShieldCheck, Search, Eye, Save, 
  Mail, Archive, Check, UserPlus, UserCheck, Smartphone,
  Clock, Menu, ChevronRight, Send, Filter, History, BarChart3,
  TrendingUp, Layers, CheckCircle
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
  
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [inbox, setInbox] = useState<InboxMessage[]>([]);
  const [records, setRecords] = useState<VinylRecord[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectors, setSelectors] = useState<SelectorSubmission[]>([]);
  const [connectors, setConnectors] = useState<ConnectorStatus[]>([]);

  // Inbox focus
  const [selectedMsg, setSelectedMsg] = useState<InboxMessage | null>(null);
  const [replyText, setReplyText] = useState('');

  // Door focus
  const [doorEventId, setDoorEventId] = useState('');
  const [guestList, setGuestList] = useState<GuestEntry[]>([]);
  const [guestSearch, setGuestSearch] = useState('');

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
      
      if (doorEventId) {
        const list = await dataService.getEventGuestList(doorEventId);
        setGuestList(list);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dataService.isAuthenticated()) { setIsAuth(true); loadData(); }
    window.addEventListener('mat32_data_changed', loadData);
    return () => window.removeEventListener('mat32_data_changed', loadData);
  }, [doorEventId]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await dataService.authenticate(pin)) { setIsAuth(true); loadData(); }
    else { alert("PIN INVÁLIDO (3232)"); setPin(''); }
  };

  const openEditor = (type: 'record' | 'event', item?: any) => {
    setEditType(type);
    if (item) setEditingItem({ ...item });
    else {
      setEditingItem(type === 'record' ? {
        artist: '', title: '', price: 20, genre: 'House', year: '2025', condition: 'Mint', coverUrl: '', description: ''
      } : {
        title: '', date: '', time: '20:00', price: 15, category: 'Disco', description: '', imageUrl: ''
      });
    }
  };

  const saveItem = async () => {
    setLoading(true);
    if (editType === 'record') {
      editingItem.id ? await dataService.updateRecord(editingItem) : await dataService.createRecord(editingItem);
    } else {
      editingItem.id ? await dataService.updateEvent(editingItem) : await dataService.createEvent(editingItem);
    }
    setEditingItem(null);
    setEditType(null);
    await loadData();
  };

  const deleteItem = async (type: 'record' | 'event', id: string) => {
    if (!confirm('¿Seguro que quieres eliminar este elemento?')) return;
    setLoading(true);
    type === 'record' ? await dataService.deleteRecord(id) : await dataService.deleteEvent(id);
    await loadData();
  };

  const handleReply = async () => {
    if (!selectedMsg || !replyText.trim()) return;
    await dataService.addReplyToMessage(selectedMsg.id, replyText);
    setReplyText('');
    await loadData();
    // Refresh local selected msg
    const updated = (await dataService.getInbox()).find(m => m.id === selectedMsg.id);
    if (updated) setSelectedMsg(updated);
  };

  const toggleDoorCheck = async (name: string) => {
    await dataService.toggleCheckIn(doorEventId, name);
    await loadData();
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-[#0c0a09] flex items-center justify-center p-6 font-mono">
        <div className="w-full max-w-md bg-mat-900 border-2 border-mat-800 p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
           <Terminal className="w-16 h-16 text-mat-500 mx-auto mb-8" />
           <h1 className="text-white text-center text-2xl font-black uppercase tracking-[0.4em] mb-12">MAT32 <span className="text-mat-500">CORE</span></h1>
           <form onSubmit={handleLogin} className="space-y-8">
              <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} className="w-full bg-mat-800 border-2 border-mat-700 text-white text-center p-6 text-3xl tracking-[1em] rounded-[2rem] outline-none focus:border-mat-500 transition-all" placeholder="PIN" autoFocus />
              <button type="submit" className="w-full py-6 bg-mat-500 text-white font-black uppercase rounded-[2rem] shadow-xl hover:bg-mat-400 active:scale-95 transition-all">ACCEDER AL CORE</button>
           </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0a09] text-mat-cream flex flex-col lg:flex-row font-sans relative overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-80 bg-mat-900 border-r border-mat-800 flex flex-col h-auto lg:h-screen sticky top-0 z-[100]">
        <div className="p-8 border-b border-mat-800 flex items-center gap-4">
           <ShieldCheck className="text-mat-500 w-8 h-8" />
           <h1 className="text-xl font-black uppercase tracking-tighter">MAT32 <span className="text-mat-500">SYSTEM</span></h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
           {[
             { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={18} /> },
             { id: 'inbox', label: 'Inbox CRM', icon: <Inbox size={18} />, count: inbox.filter(m => m.status === 'pending').length },
             { id: 'inventory', label: 'Gestión Hub', icon: <Layers size={18} /> },
             { id: 'door', label: 'Control Puerta', icon: <UserCheck size={18} /> },
             { id: 'connectors', label: 'Connectivity', icon: <Activity size={18} /> },
           ].map(item => (
             <button key={item.id} onClick={() => setActiveTab(item.id as AdminTab)} className={`w-full flex items-center justify-between p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-mat-500 text-white shadow-xl' : 'text-gray-500 hover:bg-mat-800 hover:text-white'}`}>
                <div className="flex items-center gap-3">{item.icon} {item.label}</div>
                {item.count ? <span className="bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-[9px]">{item.count}</span> : null}
             </button>
           ))}
        </nav>

        <div className="p-8 border-t border-mat-800">
           <button onClick={() => { dataService.logout(); window.location.reload(); }} className="w-full flex items-center gap-3 p-4 rounded-2xl text-[10px] font-black uppercase text-gray-600 hover:text-red-500 transition-colors"><LogOut size={16} /> Logout Core</button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 h-screen overflow-y-auto custom-scrollbar p-6 lg:p-12">
        
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-12 animate-fade-in">
             <div className="flex justify-between items-end">
                <div>
                   <h2 className="text-4xl lg:text-6xl font-black uppercase font-exo tracking-tighter leading-none mb-2">CORE <span className="text-mat-500">STATS.</span></h2>
                   <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Analítica de rendimiento en tiempo real</p>
                </div>
                <div className="bg-mat-900 border border-mat-800 p-3 rounded-2xl flex items-center gap-3 text-mat-500">
                   <Clock size={16} /> <span className="text-[10px] font-black uppercase">Último Sync: {new Date().toLocaleTimeString()}</span>
                </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { label: 'Revenue Bruto', val: `€${analytics?.totalRevenue || 0}`, icon: <TrendingUp className="text-green-500" /> },
                  { label: 'Visitas Únicas', val: analytics?.visitsSimulated || 0, icon: <Eye className="text-blue-500" /> },
                  { label: 'Leads Recibidos', val: analytics?.leadsCount || 0, icon: <MessageSquare className="text-mat-500" /> },
                  { label: 'Hub Engagement', val: `${analytics?.communityActiveUsers || 0}%`, icon: <Activity className="text-purple-500" /> }
                ].map((kpi, i) => (
                  <div key={i} className="bg-mat-900 border border-mat-800 p-10 rounded-[2.5rem] shadow-xl hover:border-mat-500 transition-all group">
                     <div className="w-12 h-12 bg-mat-800 rounded-xl flex items-center justify-center mb-6 border border-mat-700 group-hover:scale-110 transition-transform">{kpi.icon}</div>
                     <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">{kpi.label}</p>
                     <p className="text-4xl font-black text-white font-exo">{kpi.val}</p>
                  </div>
                ))}
             </div>

             <div className="bg-mat-900 border border-mat-800 p-12 rounded-[3.5rem] shadow-xl">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-8 font-exo">Tráfico Reciente (Canales)</h3>
                <div className="space-y-6">
                   {[
                     { name: 'Organic Search (Valencia Venue Hire)', val: '45%' },
                     { name: 'Social (Instagram Hub)', val: '32%' },
                     { name: 'Direct (Resident Fans)', val: '15%' },
                     { name: 'Referral (RA.co)', val: '8%' }
                   ].map((channel, i) => (
                     <div key={i} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                           <span>{channel.name}</span>
                           <span className="text-white">{channel.val}</span>
                        </div>
                        <div className="h-2 bg-mat-800 rounded-full overflow-hidden">
                           <div className="h-full bg-mat-500" style={{ width: channel.val }}></div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* INBOX CRM TAB */}
        {activeTab === 'inbox' && (
          <div className="h-full flex flex-col md:flex-row gap-8 animate-fade-in">
             {/* List */}
             <div className="w-full md:w-96 bg-mat-900 border border-mat-800 rounded-[3rem] overflow-hidden flex flex-col shadow-2xl">
                <div className="p-8 border-b border-mat-800 flex justify-between items-center">
                   <h3 className="text-xl font-black text-white uppercase font-exo">Bandeja</h3>
                   <span className="text-[10px] font-black text-gray-600 uppercase">{inbox.length} Leads</span>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                   {inbox.map(m => (
                     <button key={m.id} onClick={() => setSelectedMsg(m)} className={`w-full text-left p-8 border-b border-mat-800 transition-all hover:bg-mat-800/50 relative ${selectedMsg?.id === m.id ? 'bg-mat-800 border-l-4 border-mat-500' : ''}`}>
                        {m.status === 'pending' && <span className="absolute top-8 right-8 w-2 h-2 bg-mat-500 rounded-full animate-pulse"></span>}
                        <div className="flex items-center gap-3 mb-2">
                           <span className="text-[8px] font-black text-mat-500 uppercase tracking-widest px-2 py-0.5 bg-mat-950 rounded border border-mat-700">{m.type}</span>
                           <span className="text-[8px] text-gray-600 font-bold">{m.date.split(',')[0]}</span>
                        </div>
                        <h4 className="text-white font-black uppercase text-xs truncate mb-2">{m.sender}</h4>
                        <p className="text-gray-500 text-[10px] truncate italic leading-none">"{m.content}"</p>
                     </button>
                   ))}
                </div>
             </div>

             {/* Thread View */}
             <div className="flex-1 bg-mat-900 border border-mat-800 rounded-[3.5rem] flex flex-col shadow-2xl overflow-hidden">
                {selectedMsg ? (
                  <>
                    <div className="p-10 border-b border-mat-800 flex justify-between items-center bg-mat-950/20">
                       <div>
                          <h4 className="text-3xl font-black text-white uppercase tracking-tighter font-exo leading-none">{selectedMsg.sender}</h4>
                          <p className="text-[10px] font-bold text-gray-500 mt-2 uppercase tracking-widest">{selectedMsg.email} • {selectedMsg.phone || 'S/T'}</p>
                       </div>
                       <div className="flex gap-2">
                          <button onClick={() => dataService.updateMessageStatus(selectedMsg.id, 'archived')} className="p-4 bg-mat-800 text-gray-500 hover:text-white rounded-2xl transition-all shadow-lg"><Archive size={20} /></button>
                          <button onClick={() => { if(confirm('Borrar?')) dataService.deleteMessage(selectedMsg.id); setSelectedMsg(null); loadData(); }} className="p-4 bg-mat-800 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-lg"><Trash2 size={20} /></button>
                       </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar bg-[#0f0d0c]">
                       <div className="max-w-[85%] bg-mat-800 p-8 rounded-[2rem] rounded-tl-none border border-mat-700 shadow-xl relative">
                          <span className="text-[8px] font-black text-mat-500 uppercase tracking-widest mb-4 block">Mensaje Original ({selectedMsg.date})</span>
                          <p className="text-gray-200 text-lg font-light italic leading-relaxed">"{selectedMsg.content}"</p>
                       </div>

                       {selectedMsg.replies?.map(rep => (
                         <div key={rep.id} className={`flex ${rep.sender === 'admin' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                            <div className={`max-w-[80%] p-6 rounded-[2rem] ${rep.sender === 'admin' ? 'bg-mat-500 text-white rounded-tr-none shadow-xl' : 'bg-mat-800 text-gray-200 rounded-tl-none border border-mat-700 italic'}`}>
                               <div className="flex justify-between items-center gap-10 mb-2">
                                  <span className="text-[9px] font-black uppercase tracking-widest opacity-60">{rep.sender === 'admin' ? 'Manager Reply' : 'User'}</span>
                                  <span className="text-[8px] opacity-40">{rep.timestamp}</span>
                               </div>
                               <p className="text-sm font-bold">{rep.text}</p>
                            </div>
                         </div>
                       ))}
                    </div>

                    <div className="p-8 bg-mat-950 border-t border-mat-800">
                       <div className="flex gap-4">
                          <textarea 
                            value={replyText} 
                            onChange={e => setReplyText(e.target.value)} 
                            className="flex-1 bg-mat-900 border-2 border-mat-800 text-white p-5 rounded-3xl outline-none focus:border-mat-500 transition-all resize-none h-16 text-sm font-bold" 
                            placeholder="Responder al cliente..."
                          />
                          <button onClick={handleReply} className="p-6 bg-mat-500 text-white rounded-3xl shadow-xl hover:bg-mat-400 active:scale-95 transition-all self-end"><Send size={24} /></button>
                       </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center opacity-20 p-20 text-center">
                     <Inbox className="w-24 h-24 mb-8" />
                     <h3 className="text-4xl font-black uppercase font-exo">Selecciona un lead.</h3>
                     <p className="text-xs uppercase font-black tracking-[0.4em] italic mt-4">Protocolo de atención al cliente listo.</p>
                  </div>
                )}
             </div>
          </div>
        )}

        {/* INVENTORY HUB TAB */}
        {activeTab === 'inventory' && (
          <div className="space-y-12 animate-fade-in">
             <div className="flex flex-col lg:flex-row justify-between items-end gap-6">
                <div>
                   <h2 className="text-5xl lg:text-7xl font-black uppercase font-exo tracking-tighter leading-none mb-4">HUB <span className="text-mat-500">MGT.</span></h2>
                   <div className="flex bg-mat-900 border border-mat-800 p-1.5 rounded-2xl shadow-xl">
                      {(['records', 'events', 'selectors'] as InventorySubTab[]).map(tab => (
                        <button key={tab} onClick={() => setInvTab(tab)} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${invTab === tab ? 'bg-mat-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>{tab}</button>
                      ))}
                   </div>
                </div>
                {invTab !== 'selectors' && (
                   <button onClick={() => openEditor(invTab === 'records' ? 'record' : 'event')} className="px-10 py-5 bg-mat-500 text-white font-black uppercase text-[11px] tracking-widest rounded-2xl flex items-center gap-4 shadow-xl hover:bg-mat-400 transition-all"><Plus size={18} /> Crear {invTab === 'records' ? 'Disco' : 'Evento'}</button>
                )}
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {invTab === 'records' && records.map(r => (
                  <div key={r.id} className="bg-mat-900 border border-mat-800 p-6 rounded-[2.5rem] flex flex-col gap-6 group hover:border-mat-500 transition-all shadow-xl">
                     <div className="aspect-square bg-black rounded-2xl overflow-hidden shadow-lg border border-mat-800"><img src={r.coverUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /></div>
                     <div className="flex-1 min-w-0">
                        <h4 className="text-white font-black uppercase text-sm truncate tracking-tighter leading-none mb-1">{r.title}</h4>
                        <p className="text-mat-500 text-[10px] font-black uppercase tracking-widest">{r.artist}</p>
                     </div>
                     <div className="flex gap-2 pt-4 border-t border-mat-800">
                        <button onClick={() => openEditor('record', r)} className="flex-1 py-3 bg-mat-800 text-gray-500 hover:text-white rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-2"><Edit3 size={14} /> Editar</button>
                        <button onClick={() => deleteItem('record', r.id)} className="p-3 bg-mat-800 text-red-500/30 hover:text-red-500 rounded-xl transition-all"><Trash2 size={14} /></button>
                     </div>
                  </div>
                ))}

                {invTab === 'events' && events.map(e => (
                  <div key={e.id} className="bg-mat-900 border border-mat-800 p-6 rounded-[2.5rem] flex flex-col gap-6 group hover:border-mat-500 transition-all shadow-xl">
                     <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-lg border border-mat-800"><img src={e.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /></div>
                     <div className="flex-1 min-w-0">
                        <h4 className="text-white font-black uppercase text-sm truncate tracking-tighter leading-none mb-2">{e.title}</h4>
                        <p className="text-mat-500 text-[9px] font-black uppercase tracking-widest">{e.date} @ {e.time}</p>
                     </div>
                     <div className="flex gap-2 pt-4 border-t border-mat-800">
                        <button onClick={() => openEditor('event', e)} className="flex-1 py-3 bg-mat-800 text-gray-500 hover:text-white rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-2"><Edit3 size={14} /> Editar</button>
                        <button onClick={() => deleteItem('event', e.id)} className="p-3 bg-mat-800 text-red-500/30 hover:text-red-500 rounded-xl transition-all"><Trash2 size={14} /></button>
                     </div>
                  </div>
                ))}

                {invTab === 'selectors' && selectors.map(s => (
                  <div key={s.id} className={`bg-mat-900 border-2 p-8 rounded-[3rem] flex flex-col gap-6 shadow-xl ${s.status === 'pending' ? 'border-orange-500/30 shadow-orange-500/5' : 'border-mat-800'}`}>
                     <div className="flex items-center gap-5">
                        <div className="w-20 h-20 bg-mat-800 rounded-2xl overflow-hidden shadow-inner border border-mat-700"><img src={s.avatarUrl || `https://i.pravatar.cc/150?u=${s.artistName}`} className="w-full h-full object-cover" /></div>
                        <div>
                           <h4 className="text-white font-black uppercase text-xl tracking-tighter leading-none mb-1">{s.artistName}</h4>
                           <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded shadow-lg ${s.status === 'approved' ? 'bg-green-500' : 'bg-orange-500'} text-white`}>{s.status}</span>
                        </div>
                     </div>
                     <div className="flex gap-2 pt-4 border-t border-mat-800">
                        {s.status !== 'approved' && (
                           <button onClick={() => { dataService.updateSelectorStatus(s.id, 'approved'); loadData(); }} className="flex-1 py-4 bg-green-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Aprobar</button>
                        )}
                        <button onClick={() => { if(confirm('¿Borrar?')) dataService.deleteSelector(s.id); loadData(); }} className="p-4 bg-mat-800 text-red-500 hover:text-white rounded-2xl"><Trash2 size={20} /></button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* DOOR CONTROL TAB */}
        {activeTab === 'door' && (
          <div className="space-y-12 animate-fade-in">
             <div className="flex flex-col lg:flex-row justify-between items-end gap-6">
                <div>
                   <h2 className="text-5xl lg:text-7xl font-black uppercase font-exo tracking-tighter leading-none mb-4">DOOR <span className="text-mat-500">CTRL.</span></h2>
                   <div className="flex flex-wrap gap-3 mt-6">
                      {events.map(e => (
                        <button key={e.id} onClick={() => setDoorEventId(e.id)} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${doorEventId === e.id ? 'bg-mat-500 text-white shadow-xl' : 'bg-mat-900 border border-mat-800 text-gray-500'}`}>{e.title}</button>
                      ))}
                   </div>
                </div>
             </div>

             {doorEventId ? (
                <div className="bg-mat-900 border border-mat-800 rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col">
                   <div className="p-10 border-b border-mat-800 flex flex-col md:flex-row gap-6 md:items-center justify-between">
                      <div className="relative flex-1 max-w-md">
                         <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                         <input type="text" value={guestSearch} onChange={e => setGuestSearch(e.target.value)} placeholder="Buscar por nombre..." className="w-full bg-mat-800 border-2 border-mat-700 text-white p-5 pl-16 rounded-2xl outline-none focus:border-mat-500 transition-all font-bold text-sm uppercase" />
                      </div>
                      <div className="flex gap-4 items-center">
                         <div className="text-right">
                            <span className="block text-2xl font-black text-white font-exo leading-none">{guestList.filter(g => g.checkedIn).length} / {guestList.length}</span>
                            <span className="text-[9px] font-black uppercase text-gray-600 tracking-widest">Asistentes Check-In</span>
                         </div>
                      </div>
                   </div>
                   <div className="p-10 overflow-y-auto max-h-[60vh] custom-scrollbar grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {guestList.filter(g => g.name.toLowerCase().includes(guestSearch.toLowerCase())).map((guest, i) => (
                        <button key={i} onClick={() => toggleDoorCheck(guest.name)} className={`p-6 border-2 rounded-2xl flex items-center justify-between transition-all group ${guest.checkedIn ? 'bg-green-500/10 border-green-500' : 'bg-mat-800 border-mat-700 hover:border-mat-500'}`}>
                           <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs ${guest.checkedIn ? 'bg-green-500 text-white' : 'bg-mat-900 text-gray-500'}`}>{guest.name[0]}</div>
                              <div className="text-left">
                                 <h5 className={`font-black uppercase text-xs tracking-tight ${guest.checkedIn ? 'text-white' : 'text-gray-400'}`}>{guest.name}</h5>
                                 {guest.timestamp && <span className="text-[8px] font-bold text-green-500 uppercase">{guest.timestamp}</span>}
                              </div>
                           </div>
                           {guest.checkedIn ? <CheckCircle className="text-green-500" /> : <div className="w-6 h-6 rounded-full border-2 border-mat-700 group-hover:border-mat-500"></div>}
                        </button>
                      ))}
                   </div>
                </div>
             ) : (
                <div className="flex flex-col items-center justify-center py-40 opacity-20 text-center">
                   <UserCheck className="w-24 h-24 mb-8" />
                   <h3 className="text-4xl font-black uppercase font-exo">Selecciona un evento activo.</h3>
                </div>
             )}
          </div>
        )}

        {/* CONNECTIVITY STATUS TAB */}
        {activeTab === 'connectors' && (
          <div className="space-y-12 animate-fade-in">
             <h2 className="text-5xl lg:text-7xl font-black uppercase font-exo tracking-tighter leading-none mb-4">CONNECTIVITY <span className="text-mat-500">STATUS.</span></h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {connectors.map(c => (
                  <div key={c.id} className="bg-mat-900 border border-mat-800 p-10 rounded-[3rem] shadow-xl flex items-center justify-between hover:border-mat-500 transition-all">
                     <div className="flex items-center gap-8">
                        <div className={`w-4 h-4 rounded-full ${c.status === 'online' ? 'bg-green-500 shadow-[0_0_20px_#22c55e]' : 'bg-orange-500 animate-pulse'}`}></div>
                        <div>
                           <h4 className="text-white font-black uppercase text-xl tracking-tighter font-exo">{c.name}</h4>
                           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-600 mt-2">
                              <Activity size={14} /> Latency: {c.latency}
                           </div>
                        </div>
                     </div>
                     <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${c.status === 'online' ? 'border-green-500 text-green-500' : 'border-orange-500 text-orange-500'}`}>{c.status}</span>
                  </div>
                ))}
             </div>
             
             <div className="p-12 bg-mat-950 border border-mat-800 rounded-[3.5rem] shadow-xl space-y-8">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter font-exo flex items-center gap-4"><Terminal className="text-mat-500" /> SYSTEM CONSOLE</h3>
                <div className="bg-black p-8 rounded-3xl font-mono text-[11px] text-green-500 leading-relaxed overflow-x-auto shadow-inner border border-mat-900">
                   <p className="opacity-50">[09:21:04] MAT32_CORE INIT_BOOT_SEQUENCE... OK</p>
                   <p className="opacity-50">[09:21:05] SENSORS_CHECK: ALL_SYSTEMS_GO</p>
                   <p>[09:24:12] CRM_SIGNAL: NUEVO LEAD DETECTADO DE "ALEX V."</p>
                   <p className="text-yellow-500">[09:28:55] WARN: INSTAGRAM_GRAPH_TIMEOUT_DETECTED (RETRYING...)</p>
                   <p>[09:32:00] STRIPE_BRIDGE: TRANSACCIÓN COMPLETADA ID:TX_99123</p>
                   <div className="w-3 h-5 bg-green-500 animate-pulse inline-block align-middle ml-2"></div>
                </div>
             </div>
          </div>
        )}

      </main>

      {/* Editor Modal for Records & Events */}
      {(editingItem && editType) && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-2xl animate-fade-in overflow-y-auto">
           <div className="w-full max-w-4xl bg-mat-900 border-2 border-mat-800 p-10 lg:p-16 rounded-[4rem] shadow-2xl relative my-auto">
              <button onClick={() => { setEditingItem(null); setEditType(null); }} className="absolute top-10 right-10 text-gray-500 hover:text-white transition-all"><X size={32} /></button>
              <h2 className="text-4xl lg:text-5xl font-black text-white uppercase mb-12 tracking-tighter font-exo">
                 {editingItem.id ? 'Edit' : 'Create'} <span className="text-mat-500">{editType === 'record' ? 'Vinyl' : 'Event'}</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
                 {/* Left Column */}
                 <div className="space-y-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-2">Título Principal</label>
                       <input value={editingItem.title} onChange={e => setEditingItem({...editingItem, title: e.target.value})} className="w-full bg-mat-800 border-2 border-mat-700 p-6 text-white uppercase text-xs font-black rounded-2xl outline-none focus:border-mat-500 transition-all shadow-inner" placeholder="TÍTULO" />
                    </div>
                    {editType === 'record' ? (
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-2">Artista</label>
                          <input value={editingItem.artist} onChange={e => setEditingItem({...editingItem, artist: e.target.value})} className="w-full bg-mat-800 border-2 border-mat-700 p-6 text-white uppercase text-xs font-black rounded-2xl outline-none focus:border-mat-500 transition-all shadow-inner" placeholder="ARTISTA" />
                       </div>
                    ) : (
                       <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-2">Fecha</label>
                             <input value={editingItem.date} onChange={e => setEditingItem({...editingItem, date: e.target.value})} className="w-full bg-mat-800 border-2 border-mat-700 p-6 text-white uppercase text-xs font-black rounded-2xl outline-none focus:border-mat-500" placeholder="YYYY-MM-DD" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-2">Hora</label>
                             <input value={editingItem.time} onChange={e => setEditingItem({...editingItem, time: e.target.value})} className="w-full bg-mat-800 border-2 border-mat-700 p-6 text-white uppercase text-xs font-black rounded-2xl outline-none focus:border-mat-500" placeholder="20:00" />
                          </div>
                       </div>
                    )}
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-2">Precio (€)</label>
                          <input type="number" value={editingItem.price} onChange={e => setEditingItem({...editingItem, price: Number(e.target.value)})} className="w-full bg-mat-800 border-2 border-mat-700 p-6 text-white text-xs font-black rounded-2xl outline-none focus:border-mat-500" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-2">Categoría</label>
                          <input value={editType === 'record' ? editingItem.genre : editingItem.category} onChange={e => setEditingItem({...editingItem, [editType === 'record' ? 'genre' : 'category']: e.target.value})} className="w-full bg-mat-800 border-2 border-mat-700 p-6 text-white uppercase text-xs font-black rounded-2xl outline-none focus:border-mat-500" />
                       </div>
                    </div>
                 </div>

                 {/* Right Column */}
                 <div className="space-y-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-2">Imagen / Cover URL</label>
                       <input value={editType === 'record' ? editingItem.coverUrl : editingItem.imageUrl} onChange={e => setEditingItem({...editingItem, [editType === 'record' ? 'coverUrl' : 'imageUrl']: e.target.value})} className="w-full bg-mat-800 border-2 border-mat-700 p-6 text-white text-xs font-bold rounded-2xl outline-none focus:border-mat-500" placeholder="https://..." />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-2">Descripción</label>
                       <textarea value={editingItem.description} onChange={e => setEditingItem({...editingItem, description: e.target.value})} className="w-full bg-mat-800 border-2 border-mat-700 p-8 h-48 text-white text-xs font-medium rounded-[2rem] outline-none focus:border-mat-500 resize-none italic leading-relaxed" placeholder="Info adicional..."></textarea>
                    </div>
                 </div>
              </div>

              <div className="mt-16 pt-10 border-t border-mat-800 flex flex-col sm:flex-row justify-end gap-6">
                 <button onClick={() => { setEditingItem(null); setEditType(null); }} className="px-12 py-6 text-gray-500 hover:text-white font-black uppercase text-[11px] tracking-widest transition-all">Cancelar</button>
                 <button onClick={saveItem} className="px-16 py-6 bg-mat-500 text-white font-black uppercase text-[11px] tracking-[0.3em] rounded-3xl shadow-xl hover:bg-mat-400 active:scale-95 transition-all flex items-center justify-center gap-4"><Save size={20} /> Guardar Cambios</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
