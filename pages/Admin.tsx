
import React, { useState, useEffect, useRef } from 'react';
import { 
  Disc, Calendar as CalendarIcon, Loader2, Trash2, Edit3,
  Activity, Terminal, Plus, X, LogOut, Inbox, Settings, 
  AlertTriangle, CheckCircle2, MessageSquare, Users, 
  ShoppingBag, Zap, ShieldCheck, Search, Eye, Save, 
  Mail, Archive, Check, UserPlus, UserCheck, Smartphone,
  ExternalLink, BarChart3, TrendingUp, Clock, Menu, ChevronRight, 
  Send, Reply, Filter, History
} from 'lucide-react';
import { dataService, InboxMessage, AnalyticsData, ConnectorStatus, GuestEntry, MessageReply } from '../services/dataService';
import { VinylRecord, Event, Post, SelectorSubmission } from '../types';

type AdminTab = 'dashboard' | 'inbox' | 'inventory' | 'door' | 'connectors' | 'settings';
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
  const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [inboxFilter, setInboxFilter] = useState<'all' | 'pending' | 'read' | 'archived'>('all');

  const [records, setRecords] = useState<VinylRecord[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectors, setSelectors] = useState<SelectorSubmission[]>([]);
  const [connectors, setConnectors] = useState<ConnectorStatus[]>([]);

  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [guestSearch, setGuestSearch] = useState('');
  const [guestList, setGuestList] = useState<GuestEntry[]>([]);
  const [manualGuestName, setManualGuestName] = useState('');

  const [editingItem, setEditingItem] = useState<any | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

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
      
      if (selectedMessage) {
        const updatedMsg = inb.find(m => m.id === selectedMessage.id);
        if (updatedMsg) setSelectedMessage(updatedMsg);
      }

      if (ev.length > 0 && !selectedEventId) {
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
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedMessage?.replies]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await dataService.authenticate(pin)) { setIsAuth(true); loadData(); }
    else { alert("PIN INVÁLIDO (3232)"); setPin(''); }
  };

  const handleAction = async (type: string, id: string, extra?: any) => {
    setLoading(true);
    if (type === 'delete_record') await dataService.deleteRecord(id);
    if (type === 'delete_event') await dataService.deleteEvent(id);
    if (type === 'delete_msg') {
       await dataService.deleteMessage(id);
       if (selectedMessage?.id === id) setSelectedMessage(null);
    }
    if (type === 'msg_status') await dataService.updateMessageStatus(id, extra);
    if (type === 'check_in') await dataService.toggleCheckIn(selectedEventId, id);
    if (type === 'approve_selector') await dataService.updateSelectorStatus(id, 'approved');
    if (type === 'reject_selector') await dataService.updateSelectorStatus(id, 'rejected');
    if (type === 'delete_selector') await dataService.deleteSelector(id);
    if (type === 'add_manual_guest') {
      await dataService.addManualGuest(selectedEventId, manualGuestName);
      setManualGuestName('');
    }
    if (type === 'send_reply') {
      await dataService.addReplyToMessage(id, extra);
      setReplyText('');
    }
    await loadData();
  };

  const selectTab = (tab: AdminTab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
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
        </div>
      </div>
    );
  }

  const filteredInbox = inbox.filter(m => {
    if (inboxFilter === 'all') return m.status !== 'archived';
    return m.status === inboxFilter;
  });

  return (
    <div className="min-h-screen bg-[#0c0a09] text-mat-cream flex flex-col md:flex-row font-sans relative overflow-hidden">
      
      {/* Mobile Top Header */}
      <div className="md:hidden bg-mat-900 border-b border-mat-800 h-20 px-6 flex items-center justify-between sticky top-0 z-[100]">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-mat-500 w-6 h-6" />
          <span className="font-black uppercase tracking-widest text-xs">CORE <span className="text-mat-500">SYSTEM</span></span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-3 bg-mat-800 rounded-xl text-mat-500 hover:text-white transition-colors shadow-lg">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed md:sticky top-0 left-0 z-[90] h-full w-80 bg-mat-900 border-r border-mat-800 flex flex-col transition-transform duration-500 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-8 border-b border-mat-800 hidden md:flex items-center gap-4">
           <ShieldCheck className="text-mat-500 w-8 h-8" />
           <div>
              <h1 className="text-lg font-black uppercase tracking-tighter leading-none">MAT32 <span className="text-mat-500">CORE</span></h1>
           </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
           {[
             { id: 'dashboard', label: 'Panel Control', icon: <BarChart3 size={18} /> },
             { id: 'inbox', label: 'CRM & Bandeja', icon: <Inbox size={18} />, count: inbox.filter(m => m.status === 'pending').length },
             { id: 'inventory', label: 'Gestión Hub', icon: <ShoppingBag size={18} /> },
             { id: 'door', label: 'Control Puerta', icon: <UserCheck size={18} /> },
             { id: 'connectors', label: 'Status Protocol', icon: <Activity size={18} /> },
           ].map(item => (
             <button key={item.id} onClick={() => selectTab(item.id as AdminTab)} className={`w-full flex items-center justify-between p-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-mat-500 text-white shadow-xl translate-x-2' : 'text-gray-500 hover:bg-mat-800 hover:text-white'}`}>
                <div className="flex items-center gap-3">{item.icon} {item.label}</div>
                {item.count ? <span className="bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-[9px]">{item.count}</span> : null}
             </button>
           ))}
        </nav>

        <div className="p-6 border-t border-mat-800 flex flex-col gap-4 bg-mat-950/20">
           <button onClick={() => { dataService.logout(); setIsAuth(false); }} className="w-full flex items-center gap-3 p-3 rounded-xl text-[10px] font-black uppercase text-gray-600 hover:text-red-500 transition-colors"><LogOut size={16} /> Salir</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen overflow-y-auto custom-scrollbar bg-[radial-gradient(circle_at_top_right,_#1c1917_0%,_#0c0a09_100%)]">
        <div className="animate-fade-in max-w-7xl mx-auto h-full flex flex-col">

          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="p-12 space-y-12">
               <h2 className="text-4xl md:text-5xl font-black uppercase font-exo tracking-tighter">Dashboard.</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Revenue Shop', val: `€${analytics?.totalRevenue || 0}`, icon: <Zap /> },
                    { label: 'Entradas Vendidas', val: analytics?.ticketSales || 0, icon: <Users /> },
                    { label: 'Followers IG', val: analytics?.instagramStatus.followers || 0, icon: <Smartphone /> },
                    { label: 'Hub Activo', val: analytics?.communityActiveUsers || 0, icon: <MessageSquare /> }
                  ].map((card, i) => (
                    <div key={i} className="bg-mat-900 border border-mat-800 p-8 rounded-[2rem] shadow-xl group hover:border-mat-500 transition-all">
                       <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{card.label}</p>
                       <p className="text-3xl md:text-4xl font-black text-white font-exo">{card.val}</p>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* TAB: CRM / INBOX - El corazón del CRM */}
          {activeTab === 'inbox' && (
            <div className="flex-1 flex flex-col md:flex-row h-full max-h-screen overflow-hidden">
               {/* Inbox Sidebar List */}
               <div className="w-full md:w-96 border-r border-mat-800 flex flex-col bg-mat-950/20">
                  <div className="p-6 border-b border-mat-800 space-y-4">
                     <h2 className="text-2xl font-black uppercase font-exo tracking-tighter leading-none mb-4">Inbox.</h2>
                     <div className="flex gap-1 bg-mat-900 p-1 rounded-xl border border-mat-800 overflow-x-auto">
                        {(['all', 'pending', 'read', 'archived'] as const).map(f => (
                          <button key={f} onClick={() => setInboxFilter(f)} className={`flex-1 py-2 px-3 text-[8px] font-black uppercase tracking-widest rounded-lg transition-all ${inboxFilter === f ? 'bg-mat-500 text-white' : 'text-gray-500 hover:text-white'}`}>
                            {f}
                          </button>
                        ))}
                     </div>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                     {filteredInbox.length === 0 ? (
                       <div className="p-10 text-center opacity-30">
                          <Inbox className="w-10 h-10 mx-auto mb-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Bandeja Vacía</span>
                       </div>
                     ) : (
                       filteredInbox.map(msg => (
                        <button 
                          key={msg.id} 
                          onClick={() => { setSelectedMessage(msg); dataService.updateMessageStatus(msg.id, 'read'); }}
                          className={`w-full text-left p-6 border-b border-mat-800 transition-all hover:bg-mat-800/30 relative ${selectedMessage?.id === msg.id ? 'bg-mat-800/50 border-l-4 border-l-mat-500' : ''}`}
                        >
                           {msg.status === 'pending' && <span className="absolute top-6 right-6 w-2 h-2 bg-mat-500 rounded-full animate-pulse shadow-[0_0_10px_#ea580c]"></span>}
                           <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-0.5 text-[7px] font-black uppercase tracking-widest rounded bg-mat-900 text-gray-500 border border-mat-700">{msg.type}</span>
                              <span className="text-[8px] text-gray-600 font-bold uppercase">{msg.date.split(',')[0]}</span>
                           </div>
                           <h4 className="text-white font-black uppercase text-xs tracking-tighter truncate leading-none mb-2">{msg.sender}</h4>
                           <p className="text-gray-500 text-[10px] truncate leading-none italic">"{msg.content}"</p>
                        </button>
                       ))
                     )}
                  </div>
               </div>

               {/* Message Detail Panel */}
               <div className="flex-1 flex flex-col bg-mat-900 overflow-hidden">
                  {selectedMessage ? (
                    <>
                      {/* Detail Header */}
                      <div className="p-6 md:p-10 border-b border-mat-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-mat-950/10">
                         <div className="space-y-2">
                            <div className="flex items-center gap-3">
                               <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter font-exo">{selectedMessage.sender}</h3>
                               <span className="px-3 py-1 bg-mat-800 text-mat-500 text-[9px] font-black uppercase rounded-lg border border-mat-700">{selectedMessage.type}</span>
                            </div>
                            <div className="flex flex-wrap gap-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                               <div className="flex items-center gap-2"><Mail size={12} /> {selectedMessage.email}</div>
                               {selectedMessage.phone && <div className="flex items-center gap-2"><Smartphone size={12} /> {selectedMessage.phone}</div>}
                               <div className="flex items-center gap-2"><Clock size={12} /> Recibido {selectedMessage.date}</div>
                            </div>
                         </div>
                         <div className="flex gap-2">
                            <button onClick={() => handleAction('msg_status', selectedMessage.id, 'archived')} className="p-4 bg-mat-800 text-gray-500 hover:text-white rounded-2xl shadow-lg border border-mat-700 transition-all"><Archive size={18} /></button>
                            <button onClick={() => handleAction('delete_msg', selectedMessage.id)} className="p-4 bg-mat-800 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl shadow-lg border border-mat-700 transition-all"><Trash2 size={18} /></button>
                         </div>
                      </div>

                      {/* Conversation Thread */}
                      <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar bg-[#0f0d0c]">
                         {/* Original Message Card */}
                         <div className="max-w-3xl space-y-4">
                            <div className="bg-mat-800/80 p-8 rounded-[2rem] border-2 border-mat-700 shadow-xl relative">
                               <div className="absolute top-6 left-[-10px] w-5 h-5 bg-mat-800 border-l-2 border-b-2 border-mat-700 rotate-45"></div>
                               <h5 className="text-[10px] font-black text-mat-500 uppercase tracking-[0.3em] mb-4">SOLICITUD INICIAL</h5>
                               <p className="text-gray-200 text-lg font-light italic leading-relaxed">"{selectedMessage.content}"</p>
                               
                               {/* Metadatos específicos si existen */}
                               {selectedMessage.metadata && (
                                 <div className="mt-8 pt-6 border-t border-mat-700 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {Object.entries(selectedMessage.metadata).map(([key, val]: any) => (
                                      <div key={key}>
                                        <span className="block text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">{key}</span>
                                        <span className="text-white text-[10px] font-black uppercase truncate block">{String(val)}</span>
                                      </div>
                                    ))}
                                 </div>
                               )}
                            </div>
                         </div>

                         {/* Replies History */}
                         {selectedMessage.replies?.map((reply) => (
                           <div key={reply.id} className={`flex ${reply.sender === 'admin' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                              <div className={`max-w-[80%] p-6 rounded-[2rem] shadow-xl ${reply.sender === 'admin' ? 'bg-mat-500 text-white rounded-tr-none border border-white/20' : 'bg-mat-800 text-gray-200 rounded-tl-none border border-mat-700 italic'}`}>
                                 <div className="flex justify-between items-center gap-10 mb-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest opacity-60">{reply.sender === 'admin' ? 'SYSTEM REPLY' : 'USER'}</span>
                                    <span className="text-[8px] font-bold opacity-40">{reply.timestamp}</span>
                                 </div>
                                 <p className="text-sm font-bold leading-relaxed">{reply.text}</p>
                              </div>
                           </div>
                         ))}
                         <div ref={chatEndRef} />
                      </div>

                      {/* Reply Form */}
                      <div className="p-6 md:p-8 bg-mat-950 border-t border-mat-800">
                         <div className="max-w-4xl mx-auto flex gap-4">
                            <div className="flex-1 relative">
                               <textarea 
                                 value={replyText}
                                 onChange={(e) => setReplyText(e.target.value)}
                                 placeholder="Escribir respuesta... (Llegará al Gmail del usuario)"
                                 className="w-full bg-mat-900 border-2 border-mat-800 text-white p-5 rounded-3xl text-sm font-bold outline-none focus:border-mat-500 transition-all resize-none h-16 md:h-20"
                               />
                               <div className="absolute right-4 bottom-4 flex items-center gap-2 text-[8px] font-black text-gray-700 uppercase tracking-widest pointer-events-none">
                                  <Mail size={10} /> OUTBOX READY
                               </div>
                            </div>
                            <button 
                              onClick={() => handleAction('send_reply', selectedMessage.id, replyText)}
                              disabled={!replyText.trim() || loading}
                              className="p-6 bg-mat-500 text-white rounded-3xl shadow-xl hover:bg-mat-400 disabled:opacity-30 transition-all self-end"
                            >
                               <Send size={24} />
                            </button>
                         </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-20 opacity-20">
                       <History className="w-20 h-20 mb-8" />
                       <h3 className="text-4xl font-black uppercase font-exo tracking-widest mb-2">Selecciona un mensaje.</h3>
                       <p className="text-xs uppercase font-black tracking-widest italic">Protocolo CRM listo para conexión.</p>
                    </div>
                  )}
               </div>
            </div>
          )}

          {/* OTRAS PESTAÑAS (Inventory, Door, etc.) - Simplificadas para mantener enfoque en CRM */}
          {activeTab === 'inventory' && (
            <div className="p-12 space-y-10">
               <div className="flex justify-between items-end mb-12">
                  <h2 className="text-4xl font-black uppercase font-exo tracking-tighter leading-none">Gestión Hub.</h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {invTab === 'selectors' && selectors.map(s => (
                    <div key={s.id} className={`bg-mat-900 border-2 p-6 rounded-[2rem] flex flex-col gap-5 shadow-xl ${s.status === 'pending' ? 'border-orange-500/50' : s.status === 'approved' ? 'border-green-500/50' : 'border-mat-800'}`}>
                       <div className="flex gap-4">
                          <div className="w-16 h-16 bg-mat-800 rounded-xl overflow-hidden"><img src={s.avatarUrl || `https://i.pravatar.cc/150?u=${s.artistName}`} className="w-full h-full object-cover" /></div>
                          <div>
                             <h4 className="text-white font-black uppercase text-sm tracking-tighter">{s.artistName}</h4>
                             <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${s.status === 'approved' ? 'bg-green-500' : s.status === 'pending' ? 'bg-orange-500' : 'bg-red-500'} text-white`}>{s.status}</span>
                          </div>
                       </div>
                       <p className="text-gray-500 text-[10px] italic line-clamp-2">"{s.bio}"</p>
                       <div className="flex gap-2 mt-auto pt-4 border-t border-mat-800">
                          {s.status !== 'approved' && (
                             <button onClick={() => handleAction('approve_selector', s.id)} className="flex-1 py-3 bg-green-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest">Aprobar</button>
                          )}
                          <button onClick={() => handleAction('delete_selector', s.id)} className="p-3 bg-mat-800 text-red-500 rounded-xl"><Trash2 size={16} /></button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* TAB: STATUS PROTOCOL */}
          {activeTab === 'connectors' && (
             <div className="p-12 space-y-12">
                <h2 className="text-4xl font-black uppercase font-exo tracking-tighter">Status Protocol.</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {connectors.map(c => (
                     <div key={c.id} className="bg-mat-900 border border-mat-800 p-8 rounded-[2rem] shadow-xl flex items-center justify-between">
                        <div className="flex items-center gap-6">
                           <div className={`w-3 h-3 rounded-full ${c.status === 'online' ? 'bg-green-500 shadow-[0_0_15px_#22c55e]' : 'bg-yellow-500'}`}></div>
                           <div>
                              <h4 className="text-white font-black uppercase text-sm tracking-widest">{c.name}</h4>
                              <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">Latencia: {c.latency}</p>
                           </div>
                        </div>
                        <span className="text-[8px] font-black uppercase text-gray-500 tracking-[0.4em]">{c.status}</span>
                     </div>
                   ))}
                </div>
             </div>
          )}

        </div>
      </main>
    </div>
  );
};
