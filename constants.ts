
import { Event, Post, VinylRecord, MenuCategory, SellerProfile, Artist, SelectorSubmission } from './types';

const getFutureDate = (daysFromNow: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
};

const getPastDate = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const MOCK_ARTISTS: Record<string, Artist> = {
  'soulman': { id: 'art_soul', name: 'Soulman', role: 'Main Selector', instagram: '@soulman_vlc' },
  'analog_digger': { id: 'art_digger', name: 'Analog Digger', role: 'Vinyl Specialist', instagram: '@analog_digger' },
  'mat32_crew': { id: 'art_crew', name: 'Mat32 Crew', role: 'Selectors', instagram: '@mat32__' }
};

export const MOCK_SELLERS: SellerProfile[] = [
  {
    id: 's_mat32',
    name: 'Mat32 Archive',
    email: 'archive@mat32.com',
    discogsUsername: 'mat32vlc',
    avatarUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=200',
    bio: 'Nuestra colección privada de la casa. Joyas que han sonado en el Altec A7.',
    location: 'Ruzafa',
    isVerified: true,
    specialty: ['Jazz Fusion', 'City Pop', 'Ambient']
  }
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p_1',
    type: 'POST',
    title: 'Nueva llegada desde Tokyo',
    slug: 'nueva-llegada-tokyo',
    author: 'mat32__',
    content: 'Acabamos de recibir una joya de City Pop. Sonando ahora en el Altec A7. #HiFi #Vinyl #Ruzafa',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800',
    likes: 45,
    comments: [],
    timestamp: 'Hace 2 horas',
    tags: ['#HiFi', '#Vinyl'],
    status: 'published'
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e_1',
    title: 'Ruzafa Soul & Funk',
    slug: 'ruzafa-soul-funk',
    date: getFutureDate(2),
    time: '20:00',
    location: 'Mat32 Ruzafa',
    description: 'Noche de Soul y Funk con vinilos originales en el corazón de Valencia.',
    category: 'Hi-Fi Sessions',
    imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800',
    attendees: 12,
    capacity: 40,
    price: 0,
    paidPrice: 10,
    ticketLink: '#',
    lineup: [MOCK_ARTISTS['soulman']],
    vibe: ['Soul', 'Funk'],
    status: 'published',
    tags: ['#soul', '#funk']
  },
  {
    id: 'e_2',
    title: 'Analog Deep Sessions',
    slug: 'analog-deep-sessions',
    date: getFutureDate(5),
    time: '22:00',
    location: 'Mat32 Ruzafa',
    description: 'Viaje sonoro a través de la electrónica más profunda con sonido Altec A7.',
    category: 'Electronic Hub',
    imageUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=800',
    attendees: 8,
    capacity: 35,
    price: 0,
    paidPrice: 0,
    ticketLink: '#',
    lineup: [MOCK_ARTISTS['analog_digger']],
    vibe: ['Deep', 'Ambient'],
    status: 'published',
    tags: ['#electronic', '#hifi']
  },
  {
    id: 'e_past_1',
    title: 'Grand Opening Night',
    slug: 'grand-opening-night',
    date: getPastDate(7),
    time: '19:00',
    location: 'Mat32 Ruzafa',
    description: 'Inauguración oficial de nuestro santuario analógico en Ruzafa.',
    category: 'Special Event',
    imageUrl: 'https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/190aead2-fc94-4fed-a7c2-bd341561ca00/public',
    attendees: 40,
    capacity: 40,
    price: 0,
    paidPrice: 0,
    ticketLink: '#',
    lineup: [MOCK_ARTISTS['mat32_crew']],
    vibe: ['Celebration', 'Inaugural'],
    status: 'published',
    tags: ['#opening', '#ruzafa'],
    isPast: true
  },
  {
    id: 'e_past_2',
    title: 'Vinyl & Cocktails Vol. 1',
    slug: 'vinyl-cocktails-v1',
    date: getPastDate(14),
    time: '20:30',
    location: 'Mat32 Ruzafa',
    description: 'La primera de nuestras sesiones de escucha atenta con coctelería de autor.',
    category: 'Listening Session',
    imageUrl: 'https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/7701241e-71ee-4929-18c0-d1d0d9576e00/public',
    attendees: 30,
    capacity: 40,
    price: 0,
    paidPrice: 0,
    ticketLink: '#',
    lineup: [MOCK_ARTISTS['mat32_crew']],
    vibe: ['Relax', 'Analog'],
    status: 'published',
    tags: ['#hifi', '#cocktails'],
    isPast: true
  }
];

export const MOCK_RECORDS: VinylRecord[] = [
  {
    id: 'v_1',
    sku: 'MAT-001',
    artist: 'Daft Punk',
    title: 'Discovery',
    slug: 'daft-punk-discovery',
    label: 'Parlophone',
    year: '2001',
    condition: 'NM',
    price: 45,
    stock: 1,
    coverUrl: 'https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=800',
    genre: 'Techno',
    format: 'LP',
    discogsLink: '#',
    description: 'Classic electronic album.',
    sellerId: 's_mat32',
    status: 'published',
    tags: ['classic', 'electronic']
  }
];

export const BAR_MENU: MenuCategory[] = [
  {
    title: 'COCTELERÍA DE AUTOR',
    items: [
      { name: 'NEGRONI ANALÓGICO', price: '9,50', description: 'Gin local, Vermut artesano y Campari.', highlight: true },
      { name: 'MAT32 SOUR', price: '10,00', description: 'Nuestra versión del clásico con pisco y matices cítricos.', highlight: true },
      { name: 'OLD FASHIONED HI-FI', price: '11,00', description: 'Bourbon macerado en casa con toques de vainilla.', highlight: true }
    ]
  },
  {
    title: 'CERVEZA & VINO',
    items: [
      { name: 'COPA DE VINO D.O VALENCIA', price: '4,00', highlight: true },
      { name: 'CERVEZA ESTRELLA GALICIA 33cl', price: '4,00', highlight: false },
      { name: 'CERVEZA ARTESANA LOCAL', price: '5,50', highlight: false }
    ]
  },
  {
    title: 'APERITIVO PROTOCOL',
    items: [
      { name: 'VERMUT DE LA CASA', price: '4,50', description: 'Servido con aceituna gordal y sifón.' },
      { name: 'TABLA DE QUESOS LOCALES', price: '12,00', description: 'Selección de quesos de la Comunidad Valenciana.' }
    ]
  }
];

export const MOCK_SELECTORS: SelectorSubmission[] = [];
