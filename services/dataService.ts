import { Post, VinylRecord, Event, SelectorSubmission, InboxMessage, GalleryItem, Sale, MenuCategory, UserSession, MerchItem, Member, WantlistItem, Deal } from '../types';
import { BAR_MENU } from '../constants';

const API = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3003';
const SESSION_KEY = 'mat32_auth_session_v15'; // v15: adds JWT token + expiry
const SESSION_TTL = 8 * 60 * 60 * 1000; // 8 hours

function getAuthToken(): string | null {
  try {
    const s = localStorage.getItem(SESSION_KEY);
    if (!s) return null;
    const session = JSON.parse(s);
    if (session.expiresAt && Date.now() > session.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session.token || null;
  } catch { return null; }
}

async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const res = await fetch(`${API}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json();
}

class DataService {
  // ── AUTH ──────────────────────────────────────────────────────
  async login(email: string, pass: string): Promise<boolean> {
    try {
      const data = await api<{ ok: boolean; role: string; name: string; email: string; token: string }>(
        '/auth/login',
        { method: 'POST', body: JSON.stringify({ email, pass }) }
      );
      if (data.ok) {
        const session = { id: 'admin_master', role: data.role as any, name: data.name, email: data.email, token: data.token, expiresAt: Date.now() + SESSION_TTL };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        localStorage.setItem('mat32_user_name', session.name);
        window.dispatchEvent(new CustomEvent('mat32_data_changed'));
      }
      return data.ok;
    } catch { return false; }
  }

  logout() {
    localStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new CustomEvent('mat32_data_changed'));
  }

  getSession(): UserSession | null {
    try {
      const s = localStorage.getItem(SESSION_KEY);
      if (!s) return null;
      const session = JSON.parse(s);
      if (session.expiresAt && Date.now() > session.expiresAt) {
        localStorage.removeItem(SESSION_KEY);
        return null;
      }
      return session;
    } catch { return null; }
  }

  isAuthenticated() { return !!this.getSession(); }

  // ── EVENTS ────────────────────────────────────────────────────
  private normalizeEvent(e: any): Event {
    return {
      ...e,
      price: Number(e.price ?? 0),
      category: e.category || e.tags?.[0] || 'Sesión',
      imageUrl: e.imageUrl || e.cover_url || '',
      location: e.location || e.venue || 'MAT32 · Ruzafa',
      lineup: Array.isArray(e.lineup) ? e.lineup : [],
      vibe: Array.isArray(e.vibe) ? e.vibe : (Array.isArray(e.tags) ? e.tags : []),
      attendees: Number(e.attendees ?? 0),
      capacity: Number(e.capacity ?? 80),
    } as Event;
  }

  async getEvents(): Promise<Event[]> {
    const raw = await api<any[]>('/events');
    return raw.map(e => this.normalizeEvent(e));
  }

  async getEventById(id: string): Promise<Event | undefined> {
    const events = await this.getEvents();
    return events.find(e => e.id === id);
  }

  async createEvent(event: Partial<Event>) {
    return api<Event>('/events', { method: 'POST', body: JSON.stringify(event) });
  }

  async updateEvent(event: Partial<Event>) {
    if (!event.id) return;
    return api(`/events/${event.id}`, { method: 'PATCH', body: JSON.stringify(event) });
  }

  async deleteEvent(id: string) {
    return api(`/events/${id}`, { method: 'DELETE' });
  }

  // ── RECORDS ───────────────────────────────────────────────────
  async getRecords(): Promise<VinylRecord[]> { return api('/records'); }
  async getRecordById(id: string) { return (await this.getRecords()).find(r => r.id === id); }

  async createRecord(record: Partial<VinylRecord>) {
    return api<VinylRecord>('/records', { method: 'POST', body: JSON.stringify(record) });
  }

  async updateRecord(record: Partial<VinylRecord>) {
    if (!record.id) return;
    return api(`/records/${record.id}`, { method: 'PATCH', body: JSON.stringify(record) });
  }

  async deleteRecord(id: string) {
    return api(`/records/${id}`, { method: 'DELETE' });
  }

  // ── POSTS ─────────────────────────────────────────────────────
  async getPosts(): Promise<Post[]> { return api('/posts'); }
  async getCommunityPosts(): Promise<Post[]> { return this.getPosts(); }
  async getPostById(id: string) { return (await this.getPosts()).find(p => p.id === id); }

  async createPost(post: Partial<Post>) {
    return api<Post>('/posts', { method: 'POST', body: JSON.stringify(post) });
  }

  async updatePost(post: Partial<Post>) {
    if (!post.id) return;
    return api(`/posts/${post.id}`, { method: 'PATCH', body: JSON.stringify(post) });
  }

  async deletePost(id: string) {
    return api(`/posts/${id}`, { method: 'DELETE' });
  }

  // ── GALLERY ───────────────────────────────────────────────────
  async getGallery(): Promise<GalleryItem[]> { return api('/gallery'); }
  async getLocalGallery(): Promise<GalleryItem[]> { return this.getGallery(); }

  // ── MERCH ─────────────────────────────────────────────────────
  async getMerch(): Promise<MerchItem[]> { return api('/merch'); }

  async createMerch(item: Partial<MerchItem>) {
    return api<MerchItem>('/merch', { method: 'POST', body: JSON.stringify(item) });
  }

  async updateMerch(item: Partial<MerchItem>) {
    if (!item.id) return;
    return api(`/merch/${item.id}`, { method: 'PATCH', body: JSON.stringify(item) });
  }

  async deleteMerch(id: string) {
    return api(`/merch/${id}`, { method: 'DELETE' });
  }

  // ── SELECTORS ─────────────────────────────────────────────────
  async getSelectors(): Promise<SelectorSubmission[]> { return api('/selectors'); }

  async createSelector(s: Partial<SelectorSubmission>) {
    return api('/selectors', { method: 'POST', body: JSON.stringify(s) });
  }

  async updateSelectorStatus(id: string, status: SelectorSubmission['status']) {
    return api(`/selectors/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
  }

  // ── INBOX ─────────────────────────────────────────────────────
  async getInbox(): Promise<InboxMessage[]> { return api('/inbox'); }

  async createInboxMessage(m: Partial<InboxMessage>) {
    return api('/inbox', { method: 'POST', body: JSON.stringify(m) });
  }

  async updateMessageStatus(id: string, status: InboxMessage['status']) {
    return api(`/inbox/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
  }

  async deleteInboxMessage(id: string) {
    return api(`/inbox/${id}`, { method: 'DELETE' });
  }

  // ── SALES ─────────────────────────────────────────────────────
  async getSales(): Promise<Sale[]> { return api('/sales'); }

  async recordSale(saleData: Omit<Sale, 'id' | 'status'>) {
    return api<Sale>('/sales', { method: 'POST', body: JSON.stringify(saleData) });
  }

  async updateSaleStatus(id: string, status: Sale['status']) {
    return api(`/sales/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
  }

  async deleteSale(id: string) {
    return api(`/sales/${id}`, { method: 'DELETE' });
  }

  // ── RSVPS ─────────────────────────────────────────────────────
  async getEventGuestList(eventId: string): Promise<{ name: string }[]> {
    return api(`/rsvps/${eventId}`);
  }

  async getUserRSVPs(): Promise<string[]> {
    const userName = localStorage.getItem('mat32_user_name');
    if (!userName) return [];
    // El servidor no tiene endpoint de RSVPs por usuario — filtramos en cliente
    return [];
  }

  async toggleRSVP(eventId: string, userName: string, active: boolean) {
    if (active) {
      return api('/rsvps', { method: 'POST', body: JSON.stringify({ event_id: eventId, name: userName }) });
    }
  }

  // ── ANALYTICS ─────────────────────────────────────────────────
  async getAnalytics() {
    return api('/analytics');
  }

  // ── BAR MENU ──────────────────────────────────────────────────
  async getBarMenu(): Promise<MenuCategory[]> { return BAR_MENU; }

  // ── TAXONOMÍA ─────────────────────────────────────────────────
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

  // ── MEMBERS (Digger Radar) ───────────────────────────────────
  async getMembers(): Promise<Member[]> { return api('/members'); }

  async createMember(m: Partial<Member> & { password?: string }) {
    return api<Member>('/members', { method: 'POST', body: JSON.stringify(m) });
  }

  async updateMember(m: Partial<Member>) {
    if (!m.id) return;
    return api(`/members/${m.id}`, { method: 'PATCH', body: JSON.stringify(m) });
  }

  async deleteMember(id: string) {
    return api(`/members/${id}`, { method: 'DELETE' });
  }

  // ── MEMBER WANTLIST ─────────────────────────────────────────
  async getWantlist(memberId: string): Promise<WantlistItem[]> {
    return api(`/members/${memberId}/wantlist`);
  }

  async addWantlistItem(memberId: string, item: Partial<WantlistItem>) {
    return api<WantlistItem>(`/members/${memberId}/wantlist`, { method: 'POST', body: JSON.stringify(item) });
  }

  async updateWantlistItem(memberId: string, item: Partial<WantlistItem>) {
    if (!item.id) return;
    return api(`/members/${memberId}/wantlist/${item.id}`, { method: 'PATCH', body: JSON.stringify(item) });
  }

  async deleteWantlistItem(memberId: string, itemId: string) {
    return api(`/members/${memberId}/wantlist/${itemId}`, { method: 'DELETE' });
  }

  async importWantlistCSV(memberId: string, csv: string): Promise<number> {
    const lines = csv.split('\n').filter(l => l.trim().length > 0);
    let count = 0;
    for (const line of lines) {
      const parts = line.split(',').map(p => p.trim());
      if (parts.length >= 2) {
        await this.addWantlistItem(memberId, {
          artist: parts[0],
          title: parts[1],
          max_price: parts[2] ? parseFloat(parts[2]) : undefined,
          notes: parts[3] || undefined,
        });
        count++;
      }
    }
    return count;
  }

  // ── MEMBER DEALS ────────────────────────────────────────────
  async getDeals(memberId: string): Promise<Deal[]> {
    return api(`/members/${memberId}/deals`);
  }

  async updateDealStatus(memberId: string, dealId: string, status: Deal['status']) {
    return api(`/members/${memberId}/deals/${dealId}`, { method: 'PATCH', body: JSON.stringify({ status }) });
  }

  // ── MEMBER AUTH (login separado) ────────────────────────────
  async memberLogin(email: string, pass: string): Promise<boolean> {
    try {
      const data = await api<{ ok: boolean; member: Member; token: string }>(
        '/auth/member-login',
        { method: 'POST', body: JSON.stringify({ email, pass }) }
      );
      if (data.ok) {
        const session = {
          id: data.member.id,
          role: 'MEMBER' as const,
          name: data.member.name,
          email: data.member.email,
          token: data.token,
          expiresAt: Date.now() + SESSION_TTL,
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        window.dispatchEvent(new CustomEvent('mat32_data_changed'));
      }
      return data.ok;
    } catch { return false; }
  }

  // ── BATCH IMPORT ──────────────────────────────────────────────
  async batchImportRecords(csv: string): Promise<number> {
    const lines = csv.split('\n').filter(l => l.trim().length > 0);
    let count = 0;
    for (const line of lines) {
      const parts = line.split(',').map(p => p.trim());
      if (parts.length >= 2) {
        await this.createRecord({
          artist: parts[0] || 'Unknown',
          title: parts[1] || 'Unknown',
          price: parseFloat(parts[2]) || 25,
          genre: parts[3] || 'Jazz',
          condition: 'NM',
          description: 'Importado por lote',
          label: 'Unknown',
          year: '2024',
          format: 'LP',
          tags: [],
        });
        count++;
      }
    }
    return count;
  }

  // ── DISCOGS SYNC (usa la API del VPS) ─────────────────────────
  async syncDiscogsCollection(username: string): Promise<number> {
    const data = await api<{ count: number }>(`/records/sync-discogs?username=${encodeURIComponent(username)}`, { method: 'POST' });
    return data.count || 0;
  }

  optimizeImageUrl(url: string, _width: number = 800) {
    if (!url) return '';
    return url;
  }
}

export const dataService = new DataService();
export const optimizeImageUrl = (u: string, width?: number) => dataService.optimizeImageUrl(u, width);
