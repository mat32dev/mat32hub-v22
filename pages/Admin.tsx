
import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, Disc, Plus, LogOut, CheckCircle, Loader2, 
  Calendar, ShoppingBag, Mail, Trash2, Edit3, X, Save, ShieldCheck, UserCheck, Upload, Image as ImageIcon,
  User, Music, Radio, Briefcase, LayoutGrid, Heart
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { Event, VinylRecord, Sale, InboxMessage, UserSession, UserRole } from '../types';

export const Admin: React.FC = () => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [activeTab, setActiveTab] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  const [events, setEvents] = useState<Event[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [inbox, setInbox] = useState<InboxMessage[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<Partial<Event> | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const s = dataService.getSession();
    setSession(s);
    if (s) {
      if (s.role === 'ADMIN') setActiveTab('agenda');
      else if (s.role === 'DJ') setActiveTab('perfil');
      else setActiveTab('pedidos');
      loadData(s.role);
    } else {
      setLoading(false);
    }
    
    const sync = () => setSession(dataService.getSession());
    window.addEventListener('mat32_data_changed', sync);
    return () => window.removeEventListener('mat32_data_changed', sync);
  }, []);

  const loadData = async (role: UserRole) => {
    setLoading(true);
    if (role === 'ADMIN') {
      const [ev, sal, msg] = await Promise.all([
        dataService.getEvents(),
        dataService.getSales(),
        dataService.getInbox()
      ]);
      setEvents(ev);
      setSales(sal);
      setInbox(msg);
    } else if (role === 'DJ') {
      // Logic for DJ bookings or slots
    } else {
      // Logic for customer purchases
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
      if (s) {
        if (s.role === 'ADMIN') setActiveTab('agenda');
        else if (s.role === 'DJ') setActiveTab('perfil');
        else setActiveTab('pedidos');
        loadData(s.role);
      }
    } else setStatus("Credenciales incorrectas. (Pista: mat32_admin / mat32_dj / mat32_user)");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingEvent) {
      const reader = new FileReader();
      reader.onloadend = () => setEditingEvent({ ...editingEvent, imageUrl: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    setIsProcessing(true);
    if (editingEvent.id) await dataService.updateEvent(editingEvent.id, editingEvent);
    else await dataService.createEvent(editingEvent);
    setEditingEvent(null);
    setIsProcessing(false);
    loadData('ADMIN');
    setStatus("Guardado correctamente");
    setTimeout(() => setStatus(null), 3000);
  };

  if (!session) return (
    <div className="min-h-screen bg-mat-950 flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-mat-900 border border-mat-800 p-10 rounded-3xl text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-mat-500"></div>
        <Disc className="w-12 h-12 text-mat-500 mx-auto mb-6 animate-spin-slow opacity-20" />
        <h1 className="text-white text-xl font-black uppercase mb-2 font-exo">PORTAL MAT32</h1>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-8 italic">Acceso exclusivo comunidad</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input name="email" type="email" required className="w-full bg-mat-800 border border-mat-700 p-4 text-white text-center rounded-xl outline-none focus:border-mat-500 text-xs font-bold" placeholder="Email" />
          <input name="password" type="password" required className="w-full bg-mat-800 border border-mat-700 p-4 text-white text-center rounded-xl outline-none focus:border-mat-500 text-xs font-bold" placeholder="Contraseña" />
          <button className="w-full py-4 bg-mat-500 text-white font-bold uppercase rounded-xl text-[10px] tracking-widest shadow-xl">ENTRAR</button>
          {status && <p className="text-red-500 text-[10px] font-bold uppercase">{status}</p>}
        </form>

        <div className="mt-8 pt-8 border-t border-mat-800 text-[8px] text-gray-600 uppercase tracking-widest leading-relaxed">
          Usa las claves maestras para probar roles:<br/>
          mat32_admin / mat32_dj / mat32_user
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-mat-950 text-white pt-24 pb-20">
      <header className="bg-mat-900 border-b border-mat-800 h-20 px-8 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-mat-500 rounded-xl flex items-center justify-center font-black text-white text-sm">
             {session.name[0]}
           </div>
           <div>
              <h2 className="text-sm font-black font-exo leading-none">{session.name.toUpperCase()}</h2>
              <span className="text-[8px] text-mat-500 font-bold tracking-widest uppercase">{session.role} PORTAL</span>
           </div>
        </div>

        <div className="flex bg-mat-800 p-1 rounded-xl">
           {session.role === 'ADMIN' && (
             <>
                {(['agenda', 'ventas', 'mensajes'] as string[]).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase transition-all ${activeTab === tab ? 'bg-mat-500 text-white' : 'text-gray-500'}`}>{tab}</button>
                ))}
             </>
           )}
           {session.role === 'DJ' && (
             <>
                {(['perfil', 'sesiones'] as string[]).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase transition-all ${activeTab === tab ? 'bg-mat-500 text-white' : 'text-gray-500'}`}>{tab}</button>
                ))}
             </>
           )}
           {session.role === 'CUSTOMER' && (
             <>
                {(['pedidos', 'wishlist'] as string[]).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase transition-all ${activeTab === tab ? 'bg-mat-500 text-white' : 'text-gray-500'}`}>{tab}</button>
                ))}
             </>
           )}
        </div>
        
        <button onClick={() => { dataService.logout(); setSession(null); }} className="p-2.5 bg-mat-800 rounded-xl border border-mat-700 text-gray-400 hover:text-red-500 transition-colors">
          <LogOut size={18} />
        </button>
      </header>

      <main className="container mx-auto px-6 pt-10">
        {loading ? (
          <div className="flex justify-center py-40"><Loader2 className="animate-spin text-mat-500 w-10 h-10" /></div>
        ) : (
          <div className="animate-fade-in">
             {/* ROL ADMIN: GESTIÓN TOTAL */}
             {session.role === 'ADMIN' && (
               <>
                 {activeTab === 'agenda' && (
                   <div className="bg-mat-900 border border-mat-800 p-8 rounded-3xl">
                      <div className="flex justify-between mb-8 items-center">
                         <h3 className="text-xl font-bold uppercase font-exo flex items-center gap-3"><Calendar className="text-mat-500" /> Agenda de Eventos</h3>
                         <button onClick={() => setEditingEvent({ title: '', date: '', time: '21:00', price: 0, description: '' })} className="px-6 py-3 bg-mat-500 text-white text-[10px] font-black uppercase rounded-xl flex items-center gap-2 hover:bg-mat-400">
                           <Plus size={16} /> Nuevo Evento
                         </button>
                      </div>
                      <div className="space-y-4">
                         {events.map(ev => (
                           <div key={ev.id} className="flex items-center justify-between p-5 bg-mat-800 rounded-2xl border border-mat-700 hover:border-mat-500 transition-colors">
                              <div className="flex items-center gap-6">
                                 <img src={ev.imageUrl} className="w-12 h-12 object-cover rounded-xl shadow-lg grayscale hover:grayscale-0 transition-all" />
                                 <div>
                                    <p className="font-black uppercase text-sm">{ev.title}</p>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{ev.date} @ {ev.time}</p>
                                 </div>
                              </div>
                              <div className="flex gap-2">
                                 <button onClick={() => setEditingEvent(ev)} className="p-3 bg-mat-900 rounded-xl text-gray-400 hover:text-white"><Edit3 size={16} /></button>
                                 <button onClick={async () => { if(confirm("¿ELIMINAR EVENTO?")) { await dataService.deleteEvent(ev.id); loadData('ADMIN'); } }} className="p-3 bg-mat-900 rounded-xl text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                 )}

                 {activeTab === 'ventas' && (
                   <div className="bg-mat-900 border border-mat-800 p-8 rounded-3xl">
                      <h3 className="text-xl font-bold uppercase font-exo mb-8 flex items-center gap-3"><ShoppingBag className="text-mat-500" /> Registro de Ventas</h3>
                      <div className="space-y-4">
                         {sales.length === 0 ? <p className="text-center text-gray-600 italic py-10">No hay ventas registradas.</p> : sales.map(s => (
                           <div key={s.id} className="p-6 bg-mat-800 rounded-2xl border border-mat-700 flex items-center justify-between">
                              <div className="flex items-center gap-6">
                                 <div className="w-12 h-12 bg-mat-900 rounded-xl flex items-center justify-center text-mat-500"><Briefcase /></div>
                                 <div>
                                    <p className="text-sm font-black text-white uppercase">{s.customerName || 'Venta Local'}</p>
                                    <p className="text-[10px] text-gray-500 uppercase">{s.timestamp}</p>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="text-xl font-black font-exo">€{s.total}</p>
                                 <span className="text-[8px] font-bold text-mat-500 uppercase tracking-widest">{s.status}</span>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                 )}

                 {activeTab === 'mensajes' && (
                   <div className="bg-mat-900 border border-mat-800 p-8 rounded-3xl">
                      <h3 className="text-xl font-bold uppercase font-exo mb-8 flex items-center gap-3"><Mail className="text-mat-500" /> Buzón de Entrada</h3>
                      <div className="space-y-4">
                         {inbox.map(msg => (
                           <div key={msg.id} className="p-6 bg-mat-800 rounded-2xl border border-mat-700">
                              <div className="flex justify-between mb-3 items-center">
                                 <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black text-mat-500 uppercase">{msg.type}</span>
                                    <span className="text-white font-bold uppercase text-xs">{msg.sender}</span>
                                 </div>
                                 <span className="text-[9px] text-gray-600 font-bold">{msg.date}</span>
                              </div>
                              <p className="text-xs text-gray-400 italic">"{msg.content}"</p>
                           </div>
                         ))}
                      </div>
                   </div>
                 )}
               </>
             )}

             {/* ROL DJ: PERFIL Y SESIONES */}
             {session.role === 'DJ' && (
               <div className="grid lg:grid-cols-12 gap-10">
                  <div className="lg:col-span-4">
                     <div className="bg-mat-900 border border-mat-800 p-8 rounded-3xl">
                        <div className="w-24 h-24 bg-mat-800 rounded-2xl border border-mat-700 mx-auto mb-6 flex items-center justify-center overflow-hidden">
                           <ImageIcon className="text-mat-800" size={32} />
                        </div>
                        <h3 className="text-center font-black uppercase text-xl font-exo mb-6">{session.name}</h3>
                        <div className="space-y-4">
                           <div className="p-4 bg-mat-800 rounded-xl border border-mat-700">
                              <span className="block text-[8px] font-bold text-mat-500 uppercase mb-1">Status en el local</span>
                              <span className="text-xs font-black uppercase">SELECTOR RESIDENTE</span>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="lg:col-span-8">
                     <div className="bg-mat-900 border border-mat-800 p-10 rounded-3xl">
                        <h3 className="text-xl font-black uppercase font-exo mb-8 flex items-center gap-3"><Settings className="text-mat-500" /> Editar Perfil Público</h3>
                        <form className="space-y-6">
                           <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Alias DJ</label>
                                 <input defaultValue={session.name} className="w-full bg-mat-800 border border-mat-700 p-4 text-white text-xs font-bold rounded-xl" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Mixcloud / Soundcloud</label>
                                 <input defaultValue="https://soundcloud.com/mat32" className="w-full bg-mat-800 border border-mat-700 p-4 text-white text-xs font-bold rounded-xl" />
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Biografía Corta</label>
                              <textarea className="w-full bg-mat-800 border border-mat-700 p-4 h-32 text-white text-xs font-medium rounded-xl resize-none" placeholder="Selector de vinilos enfocado en el sonido analógico..."></textarea>
                           </div>
                           <button type="button" className="w-full py-4 bg-mat-500 text-white font-black uppercase tracking-widest text-[10px] rounded-xl">ACTUALIZAR DATOS</button>
                        </form>
                     </div>
                  </div>
               </div>
             )}

             {/* ROL CUSTOMER: PEDIDOS Y FAVORITOS */}
             {session.role === 'CUSTOMER' && (
               <div className="grid lg:grid-cols-12 gap-10">
                  <div className="lg:col-span-12">
                     <div className="bg-mat-900 border border-mat-800 p-10 rounded-3xl">
                        <h3 className="text-xl font-black uppercase font-exo mb-8 flex items-center gap-3"><ShoppingBag className="text-mat-500" /> Mis Pedidos</h3>
                        <div className="py-20 text-center border-2 border-dashed border-mat-800 rounded-3xl">
                           <LayoutGrid className="mx-auto text-mat-800 mb-6" size={40} />
                           <p className="text-gray-600 font-bold uppercase text-[10px] tracking-widest">Sincronizando con tu historial de transacciones...</p>
                        </div>
                     </div>
                  </div>
               </div>
             )}
          </div>
        )}
      </main>

      {/* EDIT MODAL ADMIN */}
      {editingEvent && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-6">
           <div className="w-full max-w-xl bg-mat-900 border border-mat-700 p-12 rounded-[3rem] relative max-h-[90vh] overflow-y-auto shadow-2xl">
              <button onClick={() => setEditingEvent(null)} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"><X size={28} /></button>
              <h2 className="text-2xl font-black uppercase font-exo mb-10 text-white tracking-tighter">EDITAR_SESIÓN</h2>
              <form onSubmit={handleSave} className="space-y-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Título</label>
                    <input required value={editingEvent.title} onChange={e => setEditingEvent({...editingEvent, title: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-5 rounded-2xl text-white outline-none focus:border-mat-500 text-xs font-bold" placeholder="P.ej: Deep Listening Night" />
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Fecha</label>
                       <input required type="date" value={editingEvent.date} onChange={e => setEditingEvent({...editingEvent, date: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-5 rounded-2xl text-white outline-none focus:border-mat-500 text-xs" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Hora</label>
                       <input required type="time" value={editingEvent.time} onChange={e => setEditingEvent({...editingEvent, time: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-5 rounded-2xl text-white outline-none focus:border-mat-500 text-xs" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Imagen de Sesión</label>
                    <div className="flex items-center gap-6">
                       <div onClick={() => fileInputRef.current?.click()} className="w-24 h-24 bg-mat-800 border-2 border-dashed border-mat-700 rounded-2xl flex items-center justify-center cursor-pointer hover:border-mat-500 overflow-hidden relative group">
                          {editingEvent.imageUrl ? <img src={editingEvent.imageUrl} className="w-full h-full object-cover group-hover:opacity-30 transition-opacity" /> : <Upload size={24} className="text-mat-700" />}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center bg-black/40 transition-all">
                             <Plus className="text-white" />
                          </div>
                       </div>
                       <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                       <input value={editingEvent.imageUrl} onChange={e => setEditingEvent({...editingEvent, imageUrl: e.target.value})} className="flex-1 bg-mat-800 border border-mat-700 p-5 rounded-2xl text-[9px] text-gray-500 font-bold" placeholder="Pega una URL externa..." />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">Descripción</label>
                    <textarea required value={editingEvent.description} onChange={e => setEditingEvent({...editingEvent, description: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-5 h-28 rounded-2xl text-white outline-none focus:border-mat-500 text-xs font-medium resize-none" placeholder="Qué sonará, quién pincha..." />
                 </div>
                 <button type="submit" disabled={isProcessing} className="w-full py-6 bg-mat-500 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl flex items-center justify-center gap-4 hover:bg-mat-400 transition-all shadow-xl shadow-mat-500/10">
                    {isProcessing ? <Loader2 className="animate-spin" /> : <Save size={20} />} GUARDAR CAMBIOS
                 </button>
              </form>
           </div>
        </div>
      )}

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
