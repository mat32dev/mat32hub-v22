
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
    bio: 'Santuario Hi-Fi en Ruzafa. Especialistas en Jazz, Disco y rarezas. Curaduría estricta para Altec A7.',
    location: 'Valencia, Ruzafa',
    isVerified: true,
    specialty: ['Jazz', 'Disco']
  }
];

export const DISCOGS_PROFILE_URL = "https://www.discogs.com/es/user/discos-ruzafa";

const JAZZ_SEEDS = [
  { a: "John Coltrane", t: "A Love Supreme", ed: "(Impulse!)", d: "Original Gatefold First Pressing. AS-77." },
  { a: "Alice Coltrane", t: "Journey In Satchidananda", ed: "(Impulse!)", d: "Original First Pressing. AS-9203." },
  { a: "Pharoah Sanders", t: "Karma", ed: "(Impulse!)", d: "Original First Pressing. AS-9181." },
  { a: "Sun Ra", t: "Lanquidity", ed: "(Philly Jazz)", d: "Rare Philly Jazz Edition. PJ-666." },
  { a: "Archie Shepp", t: "Attica Blues", ed: "(Impulse!)", d: "Original US Gatefold. AS-9222." },
  { a: "McCoy Tyner", t: "Sahara", ed: "(Milestone)", d: "Rudy Van Gelder Master. M-9039." },
  { a: "Don Cherry", t: "Brown Rice", ed: "(Horizon)", d: "US Horizon Original. SP-717." },
  { a: "Clifford Jordan", t: "Glass Bead Games", ed: "(Strata-East)", d: "Original Strata-East. SES-19737/8." }
];

const DISCO_SEEDS = [
  { a: "Double Exposure", t: "Ten Percent", ed: "(Salsoul)", d: "Walter Gibbons Mix. Matrix #SZS-5508." },
  { a: "Taana Gardner", t: "Heartbeat", ed: "(West End)", d: "Larry Levan Mix. WES-22132." },
  { a: "Loleatta Holloway", t: "Love Sensation", ed: "(Gold Mind)", d: "Tom Moulton Mix. G-12-4001." },
  { a: "D-Train", t: "Keep On", ed: "(Prelude)", d: "François K Remix. PRL D 621." },
  { a: "Moodymann", t: "Silentintroduction", ed: "(KDJ)", d: "KDJ-001. Hand-stamped label." }
];

const generateUnique200ArchiveV18 = (): VinylRecord[] => {
  const records: VinylRecord[] = [];
  
  // 50 JAZZ ITEMS (V18 Format: Artist = Musician, Title = LP Name)
  for (let i = 0; i < 50; i++) {
    const seed = JAZZ_SEEDS[i % JAZZ_SEEDS.length];
    records.push({
      id: `rz_jazz_v18_${i + 1}`,
      sku: `MAT32-JZ-18-${i}`,
      artist: seed.a,
      title: seed.t, // Título real del disco
      slug: `${seed.a.toLowerCase().replace(/\s+/g, '-')}-${seed.t.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      label: seed.ed,
      year: "1960-1980",
      format: "LP",
      condition: "NM",
      genre: "Jazz", // Género simplificado
      price: 95 + (i % 5) * 15,
      stock: 1,
      coverUrl: "", 
      discogsLink: DISCOGS_PROFILE_URL,
      description: `${seed.ed} - ${seed.d}`,
      sellerId: 'discos_ruzafa',
      status: 'published',
      tags: ['jazz', 'vinyl']
    });
  }

  // 150 DISCO ITEMS (V18 Format)
  for (let i = 0; i < 150; i++) {
    const seed = DISCO_SEEDS[i % DISCO_SEEDS.length];
    records.push({
      id: `rz_disco_v18_${i + 1}`,
      sku: `MAT32-RZ-18-${i}`,
      artist: seed.a,
      title: seed.t, // Título real del disco
      slug: `${seed.a.toLowerCase().replace(/\s+/g, '-')}-${seed.t.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      label: seed.ed,
      year: "1975-1995",
      format: "12\"",
      condition: "VG+",
      genre: "Disco", // Género simplificado
      price: 30 + (i % 10) * 5,
      stock: i % 40 === 0 ? 0 : 1,
      coverUrl: "",
      discogsLink: DISCOGS_PROFILE_URL,
      description: `${seed.ed} - ${seed.d}`,
      sellerId: 'discos_ruzafa',
      status: i % 40 === 0 ? 'sold' : 'published',
      tags: ['disco', 'vinyl']
    });
  }
  return records;
};

export const MOCK_RECORDS: VinylRecord[] = generateUnique200ArchiveV18();

export const MOCK_POSTS: Post[] = [
  {
    id: 'p_rz_18',
    type: 'POST',
    title: 'Archive v18.0: The Pure Label Format',
    slug: 'pure-label-v18',
    author: 'discos_ruzafa',
    content: 'Actualización del catálogo: Estructura corregida (Artista > Título LP). Géneros unificados a Jazz y Disco. Sin distracciones visuales. #Mat32 #PureVinyl #HiFi',
    imageUrl: "",
    likes: 2400,
    comments: [],
    timestamp: 'Justo ahora',
    tags: ['#VinylOnly', '#PureSignal'],
    status: 'published'
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e_rz_18',
    title: 'Jazz Session: The Masters',
    slug: 'jazz-session-masters',
    date: '2025-05-17',
    time: '21:00',
    location: 'Mat32 Ruzafa',
    description: 'Exploración técnica de grandes maestros del Jazz en nuestro sistema Altec A7.',
    category: 'Jazz Session',
    imageUrl: '',
    attendees: 50,
    capacity: 50,
    price: 0,
    paidPrice: 15,
    ticketLink: '#',
    lineup: [MOCK_ARTISTS['soulman']],
    vibe: ['Jazz', 'High Fidelity'],
    status: 'published',
    tags: ['#jazz', '#valencia']
  }
];

export const BAR_MENU: MenuCategory[] = [
  {
    title: 'SIGNATURE DRINKS',
    items: [
      { name: 'MARTINI 32', price: '14,00', description: 'Ginebra Premium, vermut seco y esencia cítrica.', highlight: true },
      { name: 'NEGRONI RUZAFA', price: '12,50', description: 'El clásico perfeccionado para el oyente audiófilo.', highlight: true }
    ]
  }
];

export const MOCK_SELECTORS: SelectorSubmission[] = [];
