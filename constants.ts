
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
  { a: "John Coltrane", t: "A Love Supreme", ed: "(Impulse!)", d: "Original Gatefold First Pressing.", s: "https://bandcamp.com/EmbeddedPlayer/album=2308115201/size=large/bgcol=333333/linkcol=ea580c/minimal=true/transparent=true/" },
  { a: "Alice Coltrane", t: "Journey In Satchidananda", ed: "(Impulse!)", d: "Original First Pressing.", s: "https://bandcamp.com/EmbeddedPlayer/album=4013444211/size=large/bgcol=333333/linkcol=ea580c/minimal=true/transparent=true/" },
  { a: "Pharoah Sanders", t: "Karma", ed: "(Impulse!)", d: "Original First Pressing.", s: "https://bandcamp.com/EmbeddedPlayer/album=3082522770/size=large/bgcol=333333/linkcol=ea580c/minimal=true/transparent=true/" },
  { a: "Sun Ra", t: "Lanquidity", ed: "(Philly Jazz)", d: "Rare Philly Jazz Edition.", s: "https://bandcamp.com/EmbeddedPlayer/album=3769152285/size=large/bgcol=333333/linkcol=ea580c/minimal=true/transparent=true/" },
  { a: "Archie Shepp", t: "Attica Blues", ed: "(Impulse!)", d: "Original US Gatefold.", s: "https://bandcamp.com/EmbeddedPlayer/album=3324546413/size=large/bgcol=333333/linkcol=ea580c/minimal=true/transparent=true/" },
  { a: "McCoy Tyner", t: "Sahara", ed: "(Milestone)", d: "Rudy Van Gelder Master.", s: "" },
  { a: "Don Cherry", t: "Brown Rice", ed: "(Horizon)", d: "US Horizon Original.", s: "" },
  { a: "Clifford Jordan", t: "Glass Bead Games", ed: "(Strata-East)", d: "Original Strata-East.", s: "" }
];

const DISCO_SEEDS = [
  { a: "Double Exposure", t: "Ten Percent", ed: "(Salsoul)", d: "Walter Gibbons Mix.", s: "" },
  { a: "Taana Gardner", t: "Heartbeat", ed: "(West End)", d: "Larry Levan Mix.", s: "" },
  { a: "Loleatta Holloway", t: "Love Sensation", ed: "(Gold Mind)", d: "Tom Moulton Mix.", s: "" },
  { a: "D-Train", t: "Keep On", ed: "(Prelude)", d: "François K Remix.", s: "" },
  { a: "Moodymann", t: "Silentintroduction", ed: "(KDJ)", d: "KDJ-001. Hand-stamped label.", s: "https://bandcamp.com/EmbeddedPlayer/album=1833177726/size=large/bgcol=333333/linkcol=ea580c/minimal=true/transparent=true/" }
];

const generateUnique200ArchiveV23 = (): VinylRecord[] => {
  const records: VinylRecord[] = [];
  
  for (let i = 0; i < 50; i++) {
    const seed = JAZZ_SEEDS[i % JAZZ_SEEDS.length];
    records.push({
      id: `rz_jazz_v23_${i + 1}`,
      sku: `MAT32-JZ-23-${i}`,
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
      streamingLink: seed.s,
      description: `${seed.ed} - ${seed.d}`,
      sellerId: 'discos_ruzafa',
      status: 'published',
      tags: ['jazz']
    });
  }

  for (let i = 0; i < 150; i++) {
    const seed = DISCO_SEEDS[i % DISCO_SEEDS.length];
    records.push({
      id: `rz_disco_v23_${i + 1}`,
      sku: `MAT32-RZ-23-${i}`,
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
      streamingLink: seed.s,
      description: `${seed.ed} - ${seed.d}`,
      sellerId: 'discos_ruzafa',
      status: 'published',
      tags: ['disco']
    });
  }
  return records;
};

export const MOCK_RECORDS: VinylRecord[] = generateUnique200ArchiveV23();

export const MOCK_POSTS: Post[] = [
  {
    id: 'p_rz_23',
    type: 'POST',
    title: 'Archive v23.0: Community Connection Protocol',
    slug: 'community-connection-v23',
    author: 'discos_ruzafa',
    content: 'Priorizando la agenda de febrero para la comunidad. Open Decks y sesiones de escucha crítica ya disponibles. #Mat32 #Community #Valencia',
    imageUrl: "",
    likes: 4500,
    comments: [],
    timestamp: 'Hace unos instantes',
    tags: ['#DiggerHub', '#HiFiLife'],
    status: 'published'
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e_open_listening_12_feb',
    title: 'Open Decks: Listening Session I',
    slug: 'open-decks-listening-feb-12',
    date: '2025-02-12',
    time: '19:30',
    location: 'Mat32 Ruzafa',
    description: 'Protocolo de escucha abierta. Trae tus discos favoritos de cualquier género y compártelos en nuestro sistema Altec A7. La cabina es tuya.',
    category: 'Open Decks',
    imageUrl: '',
    attendees: 0,
    capacity: 100,
    price: 0,
    paidPrice: 0,
    ticketLink: '#',
    lineup: [MOCK_ARTISTS['mat32_crew']],
    vibe: ['Community Sharing', 'Vinyl Only', 'High Fidelity'],
    status: 'published',
    tags: ['#opendecks', '#listening', '#ruzafa']
  },
  {
    id: 'e_open_listening_19_feb',
    title: 'Open Decks: Listening Session II',
    slug: 'open-decks-listening-feb-19',
    date: '2025-02-19',
    time: '19:30',
    location: 'Mat32 Ruzafa',
    description: 'Segunda jornada de escucha comunitaria de febrero. Micro-abierto para selectores de vinilo locales. Curaduría libre.',
    category: 'Open Decks',
    imageUrl: '',
    attendees: 0,
    capacity: 100,
    price: 0,
    paidPrice: 0,
    ticketLink: '#',
    lineup: [MOCK_ARTISTS['mat32_crew']],
    vibe: ['Discovery', 'Analog Ritual', 'Selector Series'],
    status: 'published',
    tags: ['#opendecks', '#community', '#valencia']
  }
];

export const BAR_MENU: MenuCategory[] = [
  {
    title: 'SIGNATURE DRINKS',
    items: [
      { name: 'MARTINI 32', price: '14,00', description: 'Ginebra Premium y esencia cítrica de Valencia.', highlight: true },
      { name: 'NEGRONI RUZAFA', price: '12,50', description: 'El clásico equilibrado para largas sesiones de escucha.', highlight: true },
      { name: 'ANALOG OLD FASHIONED', price: '13,50', description: 'Borbón, bitters de cacao y piel de naranja ahumada.' }
    ]
  },
  {
    title: 'CLASSIC SELECTION',
    items: [
      { name: 'GIN TONIC PREMIUM', price: '11,00', description: 'Selección de botánicos según la vibración de la noche.' },
      { name: 'MOSCOW MULE', price: '10,50', description: 'Ginger beer artesanal y toque de lima fresca.' },
      { name: 'MEZCAL MARGARITA', price: '13,00', description: 'Toque ahumado y sal de gusano.' }
    ]
  },
  {
    title: 'WINE & BEER',
    items: [
      { name: 'TINTO VALENCIA (COPA)', price: '4,50', description: 'Bobal seleccionado de pequeños productores locales.' },
      { name: 'BLANCO MARINA ALTA (COPA)', price: '4,00', description: 'Seco, afrutado y fresco.' },
      { name: 'CRAFT BEER MAT32', price: '5,50', description: 'IPA de edición limitada para el local.' },
      { name: 'CERVEZA DE GRIFO', price: '3,50', description: 'Fría y directa.' }
    ]
  },
  {
    title: 'HI-FI SNACKS',
    items: [
      { name: 'TABLA DE QUESOS CURADOS', price: '15,00', description: 'Selección de quesos nacionales y frutos secos.' },
      { name: 'OLIVAS RUZAFA', price: '3,50', description: 'Aliño secreto de la casa.' }
    ]
  }
];

export const MOCK_SELECTORS: SelectorSubmission[] = [];
