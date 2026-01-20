import { MOCK_EVENTS, MOCK_RECORDS, MOCK_POSTS, MOCK_SELECTORS } from '../constants.ts';
import { Event, VinylRecord, Post, SelectorSubmission, Comment, TradeMetadata } from '../types.ts';

export interface MessageReply {
  id: string;
  sender: 'admin' | 'user';
  text: string;
  timestamp: string;
}

export interface InboxMessage {
  id: string;
  type: 'lead' | 'artist' | 'booking' | 'sale' | 'general';
  sender: string;
  email: string;
  phone?: string;
  content: string;
  date: string;
  status: 'pending' | 'read' | 'archived';
  metadata?: any;
  replies?: MessageReply[];
}

export interface AnalyticsData {
  totalRevenue: number;
  ticketSales: number;
  leadsCount: number;
  visitsSimulated: number;
  communityActiveUsers: number;
}

export interface ConnectorStatus {
  id: string;
  name: string;
  status: 'online' | 'warning' | 'offline';
  latency: string;
}

export interface GuestEntry {
  name: string;
  checkedIn: boolean;
  timestamp?: string;
}

class DataService {
  private localKey = 'mat32_core_database_v26_crm';

  private getLocalDB() {
    try {
      const data = localStorage.getItem(this.localKey);
      if (!data) return this.initializeDefaultDB();
      return JSON.parse(data);
    } catch (e) {
      return this.initializeDefaultDB();
    }
  }

  private initializeDefaultDB() {
    const defaultDB = { 
      posts: MOCK_POSTS.map(p => ({ ...p, comments: [], likes: Math.floor(Math.random() * 50) })), 
      records: [...MOCK_RECORDS], 
      events: [...MOCK_EVENTS],
      selectors: MOCK_SELECTORS.map(s => ({ ...s, status: 'approved' })),
      inbox: [
        {
          id: 'initial_msg',
          type: 'general',
          sender: 'Mat32 System',
          email: 'core@mat32.com',
          content: 'Bienvenido al CRM Core de Mat32. Aquí verás todas las solicitudes de alquiler y cabina.',
          date: new Date().toLocaleString(),
          status: 'read',
          replies: []
        }
      ],
      rsvps: {} as Record<string, GuestEntry[]>,
      initialized: true,
      sales: []
    };
    this.saveLocalDB(defaultDB);
    return defaultDB;
  }

  private saveLocalDB(data: any) {
    localStorage.setItem(this.localKey, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('mat32_data_changed'));
  }

  // --- CRUD DISCOS ---
  async getRecords(): Promise<VinylRecord[]> { return this.getLocalDB().records || []; }
  
  // Fix: Added getRecordById to retrieve a single record for detail views
  async getRecordById(id: string): Promise<VinylRecord | null> {
    const records = await this.getRecords();
    return records.find(r => r.id === id) || null;
  }

  async createRecord(record: Omit<VinylRecord, 'id'>) {
    const db = this.getLocalDB();
    const newRecord = { ...record, id: `r_${Date.now()}` };
    db.records = [newRecord, ...db.records];
    this.saveLocalDB(db);
  }
  async updateRecord(record: VinylRecord) {
    const db = this.getLocalDB();
    const idx = db.records.findIndex((r: any) => r.id === record.id);
    if (idx !== -1) { db.records[idx] = record; this.saveLocalDB(db); }
  }
  async deleteRecord(id: string) {
    const db = this.getLocalDB();
    db.records = db.records.filter((r: any) => r.id !== id);
    this.saveLocalDB(db);
  }

  // --- CRUD EVENTOS ---
  async getEvents(): Promise<Event[]> { return this.getLocalDB().events || []; }
  
  // Fix: Added getEventById to retrieve a single event for detail views
  async getEventById(id: string): Promise<Event | null> {
    const events = await this.getEvents();
    return events.find(e => e.id === id) || null;
  }

  async createEvent(event: Omit<Event, 'id' | 'lineup' | 'attendees'>) {
    const db = this.getLocalDB();
    const newEvent = { ...event, id: `e_${Date.now()}`, lineup: [], attendees: 0 };
    db.events = [newEvent, ...db.events];
    this.saveLocalDB(db);
  }
  async updateEvent(event: Event) {
    const db = this.getLocalDB();
    const idx = db.events.findIndex((e: any) => e.id === event.id);
    if (idx !== -1) { db.events[idx] = event; this.saveLocalDB(db); }
  }
  async deleteEvent(id: string) {
    const db = this.getLocalDB();
    db.events = db.events.filter((e: any) => e.id !== id);
    this.saveLocalDB(db);
  }

  // --- CRM & INBOX ---
  async getInbox(): Promise<InboxMessage[]> { return this.getLocalDB().inbox || []; }
  async addReplyToMessage(msgId: string, text: string) {
    const db = this.getLocalDB();
    const idx = db.inbox.findIndex((m: any) => m.id === msgId);
    if (idx !== -1) {
      const reply: MessageReply = { id: `rep_${Date.now()}`, sender: 'admin', text, timestamp: new Date().toLocaleString() };
      if (!db.inbox[idx].replies) db.inbox[idx].replies = [];
      db.inbox[idx].replies.push(reply);
      db.inbox[idx].status = 'read';
      this.saveLocalDB(db);
    }
  }
  async updateMessageStatus(id: string, status: string) {
    const db = this.getLocalDB();
    const idx = db.inbox.findIndex((m: any) => m.id === id);
    if (idx !== -1) { db.inbox[idx].status = status; this.saveLocalDB(db); }
  }
  async deleteMessage(id: string) {
    const db = this.getLocalDB();
    db.inbox = db.inbox.filter((m: any) => m.id !== id);
    this.saveLocalDB(db);
  }
  async createInboxMessage(msg: any) {
    const db = this.getLocalDB();
    const newMsg = { ...msg, id: `msg_${Date.now()}`, date: new Date().toLocaleString(), status: 'pending', replies: [] };
    db.inbox = [newMsg, ...db.inbox];
    this.saveLocalDB(db);
  }

  // --- PUERTA (DOOR CONTROL) ---
  async getEventGuestList(id: string): Promise<GuestEntry[]> { 
    return (this.getLocalDB().rsvps || {})[id] || []; 
  }
  async toggleCheckIn(eventId: string, guestName: string) {
    const db = this.getLocalDB();
    if (!db.rsvps) db.rsvps = {};
    const list = db.rsvps[eventId] || [];
    const idx = list.findIndex((g: any) => g.name === guestName);
    if (idx !== -1) {
      list[idx].checkedIn = !list[idx].checkedIn;
      list[idx].timestamp = list[idx].checkedIn ? new Date().toLocaleTimeString() : undefined;
      db.rsvps[eventId] = list;
      this.saveLocalDB(db);
    }
  }
  async addManualGuest(eventId: string, name: string) {
    const db = this.getLocalDB();
    if (!db.rsvps) db.rsvps = {};
    if (!db.rsvps[eventId]) db.rsvps[eventId] = [];
    db.rsvps[eventId].push({ name, checkedIn: true, timestamp: new Date().toLocaleTimeString() });
    this.saveLocalDB(db);
  }

  // --- ANALYTICS ---
  async getAdvancedAnalytics(): Promise<AnalyticsData> {
    const db = this.getLocalDB();
    const sales = db.sales || [];
    return {
      totalRevenue: sales.reduce((acc: number, s: any) => acc + s.total, 0),
      ticketSales: sales.filter((s: any) => s.type === 'ticket').length,
      leadsCount: db.inbox.filter((m: any) => m.type !== 'sale').length,
      visitsSimulated: (db.inbox.length * 15) + (db.posts.length * 8),
      communityActiveUsers: db.posts.length * 3
    };
  }

  // --- SELECTORS ---
  // Fix: Updated getSelectors to handle an optional filter for approved status
  async getSelectors(approvedOnly: boolean = false) { 
    const selectors = this.getLocalDB().selectors || [];
    return approvedOnly ? selectors.filter((s: any) => s.status === 'approved') : selectors;
  }
  
  // Fix: Added createSelector to save new selector applications
  async createSelector(selector: any) {
    const db = this.getLocalDB();
    const newSelector = { ...selector, id: `s_${Date.now()}` };
    db.selectors = [newSelector, ...db.selectors];
    this.saveLocalDB(db);
  }

  async updateSelectorStatus(id: string, status: string) {
    const db = this.getLocalDB();
    const idx = db.selectors.findIndex((s: any) => s.id === id);
    if (idx !== -1) { db.selectors[idx].status = status; this.saveLocalDB(db); }
  }
  async deleteSelector(id: string) {
    const db = this.getLocalDB();
    db.selectors = db.selectors.filter((s: any) => s.id !== id);
    this.saveLocalDB(db);
  }

  // --- POSTS ---
  async getCommunityPosts() { return this.getLocalDB().posts || []; }
  
  // Fix: Added getPostById to retrieve a single community post for detail views
  async getPostById(id: string): Promise<Post | null> {
    const posts = await this.getCommunityPosts();
    return posts.find(p => p.id === id) || null;
  }

  async createPost(post: any) {
    const db = this.getLocalDB();
    db.posts = [{ ...post, id: `p_${Date.now()}`, timestamp: 'Ahora', likes: 0, comments: [] }, ...db.posts];
    this.saveLocalDB(db);
  }

  // --- AUTH ---
  async authenticate(pin: string) {
    if (pin === '3232') { localStorage.setItem('mat32_admin_auth', 'true'); return true; }
    return false;
  }
  isAuthenticated() { return localStorage.getItem('mat32_admin_auth') === 'true'; }
  logout() { localStorage.removeItem('mat32_admin_auth'); }

  getConnectors(): ConnectorStatus[] {
    return [
      { id: '1', name: 'Stripe API', status: 'online', latency: '42ms' },
      { id: '2', name: 'Gemini AI Hub', status: 'online', latency: '156ms' },
      { id: '3', name: 'Gmail SMTP', status: 'online', latency: '210ms' },
      { id: '4', name: 'Instagram Graph', status: 'warning', latency: '890ms' }
    ];
  }

  async recordSale(sale: any) {
    const db = this.getLocalDB();
    if (!db.sales) db.sales = [];
    db.sales.push(sale);
    this.saveLocalDB(db);
  }
  
  async createBooking(booking: any) {
    this.createInboxMessage({ type: 'booking', sender: booking.name, email: booking.email, content: `Reserva ${booking.guests}pax - ${booking.date}`, metadata: booking });
  }

  async getUserRSVPs() {
    const user = localStorage.getItem('mat32_user_name');
    if (!user) return [];
    const rsvps = this.getLocalDB().rsvps || {};
    return Object.keys(rsvps).filter(id => rsvps[id].some((g: any) => g.name === user));
  }
  
  async toggleRSVP(eventId: string, name: string, active: boolean) {
    const db = this.getLocalDB();
    if (!db.rsvps) db.rsvps = {};
    if (!db.rsvps[eventId]) db.rsvps[eventId] = [];
    if (active) db.rsvps[eventId].push({ name, checkedIn: false });
    else db.rsvps[eventId] = db.rsvps[eventId].filter((g: any) => g.name !== name);
    this.saveLocalDB(db);
  }

  getUserProfile() {
    const alias = localStorage.getItem('mat32_user_name');
    return alias ? { alias, color: '#ea580c' } : null;
  }
  setUserProfile(alias: string) {
    localStorage.setItem('mat32_user_name', alias);
    window.dispatchEvent(new CustomEvent('mat32_data_changed'));
  }
}

export const dataService = new DataService();