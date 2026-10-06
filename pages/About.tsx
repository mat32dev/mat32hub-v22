import React, { useEffect, useState } from 'react';
import { Disc, MapPin } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';

const VIDEO_LONG = { id: 'Gdw6VmMVJok', start: 646 };
const VIDEO_SHORT = { id: 'wkEQNfchTcE' };

export const About: React.FC = () => {
  const { t } = useLanguage();

  useEffect(() => {
    document.body.classList.add('theme-paper');
    return () => { document.body.classList.remove('theme-paper'); };
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink pb-24 grain">
      <SEO
        titleKey="Nosotros · MAT32 · Raretraxxx Valencia"
        descriptionKey="MAT32: bar hi-fi, almacén de discos y colectivo Raretraxxx en Valencia. Documental, reportaje en À Punt y manifesto."
      />

      {/* HERO */}
      <section className="container mx-auto px-6 md:px-10 pt-12 md:pt-16 pb-10 hairline-b">
        <div className="mono-tag flex items-center gap-2" style={{ color: '#c8462a' }}>
          <Disc size={12} /> RARETRAXXX · RUZAFA
        </div>
        <h1 className="display mt-3" style={{ fontSize: 'clamp(54px, 9vw, 132px)', lineHeight: 0.85 }}>
          {t('about.hero.h1_pre')}<span style={{ color: '#c8462a' }}>{t('about.hero.h1_color')}</span>
        </h1>
        <p className="serif-italic text-2xl text-ink-soft mt-5 max-w-3xl leading-snug hairline-l pl-6">
          {t('about.hero.desc').split('Raretraxxx').map((part, i, arr) =>
            i < arr.length - 1
              ? <React.Fragment key={i}>{part}<b className="text-ink not-italic">Raretraxxx</b></React.Fragment>
              : part
          )}
        </p>
      </section>

      {/* DOCUMENTAL + REPORTAJES */}
      <section className="container mx-auto px-6 md:px-10 py-14 md:py-20 hairline-b max-w-6xl space-y-14 md:space-y-20">
        <figure>
          <VideoDuotone video={VIDEO_LONG} />
          <figcaption className="mt-4 serif-italic text-ink-soft text-base leading-snug max-w-3xl">
            {t('about.documentary')} <b className="text-ink not-italic">RARETRAXXX</b> {t('about.by')} <b className="text-ink not-italic">Andrónico</b>.
          </figcaption>
        </figure>

        <figure>
          <div className="hairline overflow-hidden bg-paper-2">
            <div className="grid md:grid-cols-[1.4fr_1fr] gap-0">
              <div className="relative aspect-video md:aspect-auto overflow-hidden bg-ink hairline-r">
                <img
                  src="https://static.apuntmedia.es/clip/580a9cc1-c19a-49b4-81e3-217158b76024_facebook-aspect-ratio_default_0.jpg"
                  alt="Territori Sonor — À Punt Media"
                  loading="lazy"
                  className="w-full h-full object-cover grayscale contrast-[1.1] brightness-[0.9]"
                />
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(200, 70, 42, 0.35)', mixBlendMode: 'multiply' }} />
                <div className="absolute top-3 left-3 bg-paper text-ink mono-tag !text-[10px] px-2 py-1">À PUNT MEDIA</div>
                <div className="absolute bottom-3 right-3 bg-ink text-paper mono-tag !text-[10px] px-2 py-1">21:40</div>
              </div>
              <div className="p-5 md:p-7 flex flex-col justify-center gap-4">
                <audio controls preload="none" className="w-full" src="/audio/jardi-electronic-mat32.mp3">
                  {t('about.audio.fallback')}
                </audio>
                <a href="https://www.apuntmedia.es/programes/territori-sonor/complets/20-09-2024-neus-ferri-l-algoritme-sonor-xala-muses-jardi-electronic_135_1732336.html"
                   target="_blank" rel="noopener noreferrer"
                   className="mono-tag hover:text-ink transition-colors" style={{ color: '#c8462a' }}>
                  {t('about.apunt.link')}
                </a>
              </div>
            </div>
          </div>
          <figcaption className="mt-4 serif-italic text-ink-soft text-base leading-snug max-w-3xl">
            {t('about.report')} <b className="text-ink not-italic">Territori Sonor</b> {t('about.report_about')} <b className="text-ink not-italic">Ferran Toledo</b>, À Punt Media.
          </figcaption>
        </figure>

        <figure className="max-w-3xl mx-auto">
          <VideoDuotone video={VIDEO_SHORT} />
          <figcaption className="mt-4 serif-italic text-ink-soft text-base leading-snug">
            {t('about.session_caption')} <b className="text-ink not-italic">Facil Graphics</b>.
          </figcaption>
        </figure>
      </section>

      {/* BOOKING */}
      <section className="container mx-auto px-6 md:px-10 py-16 md:py-20 hairline-b max-w-3xl">
        <div className="hairline p-8 md:p-10 bg-paper-2">
          <div className="mono-tag" style={{ color: '#c8462a' }}>BOOKING</div>
          <h2 className="display mt-2 text-3xl md:text-4xl">
            Raretraxxx <span style={{ color: '#c8462a' }}>booking.</span>
          </h2>
          <p className="serif-italic text-ink-soft text-lg mt-3 max-w-xl leading-snug">
            {t('about.booking.desc')}
          </p>
          <a href="mailto:hola@mat32.com?subject=Raretraxxx%20Booking"
             className="inline-flex items-center gap-2 mt-6 mono-tag hairline px-5 py-3 hover:bg-ink hover:text-paper transition-colors">
            HOLA@MAT32.COM →
          </a>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="container mx-auto px-6 md:px-10 py-20 max-w-3xl">
        <div className="mono-tag text-ink-soft mb-4">MANIFESTO</div>
        <blockquote className="serif-italic text-ink text-xl md:text-2xl leading-snug hairline-l pl-6" style={{ borderLeftColor: '#c8462a' }}>
          As you <b className="not-italic" style={{ color: '#c8462a' }}>hear the sound</b>, enjoy yourself. You won't always be around. You must try, and let the music that we play take you <b className="not-italic" style={{ color: '#c8462a' }}>high</b>.
        </blockquote>
        <div className="mt-4 mono-tag text-ink-soft pl-6">
          TOUCHDOWN · "EASE YOUR MIND" · STREETWISE · 1982
        </div>

        <div className="mt-16 pt-10 hairline-t">
          <div className="mono-tag flex items-center gap-2" style={{ color: '#c8462a' }}>
            <MapPin size={12} /> {t('about.where.tag')}
          </div>
          <h3 className="display mt-3 text-2xl md:text-3xl">C/ Matías Perelló 32</h3>
          <p className="serif-italic text-ink-soft mt-1 text-lg">Ruzafa · Valencia · 46005</p>
          <div className="mt-6 hairline overflow-hidden max-w-xl">
            <iframe
              title="MAT32 en Google Maps · Calle Matías Perelló 32, Ruzafa, Valencia"
              src="https://storage.googleapis.com/maps-solutions-2ix7wunb2w/locator-plus/et5g/locator-plus.html"
              width="100%" height="380" style={{ border: 0 }}
              loading="lazy" allow="geolocation"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href="https://maps.google.com/?q=MAT32+Valencia+Mat%C3%ADas+Perell%C3%B3+32" target="_blank" rel="noopener"
               className="mono-tag hairline px-3 py-2 hover:bg-ink hover:text-paper transition-colors">MAPS ↗</a>
            <a href="https://www.instagram.com/mat32__" target="_blank" rel="noopener"
               className="mono-tag hairline px-3 py-2 hover:bg-ink hover:text-paper transition-colors">@MAT32__</a>
          </div>
        </div>
      </section>
    </div>
  );
};

const VideoDuotone: React.FC<{ video: { id: string; start?: number } }> = ({ video }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="group relative hairline overflow-hidden bg-ink"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <div className="relative aspect-video">
        <iframe
          className={`absolute inset-0 w-full h-full transition-[filter] duration-500 ${hovered ? '' : 'grayscale contrast-[1.1] brightness-[0.85]'}`}
          src={`https://www.youtube-nocookie.com/embed/${video.id}${video.start ? `?start=${video.start}` : ''}`}
          title="" loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${hovered ? 'opacity-0' : 'opacity-100'}`}
          style={{ background: 'rgba(200, 70, 42, 0.35)', mixBlendMode: 'multiply' }} />
      </div>
    </div>
  );
};
