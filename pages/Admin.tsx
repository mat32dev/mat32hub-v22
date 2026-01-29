
import React, { useState, useEffect, useRef } from 'react';
import { 
  Disc, Plus, LogOut, CheckCircle, Loader2, 
  Calendar, Mail, Trash2, Edit3, X, Save, 
  Upload, Radio, Music, Check, Ban, AlertCircle, RefreshCw
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
        setActiveTab(session.role === 'ADMIN' ? 'agenda' : 'dashboard');
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
      const [ev, rec, msg, sel] = await Promise.all([
        dataService.getEvents(),
        dataService.getRecords(),
        dataService.getInbox(),
        dataService.getSelectors()
      ]);
      setEvents(ev);
      setRecords(rec);
      setInbox(msg);
      setSelectors(sel);
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsProcessing(true);
    
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get('email') as string;
    const pass = formData.get('password') as string;
    
    const success = await dataService.login(email, pass);
    if (success) {
      setSession(dataService.getSession());
    } else {
      setLoginError("Master Key incorrecta. Revisa el manual.");
    }
    setIsProcessing(false);
  };

  const saveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    setIsProcessing(true);
    if (editingEvent.id) await dataService.updateEvent(editingEvent.id, editingEvent);
    else await dataService.createEvent(editingEvent);
    setEditingEvent(null);
    setIsProcessing(false);
    loadAllData('ADMIN');
    showNotification("Agenda actualizada");
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
    showNotification("Stock actualizado");
  };

  const deleteItem = async (type: 'event' | 'record', id: string) => {
    if (!confirm("¿Eliminar permanentemente de la matriz?")) return;
    if (type === 'event') await dataService.deleteEvent(id);
    else await dataService.deleteRecord(id);
    loadAllData('ADMIN');
    showNotification("Dato eliminado");
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
      <div className="w-full max-w-sm bg-mat-900 border border-mat-800 p-10 rounded-[3rem] text-center shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-mat-500 rounded-t-[3rem]"></div>
        <Disc className="w-16 h-16 text-mat-500 mx-auto mb-8 animate-spin-slow opacity-30" />
        <h1 className="text-white text-2xl font-black uppercase mb-2 font-exo tracking-tight">MATRIX_ACCESS</h1>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-10">Portal del Administrador Mat32</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input name="email" type="email" required className="w-full bg-mat-800 border border-mat-700 p-5 text-white text-center rounded-2xl outline-none focus:border-mat-500 text-xs font-bold" placeholder="Tu Email" />
          <input name="password" type="password" required className="w-full bg-mat-800 border border-mat-700 p-5 text-white text-center rounded-2xl outline-none focus:border-mat-500 text-xs font-bold" placeholder="Master Password" />
          <button type="submit" disabled={isProcessing} className="w-full py-5 bg-mat-500 text-white font-black uppercase rounded-2xl text-[10px] tracking-widest shadow-xl hover:bg-mat-400 transition-all flex items-center justify-center gap-2">
            {isProcessing ? <Loader2 size={16} className="animate-spin" /> : 'DESBLOQUEAR'}
          </button>
          {loginError && (
            <div className="flex items-center justify-center gap-2 text-red-500 text-[9px] font-bold uppercase mt-4 animate-pulse">
              <AlertCircle size={14} /> {loginError}
            </div>
          )}
        </form>

        <div className="mt-12 pt-6 border-t border-mat-800 text-[8px] text-gray-600 font-bold uppercase tracking-[0.2em] space-y-2">
           <p>Master Keys de Demostración:</p>
           <p className="text-mat-500">ADMIN: mat32_admin</p>
           <p className="text-mat-500">DJ: mat32_dj</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-mat-950 text-white pt-24 pb-20">
      <header className="bg-mat-900 border-b border-mat-800 h-20 px-8 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-mat-500 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-lg">M</div>
           <div>
              <h2 className="text-xs font-black font-exo leading-none mb-1">{session.name.toUpperCase()}</h2>
              <span className="text-[8px] text-mat-400 font-bold tracking-widest uppercase">{session.role} PORTAL</span>
           </div>
        </div>

        <div className="flex bg-mat-800 p-1 rounded-xl border border-mat-700">
           {session.role === 'ADMIN' && (
             <>
                {(['agenda', 'tienda', 'djs', 'crm'] as string[]).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2.5 rounded-lg text-[9px] font-black uppercase transition-all ${activeTab === tab ? 'bg-mat-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>{tab}</button>
                ))}
             </>
           )}
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
             
             {/* --- AGENDA --- */}
             {activeTab === 'agenda' && (
               <div className="bg-mat-900 border border-mat-800 p-10 rounded-[3rem] shadow-2xl">
                  <div className="flex flex-col md:flex-row justify-between mb-12 gap-6 items-center">
                     <h3 className="text-2xl font-black uppercase font-exo flex items-center gap-4"><Calendar className="text-mat-500" /> Eventos en la Matriz</h3>
                     <button onClick={() => setEditingEvent({ title: '', date: '', time: '21:00', price: 0, description: '', category: 'Hi-Fi Session' })} className="px-8 py-4 bg-mat-500 text-white text-[10px] font-black uppercase rounded-2xl flex items-center gap-3 hover:bg-mat-400 shadow-xl transition-all">
                       <Plus size={16} /> NUEVO_EVENTO
                     </button>
                  </div>
                  <div className="grid gap-4">
                     {events.length === 0 ? <p className="text-center py-20 text-gray-500 uppercase tracking-widest text-[10px]">Sin eventos activos.</p> : events.map(ev => (
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

             {/* --- TIENDA --- */}
             {activeTab === 'tienda' && (
                <div className="bg-mat-900 border border-mat-800 p-10 rounded-[3rem] shadow-2xl">
                  <div className="flex flex-col md:flex-row justify-between mb-12 gap-6 items-center">
                     <h3 className="text-2xl font-black uppercase font-exo flex items-center gap-4"><Music className="text-mat-500" /> Inventario de Vinilos</h3>
                     <button onClick={() => setEditingRecord({ title: '', artist: '', price: 25, genre: 'Electronic', stock: 1, condition: 'NM' })} className="px-8 py-4 bg-mat-500 text-white text-[10px] font-black uppercase rounded-2xl flex items-center gap-3 hover:bg-mat-400 shadow-xl transition-all">
                       <Plus size={16} /> REGISTRAR_VINILO
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

             {/* --- CRM --- */}
             {activeTab === 'crm' && (
                <div className="bg-mat-900 border border-mat-800 p-10 rounded-[3rem] shadow-2xl">
                   <h3 className="text-2xl font-black uppercase font-exo flex items-center gap-4 mb-10"><Mail className="text-mat-500" /> Buzón de Entrada</h3>
                   <div className="space-y-4">
                      {inbox.length === 0 ? <p className="text-center py-20 text-gray-500 uppercase tracking-widest text-[10px]">Sin mensajes nuevos.</p> : inbox.map(msg => (
                         <div key={msg.id} className="p-8 bg-mat-800 border border-mat-700 rounded-[2rem]">
                            <div className="flex justify-between mb-4">
                               <span className="text-[10px] font-black text-mat-500 uppercase tracking-widest">{msg.type} • DE: {msg.sender}</span>
                               <span className="text-[10px] text-gray-600">{new Date(msg.date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-gray-300 italic">"{msg.content}"</p>
                         </div>
                      ))}
                   </div>
                </div>
             )}
          </div>
        )}
      </main>

      {/* --- MODALES --- */}
      {editingEvent && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 overflow-y-auto">
           <div className="w-full max-w-2xl bg-mat-900 border border-mat-800 rounded-[3.5rem] p-12 relative shadow-2xl my-10">
              <button onClick={() => setEditingEvent(null)} className="absolute top-10 right-10 text-gray-500 hover:text-white"><X size={32} /></button>
              <h2 className="text-4xl font-black uppercase font-exo mb-12 text-white">EDITOR_EVENTO</h2>
              <form onSubmit={saveEvent} className="space-y-8">
                 <input required value={editingEvent.title} onChange={e => setEditingEvent({...editingEvent, title: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-6 rounded-2xl text-white outline-none focus:border-mat-500 text-xs font-bold" placeholder="TÍTULO" />
                 <div className="grid grid-cols-2 gap-8">
                    <input required type="date" value={editingEvent.date} onChange={e => setEditingEvent({...editingEvent, date: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-6 rounded-2xl text-white text-xs outline-none focus:border-mat-500" />
                    <input required type="time" value={editingEvent.time} onChange={e => setEditingEvent({...editingEvent, time: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-6 rounded-2xl text-white text-xs outline-none focus:border-mat-500" />
                 </div>
                 <div className="flex items-center gap-8">
                    <div onClick={() => fileInputRef.current?.click()} className="w-24 h-24 bg-mat-800 border-2 border-dashed border-mat-700 rounded-3xl flex items-center justify-center cursor-pointer hover:border-mat-500 overflow-hidden">
                       {editingEvent.imageUrl ? <img src={editingEvent.imageUrl} className="w-full h-full object-cover" /> : <Upload size={32} className="text-mat-800" />}
                    </div>
                    <input value={editingEvent.imageUrl} onChange={e => setEditingEvent({...editingEvent, imageUrl: e.target.value})} className="flex-1 bg-mat-800 border border-mat-700 p-6 rounded-2xl text-[9px] text-gray-500 font-bold" placeholder="URL DE IMAGEN" />
                    <input type="file" ref={fileInputRef} onChange={(e) => handleImageUpload(e, 'event')} className="hidden" accept="image/*" />
                 </div>
                 <textarea required value={editingEvent.description} onChange={e => setEditingEvent({...editingEvent, description: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-6 h-32 rounded-2xl text-white text-xs resize-none outline-none focus:border-mat-500" placeholder="DESCRIPCIÓN DEL EVENTO" />
                 <button type="submit" disabled={isProcessing} className="w-full py-8 bg-mat-500 text-white font-black uppercase text-[11px] tracking-[0.4em] rounded-[2rem] shadow-2xl flex items-center justify-center gap-4 hover:bg-mat-400 transition-all">
                    {isProcessing ? <Loader2 className="animate-spin" /> : <Save size={20} />} GUARDAR_EVENTO
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* NOTIFICACIÓN */}
      {status && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] animate-fade-in">
           <div className="bg-mat-900 border border-mat-500 p-4 px-8 rounded-full shadow-[0_0_50px_rgba(234,88,12,0.4)] flex items-center gap-4">
              <CheckCircle className="text-mat-500" size={18} />
              <span className="text-[9px] font-black uppercase tracking-widest">{status}</span>
           </div>
        </div>
      )}
    </div>
  );
};
