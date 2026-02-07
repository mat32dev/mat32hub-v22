
import { Event, Post, VinylRecord, MenuCategory, SelectorSubmission, SellerProfile, InstagramPost } from './types';

const getFutureDate = (daysFromNow: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
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
  },
  {
    id: 's_raretraxxx',
    name: 'RareTraxxx Store',
    email: 'store@raretraxxx.com',
    discogsUsername: 'raretraxxx',
    avatarUrl: 'https://i.pravatar.cc/150?u=rare',
    bio: 'Amigos de la casa especializados en Techno de Detroit y House clásico.',
    location: 'Extramurs',
    isVerified: true,
    specialty: ['Techno', 'Deep House']
  }
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p_ig_1',
    type: 'POST',
    title: 'Pure Analog Vibes at Mat32',
    slug: 'pure-analog-vibes-mat32',
    author: 'mat32__',
    content: 'Pure Analog Vibes at Mat32. El sonido de Ruzafa esta tarde con la nueva llegada de Japón. #HiFi #Ruzafa #Valencia',
    imageUrl: 'https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/38cbbb12-3f05-47c5-697b-f932d8f99700/public',
    likes: 156,
    comments: [],
    timestamp: 'Hace 1 hora',
    tags: ['#HiFi', '#Ruzafa'],
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
    location: 'Mat32',
    description: 'Noche de Soul y Funk con vinilos originales en el corazón de Valencia.',
    category: 'Hi-Fi Sessions',
    imageUrl: 'https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/de211934-62c1-4fb5-6c4a-35cd8a0d9700/public',
    attendees: 12,
    capacity: 40,
    price: 0,
    paidPrice: 10,
    ticketLink: '#',
    lineup: [{ name: 'Soulman', role: 'Main Selector' }],
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
    location: 'Mat32',
    description: 'Viaje sonoro a través de la electrónica más profunda con nuestro sistema de sonido Hi-Fi.',
    category: 'Electronic Hub',
    imageUrl: 'https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/38cbbb12-3f05-47c5-697b-f932d8f99700/public',
    attendees: 8,
    capacity: 35,
    price: 0,
    paidPrice: 0,
    ticketLink: '#',
    lineup: [{ name: 'Selector Resident', role: 'Vinyl Specialist' }],
    vibe: ['Deep', 'Ambient'],
    status: 'published',
    tags: ['#electronic', '#hifi']
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
    coverUrl: 'https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/8835f005-f545-4434-c67a-b2154de2da00/public',
    genre: 'Techno',
    format: 'LP',
    discogsLink: '#',
    description: 'Classic electronic album.',
    sellerId: 's_mat32',
    status: 'published',
    tags: ['classic', 'electronic']
  }
];

export const MOCK_SELECTORS: SelectorSubmission[] = [
  {
    id: 'sel_1',
    artistName: 'Marco V',
    genres: ['House', 'Techno'],
    format: 'Vinyl Only',
    mixUrl: 'https://soundcloud.com/example',
    bio: 'Selector de la escena local de Valencia.',
    status: 'approved'
  }
];

export const BAR_MENU: MenuCategory[] = [
  {
    title: 'BÁSICOS',
    items: [
      { name: 'AGUA / CAFÉ / INFUSIÓN', price: '2,50', highlight: false },
      { name: 'REFRESCO', price: '3,50', highlight: false },
      { name: 'CHUPITO', price: '3,50', highlight: false }
    ]
  },
  {
    title: 'CERVEZA & VINO',
    items: [
      { name: 'CERVEZA CAÑA 20cl', price: '2,50', highlight: false },
      { name: 'COPA DE VINO D.O VALENCIA', price: '4,00', highlight: true },
      { name: 'CERVEZA ESTRELLA GALICIA 33cl', price: '4,00', highlight: false },
      { name: 'CERVEZA ESTRELLA GALICIA 50cl', price: '5,00', highlight: false }
    ]
  },
  {
    title: 'APERITIVOS',
    items: [
      { name: 'VERMOUTH', price: '5,00', highlight: false },
      { name: 'POMADA', price: '5,00', highlight: false },
      { name: 'MARTINI BLANCO / ROSSO', price: '6,00', highlight: false },
      { name: 'APEROL SPRITZ', price: '7,00', highlight: true }
    ]
  },
  {
    title: 'COMBINADOS & COCKTAILS',
    items: [
      { name: 'WHISKY SOUR', price: '8,00', highlight: false },
      { name: 'COPA COMBINADO 50ml', price: '9,00', highlight: false },
      { name: 'COMBINADO + RED BULL', price: '10,00', highlight: false },
      { name: 'MOSCOW MULE', price: '10,00', highlight: true },
      { name: 'MOJITO', price: '10,00', highlight: false },
      { name: 'COMBINADO PREMIUM', price: '12,00', highlight: false }
    ]
  }
];

export const MOCK_INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 'ig_1',
    imageUrl: 'https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/8835f005-f545-4434-c67a-b2154de2da00/public',
    link: '#',
    likes: 120,
    comments: 12,
    caption: 'Pure Analog Vibes'
  }
];
