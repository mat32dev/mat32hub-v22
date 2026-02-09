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
    avatarUrl: 'https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/7701241e-71ee-4929-18c0-d1d0d9576e00/public',
    bio: 'Santuario Hi-Fi en Ruzafa. Especialistas en Spiritual Jazz, Disco y rarezas neoyorquinas. Curaduría estricta.',
    location: 'Valencia, Ruzafa',
    isVerified: true,
    specialty: ['Spiritual Jazz', 'Disco', 'Audiophile Records']
  }
];

export const DISCOGS_PROFILE_URL = "https://www.discogs.com/es/user/discos-ruzafa";

// POOL DE FOTOGRAFÍAS REALES (ARTISTAS & ATMÓSFERA HI-FI)
const REAL_ARTIST_IMAGES = [
  "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1000", // Jazz Piano
  "https://images.unsplash.com/photo-1514525253344-f814d0743b17?q=80&w=1000", // Sax Player
  "https://images.unsplash.com/photo-1485579149621-3123dd979885?q=80&w=1000", // Vintage Artist vibe
  "https://images.unsplash.com/photo-1525994886773-080587e161c3?q=80&w=1000", // Double Bass
  "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1000", // Vocalist
  "https://images.unsplash.com/photo-1502773860571-211a597d6e4b?q=80&w=1000", // Jazz Club vibe
  "https://images.unsplash.com/photo-1496293455970-f8581aae0e3c?q=80&w=1000", // Trumpet
  "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000", // Classic Booth
  "https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=1000", // Hands on Vinyl
  "https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=1000"  // Record Crate
];

const JAZZ_SEEDS = [
  { a: "John Coltrane", t: "A Love Supreme", ed: "(Original Gatefold First Pressing)", l: "Impulse!", y: "1965", d: "AS-77. Matrix: RVG Stereo etched. Immaculate condition, sonic masterpiece." },
  { a: "Alice Coltrane", t: "Journey In Satchidananda", ed: "(Original First Pressing)", l: "Impulse!", y: "1971", d: "AS-9203. Bell Sound Matrix. Featuring Pharoah Sanders. Essential spiritual trip." },
  { a: "Pharoah Sanders", t: "Karma", ed: "(Original First Pressing)", l: "Impulse!", y: "1969", d: "AS-9181. Van Gelder Master. The ultimate cosmic jazz experience." },
  { a: "Sun Ra", t: "Lanquidity", ed: "(Rare Philly Jazz Edition)", l: "Philly Jazz", y: "1978", d: "PJ-666. Deep groove. Cosmic jazz-funk holy grail." },
  { a: "Archie Shepp", t: "Attica Blues", ed: "(Original US Gatefold)", l: "Impulse!", y: "1972", d: "AS-9222. Politics and spiritual soul jazz in NM state." },
  { a: "McCoy Tyner", t: "Sahara", ed: "(Rudy Van Gelder Master)", l: "Milestone", y: "1972", d: "M-9039. Powerful performance with stunning dynamics." },
  { a: "Don Cherry", t: "Brown Rice", ed: "(US Horizon Original)", l: "Horizon", y: "1975", d: "SP-717. Avant-garde spiritual fusion. Top archive copy." },
  { a: "Gary Bartz NTU Troop", t: "I've Known Rivers", ed: "(Live at Montreux 2LP Set)", l: "Prestige", y: "1973", d: "P-10071. Deep spiritual soul. Rare 2LP in collectors grade." },
  { a: "Clifford Jordan", t: "Glass Bead Games", ed: "(Original Strata-East)", l: "Strata-East", y: "1973", d: "SES-19737/8. Legendary audiophile holy grail." },
  { a: "Lonnie Liston Smith", t: "Expansions", ed: "(US Flying Dutchman First Press)", l: "Flying Dutchman", y: "1975", d: "BDL1-0934. Cosmic dancefloor burner. Tested on A7." }
];

const DISCO_SEEDS = [
  { a: "Double Exposure", t: "Ten Percent", ed: "(Salsoul 12\" First Edition)", l: "Salsoul", y: "1976", d: "Walter Gibbons Mix. Matrix #SZS-5508. First commercial 12-inch." },
  { a: "Taana Gardner", t: "Heartbeat", ed: "(West End Original)", l: "West End", y: "1981", d: "Larry Levan Mix. WES-22132. Paradise Garage anthem." },
  { a: "Loleatta Holloway", t: "Love Sensation", ed: "(Gold Mind Masterpiece)", l: "Gold Mind", y: "1980", d: "Tom Moulton Mix. G-12-4001. Matrix: F/W Master." },
  { a: "D-Train", t: "Keep On", ed: "(Prelude Synth Classic)", l: "Prelude", y: "1982", d: "François K Remix. PRL D 621. Pristine VG+." },
  { a: "First Choice", t: "Doctor Love", ed: "(Salsoul Promo Copy)", l: "Salsoul", y: "1977", d: "Tom Moulton Mix. SG 368. Audiophile quality pressing." }
];

const generateUnique200ArchiveV14 = (): VinylRecord[] => {
  const records: VinylRecord[] = [];
  
  // 50 SPIRITUAL JAZZ ITEMS (V14 Format: Title = Artist)
  for (let i = 0; i < 50; i++) {
    const seed = JAZZ_SEEDS[i % JAZZ_SEEDS.length];
    const imgUrl = REAL_ARTIST_IMAGES[i % REAL_ARTIST_IMAGES.length];
    
    records.push({
      id: `rz_jazz_v14_${i + 1}`,
      sku: `MAT32-JZ-${2000 + i}`,
      artist: seed.a,
      title: seed.a, // FORMATEO: Solo nombre del artista
      slug: `jazz-${seed.a.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      label: seed.l,
      year: seed.y,
      format: "LP",
      condition: "NM",
      genre: "Spiritual Jazz",
      price: 65 + (i % 8) * 15,
      stock: 1,
      coverUrl: imgUrl, // FOTO REAL DE ARTISTA / AMBIENTE
      discogsLink: DISCOGS_PROFILE_URL,
      description: `${seed.t} ${seed.ed}. ${seed.d}`, // ÁLBUM Y INFO EN DESCRIPCIÓN
      sellerId: 'discos_ruzafa',
      status: 'published',
      tags: ['spiritual_jazz', 'impulse', 'audiophile', 'blue_note', 'van_gelder']
    });
  }

  // 150 DISCO/HOUSE ITEMS (V14 Format: Title = Artist)
  for (let i = 0; i < 150; i++) {
    const seed = DISCO_SEEDS[i % DISCO_SEEDS.length];
    const imgUrl = REAL_ARTIST_IMAGES[(i + 5) % REAL_ARTIST_IMAGES.length];
    
    records.push({
      id: `rz_disco_v14_${i + 1}`,
      sku: `MAT32-RZ-${10000 + i}`,
      artist: seed.a,
      title: seed.a, // FORMATEO: Solo nombre del artista
      slug: `disco-${seed.a.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      label: seed.l,
      year: seed.y,
      format: "12\"",
      condition: "VG+",
      // Fix: Removed reference to non-existent property 'g' in seed object.
      genre: "Disco",
      price: 25 + (i % 6) * 5,
      stock: i % 20 === 0 ? 0 : 1,
      coverUrl: imgUrl, // FOTO REAL DE ARTISTA / AMBIENTE
      discogsLink: DISCOGS_PROFILE_URL,
      description: `${seed.t} ${seed.ed}. ${seed.d}`, // ÁLBUM Y INFO EN DESCRIPCIÓN
      sellerId: 'discos_ruzafa',
      status: i % 20 === 0 ? 'sold' : 'published',
      tags: ['disco', 'boogie', 'house', 'new_arrival']
    });
  }

  return records;
};

export const MOCK_RECORDS: VinylRecord[] = generateUnique200ArchiveV14();

export const MOCK_POSTS: Post[] = [
  {
    id: 'p_rz_14',
    type: 'POST',
    title: 'Artist Hub v14.0',
    slug: 'artist-hub-v14',
    author: 'discos_ruzafa',
    content: 'Hemos rediseñado el catálogo. Ahora puedes navegar por artistas. Disfruta de nuestra selección de Spiritual Jazz con fotos reales de los maestros. #SpiritualJazz #Mat32 #Impulse',
    imageUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1200",
    likes: 950,
    comments: [],
    timestamp: 'Hace unos segundos',
    tags: ['#JazzMasters', '#VinylOnly'],
    status: 'published'
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e_rz_14',
    title: 'Coltrane: The Deep Dive',
    slug: 'coltrane-deep-dive',
    date: '2025-04-19',
    time: '21:00',
    location: 'Mat32 Ruzafa',
    description: 'Sesión de escucha crítica centrada en la etapa Impulse! de John y Alice Coltrane. Un viaje sonoro por el sistema Altec A7.',
    category: 'Listening Session',
    imageUrl: 'https://images.unsplash.com/photo-1514525253344-f814d0743b17?q=80&w=1000',
    attendees: 50,
    capacity: 50,
    price: 0,
    paidPrice: 15,
    ticketLink: '#',
    lineup: [MOCK_ARTISTS['analog_digger']],
    vibe: ['Coltrane', 'Spiritual Energy'],
    status: 'published',
    tags: ['#jazz', '#coltrane']
  }
];

export const BAR_MENU: MenuCategory[] = [
  {
    title: 'SPIRITUAL COCKTAILS',
    items: [
      { name: 'JOURNEY IN SATCHIDANANDA', price: '13,50', description: 'Mezcla exótica de especias, Gin y un toque de serenidad.', highlight: true },
      { name: 'KARMA SOUR', price: '11,00', description: 'Bourbon, limón y esencia mística de Pharoah Sanders.', highlight: true }
    ]
  },
  {
    title: 'MAT32 SELECTION',
    items: [
      { name: 'CRAFT JAZZ BEER', price: '6,50', highlight: true },
      { name: 'VINO DE RUZAFA', price: '4,50', highlight: false }
    ]
  }
];

export const MOCK_SELECTORS: SelectorSubmission[] = [];