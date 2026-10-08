import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Loader2, Instagram, Music, Globe, Disc, ChevronLeft, Calendar, Clock, ExternalLink, Sparkles, Users } from 'lucide-react';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';

// Artista mostrado en /artista/:slug
// Se resuelve desde /selectors (entidad de selectors) por slug/nombre,
// y engancha sus próximas sesiones desde /events.

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
  tier: string;
}

interface Evento {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  cover_url?: string;
  imageUrl?: string;
}

function slugify(s: string): string {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export const slugFor = slugify;

export const ArtistDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [artist, setArtist] = useState<Selector | null>(null);
  const [upcoming, setUpcoming] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const selectors = await dataService.getReferenceSelectorsPublic();
        const found = selectors.find((s: any) =>
          slugify(s.name) === slug || slugify(s.id) === slug || (s.handle && slugify(s.handle) === slug)
        );
        setArtist(found || null);
        if (found) {
          try {
            const events = await dataService.getEvents();
            const ups = events
              .filter((e) => {
                const haystack = `${e.title} ${(e.vibe || []).join(' ')} ${(e.tags || []).join(' ')}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                const name = found.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                return haystack.includes(name) || (e.lineup || []).some((l) => slugify(l.name) === slug);
              })
              .sort((a, b) => a.date.localeCompare(b.date))
              .filter((e) => e.date >= new Date().toISOString().slice(0, 10))
              .slice(0, 8);
            setUpcoming(ups);
          } catch {}
        }
      } catch {}
      setLoading(false);
    })();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-paper text-ink flex items-center justify-center">
      <Loader2 className="animate-spin w-10 h-10" style={{ color: '#c8462a' }} />
    </div>
  );

  if (!artist) return (
    <div className="min-h-screen bg-paper text-ink text-center py-40">
      <SEO titleKey="Artista no encontrado · MAT32 Valencia" descriptionKey="Selector no encontrado." />
      <h2 className="display text-4xl mb-3">Artista no encontrado.</h2>
      <p className="serif-italic text-ink-soft text-lg mb-6">Este selector no está en nuestro directorio.</p>
      <Link to="/selectors" className="mono-tag hairline px-5 py-3 hover:bg-ink hover:text-paper transition-colors">VER SELECTORS →</Link>
    </div>
  );

  const links: Array<{ href: string; icon: React.ReactNode; label: string }> = [];
  if (artist.instagram_url) links.push({ href: artist.instagram_url, icon: <Instagram size={13} />, label: 'Instagram' });
  if (artist.mixcloud_url) links.push({ href: artist.mixcloud_url, icon: <Music size={13} />, label: 'Mixcloud' });
  if (artist.soundcloud_url) links.push({ href: artist.soundcloud_url, icon: <Music size={13} />, label: 'SoundCloud' });
  if (artist.discogs_url) links.push({ href: artist.discogs_url, icon: <Disc size={13} />, label: 'Discogs' });
  if (artist.web_url) links.push({ href: artist.web_url, icon: <Globe size={13} />, label: 'Web' });

  const seoDesc = `${artist.name} — ${artist.role || 'selector'}. ${artist.bio || `Artista y selector en MAT32 · Ruzafa, Valencia.`}`;

  return (
    <div className="min-h-screen bg-paper text-ink pb-24">
      <SEO titleKey={`${artist.name} · Selector en MAT32 · Valencia`} descriptionKey={seoDesc} image={artist.image_url || ''} />

      {/* HERO */}
      <div className="relative h-[62vh] md:h-[72vh] overflow-hidden bg-ink hairline-b">
        {artist.image_url ? (
          <img src={artist.image_url} alt={artist.name} className="w-full h-full object-cover opacity-75" />
        ) : (
          <div className="absolute inset-0 bg-ink flex items-center justify-center">
            <span className="display text-paper" style={{ fontSize: 'clamp(90px, 20vw, 260px)' }}>{artist.name.slice(0, 1).toUpperCase()}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        <div className="absolute bottom-10 left-0 w-full">
          <div className="container mx-auto px-6 md:px-10">
            <Link to="/selectors" className="mono-tag inline-flex items-center gap-2 mb-6 text-paper hover:text-bermellon transition-colors group">
              <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> SELECTORS
            </Link>
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="bg-bermellon text-paper px-3 py-1.5 mono-tag flex items-center gap-2">
                <Sparkles size={12} /> {(artist.role || 'SELECTOR').toUpperCase()}
              </div>
              {artist.country && (
                <div className="bg-paper text-ink px-3 py-1.5 mono-tag flex items-center gap-2">
                  <Globe size={12} /> {artist.country.toUpperCase()}
                </div>
              )}
            </div>
            <h1 className="display text-paper" style={{ fontSize: 'clamp(48px, 9vw, 132px)', lineHeight: 0.85 }}>{artist.name}</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-10 py-16">
        <div className="grid lg:grid-cols-12 gap-10 md:gap-14">
          <div className="lg:col-span-8 space-y-10">
            {artist.bio && (
              <section className="hairline p-7 md:p-10 bg-paper-2 grain">
                <h2 className="mono-tag flex items-center gap-2 mb-6" style={{ color: '#c8462a' }}>
                  <Disc size={12} className="animate-spin-slow" /> BIO
                </h2>
                <p className="serif-italic text-xl md:text-2xl text-ink leading-snug">{artist.bio}</p>
                {artist.handle && <p className="mono-tag mt-6 text-ink-soft">{artist.handle}</p>}
              </section>
            )}

            {artist.tags && artist.tags.length > 0 && (
              <section className="hairline p-7 bg-paper">
                <h3 className="mono-tag mb-4" style={{ color: '#c8462a' }}>SONIDO</h3>
                <div className="flex flex-wrap gap-2">
                  {artist.tags.map((t, i) => (
                    <span key={i} className="mono-tag bg-paper-2 px-3 py-1.5 hairline text-ink">{t.toUpperCase()}</span>
                  ))}
                </div>
              </section>
            )}

            {upcoming.length > 0 && (
              <section>
                <h3 className="display text-3xl md:text-4xl hairline-b pb-3 mb-6">Próximas sesiones.</h3>
                <div className="space-y-2">
                  {upcoming.map((ev) => {
                    const d = new Date(ev.date + 'T00:00:00');
                    const dia = String(d.getDate()).padStart(2, '0');
                    const mes = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'][d.getMonth()];
                    return (
                      <button key={ev.id} onClick={() => navigate(`/events/${ev.id}`)}
                        className="w-full hairline p-5 flex items-center gap-4 group hover:bg-ink hover:text-paper transition-colors text-left">
                        <div className="mono-tag bg-bermellon text-paper px-3 py-1.5 flex items-center gap-1.5 mr-2">
                          <Calendar size={12} /> {dia} {mes}
                        </div>
                        <div className="flex-1">
                          <div className="display text-xl">{ev.title}</div>
                          <div className="mono-tag text-ink-soft mt-1 flex items-center gap-2"><Clock size={12} /> {ev.time}</div>
                        </div>
                        <span className="mono-tag text-bermellon group-hover:text-paper">VER →</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          <aside className="lg:col-span-4 space-y-3">
            <div className="hairline p-7 bg-paper-2">
              <h3 className="mono-tag flex items-center gap-2 mb-5" style={{ color: '#c8462a' }}>
                <Users size={12} /> CONECTA
              </h3>
              {links.length === 0 && <p className="serif-italic text-ink-soft leading-snug">Este selector aún no ha compartido sus enlaces. Síguelo en la próxima sesión en MAT32.</p>}
              {links.length > 0 && (
                <div className="space-y-3">
                  {links.map((l, i) => (
                    <a key={i} href={l.href} target="_blank" rel="noopener"
                      className="w-full flex items-center justify-between hairline p-4 bg-paper hover:bg-ink hover:text-paper transition-colors group">
                      <span className="flex items-center gap-3 mono-tag"><span className="text-bermellon">{l.icon}</span> {l.label}</span>
                      <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  ))}
                </div>
              )}
            </div>
            <Link to="/open-decks" className="mono-tag hairline w-full block py-4 text-center hover:bg-ink hover:text-paper transition-colors">
              ¿ERES SELECTOR? ÚNETE AL OPEN DECKS →
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
};