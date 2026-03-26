import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, Disc, Lock, Loader2, ChevronRight } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { sidebarSections } from './entityConfig';

const LOCKOUT_KEY = 'mat32_login_lockout';
const MAX_ATTEMPTS = 3;
const LOCKOUT_MS = 5 * 60 * 1000;

function getLockoutState() {
  try { return JSON.parse(localStorage.getItem(LOCKOUT_KEY) || '{}'); }
  catch { return { attempts: 0, lockedUntil: 0 }; }
}

const LoginForm: React.FC<{ onAuth: () => void }> = ({ onAuth }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { attempts, lockedUntil } = getLockoutState();
    if (Date.now() < lockedUntil) {
      setStatus(`BLOQUEADO — reintenta en ${Math.ceil((lockedUntil - Date.now()) / 60000)} min`);
      return;
    }
    setLoading(true);
    setStatus(null);
    const ok = await dataService.login(email, pass);
    setLoading(false);
    if (ok) {
      localStorage.removeItem(LOCKOUT_KEY);
      onAuth();
    } else {
      const newAttempts = (attempts || 0) + 1;
      if (newAttempts >= MAX_ATTEMPTS) {
        localStorage.setItem(LOCKOUT_KEY, JSON.stringify({ attempts: newAttempts, lockedUntil: Date.now() + LOCKOUT_MS }));
        setStatus('BLOQUEADO 5 min');
      } else {
        localStorage.setItem(LOCKOUT_KEY, JSON.stringify({ attempts: newAttempts, lockedUntil: 0 }));
        setStatus(`Credenciales incorrectas (${newAttempts}/${MAX_ATTEMPTS})`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <form onSubmit={handleLogin} className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-8">
          <Lock className="w-5 h-5 text-orange-500" />
          <span className="font-black text-lg text-white tracking-tight">MAT<span className="text-orange-500">32</span> ADMIN</span>
        </div>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" required
          className="w-full mb-3 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:border-orange-500 focus:outline-none" />
        <input value={pass} onChange={e => setPass(e.target.value)} placeholder="Password" type="password" required
          className="w-full mb-4 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:border-orange-500 focus:outline-none" />
        <button type="submit" disabled={loading}
          className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Entrar'}
        </button>
        {status && <p className="mt-3 text-red-400 text-xs text-center">{status}</p>}
      </form>
    </div>
  );
};

export const AdminLayout: React.FC = () => {
  const [isAuth, setIsAuth] = useState(() => dataService.isAuthenticated());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuth) return <LoginForm onAuth={() => setIsAuth(true)} />;

  const handleLogout = () => { dataService.logout(); setIsAuth(false); };

  // Breadcrumb from path
  const pathParts = location.pathname.replace('/admin', '').split('/').filter(Boolean);
  const breadcrumb = ['Admin', ...pathParts.map(p => p.charAt(0).toUpperCase() + p.slice(1))];

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Mobile toggle */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-lg text-white border border-gray-700">
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-56 bg-gray-900 border-r border-gray-800 flex flex-col z-40 transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="h-14 flex items-center px-5 border-b border-gray-800 shrink-0">
          <Link to="/admin" className="flex items-center gap-2">
            <Disc className="w-5 h-5 text-orange-500" />
            <span className="font-black text-sm text-white tracking-tight">MAT<span className="text-orange-500">32</span></span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          {sidebarSections.map(section => (
            <div key={section.title} className="mb-4">
              <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] px-2 mb-1">{section.title}</p>
              {section.items.map(item => {
                const Icon = item.icon;
                const active = item.path === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.path);
                return (
                  <Link key={item.key} to={item.path}
                    onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${active ? 'bg-orange-600/15 text-orange-400' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                    <Icon size={16} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-gray-800 shrink-0">
          <Link to="/" className="flex items-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-gray-800">
            <ChevronRight size={14} className="rotate-180" /> Ver web
          </Link>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-red-400 transition-colors rounded-lg hover:bg-gray-800">
            <LogOut size={14} /> Cerrar sesion
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && <div className="lg:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-gray-900/80 backdrop-blur border-b border-gray-800 flex items-center px-6 sticky top-0 z-20">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            {breadcrumb.map((part, i) => (
              <React.Fragment key={i}>
                {i > 0 && <ChevronRight size={12} className="text-gray-700" />}
                <span className={i === breadcrumb.length - 1 ? 'text-white font-semibold' : ''}>{part}</span>
              </React.Fragment>
            ))}
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
