import { Post, VinylRecord, Event, SelectorSubmission, MenuCategory, InboxMessage, GalleryItem, Sale } from '../types';
import { MOCK_EVENTS, MOCK_RECORDS, MOCK_POSTS, MOCK_SELECTORS, BAR_MENU } from '../constants';

// CONFIGURACIÓN DEL HUB: URL de Google Apps Script de Mat32
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwxy99rAms2CReVSbbRORT_mt32s_Sc-lZfNOSJU40S6QsFMUXK6Uw4yFetzJ-WeLFxTw/exec";

class DataService {
  private localKey = 'mat32_matrix_v26_crm_core';
  
  constructor() {
    this.initDefaultData();
  }

  private initDefaultData() {
    if (!localStorage.getItem(this.localKey)) {
      const db = {
        posts: MOCK_POSTS.map(p => ({ ...p, id: p.id || `p_${Math.random()}`, comments: [], likes: 12, timestamp: 'Ahora' })),
        records: MOCK_RECORDS.map(r => ({ ...r, id: r.id || `r_${Math.random()}`, isOpenToTrade: true, sellerId: 'mat32_archive' })),
        events: MOCK_EVENTS.map(e => ({ ...e, id: e.id || `e_${Math.random()}`, status: 'published' })),
        gallery: [
          { id: 'g1', title: 'Entrada Mat32', description: 'Portal analógico Ruzafa.', imageUrl: 'https://lrilkrktztlabjpxqbyc.supabase.co/storage/v1/object/public/local-gallery/PORTADA_2_mat32.jpg', tags: ['#hifi'], category: 'Interior' }
        ],
        selectors: MOCK_SELECTORS,
        inbox: [] as InboxMessage[],
        rsvps: {} as Record<string, any[]>,
        sales: [] as Sale[]
      };
      this.saveDB(db);
    }
  }

  private getDB() { return JSON.parse(localStorage.getItem(this.localKey) || '{}'); }
  private saveDB(data: any) {
    localStorage.setItem(this.localKey, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('mat32_data_changed'));
  }

  // --- GETTERS ---
  async getEvents(): Promise<Event[]> { return this.getDB().events || []; }
  async getRecords(): Promise<VinylRecord[]> { return this.getDB().records || []; }
  async getPosts(): Promise<Post[]> { return this.getDB().posts || []; }
  async getCommunityPosts(): Promise<Post[]> { return this.getPosts(); }
  async getGallery(): Promise<GalleryItem[]> { return this.getDB().gallery || []; }
  async getLocalGallery(): Promise<GalleryItem[]> { return this.getGallery(); }
  async getBarMenu() { return BAR_MENU; }
  async getEventById(id: string) { return (await this.getEvents()).find(e => e.id === id); }
  async getRecordById(id: string) { return (await this.getRecords()).find(r => r.id === id); }
  async getPostById(id: string) { return (await this.getPosts()).find(p => p.id === id); }
  async getSales(): Promise<Sale[]> { return this.getDB().sales || []; }
  async getInbox(): Promise<InboxMessage[]> { return this.getDB().inbox || []; }

  async getTaxonomyTree() {
    const records = await this.getRecords();
    const categories = Array.from(new Set(records.map(r => r.genre))).filter(Boolean);
    const tags = Array.from(new Set(records.flatMap(r => r.tags))).filter(Boolean);
    return { categories, tags };
  }

  async getGalleryTaxonomy() {
    const items = await this.getGallery();
    const categories = Array.from(new Set(items.map(i => i.category))).filter(Boolean);
    const tags = Array.from(new Set(items.flatMap(i => i.tags))).filter(Boolean);
    return { categories, tags };
  }

  // --- CRM: ENVÍO REAL A HOLA@MAT32.COM ---
  async createInboxMessage(m: Partial<InboxMessage>) { 
    const db = this.getDB(); 
    const entry = { 
      id: `msg_${Date.now()}`, 
      date: new Date().toISOString(), 
      status: 'pending',
      ...m
    } as InboxMessage;
    
    // 1. Guardar localmente (Respaldo inmediato)
    db.inbox.unshift(entry); 
    this.saveDB(db);

    // 2. Transmisión al Workspace de Mat32
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', 
        cache: 'no-cache',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
      console.log("SIGNAL_SENT: Inyección en hola@mat32.com completada.");
    } catch (error) {
      console.error("CRITICAL_ERROR: Fallo en la transmisión al Hub.", error);
    }
  }

  async recordSale(sale: Partial<Sale>) {
    const db = this.getDB();
    const newSale = { id: `sale_${Date.now()}`, status: 'pending', ...sale } as Sale;
    if (!db.sales) db.sales = [];
    db.sales.unshift(newSale);
    this.saveDB(db);
  }

  // --- ADMIN & AUTH ---
  async updateMessageStatus(id: string, status: InboxMessage['status']) {
    const db = this.getDB();
    const idx = db.inbox.findIndex((m: any) => m.id === id);
    if (idx > -1) db.inbox[idx].status = status;
    this.saveDB(db);
  }

  async updateSaleStatus(id: string, status: Sale['status']) {
    const db = this.getDB();
    if (!db.sales) db.sales = [];
    const idx = db.sales.findIndex((s: any) => s.id === id);
    if (idx > -1) db.sales[idx].status = status;
    this.saveDB(db);
  }

  isAuthenticated() { return !!localStorage.getItem('mat32_admin_token'); }
  async login(e: string, p: string) {
    if (p === 'mat32_secure_access') { localStorage.setItem('mat32_admin_token', 'true'); return true; }
    return false;
  }
  logout() { localStorage.removeItem('mat32_admin_token'); }

  // --- CRM OPERATIONS ---
  async syncDiscogsCollection(username: string) {
    await new Promise(r => setTimeout(r, 1000));
    const db = this.getDB();
    db.records.unshift({ id: `ds_${Date.now()}`, artist: 'Sync', title: `@${username} Collection`, price: 0, status: 'published' } as any);
    this.saveDB(db);
    return 1;
  }
  
  async batchImportRecords(csv: string) {
    await new Promise(r => setTimeout(r, 500));
    return 1;
  }

  async processMatrixImport(csvData: string) {
    const db = this.getDB();
    const rows = csvData.split('\n').filter(r => r.trim() !== '');
    const dataRows = rows[0].includes('ID') ? rows.slice(1) : rows;

    dataRows.forEach(row => {
      const parts = row.split('\t').map(s => s?.trim());
      if (parts.length < 2) return;
      const [id, type, title, content, mediaUrl, price, stock, eventDate, tagsStr] = parts;
      const tags = tagsStr ? tagsStr.split(' ') : [];

      if (type === 'POST') {
        db.posts.unshift({ id, title, content, imageUrl: mediaUrl, timestamp: 'Importado', tags, author: 'Hub_System', likes: 0, comments: [], type: 'POST', status: 'published' });
      } 
      else if (type === 'EVENT') {
        db.events.push({ id, title, description: content, imageUrl: mediaUrl, price: parseFloat(price) || 0, capacity: parseInt(stock) || 50, date: eventDate, time: '21:00', tags, status: 'published', attendees: 0, category: tags[0]?.replace('#','') || 'General', lineup: [], slug: id, location: 'Mat32', paidPrice: 0, ticketLink: '#', vibe: [] });
      }
      else if (type === 'PRODUCT') {
        db.records.push({ id, sku: id, title, artist: 'Various', price: parseFloat(price) || 20, stock: parseInt(stock) || 1, coverUrl: mediaUrl, description: content, genre: tags[0]?.replace('#','') || 'Vinyl', status: 'published', tags, sellerId: 'hub_vendor', isOpenToTrade: true, condition: 'NM', label: 'Import', year: '2025', format: 'LP', discogsLink: '#', slug: id });
      }
    });

    this.saveDB(db);
    return dataRows.length;
  }

  async getUserRSVPs(): Promise<string[]> {
    const db = this.getDB();
    const userName = localStorage.getItem('mat32_user_name');
    if (!userName) return [];
    const rsvps = [];
    for (const eventId in db.rsvps) {
      if (db.rsvps[eventId].includes(userName)) rsvps.push(eventId);
    }
    return rsvps;
  }

  async getEventGuestList(eventId: string): Promise<{name: string}[]> {
    const db = this.getDB();
    const list = db.rsvps?.[eventId] || [];
    return list.map((name: string) => ({ name }));
  }

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

  async createSelector(s: Partial<SelectorSubmission>) {
    const db = this.getDB();
    if (!db.selectors) db.selectors = [];
    db.selectors.push({ id: `sel_${Date.now()}`, status: 'pending', ...s } as any);
    this.saveDB(db);
  }

  async getSelectors(approvedOnly: boolean = false): Promise<SelectorSubmission[]> {
    const selectors = this.getDB().selectors || [];
    if (approvedOnly) return selectors.filter((s: any) => s.status === 'approved');
    return selectors;
  }
}

export const dataService = new DataService();
export const optimizeImageUrl = (u: string, width?: number) => u;