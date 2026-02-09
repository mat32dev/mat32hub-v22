
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
    discogsUsername: 'ACTIVISTA',
    avatarUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=200',
    bio: 'Nuestra colección privada de la casa. Joyas que han sonado en el Altec A7.',
    location: 'Ruzafa',
    isVerified: true,
    specialty: ['Techno', 'House', 'IDM', 'Detroit', 'Ambient']
  }
];

// GENERADOR DE REGISTROS (MOCK DISCOGS LOGIC)
const generateRecords = (): VinylRecord[] => {
  const collectionData = [
    { artist: "Jeff Mills", title: "Waveform Transmissions Vol. 1", label: "Tresor", year: "1992", genre: "Techno", price: 120, desc: "La piedra angular del techno de Detroit en Berlin. Energía pura y minimalismo industrial en estado puro." },
    { artist: "Aphex Twin", title: "Selected Ambient Works 85-92", label: "Apollo", year: "1992", genre: "IDM", price: 350, desc: "Posiblemente el álbum de electrónica más importante de la historia. Texturas oníricas y ritmos atemporales." },
    { artist: "Drexciya", title: "Neptune's Lair", label: "Tresor", year: "1999", genre: "Electro", price: 180, desc: "Mitología acuática y ritmos rotos de Detroit. Una obra maestra conceptual del misterioso dúo." },
    { artist: "Moodymann", title: "Silentintroduction", label: "Planet E", year: "1997", genre: "House", price: 210, desc: "Soul, Funk y House fundidos en el calor de Detroit. El debut que definió una estética única." },
    { artist: "Boards of Canada", title: "Music Has The Right To Children", label: "Warp", year: "1998", genre: "IDM", price: 280, desc: "Nostalgia analógica y grabaciones de campo. Un viaje psicodélico por paisajes de la infancia escocesa." },
    { artist: "Robert Hood", title: "Minimal Nation", label: "M-Plant", year: "1994", genre: "Techno", price: 145, desc: "El origen del techno minimalista. Menos es más en esta clase magistral de ritmo y repetición." },
    { artist: "Theo Parrish", title: "Parallel Dimensions", label: "Sound Signature", year: "2000", genre: "House", price: 195, desc: "House crudo y sin pulir. La experimentación rítmica llevada al límite de la pista de baile." },
    { artist: "The Other People Place", title: "Lifestyles Of The Laptop Café", label: "Warp", year: "2001", genre: "Electro", price: 420, desc: "Electro emocional y cálido. La obra póstuma más sensible de James Stinson bajo su alias más íntimo." },
    { artist: "Basic Channel", title: "Quadrant Dub", label: "Basic Channel", year: "1994", genre: "Dub Techno", price: 250, desc: "El nacimiento del sonido Berlin. Reverberaciones infinitas y bajos que definen el espacio." },
    { artist: "Underground Resistance", title: "Interstellar Fugitives", label: "UR", year: "1998", genre: "Techno", price: 130, desc: "Techno militante y futurista. El sonido de la resistencia social a través de la electrónica." },
    // ... representaremos los 150 items aquí de forma estructurada
  ];

  const records: VinylRecord[] = [];
  
  // Llenar hasta 150 mezclando los datos reales con variaciones y relacionados
  for (let i = 0; i < 150; i++) {
    const data = collectionData[i % collectionData.length];
    const recordId = `v_${i + 1}`;
    records.push({
      id: recordId,
      sku: `MAT-${(1000 + i).toString()}`,
      artist: data.artist,
      title: data.title + (i >= collectionData.length ? " (Special Edition)" : ""),
      slug: `${data.artist.toLowerCase().replace(/\s+/g, '-')}-${data.title.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      label: data.label,
      year: (parseInt(data.year) + (i >= collectionData.length ? 1 : 0)).toString(),
      condition: i % 5 === 0 ? "Mint" : "NM",
      genre: data.genre,
      price: i % 10 === 0 ? data.price * 1.5 : data.price, // Simulación de rareza
      stock: 1,
      coverUrl: `https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=800&sig=${i}`,
      format: "LP",
      discogsLink: `https://www.discogs.com/user/ACTIVISTA/collection`,
      description: data.desc,
      sellerId: 's_mat32',
      status: 'published',
      tags: [data.genre.toLowerCase(), 'vintage', 'rare']
    });
  }
  
  return records;
};

export const MOCK_RECORDS: VinylRecord[] = generateRecords();

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
  }
];

export const MOCK_SELECTORS: SelectorSubmission[] = [];
