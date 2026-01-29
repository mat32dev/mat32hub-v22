import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, Disc, Plus, LogOut, CheckCircle, Loader2, 
  Calendar, ShoppingBag, Mail, Trash2, Edit3, X, Save, ShieldCheck, UserCheck, Upload, Image as ImageIcon
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
    const pass = (e.target as any).password.value;
    if (await dataService.login('admin@mat32.com', pass)) {
      setIsAuth(true);
      loadData();
    } else setStatus("Contraseña incorrecta");
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
      <div className="w-full max-w-sm bg-mat-900 border border-mat-800 p-10 rounded-3xl text-center shadow-2xl">
        <h1 className="text-white text-2xl font-black uppercase mb-8">ADMINISTRACIÓN</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input name="password" type="password" required className="w-full bg-mat-800 border border-mat-700 p-4 text-white text-center rounded-xl outline-none focus:border-mat-500" placeholder="Contraseña" />
          <button className="w-full py-4 bg-mat-500 text-white font-bold uppercase rounded-xl">Entrar</button>
          {status && <p className="text-red-500 text-xs font-bold">{status}</p>}
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-mat-950 text-white pt-24 pb-20">
      <header className="bg-mat-900 border-b border-mat-800 h-20 px-8 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
        <h2 className="text-xl font-black font-exo">MAT32 PANEL</h2>
        <div className="flex bg-mat-800 p-1 rounded-xl">
           {(['agenda', 'ventas', 'mensajes'] as AdminTab[]).map(tab => (
             <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${activeTab === tab ? 'bg-mat-500 text-white' : 'text-gray-500'}`}>{tab}</button>
           ))}
        </div>
        <button onClick={() => { dataService.logout(); setIsAuth(false); }} className="p-2 bg-mat-800 rounded-lg"><LogOut size={18} /></button>
      </header>

      <main className="container mx-auto px-6 pt-10">
        {activeTab === 'agenda' && (
          <div className="bg-mat-900 border border-mat-800 p-8 rounded-3xl">
             <div className="flex justify-between mb-8">
                <h3 className="text-xl font-bold uppercase">Agenda de Eventos</h3>
                <button onClick={() => setEditingEvent({ title: '', date: '', time: '21:00', price: 0, description: '' })} className="px-4 py-2 bg-mat-500 text-white text-[10px] font-bold rounded-lg flex items-center gap-2">Nuevo Evento</button>
             </div>
             <div className="space-y-4">
                {events.map(ev => (
                  <div key={ev.id} className="flex items-center justify-between p-4 bg-mat-800 rounded-2xl">
                     <div className="flex items-center gap-4">
                        <img src={ev.imageUrl} className="w-10 h-10 object-cover rounded-lg" />
                        <div>
                           <p className="font-bold uppercase text-sm">{ev.title}</p>
                           <p className="text-[10px] text-gray-500">{ev.date} @ {ev.time}</p>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        <button onClick={() => setEditingEvent(ev)} className="p-2 text-gray-400 hover:text-white"><Edit3 size={16} /></button>
                        <button onClick={async () => { if(confirm("¿Borrar?")) { await dataService.deleteEvent(ev.id); loadData(); } }} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'mensajes' && (
          <div className="bg-mat-900 border border-mat-800 p-8 rounded-3xl space-y-4">
             {inbox.map(msg => (
               <div key={msg.id} className="p-5 bg-mat-800 rounded-2xl">
                  <div className="flex justify-between mb-2">
                     <span className="text-[10px] font-bold text-mat-500">{msg.sender}</span>
                     <span className="text-[9px] text-gray-600">{msg.date}</span>
                  </div>
                  <p className="text-xs text-gray-300 italic">"{msg.content}"</p>
               </div>
             ))}
          </div>
        )}
      </main>

      {editingEvent && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6">
           <div className="w-full max-w-xl bg-mat-900 border border-mat-700 p-10 rounded-3xl relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setEditingEvent(null)} className="absolute top-6 right-6 text-gray-500"><X size={24} /></button>
              <h2 className="text-2xl font-black uppercase mb-8">Evento</h2>
              <form onSubmit={handleSave} className="space-y-6">
                 <input required value={editingEvent.title} onChange={e => setEditingEvent({...editingEvent, title: e.target.value})} className="w-full bg-mat-800 p-4 rounded-xl text-white outline-none focus:border-mat-500" placeholder="Título" />
                 <div className="grid grid-cols-2 gap-4">
                    <input required type="date" value={editingEvent.date} onChange={e => setEditingEvent({...editingEvent, date: e.target.value})} className="bg-mat-800 p-4 rounded-xl text-white outline-none" />
                    <input required type="time" value={editingEvent.time} onChange={e => setEditingEvent({...editingEvent, time: e.target.value})} className="bg-mat-800 p-4 rounded-xl text-white outline-none" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-2">Imagen</label>
                    <div className="flex items-center gap-4">
                       <div onClick={() => fileInputRef.current?.click()} className="w-20 h-20 bg-mat-800 border-2 border-dashed border-mat-700 rounded-xl flex items-center justify-center cursor-pointer hover:border-mat-500 overflow-hidden">
                          {editingEvent.imageUrl ? <img src={editingEvent.imageUrl} className="w-full h-full object-cover" /> : <Upload size={20} />}
                       </div>
                       <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                       <input value={editingEvent.imageUrl} onChange={e => setEditingEvent({...editingEvent, imageUrl: e.target.value})} className="flex-1 bg-mat-800 p-4 rounded-xl text-[10px] text-gray-400" placeholder="O pega una URL" />
                    </div>
                 </div>
                 <textarea required value={editingEvent.description} onChange={e => setEditingEvent({...editingEvent, description: e.target.value})} className="w-full bg-mat-800 p-4 h-24 rounded-xl text-white outline-none resize-none" placeholder="Descripción" />
                 <button type="submit" disabled={isProcessing} className="w-full py-4 bg-mat-500 text-white font-bold uppercase rounded-xl">{isProcessing ? "Guardando..." : "Guardar"}</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};