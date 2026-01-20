import { Event, Post, VinylRecord, MenuCategory, SelectorSubmission } from './types';

const getFutureDate = (daysFromNow: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
};

export const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Saturday Night Fever: Italo Disco',
    date: getFutureDate(2),
    time: '22:00',
    location: 'Mat32 Main Bar',
    description: 'Un viaje profundo a los sonidos italo-disco de los 80. Selección curada con enfoque en sintes raros y ritmos de baile hipnóticos.',
    category: 'Disco',
    imageUrl: 'https://images.unsplash.com/photo-1563841930606-67e2b645b7bb?q=80&w=800',
    attendees: 85,
    capacity: 100,
    price: 15,
    ticketLink: 'https://ra.co',
    lineup: [
      { name: 'Marco V', role: 'Main Selector', profileUrl: '/selector/marco-v' },
      { name: 'Luna', role: 'Warm up', profileUrl: '/selector/luna' }
    ],
    vibe: ['Italo', '80s', 'Neon']
  },
  {
    id: '2',
    title: 'Sunday Digging Sessions',
    date: getFutureDate(3),
    time: '11:00',
    location: 'Mat32 Record Store',
    description: 'Lanzamiento de stock de Jazz Japonés y City Pop. Café cortesía de la casa mientras exploramos las nuevas llegadas.',
    category: 'Social',
    imageUrl: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=800',
    attendees: 42,
    capacity: 60,
    price: 0,
    lineup: [
      { name: 'The Crate Digger', role: 'Resident Selector' }
    ],
    vibe: ['Chill', 'Jazz', 'Coffee']
  }
];

export const MOCK_POSTS: Post[] = [
  {
    id: '101',
    author: 'VinylAddict_VLC',
    avatar: 'https://i.pravatar.cc/150?u=101',
    content: 'Acabo de encontrar una primera edición de "Casiopea" en la tienda. ¡Estado impecable! No durará mucho en la caja.',
    likes: 32,
    // Fix: Type 'number' is not assignable to type 'Comment[]'. Initializing with an empty array.
    comments: [],
    timestamp: 'Hace 2 horas',
    tags: ['#vinyl', '#jazzfusion', '#mat32']
  },
  {
    id: '102',
    author: 'SelectorLuna',
    avatar: 'https://i.pravatar.cc/150?u=102',
    content: 'Preparando la maleta para el sábado. Mucho Italo y alguna que otra sorpresa de Chicago. ¡Nos vemos en la cabina!',
    likes: 45,
    // Fix: Type 'number' is not assignable to type 'Comment[]'. Initializing with an empty array.
    comments: [],
    timestamp: 'Hace 5 horas',
    tags: ['#italodisco', '#djlife', '#ruzafa']
  }
];

export const MOCK_SELECTORS: SelectorSubmission[] = [
  {
    id: 's1',
    artistName: 'DJ LUNA',
    genres: ['Disco', 'Italo', '80s Synth'],
    format: 'Physical & Digital',
    mixUrl: 'https://soundcloud.com',
    bio: 'Luna es una apasionada de los sintetizadores analógicos y las rarezas de club de los 80.',
    avatarUrl: 'https://i.pravatar.cc/150?u=luna'
  },
  {
    id: 's2',
    artistName: 'MARCO V',
    genres: ['House', 'Deep', 'Soul'],
    format: 'Vinyl Only',
    mixUrl: 'https://soundcloud.com',
    bio: 'Especialista en house clásico y selecciones de Chicago. Marco es un pilar de la escena local.',
    avatarUrl: 'https://i.pravatar.cc/150?u=marco'
  }
];

export const MOCK_RECORDS: VinylRecord[] = [
  {
    id: 'r1',
    artist: 'Donna Summer',
    title: 'I Feel Love',
    label: 'Casablanca',
    year: '1977',
    condition: 'VG+',
    price: 25.00,
    coverUrl: 'https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=800',
    genre: 'Disco',
    format: '12"',
    discogsLink: 'https://www.discogs.com/master/85309-Donna-Summer-I-Feel-Love',
    description: 'La obra maestra de Moroder. Esencial para cualquier coleccionista.',
    isFeatured: true
  }
];

export const BAR_MENU: MenuCategory[] = [
  {
    title: 'Signatures',
    items: [
      { name: 'Mat32 Spritz', description: 'Toque de naranja amarga y vermut local.', price: '9.00', highlight: true },
      { name: 'Rotary Old Fashioned', description: 'Bourbon premium infusionado con haba tonka.', price: '12.00', highlight: true }
    ]
  }
];