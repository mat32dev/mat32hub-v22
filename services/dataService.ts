
import { Post, VinylRecord, Event, SelectorSubmission, InboxMessage, GalleryItem, Sale, MenuItem, MenuCategory, UserSession, UserRole, MerchItem } from '../types';
import { MOCK_EVENTS, MOCK_RECORDS, MOCK_POSTS, MOCK_SELECTORS, BAR_MENU } from '../constants';

class DataService {
  private localKey = 'mat32_matrix_v14_stable'; 
  private sessionKey = 'mat32_auth_session_v14';

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
        gallery: [{ id: 'g1', title: 'Hi-Fi Sanctuary', description: 'Local principal Altec A7.', imageUrl: '', tags: ['#hifi'], category: 'Local' }],
        selectors: MOCK_SELECTORS,
        merch: [] as MerchItem[],
        inbox: [
          {
            id: 'msg_1',
            type: 'general',
            sender: 'Alex Rivera',
            email: 'alex@example.com',
            content: '¿Tenéis disponible el último de Floating Points?',
            date: new Date().toISOString(),
            status: 'pending'
          }
        ] as InboxMessage[],
        rsvps: {} as Record<string, {name: string}[]>,
        sales: [
          {
            id: 'sale_1',
            items: [],
            total: 120,
            deliveryMethod: 'pickup',
            timestamp: new Date().toISOString(),
            type: 'record',
            status: 'completed',
            customerName: 'Juan Pérez'
          }
        ] as Sale[],
        analytics: {
          visits: 12450,
          salesTotal: 4520,
          activeUsers: 42,
          conversionRate: 3.2,
          chartData: [
            { name: 'Lun', value: 400 },
            { name: 'Mar', value: 300 },
            { name: 'Mie', value: 600 },
            { name: 'Jue', value: 800 },
            { name: 'Vie', value: 1200 },
            { name: 'Sab', value: 1500 },
            { name: 'Dom', value: 900 },
          ]
        }
      };
      this.saveDB(db);
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
    if ((email.trim().toLowerCase() === 'hola@mat32.com' || email === 'admin') && (pass.trim() === 'mat32_access_2025' || pass === '3232')) {
      session = { id: 'admin_master', role: 'ADMIN', name: 'Mat32 Manager', email };
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
    const newEvent = { ...event, id: `e_${Date.now()}`, slug: (event.title || '').toLowerCase().replace(/\s+/g, '-'), status: 'published', capacity: 100 } as Event;
    if (!db.events) db.events = [];
    db.events.unshift(newEvent);
    this.saveDB(db);
    return newEvent;
  }

  async updateEvent(event: Partial<Event>) {
    if (!event.id) return;
    const db = this.getDB();
    const idx = db.events.findIndex((e: any) => e.id === event.id);
    if (idx > -1) { db.events[idx] = { ...db.events[idx], ...event }; this.saveDB(db); }
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
    const newRecord = { ...record, id: `v_${Date.now()}`, stock: 1, status: 'published', slug: (record.title || '').toLowerCase().replace(/\s+/g, '-') } as VinylRecord;
    if (!db.records) db.records = [];
    db.records.unshift(newRecord);
    this.saveDB(db);
    return newRecord;
  }

  async updateRecord(record: Partial<VinylRecord>) {
    if (!record.id) return;
    const db = this.getDB();
    const idx = db.records.findIndex((r: any) => r.id === record.id);
    if (idx > -1) { db.records[idx] = { ...db.records[idx], ...record }; this.saveDB(db); }
  }

  async deleteRecord(id: string) {
    const db = this.getDB();
    db.records = db.records.filter((r: any) => r.id !== id);
    this.saveDB(db);
  }

  async getSelectors(): Promise<SelectorSubmission[]> { return this.getDB().selectors || []; }
  async updateSelectorStatus(id: string, status: SelectorSubmission['status']) {
    const db = this.getDB();
    const idx = db.selectors.findIndex((s: any) => s.id === id);
    if (idx > -1) { db.selectors[idx].status = status; this.saveDB(db); }
  }
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
  async updateMessageStatus(id: string, status: InboxMessage['status']) {
    const db = this.getDB();
    const idx = db.inbox.findIndex((m: any) => m.id === id);
    if (idx > -1) { db.inbox[idx].status = status; this.saveDB(db); }
  }
  async deleteInboxMessage(id: string) {
    const db = this.getDB();
    db.inbox = db.inbox.filter((m: any) => m.id !== id);
    this.saveDB(db);
  }

  async getSales(): Promise<Sale[]> { return this.getDB().sales || []; }
  async updateSaleStatus(id: string, status: Sale['status']) {
    const db = this.getDB();
    const idx = db.sales.findIndex((s: any) => s.id === id);
    if (idx > -1) { db.sales[idx].status = status; this.saveDB(db); }
  }
  async deleteSale(id: string) {
    const db = this.getDB();
    db.sales = db.sales.filter((s: any) => s.id !== id);
    this.saveDB(db);
  }

  // MERCH
  async getMerch(): Promise<MerchItem[]> { return this.getDB().merch || []; }
  async createMerch(item: Partial<MerchItem>) {
    const db = this.getDB();
    const newItem = { ...item, id: `m_${Date.now()}`, status: 'published' } as MerchItem;
    if (!db.merch) db.merch = [];
    db.merch.unshift(newItem);
    this.saveDB(db);
    return newItem;
  }
  async updateMerch(item: Partial<MerchItem>) {
    if (!item.id) return;
    const db = this.getDB();
    const idx = db.merch.findIndex((m: any) => m.id === item.id);
    if (idx > -1) { db.merch[idx] = { ...db.merch[idx], ...item }; this.saveDB(db); }
  }
  async deleteMerch(id: string) {
    const db = this.getDB();
    db.merch = db.merch.filter((m: any) => m.id !== id);
    this.saveDB(db);
  }

  async getAnalytics() {
    return this.getDB().analytics || { visits: 0, salesTotal: 0, activeUsers: 0, conversionRate: 0, chartData: [] };
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
        const id = `r_batch_${Date.now()}_${count}`;
        const newRecord: VinylRecord = {
          id,
          sku: `SKU-${id}`,
          artist: parts[0] || 'Unknown',
          title: parts[1] || 'Unknown',
          price: parseFloat(parts[2]) || 25,
          genre: parts[3] || 'Jazz',
          stock: 1,
          coverUrl: '',
          status: 'published',
          slug: id,
          condition: 'NM',
          description: 'Importado por lote',
          label: 'Unknown',
          year: '2024',
          format: 'LP',
          discogsLink: '',
          sellerId: 'admin',
          tags: []
        };
        db.records.unshift(newRecord);
        count++;
      }
    }
    this.saveDB(db);
    return count;
  }

  async recordSale(saleData: Omit<Sale, 'id' | 'status'>) {
    const db = this.getDB();
    const newSale: Sale = {
      ...saleData,
      id: `sale_${Date.now()}`,
      status: 'completed'
    };
    if (!db.sales) db.sales = [];
    db.sales.unshift(newSale);
    this.saveDB(db);
    return newSale;
  }

  async syncDiscogsCollection(username: string): Promise<number> {
    // Simulamos una llamada a la API de Discogs
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const db = this.getDB();
    const mockDiscogs = [
      { artist: 'Miles Davis', title: 'Kind of Blue', price: 35, genre: 'Jazz' },
      { artist: 'Donna Summer', title: 'Bad Girls', price: 28, genre: 'Disco' },
      { artist: 'Kraftwerk', title: 'The Man-Machine', price: 40, genre: 'Electronic' }
    ];

    let count = 0;
    mockDiscogs.forEach(item => {
      const id = `discogs_${Date.now()}_${count}`;
      db.records.unshift({
        id,
        sku: `SKU-${id}`,
        ...item,
        stock: 1,
        coverUrl: '',
        status: 'published',
        slug: id,
        condition: 'NM',
        description: `Sincronizado desde Discogs (${username})`,
        label: 'Discogs Import',
        year: '2024',
        format: 'LP',
        discogsLink: `https://www.discogs.com/search?q=${encodeURIComponent(item.artist + ' ' + item.title)}`,
        sellerId: 'admin',
        tags: [item.genre]
      });
      count++;
    });

    this.saveDB(db);
    return count;
  }

  optimizeImageUrl(url: string, width: number = 800) {
    if (!url) return '';
    if (url.includes('picsum.photos')) return `${url}?w=${width}`;
    return url;
  }
}

export const dataService = new DataService();
export const optimizeImageUrl = (u: string, width?: number) => dataService.optimizeImageUrl(u, width);
