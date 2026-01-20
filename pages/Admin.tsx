
import React, { useState, useEffect } from 'react';
import { 
  Disc, Calendar as CalendarIcon, Loader2, Trash2, Edit3,
  Activity, Terminal, Plus, X, LogOut, Inbox, Settings, 
  AlertTriangle, CheckCircle2, MessageSquare, Users, 
  ShoppingBag, Zap, ShieldCheck, Search, Eye, Save, 
  Mail, Archive, Check, UserPlus, UserCheck, Smartphone,
  ExternalLink, BarChart3, TrendingUp, Clock, Menu, ChevronRight
} from 'lucide-react';
import { dataService, InboxMessage, AnalyticsData, ConnectorStatus, GuestEntry } from '../services/dataService';
import { VinylRecord, Event, Post } from '../types';

type AdminTab = 'dashboard' | 'inbox' | 'inventory' | 'door' | 'community' | 'connectors' | 'settings';
type InventorySubTab = 'records' | 'events';

export const Admin: React.FC = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [pin, setPin] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [invTab, setInvTab] = useState<InventorySubTab>('records');
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Estado para el menú plegable
  
  // Data States
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [inbox, setInbox] = useState<InboxMessage[]>([]);
  const [records, setRecords] = useState<VinylRecord[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [connectors, setConnectors] = useState<ConnectorStatus[]>([]);

  // Door Control State
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [guestSearch, setGuestSearch] = useState('');
  const [guestList, setGuestList] = useState<GuestEntry[]>([]);
  const [manualGuestName, setManualGuestName] = useState('');

  // Editing State
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [an, inb, rec, ev, pst] = await Promise.all([
        dataService.getAdvancedAnalytics(),
        dataService.getInbox(),
        dataService.getRecords(),
        dataService.getEvents(),
        dataService.getCommunityPosts()
      ]);
      setAnalytics(an);
      setInbox(inb);
      setRecords(rec);
      setEvents(ev);
      setPosts(pst);
      setConnectors(dataService.getConnectors());
      
      if (selectedEventId) {
        const list = await dataService.getEventGuestList(selectedEventId);
        setGuestList(list);
      } else if (ev.length > 0 && !selectedEventId) {
        setSelectedEventId(ev[0].id);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dataService.isAuthenticated()) { setIsAuth(true); loadData(); }
    window.addEventListener('mat32_data_changed', loadData);
    return () => window.removeEventListener('mat32_data_changed', loadData);
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      dataService.getEventGuestList(selectedEventId).then(setGuestList);
    }
  }, [selectedEventId]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await dataService.authenticate(pin)) { setIsAuth(true); loadData(); }
    else { alert("PIN INVÁLIDO (3232)"); setPin(''); }
  };

  const handleAction = async (type: string, id: string, extra?: any) => {
    setLoading(true);
    if (type === 'delete_record') await dataService.deleteRecord(id);
    if (type === 'delete_event') await dataService.deleteEvent(id);
    if (type === 'delete_post') await dataService.deletePost(id);
    if (type === 'delete_msg') await dataService.deleteMessage(id);
    if (type === 'msg_status') await dataService.updateMessageStatus(id, extra);
    if (type === 'check_in') await dataService.toggleCheckIn(selectedEventId, id);
    if (type === 'add_manual_guest') {
      await dataService.addManualGuest(selectedEventId, manualGuestName);
      setManualGuestName('');
    }
    await loadData();
  };

  const handleSaveItem = async () => {
    if (!editingItem) return;
    setLoading(true);
    const isNew = !editingItem.id;
    if (invTab === 'records') {
      isNew ? await dataService.createRecord(editingItem) : await dataService.updateRecord(editingItem);
    } else {
      isNew ? await dataService.createEvent(editingItem) : await dataService.updateEvent(editingItem);
    }
    setEditingItem(null);
    await loadData();
  };

  const selectTab = (tab: AdminTab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false); // Cerrar sidebar al elegir en móvil
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-[#0c0a09] flex items-center justify-center p-6 font-mono">
        <div className="w-full max-w-md bg-mat-900 border-2 border-mat-800 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-mat-500"></div>
           <Terminal className="w-12 h-12 text-mat-500 mx-auto mb-6" />
           <h1 className="text-white text-center text-xl font-black uppercase tracking-[0.4em] mb-10">MAT32 SYSTEM</h1>
           <form onSubmit={handleLogin} className="space-y-6">
              <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} className="w-full bg-mat-800 border-2 border-mat-700 text-white text-center p-6 text-2xl tracking-[0.8em] rounded-2xl outline-none focus:border-mat-500" placeholder="PIN" autoFocus />
              <button type="submit" className="w-full py-5 bg-mat-500 text-white font-black uppercase rounded-2xl hover:bg-mat-400 transition-all shadow-xl">AUTHENTICATE</button>
           </form>
           <p className="text-center text-gray-700 text-[10px] mt-8 uppercase font-black tracking-widest opacity-50">Authorized Personnel Only</p>
        </div>
      </div>
    );
  }

  const filteredGuests = guestList.filter(g => g.name.toLowerCase().includes(guestSearch.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#0c0a09] text-mat-cream flex flex-col md:flex-row font-sans relative overflow-hidden">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-mat-900 border-b border-mat-800 h-20 px-6 flex items-center justify-between sticky top-0 z-[100]">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-mat-500 w-6 h-6" />
          <span className="font-black uppercase tracking-widest text-xs">CORE <span className="text-mat-500">SYSTEM</span></span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-3 bg-mat-800 rounded-xl text-mat-500 hover:text-white transition-colors shadow-lg"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation - Collapsible */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-[90] h-full w-80 bg-mat-900 border-r border-mat-800 flex flex-col 
        transition-transform duration-500 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-8 border-b border-mat-800 hidden md:flex items-center gap-4">
           <ShieldCheck className="text-mat-500 w-8 h-8" />
           <div>
              <h1 className="text-lg font-black uppercase tracking-tighter leading-none">MAT32 <span className="text-mat-500">CORE</span></h1>
              <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mt-1">v2.1 CRM SYSTEM</p>
           </div>
        </div>

        {/* Mobile Sidebar Brand Info */}
        <div className="p-8 border-b border-mat-800 md:hidden bg-mat-900/50">
           <p className="text-[10px] font-black text-mat-500 uppercase tracking-[0.4em] mb-1">MÓDULO DE TRABAJO</p>
           <h2 className="text-2xl font-black text-white uppercase tracking-tighter font-exo">{activeTab.toUpperCase()}</h2>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
           {[
             { id: 'dashboard', label: 'Panel Control', icon: <BarChart3 size={18} /> },
             { id: 'inbox', label: 'Bandeja Inbox', icon: <Inbox size={18} />, count: inbox.filter(m => m.status === 'pending').length },
             { id: 'inventory', label: 'Inventario Shop', icon: <ShoppingBag size={18} /> },
             { id: 'door', label: 'Control Puerta', icon: <UserCheck size={18} /> },
             { id: 'community', label: 'Moderación Hub', icon: <MessageSquare size={18} /> },
             { id: 'connectors', label: 'Status Protocol', icon: <Activity size={18} /> },
           ].map(item => (
             <button 
               key={item.id} 
               onClick={() => selectTab(item.id as AdminTab)}
               className={`w-full flex items-center justify-between p-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-mat-500 text-white shadow-xl translate-x-2' : 'text-gray-500 hover:bg-mat-800 hover:text-white'}`}
             >
                <div className="flex items-center gap-3">{item.icon} {item.label}</div>
                <div className="flex items-center gap-2">
                   {item.count ? <span className="bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-[9px]">{item.count}</span> : null}
                   <ChevronRight size={14} className={`transition-opacity ${activeTab === item.id ? 'opacity-100' : 'opacity-0'}`} />
                </div>
             </button>
           ))}
        </nav>

        <div className="p-6 border-t border-mat-800 flex flex-col gap-4 bg-mat-950/20">
           <button onClick={() => selectTab('settings')} className={`w-full flex items-center gap-3 p-3 rounded-xl text-[10px] font-black uppercase transition-colors ${activeTab === 'settings' ? 'text-mat-500 bg-mat-800' : 'text-gray-600 hover:text-white'}`}><Settings size={16} /> Configuración</button>
           <button onClick={() => { dataService.logout(); setIsAuth(false); }} className="w-full flex items-center gap-3 p-3 rounded-xl text-[10px] font-black uppercase text-gray-600 hover:text-red-500 transition-colors"><LogOut size={16} /> Cerrar Sesión</button>
        </div>
      </aside>

      {/* Mobile Overlay - Closes sidebar when clicking content */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-80 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen overflow-y-auto p-6 md:p-12 custom-scrollbar bg-[radial-gradient(circle_at_top_right,_#1c1917_0%,_#0c0a09_100%)]">
        
        {loading && <div className="fixed top-24 md:top-8 right-6 md:right-12 z-[200]"><Loader2 className="animate-spin text-mat-500 w-8 h-8" /></div>}

        <div className="animate-fade-in max-w-6xl mx-auto space-y-12">

          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-12">
               <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-4xl md:text-5xl font-black uppercase font-exo tracking-tighter">Dashboard.</h2>
                    <p className="text-gray-500 text-sm mt-2 italic">Estado general del sistema y métricas.</p>
                  </div>
                  <div className="hidden lg:flex items-center gap-3 bg-mat-900 border border-mat-800 p-4 rounded-2xl">
                     <Clock className="text-mat-500" size={18} />
                     <span className="text-[10px] font-black uppercase tracking-widest text-white">{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {[
                    { label: 'Revenue Shop', val: `€${analytics?.totalRevenue}`, icon: <Zap className="text-mat-500" />, trend: '+12%' },
                    { label: 'Entradas Hoy', val: analytics?.ticketSales, icon: <Users className="text-mat-500" />, trend: 'Full' },
                    { label: 'Followers IG', val: analytics?.instagramStatus.followers, icon: <Smartphone className="text-mat-500" />, trend: 'Rising' },
                    { label: 'Hub Activo', val: analytics?.communityActiveUsers, icon: <MessageSquare className="text-mat-500" />, trend: 'Hot' }
                  ].map((card, i) => (
                    <div key={i} className="bg-mat-900 border border-mat-800 p-6 md:p-8 rounded-[2rem] shadow-xl hover:border-mat-500/30 transition-all group">
                       <div className="flex justify-between items-start mb-6">
                          <div className="p-3 bg-mat-800 rounded-2xl group-hover:scale-110 transition-transform">{card.icon}</div>
                          <span className="text-[9px] font-black text-green-500 uppercase flex items-center gap-1"><TrendingUp size={10} /> {card.trend}</span>
                       </div>
                       <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{card.label}</p>
                       <p className="text-3xl md:text-4xl font-black text-white font-exo">{card.val}</p>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* TAB: INBOX (CRM) */}
          {activeTab === 'inbox' && (
            <div className="space-y-8">
               <h2 className="text-4xl md:text-5xl font-black uppercase font-exo tracking-tighter">Buzón CRM.</h2>
               <div className="space-y-4">
                  {inbox.length === 0 ? (
                    <div className="py-20 text-center border-4 border-dashed border-mat-800 rounded-[3rem] text-gray-700 font-black uppercase tracking-widest text-xs">Bandeja Vacía</div>
                  ) : inbox.map(msg => (
                    <div key={msg.id} className={`bg-mat-900 border-2 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] flex flex-col md:flex-row gap-6 md:gap-8 items-start transition-all ${msg.status === 'pending' ? 'border-mat-500 shadow-[0_0_30px_rgba(234,88,12,0.1)]' : 'border-mat-800 opacity-60'}`}>
                       <div className="flex-1 w-full min-w-0">
                          <div className="flex flex-wrap items-center gap-3 mb-4">
                             <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-full text-white ${msg.type === 'booking' ? 'bg-green-600' : msg.type === 'artist' ? 'bg-mat-500' : 'bg-blue-600'}`}>{msg.type}</span>
                             <span className="text-white font-black uppercase text-sm truncate max-w-[120px]">@{msg.sender}</span>
                             <span className="text-[9px] text-gray-600 font-bold ml-auto">{msg.date}</span>
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">"{msg.content}"</p>
                          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                             <span className="flex items-center gap-2 truncate"><Mail size={12} className="text-mat-500 flex-shrink-0" /> {msg.email}</span>
                             {msg.phone && <span className="flex items-center gap-2 truncate"><Smartphone size={12} className="text-mat-500 flex-shrink-0" /> {msg.phone}</span>}
                          </div>
                       </div>
                       <div className="flex md:flex-col gap-2 w-full md:w-auto mt-4 md:mt-0">
                          {msg.status === 'pending' ? (
                            <button onClick={() => handleAction('msg_status', msg.id, 'read')} className="flex-1 md:flex-none p-4 bg-mat-800 text-green-500 hover:bg-green-500 hover:text-white rounded-xl md:rounded-2xl transition-all shadow-xl flex justify-center" title="Marcar como atendido"><Check /></button>
                          ) : (
                            <button onClick={() => handleAction('msg_status', msg.id, 'pending')} className="flex-1 md:flex-none p-4 bg-mat-800 text-gray-500 hover:bg-mat-500 hover:text-white rounded-xl md:rounded-2xl transition-all shadow-xl flex justify-center"><Archive /></button>
                          )}
                          <button onClick={() => handleAction('delete_msg', msg.id)} className="flex-1 md:flex-none p-4 bg-mat-800 text-red-500 hover:bg-red-500 hover:text-white rounded-xl md:rounded-2xl transition-all shadow-xl flex justify-center"><Trash2 /></button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* TAB: DOOR CONTROL */}
          {activeTab === 'door' && (
             <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                   <div>
                      <h2 className="text-4xl md:text-5xl font-black uppercase font-exo tracking-tighter">Control de Puerta.</h2>
                      <p className="text-gray-500 text-sm mt-2 italic">Validación de Guest List en tiempo real.</p>
                   </div>
                   <select 
                     value={selectedEventId} 
                     onChange={(e) => setSelectedEventId(e.target.value)}
                     className="w-full md:w-auto bg-mat-900 border-2 border-mat-800 p-4 text-white uppercase text-[10px] font-black rounded-2xl outline-none focus:border-mat-500"
                   >
                      {events.map(ev => <option key={ev.id} value={ev.id}>{ev.date} - {ev.title}</option>)}
                   </select>
                </div>

                <div className="bg-mat-900 border-2 border-mat-800 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl">
                   <div className="p-6 md:p-8 border-b border-mat-800 bg-mat-800/30 flex flex-col lg:flex-row gap-6 items-center">
                      <div className="relative flex-1 w-full">
                         <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                         <input 
                           type="text" 
                           placeholder="BUSCAR NOMBRE / ALIAS..." 
                           value={guestSearch}
                           onChange={(e) => setGuestSearch(e.target.value)}
                           className="w-full bg-mat-800 border-2 border-mat-700 p-5 pl-12 text-white uppercase text-xs font-black rounded-xl md:rounded-2xl focus:border-mat-500 outline-none"
                         />
                      </div>
                      <div className="flex gap-2 w-full lg:w-auto">
                         <input 
                           placeholder="VIP MANUAL" 
                           value={manualGuestName}
                           onChange={(e) => setManualGuestName(e.target.value)}
                           className="flex-1 bg-mat-800 border-2 border-mat-700 p-5 text-white uppercase text-[10px] font-black rounded-xl md:rounded-2xl outline-none"
                         />
                         <button 
                           onClick={() => handleAction('add_manual_guest', '')}
                           disabled={!manualGuestName}
                           className="p-5 bg-mat-500 text-white rounded-xl md:rounded-2xl disabled:opacity-30 hover:bg-mat-400 transition-all shadow-xl"
                         >
                           <UserPlus size={20} />
                         </button>
                      </div>
                   </div>

                   <div className="max-h-[60vh] md:max-h-[500px] overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 custom-scrollbar">
                      {filteredGuests.length === 0 ? (
                        <div className="col-span-full py-20 text-center text-gray-700 font-black uppercase text-xs">Sin resultados en lista</div>
                      ) : filteredGuests.map((guest, idx) => (
                        <div key={idx} className={`p-5 md:p-6 rounded-[1.5rem] border-2 flex items-center justify-between transition-all ${guest.checkedIn ? 'bg-green-500/10 border-green-500/50 shadow-inner' : 'bg-mat-800 border-mat-700'}`}>
                           <div className="min-w-0 flex-1">
                              <p className={`text-sm font-black uppercase tracking-tighter truncate ${guest.checkedIn ? 'text-green-500 line-through opacity-50' : 'text-white'}`}>{guest.name}</p>
                              {guest.checkedIn && <p className="text-[8px] font-bold text-green-500 uppercase mt-1">Check-in: {guest.timestamp}</p>}
                           </div>
                           <button 
                             onClick={() => handleAction('check_in', guest.name)}
                             className={`p-3 rounded-xl transition-all shadow-lg flex-shrink-0 ml-4 ${guest.checkedIn ? 'bg-green-500 text-white' : 'bg-mat-900 text-gray-500 hover:text-mat-500'}`}
                           >
                             <CheckCircle2 size={18} />
                           </button>
                        </div>
                      ))}
                   </div>
                   <div className="p-6 bg-mat-800/30 border-t border-mat-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
                      <div className="flex gap-6 md:gap-8">
                         <span className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase">LISTA: {guestList.length}</span>
                         <span className="text-[9px] md:text-[10px] font-black text-green-500 uppercase">SALA: {guestList.filter(g => g.checkedIn).length}</span>
                      </div>
                      <span className="text-[9px] md:text-[10px] font-black text-mat-500 uppercase tracking-widest">AFORO REAL: {((guestList.filter(g => g.checkedIn).length / 100) * 100).toFixed(0)}%</span>
                   </div>
                </div>
             </div>
          )}

          {/* TAB: INVENTORY */}
          {activeTab === 'inventory' && (
            <div className="space-y-10">
               <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12">
                  <div className="w-full">
                    <h2 className="text-4xl md:text-5xl font-black uppercase font-exo tracking-tighter leading-none">Inventario.</h2>
                    <div className="flex bg-mat-900 p-1.5 rounded-2xl border border-mat-800 mt-6 overflow-x-auto no-scrollbar">
                      {(['records', 'events'] as InventorySubTab[]).map(tab => (
                        <button key={tab} onClick={() => setInvTab(tab)} className={`flex-1 sm:flex-none px-8 md:px-12 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${invTab === tab ? 'bg-mat-500 text-white shadow-lg' : 'text-gray-600 hover:text-white'}`}>{tab}</button>
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={() => setEditingItem({})}
                    className="w-full lg:w-auto px-10 py-6 bg-mat-500 hover:bg-mat-400 text-white font-black uppercase text-[11px] tracking-widest rounded-2xl shadow-xl flex items-center justify-center gap-4 group"
                  >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> Subir {invTab.slice(0, -1)}
                  </button>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {invTab === 'records' && records.map(r => (
                    <div key={r.id} className="bg-mat-900 border-2 border-mat-800 p-5 rounded-[2rem] flex gap-5 hover:border-mat-500 transition-all shadow-xl group">
                       <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl md:rounded-2xl overflow-hidden flex-shrink-0 bg-black shadow-lg">
                          <img src={r.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                       </div>
                       <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                          <div>
                            <h4 className="text-white font-black uppercase text-xs md:text-sm truncate tracking-tighter">{r.title}</h4>
                            <p className="text-mat-500 text-[9px] font-bold truncate">@{r.artist}</p>
                            <p className="text-gray-600 text-[9px] font-black uppercase mt-1">€{r.price} • {r.genre}</p>
                          </div>
                          <div className="flex gap-2 mt-2">
                             <button onClick={() => setEditingItem(r)} className="p-2 bg-mat-800 text-gray-400 hover:text-white rounded-lg transition-all"><Edit3 size={14} /></button>
                             <button onClick={() => handleAction('delete_record', r.id)} className="p-2 bg-mat-800 text-red-500/50 hover:text-red-500 rounded-lg transition-all"><Trash2 size={14} /></button>
                          </div>
                       </div>
                    </div>
                  ))}

                  {invTab === 'events' && events.map(e => (
                    <div key={e.id} className="bg-mat-900 border-2 border-mat-800 p-6 md:p-8 rounded-[2rem] flex flex-col gap-6 hover:border-mat-500 transition-all shadow-xl group">
                       <div className="flex gap-5 items-center">
                          <div className="w-16 h-16 md:w-20 md:h-20 bg-black rounded-xl md:rounded-2xl overflow-hidden shadow-lg border border-mat-800">
                             <img src={e.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-all" />
                          </div>
                          <div className="flex-1 min-w-0">
                             <h4 className="text-white font-black uppercase text-sm md:text-base truncate tracking-tighter leading-none">{e.title}</h4>
                             <p className="text-mat-500 text-[9px] font-black uppercase mt-2 tracking-widest">{e.date} @ {e.time}</p>
                          </div>
                       </div>
                       <div className="flex items-center justify-between border-t border-mat-800 pt-6">
                          <div className="flex gap-2">
                             <button onClick={() => setEditingItem(e)} className="p-2.5 bg-mat-800 text-gray-500 hover:text-white rounded-xl"><Edit3 size={15} /></button>
                             <button onClick={() => handleAction('delete_event', e.id)} className="p-2.5 bg-mat-800 text-red-500/30 hover:text-red-500 rounded-xl"><Trash2 size={15} /></button>
                          </div>
                          <button onClick={() => { setSelectedEventId(e.id); selectTab('door'); }} className="text-[9px] font-black text-mat-500 hover:underline flex items-center gap-2 uppercase tracking-widest"><Users size={14} /> Gestión Puerta</button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* TAB: COMMUNITY MODERATION */}
          {activeTab === 'community' && (
             <div className="space-y-12">
                <h2 className="text-4xl md:text-5xl font-black uppercase font-exo tracking-tighter">Gestión del Hub.</h2>
                <div className="space-y-6">
                   {posts.map(post => (
                     <div key={post.id} className="bg-mat-900 border-2 border-mat-800 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-xl">
                        <div className="p-8 md:p-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                           <div className="w-14 h-14 md:w-16 md:h-16 bg-mat-500 rounded-full flex items-center justify-center text-white font-black text-xl shadow-2xl flex-shrink-0">{post.author[0].toUpperCase()}</div>
                           <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-4 mb-4">
                                 <h4 className="text-white font-black uppercase text-sm md:text-base tracking-tighter">@{post.author}</h4>
                                 <span className="text-gray-600 text-[9px] font-bold uppercase">{post.timestamp}</span>
                              </div>
                              <p className="text-gray-300 italic text-sm leading-relaxed mb-6">"{post.content}"</p>
                              {post.imageUrl && (
                                <div className="mt-4 rounded-xl md:rounded-2xl overflow-hidden border border-mat-800 opacity-50 h-32 w-full max-w-sm"><img src={post.imageUrl} className="w-full h-full object-cover" /></div>
                              )}
                           </div>
                           <button onClick={() => handleAction('delete_post', post.id)} className="w-full md:w-auto p-5 md:p-6 bg-mat-800 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl md:rounded-3xl transition-all shadow-xl flex justify-center"><Trash2 size={24} /></button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          )}

          {/* TAB: CONNECTORS */}
          {activeTab === 'connectors' && (
             <div className="space-y-12">
                <h2 className="text-4xl md:text-5xl font-black uppercase font-exo tracking-tighter leading-none">Protocol Status.</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                   {connectors.map(c => (
                     <div key={c.id} className="bg-mat-900 border-2 border-mat-800 p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] flex items-center justify-between shadow-2xl hover:border-mat-700 transition-all group">
                        <div className="flex items-center gap-6 md:gap-8 min-w-0">
                           <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.3)] flex-shrink-0 ${c.status === 'online' ? 'bg-green-500' : c.status === 'warning' ? 'bg-orange-500' : 'bg-red-500'} animate-pulse`}></div>
                           <div className="min-w-0">
                              <h4 className="text-white font-black uppercase tracking-[0.3em] text-[11px] md:text-sm truncate">{c.name}</h4>
                              <p className="text-[8px] md:text-[9px] font-black text-gray-600 uppercase tracking-widest mt-2 flex items-center gap-2"><Zap size={10} className="text-mat-500" /> Ping: {c.latency}</p>
                           </div>
                        </div>
                        <Activity size={22} className={`flex-shrink-0 ${c.status === 'online' ? 'text-green-500/40' : 'text-gray-800'}`} />
                     </div>
                   ))}
                </div>
             </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
             <div className="bg-mat-900 border-4 border-red-900/20 p-10 md:p-16 rounded-[2.5rem] md:rounded-[4rem] max-w-2xl mx-auto text-center shadow-[0_40px_100px_rgba(220,38,38,0.05)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-red-600"></div>
                <AlertTriangle className="text-red-600/80 w-20 h-20 md:w-24 md:h-24 mx-auto mb-8" />
                <h3 className="text-3xl md:text-4xl font-black text-white uppercase mb-6 font-exo tracking-tighter">Zona Crítica.</h3>
                <p className="text-gray-500 italic text-sm md:text-base mb-12 leading-relaxed">Esta acción realizará un borrado atómico de la base de datos local y restaurará los valores de fábrica. Todo el inventario personalizado y la Guest List se perderán de forma permanente.</p>
                <button onClick={() => { if(window.confirm('¿ELIMINAR TODO EL SISTEMA?')) { dataService.clearDatabase(); window.location.reload(); } }} className="w-full sm:w-auto px-12 py-6 bg-red-600 text-white font-black uppercase tracking-[0.4em] rounded-xl hover:bg-red-500 transition-all flex items-center justify-center gap-4 mx-auto shadow-2xl text-[10px]">
                   <Trash2 size={18} /> RESET DATA ENGINE
                </button>
             </div>
          )}
        </div>
      </main>

      {/* ITEM EDITOR MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-black/98 backdrop-blur-3xl animate-fade-in overflow-y-auto">
           <div className="w-full max-w-2xl bg-mat-900 border-2 border-mat-800 p-8 md:p-16 rounded-[3rem] md:rounded-[4rem] shadow-2xl relative my-10 border-mat-500/20">
              <button onClick={() => setEditingItem(null)} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"><X size={32} /></button>
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase mb-10 tracking-tighter font-exo">{editingItem.id ? 'Editar' : 'Subir'} {invTab === 'records' ? 'Disco' : 'Evento'}</h2>
              
              <div className="space-y-6 md:space-y-8">
                 <div className="space-y-2">
                   <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-1">Título / Sesión</label>
                   <input value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} className="w-full bg-mat-800 border-2 border-mat-700 p-5 md:p-6 text-white uppercase text-xs font-black rounded-2xl md:rounded-3xl outline-none focus:border-mat-500 transition-all shadow-inner" placeholder="EJ: NEW ROMANTIC DISCO" />
                 </div>

                 {invTab === 'records' ? (
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-1">Artista / Sello</label>
                        <input value={editingItem.artist || ''} onChange={e => setEditingItem({...editingItem, artist: e.target.value})} className="w-full bg-mat-800 border-2 border-mat-700 p-5 text-white uppercase text-xs font-black rounded-xl md:rounded-2xl outline-none focus:border-mat-500" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-1">Precio (€)</label>
                        <input type="number" value={editingItem.price || 0} onChange={e => setEditingItem({...editingItem, price: Number(e.target.value)})} className="w-full bg-mat-800 border-2 border-mat-700 p-5 text-white uppercase text-xs font-black rounded-xl md:rounded-2xl outline-none focus:border-mat-500" />
                      </div>
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-1">Fecha Evento</label>
                        <input type="date" value={editingItem.date || ''} onChange={e => setEditingItem({...editingItem, date: e.target.value})} className="w-full bg-mat-800 border-2 border-mat-700 p-5 text-white uppercase text-xs font-black rounded-xl md:rounded-2xl" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-1">Ticket Entry (€)</label>
                        <input type="number" value={editingItem.price || 0} onChange={e => setEditingItem({...editingItem, price: Number(e.target.value)})} className="w-full bg-mat-800 border-2 border-mat-700 p-5 text-white uppercase text-xs font-black rounded-xl md:rounded-2xl" />
                      </div>
                   </div>
                 )}

                 <div className="space-y-2">
                   <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-1">Source URL (IMG)</label>
                   <input value={editingItem.coverUrl || editingItem.imageUrl || ''} onChange={e => setEditingItem({...editingItem, coverUrl: e.target.value, imageUrl: e.target.value})} className="w-full bg-mat-800 border-2 border-mat-700 p-5 text-white text-[10px] rounded-xl md:rounded-2xl outline-none focus:border-mat-500" placeholder="https://images..." />
                 </div>

                 <div className="space-y-2">
                   <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-1">Información Extendida</label>
                   <textarea value={editingItem.description || ''} onChange={e => setEditingItem({...editingItem, description: e.target.value})} className="w-full bg-mat-800 border-2 border-mat-700 p-6 text-white text-xs font-bold rounded-2xl md:rounded-3xl outline-none focus:border-mat-500 h-32 resize-none italic shadow-inner" />
                 </div>

                 <button onClick={handleSaveItem} className="w-full py-7 md:py-8 bg-mat-500 text-white font-black uppercase tracking-[0.4em] rounded-[1.5rem] md:rounded-[2rem] shadow-2xl hover:bg-mat-400 transition-all flex items-center justify-center gap-4 group text-xs">
                    <Save size={18} className="group-hover:translate-y-[-2px] transition-transform" /> {editingItem.id ? 'ACTUALIZAR DATOS' : 'PUBLICAR EN CORE'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
