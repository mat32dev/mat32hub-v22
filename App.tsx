
import React, { useMemo, useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home } from './pages/Home.tsx';
import { Events } from './pages/Events.tsx';
import { Community } from './pages/Community.tsx';
import { OpenDecks } from './pages/OpenDecks.tsx';
import { Contact } from './pages/Contact.tsx';
import { PrivateEvents } from './pages/PrivateEvents.tsx';
import { Records } from './pages/Records.tsx';
import { Bar } from './pages/Bar.tsx';
import { Checkout } from './pages/Checkout.tsx';
import { Admin } from './pages/Admin.tsx';
import { Legal } from './pages/Legal.tsx';
import { EventDetail } from './pages/EventDetail.tsx';
import { RecordDetail } from './pages/RecordDetail.tsx';
import { PostDetail } from './pages/PostDetail.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { CartProvider, useCart } from './context/CartContext.tsx';
import { FavoritesProvider } from './context/FavoritesContext.tsx';
import { LanguageProvider, useLanguage } from './context/LanguageContext.tsx';
import { Menu, X, Disc, Instagram, ShoppingBag, Globe, Settings, Music, Zap, Calendar } from 'lucide-react';
import { AIChat } from './components/AIChat.tsx';

const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`flex items-center gap-2 group ${className}`}>
    <div className="relative">
      <Disc className="w-9 h-9 text-mat-500 animate-spin-slow group-hover:text-white transition-colors" />
    </div>
    <div className="flex flex-col">
      <div className="flex items-start leading-none">
        <span className="font-exo font-black text-2xl text-white tracking-tight">MAT</span>
        <span className="font-exo font-bold text-[0.7rem] text-mat-500 -mt-1 ml-0.5">32</span>
      </div>
      <span className="font-exo text-[0.55rem] text-gray-500 uppercase tracking-[0.25em] font-black leading-none group-hover:text-mat-400 transition-colors mt-0.5">DISCOS BAR</span>
    </div>
  </div>
);

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { toggleCart, cartCount } = useCart();
  const { toggleLanguage, language, t } = useLanguage();

  const navLinks = useMemo(() => [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.bar'), path: '/bar' },
    { name: t('nav.events'), path: '/events' },
    { name: t('nav.records'), path: '/records' },
    { name: t('nav.community'), path: '/community' },
    { name: t('nav.open_decks'), path: '/open-decks' },
  ], [t]); 

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-mat-900/95 backdrop-blur-xl border-b border-mat-800 h-20 md:h-24">
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        <Link to="/"><Logo /></Link>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-8">
          <nav className="flex items-center space-x-4 xl:space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[9px] xl:text-[10px] font-black uppercase tracking-[0.25em] transition-all relative group ${isActive(link.path) ? 'text-mat-500' : 'text-gray-400 hover:text-white'}`}
              >
                {link.name}
                {isActive(link.path) && <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-mat-500 animate-fade-in"></span>}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 xl:gap-6 border-l border-mat-800 pl-6 xl:pl-8">
            <Link to="/contact#reserva" className="px-6 py-3.5 bg-mat-500 text-white hover:bg-mat-400 font-black text-[11px] uppercase tracking-[0.25em] transition-all shadow-[0_10px_40px_rgba(234,88,12,0.3)] clip-path-slant flex items-center gap-2 group">
              {t('nav.reserve_table')}
            </Link>

            <Link to="/alquiler-local-eventos-valencia" className="px-5 py-3.5 border-2 border-white text-white hover:bg-white hover:text-mat-900 font-black text-[11px] uppercase tracking-[0.25em] transition-all clip-path-slant flex items-center gap-2 group">
              {t('nav.private_events').toUpperCase()}
            </Link>

            <div className="flex items-center gap-3 ml-2">
              <button onClick={toggleLanguage} className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                {language === 'es' ? 'EN' : 'ES'}
              </button>
              <button onClick={toggleCart} className="relative p-3 bg-mat-800 rounded-xl text-gray-400 hover:text-mat-500 transition-colors border border-mat-700">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-mat-500 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg border-2 border-mat-800">{cartCount}</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 lg:hidden">
           <Link to="/contact#reserva" className="px-4 py-2.5 bg-mat-500 text-white rounded-lg shadow-lg font-black text-[10px] uppercase tracking-widest">
              {t('nav.reserve_table')}
           </Link>
           <button onClick={toggleCart} className="relative p-2.5 bg-mat-800 rounded-xl text-gray-400 hover:text-mat-500 transition-colors border border-mat-700">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-mat-500 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg border-2 border-mat-800">{cartCount}</span>}
          </button>
          <button className="text-white p-2.5" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-mat-900 border-b border-mat-800 absolute w-full left-0 z-50 animate-fade-in shadow-2xl max-h-[85vh] overflow-y-auto">
          <nav className="flex flex-col p-8 space-y-6">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} onClick={() => setIsMobileMenuOpen(false)} className={`text-xs font-black uppercase tracking-[0.4em] ${isActive(link.path) ? 'text-mat-500' : 'text-gray-400'}`}>
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col gap-4 border-t border-mat-800 pt-6">
              <Link to="/contact#reserva" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 bg-mat-500 text-white text-center font-black uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-3">
                {t('nav.reserve_table')}
              </Link>
              <Link to="/alquiler-local-eventos-valencia" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 border-2 border-mat-700 text-gray-500 text-center font-black uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-3">
                {t('nav.private_events').toUpperCase()}
              </Link>
              <button onClick={() => { toggleLanguage(); setIsMobileMenuOpen(false); }} className="text-[10px] font-black uppercase tracking-widest text-gray-600 flex items-center justify-center gap-2 mt-4">
                <Globe size={14} /> SWITCH TO {language === 'es' ? 'ENGLISH' : 'ESPAÑOL'}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

const Footer: React.FC = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-[#0c0a09] border-t border-mat-800 pt-32 pb-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          <div className="md:col-span-5 space-y-10">
            <Logo />
            <p className="text-gray-500 text-lg leading-relaxed max-w-sm italic font-light">
              "{t('footer.tagline')}"
            </p>
            <div className="flex gap-5">
              <a href="https://instagram.com/mat32_vlc" target="_blank" rel="noopener noreferrer" className="p-4 bg-mat-900 border border-mat-800 rounded-2xl text-gray-500 hover:text-mat-500 transition-all shadow-xl"><Instagram className="w-6 h-6" /></a>
              <a href="#" className="p-4 bg-mat-900 border border-mat-800 rounded-2xl text-gray-500 hover:text-mat-500 transition-all shadow-xl"><Music className="w-6 h-6" /></a>
            </div>
          </div>
          
          <div className="md:col-span-3 space-y-8">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.5em]">NAVIGATE</h4>
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-500 hover:text-mat-500 transition-colors text-[10px] font-black uppercase tracking-widest">{t('nav.home')}</Link>
              <Link to="/bar" className="text-gray-500 hover:text-mat-500 transition-colors text-[10px] font-black uppercase tracking-widest">{t('nav.bar')}</Link>
              <Link to="/events" className="text-gray-500 hover:text-mat-500 transition-colors text-[10px] font-black uppercase tracking-widest">{t('nav.events')}</Link>
              <Link to="/community" className="text-gray-500 hover:text-mat-500 transition-colors text-[10px] font-black uppercase tracking-widest">{t('nav.community')}</Link>
              <Link to="/records" className="text-gray-500 hover:text-mat-500 transition-colors text-[10px] font-black uppercase tracking-widest">{t('nav.records')}</Link>
              <Link to="/open-decks" className="text-gray-500 hover:text-mat-500 transition-colors text-[10px] font-black uppercase tracking-widest">{t('nav.open_decks')}</Link>
              <Link to="/contact" className="text-gray-500 hover:text-mat-500 transition-colors text-[10px] font-black uppercase tracking-widest">{t('nav.contact')}</Link>
            </nav>
          </div>

          <div className="md:col-span-4 space-y-8">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.5em]">LOCATION</h4>
            <div className="space-y-6">
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                Calle Matías Perelló, 32<br/>
                46005 Valencia, Spain
              </p>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-mat-800 flex flex-col md:flex-row justify-between items-center gap-10">
          <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest">© 2025 MAT32 | VALENCIA</p>
          <div className="flex gap-10 items-center">
            <Link to="/admin" className="text-gray-500 hover:text-mat-500 transition-all opacity-60 hover:opacity-100 flex items-center gap-2">
              <Settings className="w-4 h-4" /> <span className="text-[10px] font-black uppercase tracking-widest">SISTEMA CORE</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <FavoritesProvider>
        <CartProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-mat-900 text-gray-100 font-sans selection:bg-mat-500 selection:text-white">
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/bar" element={<Bar />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/event/:id" element={<EventDetail />} />
                  <Route path="/record/:id" element={<RecordDetail />} />
                  <Route path="/post/:id" element={<PostDetail />} />
                  <Route path="/alquiler-local-eventos-valencia" element={<PrivateEvents />} />
                  <Route path="/records" element={<Records />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/open-decks" element={<OpenDecks />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/legal/:type" element={<Legal />} />
                </Routes>
              </main>
              <Footer />
              <CartDrawer />
              <AIChat />
            </div>
          </Router>
        </CartProvider>
      </FavoritesProvider>
    </LanguageProvider>
  );
};

export default App;
