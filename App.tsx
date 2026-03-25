import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X, Disc, Volume2, VolumeX, Globe } from 'lucide-react';

import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { RadioProvider, useRadio } from './context/RadioContext';
import { CartDrawer } from './components/CartDrawer';
import { RadioBar } from './components/RadioBar';

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
import { Gallery } from './pages/Gallery';

import { EventDetail } from './pages/EventDetail';
import { RecordDetail } from './pages/RecordDetail';
import { PostDetail } from './pages/PostDetail';
import { RadioPage } from './pages/Radio';

const Navigation = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { t, language, toggleLanguage } = useLanguage();
  const { isPlaying, toggle } = useRadio();
  const location = useLocation();

  React.useEffect(() => {
    setIsOpen(false);
    if (location.hash) {
      setTimeout(() => {
        const el = document.querySelector(location.hash);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

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
            <Disc className="w-8 h-8 text-mat-500 group-hover:rotate-180 transition-transform duration-1000" />
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
                {isActive(l.path) && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-mat-500"></span>}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={toggleLanguage} className="hidden sm:flex items-center gap-2 text-[9px] font-black text-gray-400 hover:text-white uppercase px-3 py-2 bg-mat-800 rounded-xl border border-mat-700">
              <Globe size={13} /> {language === 'es' ? 'EN' : 'ES'}
            </button>
            <button
              onClick={toggle}
              className="relative p-2.5 text-gray-400 hover:text-mat-500 transition-all bg-mat-800 rounded-xl border border-mat-700"
              title={isPlaying ? 'Pausar radio' : 'Reproducir radio'}
            >
              {isPlaying ? <Volume2 size={18} className="text-mat-500" /> : <VolumeX size={18} />}
              {isPlaying && <span className="absolute -top-1 -right-1 w-2 h-2 bg-mat-500 rounded-full" style={{ boxShadow: '0 0 5px #f97316' }} />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="xl:hidden p-2.5 text-white bg-mat-800 rounded-xl border border-mat-700">
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {isOpen && (
        <div className="fixed top-20 left-0 right-0 z-[110] bg-mat-950/98 backdrop-blur-xl border-b border-mat-800 animate-fade-in shadow-2xl xl:hidden">
          <nav className="container mx-auto px-6 py-4 grid grid-cols-2 gap-x-6 gap-y-1">
            {navLinks.map((l, idx) => (
              <Link
                key={idx}
                to={l.path}
                className={`py-2.5 px-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                  isActive(l.path) ? 'text-mat-500 bg-mat-800' : 'text-gray-400 hover:text-white hover:bg-mat-800'
                }`}
              >
                {l.name}
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
          <RadioProvider>
            <Router>
              <div className="flex flex-col min-h-screen bg-mat-900 text-gray-100 font-sans pt-20 pb-14">
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
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/alquiler-local-eventos-valencia" element={<PrivateEvents />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/radio" element={<RadioPage />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/legal/:type" element={<Legal />} />
                  </Routes>
                </main>
                <CartDrawer />
                <RadioBar />
                <footer className="bg-mat-950 py-16 border-t border-mat-900">
                  <div className="container mx-auto px-6 flex flex-col items-center text-center">
                    <div className="flex items-center gap-3 mb-8 opacity-60">
                      <Disc className="w-5 h-5 text-mat-500" />
                      <span className="font-exo font-black text-xl text-white tracking-widest uppercase">MAT<span className="text-mat-500">32</span></span>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-6 text-[8px] font-black text-gray-600 uppercase tracking-[0.4em] mb-8">
                      <Link to="/legal/aviso-legal" className="hover:text-mat-500">AVISO LEGAL</Link>
                      <span className="opacity-20">•</span>
                      <Link to="/legal/privacidad" className="hover:text-mat-500">PRIVACIDAD</Link>
                      <span className="opacity-20">•</span>
                      <Link to="/admin" className="hover:text-mat-500">MATRIX_ACCESS</Link>
                    </div>
                    <p className="text-[7px] text-gray-800 font-black uppercase tracking-[0.8em] opacity-30">© 2025 RARERTRAXX BEAT S.L. VALENCIA_SPAIN</p>
                  </div>
                </footer>
              </div>
            </Router>
          </RadioProvider>
        </CartProvider>
      </WishlistProvider>
    </LanguageProvider>
  );
};

export default App;
