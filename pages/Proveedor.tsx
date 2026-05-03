import React, { useEffect, useState } from 'react';
import { ChefHat, Loader2, LogOut, Clock, Users as UsersIcon, MapPin } from 'lucide-react';
import { dataService } from '../services/dataService';

const TOKEN_KEY = 'mat32_provider_token_v1';

interface Order {
  id: number;
  booking_id: number | null;
  customer_name: string;
  customer_phone: string | null;
  total_cents: number;
  status: string;
  payment_status: string;
  notes: string | null;
  pickup_time: string | null;
  created_at: string;
  booking_date: string | null;
  booking_slot: string | null;
  booking_table: string | null;
  items: Array<{ id: number; name: string; qty: number; notes: string | null; price: number }>;
}

export const Proveedor: React.FC = () => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'preparing' | 'ready'>('pending');

  const loggedIn = !!token;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const r = await dataService.providerLogin(pass);
      if (r.ok) {
        localStorage.setItem(TOKEN_KEY, r.token);
        // Also set as session so dataService passes Authorization header
        localStorage.setItem('mat32_auth_session_v15', JSON.stringify({ token: r.token, role: 'PROVIDER', expiresAt: Date.now() + 12 * 3600 * 1000 }));
        setToken(r.token);
        setPass('');
      } else setError('Contraseña incorrecta');
    } catch { setError('Error de conexión'); }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('mat32_auth_session_v15');
    setToken(null);
    setOrders([]);
  };

  const load = async () => {
    setLoading(true);
    try { setOrders(await dataService.getFoodOrders()); } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (loggedIn) {
      load();
      const i = setInterval(load, 30000); // poll every 30s
      return () => clearInterval(i);
    }
  }, [loggedIn]);

  const setStatus = async (id: number, status: string) => {
    await dataService.updateFoodOrder(id, { status });
    load();
  };

  const visible = orders.filter(o => filter === 'all' || o.status === filter);

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-mat-950 flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-mat-900 border border-mat-800 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <ChefHat className="w-12 h-12 text-mat-500 mx-auto mb-3" />
            <h1 className="text-2xl font-black uppercase text-white font-exo tracking-tight">PANEL COCINA</h1>
            <p className="text-[11px] text-gray-500 uppercase tracking-widest mt-2">MAT32 · PROVEEDOR</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" required autoFocus value={pass} onChange={e => setPass(e.target.value)}
              placeholder="Contraseña"
              className="w-full bg-mat-950 border border-mat-800 rounded-xl px-4 py-3 text-white text-sm focus:border-mat-500 outline-none" />
            {error && <p className="text-red-400 text-xs text-center">{error}</p>}
            <button type="submit" className="w-full py-3 bg-mat-500 hover:bg-mat-400 text-white text-xs font-black uppercase tracking-[0.3em] rounded-xl transition-all">
              ENTRAR
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mat-950 text-gray-100">
      {/* Header */}
      <header className="bg-mat-900 border-b border-mat-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <ChefHat className="w-6 h-6 text-mat-500" />
          <div>
            <span className="font-exo font-black text-lg text-white tracking-tighter uppercase">COCINA <span className="text-mat-500">MAT32</span></span>
            <span className="block text-[8px] font-black text-gray-500 tracking-[0.3em] uppercase">Panel proveedor</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={load} disabled={loading} className="text-[10px] font-black uppercase text-gray-400 hover:text-white tracking-widest px-3 py-2 bg-mat-800 border border-mat-700 rounded-lg">
            {loading ? <Loader2 size={12} className="animate-spin" /> : 'Actualizar'}
          </button>
          <button onClick={logout} className="p-2 text-gray-500 hover:text-white"><LogOut size={16} /></button>
        </div>
      </header>

      {/* Filters */}
      <div className="px-6 py-4 border-b border-mat-800 flex gap-2 overflow-x-auto">
        {([
          { k: 'pending', l: 'Pendiente' },
          { k: 'preparing', l: 'Preparando' },
          { k: 'ready', l: 'Listo' },
          { k: 'all', l: 'Todos' },
        ] as const).map(f => (
          <button key={f.k} onClick={() => setFilter(f.k)}
            className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest rounded-lg shrink-0 transition-all ${filter === f.k ? 'bg-mat-500 text-white' : 'bg-mat-800 text-gray-400 hover:text-white'}`}>
            {f.l} <span className="ml-1 opacity-60">({orders.filter(o => f.k === 'all' || o.status === f.k).length})</span>
          </button>
        ))}
      </div>

      {/* Orders list */}
      <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-4">
        {visible.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            <ChefHat className="w-14 h-14 mx-auto opacity-20 mb-4" />
            <p className="text-sm">Sin pedidos en esta categoría</p>
          </div>
        ) : visible.map(o => {
          const nextStatus = o.status === 'pending' ? 'preparing' : o.status === 'preparing' ? 'ready' : o.status === 'ready' ? 'delivered' : null;
          return (
            <div key={o.id} className={`p-5 rounded-2xl border-2 ${o.status === 'pending' ? 'bg-orange-500/5 border-orange-500/30' : o.status === 'preparing' ? 'bg-yellow-500/5 border-yellow-500/30' : o.status === 'ready' ? 'bg-green-500/5 border-green-500/30' : 'bg-mat-900 border-mat-800'}`}>
              <div className="flex items-start justify-between mb-4 gap-4 flex-wrap">
                <div>
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-xl font-black text-white font-exo">#{o.id}</span>
                    <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">{o.customer_name}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400">
                    {o.booking_slot && <span className="flex items-center gap-1"><Clock size={11} className="text-mat-500" /> {o.booking_slot}</span>}
                    {o.booking_table && <span className="flex items-center gap-1"><MapPin size={11} className="text-mat-500" /> Mesa {o.booking_table}</span>}
                    <span className="flex items-center gap-1"><UsersIcon size={11} /> {o.items.reduce((s, i) => s + i.qty, 0)} items</span>
                    <span className="text-gray-500">{new Date(o.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-lg font-black text-white">{(o.total_cents/100).toFixed(2)}€</span>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${o.payment_status === 'paid' ? 'bg-green-500/15 text-green-400' : 'bg-orange-500/15 text-orange-400'}`}>
                    {o.payment_status === 'paid' ? 'Pagado' : 'TPV pendiente'}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-mat-800 border-y border-mat-800 mb-4">
                {o.items.map(i => (
                  <div key={i.id} className="py-2 flex items-start gap-3">
                    <span className="text-mat-500 font-black text-lg font-mono w-8 shrink-0">×{i.qty}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white font-bold">{i.name}</div>
                      {i.notes && <div className="text-[11px] text-gray-500 italic mt-0.5">Nota: {i.notes}</div>}
                    </div>
                  </div>
                ))}
              </div>

              {o.notes && (
                <div className="mb-3 p-3 bg-mat-900 border border-mat-800 rounded-lg text-[11px] text-gray-300">
                  <b className="text-mat-500 text-[9px] uppercase tracking-widest mr-2">Notas:</b> {o.notes}
                </div>
              )}

              <div className="flex items-center gap-2 flex-wrap">
                {nextStatus && (
                  <button onClick={() => setStatus(o.id, nextStatus)}
                    className="flex-1 min-w-[180px] py-3 bg-mat-500 hover:bg-mat-400 text-white text-xs font-black uppercase tracking-[0.3em] rounded-lg">
                    {o.status === 'pending' ? '▶ EMPEZAR' : o.status === 'preparing' ? '✓ LISTO' : '✓ ENTREGADO'}
                  </button>
                )}
                {o.status !== 'cancelled' && o.status !== 'delivered' && (
                  <button onClick={() => { if (confirm('Cancelar pedido?')) setStatus(o.id, 'cancelled'); }}
                    className="px-4 py-3 border border-red-800 text-red-400 hover:bg-red-500/10 text-[10px] font-black uppercase tracking-widest rounded-lg">
                    Cancelar
                  </button>
                )}
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded ${o.status === 'delivered' ? 'bg-blue-500/15 text-blue-400' : o.status === 'cancelled' ? 'bg-red-500/15 text-red-400' : 'bg-stone-700 text-gray-300'}`}>
                  {o.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
