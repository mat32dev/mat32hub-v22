
import React, { useState, lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X, Disc, ShoppingBag } from 'lucide-react';

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

  const active = (p: string) => (location.pathname === p || (location.pathname === '/' && p === '/')) 
    ? 'text-mat-500 border-b border-mat-500 pb-0.5' 
    : 'text-gray-400 hover:text-white transition-colors pb-0.5';

  return (
    <header className="fixed top-0 z-50 w-full bg-mat-900/80 backdrop-blur-xl border-b border-mat-800 h-14 md:h-16 flex items-center">
      <div className="container mx-auto px-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <Disc className="w-5 h-5 md:w-6 md:h-6 text-mat-500 group-hover:rotate-180 transition-transform duration-1000" />
          <span className="font-exo font-black text-base md:text-lg text-white tracking-tighter uppercase">MAT<span className="text-mat-500">32</span></span>
        </Link>

        {/* Desktop Navigation - Optimized Breakpoint */}
        <nav className="hidden lg:flex items-center gap-x-4 xl:gap-x-6">
          {navLinks.map(l => (
            <Link 
              key={l.path} 
              to={l.path} 
              className={`text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${active(l.path)}`}
            >
              {l.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 pr-3 border-r border-mat-800 h-6">
             <button onClick={toggleLanguage} className="text-[9px] font-black text-gray-500 hover:text-white uppercase transition-colors">{language === 'es' ? 'EN' : 'ES'}</button>
          </div>
          
          <button onClick={toggleCart} className="relative p-1.5 text-gray-400 hover:text-mat-500 transition-colors">
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-mat-500 text-white text-[7px] font-black w-3.5 h-3.5 flex items-center justify-center rounded-full border border-mat-900 animate-fade-in">
                {cartCount}
              </span>
            )}
          </button>

          <Link to="/contact" className="hidden sm:block px-4 py-2 bg-mat-500 text-white font-black text-[9px] uppercase tracking-widest clip-path-slant hover:bg-mat-400 transition-all shadow-lg">
            RESERVAR
          </Link>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-white p-1 hover:text-mat-500 transition-colors">
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-mat-900/98 pt-20 px-8 flex flex-col gap-3 text-center animate-fade-in overflow-y-auto pb-12">
          {navLinks.map(l => (
            <Link 
              key={l.path} 
              to={l.path} 
              onClick={() => setIsOpen(false)} 
              className="text-xl font-black uppercase tracking-tighter text-white border-b border-mat-800/30 pb-3 active:text-mat-500 transition-colors"
            >
              {l.name}
            </Link>
          ))}
          <Link to="/contact" onClick={() => setIsOpen(false)} className="mt-4 py-5 bg-mat-500 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-2xl">
            RESERVAR
          </Link>
          <div className="flex justify-center gap-8 mt-6">
             <button onClick={() => { toggleLanguage(); setIsOpen(false); }} className="text-[10px] font-black text-mat-500 uppercase">
                {language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
             </button>
          </div>
        </div>
      )}
    </header>
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
