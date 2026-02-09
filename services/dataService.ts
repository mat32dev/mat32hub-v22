
import { Post, VinylRecord, Event, SelectorSubmission, InboxMessage, GalleryItem, Sale, MenuItem, MenuCategory, UserSession, UserRole } from '../types';
import { MOCK_EVENTS, MOCK_RECORDS, MOCK_POSTS, MOCK_SELECTORS, BAR_MENU } from '../constants';

class DataService {
  private localKey = 'mat32_matrix_production_v15.0'; // Versión 15.0: The Artist Legacy Edition
  private sessionKey = 'mat32_auth_session';

  constructor() {
    this.initDatabase();
  }

  private initDatabase() {
    const existingData = localStorage.getItem(this.localKey);
    
    if (!existingData) {
      const db = {
        posts: MOCK_POSTS.map(p => ({ ...p, id: p.id || `p_${Math.random().toString(36).substr(2, 9)}`, comments: [], likes: 12, timestamp: 'Reciente' })),
        records: MOCK_RECORDS, 
        events: MOCK_EVENTS.map(e => ({ ...e, id: e.id || `e_${Math.random().toString(36).substr(2, 9)}`, status: 'published' })),
        gallery: [
          { 
            id: 'g1', 
            title: 'Santuario Hi-Fi', 
            description: 'Vista principal de nuestro sistema Altec A7.', 
            imageUrl: 'https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/ac1a7472-de26-46de-37f3-7ec5509f5900/public', 
            tags: ['#hifi', '#booth'], 
            category: 'Local' 
          }
        ],
        selectors: MOCK_SELECTORS,
        inbox: [] as InboxMessage[],
        rsvps: {} as Record<string, {name: string}[]>,
        sales: [] as Sale[]
      };
      this.saveDB(db);
      
      const legacyKeys = [
        'mat32_matrix_production_v14.0',
        'mat32_matrix_production_v13.0',
        'mat32_matrix_production_v12.0',
        'mat32_matrix_production_v11.0',
        'mat32_matrix_production_v10.0',
        'mat32_matrix_production_v9.0',
        'mat32_matrix_production_v8.0',
        'mat32_matrix_production_v7.0',
        'mat32_matrix_production_v6.0',
        'mat32_matrix_production_v5.0',
        'mat32_matrix_production_v4.0',
        'mat32_matrix_production_v3.0',
        'mat32_matrix_production_v2.0',
        'mat32_matrix_production_v1.1',
        'mat32_matrix_production_v1'
      ];
      legacyKeys.forEach(k => localStorage.removeItem(k));
    }
  }

  private getDB() {
    try {
      return JSON.parse(localStorage.getItem(this.localKey) || '{}');
    } catch (e) {
      return {};
    }
  }

  private saveDB(data: any) {
    localStorage.setItem(this.localKey, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('mat32_data_changed', { detail: data }));
  }

  async login(email: string, pass: string): Promise<boolean> {
    let session: UserSession | null = null;
    const cleanPass = pass.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanEmail === 'hola@mat32.com' && cleanPass === 'mat32_access_2025') {
      session = { id: 'admin_master', role: 'ADMIN', name: 'Mat32 Manager', email: cleanEmail };
    } 
    else if (cleanEmail === 'admin@mat32.com' && cleanPass === 'mat32_admin') {
      session = { id: 'admin_1', role: 'ADMIN', name: 'Admin Backup', email: cleanEmail };
    }

    if (session) {
      localStorage.setItem(this.sessionKey, JSON.stringify(session));
      localStorage.setItem('mat32_user_name', session.name);
      window.dispatchEvent(new CustomEvent('mat32_data_changed'));
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem(this.sessionKey);
    window.dispatchEvent(new CustomEvent('mat32_data_changed'));
  }

  getSession(): UserSession | null {
    const s = localStorage.getItem(this.sessionKey);
    return s ? JSON.parse(s) : null;
  }

  isAuthenticated() { return !!this.getSession(); }

  async getEvents(): Promise<Event[]> { return this.getDB().events || []; }
  async getEventById(id: string) { return (await this.getEvents()).find(e => e.id === id); }
  
  async createEvent(event: Partial<Event>) {
    const db = this.getDB();
    const newEvent = { ...event, id: `e_${Date.now()}`, slug: (event.title || '').toLowerCase().replace(/\s+/g, '-'), attendees: 0, status: 'published', lineup: event.lineup || [], vibe: event.vibe || [], tags: event.tags || [] } as Event;
    if (!db.events) db.events = [];
    db.events.unshift(newEvent);
    this.saveDB(db);
    return newEvent;
  }

  async updateEvent(id: string, updates: Partial<Event>) {
    const db = this.getDB();
    const idx = db.events.findIndex((e: any) => e.id === id);
    if (idx > -1) { db.events[idx] = { ...db.events[idx], ...updates }; this.saveDB(db); }
  }

  async deleteEvent(id: string) {
    const db = this.getDB();
    db.events = db.events.filter((e: any) => e.id !== id);
    this.saveDB(db);
  }

  async getRecords(): Promise<VinylRecord[]> { return this.getDB().records || []; }
  async getRecordById(id: string) { return (await this.getRecords()).find(r => r.id === id); }

  async createRecord(record: Partial<VinylRecord>) {
    const db = this.getDB();
    const newRecord = { ...record, id: `v_${Date.now()}`, stock: record.stock || 1, status: 'published', tags: record.tags || [], slug: (record.title || '').toLowerCase().replace(/\s+/g, '-') } as VinylRecord;
    if (!db.records) db.records = [];
    db.records.unshift(newRecord);
    this.saveDB(db);
    return newRecord;
  }

  async deleteRecord(id: string) {
    const db = this.getDB();
    db.records = db.records.filter((r: any) => r.id !== id);
    this.saveDB(db);
  }

  async getSelectors(): Promise<SelectorSubmission[]> { return this.getDB().selectors || []; }
  async createSelector(s: Partial<SelectorSubmission>) {
    const db = this.getDB();
    const newSel = { id: `sel_${Date.now()}`, status: 'pending', ...s } as SelectorSubmission;
    if (!db.selectors) db.selectors = [];
    db.selectors.push(newSel);
    this.saveDB(db);
  }

  async getInbox(): Promise<InboxMessage[]> { return this.getDB().inbox || []; }
  async createInboxMessage(m: Partial<InboxMessage>) { 
    const db = this.getDB(); 
    const entry = { id: `msg_${Date.now()}`, date: new Date().toISOString(), status: 'pending', ...m } as InboxMessage;
    if (!db.inbox) db.inbox = [];
    db.inbox.unshift(entry); 
    this.saveDB(db);
  }

  async getSales(): Promise<Sale[]> { return this.getDB().sales || []; }
  async recordSale(sale: Partial<Sale>) {
    const db = this.getDB();
    const newSale = { id: `sale_${Date.now()}`, status: 'pending', ...sale } as Sale;
    if (!db.sales) db.sales = [];
    db.sales.unshift(newSale);
    this.saveDB(db);
  }

  async getUserRSVPs(): Promise<string[]> {
    const userName = localStorage.getItem('mat32_user_name');
    if (!userName) return [];
    const db = this.getDB();
    const rsvps = db.rsvps || {};
    return Object.keys(rsvps).filter(eventId => rsvps[eventId].some((g: any) => g.name === userName));
  }

  async getEventGuestList(eventId: string): Promise<{name: string}[]> {
    const db = this.getDB();
    return (db.rsvps && db.rsvps[eventId]) || [];
  }

  async toggleRSVP(eventId: string, userName: string, active: boolean) {
    const db = this.getDB();
    if (!db.rsvps) db.rsvps = {};
    if (!db.rsvps[eventId]) db.rsvps[eventId] = [];
    if (active) { if (!db.rsvps[eventId].some((g: any) => g.name === userName)) db.rsvps[eventId].push({ name: userName }); }
    else { db.rsvps[eventId] = db.rsvps[eventId].filter((g: any) => g.name !== userName); }
    this.saveDB(db);
  }

  async getPosts(): Promise<Post[]> { return this.getDB().posts || []; }
  async getCommunityPosts(): Promise<Post[]> { return this.getPosts(); }
  async getPostById(id: string) { return (await this.getPosts()).find(p => p.id === id); }
  async getGallery(): Promise<GalleryItem[]> { return this.getDB().gallery || []; }
  async getLocalGallery(): Promise<GalleryItem[]> { return this.getGallery(); }
  async getBarMenu(): Promise<MenuCategory[]> { return BAR_MENU; }
  
  async getTaxonomyTree() {
    const records = await this.getRecords();
    return { categories: Array.from(new Set(records.map(r => r.genre))), tags: Array.from(new Set(records.flatMap(r => r.tags || []))) };
  }

  async getGalleryTaxonomy() {
    const gallery = await this.getGallery();
    return { categories: Array.from(new Set(gallery.map(i => i.category))), tags: Array.from(new Set(gallery.flatMap(i => i.tags || []))) };
  }

  async batchImportRecords(csv: string): Promise<number> {
    const lines = csv.split('\n').filter(l => l.trim().length > 0);
    const db = this.getDB();
    let count = 0;
    for (let i = 0; i < lines.length; i++) {
      const parts = lines[i].split(',').map(p => p.trim());
      if (parts.length >= 2) {
        db.records.unshift({ id: `r_batch_${Date.now()}_${count}`, artist: parts[0] || 'Unknown', title: parts[0] || 'Unknown', price: parseFloat(parts[2]) || 25, genre: parts[3] || 'General', stock: 1, coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800', status: 'published', discogsLink: '#', slug: `r_batch_${Date.now()}_${count}` } as any);
        count++;
      }
    }
    this.saveDB(db);
    return count;
  }

  async syncDiscogsCollection(username: string): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const db = this.getDB();
    this.saveDB(db);
    return 200;
  }
}

export const dataService = new DataService();
export const optimizeImageUrl = (u: string, width?: number) => u;
