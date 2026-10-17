import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Music, CalendarDays, Clock, ChevronLeft, Disc3, Radio, ListMusic } from 'lucide-react';
import { SEO } from '../components/SEO';

const DAY_NS = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
const MONTH_NS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

interface ThankYouState {
  artistName: string;
  genres: string[];
  date: string;
  slot: string;
  slotLabel: string;
  streetRadio: boolean;
  vinyles: string;
}

const dateLabel = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return `${DAY_NS[dt.getDay()]} ${dt.getDate()} ${MONTH_NS[dt.getMonth()]}`;
};

export const OpenDecksGracias: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const s = (location.state as ThankYouState | null) ?? null;

  React.useEffect(() => {
    document.body.classList.add('theme-ink');
    return () => { document.body.classList.remove('theme-ink'); };
  }, []);

  // Sin state (acceso directo): mandar de vuelta al formulario.
  if (!s || !s.artistName) {
    return (
      <div className="min-h-screen bg-paper text-ink pt-24 pb-24" style={{ background: '#0c0c0c' }}>
        <div className="max-w-md mx-auto px-5 text-center">
          <SEO titleKey="Open Decks · MAT32 Valencia" descriptionKey="Solicita tu sesión de Open Decks en MAT32." />
          <h1 className="display text-3xl text-paper tracking-tight mb-4">NO ENCONTRAMOS TU SOLICITUD</h1>
          <p className="serif-italic text-paper/50 mb-8">Rellena el formulario y te llevaremos aquí al enviar.</p>
          <Link to="/open-decks" className="mono-tag hairline px-6 py-3 text-paper hover:bg-paper hover:text-black transition-colors inline-flex items-center gap-2">
            <ChevronLeft size={14} /> VOLVER A OPEN DECKS
          </Link>
        </div>
      </div>
    );
  }

  const statusChip = (
    <span className="mono-tag !text-[9px] px-2 py-1 text-paper/50 border border-paper/20">PENDIENTE</span>
  );

  return (
    <div className="min-h-screen bg-black text-ink pb-24" style={{ background: '#0c0c0c' }}>
      <SEO titleKey="Gracias · Open Decks · MAT32 Valencia" descriptionKey="Solicitud enviada. Esto es lo que pasa ahora." />

      <div className="max-w-4xl mx-auto px-5 md:px-8 pt-24">
        <div className="flex items-center gap-3 mb-10">
          <CheckCircle className="w-9 h-9 text-bermellon" style={{ color: '#d8ff5a' }} />
          <div>
            <h1 className="display text-4xl md:text-5xl text-paper tracking-tight">GRACIAS, <span style={{ color: '#d8ff5a' }}>{s.artistName.toUpperCase()}</span>.</h1>
            <p className="serif-italic text-paper/50 mt-1">Tu solicitud está en la lista. Esto es lo que pasa ahora:</p>
          </div>
        </div>

        {/* PROCESO */}
        <div className="grid md:grid-cols-3 gap-px bg-paper/10 hairline mb-14">
          {[
            { n: '01', t: 'LA REVISAMOS', d: 'El equipo de programación escucha tu sesión y mira que encaje con la rotación de los viernes.' },
            { n: '02', t: 'TE CONFIRMAMOS', d: 'Si hay hueco, te escribimos por email con la fecha y el slot, y marcamos tu sesión como CONFIRMADO o PENDIENTE. Automático en cuanto lo aprobemos.' },
            { n: '03', t: 'PINCHAS', d: 'Solo vinilo · Altec A7 · Technics 1210 · Rotary. Puedes usar los discos de la tienda.' },
          ].map(st => (
            <div key={st.n} className="bg-black p-6">
              <div className="mono-tag text-[10px] mb-6" style={{ color: '#d8ff5a' }}>{st.n}</div>
              <div className="display text-lg text-paper tracking-tight mb-3">{st.t}</div>
              <p className="serif-italic text-paper/50 text-sm leading-relaxed">{st.d}</p>
            </div>
          ))}
        </div>

        {/* PRÓXIMO LINEUP · resumen de la solicitud validada */}
        <div className="mb-6">
          <div className="flex items-baseline gap-3 mb-4">
            <h2 className="display text-2xl text-paper tracking-tight">PRÓXIMO <span style={{ color: '#d8ff5a' }}>LINEUP</span></h2>
            <div className="h-px flex-1 bg-paper/10" />
          </div>
          <div className="hairline-lime divide-y divide-paper/10">
            <div className="flex flex-wrap items-center gap-2 px-5 py-4">
              <Music size={13} className="text-paper/40" />
              <span className="mono-tag text-paper/40">DJ / ARTISTA</span>
              <span className="ml-auto font-wordmark text-lg text-paper tracking-tight">{s.artistName.toUpperCase()}</span>
              {statusChip}
            </div>
            <div className="flex flex-wrap items-center gap-2 px-5 py-4">
              <Disc3 size={13} className="text-paper/40" />
              <span className="mono-tag text-paper/40">ESTILOS</span>
              <span className="ml-auto mono-tag !text-[11px] text-paper">{s.genres.join(' · ')}</span>
              {statusChip}
            </div>
            {s.vinyles && (
              <div className="flex flex-wrap items-center gap-2 px-5 py-4">
                <ListMusic size={13} className="text-paper/40" />
                <span className="mono-tag text-paper/40">3 DISCOS</span>
                <span className="ml-auto mono-tag !text-[11px] text-paper whitespace-pre-line text-right">{s.vinyles}</span>
                {statusChip}
              </div>
            )}
            {s.date && (
              <div className="flex flex-wrap items-center gap-2 px-5 py-4">
                <CalendarDays size={13} className="text-paper/40" />
                <span className="mono-tag text-paper/40">FECHA</span>
                <span className="ml-auto mono-tag !text-[11px] text-paper">{dateLabel(s.date)}</span>
                {statusChip}
              </div>
            )}
            {s.slotLabel && s.slotLabel !== '—' && (
              <div className="flex flex-wrap items-center gap-2 px-5 py-4">
                <Clock size={13} className="text-paper/40" />
                <span className="mono-tag text-paper/40">HORA</span>
                <span className="ml-auto mono-tag !text-[11px] text-paper">{s.slotLabel}</span>
                {statusChip}
              </div>
            )}
            {s.streetRadio && (
              <div className="flex flex-wrap items-center gap-2 px-5 py-4">
                <Radio size={13} style={{ color: '#d8ff5a' }} />
                <span className="mono-tag text-paper/40">STREET RADIO</span>
                <span className="ml-auto mono-tag !text-[11px] text-paper">Grabación Green Booth pendiente de aprobación</span>
                {statusChip}
              </div>
            )}
          </div>
        </div>

        <p className="serif-italic text-paper/40 text-sm mb-10">Tu email y teléfono quedan solo para el equipo de MAT32. Aquí no se muestran.</p>

        <button
          onClick={() => navigate('/open-decks')}
          className="mono-tag hairline px-6 py-3 text-paper hover:bg-paper hover:text-black transition-colors inline-flex items-center gap-2"
        >
          <ChevronLeft size={14} /> VOLVER A OPEN DECKS
        </button>
      </div>
    </div>
  );
};