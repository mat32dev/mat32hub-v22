import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Menu, X, Disc, Globe } from 'lucide-react';

import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { RadioProvider } from './context/RadioContext';
import { CartDrawer } from './components/CartDrawer';
import { RadioBar } from './components/RadioBar';

import { Home } from './pages/Home';
import { Bar } from './pages/Bar';
import { Events } from './pages/Events';
import { Records } from './pages/Records';
import { Community } from './pages/Community';
import { OpenDecks } from './pages/OpenDecks';
import { Academy } from './pages/Academy';
import { About } from './pages/About';
import { Marketplace } from './pages/Marketplace';
import { Fondos } from './pages/Fondos';
import { SelectorsPage } from './pages/Selectors';
import { VerifyMember } from './pages/VerifyMember';
import { SobremesaProvider } from './components/SobremesaModal';
import { SobremesaOk, SobremesaCancel } from './pages/SobremesaPayment';
import { Contact } from './pages/Contact';
import { PrivateEvents } from './pages/PrivateEvents';
import { Checkout } from './pages/Checkout';
import { Legal } from './pages/Legal';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminEntityList } from './pages/admin/AdminEntityList';
import { AdminEntityForm } from './pages/admin/AdminEntityForm';
import { AdminInbox } from './pages/admin/AdminInbox';
import { AdminAllegretto } from './pages/admin/AdminAllegretto';
import { AdminInstagramPosts } from './pages/admin/AdminInstagramPosts';
import { AdminMenu } from './pages/admin/AdminMenu';
import { AdminSobremesa } from './pages/admin/AdminSobremesa';
import { AdminFood } from './pages/admin/AdminFood';
import { AdminPosCatalog } from './pages/admin/AdminPosCatalog';
import { AdminFondos } from './pages/admin/AdminFondos';
import { AdminSelectors } from './pages/admin/AdminSelectors';
import { AdminReferenceSelectors } from './pages/admin/AdminReferenceSelectors';
import { Proveedor } from './pages/Proveedor';
import { POS } from './pages/POS';
import { MemberPanel } from './pages/MemberPanel';
import { Wishlist } from './pages/Wishlist';
import { Gallery } from './pages/Gallery';

import { EventDetail } from './pages/EventDetail';
import { ArtistDetail } from './pages/ArtistDetail';
import { RecordDetail } from './pages/RecordDetail';
import { PostDetail } from './pages/PostDetail';
import { RadioPage } from './pages/Radio';

// Banner temporal de contratación — desactivar aquí cuando cierre la temporada
const HIRING_BANNER_ACTIVE = true;
const HIRING_BANNER_KEY = 'mat32_hiring_banner_dismissed_v1';

const HiringBanner: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => (
  <div className="fixed top-0 left-0 right-0 z-[105] h-10 bg-bermellon text-paper flex items-center hairline-b">
    <div className="container mx-auto px-5 md:px-8 flex items-center justify-between gap-3">
      <span className="mono-tag !text-[10px] sm:!text-[11px] !tracking-[0.12em] !normal-case truncate">
        TRABAJA CON NOSOTROS <span className="hidden sm:inline opacity-80">· Buscamos staff para la nueva temporada</span>
      </span>
      <div className="flex items-center gap-2 shrink-0">
        <a
          href="mailto:hola@mat32.com?subject=Candidatura%20%C2%B7%20Trabaja%20con%20nosotros&body=Hola%20MAT32%2C%0A%0AMe%20gustar%C3%ADa%20aplicar%20para%20la%20nueva%20temporada.%20Adjunto%20mi%20CV.%0A%0APuesto%20de%20inter%C3%A9s%3A%20%0ADisponibilidad%3A%20"
          className="mono-tag !text-[10px] !normal-case bg-paper text-bermellon px-2.5 py-1 hover:bg-ink hover:text-paper transition-colors whitespace-nowrap"
        >
          ENVÍA TU CV →
        </a>
        <button onClick={onDismiss} aria-label="Cerrar aviso" className="p-1 text-paper/80 hover:text-paper">
          <X size={14} />
        </button>
      </div>
    </div>
  </div>
);

const Navigation: React.FC<{ bannerVisible: boolean }> = ({ bannerVisible }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { t, language, toggleLanguage } = useLanguage();
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

  const navLinks: { name: string; path: string; children?: { name: string; path: string }[] }[] = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.events'), path: '/events' },
    { name: t('nav.open_decks'), path: '/open-decks' },
    { name: t('nav.records'), path: '/records' },
    { name: t('nav.about_us'), path: '/about' },
    { name: t('nav.contact'), path: '/contact' },
    { name: 'Alquiler de espacio', path: '/alquiler-local-eventos-horas-valencia' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* RESTYLE v2 — paper header, hairline, mono nav */}
      <header className={`fixed left-0 right-0 z-[100] h-14 sm:h-16 bg-paper hairline-b flex items-center transition-[top] ${bannerVisible ? 'top-10' : 'top-0'}`}>
        <div className="container mx-auto px-5 md:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-baseline gap-3 group shrink-0">
            <span className="wordmark text-ink text-xl sm:text-[24px]">MAT<sup style={{ fontSize: '0.55em', verticalAlign: 'super', top: '-0.55em' }}>32</sup></span>
          </Link>

          <nav className="hidden xl:flex items-center gap-7">
            {navLinks.map(l => {
              const active = isActive(l.path) || l.children?.some(c => isActive(c.path));
              return (
                <div key={l.path} className="relative group">
                  <Link to={l.path}
                    className={`mono-tag !tracking-[0.18em] !text-[12px] !normal-case py-1.5 transition-colors ${active ? 'text-bermellon' : 'text-ink hover:text-bermellon'}`}
                    style={{ fontFamily: '"DM Mono", monospace' }}>
                    {l.name}
                    {active && <span className="absolute bottom-0 left-0 w-full" style={{ borderBottom: '1.5px solid #c8462a' }}></span>}
                  </Link>
                  {l.children && (
                    <div className="absolute top-full left-0 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                      <div className="bg-paper hairline py-2 min-w-[200px]">
                        {l.children.map(c => (
                          <Link key={c.path} to={c.path}
                            className={`block px-4 py-2.5 mono-tag !text-[11px] whitespace-nowrap transition-colors ${isActive(c.path) ? 'text-bermellon' : 'text-ink hover:text-bermellon hover:bg-paper-2'}`}>
                            {c.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/alquiler-local-eventos-horas-valencia" className="hidden sm:inline-flex items-center mono-tag window-panel bg-paper text-ink px-3 py-2 hover:bg-teal hover:text-paper transition-colors">
              TU EVENTO AQUÍ →
            </Link>
            <button onClick={toggleLanguage} className="hidden sm:flex items-center gap-1.5 mono-tag !text-[10px] hairline px-3 py-1.5 text-ink-soft hover:text-bermellon transition-colors">
              <Globe size={12} /> {language === 'es' ? 'EN' : 'ES'}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="xl:hidden p-2 text-ink hairline">
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {isOpen && (
        <div className={`fixed left-0 right-0 z-[110] bg-paper hairline-b animate-fade-in xl:hidden ${bannerVisible ? 'top-[calc(2.5rem+3.5rem)] sm:top-[calc(2.5rem+4rem)]' : 'top-14 sm:top-16'}`}>
          <nav className="container mx-auto px-5 py-4 grid grid-cols-2 gap-x-4 gap-y-1">
            {navLinks.map((l, idx) => (
              <React.Fragment key={idx}>
                <Link to={l.path}
                  className={`py-2.5 px-3 mono-tag !text-[11px] transition-colors ${isActive(l.path) ? 'text-bermellon bg-paper-2' : 'text-ink hover:text-bermellon hover:bg-paper-2'}`}
                  onClick={() => setIsOpen(false)}>
                  {l.name}
                </Link>
                {l.children?.map((c, ci) => (
                  <Link key={`${idx}-${ci}`} to={c.path}
                    onClick={() => setIsOpen(false)}
                    className={`py-2 px-6 mono-tag !text-[10px] transition-colors ${isActive(c.path) ? 'text-bermellon' : 'text-ink-soft hover:text-bermellon'}`}>
                    · {c.name}
                  </Link>
                ))}
              </React.Fragment>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const isAdmin = location.pathname.startsWith('/admin');
  const isMember = location.pathname.startsWith('/member');
  const isVerify = location.pathname.startsWith('/verify/');
  const isProveedor = location.pathname.startsWith('/proveedor');
  const isPOS = location.pathname.startsWith('/pos');

  if (isVerify) {
    return (
      <Routes>
        <Route path="/verify/:token" element={<VerifyMember />} />
      </Routes>
    );
  }

  if (isProveedor) {
    return (
      <Routes>
        <Route path="/proveedor" element={<Proveedor />} />
      </Routes>
    );
  }

  if (isPOS) {
    return (
      <Routes>
        <Route path="/pos" element={<POS />} />
      </Routes>
    );
  }

  if (isMember) {
    return (
      <Routes>
        <Route path="/member/*" element={<MemberPanel />} />
      </Routes>
    );
  }

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="events" element={<AdminEntityList entity="events" />} />
          <Route path="events/new" element={<AdminEntityForm entity="events" />} />
          <Route path="events/:id" element={<AdminEntityForm entity="events" />} />
          <Route path="agenda" element={<AdminEntityList entity="external_events" />} />
          <Route path="agenda/new" element={<AdminEntityForm entity="external_events" />} />
          <Route path="agenda/:id" element={<AdminEntityForm entity="external_events" />} />
          <Route path="records" element={<AdminEntityList entity="records" />} />
          <Route path="records/new" element={<AdminEntityForm entity="records" />} />
          <Route path="records/:id" element={<AdminEntityForm entity="records" />} />
          <Route path="merch" element={<AdminEntityList entity="merch" />} />
          <Route path="merch/new" element={<AdminEntityForm entity="merch" />} />
          <Route path="merch/:id" element={<AdminEntityForm entity="merch" />} />
          <Route path="posts" element={<AdminEntityList entity="posts" />} />
          <Route path="posts/new" element={<AdminEntityForm entity="posts" />} />
          <Route path="posts/:id" element={<AdminEntityForm entity="posts" />} />
          <Route path="sales" element={<AdminEntityList entity="sales" />} />
          <Route path="menu" element={<AdminMenu />} />
          <Route path="sobremesa" element={<AdminSobremesa />} />
          <Route path="food" element={<AdminFood />} />
          <Route path="pos-catalog" element={<AdminPosCatalog />} />
          <Route path="fondos" element={<AdminFondos />} />
          <Route path="selectors-ref" element={<AdminReferenceSelectors />} />
          <Route path="allegretto" element={<AdminAllegretto />} />
          <Route path="inbox" element={<AdminInbox />} />
          <Route path="selectors" element={<AdminSelectors />} />
          <Route path="instagram-posts" element={<AdminInstagramPosts />} />
          <Route path="members" element={<AdminEntityList entity="members" />} />
          <Route path="members/new" element={<AdminEntityForm entity="members" />} />
          <Route path="members/:id" element={<AdminEntityForm entity="members" />} />
        </Route>
      </Routes>
    );
  }

  const [bannerVisible, setBannerVisible] = React.useState(() => {
    if (!HIRING_BANNER_ACTIVE) return false;
    try { return sessionStorage.getItem(HIRING_BANNER_KEY) !== '1'; } catch { return true; }
  });
  const dismissBanner = () => {
    setBannerVisible(false);
    try { sessionStorage.setItem(HIRING_BANNER_KEY, '1'); } catch {}
  };

  return (
    <div className={`flex flex-col min-h-screen bg-paper text-ink font-sans pb-14 ${bannerVisible ? 'pt-[calc(3.5rem+28px+2.5rem)] sm:pt-[calc(4rem+28px+2.5rem)]' : 'pt-[calc(3.5rem+28px)] sm:pt-[calc(4rem+28px)]'}`}>
      {bannerVisible && <HiringBanner onDismiss={dismissBanner} />}
      <Navigation bannerVisible={bannerVisible} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mat32-bar" element={<Bar />} />
          <Route path="/mat32-bar/" element={<Bar />} />
          <Route path="/bar" element={<Navigate to="/mat32-bar/" replace />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/records" element={<Records />} />
          <Route path="/records/:id" element={<RecordDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/community" element={<Community />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/agenda" element={<Navigate to="/community?tab=whats-on" replace />} />
          <Route path="/fondos-reservados" element={<Fondos />} />
          <Route path="/selectors" element={<SelectorsPage />} />
          <Route path="/artista/:slug" element={<ArtistDetail />} />
          <Route path="/reference-points" element={<Navigate to="/selectors" replace />} />
          <Route path="/fondos" element={<Navigate to="/fondos-reservados" replace />} />
          <Route path="/fulfillment-discos" element={<Navigate to="/marketplace" replace />} />
          <Route path="/envio-discos" element={<Navigate to="/marketplace" replace />} />
          <Route path="/community/:id" element={<PostDetail />} />
          <Route path="/open-decks" element={<OpenDecks />} />
          <Route path="/academy" element={<Academy />} />
          <Route path="/nosotros" element={<About />} />
          <Route path="/about" element={<Navigate to="/nosotros" replace />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/alquiler-local-eventos-horas-valencia" element={<PrivateEvents />} />
          <Route path="/sobremesa-ok" element={<SobremesaOk />} />
          <Route path="/sobremesa-cancel" element={<SobremesaCancel />} />
          <Route path="/alquiler-local-eventos-valencia" element={<Navigate to="/alquiler-local-eventos-horas-valencia" replace />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/radio" element={<RadioPage />} />
          <Route path="/legal/:type" element={<Legal />} />
        </Routes>
      </main>
      <CartDrawer />
      <RadioBar />
      <footer className="bg-ink text-paper">
        <div className="container mx-auto px-6 md:px-10 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 items-start">
          <div>
            <span className="wordmark text-paper text-2xl">MAT<sup style={{ fontSize: '0.55em', verticalAlign: 'super', top: '-0.55em' }}>32</sup></span>
            <p className="serif-italic text-paper/70 mt-3 max-w-xs leading-snug">{t('footer.tagline')}</p>
          </div>
          <div className="space-y-2 mono-tag !text-[10px] !tracking-[0.25em]">
            <div className="text-paper/60">EL LOCAL</div>
            <div>MATÍAS PERELLÓ 32 · RUZAFA</div>
            <div>46005 VALENCIA</div>
            <div>JUE–SÁB · 19:30–02:00</div>
          </div>
          <div className="space-y-2 mono-tag !text-[10px] !tracking-[0.25em]">
            <div className="text-paper/60">CONTACTO</div>
            <div>+34 622 19 08 02</div>
            <div>HOLA@MAT32.COM</div>
            <a href="https://www.instagram.com/mat32valencia" target="_blank" rel="noopener" className="block hover:text-bermellon transition-colors" style={{ color: '#c8462a' }}>@MAT32VALENCIA</a>
          </div>
          <div className="space-y-2 mono-tag !text-[10px] !tracking-[0.25em]">
            <div className="text-paper/60">EXPLORA</div>
            <Link to="/events" className="block hover:text-bermellon transition-colors">AGENDA</Link>
            <Link to="/records" className="block hover:text-bermellon transition-colors">DISCOS</Link>
            <Link to="/open-decks" className="block hover:text-bermellon transition-colors">OPEN DECKS</Link>
            <Link to="/legal/aviso-legal" className="block hover:text-bermellon transition-colors">AVISO LEGAL</Link>
            <Link to="/legal/privacidad" className="block hover:text-bermellon transition-colors">PRIVACIDAD</Link>
          </div>
        </div>
        <div className="hairline-ink-t">
          <div className="container mx-auto px-6 md:px-10 py-4 flex flex-wrap justify-between items-center gap-3 mono-tag !text-[10px] text-paper/50">
            <span>© 2026 RARETRAXXX BEAT S.L. · CIF B22628846</span>
            <Link to="/admin" className="hover:text-bermellon transition-colors">ADMIN</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <WishlistProvider>
        <CartProvider>
          <RadioProvider>
            <Router>
              <SobremesaProvider>
                <AppRoutes />
              </SobremesaProvider>
            </Router>
          </RadioProvider>
        </CartProvider>
      </WishlistProvider>
    </LanguageProvider>
  );
};

export default App;
