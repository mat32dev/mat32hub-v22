
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X, Disc, ShoppingBag, Globe, ArrowRight, Loader2 } from 'lucide-react';

// Providers
import { CartProvider, useCart } from './context/CartContext.tsx';
import { FavoritesProvider } from './context/FavoritesContext.tsx';
import { LanguageProvider, useLanguage } from './context/LanguageContext.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { AIChat } from './components/AIChat.tsx';

// Lazy Loaded Pages for performance
const Home = lazy(() => import('./pages/Home.tsx').then(m => ({ default: m.Home })));
const Bar = lazy(() => import('./pages/Bar.tsx').then(m => ({ default: m.Bar })));
const Events = lazy(() => import('./pages/Events.tsx').then(m => ({ default: m.Events })));
const Records = lazy(() => import('./pages/Records.tsx').then(m => ({ default: m.Records })));
const Community = lazy(() => import('./pages/Community.tsx').then(m => ({ default: m.Community })));
const OpenDecks = lazy(() => import('./pages/OpenDecks.tsx').then(m => ({ default: m.OpenDecks })));
const Contact = lazy(() => import('./pages/Contact.tsx').then(m => ({ default: m.Contact })));
const PrivateEvents = lazy(() => import('./pages/PrivateEvents.tsx').then(m => ({ default: m.PrivateEvents })));
const Checkout = lazy(() => import('./pages/Checkout.tsx').then(m => ({ default: m.Checkout })));
const Legal = lazy(() => import('./pages/Legal.tsx').then(m => ({ default: m.Legal })));
const Admin = lazy(() => import('./pages/Admin.tsx').then(m => ({ default: m.Admin })));

const Loading = () => (
  <div className="h-screen w-full bg-mat-900 flex flex-col items-center justify-center">
    <Disc className="w-12 h-12 text-mat-500 animate-spin-slow mb-4" />
    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-700">Iniciando Protocolo...</span>
  </div>
);

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cartCount, toggleCart } = useCart();
  const { t, language, toggleLanguage } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

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
    { name: 'ALQUILER', path: '/alquiler-local-eventos-valencia' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname === path) return true;
    return false;
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100] h-16 bg-mat-900/95 backdrop-blur-md border-b border-mat-800 flex items-center shadow-lg">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group shrink-0" aria-label="Inicio">
            <Disc className="w-6 h-6 text-mat-500 group-hover:rotate-180 transition-transform duration-1000" />
            <div className="flex flex-col -space-y-1">
              <span className="font-exo font-black text-xl text-white tracking-tighter uppercase leading-none">MAT<span className="text-mat-500">32</span></span>
              <span className="text-[7px] font-black text-gray-500 tracking-[0.3em] uppercase">DISCOS BAR</span>
            </div>
          </Link>

          <nav className="hidden xl:flex items-center gap-x-6">
            {navLinks.map(l => (
              <Link 
                key={l.path} 
                to={l.path} 
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all ${isActive(l.path) ? 'text-mat-500' : 'text-gray-400 hover:text-white'}`}
              >
                {l.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={toggleLanguage} 
              className="hidden sm:flex items-center gap-1.5 text-[9px] font-black text-gray-400 hover:text-white uppercase transition-colors px-3 py-1.5 bg-mat-800 rounded-xl border border-mat-700"
            >
              <Globe size={12} /> {language === 'es' ? 'EN' : 'ES'}
            </button>
            
            <button 
              onClick={toggleCart} 
              className="relative p-2.5 text-gray-400 hover:text-mat-500 transition-all bg-mat-800 rounded-xl border border-mat-700"
              aria-label="Ver Carrito"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-mat-500 text-white text-[7px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full border border-mat-900 shadow-lg">
                  {cartCount}
                </span>
              )}
            </button>

            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="xl:hidden p-2 text-white bg-mat-800 rounded-xl border border-mat-700"
              aria-label={isOpen ? "Cerrar" : "Menú"}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Menú Desplegable (Mobile Overlay) - Versión Comprimida */}
      {isOpen && (
        <div className="fixed inset-0 z-[110] bg-mat-950 flex flex-col animate-fade-in overflow-hidden">
          {/* Header del menú */}
          <div className="h-16 border-b border-mat-800 flex items-center justify-between px-6 bg-mat-900 flex-shrink-0">
            <div className="flex items-center gap-3">
              <Disc className="w-5 h-5 text-mat-500" />
              <span className="font-exo font-black text-lg text-white tracking-tighter uppercase leading-none">MAT32 <span className="text-gray-600 text-[10px] tracking-widest ml-2 font-sans">VALENCIA</span></span>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 text-white bg-mat-800 rounded-xl border border-mat-700">
              <X size={22} />
            </button>
          </div>

          {/* Navegación central - Paddings reducidos para que todo quepa */}
          <nav className="flex-1 px-8 pt-4 pb-4 flex flex-col items-start justify-center gap-0.5 overflow-hidden">
            {navLinks.map((l, idx) => (
              <Link 
                key={idx} 
                to={l.path} 
                className={`group w-full flex items-center justify-between py-2 md:py-3 transition-all ${isActive(l.path) ? 'text-mat-500' : 'text-gray-300 hover:text-white'}`}
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                <span className="text-2xl md:text-3xl font-black uppercase tracking-tighter font-exo">
                  {l.name}
                </span>
                <ArrowRight size={18} className={`transition-transform duration-300 ${isActive(l.path) ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
              </Link>
            ))}
            
            {/* Botones de acción comprimidos */}
            <div className="w-full mt-4 grid grid-cols-2 gap-3">
              <Link to="/contact" className="py-4 bg-mat-500 text-white font-black uppercase tracking-[0.2em] text-[9px] rounded-xl shadow-2xl flex items-center justify-center active:scale-95 transition-transform">
                RESERVAR
              </Link>
              <Link to="/alquiler-local-eventos-valencia" className="py-4 bg-mat-800 text-white font-black uppercase tracking-[0.2em] text-[9px] rounded-xl shadow-xl flex items-center justify-center active:scale-95 transition-transform border border-mat-700">
                ALQUILER
              </Link>
            </div>
          </nav>

          {/* Footer del menú comprimido */}
          <div className="px-8 py-6 border-t border-mat-800 bg-mat-900 flex flex-col items-center gap-3 flex-shrink-0">
             <button onClick={toggleLanguage} className="flex items-center gap-2 text-[9px] font-black text-mat-500 uppercase tracking-widest">
                <Globe size={12} /> {language === 'es' ? 'Switch to English' : 'Versión en Español'}
             </button>
             <div className="text-[7px] font-black text-gray-700 uppercase tracking-[0.4em] text-center">MAT32 PROTOCOL • RUZAFA • VALENCIA</div>
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
            <div className="flex flex-col min-h-screen bg-mat-900 text-gray-100 font-sans selection:bg-mat-500 selection:text-white pt-16">
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
              <footer className="bg-mat-950 py-20 border-t border-mat-800">
                <div className="container mx-auto px-6 text-center">
                  <div className="flex justify-center mb-10">
                     <Disc className="w-10 h-10 text-mat-500 opacity-20" />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-widest mb-4 font-exo">MAT32 <span className="text-mat-500">VALENCIA</span></h3>
                  <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.8em] mb-12">RUZAFA DISCOS BAR • HI-FI SANCTUARY</p>
                  
                  <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black text-gray-500 uppercase tracking-widest mb-12">
                    <Link to="/legal/aviso-legal" className="hover:text-mat-500 transition-colors">Aviso Legal</Link>
                    <Link to="/legal/privacidad" className="hover:text-mat-500 transition-colors">Privacidad</Link>
                    <Link to="/legal/cookies" className="hover:text-mat-500 transition-colors">Cookies</Link>
                    <Link to="/admin" className="hover:text-mat-500 transition-colors border-l border-mat-800 pl-8">ADMIN CORE</Link>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <p className="text-[8px] text-gray-800 font-black uppercase tracking-[0.4em]">© 2025 RARERTRAXX BEAT S.L. - ALL SIGNAL PROTECTED</p>
                    <p className="text-[7px] text-gray-900 font-bold uppercase">Calle Matías Perelló 32, Valencia</p>
                  </div>
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
