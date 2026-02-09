
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

const LABEL_SLEEVES: Record<string, string> = {
  "Salsoul Records": "https://i.discogs.com/L-897-Salsoul/fit-in/300x300.jpeg",
  "Prelude Records": "https://i.discogs.com/L-154-Prelude/fit-in/300x300.jpeg",
  "West End Records": "https://i.discogs.com/L-486-West-End/fit-in/300x300.jpeg",
  "TK Records": "https://i.discogs.com/L-234-TK/fit-in/300x300.jpeg",
  "Radar": "https://i.discogs.com/L-112-Radar/fit-in/300x300.jpeg",
  "Sound Signature": "https://i.discogs.com/L-1010-SoundSignature/fit-in/300x300.jpeg",
  "KDJ": "https://i.discogs.com/L-1020-KDJ/fit-in/300x300.jpeg",
  "Gold Mind": "https://i.discogs.com/L-122-GoldMind/fit-in/300x300.jpeg",
  "P&P Records": "https://i.discogs.com/L-567-PP/fit-in/300x300.jpeg"
};

const DISCO_MASTER_LIST = [
  { a: "Double Exposure", t: "Ten Percent", l: "Salsoul Records", y: "1976", g: "Disco", p: 45, f: "12\"", img: "https://i.discogs.com/f9-XFm8_U3Yqf8W0VfJ_x-5f_Xk=/fit-in/600x600/filters:strip_metadata():format(jpeg):mode_rgb():quality(90)/discogs-images/R-94008-1188406541.jpeg.jpg", d: "Walter Gibbons 12\" Mix. Copia impecable de la primera edición comercial en este formato." },
  { a: "Taana Gardner", t: "Heartbeat", l: "West End Records", y: "1981", g: "Boogie", p: 55, f: "12\"", img: "https://i.discogs.com/jE-099k7e3r9E-E-E-E/fit-in/600x600/filters:strip_metadata():format(jpeg):mode_rgb():quality(90)/discogs-images/R-48601-1335012345.jpeg.jpg", d: "Larry Levan Mix. El vinilo que hacía temblar las paredes del Garage. Subida de BPMs hipnótica." },
  { a: "Loleatta Holloway", t: "Love Sensation", l: "Gold Mind", y: "1980", g: "Disco", p: 38, f: "LP", img: "https://i.discogs.com/x-098y-09-E/fit-in/600x600/filters:strip_metadata():format(jpeg):mode_rgb():quality(90)/discogs-images/R-122-1144012345.jpeg.jpg", d: "LP original. Incluye el hit homónimo. Una joya del Soul-Disco orquestado por Dan Hartman." },
  { a: "D-Train", t: "You're The One For Me", l: "Prelude Records", y: "1981", g: "Boogie", p: 28, f: "12\"", img: "https://i.discogs.com/z-098y-09-E/fit-in/600x600/filters:strip_metadata():format(jpeg):mode_rgb():quality(90)/discogs-images/R-135-1144012345.jpeg.jpg", d: "François K Remix. Sintetizadores de vanguardia para la pista de baile neoyorquina de los 80." },
  { a: "Theo Parrish", t: "Moonlite", l: "Sound Signature", y: "1999", g: "Deep House", p: 65, f: "12\"", img: "https://i.discogs.com/a-098y-09-E/fit-in/600x600/filters:strip_metadata():format(jpeg):mode_rgb():quality(90)/discogs-images/R-1010-1241512345.jpeg.jpg", d: "Rareza de Detroit. Ritmos crudos, lo-fi y una selección de samples jazz que solo Theo sabe unir." },
  { a: "Moodymann", t: "Don't Be Misled", l: "KDJ", y: "1996", g: "Detroit House", p: 75, f: "12\"", img: "https://i.discogs.com/b-098y-09-E/fit-in/600x600/filters:strip_metadata():format(jpeg):mode_rgb():quality(90)/discogs-images/R-115-1144012345.jpeg.jpg", d: "Promo Copy. KDJ en su estado más puro. House con alma de disco negro y mucha suciedad analógica." },
  { a: "Rahaan", t: "Rahaan Edits Vol. 2", l: "Radar", y: "2006", g: "Edits", p: 25, f: "12\"", img: "https://i.discogs.com/c-098y-09-E/fit-in/600x600/filters:strip_metadata():format(jpeg):mode_rgb():quality(90)/discogs-images/R-112-1144012345.jpeg.jpg", d: "El maestro de Chicago diseccionando clásicos oscuros. Edición limitada para DJs." },
  { a: "First Choice", t: "Let No Man Put Asunder", l: "Salsoul Records", y: "1977", g: "Disco", p: 32, f: "12\"", img: "https://i.discogs.com/d-098y-09-E/fit-in/600x600/filters:strip_metadata():format(jpeg):mode_rgb():quality(90)/discogs-images/R-10020-1241512345.jpeg.jpg", d: "Shep Pettibone Mix. La base rítmica que dio origen al House. Vocal soul icónica." },
  { a: "Sharon Redd", t: "Can You Handle It", l: "Prelude Records", y: "1980", g: "Disco", p: 22, f: "12\"", img: "https://i.discogs.com/e-098y-09-E/fit-in/600x600/filters:strip_metadata():format(jpeg):mode_rgb():quality(90)/discogs-images/R-154-1144012345.jpeg.jpg", d: "Mezcla de François Kevorkian. Bajo funk demoledor y voces disco de alta fidelidad." },
  { a: "Loose Joints", t: "Pop Your Funk", l: "West End Records", y: "1980", g: "Avant-Garde", p: 85, f: "12\"", img: "https://i.discogs.com/f-098y-09-E/fit-in/600x600/filters:strip_metadata():format(jpeg):mode_rgb():quality(90)/discogs-images/R-168-1144012345.jpeg.jpg", d: "Arthur Russell desatado. Una pieza de coleccionista absoluta por su rareza y sonido único." },
  { a: "Joe Bataan", t: "The Bottle", l: "Salsoul Records", y: "1975", g: "Latin Disco", p: 35, f: "LP", img: "https://i.discogs.com/g-098y-09-E/fit-in/600x600/filters:strip_metadata():format(jpeg):mode_rgb():quality(90)/discogs-images/R-567-123456789.jpeg.jpg", d: "La versión definitiva del clásico de Gil Scott-Heron. Boogaloo encontrándose con el disco." },
  { a: "Ripple", t: "The Beat Goes On", l: "Salsoul Records", y: "1977", g: "Funk", p: 29, f: "12\"", img: "https://i.discogs.com/h-098y-09-E/fit-in/600x600/filters:strip_metadata():format(jpeg):mode_rgb():quality(90)/discogs-images/R-897-123456789.jpeg.jpg", d: "El groove infinito. Una pieza de baile que nunca falla en el Hub." },
  { a: "Instant Funk", t: "I Got My Mind Made Up", l: "Salsoul Records", y: "1978", g: "Funk Disco", p: 24, f: "12\"", img: "https://i.discogs.com/i-098y-09-E/fit-in/600x600/filters:strip_metadata():format(jpeg):mode_rgb():quality(90)/discogs-images/R-898-123456789.jpeg.jpg", d: "Versión maxi de 9 minutos. Bajo elástico y vientos de Philadelphia." },
  { a: "Sparque", t: "Let's Go Dancin'", l: "West End Records", y: "1981", g: "Boogie", p: 31, f: "12\"", img: "https://i.discogs.com/j-098y-09-E/fit-in/600x600/filters:strip_metadata():format(jpeg):mode_rgb():quality(90)/discogs-images/R-486-123456789.jpeg.jpg", d: "Club classic de New York. Producido por Milton Hamilton, mezcla de Larry Levan." },
  { a: "Carol Williams", t: "More", l: "Salsoul Records", y: "1976", g: "Disco", p: 21, f: "LP", img: "https://i.discogs.com/k-098y-09-E/fit-in/600x600/filters:strip_metadata():format(jpeg):mode_rgb():quality(90)/discogs-images/R-94009-123456789.jpeg.jpg", d: "La primera dama de Salsoul. Disco orquestal de primer nivel producido por Vincent Montana Jr." }
];

const generateUniqueRecords = (): VinylRecord[] => {
  const records: VinylRecord[] = [];
  const presses = ["(Original US Pressing)", "(White Label Promo)", "(Japanese Import w/ Obi)", "(Test Pressing)", "(French Distribution)", "(UK First Press)", "(Canadian Import)"];
  
  for (let i = 0; i < 150; i++) {
    const seed = DISCO_MASTER_LIST[i % DISCO_MASTER_LIST.length];
    const press = presses[Math.floor(i / DISCO_MASTER_LIST.length) % presses.length];
    
    // IMAGE LOGIC: 12" -> Label Sleeve | LP -> Album Artwork
    let finalCover = seed.img;
    if (seed.f === "12\"" && LABEL_SLEEVES[seed.l]) {
      finalCover = LABEL_SLEEVES[seed.l];
    }

    // STATUS LOGIC: 20% Sold out
    const isSold = i % 5 === 0;

    records.push({
      id: `disco_pg_${i + 1}`,
      sku: `MAT-DISCO-${3000 + i}`,
      artist: seed.a,
      title: `${seed.t} ${i >= DISCO_MASTER_LIST.length ? press : ""}`,
      slug: `${seed.a.toLowerCase().replace(/\s+/g, '-')}-${seed.t.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      label: seed.l,
      year: seed.y,
      format: seed.f,
      condition: i % 12 === 0 ? "Mint" : "NM",
      genre: seed.g,
      price: i % 8 === 0 ? seed.p + 20 : (i % 3 === 0 ? seed.p - 5 : seed.p), // Real market fluctuations
      stock: isSold ? 0 : 1,
      coverUrl: finalCover,
      discogsLink: "https://www.discogs.com/user/ACTIVISTA/collection",
      description: `${seed.d} Curado por el Hub Mat32. Ejemplar verificado en nuestro sistema Altec A7.`,
      sellerId: 's_mat32',
      status: isSold ? 'sold' : 'published',
      tags: [seed.g.toLowerCase(), 'paradise_garage', 'popsike_ref', seed.l.toLowerCase().replace(/\s+/g, '_')]
    });
  }
  return records;
};

export const MOCK_RECORDS: VinylRecord[] = generateUniqueRecords();

export const MOCK_POSTS: Post[] = [
  {
    id: 'p_1',
    type: 'POST',
    title: 'Popsike Archive: West End Rarities',
    slug: 'popsike-archive-west-end',
    author: 'mat32__',
    content: 'Hemos inyectado 150 piezas únicas de la era dorada. Desde prensas de Salsoul hasta acetatos de West End. #Disco #Audiophile #Popsike',
    imageUrl: "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/ac1a7472-de26-46de-37f3-7ec5509f5900/public",
    likes: 210,
    comments: [],
    timestamp: 'Hace 30 minutos',
    tags: ['#Popsike', '#RareGroove'],
    status: 'published'
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e_1',
    title: 'The Walter Gibbons Tribute',
    slug: 'walter-gibbons-tribute',
    date: getFutureDate(7),
    time: '21:00',
    location: 'Mat32 Ruzafa',
    description: 'Noche dedicada al hombre que inventó el 12\" single. Solo rarezas de Salsoul y Gold Mind.',
    category: 'Listening Session',
    imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800',
    attendees: 42,
    capacity: 50,
    price: 0,
    paidPrice: 15,
    ticketLink: '#',
    lineup: [MOCK_ARTISTS['soulman'], MOCK_ARTISTS['analog_digger']],
    vibe: ['Disco', 'Garage'],
    status: 'published',
    tags: ['#waltergibbons', '#disco']
  }
];

export const BAR_MENU: MenuCategory[] = [
  {
    title: 'COCTELERÍA DISCO',
    items: [
      { name: 'GIBBONS SOUR', price: '10,50', description: 'Bourbon, Limón, Clara de huevo y Bitters.', highlight: true },
      { name: 'SALSOUL RUM PUNCH', price: '9,50', description: 'Mix de rones, Fruta de la pasión y Lima.', highlight: true }
    ]
  },
  {
    title: 'VINYLS & DRINKS',
    items: [
      { name: 'VINO D.O VALENCIA', price: '4,50', highlight: true },
      { name: 'CERVEZA ARTESANA RUZAFA', price: '5,50', highlight: false }
    ]
  }
];

export const MOCK_SELECTORS: SelectorSubmission[] = [];
