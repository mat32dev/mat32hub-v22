
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X, Disc, ShoppingBag, Globe, ArrowRight } from 'lucide-react';

// Providers
import { CartProvider, useCart } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { CartDrawer } from './components/CartDrawer';
import { AIChat } from './components/AIChat';

// Paginas con carga dinámica
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Bar = lazy(() => import('./pages/Bar').then(m => ({ default: m.Bar })));
const Events = lazy(() => import('./pages/Events').then(m => ({ default: m.Events })));
const Records = lazy(() => import('./pages/Records').then(m => ({ default: m.Records })));
const Community = lazy(() => import('./pages/Community').then(m => ({ default: m.Community })));
const OpenDecks = lazy(() => import('./pages/OpenDecks').then(m => ({ default: m.OpenDecks })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const PrivateEvents = lazy(() => import('./pages/PrivateEvents').then(m => ({ default: m.PrivateEvents })));
const Checkout = lazy(() => import('./pages/Checkout').then(m => ({ default: m.Checkout })));
const Legal = lazy(() => import('./pages/Legal').then(m => ({ default: m.Legal })));
const Admin = lazy(() => import('./pages/Admin').then(m => ({ default: m.Admin })));

const Loading = () => (
  <div className="h-screen w-full bg-mat-900 flex items-center justify-center">
    <Disc className="w-10 h-10 text-mat-500 animate-spin-slow" />
  </div>
);

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cartCount, toggleCart } = useCart();
  const { t, language, toggleLanguage } = useLanguage();
  const location = useLocation();

  // Bloquear scroll del body cuando el menú está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.bar'), path: '/bar' },
    { name: t('nav.events'), path: '/events' },
    { name: t('nav.records'), path: '/records' },
    { name: t('nav.community'), path: '/community' },
    { name: t('nav.open_decks'), path: '/open-decks' },
    { name: t('nav.private_events'), path: '/alquiler-local-eventos-valencia' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100] h-14 md:h-16 bg-mat-900/95 backdrop-blur-md border-b border-mat-800 flex items-center shadow-lg">
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo Minimalista */}
          <Link to="/" className="flex items-center gap-2 group shrink-0" aria-label="Inicio">
            <Disc className="w-5 h-5 text-mat-500 group-hover:rotate-180 transition-transform duration-1000" />
            <span className="font-exo font-black text-lg text-white tracking-tighter uppercase select-none">MAT<span className="text-mat-500">32</span></span>
          </Link>

          {/* Desktop Nav - Visible XL */}
          <nav className="hidden xl:flex items-center gap-x-5">
            {navLinks.map(l => (
              <Link 
                key={l.path} 
                to={l.path} 
                className={`text-[9px] font-black uppercase tracking-widest transition-all ${isActive(l.path) ? 'text-mat-500 border-b border-mat-500 pb-0.5' : 'text-gray-400 hover:text-white'}`}
              >
                {l.name}
              </Link>
            ))}
          </nav>

          {/* Global Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            <button 
              onClick={toggleLanguage} 
              className="hidden sm:flex items-center gap-1 text-[8px] font-black text-gray-400 hover:text-white uppercase transition-colors px-2 py-1 bg-mat-800 rounded border border-mat-700"
            >
              {language === 'es' ? 'EN' : 'ES'}
            </button>
            
            <button 
              onClick={toggleCart} 
              className="relative p-2 text-gray-400 hover:text-mat-500 transition-all bg-mat-800 rounded-lg border border-mat-700"
              aria-label="Ver Carrito"
            >
              <ShoppingBag size={16} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-mat-500 text-white text-[7px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-mat-900">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button - Compact */}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="xl:hidden p-2 text-white bg-mat-800 rounded-lg border border-mat-700 focus:outline-none"
              aria-label={isOpen ? "Cerrar" : "Menú"}
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Menú Desplegable Fijo - Rediseñado para ser menos "aparatoso" */}
      {isOpen && (
        <div className="fixed inset-0 z-[110] bg-mat-900 flex flex-col animate-fade-in">
          {/* Header del menú más compacto */}
          <div className="h-14 md:h-16 border-b border-mat-800 flex items-center justify-between px-4 bg-mat-950">
            <div className="flex items-center gap-2 opacity-50">
              <Disc className="w-4 h-4 text-mat-500" />
              <span className="font-exo font-black text-sm text-white tracking-tighter uppercase">MAT32</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-2 text-white bg-mat-800 rounded-lg border border-mat-700"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-6 flex flex-col items-center justify-center gap-2">
            {navLinks.map((l, idx) => (
              <Link 
                key={l.path} 
                to={l.path} 
                onClick={() => setIsOpen(false)} 
                className={`group w-full max-w-xs flex items-center justify-between py-3 px-5 rounded-xl border transition-all ${isActive(l.path) ? 'bg-mat-800 border-mat-500/50 text-mat-500 shadow-lg' : 'bg-mat-950/50 border-mat-800 text-gray-300 hover:border-mat-700'}`}
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <span className={`text-xs font-black uppercase tracking-widest font-exo ${isActive(l.path) ? 'text-mat-500' : 'group-hover:text-white'}`}>
                  {l.name}
                </span>
                <ArrowRight size={12} className={`transition-transform duration-300 ${isActive(l.path) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`} />
              </Link>
            ))}
            
            <Link 
              to="/contact" 
              onClick={() => setIsOpen(false)} 
              className="mt-6 w-full max-w-xs py-4 bg-mat-500 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-xl shadow-xl flex items-center justify-center gap-2 hover:bg-mat-400 transition-all active:scale-95"
            >
              RESERVAR AHORA
            </Link>
          </nav>

          <div className="p-6 border-t border-mat-800 bg-mat-950 flex flex-col items-center gap-3">
             <button onClick={() => { toggleLanguage(); setIsOpen(false); }} className="flex items-center gap-2 text-[9px] font-black text-mat-500 uppercase tracking-[0.2em]">
                <Globe size={12} /> {language === 'es' ? 'Versión en Inglés' : 'Spanish Version'}
             </button>
             <div className="text-[8px] font-black text-gray-700 uppercase tracking-widest">Valencia • Ruzafa Hub</div>
          </div>
        </div>
      )}
    </>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <FavoritesProvider>
        <CartProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-mat-900 text-gray-100 font-sans selection:bg-mat-500 selection:text-white pt-14 md:pt-16">
              <Navigation />
              <main className="flex-grow">
                <Suspense fallback={<Loading />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/bar" element={<Bar />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/records" element={<Records />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/open-decks" element={<OpenDecks />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/alquiler-local-eventos-valencia" element={<PrivateEvents />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/legal/:type" element={<Legal />} />
                  </Routes>
                </Suspense>
              </main>
              <CartDrawer />
              <AIChat />
              <footer className="bg-mat-950 py-16 border-t border-mat-800 text-center">
                <div className="container mx-auto px-6">
                  <div className="flex justify-center mb-8">
                     <Disc className="w-8 h-8 text-mat-500 opacity-20" />
                  </div>
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.8em] mb-8">MAT32 | RUZAFA DISCOS BAR VALENCIA</p>
                  <div className="flex flex-wrap justify-center gap-6 text-[9px] font-black text-gray-700 uppercase tracking-widest mb-10">
                    <Link to="/legal/aviso-legal" className="hover:text-mat-500 transition-colors">Aviso Legal</Link>
                    <Link to="/legal/privacidad" className="hover:text-mat-500 transition-colors">Privacidad</Link>
                    <Link to="/legal/cookies" className="hover:text-mat-500 transition-colors">Cookies</Link>
                    <Link to="/admin" className="hover:text-mat-500 transition-colors border-l border-mat-800 pl-6">CORE ADMIN</Link>
                  </div>
                  <p className="text-[7px] text-gray-800 font-black uppercase tracking-widest">© 2025 RARERTRAXX BEAT S.L. - ALL SIGNALS ENCRYPTED</p>
                </div>
              </footer>
            </div>
          </Router>
        </CartProvider>
      </FavoritesProvider>
    </LanguageProvider>
  );
};

export default App;
