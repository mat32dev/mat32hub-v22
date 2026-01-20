
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

  // Fix: Added proper type casting and guards to handle InboxMessage vs MessageReply
  private simulateEmailDispatch(message: InboxMessage | MessageReply, originalMsg?: InboxMessage) {
    const isReply = !!originalMsg;
    const recipient = isReply ? originalMsg!.email : (message as InboxMessage).email;
    const msgType = isReply ? originalMsg!.type : (message as InboxMessage).type;
    const subject = isReply ? `RE: Mat32 Connection - ${msgType}` : `NUEVO LEAD Mat32: ${msgType || 'General'}`;

    console.group(`%c[GMAIL-DISPATCH] >>> ${recipient}`, 'color: #ffffff; background: #ea580c; font-weight: bold; padding: 4px; border-radius: 2px;');
    console.log(`%cAsunto: ${subject}`, 'color: #ea580c; font-weight: bold;');
    
    // Fix: Using type-safe access to content vs text property based on isReply state
    const messageContent = isReply ? (message as MessageReply).text : (message as InboxMessage).content;
    console.log(`%cContenido: ${messageContent}`, 'color: #fff;');
    
    if (!isReply && 'metadata' in message && (message as InboxMessage).metadata) {
       console.log('%cMetadatos:', 'color: #999;', (message as InboxMessage).metadata);
    }
    console.groupEnd();
  }

  // --- AUTH METHODS ---
  async authenticate(pin: string): Promise<boolean> {
    if (pin === '3232') {
      localStorage.setItem('mat32_admin_auth', 'true');
      return true;
    }
    return false;
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('mat32_admin_auth') === 'true';
  }

  logout() {
    localStorage.removeItem('mat32_admin_auth');
    window.dispatchEvent(new CustomEvent('mat32_data_changed'));
  }

  // --- INBOX & CRM METHODS ---
  async getInbox(): Promise<InboxMessage[]> { 
    return this.getLocalDB().inbox || []; 
  }

  async createInboxMessage(msg: Omit<InboxMessage, 'id' | 'date' | 'status' | 'replies'>) {
    const db = this.getLocalDB();
    const newMsg: InboxMessage = {
      ...msg,
      id: `msg_${Date.now()}`,
      date: new Date().toLocaleString(),
      status: 'pending',
      replies: []
    } as InboxMessage;
    db.inbox = [newMsg, ...db.inbox];
    this.saveLocalDB(db);
    this.simulateEmailDispatch(newMsg);
  }

  async addReplyToMessage(msgId: string, text: string) {
    const db = this.getLocalDB();
    const idx = db.inbox.findIndex((m: InboxMessage) => m.id === msgId);
    if (idx !== -1) {
      const original = db.inbox[idx];
      const reply: MessageReply = {
        id: `reply_${Date.now()}`,
        sender: 'admin',
        text,
        timestamp: new Date().toLocaleString()
      };
      if (!original.replies) original.replies = [];
      original.replies.push(reply);
      original.status = 'read';
      this.saveLocalDB(db);
      this.simulateEmailDispatch(reply, original);
    }
  }

  async deleteMessage(id: string) {
    const db = this.getLocalDB();
    db.inbox = db.inbox.filter((m: InboxMessage) => m.id !== id);
    this.saveLocalDB(db);
  }

  async updateMessageStatus(id: string, status: 'pending' | 'read' | 'archived') {
    const db = this.getLocalDB();
    const idx = db.inbox.findIndex((m: InboxMessage) => m.id === id);
    if (idx !== -1) {
      db.inbox[idx].status = status;
      this.saveLocalDB(db);
    }
  }

  // --- DATA ACCESS METHODS ---
  async getEvents(): Promise<Event[]> { return this.getLocalDB().events || []; }
  
  // Fix: Added getEventById method for detail views
  async getEventById(id: string): Promise<Event | null> {
    const events = await this.getEvents();
    return events.find(e => e.id === id) || null;
  }

  async getRecords(): Promise<VinylRecord[]> { return this.getLocalDB().records || []; }
  
  // Fix: Added getRecordById method for detail views
  async getRecordById(id: string): Promise<VinylRecord | null> {
    const records = await this.getRecords();
    return records.find(r => r.id === id) || null;
  }

  async getCommunityPosts(): Promise<Post[]> { return this.getLocalDB().posts || []; }
  
  // Fix: Added getPostById method for detail views
  async getPostById(id: string): Promise<Post | null> {
    const posts = await this.getCommunityPosts();
    return posts.find(p => p.id === id) || null;
  }

  async getSelectors(onlyApproved = false): Promise<SelectorSubmission[]> { 
    const selectors = this.getLocalDB().selectors || [];
    if (onlyApproved) return selectors.filter((s: SelectorSubmission) => s.status === 'approved');
    return selectors;
  }
  
  // Fix: Added createPost method to allow community participation
  async createPost(post: Omit<Post, 'id' | 'likes' | 'comments' | 'timestamp'>) {
    const db = this.getLocalDB();
    const newPost: Post = {
      ...post,
      id: `post_${Date.now()}`,
      likes: 0,
      comments: [],
      timestamp: 'Ahora mismo'
    };
    db.posts = [newPost, ...db.posts];
    this.saveLocalDB(db);
  }

  // Fix: Added deleteRecord method for admin dashboard
  async deleteRecord(id: string) {
    const db = this.getLocalDB();
    db.records = db.records.filter((r: VinylRecord) => r.id !== id);
    this.saveLocalDB(db);
  }

  // Fix: Added deleteEvent method for admin dashboard
  async deleteEvent(id: string) {
    const db = this.getLocalDB();
    db.events = db.events.filter((e: Event) => e.id !== id);
    this.saveLocalDB(db);
  }

  async createSelector(selector: Omit<SelectorSubmission, 'id'>) {
    const db = this.getLocalDB();
    const newSelector = { ...selector, id: `s_${Date.now()}`, status: selector.status || 'pending' };
    db.selectors.push(newSelector);
    this.saveLocalDB(db);
  }
  async updateSelectorStatus(id: string, status: 'approved' | 'rejected' | 'pending') {
    const db = this.getLocalDB();
    const idx = db.selectors.findIndex((s: SelectorSubmission) => s.id === id);
    if (idx !== -1) {
      db.selectors[idx].status = status;
      this.saveLocalDB(db);
    }
  }
  async deleteSelector(id: string) {
    const db = this.getLocalDB();
    db.selectors = db.selectors.filter((s: SelectorSubmission) => s.id !== id);
    this.saveLocalDB(db);
  }

  async getAdvancedAnalytics(): Promise<AnalyticsData> {
    const db = this.getLocalDB();
    const totalRev = (db.sales || []).reduce((acc: number, s: any) => acc + s.total, 0);
    const ticketSales = (db.sales || []).filter((s: any) => s.type === 'ticket').length;
    return {
      totalRevenue: totalRev,
      ticketSales: ticketSales,
      instagramStatus: { followers: 1240 },
      communityActiveUsers: (db.posts?.length || 0) * 3
    };
  }

  getConnectors(): ConnectorStatus[] {
    return [
      { id: '1', name: 'Stripe API', status: 'online', latency: '45ms' },
      { id: '2', name: 'Gmail Outbox', status: 'online', latency: '120ms' },
      { id: '3', name: 'Instagram Graph', status: 'warning', latency: '240ms' },
      { id: '4', name: 'Gemini LLM', status: 'online', latency: '150ms' }
    ];
  }

  async getEventGuestList(eventId: string): Promise<GuestEntry[]> {
    const db = this.getLocalDB();
    return (db.rsvps && db.rsvps[eventId]) ? db.rsvps[eventId] : [];
  }

  async toggleCheckIn(eventId: string, guestName: string) {
    const db = this.getLocalDB();
    const list = (db.rsvps && db.rsvps[eventId]) ? db.rsvps[eventId] : [];
    const idx = list.findIndex((g: GuestEntry) => g.name === guestName);
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

  async recordSale(sale: any) {
    const db = this.getLocalDB();
    if (!db.sales) db.sales = [];
    db.sales = [sale, ...db.sales];
    this.saveLocalDB(db);
    this.createInboxMessage({
      type: 'sale',
      sender: 'System Checkout',
      email: 'sales@mat32.com',
      content: `Venta: €${sale.total.toFixed(2)}. ${sale.items.length} ítems.`,
      metadata: sale
    });
  }

  async createBooking(booking: any) {
    return this.createInboxMessage({
      type: 'booking',
      sender: booking.name,
      email: booking.email,
      content: `Reserva para ${booking.guests} pax: ${booking.date} @ ${booking.time}.`,
      metadata: booking
    });
  }

  // Fix: Added getUserRSVPs method to retrieve events the user is attending
  async getUserRSVPs(): Promise<string[]> {
    const userName = localStorage.getItem('mat32_user_name');
    if (!userName) return [];
    const db = this.getLocalDB();
    const attended: string[] = [];
    const rsvps = db.rsvps || {};
    Object.keys(rsvps).forEach(eventId => {
      const isAttending = rsvps[eventId].some((g: GuestEntry) => g.name === userName);
      if (isAttending) attended.push(eventId);
    });
    return attended;
  }

  // Fix: Added toggleRSVP method to manage event guest list status
  async toggleRSVP(eventId: string, userName: string, isAttending: boolean) {
    const db = this.getLocalDB();
    if (!db.rsvps) db.rsvps = {};
    if (!db.rsvps[eventId]) db.rsvps[eventId] = [];
    
    if (isAttending) {
      if (!db.rsvps[eventId].some((g: GuestEntry) => g.name === userName)) {
        db.rsvps[eventId].push({ name: userName, checkedIn: false });
      }
    } else {
      db.rsvps[eventId] = db.rsvps[eventId].filter((g: GuestEntry) => g.name !== userName);
    }
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

  isAuthenticatedAdmin(): boolean {
    return localStorage.getItem('mat32_admin_auth') === 'true';
  }
}

export const dataService = new DataService();
