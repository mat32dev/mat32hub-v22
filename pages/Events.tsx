
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Calendar as CalendarIcon, LayoutGrid, ChevronLeft, ChevronRight, Clock, Zap, Loader2, Disc, Filter } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { EventCard } from '../components/EventCard';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { useLanguage } from '../context/LanguageContext';
import { Event } from '../types';

export const Events: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isFiltersVisible, setIsFiltersVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Detectar categoría desde la URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const catParam = params.get('category');
    if (catParam) setSelectedCategory(catParam);
  }, [location.search]);

  const loadEvents = async () => {
    try {
      const data = await dataService.getEvents();
      setEvents(data);
    } catch (err) {
      console.error("Error loading events", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (window.innerWidth < 768) {
        if (currentScrollY > lastScrollY && currentScrollY > 150) {
          setIsFiltersVisible(false);
        } else {
          setIsFiltersVisible(true);
        }
      } else {
        setIsFiltersVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    loadEvents();
    window.addEventListener('mat32_data_changed', loadEvents);
    return () => window.removeEventListener('mat32_data_changed', loadEvents);
  }, []);

  const categories = useMemo(() => {
    const unique = new Set(events.map(e => e.category));
    return ['All', ...Array.from(unique)];
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            event.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, events]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const startingDayIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const getEventsForDay = (day: number) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dateString = `${year}-${month}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateString);
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: startingDayIndex }, (_, i) => i);

  return (
    <div className="min-h-screen bg-mat-900 text-mat-cream">
      <SEO titleKey="nav.events" descriptionKey="seo.events.description" />

      {/* Hero Header */}
      <div className="bg-mat-800 py-12 md:py-24 border-b border-mat-700 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 text-center md:text-left flex flex-col md:flex-row items-center gap-6 md:gap-12">
          <div className="relative">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-mat-900 border-2 border-mat-500 rounded-full flex items-center justify-center animate-pulse shadow-[0_0_30px_rgba(234,88,12,0.3)]">
               <Zap className="w-6 h-6 md:w-10 md:h-10 text-mat-500" />
            </div>
          </div>
          <div className="w-full">
            <h1 className="text-4xl sm:text-6xl md:text-9xl font-black uppercase tracking-tighter text-white mb-2 md:mb-4 leading-none font-exo text-glow">
              {t('events.title')}
            </h1>
            <p className="text-gray-400 max-w-2xl text-base md:text-xl font-light italic leading-relaxed">
              {t('events.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Controls Bar */}
        <div 
          className={`flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 md:mb-16 gap-6 bg-mat-900/95 backdrop-blur-xl sticky top-[80px] md:top-24 z-30 py-4 md:py-8 border-b border-mat-800 transition-all duration-300 ${isFiltersVisible ? 'translate-y-0 opacity-100' : 'md:translate-y-0 -translate-y-10 opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto'}`}
        >
          <div className="hidden sm:flex items-center gap-4 text-mat-500 font-black uppercase tracking-[0.4em] text-[9px] md:text-[10px]">
             <CalendarIcon className="w-4 h-4 md:w-6 md:h-6" /> {t('events.upcoming')}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="flex bg-mat-800 p-1 border border-mat-700 rounded-xl md:rounded-2xl">
              <button 
                onClick={() => setViewMode('list')}
                className={`flex-1 sm:flex-none px-4 md:px-8 py-2 md:py-3.5 flex items-center justify-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all rounded-lg md:rounded-xl ${viewMode === 'list' ? 'bg-mat-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
              >
                <LayoutGrid className="w-3 h-3 md:w-4 md:h-4" /> {t('events.view.list')}
              </button>
              <button 
                onClick={() => setViewMode('calendar')}
                className={`flex-1 sm:flex-none px-4 md:px-8 py-2 md:py-3.5 flex items-center justify-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all rounded-lg md:rounded-xl ${viewMode === 'calendar' ? 'bg-mat-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
              >
                <CalendarIcon className="w-3 h-3 md:w-4 md:h-4" /> {t('events.view.calendar')}
              </button>
            </div>

            <div className="flex gap-4 w-full lg:w-auto">
              <div className="relative flex-1 sm:w-64 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder={t('events.search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-mat-800 border-2 border-mat-700 text-white pl-10 pr-4 py-3 md:py-5 focus:outline-none focus:border-mat-500 transition-all uppercase text-[10px] md:text-[11px] font-black placeholder-gray-600 rounded-xl md:rounded-2xl"
                />
              </div>
              <div className="relative flex-1 sm:w-48">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-mat-500 w-4 h-4 pointer-events-none" />
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-mat-800 border-2 border-mat-700 pl-11 pr-8 py-3 md:py-5 text-white text-[9px] md:text-[11px] font-black uppercase outline-none focus:border-mat-500 cursor-pointer rounded-xl md:rounded-2xl appearance-none"
                >
                  {categories.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex flex-col items-center py-20 md:py-40 text-center">
             <Loader2 className="w-12 h-12 md:w-20 md:h-20 text-mat-500 animate-spin mb-4 md:mb-6" />
             <p className="text-[9px] md:text-[10px] font-black text-gray-600 uppercase tracking-widest">Sincronizando Ritmo...</p>
          </div>
        ) : viewMode === 'list' ? (
          filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:gap-16 animate-fade-in">
              {filteredEvents.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 md:py-40 border-2 md:border-4 border-dashed border-mat-800 rounded-[2rem] md:rounded-[4rem] bg-mat-800/10">
              <Disc className="w-16 h-16 md:w-24 md:h-24 text-mat-800 mx-auto mb-6 md:mb-8 animate-pulse" />
              <h3 className="text-2xl md:text-4xl font-black text-gray-700 uppercase tracking-tighter mb-4">{t('events.empty')}</h3>
              <button onClick={() => {setSearchTerm(''); setSelectedCategory('All'); navigate('/events');}} className="px-8 md:px-12 py-3 md:py-4 bg-mat-900 border-2 border-mat-700 text-mat-500 font-black uppercase text-[10px] md:text-xs tracking-widest rounded-xl hover:bg-mat-500 hover:text-white transition-all shadow-xl">
                {t('events.reset')}
              </button>
            </div>
          )
        ) : (
          <div className="animate-fade-in">
            {/* Calendar View... */}
            <div className="w-full">
              <div className="flex justify-between items-center mb-6 md:mb-12 bg-mat-800 p-4 md:p-10 border-2 border-mat-700 rounded-[1.5rem] md:rounded-[3rem] shadow-2xl">
                <button onClick={prevMonth} className="p-2 md:p-5 bg-mat-900 border-2 border-mat-700 hover:border-mat-500 hover:text-mat-500 text-white transition-all rounded-full"><ChevronLeft className="w-5 h-5 md:w-8 md:h-8" /></button>
                <h2 className="text-xl md:text-5xl font-black text-white uppercase tracking-tighter font-exo text-center">{monthName} <span className="text-mat-500">{year}</span></h2>
                <button onClick={nextMonth} className="p-2 md:p-5 bg-mat-900 border-2 border-mat-700 hover:border-mat-500 hover:text-mat-500 text-white transition-all rounded-full"><ChevronRight className="w-5 h-5 md:w-8 md:h-8" /></button>
              </div>
              <div className="grid grid-cols-7 gap-px bg-mat-700 border-2 md:border-4 border-mat-700 shadow-2xl rounded-[1rem] md:rounded-[3rem] overflow-hidden">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                  <div key={i} className="bg-mat-900 p-2 md:p-6 text-center text-[8px] md:text-[11px] font-black uppercase tracking-widest text-gray-500 border-b-2 border-mat-700"><span>{day}</span></div>
                ))}
                {emptyDays.map(i => <div key={`empty-${i}`} className="bg-mat-800/20 min-h-[60px] md:min-h-[180px]"></div>)}
                {days.map(day => {
                  const dayEvents = getEventsForDay(day);
                  const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();
                  return (
                    <div key={day} className={`bg-mat-800 min-h-[70px] md:min-h-[180px] p-1.5 md:p-6 border border-mat-700/50 hover:bg-mat-700/40 transition-all relative group overflow-hidden`}>
                      <div className={`text-[10px] md:text-sm font-black mb-1 md:mb-6 ${isToday ? 'bg-mat-500 text-white w-5 h-5 md:w-10 md:h-10 flex items-center justify-center rounded-full shadow-[0_0_20px_rgba(234,88,12,0.4)]' : 'text-gray-500'}`}>{day}</div>
                      <div className="space-y-1">
                        {dayEvents.map(event => (
                          <div key={event.id} className="bg-mat-900 border-l-2 md:border-l-4 border-mat-500 p-0.5 md:p-3 rounded-r-sm md:rounded-r-lg shadow-md">
                            <p className="text-[6px] md:text-[10px] font-black text-white truncate uppercase leading-tight">{event.title}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
