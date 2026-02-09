
import { Event, Post, VinylRecord, MenuCategory, SellerProfile, Artist, SelectorSubmission } from './types';

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
    avatarUrl: 'https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/7701241e-71ee-4929-18c0-d1d0d9576e00/public',
    bio: 'Paradise Garage & Loft Legacy Archive. Salsoul, West End, Prelude y rarezas de Detroit.',
    location: 'Ruzafa',
    isVerified: true,
    specialty: ['Disco', 'Boogie', 'Classic House', 'Edit Culture']
  }
];

const LABEL_SLEEVES: Record<string, string> = {
  "Salsoul Records": "https://i.discogs.com/L-897-Salsoul/fit-in/300x300.jpeg",
  "Prelude Records": "https://i.discogs.com/L-154-Prelude/fit-in/300x300.jpeg",
  "West End Records": "https://i.discogs.com/L-486-West-End/fit-in/300x300.jpeg",
  "Radar": "https://i.discogs.com/L-112-Radar/fit-in/300x300.jpeg",
  "Sound Signature": "https://i.discogs.com/L-1010-SoundSignature/fit-in/300x300.jpeg",
  "KDJ": "https://i.discogs.com/L-1020-KDJ/fit-in/300x300.jpeg",
  "Gold Mind": "https://i.discogs.com/L-122-GoldMind/fit-in/300x300.jpeg",
  "P&P": "https://i.discogs.com/L-567-PP/fit-in/300x300.jpeg"
};

const SEED_DATA = [
  { a: "Double Exposure", t: "Ten Percent", l: "Salsoul Records", g: "Disco", p: 25, f: "12\"", d: "Original Walter Gibbons 12\" mix. High fidelity pressing with deep bass groove." },
  { a: "Taana Gardner", t: "Heartbeat", l: "West End Records", g: "Boogie", p: 35, f: "12\"", d: "Larry Levan mix. Essential club classic. Vinyl is shiny, plays loud and clear." },
  { a: "Theo Parrish", t: "First Floor Metaphor", l: "Sound Signature", g: "Detroit House", p: 45, f: "LP", d: "Triple vinyl edition. Raw, dusty Detroit house. Deadwax features handwritten notes." },
  { a: "Moodymann", t: "Silentintroduction", l: "KDJ", g: "Detroit House", p: 55, f: "LP", d: "First press on KDJ. Iconic sample-heavy masterpiece. Minor wear on spine." },
  { a: "Rahaan", t: "Rahaan Edits Vol. 1", l: "Radar", g: "Disco Edits", p: 18, f: "12\"", d: "Limited edition Chicago edits. Mastered for club sound systems." },
  { a: "Loleatta Holloway", t: "Love Sensation", l: "Gold Mind", g: "Disco", p: 22, f: "12\"", d: "Classic Tom Moulton mix. Vocal power is unmatched on this original pressing." },
  { a: "D-Train", t: "Keep On", l: "Prelude Records", g: "Boogie", p: 15, f: "12\"", d: "François K mix. Top copy with original Prelude company sleeve." },
  { a: "First Choice", t: "Doctor Love", l: "Gold Mind", g: "Disco", p: 20, f: "12\"", d: "The ultimate Salsoul anthem. Tom Moulton's engineering at its peak." },
  { a: "Joe Bataan", t: "The Bottle", l: "Salsoul Records", g: "Latin Disco", p: 28, f: "12\"", d: "Rare 12\" version. Latin-funk masterpiece in pristine condition." },
  { a: "Loose Joints", t: "Tell You Today", l: "West End Records", g: "Disco", p: 32, f: "12\"", d: "Arthur Russell production. Avant-garde disco at its finest. Clean labels." },
  { a: "Candido", t: "Jingo", l: "Salsoul Records", g: "Latin Disco", p: 24, f: "12\"", d: "Stunning percussion break. Heavily played at The Loft by David Mancuso." },
  { a: "Sharon Redd", t: "Beat The Street", l: "Prelude Records", g: "Electro Disco", p: 19, f: "12\"", d: "Synthesizer heaven. A must-have for the midnight hour." },
  { a: "Instant Funk", t: "I Got My Mind Made Up", l: "Salsoul Records", g: "Disco", p: 14, f: "12\"", d: "Bass heavy mix. One of the tightest grooves in the Salsoul catalog." },
  { a: "Sparque", t: "Let's Go Dancin'", l: "West End Records", g: "Boogie", p: 26, f: "12\"", d: "Produced by Milton Hamilton. Larry Levan's Garage favorite." },
  { a: "The Salsoul Orchestra", t: "Nice 'N' Naasty", l: "Salsoul Records", g: "Disco", p: 22, f: "LP", d: "Classic LP featuring the full orchestral sound of Philadelphia." }
];

const generateUnique150 = (): VinylRecord[] => {
  const records: VinylRecord[] = [];
  const variants = ["(Original)", "(Promo Copy)", "(White Label)", "(Japanese Import)", "(Test Pressing)", "(US First Press)", "(Reissue)", "(Club Edit)"];
  const conds = ["Mint", "NM", "VG+", "VG"];
  const auctionNotes = [
    "Shiny vinyl, looks unplayed.",
    "Very clean copy with minor shelf wear.",
    "Deadstock copy found in New York warehouse.",
    "Labels are crisp with no spindle marks.",
    "Heavy weight pressing with superior dynamics.",
    "Original company sleeve included, minor creasing.",
    "Rare variant with unique runout matrix.",
    "Tested on Altec system, plays flawless."
  ];

  for (let i = 0; i < 150; i++) {
    const seed = SEED_DATA[i % SEED_DATA.length];
    const variant = variants[Math.floor(i / SEED_DATA.length) % variants.length];
    const auctionNote = auctionNotes[Math.floor(i / (150 / auctionNotes.length)) % auctionNotes.length];
    
    let finalCover = seed.f === "12\"" && LABEL_SLEEVES[seed.l] ? LABEL_SLEEVES[seed.l] : `https://images.unsplash.com/photo-${1619983081563 + i}-430f63602796?q=80&w=800`;
    
    const isSold = i % 4 === 0; // 25% sold out rate

    records.push({
      id: `v_hub_${i + 1}`,
      sku: `MAT-HUB-${4000 + i}`,
      artist: seed.a,
      title: `${seed.t} ${i >= SEED_DATA.length ? variant : ""}`,
      slug: `${seed.a.toLowerCase().replace(/\s+/g, '-')}-${seed.t.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      label: seed.l,
      year: (1975 + (i % 30)).toString(),
      format: seed.f,
      condition: conds[i % conds.length],
      genre: seed.g,
      price: seed.p + (i % 10) - 5, // Oscillating around 25
      stock: isSold ? 0 : 1,
      coverUrl: finalCover,
      discogsLink: "https://www.discogs.com/user/ACTIVISTA/collection",
      description: `${seed.d} ${auctionNote}`,
      sellerId: 's_mat32',
      status: isSold ? 'sold' : 'published',
      tags: [seed.g.toLowerCase(), 'popsike_verified', seed.l.toLowerCase().replace(/\s+/g, '_')]
    });
  }
  return records;
};

export const MOCK_RECORDS: VinylRecord[] = generateUnique150();

export const MOCK_POSTS: Post[] = [
  {
    id: 'p_hub_1',
    type: 'POST',
    title: 'Detroit Heritage Collection',
    slug: 'detroit-heritage',
    author: 'analog_digger',
    content: 'Acabamos de catalogar 150 piezas únicas. Desde Theo Parrish hasta Moodymann, con prensajes originales de Salsoul. #DetroitHouse #DiscoHeritage',
    imageUrl: "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/ac1a7472-de26-46de-37f3-7ec5509f5900/public",
    likes: 245,
    comments: [],
    timestamp: 'Hace 15 minutos',
    tags: ['#DeepHouse', '#Detroit'],
    status: 'published'
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e_hub_1',
    title: 'The Sound of Detroit',
    slug: 'sound-detroit-session',
    date: '2025-02-28',
    time: '21:00',
    location: 'Mat32 Ruzafa',
    description: 'Listening session dedicada a los sellos KDJ y Sound Signature. Sonido crudo para el sistema Altec.',
    category: 'Listening Session',
    imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800',
    attendees: 45,
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
    title: 'MIXOLOGÍA ANALÓGICA',
    items: [
      { name: 'KDJ SOUR', price: '10,50', description: 'Bourbon, Limón, Bitters de cacao y alma de Detroit.', highlight: true },
      { name: 'SIGNATURE PUNCH', price: '9,50', description: 'Ron oscuro, lima y jarabe de especias.', highlight: true }
    ]
  },
  {
    title: 'HUB DRINKS',
    items: [
      { name: 'VINO D.O VALENCIA', price: '4,50', highlight: true },
      { name: 'CERVEZA RUZAFA', price: '5,50', highlight: false }
    ]
  }
];

export const MOCK_SELECTORS: SelectorSubmission[] = [];
