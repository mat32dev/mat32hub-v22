
import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X, Disc, ShoppingBag, Users, Calendar, Info, MessageSquare, Shield, Music, Headphones } from 'lucide-react';

// Providers
import { CartProvider, useCart } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { CartDrawer } from './components/CartDrawer';
import { AIChat } from './components/AIChat';

// Paginas con carga dinámica (Mejora la velocidad SEO)
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
    <Disc className="w-12 h-12 text-mat-500 animate-spin-slow" />
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
  ];

  const active = (p: string) => location.pathname === p ? 'text-mat-500' : 'text-gray-400 hover:text-white';

  return (
    <header className="sticky top-0 z-50 w-full bg-mat-900/80 backdrop-blur-xl border-b border-mat-800 h-20">
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Disc className="w-8 h-8 text-mat-500 animate-spin-slow" />
          <span className="font-exo font-black text-xl text-white tracking-tighter">MAT<span className="text-mat-500">32</span></span>
        </Link>

        {/* Desktop */}
        <nav className="hidden xl:flex items-center gap-6">
          {navLinks.map(l => (
            <Link key={l.path} to={l.path} className={`text-[9px] font-black uppercase tracking-widest transition-colors ${active(l.path)}`}>{l.name}</Link>
          ))}
          <div className="flex items-center gap-4 pl-4 border-l border-mat-800">
            <button onClick={toggleLanguage} className="text-[10px] font-black text-gray-500 hover:text-white transition-colors uppercase">{language === 'es' ? 'EN' : 'ES'}</button>
            <button onClick={toggleCart} className="relative p-2 text-gray-400 hover:text-mat-500 transition-colors">
              <ShoppingBag size={18} />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-mat-500 text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full">{cartCount}</span>}
            </button>
            <Link to="/contact" className="px-5 py-2 bg-mat-500 text-white font-black text-[9px] uppercase tracking-widest clip-path-slant hover:bg-mat-400 transition-all shadow-lg">RESERVAR</Link>
          </div>
        </nav>

        {/* Mobile Toggle */}
        <div className="xl:hidden flex items-center gap-4">
           <button onClick={toggleCart} className="text-gray-400 relative p-2">
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-mat-500 text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full">{cartCount}</span>}
           </button>
           <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
           </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {isOpen && (
        <div className="xl:hidden fixed inset-0 z-[60] bg-mat-900 pt-24 px-8 flex flex-col gap-6 text-center animate-fade-in overflow-y-auto pb-12">
          {navLinks.map(l => (
            <Link key={l.path} to={l.path} onClick={() => setIsOpen(false)} className="text-3xl font-black uppercase tracking-tighter text-white border-b border-mat-800 pb-2">{l.name}</Link>
          ))}
          <Link to="/contact" onClick={() => setIsOpen(false)} className="mt-4 py-5 bg-mat-500 text-white font-black uppercase tracking-widest text-sm rounded-xl">RESERVAR MESA</Link>
          <div className="flex justify-center gap-8 mt-4">
             <button onClick={toggleLanguage} className="text-xs font-black text-mat-500 uppercase">{language === 'es' ? 'English Version' : 'Versión Española'}</button>
          </div>
          <Link to="/admin" onClick={() => setIsOpen(false)} className="text-[9px] text-gray-700 font-black uppercase tracking-[0.5em] mt-8 flex items-center justify-center gap-2"><Shield size={12}/> CORE SYSTEM</Link>
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
            <div className="flex flex-col min-h-screen bg-mat-900 text-gray-100 font-sans selection:bg-mat-500 selection:text-white">
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
                  <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.6em] mb-6">MAT32 | RUZAFA DISCOS BAR VALENCIA</p>
                  <div className="flex flex-wrap justify-center gap-8 text-[9px] font-black text-gray-700 uppercase tracking-widest mb-10">
                    <Link to="/legal/aviso-legal" className="hover:text-mat-500 transition-colors">Aviso Legal</Link>
                    <Link to="/legal/privacidad" className="hover:text-mat-500 transition-colors">Privacidad</Link>
                    <Link to="/legal/cookies" className="hover:text-mat-500 transition-colors">Cookies</Link>
                  </div>
                  <div className="flex justify-center items-center gap-2 text-[8px] text-gray-800 font-black">
                    <Shield size={10} /> <Link to="/admin" className="hover:text-gray-500">CORE ADMIN</Link>
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
