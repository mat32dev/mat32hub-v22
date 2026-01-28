import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X, Disc, ShoppingBag, Globe, ArrowRight, Heart } from 'lucide-react';

// Providers & Components
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider, useWishlist } from './context/WishlistContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { CartDrawer } from './components/CartDrawer';
import { AIChat } from './components/AIChat';

// Pages
import { Home } from './pages/Home';
import { Bar } from './pages/Bar';
import { Events } from './pages/Events';
import { Records } from './pages/Records';
import { Community } from './pages/Community';
import { OpenDecks } from './pages/OpenDecks';
import { Contact } from './pages/Contact';
import { PrivateEvents } from './pages/PrivateEvents';
import { Checkout } from './pages/Checkout';
import { Legal } from './pages/Legal';
import { Admin } from './pages/Admin';
import { Wishlist } from './pages/Wishlist';

// Detail Pages
import { EventDetail } from './pages/EventDetail';
import { RecordDetail } from './pages/RecordDetail';
import { PostDetail } from './pages/PostDetail';

const Navigation = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { cartCount, toggleCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { t, language, toggleLanguage } = useLanguage();
  const location = useLocation();

  React.useEffect(() => {
    setIsOpen(false);
    window.scrollTo(0, 0);
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
      <header className="fixed top-0 left-0 right-0 z-[100] h-20 bg-mat-900/95 backdrop-blur-xl border-b border-mat-800 flex items-center">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 group shrink-0">
            <div className="relative">
              <Disc className="w-8 h-8 text-mat-500 group-hover:rotate-180 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-mat-500/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="flex flex-col -space-y-1.5">
              <span className="font-exo font-black text-2xl text-white tracking-tighter uppercase leading-none">MAT<span className="text-mat-500">32</span></span>
              <span className="text-[8px] font-black text-gray-500 tracking-[0.4em] uppercase">DISCOS BAR VLC</span>
            </div>
          </Link>

          <nav className="hidden xl:flex items-center gap-x-8">
            {navLinks.map(l => (
              <Link 
                key={l.path} 
                to={l.path} 
                className={`text-[9px] font-black uppercase tracking-[0.3em] transition-all relative py-2 ${isActive(l.path) ? 'text-mat-500' : 'text-gray-400 hover:text-white'}`}
              >
                {l.name}
                {isActive(l.path) && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-mat-500 animate-fade-in"></span>}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleLanguage} 
              className="hidden sm:flex items-center gap-2 text-[9px] font-black text-gray-400 hover:text-white uppercase transition-colors px-4 py-2 bg-mat-800 rounded-2xl border border-mat-700"
            >
              <Globe size={14} /> {language === 'es' ? 'EN' : 'ES'}
            </button>

            <Link 
              to="/wishlist" 
              className="relative p-3 text-gray-400 hover:text-mat-500 transition-all bg-mat-800 rounded-2xl border border-mat-700 shadow-lg"
            >
              <Heart size={20} className={wishlistCount > 0 ? 'fill-mat-500 text-mat-500' : ''} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-mat-500 text-white text-[8px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-mat-900">
                  {wishlistCount}
                </span>
              )}
            </Link>
            
            <button 
              onClick={toggleCart} 
              className="relative p-3 text-gray-400 hover:text-mat-500 transition-all bg-mat-800 rounded-2xl border border-mat-700 shadow-lg"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-mat-500 text-white text-[8px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-mat-900 animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="xl:hidden p-3 text-white bg-mat-800 rounded-2xl border border-mat-700"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-[110] bg-mat-950 flex flex-col animate-fade-in overflow-hidden">
          <div className="h-20 border-b border-mat-800 flex items-center justify-between px-8 bg-mat-900">
            <div className="flex items-center gap-3">
              <Disc className="w-6 h-6 text-mat-500" />
              <span className="font-exo font-black text-xl text-white tracking-tighter uppercase leading-none">MAT32 VALENCIA</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-3 text-white bg-mat-800 rounded-2xl border border-mat-700">
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 px-10 pt-8 flex flex-col items-start justify-center gap-4 overflow-y-auto">
            {navLinks.map((l, idx) => (
              <Link 
                key={idx} 
                to={l.path} 
                className={`group w-full flex items-center justify-between py-4 transition-all ${isActive(l.path) ? 'text-mat-500' : 'text-gray-300 hover:text-white'}`}
              >
                <span className="text-4xl font-black uppercase tracking-tighter font-exo">{l.name}</span>
                <ArrowRight size={24} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <WishlistProvider>
        <CartProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-mat-900 text-gray-100 font-sans pt-20">
              <Navigation />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/bar" element={<Bar />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/events/:id" element={<EventDetail />} />
                  <Route path="/records" element={<Records />} />
                  <Route path="/records/:id" element={<RecordDetail />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/community/:id" element={<PostDetail />} />
                  <Route path="/open-decks" element={<OpenDecks />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/alquiler-local-eventos-valencia" element={<PrivateEvents />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/legal/:type" element={<Legal />} />
                </Routes>
              </main>
              <CartDrawer />
              <AIChat />
              <footer className="bg-mat-950 py-16 border-t border-mat-900">
                <div className="container mx-auto px-6 flex flex-col items-center text-center">
                  <div className="flex items-center gap-3 mb-8 opacity-60 hover:opacity-100 transition-opacity">
                    <Disc className="w-5 h-5 text-mat-500" />
                    <span className="font-exo font-black text-xl text-white tracking-widest uppercase">
                      MAT<span className="text-mat-500">32</span>
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-6 text-[8px] font-black text-gray-600 uppercase tracking-[0.4em] mb-8">
                    <Link to="/legal/aviso-legal" className="hover:text-mat-500 transition-colors">AVISO LEGAL</Link>
                    <span className="opacity-20">•</span>
                    <Link to="/legal/privacidad" className="hover:text-mat-500 transition-colors">PRIVACIDAD</Link>
                    <span className="opacity-20">•</span>
                    <Link to="/admin" className="hover:text-mat-500 transition-colors">MATRIX_ACCESS</Link>
                  </div>
                  <p className="text-[7px] text-gray-800 font-black uppercase tracking-[0.8em] opacity-30">
                    © 2025 RARERTRAXX BEAT S.L. VALENCIA_SPAIN
                  </p>
                </div>
              </footer>
            </div>
          </Router>
        </CartProvider>
      </WishlistProvider>
    </LanguageProvider>
  );
};

export default App;