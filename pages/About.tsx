import React, { useEffect, useState } from 'react';
import { Disc, MapPin } from 'lucide-react';
import { SEO } from '../components/SEO';

const VIDEO_LONG = { id: 'Gdw6VmMVJok', start: 646 };
const VIDEO_SHORT = { id: 'wkEQNfchTcE' };

export const About: React.FC = () => {
  const [revealed, setRevealed] = useState(false);
  useEffect(() => { setTimeout(() => setRevealed(true), 80); }, []);

  return (
    <div className="min-h-screen bg-paper text-ink text-mat-cream pb-24">
      <SEO
        titleKey="Nosotros · MAT32 · Raretraxxx Valencia"
        descriptionKey="MAT32: bar hi-fi, almacén de discos y colectivo Raretraxxx en Valencia. Documental, reportaje en À Punt y manifesto."
      />

      {/* HERO */}
      <section className="relative pt-28 md:pt-32 pb-14 border-b border-mat-800 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(234,88,12,0.15),_transparent_60%)] pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className={`max-w-4xl transition-all duration-1000 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="inline-flex items-center gap-2 mb-6 text-mat-500 font-black uppercase text-[10px] tracking-[0.5em]">
              <Disc size={12} /> RARETRAXXX · RUZAFA
            </div>
            <h1 className="text-[13vw] sm:text-[9vw] md:text-[8rem] font-black uppercase tracking-tighter text-white font-exo leading-[0.85] mb-6">
              NOS<span className="text-mat-500">OTROS.</span>
            </h1>
            <p className="text-gray-300 max-w-3xl text-lg md:text-xl font-light leading-relaxed border-l-2 border-mat-500 pl-6">
              Bar hi-fi, almacén de discos y colectivo en Ruzafa. MAT32 se gestiona siguiendo el ideal del colectivo <b className="text-white">Raretraxxx</b>: compartir y descubrir música, con quienes siguen los mismos principios.
            </p>
          </div>
        </div>
      </section>

      {/* Cards con pies de foto */}
      <section className="py-14 md:py-20 border-b border-mat-800">
        <div className="container mx-auto px-6 max-w-6xl space-y-14 md:space-y-20">

          {/* Card 1 · Documental largo */}
          <figure>
            <VideoDuotone video={VIDEO_LONG} />
            <figcaption className="mt-4 text-sm text-gray-400 leading-relaxed max-w-3xl">
              Documental <span className="text-white font-bold">RARETRAXXX</span> por <span className="text-white font-bold">Andrónico</span>.
            </figcaption>
          </figure>

          {/* Card 2 · À Punt Media */}
          <figure>
            <div className="bg-mat-950 border border-mat-800 rounded-3xl overflow-hidden">
              <div className="grid md:grid-cols-[1.4fr_1fr] gap-0">
                <div className="relative aspect-video md:aspect-auto overflow-hidden bg-black">
                  <img
                    src="https://static.apuntmedia.es/clip/580a9cc1-c19a-49b4-81e3-217158b76024_facebook-aspect-ratio_default_0.jpg"
                    alt="Territori Sonor — À Punt Media"
                    loading="lazy"
                    className="w-full h-full object-cover grayscale contrast-[1.1] brightness-[0.9]"
                  />
                  <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(234, 88, 12, 0.32)', mixBlendMode: 'multiply' }} />
                  <div className="absolute top-3 left-3 bg-white/95 text-black text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md">
                    À PUNT MEDIA
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md font-mono">
                    21:40
                  </div>
                </div>
                <div className="p-5 md:p-7 flex flex-col justify-center gap-4">
                  <audio controls preload="none" className="w-full" src="/audio/jardi-electronic-mat32.mp3">
                    Tu navegador no soporta audio HTML5.
                  </audio>
                  <a
                    href="https://www.apuntmedia.es/programes/territori-sonor/complets/20-09-2024-neus-ferri-l-algoritme-sonor-xala-muses-jardi-electronic_135_1732336.html"
                    target="_blank" rel="noopener noreferrer"
                    className="text-[10px] font-black text-mat-500 hover:text-white uppercase tracking-widest"
                  >
                    Ver programa completo en À Punt ↗
                  </a>
                </div>
              </div>
            </div>
            <figcaption className="mt-4 text-sm text-gray-400 leading-relaxed max-w-3xl">
              Reportaje <span className="text-white font-bold">Territori Sonor</span> sobre Jardí Electrònic en MAT32. Por <span className="text-white font-bold">Ferran Toledo</span>, À Punt Media.
            </figcaption>
          </figure>

          {/* Card 3 · Video corto */}
          <figure className="max-w-3xl mx-auto">
            <VideoDuotone video={VIDEO_SHORT} />
            <figcaption className="mt-4 text-sm text-gray-400 leading-relaxed">
              Sesión en el local. Flyer <span className="text-white font-bold">Facil Graphics</span>.
            </figcaption>
          </figure>

        </div>
      </section>

      {/* BOOKING · card simple y seria */}
      <section className="py-16 md:py-20 border-b border-mat-800 bg-mat-950">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="bg-mat-900 border border-mat-800 rounded-3xl p-8 md:p-10">
            <div className="text-[10px] font-black text-mat-500 uppercase tracking-[0.5em] mb-4">
              Booking
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white font-exo uppercase tracking-tight leading-tight mb-4">
              Raretraxxx <span className="text-mat-500">booking</span>.
            </h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6 max-w-xl">
              Sesiones de Raretraxxx : eventos privados, aperturas, escucha, baile. Escríbenos con fecha, lugar y formato.
            </p>
            <a
              href="mailto:hola@mat32.com?subject=Raretraxxx%20Booking"
              className="inline-flex items-center gap-2 text-mat-500 hover:text-white text-base font-bold border-b border-mat-500/50 hover:border-white pb-0.5 transition-colors"
            >
              hola@mat32.com →
            </a>
          </div>
        </div>
      </section>

      {/* MANIFESTO · al final, sobrio */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] mb-6">
            Manifesto
          </div>
          <blockquote className="text-white/95 font-light text-xl md:text-2xl leading-relaxed border-l-2 border-mat-500/70 pl-6">
            As you <span className="text-mat-500 font-bold">hear the sound</span>, enjoy yourself. You won't always be around. You must try, and let the music that we play take you <span className="text-mat-500 font-bold">high</span>.
          </blockquote>
          <div className="mt-5 text-[10px] text-gray-600 uppercase tracking-[0.4em] pl-6">
            Touchdown · "Ease Your Mind" · Streetwise · 1982
          </div>

          {/* Dónde estamos */}
          <div className="mt-16 pt-10 border-t border-mat-800">
            <div className="inline-flex items-center gap-2 mb-4 text-mat-500 font-black uppercase text-[10px] tracking-[0.5em]">
              <MapPin size={12} /> Dónde estamos
            </div>
            <p className="text-white text-lg md:text-xl font-bold font-exo uppercase tracking-tight mb-1">
              C/ Matías Perelló 32
            </p>
            <p className="text-gray-400 text-sm">Ruzafa · Valencia · 46005</p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-black uppercase tracking-[0.3em] text-gray-500">
              <a href="https://maps.google.com/?q=MAT32+Valencia+Mat%C3%ADas+Perell%C3%B3+32" target="_blank" rel="noopener" className="hover:text-mat-500">Maps ↗</a>
              <a href="https://www.instagram.com/mat32valencia" target="_blank" rel="noopener" className="hover:text-mat-500">@mat32valencia</a>
              {/* reference points: oculto hasta poblar bios reales */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const VideoDuotone: React.FC<{ video: { id: string; start?: number } }> = ({ video }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="group relative rounded-2xl md:rounded-3xl overflow-hidden border border-mat-800"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-video bg-black">
        <iframe
          className={`absolute inset-0 w-full h-full transition-[filter] duration-500 ${hovered ? '' : 'grayscale contrast-[1.1] brightness-[0.85]'}`}
          src={`https://www.youtube-nocookie.com/embed/${video.id}${video.start ? `?start=${video.start}` : ''}`}
          title=""
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${hovered ? 'opacity-0' : 'opacity-100'}`}
          style={{ background: 'rgba(234, 88, 12, 0.32)', mixBlendMode: 'multiply' }}
        />
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${hovered ? 'opacity-0' : 'opacity-100'}`}
          style={{ background: 'rgba(13, 13, 13, 0.25)', mixBlendMode: 'screen' }}
        />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_55%,_rgba(0,0,0,0.4)_100%)]" />
      </div>
    </div>
  );
};
