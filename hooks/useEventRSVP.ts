
import { useState, useEffect, useCallback } from 'react';
import { dataService } from '../services/dataService';

export const useEventRSVP = (eventId: string) => {
  const [isAttending, setIsAttending] = useState(false);
  const [guestList, setGuestList] = useState<string[]>([]);
  const [userName, setUserName] = useState(localStorage.getItem('mat32_user_name') || '');

  const loadEventData = useCallback(async () => {
    const rsvps = await dataService.getUserRSVPs();
    setIsAttending(rsvps.includes(eventId));
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
      localStorage.setItem('mat32_user_name', finalName);
      setUserName(finalName);
    }
    
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
