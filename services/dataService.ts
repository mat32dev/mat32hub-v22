import { Post, VinylRecord, Event, SelectorSubmission, MenuCategory, InboxMessage, GalleryItem, Sale } from '../types';
import { MOCK_EVENTS, MOCK_RECORDS, MOCK_POSTS, MOCK_SELECTORS, BAR_MENU } from '../constants';

// URL DE PRODUCCIÓN MAT32 WORKSPACE
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzTNnhbhq6nRT_wJOnIQT1B5qrxA62bt7sr9vRjKxCBfI3ZqxrWG-kAigiCYHG3_iBMZA/exec";

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

  // --- HUB ACTIONS ---
  // Added batchImportRecords to handle CSV imports in Marketplace and Community pages
  async batchImportRecords(csvInput: string) {
    const db = this.getDB();
    const rows = csvInput.split('\n').filter(r => r.trim() !== '');
    const dataRows = rows[0].toLowerCase().includes('artista') ? rows.slice(1) : rows;
    
    dataRows.forEach(row => {
      const parts = row.split(',').map(s => s.trim());
      if (parts.length >= 4) {
        const [artist, title, price, genre] = parts;
        const id = `r_imp_${Math.random().toString(36).substr(2, 9)}`;
        db.records.push({
          id,
          sku: id.toUpperCase(),
          artist,
          title,
          price: parseFloat(price) || 0,
          genre,
          stock: 1,
          coverUrl: 'https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=800',
          description: `Imported record: ${title} by ${artist}`,
          sellerId: 'mat32_archive',
          status: 'published',
          tags: [genre.toLowerCase()],
          condition: 'VG+',
          year: '2024',
          label: 'Unknown',
          format: 'LP',
          discogsLink: '#'
        });
      }
    });
    this.saveDB(db);
    return dataRows.length;
  }

  // Added syncDiscogsCollection to simulate external API sync
  async syncDiscogsCollection(username: string) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const db = this.getDB();
    const id = `r_discogs_${Math.random().toString(36).substr(2, 9)}`;
    db.records.push({
      id,
      sku: `DISCOGS-${username.toUpperCase()}`,
      artist: 'Sync Artist',
      title: `${username}'s Favorite Record`,
      price: 25,
      genre: 'Electronic',
      stock: 1,
      coverUrl: 'https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=800',
      description: `Synced from Discogs user ${username}`,
      sellerId: username,
      status: 'published',
      tags: ['discogs', 'synced'],
      condition: 'NM',
      year: '2023',
      label: 'Discogs Label',
      format: 'LP',
      discogsLink: `https://www.discogs.com/user/${username}/collection`
    });
    this.saveDB(db);
    return 1;
  }

  // Added createSelector for Open Decks submissions
  async createSelector(s: Partial<SelectorSubmission>) {
    const db = this.getDB();
    const entry = {
      id: `sel_${Date.now()}`,
      status: 'pending',
      ...s
    } as SelectorSubmission;
    if (!db.selectors) db.selectors = [];
    db.selectors.push(entry);
    this.saveDB(db);
  }

  // Added processMatrixImport for bulk admin updates
  async processMatrixImport(csvData: string) {
    const db = this.getDB();
    const rows = csvData.split('\n').filter(r => r.trim() !== '');
    const dataRows = rows[0] && (rows[0].includes('ID') || rows[0].includes('|')) ? rows.slice(1) : rows;

    dataRows.forEach(row => {
      const parts = row.split('|').map(s => s?.trim());
      if (parts.length < 4) return;
      
      const [id, type, title, content, mediaUrl, price, stock, eventDate, tagsStr] = parts;
      const tags = tagsStr ? tagsStr.split(' ') : [];

      if (type === 'POST') {
        const existingIdx = db.posts.findIndex((p: any) => p.id === id);
        const postData = { id, title, content, imageUrl: mediaUrl, timestamp: 'Importado', tags, author: 'Hub_System', likes: 0, comments: [] };
        if (existingIdx > -1) db.posts[existingIdx] = postData;
        else db.posts.unshift(postData);
      } 
      else if (type === 'EVENT') {
        const existingIdx = db.events.findIndex((e: any) => e.id === id);
        const eventData = { 
          id, title, description: content, imageUrl: mediaUrl, price: parseFloat(price) || 0, 
          capacity: parseInt(stock) || 50, date: eventDate || '2025-12-31', time: '21:00', tags, 
          status: 'published', attendees: 0, category: tags[0]?.replace('#','') || 'General', lineup: [] 
        };
        if (existingIdx > -1) db.events[existingIdx] = eventData;
        else db.events.push(eventData);
      }
      else if (type === 'PRODUCT') {
        const existingIdx = db.records.findIndex((r: any) => r.id === id);
        const recordData = { 
          id, sku: id, title, artist: 'Various', price: parseFloat(price) || 20, 
          stock: parseInt(stock) || 1, coverUrl: mediaUrl, description: content, 
          genre: tags[0]?.replace('#','') || 'Vinyl', status: 'published', 
          tags, sellerId: 'hub_vendor', isOpenToTrade: true, condition: 'NM',
          year: '2025', label: 'Matrix Hub', format: 'LP', discogsLink: '#'
        };
        if (existingIdx > -1) db.records[existingIdx] = recordData;
        else db.records.push(recordData);
      }
    });

    this.saveDB(db);
    return dataRows.length;
  }

  // Added getGalleryTaxonomy for the gallery filter system
  async getGalleryTaxonomy() {
    const gallery = await this.getGallery();
    const categories = Array.from(new Set(gallery.map(g => g.category))).filter(Boolean);
    const tags = Array.from(new Set(gallery.flatMap(g => g.tags))).filter(Boolean);
    return { categories, tags };
  }

  // --- CRM: TRANSMISIÓN SEGURA A HOLA@MAT32.COM ---
  async createInboxMessage(m: Partial<InboxMessage>) { 
    const db = this.getDB(); 
    const entry = { 
      id: `msg_${Date.now()}`, 
      date: new Date().toISOString(), 
      status: 'pending',
      ...m
    } as InboxMessage;
    
    // 1. Persistencia local inmediata
    db.inbox.unshift(entry); 
    this.saveDB(db);

    // 2. Inyección en Google Workspace via Mat32 Connector
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', 
        cache: 'no-cache',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(entry)
      });
      console.log("SIGNAL_SENT: Lead inyectado en Mat32 Workspace.");
    } catch (error) {
      console.error("DASHBOARD_ERROR: Fallo en la transmisión física.", error);
    }
  }

  // --- ADMIN & AUTH ---
  async recordSale(sale: Partial<Sale>) {
    const db = this.getDB();
    const newSale = { id: `sale_${Date.now()}`, status: 'pending', ...sale } as Sale;
    if (!db.sales) db.sales = [];
    db.sales.unshift(newSale);
    this.saveDB(db);
    // Notificamos la venta también al inbox
    await this.createInboxMessage({
      type: 'sale',
      sender: sale.customerName || 'Cliente Online',
      email: sale.customerEmail || '',
      content: `Nueva venta de ${sale.type} por valor de €${sale.total}`
    });
  }

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

  async getEventGuestList(eventId: string): Promise<{name: string}[]> {
    const db = this.getDB();
    const list = db.rsvps?.[eventId] || [];
    return list.map((name: string) => ({ name }));
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
}

export const dataService = new DataService();
export const optimizeImageUrl = (u: string, width?: number) => u;
