import { Post, VinylRecord, Event, SelectorSubmission, MenuCategory, InboxMessage, GalleryItem, Sale } from '../types';
import { MOCK_EVENTS, MOCK_RECORDS, MOCK_POSTS, MOCK_SELECTORS, BAR_MENU } from '../constants';

class DataService {
  private localKey = 'mat32_matrix_v26_crm_core';
  
  constructor() {
    this.initDefaultData();
  }

  private initDefaultData() {
    if (!localStorage.getItem(this.localKey)) {
      const db = {
        posts: MOCK_POSTS.map(p => ({ 
          ...p, 
          id: p.id || `p_${Math.random().toString(36).substr(2, 5)}`, 
          comments: p.comments || [], 
          likes: p.likes || 12,
          timestamp: p.timestamp || 'Ahora'
        })),
        records: MOCK_RECORDS.map(r => ({ 
          ...r, 
          id: r.id || `r_${Math.random().toString(36).substr(2, 5)}`, 
          isOpenToTrade: true, 
          sellerId: 'mat32_archive' 
        })),
        events: MOCK_EVENTS.map(e => ({ ...e, id: e.id || `e_${Math.random().toString(36).substr(2, 5)}`, status: 'published' })),
        gallery: [
          { id: 'g1', title: 'Entrada Mat32', description: 'El portal analógico en Ruzafa.', imageUrl: 'https://lrilkrktztlabjpxqbyc.supabase.co/storage/v1/object/public/local-gallery/PORTADA_2_mat32.jpg', tags: ['#hifi', '#ruzafa'], category: 'Interior' },
          { id: 'g2', title: 'Barra Hi-Fi', description: 'Coctelería de autor y sonido curado.', imageUrl: 'https://lrilkrktztlabjpxqbyc.supabase.co/storage/v1/object/public/local-gallery/mat32%20inside.jpg', tags: ['#cocktails', '#design'], category: 'Bar' }
        ],
        selectors: MOCK_SELECTORS,
        inbox: [] as InboxMessage[],
        rsvps: {} as Record<string, any[]>,
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

  // --- CRM: HUB OPERATIONS ---
  async batchImportRecords(csv: string) {
    const db = this.getDB();
    const rows = csv.split('\n').filter(r => r.trim() !== '');
    let count = 0;
    
    rows.forEach(row => {
      const parts = row.split(',').map(s => s.trim());
      if (parts.length < 3) return;
      const [artist, title, price, genre] = parts;
      const id = `r_${Math.random().toString(36).substr(2, 7)}`;
      const record: VinylRecord = {
        id,
        sku: `IMP-${id.toUpperCase()}`,
        artist: artist || 'Various',
        title: title || 'Untitled',
        price: parseFloat(price) || 20,
        genre: genre || 'Various',
        stock: 1,
        coverUrl: 'https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=800',
        description: 'Importado desde el Hub local.',
        sellerId: 'hub_member',
        status: 'published',
        tags: ['importado', 'hub'],
        label: 'Various',
        year: '2025',
        format: 'LP',
        condition: 'NM',
        discogsLink: '#',
        slug: `${artist}-${title}`.toLowerCase().replace(/ /g, '-')
      };
      db.records.push(record);
      count++;
    });
    this.saveDB(db);
    return count;
  }

  async syncDiscogsCollection(username: string) {
    await new Promise(r => setTimeout(r, 1500));
    const db = this.getDB();
    const newRecord: VinylRecord = {
      id: `discogs_${Date.now()}`,
      sku: `DS-${username.toUpperCase()}`,
      artist: 'Sincronizado',
      title: `Colección de @${username}`,
      price: 35,
      genre: 'Jazz',
      stock: 1,
      coverUrl: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=800',
      description: 'Sincronizado vía Discogs API.',
      sellerId: username,
      status: 'published',
      tags: ['discogs', 'verificado'],
      label: 'Various',
      year: '2024',
      format: 'LP',
      condition: 'Mint',
      discogsLink: `https://www.discogs.com/user/${username}/collection`,
      slug: `sync-${username}`
    };
    db.records.unshift(newRecord);
    this.saveDB(db);
    return 1;
  }

  // --- CRM: SALES & MESSAGES ---
  async getSales(): Promise<Sale[]> { return this.getDB().sales || []; }
  async recordSale(sale: Partial<Sale>) {
    const db = this.getDB();
    const newSale: Sale = {
      id: `sale_${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'pending',
      items: [],
      total: 0,
      deliveryMethod: 'shipping',
      type: 'record',
      ...sale
    } as Sale;
    db.sales.unshift(newSale);
    this.saveDB(db);
  }

  async createInboxMessage(m: Partial<InboxMessage>) { 
    const db = this.getDB(); 
    // Aseguramos que el contenido registre el destino hola@mat32.com para el CRM
    const entry = { 
      id: `msg_${Date.now()}`, 
      date: new Date().toISOString(), 
      status: 'pending',
      ...m,
      content: `${m.content} [DESTINO: hola@mat32.com]`
    } as InboxMessage;
    
    db.inbox.unshift(entry); 
    this.saveDB(db);
    console.log("SIGNAL_SENT_TO: hola@mat32.com", entry);
  }

  async getInbox(): Promise<InboxMessage[]> { return this.getDB().inbox || []; }
  async updateMessageStatus(id: string, status: InboxMessage['status']) {
    const db = this.getDB();
    const idx = db.inbox.findIndex((m: any) => m.id === id);
    if (idx > -1) db.inbox[idx].status = status;
    this.saveDB(db);
  }

  async updateSaleStatus(id: string, status: Sale['status']) {
    const db = this.getDB();
    const idx = db.sales.findIndex((s: any) => s.id === id);
    if (idx > -1) db.sales[idx].status = status;
    this.saveDB(db);
  }

  async toggleRSVP(eventId: string, name: string, active: boolean) {
    const db = this.getDB();
    if (!db.rsvps) db.rsvps = {};
    if (!db.rsvps[eventId]) db.rsvps[eventId] = [];
    if (active) {
      if (!db.rsvps[eventId].some((g: any) => g.name === name)) db.rsvps[eventId].push({ name, timestamp: new Date().toISOString() });
    } else {
      db.rsvps[eventId] = db.rsvps[eventId].filter((g: any) => g.name !== name);
    }
    this.saveDB(db);
  }

  async getEventGuestList(id: string) { return (this.getDB().rsvps || {})[id] || []; }
  async getUserRSVPs() {
    const name = localStorage.getItem('mat32_user_name');
    if (!name) return [];
    const rsvps = this.getDB().rsvps || {};
    return Object.keys(rsvps).filter(eid => rsvps[eid].some((g: any) => g.name === name));
  }

  async getSelectors(approvedOnly: boolean = false): Promise<SelectorSubmission[]> {
    const selectors = this.getDB().selectors || [];
    if (approvedOnly) return selectors.filter((s: any) => s.status === 'approved');
    return selectors;
  }

  async createSelector(s: Partial<SelectorSubmission>) {
    const db = this.getDB();
    if (!db.selectors) db.selectors = [];
    db.selectors.push({ id: `sel_${Date.now()}`, status: 'pending', ...s });
    this.saveDB(db);
  }

  async createBooking(booking: any) {
    return this.createInboxMessage({
      type: 'booking',
      sender: booking.name,
      email: booking.email,
      content: `Reserva para ${booking.guests} personas el ${booking.date} a las ${booking.time}.`,
      metadata: booking
    });
  }

  async getTaxonomyTree() {
    const records = await this.getRecords();
    const categories = Array.from(new Set(records.map(r => r.genre)));
    const tags = Array.from(new Set(records.flatMap(r => r.tags)));
    return { categories, tags };
  }

  async getGalleryTaxonomy() {
    const items = await this.getGallery();
    const categories = Array.from(new Set(items.map(i => i.category)));
    const tags = Array.from(new Set(items.flatMap(i => i.tags)));
    return { categories, tags };
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
        db.posts.unshift({ id, type: 'POST', title, content, imageUrl: mediaUrl, timestamp: 'Importado', tags, author: 'Admin', likes: 0, comments: [], status: 'published' });
      } else if (type === 'EVENT') {
        db.events.push({ id, title, slug: id, description: content, imageUrl: mediaUrl, price: parseFloat(price) || 0, capacity: parseInt(stock) || 50, date: eventDate, time: '21:00', tags, status: 'published', attendees: 0, category: tags[0]?.replace('#','') || 'Session' });
      } else if (type === 'PRODUCT') {
        db.records.push({ id, sku: id, title, artist: 'Various', price: parseFloat(price) || 20, stock: parseInt(stock) || 1, coverUrl: mediaUrl, description: content, genre: tags[0]?.replace('#','') || 'Vinyl', status: 'published', tags, sellerId: 'hub_vendor', isOpenToTrade: true, condition: 'NM' });
      }
    });
    this.saveDB(db);
    return dataRows.length;
  }

  isAuthenticated() { return !!localStorage.getItem('mat32_admin_token'); }
  async login(e: string, p: string) {
    if (p === 'mat32_secure_access') { localStorage.setItem('mat32_admin_token', 'true'); return true; }
    return false;
  }
  logout() { localStorage.removeItem('mat32_admin_token'); }
}

export const dataService = new DataService();
export const optimizeImageUrl = (u: string, width?: number) => u;