
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

const generateUnique200ArchiveV22 = (): VinylRecord[] => {
  const records: VinylRecord[] = [];
  
  for (let i = 0; i < 50; i++) {
    const seed = JAZZ_SEEDS[i % JAZZ_SEEDS.length];
    records.push({
      id: `rz_jazz_v22_${i + 1}`,
      sku: `MAT32-JZ-22-${i}`,
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
      id: `rz_disco_v22_${i + 1}`,
      sku: `MAT32-RZ-22-${i}`,
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

export const MOCK_RECORDS: VinylRecord[] = generateUnique200ArchiveV22();

export const MOCK_POSTS: Post[] = [
  {
    id: 'p_rz_22',
    type: 'POST',
    title: 'Archive v22.0: The Full Menu Protocol',
    slug: 'full-menu-v22',
    author: 'discos_ruzafa',
    content: 'Carta del bar restaurada y nuevas Listening Sessions programadas. El ritual analógico continúa en Ruzafa. #Mat32 #Valencia #ListeningSession',
    imageUrl: "",
    likes: 4200,
    comments: [],
    timestamp: 'Hace 5 minutos',
    tags: ['#BarCulture', '#HiFi'],
    status: 'published'
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e_listening_12_jun',
    title: 'Listening Session: Blue Note Deep Dive',
    slug: 'blue-note-listening-session',
    date: '2025-06-12',
    time: '21:00',
    location: 'Mat32 Ruzafa',
    description: 'Exploración técnica del surco en las producciones de Rudy Van Gelder para Blue Note. Jazz puro en Altec A7.',
    category: 'Listening Session',
    imageUrl: '',
    attendees: 0,
    capacity: 100,
    price: 0,
    paidPrice: 0,
    ticketLink: '#',
    lineup: [MOCK_ARTISTS['analog_digger']],
    vibe: ['Technical', 'Pure Jazz', 'Van Gelder Sound'],
    status: 'published',
    tags: ['#jazz', '#bluenote', '#listening']
  },
  {
    id: 'e_listening_19_jun',
    title: 'Listening Session: Salsoul Archive',
    slug: 'salsoul-archive-session',
    date: '2025-06-19',
    time: '21:00',
    location: 'Mat32 Ruzafa',
    description: 'Análisis y disfrute de los maxi-singles del sello Salsoul. La orquesta Disco en su máxima fidelidad.',
    category: 'Listening Session',
    imageUrl: '',
    attendees: 0,
    capacity: 100,
    price: 0,
    paidPrice: 0,
    ticketLink: '#',
    lineup: [MOCK_ARTISTS['soulman']],
    vibe: ['Disco', 'Orchestral', 'Analog Drive'],
    status: 'published',
    tags: ['#disco', '#salsoul', '#archive']
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
