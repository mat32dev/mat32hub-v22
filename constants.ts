
import { Event, Post, VinylRecord, MenuCategory, SellerProfile, Artist, SelectorSubmission } from './types';

const getFutureDate = (daysFromNow: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
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
    avatarUrl: 'https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/7701241e-71ee-4929-18c0-d1d0d9576e00/public',
    bio: 'Paradise Garage & Loft Legacy Archive. Salsoul, West End, Prelude y rarezas de Detroit.',
    location: 'Ruzafa',
    isVerified: true,
    specialty: ['Disco', 'Boogie', 'Classic House', 'Edit Culture']
  }
];

// ICONIC LABEL SLEEVES FOR 12" SINGLES
const LABEL_SLEEVES: Record<string, string> = {
  "Salsoul Records": "https://i.discogs.com/L-897-Salsoul/fit-in/300x300.jpeg",
  "Prelude Records": "https://i.discogs.com/L-154-Prelude/fit-in/300x300.jpeg",
  "West End Records": "https://i.discogs.com/L-486-West-End/fit-in/300x300.jpeg",
  "TK Records": "https://i.discogs.com/L-234-TK/fit-in/300x300.jpeg",
  "Radar": "https://i.discogs.com/L-112-Radar/fit-in/300x300.jpeg",
  "Sound Signature": "https://i.discogs.com/L-1010-SoundSignature/fit-in/300x300.jpeg",
  "KDJ": "https://i.discogs.com/L-1020-KDJ/fit-in/300x300.jpeg",
  "Gold Mind": "https://i.discogs.com/L-122-GoldMind/fit-in/300x300.jpeg"
};

const DISCO_CORE_SEED = [
  { a: "Double Exposure", t: "Ten Percent", l: "Salsoul Records", y: "1976", g: "Disco", p: 28, f: "12\"", img: "https://i.discogs.com/R-94008-1188406541.jpeg.jpg", d: "Walter Gibbons Mix. El 12\" que cambió la historia del clubbing." },
  { a: "Taana Gardner", t: "Heartbeat", l: "West End Records", y: "1981", g: "Boogie", p: 32, f: "12\"", img: "https://i.discogs.com/R-48601-1335012345.jpeg.jpg", d: "Larry Levan Mix. El pulso del Paradise Garage en versión maxi." },
  { a: "Loleatta Holloway", t: "Love Sensation", l: "Gold Mind", y: "1980", g: "Disco", p: 24, f: "LP", img: "https://i.discogs.com/R-122114-1144012345.jpeg.jpg", d: "La voz definitiva del sello Gold Mind. LP esencial para cualquier coleccionista." },
  { a: "D-Train", t: "You're The One For Me", l: "Prelude Records", y: "1981", g: "Boogie", p: 26, f: "12\"", img: "https://i.discogs.com/R-135-1144012345.jpeg.jpg", d: "François K Mix. La cima del post-disco con sintetizadores brillantes." },
  { a: "Theo Parrish", t: "First Floor Metaphor", l: "Sound Signature", y: "1998", g: "Deep House", p: 35, f: "LP", img: "https://i.discogs.com/R-1010-1241512345.jpeg.jpg", d: "Sonido crudo de Detroit. Experimentación rítmica y alma soul." },
  { a: "Moodymann", t: "I'm Yesterday", l: "KDJ", y: "1997", g: "Detroit House", p: 42, f: "12\"", img: "https://i.discogs.com/R-115-1144012345.jpeg.jpg", d: "Rareza de Kenny Dixon Jr. Sampledelia oscura y jazzística." },
  { a: "Rahaan", t: "Chicago Edits Vol. 1", l: "Radar", y: "2005", g: "Edits", p: 20, f: "12\"", img: "https://i.discogs.com/R-112-1144012345.jpeg.jpg", d: "La magia de Chicago aplicada a rarezas disco. Pegada analógica garantizada." },
  { a: "First Choice", t: "Let No Man Put Asunder", l: "Salsoul Records", y: "1977", g: "Disco", p: 25, f: "12\"", img: "https://i.discogs.com/R-10020-1241512345.jpeg.jpg", d: "El himno que definió el sampling en el House moderno." },
  { a: "Sharon Redd", t: "Beat The Street", l: "Prelude Records", y: "1982", g: "Electro Disco", p: 22, f: "12\"", img: "https://i.discogs.com/R-154-1144012345.jpeg.jpg", d: "Sonido synth-disco futurista de la factoría Prelude." },
  { a: "Loose Joints", t: "Is It All Over My Face?", l: "West End Records", y: "1980", g: "Avant-Garde", p: 38, f: "12\"", img: "https://i.discogs.com/R-168-1144012345.jpeg.jpg", d: "Arthur Russell y Larry Levan colaborando en una obra maestra transgresora." },
  { a: "The Salsoul Orchestra", t: "Nice 'N' Naasty", l: "Salsoul Records", y: "1976", g: "Disco", p: 21, f: "LP", img: "https://i.discogs.com/R-94010-123456789.jpeg.jpg", d: "Vientos y cuerdas de Philadelphia bajo la batuta de Vincent Montana Jr." },
  { a: "Carol Williams", t: "'Lectric Lady", l: "Salsoul Records", y: "1976", g: "Soul Disco", p: 19, f: "LP", img: "https://i.discogs.com/R-94009-987654321.jpeg.jpg", d: "Disco soul sofisticado con la producción orquestal de Salsoul." }
];

const generateRecords = (): VinylRecord[] => {
  const records: VinylRecord[] = [];
  const variants = ["(Original)", "(Promo Copy)", "(White Label)", "(US Pressing)", "(Import)", "(Classic Reissue)", "(DJ Edit)"];
  
  for (let i = 0; i < 150; i++) {
    const seed = DISCO_CORE_SEED[i % DISCO_CORE_SEED.length];
    const variant = variants[Math.floor(i / DISCO_CORE_SEED.length) % variants.length];
    
    // COVER LOGIC: 12" Maxi -> Label Logo | LP -> Album Cover
    let finalCover = seed.img;
    if (seed.f === "12\"" && LABEL_SLEEVES[seed.l]) {
      finalCover = LABEL_SLEEVES[seed.l];
    }

    // STATUS LOGIC: 15% are Sold Out
    const isSold = i % 7 === 0;

    records.push({
      id: `hub_disco_${i + 1}`,
      sku: `MAT-HUB-${2000 + i}`,
      artist: seed.a,
      title: `${seed.t} ${i >= DISCO_CORE_SEED.length ? variant : ""}`,
      slug: `${seed.a.toLowerCase().replace(/\s+/g, '-')}-${seed.t.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      label: seed.l,
      year: seed.y,
      format: seed.f,
      condition: i % 10 === 0 ? "Mint" : "NM",
      genre: seed.g,
      price: i % 5 === 0 ? seed.p + 5 : seed.p - 2, // Varied but balanced pricing
      stock: isSold ? 0 : 1,
      coverUrl: finalCover,
      discogsLink: "https://www.discogs.com/user/ACTIVISTA/collection",
      description: `${seed.d} Inyectado desde el archivo Mat32 Valencia. Sonido audiófilo verificado.`,
      sellerId: 's_mat32',
      status: isSold ? 'sold' : 'published',
      tags: [seed.g.toLowerCase(), 'paradise_garage', 'disco_heritage', seed.l.toLowerCase().replace(/\s+/g, '_')]
    });
  }
  return records;
};

export const MOCK_RECORDS: VinylRecord[] = generateRecords();

export const MOCK_POSTS: Post[] = [
  {
    id: 'p_1',
    type: 'POST',
    title: 'The Garage Era is Back',
    slug: 'garage-era-back',
    author: 'mat32__',
    content: 'Acabamos de catalogar 150 piezas únicas de la era Salsoul y West End. Rarezas de Theo Parrish y Moodymann incluidas. #Disco #Ruzafa #Levan',
    imageUrl: "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/ac1a7472-de26-46de-37f3-7ec5509f5900/public",
    likes: 189,
    comments: [],
    timestamp: 'Hace 1 hora',
    tags: ['#Disco', '#RareGroove'],
    status: 'published'
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e_1',
    title: 'West End Sessions',
    slug: 'west-end-sessions',
    date: getFutureDate(6),
    time: '21:00',
    location: 'Mat32 Ruzafa',
    description: 'Noche dedicada exclusivamente al catálogo de West End Records. Solo 12\" originales.',
    category: 'Listening Session',
    imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800',
    attendees: 38,
    capacity: 50,
    price: 0,
    paidPrice: 15,
    ticketLink: '#',
    lineup: [MOCK_ARTISTS['soulman'], MOCK_ARTISTS['analog_digger']],
    vibe: ['Disco', 'Garage'],
    status: 'published',
    tags: ['#larrylevan', '#disco']
  }
];

export const BAR_MENU: MenuCategory[] = [
  {
    title: 'COCTELERÍA DISCO',
    items: [
      { name: 'WEST END SOUR', price: '10,50', description: 'Bourbon, Limón y Amargo de naranja.', highlight: true },
      { name: 'SALSOUL PUNCH', price: '9,50', description: 'Ron añejo y Fruta de la pasión.', highlight: true }
    ]
  },
  {
    title: 'HUB DRINKS',
    items: [
      { name: 'VINO D.O VALENCIA', price: '4,50', highlight: true },
      { name: 'CERVEZA ARTESANA RUZAFA', price: '5,50', highlight: false }
    ]
  }
];

export const MOCK_SELECTORS: SelectorSubmission[] = [];
