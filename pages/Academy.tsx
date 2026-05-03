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

  useEffect(() => { setTimeout(() => setIsRevealed(true), 100); }, []);

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
    <div className="min-h-screen bg-paper text-ink text-mat-cream pb-24">
      <SEO
        titleKey="MAT32 Academy · Workshops in Ruzafa, Valencia"
        descriptionKey="Audiovisual production, live performing and DJ workshops at MAT32. English-speaking sessions, small groups, hands-on learning in our Hi-Fi studio in Ruzafa."
      />

      {/* Hero */}
      <div className="relative h-[70vh] flex items-center justify-center border-b border-mat-800 overflow-hidden bg-mat-950">
        <div className="absolute inset-0 z-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,_var(--tw-gradient-stops))] from-mat-500/30 via-transparent to-transparent" />
        <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_70%_80%,_var(--tw-gradient-stops))] from-purple-500/30 via-transparent to-transparent" />
        <div className={`container mx-auto px-6 text-center relative z-10 pt-20 transition-all duration-1000 ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="inline-flex items-center gap-2 mb-8 p-1 px-4 rounded-full bg-mat-900/80 border border-mat-500/50 text-mat-500 text-[10px] font-black uppercase tracking-[0.5em]">
            <GraduationCap className="w-4 h-4" /> MAT32 ACADEMY
          </div>
          <h1 className="text-[14vw] sm:text-[11vw] md:text-[9rem] font-black uppercase tracking-tighter text-white mb-6 font-exo leading-[0.85]">
            LEARN. <span className="text-mat-500">BUILD.</span> PLAY.
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg md:text-xl font-light leading-relaxed px-4 mb-8">
            Small-group workshops in audiovisual production, live performing and DJ craft. English-speaking. Hands-on. Hi-Fi studio, Ruzafa.
          </p>
          <a href="#workshops" className="inline-flex items-center gap-2 px-8 py-3 bg-mat-500 hover:bg-mat-400 text-black text-xs font-black uppercase tracking-[0.3em] rounded-full transition-all">
            EXPLORE WORKSHOPS →
          </a>

          {/* Info strip */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">
            <div className="flex items-center gap-2"><Globe2 size={14} className="text-mat-500" /> English</div>
            <div className="flex items-center gap-2"><Calendar size={14} className="text-mat-500" /> Tue / Wed</div>
            <div className="flex items-center gap-2"><Clock size={14} className="text-mat-500" /> 18:00 – 20:00</div>
            <div className="flex items-center gap-2"><Users size={14} className="text-mat-500" /> Max 8 students</div>
          </div>
        </div>
      </div>

      {/* Success banner */}
      {submitted && (
        <div className="container mx-auto px-6 pt-10">
          <div className="max-w-3xl mx-auto p-8 bg-green-500/10 border-2 border-green-500/40 rounded-3xl text-center">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-2">You're on the list</h3>
            <p className="text-gray-400">We'll reach out on <b className="text-white">{form.email}</b> with schedule, price and next steps within 48h.</p>
          </div>
        </div>
      )}

      {/* Workshops */}
      <section id="workshops" className="container mx-auto px-6 py-24 max-w-7xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 text-mat-500 font-black uppercase text-[10px] tracking-[0.5em]">
            <Sparkles size={12} /> THREE TRACKS
          </div>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white font-exo">Pick your track.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {WORKSHOPS.map(w => {
            const Icon = w.icon;
            const isSelected = selected === w.key;
            return (
              <button
                key={w.key}
                onClick={() => { setSelected(w.key); document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' }); }}
                className={`group text-left relative p-8 rounded-3xl border-2 transition-all duration-300 overflow-hidden ${isSelected ? 'border-mat-500 bg-mat-800/60 scale-[1.02]' : 'border-mat-800 bg-mat-950 hover:border-mat-700 hover:bg-mat-900'}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${w.gradient} opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none`} />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <Icon className={`w-12 h-12 ${isSelected ? 'text-mat-500' : 'text-white group-hover:text-mat-500'} transition-colors`} strokeWidth={1.5} />
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 border border-mat-700 rounded-full px-2 py-1">{w.level}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-2 font-exo leading-none">{w.title}</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-mat-500 mb-6">{w.subtitle}</p>
                  <p className="text-sm text-gray-400 leading-relaxed mb-6">{w.description}</p>
                  <div className="border-t border-mat-800 pt-4 space-y-1.5">
                    {w.modules.map((m, i) => (
                      <div key={i} className="flex items-start gap-2 text-[11px] text-gray-400">
                        <span className="text-mat-500 mt-0.5">//</span> {m}
                      </div>
                    ))}
                  </div>
                  <div className={`mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${isSelected ? 'text-mat-500' : 'text-gray-500 group-hover:text-mat-500'}`}>
                    {isSelected ? 'SELECTED ✓' : 'PICK THIS →'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Mentors */}
      <section className="bg-mat-950 py-24 border-y border-mat-800">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 text-mat-500 font-black uppercase text-[10px] tracking-[0.5em]">
              <Award size={12} /> MENTORS
            </div>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white font-exo">Your guides.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {MENTORS.map((m, idx) => (
              <div key={idx} className={`relative p-8 rounded-3xl border-2 overflow-hidden ${m.confirmed ? 'border-mat-500/40 bg-gradient-to-br from-mat-800 to-mat-900' : 'border-mat-800 bg-mat-900/50'}`}>
                {m.confirmed && <div className="absolute top-0 right-0 bg-mat-500 text-black text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl">Lead</div>}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center font-black text-2xl font-exo ${m.confirmed ? 'bg-mat-500 text-black' : 'bg-mat-800 text-gray-600 border border-dashed border-mat-700'}`}>
                    {m.confirmed ? m.name.slice(0, 2) : '?'}
                  </div>
                  <div>
                    <h3 className={`text-2xl font-black uppercase tracking-tight font-exo ${m.confirmed ? 'text-white' : 'text-gray-600'}`}>{m.name}</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-mat-500">{m.role}</p>
                  </div>
                </div>
                <p className={`text-sm leading-relaxed mb-6 ${m.confirmed ? 'text-gray-400' : 'text-gray-600 italic'}`}>{m.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {m.tags.map((t, i) => (
                    <span key={i} className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full border ${m.confirmed ? 'border-mat-700 text-gray-400' : 'border-mat-800 text-gray-600'}`}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration */}
      <section id="register" className="container mx-auto px-6 py-24 max-w-3xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 text-mat-500 font-black uppercase text-[10px] tracking-[0.5em]">
            <Users size={12} /> PRE-REGISTER
          </div>
          <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-white font-exo leading-none mb-4">Save your seat.</h2>
          <p className="text-gray-400 max-w-xl mx-auto">Small groups, first-come basis. Pre-registration is free — we'll confirm schedule and price before you commit.</p>
        </div>

        {!submitted && (
          <form onSubmit={handleSubmit} className="space-y-5 p-8 md:p-12 bg-mat-950 border border-mat-800 rounded-3xl">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                <AlertCircle size={16} /> Something went wrong. Try again in a moment.
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Choose workshop *</label>
              <div className="grid grid-cols-3 gap-2">
                {WORKSHOPS.map(w => (
                  <button
                    key={w.key}
                    type="button"
                    onClick={() => setSelected(w.key)}
                    className={`p-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${selected === w.key ? 'bg-mat-500 text-black border-mat-500' : 'bg-mat-900 text-gray-400 border-mat-800 hover:border-mat-700'}`}
                  >{w.key === 'audiovisual' ? 'Audiovisual' : w.key === 'live' ? 'Live' : 'DJ'}</button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Name *</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-mat-900 border border-mat-700 rounded-xl px-4 py-3 text-white" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Email *</label>
                <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full bg-mat-900 border border-mat-700 rounded-xl px-4 py-3 text-white" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Phone</label>
                <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full bg-mat-900 border border-mat-700 rounded-xl px-4 py-3 text-white" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Your level</label>
                <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} className="w-full bg-mat-900 border border-mat-700 rounded-xl px-4 py-3 text-white">
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Availability</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'tuesday', label: 'Tue 18–20h' },
                  { key: 'wednesday', label: 'Wed 18–20h' },
                  { key: 'both', label: 'Both days' },
                ].map(o => (
                  <button key={o.key} type="button" onClick={() => setForm({ ...form, availability: o.key })}
                    className={`p-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${form.availability === o.key ? 'bg-mat-500 text-black border-mat-500' : 'bg-mat-900 text-gray-400 border-mat-800 hover:border-mat-700'}`}>{o.label}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Why are you joining? (optional)</label>
              <textarea rows={3} value={form.motivation} onChange={e => setForm({ ...form, motivation: e.target.value })} className="w-full bg-mat-900 border border-mat-700 rounded-xl px-4 py-3 text-white" placeholder="A few lines about your background and what you want to learn..." />
            </div>

            <button type="submit" disabled={processing} className="w-full py-4 bg-mat-500 hover:bg-mat-400 disabled:opacity-40 text-black text-sm font-black uppercase tracking-[0.3em] rounded-full transition-all flex items-center justify-center gap-2">
              {processing ? <><Loader2 className="animate-spin" size={18} /> SENDING...</> : 'PRE-REGISTER →'}
            </button>

            <p className="text-center text-[10px] text-gray-600 font-bold uppercase tracking-widest">Free pre-registration · No payment required yet</p>
          </form>
        )}
      </section>
    </div>
  );
};
