import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, Disc, Plus, LogOut, CheckCircle, Loader2, 
  Calendar, ShoppingBag, Mail, Trash2, Edit3, X, Save, ShieldCheck, UserCheck, Upload, Image as ImageIcon,
  Lock, User, Music, BarChart3, Users, MessageSquare, Package, ExternalLink
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { dataService } from '../services/dataService';
import { Event, VinylRecord, Sale, InboxMessage, MerchItem, SelectorSubmission, Post } from '../types';

type AdminTab = 'analytics' | 'agenda' | 'inventory' | 'sales' | 'messages' | 'community';

export const Admin: React.FC = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
  const [loading, setLoading] = useState(true);
  
  const [events, setEvents] = useState<Event[]>([]);
  const [records, setRecords] = useState<VinylRecord[]>([]);
  const [merch, setMerch] = useState<MerchItem[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [inbox, setInbox] = useState<InboxMessage[]>([]);
  const [selectors, setSelectors] = useState<SelectorSubmission[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [status, setStatus] = useState<string | null>(null);
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Partial<Post> | null>(null);
  const [editingEvent, setEditingEvent] = useState<Partial<Event> | null>(null);
  const [editingRecord, setEditingRecord] = useState<Partial<VinylRecord> | null>(null);
  const [editingMerch, setEditingMerch] = useState<Partial<MerchItem> | null>(null);
  const [viewingGuestList, setViewingGuestList] = useState<{eventId: string, title: string} | null>(null);
  const [guestList, setGuestList] = useState<{name: string}[]>([]);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<'event' | 'record' | 'merch' | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const auth = dataService.isAuthenticated();
    setIsAuth(auth);
    if (auth) loadData();
    else setLoading(false);
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ev, rec, mer, sal, msg, ana, sel, pst] = await Promise.all([
        dataService.getEvents(),
        dataService.getRecords(),
        dataService.getMerch(),
        dataService.getSales(),
        dataService.getInbox(),
        dataService.getAnalytics(),
        dataService.getSelectors(),
        dataService.getPosts()
      ]);
      setEvents(ev);
      setRecords(rec);
      setMerch(mer);
      setSales(sal);
      setInbox(msg);
      setAnalytics(ana);
      setSelectors(sel);
      setPosts(pst);
    } catch (error) {
      console.error("Error loading admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.target as any).email.value;
    const pass = (e.target as any).password.value;
    
    setIsProcessing(true);
    if (await dataService.login(email, pass)) {
      setIsAuth(true);
      loadData();
      setStatus(null);
    } else {
      setStatus("ACCESS_DENIED_INVALID_TOKEN");
    }
    setIsProcessing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (uploadTarget === 'event' && editingEvent) {
        setEditingEvent({ ...editingEvent, imageUrl: base64String });
      } else if (uploadTarget === 'record' && editingRecord) {
        setEditingRecord({ ...editingRecord, coverUrl: base64String });
      } else if (uploadTarget === 'merch' && editingMerch) {
        setEditingMerch({ ...editingMerch, imageUrl: base64String });
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerUpload = (target: 'event' | 'record' | 'merch') => {
    setUploadTarget(target);
    fileInputRef.current?.click();
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    setIsProcessing(true);
    setStatus(null);
    try {
      if (editingEvent.id) await dataService.updateEvent(editingEvent);
      else await dataService.createEvent(editingEvent as Event);
      setEditingEvent(null);
      loadData();
      setStatus("EVENT_SAVED_SUCCESS");
      setTimeout(() => setStatus(null), 3000);
    } catch (error: any) {
      console.error("Error saving event:", error);
      setStatus("ERROR_SAVING_EVENT");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    setIsProcessing(true);
    setStatus(null);
    try {
      if (editingRecord.id) await dataService.updateRecord(editingRecord);
      else await dataService.createRecord(editingRecord as VinylRecord);
      setEditingRecord(null);
      loadData();
      setStatus("RECORD_SAVED_SUCCESS");
      setTimeout(() => setStatus(null), 3000);
    } catch (error: any) {
      console.error("Error saving record:", error);
      setStatus("ERROR_SAVING_RECORD");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveMerch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMerch) return;
    setIsProcessing(true);
    setStatus(null);
    try {
      if (editingMerch.id) await dataService.updateMerch(editingMerch);
      else await dataService.createMerch(editingMerch as MerchItem);
      setEditingMerch(null);
      loadData();
      setStatus("MERCH_SAVED_SUCCESS");
      setTimeout(() => setStatus(null), 3000);
    } catch (error: any) {
      console.error("Error saving merch:", error);
      setStatus("ERROR_SAVING_MERCH");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;
    setIsProcessing(true);
    try {
      if (editingPost.id) await dataService.updatePost(editingPost);
      else await dataService.createPost({ ...editingPost, type: 'POST', likes: 0, comments: [], tags: [] });
      setEditingPost(null);
      loadData();
      setStatus('POST_SAVED');
      setTimeout(() => setStatus(null), 3000);
    } catch (err: any) {
      setStatus('ERROR_SAVING_POST');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewGuestList = async (eventId: string, title: string) => {
    const list = await dataService.getEventGuestList(eventId);
    setGuestList(list);
    setViewingGuestList({ eventId, title });
  };

  if (!isAuth) return (
    <div className="min-h-screen bg-mat-950 flex items-center justify-center p-6 text-mat-cream">
      <div className="w-full max-w-sm bg-mat-900 border-2 border-mat-800 p-10 rounded-[3rem] text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
        <div className="mb-10 inline-flex items-center justify-center w-20 h-20 bg-mat-800 rounded-2xl border border-mat-700 shadow-xl">
           <Lock size={32} className="text-mat-500" />
        </div>
        <h1 className="text-white text-3xl font-black uppercase mb-2 font-exo tracking-tighter">MAT32_MATRIX</h1>
        <p className="text-gray-600 text-[9px] font-black uppercase tracking-[0.4em] mb-10">ADMIN_PORTAL_V21.0</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleImageUpload} 
          />
          <div className="space-y-2">
            <div className="relative">
               <User className="absolute left-4 top-1/2 -translate-y-1/2 text-mat-700" size={16} />
               <input name="email" type="email" required className="w-full bg-mat-950 border border-mat-800 p-4 pl-12 text-white text-xs font-bold rounded-xl outline-none focus:border-mat-500 transition-all" placeholder="EMAIL@MAT32.COM" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="relative">
               <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-mat-700" size={16} />
               <input name="password" type="password" required className="w-full bg-mat-950 border border-mat-800 p-4 pl-12 text-white text-xs font-bold rounded-xl outline-none focus:border-mat-500 transition-all" placeholder="PASSWORD_TOKEN" />
            </div>
          </div>
          
          <button disabled={isProcessing} className="w-full py-5 bg-mat-500 hover:bg-mat-400 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3">
             {isProcessing ? <Loader2 className="animate-spin" /> : 'INICIAR_SESIÓN'}
          </button>
          
          {status && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl animate-fade-in">
               <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{status}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-mat-950 text-mat-cream pt-24 pb-20">
      <header className="bg-mat-900 border-b border-mat-800 h-20 px-8 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-4">
           <Disc className="text-mat-500 animate-spin-slow" size={24} />
           <h2 className="text-xl font-black font-exo tracking-tighter">MAT32_CORE</h2>
        </div>
        <div className="hidden md:flex bg-mat-800 p-1 rounded-xl border border-mat-700">
           {(['analytics', 'agenda', 'inventory', 'sales', 'messages', 'community'] as AdminTab[]).map(tab => (
             <button 
               key={tab} 
               onClick={() => setActiveTab(tab)} 
               className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab ? 'bg-mat-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
             >
               {tab === 'analytics' && <BarChart3 size={14} />}
               {tab === 'agenda' && <Calendar size={14} />}
               {tab === 'inventory' && <Package size={14} />}
               {tab === 'sales' && <ShoppingBag size={14} />}
               {tab === 'messages' && <MessageSquare size={14} />}
               {tab === 'community' && <Users size={14} />}
               {tab}
             </button>
           ))}
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => { dataService.logout(); setIsAuth(false); }} className="p-3 bg-mat-800 border border-mat-700 rounded-xl text-gray-500 hover:text-red-500 transition-all"><LogOut size={20} /></button>
        </div>
      </header>

      <main className="container mx-auto px-6 pt-10 max-w-6xl">
        {activeTab === 'analytics' && analytics && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Visitas', value: analytics.visits, icon: Users, color: 'text-blue-500' },
                { label: 'Ventas Totales', value: `€${analytics.salesTotal}`, icon: ShoppingBag, color: 'text-emerald-500' },
                { label: 'Usuarios Activos', value: analytics.activeUsers, icon: UserCheck, color: 'text-mat-500' },
                { label: 'Conversión', value: `${analytics.conversionRate}%`, icon: BarChart3, color: 'text-amber-500' }
              ].map((stat, i) => (
                <div key={i} className="bg-mat-900 border border-mat-800 p-6 rounded-3xl shadow-xl">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 bg-mat-950 rounded-xl border border-mat-800 ${stat.color}`}>
                      <stat.icon size={20} />
                    </div>
                  </div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-2xl font-black text-white font-exo tracking-tighter">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-mat-900 border border-mat-800 p-8 rounded-[2.5rem] shadow-2xl">
                <h3 className="text-lg font-black uppercase font-exo tracking-tighter mb-8 flex items-center gap-3">
                  <BarChart3 size={18} className="text-mat-500" /> Rendimiento Semanal
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.chartData}>
                      <defs>
                        <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FF4D00" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#FF4D00" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                      <XAxis dataKey="name" stroke="#444" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#444" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '12px', fontSize: '10px' }}
                        itemStyle={{ color: '#FF4D00' }}
                      />
                      <Area type="monotone" dataKey="visits" stroke="#FF4D00" fillOpacity={1} fill="url(#colorVisits)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-mat-900 border border-mat-800 p-8 rounded-[2.5rem] shadow-2xl">
                <h3 className="text-lg font-black uppercase font-exo tracking-tighter mb-8 flex items-center gap-3">
                  <ShoppingBag size={18} className="text-emerald-500" /> Ventas por Categoría
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                      <XAxis dataKey="name" stroke="#444" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#444" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '12px', fontSize: '10px' }}
                      />
                      <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
                        {analytics.chartData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#FF4D00' : '#10b981'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'agenda' && (
          <div className="bg-mat-900 border border-mat-800 p-10 rounded-[2.5rem] shadow-2xl animate-fade-in">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black uppercase font-exo tracking-tighter">Gestión de Agenda</h3>
                <button onClick={() => setEditingEvent({ title: '', date: '', time: '21:00', price: 0, description: '', category: 'Listening Session' })} className="px-6 py-3 bg-mat-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2 hover:bg-mat-400 shadow-xl transition-all">
                   <Plus size={16} /> Nuevo Evento
                </button>
             </div>
             <div className="space-y-4">
                {events.map(ev => (
                  <div key={ev.id} className="flex items-center justify-between p-6 bg-mat-800/50 border border-mat-700 rounded-3xl hover:border-mat-500 transition-all group">
                     <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-black rounded-2xl overflow-hidden shadow-xl">
                           <img src={ev.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                        </div>
                        <div>
                           <p className="font-black uppercase text-base tracking-tight text-white">{ev.title}</p>
                           <p className="text-[10px] font-bold text-mat-500 uppercase tracking-widest">{ev.date} @ {ev.time} | {ev.category}</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <button onClick={() => handleViewGuestList(ev.id, ev.title)} className="p-3 bg-mat-900 text-gray-500 hover:text-mat-500 rounded-xl border border-mat-700 flex items-center gap-2">
                          <Users size={18} />
                          <span className="text-[9px] font-black">LISTA</span>
                        </button>
                        <button onClick={() => setEditingEvent(ev)} className="p-3 bg-mat-900 text-gray-500 hover:text-white rounded-xl border border-mat-700"><Edit3 size={18} /></button>
                        <button onClick={async () => { if(confirm("¿Estás seguro de inyectar el protocolo de eliminación?")) { await dataService.deleteEvent(ev.id); loadData(); } }} className="p-3 bg-mat-900 text-gray-500 hover:text-red-500 rounded-xl border border-mat-700"><Trash2 size={18} /></button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-mat-900 border border-mat-800 p-10 rounded-[2.5rem] shadow-2xl">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-black uppercase font-exo tracking-tighter">Marketplace Hub Inventory</h3>
                  <button onClick={() => setEditingRecord({ artist: '', title: '', price: 25, genre: 'Jazz', condition: 'NM', label: '', year: '2024', format: 'LP', streamingLink: '' })} className="px-6 py-3 bg-mat-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2 hover:bg-mat-400 shadow-xl transition-all">
                     <Plus size={16} /> Añadir Vinilo
                  </button>
               </div>
               <div className="space-y-4">
                  {records.map(rec => (
                    <div key={rec.id} className="flex items-center justify-between p-6 bg-mat-800/50 border border-mat-700 rounded-3xl hover:border-mat-500 transition-all group">
                       <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-black rounded-2xl overflow-hidden shadow-xl flex items-center justify-center text-mat-700 font-black">
                             {rec.coverUrl ? <img src={rec.coverUrl} className="w-full h-full object-cover" /> : <Disc size={24} />}
                          </div>
                          <div>
                             <p className="font-black uppercase text-base tracking-tight text-white">{rec.artist}</p>
                             <p className="text-[10px] font-bold text-mat-500 uppercase tracking-widest">{rec.title} | €{rec.price}</p>
                          </div>
                       </div>
                       <div className="flex gap-4">
                          {rec.streamingLink && <Music size={14} className="text-emerald-500" />}
                          <button onClick={() => setEditingRecord(rec)} className="p-3 bg-mat-900 text-gray-500 hover:text-white rounded-xl border border-mat-700"><Edit3 size={18} /></button>
                          <button onClick={async () => { if(confirm("¿Eliminar vinilo del Hub?")) { await dataService.deleteRecord(rec.id); loadData(); } }} className="p-3 bg-mat-900 text-gray-500 hover:text-red-500 rounded-xl border border-mat-700"><Trash2 size={18} /></button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-mat-900 border border-mat-800 p-10 rounded-[2.5rem] shadow-2xl">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-black uppercase font-exo tracking-tighter">Merchandise & Apparel</h3>
                  <button onClick={() => setEditingMerch({ name: '', price: 35, category: 'Apparel', description: '', stock: 10, imageUrl: '', status: 'draft' })} className="px-6 py-3 bg-mat-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2 hover:bg-mat-400 shadow-xl transition-all">
                     <Plus size={16} /> Añadir Merch
                  </button>
               </div>
               <div className="space-y-4">
                  {merch.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-6 bg-mat-800/50 border border-mat-700 rounded-3xl hover:border-mat-500 transition-all group">
                       <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-black rounded-2xl overflow-hidden shadow-xl flex items-center justify-center text-mat-700 font-black">
                             {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : <ShoppingBag size={24} />}
                          </div>
                          <div>
                             <p className="font-black uppercase text-base tracking-tight text-white">{item.name}</p>
                             <p className="text-[10px] font-bold text-mat-500 uppercase tracking-widest">{item.category} | €{item.price}</p>
                          </div>
                       </div>
                       <div className="flex gap-4">
                          <button onClick={() => setEditingMerch(item)} className="p-3 bg-mat-900 text-gray-500 hover:text-white rounded-xl border border-mat-700"><Edit3 size={18} /></button>
                          <button onClick={async () => { if(confirm("¿Eliminar item de merch?")) { await dataService.deleteMerch(item.id); loadData(); } }} className="p-3 bg-mat-900 text-gray-500 hover:text-red-500 rounded-xl border border-mat-700"><Trash2 size={18} /></button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="bg-mat-900 border border-mat-800 p-10 rounded-[2.5rem] shadow-2xl animate-fade-in">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black uppercase font-exo tracking-tighter">Ventas & Transacciones</h3>
             </div>
             <div className="space-y-4">
                {sales.length === 0 ? (
                  <div className="text-center py-20 text-gray-600 font-black text-xs uppercase">No hay ventas registradas</div>
                ) : (
                  sales.map(sale => (
                    <div key={sale.id} className="flex items-center justify-between p-6 bg-mat-800/50 border border-mat-700 rounded-3xl">
                       <div className="flex items-center gap-6">
                          <div className="w-12 h-12 bg-mat-950 rounded-xl flex items-center justify-center text-emerald-500">
                             <ShoppingBag size={20} />
                          </div>
                          <div>
                             <p className="font-black uppercase text-sm text-white">Pedido #{sale.id.slice(-6)}</p>
                             <p className="text-[10px] font-bold text-mat-500 uppercase tracking-widest">{sale.customerName} | €{sale.total}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                            sale.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 
                            sale.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                          }`}>
                            {sale.status}
                          </span>
                          <button onClick={async () => { if(confirm("¿Eliminar registro de venta?")) { await dataService.deleteSale(sale.id); loadData(); } }} className="p-2 text-gray-500 hover:text-red-500"><Trash2 size={16} /></button>
                       </div>
                    </div>
                  ))
                )}
             </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center mb-4 px-4">
                <h3 className="text-2xl font-black uppercase font-exo tracking-tighter">Bandeja de Entrada</h3>
             </div>
             {inbox.length === 0 ? (
               <div className="text-center py-40 border-2 border-dashed border-mat-800 rounded-[3rem]">
                  <Mail className="w-16 h-16 text-mat-800 mx-auto mb-6" />
                  <p className="text-gray-600 font-black text-xs uppercase">Bandeja de Entrada Vacía</p>
               </div>
             ) : (
               inbox.map(msg => (
                <div key={msg.id} className="p-10 bg-mat-900 border border-mat-800 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity"><Mail size={80} /></div>
                   <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-mat-500 rounded-full flex items-center justify-center text-white font-black">{msg.sender[0]}</div>
                         <div>
                            <span className="block text-xs font-black text-white uppercase tracking-widest">{msg.sender}</span>
                            <span className="text-[9px] text-mat-500 font-bold uppercase tracking-widest">{msg.email}</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[9px] text-gray-700 font-black">{msg.date}</span>
                        <button onClick={async () => { if(confirm("¿Eliminar mensaje?")) { await dataService.deleteInboxMessage(msg.id); loadData(); } }} className="p-2 text-gray-500 hover:text-red-500"><Trash2 size={16} /></button>
                      </div>
                   </div>
                   <div className="bg-mat-950 p-6 rounded-2xl border border-mat-800">
                      <p className="text-gray-400 italic text-sm leading-relaxed">"{msg.content}"</p>
                   </div>
                </div>
               ))
             )}
          </div>
        )}

        {activeTab === 'community' && (
          <div className="space-y-8 animate-fade-in">

            {/* POSTS */}
            <div className="bg-mat-900 border border-mat-800 p-10 rounded-[2.5rem] shadow-2xl">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black uppercase font-exo tracking-tighter">Posts Comunidad</h3>
                <button
                  onClick={() => setEditingPost({ author: 'MAT32', content: '', status: 'published' })}
                  className="px-6 py-3 bg-mat-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2 hover:bg-mat-400 shadow-xl transition-all"
                >
                  <Plus size={16} /> Nuevo Post
                </button>
              </div>
              <div className="space-y-4">
                {posts.length === 0 ? (
                  <div className="text-center py-20 text-gray-600 font-black text-xs uppercase">No hay posts</div>
                ) : posts.map(post => (
                  <div key={post.id} className="flex items-center justify-between p-6 bg-mat-800/50 border border-mat-700 rounded-3xl hover:border-mat-500 transition-all group">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-mat-800 rounded-2xl border border-mat-700 overflow-hidden flex items-center justify-center">
                        {post.imageUrl
                          ? <img src={post.imageUrl} className="w-full h-full object-cover" />
                          : <Music size={20} className="text-mat-500" />}
                      </div>
                      <div>
                        <p className="font-black uppercase text-sm text-white line-clamp-1">{post.content.slice(0, 60)}…</p>
                        <p className="text-[10px] font-bold text-mat-500 uppercase tracking-widest">@{post.author} · {post.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => setEditingPost(post)} className="p-3 bg-mat-900 text-gray-500 hover:text-white rounded-xl border border-mat-700"><Edit3 size={18} /></button>
                      <button onClick={async () => { if (confirm('¿Eliminar post?')) { await dataService.deletePost(post.id); loadData(); } }} className="p-3 bg-mat-900 text-gray-500 hover:text-red-500 rounded-xl border border-mat-700"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* OPEN DECKS SUBMISSIONS */}
            <div className="bg-mat-900 border border-mat-800 p-10 rounded-[2.5rem] shadow-2xl">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black uppercase font-exo tracking-tighter">Open Decks Submissions</h3>
              </div>
              <div className="space-y-4">
                {selectors.length === 0 ? (
                  <div className="text-center py-20 text-gray-600 font-black text-xs uppercase">No hay solicitudes pendientes</div>
                ) : (
                  selectors.map(sel => (
                    <div key={sel.id} className="p-6 bg-mat-800/50 border border-mat-700 rounded-3xl">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-mat-500 rounded-full flex items-center justify-center text-white font-black">{sel.name[0]}</div>
                          <div>
                            <p className="font-black uppercase text-sm text-white">{sel.name}</p>
                            <p className="text-[9px] text-mat-500 font-bold uppercase tracking-widest">{sel.email}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                          sel.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' : 
                          sel.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                          {sel.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-mat-950 p-3 rounded-xl border border-mat-800">
                          <p className="text-[8px] text-gray-500 uppercase font-black mb-1">Género</p>
                          <p className="text-xs text-white font-bold">{sel.genre}</p>
                        </div>
                        <div className="bg-mat-950 p-3 rounded-xl border border-mat-800">
                          <p className="text-[8px] text-gray-500 uppercase font-black mb-1">Experiencia</p>
                          <p className="text-xs text-white font-bold">{sel.experience}</p>
                        </div>
                      </div>
                      {sel.links && (
                        <div className="flex gap-2 mb-4">
                          {sel.links.map((link: string, i: number) => (
                            <a key={i} href={link} target="_blank" rel="noreferrer" className="p-2 bg-mat-900 border border-mat-700 rounded-lg text-gray-500 hover:text-white transition-all">
                              <ExternalLink size={14} />
                            </a>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-3">
                        <button 
                          onClick={async () => { await dataService.updateSelectorStatus(sel.id, 'approved'); loadData(); }}
                          className="flex-1 py-3 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-500 hover:text-white transition-all"
                        >
                          Aprobar
                        </button>
                        <button 
                          onClick={async () => { await dataService.updateSelectorStatus(sel.id, 'rejected'); loadData(); }}
                          className="flex-1 py-3 bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-500 hover:text-white transition-all"
                        >
                          Rechazar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL EDICIÓN EVENTO */}
      {editingEvent && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
           <div className="w-full max-w-xl bg-mat-900 border-2 border-mat-700 p-10 rounded-[3.5rem] relative max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
              <button onClick={() => setEditingEvent(null)} className="absolute top-10 right-10 text-gray-500 hover:text-white"><X size={32} /></button>
              <h2 className="text-3xl font-black uppercase mb-10 font-exo tracking-tighter">PROTOCOLO_EVENTO</h2>
              <form onSubmit={handleSaveEvent} className="space-y-6">
                 <div className="flex flex-col items-center gap-4 mb-6">
                    <div className="w-full h-48 bg-mat-800 rounded-3xl border-2 border-dashed border-mat-700 overflow-hidden flex items-center justify-center relative group">
                       {editingEvent.imageUrl ? (
                          <>
                             <img src={editingEvent.imageUrl} className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button type="button" onClick={() => triggerUpload('event')} className="p-4 bg-mat-500 rounded-full text-white"><Upload size={24} /></button>
                             </div>
                          </>
                       ) : (
                          <button type="button" onClick={() => triggerUpload('event')} className="flex flex-col items-center gap-2 text-gray-500 hover:text-mat-500 transition-all">
                             <ImageIcon size={48} />
                             <span className="text-[10px] font-black uppercase tracking-widest">Subir Imagen de Portada</span>
                          </button>
                       )}
                    </div>
                 </div>

                 <input required value={editingEvent.title} onChange={e => setEditingEvent({...editingEvent, title: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-5 rounded-2xl text-white outline-none focus:border-mat-500 font-bold" placeholder="TÍTULO SESIÓN" />
                 <div className="grid grid-cols-2 gap-6">
                    <input required type="date" value={editingEvent.date} onChange={e => setEditingEvent({...editingEvent, date: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-5 rounded-2xl text-white outline-none focus:border-mat-500" />
                    <input required type="time" value={editingEvent.time} onChange={e => setEditingEvent({...editingEvent, time: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-5 rounded-2xl text-white outline-none focus:border-mat-500" />
                 </div>
                 <textarea required value={editingEvent.description} onChange={e => setEditingEvent({...editingEvent, description: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-6 h-32 rounded-3xl text-white outline-none focus:border-mat-500 resize-none italic" placeholder="DESCRIPCIÓN VIBRA" />
                 <button type="submit" disabled={isProcessing} className="w-full py-6 bg-mat-500 text-white font-black uppercase rounded-[2rem] shadow-2xl flex items-center justify-center gap-4 transition-all hover:bg-mat-400">
                    {isProcessing ? <Loader2 className="animate-spin" /> : <Save size={20} />} EJECUTAR_PROTOCOLO
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* MODAL EDICIÓN DISCO */}
      {editingRecord && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
           <div className="w-full max-w-2xl bg-mat-900 border-2 border-mat-700 p-10 rounded-[3.5rem] relative max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
              <button onClick={() => setEditingRecord(null)} className="absolute top-10 right-10 text-gray-500 hover:text-white"><X size={32} /></button>
              <h2 className="text-3xl font-black uppercase mb-10 font-exo tracking-tighter">INVENTARIO_RECORDS</h2>
              <form onSubmit={handleSaveRecord} className="space-y-6">
                 <div className="flex justify-center mb-6">
                    <div className="w-32 h-32 bg-mat-800 rounded-2xl border-2 border-dashed border-mat-700 overflow-hidden flex items-center justify-center relative group">
                       {editingRecord.coverUrl ? (
                          <>
                             <img src={editingRecord.coverUrl} className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button type="button" onClick={() => triggerUpload('record')} className="p-2 bg-mat-500 rounded-full text-white"><Upload size={16} /></button>
                             </div>
                          </>
                       ) : (
                          <button type="button" onClick={() => triggerUpload('record')} className="flex flex-col items-center gap-1 text-gray-500 hover:text-mat-500 transition-all">
                             <ImageIcon size={24} />
                             <span className="text-[8px] font-black uppercase tracking-widest">Cover</span>
                          </button>
                       )}
                    </div>
                 </div>

                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-2">Artista</label>
                       <input required value={editingRecord.artist} onChange={e => setEditingRecord({...editingRecord, artist: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-4 rounded-xl text-white" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-2">Título Álbum</label>
                       <input required value={editingRecord.title} onChange={e => setEditingRecord({...editingRecord, title: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-4 rounded-xl text-white" />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-2">PREVIEW_SIGNAL (Bandcamp Embed URL)</label>
                    <div className="relative">
                       <Music className="absolute left-4 top-1/2 -translate-y-1/2 text-mat-500" size={16} />
                       <input value={editingRecord.streamingLink} onChange={e => setEditingRecord({...editingRecord, streamingLink: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-4 pl-12 rounded-xl text-white text-[10px] font-mono" placeholder="https://bandcamp.com/EmbeddedPlayer/album=..." />
                    </div>
                 </div>

                 <div className="grid grid-cols-3 gap-6">
                    <input type="number" placeholder="Precio €" value={editingRecord.price} onChange={e => setEditingRecord({...editingRecord, price: parseFloat(e.target.value)})} className="bg-mat-800 border border-mat-700 p-4 rounded-xl text-white" />
                    <input placeholder="Género" value={editingRecord.genre} onChange={e => setEditingRecord({...editingRecord, genre: e.target.value})} className="bg-mat-800 border border-mat-700 p-4 rounded-xl text-white" />
                    <input placeholder="Estado (NM, VG+...)" value={editingRecord.condition} onChange={e => setEditingRecord({...editingRecord, condition: e.target.value})} className="bg-mat-800 border border-mat-700 p-4 rounded-xl text-white" />
                 </div>

                 <textarea placeholder="Descripción del Hub" value={editingRecord.description} onChange={e => setEditingRecord({...editingRecord, description: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-5 h-24 rounded-2xl text-white outline-none resize-none" />

                 <button type="submit" disabled={isProcessing} className="w-full py-6 bg-mat-500 text-white font-black uppercase rounded-[2rem] shadow-2xl flex items-center justify-center gap-4 transition-all hover:bg-mat-400">
                    {isProcessing ? <Loader2 className="animate-spin" /> : <Save size={20} />} INYECTAR_RECORDS
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* MODAL EDICIÓN MERCH */}
      {editingMerch && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
           <div className="w-full max-w-xl bg-mat-900 border-2 border-mat-700 p-10 rounded-[3.5rem] relative max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
              <button onClick={() => setEditingMerch(null)} className="absolute top-10 right-10 text-gray-500 hover:text-white"><X size={32} /></button>
              <h2 className="text-3xl font-black uppercase mb-10 font-exo tracking-tighter">MERCH_PROTOCOL</h2>
              <form onSubmit={handleSaveMerch} className="space-y-6">
                 <div className="flex justify-center mb-6">
                    <div className="w-32 h-32 bg-mat-800 rounded-2xl border-2 border-dashed border-mat-700 overflow-hidden flex items-center justify-center relative group">
                       {editingMerch.imageUrl ? (
                          <>
                             <img src={editingMerch.imageUrl} className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button type="button" onClick={() => triggerUpload('merch')} className="p-2 bg-mat-500 rounded-full text-white"><Upload size={16} /></button>
                             </div>
                          </>
                       ) : (
                          <button type="button" onClick={() => triggerUpload('merch')} className="flex flex-col items-center gap-1 text-gray-500 hover:text-mat-500 transition-all">
                             <ImageIcon size={24} />
                             <span className="text-[8px] font-black uppercase tracking-widest">Image</span>
                          </button>
                       )}
                    </div>
                 </div>

                 <input required value={editingMerch.name} onChange={e => setEditingMerch({...editingMerch, name: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-4 rounded-xl text-white font-bold" placeholder="NOMBRE PRODUCTO" />
                 
                 <div className="grid grid-cols-2 gap-6">
                    <input type="number" placeholder="Precio €" value={editingMerch.price} onChange={e => setEditingMerch({...editingMerch, price: parseFloat(e.target.value)})} className="bg-mat-800 border border-mat-700 p-4 rounded-xl text-white" />
                    <select value={editingMerch.category} onChange={e => setEditingMerch({...editingMerch, category: e.target.value as any})} className="bg-mat-800 border border-mat-700 p-4 rounded-xl text-white outline-none">
                      <option value="Apparel">Apparel</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Prints">Prints</option>
                      <option value="Other">Other</option>
                    </select>
                 </div>

                 <textarea placeholder="Descripción del producto" value={editingMerch.description} onChange={e => setEditingMerch({...editingMerch, description: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-5 h-24 rounded-2xl text-white outline-none resize-none" />

                 <button type="submit" disabled={isProcessing} className="w-full py-6 bg-mat-500 text-white font-black uppercase rounded-[2rem] shadow-2xl flex items-center justify-center gap-4 transition-all hover:bg-mat-400">
                    {isProcessing ? <Loader2 className="animate-spin" /> : <Save size={20} />} GUARDAR_MERCH
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* MODAL EDICIÓN POST */}
      {editingPost && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
          <div className="w-full max-w-xl bg-mat-900 border-2 border-mat-700 p-10 rounded-[3.5rem] relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
            <button onClick={() => setEditingPost(null)} className="absolute top-10 right-10 text-gray-500 hover:text-white"><X size={32} /></button>
            <h2 className="text-3xl font-black uppercase mb-10 font-exo tracking-tighter">
              {editingPost.id ? 'EDITAR_POST' : 'NUEVO_POST'}
            </h2>
            <form onSubmit={handleSavePost} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-2">Autor</label>
                <input
                  value={editingPost.author || ''}
                  onChange={e => setEditingPost({ ...editingPost, author: e.target.value })}
                  className="w-full bg-mat-800 border border-mat-700 p-4 rounded-xl text-white outline-none focus:border-mat-500"
                  placeholder="@mat32"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-2">Contenido</label>
                <textarea
                  required
                  value={editingPost.content || ''}
                  onChange={e => setEditingPost({ ...editingPost, content: e.target.value })}
                  className="w-full bg-mat-800 border border-mat-700 p-5 h-40 rounded-2xl text-white outline-none focus:border-mat-500 resize-none"
                  placeholder="Texto del post, acepta #hashtags..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-2">URL Imagen</label>
                <input
                  value={editingPost.imageUrl || ''}
                  onChange={e => setEditingPost({ ...editingPost, imageUrl: e.target.value })}
                  className="w-full bg-mat-800 border border-mat-700 p-4 rounded-xl text-white font-mono text-xs outline-none focus:border-mat-500"
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                  <Music size={12} /> Bandcamp Embed URL
                </label>
                <input
                  value={(editingPost as any).musicEmbed || ''}
                  onChange={e => setEditingPost({ ...editingPost, musicEmbed: e.target.value } as any)}
                  className="w-full bg-mat-800 border border-mat-700 p-4 rounded-xl text-white font-mono text-xs outline-none focus:border-mat-500"
                  placeholder="https://bandcamp.com/EmbeddedPlayer/album=..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest ml-2">URL Afiliado (Bandcamp compra)</label>
                <input
                  value={(editingPost as any).affiliateUrl || ''}
                  onChange={e => setEditingPost({ ...editingPost, affiliateUrl: e.target.value } as any)}
                  className="w-full bg-mat-800 border border-mat-700 p-4 rounded-xl text-white font-mono text-xs outline-none focus:border-mat-500"
                  placeholder="https://artist.bandcamp.com/album/..."
                />
              </div>
              <button type="submit" disabled={isProcessing} className="w-full py-6 bg-mat-500 text-white font-black uppercase rounded-[2rem] shadow-2xl flex items-center justify-center gap-4 transition-all hover:bg-mat-400">
                {isProcessing ? <Loader2 className="animate-spin" /> : <Save size={20} />} GUARDAR_POST
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL GUEST LIST */}
      {viewingGuestList && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
           <div className="w-full max-w-xl bg-mat-900 border-2 border-mat-700 p-10 rounded-[3.5rem] relative max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
              <button onClick={() => setViewingGuestList(null)} className="absolute top-10 right-10 text-gray-500 hover:text-white"><X size={32} /></button>
              <h2 className="text-2xl font-black uppercase mb-2 font-exo tracking-tighter">GUEST_LIST</h2>
              <p className="text-mat-500 text-[10px] font-black uppercase tracking-widest mb-10">{viewingGuestList.title}</p>
              
              <div className="space-y-3">
                {guestList.length === 0 ? (
                  <p className="text-center py-10 text-gray-600 font-black text-xs uppercase">No hay asistentes registrados</p>
                ) : (
                  guestList.map((guest, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-mat-800/50 border border-mat-700 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-mat-500 rounded-full flex items-center justify-center text-white text-[10px] font-black">{i+1}</div>
                        <span className="text-xs font-black text-white uppercase">{guest.name}</span>
                      </div>
                      <CheckCircle size={16} className="text-emerald-500" />
                    </div>
                  ))
                )}
              </div>
              
              <button onClick={() => window.print()} className="w-full mt-10 py-4 border border-mat-700 text-gray-500 hover:text-white font-black uppercase text-[10px] tracking-widest rounded-2xl transition-all">
                IMPRIMIR_LISTA
              </button>
           </div>
        </div>
      )}
    </div>
  );
};