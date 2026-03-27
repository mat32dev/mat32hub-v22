import { Calendar, Disc, Package, MessageSquare, ShoppingBag, UserCheck, Mail, Radar } from 'lucide-react';

export type FieldType = 'text' | 'textarea' | 'number' | 'date' | 'time' | 'select' | 'boolean' | 'image' | 'tags' | 'url' | 'lineup' | 'datetime';

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  min?: number;
  defaultValue?: any;
  half?: boolean; // render at half width
}

export interface EntityConfig {
  label: string;
  labelSingular: string;
  icon: any;
  listColumns: { key: string; label: string; width?: string }[];
  fields: FieldDef[];
  imageField?: string;
  titleField: string;
  service: {
    list: string;
    create: string;
    update: string;
    delete: string;
  };
  statusField?: string;
}

export const entityConfigs: Record<string, EntityConfig> = {
  events: {
    label: 'Eventos',
    labelSingular: 'Evento',
    icon: Calendar,
    titleField: 'title',
    imageField: 'imageUrl',
    statusField: 'status',
    service: { list: 'getEvents', create: 'createEvent', update: 'updateEvent', delete: 'deleteEvent' },
    listColumns: [
      { key: 'imageUrl', label: '', width: '60px' },
      { key: 'title', label: 'Titulo' },
      { key: 'date', label: 'Fecha', width: '120px' },
      { key: 'time', label: 'Hora', width: '80px' },
      { key: 'category', label: 'Tipo', width: '140px' },
      { key: 'status', label: 'Estado', width: '100px' },
    ],
    fields: [
      { key: 'title', label: 'Titulo', type: 'text', required: true },
      { key: 'slug', label: 'Slug', type: 'text', placeholder: 'auto-generado si vacio' },
      { key: 'date', label: 'Fecha', type: 'date', required: true, half: true },
      { key: 'time', label: 'Hora', type: 'time', required: true, half: true },
      { key: 'category', label: 'Categoria', type: 'select', options: ['Listening Session', 'Open Decks', 'DJ Set', 'Live', 'Workshop', 'Mercadillo', 'Fiesta', 'Showcase'], half: true },
      { key: 'status', label: 'Estado', type: 'select', options: ['published', 'draft'], half: true },
      { key: 'price', label: 'Precio (0=gratis)', type: 'number', min: 0, half: true, defaultValue: 0 },
      { key: 'paidPrice', label: 'Precio con entrada', type: 'number', min: 0, half: true, defaultValue: 0 },
      { key: 'capacity', label: 'Aforo', type: 'number', min: 0, half: true, defaultValue: 80 },
      { key: 'attendees', label: 'Asistentes', type: 'number', min: 0, half: true, defaultValue: 0 },
      { key: 'location', label: 'Lugar', type: 'text', defaultValue: 'MAT32 · Ruzafa' },
      { key: 'description', label: 'Descripcion', type: 'textarea', required: true },
      { key: 'imageUrl', label: 'Imagen', type: 'image' },
      { key: 'ticketLink', label: 'Link entradas', type: 'url' },
      { key: 'lineup', label: 'Lineup', type: 'lineup' },
      { key: 'vibe', label: 'Vibe / Tags visuales', type: 'tags' },
      { key: 'tags', label: 'Tags', type: 'tags' },
      { key: 'freeUntil', label: 'Gratis hasta (hora)', type: 'time', half: true },
      { key: 'freeCapacity', label: 'Aforo gratis', type: 'number', min: 0, half: true },
      { key: 'isOpenDecks', label: 'Es Open Decks', type: 'boolean' },
    ],
  },

  records: {
    label: 'Discos',
    labelSingular: 'Disco',
    icon: Disc,
    titleField: 'title',
    imageField: 'coverUrl',
    statusField: 'status',
    service: { list: 'getRecords', create: 'createRecord', update: 'updateRecord', delete: 'deleteRecord' },
    listColumns: [
      { key: 'coverUrl', label: '', width: '60px' },
      { key: 'artist', label: 'Artista' },
      { key: 'title', label: 'Titulo' },
      { key: 'genre', label: 'Genero', width: '120px' },
      { key: 'price', label: 'Precio', width: '80px' },
      { key: 'stock', label: 'Stock', width: '60px' },
      { key: 'status', label: 'Estado', width: '100px' },
    ],
    fields: [
      { key: 'artist', label: 'Artista', type: 'text', required: true },
      { key: 'title', label: 'Titulo', type: 'text', required: true },
      { key: 'slug', label: 'Slug', type: 'text' },
      { key: 'label', label: 'Sello', type: 'text', half: true },
      { key: 'year', label: 'Ano', type: 'text', half: true },
      { key: 'format', label: 'Formato', type: 'select', options: ['LP', '12"', '7"', '10"', 'CD', 'Cassette', 'Box Set'], half: true },
      { key: 'condition', label: 'Estado fisico', type: 'select', options: ['M', 'NM', 'VG+', 'VG', 'G+', 'G', 'F'], half: true },
      { key: 'genre', label: 'Genero', type: 'text', half: true },
      { key: 'price', label: 'Precio', type: 'number', min: 0, required: true, half: true },
      { key: 'tradeValue', label: 'Valor intercambio', type: 'number', min: 0, half: true },
      { key: 'stock', label: 'Stock', type: 'number', min: 0, half: true, defaultValue: 1 },
      { key: 'status', label: 'Estado', type: 'select', options: ['published', 'draft', 'sold'], half: true },
      { key: 'isOpenToTrade', label: 'Abierto a intercambio', type: 'boolean', half: true },
      { key: 'description', label: 'Descripcion', type: 'textarea' },
      { key: 'coverUrl', label: 'Portada', type: 'image' },
      { key: 'discogsLink', label: 'Link Discogs', type: 'url' },
      { key: 'streamingLink', label: 'Link streaming', type: 'url' },
      { key: 'tags', label: 'Tags', type: 'tags' },
    ],
  },

  merch: {
    label: 'Merch',
    labelSingular: 'Articulo',
    icon: Package,
    titleField: 'name',
    imageField: 'imageUrl',
    statusField: 'status',
    service: { list: 'getMerch', create: 'createMerch', update: 'updateMerch', delete: 'deleteMerch' },
    listColumns: [
      { key: 'imageUrl', label: '', width: '60px' },
      { key: 'name', label: 'Nombre' },
      { key: 'category', label: 'Categoria', width: '120px' },
      { key: 'price', label: 'Precio', width: '80px' },
      { key: 'stock', label: 'Stock', width: '60px' },
      { key: 'status', label: 'Estado', width: '100px' },
    ],
    fields: [
      { key: 'name', label: 'Nombre', type: 'text', required: true },
      { key: 'category', label: 'Categoria', type: 'text', half: true },
      { key: 'price', label: 'Precio', type: 'number', min: 0, required: true, half: true },
      { key: 'stock', label: 'Stock', type: 'number', min: 0, half: true, defaultValue: 1 },
      { key: 'status', label: 'Estado', type: 'select', options: ['published', 'draft', 'sold_out'], half: true },
      { key: 'description', label: 'Descripcion', type: 'textarea' },
      { key: 'imageUrl', label: 'Imagen', type: 'image' },
    ],
  },

  posts: {
    label: 'Posts',
    labelSingular: 'Post',
    icon: MessageSquare,
    titleField: 'title',
    imageField: 'imageUrl',
    statusField: 'status',
    service: { list: 'getPosts', create: 'createPost', update: 'updatePost', delete: 'deletePost' },
    listColumns: [
      { key: 'imageUrl', label: '', width: '60px' },
      { key: 'title', label: 'Titulo' },
      { key: 'type', label: 'Tipo', width: '100px' },
      { key: 'author', label: 'Autor', width: '120px' },
      { key: 'status', label: 'Estado', width: '100px' },
    ],
    fields: [
      { key: 'title', label: 'Titulo', type: 'text', required: true },
      { key: 'slug', label: 'Slug', type: 'text' },
      { key: 'type', label: 'Tipo', type: 'select', options: ['POST', 'EVENT', 'PRODUCT', 'TIP', 'GALLERY'], half: true },
      { key: 'status', label: 'Estado', type: 'select', options: ['published', 'draft'], half: true },
      { key: 'author', label: 'Autor', type: 'text', half: true },
      { key: 'timestamp', label: 'Fecha', type: 'datetime', half: true },
      { key: 'content', label: 'Contenido', type: 'textarea', required: true },
      { key: 'imageUrl', label: 'Imagen', type: 'image' },
      { key: 'musicEmbed', label: 'Embed musica (URL)', type: 'url' },
      { key: 'affiliateUrl', label: 'Link afiliado', type: 'url' },
      { key: 'tags', label: 'Tags', type: 'tags' },
      { key: 'isTrade', label: 'Es intercambio', type: 'boolean' },
    ],
  },

  members: {
    label: 'Miembros Radar',
    labelSingular: 'Miembro',
    icon: Radar,
    titleField: 'name',
    statusField: 'status',
    service: { list: 'getMembers', create: 'createMember', update: 'updateMember', delete: 'deleteMember' },
    listColumns: [
      { key: 'name', label: 'Nombre' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Telefono', width: '120px' },
      { key: 'max_price', label: 'Precio max', width: '100px' },
      { key: 'min_condition', label: 'Estado min', width: '100px' },
      { key: 'status', label: 'Estado', width: '100px' },
    ],
    fields: [
      { key: 'name', label: 'Nombre', type: 'text', required: true },
      { key: 'email', label: 'Email', type: 'text', required: true },
      { key: 'password', label: 'Password (solo al crear)', type: 'text' },
      { key: 'phone', label: 'Telefono', type: 'text', half: true },
      { key: 'status', label: 'Estado', type: 'select', options: ['active', 'inactive'], half: true },
      { key: 'max_price', label: 'Precio maximo (€)', type: 'number', min: 0, half: true, defaultValue: 50 },
      { key: 'min_condition', label: 'Estado minimo', type: 'select', options: ['M', 'NM', 'VG+', 'VG', 'G+', 'G'], half: true, defaultValue: 'VG' },
      { key: 'platforms', label: 'Plataformas', type: 'tags', defaultValue: ['discogs', 'ebay', 'wallapop', 'todocoleccion'] },
    ],
  },

  sales: {
    label: 'Ventas',
    labelSingular: 'Venta',
    icon: ShoppingBag,
    titleField: 'customerName',
    statusField: 'status',
    service: { list: 'getSales', create: 'recordSale', update: 'updateSaleStatus', delete: 'deleteSale' },
    listColumns: [
      { key: 'id', label: 'ID', width: '80px' },
      { key: 'customerName', label: 'Cliente' },
      { key: 'total', label: 'Total', width: '80px' },
      { key: 'type', label: 'Tipo', width: '100px' },
      { key: 'timestamp', label: 'Fecha', width: '140px' },
      { key: 'status', label: 'Estado', width: '100px' },
    ],
    fields: [
      { key: 'customerName', label: 'Cliente', type: 'text', half: true },
      { key: 'customerEmail', label: 'Email', type: 'text', half: true },
      { key: 'total', label: 'Total', type: 'number', min: 0, half: true },
      { key: 'type', label: 'Tipo', type: 'select', options: ['ticket', 'record'], half: true },
      { key: 'deliveryMethod', label: 'Entrega', type: 'select', options: ['shipping', 'pickup'], half: true },
      { key: 'status', label: 'Estado', type: 'select', options: ['pending', 'completed', 'cancelled'], half: true },
      { key: 'timestamp', label: 'Fecha', type: 'datetime' },
    ],
  },
};

// Sidebar navigation structure
export const sidebarSections = [
  { title: 'General', items: [{ key: 'dashboard', label: 'Dashboard', icon: Package, path: '/admin' }] },
  {
    title: 'Contenido',
    items: [
      { key: 'events', label: 'Eventos', icon: Calendar, path: '/admin/events' },
      { key: 'records', label: 'Discos', icon: Disc, path: '/admin/records' },
      { key: 'merch', label: 'Merch', icon: Package, path: '/admin/merch' },
      { key: 'posts', label: 'Posts', icon: MessageSquare, path: '/admin/posts' },
    ],
  },
  {
    title: 'Operaciones',
    items: [
      { key: 'sales', label: 'Ventas', icon: ShoppingBag, path: '/admin/sales' },
      { key: 'inbox', label: 'Inbox', icon: Mail, path: '/admin/inbox' },
      { key: 'selectors', label: 'Selectors', icon: UserCheck, path: '/admin/selectors' },
    ],
  },
  {
    title: 'Digger Radar',
    items: [
      { key: 'members', label: 'Miembros', icon: Radar, path: '/admin/members' },
    ],
  },
];
