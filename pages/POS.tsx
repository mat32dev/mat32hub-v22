import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Minus, Trash2, CreditCard, Banknote, Smartphone, Receipt, X, LogOut, Loader2, Check, Disc, History, Search, User } from 'lucide-react';
import { dataService } from '../services/dataService';

interface Category { id: string; name: string; color: string; }
interface Product { id: string; category_id: string; name: string; price_cents: number; image_url: string | null; available: boolean; }
interface CartLine { product_id: string; name: string; price_cents: number; quantity: number; notes?: string; }

const CASHIER_KEY = 'mat32_pos_cashier_v1';

export const POS: React.FC = () => {
  const session = dataService.getSession();
  const isAuth = !!session && (session as any).role === 'ADMIN';
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loginError, setLoginError] = useState('');

  const [cats, setCats] = useState<Category[]>([]);
  const [prods, setProds] = useState<Product[]>([]);
  const [activeCat, setActiveCat] = useState<string>('all');
  const [cart, setCart] = useState<CartLine[]>([]);
  const [payOpen, setPayOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [lastSale, setLastSale] = useState<any>(null);
  const [customerName, setCustomerName] = useState('');
  const [search, setSearch] = useState('');
  const [cashier, setCashier] = useState(() => localStorage.getItem(CASHIER_KEY) || '');
  const [askCashier, setAskCashier] = useState(() => !localStorage.getItem(CASHIER_KEY));

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const s = await dataService.login(email, pass);
      if (s) { window.location.reload(); }
      else setLoginError('Credenciales incorrectas');
    } catch { setLoginError('Error'); }
  };

  const loadCatalog = async () => {
    try {
      const r: any = await dataService.getPosCatalog();
      setCats(r.categories || []);
      setProds(r.products || []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { if (isAuth) loadCatalog(); }, [isAuth]);

  const filtered = useMemo(() => {
    let list = prods;
    if (activeCat !== 'all') list = list.filter(p => p.category_id === activeCat);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q));
    }
    return list;
  }, [prods, activeCat, search]);

  const addToCart = (p: Product) => {
    setCart(c => {
      const existing = c.find(x => x.product_id === p.id);
      if (existing) return c.map(x => x.product_id === p.id ? { ...x, quantity: x.quantity + 1 } : x);
      return [...c, { product_id: p.id, name: p.name, price_cents: p.price_cents, quantity: 1 }];
    });
  };

  const setQty = (pid: string, qty: number) => {
    if (qty <= 0) setCart(c => c.filter(x => x.product_id !== pid));
    else setCart(c => c.map(x => x.product_id === pid ? { ...x, quantity: qty } : x));
  };

  const subtotal = cart.reduce((s, i) => s + i.price_cents * i.quantity, 0);

  const confirmSale = async (method: 'cash' | 'card' | 'bizum', cashReceived?: number) => {
    if (!cart.length) return;
    try {
      const r: any = await dataService.createPosSale({
        items: cart,
        payment_method: method,
        cash_received_cents: cashReceived,
        customer_name: customerName || null,
        cashier,
      });
      setLastSale({ ...r.sale, items: r.items, method });
      setCart([]);
      setCustomerName('');
      setPayOpen(false);
    } catch (e) { alert('Error al guardar venta: ' + (e as any).message); }
  };

  // LOGIN SCREEN
  if (!isAuth) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-mat-900 border border-mat-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 justify-center mb-8">
            <Disc className="w-8 h-8 text-mat-500" />
            <div>
              <div className="text-2xl font-black uppercase text-white font-exo tracking-tight">POS MAT<span className="text-mat-500">32</span></div>
              <div className="text-[9px] font-black text-gray-500 tracking-[0.4em] uppercase">BAR REGISTER</div>
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-3">
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full bg-mat-950 border border-mat-800 rounded-xl px-4 py-3 text-white focus:border-mat-500 outline-none" />
            <input type="password" placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} required
              className="w-full bg-mat-950 border border-mat-800 rounded-xl px-4 py-3 text-white focus:border-mat-500 outline-none" />
            {loginError && <p className="text-red-400 text-xs">{loginError}</p>}
            <button type="submit" className="w-full py-3 bg-mat-500 hover:bg-mat-400 text-white font-black uppercase tracking-[0.3em] text-xs rounded-xl">
              ENTRAR
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (askCashier) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-mat-900 border border-mat-800 rounded-3xl p-8 shadow-2xl">
          <User className="w-12 h-12 text-mat-500 mx-auto mb-3" />
          <h2 className="text-xl font-black text-white uppercase text-center mb-6 font-exo">¿Quién cobra?</h2>
          <form onSubmit={e => { e.preventDefault(); if (cashier.trim()) { localStorage.setItem(CASHIER_KEY, cashier.trim()); setAskCashier(false); } }} className="space-y-3">
            <input autoFocus type="text" placeholder="Tu nombre" value={cashier} onChange={e => setCashier(e.target.value)} required
              className="w-full bg-mat-950 border border-mat-800 rounded-xl px-4 py-3 text-white focus:border-mat-500 outline-none" />
            <button type="submit" className="w-full py-3 bg-mat-500 hover:bg-mat-400 text-white font-black uppercase tracking-[0.3em] text-xs rounded-xl">
              EMPEZAR TURNO
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden">
      {/* TOP BAR */}
      <header className="h-14 bg-mat-900 border-b border-mat-800 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Disc className="w-6 h-6 text-mat-500" />
          <span className="font-exo font-black text-lg tracking-tight uppercase">POS MAT<span className="text-mat-500">32</span></span>
          <span className="text-[10px] text-gray-500 border-l border-mat-800 pl-3 ml-2 uppercase tracking-widest">
            <User size={10} className="inline mb-0.5" /> {cashier}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setHistoryOpen(true)} className="px-3 py-1.5 bg-mat-800 hover:bg-mat-700 text-gray-300 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1">
            <History size={12} /> Ventas
          </button>
          <button onClick={() => { localStorage.removeItem(CASHIER_KEY); setAskCashier(true); setCashier(''); }} className="p-2 text-gray-500 hover:text-white"><LogOut size={16} /></button>
        </div>
      </header>

      {/* MAIN — 2 cols: products left, cart right */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: categories + product grid */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* search + categories */}
          <div className="p-3 border-b border-mat-800 space-y-2 shrink-0">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar producto..."
                className="w-full bg-mat-950 border border-mat-800 rounded-xl pl-9 pr-3 py-2 text-sm focus:border-mat-500 outline-none" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button onClick={() => setActiveCat('all')}
                className={`shrink-0 px-4 py-2 text-[11px] font-black uppercase tracking-widest rounded-lg ${activeCat === 'all' ? 'bg-mat-500 text-white' : 'bg-mat-800 text-gray-400 hover:text-white'}`}>
                Todo ({prods.length})
              </button>
              {cats.map(c => {
                const count = prods.filter(p => p.category_id === c.id).length;
                return (
                  <button key={c.id} onClick={() => setActiveCat(c.id)}
                    className={`shrink-0 px-4 py-2 text-[11px] font-black uppercase tracking-widest rounded-lg border-l-4 ${activeCat === c.id ? 'bg-mat-500 text-white border-white' : 'bg-mat-800 text-gray-300 hover:text-white'}`}
                    style={{ borderLeftColor: c.color }}>
                    {c.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>
          {/* product grid */}
          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
            {filtered.length === 0 ? (
              <div className="py-20 text-center text-gray-500 text-sm">Sin productos</div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2">
                {filtered.map(p => {
                  const cat = cats.find(c => c.id === p.category_id);
                  return (
                    <button key={p.id} onClick={() => addToCart(p)}
                      className="group aspect-square bg-mat-900 hover:bg-mat-800 active:scale-95 border-l-4 border-mat-800 rounded-xl p-2 flex flex-col justify-between text-left transition-all"
                      style={{ borderLeftColor: cat?.color || '#44403c' }}>
                      <div className="flex-1 flex items-start">
                        <span className="text-[11px] sm:text-xs font-black text-white uppercase leading-tight">{p.name}</span>
                      </div>
                      <div className="text-[13px] sm:text-sm font-black text-mat-500 tabular-nums text-right">
                        {(p.price_cents/100).toFixed(2).replace('.', ',')}€
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: cart */}
        <div className="w-72 md:w-80 bg-mat-950 border-l border-mat-800 flex flex-col shrink-0">
          <div className="p-3 border-b border-mat-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Receipt size={16} className="text-mat-500" />
              <span className="text-[11px] font-black uppercase tracking-widest">TICKET</span>
              <span className="text-[10px] text-gray-500">({cart.reduce((s, i) => s + i.quantity, 0)} ítems)</span>
            </div>
            {cart.length > 0 && (
              <button onClick={() => { if (confirm('¿Vaciar ticket?')) setCart([]); }} className="text-gray-500 hover:text-red-400"><Trash2 size={14} /></button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="py-12 text-center text-gray-600 text-xs">
                <Receipt className="w-10 h-10 mx-auto opacity-20 mb-3" />
                Añade productos para empezar
              </div>
            ) : (
              <div className="space-y-1">
                {cart.map(line => (
                  <div key={line.product_id} className="py-2 px-2 rounded-lg hover:bg-mat-900/50">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-xs font-black text-white leading-tight flex-1">{line.name}</span>
                      <span className="text-xs font-black text-mat-500 tabular-nums shrink-0">{((line.price_cents * line.quantity)/100).toFixed(2)}€</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setQty(line.product_id, line.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center bg-mat-800 hover:bg-mat-700 rounded-lg text-white">
                          {line.quantity > 1 ? <Minus size={12} /> : <Trash2 size={12} className="text-red-400" />}
                        </button>
                        <span className="min-w-[24px] text-center text-sm font-black">{line.quantity}</span>
                        <button onClick={() => setQty(line.product_id, line.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center bg-mat-800 hover:bg-mat-700 rounded-lg text-white"><Plus size={12} /></button>
                      </div>
                      <span className="text-[10px] text-gray-500 tabular-nums">{(line.price_cents/100).toFixed(2)}€ × {line.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* cart footer */}
          <div className="border-t border-mat-800 p-3 space-y-3 shrink-0">
            <input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Cliente (opcional)"
              className="w-full bg-mat-900 border border-mat-800 rounded-lg px-3 py-2 text-xs text-white focus:border-mat-500 outline-none" />
            <div className="flex items-baseline justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">TOTAL</span>
              <span className="text-3xl font-black text-white font-exo tabular-nums">{(subtotal/100).toFixed(2).replace('.', ',')}€</span>
            </div>
            <button disabled={!cart.length} onClick={() => setPayOpen(true)}
              className="w-full py-4 bg-mat-500 hover:bg-mat-400 disabled:opacity-40 text-white text-sm font-black uppercase tracking-[0.3em] rounded-xl transition-all">
              COBRAR →
            </button>
          </div>
        </div>
      </div>

      {payOpen && <PayModal subtotal={subtotal} onClose={() => setPayOpen(false)} onConfirm={confirmSale} />}
      {lastSale && <ReceiptModal sale={lastSale} onClose={() => setLastSale(null)} />}
      {historyOpen && <HistoryModal onClose={() => setHistoryOpen(false)} />}
    </div>
  );
};

// ── PAY MODAL ────────────────────────────────────────────
const PayModal: React.FC<{ subtotal: number; onClose: () => void; onConfirm: (m: 'cash' | 'card' | 'bizum', cash?: number) => Promise<void> }> = ({ subtotal, onClose, onConfirm }) => {
  const [method, setMethod] = useState<'cash' | 'card' | 'bizum' | null>(null);
  const [cashReceived, setCashReceived] = useState<number>(subtotal);
  const [busy, setBusy] = useState(false);
  const change = Math.max(0, cashReceived - subtotal);

  const quickCash = [subtotal, Math.ceil(subtotal/500)*500, Math.ceil(subtotal/1000)*1000, Math.ceil(subtotal/2000)*2000, Math.ceil(subtotal/5000)*5000]
    .filter((v, i, arr) => arr.indexOf(v) === i && v >= subtotal);

  const go = async () => {
    if (!method) return;
    setBusy(true);
    await onConfirm(method, method === 'cash' ? cashReceived : undefined);
    setBusy(false);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-mat-900 border border-mat-800 rounded-3xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-mat-800">
          <h2 className="text-xl font-black uppercase text-white font-exo">Cobrar</h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-white"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-5 bg-mat-950 rounded-2xl text-center">
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">A COBRAR</div>
            <div className="text-5xl font-black text-mat-500 font-exo tabular-nums">{(subtotal/100).toFixed(2).replace('.', ',')}€</div>
          </div>

          {!method && (
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => setMethod('cash')} className="p-5 bg-mat-950 hover:bg-mat-800 border border-mat-800 rounded-2xl flex flex-col items-center gap-2 transition-all">
                <Banknote className="w-10 h-10 text-green-400" />
                <span className="text-xs font-black uppercase tracking-wider">Efectivo</span>
              </button>
              <button onClick={() => setMethod('card')} className="p-5 bg-mat-950 hover:bg-mat-800 border border-mat-800 rounded-2xl flex flex-col items-center gap-2 transition-all">
                <CreditCard className="w-10 h-10 text-blue-400" />
                <span className="text-xs font-black uppercase tracking-wider">Tarjeta</span>
                <span className="text-[9px] text-gray-500 normal-case">Cobrar en TPV</span>
              </button>
              <button onClick={() => setMethod('bizum')} className="p-5 bg-mat-950 hover:bg-mat-800 border border-mat-800 rounded-2xl flex flex-col items-center gap-2 transition-all">
                <Smartphone className="w-10 h-10 text-mat-500" />
                <span className="text-xs font-black uppercase tracking-wider">Bizum</span>
              </button>
            </div>
          )}

          {method === 'cash' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Recibido</label>
                <input type="number" step="0.01" min={subtotal/100} value={(cashReceived/100).toFixed(2)}
                  onChange={e => setCashReceived(Math.round(parseFloat(e.target.value || '0') * 100))}
                  className="w-full bg-mat-950 border border-mat-800 rounded-xl px-4 py-4 text-2xl font-black text-white text-center focus:border-mat-500 outline-none" />
              </div>
              <div className="grid grid-cols-5 gap-2">
                {quickCash.map(v => (
                  <button key={v} onClick={() => setCashReceived(v)}
                    className={`py-2 text-xs font-black rounded-lg ${cashReceived === v ? 'bg-mat-500 text-white' : 'bg-mat-800 text-gray-300 hover:bg-mat-700'}`}>
                    {(v/100).toFixed(2).replace('.', ',')}€
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
                <span className="text-[10px] font-black uppercase tracking-widest text-green-400">CAMBIO</span>
                <span className="text-2xl font-black text-white tabular-nums">{(change/100).toFixed(2).replace('.', ',')}€</span>
              </div>
            </div>
          )}

          {method === 'card' && (
            <div className="p-5 bg-blue-500/10 border border-blue-500/30 rounded-2xl text-center space-y-2">
              <CreditCard className="w-12 h-12 text-blue-400 mx-auto" />
              <p className="text-sm text-gray-300">Cobra <b className="text-white">{(subtotal/100).toFixed(2).replace('.', ',')}€</b> con el TPV físico.</p>
              <p className="text-[11px] text-gray-500">Cuando se confirme el pago, pulsa confirmar.</p>
            </div>
          )}

          {method === 'bizum' && (
            <div className="p-5 bg-mat-500/10 border border-mat-500/30 rounded-2xl text-center space-y-2">
              <Smartphone className="w-12 h-12 text-mat-500 mx-auto" />
              <p className="text-sm text-gray-300">Espera Bizum de <b className="text-white">{(subtotal/100).toFixed(2).replace('.', ',')}€</b>.</p>
              <p className="text-[11px] text-gray-500">Cuando lo veas en tu banca, pulsa confirmar.</p>
            </div>
          )}

          {method && (
            <div className="flex gap-2">
              <button onClick={() => setMethod(null)} className="flex-1 py-3 bg-mat-800 hover:bg-mat-700 text-white text-xs font-black uppercase rounded-xl">Cambiar método</button>
              <button onClick={go} disabled={busy || (method === 'cash' && cashReceived < subtotal)}
                className="flex-1 py-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white text-sm font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2">
                {busy ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} CONFIRMAR
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── RECEIPT MODAL ────────────────────────────────────────
const ReceiptModal: React.FC<{ sale: any; onClose: () => void }> = ({ sale, onClose }) => {
  const subtotal = sale.subtotal_cents;
  const total = sale.total_cents;
  const methodLabel = sale.method === 'cash' ? 'Efectivo' : sale.method === 'card' ? 'Tarjeta' : 'Bizum';
  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-mat-900 border border-mat-800 rounded-3xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="p-8 text-center border-b border-mat-800">
          <Check className="w-16 h-16 text-green-400 mx-auto mb-3" />
          <h2 className="text-2xl font-black uppercase text-white font-exo">COBRADO</h2>
          <p className="text-gray-400 text-[11px] font-mono mt-1">{sale.ticket_number}</p>
        </div>
        <div className="p-6 space-y-2 font-mono text-xs">
          {sale.items.map((i: any, idx: number) => (
            <div key={idx} className="flex justify-between text-gray-300">
              <span>{i.quantity}× {i.name}</span>
              <span>{((i.price_cents * i.quantity)/100).toFixed(2)}€</span>
            </div>
          ))}
          <div className="border-t border-mat-800 pt-2 mt-3 space-y-1">
            <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>{(subtotal/100).toFixed(2)}€</span></div>
            <div className="flex justify-between text-white font-black text-base"><span>TOTAL</span><span>{(total/100).toFixed(2)}€</span></div>
            <div className="flex justify-between text-gray-400 mt-2"><span>Pago</span><span className="uppercase">{methodLabel}</span></div>
            {sale.method === 'cash' && (
              <>
                <div className="flex justify-between text-gray-400"><span>Recibido</span><span>{(sale.cash_received_cents/100).toFixed(2)}€</span></div>
                <div className="flex justify-between text-green-400 font-black"><span>Cambio</span><span>{(sale.change_cents/100).toFixed(2)}€</span></div>
              </>
            )}
          </div>
        </div>
        <div className="p-6 pt-0">
          <button onClick={onClose} className="w-full py-3 bg-mat-500 hover:bg-mat-400 text-white font-black uppercase tracking-[0.3em] text-xs rounded-xl">CERRAR</button>
        </div>
      </div>
    </div>
  );
};

// ── HISTORY MODAL ────────────────────────────────────────
const HistoryModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [sales, setSales] = useState<any[]>([]);
  const [totals, setTotals] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [s, t]: any = await Promise.all([dataService.getPosSales(date), dataService.getPosTotals(date)]);
      setSales(s);
      setTotals(t);
    } catch {}
    setLoading(false);
  };
  useEffect(() => { load(); }, [date]);

  const methodLabel = (m: string) => m === 'cash' ? 'Efectivo' : m === 'card' ? 'Tarjeta' : m === 'bizum' ? 'Bizum' : m;

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-mat-900 border border-mat-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-mat-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <History className="text-mat-500" size={18} />
            <h2 className="text-xl font-black uppercase text-white font-exo">Ventas</h2>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="bg-mat-950 border border-mat-800 rounded-lg px-3 py-1.5 text-sm text-white ml-3" />
          </div>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-white"><X size={18} /></button>
        </div>

        {totals && (
          <div className="px-5 py-4 border-b border-mat-800 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-mat-950 rounded-xl">
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">TOTAL DÍA</div>
              <div className="text-xl font-black text-white mt-1">{(totals.total_cents/100).toFixed(2)}€</div>
              <div className="text-[10px] text-gray-500">{totals.total_count} tickets</div>
            </div>
            {totals.by_method.map((m: any) => (
              <div key={m.payment_method} className="p-3 bg-mat-950 rounded-xl">
                <div className="text-[10px] font-black uppercase tracking-widest text-mat-500">{methodLabel(m.payment_method)}</div>
                <div className="text-xl font-black text-white mt-1">{(m.total_cents/100).toFixed(2)}€</div>
                <div className="text-[10px] text-gray-500">{m.count} tickets</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
          {loading ? (
            <div className="py-20 text-center"><Loader2 className="animate-spin text-mat-500 w-8 h-8 mx-auto" /></div>
          ) : sales.length === 0 ? (
            <div className="py-20 text-center text-gray-500 text-sm">Sin ventas este día</div>
          ) : (
            <div className="space-y-2">
              {sales.map(s => (
                <div key={s.id} className={`p-3 bg-mat-950 border border-mat-800 rounded-xl ${s.voided ? 'opacity-50' : ''}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-gray-500">{s.ticket_number}</span>
                      <span className="text-[10px] text-gray-500">{new Date(s.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                      {s.cashier && <span className="text-[10px] text-gray-500">· {s.cashier}</span>}
                      {s.voided && <span className="text-[9px] font-black bg-red-500/15 text-red-400 px-2 py-0.5 rounded uppercase">ANULADA</span>}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-mat-500 uppercase">{methodLabel(s.payment_method)}</span>
                      <span className="text-sm font-black text-white">{(s.total_cents/100).toFixed(2)}€</span>
                    </div>
                  </div>
                  {s.items && (
                    <div className="text-[11px] text-gray-400 space-x-2">
                      {s.items.map((i: any) => `${i.qty}× ${i.name}`).join(' · ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
