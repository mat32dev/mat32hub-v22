
import React, { useState, useEffect, useMemo } from 'react';
import { X, Maximize2 } from 'lucide-react';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { GalleryItem } from '../types';
import { CachedImage } from '../components/CachedImage';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const VENUE_PHOTOS = [
  { id: 'v1', imageUrl: 'https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/ac1a7472-de26-46de-37f3-7ec5509f5900/public', title: 'Main Room', category: 'space', tags: ['main room', 'full space', 'events'] },
  { id: 'v2', imageUrl: 'https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/7af028d2-be2a-44ae-a2bd-d2e05db8ac00/w=800', title: 'Analog Corner', category: 'vibe', tags: ['analog', 'hi-fi', 'vibe'] },
  { id: 'v3', imageUrl: 'https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/53d83bbb-47b5-45ce-4f69-00fdc063fd00/w=800', title: 'Vinyl Archive', category: 'shop', tags: ['vinyl', 'records', 'store'] },
  { id: 'v4', imageUrl: 'https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/f66760c8-cc6c-457a-dc23-5edbe31a2200/w=800', title: 'Mirror Ball', category: 'vibe', tags: ['atmosphere', 'dancefloor', 'night'] },
  { id: 'v5', imageUrl: 'https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/cd431032-310e-4ccc-c602-68787da5ae00/w=800', title: 'Lounge Zone', category: 'space', tags: ['lounge', 'sofas', 'chill'] },
  { id: 'v6', imageUrl: 'https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/36b8814e-df61-468c-614a-788a5fbfa700/w=800', title: 'Listening Room', category: 'space', tags: ['listening room', 'altec', 'hi-fi'] },
  { id: 'v7', imageUrl: 'https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/496db3dc-f7c7-4d22-d05a-ac0198681c00/w=800', title: 'DJ Booth', category: 'booth', tags: ['booth', 'technics', 'vinyl'] },
];

const CAT_KEYS = [
  { key: 'all',   label: 'gallery.cat.all' },
  { key: 'space', label: 'gallery.cat.space' },
  { key: 'vibe',  label: 'gallery.cat.vibe' },
  { key: 'booth', label: 'gallery.cat.booth' },
  { key: 'shop',  label: 'gallery.cat.shop' },
];

type PhotoItem = { id: string; imageUrl: string; title: string; category: string; tags: string[]; description?: string };

export const Gallery: React.FC = () => {
  const { t } = useLanguage();
  const [dbImages, setDbImages] = useState<GalleryItem[]>([]);
  const [selectedCat, setSelectedCat] = useState('all');
  const [lightbox, setLightbox] = useState<PhotoItem | null>(null);

  useEffect(() => {
    dataService.getLocalGallery().then(setDbImages).catch(() => {});
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const allPhotos: PhotoItem[] = useMemo(() => {
    const db: PhotoItem[] = dbImages.map(i => ({ id: i.id, imageUrl: i.imageUrl, title: i.title, category: i.category, tags: i.tags, description: i.description }));
    const venueIds = new Set(VENUE_PHOTOS.map(v => v.imageUrl));
    const extraDb = db.filter(i => !venueIds.has(i.imageUrl));
    return [...VENUE_PHOTOS, ...extraDb];
  }, [dbImages]);

  const filtered = useMemo(() =>
    selectedCat === 'all' ? allPhotos : allPhotos.filter(p => p.category === selectedCat),
    [allPhotos, selectedCat]
  );

  const lightboxIdx = lightbox ? filtered.findIndex(p => p.id === lightbox.id) : -1;
  const goPrev = () => lightboxIdx > 0 && setLightbox(filtered[lightboxIdx - 1]);
  const goNext = () => lightboxIdx < filtered.length - 1 && setLightbox(filtered[lightboxIdx + 1]);

  return (
    <div className="min-h-screen bg-paper text-ink pb-24">
      <SEO
        titleKey="Fotos del espacio · MAT32 Ruzafa · Bar Hi-Fi & Sala Eventos Valencia"
        descriptionKey="Interior de MAT32 Valencia: sala Hi-Fi con Altec A7, dancefloor, zona lounge, cabina vinyl Technics 1210 y almacén de discos de segunda mano. Espacio para eventos en Ruzafa."
      />

      {/* Hero texto */}
      <section className="container mx-auto px-6 md:px-10 pt-12 pb-10 hairline-b">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="mono-tag" style={{ color: '#c8462a' }}>{t('gallery.hero.tag')}</div>
            <h1 className="display mt-3" style={{ fontSize: 'clamp(42px, 7vw, 96px)', lineHeight: 0.88 }}>
              {t('gallery.hero.h1_pre')}<br /><span style={{ color: '#c8462a' }}>{t('gallery.hero.h1_color')}</span>
            </h1>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Link to="/alquiler-local-eventos-horas-valencia" className="bg-bermellon text-paper px-5 py-3 mono-tag hover:bg-ink transition-colors">
              {t('gallery.hero.cta')}
            </Link>
            <Link to="/open-decks" className="hairline px-5 py-3 mono-tag hover:bg-ink hover:text-paper transition-colors">
              OPEN DECKS
            </Link>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 hairline-t mt-8 divide-x divide-ink/10">
          {[
            ['100 PAX', t('gallery.stats.capacity')],
            ['Altec A7', 'Sistema P.A.'],
            ['2× Technics 1210', 'Turntables'],
            ['Ruzafa · VLC', t('gallery.stats.location')],
          ].map(([val, label]) => (
            <div key={label} className="px-4 pt-6 pb-2">
              <div className="display text-xl text-ink">{val}</div>
              <div className="mono-tag text-ink/40 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Filtros */}
      <section className="container mx-auto px-6 md:px-10 py-6 hairline-b">
        <div className="flex flex-wrap gap-2">
          {CAT_KEYS.map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCat(cat.key)}
              className={`mono-tag px-4 py-2 transition-colors ${selectedCat === cat.key ? 'bg-ink text-paper' : 'hairline text-ink/60 hover:text-ink hover:border-ink'}`}
            >
              {t(cat.label).toUpperCase()}
            </button>
          ))}
          <span className="mono-tag text-ink/30 ml-auto self-center">{filtered.length} {t('gallery.photos')}</span>
        </div>
      </section>

      {/* Grid */}
      <section className="container mx-auto px-6 md:px-10 py-10">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 space-y-3">
          {filtered.map((photo, idx) => (
            <div
              key={photo.id}
              className="relative group break-inside-avoid hairline overflow-hidden cursor-zoom-in"
              onClick={() => setLightbox(photo)}
            >
              <CachedImage
                src={photo.imageUrl}
                alt={`${photo.title} — MAT32 Valencia · Bar Hi-Fi Ruzafa`}
                aspectRatio={idx === 0 ? 'aspect-video' : 'aspect-auto'}
                className="w-full transition-all duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/40 transition-colors flex items-end p-4">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="mono-tag text-paper text-[10px]">{photo.title}</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {photo.tags.map(tag => <span key={tag} className="mono-tag text-paper/60 text-[9px]">#{tag}</span>)}
                  </div>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 size={16} className="text-paper" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink text-paper hairline-t mt-10">
        <div className="container mx-auto px-6 md:px-10 py-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="display text-3xl md:text-4xl leading-tight">{t('gallery.cta.h2')}</h2>
            <p className="serif-italic text-paper/60 mt-3 leading-snug">{t('gallery.cta.desc')}</p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link to="/alquiler-local-eventos-horas-valencia" className="bg-bermellon text-paper px-6 py-4 mono-tag hover:bg-paper hover:text-ink transition-colors">
              {t('gallery.cta.button')}
            </Link>
            <a href="https://wa.me/34622190802" target="_blank" rel="noopener" className="hairline-ink px-6 py-4 mono-tag text-paper hover:bg-paper hover:text-ink transition-colors">
              WHATSAPP
            </a>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] bg-ink/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-5 right-5 text-paper/60 hover:text-paper transition-colors z-10">
            <X size={28} />
          </button>
          {lightboxIdx > 0 && (
            <button onClick={e => { e.stopPropagation(); goPrev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-paper/40 hover:text-paper transition-colors text-4xl font-light z-10">‹</button>
          )}
          {lightboxIdx < filtered.length - 1 && (
            <button onClick={e => { e.stopPropagation(); goNext(); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-paper/40 hover:text-paper transition-colors text-4xl font-light z-10">›</button>
          )}
          <div className="max-w-5xl w-full max-h-[90vh] flex flex-col items-center gap-4" onClick={e => e.stopPropagation()}>
            <img
              src={lightbox.imageUrl}
              alt={`${lightbox.title} — MAT32 Valencia`}
              className="max-h-[80vh] object-contain"
            />
            <div className="text-center">
              <div className="display text-paper text-xl">{lightbox.title}</div>
              <div className="mono-tag text-paper/40 mt-1">{lightboxIdx + 1} / {filtered.length}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
