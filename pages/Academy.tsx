import React, { useState, useEffect } from 'react';
import { Video, Mic2, Disc3, GraduationCap, Calendar, Clock, Globe2, CheckCircle, Loader2, AlertCircle, Sparkles, Users, Award } from 'lucide-react';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';

type WorkshopKey = 'audiovisual' | 'live' | 'dj';

interface Workshop {
  key: WorkshopKey;
  icon: any;
  title: string;
  subtitle: string;
  description: string;
  modules: string[];
  level: string;
  gradient: string;
}

const WORKSHOPS: Workshop[] = [
  {
    key: 'audiovisual',
    icon: Video,
    title: 'AUDIOVISUAL PRODUCTION',
    subtitle: 'From Field Recording to Final Cut',
    description: 'Learn the full pipeline: music video shooting, visual synthesis, editing, and sync for live sets & releases.',
    modules: ['DSLR + Lens basics', 'Color grading workflow', 'TouchDesigner intro', 'Resolume & live visuals', 'Sound design for video'],
    level: 'Beginner → Intermediate',
    gradient: 'from-purple-600/20 via-pink-500/10 to-transparent',
  },
  {
    key: 'live',
    icon: Mic2,
    title: 'LIVE PERFORMING',
    subtitle: 'Stage Craft for Electronic Artists',
    description: 'Build a live set that breathes — hardware jams, modular setups, Ableton Push, and stage presence.',
    modules: ['Ableton live rig', 'Hardware sync & routing', 'Modular patching', 'Stage presence & flow', 'Tour-ready setup'],
    level: 'Intermediate',
    gradient: 'from-orange-600/20 via-red-500/10 to-transparent',
  },
  {
    key: 'dj',
    icon: Disc3,
    title: 'DJ CRAFT',
    subtitle: 'Selectors & Turntablism',
    description: 'Deep listening, beatmatching, digging, and the art of reading a room. Vinyl, CDJ, and Rekordbox.',
    modules: ['Beatmatching fundamentals', 'Harmonic mixing', 'Digging & music discovery', 'Reading the dancefloor', 'Recording a mix'],
    level: 'All levels',
    gradient: 'from-mat-500/20 via-amber-500/10 to-transparent',
  },
];

interface Mentor {
  name: string;
  role: string;
  bio: string;
  tags: string[];
  confirmed: boolean;
  workshops: WorkshopKey[];
}

const MENTORS: Mentor[] = [
  {
    name: 'DYSTO',
    role: 'Lead Mentor',
    bio: 'DJ, producer, and curator. Over 15 years behind the decks and in the studio. Runs the Digger Radar and DYTID archive.',
    tags: ['DJ', 'Production', 'Music Curation'],
    confirmed: true,
    workshops: ['dj', 'live', 'audiovisual'],
  },
  {
    name: 'TBA',
    role: 'Visuals & AV Mentor',
    bio: 'Announced soon. Specialist in live visuals, TouchDesigner and music-video direction.',
    tags: ['Visuals', 'Video', 'TouchDesigner'],
    confirmed: false,
    workshops: ['audiovisual'],
  },
  {
    name: 'TBA',
    role: 'Live Performance Mentor',
    bio: 'Announced soon. Live-rig specialist — Ableton, hardware, modular synthesis.',
    tags: ['Live', 'Ableton', 'Hardware'],
    confirmed: false,
    workshops: ['live'],
  },
];

export const Academy: React.FC = () => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState<WorkshopKey | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    level: 'Beginner',
    motivation: '',
    availability: 'both',
  });

  useEffect(() => {
    setTimeout(() => setIsRevealed(true), 100);
    document.body.classList.add('theme-paper');
    return () => { document.body.classList.remove('theme-paper'); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !selected) {
      alert('Please fill the required fields and pick a workshop.');
      return;
    }
    setProcessing(true);
    setError(false);
    try {
      const workshop = WORKSHOPS.find(w => w.key === selected)!;
      await dataService.createInboxMessage({
        type: 'academy',
        sender: form.name,
        email: form.email,
        content: `ACADEMY PRE-REGISTRATION — Workshop: ${workshop.title} · Level: ${form.level} · Availability: ${form.availability} · Phone: ${form.phone || '-'} · Motivation: ${form.motivation || '-'}`,
        metadata: { source: 'academy-workshop', ...form, workshop: selected, workshopTitle: workshop.title },
      });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setError(true);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink pb-24 grain">
      <SEO
        titleKey="MAT32 Academy · Workshops in Ruzafa, Valencia"
        descriptionKey="Audiovisual production, live performing and DJ workshops at MAT32. English-speaking sessions, small groups, hands-on learning in our Hi-Fi studio in Ruzafa."
      />

      {/* HERO */}
      <section className="container mx-auto px-6 md:px-10 pt-12 md:pt-16 pb-10 hairline-b">
        <div className={`transition-all duration-1000 ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="mono-tag flex items-center gap-2" style={{ color: '#c8462a' }}>
            <GraduationCap size={12} /> MAT32 ACADEMY
          </div>
          <h1 className="display mt-3" style={{ fontSize: 'clamp(54px, 9vw, 132px)', lineHeight: 0.85 }}>
            Learn. <span style={{ color: '#c8462a' }}>Build.</span> Play.
          </h1>
          <p className="serif-italic text-2xl text-ink-soft mt-4 max-w-2xl leading-snug">
            Small-group workshops in audiovisual production, live performing and DJ craft. English-speaking. Hands-on. Hi-Fi studio, Ruzafa.
          </p>
          <div className="flex flex-wrap gap-2 mt-8">
            <a href="#workshops" className="bg-bermellon text-paper px-5 py-3 mono-tag hover:bg-ink transition-colors">EXPLORE WORKSHOPS →</a>
            <a href="#register" className="hairline px-5 py-3 mono-tag hover:bg-ink hover:text-paper transition-colors">PRE-REGISTER</a>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 mono-tag text-ink-soft">
            <div className="flex items-center gap-2"><Globe2 size={12} className="text-bermellon" /> ENGLISH</div>
            <div className="flex items-center gap-2"><Calendar size={12} className="text-bermellon" /> TUE / WED</div>
            <div className="flex items-center gap-2"><Clock size={12} className="text-bermellon" /> 18:00 – 20:00</div>
            <div className="flex items-center gap-2"><Users size={12} className="text-bermellon" /> MAX 8 STUDENTS</div>
          </div>
        </div>
      </section>

      {submitted && (
        <div className="container mx-auto px-6 md:px-10 pt-10">
          <div className="max-w-3xl mx-auto hairline p-6 bg-paper-2 text-center">
            <CheckCircle className="w-10 h-10 text-bermellon mx-auto mb-2" />
            <h3 className="display text-2xl">You're on the list.</h3>
            <p className="serif-italic text-ink-soft mt-2 text-base">We'll reach out on <b className="text-ink not-italic">{form.email}</b> with schedule, price and next steps within 48h.</p>
          </div>
        </div>
      )}

      {/* WORKSHOPS */}
      <section id="workshops" className="container mx-auto px-6 md:px-10 py-16 md:py-20 hairline-b max-w-7xl">
        <div className="mb-10">
          <div className="mono-tag flex items-center gap-2" style={{ color: '#c8462a' }}>
            <Sparkles size={12} /> THREE TRACKS
          </div>
          <h2 className="display mt-2" style={{ fontSize: 'clamp(40px, 6vw, 84px)', lineHeight: 0.9 }}>
            Pick your <span style={{ color: '#c8462a' }}>track.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-2">
          {WORKSHOPS.map(w => {
            const Icon = w.icon;
            const isSelected = selected === w.key;
            return (
              <button
                key={w.key}
                onClick={() => { setSelected(w.key); document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' }); }}
                className={`group text-left relative p-7 hairline transition-colors overflow-hidden ${isSelected ? 'bg-bermellon text-paper' : 'bg-paper hover:bg-ink hover:text-paper'}`}
              >
                <div className="flex items-start justify-between mb-5">
                  <Icon className="w-10 h-10" strokeWidth={1.5} />
                  <span className="mono-tag !text-[9px] hairline px-2 py-1 group-hover:hairline-ink">{w.level}</span>
                </div>
                <h3 className="display text-2xl md:text-3xl">{w.title}</h3>
                <p className="mono-tag mt-2">{w.subtitle}</p>
                <p className="serif-italic text-base mt-4 leading-snug opacity-90">{w.description}</p>
                <div className="hairline-t mt-5 pt-4 space-y-1.5 group-hover:border-paper/30">
                  {w.modules.map((m, i) => (
                    <div key={i} className="flex items-start gap-2 mono-tag !text-[10px] !tracking-[0.15em] !normal-case opacity-85">
                      <span className="opacity-60">//</span> {m}
                    </div>
                  ))}
                </div>
                <div className="mt-5 mono-tag">
                  {isSelected ? 'SELECTED ✓' : 'PICK THIS →'}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* MENTORS */}
      <section className="bg-ink text-paper py-16 md:py-20 hairline-b">
        <div className="container mx-auto px-6 md:px-10 max-w-7xl">
          <div className="mb-10">
            <div className="mono-tag flex items-center gap-2" style={{ color: '#d8ff5a' }}>
              <Award size={12} /> MENTORS
            </div>
            <h2 className="display mt-2 text-paper" style={{ fontSize: 'clamp(40px, 6vw, 84px)', lineHeight: 0.9 }}>
              Your <span style={{ color: '#c8462a' }}>guides.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-2">
            {MENTORS.map((m, idx) => (
              <div key={idx} className={`relative p-7 hairline-ink overflow-hidden ${m.confirmed ? 'bg-ink-2' : 'bg-ink-2 opacity-65'}`}>
                {m.confirmed && <div className="absolute top-0 right-0 bg-bermellon text-paper mono-tag !text-[9px] px-3 py-1">LEAD</div>}
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-16 h-16 flex items-center justify-center display text-2xl ${m.confirmed ? 'bg-bermellon text-paper' : 'hairline-ink text-paper/40'}`}>
                    {m.confirmed ? m.name.slice(0, 2) : '?'}
                  </div>
                  <div>
                    <h3 className="display text-2xl text-paper">{m.name}</h3>
                    <p className="mono-tag mt-1" style={{ color: '#c8462a' }}>{m.role}</p>
                  </div>
                </div>
                <p className={`serif-italic text-base leading-snug mb-5 ${m.confirmed ? 'text-paper/70' : 'text-paper/45'}`}>{m.bio}</p>
                <div className="flex flex-wrap gap-1.5">
                  {m.tags.map((t, i) => (
                    <span key={i} className="mono-tag !text-[9px] hairline-ink px-2 py-1 text-paper/65">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REGISTRATION */}
      <section id="register" className="container mx-auto px-6 md:px-10 py-16 md:py-20 max-w-3xl">
        <div className="mb-10">
          <div className="mono-tag flex items-center gap-2" style={{ color: '#c8462a' }}>
            <Users size={12} /> PRE-REGISTER
          </div>
          <h2 className="display mt-2" style={{ fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 0.9 }}>
            Save your <span style={{ color: '#c8462a' }}>seat.</span>
          </h2>
          <p className="serif-italic text-ink-soft text-lg mt-3 max-w-xl leading-snug">
            Small groups, first-come basis. Pre-registration is free — we'll confirm schedule and price before you commit.
          </p>
        </div>

        {!submitted && (
          <form onSubmit={handleSubmit} className="space-y-5 p-6 md:p-8 hairline bg-paper-2">
            {error && (
              <div className="flex items-center gap-2 p-3 hairline bg-bermellon/10 mono-tag !text-[10px]" style={{ color: '#c8462a' }}>
                <AlertCircle size={14} /> SOMETHING WENT WRONG. TRY AGAIN.
              </div>
            )}

            <div>
              <label className="mono-tag !text-[9px] block mb-2" style={{ color: '#c8462a' }}>CHOOSE WORKSHOP *</label>
              <div className="grid grid-cols-3 gap-2">
                {WORKSHOPS.map(w => (
                  <button key={w.key} type="button" onClick={() => setSelected(w.key)}
                    className={`p-3 mono-tag !text-[10px] transition-colors ${selected === w.key ? 'bg-bermellon text-paper' : 'hairline hover:bg-ink hover:text-paper'}`}>
                    {w.key === 'audiovisual' ? 'AUDIOVISUAL' : w.key === 'live' ? 'LIVE' : 'DJ'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="mono-tag !text-[9px] block mb-2" style={{ color: '#c8462a' }}>NAME *</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-paper hairline p-3 text-ink mono-tag !text-[11px] !tracking-[0.15em] !normal-case outline-none focus:border-bermellon transition-colors" />
              </div>
              <div>
                <label className="mono-tag !text-[9px] block mb-2" style={{ color: '#c8462a' }}>EMAIL *</label>
                <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-paper hairline p-3 text-ink mono-tag !text-[11px] !tracking-[0.15em] !normal-case outline-none focus:border-bermellon transition-colors" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="mono-tag !text-[9px] block mb-2" style={{ color: '#c8462a' }}>PHONE</label>
                <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-paper hairline p-3 text-ink mono-tag !text-[11px] !tracking-[0.15em] !normal-case outline-none focus:border-bermellon transition-colors" />
              </div>
              <div>
                <label className="mono-tag !text-[9px] block mb-2" style={{ color: '#c8462a' }}>YOUR LEVEL</label>
                <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}
                  className="w-full bg-paper hairline p-3 text-ink mono-tag !text-[11px] !normal-case outline-none focus:border-bermellon transition-colors">
                  <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mono-tag !text-[9px] block mb-2" style={{ color: '#c8462a' }}>AVAILABILITY</label>
              <div className="grid grid-cols-3 gap-2">
                {[{ key: 'tuesday', label: 'TUE 18–20H' }, { key: 'wednesday', label: 'WED 18–20H' }, { key: 'both', label: 'BOTH DAYS' }].map(o => (
                  <button key={o.key} type="button" onClick={() => setForm({ ...form, availability: o.key })}
                    className={`p-3 mono-tag !text-[10px] transition-colors ${form.availability === o.key ? 'bg-bermellon text-paper' : 'hairline hover:bg-ink hover:text-paper'}`}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mono-tag !text-[9px] block mb-2" style={{ color: '#c8462a' }}>WHY ARE YOU JOINING? (OPTIONAL)</label>
              <textarea rows={4} value={form.motivation} onChange={e => setForm({ ...form, motivation: e.target.value })}
                className="w-full bg-paper hairline p-3 text-ink serif-italic text-base outline-none focus:border-bermellon resize-none transition-colors leading-snug"
                placeholder="A few lines about your background and what you want to learn." />
            </div>

            <button type="submit" disabled={processing}
              className="w-full bg-bermellon text-paper py-4 mono-tag !text-[12px] !tracking-[0.5em] hover:bg-ink transition-colors disabled:opacity-50 flex items-center justify-center gap-3">
              {processing ? <><Loader2 className="animate-spin" size={16} /> SENDING…</> : '→ PRE-REGISTER'}
            </button>

            <p className="text-center mono-tag text-ink-soft">FREE PRE-REGISTRATION · NO PAYMENT YET</p>
          </form>
        )}
      </section>
    </div>
  );
};
