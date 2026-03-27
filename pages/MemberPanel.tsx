import React, { useState, useEffect } from 'react';
import { Disc, LogOut, Plus, Trash2, Search, ExternalLink, Eye, ShoppingCart, X, Upload } from 'lucide-react';
import { dataService } from '../services/dataService';
import { WantlistItem, Deal } from '../types';

const PLATFORMS = [
  { key: 'discogs', label: 'Discogs' },
  { key: 'ebay', label: 'eBay' },
  { key: 'wallapop', label: 'Wallapop' },
  { key: 'todocoleccion', label: 'Todocoleccion' },
  { key: 'milanuncios', label: 'Milanuncios' },
];

const CONDITIONS = ['M', 'NM', 'VG+', 'VG', 'G+', 'G'];

const statusColors: Record<string, string> = {
  new: 'bg-green-500/20 text-green-400 border-green-500/30',
  seen: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  bought: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  dismissed: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export const MemberPanel: React.FC = () => {
  const session = dataService.getSession();
  const [loggedIn, setLoggedIn] = useState(!!session && (session as any).role === 'MEMBER');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'wantlist' | 'deals' | 'settings'>('deals');

  // Wantlist state
  const [wantlist, setWantlist] = useState<WantlistItem[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [newArtist, setNewArtist] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newMaxPrice, setNewMaxPrice] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [csvText, setCsvText] = useState('');

  // Settings state
  const [maxPrice, setMaxPrice] = useState(50);
  const [minCondition, setMinCondition] = useState('VG');
  const [platforms, setPlatforms] = useState<string[]>(['discogs', 'ebay', 'wallapop', 'todocoleccion']);
  const [saving, setSaving] = useState(false);

  const memberId = session?.id || '';

  useEffect(() => {
    if (loggedIn && memberId) {
      loadData();
    }
  }, [loggedIn]);

  async function loadData() {
    try {
      const [w, d] = await Promise.all([
        dataService.getWantlist(memberId),
        dataService.getDeals(memberId),
      ]);
      setWantlist(w);
      setDeals(d);
    } catch (e) {
      console.error('Error loading data:', e);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const ok = await dataService.memberLogin(email, pass);
    if (ok) {
      setLoggedIn(true);
    } else {
      setError('Email o password incorrectos');
    }
  }

  function handleLogout() {
    dataService.logout();
    setLoggedIn(false);
  }

  async function addItem() {
    if (!newArtist.trim() || !newTitle.trim()) return;
    await dataService.addWantlistItem(memberId, {
      artist: newArtist.trim(),
      title: newTitle.trim(),
      max_price: newMaxPrice ? parseFloat(newMaxPrice) : undefined,
    });
    setNewArtist('');
    setNewTitle('');
    setNewMaxPrice('');
    const w = await dataService.getWantlist(memberId);
    setWantlist(w);
  }

  async function removeItem(itemId: string) {
    await dataService.deleteWantlistItem(memberId, itemId);
    setWantlist(wantlist.filter(w => w.id !== itemId));
  }

  async function handleImportCSV() {
    if (!csvText.trim()) return;
    await dataService.importWantlistCSV(memberId, csvText);
    setCsvText('');
    setShowImport(false);
    const w = await dataService.getWantlist(memberId);
    setWantlist(w);
  }

  async function markDeal(dealId: string, status: Deal['status']) {
    await dataService.updateDealStatus(memberId, dealId, status);
    setDeals(deals.map(d => d.id === dealId ? { ...d, status } : d));
  }

  async function saveSettings() {
    setSaving(true);
    await dataService.updateMember({ id: memberId, max_price: maxPrice, min_condition: minCondition, platforms });
    setSaving(false);
  }

  // ── LOGIN SCREEN ───────────────────────────────────────
  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-mat-950 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Disc className="w-8 h-8 text-mat-500" />
            <div>
              <span className="font-exo font-black text-2xl text-white tracking-tighter">MAT<span className="text-mat-500">32</span></span>
              <span className="block text-[9px] font-black text-gray-500 tracking-[0.3em] uppercase">DIGGER RADAR</span>
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-mat-900 border border-mat-700 rounded-xl text-white text-sm focus:border-mat-500 outline-none"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              className="w-full px-4 py-3 bg-mat-900 border border-mat-700 rounded-xl text-white text-sm focus:border-mat-500 outline-none"
              required
            />
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button type="submit" className="w-full py-3 bg-mat-500 hover:bg-mat-600 text-white font-bold rounded-xl text-sm transition-colors">
              ENTRAR
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── MEMBER PANEL ───────────────────────────────────────
  const newDeals = deals.filter(d => d.status === 'new').length;

  return (
    <div className="min-h-screen bg-mat-950 text-gray-100">
      {/* Header */}
      <header className="bg-mat-900 border-b border-mat-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Disc className="w-6 h-6 text-mat-500" />
          <div>
            <span className="font-exo font-black text-lg text-white tracking-tighter">DIGGER <span className="text-mat-500">RADAR</span></span>
            <span className="block text-[8px] font-black text-gray-500 tracking-[0.3em] uppercase">by MAT32</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400">{session?.name}</span>
          <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-white transition-colors">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-mat-800 px-6">
        <div className="flex gap-6">
          {[
            { key: 'deals' as const, label: 'Deals', badge: newDeals },
            { key: 'wantlist' as const, label: 'Mi Wantlist', badge: wantlist.length },
            { key: 'settings' as const, label: 'Preferencias', badge: 0 },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`py-3 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${
                tab === t.key ? 'text-mat-500 border-mat-500' : 'text-gray-500 border-transparent hover:text-white'
              }`}
            >
              {t.label}
              {t.badge > 0 && (
                <span className="ml-2 px-1.5 py-0.5 text-[9px] bg-mat-500/20 text-mat-500 rounded-full">{t.badge}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* ── DEALS TAB ─────────────────────────── */}
        {tab === 'deals' && (
          <div className="space-y-3">
            {deals.length === 0 ? (
              <div className="text-center py-16 text-gray-600">
                <Search size={40} className="mx-auto mb-4 opacity-30" />
                <p className="text-sm">El radar esta buscando tus discos...</p>
                <p className="text-xs mt-1">Cuando encontremos algo apareceran aqui</p>
              </div>
            ) : (
              deals.sort((a, b) => (a.status === 'new' ? -1 : 1) - (b.status === 'new' ? -1 : 1)).map(deal => (
                <div key={deal.id} className={`p-4 rounded-xl border ${deal.status === 'new' ? 'border-mat-500/30 bg-mat-900/80' : 'border-mat-800 bg-mat-900/40'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-full border ${statusColors[deal.status]}`}>
                          {deal.status === 'new' ? 'NUEVO' : deal.status === 'seen' ? 'VISTO' : deal.status === 'bought' ? 'COMPRADO' : 'DESCARTADO'}
                        </span>
                        <span className="text-[10px] text-gray-600 uppercase font-bold">{deal.platform}</span>
                      </div>
                      <h3 className="font-bold text-white text-sm truncate">{deal.artist} — {deal.title}</h3>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                        <span className="text-mat-500 font-bold">{deal.price}€</span>
                        {deal.shipping > 0 && <span>+{deal.shipping}€ envio</span>}
                        {deal.condition && <span>Estado: {deal.condition}</span>}
                        {deal.seller && <span>Vendedor: {deal.seller}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {deal.url && (
                        <a href={deal.url} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-500 hover:text-mat-500 transition-colors">
                          <ExternalLink size={14} />
                        </a>
                      )}
                      {deal.status === 'new' && (
                        <>
                          <button onClick={() => markDeal(deal.id, 'seen')} className="p-2 text-gray-500 hover:text-white transition-colors" title="Marcar visto">
                            <Eye size={14} />
                          </button>
                          <button onClick={() => markDeal(deal.id, 'bought')} className="p-2 text-gray-500 hover:text-green-400 transition-colors" title="Comprado">
                            <ShoppingCart size={14} />
                          </button>
                          <button onClick={() => markDeal(deal.id, 'dismissed')} className="p-2 text-gray-500 hover:text-red-400 transition-colors" title="Descartar">
                            <X size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── WANTLIST TAB ──────────────────────── */}
        {tab === 'wantlist' && (
          <div className="space-y-4">
            {/* Add item form */}
            <div className="flex gap-2">
              <input
                placeholder="Artista"
                value={newArtist}
                onChange={e => setNewArtist(e.target.value)}
                className="flex-1 px-3 py-2 bg-mat-900 border border-mat-700 rounded-lg text-white text-sm focus:border-mat-500 outline-none"
              />
              <input
                placeholder="Titulo disco"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="flex-1 px-3 py-2 bg-mat-900 border border-mat-700 rounded-lg text-white text-sm focus:border-mat-500 outline-none"
              />
              <input
                placeholder="Max €"
                value={newMaxPrice}
                onChange={e => setNewMaxPrice(e.target.value)}
                className="w-20 px-3 py-2 bg-mat-900 border border-mat-700 rounded-lg text-white text-sm focus:border-mat-500 outline-none"
                type="number"
              />
              <button onClick={addItem} className="px-4 py-2 bg-mat-500 hover:bg-mat-600 text-white rounded-lg transition-colors">
                <Plus size={16} />
              </button>
            </div>

            {/* Import CSV */}
            <button onClick={() => setShowImport(!showImport)} className="flex items-center gap-2 text-xs text-gray-500 hover:text-mat-500 transition-colors">
              <Upload size={12} /> Importar lista (CSV: artista, titulo, precio_max)
            </button>

            {showImport && (
              <div className="space-y-2">
                <textarea
                  value={csvText}
                  onChange={e => setCsvText(e.target.value)}
                  placeholder={"Theo Parrish, Falling Up, 30\nMoodymann, Silentintroduction, 45\nLarry Heard, Sceneries Not Songs, 25"}
                  className="w-full h-32 px-3 py-2 bg-mat-900 border border-mat-700 rounded-lg text-white text-xs font-mono focus:border-mat-500 outline-none"
                />
                <button onClick={handleImportCSV} className="px-4 py-2 bg-mat-500 hover:bg-mat-600 text-white text-xs font-bold rounded-lg transition-colors">
                  IMPORTAR
                </button>
              </div>
            )}

            {/* List */}
            {wantlist.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                <Disc size={40} className="mx-auto mb-4 opacity-20" />
                <p className="text-sm">Tu wantlist esta vacia</p>
                <p className="text-xs mt-1">Anade los discos que buscas y el radar los encontrara</p>
              </div>
            ) : (
              <div className="space-y-1">
                {wantlist.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-mat-900/50 border border-mat-800 hover:border-mat-700 transition-colors">
                    <div>
                      <span className="text-white text-sm font-medium">{item.artist}</span>
                      <span className="text-gray-500 mx-2">—</span>
                      <span className="text-gray-300 text-sm">{item.title}</span>
                      {item.max_price && <span className="text-mat-500 text-xs ml-3">max {item.max_price}€</span>}
                    </div>
                    <button onClick={() => removeItem(item.id)} className="p-1.5 text-gray-600 hover:text-red-400 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── SETTINGS TAB ──────────────────────── */}
        {tab === 'settings' && (
          <div className="space-y-6 max-w-md">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Precio maximo global (€)</label>
              <input
                type="number"
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full px-4 py-3 bg-mat-900 border border-mat-700 rounded-xl text-white text-sm focus:border-mat-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Estado minimo aceptable</label>
              <div className="flex gap-2">
                {CONDITIONS.map(c => (
                  <button
                    key={c}
                    onClick={() => setMinCondition(c)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                      minCondition === c ? 'bg-mat-500/20 text-mat-500 border-mat-500/50' : 'bg-mat-900 text-gray-500 border-mat-700 hover:border-mat-600'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Plataformas de busqueda</label>
              <div className="space-y-2">
                {PLATFORMS.map(p => (
                  <label key={p.key} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={platforms.includes(p.key)}
                      onChange={e => {
                        if (e.target.checked) setPlatforms([...platforms, p.key]);
                        else setPlatforms(platforms.filter(x => x !== p.key));
                      }}
                      className="accent-orange-500"
                    />
                    <span className="text-sm text-gray-300">{p.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={saveSettings}
              disabled={saving}
              className="px-6 py-3 bg-mat-500 hover:bg-mat-600 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-colors"
            >
              {saving ? 'GUARDANDO...' : 'GUARDAR PREFERENCIAS'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
