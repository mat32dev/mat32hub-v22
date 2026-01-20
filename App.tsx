import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X, Disc, ShoppingBag, Loader2, Users, Calendar, Info } from 'lucide-react';

// Providers
import { CartProvider, useCart } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { CartDrawer } from './components/CartDrawer';
import { AIChat } from './components/AIChat';

// Carga perezosa de páginas para mejorar velocidad (FCP/LCP)
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Bar = lazy(() => import('./pages/Bar').then(m => ({ default: m.Bar })));
const Events = lazy(() => import('./pages/Events').then(m => ({ default: m.Events })));
const Records = lazy(() => import('./pages/Records').then(m => ({ default: m.Records })));
const Community = lazy(() => import('./pages/Community').then(m => ({ default: m.Community })));
const OpenDecks = lazy(() => import('./pages/OpenDecks').then(m => ({ default: m.OpenDecks })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const PrivateEvents = lazy(() => import('./pages/PrivateEvents').then(m => ({ default: m.PrivateEvents })));
const Checkout = lazy(() => import('./pages/Checkout').then(m => ({ default: m.Checkout })));
const Admin = lazy(() => import('./pages/Admin').then(m => ({ default: m.Admin })));
const Legal = lazy(() => import('./pages/Legal').then(m => ({ default: m.Legal })));

const LoadingScreen = () => (
  <div className="min-h-screen bg-mat-900 flex flex-col items-center justify-center">
    <Disc className="w-12 h-12 text-mat-500 animate-spin-slow mb-4" />
    <p className="text-mat-500 font-black uppercase text-[10px] tracking-widest animate-pulse font-exo">Cargando Experiencia Hi-Fi...</p>
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
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-mat-900/90 backdrop-blur-xl border-b border-mat-800 h-20 md:h-24">
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Disc className="w-9 h-9 text-mat-500 animate-spin-slow group-hover:text-white transition-colors" />
          <div className="flex flex-col">
            <span className="font-exo font-black text-2xl text-white tracking-tight leading-none">MAT<span className="text-mat-500">32</span></span>
            <span className="font-exo text-[0.5rem] text-gray-500 uppercase tracking-[0.3em] font-black">DISCOS BAR</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map(link => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors relative group ${isActive(link.path) ? 'text-mat-500' : 'text-gray-400 hover:text-white'}`}
            >
              {link.name}
              {isActive(link.path) && <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-mat-500"></span>}
            </Link>
          ))}
          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-mat-800">
            <button onClick={toggleLanguage} className="text-[10px] font-black text-gray-500 hover:text-white uppercase transition-colors">{language === 'es' ? 'EN' : 'ES'}</button>
            <button onClick={toggleCart} className="relative p-2 text-gray-400 hover:text-mat-500 transition-colors">
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-mat-500 text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-lg">{cartCount}</span>}
            </button>
            <Link to="/contact" className="px-5 py-2.5 bg-mat-500 text-white font-black text-[9px] uppercase tracking-widest clip-path-slant hover:bg-mat-400 transition-all shadow-lg shadow-mat-500/20">RESERVAR</Link>
          </div>
        </nav>

        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center gap-4">
           <button onClick={toggleCart} className="relative p-2 text-gray-400">
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-mat-500 text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full">{cartCount}</span>}
           </button>
           <button onClick={() => setIsOpen(!isOpen)} className="text-white">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
           </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-mat-900 pt-24 px-8 animate-fade-in">
          <nav className="flex flex-col gap-8 text-center">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className={`text-3xl font-black uppercase tracking-tighter hover:text-mat-500 transition-colors ${isActive(link.path) ? 'text-mat-500' : 'text-white'}`}>{link.name}</Link>
            ))}
            <button onClick={() => {toggleLanguage(); setIsOpen(false);}} className="text-mat-500 font-black uppercase tracking-widest text-sm mt-8 border border-mat-500 py-4 rounded-xl">Cambiar Idioma</button>
          </nav>
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
                <Suspense fallback={<LoadingScreen />}>
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
              <footer className="bg-mat-950 py-16 border-t border-mat-800">
                <div className="container mx-auto px-6 text-center">
                  <div className="flex justify-center gap-12 mb-10 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                    <Disc size={32} /> <Users size={32} /> <Calendar size={32} />
                  </div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] mb-6">MAT32 | THE HI-FI SANCTUARY | VALENCIA</p>
                  <div className="flex flex-wrap justify-center gap-8 text-[9px] font-black text-gray-700 uppercase tracking-widest">
                    <Link to="/legal/aviso-legal" className="hover:text-mat-500">Aviso Legal</Link>
                    <Link to="/legal/privacidad" className="hover:text-mat-500">Privacidad</Link>
                    <Link to="/legal/cookies" className="hover:text-mat-500">Cookies</Link>
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