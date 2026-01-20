
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
  instagramStatus: { followers: number };
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

  private simulateEmailDispatch(message: InboxMessage | MessageReply, originalMsg?: InboxMessage) {
    const isReply = !!originalMsg;
    const recipient = isReply ? originalMsg!.email : (message as InboxMessage).email;
    const msgType = isReply ? originalMsg!.type : (message as InboxMessage).type;
    const subject = isReply ? `RE: Mat32 Connection - ${msgType}` : `NUEVO LEAD Mat32: ${msgType || 'General'}`;

    console.group(`%c[GMAIL-DISPATCH] >>> ${recipient}`, 'color: #ffffff; background: #ea580c; font-weight: bold; padding: 4px; border-radius: 2px;');
    console.log(`%cAsunto: ${subject}`, 'color: #ea580c; font-weight: bold;');
    const messageContent = isReply ? (message as MessageReply).text : (message as InboxMessage).content;
    console.log(`%cContenido: ${messageContent}`, 'color: #fff;');
    console.groupEnd();
  }

  // --- AUTH ---
  async authenticate(pin: string): Promise<boolean> {
    if (pin === '3232') {
      localStorage.setItem('mat32_admin_auth', 'true');
      return true;
    }
    return false;
  }
  isAuthenticated(): boolean { return localStorage.getItem('mat32_admin_auth') === 'true'; }
  logout() {
    localStorage.removeItem('mat32_admin_auth');
    window.dispatchEvent(new CustomEvent('mat32_data_changed'));
  }

  // --- INBOX ---
  async getInbox(): Promise<InboxMessage[]> { return this.getLocalDB().inbox || []; }
  async createInboxMessage(msg: Omit<InboxMessage, 'id' | 'date' | 'status' | 'replies'>) {
    const db = this.getLocalDB();
    const newMsg: InboxMessage = { ...msg, id: `msg_${Date.now()}`, date: new Date().toLocaleString(), status: 'pending', replies: [] } as InboxMessage;
    db.inbox = [newMsg, ...db.inbox];
    this.saveLocalDB(db);
    this.simulateEmailDispatch(newMsg);
  }
  async addReplyToMessage(msgId: string, text: string) {
    const db = this.getLocalDB();
    const idx = db.inbox.findIndex((m: InboxMessage) => m.id === msgId);
    if (idx !== -1) {
      const reply = { id: `reply_${Date.now()}`, sender: 'admin', text, timestamp: new Date().toLocaleString() };
      if (!db.inbox[idx].replies) db.inbox[idx].replies = [];
      db.inbox[idx].replies.push(reply);
      db.inbox[idx].status = 'read';
      this.saveLocalDB(db);
      this.simulateEmailDispatch(reply as any, db.inbox[idx]);
    }
  }
  async deleteMessage(id: string) {
    const db = this.getLocalDB();
    db.inbox = db.inbox.filter((m: InboxMessage) => m.id !== id);
    this.saveLocalDB(db);
  }
  async updateMessageStatus(id: string, status: any) {
    const db = this.getLocalDB();
    const idx = db.inbox.findIndex((m: InboxMessage) => m.id === id);
    if (idx !== -1) { db.inbox[idx].status = status; this.saveLocalDB(db); }
  }

  // --- RECORDS ---
  async getRecords(): Promise<VinylRecord[]> { return this.getLocalDB().records || []; }
  async getRecordById(id: string): Promise<VinylRecord | null> {
    return (await this.getRecords()).find(r => r.id === id) || null;
  }
  async createRecord(record: Omit<VinylRecord, 'id'>) {
    const db = this.getLocalDB();
    const newRecord = { ...record, id: `r_${Date.now()}` };
    db.records = [newRecord, ...db.records];
    this.saveLocalDB(db);
  }
  async updateRecord(record: VinylRecord) {
    const db = this.getLocalDB();
    const idx = db.records.findIndex((r: VinylRecord) => r.id === record.id);
    if (idx !== -1) { db.records[idx] = record; this.saveLocalDB(db); }
  }
  async deleteRecord(id: string) {
    const db = this.getLocalDB();
    db.records = db.records.filter((r: VinylRecord) => r.id !== id);
    this.saveLocalDB(db);
  }

  // --- EVENTS ---
  async getEvents(): Promise<Event[]> { return this.getLocalDB().events || []; }
  async getEventById(id: string): Promise<Event | null> {
    return (await this.getEvents()).find(e => e.id === id) || null;
  }
  async createEvent(event: Omit<Event, 'id' | 'lineup' | 'attendees'>) {
    const db = this.getLocalDB();
    const newEvent = { ...event, id: `e_${Date.now()}`, lineup: [], attendees: 0 };
    db.events = [newEvent, ...db.events];
    this.saveLocalDB(db);
  }
  async updateEvent(event: Event) {
    const db = this.getLocalDB();
    const idx = db.events.findIndex((e: Event) => e.id === event.id);
    if (idx !== -1) { db.events[idx] = event; this.saveLocalDB(db); }
  }
  async deleteEvent(id: string) {
    const db = this.getLocalDB();
    db.events = db.events.filter((e: Event) => e.id !== id);
    this.saveLocalDB(db);
  }

  // --- SELECTORS ---
  async getSelectors(onlyApproved = false): Promise<SelectorSubmission[]> { 
    const selectors = this.getLocalDB().selectors || [];
    return onlyApproved ? selectors.filter((s: any) => s.status === 'approved') : selectors;
  }
  async createSelector(selector: any) {
    const db = this.getLocalDB();
    db.selectors.push({ ...selector, id: `s_${Date.now()}` });
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

  // --- COMMUNITY ---
  async getCommunityPosts(): Promise<Post[]> { return this.getLocalDB().posts || []; }
  async getPostById(id: string): Promise<Post | null> {
    return (await this.getCommunityPosts()).find(p => p.id === id) || null;
  }
  async createPost(post: any) {
    const db = this.getLocalDB();
    db.posts = [{ ...post, id: `p_${Date.now()}`, likes: 0, comments: [], timestamp: 'Ahora' }, ...db.posts];
    this.saveLocalDB(db);
  }

  // --- OTHER ---
  async getAdvancedAnalytics(): Promise<AnalyticsData> {
    const db = this.getLocalDB();
    const totalRev = (db.sales || []).reduce((acc: number, s: any) => acc + s.total, 0);
    return {
      totalRevenue: totalRev,
      ticketSales: (db.sales || []).filter((s: any) => s.type === 'ticket').length,
      instagramStatus: { followers: 1240 },
      communityActiveUsers: (db.posts?.length || 0) * 3
    };
  }
  getConnectors(): ConnectorStatus[] {
    return [
      { id: '1', name: 'Stripe API', status: 'online', latency: '45ms' },
      { id: '2', name: 'Gmail Outbox', status: 'online', latency: '120ms' },
      { id: '4', name: 'Gemini LLM', status: 'online', latency: '150ms' }
    ];
  }
  async getEventGuestList(id: string) { return (this.getLocalDB().rsvps || {})[id] || []; }
  async toggleCheckIn(eventId: string, guestName: string) {
    const db = this.getLocalDB();
    const list = db.rsvps[eventId] || [];
    const idx = list.findIndex((g: any) => g.name === guestName);
    if (idx !== -1) { list[idx].checkedIn = !list[idx].checkedIn; db.rsvps[eventId] = list; this.saveLocalDB(db); }
  }
  async addManualGuest(eventId: string, name: string) {
    const db = this.getLocalDB();
    if (!db.rsvps[eventId]) db.rsvps[eventId] = [];
    db.rsvps[eventId].push({ name, checkedIn: true });
    this.saveLocalDB(db);
  }
  async recordSale(sale: any) {
    const db = this.getLocalDB();
    db.sales = [sale, ...(db.sales || [])];
    this.saveLocalDB(db);
  }
  async createBooking(booking: any) {
    this.createInboxMessage({ type: 'booking', sender: booking.name, email: booking.email, content: `Mesa ${booking.guests}pax ${booking.date}`, metadata: booking });
  }
  getUserProfile() {
    const alias = localStorage.getItem('mat32_user_name');
    return alias ? { alias, color: '#ea580c' } : null;
  }
  setUserProfile(alias: string) {
    localStorage.setItem('mat32_user_name', alias);
    window.dispatchEvent(new CustomEvent('mat32_data_changed'));
  }
  async getUserRSVPs(): Promise<string[]> {
    const name = localStorage.getItem('mat32_user_name');
    if (!name) return [];
    const rsvps = this.getLocalDB().rsvps || {};
    return Object.keys(rsvps).filter(id => rsvps[id].some((g: any) => g.name === name));
  }
  async toggleRSVP(eventId: string, name: string, active: boolean) {
    const db = this.getLocalDB();
    if (!db.rsvps[eventId]) db.rsvps[eventId] = [];
    if (active) db.rsvps[eventId].push({ name, checkedIn: false });
    else db.rsvps[eventId] = db.rsvps[eventId].filter((g: any) => g.name !== name);
    this.saveLocalDB(db);
  }
}

export const dataService = new DataService();
