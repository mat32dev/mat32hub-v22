
import { MOCK_EVENTS, MOCK_RECORDS, MOCK_POSTS, MOCK_SELECTORS, BAR_MENU } from './constants';
import { Event, VinylRecord, Post, SelectorSubmission, MenuCategory, InboxMessage } from './types';

class DataService {
  private localKey = 'mat32_matrix_v20_unified';
  
  constructor() {
    this.initDefaultData();
  }

  private initDefaultData() {
    if (!localStorage.getItem(this.localKey)) {
      const db = {
        posts: [
          { id: 'p1', type: 'POST', title: 'Nueva Cabina', content: 'El sistema Altec A7 ya está calibrado.', imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800', likes: 10, comments: [], timestamp: 'Reciente', tags: ['#hifi', '#news'], author: 'Admin' },
          { id: 'p2', type: 'POST', title: 'Mejora Acústica', content: 'Tratamiento acústico en sala principal.', imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800', likes: 5, comments: [], timestamp: 'Ayer', tags: ['#sound', '#studio'], author: 'Admin' }
        ],
        records: MOCK_RECORDS.map(r => ({ ...r, isOpenToTrade: true, sellerId: 'mat32_archive' })),
        events: [
          { id: 'e1', type: 'EVENT', title: 'Techno Night', description: 'Sesión especial con vinilos de Detroit.', imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800', price: 15, capacity: 100, attendees: 12, date: '2025-06-20', time: '22:00', category: 'Techno', status: 'published', tags: ['#techno', '#live'], lineup: [{name: 'Detroit Master', role: 'Main'}] }
        ],
        inbox: [] as InboxMessage[],
        rsvps: {} as Record<string, any[]>
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

  // MOTOR DE CARGA MATRIX (TAXONOMÍA SOLICITADA)
  async processMatrixImport(csvData: string) {
    const db = this.getDB();
    const rows = csvData.split('\n').filter(r => r.trim() !== '');
    // Saltar cabecera si existe
    const dataRows = rows[0].includes('ID') ? rows.slice(1) : rows;

    dataRows.forEach(row => {
      const [id, type, title, content, mediaUrl, price, stock, eventDate, tagsStr] = row.split('\t').map(s => s?.trim());
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
          capacity: parseInt(stock) || 50, date: eventDate, time: '21:00', tags, 
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
          tags, sellerId: 'hub_vendor', isOpenToTrade: true, condition: 'NM' 
        };
        if (existingIdx > -1) db.records[existingIdx] = recordData;
        else db.records.push(recordData);
      }
    });

    this.saveDB(db);
    return dataRows.length;
  }

  async getEvents(): Promise<Event[]> { return this.getDB().events || []; }
  async getRecords(): Promise<VinylRecord[]> { return this.getDB().records || []; }
  async getPosts(): Promise<Post[]> { return this.getDB().posts || []; }
  async getBarMenu() { return BAR_MENU; }
  
  async getRecordById(id: string) { return (await this.getRecords()).find(r => r.id === id); }
  async getEventById(id: string) { return (await this.getEvents()).find(e => e.id === id); }
  async getPostById(id: string) { return (await this.getPosts()).find(p => p.id === id); }

  async createInboxMessage(m: Partial<InboxMessage>) { 
    const db = this.getDB(); 
    db.inbox.push({ ...m, id: `msg_${Date.now()}`, date: new Date().toISOString(), status: 'pending' }); 
    this.saveDB(db); 
  }

  isAuthenticated() { return !!localStorage.getItem('mat32_admin_token'); }
  async login(e: string, p: string) {
    if (p === 'mat32_secure_access') { localStorage.setItem('mat32_admin_token', 'true'); return true; }
    return false;
  }
  logout() { localStorage.removeItem('mat32_admin_token'); }
}

export const dataService = new DataService();
