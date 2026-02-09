
import { Event, Post, VinylRecord, MenuCategory, SellerProfile, Artist, SelectorSubmission } from './types';

export const MOCK_ARTISTS: Record<string, Artist> = {
  'soulman': { id: 'art_soul', name: 'Soulman', role: 'Main Selector', instagram: '@soulman_vlc' },
  'analog_digger': { id: 'art_digger', name: 'Analog Digger', role: 'Vinyl Specialist', instagram: '@analog_digger' },
  'mat32_crew': { id: 'art_crew', name: 'Mat32 Crew', role: 'Selectors', instagram: '@mat32__' }
};

export const MOCK_SELLERS: SellerProfile[] = [
  {
    id: 'discos_ruzafa',
    name: 'Discos Ruzafa',
    email: 'ruzafa@mat32.com',
    discogsUsername: 'discos-ruzafa',
    avatarUrl: '',
    bio: 'Santuario Hi-Fi en Ruzafa. Especialistas en Jazz y Disco. Curaduría estricta para Altec A7.',
    location: 'Valencia, Ruzafa',
    isVerified: true,
    specialty: ['Jazz', 'Disco']
  }
];

export const DISCOGS_PROFILE_URL = "https://www.discogs.com/es/user/discos-ruzafa";

const JAZZ_SEEDS = [
  { a: "John Coltrane", t: "A Love Supreme", ed: "(Impulse!)", d: "Original Gatefold First Pressing." },
  { a: "Alice Coltrane", t: "Journey In Satchidananda", ed: "(Impulse!)", d: "Original First Pressing." },
  { a: "Pharoah Sanders", t: "Karma", ed: "(Impulse!)", d: "Original First Pressing." },
  { a: "Sun Ra", t: "Lanquidity", ed: "(Philly Jazz)", d: "Rare Philly Jazz Edition." },
  { a: "McCoy Tyner", t: "Sahara", ed: "(Milestone)", d: "Rudy Van Gelder Master." },
  { a: "Archie Shepp", t: "Attica Blues", ed: "(Impulse!)", d: "Original US Gatefold." },
  { a: "Don Cherry", t: "Brown Rice", ed: "(Horizon)", d: "US Horizon Original." },
  { a: "Clifford Jordan", t: "Glass Bead Games", ed: "(Strata-East)", d: "Original Strata-East." }
];

const DISCO_SEEDS = [
  { a: "Double Exposure", t: "Ten Percent", ed: "(Salsoul)", d: "Walter Gibbons Mix." },
  { a: "Taana Gardner", t: "Heartbeat", ed: "(West End)", d: "Larry Levan Mix." },
  { a: "Loleatta Holloway", t: "Love Sensation", ed: "(Gold Mind)", d: "Tom Moulton Mix." },
  { a: "D-Train", t: "Keep On", ed: "(Prelude)", d: "François K Remix." },
  { a: "Moodymann", t: "Silentintroduction", ed: "(KDJ)", d: "KDJ-001. Hand-stamped label." }
];

const generateUnique200ArchiveV20 = (): VinylRecord[] => {
  const records: VinylRecord[] = [];
  
  for (let i = 0; i < 50; i++) {
    const seed = JAZZ_SEEDS[i % JAZZ_SEEDS.length];
    records.push({
      id: `rz_jazz_v20_${i + 1}`,
      sku: `MAT32-JZ-20-${i}`,
      artist: seed.a,
      title: seed.t,
      slug: `${seed.a.toLowerCase().replace(/\s+/g, '-')}-${seed.t.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      label: seed.ed,
      year: "1960-1980",
      format: "LP",
      condition: "NM",
      genre: "Jazz",
      price: 95 + (i % 5) * 15,
      stock: 1,
      coverUrl: "", 
      discogsLink: DISCOGS_PROFILE_URL,
      description: `${seed.ed} - ${seed.d}`,
      sellerId: 'discos_ruzafa',
      status: 'published',
      tags: ['jazz']
    });
  }

  for (let i = 0; i < 150; i++) {
    const seed = DISCO_SEEDS[i % DISCO_SEEDS.length];
    records.push({
      id: `rz_disco_v20_${i + 1}`,
      sku: `MAT32-RZ-20-${i}`,
      artist: seed.a,
      title: seed.t,
      slug: `${seed.a.toLowerCase().replace(/\s+/g, '-')}-${seed.t.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      label: seed.ed,
      year: "1975-1995",
      format: "12\"",
      condition: "VG+",
      genre: "Disco",
      price: 30 + (i % 10) * 5,
      stock: 1,
      coverUrl: "",
      discogsLink: DISCOGS_PROFILE_URL,
      description: `${seed.ed} - ${seed.d}`,
      sellerId: 'discos_ruzafa',
      status: 'published',
      tags: ['disco']
    });
  }
  return records;
};

export const MOCK_RECORDS: VinylRecord[] = generateUnique200ArchiveV20();

export const MOCK_POSTS: Post[] = [
  {
    id: 'p_rz_20',
    type: 'POST',
    title: 'Archive v20.0: Centennial Expansion',
    slug: 'centennial-expansion-v20',
    author: 'discos_ruzafa',
    content: 'Actualización técnica: Aforo oficial ampliado a 100 personas. Agenda 2025 reprogramada para Febrero y Abril. El Hub crece. #Mat32 #Valencia #HiFiCulture',
    imageUrl: "",
    likes: 3200,
    comments: [],
    timestamp: 'Hoy',
    tags: ['#Centennial', '#CommunityHub'],
    status: 'published'
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e_thurs_feb_1',
    title: 'Open Decks: Community Signal',
    slug: 'open-decks-feb-2025',
    date: '2025-02-13',
    time: '20:00',
    location: 'Mat32 Ruzafa',
    description: 'La cabina es tuya. Trae tus discos y comparte tu selección en nuestro sistema Altec A7. Aforo aumentado para la comunidad.',
    category: 'Open Decks',
    imageUrl: '',
    attendees: 0,
    capacity: 100, // CAPACIDAD ACTUALIZADA
    price: 0,
    paidPrice: 0,
    ticketLink: '#',
    lineup: [MOCK_ARTISTS['mat32_crew']],
    vibe: ['Community', 'Sharing', 'Vinyl Only'],
    status: 'published',
    tags: ['#opendecks', '#free']
  },
  {
    id: 'e_thurs_feb_2',
    title: 'Jazz Ritual: Listening Session',
    slug: 'jazz-ritual-feb-2025',
    date: '2025-02-27',
    time: '21:00',
    location: 'Mat32 Ruzafa',
    description: 'Escucha crítica de piezas maestras del Jazz en alta fidelidad. Análisis técnico del surco.',
    category: 'Listening Session',
    imageUrl: '',
    attendees: 0,
    capacity: 100, // CAPACIDAD ACTUALIZADA
    price: 0,
    paidPrice: 0,
    ticketLink: '#',
    lineup: [MOCK_ARTISTS['analog_digger']],
    vibe: ['Technical', 'Pure Jazz', 'Altec A7'],
    status: 'published',
    tags: ['#jazz', '#listening']
  },
  {
    id: 'e_thurs_apr_1',
    title: 'Open Decks: Selector Series',
    slug: 'open-decks-apr-2025',
    date: '2025-04-10',
    time: '20:00',
    location: 'Mat32 Ruzafa',
    description: 'Jornada de primavera para selectores locales. Prueba tus nuevas adquisiciones en nuestro sistema.',
    category: 'Open Decks',
    imageUrl: '',
    attendees: 0,
    capacity: 100, // CAPACIDAD ACTUALIZADA
    price: 0,
    paidPrice: 0,
    ticketLink: '#',
    lineup: [MOCK_ARTISTS['mat32_crew']],
    vibe: ['Discovery', 'Warm Sound'],
    status: 'published',
    tags: ['#opendecks', '#free']
  },
  {
    id: 'e_thurs_apr_2',
    title: 'Disco Archives: Pure 12-inch',
    slug: 'disco-archives-apr-2025',
    date: '2025-04-24',
    time: '21:00',
    location: 'Mat32 Ruzafa',
    description: 'Exploración de rarezas Disco y Soul en formato 12 pulgadas. Potencia analógica.',
    category: 'Listening Session',
    imageUrl: '',
    attendees: 0,
    capacity: 100, // CAPACIDAD ACTUALIZADA
    price: 0,
    paidPrice: 0,
    ticketLink: '#',
    lineup: [MOCK_ARTISTS['soulman']],
    vibe: ['Disco', 'Soul', 'Analog Drive'],
    status: 'published',
    tags: ['#disco', '#analog']
  }
];

export const BAR_MENU: MenuCategory[] = [
  {
    title: 'SIGNATURE DRINKS',
    items: [
      { name: 'MARTINI 32', price: '14,00', description: 'Ginebra Premium y esencia cítrica.', highlight: true },
      { name: 'NEGRONI RUZAFA', price: '12,50', description: 'El clásico perfeccionado para audiófilos.', highlight: true }
    ]
  }
];

export const MOCK_SELECTORS: SelectorSubmission[] = [];
