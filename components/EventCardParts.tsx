
import React from 'react';
import { Calendar, Headphones } from 'lucide-react';
import { Event } from '../types';

export const EventBadge: React.FC<{ label: string; active?: boolean; animate?: boolean }> = ({ label, active, animate }) => (
  <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.3em] shadow-xl border transition-all duration-500 ${
    active ? 'bg-emerald-500 border-white/20 text-white' : 'bg-mat-500 border-white/10 text-white'
  } ${animate ? 'animate-breathing' : ''}`}>
    {label}
  </div>
);

export const EventLineup: React.FC<{ lineup: Event['lineup'] }> = ({ lineup }) => (
  <div className="mt-6 pt-6 border-t border-mat-800/50">
    <h4 className="text-[9px] font-black text-mat-500 uppercase tracking-[0.5em] mb-4 flex items-center gap-2">
      <Headphones size={12} /> SELECTORS
    </h4>
    <div className="flex flex-wrap gap-x-8 gap-y-4">
      {lineup.map((artist, i) => (
        <div key={i} className="flex flex-col group/artist">
          <span className="text-sm font-black text-white uppercase tracking-tighter group-hover/artist:text-mat-500 transition-colors">
            {artist.name}
          </span>
          <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">
            {artist.role}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export const GoogleCalendarButton: React.FC<{ event: Event }> = ({ event }) => {
  const generateGCalUrl = () => {
    const title = encodeURIComponent(`Mat32: ${event.title}`);
    const details = encodeURIComponent(event.description);
    const location = encodeURIComponent("Mat32 Valencia - Calle Matías Perelló 32");
    
    const dateStr = event.date.replace(/-/g, '');
    const timeClean = event.time.replace(':', '');
    const start = `${dateStr}T${timeClean}00`;
    
    // Asumimos 4h de duración por defecto
    const endHour = (parseInt(event.time.split(':')[0]) + 4).toString().padStart(2, '0');
    const end = `${dateStr}T${endHour}${event.time.split(':')[1] || '00'}00`;
    
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${start}/${end}`;
  };

  return (
    <a 
      href={generateGCalUrl()} 
      target="_blank" 
      rel="noopener noreferrer"
      className="p-3 bg-mat-800 text-gray-500 hover:text-white rounded-xl border border-mat-700 transition-all hover:border-mat-500 flex items-center gap-2 group"
      title="Sincronizar con Google Calendar"
    >
      <Calendar size={14} className="group-hover:scale-110 transition-transform" />
      <span className="text-[8px] font-black uppercase tracking-widest">Añadir</span>
    </a>
  );
};
