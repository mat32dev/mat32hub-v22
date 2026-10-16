import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Instagram, Globe, Disc, Music, ChevronLeft, Sparkles } from 'lucide-react';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { slugFor } from './ArtistDetail';

interface Selector {
  id: string;
  name: string;
  handle: string | null;
  role: string | null;
  bio: string | null;
  image_url: string | null;
  country: string | null;
  instagram_url: string | null;
  mixcloud_url: string | null;
  soundcloud_url: string | null;
  discogs_url: string | null;
  web_url: string | null;
  tags: string[];
  featured: boolean;
  tier: 'principal' | 'cercano' | 'supporter';
}

const TIER_META: Record<string, { label: string; sublabel: string; eyebrow: string }> = {
  principal: { label: 'Destacados', sublabel: 'Referentes mayores que han dado forma a nuestra escucha.', eyebrow: '★ PRINCIPALES' },
  cercano:   { label: 'Cercanos',  sublabel: 'Selectors con los que cruzamos cabina y conversaciones.',   eyebrow: '◌ AMIGOS / RED' },
  supporter: { label: 'MAT32 Supporters & Local Talent', sublabel: 'Gente que pasa por el local. Caras nuevas que aportan.', eyebrow: '+ NUEVA HORNADA' },
};

export const SelectorsPage: React.FC = () => {
  const [items, setItems] = useState<Selector[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { setItems(await dataService.getReferenceSelectorsPublic()); } catch {}
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink text-mat-cream pb-24">
      <SEO
        titleKey="Reference Points · Selectors que nos influencian · MAT32 Valencia"
        descriptionKey="Colectivos, selectors, productores y amigos que construyen la identidad sonora de MAT32 y Raretraxxx. Puntos de referencia y conexiones del ecosistema musical underground."
      />

      {/* HERO */}
      <section className="relative pt-28 md:pt-32 pb-14 border-b border-mat-800 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(234,88,12,0.2),_transparent_60%)] pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10 max-w-5xl">
          <Link to="/nosotros" className="inline-flex items-center gap-1.5 mb-6 text-[10px] font-black text-gray-500 hover:text-mat-500 uppercase tracking-[0.3em]">
            <ChevronLeft size={12} /> Volver a nosotros
          </Link>
          <div className="inline-flex items-center gap-2 mb-6 text-mat-500 font-black uppercase text-[10px] tracking-[0.5em]">
            <Sparkles size={12} /> + REFERENCE POINTS
          </div>
          <h1 className="text-[13vw] sm:text-[9vw] md:text-[8rem] font-black uppercase tracking-tighter text-white font-exo leading-[0.85] mb-4">
            Selectors.
          </h1>
          <p className="text-gray-300 max-w-3xl text-lg md:text-xl font-light leading-relaxed">
            Artistas, colectivos y amigos que nos han influenciado. Los puntos de referencia con los que construimos el sonido de MAT32.
          </p>
        </div>
      </section>

      {/* GRIDS por tier */}
      <section className="container mx-auto px-6 py-14 max-w-6xl space-y-20">
        {loading ? (
          <div className="py-20 text-center"><Loader2 className="animate-spin text-mat-500 w-8 h-8 mx-auto" /></div>
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (['principal', 'cercano', 'supporter'] as const).map(tier => {
          const tierItems = items.filter(s => s.tier === tier);
          if (!tierItems.length) return null;
          const meta = TIER_META[tier];
          return (
            <div key={tier}>
              <div className="mb-8 flex items-baseline justify-between gap-4 flex-wrap">
                <div>
                  <div className="inline-flex items-center gap-2 mb-2 text-mat-500 font-black uppercase text-[10px] tracking-[0.5em]">
                    {meta.eyebrow}
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter font-exo leading-none">
                    {meta.label}
                  </h2>
                  <p className="text-gray-500 text-sm mt-2 max-w-xl">{meta.sublabel}</p>
                </div>
                <span className="text-[10px] font-mono text-gray-600 tracking-widest">{tierItems.length} {tierItems.length === 1 ? 'persona' : 'personas'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tierItems.map(s => <Card key={s.id} s={s} />)}
              </div>
            </div>
          );
        })}
      </section>

    </div>
  );
};

const Card: React.FC<{ s: Selector }> = ({ s }) => {
  const links: Array<{ href: string; icon: React.ReactNode; label: string }> = [];
  if (s.instagram_url) links.push({ href: s.instagram_url, icon: <Instagram size={12} />, label: 'Instagram' });
  if (s.mixcloud_url) links.push({ href: s.mixcloud_url, icon: <Music size={12} />, label: 'Mixcloud' });
  if (s.soundcloud_url) links.push({ href: s.soundcloud_url, icon: <Music size={12} />, label: 'SoundCloud' });
  if (s.discogs_url) links.push({ href: s.discogs_url, icon: <Disc size={12} />, label: 'Discogs' });
  if (s.web_url) links.push({ href: s.web_url, icon: <Globe size={12} />, label: 'Web' });

  return (
    <Link to={`/artista/${slugFor(s.name)}`}
      className={`group relative bg-mat-950 border rounded-3xl overflow-hidden transition-all hover:border-mat-500/50 ${s.featured ? 'border-mat-500/30' : 'border-mat-800'} block`}>
      <div className="relative aspect-[4/5] bg-mat-800 overflow-hidden">
        {s.image_url ? (
          <img src={s.image_url} alt={s.name} loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            style={{ filter: 'grayscale(80%) contrast(1.05)' }} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-black text-mat-800 font-exo">{s.name.slice(0, 2).toUpperCase()}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
        {s.featured && (
          <span className="absolute top-3 right-3 text-[9px] font-black uppercase tracking-widest text-black bg-mat-500 px-2 py-1 rounded-full">★ Referente</span>
        )}
        <div className="absolute bottom-3 left-4 right-4">
          {s.role && <div className="text-[9px] font-black text-mat-500 uppercase tracking-[0.3em] mb-1">{s.role}</div>}
          <div className="text-2xl font-black text-white uppercase tracking-tight font-exo leading-none">{s.name}</div>
          {s.handle && <div className="text-[11px] text-gray-400 mt-1">{s.handle}</div>}
          <div className="mt-2 text-[9px] font-black text-mat-500 uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity">VER PERFIL →</div>
        </div>
      </div>

      {(s.bio || s.tags?.length || links.length) && (
        <div className="p-4 space-y-3">
          {s.bio && <p className="text-[13px] text-gray-400 leading-relaxed line-clamp-3">{s.bio}</p>}
          {!!s.tags?.length && (
            <div className="flex flex-wrap gap-1">
              {s.tags.map((tag, i) => (
                <span key={i} className="text-[9px] font-black text-gray-500 uppercase tracking-widest border border-mat-800 rounded-full px-2 py-0.5">{tag}</span>
              ))}
            </div>
          )}
          {!!links.length && (
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-mat-800">
              {links.map((l, i) => (
                <a key={i} href={l.href} target="_blank" rel="noopener"
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-mat-900 hover:bg-mat-800 border border-mat-800 hover:border-mat-500/50 rounded-lg text-[10px] font-black text-gray-400 hover:text-mat-500 uppercase tracking-widest">
                  {l.icon} {l.label}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </Link>
  );
};

const EmptyState: React.FC = () => (
  <div className="py-20 text-center text-gray-500">
    <Sparkles className="w-12 h-12 mx-auto opacity-20 mb-4" />
    <p className="text-lg font-bold mb-2">Pronto publicaremos los primeros referentes</p>
    <p className="text-sm">Artistas, selectors y colectivos que han influenciado MAT32.</p>
    <a href="https://www.instagram.com/allegretto_radio/" target="_blank" rel="noopener"
      className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-mat-800 border border-mat-700 hover:border-mat-500 text-white text-xs font-black uppercase tracking-[0.3em] rounded-full">
      <Instagram size={14} /> Mientras tanto, síguenos
    </a>
  </div>
);
