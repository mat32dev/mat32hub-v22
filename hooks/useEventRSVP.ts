
import { useState, useEffect, useCallback } from 'react';
import { dataService } from '../services/dataService';

const NAME_KEY  = 'mat32_user_name';
const RSVPS_KEY = 'mat32_rsvps_cache';

function getCachedRSVPs(): string[] {
  try { return JSON.parse(localStorage.getItem(RSVPS_KEY) || '[]'); }
  catch { return []; }
}

function setCachedRSVP(eventId: string, active: boolean) {
  const current = getCachedRSVPs();
  const updated = active
    ? current.includes(eventId) ? current : [...current, eventId]
    : current.filter(id => id !== eventId);
  localStorage.setItem(RSVPS_KEY, JSON.stringify(updated));
}

export const useEventRSVP = (eventId: string) => {
  // Inicializar desde caché local → aro verde instantáneo sin esperar API
  const [isAttending, setIsAttending] = useState(() => getCachedRSVPs().includes(eventId));
  const [guestList, setGuestList] = useState<string[]>([]);
  const [userName, setUserName] = useState(localStorage.getItem(NAME_KEY) || '');

  const loadEventData = useCallback(async () => {
    const rsvps = await dataService.getUserRSVPs();
    const attending = rsvps.includes(eventId);
    setIsAttending(attending);
    setCachedRSVP(eventId, attending); // sincronizar caché con servidor
    const list = await dataService.getEventGuestList(eventId);
    setGuestList(list.map(g => g.name));
  }, [eventId]);

  useEffect(() => {
    loadEventData();
    const handleSync = () => loadEventData();
    window.addEventListener('mat32_data_changed', handleSync);
    return () => window.removeEventListener('mat32_data_changed', handleSync);
  }, [loadEventData]);

  const toggleRSVP = async (active: boolean, name?: string) => {
    const finalName = name || userName;
    if (!finalName) return false;

    if (finalName !== userName) {
      localStorage.setItem(NAME_KEY, finalName);
      setUserName(finalName);
    }

    // Actualizar estado local y caché inmediatamente → aro verde al instante
    setIsAttending(active);
    setCachedRSVP(eventId, active);
    setGuestList(prev =>
      active
        ? prev.includes(finalName) ? prev : [...prev, finalName]
        : prev.filter(n => n !== finalName)
    );

    await dataService.toggleRSVP(eventId, finalName, active);
    return true;
  };

  return {
    isAttending,
    guestList,
    userName,
    toggleRSVP,
    refresh: loadEventData
  };
};
