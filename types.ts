
export type ContentType = 'POST' | 'EVENT' | 'PRODUCT' | 'TIP' | 'GALLERY';

export interface SellerProfile {
  id: string;
  name: string;
  email: string;
  discogsUsername: string;
  avatarUrl: string;
  bio: string;
  location: string;
  isVerified: boolean;
  specialty: string[];
}

export interface VinylRecord {
  id: string;
  sku: string;
  artist: string;
  title: string;
  slug: string;
  label: string;
  year: string;
  format: string;
  condition: string;
  genre: string;
  price: number;
  tradeValue?: number;
  isOpenToTrade?: boolean;
  stock: number;
  coverUrl: string;
  discogsLink: string;
  streamingLink?: string;
  description: string;
  sellerId: string;
  status: 'published' | 'draft' | 'sold';
  tags: string[];
}

export interface Artist {
  id: string;
  name: string;
  role: string;
  instagram?: string;
  avatarUrl?: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
  imageUrl: string;
  attendees: number;
  capacity: number;
  price: number;
  paidPrice: number;
  ticketLink: string;
  lineup: Artist[];
  vibe: string[];
  status: 'published' | 'draft';
  tags: string[];
  freeUntil?: string;
  freeCapacity?: number;
  isOpenDecks?: boolean;
  isPast?: boolean;
}

export interface Sale {
  id: string;
  items: CartItem[];
  total: number;
  deliveryMethod: 'shipping' | 'pickup';
  timestamp: string;
  type: 'ticket' | 'record';
  status: 'pending' | 'completed' | 'cancelled';
  customerName?: string;
  customerEmail?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  category: string;
}

export interface InstagramPost {
  id: string;
  imageUrl: string;
  link: string;
  likes: number;
  comments: number;
  caption: string;
}

export interface Post {
  id: string;
  type: ContentType;
  title: string;
  slug?: string;
  content: string;
  author: string;
  timestamp: string;
  status: 'published' | 'draft';
  imageUrl?: string;
  musicEmbed?: string;
  affiliateUrl?: string;
  tags: string[];
  likes: number;
  comments: any[];
  isTrade?: boolean;
}

export interface InboxMessage {
  id: string;
  type: 'lead' | 'artist' | 'booking' | 'sale' | 'general' | 'offer' | 'negotiation';
  sender: string;
  email: string;
  phone?: string;
  content: string;
  date: string;
  status: 'pending' | 'read' | 'archived';
  metadata?: any;
}

export interface CartItem {
  id: string;
  title: string;
  artist: string;
  price: number;
  quantity: number;
  coverUrl: string;
  category?: string;
}

export interface MenuItem {
  name: string;
  price: string;
  highlight?: boolean;
  description?: string;
}

export interface MenuCategory {
  title: string;
  items: MenuItem[];
}

export interface SelectorSubmission {
  id: string;
  name: string;
  email: string;
  genre: string;
  experience: string;
  links: string[];
  status: 'pending' | 'approved' | 'rejected';
  avatarUrl?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type UserRole = 'ADMIN' | 'DJ' | 'CUSTOMER' | 'MEMBER';

export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  max_price: number;
  min_condition: string;
  platforms: string[];
  status: 'active' | 'inactive';
  created_at: string;
}

export interface WantlistItem {
  id: string;
  member_id: string;
  artist: string;
  title: string;
  notes?: string;
  max_price?: number;
  created_at: string;
}

export interface Deal {
  id: string;
  member_id: string;
  wantlist_id?: string;
  artist: string;
  title: string;
  platform: string;
  seller: string;
  price: number;
  shipping: number;
  condition: string;
  url: string;
  found_at: string;
  status: 'new' | 'seen' | 'bought' | 'dismissed';
}

export interface MerchItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
  description: string;
  category: string;
  status: 'published' | 'draft' | 'sold_out';
}

export interface UserSession {
  id: string;
  role: UserRole;
  name: string;
  email: string;
}
