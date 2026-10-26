
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2, Music, Instagram, ExternalLink, Radio, Volume2, VolumeX, Calendar, Clock, MapPin, Plus, Users, TrendingUp, Star } from 'lucide-react';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { useRadio } from '../context/RadioContext';

const STREET_RADIO_POST_URL = 'https://www.instagram.com/p/DY7mOHWixdK/';
const STREET_RADIO_VIDEO_URL = '/video/street-radio-green-booth.mp4';
const STREET_RADIO_POSTER_URL = '/video/street-radio-green-booth-poster.jpg';

const GENRES = ['DISCO', 'HOUSE', 'BALEARIC', 'LEFTFIELD', 'JAZZ', 'SOUL', 'FUNK', 'AMBIENT', 'ELECTRÓNICA', 'WORLD', 'AFRO', 'EXPERIMENTAL', 'SYNTH'];

// Modelo para tableros de club de escucha
interface ClubBoard {
  id: string;
  title: string;
  description: string;
  owner: string;
  email: string;
  genres: string[];
  date: string;
  time: string;
  vinyls: string[];
  createdAt: string;
  attendees: number;
  suggestions: string[];
}

export const OpenDecks: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [genreError, setGenreError] = useState(false);
  const [mixError, setMixError] = useState(false);
  const [clubBoards, setClubBoards] = useState<ClubBoard[]>([]);
  const [activeTab, setActiveTab] = useState<'create' | 'browse'>('create');
  const [form, setForm] = useState({
    artistName: '',
    email: '',
    phone: '',
    genres: [] as string[],
    date: '',
    time: '19:00',
    socialUrl: '',
    vinyls: '',
    boardTitle: '',
    boardDescription: '',
  });
  const navigate = useNavigate();
  const { isPlaying: radioPlaying, toggle: toggleRadio } = useRadio();
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const videoPlayingRef = useRef(false);
  const [videoMuted, setVideoMuted] = useState(true);

  useEffect(() => {
    document.body.classList.add('theme-ink');
    return () => { document.body.classList.remove('theme-ink'); };
  }, []);

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
      .then((all: any[]) => setClubBoards(all.filter(s => s.tier === 'next' && !s.hidden).sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))))
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
    if (!form.socialUrl) { setMixError(true); return; }
    setIsProcessing(true);
    setSubmitError(false);
    try {
      await dataService.createInboxMessage({
        type: 'artist',
        sender: form.artistName,
        email: form.email,
        content: `Solicitud SESIÓN. Teléfono: ${form.phone || '—'}. Tablero: ${form.boardTitle || '—'}. Estilos: ${form.genres.join(', ')}. Fecha/Hora: ${form.date || '—'} ${form.time || ''}. Link: ${form.socialUrl || '—'}. Descripción: ${form.boardDescription || '—'}. Discos: ${form.vinyls || '—'}.`,
        metadata: { source: 'open-decks', artistName: form.artistName, phone: form.phone, genres: form.genres.join(', '), date: form.date, time: form.time, boardTitle: form.boardTitle, boardDescription: form.boardDescription, socialUrl: form.socialUrl, vinyls: form.vinyls }
      });
      navigate('/open-decks/gracias', {
        state: {
          artistName: form.artistName,
          genres: form.genres,
          date: form.date,
          vinyls: form.vinyls,
          boardTitle: form.boardTitle,
        },
      });
    } catch {
      setSubmitError(true);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink pb-24">
      <SEO titleKey="Open Decks · MAT32 Valencia" descriptionKey="Toca en MAT32. Sesiones en discos en el sistema Altec A7 + Technics 1210. Mándanos tu mix y te ponemos en la rotación." />

      {/* HERO · vídeo de fondo */}
      <div className="relative h-[58vh] overflow-hidden hairline-b">
        <video
          className="w-full h-full object-cover"
          src="/video/street-radio-green-booth.mp4"
          poster="https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/de211934-62c1-4fb5-6c4a-35cd8a0d9700/public"
          autoPlay muted loop playsInline preload="metadata"
        />
        <div className="absolute inset-0 bg-ink/65" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <span className="mono-tag text-bermellon mb-6 !tracking-[0.35em]">OPEN DECKS · MAT32 · RUZAFA</span>
          <h1 className="display text-paper text-[14vw] sm:text-[10vw] md:text-[8rem] leading-none tracking-tight mb-6">
            OPEN<br /><span style={{ color: '#c8462a' }}>DECKS.</span>
          </h1>
          <p className="serif-italic text-paper/60 text-lg max-w-md leading-snug">
            Altec A7 · Technics 1210 · Rotary mixer
          </p>
        </div>
      </div>

      <div className="container mx-auto px-5 md:px-8 max-w-6xl">

        {/* TABS */}
        <div className="flex border-b border-ink/30 mt-10 mb-8">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-6 py-3 mono-tag ${activeTab === 'create' ? 'border-b border-bermellon text-bermellon' : 'text-ink/60 hover:text-ink'}`}
          >
            CREAR CLUB
          </button>
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-6 py-3 mono-tag ${activeTab === 'browse' ? 'border-b border-bermellon text-bermellon' : 'text-ink/60 hover:text-ink'}`}
          >
            EXPLORAR CLUBS
          </button>
        </div>
{activeTab === 'create' ? (
          /* ─── TAB: CREAR CLUB ─── */
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Plus className="w-5 h-5 text-bermellon" />
              <h2 className="display text-3xl text-ink">Crea tu club de escucha</h2>
            </div>

            <div className="grid lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-4 space-y-5">
                <div className="mono-tag text-bermellon">CLUB DE ESCUCHA</div>
                <div className="hairline p-5 space-y-3">
                  <div className="flex justify-between mono-tag text-ink/60">
                    <span>SISTEMA</span><span className="text-ink">Altec Lansing A7</span>
                  </div>
                  <div className="flex justify-between mono-tag text-ink/60">
                    <span>MIXER</span><span className="text-ink">Rotary Analógico</span>
                  </div>
                  <div className="flex justify-between mono-tag text-ink/60">
                    <span>TURNTABLES</span><span className="text-ink">2× Technics 1210</span>
                  </div>
                </div>
                <p className="serif-italic text-ink/50 text-sm leading-relaxed">
                  Crea un tablero público con tus discos, elige día y horario, y abre la sesión a la comunidad.
                  La gente se apunta, sugiere discos, y cuando hay suficiente volumen el club tiene continuidad.
                </p>
              </div>

              <div className="lg:col-span-8 hairline">
                <form onSubmit={handleSubmit} className="divide-y divide-ink/10">

                  <div className="p-6 grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="mono-tag text-ink/50 block mb-2">Tu nombre o alias *</label>
                      <input required value={form.artistName} onChange={e => setForm({ ...form, artistName: e.target.value })}
                        className="w-full hairline p-3 text-ink mono-tag !text-[12px] !normal-case outline-none focus:border-bermellon transition-colors bg-transparent"
                        placeholder="Nombre o alias" />
                    </div>
                    <div>
                      <label className="mono-tag text-ink/50 block mb-2">Email *</label>
                      <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                        className="w-full hairline p-3 text-ink mono-tag !text-[12px] !normal-case outline-none focus:border-bermellon transition-colors bg-transparent"
                        placeholder="tu@email.com" />
                    </div>
                    <div>
                      <label className="mono-tag text-ink/50 block mb-2">Teléfono</label>
                      <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                        className="w-full hairline p-3 text-ink mono-tag !text-[12px] !normal-case outline-none focus:border-bermellon transition-colors bg-transparent"
                        placeholder="+34 600 000 000" />
                    </div>
                  </div>

                  <div className="p-6">
                    <label className="mono-tag text-ink/50 block mb-2">Nombre del club *</label>
                    <input required value={form.boardTitle} onChange={e => setForm({ ...form, boardTitle: e.target.value })}
                      className="w-full hairline p-3 text-ink mono-tag !text-[12px] !normal-case outline-none focus:border-bermellon transition-colors bg-transparent"
                      placeholder="P.EJ: Warp Records Listening Club" />
                  </div>

                  <div className="p-6">
                    <label className="mono-tag text-ink/50 block mb-2">Géneros <span className="text-ink/30">(mín. 2)</span></label>
                    <div className="flex flex-wrap gap-2">
                      {GENRES.map(g => {
                        const active = form.genres.includes(g);
                        return (
                          <button key={g} type="button" onClick={() => toggleGenre(g)}
                            className={`mono-tag px-3 py-2 transition-colors ${active ? 'bg-bermellon text-paper border border-bermellon' : 'hairline text-ink/60 hover:text-ink hover:border-ink'}`}>{g}</button>
                        );
                      })}
                    </div>
                    {genreError && <p className="mono-tag text-bermellon mt-3">Selecciona al menos 2 géneros</p>}
                  </div>

                  <div className="p-6">
                    <label className="mono-tag text-ink/50 block mb-2">Fecha y hora</label>
                    <div className="flex gap-3 items-center">
                      <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                        className="hairline p-3 text-ink mono-tag !text-[12px] !normal-case outline-none focus:border-bermellon transition-colors bg-transparent" />
                      <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}
                        className="hairline p-3 text-ink mono-tag !text-[12px] !normal-case outline-none focus:border-bermellon transition-colors bg-transparent" />
                    </div>
                  </div>

                  <div className="p-6">
                    <label className="mono-tag text-ink/50 block mb-2">Descripción <span className="text-ink/30">(opcional)</span></label>
                    <textarea rows={3} value={form.boardDescription} onChange={e => setForm({ ...form, boardDescription: e.target.value })}
                      className="w-full hairline p-3 text-ink mono-tag !text-[12px] !normal-case outline-none focus:border-bermellon transition-colors bg-transparent resize-none"
                      placeholder="Estilo, ambiente, aforo, lo que se te ocurra." />
                  </div>

                  <div className="p-6">
                    <label className="mono-tag text-ink/50 block mb-2">Discos que sonarán</label>
                    <textarea rows={3} value={form.vinyls} onChange={e => setForm({ ...form, vinyls: e.target.value })}
                      className="w-full hairline p-3 text-ink mono-tag !text-[12px] !normal-case outline-none focus:border-bermellon transition-colors bg-transparent resize-none"
                      placeholder={'1. Artista — Disco\n2. Artista — Disco\n3. Artista — Disco\u2026'} />
                    <p className="mono-tag text-ink/30 !text-[10px] mt-2">La gente podrá verlos y sugerir añadir más.</p>
                  </div>

                  <div className="p-6">
                    <label className="mono-tag text-ink/50 block mb-2">Tu sesión de referencia <span className="text-ink/30">(obligatorio · Mixcloud o SoundCloud)</span></label>
                    <input required value={form.socialUrl} onChange={e => { setMixError(false); setForm({ ...form, socialUrl: e.target.value }); }}
                      className={`w-full hairline p-3 text-ink mono-tag !text-[12px] !normal-case outline-none focus:border-bermellon transition-colors bg-transparent ${mixError ? 'border-bermellon' : ''}`}
                      placeholder="https://mixcloud.com/tu-perfil/sesion-1" />
                    {mixError && <p className="mono-tag text-bermellon mt-2">Mándanos el enlace a una sesión (obligatorio).</p>}
                  </div>

                  <div className="p-6">
                    {submitError && <p className="mono-tag text-bermellon mb-4">Error al enviar. Escríbenos a hola@mat32.com</p>}
                    <button type="submit" disabled={isProcessing}
                      className="w-full py-5 bg-bermellon text-paper mono-tag flex items-center justify-center gap-3 hover:bg-ink transition-colors disabled:opacity-50">
                      {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Star size={16} />}
                      CREAR CLUB DE ESCUCHA
                    </button>
                  </div>

                </form>
              </div>
            </div>
          </div>
        ) : (
          /* ─── TAB: EXPLORAR CLUBS ─── */
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Users className="w-5 h-5 text-bermellon" />
              <h2 className="display text-3xl text-ink">Clubs activos</h2>
            </div>

            {clubBoards.length === 0 ? (
              <div className="text-center py-16 hairline">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-ink/30" />
                <p className="serif-italic text-ink/50 text-lg">Todavía no hay clubs activos.</p>
                <p className="serif-italic text-ink/40 text-sm mt-2">Sé el primero en crear uno.</p>
                <button onClick={() => setActiveTab('create')}
                  className="mt-8 bg-bermellon text-paper px-5 py-3 mono-tag hover:bg-paper hover:text-ink transition-colors">
                  CREAR PRIMER CLUB
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {clubBoards.map(board => (
                  <div key={board.id} className="hairline bg-paper p-5 group hover:bg-paper-2 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="mono-tag text-bermellon">{board.genres.slice(0, 2).join(' · ')}</div>
                      <div className="mono-tag text-ink/40">{board.date} · {board.time}</div>
                    </div>
                    <h3 className="display text-xl text-ink tracking-tight mb-1">{board.title}</h3>
                    <p className="mono-tag text-ink/50">por {board.owner}</p>
                    {board.description && <p className="serif-italic text-ink/60 text-sm mt-2 leading-snug">{board.description}</p>}
                    {board.vinyls.length > 0 && (
                      <div className="mt-3">
                        <div className="mono-tag text-ink/40 !text-[9px]">DISCOS</div>
                        <ul className="space-y-1 mt-1">
                          {board.vinyls.slice(0, 3).map((v, i) => (
                            <li key={i} className="mono-tag !text-[10px] text-ink/60">{v}</li>
                          ))}
                          {board.vinyls.length > 3 && <li className="mono-tag !text-[10px] text-ink/40">+{board.vinyls.length - 3} más</li>}
                        </ul>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-4 pt-3 hairline-t">
                      <div className="flex items-center gap-2 mono-tag text-ink/40">
                        <Users size={10} /> {board.attendees} apuntados
                      </div>
                      <button onClick={() => alert('Te apuntamos. Te escribimos por email.')}
                        className="mono-tag bg-bermellon text-paper px-3 py-1.5 text-[10px] hover:bg-ink transition-colors">
                        APUNTARSE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
