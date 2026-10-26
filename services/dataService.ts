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

  getRole(): string | null {
    const s = this.getSession();
    return s?.role || null;
  }

  isAdmin() { return this.getRole() === 'ADMIN'; }
  isEmployee() { return this.getRole() === 'EMPLOYEE'; }

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
  async getOpenDecksLineup(): Promise<any[]> { return api('/open-decks/lineup'); }
  async setOpenDecksLineupStatus(id: string, status: string) {
    return api(`/open-decks/lineup/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
  }
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
  async getBarMenu(): Promise<MenuCategory[]> {
    try {
      const data = await api<any[]>('/menu');
      return data.map(c => ({
        title: c.title,
        items: (c.items || []).map((i: any) => ({
          name: i.name,
          price: i.price,
          description: i.description || undefined,
          highlight: i.highlight || false,
        })),
      }));
    } catch {
      return BAR_MENU;
    }
  }

  async getMenu(): Promise<any[]> { return api('/menu'); }
  async createMenuCategory(data: { title: string; sort_order: number }) { return api('/menu/categories', { method: 'POST', body: JSON.stringify(data) }); }
  async updateMenuCategory(id: string, data: { title?: string; sort_order?: number }) { return api(`/menu/categories/${id}`, { method: 'PATCH', body: JSON.stringify(data) }); }
  async deleteMenuCategory(id: string) { return api(`/menu/categories/${id}`, { method: 'DELETE' }); }
  async createMenuItem(data: any) { return api('/menu/items', { method: 'POST', body: JSON.stringify(data) }); }
  async updateMenuItem(id: string, data: any) { return api(`/menu/items/${id}`, { method: 'PATCH', body: JSON.stringify(data) }); }
  async deleteMenuItem(id: string) { return api(`/menu/items/${id}`, { method: 'DELETE' }); }
  async reorderMenu(data: { categories?: any[]; items?: any[] }) { return api('/menu/reorder', { method: 'PUT', body: JSON.stringify(data) }); }

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

  // ── SOBREMESA ────────────────────────────────────────────────
  async getSobremesaTables() { return api<any[]>('/sobremesa/tables'); }
  async getSobremesaAvailability(date: string) { return api<any>(`/sobremesa/availability?date=${date}`); }
  async getCalendarBookings() { return api<{ days: string[]; events: { date: string; title: string }[]; updated: string }>(`/calendar/bookings`); }
  async createSobremesaBooking(b: any) { return api('/sobremesa/bookings', { method: 'POST', body: JSON.stringify(b) }); }
  async createSobremesaTable(t: any) { return api('/sobremesa/tables', { method: 'POST', body: JSON.stringify(t) }); }
  async updateSobremesaTable(id: string, t: any) { return api(`/sobremesa/tables/${id}`, { method: 'PATCH', body: JSON.stringify(t) }); }
  async deleteSobremesaTable(id: string) { return api(`/sobremesa/tables/${id}`, { method: 'DELETE' }); }
  async getSobremesaBookings(date?: string) { return api<any[]>(`/sobremesa/bookings${date ? `?date=${date}` : ''}`); }
  async updateSobremesaBooking(id: number, data: any) { return api(`/sobremesa/bookings/${id}`, { method: 'PATCH', body: JSON.stringify(data) }); }
  async markSobremesaPaid(id: number) { return api(`/sobremesa/bookings/${id}/mark-paid`, { method: 'POST', body: '{}' }); }
  async getSobremesaPaymentStatus(ref: string) { return api<any>(`/sobremesa/payment-status/${ref}`); }

  // ── FOOD / PROVEEDOR ─────────────────────────────────────────
  async getFoodMenu() { return api<any[]>('/food/menu'); }
  async getFoodCategories() { return api<any[]>('/food/categories'); }
  async createFoodCategory(data: any) { return api('/food/categories', { method: 'POST', body: JSON.stringify(data) }); }
  async updateFoodCategory(id: string, data: any) { return api(`/food/categories/${id}`, { method: 'PATCH', body: JSON.stringify(data) }); }
  async deleteFoodCategory(id: string) { return api(`/food/categories/${id}`, { method: 'DELETE' }); }
  async getFoodItems() { return api<any[]>('/food/items'); }
  async createFoodItem(data: any) { return api('/food/items', { method: 'POST', body: JSON.stringify(data) }); }
  async updateFoodItem(id: string, data: any) { return api(`/food/items/${id}`, { method: 'PATCH', body: JSON.stringify(data) }); }
  async deleteFoodItem(id: string) { return api(`/food/items/${id}`, { method: 'DELETE' }); }
  async createFoodOrder(data: any) { return api('/food/orders', { method: 'POST', body: JSON.stringify(data) }); }
  async getFoodOrders(opts: { date?: string; status?: string } = {}) {
    const q = new URLSearchParams();
    if (opts.date) q.set('date', opts.date);
    if (opts.status) q.set('status', opts.status);
    return api<any[]>(`/food/orders${q.toString() ? '?' + q.toString() : ''}`);
  }
  async updateFoodOrder(id: number, data: any) { return api(`/food/orders/${id}`, { method: 'PATCH', body: JSON.stringify(data) }); }
  async providerLogin(password: string) { return api<any>('/provider/login', { method: 'POST', body: JSON.stringify({ password }) }); }

  // ── POS ──────────────────────────────────────────────────────
  async getPosCatalog() { return api<any>('/pos/catalog'); }
  async getPosCategories() { return api<any[]>('/pos/categories'); }
  async createPosCategory(data: any) { return api('/pos/categories', { method: 'POST', body: JSON.stringify(data) }); }
  async updatePosCategory(id: string, data: any) { return api(`/pos/categories/${id}`, { method: 'PATCH', body: JSON.stringify(data) }); }
  async deletePosCategory(id: string) { return api(`/pos/categories/${id}`, { method: 'DELETE' }); }
  async getPosProducts() { return api<any[]>('/pos/products'); }
  async createPosProduct(data: any) { return api('/pos/products', { method: 'POST', body: JSON.stringify(data) }); }
  async updatePosProduct(id: string, data: any) { return api(`/pos/products/${id}`, { method: 'PATCH', body: JSON.stringify(data) }); }
  async deletePosProduct(id: string) { return api(`/pos/products/${id}`, { method: 'DELETE' }); }
  async createPosSale(data: any) { return api<any>('/pos/sales', { method: 'POST', body: JSON.stringify(data) }); }
  async getPosSales(date?: string) { return api<any[]>(`/pos/sales${date ? `?date=${date}` : ''}`); }
  async getPosTotals(date?: string) { return api<any>(`/pos/totals${date ? `?date=${date}` : ''}`); }
  async voidPosSale(id: number, reason?: string) { return api(`/pos/sales/${id}/void`, { method: 'POST', body: JSON.stringify({ reason }) }); }

  // ── FONDOS RESERVADOS ────────────────────────────────────────
  async getFondosPublic(category?: string) { return api<any[]>(`/fondos/public${category && category !== 'all' ? `?category=${category}` : ''}`); }
  async getFondosCategories() { return api<any[]>('/fondos/categories'); }
  async getFondosItems() { return api<any[]>('/fondos/items'); }
  async updateFondosItem(id: number, data: any) { return api(`/fondos/items/${id}`, { method: 'PATCH', body: JSON.stringify(data) }); }
  async deleteFondosItem(id: number) { return api(`/fondos/items/${id}`, { method: 'DELETE' }); }
  async createFondosItem(data: any) { return api('/fondos/items', { method: 'POST', body: JSON.stringify(data) }); }

  // ── AGENDA · EXTERNAL EVENTS ─────────────────────────────────
  async getExternalEventsPublic(scope?: 'valencia'|'es'|'eu'|'world') {
    return api<any[]>(`/external-events/public${scope ? `?scope=${scope}` : ''}`);
  }
  async getExternalEventsList() { return api<any[]>('/external_events'); }
  async createExternalEvent(data: any) { return api('/external_events', { method: 'POST', body: JSON.stringify(data) }); }
  async updateExternalEvent(id: string, data: any) { return api(`/external_events/${id}`, { method: 'PATCH', body: JSON.stringify(data) }); }
  async deleteExternalEvent(id: string) { return api(`/external_events/${id}`, { method: 'DELETE' }); }

  // ── REFERENCE SELECTORS ──────────────────────────────────────
  async getReferenceSelectorsPublic() { return api<any[]>('/selectors/public'); }
  async getReferenceSelectorsList() { return api<any[]>('/selectors/list'); }
  async createReferenceSelector(data: any) { return api('/selectors', { method: 'POST', body: JSON.stringify(data) }); }
  async updateReferenceSelector(id: string, data: any) { return api(`/selectors/${id}`, { method: 'PATCH', body: JSON.stringify(data) }); }
  async deleteReferenceSelector(id: string) { return api(`/selectors/${id}`, { method: 'DELETE' }); }

  // ── ALLEGRETTO MIXES ─────────────────────────────────────────
  async getMixesPublic() { return api<any[]>('/mixes/public'); }
  async getMixesList() { return api<any[]>('/mixes/list'); }
  async createMix(data: any) { return api('/mixes', { method: 'POST', body: JSON.stringify(data) }); }
  async updateMix(id: string, data: any) { return api(`/mixes/${id}`, { method: 'PATCH', body: JSON.stringify(data) }); }
  async deleteMix(id: string) { return api(`/mixes/${id}`, { method: 'DELETE' }); }
  async mixOembed(url: string) { return api<any>(`/mixes/oembed?url=${encodeURIComponent(url)}`); }

  // ── MEMBER CARDS ─────────────────────────────────────────────
  async getMyCard(memberId: number) { return api(`/members/${memberId}/card`); }
  async issueCard(memberId: number) { return api(`/members/${memberId}/card`, { method: 'POST', body: '{}' }); }
  async revokeCard(memberId: number) { return api(`/members/${memberId}/card/revoke`, { method: 'POST', body: '{}' }); }
  async getCheckins(memberId: number) { return api(`/members/${memberId}/checkins`); }

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
