
import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, Loader2, Music, Instagram, ExternalLink, Radio, Volume2, VolumeX } from 'lucide-react';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { CachedImage } from '../components/CachedImage';
import { useRadio } from '../context/RadioContext';

const STREET_RADIO_POST_URL = 'https://www.instagram.com/p/DY7mOHWixdK/';
const STREET_RADIO_VIDEO_URL = '/video/street-radio-green-booth.mp4';
const STREET_RADIO_POSTER_URL = '/video/street-radio-green-booth-poster.jpg';

const GENRES = ['DISCO', 'HOUSE', 'BALEARIC', 'LEFTFIELD', 'JAZZ', 'SOUL', 'FUNK', 'AMBIENT', 'ELECTRÓNICA', 'WORLD', 'AFRO', 'EXPERIMENTAL', 'SYNTH'];

const TIME_SLOTS = [
  { id: '1', start: '19:30', end: '21:00' },
  { id: '2', start: '21:00', end: '22:30' },
  { id: '3', start: '22:30', end: '00:00' },
  { id: '4', start: '00:00', end: '01:30' },
];

interface NextSelector {
  id: string;
  name: string;
  handle: string | null;
  role: string | null;
  bio: string | null;
  image_url: string | null;
  tags: string[];
  mixcloud_url: string | null;
  soundcloud_url: string | null;
  instagram_url: string | null;
  web_url: string | null;
}

export const OpenDecks: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [genreError, setGenreError] = useState(false);
  const [nextSelectors, setNextSelectors] = useState<NextSelector[]>([]);
  const [form, setForm] = useState({
    artistName: '',
    email: '',
    phone: '',
    genres: [] as string[],
    date: '',
    slot: '',
    socialUrl: '',
    streetRadio: false,
  });
  const { isPlaying: radioPlaying, toggle: toggleRadio } = useRadio();
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const videoPlayingRef = useRef(false);
  const [videoMuted, setVideoMuted] = useState(true);

  useEffect(() => {
    const el = videoSectionRef.current;
    const video = videoRef.current;
    if (!el || !video) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // El radio persistente tiene su propio autoplay-al-primer-gesto, que puede
  // arrancar justo después de que pausemos por el vídeo. Mientras el vídeo
  // esté reproduciéndose, cualquier intento de la radio de encenderse se corta.
  useEffect(() => {
    if (radioPlaying && videoPlayingRef.current) toggleRadio();
  }, [radioPlaying, toggleRadio]);

  const handleVideoPlay = () => {
    videoPlayingRef.current = true;
    if (radioPlaying) toggleRadio();
  };

  const handleVideoPause = () => {
    videoPlayingRef.current = false;
  };

  const toggleVideoMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setVideoMuted(v.muted);
  };

  useEffect(() => {
    dataService.getReferenceSelectorsPublic()
      .then((all: any[]) => setNextSelectors(all.filter(s => s.tier === 'next' && !s.hidden).sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))))
      .catch(() => {});
  }, []);

  const toggleGenre = (g: string) => {
    setGenreError(false);
    setForm(f => ({ ...f, genres: f.genres.includes(g) ? f.genres.filter(x => x !== g) : [...f.genres, g] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.artistName || !form.email) return;
    if (form.genres.length < 2) { setGenreError(true); return; }
    setIsProcessing(true);
    setSubmitError(false);
    const slotObj = TIME_SLOTS.find(s => s.id === form.slot);
    const slotLabel = slotObj ? `${slotObj.start} → ${slotObj.end}` : '—';
    try {
      await dataService.createInboxMessage({
        type: 'artist',
        sender: form.artistName,
        email: form.email,
        content: `Solicitud Open Decks. Teléfono: ${form.phone || '—'}. Estilos: ${form.genres.join(', ')}. Fecha: ${form.date || '—'} · Slot: ${slotLabel}. Link: ${form.socialUrl || '—'}. Street Radio (Green Booth, audio/vídeo 21:00→23:00): ${form.streetRadio ? 'Sí' : 'No'}.`,
        metadata: { source: 'open-decks', artistName: form.artistName, phone: form.phone, genres: form.genres.join(', '), date: form.date, slot: form.slot, slotTime: slotLabel, socialUrl: form.socialUrl, streetRadio: form.streetRadio }
      });
      setIsSubmitted(true);
    } catch {
      setSubmitError(true);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink pb-24">
      <SEO titleKey="Open Decks · MAT32 Valencia" descriptionKey="Toca en MAT32. Vinyl only en el sistema Altec A7 + Technics 1210. Mándanos tu mix y te ponemos en la rotación." />

      {/* HERO */}
      <div className="relative h-[58vh] overflow-hidden hairline-b">
        <CachedImage
          src="https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/de211934-62c1-4fb5-6c4a-35cd8a0d9700/public"
          alt="Cabina MAT32"
          priority
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/65" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <span className="mono-tag text-bermellon mb-6 !tracking-[0.35em]">OPEN DECKS · MAT32 · RUZAFA</span>
          <h1 className="display text-paper text-[14vw] sm:text-[10vw] md:text-[8rem] leading-none tracking-tight mb-6">
            OPEN<br /><span style={{ color: '#c8462a' }}>DECKS.</span>
          </h1>
          <p className="serif-italic text-paper/60 text-lg max-w-md leading-snug">
            Records & Digital OK · Altec A7 · Technics 1210 · Rotary mixer
          </p>
        </div>
      </div>

      <div className="container mx-auto px-5 md:px-8 max-w-6xl">

        {/* SPECS */}
        <div className="grid md:grid-cols-4 hairline-b py-10 gap-0">
          {[
            { label: 'SISTEMA P.A.', value: 'Altec Lansing A7' },
            { label: 'MIXER', value: 'Rotary Analógico' },
            { label: 'TURNTABLES', value: '2× Technics 1210' },
            { label: 'FORMATO', value: 'Records & Digital OK' },
          ].map((item, i) => (
            <div key={i} className={`py-6 px-6 ${i < 3 ? 'md:hairline-r' : ''}`}>
              <div className="mono-tag text-ink/40 mb-2">{item.label}</div>
              <div className="font-wordmark font-bold text-ink">{item.value}</div>
            </div>
          ))}
        </div>

        {/* NEXT SELECTORS */}
        {nextSelectors.length > 0 && (
          <div className="py-14 hairline-b">
            <div className="flex items-baseline gap-4 mb-10">
              <h2 className="display text-4xl md:text-5xl text-ink tracking-tight">PRÓXIMOS <span style={{ color: '#c8462a' }}>SELECTORES</span></h2>
              <div className="h-px flex-1 bg-ink/10" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ink/10 hairline">
              {nextSelectors.map(s => (
                <div key={s.id} className="bg-paper p-6 group hover:bg-paper-2 transition-colors">
                  {s.image_url && (
                    <div className="aspect-square mb-4 overflow-hidden hairline">
                      <img src={s.image_url} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  {s.handle && <div className="mono-tag text-bermellon mb-1">{s.handle}</div>}
                  <h3 className="display text-2xl text-ink tracking-tight mb-2">{s.name}</h3>
                  {s.role && <div className="mono-tag text-ink/50 mb-2">{s.role}</div>}
                  {s.bio && <p className="text-sm text-ink/60 leading-relaxed mb-3 serif-italic">{s.bio}</p>}
                  {s.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {s.tags.map(t => (
                        <span key={t} className="mono-tag hairline px-2 py-1 text-ink/50">{t}</span>
                      ))}
                    </div>
                  )}
                  {(s.mixcloud_url || s.soundcloud_url || s.instagram_url || s.web_url) && (
                    <div className="flex gap-2 pt-1 flex-wrap">
                      {s.mixcloud_url && <a href={s.mixcloud_url} target="_blank" rel="noopener noreferrer" className="mono-tag hairline px-3 py-1.5 text-ink hover:bg-ink hover:text-paper transition-colors flex items-center gap-1"><Music size={10} /> Mix</a>}
                      {s.soundcloud_url && <a href={s.soundcloud_url} target="_blank" rel="noopener noreferrer" className="mono-tag hairline px-3 py-1.5 text-ink hover:bg-ink hover:text-paper transition-colors flex items-center gap-1"><Music size={10} /> SC</a>}
                      {s.instagram_url && <a href={s.instagram_url} target="_blank" rel="noopener noreferrer" className="mono-tag hairline px-3 py-1.5 text-ink hover:bg-ink hover:text-paper transition-colors flex items-center gap-1"><Instagram size={10} /> IG</a>}
                      {s.web_url && <a href={s.web_url} target="_blank" rel="noopener noreferrer" className="mono-tag hairline px-3 py-1.5 text-ink hover:bg-ink hover:text-paper transition-colors flex items-center gap-1"><ExternalLink size={10} /> Web</a>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STREET RADIO · GREEN BOOTH */}
        <div className="py-14 hairline-b">
          <div className="flex items-baseline gap-4 mb-10">
            <h2 className="display text-4xl md:text-5xl text-ink tracking-tight">STREET <span style={{ color: '#c8462a' }}>RADIO.</span></h2>
            <div className="h-px flex-1 bg-ink/10" />
          </div>
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-5">
              <div className="mono-tag text-bermellon">GRABACIÓN EN DIRECTO</div>
              <div className="hairline p-5 space-y-3">
                <div className="flex justify-between mono-tag text-ink/60">
                  <span>HORARIO</span><span className="text-ink">21:00 → 23:00</span>
                </div>
                <div className="flex justify-between mono-tag text-ink/60">
                  <span>FORMATO</span><span className="text-ink">Audio + Vídeo</span>
                </div>
                <div className="flex justify-between mono-tag text-ink/60">
                  <span>DÓNDE</span><span className="text-ink">Green Booth</span>
                </div>
              </div>
              <p className="mono-tag text-ink/40 !text-[11px]">
                Marca la casilla en el formulario si quieres grabar tu sesión en este formato.
              </p>
            </div>
            <div className="lg:col-span-7">
              <div ref={videoSectionRef} className="hairline overflow-hidden shadow-[0_18px_40px_rgba(0,0,0,0.14),0_6px_14px_rgba(0,0,0,0.08)] max-w-sm mx-auto lg:mx-0" style={{ background: '#0c0c0c' }}>
                <div className="bg-ink px-4 py-2.5 flex items-center gap-2 hairline-ink-b">
                  <Radio size={12} style={{ color: '#d8ff5a' }} />
                  <span className="mono-tag !text-[9px] text-paper/80">GREEN BOOTH</span>
                </div>
                <div className="relative aspect-[9/16] bg-black">
                  <video
                    ref={videoRef}
                    src={STREET_RADIO_VIDEO_URL}
                    poster={STREET_RADIO_POSTER_URL}
                    className="w-full h-full object-cover"
                    muted={videoMuted}
                    loop
                    playsInline
                    preload="metadata"
                    onPlay={handleVideoPlay}
                    onPause={handleVideoPause}
                  />
                  <button
                    type="button"
                    onClick={toggleVideoMute}
                    className="absolute bottom-3 right-3 mono-tag !text-[10px] bg-ink/80 text-paper px-3 py-2.5 hairline-ink flex items-center gap-2 hover:bg-ink transition-colors"
                  >
                    {videoMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                    {videoMuted ? 'ACTIVAR SONIDO' : 'SILENCIAR'}
                  </button>
                </div>
                <a
                  href={STREET_RADIO_POST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 hairline-ink-t text-paper/50 hover:text-paper transition-colors"
                >
                  <Instagram size={11} />
                  <span className="mono-tag !text-[9px]">VER POST ORIGINAL</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="py-14 grid lg:grid-cols-12 gap-12 items-start">

          {/* Left info */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <h2 className="display text-3xl md:text-4xl text-ink tracking-tight mb-3">
                LA CABINA<br /><span style={{ color: '#c8462a' }}>ES TUYA.</span>
              </h2>
              <p className="serif-italic text-ink/60 leading-relaxed">
                Rellena el formulario con tus géneros y disponibilidad. Si tenemos hueco y encaja, te escribimos.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-8 hairline">
            {isSubmitted ? (
              <div className="p-12 text-center">
                <CheckCircle className="w-12 h-12 text-bermellon mx-auto mb-6" />
                <h3 className="display text-3xl text-ink tracking-tight mb-3">SOLICITUD ENVIADA</h3>
                <p className="serif-italic text-ink/60 mb-8">El equipo lo revisará y te avisamos si hay hueco.</p>
                <button
                  onClick={() => { setIsSubmitted(false); setForm({ artistName: '', email: '', phone: '', genres: [], date: '', slot: '', socialUrl: '', streetRadio: false }); }}
                  className="mono-tag hairline px-6 py-3 text-ink hover:bg-ink hover:text-paper transition-colors"
                >
                  NUEVA SOLICITUD
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="divide-y divide-ink/10">

                {/* Nombre + Email + Teléfono */}
                <div className="p-6 grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="mono-tag text-ink/50 block mb-2">Nombre artístico *</label>
                    <input
                      required
                      value={form.artistName}
                      onChange={e => setForm({ ...form, artistName: e.target.value })}
                      className="w-full hairline p-3 text-ink mono-tag !text-[12px] !normal-case outline-none focus:border-bermellon transition-colors bg-transparent"
                      placeholder="Tu nombre o alias"
                    />
                  </div>
                  <div>
                    <label className="mono-tag text-ink/50 block mb-2">Email *</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full hairline p-3 text-ink mono-tag !text-[12px] !normal-case outline-none focus:border-bermellon transition-colors bg-transparent"
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div>
                    <label className="mono-tag text-ink/50 block mb-2">Teléfono</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      className="w-full hairline p-3 text-ink mono-tag !text-[12px] !normal-case outline-none focus:border-bermellon transition-colors bg-transparent"
                      placeholder="+34 600 000 000"
                    />
                  </div>
                </div>

                {/* Géneros */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="mono-tag text-ink/50">Géneros <span className="text-ink/30">(mín. 2)</span></label>
                    {form.genres.length > 0 && <span className="mono-tag text-bermellon">{form.genres.length} seleccionados</span>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {GENRES.map(g => {
                      const active = form.genres.includes(g);
                      return (
                        <button
                          key={g}
                          type="button"
                          onClick={() => toggleGenre(g)}
                          className={`mono-tag px-3 py-2 transition-colors ${
                            active
                              ? 'bg-bermellon text-paper border border-bermellon'
                              : 'hairline text-ink/60 hover:text-ink hover:border-ink'
                          }`}
                        >
                          {g}
                        </button>
                      );
                    })}
                  </div>
                  {genreError && <p className="mono-tag text-bermellon mt-3">Selecciona al menos 2 géneros</p>}
                </div>

                {/* Fecha + Slots */}
                <div className="p-6">
                  <label className="mono-tag text-ink/50 block mb-3">Disponibilidad <span className="text-ink/30">(opcional)</span></label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    className="w-full hairline p-3 text-ink mono-tag !text-[12px] !normal-case outline-none focus:border-bermellon transition-colors bg-transparent mb-4"
                  />
                  <div className="mono-tag text-ink/50 mb-3">Slot preferido</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {TIME_SLOTS.map(s => {
                      const active = form.slot === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, slot: f.slot === s.id ? '' : s.id }))}
                          className={`p-4 text-left transition-colors ${
                            active
                              ? 'bg-ink text-paper'
                              : 'hairline text-ink hover:bg-paper-2'
                          }`}
                        >
                          <div className="mono-tag text-[10px] mb-1" style={{ color: active ? '#c8462a' : '#c8462a' }}>{s.start}</div>
                          <div className="mono-tag text-[10px] opacity-60">→ {s.end}</div>
                          <div className="mono-tag text-[9px] mt-2 opacity-40">90 MIN</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Street Radio opt-in */}
                <div className="p-6">
                  <label className="mono-tag text-ink/50 block mb-3">Street Radio <span className="text-ink/30">(opcional)</span></label>
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, streetRadio: !f.streetRadio }))}
                    className={`w-full flex items-start gap-3 p-4 text-left transition-colors ${
                      form.streetRadio ? 'bg-ink text-paper' : 'hairline text-ink hover:bg-paper-2'
                    }`}
                  >
                    <div className={`mt-0.5 w-4 h-4 flex items-center justify-center shrink-0 hairline ${form.streetRadio ? 'bg-bermellon border-bermellon' : ''}`}>
                      {form.streetRadio && <CheckCircle size={12} className="text-paper" />}
                    </div>
                    <div>
                      <div className="mono-tag" style={{ color: '#c8462a' }}>GRABAR EN EL GREEN BOOTH</div>
                      <div className="text-sm mt-1 opacity-80">Quiero que mi sesión se grabe en audio y vídeo, formato street radio · 21:00 → 23:00</div>
                    </div>
                  </button>
                </div>

                {/* Link */}
                <div className="p-6">
                  <label className="mono-tag text-ink/50 block mb-2">Tu mix / perfil <span className="text-ink/30">(opcional · Mixcloud, SoundCloud, Instagram...)</span></label>
                  <input
                    value={form.socialUrl}
                    onChange={e => setForm({ ...form, socialUrl: e.target.value })}
                    className="w-full hairline p-3 text-ink mono-tag !text-[12px] !normal-case outline-none focus:border-bermellon transition-colors bg-transparent"
                    placeholder="https://mixcloud.com/tu-perfil"
                  />
                </div>

                {/* Submit */}
                <div className="p-6">
                  {submitError && <p className="mono-tag text-bermellon mb-4">Error al enviar. Prueba de nuevo o escríbenos a hola@mat32.com</p>}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-5 bg-bermellon text-paper mono-tag flex items-center justify-center gap-3 hover:bg-ink transition-colors disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Music size={16} />}
                    ENVIAR SOLICITUD
                  </button>
                </div>

              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
