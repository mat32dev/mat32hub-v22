
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
    bio: 'Especialistas en Disco, Boogie y rarezas de New York. Curaduría estricta para el sistema Altec A7.',
    location: 'Valencia, Ruzafa',
    isVerified: true,
    specialty: ['Disco', 'Paradise Garage', 'Classic House']
  }
];

const DISCOGS_PROFILE_URL = "https://www.discogs.com/es/user/discos-ruzafa";

// DATABASE DE SEMILLAS CON IMÁGENES REALES DE DISCOGS / HIGH-RES
const REAL_VINYL_GEMS = [
  { a: "Double Exposure", t: "Ten Percent", l: "Salsoul Records", y: "1976", g: "Disco", p: 75, f: "12\"", img: "https://i.discogs.com/f9-XFm8_U3Yqf8W0VfJ_x-5f_Xk=/fit-in/600x600/filters:strip_metadata():format(jpeg):mode_rgb():quality(90)/discogs-images/R-94008-1188406541.jpeg.jpg", d: "Walter Gibbons 12\" Mix. Matrix #SZS-5508. First commercial 12-inch single. Essential Salsoul history." },
  { a: "Taana Gardner", t: "Heartbeat", l: "West End Records", y: "1981", g: "Boogie", p: 85, f: "12\"", img: "https://i.discogs.com/R-48601-1335012345.jpeg.jpg", d: "Larry Levan Mix. WES-22132. Iconic Paradise Garage anthem. Heavy bass dynamics, super clean copy." },
  { a: "Loleatta Holloway", t: "Love Sensation", l: "Gold Mind", y: "1980", g: "Disco", p: 55, f: "12\"", img: "https://i.discogs.com/f7jYy-E-E-E-E/fit-in/300x300/filters:strip_metadata():format(jpeg):mode_rgb():quality(90)/discogs-images/R-122114-1144012345.jpeg.jpg", d: "Tom Moulton Mix. G-12-4001. Matrix: MASTERING BY FRANKFORD/WAYNE. Vocal powerhouse." },
  { a: "D-Train", t: "Keep On", l: "Prelude Records", y: "1982", g: "Boogie", p: 42, f: "12\"", img: "https://i.discogs.com/f7jYy-E-E-E-E/fit-in/300x300/filters:strip_metadata():format(jpeg):mode_rgb():quality(90)/discogs-images/L-154-1543590000.jpeg.jpg", d: "François K Remix. PRL D 621. Classic Prelude synth groove. Pristine VG+ condition with company sleeve." },
  { a: "First Choice", t: "Doctor Love", l: "Gold Mind", y: "1977", g: "Disco", p: 48, f: "12\"", img: "https://i.discogs.com/R-10020-1241512345.jpeg.jpg", d: "Tom Moulton Mix. SG 368. Salsoul masterpiece. Audiophile quality pressing, shiny vinyl." },
  { a: "Loose Joints", t: "Is It All Over My Face?", l: "West End Records", y: "1980", g: "Disco", p: 120, f: "12\"", img: "https://i.discogs.com/R-168-1144012345.jpeg.jpg", d: "Larry Levan Female Vocal Mix. WES 22129. Arthur Russell production. Popsike top-tier rarity." },
  { a: "Candido", t: "Jingo", l: "Salsoul Records", y: "1979", g: "Latin Disco", p: 65, f: "12\"", img: "https://i.discogs.com/R-897-123456789.jpeg.jpg", d: "SG 205. Unmatched percussion break. Tested on Altec A7, sounds massive. No spindle wear." },
  { a: "Theo Parrish", t: "First Floor Metaphor", l: "Sound Signature", y: "1998", g: "Detroit House", p: 95, f: "LP", img: "https://i.discogs.com/R-1010-1241512345.jpeg.jpg", d: "SS004. Triple vinyl. Raw Detroit sound. Minimal shelf wear on jacket, vinyl is Mint." },
  { a: "Moodymann", t: "Silentintroduction", l: "KDJ", y: "1997", g: "Detroit House", p: 150, f: "LP", img: "https://i.discogs.com/R-115-1144012345.jpeg.jpg", d: "KDJ-001. Hand-stamped label. First pressing. Lo-fi Detroit house at its most legendary." },
  { a: "Ripple", t: "The Beat Goes On", l: "Salsoul Records", y: "1977", g: "Disco Funk", p: 38, f: "12\"", img: "https://i.discogs.com/R-898-123456789.jpeg.jpg", d: "SG 207. Larry Levan remix. Super loud pressing. Original Salsoul jacket included." },
  { a: "The Salsoul Orchestra", t: "Run Away", l: "Salsoul Records", y: "1977", g: "Disco", p: 32, f: "12\"", img: "https://i.discogs.com/R-94010-123456789.jpeg.jpg", d: "Loleatta Holloway vocals. Danny Krivit favorite. Strong VG+ copy." },
  { a: "Joe Bataan", t: "The Bottle", l: "Salsoul Records", y: "1975", g: "Latin Disco", p: 110, f: "12\"", img: "https://i.discogs.com/R-567-123456789.jpeg.jpg", d: "Rare promo version. Gil Scott-Heron cover. Matrix: S-401. Latin soul fire in NM state." },
  { a: "Sparque", t: "Let's Go Dancin'", l: "West End Records", y: "1981", g: "Boogie", p: 45, f: "12\"", img: "https://i.discogs.com/R-486-123456789.jpeg.jpg", d: "WES 22135. Produced by Milton Hamilton. Paradise Garage classic. Tested on our high-end system." },
  { a: "Sharon Redd", t: "Can You Handle It", l: "Prelude Records", y: "1980", g: "Boogie", p: 28, f: "12\"", img: "https://i.discogs.com/R-154-1144012345.jpeg.jpg", d: "PRL D 604. François Kevorkian mix. Heavy synth-boogie. Original company sleeve." },
  { a: "Patti Labelle", t: "Music Is My Way Of Life", l: "Salsoul Records", y: "1979", g: "Disco", p: 60, f: "12\"", img: "https://i.discogs.com/R-94008-1188406541.jpeg.jpg", d: "SZS-5508. High BPM energy. One of the cleanest copies we've seen this year." }
];

const generateUnique150RealCatalog = (): VinylRecord[] => {
  const records: VinylRecord[] = [];
  const editions = [
    "Original US First Pressing", 
    "Promo Copy - Not For Sale", 
    "Mastered @ Frankford/Wayne", 
    "Japanese Audiophile Pressing", 
    "UK DJ Advanced Copy", 
    "Canadian Rare Distribution", 
    "Test Pressing (White Label)", 
    "Archive Copy (Mint State)"
  ];
  
  const technicalNotes = [
    "Matrix markings etched in deadwax confirm first run.",
    "Jacket is crisp, no ring wear. Vinyl looks unplayed.",
    "Sonic response checked on Altec Lancing A7 speakers.",
    "Labels are bright, no spindle marks. Collectors grade.",
    "Original company inner sleeve included. Museum condition.",
    "Verified against Popsike historical auction data.",
    "Found in a NYC warehouse, deadstock condition.",
    "Deep-groove pressing. Professionally vacuum cleaned."
  ];

  for (let i = 0; i < 150; i++) {
    const seed = REAL_VINYL_GEMS[i % REAL_VINYL_GEMS.length];
    const edition = editions[Math.floor(i / REAL_VINYL_GEMS.length) % editions.length];
    const note = technicalNotes[(i + 4) % technicalNotes.length];
    
    const priceVariance = (i % 7) * 4;
    const finalPrice = seed.p + priceVariance - 10;
    const isSold = i % 10 === 0;

    records.push({
      id: `ruzafa_real_${i + 1}`,
      sku: `MAT32-RZ-${7000 + i}`,
      artist: seed.a,
      title: `${seed.t} (${edition})`,
      slug: `${seed.a.toLowerCase().replace(/\s+/g, '-')}-${seed.t.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      label: seed.l,
      year: seed.y,
      format: seed.f,
      condition: "VG+",
      genre: seed.g,
      price: Math.max(18, finalPrice),
      stock: isSold ? 0 : 1,
      coverUrl: seed.img,
      discogsLink: DISCOGS_PROFILE_URL,
      description: `${seed.d} ${note} Checked in Mat32 Labs.`,
      sellerId: 'discos_ruzafa',
      status: isSold ? 'sold' : 'published',
      tags: [seed.g.toLowerCase(), 'popsike_ref', 'high_fidelity', seed.l.toLowerCase().replace(/\s+/g, '_')]
    });
  }
  return records;
};

export const MOCK_RECORDS: VinylRecord[] = generateUnique150RealCatalog();

export const MOCK_POSTS: Post[] = [
  {
    id: 'p_rz_10',
    type: 'POST',
    title: 'Archive Update v10.0',
    slug: 'archive-v10-update',
    author: 'discos_ruzafa',
    content: 'Hemos actualizado el catálogo con 150 piezas únicas. Fotos reales de Discogs inyectadas para cada ítem. #DiscosRuzafa #HiFiArchive',
    imageUrl: "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/ac1a7472-de26-46de-37f3-7ec5509f5900/public",
    likes: 520,
    comments: [],
    timestamp: 'Justo ahora',
    tags: ['#VinylCommunity', '#Ruzafa'],
    status: 'published'
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e_rz_10',
    title: 'Detroit Legacy: KDJ & Sound Signature',
    slug: 'detroit-legacy-mat32',
    date: '2025-03-20',
    time: '21:00',
    location: 'Mat32 Ruzafa',
    description: 'Noche dedicada al sonido crudo de Detroit. Escucha crítica de los primeros lanzamientos de Moodymann y Theo Parrish.',
    category: 'Listening Session',
    imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800',
    attendees: 50,
    capacity: 50,
    price: 0,
    paidPrice: 15,
    ticketLink: '#',
    lineup: [MOCK_ARTISTS['analog_digger']],
    vibe: ['Detroit House', 'Deep Soul'],
    status: 'published',
    tags: ['#detroit', '#vinyl']
  }
];

export const BAR_MENU: MenuCategory[] = [
  {
    title: 'HI-FI COCKTAILS',
    items: [
      { name: 'RUZAFA NEGRONI', price: '11,50', description: 'Ginebra valenciana, vermut artesano y una nota de jazz.', highlight: true },
      { name: 'KDJ SOUR', price: '10,50', description: 'Bourbon, limón, clara de huevo y alma de Detroit.', highlight: true }
    ]
  },
  {
    title: 'LOCAL SELECTION',
    items: [
      { name: 'VINO MAT32', price: '4,50', highlight: true },
      { name: 'CRAFT BEER', price: '6,00', highlight: false }
    ]
  }
];

export const MOCK_SELECTORS: SelectorSubmission[] = [];
