
import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, Disc, Plus, LogOut, CheckCircle, Loader2, 
  Calendar, ShoppingBag, Mail, Trash2, Edit3, X, Save, ShieldCheck, UserCheck, Upload, Image as ImageIcon,
  Lock, User
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { Event, VinylRecord, Sale, InboxMessage } from '../types';

type AdminTab = 'agenda' | 'ventas' | 'mensajes';

export const Admin: React.FC = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('agenda');
  const [loading, setLoading] = useState(true);
  
  const [events, setEvents] = useState<Event[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [inbox, setInbox] = useState<InboxMessage[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<Partial<Event> | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const auth = dataService.isAuthenticated();
    setIsAuth(auth);
    if (auth) loadData();
    else setLoading(false);
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [ev, sal, msg] = await Promise.all([
      dataService.getEvents(),
      dataService.getSales(),
      dataService.getInbox()
    ]);
    setEvents(ev);
    setSales(sal);
    setInbox(msg);
    setLoading(false);
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
      setStatus("Acceso Denegado. Señal incorrecta.");
    }
    setIsProcessing(false);
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
    loadData();
    setStatus("Guardado correctamente");
    setTimeout(() => setStatus(null), 3000);
  };

  if (!isAuth) return (
    <div className="min-h-screen bg-mat-950 flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-mat-900 border-2 border-mat-800 p-10 rounded-[3rem] text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
        <div className="mb-10 inline-flex items-center justify-center w-20 h-20 bg-mat-800 rounded-2xl border border-mat-700 shadow-xl">
           <Lock size={32} className="text-mat-500" />
        </div>
        <h1 className="text-white text-3xl font-black uppercase mb-2 font-exo tracking-tighter">MAT32_MATRIX</h1>
        <p className="text-gray-600 text-[9px] font-black uppercase tracking-[0.4em] mb-10">ADMIN_PORTAL_V3.2</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
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
    <div className="min-h-screen bg-mat-950 text-white pt-24 pb-20">
      <header className="bg-mat-900 border-b border-mat-800 h-20 px-8 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-4">
           <Disc className="text-mat-500 animate-spin-slow" size={24} />
           <h2 className="text-xl font-black font-exo tracking-tighter">MAT32_CORE</h2>
        </div>
        <div className="flex bg-mat-800 p-1 rounded-xl border border-mat-700">
           {(['agenda', 'ventas', 'mensajes'] as AdminTab[]).map(tab => (
             <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-mat-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>{tab}</button>
           ))}
        </div>
        <button onClick={() => { dataService.logout(); setIsAuth(false); }} className="p-3 bg-mat-800 border border-mat-700 rounded-xl text-gray-500 hover:text-red-500 transition-all"><LogOut size={20} /></button>
      </header>

      <main className="container mx-auto px-6 pt-10 max-w-6xl">
        {activeTab === 'agenda' && (
          <div className="bg-mat-900 border border-mat-800 p-10 rounded-[2.5rem] shadow-2xl">
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
                        <button onClick={() => setEditingEvent(ev)} className="p-3 bg-mat-900 text-gray-500 hover:text-white rounded-xl border border-mat-700"><Edit3 size={18} /></button>
                        <button onClick={async () => { if(confirm("¿Estás seguro de inyectar el protocolo de eliminación?")) { await dataService.deleteEvent(ev.id); loadData(); } }} className="p-3 bg-mat-900 text-gray-500 hover:text-red-500 rounded-xl border border-mat-700"><Trash2 size={18} /></button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'mensajes' && (
          <div className="space-y-6">
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
                      <span className="text-[9px] text-gray-700 font-black">{msg.date}</span>
                   </div>
                   <div className="bg-mat-950 p-6 rounded-2xl border border-mat-800">
                      <p className="text-gray-400 italic text-sm leading-relaxed">"{msg.content}"</p>
                   </div>
                   <div className="mt-6 flex items-center gap-4">
                      <span className="px-4 py-1.5 bg-mat-800 rounded-lg text-[8px] font-black text-gray-500 uppercase tracking-widest border border-mat-700">{msg.type}</span>
                   </div>
                </div>
               ))
             )}
          </div>
        )}

        {activeTab === 'ventas' && (
           <div className="bg-mat-900 border border-mat-800 p-10 rounded-[2.5rem] shadow-2xl">
              <h3 className="text-2xl font-black uppercase font-exo mb-10 tracking-tighter flex items-center gap-4">
                 <ShoppingBag size={24} className="text-mat-500" /> Registro de Transacciones
              </h3>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="border-b border-mat-800 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                          <th className="pb-6">ID_SALE</th>
                          <th className="pb-6">ITEM</th>
                          <th className="pb-6">FECHA</th>
                          <th className="pb-6">TOTAL</th>
                          <th className="pb-6">ESTADO</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-mat-800">
                       {sales.map(sale => (
                          <tr key={sale.id} className="text-sm group hover:bg-mat-800/30 transition-colors">
                             <td className="py-6 font-mono text-[10px] text-gray-500">{sale.id}</td>
                             <td className="py-6">
                                <span className="font-black uppercase text-xs text-white">
                                   {sale.items?.[0]?.title || 'Multi Item Sale'}
                                </span>
                             </td>
                             <td className="py-6 text-[10px] text-gray-500 uppercase">{sale.timestamp}</td>
                             <td className="py-6 font-black text-mat-500">€{sale.total}</td>
                             <td className="py-6">
                                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 rounded-lg text-[8px] font-black uppercase">COMPLETADO</span>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        )}
      </main>

      {editingEvent && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
           <div className="w-full max-w-xl bg-mat-900 border-2 border-mat-700 p-10 md:p-14 rounded-[3.5rem] relative max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
              <button onClick={() => setEditingEvent(null)} className="absolute top-10 right-10 text-gray-500 hover:text-white"><X size={32} /></button>
              <h2 className="text-3xl font-black uppercase mb-10 font-exo tracking-tighter">PROTOCOLO_EVENTO</h2>
              <form onSubmit={handleSave} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-2">Título de la Sesión</label>
                    <input required value={editingEvent.title} onChange={e => setEditingEvent({...editingEvent, title: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-5 rounded-2xl text-white outline-none focus:border-mat-500 font-bold" placeholder="P.EJ: ANALOG DEEP SESSIONS" />
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-2">Fecha</label>
                       <input required type="date" value={editingEvent.date} onChange={e => setEditingEvent({...editingEvent, date: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-5 rounded-2xl text-white outline-none focus:border-mat-500 font-mono" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-2">Hora Inicio</label>
                       <input required type="time" value={editingEvent.time} onChange={e => setEditingEvent({...editingEvent, time: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-5 rounded-2xl text-white outline-none focus:border-mat-500 font-mono" />
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-2">Precio (€)</label>
                       <input required type="number" value={editingEvent.price} onChange={e => setEditingEvent({...editingEvent, price: parseFloat(e.target.value)})} className="w-full bg-mat-800 border border-mat-700 p-5 rounded-2xl text-white outline-none focus:border-mat-500 font-mono" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-2">Categoría</label>
                       <select value={editingEvent.category} onChange={e => setEditingEvent({...editingEvent, category: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-5 rounded-2xl text-white outline-none focus:border-mat-500 font-black uppercase text-[10px]">
                          <option>Hi-Fi Sessions</option>
                          <option>Listening Session</option>
                          <option>Special Event</option>
                          <option>Electronic Hub</option>
                       </select>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-2">Imagen_Protocol</label>
                    <div className="flex items-center gap-6">
                       <div onClick={() => fileInputRef.current?.click()} className="w-24 h-24 bg-mat-800 border-2 border-dashed border-mat-700 rounded-3xl flex items-center justify-center cursor-pointer hover:border-mat-500 overflow-hidden shadow-xl">
                          {editingEvent.imageUrl ? <img src={editingEvent.imageUrl} className="w-full h-full object-cover" /> : <Upload size={24} className="text-mat-700" />}
                       </div>
                       <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                       <div className="flex-1">
                          <input value={editingEvent.imageUrl} onChange={e => setEditingEvent({...editingEvent, imageUrl: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-4 rounded-xl text-[10px] text-gray-500" placeholder="O pega una URL absoluta" />
                          <p className="text-[8px] text-gray-700 mt-2 uppercase tracking-widest">Formatos: JPG, PNG, WEBP (Max 2MB)</p>
                       </div>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-2">Descripción Contextual</label>
                    <textarea required value={editingEvent.description} onChange={e => setEditingEvent({...editingEvent, description: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-6 h-32 rounded-3xl text-white outline-none focus:border-mat-500 resize-none italic font-light leading-relaxed" placeholder="Describe la vibra de la sesión..." />
                 </div>
                 
                 <button type="submit" disabled={isProcessing} className="w-full py-6 bg-mat-500 text-white font-black uppercase text-[11px] tracking-[0.5em] rounded-[2rem] shadow-2xl flex items-center justify-center gap-4 transition-all hover:bg-mat-400 active:scale-95 disabled:opacity-50">
                    {isProcessing ? <Loader2 className="animate-spin" /> : <Save size={20} />} EJECUTAR_CAMBIO
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};
