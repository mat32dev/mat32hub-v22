
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
    bio: 'Santuario Hi-Fi en Ruzafa. Especialistas en Disco, Boogie y Spiritual Jazz. Curaduría estricta para Altec A7.',
    location: 'Valencia, Ruzafa',
    isVerified: true,
    specialty: ['Disco', 'Spiritual Jazz', 'Detroit House']
  }
];

export const DISCOGS_PROFILE_URL = "https://www.discogs.com/es/user/discos-ruzafa";

// POOL DE IMÁGENES 2K VERIFICADAS (DISEÑO JAZZ & VINILO)
const JAZZ_RES_IMAGES = [
  "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1000",
  "https://images.unsplash.com/photo-1485579149621-3123dd979885?q=80&w=1000",
  "https://images.unsplash.com/photo-1514525253344-f814d0743b17?q=80&w=1000",
  "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1000",
  "https://images.unsplash.com/photo-1502773860571-211a597d6e4b?q=80&w=1000",
  "https://images.unsplash.com/photo-1496293455970-f8581aae0e3c?q=80&w=1000",
  "https://images.unsplash.com/photo-1525994886773-080587e161c3?q=80&w=1000"
];

const DISCO_RES_IMAGES = [
  "https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=1000",
  "https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=1000",
  "https://images.unsplash.com/photo-1539375665275-f9ad415ef9ac?q=80&w=1000",
  "https://images.unsplash.com/photo-1629121289381-08f64ef4c22e?q=80&w=1000",
  "https://images.unsplash.com/photo-1542204113-1d019f1a0e8c?q=80&w=1000"
];

const JAZZ_DATA_SEEDS = [
  { a: "John Coltrane", t: "A Love Supreme", l: "Impulse!", y: "1965", g: "Spiritual Jazz", p: 180, d: "Original Gatefold. AS-77. Matrix: RVG Stereo. Masterpiece in immaculate condition." },
  { a: "Alice Coltrane", t: "Journey In Satchidananda", l: "Impulse!", y: "1971", g: "Spiritual Jazz", p: 140, d: "Pharoah Sanders on sax. AS-9203. Bell Sound Matrix. Essential spiritual trip." },
  { a: "Pharoah Sanders", t: "Karma", l: "Impulse!", y: "1969", g: "Spiritual Jazz", p: 125, d: "AS-9181. Features 'The Creator Has A Master Plan'. High-fidelity Van Gelder pressing." },
  { a: "Sun Ra", t: "Lanquidity", l: "Philly Jazz", y: "1978", g: "Afrofuturism Jazz", p: 250, d: "Rare Philly Jazz first pressing. PJ-666. Deep groove. The ultimate jazz-funk cosmic album." },
  { a: "Archie Shepp", t: "Attica Blues", l: "Impulse!", y: "1972", g: "Jazz Funk", p: 85, d: "AS-9222. Ornate gatefold. Politics and spiritual soul jazz. No ring wear." },
  { a: "Lonnie Liston Smith", t: "Expansions", l: "Flying Dutchman", y: "1975", g: "Cosmic Jazz", p: 65, d: "BDL1-0934. Original US pressing. Spiritual dancefloor burner. Tested on A7." },
  { a: "Don Cherry", t: "Brown Rice", l: "Horizon", y: "1975", g: "Spiritual Jazz", p: 95, d: "SP-717. US Gatefold. Avant-garde spiritual fusion. Top archive copy." },
  { a: "McCoy Tyner", t: "Sahara", l: "Milestone", y: "1972", g: "Spiritual Jazz", p: 55, d: "M-9039. Rudy Van Gelder master. Powerful spiritual performance. Near Mint." },
  { a: "Gary Bartz NTU Troop", t: "I've Known Rivers", l: "Prestige", y: "1973", g: "Spiritual Jazz", p: 110, d: "P-10071. Live at Montreux. Deep spiritual soul. Rare 2LP set in collectors grade." },
  { a: "Clifford Jordan", t: "Glass Bead Games", l: "Strata-East", y: "1973", g: "Spiritual Jazz", p: 450, d: "SES-19737/8. Legendary double LP. Audiophile holy grail. Pristine condition." }
];

const DISCO_DATA_SEEDS = [
  { a: "Double Exposure", t: "Ten Percent", l: "Salsoul", y: "1976", g: "Disco", p: 75, d: "Walter Gibbons 12\" Mix. Matrix #SZS-5508. First commercial 12-inch." },
  { a: "Taana Gardner", t: "Heartbeat", l: "West End", y: "1981", g: "Boogie", p: 85, d: "Larry Levan Mix. WES-22132. Paradise Garage anthem." },
  { a: "Loleatta Holloway", t: "Love Sensation", l: "Gold Mind", y: "1980", g: "Disco", p: 55, d: "Tom Moulton Mix. G-12-4001. Matrix: F/W Master." },
  { a: "D-Train", t: "Keep On", l: "Prelude", y: "1982", g: "Boogie", p: 42, d: "François K Remix. PRL D 621. Matrix: F/W etched." },
  { a: "Moodymann", t: "Silentintroduction", l: "KDJ", y: "1997", g: "Detroit House", p: 150, d: "KDJ-001. Hand-stamped. First pressing. Lo-fi Detroit house." }
];

const generateUnique200Archive = (): VinylRecord[] => {
  const records: VinylRecord[] = [];
  
  // 50 SPIRITUAL JAZZ ITEMS
  for (let i = 0; i < 50; i++) {
    const seed = JAZZ_DATA_SEEDS[i % JAZZ_DATA_SEEDS.length];
    const imgUrl = JAZZ_RES_IMAGES[i % JAZZ_RES_IMAGES.length];
    const suffix = i < 10 ? "Original First Press" : "Audiophile Reissue";
    
    records.push({
      id: `rz_jazz_v13_${i + 1}`,
      sku: `MAT32-JZ-${1000 + i}`,
      artist: seed.a,
      title: `${seed.t} (${suffix})`,
      slug: `jazz-${seed.a.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      label: seed.l,
      year: seed.y,
      format: "LP",
      condition: "NM",
      genre: "Spiritual Jazz",
      price: seed.p + (i % 5) * 10,
      stock: 1,
      coverUrl: imgUrl,
      discogsLink: DISCOGS_PROFILE_URL,
      description: `${seed.d} Checked for Altec A7 dynamics.`,
      sellerId: 'discos_ruzafa',
      status: 'published',
      tags: ['spiritual_jazz', 'impulse', 'audiophile', 'blue_note', 'van_gelder']
    });
  }

  // 150 DISCO/HOUSE ITEMS
  for (let i = 0; i < 150; i++) {
    const seed = DISCO_DATA_SEEDS[i % DISCO_DATA_SEEDS.length];
    const imgUrl = DISCO_RES_IMAGES[i % DISCO_RES_IMAGES.length];
    
    records.push({
      id: `rz_disco_v13_${i + 1}`,
      sku: `MAT32-RZ-${9000 + i}`,
      artist: seed.a,
      title: `${seed.t} (Archive Select)`,
      slug: `disco-${seed.a.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      label: seed.l,
      year: seed.y,
      format: "12\"",
      condition: "VG+",
      genre: seed.g,
      price: Math.max(18, seed.p + (i % 8) * 5),
      stock: i % 15 === 0 ? 0 : 1,
      coverUrl: imgUrl,
      discogsLink: DISCOGS_PROFILE_URL,
      description: `${seed.d} Ruzafa Hi-Fi tested copy.`,
      sellerId: 'discos_ruzafa',
      status: i % 15 === 0 ? 'sold' : 'published',
      tags: [seed.g.toLowerCase(), 'new_arrival', 'high_fidelity']
    });
  }

  return records;
};

export const MOCK_RECORDS: VinylRecord[] = generateUnique200Archive();

export const MOCK_POSTS: Post[] = [
  {
    id: 'p_rz_13',
    type: 'POST',
    title: 'Spiritual Jazz Archive v13.0',
    slug: 'spiritual-jazz-archive',
    author: 'discos_ruzafa',
    content: 'Hemos recibido 50 piezas maestras de Spiritual Jazz. Coltrane, Sanders, Strata-East. Sonido para elevar el alma. #Impulse #SpiritualJazz #Mat32',
    imageUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1200",
    likes: 1250,
    comments: [],
    timestamp: 'Hace unos segundos',
    tags: ['#JazzHeritage', '#SpiritualJazz'],
    status: 'published'
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e_rz_13',
    title: 'A Love Supreme: Listening Session',
    slug: 'love-supreme-mat32',
    date: '2025-04-12',
    time: '21:00',
    location: 'Mat32 Ruzafa',
    description: 'Escucha íntegra del álbum más sagrado de John Coltrane en el sistema Altec A7. Sin interrupciones.',
    category: 'Listening Session',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1000',
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
      { name: 'A LOVE SUPREME', price: '13,00', description: 'Gin Mare, albahaca fresca, limón y un toque místico de jazmín.', highlight: true },
      { name: 'LANQUIDITY SOUR', price: '11,50', description: 'Pisco, amargo de angostura y polvo de estrellas (Sun Ra vibe).', highlight: true }
    ]
  },
  {
    title: 'MAT32 SELECTION',
    items: [
      { name: 'CERVEZA ARTESANA', price: '6,50', highlight: true },
      { name: 'VINO RUZAFA', price: '4,50', highlight: false }
    ]
  }
];

export const MOCK_SELECTORS: SelectorSubmission[] = [];
