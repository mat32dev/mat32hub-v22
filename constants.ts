
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
    bio: 'Santuario Hi-Fi en Ruzafa. Especialistas en Spiritual Jazz, Disco y rarezas neoyorquinas. Curaduría estricta para Altec A7.',
    location: 'Valencia, Ruzafa',
    isVerified: true,
    specialty: ['Spiritual Jazz', 'Disco', 'Audiophile Records']
  }
];

export const DISCOGS_PROFILE_URL = "https://www.discogs.com/es/user/discos-ruzafa";

const JAZZ_SEEDS = [
  { a: "John Coltrane", t: "A Love Supreme", ed: "(Original Gatefold First Pressing)", d: "AS-77. Matrix: RVG Stereo etched. Sonic masterpiece for Altec A7." },
  { a: "Alice Coltrane", t: "Journey In Satchidananda", ed: "(Original First Pressing)", d: "AS-9203. Bell Sound Matrix. Featuring Pharoah Sanders. Essential spiritual trip." },
  { a: "Pharoah Sanders", t: "Karma", ed: "(Original First Pressing)", d: "AS-9181. Van Gelder Master. The ultimate cosmic jazz experience." },
  { a: "Sun Ra", t: "Lanquidity", ed: "(Rare Philly Jazz Edition)", d: "PJ-666. Deep groove. Cosmic jazz-funk holy grail." },
  { a: "Archie Shepp", t: "Attica Blues", ed: "(Original US Gatefold)", d: "AS-9222. Politics and spiritual soul jazz. High-dynamics pressing." },
  { a: "McCoy Tyner", t: "Sahara", ed: "(Rudy Van Gelder Master)", d: "M-9039. Powerful performance with stunning frequency response." },
  { a: "Don Cherry", t: "Brown Rice", ed: "(US Horizon Original)", d: "SP-717. Avant-garde spiritual fusion. Top archive copy." },
  { a: "Clifford Jordan", t: "Glass Bead Games", ed: "(Original Strata-East)", d: "SES-19737/8. Legendary audiophile holy grail." }
];

const DISCO_SEEDS = [
  { a: "Double Exposure", t: "Ten Percent", ed: "(Salsoul 12\" First Edition)", d: "Walter Gibbons Mix. Matrix #SZS-5508. First commercial 12-inch." },
  { a: "Taana Gardner", t: "Heartbeat", ed: "(West End Original)", d: "Larry Levan Mix. WES-22132. Paradise Garage anthem." },
  { a: "Loleatta Holloway", t: "Love Sensation", ed: "(Gold Mind Masterpiece)", d: "Tom Moulton Mix. G-12-4001. Matrix: F/W Master." },
  { a: "D-Train", t: "Keep On", ed: "(Prelude Synth Classic)", d: "François K Remix. PRL D 621. Pristine VG+ condition." },
  { a: "Moodymann", t: "Silentintroduction", ed: "(KDJ First Pressing)", d: "KDJ-001. Hand-stamped label. Lo-fi Detroit masterpiece." }
];

const generateUnique200ArchiveV17 = (): VinylRecord[] => {
  const records: VinylRecord[] = [];
  
  for (let i = 0; i < 50; i++) {
    const seed = JAZZ_SEEDS[i % JAZZ_SEEDS.length];
    records.push({
      id: `rz_jazz_v17_${i + 1}`,
      sku: `MAT32-JZ-17-${i}`,
      artist: seed.a,
      title: seed.a,
      slug: `jazz-${seed.a.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      label: "Impulse! / Strata-East",
      year: "1965-1975",
      format: "LP",
      condition: "NM",
      genre: "Spiritual Jazz",
      price: 95 + (i % 4) * 25,
      stock: 1,
      coverUrl: "", // ESPACIO VACÍO PARA CARGA MANUAL
      discogsLink: DISCOGS_PROFILE_URL,
      description: `**${seed.t}** ${seed.ed}. ${seed.d}`,
      sellerId: 'discos_ruzafa',
      status: 'published',
      tags: ['spiritual_jazz', 'archive_select']
    });
  }

  for (let i = 0; i < 150; i++) {
    const seed = DISCO_SEEDS[i % DISCO_SEEDS.length];
    records.push({
      id: `rz_disco_v17_${i + 1}`,
      sku: `MAT32-RZ-17-${i}`,
      artist: seed.a,
      title: seed.a,
      slug: `disco-${seed.a.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      label: "Salsoul / West End",
      year: "1976-1985",
      format: "12\"",
      condition: "VG+",
      genre: "Disco / Garage",
      price: 35 + (i % 8) * 5,
      stock: i % 30 === 0 ? 0 : 1,
      coverUrl: "", // ESPACIO VACÍO PARA CARGA MANUAL
      discogsLink: DISCOGS_PROFILE_URL,
      description: `**${seed.t}** ${seed.ed}. ${seed.d}`,
      sellerId: 'discos_ruzafa',
      status: i % 30 === 0 ? 'sold' : 'published',
      tags: ['disco', 'house', 'p2p_market']
    });
  }
  return records;
};

export const MOCK_RECORDS: VinylRecord[] = generateUnique200ArchiveV17();

export const MOCK_POSTS: Post[] = [
  {
    id: 'p_rz_17',
    type: 'POST',
    title: 'Archive v17.0: Pure Icon Interface',
    slug: 'pure-icon-v17',
    author: 'discos_ruzafa',
    content: 'Interfaz purificada. Todas las carátulas han sido sustituidas por el icono oficial de Mat32. El enfoque ahora es puramente técnico y auditivo. #NoMockups #HiFiProtocol #Mat32',
    imageUrl: "",
    likes: 2100,
    comments: [],
    timestamp: 'Hace segundos',
    tags: ['#PureVinyl', '#AnalogOnly'],
    status: 'published'
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e_rz_17',
    title: 'Pure Listening: Altec A7 Calibration',
    slug: 'altec-a7-calibration',
    date: '2025-05-10',
    time: '21:00',
    location: 'Mat32 Ruzafa',
    description: 'Sesión técnica de escucha centrada en la pureza de la señal analógica. Sin distracciones visuales.',
    category: 'Technical Session',
    imageUrl: '',
    attendees: 50,
    capacity: 50,
    price: 0,
    paidPrice: 15,
    ticketLink: '#',
    lineup: [MOCK_ARTISTS['soulman']],
    vibe: ['Technical Mastery', 'Pure Sound'],
    status: 'published',
    tags: ['#hifi', '#pure']
  }
];

export const BAR_MENU: MenuCategory[] = [
  {
    title: 'AUTHENTIC COCKTAILS',
    items: [
      { name: 'SATCHIDANANDA SOUR', price: '14,00', description: 'Gin Premium, jazmín y alma espiritual.', highlight: true },
      { name: 'ATTICA BLUES', price: '12,50', description: 'Bourbon, amargo de naranja y rebeldía jazz.', highlight: true }
    ]
  }
];

export const MOCK_SELECTORS: SelectorSubmission[] = [];
