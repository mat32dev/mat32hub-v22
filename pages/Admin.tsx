import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, Disc, Plus, LogOut, CheckCircle, Loader2, 
  Calendar, ShoppingBag, Mail, Trash2, Edit3, X, Save, ShieldCheck, UserCheck, Upload, Image as ImageIcon,
  Lock, User, Music
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { Event, VinylRecord, Sale, InboxMessage } from '../types';

type AdminTab = 'agenda' | 'inventario' | 'ventas' | 'mensajes';

export const Admin: React.FC = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('agenda');
  const [loading, setLoading] = useState(true);
  
  const [events, setEvents] = useState<Event[]>([]);
  const [records, setRecords] = useState<VinylRecord[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [inbox, setInbox] = useState<InboxMessage[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  
  const [editingEvent, setEditingEvent] = useState<Partial<Event> | null>(null);
  const [editingRecord, setEditingRecord] = useState<Partial<VinylRecord> | null>(null);
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

  const handleSaveEvent = async (e: React.FormEvent) => {
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

  const handleSaveRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    setIsProcessing(true);
    if (editingRecord.id) await dataService.updateRecord(editingRecord.id, editingRecord);
    else await dataService.createRecord(editingRecord);
    setEditingRecord(null);
    setIsProcessing(false);
    loadData();
    setStatus("Inventario actualizado");
    setTimeout(() => setStatus(null), 3000);
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
        <div className="flex bg-mat-800 p-1 rounded-xl border border-mat-700">
           {(['agenda', 'inventario', 'ventas', 'mensajes'] as AdminTab[]).map(tab => (
             <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-mat-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>{tab}</button>
           ))}
        </div>
        <button onClick={() => { dataService.logout(); setIsAuth(false); }} className="p-3 bg-mat-800 border border-mat-700 rounded-xl text-gray-500 hover:text-red-500 transition-all"><LogOut size={20} /></button>
      </header>

      <main className="container mx-auto px-6 pt-10 max-w-6xl">
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
                        <button onClick={() => setEditingEvent(ev)} className="p-3 bg-mat-900 text-gray-500 hover:text-white rounded-xl border border-mat-700"><Edit3 size={18} /></button>
                        <button onClick={async () => { if(confirm("¿Estás seguro de inyectar el protocolo de eliminación?")) { await dataService.deleteEvent(ev.id); loadData(); } }} className="p-3 bg-mat-900 text-gray-500 hover:text-red-500 rounded-xl border border-mat-700"><Trash2 size={18} /></button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'inventario' && (
          <div className="bg-mat-900 border border-mat-800 p-10 rounded-[2.5rem] shadow-2xl animate-fade-in">
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
                        {/* Fix: Removed title prop from Music icon to resolve TypeScript error as it is not a supported prop in LucideProps */}
                        {rec.streamingLink && <Music size={14} className="text-emerald-500" />}
                        <button onClick={() => setEditingRecord(rec)} className="p-3 bg-mat-900 text-gray-500 hover:text-white rounded-xl border border-mat-700"><Edit3 size={18} /></button>
                        <button onClick={async () => { if(confirm("¿Eliminar vinilo del Hub?")) { await dataService.deleteRecord(rec.id); loadData(); } }} className="p-3 bg-mat-900 text-gray-500 hover:text-red-500 rounded-xl border border-mat-700"><Trash2 size={18} /></button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* ... Resto de pestañas (mensajes, ventas) se mantienen igual ... */}
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
                </div>
               ))
             )}
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

      {/* MODAL EDICIÓN DISCO (CON STREAMING LINK) */}
      {editingRecord && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
           <div className="w-full max-w-2xl bg-mat-900 border-2 border-mat-700 p-10 rounded-[3.5rem] relative max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
              <button onClick={() => setEditingRecord(null)} className="absolute top-10 right-10 text-gray-500 hover:text-white"><X size={32} /></button>
              <h2 className="text-3xl font-black uppercase mb-10 font-exo tracking-tighter">INVENTARIO_RECORDS</h2>
              <form onSubmit={handleSaveRecord} className="space-y-6">
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
                    <p className="text-[8px] text-gray-600 mt-1 italic uppercase">Pega el src del iframe de Bandcamp para habilitar la preview sonora.</p>
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
    </div>
  );
};