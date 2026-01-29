
import { Post, VinylRecord, Event, SelectorSubmission, InboxMessage, GalleryItem, Sale, MenuItem, MenuCategory, UserSession, UserRole } from '../types';
import { MOCK_EVENTS, MOCK_RECORDS, MOCK_POSTS, MOCK_SELECTORS, BAR_MENU } from '../constants';

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzUqaYPiWSjt37UxQnpL6ZgSb5Rsr-oA-mdNPFxdtkYtHXI0U9DL6eh-cwbfVbvBAhFXw/exec";

class DataService {
  private localKey = 'mat32_matrix_core_v30';
  private sessionKey = 'mat32_user_session';
  
  constructor() {
    this.initDefaultData();
  }

  private initDefaultData() {
    if (!localStorage.getItem(this.localKey)) {
      const db = {
        posts: MOCK_POSTS.map(p => ({ ...p, id: p.id || `p_${Math.random().toString(36).substr(2, 9)}`, comments: [], likes: 12, timestamp: 'Reciente' })),
        records: MOCK_RECORDS.map(r => ({ ...r, id: r.id || `r_${Math.random().toString(36).substr(2, 9)}`, isOpenToTrade: true, sellerId: 'mat32_archive' })),
        events: MOCK_EVENTS.map(e => ({ ...e, id: e.id || `e_${Math.random().toString(36).substr(2, 9)}`, status: 'published' })),
        gallery: [
          { id: 'g1', title: 'Portal Mat32', description: 'Entrada analógica Ruzafa.', imageUrl: 'https://lrilkrktztlabjpxqbyc.supabase.co/storage/v1/object/public/local-gallery/PORTADA_2_mat32.jpg', tags: ['#hifi'], category: 'Interior' }
        ],
        selectors: MOCK_SELECTORS,
        inbox: [] as InboxMessage[],
        rsvps: {} as Record<string, string[]>,
        sales: [] as Sale[]
      };
      this.saveDB(db);
    }
  }

  private getDB() {
    return JSON.parse(localStorage.getItem(this.localKey) || '{}');
  }

  private saveDB(data: any) {
    localStorage.setItem(this.localKey, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('mat32_data_changed'));
  }

  // AUTH SYSTEM
  async login(email: string, pass: string): Promise<boolean> {
    let session: UserSession | null = null;

    if (pass === 'mat32_admin') {
      session = { id: 'admin_1', role: 'ADMIN', name: 'Manager Mat32', email: 'admin@mat32.com' };
    } else if (pass === 'mat32_dj') {
      session = { id: 'dj_selector_1', role: 'DJ', name: 'Selector Local', email: 'selector@mat32.com' };
    } else if (pass === 'mat32_user') {
      session = { id: 'user_1', role: 'CUSTOMER', name: 'Digger User', email: 'user@mat32.com' };
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

  isAuthenticated() { return !!localStorage.getItem(this.sessionKey); }
  getUserRole(): UserRole | null { return this.getSession()?.role || null; }

  // GETTERS
  async getEvents(): Promise<Event[]> { return this.getDB().events || []; }
  async getRecords(): Promise<VinylRecord[]> { return this.getDB().records || []; }
  async getPosts(): Promise<Post[]> { return this.getDB().posts || []; }
  async getCommunityPosts(): Promise<Post[]> { return this.getPosts(); }
  async getGallery(): Promise<GalleryItem[]> { return this.getDB().gallery || []; }
  async getBarMenu(): Promise<MenuCategory[]> { return BAR_MENU; }
  
  async getEventById(id: string) { return (await this.getEvents()).find(e => e.id === id); }
  async getRecordById(id: string) { return (await this.getRecords()).find(r => r.id === id); }
  async getPostById(id: string) { return (await this.getPosts()).find(p => p.id === id); }
  async getInbox(): Promise<InboxMessage[]> { return this.getDB().inbox || []; }
  async getSales(): Promise<Sale[]> { return this.getDB().sales || []; }
  async getSelectors(): Promise<SelectorSubmission[]> { return this.getDB().selectors || []; }

  // TAXONOMY
  async getTaxonomyTree() {
    const records = await this.getRecords();
    const categories = Array.from(new Set(records.map(r => r.genre))).filter(Boolean);
    const tags = Array.from(new Set(records.flatMap(r => r.tags || []))).filter(Boolean);
    return { categories, tags };
  }

  async getGalleryTaxonomy() {
    const gallery = await this.getGallery();
    const categories = Array.from(new Set(gallery.map(g => g.category))).filter(Boolean);
    const tags = Array.from(new Set(gallery.flatMap(g => g.tags || []))).filter(Boolean);
    return { categories, tags };
  }

  // CRUD EVENTOS
  async createEvent(event: Partial<Event>) {
    const db = this.getDB();
    const newEvent = {
      ...event,
      id: `e_${Date.now()}`,
      slug: (event.title || '').toLowerCase().replace(/\s+/g, '-'),
      attendees: 0,
      status: 'published',
      lineup: event.lineup || [],
      vibe: event.vibe || [],
      tags: event.tags || []
    } as Event;
    db.events.unshift(newEvent);
    this.saveDB(db);
    return newEvent;
  }

  async updateEvent(id: string, updates: Partial<Event>) {
    const db = this.getDB();
    const idx = db.events.findIndex((e: any) => e.id === id);
    if (idx > -1) {
      db.events[idx] = { ...db.events[idx], ...updates };
      this.saveDB(db);
    }
  }

  async deleteEvent(id: string) {
    const db = this.getDB();
    db.events = db.events.filter((e: any) => e.id !== id);
    this.saveDB(db);
  }

  // CRM & INBOX
  async createInboxMessage(m: Partial<InboxMessage>) { 
    const db = this.getDB(); 
    const entry = { 
      id: `msg_${Date.now()}`, 
      date: new Date().toISOString(), 
      status: 'pending',
      ...m
    } as InboxMessage;
    
    db.inbox.unshift(entry); 
    this.saveDB(db);

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(entry)
      });
    } catch (error) {
      console.error("Fallo de transmisión al Workspace.", error);
    }
  }

  async recordSale(sale: Partial<Sale>) {
    const db = this.getDB();
    const newSale = { id: `sale_${Date.now()}`, status: 'pending', ...sale } as Sale;
    if (!db.sales) db.sales = [];
    db.sales.unshift(newSale);
    this.saveDB(db);
    await this.createInboxMessage({
      type: 'sale',
      sender: sale.customerName || 'Cliente Online',
      content: `Pedido registrado por valor de €${sale.total}`
    });
  }

  async updateMessageStatus(id: string, status: InboxMessage['status']) {
    const db = this.getDB();
    const idx = db.inbox.findIndex((m: any) => m.id === id);
    if (idx > -1) db.inbox[idx].status = status;
    this.saveDB(db);
  }

  // DJ / SELECTOR
  async getDJProfile(djId: string) {
    const db = this.getDB();
    return db.selectors.find((s: any) => s.id === djId);
  }

  async updateDJProfile(djId: string, updates: any) {
    const db = this.getDB();
    const idx = db.selectors.findIndex((s: any) => s.id === djId);
    if (idx > -1) {
      db.selectors[idx] = { ...db.selectors[idx], ...updates };
      this.saveDB(db);
    }
  }

  // IMPORTACIÓN
  async batchImportRecords(csvInput: string) {
    const db = this.getDB();
    const rows = csvInput.split('\n').filter(r => r.trim() !== '');
    rows.forEach(row => {
      const parts = row.split(',').map(s => s.trim());
      if (parts.length >= 4) {
        db.records.unshift({ 
          id: `imp_${Math.random().toString(36).substr(2, 5)}`, 
          artist: parts[0], title: parts[1], 
          price: parseFloat(parts[2]), genre: parts[3], status: 'published',
          stock: 1, coverUrl: 'https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=800',
          sku: `SKU_${Date.now()}`, slug: parts[1].toLowerCase().replace(/\s+/g, '-'),
          tags: [parts[3].toLowerCase()]
        } as any);
      }
    });
    this.saveDB(db);
    return rows.length;
  }

  async syncDiscogsCollection(username: string) {
    await new Promise(r => setTimeout(r, 1500));
    return 1;
  }

  async createSelector(s: Partial<SelectorSubmission>) {
    const db = this.getDB();
    db.selectors.push({ id: `sel_${Date.now()}`, status: 'pending', ...s } as any);
    this.saveDB(db);
  }

  // RSVP SYSTEM
  async toggleRSVP(eventId: string, userName: string, active: boolean) {
    const db = this.getDB();
    if (!db.rsvps) db.rsvps = {};
    if (!db.rsvps[eventId]) db.rsvps[eventId] = [];
    if (active) {
      if (!db.rsvps[eventId].includes(userName)) db.rsvps[eventId].push(userName);
    } else {
      db.rsvps[eventId] = db.rsvps[eventId].filter((n: string) => n !== userName);
    }
    this.saveDB(db);
  }

  async getEventGuestList(eventId: string) {
    const db = this.getDB();
    return (db.rsvps?.[eventId] || []).map((name: string) => ({ name }));
  }

  async getUserRSVPs() {
    const db = this.getDB();
    const userName = localStorage.getItem('mat32_user_name');
    if (!userName) return [];
    const res = [];
    for (const id in db.rsvps) {
      if (db.rsvps[id].includes(userName)) res.push(id);
    }
    return res;
  }
}

export const dataService = new DataService();
export const optimizeImageUrl = (u: string, width?: number) => u;
