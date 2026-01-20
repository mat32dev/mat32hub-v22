
export interface LineupMember {
  name: string;
  role: string;
  profileUrl?: string;
  avatarUrl?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: 'Disco' | 'House' | 'Live' | 'Social' | 'Promoter Request' | 'Open Decks';
  imageUrl: string;
  attendees: number;
  capacity?: number;
  price: number;
  ticketLink?: string;
  status?: 'published' | 'draft' | 'cancelled';
  lineup: LineupMember[];
  vibe?: string[];
  isOpenDecks?: boolean; // New flag to show in Open Decks section
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

export interface TradeMetadata {
  artist: string;
  title: string;
  genre: string;
  condition: string;
}

export interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: Comment[];
  timestamp: string;
  tags: string[];
  isTrade?: boolean;
  tradeMetadata?: TradeMetadata;
}

export interface Merch {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: 'Apparel' | 'Accessories' | 'Print';
  stock: number;
}

export interface VinylRecord {
  id: string;
  artist: string;
  title: string;
  label: string;
  year: string;
  condition: 'Mint' | 'NM' | 'VG+' | 'VG';
  price: number;
  coverUrl: string;
  genre: 'Disco' | 'House' | 'Funk' | 'Jazz' | 'Ambient' | 'Event' | 'Ticket';
  format: 'LP' | '12"' | '7"' | 'Digital' | 'Entrada Digital';
  discogsLink: string;
  listenLinks?: {
    bandcamp?: string;
    appleMusic?: string;
    bandcampEmbed?: string;
    appleEmbed?: string;
  };
  description: string;
  isStaffPick?: boolean;
  isFeatured?: boolean;
  isTradeable?: boolean;
  ownerName?: string;
}

export interface MenuItem {
  name: string;
  description?: string;
  price: string;
  highlight?: boolean;
}

export interface MenuCategory {
  title: string;
  items: MenuItem[];
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: any[];
  total: number;
  status: 'pending' | 'completed' | 'shipped' | 'cancelled';
  timestamp: string;
  shippingAddress?: string;
}

export interface SelectorSubmission {
  id: string;
  artistName: string;
  genres: string[];
  format: string;
  bio: string;
  mixUrl: string;
  mixEmbedUrl?: string; 
  avatarUrl?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type CartItem = VinylRecord & { quantity: number };

export enum NavItem {
  HOME = 'Home',
  BAR = 'Bar',
  EVENTS = 'Agenda',
  RECORDS = 'Shop',
  PRIVATE_EVENTS = 'Venue Hire',
  COMMUNITY = 'Community',
  OPEN_DECKS = 'Open Decks',
  CONTACT = 'Contact'
}
