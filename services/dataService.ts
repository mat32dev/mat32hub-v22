
import { Post, VinylRecord, Event, SelectorSubmission, InboxMessage, GalleryItem, Sale, MenuItem, MenuCategory, UserSession, UserRole } from '../types';
import { MOCK_EVENTS, MOCK_RECORDS, MOCK_POSTS, MOCK_SELECTORS, BAR_MENU } from '../constants';

class DataService {
  private localKey = 'mat32_matrix_production_v1'; // Clave estable definitiva
  private sessionKey = 'mat32_auth_session';
  private oldKeys = ['mat32_core_v40', 'mat32_matrix_core_v32', 'mat32_matrix_core'];

  constructor() {
    this.initDatabase();
  }

  private initDatabase() {
    const existingData = localStorage.getItem(this.localKey);
    
    if (!existingData) {
      // Intentar migrar de versiones antiguas antes de cargar MOCKS
      let migratedData = null;
      for (const key of this.oldKeys) {
        const oldData = localStorage.getItem(key);
        if (oldData) {
          console.log(`Sistema Mat32: Migrando datos desde ${key}`);
          migratedData = JSON.parse(oldData);
          break;
        }
      }

      if (migratedData) {
        this.saveDB(migratedData);
      } else {
        const db = {
          posts: MOCK_POSTS.map(p => ({ ...p, id: p.id || `p_${Math.random().toString(36).substr(2, 9)}`, comments: [], likes: 12, timestamp: 'Reciente' })),
          records: MOCK_RECORDS.map(r => ({ ...r, id: r.id || `r_${Math.random().toString(36).substr(2, 9)}`, isOpenToTrade: true, sellerId: 'mat32_archive' })),
          events: MOCK_EVENTS.map(e => ({ ...e, id: e.id || `e_${Math.random().toString(36).substr(2, 9)}`, status: 'published' })),
          gallery: [
            { 
              id: 'g1', 
              title: 'Fachada Mat32 Ruzafa', 
              description: 'Nuestra puerta al mundo analógico en Valencia.', 
              imageUrl: 'https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/5dea483e-141a-4665-8085-5c163d8eda00/public', 
              tags: ['#exterior', '#valencia'], 
              category: 'Local' 
            },
            { 
              id: 'g2', 
              title: 'Analog Booth', 
              description: 'Equipamiento Hi-Fi de alta gama para nuestros selectores.', 
              imageUrl: 'https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/38cbbb12-3f05-47c5-697b-f932d8f99700/public', 
              tags: ['#hifi', '#booth'], 
              category: 'Interior' 
            },
            { 
              id: 'g3', 
              title: 'The Crate Selection', 
              description: 'Detalle de nuestra colección curada de vinilos.', 
              imageUrl: 'https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/8835f005-f545-4434-c67a-b2154de2da00/public', 
              tags: ['#vinyl', '#market'], 
              category: 'Discos' 
            },
            { 
              id: 'g4', 
              title: 'Night Atmosphere', 
              description: 'La luz y el sonido se funden en Ruzafa.', 
              imageUrl: 'https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/de211934-62c1-4fb5-6c4a-35cd8a0d9700/public', 
              tags: ['#bar', '#nightlife'], 
              category: 'Bar' 
            }
          ],
          selectors: MOCK_SELECTORS,
          inbox: [] as InboxMessage[],
          rsvps: {} as Record<string, {name: string}[]>,
          sales: [] as Sale[]
        };
        this.saveDB(db);
      }
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
    window.dispatchEvent(new CustomEvent('mat32_data_changed'));
  }

  // --- AUTH ---
  async login(email: string, pass: string): Promise<boolean> {
    let session: UserSession | null = null;
    const cleanPass = pass.trim();
    
    if (cleanPass === 'mat32_admin') {
      session = { id: 'admin_1', role: 'ADMIN' as UserRole, name: 'Mat32 Manager', email: email || 'admin@mat32.com' };
    } else if (cleanPass === 'mat32_dj') {
      session = { id: 'dj_selector_1', role: 'DJ' as UserRole, name: 'Selector Residente', email: email || 'dj@mat32.com' };
    } else if (cleanPass === 'mat32_user') {
      session = { id: 'user_99', role: 'CUSTOMER' as UserRole, name: 'Digger Member', email: email || 'user@mat32.com' };
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

  // --- EVENTS CRUD ---
  async getEvents(): Promise<Event[]> { return this.getDB().events || []; }
  async getEventById(id: string) { return (await this.getEvents()).find(e => e.id === id); }
  
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
    if (!db.events) db.events = [];
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

  // --- RECORDS CRUD ---
  async getRecords(): Promise<VinylRecord[]> { return this.getDB().records || []; }
  async getRecordById(id: string) { return (await this.getRecords()).find(r => r.id === id); }

  async createRecord(record: Partial<VinylRecord>) {
    const db = this.getDB();
    const newRecord = {
      ...record,
      id: `v_${Date.now()}`,
      stock: record.stock || 1,
      status: 'published',
      tags: record.tags || [],
      slug: (record.title || '').toLowerCase().replace(/\s+/g, '-')
    } as VinylRecord;
    if (!db.records) db.records = [];
    db.records.unshift(newRecord);
    this.saveDB(db);
    return newRecord;
  }

  async updateRecord(id: string, updates: Partial<VinylRecord>) {
    const db = this.getDB();
    const idx = db.records.findIndex((r: any) => r.id === id);
    if (idx > -1) {
      db.records[idx] = { ...db.records[idx], ...updates };
      this.saveDB(db);
    }
  }

  async deleteRecord(id: string) {
    const db = this.getDB();
    db.records = db.records.filter((r: any) => r.id !== id);
    this.saveDB(db);
  }

  // --- DJ SUBMISSIONS ---
  async getSelectors(): Promise<SelectorSubmission[]> { return this.getDB().selectors || []; }
  
  async createSelector(s: Partial<SelectorSubmission>) {
    const db = this.getDB();
    const newSel = { id: `sel_${Date.now()}`, status: 'pending', ...s } as SelectorSubmission;
    if (!db.selectors) db.selectors = [];
    db.selectors.push(newSel);
    this.saveDB(db);
  }

  async updateSelectorStatus(id: string, status: 'approved' | 'rejected' | 'pending') {
    const db = this.getDB();
    const idx = db.selectors.findIndex((s: any) => s.id === id);
    if (idx > -1) {
      db.selectors[idx].status = status;
      this.saveDB(db);
    }
  }

  // --- CRM & INBOX ---
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

  // --- RSVP ---
  async getUserRSVPs(): Promise<string[]> {
    const userName = localStorage.getItem('mat32_user_name');
    if (!userName) return [];
    const db = this.getDB();
    const rsvps = db.rsvps || {};
    return Object.keys(rsvps).filter(eventId => 
      rsvps[eventId].some((g: any) => g.name === userName)
    );
  }

  async getEventGuestList(eventId: string): Promise<{name: string}[]> {
    const db = this.getDB();
    return (db.rsvps && db.rsvps[eventId]) || [];
  }

  async toggleRSVP(eventId: string, userName: string, active: boolean) {
    const db = this.getDB();
    if (!db.rsvps) db.rsvps = {};
    if (!db.rsvps[eventId]) db.rsvps[eventId] = [];
    if (active) {
      if (!db.rsvps[eventId].some((g: any) => g.name === userName)) {
        db.rsvps[eventId].push({ name: userName });
      }
    } else {
      db.rsvps[eventId] = db.rsvps[eventId].filter((g: any) => g.name !== userName);
    }
    this.saveDB(db);
  }

  // --- OTHERS ---
  async getPosts(): Promise<Post[]> { return this.getDB().posts || []; }
  async getCommunityPosts(): Promise<Post[]> { return this.getPosts(); }
  async getPostById(id: string) { return (await this.getPosts()).find(p => p.id === id); }
  async getGallery(): Promise<GalleryItem[]> { return this.getDB().gallery || []; }
  async getLocalGallery(): Promise<GalleryItem[]> { return this.getGallery(); }
  async getBarMenu(): Promise<MenuCategory[]> { return BAR_MENU; }
  
  async getTaxonomyTree() {
    const records = await this.getRecords();
    return {
      categories: Array.from(new Set(records.map(r => r.genre))),
      tags: Array.from(new Set(records.flatMap(r => r.tags || [])))
    };
  }

  async getGalleryTaxonomy() {
    const gallery = await this.getGallery();
    return {
      categories: Array.from(new Set(gallery.map(i => i.category))),
      tags: Array.from(new Set(gallery.flatMap(i => i.tags || [])))
    };
  }

  async batchImportRecords(csv: string): Promise<number> {
    const lines = csv.split('\n').filter(l => l.trim().length > 0);
    const db = this.getDB();
    let count = 0;
    for (let i = 0; i < lines.length; i++) {
      const parts = lines[i].split(',').map(p => p.trim());
      if (parts.length >= 2) {
        db.records.unshift({
          id: `r_batch_${Date.now()}_${count}`,
          artist: parts[0] || 'Unknown',
          title: parts[1] || 'Unknown',
          price: parseFloat(parts[2]) || 25,
          genre: parts[3] || 'General',
          stock: 1,
          coverUrl: 'https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=800',
          status: 'published'
        } as any);
        count++;
      }
    }
    this.saveDB(db);
    return count;
  }

  // --- DISCOGS SYNC ---
  async syncDiscogsCollection(username: string): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const db = this.getDB();
    
    // Fixed: Added missing discogsLink property to mock records
    const syncedRecords: VinylRecord[] = [
      {
        id: `r_sync_${Date.now()}_1`,
        sku: `SYNC-${Math.random().toString(36).substr(2, 5)}`,
        artist: 'Aphex Twin',
        title: 'Selected Ambient Works 85-92',
        price: 35,
        genre: 'Ambient',
        stock: 1,
        coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=800',
        status: 'published',
        tags: ['discogs', 'verified'],
        slug: 'aphex-twin-saw-85-92',
        label: 'Apollo',
        year: '1992',
        format: '2xLP',
        condition: 'NM',
        description: `Imported from ${username}'s Discogs collection.`,
        sellerId: username,
        isOpenToTrade: true,
        discogsLink: '#'
      },
      {
        id: `r_sync_${Date.now()}_2`,
        sku: `SYNC-${Math.random().toString(36).substr(2, 5)}`,
        artist: 'Kraftwerk',
        title: 'The Man-Machine',
        price: 28,
        genre: 'Electronic',
        stock: 1,
        coverUrl: 'https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=800',
        status: 'published',
        tags: ['discogs', 'classic'],
        slug: 'kraftwerk-man-machine',
        label: 'Capitol',
        year: '1978',
        format: 'LP',
        condition: 'VG+',
        description: `Classic synth-pop from ${username}'s collection.`,
        sellerId: username,
        isOpenToTrade: true,
        discogsLink: '#'
      }
    ];

    if (!db.records) db.records = [];
    db.records = [...syncedRecords, ...db.records];
    this.saveDB(db);
    return syncedRecords.length;
  }
}

export const dataService = new DataService();
export const optimizeImageUrl = (u: string, width?: number) => u;
